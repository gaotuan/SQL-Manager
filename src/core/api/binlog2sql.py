from libs import baseview
from core.models import DatabaseList
from plugins.binlog2sql import Binlog2Sql
import logging
import os
import time
from django.conf import settings
from django.http import HttpResponse
from rest_framework.response import Response
import simplejson as json
import traceback
from django_q.tasks import async_task
from core.utils.extend_json_encoder import ExtendJSONEncoder


CUSTOM_ERROR = logging.getLogger('SqlManager.core.binlog2sql')

class Binlog2sql(baseview.BaseView):

    def get(self, request, args: str = None):
        None

    def post(self, request, args: str = None):
        data = request.data['data']
        db=DatabaseList.objects.filter(id=data['id']).first()
        num = 50 if data['analy_number'] == None else int(data['analy_number'])
        binlog2sql = Binlog2Sql()
        starttime = '' if data['start_date']=='' else (data['start_date']+' '+ ('00:00:00' if data['start_time'] == '' else  data['start_time']))
        stoptime =  '' if data['end_date']=='' else (data['end_date']+' '+ ('00:00:00' if data['end_time'] == '' else  data['end_time']))
        starttime=starttime.replace('/','-')
        stoptime=stoptime.replace('/','-')

        # 准备参数
        args = {"conn_options": fr"-h{db.ip} -u{db.username} -p'{db.password}' -P{db.port} ",
                "stop_never": False,
                "no-primary-key": data['is_pk'],
                "flashback": data['is_fk'],
                "back-interval": 0 if data['sleep_number'] ==None else int(data['sleep_number']),
                "start-file": data['start_file'],
                "start-position": 0 if data['start_pos'] ==None else int(data['start_pos']),
                "stop-file": data['end_file'],
                "stop-position": 0 if data['end_pos'] ==None else int(data['end_pos']),
                "start-datetime": starttime,
                "stop-datetime": stoptime,
                "databases": data['db_filter'],
                "tables": ' '.join(data['tab_filter']),
                "only-dml": data['is_only_dml'],
                "sql-type": ' '.join(data['ops_filter']),
                "instance": db
                }
        # flashback=True获取DML回滚语句
        result = {'status': 0, 'msg': 'ok', 'data': '','cnt':0}
        # 参数检查
        args_check_result = binlog2sql.check_args(args)
        if args_check_result['status'] == 1:
            return HttpResponse(status=500)
        # 参数转换
        cmd_args = binlog2sql.generate_args2cmd(args, shell=True)

        # 执行命令
        try:
            p = binlog2sql.execute_cmd(cmd_args, shell=True)
            # 读取前num行后结束
            rows = []
            n = 1
            for line in iter(p.stdout.readline, ''):
                if n <= num:
                    n = n + 1
                    row_info = {}
                    try:
                        row_info['sql'] = line.split('; #')[0] + ";"
                        row_info['binlog_info'] = line.split('; #')[1].rstrip('\"')
                    except IndexError:
                        row_info['sql'] = line
                        row_info['binlog_info'] = None
                    rows.append(row_info)
                else:
                    break
            if rows.__len__() == 0:
                # 判断是否有异常
                stderr = p.stderr.read()
                if stderr:
                    result['status'] = 1
                    result['msg'] = stderr
                    return HttpResponse(json.dumps(result), content_type='application/json')
            # 终止子进程
            p.kill()
            result['cnt'] = rows.__len__()
            result['data'] = rows
        except Exception as e:
            # logger.error(traceback.format_exc())
            result['status'] = 1
            result['msg'] = str(e)

        # 异步保存到文件
        if data['is_sync']:
            self.binlog2sql_file(args, request.user)
            # async_task(self.binlog2sql_file, args=args, user=request.user, timeout=-1, task_name=f'binlog2sql-{time.time()}')

        # 返回查询结果
        return HttpResponse(json.dumps(result, cls=ExtendJSONEncoder, bigint_as_string=True),
                            content_type='application/json')

    def binlog2sql_file(self,args, user):
        """
        用于异步保存binlog解析的文件
        :param args: 参数
        :param user: 操作用户对象，用户消息推送
        :return:
        """
        binlog2sql = Binlog2Sql()
        instance = args.get('instance')
        timestamp = int(time.time())
        path = os.path.join(settings.BASE_DIR, 'downloads/binlog2sql/')
        os.makedirs(path, exist_ok=True)
        if args.get('flashback'):
            filename = os.path.join(path, f"flashback_{instance.computer_room}_{instance.connection_name}_{timestamp}.sql")
        else:
            filename = os.path.join(path, f"{instance.computer_room}_{instance.connection_name}_{timestamp}.sql")

        # 参数转换
        cmd_args = binlog2sql.generate_args2cmd(args, shell=True)
        # 执行命令保存到文件
        with open(filename, 'w') as f:
            p = binlog2sql.execute_cmd(cmd_args, shell=True)
            for c in iter(p.stdout.readline, ''):
                f.write(c)
        return user, filename
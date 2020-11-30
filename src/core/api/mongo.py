from libs import con_database
from django.http import HttpResponse
import pymongo
import logging
import datetime
import re,json,ast
from bson import json_util
from rest_framework.response import Response
from libs import baseview
from core.models import Mongo_ops_log
from libs import  util
CUSTOM_ERROR = logging.getLogger('Yearning.core.views')

class  Mongo(baseview.BaseView):
    def get(self, request):
        None

    def post(self,request):
        try:
            data = request.data
            if data['mongo_text'] == 'test':
                try:
                    client = pymongo.MongoClient(data['mongo_url'])
                    db = client.test
                    databases = client.list_database_names()
                    if db:
                        return Response({'ok': 'Mongo连接测试,成功!！','databases':databases})
                    else:
                        return Response({'error': 'Mongo连接测试,失败！'})
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return Response({'error': 'Mongo连接测试失败:' + e.args[0]})
            elif data['mongo_text'] == 'get_collections':
                client = pymongo.MongoClient(data['mongo_url'])
                db_name = data['mongo_db']
                db = client[db_name]
                res1 = db.collection_names()
                if res1:
                    return Response({'data': res1})
                else:
                    return Response({'error': 'Mongo执行失败！'})

            else:
                try:
                    client = pymongo.MongoClient(data['mongo_url'])
                    db_name = data['mongo_db']
                    db = client[db_name]
                    res2 = []
                    a = 1
                    # 获取limit限制
                    un_init = util.init_conf()
                    limit_num = int(ast.literal_eval(un_init['other'])['limit'])
                    for i in data['mongo_text'].strip().split(';'):
                        if i =='':
                            continue
                        if i.strip()[0:1] == '#':
                            continue
                        query_check = self.query_check(sql=i.strip())
                        if query_check['bad_query'] == False:
                            sql = query_check['filtered_sql']
                            collect = db[sql.split('.')[0]]
                            match = re.compile(r'[(](.*)[)]', re.S)
                            sql = re.findall(match, sql)[0]

                            if sql != '':
                                sql = json.loads(sql)
                                result = collect.find(sql).limit(limit_num)
                            else:
                                result = collect.find().limit(limit_num)
                            rows = json.loads(json_util.dumps(result))
                            # if isinstance(rows, list):
                            #     rows = tuple([json.dumps(x, ensure_ascii=False)] for x in rows)


                            Mongo_ops_log.objects.get_or_create(
                                user=str(request.user),
                                mongo_instance='addr: ' + data['mongo_url'],
                                ops=i.strip(),
                                create_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                update_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                            )
                            res2.append('## result:%d ########################################################' %a)
                            res2.append(rows)
                            a = a + 1
                        else:
                            res2.append('## result:%d ########################################################' % a)
                            res2.append("""禁止执行该命令！正确格式为：{collection_name}.find() or {collection_name}.find(expression) 如 : 'test.find({"id":{"$gt":1.0}})'""")
                            a = a + 1


                    if res2:
                        return Response({'data': res2})
                    else:
                        return Response({'error': 'Mongo执行失败！'})
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return Response({'error': 'Mongo执行失败:' + e.args[0]})



        except Exception as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            return HttpResponse(status=500)

    def query_check(self, db_name=None, sql=''):
        """提交查询前的检查"""
        result = {'msg': '', 'bad_query': True, 'filtered_sql': sql, 'has_star': False}
        safe_cmd = ['find']
        sql = sql.split('.')[1]
        for cmd in safe_cmd:
            if re.match(fr'^{cmd}\(.*', sql.strip(), re.I):
                result['bad_query'] = False
                break
        if result['bad_query']:
            result['msg'] = """禁止执行该命令！正确格式为：{collection_name}.find() or {collection_name}.find(expression)""", \
                            """如 : 'test.find({"id":{"$gt":1.0}})'"""
        return result
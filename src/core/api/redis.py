from libs import con_database
from django.http import HttpResponse
import redis
import datetime
import logging
from rest_framework.response import Response
from libs import baseview
from core.models import Redis_ops_log
CUSTOM_ERROR = logging.getLogger('Yearning.core.views')


class  Redis(baseview.BaseView):
    def get(self, request):
        None

    def post(self,request):
        try:
            data = request.data
            if data['redis_text'] == 'test':
                try:
                    conn = redis.Redis(host=data['redis_host'], port=data['redis_port'], db=data['redis_db'], password=data['redis_pwd'],socket_connect_timeout=3)
                    rows = conn.execute_command('ping')
                    if rows:
                        return Response({'ok': 'Redis连接测试,成功！'})
                    else:
                        return Response({'error': 'Redis连接测试,失败！'})
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return Response({'error': 'Redis连接测试失败:' + e.args[0]})
            else:
                try:
                    conn = redis.Redis(host=data['redis_host'], port=data['redis_port'], db=data['redis_db'], password=data['redis_pwd'],socket_connect_timeout=3)
                    res2 = []
                    a = 1
                    for i in data['redis_text'].strip().split(';'):
                        if i =='':
                            continue
                        if i.strip()[0:1] == '#':
                            continue
                        rows = conn.execute_command(i)
                        Redis_ops_log.objects.get_or_create(
                            user=str(request.user),
                            redis_instance='addr: ' + data['redis_host'] + '  port: '+data['redis_port'] + '  port: ' + data['redis_db'],
                            ops=i.strip(),
                            create_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            update_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        )
                        res2.append('## result:%d ########################################################' %a)
                        res2.append(rows)
                        a = a + 1

                    if res2:
                        return Response({'data': res2})
                    else:
                        return Response({'error': 'Redis执行失败！'})
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return Response({'error': 'Redis执行失败:' + e.args[0]})



        except Exception as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            return HttpResponse(status=500)
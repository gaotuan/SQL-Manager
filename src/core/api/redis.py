from libs import con_database
from django.http import HttpResponse
import redis
import logging
from rest_framework.response import Response
from libs import baseview
from core.models import DatabaseList
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
                        res2.append('== res:%d =============================================================' %a)
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

    def get_data(self,_c,db=''):
        if db == '':
            sql = '''select '%s' room,'%s' instance_name,
                      EVENT_SCHEMA db,
                    EVENT_NAME name,
                    EVENT_DEFINITION body,
                 definer,
              execute_at,
          interval_value,
          interval_field,
                 created,
    LAST_ALTERED modified,
           last_executed,
                  starts,
                    ends,
                  status,
           on_completion,
                sql_mode,
    LAST_ALTERED comment,
               time_zone from information_schema.events;''' %(_c.computer_room,_c.connection_name)
        else:
            sql = '''select '%s' room,'%s' instance_name,
                              EVENT_SCHEMA db,
                            EVENT_NAME name,
                            EVENT_DEFINITION body,
                         definer,
                      execute_at,
                  interval_value,
                  interval_field,
                         created,
            LAST_ALTERED modified,
                   last_executed,
                          starts,
                            ends,
                          status,
                   on_completion,
                        sql_mode,
            LAST_ALTERED comment,
                       time_zone from information_schema.events where EVENT_SCHEMA='%s';''' % (_c.computer_room, _c.connection_name,db)


        try:
            with con_database.SQLgo(
                    ip=_c.ip,
                    password=_c.password,
                    user=_c.username,
                    port=_c.port        ) as f:
                data_set = f.search(sql=sql)
            return data_set
            # return simplejson.dumps(data_set, cls=DateEncoder, bigint_as_string=True)
        except Exception as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
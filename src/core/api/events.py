from libs import con_database
from django.http import HttpResponse
import simplejson
import datetime
import logging
from rest_framework.response import Response
from libs import baseview
from core.models import DatabaseList
CUSTOM_ERROR = logging.getLogger('Yearning.core.views')

class DateEncoder(simplejson.JSONEncoder):  # 感谢的凉夜贡献

    def default(self, o):
        if isinstance(o, datetime.datetime) or isinstance(o, datetime.date) or isinstance(o, datetime.time):
            return o.__str__()
        return simplejson.JSONEncoder.default(self, o)

class  Event(baseview.BaseView):
    def get(self, request):
        None

    def post(self,request):
        try:
            res_data=[]
            con_instance = DatabaseList.objects.filter(id=request.data['id']).first()
            data_set = self.get_data(con_instance,request.data['db'])
            for i in data_set['data']:
                res_data.append(i)
            total = len(res_data)
            res = {'data': res_data,'total': total}

            return HttpResponse(simplejson.dumps(res, cls=DateEncoder, bigint_as_string=True))
        except Exception as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            return HttpResponse(status=500)

    def get_data(self,_c,db=''):
        if db == '':
            sql = '''select '%s' room,'%s' instance_name,
                      db,
                    name,
                    body,
                 definer,
              execute_at,
          interval_value,
          interval_field,
                 created,
                modified,
           last_executed,
                  starts,
                    ends,
                  status,
           on_completion,
                sql_mode,
                 comment,
               time_zone from mysql.event;''' %(_c.computer_room,_c.connection_name)
        else:
            sql = '''select '%s' room,'%s' instance_name,
                        db,
                      name,
                      body,
                   definer,
                execute_at,
            interval_value,
            interval_field,
                   created,
                  modified,
             last_executed,
                    starts,
                      ends,
                    status,
             on_completion,
                  sql_mode,
                   comment,
                 time_zone from mysql.event where db='%s';''' % (_c.computer_room, _c.connection_name,db)


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
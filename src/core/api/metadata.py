
from django.http import HttpResponse
import simplejson
import datetime
import logging
from rest_framework.response import Response
from libs import baseview, serializers
from core.models import Db_metadata
CUSTOM_ERROR = logging.getLogger('Yearning.core.views')

class DateEncoder(simplejson.JSONEncoder):  # 感谢的凉夜贡献

    def default(self, o):
        if isinstance(o, datetime.datetime) or isinstance(o, datetime.date) or isinstance(o, datetime.time):
            return o.__str__()
        return simplejson.JSONEncoder.default(self, o)

class  Metadata(baseview.BaseView):
    def get(self, request):
        try:
            if request.GET.get('opt') == 't':
                mess = request.GET.get('mess')
                data = Db_metadata.objects.filter(table_name__contains=mess).all()
                ser = serializers.Db_metadata(data, many=True)
                return Response({'data': ser.data})

                # def default(o):
                #     if isinstance(o, datetime.timedelta):
                #         t = (datetime.datetime.min + o).time()
                #         return t.isoformat()
                #     if isinstance(o, datetime.datetime):
                #         return str(o.date()) + ' ' + str(o.time())
                #         # return o.isoformat()
                #
                # return HttpResponse(simplejson.dumps(data_res, cls=DateEncoder, bigint_as_string=True, default=default))
        except Exception as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            return Response({'error': e.args[0]})
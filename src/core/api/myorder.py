import logging
from libs import baseview, util
from core.models import SqlOrder
from django.http import HttpResponse
from rest_framework.response import Response

CUSTOM_ERROR = logging.getLogger('Yearning.core.views')


class order(baseview.BaseView):
    '''

    :argument 我的工单展示接口api

    '''

    def get(self, request, args: str = None):
        try:
            if request.GET.get('page') =='n':
                username = request.GET.get('user')
                mess = request.GET.get('mess')
                opt = request.GET.get('opt')
                if opt == 'u':
                    page_number = SqlOrder.objects.filter(username=username,text__contains=mess).count()
                    sql = (
                        f'select core_sqlorder.*,core_databaselist.connection_name,\n'
                        f'core_databaselist.computer_room from core_sqlorder INNER JOIN \n'
                        f'core_databaselist on core_sqlorder.bundle_id = core_databaselist.id \n'
                        f'WHERE core_sqlorder.username = %s  and core_sqlorder.text like %s \n'
                        f'ORDER BY core_sqlorder.id desc;')
                else:
                    page_number = SqlOrder.objects.filter(username=username, work_id__contains=mess).count()
                    sql = (
                        f'select core_sqlorder.*,core_databaselist.connection_name,\n'
                        f'core_databaselist.computer_room from core_sqlorder INNER JOIN \n'
                        f'core_databaselist on core_sqlorder.bundle_id = core_databaselist.id \n'
                        f'WHERE core_sqlorder.username = %s  and core_sqlorder.work_id like %s \n'
                        f'ORDER BY core_sqlorder.id desc;')

                info = SqlOrder.objects.raw(sql, [username,"%"+mess+"%"])
                data = util.ser(info)
                return Response({'page': page_number, 'data': data})
            else:
                try:
                    username = request.GET.get('user')
                    page = request.GET.get('page')
                except KeyError as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                else:
                    try:
                        page_number = SqlOrder.objects.filter(
                            username=username).count()
                        start = (int(page) - 1) * 20
                        end = int(page) * 20
                        info = SqlOrder.objects.raw(
                            "select core_sqlorder.*,core_databaselist.connection_name,\
                            core_databaselist.computer_room from core_sqlorder INNER JOIN \
                            core_databaselist on core_sqlorder.bundle_id = core_databaselist.id \
                            WHERE core_sqlorder.username = '%s'ORDER BY core_sqlorder.id DESC "
                            % username)[start:end]
                        data = util.ser(info)
                        return Response({'page': page_number, 'data': data})
                    except Exception as e:
                        CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                        return HttpResponse(status=500)
        except Exception as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            return HttpResponse(status=500)

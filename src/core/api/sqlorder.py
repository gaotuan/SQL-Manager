import logging
import json
from libs import baseview, util
from libs import call_inception
from core.task import submit_push_messages
from rest_framework.response import Response
from django.http import HttpResponse
from core.models import (
    DatabaseList,
    SqlOrder,Usermessage
)

CUSTOM_ERROR = logging.getLogger('Yearning.core.views')

conf = util.conf_path()
addr_ip = conf.ipaddress


class sqlorder(baseview.BaseView):
    '''

    :argument 手动模式工单提交相关接口api

    put   美化sql  测试sql

    post 提交工单

    '''

    def put(self, request, args=None):
        if args == 'beautify':
            try:
                data = request.data['data']
            except KeyError as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            else:
                try:
                    res = call_inception.Inception.BeautifySQL(sql=data)
                    return HttpResponse(res)
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return HttpResponse(status=500)

        elif args == 'test':
            try:
                id = request.data['id']
                base = request.data['base']
                sql = request.data['sql']
                sql = str(sql).strip('\n').strip().rstrip(';')
                data = DatabaseList.objects.filter(id=id).first()
                info = {
                    'host': data.ip,
                    'user': data.username,
                    'password': data.password,
                    'db': base,
                    'port': data.port
                }
            except KeyError as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            else:
                try:
                    with call_inception.Inception(LoginDic=info) as test:
                        res = test.Check(sql=sql)
                        return Response({'result': res, 'status': 200})
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return Response(e)

    def post(self, request, args=None):
        try:
            data = json.loads(request.data['data'])
            tmp = json.loads(request.data['sql'])
            user = request.data['user']
            type = request.data['type']
            id = request.data['id']
        except KeyError as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            return HttpResponse(status=500)
        else:
            self.commitorder(data,tmp,user,type,id)
            try:
                addinstances = request.data['addinstances']
                for instance in addinstances:
                    id = DatabaseList.objects.filter(connection_name=instance['connection_name'] , computer_room=instance['computer_room']).values('id').first()['id']
                    data['computer_room'] = instance['computer_room']
                    data['connection_name'] = instance['connection_name']
                    data['basename'] = instance['basename']
                    self.commitorder(data, tmp, user, type, id)


            except Exception as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                return HttpResponse(status=500)
            return Response('已提交，请等待管理员审核!')


    def commitorder(self,data,tmp,user,type,id):
        try:
            x = [x.rstrip(';') for x in tmp]
            sql = ';'.join(x)
            sql = sql.strip(' ').rstrip(';')
            workId = util.workId()
            SqlOrder.objects.get_or_create(
                username=user,
                date=util.date(),
                work_id=workId,
                status=2,
                basename=data['basename'],
                sql=sql,
                type=type,
                text=data['text'],
                backup=data['backup'],
                bundle_id=id,
                assigned=data['assigned'],
                delay=data['delay']
            )
            # 记录转发消息
            Usermessage.objects.create(
                from_user=user,
                time=util.date(),
                title='工单:' + workId + ' 提交通知',
                content=data['text'],
                to_user=data['assigned'],
                state='unread'
            )
            submit_push_messages(
                workId=workId,
                user=user,
                addr_ip=addr_ip,
                text=data['text'],
                assigned=data['assigned'],
                id=id
            ).start()
        except Exception as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            return HttpResponse(status=500)

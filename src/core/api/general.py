import json
import logging
import ast
from django.http import HttpResponse
from rest_framework.response import Response
from libs import baseview, con_database, util
from core.task import grained_permissions,forward_push_messages
from core.models import (
    DatabaseList,
    Account,
    grained,
    SqlOrder,
    SqlDictionary,
    querypermissions,sql_optimize_his,Usermessage
)
from libs.serializers import (
    Area,
    UserINFO,
    query_con,
    QueryPermissions,Sql_Optimize_His
)

CUSTOM_ERROR = logging.getLogger('Yearning.core.views')
conf = util.conf_path()
addr_ip = conf.ipaddress

class addressing(baseview.BaseView):
    '''

    :argument 连接名 库名 表名 字段名 索引名 api接口


    '''

    @grained_permissions
    def put(self, request, args=None):

        if args == 'connection':
            try:
                assigned = grained.objects.filter(username=request.user).first()
                last_query = querypermissions.objects.filter(username=request.user).order_by('-id').first()
                un_init = util.init_conf()
                custom_com = ast.literal_eval(un_init['other'])
                if request.data['permissions_type'] == 'user' or request.data['permissions_type'] == 'own_space':
                    info = DatabaseList.objects.all()
                    con_name = Area(info, many=True).data
                    dic = SqlDictionary.objects.all().values('Name')
                    dic.query.distinct = ['Name']

                # elif request.data['permissions_type'] == 'query':
                #     con_name = []
                #     permission_spec = grained.objects.filter(username=request.user).first()
                #     if permission_spec.permissions['query'] == '1':
                #         for i in permission_spec.permissions['querycon']:
                #             con_instance = DatabaseList.objects.filter(connection_name=i).first()
                #             if con_instance:
                #                 con_name.append(
                #                     {
                #                         'id': con_instance.id,
                #                         'connection_name': con_instance.connection_name,
                #                         'ip': con_instance.ip ,
                #                         'computer_room': con_instance.computer_room
                #                     })
                #     assigned = grained.objects.filter(username=request.user).first()
                #     return Response({'assigend': assigned.permissions['person'], 'connection': con_name,
                #                      'custom': custom_com['con_room']})
                else:
                    con_name = []
                    _type = request.data['permissions_type'] + 'con'
                    permission_spec = grained.objects.filter(username=request.user).first()
                    for i in permission_spec.permissions[_type]:
                        con_instance = DatabaseList.objects.filter(connection_name=i).first()
                        if con_instance:
                            con_name.append(
                                {
                                    'id': con_instance.id,
                                    'connection_name': con_instance.connection_name,
                                    'ip': con_instance.ip,
                                    'computer_room': con_instance.computer_room
                                })
                    dic = ''
                info = Account.objects.filter(group='admin').all()
                serializers = UserINFO(info, many=True)
                history = querypermissions.objects.filter(username=request.user).order_by('-id')[0:10]
                serializer_his = QueryPermissions(history, many=True)
                return Response(
                    {
                        'connection': con_name,
                        'person': serializers.data,
                        'history': serializer_his.data,
                        'dic': dic,
                        'assigend': assigned.permissions['person'],
                        'custom': custom_com['con_room'],
                        'multi': custom_com['multi'],
                        'limit_num': custom_com['limit'],
                        'last_query': ast.literal_eval(last_query.db_info) if last_query else {},
                        'last_sql': last_query.statements if last_query else ""
                    }
                )
            except Exception as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                return HttpResponse(status=500)
        elif args == 'optimizer':
            try:
                assigned = grained.objects.filter(username=request.user).first()
                last_query = sql_optimize_his.objects.filter(username=request.user).order_by('-id').first()
                un_init = util.init_conf()
                custom_com = ast.literal_eval(un_init['other'])
                if request.data['permissions_type'] == 'user' or request.data['permissions_type'] == 'own_space':
                    info = DatabaseList.objects.all()
                    con_name = Area(info, many=True).data
                    dic = SqlDictionary.objects.all().values('Name')
                    dic.query.distinct = ['Name']
                else:
                    con_name = []
                    _type = request.data['permissions_type'] + 'con'
                    permission_spec = grained.objects.filter(username=request.user).first()
                    for i in permission_spec.permissions[_type]:
                        con_instance = DatabaseList.objects.filter(connection_name=i).first()
                        if con_instance:
                            con_name.append(
                                {
                                    'id': con_instance.id,
                                    'connection_name': con_instance.connection_name,
                                    'ip': con_instance.ip,
                                    'computer_room': con_instance.computer_room
                                })
                    dic = ''
                info = Account.objects.filter(group='admin').all()
                serializers = UserINFO(info, many=True)
                history = sql_optimize_his.objects.filter(username=request.user).order_by('-id')[0:10]
                serializer_his = Sql_Optimize_His(history, many=True)
                return Response(
                    {
                        'connection': con_name,
                        'person': serializers.data,
                        'history': serializer_his.data,
                        'dic': dic,
                        'assigend': assigned.permissions['person'],
                        'custom': custom_com['con_room'],
                        'multi': custom_com['multi'],
                        'limit_num': custom_com['limit'],
                        'last_query': ast.literal_eval(last_query.db_info) if last_query else {},
                        'last_sql': last_query.statements if last_query else ""
                    }
                )
            except Exception as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                return HttpResponse(status=500)
        elif args == "basename":
            try:
                con_id = request.data['id']
            except KeyError as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                return HttpResponse(status=500)
            else:
                _connection = DatabaseList.objects.filter(id=con_id).first()
                try:
                    with con_database.SQLgo(
                            ip=_connection.ip,
                            user=_connection.username,
                            password=_connection.password,
                            port=_connection.port
                    ) as f:
                        res = f.basename()
                        return Response(res)
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return HttpResponse(status=500)

        elif args == "binlogs":
            try:
                con_id = request.data['id']
            except KeyError as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                return HttpResponse(status=500)
            else:
                _connection = DatabaseList.objects.filter(id=con_id).first()
                try:
                    with con_database.SQLgo(
                            ip=_connection.ip,
                            user=_connection.username,
                            password=_connection.password,
                            port=_connection.port
                    ) as f:
                        res = f.binlogs()
                        return Response(res)
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return HttpResponse(status=500)

        elif args == "table_names":
            try:
                con_id = request.data['id']
                db_name = request.data['db']
            except KeyError as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                return HttpResponse(status=500)
            else:
                _connection = DatabaseList.objects.filter(id=con_id).first()
                try:
                    with con_database.SQLgo(
                            ip=_connection.ip,
                            user=_connection.username,
                            password=_connection.password,
                            port=_connection.port,
                            db=db_name
                    ) as f:
                        res = f.table_names()
                        return Response(res)
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return HttpResponse(status=500)

        elif args == 'tablename':
            try:
                data = json.loads(request.data['data'])
                basename = data['basename']
                con_id = request.data['id']
            except KeyError as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            else:
                _connection = DatabaseList.objects.filter(id=con_id).first()
                try:
                    with con_database.SQLgo(
                            ip=_connection.ip,
                            user=_connection.username,
                            password=_connection.password,
                            port=_connection.port,
                            db=basename
                    ) as f:
                        res = f.tablename()
                        return Response(res)
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return HttpResponse(status=500)

        elif args == 'field':
            try:
                connection_info = json.loads(request.data['connection_info'])
                table = connection_info['tablename']
                basename = connection_info['basename']
                con_id = request.data['id']
            except KeyError as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            else:
                try:
                    _connection = DatabaseList.objects.filter(id=con_id).first()
                    with con_database.SQLgo(
                            ip=_connection.ip,
                            user=_connection.username,
                            password=_connection.password,
                            port=_connection.port,
                            db=basename
                    ) as f:
                        res = f.gen_alter(table_name=table)
                        return Response(res)
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return HttpResponse(status=500)

        elif args == 'indexdata':
            try:
                login = json.loads(request.data['login'])
                table = request.data['table']
                basename = login['basename']
                con_id = request.data['id']
            except KeyError as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            else:
                try:
                    _connection = DatabaseList.objects.filter(id=con_id).first()
                    with con_database.SQLgo(
                            ip=_connection.ip,
                            user=_connection.username,
                            password=_connection.password,
                            port=_connection.port,
                            db=basename
                    ) as f:
                        res = f.index(table_name=table)
                        return Response(res)
                except Exception as e:
                    CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                    return Response(e)
        elif args == 'binlog2sql':
            try:
                assigned = grained.objects.filter(username=request.user).first()
                un_init = util.init_conf()
                custom_com = ast.literal_eval(un_init['other'])
                if request.data['permissions_type'] == 'admin' :
                    info = DatabaseList.objects.all()
                    con_name = Area(info, many=True).data

                info = Account.objects.filter(group='admin').all()
                serializers = UserINFO(info, many=True)
                history = querypermissions.objects.filter(username=request.user).order_by('-id')[0:10]
                serializer_his = QueryPermissions(history, many=True)
                return Response(
                    {
                        'connection': con_name,
                        'person': serializers.data,
                        'assigend': assigned.permissions['person'],
                        'custom': custom_com['con_room'],
                    }
                )
            except Exception as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                return HttpResponse(status=500)



class ops(baseview.BaseView):
    '''
    :argument   sql查询接口, 过滤非查询语句并返回查询结果。
                可以自由limit数目 当limit数目超过配置文件规定的最大数目时将会采用配置文件的最大数目

    '''

    def post(self, request, args=None):

        try:
            if args == 'star':
                querypermissions.objects.filter(id=request.data['id']).update(is_love=1,alias=request.data['alias'])
                return HttpResponse({'ok': '1'})
            elif args == 'unstar':
                querypermissions.objects.filter(id=request.data['id']).update(is_love=0)
                return HttpResponse({'ok': '1'})
            elif args == 'fav':
                my = querypermissions.objects.filter(username=request.user , is_love=1 ).order_by('-id')
                serializer_my = QueryPermissions(my, many=True)
                return Response(
                    {
                        'data': serializer_my.data,
                        'len': len(my)
                    }
                )
            elif args == 'his':
                history = querypermissions.objects.filter(username=request.user).order_by('-id')[0:10]
                serializer_his = QueryPermissions(history, many=True)
                return Response(
                    {
                        'history': serializer_his.data
                    }
                )
            elif args == 'optimizer':
                history = sql_optimize_his.objects.filter(username=request.user).order_by('-id')[0:10]
                serializer_his = Sql_Optimize_His(history, many=True)
                return Response(
                    {
                        'history': serializer_his.data
                    }
                )
            elif args == 'get_assigned':
                gr = grained.objects.filter(username=request.data['username']).first()
                assignes= gr.permissions['person']
                return Response(
                    {
                        'assigned':  assignes
                    }
                )
            elif args == 'put_assigned':
                SqlOrder.objects.filter(id=request.data['id']).update(assigned=request.data['forward_assigne'])
                sqlorder = SqlOrder.objects.filter(id=request.data['id']).first()
                title = '工单:' + sqlorder.work_id + '转发通知'
                # 记录转发消息
                Usermessage.objects.create(
                    from_user=sqlorder.username,
                    time=util.date(),
                    title=title,
                    content=sqlorder.text,
                    to_user=sqlorder.assigned,
                    state='unread'
                )


                # 异步发送消息：
                forward_push_messages(
                    workId=sqlorder.work_id,
                    user=sqlorder.username,
                    addr_ip=addr_ip,
                    text=sqlorder.text,
                    assigned=sqlorder.assigned,
                    id=sqlorder.bundle_id
                ).start()
                return Response('put_assigned ok!'
                )
        except Exception as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            return Response({'error': e.args[1]})



    def put(self, request, args: str = None):
        return Response({'error': '已超过申请时限请刷新页面后重新提交申请'})

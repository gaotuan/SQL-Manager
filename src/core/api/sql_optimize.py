# -*- coding: UTF-8 -*-
"""
@author: gtt
@license: Apache Licence
@file: sql_optimize.py
@time: 20200426
"""
import sqlparse
from django.contrib.auth.decorators import permission_required
from django.http import HttpResponse
# from sql.plugins.soar import Soar
# from sql.plugins.sqladvisor import SQLAdvisor
from core.api.sql_tuning import SqlTuning,Instance
from rest_framework.response import Response
from libs import baseview, send_email, util
import json
import simplejson
import logging
import datetime
from core.models import sql_optimize_his
from django.http import HttpResponse
from rest_framework.response import Response
from libs import baseview, con_database, util
from core.models import DatabaseList, Account, querypermissions, query_order, globalpermissions

CUSTOM_ERROR = logging.getLogger('Yearning.core.views')
class DateEncoder(simplejson.JSONEncoder):  # 感谢的凉夜贡献

    def default(self, o):
        if isinstance(o, datetime.datetime) or isinstance(o, datetime.date) or isinstance(o, datetime.time):
            return o.__str__()
        return simplejson.JSONEncoder.default(self, o)

__author__ = 'gtt'

class sql_optimize(baseview.BaseView):
    '''
    :argument   sql查询接口, 过滤非查询语句并返回查询结果。
                可以自由limit数目 当limit数目超过配置文件规定的最大数目时将会采用配置文件的最大数目

    '''

    def post(self, request, args=None):
        if args == 'sql_tuning':
            try:
                address = json.loads(request.data['address'])
                sql = request.data['sql']
                dbname = address['basename']
                _c = DatabaseList.objects.filter(
                    connection_name=address['connection_name'],
                    computer_room=address['computer_room']
                ).first()
                option = ['sys_parm', 'sql_plan', 'obj_stat', 'sql_profile']
                ins = {'instance_name':'a', 'db_type':'mysql','host':_c.ip,'port':_c.port,'user':_c.username,'password':_c.password ,'charset':'utf8mb4'}
                instance = Instance(ins)
                sql_tunning = SqlTuning(instance=instance, db_name=dbname, sqltext=sql)
                result = {'status': 0, 'msg': 'ok', 'data': {}}
                if 'sys_parm' in option:
                    basic_information = sql_tunning.basic_information()
                    sys_parameter = sql_tunning.sys_parameter()
                    optimizer_switch = sql_tunning.optimizer_switch()
                    result['data']['basic_information'] = basic_information
                    result['data']['sys_parameter'] = sys_parameter
                    result['data']['optimizer_switch'] = optimizer_switch
                if 'sql_plan' in option:
                    plan, optimizer_rewrite_sql = sql_tunning.sqlplan()
                    result['data']['optimizer_rewrite_sql'] = optimizer_rewrite_sql
                    result['data']['plan'] = plan
                if 'obj_stat' in option:
                    result['data']['object_statistics'] = sql_tunning.object_statistics()
                if 'sql_profile' in option:
                    session_status = sql_tunning.exec_sql()
                    result['data']['session_status'] = session_status

                sql_optimize_his.objects.create(
                    work_id=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    username=request.user,
                    statements=sql,
                    db_info=address)
                # 关闭连接
                sql_tunning.engine.close()
                result['data']['sqltext'] = sql
                return HttpResponse(simplejson.dumps(result, cls=DateEncoder, bigint_as_string=True))
            except Exception as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                return Response({'error': e.args[1]})

#!/usr/bin/env python
#coding=utf-8
from libs import baseview
from aliyunsdkcore.client import AcsClient
import logging
from aliyunsdkrds.request.v20140815.DescribeSlowLogRecordsRequest import DescribeSlowLogRecordsRequest
from core.models import Database_metadata,CloudAccount
import  json
from rest_framework.response import Response
from django.http import HttpResponse
CUSTOM_ERROR = logging.getLogger('Yearning.core.views')

class Slowlog(baseview.BaseView):
    def get(self, request):
        None

    def post(self,request):
        try:
            data = request.data['data']
            self.get_parameter(data)
            return  Response(self.fetch(data))
        except Exception as e:
            CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
            return HttpResponse(status=500)

    def get_parameter(self,data):
        res = Database_metadata.objects.filter(dblist_id=data['id']).first()
        account_id = res.account_id
        data['rds_id'] = res.rds_id
        data['zone'] = res.ZoneId
        res = CloudAccount.objects.filter(cloud_account_origin_id=account_id).values('access_key_id','access_key_secret').first()
        data['access_key_id'] = res.get('access_key_id')
        data['access_key_secret'] = res.get('access_key_secret')
        starttime = '' if data['start_date']=='' else (data['start_date']+'T'+ ('00:00Z' if data['start_time'] == '' else  data['start_time']+"Z"))
        stoptime =  '' if data['end_date']=='' else (data['end_date']+'T'+ ('00:00Z' if data['end_time'] == '' else  data['end_time']+"Z"))
        data['starttime'] = starttime.replace('/','-')
        data['stoptime'] = stoptime.replace('/','-')


    def fetch(self,data):
        client = AcsClient(data['access_key_id'], data['access_key_secret'])
        request = DescribeSlowLogRecordsRequest()
        request.set_accept_format('json')

        request.set_DBInstanceId(data['rds_id'])
        request.set_StartTime(data['starttime'])
        request.set_EndTime(data['stoptime'])
        request.set_PageNumber(data['page_number'])
        request.set_PageSize(data['page_size'])
        if data['dbname'] != '':
            request.set_DBName(data['dbname'])

        response = client.do_action_with_exception(request)
        resp = json.loads(response)
        return resp
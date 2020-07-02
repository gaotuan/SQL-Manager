
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkcms.request.v20190101.DescribeMetricListRequest import DescribeMetricListRequest
import logging
CUSTOM_ERROR = logging.getLogger('Yearning.core.views')


def rds_metrics():
    import sys
    import os
    import django
    import json
    import time,datetime
    print("begin rds_metrics: " + datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))  # 日期格式化
    # 这两行很重要，用来寻找项目根目录，os.path.dirname要写多少个根据要运行的python文件到根目录的层数决定
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sys.path.append(BASE_DIR)

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settingConf.settings')
    django.setup()

    from core.models import CloudAccount,MetricMetaList,MetricList

    from aliyunsdkcore.client import AcsClient
    from aliyunsdkcore.acs_exception.exceptions import ClientException
    from aliyunsdkcore.acs_exception.exceptions import ServerException
    from aliyunsdkcms.request.v20190101.DescribeMetricListRequest import DescribeMetricListRequest
    try:
        accs = CloudAccount.objects.filter(is_delete='0').values('access_key_id','access_key_secret')
        metrics = MetricMetaList.objects.filter(is_delete='0').values('MetricName', 'Namespace')
        end_time = int(round(time.time() * 1000))
        start_time = int(round(time.time() * 1000))-3*60*1000


        for acc in  accs:
            client = AcsClient(acc.get('access_key_id'), acc.get('access_key_secret'))
            request = DescribeMetricListRequest()
            request.set_accept_format('json')

            for metric in metrics:
                request.set_MetricName(metric.get('MetricName'))
                request.set_Namespace(metric.get('Namespace'))
                request.set_StartTime(start_time)
                # request.set_EndTime(end_time)
                response = client.do_action_with_exception(request)
                res=json.loads(json.loads(response.decode('utf8'))['Datapoints'])
                instances=[]
                for  r in res:
                    r['MetricName'] = metric.get('MetricName')
                    instances.append(MetricList(**r))
                MetricList.objects.bulk_create(instances)
        print("done  rds_metrics: " + datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))  # 日期格式化
    except Exception as e:
        CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')


def main():
    rds_metrics()



if __name__ == "__main__":
    # execute only if run as a script
    main()
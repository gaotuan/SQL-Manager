import copy
import json
import time
import logging
from datetime import datetime
from datetime import time as dtime
from datetime import timedelta
import requests
from django.db import DatabaseError
from django.utils import timezone
from django.utils.timezone import make_aware
from requests import Response, Session
from core.models import globalpermissions

CUSTOM_ERROR = logging.getLogger('Yearning.core.views')

setting = globalpermissions.objects.filter(authorization='global').first()

APP_ID = dict(setting.message).get('fs_app_id')
APP_SECRET = dict(setting.message).get('fs_app_secret')
APP_VERIFICATION_TOKEN = dict(setting.message).get('fs_app_token')


TOKEN_URL = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/"

BASE_URL = "https://open.feishu.cn/open-apis/contact/v1/"


s = Session()


cache_token = {}



def get_chat_id():
    token = 'Bearer ' + get_tenant_access_token()
    headers = {'Content-Type': 'application/json', 'Authorization': token}
    url = 'https://open.feishu.cn/open-apis/chat/v4/list?page_size=20&page_token=1530027865231834600'
    r = requests.get(url, headers=headers)
    data = r.json()
    return data


def send_msg(msg,user):
    '''
    发送信息
    :return:
    post
    '''
    try:
        user_id = get_by_iphone_email(user)
        url = f'https://open.feishu.cn/open-apis/message/v4/send/'
        token = 'Bearer ' + get_tenant_access_token()
        headers = {'Content-Type': 'application/json', 'Authorization': token}
        content = {
            "user_id": user_id,
            "msg_type": "text",
            "content": {"text": msg}
        }

        content = json.dumps(content)
        requests.post(url, content, headers=headers)
        return True
    except Exception as e:
        CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
        return False

def get_tenant_access_token():
    token = cache_token.get('token')
    timestamp = cache_token.get('timestamp')

    now = time.time()
    if token and timestamp and timestamp > now:
        return token

    headers = {"Content-Type": "application/json"}
    req_body = {"app_id": APP_ID, "app_secret": APP_SECRET}

    req: Response = requests.post(TOKEN_URL, json=req_body, headers=headers)

    req.raise_for_status()
    token = req.json().get('tenant_access_token')
    expire = req.json().get('expire', 0)
    cache_token['token'] = token
    # token有效期为2小时，这里提前10分钟过期
    cache_token['timestamp'] = time.time() + expire - 600
    return token



def get_userid(user_name):
    token = 'Bearer ' + get_tenant_access_token()
    headers = {'Content-Type': 'application/json', 'Authorization': token}
    url = 'https://open.feishu.cn/open-apis/search/v1/user?query='+user_name + '&page_size=20&page_token=20'
    r = requests.get(url, headers=headers)
    data=r.json()
    return data

def get_str_time(timestamp):
    return datetime.fromtimestamp(timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S')

def get_dep_info():
    url = f"https://open.feishu.cn/open-apis/contact/v1/scope/get"
    token = 'Bearer ' + get_tenant_access_token()
    headers = {'Content-Type': 'application/json', 'Authorization': token}
    r = requests.get(url, headers=headers)
    data = r.json()
    print(data)
    return data
def get_name_by_user_id(user_id):
    # Todo 需要缓存
    url = f'https://open.feishu.cn/open-apis/contact/v1/user/batch_get?employee_ids={user_id}'

    token = 'Bearer ' + get_tenant_access_token()
    headers = {'Content-Type': 'application/json', 'Authorization': token}
    r = requests.get(url, headers=headers)
    data = r.json()
    info = data.get('data', {}).get('user_infos')
    if info:
        return info[0].get('name')
    return user_id

def get_by_iphone_email(dict):

    if dict.get('mail') is not None:
        flag = 'emails=' + dict.get('mail')
        if dict.get('phone') is not None:
            flag = flag + '&mobiles='+ dict.get('phone')
    else:
        if dict.get('phone') is not None:
            flag = 'mobiles='+ dict.get('phone')

    try:
        url = f'https://open.feishu.cn/open-apis/user/v1/batch_get_id?' + flag
        token = 'Bearer ' + get_tenant_access_token()
        headers = {'Content-Type': 'application/json', 'Authorization': token}
        r = requests.get(url, headers=headers)

        data = r.json()
        info = data.get('data')
        user_id = set()
        for s in info.values():
            if len(s) == 0:
                continue
            for a in s.values():
                 user_id.add(a[0].get('user_id'))
        return user_id.pop()
    except Exception as e:
        CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')

if __name__ == "__main__":

    user = {'mail': 'tuantuan.gao@quvideo.com'}
    msg = f'工单执行通知\n'\
          '工单编号:202007091747390691\n'\
          '发起人:ye.yang@quvideo.com\n'\
          '审核人:高湍湍'\
          '地址:sqlaudit.quvideo.com'\
          '工单备注:增加享乐配置'\
          '状态:已执行'\
          '备注:美东-common_data 工单执行完成，请核对！'
    send_msg(msg,user)
# {'code': 0, 'msg': 'success', 'data': {'mobile_users': {'15138670506': [{'open_id': 'ou_67b41fbe127b895c3442814574337257', 'user_id': '333aa34f'}]}}}
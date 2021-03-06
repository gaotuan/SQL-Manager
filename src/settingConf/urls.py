'''
url table
'''
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from core.api.sqldic import (
    adminpremisson,
    exportdoc,
    dictionary,
    downloadFile
)
from core.api.user import (
    userinfo,
    generaluser,
    authgroup,
    ldapauth,
    login_auth
)
from core.api.dashboard import (
    dashboard,
    messages
)
from core.api.managerdb import (
    management_db,
    dingding
)
from core.api.auditorder import (
    audit,
    del_order
)
from core.api.record import (
    record_order,
    order_detail
)
from core.api.applygrained import (
    audit_grained,
    apply_grained
)
from core.api.sqlorder import sqlorder
from core.api.serachsql import search, query_worklf, Query_order
from core.api.binlog2sql import Binlog2sql
from core.api.events import Event
from core.api.redis import Redis
from core.api.mongo import Mongo
from core.api.metadata import Metadata
from core.api.redis_faina import Redis_faina
from core.api.slowlog import Slowlog
from core.api.osc import osc_step
from core.api.myorder import order
from core.api.gensql import gen_sql
from core.api.general import addressing,ops
from core.api.setting import *
from core.api.sql_optimize import sql_optimize

urlpatterns = [
    url(r'^api/v1/setting/(.*)', setting_view.as_view()),
    url(r'^api/v1/binlog2sql', Binlog2sql.as_view()),
    url(r'^api/v1/slowlog', Slowlog.as_view()),
    url(r'^api/v1/event', Event.as_view()),
    url(r'^api/v1/redis_faina', Redis_faina.as_view()),
    url(r'^api/v1/redis', Redis.as_view()),
    url(r'^api/v1/mongo', Mongo.as_view()),
    url(r'^api/v1/query_order', Query_order.as_view()),
    url(r'^api/v1/query_worklf', query_worklf.as_view()),
    url(r'^api/v1/userinfo/(.*)', userinfo.as_view()),
    url(r'^api/v1/audit_grained/(.*)', audit_grained.as_view()),
    url(r'^api/v1/sql_optimeze/(.*)', sql_optimize.as_view()),
    url(r'^api/v1/apply_grained', apply_grained.as_view()),
    url(r'^api/v1/workorder/(.*)', addressing.as_view()),
    url(r'^api/v1/myorder', order.as_view()),
    url(r'^api/v1/gensql/(.*)', gen_sql.as_view()),
    url(r'^api/v1/management_db/(.*)', management_db.as_view()),
    url(r'^api/v1/audit_sql', audit.as_view()),
    url(r'^api/v1/db_metadata', Metadata.as_view()),
    url(r'^api/v1/sqldic/(.*)', dictionary.as_view()),
    url(r'^api/v1/auth_twice', authgroup.as_view()),
    url(r'^api/v1/sqlsyntax/(.*)', sqlorder.as_view()),
    url(r'^api/v1/adminsql/(.*)', adminpremisson.as_view()),
    url(r'^api/v1/record/(.*)', record_order.as_view()),
    url(r'^api/v1/homedata/(.*)', dashboard.as_view()),
    url(r'^api/v1/messages/(.*)', messages.as_view()),
    url(r'^api/v1/otheruser/(.*)', generaluser.as_view()),
    url(r'^api/v1/exportdocx/', exportdoc.as_view()),
    url(r'^api/v1/dingding', dingding.as_view()),
    url(r'^api/v1/detail', order_detail.as_view()),
    url(r'^api/v1/search', search.as_view()),
    url(r'^api/v1/ldapauth', ldapauth.as_view()),
    url(r'^api/v1/undoOrder', del_order.as_view()),
    url(r'^api/v1/osc/(.*)', osc_step.as_view()),
    url(r'^api/v1/download', downloadFile),
    url(r'^api-token-auth/', login_auth.as_view()),
    url(r'^api/v1/ops/(.*)', ops.as_view()),

]
urlpatterns = format_suffix_patterns(urlpatterns)

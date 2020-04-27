# -*- coding: UTF-8 -*-

import time
from core.utils.const import SQLTuning
import logging
from core.utils.engines import get_engine
from rest_framework.response import Response
from core.utils.sql_utils import extract_tables
CUSTOM_ERROR = logging.getLogger('SqlManager.core.sql_tuning')
import re

class SqlTuning(object):
    def __init__(self, instance, db_name, sqltext):
        query_engine = get_engine(instance=instance)
        self.engine = query_engine
        self.db_name = db_name
        self.sqltext = sqltext
        self.sql_variable = '''
        select
          lower(variable_name) variable_name,
          variable_value
        from performance_schema.global_variables
        where upper(variable_name) in ('%s')
        order by variable_name;''' % ('\',\''.join(SQLTuning.SYS_PARM_FILTER))
        self.sql_optimizer_switch = '''
        select variable_value
        from performance_schema.global_variables
        where upper(variable_name) = 'OPTIMIZER_SWITCH';
        '''
        self.sql_table_info = '''
        select
          table_name,
          engine,
          row_format                                           as format,
          table_rows,
          avg_row_length                                       as avg_row,
          round((data_length + index_length) / 1024 / 1024, 2) as total_mb,
          round((data_length) / 1024 / 1024, 2)                as data_mb,
          round((index_length) / 1024 / 1024, 2)               as index_mb
        from information_schema.tables
        where table_schema = '%s' and table_name = '%s'
        '''
        self.sql_table_index = '''
        select
          table_name,
          index_name,
          non_unique,
          seq_in_index,
          column_name,
          collation,
          cardinality,
          nullable,
          index_type
        from information_schema.statistics
        where table_schema = '%s' and table_name = '%s'
        order by 1, 3;    
        '''

    def is_number(self, num):
        pattern = re.compile(r'^[-+]?[-0-9]\d*\.\d*|[-+]?\.?[0-9]\d*$')
        result = pattern.match(num)
        if result:
            return True
        else:
            return False

    def __extract_tables(self):
        """获取sql语句中的表名"""
        return [i['name'].strip('`') for i in extract_tables(self.sqltext)]

    def basic_information(self):
        return self.engine.query(sql="select @@version", close_conn=False).to_sep_dict()

    def sys_parameter(self):
        # 获取mysql版本信息
        server_version = self.engine.server_version
        if server_version < (5, 7, 0):
            sql = self.sql_variable.replace('performance_schema', 'information_schema')
        else:
            sql = self.sql_variable
        return self.engine.query2(sql=sql, close_conn=False,cursorclass='pymysql.cursors.DictCursor')

    def optimizer_switch(self):
        # 获取mysql版本信息
        server_version = self.engine.server_version
        if server_version < (5, 7, 0):
            sql = self.sql_optimizer_switch.replace('performance_schema', 'information_schema')
        else:
            sql = self.sql_optimizer_switch
        aa = self.engine.query(sql=sql, close_conn=True)
        res = []
        a = aa.rows[0][0].split(',')
        for v in a:
            b = v.split('=')
            dic = {'v_name':b[0],'v_value':b[1]}
            res.append(dic)
        return res

    def sqlplan(self):
        plan = self.engine.query2(db_name=self.db_name, sql="explain " + self.sqltext, close_conn=False,cursorclass='pymysql.cursors.DictCursor')
        optimizer_rewrite_sql = self.engine.query(sql="show warnings", close_conn=False).to_sep_dict()
        return plan, optimizer_rewrite_sql

    # 获取关联表信息存在缺陷，只能获取到一张表
    def object_statistics(self):
        object_statistics = []
        for index, table_name in enumerate(self.__extract_tables()):
            object_statistics.append({
                "structure": self.engine.query(
                    db_name=self.db_name, sql=f"show create table `{table_name}`;",
                    close_conn=False).to_sep_dict(),
                "table_info": self.engine.query(
                    sql=self.sql_table_info % (self.db_name, table_name),
                    close_conn=False).to_sep_dict(),
                "index_info": self.engine.query(
                    sql=self.sql_table_index % (self.db_name, table_name),
                    close_conn=False).to_sep_dict()
            })
        return object_statistics

    def exec_sql(self):
        result = {"EXECUTE_TIME": 0,
                  "session": {},
                  "PROFILING_DETAIL": {},
                  "PROFILING_SUMMARY": {'column_list': [], 'rows': []}
                  }
        sql_profiling = """select concat(upper(left(variable_name,1)),
                            substring(lower(variable_name),
                            2,
                            (length(variable_name)-1))) var_name,
                            variable_value var_value 
                        from performance_schema.session_status order by 1"""

        # 获取mysql版本信息
        server_version = self.engine.server_version
        if server_version < (5, 7, 0):
            sql = sql_profiling.replace('performance_schema', 'information_schema')
        else:
            sql = sql_profiling
        self.engine.query(sql="set profiling=1", close_conn=False).to_sep_dict()
        records = self.engine.query(sql="select ifnull(max(query_id),0) from INFORMATION_SCHEMA.PROFILING",
                                    close_conn=False).to_sep_dict()
        query_id = records['rows'][0][0] + 3  # skip next sql
        # 获取执行前信息
        bb = self.engine.query(sql=sql, close_conn=False).to_sep_dict()

        # 执行查询语句,统计执行时间
        t_start = time.time()
        self.engine.query(sql=self.sqltext, close_conn=False).to_sep_dict()
        t_end = time.time()
        cost_time = "%5s" % "{:.4f}".format(t_end - t_start)
        result['EXECUTE_TIME'] = cost_time

        # 获取执行后信息
        aa = self.engine.query(sql=sql, close_conn=False).to_sep_dict()

        # 获取PROFILING_DETAIL信息
        result['PROFILING_DETAIL'] = self.engine.query2(
            sql="select STATE,DURATION,CPU_USER,CPU_SYSTEM,BLOCK_OPS_IN,BLOCK_OPS_OUT ,MESSAGES_SENT ,MESSAGES_RECEIVED ,PAGE_FAULTS_MAJOR ,PAGE_FAULTS_MINOR ,SWAPS from INFORMATION_SCHEMA.PROFILING where query_id=" + str(
                query_id) + " order by seq", close_conn=False,cursorclass='pymysql.cursors.DictCursor')
        result['PROFILING_SUMMARY'] = self.engine.query2(
            sql="SELECT STATE,SUM(DURATION) AS Total_R,ROUND(100*SUM(DURATION)/(SELECT SUM(DURATION) FROM INFORMATION_SCHEMA.PROFILING WHERE QUERY_ID=" + str(
                query_id) + "),2) AS Pct_R,COUNT(*) AS Calls,SUM(DURATION)/COUNT(*) AS R_Call FROM INFORMATION_SCHEMA.PROFILING WHERE QUERY_ID=" + str(
                query_id) + " GROUP BY STATE ORDER BY Total_R DESC", close_conn=False,cursorclass='pymysql.cursors.DictCursor')

        # 处理执行前后对比信息
        session = []
        b = bb['rows']
        a = aa['rows']
        len = b.__len__()
        for i in range (len):
            dict = {'v_name': '', 'bef': '', 'aft': '', 'diff': ''}
            dict['v_name'] = a[i][0]
            dict['aft'] = a[i][1] if a[i][1]  else 0
            dict['bef'] = b[i][1] if b[i][1]  else 0
            if a[i][1] is not '' and self.is_number(str(dict['aft'])):
                dict['diff'] = float(float(a[i][1]) - float(b[i][1]))
            session.append(dict)

        result['session'] = session
        return result


    def opt_parameter(self):
        # 获取mysql执行计划参数
        server_version = self.engine.server_version
        if server_version < (5, 7, 0):
            sql = self.sql_optimizer_switch.replace('performance_schema', 'information_schema')
        else:
            sql = self.sql_optimizer_switch
        res = []
        a = self.get_connection.search(sql=sql)['data'][0]['v_name'].split(',')
        for v in a:
            b = v.split('=')
            dic = {'v_name':b[0],'v_value':b[1]}
            res.append(dic)
        return res


class Instance(object):
    def __init__(self, instance):
        self.instance_name = instance['instance_name']
        self.db_type = instance['db_type']
        self.host = instance['host']
        self.port = instance['port']
        self.user = instance['user']
        self.password = instance['password']
        self.charset = instance['charset']


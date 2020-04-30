# -*- coding: UTF-8 -*-
"""
@author: gtt
@license: Apache Licence
@file: binglog2sql.py
@time: 2020/04/23
"""
from core.utils.config import SysConfig
from plugins.plugin import Plugin
from libs import util
import ast
__author__ = 'gtt'


class Binlog2Sql(Plugin):

    def __init__(self):
        un_init = util.init_conf()
        custom_com = ast.literal_eval(un_init['other'])
        self.path = custom_com['Binlog2sql']
        self.required_args = []
        self.disable_args = []
        super(Plugin, self).__init__()

    def generate_args2cmd(self, args, shell):
        """
        转换请求参数为命令行
        :param args:
        :param shell:
        :return:
        """
        conn_options = ['conn_options']
        parse_mode_options = ['stop-never', 'no-primary-key', 'flashback']
        range_options = ['back-interval', 'start-file', 'start-position', 'stop-file', 'stop-position',
                         'start-datetime', 'stop-datetime']
        filter_options = ['databases', 'tables', 'only-dml', 'sql-type']
        if shell:
            cmd_args = f'python {self.path}' if self.path else ''
            for name, value in args.items():
                if name in conn_options:
                    cmd_args += f' {value}'
                elif name in parse_mode_options and value:
                    cmd_args += f' --{name}'
                elif name in range_options and value:
                    cmd_args += f" --{name}='{value}'"
                elif name in filter_options and value:
                    if name == 'only-dml':
                        cmd_args += f' --{name}'
                    else:
                        cmd_args += f' --{name} {value}'
        else:
            cmd_args = [self.path]
            for name, value in args.items():
                if name in conn_options:
                    cmd_args.append(f'{value}')
                elif name in parse_mode_options:
                    cmd_args.append(f'--{name}')
                elif name in range_options:
                    cmd_args.append(f'--{name}')
                    cmd_args.append(f'{value}')
                elif name in filter_options:
                    cmd_args.append(f'--{name}')
                    cmd_args.append(f'{value}')
        return cmd_args


import logging
CUSTOM_ERROR = logging.getLogger('Yearning.core.views')
import os
from libs import con_database
import django
import json
import time, datetime


def metadata():
    print("begin metadata: " + datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))  # 日期格式化
    # 这两行很重要，用来寻找项目根目录，os.path.dirname要写多少个根据要运行的python文件到根目录的层数决定
    # BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    # sys.path.append(BASE_DIR)

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settingConf.settings')
    django.setup()
    from core.models import DatabaseList,Db_metadata,MetricList,grained
    from django.db import connection


    try:
        databases = DatabaseList.objects.all()
        cursor = connection.cursor()
        cursor.execute('truncate table  {0} ;'.format(Db_metadata._meta.db_table))
        for database in  databases:
            print("begin:" + str(database.id) +":"+ database.connection_name)
            try:
                with con_database.SQLgo(
                        ip=database.ip,
                        user=database.username,
                        password=database.password,
                        port=database.port
                ) as f:
                    with f.con.cursor() as cursor:
                        sqllist = "select TABLE_SCHEMA,TABLE_NAME ,CREATE_TIME,TABLE_COMMENT from information_schema.tables where table_schema not in('sys','test','information_schema','performance_schema');"
                        cursor.execute(sqllist)
                        result = cursor.fetchall()

                        for i in result:
                            Db_metadata.objects.create(connection_name=database.computer_room,computer_room=database.connection_name,db_name=i[0],table_name=i[1],create_time=i[2],table_comment=i[3])
            except Exception as e:
                CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
                print("Error  metadata: " + database.connection_name + ":" +datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') + f'{e.__class__.__name__}: {e}')  # 日期格式化
        print("done  metadata: " + datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))  # 日期格式化
    except Exception as e:
        CUSTOM_ERROR.error(f'{e.__class__.__name__}: {e}')
        print("Error  metadata: " + f'{e.__class__.__name__}: {e}')  # 日期格式化



def main():
    metadata()



if __name__ == "__main__":
    # execute only if run as a script
    main()
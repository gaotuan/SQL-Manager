# SQL审核平台

![](https://img.shields.io/badge/build-release-brightgreen.svg)  
![](https://img.shields.io/badge/version-v1.2.0-brightgreen.svg)  
![](https://img.shields.io/badge/vue.js-2.5.0-brightgreen.svg) 
![](https://img.shields.io/badge/iview-2.8.0-brightgreen.svg?style=flat-square) 
![](https://img.shields.io/badge/python-3.6-brightgreen.svg)
![](https://img.shields.io/badge/Django-2.0-brightgreen.svg)

##### 基于Inception的企业级web Yearning的二次开发  SQL审核平台。

## SQL Manager新增功能
- SQL查询
    - 实际公司需求查询线上数据 有查询权限即可 无需查询申请
    - 添加查询历史 
    - 添加sql收藏 
    - 查询耗时
    - 自动填充最后一次sql的执行信息
    - 可以从查询历史，我的收藏等地方直接执行sql
    - 查询报错到审计
    - 数据清理任务查询
    - 阿里云慢查询日志
- SQL优化
    - 基于profiling的优化
    - 其他第三方优化功能
- 工具
    - 基于binlog2sql界面操作 
    - SQL优化
- redis操作
    - redis常用命令
    - redis faina,利用monitor生成热点key、top命令等功能
- 用户管理
    - 添加用户密码有效期
    - 用户密码复杂度校验
- 消息
    - 增加飞书消息
    - 用户密码到期提醒
        


#### Yearing Feature 功能

- 数据库字典自动生成
- SQL查询
    - 查询工单 
    - 导出
    - 自动补全，智能提示 
- SQL可视化自动生成
    - 索引语句自动生成
    - DDL语句自动生成
- SQL审核
    - 流程化工单
    - SQL语句检测
    - SQL语句执行
    - SQL回滚
    - 历史审核记录
    - 查询语句审计
- 推送
    - 站内信工单通知
    - E-mail工单推送
    - 钉钉webhook机器人工单推送
- 其他
    - todoList
    - LDAP登陆   
- 用户权限及管理
    - 拼图式权限划分(共12项独立权限,可随意组合)

## Environment 环境

- Python 3.6

- Vue.js 2.5

- Django 2.0

## Install 安装及使用日志

详细安装步骤请访问[www.yearning.io](http://yearning.io)获得帮助

[使用及安装文档](http://supermancookie.com/Yearning-document/)


  
## About 联系方式
   
   QQ:279264044
   
   E-mail: 
 
## 注意
1、使用原始inception时要替换connection.py和cursor.py文件
2、redis-faina地址：git clone https://github.com/Instagram/redis-faina.git

## License

- Apache 2.0

2018 © Cookie



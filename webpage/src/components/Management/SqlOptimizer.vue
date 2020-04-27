<style lang="less">
  @import '../../styles/common.less';
  @import 'component/table.less';
</style>

<template>
  <div>
    <Row>
      <Col span="4">
        <Card >
          <p slot="title">
            <Icon type="ios-redo"></Icon>
            选择数据库
          </p>
          <div class="edittable-test-con">
            <div id="showImage" class="margin-bottom-10">

              <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="70">
                <FormItem label="机房:" prop="computer_room">
                  <Select ref="computer_room_ref" v-model="formItem.computer_room" @on-change="Connection_Name" placeholder="请选择机房">
                    <Option v-for="i in datalist.computer_roomlist" :key="i" :value="i">{{i}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="连接名:" prop="connection_name">
                  <Select ref="connection_name_ref" v-model="formItem.connection_name" @on-change="DataBaseName" filterable >
                    <Option v-for="i in datalist.connection_name_list" :value="i.connection_name"
                            :key="i.connection_name">{{ i.connection_name }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem label="库名:" prop="basename">
                  <Select ref="basename_ref" v-model="formItem.basename" filterable @on-change="ChangeDB">
                    <Option v-for="item in datalist.basenamelist" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </FormItem>
                <Alert  type="error" style="height: 250px">
                  提示信息：
                <template slot="desc">
                  <p>1.下拉框没有需要查询的DB时，联系DBA申请查询权限</p>
                  <p>2.select没有使用limit时，默认会自动添加limit {{ limit_num }} 的限制</p>
                  <p>3.select limit N,当N大于{{ limit_num }}时，自动替换为limit {{ limit_num }}</p>
                  <p>4.文本框有多条SQL时，只执行最后一条</p>
                  <p>5.所有的<b>查询、导出</b>操作，均会记录到审计日志</p>
                </template>
              </Alert>
              </Form>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="20" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="ios-crop-strong"></Icon>填写sql语句
          </p>
          <b>当前选择的库:{{ formItem.basename }}</b>
          <br>
          <b>优化工具:</b>
          <Select v-model="selectopt" style="width:150px;high:10xp"  size="small">
            <Option v-for="item in optList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <editor v-model="formItem.textarea" @init="editorInit"></editor>
          <br>
          <Button type="error" icon="trash-a" @click.native="ClearForm()">清除</Button>
          <Button type="info" icon="paintbucket" @click.native="beautify()">美化</Button>
          <Button type="success" icon="ios-redo" :loading="this.load" :disabled="this.validate_gen" @click.native="Exec_sql">获取SQL优化建议</Button>
          <br>
          <br>
            <template>
              <Tabs type="card"   v-model="select_tab"  @on-click="Refresh_his">
                  <TabPane label="优化历史"  :key="1" name="his">
                    <Table border stripe :columns="this.his_cols" :data="this.his_res" highlight-row ref="table"></Table>
                  </TabPane>
                  <TabPane v-for="tab in tabs" :key="tab.key" :label="tab.title">
                    <Table border stripe :columns="tab.col" :data="tab.data" highlight-row ref="table"></Table>
                  </TabPane>
              </Tabs>
            </template>
          <br>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  import ICol from '../../../node_modules/iview/src/components/grid/col.vue'
  import axios from 'axios'
  import util from '../../libs/util'

  export default {
    components: {
      ICol,
      editor: require('../../libs/editor')
    },
    name: 'OnlineQuery',
    data () {
      return {
        v_col: [
          {
          title: '参数名',
            key: 'v_name'
        },
          {
            title: '值',
            key: 'v_value'
          }],
        v3_col: [],
        v4_col: [{
          title: '参数名',
            key: 'v_name'
        },
          {
            title: '执行前',
            key: 'bef'
          },
        {
            title: '执行后',
            key: 'aft'
          },
          {
            title: '差值',
            key: 'diff'
          }],
        v1_res: [],
        v2_res: [],
        v3_res: [],
        v4_res: [],
        tabs: [],
        selectopt: 'MySQLTuning',
        optList: [
                    {
                        value: 'SQLAdvisor',
                        label: 'SQLAdvisor'
                    },
                    {
                        value: 'SOAR',
                        label: 'SOAR'
                    },
                    {
                        value: 'MySQLTuning',
                        label: 'MySQLTuning'
                    }
                ],
        sql_alias: '',
        sql_id: '',
        load: false,
        select_tab: 'his',
        his_cols: [
          {
            title: '操作',
            key: 'action',
            width: 120,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                  h('Tooltip', {
                  props: {
                    content: '加载相关信息'
                  }
                }, [
                  h('Button', {
                    props: {
                      size: 'small',
                      type: 'success'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => { this.Load_sql(params.row) }
                    }
                  }, '加载')
                  ])
                ])
            }
          },
                    {
                        title: 'SQL语句',
                        key: 'statements'
                    },
                    {
                        title: '机房:连接名:DB名',
                        key: 'dbinfo',
                        render: (h, params) => {
                return h('div', [
                  h('leb', '机房:' + params.row.db_info['computer_room'] + ' 连接名:' + params.row.db_info['connection_name'] + ' DB名:' + params.row.db_info['basename'])
                ])
            }
                    },
                    {
                        title: '执行时间',
                        key: 'work_id',
                        width: 150
                    }

      ],
        his_res: [],
        my_res: [],
        my_tmp_res: [],
        my_pagenumber: 1,
        data1: [],
        validate_gen: false,
        formItem: {
          textarea: '',
          computer_room: '',
          connection_name: '',
          basename: '',
          text: '',
          backup: '0',
          assigned: '',
          delay: 0
        },
        columnsName: [],
        Testresults: [],
        allsearchdata: [],
        item: {},
        datalist: {
          connection_name_list: [],
          basenamelist: [],
          sqllist: [],
          computer_roomlist: []
        },
        ruleValidate: {
          computer_room: [{
            required: true,
            message: '机房地址不得为空',
            trigger: 'change'
          }],
          connection_name: [{
            required: true,
            message: '连接名不得为空',
            trigger: 'change'
          }],
          basename: [{
            required: true,
            message: '数据库名不得为空',
            trigger: 'change'
          }]
        },
        id: null,
        assigned: [],
        put_info: {
          basename: '',
          connection_name: '',
          computer_room: ''
        },
        pagenumber: 1
      }
    },
    methods: {
      splice_arr (page) {
        this.Testresults = this.allsearchdata.slice(page * 10 - 10, page * 10)
      },
      splice_my (page) {
        this.my_tmp_res = this.my_res.slice(page * 10 - 10, page * 10)
      },
      Getbasename (vl) {
        for (let i of this.data1[0].children) {
          for (let c of i.children) {
            if (c.title === vl[0].title && c.nodeKey === vl[0].nodeKey) {
              this.put_info.basename = i.title
            }
          }
        }
        axios.put(`${util.url}/search`, {'base': this.put_info.basename, 'table': vl[0].title})
          .then(res => {
            if (res.data['error']) {
              util.err_notice(res.data['error'])
            } else {
              this.columnsName = res.data['title']
              this.allsearchdata = res.data['data']
              this.Testresults = this.allsearchdata.slice(0, 10)
              this.total = res.data['len']
            }
          })
      },
      editorInit: function () {
        require('brace/mode/mysql')
        require('brace/theme/xcode')
      },
      beautify () {
        axios.put(`${util.url}/sqlsyntax/beautify`, {
          'data': this.formItem.textarea
        })
          .then(res => {
            this.formItem.textarea = res.data
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      Connection_Name (val) {
        this.datalist.connection_name_list = []
        this.datalist.basenamelist = []
        this.formItem.connection_name = ''
        this.formItem.basename = ''
        if (val) {
          this.ScreenConnection(val)
          this.put_info.computer_room = val
        }
      },
      ScreenConnection (val) {
        this.datalist.connection_name_list = this.item.filter(item => {
          if (item.computer_room === val) {
            return item
          }
        });
      },
      DataBaseName (index) {
        if (index) {
          this.put_info.connection_name = index
          this.id = this.item.filter(item => {
            if (item.connection_name === index) {
              return item
            }
          })
          axios.put(`${util.url}/workorder/basename`, {
            'id': this.id[0].id
          })
            .then(res => {
              this.datalist.basenamelist = res.data
            })
            .catch(() => {
              util.err_notice('无法连接数据库!请检查网络')
            })
        }
      },
      ClearForm () {
        this.formItem.textarea = ''
      },
      Load_sql (index) {
        this.tabs = []
        this.select_tab = 'res'
        this.validate_gen = false
        this.formItem.textarea = index.statements
        this.beautify()
        // let a = this.his_res[index].db_info
        // this.formItem.computer_room = JSON.parse(a.replace(/'/g, '"'))['computer_room']
        setTimeout(() => {
        this.formItem.computer_room = index.db_info['computer_room']
          }, 100)
        setTimeout(() => {
        this.formItem.connection_name = index.db_info['connection_name']
          }, 200)
        setTimeout(() => {
            this.formItem.basename = index.db_info['basename']
          }, 300)
      },
      Exec_sql () {
        this.beautify()
        this.validate_gen = true
        this.tabs = []
        let address = {
          'basename': this.formItem.basename,
          'connection_name': this.formItem.connection_name,
          'computer_room': this.formItem.computer_room
        }
        this.$refs['formItem'].validate((valid) => {
          if (valid) {
            if (Object.keys(this.formItem.textarea).length === 0) {
              this.$Message.error('SQL内容不能为空!')
              this.validate_gen = false
              return
            }
            axios.post(`${util.url}/sql_optimeze/sql_tuning`, {
              'sql': this.formItem.textarea,
              'address': JSON.stringify(address)
            }).then(res => {
              this.validate_gen = false
              this.load = false
            if (res.data['error']) {
              this.$Message.error(res.data['error'])
              util.err_notice(res.data['error'])
            } else {
              this.validate_gen = false
              this.tabs = [{title: '系统参数', key: '1', col: [], data: []},
                            {title: '优化器参数', key: '2', col: [], data: []},
                            {title: '执行计划', key: '3', col: [], data: []},
                            {title: '回话值', key: '4', col: [], data: []},
                            {title: 'Profile Detail', key: '5', col: [], data: []},
                            {title: 'Profile Summary', key: '6', col: [], data: []}
                          ]
              this.tabs[0].col = res.data['data']['sys_parameter']['title']
              this.tabs[0].data = res.data['data']['sys_parameter']['data']
              this.tabs[1].col = this.v_col
              this.tabs[1].data = res.data['data']['optimizer_switch']
              this.tabs[2].col = res.data['data']['plan']['title']
              this.tabs[2].data = res.data['data']['plan']['data']
              this.tabs[3].col = this.v4_col
              this.tabs[3].data = res.data['data']['session_status']['session']
              this.tabs[4].col = res.data['data']['session_status']['PROFILING_DETAIL']['title']
              this.tabs[4].data = res.data['data']['session_status']['PROFILING_DETAIL']['data']
              this.tabs[5].col = res.data['data']['session_status']['PROFILING_SUMMARY']['title']
              this.tabs[5].data = res.data['data']['session_status']['PROFILING_SUMMARY']['data']
              this.Refresh_his()
            }
          })
            .catch(error => {
              this.validate_gen = false
              util.err_notice('Error:', error)
          })
          } else {
            this.validate_gen = false
            this.$Message.error('请选择相关的数据库!')
          }
        }
      )
      },
      Refresh_his () {
        axios.post(`${util.url}/ops/optimizer`)
            .then(res => {
            if (res.data['error']) {
              util.err_notice(res.data['error'])
            } else {
              this.his_res = res.data['history']
            }
          })
            .catch(error => {
              util.err_notice('Error:', error)
          })
      }
    },
    mounted () {
       axios.put(`${util.url}/workorder/optimizer`, {'permissions_type': 'query'})
        .then(res => {
          this.item = res.data['connection']
          this.assigned = res.data['assigend']
          this.his_res = res.data['history']
          this.datalist.computer_roomlist = res.data['custom']
          this.limit_num = res.data['limit_num']
          this.formItem.computer_room = res.data['last_query']['computer_room'];
          // this.$refs.computer_room_ref.$emit('on-change', res.data['last_query']['computer_room']);
          // this.$emit('on-change', value)
          setTimeout(() => {
            this.formItem.connection_name = res.data['last_query']['connection_name'];
            // this.$refs.connection_name_ref.$emit('on-change', res.data['last_query']['connection_name']);
          }, 200)
          setTimeout(() => {
            this.formItem.basename = res.data['last_query']['basename'];
          }, 400)
          setTimeout(() => {
            this.formItem.textarea = res.data['last_sql'];
          }, 600)
        })
        .catch(error => {
          this.$Message.error('没有权限请联系管理员！')
          util.err_notice(error)
        })
    }
  }
</script>

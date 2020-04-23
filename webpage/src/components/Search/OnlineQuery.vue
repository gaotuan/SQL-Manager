<style lang="less">
  @import '../../styles/common.less';
  @import 'components/table.less';
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
          <editor v-model="formItem.textarea" @init="editorInit"></editor>
          <br>
          <Button type="error" icon="trash-a" @click.native="ClearForm()">清除</Button>
          <Button type="info" icon="paintbucket" @click.native="beautify()">美化</Button>
          <Button type="warning" icon="ios-download" :disabled="this.validate_exp" @click.native="exportdata()" v-if="export_data">导出查询数据</Button>
          <Button type="primary" icon="ios-cloud-download" :disabled="this.validate_gen" @click.native="Search_sql('1')" >执行计划 </Button>
          <Button type="success" icon="ios-redo" :loading="this.load" :disabled="this.validate_gen" @click.native="Search_sql('2')">查询</Button>
          <br>
          <br>
            <template>
              <Tabs type="card" closable  v-model="select_tab"  @on-click="MyFavite">
                  <TabPane label="查询历史"  :key="1" name="his">
                    <Table border stripe :columns="this.his_cols" :data="this.his_res" highlight-row ref="table"></Table>
                  </TabPane>
                 <TabPane label="我的收藏" :key="2"  :closable="false" name="fav">
                    <Table border stripe :columns="this.his_cols" :data="this.my_tmp_res" highlight-row ref="table"></Table>
                    <Page :total="my_total" show-total  show-elevator @on-change="splice_my"  :page-size="10"  ref="totol"></Page>
                 </TabPane>
                  <TabPane label="查询耗时" :key="3">SQL执行耗时: {{ this.query_time }} s</TabPane>
                  <TabPane label="查询结果" :key="4" :closable="false" name="res">
                    <Table border stripe :columns="columnsName" :data="Testresults" highlight-row ref="table"></Table>
                    <Page :total="total" show-total  show-elevator @on-change="splice_arr"  :page-size="10"  ref="totol"></Page>
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
  import Csv from '../../../node_modules/iview/src/utils/csv'
  import ExportCsv from '../../../node_modules/iview/src/components/table/export-csv'

  const exportcsv = function exportCsv (params) {
    if (params.filename) {
      if (params.filename.indexOf('.csv') === -1) {
        params.filename += '.csv'
      }
    } else {
      params.filename = 'table.csv'
    }

    let columns = []
    let datas = []
    if (params.columns && params.data) {
      columns = params.columns
      datas = params.data
    } else {
      columns = this.columns
      if (!('original' in params)) params.original = true
      datas = params.original ? this.data : this.rebuildData
    }

    let noHeader = false
    if ('noHeader' in params) noHeader = params.noHeader
    const data = Csv(columns, datas, params, noHeader)
    if (params.callback) params.callback(data)
    else ExportCsv.download(params.filename, data)
  }
  export default {
    components: {
      ICol,
      editor: require('../../libs/editor')
    },
    name: 'OnlineQuery',
    data () {
      return {
        load: false,
        query_time: 0,
        select_tab: 'his',
        his_cols: [
          {
            title: '操作',
            key: 'action',
            width: 120,
            align: 'center',
            render: (h, params) => {
              if (params.row.is_love === 0) {
                return h('div', [
                  h('Tooltip', {
                  props: {
                    content: '添加收藏'
                  }
                }, [
                  h('Button', {
                    props: {
                      size: 'small',
                      icon: 'ios-star-outline'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => { this.Star(params.row) }
                    }
                  }, '')
                  ]),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.Exe_sql(params.index)
                      }
                    }
                  }, '查询')
                ])
              } else {
            return h('div', [
                  h('Tooltip', {
                    props: {
                      content: '取消收藏'
                    }
                  },
                    [h('Button', {
                    props: {
                      size: 'small',
                      icon: 'ios-star'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.Unstar(params.row)
                      }
                    }
                  }, '')
                  ]),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.Exe_sql(params.index)
                      }
                    }
                  }, '查询')
                ])
              }
            }
          },
                    {
                        title: 'SQL语句',
                        key: 'statements'
                    },
                    {
                        title: '执行时间',
                        key: 'work_id',
                        width: 150
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
                        title: 'id',
                        key: 'id',
                        width: 60
                    }
      ],
        his_res: [],
        my_res: [],
        my_tmp_res: [],
        my_pagenumber: 1,
        data1: [],
        validate_exp: true,
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
        export_data: true,
        limit_num: '',
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
      ChangeDB (v) {
        // this.formItem.basename = v
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
      exportdata () {
        this.$refs['formItem'].validate((valid) => {
          if (valid) {
            true
          } else {
            this.$Message.error('请先执行SQL语句!')
          }
        })
        exportcsv({
          filename: 'SQL审核_Data',
          original: false,
          data: this.allsearchdata,
          columns: this.columnsName
        })
      },
      Search_sql (v) {
        setTimeout(() => {
          this.columnsName = []
          this.Testresults = []
        }, 200)

        let address = {
          'basename': this.formItem.basename,
          'connection_name': this.formItem.connection_name,
          'computer_room': this.formItem.computer_room
        }
        this.Testresults = ''
        this.columnsName = ''
        this.allsearchdata = ''
        this.select_tab = 'res'
        this.validate_gen = true
        this.load = true
        this.validate_exp = true
        this.$refs['formItem'].validate((valid) => {
          if (valid) {
            let Vsql = '';
            if (Object.keys(this.formItem.textarea).length === 0) {
              this.$Message.error('SQL内容不能为空!')
              this.validate_gen = false
              return
            }
            if (v === '2') {
              Vsql = this.formItem.textarea;
            } else {
               Vsql = 'explain ' + this.formItem.textarea;
            }
            axios.post(`${util.url}/search`, {
              'sql': Vsql,
              'address': JSON.stringify(address)
            }).then(res => {
              this.load = false
              this.validate_gen = false
            if (res.data['error']) {
              this.$Message.error(res.data['error'])
              util.err_notice(res.data['error'])
            } else {
              this.validate_exp = false
              this.query_time = res.data['query_time']
              this.columnsName = res.data['title']
              this.allsearchdata = res.data['data']
              this.Testresults = this.allsearchdata.slice(0, 10)
              this.total = res.data['len']
              this.pagenumber = this.total / 10
            }
          })
            .catch(error => {
              this.load = false
              this.validate_gen = false
              util.err_notice(error)
          })
          } else {
            this.$Message.error('请选择相关的数据库!')
          }
        })
    },
      Exe_sql (index) {
        this.columnsName = []
        this.Testresults = []
        this.allsearchdata = []
        this.select_tab = 'res'
        this.validate_gen = true
        this.validate_exp = true
        this.load = true
        this.formItem.textarea = this.his_res[index].statements
        this.beautify()
        // let a = this.his_res[index].db_info
        // this.formItem.computer_room = JSON.parse(a.replace(/'/g, '"'))['computer_room']
        setTimeout(() => {
        this.formItem.computer_room = this.his_res[index].db_info['computer_room']
          }, 100)
        setTimeout(() => {
        this.formItem.connection_name = this.his_res[index].db_info['connection_name']
          }, 200)
        setTimeout(() => {
            this.formItem.basename = this.his_res[index].db_info['basename']
          }, 300)
        // this.formItem.basename = this.his_res[index].db_info['basename']
        this.$refs['formItem'].validate((valid) => {
          if (valid) {
            if (Object.keys(this.formItem.textarea).length === 0) {
              this.$Message.error('SQL内容不能为空!')
              this.validate_gen = false
              return
            }
            axios.post(`${util.url}/search`, {
              'sql': this.formItem.textarea,
              'address': JSON.stringify(this.his_res[index].db_info)
            }).then(res => {
              this.validate_gen = false
              this.load = false
            if (res.data['error']) {
              this.$Message.error(res.data['error'])
              util.err_notice(res.data['error'])
            } else {
              this.validate_exp = false
              this.query_time = res.data['query_time']
              this.columnsName = res.data['title']
              this.allsearchdata = res.data['data']
              this.Testresults = this.allsearchdata.slice(0, 10)
              this.total = res.data['len']
              this.pagenumber = this.total / 10
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
      Star (index) {
        axios.post(`${util.url}/ops/star`, {
              'id': index.id
        }).then(res => {
            if (res.data['error']) {
              util.err_notice('SQL收藏 失败')
            } else {
              util.notice('SQL收藏 成功')
            }
          })
        setTimeout(() => {
          this.Refresh_his()
          this.Refresh_my()
          }, 200)
      },
      Unstar (index) {
        axios.post(`${util.url}/ops/unstar`, {
              'id': index.id
        }).then(res => {
            if (res.data['error']) {
              util.err_notice('取消SQL收藏 失败')
            } else {
              util.notice('取消SQL收藏 成功')
            }
          })
        setTimeout(() => {
          this.Refresh_his()
          this.Refresh_my()
          }, 200)
      },
      MyFavite (name) {
        if (name === 'fav') {
          this.Refresh_my()
        }
        if (name === 'his') {
          this.Refresh_his()
        }
      },
      Refresh_my () {
            axios.post(`${util.url}/ops/fav`)
            .then(res => {
            if (res.data['error']) {
              util.err_notice(res.data['error'])
            } else {
              this.my_res = res.data['data']
              this.my_tmp_res = this.my_res.slice(0, 10)
              this.my_total = res.data['len']
              this.my_pagenumber = this.my_total / 10
            }
          })
            .catch(error => {
              util.err_notice('Error:', error)
          })
      },
      Refresh_his () {
        axios.post(`${util.url}/ops/his`)
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
       axios.put(`${util.url}/workorder/connection`, {'permissions_type': 'query'})
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

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
                  <Select ref="basename_ref" v-model="formItem.basename" filterable @on-change="GetTables">
                    <Option v-for="item in datalist.basenamelist" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </FormItem>
                <Card style="height: 200px; overflow: auto;background-color: #FDECE8; font-size: 10px" >
                  <b>提示信息:</b>
                  <p>1.下拉框没有需要查询的DB时，联系DBA申请查询权限</p>
                  <p>2.select没有使用limit时，默认会自动添加limit {{ limit_num }} 的限制</p>
                  <p>3.select limit N,当N大于{{ limit_num }}时，自动替换为limit {{ limit_num }}</p>
                  <p>4.文本框有多条SQL时，只执行最后一条</p>
                  <p>5.所有的<b>查询、导出</b>操作，均会记录到审计日志</p>
                </Card>
              </Form>
            </div>
            <Card style="height: 300px; overflow: auto" >
            <Tree :data="this.tables" @empty-text="数据加载中"></Tree>
            </Card>
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
                    <Table border stripe :columns="this.my_cols" :data="this.my_tmp_res" highlight-row ref="table"></Table>
                    <Page :total="my_total" show-total  show-elevator @on-change="splice_my"  :page-size="10"  ref="totol"></Page>
                 </TabPane>
                  <TabPane label="查询耗时" :key="3">SQL执行耗时: {{ this.query_time }} s</TabPane>
                  <TabPane label="查询结果" :key="4" :closable="false" name="res">
                    <Table border stripe :columns="columnsName" :data="this.res_format_data" highlight-row ref="table"></Table>
                    <Page :total="total" show-total  show-elevator @on-change="splice_arr"  :page-size="10"  ref="totol"></Page>
                  </TabPane>
              </Tabs>
              <Modal v-model="editstar" :closable='true' :mask-closable=true :width="400">
                <h3 slot="header" style="color:#2D8CF0">输入SQL备注:</h3>
                <Form :label-width="45" label-position="center">
                  <FormItem label="备注:">
                    <Input v-model="sql_alias"></Input>
                  </FormItem>
                </Form>
                <div slot="footer">
                  <Button type="text" @click="editstar=false">取消</Button>
                  <Button type="warning" @click="putalias">确认</Button>
                </div>
              </Modal>
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
        editstar: false,
        sql_alias: '',
        sql_id: '',
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
                        this.Exe_sql(params.row)
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
                        this.Exe_sql(params.row)
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
                    // ,
                    // {
                    //     title: 'id',
                    //     key: 'id',
                    //     width: 60
                    // }
      ],
        his_res: [],
        my_cols: [
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
                        this.Exe_sql(params.row)
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
                        this.Exe_sql(params.row)
                      }
                    }
                  }, '查询')
                ])
              }
            }
          },
                    {
                        title: '描述',
                        key: 'alias',
                        width: 150
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
                    // ,
                    // {
                    //     title: 'id',
                    //     key: 'id',
                    //     width: 60
                    // }
      ],
        my_res: [],
        my_tmp_res: [],
        my_pagenumber: 1,
        res_format_data: [],
        sql_display: 50,
        tmp_col: [
          {
          title: '操作',
            key: 'op',
            width: 70,
            fixed: 'left',
            align: 'center',
            render: (h, params) => {
              if (String(this.res_format_data[params.index]['op']) === '0') {
                return h('div', [
                  h('Tooltip', {
                  props: {
                    content: '展开完整sql'
                  }
                }, [
                  h('Button', {
                    props: {
                      size: 'small',
                      icon: 'plus-round'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => { this.Sql_full(params.index) }
                    }
                  }, '')
                  ])
                ])
              } else {
            return h('div', [
                  h('Tooltip', {
                    props: {
                      content: '收缩sql'
                    }
                  },
                    [h('Button', {
                    props: {
                      size: 'small',
                      icon: 'minus-round'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => { this.Sql_format(params.index) }
                    }
                  }, '')
                  ])
                ])
              }
            }

        }],
        data1: [],
        validate_exp: true,
        validate_gen: false,
        tables: [{
          title: '表列表:',
          expand: true,
          children: []
        }],
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
      Sql_full (v) {
        setTimeout(() => {
          for (var ite in this.Testresults[v]) {
               this.res_format_data[v][ite] = this.Testresults[v][ite]
            }
          this.res_format_data[v]['op'] = '1'
                  }, 100)
      },
      Sql_format (v) {
        setTimeout(() => {
          for (var ite in this.Testresults[v]) {
             if (this.Testresults[v][ite] !== null && this.Testresults[v][ite].length > this.sql_display) {
               this.res_format_data[v][ite] = this.Testresults[v][ite].substr(0, this.sql_display) + '...'
             } else {
               this.res_format_data[v][ite] = this.Testresults[v][ite]
             }
            }
          this.res_format_data[v]['op'] = '0'
                  }, 100)
      },
      splice_arr (page) {
        this.Testresults = this.allsearchdata.slice(page * 10 - 10, page * 10)
        this.Format_dis(this.Testresults)
      },
      splice_my (page) {
        this.my_tmp_res = this.my_res.slice(page * 10 - 10, page * 10)
      },
      GetTables () {
        this.tables[0]['children'] = []
        if (this.formItem.basename === '') {
          return
        }
        // setTimeout(() => {
          axios.put(`${util.url}/workorder/table_names`, {
            'id': this.id[0].id,
            'db': this.formItem.basename
          })
            .then(res => {
              for (var i in res.data) {
              var NewDic = {}
              NewDic['title'] = String(res.data[i])
                this.tables[0]['children'].push(NewDic)
              }
            })
            .catch(() => {
              util.err_notice('无法连接数据库!请检查网络')
            })
        // }, 200)
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
              this.Format_col(res.data['title'])
              this.allsearchdata = res.data['data']
              this.Testresults = this.allsearchdata.slice(0, 10)
              this.Format_dis(this.Testresults)
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
              'address': JSON.stringify(index.db_info)
            }).then(res => {
              this.validate_gen = false
              this.load = false
            if (res.data['error']) {
              this.$Message.error(res.data['error'])
              util.err_notice(res.data['error'])
            } else {
              this.validate_exp = false
              this.query_time = res.data['query_time']
              this.Format_col(res.data['title'])
              this.allsearchdata = res.data['data']
              this.Testresults = this.allsearchdata.slice(0, 10)
              this.Format_dis(this.Testresults)
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
      putalias () {
        this.editstar = false
        axios.post(`${util.url}/ops/star`, {
              'id': this.sql_id,
              'alias': this.sql_alias
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
      Star (index) {
        this.sql_id = index.id
        this.editstar = true
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
      Format_dis (v) {
        var NewArr = []
        for (var dict in v) {
           var NewDic = {}
           for (var ite in v[dict]) {
             if (v[dict][ite] !== null && v[dict][ite].length > this.sql_display) {
               NewDic[ite] = v[dict][ite].substr(0, this.sql_display) + '...'
             } else {
               NewDic[ite] = v[dict][ite]
             }
            }
           NewDic['op'] = 0
        NewArr.push(NewDic)
        }
        this.res_format_data = NewArr
      },
      Format_col (v) {
        this.columnsName = this.tmp_col.concat(v)
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
          this.sql_display = res.data['sql_display']
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

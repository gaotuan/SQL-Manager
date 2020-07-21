<style lang="less">
  @import '../../styles/common.less';
  @import 'components/table.less';
</style>

<template>
  <div>
    <Row>
      <Col span="4">
        <Card style="width: 210px;">
          <p slot="title">
            <Icon type="gear-b"></Icon>
            操作选项
          </p>
          <div class="edittable-test-con" >
            <div id="showImage" class="margin-bottom-10" >

              <Form ref="formItem" :model="formItem" :rules="ruleValidate" style="width: 170px;">
                <FormItem label="机房:" prop="computer_room" style="width: 170px; margin-bottom:-10px; margin-top:-10px">
                  <Select  size="small" ref="computer_room_ref" v-model="formItem.computer_room" @on-change="Connection_Name" placeholder="请选择机房" style="margin-bottom:-5px; margin-top:-30px">
                    <Option v-for="i in datalist.computer_roomlist" :key="i" :value="i">{{i}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="实例名:" prop="connection_name" style="margin-bottom:-10px; margin-top:-20px">
                  <Select size="small"  ref="connection_name_ref" v-model="formItem.connection_name" @on-change="DataBaseName" filterable placeholder="请选择连接名"  style="margin-bottom:-5px; margin-top:-30px">
                    <Option v-for="i in datalist.connection_name_list" :value="i.connection_name"
                            :key="i.connection_name">{{ i.connection_name }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem style="margin-bottom:-5px; margin-top:-15px">
                  <input v-model="formItem.is_sync" type="checkbox"><b>是否保存到文件(异步操作)</b>
                </FormItem>
                <FormItem>
                  <b>解析模式:</b>
                </FormItem>
                <FormItem style="margin-top:-35px">
                  <input v-model="formItem.is_pk" type="checkbox" > --no-primary-key
                </FormItem>
                <FormItem style="margin-top:-35px">
                  <input v-model="formItem.is_fk" type="checkbox"> --flashback
                </FormItem>
                <FormItem style="margin-top:-30px">
                    <InputNumber  size="small" v-model="formItem.sleep_number" style="width: 170px" type="number" placeholder="每1000行回滚SLEEP多少秒"></InputNumber>
                </FormItem>
                <FormItem style="margin-top:-20px">
                  <b>解析范围控制:</b>
                </FormItem>
                <FormItem style="margin-top:-30px">
                  <InputNumber  size="small" v-model="formItem.analy_number" style="width: 170px" type="number" placeholder="页面解析行数,默认50"></InputNumber>
                </FormItem>
                <FormItem style="margin-top:-25px">
                  <Select  size="small" ref="basename_ref" v-model="formItem.start_file" filterable  placeholder="起始解析文件(必选):" @on-change="VailedButton">
                    <Option v-for="item in this.binlogfiles" :value="item[0]" :key="item[0]">{{ item[0] }} Size:{{ item[1] }}</Option>
                  </Select>
                </FormItem>
                <FormItem style="margin-top:-25px">
                  <Select  size="small" ref="basename_ref" v-model="formItem.end_file" filterable  placeholder="终止解析文件(可选):" >
                    <Option v-for="item in this.binlogfiles" :value="item[0]" :key="item[0]">{{ item[0] }} Size:{{ item[1] }}</Option>
                  </Select>
                </FormItem>
                <FormItem style="margin-top:-25px">
                  <InputNumber  size="small" v-model="formItem.start_pos" style="width: 170px" type="number" placeholder="起始解析位置(可选):"></InputNumber>
                    <Option v-for="item in x" :value="item" :key="item">{{ item }}</Option>
                </FormItem>
                <FormItem style="margin-top:-25px">
                  <InputNumber  size="small" v-model="formItem.end_pos" style="width: 170px" type="number" placeholder="终止解析位置(可选):"></InputNumber>
                </FormItem>
                <FormItem style="margin-top:-25px">
                  <DatePicker size="small" v-model="start_date"  type="date" placeholder="起始日期(不建议)" @on-change="Val_starttime"></DatePicker>
                  <TimePicker size="small" v-model="formItem.start_time"  type="time" placeholder="起始时间(不建议)" :disabled="this.v_starttime" ></TimePicker>
                </FormItem>
                <FormItem style="margin-top:-25px">
                  <DatePicker size="small" v-model="end_date" type="date" placeholder="终止日期(可选)" @on-change="Val_endtime"></DatePicker>
                  <TimePicker size="small" v-model="formItem.end_time" type="time" placeholder="终止时间(可选)" :disabled="this.v_endtime"></TimePicker>
                </FormItem>
                <FormItem style="margin-top:-20px">
                  <b>对象过滤:</b>
                </FormItem>
                <FormItem style="margin-top:-35px">
                  <input v-model="formItem.is_only_dml" type="checkbox"> --only-dml
                </FormItem>
                <FormItem style="margin-top:-30px">
                  <Select  size="small" ref="basename_ref" v-model="formItem.db_filter" filterable @on-change="GetTables"  clearable placeholder="数据库过滤(可选):" >
                    <Option v-for="item in datalist.basenamelist" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </FormItem>
                <FormItem style="margin-top:-25px">
                  <Select  size="small" ref="basename_ref" v-model="formItem.tab_filter" filterable multiple placeholder="表过滤(可选):" >
                    <Option v-for="item in this.tables " :value="item[0]" :key="item[0]">{{ item[0] }}</Option>
                  </Select>
                </FormItem>
                <FormItem style="margin-top:-25px">
                  <Select  size="small" ref="basename_ref" v-model="formItem.ops_filter" filterable  multiple placeholder="操作类型过滤(可选):" >
                    <Option v-for="item in this.ops_type" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </FormItem>
                <FormItem style="margin-top:-15px; text-align: center" >
                  <Button   type="success" icon="ios-redo" :loading="this.commit_load" :disabled="this.commit_val" @click.native="Submmit">提  交</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="20" class="padding-left-10">
        <card>
              <TabPane label="查询结果" :key="4" :closable="false" name="res">
                    <Table border stripe :columns="this.res_col" :data="this.res_format_data" highlight-row ref="table"></Table>
                    <Page :total="my_total" show-total  show-elevator @on-change="Splice_res"  :page-size="10"  ref="totol"></Page>
              </TabPane>
        </card>
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
    name: 'Binlog2sql',
    data () {
      return {
        my_pagenumber: 1,
        v_starttime: true,
        v_endtime: true,
        res_data: [],
        res_tmp_data: [],
        res_format_data: [],
        res_col: [
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

        }, {
          title: 'binlog信息',
          key: 'binlog_info',
          width: 300
        }, {
          title: 'SQL信息',
          key: 'sql'
        }],
        id: null,
        tables: [],
        binlogfiles: [],
        commit_load: false,
        commit_val: false,
        ops_type: ['Insert', 'Update', 'Delete'],
        start_date: '',
        end_date: '',
        formItem: {
          id: null,
          computer_room: '',
          connection_name: '',
          basename: '',
          assigned: '',
          is_sync: false,
          is_pk: false,
          is_fk: false,
          sleep_number: null,
          analy_number: null,
          start_file: '',
          end_file: '',
          start_pos: null,
          end_pos: null,
          start_date: '',
          start_time: '',
          end_date: '',
          end_time: '',
          is_only_dml: false,
          db_filter: '',
          tab_filter: [],
          ops_filter: []
        },
        item: [],
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
        put_info: {
          basename: '',
          connection_name: '',
          computer_room: ''
        }
      }
    },
    methods: {
      Sql_full (v) {
        setTimeout(() => {
          this.res_format_data[v]['sql'] = this.res_tmp_data[v]['sql']
          this.res_format_data[v]['binlog_info'] = this.res_tmp_data[v]['binlog_info']
          this.res_format_data[v]['op'] = '1'
                  }, 100)
      },
      Sql_format (v) {
        setTimeout(() => {
          this.res_format_data[v]['op'] = '0'
          if (this.res_tmp_data[v]['sql'] !== null && this.res_tmp_data[v]['sql'].length > this.sql_display) {
               this.res_format_data[v]['sql'] = this.res_tmp_data[v]['sql'].substr(0, this.sql_display) + '...'
             } else {
          this.res_format_data[v]['sql'] = this.res_tmp_data[v]['sql']
          }
          if (this.res_tmp_data[v]['binlog_info'] !== null && this.res_tmp_data[v]['binlog_info'].length > this.sql_display) {
               this.res_format_data[v]['binlog_info'] = this.res_tmp_data[v]['binlog_info'].substr(0, this.sql_display) + '...'
             } else {
          this.res_format_data[v]['binlog_info'] = this.res_tmp_data[v]['binlog_info']
          }
                  }, 100)
      },
      Splice_res (page) {
        this.res_tmp_data = this.res_data.slice(page * 10 - 10, page * 10)
        this.Format_dis(this.res_tmp_data)
      },
      VailedButton () {
        this.commit_val = false
      },
      Val_starttime () {
        this.v_starttime = false
      },
      Val_endtime () {
        this.v_endtime = false
      },
      GetTables () {
        axios.put(`${util.url}/workorder/table_names`, {
            'id': this.id[0].id,
            'db': this.formItem.db_filter
          })
            .then(res => {
              this.tables = res.data
            })
            .catch(() => {
              util.err_notice('无法连接数据库!请检查网络')
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
          this.datalist.basenamelist = []
          this.put_info.connection_name = index
          this.id = this.item.filter(item => {
            if (item.connection_name === index) {
              return item
            }
          })
          this.formItem.id = this.id[0]['id']
          axios.put(`${util.url}/workorder/basename`, {
            'id': this.id[0].id
          })
            .then(res => {
              this.datalist.basenamelist = res.data
            })
            .catch(() => {
              util.err_notice('无法连接数据库!请检查网络')
            })
          axios.put(`${util.url}/workorder/binlogs`, {
            'id': this.id[0].id
          })
            .then(res => {
              this.binlogfiles = res.data
            })
            .catch(() => {
              util.err_notice('无法连接数据库!请检查网络')
            })
        }
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
      Submmit () {
        this.res_format_data = []
        this.res_data = []
        if ((this.formItem.is_fk === true) && (this.formItem.is_pk === true)) {
          util.err_notice('解析模式flashbak 和 no pk不能同时使用！')
          return
        }
        this.commit_load = true
        if (this.start_date !== '') {
          this.formItem.start_date = this.start_date.toLocaleDateString().replace(/-/g, '-')
        }
        if (this.end_date !== '') {
          this.formItem.end_date = this.end_date.toLocaleDateString().replace(/-/g, '-')
        }
        axios.post(`${util.url}/binlog2sql`, {
            'data': this.formItem
          })
            .then(res => {
              this.my_total = res.data['cnt']
              this.my_pagenumber = this.my_total / 10
              this.res_data = res.data['data']
              this.res_tmp_data = this.res_data.slice(0, 10)
              this.Format_dis(this.res_tmp_data)
              this.commit_load = false
              if (this.formItem.is_sync === true) {
               util.notice('解析完成,完整文件请查看后台文件！')
              }
            })
            .catch(() => {
              util.err_notice('Binlog2sql 失败，请联系管理员！')
              this.commit_load = false
            })
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
      }
    },
    mounted () {
      this.commit_val = true
       axios.put(`${util.url}/workorder/binlog2sql`, {'permissions_type': 'admin'})
        .then(res => {
          this.item = res.data['connection']
          this.assigned = res.data['assigend']
          this.datalist.computer_roomlist = res.data['custom']
          this.sql_display = res.data['sql_display']
        })
        .catch(error => {
          this.$Message.error('没有权限请联系管理员！')
          util.err_notice(error)
        })
    }
  }
</script>

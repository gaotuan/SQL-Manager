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
                <FormItem style="margin-top:-10px">
                  <b>开始时间:</b>
                </FormItem>
                <FormItem style="margin-top:-30px">
                  <DatePicker size="small" v-model="formItem.start_date" format="yyyy-MM-dd" type="date" placeholder="起始日期" @on-change="Val_starttime"></DatePicker>
                  <TimePicker size="small" v-model="formItem.start_time" format="HH:mm" type="time" placeholder="起始时间" :disabled="this.v_starttime" ></TimePicker>
                </FormItem>
                <FormItem style="margin-top:-20px">
                  <b>结束时间:</b>
                </FormItem>
                <FormItem style="margin-top:-30px">
                  <DatePicker size="small" v-model="formItem.end_date" format="yyyy-MM-dd" type="date" placeholder="终止日期" :disabled="this.v_enddate" @on-change="Val_endtime"></DatePicker>
                  <TimePicker size="small" v-model="formItem.end_time" format="HH:mm" type="time" placeholder="终止时间" :disabled="this.v_endtime"></TimePicker>
                </FormItem>
                <FormItem style="margin-top:-20px">
                  <b>对象过滤:</b>
                </FormItem>
                <FormItem style="margin-top:-30px">
                  <Select  size="small" ref="basename_ref" v-model="formItem.db_filter" filterable @on-change="GetTables"  clearable placeholder="数据库过滤(可选):" >
                    <Option v-for="item in datalist.basenamelist" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </FormItem>

                <FormItem style="margin-top:-15px; text-align: center" >
                  <Button  style="width:160px;height:30px;" type="success" icon="ios-redo" :loading="this.commit_load"  :disabled="this.commit_val" @click.native="Submmit">查询</Button>
                  <Button  style="margin-top:10px; width:160px;height:30px;" type="warning" icon="ios-download" :disabled="this.validate_exp" @click.native="exportdata" v-if="export_data">导出当前页面数据</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="20" class="padding-left-10" >
        <Card style=" width: 1250px">
              <TabPane label="查询结果" :key="4" :closable="false" name="res">
                    <Table  style=" width: 1200px;overflow: auto; font-size: 10px"  border stripe :columns="this.res_col" :data="this.res_format_data" highlight-row ref="table"></Table>
                    <Page  :total="my_total" show-total  show-elevator show-sizer  @on-change="Sequest_res"  @on-page-size-change="Set_pagesize"	:page-size=this.my_pagesize :page-size-opts="[30,40,50,70,100]"  ref="totol"></Page>
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
    name: 'SlowLog',
    data () {
      return {
        my_total: '',
        my_pagesize: 30,
        v_starttime: true,
        v_enddate: true,
        v_endtime: true,
        res_data: [],
        res_tmp_data: [],
        res_format_data: [],
        res_col: [
          {
          title: '操作',
            key: 'op',
          width: 60,
            fixed: 'left',
            align: 'left',
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
          title: '开始时间',
          key: 'ExecutionStartTime',
          width: 110}, {
          title: 'SQL语句',
          key: 'SQLText',
            width: 300
        }, {
          title: '客户端IP',
          key: 'HostAddress'
        }, {
          title: '数据库名',
          key: 'DBName'
        }, {
          title: '执行时长(s)',
          key: 'QueryTimes'
        }, {
          title: '锁定时长(s)',
          key: 'LockTimes'
        }, {
          title: '解析行数',
          key: 'ParseRowCounts'
        }, {
          title: '返回行数',
          key: 'ReturnRowCounts'
        }],
        id: null,
        tables: [],
        binlogfiles: [],
        commit_load: false,
        commit_val: true,
        export_data: false,
        formItem: {
          id: null,
          computer_room: '',
          connection_name: '',
          basename: '',
          start_date: '',
          start_time: '',
          end_date: '',
          end_time: '',
          db_filter: ''
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
          for (var ite in this.res_data[v]) {
          this.res_format_data[v][ite] = this.res_data[v][ite]
          }
          this.res_format_data[v]['op'] = '1'
                  }, 100)
      },
      Sql_format (v) {
        setTimeout(() => {
          this.res_format_data[v]['op'] = '0'
          for (var ite in this.res_data[v]) {
          if (this.res_data[v][ite] !== null && this.res_data[v][ite].length > this.sql_display) {
               this.res_format_data[v][ite] = this.res_data[v][ite].substr(0, this.sql_display) + '...'
             } else {
          this.res_format_data[v][ite] = this.res_data[v][ite]
          }
          }
        }, 100)
      },
      Set_pagesize (v) {
        this.my_pagesize = v
        this.res_format_data = []
        this.res_data = []
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        let parameter = { 'id': this.formItem.id,
          'start_date': this.formItem.start_date.toLocaleDateString('ko-KR', options).replace(/\. /g, '-').replace(/\./g, ''),
          'start_time': this.formItem.start_time,
          'end_date': this.formItem.end_date.toLocaleDateString('ko-KR', options).replace(/\. /g, '-').replace(/\./g, ''),
          'end_time': this.formItem.end_time,
          'dbname': this.formItem.db_filter,
          'page_number': 1,
          'page_size': this.my_pagesize
        }
        axios.post(`${util.url}/slowlog`, {
            'data': parameter
          })
            .then(res => {
              this.my_total = res.data['TotalRecordCount']
              this.res_data = res.data['Items']['SQLSlowRecord']
              this.Format_dis(this.res_data)
              this.commit_load = false
            })
            .catch(() => {
              util.err_notice('SlowLog 查询失败，请联系管理员！')
              this.commit_load = false
            })
      },
      Sequest_res (page) {
        try {
          this.res_format_data = []
          this.res_data = []
          const options = {year: 'numeric', month: '2-digit', day: '2-digit'}
          let parameter = {
            'id': this.formItem.id,
            'start_date': this.formItem.start_date.toLocaleDateString('ko-KR', options).replace(/\. /g, '-').replace(/\./g, ''),
            'start_time': this.formItem.start_time,
            'end_date': this.formItem.end_date.toLocaleDateString('ko-KR', options).replace(/\. /g, '-').replace(/\./g, ''),
            'end_time': this.formItem.end_time,
            'dbname': this.formItem.db_filter,
            'page_number': page,
            'page_size': this.my_pagesize
          }
          axios.post(`${util.url}/slowlog`, {
            'data': parameter
          })
            .then(res => {
              this.my_total = res.data['TotalRecordCount']
              this.res_data = res.data['Items']['SQLSlowRecord']
              this.Format_dis(this.res_data)
              this.commit_load = false
            })
            .catch(() => {
              util.err_notice('SlowLog 查询失败，请联系管理员！')
              this.commit_load = false
            })
        } catch (error) {
              util.err_notice('SlowLog 查询失败，请联系管理员！')
}
      },
      VailedButton () {
        this.commit_val = false
      },
      Val_starttime () {
        this.v_starttime = false
        this.v_enddate = false
      },
      Val_endtime () {
        this.v_endtime = false
        this.commit_val = false
      },
      GetTables () {
        // axios.put(`${util.url}/workorder/table_names`, {
        //     'id': this.id[0].id,
        //     'db': this.formItem.db_filter
        //   })
        //     .then(res => {
        //       this.tables = res.data
        //     })
        //     .catch(() => {
        //       util.err_notice('无法连接数据库!请检查网络')
        //     })
      },
      Connection_Name (val) {
        this.datalist.connection_name_list = []
        this.datalist.basenamelist = []
        this.formItem.connection_name = ''
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
        this.formItem.db_filter = ''
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
        }
      },
      exportdata () {
        exportcsv({
          filename: 'SQL审核平台_SlogLog',
          original: false,
          data: this.res_data,
          columns: this.res_col
        })
      },
      Submmit () {
        if (this.formItem.start_date > this.formItem.end_date) {
          util.err_notice('终止时间不能早于开始时间！！！')
          return
        }
        this.commit_load = true
        this.res_format_data = []
        this.res_data = []

        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        let parameter = { 'id': this.formItem.id,
          'start_date': this.formItem.start_date.toLocaleDateString('ko-KR', options).replace(/\. /g, '-').replace(/\./g, ''),
          'start_time': this.formItem.start_time,
          'end_date': this.formItem.end_date.toLocaleDateString('ko-KR', options).replace(/\. /g, '-').replace(/\./g, ''),
          'end_time': this.formItem.end_time,
          'dbname': this.formItem.db_filter,
          'page_number': 1,
          'page_size': this.my_pagesize
        }
        // let parameter = { 'id': 4,
        //   'start_date': '2020-06-11',
        //   'start_time': '00:00',
        //   'end_date': '2020-06-18',
        //   'end_time': '',
        //   'dbname': '',
        //   'page_number': 1,
        //   'page_size': this.my_pagesize
        // }
        axios.post(`${util.url}/slowlog`, {
            'data': parameter
          })
            .then(res => {
              this.my_total = res.data['TotalRecordCount']
              this.res_data = res.data['Items']['SQLSlowRecord']
              this.Format_dis(this.res_data)
              this.commit_load = false
              this.export_data = true
            })
            .catch(() => {
              util.err_notice('SlowLog 查询失败，请联系管理员！')
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
       axios.put(`${util.url}/workorder/slowlog`, {'permissions_type': 'query'})
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

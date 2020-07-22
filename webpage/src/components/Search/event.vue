<style lang="less">
  /*@import '../../styles/common.less';*/
  /*@import 'components/table.less';*/
</style>

<template>
    <div >
        <Card>
              <Form ref="formItem" class="" :model="formInline"  label-width="80" style="height: 30px; ">
<Row>
                <Col span="1" style="width: 80px">
                  <Icon type="gear-b"></Icon> <b>过滤操作:</b>
                </Col>
                <Col span="4">
                <FormItem label="机房:" prop="computer_room">
                  <Select  size="small" ref="computer_room_ref" v-model="formItem.computer_room" @on-change="Connection_Name" placeholder="请选择机房" >
                    <Option v-for="i in this.datalist.computer_roomlist" :key="i" :value="i">{{i}}</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="实例名:" prop="connection_name"  >
                  <Select size="small"  ref="connection_name_ref" v-model="formItem.connection_name" @on-change="DataBaseName" filterable placeholder="请选择连接名"  >
                    <Option v-for="i in this.datalist.connection_name_list" :value="i.connection_name"
                            :key="i.connection_name">{{ i.connection_name }}
                    </Option>
                  </Select>
                </FormItem>
                </Col>
              <Col span="4">
                <FormItem label="对象过滤:" >
                  <Select  size="small" ref="basename_ref" v-model="formItem.db_filter" filterable  clearable placeholder="数据库过滤(可选):" >
                    <Option v-for="item in this.datalist.basenamelist" :value="item" :key="item">{{ item }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="2">
                <FormItem  label-position="center" >
                  <Button  size="small"   type="success" icon="ios-redo" :loading="this.commit_load"  :disabled="this.commit_val" @click.native="Submmit" >查询</Button>
                </FormItem>
              </Col>
            </Row>
              </Form>
        </Card>
      <Card>
                    <Table  border stripe :columns="this.res_col" :data="this.res_format_data" no-filtered-data-text="请选择数据库实例！" ref="table" ></Table>
                    <Page  :total="my_total" show-total  show-elevator  @on-change="splice_arr"  :page-size=this.my_pagesize ></Page>
      </card>
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
        my_pagesize: 6,
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

        },
          {
          title: '机房',
          key: 'room',
          width: 100},
          { title: '实例名',
          key: 'instance_name',
            width: 100
        }, {
          title: '数据库',
          key: 'db',
            width: 100
        }, {
          title: '定时任务名',
          key: 'name',
            width: 100
        }, {
          title: '定时任务内容',
          key: 'body',
            width: 300
        }, {
          title: 'definer',
          key: 'definer',
            width: 150
        }, {
          title: 'execute_at',
          key: 'execute_at',
            width: 150
        }, {
          title: '间隔时间',
          key: 'interval_value',
            width: 100
        }, {
          title: '间隔单位',
          key: 'interval_field',
            width: 100
        }, {
          title: '创建时间',
          key: 'created',
            width: 100
        }, {
          title: '修改时间',
          key: 'modified',
            width: 100
        }, {
          title: '最后执行时间',
          key: 'last_executed',
            width: 100
        }, {
          title: '开始时间',
          key: 'starts',
            width: 100
        }, {
          title: '结束时间',
          key: 'ends',
            width: 100
        }, {
          title: '状态',
          key: 'status',
            width: 100
        }, {
          title: '是否保留',
          key: 'on_completion',
            width: 100
        }, {
          title: 'sql_mode',
          key: 'sql_mode',
            width: 150
        }, {
          title: '注释',
          key: 'comment',
            width: 100
        }, {
          title: '时区',
          key: 'time_zone',
            width: 100
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
      splice_arr (page) {
        this.Format_dis(this.res_data.slice(page * this.my_pagesize - this.my_pagesize, page * this.my_pagesize))
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
                this.formItem.basename = ''
        if (index) {
          this.datalist.basenamelist = []
          this.put_info.connection_name = index
          this.id = this.item.filter(item => {
            if (item.connection_name === index) {
              return item
            }
          })
          // setTimeout(() => {
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
            // }, 1000)
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
        this.commit_load = true
        this.res_format_data = []
        this.res_data = []

        axios.post(`${util.url}/event`, {
            'id': this.formItem.id,
          'db': this.formItem.db_filter
          })
            .then(res => {
                this.res_data = res.data['data']
                this.my_total = res.data['total']
                this.Format_dis(this.res_data.slice(0, this.my_pagesize))
              this.commit_load = false
            })
            .catch(() => {
              util.err_notice('Event 查询失败，请联系管理员！')
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
      this.commit_val = false
      this.export_data = true
       axios.put(`${util.url}/workorder/events`, {'permissions_type': 'query'})
        .then(res => {
          this.item = res.data['connection']
          this.datalist.computer_roomlist = res.data['custom']
          this.sql_display = res.data['sql_display']
          this.res_data = res.data['data']
          this.my_total = res.data['total']
          this.Format_dis(this.res_data.slice(0, this.my_pagesize))
        })
        .catch(error => {
          this.$Message.error('没有权限请联系管理员！')
          util.err_notice(error)
        })
    }
  }
</script>

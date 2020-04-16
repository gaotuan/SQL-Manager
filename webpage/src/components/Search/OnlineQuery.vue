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
          <Button type="warning" icon="ios-download" :disabled="this.validate_gen" @click.native="exportdata()" v-if="export_data">导出查询数据</Button>
          <Button type="primary" icon="ios-cloud-download" :disabled="this.validate_gen" @click.native="Search_sql('1')" >执行计划 </Button>
          <Button type="success" icon="ios-redo" :disabled="this.validate_gen" @click.native="Search_sql('2')">查询</Button>
          <br>
          <br>
          <p>查询结果:</p>
          <Table :columns="columnsName" :data="Testresults" highlight-row ref="table"></Table>
          <br>
          <Page :total="total" show-total  show-elevator @on-change="splice_arr"  :page-size="10"  ref="totol"></Page>
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
        let address = {
          'basename': this.formItem.basename,
          'connection_name': this.formItem.connection_name,
          'computer_room': this.formItem.computer_room
        }
        this.validate_gen = true
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
              this.validate_gen = false
            if (res.data['error']) {
              this.$Message.error(res.data['error'])
              util.err_notice(res.data['error'])
            } else {
              this.columnsName = res.data['title']
              this.allsearchdata = res.data['data']
              this.Testresults = this.allsearchdata.slice(0, 10)
              this.total = res.data['len']
              this.pagenumber = this.total / 10
            }
          })
            .catch(error => {
              this.validate_gen = false
              util.err_notice(error)
          })
          } else {
            this.$Message.error('请选择相关的数据库!')
          }
        })
    }
    },
    mounted () {
       axios.put(`${util.url}/workorder/connection`, {'permissions_type': 'query'})
        .then(res => {
          this.item = res.data['connection']
          this.assigned = res.data['assigend']
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

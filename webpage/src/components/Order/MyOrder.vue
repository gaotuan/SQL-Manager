<style lang="less">
  @import '../../styles/common.less';
  @import '../Order/components/table.less';
</style>
<template>
  <div>
    <Row>
      <Card>

        <row>
                  <Form>
                      <FormItem  >
                        <Input v-model="v_searchorder" style="width: 400px" placeholder="输入搜索内容...">
                            <Select  v-model="v_searchmem"  slot="prepend" style="width: 80px" placeholder="工单编号">
                                <Option value="o" >工单编号</Option>
                                <Option value="u" >工单说明</Option>
                            </Select>
                            <Button slot="append"  type="warning" icon="ios-search" @click.native="searchorder" ></Button>
                        </Input>
                      </FormItem>
                  </Form>
          </row>

        <Row>
          <Col span="24">
            <Table border :columns="columns" :data="table_data" stripe size="small"></Table>
          </Col>
        </Row>
        <br>
        <Page :total="page_number" show-elevator @on-change="currentpage" :page-size="20"></Page>
      </Card>
    </Row>
          <Modal v-model="editforward" :closable='true' :mask-closable=true :width="350">
                <h3 slot="header" style="color:#2D8CF0">工单转发:</h3>
                <Form :label-width="80" label-position="center">
                  <FormItem label="当前审核人:"> {{ this.cur_assigne }}</FormItem>
                  <FormItem label="转交审核人:">
                    <Select v-model="forward_assigne" filterable  clearable  placeholder="请选择新的审核人">
                    <Option v-for="i in this.forwares" :key="i" :value="i">{{i}}</Option>
                  </Select>
                  </FormItem>
                </Form>
                <div slot="footer">
                  <Button type="text" @click="editforward=false">取消</Button>
                  <Button type="warning" @click="PutForward">确认</Button>
                </div>
          </Modal>
 <Modal v-model="modal2"  :closable='true' :mask-closable=true width="900">
      <p slot="header" style="color:#f60;font-size: 16px">
        <Icon type="information-circled"></Icon>
        <span>SQL工单详细信息</span>
      </p>
      <Form label-position="right">
        <FormItem label="工单编号:">
          <span>{{ formitem.work_id }}</span>
        </FormItem>
        <FormItem label="机房:">
          <span>{{ formitem.computer_room }}</span>
        </FormItem>
        <FormItem label="连接名称:">
          <span>{{ formitem.connection_name }}</span>
        </FormItem>
        <FormItem label="数据库库名:">
          <span>{{ formitem.basename }}</span>
        </FormItem>
        <FormItem label="延迟执行:">
          <span>{{ formitem.delay }}分钟</span>
        </FormItem>
        <FormItem label="工单说明:">
          <span>{{ formitem.text }}</span>
        </FormItem>
        <FormItem label="SQL语句:">
          <br>
          <div class="tree">
            <p v-for="i in sql">{{ i }}</p>
          </div>
        </FormItem>
      </Form>
         <template >
        <p class="pa"><b>SQL检查结果:</b></p>
        <Table :columns="columnsName" :data="dataId" stripe border width="860" height="200"></Table>
      </template>
         <div slot="footer">
        <Button @click="modal2 = false">取消</Button>
        <Button type="warning" @click.native="test_button()" >检测sql</Button>
         </div>
    </Modal>

  </div>
</template>
<script>
  //
  import axios from 'axios'
  import util from '../../libs/util'

  export default {
    name: 'put',
    data () {
      return {
        editforward: false,
        modal2: false,
        sql: null,
        dataId: [],
        formitem: {
          workid: '',
          date: '',
          username: '',
          dataadd: '',
          database: '',
          att: '',
          id: null,
          delay: null
        },
        columnsName: [
          {
            title: 'ID',
            key: 'ID',
            width: 60,
            fixed: 'left'
          },
          {
            title: '阶段状态',
            key: 'stagestatus',
            width: 150
          },
          {
            title: '当前检查的sql',
            key: 'sql',
            width: 500
          },
          {
            title: '错误信息',
            key: 'errormessage',
            width: 300
          },
          {
            title: '影响行数',
            key: 'affected_rows',
            width: 90
          },
          {
            title: 'SQLSHA1',
            key: 'SQLSHA1',
            width: 200
          }
        ],
        cur_assigne: '',
        id: '',
        forward_assigne: '',
        forwares: [],
        v_searchmem: '',
        v_searchorder: '',
        columns: [
          {
            title: '工单编号:',
            key: 'work_id',
            sortable: true
          },
          {
            title: '工单说明',
            key: 'text'
          },
          {
            title: '是否备份',
            key: 'backup'
          },
          {
            title: '提交时间:',
            key: 'date',
            sortable: true
          },
          {
            title: '审核人',
            key: 'assigned',
            sortable: true
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              const row = params.row
              let color = ''
              let text = ''
              if (row.status === 2) {
                color = 'blue'
                text = '待审核'
              } else if (row.status === 0) {
                color = 'red'
                text = '驳回'
              } else if (row.status === 1) {
                color = 'green'
                text = '已执行'
              } else if (row.status === 4) {
                color = 'red'
                text = '执行失败'
              } else {
                color = 'yellow'
                text = '执行中'
              }

              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text)
            },
            sortable: true,
            filters: [{
              label: '已执行',
              value: 1
            },
              {
                label: '驳回',
                value: 0
              },
              {
                label: '待审核',
                value: 2
              },
              {
                label: '执行中',
                value: 3
              },
              {
                label: '执行失败',
                value: 4
              }
            ],
            //            filterMultiple: false 禁止多选,
            filterMethod (value, row) {
              if (value === 1) {
                return row.status === 1
              } else if (value === 2) {
                return row.status === 2
              } else if (value === 0) {
                return row.status === 0
              } else if (value === 3) {
                return row.status === 3
              } else {
                return row.status === 4
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              if (params.row.status === 2) {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'text'
                  },
                  on: {
                    click: () => {
                        this.edit_tab(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'orderlist',
                        query: {
                          workid: params.row.work_id,
                          id: params.row.id,
                          status: params.row.status,
                          type: params.row.type
                        }
                      })
                    }
                  }
                }, '详细信息'),
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'text'
                  },
                  on: {
                    click: () => { this.Forward(params.row) }
                  }
                }, '转发')
              ])
              } else {
                return h('div', [
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'text'
                  },
                  on: {
                    click: () => {
                        this.edit_tab(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'orderlist',
                        query: {
                          workid: params.row.work_id,
                          id: params.row.id,
                          status: params.row.status,
                          type: params.row.type
                        }
                      })
                    }
                  }
                }, '详细信息')])
              }
            }
          }
        ],
        page_number: 1,
        computer_room: util.computer_room,
        table_data: []
      }
    },
    methods: {
      test_button () {
        axios.put(`${util.url}/audit_sql`, {
          'type': 'test',
          'base': this.formitem.basename,
          'id': this.formitem.id
        })
          .then(res => {
            if (res.data.status === 200) {
              this.dataId = res.data.result
            } else {
              util.err_notice(res.data.status)
            }
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      edit_tab: function (index) {
        this.togoing = index
        this.dataId = []
        this.modal2 = true
        this.formitem = this.table_data[index]
        this.table_data[index].status === 2 ? this.switch_show = true : this.switch_show = false
        this.sql = this.table_data[index].sql.split(';')
      },
      Forward (v) {
        this.editforward = true
        this.cur_assigne = v.assigned
        this.id = v.id
        axios.post(`${util.url}/ops/get_assigned`, {
              'username': v.username
        }).then(res => {
            if (res.data['error']) {
              this.$Message.error(res.data['error'])
              util.err_notice(res.data['error'])
            } else {
              this.forwares = res.data['assigned']
            }
        })
      },
      PutForward () {
        this.editforward = false
        axios.post(`${util.url}/ops/put_assigned`, {'id': this.id, 'forward_assigne': this.forward_assigne
        }).then(res => {
            if (res.data['error']) {
              this.$Message.error(res.data['error'])
              util.err_notice(res.data['error'])
            } else {
              util.notice('转发成功！')
            }
        })
        setTimeout(() => {
            this.currentpage();
          }, 500)
      },
      currentpage (vl = 1) {
        axios.get(`${util.url}/myorder/?user=${sessionStorage.getItem('user')}&page=${vl}`)
          .then(res => {
            this.table_data = res.data.data
            this.table_data.forEach((item) => { (item.backup === 1) ? item.backup = '是' : item.backup = '否' })
            this.page_number = parseInt(res.data.page)
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      searchorder () {
        this.tmp = []
        if (this.v_searchorder === '') {
            this.currentpage()
        } else {
          axios.get(`${util.url}/myorder?user=${sessionStorage.getItem('user')}&page=n&opt=${this.v_searchmem}&mess=${this.v_searchorder}`)
            .then(res => {
              this.table_data = res.data.data
              this.table_data.forEach((item) => { (item.backup === 1) ? item.backup = '是' : item.backup = '否' })
              this.page_number = parseInt(res.data.page)
            })
            .catch(error => {
              util.err_notice(error)
            })
        }
      }
    },
    mounted () {
      this.currentpage()
    }
  }
</script>
<!-- remove delete request -->

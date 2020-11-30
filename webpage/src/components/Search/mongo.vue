<style lang="less">
  /*@import '../../styles/common.less';*/
  /*@import 'components/table.less';*/
</style>

<template>
    <div >
      <row>

        <Col span="20">
                <Card>
                        <Form ref="formItem" class="" :model="formInline" label-position="right" label-width="50" style="height: 30px; "  >
                              <Row>
                                                <div style="float: left;margin-top: 5px;font-size: 14px;display: inline-block">
                                                   <Icon type="gear-b" ></Icon>
                                                  <strong>数据源： </strong>
                                                </div>

                                              <Col span="10">
                                              <FormItem label="Url:" prop="computer_room" >
                                                <Input v-model="mongo_url" placeholder="mongodb://用户名:密码@地址:端口/数据库" ></Input>
                                              </FormItem>
                                              </Col>
                                <Col span="5">
<!--                                              <FormItem label="数据库:" :label-width="70">-->
<!--                                                <Select  v-model="mongo_db"  :disabled="this.db_disabled" placeholder="请选择数据库">-->
<!--                                                    <Option v-for="i in this.databases" :key="i" :value="i">{{i}}</Option>-->
<!--                                                </Select>-->
<!--                                              </FormItem>-->
                                </Col>
                                            <div style="display: inline-block;float: right">
                                               <FormItem  label-position="center" >
                                                  <Button  type="warning" icon="ios-redo"  @click.native="Test" >测试连接</Button>
                                                  <Button  type="success" icon="ios-redo"   :disabled="this.commit_val" @click.native="Submmit" >执行</Button>
                                                </FormItem>
                                            </div>
                              </Row>
                        </Form>
                  </Card>
                <Card>
                  <editor v-model="mongo_text" @init="editorInit"></editor>
                </Card>
                <Card>
                                <Tabs type="card" closable  v-model="select_tab"  @on-click="K_type">
                            <TabPane label="帮助文档" :key="3">
                                <RadioGroup v-model="help.type" @on-change="K_type" name="default">
                                    <Radio label="查询"></Radio>
                                    <Radio label="String"></Radio>
                                </RadioGroup>
                                <br>
                                <br>
                              <Card>
                                <p style="white-space: pre-line;">{{this.help.text}}</p>
                              </Card>

                            </TabPane>
                            <TabPane label="执行结果" :key="4" :closable="false" name="res">
                              <Card style="background-color: #000000;color: #ffffff">
                              <p style="white-space: pre-line;" v-for="i in this.res">{{i}}</p>
                              </Card>
                            </TabPane>
                        </Tabs>

                </card>
        </Col>
        <Col span="3" style="width: 180px;">
                <Card >
                  <p slot="title">
                    <Icon type="ios-redo"></Icon>
                    选择数据库
                  </p>
                  <div>
<Form>
  <FormItem label="数据库:" >
  </FormItem>
  <FormItem style="width: 140px; margin-top:-20px">
    <Select  v-model="mongo_db"  :disabled="this.db_disabled" placeholder="请选择数据库" @on-change="Collection_Name">
      <Option v-for="i in this.databases" :key="i" :value="i">{{i}}</Option>
    </Select>
  </FormItem>
</Form>
                  </div>
                  <div class="edittable-test-con">
                            <Card style="height: 200px; width:140px; overflow: auto;background-color: #FDECE8; font-size: 15px" >
                              <b>集合列表:</b>
                              <br>
                              {{this.collections}}
                            </Card>
                  </div>
                </Card>
        </Col>
        </row>
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
    name: 'SlowLog',
    data () {
      return {
        sql_limit: 0,
        commit_val: true,
        commit_val2: true,
        db_disabled: true,
        select_tab: 'default',
        help: {
          text: '1、sql 默认会添加limit ' + this.sql_limit + ' 限制\n' +
            '2、正确的查询格式为(大于)：{collection_name}.find() or {collection_name}.find(expression) 如 : \'test.find({"id":{"$gt":1.0}})\'\n' +
            '                                     3、正确的查询格式为(等于)：{collection_name}.find() or {collection_name}.find(expression) 如 : \'test.find({"id":"1"})\'\n' +
            '                                     4、禁止使用模糊匹配：{collection_name}.find() or {collection_name}.find(expression) 如 : \'test.find({"name": /mon/ })\'',
          type: '查询'
        },
        res: null,
        mongo_text: '',
        mongo_url: '',
        mongo_db: '',
        databases: [],
        collections: ''
      }
    },
    methods: {
      Collection_Name () {
        this.collections = ''
        axios.post(`${util.url}/mongo`, {
          'mongo_url': this.mongo_url,
          'mongo_text': 'get_collections',
          'mongo_db': this.mongo_db
          })
            .then(res => {
              if (res.data['error']) {
                this.$Message.error(res.data['error'])
                util.err_notice(res.data['error'])
                return
              }
              // this.res = String(res.data['data']).replace('"', '').replace(/,/g, '\r\n')
              // this.collections = '<p>'
              for (var i in res.data['data']) {
                this.collections = this.collections + '\n' + res.data['data'][i]
              }
            })
            .catch(() => {
              util.err_notice('Mongo 执行失败，请联系管理员！')
            })
      },
      K_type () {
        if (this.help.type === 'String') {
          this.help.text = ''
        }
        if (this.help.type === '查询') {
          this.help.text = '1、sql 默认会添加limit ' + this.sql_limit + ' 限制\n' +
            '2、正确的查询格式为(大于)：{collection_name}.find() or {collection_name}.find(expression) 如 : \'test.find({"id":{"$gt":1.0}})\'\n' +
            '                                     3、正确的查询格式为(等于)：{collection_name}.find() or {collection_name}.find(expression) 如 : \'test.find({"id":"1"})\'\n' +
            '                                     4、禁止使用模糊匹配：{collection_name}.find() or {collection_name}.find(expression) 如 : \'test.find({"name": /mon/ })\''
        }
        if (this.help.type === 'Hash') {
          this.help.text = ''
        }
        if (this.help.type === 'Set') {
          this.help.text = ''
        }
        if (this.help.type === 'List') {
          this.help.text = ''
        }
      },
      Test () {
        axios.post(`${util.url}/mongo`, {
          'mongo_url': this.mongo_url,
          'mongo_text': 'test'
          })
            .then(res => {
              if (res.data['error']) {
              this.$Message.error(res.data['error'])
              util.err_notice(res.data['error'])
              }
              if (res.data['ok']) {
              this.$Message.info(res.data['ok'])
              util.notice(res.data['ok'])
              this.commit_val = false
              this.commit_val2 = false
              this.db_disabled = false
              this.databases = res.data['databases']
            }
            })
            .catch(() => {
              util.err_notice('Mongo 测试失败，请联系管理员！')
            })
      },
      Submmit () {
        if (this.mongo_text === '') {
          util.notice('输入文本不能为空！')
          return
        }
        if (this.mongo_db === '') {
          util.err_notice('数据库不能为空,请选择数据库后再执行！')
          return
        }
        this.select_tab = 'res'
        this.res = ''
        axios.post(`${util.url}/mongo`, {
          'mongo_url': this.mongo_url,
          'mongo_text': this.mongo_text,
          'mongo_db': this.mongo_db
          })
            .then(res => {
              if (res.data['error']) {
                this.$Message.error(res.data['error'])
                util.err_notice(res.data['error'])
                return
              }
              // this.res = String(res.data['data']).replace('"', '').replace(/,/g, '\r\n')
              this.res = res.data['data']
            })
            .catch(() => {
              util.err_notice('Mongo 执行失败，请联系管理员！')
            })
      }
    },
    watch: {
    'mongo_text' (newVal, oldVal) {
            localStorage.setItem('mongo_text', newVal)
        },
    'mongo_url' (newVal, oldVal) {
            localStorage.setItem('mongo_url', newVal)
        },
    'mongo_db' (newVal, oldVal) {
            localStorage.setItem('mongo_db', newVal)
        }
  },
    mounted () {
       axios.put(`${util.url}/workorder/events`, {'permissions_type': 'query'})
        .then(res => {
          this.sql_limit = res.data['sql_limit']
          }
        )
        .catch(error => {
          this.$Message.error('没有权限请联系管理员！')
          util.err_notice(error)
        })
      if (localStorage.getItem('mongo_text') !== null) {
            this.mongo_text = localStorage.getItem('mongo_text')
          }
      if (localStorage.getItem('mongo_url') !== null) {
            this.mongo_url = localStorage.getItem('mongo_url')
          }
      if (localStorage.getItem('mongo_db') !== null) {
            this.mongo_db = localStorage.getItem('mongo_db')
          }
    }
  }
</script>

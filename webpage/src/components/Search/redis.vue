<style lang="less">
  /*@import '../../styles/common.less';*/
  /*@import 'components/table.less';*/
</style>

<template>
    <div >
        <Card>
              <Form ref="formItem" class="" :model="formInline" label-position="right" label-width="80" style="height: 30px; ">
<Row>
                <Col span="1" style="width: 80px">
                  <Icon type="gear-b"></Icon> <b>数据源:</b>
                </Col>
                <Col span="6">
                <FormItem label="地址:" prop="computer_room" >
                  <Input v-model="redis_host" placeholder="redis地址..." ></Input>
                </FormItem>
                </Col>
                <Col span="3">
                <FormItem label="端口:" prop="connection_name"  >
                     <InputNumber v-model="redis_port"></InputNumber>
                </FormItem>
                </Col>
              <Col span="3">
                <FormItem label="密码:" >
                  <Input type="password" v-model="redis_pwd" placeholder="password"></Input>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem label="DB:" >
                  <InputNumber v-model="redis_db"></InputNumber>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem  label-position="center" >
                  <Button    type="warning" icon="ios-redo"  @click.native="Test" >测试连接</Button>
                </FormItem>
              </Col>
                <Col span="2">
                <FormItem  label-position="center" >
                  <Button  type="success" icon="ios-redo"   :disabled="this.commit_val" @click.native="Submmit" >执行</Button>
                </FormItem>
              </Col>
            </Row>
              </Form>
        </Card>
      <Card>
        <editor v-model="redis_text" @init="editorInit"></editor>
      </Card>
      <Card>
                      <Tabs type="card" closable  v-model="select_tab"  @on-click="MyFavite">
                  <TabPane label="查询历史"  :key="1" name="his">
                    <Table border stripe :columns="this.his_cols" :data="this.his_res" highlight-row ref="table"></Table>
                  </TabPane>
                  <TabPane label="帮助文档" :key="3">
                      <RadioGroup v-model="help.type" @on-change="K_type">
                          <Radio label="Key操作"></Radio>
                          <Radio label="String"></Radio>
                          <Radio label="Hash"></Radio>
                          <Radio label="Set"></Radio>
                          <Radio label="List"></Radio>
                      </RadioGroup>
                      <br>
                      <br>
                    <Card>
                      <p style="white-space: pre-line;">{{this.help.text}}</p>
                    </Card>

                  </TabPane>
                  <TabPane label="查询结果" :key="4" :closable="false" name="res">
                    <Table border stripe :columns="columnsName" :data="this.res_format_data" highlight-row ref="table"></Table>
                    <Page :total="total" show-total show-sizer  show-elevator @on-change="splice_arr"  @on-page-size-change="Set_pagesize"	:page-size=this.pagesize :page-size-opts="[10,20,30,40,50,70,100]"  ref="totol"></Page>
                  </TabPane>
              </Tabs>

      </card>
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
        commit_val: false,
        help: {
          text: '1、exists key　检查key是否存在，若key存在返回1，否则返回0\n' +
            '                                    2、keys pattern 查找所有符合给定模式的key，通常用于查找key\n' +
            '                                    3、expire key seconds 为key设置超时时间（单位：秒），当key过期时，会被系统自动删除\n' +
            '                                    4、ttl key 以秒为单位返回key的剩余生存时间（time to live），当key不存在时返回-2，当key存在未设置生存时间时返回-1\n' +
            '                                    5、pttl key 这个命令和ttl类似，它以毫秒为单位返回key的剩余生存时间\n' +
            '                                    6、move key db 将key移动到指定数据库中\n' +
            '                                    7、type key 返回key存储的值的类型，返回none（不存在）、string（字符串）、list（列表）、set（集合）、zset（有序集合）、hash（哈希表)',
          type: 'Key操作'
        },
        redis_text: '',
        redis_host: '',
        redis_port: '6379',
        redis_pwd: '',
        redis_db: '0'
      }
    },
    methods: {
      K_type () {
        if (this.help.type === 'String') {
          this.help.text = '1、get key 返回key的值，若key不存在则返回nil，若key存储的值不是字符串则返回错误\n' +
            '                                     2、mget key [key...] 依次返回一个或多个key的值，若key不存在返回nil，若key存在但不是字符串返回nil\n' +
            '                                     3、strlen key 返回key所存储的字符串的长度，当key不存在时返回0，当key存在但不是字符串时返回错误\n' +
            '                                     4、append key value 将指定的值追加到key末尾，若key不存在，则创建并赋值，返回追加后的字符串长度\n' +
            '                                     5、set key value [ex seconds] [px milliseconds] [nx|xx] 为key设置值,ex和px均为设置过期时间只不过单位不同，nx表示只有key不存在时才进行操作，xx表示只有key存在时才进行操作\n' +
            '                                     6、setex key seconds value 设置带生存时间的key的值，以秒为单位\n' +
            '                                     7、setnx key value 为key设置值，若key已存在则不进行任何操作\n' +
            '                                     8、mset key value [key value...] 为一组或多组key设置值，该操作为原子操作，要么一组都设置成功，要么一组都设置失败\n' +
            '                                     9、msetnx key value [key value...] 与mset不同的是msetnx中的key必须是不存在的，若有一个已存在则会整体失败'
        }
        if (this.help.type === 'Key操作') {
          this.help.text = '1、exists key　检查key是否存在，若key存在返回1，否则返回0\n' +
            '                                    2、keys pattern 查找所有符合给定模式的key，通常用于查找key\n' +
            '                                    3、expire key seconds 为key设置超时时间（单位：秒），当key过期时，会被系统自动删除\n' +
            '                                    4、ttl key 以秒为单位返回key的剩余生存时间（time to live），当key不存在时返回-2，当key存在未设置生存时间时返回-1\n' +
            '                                    5、pttl key 这个命令和ttl类似，它以毫秒为单位返回key的剩余生存时间\n' +
            '                                    6、move key db 将key移动到指定数据库中\n' +
            '                                    7、type key 返回key存储的值的类型，返回none（不存在）、string（字符串）、list（列表）、set（集合）、zset（有序集合）、hash（哈希表)'
        }
        if (this.help.type === 'Hash') {
          this.help.text = '1、hgetall key 获取hash表中所有field的值\n' +
            '                                     2、hexists key field 判断hash表中指定field是否存在，返回1；若key或field不存在则返回0\n' +
            '                                     3、hget key field 获取hash表中指定field的值，key或field不存在时返回nil\n' +
            '                                     4、hmget key field[field...] 获取hash表中多个指定field的值，若key不存在返回空，若field不存在返回nil\n' +
            '                                     5、hkeys key 返回hash表中的所有field，若key不存在返回空\n' +
            '                                     6、hvals key 返回hash表中的所有val，若key不存在返回空\n' +
            '                                     7、hdel key field[field...] 删除hash表中指定field，若key或field不存在则会忽略\n' +
            '                                     8、hset key field value将field-value设置到hash表中，若key不存在会新建hash表再赋值，若field已存在则会覆盖现有值\n' +
            '                                     9、hsetnx key field value 和hset类似，但是hsetnx要求field不存在才能进行此操作，否则会返回0'
        }
        if (this.help.type === 'Set') {
          this.help.text = '1、smembers key 列出集合key中的所有成员\n' +
            '                                     2、scard key 返回集合key中元素的个数\n' +
            '                                     3、sdiff key[key...] 获取集合的差集，若key为1个则返回集合的全部成员\n' +
            '                                     4、sunion key[key...] 返回集合的并集，不存在的key会被当做空集处理\n' +
            '                                     5、spop key 移除并返回集合中的一个随机元素，当key不存在时返回NULL\n' +
            '                                     6、sismember key member 判断member在key中是否已存在返回0或1\n' +
            '                                     7、sadd key member[member...] 将一个或多个member元素加入到集合key中，若member已存在那么会忽略此元素\n' +
            '                                     8、smove source destination member将元素member从source移动到destination；若member在destination中已存在只会删除source中的数据，若source或member不存在会返回0，若destination不存在则会创建后再进行操作\n' +
            '                                     9、srem key member[member]　移除key中的一个或多个member元素，不存在的member会被忽略'
        }
        if (this.help.type === 'List') {
          this.help.text = ''
        }
      },
      Test () {
        axios.post(`${util.url}/redis`, {
          'redis_host': this.redis_host,
          'redis_port': this.redis_port,
          'redis_pwd': this.redis_pwd,
          'redis_db': this.redis_db,
          'redis_text': 'test'
          })
            .then(res => {
                this.res_data = res.data['data']
                this.my_total = res.data['total']
                this.Format_dis(this.res_data.slice(0, this.my_pagesize))
              this.commit_load = false
            })
            .catch(() => {
              util.err_notice('Redis 测试失败，请联系管理员！')
              this.commit_load = false
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
      }
    },
    watch: {
    'redis_text' (newVal, oldVal) {
            localStorage.setItem('redis_text', newVal)
        },
    'redis_host' (newVal, oldVal) {
            localStorage.setItem('redis_host', newVal)
        },
    'redis_port' (newVal, oldVal) {
            localStorage.setItem('redis_port', newVal)
        },
    'redis_pwd' (newVal, oldVal) {
            localStorage.setItem('redis_pwd', newVal)
        },
    'redis_db' (newVal, oldVal) {
            localStorage.setItem('redis_db', newVal)
        }
  },
    mounted () {
       axios.put(`${util.url}/workorder/events`, {'permissions_type': 'query'})
        .then()
        .catch(error => {
          this.$Message.error('没有权限请联系管理员！')
          util.err_notice(error)
        })
      if (localStorage.getItem('redis_text') !== null) {
            this.redis_text = localStorage.getItem('redis_text')
          }
      if (localStorage.getItem('redis_host') !== null) {
            this.redis_host = localStorage.getItem('redis_host')
          }
      if (localStorage.getItem('redis_port') !== null) {
            this.redis_port = localStorage.getItem('redis_port')
          }
      if (localStorage.getItem('redis_pwd') !== null) {
            this.redis_pwd = localStorage.getItem('redis_pwd')
          }
      if (localStorage.getItem('redis_db') !== null) {
            this.redis_db = localStorage.getItem('redis_db')
          }
    }
  }
</script>

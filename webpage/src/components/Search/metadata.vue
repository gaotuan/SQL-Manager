<style lang="less">
  @import '../../styles/common.less';
  @import 'components/table.less';
</style>
<template>
  <div>
    <Row>
      <Card>
          <row>
            <Col span="1" style="width: 100px">
          <Icon type="person"></Icon> 元数据查询
            </Col>
    <Col>
                  <Form>
                      <FormItem  >
                        <Input v-model="v_searchorder" style="width: 400px" placeholder="输入搜索内容...">
                            <Select  v-model="v_searchmem"  slot="prepend" style="width: 80px" placeholder="表名字">
                                <Option value="t" >表名字</Option>
                                <Option value="c" >列名字</Option>
                            </Select>
                            <Button slot="append"  type="warning" icon="ios-search" @click.native="searchorder" ></Button>
                        </Input>
                      </FormItem>
                  </Form>
    </Col>
          </row>

        <Row>
          <Col span="24">
            <Table border stripe :columns="this.columnsName" :data="this.Testresults" highlight-row ref="table"></Table>
            <Page :total="total" show-total  show-sizer show-elevator @on-change="splice_my"  @on-page-size-change="Set_my_pagesize"	:page-size=this.my_pagesize :page-size-opts="[10,20,30,40,50,70,100]"    ref="totol"></Page>
          </Col>
        </Row>
      </Card>
    </Row>


  </div>
</template>
<script>
  import axios from 'axios'
  import util from '../../libs/util'
  export default {
    name: 'metadata',
    data () {
      return {
        v_searchorder: '',
        v_searchmem: 't',
        pagesize: 10,
        total: '',
        allsearchdata: [],
        Testresults: [],
        columnsName: [
          {
            title: '机房',
            key: 'connection_name',
            width: 200
          },
          {
            title: '连接名',
            key: 'computer_room',
            width: 200
          },
          {
            title: '数据库名',
            key: 'db_name',
            width: 200
          },
          {
            title: '表名',
            key: 'table_name',
            width: 350
          },
          {
            title: '表注释',
            key: 'table_comment',
            width: 300
          },
                    {
            title: '列名',
            key: 'column_name',
            width: 200
          },
          {
            title: '列注释',
            key: 'column_comment',
            width: 200
          }
        ]
      }
    },
    methods: {
      Set_my_pagesize (v) {
        this.pagesize = v
        this.Testresults = this.allsearchdata.slice(0, this.pagesize)
        this.pagenumber = this.total / this.pagesize
      },
      splice_my (page) {
        this.Testresults = this.allsearchdata.slice(page * this.pagesize - this.pagesize, page * this.pagesize)
      },
      searchorder () {
        if (this.v_searchorder === '') {
          util.err_notice('搜索内容不能为空！')
          return
        }
        if (this.v_searchmem === 't') {
        axios.get(`${util.url}/db_metadata?opt=${this.v_searchmem}&mess=${this.v_searchorder}`)
            .then(res => {
              this.allsearchdata = res.data['data']
              this.Testresults = this.allsearchdata.slice(0, this.pagesize)
              this.total = this.allsearchdata.length
              this.pagenumber = this.total / this.pagesize
            })
            .catch(error => {
              util.err_notice(error)
            })
        }
      }
    },
    mounted () {
    }
  }
</script>

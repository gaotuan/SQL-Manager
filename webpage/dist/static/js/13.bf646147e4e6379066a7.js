webpackJsonp([13],{318:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(4),i=n.n(a),o=n(2),r=n(659),l=n.n(r);e.default={components:{editindex:l.a},data:function(){return{ruleValidate:{computer_room:[{required:!0,message:"机房地址不得为空",trigger:"change"}],connection_name:[{required:!0,message:"连接名不得为空",trigger:"change"}],basename:[{required:!0,message:"数据库名不得为空",trigger:"change"}],tablename:[{required:!0,message:"表名不得为空",trigger:"change"}],text:[{required:!0,message:"说明不得为空",trigger:"change"},{type:"string",max:20,message:"最多20个字",trigger:"blur"}]},dataset:[],item:{},basename:[],sqlname:[],TableDataNew:[],tableform:{sqlname:[],basename:[],info:[]},tabcolumns:[{title:"字段名",key:"Field"},{title:"字段类型",key:"Type",editable:!0},{title:"字段是否为空",key:"Null",editable:!0,option:!0},{title:"默认值",key:"Default",editable:!0},{title:"索引类型",key:"Key"},{title:"备注",key:"Extra"}],username:sessionStorage.getItem("user"),indexinfo:[],sql:[],openswitch:!1,pass:!1,formItem:{text:"",computer_room:"",connection_name:"",basename:"",tablename:"",backup:"0",assigned:"",delay:0},id:null,tabs:"order1",assigned:[]}},methods:{Connection_Name:function(t){t&&this.ScreenConnection(t)},DataBaseName:function(t){var e=this;t&&(this.id=this.item.filter(function(e){if(e.connection_name===t)return e}),i.a.put(o.a.url+"/workorder/basename",{id:this.id[0].id}).then(function(t){e.tableform.basename=t.data}).catch(function(){o.a.err_notice("无法连接数据库!请检查网络")}))},ScreenConnection:function(t){this.tableform.sqlname=this.item.filter(function(e){if(e.computer_room===t)return e})},GetTableName:function(){var t=this;if(this.formItem.basename){var e=JSON.stringify(this.formItem);i.a.put(o.a.url+"/workorder/tablename",{data:e,id:this.id[0].id}).then(function(e){t.tableform.info=e.data}).catch(function(t){o.a.err_notice(t)})}},getdatabases:function(){var t=this;i.a.put(o.a.url+"/workorder/connection",{permissions_type:"ddl"}).then(function(e){t.item=e.data.connection,t.assigned=e.data.assigend,t.dataset=e.data.custom}).catch(function(t){o.a.err_notice(t)})},getinfo:function(){var t=this;this.$refs.formItem.validate(function(e){e?(t.$Spin.show({render:function(t){return t("div",[t("Icon",{class:"demo-spin-icon-load",props:{type:"load-c",size:30}}),t("div","数据库连接中,请稍后........")])}}),t.formItem.table_name=t.formItem.tablename,i.a.put(o.a.url+"/workorder/field",{connection_info:JSON.stringify(t.formItem),id:t.id[0].id}).then(function(e){t.TableDataNew=e.data,t.$Spin.hide()}).catch(function(){o.a.err_notice("连接失败！详细信息请查看日志")}),t.getindex()):t.$Message.error("表单验证失败!")})},canel:function(){this.sql=[],this.pass=!1},getindex:function(){var t=this;this.formItem.table_name&&i.a.put(o.a.url+"/workorder/indexdata",{login:JSON.stringify(this.formItem),table:this.formItem.tablename,id:this.id[0].id}).then(function(e){t.indexinfo=e.data}).catch(function(t){o.a.err_notice(t)})},getindexconfirm:function(t){var e=!0,n=!1,a=void 0;try{for(var i,o=t[Symbol.iterator]();!(e=(i=o.next()).done);e=!0){var r=i.value;this.sql.push(r)}}catch(t){n=!0,a=t}finally{try{!e&&o.return&&o.return()}finally{if(n)throw a}}},orderswitch:function(){this.openswitch=!this.openswitch},commitorder:function(){var t=this;this.sql===[]||""===this.formItem.basename||""===this.assigned||""===this.formItem.text||""===this.formItem.assigned?o.a.err_notice("工单数据缺失,请检查工单信息是否缺失!"):!0===this.pass?i.a.post(o.a.url+"/sqlsyntax/",{data:JSON.stringify(this.formItem),sql:JSON.stringify(this.sql),user:sessionStorage.getItem("user"),type:1,id:this.id[0].id}).then(function(e){o.a.notice(e.data),t.$router.push({name:"myorder"})}).catch(function(t){o.a.err_notice(t)}):o.a.err_notice("提交工单需点击确认按钮")}},mounted:function(){this.getdatabases()}}},323:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(4),i=n.n(a),o=n(2);e.default={name:"editindex",props:{tabledata:Array,table_name:String},data:function(){var t=this;return{add_tmp:{key_name:"",Non_unique:"",column_name:"",extra:"NO"},add_row:[],tabcolumns:[{title:"索引名称",key:"key_name"},{title:"是否唯一索引",key:"Non_unique"},{title:"字段名",key:"column_name"},{title:"操作",key:"action",width:150,align:"center",render:function(e,n){return e("div",[e("Button",{props:{size:"small"},on:{click:function(){t.remove(n.index)}}},"删除")])}}],addcolums:[{title:"索引名称",key:"key_name"},{title:"是否唯一索引",key:"Non_unique"},{title:"字段名",key:"column_name"},{title:"是否为全文索引",key:"fulltext"},{title:"action",width:80,render:function(e,n){return e("Button",{props:{type:"text"},on:{click:function(){t.$Notice.error({title:"临时字段删除成功!"}),t.add_row.splice(n.index,1)}}},"删除")}}],putdata:[],children:[]}},methods:{addcolumns:function(){this.add_row.push({key_name:this.add_tmp.key_name,Non_unique:this.add_tmp.Non_unique,column_name:this.add_tmp.column_name,fulltext:this.add_tmp.extra}),this.add_tmp={},this.add_tmp.extra="NO"},confirm2:function(){var t=this;this.putdata.push({addindex:this.add_row,table_name:this.table_name}),i.a.put(o.a.url+"/gensql/index",{data:JSON.stringify(this.putdata)}).then(function(e){t.children=e.data,t.putdata=[],t.add_row=[],t.$emit("on-indexdata",t.children)}).catch(function(){t.$Notice.error({title:"警告",desc:"服务端无法生成相关语句，请检查语法或查看后台日志信息"})})},remove:function(t){"PRIMARY"!==this.tabledata[t].key_name?(this.$Notice.success({title:this.tabledata[t].key_name+"-索引删除成功!"}),this.putdata.push({delindex:this.tabledata[t],table_name:this.table_name}),this.tabledata.splice(t,1)):this.$Notice.error({title:"主键不支持删除!"})}}}},350:function(t,e,n){e=t.exports=n(78)(!0),e.push([t.i,".margin-top-8{margin-top:8px}.margin-top-10{margin-top:10px}.margin-top-20{margin-top:20px}.margin-left-10{margin-left:10px}.margin-bottom-10{margin-bottom:10px}.margin-bottom-100{margin-bottom:100px}.margin-right-10{margin-right:10px}.padding-left-6{padding-left:6px}.padding-left-8{padding-left:5px}.padding-left-10{padding-left:10px}.padding-left-20{padding-left:20px}.height-100{height:100%}.height-120px{height:100px}.height-200px{height:200px}.height-492px{height:492px}.height-460px{height:460px}.line-gray{height:0;border-bottom:2px solid #dcdcdc}.notwrap{word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.padding-left-5{padding-left:10px}[v-cloak]{display:none}.dragging-tip-enter-active{opacity:1;transition:opacity .3s}.dragging-tip-enter,.dragging-tip-leave-to{opacity:0;transition:opacity .3s}.dragging-tip-con{display:block;text-align:center;width:100%;height:50px}.dragging-tip-con span{font-size:18px}.record-tip-con{display:block;width:100%;height:292px;overflow:auto}.record-item{box-sizing:content-box;display:block;overflow:hidden;height:24px;line-height:24px;padding:8px 10px;border-bottom:1px dashed #dcdcdc}.record-tip-con span{font-size:14px}.edittable-test-con{min-height:600px}.edittable-testauto-con{height:100%}.edittable-table-height-con{min-height:600px}.edittable-table-height1-con{height:200px}.edittable-con-1{box-sizing:content-box;padding:15px 0 0;height:550px}.exportable-table-download-con1{padding:16px 0 16px 20px;border-bottom:1px dashed #c3c3c3;margin-bottom:16px}.exportable-table-download-con2{padding-left:20px}.show-image{padding:20px 0}.show-image img{display:block;width:100%;height:auto}.demo-spin-icon-load{animation:ani-demo-spin 1s linear infinite}p{word-wrap:break-word;word-break:break-all;overflow:hidden}","",{version:3,sources:["/Users/gaoshaopang/PycharmProjects/Yearning-1.2.0_me/webpage/src/components/Order/GenIndex.vue"],names:[],mappings:"AACA,cACE,cAAgB,CACjB,AACD,eACE,eAAiB,CAClB,AACD,eACE,eAAiB,CAClB,AACD,gBACE,gBAAkB,CACnB,AACD,kBACE,kBAAoB,CACrB,AACD,mBACE,mBAAqB,CACtB,AACD,iBACE,iBAAmB,CACpB,AACD,gBACE,gBAAkB,CACnB,AACD,gBACE,gBAAkB,CACnB,AACD,iBACE,iBAAmB,CACpB,AACD,iBACE,iBAAmB,CACpB,AACD,YACE,WAAa,CACd,AACD,cACE,YAAc,CACf,AACD,cACE,YAAc,CACf,AACD,cACE,YAAc,CACf,AACD,cACE,YAAc,CACf,AACD,WACE,SAAU,AACV,+BAAiC,CAClC,AACD,SACE,oBAAqB,AACrB,mBAAoB,AACpB,gBAAiB,AACjB,sBAAwB,CACzB,AACD,gBACE,iBAAmB,CACpB,AACD,UACE,YAAc,CACf,AACD,2BACE,UAAW,AACX,sBAAyB,CAC1B,AACD,2CAEE,UAAW,AACX,sBAAyB,CAC1B,AACD,kBACE,cAAe,AACf,kBAAmB,AACnB,WAAY,AACZ,WAAa,CACd,AACD,uBACE,cAAgB,CACjB,AACD,gBACE,cAAe,AACf,WAAY,AACZ,aAAc,AACd,aAAe,CAChB,AACD,aACE,uBAAwB,AACxB,cAAe,AACf,gBAAiB,AACjB,YAAa,AACb,iBAAkB,AAClB,iBAAkB,AAClB,gCAAoC,CACrC,AACD,qBACE,cAAgB,CACjB,AACD,oBACE,gBAAkB,CACnB,AACD,wBACE,WAAa,CACd,AACD,4BACE,gBAAkB,CACnB,AACD,6BACE,YAAc,CACf,AACD,iBACE,uBAAwB,AACxB,iBAAkB,AAClB,YAAc,CACf,AACD,gCACE,yBAA0B,AAC1B,iCAAkC,AAClC,kBAAoB,CACrB,AACD,gCACE,iBAAmB,CACpB,AACD,YACE,cAAgB,CACjB,AACD,gBACE,cAAe,AACf,WAAY,AACZ,WAAa,CACd,AACD,qBACE,0CAA4C,CAC7C,AACD,EACE,qBAAsB,AACtB,qBAAsB,AACtB,eAAiB,CAClB",file:"GenIndex.vue",sourcesContent:["\n.margin-top-8 {\n  margin-top: 8px;\n}\n.margin-top-10 {\n  margin-top: 10px;\n}\n.margin-top-20 {\n  margin-top: 20px;\n}\n.margin-left-10 {\n  margin-left: 10px;\n}\n.margin-bottom-10 {\n  margin-bottom: 10px;\n}\n.margin-bottom-100 {\n  margin-bottom: 100px;\n}\n.margin-right-10 {\n  margin-right: 10px;\n}\n.padding-left-6 {\n  padding-left: 6px;\n}\n.padding-left-8 {\n  padding-left: 5px;\n}\n.padding-left-10 {\n  padding-left: 10px;\n}\n.padding-left-20 {\n  padding-left: 20px;\n}\n.height-100 {\n  height: 100%;\n}\n.height-120px {\n  height: 100px;\n}\n.height-200px {\n  height: 200px;\n}\n.height-492px {\n  height: 492px;\n}\n.height-460px {\n  height: 460px;\n}\n.line-gray {\n  height: 0;\n  border-bottom: 2px solid #dcdcdc;\n}\n.notwrap {\n  word-break: keep-all;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.padding-left-5 {\n  padding-left: 10px;\n}\n[v-cloak] {\n  display: none;\n}\n.dragging-tip-enter-active {\n  opacity: 1;\n  transition: opacity 0.3s;\n}\n.dragging-tip-enter,\n.dragging-tip-leave-to {\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n.dragging-tip-con {\n  display: block;\n  text-align: center;\n  width: 100%;\n  height: 50px;\n}\n.dragging-tip-con span {\n  font-size: 18px;\n}\n.record-tip-con {\n  display: block;\n  width: 100%;\n  height: 292px;\n  overflow: auto;\n}\n.record-item {\n  box-sizing: content-box;\n  display: block;\n  overflow: hidden;\n  height: 24px;\n  line-height: 24px;\n  padding: 8px 10px;\n  border-bottom: 1px dashed gainsboro;\n}\n.record-tip-con span {\n  font-size: 14px;\n}\n.edittable-test-con {\n  min-height: 600px;\n}\n.edittable-testauto-con {\n  height: 100%;\n}\n.edittable-table-height-con {\n  min-height: 600px;\n}\n.edittable-table-height1-con {\n  height: 200px;\n}\n.edittable-con-1 {\n  box-sizing: content-box;\n  padding: 15px 0 0;\n  height: 550px;\n}\n.exportable-table-download-con1 {\n  padding: 16px 0 16px 20px;\n  border-bottom: 1px dashed #c3c3c3;\n  margin-bottom: 16px;\n}\n.exportable-table-download-con2 {\n  padding-left: 20px;\n}\n.show-image {\n  padding: 20px 0;\n}\n.show-image img {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n.demo-spin-icon-load {\n  animation: ani-demo-spin 1s linear infinite;\n}\np {\n  word-wrap: break-word;\n  word-break: break-all;\n  overflow: hidden;\n}\n"],sourceRoot:""}])},636:function(t,e,n){var a=n(350);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n(79)("c9dd0684",a,!0,{})},659:function(t,e,n){var a=n(1)(n(323),n(682),null,null,null);t.exports=a.exports},678:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Row",[n("Col",{attrs:{span:"6"}},[n("Card",[n("p",{attrs:{slot:"title"},slot:"title"},[n("Icon",{attrs:{type:"ios-redo"}}),t._v("\n          选择数据库\n        ")],1),t._v(" "),n("div",{staticClass:"edittable-test-con"},[n("Form",{ref:"formItem",attrs:{model:t.formItem,"label-width":100,rules:t.ruleValidate}},[n("Form-item",{attrs:{label:"机房:",prop:"computer_room"}},[n("Select",{attrs:{placeholder:"请选择"},on:{"on-change":t.Connection_Name},model:{value:t.formItem.computer_room,callback:function(e){t.$set(t.formItem,"computer_room",e)},expression:"formItem.computer_room"}},t._l(t.dataset,function(e){return n("Option",{key:e,attrs:{value:e}},[t._v(t._s(e))])}),1)],1),t._v(" "),n("Form-item",{attrs:{label:"连接名称:",prop:"connection_name"}},[n("Select",{attrs:{placeholder:"请选择"},on:{"on-change":t.DataBaseName},model:{value:t.formItem.connection_name,callback:function(e){t.$set(t.formItem,"connection_name",e)},expression:"formItem.connection_name"}},t._l(t.tableform.sqlname,function(e){return n("Option",{key:e.connection_name,attrs:{value:e.connection_name,filterable:""}},[t._v("\n                  "+t._s(e.connection_name)+"\n                ")])}),1)],1),t._v(" "),n("Form-item",{attrs:{label:"数据库库名:",prop:"basename"}},[n("Select",{attrs:{placeholder:"请选择",filterable:""},on:{"on-change":t.GetTableName},model:{value:t.formItem.basename,callback:function(e){t.$set(t.formItem,"basename",e)},expression:"formItem.basename"}},t._l(t.tableform.basename,function(e){return n("Option",{key:e,attrs:{value:e}},[t._v(t._s(e))])}),1)],1),t._v(" "),n("Form-item",{attrs:{label:"数据库表名:",prop:"tablename"}},[n("Select",{attrs:{placeholder:"请选择",filterable:""},model:{value:t.formItem.tablename,callback:function(e){t.$set(t.formItem,"tablename",e)},expression:"formItem.tablename"}},t._l(t.tableform.info,function(e){return n("Option",{key:e,attrs:{value:e}},[t._v(t._s(e))])}),1)],1),t._v(" "),n("Button",{staticStyle:{"margin-left":"20%"},attrs:{type:"warning"},on:{click:function(e){return t.canel()}}},[t._v("重置")]),t._v(" "),n("Button",{staticStyle:{"margin-left":"5%"},attrs:{type:"primary"},on:{click:function(e){return t.getinfo()}}},[t._v("连接")])],1),t._v(" "),n("br"),t._v(" "),n("Tabs",{staticStyle:{height:"300px","overflow-y":"scroll"},attrs:{value:"order1"}},[n("TabPane",{attrs:{label:"生成语句",name:"order1"}},t._l(t.sql,function(e){return n("p",{staticStyle:{"font-size":"12px",color:"#2b85e4"}},[t._v(" "+t._s(e)),n("br"),n("br")])}),0),t._v(" "),n("TabPane",{attrs:{label:"提交工单",name:"order2"}},[n("Button",{staticStyle:{"margin-left":"25%","margin-top":"20%"},attrs:{type:"primary",size:"large"},nativeOn:{click:function(e){return t.orderswitch(e)}}},[t._v("获取工单详情\n              ")])],1)],1)],1)])],1),t._v(" "),n("Col",{staticClass:"padding-left-10",attrs:{span:"18"}},[n("Card",[n("p",{attrs:{slot:"title"},slot:"title"},[n("Icon",{attrs:{type:"android-remove"}}),t._v("\n          表结构详情\n        ")],1),t._v(" "),n("div",{staticClass:"edittable-table-height-con"},[n("Tabs",{attrs:{value:t.tabs}},[n("TabPane",{attrs:{label:"表字段详情",name:"order1",icon:"folder"}},[n("Table",{attrs:{columns:t.tabcolumns,data:t.TableDataNew}})],1),t._v(" "),n("TabPane",{attrs:{label:"添加&删除索引",name:"order2",icon:"ios-unlocked"}},[n("editindex",{attrs:{tabledata:t.indexinfo,table_name:t.formItem.tablename},on:{"on-indexdata":t.getindexconfirm}}),t._v(" "),n("br"),t._v(" "),n("br"),t._v(" "),n("br"),t._v(" "),n("br")],1)],1)],1)])],1)],1),t._v(" "),n("Modal",{attrs:{"ok-text":"提交工单",width:"800"},on:{"on-ok":t.commitorder},model:{value:t.openswitch,callback:function(e){t.openswitch=e},expression:"openswitch"}},[n("Row",[n("Card",[n("div",{staticClass:"step-header-con"},[n("h3",[t._v("SQL平台审核工单")])]),t._v(" "),n("p",{staticClass:"step-content"}),t._v(" "),n("Form",{staticClass:"step-form",attrs:{"label-width":100}},[n("FormItem",{attrs:{label:"用户名:"}},[n("p",[t._v(t._s(t.username))])]),t._v(" "),n("FormItem",{attrs:{label:"数据库库名:"}},[n("p",[t._v(t._s(t.formItem.basename))])]),t._v(" "),n("FormItem",{attrs:{label:"数据库表名:"}},[n("p",[t._v(t._s(t.formItem.tablename))])]),t._v(" "),n("FormItem",{attrs:{label:"执行SQL:"}},t._l(t.sql,function(e){return n("p",[t._v(t._s(e))])}),0),t._v(" "),n("FormItem",{attrs:{label:"工单提交说明:",required:""}},[n("Input",{attrs:{placeholder:"最多不超过20个字"},model:{value:t.formItem.text,callback:function(e){t.$set(t.formItem,"text",e)},expression:"formItem.text"}})],1),t._v(" "),n("FormItem",{attrs:{label:"指定审核人:",required:""}},[n("Select",{attrs:{filterable:"",transfer:""},model:{value:t.formItem.assigned,callback:function(e){t.$set(t.formItem,"assigned",e)},expression:"formItem.assigned"}},t._l(this.assigned,function(e){return n("Option",{key:e,attrs:{value:e}},[t._v(t._s(e))])}),1)],1),t._v(" "),n("FormItem",{attrs:{label:"延迟执行"}},[n("InputNumber",{attrs:{formatter:function(t){return t+"分钟"},parser:function(t){return t.replace("分钟","")},min:0},model:{value:t.formItem.delay,callback:function(e){t.$set(t.formItem,"delay",e)},expression:"formItem.delay"}})],1),t._v(" "),n("FormItem",{attrs:{label:"是否备份"}},[n("RadioGroup",{model:{value:t.formItem.backup,callback:function(e){t.$set(t.formItem,"backup",e)},expression:"formItem.backup"}},[n("Radio",{attrs:{label:"1"}},[t._v("是")]),t._v(" "),n("Radio",{attrs:{label:"0"}},[t._v("否")])],1)],1),t._v(" "),n("FormItem",{attrs:{label:"确认提交：",required:""}},[n("Checkbox",{model:{value:t.pass,callback:function(e){t.pass=e},expression:"pass"}},[t._v("确认")])],1)],1)],1)],1)],1)],1)},staticRenderFns:[]}},682:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Table",{attrs:{stripe:"",columns:t.tabcolumns,data:t.tabledata,border:""}}),t._v(" "),n("br"),t._v(" "),n("Table",{attrs:{stripe:"",columns:t.addcolums,data:t.add_row,border:""}}),t._v(" "),n("br"),t._v(" "),n("p",[n("Icon",{attrs:{type:"plus-round"}}),t._v(" 添加索引:")],1),t._v(" "),n("div",[n("Input",{staticStyle:{width:"15%"},attrs:{placeholder:"索引名称"},model:{value:t.add_tmp.key_name,callback:function(e){t.$set(t.add_tmp,"key_name",e)},expression:"add_tmp.key_name"}}),t._v(" "),n("Select",{staticStyle:{width:"15%"},attrs:{placeholder:"索引是否唯一"},model:{value:t.add_tmp.Non_unique,callback:function(e){t.$set(t.add_tmp,"Non_unique",e)},expression:"add_tmp.Non_unique"}},[n("Option",{attrs:{value:"YES"}},[t._v("YES")]),t._v(" "),n("Option",{attrs:{value:"NO"}},[t._v("NO")])],1),t._v(" "),n("Input",{staticStyle:{width:"15%"},attrs:{placeholder:"字段名"},model:{value:t.add_tmp.column_name,callback:function(e){t.$set(t.add_tmp,"column_name",e)},expression:"add_tmp.column_name"}}),t._v(" "),n("Select",{staticStyle:{width:"20%"},attrs:{placeholder:"是否为全文索引",transfer:""},model:{value:t.add_tmp.extra,callback:function(e){t.$set(t.add_tmp,"extra",e)},expression:"add_tmp.extra"}},[n("Option",{attrs:{value:"YES"}},[t._v("设置为全文索引")]),t._v(" "),n("Option",{attrs:{value:"NO"}},[t._v("不设置为全文索引")])],1),t._v(" "),n("Button",{attrs:{type:"primary"},nativeOn:{click:function(e){return t.addcolumns(e)}}},[t._v("  添加")]),t._v(" "),n("Button",{attrs:{type:"success"},nativeOn:{click:function(e){return t.confirm2()}}},[t._v("生成索引语句")])],1)],1)},staticRenderFns:[]}},97:function(t,e,n){function a(t){n(636)}var i=n(1)(n(318),n(678),a,null,null);t.exports=i.exports}});
//# sourceMappingURL=13.bf646147e4e6379066a7.js.map
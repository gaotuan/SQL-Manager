webpackJsonp([21],{304:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a(4),r=a.n(n),o=a(2);e.default={name:"expend",data:function(){return{tabcolumns:[{title:"序号:",key:"id",sortable:!0},{title:"查询语句:",key:"statements",sortable:!0}],TableDataNew:[]}},mounted:function(){var t=this;r.a.post(o.a.url+"/query_worklf/",{workid:this.$route.query.workid,user:this.$route.query.user}).then(function(e){t.TableDataNew=e.data}).catch(function(t){o.a.err_notice(t)})}}},344:function(t,e,a){e=t.exports=a(78)(!0),e.push([t.i,"","",{version:3,sources:[],names:[],mappings:"",file:"expend.vue",sourceRoot:""}])},626:function(t,e,a){var n=a(344);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a(79)("d234459e",n,!0,{})},665:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("Card",[a("p",{staticStyle:{height:"45px"},attrs:{slot:"title"},slot:"title"},[a("Icon",{attrs:{type:"android-send"}}),t._v("\n      工单"+t._s(this.$route.query.workid)+"详细信息\n      "),a("br"),t._v(" "),a("Button",{attrs:{type:"text"},nativeOn:{click:function(e){t.$router.go(-1)}}},[t._v("返回")])],1),t._v(" "),a("Table",{staticClass:"tabletop",staticStyle:{background:"#5cadff"},attrs:{border:"",columns:t.tabcolumns,data:t.TableDataNew,size:"large"}})],1)],1)},staticRenderFns:[]}},87:function(t,e,a){function n(t){a(626)}var r=a(1)(a(304),a(665),n,"data-v-5d978d54",null);t.exports=r.exports}});
//# sourceMappingURL=21.04450ac340023c671040.js.map
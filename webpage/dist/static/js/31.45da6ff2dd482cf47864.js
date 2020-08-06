webpackJsonp([31],{306:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=r(4),o=r.n(s),i=r(2);e.default={name:"permission",data:function(){var t=this;return{permissondata:[],permissoncolums:[{type:"selection",width:60,align:"center"},{title:"申请编号",key:"work_id"},{title:"申请人",key:"username"},{title:"状态",key:"status",width:150,render:function(t,e){var r=e.row,s="",o="";return 2===r.status?(s="blue",o="待审核"):0===r.status?(s="red",o="驳回"):1===r.status?(s="green",o="已执行"):(s="yellow",o="执行中"),t("Tag",{props:{type:"dot",color:s}},o)},sortable:!0,filters:[{label:"已执行",value:1},{label:"驳回",value:0},{label:"待审核",value:2},{label:"执行中",value:3}],filterMethod:function(t,e){return 1===t?1===e.status:2===t?2===e.status:0===t?0===e.status:3===t?3===e.status:void 0}},{title:"操作",key:"action",width:200,align:"center",render:function(e,r){return e("div",[e("Button",{props:{size:"small",type:"text"},on:{click:function(){t.modalinfo(r.row)}}},"查看")])}}],per_pn:1,delrecord:[],editInfodModal:!1,permission:{},user:"",work_id:""}},methods:{permisson_list:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;o.a.get(i.a.url+"/audit_grained?page="+e).then(function(e){t.permissondata=e.data.data,t.per_pn=e.data.pn}).catch(function(t){i.a.err_notice(t)})},delrecordData:function(){var t=this;o.a.put(i.a.url+"/audit_grained/",{work_id:JSON.stringify(this.delrecord)}).then(function(e){i.a.notice(e.data),t.permisson_list()}).catch(function(t){i.a.err_notice(t)})},delrecordList:function(t){this.delrecord=t.map(function(t){return t.work_id})},modalinfo:function(t){this.editInfodModal=!0,this.permission=t.permissions,this.user=t.username,this.work_id=t.work_id},savedata:function(){var t=this;o.a.post(i.a.url+"/audit_grained/",{status:0,user:this.user,work_id:this.work_id,grained_list:JSON.stringify(this.permission)}).then(function(e){i.a.notice(e.data),t.editInfodModal=!1,t.permisson_list()}).catch(function(t){i.a.err_notice(t)})},reject:function(){var t=this;o.a.post(i.a.url+"/audit_grained/",{status:1,user:this.user,work_id:this.work_id}).then(function(e){i.a.notice(e.data),t.editInfodModal=!1,t.permisson_list()}).catch(function(t){i.a.err_notice(t)})}},mounted:function(){this.permisson_list()}}},375:function(t,e,r){e=t.exports=r(78)(!0),e.push([t.i,"","",{version:3,sources:[],names:[],mappings:"",file:"Permissions.vue",sourceRoot:""}])},663:function(t,e,r){var s=r(375);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);r(79)("7325686c",s,!0,{})},711:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("Row",[r("Card",[r("p",{attrs:{slot:"title"},slot:"title"},[r("Icon",{attrs:{type:"person"}}),t._v("\n        权限审核\n      ")],1),t._v(" "),r("Row",[r("Col",{attrs:{span:"24"}},[r("Poptip",{attrs:{confirm:"",title:"您确认删除这些工单信息吗?"},on:{"on-ok":t.delrecordData}},[r("Button",{staticStyle:{"margin-left":"-1%"},attrs:{type:"text"}},[t._v("删除记录")])],1),t._v(" "),r("Table",{ref:"selection",attrs:{border:"",columns:t.permissoncolums,data:t.permissondata,stripe:""},on:{"on-selection-change":t.delrecordList}}),t._v(" "),r("br"),t._v(" "),r("Page",{ref:"perpage",attrs:{total:t.per_pn,"show-elevator":"","page-size":20},on:{"on-change":t.permisson_list}})],1)],1)],1)],1),t._v(" "),r("Modal",{attrs:{width:800},model:{value:t.editInfodModal,callback:function(e){t.editInfodModal=e},expression:"editInfodModal"}},[r("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[t._v("权限申请单")]),t._v(" "),r("Form",{attrs:{"label-width":120,"label-position":"right"}},[[r("FormItem",{attrs:{label:"DDL及索引权限:"}},["0"===t.permission.ddl?r("p",[t._v("否")]):r("p",[t._v("是")])]),t._v(" "),"0"!==t.permission.ddl?[r("FormItem",{attrs:{label:"连接名:"}},t._l(t.permission.ddlcon,function(e){return r("span",{staticStyle:{"margin-left":"1%"}},[t._v(t._s(e))])}),0)]:t._e(),t._v(" "),r("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),t._v(" "),r("br"),t._v(" "),r("FormItem",{attrs:{label:"DML权限:"}},["0"===t.permission.dml?r("p",[t._v("否")]):r("p",[t._v("是")])]),t._v(" "),"1"===t.permission.dml?[r("FormItem",{attrs:{label:"连接名:"}},t._l(t.permission.dmlcon,function(e){return r("span",{staticStyle:{"margin-left":"1%"}},[t._v(t._s(e))])}),0)]:t._e(),t._v(" "),r("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),t._v(" "),r("br"),t._v(" "),r("FormItem",{attrs:{label:"上级审核人范围:"}},t._l(t.permission.person,function(e){return r("span",{staticStyle:{"margin-left":"1%"}},[t._v(t._s(e))])}),0),t._v(" "),r("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),t._v(" "),r("br"),t._v(" "),r("FormItem",{attrs:{label:"数据查询权限:"}},["0"===t.permission.query?r("p",[t._v("否")]):r("p",[t._v("是")])]),t._v(" "),"1"===t.permission.query?[r("FormItem",{attrs:{label:"连接名:"}},t._l(t.permission.querycon,function(e){return r("span",{staticStyle:{"margin-left":"1%"}},[t._v(t._s(e))])}),0)]:t._e(),t._v(" "),r("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),t._v(" "),r("br"),t._v(" "),r("FormItem",{attrs:{label:"数据字典权限:"}},["0"===t.permission.dic?r("p",[t._v("否")]):r("p",[t._v("是")])]),t._v(" "),"1"===t.permission.dic?[r("FormItem",{attrs:{label:"数据字典修改权限:"}},["0"===t.permission.dicedit?r("p",[t._v("否")]):r("p",[t._v("是")])]),t._v(" "),r("FormItem",{attrs:{label:"数据字典导出权限:"}},["0"===t.permission.dicexport?r("p",[t._v("否")]):r("p",[t._v("是")])]),t._v(" "),r("FormItem",{attrs:{label:"连接名:"}},t._l(t.permission.diccon,function(e){return r("span",{staticStyle:{"margin-left":"1%"}},[t._v(t._s(e))])}),0)]:t._e()],t._v(" "),r("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),t._v(" "),r("br"),t._v(" "),r("FormItem",{attrs:{label:"用户管理权限:"}},["0"===t.permission.user?r("p",[t._v("否")]):r("p",[t._v("是")])]),t._v(" "),r("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),t._v(" "),r("br"),t._v(" "),r("FormItem",{attrs:{label:"数据库管理权限:"}},["0"===t.permission.base?r("p",[t._v("否")]):r("p",[t._v("是")])])],2),t._v(" "),r("div",{attrs:{slot:"footer"},slot:"footer"},[r("Button",{attrs:{type:"primary"},on:{click:function(e){t.editInfodModal=!1}}},[t._v("取消")]),t._v(" "),r("Button",{attrs:{type:"error"},on:{click:t.reject}},[t._v("驳回")]),t._v(" "),r("Button",{attrs:{type:"success"},on:{click:t.savedata}},[t._v("保存")])],1)],1)],1)},staticRenderFns:[]}},83:function(t,e,r){function s(t){r(663)}var o=r(1)(r(306),r(711),s,"data-v-e2c00e48",null);t.exports=o.exports}});
//# sourceMappingURL=31.45da6ff2dd482cf47864.js.map
webpackJsonp([19],{320:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(4),i=n.n(a),o=n(2);e.default={name:"put",data:function(){var t=this;return{editforward:!1,cur_assigne:"",id:"",forward_assigne:"",forwares:[],v_searchmem:"",v_searchorder:"",columns:[{title:"工单编号:",key:"work_id",sortable:!0},{title:"工单说明",key:"text"},{title:"是否备份",key:"backup"},{title:"提交时间:",key:"date",sortable:!0},{title:"审核人",key:"assigned",sortable:!0},{title:"状态",key:"status",render:function(t,e){var n=e.row,a="",i="";return 2===n.status?(a="blue",i="待审核"):0===n.status?(a="red",i="驳回"):1===n.status?(a="green",i="已执行"):4===n.status?(a="red",i="执行失败"):(a="yellow",i="执行中"),t("Tag",{props:{type:"dot",color:a}},i)},sortable:!0,filters:[{label:"已执行",value:1},{label:"驳回",value:0},{label:"待审核",value:2},{label:"执行中",value:3},{label:"执行失败",value:4}],filterMethod:function(t,e){return 1===t?1===e.status:2===t?2===e.status:0===t?0===e.status:3===t?3===e.status:4===e.status}},{title:"操作",key:"action",align:"center",render:function(e,n){return 2===n.row.status?e("div",[e("Button",{props:{size:"small",type:"text"},on:{click:function(){t.$router.push({name:"orderlist",query:{workid:n.row.work_id,id:n.row.id,status:n.row.status,type:n.row.type}})}}},"详细信息"),e("Button",{props:{size:"small",type:"text"},on:{click:function(){t.Forward(n.row)}}},"转发")]):e("div",[e("Button",{props:{size:"small",type:"text"},on:{click:function(){t.$router.push({name:"orderlist",query:{workid:n.row.work_id,id:n.row.id,status:n.row.status,type:n.row.type}})}}},"详细信息")])}}],page_number:1,computer_room:o.a.computer_room,table_data:[]}},methods:{Forward:function(t){var e=this;this.editforward=!0,this.cur_assigne=t.assigned,this.id=t.id,i.a.post(o.a.url+"/ops/get_assigned",{username:t.username}).then(function(t){t.data.error?(e.$Message.error(t.data.error),o.a.err_notice(t.data.error)):e.forwares=t.data.assigned})},PutForward:function(){var t=this;this.editforward=!1,i.a.post(o.a.url+"/ops/put_assigned",{id:this.id,forward_assigne:this.forward_assigne}).then(function(e){e.data.error?(t.$Message.error(e.data.error),o.a.err_notice(e.data.error)):o.a.notice("转发成功！")}),setTimeout(function(){t.currentpage()},500)},currentpage:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;i.a.get(o.a.url+"/myorder/?user="+sessionStorage.getItem("user")+"&page="+e).then(function(e){t.table_data=e.data.data,t.table_data.forEach(function(t){1===t.backup?t.backup="是":t.backup="否"}),t.page_number=parseInt(e.data.page)}).catch(function(t){o.a.err_notice(t)})},searchorder:function(){var t=this;this.tmp=[],""===this.v_searchorder?this.currentpage():i.a.get(o.a.url+"/myorder?user="+sessionStorage.getItem("user")+"&page=n&opt="+this.v_searchmem+"&mess="+this.v_searchorder).then(function(e){t.table_data=e.data.data,t.table_data.forEach(function(t){1===t.backup?t.backup="是":t.backup="否"}),t.page_number=parseInt(e.data.page)}).catch(function(t){o.a.err_notice(t)})}},mounted:function(){this.currentpage()}}},354:function(t,e,n){e=t.exports=n(78)(!0),e.push([t.i,".margin-top-8{margin-top:8px}.margin-top-10{margin-top:10px}.margin-top-20{margin-top:20px}.margin-left-10{margin-left:10px}.margin-bottom-10{margin-bottom:10px}.margin-bottom-100{margin-bottom:100px}.margin-right-10{margin-right:10px}.padding-left-6{padding-left:6px}.padding-left-8{padding-left:5px}.padding-left-10{padding-left:10px}.padding-left-20{padding-left:20px}.height-100{height:100%}.height-120px{height:100px}.height-200px{height:200px}.height-492px{height:492px}.height-460px{height:460px}.line-gray{height:0;border-bottom:2px solid #dcdcdc}.notwrap{word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.padding-left-5{padding-left:10px}[v-cloak]{display:none}.dragging-tip-enter-active{opacity:1;transition:opacity .3s}.dragging-tip-enter,.dragging-tip-leave-to{opacity:0;transition:opacity .3s}.dragging-tip-con{display:block;text-align:center;width:100%;height:50px}.dragging-tip-con span{font-size:18px}.record-tip-con{display:block;width:100%;height:292px;overflow:auto}.record-item{box-sizing:content-box;display:block;overflow:hidden;height:24px;line-height:24px;padding:8px 10px;border-bottom:1px dashed #dcdcdc}.record-tip-con span{font-size:14px}.edittable-test-con{min-height:600px}.edittable-testauto-con{height:100%}.edittable-table-height-con{min-height:600px}.edittable-table-height1-con{height:200px}.edittable-con-1{box-sizing:content-box;padding:15px 0 0;height:550px}.exportable-table-download-con1{padding:16px 0 16px 20px;border-bottom:1px dashed #c3c3c3;margin-bottom:16px}.exportable-table-download-con2{padding-left:20px}.show-image{padding:20px 0}.show-image img{display:block;width:100%;height:auto}","",{version:3,sources:["/Users/gaoshaopang/PycharmProjects/Yearning-1.2.0_me/webpage/src/components/Order/MyOrder.vue"],names:[],mappings:"AACA,cACE,cAAgB,CACjB,AACD,eACE,eAAiB,CAClB,AACD,eACE,eAAiB,CAClB,AACD,gBACE,gBAAkB,CACnB,AACD,kBACE,kBAAoB,CACrB,AACD,mBACE,mBAAqB,CACtB,AACD,iBACE,iBAAmB,CACpB,AACD,gBACE,gBAAkB,CACnB,AACD,gBACE,gBAAkB,CACnB,AACD,iBACE,iBAAmB,CACpB,AACD,iBACE,iBAAmB,CACpB,AACD,YACE,WAAa,CACd,AACD,cACE,YAAc,CACf,AACD,cACE,YAAc,CACf,AACD,cACE,YAAc,CACf,AACD,cACE,YAAc,CACf,AACD,WACE,SAAU,AACV,+BAAiC,CAClC,AACD,SACE,oBAAqB,AACrB,mBAAoB,AACpB,gBAAiB,AACjB,sBAAwB,CACzB,AACD,gBACE,iBAAmB,CACpB,AACD,UACE,YAAc,CACf,AACD,2BACE,UAAW,AACX,sBAAyB,CAC1B,AACD,2CAEE,UAAW,AACX,sBAAyB,CAC1B,AACD,kBACE,cAAe,AACf,kBAAmB,AACnB,WAAY,AACZ,WAAa,CACd,AACD,uBACE,cAAgB,CACjB,AACD,gBACE,cAAe,AACf,WAAY,AACZ,aAAc,AACd,aAAe,CAChB,AACD,aACE,uBAAwB,AACxB,cAAe,AACf,gBAAiB,AACjB,YAAa,AACb,iBAAkB,AAClB,iBAAkB,AAClB,gCAAoC,CACrC,AACD,qBACE,cAAgB,CACjB,AACD,oBACE,gBAAkB,CACnB,AACD,wBACE,WAAa,CACd,AACD,4BACE,gBAAkB,CACnB,AACD,6BACE,YAAc,CACf,AACD,iBACE,uBAAwB,AACxB,iBAAkB,AAClB,YAAc,CACf,AACD,gCACE,yBAA0B,AAC1B,iCAAkC,AAClC,kBAAoB,CACrB,AACD,gCACE,iBAAmB,CACpB,AACD,YACE,cAAgB,CACjB,AACD,gBACE,cAAe,AACf,WAAY,AACZ,WAAa,CACd",file:"MyOrder.vue",sourcesContent:["\n.margin-top-8 {\n  margin-top: 8px;\n}\n.margin-top-10 {\n  margin-top: 10px;\n}\n.margin-top-20 {\n  margin-top: 20px;\n}\n.margin-left-10 {\n  margin-left: 10px;\n}\n.margin-bottom-10 {\n  margin-bottom: 10px;\n}\n.margin-bottom-100 {\n  margin-bottom: 100px;\n}\n.margin-right-10 {\n  margin-right: 10px;\n}\n.padding-left-6 {\n  padding-left: 6px;\n}\n.padding-left-8 {\n  padding-left: 5px;\n}\n.padding-left-10 {\n  padding-left: 10px;\n}\n.padding-left-20 {\n  padding-left: 20px;\n}\n.height-100 {\n  height: 100%;\n}\n.height-120px {\n  height: 100px;\n}\n.height-200px {\n  height: 200px;\n}\n.height-492px {\n  height: 492px;\n}\n.height-460px {\n  height: 460px;\n}\n.line-gray {\n  height: 0;\n  border-bottom: 2px solid #dcdcdc;\n}\n.notwrap {\n  word-break: keep-all;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.padding-left-5 {\n  padding-left: 10px;\n}\n[v-cloak] {\n  display: none;\n}\n.dragging-tip-enter-active {\n  opacity: 1;\n  transition: opacity 0.3s;\n}\n.dragging-tip-enter,\n.dragging-tip-leave-to {\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n.dragging-tip-con {\n  display: block;\n  text-align: center;\n  width: 100%;\n  height: 50px;\n}\n.dragging-tip-con span {\n  font-size: 18px;\n}\n.record-tip-con {\n  display: block;\n  width: 100%;\n  height: 292px;\n  overflow: auto;\n}\n.record-item {\n  box-sizing: content-box;\n  display: block;\n  overflow: hidden;\n  height: 24px;\n  line-height: 24px;\n  padding: 8px 10px;\n  border-bottom: 1px dashed gainsboro;\n}\n.record-tip-con span {\n  font-size: 14px;\n}\n.edittable-test-con {\n  min-height: 600px;\n}\n.edittable-testauto-con {\n  height: 100%;\n}\n.edittable-table-height-con {\n  min-height: 600px;\n}\n.edittable-table-height1-con {\n  height: 200px;\n}\n.edittable-con-1 {\n  box-sizing: content-box;\n  padding: 15px 0 0;\n  height: 550px;\n}\n.exportable-table-download-con1 {\n  padding: 16px 0 16px 20px;\n  border-bottom: 1px dashed #c3c3c3;\n  margin-bottom: 16px;\n}\n.exportable-table-download-con2 {\n  padding-left: 20px;\n}\n.show-image {\n  padding: 20px 0;\n}\n.show-image img {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n"],sourceRoot:""}])},640:function(t,e,n){var a=n(354);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n(79)("be54de98",a,!0,{})},684:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Row",[n("Card",[n("row",[n("Form",[n("FormItem",[n("Input",{staticStyle:{width:"400px"},attrs:{placeholder:"输入搜索内容..."},model:{value:t.v_searchorder,callback:function(e){t.v_searchorder=e},expression:"v_searchorder"}},[n("Select",{staticStyle:{width:"80px"},attrs:{slot:"prepend",placeholder:"工单编号"},slot:"prepend",model:{value:t.v_searchmem,callback:function(e){t.v_searchmem=e},expression:"v_searchmem"}},[n("Option",{attrs:{value:"o"}},[t._v("工单编号")]),t._v(" "),n("Option",{attrs:{value:"u"}},[t._v("工单说明")])],1),t._v(" "),n("Button",{attrs:{slot:"append",type:"warning",icon:"ios-search"},nativeOn:{click:function(e){return t.searchorder(e)}},slot:"append"})],1)],1)],1)],1),t._v(" "),n("Row",[n("Col",{attrs:{span:"24"}},[n("Table",{attrs:{border:"",columns:t.columns,data:t.table_data,stripe:"",size:"small"}})],1)],1),t._v(" "),n("br"),t._v(" "),n("Page",{attrs:{total:t.page_number,"show-elevator":"","page-size":20},on:{"on-change":t.currentpage}})],1)],1),t._v(" "),n("Modal",{attrs:{closable:!0,"mask-closable":!0,width:350},model:{value:t.editforward,callback:function(e){t.editforward=e},expression:"editforward"}},[n("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[t._v("工单转发:")]),t._v(" "),n("Form",{attrs:{"label-width":80,"label-position":"center"}},[n("FormItem",{attrs:{label:"当前审核人:"}},[t._v(" "+t._s(this.cur_assigne))]),t._v(" "),n("FormItem",{attrs:{label:"转交审核人:"}},[n("Select",{attrs:{filterable:"",clearable:"",placeholder:"请选择新的审核人"},model:{value:t.forward_assigne,callback:function(e){t.forward_assigne=e},expression:"forward_assigne"}},t._l(this.forwares,function(e){return n("Option",{key:e,attrs:{value:e}},[t._v(t._s(e))])}),1)],1)],1),t._v(" "),n("div",{attrs:{slot:"footer"},slot:"footer"},[n("Button",{attrs:{type:"text"},on:{click:function(e){t.editforward=!1}}},[t._v("取消")]),t._v(" "),n("Button",{attrs:{type:"warning"},on:{click:t.PutForward}},[t._v("确认")])],1)],1)],1)},staticRenderFns:[]}},99:function(t,e,n){function a(t){n(640)}var i=n(1)(n(320),n(684),a,null,null);t.exports=i.exports}});
//# sourceMappingURL=19.4de8b9612688b6c1c09a.js.map
webpackJsonp([19],{316:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=o(2),n=o(4),r=o.n(n),a=function(e){return"string"==typeof e?"1"===e?"是":"否":e.toString()};t.default={name:"own-space",data:function(){var e=this;return{editEmailModal:!1,editEmailForm:{mail:""},userForm:{},formItem:{ddl:"",ddlcon:""},uid:"",save_loading:!1,editPasswordModal:!1,savePassLoading:!1,oldPassError:"",checkIdentifyCodeLoading:!1,editPasswordForm:{oldPass:"",newPass:"",rePass:""},passwordValidate:{oldPass:[{required:!0,message:"请输入原密码",trigger:"blur"}],newPass:[{required:!0,message:"请输入新密码",trigger:"blur"},{min:6,message:"请至少输入6个字符",trigger:"blur"},{max:32,message:"最多输入32个字符",trigger:"blur"}],rePass:[{required:!0,message:"请再次输入新密码",trigger:"blur"},{validator:function(t,o,s){o!==e.editPasswordForm.newPass?s(new Error("两次输入密码不一致")):s()},trigger:"blur"}]},editInfodModal:!1,permission:{ddl:"0",ddlcon:[],dml:"0",dmlcon:[],dic:"0",diccon:[],dicedit:"0",dicexport:"0",index:"0",indexcon:[],user:"0",base:"0"},indeterminate:{ddl:!0,dml:!0,query:!0,dic:!0,person:!0},checkAll:{ddl:!1,dml:!1,query:!1,dic:!1,person:!1},connectionList:{connection:[],dic:[],person:[]}}},methods:{saveEditPass:function(){var e=this;this.$refs.editPasswordForm.validate(function(t){t&&(e.savePassLoading=!0,r.a.post(s.a.url+"/otheruser/changepwd",{username:sessionStorage.getItem("user"),new:e.editPasswordForm.newPass,old:e.editPasswordForm.oldPass}).then(function(t){s.a.notice(t.data),e.editPasswordModal=!1}).catch(function(e){s.a.err_notice(e)}),e.savePassLoading=!1)});for(var t in this.editPasswordForm)this.editPasswordForm[t]=""},saveEmail:function(){var e=this;this.savePassLoading=!0,r.a.put(s.a.url+"/otheruser/mail",{mail:this.editEmailForm.mail}).then(function(t){s.a.notice(t.data),e.editEmailModal=!1}).catch(function(e){s.a.err_notice(e)}),this.savePassLoading=!1},init:function(){var e=this;r.a.put(s.a.url+"/homedata/ownspace",{user:sessionStorage.getItem("user")}).then(function(t){e.userForm=t.data.userinfo,e.formItem.ddl=a(t.data.permissons.ddl),e.formItem.ddlcon=a(t.data.permissons.ddlcon),e.formItem.dml=a(t.data.permissons.dml),e.formItem.dmlcon=a(t.data.permissons.dmlcon),e.formItem.dic=a(t.data.permissons.dic),e.formItem.diccon=a(t.data.permissons.diccon),e.formItem.query=a(t.data.permissons.query),e.formItem.querycon=a(t.data.permissons.querycon),e.formItem.user=a(t.data.permissons.user),e.formItem.base=a(t.data.permissons.base)})},ApplyForPermission:function(){var e=this;this.editInfodModal=!0,r.a.get(s.a.url+"/userinfo/permissions?user="+sessionStorage.getItem("user")).then(function(t){e.permission=t.data})},ddlCheckAll:function(e,t,o){this.indeterminate[t]?this.checkAll[t]=!1:this.checkAll[t]=!this.checkAll[t],this.indeterminate[t]=!1,this.checkAll[t]?this.permission[e]="dic"===o?this.connectionList[o].map(function(e){return e.Name}):"person"===o?this.connectionList[o].map(function(e){return e.username}):this.connectionList[o].map(function(e){return e.connection_name}):this.permission[e]=[]},PutPermissionData:function(){var e=this;r.a.post(s.a.url+"/apply_grained/",{grained_list:JSON.stringify(this.permission)}).then(function(t){s.a.notice(t.data),e.editInfodModal=!1}).catch(function(e){s.a.err_notice(e)})}},mounted:function(){var e=this;this.init(),r.a.put(s.a.url+"/workorder/connection",{permissions_type:"own_space"}).then(function(t){e.connectionList.connection=t.data.connection,e.connectionList.dic=t.data.dic,e.connectionList.person=t.data.person}).catch(function(e){s.a.err_notice(e)})}}},344:function(e,t,o){t=e.exports=o(78)(!0),t.push([e.i,".own-space-btn-box{margin-bottom:10px}.own-space-btn-box button{padding-left:0}.own-space-btn-box button span{color:#2d8cf0;transition:all .2s}.own-space-btn-box button span:hover{color:#0c25f1;transition:all .2s}.own-space-tra{width:10px;height:10px;transform:rotate(45deg);margin-top:-6px;left:-3px;background-color:#fff;z-index:100}.own-space-input-identifycode-con,.own-space-tra{position:absolute;top:50%;box-shadow:0 0 2px 3px rgba(0,0,0,.1)}.own-space-input-identifycode-con{width:200px;height:100px;right:-220px;margin-top:-50px;border-radius:4px}","",{version:3,sources:["/Users/gaoshaopang/PycharmProjects/Yearning-1.2.0_me/webpage/src/components/Myself/own-space.vue"],names:[],mappings:"AACA,mBACE,kBAAoB,CACrB,AACD,0BACE,cAAgB,CACjB,AACD,+BACE,cAAe,AACf,kBAAqB,CACtB,AACD,qCACE,cAAe,AACf,kBAAqB,CACtB,AACD,eACE,WAAY,AACZ,YAAa,AACb,wBAAyB,AAGzB,gBAAiB,AACjB,UAAW,AAEX,sBAAwB,AACxB,WAAa,CACd,AACD,iDARE,kBAAmB,AACnB,QAAS,AAGT,qCAA2C,CAa5C,AATD,kCAEE,YAAa,AACb,aAAc,AACd,aAAc,AAEd,iBAAkB,AAClB,iBAAmB,CAEpB",file:"own-space.vue",sourcesContent:["\n.own-space-btn-box {\n  margin-bottom: 10px;\n}\n.own-space-btn-box button {\n  padding-left: 0;\n}\n.own-space-btn-box button span {\n  color: #2D8CF0;\n  transition: all 0.2s;\n}\n.own-space-btn-box button span:hover {\n  color: #0C25F1;\n  transition: all 0.2s;\n}\n.own-space-tra {\n  width: 10px;\n  height: 10px;\n  transform: rotate(45deg);\n  position: absolute;\n  top: 50%;\n  margin-top: -6px;\n  left: -3px;\n  box-shadow: 0 0 2px 3px rgba(0, 0, 0, 0.1);\n  background-color: white;\n  z-index: 100;\n}\n.own-space-input-identifycode-con {\n  position: absolute;\n  width: 200px;\n  height: 100px;\n  right: -220px;\n  top: 50%;\n  margin-top: -50px;\n  border-radius: 4px;\n  box-shadow: 0 0 2px 3px rgba(0, 0, 0, 0.1);\n}\n"],sourceRoot:""}])},629:function(e,t,o){var s=o(344);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);o(79)("fadd5670",s,!0,{})},669:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("Card",[o("p",{attrs:{slot:"title"},slot:"title"},[o("Icon",{attrs:{type:"person"}}),e._v("\n      个人信息\n    ")],1),e._v(" "),o("div",[o("Form",{ref:"userForm",attrs:{model:e.userForm,"label-width":100,"label-position":"right"}},[o("FormItem",{attrs:{label:"用户名：",prop:"name"}},[o("div",{staticStyle:{display:"inline-block",width:"300px"}},[o("span",[e._v(e._s(e.userForm.username))])])]),e._v(" "),o("FormItem",{attrs:{label:"部门："}},[o("span",[e._v(e._s(e.userForm.department))])]),e._v(" "),o("FormItem",{attrs:{label:"权限分类："}},[o("span",[e._v(e._s(e.userForm.group))])]),e._v(" "),o("FormItem",{attrs:{label:"邮箱："}},[o("span",[e._v(e._s(e.userForm.email))])]),e._v(" "),o("FormItem",{attrs:{label:"具体权限："}},[o("br"),e._v(" "),o("FormItem",{attrs:{label:"DDL是否可见:"}},[o("p",[e._v(e._s(e.formItem.ddl))])]),e._v(" "),"是"===e.formItem.ddl?o("FormItem",{attrs:{label:"可访问的连接名:"}},[o("p",[e._v(e._s(e.formItem.ddlcon))])]):e._e(),e._v(" "),o("FormItem",{attrs:{label:"DML是否可见:"}},[o("p",[e._v(e._s(e.formItem.dml))])]),e._v(" "),"是"===e.formItem.dml?o("FormItem",{attrs:{label:"可访问的连接名:"}},[o("p",[e._v(e._s(e.formItem.dmlcon))])]):e._e(),e._v(" "),o("FormItem",{attrs:{label:"查询是否可见:"}},[o("p",[e._v(e._s(e.formItem.query))])]),e._v(" "),"是"===e.formItem.query?o("FormItem",{attrs:{label:"可访问的连接名:"}},[o("p",[e._v(e._s(e.formItem.querycon))])]):e._e(),e._v(" "),o("FormItem",{attrs:{label:"字典是否可见:"}},[o("p",[e._v(e._s(e.formItem.dic))])]),e._v(" "),"是"===e.formItem.dic?o("FormItem",{attrs:{label:"可访问的连接名:"}},[o("p",[e._v(e._s(e.formItem.diccon))])]):e._e(),e._v(" "),o("FormItem",{attrs:{label:"用户管理权限:"}},[o("p",[e._v(e._s(e.formItem.user))])]),e._v(" "),o("FormItem",{attrs:{label:"数据库管理权限:"}},[o("p",[e._v(e._s(e.formItem.base))])])],1),e._v(" "),o("FormItem",{attrs:{label:"编辑："}},[o("Button",{attrs:{type:"warning",size:"small"},on:{click:function(t){e.editPasswordModal=!0}}},[e._v("修改密码")]),e._v(" "),o("Button",{attrs:{type:"primary",size:"small"},on:{click:function(t){e.editEmailModal=!0}}},[e._v("修改邮箱")]),e._v(" "),o("Button",{attrs:{type:"success",size:"small"},on:{click:e.ApplyForPermission}},[e._v("权限申请")])],1)],1)],1)]),e._v(" "),o("Modal",{attrs:{closable:!1,"mask-closable":!1,width:500},model:{value:e.editPasswordModal,callback:function(t){e.editPasswordModal=t},expression:"editPasswordModal"}},[o("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[e._v("修改密码")]),e._v(" "),o("Form",{ref:"editPasswordForm",attrs:{model:e.editPasswordForm,"label-width":100,"label-position":"right",rules:e.passwordValidate}},[o("FormItem",{attrs:{label:"原密码",prop:"oldPass",error:e.oldPassError}},[o("Input",{attrs:{placeholder:"请输入现在使用的密码",type:"password"},model:{value:e.editPasswordForm.oldPass,callback:function(t){e.$set(e.editPasswordForm,"oldPass",t)},expression:"editPasswordForm.oldPass"}})],1),e._v(" "),o("FormItem",{attrs:{label:"新密码",prop:"newPass"}},[o("Input",{attrs:{placeholder:"请输入新密码，至少6位字符",type:"password"},model:{value:e.editPasswordForm.newPass,callback:function(t){e.$set(e.editPasswordForm,"newPass",t)},expression:"editPasswordForm.newPass"}})],1),e._v(" "),o("FormItem",{attrs:{label:"确认新密码",prop:"rePass"}},[o("Input",{attrs:{placeholder:"请再次输入新密码",type:"password"},model:{value:e.editPasswordForm.rePass,callback:function(t){e.$set(e.editPasswordForm,"rePass",t)},expression:"editPasswordForm.rePass"}})],1)],1),e._v(" "),o("div",{attrs:{slot:"footer"},slot:"footer"},[o("Button",{attrs:{type:"text"},on:{click:function(t){e.editPasswordModal=!1}}},[e._v("取消")]),e._v(" "),o("Button",{attrs:{type:"primary",loading:e.savePassLoading},on:{click:e.saveEditPass}},[e._v("保存")])],1)],1),e._v(" "),o("Modal",{attrs:{closable:!1,"mask-closable":!1,width:500},model:{value:e.editEmailModal,callback:function(t){e.editEmailModal=t},expression:"editEmailModal"}},[o("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[e._v("邮箱修改")]),e._v(" "),o("Form",{attrs:{"label-width":100,"label-position":"right"}},[o("FormItem",{attrs:{label:"邮箱地址"}},[o("Input",{model:{value:e.editEmailForm.mail,callback:function(t){e.$set(e.editEmailForm,"mail",t)},expression:"editEmailForm.mail"}})],1)],1),e._v(" "),o("div",{attrs:{slot:"footer"},slot:"footer"},[o("Button",{attrs:{type:"text"},on:{click:function(t){e.editEmailModal=!1}}},[e._v("取消")]),e._v(" "),o("Button",{attrs:{type:"primary",loading:e.savePassLoading},on:{click:e.saveEmail}},[e._v("保存")])],1)],1),e._v(" "),o("Modal",{attrs:{width:1e3},model:{value:e.editInfodModal,callback:function(t){e.editInfodModal=t},expression:"editInfodModal"}},[o("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[e._v("权限申请单")]),e._v(" "),o("Form",{attrs:{"label-width":120,"label-position":"right"}},[[o("FormItem",{attrs:{label:"DDL及索引权限:"}},[o("RadioGroup",{model:{value:e.permission.ddl,callback:function(t){e.$set(e.permission,"ddl",t)},expression:"permission.ddl"}},[o("Radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),o("Radio",{attrs:{label:"0"}},[e._v("否")])],1)],1),e._v(" "),"1"===e.permission.ddl?[o("FormItem",{attrs:{label:"连接名:"}},[o("div",{staticStyle:{"border-bottom":"1px solid #e9e9e9","padding-bottom":"6px","margin-bottom":"6px"}},[o("Checkbox",{attrs:{indeterminate:e.indeterminate.ddl,value:e.checkAll.ddl},nativeOn:{click:function(t){return t.preventDefault(),e.ddlCheckAll("ddlcon","ddl","connection")}}},[e._v("全选\n              ")])],1),e._v(" "),o("CheckboxGroup",{model:{value:e.permission.ddlcon,callback:function(t){e.$set(e.permission,"ddlcon",t)},expression:"permission.ddlcon"}},e._l(e.connectionList.connection,function(t){return o("Checkbox",{key:t.connection_name,attrs:{label:t.connection_name}},[e._v("\n                "+e._s(t.connection_name)+"\n              ")])}),1)],1)]:e._e(),e._v(" "),o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"DML权限:"}},[o("RadioGroup",{model:{value:e.permission.dml,callback:function(t){e.$set(e.permission,"dml",t)},expression:"permission.dml"}},[o("Radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),o("Radio",{attrs:{label:"0"}},[e._v("否")])],1)],1),e._v(" "),"1"===e.permission.dml?[o("FormItem",{attrs:{label:"连接名:"}},[o("div",{staticStyle:{"border-bottom":"1px solid #e9e9e9","padding-bottom":"6px","margin-bottom":"6px"}},[o("Checkbox",{attrs:{indeterminate:e.indeterminate.dml,value:e.checkAll.dml},nativeOn:{click:function(t){return t.preventDefault(),e.ddlCheckAll("dmlcon","dml","connection")}}},[e._v("全选\n              ")])],1),e._v(" "),o("CheckboxGroup",{model:{value:e.permission.dmlcon,callback:function(t){e.$set(e.permission,"dmlcon",t)},expression:"permission.dmlcon"}},e._l(e.connectionList.connection,function(t){return o("Checkbox",{key:t.connection_name,attrs:{label:t.connection_name}},[e._v("\n                "+e._s(t.connection_name)+"\n              ")])}),1)],1)]:e._e(),e._v(" "),o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"数据查询权限:"}},[o("RadioGroup",{model:{value:e.permission.query,callback:function(t){e.$set(e.permission,"query",t)},expression:"permission.query"}},[o("Radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),o("Radio",{attrs:{label:"0"}},[e._v("否")])],1)],1),e._v(" "),"1"===e.permission.query?[o("FormItem",{attrs:{label:"连接名:"}},[o("div",{staticStyle:{"border-bottom":"1px solid #e9e9e9","padding-bottom":"6px","margin-bottom":"6px"}},[o("Checkbox",{attrs:{indeterminate:e.indeterminate.query,value:e.checkAll.query},nativeOn:{click:function(t){return t.preventDefault(),e.ddlCheckAll("querycon","query","connection")}}},[e._v("全选")])],1),e._v(" "),o("CheckboxGroup",{model:{value:e.permission.querycon,callback:function(t){e.$set(e.permission,"querycon",t)},expression:"permission.querycon"}},e._l(e.connectionList.connection,function(t){return o("Checkbox",{key:t.connection_name,attrs:{label:t.connection_name}},[e._v(e._s(t.connection_name))])}),1)],1)]:e._e(),e._v(" "),o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"选择上级审核人:"}},[o("div",{staticStyle:{"border-bottom":"1px solid #e9e9e9","padding-bottom":"6px","margin-bottom":"6px"}},[o("Checkbox",{attrs:{indeterminate:e.indeterminate.person,value:e.checkAll.person},nativeOn:{click:function(t){return t.preventDefault(),e.ddlCheckAll("person","person","person")}}},[e._v("全选\n            ")])],1),e._v(" "),o("CheckboxGroup",{model:{value:e.permission.person,callback:function(t){e.$set(e.permission,"person",t)},expression:"permission.person"}},e._l(e.connectionList.person,function(t){return o("Checkbox",{key:t.username,attrs:{label:t.username}},[e._v(e._s(t.username)+"\n            ")])}),1)],1),e._v(" "),o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"数据字典权限:"}},[o("RadioGroup",{model:{value:e.permission.dic,callback:function(t){e.$set(e.permission,"dic",t)},expression:"permission.dic"}},[o("Radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),o("Radio",{attrs:{label:"0"}},[e._v("否")])],1)],1),e._v(" "),"1"===e.permission.dic?[o("FormItem",{attrs:{label:"数据字典修改权限:"}},[o("RadioGroup",{model:{value:e.permission.dicedit,callback:function(t){e.$set(e.permission,"dicedit",t)},expression:"permission.dicedit"}},[o("Radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),o("Radio",{attrs:{label:"0"}},[e._v("否")])],1)],1),e._v(" "),o("FormItem",{attrs:{label:"数据字典导出权限:"}},[o("RadioGroup",{model:{value:e.permission.dicexport,callback:function(t){e.$set(e.permission,"dicexport",t)},expression:"permission.dicexport"}},[o("Radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),o("Radio",{attrs:{label:"0"}},[e._v("否")])],1)],1),e._v(" "),o("FormItem",{attrs:{label:"连接名:"}},[o("div",{staticStyle:{"border-bottom":"1px solid #e9e9e9","padding-bottom":"6px","margin-bottom":"6px"}},[o("Checkbox",{attrs:{indeterminate:e.indeterminate.dic,value:e.checkAll.dic},nativeOn:{click:function(t){return t.preventDefault(),e.ddlCheckAll("diccon","dic","dic")}}},[e._v("全选\n              ")])],1),e._v(" "),o("CheckboxGroup",{model:{value:e.permission.diccon,callback:function(t){e.$set(e.permission,"diccon",t)},expression:"permission.diccon"}},e._l(e.connectionList.dic,function(t){return o("Checkbox",{key:t.Name,attrs:{label:t.Name}},[e._v(e._s(t.Name))])}),1)],1)]:e._e()],e._v(" "),"admin"===this.userForm.group?[o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"用户管理权限:"}},[o("RadioGroup",{model:{value:e.permission.user,callback:function(t){e.$set(e.permission,"user",t)},expression:"permission.user"}},[o("Radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),o("Radio",{attrs:{label:"0"}},[e._v("否")])],1)],1),e._v(" "),o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"数据库管理权限:"}},[o("RadioGroup",{model:{value:e.permission.base,callback:function(t){e.$set(e.permission,"base",t)},expression:"permission.base"}},[o("Radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),o("Radio",{attrs:{label:"0"}},[e._v("否")])],1)],1)]:e._e()],2),e._v(" "),o("div",{attrs:{slot:"footer"},slot:"footer"},[o("Button",{attrs:{type:"text"},on:{click:function(t){e.editInfodModal=!1}}},[e._v("取消")]),e._v(" "),o("Button",{attrs:{type:"primary"},on:{click:e.PutPermissionData}},[e._v("保存")])],1)],1)],1)},staticRenderFns:[]}},96:function(e,t,o){function s(e){o(629)}var n=o(1)(o(316),o(669),s,null,null);e.exports=n.exports}});
//# sourceMappingURL=19.11d50ed19b997b452143.js.map
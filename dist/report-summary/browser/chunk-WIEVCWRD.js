import{a as A}from"./chunk-PYY3LFOJ.js";import{a as _}from"./chunk-JNKSMFVL.js";import{a as ge,b as Ce}from"./chunk-XV76ZKRI.js";import{a as x,e as X}from"./chunk-IPEDQWQT.js";import{A as J,B as K,Ca as E,Da as N,E as Q,G as w,H as W,I as y,S as Y,T as Z,X as ee,Y as te,ba as oe,ca as ne,da as ie,ea as re,fa as ae,ga as le,ha as se,ia as ce,oa as me,qa as de,ra as pe,sa as T,ta as ue,v as d,va as fe,w as U,x as H,xa as he}from"./chunk-LCAD2BME.js";import"./chunk-JBQ62U6C.js";import"./chunk-WANN5XP4.js";import{f as V,g as I,i as O,j as F,t as B,v as z,y as G}from"./chunk-X2ZI6WJC.js";import"./chunk-OKAK23HW.js";import"./chunk-3ZBN7PZY.js";import"./chunk-HC6MZPB3.js";import"./chunk-SV2ZKNWA.js";import"./chunk-XGS4H5SF.js";import"./chunk-RS5W3JWO.js";import"./chunk-2U2U3MQ2.js";import"./chunk-WQJ4QNRK.js";import{Ab as b,Bb as S,Eb as j,Fb as P,La as r,Ma as $,Ua as q,Vb as R,_a as c,ab as m,bb as k,cb as h,db as a,ea as l,eb as i,fb as g,kb as C,la as v,lb as D,tb as f,vb as M}from"./chunk-6BICWZAS.js";import"./chunk-QA7HW7QI.js";import"./chunk-RKR3YXXE.js";import"./chunk-UYQ7EZNZ.js";import"./chunk-7D6K5XYM.js";import"./chunk-OBXDPQ3V.js";import"./chunk-IDKUYNE4.js";import"./chunk-MCRJI3T3.js";import"./chunk-BAKMWPBW.js";import"./chunk-MHPMO34D.js";import"./chunk-R52CLOUQ.js";import"./chunk-OUUNPNPW.js";import"./chunk-CPYOLLZG.js";import"./chunk-B7AAHVZY.js";import"./chunk-3IVKBF6N.js";import"./chunk-NMYJD6OP.js";import"./chunk-C5RQ2IC2.js";import"./chunk-SV7S5NYR.js";import"./chunk-FP7EQKGB.js";function ve(n,p){n&1&&(a(0,"p"),f(1,"Project Name is required."),i())}function Me(n,p){n&1&&(a(0,"p"),f(1,"Minimum 3 characters required."),i())}function be(n,p){if(n&1&&(a(0,"ion-text",9),c(1,ve,2,0,"p")(2,Me,2,0,"p"),i()),n&2){let e,t,o=D();r(),h(1,!((e=o.teamForm.get("projectName"))==null||e.errors==null)&&e.errors.required?1:-1),r(),h(2,!((t=o.teamForm.get("projectName"))==null||t.errors==null)&&t.errors.minlength?2:-1)}}function Se(n,p){if(n&1&&(a(0,"ion-select-option",15),f(1),i()),n&2){let e=p.$implicit;m("value",e.accountId),r(),M(" ",e.accountName," ")}}function Ie(n,p){n&1&&(a(0,"p"),f(1,"Account name is required."),i())}function Oe(n,p){if(n&1&&(a(0,"ion-text",9),c(1,Ie,2,0,"p"),i()),n&2){let e,t=D();r(),h(1,!((e=t.teamForm.get("accountId"))==null||e.errors==null)&&e.errors.required?1:-1)}}function Fe(n,p){n&1&&(a(0,"div",16),g(1,"ion-spinner",17),i())}var L=(()=>{class n{constructor(){this.isEditMode=!1,this.fb=l(w),this.toast=l(x),this.isModalOpen=!1,this.modalCtrl=l(E),this.projectStore=l(_),this.teams$=this.projectStore.team$,this.accountStore=l(A),this.accounts$=this.accountStore.account$,this.isLoading$=this.projectStore.select(e=>e.loading),this.accountStatusEffect=R(()=>{let e=this.projectStore.accountCreateStatus();e==="success"?(this.setOpen(!1),this.toast.show("success","Account created successfully!")):e==="update"?(this.setOpen(!1),this.toast.show("success","Account updated successfully!")):e==="deleted"?this.toast.show("success","Account deleted successfully!"):e==="error"&&this.toast.show("error","Something went wrong!"),e&&this.projectStore._accountCreateStatus.set(null)})}ngOnInit(){this.CreateForm(),this.accountStore.getAccounts(),this.editData&&(console.log("Edit Data:",this.editData),this.teamForm.patchValue(this.editData),this.isEditMode=!0)}CreateForm(){this.teamForm=this.fb.group({projectName:["",[d.required,d.minLength(3)]],accountId:["",d.required]})}setOpen(e){this.isModalOpen=e,this.modalCtrl.dismiss(),this.teamForm.reset()}SubmitForm(){let e=this.teamForm.value;if(this.teamForm.valid){let t=this.teamForm.value;this.editData&&this.editData?.projectId?this.projectStore.updateProject({id:this.editData.projectId,data:t}):this.projectStore.addTeam(e)}else this.toast.show("error","Please fill in all required fields."),this.teamForm.markAllAsTouched()}isInvalid(e){let t=this.teamForm.get(e);return!!(t&&t.invalid&&t.touched)}isValid(e){let t=this.teamForm.get(e);return!!(t&&t.valid&&t.touched)}static{this.\u0275fac=function(t){return new(t||n)}}static{this.\u0275cmp=v({type:n,selectors:[["app-create-project"]],inputs:{editData:"editData"},standalone:!0,features:[b([A,_]),S],decls:32,vars:20,consts:[[1,"modal-wrapper"],["color","light"],["slot","end"],["fill","clear",3,"click"],["name","close-outline",1,"icon-medium"],[3,"formGroup"],["size","6"],["lines","none",1,"custom-item"],["formControlName","projectName","label","Project Name","labelPlacement","floating","placeholder","Enter project name",1,"label-texts",3,"clearOnEdit"],["color","danger",1,"error-message"],["formControlName","accountId","label","Account Name","labelPlacement","floating"],[3,"value",4,"ngFor","ngForOf"],[1,"close",3,"click"],[1,"save",3,"click"],["class","loader-overlay",4,"ngIf"],[3,"value"],[1,"loader-overlay"],["name","crescent"]],template:function(t,o){if(t&1&&(a(0,"div",0)(1,"ion-header")(2,"ion-toolbar",1)(3,"ion-title")(4,"b"),f(5),i()(),a(6,"ion-buttons",2)(7,"ion-button",3),C("click",function(){return o.setOpen(!1)}),g(8,"ion-icon",4),i()()()(),a(9,"ion-content")(10,"form",5)(11,"ion-grid")(12,"ion-row")(13,"ion-col",6)(14,"ion-item",7),g(15,"ion-input",8),i(),c(16,be,3,2,"ion-text",9),i(),a(17,"ion-col",6)(18,"ion-item",7)(19,"ion-select",10),c(20,Se,2,2,"ion-select-option",11),j(21,"async"),i()(),c(22,Oe,2,1,"ion-text",9),i()()()()(),a(23,"ion-footer")(24,"ion-toolbar")(25,"ion-buttons",2)(26,"ion-button",12),C("click",function(){return o.setOpen(!1)}),f(27,"Close"),i(),a(28,"ion-button",13),C("click",function(){return o.SubmitForm()}),f(29),i()()()()(),c(30,Fe,2,0,"div",14),j(31,"async")),t&2){let s,u;r(5),M("",o.isEditMode?"Update":"Create"," Project"),r(5),m("formGroup",o.teamForm),r(4),k("invalid",o.isInvalid("projectName"))("valid",o.isValid("projectName")),r(),m("clearOnEdit",!0),r(),h(16,(s=o.teamForm.get("projectName"))!=null&&s.invalid&&((s=o.teamForm.get("projectName"))!=null&&s.dirty||(s=o.teamForm.get("projectName"))!=null&&s.touched)?16:-1),r(2),k("invalid",o.isInvalid("accountId"))("valid",o.isValid("accountId")),r(2),m("ngForOf",P(21,16,o.accounts$)),r(2),h(22,(u=o.teamForm.get("accountId"))!=null&&u.invalid&&((u=o.teamForm.get("accountId"))!=null&&u.dirty||(u=o.teamForm.get("accountId"))!=null&&u.touched)?22:-1),r(7),M(" ",o.isEditMode?"Update":"Save",""),r(),m("ngIf",P(31,18,o.isLoading$))}},dependencies:[N,ee,te,oe,ne,ie,re,ae,le,se,ce,me,de,pe,T,ue,fe,he,Y,Z,F,V,I,O,y,J,U,H,K,Q],styles:[".modal-wrapper[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%;width:100%;background:var(--ion-background-color, #fff);overflow:hidden;box-shadow:0 8px 16px #00000040}.custom-content[_ngcontent-%COMP%]{--background: transparent;height:auto;min-height:100%}.custom-content[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:16px}.custom-content[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   ion-item[_ngcontent-%COMP%]{margin-bottom:8px}.custom-content[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%]{display:block;margin-top:-8px;margin-bottom:12px;font-size:12px}ion-grid[_ngcontent-%COMP%]{margin-top:10px}"]})}}return n})();function we(n,p){n&1&&(a(0,"div",2),g(1,"ion-spinner",3),i())}var Ze=(()=>{class n{constructor(e){this.route=e,this.label="Project",this.url="http://localhost:3000/teamslist",this.isModalOpen=!1,this.fb=l(w),this.toast=l(x),this.router=l(z),this.teamList=q([]),this.projectStore=l(_),this.projectList$=this.projectStore.team$,this.modalController=l(E),this.loginStore=l(X),this.isLoading$=this.projectStore.select(t=>t.loading),this.columns=[{header:"Project Id",field:"projectId"},{header:"Project Name",field:"projectName"},{header:"Account Name",field:"accountName"},{header:"Teams",field:"viewTeam",linkEnable:!0},{header:"Action",field:"action",type:["edit","delete"]}],this.projectStore.getTeam()}ngOnInit(){this.CreateForm()}goToProject(e){console.log(e),this.router.navigate(["/projects/employees"])}setOpen(e){this.isModalOpen=e,this.teamForm.reset()}CreateForm(){this.teamForm=this.fb.group({projectname:["",[d.required,d.minLength(3)]],projectlocation:["",d.required],startDate:["",d.required],endDate:[""]})}SubmitForm(){let e=this.teamForm.value;this.teamForm.valid?(this.projectStore.addTeam(e),this.setOpen(!1),this.teamForm.reset(),this.toast.show("success","Project created successfully!")):(this.toast.show("error","Please fill in all required fields."),this.teamForm.markAllAsTouched())}handleRowAction(e){switch(e.type){case"viewTeam":this.router.navigate(["/projects/employees",e.item.id]);break;case"create":this.loadCreateEmployeeModal();break;case"edit":this.updateCreateEmployeeModal(e.item),console.log("Row from table:",e.item);break;case"delete":this.deleteModal(e.item);break;default:console.log("failing")}}loadCreateEmployeeModal(){this.modalController.create({component:L,cssClass:"create-project-modal",componentProps:{}}).then(e=>{e.present(),e.onDidDismiss().then(t=>{this.projectStore.getTeam(),console.log("Modal dismissed with data:",t)})})}updateCreateEmployeeModal(e){this.modalController.create({component:L,cssClass:"custom-modal",componentProps:{editData:e}}).then(t=>{t.present(),t.onDidDismiss().then(o=>{this.projectStore.getTeam(),console.log("Modal dismissed with data:",o)})})}deleteModal(e){this.modalController.create({component:Ce,cssClass:"custom-delete-modal",componentProps:{role:"delete",data:{id:e.projectId,name:e.projectName}}}).then(t=>{t.present(),t.onDidDismiss().then(o=>{console.log("Modal dismissed with data:",o),this.projectStore.deleteProject(e.projectId)})})}static{this.\u0275fac=function(t){return new(t||n)($(B))}}static{this.\u0275cmp=v({type:n,selectors:[["app-projects"]],standalone:!0,features:[b([_]),S],decls:3,vars:6,consts:[[3,"rowAction","columns","data","label"],["class","loader-overlay",4,"ngIf"],[1,"loader-overlay"],["name","crescent"]],template:function(t,o){t&1&&(a(0,"app-reusable-table",0),C("rowAction",function(u){return o.handleRowAction(u)}),i(),c(1,we,2,0,"div",1),j(2,"async")),t&2&&(m("columns",o.columns)("data",o.projectList$)("label",o.label),r(),m("ngIf",P(2,4,o.isLoading$)))},dependencies:[W,G,N,T,F,I,O,y,ge],styles:[".stack-dropdown[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{margin-bottom:6px;font-weight:500;color:#333;font-size:20px}.stack-dropdown[_ngcontent-%COMP%]   ion-select[_ngcontent-%COMP%]{padding-top:4px;font-size:14px}.project-table[_ngcontent-%COMP%]   ion-row[_ngcontent-%COMP%]{align-items:center}.project-table[_ngcontent-%COMP%]   ion-row[_ngcontent-%COMP%]   ion-col[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:8px 4px;word-break:break-word;font-size:12px;font-weight:400}.project-table[_ngcontent-%COMP%]   .header-row[_ngcontent-%COMP%]{background-color:#f4f4f4}.project-table[_ngcontent-%COMP%]   .data-row[_ngcontent-%COMP%]{background-color:#f9f9f9}@media (max-width: 768px){.project-table[_ngcontent-%COMP%]   ion-row[_ngcontent-%COMP%]{flex-wrap:wrap}.project-table[_ngcontent-%COMP%]   ion-col[_ngcontent-%COMP%]{flex:0 0 100%;max-width:100%;justify-content:flex-start}.project-table[_ngcontent-%COMP%]   .header-row[_ngcontent-%COMP%], .project-table[_ngcontent-%COMP%]   .data-row[_ngcontent-%COMP%]{font-size:14px}}  .searchbar-input{border-radius:4px!important}"]})}}return n})();export{Ze as ProjectListComponent};

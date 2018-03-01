// faultPanelTable.js
;(function (exports, diagnosisEnum){
    class FaultPanelTable {
        constructor(container,diagnosis,callBack) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.callBack = callBack;
            this.userInfoPromise = undefined;
            this.userData = [];
            this.store = {};
            this.init();
        }
        init(){
            this.tpl = `\
                <div id = "faultPanelTable" class="modal-faulttable-content">\
                </div>`;
            $(this.container).append(this.tpl);
            this.unbindStateOb();
            this.bindStateOb();
            this.requestUserMap();
        }
        show(){
            var _this = this;
            var postData = {"projectId": AppConfig.projectId, 'lan': I18n.type};
            var opt = {
                dataFilter: function (result) {
                    // this.store.faults = result.data.data;
                    return result.data.data;
                }.bind(this),
                url: '/diagnosis_v2/getAllFaults',
                tableClass: 'table-striped',
                postData: postData,
                // tbodyHeight: "58vh",
                headerAdjustFix: true,
                theadCol: [
                    {name: I18n.resource.faultModal.CHOOSE,width:"6.5%"},
                    {name: I18n.resource.faultModal.FAULT_GRADE},
                    {name: I18n.resource.faultModal.FAULT_NAME,width:"30%"},
                    {name: I18n.resource.faultModal.EQUIPMENT},
                    {name: I18n.resource.faultModal.CONSEQUENCE},
                    {name: I18n.resource.faultModal.STATUS},
                    {name: I18n.resource.faultModal.HAPPEN},
                    {name: I18n.resource.faultModal.CONFIG},
                ],
                trSet:{
                    data:{
                        entityid: "entityId",
                        faultid: "faultId"
                    }                 
                },
                tbodyCol:[
                    {index: 'choose',html:'<div class="isSelected"></div>'},
                    {index: 'grade',converter: function (value) {
                        return ('<a style="color:'+ (value["grade"] === 2?'#ea595c':'#facc04') +'";>'+ diagnosisEnum.faultGradeName[value["grade"]] + '</a>')
                    },className: "grade"},
                    {index: 'faultName',className: "faultName"},
                    {index: 'entityName',className: "entityName"},
                    {index: 'consequence', converter: function(value){return diagnosisEnum.faultConsequenceName[value["consequence"]]},className: "consequence"},
                    {index: 'enable', converter: function(value){return diagnosisEnum.enableStatusName[value["enable"]]},className: "enable"},
                    {index: 'happen',html: "",className: "happen"},
                    {index: 'enableBtn', converter:function(value){
                        return "<button type='button' class='btn btn-default btn-xs btn-info' data-enable='"+value.enable+"'>" + diagnosisEnum.enableStatusName[1-value.enable]+"</button>"
                    },className: "enableBtn"}
                ],
                onBeforeRender: function () {
                    Spinner.spin($(".modal-faulttable-content")[0]);
                },
                onDoneRender: function(value){
                   
                }.bind(this),
                onAfterRender: function () {
                    Spinner.stop();
                },
                more:true,
                paging:{
                    enable: true,
                    config:{
                        pageSizes: [25, 50, 100, 200],
                        totalNum: function (result) {                            
                            return result.data.total;
                        }
                    },
                    pagingKey:{
                        pageSize: 'pageSize',//每页的数目
                        pageNum: 'pageNum',//当前页数
                    }
                },
            }
            this.PagingTable = new PagingTable($('.modal-faulttable-content',this.container),opt);
            let async1 = this.PagingTable.show();
            // Spinner.spin($("#faultPanelTable")[0]);
            // let async1 = WebAPI.post('/diagnosis_v2/getAllFaults', {
            //     "projectId": AppConfig.projectId
            // }).done(function(result){
            //     if(result.status === "OK"){
            //         var data = result.data.data;
            //         var tpl = "";
            //         data.forEach(function(row){
            //             tpl += "\
            //                 <tr data-entityid= "+ row.entityId +" data-faultid = "+ row.faultId +">\
            //                     <td class='radio'><div class='isSelected'></div></td>\
            //                     <td class='grade'>" + diagnosisEnum.faultGradeName[row.grade] + "</td>\
            //                     <td class='faultName'>" + row.faultName + "</td>\
            //                     <td class='entityName'>" + row.entityName + "</td>\
            //                     <td class='consequence'>" + diagnosisEnum.faultConsequenceName[row.consequence] + "</td>\
            //                     <td class='enable'>" + diagnosisEnum.enableStatusName[row.enable] + "</td>\
            //                     <td class='happen'></td>\
            //                     <td class='enableBtn'><button type='button' class='btn btn-default btn-xs btn-info' data-enable='"+row.enable+"'>" + diagnosisEnum.enableStatusName[1-row.enable]+"</button></td>\
            //                 </tr>"
            //         })
            //         $(_this.container).find("tbody").empty().append(tpl);
            //         _this.attachEvents();
            //     }               
            // }).fail(()=>{
            //     alert(I18n.resource.faultModal.REQUEST_ERROR);
            // });
            let async2 = this.getFilterData();
            $.when(async1, async2).done((rs1, rs2)=>{
                _this.store.faults = rs2[0];
                _this.updateState(rs2[0]);
                _this.attachEvents();
            }).always(()=>{
                // Spinner.stop();
            });
        }
        getFilterData() {
            var _this = this;
            var time = this.diagnosis.conditionModel.time();
            var entityIds = this.diagnosis.conditionModel.activeAllEntities().map(function(row){return row.id});
            var consequence = this.diagnosis.conditionModel.activeConsequences();
            var className = this.diagnosis.conditionModel.activeCategories().map(function(row){return row.className});
            return WebAPI.post('/diagnosis_v2/getFaults', {
                "projectId": AppConfig.projectId,
                "entityIds": entityIds,
                "consequence": consequence,
                "classNames": className,
                "startTime":time.startTime,
                "endTime": time.endTime,
                "lan": I18n.type
            }).fail(()=>{
                alert(I18n.resource.faultModal.REQUEST_ERROR);
            });
        }
        updateState(rs) {
            if(rs.status === "OK"){
                $(`tr[data-entityid][data-faultid] td.happen`).removeClass('red').addClass('green').html(I18n.resource.faultModal.NOHAPPEN);
                var data = rs.data;
                data.forEach(function(row){
                    $(`tr[data-faultid="${row.faultId}"] td.happen`).removeClass('green').addClass('red').html(I18n.resource.faultModal.ISHAPPEN);
                })
            } 
        }
        attachEvents(){
            var _this = this;
            var $container = $(this.container);
            $container.off("click", "tbody tr").on("click", "tbody tr", function (e) {
                var $this = $(this);
                var $btnMailPush = $('#btnMailPush');
                var $btnAppPush = $('#btnAppPush');
                if (e.ctrlKey){
                    if ($this.hasClass('selected')){
                        $this.removeClass('selected');
                        $this.removeClass('selectedHover');
                    } else {
                        $this.addClass('selected');
                    }
                } else {
                    if ($this.hasClass('selected')) { 
                        $this.removeClass('selected');
                        $this.removeClass('selectedHover');
                    } else {
                        $('tbody tr').removeClass('selected');
                        $('tbody tr').removeClass('selectedHover');
                        $this.addClass('selected');
                    }
                }
                $btnMailPush.removeClass('btn-primary').addClass('btn-info');
                $btnAppPush.removeClass('btn-primary').addClass('btn-info');
                var $selected = $container.find('tbody tr.selected');
                if($selected.length==1){
                    var faultId = $selected[0].dataset.faultid;
                    var entityId = $selected[0].dataset.entityid;
                    var postData = {
                        faultId:faultId,
                        entityId:entityId,
                        projId:AppConfig.projectId
                    }
                    WebAPI.post('/diagnosis_v2/pushType',postData).done(function(result){
                        var data = result.data;
                        if(data.length>0){
                            for(var i = 0;i<data.length;i++){
                                if(parseInt(data[i][0])==0){//0:mail 1:app
                                    $btnMailPush.removeClass('btn-info').addClass('btn-primary');
                                }else{
                                    $btnAppPush.removeClass('btn-info').addClass('btn-primary');
                                }
                            }
                        }
                    })
                }
                // $(this).hasClass('selected') ? $(this).removeClass('selected') : $(this).addClass('selected');
            });
            $container.off('mouseover.tr').on('mouseover.tr', 'tbody tr.selected', function () {
                $(this).addClass('selectedHover');
            });
            $container.off('mouseout.tr').on('mouseout.tr', 'tbody tr.selected', function () {
                $(this).removeClass('selectedHover');
            });
            $(this.diagnosis.$faultModal).off("click","#btnSave").on("click","#btnSave",function(){
                var data = [];
                $container.find("#faultPanelTable tbody tr.selected").each(function(){
                    var obj = {
                        faultId: parseInt($(this).attr("data-faultId")),
                        name: $(this).find(".faultName").text()
                    }
                    data.push(obj);
                })
                _this.callBack(data);
            });
            $(this.diagnosis.$faultModal).off("click","#btnEnablePush").on("click","#btnEnablePush",function(){
                _this._disableRender(false);
            });
            $(this.diagnosis.$faultModal).off("click","#btnDisablePush").on("click","#btnDisablePush",function(){
                _this._disableRender(true);
            });
            $('tr td.enableBtn button', this.container).off('click').on('click',function(eve){
                eve.stopPropagation();
                eve.stopImmediatePropagation();
                let enable = parseInt(this.dataset.enable) == 0 ? false:true;
                _this._disableRender(enable, $(this).closest('tr'));
            });
            $(this.diagnosis.$faultModal).off("click","#btnMailPush").on("click","#btnMailPush",function(){
                _this._getSelectPerson('mail');
            });
            $(this.diagnosis.$faultModal).off("click","#btnAppPush").on("click","#btnAppPush",function(){
                _this._getSelectPerson('app');
            });
        }
        bindStateOb() {
            this.diagnosis.conditionModel.addEventListener('update',this.update,this);
        }
        unbindStateOb() {
            this.diagnosis.conditionModel.removeEventListener('update',this.update,this);
        }
        update(e,type) {
            let forbiddenArr  = ['update.activeEntities'];
            if(forbiddenArr.indexOf(type)>-1){
                return;
            }
            Spinner.spin($("#faultPanelTable")[0]);
            this.getFilterData().done(this.updateState).always(()=>{
                Spinner.stop();
            });
        }
        close(){
            this.unbindStateOb();
        }
        requestUserMap() {
            this.userInfoPromise =  WebAPI.get('/workflow/group/user_team_dialog_list/' + window.parent.AppConfig.userId).done((result)=>{
                if (result.success) {
                    this.userData = result.data;
                }
            }).fail(()=>{
                alert(I18n.resource.faultModal.REQUEST_ERROR);
            }).always(()=>{

            });
        }
        _disableRender(disable, $selecteds) {
            disable = disable ? 0 : 1;
            let $container = $(this.container);
            let faultIds = [], entityIds = [];
            $selecteds = $selecteds || $container.find("#faultPanelTable tbody tr.selected");
            if($selecteds.length == 0){
                return;
            }
            $selecteds.each(function(){
                faultIds.push(parseInt(this.dataset.faultid));
                entityIds.push(parseInt(this.dataset.entityid));
            });
            let postData = {
                faultIds: faultIds,
                entityIds: entityIds,
                enable: disable
            };

            Spinner.spin($("#faultPanelTable")[0]);
            return WebAPI.post('/diagnosis_v2/changeFaultEnable',postData).done(result => {
                if(result.status == 'OK'){
                    $selecteds.find('td.enable').html(diagnosisEnum.enableStatusName[disable]);
                    let $btn = $selecteds.find('td.enableBtn button').html(diagnosisEnum.enableStatusName[1-disable]);
                    $btn[0].dataset.enable = disable;
                }
            }).fail(function () {
                alert(I18n.resource.faultModal.REQUEST_ERROR);
            }).always(e=> {
                Spinner.stop();
            });
        }

        _getSelectPerson(type) {
            let $trActive = $("#faultPanelTable tbody tr.selected", this.container), userHasSelected;
            let faultIds = [], entityIds = [];
            $trActive.each(function(){
                faultIds.push(parseInt(this.dataset.faultid));
                entityIds.push(parseInt(this.dataset.entityid));
            });
            if($trActive.length == 0){
                return;
            }else if ($trActive.length == 1) {
                Spinner.spin($("#faultPanelTable")[0]);
                WebAPI.post("/diagnosis/faults/relatedUsers", {
                    projId: AppConfig.projectId,
                    faultIdStr: faultIds[0],
                    type: type == 'mail' ? 0 : 1 // 0 mail, 1 app
                }).done(result => {
                    if (result.data) {
                        if (result.data.length) {
                            var usersStr = result.data[0].toString();
                            var userMapList = [], userIds = usersStr.split(',');
                            for (var i = 0; i < userIds.length; i++) {
                                for (var j = 0; j < this.userData.length; j++) {
                                    if (userIds[i] == this.userData[j].id) {
                                        userMapList.push(this.userData[j]);
                                        continue;
                                    }
                                }
                            }
                            userHasSelected = userMapList;
                        } else {
                            userHasSelected = null
                        }
                        this._openUserMapModal(userHasSelected,type);
                    }
                }).fail(function () {
                    alert(I18n.resource.common.REQUEST_ERROR);
                }).always(e=> {
                    Spinner.stop();
                });
            } else {
                userHasSelected = null;
                this._openUserMapModal(userHasSelected, type);
            }
        }
        _openUserMapModal (userHasSelected, type) {
            let $trActive = $("#faultPanelTable tbody tr.selected", this.container);
            let faultIds = [], entityIds = [];
            $trActive.each(function(){
                faultIds.push(parseInt(this.dataset.faultid));
                entityIds.push(parseInt(this.dataset.entityid));
            });
            this.userInfoPromise.done(result => {
                this.userData = result.data;
                beop.view.memberSelected.init($(document.body), {
                    configModel: {
                        userMemberMap: this.userData || [],
                        userHasSelected: userHasSelected || null,
                        maxSelected: null,
                        cb_dialog_hide: (addedUserList) => {
                            Spinner.spin($("#faultPanelTable")[0]);
                            var postMap = {
                                type: type == 'mail' ? '0' : '1', // 0 mail, 1 app
                                projId: AppConfig.projectId,
                                userIds: addedUserList.map(v=>v.id),
                                faultIds: faultIds,
                                entityIds:entityIds
                            };
                            WebAPI.post("/diagnosis_v2/pushMailApp", postMap).done(result => {
                                if (result.status=='OK') {
                                    alert(I18n.resource.faultModal.SET_PERSON_SUCCESS);
                                    type == 'mail'?$('#btnMailPush').removeClass('btn-info').addClass('btn-primary'):$('#btnAppPush').removeClass('btn-info').addClass('btn-primary');
                                }
                            }).fail(function () {
                                 alert(I18n.resource.faultModal.REQUEST_ERROR);
                            }).always(e=> {
                                Spinner.stop();
                            });
                        }
                    }
                });
            })
        }
    }
    exports.FaultPanelTable = FaultPanelTable;
}(
    namespace('diagnosis.components'),
    namespace('diagnosis.enum')
))
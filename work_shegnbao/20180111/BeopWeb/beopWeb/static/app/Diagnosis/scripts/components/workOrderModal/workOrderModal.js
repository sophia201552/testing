// WorkOrderModal.js
;(function (exports) {
    class WorkOrderModal {
        constructor(data) {
            this.store = data;
            this.options = null;
            this.$workOrderModal = null;
            this.curData = null;
            this.areaData = null;
            this.equipmentData = null;
            this.afterSaveFn = undefined;
            this.stateMap = {
                userSelectedMap: {
                    "verifiers": [],
                    "executor": []
                }
            }
            
            this.initOptions();
            this.init();
        }
        init() {
            $('#workOrderModal').remove();
            const mainHtml = `<div>
                <div id="workOrderModal" class="modal fade" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title">${I18n.resource.workOrderModal.ADD_FAULT_WORK_ORDER}</h4>
                            </div>
                            <div class="modal-body">
                                <form class="form-horizontal" id="wkForm">
                                    <div class="form-group">
                                        <label for="wkName" class="col-sm-2 control-label">${I18n.resource.workOrderModal.NAME}</label>
                                        <div class="col-sm-10">
                                        <input type="text" class="form-control" id="wkName" value="${this.options.name}">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="wkDeadline" class="col-sm-2 control-label">${I18n.resource.workOrderModal.DEADLINE}</label>
                                        <div class="col-sm-10">
                                        <input type="text" class="form-control" id="wkDeadline" value="${this.options.dueDate}">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="wkUrgencyDegree" class="col-sm-2 control-label">${I18n.resource.workOrderModal.URGENCY_DEGREE}</label>
                                        <div class="col-sm-10">
                                        <select class="form-control" id="wkUrgencyDegree">
                                            <option value="0" selected>${I18n.resource.workOrderModal.GENERAL}</option>
                                            <option value="1">${I18n.resource.workOrderModal.SEVERITY}</option>
                                            <option value="2">${I18n.resource.workOrderModal.URGENCY}</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="wkDetails" class="col-sm-2 control-label">${I18n.resource.workOrderModal.DETAILS}</label>
                                        <div class="col-sm-10">
                                        <textarea class="form-control" rows="5" id="wkDetails">${this.options.detail}</textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="wkExecutor" class="col-sm-2 control-label">${I18n.resource.workOrderModal.EXECUTOR}</label>
                                        <div class="col-sm-10">
                                            <div class="input-group">
                                                <div class="input-group-addon wk-people-add" data-type="executor"><i class="iconfont">&#xe89f;</i></div>
                                                <div class="form-control peopleList" id="wkExecutor" data-type="executor"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="wkReviewer" class="col-sm-2 control-label">${I18n.resource.workOrderModal.REVIEWER}</label>
                                        <div class="col-sm-10">
                                            <div class="input-group">
                                                <div class="input-group-addon wk-people-add" data-type="verifiers"><i class="iconfont">&#xe89f;</i></div>
                                                <div class="form-control peopleList" id="wkReviewer" data-type="verifiers"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="wkPropGroup">
                                        <table class="table table-hover table-condensed" id="wkPropTable">
                                            <thead><tr>
                                                <th>${I18n.resource.workOrderModal.AREA}</th>
                                                <th>${I18n.resource.workOrderModal.EQUIPMENT}</th>
                                                <th>${I18n.resource.workOrderModal.FAULT}</th>
                                                <th>${I18n.resource.workOrderModal.OCCUE_TIME}</th>
                                            </tr></thead>
                                            <tbody>${this.options.wkPropTable}</tbody>
                                        </table>
                                    </div>
                                    <div class="form-group-chart">
                                        <div id="formChart"></div>                                                                              
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default feedbackModalClose" data-dismiss="modal">${I18n.resource.faultModal.CANCEL}</button>
                                <button type="button" class="btn btn-primary feedbackModalSubmit" id="kwSubmit">${I18n.resource.workOrderModal.SAVE}</button>
                            </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
                <!--@formatter:off-->
                <script type="text/html" id="temp_wf_added_member_personal">
                    <!for(var m=0; m < members.length; m++){!>
                        <!var member = members[m];!>
                        <dl class="pr wf-detail-userInfo">
                            <dt class="wf-detail-userPic"><img src="<!=member.userpic!>" class="wf-person-pic"></dt>
                            <dd class="pa wf-detail-userName ellipsis"
                                title="<!=member.userfullname +'\n' +(member.useremail && member.useremail!='undefined'  ? member.useremail : '')!>">
                                <!=member.userfullname!>
                            </dd>
                            <input type="hidden" name="<!=userListName!>[]" class="<!=userListName!>-person" value="<!=member.id!>">
                        </dl>
                    <!}!>
                </script>
            </div>`;
            $('body').append(mainHtml);
            this.container = document.querySelector('#workOrderModal');
            this.$workOrderModal = $(this.container).modal({
                keyboard: true,
                backdrop:'static',
                show: false
            })
            this.attachEvent();
        }
        initOptions(){
            var _this = this;
            this.options = {
                // dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'), //结束时间为两天后
                dueDate: moment().add(2, 'd').format('YYYY-MM-DD') , //结束时间为两天后
            };
            if(this.store.length < 2 ){
                this.curData = this.store[0];
                this.options['name'] = this.curData.faultName;
                this.options['detail'] = (function(){
                    var tpl =  I18n.resource.workOrderModal.FAULT_EQUIPMENT + _this.curData.entityName + '\n' + I18n.resource.workOrderModal.FAULT_NAME + _this.curData.faultName + '\n'+ I18n.resource.workOrderModal.FAULT_DESC + _this.curData.description + '\n' + I18n.resource.workOrderModal.OCCURRED_TIME + _this.curData.time;
                    return tpl;
                }());
                this.options['wkPropTable'] = `<tr><td>${_this.curData.entityParentName}</td>
                                    <td>${_this.curData.entityName}</td>
                                    <td>${_this.curData.faultName}</td>
                                    <td>${_this.curData.time}</td></tr>`;
            }else{
                var entityNameArr = [];
                var areaObj = {},entityObj = {};
                this.store.forEach(function(row){
                    if(entityNameArr.indexOf(row.entityName) < 0){
                        entityNameArr.push(row.entityName)
                    }
                    if(areaObj[row.entityParentName]){
                        if(areaObj[row.entityParentName][row.entityName]){
                            if(areaObj[row.entityParentName][row.entityName][row.faultId]){
                                areaObj[row.entityParentName][row.entityName][row.faultId].push(row)
                            }else{
                                areaObj[row.entityParentName][row.entityName][row.faultId] = [row]
                            }                            
                        }else{
                            areaObj[row.entityParentName][row.entityName] = {}
                            areaObj[row.entityParentName][row.entityName][row.faultId] = [row]
                        }
                    }else{ 
                        areaObj[row.entityParentName] = {}
                        areaObj[row.entityParentName][row.entityName] = {}
                        areaObj[row.entityParentName][row.entityName][row.faultId] = [row]
                    }
                    if(entityObj[row.entityName]){
                        if(entityObj[row.entityName][row.faultId]){
                            entityObj[row.entityName][row.faultId].push(row)
                        }else{
                            entityObj[row.entityName][row.faultId] = [row]
                        }
                    }else{
                        entityObj[row.entityName] = {}
                        entityObj[row.entityName][row.faultId] = [row]
                    }
                })
                this.areaData = areaObj;
                this.equipmentData = entityObj;
                this.options['name'] = (function(){
                    let nameI18n = {
                        0:'{equipments}，{num}个设备发生报警/故障',
                        1:'、',
                        2:'等'
                    };
                    if(I18n.type == 'en'){
                        nameI18n = {
                            0:'Like {equipments}, there are {num} kinds of equipment alarm / fault',
                            1:',',
                            2:''
                        };
                    }
                    var tpl = "";
                    entityNameArr.forEach(function(row,i){
                        if(i < 3){
                            tpl += (row + nameI18n[1])
                        }
                    })
                    tpl = tpl.substring(0,tpl.length-1);
                    if(entityNameArr.length>3){
                         tpl += nameI18n[2];
                    }
                    return nameI18n[0].formatEL({
                        equipments: tpl,
                        num: entityNameArr.length
                    });
                }());
                this.options['detail'] = (function(){
                    var tpl = "";
                    Object.keys(entityObj).forEach(function(row){
                        tpl += (I18n.resource.workOrderModal.FAULT_EQUIPMENT + row + '\n');
                        Object.keys(entityObj[row]).forEach(function(item){
                            var curFault = entityObj[row][item];
                            curFault.forEach(function(fault){
                                tpl += (I18n.resource.workOrderModal.FAULT_NAME + fault.faultName + '\n'+ I18n.resource.workOrderModal.FAULT_DESC + fault.description + '\n' + I18n.resource.workOrderModal.OCCURRED_TIME + fault.time + '\n\n')                           
                            })
                        })
                        tpl += "=====================\n"
                    })
                    return tpl;
                }())
                var aTpl = "";
                Object.keys(areaObj).forEach(function(row,i){
                    Object.keys(areaObj[row]).forEach(function(item,j){
                        Object.keys(areaObj[row][item]).forEach(function(col,k){
                            areaObj[row][item][col].forEach(function(fault,f){
                                if(i===0 && j=== 0 && k===0 && f === 0){
                                    _this.curData = fault;
                                    aTpl += "<tr class='trActive'"
                                }else{
                                    aTpl += "<tr "
                                }                               
                                aTpl += 
                                    `data-area = '${fault.entityParentName}' data-entity = '${fault.entityName}' data-fault='${fault.faultId}' data-time='${fault.time}'>
                                    <td>${fault.entityParentName}</td>
                                    <td>${fault.entityName}</td>
                                    <td>${fault.faultName}</td>
                                    <td>${fault.time}</td>
                                </tr>`
                            })
                        })
                    })                                     
                })
                this.options['wkPropTable'] = aTpl;
            }
        }
        showWorkflow(){
            $('.modal-footer', this.container).hide();
            Spinner.spin(this.container.querySelector('.modal-content'));
            return WebAPI.get(`/workflow/task/${this.store[0].workTaskId}`).done((rs)=>{
                let data = rs.data;
                this.options.name = data.fields.title;
                this.options.dueDate = data.fields.dueDate;
                this.options.detail = data.fields.detail;
                let verifiers = [],
                    executor = [];
                data.process.nodes[0].members.forEach(v=>{
                    verifiers.push({
                        id:v.id,
                        useremail:v.useremail,
                        userfullname:v.userfullname,
                        userpic:v.userpic
                    });
                    $('#wkReviewer', this.container).html('').append(`<dl class="pr wf-detail-userInfo"><dt class="wf-detail-userPic"><img src="${v.userpic}" class="wf-person-pic"></dt><dd class="pa wf-detail-userName ellipsis" title="${v.userfullname} ${v.useremail}">${v.userfullname}</dd><input type="hidden" name="executor[]" class="executor-person" value="${v.id}"></dl>`);
                });
                data.process.nodes[1].members.forEach(v=>{
                    executor.push({
                        id:v.id,
                        useremail:v.useremail,
                        userfullname:v.userfullname,
                        userpic:v.userpic
                    });
                    $('#wkExecutor', this.container).html('').append(`<dl class="pr wf-detail-userInfo"><dt class="wf-detail-userPic"><img src="${v.userpic}" class="wf-person-pic"></dt><dd class="pa wf-detail-userName ellipsis" title="${v.userfullname} ${v.useremail}">${v.userfullname}</dd><input type="hidden" name="executor[]" class="executor-person" value="${v.id}"></dl>`);
                });
                this.stateMap = {
                    userSelectedMap: {
                        "verifiers": verifiers,
                        "executor": executor
                    }
                }
                $('.modal-title', this.container).html(I18n.resource.workOrderModal.VIEW_FAULT_WORK_ORDER);
                $('#wkName', this.container).val(data.fields.title);
                $('#wkDeadline', this.container).val(data.fields.dueDate);
                $('#wkDetails', this.container).val(data.fields.detail);
                $('#wkUrgencyDegree', this.container).val(data.fields.critical);

                WebAPI.post("/diagnosis_v2/getWorkOrderInfo", {
                    ids: data.fields.noticeId,
                    projectId: AppConfig.projectId,
                    lang: I18n.type
                }).done((result)=>{
                    if(result.status === "OK"){
                        let entityNameArr = [];
                        let areaObj = {},entityObj = {};
                        result.data.forEach(function(row){
                            if(entityNameArr.indexOf(row.entityName) < 0){
                                entityNameArr.push(row.entityName);
                            }
                            if(areaObj[row.entityParentName]){
                                if(areaObj[row.entityParentName][row.entityName]){
                                    if(areaObj[row.entityParentName][row.entityName][row.faultId]){
                                        areaObj[row.entityParentName][row.entityName][row.faultId].push(row);
                                    }else{
                                        areaObj[row.entityParentName][row.entityName][row.faultId] = [row];
                                    }                            
                                }else{
                                    areaObj[row.entityParentName][row.entityName] = {};
                                    areaObj[row.entityParentName][row.entityName][row.faultId] = [row];
                                }
                            }else{ 
                                areaObj[row.entityParentName] = {};
                                areaObj[row.entityParentName][row.entityName] = {};
                                areaObj[row.entityParentName][row.entityName][row.faultId] = [row];
                            }
                            if(entityObj[row.entityName]){
                                if(entityObj[row.entityName][row.faultId]){
                                    entityObj[row.entityName][row.faultId].push(row);
                                }else{
                                    entityObj[row.entityName][row.faultId] = [row];
                                }
                            }else{
                                entityObj[row.entityName] = {};
                                entityObj[row.entityName][row.faultId] = [row];
                            }
                        })
                        this.areaData = areaObj;
                        this.equipmentData = entityObj;
                        let aTpl = "";
                        Object.keys(areaObj).forEach((row,i)=>{
                            Object.keys(areaObj[row]).forEach((item,j)=>{
                                Object.keys(areaObj[row][item]).forEach((col,k)=>{
                                    areaObj[row][item][col].forEach((fault,f)=>{
                                        if(i===0 && j=== 0 && k===0 && f === 0){
                                            this.curData = fault;
                                            aTpl += "<tr class='trActive'"
                                        }else{
                                            aTpl += "<tr "
                                        }                               
                                        aTpl += 
                                            `data-area = '${fault.entityParentName}' data-entity = '${fault.entityName}' data-fault='${fault.faultId}' data-time='${fault.time}'>
                                            <td>${fault.entityParentName}</td>
                                            <td>${fault.entityName}</td>
                                            <td>${fault.faultName}</td>
                                            <td>${fault.time}</td>
                                        </tr>`
                                    })
                                })
                            })                                     
                        })
                        $('#wkPropGroup tbody').html(aTpl);
                        this.initChart();
                    } else {
                        alert("The failure information is incorrect!");
                    }                    
                }).always(()=>{
                    Spinner.stop();
                });
            }).always(()=>{
                Spinner.stop();
            });
        }
        show() {
            var _this = this;            
            this.$workOrderModal.modal('show');
            if(this.store[0].readOnly){
                this.showWorkflow();
            }else{
                this.$workOrderModal.on('shown.bs.modal', function (e) {
                    _this.initChart();
                })
            }
            
        }
        attachEvent(){
            var _this = this;
            var $container = $(this.container);
            $container.off("click",".wk-people-add").on("click",".wk-people-add",function(){
                var type = $(this).data("type");
                var wiInstance = new WorkflowInsert()
                // wiInstance._openUserSelectDialog(type);
                var setUserSelectedNormal = function(result, type) {
                    var flag = null;
                    beop.view.memberSelected.configModel({
                        userMemberMap: result.data,
                        cb_dialog_hide: _this._renderAddedUsersNormal(type),
                        userHasSelected: _this.stateMap.userSelectedMap[type],
                        maxSelected: type == 'executor' ? 1 : null,
                        maxDelete: flag,
                        enableDeleteMember: true,
                        enableAddMember: true
                    });
                    beop.view.memberSelected.init($('body'));
                };
                var groupUserPromise = null;
                if (beop.model.stateMap.groupId) {
                    groupUserPromise = WebAPI.get('/workflow/group/group_user_list/' + AppConfig.userId + '/' + beop.model.stateMap.groupId);
                } else {
                    groupUserPromise = WebAPI.get('/workflow/group/user_dialog_list/' + AppConfig.userId);
                }
                groupUserPromise.done(function(result) {
                    if (result.success) {
                        setUserSelectedNormal(result, type);
                    }
                }).fail(function() {
                    console.error('获取人物选择框模板失败');
                });
            }) 
            $container.off("click","#wkPropTable tbody tr").on("click","#wkPropTable tbody tr",function(){
                var areaKey = $(this).data("area");
                var entityKey = $(this).data("entity");
                var faultKey = $(this).data("fault");
                var timeKey = $(this).data("time");
                if(!areaKey || !entityKey || !faultKey || !timeKey){return}
                _this.areaData[areaKey][entityKey][faultKey].some(function(row){
                    if(row.time === timeKey){
                        _this.curData = row;
                        return true;
                    }
                })
                $(this).siblings().removeClass("trActive");
                $(this).addClass("trActive");
                _this.initChart();
            })
            $container.off("click","#kwSubmit").on("click","#kwSubmit",function(){
                var rs = _this.formCheck();
                if(rs.status){                    
                    Spinner.spin($container.find(".modal-content")[0]);
                    WebAPI.post('/workflow/task/save/', _this._getSubmitData(rs.opt)).done(function(result){
                        if(result.success){
                            alert(I18n.resource.workOrderModal.CREATE_WORKFLOW_SUCCESSFULLY)
                            _this.$workOrderModal.modal('hide');
                            if(_this.afterSaveFn){
                                _this.afterSaveFn(result.data);
                                _this.afterSaveFn = undefined;
                            }
                        }else{
                            alert(I18n.resource.workOrderModal.CREATE_WORKFLOW_FAILED)
                        }
                    }).always(function(){
                        Spinner.stop();
                    })
                }else{
                    alert(rs.msg)
                }
            })
        }
        formCheck(){
            var $wkForm = $(this.container).find("#wkForm");
            var fields = {
                title: $wkForm.find("#wkName").val(),
                dueDate: $wkForm.find("#wkDeadline").val(),
                critical: $wkForm.find("#wkUrgencyDegree").val(),
                detail:$wkForm.find("#wkDetails").text(),
                noticeId: this.store.map(v=>v.noticeId)
            }
            var processMember = {
                "0": this.stateMap.userSelectedMap.executor,
                "1": this.stateMap.userSelectedMap.verifiers
            }
            var obj = {
                status: true,
                opt:{
                    fields: fields,
                    processMember: processMember,
                },               
                msg:""
            }
            Object.keys(fields).some(function(row){
                if(!fields[row]){
                    obj.status = false;
                    obj.msg = "Incomplete information";
                }
            })
            Object.keys(processMember).some(function(row){
                if(processMember[row].length === 0){
                    obj.status = false;
                    obj.msg = "Personnel not completed";
                }
            })
            return obj;
        }
        _getSubmitData(opt){
            var obj = {
                attachment:[]
            }   
            var fields = {
                fields:{
                    charts:{
                        projectId:AppConfig.projectId,
                        chartPointList:this.curData.points.map(function (row) { return row.name+','+row.description; }).join('|'),
                        // chartStartTime: new Date(Date.parse(this.curData.time) - 10800000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前后三小时
                        // chartEndTime: new Date(Date.parse(this.curData.time) + 10800000).format('yyyy-MM-dd HH:mm:ss'),
                        chartStartTime: moment(this.curData.time).subtract(3, 'h').format('YYYY-MM-DD HH:mm:ss') , //报警发生前后三小时
                        chartEndTime: moment(this.curData.time).add(3, 'h').format('YYYY-MM-DD HH:mm:ss'),
                        chartQueryCircle: 'm5'
                    },
                    noticeId: '',
                    pendingFiles:[],
                    type: beop.constants.taskType.DIAGNOSIS,
                    diagnosisZone: this.areaData?Object.keys(this.areaData):this.curData.entityParentName,
                    diagnosisEquipmentName: this.equipmentData?Object.keys(this.equipmentData):this.curData.entityName,
                } 
            }
            var chartIns = echarts.getInstanceById($('#formChart')[0].getAttribute('_echarts_instance_'));
            var image = {
                image: chartIns.getDataURL()
            };
            var taskModelInfo = $.extend(true, {}, fields, obj, opt, image);
            return taskModelInfo;
        }
        _renderAddedUsersNormal(type){
            return function(addedUserList) {
                this.stateMap.userSelectedMap[type] = addedUserList;
                var _this = this;
                $(this.container).find(".peopleList").each(function(index, item) {
                    var $item = $(item);
                    var picType = $item.data("type");
                    $item.html(beopTmpl('temp_wf_added_member_personal', {
                        members: _this.stateMap.userSelectedMap[picType],
                        userListName: picType ? picType : 'addedUserList'
                    }));
                }).end().find('.peopleList dl').on('click', function(event) {
                    event.stopPropagation();
                });
            }.bind(this);
        }
        initChart(){
            var _this = this;
            var $formChart = $(this.container).find("#formChart");
            // var middleTime = Date.parse(this.curData.time);
            var postData = {
                dsItemIds:(function(){
                    var arr = [];
                    _this.curData.points.forEach(function(row){
                        var point = "@"+AppConfig.projectId+"|"+ row.name;
                        arr.push(point)
                    })
                    return arr;
                }()),
                timeStart:moment(this.curData.time).subtract(3, 'h').format('YYYY-MM-DD HH:mm:ss'),
                timeEnd:moment(this.curData.time).add(3, 'h').format('YYYY-MM-DD HH:mm:ss'),
                timeFormat:"m5"
            }
            Spinner.spin($formChart[0]);
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postData).done(function(rs){
                if(rs.list){
                    _this.chartData = rs;
                }else{
                    _this.chartData = {
                        list: [],
                        timeShaft: []
                    };
                }               
                _this.setEcharts();
            }).always(function(){
                Spinner.stop();
            });
        }
        setEcharts(){
            var _this = this;
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle:{
                            width: 2,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 1, color: '#0c829f'
                                }, {
                                    offset: 0, color: '#243740'
                                }],
                                globalCoord: false
                            },
                            opacity: "0.5"
                        }
                    },
                    formatter:function (params, ticket, callback){
                        let dom = '<div>'+ params[0].name;
                        params.forEach(function(row){
                            if(row.seriesType === "line"){
                                let name = row.seriesName;
                                let val = row.value;
                                let color= row.color;
                                dom += "<p style = 'margin:0;'><a style='width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:6px;background-color:"+ color +"'></a>"+name + " : "+ val +"</p>"
                            }                            
                        })
                        dom +="</div>"
                        return dom;
                        // callback(ticket, dom);
                    }
                },
                legend: {
                    // align: "right",
                    // right: "7%",
                    top: '10px',
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        fontSize: 12,
                        color: "#C4C5C8"
                    },
                    data:(function(){
                        var data = [];
                        _this.curData.points.forEach(function(row){
                            data.push(row.description);
                        });
                        return data;
                    }())
                },
                grid: {
                    left: '5%',
                    right: '4%',
                    bottom: '50px',
                    top: '40px',
                    containLabel: true
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    axisLine:{
                        lineStyle: {
                            color: "#20242F"
                        }
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel:{
                        textStyle: {
                            color: "#6C6C72"
                        }
                    },
                    splitLine:{
                        show: false
                    },
                    data: (function(){
                        var data = [];
                        _this.chartData.timeShaft.forEach(function(row){
                            data.push(row.substring(5).slice(0,-3))
                        });
                        return data;
                    }())
                },
                yAxis: {
                    type: 'value',
                    // position: "right",
                    // max:"dataMax",
                    // min:'dataMin',
                    axisLine:{
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel:{
                        textStyle: {
                            color: "#6C6C72"
                        }
                    },
                    splitLine:{
                        show: true,
                        lineStyle:{
                            color: "#F0F0F1"
                        }
                    }
                },
                dataZoom: [{
                    // startValue: (function(){
                    //     var timesArr = _this.chartData.timeShaft;
                    //     return timesArr[Math.floor(timesArr.length/2)]
                    // }())
                }, {
                    type: 'inside'
                }],
                series: (function(){
                    var arr = []
                    _this.chartData.list.forEach(function(row,i){
                        var item = {
                            name:_this.curData.points[i].description,
                            type:'line',
                            showSymbol: false,
                            smooth: true,
                            data: row.data
                        };
                        arr.push(item);
                    })
                    return arr;
                }())
            };
            var faultChart = echarts.init(document.getElementById('formChart'));
            this.faultChart = faultChart;
            faultChart.setOption(option);
            window.onresize = faultChart.resize;
        }
        addHandleFn(fn) {
            this.afterSaveFn = fn;
        }
    }
    exports.WorkOrderModal = WorkOrderModal;
} ( namespace('diagnosis.components') ));
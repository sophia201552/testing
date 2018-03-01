// workOrderHistory.js
;(function (exports, diagnosisEnum) {
    class WorkOrderHistory {
        constructor(container, feedModal) {
            this.container = container;
            this.feedModal = feedModal;
            this.infos = [];
            this.asyncArr = [];
            this.init();
        }
        init() {
            
        }
        initDom() {
            const mainHtml = `
                <div class="workOrder">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label for="workOrderName" class="col-sm-2 control-label">${I18n.resource.feedbackModal.NAME}</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="workOrderName" placeholder="">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="workOrderDesc" class="col-sm-2 control-label">${I18n.resource.feedbackModal.DESC}</label>
                            <div class="col-sm-10">
                                <textarea class="form-control" id="workOrderDesc" placeholder="" style="max-width:100%;max-height:54px;"></textarea >
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="workLevel" class="col-sm-2 control-label">${I18n.resource.feedbackModal.LEVEL}</label>
                            <div class="col-sm-10">
                                <select id="workLevel" class="form-control">
                                    <option value="1">${this.feedModal.util_LevelName(1)}</option>
                                    <option value="2"selected = "selected">${this.feedModal.util_LevelName(2)}</option>
                                    <option value="3">${this.feedModal.util_LevelName(3)}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="workRemark" class="col-sm-2 control-label">${I18n.resource.feedbackModal.REMARK}</label>
                            <div class="col-sm-10">
                                <select id="workRemark" class="form-control">
                                    <option value="0">${this.feedModal.util_RemarksName(0)}</option>
                                    <option value="1">${this.feedModal.util_RemarksName(1)}</option>
                                    <option value="2">${this.feedModal.util_RemarksName(2)}</option>
                                    <option value="3">${this.feedModal.util_RemarksName(3)}</option>
                                    <option value="4">${this.feedModal.util_RemarksName(4)}</option>
                                    <option value="5">${this.feedModal.util_RemarksName(5)}</option>
                                    <option value="6">${this.feedModal.util_RemarksName(6)}</option>
                                    <option value="7">${this.feedModal.util_RemarksName(7)}</option>
                                    <option value="8" selected = "selected">${this.feedModal.util_RemarksName(8)}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">${I18n.resource.feedbackModal.ATTACHMENTS}</label>
                            <div class="col-sm-10 workOrderListWrap">
                            </div>
                        </div>
                        
                    </form>
                </div>
            `;
            this.container.innerHTML = mainHtml;
        }
        initVal() {
            // let date = timeFormat(new Date(+new Date() + 3*24*60*60*1000), 'yyyy-mm-dd');
            let date = moment().add(3, 'd').format('YYYY-MM-DD');
            $('#workOrderName', this.container).val('').attr('disabled',false);
            $('#workOrderDesc', this.container).val('').attr('disabled',false);
            $('#workOrderTime', this.container).val(date).attr('disabled',false);
            $('#workLevel', this.container).val(2).attr('disabled',false);
            $('#workRemark', this.container).val(8).attr('disabled',false);
            
        }
        initTime(){
        //     let now = new Date(),//延后3天
        //         startTime = new Date(+now+3*24*60*60*1000).format('yyyy-MM-dd 00:00:00');
            let startTime = moment().add(3, 'd').startOf().format('YYYY-MM-DD HH:mm:ss');
            $('#workOrderTime',this.container).daterangepicker({ 
                startDate: startTime,
                singleDatePicker: true,
                locale:{
                    format: 'YYYY-MM-DD',
                    applyLabel: I18n.resource.date.APPLY_LABEL,
                    cancelLabel: I18n.resource.date.CACEL_LABEL,
                    fromLabel: I18n.resource.date.FROM_LABEL,
                    toLabel: I18n.resource.date.TO_LABEL,
                    weekLabel: I18n.resource.date.WEEK_LABEL,
                    daysOfWeek: I18n.resource.date.DAYS_OF_WEEK,
                    monthNames: I18n.resource.date.MONTH_NAMES,
                }
            });
        }
        show() {
            this.initDom();
            this.initTime();
            this.attachEvent();
            this.initVal();
        }
        close() {
            this.asyncArr && this.asyncArr.forEach(async=>{
                async && async.abort && async.abort();
            }) && (this.asyncArr=[]);
            $('.modal-footer.ex', this.feedModal.container).remove();
        }
        submit() {
            this.createWorkOrder().done((id)=>{
                this.createFeedBack(id)
            }).fail(()=>{
                this.createFeedBack()
            })
            
            
        }
        createFeedBack(workflowId){
            let projectId = AppConfig.projectId,
                time = this.feedModal.diagnosis.conditionModel.time(),
                workOrderId=workflowId.data,
                activeEntities = this.feedModal.diagnosis.conditionModel.activeEntities().map(v=>v.id),
                activeFaults = this.feedModal.diagnosis.conditionModel.activeFaults().map(v=>v.faultId),
                activeCategories = this.feedModal.diagnosis.conditionModel.activeCategories().map(v=>v.className);
            let name = $('#workOrderName', this.container).val(),
                summary = $('#workOrderDesc', this.container).val(),
                expected_time = $('#workOrderTime', this.container).val(),
                level = Number($('#workLevel', this.container).val()),
                workRemark = Number($('#workRemark', this.container).val()),
                infos = this.infos,
                // level = 1,
                condition = {time,activeEntities,activeFaults,activeCategories},
                owen = AppConfig.userId,
                now = moment().format('YYYY-MM-DD HH:mm:ss');
            WebAPI.post('/diagnosis_v2/setFeedback',{
                name,
                summary,
                expected_time,
                option:{
                    infos,
                },
                workOrderId,
                level,
                workRemark,
                condition,
                owen,
                time: now,
                projectId,
                type: 'history'
            }).done(rs=>{
                if(rs.status == 'OK'){
                    alert(I18n.resource.feedbackModal.FEEDBACK_SUCCESS);
                    this.infos = [];
                }else{
                    alert(I18n.resource.feedbackModal.ERROR_SAVE);
                }
                });
        }
        createWorkOrder(){
            let projectId = AppConfig.projectId,
                time = this.feedModal.diagnosis.conditionModel.time(),
                activeEntities = this.feedModal.diagnosis.conditionModel.activeEntities().map(v=>v.id),
                activeFaults = this.feedModal.diagnosis.conditionModel.activeFaults().map(v=>v.faultId),
                activeCategories = this.feedModal.diagnosis.conditionModel.activeCategories().map(v=>v.className);
            let name = $('#workOrderName', this.container).val(),
                summary = $('#workOrderDesc', this.container).val(),
                expected_time = $('#workOrderTime', this.container).val(),
                level = Number($('#workLevel', this.container).val()),
                workRemark = Number($('#workRemark', this.container).val()),
                infos = this.infos,
                // level = 1,
                condition = {time,activeEntities,activeFaults,activeCategories},
                owen = AppConfig.userId,
                now = moment().format('YYYY-MM-DD HH:mm:ss');
            let faultInfo = infos[0].faultInfo;
            let points = faultInfo.points.map(row => (row.name + ',' + row.description)).join("|");
            let fields = {
                "charts": {
                    "projectId": AppConfig.project.id,
                    "chartPointList": points,
                    "chartQueryCircle": "m5",
                    "chartStartTime": moment(faultInfo.time).format("YYYY-MM-DD HH:mm:ss"),
                    "chartEndTime":  faultInfo.endTime?moment(faultInfo.endTime).format("YYYY-MM-DD HH:mm:ss"):moment(faultInfo.time).add(6, 'h').format("YYYY-MM-DD HH:mm:ss")
                },
                "detail": ` 项目名称：${AppConfig.project['name_' + (AppConfig.language === 'zh' ? 'cn' : 'en')]} \n 诊断详情：${faultInfo.description} \n 设备名称:  ${faultInfo.entityName} \n 紧急程度：${this.feedModal.util_LevelName(Number(level))} \n 反馈详情：${summary} \n 备注:${this.feedModal.util_RemarksName(Number(workRemark))}`,
                "rawDetail": summary,
                "userId": AppConfig.userId,
                "title": "反馈：" + faultInfo.name + '\n' + name,
                // "critical": faultInfo.grade,
                "critical": this.feedModal.util_WorkOrderLevel(Number(level)),
                "dueDate": expected_time,
                "faultId": faultInfo.id,
                "type": 6,
                "zone": faultInfo.entityParentName,
                "equipment": faultInfo.entityName
            }
            var postData = {
                "processMember": {
                    "0": [2], "1": [2]
                },
                "fields": fields,
                "watchers":[74],
                "image": ""
            }
            return WebAPI.post('/workflow/task/save/', postData).done(rs => {
                if (rs.success) { 
                    this.feedModal.$feedBackModal.modal('hide');
                    // alert(I18n.resource.feedbackModal.FEEDBACK_SUCCESS);
                    return rs.data
                } else {
                    alert(I18n.resource.feedbackModal.FEEDBACK_FAILURE);
                    return 
                }
            })
        }
        attachEvent() {
            const _this = this;
        }
        createItem(infos) {
            let group = ['','',''];
            infos.forEach((info, index)=>{
                let bgClass = info.status == '1' ? 'bg-info':'bg-warning';
                let i = index % 3;
                let statusDom = info.status === ''?'':`<span class="fr tar ${bgClass} light">${diagnosisEnum.faultStatusName[info.status]}</span>`;
                group[i] += `<div class="row itemWrap">
                                <div class="item col-xs-11 grade-${info.grade}" style="width:100%;">
                                    <div><span class="fl lockWidth40" title="${info.consequence}">${info.consequence}</span>${statusDom}<div class="clear"></div></div>
                                    <div title="${info.name}">${info.name}</div>
                                    <div title="${info.entity}">${info.entity}</div>
                                    <div><span class="fl lockWidth95" title="${info.area}">${info.area}</span><span class="fr tar light">${info.time}</span><div class="clear"></div></div>
                                </div>
                            </div>` 
            });
            let html = `<div class="col-sm-4" style="width:100%;">${group[0]}</div><div class="col-sm-4">${group[1]}</div><div class="col-sm-4">${group[2]}</div>`;
            $('.workOrderListWrap', this.container).html(html);
        }
        ready() {
            window.CAPTURE_INSTANCES.forEach((capture, index)=>{
                capture.capture().done(rs=>{
                    this.infos = rs;
                    this.createItem(rs);
                });
            });
        }
        showHistory(data) {
            const {name, summary, expected_time, option,level,workRemark,workOrderId} = data;
            const {infos} = option;
            $('#workOrderName', this.container).val(name).attr('disabled',true);
            $('#workOrderDesc', this.container).val(summary).attr('disabled',true);
            $('#workOrderTime', this.container).val(expected_time).attr('disabled',true);
            $('#workLevel', this.container).val(Number(level)).attr('disabled',true);
            $('#workRemark', this.container).val(Number(workRemark)).attr('disabled',true);
            this.createItem(infos);
            $(this.container).parent().parent().append($(`<div class="modal-footer ex">
            <button type="button" class="btn btn-default feedbackToWorkOrder" data-workOrderId="${workOrderId}"  ${workOrderId==undefined?'disabled':''} >${I18n.resource.feedbackModal.WORK_ORDER}</button>
            <button type="button" class="btn btn-default feedbackModalBack" data-dismiss="modal">Back</button>
        </div>`));
        }
    }
    exports.WorkOrderHistory = WorkOrderHistory;
} ( namespace('diagnosis.Pages.FeedBackModal'),namespace('diagnosis.enum') ));
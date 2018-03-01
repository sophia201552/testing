// workOrderSpectrum.js
;(function (exports) {
    class WorkOrderSpectrum {
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
            // $('#workOrderTime', this.container).val(date).attr('disabled',false);
            $('#workLevel', this.container).val(2).attr('disabled',false);
            $('#workRemark', this.container).val(8).attr('disabled',false);
        }
        initTime() {
            // let now = new Date(),//延后3天
            //     startTime = new Date(+now+3*24*60*60*1000).format('yyyy-MM-dd 00:00:00');
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
        createWorkOrder(){
            var _this=this;
            let projectId = AppConfig.projectId,
                time = this.feedModal.diagnosis.conditionModel.time(),
                activeEntities = this.feedModal.diagnosis.conditionModel.activeEntities().map(v=>v.id),
                activeFaults = this.feedModal.diagnosis.conditionModel.activeFaults().map(v=>v.faultId),
                activeCategories = this.feedModal.diagnosis.conditionModel.activeCategories().map(v=>v.className);
            let name = $('#workOrderName', this.container).val(),
                summary = $('#workOrderDesc', this.container).val(),
                expected_time = $('#workOrderTime', this.container).val(),
                infos = this.infos,
                level = Number($('#workLevel', this.container).val()),
                workRemark = Number($('#workRemark', this.container).val()),
                condition = {time,activeEntities,activeFaults,activeCategories},
                owen = AppConfig.userId,
                now = moment().format('YYYY-MM-DD HH:mm:ss');
            let trInfo = infos[0].trInfo;
            let fields = {
                "detail": ` 项目名称：${AppConfig.project['name_' + (AppConfig.language === 'zh' ? 'cn' : 'en')]} \n 诊断详情：在 ${time.startTime} 至 ${time.endTime} 期间，${trInfo.parentName}区域下的${trInfo.name}的故障 \n 设备名称:  ${trInfo.name} \n 紧急程度：${_this.feedModal.util_LevelName(Number(level))} \n 反馈详情：${summary} \n 备注:${_this.feedModal.util_RemarksName(Number(workRemark))}`,
                "rawDetail": summary,
                "userId": AppConfig.userId,
                "title": "反馈：" + name,
                "critical": _this.feedModal.util_WorkOrderLevel(Number(level)),
                "dueDate": expected_time,
                "type": 6,
                "zone": trInfo.parentName,
                "equipment": trInfo.name
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
                    // alert(I18n.resource.feedbackModal.FEEDBACK_SUCCESS);
                    this.feedModal.$feedBackModal.modal('hide');
                    return rs.data
                } else {
                    alert(I18n.resource.feedbackModal.FEEDBACK_FAILURE);
                    return 
                }
            })
        }
        createFeedBack(workflowId){
            var _this=this;
            let projectId = AppConfig.projectId,
                workOrderId=workflowId.data,
                time = this.feedModal.diagnosis.conditionModel.time(),
                activeEntities = this.feedModal.diagnosis.conditionModel.activeEntities().map(v=>v.id),
                activeFaults = this.feedModal.diagnosis.conditionModel.activeFaults().map(v=>v.faultId),
                activeCategories = this.feedModal.diagnosis.conditionModel.activeCategories().map(v=>v.className);
            let name = $('#workOrderName', this.container).val(),
                summary = $('#workOrderDesc', this.container).val(),
                expected_time = $('#workOrderTime', this.container).val(),
                infos = this.infos,
                level = Number($('#workLevel', this.container).val()),
                workRemark = Number($('#workRemark', this.container).val()),
                condition = {time,activeEntities,activeFaults,activeCategories},
                owen = AppConfig.userId,
                now = moment().format('YYYY-MM-DD HH:mm:ss');
            WebAPI.post('/diagnosis_v2/setFeedback', {
                name,
                summary,
                expected_time,
                workOrderId,
                option: {
                    infos,
                },
                level,
                workRemark,
                condition,
                owen,
                time: now,
                projectId,
                type: 'spectrum'
            }).done(rs => {
                if (rs.status == 'OK') {
                    // this.feedModal.$feedBackModal.modal('hide');
                    alert(I18n.resource.feedbackModal.FEEDBACK_SUCCESS);
                    this.infos = [];
                } else {
                    alert(I18n.resource.feedbackModal.ERROR_SAVE);
                }
            });
        }
        attachEvent() {
            const _this = this;
        }
        createItem(infos) {
            
            let group = ['','',''];
            infos.forEach((info, index)=>{
                let i = index%3;
                group[i] += `<div class="row itemWrap">
                                <div class="item col-xs-11" style="width:100%;">
                                    <div><span class="fl tar">${I18n.resource.spectrum.EQUIPMENT}</span><span class="fr lockWidth40 tar" title="${info.name}">${info.name}</span><div class="clear"></div></div>
                                    <div><span class="fl tar">${I18n.resource.spectrum.ENERGY_COST}</span><span class="fr" title="${info.costEnergy}">${info.costEnergy}</span><div class="clear"></div></div>
                                    <div><span class="fl tar">${I18n.resource.spectrum.COST_SAVING}</span><span class="fr" title="${info.costSaving}">${info.costSaving}</span><div class="clear"></div></div>
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
            $(this.container).parent().parent().append($(`<div class="modal-footer ex">
                    <button type="button" class="btn btn-default feedbackToWorkOrder" data-workOrderId="${workOrderId}"  ${workOrderId==undefined?'disabled':''} >${I18n.resource.feedbackModal.WORK_ORDER}</button>
                    <button type="button" class="btn btn-default feedbackModalBack" data-dismiss="modal">Back</button>
                </div>`));
            this.createItem(infos);
        }
    }
    exports.WorkOrderSpectrum = WorkOrderSpectrum;
} ( namespace('diagnosis.Pages.FeedBackModal') ));
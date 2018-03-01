// WorkOrderTask.js
;(function (exports, diagnosisEnum) {
    class WorkOrderTask {
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
                            <label for="workOrderTime" class="col-sm-2 control-label">${I18n.resource.feedbackModal.DEADLINE}</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="workOrderTime">
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
            let projectId = AppConfig.projectId,
                time = this.feedModal.diagnosis.conditionModel.time(),
                activeEntities = this.feedModal.diagnosis.conditionModel.activeEntities().map(v=>v.id),
                activeFaults = this.feedModal.diagnosis.conditionModel.activeFaults().map(v=>v.faultId),
                activeCategories = this.feedModal.diagnosis.conditionModel.activeCategories().map(v=>v.className);
            let name = $('#workOrderName', this.container).val(),
                summary = $('#workOrderDesc', this.container).val(),
                expected_time = $('#workOrderTime', this.container).val(),
                infos = this.infos,
                level = 1,
                condition = {time,activeEntities,activeFaults,activeCategories},
                owen = AppConfig.userId,
                now = moment().format('YYYY-MM-DD HH:mm:ss');
            WebAPI.post('/diagnosis_v2/setFeedback', {
                name,
                summary,
                expected_time,
                option: {
                    infos,
                },
                level,
                condition,
                owen,
                time: now,
                projectId,
                type: 'history'
            }).done(rs => {
                if (rs.status == 'OK') {
                    this.feedModal.$feedBackModal.modal('hide');
                    this.infos = [];
                } else {
                    alert(I18n.resource.feedbackModal.ERROR_SAVE);
                }
            });
            let taskInfo = infos[0].taskInfo;
            let fields = {
                "detail": ` 项目名称：${AppConfig.project['name_' + (AppConfig.language === 'zh' ? 'cn' : 'en')]}
                            设备名称: ${taskInfo.parentEntityName} / ${taskInfo.entityName}
                            反馈详情：${summary}`,
                "rawDetail": summary,
                "userId": AppConfig.userId,
                "title": "反馈：" + taskInfo.faultName + '\n' + name,
                "critical": taskInfo.grade,
                // "critical": this.feedModal.util_WorkOrderLevel(Number(level)),
                "dueDate": expected_time,
                "faultId": taskInfo.id,
                "type": 6,
                "zone": taskInfo.parentEntityName,
                "equipment": taskInfo.entityName
            }
            var postData = {
                "processMember": {
                    "0": [2], "1": [2]
                },
                "watchers":[74],
                "fields": fields,
                "image": ""
            }
            WebAPI.post('/workflow/task/save/', postData).done(rs => {
                if (rs.success) { 
                    alert(I18n.resource.feedbackModal.FEEDBACK_SUCCESS);
                } else {
                    alert(I18n.resource.feedbackModal.FEEDBACK_FAILURE);
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
                let i = index%3;
                group[i] += `<div class="row itemWrap">
                                <div class="item col-xs-11 grade-${info.grade}" style="width:100%;">
                                    <div><span class="fl lockWidth40" title="${info.consequence}">${info.consequence}</span><span class="fr tar ${bgClass} light">${diagnosisEnum.faultStatusName[info.status]}</span><div class="clear"></div></div>
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
            const {name, summary, expected_time, option} = data;
            const {infos} = option;
            $('#workOrderName', this.container).val(name).attr('disabled',true);
            $('#workOrderDesc', this.container).val(summary).attr('disabled',true);
            $('#workOrderTime', this.container).val(expected_time).attr('disabled',true);
            this.createItem(infos);
        }
    }
    exports.WorkOrderTask = WorkOrderTask;
} ( namespace('diagnosis.Pages.FeedBackModal'),namespace('diagnosis.enum') ));
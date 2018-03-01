// workOrderHistory.js
;(function (exports, diagnosisEnum) {
    class WorkOrderBlank {
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
                                    <option value="2">${this.feedModal.util_LevelName(2)}</option>
                                    <option value="3">${this.feedModal.util_LevelName(3)}</option>
                                </select>
                            </div>
                        </div>
                        
                       
                        
                    </form>
                </div>
            `;
            this.container.innerHTML = mainHtml;
        }
        initVal() {
            // let date = timeFormat(new Date(+new Date() + 3*24*60*60*1000), 'yyyy-mm-dd');
            $('#workOrderName', this.container).val('').attr('disabled',false);
            $('#workOrderDesc', this.container).val('').attr('disabled',false);
            $('#workLevel', this.container).val(2).attr('disabled',false);
            
        }
        initTime(){
        //     let now = new Date(),//延后3天
        //         startTime = new Date(+now+3*24*60*60*1000).format('yyyy-MM-dd 00:00:00');
           
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

            // let faultInfo = infos[0].faultInfo;
            // let points = faultInfo.points.map(row => (row.name + ',' + row.description)).join("|");

            this.createWorkOrder().done((id)=>{
                this.createFeedBack(id)
            }).fail(()=>{
                this.createFeedBack()
            })
        }
        createWorkOrder(){
            let name = $('#workOrderName', this.container).val(),
            summary = $('#workOrderDesc', this.container).val(),
            level = Number($('#workLevel', this.container).val());
            let fields = {
                "detail": ` 项目名称：${AppConfig.project['name_' + (AppConfig.language === 'zh' ? 'cn' : 'en')]}   \n 紧急程度：${this.feedModal.util_LevelName(Number(level))} \n 反馈详情：${summary} `,
                "rawDetail": summary,
                "userId": AppConfig.userId,
                "title": "反馈："  + name,
                "critical": this.feedModal.util_WorkOrderLevel(Number(level)),
                "type": 6,
            }
            var postData = {
                "processMember": {
                    "0": [2], "1": [2]
                },
                "fields": fields,
                "watchers":[74]
            }
            return WebAPI.post('/workflow/task/save/', postData).done(rs => {
                if (rs.success) { 
                    this.feedModal.$feedBackModal.modal('hide');
                    return rs.data
                } else {
                    alert(I18n.resource.feedbackModal.FEEDBACK_FAILURE);
                    return 
                }
            })
        }
        createFeedBack(workflowId){
            
            let projectId = AppConfig.projectId,
                workOrderId=workflowId.data,
                time = this.feedModal.diagnosis.conditionModel.time(),
                activeEntities = this.feedModal.diagnosis.conditionModel.activeEntities().map(v=>v.id),
                activeFaults = this.feedModal.diagnosis.conditionModel.activeFaults().map(v=>v.faultId),
                activeCategories = this.feedModal.diagnosis.conditionModel.activeCategories().map(v=>v.className);
            let name = $('#workOrderName', this.container).val(),
                summary = $('#workOrderDesc', this.container).val(),
                level = Number($('#workLevel', this.container).val()),
                condition = {time,activeEntities,activeFaults,activeCategories},
                owen = AppConfig.userId,
                now = moment().format('YYYY-MM-DD HH:mm:ss');
            WebAPI.post('/diagnosis_v2/setFeedback',{
                name,
                summary,
                workOrderId,
                level,
                condition,
                owen,
                time: now,
                projectId,
                type: 'blank'
            }).done(rs=>{
                if(rs.status == 'OK'){
                    // this.feedModal.$feedBackModal.modal('hide');
                    alert(I18n.resource.feedbackModal.FEEDBACK_SUCCESS);
                    
                    this.infos = [];
                }else{
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
            // window.CAPTURE_INSTANCES.forEach((capture, index)=>{
            //     capture.capture().done(rs=>{
            //         this.infos = rs;
            //         this.createItem(rs);
            //     });
            // });
        }
        showHistory(data) {
            const {name, summary, expected_time, option,level,workRemark,workOrderId} = data;
            // const {infos} = option;
            $('#workOrderName', this.container).val(name).attr('disabled',true);
            $('#workOrderDesc', this.container).val(summary).attr('disabled',true);
            $('#workLevel', this.container).val(Number(level)).attr('disabled',true);
            $(this.container).parent().parent().append($(`<div class="modal-footer ex">
                                <button type="button" class="btn btn-default feedbackToWorkOrder" data-workOrderId="${workOrderId}"  ${workOrderId==undefined?'disabled':''} >${I18n.resource.feedbackModal.WORK_ORDER}</button>
                                <button type="button" class="btn btn-default feedbackModalBack" data-dismiss="modal">Back</button>
                            </div>`));
            // $('#workRemark', this.container).val(Number(workRemark)).attr('disabled',true);
            // this.createItem(infos);
        }
    }
    exports.WorkOrderBlank = WorkOrderBlank ;
} ( namespace('diagnosis.Pages.FeedBackModal'),namespace('diagnosis.enum') ));
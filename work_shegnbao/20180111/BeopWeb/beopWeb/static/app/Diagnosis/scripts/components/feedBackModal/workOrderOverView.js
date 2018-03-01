// workOrderOverView.js
;(function (exports) {
    class WorkOrderOverView {
        constructor(container, feedModal) {
            this.container = container;
            this.feedModal = feedModal;
            this.imagesSrc = [];
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
                            <div class="col-sm-10 workOrderImageWrap">
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
            this.deleteImg();
            
            $('.modal-footer.ex', this.feedModal.container).remove();
        }
        submit() {
            this.createWorkOrder()
            
               
        }
        createWorkOrder(){
            var _this=this;
            let projectId = AppConfig.projectId,
            time = this.feedModal.diagnosis.conditionModel.time(),
            activeEntities = this.feedModal.diagnosis.conditionModel.activeEntities().map(v=>v.id),
            activeFaults = this.feedModal.diagnosis.conditionModel.activeFaults().map(v=>v.faultId),
            activeCategories = this.feedModal.diagnosis.conditionModel.activeCategories().map(v=>v.className);
            let name = $('#workOrderName', this.container).val() === '' ? 'Untitled' : $('#workOrderName', this.container).val(),
            summary = $('#workOrderDesc', this.container).val(),
            expected_time = $('#workOrderTime', this.container).val(),
            images = this.imagesSrc,
            level = Number($('#workLevel', this.container).val()),
            workRemark = Number($('#workRemark', this.container).val()),
            condition = {time,activeEntities,activeFaults,activeCategories},
            owen = AppConfig.userId,
            now = moment().format('YYYY-MM-DD HH:mm:ss');
            let fields = {
                "detail": ` 项目名称：${AppConfig.project['name_' + (AppConfig.language === 'zh' ? 'cn' : 'en')]} \n 数据详情：在 ${time.startTime} 至 ${time.endTime} 期间 \n 紧急程度：${_this.feedModal.util_LevelName(Number(level))}   \n 反馈详情：${summary} \n 备注:${_this.feedModal.util_RemarksName(Number(workRemark))}`,
                "rawDetail": summary,
                "critical": _this.feedModal.util_WorkOrderLevel(Number(level)),
                "userId": AppConfig.userId,
                "title": "反馈：" + name,
                "dueDate": expected_time,
                "type": 6
            }
            var arrFile=[];
            _this.srcBase64.forEach(item=>{
                 var bytes = window.atob(item.split(',')[1]); //去掉url的头，并转换为byte
                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }
                var pic = new Blob([ab], { type: 'image/jpeg' });
                var file = new File([pic], new Date().format('yyyy-MMM-dd hh:mm:ss') + '.jpg');
                arrFile.push(file);
            })
           
            
            function setFormData(arrFile) {
                var formData = new FormData();
                arrFile.forEach(function(item) {
                    formData.append('file', item);
                }.bind(this));
                formData.append('userId', AppConfig.userId);
                return formData
            }
            var postData2=setFormData(arrFile)
            var xhr = new XMLHttpRequest()
            xhr.open("POST",  "/workflow/attachment/upload");
            xhr.send(postData2);
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4){
                    if((xhr.status>=200 && xhr.status<300) || xhr.status==304){
                        var imgDatas=JSON.parse(xhr.responseText).data;
                        var postData3 = {
                            "processMember": {
                                "0": [2], "1": [2]
                            },
                            "fields": fields,
                            // "image": base64,
                            "attachment":imgDatas,
                            "watchers":[74],
                        }
                         WebAPI.post('/workflow/task/save/', postData3).done(rs => {
                            if (rs.success) { 
                                _this.feedModal.$feedBackModal.modal('hide');
                                _this.createFeedBack(rs.data)
                            } else {
                                alert(I18n.resource.feedbackModal.FEEDBACK_FAILURE);
                            }
                        })
                    }else{
                        // alert("请求失败！");
                    }
        
                }
        
            };
            // WebAPI.post('/workflow/attachment/upload', postData2).done(rs => {
            //     console.log(rs)
            // })
            // WebAPI.post('/workflow/task/save/', postData).done(rs => {
            //     if (rs.success) { 
            //         alert(I18n.resource.feedbackModal.FEEDBACK_SUCCESS);
            //     } else {
            //         alert(I18n.resource.feedbackModal.FEEDBACK_FAILURE);
            //     }
            // })
        // }
        
        }
        createFeedBack(workflowId){
            let projectId = AppConfig.projectId,
                time = this.feedModal.diagnosis.conditionModel.time(),
                workOrderId=workflowId,
                activeEntities = this.feedModal.diagnosis.conditionModel.activeEntities().map(v=>v.id),
                activeFaults = this.feedModal.diagnosis.conditionModel.activeFaults().map(v=>v.faultId),
                activeCategories = this.feedModal.diagnosis.conditionModel.activeCategories().map(v=>v.className);
            let name = $('#workOrderName', this.container).val() === '' ? 'Untitled' : $('#workOrderName', this.container).val(),
                summary = $('#workOrderDesc', this.container).val(),
                expected_time = $('#workOrderTime', this.container).val(),
                images = this.imagesSrc,
                level = Number($('#workLevel', this.container).val()),
                workRemark = Number($('#workRemark', this.container).val()),
                condition = {time,activeEntities,activeFaults,activeCategories},
                owen = AppConfig.userId,
                now = moment().format('YYYY-MM-DD HH:mm:ss');
            WebAPI.post('/diagnosis_v2/setFeedback', {
                name,
                summary,
                expected_time,
                option: {
                    images
                },
                level,
                workOrderId,
                workRemark,
                condition,
                owen,
                time: now,
                projectId,
                type: 'overview'
            }).done(rs => {
                if (rs.status == 'OK') {
                    // this.feedModal.$feedBackModal.modal('hide');
                    alert(I18n.resource.feedbackModal.FEEDBACK_SUCCESS);
                    this.imagesSrc = [];
                } else {
                    alert(I18n.resource.feedbackModal.ERROR_SAVE);
                }
            });
        }
        attachEvent() {
            const _this = this;
        }
        ready() {
            let $imageWrap = $('.workOrderImageWrap', this.container).html('Loading images').addClass('noImage');
            let srcs = [];
            let promiseArr = [];
            window.CAPTURE_INSTANCES.forEach((capture, index)=>{
                promiseArr.push(capture.capture().done(rs=>{
                    if(index == 0){
                        $imageWrap.html('').removeClass('noImage');
                    }
                    srcs.push(...rs);
                }));
            });
            $.when(...promiseArr).done(()=>{
                let index = this.asyncArr.length;
                this.asyncArr[index] = WebAPI.post('/diagnosis_v2/saveDiagnosisCapture',{
                    images: srcs.map(src=>{return src.replace(/^data:image\/jpeg;base64/,'')})
                }).done(v=>{
                    this.imagesSrc = [];
                    this.srcBase64=[];
                    if(v.status == 'OK'){
                        v.data.forEach((d, i)=>{
                            this.imagesSrc.push(d.url);
                            let href = d.url
                            $imageWrap.append($(`<a href="${href}" target="_Blank"><img src="${srcs[i]}" alt="..." class="img-thumbnail"></a>`));
                            this.srcBase64.push(srcs[i]);
                        });
                    };
                    
                }).always(()=>{
                    this.asyncArr[index] = undefined;
                });
            });
        }
        deleteImg() {
            if(this.imagesSrc.length>0){
                WebAPI.post('/diagnosis_v2/deleteDiagnosisCapture',{
                    urls: this.imagesSrc
                }).always(()=>{
                    this.imagesSrc = [];
                });
            }
        }
        showHistory(data) {
            const {name, summary, expected_time, option,level,workRemark,workOrderId} = data;
            const {images} = option;
            $('#workOrderName', this.container).val(name).attr('disabled',true);
            $('#workOrderDesc', this.container).val(summary).attr('disabled',true);
            $('#workOrderTime', this.container).val(expected_time).attr('disabled',true);
            $('#workLevel', this.container).val(Number(level)).attr('disabled',true);
            $('#workRemark', this.container).val(Number(workRemark)).attr('disabled',true);
            $(this.container).parent().parent().append($(`<div class="modal-footer ex">
            <button type="button" class="btn btn-default feedbackToWorkOrder" data-workOrderId="${workOrderId}"  ${workOrderId==undefined?'disabled':''} >${I18n.resource.feedbackModal.WORK_ORDER}</button>
            <button type="button" class="btn btn-default feedbackModalBack" data-dismiss="modal">Back</button>
        </div>`));
            let $imageWrap = $('.workOrderImageWrap', this.container).html('').removeClass('noImage');
            images.forEach(src=>{
                let href = src.replace(/^beopWeb/,'');
                $imageWrap.append($(`<a href="${href}" target="_Blank"><img src="${href}" alt="..." class="img-thumbnail"></a>`));
            });
        }
    }
    exports.WorkOrderOverView = WorkOrderOverView;
} ( namespace('diagnosis.Pages.FeedBackModal') ));
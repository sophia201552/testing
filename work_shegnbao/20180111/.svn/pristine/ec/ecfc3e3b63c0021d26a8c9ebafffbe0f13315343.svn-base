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
                            <label for="workOrderName" class="col-sm-2 control-label">Name:</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="workOrderName" placeholder="name">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="workOrderDesc" class="col-sm-2 control-label">Desc:</label>
                            <div class="col-sm-10">
                                <textarea class="form-control" id="workOrderDesc" placeholder="desc" style="max-width:100%;max-height:54px;"></textarea >
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="workOrderTime" class="col-sm-2 control-label">Time:</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="workOrderTime">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">附件:</label>
                            <div class="col-sm-10 workOrderImageWrap">
                            </div>
                        </div>
                    </form>
                </div>
            `;
            this.container.innerHTML = mainHtml;
        }
        initVal() {
            let date = timeFormat(new Date(+new Date() + 3*24*60*60*1000), 'yyyy-mm-dd');
            $('#workOrderName', this.container).val('').attr('disabled',false);
            $('#workOrderDesc', this.container).val('').attr('disabled',false);
            $('#workOrderTime', this.container).val(date).attr('disabled',false);
        }
        initTime() {
            let now = new Date(),//延后3天
                startTime = new Date(+now+3*24*60*60*1000).format('yyyy-MM-dd 00:00:00');
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
            let projectId = AppConfig.projectId,
                time = this.feedModal.diagnosis.conditionModel.time(),
                activeEntities = this.feedModal.diagnosis.conditionModel.activeEntities().map(v=>v.id),
                activeFaults = this.feedModal.diagnosis.conditionModel.activeFaults().map(v=>v.faultId),
                activeCategories = this.feedModal.diagnosis.conditionModel.activeCategories().map(v=>v.className);
            let name = $('#workOrderName', this.container).val(),
                summary = $('#workOrderDesc', this.container).val(),
                expected_time = $('#workOrderTime', this.container).val(),
                images = this.imagesSrc,
                level = 1,
                condition = {time,activeEntities,activeFaults,activeCategories},
                owen = AppConfig.userId,
                now = timeFormat(new Date());
            WebAPI.post('/diagnosis_v2/setFeedback',{
                name,
                summary,
                expected_time,
                option:{
                    images
                },
                level,
                condition,
                owen,
                time: now,
                projectId,
                type: 'overview'
            }).done(rs=>{
                if(rs.status == 'OK'){
                    this.feedModal.$feedBackModal.modal('hide');
                    this.imagesSrc = [];
                }else{
                    alert('保存失败');
                }
            })
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
                    if(v.status == 'OK'){
                        v.data.forEach((d, i)=>{
                            this.imagesSrc.push(d.url);
                            let href = d.url
                            $imageWrap.append($(`<a href="${href}" target="_Blank"><img src="${srcs[i]}" alt="..." class="img-thumbnail"></a>`));
                        });
                    }
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
            const {name, summary, expected_time, option} = data;
            const {images} = option;
            $('#workOrderName', this.container).val(name).attr('disabled',true);
            $('#workOrderDesc', this.container).val(summary).attr('disabled',true);
            $('#workOrderTime', this.container).val(expected_time).attr('disabled',true);
            let $imageWrap = $('.workOrderImageWrap', this.container).html('').removeClass('noImage');
            images.forEach(src=>{
                let href = src.replace(/^beopWeb/,'');
                $imageWrap.append($(`<a href="${href}" target="_Blank"><img src="${href}" alt="..." class="img-thumbnail"></a>`));
            });
        }
    }
    exports.WorkOrderOverView = WorkOrderOverView;
} ( namespace('diagnosis.Pages.FeedBackModal') ));
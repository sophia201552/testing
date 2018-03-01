// feedBackModal.js
;(function (exports, History, WorkOrderOverView, WorkOrderHistory,WorkOrderTask, WorkOrderSpectrum,WorkOrderBlank) {
    class FeedBackModal {
        constructor(diagnosis) {
            this.diagnosis = diagnosis;
            this.history = null;
            this.workOrderOverView = null;
            this.workOrderHistory = null;
            this.workOrderTask = null;
            this.workOrderSpectrum = null;
            this.workOrderBlank = null;
            this.container = null;
            this.historyDom = null;
            this.workOrderDom = null;
            this.$feedBackModal = null;
            this.activeLayer = null;
            this.init();
        }
        init() {
            $('#feedBackModal').remove();
            const mainHtml = `
                <div id="feedBackModal" class="modal fade" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close feedbackModalClose" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title"></h4>
                            </div>
                            <div class="modal-body">
                                <div id="workOrder"></div>
                                <div id="history"></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default feedbackModalClose" data-dismiss="modal">${I18n.resource.feedbackModal.CLOSE}</button>
                                <button type="button" class="btn btn-primary feedbackModalSubmit">${I18n.resource.feedbackModal.SUBMIT}</button>
                            </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
            `;
            $('body').append(mainHtml);
            this.container = document.querySelector('#feedBackModal');
            this.$feedBackModal = $(this.container).modal({
                keyboard: true,
                show: false
            })
            this.attachEvent();
            this.initWorkOrder();
            this.initHistory();
        }
        show(type = 'history', isReset = true, workorderType = 'overview') {
            let title = '';
            switch(type){
                case 'history':
                    this.historyDom.style.display = 'block';
                    this.workOrderDom.style.display = 'none';
                    this.container.querySelector('.modal-footer').style.display = 'none';
                    this.activeLayer = this.history;
                    title = I18n.resource.feedbackModal.HISTORY_TITLE;
                    isReset && this.activeLayer.show();
                    break;
                case 'workOrder':
                    this.historyDom.style.display = 'none';
                    this.workOrderDom.style.display = 'block';
                    this.container.querySelector('.modal-footer').style.display = 'block';
                    title = I18n.resource.feedbackModal.FEEDBACK_TITLE;
                    switch(workorderType){
                        case 'overview':
                            this.activeLayer = this.workOrderOverView;
                            break;
                        case 'history':
                            this.activeLayer = this.workOrderHistory;
                            break;
                            case 'task':
                            this.activeLayer = this.workOrderTask;
                            break;                            
                        case 'spectrum':
                            this.activeLayer = this.workOrderSpectrum;
                            break;
                        case 'blank':
                            this.activeLayer = this.workOrderBlank;
                            break;
                    }
                    isReset && this.activeLayer.show();
                    this.activeLayer.ready();
                    break;
            }
            this.container.querySelector('.modal-title').innerHTML = title;
            this.$feedBackModal.modal('show');
        }
        close() {
            this.activeLayer.close();
        }
        attachEvent() {
            const _this = this;
            $('.feedbackModalClose', this.container).off('click.feedbackModalClose').on('click.feedbackModalClose',function(){
                _this.activeLayer.close();
            });
            $('.feedbackModalSubmit', this.container).off('click.feedbackModalSubmit').on('click.feedbackModalSubmit',function(){
                // this.container
                var workOrderName=$('#workOrderName', this.container).val();
                var workOrderDesc=$('#workOrderDesc', this.container).val();
                if(!(workOrderDesc&&workOrderName)){
                    alert(I18n.resource.feedbackModal.TIP)
                    return
                }
                _this.activeLayer.submit();
            })
        }
        initHistory() {
            this.historyDom = this.container.querySelector('#history');
            this.history = new History(this.historyDom,this);
        }
        util_RemarksName(i){
                switch (i){
                    case 0:return I18n.type=='zh'?'非故障-误报':'Non-fault - False positives';
                    case 1:return I18n.type=='zh'?'非故障-既有运行策略':'Non-fault - Existing operation strategy';
                    case 2:return I18n.type=='zh'?'详情问题-原因、分析有误':'Details issues- The reason, the analysis is wrong';
                    case 3:return I18n.type=='zh'?'详情问题-建议不合理':'Details issues - Suggestion unreasonable';
                    case 4:return I18n.type=='zh'?'详情问题-故障快照缺少重要数据':'Details Issues - The failure snapshot is missing important data';
                    case 5:return I18n.type=='zh'?'详情问题-故障快照数据错误':'Details Issues - The fault snapshot data is incorrect';
                    case 6:return I18n.type=='zh'?'故障无法修复':'Fault can not be repaired';
                    case 7:return I18n.type=='zh'?'故障未检测出':'Fault not detected';
                    case 8:return I18n.type=='zh'?'其他':'Others';
                    
                    default:return
                }
        }
        util_LevelName(i){
                switch (i){
                    case 1:return I18n.type=='zh'?'紧急':'Urgent';
                    case 2:return I18n.type=='zh'?'高':'High';
                    case 3:return I18n.type=='zh'?'普通':'Ordinary';
                    default:return
                }
           
        }
        util_WorkOrderLevel(i){
            switch (i){
                case 1:return 2;
                case 2:return 1;
                case 3:return 0;
                default:return
            }
        }
        initWorkOrder() {
            this.workOrderDom = this.container.querySelector('#workOrder');
            this.workOrderOverView = new WorkOrderOverView(this.workOrderDom,this);
            this.workOrderHistory = new WorkOrderHistory(this.workOrderDom,this);
            this.workOrderTask = new WorkOrderTask(this.workOrderDom,this);
            this.workOrderSpectrum = new WorkOrderSpectrum(this.workOrderDom,this);
            this.workOrderBlank = new WorkOrderBlank(this.workOrderDom,this);
        }
        backWorkOrder(data) {
            let _this = this;
            this.show('workOrder', true, data.type);
            this.activeLayer.showHistory(data);
            this.container.querySelector('.modal-footer').style.display = 'none';
            // $('.modal-content', this.container).append($(`<div class="modal-footer ex">
            //                     <button type="button" class="btn btn-default feedbackModalBack" data-dismiss="modal">Back</button>
            //                 </div>`));
            $('.feedbackModalBack').off('click').on('click',function(){
                $(this).parent().remove();
                _this.show('history', false);
            });
            $('.feedbackToWorkOrder').off('click').on('click',function(){
                var href='/observer#page=workflow&type=transaction&transactionId=';
                var id=$(this).attr('data-workOrderId');
                if(id&&id!=undefined&&id!='undefined'){
                     window.open(href+id,'_blank');
                }
            });
        }
    }
    exports.FeedBackModal = FeedBackModal;
} ( namespace('diagnosis.components'), 
    namespace('diagnosis.Pages.FeedBackModal.History'), 
    namespace('diagnosis.Pages.FeedBackModal.WorkOrderOverView'), 
    namespace('diagnosis.Pages.FeedBackModal.WorkOrderHistory'),
    namespace('diagnosis.Pages.FeedBackModal.WorkOrderTask'),
    namespace('diagnosis.Pages.FeedBackModal.WorkOrderSpectrum'),
    namespace('diagnosis.Pages.FeedBackModal.WorkOrderBlank')
));
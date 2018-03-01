// feedBackModal.js
;(function (exports, History, WorkOrderOverView, WorkOrderHistory, WorkOrderSpectrum) {
    class FeedBackModal {
        constructor(diagnosis) {
            this.diagnosis = diagnosis;
            this.history = null;
            this.workOrderOverView = null;
            this.workOrderHistory = null;
            this.workOrderSpectrum = null;
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
                                <button type="button" class="btn btn-default feedbackModalClose" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary feedbackModalSubmit">Save changes</button>
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
                    title = 'History';
                    isReset && this.activeLayer.show();
                    break;
                case 'workOrder':
                    this.historyDom.style.display = 'none';
                    this.workOrderDom.style.display = 'block';
                    this.container.querySelector('.modal-footer').style.display = 'block';
                    title = 'WorkOrder';
                    switch(workorderType){
                        case 'overview':
                            this.activeLayer = this.workOrderOverView;
                            break;
                        case 'history':
                            this.activeLayer = this.workOrderHistory;
                            break;
                        case 'spectrum':
                            this.activeLayer = this.workOrderSpectrum;
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
                _this.activeLayer.submit();
            })
        }
        initHistory() {
            this.historyDom = this.container.querySelector('#history');
            this.history = new History(this.historyDom,this);
        }
        initWorkOrder() {
            this.workOrderDom = this.container.querySelector('#workOrder');
            this.workOrderOverView = new WorkOrderOverView(this.workOrderDom,this);
            this.workOrderHistory = new WorkOrderHistory(this.workOrderDom,this);
            this.workOrderSpectrum = new WorkOrderSpectrum(this.workOrderDom,this);
        }
        backWorkOrder(data) {
            let _this = this;
            this.show('workOrder', true, data.type);
            this.activeLayer.showHistory(data);
            this.container.querySelector('.modal-footer').style.display = 'none';
            $('.modal-content', this.container).append($(`<div class="modal-footer ex">
                                <button type="button" class="btn btn-default feedbackModalBack" data-dismiss="modal">Back</button>
                            </div>`));
            $('.feedbackModalBack').off('click').on('click',function(){
                $(this).parent().remove();
                _this.show('history', false);
            });
        }
    }
    exports.FeedBackModal = FeedBackModal;
} ( namespace('diagnosis.components'), 
    namespace('diagnosis.Pages.FeedBackModal.History'), 
    namespace('diagnosis.Pages.FeedBackModal.WorkOrderOverView'), 
    namespace('diagnosis.Pages.FeedBackModal.WorkOrderHistory'),
    namespace('diagnosis.Pages.FeedBackModal.WorkOrderSpectrum')
));
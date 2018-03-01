// history.js
;(function (exports, diagnosisEnum) {
    class History {
        constructor(container, feedModal) {
            this.container = container;
            this.feedModal = feedModal;
            this.postData = {
                owen: AppConfig.userId,
                projectId: AppConfig.projectId
            };
            this.data = [];
            this.filterDate = [];
            this.asyncArr = [];
            this.init();
        }
        init() {
            const mainHtml = `
                <div class="historyModal" style="height:501px;">
                    <div class ="row">
                        <div class="date input-group col-sm-4">
                            <input type="text" class="form-control" id="historyTime">
                            <span class="input-group-btn">
                                <label class="btn btn-default" type="button" for="historyTime">
                                    <span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
                                </label>
                            </span>
                        </div>
                        <div class="search input-group col-sm-4 col-sm-offset-4">
                            <input type="text" class="form-control" id="historySearch" placeholder="Search">
                            <span class="input-group-btn">
                                <button class="btn btn-default" type="button" id="historyBtnSearch">
                                    <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                                </button>
                            </span>
                        </div>
                    </div>
                    <div class="tableWrap">
                        <table class="table table-condensed" style="table-layout: fixed;width: 100%;">
                            <thead>
                                <tr>
                                    <th style="width:20%;" data-id="name" data-reverse="1" i18n="">${I18n.resource.feedbackModal.TH_NAME}</th>
                                    <th style="width:40%;" data-id="summary" data-reverse="0" i18n="">${I18n.resource.feedbackModal.TH_DESC}</th>
                                    <th style="width:20%;" data-id="time" data-reverse="0" i18n="">${I18n.resource.feedbackModal.TH_TIME}</th>
                                    <th style="width:20%;" data-id="operation" data-reverse="0" i18n="">${I18n.resource.feedbackModal.OPERTION}</th>                                  </tr>
                            </thead>
                            <tbody></tbody>
                            <tfoot><tfoot>
                        </table>
                    </div>
                </div>
            `;
            this.container.innerHTML = mainHtml;
            this.initTime();
            this.attachEvent();
            
        }
        show() {
            this.getData();
            
        }
        close() {
            this.asyncArr && this.asyncArr.forEach(async=>{
                async && async.abort && async.abort();
            }) && (this.asyncArr=[]);
        }
        attachEvent() {
            const _this = this;
            let $historySearch = $('#historySearch', this.container),
                $historyBtnSearch = $('#historyBtnSearch', this.container),
                $thead = $('.historyModal thead', this.container),
                $tbody= $('.historyModal tbody', this.container);
            $historyBtnSearch.off('click').on('click', function(e){
                let val = $historySearch.val().toLowerCase();
                _this.filterDate = _this.data.filter(it=>{
                    if (it.name.toLowerCase().indexOf(val) > -1 || it.summary.toLowerCase().indexOf(val) > -1) {
                        return it;
                    }
                });
                _this.refreshData(_this.filterDate);
            });
            $historySearch.off('keydown').on('keydown', function (e) {
                if (e.keyCode == 13) {
                    $historyBtnSearch.trigger('click');
                }
            });
            $thead.off('click').on('click', 'th', function () {
                let propName = this.dataset.id;
                let reverse = this.dataset.reverse;
                if (reverse == '1') {
                    _this.filterDate.sort(function (a, b) {
                        if (isNaN(Number(a[propName]))||isNaN(Number(b[propName]))) {
                            return (b[propName]).localeCompare(a[propName]);
                        } else {
                            return b[propName] - a[propName];
                        }
                    });
                    this.dataset.reverse = '0';
                } else {
                    _this.filterDate.sort(function (a, b) {
                        if (isNaN(Number(a[propName]))||isNaN(Number(b[propName]))) {
                            return (a[propName]).localeCompare(b[propName]);
                        } else {
                            return a[propName] - b[propName]
                        }
                    });
                    this.dataset.reverse = '1';
                }
                _this.refreshData(_this.filterDate);
            });
            $tbody.off('click.clicktrBtn').on('click.clicktrBtn','tr td .toWorkOrderBtn',function(){
               var href='/observer#page=workflow&type=transaction&transactionId=';
               var id=$(this).attr('data-workOrderId');
               if(id&&id!=undefined&&id!='undefined'){
                    window.open(href+id,'_blank');
               }
            })
            $tbody.off('click.clicktr').on('click.clicktr','tr td:not(:last-child)',function(e){
                let id = $(this).parent()[0].id.split('feedback_')[1];
                let info = _this.data.find(v=>v._id == id);
                _this.feedModal.backWorkOrder(info);
            })
        }
        initTime() {
            // let time = this.feedModal.diagnosis.conditionModel.time(),
            //     startTime = time.startTime,
            //     endTime = time.endTime,
            let now = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
            var startTime = moment().set('month', moment().month()-1).startOf('day').format('YYYY-MM-DD HH:mm:ss');    
            this.postData.startTime = startTime;
            this.postData.endTime = now;
            $('#historyTime',this.container).daterangepicker({ 
                startDate: startTime,
                endDate: now,
                maxDate: now,
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
            }, this._changeTime.bind(this));
        }
        _changeTime(start, end, label) {
            let startTime = moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endTime = moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss');
            this.postData.startTime = startTime;
            this.postData.endTime = endTime;
            this.getData();
        }
        getData(postData={}) {
            postData = $.extend({},this.postData,postData);
            let $tbody = $(".historyModal tbody", this.container);
            $('#feedBackModal .modal-footer.ex').remove();
            Spinner.spin($tbody[0]);
            let index = this.asyncArr.length;
            let async = WebAPI.post('/diagnosis_v2/getFeedback', postData).done(rs=>{
                if(rs.status=='OK'){
                    this.data = rs.data;
                    this.filterDate = rs.data;
                    this.refreshData(this.data);
                }
            }).always(()=>{
                this.asyncArr[index] = undefined;
                Spinner.stop();
            });
            this.asyncArr.push(async);
            return async;
        }
        refreshData(data) {
            let $tbody = $(".historyModal tbody", this.container);
            if (!data || !data.length) {
                $tbody.html(`<div class="noData">${I18n.resource.feedbackModal.NO_DATA}</div>`);
                return;
            }
            $('.noData', $tbody).remove();
            let str = '';
            data.forEach((info, index) => {
                var name = info.name === '' ? 'Untitled' : info.name;
                str += `<tr id="${'feedback_' + info._id}">
                            <td style="width:20%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${name}</td>
                            <td style="width:40%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${info.summary}</td>
                            <td style="width:15%;">${info.time}</td>
                            <td style="width:20%""><a class="btn btn-default toWorkOrderBtn"  ${info.workOrderId!=undefined?'':'disabled'} style="padding: 3px 4px;font-size: 12px;" data-workOrderId="${info.workOrderId}" role="button">${I18n.resource.feedbackModal.WORK_ORDER}</a></td>                        </tr>`;
            });
            $tbody.html(str);
        }
    }
    exports.History = History;
} ( namespace('diagnosis.Pages.FeedBackModal'), namespace('diagnosis.enum') ));
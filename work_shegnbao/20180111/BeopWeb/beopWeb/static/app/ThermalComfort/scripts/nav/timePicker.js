;(function (exports) {
    class TimePicker {
        constructor(container, diagnosis, nav) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.nav = nav;
            this.init();
        }
        init() {
            const headHtml = `<div id="pickerWrap"><input id="picker" /><label class="glyphicon glyphicon-menu-down"></label></div>`;
            this.container.innerHTML = headHtml;
            this.initTime();
            this.attachEvent();
        }
        initTime() {
            let now = new Date(),
                startTime = this.diagnosis.conditionModel.time().startTime||new Date(now - 518400000).format('yyyy-MM-dd 00:00:00'),
                endTime = this.diagnosis.conditionModel.time().endTime||now.format('yyyy-MM-dd HH:00:00');
            this.diagnosis.conditionModel.time({
                startTime,
                endTime
            });
            $('#picker',this.container).daterangepicker({ 
                startDate: startTime,
                endDate: endTime,
                maxDate: endTime,
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
            let startTime = start.format('YYYY-MM-DD 00:00:00'),
                endTime = end.format('YYYY-MM-DD 23:59:59');
                //endtime若为当天截止当前小时
                endTime.split(' ')[0]==new Date().format('yyyy-MM-dd 23:59:59').split(' ')[0]?endTime=new Date().format('yyyy-MM-dd HH:00:00'):1
            this.diagnosis.conditionModel.time({
                startTime,
                endTime
            });
        }
        attachEvent() {
            const _this = this;
            let $container = $(this.container);
            $container.find('#picker').off('show.daterangepicker').on('show.daterangepicker',function(e,dateRangePicker){
                this.classList.add('active');
                dateRangePicker.container.hide();
                dateRangePicker.container.fadeIn();
            }).off('hide.daterangepicker').on('hide.daterangepicker',function(){
                this.classList.remove('active');
            }).siblings('label').off('click').on('click',function(){
                $(this).siblings('#picker').trigger('focus');
            });
        }
    }
    exports.TimePicker = TimePicker;
} ( namespace('thermalComfort.Nav') ));
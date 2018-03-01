// timePicker.js
;(function (exports) {
    class TimePicker {
        constructor(container, diagnosis, nav) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.nav = nav;
            this.init();
        }
        init() {
            const headHtml = `<div id="timePicker"><div id="pickerWrap"><input id="picker" /><label class="glyphicon glyphicon-menu-down"></label></div></div>`;
            this.container.innerHTML = headHtml;
            this.unbindStateOb();
            this.bindStateOb();
            this.initTime();
            this.attachEvent();
        }
        show() {

        }
        close() {

        }
        initTime() {
            // let now = new Date(),
            //     startTime = this.diagnosis.conditionModel.time().startTime||new Date(now - 518400000).format('yyyy-MM-dd 00:00:00'),
            //     endTime = this.diagnosis.conditionModel.time().endTime||now.format('yyyy-MM-dd 23:59:59');

            let startTime = this.diagnosis.conditionModel.time().startTime || moment().subtract(6, 'd').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endTime =  this.diagnosis.conditionModel.time().endTime|| moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

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
            // let startTime = start.format('YYYY-MM-DD 00:00:00'),
            //     endTime = end.format('YYYY-MM-DD 23:59:59');
            let startTime = moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endTime = moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss');
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
        bindStateOb() {
            this.diagnosis.conditionModel.addEventListener('update.time',this.updateTime1,this);
            this.nav.state&&this.nav.state.addEventListener('update.time',this.updateTime2,this);
            // this.diagnosis.conditionModel.addEventListener('update.time',this.updateTime3,this);
        }
        unbindStateOb() {
            this.diagnosis.conditionModel.removeEventListener('update.time',this.updateTime1,this);
            this.nav.state&&this.nav.state.removeEventListener('update.time',this.updateTime2,this);
            // this.nav.state&&this.nav.state.removeEventListener('update.time',this.updateTime3,this);
        }
        updateTime1() {
            const {startTime,endTime} = this.diagnosis.conditionModel.time();
            this.nav.state&&this.nav.state.time({
                startTime,
                endTime
            });
            //更新entitiesIntactRate
            this.nav.structure && this.nav.structure.getIntactRate();
            //更新cagegory
            this.nav.category && this.nav.category.getData();
        }
        updateTime2() {
            //更新fault
            this.nav.fault && this.nav.fault.getData();
            this.diagnosis.conditionModel.activeFaults&&this.diagnosis.conditionModel.activeFaults([]);
        }
        updateTime3() {
            const {startTime,endTime} = this.diagnosis.conditionModel.time();
            this.nav.state&&this.nav.state.time({
                startTime,
                endTime
            });
            //更新cagegory
            this.nav.category && this.nav.category.getData();
        }
    }
    exports.TimePicker = TimePicker;
} ( namespace('diagnosis.Pages.nav') ));
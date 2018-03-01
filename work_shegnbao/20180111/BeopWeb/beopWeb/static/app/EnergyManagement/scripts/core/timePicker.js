// timePicker.js
class TimePicker {
    constructor(screen,container) {
        this.screen = screen
        this.container = container;
        this.init();
    }
    init() {
        const headHtml = `<div id="timePicker"><div id="pickerWrap"><input id="picker" /><label class="glyphicon glyphicon-menu-down" for="picker"></label></div></div>`;
        this.container.innerHTML = headHtml;
        // this.unbindStateOb();
        // this.bindStateOb();
        this.initTime();
        this.attachEvent();
    }
    initTime(){
        let now = toDate();
        $('#picker').val(now.format('yyyy-MM-dd')).datetimepicker('remove').datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose:true,
            minView:2,
            startView:2,
            todayBtn:'linked',
            endDate:toDate()
        });
    }
    attachEvent(){
        $('#picker').off('change').on('change',(e)=>{
            this.screen.onTimeChange && this.screen.onTimeChange(toDate(e.currentTarget.value).format('yyyy-MM-dd HH:mm:ss'));
        })
    }
    // initTime() {
    //     let now = toDate(),
    //         startTime = toDate(now - 604800000).format('yyyy-MM-dd HH:mm:ss'),
    //         endTime = now.format('yyyy-MM-dd HH:mm:ss');
    //     $('#picker',this.container).daterangepicker({ 
    //         startDate: startTime,
    //         endDate: endTime,
    //         maxDate: endTime,
    //         locale:{
    //             format: 'YYYY-MM-DD',
    //             applyLabel: '确定',
    //             cancelLabel: '取消',
    //             fromLabel: '从',
    //             toLabel: '到',
    //             weekLabel: '周',
    //             daysOfWeek: '天',
    //             monthNames: '月份',
    //         }
    //     }, this._changeTime.bind(this));
    // }
    // _changeTime(start, end, label) {
    //     let startTime = start.format('YYYY-MM-DD 00:00:00'),
    //         endTime = end.format('YYYY-MM-DD 23:59:59');
    // }
    // attachEvent() {
    //     const _this = this;
    //     let $container = $(this.container);
    //     $container.find('#picker').off('show.daterangepicker').on('show.daterangepicker',function(e,dateRangePicker){
    //         this.classList.add('active');
    //         dateRangePicker.container.hide();
    //         dateRangePicker.container.fadeIn();
    //     }).off('hide.daterangepicker').on('hide.daterangepicker',function(){
    //         this.classList.remove('active');
    //     }).off('apply.daterangepicker').on('apply.daterangepicker',function(e,picker){
    //         _this.screen.onTimeChange && _this.screen.onTimeChange({
    //             'startTime':picker.startDate.format('YYYY-MM-DD HH:mm:ss'),
    //             'endTime':picker.endDate.format('YYYY-MM-DD HH:mm:ss')
    //         });
    //     }).siblings('label').off('click').on('click',function(){
    //         $(this).siblings('#picker').trigger('focus');
    //     });
    // }
    // updateTime1() {
    // }
}
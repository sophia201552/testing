/**
 * Created by vicky on 2016/3/14.
 */
var Schedule = (function(){
    var _this;

    Schedule.navOptions = {
        top: '<span class="topNavTitle">日程</span>'
    };

    function Schedule(){
        _this = this;
        this.store = undefined;
        this.isEdit = false;
        this.schedule = undefined;
    }

    Schedule.prototype = {
        show: function () {
            WebAPI.get('/static/app/temperatureControl/views/config/schedule.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                //权限
                if(curRoom && curRoom.grade === 0) $('.btnCtn').hide();

                WebAPI.get('/appTemperature/schedule/get/' + AppConfig.roomId).done(function(result){//<roomId>
                    if(!result || $.isEmptyObject(result)){
                        _this.store = {
                            'roomId': AppConfig.roomId,//AppConfig.roomId,
                            'option': []
                        }
                    }else{
                        _this.store = result;
                        _this.renderSchedule(result);
                    }
                    if(curRoom && curRoom.grade !== 0) _this.attachEvents();
                });
            });
        },
        init: function () {


        },
        renderSchedule: function(data){
            var strHtml = '';
            for(var j = 0, schedule; j < data.option.length; j++){
                schedule = data.option[j];
                strHtml += ('<div class="itemSchedule" data-id="'+ data._id + '_' +schedule.moment +'">\
                <div class="">\
                    <span class="glyphicon glyphicon-minus btnRemove"></span>\
                    <span class="time">'+ schedule.moment +'</span>\
                    <div class="opt-btn btn-switch-on" id="" data-key="">\
                        <div class="btn-switch-slider"></div>\
                    </div>\
                </div>\
            </div>');
            }
            $('#listScheduleCtn').html(strHtml);
            //按时间排序
            var sortEl = $('#listScheduleCtn .itemSchedule').sort(function(item1, item2){
                return item1.dataset.id.split('_')[1] > item2.dataset.id.split('_')[1];
            });
            $('#listScheduleCtn').empty().html(sortEl);
            this.attachEventsItem();
        },
        attachEvents: function () {
            var $listSchedulePane = $('#listSchedulePane');
            var $editPane = $('#editPane');
            var $dateListPane = $('#dateListPane');
            var $ulOperateType = $('#ulOperateType');

            //添加日程
            $('#btnAdd', $listSchedulePane).hammer().off('tap').on('tap', function (e) {
                $listSchedulePane.hide();
                $editPane.show();
                //初始化
                router.controlles.showController({parent: $('#controlCtn')});
                $('#iptPickTime').val(new Date().format('HH:mm'));
                $('#ulOperateType li:eq(0)').addClass('selected');
                $('#tbController input:checkbox').prop('checked', false);

                e.stopPropagation();
                e.preventDefault();
            });
            $('#btnEdit', $listSchedulePane).hammer().off('tap').on('tap', function (e) {
                $('.itemSchedule').addClass('selected');
                $(this).hide().next('#btnFinish').show();
                e.stopPropagation();
                e.preventDefault();
            });
            //完成
            $('#btnFinish', $listSchedulePane).hammer().off('tap').on('tap', function (e) {
                $('.itemSchedule').removeClass('selected');
                $(this).hide().prev('#btnEdit').show();
                if(_this.isEdit){
                    _this.saveSchedule();
                }
                e.stopPropagation();
                e.preventDefault();
            });

            //取消保存日程btnCancel
            $('#btnCancel', $editPane).hammer().off('tap').on('tap', function (e) {
                $editPane.hide();
                router.controlles.close();
                $listSchedulePane.show();
                $('.itemSchedule', $listSchedulePane).removeClass('selected');
                $('#btnDelete', $editPane).hide();
                $('#btnFinish').hide();
                $('#btnEdit').show();

                e.stopPropagation();
                e.preventDefault();
            });
            $('#btnSave', $editPane).hammer().off('tap').on('tap', function (e) {
                var $tbController = $('#tbController');
                var time = $('#iptPickTime').val();
                var $inputs = $tbController.find('tbody tr input:checked');
                var $liSel = $('#ulOperateType li.selected');
                if(!time) return;//todo
                if($inputs.length < 1) return;//todo
                if($liSel.length == 0)return;

                if($('#btnDelete').is(':hidden')){//新建
                    var data = {
                        'moment': $('#iptPickTime').val(),
                        'userId': AppConfig.userId,
                        'lastTime': new Date().format('yyyy-MM-dd HH:mm:ss'),
                        'arrCommand': []
                    };
                    var type = $liSel.attr('data-value');
                    $inputs.each(function(){
                        var id = $(this).closest('tr')[0].dataset.id;
                        if(id){
                            data.arrCommand.push({controllerId:id, switch: type});
                        }
                    });
                    _this.store.option.push(data);
                }else{//编辑
                    _this.schedule.moment = $('#iptPickTime').val();
                    _this.schedule.userId = AppConfig.userId;
                    _this.schedule.lastTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    _this.schedule.arrCommand = [];

                    var type = $liSel.attr('data-value');
                    $tbController.find('tbody tr input:checked').each(function(){
                        var id = $(this).closest('tr')[0].dataset.id;
                        if(id){
                            _this.schedule.arrCommand.push({controllerId:id, switch: type});
                        }
                    });
                }

                $editPane.hide();
                $listSchedulePane.show();
                $('.item', $listSchedulePane).removeClass('selected');
                $('.item', $ulOperateType).removeClass('selected');
                $('#btnDelete', $editPane).hide();
                $('#btnFinish').hide();
                $('#btnEdit').show();

                _this.saveSchedule();
                e.stopPropagation();
                e.preventDefault();
            });
            $('#btnRepeat', $editPane).hammer().off('tap').on('tap', function (e) {
                $editPane.hide();
                $dateListPane.show();
                e.stopPropagation();
                e.preventDefault();
            });
            //显示控制器列表
            /*$('#btnShowControl', $editPane).hammer().off('tap').on('tap', function (e) {
                if($(this).hasClass('glyphicon-chevron-down')){
                    $(this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
                    router.controlles.close();
                }else{
                    $(this).removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
                    router.controlles.showController();
                }

                e.stopPropagation();
                e.preventDefault();
            });*/

            //选择重复的日期
            $('.itemRepeat', $dateListPane).hammer().off('tap').on('tap', function (e) {
                $(this).toggleClass('selected');
                e.stopPropagation();
                e.preventDefault();
            });
            //后退
            /*$('#btnBack').hammer().off('tap').on('tap', function (e) {
                router.back();
                e.stopPropagation();
                e.preventDefault();
            });*/
            //选择操作类型
            $('.item', $ulOperateType).hammer().off('tap').on('tap', function (e) {
                $(this).addClass('selected').siblings('.item').removeClass('selected');
                e.stopPropagation();
                e.preventDefault();
            });
        },
        attachEventsItem: function () {
            var $listSchedulePane = $('#listSchedulePane');
            var $editPane = $('#editPane');

            $('.btnRemove', $listSchedulePane).hammer().off('tap').on('tap', function (e) {
                var time = $(this).closest('.itemSchedule').attr('data-id').split('_')[1]
                $(this).closest('.itemSchedule').remove();
                _this.isEdit = true;
                //修改store
                for(var i = 0; i < _this.store.option.length; i++){
                    if(_this.store.option[i].moment == time){
                        _this.store.option.splice(i, 1);
                        break;
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            });
            $('.itemSchedule', $listSchedulePane).hammer().off('tap').on('tap', function (e) {

                var arrItem = this.dataset.id.split('_');

                if(!$(this).hasClass('selected')) return;
                //进入编辑页面
                $listSchedulePane.hide();
                $editPane.show();
                router.controlles.showController({parent:$('#controlCtn')});
                var $tbController = $('#tbController');
                if(_this.store.option){
                    for(var i = 0; i < _this.store.option.length; i++){
                        if(_this.store.option[i].moment == arrItem[1]){
                            $('#iptPickTime').val(_this.store.option[i].moment);
                            _this.schedule = _this.store.option[i];
                            if(_this.store.option[i].arrCommand && _this.store.option[i].arrCommand.length > 0){
                                _this.store.option[i].arrCommand.forEach(function(command, i){
                                    if(i == 0){
                                        $('#ulOperateType li[data-value="'+ command.switch +'"]').addClass('selected');
                                    }
                                    $tbController.find('tbody tr[data-id="'+ command.controllerId +'"] input').prop('checked', true);
                                });
                            }
                            break;
                        }
                    }
                }
                var selectedLen = $('input:checked:not(#checkAll)', $tbController).length;
                if(selectedLen == $('input:not(#checkAll)', $tbController).length){
                    $('#checkAll').prop('checked',true);
                }else{
                    $('#checkAll').prop('checked',false);
                }

                $('#btnDelete', $editPane).show().off('click').on('click', function(){
                    for(var i = 0; i < _this.store.option.length; i++){
                        if(_this.store.option[i].moment == _this.schedule.moment){
                            $('.itemSchedule[data-id="'+ _this.store._id + '_' + _this.schedule.moment + '"]').remove();
                            _this.store.option.splice(i, 1);
                            _this.saveSchedule();
                            $('#btnEdit').show();
                            $('#btnFinish').hide();
                            break;
                        }
                    }
                    $editPane.hide();
                    $listSchedulePane.show();
                    $('.itemSchedule', $listSchedulePane).removeClass('selected');
                });
                e.stopPropagation();
                e.preventDefault();
            });
        },
        close:function(){

        },
        saveSchedule: function(){
            WebAPI.post('/appTemperature/schedule/save', _this.store).done(function(result){
                router.controlles.close();
                _this.renderSchedule(_this.store);
            }).always(function(){

            });
        }
    };

    return Schedule;
})();

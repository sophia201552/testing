/**
 * Created by vicky on 2016/3/14.
 */
var Schedule = (function() {
    var _this;

    Schedule.navOptions = {
        top: '<span class="navTopItem title middle" i18n="admin.navTitle.SCHEDULE"></span>'
    };

    function Schedule(container) {
        _this = this;
        this.store = undefined;
        this.isEdit = false;
        this.schedule = undefined;
        this.scheduleIndex = undefined;
        this.addOrChange = undefined;
        this.container = container || document.getElementById('indexMain');
        this.ctrlSet = undefined;
    }

    Schedule.prototype = {
        show: function() {
            WebAPI.get('static/app/temperatureControl/views/config/schedule.html').done(function(resultHTML) {
                $(_this.container).html(resultHTML);
                //权限
                if (curRoom && curRoom.grade === 0) $('.btnCtn').hide();
                WebAPI.get('/appTemperature/schedule/get/' + AppConfig.roomId).done(function(result) { //<roomId>
                    if (!result || $.isEmptyObject(result)) {
                        _this.store = {
                            'roomId': AppConfig.roomId, //AppConfig.roomId,
                            'option': []
                        }
                    } else {
                        _this.store = result;
                        _this.renderSchedule(result);
                    }
                    if (curRoom && curRoom.grade !== 0) _this.attachEvents();

                    I18n.fillArea($(_this.container));
                    I18n.fillArea($('#navTop'));
                    _this.ctrlSet = new CtrlSet(_this);
                    //var slider = $(".rangeSlider").ionRangeSlider({
                    //    min: 15,
                    //    max: 30,
                    //    from: 11,
                    //    to: 30,
                    //    type: 'single',//设置类型
                    //    step: 0.1,
                    //    hasGrid: true
                    //}).data("ionRangeSlider");
                });
            });
        },
        init: function() {


        },
        renderSchedule: function(data) {
            var strHtml = '';
            var dictMode = {
                0: I18n.resource.admin.schedule.MS_FIRST,
                1: I18n.resource.admin.schedule.ENERGY_CONSERVE,
                2: I18n.resource.admin.schedule.COMFORTABLE,
                10: I18n.resource.admin.schedule.HANDLE
            };
            for (var j = 0, schedule; j < data.option.length; j++) {
                schedule = data.option[j];
                strHtml += ('<div class="itemSchedule listBorder" data-id="' + data._id + '_' + schedule.moment + '">\
                <div class="">\
                    <span class="glyphicon glyphicon-minus-sign btnRemove"></span>\
                    <span class="time">' + schedule.moment + '</span>\
                    <span class="mode">' + dictMode[schedule.mode] + '</span>\
                    <div class="opt-btn ' + (schedule.switch == 1 ? 'btn-switch-on' : 'btn-switch-off') + '" id="">\
                        <div class="btn-switch-slider"></div>\
                    </div>\
                </div>\
            </div>');
            }
            $('#listScheduleCtn').html(strHtml);
            //按时间排序
            var sortEl = $('#listScheduleCtn .itemSchedule').sort(function(item1, item2) {
                return item1.dataset.id.split('_')[1] > item2.dataset.id.split('_')[1];
            });
            $('#listScheduleCtn').empty().html(sortEl);
            this.attachEventsItem();
            //权限
            if (curRoom && curRoom.grade === 0) {
                $('.btnRemove').addClass('hidden');
                $('.itemSchedule .opt-btn').addClass('disabled');
            } else {
                $('.btnRemove').removeClass('hidden');
                $('.itemSchedule .opt-btn').removeClass('disabled');
            }
        },
        attachEvents: function() {
            var $listSchedulePane = $('#listSchedulePane');
            var $editPane = $('#editPane');
            var $ulMode = $('#ulMode');

            //添加日程
            $('#btnAdd', $listSchedulePane).hammer().off('tap').on('tap', function(e) {
                _this.addOrChange = 'add';
                $('#btnBack', $editPane).hide();
                $listSchedulePane.hide();
                $editPane.show();
                //重置editPane
                _this.resetEditPane();
                e.stopPropagation();
                e.preventDefault();
            });
            $('#btnEdit', $listSchedulePane).hammer().off('tap').on('tap', function(e) {
                $('.itemSchedule').addClass('selected');
                $(this).hide().next('#btnFinish').show();
                e.stopPropagation();
                e.preventDefault();
            });
            //完成
            $('#btnFinish', $listSchedulePane).hammer().off('tap').on('tap', function(e) {
                $('.itemSchedule').removeClass('selected');
                $(this).hide().prev('#btnEdit').show();
                if (_this.isEdit) {
                    _this.saveSchedule();
                }
                e.stopPropagation();
                e.preventDefault();
            });

            //取消保存日程btnCancel
            $('#btnCancel', $editPane).hammer().off('tap').on('tap', function(e) {
                //$editPane.hide();
                //router.controlles.close();
                //$listSchedulePane.show();
                //$('.itemSchedule', $listSchedulePane).removeClass('selected');
                //$('#btnDelete', $editPane).hide();
                //$('#btnFinish').hide();
                //$('#btnEdit').show();
                _this.show();
                e.stopPropagation();
                e.preventDefault();
            });
            $('#btnSave', $editPane).hammer().off('tap').on('tap', function(e) {
                var time = $('#iptPickTime').val();
                var mode = undefined,
                    arrRepeat = [],
                    temp = $('#spanTempVal').text();
                //时间
                if (!time) {
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.schedule.SELECT_TIME, 'short', 'center');
                    return false;
                }

                //模式
                mode = $('#ulMode .btn-switch-on').closest('.itemMode').attr('data-mode');
                //重复
                $('.divWeek .spanRptday').each(function() {
                    if ($(this).hasClass('selected')) {
                        arrRepeat.push(1)
                    } else {
                        arrRepeat.push(0);
                    }
                });
                if ($('#btnDelete').is(':hidden')) { //新建
                    var data = {
                        'moment': time,
                        'userId': AppConfig.userId,
                        'lastTime': new Date().format('yyyy-MM-dd HH:mm:ss'),
                        'arrCommand': [], //控制器Id, 在手动模式时,要选择控制器
                        'startTimeInterval': '2016-05-16', //开始执行重复周期的日期
                        'arrInterval': arrRepeat, //重复周期,如:[1,0,0,1,1,0,0]代表重复日期为周日,三,四,
                        'switch': 1, //新建时默认开
                        'tempSet': !!parseFloat(temp) ? parseFloat(temp) : 27
                    };
                    //模式
                    if (typeof mode != "undefined") {
                        data.mode = mode;
                        if (mode === '10') {
                            dealManual(data);
                        }
                    }

                    _this.store.option.push(data);

                } else { //编辑
                    //模式
                    if (typeof mode != "undefined") {
                        _this.schedule.mode = mode;
                        if (mode === '10') {
                            dealManual(_this.schedule);
                        }
                    }

                    _this.schedule.moment = time;
                    _this.schedule.userId = AppConfig.userId;
                    _this.schedule.lastTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                    _this.schedule.startTimeInterval = '2016-05-16';
                    _this.schedule.arrInterval = arrRepeat;
                    _this.schedule.tempSet = !!parseFloat(temp) ? parseFloat(temp) : 27;
                }

                $editPane.hide();
                $listSchedulePane.show();
                $('.item', $listSchedulePane).removeClass('selected');
                $('#btnDelete', $editPane).hide();
                $('#btnFinish').hide();
                $('#btnEdit').show();
                _this.saveSchedule();
                _this.ctrlSet.hide();
                e.stopPropagation();
                e.preventDefault();

                function dealManual(data) {
                    data.arrCommand = [];
                    $('#modeCtrlCtn .deviceScreen').each(function(i, item) {
                        data.arrCommand.push({ controllerId: this.id.split('_')[1], switch: $(item).find('.opt-btn').hasClass('btn-switch-on') ? 1 : 0 });
                    });
                }
            });

            //选择重复的日期
            $('.spanRptday', '.divWeek').off('touchend').on('touchend', function(e) {
                $(this).toggleClass('selected');
                e.stopPropagation();
                e.preventDefault();
            });
            //选择模式
            $('.itemMode', $ulMode).hammer().off('tap').on('tap', function(e) {
                if (curRoom && curRoom.grade === 0) return;
                var $optBtn = $(this).find('.opt-btn');
                if (this.dataset.mode === '10') {
                    _this.ctrlSet.show($('#modeCtrlCtn')[0], 'mode', null, true);
                    //if (_this.scheduleIndex) {
                    //    var arrCommand = _this.store.option[_this.scheduleIndex].arrCommand;
                    //    for (var k = 0, len = arrCommand.length; k < len; k++) {
                    //        if (arrCommand[k].switch === 1) {
                    //            $('#modeCtrlCtn #' + arrCommand[k].controllerId).find('.opt-btn').removeClass('btn-switch-off').addClass('btn-switch-on');
                    //        } else {
                    //            isCheckAll = false
                    //        }
                    //    }
                    //    if (isCheckAll) {
                    //        $('#modeCtrlCtn .divCheckAll').addClass('check');
                    //    }
                    //}
                    //if ($('#btnDelete').is(':hidden')) {//新建
                    //router.ctrlSet.show($('#modeCtrlCtn')[0], 'mode',null,true);
                    //} 
                    //else {
                    //var arrCommand = _this.store.option[_this.scheduleIndex].arrCommand;
                    //for (var k = 0, len = arrCommand.length; k < len; k++) {
                    //    if (arrCommand[k].switch === 1) {
                    //        $('#modeCtrlCtn #' + arrCommand[k].controllerId).find('.opt-btn').removeClass('btn-switch-off').addClass('btn-switch-on');
                    //    } else {
                    //        isCheckAll = false
                    //    }
                    //}
                    //if (isCheckAll) {
                    //    $('#modeCtrlCtn .divCheckAll').addClass('check');
                    //}
                    //}
                    //router.ctrlSet.show($('#modeCtrlCtn')[0], 'mode', null, true);
                } else {
                    _this.ctrlSet.hide();
                }
                $('.opt-btn', $ulMode).not($optBtn).removeClass('btn-switch-on').addClass('btn-switch-off');
                $optBtn.removeClass('btn-switch-off').addClass('btn-switch-on');
                e.stopPropagation();
                e.preventDefault();
            });

            $('#iptPickTime', $editPane).off('change').on('change', function() {
                var time = $(this).val();
                if (_this.checkScheduleIsExist(time)) {
                    $(this).val('');
                }
            });

            var $rangeSlider = $('.rangeSlider');
            var $rangeFill = $('.rangeFill');
            var $rangeCursor = $('.rangeCursor');
            var startX;
            $rangeSlider.off('touchstart').on('touchstart', function(e) {
                startX = e.originalEvent.targetTouches[0].pageX;
            });
            $rangeSlider.off('touchmove').on('touchmove', function(e) {
                var nowSpeed = Number($('#spanTempVal').text());
                var newX = e.originalEvent.targetTouches[0].pageX;
                var offsetLeft = newX - $rangeSlider[0].offsetLeft;
                var left = offsetLeft;
                var width = $rangeSlider.width();
                if (newX > startX) {
                    left = Math.max(left, 0);
                    left = Math.min(left, width);
                    $rangeCursor.css({ left: left - 10 });
                    $rangeFill.width(left);
                    nowSpeed = left / width * 15 + 15;
                    nowSpeed = Math.min(nowSpeed, 30);
                } else if (newX < startX) {
                    left = Math.min(left, width);
                    left = Math.max(left, 0);
                    $rangeCursor.css({ left: left - 10 });
                    $rangeFill.width(left);
                    nowSpeed = left / width * 15 + 15;
                    nowSpeed = Math.max(nowSpeed, 15);
                }
                $('#spanTempVal').text(nowSpeed.toFixed(1));
                startX = newX;
            });
        },
        attachEventsItem: function() {
            var $listSchedulePane = $('#listSchedulePane');
            var $editPane = $('#editPane');
            //开关
            $('.opt-btn', $listSchedulePane).off('touchend').on('touchend', function(e) {

                var arrItem = $(this).closest('.itemSchedule')[0].dataset.id.split('_');
                if (_this.store.option) {
                    for (var i = 0; i < _this.store.option.length; i++) {
                        if (_this.store.option[i].moment == arrItem[1]) {
                            _this.schedule = _this.store.option[i];
                            break;
                        }
                    }
                }
                if (!_this.schedule) return;
                _this.isEdit = true;
                if ($(this).hasClass('btn-switch-on')) {
                    $(this).removeClass('btn-switch-on').addClass('btn-switch-off');
                    _this.schedule.switch = 0;
                } else {
                    $(this).removeClass('btn-switch-off').addClass('btn-switch-on');
                    _this.schedule.switch = 1;
                }
                $('.itemSchedule .btnRemove', $listSchedulePane).animate({ right: '-3rem' }, 400);
                $(this).animate({ right: '2rem' }, 400, function() {
                    _this.saveSchedule();
                });
                e.stopPropagation();
                e.preventDefault();
            });

            var startInfo = {
                    x: 0,
                    y: 0
                },
                endInfo = {
                    x: 0,
                    y: 0
                };

            $('.itemSchedule', $listSchedulePane).off('touchstart').on('touchstart', function(e) {
                e.preventDefault();
                if (e.originalEvent.targetTouches.length > 1) return;
                var targetTouch = e.originalEvent.targetTouches[0];
                startInfo.x = targetTouch.pageX;
                startInfo.y = targetTouch.pageY;
            });

            $('.itemSchedule', $listSchedulePane).off('touchmove').on('touchmove', function(e) {
                e.preventDefault();
                if ($(e.target).hasClass('opt-btn') || $(e.target).hasClass('btn-switch-slider')) {
                    return;
                }
                var targetTouch = e.originalEvent.targetTouches[0],
                    left = targetTouch.pageX - startInfo.x;
                $(this).css('left', left / 80 + 'rem');
            })

            $('.itemSchedule', $listSchedulePane).off('touchend').on('touchend', function(e) {
                e.preventDefault();
                $(this).animate({ left: '0' }, 400);
                var $iptPickTime = $('#iptPickTime'),
                    arrItem = this.dataset.id.split('_'),
                    $btnDelete = $('#btnDelete', $editPane),
                    $btnBack = $('#btnBack', $editPane),
                    targetTouch = e.originalEvent.changedTouches[0],
                    $btnRemove = $(this).find('.btnRemove'),
                    $btnOpt = $(this).find('.opt-btn');
                endInfo.x = targetTouch.pageX - startInfo.x;
                endInfo.y = targetTouch.pageY - startInfo.y;
                if ((Math.abs(endInfo.x) > 30) && (Math.abs(endInfo.x) < Math.abs(endInfo.y))) return; //如果大部分是朝上
                //滑动呼出删除按钮
                if (endInfo.x < -30) {
                    $btnRemove.animate({ right: '2rem' }, 400);
                    $btnOpt.animate({ right: '6rem' }, 400);
                } else if (endInfo.x > 30) {
                    $btnRemove.animate({ right: '-3rem' }, 400);
                    $btnOpt.animate({ right: '2rem' }, 400);
                } else if ($(e.target).hasClass('btnRemove')) {
                    //删除一个日程
                    _this.addOrChange = 'delete';
                    var arrItem = this.dataset.id.split('_');
                    if (_this.store.option) {
                        for (var i = 0; i < _this.store.option.length; i++) {
                            if (_this.store.option[i].moment == arrItem[1]) {
                                _this.schedule = _this.store.option[i];
                                break;
                            }
                        }
                    }
                    for (var i = 0; i < _this.store.option.length; i++) {
                        if (_this.store.option[i].moment == _this.schedule.moment) {
                            $('.itemSchedule[data-id="' + _this.store._id + '_' + _this.schedule.moment + '"]').remove();
                            _this.store.option.splice(i, 1);
                            _this.saveSchedule();
                            $('#btnEdit').show();
                            $('#btnFinish').hide();
                            break;
                        }
                    }
                    $('.itemSchedule', $listSchedulePane).removeClass('selected');
                } else {
                    $btnRemove.animate({ right: '-3rem' }, 400);
                    $btnOpt.animate({ right: '2rem' }, 400);
                    //进入编辑页面
                    _this.addOrChange = 'change';
                    $listSchedulePane.hide();
                    $editPane.show();
                    _this.resetEditPane(arrItem[1]);
                    //编辑模式
                    if (curRoom.grade > 0) {
                        $btnBack.hide();
                        $btnDelete.show().off('touchstart').on('touchstart', function() {
                            //删除一个日程
                            _this.addOrChange = 'delete';
                            for (var i = 0; i < _this.store.option.length; i++) {
                                if (_this.store.option[i].moment == _this.schedule.moment) {
                                    $('.itemSchedule[data-id="' + _this.store._id + '_' + _this.schedule.moment + '"]').remove();
                                    _this.store.option.splice(i, 1);
                                    _this.saveSchedule();
                                    $('#btnEdit').show();
                                    $('#btnFinish').hide();
                                    break;
                                }
                            }
                            $btnDelete.hide();
                            $editPane.hide();
                            $listSchedulePane.show();
                            $('.itemSchedule', $listSchedulePane).removeClass('selected');
                        });
                    } else {
                        //查看模式
                        $iptPickTime.prop('disabled', 'disabled');
                        $btnDelete.hide();

                        $btnBack.siblings('.btn').hide()
                        $btnBack.parent('.btnCtn').show();
                        $btnBack.off('touchstart').on('touchstart', function() {
                            $editPane.hide();
                            $listSchedulePane.show();
                            $iptPickTime.prop('disabled', false);
                            $btnBack.siblings('.btn').show()
                            $btnBack.parent('.btnCtn').hide();
                            $('.itemSchedule', $listSchedulePane).removeClass('selected');
                        });
                    }

                    e.stopPropagation();
                    e.preventDefault();
                }

            });
        },
        close: function() {

        },
        saveSchedule: function() {
            WebAPI.post('/appTemperature/schedule/save', _this.store).done(function(result) {
                //保存历史
                var objTemp = {};
                if (_this.addOrChange === 'add') {
                    abjTemp = _this.store.option[_this.store.option.length - 1];
                } else {
                    abjTemp = _this.schedule;
                }
                var hisData = {
                    gps: [],
                    time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                    userId: AppConfig.userId,
                    roomId: curRoom._id,
                    spaceId: '',
                    source: 2,
                    option: {
                        type: _this.addOrChange,
                        _id: _this.store._id,
                        arrCommand: abjTemp.arrCommand,
                        arrInterval: abjTemp.arrInterval,
                        mode: abjTemp.mode,
                        moment: abjTemp.moment,
                        startTimeInterval: abjTemp.startTimeInterval,
                        switch: abjTemp.switch
                    },
                    controllerParams: []
                }
                WebAPI.post('/appTemperature/insertHistoryOperation', hisData);
                _this.renderSchedule(_this.store);
                if (result) { //日程数据更新后,更新房间
                    WebAPI.get('/appTemperature/room/update/' + curRoom._id).done(function(result) {
                        console.log('update room');
                    });
                }
            }).always(function() {

            });
        },
        resetEditPane: function(id) {
            var $iptPickTime = $('#iptPickTime');
            var now = new Date().format('HH:mm');
            var left, $rangeCursor, $rangeSlider, $rangeFill, tempSet, $spanTempVal;

            $rangeCursor = $('.rangeCursor');
            $rangeSlider = $('.rangeSlider');
            $rangeFill = $('.rangeFill');
            $spanTempVal = $('#spanTempVal');

            if (!id) {
                //判断该时间点的Schedule是否已存在
                if (this.checkScheduleIsExist(now)) {
                    $iptPickTime.val('');
                } else {
                    $iptPickTime.val(now);
                }

                $('.spanRptday.selected').removeClass('selected');
                $('.spanRptday.default').addClass('selected'); //默认周一至周五
                $('#ulMode .btn-switch-on').removeClass('btn-switch-on').addClass('btn-switch-off');
                $('#ulMode .opt-btn:eq(0)').removeClass('btn-switch-off').addClass('btn-switch-on');
                $('#modeCtrlCtn .ulCtrl .btn-switch-on').removeClass('btn-switch-on').addClass('btn-switch-off');

                //设置温度,默认27℃
                tempSet = 27;
                left = (tempSet - 15) * ($rangeSlider.width() - 10) / 15; // temp = fillWidth/rangeWidth* 15 + 15, rangeWidth = $rangeSlider.width() - 10;
                $rangeFill.width(left);
                $rangeCursor.css({ left: left - 5 });
                $spanTempVal.text(tempSet);
            } else {
                if (_this.store.option) {
                    for (var i = 0; i < _this.store.option.length; i++) {
                        if (_this.store.option[i].moment == id) {
                            _this.scheduleIndex = i;
                            //时间
                            $iptPickTime.val(_this.store.option[i].moment);
                            $iptPickTime.attr('data-time', _this.store.option[i].moment); //如果$iptPickTime发生了change,data-time可以保存原来的时间
                            //模式
                            $('.btn-switch-on').removeClass('btn-switch-on').addClass('btn-switch-off');
                            $('#ulMode [data-mode="' + _this.store.option[i].mode + '"] .opt-btn').removeClass('btn-switch-off').addClass('btn-switch-on');
                            //重复
                            var arrInterval = _this.store.option[i].arrInterval;
                            var $divWeek = $('.divWeek');
                            if (arrInterval && arrInterval.length > 0) {
                                for (var j = 0, $day; j < arrInterval.length; j++) {
                                    $day = $divWeek.children('.spanRptday:eq(' + j + ')');
                                    if (arrInterval[j] == 1) {
                                        $day.addClass('selected');
                                    } else {
                                        $day.removeClass('selected');
                                    }
                                }
                            }
                            _this.schedule = _this.store.option[i];

                            //设置温度
                            tempSet = parseFloat(_this.store.option[i].tempSet ? _this.store.option[i].tempSet : 27);
                            left = (tempSet - 15) * ($rangeSlider.width() - 10) / 15; // temp = fillWidth/rangeWidth* 15 + 15, rangeWidth = $rangeSlider.width() - 10;
                            $rangeFill.width(left);
                            $rangeCursor.css({ left: left - 5 });
                            $spanTempVal.text(tempSet);

                            //如果是手动模式
                            if (_this.schedule && _this.schedule.mode === '10') {
                                _this.ctrlSet.show($('#modeCtrlCtn')[0], 'mode', null, true);
                                var arrCommand, isCheckAll = true;
                                arrCommand = _this.store.option[i].arrCommand;
                                for (var k = 0, len = arrCommand.length; k < len; k++) {
                                    if (arrCommand[k].switch === 1) {
                                        $('#modeCtrlCtn #ds_' + arrCommand[k].controllerId).find('.opt-btn').removeClass('btn-switch-off').addClass('btn-switch-on');
                                    } else {
                                        isCheckAll = false
                                    }
                                }
                                if (isCheckAll) {
                                    $('#modeCtrlCtn .divCheckAll').addClass('check');
                                }
                            } else {
                                _this.ctrlSet.hide();
                            }
                            if (curRoom.grade == 0) {
                                $('#ulMode input').prop('disabled', true);
                                $('#ulOperateType input').prop('disabled', true);
                            }
                            break;
                        }
                    }
                }
            }
        },
        /**
         *判断该时间点的Schedule是否已存在*/
        checkScheduleIsExist: function(time) {
            if (!this.store || !this.store.option || this.store.option.length == 0) return false;
            for (var i = 0, len = this.store.option.length; i < len; i++) {
                if (this.store.option[i].moment == time && $('#iptPickTime')[0].dataset.time && $('#iptPickTime')[0].dataset.time != time) {
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.schedule.EXIST_SCHEDULE, 'short', 'center');
                    //alert(I18n.resource.admin.schedule.EXIST_SCHEDULE);
                    return true;
                }
            }
            return false;

        }
    };

    return Schedule;
})();
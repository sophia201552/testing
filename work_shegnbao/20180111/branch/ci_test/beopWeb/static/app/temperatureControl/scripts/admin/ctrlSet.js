/**
 * Created by vicky on 2016/6/2.
 */
var CtrlSet = (function() {
    var _this;

    function CtrlSet(screen, option) {
        this.screen = screen;
        this.container = undefined;
        this.page = undefined;
        this.type = undefined;
        this.oldLeft = 0;
        this.index = undefined;
        this.isLocal = (option && option.isLocal);
        _this = this;
    }

    CtrlSet.prototype = {
        show: function(parent, type, device, isNotRequestData) {
            $(parent).empty();
            this.type = type;
            this.parent = parent;
            if (isNotRequestData) {
                this.init(isNotRequestData);
            } else {
                this.init();
            }
            if (device) {
                var $ul = $('.ulCtrl');
                var $deviceScreen = $('#ds_' + device._id);
                this.index = $deviceScreen.parent().index();
                var liWidth = $ul.find('li').width();
                var maxLeft = Math.max(0, ($ul.width() - $('#divObserverMap').width()));
                var left = Math.min(Math.max((this.index - 1), 0) * liWidth, maxLeft);
                $deviceScreen.addClass('active');
                $ul.css({ left: _this.oldLeft }).animate({ left: -left }, function() {
                    _this.oldLeft = parseInt($ul.css('left'));
                });
                $('#divTemperature .ulPage li').eq(this.index).addClass('active');

            }
            I18n.fillArea($(parent));
        },
        init: function(isNotRequestData) {
            var arr = []
            this.container = $('<ul class="ulCtrl list-unstyled">')[0];
            this.page = $('<ul class="ulPage" style="display:none;">')[0];
            this.divCheckAll = $('<div class="divCheckAll"><div class="on">on</div><div class="off">off</div><span class="cl"></span><span class="txt" i18n="admin.controllers.SELECTED_ALL"></span></div>')[0];

            if (this.type != 'sensor' && (ctrAll || ctrAll.length > 0)) {
                this.container.style.width = 145 * ctrAll.length + 'px';
                this.page.style.marginLeft = -25 * ctrAll.length / 2 + 'px';
                ctrAll.forEach(function(ctr) {
                    new CtrlItem(ctr, _this.container, _this.type);
                    for (var i in ctr.arrP) {
                        arr.push(ctr.arrP[i]);
                    }
                    $(_this.page).append('<li></li>');
                });
            } else if (this.type == 'sensor' && (sensorAll || sensorAll.length > 0)) {
                this.container.style.width = 145 * sensorAll.length + 'px';
                this.page.style.marginLeft = -25 * sensorAll.length / 2 + 'px';
                this.divCheckAll.style.display = 'none';
                sensorAll.forEach(function(sensor) {
                    new CtrlItem(sensor, _this.container, _this.type);
                    for (var i in sensor.arrP) {
                        arr.push(sensor.arrP[i]);
                    }
                    $(_this.page).append('<li></li>');
                });
            }
            if (this.type == 'sensor' || this.type == 'device') {
                var divChartWrap = document.createElement('div');
                divChartWrap.id = 'divChartWrap';
                var divChart = document.createElement('div');
                divChart.id = 'divChart';
                var btnClose = document.createElement('span');
                btnClose.innerHTML = '&times;';
                btnClose.className = 'btnClose';
                btnClose.onclick = function() {
                    //sensor和device的区别处理
                    var displayStr = _this.type === 'sensor' ? 'none' : 'block';
                    divChartWrap.style.display = 'none';
                    _this.container.style.display = 'block';
                    //_this.page.style.display = 'block';//暂时不要页码标记

                    _this.divCheckAll.style.display = displayStr;
                };
                divChartWrap.appendChild(divChart);
                divChartWrap.appendChild(btnClose);
                this.parent.appendChild(divChartWrap);
            }
            this.parent.appendChild(this.container);
            this.parent.appendChild(this.page);
            this.parent.appendChild(this.divCheckAll);
            if (isNotRequestData) {
                this.attachEvents();
            } else {
                this.attachEvents(arr, this.type);
            }
        },
        hide: function() {
            $(this.container).hide();
            $(this.page).hide();
            $(this.divCheckAll).hide()
        },
        noHide: function() {
            $(this.container).show();
            //$(this.page).show();
            $(this.divCheckAll).show()
        },
        close: function() {
            $('#divTemperature').hide();
        },
        attachEvents: function(requestParams, type) {
            $('.divCheckAll').hammer().off('tap').on('tap', function() {
                var $this = $(this);
                if ($this.hasClass('disabled')) return;
                if ($this.hasClass('check')) {
                    $this.removeClass('check')
                        .siblings('.ulCtrl')
                        .find('.opt-btn')
                        .removeClass('btn-switch-on')
                        .addClass('btn-switch-off');
                } else {
                    $this.addClass('check')
                        .siblings('.ulCtrl')
                        .find('.opt-btn')
                        .removeClass('btn-switch-off')
                        .addClass('btn-switch-on');
                }

            });
            //左右滑动
            var $target = $(this.container),
                start = {
                    x: 0,
                    y: 0,
                    left: 0,
                    target: '',
                    time: 0
                },
                end = {
                    x: 0,
                    y: 0,
                    time: 0
                };
            if (!_this.index) _this.index = 0;
            $target.off('touchstart').on('touchstart', function(e) {
                e.preventDefault();
                $target.stop();
                if (e.originalEvent.targetTouches.length > 1) return;
                var targetTouch = e.originalEvent.targetTouches[0];
                start.x = targetTouch.pageX;
                start.y = targetTouch.pageY;
                start.left = parseInt($target.css('left'));
                start.target = e.target;
                start.time = +new Date();
            });

            $target.off('touchmove').on('touchmove', function(e) {
                e.preventDefault();
                if ($(e.target).closest('.opt-btn').closest('.deviceScreen').hasClass('active')) return; //防止滑动开关时滚动
                var targetTouch = e.originalEvent.targetTouches[0];
                var left = targetTouch.pageX - start.x;
                $target.css('left', left / 10 + start.left + 'px');
            });

            $target.off('touchend').on('touchend', function(e) {
                e.preventDefault();
                var targetTouch = e.originalEvent.changedTouches[0],
                    liWidth = $(this).find('li').width(),
                    maxLeft = Math.max($(this).width() - $('#divObserverMap').width(), 0),
                    left;
                end.x = targetTouch.pageX - start.x;
                end.y = targetTouch.pageY - start.y;
                end.time = +new Date() - start.time;
                var speed = Math.abs(end.x / end.time);
                var num = 0;

                if ((Math.abs(end.x) < Math.abs(end.y)) && (Math.abs(end.y) > 30)) {
                    $target.animate({ left: start.left }, 400);
                    return;
                }

                if (Math.abs(end.x) > 30) { //滑动状态
                    num = Math.max(1, Math.ceil(speed * 2));
                    console.log(num);
                    end.x > 0 ? (_this.index -= num) : (_this.index += num);
                    if (_this.index > 0) {
                        left = Math.min(_this.index * liWidth, maxLeft);
                        (left === maxLeft) && (_this.index--);
                    } else {
                        left = 0;
                        _this.index = 0;
                    }
                    $target.animate({ left: -left }, 400, function() {
                        _this.oldLeft = -left;
                    });
                } else { //点击状态
                    $target.animate({ left: start.left }, 400);
                    var $tar = $(e.target);
                    var $opt = $tar.closest('.opt-btn');
                    var $deviceScreen = $tar.closest('.deviceScreen');
                    if ($opt.hasClass('opt-btn')) {
                        //非手动模式不能改变
                        //if(_this.isLocal){
                        //    var cNum=$opt.parent().parent().find('.listNum').html();
                        //    var arrController=_this.screen.dictionary.controller;
                        //    for(var i=0;i<arrController.length;i++){
                        //        if(cNum == arrController[i].num){
                        //            arrController[i].status=$opt.hasClass('.on')?1:0;
                        //            delete arrController[i].num;
                        //            //var postData='/control/'+cNum+' '+JSON.stringify(arrController[i]);
                        //            var topicUrl='/control/'+cNum;
                        //            arrController[i].fan = 1;
                        //
                        //            var message=JSON.stringify(arrController[i]);
                        //        }
                        //    }
                        //    console.log(topicUrl+' '+message);
                        //    _this.screen.mqttClient.mqttClient.publish(topicUrl,message);
                        //
                        //}else {
                        if (!$opt.hasClass('disabled') || _this.isLocal) {
                            if ($opt.hasClass('btn-switch-off')) {
                                $opt.removeClass('btn-switch-off').addClass('btn-switch-on');
                            } else {
                                $opt.removeClass('btn-switch-on').addClass('btn-switch-off');
                            }
                        }
                        //}
                        //是否全选状态
                        var isCheckAll = true;
                        $('.opt-btn', $target).each(function(i, item) {
                            if ($(item).hasClass('btn-switch-off')) {
                                isCheckAll = false;
                            }
                        });
                        if (isCheckAll) {
                            $target.siblings('.divCheckAll').removeClass('check').addClass('check');
                        } else {
                            $target.siblings('.divCheckAll').removeClass('check');
                        }
                    }
                    if (e.target.nodeName === 'DIV') {
                        var $li = $tar.closest('li');
                        $('.deviceScreen', $target).removeClass('active');
                        $deviceScreen.addClass('active');
                        $('#containerMap #' + $deviceScreen.attr('id').split('_')[1]).addClass('selected').siblings('.selected').removeClass('selected');
                        var index = $target.find('li').index($li);
                        $('li', $target.siblings('.ulPage')).removeClass('active').eq(index).addClass('active');
                    }
                }

            });
            if (type && !AppConfig.isLocalMode) {
                this.requestData(requestParams).done(function(result) {
                    if (type == 'mode') {
                        if (!result.dsItemList || result.dsItemList.length == 0) return;
                        for (var i = 0, item; i < result.dsItemList.length; i++) {
                            item = result.dsItemList[i];
                            $('[id="' + item.dsItemId + '"]').each(function() {
                                if ($(this).hasClass('tempVal') || $(this).hasClass('windSpeedVal')) {
                                    $(this).text(item.data ? item.data : '--');
                                } else if ($(this).hasClass('switch')) {
                                    if (item.data == 1) {
                                        $(this).removeClass('btn-switch-off').addClass('btn-switch-on');
                                    } else {
                                        $(this).removeClass('btn-switch-on').addClass('btn-switch-off');
                                    }
                                }
                            });
                        }
                        //_this.attachEventsMode();
                    } else if (type == 'device') {
                        if (!result.dsItemList || result.dsItemList.length == 0) return;
                        for (var i = 0, item; i < result.dsItemList.length; i++) {
                            item = result.dsItemList[i];
                            $('[id="' + item.dsItemId + '"]').each(function() {
                                if ($(this).hasClass('signal')) {
                                    this.className = 'iconfont icon-medium signal ' + _this.getXinhaoLevel(item.data);
                                } else if ($(this).hasClass('electricity')) {
                                    this.className = 'iconfont icon-medium electricity ' + _this.getDianliangLevel(item.data);
                                } else if ($(this).hasClass('speedVal')) {
                                    //$(this).text(item.data ? item.data : '--');
                                }
                            });
                        }
                        //_this.attachEventsDevice()
                    } else if (type == 'sensor') {
                        if (!result.dsItemList || result.dsItemList.length == 0) return;
                        for (var i = 0, item; i < result.dsItemList.length; i++) {
                            item = result.dsItemList[i];
                            $('[id="' + item.dsItemId + '"]').each(function() {
                                if ($(this).hasClass('signal')) {
                                    this.className = 'iconfont icon-medium signal ' + _this.getXinhaoLevel(item.data);
                                } else if ($(this).hasClass('electricity')) {
                                    this.className = 'iconfont icon-medium electricity ' + _this.getDianliangLevel(item.data);
                                } else if ($(this).hasClass('tempVal')) {
                                    $(this).text(item.data ? parseFloat(item.data).toFixed(1) : '--');
                                }
                            });
                        }
                        //_this.attachEventsSensor()
                    }
                });
            }

        },
        requestData: function(requestParams) {
            return WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: requestParams })
        },
        getDianliangLevel: function(battery) {
            var className = 'dianliangtiao3';
            if (battery > 90) {
                className = 'dianliangtiao3';
            } else if (battery > 50) {
                className = 'dianliangtiao2';
            } else if (battery > 25) {
                className = 'dianliangtiao1';
            } else {
                className = 'dianliangtiao0';
            }
            return className;
        },
        getXinhaoLevel: function(signal) {
            var className = 'xinhao3';
            if (signal > 90) {
                className = 'xinhao3';
            } else if (signal > 50) {
                className = 'xinhao2';
            } else if (signal > 25) {
                className = 'xinhao1';
            } else if (signal > 10) {
                className = 'xinhao0';
            }
            return className;
        }
    }

    return CtrlSet;
}());


var CtrlItem = (function() {
    var _this;

    function CtrlItem(ctrl, parent, type) {
        _this = this;
        this.parent = parent;
        this.type = type;
        this.device = ctrl;
        this.init(ctrl);
    }

    CtrlItem.prototype = {
        tplDevice: '<li>\
            <div class="deviceScreen zepto-ev" id="ds_{id}">\
                <div class="head">\
                    <span class="iconfont icon-medium icon-xinhao3 signal" id="{signalId}"></span>\
                    <span class="iconfont icon-medium icon-dianliangtiao3 electricity" id="{electricityId}"></span>\
                </div>\
                <div class="checkBox">\
                    <div class="opt-btn btn-switch-on"><div class="btn-switch-slider"></div></div>\
                </div>\
                <div class="headMsg" style="height:2rem">\
                    <div style="line-height: 2rem;">{name}</div>\
                </div>\
                <div class="speed">\
                    <i class="iconfont icon-fengsushezhi"></i><span id="{windSpeedId}" class="speedVal">{windSpeed}</span>\
                </div>\
                <div class="btn-group">\
                    <button class="btn btnMatch"><span class="glyphicon glyphicon-link"></span></button>\
                    <button class="btn btnHist"><span class="glyphicon glyphicon-time"></span></button>\
                </div>\
            </div>\
        </li>',
        tplMode: '<li>\
            <div class="deviceScreen zepto-ev" id="ds_{FCUId}">\
                <div class="FCUIcon">\
                    <span><i class="iconfont">&#xe660;</i>:<i id="{tempId}" class="tempVal">{temp}</i></span>\
                    <span><i class="iconfont">&#xe64a;</i>:<i id="{windSpeedId}" class="windSpeedVal">{windSpeed}</i></span>\
                </div>\
                <div class="FCUSwitch">\
                    <div class="opt-btn btn-switch-{switch} switch" id="{switchId}"><div class="btn-switch-slider"></div></div>\
                </div>\
                <div class="FCUName">{name}</div>\
            </div>\
        </li>',
        tplSensor: '<li>\
            <div class="deviceScreen zepto-ev" id="ds_{id}">\
                <div class="head">\
                    <span class="iconfont icon-medium icon-xinhao3 signal" id="{SensorSignalStrengthId}"></span>\
                    <span class="iconfont icon-medium icon-dianliangtiao3 electricity" id="{SensorBatteryId}"></span>\
                </div>\
                <div class="headMsg">\
                    <div>{name}</div>\
                </div>\
                <div class="checkBox" style="text-align: inherit;margin: 0 0.5rem;">\
                    <i class="iconfont" style="margin-right:5px;">&#xe660;</i><span id="{SensorTId}" class="tempVal" style="font-size: 1.8rem;line-height: 2.8rem;display: inline-block;height: 2.4rem;">{SensorT}</span>\
                </div>\
                <div class="btn-group">\
                    <button class="btn btnMatch"><span class="glyphicon glyphicon-link"></span></button>\
                    <button class="btn btnHist"><span class="glyphicon glyphicon-time"></span></button>\
                </div>\
            </div>\
        </li>',
        //<button class="btnMatch"><span class="glyphicon glyphicon-link"></span><span i18n="admin.indexMap.PAIR">配对</span></button>\
        //        <button class="btnHist"><span class="glyphicon glyphicon-time"></span><span i18n="admin.indexMap.HISTORY">历史</span></button>\
        show: function() {

        },
        init: function(device) {
            if (this.type == 'device') {
                $(this.parent).append(this.tplDevice.formatEL({
                    name: device.name.split('_').join(' '),
                    signalId: device.arrP.FCUSignalStrength,
                    electricityId: device.arrP.FCUBattery,
                    id: device._id,
                    windSpeed: '--',
                    windSpeedId: device.arrP.FCUSpeedD
                }));
                this.attachEventsDevice($(this.parent).find('#ds_' + device._id));
            } else if (this.type == 'mode') {
                $(this.parent).append(this.tplMode.formatEL({
                    FCUId: device._id,
                    name: device.name.split('_').join(' '),
                    temp: '--',
                    tempId: device.arrP.FCUTSet,
                    windSpeed: '--',
                    windSpeedId: device.arrP.FCUSpeedD,
                    switch: 'off',
                    switchId: device.arrP.FCUOnOffSet
                }));
                this.attachEventsMode($(this.parent).find('#ds_' + device._id));
            } else if (this.type == 'sensor') {
                $(this.parent).append(this.tplSensor.formatEL({
                    SensorBatteryId: device.arrP.SensorBattery,
                    SensorHId: device.arrP.SensorH,
                    SensorSignalStrengthId: device.arrP.SensorSignalStrength,
                    SensorTId: device.arrP.SensorT,
                    SensorT: '--',
                    name: device.name.split('_').join(' '),
                    id: device._id
                }));
                this.attachEventsSensor($(this.parent).find('#ds_' + device._id));
            }
            I18n.fillArea($(this.parent));
        },
        close: function() {

        },
        verifyPwd: function(fn) {
            var verifyPwdTpl = '\
            <div id="verifyPwdBox"><div>\
                <div class="form-group">\
                    <label>{roompwd}:</label>\
                    <input type="password" class="form-control userSelect" id="managePassword">\
                </div>\
                <button id = "surePwd" class="btn btn-default" i18n="admin.roomPage.SURE">确定</button>\
                <button id = "cancelPwd" class="btn btn-default" i18n="admin.roomPage.CANCEL">取消</button>\
            </div></div>';

            if (curRoom.params.password && curRoom.grade == '0' && !window.customVariable.isPasswordPass) {
                $('body').append(verifyPwdTpl.formatEL({
                    roompwd: i18n_resource.admin.setUp.ROOM_PASSWORD
                }));
                I18n.fillArea($('#verifyPwdBox'));
                var $verifyPwdBox = $('#verifyPwdBox'),
                    $managePassword = $('#managePassword');
                var managePassword;

                $('#surePwd').off('touchstart').on('touchstart', function() {
                    managePassword = $managePassword.val();
                    if (managePassword == curRoom.params.password) {
                        $verifyPwdBox.remove();
                        window.customVariable.isPasswordPass = true;
                        fn();
                    } else {
                        $verifyPwdBox.remove();
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.index.ROOM_PASSWORD_INFO, 'short', 'center');
                        console.log(I18n.resource.admin.index.ROOM_PASSWORD_INFO);
                    }
                });
                $('#cancelPwd').off('touchstart').on('touchstart', function() {
                    $verifyPwdBox.remove();
                });
            } else {
                fn();
            }
        },
        attachEventsDevice: function($deviceScreen) {
            //$deviceScreen.find('.opt-btn').off('touchend').on('touchend', function (e) {
            //    if (!$(this).closest('.deviceScreen').hasClass('active')) return;
            //    e.preventDefault();
            //    e.stopPropagation();
            //    if($(this).hasClass('btn-switch-off')){
            //        $(this).removeClass('btn-switch-off').addClass('btn-switch-on');
            //    }else{
            //        $(this).removeClass('btn-switch-on').addClass('btn-switch-off');
            //    }
            //});
            //配对
            var _this = this;
            $deviceScreen.find('.btnMatch').off('touchend').on('touchend', function(e) {
                if (!$(this).closest('.deviceScreen').hasClass('active')) return;
                e.preventDefault();
                e.stopPropagation();
                if (typeof cordova != 'undefined') {
                    cordova.plugins.barcodeScanner.scan(
                        function(result) {
                            var mac;
                            try {
                                mac = result.split('||');
                                if (mac[0] == 'beopsmartdevice') {
                                    mac = mac[1]
                                } else {
                                    mac = null;
                                }
                            } catch (e) {
                                mac = null;
                            }
                            if (!mac) {
                                window.plugins.toast.show('配对失败，二维码不符合标准', 'short', 'center');
                                return;
                            }
                            _this.device.params.mac = mac;
                            _this.device.baseType = 'things';
                            WebAPI.post('/iot/setIotInfo', [_this.device]).done(function(result) {
                                if (result.data.length == 1) {
                                    window.plugins.toast.show('配对成功', 'short', 'center');
                                } else {
                                    window.plugins.toast.show('配对失败，服务器处理失败', 'short', 'center');
                                }
                            }).fail(function() {
                                window.plugins.toast.show('配对失败，服务器处理失败', 'short', 'center');
                            });
                        },
                        function(error) {
                            console.log("Scanning failed: " + error);
                        }
                    );
                } else {
                    /*_this.device.params.mac = '123456';
                    _this.device.baseType = 'things';
                    WebAPI.post('/iot/setIotInfo', [_this.device]).done(function(result){
                        //window.plugins.toast.show('配对成功', 'short', 'center');
                        alert('ok');
                    });*/
                }
            });
            //控制器历史
            $deviceScreen.find('.btnHist').off('touchend').on('touchend', function(e) {
                if (!$(this).closest('.deviceScreen ').hasClass('active')) return;
                e.preventDefault();
                e.stopPropagation();
                var dict = {};
                dict[_this.device.arrP.FCUOnOff] = _this.device.name;
                dict[_this.device.arrP.FCUSpeedD] = _this.device.name;
                _this.getHistoryData([_this.device.arrP.FCUSpeedD, _this.device.arrP.FCUOnOff], dict, 'device');
                $('#divChartWrap').show();
                $(_this.parent).hide().next('.ulPage').hide();
            });
            //设置风速
            $deviceScreen.find('.speed').off('touchend').on('touchend', function(e) {
                if (!$(this).closest('.deviceScreen ').hasClass('active')) return;
                e.preventDefault();
                e.stopPropagation();

                //只有手动模式下可以设置风速
                if (curRoom.params.mode != 10) {
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.indexMap.SET_SPEED_INFO, 'short', 'center');
                    return;
                };
                //只有拥有管理密码的人才可以设置风速
                var $paneConfig = $('.paneConfig');
                var $speedVal = $(this).find('.speedVal');
                _this.verifyPwd(function() {
                    var hisSpeed = $speedVal.text() === '--' ? 1 : $speedVal.text();

                    _this.hide();
                    //var $spanWs = $('#spanWs');
                    //$paneInfo.hide();
                    var tplSpeedWs = '\
                        <div class="divBtnBottom"><button class="btn btn-default" id="btnCancel" i18n="admin.roomPage.CANCEL">取消</button><button class="btn btn-success" id="btnSave" i18n="admin.roomPage.SURE">确定</button></div>\
                        <div class="divSetItem">\
                            <span i18n="admin.controllers.WIND_SPEED">风速</span>\
                            <div class="divRange" style="">\
                                <div class="rangeSlider">\
                                    <div class="rangeFill" style=""></div>\
                                    <div class="rangeCursor" style=""></div>\
                                </div>\
                                <div class="divScale">\
                                    <span id="iptSpeedVal">{speedVal}</span>\
                                </div>\
                            </div>\
                        </div>\
                        ';
                    //var wsVal = $spanWs.text();
                    $paneConfig.html(tplSpeedWs.formatEL({ speedVal: hisSpeed }));
                    I18n.fillArea($paneConfig);
                    var $rangeCursor = $('.rangeCursor'),
                        $rangeSlider = $('.rangeSlider'),
                        $rangeFill = $('.rangeFill'),
                        $iptSpeedVal = $('#iptSpeedVal');

                    //初始化range
                    $('#divTemperature').css('height', 'auto');
                    hisSpeed = parseInt(hisSpeed);
                    var nowSpeed = hisSpeed;
                    var left = (hisSpeed) / 3 * $rangeSlider.width(); // temp = fillWidth/rangeWidth* 15 + 15, rangeWidth = $rangeSlider.width() - 10;
                    $rangeFill.width(left);
                    $rangeCursor.css({ left: left - 10 });

                    $('#btnSave').off('touchend').on('touchend', function() {
                        infoBox.confirm(I18n.resource.admin.indexMap.SET_WIND_SPEED, okCallback);

                        function okCallback() {
                            var postData = [{
                                _id: _this.device._id,
                                prefix: _this.device.prefix,
                                projectId: curRoom.projId,
                                attrs: {}
                            }];
                            var isNeedSave = false;
                            if (hisSpeed !== nowSpeed) {
                                postData[0].attrs['FCUSpeedDSet'] = nowSpeed;
                                if (!isNaN(postData[0].attrs['FCUSpeedDSet'])) {
                                    isNeedSave = true;
                                } else {
                                    isNeedSave = false;
                                }
                            }
                            if (!isNeedSave) return;
                            var hisData = {
                                gps: [],
                                time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                                userId: AppConfig.userId,
                                roomId: curRoom._id,
                                spaceId: '',
                                source: 0,
                                option: {
                                    _id: _this.device._id,
                                    prefix: _this.device.prefix,
                                    projectId: curRoom.projId,
                                    FCUSpeedDSet: nowSpeed
                                },
                                controllerParams: []
                            }
                            Spinner.spin($paneConfig[0]);
                            WebAPI.post('/appTemperature/setControllers', postData).done(function(a) {
                                WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: [_this.device.arrP['FCUSpeedD']] }).done(function(result) {
                                    if (result && result.dsItemList && result.dsItemList.length == 1) {
                                        //$speedVal.text(result.dsItemList[0].data);
                                    }
                                });
                                WebAPI.post('/appTemperature/insertHistoryOperation', hisData).done(function(rslt) {

                                });
                                //返回上一个页面
                                $paneConfig.empty();
                                $('#divTemperature').removeAttr('style').show();
                                _this.noHide();
                            }).always(function() {
                                Spinner.stop();
                            });

                        }
                    });
                    $('#btnCancel').off('touchend').on('touchend', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        $paneConfig.empty();
                        $('#divTemperature').removeAttr('style').show();
                        _this.noHide();
                    });

                    var startX;
                    $rangeCursor.off('touchstart').on('touchstart', function(e) {
                        startX = e.originalEvent.targetTouches[0].pageX - $rangeSlider[0].offsetLeft;
                    });
                    $rangeSlider.off('touchmove').on('touchmove', function(e) {
                        var targetTouch = e.originalEvent.targetTouches[0];
                        var newX = targetTouch.pageX - $rangeSlider[0].offsetLeft;
                        if (newX > startX + 50) {
                            left = Math.min(left + $rangeSlider.width() / 3, $rangeSlider.width());
                            $rangeCursor.css({ left: left - 10 });
                            $rangeFill.width(left);
                            nowSpeed = Math.min(nowSpeed + 1, 3);
                            startX = newX;
                        } else if (newX < startX - 50) {
                            left = Math.max(left - $rangeSlider.width() / 3, 0);
                            $rangeCursor.css({ left: left - 10 });
                            $rangeFill.width(left);
                            nowSpeed = Math.max(nowSpeed - 1, 0);
                            startX = newX;
                        }
                        $iptSpeedVal.text(nowSpeed);
                    })

                });
            })
        },
        attachEventsMode: function($deviceScreen) {
            //$deviceScreen.find('.switch').off('touchend').on('touchend', function (e) {
            //if (!$(this).closest('.deviceScreen ').hasClass('active')) return;
            //e.preventDefault();
            //e.stopPropagation();
            //if($(this).hasClass('btn-switch-off')){
            //    $(this).removeClass('btn-switch-off').addClass('btn-switch-on');
            //}else{
            //    $(this).removeClass('btn-switch-on').addClass('btn-switch-off');
            //}
            // });
        },
        attachEventsSensor: function($deviceScreen) {
            var _this = this;
            //配对
            $deviceScreen.find('.btnMatch').off('touchend').on('touchend', function(e) {
                if (!$(this).closest('.deviceScreen').hasClass('active')) return;
                e.preventDefault();
                e.stopPropagation();
                if (typeof cordova != 'undefined') {
                    cordova.plugins.barcodeScanner.scan(
                        function(result) {
                            console.log("We got a barcode\n" +
                                "Result: " + result.text + "\n" +
                                "Format: " + result.format + "\n" +
                                "Cancelled: " + result.cancelled);
                            _this.device.params.mac = result.text;
                            _this.device.baseType = 'things';
                            WebAPI.post('/iot/setIotInfo', [_this.device]).done(function(result) {
                                if (result.data.length == 1) {
                                    window.plugins.toast.show('配对成功', 'short', 'center');
                                }
                            });
                        },
                        function(error) {
                            console.log("Scanning failed: " + error);
                        }
                    );
                } else {
                    /*_this.device.params.mac = '123456';
                    _this.device.baseType = 'things';
                    WebAPI.post('/iot/setIotInfo', [_this.device]).done(function(result){
                        //window.plugins.toast.show('配对成功', 'short', 'center');
                        alert('ok');
                    });*/
                }
            });
            //传感器历史
            $deviceScreen.find('.btnHist').off('touchend').on('touchend',
                function(e) {
                    if (!$(this).closest('.deviceScreen').hasClass('active')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    var dict = {};
                    dict[_this.device.arrP.SensorT] = _this.device.name;
                    _this.getHistoryData([_this.device.arrP.SensorT], dict, 'sensor');
                    $('#divChartWrap').show();
                    $(_this.parent).hide().next('.ulPage').hide();
                }
            );
        },
        getHistoryData: function(arrId, dictIdName, type) {
            var now = new Date();
            //最近7小时的数据 7*60*60*1000
            var postData = {
                dsItemIds: arrId,
                timeEnd: now.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: "m5",
                timeStart: new Date(now.getTime() - 25200000).format('yyyy-MM-dd HH:mm:ss')
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result) {
                var opt = _this.createOpt(result, dictIdName, type);
                echarts.init(document.getElementById('divChart')).setOption(opt);
                $('.divCheckAll').hide();
            });
        },
        createOpt: function(data, dictIdName, type) {
            var lowerLimit = curRoom.params.tempSet ? curRoom.params.tempSet - 2 : 22;
            var upperLimit = curRoom.params.tempSet ? curRoom.params.tempSet + 2 : 26;
            var minData = Math.min.apply(this, data.list[0].data) || lowerLimit;
            var maxData = Math.max.apply(this, data.list[0].data) || upperLimit;
            minData = minData < lowerLimit ? minData : lowerLimit;
            maxData = maxData > upperLimit ? maxData : upperLimit;
            var min = null,
                max = null,
                isShowBar = false;
            if (type == 'sensor') {
                min = Number(minData.toFixed(1));
                max = Number(maxData.toFixed(1));
            } else if (type == 'device') {
                var min = 0;
                var max = 3;
                isShowBar = true;
            }
            var opt = {
                title: {
                    text: '',
                    left: '45%',
                    textStyle: {
                        color: '#fff',
                    }
                },
                grid: {
                    left: 0,
                    top: 28,
                    right: 0,
                    bottom: 0
                },
                legend: {
                    data: [],
                    left: 0,
                    top: 0,
                    textStyle: { color: '#fff' }
                },
                tooltip: {
                    trigger: 'axis'
                },

                calculable: true,
                xAxis: [{
                    type: 'category',
                    //boundaryGap: true,
                    splitLine: { lineStyle: { color: '#FFAE00', type: 'dashed' } },
                    axisLabel: {
                        inside: true,
                        textStyle: { color: '#FFAE00' }
                    },
                    data: function() {
                        //data.timeShaft
                        var timeList = [];
                        for (var i = 0, len = data.timeShaft.length; i < len; i++) {
                            var hTime = data.timeShaft[i].split(' ')[1];
                            var finTime = hTime.substring(0, hTime.length - 3);
                            timeList.push(finTime);
                        }
                        //添加最新时间
                        var date = new Date(),
                            hour = date.getHours(),
                            min = date.getMinutes();
                        var nowTime = (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min);
                        timeList.push(nowTime);
                        return timeList;
                    }()
                }],
                yAxis: [{
                        show: true,
                        type: 'value',
                        splitNumber: 1,
                        min: min,
                        max: max,
                        axisLabel: {
                            show: false,
                            inside: true,
                            textStyle: { color: '#fff' }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: { color: '#FFAE00', type: 'dashed' }
                        },
                        scale: true,
                        data: []
                    },
                    {
                        show: isShowBar,
                        type: 'value',
                        splitNumber: 1,
                        min: 0,
                        max: 1,
                        axisLabel: {
                            show: false,
                            inside: true,
                            textStyle: { color: '#fff' }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: { color: '#FFAE00', type: 'dashed' }
                        },
                        scale: true,
                        data: []
                    }
                ],
                series: [

                ]
            };

            if (type == 'sensor') {
                for (var i = 0, name; i < data.list.length; i++) {
                    name = dictIdName[data.list[i].dsItemId];
                    var tempNow = parseFloat($('#' + data.list[i].dsItemId).html());
                    //保留一位小数的值
                    var newData = [];
                    data.list[i].data.push(tempNow);
                    data.list[i].data.forEach(function(it, i) {
                        var temp = Number(it.toFixed(1));
                        newData.push(temp);
                    });
                    opt.legend.data.push({ name: name, icon: 'pin' }); //todo id转换成alias
                    opt.series.push({
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 7,
                            itemStyle: { normal: { color: '#FFF', borderColor: '#ccc', borderWidth: 1, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 2 } },
                            label: { normal: { show: true, textStyle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.9)' }, position: [0, -18], formatter: '{c}' + '℃' } },
                            data: [
                                { type: 'min', name: 'Min' },
                                { type: 'max', name: 'Max' }
                            ]
                        },
                        markLine: {
                            label: {
                                normal: {
                                    formatter: ''
                                }
                            },
                            symbol: 'none',
                            precision: 1,
                            lineStyle: {
                                normal: {
                                    type: "solid"
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: "middle",
                                    formatter: '{b}: {c}'
                                }
                            },
                            data: [{
                                    "name": "Upper limit",
                                    "yAxis": upperLimit,
                                    itemStyle: {
                                        normal: { color: 'rgba(176, 58, 91,0.7)' }
                                    }
                                },
                                {
                                    "name": "Lower limit",
                                    "yAxis": lowerLimit,
                                    itemStyle: {
                                        normal: { color: 'rgba(176, 58, 91,0.7)' }
                                    }
                                },
                                {
                                    "name": "Setting",
                                    "yAxis": curRoom.params.tempSet ? curRoom.params.tempSet : '',
                                    itemStyle: {
                                        normal: { color: 'rgba(0,156,255,0.4)' }
                                    }
                                },
                                {
                                    "name": "Average",
                                    "type": "average",
                                    itemStyle: {
                                        normal: { color: 'rgba(230,230,230,0.7)' }
                                    }
                                }
                            ]
                        },
                        symbol: 'rect',
                        smooth: true,
                        areaStyle: { normal: { color: '#565864', opacity: 0.4 } },
                        itemStyle: { normal: { opacity: 0, color: '#FFAE00' } },
                        name: name,
                        type: 'line',
                        data: newData
                    });
                }
            } else if (type == 'device') {
                opt.title.text = dictIdName[data.list[0].dsItemId];
                opt.legend.data.push({ name: 'Speed', icon: 'pin' }, { name: 'Switch', icon: 'pin' });
                opt.series.push({
                    type: 'line',
                    symbol: 'rect',
                    smooth: true,
                    areaStyle: { normal: { color: '#565864', opacity: 0.4 } },
                    itemStyle: { normal: { opacity: 0, color: '#FFAE00' } },
                    name: 'Speed',
                    markPoint: {
                        symbol: 'circle',
                        symbolSize: 7,
                        itemStyle: { normal: { color: '#FFF', borderColor: '#ccc', borderWidth: 1, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 2 } },
                        label: { normal: { show: true, textStyle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.9)' }, position: [8, -18] } },
                        data: [
                            { type: 'min', name: 'Min' },
                            { type: 'max', name: 'Max' }
                        ]
                    },
                    data: data.list[0].data
                }, {
                    type: 'line',
                    symbol: 'rect',
                    smooth: false,
                    step: 'middle',
                    areaStyle: { normal: { color: '#3398DB', opacity: 0.4 } },
                    itemStyle: { normal: { opacity: 0, color: '#3398DB' } },
                    name: 'Switch',
                    yAxisIndex: 1,
                    data: data.list[1].data
                });
            }

            return opt;
        }
    }

    return CtrlItem;
}());
/**
 * Created by vicky on 2016/3/14.
 */
var Mode = (function(){
    var _this;
    var device;
    Mode.navOptions = {
        top: '<span class="topNavTitle" i18n="admin.navTitle.PATTERN"></span>'
    };

    function Mode(){
        _this = this;
    }

    Mode.prototype = {
        show: function () {
            WebAPI.get('static/app/temperatureControl/views/config/mode.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                I18n.fillArea($('#indexMain'));
                I18n.fillArea($('#navTop'));
                $('.opt-btn').removeClass('btn-switch-on').addClass('btn-switch-off');
                $('[data-mode="'+ curRoom.params.mode +'"]').children('.opt-btn').removeClass('btn-switch-off').addClass('btn-switch-on');
                /*if (curRoom.params.mode == 10) {
                    router.ctrlSet.show($('#modeCtrlCtn')[0], 'mode', null, true);
                    var isCheckAll = true;
                    for (var k in curRoom.params.arrCommand) {
                        if (curRoom.params.arrCommand[k].switch === 1) {
                            $('#modeCtrlCtn #ds_' + curRoom.params.arrCommand[k].controllerId).find('.opt-btn').removeClass('btn-switch-off').addClass('btn-switch-on');
                        } else {
                            isCheckAll = false;
                        }
                    }
                    if (isCheckAll) {
                        $('#modeCtrlCtn .divCheckAll').addClass('check');
                    }
                }*/
                _this.attachEvents();
            });
        },
        init: function () {

        },
        attachEvents: function () {
            var $ulMode = $('#ulMode');
            var dictMode = {
                0: I18n.resource.admin.pattern.MS_PRIORITY_MODE,
                1: I18n.resource.admin.pattern.ENERGY_SAVING_MODE,
                2: I18n.resource.admin.pattern.COMFORTABLE_MODE,
                10: I18n.resource.admin.pattern.MANUAL_MODE
            }
            var oldMode;
            $('#modeCtrlCtn').off('touchend', '.opt-btn,.divCheckAll').on('touchend', '.opt-btn,.divCheckAll', function (e) {
                e.preventDefault();
                var $this = $(this);
                var postData = [];
                if ($this.hasClass('divCheckAll')) {
                    var deviceInfo;
                    var switchTemp = ($this.hasClass('check')) ? 1 : 0;
                    if (ctrAll && ctrAll.length > 0) {
                        $('#modeCtrlCtn .deviceScreen').each(function (i, item) {
                            for (var i = 0; i < ctrAll.length; i++) {
                                if (item.id.split('_')[1] == ctrAll[i]._id) {
                                    if(!_this.device){
                                        _this.device = ctrAll[i];
                                    }
                                    deviceInfo = ctrAll[i];
                                    postData.push({ _id: deviceInfo._id, prefix: deviceInfo.prefix, projectId: curRoom.projId, attrs: { FCUOnOffSet: switchTemp } });
                                    break;
                                }
                            }

                        });
                        _this.sa(postData, oldMode, false);
                    }
                } else {
                    var id = $this.closest('.deviceScreen').attr('id').split('_')[1];
                    for (var i = 0; i < ctrAll.length; i++) {
                        if (id == ctrAll[i]._id) {
                            _this.device = ctrAll[i];
                            break;
                        }
                    }
                    postData = [{ _id: _this.device._id, prefix: _this.device.prefix, projectId: curRoom.projId, attrs: {} }];
                    if ($this.hasClass('btn-switch-on')) {
                        postData[0].attrs['FCUOnOffSet'] = 1;
                    } else {
                        postData[0].attrs['FCUOnOffSet'] = 0;
                    }
                    
                    _this.sa(postData, oldMode, false);
                }
            })
            $('.itemMode', $ulMode).off('touchstart').on('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var itemMode = this;
                oldMode = curRoom.params.mode;
                var isSeem = (itemMode.dataset.mode == curRoom.params.mode) ? true : false;
                //确认是否切换模式
                /*if (itemMode.dataset.mode == 10) {//手动模式
                    if (isSeem) {
                        return;
                    }
                    else {
                        infoBox.confirm(I18n.resource.admin.pattern.CONFIRM_SWITCH + dictMode[itemMode.dataset.mode] + '?', okCallback2);
                    }

                } else {*/
                    if (isSeem) return;
                    infoBox.confirm(I18n.resource.admin.pattern.CONFIRM_SWITCH + dictMode[itemMode.dataset.mode] + '?', okCallback, null);
                /*}*/
                function okCallback() {
                    router.ctrlSet.hide();
                    curRoom.params.mode = parseInt(itemMode.dataset.mode);
                    curRoom.baseType = 'groups';
                    _this.saveMode([curRoom], dictMode[curRoom.params.mode], oldMode,true);
                }
                /*function okCallback2() {
                    $('.opt-btn').not('.deviceScreen .opt-btn').removeClass('btn-switch-on').addClass('btn-switch-off');
                    $('[data-mode="10"]').children('.opt-btn').removeClass('btn-switch-off').addClass('btn-switch-on');
                    router.ctrlSet.show($('#modeCtrlCtn')[0], 'mode');
                    if (ctrAll && ctrAll.length > 0) {
                        var deviceInfo,postData=[];
                        $('#modeCtrlCtn .deviceScreen').each(function (i, item) {
                            for (var i = 0; i < ctrAll.length; i++) {
                                if (item.id.split('_')[1] == ctrAll[i]._id) {
                                    if (!_this.device) {
                                        _this.device = ctrAll[i];
                                    }
                                    deviceInfo = ctrAll[i];
                                    postData.push({ _id: deviceInfo._id, prefix: deviceInfo.prefix, projectId: curRoom.projId, attrs: { FCUOnOffSet: 0 } });
                                    break;
                                }
                            }

                        });
                        _this.sa(postData, oldMode, true);
                    }
                    
                }*/
            });
        },
        //保存手动模式列表
        saveOpt: function (oldMode,isChangeMode) {
            var $deviceScreen = $('#modeCtrlCtn .deviceScreen');
            var arrCommand = [];
            $deviceScreen.each(function (i, item) {
                arrCommand.push({ controllerId: item.id.split('_')[1], switch: $(item).find('.opt-btn').hasClass('btn-switch-on') ? 1 : 0 });
            });
            curRoom.params.arrCommand = arrCommand;
            curRoom.params.mode = 10;
            curRoom.baseType = 'groups';
            _this.saveMode([curRoom], null, oldMode, isChangeMode);
        },
        sa: function (postData, oldMode, isChangeMode) {
            _this.setControllers(postData).done(function (result) {
                if (result.data !== 'success') return;
                _this.saveOpt(oldMode, isChangeMode)
                //保存操作记录
                _this.saveRecord(postData);
                //WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: [_this.device.arrP['FCUSpeedD']] }).done(function (result) {
                //    if (result && result.dsItemList && result.dsItemList.length == 1) {
                //        $spanWs.text(result.dsItemList[0].data);
                //    }
                //}).always(function () {
                //    Spinner.stop();
                //});
            });
        },
         saveRecord: function (postData) {
             var controllerParams = [];
             for (var i = 0, len = postData.length; i < len; i++) {
                 controllerParams.push({ _id: postData[i]._id, switch: postData[i].attrs['FCUOnOffSet'] });
             }
            var hisData = {
                gps: [],
                time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                userId: AppConfig.userId,
                roomId: curRoom._id,
                spaceId: '',
                source: 0,
                option: {},
                controllerParams: controllerParams
            }
            WebAPI.post('/appTemperature/insertHistoryOperation', hisData).done(function (rslt) {

            });
         },
         saveHis: function (mode) {
             var hisData = {
                 gps: [],
                 time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                 userId: AppConfig.userId,
                 roomId: curRoom._id,
                 spaceId: '',
                 source: 3,
                 option: {
                     mode: mode
                 },
                 controllerParams: []
             }
             WebAPI.post('/appTemperature/insertHistoryOperation', hisData);
         },
        setControllers: function (arrData) {
            return WebAPI.post('/appTemperature/setControllers', arrData);
        },
        saveMode: function(data, mode, oldMode,isChangeMode){
            WebAPI.post('/iot/setIotInfo', data).done(function(result){
                if(result.data && result.data.length > 0){
                    $('.opt-btn').not('.deviceScreen .opt-btn').removeClass('btn-switch-on').addClass('btn-switch-off');
                    $('[data-mode="' + data[0].params.mode + '"]').children('.opt-btn').removeClass('btn-switch-off').addClass('btn-switch-on');
                    isChangeMode&&_this.saveHis(curRoom.params.mode);
                    //router.ctrlSet.hide();
                    //设置运行模式
                    WebAPI.get('/appTemperature/room/mode/'+ curRoom._id +'/' + curRoom.params.mode).done(function(){

                    });
                }else{
                    //设置模式失败,恢复房间原来的模式
                    curRoom.params.mode = oldMode;
                    $('[data-mode="'+ oldMode +'"]').addClass('selected').siblings().removeClass('selected');
                    if(window.plugins){
                        window.plugins.toast.show(I18n.resource.admin.pattern.SWITCHED_ERROR, 'short', 'center');
                    }else{
                        alert(I18n.resource.admin.pattern.SWITCHED_ERROR);
                    }
                }
            });
        },

        close:function(){

        }
    };

    return Mode;
})();

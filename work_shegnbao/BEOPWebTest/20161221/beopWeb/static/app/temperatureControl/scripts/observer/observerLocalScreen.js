/**
 * Created by win7 on 2015/9/14.
 */
var ObserverLocalScreen = (function() {
    var _this;
    // //储存全局数据
    // ObserverLocalScreen.navOptions = {
    //     top: '<span id="roomName" class="topNavTitle"></span>\
    //           <span class="topNavRight" id="btnConfig">\
    //               <span class="iconfont icon-shezhi1" aria-hidden="true"></span>\
    //           </span>',
    //     bottom: true,
    //     backDisable: false
    // };

    function ObserverLocalScreen() {
        ObserverScreen.call(this);
        _this = this;
        this.mqttClient = undefined;
    }

    ObserverLocalScreen.prototype = new ObserverScreen();

    ObserverLocalScreen.prototype.renderObserver = function() {
        curRoom = roomAll[0];
        mapConfig = curRoom.params.map;
        AppConfig.roomId = curRoom._id;
        $('#roomName').text(curRoom.name);

        if (!_this.render) {
            _this.initMap();
            _this.initMapTool();
            _this.initRoom();
            _this.initToggle();
            _this.clickZindex();
        }
    };
    ObserverLocalScreen.prototype.initWorkerUpdate = function() {
        var status_topic = "/state/sensor/3";
        this.mqttClient = mqtt.connect("ws://192.168.1.204:1889", {});
        this.mqttClient.subscribe(status_topic);
        this.mqttClient.on('message', function(topic, message) {
            message = JSON.parse(message);

            var arrTopic = topic.split('/');
            var root = arrTopic[1],
                type = arrTopic[2],
                point_number = parseInt(arrTopic[3], 10);

            if (root != "state") {
                console.log("Wrong topic " + topic);
                return;
            }

            if (type == 'sensor') {
                updateSensor(point_number, message)
            } else if (type == 'controller') {
                updateController(point_number, message)
            } else {
                console.log("Unknow type!")
            }
        });

        function updateSensor(index, msg) {
            $('#divObserverMap .divSensor .spVal').html(msg.t);
        };

        function updateController(index, msg) {

        };


        // if (!sensorAll || !ctrAll) return;
        // if (this.workerUpdate) this.workerUpdate.terminate();
        // this.workerUpdate = new Worker("static/views/js/worker/workerUpdate.js");
        // this.workerUpdate.self = this;
        // this.workerUpdate.addEventListener("message", this.refreshData, true);
        // this.workerUpdate.addEventListener("error", function(e) {
        //     console.log(e);
        // }, true);
        // var pointList = { dsItemIds: [] };
        // for (var i = 0; i < sensorAll.length; i++) {
        //     for (var ele in sensorAll[i].arrP) {
        //         pointList.dsItemIds.push(sensorAll[i].arrP[ele]);
        //     }
        // }
        // if (_this.mode == 'device') {
        //     for (var i = 0; i < ctrAll.length; i++) {
        //         for (var ele in ctrAll[i].arrP) {
        //             pointList.dsItemIds.push(ctrAll[i].arrP[ele]);
        //         }
        //     }
        // }
        // this.workerUpdate.postMessage({ pointList: pointList.dsItemIds, type: "roomInfoRealtime", roomId: curRoom._id });
    };

    ObserverLocalScreen.prototype.setControllers = function(arrData) {
        console.dir(arrData);

        return { done: function() {}, error: function() {}, always: function() {} };
    };

    ObserverLocalScreen.prototype.refreshData = function(e) { //e.data={data: [],mode: 0}
        var tar;
        var $device, data;
        var sensorTemp, $spIcon;
        var TEMP;
        if (!e.data.data) return;
        data = e.data.data;
        //当前日程的设定温度
        e.data.params && (TEMP = e.data.params.tempSet);
        //设备下关闭的控制器显示样式
        for (var i = 0; i < data.length; i++) {
            tar = document.getElementById(data[i].dsItemId);
            if (!tar) {
                tar = $('.spVal[windId=' + data[i].dsItemId + ']')[0];
            };
            if (!tar) continue;
            $device = $(tar).parentsUntil('#containerMap', '.divUnit');
            if ($device.hasClass('divSensor')) {
                sensorTemp = parseFloat(data[i].data).toFixed(1);
                $spIcon = $device.find('.spIcon');
                //根据当前日程的设定温度改变传感器显示颜色
                if (TEMP && sensorTemp - TEMP >= 2) {
                    $spIcon.removeClass('higher lower').addClass('higher');
                }
                if (TEMP && TEMP - sensorTemp >= 2) {
                    $spIcon.removeClass('higher lower').addClass('lower');
                }
                tar.innerHTML = sensorTemp + '℃';
            } else if ($device.hasClass('divCtr')) {
                for (var j = 0; j < ctrAll.length; j++) {
                    //显示风速
                    if (data[i].dsItemId == ctrAll[j].arrP.FCUSpeedD) {
                        tar.innerHTML = data[i].data == 'Null' ? '--' : data[i].data;
                        break;
                    }
                    if (data[i].dsItemId == ctrAll[j].arrP.FCUOnOff) {
                        //如果控制器是关,增加样式
                        if (data[i].data == 1) {
                            $device.removeClass('off');
                        } else if (data[i].data == 0) {
                            $device.addClass('off');
                        }
                        for (var k = 0; k < curRoom.params.arrCommand.length; k++) {
                            if (ctrAll[j]['_id'] == curRoom.params.arrCommand[k].controllerId) {
                                if (data[i].data == 1) {
                                    curRoom.params.arrCommand[k].switch = 1;
                                } else if (data[i].data == 0) {
                                    curRoom.params.arrCommand[k].switch = 0;
                                }
                            }
                        }
                        break;
                    }

                }
            }
        }

        if (this.self.mode == 'device') {
            for (var k in curRoom.params.arrCommand) {
                if (curRoom.params.arrCommand[k].switch === 0) {
                    $('#containerMap #' + curRoom.params.arrCommand[k].controllerId).addClass('off');
                } else {
                    $('#containerMap #' + curRoom.params.arrCommand[k].controllerId).removeClass('off');
                }
            }
        }
        document.getElementById('refreshTime').innerText = I18n.resource.admin.indexMap.LAST_REFRESH + new Date().format('MM-dd HH:mm');
        if (e.data.params.mode && curRoom.params.mode != e.data.params.mode) {
            curRoom.params = e.data.params;
            $('#btnSetMode').removeClass().addClass('iconfont icon-' + (function(mode) {
                var className = '';
                switch (mode) {
                    case 0:
                        className = 'moshisheding';
                        break;
                    case 1:
                        className = 'jieneng';
                        break;
                    case 2:
                        className = 'shushi';
                        break;
                    case 10:
                        className = 'shoudongmoshi1';
                        break;
                }
                return className;
            }(Number(curRoom.params.mode))));
            $('.txtFont.mode').html(_this.getMode(Number(curRoom.params.mode)));
            if (curRoom.params.mode == 10) { //手动模式下设备模式的按钮要显示                   
                $('#btnDeviceMode').show();
            } else if (curRoom.grade == 0) { //非手动模式且没有权限                    
                $('#btnDeviceMode').hide();
            }
        }
        //显示图表
        _this.mapTool.imgMapMove();
    };


    //初始化房屋配置信息
    ObserverLocalScreen.prototype.initRoom = function() {
        WebAPI.get('/appTemperature/room/getDetail/' + curRoom['_id']).done(function(resultData) {
            sensorAll = [];
            ctrAll = [];
            spaceAll = resultData.data.space;
            resultData.data.device.forEach(function(val) {
                if (val.type.indexOf('Sensor') > -1) {
                    sensorAll.push(val)
                } else {
                    ctrAll.push(val)
                }
            });

            _this.initEquipments('Ctr', ctrAll, '<span class="iconfont icon-fengsushezhi"></span><span class="spVal" id="<%tempId%>" windId="<%windId%>"><%tempName%></span>');
            _this.initEquipments('Sensor', sensorAll, '<span class="iconfont icon-wenduchuanganqi"></span><span class="spVal" id="<%tempId%>"></span>');
            //初始化控制器列表
            router.ctrlSet = new CtrlSet();
            _this.initWorkerUpdate();

            mapConfig.scale = Math.min(window.innerHeight / mapConfig.height, window.innerWidth / mapConfig.width);
            mapConfig.scale = 0.5;
            _this.mapTool.resizeCalc();
            $('#containerMap').show();
            if (window.customVariable.isImgOnload) {
                _this.mapTool.imgOnloadMove();
                window.customVariable.isImgOnload = false;
            }
        })
    };
    ObserverLocalScreen.prototype.initTempSet = function() {
        var $tempChange = $('.tempChange');
        var $tempSetValue = $('#tempSetValue');
        var interval, setValue;
        $tempChange.off('touchstart').on('touchstart', function(e) {
            interval = 1;
            setValue = Number($tempSetValue.html());
            if (e.currentTarget.id == 'tempRaise') {
                setValue += interval;
                $tempSetValue.html(setValue.toFixed(0));
            } else {
                setValue -= interval;
                $tempSetValue.html(setValue.toFixed(0));
            }
        });
    };


    ObserverLocalScreen.prototype.addRelateLine = function() {};

    //获取实时数据
    ObserverLocalScreen.prototype.getArrPRealtimeData = function(device) {
        var arrId = [];
        for (var i in device.arrP) {
            arrId.push(device.arrP[i]);
        }
        if (this.mode == 'temp' && this.device.params.cId) {
            for (var j = 0; j < ctrAll.length; j++) {
                if (this.device.params.cId == ctrAll[j]._id) {
                    this.deviceCtr = ctrAll[j];
                    for (var i in ctrAll[j].arrP) {
                        arrId.push(ctrAll[j].arrP[i]);
                    }
                    break;
                }
            }
        }
        if (arrId.length == 0) return;
        return WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: arrId });
    };

    ObserverLocalScreen.prototype.setControllers = function(arrData) {
        return WebAPI.post('/appTemperature/setControllers', arrData);
    };

    ObserverLocalScreen.prototype.setTemp = function(data) {};

    ObserverLocalScreen.prototype.close = function() {
        if (this.workerUpdate) this.workerUpdate.terminate();
        $(ElScreenContainer).css('height', BomConfig.mainHeight);
        $('#topBlank').show();
        $('#btnBack', '#navTop').off('touchstart').on('touchstart', function(e) {
            router.back();
        });
    };

    return ObserverLocalScreen;
})();
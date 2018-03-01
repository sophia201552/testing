/**
 * Created by win7 on 2015/9/14.
 */
var ObserverScreen = (function(){
    var _this;
    //储存全局数据
    window.customVariable = {
        isHideSensor: false,//隐藏传感器
        isPasswordPass: false,//通过一次管理员密码
        lastGps: undefined,
        isImgOnload: true,
        isEdit: false,
        isFirstLoad: true
    }
    ObserverScreen.navOptions = {
        top: '<span id="roomName" class="topNavTitle"></span>\
              <span class="topNavRight" id="btnConfig">\
                  <span class="iconfont icon-shezhi" aria-hidden="true"></span>\
              </span>',
        bottom: true,
        backDisable:false
    };

    function ObserverScreen(){
        _this = this;
        this.mapTool = undefined; //界面工具组对象
        //this.mapConfig = undefined;//用户当前房间地图配置
        this.tempHis = undefined;
        this.deviceSize = {
            w:40,
            h:40
        };
        this.mapPadding = {
            left : 40,
            right: 120,
            top:120,
            bottom: 250
        };
        _this.mode = 'temp';
        //_this.dictClass = undefined;
        _this.workerUpdate = undefined;
        _this.$ctnSvg = undefined;
        _this.render= undefined;
        this.handerHis = new HistoryChart(this);
    }
    ObserverScreen.prototype = {
        //<div class="paneInfo paneInfo1">\
        //            <div id="btnCloseInfo">×</div>\
        //            <ul id=scrollCtr><ul>\
        //            <div>\
        //                <div class="divLabel">{deviceName}</div>\
        //                <div class="divLabel"><span class="iconfont icon-medium icon-{signal}" style="display: inline-block;"></span><span class="battSignStyle"></sapn></div>\
        //                <div class="divLabel"><span class="iconfont icon-medium icon-{battery}" style="line-height:2.8rem;"></span><span class="battSignStyle">{FCUBattery}%</span></div>\
        //            </div>\
        //            <div class="divItem"><span class="kaiguan">&#xe644;</span><span class="spanlabel">开关</span><div class="opt-btn{FCUOnOff}" id="btnSwitch" data-key=""><div class="btn-switch-slider"></div></div></div>\
        //            <div class="divItem {FCUSpeedD}" id="divItemWs"><span class="iconfont icon-fengsushezhi"></span><span class="spanlabel">风速</span><span id="spanWs">{FCUSpeedD}</span></div>\
        //            <div class="divItem {FCUAutoMode}" id=""><span class="glyphicon glyphicon-lamp" style="color:rgb(234, 193, 36);"></span><span class="spanlabel">手自动设定</span><span id="">{FCUAutoMode}</span></div>\
        //            <div class="divItem {FCUSeasonMode}" id=""><span class="glyphicon glyphicon-grain"  style="color:rgb(92, 184, 92);"></span><span class="spanlabel">季节模式</span><span id="">{FCUSeasonMode}</span></div>\
        //            <div class="divItem {FCUValvePositionD}" id=""><span class="glyphicon glyphicon-dashboard" style="color:#E2E3EA;"></span><span class="spanlabel">水阀开度</span><span id="">{FCUValvePositionD}</span></div>\
        //            <div style="margin-top:8px;"><span class="btn btn-default" id="btnMatch">配对</span><span class="btn btn-default" id="btnHist">历史</span></div>\
        //        </div>\
        //        <div class="paneConfig"></div>',
        tplCtr: '\
                <div class="paneInfo paneInfo1">\
                    <div id="btnCloseInfo">×</div>\
                    <ul class="ulPage"><ul>\
                </div>\
                <div class="paneConfig"></div>',

        tplSensor: '\
                <div class="paneInfo paneInfo1">\
                    <div id="btnCloseInfo">×</div>\
                    <div>\
                        <div class="divLabel">{deviceName}</div>\
                        <div class="divLabel"><span class="iconfont icon-{signal} icon-medium" style="display: inline-block;"></span><span class="battSignStyle"></span></div>\
                        <div class="divLabel"><span class="iconfont icon-{battery} icon-medium" style="line-height:2.8rem;"></span><span class="battSignStyle">{SensorBattery}%</span></div>\
                    </div>\
                    <div class="divItem {SensorT}" id=""><span class="iconfont icon-wenduchuanganqi icon-medium"  style="color:rgb(92, 184, 92);position:static;"></span><span class="spanlabel" i18n="admin.controllers.TEMPERATURE">温度</span><span id="">{SensorT}</span></div>\
                    <div class="divItem {SensorH}" id=""><span class="glyphicon glyphicon-tree-conifer" style="color:#9199DA;"></span><span class="spanlabel" i18n="admin.indexMap.HUMIDITY">湿度</span><span id="">{SensorH}</span></div>\
                </div>\
                <div class="paneConfig"></div>',

        tplTemp: ' <div class="paneInfo" style="position: relative; height: 100%;">\
                        <div id="btnCloseInfo">×</div>\
                        <div class="bottomBox">\
                            <div class="shadow"></div>\
                            <div class="curve" id="curve"></div>\
                            <div class="bot" id="bot">\
                                <div class="dials"></div>\
                                <div class="dials"></div>\
                                <div class="dials"></div>\
                                <div class="dials"></div>\
                            </div>\
                        </div>\
                        <div class="divTemp" id="divTemp">\
							<span id="spanTemp">--</span><span style="font-size: 14px;">℃</span>\
                        </div>\
                        <div class="modeBox">\
                            <span class="iconfont" id="btnSetMode"></span>\
                            <span class="txtFont mode"></span>\
                        </div>\
                    </div>\
                    <div class="paneConfig"></div>',
        //<div id="wsCtn"><span class="iconfont icon-fengsushezhi" id="btnSetWs"></span>\
        //    <span class="spanFCU" style="top: 1.3rem;">{FCUTSet}℃</span>\
        //    <span class="spanFCU" style="top: 3rem;">{FCUSpeedDSet}</span>\
        //</div>\

        //球
        //球
        //<div class="divTemp">\
        //        <div id="btnSetTemp" class="li" style="position: relative;">\
        //            <div class="a">\
        //                <div style="width: 100%; height: 100%; border: 1px dashed rgba(255, 255, 255, 0.5); border-radius: 50%;">\
        //                    <div style="width: 9rem; height:7rem; margin: 0 auto 0 auto; padding-bottom: 0.5rem; border-bottom: 1.5px solid rgba(255, 255, 255, 0.40);">\
        //                        <div style="width: 100%; height:100%; line-height: 9.6rem;">\
        //                            <span id="spanTemp">{SensorT}</span><span style="font-size: 1.6rem;">℃</span>\
        //                        </div>\
        //                    </div>\
        //                    <div style="height: 5rem; line-height: 3rem;">\
        //                        <span id="spanHumidity">{SensorH}</span><span style="font-size: 1.4rem;">%</span>\
        //                    </div>\
        //                </div>\
        //            </div>\
        //        </div>\
        //    </div>\
        show: function () {
            WebAPI.get('static/app/temperatureControl/views/observer/observerScreen.html').done(function (resultHTML) {
                $('#indexMain').html(resultHTML).css('height', BomConfig.wrapHeight);
                I18n.fillArea($('#indexMain'));
                $('#topBlank').hide();
                $('#containerMap').css(
                    {
                        'top': '-' + BomConfig.topHeight,
                        'left': '-' + _this.mapPadding.left + 'px',
                        'padding-top': _this.mapPadding.top + 'px',
                        'padding-bottom': _this.mapPadding.bottom + 'px',
                        'padding-left': _this.mapPadding.left + 'px',
                        'padding-right': _this.mapPadding.right + 'px'
                    }
                );
            var div3DMapWrap = $("<div></div>");
            div3DMapWrap.attr('id','3DMap');
            div3DMapWrap.css({'position':'absolute','top':'0','left':'0'});
            $('#divObserverMap').append(div3DMapWrap);            
                _this.$ctnSvg = $('#mapBg');
                _this.init();
            });
        },
        init: function () {
            _this.initNav();
            //获取用户roomList
            SpinnerControl.show();
            $('#containerMap').hide();
            if (!roomAll || roomAll.length == 0) {
                WebAPI.get('/appTemperature/room/getlist/' + AppConfig.userId).done(function (rs) {
                    roomAll = rs.roomList;
                    if (!roomAll || roomAll.length == 0) {//如果没有房间权限,提示先关联房间
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.indexMap.CORRECT_ROOM_INFO, 'short', 'center');
                        SpinnerControl.hide();
                        //一个房间也没有,跳转到关联房间页面
                        router.to({
                            typeClass: ProjectSel
                        });
                    }
                    if([1,73,1560,70,2495].indexOf(AppConfig.userId) != -1){
                        $('#btn3DMode').show();
                    }
                    _this.renderObserver();
                }).fail(function () {

                });
            } else {
                _this.renderObserver();
            }

        },
        renderObserver: function () {
            var findId, room;
            // 查看是否存在用户选择的 room id
            if (AppConfig.roomId === undefined) {
                // 检查缓存中是否有上一次打开的 roomId
                findId = localStorage.getItem('lastOpenRoomId');
            } else {
                findId = AppConfig.roomId;
            }

            if (!!findId) {
                room = (function (id) {
                    var roomList = roomAll;
                    for (var i = 0, len = roomList.length; i < len; i++) {
                        if (roomList[i]['_id'] === id) {
                            return roomList[i];
                        }
                    }
                    return;
                }(findId));
            }

            // 如果没找到上一次打开的 room，则默认进入第一个（合理？）
            if (!room) {
                room = roomAll[0];
            }

            if (!!room) {
                if (AppConfig.roomInit === true) {
                    mapConfig = room.params.map;
                }
                curRoom = room;

                // 更新缓存中最近打开的 room 字段
                localStorage.setItem('lastOpenRoomId', room['_id']);
                AppConfig.roomId = room['_id'];
            } else {
                return;
            }

            if(!mapConfig){
                SpinnerControl.hide();
                //一个房间也没有,跳转到关联房间页面
                router.to({
                    typeClass: ProjectSel
                });
            }

            //WebAPI.get('/iot/getClassFamily/thing/cn').done(function(result){
            //    _this.dictClass = result;
            if (typeof curRoom.name != 'undefined') {
                $('#roomName').text(curRoom.name)
            }
            //设置推送标签
            curRoom && Push.setTag(curRoom.grade.toString());
            if(!_this.render){
                _this.initMap();
                _this.initMapTool();
                _this.initRoom();
                _this.initTempSet();
                //设备切换功能绑定
                _this.initToggle();
                _this.clickZindex();
                _this.init3DMap();
            }
  
            //})
            //}).fail(function () {

        },
        initWorkerUpdate: function () {
            if (!sensorAll || !ctrAll) return;
            if (this.workerUpdate) this.workerUpdate.terminate();
            this.workerUpdate = new Worker("static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function (e) {
                console.log(e);
            }, true);
            var pointList = {dsItemIds: []};
            for (var i = 0; i < sensorAll.length; i++) {
                for (var ele in sensorAll[i].arrP) {
                    pointList.dsItemIds.push(sensorAll[i].arrP[ele]);
                }
            }
            if (_this.mode == 'device') {
                for (var i = 0; i < ctrAll.length; i++) {
                    for (var ele in ctrAll[i].arrP) {
                        pointList.dsItemIds.push(ctrAll[i].arrP[ele]);
                    }
                }
            }
            this.workerUpdate.postMessage({pointList: pointList.dsItemIds, type: "roomInfoRealtime", roomId: curRoom._id});
        },
        refreshData: function (e) {//e.data={data: [],mode: 0}
            var tar;
            var $device, data;
            var sensorTemp, $spIcon;
            var TEMP;
            if(!e.data.data) return;
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
                    if(TEMP && TEMP - sensorTemp >= 2){
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
			if(e.data.params.mode && curRoom.params.mode != e.data.params.mode){
                curRoom.params = e.data.params;
                $('#btnSetMode').removeClass().addClass('iconfont icon-' + (function (mode) {
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
                if(curRoom.params.mode == 10){//手动模式下设备模式的按钮要显示                   
                    $('#btnDeviceMode').show();
                }else if(curRoom.grade == 0){//非手动模式且没有权限                    
                    $('#btnDeviceMode').hide();
                }
			}
            //显示图表
            _this.mapTool.imgMapMove();
        },
        //初始化上导航
        initNav: function () {
            // 配置按钮
            $('#btnConfig').off('touchstart').on('touchstart', function (e) {
                router.to({
                    typeClass: AdminConfigure
                });
                e.preventDefault();
            });
            $('#btnBack', '#navTop').off('touchstart').on('touchstart', function (e) {
                router.to({
                    typeClass: ProjectSel
                });
                e.preventDefault();
            });
        },
        //初始化地图显示
        initMap: function () {
            var strMap = '<img id="imgMap" src="' + mapConfig.img + '"/>';
            $('#containerMap').append(strMap).css({
                'height': (mapConfig.height + _this.mapPadding.top + _this.mapPadding.bottom) + 'px',
                'width': (mapConfig.width + _this.mapPadding.left + _this.mapPadding.right) + 'px'
            });
            if (AppConfig.roomInit == true) {
                mapConfig.offsetX = 0;//地图相对于屏幕的偏移量
                mapConfig.offsetY = 0;//地图相对于屏幕的偏移量
                mapConfig.scale = 1;//缩放比例
                mapConfig.imgX = 0;//指定点相对于地图的窗口坐标
                mapConfig.imgY = 0;//指定点相对于地图的窗口坐标
                mapConfig.mapX = 0; //指定点相对于房间地图的实际坐标
                mapConfig.mapY = 0; //指定点相对于房间地图的实际坐标
            } else {
                $('#containerMap').css({
                    'left': mapConfig.offsetX + 'px',
                    'top': mapConfig.offsetY + 'px'
                });
            }
            _this.$ctnSvg = $('#mapBg').css({
                height: mapConfig.height + 'px',
                width: mapConfig.width + 'px'
            });
        }, 
        //初始化地图功能
        initMapTool: function () {
            _this.mapTool = new ObserverMap(this);
            _this.mapTool.show();
        },

        //初始化房屋配置信息
        initRoom: function () {
            WebAPI.get('/appTemperature/room/getDetail/' + curRoom['_id']).done(function (resultData) {
                sensorAll = [];
                ctrAll = [];
                spaceAll = resultData.data.space;
                resultData.data.device.forEach(function (val) {
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
        },
        initTempSet: function () {
            var $tempChange = $('.tempChange');
            var $tempSetValue = $('#tempSetValue');
            var interval, setValue;
            $tempChange.off('touchstart').on('touchstart', function (e) {
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
        },

        //初始化设备显示
        initEquipments: function (type, list, strIcon, strAttr) {
            //设备值初始化
            var ctn = document.getElementById('containerMap');
            var divEquip, spIcon, spAttr, strTemp, relateLine, relateCtr, brokenLine;
            var FCUSpeedDArr = [];

            for (var i = 0; i < list.length; i++) {
                brokenLine = document.createElement('div');
                brokenLine.className = 'divBrokenLine divUnit line' + type;
                brokenLine.innerHTML = '<div class = "slash"></div><div class = "smallPoint"></div>';
                brokenLine.dataset.x = list[i].params.gps[0];
                brokenLine.dataset.y = list[i].params.gps[1];
                divEquip = document.createElement('div');
                divEquip.className = 'divUnit divEquip div' + type;
                divEquip.id = list[i]['_id'];
                divEquip.dataset.type = type.toLocaleLowerCase();
                divEquip.dataset.x = list[i].params.gps[0];
                divEquip.dataset.y = list[i].params.gps[1];
                spIcon = document.createElement('div');
                spIcon.className = 'spIcon';
                if (strIcon) {//spIcon?
                    if (type == 'Sensor') {
                        if (list[i].arrP['SensorT']) {
                            strTemp = strIcon.replace('<%tempId%>', list[i].arrP['SensorT']);
                        }
                    } else if (type == 'Ctr') {
                        divEquip.className += ' off';
                        if (list[i].arrP['FCUOnOff']) {
                            strTemp = strIcon.replace('<%tempId%>', list[i].arrP['FCUOnOff'])
                                .replace('<%windId%>', list[i].arrP['FCUSpeedD'])
                                .replace('<%tempName%>', '--');
                        } else {
                            strTemp = strIcon.replace('<%tempId%>', '')
                                .replace('<%tempName%>', list[i].name);
                        }
                    }
                    spIcon.innerHTML = strTemp;
                }
                divEquip.appendChild(spIcon);

                divEquip.style.left = list[i].params.gps[0] + _this.mapPadding.left + 'px';
                divEquip.style.top = list[i].params.gps[1] + _this.mapTool.mapScreenTop + 'px';

                $(divEquip).hammer().on('tap', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (_this.mode == 'temp') {
                        _this.initEquipDetail(e.currentTarget.id, e.currentTarget.dataset.type, [e.currentTarget.dataset.x, e.currentTarget.dataset.y],this);
                    } else {
                        _this.initEquipDetail(e.currentTarget.id, e.currentTarget.dataset.type, [e.currentTarget.dataset.x, e.currentTarget.dataset.y]);
                    }
                    
                });

                //隐藏传感器
                if (window.customVariable.isHideSensor && type == 'Sensor') {
                    divEquip.style.display = 'none';
                    brokenLine.style.display = 'none';
                };

                if (ctn) {
                    ctn.appendChild(divEquip);
                    ctn.appendChild(brokenLine);
                }
                if (list[i].params.cId && document.getElementById(list[i].params.cId)) {
                    relateCtr = _this.searchDevice('ctr', list[i].params.cId);
                    if (!relateCtr)continue;
                    _this.addRelateLine(list[i], relateCtr);
                }
            }

            //if (type == 'Ctr') {
            //    list.forEach(function (it, i) {
            //        FCUSpeedDArr.push(it.arrP.FCUSpeedD);
            //    });
            //    WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: FCUSpeedDArr }).done(function (result) {
            //        if (result) {
            //            result.dsItemList.forEach(function (it, i) {
            //                $('.spVal[windId='+it.dsItemId+']').html(it.data=='Null'?'--':it.data);
            //            })
            //        }
            //    });
            //}

            _this.clickZindex();
        },

        addRelateLine: function (sensor, ctr) {
            //隐藏传感器
            if (window.customVariable.isHideSensor) return;
            var relateLine;
            relateLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            relateLine.className.baseVal = 'relateLine';
            relateLine.setAttribute('x1', sensor.params.gps[0]);
            relateLine.setAttribute('y1', sensor.params.gps[1]);
            relateLine.setAttribute('x2', ctr.params.gps[0]);
            relateLine.setAttribute('y2', ctr.params.gps[1]);
            relateLine.setAttribute('initX1', sensor.params.gps[0]);
            relateLine.setAttribute('initY1', sensor.params.gps[1]);
            relateLine.setAttribute('initX2', ctr.params.gps[0]);
            relateLine.setAttribute('initY2', ctr.params.gps[1]);
            relateLine.setAttribute('data-sensor', sensor['_id']);
            relateLine.setAttribute('data-controller', ctr['_id']);
            _this.$ctnSvg[0].appendChild(relateLine);
        },
        showCurve: function (arrId, opt, dom) {//显示图表
            var op = opt || {};
            var targetEl = dom || document.getElementById('curve');
            var now = new Date();
            var postData = {
                dsItemIds: arrId,
                timeEnd: now.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: "h1",
                timeStart: new Date(now.getTime() - 21600000).format('yyyy-MM-dd HH:mm:ss')//6小时
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function (result) {
                var data = [];
                var tempNow = parseFloat($('#' + arrId[0]).html());
                for (var i = 0, len = result.list[0].data.length; i < len; i++) {
                    data = data.concat(result.list[0].data[i]);
                }
                
                data.shift();
                data.push(tempNow);
                
                
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    formatter: function (val) {
                        var time = result.timeShaft[val[0].dataIndex].split(' ')[1].substring(0, 5);
                        if (val[0].dataIndex === 5) {
                            //添加最新时间
                            var date = new Date(),
                                hour = date.getHours(),
                                min = date.getMinutes();
                            time = (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min);
                        }
                        var str = '<span style="display:inline-block;margin-right:3px;border-radius:10px;width:9px;height:9px;background-color:#c23531"></span><span style="opacity: 0.5;">' + time + '</span></br>' + val[0].data + '℃';

                        return str;
                    },
                    calculable: true,
                    xAxis: [
                        {
                            show: false,
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        }
                    ],
                    grid: {
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0
                    },
                    yAxis: [
                        {
                            show: false,
                            type: 'value',
                            scale: true
                        }
                    ],
                    series: [
                        {
                            //markPoint: {
                            //    symbol: 'circle',
                            //    symbolSize: 15,
                            //    itemStyle: { normal: { color: '#fff', borderColor: '#ccc', borderWidth: 1, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 2 } },
                            //    label: { normal: { textStyle: { fontSize: 12 }, position: [0, -13], formatter: '{c}' + '℃' } },
                            //    data: [
                            //        { type: 'min', name: '最小值' }
                            //    ]
                            //},
                            type: 'line',
                            smoothMonotone: 'x',
                            symbol: 'rect',
                            smooth: true,
                            areaStyle: {normal: {color: 'rgba(255, 162, 0, 0.85)', opacity: 1}},
                            lineStyle: {normal: {color: '#fff'}},
                            itemStyle: {normal: {opacity: 0}},
                            animationEasing: 'linear',
                            animationDuration: 1000,
                            data: data
                        }
                    ]
                };
                $(targetEl).siblings('#bot').css({
                    'transform': 'translateX(0)',
                    '-webkit-transform': 'translateX(0)'
                });
                echarts.init(targetEl).setOption($.extend(option, op));

            });
        },
        initEquipDetail: function (equipId, type, gps,target) {
            var _this = this;
            var id = equipId;
            var $divTemperature = $('#divTemperature');
            var tpl = undefined;

            //查找当前设备, 保存详细信息到this.device
            if (_this.mode == "device") {
                if (type == 'ctr') {
                    if (ctrAll && ctrAll.length > 0) {
                        for (var i = 0; i < ctrAll.length; i++) {
                            if (id == ctrAll[i]._id) {
                                _this.device = ctrAll[i];
                                break;
                            }
                        }
                    }
                } else {
                    if (sensorAll && sensorAll.length > 0) {
                        for (var i = 0; i < sensorAll.length; i++) {
                            if (id == sensorAll[i]._id) {
                                _this.device = sensorAll[i];
                                break;
                            }
                        }
                    }
                }
                if (!_this.device) return;

                if (type == 'sensor') {
                    tpl = _this.tplSensor;
                } else {
                    tpl = _this.tplCtr;
                }

                if (_this.device.arrP && !$.isEmptyObject(_this.device.arrP)) {
                    _this.getArrPRealtimeData(_this.device).done(function (result) {
                        var objForTpl;
                        var data = _this.getarrPValById(result.dsItemList);
                        if (_this.mode == "temp") {

                        } else {
                            var isCtr;
                            //控制器
                            if (_this.device.type.indexOf('Controller') > -1) {
                                objForTpl = _this.getCtrInfoByData(data);
                                isCtr = true;
                            } else {//传感器
                                objForTpl = _this.getTempInfoByData(data);
                                isCtr = false;
                            }
                            $divTemperature.show().removeClass('divTemperature').html(tpl.formatEL(objForTpl));
                            if (isCtr) {
                                var isCheckAll = true;
                                router.ctrlSet.show($('.paneInfo')[0], 'device', _this.device);
                                $('#divTemperature .opt-btn').removeClass('btn-switch-on').removeClass('btn-switch-off').addClass('btn-switch-off');
                                for (var k in curRoom.params.arrCommand) {
                                    if (curRoom.params.arrCommand[k].switch == 1) {
                                        $('#divTemperature #ds_' + curRoom.params.arrCommand[k].controllerId).find('.opt-btn').removeClass('btn-switch-off').addClass('btn-switch-on');
                                    } else {
                                        isCheckAll = false;
                                    }
                                }
                                if (isCheckAll) {
                                    $('#divTemperature .divCheckAll').addClass('check');
                                }
                                if (curRoom.params.mode != 10) {
                                    $('#divTemperature .opt-btn').removeClass('disabled').addClass('disabled');
                                    $('#divTemperature .divCheckAll').removeClass('disabled').addClass('disabled');
                                }
                            } else {
                                router.ctrlSet.show($('.paneInfo')[0], 'sensor', _this.device);
                            }
                            _this.attachEventsDevice();
                            //如果控制器是关机,增加区分样式
                            var divCtr = document.getElementById(_this.device._id);
                            if (!divCtr) return;

                            I18n.fillArea($divTemperature);
                        }
                    })
                }

                $('.divUnit').removeClass('selected');

                var $divEquip = $('#' + _this.device._id);
                if(!$divEquip[0]) return;
                $divEquip.addClass('selected');

                //地图上的device显示在可视区域
                var $containerMap = $('#containerMap');
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var divLeft = Number.parseInt($divEquip.css('left')) - windowWidth / 2 + $divEquip.width()/2;
                var divTop = Number.parseInt($divEquip.css('top')) - windowHeight / 2 + $divEquip.height() / 2;
                var maxLeft = $containerMap[0].offsetWidth - windowWidth;
                var maxTop = $containerMap[0].offsetHeight - windowHeight;
                var left = Math.min(Math.max(-divLeft, -maxLeft),0);
                var top = Math.min(Math.max(-divTop, -maxTop),0);

                $containerMap.animate({
                    left: left,
                    top: top
                }, 1000);
                //防止地图位置改变
                mapConfig.offsetX = left+40;
                mapConfig.offsetY = top+120;
            }
            else if (_this.mode == 'temp') {
                var postData = {
                    'gps': [gps[0], gps[1], 0],
                    //'userId': AppConfig.userId
                    'roomId': curRoom._id
                };
                $('#divSetTempHis').empty();
                WebAPI.post('/appTemperature/location/getInfo/' + AppConfig.roomId, postData).done(function (result) {
                    if (target) {
                        var $spVal = $(target).find('.spVal')
                        var id2 = $spVal.attr('id');
                        var temp2 = $spVal.html();
                    }
                    var temp = temp2||result.temp;
                    id = result.sensorId;
                    _this.device = undefined;
                    mapConfig.mapScreenBottom = $divTemperature[0].offsetHeight;

                    tpl = _this.tplTemp;
                    $divTemperature.show().addClass('divTemperature').html(tpl);
                    var arrId = [];
                    arrId.push($('#' + id).children().find('.spVal').attr('id'));
                    if (id2) {
                        _this.showCurve([id2]);
                    } else {
                        _this.showCurve(arrId);
                    }


                    document.getElementById('spanTemp').innerHTML = temp ? parseFloat(temp).toFixed(1) : '--';
                    $('#btnSetMode').addClass('icon-' + (function (mode) {
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
                    I18n.fillArea($divTemperature);
                    _this.attachEventsTemp(gps);
                    //显示模式
                    var $spanMode = $('.txtFont.mode');
                    $spanMode.html(_this.getMode(Number(curRoom.params.mode)));
                    I18n.fillArea($divTemperature);

                    _this.showSetTempHistory(result.list, gps)
                });

            }

            $(document).off('touchstart').on('touchstart', '#btnCloseInfo', function (e) {
                e.preventDefault();
                _this.closeInfoPane();
            });
        },

        clickZindex: function () {
            var $divUnit = $('.divUnit');
            $divUnit.on('touchstart', '.spIcon', function () {
                $divUnit.removeClass("selected");
                $(this).parent('.divUnit').addClass("selected");
            })
        },
        //3D切换
        init3DMap:function(){            
           $('#btn3DMode').off('click').click(function(){
                $('#btn3DMode').toggleClass('selected');
                if($('#btn3DMode').hasClass('selected')){
                    _this.render=new threeDRender();
                    _this.render.render();
                    Spinner.spin($('#divObserverMap')[0]);
                }
                else{
                    _this.render.close();
                }
            });
        },
        //初始化设备切换
        initToggle: function () {
            var $btnMode = $('.btnMode');
            var $divSetTempHis = $('#divSetTempHis');
            var $btnDevice = $('#btnDeviceMode');
            var $btnTemp = $('#btnTempMode');
            var $ctnScreen = $('#divObserverMap');
            $btnMode.on('touchstart', function (e) {
                if (!$(e.currentTarget).hasClass('selected')) {
                    _this.closeInfoPane();
                    $btnMode.removeClass('selected');
                    $(e.currentTarget).addClass('selected');
                    if ($(e.currentTarget)[0].id == 'btnTempMode') {
                        $ctnScreen.removeClass('deviceMode').addClass('tempMode');
                        $('.divSensor').addClass('tempMode');
                        $('.divCtr,.lineCtr').css('display', 'none');
                        $divSetTempHis.removeClass('hidden ');
                        _this.mode = 'temp';
                    } else {
                        $ctnScreen.removeClass('tempMode').addClass('deviceMode');
                        $('.divSensor').removeClass('tempMode');
                        $('.divCtr,.lineCtr').css('display', 'block');
                        $divSetTempHis.addClass('hidden ');
                        _this.mode = 'device';
                        //_this.initWorkerUpdate();
                    }
                    _this.initWorkerUpdate();
                }
            });

            $btnTemp.trigger('touchstart');

            //权限 没有权限且不是手动模式时,隐藏设备模式按钮
            if (curRoom && curRoom.grade === 0 && curRoom.params.mode != 10) $btnDevice.hide();

        },

        attachEventsDevice: function () {
            var $btnSwitch = $('#btnSwitch');
            var $divItemWs = $('#btnSetWs');
            var $paneInfo = $('.paneInfo');
            var $paneConfig = $('.paneConfig');
            var $divTemperature = $('#divTemperature');
            if (this.device.delayTime && this.device.delayTime > 0 && this.device.postData) {
                this.setIntervalCtr(this.device)
            }
            //确保_this.device 是选中的控制器
            $('#divTemperature .deviceScreen').hammer().off('tap').on('tap', function (e) {
                if (_this.mode == 'temp') return;
                var screenDevice = document.getElementById(this.id.split('_')[1]);
                _this.initEquipDetail(screenDevice.id, screenDevice.dataset.type);
            });
            $divTemperature.off('touchend', '.ulCtrl .opt-btn,.divCheckAll').on('touchend', '.ulCtrl .opt-btn,.divCheckAll', function () {
                var $this = $(this);
                var postData = [];
                //只有手动模式,可以开关
                if ($this.hasClass('disabled')) {
                    if (window.plugins) {
                        window.plugins.toast.show(I18n.resource.admin.indexMap.OPEN_CLOSE_INFO, 'short', 'center');
                    }
                    else {
                        alert(I18n.resource.admin.indexMap.OPEN_CLOSE_INFO);
                    }
                    return;
                }
                if ($this.hasClass('divCheckAll')) {
                    var deviceInfo;
                    var switchTemp = ($this.hasClass('check')) ? 1 : 0;
                    if (ctrAll && ctrAll.length > 0) {
                        $('#divTemperature .deviceScreen').each(function (i, item) {
                            for (var i = 0; i < ctrAll.length; i++) {
                                if (item.id.split('_')[1] == ctrAll[i]._id) {
                                    deviceInfo = ctrAll[i];
                                    postData.push({
                                        _id: deviceInfo._id,
                                        prefix: deviceInfo.prefix,
                                        projectId: curRoom.projId,
                                        attrs: {FCUOnOffSet: switchTemp}
                                    });
                                    break;
                                }
                            }

                        });
                        sa(postData);
                    }
                } else {
                    postData = [{
                        _id: _this.device._id,
                        prefix: _this.device.prefix,
                        projectId: curRoom.projId,
                        attrs: {}
                    }];

                    if ($this.hasClass('btn-switch-on')) {
                        postData[0].attrs['FCUOnOffSet'] = 1;
                    } else {
                        postData[0].attrs['FCUOnOffSet'] = 0;
                    }
                    sa(postData);

                    //切换启停状态(好像没用了)
                    //if ($btnSwitch.hasClass('btn-switch-on')) {
                    //    $btnSwitch.removeClass('btn-switch-on').addClass('btn-switch-off');
                    //} else {
                    //    $btnSwitch.removeClass('btn-switch-off').addClass('btn-switch-on');
                    //}

                    _this.device.postData = postData;
                }

				var $deviceScreen = $('.deviceScreen', $divTemperature);
                var arrCommand = [];
                $deviceScreen.each(function (i, item) {
                    arrCommand.push({ controllerId: item.id.split('_')[1], switch: $(item).find('.opt-btn').hasClass('btn-switch-on') ? 1 : 0 });
                });
                curRoom.params.arrCommand = arrCommand;
                curRoom.params.mode = 10;
                curRoom.baseType = 'groups';
                saveMode([curRoom], 10);
                function saveMode(data, oldMode) {
                    WebAPI.post('/iot/setIotInfo', data).done(function (result) {
                        //好像没用
                        //if (result.data && result.data.length > 0) {
                        //for (var k in curRoom.params.arrCommand) {
                        //    if (curRoom.params.arrCommand[k].switch === 0) {
                        //        $('#containerMap #' + curRoom.params.arrCommand[k].controllerId).removeClass('off').addClass('off');
                        //    } else {
                        //        $('#containerMap #' + curRoom.params.arrCommand[k].controllerId).removeClass('off');
                        //    }
                        //}
                        //if(window.plugins){
                        //    mode && window.plugins.toast.show(I18n.resource.admin.pattern.SWITCHED + mode, 'short', 'center');
                        //}else{
                        //    mode && alert(I18n.resource.admin.pattern.SWITCHED + mode);
                        //}
                        //WebAPI.get('/appTemperature/room/mode/' + curRoom._id + '/' + curRoom.params.mode).done(function () {

                        //});
                        //console.log(_this.device)
                        //}else{
                        //设置模式失败,恢复房间原来的模式
                        //curRoom.params.mode = oldMode;
                        //if(window.plugins){
                        //    window.plugins.toast.show(I18n.resource.admin.pattern.SWITCHED_ERROR, 'short', 'center');
                        //}else{
                        //    alert(I18n.resource.admin.pattern.SWITCHED_ERROR);
                        //}
                        //}
                    });
                }

                function sa(postData) {
                    _this.setControllers(postData).done(function (result) {
                        if (result.data !== 'success') return;
                        //保存操作记录
						//var $deviceScreen = $('.deviceScreen', $divTemperature);
                        //var arrCommand = [];
                        //$deviceScreen.each(function (i, item) {
                        //    arrCommand.push({ controllerId: item.id.split('_')[1], switch: $(item).find('.opt-btn').hasClass('btn-switch-on') ? 1 : 0 });
                        //});
                        //curRoom.params.arrCommand = arrCommand;
                        //curRoom.params.mode = 10;
                        //curRoom.baseType = 'groups';
                        //saveMode([curRoom], 10);
                        saveRecord(postData);
                        //WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { dsItemIds: [_this.device.arrP['FCUSpeedD']] }).done(function (result) {
                        //    if (result && result.dsItemList && result.dsItemList.length == 1) {
                        //        $spanWs.text(result.dsItemList[0].data);
                        //    }
                        //}).always(function () {
                        //    Spinner.stop();
                        //});
                    });
                }

                function saveRecord(postData) {
                    var controllerParams = [];
                    for (var i = 0, len = postData.length; i < len; i++) {
                        controllerParams.push({_id: postData[i]._id, switch: postData[i].attrs['FCUOnOffSet']});
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
                }
            });

            //开关
            $btnSwitch.off('touchend').on('touchend', function () {
                //$divTemperature.off('touchend', '.ulCtrl .opt-btn,.divCheckAll').on('touchend', '.ulCtrl .opt-btn,.divCheckAll', function () {
                //只有手动模式,可以设置启停
                if (curRoom.params.mode != 10) {
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.indexMap.OPEN_CLOSE_INFO, 'short', 'center');
                    return;
                }
                var postData = [{
                    _id: _this.device._id,
                    prefix: _this.device.prefix,
                    projectId: curRoom.projId,
                    attrs: {}
                }];
                if ($(this).hasClass('btn-switch-on')) {
                    postData[0].attrs['FCUOnOffSet'] = 0;
                } else {
                    postData[0].attrs['FCUOnOffSet'] = 1;
                }
                //切换启停状态
                if ($btnSwitch.hasClass('btn-switch-on')) {
                    $btnSwitch.removeClass('btn-switch-on').addClass('btn-switch-off');
                } else {
                    $btnSwitch.removeClass('btn-switch-off').addClass('btn-switch-on');
                }

                _this.device.postData = postData;
                _this.setIntervalCtr(_this.device);
            });

            //设置风速
            $divItemWs.off('touchstart').on('touchstart', function () {
                //只有手动模式下可以设置风速
                if (curRoom.params.mode != 10) return;
                var $spanWs = $('#spanWs');
                $paneInfo.hide();
                var tpl = '\
                <div class="divBtnBottom"><button class="btn btn-default" id="btnCancel" i18n="admin.roomPage.CANCEL">取消</button><button class="btn btn-success" id="btnSave" i18n="admin.roomPage.SURE">确定</button></div>\
                <div style="padding: 30px 20px"><span id="spanWsVal" style="margin-left: 20px;text-align:center;">{wsVal}</span>\
                <input type="range" id="iptWsVal" min="1" max="5" step="1" value="{wsVal}"/></div>\
                    ';
                var wsVal = $spanWs.text();
                $paneConfig.html(tpl.formatEL({wsVal: wsVal}));
                I18n.fillArea($paneConfig);

                var $iptWsVal = $('#iptWsVal');

                $iptWsVal.off('change').on('change', function () {
                    $('#spanWsVal').text(this.value);
                });
                $('#btnSave').off('touchend').on('touchend', function () {
                    if (parseFloat($iptWsVal.val()) == parseFloat(wsVal)) return;

                    var postData = [{
                        _id: _this.device._id,
                        prefix: _this.device.prefix,
                        projectId: curRoom.projId,
                        attrs: {}
                    }];
                    postData[0].attrs['FCUSpeedDSet'] = parseFloat($iptWsVal.val());
                    $spanWs.text($iptWsVal.val());
                    //获取回执
                    Spinner.spin($('#divTemperature')[0]);
                    _this.setControllers(postData).done(function (result) {
                        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {dsItemIds: [_this.device.arrP['FCUSpeedD']]}).done(function (result) {
                            if (result && result.dsItemList && result.dsItemList.length == 1) {
                                $spanWs.text(result.dsItemList[0].data);
                            }
                        }).always(function () {
                            Spinner.stop();
                        });
                    });

                    $paneConfig.empty();
                    $paneInfo.show();
                });
                $('#btnCancel').off('touchend').on('touchend', function () {
                    $paneConfig.empty();
                    $paneInfo.show();
                });
            });
        },


        attachEventsTemp: function (gps) {
            var $btnSetWs = $('#divTemp');
            var $paneInfo = $('.paneInfo');
            var $paneConfig = $('.paneConfig');
            var $btnSetMode = $('#btnSetMode');

            var tplTempWs = '\
                    <div class="divBtnBottom"><button class="btn btn-default" id="btnCancel" i18n="admin.roomPage.CANCEL">取消</button><button class="btn btn-success" id="btnSave" i18n="admin.roomPage.SURE">确定</button></div>\
                    <div class="divSetItem">\
                        <span i18n="admin.controllers.TEMPERATURE">温度</span>\
                        <div class="divRange" style="">\
                            <div class="rangeSlider">\
                                <div class="rangeFill"></div>\
                                <div class="rangeCursor"></div>\
                            </div>\
                            <div class="divScale">\
                                <span id="iptTempVal">{tempVal}</span>\
                            </div>\
                        </div>\
                    </div>\
                    ';


            //设置温度
            $btnSetWs.off('touchstart').on('touchstart', function (e, temp) {
                //如果是女生优先模式,只有女生可以设,否则return
                if(curRoom.params.mode == 0){
                    if(AppConfig.userProfile.sex == 1){
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.indexMap.LADY_FIRST, 'short', 'center');
                        return;
                    }else if(AppConfig.userProfile.sex == ''){
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.indexMap.SEX_INFO_REQUIRE, 'short', 'center');
                        return;
                    }
                }
                //如果是节能模式,不可设置温度
                if (curRoom.params.mode == 1) {
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.indexMap.CURRENT_MODE, 'short', 'center');
                    return;
                }

                $paneInfo.hide();
                var tempVal = temp ? temp : $('#spanTemp').text().split('℃')[0];
                var left, $rangeCursor, $rangeSlider, $rangeFill;

                $paneConfig.html(tplTempWs.formatEL({tempVal: tempVal}));
                $rangeCursor = $('.rangeCursor');
                $rangeSlider = $('.rangeSlider');
                $rangeFill = $('.rangeFill');
                //初始化range
                tempVal = parseFloat(tempVal);
                left = (tempVal - 15) * ($rangeSlider.width() - 10)/15;// temp = fillWidth/rangeWidth* 15 + 15, rangeWidth = $rangeSlider.width() - 10;
                $rangeFill.width(left);
                $rangeCursor.css({left: left - 10});

                I18n.fillArea($paneConfig);

                //var $iptWsVal = $('#iptWsVal');
                var $iptTempVal = $('#iptTempVal');

                $('#btnSave').off('touchend').on('touchend', function () {
                    infoBox.confirm(I18n.resource.admin.indexMap.SET_TEMPERATURE, okCallback);
                    //if(confirm('确认设定温度?')){
                    //    okCallback();
                    //}
                    function okCallback() {
                        var postData = {
                            roomId: curRoom._id,
                            userId: AppConfig.userId,
                            gps: (function (gps) {
                                if (gps) {
                                    //gps 都转为数字
                                    for(var i = 0, l = gps.length; i < l; i++){
                                        gps[i] = Number(gps[i]);
                                    }
                                    if (gps.length == 2) {
                                        gps.push(0);
                                        return gps;
                                    } else if (gps.length == 3) {
                                        return gps;
                                    }
                                }
                                return [0, 0, 0];
                            }(gps))
                        };
                        var isNeedSave = false;
                        if (parseFloat(tempVal) != parseFloat($iptTempVal.text())) {
                            postData.temp = parseFloat($iptTempVal.text());
                            if (!isNaN(postData.temp)) {
                                isNeedSave = true;
                            } else {
                                isNeedSave = false;
                            }

                        }
                        if (!isNeedSave) return;

                        _this.setTemp(postData);
                        //返回上一个页面
                        $paneConfig.empty();
                        $paneInfo.show();
                    }
                });
                $('#btnCancel').off('touchend').on('touchend', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $paneConfig.empty();
                    $paneInfo.show();
                });
                var startX;
                $rangeSlider.off('touchstart').on('touchstart', function (e) {
                    startX = e.originalEvent.targetTouches[0].pageX;
                });
                $rangeSlider.off('touchmove').on('touchmove', function (e) {
                    var tempVal = Number($('#iptTempVal').text());
                    var newX = e.originalEvent.targetTouches[0].pageX;
                    var offsetLeft = newX - $rangeSlider[0].offsetLeft;
                    var left = offsetLeft;
                    var width = $rangeSlider.width();
                    if (newX > startX) {
                        left = Math.max(left, 0);
                        left = Math.min(left, width);
                        $rangeCursor.css({ left: left - 10 });
                        $rangeFill.width(left);
                        tempVal = left / width * 15+15;
                        tempVal = Math.min(tempVal, 30);
                    } else if (newX < startX) {
                        left = Math.min(left, width);
                        left = Math.max(left, 0);
                        $rangeCursor.css({ left: left - 10 });
                        $rangeFill.width(left);
                        tempVal = left / width * 15+15;
                        tempVal = Math.max(tempVal, 15);
                    }
                    $('#iptTempVal').text(tempVal.toFixed(1));
                    startX = newX;
                });
                //$rangeCursor.off('touchmove').on('touchmove', function (e) {
                //    var targetTouch = e.originalEvent.targetTouches[0];
                //    var newX = targetTouch.pageX - $rangeSlider[0].offsetLeft;
                //    var percent, tempVal;
                //    if(newX >= -5 && newX <= ($rangeSlider.width() - 10)){//
                //        $(this).css({left: newX});
                //        $rangeFill.width(newX + 5);
                //        percent = (newX+5)/($rangeSlider.width() - 5);
                //        tempVal = (15 + 15*percent).toFixed(1);
                //        $('#iptTempVal').text(tempVal);
                //    }
                //});
            });
        },

        //获取实时数据
        getArrPRealtimeData: function (device) {
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
            return WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {dsItemIds: arrId});
        },

        getarrPValById: function (arrData) {
            var arrPVal = {};
            //当前设备
            for (var j in this.device.arrP) {
                for (var i = 0; i < arrData.length; i++) {
                    if (arrData[i].dsItemId == this.device.arrP[j]) {
                        arrPVal[j] = arrData[i].data;
                        break;
                    }
                }
            }

            //如果是温度模式
            if (this.mode == 'temp') {
                for (var j in this.deviceCtr.arrP) {
                    for (var i = 0; i < arrData.length; i++) {
                        if (arrData[i].dsItemId == this.deviceCtr.arrP[j]) {
                            arrPVal[j] = arrData[i].data;
                            break;
                        }
                    }
                }
            }

            return arrPVal;
        },

        setControllers: function (arrData) {
            return WebAPI.post('/appTemperature/setControllers', arrData);
        },

        setTemp: function (data) {
            WebAPI.post('/appTemperature/temp/set', data).done(function (result) {
            })
        },
        //获取设备-控制器信息
        getCtrInfoByData: function (data) {
            var objTpl = {
                FCUAutoMode: '--',
                FCUBattery: '--',
                FCUOnOff: ' btn-switch-on',
                FCUSeasonMode: '--',
                FCUSignalStrength: '--',
                FCUSpeedD: '--',
                FCUValvePositionD: '--'
            }
            for (var i in objTpl) {
                if (i === 'FCUOnOff') {//启停
                    objTpl[i] = data[i] != 0 ? ' btn-switch-on' : ' btn-switch-off'
                } else if (i === 'FCUBattery') {//电量
                    var battery = parseInt(data[i]);
                    objTpl['battery'] = this.getDianliangLevel(battery);
                    objTpl[i] = data[i] ? parseInt(data[i]) : '';
                } else if (i === 'FCUSignalStrength') {//信号
                    var signal = parseInt(data[i]);
                    objTpl['signal'] = this.getXinhaoLevel(signal);
                    objTpl[i] = data[i] ? parseInt(data[i]) : '';
                } else if (i === 'FCUSeasonMode') {//季节模式
                    if (data[i] == 0) {
                        objTpl[i] = I18n.resource.admin.controllers.REFRIGERATION;
                    } else if (data[i] == 1) {
                        objTpl[i] = I18n.resource.admin.controllers.HEATING;
                    } else {
                        objTpl[i] = ' hidden';
                    }
                } else if (i === 'FCUAutoMode') {//手自动设定
                    if (data[i] == 0) {
                        objTpl[i] = I18n.resource.admin.controllers.HANDLE;
                    } else if (data[i] == 1) {
                        objTpl[i] = I18n.resource.admin.controllers.AUTO;
                    } else {
                        objTpl[i] = ' hidden';
                    }
                } else {
                    objTpl[i] = data[i] ? parseFloat(data[i]).toFixed(1) : ' hidden';
                }
            }
            objTpl.deviceName = _this.device.name;
            return objTpl;
        },

        //获取设备-传感器信息
        getTempInfoByData: function (data) {
            var objTpl = {
                SensorBattery: '--',
                SensorH: '--',
                SensorSignalStrength: '--',
                SensorT: '--'
            };
            for (var i in objTpl) {

                if (i === 'SensorBattery') {//电量
                    var battery = parseInt(data[i]);
                    objTpl['battery'] = this.getDianliangLevel(battery);
                    objTpl[i] = data[i] ? parseInt(data[i]) : '';
                } else if (i === 'SensorSignalStrength') {//信号
                    var signal = parseInt(data[i]);
                    objTpl['signal'] = this.getXinhaoLevel(signal);
                    objTpl[i] = data[i] ? parseInt(data[i]) : '';
                } else {
                    objTpl[i] = data[i] ? parseFloat(data[i]).toFixed(1) : ' hidden';
                }
            }
            objTpl.deviceName = _this.device.name;
            return objTpl;
        },
        searchDevice: function (type, id) {
            var arr = [];
            type = type.toLocaleLowerCase();
            switch (type) {
                case 'sensor':
                    arr = sensorAll;
                    break;
                case 'ctr':
                    arr = ctrAll;
                    break;
                default :
                    break;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]['_id'] == id) {
                    return arr[i];
                }
            }
            return false;
        },
        getDianliangLevel: function (battery) {
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

        getMode: function (modeNum) {
            var modeName = '';
            switch (modeNum) {
                case 0:
                    modeName = I18n.resource.admin.schedule.MS_FIRST;
                    break;
                case 1:
                    modeName = I18n.resource.admin.pattern.ENERGY_SAVING_MODE;
                    break;
                case 2:
                    modeName = I18n.resource.admin.pattern.COMFORTABLE_MODE;
                    break;
                case 10:
                    modeName = I18n.resource.admin.pattern.MANUAL_MODE;
                    break;
                default:
                    break;
            }
            return modeName;
        },

        getXinhaoLevel: function (signal) {
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
        },

        closeInfoPane: function () {
            $('#divTemperature').hide().empty();
        },

        setIntervalCtr: function (device) {
            var $prgState;// interval;
            Spinner.spin($('#divTemperature')[0]);
            var $btnSwitch = $('#btnSwitch');
            if (!device.delayTime) {
                device.delayTime = 500;
            }

            if (!device.postData) return;
            _this.setControllers(device.postData).done(function (result) {
                if (result.data !== 'success') return;
                //保存操作记录
                saveRecord();

                //进度条
                $('#divTemperature').append('<div class="progress" id="prgState"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> <span class="sr-only">40% Complete (success)</span> </div> </div>');
                $prgState = $('#prgState');
                if (device.interval) {
                    clearInterval(device.interval);
                }
                device.interval = setInterval(function () {
                    device.delayTime = device.delayTime - 0.5;
                    console.log(device.delayTime);
                    $prgState.children('.progress-bar').width((100 - 100 / 500 * _this.device.delayTime) + '%');
                    if (device.delayTime % 5 === 0) {//5s发送一次请求
                        getSwitchState();//获取开关状态回执
                    }
                    if (device.delayTime < 0 || isNaN(device.delayTime)) {
                        clearInterval(device.interval);
                        delete device.delayTime;
                        delete device.postData;
                        delete device.interval;
                        if (window.plugins) {
                            window.plugins.toast.show(I18n.resource.admin.indexMap.HANDOL_INFO, 'short', 'center');
                        } else {
                            alert(I18n.resource.admin.indexMap.HANDOL_INFO);
                        }
                        $prgState.remove();
                        Spinner.stop();
                        return;
                    }
                }, 500);
            });

            function saveRecord() {
                var hisData = {
                    gps: _this.device.params.gps,
                    time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                    userId: AppConfig.userId,
                    roomId: curRoom._id,
                    spaceId: '',
                    source: 0,
                    option: {},
                    controllerParams: [{_id: _this.device._id, switch: device.postData[0].attrs['FCUOnOffSet']}]
                }
                WebAPI.post('/appTemperature/insertHistoryOperation', hisData).done(function (rslt) {

                });
            }

            function getSwitchState() {
                WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {dsItemIds: [_this.device.arrP['FCUOnOff']]}).done(function (result) {
                    if (result && result.dsItemList && result.dsItemList.length == 1) {
                        //判断开关状态是否改为期望状态,如果已更改为期望状态,更新样式, 否则20s后再次获取开关状态; 再次判断, 若成功,更新样式,若失败,提示操作失败
                        if (result.dsItemList['0'].data == device.postData[0].attrs['FCUOnOffSet']) {
                            if (result.dsItemList['0'].data == 0) {
                                $btnSwitch.removeClass('btn-switch-on').addClass('btn-switch-off');
                            } else {
                                $btnSwitch.removeClass('btn-switch-off').addClass('btn-switch-on');
                            }
                            $prgState.remove();
                            Spinner.stop();
                            clearInterval(device.interval);
                            delete device.delayTime;
                            delete device.postData;
                            delete device.interval;
                        }
                    } else {
                        Spinner.stop();
                    }
                }).always(function () {
                });
            }
        },

        close: function () {
            if (this.workerUpdate) this.workerUpdate.terminate();
            $(ElScreenContainer).css('height', BomConfig.mainHeight);
            $('#topBlank').show();
            $('#btnBack', '#navTop').off('touchstart').on('touchstart', function (e) {
                router.back();
            });
        },

        showSetTempHistory: function(list, gps){
            var $divSetTempHis = $('#divSetTempHis').empty();
            var tpl = '<li class="liSetTemp">\
                <span class="urlImg"><img src="{urlImg}"/></span>\
                <span class="temp">{temp}℃</span>\
                <span class="time">{time}</span>\
                <span class="name">{name}</span>\
            </li>';
            var strHtml = '', utcDate, now = new Date();
            if(!list || !(list instanceof Array) || list.length === 0) return;

            list.forEach(function(record){
                utcDate = new Date(record.time);
                strHtml += (tpl.formatEL({
                    name: record.name,
                    urlImg: 'http://images.rnbtech.com.hk/' + record.urlImg,
                    time: DateUtil.getRelativeDateInfo(now, new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), utcDate.getUTCHours(), utcDate.getUTCMinutes(), utcDate.getUTCSeconds())),
                    temp: record.temp
                }));
            });
            $divSetTempHis.html(strHtml);

            $('.liSetTemp',$divSetTempHis).off('touchstart').on('touchstart', function(e){
                e.stopPropagation();
                e.preventDefault();
                $(this).addClass('active').siblings().removeClass('active');
                $(this).find('.name').css({left: -($(this).find('.name').width()+30)+'px'});
            });
            $('.liSetTemp',$divSetTempHis).off('touchend').on('touchend', function(e){
                e.stopPropagation();
                e.preventDefault();
                //$(this).removeClass('active');
                var temp = $(this).children('.temp').text();
                if(temp){
                    temp = temp.replace('℃', '');
                    temp = parseFloat(temp);
                    if(isNaN(temp)) return;
                    //跳转到温度设置页面
                    $('#divTemp').trigger('touchstart', temp);
                }
            });
        }
    };
    return ObserverScreen;
})();

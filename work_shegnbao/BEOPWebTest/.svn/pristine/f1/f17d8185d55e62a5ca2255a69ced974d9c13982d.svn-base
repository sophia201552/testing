/**
 * Created by win7 on 2015/9/14.
 */
var ObserverScreen = (function(){
    var _this;

    ObserverScreen.navOptions = {
        top: '<span id="roomName" class="topNavTitle"></span>\
              <span class="topNavRight" id="btnConfig">\
                  <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>\
              </span>',
        bottom: true,
        backDisable:false
    };

    function ObserverScreen(){
        _this = this;
        this.mapTool = undefined; //界面工具组对象
        this.mapConfig = undefined;//用户当前房间地图配置
        this.tempHis = undefined;
        this.deviceSize = {
            w:90,
            h:60
        };
        _this.mode = undefined;
        _this.dictClass = undefined;
        _this.workerUpdate = undefined;
    }
    ObserverScreen.prototype = {
        tplCtr: '\
                <div class="paneInfo paneInfo1">\
                    <div>\
                        <div class="divLabel">{deviceName}</div>\
                         <div class="divLabel"><span class="iconfont icon-medium icon-{FCUBattery}"></span></div>\
                        <div class="divLabel"><span class="iconfont icon-medium icon-{FCUSignalStrength}" style="margin-top: -5px;display: inline-block;"></span></div>\
                    </div>\
                    <div class="divItem"><span class="kaiguan">&#xe644;</span><span class="spanlabel">开关</span><div class="opt-btn{FCUOnOff}" id="btnSwitch" data-key=""><div class="btn-switch-slider"></div></div></div>\
                    <div class="divItem {FCUSpeedD}" id="divItemWs"><span class="fengsushezhi">&#xe647;</span><span class="spanlabel">风速</span><span id="spanWs">{FCUSpeedD}</span><span class="glyphicon glyphicon-menu-right" id="btnWs" style="color:#888;"></span></div>\
                    <div class="divItem {FCUAutoMode}" id=""><span class="glyphicon glyphicon-lamp" style="color:rgb(234, 193, 36);"></span><span class="spanlabel">手自动设定</span><span id="">{FCUAutoMode}</span></div>\
                    <div class="divItem {FCUSeasonMode}" id=""><span class="glyphicon glyphicon-grain"  style="color:rgb(92, 184, 92);"></span><span class="spanlabel">季节模式</span><span id="">{FCUSeasonMode}</span></div>\
                    <div class="divItem {FCUValvePositionD}" id=""><span class="glyphicon glyphicon-dashboard" style="color:#9199DA;"></span><span class="spanlabel">水阀开度</span><span id="">{FCUValvePositionD}</span></div>\
                    <div style="margin-top:8px;"><span class="btn btn-default" id="btnMatch">配对</span><span class="btn btn-default" id="btnHist">历史</span></div>\
                </div>\
                <div class="paneConfig"></div>',

        tplSensor: '\
                <div class="paneInfo paneInfo1">\
                    <div>\
                        <div class="divLabel">{deviceName}</div>\
                        <div class="divLabel"><span class="iconfont icon-{SensorBattery} icon-medium"></span></div>\
                        <div class="divLabel"><span class="iconfont icon-{SensorSignalStrength} icon-medium" style="margin-top: -5px;display: inline-block;"></span></div>\
                    </div>\
                    <div class="divItem {SensorT}" id=""><span class="iconfont icon-wenduchuanganqi icon-medium"  style="color:rgb(92, 184, 92);"></span><span class="spanlabel">温度</span><span id="">{SensorT}</span></div>\
                    <div class="divItem {SensorH}" id=""><span class="glyphicon glyphicon-tree-conifer" style="color:#9199DA;"></span><span class="spanlabel">湿度</span><span id="">{SensorH}</span></div>\
                    <div style="margin-top:8px;"><span class="btn btn-default" id="btnMatch">配对</span><span class="btn btn-default" id="btnHist">历史</span></div>\
                </div>\
                <div class="paneConfig"></div>',

        tplTemp: '\ <div class="paneInfo" style="position: relative; height: 100%;">\
                        <div class="shadow"></div>\
                        <div class="divTemp">\
                            <div id="btnSetTemp" class="li" style="position: relative;">\
                                <div class="a">\
                                    <div style="width: 100%; height: 100%; border: 1px dashed rgba(255, 255, 255, 0.5); border-radius: 50%;">\
                                        <div style="width: 9rem; height:7rem; margin: 0 auto 0 auto; padding-bottom: 0.5rem; border-bottom: 1.5px solid rgba(255, 255, 255, 0.40);">\
                                            <div style="width: 100%; height:100%; line-height: 9.8rem;">\
                                                <span id="spanTemp">{SensorT}</span><span>℃</span>\
                                            </div>\
                                        </div>\
                                        <div style="height: 5rem; line-height: 3rem;">\
                                            <span id="spanHumidity">{SensorH}</span><span>%</span>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <span class="iconfont icon-fengsushezhi" id="btnSetWs" style="left: calc(15% - 1.7rem)"></span>\
                        <span style="position: absolute; width: 3.4rem; bottom: 1.6em; left: calc(15% - 1.7rem); text-align: center;">{FCUSpeedA}</span>\
                        <span class="iconfont icon-nvshi" id="btnSetMode" style="right: calc(15% - 1.7rem)"></span>\
                    </div>\
                    <div class="paneConfig"></div>',

        show: function() {
            WebAPI.get('/static/app/temperatureControl/views/observer/observerScreen.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML).css('height',BomConfig.wrapHeight);
                $('#topBlank').hide();
                $('#containerMap').css(
                    {
                        'top':'-' + BomConfig.topHeight,
                        'padding-top': BomConfig.topHeight,
                        'padding-bottom':'15rem'
                    }
                );
                _this.init();
            });
        },
        init:function(){
            //获取用户roomList
            WebAPI.get('/appTemperature/room/getlist/' + AppConfig.userId).done(function (rs) {
                var findId, room;
                roomAll = rs.roomList;
                if(!roomAll || roomAll.length == 0){//如果没有房间权限,提示先关联房间
                    window.plugins && window.plugins.toast.show('请先关联房间');
                }
                // 查看是否存在用户选择的 room id
                if(AppConfig.roomId === undefined) {
                    // 检查缓存中是否有上一次打开的 roomId
                    findId = localStorage.getItem('lastOpenRoomId');
                } else {
                    findId = AppConfig.roomId;
                }

                if(!!findId) {
                    room = (function (id) {
                        var roomList = roomAll;
                        for(var i = 0, len = roomList.length; i < len; i++) {
                            if(roomList[i]['_id'] === id) {
                                return roomList[i];
                            }
                        }
                        return;
                    } (findId));
                }

                // 如果没找到上一次打开的 room，则默认进入第一个（合理？）
                if(!room) {
                    room = roomAll[0];
                }

                if(!!room) {
                    _this.mapConfig = room.params.map;
                    curRoom = room;

                    // 更新缓存中最近打开的 room 字段
                    localStorage.setItem('lastOpenRoomId', room['_id']);
                    AppConfig.roomId = room['_id'];
                } else {
                    return;
                }

                WebAPI.get('/iot/getClassFamily/thing/cn').done(function(result){
                    _this.dictClass = result;
                    _this.initNav();
                    _this.initMap();
                    _this.initMapTool();
                    _this.initRoom();
                    _this.initTempSet();
                    //设备切换功能绑定
                    _this.initToggle();
                    _this.clickZindex()
                })
            }).fail(function () {

            });
        },
        initWorkerUpdate:function(){
            this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function (e) {
                console.log(e)
            }, true);
            var pointList = {dsItemIds:[]};
            for (var i= 0 ; i < sensorAll.length ;i++){
                for (var ele in sensorAll[i].arrP){
                    pointList.dsItemIds.push(sensorAll[i].arrP[ele])
                }
            }
            for (var i= 0 ; i < ctrAll.length ;i++){
                for (var ele in ctrAll[i].arrP){
                    pointList.dsItemIds.push(ctrAll[i].arrP[ele])
                }
            }
            this.workerUpdate.postMessage({pointList: pointList.dsItemIds, type: "datasourceRealtime"});
        },
        refreshData:function(e){
            console.log(e);
            var tar;
            if(!e.data.dsItemList || e.data.dsItemList.length == 0) return;
            for (var i = 0; i < e.data.dsItemList.length; i++){
                tar = document.getElementById(e.data.dsItemList[i].dsItemId);
                if(tar)tar.innerHTML = e.data.dsItemList[i].data + '℃'
            }
        },
        //初始化上导航
        initNav: function () {
            if(typeof curRoom.name != 'undefined') {
                $('#roomName').text(curRoom.name)
            }
            // 配置按钮
            $('#btnConfig').off('touchstart').on('touchstart', function (e) {
                router.to({
                    typeClass: AdminConfigure
                });
                e.preventDefault();
            });            $('#btnBack', '#navTop').off('touchstart').on('touchstart', function (e) {
                router.to({
                    typeClass: ProjectSel
                });
                e.preventDefault();
            });
        },
        //初始化地图显示
        initMap:function(){
            var strMap = '<img id="imgMap" src="' + _this.mapConfig.img +'"/>';
            var divObserver = document.getElementById('divObserverMap');
            //$('#containerMap').append(strMap).css({
            //    'height':_this.mapConfig.height + 'px',
            //    'width':_this.mapConfig.width + 'px',
            //    'top':-_this.mapConfig.height/2 + divObserver.offsetTop / 2 +'px',
            //    'left':-_this.mapConfig.width/2 + divObserver.offsetLeft /2+'px'
            //});
            $('#containerMap').append(strMap).css({
                'height':'-webkit-calc(' + _this.mapConfig.height + 'px + ' + BomConfig.topHeight +' + 15rem)',
                'width':_this.mapConfig.width + 'px'
            });
            var $locateTool = $('#btnLocate');
            var $spanLocateTool = $('#spanLocateIcon');
            //this.mapConfig.offsetX = -_this.mapConfig.width/2 + divObserver.offsetLeft / 2;//地图相对于屏幕的偏移量
            //this.mapConfig.offsetY = -_this.mapConfig.height/2 + divObserver.offsetTop / 2;//地图相对于屏幕的偏移量
            this.mapConfig.offsetX = 0;//地图相对于屏幕的偏移量
            this.mapConfig.offsetY = 0;//地图相对于屏幕的偏移量
            this.mapConfig.scale = 1;//缩放比例
            this.mapConfig.imgX = 0;//指定点相对于地图的窗口坐标
            this.mapConfig.imgY = 0;//指定点相对于地图的窗口坐标
            this.mapConfig.mapX = 0; //指定点相对于房间地图的实际坐标
            this.mapConfig.mapY = 0; //指定点相对于房间地图的实际坐标
        },
        //初始化地图功能
        initMapTool: function(){
            _this.mapTool = new ObserverMap(this);
            _this.mapTool.show();
        },

        //初始化房屋配置信息
        initRoom:function(){
            WebAPI.get('/appTemperature/room/getDetail/' + curRoom['_id']).done(function(resultData){
                sensorAll = [];
                ctrAll = [];
                spaceAll = resultData.data.space;
                resultData.data.device.forEach(function(val){
                    if (val.type.indexOf('Sensor') > -1){
                        sensorAll.push(val)
                    }else{
                        ctrAll.push(val)
                    }
                });
                var strSensorAttr = _this.getDeviceAttr('sensor');
                var strCtrAttr = _this.getDeviceAttr('ctr');
                _this.initEquipments('Sensor', sensorAll, '<span class="iconfont icon-wenduchuanganqi"></span><span class="spVal" id="<%tempId%>"></span>', strSensorAttr);
                _this.initEquipments('Ctr', ctrAll, '<span class="iconfont icon-fengjipaiguan"></span>', strCtrAttr);
                //初始化控制器列表
                router.controlles = new Controllers();
                _this.initWorkerUpdate();
                //TODO 临时显示历史曲线的按钮
                $('#btnHistory').hammer().off('tap').on('tap', function(){
                    router.to({typeClass: HistoryChart})
                });
            })
        },
        initTempSet: function(){
            var $tempChange = $('.tempChange');
            var $locateTool = $('#btnLocate');
            var $spanLocateTool = $('#spanLocateIcon');
            var $tempSetValue = $('#tempSetValue');
            var $btnTempSet = $('#btnTempSet');
            var mapX,mapY,interval,setValue;
            $tempChange.off('touchstart').on('touchstart',function(e){
                interval = 1;
                setValue = Number($tempSetValue.html());
                if (e.currentTarget.id == 'tempRaise'){
                    setValue += interval;
                    $tempSetValue.html(setValue.toFixed(0));
                }else {
                    setValue -= interval;
                    $tempSetValue.html(setValue.toFixed(0));
                }
            });
            /*$btnTempSet.hammer().off('tap').on('tap',function(){
                var postDate = {gps: []};//_this.mapTool.getRealPos();
                var pos = _this.mapTool.getRealPos();
                var spaceId = _this.mapTool.getSpace();
                for(var i in pos){
                    postDate.gps.push(pos[i]);
                }
                if(!spaceId || spaceId == 'room') spaceId = curRoom._id;
                postDate.spaceId = spaceId;

                WebAPI.post('/appTemperature/location/getInfo',postDate).done(function(result){
                    _this.tempHis = result;
                    document.getElementById('divTemperatureShow').innerHTML = result.temp + '℃';
                    _this.initTempHis();
                })
            });*/
        },

        getTempHist: function(){
            var postDate = {gps: []};//_this.mapTool.getRealPos();
            var pos = _this.mapTool.getRealPos();
            var spaceId = _this.mapTool.getSpace();
            for(var i in pos){
                postDate.gps.push(pos[i]);
            }
            if(!spaceId || spaceId == 'room') spaceId = curRoom._id;
            postDate.spaceId = spaceId;
            WebAPI.post('/appTemperature/location/getInfo',postDate).done(function(result){
                _this.tempHis = result;
                return;
                //document.getElementById('divTemperatureShow').innerHTML = result.temp + '℃';
                _this.initTempHis();
            });
        },

        initTempHis:function(){
            if (_this.tempHis && _this.tempHis.list) {
                $('.divHis').remove();
                var divHis,spName,spVal,pos;
                var ctn = document.getElementById('containerMap');
                for (var i = 0; i < _this.tempHis.list.length; i++) {
                    divHis = document.createElement('div');
                    divHis.className = 'divHis divUnit';
                    divHis.dataset.userId = _this.tempHis.list[i].userId;

                    spName = document.createElement('span');
                    spName.className = 'spUserName';
                    spName.textContent = _this.tempHis.list[i].name;

                    spVal = document.createElement('span');
                    spVal.className = 'spHisVal';
                    spVal.textContent = _this.tempHis.list[i].temp;

                    pos = _this.mapTool.getScreenPos({
                        x:_this.tempHis.list[i].gps[0],
                        y:_this.tempHis.list[i].gps[1]
                    });
                    divHis.style.left = pos.x + 'px';
                    divHis.style.top = pos.y + 'px';

                    divHis.appendChild(spName);
                    divHis.appendChild(spVal);
                    ctn.appendChild(divHis);
                }
            }
        },

        //初始化设备显示
        initEquipments: function(type,list,strIcon,strAttr){
            //设备值初始化
            var ctn = document.getElementById('containerMap');
            var divEquip,spIcon,spAttr,strTemp;
            for (var i = 0 ; i < list.length ; i++){
                divEquip = document.createElement('div');
                divEquip.className = 'divUnit divEquip div'+ type;
                divEquip.id = list[i]['_id'];
                divEquip.dataset.type = type.toLocaleLowerCase();

                spIcon = document.createElement('div');
                spIcon.className = 'spIcon';
                if (spIcon) {
                    if (list[i].arrP['SensorT']){
                        strTemp = strIcon.replace('<%tempId%>',list[i].arrP['SensorT'])
                    }else{
                        strTemp = strIcon.replace('<%tempId%>','')
                    }
                    spIcon.innerHTML = strTemp
                }
                spAttr = document.createElement('span');
                spAttr.className = ' spAttr';
                if (spAttr) {
                    spAttr.innerHTML = strAttr
                }
                divEquip.appendChild(spIcon);
                divEquip.appendChild(spAttr);

                switch (type){
                    case 'Sensor':
                        divEquip.style.left = list[i].params.gps[0] - _this.deviceSize.w / 2 + 'px';
                        divEquip.style.top = list[i].params.gps[1] -_this.deviceSize.h / 2 + _this.mapTool.mapScreenTop + 'px';
                        break;
                    case 'Ctr':
                        divEquip.style.left = list[i].params.gps[0] - _this.deviceSize.w / 2+ 'px';
                        divEquip.style.top = list[i].params.gps[1]  - _this.deviceSize.h / 2 + _this.mapTool.mapScreenTop + 'px';
                        break;
                }
                $(divEquip).hammer().on('tap',function(e){
                    _this.initEquipDetail(e.currentTarget.id, e.currentTarget.dataset.type);
                });
                ctn.appendChild(divEquip);
            }
            _this.clickZindex();
        },
        initEquipDetail:function(id, type, gps){
            var $divTemperature = $('#divTemperature');
            var tpl = undefined;
            this.device = undefined;

            //$('#divObserverMap').css('height', 'calc(100% - 15rem)');
            $divTemperature.show();
            _this.mapTool.mapConfig.mapScreenBottom = $divTemperature[0].offsetHeight;

            //查找当前设备, 保存详细信息到this.device
            if(this.mode == "device" && type == 'ctr'){
                if(ctrAll && ctrAll.length > 0){
                    for(var i = 0; i < ctrAll.length; i++){
                        if(id == ctrAll[i]._id){
                            this.device = ctrAll[i];
                            break;
                        }
                    }
                }
            }else{
                if(sensorAll && sensorAll.length > 0){
                    for(var i = 0; i < sensorAll.length; i++){
                        if(id == sensorAll[i]._id){
                            this.device = sensorAll[i];
                            break;
                        }
                    }
                }
            }
            if(!this.device) return;

            //获取实时数据
            if(this.device.arrP && !$.isEmptyObject(this.device.arrP)){
                _this.getArrPRealtimeData(this.device).done(function(result){
                    var objTpl;
                    var data = _this.getarrPValById(result.dsItemList);


                    if(_this.mode == "temp"){
                        $divTemperature.html(tpl.formatEL({
                            SensorH: data['SensorH'] ? data['SensorH'] : '39',
                            SensorT: data['SensorT'] ? parseFloat(data['SensorT']).toFixed(1) : '--',
                            FCUSpeedA: data['FCUSpeedA'] ? data['FCUSpeedA'] : '--',
                            mode: '女士优先'
                        }));
                        _this.attachEventsTemp(gps);
                    }else{
                        if(_this.device.type.indexOf('Controller') > -1){
                            objTpl = _this.getCtrInfoByData(data);
                        }else{
                            objTpl = _this.getTempInfoByData(data);
                        }
                        $divTemperature.html(tpl.formatEL(objTpl));
                        _this.attachEventsDevice();
                    }
                });
            }


            if(this.mode == "device"){//设备模式
                if(type == 'sensor'){
                    tpl = this.tplSensor;
                    $divTemperature.html(tpl.formatEL({
                        deviceName: '--',
                        SensorBattery: '--',
                        SensorH: '--',
                        SensorSignalStrength: '--',
                        SensorT: '--'
                    }));
                }else{
                    tpl = this.tplCtr;
                    $divTemperature.html(tpl.formatEL({
                        deviceName: '--',
                        FCUAutoMode: '--',
                        FCUBattery: '--',
                        FCUOnOff: ' btn-switch-on',
                        FCUSeasonMode: '--',
                        FCUSignalStrength: '--',
                        FCUSpeedD: '--',
                        FCUValvePositionD: '--'
                    }));
                }

            }else if(this.mode == "temp"){
                tpl = this.tplTemp;
                $divTemperature.html(tpl.formatEL({
                    SensorH: '--',
                    SensorT: '--',
                    FCUSpeedA: '--',
                    mode: 0
                }));
            }


        },
        getDeviceAttr:function(type){
            var spBattery = '<span class="spBattery iconfont icon-dianliangtiaoman"></span>';
            var spAttr = '<span class="spBatteryVal " >-</span>';
            var spNet = '<span class="spNet iconfont icon-xinhaoman"></span>';

            return spBattery + spAttr + spNet ;
        },

        clickZindex:function(){
            var $divUnit=$('.divUnit');
            $divUnit.on('touchstart',function(){
                $divUnit.removeClass("selected");
                $(this).addClass("selected");
            })
        },

        //初始化设备切换

        initToggle:function(){
            var $btnMode = $('.btnMode');
            var $btnShowTable = $('#btnShowTable');
            var $btnDevice = $('#btnDeviceMode');
            var $btnTemp = $('#btnTempMode');
            var $btnHistory = $('#btnHistory');
            var $ctnScreen = $('#divObserverMap');
            $btnMode.on('touchstart',function(e){
                if (!$(e.currentTarget).hasClass('selected')){
                    $btnMode.removeClass('selected');
                    $(e.currentTarget).addClass('selected');
                    if ($(e.currentTarget)[0].id == 'btnTempMode'){
                        $ctnScreen.removeClass('deviceMode').addClass('tempMode');
                        $('.divSensor').addClass('tempMode');
                        $('.divCtr').css('display','none');
                        $btnShowTable.hide();
                        router.controlles && router.controlles.close();
                        $($btnShowTable).addClass('notShow');
                        _this.mode = 'temp';
                    }else{
                        $ctnScreen.removeClass('tempMode').addClass('deviceMode');
                        $('.divSensor').removeClass('tempMode');
                        $('.divCtr').css('display','block');
                        $btnShowTable.show();
                        $btnShowTable.hammer().off('tap').on('tap', function(){
                            //跳转到表格页面
                            router.to({
                                typeClass: Controllers
                            });
                        });
                        _this.mode = 'device'
                    }
                }
            });
            //切换事件绑定
            //$btnDevice.on('touchstart',function(e){
            //    if($(e.currentTarget).hasClass('sensorShow')){
            //        $(e.currentTarget).removeClass('sensorShow');
            //        $('.divSensor').css('display','none');
            //        $('.divCtr').css('display','block');
            //        //显示设备列表
            //
            //        $btnShowTable.show();
            //        $btnShowTable.hammer().off('tap').on('tap', function(){
            //            //跳转到表格页面
            //            router.to({
            //                typeClass: Controllers
            //            })
            //            /*if($(this).hasClass('notShow')){
            //                router.controlles.showController({style: 'position: absolute;top: 55px;background-color: #fff;right: 0;'});
            //                $(this).text('隐藏表格').removeClass('notShow');
            //            }else{
            //                router.controlles.close();
            //                $(this).text('显示表格').addClass('notShow');
            //            }*/
            //        });
            //    }else{
            //        $(e.currentTarget).addClass('sensorShow');
            //        $('.divSensor').css('display','block');
            //        $('.divCtr').css('display','none');
            //        $btnShowTable.hide();
            //        router.controlles && router.controlles.close();
            //        $($btnShowTable).text('显示表格').addClass('notShow');
            //    }
            //});
            //温度模式,和设备相关的都隐藏
            //$btnTemp.on('touchstart', function(e){
            //    $btnDevice.removeClass('sensorShow');
            //    $('.divSensor').css('display','none');
            //    $('.divCtr').css('display','none');
            //    $btnHistory.hide();
            //    $btnShowTable.hide();
            //    router.controlles.close();
            //    $($btnShowTable).text('显示表格').addClass('notShow');
            //})
            //初始为设备-传感器显示模式
            //$btnDevice.addClass('selected sensorShow');
            $btnTemp.trigger('touchstart');

            //权限
            if(curRoom && curRoom.grade === 0) $btnDevice.hide();
            
        },

        attachEventsDevice: function(){
            var $btnSwitch = $('#btnSwitch');
            var $divItemWs = $('#divItemWs');
            var $btnMatch = $('#btnMatch');
            var $btnHist = $('#btnHist');
            var $paneInfo = $('.paneInfo');
            var $paneConfig = $('.paneConfig');

            //开关
            $btnSwitch.off('touchend').on('touchend', function(){
                var postData = [{_id: _this.device._id, prefix: _this.device.prefix, projectId: curRoom.projId, attrs: {}}];
                if($(this).hasClass('btn-switch-on')){
                    $(this).removeClass('btn-switch-on').addClass('btn-switch-off');
                    postData[0].attrs['FCUOnOffSet'] = 0;
                }else{
                    $(this).removeClass('btn-switch-off').addClass('btn-switch-on');
                    postData[0].attrs['FCUOnOffSet'] = 1;
                }
                Spinner.spin($('#divTemperature')[0]);
                _this.setControllers(postData).done(function(result){
                    WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds: [_this.device.arrP['FCUOnOff']]}).done(function(result){
                        if(result && result.dsItemList && result.dsItemList.length == 1){
                            if(result.dsItemList[0].data == 0){
                                $btnSwitch.removeClass('btn-switch-on').addClass('btn-switch-off');
                            }else{
                                $btnSwitch.removeClass('btn-switch-off').addClass('btn-switch-on');
                            }
                        }
                    }).always(function(){
                        Spinner.stop();
                    });
                });
            });

            //设置风速
            $divItemWs.off('touchstart').on('touchstart', function(){
                var $spanWs = $('#spanWs');
                $paneInfo.hide();
                var tpl = '\
                <div class="divBtnBottom"><button class="btn btn-default" id="btnCancel">取消</button><button class="btn btn-success" id="btnSave">确定</button></div>\
                <span id="spanWsVal" style="margin-left: 20px;text-align:center;">{wsVal}</span>\
                <input type="range" id="iptWsVal" min="1" max="5" step="1" value="{wsVal}"/>\
                    ';
                var wsVal = $spanWs.text();
                $paneConfig.html(tpl.formatEL({wsVal: wsVal}));

                var $iptWsVal = $('#iptWsVal');

                $iptWsVal.off('change').on('change', function(){
                    $('#spanWsVal').text(this.value);
                });
                $('#btnSave').off('touchend').on('touchend', function(){
                    if(parseFloat($iptWsVal.val()) == parseFloat(wsVal)) return;

                    var postData = [{_id: _this.device._id, prefix: _this.device.prefix, projectId: curRoom.projId, attrs: {}}];
                    postData[0].attrs['FCUSpeedDSet'] = parseFloat($iptWsVal.val());
                    //_this.setControllers(postData);
                    $spanWs.text($iptWsVal.val());
                    Spinner.spin($('#divTemperature')[0]);
                    _this.setControllers(postData).done(function(result){
                        WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds: [_this.device.arrP['FCUSpeedD']]}).done(function(result){
                            if(result && result.dsItemList && result.dsItemList.length == 1){
                                $spanWs.text(result.dsItemList[0].data);
                            }
                        }).always(function(){
                            Spinner.stop();
                        });
                    });

                    $paneConfig.empty();
                    $paneInfo.show();
                });
                $('#btnCancel').off('touchend').on('touchend', function(){
                    $paneConfig.empty();
                    $paneInfo.show();
                });
            });

            //配对
            $btnMatch.off('touchend').on('touchend', function(){
                if (typeof cordova != 'undefined') {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            console.log("We got a barcode\n" +
                                "Result: " + result.text + "\n" +
                                "Format: " + result.format + "\n" +
                                "Cancelled: " + result.cancelled);
                            _this.device.params.gateway = result.text;
                            WebAPI.post('setIotInfo',_this.device).done(function(){
                                window.plugins.toast.show('关联成功，网关为' + result.text, 'short', 'center');
                            });
                        },
                        function (error) {
                            console.log("Scanning failed: " + error);
                        }
                    );
                }else {
                }
            });

            //查看历史
            $btnHist.off('touchend').on('touchend', function(){
                router.to({
                    typeClass: HistoryChart,
                    data: {ids: [_this.device.arrP.SensorT]}//todo 数据源id
                })
            });
        },


        attachEventsTemp: function(gps){
            var $btnSetWs = $('#btnSetWs');
            var $btnSetMode = $('#btnSetMode');
            var $btnSetTemp = $('#btnSetTemp');
            var $paneInfo = $('.paneInfo');
            var $paneConfig = $('.paneConfig');

            var tplTempWs = '\
                    <div class="divBtnBottom"><button class="btn btn-default" id="btnCancel">取消</button><button class="btn btn-success" id="btnSave">确定</button></div>\
                    <div class="divSetItem">\
                        <label id="spanTempVal" for="iptTempVal" style="">温度</label>\
                        <div style="display: inline-block;text-align: center;width: calc(100% - 70px);">\
                            <span class="glyphicon glyphicon-minus" id="btnMinusTemp"></span><span id="iptTempVal">{tempVal}</span><span class="glyphicon glyphicon-plus" id="btnPlusTemp"></span>\
                        </div>\
                    </div>\
                    <div class="divSetItem">\
                        <label for="iptWsVal">风速</label>\
                        <input type="range" id="iptWsVal" min="1" max="5" step="1" value="{wsVal}" style="display: inline-block;width: calc(100% - 60px);margin-left: 20px;"/>\
                    </div>\
                    ';

            //设置风速,温度
            $btnSetWs.off('touchstart').on('touchstart', function(){
                //获取历史温度
                _this.getTempHist();
                $paneInfo.hide();
                var wsVal = $(this).next('span').text();
                var tempVal = $('#spanTemp').text().split('℃')[0];

                $paneConfig.html(tplTempWs.formatEL({wsVal: wsVal, tempVal: tempVal}));

                var $iptWsVal = $('#iptWsVal');
                var $iptTempVal = $('#iptTempVal');
                $iptWsVal.off('change').on('change', function(){
                    $('#spanWsVal').text(this.value);
                });
                $('#btnSave').off('touchend').on('touchend', function(){
                    var postData = {
                        prefix: _this.deviceCtr.prefix,
                        projectId: curRoom.projId,
                        attrs: {},
                        controllerId: _this.device._id,
                        roomId: curRoom._id,
                        spaceId: _this.mapTool.getSpace(),
                        gps: gps,
                        userId: AppConfig.userId
                    };
                    var isNeedSave = false;
                    if(parseFloat(wsVal) != parseFloat($iptWsVal.val())){
                        postData.attrs['FCUSpeedDSet'] = parseFloat($iptWsVal.val());
                        isNeedSave = true;
                    }
                    if(parseFloat(tempVal) != parseFloat($iptTempVal.text())){
                        postData.attrs['FCUTSet'] = parseFloat($iptTempVal.text());
                        isNeedSave = true;
                    }
                    if(!isNeedSave) return;

                    _this.setTemp(postData);
                    //返回上一个页面
                    $paneConfig.empty();
                    $paneInfo.show();
                });
                $('#btnCancel').off('touchend').on('touchend', function(){
                    //返回上一个页面
                    $paneConfig.empty();
                    $paneInfo.show();
                });

                $('#btnPlusTemp').off('touchend').on('touchend', function(){
                    var tempVal = parseFloat($iptTempVal.text());
                    if(tempVal < 40){
                        //$iptTempVal.text(Math.round(tempVal) + 1);
                        $iptTempVal.text(Math.floor(tempVal) + 1);
                    }
                });
                $('#btnMinusTemp').off('touchend').on('touchend', function(){
                    var tempVal = parseFloat($iptTempVal.text());
                    if(tempVal > 0){
                        //$iptTempVal.text(Math.round(tempVal) - 1);
                        $iptTempVal.text(Math.ceil(tempVal) - 1);
                    }
                });
            });

            //设置模式
            $btnSetMode.off('touchstart').on('touchstart', function(){
                $paneInfo.hide();
                var tpl = '\
                    <div id="divModeList">\
                        <button class="btn btn-default" id="btnLadies">女士优先</button>\
                        <button class="btn btn-default" id="btnComfortable">舒适模式</button>\
                        <button class="btn btn-default" id="btnEnergySave">节能模式</button>\
                    </div>\
                    <div class="divBtnBottom"><button class="btn btn-default" id="btnCancel">取消</button><button class="btn btn-success" id="btnSave">确定</button></div>';

                $paneConfig.html(tpl.formatEL({wsVal: 60}));
                $('#divModeList .btn').off('touchend').on('touchend', function(){
                    $(this).addClass('btn-success').siblings('.btn').removeClass('btn-success');
                });
                $('#btnSave').off('touchend').on('touchend', function(){
                    $paneConfig.empty();
                    $paneInfo.show();
                });
                $('#btnCancel').off('touchend').on('touchend', function(){
                    $paneConfig.empty();
                    $paneInfo.show();
                });
            });

            //设置温度
            $btnSetTemp.off('touchstart').on('touchstart', function(){
                $btnSetWs.trigger('touchstart');
            });
        },

        //获取实时数据
        getArrPRealtimeData: function(device){
            var arrId = [];
            for(var i in device.arrP){
                arrId.push(device.arrP[i]);
            }
            if(this.mode == 'temp' && this.device.params.cId){
                for(var j = 0; j < ctrAll.length; j++){
                    if(this.device.params.cId == ctrAll[j]._id){
                        this.deviceCtr = ctrAll[j];
                        for(var i in ctrAll[j].arrP){
                            arrId.push(ctrAll[j].arrP[i]);
                        }
                        break;
                    }
                }
            }
            if(arrId.length == 0) return;
            return WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds: arrId});
        },

        getarrPValById: function(arrData){
            var arrPVal = {}
            /*for(var i = 0; i < arrData.length; i++){
                for(var j in this.device.arrP){
                    if(arrData[i].dsItemId == this.device.arrP[j]){
                        arrPVal[j] = arrData[i].data;
                        break;
                    }
                }
            }*/

            //当前设备
            for(var j in this.device.arrP){
                for(var i = 0; i < arrData.length; i++){
                    if(arrData[i].dsItemId == this.device.arrP[j]){
                        arrPVal[j] = arrData[i].data;
                        break;
                    }
                }
            }

            //如果是温度模式
            if(this.mode == 'temp'){
                for(var j in this.deviceCtr.arrP){
                    for(var i = 0; i < arrData.length; i++){
                        if(arrData[i].dsItemId == this.deviceCtr.arrP[j]){
                            arrPVal[j] = arrData[i].data;
                            break;
                        }
                    }
                }
            }

            return arrPVal;
        },

        setControllers: function(arrData){
            return WebAPI.post('/appTemperature/setControllers',arrData);
        },

        setTemp: function(data){
            WebAPI.post('/appTemperature/temp/set',data).done(function(result){

            })
        },
        //获取设备-控制器信息
        getCtrInfoByData: function(data){
            var objTpl = {
                FCUAutoMode: '--',
                FCUBattery: '--',
                FCUOnOff: ' btn-switch-on',
                FCUSeasonMode: '--',
                FCUSignalStrength: '--',
                FCUSpeedD: '--',
                FCUValvePositionD: '--'
            }
            for(var i in objTpl){
                if(i === 'FCUOnOff'){//启停
                    objTpl[i] = data[i] != 0 ? ' btn-switch-on' : ' btn-switch-off'
                }else if(i === 'FCUBattery'){//电量
                    var className = 'dianliangtiaoman';
                    var battery = parseFloat(data[i]);

                    if (battery > 90){
                        className = 'dianliangtiaoman';
                    }else if(battery > 50){
                        className = 'dianliangtiao3';
                    }else if(battery > 25){
                        className = 'dianliangtiao2';
                    }else if(battery > 10){
                        className = 'dianliangtiao1';
                    }

                    objTpl[i] = className;
                }else if(i === 'FCUSignalStrength'){//信号
                    var className = 'xinhaoman';
                    var signal = parseFloat(data[i]);

                    if (signal > 90){
                        className = 'xinhaoman';
                    }else if(signal > 50){
                        className = 'xinhao3';
                    }else if(signal > 25){
                        className = 'xinhao2';
                    }else if(signal > 10){
                        className = 'xinhao1';
                    }
                    objTpl[i] = className;
                }else if(i === 'FCUSeasonMode'){//季节模式
                    if(data[i] == 0){
                        objTpl[i] = '制冷';
                    }else if(data[i] == 1){
                        objTpl[i] = '制热';
                    }else{
                        objTpl[i] = ' hidden';
                    }
                }else if(i === 'FCUAutoMode'){//手自动设定
                    if(data[i] == 0){
                        objTpl[i] = '手动';
                    }else if(data[i] == 1){
                        objTpl[i] = '自动';
                    }else{
                        objTpl[i] = ' hidden';
                    }
                }else{
                    objTpl[i] = data[i] ? data[i] : ' hidden';
                }
            }
            objTpl.deviceName = _this.device.name;
            return objTpl;
        },

        //获取设备-传感器信息
        getTempInfoByData: function(data){
            var objTpl = {
                SensorBattery: '--',
                SensorH: '--',
                SensorSignalStrength: '--',
                SensorT: '--'
            };
            for(var i in objTpl){

                if(i === 'SensorBattery'){//电量
                    var className = 'dianliangtiaoman';
                    var battery = parseFloat(data[i]);

                    if (battery > 90){
                        className = 'dianliangtiaoman';
                    }else if(battery > 50){
                        className = 'dianliangtiao3';
                    }else if(battery > 25){
                        className = 'dianliangtiao2';
                    }else if(battery > 10){
                        className = 'dianliangtiao1';
                    }

                    objTpl[i] = className;
                }else if(i === 'SensorSignalStrength'){//信号
                    var className = 'xinhaoman';
                    var signal = parseFloat(data[i]);

                    if (signal > 90){
                        className = 'xinhaoman';
                    }else if(signal > 50){
                        className = 'xinhao3';
                    }else if(signal > 25){
                        className = 'xinhao2';
                    }else if(signal > 10){
                        className = 'xinhao1';
                    }
                    objTpl[i] = className;
                }else{
                    objTpl[i] = data[i] ? data[i] : ' hidden';
                }
            }
            objTpl.deviceName = _this.device.name;
            return objTpl;
        },

        close:function(){
            if (this.workerUpdate) this.workerUpdate.terminate();
            $(ElScreenContainer).css('height',BomConfig.mainHeight);
            $('#topBlank').show();
            $('#btnBack', '#navTop').off('touchstart').on('touchstart', function (e) {
                router.back();
            });
        }
    };
    return ObserverScreen;
})();

/**
 * Created by win7 on 2015/9/14.
 */
var ObserverScreen = (function(){
    var _this;

    ObserverScreen.navOptions = {
        top: true,
        bottom: true
    };

    function ObserverScreen(){
        _this = this;
        this.mapConfig = undefined;//用户当前房间地图配置
        this.roomConfig = undefined;//用户当前房间配置
        this.room = undefined;//当前房间信息
        this.spaceList = undefined;//空间列表
        this.equipList = undefined;//用户设备列表
        this.sensorConfig = undefined;//传感器初始温度
        this.controllerConfig = undefined;//控制器初始配置

    }
    ObserverScreen.prototype = {
        show: function() {
            WebAPI.get('/static/app/temperatureControl/views/observer/observerScreen.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        },
        init:function(){
            var findId, room;
            // 查看是否存在用户选择的 room id
            if(AppConfig.roomId === undefined) {
                // 检查缓存中是否有上一次打开的 roomId
                findId = localStorage.getItem('lastOpenRoomId');
            } else {
                findId = AppConfig.roomId;
            }

            if(!!findId) {
                room = (function (id) { 
                    var roomList = AppConfig.roomList;
                    for(var i = 0, len = roomList.length; i < len; i++) {
                        if(roomList[i].id === id) {
                            return roomList[i];
                        }
                    }
                    return; 
                } (findId));
            }
            
            // 如果没找到上一次打开的 room，则默认进入第一个（合理？）
            if(!room) {
                room = AppConfig.roomList[0];
            }

            if(!!room) {
                _this.mapConfig = room.map;
                _this.room = room;

                // 更新缓存中最近打开的 room 字段
                localStorage.setItem('lastOpenRoomId', room.id);
            } else {
                return;
            }

            _this.initNav();
            _this.initMap();
            _this.initMapTool();
            _this.initRoom();
            _this.initTempSet();
            _this.initTempShow();
        },
        initNav: function () {
            var $navBottom = $('#navBottom');
            var $navTop = $('#navTop');
            var $navTitle = $('.nav-title', $navTop);
            var title = (function (room) {
                var buildingList = AppConfig.buildingList;
                for (var i = 0, len = buildingList.length; i < len; i++) {
                    if(buildingList[i].id === room.buildingId) {
                        break;
                    }
                }
                if( i < len ) {
                    return buildingList[i].name+' '+room.name;
                } else {
                    return room.name;
                }
            }).call(this, this.room);

            $('.btn-config', $navBottom).show();
            $('.btn-mapsel', $navBottom).show();
            $navTitle.text(title).show();
        },

        //初始化地图显示
        initMap:function(){
            var strMap = '<img id="imgMap" src="' + _this.mapConfig.img +'"/>';
            $('#containerMap').append(strMap).css({
                'height':_this.mapConfig.height + 'px',
                'width':_this.mapConfig.width + 'px'
            });
            var $locateTool = $('#btnLocate');
            var $spanLocateTool = $('#spanLocateIcon');
            this.mapConfig.offsetX = 0;//地图相对于屏幕的偏移量
            this.mapConfig.offsetY = 0;//地图相对于屏幕的偏移量
            this.mapConfig.scale = 1;//缩放比例
            this.mapConfig.screenX = $locateTool[0].offsetLeft + $spanLocateTool.width()/2;//指定点相对于容器的坐标
            this.mapConfig.screenY = $locateTool[0].offsetTop + $spanLocateTool.height();//指定点相对于容器的坐标
            this.mapConfig.imgX = this.mapConfig.offsetX + this.mapConfig.screenX;//指定点相对于容器的坐标
            this.mapConfig.imgY = this.mapConfig.offsetY + this.mapConfig.screenY;//指定点相对于容器的坐标
            this.mapConfig.mapX = 0; //指定点相对于房间地图的坐标
            this.mapConfig.mapY = 0; //指定点相对于房间地图的坐标
        },
        //初始化地图功能
        initMapTool: function(){
            new ObserverMap(this).show();
        },
        //初始化房屋配置信息
        initRoom:function(){
            WebAPI.get('/appTemperature/room/getDetail/' + _this.room.id).done(function(resultData){
                _this.roomConfig = resultData;
                _this.equipList = {
                    sensor:_this.roomConfig.sensors,
                    controller:_this.roomConfig.controllers
                };
                _this.spaceList = _this.roomConfig.spaces;
                _this.initEquipments();
            })
        },
        initTempSet: function(){
            var $tempChange = $('.tempChange');
            var $locateTool = $('#btnLocate');
            var $spanLocateTool = $('#spanLocateIcon');
            var $tempSetValue = $('#tempSetValue');
            var $tempSetSure = $('#tempSetSure');
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
            $tempSetSure.off('touchstart').on('touchstart',function(e){
                mapX = (-_this.mapConfig.offsetX + $locateTool[0].offsetLeft + $spanLocateTool.width()/2)/_this.mapConfig.scale;
                mapY = (-_this.mapConfig.offsetY + $locateTool[0].offsetTop + $spanLocateTool.height())/_this.mapConfig.scale;
                for (var i = 0;i < _this.spaceList.length;i++){
                    if (_this.spaceList[i].x < mapX && _this.spaceList[i].x +  _this.spaceList[i].width> mapX && _this.spaceList[i].y < mapY && _this.spaceList[i].y +  _this.spaceList[i].height> mapY){
                        alert(_this.spaceList[i].name);
                        var post = {
                            userId: '', //操作人
                            roomId: _this.room.id,
                            spaceId: _this.spaceList[i]._id, //前端根据所选点 计算出所在space
                            x: mapX, //相对于地图左上角坐标，不是相对于space坐标
                            y: mapY,
                            value: setValue,

                            gateway:AppConfig.roomList[0].gateway,
                            sensors: _this.roomConfig.sensors, // space内的， sensor（传感器）的数组

                            controllers: _this.roomConfig.controllers // space内的， controller（控制器）的数组
                        };
                        WebAPI.post('/appTemperature/setTemperature',post).done(function(result){
                            var resultTemp = result;
                            $('#divTemperatureShow').text(50 + '℃');
                        });
                        break;
                    }
                }
            })
        },
        //initTempSet:function(){
        //    var $btnTempSet = $('#inputTempSet');
        //    var $locateTool = $('#btnLocate');
        //    var $spanLocateTool = $locateTool.find('span');
        //    var setValue,mapX,mapY;
        //    $btnTempSet.off('touchmove').on('touchmove',function(e){
        //        $btnTempSet.prev().text($btnTempSet.val());
        //    });
        //    $btnTempSet.off('touchend').on('touchend',function(e){
        //        setValue = $(e.currentTarget).val();
        //        mapX = (-_this.mapConfig.offsetX + $locateTool[0].offsetLeft + $spanLocateTool.width()/2)/_this.mapConfig.scale;
        //        mapY = (-_this.mapConfig.offsetY + $locateTool[0].offsetTop + $spanLocateTool.height())/_this.mapConfig.scale;
        //        for (var i = 0;i < _this.spaceList.length;i++){
        //            if (_this.spaceList[i].x < mapX && _this.spaceList[i].x +  _this.spaceList[i].width> mapX && _this.spaceList[i].y < mapY && _this.spaceList[i].y +  _this.spaceList[i].height> mapY){
        //                alert(_this.spaceList[i].name);
        //                var post = {
        //                    userId: '', //操作人
        //                    roomId: _this.room.id,
        //                    spaceId: _this.spaceList[i]._id, //前端根据所选点 计算出所在space
        //                    x: mapX, //相对于地图左上角坐标，不是相对于space坐标
        //                    y: mapY,
        //                    value: setValue,
        //
        //                    gateway:AppConfig.roomList[0].gateway,
        //                    sensors: _this.roomConfig.sensors, // space内的， sensor（传感器）的数组
        //
        //                    controllers: _this.roomConfig.controllers // space内的， controller（控制器）的数组
        //                };
        //                WebAPI.post('/appTemperature/setTemperature',post).done(function(result){
        //                    var resultTemp = result;
        //                    $('#divTemperatureShow').text(50 + '℃');
        //                });
        //                break;
        //            }
        //        }
        //    })
        //},

        initTempShow: function(){
            var $divTempShow = $('#divTemperatureShow');
            $('.divEquipment').hammer().off('tap').on('tap',function(e){
                if($(e.target).hasClass('divSensor')){
                    for (var i = 0;i < _this.sensorConfig.length;i++){
                        if(_this.sensorConfig[i].id == $(e.target).attr('id')){
                            $divTempShow.text(_this.sensorConfig[i].value + '℃');
                            break;
                        }
                    }
                }
                if($(e.target).hasClass('divController')){
                    for (var i = 0;i < _this.controllerConfig.length;i++){
                        if(_this.controllerConfig[i].id == $(e.target).attr('id')){
                            $divTempShow.text(_this.controllerConfig[i].value + '℃');
                            break;
                        }
                    }
                }
            })
        },

        //初始化设备显示
        initEquipments: function(){
            //设备Id数组
            var equipIdList = {
                sensors:[],
                controllers:[]
            };
            for (var i =0; i < _this.equipList.sensor.length;++i){
                equipIdList.sensors.push(_this.equipList.sensor[i].id);
            }
            for (var i =0; i < _this.equipList.controller.length;++i){
                equipIdList.controllers.push(_this.equipList.controller[i].id);
            }
            var divSensorWidth,divSensorHeight,divControllerWidth,divControllerHeight;
            //设备值初始化
            WebAPI.post('/appTemperature/get_realtime_value', equipIdList).done(function (resultData) {
                _this.sensorConfig = resultData.sensors;
                _this.controllerConfig = resultData.controllers;
                var $containerMap = $('#containerMap');
                var $divEquipment;
                //初始化传感器位置以及温度
                var strDivSensor = new StringBuilder();
                strDivSensor.append('<div class="divEquipment divSensor">');
                strDivSensor.append('    <div class="divEquipIcon">');
                strDivSensor.append('        <span class="spanEquipVal"></span>');
                strDivSensor.append('    </div>');
                strDivSensor.append('    <div class="divEquipStatus" style="display:none">');
                strDivSensor.append('        <span class="spanEquipStatus"></span>');
                strDivSensor.append('    </div>');
                strDivSensor.append('</div>');
                for (var i = 0;i < _this.equipList.sensor.length;++i){
                    $divEquipment = $(strDivSensor.toString());
                    divSensorWidth = $divEquipment.width();
                    divSensorHeight = $divEquipment.height();
                    $divEquipment.attr('id',_this.equipList.sensor[i].id);
                    $divEquipment.find('.spanEquipVal').text(_this.sensorConfig[i].value);
                    $divEquipment.css({
                        'left':_this.equipList.sensor[i].x - divSensorWidth / 2,
                        'top':_this.equipList.sensor[i].y - divSensorHeight / 2
                    });
                    $containerMap.append($divEquipment)
                }
                //初始化控制器位置以及设置
                var strDivController = new StringBuilder();
                strDivController.append('<div class="divEquipment divController">');
                strDivController.append('    <div class="divEquipIcon">');
                strDivController.append('        <span class="spanEquipVal"></span>');
                strDivController.append('    </div>');
                strDivController.append('    <div class="divEquipStatus" style="display:none">');
                strDivController.append('        <span class="spanEquipStatus"></span>');
                strDivController.append('    </div>');
                strDivController.append('</div>');
                for (var i = 0;i < _this.equipList.controller.length;++i){
                    $divEquipment = $(strDivController.toString());
                    divControllerWidth = $divEquipment.width();
                    divControllerHeight = $divEquipment.height();
                    $divEquipment.attr('id',_this.equipList.controller[i].id);
                    $divEquipment.find('.spanEquipVal').text(_this.controllerConfig[i].value);
                    $divEquipment.css({
                        'left':_this.equipList.controller[i].x - divControllerWidth / 2,
                        'top':_this.equipList.controller[i].y - divControllerHeight/2
                    });
                    $containerMap.append($divEquipment)
                }
                //设备切换功能绑定
                _this.initToggle();
                $('.divEquipStatus').off('touchstart').on('touchstart',function(){
                    new ObserverEquip(this).show();
                });
                _this.initTempShow();
            });
        },

        //初始化设备切换

        initToggle:function(){
            var $btnToggle = $('#btnToggle');
            //初始为传感器显示模式
            $btnToggle.addClass('sensorShow');
            //切换事件绑定
            $btnToggle.off('touchstart').on('touchstart',function(e){
                if($(e.currentTarget).hasClass('sensorShow')){
                    $(e.currentTarget).removeClass('sensorShow');
                    $('.divSensor').css('display','none');
                    $('.divController').css('display','block');
                }else{
                    $(e.currentTarget).addClass('sensorShow');
                    $('.divSensor').css('display','block');
                    $('.divController').css('display','none');
                }
            })
        },

        close:function(){

        }
    };
    return ObserverScreen;
})();

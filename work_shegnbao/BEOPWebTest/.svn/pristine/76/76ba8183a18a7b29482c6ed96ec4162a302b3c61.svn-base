var ConfigScreen = (function(){
    var _this;
    function ConfigScreen(){
        _this = this;
        this.curBase = undefined;
        this.curArrSpace = undefined;
        this.curArrSensor = undefined;
        this.curArrController = undefined;
    }
    ConfigScreen.prototype = {
        show:function(){
            WebAPI.get('/static/app/temperatureControl/admin/views/configure/configScreen.html').done(function(resultHTML){
                ElScreenContainer.innerHTML = resultHTML;
                _this.init();
            })
        },
        init:function(){
            _this.initRoomList();
            _this.initAddRoom();
            _this.initConfigManger();
            _this.initBaseInfoModal();
        },
        initRoomList:function(){
            var $roomList = $('#divRoomList');
            for (var i = 0;i <AppConfig.roomList.length;++i){
                var strRoom = new StringBuilder();
                strRoom.append('<button id="' + AppConfig.roomList[i].id + '" class="divRoom">');
                strRoom.append(     AppConfig.roomList[i].name + ' ');
                strRoom.append('    <span class="btnRoomConfig glyphicon glyphicon-cog" aria-hidden="true"></span>');
                strRoom.append('    <span class="btnRoomUpdate glyphicon glyphicon-floppy-save" aria-hidden="true"></span>');
                strRoom.append('</button>');
                $roomList.append(strRoom.toString());
            }
        },
        initAddRoom:function(){
            var $btnNewRoom = $('#btnNewRoom');
            var $roomList = $('#divRoomList');
            var strRoom = new StringBuilder();
            strRoom.append('<button class="divRoom">');
            strRoom.append('    新房间 ');
            strRoom.append('    <span class="btnRoomConfig glyphicon glyphicon-cog" aria-hidden="true"></span>');
            strRoom.append('    <span class="btnRoomUpdate glyphicon glyphicon-floppy-save" aria-hidden="true"></span>');
            strRoom.append('</button>');
            var id,roomConfig;
            $btnNewRoom.off('click').on('click',function(){
                if ($('.newRoom').length > 0)return;
                var $divRoom = $(strRoom.toString());
                $roomList.append($divRoom);
                id = ObjectId();
                roomConfig = {
                    buildingId:"5604de502e4725202866a086",
                    floor:"",
                    gatewayId:"",
                    id:id,
                    map:{
                        height:"",
                        width:"",
                        img:"",
                        x:"",
                        y:'',
                        orientation:0,
                        scale:1
                    },
                    name:"新房间"
                };
                $('.divRoom.selected').removeClass('selected');
                $roomList.children().last().attr('id',id).addClass('newRoom');
                AppConfig.roomList.push(roomConfig);
                var $btnRoomUpdate = $divRoom.find('.btnRoomUpdate');
                $divRoom.off('click').on('click',function(e){
                    if($(e.currentTarget).hasClass('selected'))return;
                    $('.divRoom.selected').removeClass('selected');
                    _this.curBase = AppConfig.roomList[AppConfig.roomList.length - 1];
                    _this.curArrSpace = [];
                    _this.curArrSensor = [];
                    _this.curArrController = [];
                    $(e.currentTarget).addClass('selected');
                    _this.initBaseInfoModal();
                    _this.initConfigMapInfo();

                });
                $divRoom.trigger('click');
                $btnRoomUpdate.off('click').on('click',function(e){
                    Spinner.spin(ElScreenContainer);
                    var postData = {
                        room:_this.curBase,
                        spaces:_this.curArrSpace,
                        sensors:_this.curArrSensor,
                        controllers:_this.curArrController
                    };
                    WebAPI.post('/appTemperature/saveAll',postData).done(function(result){
                        console.log(result.status);
                        $divRoom.removeClass('newRoom');
                    }).always(function(){
                        Spinner.stop();
                    });
                });
            })
        },
        initConfigManger:function(){
            var $btnRoomUpdate = $('.btnRoomUpdate');
            var $divRoom = $('.divRoom');
            var index;
            $divRoom.off('click').on('click',function(e){
                if($(e.currentTarget).hasClass('selected'))return;
                $divRoom = $('.divRoom');
                $('.divRoom.selected').removeClass('selected');
                index = $divRoom.index($(e.currentTarget));
                _this.curBase = AppConfig.roomList[index];
                $(e.currentTarget).addClass('selected');
                WebAPI.get('/appTemperature/room/getDetail/' + _this.curBase.id).done(function (detailInfo) {
                    _this.curArrSpace = detailInfo.spaces;
                    _this.curArrSensor = detailInfo.sensors;
                    _this.curArrController = detailInfo.controllers;
                    _this.initBaseInfoModal();
                    _this.initConfigMapInfo();
                })
            });
            $btnRoomUpdate.off('click').on('click',function(e){
                Spinner.spin(ElScreenContainer);
                var postData = {
                    room:_this.curBase,
                    spaces:_this.curArrSpace,
                    sensors:_this.curArrSensor,
                    controllers:_this.curArrController
                };
                WebAPI.post('/appTemperature/saveAll',postData).done(function(result){
                    console.log(result.status);
                }).always(function(){
                    Spinner.stop();
                });
            });
            $divRoom.first().trigger('click');
        },
        initBaseInfoModal:function(){
            var $modalConfigBaseInfo = $('#modalConfigBaseInfo');
            var $divConfigBaseInfo = $('#divConfigBaseInfo');
            var $btnRoomConfig = $('.btnRoomConfig');
            var btnBaseInfoConfirm = $('#btnBaseInfoConfirm');
            var $inputRoomName = $('#inputRoomName');
            var $inputRoomFloor = $('#inputRoomFloor');
            var $inputGatewayId = $('#inputGatewayId');
            $btnRoomConfig.off('click').on('click',function(e){
                $inputRoomName.val(_this.curBase.name);
                $inputRoomFloor.val(_this.curBase.floor);
                $inputGatewayId.val(_this.curBase.gatewayId);
                $modalConfigBaseInfo.modal('show');
            });
            $modalConfigBaseInfo.off('hidden.bs.modal').on('hidden.bs.modal',function(e){
                $divConfigBaseInfo.find('input').val('');
            });
            btnBaseInfoConfirm.off('click').on('click',function(e){
                _this.curBase.name = $inputRoomName.val();
                _this.curBase.floor = $inputRoomFloor.val();
                _this.curBase.gatewayId = $inputGatewayId.val();
                var index = $('.divRoom').index($(e.currentTarget));
                AppConfig.roomList[index] = _this.curBase;
                $modalConfigBaseInfo.modal('hide');
            })
        },
        initConfigMapInfo:function(){
            var $imgMap = $('#imageMap');
            var $containerMap = $('#containerMap');
            var $divDirectionTool = $('#divDirectionTool');
            var $divScaleTool = $('#divScaleTool');
            $divDirectionTool.css('transform','rotate(' + _this.curBase.map.orientation + 'deg)');
            $divScaleTool.val(_this.curBase.map.scale);
            $imgMap.attr('src',_this.curBase.map.img);

            $('.divSpace').remove();
            $('.divSensor').remove();
            $('.divController').remove();

            var $space,$sensor,$controller,strSpace,strSensor,strController;
            strSpace = new StringBuilder();
            strSpace.append('<div class="divSpace divMapEle">');
            strSpace.append('   <div class="topWall wall"></div>');
            strSpace.append('   <div class="rightWall wall"></div>');
            strSpace.append('   <div class="bottomWall wall"></div>');
            strSpace.append('   <div class="leftWall wall"></div>');
            strSpace.append('</div>');

            strSensor = new StringBuilder();
            strSensor.append('<div class="divSensor divMapEle glyphicon glyphicon-eye-open"></div>');

            strController = new StringBuilder();
            strController.append('<div class="divController divMapEle glyphicon glyphicon-asterisk"></div>');
            if(_this.curBase.map.img) {
                $imgMap[0].onload = function () {
                    for (var i = 0; i < _this.curArrSpace.length; i++) {
                        $space = $(strSpace.toString());
                        $space.attr('id', _this.curArrSpace[i].id);
                        var arrRelateData =[];
                        for (var j = 0;j < _this.curArrSpace[i].sensorIds.length;j++){
                            arrRelateData.push(_this.curArrSpace[i].sensorIds[j])
                        }
                        for (var j = 0;j < _this.curArrSpace[i].controllerIds.length;j++){
                            arrRelateData.push(_this.curArrSpace[i].controllerIds[j])
                        }
                        $space.attr('data-relate',arrRelateData.join(' '));
                        $space.css({
                            left: _this.curArrSpace[i].x,
                            top: _this.curArrSpace[i].y,
                            height: _this.curArrSpace[i].height,
                            width: _this.curArrSpace[i].width
                        });
                        $containerMap.append($space);
                    }
                    for (var i = 0; i < _this.curArrSensor.length; i++) {
                        $sensor = $(strSensor.toString());
                        $sensor.attr('id', _this.curArrSensor[i].id);
                        $sensor.attr('data-relate',_this.curArrSensor[i].spaceId);
                        $sensor.css({
                            left: _this.curArrSensor[i].x,
                            top: _this.curArrSensor[i].y
                        });
                        $containerMap.append($sensor);
                    }
                    for (var i = 0; i < _this.curArrController.length; i++) {
                        $controller = $(strController.toString());
                        $controller.attr('id', _this.curArrController[i].id);
                        $controller.attr('data-relate',_this.curArrController[i].spaceId);
                        $controller.css({
                            left: _this.curArrController[i].x,
                            top: _this.curArrController[i].y
                        });
                        $containerMap.append($controller);
                    }
                    _this.initConfigTool();
                }
            }else{
                _this.initConfigTool();
            }
        },
        initConfigTool:function(){
            new ConfigTool(_this).show();
        },
        close:function(){

        }
    };
    return ConfigScreen;
})();
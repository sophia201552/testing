/**
 * Created by win7 on 2015/9/14.
 */
var ObserverLocalScreen = (function() {
    var _this;
    // //储存全局数据
    ObserverLocalScreen.navOptions = {
        top: '<span id="roomName" class="navTopItem title middle"></span>\
              <span class="navTopItem icon right iconfont icon-shezhi1" id="btnConfig"></span>',
        bottom: false,
        backDisable:false
    };

    function ObserverLocalScreen(container,option) {
        BaseObserverScreen.call(this,container,option);
        _this = this;
        this.mqttClient = undefined;
		this.mode = undefined;
        this.dictionary={
            sensor:[],
            controller:[]
        };
    }

    ObserverLocalScreen.prototype = new BaseObserverScreen();

    ObserverLocalScreen.prototype.init = function(){
        _this.initNav();
        //获取用户roomList
        SpinnerControl.show();
        $('#containerMap').hide();
        if (!this.roomInfo && !(roomAll instanceof Array && roomAll.length > 0)) {
            this.getRoomList().done(function(){
                if(!(roomAll instanceof Array && roomAll.length > 0)){
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.indexMap.CORRECT_ROOM_INFO, 'short', 'center');
                    SpinnerControl.hide();
                    //一个房间也没有,跳转到关联房间页面
                    if(!AppConfig.landscape) {
                        router.to({
                            typeClass: ProjectSel
                        });
                    }
                }else{
                    _this.renderObserver();
                }
            }).always(function(){
                SpinnerControl.hide();
            })
        } else {
            _this.renderObserver();
        }
    };
    ObserverLocalScreen.prototype.renderObserver = function() {
        if(!_this.roomInfo) {
            _this.roomInfo = roomAll[0];
            curRoom = _this.roomInfo;
        }
        if (!mapConfig) {
            try {
                mapConfig = curRoom.params.map;
            }catch(e){
                mapConfig = null;
            }
        }
        if(!mapConfig && !AppConfig.landscape){
            SpinnerControl.hide();
            window.plugins && window.plugins.toast.show(I18n.resource.admin.indexMap.CORRECT_ROOM_INFO, 'short', 'center');
            //一个房间也没有,跳转到关联房间页面
            router.to({
                typeClass: ProjectSel
            });
        }

        //WebAPI.get('/iot/getClassFamily/thing/cn').done(function(result){
        //    _this.dictClass = result;
        if (typeof curRoom.name != 'undefined') {
            $('#roomName').html(curRoom.name + '<small>--本地控制</small>')
        }
        //设置推送标签
        curRoom && Push.setTag(curRoom.grade.toString());
        if(curRoom && curRoom._id)$('#' + curRoom._id).addClass('active');
        if (!this.render) {
            this.initMap();
            this.initMapTool();
            this.initRoom();
            this.initToggle();
            this.clickZindex();
        }
        
    };

    ObserverLocalScreen.prototype.renderDeviceList = function(){
        var deviceTable=document.createElement('div');
        $(deviceTable).attr('id','deviceTable');

        /*退出*/

        var tpl='<div class="deviceTab"><span class="active" _id="controllerTable">Controllers</span><span _id="sensorTable">Sensors</span></div>';
        $(deviceTable).append(tpl);
        $(deviceTable).append('<button class="btnBack"><span class="glyphicon glyphicon-remove"></span></button>');
        this.mqttClient = new MqttTempClient({
            arrTopic: ['/statensor/#', '/state/controller/#'],
            arrBehavior: [this.refreshTableData]
        });
        //
        //this.mqttClient.setOption({
        //    //arrTopic: ['/state/sensor/#', '/state/controller/#', 'controller/#'],
        //    arrTopic: ['/state/#'],
        //    arrBehavior:[this.refreshTableData]
        //});

        var timer=setInterval(function(){
            if(_this.dictionary.controller.length>0){
                clearInterval(timer);

                /*控制器表格*/
                var controllerTable=document.createElement('div');
                $(controllerTable).addClass("controllerTable cur");
                var thead=document.createElement('div');
                thead.className='controllerHead';
                controllerTable.appendChild(thead);
                $(thead).append('<div class="listNum">Point Number</div><div class="macAddress">MAC address</div><div class="deviceStatus">Turn Fan On/Off</div>');

                _this.dictionary.controller.sort(function(a,b){
                    return a.num-b.num;
                });
                _this.dictionary.sensor.sort(function(a,b){
                    return a.num-b.num;
                })
                for(var i=0;i<_this.dictionary.controller.length;i++){
                    var cdata=_this.dictionary.controller[i];
                    var tr=document.createElement('div');
                    tr.className='controllerCow';
                    controllerTable.appendChild(tr);
                    $(tr).append($('<div class="listNum"></div>').html(cdata.num));
                    $(tr).append($('<div class="macAddress"></div>').html(cdata.m));

                    var toggleTpl;
                    switch(cdata.status){
                        case 0:toggleTpl='<div class="opt-btn btn-switch"><div class="btn-switch-slider"></div></div>';
                            break;
                        case 1:toggleTpl='<div class="opt-btn btn-switch on"><div class="btn-switch-slider"></div></div>';
                            break;
                        default:break;
                    }
                    $(tr).append($('<div class="deviceStatus"></div>').html(toggleTpl));

                }
                $(deviceTable).append(controllerTable);
                
               /* 传感器表格*/
                var sensorTable=document.createElement('div');
                $(sensorTable).addClass("sensorTable");
                var shead=document.createElement('div');
                shead.className='sensorHead';
                sensorTable.appendChild(shead);
                $(shead).append('<div class="listNum">Point Number</div><div class="macAddress">MAC address</div><div class="deviceStatus">Temperature Value</div>');
                for(var i=0;i<_this.dictionary.sensor.length;i++){
                    var sdata=_this.dictionary.sensor[i];
                    var tr=document.createElement('div');
                    tr.className='sensorCow';
                    sensorTable.appendChild(tr);
                    $(tr).append($('<div class="listNum"></div>').html(sdata.num));
                    $(tr).append($('<div class="macAddress"></div>').html(sdata.m));
                    $(tr).append($('<div class="deviceStatus"></div>').html(sdata.temperature));
                }
                $(deviceTable).append(sensorTable);

                $('#divObserverMap').append($(deviceTable));
                _this.tableAttachEvent();
            }
        },1500);
    };
    ObserverLocalScreen.prototype.tableAttachEvent = function(){
        $('.deviceTab').off('click').on('click','span',function(e){
            $(e.currentTarget).addClass('active').siblings().removeClass('active');
            var tableType=$(e.currentTarget).attr('_id');
            $('.'+tableType).addClass('cur').siblings().removeClass('cur');
        });
        $('.opt-btn').off('click').on('click',function(){
            $(this).toggleClass('on');
            var cNum=$(this).parent().parent().find('.listNum').html();
            var arrController=_this.dictionary.controller;
            for(var i=0;i<arrController.length;i++){
                if(cNum == arrController[i].num){
                    arrController[i].status=$(this).hasClass('.on')?1:0;
                    delete arrController[i].num;
                    //var postData='/control/'+cNum+' '+JSON.stringify(arrController[i]);
                    var topicUrl='/control/'+cNum;
                    arrController[i].fan = 1;

                    var message=JSON.stringify(arrController[i]);
                }
            }
            console.log(topicUrl+' '+message);
            _this.mqttClient.mqttClient.publish(topicUrl,message);
        });
        $('.btnBack').off('click').on('click',function(){
            $('#deviceTable').remove();
        });
    };


    ObserverLocalScreen.prototype.refreshTableData = function(topic,data){
        var val = '';
        var listNum;
        if (topic.includes('/state/sensor/')) {
            listNum=parseInt(topic.substring(topic.lastIndexOf('/')+1,topic.length));
            val = data.t;
            _this.dictionary.sensor.push({num:listNum,m:data.m,temperature:val});
        } else
        if (topic.includes('/state/controller/')) {
            listNum=parseInt(topic.substring(topic.lastIndexOf('/')+1,topic.length));
            val = data.f;
            _this.dictionary.controller.push({num:listNum,m:data.m,status:val});
        } else {
            console.log("Unknow type!");
            return;
        }

    };

    ObserverLocalScreen.prototype.initWorkerUpdate = function() {
        this.mqttClient = new MqttTempClient({
            arrTopic: ['/state/sensor/#', '/state/controller/#'],
            arrBehavior: [this.refreshSingleData]
        });
    };

    ObserverLocalScreen.prototype.refreshSingleData = function(topic, data) {
        var arr = [],
            val = '';
        if (topic.includes('/state/sensor/')) {
            arr = sensorAll;
            val = data.t;
        } else
        if (topic.includes('/state/controller/')) {
            arr = ctrAll;
            val = data.f;
        } else {
            console.log("Unknow type!");
            return;
        }

        for (var i = 0, item; i < arr.length; i++) {
            item = arr[i];
            if (item.params && item.params.mac == data.m) {
                $('#' + item._id + ' .spVal').html(val);
                break;
            }
        }
    };

    ObserverLocalScreen.prototype.refreshCtrSetData = function(topic, data) {
        var arr = [],
            val = '';
        if (topic.includes('/state/sensor/')) {
            arr = sensorAll;
            val = data.t;
        } else
        if (topic.includes('/state/controller/')) {
            arr = ctrAll;
            val = data.f;
        } else {
            console.log("Unknow type!");
            return;
        }

        for (var i = 0, item; i < arr.length; i++) {
            item = arr[i];
            if (item.params && item.params.mac == data.m) {
                $('#' + item._id + ' .spVal').html(val);
                $('#ds_' + item._id + ' .tempVal').html(val);
                break;
            }
        }
    };

    ObserverLocalScreen.prototype.setControllers = function(arrData) {
        //var flag = $.Deferred();
        //flag.resolveWith(this,{data:'success'});
        //return flag;
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

    //初始化设备显示
    ObserverLocalScreen.prototype.initEquipments = function (type, list, strIcon, strAttr) {
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

            divEquip.style.left = list[i].params.gps[0]*mapConfig.scale + _this.mapPadding.left + 'px';
            divEquip.style.top = list[i].params.gps[1]* mapConfig.scale + _this.mapPadding.top + 'px';
            divEquip.style.display = 'block';//所有的设备都显示

            $(divEquip).hammer().on('tap', function (e) {
                e.preventDefault();
                e.stopPropagation();

                _this.initEquipDetail(e.currentTarget.id, e.currentTarget.dataset.type, [e.currentTarget.dataset.x, e.currentTarget.dataset.y]);


                //var option = {};
                //if(e.currentTarget.dataset.type == 'sensor'){
                //    option.arrTopic = ['/state/sensor/#'];
                //    option.arrBehavior = [_this.refreshCtrSetData];
                //}else if(e.currentTarget.dataset.type == 'ctr'){
                //    option.arrTopic = ['/state/controller/#'];
                //    option.arrBehavior = [_this.refreshCtrSetData];
                //}
                //
                //_this.mqttClient.setOption(option);
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

        _this.clickZindex();
    };

    //初始化房屋配置信息
    ObserverLocalScreen.prototype.initRoom = function() {
        this.getRoomDetail().done(function() {
            _this.initEquipments('Ctr', ctrAll, '<span class="iconfont icon-fengsushezhi"></span><span class="spVal" id="<%tempId%>" windId="<%windId%>"><%tempName%></span>');
            _this.initEquipments('Sensor', sensorAll, '<span class="iconfont icon-wenduchuanganqi"></span><span class="spVal" id="<%tempId%>"></span>');
            _this.initSpace();
            //初始化控制器列表
            _this.ctrSet = new CtrlSet(_this,{isLocal:true});
            _this.initWorkerUpdate();

            mapConfig.scale = Math.min(window.innerHeight / mapConfig.height, window.innerWidth / mapConfig.width);
            mapConfig.scale = 0.5;
            _this.mapTool.resizeCalc();
            $('#containerMap').show();
            if (window.customVariable.isImgOnload) {
                _this.mapTool.imgOnloadMove();
                window.customVariable.isImgOnload = false;
            }

            //默认显示设备-控制器列表
            $('.divUnit.divEquip.divCtr:eq(0)').trigger('tap');
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

    ObserverLocalScreen.prototype.setTemp = function(data) {};

    ObserverLocalScreen.prototype.close = function() {
        this.mqttClient.close();
        $('#btnBack', '#navTop').off('touchstart').on('touchstart', function(e) {
            router.back();
        });
    };

    ObserverLocalScreen.prototype.initToggle =  function () {
        var $btnDevice = $('#btnDeviceMode');//风扇
        var $btnTemp = $('#btnTempMode');//温度
        var $ctnScreen = $('#divObserverMap');
        var $divTemperature = $('#divTemperature');

        $('#divSetTempHis').remove();//温度设置历史删除
        $('#btnLocate').remove();//坐标图标删除

        //icon改成风扇和温度
        $btnDevice.children('.iconfont').prop('className', 'iconfont icon-fengsushezhi').end().show();
        $btnTemp.children('.iconfont').prop('className', 'iconfont icon-wendushitu').end().show();

        //曲线面板去掉
        _this.closeInfoPane();

        //温度按钮绑定事件
        $btnTemp.on('touchstart', function (e) {
            $(this).toggleClass('selected');
            if($(this).hasClass('selected')){//divSensor
                _this.deviceInView.sensor = true;
                $('.divSensor,.lineSensor').css('display', 'block');
                //_this.initWorkerUpdate();
            }else{
                _this.deviceInView.sensor = false;
                $('.divSensor,.lineSensor').css('display', 'none');
                if(_this.ctrSet && _this.ctrSet.type && _this.ctrSet.type == "sensor"){
                    _this.ctrSet.close()
                }
            }
            //控制器和传感器同时显示才显示虚线
            var option = {};
            if($btnTemp.hasClass('selected') && $btnDevice.hasClass('selected')){
                $ctnScreen.addClass('deviceMode');
            }else{
                $ctnScreen.removeClass('deviceMode');
            }

            _this.refreshDeviceInView();
        });
        //风扇按钮绑定事件
        $btnDevice.on('touchstart', function (e) {
            $(this).toggleClass('selected');
            if($(this).hasClass('selected')){//divSensor
                _this.deviceInView.controller = true;
                $('.divSensor').removeClass('tempMode');
                $('.divCtr,.lineCtr').css('display', 'block');
                //_this.initWorkerUpdate();
            }else{
                _this.deviceInView.controller = false;
                $('.divCtr,.lineCtr').css('display', 'none');
                if(_this.ctrSet && _this.ctrSet.type && _this.ctrSet.type == "device"){
                    _this.ctrSet.close()
                }
            }

            //控制器和传感器同时显示才显示虚线
            if($btnTemp.hasClass('selected') && $btnDevice.hasClass('selected')){
                $ctnScreen.addClass('deviceMode');
            }else{
                $ctnScreen.removeClass('deviceMode');
            }

            _this.refreshDeviceInView();
        });

        //默认 温度和控制器都是selected状态
        $btnTemp.trigger('touchstart');
        $btnDevice.trigger('touchstart');
    };

    ObserverLocalScreen.prototype.refreshDeviceInView = function(){
        var option = {};
        if(_this.deviceInView.controller && _this.deviceInView.sensor){
            option.arrTopic = ['/state/#'];
            option.arrBehavior = [_this.refreshCtrSetData];
        }else if(_this.deviceInView.controller){
            option.arrTopic = ['/state/controller/#'];
            option.arrBehavior = [_this.refreshCtrSetData];
        }else if(_this.deviceInView.sensor){
            option.arrTopic = ['/state/sensor/#'];
            option.arrBehavior = [_this.refreshCtrSetData];
        }
        _this.mqttClient.setOption(option);
    };

    ObserverLocalScreen.prototype.attachEventsDevice =  function () {
        var $btnSwitch = $('#btnSwitch');
        var $divItemWs = $('#btnSetWs');
        var $paneInfo = $('.paneInfo');
        var $paneConfig = $('.paneConfig');
        var $divTemperature = $('#divTemperature');
        //if (this.device.delayTime && this.device.delayTime > 0 && this.device.postData) {
        //    this.setIntervalCtr(this.device)
        //}
        //确保_this.device 是选中的控制器
        $('#divTemperature .deviceScreen').hammer().off('tap').on('tap', function (e) {
            var screenDevice = document.getElementById(this.id.split('_')[1]);
            _this.initEquipDetail(screenDevice.id, screenDevice.dataset.type);

            //var option = {};
            //if(e.currentTarget.dataset.type == 'sensor'){
            //    option.arrTopic = ['/state/sensor/#'];
            //    option.arrBehavior = [_this.refreshCtrSetData];
            //}else if(e.currentTarget.dataset.type == 'ctr'){
            //    option.arrTopic = ['/state/controller/#'];
            //    option.arrBehavior = [_this.refreshCtrSetData];
            //}
            //
            //_this.mqttClient.setOption(option);
        });
        $divTemperature.off('touchend', '.ulCtrl .opt-btn,.divCheckAll').on('touchend', '.ulCtrl .opt-btn,.divCheckAll', function () {
            var $this = $(this);
            var topicUrl,message;
            var arrController = [];

            var $parent = $this.closest('.deviceScreen ');
            var id = $parent.attr('id').split('_')[1];
            if($this.hasClass('divCheckAll')){
                topicUrl = '/control/#';
                if($this.hasClass('check')) {
                    arrController = ctrAll.map(function (item) {
                        return {
                            fan:1,
                            id:item._id
                        }
                    })
                }else{
                    arrController = ctrAll.map(function (item) {
                        return {
                            fan:0,
                            id:item._id
                        }
                    })
                }
            }else {
                for (var i = 0; i < ctrAll.length; i++) {
                    if (ctrAll[i]._id == id) {
                        topicUrl = '/control/' + ctrAll[i].prefix.split('_')[1].slice('3');
                        arrController.push({fan:$this.hasClass('btn-switch-on'),id:ctrAll[i]._id});
                        break;
                    }
                }
            }
            message = JSON.stringify(arrController);
            console.log(topicUrl+' '+message);
            _this.mqttClient.mqttClient.publish(topicUrl,message);
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
            return;
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
    };

    ObserverLocalScreen.prototype.initEquipDetail =  function (equipId, type, gps,target) {
        var _this = this;
        var id = equipId;
        var $divTemperature = $('#divTemperature');
        var tpl = undefined;

        //查找当前设备, 保存详细信息到this.device
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
            var objForTpl;
            //var data = _this.getarrPValById(result.dsItemList);
            var data = {};
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
                _this.ctrSet.show($('.paneInfo')[0], 'device', _this.device);

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
                _this.ctrSet.show($('.paneInfo')[0], 'sensor', _this.device);
            }

            //隐藏查看历史按钮
            $('.btnHist').hide();
            $('.btnMatch').addClass('single');

            _this.attachEventsDevice();
            //如果控制器是关机,增加区分样式
            var divCtr = document.getElementById(_this.device._id);
            if (!divCtr) return;

            I18n.fillArea($divTemperature);
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


        $(document).off('touchstart').on('touchstart', '#btnCloseInfo', function (e) {
            e.preventDefault();
            _this.closeInfoPane();
        });
    };

    return ObserverLocalScreen;
})();

var MqttTempClient = (function() {
    //option = { 'arrTopic': ['/state/sensor/#', '/state/controller/#'], 'arrBehavior': [function(topic, data) {}] }
    function MqttTempClient(option) {
        this.mqttClient = undefined;
        this.option = option;
        this.init();
    };

    MqttTempClient.prototype = {
        init: function() {
            var _this = this;
            if (!(this.option && this.option.arrTopic && this.option.arrBehavior)) return;
            if (this.mqttClient) {
                this.mqttClient.end(true);
                this.mqttClient = null;
            }

            this.mqttClient = mqtt.connect("ws://192.168.1.204:8181", {});

            this.mqttClient.subscribe(this.option.arrTopic);

            this.mqttClient.on('message', function(topic, message) {
                message = JSON.parse(message);
                console.log(topic + ' ' + JSON.stringify(message)); //TODO

                for (var i = 0; i < _this.option.arrBehavior.length; i++) {
                    _this.option.arrBehavior[i](topic, message);
                }
            });
        },

        setOption: function(option) {
            this.option = option;
            this.init();
        },

        getInstance: function() {
            return this.mqttClient;
        },

        close: function() {
            this.mqttClient.end(true);
            this.mqttClient = null;
            this.option = null;
        }
    };

    return MqttTempClient;
})();
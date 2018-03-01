var ConfigScreen = (function(){
    var _this;
    function ConfigScreen(){
        _this = this;
        this.curBase = undefined;
        this.curArrSpace = undefined;
        this.curArrSensor = undefined;
        this.curArrController = undefined;
        this.configTool = undefined;
        this.roomTree = undefined;
        this.$roomManagerPanel = undefined;
        _this.curStore = undefined;
        _this.store = {};
        _this.default = {
            ctrW:40,
            ctrH:40,
            sensorW:40,
            sensorH:40
        }
    }
    ConfigScreen.prototype = {
        show:function(){
            WebAPI.get('/static/app/temperatureControl/admin/views/configure/configScreen.html').done(function(resultHTML){
                ElScreenContainer.innerHTML = resultHTML;
                _this.init();
            })
        },
        init:function(){
            _this.curStore = {
                room:[],
                space:[],
                sensor:[],
                controller:[]
            };
            _this.initRoomTree();
            _this.initRoomConfig();
            //_this.initAddRoom();
            _this.initBaseInfoModal();
        },
        initRoomTree:function(){
            this.$roomManagerPanel = $('#divConfigManager');
            this.roomTree = new HierFilter(this.$roomManagerPanel,null,_this);
            this.roomTree.init();
            var option = {
                class:{
                    'projects':{
                        showNone:true
                    },
                    'groups':{
                        class:['Group']
                    }
                },
                tree:{
                    show:true,
                    data:dataFilter,
                    event:{
                        click:[
                            {
                                act:onNodeClick,
                                tar:['groups']
                            },
                            {
                                act:onProjClick,
                                tar:['projects']
                            },
                            {
                                act:function(){
                                    console.log('click things')
                                },
                                tar:'things'
                            }
                        ],
                        addDom:beforeAddDom
                    },
                    drag:{
                        enable:false
                    },
                    tool:{
                        add:{
                            act:_this.initRoomAdd,
                            default:false
                        },
                        delete:_this.initRoomDelete,
                        beforeAdd:function(parentNode){
                            if(parentNode.baseType == 'groups'){
                                return {
                                    parentNode:parentNode.getParentNode()
                                }
                            }
                        }
                    }
                }
            };
            function dataFilter(dataList,baseType){
                for (var i = 0; i < dataList.length ;i++){
                    if (baseType != 'projects'&& dataList[i].baseType != 'projects'){
                        if (dataList[i].type != 'GroupRoom'){
                            dataList.splice(i,1);
                            i--
                        }
                    }
                }
            }
            function onProjClick(e,treeId,treeNode){
                roomAll = [];
                for (var i = 0 ; i <_this.roomTree.store.groups.length;i++){
                    if (_this.roomTree.store.groups[i].type == 'GroupRoom') {
                        _this.roomTree.store.groups[i].baseType = 'groups';
                        roomAll.push(_this.roomTree.store.groups[i]);
                    }
                }
            }
            function onNodeClick(e,treeId,treeNode){
                //_this.curBase = _this.searchRoom(treeNode['_id']);
                WebAPI.get('/appTemperature/room/getDetail/' + treeNode['_id']).done(function (detailInfo) {
                    //_this.curArrSpace = detailInfo.space;
                    //_this.curArrSensor = detailInfo.sensor;
                    //_this.curArrController = detailInfo.controller;
                    var sensor = [],controller = [];
                    detailInfo.data.device.forEach(function(val){
                        if (val.type.indexOf('Sensor') > -1){
                            sensor.push(val)
                        }else{
                            controller.push(val)
                        }
                    });
                    _this.store[treeNode['_id']] = {
                        room:_this.searchRoom(treeNode['_id']),
                        space:detailInfo.data.space,
                        sensor:sensor,
                        controller:controller
                    };
                    _this.curStore = {
                        room:_this.searchRoom(treeNode['_id']),
                        space:detailInfo.data.space,
                        sensor:sensor,
                        controller:controller
                    };
                    _this.store[treeNode['_id']] = _this.curStore;
                    //_this.initBaseInfoModal();
                    if(_this.configTool) {
                        _this.configTool.toolStatus = 'init';
                        _this.configTool.eventStatus = 'init';
                        $('.btnConfigTool.selected').removeClass('selected');
                        for (var i = 0; i < _this.configTool.tempEvent.length; i++) {
                            $('#containerMap').off(_this.configTool.tempEvent[i]);
                        }
                        $('.divMapTool').css('display', '');
                        $('.main').removeClass('main');
                        $('.relate').removeClass('relate');
                    }
                    _this.initConfigMapInfo();
                })
            }
            var btnUpdate,btnCfg, btnRemove;
            function beforeAddDom(treeNode,treeTar){
                if (treeNode.type != 'GroupRoom'){
                    return;
                }
                treeNode.open = false;
                treeNode.isParent = false;
                treeTar.find('.bottom_close').removeClass('bottom_close').addClass('bottom_docu');
                treeTar.find('.center_close').removeClass('center_close').addClass('center_docu');
                treeTar.find('.ico_close').removeClass('ico_close').addClass('ico_docu');
                btnCfg = document.createElement('span');
                btnCfg.className = 'btnRoomConfig btnTreeNode glyphicon glyphicon-cog';
                //
                //btnUpdate = document.createElement('span');
                //btnUpdate.className = 'btnRoomUpdate btnTreeNode glyphicon glyphicon-floppy-save';

                btnRemove = document.createElement('span');
                btnRemove.className = 'btnDelete btnTreeNode glyphicon glyphicon-remove-sign';
                treeTar.find('>a').append(btnCfg);
                treeTar.find('>a').append(btnUpdate);
                //treeTar.find('>a').append(btnRemove);

                treeTar.attr('roomid',treeNode['_id'])
            }
            this.roomTree.setOption(option);
        },
        initRoomAdd:function(parentNode,treeNode){
            var arrNewRoom = [];
            var newRoom;
            for (var i= 0 ; i < treeNode.length; i++) {
                if(treeNode[i].baseType != 'groups')continue;
                newRoom = {
                    '_id':treeNode[i]['_id'],
                    '_idProj': parentNode[0]['_id'],
                    'arrP': {},
                    name: treeNode[i].name,
                    pId: '',
                    prefix: '',
                    projId: treeNode[i].projId,
                    type: 'GroupRoom',
                    weight: 0,
                    params: {
                        mode: 0,
                        password:'',
                        gatewayId: '',
                        map: {
                            height: "",
                            width: "",
                            img: "",
                            gps: [],
                            orientation: 0,
                            scale: 1
                        },
                        sm: 1
                    },
                    baseType: 'groups'
                };
                arrNewRoom.push(newRoom);
                _this.roomTree.tree.updateNode(newRoom);
                treeNode[i].params = {
                    mode: 0,
                    password:'',
                    gatewayId: '',
                    map: {
                        height: "",
                        width: "",
                        img: "",
                        gps: [],
                        orientation: 0,
                        scale: 1
                    },
                    sm: 1
                }
            }
            WebAPI.post('/iot/setIotInfo',arrNewRoom).done(function(result){
                _this.curBase = arrNewRoom[0];
                roomAll = roomAll.concat(arrNewRoom);
                //_this.curArrSpace = [];
                //_this.curArrSensor = [];
                //_this.curArrController = [];
                _this.roomTree.store['groups'] = _this.roomTree.store['groups'].concat(arrNewRoom);
                for (var i = 0 ; i < arrNewRoom.length ;i++) {
                    _this.store[arrNewRoom[i]['_id']] = {
                        room:arrNewRoom[i],
                        space:[],
                        sensor:[],
                        controller:[]
                    };
                    WebAPI.post('/appTemperature/room/corelateUser', {
                        userId: AppConfig.userId,
                        roomId: arrNewRoom[i]['_id']
                    }).done(function () {

                    });
                    var postData = {
                        roomId: arrNewRoom[i]['_id'],
                        userId: AppConfig.userId,
                        grade: 30
                    };
                    WebAPI.post('/appTemperature/room/setUserGrade', postData).done(function () {

                    });
                }

                _this.curStore = _this.store[arrNewRoom[0]['_id']];
                _this.initConfigMapInfo();
            });
        },
        initRoomDelete:function(treeNode){
            WebAPI.get('/appTemperature/room/getDetail/' + treeNode['_id']).done(function (detailInfo) {
                var sensor = [], controller = [];
                detailInfo.data.device.forEach(function (val) {
                    if (val.type.indexOf('Sensor') > -1) {
                        sensor.push(val)
                    } else {
                        controller.push(val)
                    }
                });
                var arrDelete = [{id:[],type:'groups'},{id:[],type:'things'}];
                for (var i=0 ;i < detailInfo.data.space.length; i++){
                    arrDelete[0].id.push(detailInfo.data.space[i]['_id']);
                }
                for (var i=0 ;i < detailInfo.data.device.length; i++){
                    arrDelete[1].id.push(detailInfo.data.device[i]['_id']);
                }
                WebAPI.post('/iot/delIotInfo', {itemList: arrDelete}).done(function (result) {
                    console.log(result.status);
                    delete _this.store[treeNode['_id']];
                    _this.curStore = null;
                    document.getElementById('imageMap').src='';
                    document.getElementById('ctnSvg').innerHTML ='';
                    $('#containerMap .divMapEle').remove();
                });
            });
        },
        initRoomConfig:function(){
            var $btnRoomUpdate = $('.btnRoomUpdate');
            var index;
            var $divRoom = $('.divRoom');
            //this.$roomManagerPanel.on('click','.btnRoomUpdate',function(e){
            //    var postData;
            //    var roomId = $(e.currentTarget).parent().attr('roomId');
            //    if (_this.curStore && _this.curStore.room['_id'] == roomId) {
            //        postData = _this.store[roomId];
            //        postData.room.baseType = 'groups';
            //        WebAPI.post('/iot/setIotInfo', [postData.room]).done(function (result) {
            //            console.log(result.status);
            //        });
            //    }else{
            //        postData = _this.searchRoom(roomId);
            //        WebAPI.post('/iot/setIotInfo', [postData]).done(function (result) {
            //            console.log(result.status);
            //        });
            //    }
            //});
            this.$roomManagerPanel.on('click','.btnDelete',function(e){
                Spinner.spin(ElScreenContainer);
            });
            $divRoom.first().trigger('click');
        },
        initAddRoom:function(){
            var $btnNewRoom = $('#btnNewRoom');
            var ctn = document.getElementById('divRoomList');
            var id,roomConfig;
            var room,btnCfg,btnUpdate;
            $btnNewRoom.off('click').on('click',function(){
                if ($('.newRoom').length > 0)return;
                id = ObjectId();
                room = document.createElement('button');
                room.className = 'divRoom newRoom';
                room.id = id;
                room.textContent = '新房间';

                btnCfg = document.createElement('span');
                btnCfg.className = 'btnRoomConfig glyphicon glyphicon-cog';

                btnUpdate = document.createElement('span');
                btnUpdate.className = 'btnRoomUpdate glyphicon glyphicon-floppy-save';

                room.appendChild(btnCfg);
                room.appendChild(btnUpdate);
                ctn.appendChild(room);

                roomConfig = {
                    '_idProj':'',
                    'arrP':{},
                    name:"新房间",
                    pId:'',
                    prefix:'',
                    projId:1,
                    type:'GroupRoom',
                    weight:0,
                    params: {
                        gatewayId:'',
                        map: {
                            height: "",
                            width: "",
                            img: "",
                            gps:[],
                            orientation: 0,
                            scale: 1
                        }
                    }
                };
                $('.divRoom.selected').removeClass('selected');
                roomAll.push(roomConfig);
                $(room).trigger('click');
            })
        },
        initBaseInfoModal:function(){
            var $modalConfigBaseInfo = $('#modalConfigBaseInfo');
            var $divConfigBaseInfo = $('#divConfigBaseInfo');
            var btnBaseInfoConfirm = $('#btnBaseInfoConfirm');
            var $inputRoomName = $('#inputRoomName');
            //var $inputRoomFloor = $('#inputRoomFloor');
            var $inputGatewayId = $('#inputGatewayId');
            var baseInfo;
            var tId = '',node;
            this.$roomManagerPanel.on('click','.btnRoomConfig',function(e){
                baseInfo = _this.searchRoom($(e.currentTarget).parentsUntil('.projects','.groups').attr('roomId'));
                tId = $(e.currentTarget).parent().parent()[0].id;
                $inputRoomName.val(baseInfo.name);
                //$inputRoomFloor.val(_this.curBase.floor);
                $inputGatewayId.val(baseInfo.params.gatewayId);
                $modalConfigBaseInfo.modal('show');
            });
            $modalConfigBaseInfo.off('hidden.bs.modal').on('hidden.bs.modal',function(e){
                $divConfigBaseInfo.find('input').val('');
            });
            btnBaseInfoConfirm.off('click').on('click',function(e){
                baseInfo.name = $inputRoomName.val();
                node = _this.roomTree.tree.getNodeByTId(tId);
                node.name = baseInfo.name;
                _this.roomTree.tree.updateNode(_this.roomTree.tree.getNodeByTId(tId));
                //_this.curBase.floor = $inputRoomFloor.val();
                baseInfo.params.gatewayId = $inputGatewayId.val();
                var index = $('.divRoom').index($(e.currentTarget));
                //roomAll[index] = _this.curBase;
                $modalConfigBaseInfo.modal('hide');
                tId = '';
                var postData;
                var roomId = baseInfo['_id'];
                WebAPI.post('/iot/setIotInfo', [baseInfo]).done(function (result) {
                    console.log(result.status);
                });
                //if (_this.curStore && _this.curStore.room['_id'] == roomId) {
                //    postData = _this.store[roomId];
                //    postData.room.baseType = 'groups';
                //    WebAPI.post('/iot/setIotInfo', [postData.room]).done(function (result) {
                //        console.log(result.status);
                //    });
                //}else{
                //    postData = _this.searchRoom(roomId);
                //    WebAPI.post('/iot/setIotInfo', [postData]).done(function (result) {
                //        console.log(result.status);
                //    });
                //}
            })
        },
        initConfigMapInfo:function(){
            var $imgMap = $('#imageMap');
            var ctnMap = document.getElementById('containerMap');
            var $divDirectionTool = $('#divDirectionTool');
            var $divScaleTool = $('#divScaleTool');
            $('.divSpace').remove();
            $('.divSensor').remove();
            $('.divController').remove();
            $(ctnMap).find('svg').html('');
            $imgMap.attr('src','');
            _this.initConfigTool();
            if(!(_this.curStore.room && _this.curStore.room.params && _this.curStore.room.params.map))return;
            $divDirectionTool.css('transform','rotate(' + _this.curStore.room.params.map.orientation + 'deg)');
            if(_this.curStore.room.params.map.scale)$divScaleTool.val(_this.curStore.room.params.map.scale);
            if(_this.curStore.room.params.map.img)$imgMap.attr('src',_this.curStore.room.params.map.img);
            var $ctnSvg = $('#ctnSvg');
            var $ctnSvgWall = $('#ctnSvgWall');
            var space,topWall,rightWall,bottomWall,leftWall,sensor,controller,rightTopCorner,rightBottomCorner,leftTopCorner,leftBottomCorner,path,circle,pathAttr,arrPath;
            var relateLine;
            if(_this.curStore.room.params.map.img) {
                $imgMap[0].onload = function () {
                    for (var i = 0; i < _this.curStore.space.length; i++) {
                        pathAttr = _this.curStore.space[i].params.path;
                        if (!pathAttr || pathAttr.length == 0) {
                            space = document.createElement('div');
                            space.className = 'divSpace divMapEle';
                            space.id = _this.curStore.space[i]['_id'];
                            space.style.left = _this.curStore.space[i].params.x + 'px';
                            space.style.top = _this.curStore.space[i].params.y + 'px';
                            space.style.height = _this.curStore.space[i].params.height + 'px';
                            space.style.width = _this.curStore.space[i].params.width + 'px';
                            space.dataset.type = 'space';
                            space.dataset.relate = 'sensor';
                            space.dataset.sensor = '';

                            topWall = document.createElement('div');
                            topWall.className = 'topWall wall divMapEle';
                            topWall.dataset.orient = 'top';

                            rightWall = document.createElement('div');
                            rightWall.className = 'rightWall wall divMapEle';
                            rightWall.dataset.orient = 'right';

                            bottomWall = document.createElement('div');
                            bottomWall.className = 'bottomWall wall divMapEle';
                            bottomWall.dataset.orient = 'bottom';

                            leftWall = document.createElement('div');
                            leftWall.className = 'leftWall wall divMapEle';
                            leftWall.dataset.orient = 'left';

                            rightTopCorner = document.createElement('div');
                            rightTopCorner.className = 'divCorner rightTopCorner divMapEle';
                            rightTopCorner.dataset.orient = 'rightTop';

                            rightBottomCorner = document.createElement('div');
                            rightBottomCorner.className = 'divCorner rightBottomCorner divMapEle';
                            rightBottomCorner.dataset.orient = 'rightBottom';

                            leftTopCorner = document.createElement('div');
                            leftTopCorner.className = 'divCorner leftTopCorner divMapEle';
                            leftTopCorner.dataset.orient = 'leftTop';

                            leftBottomCorner = document.createElement('div');
                            leftBottomCorner.className = 'divCorner leftBottomCorner divMapEle';
                            leftBottomCorner.dataset.orient = 'leftBottom';

                            space.appendChild(topWall);
                            space.appendChild(rightWall);
                            space.appendChild(bottomWall);
                            space.appendChild(leftWall);

                            space.appendChild(rightTopCorner);
                            space.appendChild(rightBottomCorner);
                            space.appendChild(leftTopCorner);
                            space.appendChild(leftBottomCorner);

                            ctnMap.appendChild(space);
                        }else {
                            space = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                            space.setAttribute('class', 'divSpace divMapEle');
                            space.setAttribute('data-sensor', '');
                            space.id = _this.curStore.space[i]['_id'];

                            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                            path.setAttribute('class', 'pathSpace pathWall divMapEle');
                            if (_this.curStore.space[i].params.path) {
                            }
                            path.setAttribute('d', pathAttr);

                            space.appendChild(path);

                            arrPath = pathAttr.split(' ');
                            for (var j = 0; j < arrPath.length - 3; j += 2) {
                                circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                                if (j == 0) {
                                    circle.setAttribute('class', 'divMapEle divCorner startWallNode')
                                } else {
                                    circle.setAttribute('class', 'divMapEle divCorner')
                                }
                                circle.setAttribute('cx', arrPath[j].slice(1));
                                circle.setAttribute('cy', arrPath[j + 1]);
                                circle.setAttribute('r', 5);
                                space.appendChild(circle)
                            }

                            $ctnSvgWall.append(space);
                        }
                    }
                    for (var i = 0; i < _this.curStore.controller.length; i++) {
                        if (!_this.curStore.controller[i].params)continue;
                        controller = document.createElement('div');
                        controller.id = _this.curStore.controller[i]['_id'];
                        controller.className = 'divController divMapEle glyphicon glyphicon-cog';
                        controller.dataset.type = 'controller';
                        controller.dataset.relate = 'sensor';
                        controller.dataset.sensor = '';
                        controller.style.left = _this.curStore.controller[i].params.gps[0] - _this.default.ctrW/2 + 'px';
                        controller.style.top = _this.curStore.controller[i].params.gps[1] - _this.default.ctrH/2 + 'px';
                        ctnMap.appendChild(controller);
                    }
                    for (var i = 0; i < _this.curStore.sensor.length; i++) {
                        if (!_this.curStore.sensor[i].params)continue;
                        sensor = document.createElement('div');
                        sensor.id = _this.curStore.sensor[i]['_id'];
                        sensor.className = 'divSensor divMapEle glyphicon glyphicon-eye-open';
                        sensor.dataset.space = _this.curStore.sensor[i].pId.join(' ');
                        sensor.dataset.controller = _this.curStore.sensor[i].params.cId;
                        sensor.dataset.type = 'sensor';
                        sensor.dataset.relate = 'space controller';
                        sensor.style.left = _this.curStore.sensor[i].params.gps[0] - _this.default.sensorW/2 + 'px';
                        sensor.style.top = _this.curStore.sensor[i].params.gps[1] - _this.default.sensorH/2 + 'px';
                        ctnMap.appendChild(sensor);
                        var relate = document.getElementById(_this.curStore.sensor[i].params.cId);
                        if (relate) {
                            relate.dataset.sensor = sensor.id;
                            relateLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                            relateLine.className.baseVal = 'relateLine';
                            relateLine.setAttribute('x1', _this.curStore.sensor[i].params.gps[0]);
                            relateLine.setAttribute('y1', _this.curStore.sensor[i].params.gps[1]);
                            relateLine.setAttribute('x2', _this.searchDevice('controller',relate.id).params.gps[0]);
                            relateLine.setAttribute('y2', _this.searchDevice('controller',relate.id).params.gps[1]);
                            relateLine.setAttribute('data-sensor', _this.curStore.sensor[i]['_id']);
                            relateLine.setAttribute('data-controller', relate.id);
                            $ctnSvg.append(relateLine);
                        }
                        if (typeof _this.curStore.sensor[i].pId == 'string'){
                            relate = document.getElementById(_this.curStore.sensor[i].pId);
                            if (relate)relate.setAttribute('data-sensor' ,sensor.id);
                        }else if(_this.curStore.sensor[i].pId instanceof Array){
                            for (var j = 0 ;j < _this.curStore.sensor[i].pId.length; j++){
                                relate = document.getElementById( _this.curStore.sensor[i].pId[j]);
                                if (relate)relate.setAttribute('data-sensor' ,sensor.id);
                            }
                        }
                    }
                }
            }else{
                _this.initConfigTool();
            }
        },
        initConfigTool:function(){
            this.configTool = new ConfigTool(_this);
            this.configTool.init();
        },
        searchRoom:function(id){
            if (id== 'new'){
                for (var i = 0; i < roomAll.length; i++) {
                    if (typeof roomAll[i]['_id'] == 'undefined') {
                        return roomAll[i];
                    }
                }
            }else {
                for (var i = 0; i < roomAll.length; i++) {
                    if (roomAll[i]['_id'] == id) {
                        return roomAll[i];
                    }
                }
            }
        },
        searchDevice:function(type,id){
            for (var i = 0; i < _this.curStore[type].length;i++){
                if (_this.curStore[type][i]['_id'] == id){
                    return _this.curStore[type][i];
                }
            }
            return;
        },
        close:function(){

        }
    };
    return ConfigScreen;
})();
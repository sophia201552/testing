var ObserverMap = (function(){
    var _this;
    function getOffsetSum(ele){
      var top= 0,left=0;
      while(ele){
        top+=ele.offsetTop;
        left+=ele.offsetLeft;
        ele=ele.offsetParent;
      }
      return {
        top:top,
        left:left
      }
    }
    function ObserverMap(page){
        _this = this;
        this.page = page;
        this.mapMoveRate = 15;
        this.mapConfig = page.mapConfig;
        this.mapScreenTop = getOffsetSum($('#divObserverMap')[0]).top + parseFloat(BomConfig.topHeight);
        this.mapEvent = new Hammer(document.getElementById('mapBg'));
        this.lastScale = 1;
        this.mapScreenBottom = document.getElementById('divTemperature').offsetHeight;
    }
    ObserverMap.prototype = {
        show: function(){
            _this.init();
        },
        init:function(){
            _this.initLocate();
            _this.initMapResize();
            _this.initMapRelocate();
        },
        initMapRelocate: function(){
            var $btnRelocate = $('#btnRelocate');
            var $map = $('#divObserverMap');
            var divMapHeight = $map[0].offsetHeight;
            var divMapWidth = $map[0].offsetWidth;
            var $containerMap = $('#containerMap');
            $btnRelocate.off('touchstart').on('touchstart',function(e){
                _this.mapConfig.offsetX -= (_this.mapConfig.imgX + _this.mapConfig.offsetX) - divMapWidth / 2;
                _this.mapConfig.offsetY -= (_this.mapConfig.imgY + _this.mapConfig.offsetY) - divMapHeight / 2;
                //_this.mapConfig.pageX = divMapWidth / 2;
                //_this.mapConfig.pageY = divMapHeight / 2;
                _this.offsetAdjust();
                $containerMap.css({
                    left:_this.mapConfig.offsetX,
                    top:_this.mapConfig.offsetY - _this.mapScreenTop
                });
            });
        },
        initMapResize:function(){
            var $btnSizeUp = $('#btnSizeUp');
            var $btnSizeDown = $('#btnSizeDown');
            var $imgMap = $('#imgMap');
            var $containerMap = $('#containerMap');
            var $locateTool =$('#btnLocate');
            var $spanLocateTool = $('#spanLocateIcon');
            var $map = $('#divObserverMap');
            var divMapHeight = $map[0].offsetHeight;
            var divMapWidth = $map[0].offsetWidth;
            $imgMap[0].onload = function(e){
                //计算最大最小缩放比
                var minXScale = Math.ceil(10 * divMapWidth/_this.mapConfig.width ) / 10;
                //alert(divMapWidth+':'+_this.mapConfig.width);
                var minYScale = Math.ceil(10 * divMapHeight/_this.mapConfig.height ) / 10;
                //alert(divMapHeight+':'+_this.mapConfig.height);
                var minScale = Math.max(minXScale,minYScale);
                var maxScale = Infinity;
                var scaleStep = 0.1;
                var mapWidth = _this.mapConfig.width;
                var mapHeight = _this.mapConfig.height;
                _this.lastScale = 1;
                //工具条缩放地图
                $btnSizeUp.off('touchstart').on('touchstart',function(e){
                    if (_this.mapConfig.scale + scaleStep> maxScale)return;
                    _this.mapConfig.scale += scaleStep;
                    resizeCalc();
                });
                $btnSizeDown.off('touchstart').on('touchstart',function(e){
                    if (_this.mapConfig.scale - scaleStep < minScale)return;
                    _this.mapConfig.scale -= scaleStep;
                    resizeCalc();
                });
                function resizeCalc(){
                    $containerMap.width(mapWidth * _this.mapConfig.scale);
                    $containerMap.height(mapHeight * _this.mapConfig.scale);
                    _this.mapConfig.offsetX = _this.mapConfig.offsetX -_this.mapConfig.imgX * (_this.mapConfig.scale / _this.lastScale - 1);
                    _this.mapConfig.offsetY = _this.mapConfig.offsetY -_this.mapConfig.imgY * (_this.mapConfig.scale / _this.lastScale - 1);
                    _this.mapConfig.imgX = _this.mapConfig.imgX * _this.mapConfig.scale / _this.lastScale;
                    _this.mapConfig.imgY = _this.mapConfig.imgY * _this.mapConfig.scale / _this.lastScale;
                    _this.offsetAdjust();
                    $locateTool.css({
                        left:_this.mapConfig.imgX - $spanLocateTool.width()/2,
                        top:_this.mapConfig.imgY - $spanLocateTool.height() + _this.mapScreenTop
                    });
                    $containerMap.css({
                        left:_this.mapConfig.offsetX,
                        top:_this.mapConfig.offsetY - _this.mapScreenTop
                    });
                    $('#divTemperatureShow').text(minScale + ':' + maxScale + ':' + _this.mapConfig.scale.toFixed(1));
                    _this.unitRelocate();
                    _this.lastScale = _this.mapConfig.scale;
                    _this.getRealPos();
                }
                //手指缩放地图
                var scaleTransferCoe = 0.05;
                var finalScale = 1;
                _this.mapEvent.add(new Hammer.Pinch());
                _this.mapEvent.off('pinchmove').on('pinchmove',function(e){
                    var ev = e;
                    finalScale = 1 + (ev.scale - 1) *scaleTransferCoe;
                    $('#divTemperatureShow').text(scaleTransferCoe + ':' + minScale + ':' + maxScale + ':' + ev.scale.toFixed(1));
                    if (finalScale * _this.lastScale> maxScale || finalScale * _this.lastScale < minScale)return;
                    _this.mapConfig.scale *= finalScale;
                    resizeCalc();
                });
                //_this.mapEvent.off('pincend').on('pincend',function(e){
                //    var ev = e;
                //    finalScale = _this.mapConfig.scale;
                //});
            };
        },
        initLocate: function(){
            var $map = $('#divObserverMap');
            var $imgMap = $('#imgMap');
            var $locateTool =$('#btnLocate');
            var $containerMap = $('#containerMap');
            var $spanLocateTool = $('#spanLocateIcon');
            var locateStatus = 'end';
            var $divTemperature = $('#divTemperature');
            //放置定位工具
            this.mapEvent.add(new Hammer.Tap());
            this.mapEvent.off('tap').on('tap',function(e){
                if (_this.page.mode == 'device')return;
                e.preventDefault();
                var ev = e;
                //_this.mapConfig.pageX = ev.pointers[0].imgX;
                //_this.mapConfig.pageY = ev.pointers[0].imgY - _this.mapScreenTop;
                _this.mapConfig.imgX = ev.pointers[0].pageX - _this.mapConfig.offsetX;
                _this.mapConfig.imgY = ev.pointers[0].pageY  - _this.mapConfig.offsetY;
                $locateTool.css({
                    left:_this.mapConfig.imgX - $spanLocateTool.width()/2,
                    top:_this.mapConfig.imgY - $spanLocateTool.height() + _this.mapScreenTop
                });
                _this.getRealPos();
                /*console.log(_this.mapConfig.mapX);
                console.log(_this.mapConfig.mapY);*/
                var sensorId = _this.getSensor();
                if(sensorId && _this.page.mapTool.page.mode == 'temp'){
                    _this.page.mapTool.page.initEquipDetail(sensorId, 'sensor', [_this.mapConfig.mapX, _this.mapConfig.mapY]);
                }
            });
            //拖动定位工具
            $locateTool.hammer().off('panmove').on('panmove',function(e){
                e.preventDefault();
                var ev = e.gesture;
                //_this.mapConfig.pageX = ev.pointers[0].imgX;
                //_this.mapConfig.pageY = ev.pointers[0].imgY - _this.mapScreenTop;
                _this.mapConfig.imgX = ev.pointers[0].pageX - _this.mapConfig.offsetX;
                _this.mapConfig.imgY = ev.pointers[0].pageY  - _this.mapConfig.offsetY;
                $locateTool.css({
                    left:_this.mapConfig.imgX - $spanLocateTool.width()/2,
                    top:_this.mapConfig.imgY - $spanLocateTool.height() + _this.mapScreenTop
                });
                _this.getRealPos()
            });
            $locateTool.hammer().off('panend').on('panend',function(e){
                e.preventDefault();
                var ev = e.gesture;
                //_this.mapConfig.pageX = ev.changedPointers[0].imgX;
                //_this.mapConfig.pageY = ev.changedPointers[0].imgY - _this.mapScreenTop;
                _this.mapConfig.imgX = ev.changedPointers[0].pageX - _this.mapConfig.offsetX;
                _this.mapConfig.imgY = ev.changedPointers[0].pageY - _this.mapScreenTop - _this.mapConfig.offsetY;
            });
            //拖动地图
            var initimgX,initimgY,initOffsetX,initOffsetY;
            this.mapEvent.add(new Hammer.Pan({threshold:0}));
            this.mapEvent.off('panstart').on('panstart',function(e){
                e.preventDefault();
                var ev = e;
                initimgX = ev.pointers[0].pageX;
                initimgY = ev.pointers[0].pageY;
                initOffsetX = _this.mapConfig.offsetX;
                initOffsetY = _this.mapConfig.offsetY;
            });
            this.mapEvent.off('panmove').on('panmove',function(e){
                //e.preventDefault();
                var ev = e;
                var evLeft = ev.pointers[0].pageX - initimgX + initOffsetX;
                var evTop = ev.pointers[0].pageY - initimgY + initOffsetY - _this.mapScreenTop;
                if (evLeft > 0){
                    evLeft = 0;
                }
                if (evTop > 0){
                    evTop = 0;
                }
                if (evLeft + $containerMap.width() - $map.width() < 0){
                    evLeft = - ($containerMap.width() - $map.width());
                }
                if (evTop + $containerMap[0].offsetHeight - $map.height() < 0){
                    evTop = - ($containerMap[0].offsetHeight - $map.height());
                }
                $containerMap.css({
                    'left':evLeft + 'px',
                    'top':evTop + 'px'
                });
                //_this.mapConfig.offsetX = initOffsetX + evLeft;
                //_this.mapConfig.offsetY = initOffsetY + evTop;
                //$locateTool.css({
                //    left:_this.mapConfig.pageX - $spanLocateTool.width()/2,
                //    top:_this.mapConfig.pageY - $spanLocateTool.height()
                //});
            });
            this.mapEvent.off('panend').on('panend',function(e){
                e.preventDefault();
                var ev = e;
                _this.mapConfig.offsetX += ev.changedPointers[0].pageX - initimgX;
                _this.mapConfig.offsetY += ev.changedPointers[0].pageY - initimgY;
                //_this.mapConfig.pageX = _this.mapConfig.imgX + _this.mapConfig.offsetX;
                //_this.mapConfig.pageY = _this.mapConfig.imgY + _this.mapConfig.offsetY;
                _this.offsetAdjust();
                _this.getRealPos()
            });
        },
        //unitRelocate:function(){
        //    var $divEquipment = $('.divUnit');
        //    var left,top,id,divWidth,divHeight;
        //    for(var i=0;i < $divEquipment.length;i++){
        //        id = $divEquipment.eq(i).attr('id');
        //        if ($divEquipment.eq(i).hasClass('divSensor')) {
        //            for (var j = 0; j < _this.page.equipList.sensor.length; j++) {
        //                if (id == _this.page.equipList.sensor[j]['_id']) {
        //                    divWidth = $divEquipment.eq(i).width();
        //                    divHeight = $divEquipment.eq(i).height();
        //                    left = (_this.page.equipList.sensor[j].params.gps[0]) * _this.mapConfig.scale - divWidth / 2;
        //                    top = (_this.page.equipList.sensor[j].params.gps[1]) * _this.mapConfig.scale - divHeight / 2;
        //                    $divEquipment.eq(i).css({
        //                        'left': left,
        //                        'top': top
        //                    });
        //                    break;
        //                }
        //            }
        //        }else if($divEquipment.eq(i).hasClass('divController')) {
        //            for (var j = 0; j < _this.page.equipList.controller.length; j++) {
        //                if (id == _this.page.equipList.controller[j]['_id']) {
        //                    left = (_this.page.equipList.controller[j].params.gps[0]) * _this.mapConfig.scale;
        //                    top = (_this.page.equipList.controller[j].params.gps[1]) * _this.mapConfig.scale;
        //                    $divEquipment.eq(i).css({
        //                        'left': left,
        //                        'top': top
        //                    });
        //                    break;
        //                }
        //            }
        //        }
        //    }
        //},
        unitRelocate:function(){
            var arrUnit = $('.divUnit');
            var unit,left,top;
            for (var i = 0; i < arrUnit.length ;i++){
                unit = arrUnit[i];
                unit.style.left = parseInt(unit.style.left) * _this.mapConfig.scale/_this.lastScale + 'px';
                unit.style.top = parseInt(unit.style.top) * _this.mapConfig.scale/_this.lastScale + 'px';
            }
        },
        offsetAdjust:function(){
            var $map = $('#divObserverMap');
            var divMapHeight = $map[0].offsetHeight;
            var divMapWidth = $map[0].offsetWidth;
            var $containerMap = $('#containerMap');
            if (_this.mapConfig.offsetX > 0){
                _this.mapConfig.offsetX = 0
            }
            if (_this.mapConfig.offsetY > _this.mapScreenTop){
                _this.mapConfig.offsetY = _this.mapScreenTop
            }
            if (_this.mapConfig.offsetX < - ($containerMap.width() - divMapWidth)){
                _this.mapConfig.offsetX = - ($containerMap.width() - divMapWidth)
            }
            if (_this.mapConfig.offsetY < - ($containerMap[0].offsetHeight - divMapHeight - _this.mapScreenTop)){
                _this.mapConfig.offsetY = - ($containerMap[0].offsetHeight - divMapHeight - _this.mapScreenTop)
            }
            //_this.mapConfig.pageX = _this.mapConfig.offsetX + _this.mapConfig.imgX;
            //_this.mapConfig.pageY = _this.mapConfig.offsetY + _this.mapConfig.imgY;
        },
        getRealPos:function(){
            var mapX = _this.mapConfig.imgX / _this.mapConfig.scale ;
            var mapY = _this.mapConfig.imgY / _this.mapConfig.scale;
            _this.mapConfig.mapX = mapX;
            _this.mapConfig.mapY = mapY;
            //$('#locateTempShow').text(mapX.toFixed(2) + '/' + mapY.toFixed(2));
            console.log(_this.mapConfig.mapX + ' ' + _this.mapConfig.mapY);
            return {
                x:mapX,
                y:mapY,
                z:0
            };
        },
        getScreenPos:function(pos){
            var imgX = pos.x * _this.mapConfig.scale;
            var imgY = pos.y * _this.mapConfig.scale;
            return {
                x:imgX,
                y:imgY
            }
        },
        getSensor:function(){
            var spaceId = _this.getSpace();
            if (spaceId){
                var arrSensor = [],minDistance,distance,sensorId;
                if (spaceId != 'room') {
                    for (var i = 0; i < sensorAll.length; i++) {
                        if (sensorAll[i].pId.toString() == spaceId) {
                            arrSensor.push(sensorAll[i])
                        }
                    }
                }else{
                    for (var i = 0; i < sensorAll.length; i++) {
                        if (sensorAll[i].pId.toString() == curRoom['_id']) {
                            arrSensor.push(sensorAll[i])
                        }
                    }
                }
                minDistance = Infinity;
                for (var i = 0 ; i < arrSensor.length; i++){
                    distance = Math.pow(arrSensor[i].params.gps[0] - _this.mapConfig.mapX,2) + Math.pow(arrSensor[i].params.gps[1] - _this.mapConfig.mapY,2)
                    if (distance < minDistance){
                        minDistance = distance;
                        sensorId = arrSensor[i]['_id'];
                    }
                }
                return sensorId;
            }
        },
        getSpace:function(){
            for (var i = 0 ; i < spaceAll.length ;i++){
                if (_this.mapConfig.mapX > spaceAll[i].params.x && _this.mapConfig.mapX < spaceAll[i].params.x + spaceAll[i].params.width
                    && _this.mapConfig.mapY > spaceAll[i].params.y && _this.mapConfig.mapY < spaceAll[i].params.y + spaceAll[i].params.height
                ){
                    return spaceAll[i]['_id'];
                }
            }
            return 'room';
        },
        close: function(){

        }
    };
    return ObserverMap;
})();

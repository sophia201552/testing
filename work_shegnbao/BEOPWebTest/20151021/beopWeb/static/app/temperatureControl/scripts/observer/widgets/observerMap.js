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
        this.mapScreenTop = getOffsetSum($('#divObserverMap')[0]).top;
        this.mapEvent = new Hammer(document.getElementById('imgMap'));
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
                _this.mapConfig.offsetX -= _this.mapConfig.screenX - divMapWidth / 2;
                _this.mapConfig.offsetY -= _this.mapConfig.screenY - divMapHeight / 2;
                _this.mapConfig.screenX = divMapWidth / 2;
                _this.mapConfig.screenY = divMapHeight / 2;
                _this.offsetAdjust();
                $containerMap.css({
                    left:_this.mapConfig.offsetX,
                    top:_this.mapConfig.offsetY
                });
                //$locateTool.css({
                //    left:_this.mapConfig.pageX - $spanLocateTool.width()/2,
                //    top:_this.mapConfig.screenY - $spanLocateTool.height()
                //})
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
                var maxScale = 2 - minScale;
                var scaleStep = 0.1;
                var mapWidth = _this.mapConfig.width;
                var mapHeight = _this.mapConfig.height;
                var lastScale = 1;
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
                    _this.mapConfig.imgX = _this.mapConfig.imgX * _this.mapConfig.scale / lastScale;
                    _this.mapConfig.imgY = _this.mapConfig.imgY * _this.mapConfig.scale / lastScale;
                    _this.mapConfig.offsetX = _this.mapConfig.screenX - _this.mapConfig.imgX;
                    _this.mapConfig.offsetY = _this.mapConfig.screenY - _this.mapConfig.imgY;
                    _this.offsetAdjust();
                    $locateTool.css({
                        left:_this.mapConfig.imgX - $spanLocateTool.width()/2,
                        top:_this.mapConfig.imgY - $spanLocateTool.height()
                    });
                    $containerMap.css({
                        left:_this.mapConfig.offsetX,
                        top:_this.mapConfig.offsetY
                    });
                    $('#divTemperatureShow').text(minScale + ':' + maxScale + ':' + _this.mapConfig.scale.toFixed(1));
                    lastScale = _this.mapConfig.scale;
                    _this.equipRelocate();
                    _this.locationCal();
                }
                //手指缩放地图
                var scaleTransferCoe = 0.05;
                var finalScale = 1;
                _this.mapEvent.add(new Hammer.Pinch());
                _this.mapEvent.off('pinchmove').on('pinchmove',function(e){
                    var ev = e;
                    finalScale = 1 + (ev.scale - 1) *scaleTransferCoe;
                    $('#divTemperatureShow').text(scaleTransferCoe + ':' + minScale + ':' + maxScale + ':' + ev.scale.toFixed(1));
                    if (finalScale * lastScale> maxScale || finalScale * lastScale < minScale)return;
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
            //放置定位工具
            this.mapEvent.add(new Hammer.Tap());
            this.mapEvent.off('tap').on('tap',function(e){
                e.preventDefault();
                var ev = e;
                _this.mapConfig.screenX = ev.pointers[0].pageX;
                _this.mapConfig.screenY = ev.pointers[0].pageY - _this.mapScreenTop;
                _this.mapConfig.imgX = _this.mapConfig.screenX - _this.mapConfig.offsetX;
                _this.mapConfig.imgY = _this.mapConfig.screenY - _this.mapConfig.offsetY;
                $locateTool.css({
                    left:_this.mapConfig.imgX - $spanLocateTool.width()/2,
                    top:_this.mapConfig.imgY - $spanLocateTool.height()
                });
                _this.modalTempConfig();
                _this.locationCal()
            });
            //拖动定位工具
            $locateTool.hammer().off('panmove').on('panmove',function(e){
                e.preventDefault();
                var ev = e.gesture;
                _this.mapConfig.screenX = ev.pointers[0].pageX;
                _this.mapConfig.screenY = ev.pointers[0].pageY - _this.mapScreenTop;
                _this.mapConfig.imgX = _this.mapConfig.screenX - _this.mapConfig.offsetX;
                _this.mapConfig.imgY = _this.mapConfig.screenY - _this.mapConfig.offsetY;
                $locateTool.css({
                    left:_this.mapConfig.imgX - $spanLocateTool.width()/2,
                    top:_this.mapConfig.imgY - $spanLocateTool.height()
                });
                _this.locationCal()
            });
            $locateTool.hammer().off('panend').on('panend',function(e){
                e.preventDefault();
                var ev = e.gesture;
                _this.mapConfig.screenX = ev.changedPointers[0].pageX;
                _this.mapConfig.screenY = ev.changedPointers[0].pageY - _this.mapScreenTop;
                _this.mapConfig.imgX = _this.mapConfig.screenX - _this.mapConfig.offsetX;
                _this.mapConfig.imgY = _this.mapConfig.screenY - _this.mapConfig.offsetY;
            });
            //拖动地图
            var initPageX,initPageY,initOffsetX,initOffsetY;
            this.mapEvent.add(new Hammer.Pan({threshold:0}));
            this.mapEvent.off('panstart').on('panstart',function(e){
                e.preventDefault();
                var ev = e;
                initPageX = ev.pointers[0].pageX;
                initPageY = ev.pointers[0].pageY - _this.mapScreenTop;
                initOffsetX = _this.mapConfig.offsetX;
                initOffsetY = _this.mapConfig.offsetY;
            });
            this.mapEvent.off('panmove').on('panmove',function(e){
                //e.preventDefault();
                var ev = e;
                var evLeft = ev.pointers[0].pageX - initPageX + initOffsetX;
                var evTop = ev.pointers[0].pageY - initPageY + initOffsetY - _this.mapScreenTop;
                if (evLeft > 0){
                    evLeft = 0;
                }
                if (evTop > 0){
                    evTop = 0;
                }
                if (evLeft + $containerMap.width() - $map.width() < 0){
                    evLeft = - ($containerMap.width() - $map.width());
                }
                if (evTop + $containerMap.height() - $map.height() < 0){
                    evTop = - ($containerMap.height() - $map.height());
                }
                $containerMap.css({
                    'left':evLeft + 'px',
                    'top':evTop + 'px'
                });
                //_this.mapConfig.offsetX = initOffsetX + evLeft;
                //_this.mapConfig.offsetY = initOffsetY + evTop;
                //$locateTool.css({
                //    left:_this.mapConfig.screenX - $spanLocateTool.width()/2,
                //    top:_this.mapConfig.screenY - $spanLocateTool.height()
                //});
            });
            this.mapEvent.off('panend').on('panend',function(e){
                e.preventDefault();
                var ev = e;
                _this.mapConfig.offsetX += ev.changedPointers[0].pageX - initPageX;
                _this.mapConfig.offsetY += ev.changedPointers[0].pageY - initPageY - _this.mapScreenTop;
                _this.mapConfig.screenX = _this.mapConfig.imgX + _this.mapConfig.offsetX;
                _this.mapConfig.screenY = _this.mapConfig.imgY + _this.mapConfig.offsetY;
                _this.offsetAdjust();
                _this.locationCal()
            });
        },
        modalTempConfig:function(){


        },
        equipRelocate:function(){
            var $divEquipment = $('.divEquipment');
            var left,top,id,divWidth,divHeight;
            for(var i=0;i < $divEquipment.length;i++){
                id = $divEquipment.eq(i).attr('id');
                if ($divEquipment.eq(i).hasClass('divSensor')) {
                    for (var j = 0; j < _this.page.equipList.sensor.length; j++) {
                        if (id == _this.page.equipList.sensor[j]._id) {
                            divWidth = $divEquipment.eq(i).width();
                            divHeight = $divEquipment.eq(i).height();
                            left = (_this.page.equipList.sensor[j].x) * _this.mapConfig.scale - divWidth / 2;
                            top = (_this.page.equipList.sensor[j].y) * _this.mapConfig.scale - divHeight / 2;
                            $divEquipment.eq(i).css({
                                'left': left,
                                'top': top
                            });
                            break;
                        }
                    }
                }else if($divEquipment.eq(i).hasClass('divController')) {
                    for (var j = 0; j < _this.page.equipList.controller.length; j++) {
                        if (id == _this.page.equipList.controller[j]._id) {
                            left = (_this.page.equipList.controller[j].x) * _this.mapConfig.scale;
                            top = (_this.page.equipList.controller[j].y) * _this.mapConfig.scale;
                            $divEquipment.eq(i).css({
                                'left': left,
                                'top': top
                            });
                            break;
                        }
                    }
                }
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
            if (_this.mapConfig.offsetY > 0){
                _this.mapConfig.offsetY = 0
            }
            if (_this.mapConfig.offsetX < - ($containerMap.width() - divMapWidth)){
                _this.mapConfig.offsetX = - ($containerMap.width() - divMapWidth)
            }
            if (_this.mapConfig.offsetY < - ($containerMap.height() - divMapHeight)){
                _this.mapConfig.offsetY = - ($containerMap.height() - divMapHeight)
            }
            _this.mapConfig.screenX = _this.mapConfig.offsetX + _this.mapConfig.imgX;
            _this.mapConfig.screenY = _this.mapConfig.offsetY + _this.mapConfig.imgY;
        },
        locationCal:function(){
            var $locateTool =$('#btnLocate');
            var $spanLocateTool = $('#spanLocateIcon');
            var mapX = _this.mapConfig.imgX / _this.mapConfig.scale ;
            var mapY = _this.mapConfig.imgY / _this.mapConfig.scale;
            _this.mapConfig.mapX = mapX;
            _this.mapConfig.mapY = mapY;
            $('#locateTempShow').text(mapX.toFixed(2) + '/' + mapY.toFixed(2));
            if (true)return;
            var post = {
                userId: AppConfig.userId, //操作人
                roomId: '',
                spaceId: '', //前端根据所选点 计算出所在space
                x: '', //相对于地图左上角坐标，不是相对于space坐标
                y: '',
                value: '',

                sensors: [ // space内的， sensor（传感器）的数组
                    {
                        _id: '',
                        name: '',
                        x: 100,  //相对于room的坐标
                        y: 100
                    }
                ],

                controllers: [ // space内的， controller（控制器）的数组
                    {
                        _id: '',
                        name: '',
                        x: 100,  //相对于room的坐标
                        y: 100
                    }
                ]
            };
            //WebAPI.post('/appTemperature/setTemperature',post).done(function(result){
            //    var resultTemp = result;
            //    $('#divTemperatureShow').text(50 + '℃');
            //})
        },
        close: function(){

        }
    };
    return ObserverMap;
})();

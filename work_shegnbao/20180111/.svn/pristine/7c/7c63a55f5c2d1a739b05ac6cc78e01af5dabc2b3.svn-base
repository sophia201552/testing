var ObserverMap = (function() {
    var _this;

    function getOffsetSum(ele) {
        var top = 0,
            left = 0;
        while (ele) {
            top += ele.offsetTop;
            left += ele.offsetLeft;
            ele = ele.offsetParent;
        }
        return {
            top: top,
            left: left
        }
    }

    function ObserverMap(page) {
        _this = this;
        this.page = page;
        this.mapMoveRate = 15;
        //this.mapConfig = page.mapConfig;
        var containerOffset = getOffsetSum(document.getElementById('divObserverMap'));
        this.mapScreenTop = containerOffset.top;
        this.mapScreenLeft = containerOffset.left;
        this.mapEvent = new Hammer(document.getElementById('containerMap'));
        this.lastScale = 1;
        this.mapScreenBottom = document.getElementById('divTemperature').offsetHeight;
        this.tapTime = new Date();
    }
    ObserverMap.prototype = {
        show: function() {
            _this.init();
        },
        init: function() {
            _this.initLocate();
            _this.initMapResize();
            _this.initMapRelocate();
        },
        initMapRelocate: function() {
            var $btnRelocate = $('#btnRelocate');
            var $map = $('#divObserverMap');
            var divMapHeight = $map[0].offsetHeight;
            var divMapWidth = $map[0].offsetWidth;
            var $containerMap = $('#containerMap');
            $btnRelocate.off('touchstart').on('touchstart', function(e) {
                mapConfig.offsetX -= (mapConfig.imgX + mapConfig.offsetX) - divMapWidth / 2;
                mapConfig.offsetY -= (mapConfig.imgY + mapConfig.offsetY) - divMapHeight / 2;
                //_this.mapConfig.pageX = divMapWidth / 2;
                //_this.mapConfig.pageY = divMapHeight / 2;
                _this.offsetAdjust();
                $containerMap.css({
                    left: mapConfig.offsetX - _this.mapScreenLeft,
                    top: mapConfig.offsetY - _this.mapScreenTop
                });
            });
        },
        imgOnloadMove: function() {
            var lastGps = localStorage.getItem('lastGps' + AppConfig.userId);
            var $spanLocateIcon = $('#spanLocateIcon');
            if (lastGps) {
                var $locateTool = $('#btnLocate');
                lastGps = JSON.parse(lastGps);
                mapConfig.scale = lastGps.scale;
                _this.resizeCalc();

                $('#containerMap').css({
                    left: lastGps.left + 'px',
                    top: lastGps.top + 'px'
                });
                $locateTool.css({
                    left: lastGps.locateLeft,
                    top: lastGps.locateTop
                });
                mapConfig.imgX = lastGps.imgX;
                mapConfig.imgY = lastGps.imgY;
                mapConfig.offsetX = lastGps.left + _this.page.mapPadding.left;
                mapConfig.offsetY = lastGps.top + _this.page.mapPadding.top;
                mapConfig.mapX = lastGps.mapX;
                mapConfig.mapY = lastGps.mapY;
                $('#divSetTempHis').css({
                    left: mapConfig.imgX - $spanLocateIcon.width() + _this.page.mapPadding.left,
                    top: mapConfig.imgY - $spanLocateIcon.height() + _this.page.mapPadding.top - 20
                });
            }
        },
        imgMapMove: function() {
            if (window.customVariable.isFirstLoad) {
                _this.page.mapTool.page.initEquipDetail(null, 'sensor', [mapConfig.mapX, mapConfig.mapY]);
                window.customVariable.isFirstLoad = false;
            }

        },
        screenResize: function() {
            var containerOffset = getOffsetSum(document.getElementById('divObserverMap'));
            this.mapScreenTop = containerOffset.top;
            this.mapScreenLeft = containerOffset.left;
        },
        initMapResize: function() {
            var $btnSizeUp = $('#btnSizeUp');
            var $btnSizeDown = $('#btnSizeDown');
            var $imgMap = $('#imgMap');
            var $containerMap = $('#containerMap');
            var $locateTool = $('#btnLocate');
            var $spanLocateTool = $('#spanLocateIcon');
            var $svg = $('#mapBg');
            var $divSetTempHis = $('#divSetTempHis');
            $imgMap[0].onerror = function(e) {
                e.currentTarget.src = FileAPI.root + FileAPI.doc + '/mapImg/' + curRoom._id + '.' + mapConfig.img.split('.').pop();
                $imgMap[0].onerror = null;
            };
            $imgMap[0].onload = function(e) {
                //上次位置
                _this.imgOnloadMove();
                //计算最大最小缩放比
                SpinnerControl.hide();

                var minScale = 0.25;
                var maxScale = Infinity;
                var scaleStep = 0.1;
                _this.lastScale = 1;
                //工具条缩放地图
                $btnSizeUp.off('touchstart').on('touchstart', function(e) {
                    if (mapConfig.scale + scaleStep > maxScale) return;
                    mapConfig.scale += scaleStep;
                    resizeCalc();
                });
                $btnSizeDown.off('touchstart').on('touchstart', function(e) {
                    if (mapConfig.scale - scaleStep < minScale) return;
                    mapConfig.scale -= scaleStep;
                    resizeCalc();
                });
                //手指缩放地图
                var scaleTransferCoe = 0.05;
                var finalScale = 1;
                _this.mapEvent.add(new Hammer.Pinch());

                _this.mapEvent.off('pinchin').on('pinchin', function(e) {
                    var ev = e;
                    finalScale = 1 + (ev.scale - 1) * scaleTransferCoe;
                    $('#divTemperatureShow').text(scaleTransferCoe + ':' + minScale + ':' + maxScale + ':' + ev.scale.toFixed(1));
                    if (finalScale * _this.lastScale > maxScale || finalScale * _this.lastScale < minScale) return;
                    mapConfig.scale *= finalScale;
                    resizeCalc();
                });

                _this.mapEvent.off('pinchout').on('pinchout', function(e) {
                    var ev = e;
                    finalScale = 1 + (ev.scale - 1) * scaleTransferCoe;
                    $('#divTemperatureShow').text(scaleTransferCoe + ':' + minScale + ':' + maxScale + ':' + ev.scale.toFixed(1));
                    if (finalScale * _this.lastScale > maxScale || finalScale * _this.lastScale < minScale) return;
                    mapConfig.scale *= finalScale;
                    resizeCalc();
                });
            };
            _this.mapEvent.off('doubletap').on('doubletap', function(e) {
                mapConfig.scale = 0.5;
                resizeCalc();
            });

            function resizeCalc() {
                //alert('resize');
                $containerMap.width(mapConfig.width * mapConfig.scale);
                $containerMap.height(mapConfig.height * mapConfig.scale);
                $svg.width(mapConfig.width * mapConfig.scale);
                $svg.height(mapConfig.height * mapConfig.scale);
                $imgMap.width(mapConfig.width * mapConfig.scale);
                $imgMap.height(mapConfig.height * mapConfig.scale);
                mapConfig.offsetX = mapConfig.offsetX - mapConfig.imgX * (mapConfig.scale / _this.lastScale - 1);
                mapConfig.offsetY = mapConfig.offsetY - mapConfig.imgY * (mapConfig.scale / _this.lastScale - 1);
                mapConfig.imgX = mapConfig.imgX * mapConfig.scale / _this.lastScale;
                mapConfig.imgY = mapConfig.imgY * mapConfig.scale / _this.lastScale;
                _this.offsetAdjust();
                $locateTool.css({
                    left: mapConfig.imgX - $spanLocateTool.width() / 2 + _this.mapScreenLeft,
                    top: mapConfig.imgY - $spanLocateTool.height() + _this.mapScreenTop
                });
                $divSetTempHis.css({
                    left: mapConfig.imgX + $spanLocateTool.width() / 2 + _this.mapScreenLeft,
                    top: mapConfig.imgY - $spanLocateTool.height() + _this.mapScreenTop - 20
                });
                $containerMap.css({
                    left: mapConfig.offsetX - _this.mapScreenLeft,
                    top: mapConfig.offsetY - _this.mapScreenTop
                });
                //$('#divTemperatureShow').text(minScale + ':' + maxScale + ':' + _this.mapConfig.scale.toFixed(1));
                _this.unitRelocate();
                _this.lastScale = mapConfig.scale;
                _this.getRealPos();
            }
        },
        resizeCalc: function() {
            var $imgMap = $('#imgMap');
            var $containerMap = $('#containerMap');
            var $locateTool = $('#btnLocate');
            var $spanLocateTool = $('#spanLocateIcon');
            var $divSetTempHis = $('#divSetTempHis');
            var $svg = $('#mapBg');


            $containerMap.width(mapConfig.width * mapConfig.scale);
            $containerMap.height(mapConfig.height * mapConfig.scale);
            $svg.width(mapConfig.width * mapConfig.scale);
            $svg.height(mapConfig.height * mapConfig.scale);
            $imgMap.width(mapConfig.width * mapConfig.scale);
            $imgMap.height(mapConfig.height * mapConfig.scale);
            mapConfig.offsetX = mapConfig.offsetX - mapConfig.imgX * (mapConfig.scale / _this.lastScale - 1);
            mapConfig.offsetY = mapConfig.offsetY - mapConfig.imgY * (mapConfig.scale / _this.lastScale - 1);
            mapConfig.imgX = mapConfig.imgX * mapConfig.scale / _this.lastScale;
            mapConfig.imgY = mapConfig.imgY * mapConfig.scale / _this.lastScale;
            _this.offsetAdjust();
            $locateTool.css({
                left: mapConfig.imgX - $spanLocateTool.width() + _this.page.mapPadding.left,
                top: mapConfig.imgY - $spanLocateTool.height() + _this.page.mapPadding.top
            });
            $divSetTempHis.css({
                left: mapConfig.imgX + $spanLocateTool.width() + _this.page.mapPadding.Left, //mapConfig.imgX,$spanLocateTool.width()都是0, 因为还没加载到页面
                top: mapConfig.imgY - $spanLocateTool.height() + _this.page.mapPadding.top - 20
            });
            $containerMap.css({
                left: mapConfig.offsetX - _this.page.mapPadding.left,
                top: mapConfig.offsetY - _this.page.mapPadding.top
            });
            //$('#divTemperatureShow').text(minScale + ':' + maxScale + ':' + _this.mapConfig.scale.toFixed(1));
            _this.unitRelocate();
            _this.lastScale = mapConfig.scale;
            _this.getRealPos();
        },

        saveGps: function() {
            var offset = $('#containerMap').offset();
            var $locateTool = $('#btnLocate');
            window.customVariable.lastGps = {
                left: offset.left,
                top: offset.top,
                locateLeft: $locateTool.css('left'),
                locateTop: $locateTool.css('top'),
                mapX: mapConfig.mapX,
                mapY: mapConfig.mapY,
                imgX: mapConfig.imgX,
                imgY: mapConfig.imgY,
                scale: mapConfig.scale
            };

        },

        initLocate: function() {
            var $map = $('#divObserverMap');
            var $locateTool = $('#btnLocate');
            var $containerMap = $('#containerMap');
            var $spanLocateTool = $('#spanLocateIcon');
            var $divSetTempHis = $('#divSetTempHis');

            var locateOnMove = false;
            //放置定位工具
            this.mapEvent.add(new Hammer.Tap());
            this.mapEvent.off('tap').on('tap', function(e) {
                if (_this.page.mode == 'device') return;
                e.preventDefault();
                var ev = e;

                mapConfig.imgX = ev.pointers[0].pageX - mapConfig.offsetX - _this.mapScreenLeft;
                mapConfig.imgY = ev.pointers[0].pageY - mapConfig.offsetY - _this.mapScreenTop;
                $locateTool.css({
                    left: mapConfig.imgX - $spanLocateTool.width() / 2 + _this.page.mapPadding.left,
                    top: mapConfig.imgY - $spanLocateTool.height() + _this.page.mapPadding.top
                });
                $divSetTempHis.css({
                    left: mapConfig.imgX + $spanLocateTool.width() / 2 + _this.page.mapPadding.left,
                    top: mapConfig.imgY - $spanLocateTool.height() + _this.page.mapPadding.top - 20
                });
                _this.getRealPos();

                if (_this.page.mapTool.page.mode == 'temp') {
                    if (!$(e.target).closest('.divEquip').hasClass('divSensor')) {
                        _this.page.mapTool.page.initEquipDetail(null, 'sensor', [mapConfig.mapX, mapConfig.mapY]);
                        _this.saveGps();
                    }

                }
            });
            //拖动定位工具
            $locateTool.hammer().off('panstart').on('panstart', function(e) {
                locateOnMove = true;
                e.stopPropagation();
            });
            $locateTool.hammer().off('panmove').on('panmove', function(e) {
                locateOnMove = true;
                e.preventDefault();
                e.stopPropagation();
                var ev = e.gesture;
                //_this.mapConfig.pageX = ev.pointers[0].imgX;
                //_this.mapConfig.pageY = ev.pointers[0].imgY - _this.mapScreenTop;
                mapConfig.imgX = ev.pointers[0].pageX - mapConfig.offsetX - _this.mapScreenLeft;
                mapConfig.imgY = ev.pointers[0].pageY - mapConfig.offsetY - _this.mapScreenTop;
                $locateTool.css({
                    left: mapConfig.imgX - $spanLocateTool.width() / 2 + _this.page.mapPadding.left,
                    top: mapConfig.imgY - $spanLocateTool.height() + _this.page.mapPadding.top
                });
                $divSetTempHis.css({
                    left: mapConfig.imgX + $spanLocateTool.width() / 2 + _this.page.mapPadding.left,
                    top: mapConfig.imgY - $spanLocateTool.height() + _this.page.mapPadding.top - 20
                });
                _this.getRealPos();
                _this.saveGps();
            });
            $locateTool.hammer().off('panend').on('panend', function(e) {
                locateOnMove = false;
                e.preventDefault();
                var ev = e.gesture;
                //_this.mapConfig.pageX = ev.changedPointers[0].imgX;
                //_this.mapConfig.pageY = ev.changedPointers[0].imgY - _this.mapScreenTop;
                mapConfig.imgX = ev.changedPointers[0].pageX - _this.mapScreenLeft - mapConfig.offsetX;
                mapConfig.imgY = ev.changedPointers[0].pageY - _this.mapScreenTop - mapConfig.offsetY;
            });
            //拖动地图
            var initimgX, initimgY, initOffsetX, initOffsetY;
            this.mapEvent.add(new Hammer.Pan({ threshold: 0 }));
            this.mapEvent.off('panstart').on('panstart', function(e) {
                if (locateOnMove) return;
                e.preventDefault();
                var ev = e;
                initimgX = ev.pointers[0].pageX;
                initimgY = ev.pointers[0].pageY;
                initOffsetX = mapConfig.offsetX - _this.page.mapPadding.left;
                initOffsetY = mapConfig.offsetY - _this.page.mapPadding.top;
            });
            this.mapEvent.off('panmove').on('panmove', function(e) {
                //e.preventDefault();
                if (locateOnMove) return;
                var ev = e;
                var evLeft = ev.pointers[0].pageX - initimgX + initOffsetX;
                var evTop = ev.pointers[0].pageY - initimgY + initOffsetY;
                if (evLeft + $containerMap[0].offsetWidth - $map.width() < 0) {
                    evLeft = -($containerMap[0].offsetWidth - $map.width());
                }
                if (evTop + $containerMap[0].offsetHeight - $map.height() < 0) {
                    evTop = -($containerMap[0].offsetHeight - $map.height());
                }
                if (evLeft > 0) {
                    evLeft = 0;
                }
                if (evTop > 0) {
                    evTop = 0;
                }
                $containerMap.css({
                    'left': evLeft + 'px',
                    'top': evTop + 'px'
                });
            });
            this.mapEvent.off('panend').on('panend', function(e) {
                if (locateOnMove) return;
                e.preventDefault();
                var ev = e;
                mapConfig.offsetX += ev.changedPointers[0].pageX - initimgX;
                mapConfig.offsetY += ev.changedPointers[0].pageY - initimgY;
                //_this.mapConfig.pageX = _this.mapConfig.imgX + _this.mapConfig.offsetX;
                //_this.mapConfig.pageY = _this.mapConfig.imgY + _this.mapConfig.offsetY;
                _this.offsetAdjust();
                _this.getRealPos()
            });
        },
        unitRelocate: function() {
            var arrUnit = $('.divUnit');
            var unit;
            for (var i = 0; i < arrUnit.length; i++) {
                unit = arrUnit[i];
                unit.style.left = arrUnit[i].dataset.x * mapConfig.scale + _this.page.mapPadding.left + 'px';
                unit.style.top = arrUnit[i].dataset.y * mapConfig.scale + _this.page.mapPadding.top + 'px';
            }
            _this.resizeRelateLine();
            _this.resizeSpace();
        },
        offsetAdjust: function() {
            var $map = $('#divObserverMap');
            var divMapHeight = $map[0].offsetHeight;
            var divMapWidth = $map[0].offsetWidth;
            var $containerMap = $('#containerMap');
            if (mapConfig.offsetX < -($containerMap[0].offsetWidth - divMapWidth - _this.page.mapPadding.left)) {
                mapConfig.offsetX = -($containerMap[0].offsetWidth - divMapWidth - _this.page.mapPadding.left)
            }
            if (mapConfig.offsetY < -($containerMap[0].offsetHeight - divMapHeight - _this.page.mapPadding.top)) {
                mapConfig.offsetY = -($containerMap[0].offsetHeight - divMapHeight - _this.page.mapPadding.top)
            }
            if (mapConfig.offsetX > _this.page.mapPadding.left) {
                mapConfig.offsetX = _this.page.mapPadding.left
            }
            if (mapConfig.offsetY > _this.page.mapPadding.top) {
                mapConfig.offsetY = _this.page.mapPadding.top
            }
        },
        getRealPos: function() {
            var mapX = mapConfig.imgX / mapConfig.scale;
            var mapY = mapConfig.imgY / mapConfig.scale;
            mapConfig.mapX = mapX;
            mapConfig.mapY = mapY;

            console.log(mapConfig.mapX + ' ' + mapConfig.mapY);
            return {
                x: mapX,
                y: mapY,
                z: 0
            };
        },
        resizeRelateLine: function(scale) {
            var $arrline = $('#mapBg line');
            var line, x1, y1, x2, y2;
            for (var i = 0; i < $arrline.length; i++) {
                line = $arrline[i];
                x1 = line.getAttribute('initX1');
                y1 = line.getAttribute('initY1');
                x2 = line.getAttribute('initX2');
                y2 = line.getAttribute('initY2');
                line.setAttribute('x1', parseInt(x1) * mapConfig.scale);
                line.setAttribute('y1', parseInt(y1) * mapConfig.scale);
                line.setAttribute('x2', parseInt(x2) * mapConfig.scale);
                line.setAttribute('y2', parseInt(y2) * mapConfig.scale);
            }
        },
        resizeSpace: function() {
            var $arrSpace = $('#mapBg path');
            var space, path;
            for (var i = 0; i < $arrSpace.length; i++) {
                space = $arrSpace[i];
                path = space.getAttribute('path');
                path = path.split(' ');
                path.forEach(function(node, index, self) {
                    if (index == path.length - 1) return;
                    if (index % 2) {
                        self[index] = parseFloat(node) * mapConfig.scale;
                    } else {
                        self[index] = node[0] + parseFloat(node.slice(1)) * mapConfig.scale;
                    }
                });

                space.setAttribute('d', path.join(' '));
            }
        },
        close: function() {

        }
    };
    return ObserverMap;
})();
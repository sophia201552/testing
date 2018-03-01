var MapScreen = (function () {
    var _this;

    function MapScreen() {
        _this = this;
        //地图
        this.map = undefined;
        //当前被选中的覆盖物
        this.curMarker = undefined;
        //所有的覆盖物
        this.arrMarker = [];
        //地图的缩放级别
        this.mapZoom = 20;
        // 全景控制器实例
        this.stCtrl = undefined;
        //FixedPoint的实例
        this.showFPoint = undefined;
        this.$timeQueryDom = undefined;

        this.refreshCount = 0;
        this.count = 1;
        this.switchAccount = undefined;
    }

    MapScreen.prototype = {

        show: function () {
            ElScreenContainer.innerHTML = '\
            <div id="divMap"></div>\
            <div id="divMapLegend">\
            <img src="/static/images/GMRY_YD.png" /><img src="/static/images/GMRY_LG.png" />\
            </div>\
            <div class="MFrghDetail"></div>';
            this.init();
            return this;
        },

        close: function () {
            this.map = undefined;
            this.curMarker = undefined;
            this.showFPoint = undefined;
            this.refreshCount = undefined;

        },

        init: function () {
            if (this.map) {
                this.map = undefined;
            }
            this.initMap();
            //this.initTimeQuery();
        },
        initTimeQuery: function () {
            this.$timeQueryDom = $('#divTimeQuery');
            this.$timeQueryDom.find('.iptDateTime').datetimepicker({
                todayBtn: 'linked',
                endTime: new Date(),
                format: 'yyyy-mm-dd hh:ii:ss',
                autoclose: true,
                initialDate: new Date()
            })
        },
        hideTimeQuery: function () {
            this.$timeQueryDom.hide();
            this.$timeQueryDom.find('.iptDateTime').datetimepicker('hide')
        },
        initMap: function () {
            this.map = new BMap.Map('divMap', {
                minZoom: 1,
                maxZoom: 22
            });
            this.map.centerAndZoom(new BMap.Point(121.45929, 31.22482), 13);
            this.map.addEventListener("tilesloaded", function () {});
            this.map.enableScrollWheelZoom();
            //设置地图样式
            this.map.setMapStyle(mapStyle);
            this.map.addEventListener("zoomend", function () {
                // this.mapZoom = this.getZoom();
            });

            // 构造全景控件
            this.stCtrl = new BMap.PanoramaControl();
            this.stCtrl.setOffset(new BMap.Size(20, 20));
            this.map.addControl(this.stCtrl);
            this.map.addEventListener("click", function () {
                if (this.showFPoint) {
                    this.showFPoint.close();
                }
            });
            //是否显示人员配置开关
            this.getCookies();
            this.initTooltip();
        },

        initTooltip: function () {
            this.getCurMarker();
            this.renderOverlay(NavTree.store);
            if (this.curMarker) {
                this.addHightlighted(this.curMarker);
                this.renderDetail(this.curMarker);
            }
            this.attachEvent();
        },

        refreshData: function (result) {
            this.arrMarker = [];
            this.clearOverlay();
            this.initTooltip();
            this.refreshCount += this.count;
        },
        renderDetail: function (point) {
            if (this.showFPoint) {
                this.showFPoint.close();
            }
            this.showFPoint = new FixedPoint(point);
            this.showFPoint.show();
        },
        attachEvent: function () {
            $('.btnQueryTrack').off('click').on('click', function (e) {
                e.stopPropagation();
                _this.showFPoint.close();
                var ptId = $(e.currentTarget).parent().parent().attr('_id');
                Router.to(HistoricalPath, [ptId]);
            });
            $('.pointDiffBox').off('click').on('click', '.pointComen', function (e) {
                console.log('111');
                _this.removeSelectMark();
            });
            $('#conAdmin').off('click').on('click', function (e) {
                this.switchAccount && this.switchAccount.close();
                this.switchAccount = new SwitchAccount('2495');
                this.switchAccount.show();
            });
            /*            $('.BMap_noprint.anchorTR').off('click').on('click',function(e){
                            if (_this.showFPoint) {
                                _this.showFPoint.close();
                            }   
                        })*/
        },
        removeSelectMark: function () {
            $('.markerDot').parent().removeClass('active animated flash');
            this.showFPoint.close();
        },
        onNavPointClick: function (point) {
            if (point.length > 0) {
                var data = point[0];
                this.addHightlighted(data);
                this.curMarker = data;
                this.renderDetail(data);
                if (data.option.gps && (data.option.gps[1] && data.option.gps[0])) {
                    this.map.centerAndZoom(new BMap.Point(data.option.gps[1], data.option.gps[0]), this.mapZoom);
                }
            } else {
                this.map.setViewport(this.arrMarker, {
                    zoomFactor: 0
                });
                $('.markerDot').parent().removeClass('active animated flash');
                this.showFPoint.close();
            }
        },
        getCurMarker: function () {
            var curId = $('.pointStyle.clearfix.active').attr('data-id');
            if (!curId) return;
            for (var i = 0; i < NavTree.store.length; i++) {
                if (NavTree.store[i]._id == curId) {
                    this.curMarker = NavTree.store[i];
                    break;
                }
            }
        },
        addHightlighted: function (data) {
            $('[_id=' + data._id + ']').parent().addClass('active animated flash').siblings().removeClass('active animated flash');
        },

        //渲染覆盖物
        renderOverlay: function (data) {
            var content, colAlarm, ptData;
            for (var i = 0, len = data.length; i < len; i++) {
                colAlarm = data[i].option.temp && data[i].option.temp > data[i].upperTemp ? 'rgb(255,0,0)' : 'rgb(0, 255, 45)';
                if (data[i].type == "move") {
                    content = '<div class="markerDot markerTransporter" _id="' + data[i]._id + '" type="move" style="color:' + colAlarm + '">\
                                <div class="transporter">\
                                    <span class="iconfont icon-jiantou" style="font-size:26px;display:block;transform:rotateZ(' + data[i].option.dir + 'deg);margin-left: 10px;text-align:center;"></span>\
                                </div><div class="dataContainer" >\
                                <p class="pointName">' + data[i].name + '</p>\
                                <button class="btnQueryTrack">历史轨迹回放</button></div></div>';
                } else if(data[i].type == "coolStorage") {
                    content = '<div class="markerDot markerTransporter" _id="' + data[i]._id + '" type="coolStorage" style="color:' + colAlarm + '">\
                                <div class="transporter">\
                                    <span class="iconfont icon-xue" style="font-size:26px;display:block;transform:rotateZ(' + data[i].option.dir + 'deg);margin-left: 10px;text-align:center;"></span>\
                                </div><div class="dataContainer" >\
                                <p class="pointName">' + data[i].name + '</p>\
                                </div></div>';
                } else {
                    content = '<div class="markerDot markerWarehouse" _id="' + data[i]._id + '" type="fixed" style="color:' + colAlarm + '"><div class="warehouse">\
                                <span class="iconfont icon-cangku" style="font-size:26px;display: block;margin-left: 10px;text-align:center;" ></span>\
                                </div><div class="dataContainer" >\
                                <p>' + data[i].name + '</p></div></div>';

                }
                if (data[i].option.gps && (data[i].option.gps[0] && data[i].option.gps[1])) {
                    var marker = new ComplexCustomOverlay(this.map, data[i], content);
                    var point = new BMap.Point(data[i].option.gps[1], data[i].option.gps[0]);
                    //marker.enableDragging(true);
                    this.map.addOverlay(marker);
                    this.arrMarker.push(point);
                    ptData = data[i];
                    (function (ptData) {
                        $('[_id=' + ptData._id + ']').on('click', function (e) {
                            e.stopPropagation();
                            _this.getHistoryTrackData(ptData);
                            if (ptData.option.gps && (ptData.option.gps[1] && ptData.option.gps[0])) {
                                _this.map.centerAndZoom(new BMap.Point(ptData.option.gps[1], ptData.option.gps[0]), _this.mapZoom);
                            }
                        })
                    })(ptData);
                }
            }
            //将所有标注放在当前地图窗口
            if (this.refreshCount < 2) {
                this.map.setViewport(this.arrMarker, {
                    zoomFactor: 0
                });
            }
        },
        getCookies: function () {
            var arrCookie = document.cookie.split(';');
            for (var i = 0; i < arrCookie.length; i++) {
                var curId = arrCookie[i].split('=');
                if (curId[0] == " userId" && ['2714', '2495','73'].indexOf(curId[1]) > -1) {
                    $('#divMap').append('<div id="conAdmin" class=""><span class="iconfont icon-guanliyuan2"></span><p>管理</p></div>');
                }
            }
        },
        getHistoryTrackData: function (ptData) {
            NavTree.togglePointList(ptData.type);
            this.curMarker && NavTree.freezePoints(_this.curMarker._id);
            NavTree.activePoints(ptData._id);
            $('[data-style=' + ptData.type + ']').addClass('pointSelect').siblings().removeClass('pointSelect');
            this.curMarker = ptData;
            this.addHightlighted(ptData);
            this.renderDetail(ptData);
        },
        //清楚覆盖物
        clearOverlay: function () {
            var allOverlays = this.map.getOverlays();
            for (var i = 0; i < allOverlays.length; i++) {
                this.map.removeOverlay(allOverlays[i]);
            }
        },
        renderDataDisplayPane: function () {},
    };
    return MapScreen;
})();

var ComplexCustomOverlay = (function () {
    function ComplexCustomOverlay(map, data, dom) {
        this._map = map;
        this._dom = dom;
        this._data = data;
        this._point = undefined;
        this._showFPoint = undefined;
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function () {
        var _this = this;
        var divW, divH;
        var div = document.createElement('div');
        this._point = new BMap.Point(this._data.option.gps[1], this._data.option.gps[0]);
        div.style.position = "absolute";
        div.style.cursor = "pointer";
        //div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        div.innerHTML = this._dom;
        this._div = div;
        this._map.getPanes().labelPane.appendChild(div);

        /*    this._div.onmousedown = function(e){
                _this._map.disableScrollWheelZoom();
                _this._map.disableDragging();
                divW = e.clientX - _this._div.offsetLeft;
                divH = e.clientY - _this._div.offsetTop;
            };
            this._div.onmousemove = function(e){
                this.style.left = e.clientX - divW + 'px';
                this.style.top = e.clientY - divH + 'px';
            };
            this._div.onmouseup = function(e){
                e.stopPropagation();
                _this._map.enableScrollWheelZoom();
                _this._map.enableDragging();
                this.onmousemove = this.onmousedown = null;
            }*/

        return div;
    }
    ComplexCustomOverlay.prototype.draw = function () {
        var pixel = this._map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x + "px";
        this._div.style.top = pixel.y + "px";
    }

    return ComplexCustomOverlay;
})();
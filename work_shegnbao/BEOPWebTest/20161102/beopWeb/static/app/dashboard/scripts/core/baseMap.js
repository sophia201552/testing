var beop = window.beop || {};
beop.baseMap =  beop.baseMap || {};

(function (window, $, nsBaseMap) {

    var CONSTS = {
        AMap: {
            name: '高德地图',
            url: location.protocol + '//webapi.amap.com/maps',
            params: {
                // 高德地图的开发者key，拼接url时会用到
                key: '9cc89c68a4bd6f3f5f65589f85ad7685',
                // 高德地图的版本号，拼接url时会用到
                v: '1.3'
            }
        },
        GLoader: {
            name: 'Google Loader',
            url: 'https://www.google.com/jsapi'
        },
        GMap: {
            name: 'Google Map',
            url: 'http://maps.googleapis.com/maps/api/js',
            params: {
                key: 'AIzaSyAzzOzAmrGov5GLacve9w8_Q8dS-xBYCgc',
                sensor: 'false',
                libraries: 'geometry,places'
            }
        }
    };

    var defaults = {
        // 地图的DOM容器id值
        mapContainer: 'mapContainer',
        // 地图默认的经度，作为默认的地图中心
        defaultLng: '121.6283679',
        // 地图默认的纬度，作为默认的地图中心
        defaultLat: '31.2114943',
        // 地图标记的图片
        markerImgPath: 'http://images.rnbtech.com.hk/static/images/map_marker_online.png'
    };

    // 工具方法集合
    var util = {
        /**
         * 方法继承
         * @param  {function} clazz 子类
         * @param  {function} base  父类
         */
        inherits: function (clazz, base) {
            var clazzPrototype = clazz.prototype;
            var F = function () {};
            F.prototype = base.prototype;
            clazz.prototype = new F();
            for (var prop in clazzPrototype) {
                clazz.prototype[prop] = clazzPrototype[prop];
            }
            clazz.constructor = clazz;
        },
        /**
         * 异步加载script标签
         * @param {string} url js文件路径
         * @param {function} callback js加载成功(执行完毕)后的回调函数
         */
        loadJS: function (url, callback) {
            var done = false;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.language = 'javascript';
            script.src = url;
            script.onload = script.onreadystatechange = function (){
                if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
                    done = true;
                    script.onload = script.onreadystatechange = null;
                    typeof callback === 'function' && callback.call(script);
                }
            }
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        /**
         * 异步执行script标签，和loadJS方法不同的是，该方法不会在head标签中保留script标签
         * @param {string} url js文件路径
         * @param {function} callback js加载成功(执行完毕)后的回调函数
         */
        runJS: function (url, callback) {
            this.loadJS(url, function () {
                document.getElementsByTagName('head')[0].removeChild(this);
                typeof callback === 'function' && callback();
            });
        }
    };

    ///////////////////////////// 地图公用控件 - 测试版 ///////////////////////////////
    function PaneMapSearch(map, iptSch, paneSchRes) {
        this.map = map;
        this.$iptSch = $(iptSch);
        this.$paneSchRes = $(paneSchRes);
        this.$liSets = [];

        this.rs = null;
        this.rsCount = 0;
        this.showLimits = 5;
        this.curSelect = -1;
        this.isPaneShow = false;

        this.bindEvents();
        this.$iptSch.parent('div').show();
    }

    PaneMapSearch.prototype.bindEvents = function () {
        var _this = this;
        // add key event on search input box in the map
        this.$iptSch.keyup(function (e) {
            var kc = e.keyCode;
            switch(kc) {
                // up
                case 38:
                    _this.prev();
                    e.preventDefault();
                    break;
                // down
                case 40:
                    _this.next();
                    e.preventDefault();
                    break;
                // enter
                case 13:
                    _this.doSearch();
                    break;
                default:
                    _this.autoComplete();
                    break;
            }
        });

        // add click event on search items
        this.$paneSchRes.on('click', 'a', function (e) {
            var $this = $(this);
            var index = $this.attr('data-sort') || 0;
            _this.to(index);
            _this.doSearch();
            e.preventDefault();
        });
    };

    PaneMapSearch.prototype.showPane = function () {
        this.$paneSchRes.show();
        this.isPaneShow = true;
    };

    PaneMapSearch.prototype.hidePane = function () {
        this.$paneSchRes.hide();
        this.isPaneShow = false;
    };

    PaneMapSearch.prototype.prev = function () {
        this.to(this.curSelect-1);
    };

    PaneMapSearch.prototype.next = function () {
        this.to(this.curSelect+1);
    };

    PaneMapSearch.prototype.to = function (index) {
        if(!this.isPaneShow) {
            this.showPane();
            return;
        }
        index = Math.min(Math.max(0, index), this.rsCount-1);
        if(index === this.curSelect) return;
        this.curSelect = index;
        this.$liSets.removeClass('on');
        this.$liSets.eq(index).addClass('on');
        this.$iptSch.val(this.rs[index].name);
    };

    PaneMapSearch.prototype.doSearch = function () {
        var _this = this;
        var keywords = this.$iptSch.val().trim();
        var options;
        if(keywords === '') return;
        _this.hidePane();
        if(this.curSelect > -1) {
            options = {
                pageSize: 1,
                city: this.rs[this.curSelect].adcode
            }
        }
        this.map.placeSearch(keywords, options, function (rs) {
            if(rs.status !== 0) return;
            rs = rs.data;
            // 2 conditions
            if(_this.curSelect < 0) {
                _this.map.setCenter(rs[0].lng, rs[0].lat);
                _this.map.setZoom(15);
            } else {
                _this.map.trigger('click', {lnglat: rs[0]});
            }
        });
    };

    PaneMapSearch.prototype.autoComplete = function () {
        var _this = this;
        var keywords = this.$iptSch.val().trim();
        keywords = keywords.replace(/[\\\?\.\+\^\$]/g, '');
        if(keywords === '') return;
        this.map.search(keywords, function (rs) {
            if(rs.status !== 0) return;
            rs = rs.data;
            var arrHtml = [];
            // update value
            _this.rsCount = Math.min(rs.length, _this.showLimits);
            _this.rs = rs;
            _this.curSelect = -1;
            if( _this.rsCount <= 0 ) {
                _this.hidePane();
                return;
            }
            for(var i = 0; i < _this.rsCount; i++) {
                arrHtml.push('<li><a data-sort="'+i+'" href="javascript:;"><span class="rs-name">'+
                    rs[i].name.replace(new RegExp(keywords.replace(/([\(\)])/g, '\\$1')),
                    '<span class="keywords">'+keywords+'</span>')+'</span><span class="rs-district">'+
                    rs[i].district+'</span</a></li>');
            };
            _this.$paneSchRes.html(arrHtml.join(''));
            _this.showPane();
            _this.$liSets = _this.$paneSchRes.children('li');
        });
    };

    PaneMapSearch.prototype.destroy = function () {
        this.$iptSch.unbind();
        this.$paneSchRes.off();
    };

    ///////////////////////////////////////////////////////////////////

    var BaseMap = function (options) {
        this.options = $.extend({}, defaults, options);
        this.markers = [];
    };

    BaseMap.load = function (type, callback) {
        var _this = this;
        var url = CONSTS[type].url;
        var params = CONSTS[type].params;
        var p = [];
        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                p.push(i+'='+params[i]);
            }
        }
        if(p.length) url = url+'?';
        util.runJS(url+p.join('&'), function () {
            window.console && console.log('load JS: '+url+' success!');
            typeof callback && callback.call(_this);
        });
    };

    /**
     * 高德地图类
     * @param {object} options 用户自定义配置文件
     */
    var GDMap = function (options) {
        BaseMap.call(this, options);
        this.markers = [];
        this.controls = [];
        this.zoom = 15;
        this.init();
    };

    // 静态函数
    GDMap.load = function (options, callback) {
        if(typeof options === 'function') {
            callback = options;
            options = null;
        }
        if(!GDMap.isLoaded()) {
            BaseMap.load('AMap', function () {callback(new GDMap(options));});
        } else {
            callback(new GDMap(options));
        }
    };

    GDMap.isLoaded = function () {
        return window.AMap && window.AMap.Map;
    };

    // 原型函数
    GDMap.prototype.init = function () {
        this.map = new AMap.Map(this.options.mapContainer, {
            resizeEnable: true,
            view: new AMap.View2D({
                zoom: this.zoom
            })
        });
    };

    GDMap.prototype.setCenter = function (lng, lat) {
        return this.map.setCenter(this.getPoint(lng, lat));
    };

    GDMap.prototype.setZoom = function (level) {
        return this.map.setZoom(level);
    };

    GDMap.prototype.getPoint = function (lng, lat) {
        return new AMap.LngLat(lng,lat);
    };

    GDMap.prototype.addMarker = function (lng, lat) {
        var marker;
        lng = lng || this.options.defaultLng;
        lat = lat || this.options.defaultLat;
        marker = new AMap.Marker({
            map: this.map,
            icon: this.options.markerImgPath,
            position: this.getPoint(lng, lat)
        });
        marker && this.markers.push(marker);
        return marker;
    };

    GDMap.prototype.removeMarker = function (marker) {
        var removed;
        for (var i = this.markers.length-1; i >= 0; i--) {
            if(this.markers[i] === marker) {
                removed = this.markers.splice(i, 1);
                removed.setMap(null);
            }
        };
    };

    GDMap.prototype.removeAllMarkers = function () {
        for (var i = this.markers.length-1; i >= 0; i--) {
            this.markers[i].setMap(null);
        }
        this.markers.length = 0;
    };

    GDMap.prototype.addListener = function (eventName, handler) {
        AMap.event.addListener(this.map, eventName, handler);
    };

    GDMap.prototype.trigger = function (eventName, args) {
        AMap.event.trigger(this.map, eventName, args);
    };

    // 根据给定的坐标进行解析
    GDMap.prototype.getAddress = function (lng, lat, callback) {
        var _this = this;
        var geocoder;
        var format = [], statusCode = -1;
        // 加载地理编码
        AMap.service(["AMap.Geocoder"], function () {
            var geocoder = new AMap.Geocoder();
            // 通过服务对应的方法回调服务返回结果
            geocoder.getAddress(_this.getPoint(lng, lat), function (status, rs){
                var geoinfo = rs.regeocode;
                if(status === 'complete' && rs.info === 'OK') {
                    format.push({
                        name: geoinfo.formattedAddress,
                        components: {
                            city: geoinfo.addressComponent.city,
                            province: geoinfo.addressComponent.province
                        }
                    });
                    statusCode = 0;
                }
                typeof callback === 'function' && callback({status: statusCode, data: format});
            });
        });
    };

    /**
     * 根据给定的地址关键字进行解析
     * @return [{lng:1, lat:1}, {lng:2, lat:2},...]
     */
    GDMap.prototype.getLocation = function (addr, callback) {
        var _this = this;
        var format = [], statusCode = -1;
        // 加载地理编码
        AMap.service(["AMap.Geocoder"], function () {
            var geocoder = new AMap.Geocoder();
            geocoder.getLocation(addr, function (status, rs) {
                var point;
                if(status === 'complete' && rs.info === 'OK') {
                    // format data
                    for(var i = 0, len = rs.geocodes.length; i < len; i += 1) {
                        point = rs.geocodes[i].location;
                        format.push({lng: point.lng, lat: point.lat});
                    }
                    statusCode = 0;
                }
                typeof callback === 'function' && callback( {status: statusCode, data: format} );
            });
        });
    };

    GDMap.prototype.search = function (keywords, callback) {
        var format = [], statusCode = -1;
        AMap.service(['AMap.Autocomplete'], function () {
            var auto = new AMap.Autocomplete();
            if(keywords.length > 0) {
                auto.search(keywords, function (status, result) {
                    if(status === 'complete' && result.info === 'OK') {
                        // format the data
                        for (var i = 0, len = result.tips.length; i < len; i++) {
                            format.push({
                                name: result.tips[i].name,
                                district: result.tips[i].district,
                                adcode: result.tips[i].adcode
                            });
                        };
                        statusCode = 0;
                        typeof callback === 'function' && callback({status: statusCode, data: format});
                    }
                });
            }
        });
    };

    GDMap.prototype.placeSearch = function (keywords, options, callback) {
        var pSearch;
        if(typeof options === 'function') {
            callback = options;
            options = null;
        }
        AMap.service(['AMap.PlaceSearch'], function () {
            pSearch = new AMap.PlaceSearch(options);
            pSearch.search(keywords, function (status, rs) {
                var format = [], statusCode = -1;
                var row;
                if(status === 'complete' && rs.info === 'OK') {
                    for (var i = 0, len = rs.poiList.pois.length; i < len; i++) {
                        row = rs.poiList.pois[i];
                        format.push({
                            lng: row.location.getLng(),
                            lat: row.location.getLat(),
                            address: row.address
                        });
                    }
                    statusCode = 0;
                }
                typeof callback === 'function' && callback({status: statusCode, data: format});
            });
        });
    };

    GDMap.prototype.setFitView = function () {
        this.map.setFitView();
    };

    GDMap.prototype.addSearchBox = function (iptSch, mapSchPane) {
        this.controls.push(new PaneMapSearch(this, iptSch, mapSchPane));
    };

    GDMap.prototype.destroy = function () {
        // destroy custom UI controls
        for (var i = this.controls.length - 1; i >= 0; i--) {
            if(typeof this.controls[i].destroy !== 'function') {
                console.warn('one map UI control not destroy!');
                continue;
            }
            this.controls[i].destroy();
        };
        this.map.destroy();
    };

    /**
     * 谷歌地图类
     * @param {object} options 用户自定义配置文件
     */
    var GoogleMap = function (options) {
        BaseMap.call(this, options);
        this.markers = [];
        this.controls = [];
        this.zoom = 16;

        this.init();
    };

    GoogleMap.load = function (options, callback) {
        if(typeof options === 'function') {
            callback = options;
            options = null;
        }
        if(!GoogleMap.isLoaded()) {
            BaseMap.load('GLoader', function () {
                var params = CONSTS['GMap'].params;
                var p = [];
                for (var i in params) {
                    if (params.hasOwnProperty(i)) {
                        p.push(i+'='+params[i]);
                    }
                }
                google.load('maps', 3, {other_params: p.join('&'), callback: function () {
                    callback(new GoogleMap(options));
                }});
            });
        } else {
            callback(new GoogleMap(options));
        }
    };

    GoogleMap.isLoaded = function () {
        return window.google && window.google.maps;
    };

    GoogleMap.prototype.init = function () {
        this.map = new google.maps.Map($('#' + this.options.mapContainer)[0], {
            zoom: this.zoom,
            disableDefaultUI: true,
            center: this.getPoint(this.options.defaultLng, this.options.defaultLat)
        });
    };

    GoogleMap.prototype.setCenter = function (lng, lat) {
        return this.map.setCenter(this.getPoint(lng, lat));
    };

    GoogleMap.prototype.setZoom = function (level) {
        return this.map.setZoom(level);
    };

    GoogleMap.prototype.getPoint = function (lng, lat) {
        return new google.maps.LatLng(lat, lng);
    };

    GoogleMap.prototype.addMarker = function (lng, lat) {
        var marker;
        lng = lng || this.options.defaultLng;
        lat = lat || this.options.defaultLat;
        marker = new google.maps.Marker({
            map: this.map,
            icon: this.options.markerImgPath,
            position: this.getPoint(lng, lat)
        });
        marker && this.markers.push(marker);
        return marker;
    };

    GoogleMap.prototype.removeMarker = function (marker) {
        var removed;
        for (var i = this.markers.length-1; i >= 0; i--) {
            if(this.markers[i] === marker) {
                removed = this.markers.splice(i, 1);
                removed.setMap(null);
            }
        };
    };

    GoogleMap.prototype.removeAllMarkers = function () {
        for (var i = this.markers.length-1; i >= 0; i--) {
            this.markers[i].setMap(null);
        }
        this.markers.length = 0;
    };

    GoogleMap.prototype.addListener = function (eventName, handler) {
        var _this = this;
        return google.maps.event.addListener(this.map, eventName, function (e) {
            // TODO: 可能不适用click以外的事件返回对象，待验证
            _this.formatEventResult(e);
            handler.call(this, e);
        });
    };

    GoogleMap.prototype.removeAllListener = function () {
        google.maps.event.clearInstanceListeners(this.map);
    };

    GoogleMap.prototype.trigger = function (eventName, args) {
        args.latLng = args.lnglat;
        return google.maps.event.trigger(this.map, eventName, args);
    };

    GoogleMap.prototype.formatEventResult = function (rs) {
        rs.lnglat = {
            lng: rs.latLng.lng(),
            lat: rs.latLng.lat()
        };
    };

    // 地理编码
    GoogleMap.prototype.getAddress = function (lng, lat, callback) {
        var _this = this;
        var geocoder = new google.maps.Geocoder();
        var format = [], statusCode = -1;
        geocoder.geocode({latLng: this.getPoint(lng, lat)}, function (rs, status) {
            if(status == google.maps.GeocoderStatus.OK) {
                for (var i = 0, len = rs.length; i < len; i++) {
                    format.push({
                        name: rs[0].formatted_address,
                        components: _this._formatAddressComponents(rs[i].address_components)
                    });
                };
                statusCode = 0;
            }
            typeof callback === 'function' && callback({status: statusCode, data: format});
        });
    };

    // 地理逆编码
    GoogleMap.prototype.getLocation = function (addr, callback) {
        var geocoder = new google.maps.Geocoder();
        var format = [], statusCode = -1;
        geocoder.geocode({address: addr}, function (rs, status) {
            if(status == google.maps.GeocoderStatus.OK) {
                for (var i = 0, len = rs.length; i < len; i++) {
                    format.push({
                        name: rs[i].formatted_address,
                        lng: rs[i].geometry.location.lng(),
                        lat: rs[i].geometry.location.lat()
                    });
                };
                statusCode = 0;
            }
            typeof callback === 'function' && callback({status: statusCode, data: format});
        });
    };

    GoogleMap.prototype.search = function (keywords, callback) {};

    GoogleMap.prototype.setFitView = function () {
        if(this.markers.length <= 0) return;
        this.map.panTo(this.markers[0].getPosition());
    };

    GoogleMap.prototype.addSearchBox = function (iptSch) {
        var _this = this;
        // TODO 这里写死的
        var input = document.getElementById('btnGoogleSch');
        var searchBox;

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        searchBox = new google.maps.places.SearchBox((input));
        google.maps.event.addListener(searchBox, 'places_changed', function () {
            var places = searchBox.getPlaces();
            if(places.length <= 0) return;
            _this.trigger('click', {latLng: places[0].geometry.location});
        });
        input.style.display = '';
    };

    GoogleMap.prototype.destroy = function () {
        // destroy custom UI controls
        for (var i = this.controls.length - 1; i >= 0; i--) {
            if(typeof this.controls[i].destroy !== 'function') {
                console.warn('one map UI control does not destroy!');
                continue;
            }
            this.controls[i].destroy();
        };
        this.removeAllMarkers();
        this.removeAllListener();
    };

    // private method
    GoogleMap.prototype._formatAddressComponents = function (addressComponents, type) {
        var format = {};
        for (var i = addressComponents.length - 1; i >= 0; i--) {
            switch(addressComponents[i].types[0]) {
                case 'administrative_area_level_1':
                    format.province = addressComponents[i].long_name;
                break;
                case 'locality':
                    format.city = addressComponents[i].long_name;
                break;
            }
        }
        return format;
    };

    nsBaseMap.load = function (callback) {
        if (I18n.type.indexOf('zh') > -1) {
            GDMap.load(callback);
        } else {
            GoogleMap.load(callback);
        }
    };


} (window, jQuery, beop.baseMap, undefined));
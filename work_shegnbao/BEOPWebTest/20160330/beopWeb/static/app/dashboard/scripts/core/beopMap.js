var beop;
(function (beop) {

    var configMap = {
        AmapKey: '9cc89c68a4bd6f3f5f65589f85ad7685',
        AmapUrl: 'http://webapi.amap.com/maps',
        AmapVersion: '1.3',
        GmapKey: 'AIzaSyAzzOzAmrGov5GLacve9w8_Q8dS-xBYCgc',
        GmapUrl: 'https://maps.googleapis.com/maps/api/js',
        GmapVersion: '3.0',
        mapContainer: 'map-canvas',
        project_img_path: 'http://images.rnbtech.com.hk/static/images/project_img/',
        mapLoadCallBack: 'mapLoadCallBack',
        defaultLatlng: '31.2114943,121.6283679',
        projectStatus: {
            online: 'Online',
            offline: 'Offline'
        },
        online_img_path: 'http://images.rnbtech.com.hk/static/images/map_marker_online.png',
        offline_img_path: 'http://images.rnbtech.com.hk/static/images/map_marker_offline.png',
        neighbouringRadius: 80000, //附近项目半径,单位米
        loadMapTimeout: 3000
    };

    function inherits(clazz, base) {
        var clazzPrototype = clazz.prototype;

        function F() {
        }

        F.prototype = base.prototype;
        clazz.prototype = new F();
        for (var prop in clazzPrototype) {
            clazz.prototype[prop] = clazzPrototype[prop];
        }
        clazz.constructor = clazz;
    }

    function buildSrc(url, opts) {
        if (!url) {
            return null
        }
        if (!opts) {
            return url
        }
        var paramArr = [];
        for (var prop in opts) {
            if (opts[prop]) {
                paramArr.push(prop + '=' + opts[prop]);
            }
        }
        return url + '?' + paramArr.join('&');
    }


    function getProject(id) {
        for (var n = 0, len = ProjectConfig.projectList.length; n < len; n++) {
            var item = ProjectConfig.projectList[n];
            if (item.id == id) {
                return item;
            }
        }
    }


    /******* 地图基类 *******/
    function BeopMap() {
        this.url = '';
        this.key = '';
        this.container = configMap.mapContainer;
        this.map = null;
        this.zoom = 5;
        this.markers = {};
        this.infoWindows = {};
        this.$projectInfo = $('#divProjectInfo');//项目详细信息表格
        this.projectIndex = undefined;
    }


    BeopMap.prototype.init = function () {
        //this.initPaneProject();
        //I18n.fillArea(this.$projectsCard);
        //I18n.fillArea(this.$projectDetailCard);
    };


    BeopMap.prototype.initPaneProject = function () {
        var _this = this;
        _this.initSingleProject(ProjectConfig.projectInfo);
        var swipeEnable = true;
        this.$projectInfo.off('touchstart').on('touchstart', '.iconHide', function (e) {
            e.stopPropagation();
            $('.iconHide').css('display', 'none');
            $('.iconShow').css('display', 'inline-block');
            _this.$projectInfo.animate({
                opacity: 0.25,
                bottom: '-30%'
            }, 500, function () {
                // Animation complete.
            });
        }).on('touchstart', '.iconShow', function (e) {
            e.stopPropagation();
            $('.iconHide').css('display', 'inline-block');
            $('.iconShow').css('display', 'none');
            _this.$projectInfo.animate({
                opacity: 1,
                bottom: 0
            }, 500, function () {
                // Animation complete.
            });
        });
        //var detailSwipe = new Hammer(this.$projectInfo[0]);
        //detailSwipe.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        this.$projectInfo.off('swipeDown').on('swipeDown', function () {
            $('.iconHide').css('display', 'none');
            $('.iconShow').css('display', 'inline-block');
            _this.$projectInfo.animate({
                opacity: 0.25,
                bottom: '-30%'
            }, 500, function () {
                // Animation complete.
            });
        });
        this.$projectInfo.off('swipeUp').on('swipeUp', function () {
            $('.iconHide').css('display', 'inline-block');
            $('.iconShow').css('display', 'none');
            _this.$projectInfo.animate({
                opacity: 1,
                bottom: 0
            }, 500, function () {
                // Animation complete.
            });
        });
        this.$projectInfo.off('swipeLeft').on('swipeLeft', function () {
            var length = $('.divDetail').length;
            if (_this.projectIndex >= length - 1 || !swipeEnable)return;
            _this.projectIndex += 1;
            swipeEnable = false;
            _this.$projectInfo.animate({
                left: (-100 * _this.projectIndex) + '%'
            }, 500, function () {
                swipeEnable = true;
                // Animation complete.
            });
        });
        this.$projectInfo.off('swipeRight').on('swipeRight', function () {
            var length = $('.divDetail').length;
            if (_this.projectIndex <= 0 || !swipeEnable)return;
            _this.projectIndex -= 1;
            swipeEnable = false;
            _this.$projectInfo.animate({
                left: (-100 * _this.projectIndex) + '%'
            }, 500, function () {
                swipeEnable = true;
                // Animation complete.
            });
        });
    };

    BeopMap.prototype.loadMapScriptFailed = function (msg) {
        console.log(this.mapName + I18n.resource.core.beopMap.LOADED_FAILED);
        if (msg) {
            console.log(msg);
        }
    };

    BeopMap.prototype.loadScript = function (opts) {
        if (!opts) {
            opts = {};
        }
        $.extend(opts, {key: this.key});
        var src = buildSrc(this.url, opts), _this = this;
        $.ajax({
            url: src,
            dataType: "script",
            success: function () {
                if (_this instanceof GoogleMap) {
                    //正常流程:google先success函数再callback函数
                    //高德地图先callback函数再success函数
                    isMapAsyncLoadSuccess = true;
                }

                if (typeof isMapAsyncLoadSuccess == 'undefined' && _this instanceof GaodeMap) {
                    //高德地图第一次加载时候,会出现先success在callback情况
                    isMapAsyncLoadSuccess = false;
                    return false;
                }

                if (isMapAsyncLoadSuccess) {
                    //防止地图加载失败,如高德地图服务器更新导致失败
                    console.log(_this.mapName + I18n.resource.core.beopMap.LOADED_SUCCESSFUL + '.');
                } else {
                    _this.loadMapScriptFailed('');
                }
            },
            error: function (jqXHR, errorText) {
                _this.loadMapScriptFailed(errorText);
            },
            timeout: configMap.loadMapTimeout
        });
    };

    BeopMap.prototype.clickMarker = function (marker) {
        if (!marker) {
            return;
        }
        this.trigger(marker, 'click');
    };

    BeopMap.prototype.getInfoWindowContent = function (project) {
        var info = [];
        info.push("<div style=\"padding:0px 0px 0px 4px;\"><b>" + StringUtil.getI18nProjectName(project) + "</b>");
        if (project.online) {
            info.push(I18n.resource.admin.projectSelector.PROJECT_STATUS + " : " + project.online);
        }
        if (project.lastReceivedTime) {
            info.push(I18n.resource.admin.projectSelector.PROJECT_LAST_RECEIVED_TIME + " : " + project.lastReceivedTime);
        }

        info.push("</div'>");
        return info.join('<br/>')
    };
    BeopMap.prototype.getMarkerImagePath = function (isOnline) {
        return isOnline ? configMap.online_img_path : configMap.offline_img_path;
    };

    BeopMap.prototype.expandNearbyProject = function () {
        if (this.$nearbyProjects.find('.media').length === 0) {
            return;
        }
        this.$nearbyProjects.slideDown(500);
    };

    BeopMap.prototype.addMarkers = function (markerCollection) {
        var item, marker, infoWindow, isOnline;
        if (!markerCollection || !markerCollection.length) {
            return false
        }
        var _this = this;
        for (var m = 0; m < markerCollection.length; m++) {
            item = markerCollection[m];
            isOnline = item.online && item.online === configMap.projectStatus.online ? true : false;
            marker = this.addMarker(item.id, item.latlng, isOnline);
            if (!marker) {
                continue;
            }
            infoWindow = this.addInfoWindow(item.id, this.getInfoWindowContent(item));
            _this.addMarkerClick(marker, (function (item) {
                return function () {
                    _this.initSingleProject(item);
                }
            })(item));
        }
    };


    BeopMap.prototype.renderNearbyProjects = function (projectList) {
        var $projectsContainer = this.$nearbyProjects.find('.projects-section');
        $projectsContainer.empty();
        for (var m = 0, len = projectList.length; m < len; m++) {
            $projectsContainer.append(this.createProjectItemOfCard(projectList[m]));
        }
    };

    BeopMap.prototype.createProjectItemOfCard = function (project) {
        var projectName = StringUtil.getI18nProjectName(project);
        var divMedia = $('<div class="media wobble-horizontal"><a class="pull-left"><img class="media-object" src="' + BEOPUtil.getProjectImgPath(project) + '" style="width: 48px; height: 48px;"></a></div>')
        divMedia.attr('id', project.id + "-" + project.name_en + "-" + project.level);
        divMedia.attr('title', projectName);
        var divMediaBody = $('<div class="media-body"></div>')
            .append($('<h4 class="media-heading"></h4>').text(projectName));
        divMedia.append(divMediaBody);
        return divMedia;
    };

    BeopMap.prototype.expandProjectPanel = function (callback) {
        this.$projectDetailCard.slideDown("normal", callback ? callback.bind(this) : $.noop);
    };

    BeopMap.prototype.collapseProjectPanel = function (callback) {
        this.$projectDetailCard.slideUp("normal", callback ? callback.bind(this) : $.noop);
    };

    BeopMap.prototype.addToVersionHistory = function () {
        var versionHistory = window.localStorage.getItem('versionHistory'), $controlBtn;
        if (!versionHistory) {
            $controlBtn = this.createVersionHistory('获取最新版本失败，请重新登陆');
        } else {
            $controlBtn = this.createVersionHistory(versionHistory);
        }
        this.addControl($controlBtn, function () {
            ScreenManager.goTo({
                page: 'VersionHistory'
            });
        })
    };
    BeopMap.prototype.createVersionHistory = function (text) {
        var versionHistoryUI;
        versionHistoryUI = $('<div class="map-beop-version-history" title="beop版本历史记录"><a href="#page=VersionHistory"> beop version: ' + text + ' </a></div>');
        return versionHistoryUI;
    };
    BeopMap.prototype.loadProjectPanel = function (project) {
        if (!project) {
            return false;
        }
        var name = StringUtil.getI18nProjectName(project);
        this.$projectDetailCard.attr('project-id', project.id)
            .find('.project-img').attr('src', BEOPUtil.getProjectImgPath(project)).attr('alt', name).end()
            .find('.name').text(name);
        if (!project.address) {
            this.$projectDetailCard.find('.address').hide();
        } else {
            this.$projectDetailCard.find('.address').show().find('address').text(project.address);
        }
    };


    BeopMap.prototype.initSingleProject = function (project) {
        var _this = this;
        this.projectIndex = 0;
        this.$projectInfo.children().not(':first-child').remove();
        this.$projectInfo.css('left', 0);
        var nearbyProjectList = _this.getNearbyProjects(project.id, configMap.neighbouringRadius);
        var divWidth = 100 / (nearbyProjectList.length + 1);
        var $projectName = $('.projectName');
        var $main = $('.mainDetail');
        $projectName.html(project.name_cn);
        $main.find('.iconSelect').remove();
        if (ProjectConfig.projectId == project.id) {
            $main.append('<span class="iconSelect"></span>');
        }
        $main.attr('project-to', project.id);
        $main.css({
            'background-image': 'url(http://images.rnbtech.com.hk/static/images/project_img/' + project.pic + ')',
            'width': divWidth + '%'
        });
        _this.openInfoWindow(_this.infoWindows[project.id], _this.markers[project.id]);
        var strNearby;
        for (var i = 0; i < nearbyProjectList.length; i++) {
            strNearby = new StringBuilder();
            strNearby.append('<div class="divDetail nearbyDetail zepto-ev" project-to="' + nearbyProjectList[i].id + '"style="width:' + divWidth + '%;background-image:url(http://images.rnbtech.com.hk/static/images/project_img/' + nearbyProjectList[i].pic + ')">');
            strNearby.append('<div class="divInfo"><span class="projectName">' + nearbyProjectList[i].name_cn + '</span>');
            strNearby.append('<span class="iconShow glyphicon glyphicon-chevron-up"></span>');
            strNearby.append('<span class="iconHide glyphicon glyphicon-remove"></span></div>');
            strNearby.append('</div>');
            this.$projectInfo.append(strNearby.toString());
        }
        var $divDetail = $('.divDetail');
        this.$projectInfo.css('width', (100 * (nearbyProjectList.length + 1)) + '%');
        //$divDetail.css('width',(100 / (nearbyProjectList.length + 1)) +'%');
        $divDetail.off('tap').on('tap', function (e) {
            if ($(e.gesture.target).hasClass('glyphicon'))return;
            var id = $(e.currentTarget).attr('project-to');
            for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                if (ProjectConfig.projectList[i].id == id) {
                    ProjectConfig.projectInfo = ProjectConfig.projectList[i];
                    router.to({
                        typeClass: ProjectSummary,
                        data: {
                            index: i
                        }
                    });
                    break;
                }
            }
        });
        //_this.renderNearbyProjects(nearbyProjectList);
    };

    BeopMap.prototype.setFitView = function () {
    };

    BeopMap.prototype.getNearbyProjects = function (centerProjectId, radius) {
        var centerProjectMarker = this.markers[centerProjectId],
            centerProjectLnglat = this.getMarkerPosition(centerProjectMarker),
            nearbyList = [];
        for (var projectId in this.markers) {
            if ((projectId + '') === (centerProjectId + '')) {
                continue;
            }
            var marker = this.markers[projectId], markLnglat = this.getMarkerPosition(marker);
            if (this.computeDistanceBetween(centerProjectLnglat, markLnglat) <= radius) {
                nearbyList.push(getProject(projectId));
            }
        }
        return nearbyList;
    };

    /******* 高德地图 *******/
    function GaodeMap() {
        BeopMap.call(this);
        this.url = configMap.AmapUrl;
        this.key = configMap.AmapKey;
        this.mapName = I18n.resource.core.beopMap.AMAP;
    }

    GaodeMap.prototype.init = function () {
        BeopMap.prototype.init.call(this);
        if (this.map) {
            this.map.destroy && this.map.destroy();
        }
        this.map = new AMap.Map(this.container, {
            view: new AMap.View2D({
                zoom: this.zoom,
                scrollWheel: false
            })
        });
    };

    GaodeMap.prototype.getLatLng = function (lat, lng) {
        return new AMap.LngLat(lng, lat);
    };

    GaodeMap.prototype.isMapLoaded = function () {
        try {
            if (AMap && AMap.Map) {
                return true;
            }
        } catch (e) {
            return false;
        }
    };

    GaodeMap.prototype.addControl = function ($controlUI, callback) {
        var _this = this;
        var controlDiv = function () {
        };
        controlDiv.prototype = {
            addTo: function (map, dom) {
                dom.appendChild(this._getHtmlDom(map));
            },
            _getHtmlDom: function (map) {
                this.map = map;
                $controlUI.click(function () {
                    callback.call(_this);
                });
                this.container = $controlUI[0];
                return $controlUI[0];
            }
        };
        this.map.addControl(new controlDiv(this.map));
    };


    GaodeMap.prototype.load = function () {
        if (this.isMapLoaded()) {
            mapLoadCallBack();
        } else {
            this.loadScript({v: configMap.AmapVersion, callback: configMap.mapLoadCallBack});
        }
    };

    GaodeMap.prototype.trigger = function (instance, eventName, var_args) {
        AMap.event.trigger(instance, eventName, var_args)
    };

    GaodeMap.prototype.openInfoWindow = function (infoWindow, marker) {
        infoWindow.open(this.map, marker.getPosition());
    };

    GaodeMap.prototype.addMarker = function (identifier, lnglat, isOnline, opts) {
        if (!identifier || !lnglat) {
            return null;
        }
        if (!lnglat) {
            lnglat = configMap.defaultLatlng;
        }
        if (typeof lnglat === 'string') {
            var temp = lnglat.split(',');
            lnglat = {'lat': +temp[0], 'lng': +temp[1]};
        }
        var defaultOpts = {
            map: this.map,
            position: this.getLatLng(lnglat.lat, lnglat.lng),
            offset: new AMap.Pixel(-8, -8),
            content: '<div class="map-marker" data-id="' + identifier + '"></div>',
            extData: {id: identifier}
            // icon: this.getMarkerImagePath(isOnline)
        };
        if (opts) {
            $.extend(defaultOpts, opts);
        }

        var marker = new AMap.Marker(defaultOpts);
        this.markers[identifier] = marker;
        return marker;
    };

    GaodeMap.prototype.removeMarker = function (identifier) {
        if (!identifier) {
            return false
        }
        var marker = this.markers[identifier];
        if (!marker) {
            return false;
        }
        marker.setMap(null);
        return true;
    };

    GaodeMap.prototype.addInfoWindow = function (id, content) {
        var infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, 0),
            content: content
        });
        this.infoWindows[id] = infoWindow;
        return infoWindow;
    };


    GaodeMap.prototype.addMarkerClick = function (marker, eventFunc) {
        var _this = this;
        AMap.event.addListener(marker, 'click', function () {
            eventFunc.call(_this);
        });
    };

    GaodeMap.prototype.setFitView = function () {
        this.map.setFitView();
    };

    GaodeMap.prototype.computeDistanceBetween = function (from, to) {
        if (!from || !to) {
            return
        }
        return from.distance(to);
    };

    GaodeMap.prototype.getMarkerPosition = function (marker) {
        if (!marker) {
            return
        }
        return marker.getPosition();
    };

    GaodeMap.prototype.closeAllInfoWindow = function () {
        //this.map.clearInfoWindow();
    };

    inherits(GaodeMap, BeopMap);

    /******* google地图 *******/
    function GoogleMap() {
        BeopMap.call(this);
        this.url = configMap.GmapUrl;
        this.key = configMap.GmapKey;
        this.zoom = 4;
        this.mapName = 'google' + I18n.resource.core.beopMap.MAP;
    }

    GoogleMap.prototype.init = function () {
        BeopMap.prototype.init.call(this);
        this.map = new google.maps.Map($('#' + this.container)[0], {
            zoom: this.zoom,
            disableDefaultUI: true
        });

        // init GMarker
        GMarker = function (latlng, map, args) {
            this.latlng = latlng;
            this.args = args;
            this.setMap(map);
        }
        GMarker.prototype = new google.maps.OverlayView();
        GMarker.prototype.draw = function () {

            var self = this;

            var div = this.div;

            if (!div) {

                div = this.div = document.createElement('div');

                div.className = 'map-marker';

                div.style.position = 'absolute';

                if (typeof(self.args.id) !== 'undefined') {
                    div.dataset.id = self.args.id;
                }

                google.maps.event.addDomListener(div, "click", function (event) {
                    // alert('You clicked on a custom marker!');           
                    google.maps.event.trigger(self, "click");
                });

                var panes = this.getPanes();
                panes.overlayImage.appendChild(div);
            }

            var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

            if (point) {
                div.style.left = (point.x - 8) + 'px';
                div.style.top = (point.y - 8) + 'px';
            }
        };

        GMarker.prototype.onRemove = function () {
            if (this.div) {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
            }
        };

        GMarker.prototype.getPosition = function () {
            return this.latlng;
        };

        GMarker.prototype.getExtData = function () {
            return this.args;
        };

        GMarker.prototype.show = function () {
            this.div.style.display = '';
        };

        GMarker.prototype.hide = function () {
            this.div.style.display = 'none';
        };
    };

    GoogleMap.prototype.isMapLoaded = function () {
        try {
            if (google && google.maps) {
                return true;
            }
        } catch (e) {
            return false;
        }
    };

    GoogleMap.prototype.load = function () {
        if (this.isMapLoaded()) {
            mapLoadCallBack();
        } else {
            this.loadScript({
                callback: configMap.mapLoadCallBack,
                sensor: false,
                libraries: 'geometry,places',
                language: 'en'
            });
        }
    };

    GoogleMap.prototype.getLatLng = function (lat, lng) {
        return new google.maps.LatLng(lat, lng);
    };

    GoogleMap.prototype.openInfoWindow = function (infoWindow, marker) {
        infoWindow.open(this.map, marker);
    };

    GoogleMap.prototype.addMarker = function (identifier, lnglat, isOnline, opts) {
        if (!identifier || !lnglat) {
            return null;
        }
        if (typeof lnglat === 'string') {
            var temp = lnglat.split(',');
            lnglat = {'lat': +temp[0], 'lng': +temp[1]};
        }
        // var defaultOpts = {
        //     map: this.map,
        //     position: this.getLatLng(lnglat.lat, lnglat.lng),
        //     icon: this.getMarkerImagePath(isOnline)
        // };
        if (opts) {
            $.extend(defaultOpts, opts);
        }

        // var marker = new google.maps.Marker(defaultOpts);

        // use custom marker
        var marker = new GMarker(
            this.getLatLng(lnglat.lat, lnglat.lng),
            this.map,
            {
                id: identifier
            }
        );

        this.markers[identifier] = marker;
        return marker;
    };

    GoogleMap.prototype.addInfoWindow = function (id, content) {
        var infoWindow = new google.maps.InfoWindow({
            content: content,
            pixelOffset: new google.maps.Size(0, 0)
        });
        this.infoWindows[id] = infoWindow;
        return infoWindow;
    };

    GoogleMap.prototype.addControl = function ($controlUI, callback) {
        var _this = this, controlUIDom = $controlUI[0];
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlUIDom);
        google.maps.event.addDomListener(controlUIDom, 'click', function () {
            callback.call(_this);
        });
    };

    GoogleMap.prototype.closeAllInfoWindow = function () {
        for (var m = 0, len = this.infoWindows.length; m < len; m++) {
            this.infoWindows[m].close();
        }
    };


    GoogleMap.prototype.addMarkerClick = function (marker, eventFunc) {
        var _this = this;
        google.maps.event.addListener(marker, 'click', function () {
            _this.closeAllInfoWindow();
            eventFunc.call(_this);
        });
    };

    GoogleMap.prototype.setFitView = function () {
        var bounds = new google.maps.LatLngBounds();
        for (var project in this.markers) {
            bounds.extend(this.markers[project].getPosition());
        }
        this.map.fitBounds(bounds);
    };

    GoogleMap.prototype.computeDistanceBetween = function (from, to) {
        if (!from || !to) {
            return
        }
        return google.maps.geometry.spherical.computeDistanceBetween(from, to);
    };

    GoogleMap.prototype.getMarkerPosition = function (marker) {
        if (!marker) {
            return
        }
        return marker.getPosition();
    };

    GoogleMap.prototype.trigger = function (instance, eventName, var_args) {
        google.maps.event.trigger(instance, eventName, var_args);
    };

    inherits(GoogleMap, BeopMap);

    // Google Custom Marker
    var GMarker = null;

    /////
    beop.getMapInstance = function () {
        if (typeof AppConfig.isGoogleServiceAvailable === 'boolean') {
            return AppConfig.isGoogleServiceAvailable ? new GoogleMap() : new GaodeMap();
        } else {
            if (I18n.type === 'zh') {
                return new GaodeMap();
            } else {
                return new GoogleMap();
            }
        }
    };

    beop.GaodeMap = GaodeMap;
    beop.GoogleMap = GoogleMap;
})(
    beop || (beop = {})
);

var isMapAsyncLoadSuccess = undefined;

function mapLoadCallBack() {
    //try {
    var mapIns = beop.getMapInstance();
    mapIns.init();
    //mapIns.addToVersionHistory();
    mapIns.addMarkers(ProjectConfig.projectList);
    mapIns.initPaneProject();
    mapIns.setFitView();
    isMapAsyncLoadSuccess = true;

    mapIns.customCtrls = mapIns.customCtrls || {};
    //} catch (e) {
    //    console.error(e);
    //}
}
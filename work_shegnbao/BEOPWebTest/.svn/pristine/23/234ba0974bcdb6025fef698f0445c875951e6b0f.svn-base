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
        project_img_path: '/static/images/project_img/',
        mapLoadCallBack: 'mapLoadCallBack',
        defaultLatlng: '31.2114943,121.6283679',
        projectStatus: {
            online: 'Online',
            offline: 'Offline'
        },
        online_img_path: '/static/images/map_marker_online.png',
        offline_img_path: '/static/images/map_marker_offline.png',
        neighbouringRadius: 80000, //附近项目半径,单位米
        loadMapTimeout: 2000
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

    function initPanelBtns(pageInfo) {
        if (typeof pageInfo === 'string') {
            try {
                pageInfo = JSON.parse(pageInfo);
            } catch (e) {
                pageInfo = [];
                console.error(e);
            }
        }
        var firstEnergy;
        if (pageInfo.navItems.length > 0) {
            for (var item in pageInfo.navItems) {
                if (pageInfo.navItems[item].type == 'EnergyScreen') {
                    firstEnergy = pageInfo.navItems[item];
                    break;
                }
            }
        }
        pageInfo.firstObserverScreenId = pageInfo.observerPages[0] && pageInfo.observerPages[0].id;
        pageInfo.firstEnergyScreenId = firstEnergy && firstEnergy.id;
        var btnsHtml = beopTmpl('mapCardBtnsTmpl', pageInfo);
        var $mapNavFunc = $('#map-nav-func').empty().html(btnsHtml);
        I18n.fillArea($mapNavFunc);
    }

    function getProject(id) {
        for (var n = 0, len = AppConfig.projectList.length; n < len; n++) {
            var item = AppConfig.projectList[n];
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
        this.paneProjectSelector = new PaneProjectSelector();
        this.$projectDetailCard = $('#projectDetailCard');//项目详细信息表格
        this.$projectsCard = $('#projectsCard');//所有项目表格
        this.$nearbyProjects = this.$projectDetailCard.find('.nearby-projects');//附近项目表格
    }


    BeopMap.prototype.init = function () {
        this.attachPanelEvent();
        this.openProjectsCard();
        I18n.fillArea(this.$projectsCard);
        I18n.fillArea(this.$projectDetailCard);
    };

    BeopMap.prototype.openProjectsCard = function () {
        var $projectContainer = this.$projectsCard.find('.project-media-container').html('');
        if (AppConfig.projectList.length === 1) {//仅有一个项目
            var mediaHtml = beopTmpl('mapCardItemTmpl', {project: AppConfig.projectList[0]});
            $projectContainer.append(mediaHtml);
            $('#projectsCard').addClass('singleItem');
            this.initSingleProject(AppConfig.projectList[0]);
        } else {
            for (var i = 0; i < AppConfig.projectList.length; i++) {
                var mediaHtml = beopTmpl('mapCardItemTmpl', {project: AppConfig.projectList[i]});
                $projectContainer.append(mediaHtml);
            }
            this.$projectsCard.show();
        }
    };

    BeopMap.prototype.attachPanelEvent = function () {
        var _this = this;
        this.$projectDetailCard.off('click').on('click', '.nav-item', function () {
            var $this = $(this),
                $pageType = $this.find('div[page-type]'),
                destination = $pageType.attr('page-type'),
                screen = _this.paneProjectSelector.menuScreenFactory(destination);
            if (destination === 'ObserverScreen') {
                ScreenManager.show(ObserverScreen, $pageType.attr('page-id'));
            } else if (screen instanceof EnergyScreen) {
                ScreenManager.show(screen, $pageType.attr('page-id'));
            } else {
                var project_id = _this.$projectDetailCard.attr('project-id');
                if (!project_id) {
                    return false;
                }
                AppConfig.projectId = project_id;
                var projectItem = getProject(project_id);
                if (projectItem) {
                    AppConfig.projectName = projectItem.name_en;
                }

                ScreenManager.show(screen, $pageType.attr('page-id'));
            }
        }).on('click', '.card-close', function () {
            _this.paneProjectSelector.clearMenu();
            _this.closeAllInfoWindow();
            _this.collapseProjectPanel(function () {
                this.openProjectsCard();
            });
            AppConfig.projectId = undefined;
        });

        $('.map-card').on('click', '.media', function () {
            var $this = $(this),
                arrConfig = $this.attr('id').split("-"),
                projectId = arrConfig[0],
                marker;
            if (!projectId) {
                return;
            }
            marker = _this.markers[projectId];
            if (marker) {
                _this.clickMarker(marker);
            }
        });
    };

    BeopMap.prototype.loadMapScriptFailed = function (msg) {
        console.log(this.mapName + I18n.resource.core.beopMap.LOADED_FAILED);
        if (msg) {
            console.log(msg);
        }
        this.paneProjectSelector.setMapAvailable(false);
        this.paneProjectSelector.showPanelView();
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
                    //gaode先callback函数再success函数
                    isMapAsyncLoadSuccess = true;
                }
                if (isMapAsyncLoadSuccess) {
                    //防止地图加载失败,如高德地图服务器更新导致失败
                    console.log(_this.mapName + I18n.resource.core.beopMap.LOADED_SUCCESSFUL + '.');
                } else {
                    _this.loadMapScriptFailed();
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
                    Spinner.spin($(ElScreenContainer).find('.map-card:visible')[0]);
                    _this.initSingleProject(item);
                }
            })(item));
        }
    };

    BeopMap.prototype.initSingleProject = function (project) {
        var _this = this, nearbyProjectList;
        return this.paneProjectSelector.initProject(project.id, project.name_en, StringUtil.getI18nProjectName(project)).done(function (result) {
            _this.$projectsCard.hide();
            _this.collapseProjectPanel(function () {
                _this.loadProjectPanel(project);
                _this.$nearbyProjects.hide();
                initPanelBtns(result);
                _this.openInfoWindow(_this.infoWindows[project.id], _this.markers[project.id]);
                _this.expandProjectPanel(_this.expandNearbyProject);
                nearbyProjectList = _this.getNearbyProjects(project.id, configMap.neighbouringRadius);
                _this.renderNearbyProjects(nearbyProjectList);
            });
        }).always(function () {
            Spinner.stop();
        });
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

    BeopMap.prototype.addToListControl = function () {
        var $controlBtn = this.createControlBtn('glyphicon glyphicon-th', i18n_resource.admin.projectSelector.TITLE_PANELSELECTOR);
        this.addControl($controlBtn, function () {
            this.paneProjectSelector.show('panel');
        })
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

    BeopMap.prototype.createControlBtn = function (btnClass, btnText) {
        var $controlUI = $('<div class="map-control-btn"><span class="' + btnClass + '" aria-hidden="true" style="margin-right:5px"></span></div>');
        $controlUI.append(btnText);
        return $controlUI;
    };


    BeopMap.prototype.addUpdateProjectControl = function () {
        var $controlBtn = this.createControlBtn('glyphicon glyphicon-refresh', I18n.resource.admin.projectSelector.PANE_BTN_UPDATE);
        this.addControl($controlBtn, function () {
            Spinner.spin(ElScreenContainer);
            var alert;
            WebAPI.post("/observer/update_project_by_user", {user_id: AppConfig.userId}).done(function (result) {
                if (result.indexOf('error') != -1) {
                    alert = new Alert(ElScreenContainer, Alert.type.success, I18n.resource.admin.projectSelector.PROJECT_UPDATE_SUCCESS);
                } else {
                    alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectSelector.PROJECT_UPDATE_FAILED);
                }
                alert.showAtTop(2000);
            }).error(function () {
                alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectSelector.PROJECT_UPDATE_FAILED);
                alert.showAtTop(2000);
            }).always(function () {
                Spinner.stop();
            });
        })
    };

    BeopMap.prototype.addManagePanelControl = function () {
        var $controlBtn = this.createControlBtn('glyphicon glyphicon-user', I18n.resource.admin.projectSelector.PANE_BTN_MANAGER);
        this.addControl($controlBtn, function () {
            ScreenManager.show(UserManagerController, AccountManager);
        });
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
                zoom: this.zoom
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
            icon: this.getMarkerImagePath(isOnline)
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
            offset: new AMap.Pixel(0, -23),
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
        this.map.clearInfoWindow();
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
        var defaultOpts = {
            map: this.map,
            position: this.getLatLng(lnglat.lat, lnglat.lng),
            icon: this.getMarkerImagePath(isOnline)
        };
        if (opts) {
            $.extend(defaultOpts, opts);
        }

        var marker = new google.maps.Marker(defaultOpts);
        this.markers[identifier] = marker;
        return marker;
    };

    GoogleMap.prototype.addInfoWindow = function (id, content) {
        var infoWindow = new google.maps.InfoWindow({
            content: content,
            pixelOffset: new google.maps.Size(-6, 1)
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

    beop.getMapInstance = function () {
        if (I18n.type === 'zh') {
            return mapInstance = new GaodeMap();
        } else {
            return mapInstance = new GoogleMap();
        }
    };

    beop.GaodeMap = GaodeMap;
    beop.GoogleMap = GoogleMap;
})(
    beop || (beop = {})
);

var isMapAsyncLoadSuccess = false;

function mapLoadCallBack() {
    var map = beop.getMapInstance();
    map.init();
    map.addToListControl();
    if (AppConfig.userId === 1) {
        map.addUpdateProjectControl();
    }
    map.addMarkers(AppConfig.projectList);
    map.setFitView();
    isMapAsyncLoadSuccess = true;
}
var beop;
(function (beop) {

    var configMap = {
        AmapKey: '9cc89c68a4bd6f3f5f65589f85ad7685',
        AmapUrl: location.protocol + '//webapi.amap.com/maps',
        AmapVersion: '1.3',
        BmapKey: 'VNzhKjCMIdfr8FrHP4ys2jha', //百度地图key
        BmapUrl: 'https://api.map.baidu.com/api',
        GmapVersion: '2.0',
        GmapKey: 'AIzaSyAzzOzAmrGov5GLacve9w8_Q8dS-xBYCgc',
        GmapUrl: 'https://maps.googleapis.com/maps/api/js',
        GmapVersion: '3.0',
        mapContainer: 'chartMap',
        project_img_path: '/static/images/project_img/',
        mapLoadCallBack: 'mapPlatformCallBack',
        defaultLatlng: '31.2114943,121.6283679',
        projectStatus: {
            online: 'Online',
            offline: 'Offline',
            loading: 'Loading'
        },
        online_img_path: '/static/images/map_marker_online.png',
        offline_img_path: '/static/images/map_marker_offline.png',
        neighbouringRadius: 80000, //附近项目半径,单位米
        loadMapTimeout: 3000,
        //是否有powerlink
        hasPowerLink: false,
        //是否是第一次进入的时候
        isFirstComeIn: true,
        isFirstLoadVersion: true
    };
    /**
     * 百度地图样式
     */
    var mapStyle = {
        styleJson: [{
                "featureType": "road",
                "elementType": "all",
                "stylers": {
                    "color": "#cccccc14"
                }
            },
            {
                "featureType": "land",
                "elementType": "all",
                "stylers": {
                    "color": "#ffffffff"
                }
            },
            {
                "featureType": "airportlabel",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#989898ff"
                }
            },
            {
                "featureType": "subway",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            },
            {
                "featureType": "district",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#ffffffff"
                }
            },
            {
                "featureType": "railway",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            },
            {
                "featureType": "scenicspotslabel",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#a075f4ff"
                }
            },
            {
                "featureType": "town",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#969595ff"
                }
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#b6e6f2ff"
                }
            },
            {
                "featureType": "green",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#b0e8827a"
                }
            },
            {
                "featureType": "highway",
                "elementType": "all",
                "stylers": {
                    "color": "#e1e2df0f",
                    "visibility": "on"
                }
            },
            {
                "featureType": "highway",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            },
            {
                "featureType": "boundary",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#f9eee2ff"
                }
            },
            {
                "featureType": "city",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#444444ff"
                }
            },
            {
                "featureType": "city",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            },
            {
                "featureType": "district",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }
        ]
    }

    function inherits(clazz, base) {
        var clazzPrototype = clazz.prototype;

        function F() {}

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
                pageInfo = {};
                console.error(e);
            }
        }
        if (!pageInfo.funcNavItems || !pageInfo.funcNavItems.length) {
            $('#cardBtnPanel').hide();
        } else {
            $('#cardBtnPanel').show();
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
            var btnsHtml = beopTmpl('mapCardBtnsTmpl', pageInfo);
            var $mapNavFunc = $('#map-nav-func').empty().html(btnsHtml);
            I18n.fillArea($mapNavFunc);
        }
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
        this.groupList = [];
        this.selectInfoId = null;
    }
    BeopMap.prototype.init = function () {
        this.attachPanelEvent();
        //this.openProjectsCard();
    };

    BeopMap.prototype.destroy = BeopMap.prototype.close = function () {
        if (this.map && this.map.destroy) {
            if (BackgroundWorkers.fetchProjectStatus) {
                BackgroundWorkers.fetchProjectStatus.postMessage({
                    type: "clearTimer",
                    name: "requestProjectStatus"
                });
            }
            this.map.destroy();
            this.map = null;
        }
    };
    BeopMap.prototype.initWorkerForUpdating = function () {
        if (!BackgroundWorkers.fetchProjectStatus) {
            BackgroundWorkers.fetchProjectStatus = new Worker("/static/views/js/worker/workerUpdate.js");
        }
        this.workerUpdate = BackgroundWorkers.fetchProjectStatus;
        this.workerUpdate.addEventListener("message", this.refreshData.bind(this), true);
        this.workerUpdate.addEventListener("error", function (e) {
            console.log(e)
        }, true);
        this.workerUpdate.postMessage({
            type: "fetchProjectStatus",
            userId: AppConfig.userId
        });
    };
    BeopMap.prototype.refreshData = function (e) {
        var result = e.data;
        var projectIdList = [];
        if (result.success && result.data && result.data.projects && result.data.projects.length) {
            var projects = result.data.projects;
            for (var m = 0; m < projects.length; m++) {
                let project = projects[m]; // project 是个数组 [id, 在线状态, 最新更新时间]
                for (var n = 0; n < this.groupList.length; n++) {
                    var item = this.groupList[n];
                    if (item.id == project[0] && $.inArray(item.id, projectIdList) === -1) {
                        item.lastReceivedTime = project[2];
                        item.updateMarker = (item.online != project[1]);
                        item.online = project[1];
                        break;
                    }
                }
                projectIdList.push(project[0]);
            }
            this.addMarkers(this.groupList);
            this.refreshNav();
           
        }
    };
   
    BeopMap.prototype.groupProjectList = function (groupList) {
        this.groupList = groupList;
        return this.groupList;
    }
    BeopMap.prototype.refreshNav = function () {
        $('#navProject .navItem').each(function (i) {
            var id = $(this).attr('data-id');
            if (id) {
                AppConfig.projectList.forEach(item => {
                    if (item.id == id) {
                        var onlineClass = item.online == null || item.online == 'Offline' ? 'offline' : 'online';
                        $(this).removeClass('offline online');
                        $(this).addClass(onlineClass);
                        $(this).attr('data-online', onlineClass == 'offline' ? 0 : 1)
                    }
                })
            }
        });
    };
    BeopMap.prototype.getprojectDetail = function (pid) {
        if (!pid) return;
        Spinner.spin($('.rightContainer')[0]);
        var attrWhiteList = ['id', 'area', 'raw_count', 'equipment_count', 'country_name_twoletter', 'datadb', 'insertTime', 'isAdvance', 'isFavorite', 'online', 'source', 'system', 'type', 'lastReceivedTime', 'name_en', 'name_cn', 's3dbname', 'mysqlname', 'update_time', 'latlng', 'address', 'name_english', 'weather_station_id', 'pic', 'collectionname', 'SaveSvrHistory', 'is_delete', 'is_advance', 'logo', 'data_time_zone', 'time_format', 'is_diag', 'arrDp', 'unit_system', 'unit_currency', 'hisdata_structure_v2_from_time', 'management', 'i18n'];
        var unitPara;
        var currentProject = BEOPUtil.getProjectById(pid);
        var unitSystem = currentProject.unit_system; //可能为null
        if (!unitSystem) {
            unitPara = AppConfig.language == 'zh' ? 0 : 1;
        } else {
            unitPara = unitSystem;
        }
        var currentUnit = '';
        Unit.prototype.getUnitSystem(unitPara).always(function (rsUinit) {
            eval(rsUinit);
            currentUnit = unitSystem['m2'];
            WebAPI.get('/get/projectDetail/' + pid).done(function (result) {
                var propertyListDom = '';
                for (var key in result) {
                    if (key && attrWhiteList.indexOf(key) < 0) {
                        propertyListDom += `<div class="mapRow">
                        <div class="mapRowLeft" title="${key}">${key}:</div>
                        <div class="mapRowRight">${result[key]!=''?result[key]:'-'}</div></div> `;
                    }
                }
                var dom = `
                        <div class="mapTitle">
                            <span class="mapTitleTag"i18n="platform_app.group.PHOTO">项目照片</span>
                            <span class="mapTitleLine"></span>
                        </div>
                        <div class="mapBody">
                            <div class="mapImg">
                            <img class="img-responsive" src="/static/images/project_img/${result.pic}" onerror="javascript:this.style.height='200px';">                            
                            </div>
                        </div>
                            
                            <div class="mapTitle">
                            <span class="mapTitleTag"i18n="platform_app.group.INFO">基本信息</span>
                            <span class="mapTitleLine"></span>
                    </div>
                    <div class="mapBody" id="propertyList">
                            <div class="mapRow">
                                <div class="mapRowLeft"i18n="platform_app.group.NAME">项目名称：</div>
                                <div class="mapRowRight">${AppConfig.language=='zh'?result.name_cn:result.name_en}</div>       
                            </div>
                            <div class="mapRow ${result.address==''?'propertyHide':''}">
                                    <div class="mapRowLeft"i18n="platform_app.group.ADDRESS">地址:</div>
                                    <div class="mapRowRight">${result.address!=''?result.address:'-'}</div>       
                            </div> 
                            <div class="mapRow ${result.type==''?'propertyHide':''}">
                                    <div class="mapRowLeft"i18n="platform_app.group.TYPE">类型：</div>
                                    <div class="mapRowRight">${result.type!='' && I18n.resource.platform_app.project.PAGE_NAME_ALT[result.type]?I18n.resource.platform_app.project.PAGE_NAME_ALT[result.type]:'-'}</div>       
                            </div>  
                            <div class="mapRow ${result.system==''?'propertyHide':''}">
                                    <div class="mapRowLeft"i18n="platform_app.group.SYSTEM">接入系统:</div>
                                    <div class="mapRowRight">${result.system!=''?result.system:'-'}</div>       
                            </div>  
                            <div class="mapRow ${result.insertTime==''?'propertyHide':''}">
                                    <div class="mapRowLeft"i18n="platform_app.group.TIME">接入时间:</div>
                                    <div class="mapRowRight">${result.insertTime!=''?result.insertTime:'-'}</div>       
                            </div>  
                            <div class="mapRow ${result.raw_count==''?'propertyHide':''}">
                                    <div class="mapRowLeft" i18n="platform_app.group.ROW_POINT">接入点位：</div>
                                    <div class="mapRowRight">${result.raw_count!=''?result.raw_count:'-'}</div>       
                            </div>  
                            <div class="mapRow ${result.source==''?'propertyHide':''}">
                                    <div class="mapRowLeft"i18n="platform_app.group.SOURCE">数据来源：</div>
                                    <div class="mapRowRight">${result.source!=''?result.source:'-'}</div>       
                            </div>
                            <div class="mapRow ${result.equipment_count==''?'propertyHide':''}">
                                    <div class="mapRowLeft mapRowWarn"i18n="platform_app.group.EQUIPMENT">接入设备</div>
                                    <div class="mapRowRight mapRowWarn mapEquipment">${result.equipment_count!=''?result.equipment_count:'-'}</div>       
                            </div>
                            <div class="mapRow ${result.area==''?'propertyHide':''}">
                                    <div class="mapRowLeft mapRowWarn" i18n="platform_app.group.AREA">建筑面积：</div>
                                    <div class="mapRowRight mapRowWarn">${result.area!=''?result.area + currentUnit:'-'}</div>       
                            </div>   
                    </div>`;
                $('#modal_map').html(dom);
                $('#propertyList').append(propertyListDom);
                I18n.fillArea($('#modal_map'));
                $('#mapModal').modal('show');
            }).always(() => {
                Spinner.stop()
            })
        });
    }

    BeopMap.prototype.attachPanelEvent = function () {
        var _this = this;
        $('.chartMap').off('click').on('click', '.mapInfoWindow', function (e) {
            e.stopPropagation();
            var pid = $(this).attr('project-id');
            _this.getprojectDetail(pid);
        });
        $('.chartMap').not('.mapMarker').on('click', function (e) {
            $('.isIconClick').removeClass('isIconClick');
            _this.selectInfoId = '';
        });
        $('.RankWrap').off('click', '.rankLine').on('click', '.rankLine', function (e) {
            var pid = e.currentTarget.dataset.pid;
            $(`[data-markerid=${pid}]`).find('.mapIcon').click();
            _this.selectInfoId = pid;
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
        if (this.key != '') {
            $.extend(opts, {
                key: this.key
            });
        }
        var src = buildSrc(this.url, opts),
            _this = this;
        return $.ajax({
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
                if (typeof isMapAsyncLoadSuccess == 'undefined' && _this instanceof BaiduMap) {
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
        var proj_type = project.type && I18n.resource.platform_app.project.PAGE_NAME_ALT[project.type] ? I18n.resource.platform_app.project.PAGE_NAME_ALT[project.type] : '--'
        var proj_name = AppConfig.language == 'zh' ? project.name_cn : project.name_english;
        var nameDom = `<div class="mapInfoWindow" project-id='${project.id}'><div class='mapImg' project-id='${project.id}'>
        <img  src="http://beop.rnbtech.com.hk/static/images/project_img/${project.pic}" onerror="javascript:this.style.height='70px';"></div>
        <div class='projectNameWindow' project-id='${project.id}'><span>${I18n.resource.platform_app.project.NAME}：</span><span class='media' project-id='${project.id}' title="${proj_name}">${proj_name}</span></div>
        <div class='projectTypeWindow' project-id='${project.id}'><span>${I18n.resource.platform_app.project.TYPE}：</span><span class='media' project-id='${project.id}' title="${proj_type}">${proj_type}</span></div>
        <div class="projectAreaWindow"><span>${I18n.resource.platform_app.group.AREA}：</span><span>${project.area ? project.area+'m²': '--'}</span></div></div>`;
        // <div class="projectPowerWindow"><span>${I18n.resource.platform_app.project.ELE_CONSUM}：</span><span powerid="${project.id}">${project.power ? project.power: '--'}</span></div>`;
        // info.push(nameDom);
        // if (project.online) {
        //     info.push('<span class="projectNameWindowOnlineStatus">' + I18n.resource.admin.projectSelector.PROJECT_STATUS + " : " + project.online + '</span>');
        // } else if (project.offline) {
        //     info.push('<span class="projectNameWindowOnlineStatus">' + I18n.resource.admin.projectSelector.PROJECT_STATUS + " : " + configMap.projectStatus.offline + '</span>');
        // } else {
        //     info.push('<span class="projectNameWindowOnlineStatus">' + I18n.resource.admin.projectSelector.PROJECT_STATUS + " : " + configMap.projectStatus.loading + '</span>');
        // }
        // if (project.lastReceivedTime) {
        //     info.push('<span class="projectNameWindowLastReceivedTime">' + I18n.resource.admin.projectSelector.PROJECT_LAST_RECEIVED_TIME + " : " + project.lastReceivedTime + '</span>');
        // }

        // info.push("</div>");
        // return info.join('<br/>');
        return nameDom;
    };
    BeopMap.prototype.getMarkerImagePath = function (isOnline) {
        return isOnline ? configMap.online_img_path : configMap.offline_img_path;
    };

    BeopMap.prototype.addMarkers = function (markerCollection, isForce) {
        var item, marker, infoWindow, isOnline;
        if (!markerCollection || !markerCollection.length) {
            return false
        }
        var _this = this;
        for (var m = 0; m < markerCollection.length; m++) {
            item = markerCollection[m];
            isOnline = item.online && item.online === configMap.projectStatus.online ? true : false;
            infoWindow = this.addInfoWindow(item.id, this.getInfoWindowContent(item));
            marker = this.addMarker(item.id, item.latlng, isOnline);
            if (!marker) {
                continue;
            }
            _this.addMarkerClick(marker, (function (item) {
                return function () {
                    _this.openInfoWindow(_this.infoWindows[item.id], _this.markers[item.id]);
                }
            })(item));
        }
    };

    BeopMap.prototype.createControlBtn = function (btnClass, btnText, className) {
        var $controlUI;
        if (className) {
            $controlUI = $('<div class="map-control-btn ' + className + '"><span class="' + btnClass + '" aria-hidden="true"></span></div>');
        } else {
            $controlUI = $('<div class="map-control-btn"><span class="' + btnClass + '" aria-hidden="true"></span></div>');
        }
        $controlUI.attr("title", btnText);
        return $controlUI;
    };


    BeopMap.prototype.addUpdateProjectControl = function () {
        var $controlBtn = this.createControlBtn('glyphicon glyphicon-refresh', I18n.resource.admin.projectSelector.PANE_BTN_UPDATE);
        this.addControl($controlBtn, function () {
            Spinner.spin(ElScreenContainer);
            var alert;
            WebAPI.post("/observer/update_project_by_user", {
                user_id: AppConfig.userId
            }).done(function (result) {
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

    BeopMap.prototype.setFitView = function () {};

    BeopMap.prototype.getNearbyProjects = function (centerProjectId, radius) {
        var centerProjectMarker = this.markers[centerProjectId],
            centerProjectLnglat = this.getMarkerPosition(centerProjectMarker),
            nearbyList = [];
        for (var projectId in this.markers) {
            if ((projectId + '') === (centerProjectId + '')) {
                continue;
            }
            var marker = this.markers[projectId],
                markLnglat = this.getMarkerPosition(marker);
            if (this.computeDistanceBetween(centerProjectLnglat, markLnglat) <= radius) {
                nearbyList.push(getProject(projectId));
            }
        }
        return nearbyList;
    };
    var BaiduOverlay = null;
    /******* 百度地图 *******/
    function BaiduMap() {
        BeopMap.call(this);
        this.url = configMap.BmapUrl;
        this.key = '';
        this.mapName = I18n.resource.core.beopMap.AMAP;
        this.customWindow = {};
    }

    BaiduMap.prototype.init = function () {
        BeopMap.prototype.init.call(this);
        this.map = new BMap.Map(this.container, {
            minZoom: 1,
            maxZoom: 20,
            enableDblclickZoom: false
        });
        this.map.centerAndZoom(new BMap.Point(121.45929, 31.22482), 2);
        this.map.setMapStyle(mapStyle);
        this.map.enableScrollWheelZoom();
        this.refreshMap();

        //百度地图添加自定义覆盖物
        BaiduOverlay = function (defaultOpts) {
            this._option = defaultOpts;
            this._map = defaultOpts.map;
            this._point = defaultOpts.position;
        }
        BaiduOverlay.prototype = new BMap.Overlay();
        BaiduOverlay.prototype.initialize = function () {
            var div = this._div = document.createElement("div");
            div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
            div.className = 'mapMarker';
            div.dataset.markerid = this._option.extData.id;
            if (this._option.extData.selectId == this._option.extData.id) {
                div.classList.add("isIconClick");
            }
            this._map.getPanes().labelPane.appendChild(div);
            div.innerHTML = `<div class="mapIcon ${this._option.status!="Offline"?"iconOnline":"iconOffline"}"><div class="radianCycle1"><div class="radianCycle2"></div></div></div>`;
            if (this._option.extData.infoWindow) {
                var divInfoWindow = document.createElement('div');
                divInfoWindow.className = 'BaiduInfoBox';
                divInfoWindow.innerHTML = this._option.extData.infoWindow;
                div.appendChild(divInfoWindow);
            }
            return div;
        }
        BaiduOverlay.prototype.draw = function () {
            var pixel = this._map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x - 8 + "px";
            this._div.style.top = pixel.y - 8 + "px";
        }
        BaiduOverlay.prototype.eventListener = function (eventFunc, _this) {
            this._div.querySelector('.mapIcon').addEventListener('click', function (e) {
                $(e.currentTarget).parent().addClass('isIconClick').siblings().removeClass('isIconClick');
                eventFunc.call(e);
                e.stopPropagation();
            });
            this._div.querySelector('.BaiduInfoBox').addEventListener('click', function (e) {
                var projectId = e.currentTarget.querySelector('.mapInfoWindow').getAttribute('project-id');
                _this.getprojectDetail(projectId);
                e.stopPropagation();
            });
        }
    };

    BaiduMap.prototype.destroy = function () {
        if (this.map && this.map.destroy) {
            this.map.destroy();
            this.workerUpdate.postMessage({
                type: "clearTimer",
                name: "requestProjectStatus"
            });
            this.map = null;
        }
    };
    BaiduMap.prototype.refreshMap = function (){
        function ZoomControl(){
            // 默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
            this.defaultOffset = new BMap.Size(10, 10);
          }
         ZoomControl.prototype = new BMap.Control();
         ZoomControl.prototype.initialize=function(map){
            // 创建一个DOM元素
            var div = document.createElement("div");
            div.className = 'iconfont icon-shuaxin mapRefreshBtn';
            div.style.color = '#333';
            div.style.cursor = "pointer";
            div.style.top='auto';
            div.style.bottom='10px !important';
            // 绑定事件,点击一次放大两级
            div.onclick = function(e){
              map.centerAndZoom(new BMap.Point(121.45929, 31.22482), 2);
            }
            map.getContainer().appendChild(div);
            return div;
          }
          var myZoomCtrl = new ZoomControl();
	        // 添加到地图当中
        this.map.addControl(myZoomCtrl);
         
    };
    BaiduMap.prototype.getLatLng = function (lat, lng) {
        return new BMap.Point(lng, lat);
    };

    BaiduMap.prototype.isMapLoaded = function () {
        try {
            if (BMap && BMap.Map) {
                return true;
            }
        } catch (e) {
            return false;
        }
    };

    BaiduMap.prototype.load = function () {
        if (this.isMapLoaded()) {
            mapPlatformCallBack();
        } else {
            this.loadScript({
                ak: configMap.BmapKey,
                v: configMap.BmapVersion,
                callback: configMap.mapLoadCallBack
            }).error(function () {
                new GoogleMap().load();
            });
        }
    };

    BaiduMap.prototype.addMarker = function (identifier, lnglat, isOnline, opts) {
        var _this = this;
        if (!this.map || !identifier || !lnglat) {
            return null;
        }
        if (!lnglat) {
            lnglat = configMap.defaultLatlng;
        }
        if (typeof lnglat === 'string') {
            var temp = lnglat.split(',');
            lnglat = {
                'lat': +temp[0],
                'lng': +temp[1]
            };
        }
        var projectStatus = isOnline ? configMap.projectStatus.online : configMap.projectStatus.offline;
        var defaultOpts = {
            map: this.map,
            status: projectStatus,
            position: this.getLatLng(lnglat.lat, lnglat.lng),
            extData: {
                id: identifier,
                selectId: this.selectInfoId,
                infoWindow: this.infoWindows[identifier]
            }
        };

        if (opts) {
            $.extend(defaultOpts, opts);
        }
        if (this.markers[identifier]) {
            this.map.removeOverlay(this.markers[identifier]);
        }

        var marker = new BaiduOverlay(defaultOpts);
        this.map.addOverlay(marker);
        this.markers[identifier] = marker;
        return marker;
    };

    BaiduMap.prototype.removeMarker = function (identifier) {
        if (!identifier) {
            return false
        }
        var marker = this.markers[identifier];
        if (!marker) {
            return false;
        }
        this.map.removeOverlay(marker);
        return true;
    };

    BaiduMap.prototype.addInfoWindow = function (id, content) {
        this.infoWindows[id] = content;
        return this.infoWindows[id];
    };
    BaiduMap.prototype.openInfoWindow = function (infoWindow, marker) {
        var posMap = marker._point;
        var markerId = marker._option.extData.id;
        var position = new BMap.Point(posMap.lng, posMap.lat);
        this.map.centerAndZoom(position, 19);
        this.selectInfoId = markerId;
    };

    BaiduMap.prototype.addMarkerClick = function (marker, eventFunc) {
        var _this = this;
        marker.eventListener(function () {
            eventFunc.call(_this);
        }, _this);
    };
    inherits(BaiduMap, BeopMap);
    /******* 高德地图 *******/
    function GaodeMap() {
        BeopMap.call(this);
        this.url = configMap.AmapUrl;
        this.key = configMap.AmapKey;
        this.mapName = I18n.resource.core.beopMap.AMAP;
    }

    GaodeMap.prototype.init = function () {
        BeopMap.prototype.init.call(this);
        this.map = new AMap.Map(this.container, {
            view: new AMap.View2D({
                zoom: this.zoom
            }),
            resizeEnable: true
        });
    };

    GaodeMap.prototype.destroy = function () {
        if (this.map && this.map.destroy) {
            this.map.destroy();
            this.workerUpdate.postMessage({
                type: "clearTimer",
                name: "requestProjectStatus"
            });
            this.map = null;
        }
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
        var controlDiv = function () {};
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
            mapPlatformCallBack();
        } else {
            this.loadScript({
                v: configMap.AmapVersion,
                callback: configMap.mapLoadCallBack
            }).error(function () {
                new GoogleMap().load();
            });
        }
    };

    GaodeMap.prototype.trigger = function (instance, eventName, var_args) {
        AMap.event.trigger(instance, eventName, var_args)
    };

    GaodeMap.prototype.openInfoWindow = function (infoWindow, marker) {
        var posMap = marker.getPosition();
        infoWindow.open(this.map, posMap);
        this.map.setZoomAndCenter(15, [posMap.lng, posMap.lat]);
    };

    GaodeMap.prototype.addMarker = function (identifier, lnglat, isOnline, opts) {
        if (!this.map || !identifier || !lnglat) {
            return null;
        }
        if (!lnglat) {
            lnglat = configMap.defaultLatlng;
        }
        if (typeof lnglat === 'string') {
            var temp = lnglat.split(',');
            lnglat = {
                'lat': +temp[0],
                'lng': +temp[1]
            };
        }
        var projectStatus = isOnline ? configMap.projectStatus.online : configMap.projectStatus.offline;
        //var projectStatus = isOnline ? isOnline : configMap.projectStatus.loading;
        var defaultOpts = {
            map: this.map,
            position: this.getLatLng(lnglat.lat, lnglat.lng),
            offset: new AMap.Pixel(-8, -8),
            content: '<div class="map-marker ' + projectStatus + '" data-id="' + identifier + '"></div>',
            extData: {
                id: identifier
            }
        };
        if (opts) {
            $.extend(defaultOpts, opts);
        }
        if (this.markers[identifier]) {
            this.map.remove(this.markers[identifier]);
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
        this.map.setFitView(this.markers);
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

        // init GMarker
        GMarker = function (latlng, map, args) {
            this.latlng = latlng;
            this.args = args;
            this.setMap(map);
        };
        GMarker.prototype = new google.maps.OverlayView();
        GMarker.prototype.draw = function () {

            var self = this;

            var div = this.div;

            if (!div) {

                div = this.div = document.createElement('div');

                div.className = 'map-marker ' + (self.args.isOnline ? 'Online' : 'Offline');

                div.style.position = 'absolute';

                if (typeof (self.args.id) !== 'undefined') {
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

    GoogleMap.prototype.destroy = function () {
        if (this.map && this.map.destroy) {
            this.workerUpdate.postMessage({
                type: "clearTimer",
                name: "requestProjectStatus"
            });
            this.map.destroy();
            this.map = null;
        }
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
            mapPlatformCallBack();
        } else {
            this.loadScript({
                callback: configMap.mapLoadCallBack,
                sensor: false,
                libraries: 'geometry,places',
                language: 'en'
            }).error(function () {
                new BaiduMap().load();
            });
        }
    };

    GoogleMap.prototype.getLatLng = function (lat, lng) {
        return new google.maps.LatLng(lat, lng);
    };

    GoogleMap.prototype.openInfoWindow = function (infoWindow, marker) {
        infoWindow.open(this.map, marker);
        this.attachPanelEvent();
    };

    GoogleMap.prototype.addMarker = function (identifier, lnglat, isOnline, opts) {
        if (!identifier || !lnglat) {
            return null;
        }
        if (typeof lnglat === 'string') {
            var temp = lnglat.split(',');
            lnglat = {
                'lat': +temp[0],
                'lng': +temp[1]
            };
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
        isOnline = isOnline ? isOnline : 'isOnline';
        var marker = new GMarker(
            this.getLatLng(lnglat.lat, lnglat.lng),
            this.map, {
                id: identifier,
                isOnline: isOnline
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
        var _this = this,
            controlUIDom = $controlUI[0];
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
        // var isGoogleAvailable = localStorage.getItem('isGoogleAvailable');
        // if (typeof isGoogleAvailable !== typeof undefined) {
        //     return isGoogleAvailable === 'true' ? new GoogleMap() : new GaodeMap();
        // }

        if (I18n.type === 'zh') {
            return new BaiduMap();
        } else {
            return new GoogleMap();
        }
    };

    beop.BaiduMap = BaiduMap;
    beop.GoogleMap = GoogleMap;
})(
    beop || (beop = {})
);
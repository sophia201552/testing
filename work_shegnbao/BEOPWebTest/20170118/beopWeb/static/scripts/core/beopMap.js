var beop;
(function (beop) {

    var configMap = {
        AmapKey: '9cc89c68a4bd6f3f5f65589f85ad7685',
        AmapUrl: location.protocol + '//webapi.amap.com/maps',
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
        loadMapTimeout: 3000,
        //是否有powerlink
        hasPowerLink: false,
        //是否是第一次进入的时候
        isFirstComeIn: true,
        isFirstLoadVersion: true
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
        this.paneProjectSelector = new PaneProjectSelector();
        this.$projectDetailCard = $('#projectDetailCard');//项目详细信息表格
        this.$projectsCard = $('#projectsCard');//所有项目表格
        this.$nearbyProjects = this.$projectDetailCard.find('.nearby-projects');//附近项目表格
    }


    BeopMap.prototype.init = function () {
        this.attachPanelEvent();
        this.openProjectsCard();
        //try {
        //    beop.benchMark = new BenchMark();
        //} catch (e) {
        //    console.error(e);
        //}

        I18n.fillArea(this.$projectsCard);
        I18n.fillArea(this.$projectDetailCard);
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
        this.workerUpdate.postMessage({type: "fetchProjectStatus", userId: AppConfig.userId});
    };
    BeopMap.prototype.refreshData = function (e) {
        var result = e.data;
        if (result.success && result.data && result.data.projects) {
            var projects = result.data.projects;
            for (var m = 0; m < projects.length; m++) {
                for (var n = 0; n < AppConfig.projectList.length; n++) {
                    var item = AppConfig.projectList[n];
                    if (item.id == projects[m].id) {
                        item.lastReceivedTime = projects[m].lastReceivedTime;
                        item.updateMarker = (item.online != projects[m].online);
                        item.online = projects[m].online;
                        break;
                    }
                }
            }
            this.addMarkers(AppConfig.projectList);
        }
    };
    BeopMap.prototype.openProjectsCard = function () {
        var $projectContainer = this.$projectsCard.find('.project-media-container').html('');
        for (var i = 0; i < AppConfig.projectList.length; i++) {
            $projectContainer.append(beopTmpl('mapCardItemTmpl', {project: AppConfig.projectList[i]}));
        }
        configMap.isFirstComeIn = false;
        this.$projectsCard.show();
    };
    BeopMap.prototype.addHistory = function (projectId) {
        "use strict";
        if (!projectId) return false;
        var localStoragePrefix = "userViewHistory",
            oldStorage = window.localStorage.getItem(localStoragePrefix);
        if (!oldStorage || oldStorage == undefined) {
            window.localStorage.setItem(localStoragePrefix, projectId);
        } else {
            var currentStorage = oldStorage.split(',');
            if (currentStorage.length >= 2) {
                if (currentStorage[1] != projectId) {
                    currentStorage = [currentStorage[1], projectId]
                }
            } else {
                if (currentStorage.indexOf(projectId.toString()) == -1) {
                    currentStorage.push(projectId)
                }
            }
            window.localStorage.setItem(localStoragePrefix, currentStorage)
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
            } else if (screen == EnergyScreen) {
                ScreenManager.show(screen, $pageType.attr('page-id'));
            } else if (screen == ReportScreen) {
                ScreenManager.show(screen, $pageType.attr('page-id'), $pageType.attr('report-folder'), $pageType.attr('report-type'));
            } else {
                var project_id = _this.$projectDetailCard.attr('project-id');
                if (!project_id) {
                    return false;
                }
                AppConfig.projectId = parseInt(project_id);
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
        var $projectsCard = $('#projectsCard');
        var $advanceSearchBtn = $projectsCard.find('.project-control-advanceSearch'), $advanceContainer = $projectsCard.find('#advanceSearch-container'),
            $advanceContent = $projectsCard.find('#advanceSearch-content');
        var $panelToggle = $projectsCard.find('.project-media-toggle'),
            $panelToggleBtn = $panelToggle.find('i'),
            $searchTableToggle = $projectsCard.find('.search-table-toggle'),
            $projectCardContainer = $projectsCard.find('.projectsCard-container'),
            $projectCardControl = $projectsCard.find('.project-media-control'),
            $searchBox = $projectsCard.find('.project-media-searchBox'),
            $panel = $projectsCard.find('.project-media-panel');
        var $projectSearchContainer = $projectsCard.find("#pms-project-content");
        var $pmsProjectContainer = $projectsCard.find('#pms-project-content'),
            $pmsEquipmentContainer = $projectsCard.find('#pms-equipment'),
            $historyContainer = $projectsCard.find('.projectsCard-history-container');
        var $sortTitle = null;
        var $searchBoxClear = $projectsCard.find('.project-media-searchBox-clear');
        var PYFormat = new pyFormat(), PYProjectList = [], PYItem;
        PYFormat.getPYLocalStorage().done(function (result) {
            AppConfig.projectList.forEach(function (item) {
                var pinyin = ' ';
                PYItem = PYFormat.getPYMap(result.data, item.name_cn);
                if (Array.isArray(PYItem)) {
                    PYItem.forEach(function (i) {
                        pinyin += i.pinyin;
                    });
                    PYProjectList.push($.extend(true, {}, item, {
                        "id": item.id,
                        "PY": $.trim(pinyin),
                        "latlng": item.latlng,
                        "name_en": item.name_en
                    }));
                } else {
                    PYProjectList.push($.extend(true, {}, item, {
                        "id": item.id,
                        "PY": $.trim(pinyin),
                        "latlng": item.latlng,
                        "name_en": item.name_en
                    }));
                }
            });
            PYFormat = null;
        });
        if (configMap.isFirstComeIn) {
            AppConfig.projectList.forEach(function (item) {
                if ((item.name_cn && item.name_cn.toLowerCase().indexOf("powerlink") != -1) || (item.name_english && item.name_english.toLowerCase().indexOf("powerlink") != -1)) {
                    configMap.hasPowerLink = true;
                }
            });
        }
        if (!configMap.hasPowerLink) {
            $panel.find("li").eq(2).off().removeClass("enabled").attr("role", "").find("div").attr("data-target", "").attr("data-toggle", "");
            $advanceSearchBtn.off().hide();
        } else {
        }
        var pmsProjectList = [
                {
                    name: i18n_resource.admin.panel.advanceSearch.project.COUNTRY,
                    options: [],
                    role: "small"
                },
                {
                    name: i18n_resource.admin.panel.advanceSearch.project.PROVINCE,
                    options: [],
                    role: "small"
                },
                {
                    name: i18n_resource.admin.panel.advanceSearch.project.CITY,
                    options: [],
                    role: "small"
                },
                {
                    name: i18n_resource.admin.panel.advanceSearch.project.PROJECT_TYPE,
                    options: [],
                    role: "small"
                },
                {
                    name: i18n_resource.admin.panel.advanceSearch.project.APPLICATION_AREA,
                    options: [],
                    role: "small"
                },
                {
                    name: i18n_resource.admin.panel.advanceSearch.project.AUTHORIZE_TIME,
                    options: [],
                    role: "small"
                },
                {
                    name: i18n_resource.admin.panel.advanceSearch.project.POWER_FREQUENCY,
                    options: [],
                    role: "small"
                },
                {
                    name: i18n_resource.admin.panel.advanceSearch.project.POWER_SCALE,
                    options: [],
                    role: "small"
                },
                {
                    name: i18n_resource.admin.panel.advanceSearch.project.IS_parallel,
                    options: [],
                    role: "small"
                }
            ],
            pmsEquipmentList = [
                {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.INTERNAL_COMBUSTION_ENGINE,
                    options: [],
                    role: "small"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.COUNTRY,
                    options: [],
                    role: "small"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.PROVINCE,
                    options: [],
                    role: "small"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.CITY,
                    options: [],
                    role: "small"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.PRODUCT_TYPE,
                    options: [],
                    role: "small",
                    filter: "equipmentType"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.EQUIPMENT,
                    options: [],
                    role: "small"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.EQUIPMENT_NUMBER,
                    options: ["CG200/S-NG", "GXE160/S-6NG"],
                    role: "small",
                    filter: "equipmentModel"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.RATED_POWER,
                    options: [],
                    role: "small"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.APPLICATION_AREA,
                    options: [],
                    role: "small"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.APPLICATION_TYPE,
                    options: [],
                    role: "small"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.FACTORY_TIME,
                    options: [],
                    role: "small",
                    filter: "factoryTime"
                }, {
                    name: i18n_resource.admin.panel.advanceSearch.equipment.AVERAGE_EFFICIENCY,
                    options: [],
                    role: "small"
                }
            ];
        var userViewStorage = window.localStorage.getItem("userViewHistory"), userViewProjectList = [];
        if (!userViewStorage || userViewStorage == undefined) {
            userViewProjectList = []
        } else {
            try {
                userViewStorage.split(',').forEach(function (item) {
                    AppConfig.projectList.forEach(function (project) {
                        if ((project.id) == item) {
                            userViewProjectList.push(project);
                        }
                    });
                });
            } catch (ex) {
                userViewProjectList = []
            }
        }
        if (userViewProjectList.length > 0) {
            var html = '<p>' + i18n_resource.admin.panel.HISTORY_PROJECT_LIST + '</p>';
            userViewProjectList.forEach(function (item) {
                html += beopTmpl("mapCardItemTmpl", {
                    project: item
                });
            });
            $historyContainer.empty().html(html);
        } else {
            $historyContainer.empty().hide();
        }
        $pmsProjectContainer.empty().html(beopTmpl('project_media_search_arguments', {
            data: pmsProjectList
        }));
        $pmsEquipmentContainer.empty().html(beopTmpl('project_media_search_arguments', {
            data: pmsEquipmentList
        }));
        var defaultLatLng = "20.643571, 112.15596";
        //还原地图
        var restoreMap = function (cb) {
            AppConfig.projectList.forEach(function (item) {
                try {
                    _this.removeMarker(item.id);
                    if (_this.infoWindows[item.id + "test"]) {
                        _this.removeMarker(item.id + "test");
                    }
                } catch (ex) {
                }
            });
            $('.amap-overlays').empty();
            var Itlang = defaultLatLng.split(',').reverse();
            _this.map.setZoom(4);
            _this.map.panTo([Itlang[0], Itlang[1]]);
            _this.map.setCenter([Itlang[0], Itlang[1]]);
            cb && cb();
        };
        //切换container大小
        var resizeSearchContainer = function (type) {
            if (type == 'max' || type == "pms-equipment") {
                $projectsCard.addClass("large-projectsCard");
                $projectCardControl.addClass("large-project-media-control");
            } else if (type == 'min' || type == "pms-project") {
                $projectsCard.removeClass("large-projectsCard");
                $projectCardControl.removeClass("large-project-media-control");
            }
        };
        //主要搜索
        var searchMain = function () {
            $searchTableToggle.hide();
            var searchValue = $searchBox.val();
            if ($sortTitle) {
                $sortTitle.hide();
            }
            $advanceSearchBtn.find('a').removeClass("active").find("i").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
            $projectSearchContainer.slideUp().removeClass('active');
            if (searchValue == '' || !searchValue) {
                $projectsCard.find('.map-scrollbar').slideDown();
                $projectsCard.find('.project-media-result').slideUp();
                $historyContainer.show();
                restoreMap(function () {
                    addVisibleMarks(AppConfig.projectList, true);
                })
            } else {
                Spinner.spin($projectsCard.get(0));
                $historyContainer.hide();
                dealAdvanceSearch($projectsCard, searchValue.toLowerCase());
            }
            $advanceSearchBtn.removeClass('active');
            $projectCardContainer.slideDown();
            $advanceContainer.hide();
            resizeSearchContainer("min");
        };
        var addInfoWindowTest = function (data) {
            "use strict";
            //因为调用这个之前调用过了一个removeMarker，已经移除过一次了，所以不需要再进行移除
            var html = "";
            data.forEach(function (item) {
                html = '<div style="padding:0px 0px 0px 4px;"><b>' + item.projectBelongs + '</b><br></div>';
                _this.addInfoWindow(item.projectID + "test", html)
            })
        };
        var searchEquipment = function (filter, restore) {
            Spinner.spin($projectsCard.get(0));
            if (restore) {
                $projectsCard.find('#pms-equipment').find('select').each(function () {
                    $(this).val(0);
                });
            }
            $.getJSON('static/mapSearch.json').done(function (result) {
                if (result.success) {
                    var data = result.data.result.equipment, filterResult = [], key, isCurrentData;
                    var $projectResultContainer = $projectsCard.find('.project-media-result');
                    if (Array.isArray(data)) {
                        data.forEach(function (item) {
                            isCurrentData = true;
                            for (key in filter) {
                                if (filter.hasOwnProperty(key)) {
                                    if (item[key].toString().toLowerCase().indexOf(filter[key].toString().toLowerCase()) == -1) {
                                        isCurrentData = false;
                                    }
                                }
                            }
                            if (isCurrentData) {
                                var listObj = {
                                    orderNumber: item.orderNumber,
                                    unitSerialNumber: item.unitSerialNumber,
                                    projectBelongs: item.projectBelongs,
                                    runningTimeHours: item.runningTimeHours,
                                    startRunningTime: item.startRunningTime,
                                    equipmentModel: item.equipmentModel,
                                    projectID: item.projectID,
                                    project: undefined
                                };
                                AppConfig.projectList.forEach(function (item) {
                                    if (item.id == listObj.projectID) {
                                        listObj.project = item;
                                    }
                                });
                                filterResult.push(listObj);
                            }
                        });
                        $projectCardContainer.find('.map-scrollbar').hide();
                        $projectResultContainer.empty().html(beopTmpl('project_media_search_equipment', {
                            result: {
                                type: ['订单号', '机组序列号', '所属项目', '运行小时', '开始运营时间', '设备型号'],
                                data: filterResult
                            }
                        }));
                        if (filterResult.length > 0) {
                            $searchTableToggle.show();
                        }
                        if (restore) {
                            $searchTableToggle.removeClass("search-table-toggle-active").removeClass("active").find("i").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
                        }
                        $projectResultContainer.slideDown();

                        restoreMap(function () {
                            bindSearchResultTableEvents($projectResultContainer);
                            addVisibleMarks(filterResult);
                            addInfoWindowTest(filterResult);
                            $sortTitle = $('#sortTitle');
                        });
                    }
                }
            }).always(function () {
                Spinner.stop();
            })
        };
        //高级搜索
        $projectsCard.off().on('click', '.project-control-advanceSearch>a', function () {
            if ($projectSearchContainer.hasClass("active")) {
                $projectSearchContainer.slideUp().removeClass('active');
            } else {
                $projectSearchContainer.slideDown().addClass("active");
            }
            var $this = $(this);
            $this.toggleClass("active");
            if ($this.hasClass('active')) {
                $this.find("i").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
            } else {
                $this.find("i").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
            }
        }).on('click', '#advanceSearch-btn-1', function () {
            searchMain();
        }).on('click', '.project-media-searchBox-clear', function () {
            $searchBox.val('');
            var type = $advanceContent.data("type");
            if (type == "pms-equipment") {
                $advanceContent.show();
                resizeSearchContainer("min");
                $projectsCard.find('.project-media-result').empty();
            } else {
                searchMain();
            }
            $(this).hide();
        }).on('click', '.search-table-toggle', function () {
            var $this = $(this), $icon = $this.find('i');
            if ($this.hasClass('active')) {
                resizeSearchContainer("min");
                $this.removeClass('active');
                $this.toggleClass("search-table-toggle-active");
                $icon.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
            } else {
                resizeSearchContainer("max");
                $this.addClass('active');
                $this.toggleClass("search-table-toggle-active");
                $icon.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
            }
        });
        var filter = {};
        //添加marks
        var addVisibleMarks = function (filterResult, isNative) {
            var projectList = [];
            if (!isNative) {
                filterResult.forEach(function (item) {
                    if (item.project != undefined) {
                        projectList.push(item.project)
                    }
                });
            } else {
                projectList = filterResult;
            }
            _this.addMarkers(projectList, true);
            _this.setFitView();
        };
        $projectsCard.find('#pms-equipment').find('select').change(function () {
            $searchBox.val("");
            var $this = $(this), value = $this.val(), type = $this.data('filter');
            $this.parent().attr('title', $this.find("option:selected").text());
            if (value == 0) {
                delete filter[type]
            } else {
                filter[type] = value;
            }
            searchEquipment(filter);
        });
        $projectsCard.find('[data-toggle="tab"]').on('show.bs.tab', function (e) {
            $advanceContent.show();
            $historyContainer.show();
            $searchBox.val('');
            $searchBoxClear.hide();
            if ($sortTitle) {
                $sortTitle.hide();
            }
            $projectCardContainer.parent().scrollTop(0);
            $advanceSearchBtn.find('a').removeClass("active").find("i").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
            $projectSearchContainer.removeClass("active").hide();
            $searchTableToggle.removeClass("search-table-toggle-active").removeClass('active').hide();
            $searchTableToggle.find('i').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
            $projectsCard.find('.project-media-result').empty();
            $projectCardContainer.css({height: "calc(100% - " + ($projectCardControl.height() + 30) + "px)"}).find('.map-scrollbar').show();
            $projectsCard.find('#pms-equipment').find('select').each(function () {
                $(this).val(0);
            });
            var type = $(this).data('target').split('#')[1];
            $advanceContent.attr('data-type', type);
            if (type == "pms-project") {
                resizeSearchContainer("min");
                $searchBox.attr("placeholder", i18n_resource.admin.panel.SEARCH_PROJECT_PLACEHOLDER);
            } else if (type == "pms-equipment") {
                $historyContainer.hide();
                $searchBox.attr("placeholder", i18n_resource.admin.panel.SEARCH_EQUIPMENT_PLACEHOLDER);
            }
            restoreMap(function () {
                addVisibleMarks(AppConfig.projectList, true);
            })
        });
        $projectsCard.find('.project-media-searchBox').keyup(function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var $this = $(this);
            //如果搜索框一直执行Backspace操作就返回
            if ($this.val() == '' && $this.hasClass('active')) {
                $searchBoxClear.hide();
                $projectsCard.find('.map-scrollbar').slideDown();
                $projectsCard.find('.project-media-result').empty().slideUp();
                $advanceSearchBtn.removeClass('active');
                $advanceContent.show();
                $advanceContainer.hide();
                $historyContainer.show();
                $projectsCard.find('#pms-equipment').find('select').each(function () {
                    $(this).val(0);
                });
                $this.removeClass('active');
                resizeSearchContainer("min");
                restoreMap(function () {
                    addVisibleMarks(AppConfig.projectList, true);
                });
            } else if ($this.val() != '') {
                $searchBoxClear.show();
                $this.addClass('active');
                if (ev.keyCode == 13) {
                    $historyContainer.hide();
                    searchMain();
                }
            }
        });
        var timer = null;
        var bindSearchResultTableEvents = function ($projectResultContainer) {
            $projectResultContainer.find('table tbody tr').off().on('mouseenter', function () {
                var $this = $(this), projectId = $this.data('project-id');
                timer = setTimeout(function () {
                    $projectResultContainer.find('table tbody tr').removeClass('active');
                    $this.toggleClass('active');
                    var result = {};
                    AppConfig.projectList.forEach(function (item) {
                        if (item.id == projectId) {
                            result = item;
                        }
                    });
                    var addr = result.latlng, Itlang = [];
                    if (addr == "" || !addr) {
                        return false
                    } else {
                        /*                        _this.map.setZoom(_this.zoom);
                         Itlang = defaultLatLng.split(',').reverse();
                         _this.map.panTo([Itlang[0], Itlang[1]]);
                         _this.map.setCenter([Itlang[0], Itlang[1]]);*/
                        Itlang = addr.split(',');
                        Itlang.reverse();
                        _this.map.panTo([Itlang[0], Itlang[1]]);
                        _this.map.setCenter([Itlang[0], Itlang[1]]);
                        _this.map.setZoom(15);
                        _this.openInfoWindow(_this.infoWindows[projectId + "test"], _this.markers[projectId]);
                    }
                }, 500)
            }).on('mouseleave', function () {
                clearTimeout(timer);
                timer = null;
            });
            //绑定排序
            $projectResultContainer.find('table thead th').eq(3).off().on('click', function () {
                Spinner.spin($projectsCard.get(0));
                var list = [], result = [], $this = $(this), classPrefix = 'active';
                $projectResultContainer.find('table tbody tr').each(function () {
                    list.push({
                        dom: $(this).clone(),
                        runningTimeHours: $(this).data('runningtimehours')
                    });
                });
                if ($this.hasClass(classPrefix)) {
                    $sortTitle.removeClass("glyphicon glyphicon-sort-by-attributes-alt").addClass("glyphicon glyphicon-sort-by-attributes").show();
                    list.sort(function (a, b) {
                        return a.runningTimeHours - b.runningTimeHours;
                    });
                } else {
                    $sortTitle.removeClass("glyphicon glyphicon-sort-by-attributes").addClass("glyphicon glyphicon-sort-by-attributes-alt").show();
                    list.sort(function (a, b) {
                        return a.runningTimeHours - b.runningTimeHours;
                    }).reverse();
                }
                list.forEach(function (item) {
                    result.push(item.dom);
                });
                $projectResultContainer.find('table tbody').empty().html(result);
                Spinner.stop();
                $this.toggleClass(classPrefix);
                bindSearchResultTableEvents($projectResultContainer)
            });
        };
        var dealAdvanceSearch = function ($projectsCard, value) {
            var language = window.localStorage.getItem('language'), projectList = AppConfig.projectList, result = [];
            var $projectResultContainer = $projectsCard.find('.project-media-result');
            if (language === 'zh') {
                language = 'name_cn';
            } else if (language === 'en') {
                language = 'name_english';
            } else {
                language = 'name_cn';
            }
            var reg = /[a-z0-9A-Z\- ]/,
                searchValueList = value.split(''),
                mapMarksList = [],
                searchType = $projectsCard.find('#advanceSearch-content').attr("data-type");
            var isPullEnglish = true;
            searchValueList.forEach(function (item) {
                if (!reg.test(item)) {
                    isPullEnglish = false;
                }
            });
            if (Array.isArray(projectList)) {
                if (searchType == "pms-project" || searchType == "" || searchType == undefined) {
                    if (isPullEnglish) {
                        //如果搜索的内容是纯英文，有可能是英文和拼音
                        //英文里面如果搜索不到就去搜索拼音
                        //纯数字按id来查
                        PYProjectList.forEach(function (item) {
                            if ((item.name_english && $.trim(item.name_english.toString()).toLowerCase().indexOf(value.toLowerCase()) !== -1)
                                || (item.PY && item.PY.toString().toLocaleLowerCase().indexOf(value.toString().toLocaleLowerCase()) !== -1)
                                || (item.id && $.trim(item.id).indexOf($.trim(value)) !== -1)) {//加入根据id搜索
                                result.push({
                                    pic: '/static/images/project_img/' + item.pic,
                                    name: item[language],
                                    address: item.address,
                                    latlng: item.latlng,
                                    name_en: item.name_en,
                                    id: item.id
                                });
                                mapMarksList.push(item);
                            }
                        });
                    } else {
                        //如果是纯中文的情况直接搜索　name_cn
                        projectList.forEach(function (item) {
                            if ((item.name_cn && $.trim(item.name_cn).indexOf(value) !== -1)) {
                                result.push({
                                    pic: '/static/images/project_img/' + item.pic,
                                    name: item[language],
                                    address: item.address,
                                    latlng: item.latlng,
                                    name_en: item.name_en,
                                    id: item.id
                                });
                                mapMarksList.push(item);
                            }
                        });
                    }
                    Spinner.stop();
                    $projectsCard.find('.map-scrollbar').slideUp();
                    $projectResultContainer.html(beopTmpl('project_media_search_name', {
                        result: {
                            name: value,
                            length: result.length,
                            data: result
                        }
                    }));
                    $projectResultContainer.slideDown();
                    restoreMap(function () {
                        addVisibleMarks(mapMarksList, true);
                    });
                    $advanceContent.attr("data-type", "pms-project");
                } else if (searchType == "pms-equipment") {
                    searchEquipment({"equipmentModel": value}, true);
                }
            }
        };
        //上下拉按钮
        $panelToggleBtn.off().on('click', function () {
            if ($panelToggle.hasClass('project-media-toggle-active')) {

            } else {
                $panelToggleBtn.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            }
            $panelToggle.toggleClass('project-media-toggle-active');
        });
        $('.map-card, .map-project-selector').on('click', '.media', function () {
            var $this = $(this);
            var projectId = $this.attr("project-id");
            if (!projectId) {
                alert.danger(I18n.resource.common.NOT_FIND_PREJECT_ID);
                return;
            }
            Spinner.spin(document.getElementById('project-media-control'));

            _this.paneProjectSelector.initProject(projectId).done(function (result) {
                if (_this.workerUpdate) {
                    _this.workerUpdate.postMessage({type: "clearTimer", name: "requestProjectStatus"});
                }
                try {
                    var isFailed = _this.paneProjectSelector.initDefaultPage(result);
                    if (isFailed !== false) {
                        _this.destroy();
                    }
                } catch (ex) {
                    console.log(ex);
                }
                _this.addHistory(projectId);
            }).always(function () {
                window.localStorage.setItem("calendarDefault", projectId);
                Spinner.stop();
            });
        }).on('click', '.favorite', function (e) {
            var $this = $(this);
            var projectId = $this.closest('.media').attr("project-id");
            var $projectsCard = $('#projectsCard');
            var $currentEleAll = $projectsCard.find('.media[project-id=' + projectId + '] .favorite');
            if ($this.hasClass('active')) {
                confirm(I18n.resource.admin.panel.CANCEL_DEFAULT, function () {
                    WebAPI.post('/admin/removeFavoriteProject').done(function () {
                        $currentEleAll.removeClass('active');
                        AppConfig.projectList.forEach(function (project) {
                            project.isFavorite = false;
                        })
                    });
                });
            } else {
                confirm(I18n.resource.admin.panel.SET_DEFAULT, function () {
                    WebAPI.post('/admin/setFavoriteProject', {projectId: projectId}).done(function () {
                        $projectsCard.find('.favorite.active').removeClass('active');
                        $currentEleAll.addClass('active');
                        AppConfig.projectList.forEach(function (project) {
                            project.isFavorite = (project.id == projectId);
                        })
                    });
                });
            }
            e.stopPropagation();
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
        info.push("<div class='projectNameWindow'><b class='media' project-id='" + project.id + "'>" + StringUtil.getI18nProjectName(project) + "</b>");
        if (project.online) {
            info.push(I18n.resource.admin.projectSelector.PROJECT_STATUS + " : " + project.online);
        } else {
            info.push(I18n.resource.admin.projectSelector.PROJECT_STATUS + " : " + configMap.projectStatus.offline);
        }
        if (project.lastReceivedTime) {
            info.push(I18n.resource.admin.projectSelector.PROJECT_LAST_RECEIVED_TIME + " : " + project.lastReceivedTime);
        }

        info.push("</div'>");
        return info.join('<br/>');
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

    BeopMap.prototype.addMarkers = function (markerCollection, isForce) {
        var item, marker, infoWindow, isOnline;
        if (!markerCollection || !markerCollection.length) {
            return false
        }
        var _this = this;
        for (var m = 0; m < markerCollection.length; m++) {
            item = markerCollection[m];
            if (!isForce && typeof item.updateMarker == 'boolean' && !item.updateMarker) {
                continue;
            }
            isOnline = item.online && item.online === configMap.projectStatus.online ? true : false;
            marker = this.addMarker(item.id, item.latlng, isOnline);
            if (!marker) {
                continue;
            }
            infoWindow = this.addInfoWindow(item.id, this.getInfoWindowContent(item));
            _this.addMarkerClick(marker, (function (item) {
                return function () {
                    //Spinner.spin($(ElScreenContainer).find('.map-card:visible')[0]);
                    //_this.initSingleProject(item);
                    _this.openInfoWindow(_this.infoWindows[item.id], _this.markers[item.id]);
                }
            })(item));
        }
    };

    BeopMap.prototype.initSingleProject = function (project) {
        var _this = this, nearbyProjectList;
        return this.paneProjectSelector.initProject(project.id).done(function (result) {
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
        var divMedia = $('<div class="media wobble-horizontal"><a class="pull-left"><img class="media-object" src="' + BEOPUtil.getProjectImgPath(project) + '" style="width: 48px; height: 48px;"></a></div>');
        divMedia.attr('project-id', project.id);
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
        var $controlBtn = this.createControlBtn('glyphicon glyphicon-list', i18n_resource.admin.projectSelector.TITLE_PANELSELECTOR);
        this.addControl($controlBtn, function () {
            this.paneProjectSelector.show('panel');
        })
    };

    BeopMap.prototype.addToMapControl = function () {
        var $controlBtn = this.createControlBtn('glyphicon glyphicon-map-marker', i18n_resource.core.beopMap.AMAP, 'active');
        this.addControl($controlBtn, function () {

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
            this.workerUpdate.postMessage({type: "clearTimer", name: "requestProjectStatus"});
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
        if (!this.map || !identifier || !lnglat) {
            return null;
        }
        if (!lnglat) {
            lnglat = configMap.defaultLatlng;
        }
        if (typeof lnglat === 'string') {
            var temp = lnglat.split(',');
            lnglat = {'lat': +temp[0], 'lng': +temp[1]};
        }
        var projectStatus = isOnline ? configMap.projectStatus.online : configMap.projectStatus.offline;
        var defaultOpts = {
            map: this.map,
            position: this.getLatLng(lnglat.lat, lnglat.lng),
            offset: new AMap.Pixel(-8, -8),
            content: '<div class="map-marker ' + projectStatus + '" data-id="' + identifier + '"></div>',
            extData: {id: identifier}
            // icon: this.getMarkerImagePath(isOnline)
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

    GoogleMap.prototype.destroy = function () {
        if (this.map && this.map.destroy) {
            this.workerUpdate.postMessage({type: "clearTimer", name: "requestProjectStatus"});
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
        var isGoogleAvailable = localStorage.getItem('isGoogleAvailable');
        if (typeof isGoogleAvailable !== typeof undefined && isGoogleAvailable !== 'error') {
            return isGoogleAvailable === 'true' ? new GoogleMap() : new GaodeMap();
        }

        if (I18n.type === 'zh') {
            return new GaodeMap();
        } else {
            return new GoogleMap();
        }
    };

    beop.GaodeMap = GaodeMap;
    beop.GoogleMap = GoogleMap;
})(
    beop || (beop = {})
);

var isMapAsyncLoadSuccess = undefined;

function mapLoadCallBack() {
    try {
        var mapIns = beop.getMapInstance();
        mapIns.init();
        mapIns.addToListControl();
        if (AppConfig.userId == 1) {
            mapIns.addUpdateProjectControl();
        }
        mapIns.addToMapControl();

        mapIns.addMarkers(AppConfig.projectList, true);
        mapIns.initWorkerForUpdating();
        mapIns.setFitView();
        isMapAsyncLoadSuccess = true;

        mapIns.customCtrls = mapIns.customCtrls || {};
        mapIns.customCtrls.dataRange = new window.map.controls.DataRange(mapIns, document.getElementById(mapIns.container));
        //beop.benchMark.addDataRangeCtrl(mapIns.customCtrls.dataRange);
        ScreenCurrent = mapIns;
    } catch (e) {
        console.error(e);
    }
}
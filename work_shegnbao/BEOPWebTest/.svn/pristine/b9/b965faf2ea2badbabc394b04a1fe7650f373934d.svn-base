///<reference path="../lib/jquery-1.11.1.js" />

var PaneProjectSelector = (function () {
    var _this = this;
    var configMap = {
        paneTemplate: '/static/views/admin/paneProjectSelector.html',
        mapTemplate: '/static/views/admin/mapProjectSelector.html',
        selectorType: {
            panel: 'panel',
            map: 'map'
        },
        isMapAvailable: true,
        currentSelector: null
    };

    function PaneProjectSelector() {
        _this = this;
        this.i18 = I18n.resource.admin.projectManager;
        // init the alarm reporter
        if (!BackgroundWorkers.alarmReporter) {
            BackgroundWorkers.alarmReporter = new Worker("/static/views/js/worker/workerUpdate.js");
            BackgroundWorkers.alarmReporter.onmessage = function (e) {
                var rs = e.data;
                // success
                if (rs.status === 'OK') {
                    _this.refreshAlarmPanel(_this.filterByAlarmRule(rs.data));
                }
                // faild
                else {
                    // TODO
                }
            }
        }
    };

    PaneProjectSelector.prototype = {
        show: function (selectorType) {
            I18n.fillArea($('#navPane'));

            this.clearMenu();

            if (!selectorType) {//加载上一次的selector
                selectorType = configMap.currentSelector;
            }

            if (selectorType === configMap.selectorType.panel) {
                this.showPanelView();
            } else {
                if (configMap.isMapAvailable) {
                    this.showMapView();
                } else {
                    this.showPanelView();
                }
            }

            Spinner.stop();
        },
        showMapView: function () {
            var _this = this;
            this.showMapSelector().done(function () {
                _this.init();
                var map = new beop.getMapInstance();
                map.load();
            });
        },
        showPanelView: function () {
            var _this = this;
            this.showPanelSelector().done(function () {
                _this.init();
                //给地图，刷新，用户管理图标设置定位
                BEOPUtil.setRelativePosition($("#imgListCon"), $("#funList"), -45, 5)
                //窗口改变进行用户列表窗口位置设置
                $(window).resize(function () {
                    BEOPUtil.setRelativePosition($("#imgListCon"), $("#funList"), -45, 5)
                });
            });
        },
        setMapAvailable: function (available) {
            configMap.isMapAvailable = !!available;
        },

        close: function () {
            $(window).off('resize');
        },
        showPanelSelector: function () {
            configMap.currentSelector = configMap.selectorType.panel;
            return $.get(configMap.paneTemplate).done(function (resultHtml) {
                var $resultHtml = $(resultHtml);
                $(ElScreenContainer).html($resultHtml);
                $("#ulPages").hide();
                I18n.fillArea($resultHtml);

                var paneSelector = $("#paneSelector");
                var imgListCon = paneSelector.find('.project-media-container')
                paneSelector.html('');
                imgListCon.html('');
                for (var i = 0; i < AppConfig.projectList.length; i++) {
                    var project = AppConfig.projectList[i];

                    var divMedia = $('<div class="media effect"><a><div class="img"><img class="media-object" src="' + BEOPUtil.getProjectImgPath(project) + '"></div></a></div>');
                    divMedia.attr('id', 'project-' + project.id + "-" + project.name_en + "-" + project.level);

                    var divMediaBody = $('<div class="media-body info"></div>')
                        .append($('<h4 class="media-heading">' + StringUtil.getI18nProjectName(project) + '</h4>'));
                    divMedia.find('a').append(divMediaBody);
                    imgListCon.append(divMedia);
                }
                paneSelector.append(imgListCon);
            });
        },
        showMapSelector: function () {
            configMap.currentSelector = configMap.selectorType.map;
            return $.get(configMap.mapTemplate).done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                I18n.fillArea($('.map-row'));
            });
        },

        init: function () {
            var _this = this;
            $("#ulLogin").html("");

            $("#rowLogin").animate({
                left: '-250px',
                opacity: '0.5',
                height: '10px',
                width: '10px',
                marginTop: '0'
            }, null, function () {
                $("#rowLogin").css("display", "none");
            });

            $("#rowSelector").on('click', '.media', function (e) {
                var arrConfig = e.currentTarget.id.split("-");
                var projectId = parseInt(arrConfig[1]);
                var projectEnName = arrConfig[2];
                var projectName = '';
                Spinner.spin(document.getElementById('paneSelector'));
                AppConfig.level = parseInt(arrConfig[3]);

                // find project name in AppConfig.projectList, not get it from html
                for (var i = 0, len = AppConfig.projectList.length; i < len; i++) {
                    if (projectId === AppConfig.projectList[i].id) {
                        projectName = StringUtil.getI18nProjectName(AppConfig.projectList[i]);
                        break;
                    }
                }

                if (!projectName) {
                    Spinner.stop();
                    return;
                }

                _this.initProject(projectId, projectEnName, projectName).done(function () {
                    _this.initDefaultPage();
                });

            }).animate({opacity: '1'}).show();

            $("#btnManager").click(function (e) {
                ScreenManager.show(ProjectManager);
            });
            if (AppConfig.userId === 1) {
                $('.adminFeature').show();
            }
            if (configMap.isMapAvailable) {
                $('#btnMapSelector').show();
                $('#btnMapSelector').click(function () {
                    var selector = new PaneProjectSelector();
                    selector.show(configMap.selectorType.map);
                })
            }

            $("#btnUpdate").click(function (e) {

                Spinner.spin(document.getElementById('paneSelector'));
                var alert;
                $.get("/observer/update").done(function (result) {

                    if (result == "success") {
                        alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectManager.UPDATE_COMPLETE);
                        alert.showAtTop(1000);
                    } else {
                        alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectManager.UPDATE_FAILED);
                        alert.showAtTop(1000);
                    }
                }).fail(function (result) {
                    alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectManager.UPDATE_FAILED);
                    alert.showAtTop(1000);
                }).always(function (e) {
                    Spinner.stop();
                });
            });

            //数据分析菜单项
            $('#btnDataAnalys').off('click').click(function () {
                var screen = _this.menuScreenFactory('analysis');
                if (!screen) {
                    return false;
                }
                ScreenManager.show(screen);
                var $ulPages = $('#ulPages');
                if ($ulPages.length) {
                    $ulPages.find('li.active').removeClass('active');
                    $ulPages.find('a[page-type="analysis"]').closest('li').addClass('active');
                }
            });

            //账户管理
            $("#btnAccountManage").off('click').click(function () {
                ScreenManager.show(UserManagerController, AccountManager);
                $('#ulPages').empty();
            });

            //员工管理
            $("#btnMemberManage").off('click').click(function () {
                ScreenManager.show(UserManagerController, MemberManager);
                $('#ulPages').empty();
            });

            //项目权限管理
            $("#btnPermissionManage").off('click').click(function () {
                ScreenManager.show(UserManagerController, ProjectPermissionManager);
                $('#ulPages').empty();
            });

            //init user control pane
            $("#right-nav").show();
            $("#paneUser").html(AppConfig.userProfile.fullname || AppConfig.account);

            $("#paneWorkflow li").off('click').click(function (e) {
                if (ScreenCurrent) ScreenCurrent.close();
                var ScreenFactory;
                switch (e.currentTarget.attributes["screen"].value) {
                    case "main":
                        ScreenFactory = WorkflowMain;
                        break;
                    case "notice":
                        ScreenFactory = WorkflowNotice;
                        break;
                    case "report":
                        ScreenFactory = WorkflowReport;
                        break;
                    case "team":
                        ScreenFactory = WorkflowTeam;
                        break;
                    case "efficiency":
                        ScreenFactory = WorkflowEfficiency;
                        break;
                    case "mine":
                        ScreenFactory = WorkflowMine;
                        break;
                    case "set":
                        ScreenFactory = WorkflowMine;
                        break;
                    default:
                        ScreenFactory = WorkflowMain;
                        break;
                }
                ScreenCurrent = new ScreenFactory();
                ScreenCurrent.show();

                $("#paneWorkflow li").removeClass("active");
                $("#ulPages li").removeClass("active");
                e.currentTarget.classList.add("active");
            });


            $("#btnWorkflow").off('click').click(function (e) {
                ScreenManager.show(WorkflowMine);
            });

            $("#btnOperatingRecord").off('click').click(function (e) {
                new OperatingRecord().show();
            });

            $('#btnAlarmLogging').off().click(function (e) {
                ScreenManager.show(AlarmLogging);
                e.preventDefault();
            });

            $("#btnRealtimeData").off('click').click(function (e) {
                new DataWatch().show();
            });

            $("#btnChangeProject").off('click').click(function (e) {
                ScreenManager.show(PaneProjectSelector);
            });

            $("#btnChangePro").off('click').click(function (e) {
                ScreenManager.show(PaneProjectSelector);
            });

            $("#btnLogout").off('click').click(function (e) {
                _this.logout();
                ScreenManager(IndexScreen);
            });

            $("#btnResetPassword").off('click').click(function (e) {
                $.get("/static/views/admin/resetPassword" + ".html", null, function (resultHtml) {
                    $('#dialogContent').html(resultHtml);
                    $('#dialogModal').modal();
                })
            });

            $("#btnPointManager").off('click').click(function (e) {
                new PointManager().show();
            });

            if (AppConfig.userId === 1) {
                $("#btnMenuConfigure").off('click').click(function (e) {
                    new MenuConfigure().show();
                }).show();
            }
            $('#ulAlarmPanel').off().on('click', 'a', function (e) {
                // go to alarm list page                
                ScreenManager.show(AlarmLogging);
            });
        },

        setImgHeight: function () {
            var $img = $("#paneSelector").find("img")
            var $obj = $img.eq(0);
            var oh = $obj.height();
            $img.css({
                height: oh + "px"
            });

        },

        initProject: function (projectId, projectEnName, projectName) {
            var _this = this;
            return WebAPI.get("/get_plant_pagedetails/" + projectId + "/" + AppConfig.userId).done(function (result) {
                var result_obj = result;
                AppConfig.projectId = projectId;
                AppConfig.projectName = projectEnName;
                AppConfig.projectShowName = projectName;
                $('#projectMenu').text(projectName);
                // show project menu
                $('#liProjectMenu').show();
                // show alarm menu, and start alarming
                $('#liProjectAlarm').show();
                BackgroundWorkers.alarmReporter.postMessage({type: 'dataAlarmRealtime', projectId: projectId});
                _this.initNavigationPane(result_obj.navItems);
                _this.initMenu(result_obj.observerPages);
            }).fail(function (msg) {
                console.log(msg);
                var alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectSelector.PROJECT_OPEN_FAILED.format(projectName));
                alert.showAtTop(2000);
            });
        },
        refreshAlarmPanel: function (data) {
            var arrHtml = [];
            var $panel = $('#liProjectAlarm');
            if (!data) return;

            // refresh the alarm panel list
            // no data, show empty style
            if (data.length === 0) {
                // refresh the bell status
                $($panel.find('a>.badge').text(''));
                arrHtml.push('<li class="dropdown-header"><span class="glyphicon glyphicon-info-sign"></span> There is No Alarms Now.</li>');
                arrHtml.push('<li class="divider"></li>');
                // add "Go to Alarms Page" panel footer
                arrHtml.push('<li class="dropdown-header"><a href="javascript:;">Go To Alarms Page></a></li>');
            }
            // there are some data, generate the list
            else {
                // refresh the bell status
                $($panel.find('a>.badge').text(data.length));
                for (var i = 0, len = Math.min(3, data.length); i < len; i++) {
                    arrHtml.push('<li>\
                        <a href="javascript:;">\
                            <div class="divAlarmInfo">\
                                <span class="glyphicon glyphicon-exclamation-sign"></span> {0}\
                            </div>\
                            <div class="clearfix">\
                                <span class="pull-left text-muted small">Level-{1}</span>\
                                <span class="pull-right text-muted small">{2}</span>\
                            </div>\
                        </a>\
                    </li>\
                    <li class="divider"></li>'.format(data[i]['info'], data[i]['level'],
                            DateUtil.getRelativeDateInfo(new Date(), new Date(data[i]['time'])))
                    );
                }
                // add "See All Alarms" panel footer
                arrHtml.push('<li class="dropdown-header"><a href="javascript:;">See All Alarms></a></li>');
            }

            $('#ulAlarmPanel').html(arrHtml.join(''));
        },
        menuScreenFactory: function (type) {
            var screen = undefined;
            switch (type) {
                case 'ObserverScreen':
                case 'observer':
                    screen = 'temp';
                    break;
                case 'DiagnosisScreen':
                case 'diagnosis':
                    screen = DiagnosisScreen;
                    break;
                case 'AnalysisScreen':
                case 'analysis':
                    screen = AnalysisScreen;
                    break;
                case 'ReportScreen':
                case 'report':
                    screen = ReportScreen;
                    break;
                case 'WorkflowMine':
                case 'workFlow':
                    screen = WorkflowMine;
                    break;
                case 'EnergyScreen':
                case 'energy' :
                    screen = EnergyScreen;
                    break;
                case 'DataCenter3D':
                    screen = DataCenter3D;
                    break;
                case 'DropDownList':
                case 'dropDownList':
                    screen = 'temp';
                    break;
                default:
                    break;
            }
            return screen;
        },

        initMenu: function (pages) {
            var _this = this;
            var ulPages = $("#ulPages");
            var navBtnA = $('#ulPages .nav-btn-a')
            I18n.fillArea(ulPages);

            var ulTag = document.getElementById('ulObserverScreenList');
            if (ulTag) {
                ulTag.innerHTML = '';

                for (var i = 0, page, liTag, aTag, len = pages.length; i < len; i++) {
                    page = pages[i];
                    liTag = document.createElement("li");
                    aTag = document.createElement("a");
                    aTag.textContent = page.name;
                    aTag.id = "page-" + page.id;
                    aTag.onclick = function (e) {
                        Spinner.spin(ElScreenContainer);
                        ScreenManager.show(ObserverScreen, e.currentTarget.id.split('-')[1]);
                    };
                    liTag.appendChild(aTag);
                    ulTag.appendChild(liTag);
                }
            }
            ulPages.children('li').removeClass('active');

            navBtnA.off('click').click(function (e) {
                var currentTarget = e.currentTarget;
                var screen = _this.menuScreenFactory(currentTarget.getAttribute('page-type'));
                if (!screen) {
                    return false;
                }
                setActiveTab(currentTarget);
                if (currentTarget.attributes['pageId']) {
                    ScreenManager.show(screen, currentTarget.attributes['pageId'].value);
                } else {
                    ScreenManager.show(screen);
                }
            });

            ulPages.show();
            function setActiveTab(element) {
                $("#ulPages li").removeClass("active");
                element.parentElement.classList.add("active");
            };
        },

        initDefaultPage: function () {
            //init default page, the first page
            var defaultScreen = $('#ulObserverScreenList li a')[0];
            if (defaultScreen) {
                ScreenManager.show(ObserverScreen, defaultScreen.id.replace('page-', ''));
            }
        },

        initDropDownItem: function (dropdownItem) {
            var _this = this;
            var ulPages = $("#ulPages");
            var ulTag = document.getElementById('DropDownList' + dropdownItem.parent);
            var liTag, aTag;
            var screen = _this.menuScreenFactory(dropdownItem.type);
            liTag = document.createElement("li");
            aTag = document.createElement("a");
            if (dropdownItem.text.indexOf('observer.menu.') >= 0) dropdownItem.text = I18n.findContent(dropdownItem.text);
            aTag.attributes['pageId'] = dropdownItem.id;
            aTag.textContent = dropdownItem.text;
            aTag.onclick = function (e) {
                Spinner.spin(ElScreenContainer);
                ScreenManager.show(screen, e.currentTarget.attributes['pageId']);
            };
            liTag.appendChild(aTag);
            liTag.setAttribute('page-type', dropdownItem.type);
            ulTag.appendChild(liTag);
        },

        initNavigationPane: function (navItems) {
            var liTag, spanTag;
            var uLPages = document.getElementById('ulPages');
            uLPages.innerHTML = '';
            var strLiObserver = '<li class="dropdown">\
                    <a class="dropdown-toggle nav-btn-a" id="<%menuId%>" page-type="observer" data-toggle="dropdown" aria-expanded="false">\
                        <span>\
                            <svg class="nav-icon-svg" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">\
                            <g class="nav-icon-svg-g">\
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.208,0.504h-9c-1.104,0-2,0.896-2,2v9c0,1.104,0.896,2,2,2h9\
                            			c1.104,0,2-0.896,2-2v-9C14.208,1.399,13.313,0.504,12.208,0.504z M27.208,0.504h-9c-1.104,0-2,0.896-2,2v9c0,1.104,0.896,2,2,2h9\
                            			c1.104,0,2-0.896,2-2v-9C29.208,1.399,28.313,0.504,27.208,0.504z M12.208,15.504h-9c-1.104,0-2,0.896-2,2v10c0,1.104,0.896,2,2,2\
                            			h9c1.104,0,2-0.896,2-2v-10C14.208,16.399,13.313,15.504,12.208,15.504z M27.208,15.504h-9c-1.104,0-2,0.896-2,2v10\
                            			c0,1.104,0.896,2,2,2h9c1.104,0,2-0.896,2-2v-10C29.208,16.399,28.313,15.504,27.208,15.504z" />\
                            	</g>\
                            </svg>\
                        </span>\
                        <%menuName%>\
                        <span class="caret"></span>\
                    </a>\
                    <ul id="ulObserverScreenList" class="dropdown-menu"></ul>\
                </li>';
            var strLiDiagnosis = '<li>\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="diagnosis">\
                        <svg class="nav-icon-svg" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">\
                        <g class="nav-icon-svg-g">\
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.976,6.535l-0.953-0.531L19,9.008h1L20.976,6.535z\
                                        M18.527,15.022L14.766,0l-3.371,15.157c-0.257,0.549-0.39,1.151-0.392,1.762l-0.002,0.007h0.002\
                                	    c-0.001,0.696,0.167,1.402,0.532,2.048c1.104,1.956,3.548,2.627,5.46,1.497c1.282-0.757,1.995-2.131,1.995-3.545h0.014\
                                	    l-0.013-0.049C18.984,16.247,18.832,15.613,18.527,15.022z M15.003,19.998c-1.658,0-3.001-1.375-3.001-3.072\
                                	    c0-1.695,1.343-3.07,3.001-3.07c1.657,0,3.001,1.375,3.001,3.07C18.004,18.623,16.66,19.998,15.003,19.998z M17.745,2.28\
                                	    l-0.392,1.962C22.854,5.336,27,10.187,27,16.008c0,6.627-5.373,12-12,12s-12-5.373-12-12c0-5.821,4.146-10.672,9.646-11.766\
                                	    L12.254,2.28C5.838,3.557,1,9.216,1,16.008c0,7.732,6.268,14,14,14s14-6.268,14-14C29,9.216,24.162,3.557,17.745,2.28z M22,11.008\
                                	    v1l2.801-1.387L24.251,9.7L22,11.008z M4,16.008h3v-1H4V16.008z M26,16.008v-1h-3v1H26z M10,9.008h1L9.976,6.004L9.023,6.535\
                                	    L10,9.008z M8.606,11.295L5.749,9.7l-0.55,0.921l2.858,1.595L8.606,11.295z M15.003,14.879c-1.105,0-2.001,0.917-2.001,2.047\
                                	    c0,1.131,0.896,2.048,2.001,2.048c1.104,0,2-0.917,2-2.048C17.003,15.796,16.107,14.879,15.003,14.879z" />\
                                </g>\
                            </svg>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiAnalysis = '<li>\
                <a class="nav-btn-a" pageId="<%menuId%>" page-type="analysis">\
                    <span>\
                        <svg class="nav-icon-svg" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">\
                        <g class="nav-icon-svg-g">\
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M28.775,15.645c0-4.414-2.228-8.306-5.619-10.619\
                                    c0.066-0.275,0.11-0.559,0.11-0.854c0-2.027-1.644-3.671-3.672-3.671c-1.546,0-2.862,0.957-3.405,2.308\
                                    c-0.09-0.002-0.178-0.014-0.268-0.014c-7.035,0-12.742,5.651-12.845,12.66c-1.35,0.543-2.305,1.858-2.305,3.402\
                                    c0,2.027,1.644,3.671,3.672,3.671c0.205,0,0.402-0.028,0.599-0.061c2.274,3.616,6.29,6.027,10.878,6.027\
                                    c1.729,0,3.376-0.347,4.882-0.966c0.652,0.594,1.512,0.966,2.463,0.966c2.028,0,3.673-1.645,3.673-3.672\
                                    c0-0.662-0.189-1.274-0.496-1.811C27.908,20.925,28.775,18.388,28.775,15.645z M25.133,21.678\
                                    c-0.549-0.326-1.182-0.526-1.867-0.526c-2.028,0-3.672,1.645-3.672,3.672c0,0.395,0.079,0.769,0.194,1.125\
                                    c-1.205,0.452-2.504,0.711-3.867,0.711c-3.842,0-7.22-1.969-9.192-4.948c0.839-0.673,1.388-1.694,1.388-2.854\
                                    c0-1.864-1.394-3.387-3.193-3.623C5.141,9.343,9.974,4.631,15.92,4.631c0.016,0,0.031,0.002,0.046,0.002\
                                    c0.229,1.808,1.756,3.21,3.626,3.21c1.064,0,2.015-0.46,2.686-1.183c2.816,1.995,4.66,5.271,4.66,8.984\
                                    C26.938,17.873,26.271,19.944,25.133,21.678z" />\
                            </g>\
                        </svg>\
                    </span>\
                        <%menuName%>\
                </a>\
            </li>';
            var strLiReport = '<li>\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="report">\
                        <span>\
                            <svg class="nav-icon-svg" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">\
                            <g class="nav-icon-svg-g">\
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.008,1h-15c-2.319,0-2,1.135-2,3v22c0,2.479-0.32,3,2,3h19\
                                		c2.748,0,3-0.608,3-3V8C22.81,3.891,25.614,5.949,20.008,1z M25.008,25c0,1.813-0.071,2-2,2h-16c-1.603,0-2-0.014-2-2V5\
                                		c0-2.797-0.031-2,2-2h12c0.015,2.575,0,4,0,4c0,2.089,0.906,3,3,3h3V25z M9.008,15h13v-2h-13V15z M9.008,20h13v-2h-13V20z" />>\
                                </g>\
                            </svg>\
                        </span>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiEnergy = '<li>\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="energy">\
                        <span>\
                            <svg class="nav-icon-svg" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">\
                            <g class="nav-icon-svg-g">\
                            <path d="M4,1H1v28h28v-3H4V1z M9.339,21c1.292,0,2.339-1.091,2.339-2.437c0-0.491-0.14-0.947-0.379-1.33l4.1-4.849\
                                        c0.067,0.006,0.135,0.009,0.204,0.009s0.137-0.003,0.204-0.009l2.982,4.849c-0.239,0.383-0.379,0.839-0.379,1.33\
                                        c0,1.346,1.047,2.437,2.338,2.437c1.292,0,2.34-1.091,2.34-2.437c0-0.51-0.15-0.982-0.407-1.374l3.825-6.322\
                                        c0.051,0.004,0.103,0.006,0.154,0.006c1.292,0,2.34-1.091,2.34-2.437S27.952,6,26.66,6c-1.291,0-2.339,1.091-2.339,2.437\
                                        c0,0.51,0.15,0.982,0.407,1.373l-3.825,6.323c-0.052-0.004-0.103-0.006-0.155-0.006c-0.068,0-0.137,0.004-0.204,0.01l-2.982-4.85\
                                        c0.24-0.383,0.38-0.839,0.38-1.33c0-1.346-1.047-2.437-2.339-2.437s-2.339,1.091-2.339,2.437c0,0.491,0.14,0.947,0.379,1.33\
                                        l-4.099,4.85c-0.067-0.006-0.136-0.01-0.205-0.01C8.047,16.127,7,17.218,7,18.563S8.047,21,9.339,21z" />\
                                </g>\
                            </svg>\
                        </span>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiDropDownList = '<li class="dropdown">\
                    <a class="dropdown-toggle nav-btn-a" page-type="dropDownList" pageId="<%menuId%>" data-toggle="dropdown" aria-expanded="false">\
                        <span>\
                            <svg class="nav-icon-svg" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">\
                            <g class="nav-icon-svg-g">\
                            <path d="M4,1H1v28h28v-3H4V1z M9.339,21c1.292,0,2.339-1.091,2.339-2.437c0-0.491-0.14-0.947-0.379-1.33l4.1-4.849\
                                        c0.067,0.006,0.135,0.009,0.204,0.009s0.137-0.003,0.204-0.009l2.982,4.849c-0.239,0.383-0.379,0.839-0.379,1.33\
                                        c0,1.346,1.047,2.437,2.338,2.437c1.292,0,2.34-1.091,2.34-2.437c0-0.51-0.15-0.982-0.407-1.374l3.825-6.322\
                                        c0.051,0.004,0.103,0.006,0.154,0.006c1.292,0,2.34-1.091,2.34-2.437S27.952,6,26.66,6c-1.291,0-2.339,1.091-2.339,2.437\
                                        c0,0.51,0.15,0.982,0.407,1.373l-3.825,6.323c-0.052-0.004-0.103-0.006-0.155-0.006c-0.068,0-0.137,0.004-0.204,0.01l-2.982-4.85\
                                        c0.24-0.383,0.38-0.839,0.38-1.33c0-1.346-1.047-2.437-2.339-2.437s-2.339,1.091-2.339,2.437c0,0.491,0.14,0.947,0.379,1.33\
                                        l-4.099,4.85c-0.067-0.006-0.136-0.01-0.205-0.01C8.047,16.127,7,17.218,7,18.563S8.047,21,9.339,21z" />\
                                </g>\
                            </svg>\
                        </span>\
                        <%menuName%>\
                        <span class="caret"></span>\
                    </a>\
                    <ul class="dropdown-menu" id="<%parentId%>"></ul>\
                </li>';

            var dropDownItems = [];
            for (var i = 0; i < navItems.length; i++) {
                if (!navItems[i].parent || navItems[i].parent == '') {
                    spanTag = navItems[i].text;

                    if (AppConfig.isMobile) {
                        spanTag = '';
                    } else {
                        if (spanTag.indexOf('observer.menu.') >= 0) {
                            spanTag = '<span class="nav-btn-text">' + I18n.findContent(spanTag) + '</span>';
                        } else {
                            spanTag = '<span class="nav-btn-text">' + spanTag + '</span>';
                        }
                    }

                    switch (navItems[i].type) {
                        case 'ObserverScreen':
                            liTag = strLiObserver;
                            break;
                        case 'DiagnosisScreen':
                            liTag = strLiDiagnosis;
                            break;
                        case 'AnalysisScreen':
                            liTag = strLiAnalysis;
                            break;
                        case 'ReportScreen':
                            liTag = strLiReport;
                            break;
                        case 'EnergyScreen':
                            liTag = strLiEnergy;
                            break;
                        case 'DropDownList':
                            liTag = strLiDropDownList.replace('<%parentId%>', 'DropDownList' + navItems[i].id);
                            break;
                        default:
                            break;
                    }

                    uLPages.innerHTML += liTag.replace('<%menuName%>', spanTag).replace('<%menuId%>', navItems[i].id);
                } else {
                    dropDownItems.push(navItems[i]);
                }
            }
            for (var ele in dropDownItems) {
                this.initDropDownItem(dropDownItems[ele]);
            }

            //临时添加3D数据机房菜单项,条件admin及能耗管理演示项目
            if (AppConfig.userId === 1 && AppConfig.projectId === 35) {
                $(uLPages).append('<li><a class="nav-btn-a" page-type="DataCenter3D"><span></span><span class="nav-btn-text">3D数据机房</span></a></li>');
            }
        },
        // serve for BackgroundWorkers.alarmReporter
        filterByAlarmRule: function (data) {
            var result = [];
            var rules = JSON.parse(localStorage.getItem('alarm_rules'));
            var row = deadline = key = null;
            if (!rules || !(rules = rules[AppConfig.projectId])) return data;

            for (var i = 0, len = data.length; i < len; i++) {
                row = data[i];
                key = window.encodeURIComponent(row['bindpointname'] + '_' + row['time']);
                if (!(deadline = rules[key])) {
                    result.push(row);
                    continue;
                }
                if (data[i]['endtime'] >= deadline) {
                    result.push(row);
                }
            }
            return result;
        },
        clearMenu: function () {
            // hide project menu
            $('#liProjectMenu').hide();
            // hide alarm menu, and stop alarming
            $('#liProjectAlarm').hide();
            BackgroundWorkers.alarmReporter.postMessage({type: 'clearTimer', name: 'dataAlarmRealtime'});
            // reset the alarm panel
            this.refreshAlarmPanel([]);

            $('#projectMenu').text(I18n.resource.admin.navAdmin.LINK_PROJECTS);
            $("#ulPages").empty();
        },
        clearMenuActive: function () {
          $('#ulPages li').removeClass('active');
        },

        logout: function () {
            AppConfig = {};
            localStorage.removeItem("userInfo");
            location.reload();
        }
    };

    return PaneProjectSelector;
})();
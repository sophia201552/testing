///<reference path="../lib/jquery-2.1.4.js" />

var PaneProjectSelector = (function () {
    var _this = this;
    var configMap = {
        paneTemplate: '/static/views/admin/paneProjectSelector.html',
        mapTemplate: '/static/views/admin/mapProjectSelector.html?t=' + new Date().getTime(),
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

        if (!BackgroundWorkers.schedulerReporter) {
            BackgroundWorkers.schedulerReporter = new Worker("/static/views/js/worker/workerUpdate.js");
            BackgroundWorkers.schedulerReporter.receivedMessage = function (data) {
                var $paneWorkflow = $('#paneWorkflow'),
                    $badge = $paneWorkflow.find('.badge'),
                    totalCount = '',
                    $imgBadge = $('#iconList a:eq(0) .badge'),
                    $alarmBadge = $('#liProjectAlarm .badge');
                totalCount = data.transaction.length + data.scheduler.length;
                if (totalCount) {
                    $badge.text(totalCount);
                    $imgBadge.html('&nbsp;')
                } else {
                    $badge.text('');
                    if ($alarmBadge.is(':empty')) {
                        $imgBadge.html('');
                    }
                }
                if (data.scheduler.length) {
                    $paneWorkflow.find('.menuItemCalendar .badge').text(data.scheduler.length);
                } else {
                    $paneWorkflow.find('.menuItemCalendar .badge').text('');
                }

                if (data.transaction.length) {
                    $paneWorkflow.find('.menuItemMine .badge').text(data.transaction.length);
                } else {
                    $paneWorkflow.find('.menuItemMine .badge').text('');
                }

            };
            BackgroundWorkers.schedulerReporter.onmessage = function (e) {
                var rs = e.data;
                if (rs.success) {
                    BackgroundWorkers.schedulerReporter.receivedMessage(rs.data);
                }
            };
            BackgroundWorkers.schedulerReporter.postMessage({type: 'fetchWorkflowData', userId: AppConfig.userId});
        }
    }

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
            $('#scrollPages').css({
                'height':'auto',
                'width':'auto'
            });
            $('#ulPages').css({
                'height':'auto',
                'width':'auto'
            }).hide();
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
                BEOPUtil.setRelativePosition($("#imgListCon"), $("#funList"), -45, 5);
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
            $('#scrollPages').height($('#divPages').height());
            _this.initNav();
            $(window).off('resize.nav').on('resize.nav', function (e) {
                // 由全屏引发的 resize 事件直接返回
                if ($('html').hasClass('sharpview-mode')) return;
                _this.initNav();
            });
        },
        showPanelSelector: function () {
            configMap.currentSelector = configMap.selectorType.panel;
            return WebAPI.get(configMap.paneTemplate).done(function (resultHtml) {
                var $resultHtml = $(resultHtml);
                $(ElScreenContainer).html($resultHtml);
                I18n.fillArea($resultHtml);
                var paneSelector = $("#paneSelector");
                var imgListCon = paneSelector.find('.project-media-container');
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
                //添加版本历史支持
                if (window.localStorage.getItem('language') === 'zh') {
                    var version = window.localStorage.getItem('versionHistory');
                    if (version !== null && version !== 'undefined' && version !== undefined) {
                        var $beopHistory = $('<a id="beopVersionHistory" style="display: inline-block;width:auto;cursor: pointer;padding-left: 10px;"> beop version:' + version + '</a>');
                        paneSelector.append($beopHistory);
                        $beopHistory.off().on('click', function () {
                            ScreenManager.show(UserManagerController, VersionHistory);
                        })
                    }
                }
                paneSelector.append(imgListCon);
            });
        },
        showMapSelector: function () {
            configMap.currentSelector = configMap.selectorType.map;
            return WebAPI.get(configMap.mapTemplate).done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                I18n.fillArea($('.map-row'));
            });
        },

        init: function () {
            var _this = this;
            $("#rowLogin").animate({
                left: '-250px',
                opacity: '0.5',

                height: '10px',
                width: '10px',
                marginTop: '0'
            }, null, function () {
                $("#rowLogin").css("display", "none");
            });
            $("#rowSelector").eventOn('click', '.media', function (e) {
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

                _this.initProject(projectId, projectEnName, projectName).done(function (result) {
                    _this.initDefaultPage(result);
                }).always(function () {
                    Spinner.stop();
                });

            }).animate({opacity: '1'}).show();

            if (AppConfig.userOfRole == 1) {
                $('.adminFeature').show();
            }
            if (configMap.isMapAvailable) {
                $('#btnMapSelector').show().eventOn('click', function () {
                    var selector = new PaneProjectSelector();
                    selector.show(configMap.selectorType.map);
                })
            }

            $("#btnUpdate").eventOn('click', function (e) {

                Spinner.spin(document.getElementById('paneSelector'));
                var alert;
                WebAPI.get("/observer/update").done(function (result) {

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
            $('#btnDataAnalys').eventOff('click').eventOn('click', function () {
                var screen = _this.menuScreenFactory('analysis');
                if (!screen) {
                    return false;
                }
                ScreenManager.show(screen);
                var $ulPages = $('#ulPages');
                if ($ulPages.length) {
                    //$ulPages.find('li.active').removeClass('active');
                    //$ulPages.find('a[page-type="analysis"]').closest('li').addClass('active');
                }
            });
            $('#btnWikiManage').eventOff('click').eventOn('click', function () {
                ScreenManager.show(ModalWiki);
            });
            $('#btnShareLog').eventOff('click').eventOn('click', function () {
                ScreenManager.show(shareLogging, AppConfig.userId);
            });

            //账户管理
            $("#btnAccountManage").eventOff('click').eventOn('click', function () {
                ScreenManager.show(UserManagerController, AccountManager);
            });

            //员工管理
            $("#btnMemberManage").eventOff('click').eventOn('click', function () {
                ScreenManager.show(UserManagerController, MemberManager);
            });

            //benchmark配置
            if (AppConfig.userOfRole == 1) {
                $("#btnBenchmark").parent('li').show().end().eventOff('click').eventOn('click', function () {
                    ScreenManager.show(UserManagerController, BenchmarkConfigure);
                    $('#ulPages').empty();
                });
            }

            //项目权限管理
            $("#btnPermissionManage").eventOff('click').eventOn('click', function () {
                ScreenManager.show(UserManagerController, ProjectPermissionManager);
            });

            //init user control pane
            $("#right-nav").show();
            $("#paneUser").html(AppConfig.userProfile.fullname || AppConfig.account);
            $('#iconList .userPic.small').attr('src', 'http://images.rnbtech.com.hk' + AppConfig.userProfile.picture).attr('alt', AppConfig.userProfile.fullname || AppConfig.account);
            $('#btnAccountManage .userPic').attr('src', 'http://images.rnbtech.com.hk' + AppConfig.userProfile.picture).attr('alt', AppConfig.userProfile.fullname || AppConfig.account);
            $("#paneWorkflow").eventOff('click').eventOn('click', function (e) {
                ScreenManager.show(beop.main, null);
            });

            $("#btnOperatingRecord").eventOff('click').eventOn('click', function (e) {
                new OperatingRecord().show();
            });

            $('#btnAlarmLogging').eventOff().eventOn('click', function (e) {
                ScreenManager.show(AlarmLogging);
                e.preventDefault();
            });

            $('#liProjectAlarm').eventOff().eventOn('click', function (e) {
                //$('#ulAlarmPanel').show();
                var $ulAlarmPanel = $('#ulAlarmPanel');
                $ulAlarmPanel.toggle().next('.card-close').toggle().off().one('click', function (e) {
                    e.stopPropagation();
                    $ulAlarmPanel.hide();
                    $(this).hide();
                });
                e.stopPropagation();
                e.preventDefault();
            });

            $("#btnChangeProject").eventOff('click').eventOn('click', function (e) {
                ScreenManager.show(PaneProjectSelector);
            });

            $("#btnLogout").eventOff('click').eventOn('click', function (e) {
                _this.logout();
                ScreenManager(IndexScreen);
                ScreenManager.clearHistory();
            });

            var $btnChangeSkin = $("#btnChangeSkin");
            var $labelChangeSkin = $('#labelChangeSkin');
            //显示 隐藏下拉框
            $labelChangeSkin.eventOff('click').eventOn('click', function (e) {
                e.stopPropagation();
                $btnChangeSkin.toggle();
            });
            //为了点击时父级div不消失
            $btnChangeSkin.eventOff('click').eventOn('click', function (e) {
                e.stopPropagation();
            });
            //切换皮肤事件
            var skinTimeout = null;
            //处理menu pic
            var updateMenuPic = function (currentSkin) {
                var $navBar = $('#ulPages'), navIconsList = $navBar.find('li').find('img.nav-icon-svg'), current;
                navIconsList.each(function () {
                    var $this = $(this);
                    current = $this.attr('src').split('-');
                    $this.replaceWith('<img class="nav-icon-svg" src=" ' + current[0] + '-' + currentSkin + '.' + current[1].split('.')[1] + ' " onerror="this.style.display=\'none\'"> ')
                })
            };
            $btnChangeSkin.eventOff('change').eventOn('change', function (e) {
                //var systemSkin = localStorage.getItem('systemSkin_' + AppConfig.userId);
                var systemSkin = $('#darkSkin').length == 0 ? 'default' : 'dark'

                var currentSkin = this.value;
                if (systemSkin != this.value) {
                    if (this.value == 'dark') {
                        loadDarkSkin();
                    } else {
                        var cssDark = document.querySelector('#darkSkin');
                        if (cssDark) {
                            cssDark.remove();
                        }
                        AppConfig.chartTheme = 'macarons';
                        localStorage.setItem('systemSkin_' + AppConfig.userId, 'default');
                    }
                    updateMenuPic(currentSkin);
                }
                skinTimeout = setTimeout(function () {
                    $btnChangeSkin.fadeOut(1000);
                }, 5000);
            });
            $btnChangeSkin.hover(function () {
                clearTimeout(skinTimeout);
            }, function () {
                skinTimeout = setTimeout(function () {
                    $btnChangeSkin.fadeOut(1000);
                }, 5000);
            });
            //默认显示深色皮肤值
            var systemSkin = localStorage.getItem('systemSkin_' + AppConfig.userId);
            if (systemSkin) {
                $btnChangeSkin.val(systemSkin);
            } else {
                $btnChangeSkin.val('dark');
                systemSkin = 'dark';
            }
            if (systemSkin == 'dark') {
                loadDarkSkin();
            }

            function loadDarkSkin() {
                var head = document.querySelector('head');
                var $darkSkin = $('#darkSkin');
                if ($darkSkin.length == 0) {
                    var $cssDark = $('<link id="darkSkin" rel="stylesheet" type="text/css" href="/static/content/index-black.css?' + new Date().getTime() + '">');
                    head.appendChild($cssDark[0]);
                    $cssDark[0].onload = function () {
                        localStorage.setItem('systemSkin_' + AppConfig.userId, 'dark');
                    }
                }
                //设置echart主题
                AppConfig.chartTheme = theme.Dark;
            }

            $("#btnResetPassword").eventOff('click').eventOn('click', function (e) {
                WebAPI.get("/static/views/admin/resetPassword" + ".html", null, function (resultHtml) {
                    $('#dialogContent').html(resultHtml);
                    $('#dialogModal').modal();
                })
            });

            $("#btnPointManager").eventOff('click').eventOn('click', function (e) {
                new PointManager().show();
            });

            $("#btnMenuConfigure").show().eventOff('click').eventOn('click', function (e) {
                new MenuConfigure().show();
            }).show();

            $("#btnDebugTools").eventOff('click').eventOn('click', function (e) {
                window.localStorage.setItem("current_project", AppConfig.projectId);
                location.href = "/point_tool/editor";
            });

            $('#ulAlarmPanel').eventOff().eventOn('click', 'a', function (e) {
                // go to alarm list page
                ScreenManager.show(AlarmLogging);
            });

            $("#navHeader").eventOff().eventOn('click', 'li', function (e) {//给页面顶部nav添加点击后样式
                var $this = $(this);
                if ($this.find("ul").length == 0) {
                    $("#navHeader li").removeClass("active");
                    $this.closest("li").addClass("active");
                }
            });

            $('#divPages>span').css('display', 'none');
            $('ulPages').css('left', '0');
            //document.getElementById('indexMain').style.height = (window.innerHeight - $('.navbar').get(0).offsetHeight) + 'px';
            //document.getElementById('indexMain').style.top =$('.navbar').get(0).offsetHeight + 'px';
        },

        setImgHeight: function () {
            var $img = $("#paneSelector").find("img");
            var $obj = $img.eq(0);
            var oh = $obj.height();
            $img.css({
                height: oh + "px"
            });

        },

        initProject: function (projectId, projectEnName, projectName, pageId) {
            var _this = this;
            return WebAPI.get("/get_plant_pagedetails/" + projectId + "/" + AppConfig.userId).done(function (result) {
                var result_obj = result;
                AppConfig.projectId = projectId;
                AppConfig.projectName = projectEnName;
                AppConfig.projectShowName = projectName;
                AppConfig.projectBenchmark = result_obj.benchmark;
                AppConfig.navItems = result_obj.navItems;
                AppConfig.role_permission = result_obj.role_permission;
                $('#projectMenu').text(projectName).show();
                // show project menu
                $('#liProjectMenu').show();
                // show alarm menu, and start alarming
                $('#liProjectAlarm').show();
                BackgroundWorkers.alarmReporter.postMessage({type: 'dataAlarmRealtime', projectId: projectId});
                _this.initNavigationPane(result_obj.navItems);
                _this.initMenu(result_obj.observerPages);
                _this.initNav();
                if (Boolean(pageId)) {
                    var navBtnA = $('#ulPages').find('.nav-btn-a');
                    for (var i = 0, len = navBtnA.length; i < len; i++) {
                        var item = navBtnA.eq(i);
                        if (pageId == item.attr('pageid')) {
                            item.closest('li').attr('class', 'active');// set one active
                            break;
                        }
                    }
                }

                var $btnMenuConfigure = $("#btnMenuConfigure"), $btnDebugTools = $("#btnDebugTools");
                AppConfig.role_permission.c_menu == "" ? $btnMenuConfigure.hide() : $btnMenuConfigure.show();// 判断用户是否有菜单权限
                (AppConfig.role_permission.c_debug_tools != "" || AppConfig.role_permission.c_dashboard != "") ? $btnDebugTools.show() : $btnDebugTools.hide();// 判断用户是否有调试工具权限

                $(window).off('resize.nav').on('resize.nav', (function () {
                    _this.initNav();
                }));
                //document.getElementById('indexMain').style.height = (window.innerHeight - $('.navbar').get(0).offsetHeight) + 'px';
                //document.getElementById('indexMain').style.top =$('.navbar').get(0).offsetHeight + 'px';
                if (beop.benchMark) {
                    beop.benchMark.refresh();
                }
            }).fail(function (msg) {
                console.log(msg);
                var alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectSelector.PROJECT_OPEN_FAILED.format(projectName));
                alert.showAtTop(2000);
            });
        },
        initNav: function () {
            var divPageWidth = window.innerWidth - document.getElementById('right-nav').offsetWidth - document.getElementById('navHomeLogo').offsetWidth - 100;
            var scrollPageWidth = divPageWidth - 50;
            var $scrollPages = $('#scrollPages');
            var ulPageWidth = 0;
            var $ulPages = $('#ulPages'),
                $divPages = $('#divPages');
            var isPlay = false;
            $ulPages.children('li').each(function () {
                ulPageWidth += (this.offsetWidth + 5);
                //console.log(ulPageWidth);
            });
            $scrollPages.css('width', scrollPageWidth + 'px');
            $ulPages.css('width', ulPageWidth + 'px');
            $ulPages.css('left', '0');
            document.getElementById('divPages').style.width = divPageWidth + 'px';
            if (divPageWidth < ulPageWidth) {
                $('#divPages>span').css('display', 'inline');
                $('#btnPageScrollLeft').eventOff('click').eventOn('click', function () {
                    if (isPlay) return;
                    if (-parseInt($ulPages.css('left')) > ulPageWidth - scrollPageWidth)return;
                    isPlay = true;
                    $ulPages.animate({"left": "-=100px"}, function () {
                        isPlay = false;
                    })
                });
                $('#btnPageScrollRight').eventOff('click').eventOn('click', function () {
                    if (isPlay) return;
                    if (-parseInt($ulPages.css('left')) < 100)return;
                    isPlay = true;
                    $ulPages.animate({"left": "+=100px"}, function () {
                        isPlay = false;
                    })
                });
            } else {
                $('#divPages>span').css('display', 'none');
            }
            // 新增下拉菜单显示事件
            var dropDownWidth;
            function showDropDownEvent() {
                var $this = $(this),
                    $ulPages = $('#ulPages'),
                    height = $this.attr('data-h');

                if (height === undefined) {
                    height = $('#navPane').outerHeight() + $this.children('.dropdown-menu').outerHeight();
                    $this.attr('data-h', height);
                }
                $scrollPages.height(height);
                dropDownWidth = $this.offset().left - $scrollPages.offset().left + $this.children('.dropdown-menu').outerWidth();
                if (dropDownWidth > scrollPageWidth) {
                    $scrollPages.width(dropDownWidth);
                }
            }

            function hideDropDownEvent() {
                $scrollPages.height($divPages.height());
                $scrollPages.width($divPages.outerWidth() - 50);
            }

            function showSubDropDownEvent() {
                var $this = $(this);
                $scrollPages.height($('#navPane').outerHeight() + $this.children('.dropdown-menu').outerHeight() + $this.parent('.dropdown-menu').outerHeight());
                //$scrollPages.width($divPages.outerWidth() + $this.children('.dropdown-menu').outerWidth());
                dropDownWidth = $this.offset().left - $scrollPages.offset().left + $this.children('.dropdown-menu').outerWidth() + $this.find('.dropdown-menu .dropdown-menu').outerWidth();
                if (dropDownWidth > scrollPageWidth) {
                    $scrollPages.width(dropDownWidth);
                }
            }

            $scrollPages.off('show.bs.dropdown', '.dropdown')
                .off('show.bs.dropdown', '.dropdown')
                .off('mouseenter', '.dropdown-submenu')
                .off('mouserleave', '.dropdown-submenu');

            $scrollPages.on('show.bs.dropdown', '.dropdown', showDropDownEvent).on('hide.bs.dropdown', '.dropdown', hideDropDownEvent);
            $scrollPages.on('mouseenter', '.dropdown-submenu', showSubDropDownEvent).on('mouserleave', '.dropdown-submenu', hideDropDownEvent);
        },
        refreshAlarmPanel: function (data) {
            var arrHtml = [];
            var $panel = $('#liProjectAlarm'),
                $imgBadge = $('#iconList a:eq(0) .badge'),
                $workflowBadge = $('#paneWorkflow .badge');
            if (!data) return;

            // refresh the alarm panel list
            // no data, show empty style
            if (data.length === 0) {
                // refresh the bell status
                $($panel.find('a>.badge').text(''));
                arrHtml.push('<li class="dropdown-header">There is No Alarms Now.</li>');
                //arrHtml.push('<li class="divider"></li>');
                // add "Go to Alarms Page" panel footer
                arrHtml.push('<li class="dropdown-header"><a href="javascript:;">Go To Alarms Page></a></li>');
                //头像显示无消息
                if ($workflowBadge.is(':empty')) {
                    $imgBadge.html('');
                }
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
                    </li>'.format(data[i]['info'], data[i]['level'],
                            DateUtil.getRelativeDateInfo(new Date(), new Date(data[i]['time'])))
                    );
                }
                // add "See All Alarms" panel footer
                arrHtml.push('<li class="dropdown-header"><a href="javascript:;">See All Alarms></a></li>');
                //头像显示有消息
                $imgBadge.html('&nbsp;');
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
                case 'EnergyScreen_M':
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
            var navBtnA = $('#ulPages .nav-btn-a');
            I18n.fillArea(ulPages);

            var ulTag = document.getElementById('ulObserverScreenList');
            if (ulTag) {
                ulTag.innerHTML = '<div class="arrow"></div>';
                for (var i = 0, page, liTag, aTag, len = pages.length; i < len; i++) {
                    page = pages[i];
                    liTag = document.createElement("li");
                    aTag = document.createElement("a");
                    aTag.textContent = page.name;
                    aTag.id = "page-" + page.id;
                    $(aTag).eventOn('click', function (e) {
                        Spinner.spin(ElScreenContainer);
                        ScreenManager.show(ObserverScreen, e.currentTarget.id.split('-')[1]);
                    });
                    liTag.appendChild(aTag);
                    ulTag.appendChild(liTag);
                }
            }
            //ulPages.children('li').removeClass('active');

            navBtnA.eventOff('click').eventOn('click', function (e) {
                var currentTarget = e.currentTarget;
                var screen = _this.menuScreenFactory(currentTarget.getAttribute('page-type'));
                if (!screen) {
                    return false;
                }
                //setActiveTab(currentTarget);
                if (currentTarget.attributes['pageId']) {
                    var pageId = currentTarget.attributes['pageId'].value;
                    if (screen === ReportScreen) {
                        var pageFolder = currentTarget.attributes['report-folder'].value,
                            pageType = currentTarget.attributes['report-type'].value;
                        ScreenManager.show(screen, pageId, pageType, pageFolder);
                    } else if(currentTarget.getAttribute('page-type') == 'EnergyScreen_M'){
                        ScreenManager.show(screen, pageId, null, null,null,true);
                    } else {
                        ScreenManager.show(screen, pageId);
                    }
                } else {
                    ScreenManager.show(screen);
                }
            });

            ulPages.show();
        },

        initDefaultPage: function (result) {
            //init default page, the first page
            var navItems = result.navItems,
                observerPages = result.observerPages,
                firstItem, firstItemType, screen, pageId;
            if (!navItems.length) {
                return false;
            }
            firstItem = navItems[0], firstItemType = firstItem.type, pageId = firstItem.id;
            if (!firstItemType) {
                return false;
            }
            screen = this.menuScreenFactory(firstItemType);
            switch (firstItemType) {
                case 'ObserverScreen':
                {
                    pageId = observerPages && observerPages[0] && observerPages[0].id;
                    ScreenManager.show(ObserverScreen, pageId);
                    break;
                }
                case 'DropDownList':
                {
                    for (var m = 0, len = navItems.length; m < len; m++) {
                        if (navItems[m].parent === pageId) {
                            pageId = navItems[m].id;
                            screen = this.menuScreenFactory(navItems[m].type);
                            if (navItems[m].type === 'ReportScreen') {
                                ScreenManager.show(screen, pageId, navItems[m].reportType, navItems[m].reportFolder);
                            } else {
                                ScreenManager.show(screen, pageId);
                            }
                            break;
                        }
                    }
                    break;
                }
                case 'ReportScreen':
                {
                    ScreenManager.show(screen, pageId, firstItem.reportType, firstItem.reportFolder);
                    break;
                }
                case 'EnergyScreen_M':
                {
                    ScreenManager.show(screen, pageId, null, null,null,true);
                    break;
                }
                default :
                    ScreenManager.show(screen, pageId);
            }
        },

        initDropDownItem: function (dropdownItem) {
            var _this = this,
                $liTag,
                $aTag,
                $dropDownWrapper = $('#DropDownList' + dropdownItem.parent);

            if (dropdownItem.text.indexOf('observer.menu.') >= 0) {
                dropdownItem.text = I18n.findContent(dropdownItem.text);
            }
            $liTag = $('<li></li>').attr('pageid', dropdownItem.id);
            $aTag = $('<a></a>').text(dropdownItem.text);
            if (dropdownItem.type !== 'DropDownList') {
                $aTag.eventOn('click', function () {
                    Spinner.spin(ElScreenContainer);
                    if (_this.menuScreenFactory(dropdownItem.type) === ReportScreen) {
                        ScreenManager.show(_this.menuScreenFactory(dropdownItem.type), dropdownItem.id, dropdownItem.reportType, dropdownItem.reportFolder);
                    } else {
                        ScreenManager.show(_this.menuScreenFactory(dropdownItem.type), dropdownItem.id);
                    }
                });
            }
            $liTag.append($aTag);
            if (dropdownItem.type === 'EnergyScreen' || dropdownItem.type === 'ReportScreen') {
                AppConfig.menu[dropdownItem.id] = dropdownItem.text;
            } else if (dropdownItem.type === 'DropDownList') {
                $liTag.addClass('dropdown-submenu');
                $liTag.append('<ul class="dropdown-menu popover bottom" id="' + 'DropDownList' + dropdownItem.id + '"></ul>');
            }

            $dropDownWrapper.append($liTag);
        },

        initNavigationPane: function (navItems) {
            var liTag, spanTag;
            var uLPages = document.getElementById('ulPages');
            uLPages.style.width = '';
            uLPages.style.left = '';
            uLPages.innerHTML = '';
            var strLiObserver = '<li class="dropdown">\
                    <a class="dropdown-toggle nav-btn-a" id="<%menuId%>" page-type="<%pageType%>" data-toggle="dropdown" aria-expanded="false">\
                        <span>\
                        <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        </span>\
                        <%menuName%>\
                        <span class="caret"></span>\
                    </a>\
                    <ul id="ulObserverScreenList" class="dropdown-menu popover bottom"></ul>\
                </li>';
            var strLiDiagnosis = '<li>\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                     <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiAnalysis = '<li>\
                <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                    <span>\
                        <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                    </span>\
                        <%menuName%>\
                </a>\
            </li>';
            var strLiReport = '<li>\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>" report-type="<%reportType%>" report-folder="<%reportFolder%>">\
                        <span>\
                            <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        </span>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiEnergy = '<li>\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                        <span>\
                          <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        </span>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiDropDownList = '<li class="dropdown">\
                    <a class="dropdown-toggle nav-btn-a" page-type="dropDownList" pageId="<%menuId%>" data-toggle="dropdown" aria-expanded="false">\
                        <span>\
                          <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        </span>\
                        <%menuName%>\
                        <span class="caret"></span>\
                    </a>\
                    <ul class="dropdown-menu popover bottom" id="<%parentId%>"><div class="arrow"></div></ul>\
                </li>';

            var dropDownItems = [];
            AppConfig.menu = {};

            if (!navItems) return;
            var systemSkin = window.localStorage.getItem('systemSkin_' + AppConfig.userId);
            if (!systemSkin || systemSkin == null || systemSkin == undefined) {
                systemSkin = 'default';
            }
            var imgMenuPicDefault = {
                ObserverScreen: '/static/images/menu/Observer' + '-' + systemSkin + '.svg',
                DiagnosisScreen: '/static/images/menu/Diagnosis' + '-' + systemSkin + '.svg',
                AnalysisScreen: '/static/images/menu/Analysis' + '-' + systemSkin + '.svg',
                ReportScreen: '/static/images/menu/Report' + '-' + systemSkin + '.svg',
                EnergyScreen: '/static/images/menu/Energy' + '-' + systemSkin + '.svg',
                DropDownList: '/static/images/menu/Energy' + '-' + systemSkin + '.svg',
                WorkflowMine: '/static/images/menu/Report' + '-' + systemSkin + '.svg'
            };
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
                    var navItemPic = navItems[i].pic, navItemsType = navItems[i].type;
                    switch (navItemsType) {
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
                            liTag = liTag.replace('<%reportType%>', navItems[i].reportType).replace('<%reportFolder%>', navItems[i].reportFolder);
                            AppConfig.menu[navItems[i].id] = navItems[i].text;
                            break;
                        case 'EnergyScreen':
                        case 'EnergyScreen_M':
                            liTag = strLiEnergy;
                            AppConfig.menu[navItems[i].id] = navItems[i].text;
                            break;
                        case 'DropDownList':
                            liTag = strLiDropDownList.replace('<%parentId%>', 'DropDownList' + navItems[i].id);
                            break;
                        case 'WorkflowMine':
                            liTag = strLiReport;
                            break;
                        default:
                            break;
                    }
                    if (navItemPic && navItemPic !== null && navItemPic != '') {
                        uLPages.innerHTML += liTag.replace('<%imgMenuPicSrc%>', navItemPic).replace('<%menuName%>', spanTag).replace('<%menuId%>', navItems[i].id).replace('<%pageType%>', navItems[i].type);
                    } else {
                        uLPages.innerHTML += liTag.replace('<%imgMenuPicSrc%>', imgMenuPicDefault[navItemsType]).replace('<%menuName%>', spanTag).replace('<%menuId%>', navItems[i].id).replace('<%pageType%>', navItems[i].type);
                    }
                } else {
                    dropDownItems.push(navItems[i]);
                }
            }
            for (var ele in dropDownItems) {
                this.initDropDownItem(dropDownItems[ele]);
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
            $('#projectMenu').hide();
            // hide alarm menu, and stop alarming
            $('#liProjectAlarm').hide();
            BackgroundWorkers.alarmReporter.postMessage({type: 'clearTimer', name: 'dataAlarmRealtime'});
            // reset the alarm panel
            this.refreshAlarmPanel([]);

            //$('#projectMenu').text(I18n.resource.admin.navAdmin.LINK_PROJECTS);
            $("#ulPages").empty();
        },
        clearMenuActive: function () {
            //$('#ulPages li').removeClass('active');
        },

        logout: function () {
            WebAPI.get('/logout/' + AppConfig.userId);
            AppConfig = {};
            localStorage.removeItem("userInfo");
            location.reload();
        }
    };

    return PaneProjectSelector;
})();
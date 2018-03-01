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

                if (data.reminds && data.reminds.length) {
                    new WorkflowRemind(data.reminds).show();
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

            if (AppConfig.skipProjectSelector) {//仅有一个项目,不仅地图直接打开项目
                var project = AppConfig.projectList[0];
                this.initProject(project.id, project.name_en, StringUtil.getI18nProjectName(project)).done(function (result) {
                    _this.initDefaultPage(result);
                }).always(function () {
                    AppConfig.skipProjectSelector = false;
                    Spinner.stop();
                });
            } else {
                if (selectorType === configMap.selectorType.panel) {
                    this.showPanelView();
                } else {
                    if (configMap.isMapAvailable) {
                        this.showMapView();
                    } else {
                        this.showPanelView();
                    }
                }
            }


            $('#scrollPages').css({
                'height': 'auto',
                'width': 'auto'
            });
            $('#ulPages').css({
                'height': 'auto',
                'width': 'auto'
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
                    if (beop.data.versionHistory && !!beop.data.versionHistory && beop.data.versionHistory !== 'undefined') {
                        var $beopHistory = $('<a href="#page=VersionHistory" style="display: inline-block;width:auto;cursor: pointer;padding-left: 10px;"> beop version:' + beop.data.versionHistory.version + '</a>');
                        paneSelector.append($beopHistory);
                        $beopHistory.eventOff().eventOn('click', function () {
                            ScreenManager.goTo({
                                page: 'VersionHistory'
                            });
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

                }, ['projSel', 'projSel', 'text',
                    function (e) {
                        return $(e.currentTarget).attr('id').search(/\d/g)
                    }
                ]
            ).animate({opacity: '1'}).show();

            if (AppConfig.userId == 1) {
                $('.adminFeature').show();
            }
            if (configMap.isMapAvailable) {
                $('#btnMapSelector').show().eventOn('click', function () {
                    var selector = new PaneProjectSelector();
                    selector.show(configMap.selectorType.map);
                }, 'projMapSelect')
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
            }, 'projUpdate');

            //数据分析菜单项
            //$('#btnDataAnalys').eventOff('click').eventOn('click', function () {
            //    var screen = _this.menuScreenFactory('analysis');
            //    if (!screen) {
            //        return false;
            //    }
            //    ScreenManager.show(screen);
            //    var $ulPages = $('#ulPages');
            //    if ($ulPages.length) {
            //        //$ulPages.find('li.active').removeClass('active');
            //        //$ulPages.find('a[page-type="analysis"]').closest('li').addClass('active');
            //    }
            //}, 'navTool-dataAnalys');
            //$('#btnWikiManage').eventOff('click').eventOn('click', function () {
            //    ScreenManager.show(ModalWiki);
            //}, 'navTool-wiki');
            //$('#btnShareLog').eventOff('click').eventOn('click', function () {
            //    ScreenManager.show(shareLogging, AppConfig.userId);
            //}, 'navTool-shareLog');

            //账户管理
            //$("#btnAccountManage").eventOff('click').eventOn('click', function () {
            //        ScreenManager.show(UserManagerController, AccountManager);
            //    }, 'navTool-account'
            //);

            ////员工管理
            //$("#btnMemberManage").eventOff('click').eventOn('click', function (e) {
            //        ScreenManager.show(UserManagerController, MemberManager);
            //    }, 'navTool-member'
            //);

            //benchmark配置
            if (AppConfig.userId == 1) {
                $("#btnBenchmark").parent('li').show().end().eventOff('click').eventOn('click', function () {
                    ScreenManager.show(UserManagerController, BenchmarkConfigure);
                    $('#ulPages').empty();
                }, 'navTool-benchMark');
            }

            //项目权限管理
            $("#btnPermissionManage").eventOff('click').eventOn('click', function () {
                ScreenManager.show(UserManagerController, ProjectPermissionManager);
            }, 'navTool-permission');

            //init user control pane
            $("#right-nav").show();
            $("#paneUser").html(AppConfig.userProfile.fullname || AppConfig.account);
            $('#iconList .userPic.small').attr('src', AppConfig.userProfile.picture).attr('alt', AppConfig.userProfile.fullname || AppConfig.account);
            $('#btnAccountManage .userPic').attr('src', AppConfig.userProfile.picture).attr('alt', AppConfig.userProfile.fullname || AppConfig.account);
            //$("#paneWorkflow").eventOff('click').eventOn('click', function (e) {
            //    ScreenManager.goTo({
            //        page: "workflow",
            //        type: "transaction",
            //        transactionId: 3313
            //    });
            //}, 'navTool-workflow');

            //$("#btnOperatingRecord").eventOff('click').eventOn('click', function (e) {
            //    new OperatingRecord().show();
            //}, 'navTool-operationRecord');

            $('#btnAlarmLogging').eventOff().eventOn('click', function (e) {
                ScreenManager.show(AlarmLogging);
                e.preventDefault();
            }, 'navTool-alarmLog');

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
            }, 'navTool-alarm');

            //$("#btnChangeProject").eventOff('click').eventOn('click', function (e) {
            //    ScreenManager.show(PaneProjectSelector);
            //}, 'navTool-projToggle');

            $("#btnLogout").eventOff('click').eventOn('click', function (e) {
                PaneProjectSelector.logout();
            }, 'navTool-logout');

            var $btnChangeSkin = $("#btnChangeSkin");
            var $labelChangeSkin = $('#labelChangeSkin');
            //显示 隐藏下拉框
            $labelChangeSkin.eventOff('click').eventOn('click', function (e) {
                e.stopPropagation();
                $btnChangeSkin.toggle();
            }, 'navTool-skinLabel');
            //为了点击时父级div不消失
            $btnChangeSkin.eventOff('click').eventOn('click', function (e) {
                e.stopPropagation();
            }, 'navTool-skinSel');
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
                var systemSkin = $('#darkSkin').length == 0 ? 'default' : 'dark';

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
            }, 'navTool-skinLabel');
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
            }, 'navTool-resetPwd');

            $("#btnPointManager").eventOff('click').eventOn('click', function (e) {
                ScreenManager.goTo({
                    page: 'PointManager',
                    projectId: AppConfig.projectId
                })
            }, 'navTool-point');

            $("#btnMenuConfigure").show().eventOff('click').eventOn('click', function (e) {
                ScreenManager.goTo({
                    page: 'MenuConfigure',
                    projectId: AppConfig.projectId
                })
            }, 'navTool-menuCfg').show();

            var $btnDebugTools = $("#btnDebugTools");
            AppConfig.debugTool ? $btnDebugTools.show() : $btnDebugTools.hide();// 判断用户是否有调试工具权限

            $btnDebugTools.eventOff('click').eventOn('click', function (e) {
                window.localStorage.setItem("current_project", AppConfig.projectId);
            }, 'navTool-debugTool');

            $('#ulAlarmPanel').eventOff().eventOn('click', 'a', function (e) {
                // go to alarm list page
                ScreenManager.goTo({
                    page: 'AlarmLogging'
                })
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
            return this;
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
                //$('#liProjectAlarm').show();
                BackgroundWorkers.alarmReporter.postMessage({type: 'dataAlarmRealtime', projectId: projectId});
                _this.initNavigationPane(result_obj.navItems);
                _this.initMenu(result_obj.observerPages);
                _this.initNav();
                //_this.removeNoChildDropdownMenu();
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
                if (AppConfig.role_permission) {
                    AppConfig.role_permission.c_menu == "" ? $("#btnMenuConfigure").hide() : $("#btnMenuConfigure").show();// 判断用户是否有菜单权限
                }

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
            var liWidth = 0;
            $ulPages.children('li').each(function () {
                if (this.offsetWidth > 5) {
                    $(this).attr('offsetW', this.offsetWidth);
                }
                liWidth = $(this).attr('offsetW');
                ulPageWidth += (parseInt(liWidth) + 5);
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
                }, 'navPage-btnScrollLeft');
                $('#btnPageScrollRight').eventOff('click').eventOn('click', function () {
                    if (isPlay) return;
                    if (-parseInt($ulPages.css('left')) < 100)return;
                    isPlay = true;
                    $ulPages.animate({"left": "+=100px"}, function () {
                        isPlay = false;
                    })
                }, 'navPage-btnScrollRight');
            } else {
                $('#divPages>span').css('display', 'none');
            }
            // 新增下拉菜单显示事件
            var dropDownWidth;

            function showDropDownEvent() {
                var $this = $(this),
                    height = $this.attr('data-h');

                if (height === undefined) {
                    height = $('#navPane').outerHeight() + getUlHeight($this.children('.dropdown-menu')) + 20;
                    $this.attr('data-h', height);
                }
                $scrollPages.height(height);
                dropDownWidth = $this.offset().left - $scrollPages.offset().left + $this.children('.dropdown-menu').outerWidth();
                if (dropDownWidth > scrollPageWidth) {
                    $scrollPages.width(dropDownWidth);
                }
            }

            function getUlHeight($ul) { // 计算下拉菜单最大高度
                var height = 20, defaultHeight = 26;
                var $liList = $ul.children('li');
                for (var i = 0; i < $liList.length; i++) {
                    var $li = $liList.eq(i);
                    if ($li.children('ul').length) {
                        height += ($li.children('ul').children('li').length + 1) * defaultHeight;
                    } else {
                        height += defaultHeight;
                    }
                }
                return height;
            }

            function hideDropDownEvent() {
                $scrollPages.height($divPages.height());
                $scrollPages.width($divPages.outerWidth() - 50);
            }

            function showSubDropDownEvent() {
                $(this).find("ul").slideDown(500);
            }

            $scrollPages.off('show.bs.dropdown', '.dropdown')
                .off('show.bs.dropdown', '.dropdown')
                .off('mouseenter', '.dropdown-submenu')
                .off('mouseleave', '.dropdown-submenu');

            $scrollPages.on('show.bs.dropdown', '.dropdown', showDropDownEvent).on('hide.bs.dropdown', '.dropdown', hideDropDownEvent);
            $scrollPages.on('mouseenter', '.dropdown-submenu', showSubDropDownEvent);
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
                case 'PageScreen':
                    screen = window.observer.screens.PageScreen;
                    break;
                case 'FacReportScreen':
                    screen = window.observer.screens.FacReportScreen;
                    break;
                default:
                    break;
            }
            return screen;
        },

        initMenu: function (pages) {
            var _this = this;
            var navBtnA = $('#ulPages .nav-btn-a');

            var ulTag = document.getElementById('ulObserverScreenList');
            var hashToObject = ScreenManager._getHashParamsMap();
            if (ulTag) {
                ulTag.innerHTML = '<div class="arrow"></div>';
                for (var i = 0, page, liTag, aTag, len = pages.length; i < len; i++) {
                    page = pages[i];
                    liTag = document.createElement("li");
                    aTag = document.createElement("a");
                    aTag.textContent = page.name;
                    if (hashToObject.id && hashToObject.id == page.id) {
                        liTag.classList.add('active');
                    }
                    (function (page) {
                        $(aTag).eventOn('click', function (e) {
                            Spinner.spin(ElScreenContainer);
                            ScreenManager.goTo({
                                page: 'ObserverScreen',
                                id: page.id
                            });
                        }, ['navPage', 'navPage', AppConfig.projectShowName, AppConfig.projectId, page.name, page.id]);
                    })(page);

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
                        ScreenManager.goTo({
                            page: 'ReportScreen',
                            reportId: pageId,
                            reportType: currentTarget.attributes['report-type'].value,
                            reportFolder: currentTarget.attributes['report-folder'].value,
                            reportText: $(currentTarget).find('.nav-btn-text').text()
                        });
                    } else if (currentTarget.getAttribute('page-type') == 'EnergyScreen_M') {
                        ScreenManager.show(screen, pageId, null, null, null, true);
                    } else if (window.observer && window.observer.screens && screen === window.observer.screens.PageScreen) {
                        ScreenManager.show(screen, {
                            id: pageId
                        }, 'indexMain');
                    } else if (window.observer && window.observer.screens && screen === window.observer.screens.FacReportScreen) {
                        ScreenManager.show(screen, {
                            id: pageId
                        }, 'indexMain');
                    } else {
                        ScreenManager.goTo({
                            page: currentTarget.getAttribute('page-type'),
                            id: pageId
                        });
                    }
                } else {
                    ScreenManager.goTo({
                        page: currentTarget.getAttribute('page-type')
                    });
                }
            }, ['navPage-a', 'navPage', AppConfig.projectShowName, AppConfig.projectId, 'text', 'pageId']);

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
                    ScreenManager.goTo({
                        page: 'ObserverScreen',
                        id: observerPages && observerPages[0] && observerPages[0].id
                    });
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
                            }
                            // Factory 发布的 PageScreen
                            else if (navItems[m].type === 'PageScreen') {
                                ScreenManager.show(screen, {
                                    id: pageId,
                                    projectId: AppConfig.projectId
                                }, 'indexMain');
                            }
                            // Factory 发布的 ReportScreen
                            else if (navItems[m].type === 'FacReportScreen') {
                            } else {
                                ScreenManager.goTo({
                                    page: navItems[m].type,
                                    id: pageId
                                });
                            }
                            break;
                        }
                    }
                    break;
                }
                case 'ReportScreen':
                {
                    ScreenManager.goTo({
                        page: 'ReportScreen',
                        reportId: pageId,
                        reportType: firstItem.reportType,
                        reportFolder: firstItem.reportFolder
                    });
                    break;
                }
                case 'EnergyScreen_M':
                {
                    ScreenManager.show(screen, pageId, null, null, null, true);
                    break;
                }
                case 'PageScreen':
                    ScreenManager.goTo({
                        page: 'observer.screens.PageScreen',
                        options: {
                            id: pageId
                        },
                        container: 'indexMain'
                    });
                    break;
                case 'FacReportScreen':
                    ScreenManager.goTo({
                        page: 'observer.screens.FacReportScreen',
                        options: {
                            id: pageId
                        },
                        container: 'indexMain'
                    });
                    break;
                default :
                    ScreenManager.goTo({
                        page: navItems[0].type,
                        id: pageId
                    });
            }
        },

        initDropDownItem: function (dropdownItem) {
            var _this = this,
                $liTag,
                $aTag,
                $dropDownWrapper = $('#DropDownList' + dropdownItem.parent);

            if (dropdownItem.type === 'EnergyScreen_M' && !AppConfig.role_permission.c_dashboard) {
                $dropDownWrapper.closest('.dropdown').remove();
                return;
            }

            if ($dropDownWrapper.length === 0) {
                return;
            }

            if (dropdownItem.text.indexOf('observer.menu.') >= 0) {
                dropdownItem.text = I18n.findContent(dropdownItem.text);
            }
            $liTag = $('<li></li>').attr('pageid', dropdownItem.id);
            $aTag = $('<a></a>').text(dropdownItem.text);
            if (dropdownItem.type !== 'DropDownList') {
                if (_this.menuScreenFactory(dropdownItem.type) === ReportScreen) {
                    $liTag.attr('permission', 'RReport');
                } else if (_this.menuScreenFactory(dropdownItem.type) === EnergyScreen) {
                    $liTag.attr('permission', 'RDashboard');
                }

                $aTag.eventOn('click', function () {
                    var ScreenClass = _this.menuScreenFactory(dropdownItem.type);
                    Spinner.spin(ElScreenContainer);
                    if (ScreenClass === ReportScreen) {
                        $liTag.attr('permission', 'RReport');
                        ScreenManager.goTo({
                            page: 'ReportScreen',
                            reportId: dropdownItem.id,
                            reportType: dropdownItem.reportType,
                            reportFolder: dropdownItem.reportFolder,
                            reportText: dropdownItem.text
                        });
                    }
                    // Factory 发布的页面 PageScreen
                    else if (window.observer && window.observer.screens && ScreenClass === window.observer.screens.PageScreen) {
                        ScreenManager.show(ScreenClass, {
                            id: dropdownItem.id
                        }, 'indexMain');
                    } else if (window.observer && window.observer.screens && ScreenClass === window.observer.screens.FacReportScreen) {
                        ScreenManager.show(ScreenClass, {
                            id: dropdownItem.id
                        }, 'indexMain');
                    } else {
                        ScreenManager.goTo({
                            page: dropdownItem.type,
                            id: dropdownItem.id
                        });
                    }
                }, ['navPage', 'navPage', AppConfig.projectShowName, AppConfig.projectId, dropdownItem.text, dropdownItem.id]);
            }
            $liTag.append($aTag);
            if (dropdownItem.type === 'EnergyScreen' || dropdownItem.type === 'ReportScreen') {
                AppConfig.menu[dropdownItem.id] = dropdownItem.text;
            } else if (dropdownItem.type === 'DropDownList') {
                $liTag.addClass('dropdown-submenu');
                $liTag.append('<ul id="' + 'DropDownList' + dropdownItem.id + '"></ul>');
            }

            $dropDownWrapper.append($liTag);
        },

        initNavigationPane: function (navItems) {
            var liTag, spanTag;
            var $ulPages = $("#ulPages");
            $ulPages.empty();
            $ulPages.css({width: '', left: ''});
            $ulPages.show();

            var strLiObserver = '<li class="dropdown">\
                    <a class="dropdown-toggle nav-btn-a" id="<%menuId%>" data-toggle="dropdown" aria-expanded="false">\
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
            var strLiReport = '<li permission="RReport">\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>" report-type="<%reportType%>" report-folder="<%reportFolder%>">\
                        <span>\
                            <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        </span>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiEnergy = '<li permission="RDashboard">\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                        <span>\
                          <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        </span>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiDropDownList = '<li class="dropdown">\
                    <a class="dropdown-toggle nav-btn-a" pageId="<%menuId%>" data-toggle="dropdown" aria-expanded="false">\
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
                ObserverScreen: '/static/images/menu/Observer-' + systemSkin + '.svg',
                DiagnosisScreen: '/static/images/menu/Diagnosis-' + systemSkin + '.svg',
                AnalysisScreen: '/static/images/menu/Analysis-' + systemSkin + '.svg',
                ReportScreen: '/static/images/menu/Report-' + systemSkin + '.svg',
                EnergyScreen: '/static/images/menu/Energy-' + systemSkin + '.svg',
                DropDownList: '/static/images/menu/Energy-' + systemSkin + '.svg',
                WorkflowMine: '/static/images/menu/Report- ' + systemSkin + '.svg',
                defaultMenuPic: '/static/images/menu/Analysis-' + systemSkin + '.svg'
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
                        case 'PageScreen':
                        case 'FacReportScreen':
                        case 'DiagnosisScreen':
                            liTag = strLiDiagnosis;
                            liTag = liTag
                                .replace('<%width%>', navItems[i].width)
                                .replace('<%height%>', navItems[i].height)
                                .replace('<%display%>', navItems[i].display);
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
                            liTag = strLiEnergy;
                            AppConfig.menu[navItems[i].id] = navItems[i].text;
                            break;
                        case 'EnergyScreen_M':
                            if (AppConfig.role_permission.c_dashboard) {
                                liTag = strLiEnergy;
                                AppConfig.menu[navItems[i].id] = navItems[i].text;
                            } else {
                                liTag = null;
                            }
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
                    if (liTag) {
                        var menuItem = '';
                        if (navItemPic && navItemPic !== null && navItemPic != '') {
                            navItemPic = navItemPic.split('-')[0] + '-' + systemSkin + '.svg';
                            menuItem = liTag.replace('<%imgMenuPicSrc%>', navItemPic).replace('<%menuName%>', spanTag).replace('<%menuId%>', navItems[i].id).replace('<%pageType%>', navItems[i].type);
                        } else {
                            menuItem = liTag.replace('<%imgMenuPicSrc%>', imgMenuPicDefault[navItemsType]).replace('<%menuName%>', spanTag).replace('<%menuId%>', navItems[i].id).replace('<%pageType%>', navItems[i].type);
                        }
                        menuItem && $ulPages.append(menuItem);
                    }

                } else {
                    dropDownItems.push(navItems[i]);
                }
            }
            for (var ele in dropDownItems) {
                this.initDropDownItem(dropDownItems[ele]);
            }
            I18n.fillArea($ulPages);

        },
        removeNoChildDropdownMenu: function () {
            //删除没有的子菜单的下拉菜单项
            $('#divPages .dropdown-submenu, #divPages li.dropdown').each(function (index, item) {
                var $this = $(item), display = false;
                $this.find('ul').each(function (index_ul, item_ul) {
                    if ($(item_ul).children('li:not(.dropdown-submenu)').length > 0) {
                        display = true;
                    }
                });
                if (!display) {
                    $this.remove();
                }
            });
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
        }
    };

    PaneProjectSelector.logout = function () {
        WebAPI.get('/logout/' + AppConfig.userId).done(function () {
            AppConfig = {};
            window.onhashchange = null;
            localStorage.removeItem("userInfo");
            location.href = '/';
        });
    };
    return PaneProjectSelector;
})();
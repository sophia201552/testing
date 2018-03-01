///<reference path="../lib/jquery-2.1.4.js" />

var PaneProjectSelector = (function() {
    var _this = this;
    var configMap = {
        paneTemplate: '/static/views/admin/paneProjectSelector.html',
        mapTemplate: '/static/views/admin/mapProjectSelector.html?t=' + new Date().getTime(),
        selectorType: {
            panel: 'panel',
            map: 'map'
        },
        isMapAvailable: true,
        currentSelector: null,
        projectType: {
            dtuProject: 1, // DTU项目
            enterProject: 2 //手动输入数据的项目
        }
    };
    _this.PYProjectList = [];
    var hadWidth = undefined;

    function PaneProjectSelector() {
        _this = this;
        // init the alarm reporter
        if (!BackgroundWorkers.alarmReporter) {
            BackgroundWorkers.alarmReporter = new Worker("/static/views/js/worker/workerUpdate.js");
            BackgroundWorkers.alarmReporter.onmessage = function(e) {
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
            BackgroundWorkers.schedulerReporter.receivedMessage = function(data) {
                var $paneWorkflow = $('#paneWorkflow'),
                    $badge = $paneWorkflow.find('.badge'),
                    $imgBadge = $('#iconList a:eq(0) .badge'),
                    $alarmBadge = $('#liProjectAlarm .badge');
                var remindsLen = data.reminds.length;
                var totalCount = data.scheduler.length;
                if (totalCount) {
                    $badge.text(totalCount);
                    $imgBadge.html('&nbsp;')
                } else {
                    $badge.text('');
                    if ($alarmBadge.is(':empty')) {
                        $imgBadge.html('');
                    }
                }

                if (remindsLen) {
                    $("#messageAll").find(".badge").text(remindsLen).show();
                } else {
                    $("#messageAll").find(".badge").hide();
                }

                if (data.scheduler.length) {
                    $paneWorkflow.find('.menuItemCalendar .badge').text(data.scheduler.length);
                } else {
                    $paneWorkflow.find('.menuItemCalendar .badge').text('');
                }
            };
            BackgroundWorkers.schedulerReporter.onmessage = function(e) {
                var rs = e.data;
                if (rs.success) {
                    BackgroundWorkers.schedulerReporter.receivedMessage(rs.data);
                }
            };
            BackgroundWorkers.schedulerReporter.postMessage({ type: 'fetchWorkflowData', userId: AppConfig.userId });
        }
    }

    PaneProjectSelector.prototype = {
        show: function(selectorType) {
            I18n.fillArea($('#navPane'));
            AppConfig.projectId = undefined;
            AppConfig.projectName = undefined;
            AppConfig.projectEnName = undefined;
            AppConfig.projectShowName = undefined;
            this.clearMenu();
            this.init();
            if (!AppConfig.projectList.length) {
                return;
            }

            if (!selectorType) { //加载上一次的selector
                selectorType = configMap.currentSelector;
            }

            if (AppConfig.skipProjectSelector) { //仅有一个项目,不仅地图直接打开项目
                var favoriteProject = this.getFavoriteProject();
                var project = favoriteProject ? favoriteProject : AppConfig.projectList[0];

                this.initProject(project.id).done(function(result) {
                    _this.initDefaultPage(result);
                }).always(function() {
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

            //不在项目中, 后台管理进入人员管理页面
            var $btnMemberManage = $('#btnMemberManage');
            if ($btnMemberManage.length) {
                $btnMemberManage.children('a').attr('href', '#page=UserManagerController&manager=MemberManager');
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
        getProjectI18n:function(){
            return I18n.getProjectI18n(AppConfig.projectId,AppConfig.language);
        },        
        showMapView: function() {
            var _this = this;
            this.showMapSelector().done(function() {
                _this.init();
                var map = new beop.getMapInstance();
                map.load();
            });
        },
        showPanelView: function () {
            var _this = this;
            this.showPanelSelector().done(function () {
                var PYFormat = new pyFormat(), PYItem;
                _this.PYProjectList = [];
                PYFormat.getPYLocalStorage().done(function (result) {
                    console.log('PYProjectList');
                    AppConfig.projectList.forEach(function (item) {
                        var pinyin = ' ';
                        PYItem = PYFormat.getPYMap(result.data, item.name_cn);
                        if (Array.isArray(PYItem)) {
                            PYItem.forEach(function (i) {
                                pinyin += i.pinyin;
                            });
                            _this.PYProjectList.push($.extend(true, {}, item, {
                                "id": item.id,
                                "PY": $.trim(pinyin),
                                "latlng": item.latlng,
                                "name_en": item.name_en
                            }));
                        } else {
                            _this.PYProjectList.push($.extend(true, {}, item, {
                                "id": item.id,
                                "PY": $.trim(pinyin),
                                "latlng": item.latlng,
                                "name_en": item.name_en
                            }));
                        }
                    });
                    PYFormat = null;
                });
                _this.init();
                //给地图，刷新，用户管理图标设置定位
                BEOPUtil.setRelativePosition($("#imgListCon"), $("#funList"), -45, 5);
                //窗口改变进行用户列表窗口位置设置
                $(window).resize(function () {
                    BEOPUtil.setRelativePosition($("#imgListCon"), $("#funList"), -45, 5)
                });
                if (AppConfig.beopCreateNewProject) {
                    $('#paneSelector').scrollTop(10000);
                    AppConfig.beopCreateNewProject = false;
                }
            });
        },

        setMapAvailable: function(available) {
            configMap.isMapAvailable = !!available;
        },

        getFavoriteProject: function() {
            var favoriteProject = null;
            AppConfig.projectList.forEach(function(project) {
                if (project.isFavorite) {
                    favoriteProject = project;
                }
            });
            return favoriteProject;
        },

        close: function() {
            $(window).off('resize');
            $('#scrollPages').height($('#divPages').height());
            _this.initNav();
            $(window).off('resize.nav').on('resize.nav', function(e) {
                // 由全屏引发的 resize 事件直接返回
                if ($('html').hasClass('sharpview-mode')) return;
                _this.initNav();
            });
        },
        showPanelSelector: function() {
            configMap.currentSelector = configMap.selectorType.panel;
            return WebAPI.get(configMap.paneTemplate).done(function(resultHtml) {
                var $resultHtml = $(resultHtml);
                $(ElScreenContainer).html($resultHtml);
                I18n.fillArea($resultHtml);
                var paneSelector = $("#paneSelector");
                var imgListCon = paneSelector.find('.project-media-container');
                paneSelector.html('');
                imgListCon.html('');
                var $imgList = _this.getImgList(imgListCon, 'all');
                //添加版本历史支持
                if (window.localStorage.getItem('language') === 'zh') {
                    var version = window.localStorage.getItem('versionHistory');
                    if (beop.data.versionHistory && !!beop.data.versionHistory && beop.data.versionHistory !== 'undefined') {
                        var $beopHistory = $('<a href="#page=VersionHistory" style="display: inline-block;width:auto;cursor: pointer;padding-left: 10px;"> beop version:' + beop.data.versionHistory.version + '</a>');
                        paneSelector.append($beopHistory);
                        $beopHistory.eventOff().eventOn('click', function() {
                            ScreenManager.goTo({
                                page: 'VersionHistory'
                            });
                        })
                    }
                }
                paneSelector.append($imgList);
            });
        },
        getImgList: function ($box, type) {
            $box.empty();
            let projects;
            if (type == 'all') {
                projects = AppConfig.projectList;
            } else if (type == 'search') {
                projects = _this.searchProjectInEn();
            }
            for (var i = 0; i < projects.length; i++) {
                    var project = projects[i];
                    var divMedia = $('<div class="media effect"><a><div class="img"><img class="media-object" src="' + BEOPUtil.getProjectImgPath(project) + '"></div></a></div>');
                    divMedia.attr('project-id', project.id);
                    var divMediaBody = $('<div class="media-body info"></div>')
                        .append($('<h4 class="media-heading">' + StringUtil.getI18nProjectName(project) + '</h4>'));
                    divMedia.find('a').append(divMediaBody);
                    $box.append(divMedia);
                }
            if (type == 'all') {
                $box.append('<div id="AddProjectInHomePage" class="media effect">+</div>');
            }
            return $box;
        },
        searchProjectInEn: function () {
            let projects = [],
                searchValue = $("#searchProjectInMapBox").find('.project-media-searchBox').val().trim();
            if (searchValue == '' || !searchValue) {
                projects = AppConfig.projectList;
            } else {
                projects =_this.dealAdvanceSearch($("#imgListCon .project-media-container"), searchValue.toLowerCase());
            }
            //$('#imgListCon').slideUp();
            return projects;
        },
        dealAdvanceSearch: function ($box, value) {
            var language = window.localStorage.getItem('language'), projectList = AppConfig.projectList, result = [];
            if (language === 'zh') {
                language = 'name_cn';
            } else if (language === 'en') {
                language = 'name_english';
            } else {
                language = 'name_cn';
            }
            var reg = /[a-z0-9A-Z\- ]/,
                searchValueList = value.split('');
            var isPullEnglish = true;
            searchValueList.forEach(function (item) {
                if (!reg.test(item)) {
                    isPullEnglish = false;
                }
            });
            if (Array.isArray(projectList)) {
                if (isPullEnglish) {
                    //如果搜索的内容是纯英文，有可能是英文和拼音
                    //英文里面如果搜索不到就去搜索拼音
                    //纯数字按id来查
                    _this.PYProjectList.forEach(function (item) {
                        if ((item.name_english && $.trim(item.name_english.toString()).toLowerCase().indexOf(value.toLowerCase()) !== -1)
                            || (item.PY && item.PY.toString().toLocaleLowerCase().indexOf(value.toString().toLocaleLowerCase()) !== -1)
                            || (item.id && $.trim(item.id).indexOf($.trim(value)) !== -1)) {//加入根据id搜索
                            result.push(item);
                        }
                    });
                } else {
                    //如果是纯中文的情况直接搜索　name_cn
                    projectList.forEach(function (item) {
                        if ((item.name_cn && $.trim(item.name_cn).indexOf(value) !== -1)) {
                            result.push(item);
                        }
                    });
                }
            }
            return result;
        },
        showMapSelector: function() {
            configMap.currentSelector = configMap.selectorType.map;
            return WebAPI.get(configMap.mapTemplate).done(function(resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                I18n.fillArea($('.map-row'));
            });
        },
        /**
         * 根据主题切换logo, 如果是自定义的logo不进行改变
         * @returns {boolean}
         */
        setLogo: function() {
            AppConfig.cbreLogoSetFlag = false;
            var logoImgBEOP = $('#navHomeLogo').find('img');
            if (logoImgBEOP.attr('company')) {
                return false;
            }
            if (AppConfig.userConfig.skin == 'dark') {
                logoImgBEOP.attr('src', '/static/images/logo_in_white.png');
            } else {
                logoImgBEOP.attr('src', '/static/images/logo_in_dark.png');
            }
        },
        attachEvents: function() {
            var $btnChangeSkin = $("#btnChangeSkin"),
                $labelChangeSkin = $('#labelChangeSkin');
            $("#btnLogout").eventOff('click').eventOn('click', function(e) {
                trackEvent('顶部导航注销点击', 'TopNav.Logout.Click');
                PaneProjectSelector.logout();
            }, '注销');
            $('#navHomeLogo').eventOff('click').eventOn('click', function(e) {
                    trackEvent('顶部导航Logo点击', 'TopNav.Logo.Click');
                })
                //显示 隐藏下拉框
            $labelChangeSkin.eventOff('click').eventOn('click', function(e) {
                e.stopPropagation();
                var $skinManege = $('#skinManege');
                if($skinManege.length!=0) {
                    $skinManege.remove();
                }
                new SkinSelector().show();
            }, 'navTool-skinLabel');

            //为了点击时父级div不消失
            $btnChangeSkin.eventOff('click').eventOn('click', function(e) {
                e.stopPropagation();
            }, 'navTool-skinSel');

            $("#btnUpdate").eventOn('click', function(e) {
                Spinner.spin(document.getElementById('paneSelector'));
                var alert;
                WebAPI.get("/observer/update").done(function(result) {

                    if (result == "success") {
                        alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectManager.UPDATE_COMPLETE);
                        alert.showAtTop(1000);
                    } else {
                        alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectManager.UPDATE_FAILED);
                        alert.showAtTop(1000);
                    }
                }).fail(function() {
                    alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectManager.UPDATE_FAILED);
                    alert.showAtTop(1000);
                }).always(function(e) {
                    Spinner.stop();
                });
            }, 'projUpdate');

            // modbus
            $("#modbus").eventOff('click').eventOn('click', function() {
                location.href = '#page=ModBusInterface&projectId=' + AppConfig.projectId;
            });

            //benchmark配置
            $("#btnBenchmark").parent('li').show().end().eventOff('click').eventOn('click', function() {
                trackEvent('顶部导航能源管理点击', 'TopNav.Benchmark.Click');
                ScreenManager.show(BenchmarkScreen);
            }, 'navTool-benchMark');

            //项目权限管理
            $("#btnPermissionManage").eventOff('click').eventOn('click', function() {
                ScreenManager.show(UserManagerController, ProjectPermissionManager,GroupProjectManager);
            }, 'navTool-permission');

            //全屏代码
            $('#btnFullScreen').eventOff('click').eventOn('click', function() {
                function launchFullscreen(element) { //全屏
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                    trackEvent('顶部导航全屏', 'TopNav.FullScreen.Launch');
                }

                function exitFullscreen() { //退出全屏
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                    trackEvent('顶部导航退出全屏', 'TopNav.FullScreen.Exist');
                }

                if (window.innerHeight !== screen.height) {
                    launchFullscreen(document.documentElement);
                } else {
                    exitFullscreen();
                }
            });

            $("#btnOperatingRecord").eventOff('click').eventOn('click', function(e) {
                trackEvent('顶部导航操作记录点击', 'TopNav.OperationRecord.Click');
                new OperatingRecord().show();
            }, 'navTool-operationRecord');

            $('#btnAlarmLogging').eventOff().eventOn('click', function(e) {
                ScreenManager.show(AlarmLogging);
                e.preventDefault();
            }, 'navTool-alarmLog');

            $('#liProjectAlarm').eventOff().eventOn('click', function(e) {
                //$('#ulAlarmPanel').show();
                var $ulAlarmPanel = $('#ulAlarmPanel');
                $ulAlarmPanel.toggle().next('.card-close').toggle().off().one('click', function(e) {
                    e.stopPropagation();
                    $ulAlarmPanel.hide();
                    $(this).hide();
                });
                e.stopPropagation();
                e.preventDefault();
            }, 'navTool-alarm');

            $("#btnResetPassword").eventOff('click').eventOn('click', function(e) {
                WebAPI.get("/static/views/admin/resetPassword" + ".html", null, function(resultHtml) {
                    $('#dialogContent').html(resultHtml);
                    $('#dialogModal').modal();
                })
            }, 'navTool-resetPwd');

            $("#btnPointManager").eventOff('click').eventOn('click', function(e) {
                trackEvent('顶部导航数据管理点击', 'TopNav.PointManager.Click');
                ScreenManager.goTo({
                    page: 'PointManagerRealTimeData',
                    projectId: AppConfig.projectId
                })
            }, 'navTool-point');

            $("#btnChangeProject").eventOff('click').eventOn('click', function(e) {
                trackEvent('顶部导航切换项目点击', 'TopNav.ChangeProject.Click');
                ScreenManager.goTo({
                    page: 'PaneProjectSelector'
                })
            }, '切换项目');

            $("#btnFactory").eventOff('click').eventOn('click', function(e) {
                trackEvent('顶部导航Factory点击', 'TopNav.Factory.Click');
                if(AppConfig.projectId){//直接跳转到factory项目
                    localStorage.setItem('indexToFactoryId',AppConfig.projectId);
                }else{
                    localStorage.removeItem('indexToFactoryId');
                }
            }, 'Factory');
            $("#paneWorkflow").eventOff('click').eventOn('click', function(e) {
                trackEvent('顶部导航我的工单点击', 'TopNav.Workflow.Click');
            }, 'Factory');

             $('#ulAlarmPanel').eventOff().eventOn('click', 'a', function(e) {
                // go to alarm list page
                ScreenManager.goTo({
                    page: 'AlarmLogging'
                })
            });

            $("#divPages").eventOff().eventOn('click', 'li', function(e) { //给页面顶部nav添加点击后样式
                var $this = $(this);
                if ($this.hasClass('active')) {
                    return;
                }
                if ($this.find("ul").length == 0) {
                    $("#divPages li").removeClass("active");
                    $this.closest("li").addClass("active");
                }
            });

            $("#btnDebugTools").eventOff('click').eventOn('click', function(e) {
                window.localStorage.setItem("current_project", AppConfig.projectId);
            }, 'navTool-debugTool');



            $('#right-nav').off('click.loginState').on('click.loginState', '.loginState', function() {
                var $this = $(this);
                var $infoBoxMessage = $('.infoBoxMessage');
                $infoBoxMessage.hide();
                var $loginStateBox = $this.closest('#loginStateBox');
                _this.getProjectLineState(AppConfig.projectId).done(function(result, historyDataResut) {
                    if (result[0].success) {
                        var $lineStateListBox = $loginStateBox.find('.lineStateListBox');
                        var data = result[0].data,
                            dtuHistoryData = [];
                        if (data.detail && data.detail.length) {
                            for (var i = 0; i < data.detail.length; i++) {
                                if (data.detail[i].offTotalTime) {
                                    var offTotalTime = data.detail[i].offTotalTime.split(':');
                                    var time = [];
                                    if (Number(offTotalTime[0])) {
                                        time.push(offTotalTime[0] + 'day');
                                    }
                                    if (Number(offTotalTime[1])) {
                                        time.push(offTotalTime[1] + 'hour');
                                    }
                                    if (Number(offTotalTime[2])) {
                                        time.push(offTotalTime[2] + 'min');
                                    }
                                    data.detail[i].offTotalTime = time.join(' ');
                                }
                            }
                            if (historyDataResut[0].success) {
                                if (historyDataResut[0].data && historyDataResut[0].data.length) {
                                    historyDataResut[0].data.forEach(function(element) {
                                        dtuHistoryData.push(element.dtu);
                                    });
                                }
                                dtuHistoryData.sort(function(a, b) {
                                    return a.localeCompare(b);
                                });
                            }
                            if (data.detail.length > 1) {
                                data.detail.sort(function(a, b) {
                                    return b.offStartTime.localeCompare(a.offStartTime);
                                })
                            }
                        }
                        if (data.type == configMap.projectType.dtuProject) {
                            $('#lineStateListContent').empty().append(beopTmpl('tpl_showContent_dtu', {
                                list: data,
                                dtuHistory: dtuHistoryData
                            }));
                            if ($loginStateBox.hasClass('open')) {
                                $lineStateListBox.show();
                            }
                        } else if (data.type == configMap.projectType.enterProject) {
                            if (data.lastUpdateTime) {
                                $('#lineStateListContent').empty().append(beopTmpl('tpl_showContent_enter', { list: data }));
                                if ($loginStateBox.hasClass('open')) {
                                    $lineStateListBox.show();
                                }
                            }
                        }
                    }
                });
            }).off('click.lineStateListBox').on('click.lineStateListBox', '.lineStateListBox', function(event) {
                event.stopPropagation();
            }).off('click.tr').on('click.tr', '#offDtuTable tbody tr', function(event) {
                var $this = $(this);
                var $offDtuTable = $this.closest('#offDtuTable');
                var dtuName = $this.data('key');
                $offDtuTable.hide();
                $offDtuTable.siblings('#offDtuHistory').show();
                var $offDtuHistoryUl = $('#offDtuHistoryUl');
                $('#DtuHistoryDemo').css('height', $offDtuHistoryUl.height());
                var $dtuLi = $offDtuHistoryUl.find('li');
                for (var i = 0; i < $dtuLi.length; i++) {
                    if ($dtuLi.eq(i).data('key') == dtuName) {
                        $dtuLi.eq(i).find('.dtuInput').click();
                        return false;
                    }
                }
                event.stopPropagation();
            }).off('click.backBtn').on('click.backBtn', '#backBtn', function() {
                var $this = $(this);
                $this.closest('#offDtuHistory').hide();
                var $offDtuHistoryUl = $('#offDtuHistory');
                $offDtuHistoryUl.find('.dtuInput').prop('checked', false);
                $('#offDtuTable').show();
            }).off('click.allDtu').on('click.allDtu', '#offDtuHistoryUl .allDtu', function() {
                var $this = $(this);
                var isAll = !!$this.is(':checked');
                var $offDtuHistoryUl = $('#offDtuHistoryUl');
                $offDtuHistoryUl.find('li .dtuInput').prop('checked', isAll);
                _this.showHistory();
            }).off('click.dtuInput').on('click.dtuInput', '#offDtuHistoryUl li .dtuInput', function() {
                _this.showHistory();
            });

            $(document).eventOff('click.hide').eventOn('click.hide', function() {
                var $loginStateBox = $('#loginStateBox'),
                    $lineStateListBox = $loginStateBox.find('.lineStateListBox');
                $lineStateListBox.hide();
            });

            $(document).eventOff('click.infoBoxMessage').eventOn("click.infoBoxMessage", function(e) { //点击页面其它地方，隐藏消息列表
                var $target = $(e.target);
                if (!($target.closest(".infoBoxMessage").length)) {
                    $(".infoBoxMessage").hide();
                    isShowInfoBox = false;
                }
            }, 'BeOP图标');
            //当头像的下拉框点开就隐藏消息列表
            $('#iconList').on('show.bs.dropdown', function() {
                if (AppConfig.userId === 2715) {
                    $(this).find('#paneWorkflow').remove();
                }
                $(".infoBoxMessage").hide();
                $('.lineStateListBox').hide();
            });

            $('#loginState').on('show.bs.dropdown', function() {
                $(".infoBoxMessage").hide();
            });

            // 英文map中加搜索
            $("#indexMain").off('keyup.searchProjectInMapOnEn').on('keyup.searchProjectInMapOnEn', '#searchProjectInMapInput', function (ev) {
                if (ev.keyCode == 13) {
                    _this.searchList(ev);
                }
            }).off('click.advanceSearchBtn').on('click.advanceSearchBtn', '#advanceSearch-btn-1', function (ev) {
                _this.searchList(ev);
            }).off('click.searchClearInMapBox').on('click.searchClearInMapBox', '#searchClearInMapBox', function (ev) {
                $("#searchProjectInMapInput").val('');
                $(this).hide();
                _this.getImgList($('#imgListCon .project-media-container'), 'all');
            });
        },
        searchList: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            let $closeText = $('#searchProjectInMapBox .project-media-searchBox-clear'),
                $imgBox = $('#imgListCon .project-media-container');
            let val = $("#searchProjectInMapInput").val().trim();
            //如果搜索框一直执行Backspace操作就返回
            if (val == '') {
                $closeText.hide();
                _this.getImgList($imgBox, 'all');
            } else {
                $closeText.show();
                _this.getImgList($imgBox, 'search');
            }
        },
        init: function() {
            var _this = this,
                $btnChangeSkin = $("#btnChangeSkin"),
                $labelChangeSkin = $('#labelChangeSkin');
            this.initLanguage();
            //默认显示深色皮肤值
            _this.setLogo();
            var systemSkin = AppConfig.userConfig.skin;
            if(systemSkin=='platform'){
                window.location.href='/platform'
                return;
            }
            if (systemSkin) {
                $btnChangeSkin.val(systemSkin);
            } else {
                $btnChangeSkin.val('dark');
                systemSkin = 'dark';
            }
            if (systemSkin == 'dark') {
                loadDarkSkin();
            }

            //默认显示报表颜色黄色
            var $btnChangeReportSkin = $('#btnChangeReportSkin')
            var reportSkin = localStorage.getItem('reportSkin_' + AppConfig.userId);
            if (reportSkin) {
                $btnChangeReportSkin.val(reportSkin);
            } else {
                $btnChangeReportSkin.val('default');
                reportSkin = 'default';
            }
            if (reportSkin == 'dcolor') {
                loadReportDarkSkin();
            }
            function loadReportDarkSkin(){
                var head = document.querySelector('head');
                var $reportDarkSkin = $('#reportDarkSkin');
                if ($reportDarkSkin.length == 0) {
                    var $cssDark = $('<link id="reportDarkSkin" rel="stylesheet" type="text/css" href="/static/content/report-black.css?' + new Date().getTime() + '">');
                    head.appendChild($cssDark[0]);
                    $cssDark[0].onload = function() {
                        localStorage.setItem('reportSkin_' + AppConfig.userId, 'dcolor');
                    }
                }
            }

            function loadDarkSkin() {
                var head = document.querySelector('head');
                var $darkSkin = $('#darkSkin');
                if ($darkSkin.length == 0) {
                    var $cssDark = $('<link id="darkSkin" rel="stylesheet" type="text/css" href="/static/content/index-black.css?' + new Date().getTime() + '">');
                    head.appendChild($cssDark[0]);
                    $cssDark[0].onload = function() {
                        AppConfig.userConfig = AppConfig.userConfig||{};
                        AppConfig.userConfig.skin = 'dark';
                    }
                }
                //设置echart主题
                (typeof theme == 'object') && (AppConfig.chartTheme = theme.Dark);
            }

            if (AppConfig&& AppConfig.projectList && !AppConfig.projectList.length) {
                var html = '<div id="createNewProjectWrapper">' +
                    '<div id="createNewProjectBox">' +
                    '<h3 i18n="admin.projectCreator.CREATE_PROJECT_TEXT"></h3>' +
                    '<div id="projectItemBox" class="oh">' +
                    '<div id="project_demo" class="cp fl first-project fr20">' +
                    '<img src="/static/images/project_img/demo_project.jpg" />' +
                    '<div class="tc mt10"><button class="btn btn-primary" i18n="admin.projectCreator.DEMO_PROJECT"></button></div>' +
                    '</div>' +
                    '<div id="project_new" class="cp fl first-project">' +
                    '<img src="/static/images/project_img/new_project.jpg" />' +
                    '<div class="tc mt10"><button class="btn btn-success" i18n="admin.projectCreator.NEW_PROJECT"></button></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $("#indexMain").empty().html(html);
                I18n.fillArea($('#createNewProjectWrapper'));

                $("#project_new").off().on('click', function() {
                    ScreenManager.show(PaneAddProject);
                });
                return;
            }

            $("#rowLogin").animate({
                left: '-250px',
                opacity: '0.5',
                height: '10px',
                width: '10px',
                marginTop: '0'
            }, null, function() {
                $("#rowLogin").css("display", "none");
            });
            $("#rowSelector").eventOn('click', '.media', function(e) {
                if ($(this).is("#AddProjectInHomePage")) {
                    AppConfig.systemEntrance = 'add';
                    ScreenManager.show(PaneProjectCreator);
                    return;
                }
                var projectId = $(this).attr('project-id');
                Spinner.spin(document.getElementById('paneSelector'));

                var project = BEOPUtil.getProjectById(projectId);
                AppConfig.projectCurrent = project;

                var preRequest = []; 
                preRequest.push(_this.initProject(projectId));
                if (AppConfig.projectCurrent && AppConfig.projectCurrent.i18n == true){
                    I18n.getProjectI18n(projectId, AppConfig.language).always(() => {
                        _this.initProject(projectId).done(function (result) {
                            _this.initDefaultPage(result);
                        }).always(function () {
                            Spinner.stop();
                        })
                    })
                }else{
                    _this.initProject(projectId).done(function(result) {
                        _this.initDefaultPage(result);
                    }).always(function() {
                        Spinner.stop();
                    })
                } 

            }, ['projSel', 'projSel', 'text',
                function(e) {
                    if ($(e.currentTarget).is("#AddProjectInHomePage")) {
                        return;
                    }
                    return $(e.currentTarget).attr('project-id').search(/\d/g);
                }
            ]).animate({ opacity: '1' }).show();

            if (AppConfig.userId == 1) {
                $('.adminFeature').show();
            }
            if (configMap.isMapAvailable) {
                $('#btnMapSelector').show().eventOn('click', function() {
                    var selector = new PaneProjectSelector();
                    selector.show(configMap.selectorType.map);
                }, 'projMapSelect')
            }
            //init user control pane
            $("#right-nav").show();
            $("#paneUser").html(AppConfig.userProfile.fullname || AppConfig.account);
            $('#iconList .userPic.small').attr('src', 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/' + AppConfig.userProfile.picture).attr('alt', AppConfig.userProfile.fullname || AppConfig.account);
            $('#btnAccountManage .userPic').attr('src', 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/' + AppConfig.userProfile.picture).attr('alt', AppConfig.userProfile.fullname || AppConfig.account);

            
            var $btnDebugTools = $("#btnDebugTools");
            AppConfig.debugTool ? $btnDebugTools.show() : $btnDebugTools.hide(); // 判断用户是否有调试工具权限

            var isShowInfoBox = false;
            var messageOptions = {
                pageSize: 3,
                pageNumber: 1
            };
            var nextPageData = [],
                currentIndex = messageOptions.pageSize;

            var getMessageLatest = function(pageSize, pageNumber) {
                return WebAPI.post('/message/api/v1/queryUserMessage', {
                    limit: pageSize || messageOptions.pageSize,
                    page: pageNumber || messageOptions.pageNumber,
                    type: "notRead",
                    tags: null
                });
            };
            var translateOp = function(text) {
                switch (text) {
                    case 'reply':
                        return I18n.resource.workflow.notice.TASK_REPLY;
                    case 'new':
                        return I18n.resource.workflow.notice.TASK_CREATE;
                    case "complete":
                        return I18n.resource.workflow.notice.TASK_FINISH;
                    case "verified":
                        return I18n.resource.workflow.notice.TASK_VERIFIED;
                    case "not_verified":
                        return I18n.resource.workflow.notice.TASK_VERIFIED_FAILED;
                    case "start":
                        return I18n.resource.workflow.notice.TASK_START;
                    case "end":
                        return I18n.resource.workflow.notice.TASK_CLOSED;
                    case "edit":
                        return I18n.resource.workflow.notice.TASK_EDIT;
                    case "forward":
                        return I18n.resource.workflow.notice.TASK_FORWARD;
                    default:
                        return text;
                }
            };
            var showNextMsg = function(msg) {
                var html = "",
                    unreadClass = msg.isRead ? false : 'unread markAsRead';
                var senderUserInfo = msg.messageInfo && msg.messageInfo.sender && msg.messageInfo.sender.senderInfo || {
                    userpic: "",
                    userfullname: '',
                    useremail: '',
                    id: ''
                };
                var baseLogo = 'static/images/beop_cloud.png';
                html += '<li id="infoBoxMessage-' + msg.msgId + '" data-msg-id="' + msg._id + '">' +
                    '<div class="fl wdr1"><img class="userImg" src="' + (msg.messageInfo.task && msg.messageInfo.subType != 'escalation' ? senderUserInfo.userpic : baseLogo) + '"/></div>';
                if (msg.messageInfo.task) {
                    if (msg.messageInfo.subType == 'escalation') {
                        html += '<a class="messageLink" href="#page=workflow&type=transaction&transactionId=' + msg.messageInfo.task.id + '"><div class="fl wdr2 messageText">' +
                            '<span class="messageUserName mr5">' + msg.messageInfo.title + '</span>' +
                            '<div>' + msg.messageInfo.content + '</div></a>';
                    } else {

                        html += '<a class="messageLink" href="#page=workflow&type=transaction&transactionId=' + msg.messageInfo.task.id + '"><div class="fl wdr2 messageText">' +
                            '<span class="messageUserName mr5">' + senderUserInfo.userfullname + '</span>' +
                            '<span>' + translateOp(msg.messageInfo.task.op) + '</span>' +
                            '<div>' + msg.messageInfo.title + '</div></a>';
                    }
                } else {
                    html += '<div class="fl wdr2 messageText">' +
                        '<span class="messageUserName mr5">' + msg.messageInfo.title + '</span>' +
                        '<div>' + msg.messageInfo.content + '</div>';
                }

                html +=
                    '</div>' +
                    '<div class="fl tr wdr3 messageRight"><div class="messageTime">' + timeFormat(msg.messageInfo.time, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME)) + '</div>' +
                    '<div class="' + unreadClass + ' "><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div>' +
                    '</div>' +
                    '</li>';
                return html;
            };
            var renderMessageBox = function() {
                var $infoBoxMessage = $('.infoBoxMessage');
                messageOptions.pageNumber = 1;
                getMessageLatest(messageOptions.pageSize, 1).done(function(result) {
                    if (result.success) {
                        var $badge = $('#messageAll .badge');
                        var data = result.data,
                            messageHtml = '<ul>',
                            unreadClass;
                        if (data.totalCount > 0) {
                            $badge.text(data.totalCount).show();
                        } else {
                            $badge.text(' ').hide();
                        }
                        nextPageData = data.message;
                        currentIndex = 0;
                        data.message.forEach(function(item) {
                            unreadClass = item.isRead ? false : 'unread markAsRead';
                            messageHtml += showNextMsg(item);
                        });
                        messageHtml += '</ul>';
                        if (data.totalCount === 0) {
                            messageHtml += '<div class="noMsgPromptText">' +
                                I18n.resource.workflow.message.NO_UNREAD_MESSAGES +
                                '</div>' +
                                '<div id="messageShowAll" class="tc cp messageShowAll"><a href="#page=AllMessages"><span>' +
                                i18n_resource.workflow.message.VIEW_ALL_NEWS +
                                '</span><span>&gt;&gt;</span></a></div>';
                        } else {
                            messageHtml += '<div id="messageShowAll" class="tc cp messageShowAll"><a href="#page=AllMessages"><span>' +
                                i18n_resource.workflow.message.VIEW_ALL_NEWS +
                                '</span><span>&gt;&gt;</span></a></div>';
                        }
                        if (isShowInfoBox) {
                            messageInfoBox(messageHtml, {
                                initCb: function() {
                                    I18n.fillArea($('.infoBoxMessage'));
                                    var $el = this.$el;
                                    var $markAsReadBtn = $el.find('.header-right'),
                                        $showMoreBtn = $el.find("#messageShowAll");
                                    if (!$el.find('.infoBox-msg ul li').length) {
                                        $el.find(".header-right").remove();
                                    }
                                    //markAllMessageAsRead
                                    this.$el.off('click.markAsAllRead').on('click.markAsAllRead', '.markAsAllRead', function() {
                                        Spinner.spin($el.get(0));

                                        WebAPI.post('/message/api/v1/markAllAsRead').done(function() {
                                            $el.find(".infoBox-msg ul li").remove();
                                            $markAsReadBtn.hide();
                                            $badge.text('').hide();
                                            $showMoreBtn.before($('<div class="noMsgPromptText"></div>'));
                                            $el.find('.noMsgPromptText').html(I18n.resource.workflow.message.NO_UNREAD_MESSAGES);
                                        }).always(function() {
                                            Spinner.stop();
                                        }).fail(function() {
                                            alert(I18n.resource.workflow.message.MARK_READ_FAILED);
                                        })
                                    });

                                    this.$el.off('click.markAsRead').on('click.markAsRead', '.markAsRead', function() {
                                        var $this = $(this),
                                            $parent = $this.closest('li'),
                                            msgId = $parent.data("msg-id");
                                        if (msgId) {
                                            Spinner.spin($parent.closest('ul').get(0));
                                            WebAPI.post('/message/api/v1/markAsRead', { msgIdList: [msgId] }).done(function() {
                                                Spinner.stop();
                                                renderMessageBox();
                                            })
                                        }
                                    });

                                    this.$el.on('click', '.messageLink', function() {
                                        var msgId = $(this).closest('li').data("msg-id");
                                        if (msgId) {
                                            WebAPI.post('/message/api/v1/markAsRead', { msgIdList: [msgId] });
                                            WebAPI.post('/message/api/v1/deleteUserMsg', { msgIdList: [msgId] });
                                        }
                                    })
                                }
                            });
                        }
                    }
                    $infoBoxMessage.remove();
                }).fail(function() {
                    alert(I18n.resource.workflow.message.READ_USER_UNREAD_MESSAGES_FAILED);
                });
            };
            renderMessageBox();

            $("#messageAll").off().click(function() { // 添加消息
                var $infoBoxMessage = $('.infoBoxMessage');
                if ($infoBoxMessage.is(":visible")) {
                    $infoBoxMessage.hide();
                    isShowInfoBox = false;
                } else {
                    isShowInfoBox = true;
                    renderMessageBox();
                }
                $('.lineStateListBox').hide();
            });
            $('#divPages>span').css('display', 'none');
            $('ulPages').css('left', '0');
            $('#ikenBtn').hide();

            /*百度统计*/
            //var _hmt = _hmt || [];
            // _hmt.push(['_trackEvent', '切换项目', 'click', 'user-' + AppConfig.userId +'/project-'+(AppConfig.projectId?AppConfig.projectId:0)]);
            //document.getElementById('indexMain').style.height = (window.innerHeight - $('.navbar').get(0).offsetHeight) + 'px';
            //document.getElementById('indexMain').style.top =$('.navbar').get(0).offsetHeight + 'px';

            this.attachEvents();
            return this;
        },
        //语言切换
        initLanguage: function() {
            var _this = this;
            var $btnSelectLanguage = $('#sltLanguage a');
            AppConfig.language = localStorage.getItem("language");
            $btnSelectLanguage.off('click').on('click', function(e) {
                AppConfig.language = e.currentTarget.attributes.value.value;
                localStorage["language"] = AppConfig.language;
                WebAPI.post('/setUserConfig',{
                    userId:AppConfig.userId,
                    option:{
                        'language':AppConfig.language
                    }
                });
                InitI18nResource(e.currentTarget.attributes.value.value, true).always(function(rs) {
                    I18n = new Internationalization(null, rs);
                    window.location.reload();
                });
                trackEvent('顶部导航切换语言', 'TopNav.ChangeLanguage' + AppConfig.language);
            });
        },

        showHistory: function() {
            var dtuNameBox = [];
            var $offDtuHistoryUl = $('#offDtuHistoryUl'),
                $offDtu = $offDtuHistoryUl.find('li .offDtu');
            for (var i = 0; i < $offDtu.length; i++) {
                if ($offDtu.eq(i).siblings('.dtuInput').is(':checked')) {
                    dtuNameBox.push($offDtu.eq(i).text());
                }
            }
            WebAPI.post('/project/status/history/', {
                'projectId': AppConfig.projectId,
                'dtu': dtuNameBox,
                'startTime': '',
                'endTime': ''
            }).done(function(restlt) {
                if (restlt.success) {
                    var unitedData = _this.convertData(restlt.data);
                    _this.historyData = $.extend(true, {}, unitedData);
                    _this.refreshChart($("#DtuHistoryDemo"));
                } else {
                    console.error(restlt.msg);
                }
            });
        },
        convertData: function(data) {
            if (!data || !data.length) {
                data = [];
            }
            var newData = {
                data: {},
                timeStamp: []
            };

            for (var i = 0; i < data.length; i++) {
                var history = data[i].history;
                if (history.length) {
                    newData.data[data[i].dtu] = history.map(function(point) {
                        return {
                            value: point.state
                        };
                    });
                    newData.timeStamp = history.map(function(point) {
                        return point.time;
                    });
                }
            }
            return newData;
        },
        refreshChart: function($container) {
            var arrXAxis = [],
                legends = [],
                series = [];
            var dataIndex = false;
            if (!this.historyData || !this.historyData.data || $.isEmptyObject(this.historyData.data)) {
                $container.addClass('dn');
            }else{
                if ($container.hasClass('dn')) { 
                    $container.removeClass('dn');
                }
            }

            if (this.historyData && this.historyData.timeStamp.length) {
                for (var i = 0; i < this.historyData.timeStamp.length; i++) {
                    var timeStamp = this.historyData.timeStamp[i];
                    if (!dataIndex && (new Date(timeStamp) > new Date())) {
                        dataIndex = index;
                    }
                    timeStamp = timeStamp ? timeFormat(timeStamp, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC)) : timeStamp;
                    arrXAxis.push(timeStamp);
                }
            }

            for (var pointName in this.historyData.data) {
                if (this.historyData.data.hasOwnProperty(pointName)) {
                    var seriesData = [];
                    if (dataIndex) {
                        seriesData = this.historyData.data[pointName].slice(0, dataIndex);
                        for (var d = dataIndex; d < this.historyData.data[pointName].length; d++) {
                            seriesData.push('');
                        }
                    } else {
                        seriesData = this.historyData.data[pointName];
                    }
                    var newData = [];
                    for (var j = 0; j < seriesData.length; j++) {
                        newData.push(seriesData[j].value);
                    }
                    legends.push(pointName);
                    series.push({
                        name: pointName,
                        type: 'line',
                        step: 'end',
                        smooth: false,
                        data: newData
                    });
                }
            }

            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    top: '0',
                    x: 'center',
                    data: legends
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                dataZoom: [{
                    show: true,
                    type: 'slider',
                    textStyle: { color: '#eee' },
                    handleStyle: {
                        borderColor: '#0078dc'
                    }
                }],
                formatTime: false, // 当前数据不进行数据格式化
                xAxis: [{
                    type: 'category',
                    data: arrXAxis.map(function(str) {
                        return str.replace(' ', '\n')
                    })
                }],
                yAxis: {
                    type: "category",
                    data: [I18n.resource.workflow.lineState.OFFLINE, I18n.resource.workflow.lineState.ONLINE]
                },
                grid: {
                    top: '23%',
                    left: '2%',
                    right: '3%',
                    containLabel: true
                },

                series: series
            };
            if(!this.historyChart){
                this.historyChart = echarts.init($container.get(0), AppConfig.chartTheme);
            }else{
                this.historyChart.clear(); 
            }
            this.historyChart.setOption(option);
        },
        getProjectLineState: function(projectId) {
            return $.when(WebAPI.post('/project/status',{projectId:projectId}), WebAPI.post('/project/status/history/', {
                'projectId': AppConfig.projectId,
                'dtu': '',
                'startTime': '',
                'endTime': ''
            })).done(function(lineStateDateResult) {
                var result = lineStateDateResult[0];
                if (result.success) {
                    var $loginStateBox = $("#loginStateBox");
                    $loginStateBox.empty().append(beopTmpl('tpl_show_LineState', { list: result.data })).show();
                    var $lineStateListBox = $loginStateBox.find('.lineStateListBox');
                    $lineStateListBox.hide();
                    if (!result.data.dtuOff) {
                        $loginStateBox.css('margin-right', '0px');
                    } else {
                        $loginStateBox.css('margin-right', '10px');
                    }
                } else {
                    console.error(result.msg);
                }
            });
        },
        initProject: function(projectId, pageId) {
            if (!projectId) {
                alert.danger(I18n.resource.common.NOT_FIND_PREJECT_ID);
                return;
            }
            var project = BEOPUtil.getProjectById(projectId);
            AppConfig.projectCurrent = project;
            var _this = this;
            
            return WebAPI.get("/get_plant_pagedetails/" + projectId + "/" + AppConfig.userId + "/" + AppConfig.language).done(function(result) {
                if(AppConfig.projectCurrent&&AppConfig.projectCurrent.i18n==1){
                    result.navItems.map(item=>{
                        item.originText = item.text;
                        item.text = I18n.trans(item.text);
                    })
                }
                checkClusterRedirectionAndGo(result);
                var result_obj = result;
                AppConfig.projectId = project.id;
                AppConfig.projectName = project.name_en;
                AppConfig.projectShowName = StringUtil.getI18nProjectName(project);
                AppConfig.projectBenchmark = result_obj.benchmark;
                AppConfig.navItems = result_obj.navItems;

                if (AppConfig.projectId == 674) {
                    $('#navHomeLogo').find('img').attr('src', '/static/images/cbre_logo.png');
                    AppConfig.cbreLogoSetFlag = true;
                    
                }
                trackEvent('项目访问', 'PROJECT_VISIT');
                //进入项目的时候 默认单位设置
                if (typeof(Unit) === "function") {
                    Unit = new Unit();
                }
                AppConfig.unit_currency = Unit.getCurrencyUnit(project.unit_currency);
                Unit.getUnitSystem(project.unit_system).always(function(rs) {
                    AppConfig.unit_system = unitSystem;
                });

                // show project menu
                $('#liProjectMenu').show();
                if (!AppConfig.navItems.length && ScreenCurrent && ScreenCurrent.showMapView) { //单项目登录进入地图时,如果没有没有配置菜单,进入地图选择页面
                    if (configMap.isMapAvailable) {
                        _this.showMapView();
                    } else {
                        _this.showPanelView();
                    }
                }
                if (loginCode && loginCode.toLowerCase() == 'hzbt') { //华滋奔腾需要把项目名显示在左侧
                    $('#txtProjectTitle').text(AppConfig.projectShowName).removeAttr('i18n');
                    if (project.logo && project.logo != 'None') {
                        $('#navHomeLogo span').attr("style", "width: 78px; height: 32px;background-image: url(" + project.logo + ") !important;");
                    }
                } else {
                    $('#projectMenu').text(StringUtil.getI18nProjectName(project)).attr('title', StringUtil.getI18nProjectName(project)).show();
                }
                
                //显示在线离线状态
                var $iconList = $("#iconList");
                var $lineStateShow = $(".lineStateShow");
                if ($lineStateShow && $lineStateShow.length) {
                    $lineStateShow.remove();
                }
                $iconList.after('<div id="loginStateBox" class="fr lineStateShow" permission="OffLTimeView" style="position: relative;"></div>');
                _this.getProjectLineState(projectId);
                I18n.fillArea($('#navPane'));

                // 清除本地保存  tag  项目id
                if (localStorage.getItem('tagProjectId')) {
                    localStorage.removeItem('tagProjectId');
                }

                // 保存页面的text 
                // var urlPageText = sessionStorage.getItem("nav_i18n_name");
                // for (var i = 0; i < result_obj.navItems.length; i++) {
                //     var pageParam = ScreenManager._getHashParamsMap();
                //     if (result_obj.navItems[i].text == urlPageText) {
                //         ScreenManager.goTo({
                //             page: pageParam.page,
                //             id: result_obj.navItems[i].id
                //         });
                //         break;
                //     }
                // }

                // show alarm menu, and start alarming
                BackgroundWorkers.alarmReporter.postMessage({ type: 'dataAlarmRealtime', projectId: projectId });
                _this.initNavigationPane(result_obj.navItems);
                _this.initMenu(result_obj.observerPages, result_obj.groupInfo);
                hadWidth = document.getElementById('right-nav').offsetWidth + document.getElementById('navHomeLogo').offsetWidth;
                _this.initNav();
                if (Boolean(pageId)) {
                    var navBtnA = $('#ulPages').find('.nav-btn-a');
                    for (var i = 0, len = navBtnA.length; i < len; i++) {
                        var item = navBtnA.eq(i);
                        if (pageId == item.attr('pageid')) {
                            item.closest('li').attr('class', 'active'); // set one active
                            break;
                        }
                    }
                }

                $(window).off('resize.nav').on('resize.nav', (function() {
                    _this.initNav();
                }));
                if (beop.benchMark) {
                    beop.benchMark.refresh();
                }

                //在项目中, 后台管理进入项目管理页面
                var $btnMemberManage = $('#btnMemberManage');
                if ($btnMemberManage.length) {
                    $btnMemberManage.children('a').attr('href', '#page=UserManagerController&manager=ProjectPermissionManager');
                }
            }).fail(function(msg) {
                console.error(msg);
                alert.danger(I18n.resource.admin.projectSelector.PROJECT_OPEN_FAILED.format(StringUtil.getI18nProjectName(project)));
            });
        },
        initNav: function() {
            var divPageWidth = window.innerWidth - hadWidth - 115;
            var scrollPageWidth = divPageWidth - 50;
            var $scrollPages = $('#scrollPages');
            var ulPageWidth = 0;
            var $ulPages = $('#ulPages'),
                $divPages = $('#divPages');
            var isPlay = false;
            var liWidth = 0;
            var $ikenBtn = $('#ikenBtn');
            if(AppConfig.projectId===647||AppConfig.projectId===671){
                $ikenBtn.show();
                $ikenBtn.find('i').tooltip({trigger:'hover'});
                I18n.fillArea($ikenBtn);
                $ikenBtn.find('i').off('show.bs.tooltip').on('show.bs.tooltip', function () {
                  $(this).attr('title','');
                })
                $ikenBtn.off('click').on('click',function(){
                    history.back();
                })
            }else{
                $ikenBtn.hide();
            }
            $ulPages.children('li').each(function() {
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
                $ikenBtn.css('left','115px');
                $('#btnPageScrollLeft').eventOff('click').eventOn('click', function() {
                    if (isPlay) return;
                    if (-parseInt($ulPages.css('left')) > ulPageWidth - scrollPageWidth) return;
                    isPlay = true;
                    $ulPages.animate({ "left": "-=100px" }, function() {
                        isPlay = false;
                    })
                }, 'navPage-btnScrollLeft');
                $('#btnPageScrollRight').eventOff('click').eventOn('click', function() {
                    if (isPlay) return;
                    if (-parseInt($ulPages.css('left')) < 100) return;
                    isPlay = true;
                    $ulPages.animate({ "left": "+=100px" }, function() {
                        isPlay = false;
                    })
                }, 'navPage-btnScrollRight');
            } else {
                $('#divPages>span').css('display', 'none');
                $ikenBtn.css('left','127px');
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
                var height = 20,
                    defaultHeight = 26;
                var $liList = $ul.find('li');
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

            function showSubDropDownEvent(e) {
                var $this = $(this),
                    $ul = $this.closest('.dropdown-submenu').children("ul");
                if ($this.hasClass('showUl')) {
                    $this.removeClass('showUl');
                    $ul.slideUp().removeClass('active');
                } else {
                    $this.addClass('showUl');
                    $ul.slideDown().addClass('active');
                }
                e.stopPropagation();
            }

            $scrollPages.off('show.bs.dropdown', '.dropdown')
                .off('show.bs.dropdown', '.dropdown')
                .off('click.dropdown-submenu', '.dropdown-submenu>a');

            $scrollPages.on('show.bs.dropdown', '.dropdown', showDropDownEvent).on('hide.bs.dropdown', '.dropdown', hideDropDownEvent)
                .on('click.dropdown-submenu', '.dropdown-submenu>a', showSubDropDownEvent);
        },
        refreshAlarmPanel: function(data) {
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
                        DateUtil.getRelativeDateInfo(new Date(), new Date(data[i]['time']))));
                }
                // add "See All Alarms" panel footer
                arrHtml.push('<li class="dropdown-header"><a href="javascript:;">See All Alarms></a></li>');
                //头像显示有消息
                $imgBadge.html('&nbsp;');
            }

            $('#ulAlarmPanel').html(arrHtml.join(''));
        },
        menuScreenFactory: function(type) {
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
                case 'energy':
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
                    screen = namespace('observer.screens.PageScreen');
                    break;
                case 'FacReportScreen':
                    screen = namespace('observer.screens.FacReportScreen');
                    break;
                case 'FacReportWrapScreen':
                    screen = namespace('observer.screens.FacReportWrapScreen');
                    break;
                case 'BenchmarkScreen':
                    screen = BenchmarkScreen;
                    break;
                default:
                    break;
            }
            return screen;
        },
        setMenuActive: function() {
            var $ulPages = $("#ulPages");
            var $targetLi = $ulPages.find('[pageId="' + ScreenManager.getPageId() + '"]');
            $ulPages.find('ul:not(".dropdown-menu").active').hide();
            if($targetLi.length!=0) {
                $ulPages.find('.active').removeClass('active');
            }
            var $targetUl = $targetLi.closest('ul').addClass('active');
            if (!$targetUl.is('#ulPages')) {
                var $ulbox = $targetLi.closest('.popover');
                $ulbox.find('.showUl').removeClass('showUl');
            } else {
                if ($ulPages.find('a.showUl') && $("#ulPages").find('a.showUl').length) {
                    $ulPages.find('a.showUl').closest('li').children('ul').addClass('active');
                }
            }
            $targetLi.addClass('active').closest('li.dropdown').addClass('active');
            if (!$targetUl.is('.dropdown-menu')) {
                $targetLi.parents('li').addClass('active').children('a:not(".nav-btn-a")').addClass('showUl');
                $targetLi.parents('li').addClass('active').children('ul:not(".dropdown-menu")').addClass('active');
            }
        },
        initMenu: function(pages, groups) {
            var _this = this;
            var navBtnA = $('#ulPages .nav-btn-a');

            var ulTag = document.getElementById('ulObserverScreenList');
            var pageIdFromHash = ScreenManager.getPageId();
            if (ulTag) {
                ulTag.innerHTML = '<div class="arrow"></div>';

                var arrGroupUsed = [];
                for (var i = 0, len = pages.length; i < len; i++) {
                    arrGroupUsed.push(pages[i].groupid);
                }
                var nShowGroupCnt = 0;
                for (var i = 0, len = groups.length; i < len; i++) {
                    var item = groups[i];
                    var bGroupFind = false;
                    for (var j = 0, len2 = arrGroupUsed.length; j < len2; j++) {
                        if (arrGroupUsed[j] == item.id) {
                            bGroupFind = true;
                            nShowGroupCnt++;
                            break;
                        }
                    }
                }
                for (var i = 0, group, liTag, aTag, ulDropDown, len = groups.length; i < len; i++) {
                    group = groups[i];
                    var bGroupFind = false;
                    for (var j = 0, len2 = arrGroupUsed.length; j < len2; j++) {
                        if (arrGroupUsed[j] == group.id) {
                            bGroupFind = true;
                            break;
                        }
                    }
                    if (!bGroupFind) {
                        continue;
                    }

                    if (nShowGroupCnt > 1) {
                        liTag = document.createElement("li");
                        aTag = document.createElement("a");
                        aTag.textContent = group.name;
                        ulDropDown = document.createElement("ul");
                        liTag.setAttribute("groupid", group.id);
                        liTag.setAttribute("class", "dropdown-submenu");
                        if (pageIdFromHash && pageIdFromHash == group.id) {
                            liTag.classList.add('active');
                        }
                        liTag.appendChild(aTag);
                        liTag.appendChild(ulDropDown);
                        ulTag.appendChild(liTag);
                    }
                }

                for (var i = 0, page, liTag, aTag, len = pages.length; i < len; i++) {
                    page = pages[i];
                    liTag = document.createElement("li");
                    aTag = document.createElement("a");
                    aTag.textContent = page.name;
                    liTag.setAttribute("pageid", page.id);
                    if (pageIdFromHash && pageIdFromHash == page.id) {
                        liTag.classList.add('active');
                    }
                    (function(page) {
                        $(aTag).eventOn('click', function(e) {
                            Spinner.spin(ElScreenContainer);
                            ScreenManager.goTo({
                                page: 'ObserverScreen',
                                id: page.id
                            });
                        }, ['navPage', 'navPage', AppConfig.projectShowName, AppConfig.projectId, page.name, page.id]);
                    })(page);

                    if (nShowGroupCnt > 1) {
                        liTag.appendChild(aTag);
                        var $searchGroup = $(ulTag).find('li[groupid$=' + page.groupid + ']');
                        if ($searchGroup) {
                            var $ulGroup = $searchGroup.find('ul');
                            $ulGroup.append(liTag);
                        }
                        //ulTag.appendChild(liTag);
                    } else {
                        liTag.appendChild(aTag);
                        ulTag.appendChild(liTag);
                    }
                }
                this.setMenuActive();
            }
            //ulPages.children('li').removeClass('active');


            navBtnA.eventOff('click').eventOn('click', function(e) {
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
                    } else if ([namespace('observer.screens.PageScreen'),
                            namespace('observer.screens.FacReportScreen'),
                            namespace('observer.screens.FacReportWrapScreen')
                        ].indexOf(screen) > -1) {
                        ScreenManager.show(screen, {
                            id: pageId
                        }, 'indexMain');
                    } else {
                        ScreenManager.goTo({
                            page: currentTarget.getAttribute('page-type'),
                            id: pageId
                        });
                    }
                    _this.saveSessionStorage(pageId)
                } else {
                    ScreenManager.goTo({
                        page: currentTarget.getAttribute('page-type')
                    });
                }
            }, ['navPage-a', 'navPage', AppConfig.projectShowName, AppConfig.projectId, 'text', 'pageId']);

        },

        initDefaultPage: function(result) {
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
                                if (navItems[m].type === 'DropDownList') {
                                    pageId = navItems[m].id;
                                    continue;
                                }
                                pageId = navItems[m].id;
                                screen = this.menuScreenFactory(navItems[m].type);
                                if (navItems[m].type === 'ReportScreen') {
                                    ScreenManager.show(screen, pageId, navItems[m].reportType, navItems[m].reportFolder);
                                }
                                // Factory 发布的 PageScreen
                                else if (navItems[m].type === 'PageScreen') {
                                    ScreenManager.goTo({
                                        page: 'observer.screens.PageScreen',
                                        options: {
                                            id: pageId
                                        },
                                        container: 'indexMain'
                                    });
                                }
                                // Factory 发布的 ReportScreen
                                else if (navItems[m].type === 'FacReportScreen') {
                                    ScreenManager.goTo({
                                        page: 'observer.screens.FacReportScreen',
                                        options: {
                                            id: pageId
                                        },
                                        container: 'indexMain'
                                    });
                                } else if (navItems[m].type === 'FacReportWrapScreen') {
                                    ScreenManager.goTo({
                                        page: 'observer.screens.FacReportWrapScreen',
                                        options: {
                                            id: pageId
                                        },
                                        container: 'indexMain'
                                    });
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
                case 'FacReportWrapScreen':
                    ScreenManager.goTo({
                        page: 'observer.screens.FacReportWrapScreen',
                        options: {
                            id: pageId
                        },
                        container: 'indexMain'
                    });
                    break;
                default:
                    ScreenManager.goTo({
                        page: navItems[0].type,
                        id: pageId
                    });
            }
            this.saveSessionStorage(pageId)          
        },

        initDropDownItem: function(dropdownItem) {
            var _this = this,
                $liTag,
                $aTag,
                $dropDownWrapper = $('#DropDownList' + dropdownItem.parent);

            if (dropdownItem.type === 'EnergyScreen_M' && !Permission.hasPermission('Epage')) {
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
                        function replaceClass(navItemPic,liTag){
                if(navItemPic && navItemPic.indexOf('iconfont')>=0){
                    liTag = liTag.replace('glyphicon glyphicon-<%icon%>', navItemPic);
                }else{
                    liTag = liTag.replace(/<%icon%>/g, navItemPic);
                }
                return liTag;
            }
            var imgMenuPicDefault = imgMenuPicDefault = {
                ObserverScreen: 'iconfont icon-nav_monitor',
                DiagnosisScreen: 'iconfont icon-nav_diagnosis',
                AnalysisScreen: 'iconfont icon-nav_data_analysis',
                ReportScreen: 'iconfont icon-nav_report',
                EnergyScreen: 'iconfont icon-nav_dashboard',
                EnergyScreen_M: 'iconfont icon-nav_dashboard',
                DropDownList: 'iconfont icon-nav_other',
                WorkflowMine: 'iconfont icon-nav_work_order',
                defaultMenuPic: 'iconfont icon-nav_other',
                PageScreen: 'iconfont icon-nav_dashboard',
                FacReportScreen: 'iconfont icon-nav_report',
                FacReportWrapScreen: 'iconfont icon-nav_report',
                BenchmarkScreen: 'iconfont icon-BenchmarkScreen1',
                default:'iconfont icon-nav_other'
            };
            var iconTpl = '<img class="icon fromSvg" src="<%icon%>" onerror="this.style.display=\'none\'"/><span class="icon fromFont glyphicon glyphicon-<%icon%>"></span>'

            if (dropdownItem.pic) {
                // navItemPic = navItemPic.split('-')[0] + '-' + systemSkin + '.svg';
                strIcon =  replaceClass(dropdownItem.pic,iconTpl)
            } else {
                strIcon =   replaceClass(imgMenuPicDefault[dropdownItem.type],iconTpl);
            }


            $aTag = $('<a>'+strIcon + dropdownItem.text + '</a>');
            if (dropdownItem.type !== 'DropDownList') {
                if (_this.menuScreenFactory(dropdownItem.type) === ReportScreen) {
                    $liTag.attr('permission', 'RReport;Rreport');
                } else if (_this.menuScreenFactory(dropdownItem.type) === EnergyScreen) {
                    $liTag.attr('permission', 'RDashboard;Rdashboard');
                }

                $aTag.off('click').on('click', function(e, data) {
                    var opt = {};
                    var ScreenClass = _this.menuScreenFactory(dropdownItem.type);
                    Spinner.spin(ElScreenContainer);
                    if (ScreenClass === ReportScreen) {
                        $liTag.attr('permission', 'RReport;Rreport');
                        opt = {
                            page: 'ReportScreen',
                            reportId: dropdownItem.id,
                            reportType: dropdownItem.reportType,
                            reportFolder: dropdownItem.reportFolder,
                            reportText: dropdownItem.text
                        };
                    }
                    // Factory 发布的页面
                    else if ([namespace('observer.screens.PageScreen'),
                            namespace('observer.screens.FacReportScreen'),
                            namespace('observer.screens.FacReportWrapScreen')
                        ].indexOf(ScreenClass) > -1) {
                        ScreenManager.show(ScreenClass, {
                            id: dropdownItem.id
                        }, 'indexMain');
                        _this.saveSessionStorage(dropdownItem.id);                    
                        return;
                    } else if (dropdownItem.type == 'EnergyScreen_M') {
                        opt = {
                            page: dropdownItem.type,
                            id: dropdownItem.id,
                            isForMobile: true
                        };
                    } else {
                        opt = {
                            page: dropdownItem.type,
                            id: dropdownItem.id
                        };
                    }
                    if (data) {
                        opt = $.extend(opt, data);
                    }
                    ScreenManager.goTo(opt);
                    _this.saveSessionStorage(dropdownItem.id);                    
                });
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

        initNavigationPane: function(navItems) {
            var liTag, spanTag;
            var $ulPages = $("#ulPages");

            $ulPages.empty();
            $ulPages.css({ width: '', left: '' });
            $ulPages.show();

            var strLiObserver = '<li class="dropdown">\
                    <a class="dropdown-toggle nav-btn-a" id="<%menuId%>" data-toggle="dropdown" aria-expanded="false">\
                        <!--<span>\
                        <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>-->\
                        <%menuIcon%>\
                        <%menuName%>\
                        <span class="caret"></span>\
                    </a>\
                    <ul id="ulObserverScreenList" class="dropdown-menu popover bottom"></ul>\
                </li>';
            var strLiDiagnosis = '<li>\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                        <!--<span>\
                        <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>-->\
                        <%menuIcon%>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiAnalysis = '<li>\
                <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                        <!--<span>\
                        <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>-->\
                        <%menuIcon%>\
                    <%menuName%>\
                </a>\
            </li>';
            var strLiReport = '<li permission="RReport;Rreport">\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>" report-type="<%reportType%>" report-folder="<%reportFolder%>">\
                        <!--<span>\
                        <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>-->\
                        <%menuIcon%>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiEnergy = '<li permission="RDashboard;Rdashboard">\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                        <!--<span>\
                        <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>-->\
                        <%menuIcon%>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiDropDownList = '<li class="dropdown">\
                    <a class="dropdown-toggle nav-btn-a" pageId="<%menuId%>" data-toggle="dropdown" aria-expanded="false">\
                        <!--<span>\
                        <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>-->\
                        <%menuIcon%>\
                        <%menuName%>\
                        <span class="caret"></span>\
                    </a>\
                    <ul class="dropdown-menu scrollbar popover bottom" id="<%parentId%>"><div class="arrow"></div></ul>\
                </li>';

            var dropDownItems = [];
            AppConfig.menu = {};

            if (!navItems) return;
            var systemSkin = AppConfig.userConfig.skin;
            if (!systemSkin || systemSkin == null || systemSkin == undefined) {
                systemSkin = 'default';
            }
            var imgMenuPicDefault = imgMenuPicDefault = {
                ObserverScreen: 'iconfont icon-nav_monitor',
                DiagnosisScreen: 'iconfont icon-nav_diagnosis',
                AnalysisScreen: 'iconfont icon-nav_data_analysis',
                ReportScreen: 'iconfont icon-nav_report',
                EnergyScreen: 'iconfont icon-nav_dashboard',
                EnergyScreen_M: 'iconfont icon-nav_dashboard',
                DropDownList: 'iconfont icon-nav_other',
                WorkflowMine: 'iconfont icon-nav_work_order',
                defaultMenuPic: 'iconfont icon-nav_other',
                PageScreen: 'iconfont icon-nav_dashboard',
                FacReportScreen: 'iconfont icon-nav_report',
                FacReportWrapScreen: 'iconfont icon-nav_report',
                BenchmarkScreen: 'iconfont icon-BenchmarkScreen1',
                default:'iconfont icon-nav_other'
            };
            function replaceClass(navItemPic,liTag){
                if(navItemPic && navItemPic.indexOf('iconfont')>=0){
                    liTag = liTag.replace('glyphicon glyphicon-<%icon%>', navItemPic);
                }else{
                    liTag = liTag.replace(/<%icon%>/g, navItemPic);
                }
                return liTag;
            }
            for (var i = 0; i < navItems.length; i++) {
                if (navItems[i].isHide == 1)continue;
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

                    var navItemPic = navItems[i].pic,
                        navItemsType = navItems[i].type;
                    switch (navItemsType) {
                        case 'ObserverScreen':
                            liTag = strLiObserver;
                            // liTag = replaceClass(navItemPic,liTag);
                            break;
                        case 'PageScreen':
                        case 'FacReportScreen':
                        case 'FacReportWrapScreen':
                        case 'DiagnosisScreen':
                        case 'BenchmarkScreen':
                            liTag = strLiDiagnosis;
                            // liTag = replaceClass(navItemPic,liTag);
                            break;
                        case 'AnalysisScreen':
                            liTag = strLiAnalysis;
                            // liTag = replaceClass(navItemPic,liTag);
                            break;
                        case 'ReportScreen':
                            liTag = strLiReport;
                            liTag = liTag
                                .replace('<%reportType%>', navItems[i].reportType)
                                .replace('<%reportFolder%>', navItems[i].reportFolder);
                            liTag = replaceClass(navItemPic,liTag);
                            AppConfig.menu[navItems[i].id] = navItems[i].text;
                            break;
                        case 'EnergyScreen':
                        case 'EnergyScreen_M':
                            liTag = strLiEnergy;
                            // liTag = replaceClass(navItemPic,liTag);
                            AppConfig.menu[navItems[i].id] = navItems[i].text;
                            break;
                            // case 'EnergyScreen_M':
                            //     liTag = null;
                            //     break;
                        case 'DropDownList':
                            liTag = strLiDropDownList
                                .replace('<%parentId%>', 'DropDownList' + navItems[i].id);
                            // liTag = replaceClass(navItemPic,liTag);
                            break;
                        case 'WorkflowMine':
                            liTag = strLiReport;
                            // liTag = replaceClass(navItemPic,liTag);
                            break;
                        default:
                            break;
                    }
                    // var svgTpl  = '<img class="icon fromSvg" src="<%icon%>" onerror="this.style.display=\'none\'"/>'
                    // var iconTpl ='<span class="icon fromFont  iconfont <%icon%>"></span>'
                    var iconTpl = '<img class="icon fromSvg" src="<%icon%>" onerror="this.style.display=\'none\'"/><span class="icon fromFont glyphicon glyphicon-<%icon%>"></span>'
                    if (liTag) {
                        var menuItem = '';
                        if (navItemPic) {
                            // navItemPic = navItemPic.split('-')[0] + '-' + systemSkin + '.svg';
                            menuItem =  liTag.replace('<%menuIcon%>',replaceClass(navItemPic,iconTpl));
                        } else {
                            menuItem =   liTag.replace('<%menuIcon%>',replaceClass(imgMenuPicDefault[navItemsType],iconTpl));
                        }

                        menuItem = menuItem.replace('<%menuName%>', spanTag).replace('<%menuId%>', navItems[i].id).replace('<%pageType%>', navItems[i].type);
                        if (AppConfig.projectCurrent && AppConfig.projectCurrent.i18n == 1) {
                            menuItem = I18n.trans(menuItem);
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
            this.setMenuActive();
            I18n.fillArea($ulPages);
        },
        // serve for BackgroundWorkers.alarmReporter
        filterByAlarmRule: function(data) {
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
        saveSessionStorage: function (pageId) {
            if (AppConfig.projectCurrent.i18n == 1) {
                for (var i = 0; i < AppConfig.navItems.length; i++) {
                    if (AppConfig.navItems[i].id == pageId) {
                        sessionStorage.setItem("nav_i18n_name", AppConfig.navItems[i].originText);
                        break;
                    }
                }
            }
        },
        clearMenu: function() {
            // hide project menu
            $('#liProjectMenu').hide();
            $('#projectMenu').hide();
            // hide alarm menu, and stop alarming
            $('#liProjectAlarm').hide();
            $(".lineStateShow").remove();
            BackgroundWorkers.alarmReporter.postMessage({ type: 'clearTimer', name: 'dataAlarmRealtime' });
            // reset the alarm panel
            this.refreshAlarmPanel([]);

            //$('#projectMenu').text(I18n.resource.admin.navAdmin.LINK_PROJECTS);
            $("#ulPages").empty();

            AppConfig.navItems = null;
        }
    };

    PaneProjectSelector.logout = function() {
        WebAPI.get('/logout/' + AppConfig.userId).done(function() {
            AppConfig = {};
            window.onhashchange = null;
            localStorage.removeItem("userInfo");
            try {
                if (loginCode) {
                    location.href = '/company/' + loginCode;
                    return;
                }
            } catch (e) {}
            location.href = '/';

        });
    };
    return PaneProjectSelector;
})();
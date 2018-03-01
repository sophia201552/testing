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
                var remindsLen = data.reminds.length, schedulerLen = data.scheduler.length, transactionLen = data.transaction.length;
                var totalCount = transactionLen + schedulerLen;
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
            this.init();

            if (!selectorType) {//加载上一次的selector
                selectorType = configMap.currentSelector;
            }

            if (AppConfig.skipProjectSelector) {//仅有一个项目,不仅地图直接打开项目
                var favoriteProject = this.getFavoriteProject();
                var project = favoriteProject ? favoriteProject : AppConfig.projectList[0];

                this.initProject(project.id).done(function (result) {
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

        getFavoriteProject: function () {
            var favoriteProject = null;
            AppConfig.projectList.forEach(function (project) {
                if (project.isFavorite) {
                    favoriteProject = project;
                }
            });
            return favoriteProject;
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
                    divMedia.attr('project-id', project.id);

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
        /**
         * 根据主题切换logo, 如果是自定义的logo不进行改变
         * @returns {boolean}
         */
        setLogo: function () {
            var logoImgBEOP = $('#navHomeLogo').find('img');
            if (logoImgBEOP.attr('company')) {
                return false;
            }
            if (!localStorage.getItem('systemSkin_' + AppConfig.userId)) {
                logoImgBEOP.attr('src', '/static/images/logo_white.png');
            } else if (localStorage.getItem('systemSkin_' + AppConfig.userId) == 'dark') {
                logoImgBEOP.attr('src', '/static/images/logo_white.png');
            } else {
                logoImgBEOP.attr('src', '/static/images/logo_beop.png');
            }
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
                    var projectId = $(this).attr('project-id');
                    Spinner.spin(document.getElementById('paneSelector'));

                    _this.initProject(projectId).done(function (result) {
                        _this.initDefaultPage(result);
                    }).always(function () {
                        Spinner.stop();
                    });

                }, ['projSel', 'projSel', 'text',
                    function (e) {
                        return $(e.currentTarget).attr('project-id').search(/\d/g)
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
                }).fail(function () {
                    alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.projectManager.UPDATE_FAILED);
                    alert.showAtTop(1000);
                }).always(function (e) {
                    Spinner.stop();
                });
            }, 'projUpdate');


            //benchmark配置
            $("#btnBenchmark").parent('li').show().end().eventOff('click').eventOn('click', function () {
                ScreenManager.show(BenchmarkScreen);
            }, 'navTool-benchMark');

            //项目权限管理
            $("#btnPermissionManage").eventOff('click').eventOn('click', function () {
                ScreenManager.show(UserManagerController, ProjectPermissionManager);
            }, 'navTool-permission');

            //全屏代码
            $('#btnFullScreen').eventOff('click').eventOn('click', function () {
                function launchFullscreen(element) {//全屏
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                }

                function exitFullscreen() {//退出全屏
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }

                if (window.innerHeight !== screen.height) {
                    launchFullscreen(document.documentElement);
                } else {
                    exitFullscreen();
                }
            });


            //init user control pane
            $("#right-nav").show();
            $("#paneUser").html(AppConfig.userProfile.fullname || AppConfig.account);
            $('#iconList .userPic.small').attr('src', 'http://images.rnbtech.com.hk/' + AppConfig.userProfile.picture).attr('alt', AppConfig.userProfile.fullname || AppConfig.account);
            $('#btnAccountManage .userPic').attr('src', 'http://images.rnbtech.com.hk/' + AppConfig.userProfile.picture).attr('alt', AppConfig.userProfile.fullname || AppConfig.account);

            $("#btnOperatingRecord").eventOff('click').eventOn('click', function (e) {
                new OperatingRecord().show();
            }, 'navTool-operationRecord');

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

            $("#btnLogout").eventOff('click').eventOn('click', function (e) {
                PaneProjectSelector.logout();
            }, '注销');

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
                    }
                    localStorage.setItem('systemSkin_' + AppConfig.userId, this.value);
                    _this.setLogo();
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
            this.setLogo();
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
                    page: 'PointManagerRealTimeData',
                    projectId: AppConfig.projectId
                })
            }, 'navTool-point');

            $("#btnChangeProject").eventOff('click').eventOn('click', function (e) {
                ScreenManager.goTo({
                    page: 'PaneProjectSelector'
                })
            }, '切换项目');

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

            $("#divPages").eventOff().eventOn('click', 'li', function (e) {//给页面顶部nav添加点击后样式
                var $this = $(this);
                if ($this.hasClass('active')) {
                    return;
                }
                if ($this.find("ul").length == 0) {
                    $("#divPages li").removeClass("active");
                    $this.closest("li").addClass("active");
                }
            });
            var isShowInfoBox = false;
            var messageOptions = {
                pageSize: 3,
                pageNumber: 1
            };
            var nextPageData = [], currentIndex = messageOptions.pageSize;

            var getMessageLatest = function (pageSize, pageNumber) {
                return WebAPI.post('/message/api/v1/queryUserMessage', {
                    limit: pageSize || messageOptions.pageSize,
                    page: pageNumber || messageOptions.pageNumber,
                    type: "notRead",
                    tags: null
                });
            };
            var translateOp = function (text) {
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
                    default :
                        return text;
                }
            };
            var showNextMsg = function (msg) {
                var html = "", unreadClass = msg.isRead ? false : 'unread markAsRead';
                var senderUserInfo = msg.messageInfo && msg.messageInfo.sender && msg.messageInfo.sender.senderInfo || {
                        userpic: "",
                        userfullname: '',
                        useremail: '',
                        id: ''
                    };
                var baseLogo = 'static/images/logo_beop.png';
                html += '<li id="infoBoxMessage-' + msg.msgId + '" data-msg-id="' + msg._id + '">' +
                    '<div class="fl wdr1"><img class="userImg" src="' + (msg.messageInfo.task ? senderUserInfo.userpic : baseLogo ) + '"/></div>';
                if (msg.messageInfo.task) {
                    html += '<a class="messageLink" href="#page=workflow&type=transaction&transactionId=' + msg.messageInfo.task.id + '"><div class="fl wdr2 messageText">' +
                        '<span class="messageUserName mr5">' + senderUserInfo.userfullname + '</span>' +
                        '<span>' + translateOp(msg.messageInfo.task.op) + '</span>' +
                        '<div>' + msg.messageInfo.title + '</div></a>';
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
            var renderMessageBox = function () {
                var $infoBoxMessage = $('.infoBoxMessage');
                messageOptions.pageNumber = 1;
                getMessageLatest(messageOptions.pageSize, 1).done(function (result) {
                    if (result.success) {
                        var $badge = $('#messageAll .badge');
                        var data = result.data, messageHtml = '<ul>', unreadClass;
                        if (data.totalCount > 0) {
                            $badge.text(data.totalCount).show();
                        } else {
                            $badge.text(' ').hide();
                        }
                        nextPageData = data.message;
                        currentIndex = 0;
                        data.message.forEach(function (item) {
                            unreadClass = item.isRead ? false : 'unread markAsRead';
                            messageHtml += showNextMsg(item);
                        });
                        messageHtml += '</ul>';
                        if (data.totalCount >= messageOptions.pageSize) {
                            messageHtml += '<div id="messageShowAll" class="tc cp messageShowAll"><a href="#page=AllMessages"><span>' + i18n_resource.workflow.message.VIEW_ALL_NEWS + '</span><span>&gt;&gt;</span></a></div>';
                        }
                        if (isShowInfoBox) {
                            messageInfoBox(messageHtml, {
                                initCb: function () {
                                    I18n.fillArea($('.infoBoxMessage'));
                                    var $el = this.$el;
                                    var $markAsReadBtn = $el.find('.header-right'), $showMoreBtn = $el.find("#messageShowAll");
                                    if (!$el.find('.infoBox-msg ul li').length) {
                                        $el.find(".header-right").remove();
                                    }
                                    //markAllMessageAsRead
                                    this.$el.off('click.markAsAllRead').on('click.markAsAllRead', '.markAsAllRead', function () {
                                        Spinner.spin($el.get(0));

                                        WebAPI.post('/message/api/v1/markAllAsRead').done(function () {
                                            $el.find(".infoBox-msg ul li").remove();
                                            $markAsReadBtn.hide();
                                            $showMoreBtn.hide();
                                            $badge.text('').hide();
                                        }).always(function () {
                                            Spinner.stop();
                                        }).fail(function () {
                                            alert(I18n.resource.workflow.message.MARK_READ_FAILED);
                                        })
                                    });

                                    this.$el.off('click.markAsRead').on('click.markAsRead', '.markAsRead', function () {
                                        var $this = $(this), $parent = $this.closest('li'), msgId = $parent.data("msg-id");
                                        if (msgId) {
                                            Spinner.spin($parent.closest('ul').get(0));
                                            WebAPI.post('/message/api/v1/markAsRead', {msgIdList: [msgId]}).done(function () {
                                                Spinner.stop();
                                                renderMessageBox();
                                            })
                                        }
                                    });

                                    this.$el.on('click', '.messageLink', function () {
                                        var msgId = $(this).closest('li').data("msg-id");
                                        if (msgId) {
                                            WebAPI.post('/message/api/v1/markAsRead', {msgIdList: [msgId]});
                                        }
                                    })
                                }
                            });
                        }
                    }
                    $infoBoxMessage.remove();
                }).fail(function () {
                    alert(I18n.resource.workflow.message.READ_USER_UNREAD_MESSAGES_FAILED);
                });
            };
            renderMessageBox();
            $("#messageAll").off().click(function () { // 添加消息
                var $infoBoxMessage = $('.infoBoxMessage');
                if ($infoBoxMessage.is(":visible")) {
                    $infoBoxMessage.hide();
                    isShowInfoBox = false;
                } else {
                    isShowInfoBox = true;
                    renderMessageBox();
                }
            });

            $(document).eventOff('click.infoBoxMessage').eventOn("click.infoBoxMessage", function (e) { //点击页面其它地方，隐藏消息列表
                var $target = $(e.target);
                if (!($target.closest(".infoBoxMessage").length)) {
                    $(".infoBoxMessage").hide();
                    isShowInfoBox = false;
                }
            },'BeOP图标');
            //当头像的下拉框点开就隐藏消息列表
            $('#iconList').on('show.bs.dropdown', function () {
                $(".infoBoxMessage").hide();
            });
            $('#divPages>span').css('display', 'none');
            $('ulPages').css('left', '0');

            /*百度统计*/
            //var _hmt = _hmt || [];
            // _hmt.push(['_trackEvent', '切换项目', 'click', 'user-' + AppConfig.userId +'/project-'+(AppConfig.projectId?AppConfig.projectId:0)]);
            //document.getElementById('indexMain').style.height = (window.innerHeight - $('.navbar').get(0).offsetHeight) + 'px';
            //document.getElementById('indexMain').style.top =$('.navbar').get(0).offsetHeight + 'px';
            return this;
        },

        initProject: function (projectId, pageId) {
            if (!projectId) {
                alert.danger(I18n.resource.common.NOT_FIND_PREJECT_ID);
                return;
            }
            var project = BEOPUtil.getProjectById(projectId);
            var _this = this;
            return WebAPI.get("/get_plant_pagedetails/" + projectId + "/" + AppConfig.userId).done(function (result) {
                var result_obj = result;
                AppConfig.projectId = project.id;
                AppConfig.projectName = project.name_en;
                AppConfig.projectShowName = StringUtil.getI18nProjectName(project);
                AppConfig.projectBenchmark = result_obj.benchmark;
                AppConfig.navItems = result_obj.navItems;
                AppConfig.role_permission = result_obj.role_permission;

                // show project menu
                $('#liProjectMenu').show();
                if (!AppConfig.navItems.length && ScreenCurrent && ScreenCurrent.showMapView) {//单项目登录进入地图时,如果没有没有配置菜单,进入地图选择页面
                    if (configMap.isMapAvailable) {
                        _this.showMapView();
                    } else {
                        _this.showPanelView();
                    }
                }
                if (loginCode && loginCode.toLowerCase() == 'hzbt') {//华滋奔腾需要把项目名显示在左侧
                    $('#txtProjectTitle').text(AppConfig.projectShowName).removeAttr('i18n');
                    if (project.logo && project.logo != 'None') {
                        $('#navHomeLogo span').attr("style", "width: 78px; height: 32px;background-image: url(" + project.logo + ") !important;");
                    }
                } else {
                    $('#projectMenu').text(StringUtil.getI18nProjectName(project)).attr('title', StringUtil.getI18nProjectName(project)).show();
                }
                // show alarm menu, and start alarming
                BackgroundWorkers.alarmReporter.postMessage({type: 'dataAlarmRealtime', projectId: projectId});
                _this.initNavigationPane(result_obj.navItems);
                _this.initMenu(result_obj.observerPages, result_obj.groupInfo);
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

                $(window).off('resize.nav').on('resize.nav', (function () {
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
            }).fail(function (msg) {
                console.error(msg);
                alert.danger(I18n.resource.admin.projectSelector.PROJECT_OPEN_FAILED.format(StringUtil.getI18nProjectName(project)));
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

                /*if ($this.hasClass('active')) {
                 $this.find('.dropdown-submenu li.active').closest('.dropdown-submenu').find('a').addClass('showUl').end().find('ul').slideDown();
                 }*/
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

            function showSubDropDownEvent(e) {
                var $this = $(this), $ul = $(this).closest('.dropdown-submenu').children("ul");
                if ($this.hasClass('showUl')) {
                    $this.removeClass('showUl');
                    $ul.slideUp();
                } else {
                    $this.addClass('showUl');
                    $ul.slideDown();
                }
                e.stopPropagation();
            }

            $scrollPages.off('show.bs.dropdown', '.dropdown')
                .off('show.bs.dropdown', '.dropdown')
                .off('click.dropdown-submenu', '.dropdown-submenu>a');

            $scrollPages.on('show.bs.dropdown', '.dropdown', showDropDownEvent).on('hide.bs.dropdown', '.dropdown', hideDropDownEvent)
                .on('click.dropdown-submenu', '.dropdown-submenu>a', showSubDropDownEvent);
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
        setMenuActive: function () {
            var $targetLi = $("#ulPages").find('[pageId="' + ScreenManager.getPageId() + '"]');
            $("#ulPages").find('.active').removeClass('active');
            $targetLi.addClass('active').closest('li.dropdown').addClass('active');
            var $targetUl = $targetLi.closest('ul').addClass('active');
            if (!$targetUl.is('.dropdown-menu')) {
                $targetLi.closest('ul').closest('li').find('a').addClass('showUl');
                $targetLi.parents('li').addClass('active');
            }
        },
        initMenu: function (pages, groups) {
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
                    (function (page) {
                        $(aTag).eventOn('click', function (e) {
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
                    }
                    else {
                        liTag.appendChild(aTag);
                        ulTag.appendChild(liTag);
                    }
                }
                this.setMenuActive();
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
                    } else if ([namespace('observer.screens.PageScreen'),
                            namespace('observer.screens.FacReportScreen'),
                            namespace('observer.screens.FacReportWrapScreen')].indexOf(screen) > -1) {
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
                case 'ObserverScreen': {
                    ScreenManager.goTo({
                        page: 'ObserverScreen',
                        id: observerPages && observerPages[0] && observerPages[0].id
                    });
                    break;
                }
                case 'DropDownList': {
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
                case 'ReportScreen': {
                    ScreenManager.goTo({
                        page: 'ReportScreen',
                        reportId: pageId,
                        reportType: firstItem.reportType,
                        reportFolder: firstItem.reportFolder
                    });
                    break;
                }
                case 'EnergyScreen_M': {
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
            $aTag = $('<a><span class="glyphicon glyphicon-' + dropdownItem.pic + '"></span>' + dropdownItem.text + '</a>');
            if (dropdownItem.type !== 'DropDownList') {
                if (_this.menuScreenFactory(dropdownItem.type) === ReportScreen) {
                    $liTag.attr('permission', 'RReport');
                } else if (_this.menuScreenFactory(dropdownItem.type) === EnergyScreen) {
                    $liTag.attr('permission', 'RDashboard');
                }

                $aTag.off('click').on('click', function (e, data) {
                    var opt = {};
                    var ScreenClass = _this.menuScreenFactory(dropdownItem.type);
                    Spinner.spin(ElScreenContainer);
                    if (ScreenClass === ReportScreen) {
                        $liTag.attr('permission', 'RReport');
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
                            namespace('observer.screens.FacReportWrapScreen')].indexOf(ScreenClass) > -1) {
                        ScreenManager.show(ScreenClass, {
                            id: dropdownItem.id
                        }, 'indexMain');
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
                        <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>\
                        <%menuName%>\
                        <span class="caret"></span>\
                    </a>\
                    <ul id="ulObserverScreenList" class="dropdown-menu popover bottom"></ul>\
                </li>';
            var strLiDiagnosis = '<li>\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                     <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                     <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiAnalysis = '<li>\
                <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                    <span>\
                        <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                        <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                    </span>\
                    <%menuName%>\
                </a>\
            </li>';
            var strLiReport = '<li permission="RReport">\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>" report-type="<%reportType%>" report-folder="<%reportFolder%>">\
                        <span>\
                            <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                            <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiEnergy = '<li permission="RDashboard">\
                    <a class="nav-btn-a" pageId="<%menuId%>" page-type="<%pageType%>">\
                        <span>\
                          <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                          <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>\
                        <%menuName%>\
                    </a>\
                </li>';
            var strLiDropDownList = '<li class="dropdown">\
                    <a class="dropdown-toggle nav-btn-a" pageId="<%menuId%>" data-toggle="dropdown" aria-expanded="false">\
                        <span>\
                          <img class="nav-icon-svg" src="<%imgMenuPicSrc%>" onerror="this.style.display=\'none\'"/> \
                          <span class="glyphicon glyphicon-<%iconMenuPicDefault%>"></span>\
                        </span>\
                        <%menuName%>\
                        <span class="caret"></span>\
                    </a>\
                    <ul class="dropdown-menu scrollbar popover bottom" id="<%parentId%>"><div class="arrow"></div></ul>\
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
                defaultMenuPic: '/static/images/menu/Analysis-' + systemSkin + '.svg',
                PageScreen: '/static/images/menu/Energy-' + systemSkin + '.svg',
                FacReportScreen: '/static/images/menu/Energy-' + systemSkin + '.svg',
                FacReportWrapScreen: '/static/images/menu/Energy-' + systemSkin + '.svg',
                BenchmarkScreen: '/static/images/menu/Energy-' + systemSkin + '.svg'
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
                            liTag = liTag.replace('<%iconMenuPicDefault%>', navItemPic);
                            break;
                        case 'PageScreen':
                        case 'FacReportScreen':
                        case 'FacReportWrapScreen':
                        case 'DiagnosisScreen':
                        case 'BenchmarkScreen':
                            liTag = strLiDiagnosis;
                            liTag = liTag
                                .replace('<%iconMenuPicDefault%>', navItemPic);
                            break;
                        case 'AnalysisScreen':
                            liTag = strLiAnalysis;
                            liTag = liTag.replace('<%iconMenuPicDefault%>', navItemPic);
                            break;
                        case 'ReportScreen':
                            liTag = strLiReport;
                            liTag = liTag
                                .replace('<%reportType%>', navItems[i].reportType)
                                .replace('<%reportFolder%>', navItems[i].reportFolder)
                                .replace('<%iconMenuPicDefault%>', navItemPic);
                            AppConfig.menu[navItems[i].id] = navItems[i].text;
                            break;
                        case 'EnergyScreen':
                            liTag = strLiEnergy;
                            liTag = liTag.replace('<%iconMenuPicDefault%>', navItemPic);
                            AppConfig.menu[navItems[i].id] = navItems[i].text;
                            break;
                        case 'EnergyScreen_M':
                            if (AppConfig.role_permission.c_dashboard) {
                                liTag = strLiEnergy;
                                liTag = liTag.replace('<%iconMenuPicDefault%>', navItemPic);
                                AppConfig.menu[navItems[i].id] = navItems[i].text;
                            } else {
                                liTag = null;
                            }
                            break;
                        case 'DropDownList':
                            liTag = strLiDropDownList
                                .replace('<%parentId%>', 'DropDownList' + navItems[i].id)
                                .replace('<%iconMenuPicDefault%>', navItemPic);
                            break;
                        case 'WorkflowMine':
                            liTag = strLiReport;
                            liTag = liTag.replace('<%iconMenuPicDefault%>', navItemPic);
                            break;
                        default:
                            break;
                    }
                    if (liTag) {
                        var menuItem = '';
                        if (navItemPic) {
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
            this.setMenuActive();
            I18n.fillArea($ulPages);
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

            AppConfig.navItems = null;
        }
    };

    PaneProjectSelector.logout = function () {
        WebAPI.get('/logout/' + AppConfig.userId).done(function () {
            AppConfig = {};
            window.onhashchange = null;
            localStorage.removeItem("userInfo");
            try {
                if (loginCode) {
                    location.href = '/company/' + loginCode;
                    return;
                }
            } catch (e) {
            }
            location.href = '/';

        });
    };
    return PaneProjectSelector;
})();
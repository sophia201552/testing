/// <reference path="../lib/jquery-2.1.4.min.js" />

var ElScreenContainer = document.getElementById('indexMain'); //所有子模块的共用容器
var SpinnerContainer = document.getElementById('divSpinner'); //Spinner容器
var AlertContainer = document.getElementById('divAlert'); //Alert容器
var ScreenCurrent = undefined; //当前页面对象的引用
var ScreenPrevious = undefined; //前一页面对象的引用
var Spinner = new LoadingSpinner({ color: '#00FFFF' }); //等待加载时的转圈圈
//var navigation = responsiveNav("#navbar-collapse");          //响应式导航条
var AppConfig = {
    userId: undefined,
    account: undefined,
    isMobile: true,
    chartTheme: theme.Mobile
}; //基础配置文件
var ProjectConfig = {
    projectId: undefined,
    projectIndex: undefined,
    projectList: undefined,
    projectInfo: undefined,
    dashboardList: undefined,
    reportList: undefined,
    refreshTime: undefined,
    refreshInterval: 7200000
}; //报表配置文件
var I18n = undefined; //国际化对象的引用
var BomConfig = BomConfig || {};
var Push;
if (true) {
    $(document).ready(onReady)
} else {
    document.addEventListener('deviceready', onReady, false);
}

function onReady() {
    setAppConfig();
    attachEvent();
    setInitAction();
    InitI18nResource(AppConfig.language, true, 'static/views/js/i18n/').always(function(rs) {
        I18n = new Internationalization(null, rs);
        Init();
    });
}

function setAppConfig() {
    AppConfig.landscape = window.innerWidth > window.innerHeight; //是否横屏
    AppConfig.isLocalMode = false; //是否采用本地版

    if (navigator.userAgent.match(/iP(ad|hone|od)|Android/i)) AppConfig.isMobile = true; //是否移动端

    typeof device != 'undefined' ? AppConfig.device = device : {}; //设备插件

    //网络连接状态
    if (navigator.connection && typeof Connection != 'undefined') {
        AppConfig.isOnline = navigator.connection.type != Connection.NONE;
        AppConfig.network = navigator.connection.type
    } else {
        AppConfig.isOnline = true;
        AppConfig.network = 'PC'
    }

    //语言设置
    try {
        AppConfig.language = localStorage.getItem('language');
        if (!AppConfig.language) {
            AppConfig.language = navigator.language.split('-')[0];
        }
    } catch (e) {
        AppConfig.language = 'zh'
    }

    //host设置
    if (localStorage.getItem('beopHost')) {
        AppConfig.host = localStorage.getItem('beopHost')
    } else {
        AppConfig.host = 'http://beop.rnbtech.com.hk'
    }
    AppConfig.host = 'http://beop.rnbtech.com.hk';

    //版本信息设置
    AppConfig.version = '1.2.27';
    VersionManage = new UpdateHelper('dashboard', AppConfig.version, function() {});

    //推送设置
    setPushConfig();
}

function setInitAction() {
    navigator.splashscreen && navigator.splashscreen.hide(); //关闭加载页
    CssAdapter.adapter(); //初始化导航条高度
}


function attachEvent() {
    document.addEventListener("backbutton", router.back, false);
}

function setPushConfig() {
    Push = new PushWidget();
    Push.init();
    Push.onOpenNotification(function() {
        Push.resetServiceBadge();
        Push.resetLocalBadge();
        if (AppConfig.userId == null) return;
        var msg;
        try {
            msg = JSON.parse(Push.getPushInfo().openNote.extras.message)
        } catch (e) {
            msg = null;
        }
        if (!msg) return;
        if (!(msg instanceof Array)) {
            msg = [msg]
        }
        if (!msg[0]) return;
        if(msg[0].msgId)IndexScreen.prototype.updateMessageNumber([msg[0].msgId]);
        if (msg[0].type == 'workflow') {
            router.to({
                typeClass: WorkflowDetail,
                data: { id: msg[0].id }
            });
        } else if (msg[0].type == 'report') {
            if (msg[0].isFactory) {
                router.to({
                    typeClass: ProjectFactoryReport,
                    data: {
                        projectId: msg[0].projectId,
                        reportDetail: msg[0].reportDetail,
                        reportList: [],
                        reportId: msg[0].reportId,
                        reportDate: msg[0].reportDate ? msg[0].reportDate : null
                    }
                });
            } else {
                router.to({
                    typeClass: ProjectReport,
                    data: {
                        projectId: msg[0].projectId,
                        reportDetail: msg[0].reportDetail,
                        reportList: [],
                        reportId: msg[0].reportId,
                        reportDate: msg[0].reportDate ? msg[0].reportDate : null
                    }
                });
            }
        } else if (msg[0].type == 'dashboard') {
            if (!msg[0].projectId) {
                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.PUSH_PAGE_ERROR1, 'short', 'center');
                return;
            }
            var projectInfo;
            for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                if (msg[0].projectId == ProjectConfig.projectList[i].id) {
                    projectInfo = ProjectConfig.projectList[i];
                }
            }
            if (!projectInfo) {
                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.project.PUSH_PAGE_ERROR2, 'short', 'center');
                return;
            }
            router.to({
                typeClass: ProjectDashboard,
                data: {
                    menuId: msg[0].id,
                    name: msg[0].name,
                    projectInfo: projectInfo
                }
            });
        }
    });
    Push.onReceiveNotification(function() {
        Push.resetServiceBadge();
        Push.resetLocalBadge();
    });
    //Push.onSetAliasAndTags(function(result){
    //    if(result && result.alias) {
    //        console.log('set alias:' + result.alias)
    //    }
    //});
    Push.onReceiveMessage(function() {
        if (Push.getPushInfo().receiveMsg.message) {
            var msg = [],
                dashboard = [],
                report = [],
                workflow = [];
            var newWorkflow = [];
            IndexScreen.prototype.getNewMessageNumber();
            try {
                workflow = JSON.parse(localStorage.getItem('pushWk'));
                if (!(workflow instanceof Array)) {
                    workflow = []
                }
            } catch (e) {
                workflow = []
            }
            try {
                report = JSON.parse(localStorage.getItem('pushReport'));
                if (!(report instanceof Array)) {
                    report = []
                }
            } catch (e) {
                report = []
            }
            try {
                dashboard = JSON.parse(localStorage.getItem('pushDashboard'));
                if (!(dashboard instanceof Array)) {
                    dashboard = []
                }
            } catch (e) {
                dashboard = []
            }

            try {
                msg = JSON.parse(Push.getPushInfo().receiveMsg.message);
            } catch (e) {
                msg = [];
            }
            if (msg instanceof Array) {
                msg.forEach(function(item) {
                    if (item.type == 'report') {
                        report.push(item)
                    } else if (item.type == 'workflow') {
                        workflow.push(item)
                        newWorkflow.push(item)
                    } else if (item.type == 'dashboard') {
                        dashboard.push(item)
                    }
                });
            } else if (msg) {
                if (msg.type == 'report') {
                    report.push(msg)
                } else if (msg.type == 'workflow') {
                    workflow.push(msg)
                    newWorkflow.push(msg)
                } else if (msg.type == 'dashboard') {
                    dashboard.push(item)
                }
            }


            if (report instanceof Array && report.length > 0) {
                var reportForCurProject = [];
                var reportNotForCurProject = [];
                report.forEach(function(item) {
                    if (item.projectId == ProjectConfig.projectId) {
                        reportForCurProject.push(item)
                    } else {
                        reportNotForCurProject.push(item)
                    }
                });
                // if (ScreenCurrent instanceof ReportIndex) {
                //     localStorage.setItem('pushReport', JSON.stringify(reportNotForCurProject));
                //     ScreenCurrent.show();
                // } else {
                if (ProjectConfig.projectId != null) {
                    if (reportForCurProject.length > 0) {
                        $('#btnReport .pushTip').text((reportForCurProject.length > 99 ? '99+' : reportForCurProject.length)).show();
                    } else {
                        $('#btnReport .pushTip').text(0).hide();
                    }
                    localStorage.setItem('pushReport', JSON.stringify(report));
                }
                // }
            }
            if (workflow instanceof Array && workflow.length > 0) {
                if (ScreenCurrent instanceof WorkflowIndex) {
                    ScreenCurrent.show();
                } else if (ScreenCurrent instanceof WorkflowDetail && newWorkflow.filter(function(item) { return item.id == ScreenCurrent.wkId }).length > 0) {
                    ScreenCurrent.show();
                } else {
                    $('#btnWorkFlow .pushTip').text(workflow.length > 99 ? '99+' : workflow.length).show();
                    localStorage.setItem('pushWk', JSON.stringify(workflow));
                }
            }
            if (dashboard instanceof Array && dashboard.length > 0) {
                var pageForCurProject = [];
                var pageNotForCurProject = [];
                dashboard.forEach(function(item) {
                    if (item.projectId == ProjectConfig.projectId) {
                        pageForCurProject.push(item)
                    } else {
                        pageNotForCurProject.push(item)
                    }
                });
                // if (ScreenCurrent instanceof ReportIndex) {
                //     localStorage.setItem('pushReport', JSON.stringify(reportNotForCurProject));
                //     ScreenCurrent.show();
                // } else {
                if (ProjectConfig.projectId != null) {
                    if (pageForCurProject.length > 0) {
                        $('#btnProject .pushTip').text((pageForCurProject.length > 99 ? '99+' : pageForCurProject.length)).show();
                    } else {
                        $('#btnProject .pushTip').text(0).hide();
                    }
                    localStorage.setItem('pushReport', JSON.stringify(dashboard));
                }
                // }
            }
        }
    });
}

var IndexScreen = (function() {
    function IndexScreen() {}

    IndexScreen.prototype = {
        show: function() {
            // if (Push.opt.alias) Push.setAlias();
            var _this = this;
            CssAdapter.adapter({ top: false, bottom: false });
            if (localStorage.getItem('beopHost')) {
                AppConfig.host = localStorage.getItem('beopHost')
            } else {
                AppConfig.host = 'http://beop.rnbtech.com.hk'
            }
            //$(ElScreenContainer).addClass('homePage');
            //判断是否需要输入账号密码等
            if (localStorage.getItem('userInfo')) {
                _this.initNav();
                _this.login(true);
            } else {
                //TODO
                //如果需要登录，获取登录页面
                $.ajax({ url: 'static/app/dashboard/views/admin/login.html' }).done(function(resultHTML) {
                    $('#indexMain').html(resultHTML);
                    _this.init();
                });
            }
        },

        close: function() {
            //remove key down event in login page
            document.onkeydown = false;
        },

        init: function() {
            var _this = this;
            Push.setAlias();
            _this.initNav();
            _this.initLogin();
            _this.initLanguage();
        },

        initLogin: function() {
            this.restorePwd();
            this.initHost();
            var _this = this;

            //登录按键初始化
            $("#btnLogin").off('tap').on('tap', function(e) {
                _this.login();
            });
            $(document).on("keydown", "#divLogin input", function(event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) {
                    _this.login();
                }
            });

            var iptPwd = document.getElementById('password');
            $('#divUserPwd .addIcon').off('tap').on('tap', function(e) {
                if (e.currentTarget.classList.contains('showPwd')) {
                    iptPwd.setAttribute('type', 'password')
                } else {
                    iptPwd.setAttribute('type', 'text')
                }
                e.currentTarget.classList.toggle('showPwd')
            })
        },

        initLanguage: function() {
            I18n.fillArea($('#divAppDashboardLanguage'));
            I18n.fillArea($('#divLoginInfo'));
            $("#selectLanguage a").off('click').click(function(e) {
                //InitI18nResource(e.currentTarget.attributes.value.value, true);
                InitI18nResource(e.currentTarget.attributes.value.value, true,'static/views/js/i18n/').always(function(rs) {
                    AppConfig.language = e.currentTarget.attributes.value.value;
                    localStorage.setItem('language', AppConfig.language);
                    I18n = new Internationalization(null, rs);
                    Init();
                });
                e.preventDefault();
            });
        },

        //登录功能
        login: function(isRestorePwd) {
            var _this = this;
            var report = [],
                workflow = [],
                dashboard = [];
            var msg;
            //失败提醒
            SpinnerControl.show();
            var loginFail = function(msg) {
                $('.alert').remove();
                window.plugins && window.plugins.toast.show(msg, 'short', 'center');
                console.log(msg);
                Spinner.stop();
            };
            if (isRestorePwd) {
                var userName = JSON.parse(localStorage.userInfo).name,
                    password = JSON.parse(localStorage.userInfo).pwd;
            } else {
                var $btnLogin = $('#btnLogin');
                var userName = $("#userName").val(),
                    password = $("#password").val();
                if (!(userName && password)) {
                    loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_1);
                    return;
                }
            }

            WebAPI.post("/login/1", {
                name: userName,
                pwd: password,
                agent: jscd ? jscd : {}
            }).then(function(login_result) {
                try {
                    var after_login = function() {
                        if (login_result.status != undefined && login_result.status == true) {
                            if (AppConfig.device && AppConfig.device.platform) {
                                _hmt.push(['_trackEvent', 'mobile-login', 'login', AppConfig.device.platform]);
                            }
                            if (login_result.projects && login_result.projects.length > 0) {
                                //Push.restart();
                                Push.setAlias(login_result.id);
                                _this.rememberPwd(isRestorePwd);

                                AppConfig.userId = login_result.id;
                                AppConfig.account = $("#userName").val();
                                AppConfig.userProfile = login_result.userProfile;
                                AppConfig.userOfRole = login_result.userProfile.userOfRole;
                                AppConfig.permission = login_result.permission;
                                ProjectConfig.projectList = login_result.projects;
                                _this.previewProjectList();

                                _this.getNewMessageNumber();
                                if (localStorage.getItem('pushReport')) {
                                    try {
                                        report = JSON.parse(localStorage.getItem('pushReport'));
                                    } catch (e) {
                                        report = null;
                                    }
                                }
                                if (localStorage.getItem('pushWk')) {
                                    try {
                                        workflow = JSON.parse(localStorage.getItem('pushWk'));
                                    } catch (e) {
                                        workflow = null;
                                    }
                                }
                                if (localStorage.getItem('pushDashboard')) {
                                    try {
                                        dashboard = JSON.parse(localStorage.getItem('pushDashboard'));
                                    } catch (e) {
                                        dashboard = null;
                                    }
                                }
                                if (Push.getPushInfo().openNote.extras) {
                                    msg = Push.getPushInfo().openNote.extras;
                                } else {
                                    msg = Push.getPushInfo().receiveNote.extras;
                                }
                                if (msg && msg.message) {
                                    try {
                                        msg = JSON.parse(msg.message);
                                        if (!(msg instanceof Array)) {
                                            msg = [msg];
                                        }
                                    } catch (e) {
                                        msg = [];
                                    }
                                    msg.forEach(function(item) {
                                        if (item.type == 'workflow') {
                                            workflow.push(item)
                                        } else if (item.type == 'report') {
                                            report.push(item)
                                        } else if (item.type == 'dashboard') {
                                            dashboard.push(item)
                                        }
                                    })
                                    localStorage.setItem('pushReport', JSON.stringify(report));
                                    localStorage.setItem('pushWk', JSON.stringify(workflow));
                                    localStorage.setItem('pushDashboard', JSON.stringify(dashboard));
                                }
                                if (ProjectConfig.projectList instanceof Array && ProjectConfig.projectList.length > 0) {
                                    if (localStorage.getItem('defaultProjectId')) {
                                        for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                                            if (ProjectConfig.projectList[i].id == localStorage.getItem('defaultProjectId')) {
                                                ProjectConfig.projectId = ProjectConfig.projectList[i].id;
                                                AppConfig.projectId = ProjectConfig.projectId;
                                                ProjectConfig.projectInfo = ProjectConfig.projectList[i];
                                                ProjectConfig.projectIndex = i;
                                                break;
                                            }
                                        }
                                    }

                                    if (!ProjectConfig.projectId && ProjectConfig.projectList.length == 1) {
                                        ProjectConfig.projectId = ProjectConfig.projectList[0].id;
                                        AppConfig.projectId = ProjectConfig.projectId;
                                        ProjectConfig.projectInfo = ProjectConfig.projectList[0];
                                        ProjectConfig.projectIndex = 0;
                                    }
                                } else {
                                    ProjectConfig.projectId = null;
                                }
                                if (workflow instanceof Array && workflow.length > 0) {
                                    $('#btnWorkFlow .pushTip').text(workflow.length > 99 ? '99+' : workflow.length).show();
                                }
                                if (report instanceof Array && report.length > 0) {
                                    var reportForCurProject = report.filter(function(item) { return item.projectId == ProjectConfig.projectId })
                                    if (reportForCurProject.length > 0) {
                                        $('#btnReport .pushTip').text(reportForCurProject.length > 99 ? '99+' : reportForCurProject.length).show();
                                    } else {
                                        $('#btnReport .pushTip').text(0).hide();
                                    }
                                }
                                if (dashboard instanceof Array && dashboard.length > 0) {
                                    var pageForCurProject = dashboard.filter(function(item) { return item.projectId == ProjectConfig.projectId })
                                    if (pageForCurProject.length > 0) {
                                        $('#btnProject .pushTip').text(pageForCurProject.length > 99 ? '99+' : pageForCurProject.length).show();
                                    } else {
                                        $('#btnProject .pushTip').text(0).hide();
                                    }
                                }
                                if (msg instanceof Array && msg[0] && Push.getPushInfo().openNote.extras) {
                                    if(msg[0].msgId)_this.updateMessageNumber([msg[0].msgId]);
                                    if (msg[0].type == 'workflow') {
                                        router.empty().to({
                                            typeClass: WorkflowDetail,
                                            data: { id: msg[0].id }
                                        });
                                        return;
                                    } else if (msg[0].type == 'report') {
                                        if (msg[0].isFactory) {
                                            router.to({
                                                typeClass: ProjectFactoryReport,
                                                data: {
                                                    projectId: msg[0].projectId,
                                                    reportDetail: msg[0].reportDetail,
                                                    reportList: [],
                                                    reportId: msg[0].reportId,
                                                    reportDate: msg[0].reportDate ? msg[0].reportDate : null
                                                }
                                            });
                                        } else {
                                            router.to({
                                                typeClass: ProjectReport,
                                                data: {
                                                    projectId: msg[0].projectId,
                                                    reportDetail: msg[0].reportDetail,
                                                    reportList: [],
                                                    reportId: msg[0].reportId,
                                                    reportDate: msg[0].reportDate ? msg[0].reportDate : null
                                                }
                                            });
                                        }
                                        return;
                                    } else if (msg[0].type == 'dashboard') {
                                        if (!msg[0].projectId) {
                                            window.plugins.toast.show(I18n.resource.appDashboard.project.PUSH_PAGE_ERROR1, 'short', 'center');
                                            _this.initFirstPage()
                                            return;
                                        }
                                        var projectInfo;
                                        for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                                            if (msg[0].projectId == ProjectConfig.projectList[i].id) {
                                                projectInfo = ProjectConfig.projectList[i];
                                            }
                                        }
                                        if (!projectInfo) {
                                            window.plugins.toast.show(I18n.resource.appDashboard.project.PUSH_PAGE_ERROR2, 'short', 'center');
                                            _this.initFirstPage()
                                            return;
                                        }
                                        router.to({
                                            typeClass: ProjectDashboard,
                                            data: {
                                                menuId: msg[0].id,
                                                name: msg[0].name,
                                                projectInfo: projectInfo
                                            }
                                        });
                                        return;
                                    }
                                }
                                _this.initFirstPage()
                            } else {
                                loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_2);
                                if (isRestorePwd) {
                                    localStorage.removeItem('userInfo');
                                    //router.empty().to({
                                    //   typeClass:IndexScreen
                                    //});
                                }
                            }
                        } else {
                            loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_1);
                            if (isRestorePwd) {
                                localStorage.removeItem('userInfo');
                                //router.empty().to({
                                //   typeClass:IndexScreen
                                //});
                            }
                        }
                    }
                } catch (e) {
                    loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_3);
                    if (isRestorePwd) {
                        localStorage.removeItem('userInfo');
                        //router.empty().to({
                        //   typeClass:IndexScreen
                        //});
                    }
                    return false;
                }

                after_login();

            }).fail(function() {
                //infoBox.alert(i18n_resource.appDashboard.core.NET_INFO_1);
                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.core.NET_INFO_1, 'short', 'bottom');
                console.log(I18n.resource.appDashboard.core.NET_INFO_1);
                if ($('#btnLogin').length > 0) return;
                $.ajax({ url: 'static/app/dashboard/views/admin/login.html' }).done(function(resultHTML) {
                    $('#indexMain').html(resultHTML);
                    try {
                        $("#userName").val(JSON.parse(localStorage.userInfo).name);
                        $("#password").val(JSON.parse(localStorage.userInfo).pwd);
                    } catch (e) {

                    }
                    _this.init();
                });
            }).always(function() {
                SpinnerControl.hide();
            })
        },
        getNewMessageNumber:function(){
            //获取消息数量
            WebAPI.get('/appCommon/pushNotification/getNewMessageNum/' + AppConfig.userId).done(function(resultNumber){
                var messageNumbers = resultNumber.data;
                messageNumbers = messageNumbers>99?'99+':messageNumbers;
                AppConfig.newMessageNumber = messageNumbers;
                if(messageNumbers) {
                    $('.newMessageNum').addClass('active').html(messageNumbers);
                }
            });
        },
        updateMessageNumber:function(postData){
            var _this = this;
            if(!postData instanceof Array)return;
            WebAPI.post("/appCommon/pushNotification/updateMessage/"+AppConfig.userId + '/2',postData).done(function(result) {
                if (result.success) {
                    AppConfig.newMessageNumber && AppConfig.newMessageNumber--
                }
            }).always(function(){
                _this.getNewMessageNumber();
            })
        },
        rememberPwd: function(isRestorePwd) {
            //TODO: SHA1
            if (!isRestorePwd) {
                localStorage["userInfo"] = JSON.stringify({ name: $("#userName").val(), pwd: $("#password").val() });
            }
        },

        restorePwd: function() {
            if (localStorage["userInfo"]) {
                var data = JSON.parse(localStorage["userInfo"]);
                if (data.pwd && data.pwd != "") {
                    $("#userName").val(data.name);
                    $("#password").val(data.pwd);
                }
            }
        },
        initHost: function() {
            $('#ImgLogin img').on('doubleTap', function() {
                var divSetHost = $('#divHostSet');
                var $divHostShow = $('.divHostShow');
                $divHostShow.text(AppConfig.host);
                divSetHost.show();
                divSetHost.find('li').not(':last').on('tap', function(e) {
                    localStorage.setItem('beopHost', $(e.target).attr('value'));
                    AppConfig.host = $(e.target).attr('value');
                    $divHostShow.text($(e.target).attr('value'));
                });
                divSetHost.find('input').on('change', function(e) {
                    localStorage.setItem('beopHost', 'http://' + $(e.target).val());
                    AppConfig.host = 'http://' + $(e.target).val();
                    $divHostShow.text('http://' + $(e.target).val());
                })
            })
        },
        initNav: function() {
            // 后退按钮
            $('#btnBack').off('tap').on('tap', function(e) {
                var ifrm = document.getElementById('iframeSon');
                if (ifrm === null) {
                    router.back();
                } else {
                    var $ = ifrm.contentWindow.$;
                    var $sonBack = $(ifrm.contentWindow.document.querySelector(".back"));
                    var $project = $(ifrm.contentWindow.document.querySelector(".projectInfo"));
                    if ($project.length === 1) {
                        router.back();
                    } else {
                        $sonBack.trigger("tap");
                    }
                }
            });
            // 项目
            $('#btnProject').off('tap').on('tap', function(e) {
                if (ProjectConfig.projectId) {
                    router.to({
                        typeClass: ProjectSummary
                    });
                } else {
                    router.to({
                        typeClass: ProjectList
                    });
                }
                e.preventDefault();
            });

            // 报表
            $('#btnReport').off('tap').on('tap', function(e) {
                router.to({
                    typeClass: ReportIndex
                });
                e.preventDefault();
            });
            // 工单系统
            $('#btnWorkFlow').off('tap').on('tap', function(e) {
                router.to({
                    typeClass: WorkflowIndex
                });
                e.preventDefault();
            });
            //配置页面
            /*$('#btnAdminConfig').off('tap').on('tap', function(e) {
                router.to({
                    typeClass: AdminConfig
                });
                e.preventDefault();
            });*/
        },
        initFirstPage: function() {
            var $listReady = $.Deferred();
            var activeDashboard = false,
                activeReport = false;
            var module
            try {
                module = JSON.parse(localStorage.getItem('lastAppConfig')).module
            } catch (e) {
                module = null;
            }
            if (ProjectConfig.projectId) {
                this.setBottomNavStatus().done(function(page, report) {
                    activeDashboard = page.length > 0
                    activeReport = report.length > 0
                }).always(function() {
                    $listReady.resolve()
                });
            } else {
                $listReady.resolve()
            }
            $listReady.done(function() {
                if (ProjectConfig.projectId) {
                    localStorage.setItem('defaultProject', JSON.stringify(ProjectConfig.projectInfo));
                    localStorage.setItem('defaultProjectId', ProjectConfig.projectId);
                    switch (module) {
                        case 'project':
                            if (activeDashboard) {
                                router.empty().to({
                                    typeClass: ProjectSummary,
                                    data: {}
                                });
                            } else if (activeReport) {
                                router.empty().to({
                                    typeClass: ReportIndex,
                                    data: {}
                                });
                            } else {
                                router.empty().to({
                                    typeClass: WorkflowIndex,
                                    data: {}
                                });
                            }
                            break;
                        case 'report':
                            if (activeReport) {
                                router.empty().to({
                                    typeClass: ReportIndex,
                                    data: {}
                                });
                                break;
                            } else if (activeDashboard) {
                                router.empty().to({
                                    typeClass: ProjectSummary,
                                    data: {}
                                });
                            } else {
                                router.empty().to({
                                    typeClass: WorkflowIndex,
                                    data: {}
                                });
                            }
                        case 'workflow':
                            router.empty().to({
                                typeClass: WorkflowIndex,
                                data: {}
                            });
                            break;
                        default:
                            if (activeDashboard) {
                                router.empty().to({
                                    typeClass: ProjectSummary,
                                    data: {}
                                });
                            } else if (activeReport) {
                                router.empty().to({
                                    typeClass: ReportIndex,
                                    data: {}
                                });
                            } else {
                                router.empty().to({
                                    typeClass: WorkflowIndex,
                                    data: {}
                                });
                            }
                            break;
                    }
                } else {
                    switch (module) {
                        case 'workflow':
                            router.empty().to({
                                typeClass: WorkflowIndex,
                                data: {}
                            });
                            break;
                        default:
                            router.empty().to({
                                typeClass: ProjectList,
                                data: {}
                            });
                            break;
                    }
                }
            })
        },
        previewProjectList:function(){
            var list = [];
            if (AppConfig.permission && AppConfig.permission.DemoAccount){
                ProjectConfig.projectList.filter(function(item){
                    if (item.mobileSupported){
                        if(item.type){
                            item.name_en_init  = item.name_en;
                            item.name_en = I18n.resource.project_config.PAGE_NAME_ALT[item.type]
                            item.name_cn = I18n.resource.project_config.PAGE_NAME_ALT[item.type]
                            item.name_english = I18n.resource.project_config.PAGE_NAME_ALT[item.type]
                        }
                        list.push(item)
                    }
                })
            }else{
                ProjectConfig.projectList.filter(function(item){
                    if (item.mobileSupported){
                        list.push(item)
                    }
                })
            }
            AppConfig.projectList = ProjectConfig.projectList = list
        },
        setBottomNavStatus: function() {
            var pageList = []
            var reportList = []
            var $promise = $.Deferred();
            SpinnerControl.show()
            WebAPI.get("/get_plant_pagedetails/" + ProjectConfig.projectId + "/" + AppConfig.userId + "/" + AppConfig.language).done(function(resultData) {
                if (resultData.navItems && resultData.navItems.length > 0) {
                    pageList = resultData.navItems.filter(function(ele) {
                        return ele.type === "EnergyScreen_M"
                    });
                    ProjectConfig.dashboardList = pageList
                    reportList = resultData.navItems.filter(function(item) {
                        return item.type === 'FacReportWrapScreen' || item.type === 'ReportScreen';
                    });

                    if (pageList.length > 0) {
                        $('#btnProject').removeClass('hide')
                    } else {
                        $('#btnProject').addClass('hide')
                    }

                    if (reportList.length > 0) {
                        $('#btnReport').removeClass('hide')
                    } else {
                        $('#btnReport').addClass('hide')
                    }
                    // if (reportList.length == 0 && pageList.length == 0) {
                    //     NavConfig.bottom = false
                    //     $('navBottom').removeClass('active')
                    // } else {
                    //     NavConfig.bottom = true
                    //     $('navBottom').addClass('active')
                    // }
                    $promise.resolveWith(this, [pageList, reportList])
                } else {
                    ProjectConfig.dashboardList = []
                    $('#btnProject').addClass('hide')
                    $('#btnReport').addClass('hide')
                    $promise.reject()
                }
            }).fail(function() {
                ProjectConfig.dashboardList = []
                $('#btnProject').addClass('hide')
                $('#btnReport').addClass('hide')
                $promise.reject()
            }).always(function() {
                SpinnerControl.hide()
            })
            return $promise
        }
    };

    return IndexScreen;
})();

function Init() {
    //router.to({
    //    typeClass: IndexScreen,
    //    data: {}
    //});
    //I18n = new Internationalization();
    var projectInfo;
    try {
        projectInfo = JSON.parse(localStorage.getItem('defaultProject'));
    } catch (e) {
        projectInfo = null;
    }
    if (!(projectInfo && projectInfo.arrDp)) {
        ScreenManager.show(IndexScreen);
        I18n.fillArea($("#navBottom"));
        navigator.splashscreen && navigator.splashscreen.hide();
        return;
    } else {
        var pageNum = projectInfo.arrDp;
    }
    var advertise = document.createElement('div');
    advertise.className = 'advPage';
    advertise.innerHTML = '<span class="skipOver">跳过</span>';

    var advBar = document.createElement('div');
    advBar.className = 'advBar';
    if (pageNum > 1) {
        advertise.appendChild(advBar);
    }

    var img;
    for (var i = 0; i < pageNum; i++) {
        img = document.createElement('img');
        img.className = 'advImg';
        img.setAttribute('alt', '');
        img.src = 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/project_dp/' + projectInfo.name_en + '_' + (i + 1) + '.jpg';
        if (i == 0) {
            advBar.innerHTML += '<span class="advSpan cur"></span>'
        } else {
            advBar.innerHTML += '<span class="advSpan"></span>'
        }
        advertise.appendChild(img);
    }
    var $advImg = $(advertise).find('img');
    var loadDeferred = $.Deferred();
    var isLoad = 0,
        isEnd = 0;
    $advImg.load(function() {
        isLoad++;
        isEnd++;
        if (isLoad == $advImg.length && isEnd == $advImg.length) {
            loadDeferred.resolve();
        }
    });
    $advImg.error(function() {
        loadDeferred.reject();
    });
    loadDeferred.done(function() {
        $(document.body).append(advertise);
        navigator.splashscreen && navigator.splashscreen.hide();
        var len = $advImg.length;
        var $advSpan = $('.advSpan');
        var index = 0;
        var timer = setInterval(function() {
            tabImg();
        }, 3000);
        $('.skipOver').off('click').click(function() {
            skipPage();
        });
        $('.advPage').on('touchend', function(e) {
            e.preventDefault();
            tabImg();
        });

        function skipPage() {
            clearInterval(timer);
            ScreenManager.show(IndexScreen);
            $('.advPage').remove();
        }

        function tabImg() {
            if (index < len - 1) {
                index++;
                $advImg.css({
                    'transform': 'translateX(' + (-100 * index) + '%)',
                    'WebkitTransform': 'translateX(' + (-100 * index) + '%)'
                });
                $advSpan.removeClass('cur');
                $advSpan.eq(index).addClass(' cur');
            } else {
                skipPage();
            }
        }
        I18n.fillArea($("#navBottom"));
    }).fail(function() {
        navigator.splashscreen && navigator.splashscreen.hide();
        ScreenManager.show(IndexScreen);
        I18n.fillArea($("#navBottom"));
    })
}
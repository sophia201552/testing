/// <reference path="../lib/jquery-2.1.4.min.js" />

var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var SpinnerContainer = document.getElementById('divSpinner');  //Spinner容器
var AlertContainer = document.getElementById('divAlert');      //Alert容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenPrevious = undefined;                                //前一页面对象的引用
var Spinner = new LoadingSpinner({ color: '#00FFFF' });        //等待加载时的转圈圈
//var navigation = responsiveNav("#navbar-collapse");          //响应式导航条
var AppConfig = {
    userId: undefined,
    account: undefined,
    isMobile: true
}; //基础配置文件
var ProjectConfig = {
    projectId:undefined,
    projectIndex:undefined,
    projectList:undefined,
    projectInfo:undefined,
    dashboardList:undefined,
    summaryList:undefined,
    summaryDetail:undefined,
    summaryId:undefined,
    summaryIndex:undefined,
    reportList:undefined,
    refreshTime:undefined,
    refreshInterval:7200000
};//报表配置文件
var WkConfig = {
    defaultSize : 20,
    wkList : [],
    refreshTime:undefined,
    refreshInterval: 1800000
};//工单配置文件
var I18n = undefined;                                          //国际化对象的引用
var BomConfig = {
};
var router;
// 项目配置信息持久化存储管理
var appConfigManager = (function () {

    var DEFAULT_CONFIG = {
        // 默认 gps 为关闭状态
        gps: 0
        // ...
    };

    function get() {
        var options = window.localStorage.getItem('appConfig');

        if(options === null) {
            set(DEFAULT_CONFIG);
            return DEFAULT_CONFIG;
        }

        try { options = JSON.parse(options); } catch(e) {}

        return options;
    }

    function set(options) {
        window.localStorage.setItem( 'appConfig', JSON.stringify(options) );
    }

    return {
        get: get,
        set: set
    }

} ());

$(document).ready(function () {
    if (navigator.userAgent.match(/iP(ad|hone|od)|Android/i)) AppConfig.isMobile = true;

    InitI18nResource(navigator.language.split('-')[0]).always(function (rs) {
        I18n = new Internationalization(null, rs);
        Init();
    });
    router = new router();
});
document.addEventListener('deviceready',onDeviceReady,false);
function onDeviceReady() {
    AppConfig.device = device;
    document.addEventListener("backbutton", router.back, false)
}

var IndexScreen = (function () {
    function IndexScreen() {}

    IndexScreen.prototype = {
        show: function () {
            var _this = this;
            if(localStorage.getItem('beopHost')){
                AppConfig.host = localStorage.getItem('beopHost')
            }else {
                AppConfig.host = 'http://beop.rnbtech.com.hk'
            }
            //$(ElScreenContainer).addClass('homePage');
            //判断是否需要输入账号密码等
            if(localStorage.getItem('userInfo')){
                _this.initNav();
                _this.login(true);
            }else {
                //TODO
                //如果需要登录，获取登录页面
                $.ajax({url: 'static/app/dashboard/views/admin/login.html'}).done(function (resultHTML) {
                    $('#indexMain').html(resultHTML);
                    _this.init();
                });
            }
            if(!BomConfig.height) {
                BomConfig.height = $(window).height() + 'px';
            }
        },

        close: function () {
            //remove key down event in login page
            document.onkeydown = false;
        },

        init: function () {
            var _this = this;
            $(ElScreenContainer).css({
                'height':'100%',
                'top':0
            });
            CssAdapter.adapter();
            _this.initNav();
            _this.initLogin();
            _this.initLanguage();
        },

        initLogin: function () {
            this.restorePwd();
            this.initHost();
            var _this = this;

            //登录按键初始化
            $("#btnLogin").off('tap').on('tap',function (e) {
                _this.login();
            });
            $(document).on("keydown","#divLogin input",function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) {
                    _this.login();
                }
            });
        },

        initLanguage: function () {
            I18n.fillArea($('#divAppDashboardLanguage'));
            I18n.fillArea($('#divLoginInfo'));
            $("#selectLanguage a").off('click').click(function (e) {
                //InitI18nResource(e.currentTarget.attributes.value.value, true);
                InitI18nResource(e.currentTarget.attributes.value.value, true).always(function (rs) {
                    I18n = new Internationalization(null, rs);
                    Init();
                });
                e.preventDefault();
            });
        },

        //登录功能
        login: function (isRestorePwd) {
            var _this = this;
            //失败提醒
            SpinnerControl.show();
            var loginFail = function (msg) {
                $('.alert').remove();
                new Alert($("#divAlert"), "danger", msg).show().close();
                Spinner.stop();
            };
            if(isRestorePwd){
                var userName = JSON.parse(localStorage.userInfo).name, password = JSON.parse(localStorage.userInfo).pwd;
            }else {
                var $btnLogin = $('#btnLogin');
                var userName = $("#userName").val(), password = $("#password").val();
                if (!(userName && password)) {
                    loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_1);
                    return;
                }
            }

            WebAPI.post("/login", {
                name: userName,
                pwd: password,
                agent: jscd ? jscd : {}
            }).then(function (login_result) {
                try {
                    var after_login = function () {
                        CssAdapter.adapter();
                        if (login_result.status != undefined && login_result.status == true) {
                            if(AppConfig.device && AppConfig.device.platform) {
                                _hmt.push(['_trackEvent', 'mobile-login', 'login', AppConfig.device.platform]);
                            }
                            if (login_result.projects && login_result.projects.length > 0) {
                                _this.rememberPwd(isRestorePwd);
                                AppConfig.userId = login_result.id;
                                AppConfig.account = $("#userName").val();
                                AppConfig.userProfile = login_result.userProfile;
                                AppConfig.userOfRole = login_result.userProfile.userOfRole;
                                ProjectConfig.projectList = login_result.projects;
                                if (!localStorage.getItem('defaultProjectId')){
                                    switch (localStorage.getItem('module')) {
                                        case 'project':
                                            router.empty().to({
                                                    typeClass: ProjectList,
                                                    data: {}
                                            });
                                            break;
                                        case 'message':
                                            router.empty().to({
                                                    typeClass: MessageIndex,
                                                    data: {}
                                            });
                                            break;
                                        case 'workflow':
                                            router.empty().to({
                                                    typeClass: WorkflowList,
                                                    data: {}
                                            });
                                            break;
                                        default :
                                            router.empty().to({
                                                    typeClass: ProjectList,
                                                    data: {}
                                            });
                                            break;
                                    }
                                }else{
                                    for(var i = 0;i < ProjectConfig.projectList.length;i++){
                                        if(ProjectConfig.projectList[i].id == localStorage.getItem('defaultProjectId')){
                                            ProjectConfig.projectId = ProjectConfig.projectList[i].id;
                                            ProjectConfig.projectInfo = ProjectConfig.projectList[i];
                                            ProjectConfig.projectIndex = i;
                                            switch (localStorage.getItem('module')) {
                                                case 'project':
                                                    router.empty().to({
                                                            typeClass: ProjectSummary,
                                                            data: {}
                                                    });
                                                    break;
                                                case 'message':
                                                    router.empty().to({
                                                            typeClass: MessageIndex,
                                                            data: {}
                                                    });
                                                    break;
                                                case 'workflow':
                                                    router.empty().to({
                                                            typeClass: WorkflowList,
                                                            data: {}
                                                    });
                                                    break;
                                                default :
                                                    router.empty().to({
                                                            typeClass: ProjectSummary,
                                                            data: {}
                                                    });
                                                    break;
                                            }
                                            break;
                                        }
                                    }
                                }
                            } else {
                                loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_2);
                                if(isRestorePwd){
                                    localStorage.removeItem('userInfo');
                                    router.empty().to({
                                       typeClass:IndexScreen
                                    });
                                }
                            }
                        } else {
                            loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_1);
                            if(isRestorePwd){
                                localStorage.removeItem('userInfo');
                                router.empty().to({
                                   typeClass:IndexScreen
                                });
                            }
                        }
                    }
                } catch (e) {
                    loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_3);
                    if(isRestorePwd){
                        localStorage.removeItem('userInfo');
                        router.empty().to({
                           typeClass:IndexScreen
                        });
                    }
                    return false;
                }
                
                after_login();

            }).fail(function(){
                new Alert($("#divAlert"), "danger", '网络连接不可用，请检查！').show().close();
            }).always(function () {
                SpinnerControl.hide();
            })
        },

        rememberPwd: function (isRestorePwd) {
            //TODO: SHA1
            if(!isRestorePwd) {
                localStorage["userInfo"] = JSON.stringify({name: $("#userName").val(), pwd: $("#password").val()});
            }
        },

        restorePwd: function () {
            if (localStorage["userInfo"]) {
                var data = JSON.parse(localStorage["userInfo"]);
                if (data.pwd && data.pwd != "") {
                    $("#userName").val(data.name);
                    $("#password").val(data.pwd);
                }
            }
        },
        initHost:function(){
            $('#ImgLogin img').on('doubleTap',function(){
                var divSetHost = $('#divHostSet');
                var $divHostShow = $('.divHostShow');
                $divHostShow.text(AppConfig.host);
                divSetHost.show();
                divSetHost.find('li').not(':last').on('tap',function(e){
                    localStorage.setItem('beopHost',$(e.target).attr('value'));
                    AppConfig.host = $(e.target).attr('value');
                    $divHostShow.text($(e.target).attr('value'));
                });
                divSetHost.find('input').on('change',function(e){
                    localStorage.setItem('beopHost','http://' + $(e.target).val());
                    AppConfig.host = 'http://' + $(e.target).val();
                    $divHostShow.text('http://' + $(e.target).val());
                })
            })
        },
        initNav: function () {
            // 后退按钮
            $('#btnBack').off('tap').on('tap', function (e) {
                router.back();
            });
            // 项目
            $('#btnProject').off('tap').on('tap', function(e) {
                if (ProjectConfig.projectId) {
                    router.to({
                        typeClass: ProjectSummary
                    });
                }else{
                    router.to({
                        typeClass: ProjectList
                    });
                }
                e.preventDefault();
            });

            // 消息中心
            $('#btnMessage').off('tap').on('tap', function(e) {
                router.to({
                    typeClass: MessageIndex
                });
                e.preventDefault();
            });
            // 工单系统
            $('#btnWorkFlow').off('tap').on('tap', function(e) {
                router.to({
                    typeClass: WorkflowList
                });
                e.preventDefault();
            });
            //配置页面
            $('#btnAdminConfig').off('tap').on('tap', function(e) {
                router.to({
                    typeClass: AdminConfig
                });
                e.preventDefault();
            });
        }
    };

    return IndexScreen;
})();
//load language
//function InitI18nResource(strLanguage, isForce) {
//    if (strLanguage == '') return;
//    if (isForce) {
//        localStorage["isUserSelectedLanguage"] = strLanguage;
//    }
//    else if (localStorage["isUserSelectedLanguage"]) {
//        strLanguage = localStorage["isUserSelectedLanguage"];
//    }
//
//    $.getScript("static/views/js/i18n/" + strLanguage + ".js")
//        .done(function (e) {
//            localStorage["language"] = strLanguage;
//            localStorage["i18n"] = JSON.stringify(i18n_resource);
//            Init();
//        })
//        .error(function (e) {
//            if (!localStorage["i18n"]) {
//                $.getScript("static/views/js/i18n/zh.js").done(function (e) {
//                    localStorage["language"] = "zh";
//                    localStorage["i18n"] = JSON.stringify(i18n_resource);
//                    Init();
//                })
//            }
//        });
//}
function Init(){
    //router.to({
    //    typeClass: IndexScreen,
    //    data: {}
    //});
    //I18n = new Internationalization();

    ScreenManager.show(IndexScreen);
    I18n.fillArea($("#navBottom"));
}

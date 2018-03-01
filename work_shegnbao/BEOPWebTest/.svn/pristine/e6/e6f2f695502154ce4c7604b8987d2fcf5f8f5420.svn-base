/// <reference path="../lib/jquery-1.11.1.min.js" />

var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
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
    reportList:undefined,
    reportDetail:undefined,
    reportId:undefined,
    reportIndex:undefined,
    refreshTime:undefined,
    refreshInterval:7200000
};//报表配置文件
var WkConfig = {
    defaultSize : 13,
    wkList : {
        working:[],
        created:[],
        finished:[],
        joined:[]
    },
    refreshTime:undefined,
    refreshInterval: 1800000
};//工单配置文件
var I18n = undefined;                                          //国际化对象的引用

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
    InitI18nResource(navigator.language.split('-')[0]);
});


var IndexScreen = (function () {
    function IndexScreen() {}

    IndexScreen.prototype = {
        show: function () {
            var _this = this;
            //判断是否需要输入账号密码等
            //TODO
            //如果需要登录，获取登录页面
            $.ajax({url:'static/app/dashboard/views/admin/login.html'}).done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        },

        close: function () {
            //remove key down event in login page
            document.onkeydown = false;
        },

        init: function () {
            var _this = this;
            _this.initNav();
            _this.initLogin();
        },

        initLogin: function () {
            this.restorePwd();

            var _this = this;

            //登录按键初始化
            $("#btnLogin").hammer().off('tap').on('tap',function (e) {
                _this.login();
            });
            $(document).on("keydown","#divLogin input",function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) {
                    _this.login();
                }
            });
        },

        //登录功能
        login: function () {
            var _this = this;
            var $btnLogin = $('#btnLogin');
            Spinner.spin(ElScreenContainer);

            var userName = $("#userName").val(), password = $("#password").val();
            //失败提醒
            var loginFail = function (msg) {
                $('.alert').remove();
                new Alert($("#divAlert"), "danger", msg).show().close();
                Spinner.stop();
            };

            if (!(userName && password)) {
                loginFail('用户名或密码错误！');
                return;
            }

            WebAPI.post("/login", {
                name: userName,
                pwd: password,
                agent: jscd ? jscd : {}
            }).then(function (_login_result) {
                try {
                    var login_result = JSON.parse(_login_result);

                    var after_login = function () {
                        if (login_result.status != undefined && login_result.status == true) {
                            if (login_result.projects && login_result.projects.length > 0) {
                                _this.rememberPwd();
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
                                loginFail("登录失败，没有任何项目的权限！");
                            }
                        } else {
                            loginFail("用户名或密码错误！");
                        }
                    }
                } catch (e) {
                    loginFail("登录失败！");
                    return false;
                }
                
                after_login();

            }).always(function () {
                Spinner.stop();
            })
        },

        rememberPwd: function () {
            //TODO: SHA1
            localStorage["userInfo"] = JSON.stringify({ name: $("#userName").val(), pwd: $("#password").val() });
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

        initNav: function () {
            // 后退按钮
            $('.btn-back', '#navTop').hammer().off('tap').on('tap', function (e) {
                router.back();
            });
            // 项目
            $('#btnProject').hammer().off('tap').on('tap', function(e) {
                router.to({
                    typeClass: ProjectSummary
                });
                e.preventDefault();
            });

            // 消息中心
            $('#btnMessage').hammer().off('tap').on('tap', function(e) {
                router.to({
                    typeClass: MessageIndex
                });
                e.preventDefault();
            });
            // 工单系统
            $('#btnWorkFlow').hammer().off('tap').on('tap', function(e) {
                router.to({
                    typeClass: WorkflowList
                });
                e.preventDefault();
            });
            //配置页面
            $('#btnAdminConfig').hammer().off('tap').on('tap', function(e) {
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
function InitI18nResource(strLanguage, isForce) {
    if (strLanguage == '') return;
    if (isForce) {
        localStorage["isUserSelectedLanguage"] = strLanguage;
    }
    else if (localStorage["isUserSelectedLanguage"]) {
        strLanguage = localStorage["isUserSelectedLanguage"];
    }

    $.getScript("/static/views/js/i18n/" + strLanguage + ".js")
        .done(function (e) {
            localStorage["language"] = strLanguage;
            localStorage["i18n"] = JSON.stringify(i18n_resource);
            Init();
        })
        .error(function (e) {
            if (!localStorage["i18n"]) {
                $.getScript("/static/views/js/i18n/en.js").done(function (e) {
                    localStorage["language"] = "en";
                    localStorage["i18n"] = JSON.stringify(i18n_resource);
                    Init();
                })
            }
        });
}
function Init(){
    router.to({
        typeClass: IndexScreen,
        data: {}
    });
    I18n = new Internationalization();
}

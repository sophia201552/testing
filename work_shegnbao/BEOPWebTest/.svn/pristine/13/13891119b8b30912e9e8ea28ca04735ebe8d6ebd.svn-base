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
    isMobile: true,
    chartTheme: theme.Burgeen
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
var Push;
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
    AppConfig.language = localStorage.getItem('language');
    if (!AppConfig.language || (AppConfig.language != 'zh' && AppConfig.language != 'en'))AppConfig.language = navigator.language.split('-')[0];
    if (!AppConfig.language || (AppConfig.language != 'zh' && AppConfig.language != 'en'))AppConfig.language = 'zh';
    AppConfig.version = '1.2.2';
    VersionManage = new UpdateHelper('dashboard',AppConfig.version,function(){
        InitI18nResource(AppConfig.language,true).always(function (rs) {
            Push = new PushWidget();
            I18n = new Internationalization(null, rs);
            Init();
        });
    });
});

document.addEventListener('deviceready',onDeviceReady,false);

function onDeviceReady() {
    if (navigator.userAgent.match(/iP(ad|hone|od)|Android/i)) AppConfig.isMobile = true;
    AppConfig.device = device;
    document.addEventListener("backbutton", router.back, false);
    AppConfig.language = localStorage.getItem('language');
    AppConfig.host = 'http://beop.rnbtech.com.hk';
    if (!AppConfig.language || (AppConfig.language != 'zh' && AppConfig.language != 'en'))AppConfig.language = navigator.language.split('-')[0];
    if (!AppConfig.language || (AppConfig.language != 'zh' && AppConfig.language != 'en'))AppConfig.language = 'zh';
    AppConfig.version = '1.2.2';
    VersionManage = new UpdateHelper('dashboard',AppConfig.version,function(){
        InitI18nResource(AppConfig.language, true).always(function (rs) {
            I18n = new Internationalization(null, rs);
            Init();
        });
    });
    Push = new PushWidget();
    Push.init();
    Push.onOpenNotification(function(){
        Push.resetServiceBadge();
        Push.resetLocalBadge();
    });
    Push.onReceiveNotification(function(){
        Push.resetServiceBadge();
        Push.resetLocalBadge();
    });
    Push.onSetAliasAndTags(function(result){
        if(result && result.alias) {
            console.log('set alias:' + result.alias)
        }
    });
    Push.onReceiveMessage(function(){
        if (Push.getPushInfo().receiveMsg.message){
            var msg,report = [],workflow = [];
            try{
                workflow = JSON.parse(localStorage.getItem('pushWk'));
                if(! (workflow instanceof Array)){
                    workflow = []
                }
            }catch(e){
                workflow = []
            }
            try {
                msg = JSON.parse(Push.getPushInfo().receiveMsg.message);
                msg.forEach(function(item){
                    if(item.type == 'message'){
                        report.push(item)
                    }else if(item.type == 'workflow'){
                        workflow.push(item)
                    }
                });
            }catch(e){
                report = [];
                workflow = [];
            }
            if(report instanceof Array && report.length > 0){
                $('#btnMessage .messageNum').text(report.length).show();
                localStorage.setItem('pushMsg',JSON.stringify(report));
                if (ScreenCurrent instanceof MessageIndex){
                    ScreenCurrent.initMessagePush(report);
                }else if(ScreenCurrent instanceof MessagePush){
                    ScreenCurrent.messageDate = report;
                    ScreenCurrent.show()
                }
            }
            if(workflow instanceof Array && workflow.length > 0) {
                if (ScreenCurrent instanceof WorkflowList) {
                    ScreenCurrent.show();
                }else{
                    $('#btnWorkFlow .messageNum').text(workflow.length).show();
                    localStorage.setItem('pushWk', JSON.stringify(workflow));
                }
            }
        }
    });
}

var IndexScreen = (function () {
    function IndexScreen() {}

    IndexScreen.prototype = {
        show: function () {
            Push.setAlias();
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
                    AppConfig.language = e.currentTarget.attributes.value.value;
                    localStorage.setItem('language',AppConfig.language);
                    I18n = new Internationalization(null, rs);
                    Init();
                });
                e.preventDefault();
            });
        },

        //登录功能
        login: function (isRestorePwd) {
            var _this = this;
            var msg;
            var pushInfo;
            //失败提醒
            SpinnerControl.show();
            var loginFail = function (msg) {
                $('.alert').remove();
                window.plugins && window.plugins.toast.show(msg, 'short', 'center');
                console.log(msg);
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

            WebAPI.post("/login/1", {
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
                                //Push.restart();
                                Push.setAlias(login_result.id);
                                _this.rememberPwd(isRestorePwd);
                                AppConfig.userId = login_result.id;
                                AppConfig.account = $("#userName").val();
                                AppConfig.userProfile = login_result.userProfile;
                                AppConfig.userOfRole = login_result.userProfile.userOfRole;
                                ProjectConfig.projectList = login_result.projects;

                                if(localStorage.getItem('pushMsg')){
                                    try {
                                        msg = JSON.parse(localStorage.getItem('pushMsg'));
                                        msg = msg.filter(function(item){
                                            return item.type=='message'
                                        });
                                    }catch(e){
                                        msg = null;
                                    }
                                    if(msg instanceof Array && msg.length > 0) {
                                        $('#btnMessage .messageNum').text(msg.length).show();
                                    }
                                }
                                var msgWk;
                                if(localStorage.getItem('pushWk')){
                                    try {
                                        msgWk = JSON.parse(localStorage.getItem('pushWk'));
                                    }catch(e){
                                        msgWk = null;
                                    }
                                    if(msgWk instanceof Array && msgWk.length > 0) {
                                        $('#btnWorkFlow .messageNum').text(msgWk.length).show();
                                    }
                                }
                                if (!localStorage.getItem('defaultProjectId')){
                                    pushInfo = Push.getPushInfo().openNote.extras;
                                    if (pushInfo && pushInfo.message){
                                        try {
                                            msg = JSON.parse(pushInfo.message);
                                            msg = msg.filter(function(item){
                                                return item.type=='message'
                                            });
                                        }catch(e){
                                            msg = null;
                                        }
                                        if(msg instanceof Array && msg.length > 0){
                                            localStorage.setItem('pushMsg',pushInfo.message);
                                            router.empty().to({
                                                    typeClass: MessagePush,
                                                    data: msg
                                            });
                                            return;
                                        }
                                        try {
                                            msg = JSON.parse(pushInfo.message);
                                            msg = msg.filter(function(item){
                                                return item.type=='workflow'
                                            });
                                        }catch(e){
                                            msg = null;
                                        }
                                        if(msg instanceof Array && msg.length > 0){
                                            router.to({
                                                    typeClass: WorkflowDetail,
                                                    data: {id:msg[0].id}
                                            });
                                            return;
                                        }
                                    }

                                    switch (localStorage.getItem('module')) {
                                        case 'project':
                                            router.empty().to({
                                                    typeClass: ProjectList,
                                                    data: {}
                                            });
                                            break;
                                        case 'report':
                                            router.empty().to({
                                                    typeClass: ReportIndex,
                                                    data: {}
                                            });
                                            break;
                                        case 'workflow':
                                            router.empty().to({
                                                    typeClass: WorkflowIndex,
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
                                    var hasDefault = false;
                                    for(var i = 0;i < ProjectConfig.projectList.length;i++) {
                                        if (ProjectConfig.projectList[i].id == localStorage.getItem('defaultProjectId')) {
                                            hasDefault = true;
                                            ProjectConfig.projectId = ProjectConfig.projectList[i].id;
                                            AppConfig.projectId = ProjectConfig.projectId;
                                            ProjectConfig.projectInfo = ProjectConfig.projectList[i];
                                            ProjectConfig.projectIndex = i;
                                            break;
                                        }
                                    }
                                    if(!hasDefault && ProjectConfig.projectList[0]){
                                        ProjectConfig.projectId = ProjectConfig.projectList[0].id;
                                        AppConfig.projectId = ProjectConfig.projectId;
                                        ProjectConfig.projectInfo = ProjectConfig.projectList[0];
                                        ProjectConfig.projectIndex = 0;
                                    }
                                    pushInfo = Push.getPushInfo().openNote.extras;
                                    if (pushInfo && pushInfo.message){
                                        try {
                                            msg = JSON.parse(pushInfo.message);
                                            msg = msg.filter(function(item){
                                                return item.type=='message'
                                            });
                                        }catch(e){
                                            msg = null;
                                        }
                                        if(msg instanceof Array && msg.length > 0){
                                            localStorage.setItem('pushMsg',pushInfo.message);
                                            router.empty().to({
                                                    typeClass: MessagePush,
                                                    data: msg
                                            });
                                            return;
                                        }
                                        try {
                                            msg = JSON.parse(pushInfo.message);
                                            msg = msg.filter(function(item){
                                                return item.type=='workflow'
                                            });
                                        }catch(e){
                                            msg = null;
                                        }
                                        if(msg instanceof Array && msg.length > 0){
                                            router.to({
                                                    typeClass: WorkflowDetail,
                                                    data: {id:msg[0].id}
                                            });
                                            return;
                                        }
                                    }
                                    switch (localStorage.getItem('module')) {
                                        case 'project':
                                            router.empty().to({
                                                    typeClass: ProjectSummary,
                                                    data: {}
                                            });
                                            break;
                                        case 'report':
                                            router.empty().to({
                                                    typeClass: ReportIndex,
                                                    data: {}
                                            });
                                            break;
                                        case 'workflow':
                                            router.empty().to({
                                                    typeClass: WorkflowIndex,
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
                                }
                            } else {
                                loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_2);
                                if(isRestorePwd){
                                    localStorage.removeItem('userInfo');
                                    //router.empty().to({
                                    //   typeClass:IndexScreen
                                    //});
                                }
                            }
                        } else {
                            loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_1);
                            if(isRestorePwd){
                                localStorage.removeItem('userInfo');
                                //router.empty().to({
                                //   typeClass:IndexScreen
                                //});
                            }
                        }
                    }
                } catch (e) {
                    loginFail(I18n.resource.appDashboard.core.LOGIN_ERR_3);
                    if(isRestorePwd){
                        localStorage.removeItem('userInfo');
                        //router.empty().to({
                        //   typeClass:IndexScreen
                        //});
                    }
                    return false;
                }

                after_login();

            }).fail(function(){
                //infoBox.alert(i18n_resource.appDashboard.core.NET_INFO_1);
                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.core.NET_INFO_1, 'short', 'bottom');
                console.log(I18n.resource.appDashboard.core.NET_INFO_1);
                if($('#btnLogin').length > 0)return;
                $.ajax({url: 'static/app/dashboard/views/admin/login.html'}).done(function (resultHTML) {
                    $('#indexMain').html(resultHTML);
                    try {
                        $("#userName").val(JSON.parse(localStorage.userInfo).name);
                        $("#password").val(JSON.parse(localStorage.userInfo).pwd);
                    }catch(e){

                    }
                    _this.init();
                });
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
                var ifrm = document.getElementById('iframeSon');
                if(ifrm === null){
                    router.back();  
                }else{
                    var $ = ifrm.contentWindow.$;
                    var $sonBack = $(ifrm.contentWindow.document.querySelector(".back"));
                    var $project = $(ifrm.contentWindow.document.querySelector(".projectInfo"));
                    if($project.length === 1){
                        router.back(); 
                    }else{
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
                }else{
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
        }
    };

    return IndexScreen;
})();
function Init(){
    //router.to({
    //    typeClass: IndexScreen,
    //    data: {}
    //});
    //I18n = new Internationalization();

    var projectInfo = JSON.parse(localStorage.getItem('defaultProject'));
    if(!(projectInfo && projectInfo.arrDp)){
        ScreenManager.show(IndexScreen);
        I18n.fillArea($("#navBottom"));
        navigator.splashscreen && navigator.splashscreen.hide();
        return;
    }else{
        var pageNum=projectInfo.arrDp;
    }
    var advertise = document.createElement('div');
    advertise.className = 'advPage';
    advertise.innerHTML = '<span class="skipOver">跳过</span>';

    var advBar = document.createElement('div');
    advBar.className = 'advBar';
    if(pageNum > 1) {
        advertise.appendChild(advBar);
    }

    var img;
    for (var i = 0; i < pageNum; i++) {
        img = document.createElement('img');
        img.className = 'advImg';
        img.setAttribute('alt','');
        img.src = 'http://images.rnbtech.com.hk/static/images/project_dp/' + projectInfo.name_en +'_' + (i+1) +'.jpg';
        if (i == 0) {
            advBar.innerHTML += '<span class="advSpan cur"></span>'
        } else {
            advBar.innerHTML += '<span class="advSpan"></span>'
        }
        advertise.appendChild(img);
    }
    var $advImg=$(advertise).find('img');
    var loadDeferred = $.Deferred();
    var isLoad = 0,isEnd = 0;
    $advImg.load(function(){
        isLoad++;
        isEnd++;
        if(isLoad == $advImg.length && isEnd == $advImg.length){
            loadDeferred.resolve();
        }
    });
    $advImg.error(function(){
        loadDeferred.reject();
    });
    loadDeferred.done(function(){
        $(document.body).append(advertise);
        navigator.splashscreen && navigator.splashscreen.hide();
        var len=$advImg.length;
        var $advSpan=$('.advSpan');
        var index=0;
        var timer=setInterval(function(){
                tabImg();
        },3000);
        $('.skipOver').off('click').click(function(){
            skipPage();
        });
        $('.advPage').on('touchend',function(e){
            e.preventDefault();
            tabImg();
        });
        function skipPage(){
            clearInterval(timer);
            ScreenManager.show(IndexScreen);
            $('.advPage').remove();
        }
        function tabImg(){
            if(index<len-1){
                index++;
                $advImg.css({
                    'transform':'translateX(' + (-100* index) + '%)',
                    'WebkitTransform':'translateX(' + (-100* index) + '%)'
                });
                $advSpan.removeClass('cur');
                $advSpan.eq(index).addClass(' cur');
            }else{
                skipPage();
            }
        }
        I18n.fillArea($("#navBottom"));
    }).fail(function(){
        navigator.splashscreen && navigator.splashscreen.hide();
        ScreenManager.show(IndexScreen);
        I18n.fillArea($("#navBottom"));
    })
}

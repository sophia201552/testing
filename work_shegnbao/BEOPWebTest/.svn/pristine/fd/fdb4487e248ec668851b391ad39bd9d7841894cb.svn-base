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
    projectId:72
}; //基础配置文件
var userAll = undefined;
var pathAll = undefined;
var missionAll = undefined;
var pointAll = undefined;
var curSet = {
    patrolIndex:-1
};
var patrolLog = [];
var I18n = undefined;                                          //国际化对象的引用
var BomConfig = {
};
var router;
var dataManager = undefined;
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
        dataManager = new DataManager();
        Init();
    });
});
document.addEventListener('deviceready',onDeviceReady,false);
function onDeviceReady() {
    AppConfig.device = device;
    document.addEventListener("backbutton", router.back, false);
    dataManager = new DataManager();
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
            if(!BomConfig.height) {
                BomConfig.height = $(window).height();
            }
            _this.init();
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
            _this.initLanguage();
            router.empty().to({
                typeClass:UserSelScreen,
                data:{}
            })
        },


        initLanguage: function () {
            I18n.fillArea($('#divAppDashboardLanguage'));
            I18n.fillArea($('#divLoginInfo'));
            $("#selectLanguage a").off('click').click(function (e) {
                InitI18nResource(e.currentTarget.attributes.value.value, true);
                e.preventDefault();
            });
        },

        //登录功能
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
            // 工单系统
            $('#btnWorkFlow').off('tap').on('tap', function(e) {
                e.preventDefault();
                router.to({
                    typeClass:UpdateScreen
                });
            });
            //配置页面
            $('#btnAdminConfig').off('tap').on('tap', function(e) {
                e.preventDefault();
                router.to({
                    typeClass:AdminConfigure
                });
            });
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

    ScreenManager.show(IndexScreen);
    I18n.fillArea($("#navBottom"));
}

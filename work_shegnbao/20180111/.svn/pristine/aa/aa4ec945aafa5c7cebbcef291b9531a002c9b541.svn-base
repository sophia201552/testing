/// <reference path="../lib/jquery-2.1.4.min.js" />

var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var SpinnerContainer = document.getElementById('divSpinner');  //Spinner容器
var AlertContainer = document.getElementById('divAlert');      //Alert容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenPrevious = undefined;                                //前一页面对象的引用
var Spinner = new LoadingSpinner({ color: '#00FFFF' });        //等待加载时的转圈圈
var AppConfig = {
    userId: undefined,
    account: undefined,
    isMobile: true,
    version:'1.2.0',
    projectId:144,
    packageName:'patrol.baojie',
    gpsTime:5000
}; //基础配置文件
var userAll = undefined;
var pathAll = undefined;
var missionAll = undefined;
var pointAll = undefined;
var curSet = undefined;

var I18n = undefined;                                          //国际化对象的引用
var BomConfig = BomConfig || {};
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
    onDeviceReady();
});
var steps;
document.addEventListener('deviceready',onDeviceReady,false);
function onDeviceReady() {
    if (navigator.userAgent.match(/iP(ad|hone|od)|Android/i)) AppConfig.isMobile = true;
    var config = {
	    frequency: 70,//采样频率
	    initialValue: 2,//动态基础阈值
	    ThreadValue: 2,//静态阈值
	    isStatic: true//是否使用静态阈值
	};
    steps = new Steps(config);
    if (typeof device == 'undefined'){
        AppConfig.device = {};
    }else{
        AppConfig.device = device;
    }
    AppConfig.language = navigator.language.split('-')[0]?navigator.language.split('-')[0]:'zh';
    document.addEventListener("backbutton", router.back, false);
    var config = {
	    frequency: 70,//采样频率
	    initialValue: 2,//动态基础阈值
	    ThreadValue: 2,//静态阈值
	    isStatic: true//是否使用静态阈值
	};
	steps = new Steps(config);
    AppConfig.host = 'http://beop.rnbtech.com.hk';
    AppConfig.language = 'zh';
    document.addEventListener("volumeupbutton", function(){
        infoBox.confirm('清除缓存将会清除一切巡更日志以及缓存文件，如确定，之后请重进App。',
        function() {
            localStorage.clear();
            if(typeof dataManager == 'undefined')return;
            if (dataManager.file.enable) {
                $.when(dataManager.file.write({type: 'userAll', data: []}),
                dataManager.file.write({type: 'pathAll', data: []}),
                dataManager.file.write({type: 'pointAll', data: []}),
                dataManager.file.write({type: 'missionAll', data: []}),
                dataManager.file.write({type: 'patrolLog', data: []})).done( function (store) {
                    dataManager.patrolLog = [];
                    callback();
                }).fail(function(){
                    window.plugins.toast.show('清除缓存失败', 'short', 'bottom');
                });
            } else {
                dataManager.patrolLog = [];
                callback();
            }
        })
    }, false);
    document.addEventListener("volumedownbutton", function(){
        if(!curSet || $.isEmptyObject(curSet) || !curSet.log)return;
        var postData = {
            time: new Date(),
            type:'temp',
            patrol: curSet
        };
        WebAPI.post('/patrol/log/saveOperateLog',postData).done(function(){
            window.plugins.toast.show('临时操作日志上传成', 'short', 'bottom');
        })
    }, false);
    InitI18nResource('zh',null,'static/views/js/i18n/').always(function (rs) {
        new UpdateHelper(AppConfig.packageName,AppConfig.version,function(){
            I18n = new Internationalization(null, rs);
            dataManager = new DataManager();
            dataManager.getPatrolLogFromFile(Init);
        })
    });
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
            //if(!BomConfig.height) {
            //    BomConfig.height = $(window).height() + 'px';
            //}
            _this.initNav();
            _this.init();
        },

        close: function () {
            //remove key down event in login page
            document.onkeydown = false;
        },

        init: function () {
            var _this = this;
            CssAdapter.adapter();
            try {
                curSet = JSON.parse(localStorage.getItem('curSet'));
                if(!curSet)curSet = {};
            }catch (e){
                curSet = {}
            }
            router.empty().to({
                typeClass:UserSelScreen,
                data:{}
            })
        },
        initNav: function () {
            // 后退按钮
            $('#btnBack').off('tap').on('tap', function (e) {
                router.back();
            });
        }
    };

    return IndexScreen;
})();

function Init(){
    ScreenManager.show(IndexScreen);
}

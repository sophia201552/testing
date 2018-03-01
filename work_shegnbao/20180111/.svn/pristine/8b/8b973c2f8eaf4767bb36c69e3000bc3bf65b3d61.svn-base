var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenModal = undefined;                                   //共用弹出框中，加载对象的引用。若模块有私有弹出框，无需赋值。
var ScreenPrevious = undefined;                                //前一页面对象的引用
var ToolCurrent = undefined;
var Spinner = new LoadingSpinner({color: '#00FFFF'});        //等待加载时的转圈圈
//var navigation = responsiveNav("#navbar-collapse");          //响应式导航条
var AppConfig = AppConfig || {
        projectId: undefined,
        projectName: undefined,
        userId: undefined,
        account: undefined,
        level: undefined,
        projectList: undefined,
        isMobile: navigator.userAgent.match(/iP(ad|hone|od)|Android/i),
        chartTheme: 'macarons',
        // 是否使用 Factory 离线数据库
        // 0 - 使用 Factory 线上数据库，即发布后的数据
        // 1 - 使用 Factory 离线数据库
        isFactory: 0
    }; //配置文件
var I18n = I18n ? I18n : undefined;                                          //国际化对象的引用
var Unit = Unit ? Unit : undefined;//单位化
// background workers
var BackgroundWorkers = {};
//TODO: to be removed
echarts.config = echarts.config || {color: ['#E2583A', '#FD9F08', '#1D74A9', '#04A0D6', '#689C0F', '#109d83', '#FEC500']};

var _hmt = []
var I18n = I18n || undefined;
// var I18N_PATH = '/static/app/Platform/views/i18n/';
var I18N_PATH = ['/static/views/js/i18n/','/static/app/Platform/views/i18n/'];
$(document).ready(function(){
    var language = navigator.language.split('-')[0];
    if (localStorage.language)language = localStorage.language
    if (!language )language = 'en';
    AppConfig.language = language;
    AppConfig.chartTheme = theme.Dark;
    InitMultiI18nResource(language, I18N_PATH).always(function (rs) {
        I18n = new Internationalization(null, rs);
        // new IndexScreen();
    });
}) 
var Spinner = new LoadingSpinner({color: '#00FFFF'});
var  ScreenManager = Router;

var IndexScreen = (function(){
    function IndexScreen(){
        this.init();
    }
    IndexScreen.prototype = {
        init:function(){
            // window.AppDriver = new PlatformScreen();
            // window.AppDriver.show();
            if (AppConfig && AppConfig.userId){
                new PlatformScreen();
                // window.AppDriver = new PlatformScreen();
                // window.AppDriver.show();
            }else{
                new PageLogin();
            }
        },
    }
    return IndexScreen
})()
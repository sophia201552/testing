function ModalConfig() { };

var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenModal = undefined;                                   //共用弹出框中，加载对象的引用。若模块有私有弹出框，无需赋值。
var ScreenPrevious = undefined;                                //前一页面对象的引用
var ToolCurrent = undefined;
var Spinner = new LoadingSpinner({ color: '#00FFFF' });        //等待加载时的转圈圈
//var navigation = responsiveNav("#navbar-collapse");          //响应式导航条
var AppConfig = AppConfig || {
    projectId: undefined,
    projectName: undefined,
    userId: undefined,
    account: undefined,
    level: undefined,
    projectList: undefined,
    isMobile: false,
    chartTheme: 'macarons',
    // 是否使用 Factory 离线数据库
    // 0 - 使用 Factory 线上数据库，即发布后的数据
    // 1 - 使用 Factory 离线数据库
    isFactory: 0
}; //配置文件
var I18n = I18n ? I18n : undefined;                                          //国际化对象的引用
// background workers
var BackgroundWorkers = {};
//TODO: to be removed
echarts.config = echarts.config || { color: ['#E2583A', '#FD9F08', '#1D74A9', '#04A0D6', '#689C0F', '#109d83', '#FEC500'] };

$(document).ready(function () {
    var arrParams = document.cookie.split('; '), dictParams = {};
    for (var i = 0; i < arrParams.length; i++) {
        var arr = arrParams[i].split('=');
        if (arr[0] == 'params') {
            dictParams = JSON.parse(eval(arr[1]));
            break;
        }
    }

    var lang = navigator.language ? navigator.language : navigator.browserLanguage;
    lang = lang.split('-')[0];
    lang = dictParams.lang ? dictParams.lang : lang;

    if (dictParams.projectId) AppConfig.projectId = dictParams.projectId;
    if (dictParams.systemSkin) AppConfig.userId = 666; localStorage.setItem("systemSkin_666", dictParams.systemSkin);

    InitI18nResource(lang).always(function (rs) {
        I18n = new Internationalization(null, rs);
        if (dictParams.type == 'dashboard') {
            new EnergyScreen(dictParams.pageId).show();
        } else if (dictParams.type == 'report') {
            var clazz = namespace('observer.screens.FacReportWrapScreen');
            new clazz({
                id: dictParams.pageId,
                default: dictParams.default
            }, 'indexContent').show();
        }
    });
});
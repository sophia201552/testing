// index.js
var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenModal = undefined;                                   //共用弹出框中，加载对象的引用。若模块有私有弹出框，无需赋值。
var ScreenPrevious = undefined;                                //前一页面对象的引用
var ToolCurrent = undefined;
var Spinner = new LoadingSpinner({color: '#00FFFF'});        //等待加载时的转圈圈

var AppConfig = {
    projectId: 1,
    projectName: undefined,
    userId: undefined,
    account: undefined,
    level: undefined,
    projectList: undefined,
    isMobile: false
}; //配置文件
var I18n = undefined;                                          //国际化对象的引用

var start = (function ($, window, undefined) {
    var InitI18nResource = function (strLanguage, isForce) {
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
    };

    var Init = function () {
        var hidData = JSON.parse($('#hidData').html());
        AppConfig.userId = hidData.userId;
        I18n = new Internationalization();

        ScreenManager.show(EnergyScreen, hidData.menuId);
    }

    return function () {
        $(function () {
            //whether is running with mobile device.
            if (navigator.userAgent.match(/iP(ad|hone|od)/i)) AppConfig.isMobile = true;

            ElScreenContainer.innerHTML = '';
            InitI18nResource(navigator.language.split('-')[0]);
        }); 
    }

} (jQuery, window));
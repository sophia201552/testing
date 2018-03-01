var I18n = I18n || undefined;
var I18N_PATH = '/static/app/Platform/views/i18n/';$
(document).ready(function(){
    var language = navigator.language.split('-')[0];
    language = 'en'
    AppConfig.language = language
    InitI18nResource(language, true, I18N_PATH).always(function (rs) {
        I18n = new Internationalization(null, rs);
        new IndexScreen();
    });
}) 
var Spinner = new LoadingSpinner({color: '#00FFFF'});

var IndexScreen = (function(){
    function IndexScreen(){
        this.init();
    }
    IndexScreen.prototype = {
        init:function(){
            new PlatformScreen().show();
        },
    }
    return IndexScreen
})()
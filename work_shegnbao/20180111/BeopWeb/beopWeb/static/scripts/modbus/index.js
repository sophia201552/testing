if (typeof AppConfig == 'undefined'){
    var AppConfig = {};
}
var I18n = I18n || undefined;
var I18N_PATH = '/static/views/js/i18n/';

$(document).ready(function(){
    var language = navigator.language.split('-')[0];
    if (localStorage.language)language = localStorage.language
    if (!language )language = 'en';
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
            try {
                if (ElScreenContainer) {
                }
            } catch (e) {
                ElScreenContainer=$('#modbusContainer')[0];
            }
            var url=location.search.slice(1);
            var key_value=url.split('&');
            var json={};
            key_value.forEach(item=>{
                var arr=item.split('=');
                json[arr[0]]=arr[1];
            })
            AppConfig.projectId=json.projectId;
            var modBusInterface = new ModBusInterface(json.projectId)
            modBusInterface.show();
        },
    }
    return IndexScreen
})()
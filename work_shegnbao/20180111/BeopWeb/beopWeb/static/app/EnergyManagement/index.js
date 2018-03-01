if (typeof AppConfig == 'undefined'){
    var AppConfig = {};
}
var I18n = I18n || undefined;
var I18N_PATH = '/static/app/EnergyManagement/views/i18n/';
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
// var AppConfig = {
//     permission:{
//         'WFUser':true
//     }
// }
var IndexScreen = (function(){
    function IndexScreen(){
        this.init();
    }
    IndexScreen.prototype = {
        init:function(){
            window.AppDriver = new EnergyManagementScreen()
            AppDriver.show();
        },
    }
    return IndexScreen
})()
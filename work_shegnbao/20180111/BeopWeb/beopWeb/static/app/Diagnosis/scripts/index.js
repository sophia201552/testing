// index.js - diagnosis 单独使用时的入口
;(function (Diagnosis) {
    let diagnosisIns = null;

    if (window.Log) {
        window.Log.level = window.Log.ENUM_LEVEL.LOG;
    }

    $(function () {
        Log.info('page ready!');
        window.Spinner = new LoadingSpinner({ color: '#00FFFF' });
        window.AppConfig = window.AppConfig || {};
        window.AppConfig.userId=window.AppConfig.userId||Number((function(c_name){
    　　　　if (document.cookie.length>0){　
    　　　　　　c_start=document.cookie.indexOf(c_name + "=");　　
    　　　　　　if (c_start!=-1){ 
    　　　　　　　　c_start=c_start + c_name.length+1;
    　　　　　　　　c_end=document.cookie.indexOf(";",c_start);　
    　　　　　　　　if (c_end==-1) c_end=document.cookie.length;
    　　　　　　　　return unescape(document.cookie.substring(c_start,c_end));
    　　　　　　} 
    　　　　}
    　　　　return "";
    　　}　)('userId'));
        window.I18n = undefined;
        window.ElScreenContainer = document.body;
        let container = document.querySelector('#mainframe');
        let I18N_PATH = '/static/app/Diagnosis/scripts/i18n/';
        let initI18n = function (lang, isForce) {
            InitI18nResource(lang, isForce, I18N_PATH).always(function (rs) {                
                I18n = new Internationalization(null, rs);
                diagnosisIns = new Diagnosis(container);
                diagnosisIns.show();
                setTimeZone();
            });
        };

       let setTimeZone = function () {
            var timeZoneId = window.getProjectTimeZone(AppConfig.project.id);
            var localTimeZoneOrProTimeZone = window.localStorage.getItem('timeZone');
            if( localTimeZoneOrProTimeZone !== 'localTimeZone' ) {
                 moment.tz.setDefault(timeZoneId);
            } else {
                moment.tz.setDefault();
            }
         };
         
    
         
        $(document).ready(function () {
            initI18n(navigator.language.split('-')[0], false);
        });
    })
} ( namespace('diagnosis.Diagnosis') ));

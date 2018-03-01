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
        window.AppConfig.userId = 1;
        window.I18n = undefined;
        window.ElScreenContainer = document.body;

        let container = document.querySelector('#mainframe');
        let I18N_PATH = '/static/app/Diagnosis/scripts/i18n/';
        let initI18n = function (lang, isForce) {
            InitI18nResource(lang, isForce, I18N_PATH).always(function (rs) {
                I18n = new Internationalization(null, rs);
                diagnosisIns = new Diagnosis(container);
                diagnosisIns.show();
            });
        };
        $(document).ready(function () {
            initI18n(navigator.language.split('-')[0], false);
        });
    })
} ( namespace('diagnosis.Diagnosis') ));

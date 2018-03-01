;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(window, function (exports) {

    exports.AppConfig = {
        userId: 262,
        isStratefy: 1,
        projectId: 293,
        projectList:[{
            "address": "175 Liverpool St, Sydney NSW 2000",
            "datadb": "qantas",
            "id": 293,
            "isAdvance": 1,
            "isFavorite": null,
            "is_diag": null,
            "lastReceivedTime": "2017-01-18 00:35:07",
            "latlng": "-33.8767149,151.211525",
            "logo": "/custom/beop_sales/preciseairlogo.png",
            "name_cn": "175Liverpoolst",
            "name_en": "liverpoolst",
            "name_english": "175LiverpoolStreet",
            "online": "Offline",
            "pic": "liverpoolst.jpg",
            "time_format": 1,
            "updateMarker": false
        }]
    };
    exports.Spinner = new LoadingSpinner({ color: '#00FFFF' });
    exports.I18n = undefined;
    exports.I18N_PATH = '/static/app/WebFactory/views/js/i18n/';
    exports.initI18n = function (lang, isForce,promise) {
        InitI18nResource(lang, isForce, I18N_PATH).always(function (rs) {
            I18n = new Internationalization(null, rs);
            promise.resolve();
        });
    }
}));

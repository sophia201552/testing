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
        isFactory: 1,
        isStratefy: 1,
        projectId: 1,
        projectList:[{
            "address": "上海市浦东新区张江高科技园区郭守敬路965号",
            "datadb": "hsimc123456",
            "id": 1,
            "isAdvance": 0,
            "isFavorite": null,
            "is_diag": null,
            "lastReceivedTime": "2017-01-03 16:11:37",
            "latlng": "31.213228,121.607895",
            "logo": null,
            "name_cn": "上海中芯国际",
            "name_en": "hsimc",
            "name_english": "Simc",
            "online": "Online",
            "pic": "hsimc.jpg",
            "time_format": 0,
            "updateMarker": false
        }, {
            "address":"上海市浦东新区金桥镇新金桥路2222",
            "datadb":"shhwhn01",
            "id":72,
            "isAdvance":0,
            "isFavorite":null,
            "is_diag":null,
            "lastReceivedTime":"2016-12-26 14:29:05",
            "latlng":"31.260944,121.629994",
            "logo":null,
            "name_cn":"上海华为",
            "name_en":"shhuawei",
            "name_english":"shhuawei",
            "online":"Online",
            "pic":"shhuawei.jpg",
            "time_format":0
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

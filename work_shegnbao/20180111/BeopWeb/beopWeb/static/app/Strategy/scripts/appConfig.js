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

    let config = {
        isStratefy: 1
    };
    exports.Spinner = new LoadingSpinner({ color: '#00FFFF' });
    exports.I18n = undefined;
    exports.I18N_PATH = '/static/app/Strategy/themes/default/js/i18n/';
    exports.initI18n = function (lang, isForce, promise) {
        InitI18nResource(lang, isForce, I18N_PATH).always(function (rs) {
            exports.I18n = new Internationalization(null, rs);
            promise.resolve();
        });
    };

    exports.AppConfig = config;
}));

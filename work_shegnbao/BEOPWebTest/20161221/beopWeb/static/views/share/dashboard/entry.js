// index.js
(function ($) {
    /*********** test for loadJS ***********************/
    AL.when('/static/build/config.js')
        .then(function () {
            AL.config(window.buildConfig);
            // one package that depend on other two or more packages
            // when('lib', 'core').then(...);
            AL.when('share-dashboard', 'chart')
                .then(function () {
                    start();
                });
        });
} (jQuery));
// app.js
(function ($) {
    /*********** test for loadJS ***********************/
    AL.when('/static/build/config.js')
        .then(function () {
            AL.config(window.buildConfig);
            // one package that depend on other two or more packages
            // when('lib', 'core').then(...);
            AL.when('index')
                .then(function () {
                    AL.require('entrance');
                    AL.require('observer');
                    AL.require('analysis');
                    AL.require('ui-widgets');
                    AL.require('dashboard');
                    AL.require('admin');
                    AL.require('workflow');
                    AL.require('chart');
                });
        });
} (jQuery));
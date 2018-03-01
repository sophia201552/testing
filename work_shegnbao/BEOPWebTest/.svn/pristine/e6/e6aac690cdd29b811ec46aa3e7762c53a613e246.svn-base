;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './components/App/App.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('./components/App/App.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.components.App')
        );
    }
}(namespace('beop.strategy'), function (exports, App) {

    function Index() {
        this.init();
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         *
         */
        this.init = function () {};

        this.show = function () {
            this.showApp();
        };

        this.showApp = function () {
            var screen;
            var appContainer = document.querySelector('#mainframe');
            
            this.close();
            screen = new App(appContainer);
            screen.show();
        };

        this.close = function () {};

    }.call(Index.prototype);

    exports.Index = Index;
}));

$(function () {
    var Clazz = namespace('beop.strategy.Index');
    new Clazz().show();
});
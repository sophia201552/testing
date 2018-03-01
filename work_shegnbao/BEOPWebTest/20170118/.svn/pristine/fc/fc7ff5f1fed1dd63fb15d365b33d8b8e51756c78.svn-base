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
}(namespace('beop.strategy.components.DataSourcePanel'), function (exports) {

    function View(container) {
        this.container = container;
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor 
         */
        this.constructor = View;

        this.init = function (intents) {
            this.theme.intents = intents;
        };

        this.ready = function (model) {
            //

        };

        this.display = function (representation) {
            this.container.innerHTML = representation;
        };

    }.call(View.prototype);

    +function () {

        this.intents = {};

    }.call(View.prototype.theme = {});

    exports.View = View;
}));
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
}(namespace('beop.strategy.components.StrategyTplTree'), function (exports) {

    function Actions() {
        this.present = null;
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = Actions;

        this.init = function (present) {
            this.present = present;
        };


    }.call(Actions.prototype);

    var actions = new Actions();
    var n = "beop.strategy.components.StrategyTplTree.actions";

    actions.intents = {
    };
    exports.actions = actions;
}));



;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/model.js', './state.js', './action.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../core/model.js'), require('./state.js'), require('./action.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.PropPanel.State'),
            namespace('beop.strategy.components.PropPanel.Action')
        );
    }
}(namespace('beop.strategy.components.PropPanel'), function (exports, Model, State, Action) {

    function Index(container) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }
        // model
        this.model = null;
        // state
        this.state = null;
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         * Initialize
         */
        this.init = function () {
            this.initState();
            this.initModel();
        };

        this.initState = function () {
            this.state = new State();
        };

        this.getInitStore = function () {
            return {
                
            };
        };

        /**
         * @description 初始化 model
         */
        this.initModel = function () {
            this.model = new Model(this.modelBLCProcessing, this.state, this.getInitialStore(), this.state.nap);
        };

        this.modelBLCProcessing = function (store, dataset) {
            return this.store;
        };

        /**
         * @description 初始化 state
         */
        this.show = function () {};

        this.close = function () {};

    }.call(Index.prototype);

    exports.Index = Index;
}));
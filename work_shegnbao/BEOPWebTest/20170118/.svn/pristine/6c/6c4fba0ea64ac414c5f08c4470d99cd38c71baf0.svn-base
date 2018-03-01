;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/model.js', './state.js', './view.js', './actions.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../core/model.js'), require('./state.js'), require('./view.js'), require('./actions.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.Painter.Toolbar.State'),
            namespace('beop.strategy.components.Painter.Toolbar.View'),
            namespace('beop.strategy.components.Painter.Toolbar.actions')
        );
    }
}(namespace('beop.strategy.components.Painter.Toolbar'), function(exports, Model, State, View, actions) {

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

        this.init();
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         * Initialize
         */
        this.init = function() {
            var _this = this;
            var state = new State();
            var view = new View(this.container);
            var model = this.model = new Model(this.modelBLCProcessing.bind(this), state, this.getInitialStore(), state.nap);

            state.init(view);
            actions.init(this.model.present.bind(this.model));
            view.init(actions);

            this.model.subscribe(function(state) {
                state.render(_this.model.getStore());
            });
        };

        this.getInitialStore = function() {
            return {};
        };

        /**
         * @description 初始化 model
         */
        this.modelBLCProcessing = function(store, dataset) {

        };

        /**
         * @description 初始化 state
         */
        this.show = function() {
            // this.createState();
            this.model.getState().render(this.model.getStore());
        };

        this.close = function() {};

    }.call(Index.prototype);

    exports.Index = Index;
}));
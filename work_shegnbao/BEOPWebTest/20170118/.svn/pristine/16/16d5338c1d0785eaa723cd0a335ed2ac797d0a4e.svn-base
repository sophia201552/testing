;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/model.js', './state.js', './action.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../core/model.js'), require('./state.js'), require('./action.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.DataSourcePanel.State'),
            namespace('beop.strategy.components.DataSourcePanel.View'),
            namespace('beop.strategy.components.DataSourcePanel.actions')
        );
    }
}(namespace('beop.strategy.components.DataSourcePanel'), function (exports, Model, State, View, actions) {

    function Index(container) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }
        this.container.style.position = "relative";
        // model
        this.model = null;

        this.store = {};
        window.ElScreenContainer = this.container;
        this.arrColor = ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700", "#6699FF", "#ff6666", "#3cb371", "#b8860b", "#30e0e0"];

        this.init();
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
            var _this = this;
            var state = new State();
            var view = new View(this.container);
            var model = this.model = new Model(this.modelBLCProcessing.bind(this), state, this.getInitialStore(), state.nap);
            
            state.init(view);
            actions.init(this.model.present);
            view.init(actions.intents);

            this.model.subscribe(function (state) {
                state.render(_this.model);
            });
        };

        this.getInitialStore = function () {

        };


        /**
         * @description 初始化 model
         */
        this.initModel = function () {
            this.model = new Model(this.modelBLCProcessing, this.state, this.getInitialStore(), this.state.nap);
        };

        this.modelBLCProcessing = function (store, dataset) {
            return store;
        };

        /**
         * @description 初始化 state
         */
        this.show = function () {
            var _this = this;
            // 如果已经预加载过了，则直接显示
            if (typeof _this.store.group !== 'undefined') return;

            this.model.getState().render(this.model.getStore());

            var promise = $.Deferred();
            if (!AppConfig.datasource) {
            // 如果没有预加载，则先去加载数据，再做显示
                Spinner.spin(_this.container);
                WebAPI.get('/analysis/datasource/getDsItemInfo/' + AppConfig.userId + '/null').done(function (result) {
                    AppConfig.datasource = new DataSource({
                        store: {
                            group: result
                        }
                    });
                    promise.resolve();
                });
            } else {
                promise.resolve();
            }
            promise.done(function(){
                _this.store.group = AppConfig.datasource.m_parent.store.group;
                _this.paneDatasource = AppConfig.datasource = new DataSource(_this);
                _this.paneDatasource.show();
            })
        };

        this.close = function () {};

    }.call(Index.prototype);

    exports.Index = Index;
}));
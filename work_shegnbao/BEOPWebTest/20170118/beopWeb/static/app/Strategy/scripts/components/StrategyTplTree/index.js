;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/model.js', './state.js', './action.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../core/model.js'), require('./state.js'), require('./action.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.StrategyTplTree.State'),
            namespace('beop.strategy.components.StrategyTplTree.View'),
            namespace('beop.strategy.components.StrategyTplTree.actions')
        );
    }
}(namespace('beop.strategy.components.StrategyTplTree'), function (exports, Model, State, View, actions) {

    function Index(container) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }
        // model
        this.model = null;

        this.init();
    }

    // PROTOTYPES
    +function () {
        var view;
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
            view = new View(this.container);
            var model = this.model = new Model(this.modelBLCProcessing, state, this.getInitialStore(), state.nap);
            
            state.init(view);
            actions.init(this.model.present);
            view.init(actions.intents);

            this.model.subscribe(function (state) {
                state.render(_this.model);
            });
        };
        
        /**
         * 获取当前组件的初始状态
         * @returns
         */
        this.getInitialStore = function () {
            return {
                // 是否在右侧显示子设备的策略
                isShowSubEquipStrategy: false,
                // 是否在 tree 中显示策略叶子节点
                isShowStrategy: false,
                // 选中的设备id
                selectedEquipIds: [],
                // 设备树的数据
                data: []
            };
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
         * @description 渲染页面
         */
        this.show = function () {
            this.model.getState().render(this.model.getStore());
        };

        this.close = function () {
            view.close();
        };

    }.call(Index.prototype);

    exports.Index = Index;
}));
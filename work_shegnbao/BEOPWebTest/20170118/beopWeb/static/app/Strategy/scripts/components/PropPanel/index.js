;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/model.js', './state.js','./view.js', './actions.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../core/model.js'), require('./state.js'), require('./view.js'), require('./actions.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.PropPanel.State'),
            namespace('beop.strategy.components.PropPanel.View'),
            namespace('beop.strategy.components.PropPanel.actions')
        );
    }
}(namespace('beop.strategy.components.PropPanel'), function (exports, Model, State, View, actions) {

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
    +function () {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         * Initialize
         */
        this.init = function () {
            // this.initState();
            // this.initModel();
            var _this = this;
            var state = new State();
            var view = new View(this.container);
            var model = this.model = new Model(this.modelBLCProcessing.bind(this), state, this.getInitialStore(), state.nap);
            
            state.init(view);
            actions.init(this.model.present.bind(this.model), this.model.store);
            view.init(actions.intents);

            this.model.subscribe(function (state) {
                state.render(_this.model.getStore());
            });
        };

        this.getInitialStore = function () {
            return {
                isSave: false,
                isRecover: false,
                isShow: false,
                items: []
            };
        };

        /**
         * @description 初始化 model
         */
        this.modelBLCProcessing = function (store, dataset) {
            if(typeof dataset.selectedIds !== 'undefined'){
                var itemsArr = [];
                if(dataset.selectedIds.length === 0){
                    itemsArr = [];
                    store.isShow = false;
                }else{
                    for(var i=0,length=dataset.items.length;i<length;i++){
                        for(var j=0,jLength=dataset.selectedIds.length;j<jLength;j++){
                            if(dataset.items[i]._id === dataset.selectedIds[j]){
                                itemsArr.push(dataset.items[i]);
                            }
                        }
                    }
                    store.isShow = true;
                }
                store.items = itemsArr;
            }
            if (typeof dataset.isSave !== 'undefined') {
                if (dataset.isSave){//保存
                    store.items.forEach(function(row){
                        var allKeys = Object.keys(row);
                        $.each(Object.keys(dataset.dataJson),function(index,key){
                            if(allKeys.indexOf(key) !== -1){
                                row[key] = dataset.dataJson[key];
                            }
                        })
                    })
                }
            }
            if (typeof dataset.isRecover !== 'undefined') {
                if (dataset.isRecover){//恢复
                    store.items = this.model.store.items;
                }
            }
            return store;
        };

        /**
         * @description 初始化 state
         */
        this.show = function () {
             
        };

        this.close = function () {};

    }.call(Index.prototype);

    exports.Index = Index;
}));
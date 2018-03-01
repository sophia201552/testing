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
}(namespace('beop.strategy.components.EquipTree'), function (exports) {

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
    var n = "beop.strategy.components.EquipTree.actions";

    actions.intents = {
    };
    exports.actions = actions;
}));
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
}(namespace('beop.strategy.components.EquipTree'), function (exports) {

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
            return (
                '<div id="equipTreeCtn" class="ztree"></div>'
            );
        };

        this.display = function (representation) {
            this.container.innerHTML = representation;
            this.renderTree();
        };

        this.renderTree = function () {
            var tree = $.fn.zTree.getZTreeObj('equipTreeCtn');
            var domCtn;
            var nodes;

            if (!tree) {
                domCtn = this.container.querySelector('#equipTreeCtn');
                tree = $.fn.zTree.init($(domCtn), {
                    view: {
                        showLine: false,
                        // 不允许用户同时选中多个进行拖拽
                        selectedMulti: false
                    },
                    data: {
                        keep: {
                            parent: true
                        }
                    },
                    callback: {
                        onNodeCreated: function (e, treeId, treeNode) {
                            var domA;
                            $('#'+ treeNode.tId + '_switch').prependTo($('#'+ treeNode.tId + '_a'));
                            if (!treeNode.isParent) {
                                domA = domCtn.querySelector('#'+treeNode.tId + '_a');
                                domA.setAttribute('draggable', 'true');
                                domA.dataset.id = treeNode.id;
                                domA.ondragstart = function (e) {
                                    var dataTransfer = e.dataTransfer;
                                    dataTransfer.setData('id', this.dataset.id);
                                    dataTransfer.setData('type', 'template');
                                };
                            }
                        }
                    }
                }); // end
            } else {
                nodes = tree.getNodes();
                nodes.forEach(function (node) {
                    tree.removeNode(node);
                });
            }

            tree.addNodes(null, -1, [{
                id: '1',
                name: '冷机组1',
                open: true,
                children: [{
                    id: '11',
                    name: '冷机1'
                }, {
                    id: '12',
                    name: '冷机2'
                }, {
                    id: '12',
                    name: '冷机3'
                }]
            }, {
                id: '1',
                name: '冷机组2',
                open: true,
                children: [{
                    id: '11',
                    name: '冷机1'
                }, {
                    id: '12',
                    name: '冷机2'
                }, {
                    id: '12',
                    name: '冷机3'
                }]
            }, {
                id: '1',
                name: '冷机组3',
                open: true,
                children: [{
                    id: '11',
                    name: '冷机1'
                }, {
                    id: '12',
                    name: '冷机2'
                }, {
                    id: '12',
                    name: '冷机3'
                }]
            }])
            
        };

    }.call(View.prototype);

    +function () {

        this.intents = {};

    }.call(View.prototype.theme = {});

    exports.View = View;
}));
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
}(namespace('beop.strategy.components.EquipTree'), function (exports) {

    function State() {
        this.model = null;
        this.view = null;

        this.init();
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor
         */
        this.constructor = State;

        this.init = function (view) {
            this.view = view;
        };

        this.bindModel = function (model) {
            this.model = model;
            return this;
        };

        this.ready = function () {
            return true;
        };

        this.nap = function () {};

        // 渲染页面
        this.render = function (model) {
            this.representation(model);
        };

        this.representation = function (model) {
            var representation = 'something was wrong!';
            if (this.ready()) {
                representation = this.view.ready(model);
            }
            this.view.display(representation) ;
        };

    }.call(State.prototype);

    exports.State = State;
}));
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/model.js', './state.js', './action.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../core/model.js'), require('./state.js'), require('./action.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.components.EquipTree.State'),
            namespace('beop.strategy.components.EquipTree.View'),
            namespace('beop.strategy.components.EquipTree.actions')
        );
    }
}(namespace('beop.strategy.components.EquipTree'), function (exports, Model, State, View, actions) {

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
            if (typeof dataset.isShowSubEquipStrategy !== 'undefined') {
                store.isShowSubEquipStrategy = dataset.isShowSubEquipStrategy;
            }
            if (typeof dataset.isShowStrategy !== 'undefined') {
                store.isShowStrategy = dataset.isShowStrategy;
            }
            if (typeof dataset.selectedEquipIds !== 'undefined') {
                store.selectedEquipIds
            }
            return store;
        };

        /**
         * @description 渲染页面
         */
        this.show = function () {
            this.model.getState().render(this.model.getStore());
        };

        this.close = function () {};

    }.call(Index.prototype);

    exports.Index = Index;
}));
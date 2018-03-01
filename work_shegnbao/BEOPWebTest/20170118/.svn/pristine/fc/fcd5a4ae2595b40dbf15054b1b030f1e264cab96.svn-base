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
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.StrategyTplTree'), function(exports) {

    function View(container) {
        this.container = container;
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = View;

        this.init = function(intents) {
            this.theme.intents = intents;
        };

        this.ready = function(model) {
            return (
                '<div class="strategyTplTreeContent gray-scrollbar"><div id="strategyTplTreeCtn" class="ztree"></div></div>'
            );
        };

        this.display = function(representation) {
            this.container.innerHTML = representation;
            this.renderTree();
        };

        this.renderTree = function() {
            var _this = this;
            this.tree = $.fn.zTree.getZTreeObj('strategyTplTreeCtn');
            var domCtn;
            var nodes;

            if (!this.tree) {
                domCtn = this.container.querySelector('#strategyTplTreeCtn');
                this.tree = $.fn.zTree.init($(domCtn), {
                    async: {
                        enable: true,
                        type: 'get',
                        url: function(treeId, treeNode) {
                            var url = "/strategy/template/group";
                            // 首次加载
                            if (!treeNode) {
                                return url;
                            } else {
                                return url + "/" + treeNode.id;
                            }
                        },
                        // 将 PO 转换成 VO
                        dataFilter: function(treeId, parentNode, rs) {
                            if (rs.status !== 'OK') {
                                return [];
                            }
                            // 因为用不到数据，所以这里就不对数据进行缓存
                            return rs.data.data.map(function(row) {
                                var params = {
                                    id: row._id,
                                    pId: row.group,
                                    name: row.name,
                                    isParent: row.isGroup === 1,
                                    desc: row.desc,
                                    userId: row.userId,
                                    lastTime: row.lastTime
                                };
                                if (row.isFolder !== 1) {
                                    params.keywords = row.keywords;
                                    params.type = row.type;
                                    params.option = row.option;
                                }
                                return params;
                            });
                        }
                    },
                    view: {
                        showLine: false,
                        showIcon: false,
                        // 不允许用户同时选中多个进行拖拽
                        selectedMulti: false,
                        fontCss: {
                            color: "#cadee5"
                        }
                    },
                    callback: {
                        onNodeCreated: function(e, treeId, treeNode) {
                            var domA;
                            var $container = $(_this.container);
                            var $span_switch = $container.find('#' + treeNode.tId + '_switch');
                            var $span_a = $container.find('#' + treeNode.tId + '_a');
                            $span_switch.prependTo($span_a);
                            $span_a.addClass('cursorDefault');
                            if (!treeNode.isParent) {
                                domA = domCtn.querySelector('#' + treeNode.tId + '_a');
                                domA.setAttribute('draggable', 'true');
                                domA.dataset.id = treeNode.id;
                                domA.ondragstart = function(e) {
                                    var $this = $(this);
                                    var dataTransfer = e.dataTransfer;
                                    var offset = $this.offset();
                                    var info = {
                                        x: e.clientX - offset.left,
                                        y: e.clientY - offset.top,
                                        w: $this.width(),
                                        h: $this.height(),
                                        dataId: $this.data('id')
                                    };
                                    dataTransfer.setData('info', JSON.stringify(info));
                                };
                            }else{
                                //默认展开
                                if(treeNode.tId === 'strategyTplTreeCtn_1'){
                                    _this.tree.expandNode(treeNode, true, false, true, true);
                                }
                            }
                        },
                        onExpand:function(e, treeId, treeNode){
                            if(treeNode.tId === 'strategyTplTreeCtn_1'){
                                _this.tree.expandNode(treeNode.children[0], true, false, true, true);
                            }
                        }
                    }
                }); // end
            }

        };

        this.close = function () {
            if (this.tree) {
                $.fn.zTree.destroy('strategyTplTreeCtn');
                this.tree = null;
            }
        }

    }.call(View.prototype);

    +function() {

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
}(namespace('beop.strategy.components.StrategyTplTree'), function (exports) {

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
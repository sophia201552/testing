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
                '<div id="strategyTplTreeCtn" class="ztree"></div>'
            );
        };

        this.display = function (representation) {
            this.container.innerHTML = representation;
            this.renderTree();
        };

        this.renderTree = function () {
            var tree = $.fn.zTree.getZTreeObj('strategyTplTreeCtn');
            var domCtn;
            var nodes;

            if (!tree) {
                domCtn = this.container.querySelector('#strategyTplTreeCtn');
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
                                    var $this = $(this);
                                    var dataTransfer = e.dataTransfer;
                                    var offset = $this.offset();
                                    var info = {
                                        x: e.clientX - offset.left,
                                        y: e.clientY - offset.top,
                                        w: $this.width(),
                                        h: $this.height()
                                    };
                                    dataTransfer.setData('info', JSON.stringify(info));
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
                name: '策略分类1',
                open: true,
                children: [{
                    id: '11',
                    name: '我的策略1'
                }, {
                    id: '12',
                    name: '我的策略2'
                }, {
                    id: '12',
                    name: '我的策略3'
                }]
            }, {
                id: '1',
                name: '策略分类2',
                open: true,
                children: [{
                    id: '11',
                    name: '我的策略1'
                }, {
                    id: '12',
                    name: '我的策略2'
                }, {
                    id: '12',
                    name: '我的策略3'
                }]
            }])
            
        };

    }.call(View.prototype);

    +function () {

        this.intents = {};

    }.call(View.prototype.theme = {});

    exports.View = View;
}));
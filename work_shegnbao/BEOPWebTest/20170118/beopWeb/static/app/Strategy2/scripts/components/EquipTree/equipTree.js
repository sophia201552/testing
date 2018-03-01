;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../core/model.js',
            '../core/Event.js',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../core/model.js'),
            require('../core/Event.js'),
            require('React')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.core.Event'),
            namespace('React'),
            namespace('beop.strategy.core.constants')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    Model,
    Event,
    React,
    constants
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    var actions = {
        dispatch: null,
        onToggleShowAllStrategiesBtnHandler: function () {
            actions.dispatch({
                type: constants.equipTree.TOGGLE_SHOW_ALL_STRATEGIES_BTN
            });
        },
        onSelectTreeNode: function (_id, parentNodeId) {
            actions.dispatch({
                type: constants.equipTree.SELECT_TREE_NODE,
                _id: _id,
                pid: parentNodeId
            });
        },
        addAsyncData: function (items, nodeId) {
            actions.dispatch({
                type: constants.equipTree.ADD_SYNC_DATA,
                items: items,
                nodeId: nodeId
            });
        }
    };

    // ztree 组件包裹类
    class Tree extends React.Component {

        refDefine(name) {
            var refs = this.refs = this.refs || {};

            return function (dom) {
                refs[name] = dom;
            };
        }

        isLoaded(node) {
            var flag = true, nodes;

            if (node.isLoaded) {
                return true;
            }
            
            if (node.zAsync) {
                // 拿到 node 下面所有的父节点
                nodes = this.treeObj.getNodesByParam('isParent', true, node);

                nodes.some(function (row) {
                    if (!row.zAsync) {
                        flag = false;
                        return true;
                    }
                });
            } else {
                flag = false;
            }
            node.isLoaded = flag;

            return flag;
        }

        zTreeOnClick() {
            var node = this.treeObj.getSelectedNodes()[0];
            var parentNode;

            if (!node.isParent) {
                parentNode = node.getParentNode();
            } else {
                parentNode = node;
            }

            if (parentNode) {
                if (!this.props.bShowChild) {
                    if (!parentNode.zAsync) {
                        // 通过 zTree 的方法加载数据
                        this.treeObj.reAsyncChildNodes(parentNode, 'refresh', true);
                    }
                } else {
                    // 是否完成了全部加载
                    if ( !this.isLoaded(parentNode) ) {
                        parentNode.isLoaded = 'pending';
                        // 通过 zTree 的方法加载数据
                        this.treeObj.reAsyncChildNodes(parentNode, 'refresh', true);
                    }
                }
            }

            actions.onSelectTreeNode(node._id, parentNode._id);
        }

        zTreeOnNodeCreated(event, treeId, treeNode) {
            var $span_switch = $('#'+ treeNode.tId + '_switch');
            $span_switch.prependTo($('#'+ treeNode.tId + '_a'));
            $span_switch.closest('a').addClass('cursorDefault');
        }

        zTreeOnAsyncSuccess(event, treeId, treeNode, rs) {
            if (rs.status === 'OK') {
                actions.addAsyncData(rs.data, treeNode._id);
                treeNode.isLoaded === 'pending' && (treeNode.isLoaded = true);
            }
        }

        zTreeBeforeAsync(treeId, treeNode) {
            if (treeNode.isLoaded === true) {
                treeNode.zAsync = true;
                return false;
            }
            return true;
        }

        componentDidMount() {
            var _this = this;
            var dom = this.refs.domWrap;
            var expendArr = [1];

            var zSetting = {
                view: {
                    showIcon: false,
                    showLine: false,
                    fontCss: {
                        color: "#cadee5"
                    }
                },
                async: {
                    enable: true,
                    type: 'get',
                    url: function (treeId, treeNode) {
                        var node = treeNode.getPath()[0];

                        if (_this.props.bShowChild) {
                            return '/strategy/item/getAllList/' + node.projId + (!treeNode.projId ? '/' + treeNode._id : '');
                        }

                        return '/strategy/item/getList/' + node.projId + (!treeNode.projId ? '/' + treeNode._id : '');
                    },
                    dataFilter: function (treeId, parentNode, rs) {
                        if (rs.status === 'OK') {
                            return rs.data;
                        }
                        return [];
                    }
                },
                edit: {
                    enable: false,
                    editNameSelectAll: true,
                    showRenameBtn: false,
                    showRemoveBtn: false
                },
                data: {
                    keep:{
                        leaf: true,
                        parent: true
                    }, 
                    simpleData: {
                        enable: true,
                        idKey: "_id",
                        pIdKey: "nodeId"
                    }
                },
                callback: {
                    onClick: this.zTreeOnClick.bind(this),
                    onNodeCreated: this.zTreeOnNodeCreated.bind(this),
                    onAsyncSuccess: this.zTreeOnAsyncSuccess.bind(this),
                    beforeAsync: this.zTreeBeforeAsync.bind(this)
                }
            };
            this.treeObj = $.fn.zTree.init($(dom), zSetting, this.props.items);
            //默认展开
            expendArr.forEach(function(row){
                _this.treeObj.expandNode(_this.treeObj.getNodesByParam("tId", "equipTreeCtn_"+row)[0], true, false, true, true);
            });
        }

        shouldComponentUpdate() {
            // 交由 jQuery 控件处理内部状态更新
            return false;
        }

        componentWillUnmount() {
            if (this.treeObj) {
                this.treeObj.destroy();
                this.treeObj = null;
            }
        }

        render() {
            return (
                h('#equipTreeCtn.ztree', {
                    ref: this.refDefine('domWrap'),
                })
            );
        }
    }

    // 视图辅助方法
    var theme = {
        topBox:function(){
            return (
                h('.input-group.divSearch', [
                    h('input',{
                        className: 'form-control iptSearch',
                        type:'text'
                    }),
                    h('span.spanSearch',[
                        h('span',{
                            className: 'glyphicon glyphicon-search',
                            'aria-hidden':'true'
                        })
                    ])
                ])
            )
        },
        bottomBox: function (bShowChildStrategies) {
            var showAllStrategy = bShowChildStrategies ? 'active' : '' ;
            return (
                h('.bottomBox', [
                    h('div', {
                        className:  'showAllStrategy ' + showAllStrategy,
                        onClick: actions.onToggleShowAllStrategiesBtnHandler
                    }, '显示所有子策略')
                ])
            );
        }
    };
    
    function EquipTree(props, context) {
        actions.dispatch = context.dispatch;

        return (
            h('#equipTree', {
                style: {
                    width: '100%',
                    height: '100%'
                }
            }, [
                h('div.equipTreeBox',[
                    theme.topBox(),
                    h('.equipTreeContent.gray-scrollbar', [
                        h(Tree, {
                            items: props.items,
                            bShowChild: props.bShowChildStrategies
                        }),
                        theme.bottomBox(props.bShowChildStrategies)
                    ])
                ])
            ])
        );
    }

    exports.EquipTree = EquipTree;
}));
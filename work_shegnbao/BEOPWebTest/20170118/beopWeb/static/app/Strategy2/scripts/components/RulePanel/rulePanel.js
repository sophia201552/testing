;
(function(root, factory) {
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
            namespace('beop.strategy.core.constants'),
            namespace('React')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    Model,
    Event,
    constants,
    React
) {
    var h = React.h;
    var linkEvent = React.linkEvent;

    var actions = {
        dispatch: null
    };

    class RuleTree extends React.Component{

        constructor(props, context) {
            super(props, context);

            this.refs = {};
        }

        refDefine(name) {
            var refs = this.refs = {};

            return function (dom) {
                refs[name] = dom;
            };
        }

        zTreeOnNodeCreated(e, treeId, treeNode) {
            var domA;
            var $container = $(this.refs.domWrap);
            var $span_switch = $container.find('#' + treeNode.tId + '_switch');
            var $span_a = $container.find('#' + treeNode.tId + '_a');
            $span_switch.prependTo($span_a);
            $span_a.addClass('cursorDefault');
            if (!treeNode.isParent) {
                domA = $container[0].querySelector('#' + treeNode.tId + '_a');
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
                    this.tree.expandNode(treeNode, true, false, true, true);
                }
            }
        }

        zTreeOnExpand(e, treeId, treeNode) {
            if (treeNode.tId === 'strategyTplTreeCtn_1') {
                this.tree.expandNode(treeNode.children[0], true, false, true, true);
            }
        }

        componentDidMount(){
            this.tree = $.fn.zTree.getZTreeObj('strategyTplTreeCtn');
            var domCtn;

            if (!this.tree) {
                domCtn = this.refs.domWrap;
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
                        onNodeCreated: this.zTreeOnNodeCreated.bind(this),
                        onExpand:this.zTreeOnExpand.bind(this)
                    }
                }); // end
            }
        }

        shouldComponentUpdate() {
            // 交由 jQuery 控件处理内部状态更新
            return false;
        }

        componentWillUnmount() {
            if (this.tree) {
                this.tree.destroy();
                this.tree = null;
            }
        }

        render() {
            return (
                h('div',{
                    id:"strategyTplTreeCtn",
                    className: "ztree",
                    ref: this.refDefine('domWrap')
                })
            );
        }
    }

    var theme = {
    };

    function RulePanel(props, context) {
        actions.dispatch = context.dispatch;
        return (
            h('div', {
                id: 'RulePanel',
                style: { width: '100%', height: '100%' }
            },[
                h('div',{
                    className: "strategyTplTreeContent gray-scrollbar"
                },[
                    h(RuleTree)
                ])
            ])
        );
    }

    exports.RulePanel = RulePanel;
}));
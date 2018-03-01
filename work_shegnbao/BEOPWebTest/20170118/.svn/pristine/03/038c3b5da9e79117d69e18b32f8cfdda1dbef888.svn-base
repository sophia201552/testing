;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React',
            '../Layout/layout',
            '../StrategyTable/strategyTable',
            '../EquipTree/equipTree',
            '../DataSourcePanel/dataSourcePanel',
            '../PropPanel/propPanel',
            '../Painter/painter',
            '../Painter/Toolbar/batchConfigModal.js'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React'),
            require('../Layout/layout'),
            require('../StrategyTable/strategyTable'),
            require('../EquipTree/equipTree'),
            require('../DataSourcePanel/dataSourcePanel'),
            require('../PropPanel/propPanel'),
            require('../Painter/painter'),
            require('../Painter/Toolbar/batchConfigModal.js')
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('beop.strategy.components.Layout'),
            namespace('beop.strategy.components.StrategyTable'),
            namespace('beop.strategy.components.EquipTree'),
            namespace('beop.strategy.components.PropPanel'),
            namespace('beop.strategy.components.Painter.Index'),
            namespace('beop.strategy.core.createModel'),
            namespace('beop.strategy.reducers.appReducer'),
            namespace('beop.strategy.containers.appContainer')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    Layout,
    StrategyTable,
    EquipTree,
    PropPanel,
    Painter,
    createModel,
    appReducer,
    appContainer
) {

    var h = React.h;

    var Sider = Layout.Sider;
    var SiderGroup = Layout.SiderGroup;
    var Container = Layout.Container;
    var Content = Layout.Content;

    var initialStore = {
        equipTree: {
            selectedNode: null,
            items: AppConfig.projectList.map(function(item, i) {
                return {
                    _id: item.id.toString(),
                    name: item.name_cn,
                    nodeId: '',
                    isParent: true,
                    projId: item.id,
                    children: []
                };
            }),
            bShowChildStrategies: false
        },
        strategyTable: {
            searchKey: '',
            selectedIds: []
        },
        painter: {
            openStrategy: null
        }
    };

    var state = function(store) {
        // 左边树选中的文件夹 id，没有则为 null
        var selectedGroupId = store.equipTree.selectedNode ? store.equipTree.selectedNode.pid : null;

        // 左边数选中的节点 id，没有则为 null
        var selectedNodeId = store.equipTree.selectedNode ? store.equipTree.selectedNode._id : null;

        var tableItems = selectedGroupId === null ? [] : (function() {
            var stack = store.equipTree.items.slice();
            var item, nodes, rs = [];

            while( item = stack.shift() ) {
                if (item._id === selectedGroupId) {
                    nodes = item.children;
                    break;
                }
                if (item.children && item.children.length) {
                    stack = stack.concat(item.children);
                }
            }

            if (!nodes) {
                return [];
            }
            // 查找 nodes 下所有的叶子节点
            stack = nodes.slice();
            while( item = stack.shift() ) {
                if (!item.isParent) {
                    rs.push(item);
                    continue;
                }
                // 如果不显示所有子策略就不做深搜
                if (!store.equipTree.bShowChildStrategies) {
                    continue;
                }
                if (item.children && item.children.length) {
                    stack = stack.concat(item.children);
                }
            }

            return rs;
        }());

        return {
            equipTree: {
                selectedGroupId: selectedGroupId,
                selectedNodeId: selectedNodeId,
                items: store.equipTree.items,
                bShowChildStrategies: store.equipTree.bShowChildStrategies
            },
            strategyTable: {
                searchKey: store.strategyTable.searchKey,
                selectedIds: store.strategyTable.selectedIds,
                items: tableItems
            },
            painter: {
                openStrategy: store.painter.openStrategy
            },
            propPanel: {
                items: (function() {
                    return tableItems.filter(function(row) {
                        return store.strategyTable.selectedIds.indexOf(row['_id']) > -1;
                    });
                }())
            }
        };
    };

    var nap = function() {
        return function() {};
    };

    var model = createModel(appContainer, state, initialStore, nap);

    class App extends React.Component {

        constructor(props, context) {
            super(props, context);

            context.dispatch = props.dispatch;

            this.state = model.getState();
        }

        componentDidMount() {
            var _this = this;

            model.subscribe(function(state) {
                Log.info('Received new app state', state);

                _this.setState(state);
            });
        }

        render() {
            var bOpenStrategy = !!this.state.painter.openStrategy;
            var state = this.state;

            return (
                h(Container, {
                    id: 'container',
                    children: [
                        h(Sider, {
                            id: 'leftSider',
                            children: [
                                h(EquipTree, state.equipTree)
                            ]
                        }),
                        bOpenStrategy ? h(Painter, {
                            openStrategy: state.painter.openStrategy
                        }) : h(Container, {
                            children: [
                                h(Content, {
                                    id: 'content',
                                    children: [
                                        h(StrategyTable, state)
                                    ]
                                }),
                                h(SiderGroup, {
                                    id: 'rightSider',
                                    style: {
                                        width: "360px"
                                    },
                                    children: [
                                        h(Sider, {
                                            title: '属性'
                                        }, [
                                            h(PropPanel, {
                                                items: state.propPanel.items,
                                                selectedIds: state.strategyTable.selectedIds.slice()
                                            })
                                        ])
                                    ]
                                })
                            ]
                        })
                    ]
                })
            );
        }
    }

    exports.App = App;
    exports.App.dispatch = appReducer.create(model.present.bind(model));
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React',
            '../Painter/Toolbar/toolbar.js',
            '../Painter/Sketchpad/sketchpad.js',
            '../Painter/Toolbar/batchConfigModal.js',
            '../Painter/Toolbar/debugModal.js'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React'),
            require('../Painter/Toolbar/toolbar.js'),
            require('../Painter/Sketchpad/sketchpad.js'),
            require('../Painter/Toolbar/batchConfigModal.js'),
            require('../Painter/Toolbar/debugModal.js')
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('beop.strategy.components.Layout'),
            namespace('beop.strategy.components.DataSourcePanel'),
            namespace('beop.strategy.components.RulePanel'),
            namespace('beop.strategy.components.ModulePropPanel'),
            namespace('beop.strategy.components.ModuleConfigPanel.Index'),
            namespace('beop.strategy.components.Painter.BatchConfigModal'),
            namespace('beop.strategy.components.Painter.DebugModal'),
            namespace('beop.strategy.components.Painter.Toolbar'),
            namespace('beop.strategy.components.Painter.Sketchpad'),
            namespace('beop.strategy.core.createModel'),
            namespace('beop.strategy.reducers.painterReducer'),
            namespace('beop.strategy.containers.painterContainer'),
            namespace('beop.strategy.core.constants'),
            namespace('diff'),
            namespace('beop.util.MergeDiff')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(
    exports,
    React,
    Layout,
    DataSourcePanel,
    RulePanel,
    ModulePropPanel,
    ModuleConfigPanel,
    BatchConfigModal,
    DebugModal,
    Toolbar,
    Sketchpad,
    createModel,
    painterReducer,
    painterContainer,
    constants,
    diff,
    MergeDiff
) {
    var h = React.h;

    var Sider = Layout.Sider;
    var SiderGroup = Layout.SiderGroup;
    var Container = Layout.Container;
    var Content = Layout.Content;

    var deepClone = $.extend.bind($, true);

    var initialStore = {
        painter: {
            openStrategy: null,
            activeSiderIndex: 2,
            activeSiderIndex: null,
            selectedModulesIds: []
        },
        sketchpad: {

        },
        dataSourcePanel: {
            group: null
        },
        modal: {
            type: "",
            props: {}
        },
        modalConfigPanel: {
            configModuleId: null
        }
    };

    var state = function(store) {
        var selectedModulesItems = (function() {
            if (!store.painter.openStrategy) {
                return [];
            }
            return store.painter.openStrategy.modules.filter(function(row) {
                return store.painter.selectedModulesIds.indexOf(row._id) > -1;
            })
        }());

        var configModule = (function () {
            var rs = null;

            if (!store.painter.openStrategy) {
                return null;
            }

            store.painter.openStrategy.modules.some(function(row) {
                if (row._id === store.modalConfigPanel.configModuleId) {
                    rs = row;
                    return true;
                }
            });
            return rs;
        } ());

        return {
            painter: {
                openStrategy: store.painter.openStrategy,
                selectedModulesIds: store.painter.selectedModulesIds,
                activeSiderIndex: store.painter.activeSiderIndex
            },
            modulePropPanel: {
                selectedModules: selectedModulesItems
            },
            toolbar: {

            },
            sketchpad: {

            },
            dataSourcePanel: {
                group: store.dataSourcePanel.group
            },
            modal: {
                type: store.modal.type,
                props: store.modal.props
            },
            modalConfigPanel: {
                configModule: configModule,
                moduleOutputs: (function () {
                    var list = [];

                    if (!store.painter.openStrategy || !configModule) {
                        return [];
                    }
                    store.painter.openStrategy.modules.forEach(function (row) {
                        if (row._id === configModule._id) {
                            return;
                        }
                        list.push({
                            _id: row._id,
                            name: row.name,
                            output: row.option.output
                        });
                    });
                    return list
                } ())
            }
        };
    };

    var nap = function(present) {
        return function(state) {
        };
    };

    var model = createModel(painterContainer, state, initialStore, nap);

    var snapshot = {
        snapshot: null,
        set: function (data) {
            this.snapshot = deepClone({}, Array.toMap(data, '_id'));
        },
        get: function () {
            return this.snapshot;
        }
    };

    class Painter extends React.Component {

        constructor(props, context) {
            super(props, context);

            initialStore.painter.openStrategy = this.props.openStrategy;
            this.state = deepClone({}, model.getState(), {
                painter: {
                    openStrategy: this.props.openStrategy
                }
            });

            snapshot.set(this.state.painter.openStrategy.modules);

            this.sync = this.sync.bind(this);
        }

        componentDidMount() {
            var _this = this;

            this.unsubscribe = model.subscribe(function(state) {
                Log.info('Received new painter state', state);

                _this.setState(state);
            });
        }

        componentWillUnmount() {
            this.unsubscribe();
        }

        shouldComponentUpdate(nextProps, nextState) {
            return true;
        }

        diff(data) {
            var lastData = snapshot.get();

            return diff(lastData, data, function(lhs, rhs, path) {
                var cmp;
                if (path.length !== 2 || ['option', 'loc'].indexOf(path[1]) === -1) return;
                cmp = window.diff(lhs, rhs);
                return cmp !== null;
            });
        }

        sync() {
            var _this = this;
            var data = this.state.painter.openStrategy.modules;
            var item = this.state.painter.openStrategy.strategy;
            var diffData = this.diff(Array.toMap(data, '_id'));

            if (diffData) {
                diffData = MergeDiff(diffData);

                var info = {
                    userId: AppConfig.userId,
                    ids: [item['_id']],
                    data: {
                        'value': item.value
                    }
                }

                var saveApi = WebAPI.post('/strategy/item/save', info);

                var syncApi = WebAPI.post('/strategy/modules/sync', {
                    modules: diffData
                }).done(function(rs) {
                    if (rs.status === 'OK') {
                        // 同步数据成功
                        snapshot.set(data);
                    } else {
                        // 同步数据失败
                    }
                }).fail(function() {
                    // 服务端报错或通讯失败
                });
            } else {
                // 没有需要同步的数据
            }
        }

        render() {
            var state = this.state;
            var bConfigModule = !!state.modalConfigPanel.configModule;

            return (
                !bConfigModule ? h(Container, {
                    children: [
                        h(Content, {
                            id: 'content',
                            style: {
                                overflow: 'hidden'
                            },
                            children: [
                                h('#painter', {
                                    style: {
                                        width: '100%',
                                        height: '100%'
                                    }
                                }, [
                                    h(Toolbar),
                                    h(Sketchpad, {
                                        tempStrategy: this.state.painter.openStrategy,
                                        selectedModulesIds: this.state.painter.selectedModulesIds,
                                        handleSync: this.sync
                                    })
                                ]),
                                (function() {
                                    switch (state.modal.type) {
                                        case 'BatchConfigModal':
                                            return h(BatchConfigModal, state.modal.props);
                                            break;
                                        case 'DebugModal':
                                            return h(DebugModal, state.painter.openStrategy);
                                            break;
                                        default:
                                            return null;
                                    }
                                }())
                            ]
                        }),
                        h(SiderGroup, {
                            id: 'rightSider',
                            style: {
                                width: "360px"
                            },
                            children: [
                                h(Sider, {
                                    title: '规则',
                                    children: [
                                        h(RulePanel, state.rulePanel)
                                    ]
                                }),
                                h(Sider, {
                                    title: '数据源',
                                    children: [
                                        h(DataSourcePanel, state.dataSourcePanel)
                                    ]
                                }),
                                h(Sider, {
                                    title: '模块属性',
                                    children: [
                                        h(ModulePropPanel, state)
                                    ]
                                })
                            ]
                        })
                    ]
                }) : h(Container, [
                    h(Content, {
                        id: 'content'
                    }, [
                        h(ModuleConfigPanel, state.modalConfigPanel)
                    ]),
                    h(SiderGroup, {
                        id: 'rightSider',
                        style: {
                            width: "360px"
                        }
                    }, [
                        h(Sider, {
                            title: '数据源',
                            children: [
                                h(DataSourcePanel, state.dataSourcePanel)
                            ]
                        })
                    ])
                ])
            );
        }
    }

    exports.Index = Painter;
    exports.dispatch = painterReducer.create(model.present.bind(model));
}));
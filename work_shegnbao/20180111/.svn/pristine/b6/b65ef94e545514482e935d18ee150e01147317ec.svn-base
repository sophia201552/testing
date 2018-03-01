;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd'),
            namespace('beop.strategy.containers.Sketchpad'),
            namespace('beop.strategy.components.SketchpadToolbar'),
            namespace('beop.strategy.components.RulePanel'),
            namespace('beop.strategy.components.DataSourcePanel'),
            namespace('beop.strategy.containers.ModulePropPanel'),
            namespace('beop.strategy.containers.EquipTree'),
            namespace('beop.strategy.containers.ModuleConfigPanel'),
            namespace('beop.strategy.containers.DebugView'),
            namespace('beop.strategy.containers.modals.ParamsConfigModal'),
            namespace('beop.strategy.components.Spinner')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    Sketchpad,
    SketchpadToolbar,
    RulePanel,
    DataSourcePanel,
    ModulePropPanel,
    EquipTree,
    ModuleConfigPanel,
    DebugView,
    ParamsConfigModal,
    Spinner
) {
    var h = React.h;

    const { Layout, Spin } = antd;
    const Tabs = antd.Tabs;
    const { TabPane } = Tabs;
    const { Sider, Content } = Layout;

    exports.Painter = function(props) {
        const {
            bShowConfigPanel,
            bShowDebugPanel,
            bShowSpin
        } = props;

        return (
            h('div',{
                style: {
                    height: '100%',
                }
            },[
                h('div',{
                    id: 'moduleConfigPanelWrap',
                    className:'moduleConfigPanelWrap'+(bShowConfigPanel?' painterViewActive':''),
                    style: {
                        height: '100%',
                        display: bShowConfigPanel?'block':'none',
                    }
                },[h(ModuleConfigPanel)]),
                h('div',{
                    id: 'debugViewWrap',
                    className: 'debugViewWrap'+(bShowDebugPanel?' painterViewActive':''),
                    style: {
                        height: '100%',
                        display: bShowDebugPanel?'block':'none',
                    }
                },[
                    h(DebugView),
                ]),
                h(Layout, {
                    id: 'container',
                    className: 'containerWrap'+((bShowDebugPanel||bShowConfigPanel)?'':' painterViewActive'),
                    style: {
                        height: '100%',
                        display: (bShowDebugPanel||bShowConfigPanel)?'none':'flex'
                    }
                }, [
                    h(Spinner,{
                        bShowSpin
                    }),
                    h(Sider, {
                        id: 'leftSider',
                        width: 300
                    }, [
                        h(EquipTree)
                    ]),
                    h(Content, {
                        style: {
                            padding: '0 5px'
                        }
                    }, [
                        h('#painter', {
                            style: {
                                width: '100%',
                                height: '100%'
                            }
                        }, [
                            h(SketchpadToolbar),
                            h(Sketchpad)
                        ])
                    ]),
                    h(Sider, {
                        id: 'rightSider',
                        width: 350
                    }, [
                        h(Content, {
                            style: {
                                height: '60%',
                                paddingBottom: '5px'
                            }
                        }, [
                            h(Tabs, {
                                type: 'card',
                                tabPosition: 'bottom',
                                animated: false
                            }, [
                                h(TabPane, {
                                    tab: I18n.resource.painter.RULE,
                                    key: '1'
                                }, [h(RulePanel)]),
                                h(TabPane, {
                                    tab: I18n.resource.painter.DATA_SOURCE,
                                    key: '2'
                                }, [h(DataSourcePanel,{isDetach:AppConfig.datasource?true:false})]),
                            ])
                        ]),
                        h(Content, {
                            style: {
                                height: '40%'
                            }
                        }, [
                            h(Tabs, {
                                type: 'card',
                                tabPosition: 'bottom',
                                animated: false
                            }, [
                                h(TabPane, {
                                    tab: I18n.resource.painter.MODULE_PROPERTIES,
                                    key: '3'
                                }, [h(ModulePropPanel)])
                            ])
                        ])
                    ]),
                    h(ParamsConfigModal)
                ])
            ])
        ); // end of return 
        
    };
}));
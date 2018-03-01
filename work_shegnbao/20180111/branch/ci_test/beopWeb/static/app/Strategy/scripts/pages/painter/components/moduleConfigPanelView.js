;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React')
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd'),
            namespace('ReactCodeMirror'),
            namespace('beop.strategy.enumerators'),
            namespace('beop.strategy.components.moduleConfigPanels.PythonConfigPanel'),
            namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel'),
            namespace('beop.strategy.components.moduleConfigPanels.CorrelationAnalysisConfigPanel'),
            namespace('beop.strategy.components.moduleConfigPanels.ForecastConfigPanel'),
            namespace('beop.strategy.components.moduleConfigPanels.HistoricalCurveConfigPanel'),
            namespace('beop.strategy.components.moduleConfigPanels.TableConfigPanel'),
            namespace('beop.strategy.components.moduleConfigPanels.ThreeDimensionsViewConfigPanel'),
            namespace('beop.strategy.components.InputOutputParamConfigPanel'),
            namespace('beop.strategy.components.DataSourcePanel')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    ReactCodeMirror,
    enumerators,
    PythonConfigPanel,
    FuzzyRuleConfigPanel,
    CorrelationAnalysisConfigPanel,
    ForecastConfigPanel,
    HistoricalCurveConfigPanel,
    TableConfigPanel,
    ThreeDimensionsViewConfigPanel,
    InputOutputParamConfigPanel,
    DataSourcePanel
) {
    const h = React.h;

    const { Layout } = antd;
    const Tabs = antd.Tabs;
    const { TabPane } = Tabs;
    const { Sider, Content } = Layout;

    const getModuleClass = function (moduleType) {
        switch(moduleType) {
            case enumerators.moduleTypes.PYTHON:
                return PythonConfigPanel;
                break;
            case enumerators.moduleTypes.FUZZY_RULE:
                return FuzzyRuleConfigPanel;
                break;
            case enumerators.moduleTypes.CORRELATION_ANALYSIS:
                return CorrelationAnalysisConfigPanel;
                break;
            case enumerators.moduleTypes.FORECAST:
                return ForecastConfigPanel;
                break;
            case enumerators.moduleTypes.HISTORICAL_CURVE:
                return HistoricalCurveConfigPanel;
                break;
            case enumerators.moduleTypes.TABLE:
                return TableConfigPanel;
                break;
            case enumerators.moduleTypes.THREE_DIMENSIONS_VIEW:
                return ThreeDimensionsViewConfigPanel;
                break;
            default:
                return FuzzyRuleConfigPanel;
        }
    };
    
    const ModuleConfigPanel = function (props) {
        const {
            type,
            bShowConfigPanel,
            doOk,
            doCancel,
            saveInputOutputData,
        } = props;

        const panelProps = props.props;
        const otherModuleOutputs = (function () {
            var list = [];

            panelProps.modules && panelProps.modules.forEach(function (row) {
                if (row._id === panelProps.moduleId) {
                    return;
                }
                list.push({
                    _id: row._id,
                    name: row.name,
                    output: row.option.output
                });
            });
            return list;
        } ());

        return (
            h(Layout, {
                id: 'container',
                style: {
                    height: '100%'
                }
            }, [
                h(Sider, {
                    id: 'leftSider',
                    width: 300
                }, [
                    h(Tabs, {
                        type: 'card',
                        tabPosition: 'bottom',
                        animated: false
                    }, [
                        h(TabPane, {
                            tab: I18n.resource.moduleConfigPanel.INPUT,
                            key: 'input'
                        }, [
                            h(InputOutputParamConfigPanel, {
                                otherModuleOutputs: otherModuleOutputs,
                                data:panelProps.module && panelProps.module.option.input || [],
                                moduleId:panelProps.moduleId,
                                type: 'input',
                                parameterType: type,
                                save:saveInputOutputData
                            })
                        ]),
                        h(TabPane, {
                            tab: I18n.resource.moduleConfigPanel.OUTPUT,
                            key: 'output'
                        }, [
                            h(InputOutputParamConfigPanel, {
                                data:panelProps.module && panelProps.module.option.output || [],
                                inputData:panelProps.module && panelProps.module.option.input || [],
                                moduleId:panelProps.moduleId,
                                type: 'output',
                                parameterType: type,
                                save:saveInputOutputData
                            })
                        ])
                    ])
                ]),
                h(Content, {
                    style: {
                        padding: '0 5px'
                    }
                }, [
                    h(getModuleClass(type), Object.assign({}, panelProps, {
                        doOk: doOk,
                        doCancel: doCancel
                    }))
                ]),
                h(Sider, {
                    id: 'rightSider',
                    width: 350
                }, [
                    h(Tabs, {
                        type: 'card',
                        tabPosition: 'bottom',
                        animated: false
                    }, [
                        h(TabPane, {
                            tab: I18n.resource.moduleConfigPanel.DATA_SOURCE,
                            key: '2'
                        }, [ h(DataSourcePanel,{isDetach:AppConfig.datasource?true:false}) ])
                    ])
                ])
            ])
        );
    };

    exports.ModuleConfigPanel = ModuleConfigPanel;
}));
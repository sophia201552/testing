;
(function(root, factory) {
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
            namespace('ReactKonva'),
            namespace('antd'),
            namespace('beop.strategy.containers.Sketchpad'),
            namespace('beop.strategy.components.SketchpadToolbar'),
            namespace('beop.strategy.containers.ModuleConfigPanel'),
            namespace('beop.strategy.components.DataSourcePanel'),
            namespace('beop.strategy.containers.DebugParamsPanel'),            
            namespace('beop.strategy.components.DebugViewSketchpad'),
            namespace('beop.strategy.components.DebugViewConsole'),
            namespace('beop.strategy.containers.DebugWatchPanel')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    ReactKonva,
    antd,
    Sketchpad,
    SketchpadToolbar,
    ModuleConfigPanel,
    DataSourcePanel,
    DebugParamsPanel,    
    DebugViewSketchpad,
    DebugViewConsole,
    DebugWatchPanel
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const Layout = antd.Layout;
    const { Input, Collapse, Tabs, Button, Modal } = antd;
    const { Search } = Input;
    const { ButtonGroup } = Button;
    const { TabPane } = Tabs;
    const { Sider, Content } = Layout;
    const { Panel } = Collapse;
    const deepClone = $.extend.bind($, true);
    class DebugPanel extends React.Component {
        constructor(props, context) {
            super(props, context);
            document.body.classList.add('debugViewBody');
            this.consoleLoadStart = this.consoleLoadStart.bind(this);
            this.consoleLoadEnd = this.consoleLoadEnd.bind(this);
        }
        componentDidMount() {
            const {strategy,selectedValueId,setDebugValue} = this.props;
            let debugValue = strategy && strategy.value.find(v=>v._id==selectedValueId);
            if(debugValue){
                setDebugValue(debugValue.list);
            }
        }
        componentWillReceiveProps(nextProps) {
            const {strategy,selectedValueId,setDebugValue} = nextProps;
            
            let oldModulesId = this.props.modules.map(v=>v._id),
                newModulesId = nextProps.modules.map(v=>v._id);
            let isChangeModule = (()=>{
                let r = false;
                if(oldModulesId.length != newModulesId.length){
                    return true;
                }
                // oldModulesId.forEach(id=>{
                //     if(newModulesId.indexOf(newModulesId)<0){
                //         r = true;
                //     }
                // });
                return r;
            })();
            if(strategy && this.props.strategy && (strategy._id!=this.props.strategy._id || selectedValueId!=this.props.selectedValueId || isChangeModule)){
                let debugValue = strategy && strategy.value.find(v=>v._id==selectedValueId);
                if(debugValue){
                    setDebugValue(debugValue.list);
                }
            }
        }
        shouldComponentUpdate(nextProps, nextState) {
            let isNeedUpdate = false;
            const {isDebug} = nextProps;
            if(!this.props.isDebug && isDebug){
                isNeedUpdate = true;
            }else if(this.props.consoleInfo.length != nextProps.consoleInfo.length){
                isNeedUpdate = true;
            }else{
                isNeedUpdate = false;
            }
            return isNeedUpdate;
        }
        consoleLoadStart() {
            this.refs.console&&this.refs.console.consoleLoadStart();
        }
        consoleLoadEnd() {
            this.refs.console&&this.refs.console.consoleLoadEnd();
        }
        getCenterComponent() {
            const {isDebug,strategy,modules,selectedIds,debugValue,selectedPutsId,selectedPutId,runResult,selectedValueId,dbClickPut,consoleInfo,bShowConfigPanel,
                btnActions,moduleActions,inputActions,outputActions,stageActions,setDebugValue} = this.props;
            if(!isDebug){
                return;
            }
            if (bShowConfigPanel) {
                return (
                    h(ModuleConfigPanel)
                );
            } else {
                return (
                    h('#painter', {
                        style: {
                            width: '100%',
                            height: '100%'
                        }
                    }, [
                        h('div', {
                            style: {
                                width: '100%',
                                height: '70%'
                            }
                        }, [h(DebugViewSketchpad, {
                            strategy: strategy,
                            modules: modules,
                            selectedIds: selectedIds,
                            debugValue: debugValue,
                            selectedPutsId:selectedPutsId,
                            selectedPutId:selectedPutId,
                            runResult: runResult&&runResult.rs,
                            selectedValueId: selectedValueId,
                            dbClickPut: dbClickPut,
                            isDebug,
                            btnActions: btnActions,
                            moduleActions: moduleActions,
                            inputActions: inputActions,
                            outputActions: outputActions,
                            stageActions: stageActions,
                            setDebugValue,
                            customActions:{
                                consoleLoadStart:this.consoleLoadStart,
                                consoleLoadEnd:this.consoleLoadEnd
                            }
                        })]),
                        h('#console', {
                            style: {
                                width: '100%',
                                height: '30%'
                            }
                        }, h(DebugViewConsole, {
                            ref:'console',
                            consoleInfo: consoleInfo,
                            clearConsole: this.props.btnActions.clearConsole
                        }, []))

                    ])
                );
            }
        }
        componentWillUnmount(){
            this.props.btnActions.doClear();
            document.body.classList.remove('debugViewBody');
        }
        render() {
            const {isDebug} = this.props;
            return (
                h(Layout, {
                    id: 'container',
                    className: 'debugView',
                    style: {
                        height: '100%'
                    },
                    children: [
                        h(Sider, {
                            id: 'leftSider',
                            width: 300,
                        }, [
                            h(Content, {
                                style: {
                                    height: '100%'
                                }
                            }, [
                                h(Tabs, {
                                    type: 'card',
                                    tabPosition: 'bottom',
                                    defaultActiveKey: 'inputs'
                                }, [
                                    h(TabPane, { tab:I18n.resource.debug.INPUT, key: 'inputs' }, [
                                        isDebug?h(DebugParamsPanel,{selectedValueId:this.props.selectedValueId}):undefined
                                    ])
                                ])
                            ])
                        ]),
                        h(Content, {
                            style: {
                                padding: '0 5px'
                            }
                        }, [
                            this.getCenterComponent()
                        ]),
                        h(Sider, {
                            id: 'rightSider',
                            width: 350
                        }, [
                            h(Content, {
                                style: {
                                    height: '100%'
                                }
                            }, h(Tabs, {
                                    type: 'card',
                                    animated:false,
                                    defaultActiveKey: 'watch'
                                }, [
                                    h(TabPane, {
                                        tab: I18n.resource.debug.WATCH,
                                        key: 'watch',
                                        style: {
                                            padding: '0 8px'
                                        }
                                    }, [
                                        isDebug?h(DebugWatchPanel):undefined
                                    ]),
                                    h(TabPane, { tab: I18n.resource.debug.DATA_SOURCE, key: 'dataSource' }, [h(DataSourcePanel,{isDetach:AppConfig.datasource?true:false})])
                                ])
                            )
                        ])
                    ]
                })
            );
        }
    }

    function DebugView(props, context) {
        const {
            // props
            strategy,
            modules,
            bShowConfigPanel,
            consoleInfo,
            debugValue,
            selectedPutsId,
            selectedPutId,
            runResult,
            selectedValueId,
            dbClickPut,
            isDebug,
            // actions
            doBack,
            doRun,
            doClear,
            moduleMouseOver,
            moduleMouseOut,
            moduleMouseEnter,
            moduleMouseLeave,
            inputMouseEnter,
            inputMouseLeave,
            outputMouseEnter,
            outputMouseLeave,
            putMouseOver,
            putMouseOut,
            stageMouseDown,
            stageMouseUp,
            stageWheel,
            setDebugValue,
            clearConsole,
            closeValueModal,
        } = props;
        var selectedIds = [];
        
        return (
            h(DebugPanel, {
                strategy,
                modules,
                bShowConfigPanel,
                selectedIds,
                debugValue,
                consoleInfo,
                selectedPutsId,
                selectedPutId,
                runResult,
                selectedValueId,
                dbClickPut,
                isDebug,
                btnActions: {
                    doBack,
                    doRun,
                    doClear,
                    clearConsole,
                    closeValueModal,
                },
                inputActions: {
                    inputMouseEnter,
                    inputMouseLeave,
                    putMouseOver,
                    putMouseOut,
                },
                outputActions: {
                    outputMouseEnter,
                    outputMouseLeave,
                },
                moduleActions: {
                    moduleMouseOver,
                    moduleMouseOut,
                    moduleMouseEnter,
                    moduleMouseLeave,
                },
                stageActions: {
                    stageMouseDown,
                    stageMouseUp,
                    stageWheel
                },
                setDebugValue
            })
        ); // end of return  
    }

    exports.DebugView = DebugView;
}));
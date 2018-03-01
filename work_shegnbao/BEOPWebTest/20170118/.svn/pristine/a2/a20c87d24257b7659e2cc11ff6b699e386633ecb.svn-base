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
            namespace('beop.strategy.core.constants')
        );
    }
}(namespace('beop.strategy.reducers'), function(exports, constants) {

    exports.painterReducer = {
        create: function(present) {
            return function(action) {
                switch (action.type) {
                    case constants.toolbar.EXIT_STRATEGY:
                        present({
                            openStrategy: null
                        });
                        break;
                    //转到画板
                    case constants.painter.CLOSR_CONFIG_PANEL:
                        present({
                            modalConfigPanel: {
                                configModuleId: null
                            }
                        });
                        break;
                        //保存配置
                    case constants.painter.CONFIG_PANEL_SAVE_AND_CLOSE:
                        present({
                            configPanelSave: action.module
                        });
                        break;
                    case constants.modal.SHOW_MODAL:
                        present({
                            modal: {
                                type: action.modalType,
                                props: action.props
                            }
                        });
                        break;
                    case constants.modal.HIDE_MODAL:
                        present({
                            modal: {
                                type: null,
                                props: {}
                            }
                        });
                        break;
                    case constants.modal.CHANGE_STRATEGY_VALUE:
                        present({
                            changeConfigVal: {
                                type: action.modalType,
                                props: action.props
                            }
                        });
                        break;
                    case constants.painter.ADD_MODULE:
                        present({
                            addModule: action.value
                        });
                        break;
                    case constants.painter.SHOW_CONFIG_PANEL:
                        present({
                            modalConfigPanel: {
                                configModuleId: action.moduleId
                            }
                        });
                        break;
                    case constants.painter.SELECTED_PROPS:
                        present({
                            selectedModuleIds: action.value,
                            newActiveSiderIndex: 2
                        });
                        break;
                    case constants.painter.UPDATE_LOC:
                        present({
                            updateLoc: action.value
                        });
                        break;
                    case constants.painter.MERGE_INPUT_OUTPUT:
                        present({
                            mergeInputOutput: action.value
                        });
                        break;
                    case constants.modulePropPanel.CHANGE_SELECTEDMODULES_PROPS:
                        present({
                            modal: {
                                type: action.modalType,
                                props: action.props
                            },
                            selectedModuleItems: action.props
                        });
                        break;
                    case constants.painter.REMOVE_MODEULE:
                        present({
                            removeModuleId: action.value
                        });
                        break;
                    case constants.painter.CHANGE_INPUT_DS:
                        present({
                            changeInputDs: action.value
                        });
                        break;
                    case constants.painter.CHANGE_ACTIVE_SIDER_INDEX:
                        present({
                            newActiveSiderIndex: action.idx
                        });
                        break;
                    default:
                        break;
                }
            };
        }
    }
}));
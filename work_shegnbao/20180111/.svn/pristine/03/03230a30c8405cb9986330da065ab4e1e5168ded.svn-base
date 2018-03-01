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
            namespace('ReactRedux'),
            namespace('antd')
        );
    }
}(namespace('beop.strategy.modules.StrategyTable'), function(
    exports,
    ReactRedux,
    antd
) {

    const {  Modal, Button, message } = antd;
    const confirm = Modal.confirm;

    var deepClone = $.extend.bind($, true);
    let firstSelectedId = undefined;
    // ------------------------------------
    // Constants
    // ------------------------------------
    var REMOVE_SELECTED_ITEMS = 'REMOVE_SELECTED_ITEMS';
    var CHANGE_SEARCH_FIELD = 'CHANGE_SEARCH_FIELD';
    var ENABLE_STRATEGIES = 'ENABLE_STRATEGIES';
    var DISABLE_STRATEGIES = 'DISABLE_STRATEGIES';
    var SELECT_ROWS = 'SELECT_ROWS';
    var RELOAD_STRATEGY_TABLE = 'RELOAD_STRATEGY_TABLE';
    var STRATEGYTABLE_SHOW_CONFIG_MODAL = 'STRATEGYTABLE_SHOW_CONFIG_MODAL';
    var STRATEGYTABLE_HIDE_CONFIG_MODAL = 'STRATEGYTABLE_HIDE_CONFIG_MODAL';
    var STRATEGY_SHOW_SUPPLEMENT_MODAL = 'STRATEGY_SHOW_SUPPLEMENT_MODAL';
    var STRATEGY_HIDE_SUPPLEMENT_MODAL = 'STRATEGY_HIDE_SUPPLEMENT_MODAL';
    var STRATEGYTABLE_CHANGE_SPINNER = 'STRATEGYTABLE_CHANGE_SPINNER';
    // ------------------------------------
    // Actions
    // ------------------------------------
    var doAdd = function(nodeId) {
        return function(dispatch) {
            var newData = {
                '_id': ObjectId(),
                'nodeId': nodeId,
                'projId': AppConfig.projectId,
                'name': 'Untitled',
                'desc': I18n.resource.propTree.DESC,
                'userId': AppConfig.userId,
                'lastTime': (new Date()).format('yyyy-MM-dd hh:mm:ss'),
                'keywords': [],
                'type': 2,
                'trigger': [{
                    options:{
                        step: 1,
                        time: "00:00"
                    },
                    type: "day"
                }],
                option:{
                    config:{
                        "cycle":300,
                        "Building":"",
                        "SubBuilding":"",
                        "EquipmentName":"",
                        "Category":""
                    }
                },
                'lastRuntime': (new Date()).format('yyyy-MM-dd hh:mm:ss'),
                'status': 0,
                'value': [{
                    _id: ObjectId(),
                    list: {},
                    isDefault: true,
                    name: 'Default'
                }]
            };
            dispatch({
                type: STRATEGYTABLE_CHANGE_SPINNER,
                visible: true
            });

            WebAPI.post('/strategy/item/save', {
                userId: AppConfig.userId,
                data: newData,
                projId: AppConfig.projectId
            }).done(function(result) {
                var equipTreeActions;
                if (result.status === 'OK') {
                    equipTreeActions = namespace('beop.strategy.modules.EquipTree.actions');
                    dispatch(equipTreeActions.addItems(
                        Object.assign({
                            userFullName: AppConfig.userProfile.fullname
                        }, newData),
                        nodeId
                    ));
                    message.success(I18n.resource.message.NEW_SUCCESS);
                } else {
                    message.error(I18n.resource.message.NEW_FAIL);
                }
            }).fail(function() {
                message.warning(I18n.resource.message.NETWORK_FAIL);
            }).always(function(){
                dispatch({
                    type: STRATEGYTABLE_CHANGE_SPINNER,
                    visible: false
                });
            });
        };
    };
    var doRemove = function(selectedIds) {
        return function (dispatch) {
            confirm({
                title: I18n.resource.title.PROMPT,
                content: I18n.resource.title.CONFIRM_DELETE_STRATEGY,
                okText: I18n.resource.modal.OK,
                cancelText: I18n.resource.modal.CANCEL,
                onOk() {
                    dispatch({
                        type: STRATEGYTABLE_CHANGE_SPINNER,
                        visible: true
                    });
                    WebAPI.post('/strategy/item/remove', {
                        userId: AppConfig.userId,
                        ids: selectedIds,
                        projId: AppConfig.projectId
                    }).done(function(result) {
                        var equipTreeActions;
                        if (result.status === 'OK') {
                            message.success(I18n.resource.message.DELETE_SUCCESS);
                            equipTreeActions = namespace('beop.strategy.modules.EquipTree.actions');
                            dispatch({
                                type: SELECT_ROWS,
                                selectedIds: []
                            });
                            dispatch(equipTreeActions.removeItems(selectedIds));
                        } else {
                            message.error(I18n.resource.message.DELETE_FAIL);
                        }
                    }).fail(function() {
                        message.warning(I18n.resource.message.NETWORK_FAIL);
                    }).always(function(){
                        dispatch({
                            type: STRATEGYTABLE_CHANGE_SPINNER,
                            visible: false
                        });
                    });
                },
                onCancel() {
                }
            });
        }
    };
    var changeSearchField = function(value) {
        return {
            type: CHANGE_SEARCH_FIELD,
            value: value
        };
    };
    var doEnable = function(ids) {
        return function(dispatch) {
            WebAPI.post('/strategy/item/save', {
                userId: AppConfig.userId,
                ids: ids,
                data: {
                    'status': 1
                },
                projId: AppConfig.projectId
            }).done(function(result) {
                var equipTreeActions;
                if (result.status === 'OK') {
                    message.success(I18n.resource.message.ENABLE_SUCCESS);
                    equipTreeActions = namespace('beop.strategy.modules.EquipTree.actions');
                    dispatch(equipTreeActions.enableItems(ids));
                } else {
                    message.error(I18n.resource.message.ENABLE_FAIL);
                }
            }).fail(function() {
                message.warning(I18n.resource.message.NETWORK_FAIL);
            });
        }
    };
    var doDisable = function(ids) {
        return function(dispatch) {
            WebAPI.post('/strategy/item/save', {
                userId: AppConfig.userId,
                ids: ids,
                data: {
                    'status': 0
                },
                projId: AppConfig.projectId
            }).done(function(result) {
                var equipTreeActions;
                if (result.status === 'OK') {
                    message.success(I18n.resource.message.DISABLE_SUCCESS);
                    equipTreeActions = namespace('beop.strategy.modules.EquipTree.actions');
                    dispatch(equipTreeActions.disableItems(ids));
                } else {
                    message.error(I18n.resource.message.DISABLE_FAIL);
                }
            }).fail(function() {
                message.warning(I18n.resource.message.NETWORK_FAIL);
            });
        }
    };
    var doUpdate = function(ids, data) {
        return function(dispatch) {
            var actions = namespace('beop.strategy.modules.EquipTree.actions');
            dispatch(actions.updateItems(ids, data));
        };
    };
    var selectRows = function(_id, selectedIds,itemIds, ctrlKey, shiftKey) {
        var idx = selectedIds.indexOf(_id);
        if(ctrlKey && shiftKey){
            if(selectedIds.length>0){
                let firstIndex = itemIds.findIndex(itemId=>itemId==firstSelectedId),
                    lastIndex = itemIds.findIndex(itemId=>itemId==_id);
                selectedIds = selectedIds.concat(itemIds.slice(Math.min(firstIndex,lastIndex),Math.max(firstIndex,lastIndex)+1));
            }
        }else if (ctrlKey) {
            if (idx > -1) {
                selectedIds.splice(idx, 1);
                if(selectedIds.length==0){
                    firstSelectedId = undefined;
                }
            } else {
                selectedIds.push(_id);
                firstSelectedId = _id;
            }
        }else if(shiftKey){
            if(selectedIds.length==0){
                selectedIds.push(_id);
                firstSelectedId = _id;
            }else if(selectedIds.length==1&&idx>-1){
                selectedIds.splice(idx, 1);
                firstSelectedId = undefined;
            }else{ 
                let firstIndex = itemIds.findIndex(itemId=>itemId==firstSelectedId),
                    lastIndex = itemIds.findIndex(itemId=>itemId==_id);
                selectedIds = itemIds.slice(Math.min(firstIndex,lastIndex),Math.max(firstIndex,lastIndex)+1);
            }
        } else {
            selectedIds = [_id];
            firstSelectedId = _id;
        }

        return function(dispatch, getState) {
            var actions = namespace('beop.strategy.modules.PropPanel.actions');

            dispatch({
                type: SELECT_ROWS,
                selectedIds: selectedIds
            });
            dispatch(actions.recoverProp());
        }
    };
    var reload = function() {
        return {
            type: RELOAD_STRATEGY_TABLE
        };
    };
    var doOpen = function (id) {
        history.pushState(null, '策略组态 - 编辑', '/strategy/painter/' + id);
    };

    var showProjConfigModal = function(){
        return {
            type: STRATEGYTABLE_SHOW_CONFIG_MODAL
        };
    };

    var hideProjConfigModal = function(){
        return {
            type: STRATEGYTABLE_HIDE_CONFIG_MODAL
        };
    };

    var showSupplementModal = function(){
        return {
            type: STRATEGY_SHOW_SUPPLEMENT_MODAL
        };
    };

    var hideSupplementModal = function(){
        return {
            type: STRATEGY_HIDE_SUPPLEMENT_MODAL
        };
    };
    var showUpdateDiagnosis = function(ids){
        return function(dispatch){
            confirm({
                title: I18n.resource.title.PROMPT,
                content: I18n.resource.title.CONFIRM_UPDATE_TABLE,
                okText: I18n.resource.modal.OK,
                cancelText: I18n.resource.modal.CANCEL,
                onOk() {
                    WebAPI.post('/strategy/updateDiagnosis', {
                        strategyIdList: ids,
                        projId: AppConfig.projectId
                    }).done(function(result) {
                        if(result.data.update === 'True' && result.data.create === 'True'){
                            message.success(I18n.resource.message.UPDATE_SUCCESS);
                        }else{
                            message.error(I18n.resource.message.UPDATE_FAIL);
                        }
                    }).fail(function() {
                        message.warning(I18n.resource.message.NETWORK_FAIL);
                    });
                },
                onCancel() {
                }
            });
        }
    };

    // 需要暴露给外部调用的 action
    exports.actions = {
        doAdd,
        doRemove,
        changeSearchField,
        doEnable,
        doDisable,
        selectRows,
        reload,
        doUpdate,
        doOpen,
        showProjConfigModal,
        hideProjConfigModal,
        showSupplementModal,
        hideSupplementModal,
        showUpdateDiagnosis
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [CHANGE_SEARCH_FIELD]: (state, action) => {
            return Object.assign({}, state, { searchKey: action.value });
        },
        [SELECT_ROWS]: (state, action) => {
            return Object.assign({}, state, { selectedIds: action.selectedIds });
        },
        [RELOAD_STRATEGY_TABLE]: (state, action) => {
            return Object.assign({}, state);
        },
        [STRATEGYTABLE_SHOW_CONFIG_MODAL]: (state, action) => {
            return Object.assign({},state, {
                isShowStrategyConfigModal: true
            });
        },
        [STRATEGYTABLE_HIDE_CONFIG_MODAL]: (state, action) => {
            return Object.assign({},state, {
                isShowStrategyConfigModal: false
            });
        },
        [STRATEGY_SHOW_SUPPLEMENT_MODAL]:(state, action) => {
            return Object.assign({},state, {
                isShowStrategySupplementModal: true
            });
        },
        [STRATEGY_HIDE_SUPPLEMENT_MODAL]:(state, action) => {
            return Object.assign({},state, {
                isShowStrategySupplementModal: false
            });
        },
        [STRATEGYTABLE_CHANGE_SPINNER]:(state, action) => {
            return Object.assign({},state, {
                bShowSpin: action.visible
            });
        }
    };

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        searchKey: '',
        selectedIds: [],
        isShowStrategyConfigModal: false,
        isShowStrategySupplementModal: false,
        bShowSpin: false
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
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
            namespace('ReactRedux'),
            namespace('beop.strategy.common'),
            namespace('antd')
        );
    }
}(namespace('beop.strategy.modules.PropPanel'), function(
    exports,
    ReactRedux,
    commonUtil,
    antd
) {

    const deepClone = $.extend.bind($, true);
    const {message } = antd;

    // ------------------------------------
    // Constants
    // ------------------------------------
    const CHANGE_PROP = 'CHANGE_PROP';
    const CHANGE_TRIGGER = 'CHANGE_TRIGGER';
    const SHOW_EDIT_TRIGGER_MODAL = 'SHOW_EDIT_TRIGGER_MODAL';
    const HIDE_EDIT_TRIGGER_MODAL = 'HIDE_EDIT_TRIGGER_MODAL';
    const SAVE_PROP = 'SAVE_PROP';
    const RECOVER_PROP = 'RECOVER_PROP';
    const RESET_PROP_PANEL = 'RESET_PROP_PANEL';
    const PROPpANEL_SHOW_CONFIG_MODAL = 'PROPpANEL_SHOW_CONFIG_MODAL';
    const PROPpANEL_HIDE_CONFIG_MODAL = 'PROPpANEL_HIDE_CONFIG_MODAL';
    const PROPpANEL_UPDATE_CONFIG_MODAL = 'PROPpANEL_UPDATE_CONFIG_MODAL';
    const PROPpANEL_BTN_LOADING = 'PROPpANEL_BTN_LOADING';

    // ------------------------------------
    // Actions
    // ------------------------------------
    var changeProp = function(key, value) {
        return {
            type: CHANGE_PROP,
            key: key,
            value: value
        };
    };
    var changeTrigger = function (key, value) {
        return {
            type: CHANGE_TRIGGER,
            key: key,
            value: value
        };
    };

    var editTrigger = function(data){
        return {
            type: SHOW_EDIT_TRIGGER_MODAL,
            data: data
        }
    };

    var hideStrategyTriggerModal = function(){
        return {
            type: HIDE_EDIT_TRIGGER_MODAL
        };
    };
    var saveStrategyTriggerModal = function(data){
        return {
            type: CHANGE_PROP,
            key: "trigger",
            value: [data]
        };
    };

    var recoverProp = function() {
        return function (dispatch, getState) {
            var state = getState();
            var selectedIds = state.strategyTable.selectedIds;
            var items = commonUtil.toFlatArray(state.equipTree.items).filter(
                (row) => ( selectedIds.indexOf(row._id) > -1 )
            );
            var data = null;

            if (items.length > 0) {
                data = (function () {
                    var mergeObj = {};

                    if (items.length === 1) {
                        var item = deepClone({}, items[0]);
                        [
                            'name', 'status', 'type', 'level', 'desc', 'trigger', 'option',
                            'nodeName', 'lastRuntime', 'lastTime', 'userFullName'
                        ].forEach(row => {
                            mergeObj[row] = item[row];
                        });
                        return mergeObj;
                    }

                    ['name', 'status', 'type', 'desc'].forEach(function (key) {
                        var firstItemValue = items[0][key];
                        var flag = true;
                        for (var i = 1, len = items.length; i < len; i++) {
                            if (items[i][key] !== firstItemValue) {
                                flag = false;
                                break;
                            }
                        }
                        mergeObj[key] = flag ? firstItemValue : '';
                    });
                    ['trigger'].forEach(function(key){
                        var firstItemValue = items[0][key];
                        var flag = true;

                        for(var i = 1, len = items.length; i < len; i++){
                            if(items[i][key] && items[i][key].length > 0){
                                items[i][key].some(function(item,index){
                                    if (!firstItemValue[index] || item["type"] !== firstItemValue[index]["type"]){
                                        flag = false;
                                        return true;
                                    } else {
                                        if(!firstItemValue[index] || item["options"]["time"] !== firstItemValue[index]["options"]["time"]){
                                            flag = false;
                                            return true;
                                        }
                                    }
                                });
                            }else{
                                if(items[i][key] !== firstItemValue){
                                    flag = false;
                                }
                            }
                        }
                        mergeObj[key] = flag ? firstItemValue : [];
                    });
                    return mergeObj;
                } ());
            }
            
            dispatch({
                type: RECOVER_PROP,
                data: data,
            });
        }
    };

    var doSave = function() {
        return function (dispatch, getState) {
            var state = getState();
            var data = state.propPanel.data;
            //var datePattern = /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/;
            //var isDate = true;
            //data.trigger.some(function(row){
            //    isDate = datePattern.test(row.options.time);
            //    if(!isDate){
            //        return true;
            //    }
            //});
            //if(!isDate){
            //    message.warning(I18n.resource.message.CORRECT_TIME);
            //    return;
            //}
            var selectedIds = state.strategyTable.selectedIds;
            dispatch({
                type: PROPpANEL_BTN_LOADING,
                visible: true
            });

            WebAPI.post('/strategy/item/save', {
                userId: AppConfig.userId,
                ids: selectedIds,
                data: data,
                projId: AppConfig.projectId
            }).done(function(result) {
                var actions;
                if (result.status === 'OK') {
                    actions = namespace('beop.strategy.modules.StrategyTable.actions');
                    dispatch(actions.doUpdate(selectedIds, data));
                    message.success(I18n.resource.message.SAVE_SUCCESS);
                } else {
                    message.error(I18n.resource.message.FAIL_SAVE);
                }
            }).always(function(){
                dispatch({
                    type: PROPpANEL_BTN_LOADING,
                    visible: false
                });
            });
        };
    };
    var reset = function() {
        return {
            type: RESET_PROP_PANEL
        };
    };

    var showStrategyConfigModal = function(){
        return {
            type: PROPpANEL_SHOW_CONFIG_MODAL
        };
    }

    var hideStrategyConfigModal = function(){
        return {
            type: PROPpANEL_HIDE_CONFIG_MODAL
        }
    }

    var updateStrategyConfigModal = function(){
        return function (dispatch, getState) {
            var state = getState();
            var selectedIds = state.strategyTable.selectedIds;
            var items = commonUtil.toFlatArray(state.equipTree.items).filter(
                (row) => ( selectedIds.indexOf(row._id) > -1 )
            );
            dispatch({
                type: PROPpANEL_UPDATE_CONFIG_MODAL,
                data: items
            });
        }
    }

    // 需要暴露给外部调用的 action
    exports.actions = {
        changeProp,
        changeTrigger,
        editTrigger,
        hideStrategyTriggerModal,
        saveStrategyTriggerModal,
        recoverProp,
        doSave,
        reset,
        showStrategyConfigModal,
        hideStrategyConfigModal,
        updateStrategyConfigModal        
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [CHANGE_PROP]: (state, action) => {
            var state = deepClone({}, state);
            if (action.key in state.data) {
                state.data[action.key] = action.value;
            }
            return state;
        },
        [CHANGE_TRIGGER]:(state, action) => {
            var state = deepClone({}, state);
            var trigger = [];
            action.value.trim().split('|').forEach(function(row){
                var obj = {
                    type:'day',
                    options:{
                        time:row,
                        step:1
                    }
                };
                trigger.push(obj);

            });
            state.data[action.key] = trigger;

            return state;
        },
        [SHOW_EDIT_TRIGGER_MODAL]: (state, action) => {
            return Object.assign({}, state, { triggerData: deepClone({}, action.data),isShowStrategyTriggerModal: true});
        },
        [HIDE_EDIT_TRIGGER_MODAL]: (state, action) => {
            return Object.assign({}, state, { isShowStrategyTriggerModal: false });
        },
        [RECOVER_PROP]: (state, action) => {

            return Object.assign({}, state, { data: !action.data ? action.data : deepClone({}, action.data)});
        },
        [RESET_PROP_PANEL]: (state) => {
            return initialState;
        },
        [PROPpANEL_SHOW_CONFIG_MODAL]: (state)=>{
            return Object.assign({}, state, { isShowStrategyConfigModal: true });
        },
        [PROPpANEL_HIDE_CONFIG_MODAL]: (state)=>{
            return Object.assign({}, state, { isShowStrategyConfigModal: false });
        },
        [PROPpANEL_UPDATE_CONFIG_MODAL]: (state, action)=>{
            state =  Object.assign({}, state);
            if(action.data[0] && action.data[0].option){
                Object.assign(state.data.option, action.data[0].option);
            }
            return state;
        },
        [PROPpANEL_BTN_LOADING]: (state, action)=>{
            return Object.assign({}, state, { btnLoading: action.visible });
        }
    }

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        data: null,
        triggerData: null,
        isShowStrategyConfigModal: false,
        isShowStrategyTriggerModal: false,
        btnLoading: false
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
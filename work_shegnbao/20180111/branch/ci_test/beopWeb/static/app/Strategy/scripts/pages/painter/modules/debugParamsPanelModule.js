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
            namespace('beop.strategy.common')
        );
    }
}(namespace('beop.strategy.modules.DebugParamsPanel'), function(
    exports,
    ReactRedux,
    commonUtil
) {

    const deepClone = $.extend.bind($, true);

    // ------------------------------------
    // Constants
    // ------------------------------------
    const CHANGE_SELECT_ID = 'DebugParamsPanel.CHANGE_SELECT_ID';

    // ------------------------------------
    // Actions
    // ------------------------------------
    const handleSelect = function (id) {
        return function (dispatch, getState) {
            let state = getState().sketchpad;
            let modules = state.modules;
            let strategy = state.strategy;
            let value;

            if (id === 'default') {
                value = commonUtil.getStrategyDefaultInputValue(modules);
            } else {
                value = commonUtil.getStrategyValueById(strategy.value, id);
            }

            if (value) {
                dispatch([{
                    type: CHANGE_SELECT_ID,
                    selectedId: id
                },namespace('beop.strategy.modules.DebugView.actions').setDebugValue(value.list)]);
            }
        };
    }

    // 需要暴露给外部调用的 action
    exports.actions = {
        handleSelect
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [CHANGE_SELECT_ID]: (state, action) => {
            return Object.assign({}, state, { selectedId: action.selectedId });
        }
    }

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        selectedId: null
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
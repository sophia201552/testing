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
}(namespace('beop.strategy.modules.DebugWatchPanel'), function(
    exports,
    ReactRedux,
    commonUtil
) {

    const deepClone = $.extend.bind($, true);

    // ------------------------------------
    // Constants
    // ------------------------------------
    const CHANGE_SELECT_ID = 'DebugWatchPanel.CHANGE_SELECT_ID';

    // ------------------------------------
    // Actions
    // ------------------------------------

    // 需要暴露给外部调用的 action
    exports.actions = {
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
    }

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
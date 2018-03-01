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
}(namespace('beop.strategy.modules.Painter'), function(
    exports,
    ReactRedux,
    commonUtil
) {

    const deepClone = $.extend.bind($, true);

    // ------------------------------------
    // Constants
    // ------------------------------------
    const TOGGLE_MODULE_CONFIG_PANEL = 'TOGGLE_MODULE_CONFIG_PANEL';
    const TOGGLE_MODULE_DEBUG_PANEL = 'TOGGLE_MODULE_DEBUG_PANEL';
    const PAINTER_SHOW_SPIN = 'PAINTER_SHOW_SPIN';

    // ------------------------------------
    // Actions
    // ------------------------------------
    const toggleModuleConfigPanel = function() {
        return {
            type: TOGGLE_MODULE_CONFIG_PANEL
        };
    };
    const toggleModuleDebugPanel = function() {
        return {
            type: TOGGLE_MODULE_DEBUG_PANEL
        };
    };
    const toggleSpin = function() {
        return {
            type: PAINTER_SHOW_SPIN
        };
    };

    // 需要暴露给外部调用的 action
    exports.actions = {
        toggleModuleConfigPanel,
        toggleModuleDebugPanel,
        toggleSpin
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [TOGGLE_MODULE_CONFIG_PANEL]: (state) => {
            return Object.assign({}, state, { bShowConfigPanel: !state.bShowConfigPanel });
        },
        [TOGGLE_MODULE_DEBUG_PANEL]: (state) => {
            state = deepClone({}, state);
            state.bShowDebugPanel = !state.bShowDebugPanel;
            return state;
        },
        [PAINTER_SHOW_SPIN]: (state)=>{
            state = deepClone({}, state);
            state.bShowSpin = !state.bShowSpin;
            return state;
        }
    };

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        bShowConfigPanel: false,
        bShowDebugPanel: false,
        bShowSpin:false
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
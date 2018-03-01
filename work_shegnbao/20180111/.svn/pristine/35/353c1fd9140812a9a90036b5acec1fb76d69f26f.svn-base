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
}(namespace('beop.strategy.modules.ModuleConfigPanel'), function(
    exports,
    ReactRedux,
    commonUtil
) {

    const deepClone = $.extend.bind($, true);

    // ------------------------------------
    // Constants
    // ------------------------------------
    const SET_MODULE_CONFIG_PANEL = 'SET_MODULE_CONFIG_PANEL';

    // ------------------------------------
    // Actions
    // ------------------------------------
    const showModuleConfigPanel = function(moduleId) {
        return function(dispatch, getState) {
            var state = getState();
            var module;
            var actions = namespace('beop.strategy.modules.Painter.actions');

            state.sketchpad.modules.some(function(row) {
                if (row._id === moduleId) {
                    module = row;
                    return true;
                }
            });

            dispatch([{
                type: SET_MODULE_CONFIG_PANEL,
                data: {
                    type: module.type,
                    props: {
                        moduleId: moduleId,
                        module: module,
                        modules: state.sketchpad.modules
                    }
                }
            }, actions.toggleModuleConfigPanel()]);
        };
    };

    const hideModuleConfigPanel = function() {
        var actions = namespace('beop.strategy.modules.Painter.actions');
        var sketchpadActions = namespace('beop.strategy.modules.Sketchpad.actions');
        return [{
            type: SET_MODULE_CONFIG_PANEL,
            data: {
                type: null,
                props: {}
            }
        }, actions.toggleModuleConfigPanel(), sketchpadActions.reload()];
    };

    const doOk = function(moduleId, data) {
        return function (dispatch) {
            var sketchpadActions = namespace('beop.strategy.modules.Sketchpad.actions');
            var painterActions = namespace('beop.strategy.modules.Painter.actions');

            dispatch([
                sketchpadActions.updateModule(moduleId, data),
                ...hideModuleConfigPanel()
            ]);

            dispatch(sketchpadActions.syncStrategyValue());
        };
    };

    const saveInputOutputData = function(moduleId,type,data){
        return function (dispatch, getState){
            var sketchpadActions = namespace('beop.strategy.modules.Sketchpad.actions');
            var state = getState();
            var module;
            state.sketchpad.modules.some(function(row) {
                if (row._id === moduleId) {
                    module = row;
                    return true;
                }
            });
            var newData = deepClone({},module);
            newData.option[type] = data;
            state.painter.bShowConfigPanel = false;
            dispatch([
                sketchpadActions.updateModule(moduleId, newData.option)
            ]);
            dispatch(showModuleConfigPanel(moduleId));
        }
    };


    // 需要暴露给外部调用的 action
    exports.actions = {
        showModuleConfigPanel,
        hideModuleConfigPanel,
        doOk,
        saveInputOutputData

    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [SET_MODULE_CONFIG_PANEL]: (state, action) => {
            return Object.assign({}, state, action.data);
        }
    }

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        type: null,
        props: {},
        modal: {
            type: null,
            props: {}
        }
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
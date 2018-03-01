/**
 * redux 扩展 - 支持组合的 action
 * @author Peter peter.zhao@rnbtech.com.hk
 */

;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(window, function(exports) {

    function multipleActionsEnhanceReducer(reducer) {
        return (state, action) => {
            if (action.actions && action.actions.type && action.actions instanceof Array) {
                state = action.actions.reduce(reducer, state);
            } else {
                state = reducer(state, action);
            }

            return state;
        };
    }

    function multipleActionsEnhanceDispatch(dispatch) {
        return (action) => {
            var multipleAction;

            if (action instanceof Array) {
                if (action.type === undefined) {
                    action.type = action.map((a) => {
                        // 兼容一下 redux-thunk
                        if (typeof a === 'function') {
                            throw new Error('Redux: Multi actions combine only support sync actions.');
                        }
                        return a.type;
                    }).join(' => ');
                }

                multipleAction = {
                    type: action.type,
                    actions: action
                };
            }

            return dispatch(multipleAction || action);
        };
    }

    exports.ReduxMultipleActionsEnhancer = function() {
        return (next) => (reducer, preloadedState) => {
            var store = next(multipleActionsEnhanceReducer(reducer), preloadedState);
            store.dispatch = multipleActionsEnhanceDispatch(store.dispatch);
            return store;
        };
    }
}));
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
            namespace('beop.strategy.common')
        );
    }
}(namespace('beop.strategy.modules.StrategyNav'), function(
    exports,
    ReactRedux,
    commonUtil
) {
    const deepClone = $.extend.bind($, true);
    // ------------------------------------
    // Constants
    // ------------------------------------

    
    // ------------------------------------
    // Actions
    // ------------------------------------
    var changeLanguage = function(value){
        AppConfig.language = value;
        localStorage["language"] = AppConfig.language;
        InitI18nResource(value, true).always(function (rs) {
            I18n = new Internationalization(null, rs);
            window.location.reload();
        });
    }

    var backHome = function(){
        return function(dispatch, getState) {
            var sketchpadActions = namespace('beop.strategy.modules.Sketchpad').actions,
            DebugActions = namespace('beop.strategy.modules.DebugView').actions;
            var state = getState();
            if (state.painter.bShowDebugPanel) { //退出调试
                state.painter.bShowDebugPanel = false;
                dispatch(DebugActions.clear());
            } else {
                dispatch(sketchpadActions.clear());                
            }
            history.pushState(null, '策略组态 - 首页', '/strategy');
        }
    }

    var logout = function(){  
        return function(dispatch){
            WebAPI.get('/logout/' + AppConfig.userId).always(function () {
                AppConfig = {};
                localStorage.removeItem("userInfo");
                window.location.reload();
            });
        }       
    }

    // 需要暴露给外部调用的 action
    exports.actions = {
        changeLanguage,
        backHome,
        logout
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        
    };

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        language:"",
        user:{
            avatarSrc: null,
            name:null
        }
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
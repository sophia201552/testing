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
            namespace('beop.strategy.components.StrategyNav')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    StrategyNav
) {

    var mapDispatchToProps  = function (dispatch) {
        var actions = namespace('beop.strategy.modules.StrategyNav.actions');

        return {
            changeLanguage:function(type){
                if(AppConfig.language !== type){
                    dispatch(actions.changeLanguage(type));
                }                
            },
            backHome:function(){
                dispatch(actions.backHome());
            },
            logout: function(){
                dispatch(actions.logout());
            }
        };
    }

    var mapStateToProps = function (state) {
       
        return {
            language:AppConfig.language,
            user:{ 
                avatarSrc: AppConfig.userProfile.picture,
                name: AppConfig.userProfile.fullname || AppConfig.account
            }
        };
    }

    exports.StrategyNav = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(StrategyNav);
}));
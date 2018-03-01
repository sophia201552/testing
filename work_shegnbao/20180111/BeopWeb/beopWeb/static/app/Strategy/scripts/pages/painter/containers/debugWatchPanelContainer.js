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
            namespace('beop.strategy.common'),
            namespace('beop.strategy.components.DebugWatchPanel')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    commonUtil,
    DebugWatchPanel
) {

    var mapDispatchToProps = function(dispatch) {
        const debugViewActions = namespace('beop.strategy.modules.DebugView.actions');
        const watchSelected = ids=>{
            dispatch(debugViewActions.selectedPuts(ids));
        };
        const watchDbClick = (id)=>{
            dispatch(debugViewActions.dbClickPuts(id));
        };
        const watchMouseEnterLeave = (id)=>{
            dispatch(debugViewActions.selectedPut(id));
        };
        return {
            watchSelected,
            watchDbClick,
            watchMouseEnterLeave,
        };
    }

    var mapStateToProps = function(state) {
        const {sketchpad,debugView} = state;
        return {
            strategy: state.sketchpad.strategy,
            modules: sketchpad.modules,
            runResult: debugView.runResult,
        };
    }

    exports.DebugWatchPanel = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(DebugWatchPanel);
}));
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
            namespace('beop.strategy.components.Painter')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    commonUtil,
    Painter
) {

    var mapDispatchToProps = function(dispatch) {
        return {};
    }

    var mapStateToProps = function(state) {
        return {
            bShowConfigPanel: state.painter.bShowConfigPanel,
            bShowDebugPanel: state.painter.bShowDebugPanel,
            bShowSpin: state.painter.bShowSpin
        };
    }

    exports.Painter = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Painter);
}));
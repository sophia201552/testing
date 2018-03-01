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
            namespace('beop.strategy.components.DebugParamsPanel')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    commonUtil,
    DebugParamsPanel
) {

    var mapDispatchToProps = function(dispatch) {
        var actions = namespace('beop.strategy.modules.DebugParamsPanel.actions');

        return {
            handleSelect: function (key) {
                dispatch(actions.handleSelect(key));
            }
        };
    }

    var mapStateToProps = function(state) {
        var sketchpad = state.sketchpad;

        return {
            value: sketchpad.strategy && sketchpad.strategy.value || [],
            modules: sketchpad.modules,
            selectedId: state.debugParamsPanel.selectedId
        };
    }

    exports.DebugParamsPanel = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(DebugParamsPanel);
}));
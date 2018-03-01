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
            namespace('beop.strategy.components.ModuleConfigPanel')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    ModuleConfigPanel
) {
    var mapDispatchToProps = function(dispatch) {
        var actions = namespace('beop.strategy.modules.ModuleConfigPanel.actions');

        return {
            doOk: function (moduleId, data) {
                dispatch(actions.doOk(moduleId, data));
            },
            doCancel: function () {
                dispatch(actions.hideModuleConfigPanel());
            },
            saveInputOutputData: function (moduleId,type, data){
                dispatch(actions.saveInputOutputData(moduleId,type, data));
            }
        };
    }

    var mapStateToProps = function(state) {
        return {
            type: state.moduleConfigPanel.type,
            props: state.moduleConfigPanel.props,
            bShowConfigPanel: state.painter.bShowConfigPanel,
        };
    }

    exports.ModuleConfigPanel = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ModuleConfigPanel);
}));
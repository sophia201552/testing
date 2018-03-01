;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'Redux',
            'ReduxThunk'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('Redux'),
            require('ReduxThunk')
        );
    } else {
        factory(
            root,
            namespace('Redux'),
            namespace('ReduxThunk'),
            namespace('ReduxMultipleActionsEnhancer'),
            namespace('beop.strategy.modules.StrategyTable.reducer'),
            namespace('beop.strategy.modules.PropPanel.reducer'),
            namespace('beop.strategy.modules.DataSourcePanel.reducer'),
            namespace('beop.strategy.modules.RulePanel.reducer'),
            namespace('beop.strategy.modules.EquipTree.reducer'),
            namespace('beop.strategy.modules.Painter.reducer'),
            namespace('beop.strategy.modules.Sketchpad.reducer'),
            namespace('beop.strategy.modules.ModuleConfigPanel.reducer'),
            namespace('beop.strategy.modules.DebugParamsPanel.reducer'),
            namespace('beop.strategy.modules.DebugView.reducer'),
            namespace('beop.strategy.modules.ModulePropPanel.reducer'),
            namespace('beop.strategy.modules.modals.ParamsConfigModal.reducer'),
            namespace('beop.strategy.modules.FaultInfo.reducer')
        );
    }
}(namespace('beop.strategy.core'), function(
    exports,
    Redux,
    ReduxThunk,
    ReduxMultipleActionsEnhancer,
    strategyTableReducer,
    propPanelReducer,
    dataSourcePanelReducer,
    rulePanelReducer,
    equipTreeReducer,
    painterReducer,
    sketchpadReducer,
    moduleConfigPanelReducer,
    debugParamsPanelReducer,
    debugViewReducer,
    modulePropPanelReducer,
    paramsConfigModalReducer,
    faultInfoReducer
) {
    exports.store = Redux.createStore(Redux.combineReducers({
        strategyTable: strategyTableReducer,
        propPanel: propPanelReducer,
        dataSourcePanel: dataSourcePanelReducer,
        rulePanel: rulePanelReducer,
        equipTree: equipTreeReducer,
        painter: painterReducer,
        sketchpad: sketchpadReducer,
        moduleConfigPanel: moduleConfigPanelReducer,
        modal: Redux.combineReducers({
            paramsConfigModal: paramsConfigModalReducer
        }),
        debugParamsPanel: debugParamsPanelReducer,
        debugView: debugViewReducer,
        modulePropPanel: modulePropPanelReducer,
        faultInfo: faultInfoReducer
    }), Redux.compose(Redux.applyMiddleware(ReduxThunk.default), ReduxMultipleActionsEnhancer()));
}));

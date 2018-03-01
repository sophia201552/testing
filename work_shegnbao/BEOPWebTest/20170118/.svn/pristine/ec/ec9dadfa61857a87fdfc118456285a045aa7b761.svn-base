;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.core.constants'), function(
    exports
) {
    // 策略树的操作类型集合
    exports.equipTree = {
        // 取消/选中 "显示所有子策略" 复选按钮
        'TOGGLE_SHOW_ALL_STRATEGIES_BTN': 'TOGGLE_SHOW_ALL_STRATEGIES_BTN',
        'SELECT_TREE_NODE': 'SELECT_TREE_NODE',
        'ADD_SYNC_DATA': 'ADD_SYNC_DATA'
    };

    exports.strategyTable = {
        'ADD_ITEM': 'ADD_ITEM',
        'REMOVE_SELECTED_ITEMS': 'REMOVE_SELECTED_ITEMS',
        'CHANGE_SEARCH_FIELD': 'CHANGE_SEARCH_FIELD',
        'ENABLE_STRATEGIES': 'ENABLE_STRATEGIES',
        'DISABLE_STRATEGIES': 'DISABLE_STRATEGIES',
        'SELECT_ROWS': 'SELECT_ROWS',
        'OPEN_STRATEGY': 'OPEN_STRATEGY'
    };

    exports.propPanel = {
        'CHANGE_PROP': 'CHANGE_PROP',
        'SAVE_PROP': 'SAVE_PROP',
        'RECOVER_PROP': 'RECOVER_PROP'
    };
    exports.toolbar = {
        'EXIT_STRATEGY': 'EXIT_STRATEGY'
    };
    exports.painter = {
        'CONFIG_SAVE': 'CONFIG_SAVE',
        'ADD_MODULE': 'ADD_MODULE',
        'SELECTED_PROPS': 'SELECTED_PROPS',
        'UPDATE_LOC': 'UPDATE_LOC',
        'SHOW_CONFIG_PANEL': 'SHOW_CONFIG_PANEL',
        'CLOSR_CONFIG_PANEL': 'CLOSR_CONFIG_PANEL',
        'CONFIG_PANEL_SAVE_AND_CLOSE': 'CONFIG_PANEL_SAVE_AND_CLOSE',
        'REMOVE_MODEULE': 'REMOVE_MODEULE',
        'CHANGE_INPUT_DS': 'CHANGE_INPUT_DS',
        'CHANGE_ACTIVE_SIDER_INDEX': 'CHANGE_ACTIVE_SIDER_INDEX'
    };
    exports.modal = {
        'SHOW_MODAL': 'SHOW_MODAL',
        'HIDE_MODAL': 'HIDE_MODAL',
        'CHANGE_STRATEGY_VALUE': 'CHANGE_STRATEGY_VALUE'
    };
    exports.modulePropPanel = {
        'CHANGE_SELECTEDMODULES_PROPS':'CHANGE_SELECTEDMODULES_PROPS'
    }
}));
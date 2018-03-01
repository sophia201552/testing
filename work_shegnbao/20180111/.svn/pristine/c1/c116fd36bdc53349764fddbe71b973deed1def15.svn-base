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
            namespace('beop.strategy.common'),
            namespace('beop.strategy.components.PropPanel')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    commonUtil,
    PropPanel
) {

    var mapDispatchToProps  = function (dispatch) {
        var actions = namespace('beop.strategy.modules.PropPanel.actions');

        return {
            changeProp: function (key, e) {
                var value;
                if(key === "type" || key === "level"){
                    value = parseInt(e.currentTarget.value);
                }else{
                    value =  e.currentTarget.value;
                }
                dispatch(actions.changeProp(key,value));
            },
            changeTrigger: function (key, e) {
                dispatch(actions.changeTrigger(key, e.currentTarget.value));
            },
            hideStrategyTriggerModal: function () {
                dispatch(actions.hideStrategyTriggerModal());
            },
            saveStrategyTriggerModal: function(data){
                dispatch(actions.saveStrategyTriggerModal(data));
            },
            editTrigger: function (data,e){
                dispatch(actions.editTrigger(data));
            },
            recoverProp: function () {
                dispatch(actions.recoverProp());
            },
            doSave: function () {
                dispatch(actions.doSave());
            },
            showStrategyConfigModal: function(){
                dispatch(actions.showStrategyConfigModal());
            },
            hideStrategyConfigModal: function(){
                dispatch(actions.hideStrategyConfigModal());
            },
            updateStrategyConfigModal: function(strategyId,codeObj){
                dispatch(namespace('beop.strategy.modules.EquipTree.actions').updateItems([strategyId],{option:{config:codeObj}}));
                dispatch(actions.updateStrategyConfigModal());
            }
        };
    }

    var mapStateToProps = function (state) {
        return {
            data: state.propPanel.data,
            triggerData: state.propPanel.triggerData,
            isShowStrategyConfigModal: state.propPanel.isShowStrategyConfigModal,
            isShowStrategyTriggerModal: state.propPanel.isShowStrategyTriggerModal,
            selectedIds: state.strategyTable.selectedIds,
            btnLoading: state.propPanel.btnLoading
        };
    }

    exports.PropPanel = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PropPanel);
}));

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
            namespace('beop.strategy.components.ModulePropPanel')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    ModulePropPanel
) {

    var mapDispatchToProps = function(dispatch) {

        var actions = namespace('beop.strategy.modules.ModulePropPanel.actions');

        return {
            changeProp: function(key, e) {
                if (e && e.currentTarget !== undefined) {
                    e = e.currentTarget.value;
                }
                if(!e instanceof Array){
                    e = isNaN(e) ? e : parseInt(e);
                }
                dispatch(actions.changeProp(key, e));
            },
            changeTagList: function(tagList){
                let equipmentTreeActions = namespace('beop.strategy.modules.EquipTree.actions');
                dispatch(equipmentTreeActions.changeTagList(tagList));
            }
        };
    }

    var mapStateToProps = function(state) {
        return {
            data: state.modulePropPanel.data,
            tagList: state.equipTree.tagList,
        };
    }

    exports.ModulePropPanel = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ModulePropPanel);
}));
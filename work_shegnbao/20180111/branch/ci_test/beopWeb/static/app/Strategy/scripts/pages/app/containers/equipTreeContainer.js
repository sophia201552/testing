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
            namespace('beop.strategy.components.EquipTree')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    EquipTree
) {

    var mapDispatchToProps  = function (dispatch) {
        var actions = namespace('beop.strategy.modules.EquipTree.actions');
        var tableActions = namespace('beop.strategy.modules.StrategyTable.actions');

        return {
            onToggleShowAllStrategiesBtnHandler: function () {
                dispatch(actions.onToggleShowAllStrategiesBtnHandler());
            },
            onSelectTreeNode: function (_id, parentNodeId) {
                dispatch(actions.onSelectTreeNode(_id, parentNodeId,dispatch));
            },
            addAsyncData: function (items, nodeId) {
                dispatch(actions.addAsyncData(items, nodeId));
            },
            doOpen: function (id) {
                tableActions.doOpen(id);
            },
            onSearch: function (value) {
                dispatch(actions.onSearch(value));
            },
            loadTreeData: (projId) => {
                dispatch(actions.loadTreeData(projId));
            },
            handleExpand: (keys) => {
                dispatch(actions.handleExpand(keys));
            },
            changeSelectedValueId: (id) => {
                dispatch(actions.changeSelectedValueId(id));
            },
            changeProjName: (projName)=>{
                dispatch(actions.changeProjName(projName));
            },
            loadTagList: ()=>{
                dispatch(actions.loadTagList());
            }
        };
    }

    var mapStateToProps = function (state) {
        // 左边树选中的文件夹 id，没有则为 null
        var selectedGroupId = state.equipTree.selectedNode ? state.equipTree.selectedNode.pid : null;
        // 左边数选中的节点 id，没有则为 null
        var selectedNodeId = state.equipTree.selectedNode ? state.equipTree.selectedNode._id : null;

        return {
            selectedGroupId: selectedGroupId,
            selectedNodeId: selectedNodeId,
            searchKey: state.equipTree.searchKey,
            items: state.equipTree.items,
            expandedKeys: state.equipTree.expandedKeys,
            autoExpandParent: state.equipTree.autoExpandParent,
            oldExpandedKeys: state.equipTree.oldExpandedKeys,
            bShowChildStrategies: state.equipTree.bShowChildStrategies,
            selectedValueId: state.equipTree.selectedValueId,
            projName: state.equipTree.projName,
            tagList: state.equipTree.tagList,
        };
    }

    exports.EquipTree = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(EquipTree);
}));
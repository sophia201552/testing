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
            namespace('beop.strategy.components.StrategyTable')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    StrategyTable
) {
    var mapDispatchToProps = function(dispatch) {
        var actions = namespace('beop.strategy.modules.StrategyTable.actions');

        return {
            doAdd: function(nodeId) {
                dispatch(actions.doAdd(nodeId));
            },
            doRemove: function(selectedIds) {
                dispatch(actions.doRemove(selectedIds));
            },
            showSupplementModal:function(selectedIds){
                dispatch(actions.showSupplementModal());
            },
            hideSupplementModal:function(selectedIds){
                dispatch(actions.hideSupplementModal());
            },
            changeSearchField: function(evt) {
                dispatch(actions.changeSearchField(evt.currentTarget.value));
            },
            doEnable: function(ids) {
                dispatch(actions.doEnable(ids));
            },
            doDisable: function(ids) {
                dispatch(actions.doDisable(ids));
            },
            selectRows: function(data, e) {
                dispatch(actions.selectRows(data._id, data.selectedIds,data.itemIds, e.ctrlKey, e.shiftKey));
            },
            doOpen: actions.doOpen,
            showProjConfigModal: () => {
                dispatch(actions.showProjConfigModal());
            },
            hideProjConfigModal: () => {
                dispatch(actions.hideProjConfigModal());
            },
            showUpdateDiagnosis: function(selectedIds){
                dispatch(actions.showUpdateDiagnosis(selectedIds));
            }
        };
    }

    var mapStateToProps = function(state) {
        // 左边树选中的文件夹 id，没有则为 null
        var selectedGroupId = state.equipTree.selectedNode ? state.equipTree.selectedNode.pid : null;
        // 表格数据
        var tableItems = selectedGroupId === null ? [] : (function() {
            var stack = state.equipTree.items.slice();
            var item, nodes, rs = [];

            while (item = stack.shift()) {
                if (item._id === selectedGroupId) {
                    nodes = item.children;
                    break;
                }
                if (item.children && item.children.length) {
                    stack = stack.concat(item.children);
                }
            }

            if (!nodes) {
                return [];
            }
            // 查找 nodes 下所有的叶子节点
            stack = nodes.slice();
            while (item = stack.shift()) {
                if (!item.isParent) {
                    rs.push(item);
                    continue;
                }
                // 如果不显示所有子策略就不做深搜
                if (!state.equipTree.bShowChildStrategies) {
                    continue;
                }
                if (item.children && item.children.length) {
                    stack = stack.concat(item.children);
                }
            }

            return rs;
        }());

        return {
            searchKey: state.strategyTable.searchKey,
            selectedIds: state.strategyTable.selectedIds,
            items: tableItems,
            selectedGroupId: selectedGroupId,
            isShowStrategyConfigModal:state.strategyTable.isShowStrategyConfigModal,
            isShowStrategySupplementModal: state.strategyTable.isShowStrategySupplementModal,
            bShowSpin: state.strategyTable.bShowSpin
        };
    }

    exports.StrategyTable = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(StrategyTable);
}));
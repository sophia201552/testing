;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../core/model.js',
            '../core/Event.js',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../core/model.js'),
            require('../core/Event.js'),
            require('React')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.core.Event'),
            namespace('beop.strategy.core.constants'),
            namespace('React')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    Model,
    Event,
    constants,
    React
) {
    var h = React.h;
    var linkEvent = React.linkEvent;

    var actions = {
        dispatch: null,
        addStrategyItem: function (nodeId) {
            actions.dispatch({
                type: constants.strategyTable.ADD_ITEM,
                nodeId: nodeId
            });
        },
        removeSelectedItems: function (selectedIds) {
            actions.dispatch({
                type: constants.strategyTable.REMOVE_SELECTED_ITEMS,
                selectedIds: selectedIds
            });
        },
        changeSearchField: function (e) {
            actions.dispatch({
                type: constants.strategyTable.CHANGE_SEARCH_FIELD,
                value: e.currentTarget.value
            });
        },
        enableStrategies: function (ids) {
            actions.dispatch({
                type: constants.strategyTable.ENABLE_STRATEGIES,
                ids: ids
            });
        },
        disableStrategies: function (ids) {
            actions.dispatch({
                type: constants.strategyTable.DISABLE_STRATEGIES,
                ids: ids
            });
        },
        selectRows: function (data, e) {
            var _id = data._id;
            var selectedIds = data.selectedIds;
            var idx = selectedIds.indexOf(_id);

            if (e.ctrlKey) {
                if (idx > -1) {
                    selectedIds.splice(idx, 1);
                } else {
                    selectedIds.push(_id);
                }
            } else {
                selectedIds = [_id];
            }

            actions.dispatch({
                type: constants.strategyTable.SELECT_ROWS,
                selectedIds: selectedIds
            });
        },
        openStrategy: function (_id, e) {
            actions.dispatch({
                type: constants.strategyTable.OPEN_STRATEGY,
                strategyId: _id
            });
        }
    };

    var theme = {
        leftBtnGroup: function (selectedIds, nodeId) {
            return (
                h('.navLeftBtn', [
                    h('button.btn.btn-default.addBtn', {
                        disabled: nodeId ? '' : 'disabled',
                        onClick: linkEvent(nodeId, actions.addStrategyItem)
                    }, '新增'),
                    h('button.btn.btn-default.removeBtn', {
                        disabled: selectedIds.length ? '' : 'disabled',
                        onClick: linkEvent(selectedIds, actions.removeSelectedItems)
                    }, '删除')
                ])
            );
        },
        searchField: function (searchKey) {
            return (
                h('.input-group.navSearch',[
                    h('input',{
                        className: 'form-control iptSearch',
                        type:'text',
                        value: searchKey || '',
                        onInput: actions.changeSearchField
                    }),
                    h('span.spanSearch',[
                        h('span',{
                            className: 'glyphicon glyphicon-search'
                        })
                    ])
                ])
            );
        },
        rightBtnGroup: function (items, selectedIds) {
                var startBtnState;
                var stopBtnState;

                if(selectedIds.length === 0) {
                    startBtnState = 'disabled';
                    stopBtnState = 'disabled';
                } else {
                    var enableArr = [];
                    items.forEach(function(row){
                        if(selectedIds.indexOf(row._id) !== -1){
                            if( Number(row.status) === 1){//选中的是启用状态
                                enableArr.push(row);
                            }
                        }
                    })
                    if(enableArr.length === 0){//选中的控件都是未启用的状态
                        startBtnState = '';
                        stopBtnState = 'disabled';
                    } else if (enableArr.length === selectedIds.length){//选中的控件都是启用状态
                        startBtnState = 'disabled';
                        stopBtnState = '';
                    } else {//都是启用的  或者 有启用的 有未启用的
                        startBtnState = '';
                        stopBtnState = '';
                    }
                }
                return (
                    h('.navRightBtn', [
                        h('button', {
                            className:  'btn btn-default startBtn',
                            disabled: startBtnState,
                            onClick: linkEvent(selectedIds, actions.enableStrategies)
                        }, '启用'),
                        h('button', {
                            className:  'btn btn-default stopBtn',
                            disabled: stopBtnState,
                            onClick: linkEvent(selectedIds, actions.disableStrategies)
                        }, '禁用')
                    ])
                );
            },

        table: function(items, selectedIds, searchKey, loading) {
            var _this = this;
            var renderTrDatas = [];
            var tbodyStr;
            var dom;

            if(searchKey !== ''){
                items.forEach(function(row){
                    if(row.name.trim().toLowerCase().indexOf(searchKey) !== -1){
                        renderTrDatas.push( _this.layoutTr(row, false, selectedIds) );
                    }
                })
                if(renderTrDatas.length === 0){
                    renderTrDatas.push(
                        h('tr', [
                            h('td', {
                                colspan: 9
                            }, '未找到记录')
                        ])
                    );
                }
            } else {
                if(items.length === 0 && loading === 'Loading'){
                    renderTrDatas.push(
                        h('tr', [
                            h('td', {
                                colspan: 9
                            }, loading)
                        ])
                    );
                } else {
                    if(items.length === 0){
                        renderTrDatas.push(
                            h('tr', [
                                h('td', {
                                    colSpan: 9
                                }, '未找到记录')
                            ])
                        );
                    } else {
                        if(selectedIds.length === 0){
                            items.forEach(function(row){
                                renderTrDatas.push( _this.layoutTr(row, false, selectedIds) );
                            })
                        } else {
                            items.forEach(function(row){
                                if(selectedIds.indexOf(row._id) !== -1){
                                    renderTrDatas.push( _this.layoutTr(row, true, selectedIds) );
                                } else {
                                    renderTrDatas.push( _this.layoutTr(row, false, selectedIds) );
                                }
                            })
                        }
                    }
                }
                
            }
            return (
                h('table.strategyTable', [
                    h('thead', [
                        h('tr', [
                            h('th', {style: {width: '12%'}}, '名称'),
                            h('th', {style: {width: '12%'}}, '从属'),
                            h('th', {style: {width: '5%'}}, '状态'),
                            h('th', {style: {width: '12%'}}, '上次执行'),
                            h('th', {style: {width: '5%'}}, '运行间隔'),
                            h('th', {style: {width: '5%'}}, '类型'),
                            h('th', {style: {width: '5%'}}, '修改人'),
                            h('th', {style: {width: '12%'}}, '修改时间'),
                            h('th', {style: {width: '20%'}}, '描述')
                        ])
                    ]),
                    h('tbody', renderTrDatas)
                ])
            );
        },
        layoutTr: function(detail, flag, selectedIds) {
            var type = Number(detail.type) === 0 ? '诊断': ( Number(detail.type) === 1 ? 'KPI' : '计算点' );
            var status = Number(detail.status) === 0 ? '未启用' : '启用';
            var className = flag ? 'selected' : '' ;

            return (
                h('tr', {
                    className: className,
                    'data-id': detail._id,
                    'parent-id': detail.nodeId,
                    onDoubleClick: linkEvent(detail._id, actions.openStrategy),
                    onClick: linkEvent({
                        _id: detail._id,
                        selectedIds: selectedIds
                    }, actions.selectRows)
                }, [
                    h('td', { title: detail.name }, detail.name),
                    h('td', { title: 'VAV'/*detail.nodeId*/ }, 'VAV'),
                    h('td', status),
                    h('td', detail.lastRuntime),
                    h('td', detail.interval),
                    h('td', type),
                    h('td', detail.userId),
                    h('td', detail.lastTime),
                    h('td', {
                        title: detail.desc
                    }, detail.desc)

                ])
            )
        }
    };

    function StrategyTable(props, context) {
        var state = props.strategyTable;
        actions.dispatch = actions.dispatch || context.dispatch;

        return (
            h('div', {
                id: 'strategyTable',
                style: {width: '100%', height: '100%'}
            }, [
                h('.toolBar.clearfix', [
                    theme.leftBtnGroup(state.selectedIds, props.equipTree.selectedGroupId),
                    theme.rightBtnGroup(state.items, state.selectedIds),
                    theme.searchField(state.searchKey)
                ]),
                h('.detailTable.gray-scrollbar', {
                    style: {
                        height: 'calc(100% - 74px)',
                        overflow: 'auto'
                    }
                }, [
                    theme.table(state.items, state.selectedIds, state.searchKey)
                ])
            ])
        );
    }

    exports.StrategyTable = StrategyTable;
}));
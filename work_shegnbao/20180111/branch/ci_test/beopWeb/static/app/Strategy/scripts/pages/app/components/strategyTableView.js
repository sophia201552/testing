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
            namespace('React'),
            namespace('antd'),
            namespace('beop.common.components.StrategyConfigModal'),
            namespace('beop.common.components.StrategySupplementModal'),
            namespace('beop.strategy.components.Spinner')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    StrategyConfigModal,
    StrategySupplementModal,
    Spinner
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    const { Input, Button, Modal, Tag ,Menu, Dropdown, Icon} = antd;
    const ButtonGroup = Button.Group;

    var theme = {
        leftBtnGroup: function (selectedIds, nodeId, doAdd, doRemove, showProjConfigModal,showSupplementModal,showUpdateDiagnosis) {
            let overlay = h(Menu,{},[
                h(Menu.Item,{disabled: nodeId ? '' : 'disabled'},[h('a',{
                                className: 'ant-dropdown-link',
                                href: 'javascript:;',
                                onClick: showProjConfigModal,
                                disabled: nodeId ? '' : 'disabled'
                            },[I18n.resource.strategyTable.PROJECT_CONFIGURATION])]),
                h(Menu.Item,{disabled: selectedIds.length ? '' : 'disabled'},[h('a',{
                                className: 'ant-dropdown-link',
                                href: 'javascript:;',
                                onClick: showSupplementModal,
                                disabled: selectedIds.length ? '' : 'disabled'
                            },[I18n.resource.strategyTable.SUPPLEMENTARY_DIAGNOSIS])]),
                h(Menu.Item,{disabled: selectedIds.length ? '' : 'disabled'},[h('a',{
                                className: 'ant-dropdown-link',
                                href: 'javascript:;',
                                onClick: linkEvent(selectedIds,showUpdateDiagnosis),
                                disabled: selectedIds.length ? '' : 'disabled'
                            },[I18n.resource.strategyTable.UPDATE_DIAGNOSTIC_TABLE])]),
            ])
            return (
                h('.navLeftBtn', [
                    h(ButtonGroup,[
                        h(Button,{
                            className:"addBtn",
                            disabled: nodeId ? '' : 'disabled',
                            onClick: linkEvent(nodeId, doAdd)
                        },I18n.resource.strategyTable.ADD),
                        h(Button,{
                            className:"removeBtn",
                            disabled: selectedIds.length ? '' : 'disabled',
                            onClick: linkEvent(selectedIds, doRemove)
                        },I18n.resource.strategyTable.DELETE)
                    ]),
                    h(ButtonGroup,{
                        style:{
                            marginLeft: 30
                        }
                    },[
                        h(Dropdown,{
                            overlay
                        },[
                            h(Button,{
                                id:'btnConfigs'
                            },[I18n.resource.strategyTable.OPERATION,h(Icon,{type:'down'})])
                        ]),
                        h(Button,{
                            id:'btnHide1',
                            disabled: nodeId ? '' : 'disabled',
                            onClick: showProjConfigModal
                        },I18n.resource.strategyTable.PROJECT_CONFIGURATION),
                        h(Button,{
                            id:'btnHide2',
                            disabled: selectedIds.length ? '' : 'disabled',
                            onClick: showSupplementModal
                        },I18n.resource.strategyTable.SUPPLEMENTARY_DIAGNOSIS),
                        h(Button,{
                            id:'btnHide3',
                            disabled: selectedIds.length ? '' : 'disabled',
                            onClick: linkEvent(selectedIds,showUpdateDiagnosis)
                        },I18n.resource.strategyTable.UPDATE_DIAGNOSTIC_TABLE)
                    ])
                ])
            );
        },
        searchField: function (searchKey, changeSearchField) {
            return (
                h('.input-group.navSearch.searchHide',[
                    h('input', {
                        className: 'form-control iptSearch',
                        type:'text',
                        value: searchKey || '',
                        onInput: changeSearchField
                    }),
                    h('span.spanSearch',[
                        h('span',{
                            className: 'glyphicon glyphicon-search'
                        })
                    ])
                ])
            );
        },
        rightBtnGroup: function (items, selectedIds, doEnable, doDisable) {
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
                });
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
                h(ButtonGroup, {
                    className:"navRightBtn"
                },[
                    h(Button, {
                        className:  'startBtn',
                        disabled: startBtnState,
                        onClick: linkEvent(selectedIds, doEnable)
                    }, I18n.resource.strategyTable.ENABLE),
                    h(Button, {
                        className:  'stopBtn',
                        disabled: stopBtnState,
                        onClick: linkEvent(selectedIds, doDisable)
                    }, I18n.resource.strategyTable.DISABLE)
                ])
            );
        },

        table: function(items, selectedIds, searchKey, selectedRows, doOpen) {
            var _this = this;
            var renderTrDatas = [];
            var tbodyStr;
            var dom;

            if(searchKey) {
                items = items.filter(function (row) {
                    return row.name.trim().toLowerCase().indexOf(searchKey) !== -1;
                });
            }

            if(items.length === 0){
                renderTrDatas.push(
                    h('tr', [
                        h('td', {
                            colSpan: 9
                        }, I18n.resource.strategyTable.NO_RECORD)
                    ])
                );
            } else {
                let itemIds = items.map(item=>item._id);
                items.forEach(function(row){
                    renderTrDatas.push( _this.layoutTr(row, selectedIds.indexOf(row._id) !== -1, selectedIds, selectedRows, doOpen, itemIds) );
                });
            }

            return (
                h('table.strategyTable', [
                    h('thead', [
                        h('tr', [
                            h('th', {style: {width: '20%'}}, I18n.resource.strategyTable.NAME),
                            h('th', {style: {width: '12%'}}, I18n.resource.strategyTable.DEPENDENCIES),
                            h('th', {style: {width: '8%'}}, I18n.resource.strategyTable.STATE),
                            h('th', {style: {width: '12%'}}, I18n.resource.strategyTable.THE_LAST_TIME_TO_PERFORM),
                            //h('th', {style: {width: '5%'}}, '运行间隔'),
                            h('th', {style: {width: '8%'}}, I18n.resource.strategyTable.TYPE),
                            h('th', {style: {width: '8%'}}, I18n.resource.strategyTable.MODIFIER),
                            h('th', {style: {width: '12%'}}, I18n.resource.strategyTable.MODIFICATION_TIME),
                            h('th', {style: {width: '20%'}}, I18n.resource.strategyTable.DESCRIPTION)
                        ])
                    ]),
                    h('tbody', renderTrDatas)
                ])
            );
        },
        layoutTr: function(detail, flag, selectedIds, selectedRows, doOpen, itemIds) {
            var type = Number(detail.type) === 0 ? I18n.resource.strategyTable.DIAGNOSE: ( Number(detail.type) === 1 ? I18n.resource.strategyTable.KPI : I18n.resource.strategyTable.CALCULATION_POINT );
            var status = Number(detail.status) === 0 ? I18n.resource.strategyTable.NOT_ENABLED : I18n.resource.strategyTable.ENABLED;
            var tagColor = Number(detail.status) === 0 ? 'orange-inverse' : 'cyan-inverse';
            var className = flag ? 'selected' : '' ;

            return (
                h('tr', {
                    className: className,
                    'data-id': detail._id,
                    'data-parent-id': detail.nodeId,
                    onDoubleClick: linkEvent(detail._id, doOpen),
                    onClick: linkEvent({
                        _id: detail._id,
                        selectedIds: selectedIds,
                        itemIds: itemIds
                    }, selectedRows)
                }, [
                    h('td', { title: detail.name }, detail.name),
                    h('td', { title: detail.nodeName/*detail.nodeId*/ }, detail.nodeName),
                    h('td', {}, [h(Tag, {color: tagColor}, [status])]),
                    h('td', detail.lastRuntime),
                    //h('td', detail.interval),
                    h('td', type),
                    h('td', detail.userFullName),
                    h('td', detail.lastTime),
                    h('td', {
                        title: detail.desc
                    }, detail.desc)

                ])
            )
        }
    };

    function StrategyTable(props) {
        const {
            // props
            searchKey,
            selectedIds,
            items,
            selectedGroupId,
            isShowStrategyConfigModal,
            isShowStrategySupplementModal,
            bShowSpin,
            // actions
            doAdd,
            doRemove,
            changeSearchField,
            doEnable,
            doDisable,
            selectRows,
            doOpen,
            showProjConfigModal,
            hideProjConfigModal,
            showSupplementModal,
            hideSupplementModal,
            showUpdateDiagnosis
        } = props;

        return (
            h('div', {
                id: 'strategyTable',
                style: {width: '100%', height: '100%'}
            }, [
                h('.toolBar.clearfix', [
                    theme.leftBtnGroup(selectedIds, selectedGroupId, doAdd, doRemove, showProjConfigModal,showSupplementModal,showUpdateDiagnosis),
                    theme.rightBtnGroup(items, selectedIds, doEnable, doDisable),
                    theme.searchField(searchKey, changeSearchField)
                ]),
                h('.detailTable.gray-scrollbar', {
                    style: {
                        height: 'calc(100% - 74px)',
                        overflow: 'auto'
                    }
                }, [
                    theme.table(items, selectedIds, searchKey, selectRows, doOpen)
                ]),
                h(StrategyConfigModal,{
                    isShowStrategyConfigModal,
                    groupId : AppConfig.projectId,
                    hideStrategyConfigModal:hideProjConfigModal,
                }),
                h(StrategySupplementModal,{
                    isShowStrategySupplementModal,
                    selectedIds:selectedIds,
                    hideSupplementModal:hideSupplementModal
                }),
                h(Spinner, {
                    bShowSpin,
                    id: "params-config-spinner"
                })
            ])
        );
    }

    exports.StrategyTable = StrategyTable;
}));
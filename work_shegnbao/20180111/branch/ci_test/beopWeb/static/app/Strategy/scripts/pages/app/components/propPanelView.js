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
            namespace('React'),
            namespace('antd'),
            namespace('beop.strategy.enumerators'),
            namespace('beop.common.components.StrategyConfigModal'),
            namespace('beop.common.components.StrategyTriggerModal')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    enums,
    StrategyConfigModal,
    StrategyTriggerModal
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    const {Button,Icon} = antd;
    const Group = Button.Group;
    var theme = {
        topBtns: function(recoverProp, doSave, showStrategyConfigModal, data, btnLoading) {
            if (data && !$.isEmptyObject(data)) {
                return h('div', { style: { padding: '15px 15px 0 15px' } }, [
                    h(Group,{className:'lr'},[
                        h(Button,{
                            style:{
                                display: data.type === 0 ? "block" : "none"
                            },
                            disabled:!('lastTime' in data),
                            onClick:showStrategyConfigModal
                        },[I18n.resource.propTree.STRATEGIES_DOMINATION]),
                    ]),
                    h(Group,{className:'fr'},[
                        h(Button,{
                            onClick:recoverProp
                        },[I18n.resource.propTree.RECOVER]),
                        h(Button,{
                            className: "loadingBtn",
                            onClick:doSave,
                            loading: btnLoading
                        },[I18n.resource.propTree.SAVE])
                    ]),
                    h('div', { style: { clear: 'both' } })
                ]);
            }
        },
        propView: function(data, changeProp, changeTrigger,editTrigger,doUpdateFaultTable,btnLoading) {
            var createRow = function(text, input) {
                return h('.form-group', [h('label', {
                    style: {
                        fontSize: '12px'
                    }
                }, text), input]);
            };
            var createViewRow = function(text, input) {
                return h('.form-group', [h('label', {
                    style: {
                        fontSize: '12px',
                        marginBottom: 0,
                        verticalAlign: "middle"
                    }
                }, text), input]);
            };
            var children = [];

            if ('name' in data) {
                children.push(
                    createRow(I18n.resource.propTree.NAME, h('input', {
                        id: "propName",
                        type: 'text',
                        name: 'name',
                        value: data.name,
                        onChange: linkEvent('name', changeProp)
                    }))
                );
            }
            if ('status' in data) {
                children.push(
                    createRow(
                        I18n.resource.propTree.STATE,
                        h('select', {
                            name: 'status',
                            value: data.status,
                            onChange: linkEvent('status', changeProp)
                        }, [
                            h('option', { value: 0 }, I18n.resource.propTree.DISABLE),
                            h('option', { value: 1 }, I18n.resource.propTree.ENABLE)
                        ])
                    )
                );
            }
            if ('type' in data) {
                children.push(
                    createRow(
                        I18n.resource.propTree.TYPE,
                        h('select', {
                            name: 'type',
                            value: data.type,
                            onChange: linkEvent('type', changeProp)
                        }, [
                            h('option', { value: enums.strategyTypes.DIAGNOSIS }, [enums.strategyTypesNames[enums.strategyTypes.DIAGNOSIS]]),
                            h('option', { value: enums.strategyTypes.KPI }, [enums.strategyTypesNames[enums.strategyTypes.KPI]]),
                            h('option', { value: enums.strategyTypes.CALC_POINT }, [enums.strategyTypesNames[enums.strategyTypes.CALC_POINT]])
                        ])
                    )
                );
            }
            if ('desc' in data) {
                children.push(
                    createRow(
                        I18n.resource.propTree.DESCRIPTION,
                        h('input', {
                            type: 'text',
                            name: 'desc',
                            value: data.desc,
                            title: data.desc,
                            onChange: linkEvent('desc', changeProp)
                        })
                    )
                );
            }
            if (!$.isEmptyObject(data) && Object.keys(data).indexOf('trigger') < 0) {
                data['trigger'] = [];
            }
            if ('trigger' in data) {
                var interval = '';
                var length = data.trigger.length;
                if (length > 0) {
                    data.trigger.forEach(function(row, index) {
                        var tpl;
                        if(row.type === "one"){
                            tpl = row.options.time;
                        }else if(row.type === "day"){
                            tpl = I18n.resource.modal.EVERY + (row.options.step > 1 ? row.options.step : "") + I18n.resource.modal.DAYS + row.options.time;
                        }else if(row.type === "week"){
                            var weeks = "";
                            var weekLen = row.options.time.length;
                            row.options.time.forEach(function(week,i){
                                var item;
                                switch (week) {
                                    case 0:
                                        item = I18n.resource.dataSource.WEEK[0];
                                        break;
                                    case 1:
                                        item = I18n.resource.dataSource.WEEK[1];
                                        break;
                                    case 2:
                                        item = I18n.resource.dataSource.WEEK[2];
                                        break;
                                    case 3:
                                        item = I18n.resource.dataSource.WEEK[3];
                                        break;
                                    case 4:
                                        item = I18n.resource.dataSource.WEEK[4];
                                        break;
                                    case 5:
                                        item = I18n.resource.dataSource.WEEK[5];
                                        break;
                                    case 6:
                                        item = I18n.resource.dataSource.WEEK[6];
                                        break;
                                }
                                if(i < weekLen - 1){
                                    item += ","
                                }
                                weeks +=item;
                            });
                            tpl = I18n.resource.modal.EVERY + (row.options.step > 1 ? row.options.step : "") + I18n.resource.modal.WEEKS + weeks;
                        }else if(row.type === "month"){
                            var months = "";
                            var monthLen = row.options.time.length;
                            var dayLen = row.options.step.length;
                            var days = "";
                            row.options.time.forEach(function(month,j){
                                var item;
                                switch (month){
                                    case 0:
                                        item = I18n.resource.dataSource.MONTH[0];
                                        break;
                                    case 1:
                                        item = I18n.resource.dataSource.MONTH[1];
                                        break;
                                    case 2:
                                        item = I18n.resource.dataSource.MONTH[2];
                                        break;
                                    case 3:
                                        item = I18n.resource.dataSource.MONTH[3];
                                        break;
                                    case 4:
                                        item = I18n.resource.dataSource.MONTH[4];
                                        break;
                                    case 5:
                                        item = I18n.resource.dataSource.MONTH[5];
                                        break;
                                    case 6:
                                        item = I18n.resource.dataSource.MONTH[6];
                                        break;
                                    case 7:
                                        item = I18n.resource.dataSource.MONTH[7];
                                        break;
                                    case 8:
                                        item = I18n.resource.dataSource.MONTH[8];
                                        break;
                                    case 9:
                                        item = I18n.resource.dataSource.MONTH[9];
                                        break;
                                    case 10:
                                        item = I18n.resource.dataSource.MONTH[10];
                                        break;
                                    case 11:
                                        item = I18n.resource.dataSource.MONTH[11];
                                        break;
                                }
                                if(j < monthLen - 1){
                                    item += ","
                                }
                                months += item;
                            });
                            row.options.step.forEach(function(day,k){
                                var item;
                                if(isNaN(day)){
                                    item = I18n.resource.modal.LAST_DAY;
                                }else{
                                    item = day + I18n.resource.modal.HAO;
                                }
                                if(k < dayLen - 1){
                                    item += ",";
                                }
                                days += item;
                            });
                            tpl = I18n.resource.modal.ON + months + I18n.resource.modal.DE + days;
                        }
                        if (index < length - 1) {
                            tpl = row.options.time + '|';
                        }
                        interval += tpl;
                    });
                }
                children.push(
                    createRow(
                        I18n.resource.propTree.TRAIN_INTERVAL,
                        h("div",{
                            style:{
                                display: "inline"
                            }
                        },[
                            h('label', {
                                //type: 'text',
                                name: 'trigger',
                                style:{
                                    width: "calc(100% - 120px)",
                                    fontSize: '12px',
                                    fontWeight: 'normal',
                                    overflow:"hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    display:"inline-block",
                                    position:"relative",
                                    top: 8
                                },
                                //placeholder: "输入时间格式xx:xx,多个用|分割",
                                title: interval,
                                onChange: linkEvent('trigger', changeTrigger)
                            },[interval]),
                            h(Button  ,{
                                title:I18n.resource.title.EDIT,
                                icon:"edit",
                                style:{
                                    marginLeft: 10
                                },
                                onClick: linkEvent(data.trigger[0], editTrigger)
                            })
                        ])
                    )
                );
            }
            if ('nodeId' in data) {
                children.push(
                    createViewRow(I18n.resource.propTree.DEPENDENCIES, h('label', {
                        style: {
                            fontSize: '12px',
                            fontWeight: 'normal',
                            marginBottom: 0,
                            padding: '5px 4px'
                        }
                    }, [data.nodeName]))
                );
            }
            if ('lastRuntime' in data) {
                children.push(
                    createViewRow(I18n.resource.propTree.THE_LAST_TIME_RUNNING_TIME, h('label', {
                        style: {
                            fontSize: '12px',
                            fontWeight: 'normal',
                            width: 'calc(100% - 80px)',
                            padding: '5px 4px',
                            marginBottom: 0
                        }
                    }, [data.lastRuntime]))
                );
            }
            if ('userFullName' in data) {
                children.push(
                    createViewRow(I18n.resource.propTree.MODIFIER, h('label', {
                        style: {
                            fontSize: '12px',
                            fontWeight: 'normal',
                            width: 'calc(100% - 80px)',
                            padding: '5px 4px',
                            marginBottom: 0
                        }
                    }, [data.userFullName]))
                );
            }
            if ('lastTime' in data) {
                children.push(
                    createViewRow(I18n.resource.propTree.THE_LAST_MODIFICATION_TIME, h('label', {
                        style: {
                            fontSize: '12px',
                            fontWeight: 'normal',
                            width: 'calc(100% - 80px)',
                            padding: '5px 4px',
                            marginBottom: 0
                        }
                    }, [data.lastTime]))
                );
            }
            if(!$.isEmptyObject(data)){
                if(data.type === 0){
                    if(data.option && data.option.needSyncFaultTable && data.option.needSyncFaultTable === 1){
                        children.push(
                            createViewRow(I18n.resource.propTree.FAULT_TABLE_STATUS,h(Button  ,{
                                title:I18n.resource.title.UPDATE_FAULT_TABLE,
                                icon:"sync",
                                loading: btnLoading,
                                onClick: doUpdateFaultTable
                            },[I18n.resource.propTree.UPDATE]))
                        );
                    }else{
                        children.push(
                            createViewRow(I18n.resource.propTree.FAULT_TABLE_STATUS, h('label', {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 'normal',
                                    width: 'calc(100% - 80px)',
                                    padding: '5px 4px',
                                    marginBottom: 0
                                }
                            }, [I18n.resource.propTree.FAULT_TABLE_UPDATE]))
                        );
                    }
                }
            }

            return h('form.form-inline', { style: { padding: '15px' } }, children);
        }
    };

    function PropPanel(props) {
        const {
            isShowStrategyConfigModal,
            isShowStrategyTriggerModal,
            data,
            triggerData,
            selectedIds,
            changeProp,
            changeTrigger,
            recoverProp,
            doSave,
            showStrategyConfigModal,
            hideStrategyConfigModal,
            hideStrategyTriggerModal,
            saveStrategyTriggerModal,
            updateStrategyConfigModal,
            editTrigger,
            btnLoading,
            doUpdateFaultTable
        } = props;

        if (!data) {
            return null;
        }

        return (
            h('div', {
                id: 'propPanel',
                style: { width: '100%', height: '100%' }
            }, [
                theme.topBtns(recoverProp, doSave, showStrategyConfigModal, data, btnLoading),
                theme.propView(data, changeProp, changeTrigger,editTrigger,doUpdateFaultTable,btnLoading),
                h(StrategyConfigModal,{
                    isShowStrategyConfigModal,
                    strategyId : selectedIds[0],
                    strategyData : data,
                    hideStrategyConfigModal,
                    updateStrategyConfigModal
                }),
                h(StrategyTriggerModal,{
                    isShowStrategyTriggerModal,
                    data:triggerData,
                    hideStrategyTriggerModal,
                    saveStrategyTriggerModal
                })
            ])
        );
    }

    exports.PropPanel = PropPanel;
}));
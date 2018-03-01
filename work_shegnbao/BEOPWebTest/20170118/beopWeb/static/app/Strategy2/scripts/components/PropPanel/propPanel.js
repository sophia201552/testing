;
(function(root, factory) {
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

    var deepClone = $.extend.bind($, true);

    var actions = {
        dispatch: null,
        save: function(selectedIds, e) {
            actions.dispatch({
                type: constants.propPanel.SAVE_PROP,
                value: {
                    target: e.currentTarget,
                    selectedIds: selectedIds
                }
            });
        }
    };

    var theme = {
        topBtns: function(selectedIrems, selectedIds) {
            if (selectedIrems.length > 0) {
                return h('div', { style: { padding: '15px 15px 0 0' } }, [
                    h('button.btn.btn-default.fr', {
                        onClick: linkEvent(selectedIds, actions.save)
                    }, '保存'),
                    h('button.btn.btn-default.fr', {
                        style: { marginRight: '10px' },
                        onClick: this.onRecover
                    }, '恢复'),
                    h('div', { style: { clear: 'both' } })
                ]);
            }
        },
        propView: function(selectedIrems, selectedIds) {
            var LABEL_WIDTH = '30%',
                INPUT_WIDTH = '69%';
            var createRow = function(text, input) {
                return h('.form-group', { style: { width: '100%' } }, [h('label', {
                    style: {
                        fontSize: '14px',
                        width: LABEL_WIDTH,
                        padding: '6px'
                    }
                }, text), input]);
            };
            if (selectedIrems.length == 1) {
                var item = selectedIrems[0];
                var statusArr = [],
                    typeArr = [];
                statusArr[Number(item.status)] = 'selected';
                typeArr[Number(item.type)] = 'selected';

                return h('form.form-inline', { style: { padding: '15px' } }, [
                    createRow('名字', h('input', {
                        type: 'text',
                        name: 'name',
                        value: item.name,
                        style: {
                            width: INPUT_WIDTH
                        },
                        onChange: linkEvent('name', this.onChangeHandler)
                    })),
                    createRow('状态', h('select', {
                        name: 'status',
                        value: item.status,
                        onChange: linkEvent('status', this.onChangeHandler)
                    }, [h('option', { value: '0', selected: statusArr[0] }, '不启用'), h('option', { value: '1', selected: statusArr[1] }, '启用')])),
                    createRow('运行间隔', h('input', {
                        type: 'text',
                        name: 'interval',
                        defaultValue: item.interval,
                        style: {
                            width: INPUT_WIDTH
                        },
                        onChange: linkEvent('interval', this.onChangeHandler)
                    })),
                    createRow('类型', h('select', {
                        name: 'type',
                        value: item.type,
                        onChange: linkEvent('type', this.onChangeHandler)
                    }, [h('option', { value: '0', selected: typeArr[0] }, '诊断'), h('option', { value: '1', selected: typeArr[1] }, 'KPI'), h('option', { value: '2', selected: typeArr[2] }, '计算点')])),
                    createRow('描述', h('input', {
                        type: 'text',
                        name: 'desc',
                        value: item.desc,
                        title: item.desc,
                        style: {
                            width: INPUT_WIDTH
                        },
                        onChange: linkEvent('desc', this.onChangeHandler)
                    })),
                    createRow('从属', h('label', {
                        style: {
                            fontSize: '14px',
                            width: INPUT_WIDTH,
                            padding: '6px 7px',
                            'font-weight': 'normal'
                        }
                    },['VAV'/*item.nodeId]*/])),
                    createRow('最后运行时间', h('label', {
                        style: {
                            fontSize: '14px',
                            width: INPUT_WIDTH,
                            padding: '6px 7px',
                            'font-weight': 'normal'
                        }
                    },[item.lastRuntime])),
                    createRow('修改人', h('label', {
                        style: {
                            fontSize: '14px',
                            width: INPUT_WIDTH,
                            padding: '6px 7px',
                            'font-weight': 'normal'
                        }
                    },[item.userId])),
                    createRow('最后修改时间', h('label', {
                        style: {
                            fontSize: '14px',
                            width: INPUT_WIDTH,
                            padding: '6px 7px',
                            'font-weight': 'normal'
                        }
                    },[item.lastTime]))
                ]);

            }
            if (selectedIrems.length > 1) {
                var items = selectedIrems;
                var keys = Object.keys(items[0]);
                var obj = {};
                keys.forEach(function(key) {
                    obj[key] = new Set(items.map((item) => { return item[key] })).size > 1 ? '' : items[0][key];
                })
                var item = selectedIrems[0];
                var statusArr = [],
                    typeArr = [];
                statusArr[Number(obj.status)] = 'selected';
                typeArr[Number(obj.type)] = 'selected';

                return h('form.form-inline', { style: { padding: '15px' } }, [
                    createRow('名字', h('input', {
                        type: 'text',
                        name: 'name',
                        value: obj.name,
                        style: {
                            width: INPUT_WIDTH
                        },
                        onChange: linkEvent('name', this.onChangeHandler)
                    })),
                    createRow('状态', h('select', {
                        name: 'status',
                        value: item.status,
                        style: {
                            width: INPUT_WIDTH
                        },
                        onChange: linkEvent('status', this.onChangeHandler)
                    }, [h('option', { value: '0', selected: statusArr[0] }, '不启用'), h('option', { value: '1', selected: statusArr[1] }, '启用')])),
                    createRow('运行间隔', h('input', {
                        type: 'text',
                        name: 'interval',
                        value: obj.interval,
                        style: {
                            width: INPUT_WIDTH
                        },
                        onChange: linkEvent('interval', this.onChangeHandler)
                    })),
                    createRow('类型', h('select', {
                        name: 'type',
                        value: item.type,
                        style: {
                            width: INPUT_WIDTH
                        },
                        onChange: linkEvent('type', this.onChangeHandler)
                    }, [h('option', { value: '0', selected: typeArr[0] }, '诊断'), h('option', { value: '1', selected: typeArr[1] }, 'KPI'), h('option', { value: '2', selected: typeArr[2] }, '计算点')])),
                    createRow('描述', h('input', {
                        type: 'text',
                        name: 'desc',
                        value: obj.desc,
                        title: obj.desc,
                        style: {
                            width: INPUT_WIDTH
                        },
                        onChange: linkEvent('desc', this.onChangeHandler)
                    }))
                ]);


            }
        }
    };

    class PropPanel extends React.Component {

        constructor(props, context) {
            super(props, context);

            this.state = {
                items: deepClone([], this.props.items)
            };

            window.propsa = this.props;

            this.onChangeHandler = this.onChangeHandler.bind(this);
            this.onRecover = this.onRecover.bind(this);
        }

        onChangeHandler(key, e) {
            var items = this.state.items;
            var value = e.currentTarget.value;

            items.forEach(function (row) {
                if (key in row) {
                    row[key] = value;
                }
            });

            this.setState({
                items: items
            });
        }

        onRecover() {
            this.setState({
                items: deepClone([], this.props.items)
            })
        }

        componentWillReceiveProps(nextProps) {
            var newKeys = nextProps.selectedIds;
            var oldKeys = this.props.selectedIds;
            var flag = false;

            if (newKeys.length === oldKeys.length && oldKeys.length !== 0) {
                oldKeys.some(function (row) {
                    if (newKeys.indexOf(row) === -1) {
                        flag = true;
                        return true;
                    }
                });
            } else if (oldKeys.length !== newKeys.length) {
                flag = true;
            }
            
            flag && this.setState({
                items: deepClone([], nextProps.items)
            });
        }

        render() {
            actions.dispatch = actions.dispatch || this.context.dispatch;

            return (
                h('div', {
                    id: 'propPanel',
                    style: { width: '100%', height: '100%' }
                }, [
                    theme.topBtns.call(this, this.state.items, this.props.selectedIds),
                    theme.propView.call(this, this.state.items, this.props.selectedIds)
                ])
            );
        }
    }

    exports.PropPanel = PropPanel;
}));
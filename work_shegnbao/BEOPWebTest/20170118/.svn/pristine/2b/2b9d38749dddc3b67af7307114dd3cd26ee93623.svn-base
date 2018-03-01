;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.constants'),
            namespace('React')
        );
    }
}(namespace('beop.strategy.components'), function(exports, constants, React) {

    var h = React.h;
    var linkEvent = React.linkEvent;
    var deepClone = $.extend.bind(true);

    var actions = {
        dispatch: null,
    };

    var theme = {
        tabTitle: function(isInput) {
            var inputActive, outputActive;
            if (isInput) {
                inputActive = "active";
                outputActive = ""
            } else {
                inputActive = "";
                outputActive = "active"
            }
            return (
                h('ul.tabTitle', [
                    h('li', { className: inputActive, 'data-index': "0", onClick: linkEvent(0, this.switchTab) }, ['输入']),
                    h('li', { className: outputActive, 'data-index': "1", onClick: linkEvent(1, this.switchTab) }, ['输出'])
                ])
            );
        },

        toolBar: function() {
            return (
                h('.topBtn', [
                    h('span.glyphicon.glyphicon-plus', { onClick: this.handleAdd })
                ])
            );
        },

        variablesRender: function(model) {
            var _this = this;
            if (model.isInput) {
                var variables = model.input;
            } else {
                var variables = model.output;
            }
            var variableName, variableType, variableDefaultVal, variableDebug;
            var arr = [];

            return (
                h('div', variables.map(function(row, i) {
                    return theme.singleVariable.call(_this, row, i, model);
                }))
            );
        },

        singleVariable: function(singleVariable, index, model) {
            variableName = singleVariable.name;
            variableDebug = singleVariable.debug;
            var isShow = 'none',
                errorInformation;
            if (model.errorInfo.length !== 0) {
                for (var i = 0, length = model.errorInfo.length; i < length; i++) {
                    if (model.errorInfo[i].index === index) {
                        errorInformation = model.errorInfo[i].type;
                        isShow = 'block';
                    }
                }
            }
            var names, dataSourceLayout;
            var names = h('input', {
                name: 'name',
                type: 'text',
                value: variableName,
                onChange: linkEvent({
                    field: 'name',
                    idx: index
                }, this.handleChange)
            });
            dataSourceLayout = h('input', {
                name: 'default',
                type: 'text',
                value: singleVariable.default,
                onChange: linkEvent({
                    field: 'default',
                    idx: index,
                }, this.handleChange)
            })
            var variableType;
            var dataSource = '',
                message = '',
                mail = '',
                num = '';
            var str = '';
            var time = '';
            var json = '';
            var otherModal = '';
            switch (Number(singleVariable.type)) {
                case 0:
                    dataSourceLayout = h('div.dataSource', {
                        ondragover: function(e) {
                            e.preventDefault();
                        },
                        ondragEnter: function(e) {
                            e.preventDefault();
                        },
                        ondrop: function(e) {
                            var dsItemId = EventAdapter.getData().dsItemId;
                            if (AppConfig.datasource.currentObj === 'cloud') {
                                var dragName = $('#tableDsCloud').find('tr[ptid="' + dsItemId + '"]').find('.tabColName').attr('data-value');
                                var currentId = $('#selectPrjName').find('option:selected').val();
                                if (currentId) {
                                    dragName = '@' + currentId + '|' + dragName;
                                } else {
                                    dragName = dsItemId;
                                }
                                _this.handleChange({
                                    field: 'default',
                                    idx: index
                                }, { currentTarget: {value: dragName} });
                            } else {
                                _this.handleChange({
                                    field: 'default',
                                    idx: index
                                }, { currentTarget: {value: dsItemId} });
                            }
                        }
                    }, singleVariable.default || [h('span.glyphicon.glyphicon-plus')])
                    break;
                case 100:
                    names = h('select', {
                        name: 'name',
                        value: singleVariable.refId + '|' + singleVariable.name,
                        onChange: linkEvent({
                            field: 'refId',
                            idx: index
                        }, this.handleChange)
                    }, [
                        h('option', {
                            value: '',
                            selected: !singleVariable.refId,
                        }, '请选择')
                    ].concat(model.moduleOutputs.map(function(m) {
                        return (
                            h('optgroup', {
                                label: m.name
                            }, m.output.map(function(o) {
                                return (
                                    h('option', {
                                        value: m._id + '|' + o.name,
                                        selected: singleVariable.refId === m._id && singleVariable.name === o.name
                                    }, o.name)
                                );
                            }))
                        );
                    })));
                    break;
            }
            return (
                h('div', { className: 'singleVariable', 'data-name': variableName, 'data-index': index }, [
                    h('span.warn', { style: { display: isShow } }, [errorInformation]),
                    h('span.remove.glyphicon.glyphicon-remove-circle', { onClick: linkEvent(index, this.handleRemove) }),
                    h('div', [
                        h('label', ['类型']),
                        h('select', {
                            name: 'type',
                            value: Number(singleVariable.type),
                            onChange: linkEvent({
                                field: 'type',
                                idx: index,
                                valueType: 'number'
                            }, this.handleChange)
                        }, [
                            h('option', {
                                value: 0
                            }, ['数据源']),
                            h('option', {
                                value: 1
                            }, ['短信']),
                            h('option', {
                                value: 2,
                            }, ['邮件']),
                            h('option', {
                                value: 10,
                            }, ['数值']),
                            h('option', {
                                value: 11,
                            }, ['字符串']),
                            h('option', {
                                value: 12,
                            }, ['时间']),
                            h('option', {
                                value: 13,
                            }, ['JSON']),
                            h('option', {
                                value: 100,
                            }, ['引用其他模块']),
                        ])
                    ]),
                    h('div', [
                        h('label', ['变量名']),
                        names
                    ])
                ].concat(singleVariable.type === 100 ? [] : [
                    h('div', [
                        h('label', ['默认值']),
                        dataSourceLayout
                    ])
                ]))
            );
        }
    };

    class VariablePanel extends React.Component {

        constructor(props, context) {
            super(props, context);

            this.state = {
                input: deepClone([], this.props.input),
                output: deepClone([], this.props.output),
                moduleOutputs: this.props.moduleOutputs,
                isInput: true,
                errorInfo: []
            };

            actions.dispatch = actions.dispatch || context.dispatch;

            // 给事件处理函数绑定上下文
            this.switchTab = this.switchTab.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.handleAdd = this.handleAdd.bind(this);
            this.handleRemove = this.handleRemove.bind(this);
        }

        switchTab(tabIndex) {
            this.setState({
                isInput: tabIndex === 0
            });
        }

        handleAdd() {
            var arr = this.state.isInput ? this.state.input : this.state.output;
            
            arr.push({
                name: 'Untitled',
                type: 0,
                default: 0,
                refId: ''
            });

            this.setState(this.state.isInput ? {
                input: arr
            } : {
                output: arr
            });

            this.handleUpdate();
        }

        handleUpdate() {
            this.props.handleUpdate({
                input: this.state.input,
                output: this.state.output
            });
        }

        handleRemove(idx) {
            var arr = this.state.isInput ? this.state.input : this.state.output;

            arr.splice(idx, 1);

            this.setState(this.state.isInput ? {
                input: arr
            } : {
                output: arr
            });

            this.handleUpdate();
        }

        handleChange(data, e) {
            var field = data.field;
            var value = e.currentTarget.value;
            var idx = data.idx;
            var arr = this.state.isInput ? this.state.input : this.state.output;
            var tmp;

            if (field === 'refId') {
                tmp = value.split('|');
                arr[idx][field] = tmp[0];
                arr[idx]['name'] = tmp[1];
            } else {
                arr[idx][field] = data.valueType === 'number' ? parseInt(value) : value;
            }

            this.setState(this.state.isInput ? {
                input: arr
            } : {
                output: arr
            });

            this.handleUpdate();
        }

        render() {
            return (
                h('div', [
                    theme.tabTitle.call(this, this.state.isInput),
                    h('div.variablesType', [
                        theme.toolBar.call(this),
                        h('div.variables.gray-scrollbar.scrollable-y', [
                            theme.variablesRender.call(this, this.state)
                        ])
                    ])
                ])
            );
        }
    }

    exports.VariablePanel = VariablePanel;
}));
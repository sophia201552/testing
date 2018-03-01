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
            namespace('ReactCodeMirror'),
            namespace('beop.strategy.components.modals.InputParamModal'),
            namespace('beop.strategy.components.modals.OutputParamModal'),
            namespace('beop.strategy.enumerators'),
            namespace('beop.common.components.CodeEditor')
        );
    }
}(namespace('beop.strategy.components.moduleConfigPanels'), function(
    exports,
    React,
    antd,
    ReactCodeMirror,
    InputParamModal,
    OutputParamModal,
    enums,
    CodeEditor
) {
    var h = React.h;
    var linkEvent = React.linkEvent;

    const { Layout, Form, Tag, Button } = antd;
    const { Content, Header } = Layout;
    const FormItem = Form.Item;

    const ModuleForm = Form.create({
        mapPropsToFields: function (props) {
            return {
                input: {
                    value: props.input
                },
                output: {
                    value: props.output
                },
                'content.code': {
                    value: props.content.code || ''
                }
            };
        }
    })(React.createClass({
        //getInitialState() {
        //    return {
        //        modal: {
        //            type: null
        //        }
        //    }
        //},
        //

        render() {
            const { form } = this.props;
            const { getFieldDecorator } = form;

            return (
                h(Form, {
                    id: 'codeEditorInForm'
                }, [
                    h(FormItem, {
                        style: {
                            height: '100%'
                        },
                        label: I18n.resource.moduleContent.CODE
                    }, [
                        getFieldDecorator('content.code', {
                            initialValue: ''
                        })(
                            h(CodeEditor, {
                                style: {
                                    height: '100%'
                                }
                            })
                        )
                    ])
                ])
            );
        }
    }));

    class PythonConfigPanel extends React.Component {
        constructor(props) {
            super(props);

            this.state = {};
            this.onOk = this.onOk.bind(this);
            this.saveFormRef = this.saveFormRef.bind(this);

            this.form = null;
        }

        onOk() {
            var _this = this;

            this.form.validateFields((err, values) => {
                if (!err) {
                    _this.props.doOk(_this.props.moduleId, Object.assign({}, _this.props.module.option, values));
                }
            });
        }

        saveFormRef(form) {
            this.form = form;
        }

        shouldComponentUpdate() {
            // 交由 CodeEditor 控件处理内部状态更新
            return false;
        }
        render() {
            const {
                moduleId,
                modules,
                doCancel
            } = this.props;

            const module = (function (modules = []) {
                var module = {option:{input:[],output:[],content:{}}};
                modules.some(function (row) {
                    if (row._id === moduleId) {
                        module = row;
                        return true;
                    }
                });
                return module;
            } (modules));

            const otherModuleOutputs = (function (modules = []) {
                var list = [];

                modules.forEach(function (row) {
                    if (row._id === moduleId) {
                        return;
                    }
                    list.push({
                        _id: row._id,
                        name: row.name,
                        output: row.option.output
                    });
                });
                return list;
            } (modules));

            return (
                h(Content, {
                    className: 'module-config-panel',
                    style: {
                        height: '100%'
                    }
                }, [
                    h(Header, {
                        className: 'config-panel-header clearfix'
                    }, [
                        h('div.config-panel-title', [
                            I18n.resource.moduleContent.PYTHON_MODULE_TO_EDIT+` - ${module.name}`
                        ]),
                        h('div.config-panel-header-right', [
                            h(Button, {
                                type: 'primary',
                                onClick: this.onOk
                            }, [I18n.resource.moduleContent.OK]),
                            h(Button, {
                                onClick: doCancel
                            }, [I18n.resource.moduleContent.CANCEL])
                        ])
                    ]),
                    h(Content, {
                        className: 'config-panel-content'
                    }, [
                        h(ModuleForm, {
                            input: module.option.input,
                            output: module.option.output,
                            content: module.option.content,
                            otherModuleOutputs: otherModuleOutputs,
                            ref: this.saveFormRef
                        })
                    ])
                ])
            );
        }
    }

    exports.PythonConfigPanel = PythonConfigPanel;
}));
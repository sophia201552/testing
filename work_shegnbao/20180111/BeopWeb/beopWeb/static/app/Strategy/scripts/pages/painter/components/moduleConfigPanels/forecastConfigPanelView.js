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

    class ForecastConfigPanel extends React.Component {
        constructor(props) {
            super(props);

            this.state = {};
            this.onOk = this.onOk.bind(this);
        }

        onOk() {
            //var _this = this;
            //
            //this.form.validateFields((err, values) => {
            //    if (!err) {
            //        _this.props.doOk(_this.props.moduleId, Object.assign({}, _this.props.module.option, values));
            //    }
            //});
            this.props.doOk(this.props.moduleId, Object.assign({}, this.props.module.option));
        }

        render() {
            const {
                moduleId,
                modules,
                doCancel
            } = this.props;

            const module = (function () {
                var module;
                modules.some(function (row) {
                    if (row._id === moduleId) {
                        module = row;
                        return true;
                    }
                });
                return module;
            } ());

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
                            I18n.resource.moduleContent.FORECAST_MODULE_TO_EDIT + ` - ${module.name}`
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

                    ])
                ])
            );
        }
    }

    exports.ForecastConfigPanel = ForecastConfigPanel;
}));
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
            namespace('beop.strategy.enumerators'),
            namespace('antd')
        );
    }
}(namespace('beop.common.components'), function(
    exports,
    React,
    enums,
    antd
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const deepClone = $.extend.bind($, true);

    const { Modal, Button, message, Spin ,Form, DatePicker} = antd;
    const FormItem = Form.Item;
    const StrategySupplementModal = Form.create()(
        React.createClass({
            getInitialState() {
                return {
                    loading: false,
                    visible: false,
                    spinning: false,
                    btnDisabled: false,
                    data: {
                        startTime: null,
                        endTime:null
                    }
                };
            },
            componentWillReceiveProps(props) {
                this.setState({
                    visible: props.isShowStrategySupplementModal
                });
            },
            onChange(type, value) {
                let data = deepClone({}, this.state.data);
                data[type] = value;
                this.setState({
                    data:data
                })
            },
            handleCancel() {
                this.props.hideSupplementModal();
                this.props.form.resetFields();
            },
            handleOk() {
                let _this = this;
                this.props.form.validateFields((err, formData) => {
                    if (err) {
                        return;
                    }
                    _this.handleCancel();
                })
            },
            render() {
                const {visible,loading,spinning,btnDisabled} = this.state;
                const { form} = this.props;
                const { getFieldDecorator } = form;
                return (
                    h(Modal,{
                        visible: visible,
                        maskClosable:false,
                        title: I18n.resource.modal.SUPPLEMENTARY_DIAGNOSIS,
                        onOk: this.handleOk,
                        onCancel: this.handleCancel,
                        footer: [
                            h(Button,{
                                key: 'back',
                                size: 'large',
                                onClick: this.handleCancel
                            },[I18n.resource.modal.CANCEL]),
                            h(Button,{
                                key: 'save',
                                size: 'large',
                                type: 'primary',
                                loading: loading,
                                disabled: btnDisabled,
                                onClick: this.handleOk
                            },[I18n.resource.modal.SAVE])
                        ]
                    },[
                         h(Form,[
                             h(FormItem,{
                                 label: I18n.resource.modal.START_TIME,
                                 labelCol:{ span: 6 },
                                 wrapperCol:{ span: 14 }
                             },[
                                 getFieldDecorator('startTime', {
                                     rules: [{ type: 'object', required: true, message: I18n.resource.message.TIME_NOT_EMPTY }]
                                 })(
                                     h(DatePicker, {
                                         placeholder:"startTime",
                                         onChange: function(field,value){
                                             this.onChange("startTime",value)
                                         }.bind(this),
                                         showTime: true,
                                         format:"YYYY-MM-DD HH:mm"
                                     })
                                 )
                             ]),
                             h(FormItem,{
                                 label: I18n.resource.modal.END_TIME,
                                 labelCol:{ span: 6 },
                                 wrapperCol:{ span: 14 }
                             },[
                                 getFieldDecorator('endTime', {
                                     rules: [{ type: 'object', required: true, message: I18n.resource.message.TIME_NOT_EMPTY }]
                                 })(
                                     h(DatePicker, {
                                         placeholder:"endTime",
                                         onChange: function(field, value){
                                             this.onChange("endTime",value)
                                         }.bind(this),
                                         showTime: true,
                                         format:"YYYY-MM-DD HH:mm"
                                     })
                                 )
                             ])
                        ])
                    ])
                )
            }
        })
    )

    exports.StrategySupplementModal = StrategySupplementModal;
}));
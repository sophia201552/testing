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
            namespace('beop.strategy.enumerators'),
            namespace('moment')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    enums,
    moment
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    const deepClone = $.extend.bind($, true);

    const {  Form,Row , Col, Button ,Tag, Input, Select,Modal,Icon,DatePicker} = antd;
    const FormItem = Form.Item;
    const InputGroup = Input.Group;
    const Option = Select.Option;

    const DataSourceModal = Form.create({
        mapPropsToFields(props) {
            var data = props.data;
            if (!$.isEmptyObject(data)) {
                let values = {};
                if(data.startTime){
                    values.startTime = {value: moment(data.startTime, "YYYY-MM-DD HH:mm:ss")}
                }
                if(data.endTime){
                    values.endTime = {value: moment(data.endTime, "YYYY-MM-DD HH:mm:ss")}
                }
                if(data.timeFormat){
                    values.timeFormat = {value: data.timeFormat}
                }
                return values
            }
            return {};
        }
    })(
        React.createClass({
            getInitialState() {
                return {
                    _id: null
                };
            },
            componentDidMount() {
                this.setState({
                    _id: this.props._id
                });
            },
            onChange(value){
                if(value === '1'){
                    this.setState({
                        type: value
                    });
                }
            },
            handleAfterClose() {
                this.props.form.resetFields();
            },
            submitForm(){
                let _this = this;
                this.props.form.validateFields((err, formData) => {
                    let data = {
                        startTime: formData.startTime?formData.startTime.format("YYYY-MM-DD HH:mm:ss"):"",
                        endTime : formData.endTime?formData.endTime.format("YYYY-MM-DD HH:mm:ss"):"",
                        timeFormat : formData.timeFormat?formData.timeFormat:null
                    };
                    if(_this.props._id){
                        data._id = _this.props._id;
                    }
                    _this.props.onOk(data);
                });
            },
            render(){
                const { form ,visible, onCancel} = this.props;
                const { getFieldDecorator } = form;
                let values = form.getFieldsValue();

                return (
                    h(Modal, {
                        visible: visible,
                        maskClosable:false,
                        width: 800,
                        title: I18n.resource.modal.DATA_SOURCE_CONFIGURATION,
                        okText: I18n.resource.modal.OK,
                        cancelText: I18n.resource.modal.CANCEL,
                        onOk: this.submitForm,
                        onCancel: onCancel,
                        afterClose: this.handleAfterClose
                    },[
                        h("div",{className:"modalContent gray-scrollbar"},[
                        h(Form,{id:"dataSourceForm"}, [
                        h(FormItem,{
                             label: I18n.resource.modal.START_TIME,
                             labelCol:{ span: 4 },
                             wrapperCol:{ span: 16 }
                        },[
                             getFieldDecorator('startTime', {
                                 //rules: [{ type: 'object', required: true, message: '时间不能为空！' }]
                             })(
                                 h(DatePicker, {
                                     placeholder:"startTime",
                                     showTime: true,
                                     format:"YYYY-MM-DD HH:mm:ss"
                                 })
                             )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.END_TIME,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                             getFieldDecorator('endTime', {
                                 //rules: [{ type: 'object', required: true, message: '时间不能为空！' }]
                             })(
                                 h(DatePicker, {
                                     placeholder:"endTime",
                                     showTime: true,
                                     format:"YYYY-MM-DD HH:mm:ss"
                                 })
                             )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.TIME_INTERVAL,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator("timeFormat",{
                                //initialValue: "0",
                                //rules: [{ required: true, message: '时间间隔不能为空！' }]
                            })(
                                h(Select, {placeholder: I18n.resource.placeholder.SELECT_TIME_INTERVAL}, [
                                    h(Option, {
                                        value: "m5"
                                    }, [I18n.resource.moduleProp.FIVE_MINUTES]),
                                    h(Option, {
                                        value: "h1"
                                    }, [I18n.resource.moduleProp.ONE_HOUR]),
                                    h(Option, {
                                        value: "d1"
                                    }, [I18n.resource.moduleProp.ONE_DAY])
                                ])
                            )
                        ])
                    ])
                    ])
                ])
            )}
        })
    );

    exports.DataSourceModal = DataSourceModal;
}));
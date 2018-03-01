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
            namespace('antd'),
            namespace('moment')
        );
    }
}(namespace('beop.common.components'), function(
    exports,
    React,
    enums,
    antd,
    moment
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const deepClone = $.extend.bind($, true);

    const { Layout, Select, Input, Form, DatePicker,TimePicker ,Modal,Checkbox,message } = antd;
    const { Content, Sider } = Layout;
    const Option = Select.Option;
    const CheckboxGroup = Checkbox.Group;
    const FormItem = Form.Item;

    class setTriggerConfig extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                options: this.props.value || {},
                timeValidateStatus: "success",
                timeHelp: null,
                stepValidateStatus: "success",
                stepHelp: null
            };
        }
        componentWillReceiveProps(nextProps) {
            if ('value' in nextProps) {
                const value = nextProps.value;
                this.setState({
                    options: value || {}
                });
            }
        }
        changeStep(value){
            if(value.length === 0){
                this.setState({
                    stepValidateStatus: "error",
                    stepHelp:this.props.type === "month"?I18n.resource.title.DAYS_EMPTY :I18n.resource.title.INTERVAL_EMPTY
                });
            }else{
                this.setState({
                    stepValidateStatus: "success",
                    stepHelp:null
                });
            }
            var data = deepClone({},this.state.options);
            if(value instanceof Array){
                data.step = value;
            }else{
                if(!value){
                    data.step = value;
                }else{
                    data.step = parseInt(value);
                }
            }

            this.props.onChange(data);
        }
        changeTime(value){
            if(value.length === 0){
                this.setState({
                    timeValidateStatus: "error",
                    timeHelp:this.props.type === "month"?I18n.resource.title.MONTH_EMPTY :I18n.resource.title.TIME_EMPTY
                });
            }else{
                this.setState({
                    timeValidateStatus: "success",
                    timeHelp:null
                });
            }
            var data = deepClone({},this.state.options);
            data.time = value;

            this.props.onChange(data);
        }
        getChildren(type){
            var children = [];
            switch (type){
                case "month":
                    var data = [
                        {key: I18n.resource.modal.JANUARY,value: '0'},
                        {key: I18n.resource.modal.FEBRUARY,value: '1'},
                        {key: I18n.resource.modal.MARCH,value: '2'},
                        {key: I18n.resource.modal.APRIL,value: '3'},
                        {key: I18n.resource.modal.MAY,value: '4'},
                        {key: I18n.resource.modal.JUNE,value: '5'},
                        {key: I18n.resource.modal.JULY,value: '6'},
                        {key: I18n.resource.modal.AUGUST,value: '7'},
                        {key: I18n.resource.modal.SEPTEMBER,value: '8'},
                        {key: I18n.resource.modal.OCTOBER,value: '9'},
                        {key: I18n.resource.modal.NOVEMBER,value: '10'},
                        {key: I18n.resource.modal.DECEMBER,value: '11'}
                    ];
                    var len = data.length;
                    for (let i = 0; i < len; i++) {
                        children.push(h(Option,{ value: data[i].value }, [data[i].key]));
                    }
                    break;
                case "day":
                    for (let i = 1; i < 32; i++) {
                        children.push(h(Option,{ value: i.toString() },[i+I18n.resource.modal.HAO]));
                    }
                    children.push(h(Option,{ value: "lastDay" }, [I18n.resource.modal.LAST_DAY]));
                    break;
            }
            return children;
        }
        setTime(){
            var data = this.state.options;
            if(!$.isEmptyObject(data)){
                switch (this.props.type){
                    case "one":
                        return (
                            h(FormItem,{
                                label: I18n.resource.modal.TIME,
                                labelCol:{ span: 4 },
                                wrapperCol:{ span: 16 },
                                style:{
                                    marginBottom: 24
                                },
                                required: true,
                                validateStatus: this.state.timeValidateStatus,
                                help: this.state.timeHelp
                            },[
                                h(DatePicker, {
                                    placeholder:I18n.resource.placeholder.SELECT_TIME,
                                    showTime: true,
                                    value: data.time ? moment(data.time, "YYYY-MM-DD HH:mm:ss") : "",
                                    format:"YYYY-MM-DD HH:mm:ss",
                                    onChange: function(date, dateString){
                                        this.changeTime(dateString);
                                    }.bind(this)
                                })
                            ])
                        );
                        break;
                    case "day":
                        return (
                            h(FormItem,{
                                label: I18n.resource.modal.TIME,
                                labelCol:{ span: 4 },
                                wrapperCol:{ span: 16 },
                                style:{
                                    marginBottom: 24
                                },
                                required: true,
                                validateStatus: this.state.timeValidateStatus,
                                help: this.state.timeHelp
                            },[
                                h(TimePicker,{
                                    placeholder:I18n.resource.placeholder.SELECT_TIME,
                                    format:"HH:mm",
                                    value: data.time ? moment(data.time, "HH:mm") : "",
                                    onChange: function(date, dateString){
                                        this.changeTime(dateString);
                                    }.bind(this)
                                })
                            ])
                        );
                        break;
                    case "week":
                        return (
                            h(FormItem,{
                                label: I18n.resource.modal.TIME,
                                labelCol:{ span: 4 },
                                wrapperCol:{ span: 16 },
                                style:{
                                    marginBottom: 24
                                },
                                required: true,
                                validateStatus: this.state.timeValidateStatus,
                                help: this.state.timeHelp
                            },[
                                h(CheckboxGroup ,{
                                    options: [
                                        { label: I18n.resource.modal.MONDAY, value: 0 },
                                        { label: I18n.resource.modal.TUESDAY, value: 1 },
                                        { label: I18n.resource.modal.WEDNESDAY, value: 2 },
                                        { label: I18n.resource.modal.THURSDAY, value: 3 },
                                        { label: I18n.resource.modal.FRIDAY, value: 4 },
                                        { label: I18n.resource.modal.SATURDAY, value: 5 },
                                        { label: I18n.resource.modal.SUNDAY, value: 6 }
                                    ],
                                    value: data.time,
                                    onChange: function(checkedValues){
                                        checkedValues.sort(function(a,b){
                                            return a > b;
                                        });
                                        this.changeTime(checkedValues)
                                    }.bind(this)
                                })
                            ])
                        );
                        break;
                    case "month":
                        data.time.forEach(function(row,i){
                            data.time[i] = row.toString();
                        });
                        return (
                            h(FormItem,{
                                label: I18n.resource.modal.MONTH,
                                labelCol:{ span: 4 },
                                wrapperCol:{ span: 16 },
                                style:{
                                    marginBottom: 24
                                },
                                required: true,
                                validateStatus: this.state.timeValidateStatus,
                                help: this.state.timeHelp
                            },[
                                h(Select,{
                                    mode:"multiple",
                                    placeholder:I18n.resource.placeholder.SELECT_MONTH_MORE,
                                    value: data.time,
                                    onChange: function(values){
                                        values.sort(function(a,b){
                                            return parseInt(a) > parseInt(b);
                                        });
                                        this.changeTime(values)
                                    }.bind(this)
                                },this.getChildren("month"))
                            ])
                        );
                        break;
                }
            }else{
                return null;
            }
        }
        setStep(){
            var data = this.state.options;
            if(!$.isEmptyObject(data)){
                switch (this.props.type){
                    case "one":
                        return (
                            h(FormItem,{
                                label: I18n.resource.modal.INTERVAL,
                                labelCol:{ span: 4 },
                                wrapperCol:{ span: 16 },
                                style:{
                                    display: "none"
                                }
                            },[
                                h("span",[I18n.resource.modal.EVERY]),
                                h(Input,{
                                    style:{
                                        width: 40,
                                        margin: "0 5px"
                                    },
                                    size:"small",
                                    value: data.step,
                                    onChange: function(e){
                                        this.changeStep(e.target.value)
                                    }.bind(this)
                                }),
                                h("span",[I18n.resource.modal.DAY_HAPPENS_ONCE])
                            ])
                        );
                        break;
                    case "day":
                        return (
                            h(FormItem,{
                                label: I18n.resource.modal.INTERVAL,
                                labelCol:{ span: 4 },
                                wrapperCol:{ span: 16 },
                                style:{
                                    marginBottom: 24
                                },
                                required: true,
                                validateStatus: this.state.stepValidateStatus,
                                help: this.state.stepHelp
                            },[
                                h("span",[I18n.resource.modal.EVERY]),
                                h(Input,{
                                    style:{
                                        width: 40,
                                        margin: "0 5px"
                                    },
                                    size:"small",
                                    value: data.step,
                                    onChange: function(e){
                                        this.changeStep(e.target.value)
                                    }.bind(this)
                                }),
                                h("span",[I18n.resource.modal.DAY_HAPPENS_ONCE])
                            ])
                        );
                        break;
                    case "week":
                        return (
                            h(FormItem,{
                                label: I18n.resource.modal.INTERVAL,
                                labelCol:{ span: 4 },
                                wrapperCol:{ span: 16 },
                                style:{
                                    marginBottom: 24
                                },
                                required: true,
                                validateStatus: this.state.stepValidateStatus,
                                help: this.state.stepHelp
                            },[
                                h("span",[I18n.resource.modal.EVERY]),
                                h(Input,{
                                    style:{
                                        width: 40,
                                        margin: "0 5px"
                                    },
                                    size:"small",
                                    value: data.step,
                                    onChange: function(e){
                                        this.changeStep(e.target.value)
                                    }.bind(this)
                                }),
                                h("span",[I18n.resource.modal.WEEK_HAPPENS_ONCE])
                            ])
                        );
                        break;
                    case "month":
                        data.step.forEach(function(row,i){
                            if(isNaN(row)){
                                data.step[i] = row;
                            }else{
                                data.step[i] = row.toString();
                            }
                        });
                        return (
                            h(FormItem,{
                                label: I18n.resource.modal.DAY,
                                labelCol:{ span: 4 },
                                wrapperCol:{ span: 16 },
                                style:{
                                    marginBottom: 24
                                },
                                required: true,
                                validateStatus: this.state.stepValidateStatus,
                                help: this.state.stepHelp
                            },[
                                h(Select,{
                                    mode:"multiple",
                                    placeholder:I18n.resource.placeholder.SELECT_DAY_MORE,
                                    value: data.step,
                                    onChange: function(values){
                                        values.sort(function(a,b){
                                            if(isNaN(a)){
                                                a = 100;
                                            }else if(isNaN(b)){
                                                b = 100;
                                            }
                                            return parseInt(a) > parseInt(b);
                                        });
                                        this.changeStep(values)
                                    }.bind(this)
                                },this.getChildren("day"))
                            ])
                        );
                        break;
                }
            }else{
                return null;
            }
        }
        render (){
            return (
                h("div",[
                    this.setTime(),
                    this.setStep()
                ])
            )
        }
    }

    const StrategyTriggerModal = Form.create({
        mapPropsToFields(props) {
            var data = props.data;
            if (!$.isEmptyObject(data)) {
                let values = {};
                values.type = {value: data.type };
                values.options = {value: data.options};

                return values
            }
            return {};
        }
    })(
        React.createClass({
            getInitialState() {
                return {
                    data: null,
                    visible: false
                };
            },
            componentWillReceiveProps(props) {
                this.setState({
                    data: props.data,
                    visible: props.isShowStrategyTriggerModal
                });
            },

            changeType(type){
                var data = deepClone({},this.state.data);
                data.type = type;
                data.options = {};
                switch (type){
                    case "one":
                        data.options.time = new Date().format("yyyy-MM-dd HH:mm:ss");//moment(new Date().format("yyyy-MM-dd HH:mm:ss"), "YYYY-MM-DD HH:mm:ss");
                        data.options.step = 1;
                        break;
                    case "day":
                        data.options.time = "00:00";//moment("00:00", "HH:mm");
                        data.options.step = 1;
                        break;
                    case "week":
                        data.options.time = [];
                        data.options.step = 1;
                        break;
                    case "month":
                        data.options.time = [];
                        data.options.step = [];
                        break;
                }
                this.props.form.setFieldsValue({
                    ["type"]: data.type,
                    ["options"]: data.options
                });
            },
            onCancel(){
                this.props.hideStrategyTriggerModal();
            },
            onOk(){
                let _this = this;
                this.props.form.validateFields((err, formData) => {
                    if (err) {
                        return;
                    }
                    if(formData.options.time.length === 0 || formData.options.step.length === 0){
                        message.error(I18n.resource.message.INCOMPLETE_CONFIGURATION);
                        return;
                    }
                    let data = {
                        type: formData.type,
                        options: formData.options
                    };
                    if(data.type === "month"){
                        var time = data.options.time;
                        var step = data.options.step;
                        time.forEach(function(row,i){
                            time[i] = parseInt(row);
                        });
                        step.forEach(function(row,i){
                            if(isNaN(row)){
                                step[i] = row;
                            }else{
                                step[i] = parseInt(row);
                            }
                        })
                    }
                    _this.props.hideStrategyTriggerModal();
                    _this.props.saveStrategyTriggerModal(data);
                });
            },
            render() {

                const {
                    data,
                    visible,
                } = this.state;
                const { form } = this.props;
                const { getFieldDecorator } = form;
                let values = form.getFieldsValue();


                return (
                    h(Modal,{
                        visible: visible,
                        maskClosable:false,
                        title: I18n.resource.modal.TRAIN_INTERVAL,
                        okText: I18n.resource.modal.OK,
                        cancelText: I18n.resource.modal.CANCEL,
                        onCancel:this.onCancel,
                        onOk: this.onOk,
                        wrapClassName: "gray-scrollbar vertical-top-modal"
                    },[
                        h("div",[
                            h(Form,[
                                h(FormItem,{
                                     label: I18n.resource.modal.TYPE,
                                     labelCol:{ span: 4 },
                                     wrapperCol:{ span: 16 }
                                },[
                                     getFieldDecorator('type', {
                                         rules:  [{ required: true, message: I18n.resource.message.TYPE_NOT_EMPTY }]
                                     })(
                                         h(Select,{
                                             onChange: this.changeType
                                         },[
                                             h(Option, { value: "one" }, [I18n.resource.modal.ONCE]),
                                             h(Option, { value: "day" }, [I18n.resource.modal.EVERYDAY]),
                                             h(Option, { value: "week" }, [I18n.resource.modal.WEEKLY]),
                                             h(Option, { value: "month" }, [I18n.resource.modal.MONTHLY])
                                         ])
                                     )
                                ]),
                                h(FormItem,{
                                    //label: '配置',
                                    //labelCol:{ span: 4 },
                                    //wrapperCol:{ span: 16 }
                                },[
                                    getFieldDecorator("options",{
                                        initialValue: {}
                                    })(
                                        h(setTriggerConfig,{
                                            type: values.type || "",
                                            form: form
                                        })
                                    )
                                ])
                            ])
                        ])
                    ])
                );
            }
        })
    );

    exports.StrategyTriggerModal = StrategyTriggerModal;
}));
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
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    enums
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const deepClone = $.extend.bind($, true);

    const { Modal, Input, Button, Form, Select ,Icon, Tag, Popconfirm} = antd;
    const { CheckableTag } = Tag;
    const FormItem = Form.Item;
    const { Option, OptGroup } = Select;

    const ModalForm = Form.create({
        mapPropsToFields(props) {
            let data = props.data;
            if (data && !$.isEmptyObject(data)) {
                let values = {
                    name: {value: data.name},
                    type: {value: data.type.toString()},
                    desc: {value: data.desc || ""}
                };
                return values;
            }
            return {};
        }
    })(
        React.createClass({
            getInitialState() {
                return {
                    data:this.props.data,
                    copyNumber: 0
                };
            },
            changeValue(value,key){
                let data = deepClone({}, this.props.data);
                data[key] = value;
                this.props.configModal(data);
            },
            changeStatus(checked){
                let data = deepClone({}, this.props.data);
                var status;
                if(checked){
                    status = 1;
                }else {
                    status = 0;
                }
                data.option.status = status;
                this.props.configModal(data);
            },
            configParameter(type){
                //if(type === 31){
                    this.props.configParameter();
                //}else{
                //    this.props.configDataSource();
                //}
            },
            setBatchTitle(){
                return(
                    h("div",[
                        h("span",[I18n.resource.inputOutputParameter.BULK_COPY]),
                        h(Input,{
                            style:{
                                width:"25%"
                            },
                            size:"small",
                            onChange: function(e){
                                if(!isNaN(e.target.value)){
                                    var value = parseInt(e.target.value);
                                    this.setState({
                                        copyNumber: value
                                    })
                                }
                            }.bind(this)
                        }),
                        h("span",[I18n.resource.inputOutputParameter.Parameters])
                    ])
                )
            },
            tooltipConfirm(){
                var copyNumber = this.state.copyNumber || 0;
                if(copyNumber > 0){
                    this.props.batchParameter(copyNumber);
                }
            },
            handleAfterClose: function () {
                this.props.form.resetFields();
            },
            upParameter(){
                var curItem = $(".inputOutputConfigPanel[data-id = "+ this.props.data._id +"]");
                curItem.addClass("upDiv");
            },
            downParameter(){
                var curItem = $(".inputOutputConfigPanel[data-id = "+ this.props.data._id +"]");
                curItem.removeClass("upDiv");
            },
            render() {
                const { deleteParameter,copyParameter, disabled,form} = this.props;
                const { getFieldDecorator } = form;
                let values = form.getFieldsValue();

                return (
                    h("div.inputOutputConfigPanel", {
                        style:{
                            borderBottom: "1px solid #495252",
                            cursor:"pointer",
                            position:"relative",
                            padding: "4px 8px"
                        },
                        "data-id":this.props.data._id,
                    }, [
                        h(Form, [
                            h(FormItem, {
                                style:{
                                    marginBottom: 0
                                },
                                label: I18n.resource.inputOutputParameter.PARAMETER_NAME,
                                labelCol:{ span: 6 },
                                wrapperCol:{ span: 14 }
                            }, [
                                getFieldDecorator('name', {
                                    rules: [{ required: true, message: I18n.resource.message.PARAMETER_NAME_EMPTY }]
                                })(
                                    h(Input, {
                                        title: values.name? values.name : "",
                                        style:{
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis"
                                        },
                                        size:"small",
                                        placeholder:I18n.resource.placeholder.ENTER_PARAMETER_NAME,
                                        onChange: function(e){
                                            this.changeValue(e.target.value,"name")
                                        }.bind(this),
                                        disabled:disabled
                                    })
                                )
                            ]),
                            h(FormItem, {
                                style:{
                                    marginBottom: 0
                                },
                                className:"upDom",
                                label: I18n.resource.inputOutputParameter.TYPE,
                                labelCol:{ span: 6 },
                                wrapperCol:{ span: 14 }
                            }, [
                                getFieldDecorator('type', {
                                    rules: [{ required: true, message: I18n.resource.message.PARAMETER_TYPE_EMPTY }]
                                })(
                                    h(Select, {
                                        size:"small",
                                        placeholder: I18n.resource.placeholder.SELECT_PARAMETER_TYPE,
                                        onChange: function(value){
                                            this.changeValue(parseInt(value),"type")
                                        }.bind(this),
                                        disabled:disabled
                                    }, [
                                        h(Option, {
                                            value: enums.moduleInputOutputTypes.OUTPUT_DATA_SOURCE.toString()
                                        }, [enums.moduleInputOutputTypeNames[enums.moduleInputOutputTypes.OUTPUT_DATA_SOURCE]]),
                                        h(Option, {
                                            value: enums.moduleInputOutputTypes.COMMON_VARIABLE.toString()
                                        }, [enums.moduleInputOutputTypeNames[enums.moduleInputOutputTypes.COMMON_VARIABLE]]),
                                        h(Option, {
                                            value: enums.moduleInputOutputTypes.OUTPUT_DIAGNOSIS.toString()
                                        }, [enums.moduleInputOutputTypeNames[enums.moduleInputOutputTypes.OUTPUT_DIAGNOSIS]])
                                    ])
                                )
                            ]),
                            h(Icon ,{
                                style:{
                                    position:"absolute",
                                    top:"10%",
                                    right:"10%",
                                    display: this.props.data.type === 31 ?"block":'none'
                                },
                                className:"upDom",
                                type:"setting",
                                title:I18n.resource.title.CONFIGURATION_PARAMETER,
                                onClick: function(){
                                    this.configParameter(this.props.data.type)
                                }.bind(this)
                            }),
                            h(FormItem, {
                                style:{
                                    marginBottom: 0
                                },
                                className:"upDom",
                                label: I18n.resource.inputOutputParameter.ANNOTATION,
                                labelCol:{ span: 6 },
                                wrapperCol:{ span: 14 }
                            }, [
                                getFieldDecorator('desc', {
                                    //rules: [{ required: true, message: '默认值不能为空！' }]
                                })(
                                    h(Input, {
                                        style:{
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis"
                                        },
                                        title: values.desc? values.desc : "",
                                        size:"small",
                                        placeholder:I18n.resource.placeholder.FILL_PARAMETER_ANNOTATION,
                                        onChange: function(e){
                                            this.changeValue(e.target.value,"desc")
                                        }.bind(this),
                                        disabled:disabled
                                    })
                                )
                            ]),
                            h(Icon ,{
                                className:"upDom",
                                style:{
                                    position:"absolute",
                                    top:"10%",
                                    right:"2%"
                                },
                                type:"close-circle",
                                title:I18n.resource.title.DELETE_PARAMETER,
                                onClick: deleteParameter
                            }),
                            h(Icon ,{
                                style:{
                                    position:"absolute",
                                    top:"30%",
                                    right:"10%"
                                },
                                className:"upDom",
                                type:"copy",
                                title:I18n.resource.title.COPY_PARAMETER,
                                onClick: copyParameter
                            }),
                            h(Icon ,{
                                className:"upDom",
                                style:{
                                    position:"absolute",
                                    top:"50%",
                                    right:"2%"
                                },
                                title:I18n.resource.title.UP_PARAMETER,
                                type:"up",
                                onClick: this.upParameter
                            }),
                            h(Icon ,{
                                className:"downDom",
                                style:{
                                    position:"absolute",
                                    top:"35%",
                                    right:"2%"
                                },
                                title:I18n.resource.title.DOWN_PARAMETER,
                                type:"down",
                                onClick: this.downParameter
                            }),
                            h(Popconfirm ,{
                                title: this.setBatchTitle(),
                                okText:"Yes",
                                cancelText:"No",
                                placement:"right",
                                onConfirm: this.tooltipConfirm
                            },[
                                h(Icon ,{
                                    style:{
                                        position:"absolute",
                                        top:"30%",
                                        right:"2%"
                                    },
                                    className:"upDom",
                                    title:I18n.resource.title.BULK_COPY_PARAMETER,
                                    type:"switcher"
                                })
                            ]),
                            this.props.data.type === 31 ?h(CheckableTag,{
                                style:{
                                    position:"absolute",
                                    bottom:8,
                                    right:"-1%"
                                },
                                className:"upDom",
                                checked:this.props.data.option.status === 1 || typeof this.props.data.option.status=== "undefined" ?true:false,
                                onChange:this.changeStatus
                            },[this.props.data.option.status === 1 || typeof this.props.data.option.status=== "undefined"?I18n.resource.inputOutputParameter.ENABLE:I18n.resource.inputOutputParameter.DISABLE]):null
                        ])
                    ])
                );
            }
        })
    );

    const OutputParamModal = ModalForm;

    exports.OutputParamModal = OutputParamModal;
}));
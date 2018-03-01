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

    const { Modal, Input, Button, Form, Select ,Icon, Tag, Popconfirm } = antd;
    const { CheckableTag } = Tag;
    const FormItem = Form.Item;
    const { Option, OptGroup } = Select;

    const mapParamDefaultValue = {
        [enums.moduleInputOutputTypes.DATA_SOURCE]: 0,
        [enums.moduleInputOutputTypes.INPUT_HISTORY_DATA_SOURCE]: 0,
        [enums.moduleInputOutputTypes.OUTPUT_DATA_SOURCE]: 0,
        [enums.moduleInputOutputTypes.NUMBER]: 0,
        [enums.moduleInputOutputTypes.STRING]: 'None',
        [enums.moduleInputOutputTypes.OTHER_MODULES]: '',
        [enums.moduleInputOutputTypes.INPUT_DIAGNOSIS_FUZZYRULE]:'None'
    };

    const getFormattedData = function (data) {
        data.type = parseInt(data.type);

        switch(data.type) {
            case enums.moduleInputOutputTypes.DATA_SOURCE:
            case enums.moduleInputOutputTypes.NUMBER:
                data.default = parseFloat(data.default);
                break;
            default: break; 
        }

        return data;
    };

    const ModalForm = Form.create({
        mapPropsToFields(props) {
            let data = props.data;
            if (data && !$.isEmptyObject(data)) {
                let values = {
                    name: {value: data.name},
                    type: {value: data.type.toString()},
                    default: {value: data.default},
                    desc: {value: data.desc || ""}
                };
                if(data.refModuleId){
                    values.inputSource = {value: data.refModuleId + '|' + data.refOutputId}
                }
                return values;
            }
            return {};
        }
    })(
        React.createClass({
            getInitialState() {
                return {
                    data:this.props.data,
                    bShowOtherModuleSelect: this.props.data.refModuleId ? true: false,
                    copyNumber: 0
                };
            },

            handleOk() {
                this.props.form.validateFields((err, values) => {
                    //if (err) {
                    //    return;
                    //}
                    let inputSource = values.inputSource;
                    let data = {
                        _id: this.state.data._id,
                        name: values.name,
                        type: values.type,
                        default: values.default,
                        desc: values.desc
                    };
                    if (inputSource) {
                        let arr = inputSource.split('|');
                        data['refModuleId'] = arr[0];
                        data['refOutputId'] = arr[1];
                    }
                    if(data.type === 3){
                        if(!values.option){
                            data.option = {
                                dataSource:{}
                            }
                        }
                    }

                    this.props.configModal( getFormattedData(data) );
                });
            },
            handleTypeChange(value) {
                value = parseInt(value);
                // 引入其他模块的输出值作为输入值，类型将沿用其他模块输出值的类型
                // 这里需要单独处理
                this.setState({
                    bShowOtherModuleSelect: value === enums.moduleInputOutputTypes.OTHER_MODULES
                });

                this.props.form.setFieldsValue({
                    type: value,
                    default: mapParamDefaultValue[value],
                });
                this.handleOk();
            },
            handleOutputRefChange(value) {
                let arr = value.split('|');
                let refModuleId = arr[0];
                let refOutputId = arr[1];
                let output;

                this.props.otherModuleOutputs.some(function (row) {
                    if (row._id === refModuleId) {
                        row.output.some(function (op) {
                            if (op._id === refOutputId) {
                                output = op;
                                return true;
                            }
                        });
                        return true;
                    }
                });

                this.props.form.setFieldsValue({
                    default: mapParamDefaultValue[output.type],
                    inputSource: value
                });
                this.handleOk();
            },
            generateOhterModuleSelectOptions() {
                var data = this.props.otherModuleOutputs;
                var list = [];

                for (var i = 0, len = data.length, row; i < len; i++) {
                    row = data[i];
                    list.push(
                        h(OptGroup, {
                            key: i,
                            label: row.name
                        }, row.output.map(function (op) {
                            return h(Option, {
                                key: row._id,
                                value: `${row._id}|${op._id}`
                            }, [`${op.name} - <${enums.moduleInputOutputTypeNames[op.type]}>`]);
                        }))
                    );
                }
                return list;
            },
            generateOhterModuleSelect() {
                const { getFieldDecorator } = this.props.form;

                return this.state.bShowOtherModuleSelect ?
                    h(FormItem, {
                        style:{
                            marginBottom: 0
                        },
                        label: I18n.resource.inputOutputParameter.INPUT_SOURCE,
                        labelCol:{ span: 6 },
                        wrapperCol:{ span: 14 }
                    }, [
                        getFieldDecorator('inputSource', {
                            rules: [{ required: true, message: I18n.resource.message.INPUT_SOURCE_EMPTY }]
                        })(
                            h(Select, {
                                size:"small",
                                placeholder: I18n.resource.placeholder.SELECT_DATA_SOURCE,
                                onChange: this.handleOutputRefChange
                            }, this.generateOhterModuleSelectOptions())
                        )
                    ]) : null;
            },
            handleAfterClose: function () {
                this.props.form.resetFields();
            },
            changeName(e){
                var curValue = e.target.value;
                let data = deepClone({}, this.props.data);
                if(!isNaN(curValue[0]) || curValue.indexOf("+") > -1  || curValue.indexOf("-") > -1 || curValue.indexOf("*") > -1 || curValue.indexOf("/") > -1|| curValue.indexOf("(") > -1 || curValue.indexOf(")") > -1){
                    Modal.error({
                        title: 'Error',
                        content: I18n.resource.title.PARAMETER_SET_NAME,
                        okText: I18n.resource.modal.OK
                    });
                    this.props.configModal(data);
                }else{
                    data.name = curValue;
                    if(!this.props.isRepetitiveName(data,this.props.data._id)){
                        this.props.configModal(data);
                    }
                }
                this.inputBlur();
            },
            changeDefault(e){
                let data = deepClone({}, this.props.data);
                data.default = e.target.value;
                this.props.configModal(data);
            },
            changeDescribe(e){
                let data = deepClone({}, this.props.data);
                data.desc = e.target.value;
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
            dragStart(e){
                var dataTransfer = e.dataTransfer;
                dataTransfer.setData("data",JSON.stringify({
                    _id: this.props.data._id,
                    name: this.props.data.name
                }));
            },
            inputFocus(e){
                var $inputConfigPanel = $(this.refs.inputConfigPanel);
                $inputConfigPanel.attr("draggable",false);
            },
            inputBlur(){
                var $inputConfigPanel = $(this.refs.inputConfigPanel);
                $inputConfigPanel.attr("draggable",true);
            },
            configParameter(type){
                if(type === 1){
                    this.props.configParameter();
                }else{
                    this.props.configDataSource();
                }
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
            upParameter(){
                var curItem = $(".inputOutputConfigPanel[data-id = "+ this.props.data._id +"]");
                curItem.addClass("upDiv");
            },
            downParameter(){
                var curItem = $(".inputOutputConfigPanel[data-id = "+ this.props.data._id +"]");
                curItem.removeClass("upDiv");
            },
            render() {
                const { deleteParameter,copyParameter,disabled, form} = this.props;
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
                        draggable:true,
                        onDragStart: this.dragStart,
                        ref: "inputConfigPanel"
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
                                        //onChange: this.changeName,
                                        onFocus: this.inputFocus,
                                        onBlur: this.changeName,
                                        disabled: disabled
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
                                    rules: [{ required: true, message: I18n.resource.message.PARAMETER_TYPE_EMPTY }],
                                    onChange: this.handleTypeChange
                                })(
                                    h(Select, {
                                        size:"small",
                                        placeholder: I18n.resource.placeholder.SELECT_PARAMETER_TYPE,
                                        disabled: disabled
                                    }, [
                                        h(Option, {
                                            value: enums.moduleInputOutputTypes.DATA_SOURCE.toString()
                                        }, [enums.moduleInputOutputTypeNames[enums.moduleInputOutputTypes.DATA_SOURCE]]),
                                        h(Option, {
                                            value: enums.moduleInputOutputTypes.INPUT_HISTORY_DATA_SOURCE.toString()
                                        }, [enums.moduleInputOutputTypeNames[enums.moduleInputOutputTypes.INPUT_HISTORY_DATA_SOURCE]]),
                                        h(Option, {
                                            value: enums.moduleInputOutputTypes.NUMBER.toString()
                                        }, [enums.moduleInputOutputTypeNames[enums.moduleInputOutputTypes.NUMBER]]),
                                        h(Option, {
                                            value: enums.moduleInputOutputTypes.STRING.toString()
                                        }, [enums.moduleInputOutputTypeNames[enums.moduleInputOutputTypes.STRING]]),
                                        h(Option, {
                                            value: enums.moduleInputOutputTypes.INPUT_DIAGNOSIS_FUZZYRULE.toString()
                                        }, [enums.moduleInputOutputTypeNames[enums.moduleInputOutputTypes.INPUT_DIAGNOSIS_FUZZYRULE]]),
                                        h(Option, {
                                            value: enums.moduleInputOutputTypes.OTHER_MODULES.toString()
                                        }, [enums.moduleInputOutputTypeNames[enums.moduleInputOutputTypes.OTHER_MODULES]])
                                    ])
                                )
                            ]),
                            this.generateOhterModuleSelect(),
                            h(FormItem, {
                                style:{
                                    marginBottom: 0
                                },
                                className:"upDom",
                                label: I18n.resource.inputOutputParameter.DEFAULT,
                                labelCol:{ span: 6 },
                                wrapperCol:{ span: 14 }
                            }, [
                                getFieldDecorator('default', {
                                    rules: [{ required: true, message: I18n.resource.message.DEFAULT_EMPTY }]
                                })(
                                    h(Input, {
                                        size:"small",
                                        placeholder:I18n.resource.placeholder.INPUT_PARAMETER_DEFAULT,
                                        onChange: this.changeDefault,
                                        onFocus: this.inputFocus,
                                        onBlur: this.inputBlur,
                                        disabled: disabled
                                    })
                                )
                            ]),
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
                                        onChange: this.changeDescribe,
                                        onFocus: this.inputFocus,
                                        onBlur: this.inputBlur,
                                        disabled: disabled
                                    })
                                )
                            ]),
                            h(Icon ,{
                                style:{
                                    position:"absolute",
                                    top:"10%",
                                    right:"10%",
                                    display: this.props.data.type === 1 || this.props.data.type === 3 ?"block":'none'
                                },
                                className:"upDom",
                                type:"setting",
                                title:I18n.resource.title.CONFIGURATION_PARAMETER,
                                onClick: function(){
                                    this.configParameter(this.props.data.type)
                                }.bind(this)
                            }),
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
                                className:"upDom",
                                style:{
                                    position:"absolute",
                                    top:"30%",
                                    right:"10%"
                                },
                                title:I18n.resource.title.COPY_PARAMETER,
                                type:"copy",
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
                                    className:"upDom",
                                    style:{
                                        position:"absolute",
                                        top:"30%",
                                        right:"2%"
                                    },
                                    title:I18n.resource.title.BULK_COPY_PARAMETER,
                                    type:"switcher"
                                })
                            ]),
                            this.props.data.type === 1?h(CheckableTag,{
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


    const InputParamModal = ModalForm;

    exports.InputParamModal = InputParamModal;
}));
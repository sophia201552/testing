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
}(namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel'), function(
    exports,
    React,
    antd,
    enums
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    const deepClone = $.extend.bind($, true);

    const {  Form,Row , Col, Button ,Tag, Input, Select,Modal,Icon} = antd;
    const FormItem = Form.Item;
    const InputGroup = Input.Group;
    const Option = Select.Option;

    class setEnergyConfig extends React.Component{
        constructor(props) {
            super(props);

            this.state = {
                config: this.props.value || {}
            };
            this.handleChange = this.handleChange.bind(this);
        }
        componentWillReceiveProps(nextProps) {
            if ('value' in nextProps) {
                  const value = nextProps.value;
                  this.setState({
                      config: value || {}
                  });
            }
        }
        handleChange(value){
            let data = deepClone({}, this.state.config);
            var obj = {};
            if(value){
                data.name = value;
                Object.keys(AppConfig.energyConfig[value]).forEach(function(row){
                    obj[row] = "";
                });
                data.parameters = obj;
            }else{
                data = obj;
            }

            this.props.onChange(data);
        }
        dropInputParameter(key,e){
            let data = deepClone({}, this.state.config);
            var dragName,currentId;
            var drogData =  e.dataTransfer.getData("data");
            var dragDsItemId = e.dataTransfer.getData("dsItemId");
            var dragTagitemId = e.dataTransfer.getData("tagitemid");
            if(drogData){
                dragName = JSON.parse(drogData).name;
            }else if(dragDsItemId){
                if (AppConfig.datasource.currentObj === 'cloud') {
                    currentId = $('#selectPrjName').find('option:selected').val();
                    dragName = $('#tableDsCloud').find('tr[ptid="' + dragDsItemId + '"]').find('.tabColName').attr('data-value');
                    if (currentId) {
                        dragName = '@' + currentId + '|' + dragName;
                    } else {
                        dragName = dragName;
                    }
                }else{
                    dragName = dragDsItemId;
                }
            }else if(dragTagitemId){
                currentId = $('#tagSelectPrjName').find('option:selected').val();
                dragTagitemId = dragTagitemId.split("|").length > 1?dragTagitemId.split("|")[1]:dragTagitemId.split("|")[0];
                dragName = '@' + currentId + '|' + dragTagitemId;
            }

            data.parameters[key] = dragName;

            this.props.onChange(data);
            e.preventDefault();
        }
        defaultDealt(e){
            e.preventDefault();
        }
        changeParameter(key,e){
            var value = e.target.value;
            if(isNaN(value)){
                Modal.error({
                    title: 'Error',
                    content: I18n.resource.title.ENERGY_CONFIGURATION_NUMBERS,
                    okText: I18n.resource.modal.OK
                });
                return;
            }
            let data = deepClone({}, this.state.config);
            data.parameters[key] = value === ""? value : parseFloat(value);
            this.props.onChange(data);
        }
        setEnergyConfigMethods(){
            if(AppConfig.energyConfig){
                return Object.keys(AppConfig.energyConfig).map(function(row){
                    return (
                        h(Option,{
                            value: row
                        },[row])
                    )
                })
            }else{
                return [];
            }
        }
        setEnergyConfig(){
            var _this = this;
            if(!$.isEmptyObject(this.state.config.parameters)){
                var name = this.state.config.name;
                return Object.keys(this.state.config.parameters).map(function(row){
                    var dropInputParameter = _this.dropInputParameter.bind(_this, row);
                    var defaultDealt = _this.defaultDealt.bind(_this);
                    var changeParameter = _this.changeParameter.bind(_this,row);
                    var curVal = _this.state.config.parameters[row];
                    var placeholder = AppConfig.energyConfig ? AppConfig.energyConfig[name][row] : "";
                    return (
                        h(Col,{
                            span: 24
                        },[
                            h(Col,{
                                span: 8,
                                style:{
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden"
                                },
                                title: placeholder
                            },[row]),
                            h(Col,{
                                span: 16
                            },[
                                h(Input,{
                                    style:{
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden"
                                    },
                                    placeholder:I18n.resource.placeholder.FILL_IN + placeholder +I18n.resource.placeholder.CONFIG,
                                    onChange:changeParameter,
                                    onDrop: dropInputParameter,
                                    onDragEnter: defaultDealt,
                                    onDragOver: defaultDealt,
                                    value: curVal
                                })
                            ])
                        ])
                    )
                },this);
            }
        }
        render (){
            return (
                h("div",[
                    h("div",[
                        h(Row,[
                            h(Col,{
                                span: 24
                            },[
                                h(Select , {
                                    placeholder:I18n.resource.placeholder.SELECT_CONFIGURATION_METHOD,
                                    onChange: this.handleChange,
                                    value: this.state.config.name
                                },[h(Option,{value:""},[I18n.resource.moduleProp.NULL])].concat(this.setEnergyConfigMethods()))
                            ])
                        ]),
                        h(Row,{
                            gutter: 24,
                            style:{
                                marginTop:10
                            }
                        }, this.setEnergyConfig())
                    ])
                ])
            )
        }
    }

    class setChart extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                chart: this.props.value || []
            };
            this.handleChange = this.handleChange.bind(this);
        }
        componentWillReceiveProps(nextProps) {
            if ('value' in nextProps) {
                  const value = nextProps.value;
                  this.setState({
                      chart: value
                  });
            }
        }
        handleChange(){
            let data = deepClone([], this.state.chart);

            this.props.onChange(data);
        }
        dropInputParameter(rowNo,e){
            let data = deepClone([], this.state.chart);
            var drogData =  JSON.parse(e.dataTransfer.getData("data"));
            data[rowNo]["name"] = drogData.name;

            this.props.onChange(data);
            e.preventDefault();
        }
        defaultDealt(e){
            e.preventDefault();
        }
        changeCoordinate(rowNo,value){
            let data = deepClone([], this.state.chart);

            data[rowNo]["type"] = parseInt(value);
            this.props.onChange(data);
        }
        addItem(){
            let data = deepClone([], this.state.chart);
            data.push({
                name:"",
                type: 0
            });
            this.props.onChange(data);
        }
        deleteItem(rowNo){
            let data = deepClone([], this.state.chart);

            data.splice(rowNo,1);
            this.props.onChange(data);
        }
        setChartList(){
            var _this = this;
            return this.state.chart.map(function(row, i){
                var handleChange = _this.handleChange.bind(_this, i);
                var dropInputParameter = _this.dropInputParameter.bind(_this, i);
                var defaultDealt = _this.defaultDealt.bind(_this);
                var changeCoordinate = _this.changeCoordinate.bind(_this, i);
                var deleteItem = _this.deleteItem.bind(_this,i);
                return (
                    h(Row,{
                        gutter: 24
                    },[
                        h(Col ,{
                            span: 11
                        },[
                            h(Input,{
                                placeholder:I18n.resource.placeholder.DRAG_INPUT_PARAMETERS,
                                value: row.name,
                                onChange:handleChange,
                                onDrop: dropInputParameter,
                                onDragEnter: defaultDealt,
                                onDragOver: defaultDealt
                            })
                        ]),
                        h(Col ,{
                            span: 11
                        },[
                            h(Select, {
                                placeholder: I18n.resource.placeholder.SELECT_COORDINATE,
                                value:row.type.toString(),
                                onChange: changeCoordinate
                            }, [
                                h(Option, {
                                    value: "0"
                                }, [I18n.resource.placeholder.PRIMARY_AXIS]),
                                h(Option, {
                                    value: "1"
                                }, [I18n.resource.placeholder.DEPUTY_AXIS])
                            ])
                        ]),
                        h(Col ,{
                            span: 2
                        },[
                            h(Icon ,{
                                type:"close-circle",
                                onClick: deleteItem
                            })
                        ])
                    ])
                )
            }, this)
        }
        getBtnGroup (){
            return (
                h(Row,{
                    gutter: 24
                },[
                    h(Col,{
                        span: 3
                    },[
                        h(Button , {
                            type: 'dashed',
                            onClick: function(){
                                this.addItem()
                            }.bind(this)
                        },[
                            I18n.resource.modal.ADD
                        ])
                    ])
                ])
            );
        }
        render (){
            return (
                h("div",[
                    h("div",this.setChartList()),
                    this.getBtnGroup()
                ])
            )
        }
    }

    const FuzzyRuleOutputModal = Form.create({
        mapPropsToFields(props) {
            var data = props.data;
            if (data && !$.isEmptyObject(data.option)) {
                var inputData = props.inputData;
                data.option.chart.forEach(function(row){
                    var data = inputData.filter(function(item){
                        return row._id === item._id;
                    });
                    if(data.length > 0){
                        row.name = data[0].name;
                        row.unit = data[0].option.unit;
                    }
                });
                return {
                    fullName: {value: data.option.fullName},
                    faultType: {value: data.option.faultType},
                    faultTypeGroup: {value: data.option.faultTypeGroup},
                    group: {value: data.option.group? data.option.group.toString() : data.option.group},
                    consequence: {value: data.option.consequence ? data.option.consequence.toString() : data.option.consequence},
                    targetGroup: {value: data.option.targetGroup},
                    targetExecutor: {value: data.option.targetExecutor},
                    runTimeDay: {value: data.option.runTimeDay},
                    runTimeWeek: {value: data.option.runTimeWeek},
                    runTimeMonth: {value: data.option.runTimeMonth},
                    runTimeYear: {value: data.option.runTimeYear},
                    unit: {value: data.option.unit},
                    energyConfig: {value: data.option.energyConfig},
                    runMode: {value: data.option.runMode},
                    grade: {value: data.option.grade.toString()},
                    desc: {value: data.option.desc},
                    advise: {value: data.option.advise},
                    title: {value: data.option.title},
                    principal: {value: data.option.principal},
                    deputy: {value: data.option.deputy},
                    chart: {value: data.option.chart}
                };
            }
            return {};
        }
    })(
        React.createClass({
            getInitialState() {
                return {
                    chart: {},
                    group: null,
                    groupAjax: null,
                    energyConfig: null,
                    faultGroup: null
                };
            },
            componentDidMount() {
                var _this = this;
                this.setState({
                    chart: {},
                    group: null,
                    groupAjax: WebAPI.post('/workflow/taskGroupProcess/').done(function(result){
                        _this.setState({
                            chart: {},
                            group: result.data,
                            groupAjax: null
                        });
                    }),
                    energyConfig: AppConfig.energyConfig ? null :
                        WebAPI.get("/static/app/Strategy/energyConfig.json").done(function(result){
                             AppConfig.energyConfig = result;
                             _this.setState({
                                 energyConfig: null
                             })
                        }),
                    faultGroup: AppConfig.faultGroup ? null :
                        WebAPI.get("/static/app/Strategy/faultGroup.json").done(function(result){
                             AppConfig.faultGroup = result;
                             _this.setState({
                                 faultGroup: null
                             })
                        })
                });
            },
            getGroup(data){
                if(data){
                    return data.map(function(row){
                        if(!row.name){
                           row.name = "默认项目";
                        }
                        return (
                            h(Option, {
                                value: row._id
                            }, [row.name])
                        )
                    })
                }else{
                    return null;
                }
            },
            onCancel() {
                if(this.state.groupAjax){
                    this.state.groupAjax.abort();
                }
                if(this.state.energyConfig){
                    this.state.energyConfig.abort();
                }
                if(this.state.faultGroup){
                    this.state.faultGroup.abort();
                }
                this.props.form.resetFields();
                this.props.onCancel();
            },
            setFaultGroupOption(){
                if(AppConfig.faultGroup){
                    var children  = [];
                    Object.keys(AppConfig.faultGroup).forEach(function(row){
                        children.push(
                            h(Option,{
                                value: row
                            },[AppConfig.faultGroup[row]])
                        )
                    });
                    return children;
                }else{
                    return [];
                }
            },
            submitForm(){
                let _this = this;
                this.props.form.validateFields((err, formData) => {
                    if (err) {
                        return ;
                    }
                    var pArr = [];
                    var dArr = [];
                    var principal = "";
                    var deputy = "";
                    formData.chart.forEach(function(row,i){
                        var unit = formData.chart[i].unit;
                        if(unit){
                            if(pArr.indexOf(unit) < 0 && row.type === 0){
                                pArr.push(unit);
                            }
                            if(dArr.indexOf(unit) < 0 && row.type === 1){
                                dArr.push(unit);
                            }
                        }
                        delete row.unit;

                    });
                    pArr.forEach(function(row,i){
                        if(row){
                            if(i === 0){
                                principal += row;
                            }else{
                                principal += ("/" + row);
                            }
                        }
                    });
                    dArr.forEach(function(row,i){
                        if(row){
                            if(i === 0){
                                deputy += row;
                            }else{
                                deputy += ("/" + row);
                            }
                        }
                    });
                    let data = {
                        fullName: formData.fullName,
                        faultType: parseFloat(formData.faultType),
                        faultTypeGroup: formData.faultTypeGroup || [],
                        group: parseInt(formData.group),
                        consequence: parseInt(formData.consequence),
                        targetGroup: formData.targetGroup,
                        targetExecutor: parseInt(formData.targetExecutor),
                        runTimeDay: parseInt(formData.runTimeDay),
                        runTimeWeek: parseInt(formData.runTimeWeek),
                        runTimeMonth: parseInt(formData.runTimeMonth),
                        runTimeYear: parseInt(formData.runTimeYear),
                        unit: formData.unit,
                        energyConfig: formData.energyConfig ||{},
                        runMode: formData.runMode,
                        grade: parseInt(formData.grade),
                        desc: formData.desc,
                        advise: formData.advise,
                        title: formData.title,
                        principal: principal,
                        deputy: deputy,
                        chart: formData.chart
                    };
                    if(_this.props.data){
                        data._id = _this.props.data._id;
                    }

                    _this.props.onOk(data);
                });
            },
            render(){
                const { form ,visible,inputData} = this.props;
                const { getFieldDecorator } = form;

                let values = form.getFieldsValue();
                if(values.chart && values.chart.length > 0){
                    values.chart.forEach(function(row){
                        var data = inputData.filter(function(item){
                            return row.name === item.name;
                        });
                        if(data.length > 0){
                            row.name = data[0].name;
                            row.unit = data[0].option.unit;
                        }
                    });
                }

                return (
                    h(Modal, {
                        visible: visible,
                        maskClosable:false,
                        width: 800,
                        title: I18n.resource.modal.THE_NEW_OUTPUT_PARAMETERS,
                        okText: I18n.resource.modal.OK,
                        cancelText: I18n.resource.modal.CANCEL,
                        onOk: this.submitForm,
                        onCancel: this.onCancel,
                        wrapClassName: "vertical-center-modal scrollable-modal"
                    },[
                        h("div",{className:"modalContent gray-scrollbar"},[
                        h(Form,{id:"outputForm"}, [
                        h(FormItem,{
                            label: I18n.resource.modal.FULL_NAME,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator('fullName', {
                                initialValue: "",
                                rules: [{ required: true, message: I18n.resource.message.FULL_NAME_EMPTY }]
                            })(
                                h(Input,{
                                    placeholder:I18n.resource.placeholder.ENTER_FULL_NAME
                                })
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.FAULT_IMPACT_RATE,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        }, [
                            getFieldDecorator('faultType', {
                                initialValue: "",
                                rules: [{ required: true, message: I18n.resource.message.FAULT_TYPE_EMPTY }]
                            })(
                                h(Input,{
                                    placeholder:I18n.resource.placeholder.ENTER_FAULT_TYPE
                                })
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.FAULT_TYPES_GROUPED,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator("faultTypeGroup",{
                                //rules: [{ required: true, message: '故障所在组不能为空！' }]
                            })(
                                h(Select, {
                                    placeholder: I18n.resource.placeholder.SELECT_GROUP,
                                    mode:"tags",
                                    style:{ width: '100%' }
                                },this.setFaultGroupOption() )
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.FAULT_GROUP,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator("group",{
                                //initialValue: "0"
                                rules: [{ required: true, message: I18n.resource.message.FAULT_GROUP_EMPTY }]
                            })(
                                h(Select, {placeholder: I18n.resource.placeholder.SELECT_GROUP}, [
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultGroup.CAPACITY.toString()
                                    }, [enums.fuzzyRuleFaultGroupNames[enums.fuzzyRuleFaultGroup.CAPACITY]]),
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultGroup.CONTROL.toString()
                                    }, [enums.fuzzyRuleFaultGroupNames[enums.fuzzyRuleFaultGroup.CONTROL]]),
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultGroup.IMPROPER_BEHAVIOR.toString()
                                    }, [enums.fuzzyRuleFaultGroupNames[enums.fuzzyRuleFaultGroup.IMPROPER_BEHAVIOR]]),
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultGroup.COMFORT.toString()
                                    }, [enums.fuzzyRuleFaultGroupNames[enums.fuzzyRuleFaultGroup.COMFORT]]),
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultGroup.SENSOR.toString()
                                    }, [enums.fuzzyRuleFaultGroupNames[enums.fuzzyRuleFaultGroup.SENSOR]]),
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultGroup.DEVICE.toString()
                                    }, [enums.fuzzyRuleFaultGroupNames[enums.fuzzyRuleFaultGroup.DEVICE]]),
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultGroup.OTHER.toString()
                                    }, [enums.fuzzyRuleFaultGroupNames[enums.fuzzyRuleFaultGroup.OTHER]])
                                ])
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.FAULT_EFFECT,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator("consequence",{
                                //initialValue: "0"
                                rules: [{ required: true, message: I18n.resource.message.FAULT_EFFECT_EMPTY }]
                            })(
                                h(Select, {placeholder: I18n.resource.placeholder.SELECT_FAULT_EFFECT}, [
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultEffect.ENERGY_WASTE.toString()
                                    }, [enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.ENERGY_WASTE]]),
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultEffect.COMFORT_ISSUE.toString()
                                    }, [enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.COMFORT_ISSUE]]),
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultEffect.EQUIPMENT_HEALTH.toString()
                                    }, [enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.EQUIPMENT_HEALTH]]),
                                    h(Option, {
                                        value: enums.fuzzyRuleFaultEffect.OTHER.toString()
                                    }, [enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.OTHER]])
                                ])
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.GRADE,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        }, [
                            getFieldDecorator('grade', {
                                initialValue: "1"
                            })(
                                h(Select, {placeholder: I18n.resource.placeholder.SELECT_GRADE}, [
                                    h(Option, {
                                        value: "1"
                                    }, [I18n.resource.modal.ABNORMAL]),
                                    h(Option, {
                                        value: "2"
                                    }, [I18n.resource.modal.FAULT])
                                ])
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.PEOPLE_GROUP,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator("targetGroup",{
                                //initialValue: defaultGroup,
                                rules: [{ required: true, message: I18n.resource.message.PEOPLE_GROUP_EMPTY }]
                            })(
                                h(Select, {placeholder: I18n.resource.placeholder.SELECT_GROUP},this.getGroup(this.state.group))
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.PERFORM_STAFF,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator("targetExecutor",{
                                initialValue: "",
                                rules: [{ required: true, message: I18n.resource.message.EXECUTIVES_EMPTY }]
                            })(
                                h(Input,{
                                    placeholder:I18n.resource.placeholder.ENTER_EXECUTIVE_ID
                                })
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.RUNNING_MODE,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator("runMode",{
                                initialValue: "All"
                            })(
                                h(Select, {placeholder: I18n.resource.placeholder.SELECT_GRADE}, [
                                    h(Option, {
                                        value: "All"
                                    }, [I18n.resource.modal.ALL]),
                                    h(Option, {
                                        value: "Cooling"
                                    }, [I18n.resource.modal.REFRIGERATION]),
                                    h(Option, {
                                        value: "Heating"
                                    }, [I18n.resource.modal.HEATING])
                                ])
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.ENERGY_CONSUMPTION_OF_THE_DAY,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            h(Row,[
                                h(Col,{span:12},[
                                    getFieldDecorator("runTimeDay",{
                                        initialValue: 12,
                                        rules: [{ required: true, message: I18n.resource.message.ENERGY_DAY_EMPTY }]
                                    })(
                                        h(Input,{
                                            placeholder:I18n.resource.placeholder.CALCULATE_ENERGY_DAY_TIME
                                        })
                                    )
                                ]),
                                h(Col,{span:4,style:{textAlign: "center"}},[I18n.resource.modal.HOUR])
                            ])
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.ENERGY_CONSUMPTION_OF_THE_WEEK,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            h(Row,[
                                h(Col,{span:12},[
                                    getFieldDecorator("runTimeWeek",{
                                        initialValue: 60,
                                        rules: [{ required: true, message: I18n.resource.message.ENERGY_WEEK_EMPTY }]
                                    })(
                                        h(Input,{
                                            placeholder:I18n.resource.placeholder.CALCULATE_ENERGY_WEEK_TIME
                                        })
                                    )
                                ]),
                                h(Col,{span:4,style:{textAlign: "center"}},[I18n.resource.modal.HOUR])
                            ])
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.ENERGY_CONSUMPTION_OF_THE_MONTH,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            h(Row,[
                                h(Col,{span:12},[
                                    getFieldDecorator("runTimeMonth",{
                                        initialValue: 240,
                                        rules: [{ required: true, message: I18n.resource.message.ENERGY_MONTH_EMPTY }]
                                    })(
                                        h(Input,{
                                            placeholder:I18n.resource.placeholder.CALCULATE_ENERGY_MONTH_TIME
                                        })
                                    )
                                ]),
                                h(Col,{span:4,style:{textAlign: "center"}},[I18n.resource.modal.HOUR])
                            ])
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.ENERGY_CONSUMPTION_OF_THE_YEAR,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            h(Row,[
                                h(Col,{span:12},[
                                    getFieldDecorator("runTimeYear",{
                                        initialValue: 2400,
                                        rules: [{ required: true, message: I18n.resource.message.ENERGY_YEAR_EMPTY }]
                                    })(
                                        h(Input,{
                                            placeholder:I18n.resource.placeholder.CALCULATE_ENERGY_YEAR_TIME
                                        })
                                    )
                                ]),
                                h(Col,{span:4,style:{textAlign: "center"}},[I18n.resource.modal.HOUR])
                            ])
                        ]),
                        h(FormItem, {
                            label: I18n.resource.modal.ENERGY_CONSUMPTION_OF_THE_UNIT,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        }, [
                            getFieldDecorator('unit',{
                                initialValue: 'kWh'
                            })(
                                h(Select, {placeholder: I18n.resource.placeholder.SELECT_UNIT}, [
                                    h(Option, {
                                        value: "kWh"
                                    }, ["kWh"]),
                                    h(Option, {
                                        value: "kJ"
                                    }, ["kJ"])
                                ])
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.ENERGY_CONSUMPTION_OF_THE_CONFIGURATION,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            h(Col,{
                                span:24
                            },[
                                getFieldDecorator("energyConfig",{
                                    initialValue: {}
                                })(
                                    h(setEnergyConfig)
                                )
                            ])
                        ]),
                        h(FormItem, {
                            label: I18n.resource.modal.DESCRIPTION,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        }, [
                            getFieldDecorator('desc',{
                                initialValue: '',
                                rules: [{ required: true, message: I18n.resource.message.DESCRIPTION_EMPTY }]
                            })(
                                h(Input,{
                                    placeholder:I18n.resource.placeholder.FILL_DESCRIPTION,
                                    type:"textarea",
                                    rows: 4
                                })
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.SUGGESTION,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator("advise",{
                                initialValue: "",
                                rules: [{ required: true, message: I18n.resource.message.SUGGEST_EMPTY }]
                            })(
                                h(Input,{
                                    placeholder:I18n.resource.placeholder.FILL_ADVICE,
                                    type:"textarea",
                                    rows: 4
                                })
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.CHART_TITLE,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 8 }
                        },[
                            getFieldDecorator("title",{
                                initialValue: "",
                                rules: [{ required: true, message: I18n.resource.message.CHART_TITLE_EMPTY }]
                            })(
                                h(Input,{
                                    placeholder:I18n.resource.placeholder.FILL_CHART_TITLE
                                })
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.CHART_LEGEND,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            h(Col,{
                                span:24
                            },[
                                getFieldDecorator("chart",{
                                    initialValue: []
                                })(
                                    h(setChart)
                                )
                            ])
                        ])
                    ])
                    ])
                ])
            )}
        })
    );

    exports.FuzzyRuleOutputModal = FuzzyRuleOutputModal;
}));
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
            namespace('beop.common.components.CodeEditor'),
            namespace('beop.common.components.FuzzyRuleChart'),
            namespace('beop.strategy.common.fuzzyRuleParser')
        );
    }
}(namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel'), function(
    exports,
    React,
    antd,
    enums,
    CodeEditor,
    FuzzyRuleChart,
    fuzzyRuleParser
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    const deepClone = $.extend.bind($, true);

    const {  Form,Row , Col, Button , Input, Select,InputNumber, Slider ,Icon ,Modal,Switch,Alert } = antd;
    const FormItem = Form.Item;
    const InputGroup = Input.Group;
    const Option = Select.Option;

    class setParameters extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                parameters: this.props.value || [],
                changeFormula: this.props.changeFormula
            };
            this.handleChange = this.handleChange.bind(this);
            this.changePoint = this.changePoint.bind(this);
            this.addGraphicParameters = this.addGraphicParameters.bind(this);
            this.deleteGraphicParameters = this.deleteGraphicParameters.bind(this);
            this.getBtnGroup = this.getBtnGroup.bind(this);
            this.changeName = this.changeName.bind(this);
        }
        handleChange(rowNo, value) {
            let data = deepClone([], this.state.parameters);

            data[rowNo]['type'] = parseInt(value);
            if(value === "0"){
                if(data[rowNo]['points'].length > 3){
                    data[rowNo]['points'].splice(3,data[rowNo]['points'].length - 3)
                }
            }else if(value === "1" || value === "3" ||  value === "4" ||  value === "5"){
                if(data[rowNo]['points'].length > 2){
                    data[rowNo]['points'].splice(2,data[rowNo]['points'].length - 1)
                }
            }

            this.props.onChange(data);
        }
        changePoint(rowNo,index, e) {
            let data = deepClone([], this.state.parameters);
            if(index === 4){
                if(data[rowNo]['type'] === "0"){
                    index = 3;
                }else if(data[rowNo]['type'] === "1"){
                    index = 2;
                }
            }
            //if(e.target.value.indexOf(".") === e.target.value.length - 1 || e.target.value === "-"){
                data[rowNo]['points'][index] = e.target.value;
            //}else{
            //    data[rowNo]['points'][index] = parseFloat(e.target.value);
            //}

            this.props.onChange(data);
        }
        changeName (rowNo, e){
            let data = deepClone([], this.state.parameters);

            data[rowNo]["name"] = e.target.value;
            this.props.changeFormula(data);
            this.props.onChange(data);
        }
        componentWillReceiveProps(nextProps) {
            if ('value' in nextProps) {
                  const value = nextProps.value;
                  this.setState({
                      parameters: value
                  });
            }
        }
        setParametersList(){
            var _this = this;
            return this.state.parameters.map(function(row, i){
                var handleChange = _this.handleChange.bind(_this, i);
                var changeName = _this.changeName.bind(_this, i);
                return (
                    h(Row,{
                        gutter: 16
                    },[
                        h(Col ,{
                            span: 2
                        },[
                            h("span",["term"])
                        ]),
                        h(Col ,{
                            span: 5
                        },[
                            h(Input,{
                                placeholder:I18n.resource.placeholder.Name,
                                value:row.name,
                                onChange:changeName
                            })
                        ]),
                        h(Col ,{
                            span: 4
                        },[
                            h(Select, {
                                placeholder: I18n.resource.placeholder.SELECT_PATTERN,
                                value:row.type.toString(),
                                onChange: handleChange
                            }, [
                                h(Option, {
                                    value: enums.fuzzyRuleShapeTypes.TRIANGLE.toString()
                                }, [enums.fuzzyRuleShapeTypeNames[enums.fuzzyRuleShapeTypes.TRIANGLE]]),
                                h(Option, {
                                    value: enums.fuzzyRuleShapeTypes.RECTANGLE.toString()
                                }, [enums.fuzzyRuleShapeTypeNames[enums.fuzzyRuleShapeTypes.RECTANGLE]]),
                                h(Option, {
                                    value: enums.fuzzyRuleShapeTypes.TRAPEZOID.toString()
                                }, [enums.fuzzyRuleShapeTypeNames[enums.fuzzyRuleShapeTypes.TRAPEZOID]]),
                                h(Option, {
                                    value: enums.fuzzyRuleShapeTypes.GAUSSIAN.toString()
                                }, [enums.fuzzyRuleShapeTypeNames[enums.fuzzyRuleShapeTypes.GAUSSIAN]]),
                                h(Option, {
                                    value: enums.fuzzyRuleShapeTypes.ZSHAPE.toString()
                                }, [enums.fuzzyRuleShapeTypeNames[enums.fuzzyRuleShapeTypes.ZSHAPE]]),
                                h(Option, {
                                    value: enums.fuzzyRuleShapeTypes.SSHAPE.toString()
                                }, [enums.fuzzyRuleShapeTypeNames[enums.fuzzyRuleShapeTypes.SSHAPE]])
                            ])
                        ]),
                        h(Col ,{
                            span: 3
                        },[
                            h(Input,{
                                placeholder:"X1",
                                value: row.points[0],
                                onChange: this.changePoint.bind(this, i, 0)
                            })
                        ]),
                        h(Col ,{
                            span: 3
                        },[
                            h(Input,{
                                placeholder:"X2",
                                value: row.points[1],
                                onChange: this.changePoint.bind(this, i, 1)
                            })
                        ]),
                        h(Col ,{
                            span: 3,
                            style:{
                                display:row.type === 1 || row.type === 3 || row.type === 4 || row.type === 5?"none":"block"
                            }
                        },[
                            h(Input,{
                                placeholder:"X3",
                                value: row.points[2],
                                onChange: this.changePoint.bind(this, i, 2)
                            })
                        ]),
                        h(Col ,{
                            span: 3,
                            style:{
                                display:row.type === 2?"block":"none"
                            }
                        },[
                            h(Input,{
                                placeholder:"X4",
                                value: row.points[3],
                                onChange: this.changePoint.bind(this, i, 3)
                            })
                        ]),
                        h(Col ,{
                            span: 1,
                            className:"deleteCol"
                        },[
                            h(Icon ,{
                                type:"close-circle",
                                onClick: this.deleteGraphicParameters.bind(this, i)
                            })
                        ])
                    ])
                )
            }, this)
        }
        addGraphicParameters() {
            let data = deepClone([], this.state.parameters);
            data.push({
                name:"",
                type: 0,
                points: []
            });
            this.props.onChange(data);
        }
        deleteGraphicParameters(rowNo){
            let data = deepClone([], this.state.parameters);
            data.splice(rowNo,1);
            this.props.onChange(data);
        }
        getBtnGroup() {
            return (
                h(Row,[
                    h(Col,{
                        span: 3
                    },[
                        h(Button , {
                            style:{
                                marginTop: 10
                            },
                            type: 'dashed',
                            onClick: function(){
                                this.addGraphicParameters()
                            }.bind(this)
                        },[
                            I18n.resource.modal.ADD
                        ])
                    ])
                ])
            );
        }
        render() {
            return (
                h("div",[
                    h("div",this.setParametersList()),
                    this.getBtnGroup()
                ])
            );
        }
    }

    const FuzzyRuleInputModal = Form.create({
        mapPropsToFields(props) {
            let data = props.data;
            if (data && !$.isEmptyObject(data.option)) {
                let values = {
                    alias: {value: data.option.alias},
                    unit: {value: data.option.unit === "None"?"":data.option.unit},
                    min: {value: parseFloat(data.option.min).toFixed(3)},
                    max: {value: parseFloat(data.option.max).toFixed(3)},
                    type: {value: data.option.type.toString()},
                    check: {value: data.option.check.toString()},
                    precision: {value: data.option.precision === "None"?"999": data.option.precision},
                    formulaConfig: {value: data.option.formulaConfig ? data.option.formulaConfig.formula : ""},
                    //enabled: {value: data.option.enabled.toString()},
                    enabled: {value: data.option.enabled === 1?true:false},
                    terms: {value: data.option.terms}
                };
                return values;
            }
            return {};
        }
    })(
        React.createClass({
            getInitialState() {
                return {
                    code: '',
                    formula: "μ(x) = ?",
                    progress:0,
                    pos: [0, 0],
                    parametersArr:[],
                    bShowFormulaConfig: false
                };
            },
            triangle(data,value){
                var result;
                var x = value;
                if(data[1] - data[0] === 0){
                    if(data[0] === value){
                        result = 1;
                    }else if(data[0] < value){
                        result = 2;
                    }else{
                        result = -1;
                    }
                }else{
                    var linearOne = {
                        k: 1/(data[1] - data[0]),
                        b: -data[0]*1/(data[1] - data[0])
                    };
                    result = parseFloat((linearOne.k * x + linearOne.b).toFixed(3));
                }
                if(isNaN(result)){result = 0;}
                if(result > 1){
                    if(data[1] - data[2] === 0){
                        if(data[1] === value){
                            result = 1;
                        }else{
                            result = 0;
                        }
                    }else{
                        var linearTwo = {
                            k: 1/(data[1] - data[2]),
                            b: -data[2]*1/(data[1] - data[2])
                        };
                        result = parseFloat((linearTwo.k * x + linearTwo.b).toFixed(3));
                    }
                    if(result < 0){
                        return 0;
                    }else{
                        return result;
                    }
                }else if(result < 0){
                    return 0;
                }else{
                    return result;
                }
            },
            rectangle(data,value){
                var x = value;
                if(x >= data[0] && x <= data[1]){
                    return 1;
                }else{
                    return 0;
                }
            },
            trapezoid(data,value){
                var result;
                var x = value;
                if(data[1] - data[0] === 0){
                    if(data[0] === value){
                        result = 1;
                    }else if(data[0] < value){
                        result = 2;
                    }else{
                        result = -1;
                    }
                }else{
                    var linearOne = {
                        k: 1/(data[1] - data[0]),
                        b: -data[0]*1/(data[1] - data[0])
                    };
                    result = parseFloat((linearOne.k * x + linearOne.b).toFixed(3));
                }
                if(isNaN(result)){result = 0;}
                if(result > 1){
                    if(value >= data[1] && value <= data[2]){
                        return 1;
                    }else{
                        if(data[2] - data[3] === 0){
                            if(data[2] === value){
                                result = 1;
                            }else{
                                result = 0;
                            }
                        }else{
                            var linearTwo = {
                                k: 1/(data[2] - data[3]),
                                b: -data[3]*1/(data[2] - data[3])
                            };
                            result = parseFloat((linearTwo.k * x + linearTwo.b).toFixed(3));
                        }
                        if(result < 0){
                            return 0;
                        }else if(result > 1){
                            return 1;
                        }else{
                            return result;
                        }
                    }
                }else if(result < 0){
                    return 0
                }else{
                    return result
                }
            },
            changeEnabled(value){
                this.props.form.setFieldsValue({
                    ["enabled"]:value
                });
            },
            changePrecision(value){
                if(this.props.form.getFieldError("precision")){
                    this.props.form.setFields({
                        ["precision"]:{
                            value: value,
                            errors: null
                        }
                    });
                }
            },
            graphTransformation(value){
                var _this = this;
                var parameters = this.getCompleteParameters(this.props.form.getFieldValue("terms"));
                var tpl = "μ(x) = ";
                var len = parameters.length - 1;
                var arr = [];
                parameters.forEach(function(row,i){
                    var item;
                    if(row.type === 0){
                        arr.push(_this.triangle(row.points,value));
                        item = _this.triangle(row.points,value) + "/" + row.name;
                    }else if(row.type === 1){
                        arr.push(_this.rectangle(row.points,value));
                        item = _this.rectangle(row.points,value) + "/" + row.name;
                    }else if(row.type === 2){
                        arr.push(_this.trapezoid(row.points,value));
                        item = _this.trapezoid(row.points,value) + "/" + row.name;
                    }
                    tpl += item;
                    if(i < len){
                        tpl += " + ";
                    }
                });
                var newArr = arr.sort(function(a,b){return a-b;});
                var maxValue = newArr[newArr.length-1];
                var data = {
                    maxValue: maxValue,
                    tpl: tpl
                };
                return(data);
            },
            createFormula(value){
                var data = this.graphTransformation(value);
                this.props.form.setFieldsValue({
                    ["centerInputNumber"]:value
                });
                this.setState({
                    formula: data.tpl
                });
                return data.maxValue;
            },
            submitForm(){
                let _this = this;
                this.props.form.validateFields((err, formData) => {
                    if(formData.check === "1" && !formData.precision){
                        this.props.form.setFields({
                            ["precision"]:{
                                value: formData.precision,
                                errors: [new Error(I18n.resource.message.SERIES_IT_SENSOR_PRECISION_EMPTY)]
                            }
                        });
                        return;
                    }
                    if(_this.props.form.getFieldError("formulaConfig")){
                        return;
                    }
                    var completeTerms = false;
                    var noNumber = false;
                    formData.terms.forEach(function(term){
                        if(!term.name){
                            completeTerms = true;
                        }
                        term.points.forEach(function(row,i){
                            term.points[i] = parseFloat(row);
                            if(isNaN(parseFloat(row))){
                                noNumber = true;
                            }
                        })
                    });
                    if(completeTerms || noNumber){
                        Modal.error({
                            title: 'Error',
                            content: I18n.resource.title.TERM_FILL_ERROR,
                            okText: I18n.resource.modal.OK
                        });
                        return;
                    }
                    if (err) {
                        return;
                    }
                    let data = {
                        alias: formData.alias,
                        unit: formData.unit || "None",
                        min: parseFloat(formData.min),
                        max: parseFloat(formData.max),
                        type: parseInt(formData.type),
                        check: parseInt(formData.check),
                        precision: formData.precision? parseFloat(formData.precision) : "None",
                        enabled:formData.enabled?1:0,
                        terms: formData.terms
                    };
                    if(data.type === 4){
                        data.formulaConfig = {
                            formula:formData.formulaConfig,
                            parameters: _this.getFormulaParameters(formData.formulaConfig)
                        };
                    }
                    if(_this.props.data){
                        data._id = _this.props.data._id;
                    }

                    _this.props.onOk(data);
                });
            },
            getFormulaParameters(str){
                //var newStr = str.trim().replace(/[\(\)]|[\(\)]?\d*\.?\d*[\+\*{1,2}\/\-<>]\d*\.?\d*[\(\)]?\d*\.?\d*/g,",");
                var result = [];
                var arr = this.state.parametersArr;
                arr.forEach(function(row){
                    if(str.indexOf(row) > -1){
                        result.push(row)
                    }
                });
                return result;
            },
            changeFormula(){
                if(this.refs.progress){
                    this.createFormula(this.refs.progress.props.value)
                }
            },
            transformNumber(value){
                var result;
                if(!value && value != 0){
                    return;
                }
                if(typeof value === "string"){
                    if(value === ("-" || "-0" || "-0.")){
                        result = 0;
                    }else{
                        result = value;
                    }
                }else{
                    result = value;
                }
                return parseFloat(result);
            },
            changeProgress(value) {
                var value = value;
                if(value){
                    //if(typeof (value) === "string" && value.indexOf(".") === value.length - 1){
                    //    value = parseFloat(value);
                    //}
                    value = this.transformNumber(value);
                }else{
                    value = 0;
                }
                var progressHeight = this.createFormula(value);
                this.setState({
                    pos: [value, progressHeight > 1? 1 : progressHeight],
                    progress:value
                });
            },
            changeRange(type,value){
                value = parseFloat(parseFloat(this.transformNumber(value)).toFixed(3));
                this.props.form.setFieldsValue({
                    [type]:value
                });
                this.setState({
                    pos: [value,0]
                });
            },
            changeCode(value){
                var obj = fuzzyRuleParser.parseInput(value);
                this.props.form.setFieldsValue({
                    //["name"]:obj.name,
                    ["enabled"]: obj.option.enabled,
                    ["min"]:obj.option.min,
                    ["max"]:obj.option.max,
                    ["terms"]:obj.option.terms
                });
            },
            handleTypeChange(type){
                if(type === "4"){
                    this.setState({
                        bShowFormulaConfig: true
                    });
                }else{
                    this.setState({
                        bShowFormulaConfig: false
                    });
                }
            },
            validationFormula(e){
                if(e.target.value.indexOf("（") > -1 || e.target.value.indexOf("）") > -1 || e.target.value.indexOf("＋") > -1 || e.target.value.indexOf("－") > -1 || e.target.value.indexOf("×") > -1 || e.target.value.indexOf("／") > -1){
                    this.props.form.setFields({
                        ["formulaConfig"]:{
                            value: e.target.value,
                            errors: [new Error(I18n.resource.message.FORMULA_HAS_CHINESE_SYMBOLS)]
                        }
                    });
                }else{
                    this.props.form.setFields({
                        ["formulaConfig"]:{
                            value: e.target.value,
                            errors: null
                        }
                    });
                }
            },
            defaultDealt(e){
                e.preventDefault();
            },
            dropInputParameter(e){
                var dragName;
                var drogData =  e.dataTransfer.getData("data");
                var dragId = e.dataTransfer.getData("dsItemId");
                if(drogData){
                    dragName = JSON.parse(drogData).name;
                }else if (dragId){
                    if (AppConfig.datasource.currentObj === 'cloud') {
                        dragName = $('#tableDsCloud').find('tr[ptid="' + dragId + '"]').find('.tabColName').attr('data-value');
                        var currentId = $('#selectPrjName').find('option:selected').val();
                        if (currentId) {
                            dragName = '@' + currentId + '|' + dragName;
                        } else {
                            dragName = dragId;
                        }
                    }else{
                        dragName = dragId;
                    }
                }
                var index = $("#formulaConfig")[0].selectionStart;
                var curVal = e.target.value;
                var tpl = curVal.slice(0,index) + dragName + curVal.slice(index);
                this.props.form.setFieldsValue({
                    ["formulaConfig"]: tpl
                });
                var arr = this.state.parametersArr;
                if(arr.indexOf(dragName) < 0){
                    arr.push(dragName)
                }
                this.setState({
                    parametersArr: arr
                })
            },
            formulaConfig(){
                const { getFieldDecorator } = this.props.form;
                var dropFormulaParameter = this.dropInputParameter;
                var defaultDealt = this.defaultDealt;
                var validationFormula = this.validationFormula;
                return this.state.bShowFormulaConfig ?
                    h(FormItem,{
                        label: I18n.resource.modal.FORMULA_CONFIGURATION,
                        labelCol:{ span: 4 },
                        wrapperCol:{ span: 16 }
                    },[
                        getFieldDecorator('formulaConfig', {
                            initialValue: '',
                            //rules: [{ required: true, message: '公式配置不能为空！' }]
                        })(
                            h(Input,{
                                placeholder:I18n.resource.placeholder.FORMULA_PLACEHOLDER,
                                type:"textarea",
                                autosize:{
                                    minRows: 1,
                                    maxRows:4
                                },
                                onDrop: dropFormulaParameter,
                                onDragEnter: defaultDealt,
                                onDragOver: defaultDealt,
                                onBlur: validationFormula
                            })
                        )
                    ]):null
            },
            getCompleteParameters(terms){
                var arr = [];
                var data = deepClone([],terms);
                if(data.length > 0){
                    data.forEach(function(row){
                        var isComplete = false;
                        if(row.type === 0){
                            if(row.points.length === 3){
                                isComplete = true;
                            }
                        }else if(row.type === 1){
                            if(row.points.length === 2){
                                isComplete = true;
                            }
                        }else{
                            if(row.points.length === 4){
                                isComplete = true;
                            }
                        }
                        if(isComplete){
                            var allNumber = true;
                            row.points.some(function(a,i){
                                if(isNaN(parseFloat(a))){
                                    allNumber = false;
                                    return true;
                                }else{
                                    row.points[i] = parseFloat(a);
                                }
                            });
                            allNumber && arr.push(row);
                        }
                    });
                }
                return arr;
            },
            componentDidMount() {
                let values = this.props.form.getFieldsValue();
                values.enabled = values.enabled?1:0;
                var defaultData = {
                    name:this.props.data.name,
                    option:values
                };
                this.setState({
                    bShowFormulaConfig:values.type === "4"?true:false,
                    pos: [0, 0],
                    parametersArr: this.props.data.option.formulaConfig ? this.props.data.option.formulaConfig.parameters : [],
                    code: fuzzyRuleParser.stringifyInput(this.props.data.option? this.props.data : defaultData)
                });
            },
            componentWillReceiveProps(nextProps) {
                var _this = this;
                let values = nextProps.form.getFieldsValue();
                var newValues = deepClone({},values);
                newValues.enabled = values.enabled?1:0;
                newValues.min = this.transformNumber(values.min) || this.props.data.option.min;
                newValues.max = this.transformNumber(values.max) || this.props.data.option.max;
                newValues.terms.forEach(function(row){
                    row.points.forEach(function(point,i){
                        row.points[i] = parseFloat(parseFloat(_this.transformNumber(point)).toFixed(3));
                    })
                });
                var inputData = {
                    name:nextProps.data.name,
                    option:newValues
                };

                this.setState({
                    code: fuzzyRuleParser.stringifyInput(inputData)
                });
            },
            handleAfterClose() {
                this.props.form.resetFields();
            },
            setCustomOption(unit){
                if(unit){
                    //this.children.forEach(function(){
                    //
                    //})
                    return (h(Option, { value: unit ,style:{display:"none"}}, [unit]))
                }else{
                    return [];
                }
            },
            render(){
                const { visible, onCancel ,form } = this.props;
                const { getFieldDecorator } = form;

                let values = form.getFieldsValue();

                return (
                    h(Modal, {
                        visible: visible,
                        maskClosable:false,
                        width: 800,
                        title: I18n.resource.modal.THE_NEW_INPUT_PARAMETERS,
                        okText: I18n.resource.modal.OK,
                        cancelText: I18n.resource.modal.CANCEL,
                        onOk: this.submitForm,
                        onCancel: onCancel,
                        afterClose: this.handleAfterClose,
                        wrapClassName: "vertical-center-modal scrollable-modal"
                    },[
                        h("div",{className:"modalContent gray-scrollbar"},[
                        h(Form,{id:"inputForm"}, [
                        h(FormItem, {
                            label: I18n.resource.modal.ALIAS,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        }, [
                            getFieldDecorator('alias', {
                                initialValue: '',
                                rules: [{ required: true, message: I18n.resource.message.CHART_TITLE_EMPTY }]
                            })(
                                h(Input,{
                                    placeholder:I18n.resource.placeholder.ENTER_CHART_TITLE
                                })
                            )
                        ]),
                        h(FormItem, {
                            label: I18n.resource.modal.UNIT,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        }, [
                            getFieldDecorator('unit', {
                                //initialValue: '',
                                //rules: [{ required: true, message: '单位不能为空！' }]
                            })(
                                h(Select,{
                                    placeholder:I18n.resource.placeholder.ENTER_OR_SELECT_UNIT,
                                    showSearch:true,
                                    combobox:true,
                                    onChange:function(value){
                                        this.props.form.setFieldsValue({
                                            ['unit']:value
                                        })
                                    }.bind(this),
                                    optionFilterProp:"children"
                                },[
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.TEMPERATURE] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.TEMPERATURE]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.TEMPERATURE_F] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.TEMPERATURE_F]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.WEIGHT] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.WEIGHT]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.ENERGY] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.ENERGY]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.K_ENERGY] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.K_ENERGY]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.M_ENERGY] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.M_ENERGY]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.POWER] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.POWER]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.ELECTRIC] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.ELECTRIC]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FREQUENCY] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FREQUENCY]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FREQUENCY_P] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FREQUENCY_P]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FLOW_S] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FLOW_S]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FLOW_H] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FLOW_H]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FLOW_M] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.FLOW_M]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.LEVEL] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.LEVEL]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.LEVEL_C] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.LEVEL_C]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.WATER_LEVEL] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.WATER_LEVEL]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.WATER_LEVEL_C] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.WATER_LEVEL_C]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.HIGHT] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.HIGHT]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.HIGHT_C] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.HIGHT_C]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.HIGHT_D] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.HIGHT_D]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.HIGHT_M] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.HIGHT_M]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.SPEED] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.SPEED]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.SPEED_K] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.SPEED_K]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.RADIATION] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.RADIATION]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.ILLUMINATION] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.ILLUMINATION]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.PRESSURE] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.PRESSURE]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.K_PRESSURE] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.K_PRESSURE]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.B_PRESSURE] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.B_PRESSURE]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.LOAD] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.LOAD]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.LOAD_H]}, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.LOAD_H]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.RATIO] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.RATIO]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.RATIO_E] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.RATIO_E]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.RATIO_O] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.RATIO_O]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.CONCENTRATION] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.CONCENTRATION]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.REN_MIN_BI] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.REN_MIN_BI]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.DOLLAR] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.DOLLAR]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.STATUS] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.STATUS]]),
                                    h(Option, { value: enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.COMMOND] }, [enums.fuzzyRuleUnitNames[enums.fuzzyRuleUnit.COMMOND]])
                                ].concat(this.setCustomOption(values.unit)))
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.TYPE,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        }, [
                            getFieldDecorator('type', {
                                initialValue: "0"
                            })(
                                h(Select, {
                                        placeholder: I18n.resource.placeholder.SELECT_PARAMETER_TYPE,
                                        onChange:this.handleTypeChange
                                    }, [
                                        h(Option, { value: enums.fuzzyRuleInputOutputTypes.UNDEFINED.toString() }, [enums.fuzzyRuleInputOutputTypeNames[enums.fuzzyRuleInputOutputTypes.UNDEFINED]]),
                                        h(Option, { value: enums.fuzzyRuleInputOutputTypes.CONTINUOUS.toString() }, [enums.fuzzyRuleInputOutputTypeNames[enums.fuzzyRuleInputOutputTypes.CONTINUOUS]]),
                                        h(Option, { value: enums.fuzzyRuleInputOutputTypes.BOOL.toString() }, [enums.fuzzyRuleInputOutputTypeNames[enums.fuzzyRuleInputOutputTypes.BOOL]]),
                                        h(Option, { value: enums.fuzzyRuleInputOutputTypes.SETPOINT.toString() }, [enums.fuzzyRuleInputOutputTypeNames[enums.fuzzyRuleInputOutputTypes.SETPOINT]]),
                                        h(Option, { value: enums.fuzzyRuleInputOutputTypes.FORMULA.toString() }, [enums.fuzzyRuleInputOutputTypeNames[enums.fuzzyRuleInputOutputTypes.FORMULA]]),
                                        h(Option, { value: enums.fuzzyRuleInputOutputTypes.CONTINUOUSWITHSETPOINT.toString() }, [enums.fuzzyRuleInputOutputTypeNames[enums.fuzzyRuleInputOutputTypes.CONTINUOUSWITHSETPOINT]]),
                                        h(Option, { value: enums.fuzzyRuleInputOutputTypes.SERIESANALYSISCODE.toString() }, [enums.fuzzyRuleInputOutputTypeNames[enums.fuzzyRuleInputOutputTypes.SERIESANALYSISCODE]]),
                                        h(Option, { value: enums.fuzzyRuleInputOutputTypes.CUSTORMIZEDCONTINUOUS.toString() }, [enums.fuzzyRuleInputOutputTypeNames[enums.fuzzyRuleInputOutputTypes.CUSTORMIZEDCONTINUOUS]])
                                    ]
                                )
                            )
                        ]),
                        this.formulaConfig(),
                        h(FormItem,{
                            label: I18n.resource.modal.SEQUENTIAL_CHECKING,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 },
                            style:{
                                display:this.state.bShowFormulaConfig?"none":"block"
                            }
                        }, [
                            getFieldDecorator('check', {
                                initialValue: "0"
                            })(
                                h(Select, {placeholder: I18n.resource.placeholder.SELECT_TYPE}, [
                                    h(Option, {
                                        value: "0"
                                    }, [I18n.resource.modal.NO]),
                                    h(Option, {
                                        value: "1"
                                    }, [I18n.resource.modal.YES])
                                ])
                            )
                        ]),
                        h(FormItem, {
                            label: I18n.resource.modal.SENSOR_ACCURACY,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 8 },
                            style:{
                                display:this.state.bShowFormulaConfig?"none":"block"
                            }
                        }, [
                            getFieldDecorator('precision',{
                                initialValue: '999'
                            })(
                                h(Input,{
                                    onChange: function(value){
                                        this.changePrecision(value);
                                    }.bind(this),
                                    placeholder:I18n.resource.placeholder.ENTER_VALUE
                                })
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.STATE,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            getFieldDecorator("enabled",{
                                valuePropName: 'checked',
                                initialValue: true
                            })(
                                h(Switch, {
                                    onChange: function(value){
                                        this.changeEnabled(value);
                                    }.bind(this),
                                    checkedChildren:I18n.resource.modal.OPEN,
                                    unCheckedChildren:I18n.resource.modal.CLOSE
                                })
                            )
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.VIEW,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            h(Col,{
                                span:24,
                                style:{
                                    height: 200
                                }
                            },[
                                h(FuzzyRuleChart, {
                                    min: this.transformNumber(values.min),
                                    max: this.transformNumber(values.max),
                                    shapes: values.terms?this.getCompleteParameters(values.terms):values.terms,
                                    pos: this.state.pos
                                })
                            ]),
                            h(Col,{
                                span:24
                            },[
                                h(Slider,{
                                    style:{
                                        marginLeft:0,
                                        marginRight:0
                                    },
                                    min:this.transformNumber(values.min),
                                    max:this.transformNumber(values.max),
                                    step:0.001,
                                    value:this.state.progress,
                                    tipFormatter: null,
                                    onChange: this.changeProgress,
                                    ref:"progress"
                                })
                            ]),
                            h(InputGroup,{},[
                                h(Col,{
                                    span:4,
                                    style:{
                                        paddingRight:0
                                    }
                                },[
                                    getFieldDecorator('min', {
                                        initialValue: 0.000
                                    })(
                                        h(Input ,{
                                            size:"large",
                                            //step:0.001,
                                            onChange: function(e){
                                                this.changeRange("min", e.target.value)
                                            }.bind(this)
                                        })
                                    )
                                ]),
                                h(Col,{
                                    span:4,
                                    offset:6,
                                    style:{
                                        textAlign:"center",
                                        paddingRight:0
                                    }
                                },[
                                    getFieldDecorator('centerInputNumber', {})(
                                        h(Input ,{
                                            size: "large",
                                            //step: 0.001,
                                            onChange: function(e){
                                                this.changeProgress(e.target.value)
                                            }.bind(this)
                                        })
                                    )
                                ]),
                                h(Col,{
                                    offset:6,
                                    span:4,
                                    style:{
                                        textAlign:"right",
                                        paddingRight:0
                                    }
                                },[
                                    getFieldDecorator('max', {
                                        initialValue: 10.000
                                    })(
                                        h(Input ,{
                                            size:"large",
                                            //step:0.001,
                                            style:{
                                                marginRight:0
                                            },
                                            onChange: function(e){
                                                this.changeRange("max",e.target.value)
                                            }.bind(this)
                                        })
                                    )
                                ])
                            ]),
                            h(Col,{
                                span:24,
                                style:{
                                    marginTop: 10
                                }
                            },[
                                h("div",{
                                    style:{
                                        border:"1px dashed #abb8bf",
                                        height: 35,
                                        textAlign: "center",
                                        overflow: "auto"
                                    }
                                },[
                                    this.state.formula
                                ])
                            ])
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.SET,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            h(Col,{
                                span:24
                            },[
                                getFieldDecorator('terms', {
                                    initialValue: []
                                })(
                                    h(setParameters,{
                                        changeFormula:this.changeFormula
                                    })
                                )
                            ])
                        ]),
                        h(FormItem,{
                            label: I18n.resource.modal.PARAMETER_OF_THE_CODE,
                            labelCol:{ span: 4 },
                            wrapperCol:{ span: 16 }
                        },[
                            h(Col,{
                                span:24,
                                style:{
                                    marginTop: 10
                                }
                            },[
                                h(CodeEditor, {
                                    style: {
                                        height: '150px'
                                    },
                                    value: this.state.code,
                                    onChange: this.changeCode
                                })
                            ])
                        ])
                    ])
                    ])
                ])
            )}
        })
    );

    exports.FuzzyRuleInputModal = FuzzyRuleInputModal;
}));
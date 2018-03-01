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
            namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel.FuzzyRuleInputModal'),
            namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel.FuzzyRuleOutputModal'),
            namespace('beop.strategy.components.modals.InputParamModal'),
            namespace('beop.strategy.components.modals.OutputParamModal'),
            namespace('beop.strategy.components.modals.DataSourceModal'),
            namespace('beop.strategy.components.modals.ImportParametersModal')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    enums,
    FuzzyRuleInputModal,
    FuzzyRuleOutputModal,
    InputParamModal,
    OutputParamModal,
    DataSourceModal,
    ImportParametersModal
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    const deepClone = $.extend.bind($, true);

    const {  Form,Row , Col, Button , Input, Select,InputNumber, Slider ,Icon ,Modal,Switch} = antd;
    const FormItem = Form.Item;
    const InputGroup = Input.Group;
    const Option = Select.Option;

    class InputOutputParamConfigPanel extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                modal:{
                    data: {},
                    type: null
                },
                dataSource: {
                    _id: null,
                    visible:false,
                    data:{}
                },
                data: this.props.data,
                type: this.props.type,
                bShowImportConfig: false,
                expend:"up"
            };
        }
        componentWillReceiveProps(nextProps){
            this.setState({
                data: nextProps.data
            });
        }
        showPanel(type,data){
            //this.onCancel();
            var panelData;
            var inputOutputData = this.props.data;
            if(inputOutputData && data){
                inputOutputData.some(function(row){
                    if(row._id === data._id){
                        panelData = row;
                        return true;
                    }
                });
            }

            this.setState({
                modal: {
                    type: type,
                    data: panelData
                }
            });
        }
        showDataSource(data){
            var dataSource;
            var id = null;
            var inputOutputData = this.props.data;
            if(inputOutputData && data){
                inputOutputData.some(function(row){
                    if(row._id === data._id){
                        id = row._id;
                        if(!row.option){
                            row.option = {
                                dataSource:{}
                            }
                        }
                        dataSource = row.option.dataSource;
                        return true;
                    }
                });
            }
            this.setState({
                dataSource: {
                    _id: id,
                    visible:true,
                    data:dataSource
                }
            });
        }
        onCancelDataSource(){
            this.setState({
                dataSource: {
                    visible: false
                }
            });
        }
        createOkFn(type) {
            return function (data) {
                let oldData = deepClone([], this.props.data);
                var newData;

                this.setState({
                    modal: {
                        type: null,
                        data: {}
                    }
                });

                var index = -1;
                if(data._id){
                    oldData.some(function(row,i){
                        if(row._id === data._id){
                            index = i;
                            return true;
                        }
                    });
                }
                if(index > -1){
                    delete data._id;
                    oldData[index]["option"] = data;
                    newData = oldData;
                }
                this.props.save(this.props.moduleId,type,newData)

            }.bind(this);
        }
        createOkDs(type){
            return function (data){
                let oldData = deepClone([], this.props.data);
                var newData;
                this.setState({
                    dataSource: {
                        visible: false
                    }
                });
                var index = -1;
                if(data._id){
                    oldData.some(function(row,i){
                        if(row._id === data._id){
                            index = i;
                            return true;
                        }
                    });
                }
                if(index > -1){
                    delete data._id;
                    oldData[index]["option"]["dataSource"] = data;
                    newData = oldData;
                }
                this.props.save(this.props.moduleId,type,newData)
            }.bind(this);
        }
        configModal(data){
            let Data = deepClone([], this.props.data);
            var index = -1;
            if(data._id){
                Data.some(function(row,i){
                    if(row._id === data._id){
                        index = i;
                    }
                });
            }
            if(index > -1){
                Data[index] = data;
            }

            this.props.save(this.props.moduleId,this.state.type,Data)
        }
        getDefaultName(){
            var arr = [];
            var name;
            this.props.data.forEach(function(row){
                var item = row.name;
                if(item.indexOf("untitle_") === 0){
                    if(!isNaN(parseInt(item.split("untitle_")[1]))){
                        arr.push(parseInt(item.split("untitle_")[1]))
                    }
                }
            });
            if(arr.length > 0){
                name = "untitle_" + (arr[arr.length - 1] + 1);
            }else{
                name = "untitle_1";
            }
            return name;
        }
        isRepetitiveName(data,_id){
            let Data = deepClone([], this.props.data);
            var repetitiveName = false;
            Data.some(function(row,i){
                if(row.name === data.name && row._id !== _id){
                    repetitiveName = true;
                    return true;
                }
            });
            if(repetitiveName){
                Modal.warning({
                    title: I18n.resource.title.DATA_ERROR,
                    content: data.name +I18n.resource.title.PARAMETER_NAME_REPETITION,
                    okText: I18n.resource.modal.OK
                });
                this.props.save(this.props.moduleId,this.state.type,Data);
                return true;
            }else{
                return false;
            }
        }
        onCancel() {
            this.setState({
                modal: {
                    type: null,
                    data: {}
                }
            });
        }
        getDefaultType(type){
            var parameterType;
            switch(this.props.parameterType) {
                case enums.moduleTypes.PYTHON:
                    parameterType = type === "input"? 0 : 30;
                    break;
                case enums.moduleTypes.FUZZY_RULE:
                    parameterType = type === "input"? 1 : 31;
                    break;
                default:
                    parameterType = type === "input"? 0 : 30;
                    break;
            }
            return parameterType;
        }
        addDefaultPanel(type){
            let oldData = deepClone([], this.props.data);

            var defaultData  = {
                _id: ObjectId(),
                name: this.getDefaultName(),
                desc: ""
            };
            if(type === 'input'){
                defaultData.type = this.getDefaultType(type);
                if(defaultData.type === 1){
                    defaultData.option = {
                        alias:"",
                        unit:"",
                        type: 0,
                        check: 0,
                        precision: "None",
                        enabled: 1,
                        min: 0,
                        max: 10,
                        terms:[],
                        status:1
                    };
                }
                defaultData.default = 'None';
            }else{
                defaultData.type = this.getDefaultType(type);
                if(defaultData.type === 31){
                    defaultData.option = {
                        status:1,
                        grade:1,
                        runMode:"All",
                        runTimeDay:12,
                        runTimeWeek:60,
                        runTimeMonth:240,
                        runTimeYear:2400,
                        unit:"kWh",
                        chart:[]
                    }
                }
            }
            this.props.save(this.props.moduleId,type,oldData.concat(defaultData))
        }
        deleteInputOutputParameter(_id){
            this.onCancel();
            const data = this.props.data.filter((row) => (row._id !== _id));

            if (data.length === this.props.data.length) {
                return;
            }

            this.props.save(this.props.moduleId,this.state.type,data);
        }
        addCopyParameter(data,i){
            let oldData = deepClone([], this.props.data);
            var copyData = deepClone({},data);
            i = i || 0;
            var name;
            oldData.forEach(function(row){
                var arr = row.name.split("_copy_");
                if(arr.length == 2 && arr[0] === copyData.name.split("_copy_")[0] && !isNaN(parseInt(arr[1]))){
                    name = arr[0] + "_copy_" + (parseInt(arr[1])+(1+i))
                }
            });
            copyData._id = ObjectId();
            delete copyData.loc;
            if(name){
                copyData.name = name;
            }else{
                copyData.name = copyData.name + "_copy_"+ (1 + i);
            }
            return copyData;
        }
        copyInputOutputParameter(data){
            let oldData = deepClone([], this.props.data);

            var copyData = this.addCopyParameter(data);
            this.props.save(this.props.moduleId,this.state.type,oldData.concat(copyData))
        }
        batchInputOutputParameter(copyNumber,data){
            let oldData = deepClone([], this.props.data);
            var batchData = [];
            for(var i =0;i< copyNumber;i++){
                var copyData = this.addCopyParameter(data,i);
                batchData.push(copyData);
            }
            this.props.save(this.props.moduleId,this.state.type,oldData.concat(batchData))
        }
        addInputOutputParameter(){
            this.onCancel();
            //this.showPanel(this.state.type);
            this.addDefaultPanel(this.state.type);
        }
        importInputOutputParameter(){
            this.setState({
                bShowImportConfig: true
            })
        }
        importParameters(type){
            return function (data){
                this.onCancelImport();
                let oldData = deepClone([], this.props.data);
                var newData = data.option[type];
                newData.forEach(function(row){
                    row._id = ObjectId();
                    row.desc = row.name;
                    if(type === "input"){
                        row.type = 1;
                        row.default = "None";
                        row.option.status = 1;
                        row.option.type = 0;
                        row.option.check = 0;
                        row.option.precision = 999;
                    }else{
                        row.type = 31;
                        row.option = {};
                        row.option.status = 1;
                        row.option.grade = 1;
                        row.option.runMode = "All";
                        row.option.runTimeDay = 12;
                        row.option.runTimeWeek = 60;
                        row.option.runTimeMonth = 240;
                        row.option.runTimeYear = 2400;
                        row.option.unit = "kWh";
                        row.option.chart = [];
                    }
                });

                this.props.save(this.props.moduleId,type,oldData.concat(newData))
            }.bind(this)
        }
        onCancelImport(){
            this.setState({
                bShowImportConfig: false
            })
        }
        expendALlParameter(){
            if(this.state.expend === "up"){
                $("#leftSider .ant-tabs-tabpane-active").find(".inputOutputConfigPanel").addClass("upDiv");
                this.setState({
                    expend: "down"
                });
            }else{
                $("#leftSider .ant-tabs-tabpane-active").find(".inputOutputConfigPanel").removeClass("upDiv");
                this.setState({
                    expend: "up"
                });
            }
        }

        setInputOutputParams(data){
            var _this = this;
            if(_this.state.type === "input"){
                return data.map(function(row,i){
                    return h(InputParamModal,{
                        key: row._id,
                        data: row,
                        type: _this.state.type,
                        configParameter: _this.showPanel.bind(_this,_this.state.type,row),
                        configDataSource: _this.showDataSource.bind(_this,row),
                        configModal: _this.configModal.bind(_this),
                        deleteParameter:_this.deleteInputOutputParameter.bind(_this,row._id),
                        copyParameter: _this.copyInputOutputParameter.bind(_this,row),
                        batchParameter: function(copyNumber){
                            _this.batchInputOutputParameter(copyNumber,row)
                        }.bind(_this),
                        otherModuleOutputs: _this.props.otherModuleOutputs,
                        isRepetitiveName: _this.isRepetitiveName.bind(_this),
                        disabled:_this.state.modal.type?true:false
                    })
                });
            }else{
                return data.map(function(row,i){
                    return h(OutputParamModal,{
                        key: row._id,
                        data: row,
                        type: _this.state.type,
                        configParameter: _this.showPanel.bind(_this,_this.state.type,row),
                        configDataSource: _this.showDataSource.bind(_this,row),
                        configModal: _this.configModal.bind(_this),
                        deleteParameter:_this.deleteInputOutputParameter.bind(_this,row._id),
                        copyParameter: _this.copyInputOutputParameter.bind(_this,row),
                        batchParameter: function(copyNumber){
                            _this.batchInputOutputParameter(copyNumber,row)
                        }.bind(_this),
                        disabled:_this.state.modal.type?true:false
                    })
                });
            }
        }

        render() {
            if (this.state.type) {
                document.body.classList.add('params-config-modal-fix');
            } else {
                document.body.classList.remove('params-config-modal-fix');
            }
            return (
                h("div", {
                    style: {
                        height: '100%'
                    }
                }, [
                    h("div",{
                        className:"config-panel-header",
                        style:{
                            borderBottom: "1px solid #495252",
                            lineHeight: "64px",
                            padding:0
                        }
                    },[
                        h("div",{
                            className:"config-panel-header-right",
                            style:{
                                float: "none",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%"
                            }
                        },[
                            h(Button , {
                                id: "upOrDown",
                                type: 'dashed',
                                onClick: function(){
                                    this.expendALlParameter()
                                }.bind(this)
                            },[this.state.expend === "up"?I18n.resource.inputOutputParameter.PACK_UP_A_KEY:I18n.resource.inputOutputParameter.A_KEY_IN]),
                            h(Button , {
                                style:{
                                    display: this.props.parameterType === 107 ? "block":"none"
                                },
                                type: 'dashed',
                                onClick: function(){
                                    this.importInputOutputParameter()
                                }.bind(this)
                            },[
                                I18n.resource.inputOutputParameter.IMPORT
                            ]),
                            h(Button , {
                                style:{
                                    //marginTop: 10
                                },
                                type: 'dashed',
                                onClick: function(){
                                    this.addInputOutputParameter()
                                }.bind(this)
                            },[
                                I18n.resource.inputOutputParameter.ADD
                            ])
                        ])
                    ]),
                    h("div.gray-scrollbar",{
                        style:{
                            height: "calc(100% - 64px)",
                            overflow: "auto"
                        },
                        id: "parametersContent"
                    },this.setInputOutputParams(this.state.data)),
                    this.state.modal.type === "input" ? h(FuzzyRuleInputModal, {
                        visible: this.state.modal.type === 'input',
                        onOk: this.createOkFn("input"),
                        onCancel: this.onCancel.bind(this),
                        data: this.state.modal.data,
                        type:"input"
                    }) : this.state.modal.type === "output" ? h(FuzzyRuleOutputModal, {
                        visible: this.state.modal.type === 'output',
                        onOk: this.createOkFn("output"),
                        onCancel: this.onCancel.bind(this),
                        inputData: this.props.inputData,
                        data: this.state.modal.data,
                        type:"output"
                    }) : null,
                    this.state.dataSource.visible ? h(DataSourceModal,{
                        visible: this.state.dataSource.visible,
                        onOk: this.createOkDs(this.state.type),
                        onCancel: this.onCancelDataSource.bind(this),
                        data: this.state.dataSource.data,
                        _id: this.state.dataSource._id
                    }) : null,
                    this.state.bShowImportConfig ? h(ImportParametersModal,{
                        visible: this.state.bShowImportConfig,
                        onOk: this.importParameters(this.state.type),
                        onCancel: this.onCancelImport.bind(this)
                    }):null
                ])
            );
        }
    }

    exports.InputOutputParamConfigPanel = InputOutputParamConfigPanel;
}));
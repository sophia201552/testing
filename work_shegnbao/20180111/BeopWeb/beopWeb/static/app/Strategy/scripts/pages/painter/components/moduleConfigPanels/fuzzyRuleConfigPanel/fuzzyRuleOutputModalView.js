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
            namespace('beop.strategy.components.FaultInfoComponent')
        );
    }
}(namespace('beop.strategy.components.moduleConfigPanels.FuzzyRuleConfigPanel'), function(
    exports,
    React,
    antd,
    enums,
    FaultInfoComponent
) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    const deepClone = $.extend.bind($, true);

    const {  Form,Row , Col, Button ,Tag, Input, Select,Modal,Icon} = antd;
    const FormItem = Form.Item;
    const InputGroup = Input.Group;
    const Option = Select.Option;
    const PAGE_SIZE = 20;
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
            var dragTagitemId = e.dataTransfer.getData("tagitemId");
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
                dragTagitemId = JSON.parse(dragTagitemId).id;
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
            data.parameters[key] = value === ""? value : (value[value.length-1]=='.'?value:parseFloat(value));
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


    class FaultMangerModal extends React.Component{
        constructor(props, context) {
            super(props, context);
            this.updateTableAsync = null;
            this.getClassAsync = null;
            this.state = {
                visible: false,
                classNameArr: [],
                consequencesNameArr: [],
                gradeNameArr: [],
                classNameCount: [],
                consequencesCount: [],
                gradeCount: [],
                items: [],
                searchKey: [],
                selectedClassName: [],
                selectedConsequence: [],
                selectedGrade: [],
                page: 1,
                totalNum: 1,
                selectedId: undefined
            }
            this.onOk = this.onOk.bind(this);
            this.onCancel = this.onCancel.bind(this);
            this.showModal = this.showModal.bind(this);
            this.doUse = this.doUse.bind(this);
            this.updateSelected = this.updateSelected.bind(this);
            this.updateTable = this.updateTable.bind(this);
        }
        componentDidMount() {
            this.getClassAsync = WebAPI.get('/diagnosis_v2/getFaultsClassNames/'+I18n.type).done((rs)=>{
                 this.setState({
                     classNameArr: rs.data[0].nameArr,
                     classNameCount: rs.data[0].count,
                     consequencesNameArr: rs.data[1].nameArr,
                     consequencesCount: rs.data[1].count,
                     gradeNameArr: rs.data[2].nameArr,
                     gradeCount: rs.data[2].count
                 });
            }).always(()=>{
                this.getClassAsync = null;
            });
            this.updateTableAsync = WebAPI.post('/diagnosis_v2/getFaultsInfo', {
                "pageNum": 1,
                "pageSize": PAGE_SIZE,
                "grades": [],
                "consequences": [],
                "keywords": '',
                "classNames": [],
                "sort": [],
                "lan": I18n.type
            }).done((rs)=>{
                let items = rs.data.data;
                let totalNum = rs.data.total;
                this.setState({
                    items,
                    page: 1,
                    totalNum
                });
            }).always(()=>{
                this.updateTableAsync = null;
            });
        }
        componentDidUpdate() {

        }
        componentWillUnmount() {
            if(this.updateTableAsync){
                this.updateTableAsync.abort();
                this.updateTableAsync = null;
            }
            if(this.getClassAsync){
                this.getClassAsync.abort();
                this.getClassAsync = null;
            }
        }
        render() {
            const {
                visible,
                classNameArr,
                consequencesNameArr,
                gradeNameArr,
                classNameCount,
                consequencesCount,
                gradeCount,
                items,
                searchKey,
                selectedClassName,
                selectedConsequence,
                selectedGrade,
                page,
                totalNum,
                selectedId
            } = this.state;
            return h(Modal,{
                visible: visible,
                maskClosable:false,
                width: 'auto',
                title: 'Faults Manger',
                okText: I18n.resource.modal.OK,
                cancelText: I18n.resource.modal.CANCEL,
                onOk: this.onOk,
                onCancel: this.onCancel,
                wrapClassName: 'faultManageModal',
            },[
                h(FaultInfoComponent,{
                    classNameArr,
                    consequencesNameArr,
                    gradeNameArr,
                    classNameCount,
                    consequencesCount,
                    gradeCount,    
                    items,
                    searchKey,
                    selectedClassName,
                    selectedConsequence,
                    selectedGrade,
                    page,
                    totalNum,
                    showBack:false,
                    showUse: true,
                    updateTable: this.updateTable,
                    updateSelected: this.updateSelected,
                    doUse: this.doUse,
                    selectedId
                })
            ])
        }
        showModal(isShow, id, faultName) {
            if(id){
                let page = 1;
                let lan = I18n.type;
                if((/^[\u4e00-\u9fa5]*$/.test(faultName) && I18n.type === 'zh') || (/^[a-zA-Z]*$/.test(faultName) && I18n.type === 'en')){
                    page = Math.floor(id/PAGE_SIZE)+1;
                }
                this.updateTableAsync = WebAPI.post('/diagnosis_v2/getFaultsInfo', {
                    "pageNum": page,
                    "pageSize": PAGE_SIZE,
                    "grades": [],
                    "consequences": [],
                    "keywords": '',
                    "classNames": [],
                    "sort": [],
                    "lan": lan
                }).done((rs)=>{
                    let items = rs.data.data;
                    let totalNum = rs.data.total;
                    this.setState({
                        items,
                        page: page,
                        totalNum,
                        selectedId: id
                    });
                }).always(()=>{
                    this.updateTableAsync = null;
                });
            }
            this.setState({
                visible: isShow,
                selectedId: undefined
            });
            if (isShow){
                document.body.classList.add('faultManageContainer');
            }else{
                document.body.classList.remove('faultManageContainer');
            }
        }
        onOk() {
            this.showModal(false);
        }
        onCancel() {
            this.showModal(false);
        }
        doUse(fault) {
            this.props.parent.setFaultId(fault.id, fault.name);
            this.showModal(false);
        }
        updateSelected(obj={}) {
            this.setState(Object.assign(this.state,obj));
            this.updateTable({
                pageNum: 1
            })
        }
        updateTable(obj={}) {
            let state = this.state;

            let postData = {
                "pageNum": state.page,
                "pageSize": PAGE_SIZE,
                "grades": state.selectedGrade,
                "consequences": state.selectedConsequence,
                "keywords": state.searchKey,
                "classNames": state.selectedClassName,
                "sort": [],
                "lan": I18n.type
            }
            if(this.updateTableAsync){this.updateTableAsync.abort()}
            this.updateTableAsync = WebAPI.post('/diagnosis_v2/getFaultsInfo', Object.assign(postData, obj)).done((rs)=>{ 
                let items = rs.data.data;
                let totalNum = rs.data.total;
                this.setState({
                    items,
                    page: postData.pageNum,
                    totalNum,
                });
            }).always(()=>{
                this.updateTableAsync = null;
            })
        }
    }

    class FuzzyRuleOutputModal extends React.Component{
        constructor(props, context) {
            super(props, context);
            this.form = null;
            this.data = props.data;
            this.async = null;
            this.state = {
                visible: props.visible||false,
                chart: {},
                group: null,
                groupAjax: null,
                energyConfig: null,
                faultGroup: null,
                faultName: undefined
            }
            this.submitForm = this.submitForm.bind(this);
            this.closeModal = this.closeModal.bind(this);
            this.getFrom = this.getFrom.bind(this);
            // this.getFaultGroupOption = this.getFaultGroupOption.bind(this);
            // this.getGroup = this.getGroup.bind(this);
            this.showFaultManger = this.showFaultManger.bind(this);
            this.handleFormChange = this.handleFormChange.bind(this);
            this.setFaultId = this.setFaultId.bind(this);
        }
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
            WebAPI.post("/diagnosis_v2/getFaultsNameByIds",{
                ids: [this.data.option.faultId],
                lan: I18n.type
            }).done((result)=>{
                this.setState({
                    faultName: result.data[0]
                });
            }).always(()=>{
                this.async = null;
            });
        }
        componentWillReceiveProps(nextProps) {
            const {visible, data} = nextProps;
            this.data = data;
            this.setState({
                visible
            });
        }
        componentWillUnmount() {
            if(this.async){
                this.async.abort();
                this.async = null;
            }
        }
        render() {
            const {visible} = this.state;
            return h(Modal, {
                visible: visible,
                maskClosable:false,
                width: 800,
                title: I18n.resource.modal.THE_NEW_OUTPUT_PARAMETERS,
                okText: I18n.resource.modal.OK,
                cancelText: I18n.resource.modal.CANCEL,
                onOk: this.submitForm,
                onCancel: this.closeModal,
                wrapClassName: "vertical-center-modal scrollable-modal"
            },[
                this.getFrom(),
                h(FaultMangerModal,{
                    ref: 'FaultMangerModal',
                    parent: this,
                })
            ])
        }
        setFaultId(faultId, faultName) {
            this.data.option.faultId = faultId;
            this.setState({
                faultName
            });
        }
        showFaultManger() {
            this.data.option.id;
            this.refs.FaultMangerModal.showModal(true, this.data.option.faultId, this.state.faultName);
        }
        submitForm() {
            const {onOk} = this.props;
            this.form.validateFields((err, formData) => {
                if (err) {
                    return ;
                }
                let data = {
                    faultId: parseInt(formData.faultId),
                    faultTypeGroup: formData.faultTypeGroup || [],
                    targetGroup: formData.targetGroup,
                    targetExecutor: parseInt(formData.targetExecutor),
                    runTimeDay: parseInt(formData.runTimeDay),
                    runTimeWeek: parseInt(formData.runTimeWeek),
                    runTimeMonth: parseInt(formData.runTimeMonth),
                    runTimeYear: parseInt(formData.runTimeYear),
                    unit: formData.unit,
                    energyConfig: formData.energyConfig ||{},
                    chart: formData.chart,
                    faultTag: formData.faultTag==undefined?0:parseInt(formData.faultTag)
                };
                if(this.data){
                    data._id = this.data._id;
                    this.data.option.faultName && (delete this.data.option.faultName)
                }
                onOk(data);
            });
        }
        closeModal() {
            const {onCancel} = this.props;
            this.setState({
                visible: false
            });
            onCancel();
        }
        // getFaultGroupOption(){
        //     if(AppConfig.faultGroup){
        //         var children  = [];
        //         Object.keys(AppConfig.faultGroup).forEach(function(row){
        //             children.push(
        //                 h(Option,{
        //                     value: row
        //                 },[AppConfig.faultGroup[row]])
        //             )
        //         });
        //         return children;
        //     }else{
        //         return [];
        //     }
        // }
        getFrom() {
            const {inputData} = this.props;
            const data = this.data;
            const {faultName} = this.state;
            const keys = ['faultId','faultTypeGroup','targetGroup','targetExecutor','runTimeDay','runTimeWeek','runTimeMonth','runTimeYear','unit','energyConfig','chart','faultTag'];
            
            const CustomizedForm = Form.create({
                onFieldsChange(props, changedFields) {
                    props.onChange(changedFields);
                },
                mapPropsToFields(props) {
                    let newData = {};
                    
                    if (data && !$.isEmptyObject(data.option)) {
                        data.option.chart.forEach(function(row){
                            let data = inputData.filter(function(item){
                                return row._id === item._id;
                            });
                            if(data.length > 0){
                                row.name = data[0].name;
                                row.unit = data[0].option.unit;
                            }
                        });
                        // return {
                        //     faultTypeGroup: {value: data.option.faultTypeGroup},
                        //     targetGroup: {value: data.option.targetGroup},
                        //     targetExecutor: {value: data.option.targetExecutor},
                        //     runTimeDay: {value: data.option.runTimeDay},
                        //     runTimeWeek: {value: data.option.runTimeWeek},
                        //     runTimeMonth: {value: data.option.runTimeMonth},
                        //     runTimeYear: {value: data.option.runTimeYear},
                        //     unit: {value: data.option.unit},
                        //     energyConfig: {value: data.option.energyConfig},
                        //     chart: {value: data.option.chart}
                        // };
                        keys.forEach(key=>{
                            if(key=='faultTag'){
                                data.option[key] = data.option[key]||0;
                            }
                            newData[key] = {value:data.option[key]};
                        });
                        if(faultName){
                            newData['faultName'] = {value: faultName};
                        }
                    }
                    return newData;
                },
                onValuesChange(_, values) {
                    
                },
                })((props) => {
                const { getFieldDecorator } = props.form;
                this.form = props.form;
                let formItems = [
                    h(FormItem,{
                        label: I18n.resource.modal.FAULT_TEMPLATE,
                        labelCol:{ span: 4 },
                        wrapperCol:{ span: 16 }
                    },[
                        h(Row,{},[
                            h(Col,{span:24},[
                                getFieldDecorator("faultName",{
                                    rules: [{ required: true, message: I18n.resource.modal.FAULT_TEMPLATE_EMPTY }]
                                })(
                                    h(Input,{
                                        disabled: true,
                                        addonAfter: [h('div',{
                                            style:{
                                                cursor:'pointer'
                                            },
                                            onClick: this.showFaultManger
                                        },[I18n.resource.modal.FAULT_TEMPLATE_SELECT])]
                                    })
                                )
                            ]),
                            getFieldDecorator("faultId",{
                                    rules: [{ required: true, message: I18n.resource.modal.FAULT_TEMPLATE_EMPTY }]
                                })(
                                    h('input',{
                                        style: {
                                            display:'none'
                                        }
                                    })
                                )
                        ])
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
                            },[] )
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
                            h(Input, {placeholder: I18n.resource.placeholder.SELECT_GROUP})
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
                        label: I18n.resource.modal.FAULT_SOURCE,
                        labelCol:{ span: 4 },
                        wrapperCol:{ span: 16 }
                    }, [
                        getFieldDecorator('faultTag',{
                            initialValue: enums.fuzzyRuleFaultSource.DIAGNOSIS
                        })(
                            h(Select, {placeholder: I18n.resource.placeholder.SELECT_SOURCE}, [
                                h(Option, {
                                    value: enums.fuzzyRuleFaultSource.DIAGNOSIS
                                }, [enums.fuzzyRuleFaultSourceNames[enums.fuzzyRuleFaultSource.DIAGNOSIS]]),
                                h(Option, {
                                    value: enums.fuzzyRuleFaultSource.BA
                                }, [enums.fuzzyRuleFaultSourceNames[enums.fuzzyRuleFaultSource.BA]])
                            ])
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
                    ]),
                    
                ];
                return (
                    h(Form,{
                        layout: 'horizontal'
                    },formItems)
                );
            });
            return (h('div',{},[
                h(CustomizedForm,{
                    ref: 'CustomizedForm',
                    onChange: this.handleFormChange
                },[])
            ]));
        }
        // getGroup(data){
        //     if(data){
        //         return data.map(function(row){
        //             if(!row.name){
        //                 row.name = "默认项目";
        //             }
        //             return (
        //                 h(Option, {
        //                     value: row._id
        //                 }, [row.name])
        //             )
        //         })
        //     }else{
        //         return null;
        //     }
        // }
        handleFormChange(changedFields) {
            for (let key in changedFields){
                this.data.option[key] = changedFields[key].value;
            }
        }
    }

    exports.FuzzyRuleOutputModal = FuzzyRuleOutputModal;
}));
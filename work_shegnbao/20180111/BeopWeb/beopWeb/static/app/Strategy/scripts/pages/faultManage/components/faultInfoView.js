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
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    enums
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const {Pagination, Modal, Table, Form, Input, Button} = antd;
    const MyTag = antd.Tag;
    const FormItem = Form.Item;
    const toUpcaseFirst = (str)=>{
        if($.type(str) == "string" && str.length>0){
            let strArr = str.split('');
            strArr[0] = strArr[0].toLocaleUpperCase();
            return strArr.join('');
        }
        return str;
    }
    class CopyModal extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.keys = ['name','description','suggestion','grade','faultType','faultGroup','runMode','consequence','chartTitle','className','maintainable'];
            this.async = null;
            this.state = {
                loading: false,
                visible: false,
                template: null,
            }
            this.showModal = this.showModal.bind(this);
            this.handleOk = this.handleOk.bind(this);
            this.getFrom = this.getFrom.bind(this);
            this.handleFormChange = this.handleFormChange.bind(this);
            this.updateItem = this.updateItem.bind(this);
        }
        shouldComponentUpdate(nextProps, nextState) {
            const {loading, visible} = this.state;
            if(loading == nextState.loading && visible == nextState.visible){
                return false;
            }else{
                return true;
            }
        }
        componentWillReceiveProps(props) {

        }
        showModal(visible) {
            this.setState({
                visible,
            });
            if(this.async){
                this.async.abort();
                this.async = null;
            }
        }
        updateItem(item) {
            let template = {};
            this.keys.forEach(key=>{
                template[key] = item[key];
            });
            this.setState({
                template:template
            });
        }
        handleOk() {
            this.refs.CustomizedForm.validateFields((err, values) => {
                if(!err){
                    const {template} = this.state;
                    const {updateTable} = this.props;
                    this.setState({
                        loading: true,
                    });
                    let data = {
                        isPublic: 2,
                        lastModifyUser: AppConfig.userId,
                        lastModifyTime: new Date().format('yyyy-MM-dd HH:mm:ss')
                    };
                    Object.assign(data, template);
                    this.async = WebAPI.post('/diagnosis_v2/addNewFault', data).done(rs=>{
                        if (rs.data) {
                            updateTable();
                        } else {
                            alert('新增失败');
                        }
                    }).always(()=>{
                        this.async = null;
                        this.setState({
                            loading: false,
                            visible: false,
                        });
                    });
                }
            })
        }
        handleFormChange(changedFields) {
            let filter = {
                faultGroup:['#undifined#','#传感器#','#其他#','#容量#','#控制#','#操作不当#','#舒适性#','#设备#','#Capacity#','#Comfort#','#Control#','#Device#','#Equip#','#Improperbehavior#','#Other#','#Sensor#'],
                consequence:['#undifined#','#Comfort issue#','#Energy waste#','#Equipment Health#','#Other#']
            };
            let newTemplate = {};
            for (let key in changedFields){
                newTemplate[key] = changedFields[key].value;
                if(filter[key]){
                    if(newTemplate[key]=='undifined'){
                        return;
                    }
                    let filterStr = filter[key].join('');
                    if(filterStr.indexOf('#'+newTemplate[key])<0){
                        newTemplate[key] = 'undifined';
                        this.refs.CustomizedForm.setFieldsValue({[key]:'undifined'})
                    }
                }
            }
            
            this.setState({
                template: Object.assign({},this.state.template, newTemplate)
            });
        }
        getFrom() {
            const {template, fields} = this.state;
            const keys = this.keys;
            
            const CustomizedForm = Form.create({
                onFieldsChange(props, changedFields) {
                    // props.onChange(changedFields);
                },
                mapPropsToFields(props) {
                    let template = props.template;
                    let data = {};
                    keys.forEach(key=>{
                        data[key] = {value:template[key]}
                    });
                    return data;
                },
                onValuesChange(_, values) {
                    
                },
                })((props) => {
                const { getFieldDecorator } = props.form;
                let formItems = keys.map(key=>h(FormItem,{label: toUpcaseFirst(key)},[
                        getFieldDecorator(key, {
                            rules: [{ required: true, message: toUpcaseFirst(key) + ' error' }],
                        })(h(Input,{onBlur:(e)=>{
                            let filter = {
                                faultGroup:['undifined','传感器','其他','容量','控制','操作不当','舒适性','设备','Capacity','Comfort','Control','Device','Equip','Improperbehavior','Other','Sensor'],
                                consequence:['undifined','Comfort issue','Energy waste','Equipment Health','Other']
                            };
                            let newTemplate = {};
                                newTemplate[key] = this.refs.CustomizedForm.getFieldValue(key);
                                if(filter[key]){
                                    if(newTemplate[key]=='undifined'){
                                        return;
                                    }
                                    if(filter[key].indexOf(newTemplate[key])<0){
                                        newTemplate[key] = 'undifined';
                                        this.refs.CustomizedForm.setFieldsValue({[key]:'undifined'})
                                    }
                                }
                            
                            this.setState({
                                template: Object.assign({},this.state.template, newTemplate)
                            });
                        }}))
                    ]));
                return (
                    h(Form,{
                        layout: 'horizontal'
                    },formItems)
                );
            });
            return (h('div',{},[
                h(CustomizedForm,{
                    ref: 'CustomizedForm',
                    template: template,
                    // onChange: this.handleFormChange
                },[])
            ]));
        }
        render() {
            return (
                h(Modal, {
                    wrapClassName: "vertical-center-modal scrollable-modal",
                    width: 800,
                    title: '复制',
                    visible: this.state.visible,
                    onOk: this.handleOk,
                    onCancel: ()=>{this.showModal(false)},
                    footer: [h(Button, { key: 'close', onClick: ()=>{this.showModal(false)} }, [I18n.resource.modal.CANCEL]), h(Button, { key: 'save', onClick: this.handleOk, loading: this.state.loading }, [I18n.resource.modal.SAVE])]
                }, [
                    this.getFrom()
                ])
            )
        }
    }
    class ClassificationLayout extends React.Component{
        constructor(props, context) {
            super(props, context);
            this.state = {
                classNameArr: props.classNameArr || [],
                consequencesNameArr: props.consequencesNameArr || [],
                gradeNameArr: props.gradeNameArr || [],
                classNameCount: props.classNameCount || [],
                consequencesCount: props.consequencesCount || [],
                gradeCount: props.gradeCount || []
            }
            this.selectItem = this.selectItem.bind(this);
            this.getChildrenLayout = this.getChildrenLayout.bind(this);
        }
        componentWillReceiveProps(nextProps) {
            this.setState({
                classNameArr: nextProps.classNameArr,
                consequencesNameArr: nextProps.consequencesNameArr,
                gradeNameArr: nextProps.gradeNameArr,
                classNameCount: nextProps.classNameCount,
                consequencesCount: nextProps.consequencesCount,
                gradeCount: nextProps.gradeCount
            });
        }
        selectItem(selectName, categoryName, checkedStatus) {
            const {selectedClassName, selectedConsequence, selectedGrade} = this.props;
            if (checkedStatus === 'checkButton') {
                if (categoryName === 'className') {
                    var index = selectedClassName.findIndex(function (v) { return v === selectName; })
                    selectedClassName.splice(index, 1);
                } else if (categoryName === 'consequence') {
                    var index = selectedConsequence.findIndex(function (v) { return v === selectName; })
                    selectedConsequence.splice(index, 1);
                } else if (categoryName === 'grade') {
                    if (selectName === enums.faultGradeName[enums.faultGrade.ABNORMAL]){
                        selectName = 1;
                    } else if (selectName === enums.faultGradeName[enums.faultGrade.FAULT]){
                        selectName = 2;
                    }
                    var index = selectedGrade.findIndex(function (v) { return v === selectName; })
                    selectedGrade.splice(index, 1);
                }
            } else {
                if (categoryName === 'className') {
                    selectedClassName.push(selectName);
                } else if (categoryName === 'consequence') {
                    selectedConsequence.push(selectName);
                } else if (categoryName === 'grade') {
                    if (selectName === enums.faultGradeName[enums.faultGrade.ABNORMAL]){
                        selectName = 1;
                    } else if (selectName === enums.faultGradeName[enums.faultGrade.FAULT]){
                        selectName = 2;
                    }
                    selectedGrade.push(selectName);
                }
            }
            this.props.updateSelected({
                selectedClassName: selectedClassName.concat(),
                selectedConsequence: selectedConsequence.concat(),
                selectedGrade: selectedGrade.concat()
            });
        }
        getChildrenLayout(categoryName) {
            const {classNameArr, consequencesNameArr, gradeNameArr, classNameCount, consequencesCount, gradeCount,selectedClassName, selectedConsequence, selectedGrade} = this.props;
            var selectArr = [],
                allArr = [],
                count = [];
            switch(categoryName) {
                case 'className':
                    allArr = classNameArr;
                    selectArr = selectedClassName;
                    count = classNameCount;
                    break;
                case 'consequence':
                    allArr = consequencesNameArr;   
                    selectArr = selectedConsequence;
                    count = consequencesCount;
                    break;
                case 'grade':
                    allArr = gradeNameArr.map(row => enums.faultGradeName[row] || 'Unknow Grade');
                    for (let i in selectedGrade){
                        selectArr.push(enums.faultGradeName[selectedGrade[i]]);
                    }
                    count = gradeCount;
                    break;
            }
            let domArr = [];
            for (let i = 0, length = allArr.length; i < length; i++){
                let hasSelected = selectArr.find(v=>v == allArr[i]);
                let className = 'uncheckButton';
                if (hasSelected){
                    className = 'checkButton';
                }
                domArr.push(
                    h('div.classificationTag',  {
                            className: className,
                            style: {
                                padding: '0 15px'
                            },
                            onClick: ()=>{
                                this.selectItem(allArr[i], categoryName, className);
                            }
                        }, [
                            h('span', {
                                style: {
                                    width: 'calc(100% - 36px)'
                                }
                            }, [allArr[i]]),
                            h('span', {
                                style: {
                                    width: '36px',
                                    height: '16px',
                                    lineHeight: '16px',
                                    color: '#ffffff',
                                    background: '#2099ff',
                                    borderRadius: '10px',
                                    fontSize: '12px',
                                    textAlign: 'center'
                                }
                            }, [count[i]])    
                    ])
                );
            }
            return domArr;
        }
        render() {
            const {selectedClassName, selectedConsequence, selectedGrade} = this.props;
            let classNameChildren = this.getChildrenLayout('className'),
                consequenceChildren = this.getChildrenLayout('consequence'),
                gradeChildren = this.getChildrenLayout('grade');
            
            return h('div', {
                        style: {
                            height: '100%'
                        }
                    }, [
                        h('.category', [
                            h('.itemName', [I18n.resource.faultManage.CATEGORY]),
                            h('div.classNameCtn.left-scrollbar', classNameChildren)
                        ]),
                        h('.consequence', [
                            h('.itemName', [I18n.resource.faultManage.CONSEQUENCE]),
                            h('div.consequenceCtn.left-scrollbar', consequenceChildren)
                        ]),
                        h('.grade', [
                            h('.itemName', [I18n.resource.faultManage.GRADE]),
                            h('div.gradeCtn.left-scrollbar', gradeChildren)
                        ])
                    ])
        }
    }

    class Layouts extends React.Component{
        constructor(prop, context) {
            super(prop, context);
            this.async = null;
            this.getTable = this.getTable.bind(this);
        }
        getTable() {
            const doNth = ()=>{};
            const {items, selectedClassName=[], selectedConsequence=[], selectedGrade=[], searchKey="", updateTable, showUse = false, doUse = doNth} = this.props;
            let itemsChildren = items.map(item => {
                let {id,name,isPublic,grade,faultType,faultGroup,runMode,consequence,chartTitle,className,maintainable,description,lastModifyUser,lastModifyTime,suggestion} = item;
                let disabled = isPublic==2;
                return h('div.singleFault', {
                        'data-faultId':id
                    }, [
                        h('div.faultDetail', {
                                style: {
                                    width: 'calc(100% - 410px)',
                                }
                            }, [
                            h('span.faultName.col-xs-3', [name]),
                            h('span.faultDescription.col-xs-6', [description]),
                            h('span.faultDescription.col-xs-3', [description]),
                        ]),
                        h('div.fixedWidth', {
                            style: {
                                width: '410px',
                                display: 'flex',
                                alignItems: 'center'
                            }
                        }, [
                                h('span.lastModifyUser', {
                                    style: {
                                        width: '80px'
                                    }
                                }, [lastModifyUser]),
                            h('span.lastModifyTime',  {
                                    style: {
                                        width: '130px'
                                    }
                                }, [lastModifyTime.substring(0, 16)]),
                            h('span.useFaultButton', {
                                    style: {
                                        display: showUse?'block':'none',
                                        width: '60px',
                                        cursor: 'pointer'
                                    },
                                    onClick: ()=>{
                                        doUse(item);
                                    }
                                }, [I18n.resource.faultManage.USE]),
                            h('span.copyFaultButton', {
                                    style: {
                                        width: '80px',
                                        cursor: 'pointer'
                                    },
                                    onClick: ()=>{
                                        this.refs.CopyModal.updateItem(item);
                                        this.refs.CopyModal.showModal(true);
                                    }
                                }, [I18n.resource.faultManage.SAVE_AS]),
                            h('span.removeFaultButton', {
                                    style: {
                                        width: '60px',
                                        cursor: disabled?'pointer':'not-allowed',
                                        color: disabled?'inherit':'#777',
                                    },
                                    onClick: ()=>{
                                        if (disabled){
                                            this.async = WebAPI.post('/diagnosis_v2/deleteFault', {id: id}).done(function (rs) {
                                                if (rs.data) {
                                                    updateTable();
                                                } else {
                                                    alert(I18n.resource.faultManage.DELETE_FAILED);
                                                }
                                            }).always(()=>{
                                                this.async = null;
                                            });
                                        }
                                    }
                                }, [I18n.resource.faultManage.DELETE])
                        ])
                    ])
            });
            return h('div', [
                h('.input-group', [
                    h('input', {
                        className: 'form-control',
                        type:'text',
                        value: searchKey,
                        style: {
                            height: '26px',
                            borderRadius: '18px',
                            padding: '6px 24px 6px 12px',
                            width: '200px',
                            border: '1px solid #cccccc',
                            marginLeft: '15px',
                            boxShadow: 'inherit'
                        },
                        onInput: (evt)=>{
                            this.props.updateSelected({
                                "searchKey": evt.currentTarget.value
                            });
                        }
                    }),
                    h('span.spanSearch', {
                        style: {
                            position: 'absolute',
                            left: '190px',
                            color: '#525a60'
                        }
                    }, [
                        h('span',{
                            className: 'iconfont icon-weibiaoti-'
                        })
                    ])
                ]),
                h('div', {
                    style: {
                        height: 'calc(100% - 48px)',
                        padding: '15px'
                    }
                }, [
                        h('div', {
                            style: {
                                background: '#e9eaeb',
                            }
                        }, [
                            h('.tableName', {
                                style: {
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '16px',
                                    color: '#2e3235',
                                    width: 'calc(100% - 8px)'
                                }
                            }, [
                                h('div', {
                                    style: {
                                        width: 'calc(100% - 410px)'
                                    }    
                                }, [
                                    h('span.col-xs-3', [I18n.resource.faultManage.NAME]),
                                    h('span.col-xs-6', [I18n.resource.faultManage.DESCRIPTION]),
                                    h('span.col-xs-3', [I18n.resource.faultManage.SUGGESTION])
                                ]), h('div', {
                                    style: {
                                        width: '410px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }    
                                }, [
                                    h('span', {
                                        style: {
                                            width: '80px'
                                        }
                                    }, [I18n.resource.faultManage.LASTMODIFYUSER]),
                                    h('span', {
                                        style: {
                                            width: '130px'
                                        }
                                    }, [I18n.resource.faultManage.LASTMODIFYTIME]),
                                    h('span', [I18n.resource.faultManage.OPERATION])
                                ])
                            ])
                        ]),
                        h('.faultsList.faultList-scrollbar', {
                        style: {
                            overflow: 'auto',
                            height: 'calc(100% - 60px)',
                        }
                        }, [   
                            itemsChildren 
                        ])    
                ])
            ])
        }
        render() {
            const {
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
                isFromPainter,
                //customProps
                showBack = true,
                showUse = false,
                //actions
                updateTable,
                updateSelected

            } = this.props;
            
            return (
                h('div', {
                    id: 'faultManage'
                }, [h('div', {
                        style: {
                            display:showBack?'block':'none',
                            height: '30px',
                            background: 'rgba(46, 50, 53, 1)'
                        }    
                    }, [h('span.glyphicon.glyphicon-remove', {
                            style: {
                                float: 'right',
                                marginRight: '15px',
                                lineHeight: '30px',
                                cursor: 'pointer'
                            },
                            onClick:()=>{
                                if(isFromPainter){
                                    window.history.go(-1);
                                }else{
                                    history.pushState(null, '策略组态 - 首页', '/strategy');
                                }
                            }
                        })]
                    ),
                    h('.faultContent', {
                        style: {
                            overflow: 'hidden',
                            height: 'calc(100% - 30px)'
                        }
                    }, [h('.classificationCtn', [
                            h(ClassificationLayout,{
                                ref:'ClassificationLayout',
                                classNameArr,
                                consequencesNameArr,
                                gradeNameArr,
                                classNameCount,
                                consequencesCount,
                                gradeCount,
                                updateTable,
                                updateSelected,
                                selectedClassName,
                                selectedConsequence,
                                selectedGrade,
                            })
                        ]),
                        h('.faultDiv', [
                            h('.faultDetailCtn', {
                                ref: 'listWrap',
                                style: {
                                    height: 'calc(100% - 60px)',
                                    color: '#525a60',
                                    fontSize: '14px'
                                }
                            }, [       
                                    this.getTable(),
                                    h(CopyModal,{
                                        ref:'CopyModal',
                                        updateTable
                                    })
                            ]), 
                            h(Pagination, {
                                current: page,
                                defaultCurrent: page,
                                pageSize: 20,
                                total: totalNum,
                                onChange: (val)=>{
                                    updateTable({
                                        pageNum: val
                                    });
                                },
                                style: {
                                    height: '60px', 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingRight: '15px'
                                }
                            })
                        ])  
                    ])
                ])
            );
        }
        componentDidUpdate() {
            const {selectedId} = this.props; 
            if(this.refs.listWrap){
                $(`[data-faultid]` ,this.refs.listWrap).removeClass('selected');
            }
            if(selectedId && $(`[data-faultid='${selectedId}']`).length>0){
                let $target = $(`[data-faultid='${selectedId}']`).addClass('selected');
            }
        }
    }

    function FaultInfo(props) {
        return (
            h(Layouts,props)
        );
    }
    exports.FaultInfo = FaultInfo;
    exports.FaultInfoComponent = Layouts;
}));
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
            namespace('beop.strategy.common'),
            namespace('beop.strategy.components.Spinner')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    enums,
    commonUtil,
    Spinner
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    var deepClone = $.extend.bind($, true);

    const { Input, Button, Form, Modal, Layout, Dropdown, Menu, Table, Icon, Tooltip, Col, Select,Upload, message } = antd;
    const { Sider, Content, Header } = Layout;
    const FormItem = Form.Item;

    const labelCol = { span: 8 };
    const wrapperCol = { span: 12 };

    const OneModal = Form.create({
        mapPropsToFields: function (props) {
            if (props.data) {
                let data = props.data;
                let rs = {
                    name: {
                        value: data['name']
                    }
                };
                let list = data['list'];

                Object.keys(list).forEach(
                    (moduleId) => {
                        Object.keys(list[moduleId]).forEach(
                            (_id) => {
                                rs[`list.${moduleId}.${_id}`] = {
                                    value: list[moduleId][_id]
                                }
                            }
                        )
                    }
                )

                return rs;
            }
            return {};
        }
    })(React.createClass({

        getInitialState() {
            return {};
        },

        handleDrop(key, e) {
            var dragId = e.dataTransfer.getData('dsItemId');
            var tagItemId = e.dataTransfer.getData('tagItemId');
            var point;
            if(dragId){
                point = commonUtil.parseDs(dragId);
            }else if(tagItemId){
                point = JSON.parse(tagItemId).id;
            }
            if(point){
                this.props.form.setFieldsValue({
                    [key]: point
                });
            }
        },

        getFormItems() {
            const getFieldDecorator = this.props.form.getFieldDecorator;
            let result = [];
            let temp = {};
            this.props.input.forEach(row=>{
                if(!temp[row.belongModuleName]){
                    temp[row.belongModuleName] = 1;
                    result.push(h('h5',{style:{
                        height:'43px',
                        lineHeight:'43px',
                        marginBottom:'24px'
                    }},[`${row.belongModuleName} ${I18n.resource.message.MODULE}:`]));
                }
                result.push(h(FormItem, {
                    label: `${row.name}`,
                    labelCol: labelCol,
                    wrapperCol: { span: 15 },
                    className: "perWrap"
                }, [
                    getFieldDecorator(`list.${row.belongModuleId}.${row._id}`, {
                        rules: [{ required: true, message: I18n.resource.message.PARAMETER_VALUE_EMPTY }]
                    })(
                        h(Input, {
                            placeholder:I18n.resource.placeholder.ENTER_PARAMETER_VALUES,
                            onDragEnter: (e) => { e.preventDefault(); },
                            onDragOver: (e) => { e.preventDefault(); },
                            onDrop: (e) => { this.handleDrop(`list.${row.belongModuleId}.${row._id}`, e) }
                        })
                    )
                ]));
            });
            return result;
        },
        onOk() {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    let id;
                    if (this.props.mode === 'add') {
                        id = ObjectId();
                    } else {
                        id = this.props.data['_id'];
                    }
                    var data = deepClone({},this.props.data);
                    if(data.isDefault){
                        data.isDefault = false;
                    }
                    this.props.onOk( Object.assign({_id: id}, data, values) );
                    this.props.hideModal();
                }
            });
        },
        handleAfterClose() {
            this.props.form.resetFields();
        },
        render() {
            const { form, visible, mode, hideModal } = this.props;
            const { getFieldDecorator } = form;

            return (
                h(Modal, {
                    title: mode === 'add' ? I18n.resource.modal.ADD_PARAMETER : I18n.resource.modal.EDIT_PARAMETER,
                    width:'540px',
                    visible: visible,
                    onCancel: hideModal,
                    afterClose: this.handleAfterClose,
                    footer: [
                        h(Button, {
                            key: 'cancel',
                            onClick: hideModal
                        }, [I18n.resource.modal.CANCEL]),
                        h(Button, {
                            key: 'submit',
                            type: 'primary',
                            onClick: this.onOk
                        }, [mode === 'add' ? I18n.resource.modal.CONFIRM_THE_NEW : I18n.resource.modal.CONFIRM_THE_CHANGE])
                    ],
                    wrapClassName: 'vertical-center-modal scrollable-modal'
                }, [
                    h(Content, {
                        className:'gray-scrollbar',
                        style: {
                            padding: '16px 20px',
                            maxHeight: '450px',
                        }
                    }, [
                        h(Form, [
                            h(FormItem, {
                                label: I18n.resource.modal.PARAMETER_GROUP_NAME,
                                labelCol: labelCol,
                                wrapperCol: { span: 15 }
                            }, [
                                getFieldDecorator('name', {
                                    initialValue: I18n.resource.placeholder.UNNAMED
                                })(
                                    h(Input, {
                                        placeholder:I18n.resource.placeholder.ENTER_PARAMETER_GROUP_NAME
                                    })
                                )
                            ]),
                            ...this.getFormItems()
                        ])
                    ])
                ])
            );
        }
    }));

    const Placeholder = React.createClass({
        getInitialState() {
            return {
                value: this.props.value || []
            }
        },
        handleAdd() {
            let value = [...this.state.value, {
                key: this.state.value.length.toString() + Date.now(),
                name: '',
                type: 'range',
                from: '',
                to: '',
                step: '',
                set: ''
            }];
            let onChange = this.props.onChange;

            if (!('value' in this.props)) {
                this.setState({
                    value: value
                });
            }

            if (onChange) {
                onChange(value);
            }
        },
        handleDelete(idx) {
            let value = this.state.value.slice();
            let onChange = this.props.onChange;

            value.splice(idx, 1);

            if (!('value' in this.props)) {
                this.setState({
                    value: value
                });
            }

            if (onChange) {
                onChange(value);
            }
        },
        handleUpdate(idx, prop, v) {
            let value = this.state.value.slice();
            let onChange = this.props.onChange;

            if (['name', 'type', 'set'].indexOf(prop) === -1) {
                value.splice(idx ,1 , Object.assign({}, value[idx], {[prop]: parseInt(v)}));
            } else {
                value.splice(idx ,1 , Object.assign({}, value[idx], {[prop]: v}));
            }

            if (!('value' in this.props)) {
                this.setState({
                    value: value
                });
            }

            if (onChange) {
                onChange(value);
            }
        },
        getFieldsByType(row, i) {
            if (row.type === 'range') {
                return [
                    h(Col, {
                        key: 'from',
                        span: 4
                    }, [
                        h(Input, {
                            placeholder: I18n.resource.placeholder.START,
                            value: row['from'],
                            onChange: (e) => { this.handleUpdate(i, 'from', e.target.value) } 
                        })
                    ]),
                    h(Col, {
                        key: 'to',
                        span: 4
                    }, [
                        h(Input, {
                            placeholder: I18n.resource.placeholder.END,
                            value: row['to'],
                            onChange: (e) => { this.handleUpdate(i, 'to', e.target.value) } 
                        })
                    ]),
                    h(Col, {
                        key: 'step',
                        span: 4
                    }, [
                        h(Input, {
                            placeholder: I18n.resource.placeholder.STEP,
                            value: row['step'],
                            onChange: (e) => { this.handleUpdate(i, 'step', e.target.value) } 
                        })
                    ])
                ];
            } else if(row.type === 'set') {
                return [
                    h(Col, {
                        key: 'set',
                        span: 12
                    }, [
                        h(Input, {
                            placeholder: I18n.resource.placeholder.COLLECTION_SAMPLE,
                            value: row['set'],
                            onChange: (e) => { this.handleUpdate(i, 'set', e.target.value) } 
                        })
                    ])
                ];
            } else {
                return null;
            }
        },
        getList() {
            let value = this.state.value;

            return value.map(
                (row, i) => (
                    h('div', {
                        key: row.key,
                        style: {
                            marginBottom: '8px'
                        }
                    }, [
                        h(Input.Group, {
                            style: {
                                lineHeight: '28px'
                            }
                        }, [
                            h(Col, {
                                span: 4
                            }, [
                                h(Input, {
                                    placeholder: I18n.resource.placeholder.NAME,
                                    value: row['name'],
                                    onChange: (e) => { this.handleUpdate(i, 'name', e.target.value) }
                                })
                            ]),
                            h(Col, {
                                span: 6
                            }, [
                                h(Select, {
                                    value: row['type'],
                                    onChange: (v) => { this.handleUpdate(i, 'type', v) }
                                }, [
                                    h(Option, {
                                        value: 'range'
                                    }, [I18n.resource.modal.RANGE]),
                                    h(Option, {
                                        value: 'set'
                                    }, [I18n.resource.modal.GATHER])
                                ])
                            ]),
                            [...this.getFieldsByType(row, i)],
                            h(Icon, {
                                type: 'close-circle-o',
                                style: {
                                    cursor: 'pointer'
                                },
                                onClick: () => { this.handleDelete(i) }
                            })
                        ])
                    ])
                )
            );
        },
        componentWillReceiveProps(nextProps) {
            if ('value' in nextProps) {
                const value = nextProps.value;
                this.setState({
                    value: value
                });
            }
        },
        render() {
            return (
                h('div', this.getList().concat(
                    h(Button, {
                        type: 'dashed',
                        onClick: this.handleAdd
                    }, [I18n.resource.modal.JIA_ADD])
                ))
            );
        }
    });

    const MultiModal = Form.create()(React.createClass({
        getInitialState() {
            return {
            }
        },

        handleAfterClose() {
            this.props.form.resetFields();
        },
        getFormItems() {
            let result = [];
            const getFieldDecorator = this.props.form.getFieldDecorator;
            result.push(h(FormItem, {
                        label: I18n.resource.modal.CONFIGURATION_NAME,
                    }, [
                        getFieldDecorator(`name`, {
                            rules: [{ required: true, message: I18n.resource.message.CONFIGURATION_NAME_EMPTY }]
                        })(
                            h(Input, {
                                placeholder:I18n.resource.placeholder.ENTER_FORMAT
                            })
                        )
                    ]));
            result = result.concat(this.props.input.map(
                (row) => {
                    return h(FormItem, {
                        label: `${row.belongModuleName} 模块 - ${row.name}`,
                    }, [
                        getFieldDecorator(`list.${row.belongModuleId}.${row._id}`, {
                            rules: [{ required: true, message: I18n.resource.message.PARAMETER_TEMPLATE_EMPTY }]
                        })(
                            h(Input, {
                                placeholder:I18n.resource.placeholder.ENTER_TEMPLATE
                            })
                        )
                    ]);
                }
            ));
            return result;
        },
        generateValue(placeholders, list, valueName) {
            // 1、将 placeholders 进行展开
            let phMap = {};
            placeholders.forEach(
                row => {
                    let arr = [];
                    if (row.type === 'range') {
                        let step = row.step;
                        for (let i = row.from; i <= row.to; i += step) {
                            arr.push(i);
                        }
                    } else {
                        arr = row.set.split(',').map(row => row.trim())
                    }
                    phMap[row.name] = arr;
                }
            );

            // 2、将 placeholders 赋值到模板上
            let str = JSON.stringify(list);
            str = str.replace(/<#\s*(.*?)\s*#>/g, function ($0, $1) {
                return '${p.'+$1+'}';
            });
            valueName = valueName.replace(/<#\s*(.*?)\s*#>/g, function ($0, $1) {
                return '${p.'+$1+'}';
            });
            let names = Object.keys(phMap);
            let genFn = new Function('p', 'return `'+str+'`'),
                genFnForName = new Function('p', 'return `'+valueName+'`');

            let len = phMap[names[0]].length;
            let result = [];
            for (let i = 0; i < len; i++) {
                let map = {};
                names.forEach(
                    n => map[n] = phMap[n][i]
                );
                result.push({
                    _id: ObjectId(),
                    name: genFnForName(map),
                    list: JSON.parse(genFn(map))
                });
            }
            return result;
        },
        onOk() {
            let _this = this;
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    //清空无效placeholders
                    let completePlaceholders = values.placeholders.filter(
                        row => {
                            let isComplete = true;
                            let items = [];
                            if(row.type == "range"){
                                items = ['from','name','step','to'];
                            }else if(row.type == "set"){
                                items = ['name','set'];
                            }
                            items.forEach(item=>{
                                if(row[item]==undefined || row[item]==''){
                                    isComplete = false;
                                }
                            });
                            
                            return isComplete;
                        }
                    );
                    if(completePlaceholders.length != 0){
                        let valueList = _this.generateValue(completePlaceholders, values.list, values.name);
                        _this.props.onOk( valueList );
                    }
                    _this.props.hideModal();
                }
            });
        },
        render() {
            const { form, visible, hideModal } = this.props;
            const { getFieldDecorator } = form;

            return (
                h(Modal, {
                    title: I18n.resource.modal.BATCH_PARAMETERS,
                    visible: visible,
                    onCancel: hideModal,
                    width: 600,
                    afterClose: this.handleAfterClose,
                    footer: [
                        h(Button, {
                            key: 'cancel',
                            onClick: hideModal
                        }, [I18n.resource.modal.CANCEL]),
                        h(Button, {
                            key: 'submit',
                            type: 'primary',
                            onClick: this.onOk
                        }, [I18n.resource.modal.CONFIRM_THE_NEW])
                    ],
                    wrapClassName: 'vertical-center-modal scrollable-modal'
                }, [
                    h(Form, [
                        h(FormItem, {
                            label: I18n.resource.modal.PLACEHOLDER
                        }, [
                            getFieldDecorator('placeholders', {
                                initialValue: []
                            })(
                                h(Placeholder)
                            )
                        ]),
                        [...this.getFormItems()]
                    ])
                ])
            );
        }
    }));
    
    class ValueList extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                selectedIds: [],
                value: this.props.value || [],
                modal: {
                    type: null,
                    mode: null,
                    props: null
                },
                bShowSpin: false
            };

            this.showModal = this.showModal.bind(this);
            this.hideModal = this.hideModal.bind(this);
            this.handleAddOne = this.handleAddOne.bind(this);
            this.handleClickAddMenu = this.handleClickAddMenu.bind(this);
            this.getAddBtnOverlay = this.getAddBtnOverlay.bind(this);
            this.getReverseOverlay = this.getReverseOverlay.bind(this);
            this.selectAll = this.selectAll.bind(this);
            this.reverseSelect = this.reverseSelect.bind(this);
            this.handleSelect = this.handleSelect.bind(this);
            this.handleDeleteRows = this.handleDeleteRows.bind(this);
            this.handleAddParams = this.handleAddParams.bind(this);
            this.handleEditParams = this.handleEditParams.bind(this);
            this.getValue = this.getValue.bind(this);
        }

        componentWillReceiveProps(nextProps) {
            this.setState({
                selectedIds: [],
                value: nextProps.value || [],
            });
        }

        getValue() {
            return this.state.value;
        }

        handleAddParams(data) {
            if (Object.prototype.toString.call(data) !== '[object Array]') {
                data = [data];
            }

            this.setState({
                value: [...data, ...this.state.value]
            });
        }

        handleEditParams(data) {
            let idx;
            this.state.value.some((row, i) => {
                if (row['_id'] === data['_id']) {
                    idx = i;
                    return true;
                }
            });
            
            if (typeof idx === 'undefined') {
                console.warn('修改失败，未找到修改对象：' + data['_id']);
                return;
            }
            let value = this.state.value.slice();
            value.splice(idx, 1, data)
            this.setState({
                value: value
            });
        }

        handleDeleteRows(ids) {
            // 删除所有选中行
            if (!ids) {
                ids = this.state.selectedIds;
            }
            Modal.confirm({
                title: I18n.resource.title.CONFIRM_DELETE,
                okText: I18n.resource.modal.OK,
                cancelText: I18n.resource.modal.CANCEL,
                onOk: () => {
                    let newValues = this.state.value.filter(row => ids.indexOf(row['_id']) === -1);
                    if(newValues.length==0){//全部删除时 添加默认
                        let list = deepClone({},this.state.value[0].list);
                        for(let moduleId in list){
                            let inputsMap = list[moduleId];
                            for(let inputId in inputsMap){
                                inputsMap[inputId] = 'None';
                            }
                        }
                        newValues.push({
                            _id: ObjectId(),
                            name: 'Default',
                            list: list
                        });
                    }
                    this.setState({
                        selectedIds: this.state.selectedIds.filter(row => ids.indexOf(row) === -1),
                        value: newValues
                    });
                }
            });
        }

        handleAddOne() {
            this.showModal('one', 'add');
        }

        handleClickAddMenu(e) {
            let { key } = e;

            if (key === '0') {
                this.showModal('multi', 'add');
            }
        }

        handleSelect(ids) {
            this.setState({
                selectedIds: ids
            });
        }

        reverseSelect() {
            let allIds = this.props.strategy.value.map(v=>v._id),
                oldIds = this.state.selectedIds;
            let difference = allIds.filter(x => oldIds.indexOf(x)<0);
            this.setState({
                selectedIds: difference
            });
        }

        selectAll() {
            let ids = this.props.strategy.value.map(v=>v._id);
            this.setState({
                selectedIds: ids
            });
        }

        getAddBtnOverlay() {
            return (
                h(Menu, {
                    onClick: this.handleClickAddMenu
                }, [
                    h(Menu.Item, {
                        key: 0,
                    }, [I18n.resource.modal.A_BATCH_OF_NEW])
                ])
            );
        }

        getReverseOverlay() {
            return (
                h(Menu, {
                    onClick: this.reverseSelect
                }, [
                    h(Menu.Item, {
                        key: 0,
                    }, [I18n.resource.modal.INVERT_SELECTION])
                ])
            );
        }

        importExcel(info){
            this.setState({
                bShowSpin: true
            });
            let nameMap = {};
            this.props.modules.forEach(module=>{
                //nameMap[module.name] = module._id;
                nameMap[module.name] = {};
                nameMap[module.name][module.name] = module._id;
                module.option.input.forEach(input=>{
                    nameMap[module.name][input.name] = input._id;
                });
            });
            var file = info.file;
            var _this = this;
            var formData = new FormData();
            formData.append('file', file.originFileObj);
            function getPrevModule(result,index){
                index --;
                if(result["模块名称"][index]){
                    return result["模块名称"][index]
                }else{
                    return getPrevModule(result,index);
                }
            }
            function copyData(stickList,copyList){
                Object.keys(copyList).forEach(function(row){
                    Object.keys(stickList).some(function(item){
                        if(item === row){
                            Object.keys(copyList[row]).forEach(function(keyC){
                                var isSameParameter = false;
                                Object.keys(stickList[item]).some(function(keyS){
                                    if(keyC === keyS){
                                         copyList[row][keyC] = stickList[item][keyS];
                                         isSameParameter = true;
                                         return true;
                                    }                                   
                                })
                                if(!isSameParameter){
                                    copyList[row][keyC] = "none";
                                }
                            })    
                        }
                    })
                })
                return copyList;
            }
            $.ajax({
                url: '/logistics/import/excel',
                type: 'post',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(result){
                    var data = result;
                    var parameters= [];
                    if(data){
                        var len = 0;
                        var oneGroup = true;
                        data["参数组名称"].forEach(function(group,i){
                            if(group){
                                parameters.push({
                                    list: {},
                                    name: group
                                });
                                if(i === 0 && oneGroup){
                                    len ++;
                                }else{
                                    oneGroup = false;
                                }
                            }else{
                                if(oneGroup){
                                    len ++;
                                }
                            }
                        });
                        // var len = parameters.length;
                        var arr = [];
                        data["参数名称"].forEach(function(input,i){
                            var obj = {};
                            obj[input] = data["参数名称"][i];
                            arr.push(obj);
                        });
                        data["模块名称"].forEach(function(module,i){
                            var g = Math.floor(i/len);
                            if(module){
                                parameters[g]["list"][module] = {};
                                parameters[g]["list"][module][data["参数名称"][i]] = data["参数值"][i];
                            }else{
                                parameters[g]["list"][getPrevModule(result,i)][data["参数名称"][i]] = data["参数值"][i];
                            }
                        });
                        var importData = [];
                        var undefinedName = false;
                        parameters.forEach(function(row){
                            var obj = {
                                name:row.name,
                                list:{}
                            };
                            Object.keys(row.list).forEach(function(moduleName){
                                var nameObj = nameMap[moduleName];
                                if(!nameObj[moduleName]){
                                    undefinedName = true;
                                }
                                obj.list[nameObj[moduleName]] = {};
                                Object.keys(row.list[moduleName]).forEach(function(inputName){
                                    if(!nameObj[inputName]){
                                        undefinedName = true;
                                    }
                                    obj.list[nameObj[moduleName]][nameObj[inputName]] = row.list[moduleName][inputName];
                                })
                            });
                            importData.push(obj);
                        });

                        if(undefinedName){
                            message.warning(I18n.resource.modal.IMPORT_EXCEL_FAIL);
                            return;
                        }
                        var newData = deepClone([],_this.state.value);
                        importData.forEach(function(row,i){
                            var isSameName = false;
                            newData.some(function(item,j){
                                if(row.name === item.name){
                                    isSameName = true;
                                    newData[j].list = copyData(row.list,item.list);
                                    return true;
                                }
                            })
                            if(!isSameName){
                                newData.push({
                                    _id:ObjectId(),
                                    name:row.name,
                                    list: copyData(row.list,deepClone({},newData[0].list))
                                })
                            }
                        })
                        // var newData = $.extend(true, _this.state.value, oldData);
                        _this.setState({
                            value: newData
                        });
                    }
                },
                error: function(){
                    message.warning(I18n.resource.message.NETWORK_FAIL);
                },
                complete: function(){
                    _this.setState({
                        bShowSpin: false
                    });
                }
            });
        }

        showModal(type, mode, data) {
            this.setState({
                modal: {
                    type: type,
                    mode: mode,
                    props: data
                }
            });
        }

        hideModal() {
            this.setState({
                modal: {
                    type: null,
                    props: null,
                    mode: null
                }
            });
        }

        render() {
            return (
                h(Layout, {
                    style: {
                        width: '100%',
                        height: '100%'
                    }
                }, [
                    h(Header, {
                        className: 'params-list-header'
                    }, [
                        h(Button.Group, {
                            className: 'fr',
                            size: 'small'
                        } ,[
                            h(Dropdown.Button, {
                                size: 'small',
                                trigger: ['click'],
                                onClick: this.handleAddOne,
                                overlay: this.getAddBtnOverlay()
                            }, [I18n.resource.modal.ADD]),
                            h(Button, {
                                disabled: this.state.selectedIds.length === 0,
                                onClick: () => { this.handleDeleteRows() }
                            }, [I18n.resource.modal.DELETE]),
                        ]),
                        h(Dropdown.Button, {
                            size: 'small',
                            trigger: ['click'],
                            onClick: this.selectAll,
                            overlay: this.getReverseOverlay()
                        }, [I18n.resource.modal.CHECK_ALL]),
                        h(Button.Group,{
                            style: {
                                marginRight: 5
                            },
                            className: 'fr',
                            size: 'small'
                        },[
                            h(Button,{
                                size: 'small',
                                disabled: this.state.selectedIds.length === 0,
                                onClick: () => {
                                    let values = this.state.value.filter(v=>this.state.selectedIds.indexOf(v._id)>=0);
                                    let nameMap = {};
                                    this.props.modules.forEach(module=>{
                                        nameMap[module._id] = module.name;
                                        module.option.input.forEach(input=>{
                                            nameMap[input._id] = input.name;
                                        });
                                    });
                                    this.props.downloadExcel({
                                        name: this.props.strategy.name,
                                        values: values,
                                        nameMap: nameMap,
                                    });
                                }
                            },[I18n.resource.modal.EXPORT_TO_EXCEL]),
                            h(Upload,{
                                customRequest:function(){
                                    return;
                                },
                                showUploadList:false,
                                onChange: this.importExcel.bind(this)
                            },[
                                h(Button,{
                                    size: 'small',
                                    onClick: function(){
                                        $('#fileUpload').click();
                                    }
                                },[I18n.resource.modal.IMPORT_TO_EXCEL]),
                            ])                            
                            // h("input",{
                            //     id: "fileUpload",
                            //     style:{
                            //         display: "none"
                            //     },
                            //     type: "file",
                            //     onChange:(e)=>{
                            //         this.importExcel(e);
                            //         let node = e.target;
                            //         var nf = node.cloneNode(true);  
                            //         nf.value='';     
                            //         node.parentNode.replaceChild(nf, node);  
                            //     } 
                            // })
                        ]),
                        h('div',{style:{clear:'both'}}),
                    ]),
                    h(Content, {
                        className: 'gray-scrollbar',
                        style: {
                            height: 'calc(100% - 48px)',
                            overflowY: 'auto'
                        }
                    }, [
                        h(Table, {
                            bordered: false,
                            showHeader: false,
                            pagination: false,
                            rowKey: '_id',
                            rowSelection: {
                                selectedRowKeys:this.state.selectedIds,
                                onChange: (selectedRowKeys) => { this.handleSelect(selectedRowKeys) } 
                            },
                            columns: [{
                                key: '_id',
                                dataIndex: 'name'
                            }, {
                                width: 60,
                                render: (data) => (
                                    h('span', {
                                        style: {
                                            fontSize: '16px'
                                        }
                                    }, [
                                        h(Tooltip, {
                                            title: I18n.resource.title.EDIT
                                        }, [
                                            h(Icon, {
                                                type: 'edit',
                                                style: {
                                                    cursor: 'pointer',
                                                    marginRight: '8px'
                                                },
                                                onClick: () => { this.showModal('one', 'edit', data) }
                                            })
                                        ]),
                                        h(Tooltip, {
                                            title: I18n.resource.title.DELETE
                                        }, [
                                            h(Icon, {
                                                type: 'close',
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                onClick: () => { this.handleDeleteRows([data['_id']]) }
                                            })
                                        ])
                                    ])
                                ),
                            }],
                            dataSource: this.state.value
                        })
                    ]),
                    h(OneModal, {
                        visible: this.state.modal.type === 'one',
                        mode: this.state.modal.mode,
                        data: this.state.modal.props,
                        input: this.props.input,
                        onOk: this.state.modal.mode === 'add' ? this.handleAddParams : this.handleEditParams,
                        hideModal: this.hideModal
                    }),
                    h(MultiModal, {
                        visible: this.state.modal.type === 'multi',
                        hideModal: this.hideModal,
                        onOk: this.handleAddParams,
                        input: this.props.input
                    }),
                    h(Spinner, {
                        bShowSpin: this.state.bShowSpin,
                        id: "params-import-spinner"
                    })
                ])
            );
        }
    }

    const ParamsConfigModal = React.createClass({
        getInitialState() {
            return {
                visible: this.props.visible,
                value: this.props.value || []
            };
        },
        getDefaultProps() {
            return {
                input: [],
                value: []
            };
        },
        handleAfterClose() {
            this.props.onCancel();
        },
        onCancel() {
            this.setState({
                visible: false
            });
        },
        onOk() {
            this.props.save(this.valueList.getValue());
        },
        saveValueListRef(valueList) {
            this.valueList = valueList;
        },
        componentWillReceiveProps(nextProps) {
            if (nextProps.visible) {
                document.body.classList.add('params-config-modal-fix');
            } else {
                document.body.classList.remove('params-config-modal-fix');
            }
            this.setState({
                visible: nextProps.visible,
                value: nextProps.value || []
            });
        },
        render() {
            const value = this.state.value;
            const { strategy, onCancel, downloadExcel, modules ,importReadExcel} = this.props;

            return (
                h(Modal, {
                    width: 350,
                    maskClosable: false,
                    visible: this.state.visible,
                    title: I18n.resource.modal.PARAMETER_CONFIGURATION,
                    onCancel: onCancel,
                    footer: [
                        h(Button, {
                            key: 'cancel',
                            onClick: onCancel
                        }, [I18n.resource.modal.CANCEL]),
                        h(Button, {
                            key: 'submit',
                            type: 'primary',
                            onClick: this.onOk
                        }, [I18n.resource.modal.OK])
                    ],
                    afterClose: this.handleAfterClose,
                    wrapClassName: 'vertical-center-modal content-no-padding-modal params-config-modal'
                }, [
                    h(Layout, {
                        style: {
                            height: 450
                        }
                    }, [
                        h(Sider, {
                            className: 'params-list',
                            width: '100%'
                        }, [
                            h(ValueList, {
                                ref: this.saveValueListRef,
                                value: value,
                                input: this.props.input,
                                strategy: strategy,
                                modules: modules,
                                downloadExcel: downloadExcel
                            })
                        ])
                    ])
                ])
            );
        }
    });

    exports.ParamsConfigModal = ParamsConfigModal;
}));
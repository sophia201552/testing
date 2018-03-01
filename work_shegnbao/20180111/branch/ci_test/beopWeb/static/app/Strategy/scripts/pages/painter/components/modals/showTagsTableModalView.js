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
            namespace('ReactCodeMirror'),
            namespace('beop.strategy.components.modals.InputParamModal'),
            namespace('beop.strategy.components.modals.OutputParamModal'),
            namespace('beop.strategy.enumerators'),
            namespace('beop.common.components.CodeEditor')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    ReactCodeMirror,
    InputParamModal,
    OutputParamModal,
    enums,
    CodeEditor
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    var deepClone = $.extend.bind($, true);

    const { message, Radio, Tag, Button, Table,Modal } = antd;
    const RadioGroup = Radio.Group;

    class ShowTagsTableModal extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                visible: false,
                data: [],
                originalData: [],
                nameMap: {}
            };
            this.show = this.show.bind(this);
            this.close = this.close.bind(this);
            this.update = this.update.bind(this);
        }
        componentDidMount() {

        }
        componentWillReceiveProps(nextProps){

        }
        update(props) {
            this.setState({
                data: props.data,
                originalData: props.data,
                nameMap: props.nameMap
            });
        }
        show() {
            this.setState({
                visible: true
            });
        }
        close() {
            this.setState({
                visible: false,
                data:this.state.originalData
            });
        }

        changeMatchingParamter(value,groupId,moduleId,parameterId){
            var data = deepClone([],this.state.data);
            data.some(function(group){
                if(group._id === groupId){
                    group.list[moduleId][parameterId].forEach(function(parameterVal,i){
                        if(i === value){
                            parameterVal.check = 1;
                        }else{
                            parameterVal.check = 0;
                        }
                    });
                    return true;
                }
            });
            this.setState({
                 data: data
            })
        }

        dropDataSource(e,groupId,moduleId,parameterId){
            var dragName,currentId;
            var dragDsItemId = e.dataTransfer.getData("dsItemId");
            var dragTagitemId = e.dataTransfer.getData("tagitemid");
            if(dragDsItemId){
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
            if(dragName){
                var data = deepClone([],this.state.data);
                data.some(function(group){
                    if(group._id === groupId){
                        var parametersArr = group.list[moduleId][parameterId];
                        if(parametersArr instanceof Array){
                            var exist = false;
                            parametersArr.some(function(row){
                                if(row.completeName === dragName){
                                    exist = true;
                                    return true;
                                }
                            });
                            if(exist){
                                message.warning(I18n.resource.message.POINT_EXIST);
                                return true;
                            }else{
                                parametersArr.unshift({
                                    completeName: dragName,
                                    matching: 1
                                })
                            }
                        }
                        parametersArr.forEach(function(parameterVal,i){
                            if(i === 0){
                                parameterVal.check = 1;
                            }else{
                                parameterVal.check = 0;
                            }
                        });
                        return true;
                    }
                });

                this.setState({
                     data: data
                })
            }
        }

        defaultDealt(e){
            e.preventDefault();
        }

        onOk(){
            var data = deepClone([],this.state.data);
            data.forEach(function(row){
                var obj = {};
                Object.keys(row.list).forEach(function(module){
                    obj[module] = {};
                    Object.keys(row.list[module]).forEach(function(parameter){
                        var parameters = row.list[module][parameter];
                        if(parameters instanceof Array && parameters.length > 0){
                            let isCheckNone = true;
                            parameters.some(function(item,i){
                                if(i === 0){
                                    if(typeof item.check === "undefined"){
                                        item.check = 1;
                                    }
                                }
                                if(item.check === 1){
                                    parameters = item.completeName;
                                    obj[module][parameter] = item.completeName;
                                    isCheckNone = false;
                                    return true;
                                }
                            })
                            if(isCheckNone){
                                parameters = 'None';
                                obj[module][parameter] = 'None';
                            }
                        }else{
                            parameters = "None";
                            obj[module][parameter] = "None";
                        }
                    })
                });
                row.list = obj;
            });

            this.props.onOk(data,this.state.data);
            this.close();
        }

        render() {
            const {visible, nameMap} = this.state;
            const data = this.state.originalData;
            const onCancel = this.close;
            const {
                onOk
            } = this.props;
            var changeMatchingParamter = this.changeMatchingParamter.bind(this);
            var dropDataSource = this.dropDataSource.bind(this);
            var defaultDealt = this.defaultDealt.bind(this);

            const columns = (function () {
                var arr = [
                    {
                        title: I18n.resource.title.PARAMETER_GROUP_NAME,
                        width: 140,
                        dataIndex: 'groupName',
                        key: 'groupName',
                        render: (value, row, index) => {
                            const obj = {
                                children: value,
                                props: {}
                            };
                            if(row.groupRowSpan){
                                obj.props.rowSpan = row.groupRowSpan;
                            }else{
                                obj.props.rowSpan = 0;
                            }
                            return obj;
                        }
                    }, {
                        title: I18n.resource.title.MODULE_NAME,
                        width: 140,
                        dataIndex: 'moduleName',
                        key: 'moduleName',
                        render: (value, row, index) => {
                            const obj = {
                                children: value,
                                props: {}
                            };
                            if(row.moduleRowSpan){
                                obj.props.rowSpan = row.moduleRowSpan;
                            }else{
                                obj.props.rowSpan = 0;
                            }
                            return obj;
                        }
                    }, {
                        title: I18n.resource.title.PARAMETER_NAME,
                        width: 140,
                        dataIndex: 'parameterName',
                        key: 'parameterName'
                    }, {
                        title: I18n.resource.title.PARAMETER_VALUES,
                        dataIndex: 'parameterValue',
                        key: 'parameterValue',
                        render: (value, row, index) => {
                            const obj = {
                                children: null,
                                props: {}
                            };
                            if (value instanceof Array) {
                                if(value.length > 0){
                                    if(typeof value[0].check === "undefined"){
                                        value[0].check = 1;
                                    }
                                    let isCheck = true;
                                    var arr = value.map(function (item,i) {
                                        let check = item.check === 1? true :false;
                                        check && (isCheck = false);
                                        return (h(Radio, {
                                            style:{
                                                display: 'block',
                                                height: '25px',
                                                lineHeight: '25px'
                                            },
                                            checked: check,
                                            value: i
                                        }, [item.completeName + "("+ item.matching*100 + "%)"]))
                                    });
                                    let arrLength = arr.length;
                                    if(arrLength>0){
                                        arr.push(h(Radio, {
                                            style:{
                                                display: 'block',
                                                height: '25px',
                                                lineHeight: '25px'
                                            },
                                            checked: isCheck,
                                            value: arrLength
                                        }, ['None']));
                                    }
                                    obj.children =  h("div",{
                                        onDrop: function(e){
                                            dropDataSource(e,row.groupId,row.moduleId,row.parameterId)
                                        },
                                        onDragEnter: function(e){
                                            defaultDealt(e)
                                        },
                                        onDragOver: function(e){
                                            defaultDealt(e)
                                        }
                                    },[
                                        h(RadioGroup,{
                                            onChange: function(e){
                                                changeMatchingParamter(e.target.value,row.groupId,row.moduleId,row.parameterId)
                                            }
                                        }, arr)
                                    ])
                                }else{
                                    obj.children = I18n.resource.modal.TAGS_VALUE_NONE;
                                }
                            }else{
                                obj.children = value;
                            }
                            return obj;
                        }
                    }
                ];
                return arr;
            }());

            const dataSource = (function (data,nameMap) {
                var arr = [];
                if(data) {
                    var item = {};
                    var  i = 1;
                    data.forEach(function (row) {
                        item.groupName= row.name;
                        item.groupId= row._id;
                        var n = 0;
                        Object.keys(row.list).forEach(function(item){
                            n += Object.keys(row.list[item]).length;
                        });
                        Object.keys(row.list).forEach(function (module,j) {
                            item.moduleName = nameMap[module];
                            item.moduleId = module;
                            var m = Object.keys(row.list[module]).length;
                            Object.keys(row.list[module]).forEach(function (parameter,k) {
                                if(j === 0 && k === 0){
                                    item.groupRowSpan = n;
                                }else{
                                    item.groupRowSpan = 0;
                                }
                                if(k === 0){
                                    item.moduleRowSpan = m;
                                }else{
                                    item.moduleRowSpan = 0;
                                }
                                item.key = i.toString();
                                item.parameterId = parameter;
                                item.parameterName = nameMap[parameter];
                                item.parameterValue = row.list[module][parameter];
                                arr.push(deepClone({},item));
                                i++;
                            })
                        })
                    });
                }
                return arr;
            } (this.state.data,nameMap));

            return (
                h(Modal,{
                    visible: visible,
                    maskClosable:false,
                    width: 800,
                    title: I18n.resource.modal.TAGS_MATCHING,
                    onCancel:onCancel,
                    onOk: this.onOk.bind(this),
                    okText: I18n.resource.modal.OK,
                    cancelText: I18n.resource.modal.CANCEL,
                    wrapClassName: "vertical-center-modal scrollable-modal"
                },[
                    h("div.tagsTable",[
                        h(Table,{
                            pagination:false,
                            bordered:true,
                            scroll:{
                                y:600
                            },
                            size:"small",
                            dataSource:dataSource,
                            columns:columns
                        })
                    ])
                ])
            );
        }
    }

    exports.ShowTagsTableModal = ShowTagsTableModal;
}));
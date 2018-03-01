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
            namespace('beop.common.components.CodeEditor')
        );
    }
}(namespace('beop.common.components'), function(
    exports,
    React,
    enums,
    antd,
    CodeEditor
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const { Modal, Button, message, Spin } = antd;
    class StrategyConfigModal extends React.Component{
        constructor(props){
            super(props);
            this.async = undefined;
            this.isGroup = false;
            this.defaultJsonObjForStrategy = {
                "cycle":300,
                "Building":"",
                "SubBuilding":"",
                "EquipmentName":"",
                "Category":""
            };
            this.state = {
                loading: false,
                visible: false,
                spinning: false,
                btnDisabled: false,
                jsonStr:'',
            };
            this.handleOk = this.handleOk.bind(this);
            this.handleCancel = this.handleCancel.bind(this);
            this.onChange = this.onChange.bind(this);
            this.doSave = this.doSave.bind(this);
        }
        componentWillReceiveProps(props) {    
            let config = {};
            let show = (config)=>{
                this.setState({
                    btnDisabled: false,
                    spinning: false,
                    jsonStr: JSON.stringify(config,null,4),
                });
            };
            this.setState({
                visible: props.isShowStrategyConfigModal,
            });
            if(props.strategyId!==undefined){
                this.isGroup = false;
                config = props.strategyData && props.strategyData.option && props.strategyData.option.config || this.defaultJsonObjForStrategy;
                show(config);
            }else if(props.groupId!==undefined&&props.isShowStrategyConfigModal) {
                this.setState({
                    btnDisabled: true,
                    spinning: true,
                });
                this.isGroup = true;
                this.async = WebAPI.get('/strategy/getProjConfig/'+props.groupId).done((rs)=>{
                    if (rs.status === 'OK') {
                        config = rs.data && rs.data.config;
                        show(config);
                    }else{
                        this.setState({
                            jsonStr:rs.msg
                        });
                    }
                }).always(()=>{
                    this.async = undefined;
                    this.setState({
                        spinning: false,
                    });
                });
            }
        }
        doSave(codeObj) {
            const {strategyId,groupId,updateStrategyConfigModal,hideStrategyConfigModal} = this.props;
            this.setState({
                loading: true,
                jsonStr: JSON.stringify(codeObj,null,4)
            });
            if(this.isGroup){
                this.async = WebAPI.post('/strategy/saveProjConfig', {
                    projId: parseInt(groupId),
                    config: codeObj
                }).done((result) => {
                    if (result.status === 'OK') {
                        hideStrategyConfigModal();
                    } else {
                        message.error(I18n.resource.message.FAIL_SAVE);
                    }
                });
            }else{
                this.async = WebAPI.post('/strategy/item/save', {
                    userId: AppConfig.userId,
                    ids: [strategyId],
                    data: {
                        ['option.config']:codeObj
                    },
                    projId: AppConfig.projectId
                }).done((result) => {
                    if (result.status === 'OK') {
                        updateStrategyConfigModal(strategyId,codeObj);
                        hideStrategyConfigModal();
                    } else {
                        message.error(I18n.resource.message.FAIL_SAVE);
                    }
                });
            }
            return this.async;
        }
        handleOk() {
            let code = this.refs.CodeEditor.state.code==''?"{}":this.refs.CodeEditor.state.code;
            let codeObj = null;
            try {
                codeObj = JSON.parse(code);
                if(!$.isArray(codeObj)){
                    this.doSave(codeObj).always(()=>{
                        this.async = undefined;
                        this.setState({
                            loading: false,
                        });
                    });
                }else{
                    //格式不能为数组
                    message.error(I18n.resource.message.NOT_JSON);
                }
            } catch (error) {
                message.error(I18n.resource.message.NOT_JSON_FORMAT);
            }
        }
        handleCancel() {
            this.props.hideStrategyConfigModal();
        }
        onChange(code) {
            this.refs.CodeEditor.setState({
                code
            });
        }
        componentWillUnmount() {
            this.isGroup = false;
            if(this.async){
                this.async.abort();
                this.async = undefined;
            }
        }
        render() {
            const {visible,loading,jsonStr,spinning, btnDisabled} = this.state;
            return (
                h(Modal,{
                    visible: visible,
                    title: I18n.resource.modal.STRATEGIES_DOMINATION,
                    onOk: this.handleOk,
                    onCancel: this.handleCancel,
                    footer: [
                        h(Button,{
                            key: 'back',
                            size: 'large',
                            onClick: this.handleCancel
                        },[I18n.resource.modal.CANCEL]),
                        h(Button,{
                            key: 'save',
                            size: 'large',
                            type: 'primary',
                            loading: loading,
                            disabled: btnDisabled,
                            onClick: this.handleOk
                        },[I18n.resource.modal.SAVE])
                    ]
                },[
                    h(Spin,{
                        tip:'Loading...',
                        spinning
                    },[
                        h(CodeEditor,{
                            ref: 'CodeEditor',
                            style:{
                                height:'300px'
                            },
                            onChange:this.onChange,
                            value:jsonStr
                        })
                    ])
                ])
            )
        }
    }
    exports.StrategyConfigModal = StrategyConfigModal;
}));
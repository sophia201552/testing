;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd'),
            namespace('beop.strategy.components.TemplateTree')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    TemplateTree
) {
    var h = React.h;
    const {Modal, Form, Input, Button} = antd;
    const FormItem = Form.Item;
    const addBodyClass = (isAdd)=>{
        if(isAdd){
            document.body.classList.add('templateTreeModal');
        }else{
            document.body.classList.remove('templateTreeModal');
        }
    }
    class ExportTemplateModal extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.modules = [];
            this.async = null;
            this.state = {
                loading: false,
                visible: false,
                templateName: '',
            }
            this.showModal = this.showModal.bind(this);
            this.handleOk = this.handleOk.bind(this);
            this.getFrom = this.getFrom.bind(this);
            this.handleFormChange = this.handleFormChange.bind(this);
            this.updateModules = this.updateModules.bind(this);
        }
        shouldComponentUpdate(nextProps, nextState) {
            const {loading, visible, templateName} = this.state;
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
                templateName: '',
                loading: false,
            });
            if(this.async){
                this.async.abort();
                this.async = null;
            }
            addBodyClass(visible);
        }
        updateModules(modules) {
            this.modules = modules;
        }
        handleOk() {
            this.refs.CustomizedForm.validateFields((err, values) => {
                if(!err){
                    const {templateName} = this.state;
                    let group = this.refs.TemplateTree.getSelectedIds();
                    if(group.length == 0){
                        alert(I18n.resource.templateModal.SELECT_FLODER);
                        return;
                    }
                    group = group[0];
                    this.setState({
                        loading: true,
                    });
                    this.async = WebAPI.post("/strategy/exportStrategyTemplate",{
                        group : group,
                        name : templateName,
                        userId : AppConfig.userId,
                        modules : this.modules
                    }).always(()=>{
                        this.async = null;
                        this.showModal(false);
                    });
                }
            })
        }
        handleFormChange(changedFields) {
            if(!changedFields.templateName){return}
            this.setState({
                templateName:changedFields.templateName.value
            });
        }
        getFrom() {
            const {templateName, fields} = this.state;
            const CustomizedForm = Form.create({
                onFieldsChange(props, changedFields) {
                    props.onChange(changedFields);
                },
                mapPropsToFields(props) {
                    return {
                        templateName: {
                            value: props.templateName,
                        },
                    };
                },
                onValuesChange(_, values) {
                    
                },
                })((props) => {
                const { getFieldDecorator } = props.form;
                return (
                    h(Form,{
                        layout: 'inline'
                    },[h(FormItem,{label: I18n.resource.templateModal.NAME},[
                        getFieldDecorator('templateName', {
                            rules: [{ required: true, message: I18n.resource.templateModal.NAME_ERROR }],
                        })(h(Input))
                    ])])
                );
            });
            return (h('div',{},[
                h(CustomizedForm,{
                    ref: 'CustomizedForm',
                    templateName: templateName,
                    onChange: this.handleFormChange
                },[])
            ]));
        }
        render() {
            return (
                h(Modal, {
                    wrapClassName: "vertical-center-modal scrollable-modal",
                    title: I18n.resource.templateModal.TITLE,
                    visible: this.state.visible,
                    onOk: this.handleOk,
                    onCancel: ()=>{this.showModal(false)},
                    footer: [h(Button, { key: 'close', onClick: ()=>{this.showModal(false)} }, [I18n.resource.modal.CANCEL]), h(Button, { key: 'save', onClick: this.handleOk, loading: this.state.loading }, [I18n.resource.modal.SAVE])]
                }, [
                    this.getFrom(),
                    h(TemplateTree,{
                        ref: 'TemplateTree',
                        draggable: false,
                        onlyGroup: true,
                        isSearchInput: false,
                        defaultSelected: true,
                        isToolBar: false,
                        isMultiple: false,
                    })
                ])
            )
        }
    } 

    exports.ExportTemplateModal = ExportTemplateModal;
}));
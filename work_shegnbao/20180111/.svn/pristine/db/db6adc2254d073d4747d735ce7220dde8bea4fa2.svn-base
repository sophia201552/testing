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
            namespace('beop.strategy.common.fuzzyRuleParser')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    enums,
    fuzzyRuleParser
) {
    var h = React.h;
    var linkEvent = React.linkEvent;

    const { Input, Form, Tag, Button, Table,Modal } = antd;

    class ImportParametersModal extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                data: null
            };
        }
        componentDidMount() {
            this.setState({
                data: null
            });
        }
        confirmImport(){
            if(!this.state.data){
                Modal.warning({
                    title: 'Warning',
                    content: I18n.resource.title.IMPORT_EMPTY,
                    okText: I18n.resource.modal.OK
                });
                return;
            }
            try{
                var code = this.state.data;
                var parseCode = fuzzyRuleParser.parse(code);
                this.props.onOk(parseCode);
            }catch (e) {
                Modal.error({
                    title: 'Error',
                    content: I18n.resource.title.IMPORT_ERROR,
                    okText: I18n.resource.modal.OK
                });
            }
        }
        saveData(e){
            this.setState({
                data: e.target.value
            });
        }

        render() {

            const {
                onCancel,
                visible
            } = this.props;

            return (
                h(Modal,{
                    visible: visible,
                    maskClosable:false,
                    width: 800,
                    title: I18n.resource.modal.IMPORT,
                    okText: I18n.resource.modal.OK,
                    cancelText: I18n.resource.modal.CANCEL,
                    onOk: this.confirmImport.bind(this),
                    onCancel:onCancel
                },[
                    h("div",[
                        h(Input,{
                            placeholder:I18n.resource.placeholder.IMPORT_DATA_CLICK_OK,
                            type:"textarea",
                            autosize:{
                                minRows: 10,
                                maxRows: 20
                            },
                            onBlur: this.saveData.bind(this),
                            ref: "importTextarea"
                        })
                    ])
                ])
            );
        }
    }

    exports.ImportParametersModal = ImportParametersModal;
}));
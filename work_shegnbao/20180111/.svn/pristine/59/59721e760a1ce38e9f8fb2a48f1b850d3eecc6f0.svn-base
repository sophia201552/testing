;
(function(root, factory) {
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
            namespace('beop.strategy.common')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    commonUtil
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const { Input, Button, Modal, message } = antd;

    class ShowTextModal extends React.Component{
        constructor(props, context) {
            super(props, context);
            const {isShow, title, selectedPutInfo={}} = this.props;
            this.state = {
                isShow,
                title:title + selectedPutInfo.name,
                selectedPutInfo,
                isFormat: false
            }
            this.createInput = this.createInput.bind(this);
            this.createFooter = this.createFooter.bind(this);
            this.jsonparse = this.jsonparse.bind(this);
            this.show = this.show.bind(this);
            this.hide = this.hide.bind(this);
        }
        componentWillReceiveProps(props) {
            const {isShow, title, selectedPutInfo={}} = props;
            this.setState({
                isShow,
                title:title + selectedPutInfo.name,
                selectedPutInfo,
                isFormat: false
            });
        }
        shouldComponentUpdate(nextprops, nextstate) {
            return true;
        }
        render() {
            const {isShow, title, selectedPutInfo, isFormat} = this.state;
            const {doCancel, doOk} = this.props;
            return (
                h(Modal, {
                    maskClosable: false,
                    visible: isShow,
                    title: title,
                    onCancel: doCancel,
                    footer: this.createFooter()
                },[this.createInput(selectedPutInfo, isFormat)])
            )
        }
        show(selectedPutInfo) {
            const {title} = this.props;
            this.setState({
                isShow: true,
                title: title + selectedPutInfo.name,
                selectedPutInfo
            });
        }
        hide() {
            const {title} = this.props;
            this.setState({
                isShow: false,
                title: title,
                selectedPutInfo:{}
            });
        }
        jsonparse() {
            try{
                this.setState({
                    selectedPutInfo:{
                        value:JSON.stringify(JSON.parse(this.state.selectedPutInfo.value),null,4)
                    },
                    isFormat: true
                })
            }catch(e){
                message.error(I18n.resource.message.FORMAT_FAIL);
            }
        }
        createFooter() {
            const {isShow, title, selectedPutInfo} = this.state;
            const {doCancel, doOk} = this.props;
            if(selectedPutInfo.isInput){
                return [h(Button, { key: 'no', onClick: doCancel, size: 'large' }, [I18n.resource.modal.CANCEL]), h(Button, { key: 'ok', onClick: doOk, size: 'large', type: 'primary' }, [I18n.resource.modal.OK])];
            }else{
                let value = selectedPutInfo.value;
                let type;
                try {
                    JSON.parse(value);
                    type='json';
                } catch (error) {
                    type='html';
                }
                if(type=='json'){
                    return [h(Button, { key: 'ok', onClick: this.jsonparse, size: 'large', type: 'primary' }, [I18n.resource.modal.FORMATTING])];
                }else{
                    return [];
                }
                
            }
        }
        createInput(selectedPutInfo, isFormat) {
            //可拖拽数据源输入框
            let _this = this;
            let preventFn = function(e) { e.preventDefault(); };
            class InputComponent extends Input{
                constructor(props, context) {
                    super(props, context);
                    this.state = {
                        value:this.props.selectedPutInfo.inputValue
                    }
                    
                    this.dsDrop = this.dsDrop.bind(this);
                    this.change = this.change.bind(this);
                }
                dsDrop(e) {
                    var dsItemId = e.dataTransfer.getData('dsItemId'),
                        ds;
                    if (dsItemId) {
                        ds = commonUtil.parseDs(dsItemId);
                        this.setState({
                            value:ds
                        });
                    }
                    
                }
                change(e) {
                    this.setState({
                        value:e.target.value
                    });
                }
                render() {
                    return (
                        h(Input, {
                            id: 'debugValueInput',
                            className: 'gray-scrollbar',
                            style: {
                                maxHeight: '308px'
                            },
                            type:'textarea',
                            rows:8,
                            defaultValue: this.state.value,
                            value: this.state.value,
                            onDragStart: preventFn,
                            onDragOver: preventFn,
                            onDrop: this.dsDrop,
                            onChange: this.change
                        })
                    );
                }
            }
            if(selectedPutInfo.isInput){
                return (h(InputComponent,{selectedPutInfo}));
            }else{
                let value = selectedPutInfo.value;
                let type;
                try {
                    JSON.parse(value);
                    type='json';
                } catch (error) {
                    type='html';
                }
                if(type=='json'){
                    return (h('div',{className:'gray-scrollbar',style:{
                            height: 'auto',
                            minHeight:'60px',
                            maxHeight:'308px',
                            overflowY: 'auto',
                            wordBreak: 'break-word',
                            whiteSpace: isFormat?'pre-wrap':'normal'
                    }},[selectedPutInfo.value]));
                }else{
                    return (
                        h('div', {
                            className:'gray-scrollbar variableView',
                            dangerouslySetInnerHTML:{__html: value},
                            style:{
                                height: 'auto',
                                minHeight:'60px',
                                maxHeight:'308px',
                                overflowY: 'auto',
                                wordBreak: 'break-word',
                                whiteSpace: isFormat?'pre-wrap':'normal'
                            }
                        })
                    );
                }
            }
        }
    };
    exports.ShowTextModal = ShowTextModal;
}));
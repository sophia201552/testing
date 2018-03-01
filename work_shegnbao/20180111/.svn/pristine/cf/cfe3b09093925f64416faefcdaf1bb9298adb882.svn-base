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
            namespace('beop.strategy.components.modals.ShowTextModal')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    ShowTextModal
) {
    var h = React.h;
    var linkEvent = React.linkEvent;

    const { Tree, Icon } = antd;
    const TreeNode = Tree.TreeNode;

    const deepClone = $.extend.bind($, true);
    let timer = null;

    class DebugWatchPanel extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.inputIdSet = new Set();
            this.state = {
                expandedKeys: this.props.modules.map(v=>v._id)
            }
            this.getTree = this.getTree.bind(this);
            this.getParams = this.getParams.bind(this);
            this.onSelect = this.onSelect.bind(this);
            this.hideTextModal = this.hideTextModal.bind(this);
            this.showTextModal = this.showTextModal.bind(this);
            this.onExpand = this.onExpand.bind(this);
        }

        componentWillReceiveProps(nextProps) {
            if(this.props.strategy._id!==nextProps.strategy._id){
                this.inputIdSet = new Set();
                this.setState({
                    expandedKeys: nextProps.modules.map(v=>v._id)
                });
            }
        }

        hideTextModal() {
            this.refs.ShowTextModal.hide();
        }

        showTextModal(id) {
            const {modules, runResult, strategy} = this.props;
            let outputResult = this.props.runResult && this.props.runResult.rs || {};
            let value = I18n.resource.modal.NOT_AVAILABLE,
                name = '';
            modules.forEach(module=>{
                let inputResult = this.props.runResult && this.props.runResult.input && this.props.runResult.input[module._id] || {};
                module.option.input.forEach(row=>{
                    if(id == row._id){
                        name = (row.desc===undefined||row.desc==='')?row.name:row.desc;
                        if(inputResult[row._id]!=undefined){
                            value = inputResult[row._id];
                        }else if(outputResult[row.refOutputId]!=undefined){
                            value = outputResult[row.refOutputId];
                        }
                    }
                    
                });
            });
            this.refs.ShowTextModal.show({
                name:name,
                value:value,
                isInput:false,
                inputValue: undefined
            });
        }

        shouldComponentUpdate(nextProps, nextState) {
            const {modules, runResult, strategy} = this.props;
            let isObjectValueEqual = (a={}, b={})=> {
                let aProps = Object.getOwnPropertyNames(a);
                let bProps = Object.getOwnPropertyNames(b);
            
                if (aProps.length != bProps.length) {
                    return false;
                }
            
                for (var i = 0; i < aProps.length; i++) {
                    let propName = aProps[i];
                    if(typeof a[propName] == typeof b[propName]){
                        if(typeof a[propName] == 'object'){
                            let isOk = isObjectValueEqual(a[propName],b[propName]);
                            if(!isOk){
                                return false;
                            }
                        }else if(a[propName] !== b[propName]){
                             return false;
                        }
                    }else{
                        return false;
                    }
                }
                return true;
            }
            if(strategy._id!==nextProps.strategy._id || this.state.expandedKeys.length!=nextState.expandedKeys.length || !isObjectValueEqual(runResult.input,nextProps.runResult.input)){
                return true;
            }
            if(isObjectValueEqual(runResult.rs,nextProps.runResult.rs)){
                return false;
            }
            return true;
        }

        getParams(input, output, moduleId) {
            var list = [];
            var outputResult = {}, inputResult = {};
            if(this.props.runResult&&this.props.runResult.rs){
                outputResult = this.props.runResult.rs;
            }
            if(this.props.runResult&&this.props.runResult.input){
                inputResult = this.props.runResult.input[moduleId];
            }
            let $textWrap = $('#textWidth').css('fontSize', '12px');
            input.forEach(
                (row) => {
                    let value = I18n.resource.modal.NOT_AVAILABLE,
                        name = (row.desc===undefined||row.desc==='')?row.name:row.desc + ':';
                    if(inputResult[row._id]!=undefined){
                        value = inputResult[row._id];
                    }else if(outputResult[row.refOutputId]!=undefined){
                        value = outputResult[row.refOutputId];
                    }
                    this.inputIdSet.add(row._id);
                    if(value != I18n.resource.modal.NOT_AVAILABLE && $textWrap.text(name+value).width()>170 || /[\n\r]/.test(name+value)){
                        value = ' @';
                    }
                    list.push(
                        h(TreeNode, {
                            key: row._id,
                            title: [
                                h(Icon, {
                                    key: 'icon',
                                    type: 'up-circle',
                                    style: {
                                        color: '#2db7f5'
                                    }
                                }),
                                h('span',{
                                    key:'namevalue',
                                    onMouseEnter: linkEvent(row.refOutputId?row.refOutputId:row._id,this.props.watchMouseEnterLeave),
                                    onMouseLeave: linkEvent(undefined,this.props.watchMouseEnterLeave),
                                },[
                                    h('span', {
                                        key: 'name',
                                        style: {
                                            marginLeft: '5px',
                                            color: '#2db7f5'
                                        },
                                    }, [name]),
                                    h('span', {
                                        key: 'value',
                                        style: {
                                            marginLeft: '5px',
                                            color: '#cadee5',
                                            fontStyle: 'Italic'
                                        },
                                    }, [value])
                                ])
                                
                            ]
                        })
                    );
                }
            );

            output.forEach(
                (row) => {
                    let value = I18n.resource.modal.NOT_AVAILABLE,
                        name = (row.desc===undefined||row.desc==='')?row.name:row.desc + ':';
                    if(outputResult[row._id]!=undefined){
                        value = outputResult[row._id];
                    }
                    if(value != I18n.resource.modal.NOT_AVAILABLE && $textWrap.text(name+value).width()>170 || /[\n\r]/.test(name+value)){
                        value = ' @';
                    }
                    list.push(
                        h(TreeNode, {
                            key: row._id,
                            title: [
                                h(Icon, {
                                    key: 'icon',
                                    type: 'down-circle',
                                    style: {
                                        color: '#f56a00'
                                    }
                                }),
                                h('span',{
                                    key:'namevalue',
                                    onMouseEnter: linkEvent(row._id,this.props.watchMouseEnterLeave),
                                    onMouseLeave: linkEvent(undefined,this.props.watchMouseEnterLeave),
                                },[
                                    h('span', {
                                        key: 'name',
                                        style: {
                                            marginLeft: '5px',
                                            color: '#f56a00'
                                        },
                                        
                                    }, [name]),
                                    h('span', {
                                        key: 'value',
                                        style: {
                                            marginLeft: '5px',
                                            color: '#cadee5',
                                            fontStyle: 'Italic'
                                        },
                                    }, [value])
                                ])
                            ]
                        })
                    );
                }
            );

            return list;
        }

        getTree() {
            var modules = this.props.modules;

            return modules.map(
                (v) => {
                    return (
                        h(TreeNode, {
                            key: v._id,
                            title: v.name,
                            showIcon: true
                        }, this.getParams(v.option.input, v.option.output, v._id))
                    )
                }
            );
        }
        onSelect(ids, event){
            const {watchSelected, watchDbClick} = this.props;
            const {node, selected} = event
            if(this.inputIdSet.has(node.props.eventKey)){
                this.showTextModal(node.props.eventKey);
            }else{
                watchDbClick(node.props.eventKey);
            }
            
            // if (!timer) {
            //     watchSelected(node.props.eventKey);
            //     timer = window.setTimeout(() => {
            //         window.clearTimeout(timer);
            //         timer = null;
            //     }, 400);
            // } else {
            //     window.clearTimeout(timer);
            //     timer = null;
            //     watchDbClick(node.props.eventKey);
            // }  
            
        }
        onExpand(expandedKeys) {
            this.setState({
                expandedKeys: expandedKeys
            });
        }
        render(){
            return (
                h('div',{
                    className:'gray-scrollbar',
                    style:{
                        overflowY:'auto',
                        height:'100%'
                    }
                },[
                    h(Tree, {
                        expandedKeys: this.state.expandedKeys,
                        onSelect:this.onSelect,
                        onExpand: this.onExpand
                    }, this.getTree()),
                    h(ShowTextModal, {
                        ref: 'ShowTextModal',
                        isShow: false,
                        title: I18n.resource.modal.SEE_THE_VALUE,
                        doCancel: this.hideTextModal,
                        doOk: ()=>{},
                    }),
                ])
            )
        }
    }

    exports.DebugWatchPanel = DebugWatchPanel;
}));
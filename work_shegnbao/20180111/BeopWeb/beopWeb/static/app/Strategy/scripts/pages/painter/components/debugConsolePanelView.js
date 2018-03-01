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
            namespace('beop.strategy.containers.Sketchpad'),
            namespace('beop.strategy.components.SketchpadToolbar'),
            namespace('beop.strategy.containers.ModuleConfigPanel'),
            namespace('beop.strategy.components.DataSourcePanel'),
            namespace('beop.strategy.components.DebugViewSketchpad'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    Sketchpad,
    SketchpadToolbar,
    ModuleConfigPanel,
    DataSourcePanel,
    DebugViewSketchpad,
    enumerators
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const { Tabs, Button, Input, Modal, Spin } = antd;
    const { TabPane } = Tabs;

    class FaultModal extends React.Component{
        constructor(props, context) {
            super(props, context);
            this.async = null;
            this.state = {
                visible: false,
                spin: false,
                data: null
            }
            this.showModal = this.showModal.bind(this);
            this.getInfo = this.getInfo.bind(this);
        }
        render() {
            const {visible,spin} = this.state;
            return h(Modal,{
                visible: visible,
                footer: null,
                maskClosable: true,
                width: '600',
                title: I18n.resource.message.DETAILS,
                okText: I18n.resource.modal.OK,
                cancelText: I18n.resource.modal.CANCEL,
                onCancel: ()=>{
                    this.showModal(false);
                }
            },[
                h(Spin,{
                    size:"large",
                    spinning:spin
                },[
                    h('div',{
                        
                    },this.getInfo())
                ])
            ])
        }
        showModal(isShow, faultId) {
            if(faultId && isShow){
                this.setState({
                    visible: isShow,
                    spin: true
                });
                this.async =  WebAPI.post("/diagnosis_v2/getFaultsInfosByIds",{
                    ids: [faultId],
                    lan: I18n.type
                }).done((result)=>{
                    this.setState({
                        data: result.data[0]
                    });
                }).always(()=>{
                    this.async = null;
                    this.setState({
                        spin: false
                    });
                });
            }else{
                this.setState({
                    visible: isShow,
                    spin: false,
                    data: null
                });
            }
        }
        getInfo() {
            const {data} = this.state;
            let result = [];
            const firstUp = (key)=>{
                if(key.length>0){
                    let tempArr = key.split('');
                    tempArr[0] = tempArr[0].toUpperCase();
                    key = tempArr.join('');
                }
                return key;
            };
            const createItem = (key, value)=>{
                return h('div',{},[
                    h('label',{
                        style:{
                            float:'left',
                            width:'20%',
                            textAlign:'right',
                            paddingRight:'10px'
                        }
                    },[I18n.resource.message['FAULT_'+key.toUpperCase()]]),
                    h('label',{
                        style:{
                            float:'right',
                            width:'80%',
                            overflow: 'hidden',
                            'white-space': 'nowrap',
                            'text-overflow': 'ellipsis',
                        }
                    },[value]),
                    h('div',{
                        style:{
                            clear:'both'
                        }
                    })
                ]);
            };
            if(data){
                let arr = ['name', 'description', 'suggestion', 'grade', 'className'];
                arr.forEach(k=>{
                    if(k == 'grade'){
                        result.push(createItem(k, enumerators.faultGradeName[data[k]]));
                    }else{
                        result.push(createItem(k, data[k]));
                    }
                    
                });
            }
            return result;
        }
    }

    class DebugViewConsole  extends React.Component{
        constructor(props, context) {
            super(props, context);
            this.needUpdate = true;
            this.state = {
                active: 'console',
                consoleInfo: this.props.consoleInfo||[]
            };
            this.clearConsole = this.clearConsole.bind(this);
            this.loading = undefined;
        }
        componentWillReceiveProps(nextProps){
            let needUpdate = true;
            if(nextProps.consoleInfo && this.state.consoleInfo && nextProps.consoleInfo.length==this.state.consoleInfo.length && nextProps.consoleInfo.length!==0){
                needUpdate = false;
                nextProps.consoleInfo.forEach((o,i)=>{
                    let o2 = this.state.consoleInfo[i];
                    if(o.level!==o2.level||o.msg!==o2.msg){
                        needUpdate = true;
                    }
                });
            }else if(!nextProps.consoleInfo || !this.state.consoleInfo){
                needUpdate = true;
            }
            this.needUpdate = needUpdate;
            if(needUpdate){
                this.setState({
                    consoleInfo:nextProps.consoleInfo||[]
                });
            }
        }
        shouldComponentUpdate(nextProps, nextState){
            return this.needUpdate;
        }
        componentWillUnmount(){
            if(this.loading){
                clearInterval(this.loading);
            }
        }
        clearConsole() {
            this.needUpdate = true;
            this.setState({
                consoleInfo:[]
            });
        }
        consoleLoadStart() {
            var flag = 0,
                arr = [{level:0,msg:'/'},{level:0,msg:'-'},{level:0,msg:'|'},{level:0,msg:'\\'}];
            if(this.loading){
                clearInterval(this.loading);
            }
            this.loading = setInterval(()=>{
                flag = (++flag)%4;
                this.needUpdate = true;
                this.state.consoleInfo.pop();
                this.state.consoleInfo.push(arr[flag]);
                this.setState(this.state);
            },100);
            
        }
        consoleLoadEnd() {
            this.needUpdate = true;
            this.state.consoleInfo.pop();
            this.state.consoleInfo.push({level:4,msg:''});
            this.setState(this.state);
            if(this.loading){
                clearInterval(this.loading);
            }
        }
        getToolbar(active) {
            var result = [];
            switch (active) {
                case 'console':
                    result = [
                        h(Button, {
                            icon: 'delete',
                            ghost: false,
                            onClick: this.props.clearConsole
                        }, [])
                    ]
                    break;
            }
            return h('div', { style: { width:'100%',padding:'2px 2px'} }, [h('div',{style:{
                float:'right'
            }},result),h('div',{style:{clear:'both'}})]);
        }
        getText() {
            var result = [];
            let pStyle = {
                'wordBreak':'break-word'
            }
            this.state.consoleInfo.forEach((obj) => {
                switch (obj.level) {
                    case 0:
                        result.push(h('p', {style:pStyle}, [obj.msg]));
                        break;
                    case 1:
                        result.push(h('p', {style:pStyle}, [h('span', { className: 'glyphicon glyphicon-info-sign', style: { color: '#1BA1E2' } }), obj.msg]));
                        break;
                    case 2:
                        result.push(h('p', {style:pStyle}, [h('span', { className: 'glyphicon glyphicon-warning-sign', style: { color: '#FFCC00' } }), obj.msg]));
                        break;
                    case 3:
                        result.push(h('p', {style:pStyle}, [h('span', { className: 'glyphicon glyphicon-remove-sign', style: { color: '#A45F52' } }), obj.msg]));
                        break;
                    case 4:
                        result.push(h('p', {style:pStyle}, [h('span', { className: 'glyphicon glyphicon-remove-sign', style: { color: 'transparent' } }), obj.msg]));
                        break;
                    case 101:
                        result.push(h('p',{},[
                            h('span', { className: 'glyphicon glyphicon-remove-sign', style: { color: 'transparent' } }),
                            h('a',{
                                onClick: ()=>{
                                    this.refs.FaultModal.showModal(true, obj.faultId);
                                }
                            },[obj.msg])
                        ]));
                        break;
                }
            });
            return h('div#consoleMessag', {style:{
                height:'calc( 100% - 62px)',
                overflow:'auto',
                width:'100%'
            },ref:"myText",className:'gray-scrollbar'}, result);
        }
        getInput() {
            return h('div#consoleInput',{},[
                h(Input,{
                    addonBefore:'>'
                })
            ]);
        }
        changeActive(active) {
            this.needUpdate = true;
            this.setState({
                active: active
            });
        }
        componentDidUpdate() {
            this.refs.myText.scrollTop = this.refs.myText.scrollHeight;
        }
        render() {
            return h(Tabs, {
                type: 'card',
                defaultActiveKey: 'console',
                onChange: this.changeActive,
                style: {
                    height: '100%',
                    width: '100%'
                }
            }, [
                h(TabPane, { tab: I18n.resource.debug.CONSOLE, key: 'console' }, [
                    this.getToolbar(this.state.active),
                    this.getText(),
                    this.getInput()
                ]),
                h(FaultModal,{
                    ref: 'FaultModal'
                })
            ])
        }
    };

    exports.DebugViewConsole = DebugViewConsole;
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('React'),
            namespace('ReactKonva'),
            namespace('antd'),
            namespace('beop.strategy.components.Painter.GInputGroup'),
            namespace('beop.strategy.components.Painter.GOutputGroup'),
            namespace('beop.strategy.components.Painter.GShapeGroup'),
            namespace('beop.strategy.components.Painter.GGroupShape'),
            namespace('beop.strategy.components.Painter.GArrowGroup'),
            namespace('beop.strategy.components.Painter.GAlignmentLineGroup'),
            namespace('beop.strategy.components.Painter.Calculation'),
            namespace('beop.strategy.enumerators'),
            namespace('beop.strategy.components.Spinner'),
            namespace('beop.strategy.components.modals.ShowTagsTableModal'),
            namespace('diff'),
            namespace('beop.util.MergeDiff'),
            namespace('beop.strategy.components.modals.ExportTemplateModal')
        );
    }
}(namespace('beop.strategy.components'), function(exports, React, ReactKonva, antd, GInputGroup, GOutputGroup, GShapeGroup, GGroupShape, GArrowGroup, GAlignmentLineGroup, Calculation, enumerators, Spinner, ShowTagsTableModal, diff, MergeDiff, ExportTemplateModal) {

    var h = React.h;
    var linkEvent = React.linkEvent;

    const { Affix, Button, Select, Modal, Tabs, Tree, Icon, Tag, Progress, Input} = antd;
    const { TabPane } = Tabs;
    const { TreeNode } = Tree;
    const Option = Select.Option;
    const SketchpadChild = Calculation.Child;
    const confirm = Modal.confirm;
    const Search = Input.Search;

    let SaveBtn = React.createClass({ //保存按钮组件（保存动画）
        getInitialState() {
            this.async = undefined;
            this.timer = undefined;
            return {
                loading: false
            };
        },
        enterLoading() {
            this.setState({ loading: true });
            this.async = this.props.doSave(this.exitLoading);
            let asy = this.async.always?this.async:this.async.async;
            asy.always(() => {
                this.async = undefined;
            });
        },
        exitLoading(time) {
            this.timer = setTimeout(() => {
                this.timer = undefined;
                this.setState({ loading: false });
            }, time);
        },
        componentWillUnmount() {
            if (this.async) {
                this.async.abort();
                this.async = undefined;
            }
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
            }
        },
        render() {
            return (h(Button, {
                onClick: this.enterLoading,
                loading: this.state.loading
            }, [I18n.resource.sketchpad.SAVE]));
        }
    });

    class FrontBtn extends React.Component { //前置策略按钮组件
        constructor(props, context) {
            super(props, context);
            this.state = {
                loading: false,
                visible: false,
                curtain: false,
                preTasks: this.getPreTasks(this.props.strategy, this.props.strategyList)
            }
            this.showModal = this.showModal.bind(this);
            this.closeModal = this.closeModal.bind(this);
            this.handleOk = this.handleOk.bind(this);
            this.onDragEnter = this.onDragEnter.bind(this);
            this.onDragLeave = this.onDragLeave.bind(this);
            this.onDrop = this.onDrop.bind(this);
            this.removeItem = this.removeItem.bind(this);
            this.updateStrategy = this.updateStrategy.bind(this);
        }
        componentWillReceiveProps(props) {
            this.setState({
                preTasks: this.getPreTasks(props.strategy, props.strategyList)
            })
        }
        updateStrategy(strategy, strategyList) {
            this.setState({
                preTasks: this.getPreTasks(strategy, strategyList)
            })
        }
        getPreTasks(strategy, strategyList) {
            strategy = strategy || {};
            strategyList = strategyList || [];
            let list = [];
            strategyList.forEach(proj => {
                list = list.concat(proj.children || []);
            });
            let results = new Map();
            let preTasks = strategy.preTasks || [];
            preTasks.forEach(preTask => {
                let info = list.find(item => item._id == preTask);
                if (info) {
                    results.set(info._id, info);
                }
            });
            return results;
        }
        showModal() {
            this.setState({
                visible: true,
                // preTasks: this.getPreTasks(this.props.strategy, this.props.strategyList)
            });
        }
        closeModal() {
            this.setState({
                visible: false,
                // preTasks: new Map()
            });
        }
        handleOk() {
            this.setState({
                loading: true,
            });
            let preTasks = [];
            this.state.preTasks.forEach(info => {
                preTasks.push(info._id);
            });
            let info = {
                userId: AppConfig.userId,
                ids: [this.props.strategy._id],
                data: {
                    'preTasks': preTasks
                },
                projId: AppConfig.projectId
            };
            WebAPI.post('/strategy/item/save', info).done(() => {
                this.setState({
                    visible: false,
                    loading: false,
                });
                this.props.strategyPreTasksChange(preTasks);
            });
        }
        onDragEnter() {
            this.setState({
                curtain: true
            });
        }
        onDragLeave() {
            this.setState({
                curtain: false
            });
        }
        onDrop(e) {
            let infoStr = e.dataTransfer.getData('projDragInfo');
            if (infoStr) {
                let info = JSON.parse(infoStr);
                if (this.props.strategy._id !== info.dataId) {
                    this.state.preTasks.set(info.dataId, info.data);
                }
            }
            this.state.curtain = false;
            this.setState(this.state);
        }
        removeItem(id) {
            this.state.preTasks.delete(id);
            this.setState(this.state);
        }
        createItems() {
            let result = [];
            this.state.preTasks.forEach(info => {
                (
                    result.push(h('div', {
                        key: info._id,
                        style: {
                            width: '100%',
                            height: '40px',
                            padding: '6px 0',
                            borderBottom: '1px solid #777'
                        }
                    }, [
                        h('div', {
                            className: 'fl',
                            style: {
                                height: '100%',
                                lineHeight: '28px'
                            }
                        }, [
                            info.name
                        ]),
                        h('div', { className: 'fr' }, [
                            h(Button, { onClick: linkEvent(info._id, this.removeItem) }, ['x'])
                        ])
                    ]))
                )
            });
            return result;
        }
        render() {
            const preventFn = (e) => {
                e.preventDefault();
            };
            return (
                h('div', {
                    style: {
                        display: 'inline-block'
                    },
                }, [
                    h(Button, {
                        onClick: this.showModal
                    }, [I18n.resource.sketchpad.LEAD_STRATEGY]),
                    h(Modal, {
                        title: I18n.resource.modal.FRONT_POLICY_CONFIGURATION,
                        visible: this.state.visible,
                        onOk: this.handleOk,
                        onCancel: this.closeModal,
                        footer: [h(Button, { key: 'close', onClick: this.closeModal }, [I18n.resource.modal.CANCEL]), h(Button, { key: 'save', onClick: this.handleOk, loading: this.state.loading }, [I18n.resource.propTree.SAVE])]
                    }, [
                        h('div', {

                        }, [
                            h('div', {
                                style: {
                                    width: '100%',
                                    height: '40px',
                                    backgroundColor: this.state.curtain ? '#777' : '#2b3034',
                                    padding: '6px 0',
                                    textAlign: 'center',
                                    border: '1px solid #777',
                                    lineHeight: '26px'
                                },
                                onDragStart: preventFn,
                                onDragOver: preventFn,
                                onDrop: this.onDrop,
                                onDragEnter: this.onDragEnter,
                                onDragLeave: this.onDragLeave,
                            }, [I18n.resource.modal.DRAG_TO_ADD]),
                            ...this.createItems()
                        ])
                    ])
                ])
            )
        }
    }

    class OutLinkModal extends React.Component {
        constructor(props, context) {
            super(props, context);
            const { outLinkData = {}, showAddOutLinkModal } = this.props;
            this.state = {
                loading: false,
                visible: showAddOutLinkModal,
                strategy: outLinkData.strategy || {},
                modules: outLinkData.modules || [],
                checkedMap: {},
                activeKey: undefined
                    // result:{inputs:[],outputs:[]}
            }
            this.getResult = this.getResult.bind(this);
            this.closeModal = this.closeModal.bind(this);
            this.handleOk = this.handleOk.bind(this);
            this.onCheck = this.onCheck.bind(this);
            this.onTabsChange = this.onTabsChange.bind(this);
        }
        componentWillReceiveProps(props) {
            const { outLinkData = {}, showAddOutLinkModal } = props;
            this.setState({
                loading: false,
                visible: showAddOutLinkModal,
                strategy: outLinkData.strategy || {},
                modules: outLinkData.modules || [],
                activeKey: outLinkData.strategy && outLinkData.strategy.value && outLinkData.strategy.value[0] && outLinkData.strategy.value[0]._id || undefined
            });
        }
        getResult() {
            const { strategy, modules, checkedMap } = this.state;
            let result = {
                inputs: [],
                outputs: []
            };
            let inputs = [],
                outputs = [];
            modules.forEach(module => {
                inputs = inputs.concat(module.option.input);
                outputs = outputs.concat(module.option.output);
            })
            for (let groupId in checkedMap) {
                let putIds = checkedMap[groupId];
                let groupInfo = strategy.value.find(v => v._id == groupId);
                if (groupInfo) {
                    putIds.forEach(putId => {
                        let input = inputs.find(input => input._id == putId),
                            output = outputs.find(output => output._id == putId);
                        if (input) {
                            input = Object.assign({}, input);
                            input.refOutputId = input._id;
                            input._id = ObjectId();
                            input.loc = undefined;
                            input.name = groupInfo.name + '_' + input.name;
                            input.refStrategyId = strategy._id;
                            input.type = enumerators.moduleInputOutputTypes.OTHER_MODULES;
                            result.inputs.push(input);
                        } else if (output) {
                            output = Object.assign({}, output);
                            output.refOutputId = output._id;
                            output._id = ObjectId();
                            output.loc = undefined;
                            output.name = groupInfo.name + '_' + output.name;
                            output.refStrategyId = strategy._id;
                            output.type = enumerators.moduleInputOutputTypes.OTHER_MODULES;
                            result.outputs.push(output);
                        }
                    });
                }
            }
            return result;
        }
        closeModal() {
            this.props.closeAddOutLinkModal();
        }
        handleOk() {
            let result = this.getResult();
            this.props.addOutLinkInputs(result.inputs.concat(result.outputs));
        }
        onCheck(groupId, keys) {
            let checkedMap = Object.assign({}, this.state.checkedMap);
            checkedMap[groupId] = keys;
            this.setState({
                checkedMap
            });
        }
        onTabsChange(key) {
            this.setState({
                activeKey: key
            });
            // if(key=='0'){
            //     this.setState({
            //         result:this.getResult()
            //     })
            // }
        }
        render() {
            const { strategy, modules } = this.state;
            const createTreeNode = (put, moduleId) => {
                return h(TreeNode, {
                    key: put._id,
                    isLeaf: true,
                    title: h('div', {}, [
                        h(Icon, {
                            type: enumerators.moduleInputOutputTypeIcons[put.type],
                            style: {
                                marginRight: '4px'
                            }
                        }),
                        put.name
                    ])
                }, [])
            };

            const createTags = () => {
                // const checkedMap = this.state.checkedMap;

                const result = this.state.result;
                let arr = [];
                // for(let groupId in checkedMap){
                //     let putIds = checkedMap[groupId];
                //     let tags = putIds.forEach();
                // }
                result.inputs.forEach(input => {
                    arr.push(h(Tag, { color: 'green' }, [input.name]));
                });
                result.outputs.forEach(output => {
                    arr.push(h(Tag, { color: 'blue' }, [output.name]));
                })
                return arr;
            };

            let treeNodes = modules.map(module => (h(TreeNode, {
                key: module._id,
                title: module.name
            }, [
                ...module.option.input.map(input => (
                    createTreeNode(input, module._id)
                )),
                ...module.option.output.map(output => (
                    createTreeNode(output, module._id)
                ))
            ])));

            let tabPanes = strategy.value && strategy.value.map(v => (h(TabPane, { tab: v.name, key: v._id }, [
                h(Tree, {
                    checkable: true,
                    defaultExpandAll: true,
                    onCheck: linkEvent(v._id, this.onCheck)
                }, [
                    ...treeNodes
                ])
            ]))) || [];

            return (
                h(Modal, {
                    title: I18n.resource.modal.REFER_TO_EXTERNAL_POLICY_INPUT_AND_OUTPUT_PARAMETERS_CONFIGURATION,
                    visible: this.state.visible,
                    onOk: this.handleOk,
                    onCancel: this.closeModal,
                    footer: [h(Button, { key: 'close', onClick: this.closeModal }, [I18n.resource.modal.CANCEL]), h(Button, { key: 'save', onClick: this.handleOk, loading: this.state.loading }, [I18n.resource.modal.SAVE])]
                }, [
                    h(Tabs, {
                        activeKey: this.state.activeKey,
                        onChange: this.onTabsChange
                    }, [
                        ...tabPanes,
                        // h(TabPane,{
                        //     key:'0',
                        //     tab:'总览'
                        // },[
                        //     ...createTags()
                        // ])
                    ])
                ])
            )
        }
    }

    class ProgressWrap extends React.Component{
        constructor(props, context) {
            super(props, context);
            this.timer = undefined;
            this.async = undefined;
            this.state = {
                isShow: false,
                percent: 0,
                showInfo: true,
                status: 'active',
                farmatType: 0,
            };
            this.show = this.show.bind(this);
            this.hide = this.hide.bind(this);
            this.setPercent = this.setPercent.bind(this);
            this.setShowInfo = this.setShowInfo.bind(this);
            this.setStatus = this.setStatus.bind(this);
            this.format = this.format.bind(this);
            this.clearAsync = this.clearAsync.bind(this);
        }

        show(farmatType = 0,isShowInfo = true) {
            this.setState({
                isShow: true,
                showInfo: isShowInfo,
                farmatType: farmatType,
                percent: 0,
                status: 'active'
            });
        }

        hide(farmatType = 0,isShowInfo = true) {
            this.setState({
                isShow: false,
                showInfo: isShowInfo,
                farmatType: farmatType
            });
        }

        setShowInfo(isShowInfo) {
            this.setState({
                showInfo: isShowInfo
            });
        }

        setStatus(status = 'exception',isClose = true) {
            this.setState({
                status: status
            });
            if(isClose){
                this.setPercent(100, status);
            }
        }

        setPercent(num,status = 'success') {
            let percent = num==0?0:Math.min(this.state.percent + num, 100);
            if(percent == 100){
                this.setState({
                    status: status,
                    percent: percent,
                });
            }else{
                this.setState({
                    percent: percent,
                });
            }
            
            if(percent == 100 && !this.timer){
                this.setShowInfo(true);
                this.async = undefined;
                this.timer = setTimeout(()=>{
                    this.timer = undefined;
                    this.hide();
                },1000);
            }
        }

        format(percent) {
            let result;
            switch(this.state.farmatType){
                case 0:
                    result = percent.toFixed(0)+'%';
                    if(percent == 100){
                        if(this.state.status == 'success'){
                            result = '√';
                        }else{
                            result = 'X';
                        }
                    }
                    break;
                case 1:
                    result = 'wait';
                    if(percent == 100){
                        if(this.state.status == 'success'){
                            result = '√';
                        }else{
                            result = 'X';
                        }
                    }
            }
            return result;
        }

        clearAsync() {
            if(this.timer){
                clearTimeout(this.timer);
                this.timer = undefined;
            }
            if(this.async){
                this.async.forEach((a)=>{
                    a.abort();
                });
                this.async = undefined;
            }
            this.hide();
        }

        componentWillUnmount() {
            this.clearAsync();
        }

        render() {
            return (h('div',{
                id: 'progressWrap',
                style:{
                    display: this.state.isShow?'block':'none',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    zIndex: 1000,
                    background: 'rgba(0,0,0,.3)'
                }
            },[h('div',{style:{margin:'auto',width:'132px',height:'132px',position:'absolute',top:0,left:0,bottom:0,right:0}},[h(Progress,{type: 'circle',percent: this.state.percent,strokeWidth:1, showInfo:this.state.showInfo,status:this.state.status,format:this.format})])]))
        }
    }

    class Stage extends React.Component {

        constructor(props, context) {
            super(props, context);
            document.body.classList.add('sketchpadViewBody');
            this.elements = {};
            this.stage = undefined;
            this.layer = undefined;
            this.bd = undefined; //布线画板
            this.HEIGHT = 768;
            this.WIDTH = 1366;
            this.scale = 1;
            this.isResized = false;
            this.scaleTimer = undefined;
            this.resizeTimer = undefined;
            this.isInSketchpad = true;
            this.isNeedUpdate = false;
            this.state = {
                scale: this.scale,
                strategy: this.props.strategy,
                strategyList: this.props.strategyList
            }
            this.domResize = this.domResize.bind(this);
            this.domKeyDown = this.domKeyDown.bind(this);
            this.getDiff = this.getDiff.bind(this);
            this.getLayer = this.getLayer.bind(this);
        }

        componentDidMount() {
            //dom渲染完成后更新stage和layer 并且resize
            this.stage = this.elements.stage.getStage();
            this.layer = this.getLayer();
            //有数据的话 是由config返回该页面
            if (this.props.modules.length > 0) {
                this.resize(this.props.modules);
                // this.isResized = true;
            }
            if (this.bd) {
                //更新bd的layer
                this.bd.resize({
                    layer: this.layer
                });
            }
            //绑定浏览器resize事件与键盘事件
            window.addEventListener('resize',this.domResize ,false);
            window.addEventListener('keydown',this.domKeyDown ,false);
            $('#sketchpadWrap').off('mouseenter').on('mouseenter',(e)=>{
                this.isInSketchpad = true;
            });
            $('#sketchpadWrap').off('mouseleave').on('mouseleave',(e)=>{
                this.isInSketchpad = false;
            });
        }

        shouldComponentUpdate(nextProps, nextState) {
            let isSame = (a,b)=>{
                let r = true;
                let typeA = Object.prototype.toString.apply(a),
                    typeB = Object.prototype.toString.apply(b);
                if(typeA !== typeB){
                    r = false;
                }
                if(typeA == '[object String]' || typeA == '[object Boolean]'){
                    if(a != b){
                        r = false;
                    }
                }else if(typeA == '[object Array]'){
                    if(a.length !== b.length){
                        r = false;
                    }else{
                        a.forEach(v=>{
                            if(b.indexOf(v)<0){
                                r = false;
                            }
                        });
                    }
                }
                return r;
            }
            let isSameValue = (v1, v2, id)=>{
                let r = true;
                if(v1.length!=v2.length){
                    return false;
                }
                v1 = v1.find(v=>v._id == id);
                v2 = v2.find(v=>v._id == id);
                if(v1 && v2){
                    if(v1.name!=v2.name){
                        return false;
                    }
                    if(!isSame(Object.keys(v1.list), Object.keys(v2.list))){
                        return false;
                    }
                    for(let moduleId in v1.list){
                        if(!isSame(Object.keys(v1.list[moduleId]), Object.keys(v2.list[moduleId]))){
                            return false;
                        }
                        for(let inputId in v1.list[moduleId]){
                            if(v1.list[moduleId][inputId]!==v2.list[moduleId][inputId]){
                                return false;
                            }
                        }
                    }
                }
                return r;
            }
            let isNeedUpdate = true;
            let isSameModules = true;
            if(this.props.modules.length>0 || nextProps.modules.length>0){
                isSameModules = this.getDiff(this.props.modules, nextProps.modules, 'module');
            }
            
            if($(this.elements.domWrap).closest('.painterViewActive').length==0){//页面不在可视区域
                this.isNeedUpdate = true;
                isNeedUpdate =  false;
            }else if(this.isNeedUpdate){//页面第一次出现在可视区域
                this.isNeedUpdate = false;
                isNeedUpdate =  true;
                this.isResized = false;
            }else if(!isSame(this.props.tagResults.map(o=>o._id), nextProps.tagResults.map(o=>o._id))){
                let nameMap = {};
                this.props.modules.forEach(module=>{
                    nameMap[module._id] = module.name;
                    module.option.input.forEach(input=>{
                        nameMap[input._id] = input.name;
                    });
                });
                this.refs.ShowTagsTableModal.update({
                    data: nextProps.tagResults,
                    nameMap: nameMap,
                });
                isNeedUpdate =  true;
                
            }else if(!isSame(this.props.selectedValueId, nextProps.selectedValueId) || !isSame(this.props.bShowSpin, nextProps.bShowSpin)
                    || (this.state.strategy && (!isSameValue(this.state.strategy.value, nextState.strategy.value, this.props.selectedValueId)))){//改变配置 切换spin 改变tagResults 切换tagsTable显示 改变选中配置
                isNeedUpdate =  true;
            }else if( this.state.scale!=nextState.scale ){//缩放
                this.scale = nextState.scale;
                this.bd.resize({
                    width: this.WIDTH / this.scale,
                    height: this.HEIGHT / this.scale,
                    scale: this.scale,
                    layer: this.layer
                });
                isNeedUpdate =  false;
            }else if(isSameModules && (!isSame(this.props.selectedIds, nextProps.selectedIds) || (this.state.strategy && !isSame(this.state.strategy.preTasks, nextState.strategy.preTasks)) || !isSame(this.state.strategyList, nextState.strategyList))){
                this.refs.FrontBtn.updateStrategy(nextState.strategy, nextState.strategyList);
                isNeedUpdate =  false;
            }else if(isSameModules){
                isNeedUpdate =  false;
            }
            return isNeedUpdate;
        }

        componentDidUpdate() {
            if (this.props.modules.length > 0 && !this.isResized) {
                this.resize(this.props.modules);
                this.isResized = true;
            }
        }

        componentWillReceiveProps(nextProps, nextState) {
            if (nextProps.strategy && this.state.strategy && nextProps.strategy._id == this.state.strategy._id) { //相同策略刷新
                if (!nextProps.selectedValueId && nextProps.strategy.value.length > 0) {
                    if (nextProps.strategy.value[0]._id) {
                        this.props.btnActions.selectedValueChange(nextProps.strategy.value[0]._id);
                    }
                }
            } else { //切换策略
                this.isResized&&this.props.stageActions.stageClear&&this.props.stageActions.stageClear();
                this.refs.progress.clearAsync();
                if (nextProps.selectedValueId && nextProps.strategy && !nextProps.strategy.value.find(o => o._id == nextProps.selectedValueId)) {
                    this.props.btnActions.selectedValueChange(undefined);
                } else if (!nextProps.selectedValueId && nextProps.strategy && nextProps.strategy.value.length > 0) {
                    this.props.btnActions.selectedValueChange(nextProps.strategy.value[0]._id);
                }
            }
            //结束加载spinner后切换策略或者从未resize
            if (!nextProps.bShowSpin && !this.isResized || (this.state.strategy && nextProps.strategy && this.state.strategy._id != nextProps.strategy._id)) {
                this.resize(nextProps.modules);
                this.isResized = true;
            }
            this.setState({
                strategy: nextProps.strategy,
                strategyList: nextProps.strategyList
            });
        }

        componentWillUnmount() {
            this.bd && this.bd.clear();
            if (this.stage) {
                this.stage.clear();
                this.stage.destroyChildren();
                this.stage.destroy();
                this.layer = undefined;
                this.stage = undefined;
            }

            if (this.scaleTimer) {
                clearTimeout(this.scaleTimer);
                this.scaleTimer = undefined;
            }
            this.refs.progress && this.refs.progress.clearAsync();
            this.props.stageActions.stageClear&&this.props.stageActions.stageClear();

            window.removeEventListener('resize',this.domResize,false);
            window.removeEventListener('keydown',this.domKeyDown,false);
            document.body.classList.remove('sketchpadViewBody');
        }

        render() {
            this.bd = new Calculation.Main({
                width: this.WIDTH / this.scale,
                height: this.HEIGHT / this.scale,
                scale: this.scale,
                layer: this.layer
            });
            const preventFn = function(e) { e.preventDefault(); };
            const { tagResults, bShowSpin, modules, selectedValueId, stageActions, btnActions, moduleActions, inputActions, outputActions, debugActions, groupActions } = this.props;
            const {strategy} = this.state;
            let hModules = this.createModul(modules, moduleActions, stageActions),
                hPuts = this.paint(modules, stageActions, moduleActions, inputActions, outputActions, debugActions, groupActions),
                hLines = this.createLines(modules);
            return (h('#sketchpadWrap', {
                ref: this.refDefine('domWrap'),
                style: {
                    width: '100%',
                    height: 'calc(100% - 65px)',
                    position: 'relative',
                    zIndex: 10,
                    overflow: 'hidden'
                },
                onDragStart: preventFn,
                onDragOver: preventFn,
                onDrop: linkEvent({
                    strategy: strategy,
                    bd: this.bd,
                    selectedValueId: selectedValueId,
                    refs: this.refs
                }, stageActions.stageDrop),
                onContextMenu: preventFn,
                onMouseDown: stageActions.stageMouseDown.bind(this),
                onMouseUp: stageActions.stageMouseUp.bind(this),
                onWheel: stageActions.stageWheel.bind(this)
            }, [
                h(Spinner, {
                    bShowSpin,
                    id: "params-config-spinner"
                }),
                h(ProgressWrap,{
                    ref: 'progress'
                }),
                this.createLeftBtnGroup(btnActions),
                this.createBtnGroup(modules, btnActions),
                h(ReactKonva.Stage, {
                    ref: this.refDefine('stage'),
                    onDragMove: linkEvent({
                        bd: this.bd
                    }, stageActions.stageDragMove)
                }, [
                    h(ReactKonva.Layer,{
                        id: 'lineLayer',
                        key:'lineLayer'
                    },hLines),
                    h(ReactKonva.Layer,{
                        id: 'layer',
                        key:'layer'
                    },hPuts),
                    h(ReactKonva.Layer,{
                        id: 'moduleLayer',
                        key:'moduleLayer'
                    }, hModules),
                    h(ReactKonva.Layer,{
                        id: 'dragLayer',
                        key:'dragLayer'
                    }),
                ]),
                h(OutLinkModal, {
                    outLinkData: this.props.outLinkData,
                    showAddOutLinkModal: this.props.showAddOutLinkModal,
                    targetModuleId: this.props.targetModuleId,
                    closeAddOutLinkModal: this.props.btnActions.closeAddOutLinkModal,
                    addOutLinkInputs: this.props.btnActions.addOutLinkInputs
                }),
                h(ShowTagsTableModal,{
                    ref: 'ShowTagsTableModal',
                    onOk: this.props.AddMatchingTagsParams
                }),
                h(ExportTemplateModal,{
                    ref: 'exportTemplateModal',
                    afterSuccess: ()=>{
                        btnActions.refreshRulePanel();
                    }
                })
            ]));
        }

        getLayer() {
            let layer = this.stage.find('#layer')[0] || this.stage.children[1];
            return layer;
        }

        getDiff(arr1, arr2, type) {
            let changeProps;
            switch(type){
                case 'module':
                    changeProps = ['name'];
                    break;
                case 'input':
                    changeProps = [];
                    break;
                case 'output':
                    changeProps = [];
                    break;
            }
            let isSameModules = true;
            let map1 = Array.toMap(arr1, '_id'),
                map2 = Array.toMap(arr2, '_id');
            let diffData = diff(map1, map2, function(lhs, rhs, path) {
                var cmp;
                if (path.length !== 2 || ['option', 'loc'].indexOf(path[1]) === -1) return;
                cmp = window.diff(lhs, rhs);
                return cmp !== null;
            });
            if(diffData!=null){
                diffData = MergeDiff(diffData);
                diffData.some(o=>{
                    if(o.k == 'E'){
                        let keys = Object.keys(o.v);
                        changeProps.some(k=>{
                            if(keys.indexOf(k)>-1){
                                isSameModules = false;
                            }
                            return !isSameModules;
                        });
                        if(isSameModules && type=='module' && keys.indexOf('option')>-1){
                            isSameModules = map1[o._id].option.isHideFormula == o.v.option.isHideFormula && this.getDiff(map1[o._id].option.input, o.v.option.input, 'input') && this.getDiff(map1[o._id].option.output, o.v.option.output, 'output');
                        }
                    }else{
                        isSameModules = false;
                    }
                    return !isSameModules;
                });
            }
            return isSameModules;
        }

        paint(modules, stageActions = {}, moduleActions = {}, inputActions = {}, outputActions = {}, debugActions = {}, groupActions = {}) {
            if (!this.layer) {
                return [];
            }
            // let m = this.createModul(modules, moduleActions, stageActions);
            let t = this.createOutputGroup(modules, groupActions, stageActions);
            let p = this.createInAndOut(modules, inputActions, outputActions, stageActions, moduleActions, groupActions);
            stageActions.updateModules(modules);
            // let l = this.createLines(modules);
            return [...t, ...p];
        }

        domResize() {
            if($(this.elements.domWrap).closest('.painterViewActive').length==0){
                this.isResized = false;
                return;
            }
            if(this.resizeTimer){
                clearTimeout(this.resizeTimer);
            }
            this.resizeTimer = setTimeout(()=>{
                this.resize(this.props.modules);
                this.resizeTimer = undefined;
            },300);
        }

        domKeyDown(e) {
            if(!this.isInSketchpad){
                return;
            }
            this.props.stageActions.stageKeyDown&&this.props.stageActions.stageKeyDown(e);
        }

        createModul(modules, actions = {}, stageActions = {}) {
            let _this = this;
            const {
                moduleClose,
                moduleConfig,
                moduleSelect,
                moduleDragStart,
                moduleDragEnd,
                moduleMouseOver,
                moduleMouseOut,
                moduleMouseEnter,
                moduleMouseLeave
            } = actions;
            const { stageDragEnd, updateInputOutputLoc, updateLoc } = stageActions;
            let result = [],
                scale = this.scale;

            //生成策略模块
            modules.forEach((module, i) => {
                let block = new SketchpadChild(module);
                //策略模块
                result.push(h(GShapeGroup, {
                    id: module['_id'],
                    key: module['_id'],
                    type: 'module',
                    x: module.loc.x,
                    y: module.loc.y,
                    width: module.loc.w,
                    height: module.loc.h,
                    draggable: true,
                    store: module,
                    block: block,
                    isSelected: this.props.selectedIds.indexOf(module['_id']) > -1,
                    onDragStart: linkEvent(this.bd, moduleDragStart),
                    onDragEnd: moduleDragEnd,
                    onMouseOver: moduleMouseOver,
                    onMouseOut: moduleMouseOut,
                    onMouseEnter: moduleMouseEnter,
                    onMouseLeave: moduleMouseLeave,
                    customEvent: {
                        close: moduleClose,
                        config: linkEvent(module['_id'], moduleConfig),
                        select: moduleSelect,
                        updateLoc: updateLoc,
                        stageDragEnd: stageDragEnd
                    }
                }));
                this.bd.add(block);
                //对齐线
                result.push(h(GAlignmentLineGroup, {
                    id: 'alignmentLine_' + module['_id'],
                    key: 'alignmentLine_' + module['_id'],
                    x: module.loc.x,
                    y: module.loc.y,
                    w: this.WIDTH / this.scale,
                    h: this.HEIGHT / this.scale,
                    width: module.loc.w,
                    height: module.loc.h,
                    onUpdate(e) {
                        let attrs = {
                            x: e.date.store.loc.x,
                            y: e.date.store.loc.y,
                            w: _this.WIDTH / _this.scale,
                            h: _this.HEIGHT / _this.scale,
                            width: e.date.store.loc.w,
                            height: e.date.store.loc.h,
                        };
                        let left = this.find('.left')[0],
                            right = this.find('.right')[0],
                            top = this.find('.top')[0],
                            bottom = this.find('.bottom')[0];
                        left.points([attrs.x, attrs.y-attrs.h, attrs.x, attrs.y+attrs.h]);
                        right.points([attrs.x + attrs.width, attrs.y-attrs.h, attrs.x + attrs.width, attrs.y+attrs.h]);
                        top.points([attrs.x-attrs.w, attrs.y, attrs.x+attrs.w, attrs.y]);
                        bottom.points([attrs.x-attrs.w, attrs.y + attrs.height, attrs.x+attrs.w, attrs.y + attrs.height]);
                        this.parent.draw();
                    }
                }));
            });
            return result;
        }
        createOutputGroup(modules, actions = {}, stageActions = {}) {
            let _this = this;
            const {
                groupSelect,
                moduleDragStart,
                groupDragEnd,
                moduleMouseOver,
                moduleMouseOut,
                moduleMouseEnter,
                moduleMouseLeave
            } = actions;
            const { stageDragEnd, updateInputOutputLoc, updateLoc } = stageActions;
            let result = [],
                scale = this.scale;

            //生成策略模块
            let groupsWithoutLocArr = [];
            modules.forEach((module, i) => {
                module.option.groups = module.option.groups||[];
                let groupsWithoutLoc = [];
                module.option.groups.forEach(group=>{
                    // let id = group._id + '_' + module['_id'];
                    // let block = new SketchpadChild(group, 'group', id);
                    
                    if (group.loc == undefined) { //收集没有loc的输入并跳过生成 
                        groupsWithoutLoc.push(group);
                        return;
                    }
                    result.push(createTypeModule.bind(this)(group, module));
                    //策略模块
                    // result.push(h(GGroupShape, {
                    //     id: id,
                    //     key: id,
                    //     type: 'group',
                    //     name: 'group_' + module['_id'] + '_'+group.value,
                    //     x: group.loc.x,
                    //     y: group.loc.y,
                    //     width: group.loc.w,
                    //     height: group.loc.h,
                    //     draggable: true,
                    //     store: group,
                    //     block: block,
                    //     isSelected: this.props.selectedIds.indexOf(group['_id']) > -1,
                    //     onDragStart: linkEvent(this.bd, moduleDragStart),
                    //     onDragEnd: groupDragEnd,
                    //     onMouseOver: moduleMouseOver,
                    //     onMouseOut: moduleMouseOut,
                    //     onMouseEnter: moduleMouseEnter,
                    //     onMouseLeave: moduleMouseLeave,
                    //     customEvent: {
                    //         select: groupSelect,
                    //         updateLoc: updateLoc,
                    //         stageDragEnd: stageDragEnd
                    //     }
                    // }));
                    // this.bd.add(block);
                });
                groupsWithoutLocArr.push(groupsWithoutLoc);
                //对齐线
                // result.push(h(GAlignmentLineGroup, {
                //     id: 'alignmentLine_' + module['_id'],
                //     key: 'alignmentLine_' + module['_id'],
                //     x: module.loc.x,
                //     y: module.loc.y,
                //     w: this.WIDTH / this.scale,
                //     h: this.HEIGHT / this.scale,
                //     width: module.loc.w,
                //     height: module.loc.h,
                //     onUpdate(e) {
                //         let attrs = {
                //             x: e.date.store.loc.x,
                //             y: e.date.store.loc.y,
                //             w: _this.WIDTH / _this.scale,
                //             h: _this.HEIGHT / _this.scale,
                //             width: e.date.store.loc.w,
                //             height: e.date.store.loc.h,
                //         };
                //         let left = this.find('.left')[0],
                //             right = this.find('.right')[0],
                //             top = this.find('.top')[0],
                //             bottom = this.find('.bottom')[0];
                //         left.points([attrs.x, attrs.y-attrs.h, attrs.x, attrs.y+attrs.h]);
                //         right.points([attrs.x + attrs.width, attrs.y-attrs.h, attrs.x + attrs.width, attrs.y+attrs.h]);
                //         top.points([attrs.x-attrs.w, attrs.y, attrs.x+attrs.w, attrs.y]);
                //         bottom.points([attrs.x-attrs.w, attrs.y + attrs.height, attrs.x+attrs.w, attrs.y + attrs.height]);
                //         this.parent.draw();
                //     }
                // }));
            });
            //无loc输入输出生成
            modules.forEach((module, index) => {
                let block = this.bd.findBlockById(module['_id']);
                let groupsWithoutLoc = groupsWithoutLocArr[index];
                
                let sortLoop = (block, num, start, data, createFn, type) => {
                    const N = 20;
                    let newInputsLoc;
                    let m;
                    switch(block.type){
                        case 'group':
                            m = Object.assign({},block.opt,{_id: block.id});
                            break;
                        case 'modular':
                            m = Object.assign({},block.opt);
                            break;
                    }
                    if (num <= N) {
                        newInputsLoc = this.bd.createSortInfo(block, num, type);
                        newInputsLoc.forEach((loc, i) => {
                            data[i + start].loc = loc;
                            result.push(createFn.bind(this)(data[i + start], m, index));
                        });
                    } else {
                        newInputsLoc = this.bd.createSortInfo(block, N, type);
                        newInputsLoc.forEach((loc, i) => {
                            data[i + start].loc = loc;
                            result.push(createFn.bind(this)(data[i + start], m, index));
                        });
                        sortLoop(block, num - N, start + N, data, createFn, type);
                    }
                };

                //策略模块输入参数默认位置生成
                sortLoop(block, groupsWithoutLoc.length, 0, groupsWithoutLoc, createTypeModule, 'group');

                
            });
            function createTypeModule(group, module){
                let id = group._id + '_' + module['_id'];
                let block = new SketchpadChild(group, 'group', id);
                this.bd.add(block);
                let isSelected = this.props.selectedIds.indexOf(group._id) > -1;
                return (h(GGroupShape, {
                    id: id,
                    key: id,
                    name: 'group_' + module['_id'] + '_'+group.value,
                    type: 'group',
                    x: group.loc.x,
                    y: group.loc.y,
                    width: group.loc.w,
                    height: group.loc.h,
                    draggable: true,
                    store: group,
                    block: block,
                    isSelected: isSelected,
                    onDragStart: linkEvent(this.bd, moduleDragStart),
                    onDragEnd: groupDragEnd,
                    onMouseOver: moduleMouseOver,
                    onMouseOut: moduleMouseOut,
                    onMouseEnter: moduleMouseEnter,
                    onMouseLeave: moduleMouseLeave,
                    customEvent: {
                        select: groupSelect,
                        updateLoc: updateLoc,
                        stageDragEnd: stageDragEnd
                    }
                }));
            }
            return result;
        }
        createInAndOut(modules, inputActions, outputActions, stageActions, moduleActions, groupActions) {
            const {
                groupSelect,
                moduleDragStart,
                groupDragEnd,
                moduleMouseOver,
                moduleMouseOut,
                moduleMouseEnter,
                moduleMouseLeave
            } = groupActions;
            const { moduleSelect } = moduleActions;
            const {
                inputMouseEnter,
                inputMouseLeave,
                putMouseOver,
                putMouseOut,
                inputDragStart,
                inputDragMove,
                inputDragEnd,
                changeValue,
            } = inputActions;
            const {
                outputToInput,
                outputMouseEnter,
                outputMouseLeave,
                outputDragStart,
                outputDragMove,
                outputDragEnd,
            } = outputActions;
            const { stageDragEnd, updateInputOutputLoc, updateLoc } = stageActions;
            let result = [];
            let inputNameSet = new Set(),
                outputNameSet = new Set(),
                moduleIdsSet = new Set(),
                outputIdsSet = new Set();
            let outputArr = [],
                inputArr = [];
            let scale = this.scale;
            let needGroupOutput = [];
            //配置参数
            let valueList = this.state.strategy && this.state.strategy.value.find(o => o._id == this.props.selectedValueId);
            let inputIdWithoutValueSet = new Set(),
                outputIdWithoutValueSet = new Set();
            if(valueList){
                for(let moduleId in valueList.list){
                    let m = valueList.list[moduleId];
                    for(let inputId in m){
                        if(m[inputId] == 'None' || m[inputId] == undefined){
                            inputIdWithoutValueSet.add(inputId);
                        }
                    }
                }
            }
            //name检测
            const rename = function(name, num, set) {
                if (set.has(name)) {
                    let arr = name.split('_'),
                        last = parseInt(arr[arr.length - 1]);;
                    if (isNaN(last)) {
                        arr.push(++num);
                    } else {
                        num = ++last;
                        arr[arr.length - 1] = num;
                    }
                    name = arr.join('_');
                    return rename(name, num, set);
                } else {
                    set.add(name);
                    return name;
                }
            };


            //生成输出分组
            let moduleMap = {};
            modules.forEach(module=>{
                let groupTypesAll = [];
                let groupTypesNow =  [];
                module.option.groups = module.option.groups || [];
                module.option.output.forEach(output => {
                    groupTypesAll.push((output.option && output.option.consequence) == undefined?'undefined':output.option.consequence);
                });
                module.option.groups.forEach(group=>{
                    if(group.type=='consequence'){
                        groupTypesNow.push(group.value);
                    }
                });
                let noFindTypes = groupTypesAll.filter(v=>groupTypesNow.indexOf(v)<0);
                let destroyTypes = groupTypesNow.filter(v=>groupTypesAll.indexOf(v)<0);
                moduleMap[module._id] = {
                    noFindTypes: new Set(noFindTypes),
                }
                new Set(destroyTypes).forEach(v=>{
                    let index = module.option.groups.findIndex(group=>group.type=='consequence'&&group.value==v);
                    module.option.groups.splice(index,1);
                    this.isNeedUpdate = true;
                })
            });
            
            //生成策略模块的输出
            modules.forEach((module, i) => {
                moduleIdsSet.add(module['_id']);
                let block = this.bd.findBlockById(module['_id']);
                let outputsWithoutLoc = [];
                outputNameSet.clear();
                //生成策略模块输出参数
                module.option.output.forEach((output) => {
                    if (output.loc == undefined) { //收集没有loc的输出并跳过生成 
                        outputsWithoutLoc.push(output);
                        return;
                    }
                    if(output.option && output.option.consequence != undefined){
                        let b =  this.bd.find({
                            'type': 'group',
                            'opt.type': 'consequence',
                            'opt.value': parseInt(output.option.consequence),
                            'child.id': module._id
                        })[0];
                        if(b){
                            result.push(createOutput.bind(this)(output, Object.assign({},b.opt,{_id: b.id})));
                        }else{
                            needGroupOutput.push({
                                moduleId: module._id,
                                output
                            });
                        }
                        return;
                    }
                    result.push(createOutput.bind(this)(output, module));
                });

                outputArr.push(outputsWithoutLoc);
            });

            //生成策略模块的输入
            modules.forEach((module, index) => {
                let block = this.bd.findBlockById(module['_id']);
                let inputsWithoutLoc = [];
                inputNameSet.clear();
                //生成策略模块输入参数
                module.option.input.forEach((input, i) => {
                    if (input.loc == undefined) { //收集没有loc的输入并跳过生成 
                        inputsWithoutLoc.push(input);
                        return;
                    }
                    result.push(createInput.bind(this)(input, module, index));
                });

                inputArr.push(inputsWithoutLoc);
            });

            //智能拆分 暂时不需要
            var groupSplit = function(num, num2 = 0, start = 0, data) { //拆分过长的输入
                num2++;
                let result = this.bd.createSortInfo(data.block, num - num2, data.type); //排列
                if (result.length > 0) {
                    result.forEach((loc, i) => {
                        data.inputsWithoutLoc[i + start].loc = loc;
                        createInput.bind(this)(data.inputsWithoutLoc[i + start], data.module, data.index);
                    });
                    groupSplit.bind(this)(num2, -1, result.length, data);
                } else {
                    if (num2 <= num) {
                        groupSplit.bind(this)(num, num2, start, data);
                    }
                }
            }

            //无loc输入输出生成
            modules.forEach((module, index) => {
                let block = this.bd.findBlockById(module['_id']);
                let outputsWithoutLoc = outputArr[index],
                    inputsWithoutLoc = inputArr[index];

                let noFindTypes = moduleMap[module._id].noFindTypes;
                let groups = {
                    'undefined': []
                };
                outputsWithoutLoc.forEach(out=>{
                    let type = (out.option && out.option.consequence) == undefined?'undefined':out.option.consequence;
                    groups[type] = groups[type]||[];
                    groups[type].push(out);
                });
                
                let sortLoop = (block, num, start, data, createFn, type) => {
                    const N = 20;
                    let newInputsLoc;
                    let m;
                    switch(block.type){
                        case 'group':
                            m = Object.assign({},block.opt,{_id: block.id});
                            break;
                        case 'modular':
                            m = Object.assign({},block.opt);
                            break;
                    }
                    if (num <= N) {
                        newInputsLoc = this.bd.createSortInfo(block, num, type);
                        newInputsLoc.forEach((loc, i) => {
                            data[i + start].loc = loc;
                            result.push(createFn.bind(this)(data[i + start], m, index));
                        });
                    } else {
                        newInputsLoc = this.bd.createSortInfo(block, N, type);
                        newInputsLoc.forEach((loc, i) => {
                            data[i + start].loc = loc;
                            result.push(createFn.bind(this)(data[i + start], m, index));
                        });
                        sortLoop(block, num - N, start + N, data, createFn, type);
                    }
                };

                //策略模块输入参数默认位置生成
                sortLoop(block, inputsWithoutLoc.length, 0, inputsWithoutLoc, createInput, 'input');

                //策略模块输出组默认位置生成
                let noFindGroup = [];
                noFindTypes.forEach(key=>{
                    if(key == 'undefined'){
                        return;
                    }
                    noFindGroup.push({
                        _id: ObjectId(),
                        type: 'consequence',
                        value: key,
                    });
                });
                sortLoop(block, noFindGroup.length, 0, noFindGroup, createTypeModule, 'group');
                //该输入阻output生成
                needGroupOutput.forEach((obj)=>{
                    const {moduleId, output} = obj;
                    let b =  this.bd.find({
                        'type': 'group',
                        'opt.type': 'consequence',
                        'opt.value': parseInt(output.option.consequence),
                        'child.id': moduleId
                    })[0];
                    if(b){
                        result.push(createOutput.bind(this)(output, Object.assign({},b.opt,{_id: b.id})));
                    }
                });
                //策略模块输出参数默认位置生成
                for(let key in groups){
                    let outArr = groups[key];
                    let block;
                    if(key == 'undefined'){
                        continue;
                    }else{
                        block = this.bd.find({
                            'type': 'group',
                            'opt.type': 'consequence',
                            'opt.value': parseInt(key),
                            'child.id': module._id
                        })[0];
                    }
                    sortLoop(block, outArr.length, 0, outArr, createOutput, 'output');
                }
                sortLoop(block, groups['undefined'].length, 0, groups['undefined'], createOutput, 'output');
            });

            function createTypeModule(group, module){
                let stateModule = modules.find(v=>module['_id'] == v._id);
                stateModule.option.groups = stateModule.option.groups||[];
                stateModule.option.groups.push(group);
                let id = group._id + '_' + module['_id'];
                let block = new SketchpadChild(group, 'group', id);
                this.bd.add(block);
                let isSelected = this.props.selectedIds.indexOf(group._id) > -1;
                return (h(GGroupShape, {
                    id: id,
                    key: id,
                    name: 'group_' + module['_id'] + '_'+group.value,
                    type: 'group',
                    x: group.loc.x,
                    y: group.loc.y,
                    width: group.loc.w,
                    height: group.loc.h,
                    draggable: true,
                    store: group,
                    block: block,
                    isSelected: isSelected,
                    onDragStart: linkEvent(this.bd, moduleDragStart),
                    onDragEnd: groupDragEnd,
                    onMouseOver: moduleMouseOver,
                    onMouseOut: moduleMouseOut,
                    onMouseEnter: moduleMouseEnter,
                    onMouseLeave: moduleMouseLeave,
                    customEvent: {
                        select: groupSelect,
                        updateLoc: updateLoc,
                        stageDragEnd: stageDragEnd
                    }
                }));
            }

            function createOutput(output, module) {
                // output.name = rename(output.name, 0, outputNameSet);
                outputIdsSet.add(output._id);
                let id = output._id + '_' + module['_id'];
                let block = new SketchpadChild(output, 'output', id);
                this.bd.add(block);
                let isSelected = this.props.selectedIds.indexOf(output._id) > -1;
                return (h(GOutputGroup, {
                    id: id,
                    key: id,
                    type: 'output',
                    name: 'output_' + module['_id'] + ' ' + output._id + (isSelected?' selected':''),
                    x: output.loc.x,
                    y: output.loc.y,
                    width: output.loc.w,
                    height: output.loc.h,
                    draggable: true,
                    store: output,
                    block: block,
                    isSelected: isSelected,
                    onDragStart: linkEvent(this.bd, outputDragStart),
                    onDragMove: outputDragMove,
                    onDragEnd: outputDragEnd,
                    onMouseEnter: outputMouseEnter,
                    onMouseLeave: outputMouseLeave,
                    onMouseOver: putMouseOver,
                    onMouseOut: putMouseOut,
                    customEvent: {
                        updateLoc: updateLoc,
                        outputToInput: outputToInput,
                        stageDragEnd: stageDragEnd,
                        changeValue: changeValue,
                        select: moduleSelect,
                    }
                }));

            }
            //创建输入参数
            function createInput(input, module, index) {
                let block;
                //该输入参数为引用其他模块的输出时
                if (input.type == enumerators.moduleInputOutputTypes.OTHER_MODULES && input.refModuleId && moduleIdsSet.has(input.refModuleId) && outputIdsSet.has(input.refOutputId)) {
                    block = this.bd.find({
                        'opt._id': input.refOutputId
                    })[0];
                    block && block.toBeInput(module['_id']);
                    //创建一个不可见的输入参数 可隐藏
                    let id = input._id + '_' + module['_id'];
                    let isSelected = this.props.selectedIds.indexOf(input._id) > -1;
                    return (h(GInputGroup, {
                        id: id,
                        key: id,
                        type: 'input',
                        name: 'input_' + module['_id'] + ' ' + input._id + (isSelected?' selected':''),
                        x: input.loc.x,
                        y: input.loc.y,
                        width: input.loc.w,
                        height: input.loc.h,
                        draggable: true,
                        visible: false,
                        store: input,
                        block: block,
                        isSelected: isSelected,
                        showDs: valueList && valueList.list[module._id] && valueList.list[module._id][input._id] || undefined,
                        onDragStart: linkEvent(this.bd, inputDragStart),
                        onDragMove: inputDragMove,
                        onDragEnd: inputDragEnd,
                        onMouseEnter: inputMouseEnter,
                        onMouseLeave: inputMouseLeave,
                        customEvent: {
                            // toOutput: toOutput,
                            outputToInput: outputToInput,
                            updateLoc: updateLoc,
                            stageDragEnd: stageDragEnd,
                            select: moduleSelect,
                        }
                    }));
                } else if( module.option.isHideFormula=='hide' && input.option &&  (input.option.type == enumerators.fuzzyRuleInputOutputTypes.FORMULA || input.option.type == enumerators.fuzzyRuleInputOutputTypes.SERIESANALYSISCODE)){
                    
                } else {
                    // input.name = rename(input.name, 0, inputNameSet);
                    let id = input._id + '_' + module['_id'];
                    block = new SketchpadChild(input, 'input', id);
                    this.bd.add(block);
                    let isSelected = this.props.selectedIds.indexOf(input._id) > -1;
                    return (h(GInputGroup, {
                        id: id,
                        key: id,
                        type: 'input',
                        name: 'input_' + module['_id'] + ' ' + input._id + (isSelected?' selected':''),
                        x: input.loc.x,
                        y: input.loc.y,
                        width: input.loc.w,
                        height: input.loc.h,
                        draggable: true,
                        store: input,
                        block: block,
                        isSelected: isSelected,
                        showDs: valueList && valueList.list[module._id] && valueList.list[module._id][input._id] || undefined,
                        onDragStart: linkEvent(this.bd, inputDragStart),
                        onDragMove: inputDragMove,
                        onDragEnd: inputDragEnd,
                        onMouseEnter: inputMouseEnter,
                        onMouseLeave: inputMouseLeave,
                        onMouseOver: putMouseOver,
                        onMouseOut: putMouseOut,
                        customEvent: {
                            // toOutput: toOutput,
                            outputToInput: outputToInput,
                            updateLoc: updateLoc,
                            stageDragEnd: stageDragEnd,
                            select: moduleSelect,
                        }
                    }));
                }

            }
            return result;
        }
        createLines(modules) {
            //创建连线
            let result = [];
            let allLines = this.bd.getAllLines();
            let lineIds = [];
            allLines.forEach((lines) => {
                lineIds = lineIds.concat(lines.lines.map(v=>v.id));
                let idArr = lines.id.split('_');
                let isSelected = (function(id, selectedIds) {
                    let idArr = id.split('_');
                    return selectedIds.indexOf(idArr[0]) > -1 || selectedIds.indexOf(idArr[1]) > -1
                })(lines.id, this.props.selectedIds);
                result.push(h(GArrowGroup, {
                    id: 'line_' + lines.id,
                    key: 'line_' + lines.id,
                    name: 'GArrow line_' + idArr[0] + (idArr[1]?' line_'+idArr[1]:''),
                    x: 0,
                    y: 0,
                    store: lines,
                    selectedIds: this.props.selectedIds,
                    isSelected: isSelected,
                    onUpdate(e) {
                        let oldIds = new Set(this.attrs.store.lines.map(l=>l.id)),
                            newIds = new Set(e.date.lines.map(l=>l.id));
                        let deleteIds = new Set([...oldIds].filter(x => !newIds.has(x))),
                            addIds = new Set([...newIds].filter(x => !oldIds.has(x)));

                        e.date.lines.forEach((line) => {
                            var target = this.find('#' + line.id)[0] || Array.from(this.children).find(c=>c.attrs.id == line.id);
                            if (target) {
                                target.points(line.points);
                            } else { //有增加
                                let isSelected2 = this.attrs.selectedIds && this.attrs.selectedIds.indexOf(line.id.split('_')[1])>=0;
                                this.add(new Konva.Line({
                                    id: line.id,
                                    name: 'line ' + line.id.split('_')[0] + ' oneLine_' + line.id.split('_')[1],
                                    points: line.points,
                                    stroke: (isSelected || isSelected2) ? '#f6a405' : '#6f7777',
                                    strokeWidth: 1,
                                    lineCap: 'round',
                                    lineJoin: 'round'
                                }));
                            }
                        });
                        this.children.forEach(child=>{
                            if(deleteIds.has(child.attrs.id)){
                                child.destroy();
                            }
                        });
                        this.parent.draw();
                    }
                }));
            });
            let lineLayer = this.layer&&Array.from(this.layer.parent.children).find(v=>v.attrs.id == 'lineLayer');
            lineLayer&&Array.from(lineLayer.children).forEach(v=>{
                v.children.forEach(c=>{
                    if(lineIds.indexOf(c.attrs.id)<0){
                        c.destroy();
                    }
                });
            })&&lineLayer.draw();
            return result;
        }
        createLeftBtnGroup(actions) {
            let searchList = [];
            let cancelHighLight = (layer)=>{
                searchList.forEach(v=>{
                    v.fire('nametexthighlight',{isHighLight:false});
                });
                searchList = [];
                layer.draw();
            }
            let highLight = (layer)=>{
                searchList.forEach(v=>{
                    v.fire('nametexthighlight',{isHighLight:true});
                });
                layer.draw();
            }
            let btnGroup = [
                h(Search,{
                    placeholder:"Search",
                    style:{ 
                        width: '120px',
                    },
                    onSearch:(searchValue)=>{
                        let layer = this.stage.children[1];
                        let nameTexts = layer.find('.nameText');
                        cancelHighLight(layer);
                        if(searchValue){
                            nameTexts.forEach(t=>{
                                if(t.text().indexOf(searchValue)>-1){
                                    searchList.push(t);
                                }
                            });
                            highLight(layer);
                        }
                    }
                }),
                h(Button, {
                    style:{
                        display: this.props.tagResults.length>0?'inline-block':'none'
                    },
                    onClick: function(){
                        this.refs.ShowTagsTableModal.show();
                    }.bind(this)
                }, [I18n.resource.sketchpad.MODIFY_THE_MATCH])
            ];

            return (
                h('div', {
                    className: 'btn-group fl',
                    style: {
                        border: 'none',
                        padding: '0',
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: '999'
                    }
                }, btnGroup)
            )
        }
        createBtnGroup(data, actions) { //创建按钮组
            let stage = this.stage,
                layer = this.layer;
            const { doBatchConfig, doExport, doDebug, doSave, doBack, doConfigParams, selectedValueChange, strategyPreTasksChange } = actions;
            let list = this.state.strategy && this.state.strategy.value || []; //参数配置列表

            let btnGroup = [
                h(Button, {
                    onClick: ()=>{
                        let diff = this.props.stageActions.isDiffData(this.props.modules);
                        const openFn = ()=>{
                            this.props.btnActions.gotoFaultsManger();
                        };
                        if(diff){
                            confirm({
                                title: I18n.resource.confirm.BE_SURE_BACK,
                                content: '',
                                okText: I18n.resource.confirm.OKTEXT,
                                cancelText: I18n.resource.confirm.CANCELTEXT,
                                onOk() {
                                    openFn();
                                },
                                onCancel() {
                                
                                },
                            });
                        }else{
                            openFn();
                        }
                        
                    }
                }, ['Fault Manager']),
                h(Button, {
                    onClick: ()=>{
                        let diff = this.props.stageActions.isDiffData(this.props.modules);
                        const openFn = ()=>{
                            this.refs.exportTemplateModal.updateModules(this.props.modules);
                            this.refs.exportTemplateModal.showModal(true);
                        };
                        if(diff){
                            confirm({
                                title: I18n.resource.confirm.BE_SURE_EXPORT,
                                content: '',
                                okText: I18n.resource.confirm.OKTEXT,
                                cancelText: I18n.resource.confirm.CANCELTEXT,
                                onOk() {
                                    openFn();
                                },
                                onCancel() {
                                
                                },
                            });
                        }else{
                            openFn();
                        }
                        
                    }
                }, [I18n.resource.templateModal.TITLE]),
                h(FrontBtn, { //前置策略
                    ref: 'FrontBtn',
                    onClick: doConfigParams,
                    strategy: this.state.strategy,
                    strategyList: this.state.strategyList,
                    strategyPreTasksChange: strategyPreTasksChange
                }),
                h(Select, { //当前配置选择
                    style: { minWidth: '80px', marginLeft: '10px' },
                    value: list.map(obj => obj._id).indexOf(this.props.selectedValueId) > -1 ? this.props.selectedValueId : '',
                    onChange: selectedValueChange
                }, list.map(obj => h(Option, { value: obj._id }, [obj.name]))),
                h(Button, {
                    onClick: doConfigParams
                }, [I18n.resource.sketchpad.CONFIGURATION_PARAMETER]),
                h(Button, {
                    onClick: doDebug
                }, [I18n.resource.sketchpad.DEBUG]),
                h(SaveBtn, { //保存
                    doSave: doSave
                }),
                h(Button, {
                    onClick: ()=>{
                        let diff = this.props.stageActions.isDiffData(this.props.modules);
                        if(diff){
                            confirm({
                                title: I18n.resource.confirm.BE_SURE_BACK,
                                content: '',
                                okText: I18n.resource.confirm.OKTEXT,
                                cancelText: I18n.resource.confirm.CANCELTEXT,
                                onOk() {
                                    doBack();
                                },
                                onCancel() {
                                
                                },
                            });
                        }else{
                            doBack();
                        }
                    }
                }, [I18n.resource.sketchpad.RETURN])
            ];

            return (
                h('div', {
                    className: 'btn-group fr',
                    style: {
                        border: 'none',
                        padding: '0',
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        zIndex: '999'
                    }
                }, btnGroup)
            )
        }

        refDefine(name) {
            let elements = this.elements = this.elements || {};

            return function(dom) {
                elements[name] = dom;
            };
        }

        resize(modules) {
            if (modules.length < 1) { //空白画板的resize
                let dW = 1366,
                    dH = 768;

                let windowStyle = window.getComputedStyle(this.elements.domWrap);
                let windowW = parseFloat(windowStyle.width),
                    windowH = parseFloat(windowStyle.height);
                let scaleX = windowW / dW,
                    scaleY = windowH / dH,
                    scale = 1;

                if (scaleX < scaleY) {
                    scale = scaleX;
                } else {
                    scale = scaleY;
                }
                if (scaleX > 1 && scaleY > 1) {
                    scale = 1;
                }
                this.stage.setWidth(windowW);
                this.stage.setHeight(windowH);
                this.stage.scaleX(scale);
                this.stage.scaleY(scale);
                this.stage.draw();

                this.scale = scale;
                this.WIDTH = windowW;
                this.HEIGHT = windowH;
                this.bd.resize({
                    width: dW,
                    height: dH,
                    scale: scale,
                    layer: this.layer
                });
                this.setState({
                    scale: scale
                });
                return;
            }
            let xArr = [],
                yArr = [],
                xArr2 = [],
                yArr2 = [];
            modules.forEach((module) => {
                xArr.push(module.loc.x);
                yArr.push(module.loc.y);
                xArr2.push(module.loc.x + module.loc.w);
                yArr2.push(module.loc.y + module.loc.h);
                module.option.input.forEach((input) => {
                    if (!input.loc) {
                        return;
                    }
                    xArr.push(input.loc.x);
                    yArr.push(input.loc.y);
                    xArr2.push(input.loc.x + input.loc.w);
                    yArr2.push(input.loc.y + input.loc.h);
                });
                module.option.output.forEach((output) => {
                    if (!output.loc) {
                        return;
                    }
                    xArr.push(output.loc.x);
                    yArr.push(output.loc.y);
                    xArr2.push(output.loc.x + output.loc.w);
                    yArr2.push(output.loc.y + output.loc.h);
                });
            });
            let minX = Math.min(...xArr),
                minY = Math.min(...yArr),
                maxX = Math.max(...xArr2),
                maxY = Math.max(...yArr2);
            let dW = maxX - minX,
                dH = maxY - minY;
            let paddingX = Math.min(dW * 0.1, 100),
                paddingY = Math.min(dH * 0.1, 100);
            dW += paddingX;
            dH += paddingY;

            let windowStyle = window.getComputedStyle(this.elements.domWrap);
            let windowW = parseFloat(windowStyle.width),
                windowH = parseFloat(windowStyle.height);
            let scaleX = windowW / dW,
                scaleY = windowH / dH,
                scale = 1,
                offsetX = 0,
                offsetY = 0;

            if (scaleX < scaleY) {
                scale = scaleX;
                offsetY = (windowH / scale - dH) / 2 - minY + paddingY / 2;
                offsetX = -minX + paddingX / 2;
            } else {
                scale = scaleY;
                offsetX = (windowW / scale - dW) / 2 - minX + paddingX / 2;
                offsetY = -minY + paddingY / 2;
            }
            if (scaleX > 1 && scaleY > 1) {
                scale = 1;
                offsetX = (windowW / scale - dW) / 2 - minX + paddingX / 2;
                offsetY = (windowH / scale - dH) / 2 - minY + paddingY / 2;
            }
            this.stage.setWidth(windowW);
            this.stage.setHeight(windowH);
            this.stage.scaleX(scale);
            this.stage.scaleY(scale);
            this.stage.offsetX(-offsetX);
            this.stage.offsetY(-offsetY);
            this.stage.draw();

            this.scale = scale;
            this.WIDTH = windowW;
            this.HEIGHT = windowH;
            this.bd.resize({
                width: dW,
                height: dH,
                scale: scale,
                layer: this.layer
            });
            this.setState({
                scale: scale
            });
        }
    }

    function Sketchpad(props) {
        const {
            // props
            strategy,
            modules,
            selectedIds,
            selectedValueId,
            strategyList,
            outLinkData,
            showAddOutLinkModal,
            targetModuleId,
            bShowSpin,
            tagResults,
            // actions
            doBatchConfig,
            doExport,
            doDebug,
            doSave,
            doBack,
            doConfigParams,
            stageDrop,
            stageDragMove,
            stageDragEnd,
            stageWheel,
            stageMouseDown,
            stageMouseUp,
            stageReload,
            stageKeyDown,
            stageClear,
            moduleClose,
            moduleConfig,
            moduleSelect,
            moduleMouseOver,
            moduleMouseOut,
            moduleMouseEnter,
            moduleMouseLeave,
            moduleDragStart,
            moduleDragEnd,
            inputMouseEnter,
            inputMouseLeave,
            inputDragStart,
            inputDragMove,
            inputDragEnd,
            outputToInput,
            outputMouseEnter,
            outputMouseLeave,
            outputDragStart,
            outputDragMove,
            outputDragEnd,
            groupDragEnd,
            groupSelect,
            putMouseOver,
            putMouseOut,
            updateInputOutputLoc,
            updateLoc,
            changeValue,
            selectedValueChange,
            strategyPreTasksChange,
            closeAddOutLinkModal,
            addOutLinkInputs,
            AddMatchingTagsParams,
            updateModules,
            isDiffData,
            refreshRulePanel,
            gotoFaultsManger
        } = props;
        return (
            h(Stage, {
                // props
                strategy,
                modules,
                selectedIds,
                selectedValueId,
                strategyList,
                outLinkData,
                showAddOutLinkModal,
                targetModuleId,
                bShowSpin,
                tagResults,
                AddMatchingTagsParams,
                // actions
                stageActions: {
                    stageDragMove,
                    stageDragEnd,
                    stageDrop,
                    stageWheel,
                    stageMouseDown,
                    stageMouseUp,
                    stageReload,
                    stageKeyDown,
                    stageClear,
                    updateLoc,
                    updateInputOutputLoc,
                    updateModules,
                    isDiffData
                },
                btnActions: {
                    doBatchConfig,
                    doExport,
                    doDebug,
                    doSave,
                    doBack,
                    doConfigParams,
                    selectedValueChange,
                    strategyPreTasksChange,
                    closeAddOutLinkModal,
                    addOutLinkInputs,
                    refreshRulePanel,
                    gotoFaultsManger,
                },
                moduleActions: {
                    moduleConfig,
                    moduleClose,
                    moduleSelect,
                    moduleMouseOver,
                    moduleMouseOut,
                    moduleMouseEnter,
                    moduleMouseLeave,
                    moduleDragStart,
                    moduleDragEnd,
                },
                inputActions: {
                    outputToInput,
                    inputMouseEnter,
                    inputMouseLeave,
                    inputDragStart,
                    inputDragMove,
                    inputDragEnd,
                    putMouseOver,
                    putMouseOut,
                },
                outputActions: {
                    outputToInput,
                    outputMouseEnter,
                    outputMouseLeave,
                    outputDragStart,
                    outputDragMove,
                    outputDragEnd,
                },
                groupActions:{
                    groupSelect,
                    moduleMouseOver,
                    moduleMouseOut,
                    moduleMouseEnter,
                    moduleMouseLeave,
                    moduleDragStart,
                    groupDragEnd,
                },
                debugActions: {
                    changeValue,
                    moduleMouseOver,
                    moduleMouseOut,
                    moduleMouseEnter,
                    moduleMouseLeave,
                    moduleSelect,
                    inputMouseEnter,
                    inputMouseLeave,
                    outputMouseEnter,
                    outputMouseLeave,
                    stageDrop
                }
            })
        );
    }
    exports.Sketchpad = Sketchpad;
    exports.Stage = Stage;
}));
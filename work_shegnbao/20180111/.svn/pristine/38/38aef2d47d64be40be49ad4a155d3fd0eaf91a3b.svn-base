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
            namespace('ReactKonva'),
            namespace('beop.strategy.components.Painter.GInputGroup'),
            namespace('beop.strategy.components.Painter.GOutputGroup'),
            namespace('beop.strategy.components.Painter.GShapeGroup'),
            namespace('beop.strategy.components.Painter.GGroupShape'),
            namespace('beop.strategy.components.Painter.GArrowGroup'),
            namespace('beop.strategy.components.Painter.GAlignmentLineGroup'),
            namespace('beop.strategy.components.Painter.Calculation'),
            namespace('beop.strategy.components.Stage'),
            namespace('beop.strategy.enumerators'),
            namespace('beop.strategy.components.modals.ShowTextModal'),
            namespace('beop.strategy.components.modals.ShowChartsModal'),
            namespace('beop.strategy.components.modals.HistoricalTableModal'),
            namespace('beop.strategy.components.modals.ThreeDimensionsViewModal')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd,
    Sketchpad,
    SketchpadToolbar,
    ModuleConfigPanel,
    ReactKonva, GInputGroup, GOutputGroup, GShapeGroup, GGroupShape, GArrowGroup, GAlignmentLineGroup, Calculation, Stage, enumerators,
    ShowTextModal,
    ShowChartsModal,
    HistoricalTableModal,
    ThreeDimensionsViewModal
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const { Input, Button, Modal, message } = antd;

    var SketchpadChild = Calculation.Child;

    class Layer extends React.Component{
        constructor(props, context) {
            super(props, context);
            this.bd = this.props.bd;
            this.scale = this.props.scale;
            const {modules, selectedIds, debugValue, tempDebugValue, showDs, selectedPutsId, runResult} = this.props;
            this.state = {
                modules,
                selectedIds,
                debugValue,
                tempDebugValue,
                showDs,
                selectedPutsId,
                runResult,
            };
            this.moduleSelect = this.moduleSelect.bind(this);
        }
        componentWillReceiveProps(props) {
            this.bd = props.bd;
            this.scale = props.scale;
            const {modules, selectedIds, debugValue, tempDebugValue, showDs, selectedPutsId, runResult} = props;
            this.setState({
                modules,
                selectedIds,
                debugValue,
                tempDebugValue,
                showDs,
                selectedPutsId,
                runResult,
            });
        }
        shouldComponentUpdate(nextprops, nextstate) {
            let isObjectValueEqual = (a={}, b={})=> {
                let aProps = Object.getOwnPropertyNames(a===null?{}:a);
                let bProps = Object.getOwnPropertyNames(b===null?{}:b);
            
                if (aProps.length != bProps.length) {
                    return false;
                }
                
                for (let i = 0; i < aProps.length; i++) {
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

            if(this.state.module==nextstate.module && this.state.selectedIds==nextstate.selectedIds && isObjectValueEqual(this.state.debugValue, nextstate.debugValue) && isObjectValueEqual(this.state.tempDebugValue, nextstate.tempDebugValue) && isObjectValueEqual(this.state.showDs,nextstate.showDs) && this.state.selectedPutsId==nextstate.selectedPutsId && isObjectValueEqual(this.state.runResult, nextstate.runResult) ){
                return false;
            }
            return true;
        }
        paint() {
            return this.createModul().concat(this.createOutputGroup()).concat(this.createInAndOut()).concat(this.createLines());
        }
        moduleSelect(selectedId, type, refOutputId) { //模块选中事件
            switch(type){
                case enumerators.moduleTypes.HISTORICAL_CURVE:
                    if(refOutputId && this.props.runResult){
                        let value = this.state.runResult[refOutputId];
                        this.props.showChartsModal(value);
                    }else{
                        message.warning(I18n.resource.message.DATA_EMPTY);
                    }
                    break;
                case enumerators.moduleTypes.TABLE:
                    if(refOutputId && this.props.runResult){
                        let value = this.state.runResult[refOutputId];
                        this.props.showTableModal(value);
                    }else{
                        message.warning(I18n.resource.message.DATA_EMPTY);
                    }
                    break;
                case enumerators.moduleTypes.THREE_DIMENSIONS_VIEW:
                    if(refOutputId && this.props.runResult){
                        let value = this.state.runResult[refOutputId];
                        this.props.showThreeDimensionsViewModal(value);
                    }else{
                        message.warning(I18n.resource.message.DATA_EMPTY);
                    }
                    break;
            }
            // let index = this.state.selectedIds.indexOf(selectedId);
            // let selectedIds = this.state.selectedIds.splice();
            // if (index > -1) { //已经是选中状态
            //     selectedIds.splice(index, 1);
            // } else { //不是选中状态
            //     selectedIds = [selectedId];
            // }
            // this.setState({
            //     selectedIds:selectedIds
            // });
        }
        createModul() {
            var doNth = function() {};
            var {
                moduleMouseOver,
                moduleMouseOut,
                moduleMouseEnter,
                moduleMouseLeave
            } = this.props.moduleActions;
            var result = [];
            //生成策略模块
            this.state.modules && this.state.modules.forEach((module, i) => {
                // this.valueArr[i] = this.valueArr[i] || {};
                var block = new SketchpadChild(module);
                var scale = this.scale;
                let isNeedClick = false;
                switch(module.type){
                    case enumerators.moduleTypes.HISTORICAL_CURVE:
                    case enumerators.moduleTypes.TABLE:
                    case enumerators.moduleTypes.THREE_DIMENSIONS_VIEW:
                        isNeedClick = true;
                        break;
                }
                result.push(h(GShapeGroup, {
                    id: module['_id'],
                    type: 'module',
                    x: module.loc.x,
                    y: module.loc.y,
                    width: module.loc.w,
                    height: module.loc.h,
                    draggable: false,
                    store: module,
                    block: block,
                    isSelected: this.state.selectedIds.indexOf(module['_id']) > -1,
                    onMouseOver: isNeedClick?moduleMouseOver:doNth,
                    onMouseOut: isNeedClick?moduleMouseOut:doNth,
                    onMouseEnter: isNeedClick?moduleMouseEnter:doNth,
                    onMouseLeave: isNeedClick?moduleMouseLeave:doNth,
                    customEvent: {
                        close: doNth,
                        config: doNth,
                        select: this.moduleSelect,
                        updateLoc: doNth,
                        stageDragEnd: doNth
                    }
                }));
                this.bd.add(block);

                result.push(h(GAlignmentLineGroup, {
                    id: 'alignmentLine_' + module['_id'],
                    x: module.loc.x,
                    y: module.loc.y,
                    width: module.loc.w,
                    height: module.loc.h,
                }));
            });
            return result;
        }
        createOutputGroup() {
            let _this = this;
            var doNth = function() {};
            let result = [],
                scale = this.scale;

            //生成策略模块
            this.state.modules && this.state.modules.forEach((module, i) => {
                module.option.groups = module.option.groups||[];
                module.option.groups.forEach(group=>{
                    let id = group._id + '_' + module['_id'];
                    let block = new SketchpadChild(group, 'group', id);
                    //策略模块
                    result.push(h(GGroupShape, {
                        id: id,
                        key: id,
                        type: 'group',
                        name: 'group_' + module['_id'] + '_'+group.value,
                        x: group.loc.x,
                        y: group.loc.y,
                        width: group.loc.w,
                        height: group.loc.h,
                        draggable: false,
                        store: group,
                        block: block,
                        isSelected: this.state.selectedIds.indexOf(group['_id']) > -1,
                        onDragStart: doNth,
                        onDragEnd: doNth,
                        onMouseOver: doNth,
                        onMouseOut: doNth,
                        onMouseEnter: doNth,
                        onMouseLeave: doNth,
                        customEvent: {
                            select: doNth,
                            updateLoc: doNth,
                            stageDragEnd: doNth
                        }
                    }));
                    this.bd.add(block);
                });
                
            });
            return result;
        }
        createInAndOut(isDebug, modules, inputActions, outputActions, stageActions) {
            var refMap = {};
            var doNth = function() {};
            var {
                inputMouseEnter,
                inputMouseLeave,
                putMouseOver,
                putMouseOut,
            } = this.props.inputActions;
            var {
                outputMouseEnter,
                outputMouseLeave,
            } = this.props.outputActions;
            var result = [];
            var inputNameSet = new Set(),
                outputNameSet = new Set(),
                moduleIdsSet = new Set(),
                outputIdsSet = new Set();
            var outputArr = [],
                inputArr = [];
            var scale = this.scale;
            //name检测
            var rename = function(name, num, set) {
                if (set.has(name)) {
                    var arr = name.split('_'),
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
            //生成input和output合并后的对应关系
            this.state.modules && this.state.modules.forEach((module, i)=>{
                module.option.input.forEach((input) => {
                    if (input.refOutputId) { 
                        refMap[input.refOutputId] = input._id;
                    }
                });
            });

            //生成输出分组
            let moduleMap = {};
            this.state.modules && this.state.modules.forEach(module=>{
                let groupTypesAll = [];
                let groupTypesNow =  [];
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
            this.state.modules && this.state.modules.forEach((module, i) => {
                moduleIdsSet.add(module['_id']);
                var block = this.bd.findBlockById(module['_id']);
                var outputsWithoutLoc = [];
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
                            return;
                        }
                    }
                    result.push(createOutput.bind(this)(output, module));
                });

                outputArr.push(outputsWithoutLoc);
            });

            //生成策略模块的输入
            this.state.modules && this.state.modules.forEach((module, index) => {
                var block = this.bd.findBlockById(module['_id']);
                var inputsWithoutLoc = [];

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
                    draggable: false,
                    store: group,
                    block: block,
                    isSelected: isSelected,
                    onDragStart: doNth,
                    onDragEnd: doNth,
                    onMouseOver: moduleMouseOver,
                    onMouseOut: moduleMouseOut,
                    onMouseEnter: moduleMouseEnter,
                    onMouseLeave: moduleMouseLeave,
                    customEvent: {
                        select: doNth,
                        updateLoc: doNth,
                        stageDragEnd: doNth
                    }
                }));
            }

            function createOutput(output, module) {
                // output.name = rename(output.name, 0, outputNameSet);
                outputIdsSet.add(output._id);
                var id = output._id + '_' + module['_id'];
                var block = new SketchpadChild(output, 'output', id);
                this.bd.add(block);
                return (h(GOutputGroup, {
                    id: id,
                    type: 'output',
                    name: 'output_' + module['_id'] + ' ' + output._id,
                    x: output.loc.x,
                    y: output.loc.y,
                    width: output.loc.w,
                    height: output.loc.h,
                    draggable: false,
                    store: output,
                    block: block,
                    value:this.state.runResult&&this.state.runResult[output._id],
                    isSelected: this.state.selectedPutsId.indexOf(output._id)>-1||this.state.selectedPutsId.indexOf(refMap[output._id])>-1,
                    onMouseEnter: outputMouseEnter,
                    onMouseLeave: outputMouseLeave,
                    customEvent: {
                        updateLoc: doNth,
                        outputToInput: doNth,
                        stageDragEnd: doNth,
                        changeValue: this.props.showChangeValueModal,
                        select: doNth,
                    }
                }));

            }

            function createInput(input, module, index) {
                var block;
                if (input.type == enumerators.moduleInputOutputTypes.OTHER_MODULES && input.refModuleId && moduleIdsSet.has(input.refModuleId) && outputIdsSet.has(input.refOutputId)) {
                    block = this.bd.find({
                        'opt._id': input.refOutputId
                    })[0];
                    block && block.toBeInput(module['_id']);
                } else {
                    // input.name = rename(input.name, 0, inputNameSet);
                    var id = input._id + '_' + module['_id'];
                    block = new SketchpadChild(input, 'input', id);
                    this.bd.add(block);
                    return (h(GInputGroup, {
                        id: id,
                        type: 'input',
                        name: 'input_' + module['_id'] + ' ' + input._id,
                        x: input.loc.x,
                        y: input.loc.y,
                        width: input.loc.w,
                        height: input.loc.h,
                        draggable: false,
                        store: input,
                        block: block,
                        showDs: undefined,//this.state.showDs[module._id][input._id],
                        value: this.state.tempDebugValue[module._id][input._id],
                        isSelected: this.state.selectedPutsId.indexOf(input._id)>-1,
                        onMouseEnter: inputMouseEnter,
                        onMouseLeave: inputMouseLeave,
                        onMouseOver: putMouseOver,
                        onMouseOut: putMouseOut,
                        customEvent: {
                            // toOutput: toOutput,
                            updateLoc: doNth,
                            stageDragEnd: doNth,
                            changeValue: this.props.showChangeValueModal,
                            select: doNth,
                        }
                    }));
                }

            }
            return result;
        }
        createLines() {
            var result = [];
            //清空箭头线 防止重复
            var allLines = this.bd.getAllLines();
            allLines.forEach((lines) => {
                result.push(h(GArrowGroup, {
                    id: 'line_' + lines.id,
                    name: 'GArrow',
                    x: 0,
                    y: 0,
                    store: lines,
                    isSelected: (function(id, selectedIds) {
                        var idArr = id.split('_');
                        return selectedIds.indexOf(idArr[0]) > -1 || selectedIds.indexOf(idArr[1]) > -1
                    })(lines.id, this.props.selectedIds),
                    onUpdate(e) {
                        // e.date.lines.forEach((line) => {
                        //     var target = this.find('#' + line.id)[0];
                        //     if (target) {
                        //         target.points(line.points);
                        //     } else { //有增加
                        //         this.add(new Konva.Line({
                        //             id: line.id,
                        //             name: 'line ' + line.id.split('_')[0],
                        //             points: line.points,
                        //             stroke: '#6f7777',
                        //             strokeWidth: 1,
                        //             lineCap: 'round',
                        //             lineJoin: 'round'
                        //         }));
                        //     }
                        // });

                        // var lines = this.find('.line');
                        // //有删除
                        // if (lines.length > e.date.lines.length) {
                        //     var a = new Set(lines.map(line => line.attrs.id)),
                        //         b = new Set(e.date.lines.map(line => line.id));
                        //     var deleteIds = [...a].filter(x => !b.has(x));
                        //     deleteIds.forEach((id) => {
                        //         this.find('#' + id).destroy();
                        //     });
                        // }
                        // this.parent.draw();
                    }
                }));
            });
            return result;
        }
        render() {
            return (h(ReactKonva.Layer,
                {id: 'debugLayer'},
                this.paint()
            ))
        }
    };

    class DebugViewSketchpad extends Stage {
        constructor(props, context) {
            super(props, context);
            var showDs = (function(modules){
                var result = {};
                modules.forEach((module)=>{
                    result[module._id] = {};
                });
                return result;
            })(this.props.modules);
            var defaultDebugValue = (function(modules){
                let result = {};
                modules.forEach((module) => {
                    result[module._id] = {};
                    module.option.input.forEach((input) => {
                        if(input.type==enumerators.moduleInputOutputTypes.OTHER_MODULES){
                            return;
                        }
                        result[module._id][input._id] = input.default;
                    });
                });
                return result;
            })(this.props.modules);

            var tempDebugValue = (function(modules){
                let result = {};
                modules.forEach((module) => {
                    result[module._id] = {};
                    module.option.input.forEach((input) => {
                        if(input.type==enumerators.moduleInputOutputTypes.OTHER_MODULES){
                            return;
                        }
                        result[module._id][input._id] = undefined;
                    });
                });
                return result;
            })(this.props.modules);

            this.async = undefined;
            this.isNeedUpdate = false;
            this.state = {
                strategy: this.props.strategy,
                modules: this.props.modules,
                selectedIds: this.props.selectedIds,
                debugValue: defaultDebugValue,//确切值
                tempDebugValue,//调试值
                showDs,
                showChangeValueModal: false,
                showChartsModal: false,
                showTableModal: false,
                showThreeDimensionsViewModal: false,
                modalTittle: '调试值',
                modalInput: true,
                historyModalData: undefined,
                selectedInputId: undefined,
                selectedPutsId:this.props.selectedPutsId,
                runResult: this.props.runResult
            };
            this.setDebugValue = this.setDebugValue.bind(this);
            this.showChangeValueModal = this.showChangeValueModal.bind(this);
            this.hideChangeValueModal = this.hideChangeValueModal.bind(this);
            this.showChartsModal = this.showChartsModal.bind(this);
            this.hideChartsModal = this.hideChartsModal.bind(this);
            this.showTableModal = this.showTableModal.bind(this);
            this.showThreeDimensionsViewModal = this.showThreeDimensionsViewModal.bind(this);
            this.hideTableModal = this.hideTableModal.bind(this);
            this.doRun = this.doRun.bind(this);
            this.changeValue = this.changeValue.bind(this);
        }
        componentWillMount(){
             window.addEventListener('resize',this.domResize ,false);
        }
        componentWillReceiveProps(nextProps){
            let state = {
                showChangeValueModal: false,
                selectedInputId: undefined,
                selectedPutsId:this.state.selectedPutsId,//nextProps.selectedPutsId,
                showChartsModal: false,
                showTableModal: false,
                showThreeDimensionsViewModal: false,
                historyModalData: undefined,
            };

            if(this.props.strategy._id != nextProps.strategy._id){
                this.isResized = false;
            }
            
            let showDs = (function(modules){
                var result = {};
                modules.forEach((module)=>{
                    result[module._id] = {};
                });
                return result;
            })(nextProps.modules);
            let defaultDebugValue = (function(modules){
                let result = {};
                modules.forEach((module) => {
                    result[module._id] = {};
                    module.option.input.forEach((input) => {
                        if(input.type==enumerators.moduleInputOutputTypes.OTHER_MODULES){
                            return;
                        }
                        result[module._id][input._id] = input.default;
                    });
                });
                return result;
            })(nextProps.modules);

            this.async = undefined;
            Object.assign(state,{
                strategy: nextProps.strategy,
                modules: nextProps.modules,
                selectedIds: nextProps.selectedIds,
                debugValue: defaultDebugValue,//确切值
                showDs,
            });

            let oldModulesId = this.props.modules.map(v=>v._id),
                newModulesId = nextProps.modules.map(v=>v._id);
            let isChangeModule = (()=>{
                let r = false;
                if(oldModulesId.length != newModulesId.length){
                    return true;
                }
                oldModulesId.forEach(id=>{
                    if(newModulesId.indexOf(id)<0){
                        r = true;
                    }
                });
                return r;
            })();
            if(isChangeModule){
                let tempDebugValue = (function(modules){
                    let result = {};
                    modules.forEach((module) => {
                        result[module._id] = {};
                        module.option.input.forEach((input) => {
                            if(input.type==enumerators.moduleInputOutputTypes.OTHER_MODULES){
                                return;
                            }
                            result[module._id][input._id] = undefined;
                        });
                    });
                    return result;
                })(nextProps.modules);
                Object.assign(state,{
                    tempDebugValue
                });
            }

            if(nextProps.dbClickPut && nextProps.selectedPutsId[0]){
                Object.assign(this.state,state);
                this.setState(state);
                if(this.layer){
                    let group = this.layer.find('.'+nextProps.selectedPutsId[0]);
                    if(group[0]){
                        let nameText = group[0].find('.nameText');
                        nameText[0] && nameText[0].fire('nametextdbclick');
                    }
                }
            }else{
                state.runResult = nextProps.runResult;
                Object.assign(this.state,state);
                this.setState(state);
                this.setDebugValue(nextProps);
            }
        }
        shouldComponentUpdate(nextprops, nextstate){
            let isNeedUpdate = true;
            if($(this.elements.domWrap).closest('.painterViewActive').length==0){
               this.isNeedUpdate = true;
               isNeedUpdate =  false;
            }else if(this.isNeedUpdate){
                this.isNeedUpdate = false;
                this.isResized = false;
                isNeedUpdate =  true;
            }else if(nextprops.selectedPutId !== this.props.selectedPutId){
                if(this.layer){
                    this.layer.children.forEach(child=>{
                        if(child.attrs.type == 'input' || child.attrs.type == 'output'){
                            child.find('.dragLayer')[0].fill('#697174');
                        }
                    });
                    if(nextprops.selectedPutId){
                        let target = this.layer.find('.'+nextprops.selectedPutId);
                        target[0]&&target[0].find('.dragLayer')[0].fill('#f6a405');
                    }
                    this.layer.draw();
                }
                isNeedUpdate = false;
            }
            return isNeedUpdate;
        }
        componentWillUnmount() {
            super.componentWillUnmount();
            if(this.async){
                this.async.abort();
                this.async = undefined;
            }
        }
        componentDidUpdate() {
            if (this.state.modules.length > 0 && !this.isResized) {
                this.resize(this.state.modules);
                this.isResized = true;
            }
        }
        getLayer() {
            let layer = this.stage.find('#debugLayer')[0] || this.stage.children[0];
            return layer;
        }
        //events 
        setDebugValue(nextProps){
            let _this = this;
            let debugValue;
            let dsArr = [],
                showDs = (function(modules){
                    let result = {};
                    modules.forEach((module)=>{
                        result[module._id] = {};
                    });
                    return result;
                })(nextProps.modules);
            let typeMap = {};
            nextProps.modules.forEach(module=>{
                module.option.input.forEach(input=>{
                    typeMap[input._id] = input.type;
                });
            });
            for(let k in nextProps.debugValue){
                for(let name in nextProps.debugValue[k]){
                    if(/^@\d+\|\S+$/.test(nextProps.debugValue[k][name])){
                        if(typeMap[name] == enumerators.moduleInputOutputTypes.DATA_SOURCE){
                            dsArr.push(nextProps.debugValue[k][name]);
                        }
                        showDs[k][name] = nextProps.debugValue[k][name];
                    }else{
                        showDs[k][name] = undefined;
                    }
                }
            }

            if(dsArr.length>0){
                this.async = WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {
                    dsItemIds:dsArr
                }).done(function (data) {
                    if(data.dsItemList.length>0){
                        data.dsItemList.forEach((dsResult)=>{
                            for(let k in nextProps.debugValue){
                                for(let name in nextProps.debugValue[k]){
                                    if(nextProps.debugValue[k][name] == dsResult.dsItemId && typeMap[name] == enumerators.moduleInputOutputTypes.DATA_SOURCE){
                                        nextProps.debugValue[k][name] = dsResult.data;
                                    }
                                }
                            }
                        });
                        debugValue = $.extend(true,{},_this.state.debugValue,nextProps.debugValue);
                        _this.setState({
                            debugValue:debugValue,
                            showDs:showDs
                        });
                    }
                })
                this.async.always(()=>{
                    this.async = undefined;
                });
            }else{
                debugValue = $.extend(true,{},_this.state.debugValue,nextProps.debugValue);
                _this.setState({
                    debugValue:debugValue,
                    showDs:showDs
                });
            }
        }

        showChangeValueModal(data) {
            const {id,tittle,input,isShow} = data;
            this.setState({
                showChangeValueModal: isShow,
                selectedInputId: id,
                modalTittle: tittle,
                modalInput: input,
            });
        }
        hideChangeValueModal() {
            this.setState({
                showChangeValueModal: false,
                selectedInputId: undefined,
            });
            if(this.props.dbClickPut){
                this.props.btnActions.closeValueModal();
            }
            
        }
        showChartsModal(value) {
            this.setState({
                showChartsModal: true,
                historyModalData: value,
            });
        }
        hideChartsModal() {
            this.setState({
                showChartsModal: false,
                historyModalData: undefined,
            });
        }
        showTableModal(value) {
            this.setState({
                showTableModal: true,
                historyModalData: value,
            });
        }
        hideTableModal() {
            this.setState({
                showTableModal: false,
                historyModalData: undefined,
            });
        }
        showThreeDimensionsViewModal(value){
            this.setState({
                showThreeDimensionsViewModal: true,
                historyModalData: value
            });
        }
        hideThreeDimensionsViewModal(){
            this.setState({
                showThreeDimensionsViewModal: false,
                historyModalData: undefined,
            });
        }
        changeValue(e) {
            var flag = false;
            var ds,moduleId,inputId;
            var _this = this;
            this.state.modules.forEach((module) => {
                if (flag) { return; }
                module.option.input.forEach((input) => {
                    if (flag) { return; }
                    if (input._id == this.state.selectedInputId) {
                        var value = $('#debugValueInput').val();
                        if ( value !== null && value !== undefined &&value!==this.state.tempDebugValue[module._id][input._id]) {
                            let moduleCopy = Object.assign({},this.state.tempDebugValue[module._id]);
                            moduleCopy[input._id] = value==''?undefined:value;
                            let tempDebugValue = Object.assign({},this.state.tempDebugValue);
                            tempDebugValue[module._id] = moduleCopy;
                            //判断value的正确性
                            let isString1 = /^'[\s\S]*'$/,
                                isString2 = /^"[\s\S]*"$/,
                                isObj = /^{[\s\S]*}$/,
                                isArr = /^[[\s\S]*]$/,
                                isOK = false;
                            if(isString1.test(value)||isString2.test(value)){
                                isOK = true;
                            }else if(isObj.test(value)||isArr.test(value)){
                                try{
                                    JSON.parse(value.replace(/'/g,'"').replace(/[\r\n]/g, ""));
                                    isOK = true;
                                }catch(e){

                                }
                                
                            }else if(!isNaN(Number(value))){
                                isOK = true;
                            }else{
                                isOK = false;
                            }
                            if(isOK){
                                this.setState({
                                    tempDebugValue
                                });
                            }else{
                                message.error(I18n.resource.message.INPUT_FORMAT_ERROR);
                            }
                            
                            // this.state.showDs[module._id][input._id] = value;
                            // this.props.setDebugValue(this.state.showDs);
                        }
                        flag = true;
                    }
                });
            });
            this.hideChangeValueModal();
        }
        doRun(){
            var { doRun } = this.props.btnActions;
            doRun({
                strategy: this.props.strategy,
                modules: this.props.modules,
                debugValue: this.state.debugValue,
                tempDebugValue: this.state.tempDebugValue,
                ds: this.state.showDs
            },this.props.customActions.consoleLoadStart,this.props.customActions.consoleLoadEnd);
        }
        stageDrop() {}
            //events end
            //theme

        createBtnGroup() {
            var stage = this.stage,
                layer = this.layer;
            var { doBack } = this.props.btnActions;
            var btnGroup = [
                h(Button, {
                    ghost: false,
                    onClick: this.doRun
                }, [I18n.resource.debug.RUN]),
                h(Button, {
                    ghost: false,
                    onClick: linkEvent({
                        layer,
                        stage
                    }, doBack)
                }, [I18n.resource.debug.RETURN])
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
        //theme end
        render() {
            this.bd && this.bd.clear();
            // this.valueArr = this.props.strategy && this.props.strategy.value || [];
            var bd = this.bd = new Calculation.Main({
                width: this.WIDTH/this.scale,
                height: this.HEIGHT/this.scale,
                scale: this.scale,
                layer: this.layer
            });

            var selectedPutInfo = (function(modules, selectedInputId, debugValue, tempDebugValue, runResult, modalInput) {
                var flag = false;
                var result = {};
                if (!selectedInputId) {
                    return result;
                }
                modules.forEach((module) => {
                    if (flag) { return; }
                    module.option.input.forEach((input) => {
                        if (flag) { return; }
                        if (input._id == selectedInputId) {
                            result.name = (input.desc&&input.desc!=='')?input.desc:input.name;
                            result.inputValue = tempDebugValue[module._id][input._id];
                            result.value = debugValue[module._id][input._id];
                            flag = true;
                        }
                    });
                    module.option.output.forEach((output) => {
                        if (flag) { return; }
                        if (output._id == selectedInputId) {
                            result.name = (output.desc&&output.desc!=='')?output.desc:output.name;
                            result.value = runResult&&runResult[selectedInputId];
                            flag = true;
                        }
                    });
                });
                result.isInput = modalInput;
                return result
            })(this.state.modules, this.state.selectedInputId, this.state.debugValue, this.state.tempDebugValue, this.state.runResult, this.state.modalInput);
            var preventFn = function(e) { e.preventDefault(); };
            return (h('#debugSketchpadWrap.gray-scrollbar', {
                ref: this.refDefine('domWrap'),
                style: {
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    zIndex: 10,
                    overflow: 'hidden'
                },
                onDragStart: preventFn,
                onDragOver: preventFn,
                onDrop: linkEvent({
                    strategy: this.props.strategy,
                    scale: this.scale,
                    bd: this.bd
                }, this.stageDrop),
                onContextMenu:preventFn,
                onMouseDown:this.props.stageActions.stageMouseDown.bind(this),
                onMouseUp:this.props.stageActions.stageMouseUp.bind(this),
                onWheel: this.props.stageActions.stageWheel.bind(this)
            }, [
                this.createBtnGroup(),
                h(ReactKonva.Stage, {
                    ref: this.refDefine('stage')
                }, [
                    // h(ReactKonva.Layer,
                    //     this.paint()
                    // )
                    h(Layer,{
                        bd: this.bd,
                        scale: this.scale,
                        runResult: this.state.runResult,
                        modules: this.state.modules,
                        selectedIds: this.state.selectedIds,
                        debugValue: this.state.debugValue,
                        tempDebugValue: this.state.tempDebugValue,
                        showDs: this.state.showDs,
                        selectedPutsId:this.state.selectedPutsId,

                        moduleActions: this.props.moduleActions,
                        inputActions: this.props.inputActions,
                        outputActions: this.props.outputActions,
                        showChangeValueModal: this.showChangeValueModal,
                        showChartsModal: this.showChartsModal,
                        showTableModal: this.showTableModal,
                        showThreeDimensionsViewModal: this.showThreeDimensionsViewModal
                    })
                ]),
                h(ShowTextModal, {
                    isShow: this.state.showChangeValueModal,
                    title: this.state.modalTittle,
                    selectedPutInfo,
                    doCancel: this.hideChangeValueModal,
                    doOk: this.changeValue,
                }),
                h(ShowChartsModal, {
                    isShow: this.state.showChartsModal,
                    chartsModalData: this.state.historyModalData,
                    doCancel: this.hideChartsModal,
                    doOk: this.hideChartsModal,
                }),
                h(HistoricalTableModal, {
                    visible: this.state.showTableModal,
                    data: this.state.historyModalData,
                    onCancel: this.hideTableModal
                }),
                h(ThreeDimensionsViewModal, {
                    visible: this.state.showThreeDimensionsViewModal,
                    data: this.state.historyModalData,
                    onCancel: this.hideThreeDimensionsViewModal.bind(this)
                }),
            ]))
        }
    };
    exports.DebugViewSketchpad = DebugViewSketchpad;
}));
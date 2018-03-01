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
            namespace('ReactRedux'),
            namespace('beop.strategy.enumerators'),
            namespace('diff'),
            namespace('beop.util.MergeDiff'),
            namespace('antd'),
            namespace('beop.strategy.common'),
            namespace('beop.strategy.components.Spinner')
        );
    }
}(namespace('beop.strategy.modules.Sketchpad'), function(
    exports,
    React,
    ReactRedux,
    enumerators,
    diff,
    MergeDiff,
    antd,
    commonUtil,
    Spinner
) {

    var deepClone = $.extend.bind($, true);
    var snapshot = {
        snapshot: {},
        set: function(key, data) {
            if (!Array.isArray(data)) {
                data = [data];
            }
            this.snapshot[key] = deepClone({}, Array.toMap(data, '_id'));
        },
        get: function(key) {
            return this.snapshot[key];
        },
        WebApiStrategyItemGetById: null
    };
    var h = React.h;
    const { notification ,message} = antd;
    // ------------------------------------
    // Constants
    // ------------------------------------
    const SKETCHPAD_DROP = 'SKETCHPAD_DROP';
    const INIT_SKETCHPAD_DATA = 'INIT_SKETCHPAD_DATA';
    const SKETCHPAD_MODULES_SELECTED = 'SKETCHPAD_MODULES_SELECTED';
    const SKETCHPAD_UPDATE_LOC = 'SKETCHPAD_UPDATE_LOC';
    const SKETCHPAD_OUTPUT_TO_INPUT = 'SKETCHPAD_OUTPUT_TO_INPUT';
    const SKETCHPAD_REMOVE_MODULE = 'SKETCHPAD_REMOVE_MODULE';
    const SKETCHPAD_UPDATE_MODULE = 'SKETCHPAD_UPDATE_MODULE';
    const SKETCHPAD_RELOAD = 'SKETCHPAD_RELOAD';
    const SAVE_STRATEGY_VALUE = 'SAVE_STRATEGY_VALUE';
    const UPDATE_MODULE_PROP = 'UPDATE_MODULE_PROP';
    const SYNC_STRATEGY_VALUE = 'Sketchpad.SYNC_STRATEGY_VALUE';
    const CLEAR_SKETCHPAD = 'CLEAR_SKETCHPAD';
    const SKETCHPAD_STRATEGY_PRETASKS_CHANGE = 'SKETCHPAD_STRATEGY_PRETASKS_CHANGE';
    const SKETCHPAD_SHOW_ADDOUTLINK_MODAL = 'SKETCHPAD_SHOW_ADDOUTLINK_MODAL';
    const SKETCHPAD_CLOSE_ADDOUTLINK_MODAL = 'SKETCHPAD_CLOSE_ADDOUTLINK_MODAL';
    const SKETCHPAD_ADD_ADDOUTLINK_INPUTS = 'SKETCHPAD_ADD_ADDOUTLINK_INPUTS';
    const SKETCHPAD_SPINNER = 'SKETCHPAD_SPINNER';
    const ADD_TAGSMATCHINGPARAMTERS = 'ADD_TAGSMATCHINGPARAMTERS';
    const UPDATE_PROP = 'UPDATE_PROP';
    const UPDATE_MODULES = 'SKETCHPAD_UPDATE_MODULES';
    // ------------------------------------
    // Actions
    // ------------------------------------
    var clear = function() {
        //清空画板
        return function(dispatch, getState) {
            var state = getState();
            //清掉选中的样式
            dispatch({
                type: SKETCHPAD_MODULES_SELECTED,
                value: 'clear'
            });
            //清掉 module的属性
            var actions = namespace('beop.strategy.modules.ModulePropPanel.actions');
            dispatch(actions.setPropData([]));
            dispatch({
                type: CLEAR_SKETCHPAD,
            });
            //更新 prop
            let updatePropActions = namespace('beop.strategy.modules.PropPanel.actions');
            let selectedIds = state.strategyTable.selectedIds;
            dispatch({
                type: UPDATE_PROP,
                selectedIds: selectedIds
            });
            dispatch(updatePropActions.recoverProp());
        }
    };

    var doBatchConfig = function() {
        return function() {

        };
    };

    var doExport = function() {
        return function() {

        };
    };

    var doDebug = function() {
        return function() {

        };
    };

    var _needSyncFaultTable = function (strategy, modules) {
        let oldModulesMap = snapshot.get('modules');
        let oldStrategyMap = snapshot.get('strategy');
        let oldOutputs = [],
            newOutputs = [],
            oldVaules = [],
            newValues = [];
        
        for(let moduleId in oldModulesMap) {
            oldOutputs = oldOutputs.concat(oldModulesMap[moduleId].option.output);
        }
        modules.forEach(module=>{
            newOutputs = newOutputs.concat(module.option.output);
        });

        oldValues = oldStrategyMap[Object.keys(oldStrategyMap)[0]].value;
        newValues = strategy.value;
        let diffOutput = diff(
            Array.toMap(oldOutputs, '_id'), 
            Array.toMap(newOutputs, '_id'),
            function (lhs, rhs, path) {
                // 位置变化，不进行捕获
                if (path[1] === 'loc') {
                    return false;
                }
            }
        );
        let diffValue = diff(
            Array.toMap(oldValues, '_id'),
            Array.toMap(newValues, '_id'),
            function (lhs, rhs, path) {
                // 仅比较 value 个数的变化
                if (path.length > 1) {
                    return false;
                }
            }
        );

        return !(!diffOutput & !diffValue);
    };

    var doSave = function(fn) {
        return function(dispatch, getState) {
            var state = getState().sketchpad;
            var data = state.modules;
            var item = state.strategy;
            let oldModulesMap = snapshot.get('modules');
            var diffData = diff(oldModulesMap, Array.toMap(data, '_id'), function(lhs, rhs, path) {
                var cmp;
                if (path.length !== 2 || ['option', 'loc'].indexOf(path[1]) === -1) return;
                cmp = window.diff(lhs, rhs);
                return cmp !== null;
            });
            
            var info = {
                userId: AppConfig.userId,
                ids: [item['_id']],
                data: {
                    'value': item.value
                },
                projId: AppConfig.projectId
            }

            if( _needSyncFaultTable(item, data) ) {
                info.data['option.needSyncFaultTable'] = 1;
                dispatch(namespace('beop.strategy.modules.EquipTree.actions').changeItemsNeedSyncFaultTable(item['_id'], 1));
                dispatch(namespace('beop.strategy.modules.StrategyTable.actions').changeSearchField(getState().strategyTable.searchKey));
            }

            if (diffData) {
                diffData = MergeDiff(diffData);

                let asyncPostData = (() => {
                    let efIds = {};
                    let targetValue = item.value.filter(v => v.params.equipmentId && Object.keys(v.params.equipmentId).length > 0);
                    if(targetValue) {
                        targetValue.forEach(value => {
                            let entityObj = value.params.equipmentId;
                            Object.keys(entityObj).forEach(moduleId => {
                                let faultObj = value.params.faultId[moduleId];
                                if(faultObj) {
                                    let faultIds = Object.keys(faultObj).map(outputId => faultObj[outputId]);
                                    efIds[entityObj[moduleId]] = faultIds;
                                }
                            });
                        })
                    }

                    let faultData = {};
                    if (Object.keys(efIds).length) {
                        data.forEach(module => {
                            let inputNameMap = Array.toMap(module.option.input, 'name');
                            module.option.output.forEach(output => {
                                if(output.option && output.option.faultId){
                                    const {faultId, runTimeDay, runTimeMonth, runTimeWeek, runTimeYear, unit, targetExecutor, targetGroup, faultTag, faultTypeGroup, chart} = output.option;
                                    let idAliasMap = {};
                                    chart.map(v => v.name).forEach((name, idx) => {
                                        if(inputNameMap[name] && inputNameMap[name].option){
                                            let inputId = inputNameMap[name]._id,
                                                inputAlias = inputNameMap[name].option.alias || '',
                                                inputUint = inputNameMap[name].option.unit || 'Y';
                                            idAliasMap[inputId] = {
                                                alias: inputAlias,
                                                idx: idx,
                                                unit: inputUint
                                            };
                                        } else {
                                            console.warn(`未找到输入参数 ${name}`)
                                        }
                                    });
                                    
                                    let points = {}, axisSet = {}, axisName = {};
                                    item.value.forEach(value => {
                                        let tempArr = [];
                                        let axisSetArr = [];
                                        let unitArr1 = [], unitArr2 = [];
                                        let equipId = value.params.equipmentId && value.params.equipmentId[module._id]
                                        Object.keys(idAliasMap).forEach(id => {
                                            let v = value.list[module._id][id];
                                            if (v && v !== 'None' && v !== '') {
                                                tempArr.push(v.replace(/^@\d+\|/,'') + ',' + idAliasMap[id].alias);
                                                axisSetArr.push(chart[idAliasMap[id].idx].type);
                                                if (chart[idAliasMap[id].idx].type === 0){
                                                    unitArr1.push(idAliasMap[id].unit);
                                                } else {
                                                    unitArr2.push(idAliasMap[id].unit);
                                                }
                                            }
                                        });
                                        if (tempArr && tempArr.length) {
                                            points[equipId] = tempArr.join('|');
                                        }
                                        if (axisSetArr && axisSetArr.length) {
                                            axisSet[equipId] = axisSetArr.join('|');
                                        }
                                        let unitCombine = [$.unique(unitArr1).join('/'), $.unique(unitArr2).join('/')].filter(
                                            row => !!row
                                        );
                                        if (unitCombine && unitCombine.length) {
                                            axisName[equipId] = unitCombine.join('|');
                                        }
                                    });
                                    faultData[faultId] = {
                                        runTimeDay,
                                        runTimeMonth,
                                        runTimeWeek,
                                        runTimeYear,
                                        targetExecutor,
                                        targetGroup,
                                        unit,
                                        faultTag,
                                        customTag: faultTypeGroup,
                                        axisName,
                                        axisSet,
                                        points
                                    }
                                }
                            });
                        });
                    }
                    return {
                        efIds,
                        faultData,
                        strategyId: item._id,
                        projectId: AppConfig.projectId,
                        userId: AppConfig.userId
                    }
                })();
                let strategyPromise = WebAPI.post('/strategy/item/save', info).done(function (rs) {
                    if (rs.status === 'OK') {
                        snapshot.set('strategy', item);
                    } else {
                        // 保存数据失败
                        notification.error({
                            message: 'Save Fail',
                            description: 'Save strategy fail, Please try again later.',
                            duration: 2
                        });
                    }
                });
                let modulePromise = WebAPI.post('/strategy/modules/sync', {
                    modules: diffData
                }).done(function(rs) {
                    if (rs.status === 'OK') {
                        // 同步数据成功
                        snapshot.set('modules', data);
                    } else {
                        // 同步数据失败
                        notification.error({
                            message: 'Save Fail',
                            description: 'Save modules fail, Please try again later.',
                            duration: 2
                        });
                    }
                });
                let entityFaultTableSyncPromise = WebAPI.post('/diagnosis_v2/syncEntityFaultTable', asyncPostData).done(
                    rs => {
                        if (rs.status !== 'OK') {
                            // 同步数据失败
                            notification.error({
                                message: 'Save Fail',
                                description: 'Save modules fail, Please try again later.',
                                duration: 2
                            });
                        }
                    }
                )

                return {
                    async: $.when(strategyPromise, modulePromise, entityFaultTableSyncPromise).done(function () {
                        notification.success({
                            message: 'Save Status',
                            description: 'Save success.',
                            duration: 2
                        });
                    }).fail(function () {
                        // 同步数据失败
                        notification.error({
                            message: 'Save Fail',
                            description: 'Connection fail, Please try again later.',
                            duration: 2
                        });
                    }).always(function() {
                        fn && fn(0);
                    }),
                    abort() {
                        strategyPromise.abort();
                        modulePromise.abort();
                        entityFaultTableSyncPromise.abort();
                    }
                }
            } else {
                // 没有需要同步的数据
                return WebAPI.post('/strategy/item/save', info).fail(()=>{
                    // 同步数据失败
                    notification.error({
                        message: 'Save',
                        description: 'Save fail.',
                        duration: 2
                    });
                }).always(function() {
                    fn && fn(500);
                });
                // return;
            }
        }
    };

    var doBack = function(data) {
        return function(dispatch, getState) {
            var state = getState();
            if (state.painter.bShowDebugPanel) { //退出调试
                state.painter.bShowDebugPanel = false;
                dispatch({
                    type: SKETCHPAD_RELOAD,
                });
            } else {
                dispatch(clear());
                history.pushState(null, '策略组态 - 首页', '/strategy');
            }
        }
    };

    var stageDrop = function(data, e) {
        var id = data.strategy._id,
            bd = data.bd,
            scale = bd.SCALE,
            selectedValueId = data.selectedValueId,
            refs = data.refs,
            layer = bd.getLayer(),
            stage = layer.parent;
        var $this = $(e.target),
            offset = $this.offset(),
            stageOffset = stage.offset(),
            clientX = e.clientX / scale - offset.left / scale + stageOffset.x,
            clientY = e.clientY / scale - offset.top / scale + stageOffset.y;
        var dsItemId = e.dataTransfer.getData('dsItemId'),
            tagGroupId = e.dataTransfer.getData('tagGroupId'),
            tagItemId = e.dataTransfer.getData('tagItemId'),
            projDragInfo = e.dataTransfer.getData('projDragInfo'),
            addInfo = e.dataTransfer.getData('info');
        var dragType, ds, targetModuleId, target, tag, isModule = false;
        if (dsItemId) {
            //绑定数据源
            ds = commonUtil.parseDs(dsItemId);
            let skip = false;
            bd.blocks.forEach((block) => {
                if (skip) return;
                if(block.opt.type == enumerators.moduleTypes.CORRELATION_ANALYSIS){
                    let isOK = bd.tools.intersectionByPoint({ x: clientX, y: clientY }, block);
                    if (isOK) {
                        skip = true;
                        isModule = true;
                        dragType = 'dsItemId';
                        target = {
                            moduleId: block.id,
                        }
                    }
                }
                block.children.forEach((child) => {
                    if (skip || child.child != undefined || (enumerators.moduleInputOutputTypes.DATA_SOURCE !== child.opt.type && enumerators.moduleInputOutputTypes.INPUT_DIAGNOSIS_FUZZYRULE !== child.opt.type && enumerators.moduleInputOutputTypes.STRING !== child.opt.type && enumerators.moduleInputOutputTypes.INPUT_HISTORY_DATA_SOURCE !== child.opt.type)) {
                        return;
                    }
                    let isOK = bd.tools.intersectionByPoint({ x: clientX, y: clientY }, child);
                    // target = layer.find('#' + child.id)[0];
                    target = {
                        moduleId: child.id.split('_')[1],
                        inputId: child.id.split('_')[0],
                    }
                    if (isOK && target) {
                        skip = true;
                        dragType = 'dsItemId';
                    }
                });
            });
        } else if (tagGroupId) {
            let json = JSON.parse(tagGroupId);
            tag = json.data;
            dragType = 'tagGroupId';
        }else if(tagItemId){
            ds = JSON.parse(tagItemId).id;
            let skip = false;
            bd.blocks.forEach((block) => {
                if (skip) return;
                if(block.type == enumerators.moduleTypes.CORRELATION_ANALYSIS){
                    let isOK = bd.tools.intersectionByPoint({ x: clientX, y: clientY }, block);
                    if (isOK) {
                        skip = true;
                        isModule = true;
                        dragType = 'dsItemId';
                        target = {
                            moduleId: block.id,
                        }
                    }
                }
                block.children.forEach((child) => {
                    if (skip || child.child != undefined) {
                        return;
                    }
                    let isOK = bd.tools.intersectionByPoint({ x: clientX, y: clientY }, child);
                    // target = layer.find('#' + child.id)[0];
                    target = {
                        moduleId: child.id.split('_')[1],
                        inputId: child.id.split('_')[0],
                    }
                    if (isOK && target) {
                        skip = true;
                        dragType = 'tagItemId';
                    }

                });
            });
        }else if (projDragInfo) {
            projDragInfo = JSON.parse(projDragInfo);
            bd.blocks.forEach((block) => {
                let isOK = bd.tools.intersectionByPoint({ x: clientX, y: clientY }, block);
                if (isOK) {
                    dragType = 'addOutLink';
                    targetModuleId = block.opt._id;
                }
            });
        } else if (addInfo) {
            //新增
            var info = JSON.parse(addInfo);
            var x = clientX - info.x,
                y = clientY - info.y;

            var type = info.type,
                name, opt;
            if (info.dataId) {
                //规则
                dragType = 'rule';

            } else {
                dragType = 'add';
                name = enumerators.moduleTypeNames[type];
                opt = { // 无模板引用的模块
                    // 模块编号
                    '_id': ObjectId(),
                    'strategyId': id,
                    // 模块调用方式：0，python代码；1，引用模板；2，远程REST服务调用；3，LaTex；4，固有控件
                    'type': type,
                    // 模块名称
                    'name': name,
                    // 模块描述
                    'desc': '',
                    // 配置项，根据type类型不同，而稍有差别，但都有input、output、content
                    'option': {
                        // 输入参数
                        'input': [],
                        // 输出参数
                        'output': [],
                        // 内容
                        'content': {

                        }
                    },
                    'loc': {
                        'x': Math.round(x),
                        'y': Math.round(y),
                        'w': 155,
                        'h': 72
                    }
                };

                switch (type) {
                    case enumerators.moduleTypes.FUZZY_RULE: //模糊规则
                        opt.option.content.ruleBlock = [{
                            items: [{
                                continuity: 'if',
                                name: undefined,
                                judge: 'is',
                                term: undefined
                            }],
                            results: [{
                                continuity: 'then',
                                name: undefined,
                                judge: 'is',
                                term: undefined
                            }]
                        }];
                        break;
                    case enumerators.moduleTypes.CORRELATION_ANALYSIS: //相关性分析
                        opt.option.input = [{
                            _id: ObjectId(),
                            name: "base_value",
                            type: 3,
                            desc: I18n.resource.modal.BASE_VALUE,
                            option:{
                                dataSource:{}
                            },
                            default: 'None'
                        }];
                        opt.option.output = [
                            {
                                _id: ObjectId(),
                                name: "variables",
                                type: 30,
                                desc: I18n.resource.modal.ANALYSIS_VARIABLE
                            },{
                                 _id: ObjectId(),
                                name: "model",
                                type: 30,
                                desc: I18n.resource.modal.ANALYSIS_MODAL
                            }
                        ];
                        break;
                    case enumerators.moduleTypes.FORECAST: //预测
                        opt.option.input = [{
                            _id: ObjectId(),
                            name: "model",
                            type: 3,
                            desc: I18n.resource.modal.MODAL,
                            option:{
                                dataSource:{}
                            },
                            default: 'None'
                        }];
                        opt.option.output = [{
                            _id: ObjectId(),
                            name: "result",
                            type: 30,
                            desc: I18n.resource.modal.RESULT
                        }];
                        break;
                    case enumerators.moduleTypes.HISTORICAL_CURVE: //历史曲线
                        opt.option.input = [{
                            _id: ObjectId(),
                            name: "data",
                            type: 3,
                            desc: I18n.resource.modal.DATA,
                            option:{
                                dataSource:{}
                            },
                            default: 'None'
                        }];
                        break;
                    case enumerators.moduleTypes.TABLE: //表格
                        opt.option.input = [{
                            _id: ObjectId(),
                            name: "data",
                            type: 3,
                            desc: I18n.resource.modal.DATA,
                            option:{
                                dataSource:{}
                            },
                            default: 'None'
                        }];
                        break;
                    case enumerators.moduleTypes.THREE_DIMENSIONS_VIEW: //3D视图
                        opt.option.input = [{
                            _id: ObjectId(),
                            name: "data",
                            type: 3,
                            desc: I18n.resource.modal.DATA,
                            option:{
                                dataSource:{}
                            },
                            default: 'None'
                        }];
                        break; 
                }
            }
        }

        return function(dispatch, getState) {
            var state = deepClone({}, getState().sketchpad);
            switch (dragType) {
                case 'tagGroupId':
                    const getMaxMap = (match)=>{
                        let map = {}, names = [];
                        for(let moduleId in match){
                            names = Object.keys(match[moduleId]);
                            names.forEach(name=>{
                                if(map[moduleId]){
                                    if(match[moduleId][name]>match[moduleId][map[moduleId]]){
                                        map[moduleId] = name;
                                    }
                                }else{
                                    if(match[moduleId][name]>0){
                                        map[moduleId] = name;
                                    }
                                    
                                }
                            });
                        }
                        return map;
                    }
                    const filter = (match,n)=>{
                        let map = {}, names = [];
                        for(let moduleId in match){
                            map[moduleId] = {};
                            names = Object.keys(match[moduleId]);
                            names.forEach(name=>{
                                if(match[moduleId][name]>=n){
                                    map[moduleId][name] = match[moduleId][name];
                                }
                            });
                        }
                        return map;
                    }
                    let tempD = tag;

                    let promise = $.Deferred();
                    let loopArr = {};
                    let stepSum = 0;
                    let wrongCount = 0;
                    let isSystem = state.strategy.level == 1?true:false;
                    let loop = (children, prt, parentName)=>{
                        children.forEach((c, i)=>{
                            let isOnlyGroup,
                                doSth;
                            if(c.entityType !=  undefined && c.entityType == 1){//设备文件夹
                                isOnlyGroup = false;
                                doSth = (result)=>{
                                    tempD.push({_id: c._id,tag: c.tag, name: c.name, prt: c.prt, children: result.data.filter(d=>d.type=='thing'), originName: c.name, parentName:parentName, entityType:c.entityType, entityId:c.entityId});
                                };
                            }else if(c.entityType !=  undefined && c.entityType == 0 && isSystem){//普通文件夹 系统
                                isOnlyGroup = false;
                                doSth = (result)=>{
                                    tempD.push({_id: c._id,tag: c.tag, name: c.name, prt: c.prt, children: result.data.filter(d=>d.type=='thing'), originName: c.name, parentName:parentName, entityType:c.entityType, entityId:c.entityId});
                                };
                            }else if(c.entityType !=  undefined && c.entityType == 0){//普通文件夹
                                wrongCount++;
                                isOnlyGroup = true;
                                doSth = (result, prt)=>{
                                    loopArr[prt] = loopArr[prt] || new Array(result.data.length).fill(0);
                                    loop(result.data, prt, parentName+'_'+(c.originName || c.name));
                                };
                            }
                            WebAPI.post('/tag/getThingTreeNew', {
                                projId: c.projId,
                                Prt: c._id,
                                isOnlyGroup: isOnlyGroup
                            }).done((result)=>{
                                loopArr[prt][i] = 1;
                                if (result.data && result.data.length) {
                                    result.data.forEach(d=>{
                                        d.projId = c.projId;
                                    });
                                    doSth(result, c._id);
                                }
                                let isOk = true;
                                let sum = 1;
                                for(let key in loopArr){
                                    loopArr[key].forEach((k)=>{
                                        if(k == 0){
                                            isOk = false;
                                            sum++;
                                        }
                                    });
                                }
                                let step = (100-stepSum)/sum;
                                stepSum+=step;
                                refs.progress.setPercent(step);
                                if(isOk){
                                    promise.resolve();
                                }
                            }).fail(()=>{
                                refs.progress.setStatus('exception',false);
                            });
                        });
                    }
                    let deleteIndexArr = [];

                    tempD.forEach((t, index)=>{//新版tempD length为1
                        if(!t.children){
                            WebAPI.post('/tag/getThingTreeNew', t.postData).done(function (result) {
                                if (result.data && result.data.length) {
                                    result.data.forEach(c=>{
                                        c.projId = t.postData.projId;
                                    });
                                    if(t.entityType!=undefined && t.entityType == 1){//设备文件夹
                                        t.children = result.data.filter(d=>d.type=='thing');
                                        promise.resolve();
                                    }else if(t.entityType != undefined && t.entityType == 0){//普通文件夹
                                        deleteIndexArr.push(index);
                                        
                                        let parentName = (t.parentName==''?'':(t.parentName+'_'))+t.originName;
                                        if(!isSystem){
                                            loopArr[t.postData.Prt] = loopArr[t.postData.Prt] || new Array(result.data.length).fill(0);
                                            wrongCount++;
                                            loop(result.data, t.postData.Prt, parentName);
                                        }else{
                                            loopArr[t.postData.Prt] = [0];
                                            loop(tempD, t.postData.Prt, parentName);
                                            // promise.resolve();
                                        }
                                    }
                                }else{
                                    promise.resolve();
                                }
                            });
                        }else{
                            promise.resolve();
                        }
                    });
                    if(tempD.length == 0){//无entityid的文件夹
                        promise.reject('noEntity');
                    }
                    refs.progress.show();
                    promise.fail((data)=>{
                        if(data=='noEntity'){
                            notification.warning({
                                message: '',
                                description: I18n.resource.message.TAG_NO_ENTITYID,
                            });
                        }
                        refs.progress.setStatus();
                    }).done(()=>{
                        tempD = tempD.filter((v,i)=>deleteIndexArr.indexOf(i)<0);
                        refs.progress.setPercent(100);
                        let successNum = 0,
                            failedNum = 0;
                        let resultArr = [];
                        let hideInputSet = new Set();
                        let isNeddUpdateValueId = false;
                        tempD.sort((a,b)=>{
                            return (a.parentName+'_'+a.originName).localeCompare(b.parentName+'_'+b.originName);
                        });
                        tempD.forEach(temp=>{
                            if(temp.entityType == undefined){
                                return;
                            }
                            let equipmentId = {},
                                faultId = {};
                            let result = {};
                            target = temp.children;
                            let name = temp.parentName+'_'+temp.originName;
                            if(isSystem && temp.entityType == 0){
                                name = temp.parentName;
                            }
                            name = name.replace(/[^\w\u4E00-\u9FA5]/g,'_');
                            let list = {};
                            state.modules.forEach(module=>{
                                list[module._id] = {};
                                equipmentId[module._id] = undefined;
                                faultId[module._id] = {};
                                module.option.input.forEach(input=>{
                                    list[module._id][input._id] = "None";
                                    if(input.option && (input.option.type == enumerators.fuzzyRuleInputOutputTypes.FORMULA || input.option.type == enumerators.fuzzyRuleInputOutputTypes.SERIESANALYSISCODE)){
                                        hideInputSet.add(input._id);
                                    }
                                });
                                module.option.output.forEach(output=>{
                                    faultId[module._id][output._id] = output.option.faultId;
                                });
                            });
                            let isSuccess = false;
                            let valueId = ObjectId();
                            let matchGroups = commonUtil.tagMatcher.matchGroups(state.modules, temp);
                            let newMatchGroups = filter(matchGroups,0.7);
                            let moduleMap = getMaxMap(newMatchGroups);
                            
                            for(let moduleId in moduleMap){
                                equipmentId[moduleId] = temp.entityId;
                                let name = moduleMap[moduleId];
                                let module = state.modules.find(m=>m._id == moduleId);
                                let matchThings = commonUtil.tagMatcher.matchThings(module, target);
                                let newMatchThings = filter(matchThings.input,0.7);
                                let inputMap = getMaxMap(newMatchThings);
                                result[moduleId] = {};
                                for(let inputId in newMatchThings){
                                    result[moduleId][inputId] = [];
                                    for(let tagId in newMatchThings[inputId]){
                                        let info = deepClone({},target.find(t=>tagId==t._id));
                                        info.name = info.originName||info.name;
                                        info.completeName = '@'+info.projId+'|'+info.name;
                                        info.matching = newMatchThings[inputId][tagId];
                                        if(!hideInputSet.has(inputId)){
                                            result[moduleId][inputId].push(info);
                                        }
                                    }
                                    if(result[moduleId][inputId].length > 0){
                                        result[moduleId][inputId].sort(function(a,b){
                                            return b.matching - a.matching
                                        })
                                    }
                                }
                                for(let inputId in inputMap){
                                    let info = target.find(t=>inputMap[inputId]==t._id);
                                    info.name = info.originName||info.name;
                                    if(!hideInputSet.has(inputId)){
                                        list[moduleId][inputId] = '@'+info.projId+'|'+info.name;
                                    }
                                }
                                isSuccess = true;
                            }
                            
                            if(isSuccess){
                                var index = -1;
                                state.strategy.value.some(function(row,i){
                                    if(row.isDefault){
                                        index = i;
                                        row.isDefault = false;
                                        return true;
                                    }
                                });
                                if(index > -1){
                                    state.strategy.value.splice(index,1);
                                    isNeddUpdateValueId = true;
                                }

                                let targetValue = state.strategy.value.find(v=>{
                                    if(!v.params.equipmentId || Object.keys(v.params.equipmentId).length != Object.keys(equipmentId).length){
                                        return false;
                                    }
                                    for(let k in v.params.equipmentId){
                                        if(v.params.equipmentId[k]!=equipmentId[k]){
                                            return false;
                                        }
                                    }
                                    return true;
                                })
                                
                                if(targetValue){
                                    targetValue.list = list;
                                    valueId = targetValue._id;
                                    name = targetValue.name;
                                }else{
                                    state.strategy.value.push({
                                        _id: valueId,
                                        name: name,
                                        params: {
                                            faultId,
                                            equipmentId,
                                        },
                                        list:list
                                    });
                                }
                                
                                successNum++;
                            }else{
                                failedNum++;
                            }
                            resultArr.push({_id:valueId,name: name,list:Object.assign({},commonUtil.getStrategyDefaultInputValue(state.modules).list,result)});
                        });
                        state.tagResults = resultArr;
                        notification.success({
                            message: '',
                            description: I18n.resource.message.SUCCESS_ADD + ` ${successNum} ` + I18n.resource.message.GROUP_CONFIGURATION,
                        });
                        if(failedNum>0){
                            notification.error({
                                message: '',
                                description: I18n.resource.message.HAS + ` ${failedNum} `+ I18n.resource.message.GROUP_TAG_NO_FOUND,
                            });
                        }
                        if(wrongCount>0){
                            notification.warning({
                                message: '',
                                description: I18n.resource.message.HAS + ` ${wrongCount} `+ I18n.resource.message.GROUP_TAG_NO_EQUIPMENTID,
                            });
                        }
                        if(isNeddUpdateValueId){
                            dispatch( namespace('beop.strategy.modules.EquipTree.actions').changeSelectedValueId(state.strategy.value[0]._id) );
                        }
                        dispatch([{
                            type: SKETCHPAD_DROP,
                            data: state
                        },{
                            type: SYNC_STRATEGY_VALUE,
                            value: commonUtil.getSyncValue(state.modules, state.strategy.value)
                        }]);
                    });
                    break;
                case 'tagItemId':
                case 'dsItemId':
                    var moduleId = target.moduleId,
                        inputId = target.inputId;
                    var selectedValue = state.strategy.value.find(o => o._id == selectedValueId);
                    if (selectedValue) {
                        if(isModule){
                            let module = state.modules.find(module=>module._id==moduleId);
                            if(module){
                                let name = 'param_';
                                let n = 1;
                                let inputNameArr = commonUtil.getStrategyInput(state.modules).map(input=>Number(input.name.split('param_')[1]));
                                while(inputNameArr.indexOf(n)>-1){
                                    n++;
                                }
                                let id = ObjectId();
                                module.option.input.push({
                                    _id: id,
                                    default: 'None',
                                    desc: '',
                                    name: name+n,
                                    option: {
                                        dataSource: {}
                                    },
                                    type: enumerators.moduleInputOutputTypes.INPUT_HISTORY_DATA_SOURCE
                                });
                                inputId = id;
                            }
                        }
                        if(selectedValue.isDefault){
                            selectedValue.isDefault = false;
                        }
                        selectedValue.list[moduleId] = selectedValue.list[moduleId] || {};
                        selectedValue.list[moduleId][inputId] = ds;
                    }
                    
                    dispatch({
                        type: SKETCHPAD_DROP,
                        data: state
                    });
                    break;
                case 'addOutLink':
                    WebAPI.get('/strategy/item/get/' + projDragInfo.dataId).done(function(rs) {
                        if (rs.status === 'OK') {
                            dispatch({
                                type: SKETCHPAD_SHOW_ADDOUTLINK_MODAL,
                                data: rs.data,
                                targetModuleId: targetModuleId
                            });
                        }
                    }).fail(function() {
                        // 获取页面数据失败，回退到策略表格
                    });
                    break;
                case 'rule':
                    refs.progress.show(1);
                    let async = WebAPI.get('/strategy/template/' + info.dataId).done(function(rs) {
                        refs.progress.setPercent(100);
                        if (rs.status === 'OK') {
                            var data = rs.data;
                            let newX = Math.round(x),
                                newY = Math.round(y),
                                lastModuleX, lastModuleY, lastX, lastY;
                            let allIdsMap = {};
                            data.data.modules.forEach(module=>{
                                allIdsMap[module._id] = ObjectId();
                                module.option.input.forEach(input=>{
                                    allIdsMap[input._id] = ObjectId();
                                });
                                module.option.output.forEach(output=>{
                                    allIdsMap[output._id] = ObjectId();
                                });
                                module.option.groups && module.option.groups.forEach(group=>{
                                    allIdsMap[group._id] = ObjectId();
                                });
                            });
                            data.data.modules.forEach((module, index)=>{
                                let inputIdMap = {};
                                let oldX, oldY;
                                if(module.loc){
                                    oldX = module.loc.x;
                                    oldY = module.loc.y;
                                }
                                if(index > 0 && module.loc){
                                    let ox = module.loc.x - lastModuleX,
                                        oy = module.loc.y - lastModuleY;
                                    newX = lastX + ox;
                                    newY = lastY + oy;
                                }
                                
                                module.option.input.forEach(input=>{
                                    if(input.loc && oldX!=undefined){
                                        let ox = input.loc.x - oldX,
                                            oy = input.loc.y - oldY;
                                        input.loc.x = newX + ox;
                                        input.loc.y = newY + oy;
                                    }
                                    let newId = allIdsMap[input._id];
                                    inputIdMap[input._id] = newId;
                                    input._id = newId;
                                    if(input.refModuleId && input.refOutputId){
                                        input.refModuleId = allIdsMap[input.refModuleId];
                                        input.refOutputId = allIdsMap[input.refOutputId];
                                    }
                                });
                                module.option.output.forEach(output=>{
                                    if(output.loc && oldX!=undefined){
                                        let ox = output.loc.x - oldX,
                                            oy = output.loc.y - oldY;
                                        output.loc.x = newX + ox;
                                        output.loc.y = newY + oy;
                                    }
                                    output._id = allIdsMap[output._id];
                                    output.option && output.option.chart && (output.option.chart.forEach(c=>{
                                        c._id = inputIdMap[c._id];
                                    }));
                                });
                                module.option.groups && module.option.groups.forEach(group=>{
                                    if(group.loc && oldX!=undefined){
                                        let ox = group.loc.x - oldX,
                                            oy = group.loc.y - oldY;
                                        group.loc.x = newX + ox;
                                        group.loc.y = newY + oy;
                                    }
                                    group._id = allIdsMap[group._id];
                                });
                                lastX = newX;
                                lastY = newY;
                                if(module.loc){
                                    lastModuleX = module.loc.x;
                                    lastModuleY = module.loc.y;
                                }
                                
                                var opt = Object.assign(module, {
                                    // 模块编号
                                    '_id': allIdsMap[module._id],
                                    'strategyId': id,
                                    'loc': {
                                        'x': newX,
                                        'y': newY,
                                        'w': 155,
                                        'h': 72
                                    }
                                });
                                state.modules.push(module);
                            });

                            dispatch([{
                                type: SKETCHPAD_DROP,
                                data: state
                            },{
                                type: SYNC_STRATEGY_VALUE,
                                value: commonUtil.getSyncValue(state.modules, state.strategy.value)
                            }]);
                        }
                    }).fail(function() {
                        refs.progress.setStatus();
                        message.error(I18n.resource.message.FAIL_GET_TEMPLATE_DATA);
                    });
                    refs.progress.async = [async];
                    break;
                case 'add':
                    state.modules.push(opt);
                    dispatch({
                        type: SKETCHPAD_DROP,
                        data: state
                    });
                    break;
            }
        }

    };

    var stageDragmove = function() {
        return function() {

        };
    };

    var moduleSelect = function(selectedId,layer) {
        return {
            type: SKETCHPAD_MODULES_SELECTED,
            value: selectedId,
            layer
        }
    }

    var updateLoc = function(moduleId, loc, type, id) {
        if(type == 'group'){
            moduleId = moduleId.split('_')[1];
        }
        return {
            type: SKETCHPAD_UPDATE_LOC,
            moduleId: moduleId,
            id: id,
            loc: loc,
            targetType: type
        }
    }

    var outputToInput = function(moduleId, refModuleId, inputId, outputId) {
        return {
            type: SKETCHPAD_OUTPUT_TO_INPUT,
            moduleId: moduleId,
            inputId: inputId,
            outputId: outputId,
            refModuleId: refModuleId
        }
    };

    var moduleClose = function(id) {
        return {
            type: SKETCHPAD_REMOVE_MODULE,
            id: id
        }
    };

    var updateModule = function(moduleId, data) {
        return {
            type: SKETCHPAD_UPDATE_MODULE,
            moduleId: moduleId,
            data: data
        }
    };

    var initData = function(id) {
        return function(dispatch, getState) {
            dispatch({
                type: SKETCHPAD_SPINNER,
                data: true
            });
            snapshot.WebApiStrategyItemGetById && snapshot.WebApiStrategyItemGetById.abort();
            snapshot.WebApiStrategyItemGetById = WebAPI.get('/strategy/item/get/' + id).done(function(rs) {
                if (rs.status === 'OK') {
                    //对strategy value中的错误数据作处理
                    if(rs.data.strategy && rs.data.strategy.value){
                        rs.data.strategy.value = rs.data.strategy.value.filter(v=>v._id!=undefined);
                    }
                    
                    snapshot.set('strategy', rs.data.strategy);
                    snapshot.set('modules', rs.data.modules);
                    snapshot.WebApiStrategyItemGetById = null;
                    let equipTreeActions = namespace('beop.strategy.modules.EquipTree.actions');
                    dispatch([{
                        type: INIT_SKETCHPAD_DATA,
                        data: rs.data
                    },{
                       type: SKETCHPAD_SPINNER,
                        data: false
                    }]);
                    dispatch( equipTreeActions.changeProjTree(rs.data.strategy.projId) );
                    // if(rs.data&&rs.data.strategy&&rs.data.strategy.value&&rs.data.strategy.value.length>0){
                    //     let selectedValueId = getState().equipTree.selectedValueId;
                    //     if(selectedValueId && rs.data.strategy.value.find(o=>o._id==selectedValueId)!==undefined){

                    //     }else{
                    //         dispatch( equipTreeActions.changeSelectedValueId(rs.data.strategy.value[0]._id) );
                    //     }
                    // }else{
                    //     dispatch( equipTreeActions.changeSelectedValueId(undefined) );
                    // }
                }
            }).fail(function() {
                // 获取页面数据失败，回退到策略表格
            });
        }
    };

    var showParamsConfigModal = function() {
        return function(dispatch, getState) {
            let state = getState().sketchpad;
            dispatch(
                namespace('beop.strategy.modules.modals.ParamsConfigModal.actions')
                .showModal({
                    value: state.strategy.value,
                    input: commonUtil.getStrategyInput(state.modules)
                })
            )
        };
    };

    var saveValue = function(value) {
        return {
            type: SAVE_STRATEGY_VALUE,
            data: value
        };
    };
    //更新 类型为 module的属性
    var updateModuleProp = function(id, data) {
        return {
            type: UPDATE_MODULE_PROP,
            id: id,
            data: data
        }
    };

    var syncStrategyValue = function() {
        return function(dispatch, getState) {
            let state = getState().sketchpad;
            let value = state.strategy.value;
            let modules = state.modules;
            dispatch({
                type: SYNC_STRATEGY_VALUE,
                value: commonUtil.getSyncValue(modules, value)
            });
        }
    };

    var isDiffData = function(modules) {
        var diffData = diff(snapshot.get('modules'), Array.toMap(modules, '_id'), function(lhs, rhs, path) {
            var cmp;
            if (path.length !== 2 || ['option', 'loc'].indexOf(path[1]) === -1) return;
            cmp = window.diff(lhs, rhs);
            return cmp !== null;
        });
        return diffData;
    }

    var strategyPreTasksChange = function(ids) {
        return {
            type: SKETCHPAD_STRATEGY_PRETASKS_CHANGE,
            ids: ids
        }
    }

    var closeAddOutLinkModal = function() {
        return {
            type: SKETCHPAD_CLOSE_ADDOUTLINK_MODAL
        }
    }

    var addOutLinkInputs = function(inputs) {
        return {
            type: SKETCHPAD_ADD_ADDOUTLINK_INPUTS,
            inputs: inputs
        }
    }

    var reload = function(){
        return {
            type: SKETCHPAD_DROP,
        };
    }

    var AddMatchingTagsParams = function(data,tagResults){
        return {
            type: ADD_TAGSMATCHINGPARAMTERS,
            data: data,
            tagResults: tagResults
        }
    }

    var deleteValue = function(){
        return function(dispatch, getState) {
            let state = deepClone({},getState()).sketchpad;
            let isNeedUpdate = false;
            let saveOutput = {},
                deleteInput = [],
                deleteModule = [];
            //要删除的输入被模糊规则输出引用时 禁止删除
            let outputNameChartArr = [],
                inputNameArr = [],
                targetInputName = undefined,
                ruleBlockMap = {};
            let isRuleUse = false,
                isOutputUse = false,
                targetOutputName = [];
            if(state.selectedIds.length>0){
                state.modules.forEach(module=>{
                    module.option.input.forEach(input=>{
                        if(input.refModuleId){
                            saveOutput[input.refOutputId]=saveOutput[input.refOutputId]||[];
                            saveOutput[input.refOutputId].push(input._id);
                        }
                    });
                    module.option.output.forEach(output=>{
                        if(output.option&&output.option.chart&&output.option.chart.length>0){
                            let inputName = output.option.chart.map(v=>v.name);
                            outputNameChartArr.push({
                                outputName: output.name,
                                inputName: inputName
                            });
                            inputNameArr = inputNameArr.concat(inputName);
                        }
                    });
                    let ruleBlockInputNameArr = [];
                    module.option.content.ruleBlock.forEach(it=>{
                        ruleBlockInputNameArr = ruleBlockInputNameArr.concat(it.items.map(v=>v.name)).concat(it.results.map(v=>v.name));
                    });
                    ruleBlockMap[module._id] = Array.from(new Set(ruleBlockInputNameArr));
                });
                state.modules.forEach(module=>{
                    let index = state.selectedIds.indexOf(module._id);
                    if(index>-1){
                        deleteModule.push(module._id);
                        isNeedUpdate = true;
                    }else{
                        module.option.input = module.option.input.filter(input=>{
                            let index = state.selectedIds.indexOf(input._id);
                            let otherRuleBlcokNameArr = ruleBlockMap[module._id];
                            if(index<0){
                                return true;
                            }
                            isNeedUpdate = true;
                            targetInputName = input.name;
                            if(inputNameArr.indexOf(input.name)>-1){
                                isOutputUse = true;
                            }
                            if(otherRuleBlcokNameArr.indexOf(input.name)>-1){
                                isRuleUse = true;
                            }
                            return false;
                        });
                        module.option.output = module.option.output.filter(output=>{
                            let index = state.selectedIds.indexOf(output._id);
                            if(index<0){
                                return true;
                            }
                            if(saveOutput[output._id]){
                                isNeedUpdate = true;
                                deleteInput = deleteInput.concat(saveOutput[output._id]);
                                return true;
                            }
                            isNeedUpdate = true;
                            return false; 
                        });
                    }
                });
                deleteModule.forEach(id=>{
                    var index = state.modules.findIndex(function(module) {
                        return module._id == id;
                    });
                    var target = state.modules.splice(index, 1)[0];
                    target.option.output.forEach(output=>{
                        deleteInput = deleteInput.concat(saveOutput[output._id]);
                    });
                });
                
                state.modules.forEach(module=>{
                    let otherRuleBlcokNameArr = ruleBlockMap[module._id];
                    module.option.input = module.option.input.filter(input=>{
                        if(deleteInput.indexOf(input._id)>-1){
                            targetInputName = input.name;
                            if(inputNameArr.indexOf(input.name)>-1){
                                isOutputUse = true;
                            }
                            if(otherRuleBlcokNameArr.indexOf(input.name)>-1){
                                isRuleUse = true;
                            }
                            return false;
                        }
                        return true;
                    });
                    if(isOutputUse){
                        outputNameChartArr.forEach(v=>{
                            if(v.inputName.indexOf(targetInputName)>-1){
                                targetOutputName.push(v.outputName);
                            }
                        });
                    }
                });
            }
            if(isNeedUpdate){
                if(isOutputUse||isRuleUse){
                    let description = '';
                    if(isOutputUse){
                        description += `该输入参数存在图表引用，请先删除输出参数${targetOutputName.join()}的引用`;
                        if(isRuleUse){
                            description += '并且'
                        }
                    }
                    if(isRuleUse){
                        description += `该输入参数存在规则引用，请先删除规则引用`;
                    }
                    
                    notification['warning']({
                        key:'delete'+targetInputName,
                        duration:null,
                        message: '删除失败',
                        description: description,
                    });
                }else{
                    dispatch([{
                        type: SKETCHPAD_DROP,
                        data: state
                    },{
                        type: SYNC_STRATEGY_VALUE,
                        value: commonUtil.getSyncValue(state.modules, state.strategy.value)
                    }]);
                    dispatch({
                        type: SKETCHPAD_MODULES_SELECTED,
                        value: 'clear'
                    })
                }
            }
        }
    }

    var updateModules = function(modules) {
        return {
            type: UPDATE_MODULES,
            value: modules
        }
    }

    // 需要暴露给外部调用的 action
    exports.actions = {
        clear,
        doBatchConfig,
        doExport,
        doDebug,
        doSave,
        doBack,
        stageDrop,
        stageDragmove,
        moduleSelect,
        updateLoc,
        outputToInput,
        moduleClose,
        updateModule,
        initData,
        showParamsConfigModal,
        saveValue,
        updateModuleProp,
        syncStrategyValue,
        isDiffData,
        strategyPreTasksChange,
        closeAddOutLinkModal,
        addOutLinkInputs,
        reload,
        deleteValue,
        AddMatchingTagsParams,
        updateModules
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [SKETCHPAD_DROP]: (state, action) => {
            state = action.data||state;
            state = deepClone({}, state);
            return state;
        },
        [SKETCHPAD_MODULES_SELECTED]: (state, action) => {
            state = deepClone({}, state);
            var selectedId = action.value;
            if (selectedId === 'clear') {
                state.selectedIds = [];
            } else {
                let target = Array.from(action.layer.children).find(c=>c.attrs.id == selectedId || c.attrs.name && c.attrs.name.split(' ').indexOf(selectedId)>-1);
                var index = state.selectedIds.indexOf(selectedId);
                if (index > -1) { //已经是选中状态
                    state.selectedIds.splice(index, 1);
                } else { //不是选中状态
                    state.selectedIds = [selectedId];
                }
                let layer = Array.from(action.layer.parent.children).find(c=>c.attrs.id == 'layer'),
                    moduleLayer = Array.from(action.layer.parent.children).find(c=>c.attrs.id == 'moduleLayer');
                [layer, moduleLayer].forEach(l=>{
                    l.find('.selected').forEach(g=>{
                        g.find('.dragLayer')[0].fire('draglayerclickfire',{isSelected:false});
                    });
                })
                target && target.find('.dragLayer')[0].fire('draglayerclickfire',{isSelected:index < 0});
            }
            return state;
        },
        [SKETCHPAD_UPDATE_LOC]: (state, action) => {
            //TODO id为标识符
            state = deepClone({}, state);
            var { id, loc, targetType, moduleId } = action;
            var target;
            let inputArr = [],
                outputArr = [],
                groupArr = [];
            
            state.modules.forEach(function(module) {
                if(moduleId == module._id){
                    target = module;
                }
                inputArr = inputArr.concat(module.option.input);
                outputArr = outputArr.concat(module.option.output);
                groupArr = groupArr.concat(module.option.groups);
            });
            switch(targetType){
                case 'modular':
                    break;
                case 'input':
                    inputArr.forEach(function(input) {
                        if (input._id == id) {
                            target = input;
                        }
                    });
                    break;
                case 'output':
                    outputArr.forEach(function(output) {
                        if (output._id == id) {
                            target = output;
                        }
                    });
                    break;
                case 'group':
                    groupArr.forEach(function(group) {
                        if (group._id == id) {
                            target = group;
                        }
                    });
                    break;
            }
            if (target) {
                target.loc.x = loc.x;
                target.loc.y = loc.y;
                target.loc.w = loc.w;
                target.loc.h = loc.h;
            }
            return state;
        },
        [SKETCHPAD_OUTPUT_TO_INPUT]: (state, action) => {
            state = deepClone({}, state);
            var { moduleId, refModuleId, inputId, outputId } = action;
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
            var inputTarget, outputTarget, inputNanmeSet;

            state.modules.forEach(function(module) {
                if (module._id == moduleId) {
                    inputNanmeSet = new Set();
                    module.option.input.forEach(function(input) {
                        if (input._id == inputId) {
                            inputTarget = input;
                        } else {
                            inputNanmeSet.add(input.name);
                        }
                    });
                }
                if (module._id == refModuleId) {
                    module.option.output.forEach(function(output) {
                        if (output._id == outputId) {
                            outputTarget = output;
                        }
                    });
                }
            });
            if (inputTarget && outputTarget) {
                inputTarget.type = enumerators.moduleInputOutputTypes.OTHER_MODULES;
                // inputTarget.name = rename(action.newName, 0, inputNanmeSet);
                // inputTarget.name = outputTarget.name;
                inputTarget.refModuleId = refModuleId;
                inputTarget.refOutputId = outputTarget._id;
                //更新原来的名字
                // outputTarget.name = inputTarget.name;
            }
            return state;
        },

        [SKETCHPAD_REMOVE_MODULE]: (state, action) => {
            state = deepClone({}, state);
            var removeInput = function(module, id) {
                var index = module.option.input.findIndex(function(input) {
                    return input.type == enumerators.moduleInputOutputTypes.OTHER_MODULES && input.refModuleId == id;
                });
                if (index > -1) {
                    module.option.input.splice(index, 1);
                    removeInput(module, id);
                } else {
                    return;
                }
            };
            var index = state.modules.findIndex(function(module) {
                return module._id == action.id;
            });
            // state.strategy.value.splice(index, 1);
            var target = state.modules.splice(index, 1)[0];
            state.modules.forEach(function(module) {
                removeInput(module, target._id);
            });
            if(state.selectedIds.indexOf(action.id)>-1){
                state.selectedIds = [];
            }
            return state;
        },

        [SKETCHPAD_UPDATE_MODULE]: (state, action) => {
            state = deepClone({}, state);
            var { moduleId, data } = action;
            state.modules.forEach((module) => {
                if (module._id == moduleId) {
                    module.option = deepClone({}, data);
                }
            });
            return state;
        },

        [SKETCHPAD_RELOAD]: (state, action) => {
            state = deepClone({}, state);
            state.tagResults = [];
            return state;
        },

        [INIT_SKETCHPAD_DATA]: (state, action) => {
            return Object.assign({}, state, { modules: action.data.modules, strategy: action.data.strategy });
        },

        [SAVE_STRATEGY_VALUE]: (state, action) => {
            return Object.assign({}, state, {
                strategy: Object.assign({}, state.strategy, {
                    value: action.data
                })
            })
        },

        [UPDATE_MODULE_PROP]: (state, action) => {
            state = deepClone({}, state);
            var { id, data } = action;
            var params = [];
            var isMatchModule = false;

            state.modules.some(function(module) {
                if (module._id === id) {
                    isMatchModule = true;
                    commonUtil.merge(module, data);
                    return true;
                }
                params = params.concat(module.option.input).concat(module.option.output);
            });

            if (!isMatchModule) {
                params.some(row => {
                    if (row._id === id) {
                        commonUtil.merge(row, data);
                        return true;
                    }
                })
            }
            return state;
        },

        [SYNC_STRATEGY_VALUE]: (state, action) => {
            return Object.assign({}, state, {
                strategy: Object.assign({}, state.strategy, { value: action.value })
            });
        },

        [CLEAR_SKETCHPAD]: (state, action) => {
            return Object.assign({}, state, {
                tagResults : [],
                modules: []
            });
        },

        [SKETCHPAD_STRATEGY_PRETASKS_CHANGE]: (state, action) => {
            return Object.assign({}, state, {
                strategy: Object.assign({}, state.strategy, { preTasks: action.ids })
            });
        },

        [SKETCHPAD_SHOW_ADDOUTLINK_MODAL]: (state, action) => {
            if (state.strategy._id == action.data.strategy._id) {
                return Object.assign({}, state);
            }
            return Object.assign({}, state, {
                showAddOutLinkModal: true,
                outLinkData: action.data,
                targetModuleId: action.targetModuleId
            });
        },

        [SKETCHPAD_CLOSE_ADDOUTLINK_MODAL]: (state, action) => {
            return Object.assign({}, state, {
                showAddOutLinkModal: false,
                outLinkData: undefined,
                targetModuleId: undefined
            });
        },

        [SKETCHPAD_ADD_ADDOUTLINK_INPUTS]: (state, action) => {
            state = deepClone({}, state);
            let target = state.modules.find(module => module._id == state.targetModuleId);
            if (target) {
                target.option.input = target.option.input.concat(action.inputs);
            }
            Object.assign(state, {
                showAddOutLinkModal: false,
                outLinkData: undefined,
                targetModuleId: undefined
            })
            return state;
        },

        [SKETCHPAD_SPINNER]: (state, action) => {
            state = deepClone({}, state);
            state.bShowSpin = action.data;
            return state;
        },

        [ADD_TAGSMATCHINGPARAMTERS]: (state, action) => {
            state = deepClone({}, state);
            state.tagResults = action.tagResults;
            action.data.forEach(function(row){
                state.strategy.value.some(function(item){
                    if(row._id === item._id){
                        var list = deepClone({},item.list);
                        item.list = $.extend(true,{},list, row.list);
                        return true;
                    }
                });
            });
            return state;
        },

        [UPDATE_PROP]: (state, action) => {
            return Object.assign({}, state, { selectedIds: action.selectedIds });
        },
        [UPDATE_MODULES]: (state, action)=>{
            state = deepClone({}, state);
            state.modules = action.value;
            
            return state;
        }        
    }

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        modules: [],
        strategy: null,
        selectedIds: [],
        outLinkData: undefined,
        showAddOutLinkModal: false,
        targetModuleId: undefined,
        bShowSpin: false,
        tagResults: [],
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
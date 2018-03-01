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
            namespace('ReactRedux'),
            namespace('beop.strategy.common'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.modules.DebugView'), function(
    exports,
    ReactRedux,
    commonUtil,
    enumerators
) {

    const deepClone = $.extend.bind($, true);
    let async = undefined;
    // ------------------------------------
    // Constants
    // ------------------------------------
    const TOGGLE_MODULE_DEBUG_PANEL = 'TOGGLE_MODULE_DEBUG_PANEL';
    const DEBUG_RUN = 'DEBUG_RUN';
    const CONST_CLEAR = 'CONST_CLEAR';
    const SET_DEBUG_VALUE = 'SET_DEBUG_VALUE';
    const SELECTED_PUTS = 'SELECTED_PUTS';
    const SELECTED_PUT = 'SELECTED_PUT';
    const DBCLCIK_PUTS = 'debugView.DBCLCIK_PUTS';
    const DEBUGVIEW_CLEAR = 'DEBUGVIEW_CLEAR';
    const CONSOLE_CLEAR = 'debugView.CONSOLE_CLEAR';
    const CLOSE_VALUE_MODAL = 'debugView.CLOSE_VALUE_MODAL';

    // ------------------------------------
    // Actions
    // ------------------------------------
    const toggleModuleDebugPanel = function() {
        return {
            type: TOGGLE_MODULE_DEBUG_PANEL
        };
    };
    const clear = function(info,startFn,endFn){
        if(async){
            async.abort();
            async = undefined;
        }
        return function(dispatch){
            dispatch({
                type:DEBUGVIEW_CLEAR
            });
        }
    };
    const doRun = function(info,startFn,endFn) {
        return function(dispatch, getState) {
            var {debugValue, strategy, modules, ds, tempDebugValue} = info;
            // debugValue = (function(debugValue,ds){
            //     let obj = deepClone({},debugValue);
            //     for(let k in debugValue){
            //         for(let k2 in ds[k]){
            //             obj[k][k2] = debugValue[k][k2];
            //             if(ds[k][k2]!=undefined){
            //                 obj[k][k2] = ds[k][k2];
            //             }
            //         }
            //     }
            //     return obj;
            // })(debugValue,ds);
            const state = getState();
            const selectedValueId = state.equipTree.selectedValueId;
            const runSelectedValueId = state.debugParamsPanel.selectedId;
            startFn();
            let dictDebugger = (function(tempDebugValue){
                let obj = {};
                for(let k in tempDebugValue){
                    Object.assign(obj,tempDebugValue[k]);
                }
                for(let k in obj){
                    let str = obj[k];
                    let isString1 = /^'[\s\S]*'$/,
                        isString2 = /^"[\s\S]*"$/,
                        isObj = /^{[\s\S]*}$/,
                        isArr = /^[[\s\S]*]$/;
                    if(isString1.test(str)||isString2.test(str)){
                        obj[k] = str.substring(1,str.length-1);
                    }else if(isObj.test(str)||isArr.test(str)){
                        try{
                            str = str.replace(/'/g,'"').replace(/[\r\n]/g, "");
                            JSON.parse(str);
                            obj[k] = str;
                        }catch(e){
                            delete obj[k];
                        }
                    }else if(!isNaN(Number(str))){
                        obj[k] = Number(str);
                    }else{
                        delete obj[k];
                    }
                }
                return obj;
            })(tempDebugValue);
            let data = [],
                result = {rs:{},input:{}};
            async = WebAPI.post("/strategy/run", {
                "strategy_id": strategy._id,
                "projId": AppConfig.projectId,
                "name": strategy.name,
                "valueId": runSelectedValueId||selectedValueId,
                "option": {
                    "dictDebugger": dictDebugger
                }
            }).done(function(r){
                data.push({level:1,msg:I18n.resource.message.TIME+timeFormat(new Date())});
                if(!r){
                    data.push({level:3,msg:I18n.resource.message.ERROR_NULL});
                }else{
                    if(r.error == 1){
                        data.push({level:3,msg:I18n.resource.message.ERROR+r.msg});
                    }else{
                        let keys = Object.keys(r.rs),
                            moduleKeys = keys.map(
                                key=>{
                                    if(key.slice(0,3)=='mod'){
                                        return key.slice(3);
                                    }
                                }
                            );
                        let resultInput = {},
                            resultInputKeys = [];
                        try{
                            resultInput = JSON.parse(r.input);
                            resultInputKeys = Object.keys(resultInput);
                        }catch(e){
                            
                        }
                        modules.forEach((module)=>{
                            if(moduleKeys.indexOf(module._id)>-1){
                                switch(module.type){
                                    case enumerators.moduleTypes.FUZZY_RULE:
                                        let rs = r.rs['mod'+module._id];
                                        let faultNum = 0;
                                        try{
                                            rs = JSON.parse(rs);
                                            let arr = Object.values(rs)[0],
                                                faultNameMap = Array.toMap(arr,'FaultName');
                                            module.option.output.forEach((v)=>{
                                                let fault = faultNameMap[v.name];
                                                if(fault && fault.Status!=0){
                                                    faultNum++;
                                                    data.push({level:1,msg:I18n.resource.message.OUTPUT+module.name+' '+v.name+'：'+JSON.stringify(fault)});
                                                    data.push({level:101,msg:I18n.resource.message.DETAILS,faultId:v.option.faultId});
                                                    // data.push({level:4,msg:I18n.resource.message.FAULT_GRADE+enumerators.faultGradeName[v.option&&v.option.grade||0]});
                                                    // data.push({level:4,msg:I18n.resource.message.DESCRIPTION+(v.option&&v.option.desc||I18n.resource.message.NOTHING)});
                                                    // data.push({level:4,msg:I18n.resource.message.SUGGESTION+(v.option&&v.option.advise||I18n.resource.message.NOTHING)});
                                                }
                                            });
                                        }catch(e){
                                            
                                        }
                                        
                                        if(typeof rs == 'string'){
                                            if(rs == "False"){
                                                rs = I18n.resource.message.UNKNOWN_ERROR;
                                            }
                                            data.push({level:3,msg:I18n.resource.message.ERROR+rs});
                                        }else if(faultNum==0){
                                            data.push({level:1,msg:I18n.resource.message.NO_FAULTS});
                                        }
                                        break;
                                }
                            }
                            module.option.output.forEach((output)=>{
                                if(keys.indexOf(output._id)>-1){
                                    result.rs[output._id] = r.rs[output._id];
                                    data.push({level:1,msg:I18n.resource.message.OUTPUT+module.name+' '+output.name+'：'+r.rs[output._id]});
                                }
                            });
                            module.option.input.forEach(input=>{
                                result.input[module._id] = result.input[module._id] || {};
                                if(resultInputKeys.indexOf(input._id)>-1){
                                    result.input[module._id][input._id] = JSON.stringify(resultInput[input._id]);
                                }
                            });
                        });
                    }
                }
            }).fail(()=>{
                data.push({level:3,msg:I18n.resource.message.ERROR_NETWORK_FAIL});
            }).always(()=>{
                async = undefined;
                data.push({level:4,msg:''});
                endFn();
                dispatch({
                    type: DEBUG_RUN,
                    data: data,
                    runResult: result,
                    debugValue: (function(debugValue,ds){
                        let obj = deepClone({},debugValue);
                        for(let k in debugValue){
                            for(let k2 in ds[k]){
                                obj[k][k2] = debugValue[k][k2];
                                if(ds[k][k2]!=undefined){
                                    obj[k][k2] = ds[k][k2];
                                }
                            }
                        }
                        return obj;
                    })(debugValue,ds),
                })
            });
            return async;
        };
    };
    const doClear = function(){
        return {
            type: CONST_CLEAR
        }
    };
    const setDebugValue = function(list){
        return {
            type:SET_DEBUG_VALUE,
            list:list
        }
    };
    const selectedPuts = function(ids){
        return {
            type:SELECTED_PUTS,
            ids:ids
        }
    };
    const selectedPut = function(id){
        return {
            type:SELECTED_PUT,
            id:id
        }
    };
    const dbClickPuts = function(id){
        return {
            type:DBCLCIK_PUTS,
            id:id
        }
    };
    const closeValueModal = function(){
        return {
            type:CLOSE_VALUE_MODAL,
        }
    };
    const clearConsole = function(){
        return {
            type:CONSOLE_CLEAR
        }
    };
    // 需要暴露给外部调用的 action
    exports.actions = {
        toggleModuleDebugPanel,
        clear,
        doRun,
        doClear,
        setDebugValue,
        selectedPuts,
        selectedPut,
        dbClickPuts,
        clearConsole,
        closeValueModal
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [TOGGLE_MODULE_DEBUG_PANEL]: (state) => {
            state = deepClone({}, state);
            state.bShowDebugPanel = !state.bShowDebugPanel;
            return state;
        },
        [DEBUGVIEW_CLEAR]: (state,action) => {
            state = deepClone({}, state);
            state.consoleInfo = [];
            state.runResult = {};
            state.selectedPutsId = [];
            state.selectedPutId = undefined;
            state.selectedInputId = [];
            state.dbClick = false;
            return state;
        },
        [DEBUG_RUN]: (state,action) => {
            state = deepClone({}, state);
            state.consoleInfo = state.consoleInfo.concat(action.data);
            state.runResult = action.runResult;
            state.debugValue = action.debugValue;
            return state;
        },
        [CONST_CLEAR]:(state)=>{
            state = deepClone({}, state);
            state.consoleInfo = [];
            return state;
        },
        [SET_DEBUG_VALUE]:(state,action)=>{
            state = deepClone({}, state);
            state.debugValue = action.list;
            return state;
        },
        [SELECTED_PUTS]:(state,action)=>{
            state = deepClone({}, state);
            if(state.selectedPutsId.indexOf(action.ids)>-1){
                state.selectedPutsId = [];
            }else{
                state.selectedPutsId = [action.ids];
            }
            return state;
        },
        [SELECTED_PUT]:(state,action)=>{
            state = deepClone({}, state);
            state.selectedPutId = action.id;
            return state;
        },
        [DBCLCIK_PUTS]:(state,action)=>{
            state = deepClone({}, state);
            state.selectedPutsId = [action.id];
            state.dbClickPut = true;
            return state;
        },
        [CLOSE_VALUE_MODAL]:(state,action)=>{
            state = deepClone({}, state);
            // state.selectedPutsId = [];
            state.dbClickPut = false;
            return state;
        },
        [CONSOLE_CLEAR]: (state,action)=>{
            state = deepClone({}, state);
            state.consoleInfo = [];
            return state;
        }
            
    };
// http://192.168.1.123/strategy/painter/1487646815811262a4017c4f
    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        consoleInfo: [],
        debugValue:{},
        selectedPutsId:[],
        selectedPutId:undefined,
        runResult:{},
        dbClickPut:false,
    };
    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
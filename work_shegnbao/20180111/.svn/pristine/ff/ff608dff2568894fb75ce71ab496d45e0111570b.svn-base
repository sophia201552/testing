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
            namespace('beop.strategy.common')
        );
    }
}(namespace('beop.strategy.modules.ModulePropPanel'), function(
    exports,
    ReactRedux,
    commonUtil
) {

    const deepClone = $.extend.bind($, true);

    // ------------------------------------
    // Constants
    // ------------------------------------
    const CHANGE_PROP = 'ModulePropPanel.CHANGE_PROP';
    const SET_PROP_DATA = 'ModulePropPanel.SET_PROP_DATA';

    // ------------------------------------
    // Actions
    // ------------------------------------
    var changeProp = function(key, value) {
        return function(dispatch, getState) {
            dispatch({
                type: CHANGE_PROP,
                key: key,
                value: value
            });
            var state = getState();
            var data;
            if (key === 'option.timeRange.type') {
                data = commonUtil.generateObjectByPath('option.timeRange', state.modulePropPanel.data.option.timeRange);
            } else { 
                data = commonUtil.generateObjectByPath(key, value);
            }
            
            var actions = namespace('beop.strategy.modules.Sketchpad.actions');
            dispatch(actions.updateModuleProp(state.modulePropPanel.data._id, data));
        };
    };

    var setPropData = function(selectedId) {
            return function(dispatch, getState) {
                selectedId = selectedId || getState().sketchpad.selectedIds;
                if (selectedId.length === 0) {
                    dispatch({
                        type: SET_PROP_DATA,
                        data: null
                    });
                } else {
                    let modulesArr = getState().sketchpad.modules;
                    var selectedItem = false;
                    for (var i = 0, length = modulesArr.length; i < length; i++) {
                        if(selectedItem){
                            break;
                        }
                        if (modulesArr[i]._id === selectedId[0]) {
                            dispatch({
                                type: SET_PROP_DATA,
                                data: modulesArr[i]
                            });
                        }else{
                            //输入输出值的tag更新
                            modulesArr[i].option.input.some(function(row){
                                if(row._id === selectedId[0]){
                                    selectedItem = true;
                                    var data = {
                                        _id:row._id,
                                        type: 300,
                                        option: row.option
                                    };
                                    dispatch({
                                        type: SET_PROP_DATA,
                                        data: data
                                    });
                                    return true;
                                }
                            });
                            if(!selectedItem){
                                modulesArr[i].option.output.some(function(row){
                                    if(row._id === selectedId[0]){
                                        selectedItem = true;
                                        var data = {
                                            _id:row._id,
                                            type: 301,
                                            option: row.option
                                        };
                                        dispatch({
                                            type: SET_PROP_DATA,
                                            data: data
                                        });
                                        return true;
                                    }
                                });
                            }
                        }
                    }
                }
            }
        };
        // 需要暴露给外部调用的 action
    exports.actions = {
        changeProp,
        setPropData
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [CHANGE_PROP]: (state, action) => {
            var state = deepClone({}, state);
            var keyArr = action.key.split('.');
            var str = 'state.data';
            if (keyArr.length !== 1) {
                for (var i = 0, length = keyArr.length; i < length; i++) {
                    str = str + "." + keyArr[i];
                }
                //如果是时间选择
                if (str.indexOf('option.timeRange.option.timeStart') !== -1 || str.indexOf('option.timeRange.option.timeEnd') !== -1) {
                    action.value = action.value.format('YYYY-MM-DD HH:mm:ss');
                }
                //tags处理
                if(action.key === "option.tags"){
                    state.data.option.tags = action.value;
                }else{
                    if(action.value=== ''){
                        eval(str + "=" + "''");
                    }else{
                        if (isNaN(Number(action.value))) {
                            eval(str + "=" + "'" + action.value + "'");
                        } else {
                            eval(str + "=" + Number(action.value));
                        }
                    }
                }

                //切换配置时间的模式
                if (action.key === 'option.timeRange.type') {
                    if(action.value === ''){
                        state.data.option.timeRange.option = {};
                    }else if (Number(action.value) === 0) {
                        state.data.option.timeRange.option = {
                            "period": "yesterday"
                        }
                    } else if (Number(action.value) === 1) {
                        state.data.option.timeRange.option = {
                            "timeStart": moment().subtract('hours', 1).format('YYYY-MM-DD HH:mm:ss'),
                            "timeEnd": moment().format('YYYY-MM-DD HH:mm:ss'),
                            "timeFormat": 'm5',
                        }
                    } else if (Number(action.value) === 2) {
                        state.data.option.timeRange.option = {
                            "timeFormat": 'm5',
                            "timeUnit": "hour",
                            "numberOfUnit": 1
                        }
                    }
                }
                //切换固定周期下的采样周期
                if (action.key === 'option.timeRange.option.timeFormat') {
                    var type = state.data.option.timeRange.type;
                    if (type === 1) {
                        switch (action.value) {
                            case 'm1':
                                state.data.option.timeRange.option.timeStart = moment().subtract('hours', 1).format('YYYY-MM-DD HH:mm:ss');
                                state.data.option.timeRange.option.timeEnd = moment().format('YYYY-MM-DD HH:mm:ss');
                                break;
                            case 'm5':
                                state.data.option.timeRange.option.timeStart = moment().subtract('hours', 1).format('YYYY-MM-DD HH:mm:ss');
                                state.data.option.timeRange.option.timeEnd = moment().format('YYYY-MM-DD HH:mm:ss');
                                break;
                            case 'h1':
                                state.data.option.timeRange.option.timeStart = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
                                state.data.option.timeRange.option.timeEnd = moment().format('YYYY-MM-DD HH:mm:ss');
                                break;
                            case 'd1':
                                state.data.option.timeRange.option.timeStart = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss');
                                state.data.option.timeRange.option.timeEnd = moment().format('YYYY-MM-DD HH:mm:ss');
                                break;
                            case 'M1':
                                state.data.option.timeRange.option.timeStart = moment().subtract(1, 'years').format('YYYY-MM-DD HH:mm:ss');
                                state.data.option.timeRange.option.timeEnd = moment().format('YYYY-MM-DD HH:mm:ss');
                                break;
                        }
                    }
                }
            } else {
                state.data[action.key] = action.value;
            }
            return state;
        },
        [SET_PROP_DATA]: (state, action) => {
            return Object.assign({}, state, { data: deepClone({}, action.data) });
        }
    }

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        data: null
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
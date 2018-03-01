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
            namespace('ReactRedux'),
            namespace('antd'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.modules.FaultInfo'), function(
    exports,
    ReactRedux,
    antd,
    enums
) {

    var deepClone = $.extend.bind($, true);
    var updateTableAsync = null;
    // ------------------------------------
    // Constants
    // ------------------------------------
    var INIT_DATA = 'INIT_DATA';  
    var UPDATE_TABLE = 'faultInfo.UPDATE_TABLE';
    var UPDATE_SELECTED = 'faultInfo.UPDATE_SELECTED';
    var UPDATE_FROM = 'faultInfo.UPDATE_FROM';
    // ------------------------------------
    // Actions
    // ------------------------------------
    var initData = function() {
         return function (dispatch, getState) {
             WebAPI.get('/diagnosis_v2/getFaultsClassNames/'+I18n.type).done(function (rs) {
                 var classNameArr = rs.data[0].nameArr,
                     classNameCount = rs.data[0].count,
                     consequencesNameArr = rs.data[1].nameArr,
                     consequencesCount = rs.data[1].count,
                     gradeNameArr = rs.data[2].nameArr,
                     gradeCount = rs.data[2].count;
                 WebAPI.post('/diagnosis_v2/getFaultsInfo', {
                    "pageNum": 1,
                    "pageSize": 20,
                    "grades": [],
                    "consequences": [],
                    "keywords": '',
                    "classNames": [],
                    "sort": [],
                    "lan": I18n.type
                }).done(function (rs) {
                    var data = rs.data.data;
                    var totalNum = rs.data.total;
                    dispatch({
                        type: INIT_DATA,
                        data: {
                            classNameArr: classNameArr,
                            consequencesNameArr: consequencesNameArr,
                            gradeNameArr: gradeNameArr,
                            classNameCount: classNameCount,
                            consequencesCount: consequencesCount,
                            gradeCount: gradeCount,
                            faultData: data,
                            page: 1,
                            totalNum: totalNum
                        }
                    });
                });
             })
        }
    };
    var updateTable = function(obj){
        return function (dispatch, getState) {
            let state = getState().faultInfo;

            let postData = {
                "pageNum": state.page,
                "pageSize": 20,
                "grades": state.selectedGrade,
                "consequences": state.selectedConsequence,
                "keywords": state.searchKey,
                "classNames": state.selectedClassName,
                "sort": [],
                "lan": I18n.type
            }
            if(updateTableAsync){updateTableAsync.abort()}
            updateTableAsync = WebAPI.post('/diagnosis_v2/getFaultsInfo', Object.assign(postData, obj)).done(function (rs) { 
                var data = rs.data.data;
                var totalNum = rs.data.total;
                dispatch({
                    type: UPDATE_TABLE,
                    data: {
                        items: data,
                        page: postData.pageNum,
                        totalNum: totalNum
                    }
                });
            }).always(()=>{
                updateTableAsync = null;
            })
        }
    }
    var updateSelected = function(obj){
        return {
            type: UPDATE_SELECTED,
            data: obj
        }
    }
    var updateFrom = function(){
        return {
            type: UPDATE_FROM
        }
    }
    
    // 需要暴露给外部调用的 action
    exports.actions = {
        initData,
        updateTable,
        updateSelected,
        updateFrom
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [INIT_DATA]: (state, action) => {
            var data = action.data;
            var { classNameArr, consequencesNameArr, gradeNameArr, classNameCount, consequencesCount, gradeCount, faultData, page, totalNum} = data;
            return Object.assign({}, state, {
                classNameArr: classNameArr,
                consequencesNameArr: consequencesNameArr,
                gradeNameArr: gradeNameArr,
                classNameCount: classNameCount,
                consequencesCount: consequencesCount,
                gradeCount: gradeCount,
                items: faultData,
                page: page,
                totalNum: totalNum
            });
        },
        [UPDATE_TABLE]: (state, action) =>{
            return Object.assign({}, state, {
                items: action.data.items,
                page: action.data.page,
                totalNum: action.data.totalNum
            });
        },
        [UPDATE_SELECTED]: (state, action)=>{
            return Object.assign({}, state, action.data);
        },
        [UPDATE_FROM]: (state, action)=>{
            return Object.assign({}, state, {isFromPainter: true});
        }
    }

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        searchKey: '',
        classNameArr: [],
        consequencesNameArr: [],
        gradeNameArr: [],
        classNameCount: [],
        consequencesCount: [],
        gradeCount: [],
        selectedClassName: [],
        selectedGrade: [],
        selectedConsequence: [],
        items: [],
        page: 1,
        totalNum: '',
        isFromPainter: false
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
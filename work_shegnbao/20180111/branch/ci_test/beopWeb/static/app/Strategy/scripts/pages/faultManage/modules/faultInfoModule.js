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
    // ------------------------------------
    // Constants
    // ------------------------------------
    var INIT_DATA = 'INIT_DATA';
    var SELECT_ITEM = 'SELECT_ITEM';
    var CHANGE_SEARCH_KEY = 'CHANGE_SEARCH_KEY';
    var CHANGE_PAGE_NUM = 'CHANGE_PAGE_NUM';
    var IS_SHOW_MORE = 'IS_SHOW_MORE';    
    // ------------------------------------
    // Actions
    // ------------------------------------
    var initData = function(id) {
         return function (dispatch, getState) {
             WebAPI.get('/diagnosis_v2/getFaultsClassNames').done(function (rs) {
                 var classNameArr = rs.data;
                 if (classNameArr.length > 8){
                     classNameArr = classNameArr.slice(0, 8);
                 }
                 WebAPI.post('/diagnosis_v2/getFaultsInfo', {
                    "pageNum": 1,
                    "pageSize": 20,
                    "grades": [],
                    "consequences": [],
                    "keywords": '',
                    "classNames": [],
                    "sort": [],
                    "lan": 'zh'
                }).done(function (rs) {
                    var data = rs.data.data;
                    var totalNum = rs.data.total;
                    dispatch({
                        type: INIT_DATA,
                        data: {
                            classNameArr: classNameArr,
                            faultData: data,
                            page: 1,
                            totalNum: totalNum
                        }
                    });
                });
             })
        }
    };    
    var selectItem = function (selectName, categoryName, checkedStatus) {
         return function (dispatch, getState) {
             var allData = getState().faultInfo;
             var selectedClassName = allData.selectedClassName,
                 selectedConsequence = allData.selectedConsequence,
                 selectedGrade = allData.selectedGrade;
             
             if (checkedStatus === 'checkButton') {
                 if (categoryName === 'className') {
                     var index = selectedClassName.findIndex(function (v) { return v === selectName; })
                     selectedClassName.splice(index, 1);
                 } else if (categoryName === 'consequence') {
                    switch(selectName)
                        {
                        case enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.ENERGY_WASTE]:
                            selectName = 'Energy waste';
                            break;
                        case enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.COMFORT_ISSUE]:
                            selectName = 'Comfort issue';
                            break;
                        case enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.EQUIPMENT_HEALTH]:
                            selectName = 'Equipment Health';
                            break;
                        case enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.OTHER]:
                            selectName = 'Other';
                            break;
                        }
                     var index = selectedConsequence.findIndex(function (v) { return v === selectName; })
                     selectedConsequence.splice(index, 1);
                 } else if (categoryName === 'grade') {
                     if (selectName === enums.faultGradeName[enums.faultGrade.ABNORMAL]){
                         selectName = 1;
                     } else if (selectName === enums.faultGradeName[enums.faultGrade.FAULT]){
                         selectName = 2;
                     }
                     var index = selectedGrade.findIndex(function (v) { return v === selectName; })
                     selectedGrade.splice(index, 1);
                 }
             } else {
                 if (categoryName === 'className') {
                     selectedClassName.push(selectName);
                 } else if (categoryName === 'consequence') {
                     switch(selectName)
                        {
                        case enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.ENERGY_WASTE]:
                            selectName = 'Energy waste';
                            break;
                        case enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.COMFORT_ISSUE]:
                            selectName = 'Comfort issue';
                            break;
                        case enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.EQUIPMENT_HEALTH]:
                            selectName = 'Equipment Health';
                            break;
                        case enums.fuzzyRuleFaultEffectNames[enums.fuzzyRuleFaultEffect.OTHER]:
                            selectName = 'Other';
                            break;
                        }
                     selectedConsequence.push(selectName);
                 } else if (categoryName === 'grade') {
                     if (selectName === enums.faultGradeName[enums.faultGrade.ABNORMAL]){
                         selectName = 1;
                     } else if (selectName === enums.faultGradeName[enums.faultGrade.FAULT]){
                         selectName = 2;
                     }
                     selectedGrade.push(selectName);
                 }
              }

            WebAPI.post('/diagnosis_v2/getFaultsInfo', {
                "pageNum": 1,
                "pageSize": 20,
                "grades": selectedGrade,
                "consequences": selectedConsequence,
                "keywords": '',
                "classNames": selectedClassName,
                "sort": [],
                "lan": 'zh'
            }).done(function (rs) { 
                var data = rs.data.data;
                var totalNum = rs.data.total;
                dispatch({
                    type: SELECT_ITEM,
                    data: {
                        selectedClassName: selectedClassName,
                        selectedGrade: selectedGrade,
                        selectedConsequence: selectedConsequence,
                        items: data,
                        page: 1,
                        totalNum: totalNum
                    }
                });
            })
         }
    };
    var changeSearchKey = function (value) {
        return function (dispatch, getState) {
            var allData = getState().faultInfo;
            var selectedClassName = allData.selectedClassName,
                 selectedConsequence = allData.selectedConsequence,
                 selectedGrade = allData.selectedGrade;
            WebAPI.post('/diagnosis_v2/getFaultsInfo', {
                "pageNum": 1,
                "pageSize": 20,
                "grades": selectedGrade,
                "consequences": selectedConsequence,
                "keywords": value,
                "classNames": selectedClassName,
                "sort": [],
                "lan": 'zh'
            }).done(function (rs) { 
                var data = rs.data.data;
                var totalNum = rs.data.total;
                dispatch({
                    type:  CHANGE_SEARCH_KEY,
                    data: {
                        value: value,
                        items: data,
                        page: 1,
                        totalNum: totalNum
                    }
                });
            })
        }
    };
    var changePageNum = function (num) {
        return function (dispatch, getState) {
            var allData = getState().faultInfo;
            var selectedClassName = allData.selectedClassName,
                selectedConsequence = allData.selectedConsequence,
                selectedGrade = allData.selectedGrade,
                searchKey = allData.searchKey;
            WebAPI.post('/diagnosis_v2/getFaultsInfo', {
                "pageNum": num,
                "pageSize": 20,
                "grades": selectedGrade,
                "consequences": selectedConsequence,
                "keywords": searchKey,
                "classNames": selectedClassName,
                "sort": [],
                "lan": 'zh'
            }).done(function (rs) {
                var data = rs.data.data;
                var totalNum = rs.data.total;
                dispatch({
                    type: CHANGE_PAGE_NUM,
                    data: {
                        items: data,
                        page: num,
                        totalNum: totalNum
                    }
                });
            })
        }
    };
    var showMore = function () {
        return function (dispatch, getState) { 
            var isShowMore = getState().faultInfo.isShowMore;
            if (isShowMore){
                isShowMore = false;
            } else {
                isShowMore = true;
            }
            WebAPI.get('/diagnosis_v2/getFaultsClassNames').done(function (rs) {
                var classNameArr = rs.data;
                if (!isShowMore){
                    classNameArr = classNameArr.slice(0, 8);
                }
                dispatch({
                    type: IS_SHOW_MORE,
                    data: {
                        isShowMore: isShowMore,
                        classNameArr: classNameArr
                    }
                })
            })
        }
    }    
    // 需要暴露给外部调用的 action
    exports.actions = {
        initData,
        selectItem,
        changeSearchKey,
        changePageNum,
        showMore
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [INIT_DATA]: (state, action) => {
            var data = action.data;
            var classNameArr = data.classNameArr,
                faultData = data.faultData,
                page = data.page,
                totalNum = data.totalNum;
            return Object.assign({}, state, {
                classNameArr: classNameArr,
                items: faultData,
                page: page,
                totalNum: totalNum
            });
        },
        [SELECT_ITEM]: (state, action) => {
            return Object.assign({}, state, {
                selectedClassName: action.data.selectedClassName,
                selectedGrade: action.data.selectedGrade,
                selectedConsequence: action.data.selectedConsequence,
                items: action.data.items,
                page: 1,
                totalNum: action.data.totalNum
            });
        },
        [CHANGE_SEARCH_KEY]: (state, action) => {
            var data = action.data;
            return Object.assign({}, state, {
                searchKey: data.value,
                items: data.items,
                page: data.page,
                totalNum: data.totalNum
            });
        },
        [CHANGE_PAGE_NUM]: (state, action) => {
            const {
                items,
                page,
                totalNum
            } = action.data;
            return Object.assign({}, state, {
                items: items,
                page: page,
                totalNum: totalNum
            });
        },
        [IS_SHOW_MORE]: (state, action) => {
            var data = action.data;
            return Object.assign({}, state, {
                isShowMore: data.isShowMore,
                classNameArr: data.classNameArr,
            });
        }
    }

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        searchKey: '',
        classNameArr:  [],
        selectedClassName: [],
        selectedGrade: [],
        selectedConsequence: [],
        items: [],
        page: 0,
        totalNum: '',
        isShowMore: false
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
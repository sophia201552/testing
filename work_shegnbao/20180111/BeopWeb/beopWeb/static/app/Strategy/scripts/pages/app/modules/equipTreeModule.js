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
            namespace('beop.strategy.common')
        );
    }
}(namespace('beop.strategy.modules.EquipTree'), function(
    exports,
    ReactRedux,
    commonUtil
) {
    const deepClone = $.extend.bind($, true);
    var asyncLoading = undefined;
    // ------------------------------------
    // Constants
    // ------------------------------------
    // 取消/选中 "显示所有子策略" 复选按钮
    const TOGGLE_SHOW_ALL_STRATEGIES_BTN = 'TOGGLE_SHOW_ALL_STRATEGIES_BTN';
    const SELECT_TREE_NODE = 'SELECT_TREE_NODE';
    const ADD_SYNC_DATA = 'ADD_SYNC_DATA';
    const ADD_ITEMS = 'ADD_ITEMS';
    const REMOVE_ITEMS = 'REMOVE_ITEMS';
    const ENABLE_ITEMS = 'ENABLE_ITEMS';
    const DISABLE_ITEMS = 'DISABLE_ITEMS';
    const UPDATE_ITEMS = 'UPDATE_ITEMS';
    const UPDATE_SEARCH_KEY = 'equipTree.UPDATE_SEARCH_KEY';
    const UPDATE_EXPANDED_KEYS = 'equipTree.UPDATE_EXPANDED_KEYS';
    const CHANGE_SELECTED_VALUEID = 'equipTree.SELECTED_VALUEID';
    const CHANGE_STATE = 'CHANGE_STATE';
    const CHANGE_SELECTED_PROJNAME = 'equipTree.CHANGE_SELECTED_PROJNAME';
    const CHANGE_ITEMS_NEEDSYNCFAULTTABLE = 'equipTree.CHANGE_ITEMS_NEEDSYNCFAULTTABLE';
    const CHANGE_TAG_LIST = 'equipTree.CHANGE_TAG_LIST';
    
    // ------------------------------------
    // Actions
    // ------------------------------------
    var onToggleShowAllStrategiesBtnHandler = function () {
        return function (dispatch) {
            dispatch({
                type: TOGGLE_SHOW_ALL_STRATEGIES_BTN
            });
            dispatch(namespace('beop.strategy.modules.StrategyTable.actions').reload());
        };
    };
    var onSearch = (value) => {
        return {
            type: UPDATE_SEARCH_KEY,
            value
        };
    };
    var onSelectTreeNode = function (_id, parentNodeId,dispatch) {
        if(_id && !parentNodeId){
            return {
                type: SELECT_TREE_NODE,
                selectedNode: {
                    _id: _id
                }
            }
        }else{
            dispatch&&dispatch({
                type: 'SELECT_ROWS',
                selectedIds: []
            });
            return{
                type: SELECT_TREE_NODE,
                selectedNode: {
                    _id: _id,
                    pid: parentNodeId
                }
            }
        }
        //return _id && !parentNodeId ? {
        //    type: SELECT_TREE_NODE,
        //    selectedNode: {
        //        _id: _id
        //    }
        //} : {
        //    type: SELECT_TREE_NODE,
        //    selectedNode: {
        //        _id: _id,
        //        pid: parentNodeId
        //    }
        //};
    };
    var addAsyncData = function (items, nodeId) {
        return function (dispatch, getState) {
            let state = getState().equipTree;
            dispatch([{
                type: ADD_SYNC_DATA,
                items: items,
                nodeId: nodeId
            }]);
            // _id 存在， parentNodeId 不存在的情况是特殊情况，进行一下处理
            if (state.selectedNode._id && !state.selectedNode.pid) {
                let node = commonUtil.toFlatArray(state.items).find(
                    row => row._id === state.selectedNode._id
                );
                dispatch(onSelectTreeNode(state.selectedNode._id, node.nodeId));
            }
        }
    };
    var addItems = function (items, nodeId) {
        return function (dispatch) {
            dispatch([{
                type: ADD_ITEMS,
                items: items,
                nodeId: nodeId
            }, namespace('beop.strategy.modules.StrategyTable.actions').reload()]);
            dispatch(namespace('beop.strategy.modules.PropPanel.actions').recoverProp());
            //新增策略自动选中并滚动到当前策略
            var curTr = $("#strategyTable").find("tr[data-id = "+ items._id + "]");
            curTr.trigger("click");
            $('#propName').trigger('focus');
            $('#propName').trigger('select');
            curTr[0].scrollIntoView(false);
        }
    };
    var removeItems = function (removedIds) {
        return function (dispatch) {
            dispatch([{
                type: REMOVE_ITEMS,
                removedIds: removedIds
            }, namespace('beop.strategy.modules.StrategyTable.actions').reload()]);
            dispatch(namespace('beop.strategy.modules.PropPanel.actions').recoverProp());
        };
    };
    var enableItems = function (ids) {
        return function (dispatch) {
            dispatch([{
                type: ENABLE_ITEMS,
                ids: ids
            }, namespace('beop.strategy.modules.StrategyTable.actions').reload()]);
            dispatch(namespace('beop.strategy.modules.PropPanel.actions').recoverProp());
        };
    };
    var disableItems = function (ids) {
        return function (dispatch) {
            dispatch([{
                type: DISABLE_ITEMS,
                ids: ids
            }, namespace('beop.strategy.modules.StrategyTable.actions').reload()]);
            dispatch(namespace('beop.strategy.modules.PropPanel.actions').recoverProp());
        };
    };
    var updateItems = function (ids, data) {
        return function (dispatch) {
            dispatch([{
                type: UPDATE_ITEMS,
                ids: ids,
                data: data
            }, namespace('beop.strategy.modules.StrategyTable.actions').reload()]);
        };
    };
    var loadTreeData = (projId) => {
        return function (dispatch, getState) {
            if(asyncLoading){
                asyncLoading.abort();
            }
            asyncLoading = WebAPI.get('/strategy/item/getAllList/' + projId).done(
                (rs) => {
                    if (rs.status === 'OK') {
                        dispatch(addAsyncData(rs.data, projId));
                    }
                }
            ).always(()=>{
                asyncLoading = undefined;
            });
            return asyncLoading;
        };
    };
    var handleExpand = (expandedKeys) => {
        return {
            type: UPDATE_EXPANDED_KEYS,
            expandedKeys
        };
    };

    var changeSelectedValueId = (id) => {
        return {
            type: CHANGE_SELECTED_VALUEID,
            id
        };
    };

    var changeState = (data) => {
        return {
            type: CHANGE_STATE,
            data
        }
    };

    var changeProjName = (projName)=>{
        return {
            type: CHANGE_SELECTED_PROJNAME,
            projName
        }
    };

    var changeProjTree = (projId)=>{
        return function (dispatch, getState) {
            let state = getState().equipTree;
            let target = state.items.find(item=>item.projId == projId);
            if(target && target.nodeId === '-1' && !target.isLoaded){//页面刷新首次进入策略触发
                dispatch(loadTreeData(target._id));
                dispatch([changeProjName(target.name+target.projId),onSelectTreeNode(state.selectedNode._id, target._id)]);
                AppConfig.projectId = target.projId;
            }
        }
    };

    var changeItemsNeedSyncFaultTable = (id, state)=>{
        return {
            type: CHANGE_ITEMS_NEEDSYNCFAULTTABLE,
            id,
            state
        }
    }

    var loadTagList = ()=>{
        return function (dispatch, getState) {
            let asyncLoading = WebAPI.get('/tag/dict').done(
                (rs) => {
                    if (rs.success == true) {
                        dispatch({
                            type: CHANGE_TAG_LIST,
                            data: rs.data
                        });
                    }
                }
            ).always(()=>{
                asyncLoading = undefined;
            });
            return asyncLoading;
        }
    }

    var changeTagList = (tagList) => {
        return {
            type: CHANGE_TAG_LIST,
            data: tagList
        }
    }

    // 需要暴露给外部调用的 action
    exports.actions = {
        onToggleShowAllStrategiesBtnHandler,
        onSelectTreeNode,
        addAsyncData,
        addItems,
        removeItems,
        enableItems,
        disableItems,
        updateItems,
        onSearch,
        handleExpand,
        loadTreeData,
        changeSelectedValueId,
        changeState,
        changeProjName,
        changeProjTree,
        changeItemsNeedSyncFaultTable,
        loadTagList,
        changeTagList
    };

    // ------------------------------------
    // Action Handlers
    // ------------------------------------
    const ACTION_HANDLERS = {
        [UPDATE_SEARCH_KEY]: (state, action) => {
            state = Object.assign({}, state, { searchKey: action.value })
            if(action.value!=''){
                let expandedKeys = commonUtil.toFlatArray(state.items).forEach((item) => {
                    if (item.name.indexOf(action.value) > -1) {
                        if(state.expandedKeys.indexOf(item.nodeId)<0){
                            state.expandedKeys.push(item.nodeId);
                        }
                    }
                });
            }else{
                state.expandedKeys = state.oldExpandedKeys.slice();
            }
            state.autoExpandParent = true;
            return state;
        },
        [UPDATE_EXPANDED_KEYS]: (state, action) => {
            return Object.assign({}, state, { expandedKeys: action.expandedKeys,oldExpandedKeys:action.expandedKeys.slice(),autoExpandParent:false });
        },
        [TOGGLE_SHOW_ALL_STRATEGIES_BTN]: (state) => {
            return Object.assign({}, state, { bShowChildStrategies: !state.bShowChildStrategies });
        },
        [SELECT_TREE_NODE]: (state, action) => {
            return Object.assign({}, state, {
                selectedNode: Object.assign({}, state.selectedNode, action.selectedNode)
            });
        },
        [ADD_SYNC_DATA]: (state, action) => {
            var node = null,
                state = deepClone({}, state),
                stack = state.items.slice();
            while (node = stack.shift()) {
                if (node._id === action.nodeId) {
                    break;
                }
                if (node.children && node.children.length) {
                    stack = stack.concat(node.children);
                }
            }

            let setName = (items,name)=>{
                items.forEach(item=>{
                    item.nodeName = name;
                    if(item.children){
                        setName(item.children, item.name);
                    }
                });
            }

            if (node) {
                node.isLoaded = true;
                if (action.items instanceof Array) {
                    setName(action.items, node.name);
                    node.children = [...action.items];
                } else {
                    node.children = [...node.children, action.items];
                }
            }

            //展开
            var node = commonUtil.toFlatArray(state.items).find(
                    item => item._id === state.selectedNode._id
                );
            if(node&&state.expandedKeys.indexOf(node.nodeId)<0){
                state.expandedKeys.push(node.nodeId);
            }
            return state;
        },
        [ADD_ITEMS]: (state, action) => {
            var node = null,
                state = deepClone({}, state),
                stack = state.items.slice();
            while (node = stack.shift()) {
                if (node._id === action.nodeId) {
                    action.items.nodeName = node.name;
                    break;
                }
                if (node.children && node.children.length) {
                    stack = stack.concat(node.children);
                }
            }

            if (node) {
                if (action.items instanceof Array) {
                    node.children = action.items;
                } else {
                    node.children.push(action.items);
                }
            }
            return state;
        },
        [REMOVE_ITEMS]: (function() {
            function removeItems(items, removedIds) {
                return items.filter(function (row) {
                    if (row.children) {
                        row.children = removeItems(row.children, removedIds);
                    }
                    return removedIds.indexOf(row._id) === -1;
                });
            }

            return function (state, action) {
                var items = Object.assign([], state.items);
                return Object.assign({}, state, {items: removeItems(items, action.removedIds)});
            };
        }()),
        [ENABLE_ITEMS]: (state, action) => {
            state = deepClone({}, state);
            commonUtil.toFlatArray(state.items).forEach(function(row) {
                if (action.ids.indexOf(row._id) > -1) {
                     row.status = 1;
                }
            });
            return Object.assign({}, state);
        },
        [DISABLE_ITEMS]: (state, action) => {
            state = deepClone({}, state);
            commonUtil.toFlatArray(state.items).forEach(function(row) {
                if (action.ids.indexOf(row._id) > -1) {
                    row.status = 0;
                }
            });
            return state;
        },
        [UPDATE_ITEMS]: (state, action) => {
            state = deepClone({}, state);
            commonUtil.toFlatArray(state.items).forEach(function (row, i, arr) {
                if (action.ids.indexOf(row._id) > -1) {
                    Object.assign(row, action.data);
                }
            });
            return state;
        },
        [CHANGE_SELECTED_VALUEID]: (state, action) => {
            state = deepClone({},state);
            state.selectedValueId = action.id;
            return state;
        },
        [CHANGE_STATE]: (state, action) => {
            state = deepClone({},state);
            state.selectedNode.pid = AppConfig.projectId.toString();
            state.expandedKeys = [AppConfig.projectId.toString()];
            state.oldExpandedKeys = [AppConfig.projectId.toString()];
            let nameKey = (I18n && I18n.type=='en')?'name_en':'name_cn';
            state.items = AppConfig.projectList.map(function(item, i) {

                return {
                    _id: item.id.toString(),
                    name: item[nameKey],
                    nodeId: '-1',
                    isParent: true,
                    projId: item.id,
                    children: []
                };
            });
            state.projName = state.projName || state.items[0]?state.items[0].name+state.items[0].projId:undefined;
            return state
        },
        [CHANGE_SELECTED_PROJNAME]: (state, action) => {
            state = deepClone({},state);
            state.projName = action.projName;
            state.selectedNode = {
                _id: state.selectedNode._id,
                pid: null
            };
            return state;
        },
        [CHANGE_ITEMS_NEEDSYNCFAULTTABLE]: (state, action)=>{
            state = deepClone({},state);
            commonUtil.toFlatArray(state.items).forEach(item=>{
                if(item._id == action.id){
                    item.option.needSyncFaultTable = action.state;
                }
            });
            
            return state;
        },
        [CHANGE_TAG_LIST]: (state, action)=>{
            state = deepClone({},state);
            state.tagList = action.data;
            return state;
        }
    };

    // ------------------------------------
    // Reducer
    // ------------------------------------
    const initialState = {
        selectedNode: {
            _id: null,
            pid: null
        },
        expandedKeys: [],
        autoExpandParent: true,
        oldExpandedKeys: [],
        searchKey: '',
        items: [],
        bShowChildStrategies: true,
        selectedValueId: undefined,
        projName: undefined,
        tagList: []
    };

    exports.reducer = function(state = initialState, action) {
        const handler = ACTION_HANDLERS[action.type];
        return handler ? handler(state, action) : state;
    }
}));
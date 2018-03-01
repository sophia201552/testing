import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import { actionTypes } from '../constants';
import { linkTo } from '../../../';

// ------------------------------------
// Action Creators
// ------------------------------------
/** 获取策略列表 */
export const getStrategyList = (projId, nodeId) => {
  return {
    type: actionTypes.GET_STRATEGY_LIST,
    projId,
    nodeId
  };
};
/** 获取策略列表成功回调 */
export const getStrategyListFulfilled = (resp, projId, nodeId) => {
  return {
    type: actionTypes.GET_STRATEGY_LIST_FULFILLED,
    resp,
    projId,
    nodeId
  };
};

/** 创建策略 */
export const createStrategy = (projId, data) => {
  return {
    type: actionTypes.CREATE_STRATEGY,
    projId,
    data
  };
};
/** 创建策略成功回调 */

export const createStrategyFulfilled = (resp, data) => {
  return {
    type: actionTypes.CREATE_STRATEGY_FULFILLED,
    resp,
    data
  };
};

/** 移除策略 */
export const removeStrategy = (projId, ids, userId) => {
  return {
    type: actionTypes.REMOVE_STRATEGY,
    projId,
    ids,
    userId
  };
};

/** 移除策略成功回调 */

export const removeStrategyFulfilled = (resp, ids, userId) => {
  return {
    type: actionTypes.REMOVE_STRATEGY_FULFILLED,
    resp,
    ids,
    userId
  };
};

/** 更新策略 */

export const updateStrategy = (projId, ids, data) => {
  var data = {
    type: actionTypes.UPDATE_STRATEGY,
    projId,
    ids,
    data
  };
  return data;
};
/** 更新策略成功回调 */

export const updateStrategyFulfilled = (ids, data) => {
  return {
    type: actionTypes.UPDATE_STRATEGY_FULFILLED,
    ids,
    data
  };
};

/** 发布策略 */

export const publishStrategyItem = (projId, ids) => {
  var data = {
    type: actionTypes.PUBLISH_STRATEGY_ITEM,
    projId,
    ids
  };
  return data;
};

/** 搜索策略 */
export const searchStrategyItem = (projId, searchText) => {
  return {
    type: actionTypes.SEARCH_STRATEGY_ITEM,
    projId,
    searchText
  };
};

/** 搜索策略成功回调 */
export const searchStrategyItemFulfilled = (resp, searchText) => {
  return {
    type: actionTypes.SEARCH_STRATEGY_ITEM_FULFILLED,
    resp,
    searchText
  };
};

//根据项目id获取文件夹树
export const getDataSourceList = (projId, nodeId) => {
  return {
    type: actionTypes.GET_DATASOURCE_LIST,
    projId,
    nodeId
  };
};
export const getDataSourceListFulfilled = (resp, projId, nodeId) => {
  return {
    type: actionTypes.GET_DATASOURCE_LIST_FULFILLED,
    resp,
    projId,
    nodeId
  };
};

// 导出模板
export const exportTemplate = (strategyInfo, modules) => {
  return {
    type: actionTypes.EXPORT_TEMPLATE,
    strategyInfo,
    modules
  };
};
//导出模板回调
export const exportTemplateFulfilled = (resp, strategyInfo, modules) => {
  return {
    type: actionTypes.EXPORT_TEMPLATE_FULFILLED,
    resp,
    strategyInfo,
    modules
  };
};
/** 获取tag字典 */
export const getTagDict = () => {
  return {
    type: actionTypes.GET_TAG_DICT
  };
};
/** 获取tag字典成功回调 */
export const getTagDictFulfilled = resp => {
  return {
    type: actionTypes.GET_TAG_DICT_FULFILLED,
    resp
  };
};

// 根据模板生成新的的策略
export const copyTemplateAddNew = (data, modules) => {
  return {
    type: actionTypes.COPY_TEMPLATE_ADD_NEW,
    data,
    modules
  };
};
/** 根据模板生成新的的策略成功回调 */
export const copyTemplateAddNewFulfilled = (resp, data, modules) => {
  return {
    type: actionTypes.COPY_TEMPLATE_ADD_NEW_FULFILLED,
    resp,
    data,
    modules
  };
};
/** 项目面板spinner */
export const setFilesPanelSpinner = (bool) => {
  return {
    type: actionTypes.SET_FILES_PANEL_SPINNER,
    bool
  };
};

// ------------------------------------
// Epics
// ------------------------------------
const epics = {};
epics.getStrategyListEpic = action$ =>
  action$.ofType(actionTypes.GET_STRATEGY_LIST).mergeMap(action =>
    apiFetch
      .getStrategyList(action.projId, action.nodeId)
      .map(resp => getStrategyListFulfilled(resp, action.projId, action.nodeId))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.createStrategyEpic = action$ =>
  action$.ofType(actionTypes.CREATE_STRATEGY).mergeMap(action =>
    apiFetch
      .createStrategy(action.projId, action.data)
      .map(resp => {
        if (resp.status == 'OK') {
          linkTo(`/painter/${resp.data.data._id}`);
          return createStrategyFulfilled(resp, action.data);
        }
      })
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.removeStrategyEpic = action$ =>
  action$.ofType(actionTypes.REMOVE_STRATEGY).mergeMap(action =>
    apiFetch
      .removeStrategy(action.projId, action.ids, action.userId)
      .map(resp => removeStrategyFulfilled(resp, action.ids, action.userId))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.searchStrategyItemEpic = action$ =>
  action$.ofType(actionTypes.SEARCH_STRATEGY_ITEM).mergeMap(action =>
    apiFetch
      .searchStrategItem(action.projId, action.searchText)
      .map(resp => searchStrategyItemFulfilled(resp, action.searchText))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.updateStrategyEpic = action$ =>
  action$.ofType(actionTypes.UPDATE_STRATEGY).mergeMap(action =>
    apiFetch
      .updateStrategy(action.projId, action.ids, action.data)
      .map(resp => updateStrategyFulfilled(action.ids, action.data))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.publishStrategyItemEpic = action$ =>
  action$.ofType(actionTypes.PUBLISH_STRATEGY_ITEM).mergeMap(action =>
    apiFetch
      .publishStrategyItem(action.projId, action.ids)
      .map(resp => {
        if (resp.status === 'OK') {
          return updateStrategyFulfilled(action.ids, { syncStatus: 1 });
        }
      })
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.getDataSourceListEpic = action$ =>
  action$.ofType(actionTypes.GET_DATASOURCE_LIST).mergeMap(action =>
    apiFetch
      .getDataSourceList(action.projId, action.nodeId)
      .map(resp =>
        getDataSourceListFulfilled(resp, action.projId, action.nodeId)
      )
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.exportTemplateEpic = action$ =>
  action$.ofType(actionTypes.EXPORT_TEMPLATE).mergeMap(action =>
    apiFetch
      .exportTemplate(action.strategyInfo, action.modules)
      .map(resp =>
        exportTemplateFulfilled(resp, action.strategyInfo, action.modules)
      )
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.getTagDictEpic = action$ =>
  action$.ofType(actionTypes.GET_TAG_DICT).mergeMap(action =>
    apiFetch
      .getTagDict()
      .map(resp => getTagDictFulfilled(resp))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.copyTemplateAddNewEpic = action$ =>
  action$.ofType(actionTypes.COPY_TEMPLATE_ADD_NEW).mergeMap(action =>
    apiFetch
      .copyTemplateAddNew(action.data, action.modules)
      .map(resp => {
        if (resp.status == 'OK') {
          linkTo(`/painter/${resp.data._id}`);
          return copyTemplateAddNewFulfilled(resp, action.data, action.modules);
        }
      })
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );
export default epics;

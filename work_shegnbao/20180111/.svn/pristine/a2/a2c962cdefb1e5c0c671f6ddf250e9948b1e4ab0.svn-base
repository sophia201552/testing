import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import { actionTypes } from '../constants';

// ------------------------------------
// Action Creators
// ------------------------------------
/** 获取策略 */
export const getStrategyItem = strategyId => {
  return {
    type: actionTypes.GET_STRATEGY_ITEM,
    strategyId
  };
};
/** 获取策略成功回调 */
export const getStrategyItemFulfilled = resp => {
  return {
    type: actionTypes.GET_STRATEGY_ITEM_FULFILLED,
    resp
  };
};
/** 保存策略 */
export const saveStrategyItem = (diff, modules) => {
  return {
    type: actionTypes.SAVE_STRATEGY_ITEM,
    diff,
    modules
  };
};
/** 保存策略成功回调 */
export const saveStrategyItemFulfilled = (resp, modules) => {
  return {
    type: actionTypes.SAVE_STRATEGY_ITEM_FULFILLED,
    resp,
    modules
  };
};
// 更新 strategyItem 中的 strategy
export const updateStrategyItem = strategy => {
  return {
    type: actionTypes.PAINTER_UPDATE_STRATEGY_ITEM,
    strategy
  };
};

/** 获取api列表 */
export const getAPIList = lang => {
  return {
    type: actionTypes.GET_APILIST_LIST,
    lang
  };
};
/** 获取api列表成功回调 */
export const getAPIListFulfilled = resp => {
  return {
    type: actionTypes.GET_APILIST_LIST_FULFILLED,
    resp
  };
};

/** 清除画板数据 */
export const clearStrategyItem = () => {
  return {
    type: actionTypes.CLEAR_STRATEGY_MODULES
  };
};

/** 改变选中面板 */
export const changeActivePaneKey = key => {
  return {
    type: actionTypes.CHANGE_ACTIVE_PANEKEY,
    key
  };
};

/** 获取help信息 */
export const getHelpInfo = Info => {
  return {
    type: actionTypes.GET_HELP_INFO,
    Info
  };
};

// ------------------------------------
// Epics
// ------------------------------------
const epics = {};
epics.getStrategyItemEpic = action$ =>
  action$.ofType(actionTypes.GET_STRATEGY_ITEM).mergeMap(action =>
    apiFetch
      .getStrategyItem(action.strategyId)
      .map(resp => getStrategyItemFulfilled(resp))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );
epics.saveStrategyItemEpic = action$ =>
  action$.ofType(actionTypes.SAVE_STRATEGY_ITEM).mergeMap(action =>
    apiFetch
      .saveStrategyItem(action.diff)
      .map(resp => saveStrategyItemFulfilled(resp, action.modules))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );
epics.getAPIListEpic = action$ =>
  action$.ofType(actionTypes.GET_APILIST_LIST).mergeMap(action =>
    apiFetch
      .getAPIList(action.lang)
      .map(resp => getAPIListFulfilled(resp))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

export default epics;

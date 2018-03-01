import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import { actionTypes } from '../constants';

// ------------------------------------
// Action Creators
// ------------------------------------
/** 获取历史数据 */
export const getHistoryData = (dsItemIds, timeStart, timeEnd, timeFormat) => {
  return {
    type: actionTypes.GET_HISTORY_DATA,
    dsItemIds,
    timeStart,
    timeEnd,
    timeFormat
  };
};
/** 获取历史数据成功回调 */
export const getHistoryDataFulfilled = resp => {
  return {
    type: actionTypes.GET_HISTORY_DATA_FULFILLED,
    resp
  };
};


// ------------------------------------
// Epics
// ------------------------------------
const epics = {};
epics.getHistoryData = action$ =>
  action$.ofType(actionTypes.GET_STRATEGY_LIST).mergeMap(action =>
    apiFetch
      .getHistoryData(action.dsItemIds, action.timeStart, action.timeEnd, action.timeFormat)
      .map(resp => getHistoryFulfilled(resp))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

export default epics;

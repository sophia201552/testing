import I from 'seamless-immutable';
import { actionTypes } from '../constants';
import ObjectId from '../../common/objectId.js';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [actionTypes.GET_STRATEGY_LIST_FULFILLED]: (state, action) => {
    appConfig.project = appConfig.projectList.find(
      v => v.id == Number(action.projId)
    );
    return state
      .set('strategyList', action.resp.data || [])
      .set('selectedProjectId', appConfig.project.id)
      .set('selectedDataSourceProjectId', appConfig.project.id)
      .set('filePanelSpinner', false);
  },
  // 创建
  [actionTypes.CREATE_STRATEGY_FULFILLED]: (state, action) => {
    return state.set(
      'strategyList',
      state.strategyList.concat(action.resp.data.data)
    );
  },

  // 删除
  [actionTypes.REMOVE_STRATEGY_FULFILLED]: (state, action) => {
    let strategyList = state.strategyList.concat();
    strategyList = strategyList.filter(v => action.ids.indexOf(v._id) < 0);
    return state.set('strategyList', strategyList);
  },
  // 搜索
  [actionTypes.SEARCH_STRATEGY_ITEM_FULFILLED]: (state, action) => {
    let strategyList = action.resp.data.concat();
    if (action.searchText) {
      strategyList = strategyList.filter(
        v => v.name.toLowerCase().indexOf(action.searchText) > -1
      );
    }
    return state.set('strategyList', strategyList);
  },

  // 改变状态
  [actionTypes.UPDATE_STRATEGY_FULFILLED]: (state, action) => {
    let { ids, data } = action;
    return state.set(
      'strategyList',
      state.strategyList.flatMap(row => {
        if (ids.indexOf(row._id) > -1) {
          return row.merge(data);
        }
        return row;
      })
    );
  },

  [actionTypes.GET_DATASOURCE_LIST_FULFILLED]: (state, action) => {
    let oldList = state.dataSourceList[action.projId] || [],
      getList = action.resp.data || [],
      newList = I.asMutable(oldList),
      parentsId = newList.map(v => v._id);
    getList.forEach(v => {
      if (parentsId.indexOf(v._id) < 0) {
        newList.push(v);
      }
    });
    return state
      .set('dataSourceList', state.dataSourceList.set(action.projId, newList))
      .set('selectedDataSourceProjectId', action.projId);
  },

  [actionTypes.GET_TAG_DICT_FULFILLED]: (state, action) => {
    return state.set('tagDict', action.resp.data);
  },

  [actionTypes.COPY_TEMPLATE_ADD_NEW_FULFILLED]: (state, action) => {
    return state.set(
      'strategyList',
      state.strategyList.concat(action.resp.data)
    );
  },

  [actionTypes.SET_FILES_PANEL_SPINNER]: (state, action) => {
    return state.set(
      'filePanelSpinner',
      action.bool
    );
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  strategyList: [],
  selectedProjectId: undefined,
  dataSourceList: {},
  selectedDataSourceProjectId: undefined,
  tagDict: [],
  filePanelSpinner: true
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  const nextState = handler ? handler(state, action) : state;

  return I.isImmutable(nextState) ? nextState : I(nextState);
}
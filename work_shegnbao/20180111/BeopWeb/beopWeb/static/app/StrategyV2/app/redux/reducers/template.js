import I from 'seamless-immutable';
import { actionTypes } from '../constants';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  // 初始树
  [actionTypes.GET_TEMPLATE_TREE_FULFILLED]: (state, action) => {
    return state.set('templateList', action.resp.data || []);
  },
  // 创建
  [actionTypes.ADD_NEW_FILE_FULFILLED]: (state, action) => {
    let newList = I.asMutable(state.viewList);
    newList.push(action.data);
    return state
      .set(
        'templateList',
        action.data.isParent
          ? state.templateList.concat(action.data)
          : state.templateList
      )
      .set('viewList', newList);
  },
  //筛选模板
  [actionTypes.GET_TEMPLATES_FULFILLED]: (state, action) => {
    return state.set('viewList', action.resp.data || []);
  },
  //change condition
  [actionTypes.SET_CONDITION]: (state, action) => {
    let data = Object.assign({}, state.condition, action.data);
    return state.set('condition', data);
  },
  //delete template
  [actionTypes.DELETE_TEMPLATE_FULFILLED]: (state, action) => {
    let templateId = action.templateId;
    let currentTreeList = state.templateList.flatMap(row => {
      if (row.id === templateId) {
        return [];
      }
      return row;
    });
    let currentViewList = state.viewList.flatMap(row => {
      if (row.id === templateId) {
        return [];
      }
      return row;
    });
    return state
      .set('templateList', currentTreeList)
      .set('viewList', currentViewList);
  },
  //update template
  [actionTypes.UPDATE_TEMPLATE]: (state, action) => {
    let templateId = action.id;
    let info = action.info;
    let currentViewList = state.viewList.flatMap(row => {
      if (row.id === templateId) {
        return Object.assign({}, row, info);
      }
      return row;
    });
    return state.set('viewList', currentViewList);
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  templateList: [],
  viewList: [],
  condition: {
    grade: undefined,
    source: undefined,
    tags: [],
    key: '',
    selectedIds: []
  }
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  const nextState = handler ? handler(state, action) : state;

  return I.isImmutable(nextState) ? nextState : I(nextState);
}

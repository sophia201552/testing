import I from 'seamless-immutable';
import { actionTypes } from '../constants';
import ObjectId from '../../common/objectId.js';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [actionTypes.GET_STRATEGY_ITEM_FULFILLED]: (state, action) => {
    return state.set('strategyItem', action.resp.data || null);
  },
  [actionTypes.SAVE_STRATEGY_ITEM_FULFILLED]: (state, action) => {
    return state.set(
      'strategyItem',
      state.strategyItem.set('modules', action.modules)
    );
  },
  [actionTypes.PAINTER_UPDATE_STRATEGY_ITEM]: (state, action) => {
    let strategyItem = state.strategyItem.set('strategy', action.strategy);
    return state.set('strategyItem', strategyItem);
  },
  [actionTypes.GET_APILIST_LIST_FULFILLED]: (state, action) => {
    return state.set('APIList', action.resp);
  },
  [actionTypes.CLEAR_STRATEGY_MODULES]: (state, action) => {
    return state.set('strategyItem', {
      modules: [],
      strategy: undefined
    });
  },
  [actionTypes.CHANGE_ACTIVE_PANEKEY]: (state, action) => {
    return state.set('activePaneKey', action.key || 'PainterPanel');
  },
  [actionTypes.GET_HELP_INFO]: (state, action) => {
    return state.set('helpInfo', action.Info);
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  strategyItem: {
    modules: [],
    strategy: undefined
  },
  panels: [],
  APIList: [],
  activePaneKey: 'PainterPanel',
  helpInfo: []
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  const nextState = handler ? handler(state, action) : state;

  return I.isImmutable(nextState) ? nextState : I(nextState);
}

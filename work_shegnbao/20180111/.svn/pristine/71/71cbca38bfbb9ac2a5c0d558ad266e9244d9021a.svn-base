import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import { actionTypes } from '../constants';

// ------------------------------------
// Action Creators
// ------------------------------------
//getTemplateTree
export const getTemplateTree = () => {
  return {
    type: actionTypes.GET_TEMPLATE_TREE
  };
};
//getTemplateTree回调
export const getTemplateTreeFulfilled = resp => {
  return {
    type: actionTypes.GET_TEMPLATE_TREE_FULFILLED,
    resp
  };
};

// 新增文件
export const addNewFile = data => {
  return {
    type: actionTypes.ADD_NEW_FILE,
    data
  };
};
//新增回调
export const addNewFileFulfilled = (resp, data) => {
  return {
    type: actionTypes.ADD_NEW_FILE_FULFILLED,
    resp,
    data
  };
};

// 筛选模板
export const getTemplates = (selectedIds, grade, source, tags, key, user) => {
  return {
    type: actionTypes.GET_TEMPLATES,
    selectedIds,
    grade,
    source,
    tags,
    key,
    user
  };
};
//筛选模板回调
export const getTemplatesFulfilled = (
  resp,
  selectedIds,
  grade,
  source,
  tags,
  key,
  user
) => {
  return {
    type: actionTypes.GET_TEMPLATES_FULFILLED,
    resp,
    selectedIds,
    grade,
    source,
    tags,
    key,
    user
  };
};
// 筛选条件
export const setCondition = data => {
  return {
    type: actionTypes.SET_CONDITION,
    data
  };
};
//删除模板
export const deleteTemplate = templateId => {
  return {
    type: actionTypes.DELETE_TEMPLATE,
    templateId
  };
};
//删除模板回调
export const deleteTemplateFulfilled = (resp, templateId) => {
  return {
    type: actionTypes.DELETE_TEMPLATE_FULFILLED,
    resp,
    templateId
  };
};

//更新模板
export const updateTemplate = (id, info) => {
  return {
    type: actionTypes.UPDATE_TEMPLATE,
    id,
    info
  };
};
//更新模板回调
export const updateTemplateFulfilled = (resp, id, info) => {
  return {
    type: actionTypes.UPDATE_TEMPLATE_FULFILLED,
    resp,
    id,
    info
  };
};

// ------------------------------------
// Epics
// ------------------------------------
const epics = {};
epics.getTemplateTreeEpic = action$ =>
  action$.ofType(actionTypes.GET_TEMPLATE_TREE).mergeMap(action =>
    apiFetch
      .getTemplateTree()
      .map(resp => getTemplateTreeFulfilled(resp))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.addNewFileEpic = action$ =>
  action$.ofType(actionTypes.ADD_NEW_FILE).mergeMap(action =>
    apiFetch
      .addNewFile(action.data)
      .map(resp => addNewFileFulfilled(resp, action.data))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.getTemplatesEpic = action$ =>
  action$.ofType(actionTypes.GET_TEMPLATES).mergeMap(action =>
    apiFetch
      .getTemplates(
        action.selectedIds,
        action.grade,
        action.source,
        action.tags,
        action.key,
        action.user
      )
      .map(resp =>
        getTemplatesFulfilled(
          resp,
          action.selectedIds,
          action.grade,
          action.source,
          action.tags,
          action.key,
          action.user
        )
      )
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.deleteTemplateEpic = action$ =>
  action$.ofType(actionTypes.DELETE_TEMPLATE).mergeMap(action =>
    apiFetch
      .deleteTemplate(action.templateId)
      .map(resp => deleteTemplateFulfilled(resp, action.templateId))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );

epics.updateTemplateEpic = action$ =>
  action$.ofType(actionTypes.UPDATE_TEMPLATE).mergeMap(action =>
    apiFetch
      .updateTemplate(action.id, action.info)
      .map(resp => updateTemplateFulfilled(resp, action.id, action.info))
      .takeUntil(action$.ofType(actionTypes.CACEL_ALL_ASYNC_REQUEST))
  );
export default epics;

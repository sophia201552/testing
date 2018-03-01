import { ApiFetch } from './apiFetch';

export const getStrategyList = function(projId, nodeId = '') {
  let url = projId;
  if (nodeId) {
    url += `/${nodeId}`;
  }
  return this.get(`getList/${url}`);
};

export const createStrategy = function(projId, data) {
  return this.post('saveItem', {
    projId,
    data
  });
};

export const removeStrategy = function(projId, ids, userId) {
  return this.post('removeItem', {
    ids,
    userId
  });
};

export const updateStrategy = function(projId, ids, data) {
  return this.post('saveItem', {
    projId,
    ids,
    data
  });
};

export const publishStrategyItem = function(projId, ids) {
  return this.post('publistItem', {
    projId,
    ids
  });
};

export const searchStrategItem = function(projId, searchText) {
  return this.post(`searchItem`, {
    searchText,
    projId
  });
};

export const getStrategyItem = function(strategyId) {
  return this.get(`getItem/${strategyId}`);
};

export const saveStrategyItem = function(modules) {
  return this.post(`modules/sync`, {
    modules
  });
};

export const getHistoryData = function(
  dsItemIds,
  startTime,
  endTime,
  timeFormat
) {
  return this.post(
    'analysis/startWorkspaceDataGenHistogram',
    {
      dsItemIds,
      timeStart: startTime,
      timeEnd: endTime,
      timeFormat
    },
    {
      apiHost: ''
    }
  );
};

export const getRealtimeData = function(dsItemIds) {
  return this.post(
    'analysis/startWorkspaceDataGenPieChart',
    {
      dsItemIds
    },
    {
      apiHost: ''
    }
  );
};
export const getDataSourceList = function(projId, nodeId) {
  let postData = {
    projId: projId,
    isOnlyGroup: false
  };
  if (nodeId) {
    postData.Prt = nodeId;
  }
  return this.post(`tag/getThingTreeNew`, postData, {
    apiHost: ''
  });
};

export const getDsItemsById = function(dsItemIds) {
  return this.post('analysis/datasource/getDsItemsById', dsItemIds, {
    apiHost: ''
  });
};

export const debugModule = function(data) {
  return this.post(`strategy/debugSingleModule`, data, {
    apiHost: 'http://121.40.127.62:8880'
  });
};

export const getFaultsClassNames = function(lang) {
  return this.get(
    `diagnosis_v2/getFaultsClassNames/${lang}`,
    {},
    {
      apiHost: ''
    }
  );
};

export const getFaultsClassNamesByIds = function(lang, ids) {
  return this.post(
    `diagnosis_v2/getFaultsClassNamesByIds/${lang}`,
    { ids },
    {
      apiHost: ''
    }
  );
};

export const getFaultsInfo = function(json) {
  return this.post(
    'diagnosis_v2/getFaultsInfoV2',
    {
      pageNum: json.pageNum,
      pageSize: 20,
      grades: json.grades,
      consequences: json.consequences,
      keywords: json.keywords,
      classNames: json.classNames,
      sort: json.sort,
      lan: json.lan,
      ids: json.ids,
      searchType: json.searchType
    },
    {
      apiHost: ''
    }
  );
};

export const deleteFault = function(id) {
  return this.post(
    'diagnosis_v2/deleteFault',
    {
      id
    },
    {
      apiHost: ''
    }
  );
};

export const addNewFault = function(json) {
  return this.post(
    'diagnosis_v2/addNewFault',
    {
      isPublic: json.isPublic,
      lastModifyUser: json.lastModifyUser,
      lastModifyTime: json.lastModifyTime,
      name: json.name,
      description: json.description,
      suggestion: json.suggestion,
      grade: json.grade,
      faultType: json.faultType,
      faultGroup: json.faultGroup,
      runMode: json.runMode,
      consequence: json.consequence,
      chartTitle: json.chartTitle,
      className: json.className,
      maintainable: json.maintainable
    },
    {
      apiHost: ''
    }
  );
};

export const getAPIList = function(lang) {
  return this.get(
    `apiTree`,
    { lang },
    {
      apiHost: 'http://121.41.28.69'
    }
  );
};

export const checkPythonCode = function(text) {
  return this.post(
    `point_tool/check/`,
    { code: text },
    {
      apiHost: ''
    }
  );
};

export const getTemplateTree = function(data) {
  return this.get('getTemplateTree');
};

export const addNewFile = function(data) {
  return this.post('addNewFile', {
    data
  });
};

export const getTemplates = function(
  selectedIds,
  grade,
  source,
  tags,
  key,
  user
) {
  return this.post('getTemplates', {
    selectedIds,
    grade,
    source,
    tags,
    key,
    user
  });
};

export const deleteTemplate = function(templateId) {
  return this.post('deleteTemplate', {
    templateId
  });
};

export const exportTemplate = function(strategyInfo, modules) {
  return this.post('exportTemplate', {
    strategyInfo,
    modules
  });
};

export const updateTemplate = function(id, info) {
  return this.post('updateTemplate', {
    id,
    info
  });
};

export const getEnergyConfig = function() {
  return this.get(
    'static/app/Strategy/energyConfig.json',
    {},
    {
      apiHost: ''
    }
  );
};

export const getTagDict = function() {
  return this.get(
    'tag/dict',
    {},
    {
      apiHost: ''
    }
  );
};

export const copyTemplateAddNew = function(data, modules) {
  return this.post('copyTemplateAddNew', {
    data,
    modules
  });
};

export const getDataSourceGroup = function(
  projectId,
  currentPage,
  pageSize,
  searchText
) {
  let postData = {
    projectId,
    currentPage,
    pageSize,
    searchText
  };
  return this.post(`point_tool/getCloudPointTable/`, postData, {
    apiHost: ''
  });
};

export const getTagSearchList = function(projId, tag) {
  let postData = {
    isTree: 1,
    projId,
    searchName: [],
    tag
  };
  return this.post(`tag/search/tagAnalysis`, postData, {
    apiHost: ''
  });
};

export const readExcelFile = function(file) {
  return this.post('readExcelFile', file, {
    headers: {
      merge: true,
      'Content-Type': false
    }
  });
};

export const dqdConfigsGet = function(projId, postData) {
  return this.get(`dqd/configs/${projId}`, postData, {
    apiHost: ''
  });
};

export const dqdConfigsSave = function(projId, configs) {
  return this.post(`dqd/configs/${projId}`, {
    configs
  }, {
    apiHost: ''
  });
};
export const dataAttributebyTagInfo = function(data) {
  return this.post(`application/dataAttributebyTagInfo`, data, {
    apiHost: 'http://47.97.9.47:5123'
  });
};

export const login = function(data) {
  return this.post('login', data, {
    apiHost: ''
  });
};

export const exportDataExcel = function(data) {
  return this.post('exportDataExcel', data, {

  });
};

export const readDataMonitoringExcel = function(projId, file) {
  return this.post(`readDataMonitoringExcel/${projId}`, file, {
    headers: {
      merge: true,
      'Content-Type': false
    }
  });
};

export const readDataSourceExcel = function(file) {
  return this.post(`readDataSourceExcel`, file, {
    headers: {
      merge: true,
      'Content-Type': false
    }
  });
};

export const setMutileRealtimedata = function(data) {
  return this.post('set_mutile_realtimedata_by_projid', data, {
    apiHost: ''
  });
};


ApiFetch.prototype.getStrategyList = getStrategyList;
ApiFetch.prototype.createStrategy = createStrategy;
ApiFetch.prototype.removeStrategy = removeStrategy;
ApiFetch.prototype.updateStrategy = updateStrategy;
ApiFetch.prototype.searchStrategItem = searchStrategItem;
ApiFetch.prototype.getStrategyItem = getStrategyItem;
ApiFetch.prototype.saveStrategyItem = saveStrategyItem;
ApiFetch.prototype.getHistoryData = getHistoryData;
ApiFetch.prototype.getDataSourceList = getDataSourceList;
ApiFetch.prototype.getDsItemsById = getDsItemsById;
ApiFetch.prototype.getRealtimeData = getRealtimeData;
ApiFetch.prototype.debugModule = debugModule;
ApiFetch.prototype.getFaultsClassNames = getFaultsClassNames;
ApiFetch.prototype.getFaultsClassNamesByIds = getFaultsClassNamesByIds;
ApiFetch.prototype.getFaultsInfo = getFaultsInfo;
ApiFetch.prototype.deleteFault = deleteFault;
ApiFetch.prototype.addNewFault = addNewFault;
ApiFetch.prototype.getAPIList = getAPIList;
ApiFetch.prototype.checkPythonCode = checkPythonCode;
ApiFetch.prototype.publishStrategyItem = publishStrategyItem;
ApiFetch.prototype.getTemplateTree = getTemplateTree;
ApiFetch.prototype.addNewFile = addNewFile;
ApiFetch.prototype.getTemplates = getTemplates;
ApiFetch.prototype.deleteTemplate = deleteTemplate;
ApiFetch.prototype.exportTemplate = exportTemplate;
ApiFetch.prototype.updateTemplate = updateTemplate;
ApiFetch.prototype.getEnergyConfig = getEnergyConfig;
ApiFetch.prototype.getTagDict = getTagDict;
ApiFetch.prototype.copyTemplateAddNew = copyTemplateAddNew;
ApiFetch.prototype.getDataSourceGroup = getDataSourceGroup;
ApiFetch.prototype.getTagSearchList = getTagSearchList;
ApiFetch.prototype.readExcelFile = readExcelFile;
ApiFetch.prototype.dqdConfigsGet = dqdConfigsGet;
ApiFetch.prototype.dqdConfigsSave = dqdConfigsSave;
ApiFetch.prototype.dataAttributebyTagInfo = dataAttributebyTagInfo;
ApiFetch.prototype.login = login;
ApiFetch.prototype.exportDataExcel = exportDataExcel;
ApiFetch.prototype.readDataMonitoringExcel = readDataMonitoringExcel;
ApiFetch.prototype.readDataSourceExcel = readDataSourceExcel;
ApiFetch.prototype.setMutileRealtimedata = setMutileRealtimedata;
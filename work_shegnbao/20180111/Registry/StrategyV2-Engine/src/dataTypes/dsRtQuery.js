import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { DetectResult, isObject, isString, isArray } from './common';

export const isDsRtQueryObject = data => {
  if (!isObject(data)) {
    logger.warn('dsRtQueryObject 应为对象');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDsRtQueryObject(data)) {
    return I({
      dataType: dataTypes.DS_RT_QUERY,
      data: false
    });
  }
  return I({
    dataType: dataTypes.DS_RT_QUERY,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DS_RT_QUERY) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.DS_RT_QUERY,
    data: false
  });
};

const create = function(data) {
  // 判断是否是单纯的 js 对象
  if (!data.hasOwnProperty('dataType')) {
    return _createFromPlainJsObject(data);
  }
  return _createFromOtherDataTypes(data['dataType'], data['data']);
};

export default {
  create
};

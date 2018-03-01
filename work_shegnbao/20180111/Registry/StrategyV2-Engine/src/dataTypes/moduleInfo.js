import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isArray } from './common';

export const isModuleInfo = data => {
  if (!isObject(data)) {
    logger.warn('moduleInfo 应为对象');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isModuleInfo(data)) {
    return I({
      dataType: dataTypes.MODULE_INFO,
      data: false
    });
  }
  return I({
    dataType: dataTypes.MODULE_INFO,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.MODULE_INFO) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.MODULE_INFO,
    data: false
  });
};

/** static */
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
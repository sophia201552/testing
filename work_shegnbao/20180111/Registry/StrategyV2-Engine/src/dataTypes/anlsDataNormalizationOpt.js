import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isNumber, isArray } from './common';

export const isMethods = data => {
  if (!isArray(data)) {
    logger.warn('anlsDataNormalizationOpt methods 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isObject(data[i])) {
      logger.warn('anlsDataNormalizationOpt methods 应为对象数组');
      return false;
    }
    if (!isString(data[i].type)) {
      logger.warn('anlsDataNormalizationOpt methods type格式错误');
      return false;
    }
  }
  return true;
};

export const isanlsDataNormalizationOpt = data => {
  if (!isObject(data)) {
    logger.warn('anlsDataNormalizationOpt 应为对象');
    return false;
  }
  if (!isMethods(data['methods'])) {
    return false;
  }
  return true;
};
const _createFromPlainJsObject = data => {
  if (!isanlsDataNormalizationOpt(data)) {
    return I({
      dataType: dataTypes.ANLS_DATA_NORMALIZATION_OPT,
      data: false
    });
  }

  return I({
    dataType: dataTypes.ANLS_DATA_NORMALIZATION_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.ANLS_DATA_NORMALIZATION_OPT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.ANLS_DATA_NORMALIZATION_OPT,
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

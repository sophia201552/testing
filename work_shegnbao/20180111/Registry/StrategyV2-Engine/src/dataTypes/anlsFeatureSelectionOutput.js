import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import {
  isObject,
  isString,
  isNumber,
  isArray,
  isDataSetArray,
  isTimeArray
} from './common';
export const isAnlsFeatureSelectionOutputData = data => {
  if (!isArray(data)) {
    logger.warn('isAnlsFeatureSelectionOutput data 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    let o = data[i];
    if (!isObject(o)) {
      logger.warn('isAnlsFeatureSelectionOutput data 应为对象数组');
      return false;
    }
    if (!isString(o.name)) {
      logger.warn('isAnlsFeatureSelectionOutput methods 应为字符串');
      return false;
    }
    if (!isObject(o.params)) {
      logger.warn('isAnlsFeatureSelectionOutput params 应为对象');
      return false;
    }
    if (!isArray(o.value)) {
      logger.warn('isAnlsFeatureSelectionOutput value 应为数组');
      return false;
    }
  }
  return true;
};

export const isAnlsFeatureSelectionOutput = data => {
  if (!isArray(data)) {
    logger.warn('isAnlsFeatureSelectionOutput 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    let o = data[i];
    if (!isObject(o)) {
      logger.warn('isAnlsFeatureSelectionOutput 应为对象数组');
      return false;
    }
    if (!isString(o.method)) {
      logger.warn('isAnlsFeatureSelectionOutput methods 应为字符串');
      return false;
    }
    if (!isAnlsFeatureSelectionOutputData(o.data)) {
      return false;
    }
  }
  return true;
};
const _createFromPlainJsObject = data => {
  if (!isAnlsFeatureSelectionOutput(data)) {
    return I({
      dataType: dataTypes.ANLS_FEATURE_SELECTION_OUTPUT,
      data: false
    });
  }

  return I({
    dataType: dataTypes.ANLS_FEATURE_SELECTION_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.ANLS_FEATURE_SELECTION_OUTPUT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.ANLS_FEATURE_SELECTION_OUTPUT,
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

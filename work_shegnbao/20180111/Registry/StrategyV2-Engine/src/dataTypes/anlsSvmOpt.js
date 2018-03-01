import I from 'seamless-immutable';

import { dataTypes } from '../enum';

import {
  isObject,
  isString,
  isArray,
  isNumber,
  isTimeArray,
  isDataSetArray,
  isMethodOptArray
} from './common';

export const isOptions = data => {
  if (!isObject(data)) {
    logger.warn('data 应为对象');
    return false;
  }
  if (!isArray(data['independentVariables'])) {
    logger.warn('independentVariables 应为数组');
    return false;
  }
  if (!isArray(data['dependentVariables'])) {
    logger.warn('dependentVariables 应为数组');
    return false;
  }
  if (!isNumber(data['cvSplitRatio'])) {
    logger.warn('cvSplitRatio 应为数字');
    return false;
  }
  return true;
};

export const isAnlsSvmOpt = data => {
  if (!isObject(data)) {
    logger.warn('anlsSvmOpt 应为对象');
    return false;
  }
  if (!isTimeArray(data['time'])) {
    logger.warn('time 应为时间数组');
    return false;
  }
  if (!isMethodOptArray(data['methods'])) {
    logger.warn('methods 应为相关的方法配置数组');
    return false;
  }
  if (!isOptions(data['options'])) {
    return false;
  }
  if (!isDataSetArray(data['data'])) {
    logger.warn('data 应为数据集数组');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isAnlsSvmOpt(data)) {
    return I({
      dataType: dataTypes.ANLS_SVM_OPT,
      data: false
    });
  }
  return I({
    dataType: dataTypes.ANLS_SVM_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.ANLS_SVM_OPT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.ANLS_SVM_OPT,
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

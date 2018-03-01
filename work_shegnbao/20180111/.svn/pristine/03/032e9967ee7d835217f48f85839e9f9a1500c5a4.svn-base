import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isArray } from './common';

export const isParamsArray = data => {
  if (!isArray(data)) {
    logger.warn('params 应为数组');
    return false;
  }

  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isString(data[i].name)) {
      logger.warn('name 应为字符串');
      return false;
    }
    if (!isString(data[i].value)) {
      logger.warn('value 应为字符串');
      return false;
    }
  }
  return true;
};

export const isPythonOpt = data => {
  if (!isObject(data)) {
    logger.warn('pythonOpt 应为对象');
    return false;
  }
  if (!isParamsArray(data['params'])) {
    return false;
  }
  if (!isString(data['code'])) {
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isPythonOpt(data)) {
    return I({
      dataType: dataTypes.PYTHON_OPT,
      data: false
    });
  }

  return I({
    dataType: dataTypes.PYTHON_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.PYTHON_OPT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.PYTHON_OPT,
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

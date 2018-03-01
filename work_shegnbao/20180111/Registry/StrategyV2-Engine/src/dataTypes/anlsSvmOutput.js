import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import {
  isObject,
  isString,
  isArray,
  isNumber,
  isTimeArray,
  isDataSetArray
} from './common';

export const isEvaluation = data => {
  let evaluation = data['evaluation'];
  if (!isObject(evaluation)) {
    logger.warn('evaluation 应为对象');
    return false;
  }
  let train = evaluation['train'];
  if (!isObject(train)) {
    logger.warn('train 应为对象');
    return false;
  }
  if (!isNumber(train['mean_squared_error'])) {
    logger.warn('mean_squared_error 应为数字');
    return false;
  }
  if (!isNumber(train['mean_absolute_error'])) {
    logger.warn('mean_absolute_error 应为数字');
    return false;
  }
  if (!isNumber(train['r2_score'])) {
    logger.warn('r2_score 应为数字');
    return false;
  }
  return true;
};

export const isAnlsSvmOutput = data => {
  if (!isObject(data)) {
    logger.warn('anlsSvmOutput 应为对象');
    return false;
  }
  if (!isTimeArray(data['time'])) {
    logger.warn('time 应为时间数组');
    return false;
  }
  if (!isString(data['model'])) {
    logger.warn('model 应为字符串');
    return false;
  }
  if (!isEvaluation(data['evaluation'])) {
    return false;
  }
  if (!isDataSetArray(data['data'])) {
    logger.warn('data 应为数据集数组');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isAnlsSvmOutput(data)) {
    return I({
      dataType: dataTypes.ANLS_SVM_OUTPUT,
      data: false
    });
  }
  return I({
    dataType: dataTypes.ANLS_SVM_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.ANLS_SVM_OUTPUT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.ANLS_SVM_OUTPUT,
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

import I from 'seamless-immutable';

import dataTypeFactory from './';

import { dataTypes } from '../enum';
import {
  isObject,
  isString,
  isArray,
  isNumber,
  isTimeArray,
  isDataSetArray,
  isTimeString,
  isTimeFormatString
} from './common';

export const isOptions = data => {
  let options = data['options'];
  if (!isObject(options)) {
    logger.warn('options 应为对象');
    return false;
  }
  if (!isString(options['model'])) {
    logger.warn('model 应为字符串');
    return false;
  }
  if (!isArray(options['dependentVariables'])) {
    logger.warn('dependentVariables 应为数组');
    return false;
  }
  if (!isArray(options['independentVariables'])) {
    logger.warn('independentVariables 应为数组');
    return false;
  }
  if (!isTimeString(options['startTime'])) {
    logger.warn('startTime 应为时间字符串');
    return false;
  }
  if (!isTimeString(options['endTime'])) {
    logger.warn('endTime 应为时间字符串');
    return false;
  }
  if (!isTimeFormatString(options['timeFormat'])) {
    logger.warn('timeFormat 应为取样间隔字符串');
    return false;
  }
  return true;
};

export const isAnlsPredictOpt = data => {
  if (!isObject(data)) {
    logger.warn('anlsPredictOpt 应为对象');
    return false;
  }
  if (!isOptions(data)) {
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isAnlsPredictOpt(data)) {
    return dataTypeFactory.createEmpty(dataTypes.ANLS_PREDICT_OPT);
  }
  return I({
    dataType: dataTypes.ANLS_PREDICT_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.ANLS_PREDICT_OPT) {
    return I({
      dataType,
      data
    });
  }
  return dataTypeFactory.createEmpty(dataTypes.ANLS_PREDICT_OPT);
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

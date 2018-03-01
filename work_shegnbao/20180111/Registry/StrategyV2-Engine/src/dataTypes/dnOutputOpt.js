import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { DetectResult, isObject, isString, isArray, isNumber } from './common';

export const isStringType = data => {
  if (!isString(data['name'])) {
    logger.warn('name 应为字符串');
    return false;
  }
  if (!isString(data['targetGroup'])) {
    logger.warn('targetGroup 应为字符串');
    return false;
  }
  if (!isArray(data['faultTypeGroup'])) {
    logger.warn('faultTypeGroup 应为数组');
    return false;
  }
  return true;
};
export const isNumberType = data => {
  if (!(isNumber(data['faultId']) || data['faultId'] == '')) {
    logger.warn('faultId 应为数字');
    return false;
  }
  if (!(isNumber(data['faultTag']) || data['faultTag'] == '')) {
    logger.warn('faultTag 应为数字');
    return false;
  }
  if (!isNumber(data['runDay'])) {
    logger.warn('runDay 应为数字');
    return false;
  }
  if (!isNumber(data['runMonth'])) {
    logger.warn('runMonth 应为数字');
    return false;
  }
  if (!isNumber(data['runWeek'])) {
    logger.warn('runWeek 应为数字');
    return false;
  }
  if (!isNumber(data['runYear'])) {
    logger.warn('runYear 应为数字');
    return false;
  }
  if (!isNumber(data['status'])) {
    logger.warn('status 应为数字');
    return false;
  }
  if (!(isNumber(data['targetExecutor']) || data['faultTag'] == '')) {
    logger.warn('targetExecutor 应为数字');
    return false;
  }
  return true;
};
export const isChart = data => {
  if (!isArray(data['chart'])) {
    logger.warn('chart 应为数组');
    return false;
  }
  for (let j = 0, len = data['chart'].length; j < len; j += 1) {
    if (!isObject(data['chart'][j])) {
      logger.warn('chart数组里应为对象');
      return false;
    }
    if (!isString(data['chart'][j]['name'])) {
      logger.warn('chart下的name 应为字符串');
      return false;
    }
    if (!isNumber(data['chart'][j]['type'])) {
      logger.warn('chart下的type 应为数字');
      return false;
    }
  }
  return true;
};
export const isEnergyConfig = data => {
  if (!isObject(data['energyConfig'])) {
    logger.warn('energyConfig 应为对象');
    return false;
  }
  // if (!isNullObject(data['energyConfig'])) {
  //   if (!isString(data['energyConfig']['name'])) {
  //     logger.warn('energyConfig name 应为字符串');
  //     return false;
  //   }
  //   if (!isObject(data['energyConfig']['parameters'])) {
  //     logger.warn('energyConfig parameters 应为对象');
  //     return false;
  //   }
  //   for (let key in data['energyConfig']['parameters']) {
  //     if (!isNumber(data['energyConfig']['parameters'][key])) {
  //       logger.warn('energyConfig  parameters 应为数字');
  //       return false;
  //     }
  //   }
  // }
  return true;
};
export const isNullObject = data => {
  if (JSON.stringify(data) === '{}') {
    return true;
  } else {
    return false;
  }
};
export const isOutputOptions = data => {
  if (!isArray(data)) {
    logger.warn('params 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isObject(data[i])) {
      logger.warn('params数组里应为对象');
      return false;
    }
    if (!isStringType(data[i])) {
      return false;
    }
    if (!isNumberType(data[i])) {
      return false;
    }
    if (!isChart(data[i])) {
      return false;
    }
    if (!isEnergyConfig(data[i])) {
      return false;
    }
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isOutputOptions(data)) {
    return I({
      dataType: dataTypes.DN_OUTPUT_OPT,
      data: false
    });
  }
  return I({
    dataType: dataTypes.DN_OUTPUT_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DN_OUTPUT_OPT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.DN_OUTPUT_OPT,
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

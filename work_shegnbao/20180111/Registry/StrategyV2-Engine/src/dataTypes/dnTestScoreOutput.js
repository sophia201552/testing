import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isArray } from './common';
import { isNumber } from 'util';

export const isDnTestScoreOutput = data => {
  if (!isArray(data)) {
    logger.warn('dnTestScoreOutput 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isObject(data[i])) {
      logger.warn('dnTestScoreOutput 应为对象数组');
      return false;
    }
    if(!isString(data[i].faultName)){
        logger.warn('dnTestScoreOutput faultName 应为字符串');
        return false;
    }
    if(!isNumber(data[i].occtimes)){
        logger.warn('dnTestScoreOutput occtimes 应为数字');
        return false;
    }
    if(!isNumber(data[i].status)){
        logger.warn('dnTestScoreOutput status 应为数字');
        return false;
    }
    if(!isString(data[i].errorMsg)){
        logger.warn('dnTestScoreOutput errorMsg 应为字符串');
        return false;
    }
    if(!isArray(data[i].breakingRules)){
        logger.warn('dnTestScoreOutput breakingRules 应为数组');
        return false;
    }
  }

  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDnTestScoreOutput(data)) {
    return I({
      dataType: dataTypes.DN_TEST_SCORE_OUTPUT,
      data: false
    });
  }

  return I({
    dataType: dataTypes.DN_TEST_SCORE_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DN_TEST_SCORE_OUTPUT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.DN_TEST_SCORE_OUTPUT,
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

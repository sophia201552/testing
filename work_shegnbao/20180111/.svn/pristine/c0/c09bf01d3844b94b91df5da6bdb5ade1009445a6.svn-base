import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { DetectResult, isObject, isString, isArray } from './common';

export const isDnTestScoreOpt = data => {
  if (!isObject(data)) {
    logger.warn('dnTestScoreOpt 应为对象');
    return false;
  }
  if (!isString(data['time'])) {
    logger.warn('time 应为字符串');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isDnTestScoreOpt(data)) {
    return I({
      dataType: dataTypes.DN_TEST_SCORE_OPT,
      data: false
    });
  }
  return I({
    dataType: dataTypes.DN_TEST_SCORE_OPT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DN_TEST_SCORE_OPT) {
    return I({
      dataType,
      data
    });
  }
  return I({
    dataType: dataTypes.DN_TEST_SCORE_OPT,
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

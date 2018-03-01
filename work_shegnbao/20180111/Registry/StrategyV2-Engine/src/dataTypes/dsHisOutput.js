import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isArray, isTimeArray } from './common';

export const isHisOutputDataObject = data => {
  if (!isObject(data)) {
    logger.warn('dsOptObject 应为对象');
    return false;
  }
  if (!isString(data['name'])) {
    logger.warn('name 应为字符串');
    return false;
  }
  if (!isArray(data['value'])) {
    logger.warn('value 格式有误');
    return false;
  }
  return true;
};

export const isHisOutputDataArray = data => {
  if (!isArray(data)) {
    logger.warn('HisOutputData 应为数组');
    return false;
  }
  for (let i = 0, len = data.length; i < len; i += 1) {
    if (!isHisOutputDataObject(data[i])) {
      return false;
    }
  }
  return true;
};

export const isHisOutput = data => {
  if (!isObject(data)) {
    logger.warn('hisOutput 应为对象');
    return false;
  }
  if (!isTimeArray(data['time'])) {
    logger.warn('time 应为时间字符串数组');
    return false;
  }
  if (!isHisOutputDataArray(data['data'])) {
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isHisOutput(data)) {
    return I({
      dataType: dataTypes.DS_HIS_OUTPUT,
      data: false
    });
  }
  return I({
    dataType: dataTypes.DS_HIS_OUTPUT,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.DS_HIS_OUTPUT) {
    return I({
      dataType,
      data
    });
  }

  if (!data) {
    return I({
      dataType: dataTypes.DS_HIS_OUTPUT,
      data: false
    });
  }

  // 从其他类型转换过来
  switch (dataType) {
    case dataTypes.ANLS_DEDUPLICATION_OUTPUT:
      return I({
        dataType: dataTypes.DS_HIS_OUTPUT,
        data: {
          time: data.time,
          data: data.data.map(row =>
            Object.assign({}, row, {
              value: row.value.map(
                v =>
                  isObject(v) && v.type === 'DUPLICATED' ? '-' : v
              )
            })
          )
        }
      });
    case dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT:
      return I({
        dataType: dataTypes.DS_HIS_OUTPUT,
        data: {
          time: data.time,
          data: data.data.map(row =>
            Object.assign({}, row, {
              value: row.value.map(
                v =>
                  isObject(v) && v.type === 'COMPLEMENTARY' ? v.value : v
              )
            })
          )
        }
      });
    default:
      break;
  }

  return I({
    dataType: dataTypes.DS_HIS_OUTPUT,
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

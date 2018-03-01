import I from 'seamless-immutable';

import { dataTypes } from '../enum';
import { isObject, isString, isArray, isDataSetArray } from './common';

export const isValid = data => {
  if (!isObject(data)) {
    logger.warn('dsOptObject 应为对象');
    return false;
  }
  if (!isString(data['name'])) {
    logger.warn('name 应为字符串');
    return false;
  }
  if (!isTagsArray(data['value'])) {
    logger.warn('value 格式有误');
    return false;
  }
  return true;
};

const _createFromPlainJsObject = data => {
  if (!isValid(data)) {
    return I({
      dataType: dataTypes.BASE_DATASET,
      data: false
    });
  }
  return I({
    dataType: dataTypes.BASE_DATASET,
    data
  });
};

const _createFromOtherDataTypes = (dataType, data) => {
  if (dataType === dataTypes.BASE_DATASET) {
    return I({
      dataType,
      data
    });
  }

  // 从其他类型转换过来
  switch(dataType) {
    case dataTypes.ANLS_DEDUPLICATION_OUTPUT:
      return I({
        dataType: dataType.BASE_DATASET,
        data: {
          time: data.time,
          data: data.data.map(
            row => {
              if (isObject(row) && row.type === 'DUPLICATED') {
                return {
                    type: 'MISSING'
                };
              }
              return row;
            }
          ) // data.data.map
        }
      });
    case dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT:
      return I({
        dataType: dataType.BASE_DATASET,
        data: data.data.map(
          row => {
            if (isObject(row) && row.type === 'COMPLETED') {
              return row.value;
            }
            return row;
          }
        )
      });
    default: break;
  }

  return I({
    dataType: dataTypes.BASE_DATASET,
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

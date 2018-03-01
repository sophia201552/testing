import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';
import { debug } from 'util';

export default class DataDeduplicationChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;
    let inputData = this._moduleInputData;

    switch (type) {
      case dataTypes.ANLS_DEDUPLICATION_OPT:
        let dsHisOutput = inputData.find(
          input => input.dataType == dataTypes['DS_HIS_OUTPUT']
        ) || { data: false };
        let dsHisOutputData = dsHisOutput.data || {};
        data = {
          data: dsHisOutputData.data || [],
          time: dsHisOutputData.time || [],
          methods: [
            {
              type: options.methods.type,
              toleranceLimits: options.methods.toleranceLimits
            }
          ]
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`数据去重 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
  createModuleOutputData(type) {
    switch(type) {
      case dataTypes.DS_OPT:
        return this._createData(type, this._moduleInputData);
      case dataTypes.DS_HIS_OUTPUT:
        return this._createData(type, this._response);
    }
  }
}

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
      case dataTypes.ANLS_DATA_NORMALIZATION_OPT:
        let dsHisOutput = inputData.find(
          input => input.dataType == dataTypes['DS_HIS_OUTPUT']
        ) || { data: false };
        let dsHisOutputData = dsHisOutput.data || {};
        data = {
          data: dsHisOutputData.data || [],
          time: dsHisOutputData.time || [],
          methods: options.methods
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`数据归一化 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
  createModuleOutputData(type) {
    switch (type) {
      case dataTypes.DS_OPT:
        return this._createData(type, this._moduleInputData);
      case dataTypes.DS_HIS_OUTPUT:
        let findResp = this._response.find(
          resp => resp.dataType == dataTypes['ANLS_DATA_NORMALIZATION_OUTPUT']
        ) || { data: false };
        let findData = findResp.data || {};
        let data = {
          data: findData[0].data || [],
          time: findData[0].time || []
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`数据归一化 模块不支持创建'${type}'类型的 Response 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
}

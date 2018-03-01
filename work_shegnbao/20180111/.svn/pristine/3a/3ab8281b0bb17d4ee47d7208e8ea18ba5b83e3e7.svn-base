import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';
import { debug } from 'util';

export default class DataComplementChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;
    let inputData = this._moduleInputData;

    switch (type) {
      case dataTypes.ANLS_DATA_COMPLEMENT_OPT:
        let dsHisOutput = inputData.find(
          input => input.dataType == dataTypes['DS_HIS_OUTPUT']
        ) || { data: false };
        let dsHisOutputData = dsHisOutput.data || {};
        data = {
          data: dsHisOutputData.data || [],
          time: dsHisOutputData.time || [],
          methods: [
            {
              type: options.methods.type
            }
          ],
          options: {
            maxPaddingInterval: options.options.maxPaddingInterval
          }
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`数据补齐 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
  createModuleOutputData(type) {
    switch (type) {
      case dataTypes.DS_OPT:
        return this._createData(type, this._moduleInputData);
      case dataTypes.DS_HIS_OUTPUT:
        return this._createData(type, this._response);
    }
  }
}

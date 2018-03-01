import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class DataMonitoringChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;
    let inputData = this._moduleInputData;

    switch (type) {
      default:
        logger.warn(`数据监测 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
  createModuleOutputData(type) {

  }
}
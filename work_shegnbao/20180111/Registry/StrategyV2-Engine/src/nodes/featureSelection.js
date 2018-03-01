import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class FeatureSelectionChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;
    let inputData = this._moduleInputData;

    switch (type) {
      case dataTypes.ANLS_FEATURE_SELECTION_OPT:
        let dsHisOutput = inputData.find(
          input => input.dataType == dataTypes['DS_HIS_OUTPUT']
        ) || { data: false };
        let dsHisOutputData = dsHisOutput.data || {};
        data = {
          data: dsHisOutputData.data || [],
          time: dsHisOutputData.time || [],
          methods: options.methods.filter(v=>options.options.selectedTypes.indexOf(v.type)>-1),
          options: options.options
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`特征选择 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
}

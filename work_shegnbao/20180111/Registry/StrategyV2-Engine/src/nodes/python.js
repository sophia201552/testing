import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class PythonChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;

    switch (type) {
      case dataTypes.PYTHON_OPT:
        data = {
          params: [],
          code: options.content || ''
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`Python 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
  createModuleOutputData(type) {
    let data = [];
    let options = this._module.options;
    let inputData = this._moduleInputData;
    let response = this._response;
    let dtFactory;
    switch (type) {
      case dataTypes.PYTHON_OUTPUT:
        return super.createModuleOutputData(type);
      case dataTypes.DS_OPT:
      case dataTypes.DS_HIS_OUTPUT:
        let pyOutput = response.find(v=>v.dataType==dataTypes.PYTHON_OUTPUT) || {data:false},
          pyOutputData = pyOutput.data || {};
        try {
          let rs = JSON.parse(pyOutputData.result);
          let target = rs.find(v=>v.dataType==type);
          dtFactory = dataTypeFactory.get(type);
          return dtFactory.create(target.data);
        } catch (error) {
          return dataTypeFactory.createEmpty(type);
        }
      
      default:
        logger.warn(`Python 模块不支持创建'${type}'类型的 Output 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
}

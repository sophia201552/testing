import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class DiagnosisChainNode extends ChainNode {
  createModuleOutputData(type) {
    let options = this._module.options;

    switch (type) {
      case dataTypes.DN_OUTPUT_OPT:
        let data = options.params || [];
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`诊断项 模块不支持创建'${type}'类型的 Output 数据`);
        return {};
    }
  }
}

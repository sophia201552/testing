import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class LogicChainNode extends ChainNode {
  createModuleOutputData(type) {
    let data = super.createModuleOutputData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;

    switch (type) {
      case dataTypes.DN_ANLS_OPT:
        data = {
          rule: options.rule || '',
          ruleBlock: options.ruleBlock
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`逻辑分析 模块不支持创建'${type}'类型的 Output 数据`);
        return {};
    }
  }
}

import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class ExecTestChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;
    let inputData = this._moduleInputData;
    switch (type) {
      case dataTypes.DN_TEST_SCORE_OPT:
        data={
            time:options.dataset.options.time
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);

      default:
        logger.warn(`测试评估 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
}

import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class SVMChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options,
      inputData = this._moduleInputData;

    switch (type) {
      case dataTypes.ANLS_SVM_OPT:
        let dsHisOutput = inputData.find(
          input => input.dataType == dataTypes['DS_HIS_OUTPUT']
        );
        data = {
          data: (dsHisOutput && dsHisOutput.data.data) || [],
          time: (dsHisOutput && dsHisOutput.data.time) || [],
          methods: [
            {
              type: options.svmType.type,
              C: options.svmType.cost,
              epsilon: options.svmType.epsilon,
              kernel: options.kernel.type
            }
          ],
          options: {
            independentVariables: options.options.independenVariables,
            dependentVariables: options.options.dependenVariables,
            cvSplitRatio: options.options.cvSplitRatio
          }
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`SVM 模块不支持创建'${type}'类型的 Query 数据`);
        return {};
    }
  }
  createModuleOutputData(type) {
    return this._createData(
      type,
      this._response.concat(this._moduleInputData)
    );
  }
}

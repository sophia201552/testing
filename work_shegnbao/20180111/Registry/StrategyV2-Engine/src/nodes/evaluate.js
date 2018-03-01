import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class EvaluateChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;
    let inputData = this._moduleInputData;

    switch (type) {
      case dataTypes.ANLS_EVALUATE_OPT:
        let anlsSvmOutput = inputData.find(
            input => input.dataType == dataTypes['ANLS_SVM_OUTPUT']
          ) || { data: false },
          anlsSvmOutputData = anlsSvmOutput.data;
        let queryOptions = {};
        if(options.selectedMethods.indexOf(dataTypes['ANLS_SVM_OUTPUT'])>-1 && anlsSvmOutputData){
            queryOptions['independentVariables'] = anlsSvmOutputData.options.independentVariables;
            queryOptions['dependentVariables'] = anlsSvmOutputData.options.dependentVariables;
            queryOptions['model'] = anlsSvmOutputData.model;
        }
        let timeConfig = options.timeConfig;     
        data = {
          startTime: timeConfig.timeStart,
          endTime: timeConfig.timeEnd,
          timeFormat: timeConfig.timeFormat,
          methods: [],
          options: queryOptions
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);

      default:
        logger.warn(`评价 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
}

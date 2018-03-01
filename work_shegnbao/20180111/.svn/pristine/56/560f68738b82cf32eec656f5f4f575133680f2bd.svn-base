import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

import { diff } from '@beopcloud/diff';
import { apiFetch } from '../../index';

export default class PredictionChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;
    let inputData = this._moduleInputData;

    switch (type) {
      case dataTypes.ANLS_PREDICT_OPT:
        let svmOutput = inputData.find(
          input => input.dataType == dataTypes['ANLS_SVM_OUTPUT']
        );
        let svmOutputOptions = svmOutput.data.options || {};
        data = {
          options: {
            model: (svmOutput && svmOutput.data.model) || '',
            dependentVariables: svmOutputOptions['dependentVariables'],
            independentVariables: svmOutputOptions['independentVariables'],
            startTime: options.dataset.options.startTime,
            endTime: options.dataset.options.endTime,
            timeFormat: options.dataset.options.timeFormat
          }
        };
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(`Prediction 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
}

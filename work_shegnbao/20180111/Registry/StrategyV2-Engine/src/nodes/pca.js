import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';

export default class PcaChainNode extends ChainNode {
  /** @override  */
  createModuleOutputData(type) {
    let response = this._response;

    let pcaOutput = response.find(
      row => row.dataType === dataTypes['ANLS_PCA_OUTPUT']
    )
    let pcaOutputData = pcaOutput.data[0];

    if (type === dataTypes.DS_HIS_OUTPUT) {
      try {
        let data = {};
        data.data = pcaOutputData.data.map(
          row => ({
            name: row.name,
            value: row.value
          })
        );
        data.time = pcaOutputData.time;
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      } catch(e) {
        logger.error(e);
        return dataTypeFactory.createEmpty(type);
      }
    } else if (type === dataTypes.DS_OPT) {
      try {
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(pcaOutputData.data.map(
          row =>({
            name: row.name,
            dsId: ''
          })
        ));
      } catch(e) {
        logger.error(e);
        return dataTypeFactory.createEmpty(type);
      }
    }
    logger.warn(
      `PCA 模块不支持创建'${type}'类型的 Response 数据`
    );
    return dataTypeFactory.createEmpty(type);
  }
  /** @override */
  createQueryData(type) {
    let inputData = this._moduleInputData;
    let options = this._module.options;

    switch (type) {
      case dataTypes.ANLS_PCA_OPT:
        let data = options;
        let historyData = inputData.find(
          row => row.dataType === dataTypes['DS_HIS_OUTPUT']
        );
        let value = historyData.data
          ? historyData.data.data.map(row => ({
              name: row.name,
              value: row.value
            }))
          : [];
        let time = historyData.data ? historyData.data.time : [];
        let newData =
          data.selectedDs && data.selectedDs.length
            ? value.filter(row => data.selectedDs.indexOf(row.name) !== -1)
            : value;
        data = data.selectedDs ? data.without('selectedDs') : data;
        data = Object.assign({}, data, {
          data: newData,
          time: time
        });
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      default:
        logger.warn(
          `PCA 模块不支持创建'${type}'类型的 Query 数据`
        );
        return dataTypeFactory.createEmpty(type);
    }
  }
}

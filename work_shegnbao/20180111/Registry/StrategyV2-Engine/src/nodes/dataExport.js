import ChainNode from '../chainNode';
import moduleConfig from '../moduleConfig';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import { diff } from '@beopcloud/diff';

export default class DataExportChainNode extends ChainNode {
getModuleInputData() {
    if (this._fetchModuleInputDataPromise) {
      return this._fetchModuleInputDataPromise;
    }
    let supportDataTypes = moduleConfig[this._module.type];
    if (!supportDataTypes.inputs || !supportDataTypes.inputs.length) {
      return (this._fetchModuleInputDataPromise = Promise.resolve().then(() => {
        this._fetchModuleInputDataPromise = undefined;
        return (this._moduleInputData = []);
      }));
    }
    return (this._fetchModuleInputDataPromise = Promise.all([
      ...this._in.map(row => row.getModuleOutputData())
    ])
      .then(
        params => {
          this._fetchModuleInputDataPromise = undefined;
          let moduleInputData = [];
          let supportDataTypes = moduleConfig[this._module.type];

          supportDataTypes.inputs.forEach(type => {
            let isOK = false;
            params.forEach(p => {
              isOK =  p.some(arg => {
                let rs = this.createModuleInputData(type, arg);
                if (rs.data === false) {
                  return false;
                }
                moduleInputData.push(rs);
                return true;
              }); // p.some
            }); // params.some
            if (!isOK) {
              moduleInputData.push(dataTypeFactory.createEmpty(type));
            }
          }); // inputs.forEach
          moduleInputData = this.mergeData(moduleInputData);
          // diff
          let diffRes = diff(this._moduleInputData, moduleInputData);
          if (!diffRes) {
            return this._moduleInputData;
          }
          this._moduleInputData = moduleInputData;
          return moduleInputData;
        } // then
      )
      .catch(err => {
        this._fetchModuleInputDataPromise = undefined;
        logger.error(err);
      }));
  }
  mergeData(moduleInputData){
    return moduleInputData;
  }
  createModuleOutputData(type) {
    let data = [];
    let options = this._module.options;
    let inputData = this._moduleInputData;
    let dtFactory;
    switch (type) {
      case dataTypes.DS_OPT:
        //TODO 筛选合并
        return super.createQueryData(type);
      case dataTypes.DS_HIS_OUTPUT:
        //TODO 筛选合并
        return super.createQueryData(type);
      default:
        logger.warn(`数据导出 模块不支持创建'${type}'类型的 Output 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
}

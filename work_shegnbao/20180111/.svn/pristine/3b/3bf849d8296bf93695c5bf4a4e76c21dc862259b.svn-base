import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class FileExcelChainNode extends ChainNode {
  createModuleOutputData(type) {
    let data = super.createModuleOutputData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;
    let dtFactory;
    switch (type) {
      case dataTypes.DS_HIS_OUTPUT:
        data = options.data
          ? {
              dataType: 'DS_HIS_OUTPUT',
              data: options.data
            }
          : {
              dataType: 'DS_HIS_OUTPUT',
              data: false
            };
        dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      case dataTypes.DS_OPT:
        data = options.data.data;
        let newData = {
          dataType: 'DS_OPT',
          data: data.map(row => ({
            name: row.name,
            dsId: ''
          }))
        };
        dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(newData);
      default:
        logger.warn(`excel 模块不支持创建'${type}'类型的 OutPut 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
}

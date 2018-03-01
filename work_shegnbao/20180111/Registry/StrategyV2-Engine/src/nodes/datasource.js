import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';

export default class DataSourceChainNode extends ChainNode {
  createQueryData(type) {
    let data = super.createQueryData(type);
    if (data.data !== false) {
      return data;
    }
    let options = this._module.options;
    let dtFactory;

    switch (type) {
      case dataTypes.DS_OPT:
        data = [];
        let group = options.groups.find(
          g => g._id === (options.activedGroup || 'Default')
        );
        if (!group) {
          logger.error('未在 groups 中找到对应的组.');
          return {};
        }
        options.params.forEach(row => {
          data.push({
            name: row.name,
            dsId: group.data[row.name]
          });
        });
        dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(data);
      case dataTypes.DS_HIS_QUERY:
        data = {};
        dtFactory = dataTypeFactory.get(type);
        let timeConfig = options.timeConfig;

        return dtFactory.create({
          startTime: timeConfig.timeStart,
          endTime: timeConfig.timeEnd,
          timeFormat: timeConfig.timeFormat,
          completing: options.completing
        });
      default:
        logger.warn(`数据源 模块不支持创建'${type}'类型的 Query 数据`);
        return dataTypeFactory.createEmpty(type);
    }
  }
}

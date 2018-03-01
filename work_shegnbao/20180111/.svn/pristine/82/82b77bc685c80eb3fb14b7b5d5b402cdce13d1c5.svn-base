import ChainNode from '../chainNode';
import { moduleTypes, dataTypes } from '../enum';
import dataTypeFactory from '../dataTypes';
import moduleConfig from '../moduleConfig';

export default class FuzzyChainNode extends ChainNode {
  createModuleOutputData(type) {
    let options = this._module.options;

    switch (type) {
      case dataTypes.DN_INPUT_OPT:
        let data = options.params || [];
        //格式转换
        let newData=[];
        data.forEach(v=>{
          if(v.terms){
            let newTerms = [];
            v.terms.forEach(t=>{
              if(t.points){
                t = t.set('points',t.points.map(p=>Number(p)));
              }
              newTerms.push(t);
            })
            v = v.set('terms',newTerms)
          }
          newData.push(v);
        })
        let dtFactory = dataTypeFactory.get(type);
        return dtFactory.create(newData);
      default:
        logger.warn(`模糊规则 模块不支持创建'${type}'类型的 Output 数据`);
        return {};
    }
  }
}

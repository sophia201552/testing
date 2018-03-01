import Chain from './chain';
import ChainNodes from './nodes';
import ChainNode from './chainNode';

export default class {
  constructor() {
    this._modules = undefined;
    this._chain = new Chain();
  }
  setModules(modules) {
    this._modules = modules;
    return this;
  }
  findNodeByModuleId(moduleId) {
    return this._chain.findNodeByModuleId(moduleId);
  }
  // 分析模块间关系
  analysis() {
    this._chain.clear();

    let nodes = this._modules.map(m => {
      let Clazz = ChainNodes[m.type];
      if (!Clazz) {
        logger.warn(`不支持的模块类型'${m.type}'`);
        Clazz = ChainNode;
      }
      let node = new Clazz(m);
      this._chain.add(node);
      return node;
    });
    let tailNodes = nodes.filter(n => {
      let m = n.getModule();
      return !m.outputs || m.outputs.length === 0;
    });

    let tailNode;
    while ((tailNode = tailNodes.shift())) {
      let tailNodeModuleId = tailNode.getModule()._id;
      nodes.forEach(n => {
        let m = n.getModule();
        let outputs = (m.outputs || []).map(row => row._id);

        if (outputs.indexOf(tailNodeModuleId) > -1) {
          this._chain.chain(n, tailNode);
          tailNodes.push(n);
        }
      });
    }
    return this;
  }
  dispose() {

  }
}

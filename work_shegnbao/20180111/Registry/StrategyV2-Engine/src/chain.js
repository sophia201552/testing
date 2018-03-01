export default class Chain {
  constructor() {
    this._heads = [];
    this._tails = [];
    this._nodes = [];
  }
  getHeads() {
    return this._heads;
  }
  getTails() {
    return this._tails;
  }
  has(node) {
    return this._nodes.indexOf(node);
  }
  findNodeByModuleId(mid) {
    let node = this._nodes.find(
        n => n.getModule()._id === mid
    );
    return node;
  }
  add(node) {
    node.setChain(this);
    this._nodes.push(node);
    this._refreshHeadTail();
    return this;
  }
  remove(node) {
    node.setChain();
    let idx = this._nodes.indexOf(node);
    if (idx === -1) {
      return this;
    }
    this._nodes.splice(idx, 1);
    this._refreshHeadTail();
    return this;
  }
  _refreshHeadTail() {
    this._heads.length = 0;
    this._tails.length = 0;
    this._nodes.forEach(n => {
      if (n.getInNodes().length === 0) {
        this._heads.push(n);
      }
      if (n.getOutNodes().length === 0) {
        this._tails.push(n);
      }
    });
    return this;
  }
  chain(srcNode, destNode) {
    srcNode.chainTo(destNode);
    this._refreshHeadTail();
    return this;
  }
  unchain(srcNode, destNode) {
    srcNode.unchainFrom(destNode);
    this._refreshHeadTail();
    return this;
  }
  createSubChainFromNode(node) {
    
  }
  clear() {
    this._heads.length = 0;
    this._tails.length = 0;
    this._nodes.length = 0;
  }
}

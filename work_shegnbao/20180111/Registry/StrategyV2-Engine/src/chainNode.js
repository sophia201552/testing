import moduleConfig from './moduleConfig';
import { moduleTypes, dataTypes } from './enum';
import dataTypeFactory from './dataTypes';
import { diff } from '@beopcloud/diff';

export default class ChainNode {
  constructor(module) {
    this._in = [];
    this._out = [];
    this._module = module;
    this._chain = undefined;
    this._moduleInputData = [];
    this._moduleOutputData = [];
    this._moduleInfo = [];
    this._query = [];
    // 存储上一次的 query，用于做借口缓存
    this._lastQuery = this._query;
    this._response = [];

    this._fetchQueryPromise = undefined;
    this._fetchResponsePromise = undefined;
    this._fetchModuleInputDataPromise = undefined;
    this._fetchModuleOutputDataPromise = undefined;

    this._ignoreResponseCache = false;

    this.setModuleInfo();
  }
  getInNodes() {
    return this._in;
  }
  getOutNodes() {
    return this._out;
  }
  getModule() {
    return this._module;
  }
  getQuery() {
    if (this._fetchQueryPromise) {
      return this._fetchQueryPromise;
    }
    let supportDataTypes = moduleConfig[this._module.type];
    if (!supportDataTypes.query || !supportDataTypes.query.length) {
      return (this._fetchQueryPromise = Promise.resolve().then(() => {
        this._fetchQueryPromise = undefined;
        return (this._query = []);
      }));
    }
    return (this._fetchQueryPromise = Promise.all([
      this.getModule(),
      this.getModuleInputData()
    ])
      .then(([md, mdInputData]) => {
        this._fetchQueryPromise = undefined;
        let query = [];
        let supportDataTypes = moduleConfig[this._module.type];
        // 获取最新的 query
        supportDataTypes.query.forEach(row => {
          query.push(this.createQueryData(row));
        });

        let diffRes = diff(this._query, query);
        if (!diffRes) {
          return this._query;
        }
        this._query = query;
        return query;
      })
      .catch(err => {
        this._fetchQueryPromise = undefined;
        logger.error(err);
      }));
  }
  getResponse() {
    if (this._fetchResponsePromise) {
      return this._fetchResponsePromise;
    }
    let supportDataTypes = moduleConfig[this._module.type];
    if (!supportDataTypes.response || !supportDataTypes.response.length) {
      return (this._fetchResponsePromise = Promise.resolve().then(() => {
        this._fetchResponsePromise = undefined;
        return (this._response = []);
      }));
    }
    return (this._fetchResponsePromise = Promise.all([this.getQuery()])
      .then(([query]) => {
        this._fetchResponsePromise = undefined;
        if (this._lastQuery === this._query) {
          return this._response;
        }

        return new Promise((resolve, reject) => {
          apiFetch
            .debugModule({
              type: this._module.type,
              data: query
            })
            .subscribe({
              next: resp => {
                let response = [];
                let supportDataTypes = moduleConfig[this._module.type];

                try {
                  if (!resp.success) {
                    reject('接口调用失败');
                    return;
                  }

                  supportDataTypes.response.forEach(type => {
                    resp['data'].some(p => {
                      let rs = this.createResponseData(type, p);
                      if (rs.data === false) {
                        return false;
                      }
                      response.push(rs);
                      return true;
                    }); // params.some
                  }); // response.forEach
                  // 只有接口请求返回，并处理成功，才更新 _lastQuery
                  this._lastQuery = this._query;
                } catch (err) {
                  logger.warn(err);
                  supportDataTypes.response.forEach(type => {
                    response.push(dataTypeFactory.createEmpty(type));
                  }); // response.forEach
                }

                let diffRes = diff(this._response, response);
                if (!diffRes) {
                  resolve(this._response);
                  return;
                }
                this._response = response;
                resolve(response);
              },
              error: err => {
                reject(err);
              }
            });
        });
      })
      .catch(err => {
        this._fetchResponsePromise = undefined;
        logger.error(err);
      }));
  }
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
            let rs = params.some(p => {
              return p.some(arg => {
                let rs = this.createModuleInputData(type, arg);
                if (rs.data === false) {
                  return false;
                }
                moduleInputData.push(rs);
                return true;
              }); // p.some
            }); // params.some
            if (!rs) {
              moduleInputData.push(dataTypeFactory.createEmpty(type));
            }
          }); // inputs.forEach

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
  getModuleOutputData() {
    if (this._fetchModuleOutputDataPromise) {
      return this._fetchModuleOutputDataPromise;
    }
    let supportDataTypes = moduleConfig[this._module.type];
    if (!supportDataTypes.outputs || !supportDataTypes.outputs.length) {
      return (this._fetchModuleOutputDataPromise = Promise.resolve().then(
        () => {
          this._fetchModuleOutputDataPromise = undefined;
          return (this._moduleOutputData = []);
        }
      ));
    }
    return (this._fetchModuleOutputDataPromise = Promise.all([
      this.getModule(),
      this.getModuleInputData(),
      this.getResponse()
    ])
      .then(() => {
        this._fetchModuleOutputDataPromise = undefined;
        let moduleOutputData = [];
        let supportDataTypes = moduleConfig[this._module.type];

        supportDataTypes.outputs.forEach(type => {
          moduleOutputData.push(this.createModuleOutputData(type));
        }); // forEach

        let diffRes = diff(this._moduleOutputData, moduleOutputData);
        if (!diffRes) {
          return this._moduleOutputData;
        }
        this._moduleOutputData = moduleOutputData;
        return moduleOutputData;
      })
      .catch(err => {
        this._fetchModuleOutputDataPromise = undefined;
        logger.error(err);
      }));
  }
  setModule(module) {
    this._module = module;
    return this;
  }
  setModuleInputData(moduleInputData) {
    this._moduleInputData = moduleInputData;
    return this;
  }
  setModuleOutputData(moduleOutputData) {
    this._moduleOutputData = moduleOutputData;
    return this;
  }
  setResponse(response) {
    this._response = response;
    return this;
  }
  setQuery(query) {
    this._query = query;
    return this;
  }
  setModuleInfo(moduleInfo) {
    if(!moduleInfo){
      moduleInfo = dataTypeFactory.get(dataTypes.MODULE_INFO).create({
        id: this._module._id,
        name: this._module.name||'',
        type: this._module.type
      })
    }
    this._moduleInfo = moduleInfo;
    return this;
  }
  getChain() {
    return this._chain;
  }
  setChain(chain) {
    this._chain = chain;
    return this;
  }
  _hasNode(type, node) {
    let nodes = type === 'in' ? this._in : this._out;
    return !!nodes.find(n => n === node);
  }
  hasInNode(node) {
    return this._hasNode('in', node);
  }
  hasOutNode(node) {
    return this._hasNode('out', node);
  }
  chainTo(node) {
    if (!this.hasOutNode(node)) {
      this._out.push(node);
    }
    node._in.push(this);
    return this;
  }
  chainedFrom(node) {
    if (!this.hasInNode(node)) {
      this._in.push(node);
    }
    node._out.push(this);
    return this;
  }
  unchainTo(node) {
    if (this.hasOutNode(node)) {
      this._out.splice(this._out.indexOf(node), 1);
    }
    node.unchainFrom(this);
    return this;
  }
  unchainFrom(node) {
    if (this.hasInNode(node)) {
      this._in.splice(this._in.indexOf(node), 1);
    }
    node.unchainTo(this);
    return this;
  }
  copy() {
    // TODO
  }
  _createData(type, datalist) {
    let dtFactory = dataTypeFactory.get(type);
    // 优先匹配 dataType 相同的
    let data = datalist.find(row => row.dataType === type);
    if (data) {
      return data;
    }

    // 如果没有 dataType 相同的，则尝试从其他类型的 dataType 进行转换
    datalist.some(row => {
      data = dtFactory.create(row);
      if (data.data === false) {
        return false;
      }
      return true;
    });

    if (!data) {
      return dataTypeFactory.createEmpty(type);
    }
    return data;
  }
  createModuleInputData(type, data) {
    let dtFactory = dataTypeFactory.get(type);
    return dtFactory.create(data);
  }
  createModuleOutputData(type) {
    return this._createData(type, this._response.concat(this._moduleInputData).concat(this._moduleInfo));
  }
  createQueryData(type) {
    return this._createData(type, this._moduleInputData);
  }
  createResponseData(type, data) {
    let dtFactory = dataTypeFactory.get(type);
    return dtFactory.create(data);
  }
}

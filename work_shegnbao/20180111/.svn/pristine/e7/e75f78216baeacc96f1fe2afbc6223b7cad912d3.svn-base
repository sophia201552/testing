const engine = require('@beopcloud/StrategyV2-Engine/dist/StrategyV2-Engine');
const nodes = engine.nodes;
const moduleConfig = engine.moduleConfig;
const dataTypeFactory = engine.dataTypeFactory;
const PREFIX = 'sv2:';
const tasks = new Map();

tasks.set(PREFIX + 'get_query', function(data) {
  let m = data.module;
  let moduleType = m.type;
  let Clazz = nodes[m.type];
  let node = new Clazz(m);
  node.setModuleInputData(data.moduleInputData);
  let dataTypes = moduleConfig[moduleType]['query'];
  let result = dataTypes.map(function(dt) {
    return node.createQueryData(dt);
  });
  return result;
});

/** 获取模块的 input */
tasks.set(PREFIX + 'get_input', function(srcDataList, distData) {
  let distModule = distData.module;
  let disModuleType = distModule.type;
  let Clazz = nodes[distModule.type];
  let distNode = new Clazz(distModule);

  let params = srcDataList.map(function(srcData) {
    return srcData.moduleOutputData;
  });
  let supportDataTypes = moduleConfig[disModuleType];

  let moduleInputData = [];
  supportDataTypes.inputs.forEach(type => {
    let rs = params.some(p => {
      return p.some(arg => {
        let rs = distNode.createModuleInputData(type, arg);
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

  return moduleInputData;
});

/** 获取模块的 output */
tasks.set(PREFIX + 'get_output', function(data) {
  let m = data.module;
  let moduleType = m.type;

  let Clazz = nodes[m.type];
  let node = new Clazz(m);
  node.setModuleInputData(data.moduleInputData);
  node.setResponse(data.response);
  let dataTypes = moduleConfig[moduleType]['outputs'];
  let result = dataTypes.map(function(dt) {
    return node.createModuleOutputData(dt);
  });
  return result;
});

module.exports = tasks;

import logger from '@beopcloud/logger';
import Engine from './src/analysis';
import nodes from './src/nodes';
import moduleConfig from './src/moduleConfig';
import dataTypeFactory from './src/dataTypes';

if (typeof window === "object") {
  window.logger = logger;
} else if (typeof global === "object") {
  global.logger = logger;
}

export default Engine;
export { nodes, moduleConfig, dataTypeFactory };
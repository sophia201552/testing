import { moduleTypes as mt, dataTypes as dt } from './enum';

/**
 * 一些原则
 * 1、response 和 inputs 中不要有重复类型的数据。
 * 如果实在需要重复，则需要在子类的 node 类中重写 createModuleOutputData 方法
 * 2、createModuleInputData 和 createResponseData 方法一般情况下不需要在 子类 中重写。
 * 如果需要重写，你要清楚你在干什么
 * 3、两个 dataType 不一样的数据单元，有可能可以互相转换
 */

export default {
  [mt.CON_DATASOURCE]: {
    inputs: [],
    outputs: [dt.DS_OPT, dt.DS_HIS_OUTPUT, dt.MODULE_INFO],
    query: [dt.DS_OPT, dt.DS_HIS_QUERY],
    response: [dt.DS_OPT, dt.DS_HIS_OUTPUT]
  },
  [mt.PRE_DATA_DEDUPLICATION]: {
    inputs: [dt.DS_HIS_OUTPUT],
    outputs: [dt.DS_HIS_OUTPUT],
    query: [dt.ANLS_DEDUPLICATION_OPT],
    response: [dt.ANLS_DEDUPLICATION_OUTPUT]
  },
  [mt.PRE_DATA_COMPLEMENT]: {
    inputs: [dt.DS_HIS_OUTPUT],
    outputs: [dt.DS_HIS_OUTPUT],
    query: [dt.ANLS_DATA_COMPLEMENT_OPT],
    response: [dt.ANLS_DATA_COMPLEMENT_OUTPUT]
  },
  [mt.PDT_SVM]: {
    inputs: [dt.DS_HIS_OUTPUT],
    outputs: [dt.DS_HIS_OUTPUT, dt.ANLS_SVM_OUTPUT],
    query: [dt.ANLS_SVM_OPT],
    response: [dt.ANLS_SVM_OUTPUT]
  },
  [mt.EXEC_ANLS_PREDICTION]: {
    inputs: [dt.DS_OPT, dt.ANLS_SVM_OUTPUT],
    outputs: [dt.DS_OPT, dt.ANLS_PREDICT_OUTPUT],
    query: [dt.DS_OPT, dt.ANLS_PREDICT_OPT],
    response: [dt.ANLS_PREDICT_OUTPUT]
  },
  [mt.EXEC_PYTHON]: {
    inputs: [],
    outputs: [dt.PYTHON_OUTPUT, dt.DS_HIS_OUTPUT],
    query: [dt.PYTHON_OPT],
    response: [dt.PYTHON_OUTPUT]
  },
  [mt.PRE_TRANS_FUZZY]: {
    inputs: [dt.DS_OPT],
    outputs: [dt.DN_INPUT_OPT],
    query: [],
    response: []
  },
  [mt.OP_DIAGNOSIS_ITEM]: {
    inputs: [dt.DN_INPUT_OPT],
    outputs: [dt.DN_OUTPUT_OPT],
    query: [],
    response: []
  },
  [mt.FUNC_LOGIC_BOOLEAN]: {
    inputs: [dt.DN_INPUT_OPT, dt.DN_OUTPUT_OPT],
    outputs: [dt.DN_INPUT_OPT, dt.DN_OUTPUT_OPT, dt.DN_ANLS_OPT],
    query: [],
    response: []
  },
  [mt.EXEC_TEST]: {
    inputs: [dt.DS_OPT, dt.DN_INPUT_OPT, dt.DN_OUTPUT_OPT, dt.DN_ANLS_OPT],
    outputs: [dt.DN_TEST_SCORE_OUTPUT],
    query: [
      dt.DS_OPT,
      dt.DN_INPUT_OPT,
      dt.DN_OUTPUT_OPT,
      dt.DN_ANLS_OPT,
      dt.DN_TEST_SCORE_OPT
    ],
    response: [dt.DN_TEST_SCORE_OUTPUT]
  },
  [mt.EXEC_OUTLIER_DETECTION]: {
    inputs: [dt.DS_HIS_OUTPUT],
    outputs: [dt.DS_HIS_OUTPUT],
    query: [dt.ANLS_OUTLIER_DETECTING_OPT],
    response: [dt.ANLS_OUTLIER_DETECTING_OUTPUT]
  },
  [mt.CLT_DB_SCAN]: {
    inputs: [dt.DS_HIS_OUTPUT],
    outputs: [dt.DS_HIS_OUTPUT],
    query: [dt.ANLS_CLUSTERING_OPT],
    response: [dt.ANLS_CLUSTERING_OUTPUT]
  },
  [mt.CON_FILE_EXCEL]: {
    inputs: [],
    outputs: [dt.DS_HIS_OUTPUT],
    query: [],
    response: []
  },
  [mt.PCA]: {
    inputs: [dt.DS_HIS_OUTPUT],
    outputs: [dt.DS_HIS_OUTPUT],
    query: [dt.ANLS_PCA_OPT],
    response: [dt.ANLS_PCA_OUTPUT]
  },
  [mt.FEATURE_SELECTION]: {
    inputs: [dt.DS_HIS_OUTPUT],
    outputs: [dt.DS_HIS_OUTPUT],
    query: [dt.ANLS_FEATURE_SELECTION_OPT],
    response: [dt.ANLS_FEATURE_SELECTION_OUTPUT]
  },
  [mt.PRE_DATA_SORTING]: {
    inputs: [dt.DS_OPT, dt.DS_HIS_OUTPUT, dt.MODULE_INFO],
    outputs: [dt.DS_OPT, dt.DS_HIS_OUTPUT],
    query: [],
    response: []
  },
  [mt.PRE_DATA_EXPORT]: {
    inputs: [dt.DS_OPT, dt.DS_HIS_OUTPUT, dt.MODULE_INFO],
    outputs: [dt.DS_OPT, dt.DS_HIS_OUTPUT],
    query: [],
    response: []
  },
  [mt.PRE_DATA_NORMALIZATION]: {
    inputs: [dt.DS_HIS_OUTPUT],
    outputs: [dt.DS_HIS_OUTPUT],
    query: [dt.ANLS_DATA_NORMALIZATION_OPT],
    response: [dt.ANLS_DATA_NORMALIZATION_OUTPUT]
  },
  [mt.PRE_DATA_MONITORING]: {
    inputs: [],
    outputs: [],
    query: [],
    response: []
  },
  [mt.PRE_DATA_EVALUATE]: {
    inputs: [dt.DS_OPT, dt.ANLS_SVM_OUTPUT],
    outputs: [],
    query: [dt.ANLS_EVALUATE_OPT, dt.DS_OPT],
    response: [dt.ANLS_EVALUATE_OUTPUT]
  },
  [mt.VSL_CHART]: {
    inputs: [dt.DS_HIS_OUTPUT],
    outputs: [],
    query: [],
    response: []
  }
};

// 模块类型
export const moduleTypes = {
  // ====== 数据接入类 1xx CON ======
  // 数据源
  CON_DATASOURCE: 101,
  // EXCEL文件
  CON_FILE_EXCEL: 102,

  // ====== 数据处理类 2xx PRE ======
  // 模糊规则
  PRE_TRANS_FUZZY: 201,
  // 数据去重
  PRE_DATA_DEDUPLICATION: 202,
  // 数据补齐
  PRE_DATA_COMPLEMENT: 203,
  // 离群点检测
  EXEC_OUTLIER_DETECTION: 204,
  // 数据归一化
  PRE_DATA_NORMALIZATION: 205,
  // 数据监测
  PRE_DATA_MONITORING: 206,
  // PCA
  PCA: 207,
  // featureSelection
  FEATURE_SELECTION: 208,
  //数据整理
  PRE_DATA_SORTING: 209,
  //数据导出
  PRE_DATA_EXPORT: 210,
  // 公式点

  // ====== 方法类 3xx FUNC ======
  // 逻辑分析
  FUNC_LOGIC_BOOLEAN: 301,
  // SVM 深度学习
  SVM: 302,
  // 线性回归

  // ====== 可视化类 4xx VSL======
  // 散点图
  SCATTER: 401,
  VSL_CHART: 402,

  // ====== 输出类 5xx OP ======
  // 诊断项
  OP_DIAGNOSIS_ITEM: 501,
  // 数据源
  OP_DATASOURCE: 502,

  // ====== 功能类 6xx EXEC ======
  // PYTHON 代码
  EXEC_PYTHON: 601,
  // 测试&评估
  EXEC_TEST: 602,
  // 相关性分析
  EXEC_ANLS_CORRELATION: 603,
  // 预测
  EXEC_ANLS_PREDICTION: 604,
  //评价模块
  PRE_DATA_EVALUATE: 605,

  // ====== 预测系列 7xx PDT ======
  // SVM
  PDT_SVM: 701,

  // ====== 聚类系列 8xx CLT ======
  // DB Scan
  CLT_DB_SCAN: 801
};

export const dataTypes = {
  MODULE_INFO: 'MODULE_INFO',
  DS_OPT: 'DS_OPT',
  DS_HIS_QUERY: 'DS_HIS_QUERY',
  DS_RT_QUERY: 'DS_RT_QUERY',
  DS_HIS_OUTPUT: 'DS_HIS_OUTPUT',
  DS_RT_OUTPUT: 'DS_RT_OUTPUT',
  DN_INPUT_OPT: 'DN_INPUT_OPT',
  DN_OUTPUT_OPT: 'DN_OUTPUT_OPT',
  DN_ANLS_OUTPUT: 'DN_ANLS_OUTPUT',
  DN_TEST_SCORE_OPT: 'DN_TEST_SCORE_OPT',
  DN_TEST_SCORE_OUTPUT: 'DN_TEST_SCORE_OUTPUT',
  DN_RES_SAVE_OUTPUT: 'DN_RES_SAVE_OUTPUT',
  DN_ANLS_OPT: 'DN_ANLS_OPT',
  ANLS_DEDUPLICATION_OPT: 'ANLS_DEDUPLICATION_OPT',
  ANLS_DEDUPLICATION_OUTPUT: 'ANLS_DEDUPLICATION_OUTPUT',
  ANLS_DATA_COMPLEMENT_OPT: 'ANLS_DATA_COMPLEMENT_OPT',
  ANLS_DATA_COMPLEMENT_OUTPUT: 'ANLS_DATA_COMPLEMENT_OUTPUT',
  ANLS_OUTLIER_DETECTING_OPT: 'ANLS_OUTLIER_DETECTING_OPT',
  ANLS_OUTLIER_DETECTING_OUTPUT: 'ANLS_OUTLIER_DETECTING_OUTPUT',
  ANLS_DATA_NORMALIZATION_OPT: 'ANLS_DATA_NORMALIZATION_OPT',
  ANLS_DATA_NORMALIZATION_OUTPUT: 'ANLS_DATA_NORMALIZATION_OUTPUT',
  ANLS_SVM_OPT: 'ANLS_SVM_OPT',
  ANLS_SVM_OUTPUT: 'ANLS_SVM_OUTPUT',
  ANLS_PREDICT_OPT: 'ANLS_PREDICT_OPT',
  ANLS_PREDICT_OUTPUT: 'ANLS_PREDICT_OUTPUT',
  ANLS_CLUSTERING_OPT: 'ANLS_CLUSTERING_OPT',
  ANLS_CLUSTERING_OUTPUT: 'ANLS_CLUSTERING_OUTPUT',
  PYTHON_OPT: 'PYTHON_OPT',
  PYTHON_OUTPUT: 'PYTHON_OUTPUT',
  ANLS_FEATURE_SELECTION_OPT: 'ANLS_FEATURE_SELECTION_OPT',
  ANLS_FEATURE_SELECTION_OUTPUT: 'ANLS_FEATURE_SELECTION_OUTPUT',
  ANLS_PCA_OPT: 'ANLS_PCA_OPT',
  ANLS_PCA_OUTPUT: 'ANLS_PCA_OUTPUT',
  ANLS_EVALUATE_OPT: 'ANLS_EVALUATE_OPT',
  ANLS_EVALUATE_OUTPUT: 'ANLS_EVALUATE_OUTPUT'
};

// 模块类型对应中文
export const moduleTypeNames = Object.defineProperties(
  {},
  {
    [moduleTypes.CON_DATASOURCE]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '数据源' : 'DataSource';
      }
    },
    [moduleTypes.PRE_TRANS_FUZZY]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '模糊集合' : 'Fuzzy Set';
      }
    },
    [moduleTypes.PRE_DATA_DEDUPLICATION]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '数据去重' : 'Data Deduplication';
      }
    },
    [moduleTypes.PRE_DATA_COMPLEMENT]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '数据补齐' : 'Data Complement';
      }
    },
    [moduleTypes.PRE_DATA_NORMALIZATION]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '数据归一化' : 'Data Normalization';
      }
    },
    [moduleTypes.PRE_DATA_MONITORING]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '数据诊断' : 'Data Monitoring';
      }
    },
    [moduleTypes.PRE_DATA_EVALUATE]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '评价' : 'Evaluate';
      }
    },
    [moduleTypes.PCA]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? 'PCA' : 'PCA';
      }
    },
    [moduleTypes.FEATURE_SELECTION]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '特征选取' : 'Feature Selection';
      }
    },
    [moduleTypes.PRE_DATA_SORTING]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '数据整理' : 'Data Sorting';
      }
    },
    [moduleTypes.PRE_DATA_EXPORT]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '数据导出' : 'Data Export';
      }
    },
    [moduleTypes.CLT_DB_SCAN]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '聚类' : 'Clustering';
      }
    },
    [moduleTypes.EXEC_OUTLIER_DETECTION]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '离群点' : 'Outliers';
      }
    },
    [moduleTypes.FUNC_LOGIC_BOOLEAN]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '逻辑分析' : 'Logic Analysis';
      }
    },
    [moduleTypes.OP_DIAGNOSIS_ITEM]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '诊断项' : 'Diagnosis Items';
      }
    },
    [moduleTypes.OP_DATASOURCE]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '数据源' : 'DataSource';
      }
    },
    [moduleTypes.EXEC_PYTHON]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? 'Python' : 'Python';
      }
    },
    [moduleTypes.EXEC_TEST]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '测试&评估' : 'Test&Evaluate';
      }
    },
    [moduleTypes.EXEC_ANLS_CORRELATION]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh'
          ? '相关性分析'
          : 'Correlation Analysis';
      }
    },
    [moduleTypes.EXEC_ANLS_PREDICTION]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '预测' : 'Prediction';
      }
    },
    [moduleTypes.CON_FILE_EXCEL]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '文件导入' : 'Import File';
      }
    },
    [moduleTypes.DEEP_STUDY]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '深度学习' : 'Deep Study';
      }
    },
    [moduleTypes.SVM]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? 'SVM' : 'SVM';
      }
    },
    [moduleTypes.SCATTER]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '散点图' : 'Scatter Plot';
      }
    },
    [moduleTypes.PDT_SVM]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? 'SVR' : 'SVR';
      }
    },
    [moduleTypes.VSL_CHART]: {
      enumerable: true,
      get() {
        return I18n && I18n.type === 'zh' ? '图表' : 'Chart';
      }
    }
  }
);

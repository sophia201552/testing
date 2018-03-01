import DataSourceChainNode from './datasource';
import AnalysisCorrelationChainNode from './analysisCorrelation';
import PredictionChainNode from './prediction';
import SVMChainNode from './svm';
import PythonChainNode from './python';
import FuzzyChainNode from './fuzzy';
import DiagnosisChainNode from './diagnosis';
import LogicChainNode from './logic';
import ExecTestChainNode from './execTest';
import DataDeduplicationChainNode from './dataDeduplication';
import DataComplementChainNode from './dataComplement';
import OutlierDetectionChainNode from './outlierDetection';
import ClusteringChainNode from './clustering';
import FileExcelChainNode from './fileExcel';
import FeatureSelectionChainNode from './featureSelection';
import PcaChainNode from './pca';
import NormalizationChainNode from './normalization';
import DataEvaluateChainNode from './dataEvaluate';
import DataMonitoringChainNode from './dataMonitoring';
import EvaluateChainNode from './evaluate';
import DataSortingChainNode from './dataSorting';
import DataExportChainNode from './dataExport';
import Chart from './chart';

import { moduleTypes } from '../enum';

export default {
  [moduleTypes.CON_DATASOURCE]: DataSourceChainNode,
  [moduleTypes.EXEC_ANLS_CORRELATION]: AnalysisCorrelationChainNode,
  [moduleTypes.EXEC_ANLS_PREDICTION]: PredictionChainNode,
  [moduleTypes.PDT_SVM]: SVMChainNode,
  [moduleTypes.EXEC_PYTHON]: PythonChainNode,
  [moduleTypes.PRE_TRANS_FUZZY]: FuzzyChainNode,
  [moduleTypes.OP_DIAGNOSIS_ITEM]: DiagnosisChainNode,
  [moduleTypes.FUNC_LOGIC_BOOLEAN]: LogicChainNode,
  [moduleTypes.EXEC_TEST]: ExecTestChainNode,
  [moduleTypes.PRE_DATA_DEDUPLICATION]: DataDeduplicationChainNode,
  [moduleTypes.PRE_DATA_COMPLEMENT]: DataComplementChainNode,
  [moduleTypes.EXEC_OUTLIER_DETECTION]: OutlierDetectionChainNode,
  [moduleTypes.CLT_DB_SCAN]: ClusteringChainNode,
  [moduleTypes.CON_FILE_EXCEL]: FileExcelChainNode,
  [moduleTypes.FEATURE_SELECTION]: FeatureSelectionChainNode,
  [moduleTypes.PCA]: PcaChainNode,
  [moduleTypes.PRE_DATA_NORMALIZATION]: NormalizationChainNode,
  [moduleTypes.PRE_DATA_EVALUATE]: DataEvaluateChainNode,
  [moduleTypes.PRE_DATA_MONITORING]: DataMonitoringChainNode,
  [moduleTypes.PRE_DATA_EVALUATE]: EvaluateChainNode,
  [moduleTypes.VSL_CHART]: Chart,
  [moduleTypes.PRE_DATA_SORTING]: DataSortingChainNode,
  [moduleTypes.PRE_DATA_EXPORT]: DataExportChainNode
};

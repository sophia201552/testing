import I from 'seamless-immutable';
import { dataTypes } from '../enum';

import dsOpt from './dsOpt';
import dsHisOutput from './dsHisOutput';
import dsHisQuery from './dsHisQuery';
import dsRtQuery from './dsRtQuery';
import dsRtOutput from './dsRtOutput';
import anlsSvmOpt from './anlsSvmOpt';
import anlsSvmOutput from './anlsSvmOutput';
import anlsPredictOpt from './anlsPredictOpt';
import anlsPredictOutput from './anlsPredictOutput';
import pythonOpt from './pythonOpt';
import pythonOutput from './pythonOutput';
import dnInputOpt from './dnInputOpt';
import dnOutputOpt from './dnOutputOpt';
import dnAnlsOpt from './dnAnlsOpt';
import dnTestScoreOpt from './dnTestScoreOpt';
import dnTestScoreOutput from './dnTestScoreOutput';
import anlsDeduplicationOpt from './anlsDeduplicationOpt';
import anlsDeduplicationOutput from './anlsDeduplicationOutput';
import anlsDataComplementOpt from './anlsDataComplementOpt';
import anlsDataComplementOutput from './anlsDataComplementOutput';
import anlsOutlierDetectingOpt from './anlsOutlierDetectingOpt';
import anlsOutlierDetectingOutput from './anlsOutlierDetectingOutput';
import anlsClusteringOpt from './anlsClusteringOpt';
import anlsClusteringOutput from './anlsClusteringOutput';
import anlsFeatureSelectionOpt from './anlsFeatureSelectionOpt';
import anlsFeatureSelectionOutput from './anlsFeatureSelectionOutput';
import anlsPcaOpt from './anlsPcaOpt';
import anlsPcaOutput from './anlsPcaOutput';
import anlsDataNormalizationOpt from './anlsDataNormalizationOpt';
import anlsDataNormalizationOutput from './anlsDataNormalizationOutput';
import anlsEvaluateOpt from './anlsEvaluateOpt';
import anlsEvaluateOutput from './anlsEvaluateOutput';
import moduleInfo from './moduleInfo';

const map = {
  [dataTypes.DS_OPT]: dsOpt,
  [dataTypes.DS_HIS_OUTPUT]: dsHisOutput,
  [dataTypes.DS_HIS_QUERY]: dsHisQuery,
  [dataTypes.DS_RT_QUERY]: dsRtQuery,
  [dataTypes.DS_RT_OUTPUT]: dsRtOutput,
  [dataTypes.ANLS_SVM_OPT]: anlsSvmOpt,
  [dataTypes.ANLS_SVM_OUTPUT]: anlsSvmOutput,
  [dataTypes.ANLS_PREDICT_OPT]: anlsPredictOpt,
  [dataTypes.ANLS_PREDICT_OUTPUT]: anlsPredictOutput,
  [dataTypes.PYTHON_OPT]: pythonOpt,
  [dataTypes.PYTHON_OUTPUT]: pythonOutput,
  [dataTypes.DN_INPUT_OPT]: dnInputOpt,
  [dataTypes.DN_OUTPUT_OPT]: dnOutputOpt,
  [dataTypes.DN_ANLS_OPT]: dnAnlsOpt,
  [dataTypes.DN_TEST_SCORE_OPT]: dnTestScoreOpt,
  [dataTypes.DN_TEST_SCORE_OUTPUT]: dnTestScoreOutput,
  [dataTypes.ANLS_DEDUPLICATION_OPT]: anlsDeduplicationOpt,
  [dataTypes.ANLS_DEDUPLICATION_OUTPUT]: anlsDeduplicationOutput,
  [dataTypes.ANLS_DATA_COMPLEMENT_OPT]: anlsDataComplementOpt,
  [dataTypes.ANLS_DATA_COMPLEMENT_OUTPUT]: anlsDataComplementOutput,
  [dataTypes.ANLS_OUTLIER_DETECTING_OPT]: anlsOutlierDetectingOpt,
  [dataTypes.ANLS_OUTLIER_DETECTING_OUTPUT]: anlsOutlierDetectingOutput,
  [dataTypes.ANLS_CLUSTERING_OPT]: anlsClusteringOpt,
  [dataTypes.ANLS_CLUSTERING_OUTPUT]: anlsClusteringOutput,
  [dataTypes.ANLS_FEATURE_SELECTION_OPT]: anlsFeatureSelectionOpt,
  [dataTypes.ANLS_FEATURE_SELECTION_OUTPUT]: anlsFeatureSelectionOutput,
  [dataTypes.ANLS_PCA_OPT]: anlsPcaOpt,
  [dataTypes.ANLS_PCA_OUTPUT]: anlsPcaOutput,
  [dataTypes.ANLS_DATA_NORMALIZATION_OPT]: anlsDataNormalizationOpt,
  [dataTypes.ANLS_DATA_NORMALIZATION_OUTPUT]: anlsDataNormalizationOutput,
  [dataTypes.ANLS_EVALUATE_OPT]: anlsEvaluateOpt,
  [dataTypes.ANLS_EVALUATE_OUTPUT]: anlsEvaluateOutput,
  [dataTypes.MODULE_INFO]: moduleInfo
};

export default {
  map,
  get: function(type) {
    let dtFactory = map[type];
    if (!dtFactory) {
      throw new Error(`未找到 ${type} 类型的构造方法.`);
    }
    return dtFactory;
  },
  createEmpty: function(type) {
    return I({
      dataType: type,
      data: false
    });
  }
};

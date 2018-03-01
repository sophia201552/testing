"""
js/css bundle
"""

from beopWeb import app
from beopWeb.bundle import assets, filter_with_babel
from flask_assets import Bundle

# diagnosis thirdparty lib bundled js
assets.register('diagnosis_thirdparty_lib_js_bundle', Bundle(
    # third-party library
    "scripts/lib/jquery-2.1.4.min.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/moment/moment.min.js",
    "scripts/lib/daterangepicker/daterangepicker.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/echart/echarts-new.js",
    "scripts/lib/echart/echarts-gl.min.js",
    "scripts/lib/dom-to-image/dom-to-image.min.js",
    output='gen/diagnosis_thirdparty_lib_js_bundle.js'))

# diagnosis beop lib bundled js
assets.register('diagnosis_beop_lib_js_bundle', Bundle(
    # beop library
    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/lib/spin.js",
    "views/theme/dark.js",
    # login validate
    "scripts/loginValidate.js",
    'app/WebFactory/scripts/core/core.js',
    # data table 
    'app/Diagnosis/themes/dataTable/pagingTable.js',
    'scripts/workflow2.0/jquery.twbsPagination.min.js',

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/diagnosis_beop_lib_js_bundle.js'))

# diagnosis bundled js
assets.register('diagnosis_js_bundle', Bundle(
    'app/Diagnosis/scripts/comm/comm.js',
    'app/Diagnosis/scripts/comm/enum.js',

    # work order
    "scripts/core/pyFormat.js",
    "scripts/workflow2.0/wf.constants.js",
    "scripts/workflow2.0/wf.apiMap.js",
    "scripts/workflow2.0/wf.util.js",
    "scripts/workflow2.0/wf.data.js",
    "scripts/workflow2.0/wf.model.js",
    "scripts/workflow2.0/wf.fileUpload.js",
    "scripts/workflow2.0/wf.view.faultCurve.js",
    "scripts/workflow2.0/wf.view.memberSelected.js",
    "scripts/workflow2.0/workflowInsert.js",

    # mixins
    'app/Diagnosis/scripts/mixins/capture.js',

    'app/Diagnosis/scripts/components/nav/timePicker.js',
    'app/Diagnosis/scripts/components/nav/category.js',
    'app/Diagnosis/scripts/components/nav/fault.js',
    'app/Diagnosis/scripts/components/nav/structure.js',
    'app/Diagnosis/scripts/components/nav/consequence.js',
    'app/Diagnosis/scripts/components/nav/nav.js',
    'app/Diagnosis/scripts/components/nav/modalNav.js',

    'app/Diagnosis/scripts/components/feedBackModal/history.js',
    'app/Diagnosis/scripts/components/feedBackModal/workOrderOverView.js',
    'app/Diagnosis/scripts/components/feedBackModal/workOrderHistory.js',
    'app/Diagnosis/scripts/components/feedBackModal/workOrderSpectrum.js',
    'app/Diagnosis/scripts/components/feedBackModal/feedBackModal.js',

    'app/Diagnosis/scripts/components/faultDetailPanel/faultDetailPanel.js',

    'app/Diagnosis/scripts/components/faultModal/faultTable/faultTable.js',
    'app/Diagnosis/scripts/components/faultModal/faultModal.js',

    'app/Diagnosis/scripts/pages/Overview/components/base.js',
    'app/Diagnosis/scripts/pages/Overview/components/equipmentHealth.js',
    'app/Diagnosis/scripts/pages/Overview/components/consequenceFaults.js',
    'app/Diagnosis/scripts/pages/Overview/components/proportionPie.js',
    'app/Diagnosis/scripts/pages/Overview/components/proportionPieWithBar.js',
    'app/Diagnosis/scripts/pages/Overview/components/proportionPieWithLine.js',
    'app/Diagnosis/scripts/pages/Overview/components/chart3D.js',
    'app/Diagnosis/scripts/pages/Overview/components/summary.js',
    'app/Diagnosis/scripts/pages/Overview/components/table.js',

    'app/Diagnosis/scripts/pages/History/components/faultTable/faultTable.js',
    'app/Diagnosis/scripts/pages/History/history.js',
    'app/Diagnosis/scripts/pages/Spectrum/components/faultTable/faultTable.js',
    'app/Diagnosis/scripts/pages/Spectrum/spectrum.js',
    'app/Diagnosis/scripts/pages/Roi/components/faultTable/faultTable.js',
    'app/Diagnosis/scripts/pages/Roi/Roi.js',
    'app/Diagnosis/scripts/pages/Overview/overview.js',

    'app/Diagnosis/scripts/diagnosis.js',
    output='gen/diagnosis_js_bundle.js'))

# diagnosis bundled css
assets.register('diagnosis_css_bundle', Bundle(
    # third-party library
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'scripts/lib/daterangepicker/css/daterangepicker.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',
    'fonts/beopIconFont/iconfont.css',

    # our web styles
    'app/Diagnosis/themes/default/css/main.css',
    'app/Diagnosis/themes/dataTable/dataTable.css',
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/diagnosis_css_bundle.css'))

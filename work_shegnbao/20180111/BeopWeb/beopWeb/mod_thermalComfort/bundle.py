"""
js/css bundle
"""

from beopWeb import app
from beopWeb.bundle import assets, filter_with_babel
from flask_assets import Bundle

# thermalcomort thirdparty lib bundled js
assets.register('thermalComfort_lib_js_bundle', Bundle(
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
    output='gen/thermalComfort_lib_js_bundle.js'))

# thermalcomort beop lib bundled js
assets.register('thermalComfort_beop_lib_js_bundle', Bundle(
    # beop library
    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/lib/spin/spin.js",
    "views/theme/dark.js",
    # login validate
    "scripts/loginValidate.js",
    'app/WebFactory/scripts/core/core.js',

    filters=filter_with_babel,
    output='gen/thermalComfort_beop_lib_js_bundle.js'))

# thermalcomort bundled js
assets.register('thermalComfort_js_bundle', Bundle(
    'app/ThermalComfort/scripts/nav/tagTree.js',
    'app/ThermalComfort/scripts/nav/timePicker.js',
    'app/ThermalComfort/scripts/nav/nav.js',
    'app/ThermalComfort/scripts/pages/temperatureHumidityTrendChart/temperatureHumidityTrendChart.js',
    'app/ThermalComfort/scripts/pages/associatedFault/faultDetailPanel.js',
    'app/ThermalComfort/scripts/pages/associatedFault/associatedFault.js',
    'app/ThermalComfort/scripts/pages/monthlyTrend/monthlyTrend.js',
    'app/ThermalComfort/scripts/pages/plan/plan.js',

    'app/ThermalComfort/scripts/thermalComfort.js',

    filters=filter_with_babel,
    output='gen/thermalComfort_js_bundle.js'))

# thermalcomort bundled css
assets.register('thermalComfort_css_bundle', Bundle(
    # third-party library
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'scripts/lib/daterangepicker/css/daterangepicker.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',
    'fonts/beopIconFont/iconfont.css',

    # our web styles
    'app/ThermalComfort/themes/default/css/main.css',
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/thermalComfort_css_bundle.css'))

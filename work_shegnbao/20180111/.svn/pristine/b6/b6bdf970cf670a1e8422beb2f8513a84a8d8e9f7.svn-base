import sys
import subprocess
from beopWeb import app, bNeedPacking
from flask_assets import Environment, Bundle
from webassets.filter import get_filter

from beopWeb.pack import build

es2015 = get_filter('babel', extra_args=['-f', 'tmp.js'])

assets = Environment(app)
assets.debug = app.config.get('ASSETS_DEBUG')
assets.manifest = False
assets.cache = False
assets.auto_build = False
# assets.init_app(app)

filter_with_babel = ()
if bNeedPacking:
    if assets.debug:
        print('babel 工具状态：未开启')
        filter_with_babel = app.config['ASSETS_JS_FILTER']
    else:
        print('babel 工具状态：开启')
        filter_with_babel = es2015

# import external bundles
import beopWeb.factory_bundle
from beopWeb.mod_strategy import strategy_bundle
from beopWeb.mod_diagnosis import bundle
from beopWeb.mod_thermalComfort import bundle

# # IE polyfill
assets.register('polyfill_js_bundle', Bundle(
    "scripts/lib/polyfill/polyfill.js",
    "scripts/lib/polyfill/es6-promise.auto.min.js",

    output='gen/polyfill_js_bundle.js'))

# 第三方库
assets.register('lib_js_bundle', Bundle(
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/echart/echarts-3.8.4-ex.min.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "scripts/lib/moment/moment.min.js",
    "scripts/lib/moment/moment-timezone-with-data-2012-2022.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",

    output='gen/lib_js_bundle.js'))

assets.register('lib_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/lib_css_bundle.js'))

# --移动端
assets.register('lib_mobile_js_bundle', Bundle(
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/echart/echarts-3.8.4-ex.min.js",
    "scripts/lib/moment/moment.min.js",
    "scripts/lib/moment/moment-timezone-with-data-2012-2022.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",

    output='gen/lib_mobile_js_bundle.js'))

assets.register('lib_mobile_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/lib_mobile_css_bundle.js'))



# 公用控件
assets.register('common_js_bundle', Bundle(
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/i18n/i18n.js",
    "scripts/core/permission.js",
    "scripts/core/eventAdapter.js",
    "scripts/lib/spin/spin.js",

    "views/theme/burgeen.js",
    "views/theme/dark.js",

    filters=filter_with_babel,
    output='gen/common_js_bundle.js'))

assets.register('common_css_bundle', Bundle(
    'scripts/lib/beopNotification/infoBox.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/common_css_bundle.js'))

# --移动端
assets.register('common_mobile_js_bundle', Bundle(
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/i18n/i18n.js",
    "scripts/core/permission.js",
    "scripts/core/eventAdapter.js",
    "scripts/lib/spin/spin.js",
    "scripts/lib/zepto/zepto.js",
    "scripts/lib/zepto/event.js",
    "scripts/lib/zepto/touch.js",

    # mobile core
    # "app/MobileCommon/scripts/mobileApi.js",
    "app/MobileCommon/scripts/updateHelper.js",
    "app/MobileCommon/scripts/mobileCommon.js",
    "app/MobileCommon/scripts/router.js",

    "views/theme/mobile.js",

    filters=filter_with_babel,
    output='gen/common_mobile_js_bundle.js'))

assets.register('common_mobile_css_bundle', Bundle(
    "content/index.css",
    'content/widget.css',
    'scripts/lib/beopNotification/infoBox.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/common_mobile_css_bundle.js'))

# Dashboard控件
# TODO

# Report控件
# TODO

# Analysis控件
# TODO
assets.register('analysis_plugin_js_bundle', Bundle(
    "scripts/observer/analysisScreen.js",
    "scripts/observer/analysis/analysisModel.js",
    "scripts/observer/analysis/analysisTemplate.js",
    "scripts/observer/analysis/centerSliderPanel.js",
    "scripts/observer/analysis/leftSliderPanel.js",
    "scripts/observer/analysis/workspacePanel.js",
    "scripts/observer/analysis/templatePanel.js",

    filters=filter_with_babel,
    output='gen/analysis_plugin_js_bundle.js'))

# 开能兼容控件
# TODO

# 新基点兼容控件
# TODO

# 登录模块
# TODO
assets.register('login_js_bundle', Bundle(

    filters=filter_with_babel,
    output='gen/login_js_bundle.js'))

# Observer模块
# TODO
assets.register('observer_js_bundle', Bundle(

    "scripts/admin/paneProjectSelector.js",
    "scripts/admin/skinSelector.js",
    "scripts/admin/versionHistory.js",
    "scripts/index.js",
    "scripts/admin/allMessages.js",
    "scripts/core/beopMap.js",
    "scripts/core/baseMap.js",
    "scripts/core/screenManager.js",

    "scripts/observer/widgets/operatingPane.js",
    "scripts/observer/widgets/operatingRecord.js",
    "scripts/observer/widgets/historyChart.js",
    "scripts/observer/widgets/alarmLogging.js",

    filters=filter_with_babel,
    output='gen/observer_js_bundle.js'))

# Platform模块
# TODO
assets.register('platform_js_bundle', Bundle(
    filters=filter_with_babel, 
    output='gen/platform_js_bundle.js'))

# 数据分析模块
# TODO
assets.register('analysis_js_bundle', Bundle(
    "scripts/observer/widgets/dataSource.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/spring/factoryIoC.js",

    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/cache/dsCache.js",
    "scripts/core/cache/imgCache.js",
    "scripts/core/cache/bufferCache.js",

    "scripts/observer/widgets/modalConfigurePane.js",

    assets['analysis_plugin_js_bundle'],

    filters=filter_with_babel,
    output='gen/analysis_js_bundle.js'))

# 工单模块
assets.register('workflow_js_bundle', Bundle(
    "scripts/workflow2.0/wf.view.memberSelected.js",
    "scripts/workflow2.0/workflowInsert.js",
    "scripts/workflow2.0/workflowRemind.js",
    "scripts/workflow2.0/wf.feedback.js",
    "scripts/workflow2.0/wf.apiMap.js",
    "scripts/workflow2.0/wf.data.js",
    "scripts/workflow2.0/wf.eventPubsub.js",
    "scripts/workflow2.0/wf.util.js",
    "scripts/workflow2.0/wf.constants.js",
    "scripts/workflow2.0/wf.model.js",
    "scripts/workflow2.0/wf.view.menu.js",
    "scripts/workflow2.0/wf.view.memberSelected.js",
    "scripts/workflow2.0/wf.view.teamStructure.js",
    "scripts/workflow2.0/wf.view.teamTagsCurd.js",
    "scripts/workflow2.0/wf.view.activities.js",
    "scripts/workflow2.0/wf.view.taskList.js",
    "scripts/workflow2.0/wf.view.groupShow.js",
    "scripts/workflow2.0/wf.view.groupAdd.js",
    "scripts/workflow2.0/wf.view.groupDelete.js",
    "scripts/workflow2.0/wf.view.faultCurve.js",
    "scripts/workflow2.0/wf.view.replyList.js",
    "scripts/workflow2.0/wf.view.progress.js",
    "scripts/workflow2.0/wf.view.groupEdit.js",
    "scripts/workflow2.0/wf.view.menu.groupList.js",
    "scripts/workflow2.0/wf.view.menu.labelList.js",
    "scripts/workflow2.0/wf.view.taskTeam.js",
    "scripts/workflow2.0/wf.view.teamProcess.js",
    "scripts/workflow2.0/workflowCalendar.js",
    "scripts/workflow2.0/workflowSummary.js",
    "scripts/workflow2.0/wf.view.task.js",
    "scripts/workflow2.0/wf.main.js",
    "scripts/workflow2.0/taskPool.js",
    "scripts/workflow2.0/wf.fileUpload.js",

    filters=filter_with_babel,
    output='gen/workflow_js_bundle.js'))

# 数据终端模块
assets.register('modbus_js_bundle', Bundle(
    "scripts/modbus/index.js",
    "scripts/modbus/main.js",
    "scripts/modbus/mb.baseView.js",
    "scripts/modbus/mb.projectPanel.js",
    "scripts/modbus/mb.pointsTable.js",
    "scripts/modbus/mb.pointsObixTable.js",
    "scripts/modbus/mb.debug.js",
    "scripts/modbus/mb.history.js",
    

    filters=filter_with_babel,
    output='gen/modbus_js_bundle.js'))
assets.register('modbus_css_bundle', Bundle(
    "scripts/modbus/content/data-access.css",
     "scripts/dataManage/contents/dataManager.css",
    "scripts/dataManage/contents/dm.nav.css",
    "scripts/dataManage/contents/dm.tag.css",
    "scripts/dataManage/contents/dm.tag.mark.css",
    "scripts/dataManage/contents/dm.tag.tree.css",
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/modbus.css'))

# 数据管理模块
assets.register('data_manage_js_bundle', Bundle(
    "scripts/lib/widgets/simpleDataTable/simpleDataTable.js",
    "scripts/workflow2.0/jquery.twbsPagination.min.js",

    "scripts/observer/widgets/historyChart.js",

    "scripts/dataManage/dm.screenManager.js",
    "scripts/dataManage/dm.model.js",
    "scripts/dataManage/dm.common.js",
    "scripts/dataManage/dm.utils.js",
    "scripts/dataManage/dm.tag.tree.js",
    "scripts/dataManage/dm.tag.external.tree.js",
    "scripts/dataManage/dm.tag.rule.js",
    "scripts/dataManage/dm.js",
    "scripts/dataManage/dm.realTimeData.js",
    "scripts/dataManage/dm.importData.js",
    "scripts/dataManage/dm.tag.main.js",
    "scripts/dataManage/dm.tag.view.introduce.js",
    "scripts/dataManage/dm.tag.view.loading.js",
    "scripts/dataManage/dm.tag.view.edit.js",
    "scripts/dataManage/dm.tag.view.mark.js",
    "scripts/dataManage/dm.exportData.js",
    "scripts/dataManage/dm.cloudSheet.js",
    "scripts/dataManage/dm.cloudPoint.js",
    "scripts/dataManage/dm.alarm.js",
    "scripts/dataManage/dm.diagnosis.js",
    "scripts/dataManage/dm.diagnosis.historyChart.js",
    "scripts/dataManage/dm.tag.panel.js",
    "scripts/dataManage/dm.tag.keywords.js",
    "scripts/dataManage/dm.cloudVersions.js",
    filters=filter_with_babel,
    output='gen/data_manage_js_bundle.js'))

assets.register('css_index', Bundle(
    "content/head.css",
    "scripts/lib/rangeSlider/css/ion.rangeSlider.css",
    "scripts/lib/rangeSlider/css/ion.rangeSlider.skinNice.css",
    # 'content/font-awesome.css',
    # 'scripts/lib/bootstrap/responsive-nav/responsive-nav.css',
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    # beop自定义IconFont
    'fonts/beopIconFont/iconfont.css',

    'scripts/lib/mathquill/mathquill.css',
    "content/index.css",
    'content/widget.css',
    "content/workflow.css",
    "scripts/dataManage/contents/dataManager.css",
    "scripts/dataManage/contents/dm.nav.css",
    "scripts/dataManage/contents/dm.tag.css",
    "scripts/dataManage/contents/dm.tag.mark.css",
    "scripts/dataManage/contents/dm.tag.tree.css",
    "content/terminalDebugging.css",

    # Factory - Start
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',
    'app/WebFactory/themes/default/css/report.css',
    'app/WebFactory/themes/default/css/widget.css',
    # Factory - End
    'scripts/lib/beopNotification/infoBox.css',
    'scripts/lib/widgets/simpleDataTable/simpleDataTable.css',
    'scripts/lib/codemirror/lib/codemirror.css',
    'scripts/lib/codemirror/addon/merge/merge.css',
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/index.css'))

# 能源管理模块
assets.register('energy_manage_js_bundle', Bundle(
    # library
    "scripts/loginValidate.js",
    "scripts/observer/widgets/dataSource.js",

    "app/EnergyManagement/scripts/core/frame.js",
    "app/EnergyManagement/scripts/core/chartTheme.js",
    "app/EnergyManagement/scripts/core/tagTree.js",
    "app/EnergyManagement/scripts/core/timePicker.js",
    "app/EnergyManagement/scripts/module/energyHistoryQuery.js",
    "app/EnergyManagement/scripts/module/energyOverview.js",

    "app/EnergyManagement/scripts/module/energyProjectStandard.js",
    "app/EnergyManagement/scripts/module/energyParameter.js",
    "app/EnergyManagement/scripts/module/energyStandard.js",
    "app/EnergyManagement/scripts/module/energyAnalysis.js",
    "app/EnergyManagement/scripts/module/energyMD.js",
    "app/EnergyManagement/scripts/module/energyReport.js",
    "app/EnergyManagement/scripts/module/energyParamConfig.js",

    "app/EnergyManagement/index.js",

    filters=filter_with_babel,
    output='gen/energy_manage_js_bundle.js'))

# Factory模块
# TODO
assets.register('factory_js_bundle', Bundle(
    output='gen/factory_js_bundle.js'))


# 策略组态模块
# TODO

# 诊断模块
# TODO

# 巡更模块
# TODO

# 点表录入模块
# TODO

# 温控模块
# TODO

# 对账模块
# TODO

# 冷链物流模块
# TODO

# 文件管理模块
# TODO

# 资产管理模块
assets.register('asset_js_bundle', Bundle(
    # library
    "scripts/observer/widgets/uploadFile.js",
    "app/WebFactory/scripts/lib/dockspawn/js/dockspawn.js",

    "scripts/iot/iotFilter.js",
    "scripts/iot/hierFilter.js",
    "scripts/iot/config/addThing.js",

    "scripts/workflow2.0/wf.data.js",
    "scripts/workflow2.0/wf.model.js",
    "scripts/workflow2.0/wf.fileUpload.js",
    "scripts/core/pyFormat.js",
    "scripts/workflow2.0/wf.view.memberSelected.js",
    "scripts/workflow2.0/workflowInsert.js",
    "scripts/workflow2.0/jquery.twbsPagination.min.js",

    "app/Asset/scripts/equipments/basicInfo.js",
    "app/Asset/scripts/equipments/diagnosisRecord.js",
    "app/Asset/scripts/equipments/fileManagement.js",
    "app/Asset/scripts/equipments/maintenanceRecord.js",
    "app/Asset/scripts/equipments/nameplateInfo.js",
    "app/Asset/scripts/equipments/realtimeData.js",
    "app/Asset/scripts/equipments/workOrder.js",
    "app/Asset/scripts/equipments/PreventiveMaintain.js",
    "app/Asset/scripts/equipments/SpareParts.js",
    "app/Asset/scripts/equipments/OutOfStorageRecords.js",
    "app/Asset/scripts/equipments/MaintainRecord.js",

    "app/Asset/scripts/widget/selectFilterTree.js",
    "app/Asset/scripts/widget/modalDeviceDetail.js",

    "app/Asset/scripts/panels/assetListPanel.js",
    "app/Asset/scripts/panels/assetProjConfig.js",
    "app/Asset/scripts/panels/assetStatePanel.js",
    "app/Asset/scripts/widget/imgGallery.js",
    "app/Asset/scripts/screens/assetScreen.js",

    filters=filter_with_babel,
    output='gen/asset_js_bundle.js'))

if app.config['ASSETS_PACKING']:
    print('start packing')
    build(assets)
    print('generate package sucessful!')

    # webpack packing process
    print('start webpack packing')
    proc = subprocess.Popen(
        'cd beopWeb/static/app/StrategyV2 && yarn install && yarn run build', shell=True
    )
    proc.wait()
    print('generate webpack package sucessful!')
    print('Building Process Done!')
    sys.exit()

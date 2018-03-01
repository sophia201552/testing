import logging
from beopWeb import app, bNeedPacking
from flask_assets import Environment, Bundle
from webassets.script import CommandLineEnvironment
from webassets.filter import get_filter

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
        filter_with_babel = (es2015, app.config['ASSETS_JS_FILTER'])

# import external bundles
import beopWeb.factory_bundle
from beopWeb.mod_strategy import strategy_bundle
from beopWeb.mod_diagnosis import bundle
from beopWeb.mod_thermalComfort import bundle

# js assets
assets.register('js_tool', Bundle(
    # min
    "scripts/lib/jquery-2.1.4.min.js",
    # "scripts/lib/bootstrap/responsive-nav/responsive-nav.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/rangeSlider/js/ion.rangeSlider.js",
    # "scripts/lib/effects/three.min.js",
    "scripts/lib/mathquill/mathquill.min.js",

    "scripts/lib/echart/echarts-all.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "scripts/lib/moment/moment.min.js",

    "scripts/lib/beopNotification/infoBox.js",
    "scripts/lib/widgets/simpleDataTable/simpleDataTable.js",

    "scripts/lib/codemirror/lib/codemirror.js",
    "scripts/lib/codemirror/mode/javascript/javascript.js",
    "scripts/lib/socket.io.js",
    output='gen/js_tool.js'))

assets.register('js_index', Bundle(
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/spring/factoryIoC.js",

    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/cache/dsCache.js",
    "scripts/core/cache/imgCache.js",
    "scripts/core/cache/bufferCache.js",
    "scripts/i18n/i18n.js",
    "scripts/core/permission.js",
    "scripts/admin/paneProjectSelector.js",
    "scripts/admin/skinSelector.js",
    "scripts/admin/versionHistory.js",
    "scripts/index.js",
    "scripts/register.js",
    "scripts/admin/allMessages.js",
    "scripts/core/pyFormat.js",
    "scripts/core/beopMap.js",
    "scripts/core/baseMap.js",
    "scripts/admin/benchmark/dataRange.js",
    "scripts/core/eventAdapter.js",
    "scripts/core/screenManager.js",
    "scripts/core/configWidget/configModal.js",
    "scripts/core/configWidget/baseConfigWidget.js",
    "scripts/core/configWidget/baseOptionWidget.js",
    "scripts/core/configWidget/baseDataWidget.js",
    "scripts/core/configWidget/baseFooterWidget.js",
    "scripts/core/configWidget/baseConfigModule.js",

    # widgets
    "scripts/lib/widgets/table.js",
    "scripts/lib/widgets/validator.js",

    # entrance
    "scripts/observer/widgets/operatingPane.js",
    "scripts/observer/widgets/operatingRecord.js",
    "scripts/observer/widgets/historyChart.js",
    "scripts/observer/widgets/uploadFile.js",
    # "scripts/observer/widgets/dataWatch.js",
    "scripts/workflow2.0/jquery.twbsPagination.min.js",

    "scripts/observer/widgets/alarmLogging.js",
    "scripts/observer/widgets/dataSourceAdd.js",
    "scripts/observer/widgets/dataSource.js",
    "scripts/observer/widgets/modalConfigurePane.js",
    "scripts/observer/widgets/shareLogging.js",
    "scripts/observer/diagnosis/diagnosisConfig.js",
    "scripts/observer/diagnosis/diagnosisLogHistory.js",
    "scripts/observer/widgets/temperatureSetting.js",
    "scripts/observer/widgets/dataCalcFilter.js",
    "scripts/observer/widgets/modalAppendPointToDs.js",
    "scripts/observer/widgets/modalInteractCfgPanel.js",
    "scripts/observer/diagnosis/diagnosisInfo.js",
    "scripts/observer/diagnosis/diagnosisROI.js",
    "scripts/observer/diagnosis/diagnosisNav.js",

    # unit
    "scripts/observer/units/unit.js",
    "scripts/observer/units/I_PUnits.js",
    "scripts/observer/units/SIUnits.js",

    "scripts/observer/observerScreen.js",
    "scripts/observer/analysisScreen.js",
    "scripts/observer/analysis/analysisModel.js",
    "scripts/observer/analysis/analysisTemplate.js",
    "scripts/observer/analysis/centerSliderPanel.js",
    "scripts/observer/analysis/leftSliderPanel.js",
    "scripts/observer/analysis/workspacePanel.js",
    "scripts/observer/analysis/templatePanel.js",

    "scripts/observer/terminalDebugging.js",

    "scripts/observer/benchmark/bmOverview.js",
    "scripts/observer/benchmark/benchmarkConfig.js",
    "scripts/observer/benchmark/benchmarkEnergyAnalysis.js",
    "scripts/observer/benchmark/benchmarkEnergyBenchmark.js",
    "scripts/observer/benchmark/benchmarkEnergyQuery.js",
    "scripts/observer/benchmark/benchmarkEnergyOverView.js",
    "scripts/observer/benchmark/benchmarkEnergyDiagnosis.js",
    "scripts/observer/benchmark/benchmarkEnergyForecast.js",
    "scripts/observer/benchmark/benchmarkEnergyBenchmarking.js",

    "scripts/observer/energyScreen.js",
    "scripts/observer/reportScreen.js",
    "scripts/observer/diagnosisScreen.js",
    "scripts/dataCenter3D/DataCenter3D.js",
    "scripts/observer/benchmark/benchmarkScreen.js",

    "scripts/iot/hierFilter.js",
    "scripts/iot/config/addThing.js",
    # equipment
    "scripts/observer/equipment/equipmentScreen.js",
    "scripts/observer/equipment/partsPurchaseScreen.js",
    "scripts/observer/equipment/partsScreen.js",


    # admin
    "scripts/admin/productDownload.js",
    "scripts/admin/userManager/userManagerController.js",
    "scripts/admin/userManager/accountManager.js",
    "scripts/admin/userManager/memberManager.js",
    "scripts/admin/userManager/projectPermissionManager.js",
    "scripts/admin/userManager/groupProjectManager.js",
    "scripts/admin/paneProjectCreator.js",
    "scripts/admin/paneAddProject.js",
    "scripts/admin/paneProjectConfigure.js",
    "scripts/admin/menuConfigure.js",
    "scripts/admin/configProject.js",
    "scripts/admin/benchmark/benchmarkConfigure.js",
    "scripts/admin/benchmark/benchMark.js",
    "views/theme/dark.js",

    "app/Asset/scripts/panels/assetStatePanel.js",
    "app/Asset/scripts/widget/imgGallery.js",

    filters=filter_with_babel,
    output='gen/js_index.js'))

assets.register('js_screen', Bundle(
    # observer
    "scripts/lib/ueditor/ueditor.config.js",
    "scripts/lib/ueditor/ueditor.all.js",
    "scripts/core/timer.js",
    "scripts/core/sprites.js",
    "scripts/core/commonCanvas.js",
    "scripts/lib/Chart.js",
    "scripts/observer/widgets/timeShaft.js",
    "scripts/observer/widgets/modalWiki.js",

    "scripts/observer/widgets/simpleHeat.js",

    # web_factory_ob_page_js_bundle
    assets['web_factory_ob_page_js_bundle'],
    # web_factory_ob_dashboard_js_bundle
    assets['web_factory_ob_dashboard_js_bundle'],

    "scripts/observer/entities/modelPipeline.js",
    "scripts/observer/entities/modelEquipment.js",
    "scripts/observer/entities/modelButton.js",
    "scripts/observer/entities/modelText.js",
    "scripts/observer/entities/modelChart.js",
    "scripts/observer/entities/modelGage.js",
    "scripts/observer/entities/modelRuler.js",
    "scripts/observer/entities/modelCheckbox.js",
    "scripts/observer/entities/modelTempDistribution.js",
    "scripts/observer/entities/modelRect.js",

    # analysis
    "scripts/observer/analysis/sharpViewScreen.js",

    "scripts/observer/analysis/enerties/anlzBase.js",
    "scripts/observer/analysis/enerties/anlzChart.js",
    "scripts/observer/analysis/enerties/anlzHistoryCompare.js",
    "scripts/observer/analysis/enerties/anlzScatter.js",
    "scripts/observer/analysis/enerties/anlzSpectrum.js",
    "scripts/observer/analysis/enerties/anlzTendency.js",
    "scripts/observer/analysis/enerties/anlzStack.js",
    #"scripts/observer/analysis/enerties/anlzCluster.js",
    "scripts/observer/analysis/enerties/anlzEnergy.js",

    # dashboard
    "scripts/spring/core/base.js",
    "scripts/spring/core/modalNone.js",
    "scripts/spring/core/modalAnalysis.js",
    "scripts/spring/entities/modalConfig.js",
    "scripts/spring/entities/modalChart.js",
    "scripts/spring/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalCarbonFootprint.js",
    "scripts/spring/entities/modalAppChart.js",
    "scripts/spring/entities/modalKPIStruct.js",
    "scripts/spring/entities/modalKPIManage.js",
    # "scripts/spring/entities/modalWeather.js",
    "scripts/spring/entities/modalEnergySaveRate.js",
    "scripts/spring/entities/modalCoalSaveTotal.js",
    "scripts/spring/entities/modalCo2SaveTotal.js",
    "scripts/spring/entities/modalKPIChart.js",
    "scripts/spring/entities/modalObserver.js",
    "scripts/spring/entities/modalMultiple.js",
    "scripts/spring/entities/modalPredictPointLine.js",
    "scripts/spring/entities/modalNote.js",
    "scripts/spring/entities/modalRank.js",
    "scripts/spring/entities/modalRankNormal.js",
    "scripts/spring/entities/modalMix.js",
    "scripts/spring/entities/modalMonitor.js",
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalChartCustom.js",
    "scripts/spring/entities/modalPointKPI.js",
    "scripts/spring/entities/modalPointKpiGrid.js",
    "scripts/spring/entities/modalReportChapter.js",
    "scripts/spring/entities/modalInteract.js",
    "scripts/spring/entities/modalMobile.js",
    "scripts/spring/entities/modalAppKPICollect.js",
    "scripts/spring/entities/modalDataMonitorList.js",
    "scripts/spring/entities/modalDiagnosisPanel.js",
    "scripts/spring/entities/modalKpiOverview.js",
    "scripts/spring/entities/modalDiagnosisStruct.js",
    "scripts/spring/entities/modalRealtimeWeather.js",
    "scripts/spring/entities/modalCumulantChart.js",
    "scripts/spring/entities/modalReportFactory.js",
    "scripts/spring/entities/modalIconManage.js",
    "scripts/spring/entities/modalColdHotAreaSummary.js",
    "scripts/spring/entities/modalEquipmentPerfectRate.js",
    "scripts/spring/entities/modalWorkOrderStatistics.js",
    "scripts/spring/entities/modalPriorityHandlingFaultList.js",
    "scripts/spring/entities/modalEnergyTrendAnalysis.js",
    "scripts/spring/entities/modalEquipmentRateAndHistoryData.js",
    "scripts/spring/entities/modalInteractiveTrendChart.js",
    "scripts/spring/entities/modalPriorityHandlingFaults.js",
    "scripts/spring/entities/modalRealTimeAndHistoryChartCoolSkin.js",
    # pointManager
    "scripts/workflow2.0/wf.view.memberSelected.js",
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

    # 历史拖拽面板
    "scripts/observer/widgets/historyDragPanel.js",

    # workflow
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

    # modbus
    "scripts/modbus/main.js",

    filters=filter_with_babel,
    output='gen/js_screen.js'))

assets.register('js_share-dashboard', Bundle(
    "scripts/lib/spin.js",
    "views/theme/dark.js",

    "scripts/lib/widgets/validator.js",

    "scripts/i18n/i18n.js",
    "scripts/spring/factoryIoC.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/EventAdapter.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/cache/dsCache.js",

    "scripts/observer/energyScreen.js",

    "views/share/dashboard/index.js",

    "scripts/spring/entities/modalConfig.js",
    "scripts/observer/widgets/modalConfigurePane.js",
    "scripts/observer/diagnosis/diagnosisInfo.js",
    "scripts/observer/diagnosis/diagnosisROI.js",
    "scripts/observer/diagnosis/diagnosisNav.js",

    # unit
    "scripts/observer/units/unit.js",
    "scripts/observer/units/I_PUnits.js",
    "scripts/observer/units/SIUnits.js",

    "scripts/spring/core/base.js",
    "scripts/spring/core/modalNone.js",
    "scripts/spring/core/modalAnalysis.js",
    "scripts/spring/entities/modalChart.js",
    "scripts/spring/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalCarbonFootprint.js",
    "scripts/spring/entities/modalAppChart.js",
    "scripts/spring/entities/modalKPIStruct.js",
    # "scripts/spring/entities/modalWeather.js",
    "scripts/spring/entities/modalEnergySaveRate.js",
    "scripts/spring/entities/modalCoalSaveTotal.js",
    "scripts/spring/entities/modalCo2SaveTotal.js",
    "scripts/spring/entities/modalKPIChart.js",
    "scripts/spring/entities/modalObserver.js",
    "scripts/spring/entities/modalMultiple.js",
    "scripts/spring/entities/modalPredictPointLine.js",
    "scripts/spring/entities/modalNote.js",
    "scripts/spring/entities/modalRank.js",
    "scripts/spring/entities/modalRankNormal.js",
    "scripts/spring/entities/modalMix.js",
    "scripts/spring/entities/modalMonitor.js",
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalChartCustom.js",
    "scripts/spring/entities/modalPointKpiGrid.js",
    "scripts/spring/entities/modalPointKPI.js",
    "scripts/spring/entities/modalReportChapter.js",
    "scripts/spring/entities/modalInteract.js",
    "scripts/spring/entities/modalMobile.js",
    "scripts/spring/entities/modalAppKPICollect.js",
    "scripts/spring/entities/modalDataMonitorList.js",
    "scripts/spring/entities/modalDiagnosisPanel.js",
    "scripts/spring/entities/modalRealtimeWeather.js",
    "scripts/spring/entities/modalKpiOverview.js",
    "scripts/spring/entities/modalDiagnosisStruct.js",
    "scripts/spring/entities/modalCumulantChart.js",
    "scripts/spring/entities/modalReportFactory.js",
    "scripts/spring/entities/modalIconManage.js",
    "scripts/spring/entities/modalColdHotAreaSummary.js",
    "scripts/spring/entities/modalEquipmentPerfectRate.js",
    "scripts/spring/entities/modalWorkOrderStatistics.js",
    "scripts/spring/entities/modalPriorityHandlingFaultList.js",
    "scripts/spring/entities/modalEnergyTrendAnalysis.js",
    "scripts/spring/entities/modalEquipmentRateAndHistoryData.js",
    "scripts/spring/entities/modalInteractiveTrendChart.js",
    "scripts/spring/entities/modalPriorityHandlingFaults.js",
    "scripts/spring/entities/modalRealTimeAndHistoryChartCoolSkin.js",

    "scripts/observer/analysis/enerties/anlzBase.js",
    "scripts/observer/analysis/enerties/anlzChart.js",
    "scripts/observer/analysis/enerties/anlzHistoryCompare.js",
    "scripts/observer/analysis/enerties/anlzScatter.js",
    "scripts/observer/analysis/enerties/anlzSpectrum.js",
    "scripts/observer/analysis/enerties/anlzTendency.js",
    "scripts/observer/analysis/enerties/anlzStack.js",
    #"scripts/observer/analysis/enerties/anlzCluster.js",
    "scripts/observer/analysis/enerties/anlzEnergy.js",
    "scripts/observer/widgets/dataSource.js",
    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_share-dashboard.js'))

assets.register('js_temperature_tools', Bundle(
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/lib/rangeSlider/js/ion.rangeSlider.js",
    "scripts/lib/hammer/hammer.min.js",
    "scripts/lib/hammer/jquery.hammer.js",
    "scripts/lib/mqtt.min.js",
    "app/MobileCommon/scripts/updateHelper.js",
    "app/MobileCommon/scripts/mobileCommon.js",
    "app/MobileCommon/scripts/router.js",
    "app/MobileCommon/scripts/toggle.js",
    "scripts/lib/echart/echarts-all.js",
    "scripts/lib/beopNotification/infoBox.js",
    output='gen/js_temperature_tools.js'))

assets.register('js_temperature', Bundle(
    "scripts/lib/spin.js",
    "scripts/lib/threejs/three.min.js",
    "scripts/lib/threejs/OrbitControls.js",
    "scripts/lib/threejs/ShaderTerrain.js",
    "scripts/lib/threejs/simpleheat.js",
    "scripts/lib/threejs/chroma.min.js",


    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",

    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/i18n/i18n.js",
    "scripts/core/eventAdapter.js",
    "scripts/lib/qrcode.js",
    "scripts/lib/jquery.qrcode.js",
    # "scripts/lib/beopNotification/infoBox.js",

    "app/temperatureControl/scripts/index.js",
    "app/temperatureControl/scripts/admin/adminConfigure.js",
    "app/temperatureControl/scripts/admin/projectSel.js",
    "app/temperatureControl/scripts/admin/historyChart.js",
    "app/temperatureControl/scripts/admin/ctrlSet.js",
    "app/temperatureControl/scripts/admin/personalCenter.js",
    "app/temperatureControl/scripts/admin/avatar.js",
    "app/temperatureControl/scripts/admin/phoneNumber.js",
    "app/temperatureControl/scripts/observer/landscapeObserverScreen.js",
    "app/temperatureControl/scripts/observer/baseObserverScreen.js",
    "app/temperatureControl/scripts/observer/observerScreen.js",
    "app/temperatureControl/scripts/observer/observerLocalScreen.js",
    "app/temperatureControl/scripts/observer/widgets/observerMap.js",
    "app/temperatureControl/scripts/observer/widgets/observerEquip.js",
    "app/temperatureControl/scripts/observer/threeDRender.js",
    "app/temperatureControl/scripts/observer/localListScreen.js",

    "app/temperatureControl/scripts/config/schedule.js",
    "app/temperatureControl/scripts/config/mode.js",
    "app/temperatureControl/scripts/config/newsCenter.js",

    # lib
    "app/temperatureControl/lib/jquery.photoClip.min.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_temperature.js'))

assets.register('js_temperature_admin', Bundle(
    "scripts/lib/spin.js",

    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/i18n/i18n.js",
    "scripts/core/eventAdapter.js",
    "scripts/iot/hierFilter.js",
    "scripts/iot/config/addThing.js",

    "app/temperatureControl/admin/scripts/index.js",
    "app/temperatureControl/admin/scripts/configure/configScreen.js",
    "app/temperatureControl/admin/scripts/configure/widgets/configTool.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_temperature_admin.js'))

assets.register('js_mobile_tool', Bundle(
    # lib
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/lib/rangeSlider/js/ion.rangeSlider.js",
    "scripts/lib/echart/echarts-3.6.1.js",
    "views/theme/burgeen.js",
    "scripts/lib/beopNotification/infoBox.js",
    # "scripts/lib/hammer/hammer.min.js",
    # "scripts/lib/hammer/jquery.hammer.js",
    "scripts/lib/spin.js",
    "scripts/lib/zepto/zepto.js",
    "scripts/lib/zepto/event.js",
    "scripts/lib/zepto/touch.js",

    # core
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/eventAdapter.js",
    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",

    # mobile core
    # "app/MobileCommon/scripts/mobileApi.js",
    "app/MobileCommon/scripts/updateHelper.js",
    "app/MobileCommon/scripts/mobileCommon.js",
    "app/MobileCommon/scripts/router.js",
    "app/MobileCommon/scripts/toggle.js",

    output='gen/js_mobile_tool.js'))

assets.register('js_dashboard', Bundle(
    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/commonCanvas.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/eventAdapter.js",
    "scripts/i18n/i18n.js",
    "scripts/observer/reportScreen.js",

    "scripts/iot/hierFilter.js",
    "scripts/iot/config/addThing.js",

    # factory core
    "app/WebFactory/scripts/screens/dashboard/dashboardOb.js",
    "app/WebFactory/scripts/core/comm.js",
    "app/WebFactory/scripts/core/core.js",

    # index
    "app/dashboard/scripts/index.js",
    "app/dashboard/scripts/core/baseMap.js",
    "app/dashboard/scripts/core/beopMap.js",
    "app/dashboard/scripts/core/selectPage.js",
    # project
    "app/dashboard/scripts/project/projectSummary.js",
    "app/dashboard/scripts/project/projectReport.js",
    "app/dashboard/scripts/project/projectFactoryReport.js",
    "app/dashboard/scripts/project/projectList.js",
    "app/dashboard/scripts/project/projectMap.js",
    "app/dashboard/scripts/project/projectDashboard.js",
    "scripts/spring/factoryIoC.js",
    "scripts/observer/widgets/dataSource.js",
    # analysis
    "scripts/observer/analysis/sharpViewScreen.js",
    "scripts/observer/analysis/enerties/anlzBase.js",
    "scripts/observer/analysis/enerties/anlzChart.js",
    "scripts/observer/analysis/enerties/anlzHistoryCompare.js",
    "scripts/observer/analysis/enerties/anlzScatter.js",
    "scripts/observer/analysis/enerties/anlzSpectrum.js",
    "scripts/observer/analysis/enerties/anlzTendency.js",
    "scripts/observer/analysis/enerties/anlzStack.js",
    #"scripts/observer/analysis/enerties/anlzCluster.js",
    "scripts/observer/analysis/enerties/anlzEnergy.js",
    # dashboard
    "scripts/spring/core/base.js",
    "scripts/spring/core/modalNone.js",
    "scripts/spring/core/modalAnalysis.js",
    "scripts/spring/entities/modalConfig.js",
    "scripts/spring/entities/modalChart.js",
    "scripts/spring/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalCarbonFootprint.js",
    "scripts/spring/entities/modalAppChart.js",
    "scripts/spring/entities/modalKPIStruct.js",
    # "scripts/spring/entities/modalWeather.js",
    "scripts/spring/entities/modalEnergySaveRate.js",
    "scripts/spring/entities/modalCoalSaveTotal.js",
    "scripts/spring/entities/modalCo2SaveTotal.js",
    "scripts/spring/entities/modalKPIChart.js",
    "scripts/spring/entities/modalObserver.js",
    "scripts/spring/entities/modalMultiple.js",
    "scripts/spring/entities/modalPredictPointLine.js",
    "scripts/spring/entities/modalNote.js",
    "scripts/spring/entities/modalRank.js",
    "scripts/spring/entities/modalRankNormal.js",
    "scripts/spring/entities/modalMix.js",
    "scripts/spring/entities/modalMonitor.js",
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalChartCustom.js",
    "scripts/spring/entities/modalPointKPI.js",
    "scripts/spring/entities/modalPointKpiGrid.js",
    "scripts/spring/entities/modalReportChapter.js",
    "scripts/spring/entities/modalInteract.js",
    "scripts/spring/entities/modalMobile.js",
    "scripts/spring/entities/modalAppKPICollect.js",
    "scripts/spring/entities/modalDataMonitorList.js",
    "scripts/spring/entities/modalDiagnosisPanel.js",
    "scripts/spring/entities/modalDiagnosisStruct.js",
    "scripts/spring/entities/modalRealtimeWeather.js",
    "scripts/spring/entities/modalKpiOverview.js",
    "scripts/spring/entities/modalCumulantChart.js",
    "scripts/spring/entities/modalIconManage.js",
    "scripts/spring/entities/modalColdHotAreaSummary.js",
    "scripts/spring/entities/modalEquipmentPerfectRate.js",
    "scripts/spring/entities/modalWorkOrderStatistics.js",
    "scripts/spring/entities/modalPriorityHandlingFaultList.js",
    "scripts/spring/entities/modalEnergyTrendAnalysis.js",
    "scripts/spring/entities/modalEquipmentRateAndHistoryData.js",
    "scripts/spring/entities/modalInteractiveTrendChart.js",
    "scripts/spring/entities/modalPriorityHandlingFaults.js",
    "scripts/spring/entities/modalRealTimeAndHistoryChartCoolSkin.js",

    # report
    "app/dashboard/scripts/report/reportIndex.js",
    # message
    "app/dashboard/scripts/message/messageIndex.js",
    "app/dashboard/scripts/message/messageWorkflow.js",
    "app/dashboard/scripts/message/messageReport.js",
    "app/dashboard/scripts/message/messagePush.js",
    "app/dashboard/scripts/message/messageFactoryReport.js",
    # workflow
    "app/dashboard/scripts/workflow/workflowIndex.js",
    "app/dashboard/scripts/workflow/workflowAdd.js",
    "app/dashboard/scripts/workflow/workflowDetail.js",
    # configure
    "app/dashboard/scripts/admin/adminConfig.js",
    "app/dashboard/scripts/admin/adminConfigNew.js",
    # ztree
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    # iot
    "scripts/iot/hierFilter.js",

    "scripts/observer/diagnosis/diagnosisInfo.js",
    "scripts/observer/diagnosis/diagnosisROI.js",
    "scripts/observer/diagnosis/diagnosisNav.js",

    # workflow
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
    # "app/DiagnosisEngine/scripts/diagnosisConfig/animController.js",
    # "app/DiagnosisEngine/scripts/diagnosisConfig/diagnosisConfigScreen.js",
    # "app/DiagnosisEngine/scripts/diagnosisConfig/equipmentScreen.js",

    # "app/dashboard/scripts/workflow/component/wkInfoComponent.js",
    # "app/dashboard/scripts/workflow/component/wkInfoEditPage.js",
    # "app/dashboard/scripts/workflow/template/wkBase.js",
    # "app/dashboard/scripts/workflow/workflowIOC.js",
    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_dashboard.js'))

assets.register('js_report_detail', Bundle(
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/lib/spin.js",
    "scripts/lib/echart/echarts-all.js",
    "scripts/i18n/i18n.js",
    "scripts/report/index.js",
    "scripts/core/common.js",
    "scripts/observer/reportScreen.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_report.js'))

# asset bundled js
assets.register('asset_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/i18n/i18n.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/widgets/inputDatetime.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "app/WebFactory/scripts/lib/dockspawn/js/dockspawn.js",
    "scripts/lib/echart/echarts-all.js",
    'scripts/lib/beopNotification/infoBox.js',

    "scripts/core/common.js",
    "scripts/core/webAPI.js",

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

    # "app/Asset/scripts/equipments/nameplateInfo.js",
    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/asset_js_index.js'))
# asset app bundled js
assets.register('asset_app_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/i18n/i18n.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/widgets/inputDatetime.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "app/WebFactory/scripts/lib/dockspawn/js/dockspawn.js",
    "scripts/lib/echart/echarts-all.js",
    'scripts/lib/beopNotification/infoBox.js',

    "scripts/core/common.js",
    "scripts/core/webAPI.js",

    "scripts/iot/iotFilter.js",
    "scripts/iot/hierFilter.js",
    "scripts/iot/config/addThing.js",

    "scripts/workflow2.0/wf.data.js",
    "scripts/workflow2.0/wf.model.js",
    "scripts/workflow2.0/wf.fileUpload.js",
    "scripts/core/pyFormat.js",
    "scripts/workflow2.0/wf.view.memberSelected.js",
    "scripts/workflow2.0/workflowInsert.js",

    "app/Asset/assetApp/scripts/listPanel.js",
    "app/Asset/assetApp/scripts/path.js",
    # "app/Asset/ledgerRecords/scripts/assetProjConfig.js",

    # "app/Asset/ledgerRecords/scripts/selectFilterTree.js",
    # "app/Asset/assetApp/scripts/modalDeviceDetail.js",

    # "app/Asset/assetApp/scripts/basicInfo.js",
    # "app/Asset/assetApp/scripts/MaintainRecord.js",
    # "app/Asset/assetApp/scripts/nameplateInfo.js",

    "app/Asset/assetApp/scripts/all.js",
    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/asset_app_js_index.js'))

# asset bundled js
assets.register('patrol_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/lib/sha1.js",
    "scripts/lib/qrcode.js",
    "scripts/lib/jquery.qrcode.js",
    "scripts/lib/beopNotification/infoBox.js",

    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",

    "app/Patrol/scripts/screens/patrolPath.js",
    "app/Patrol/scripts/screens/patrolPoint.js",
    "app/Patrol/scripts/screens/patrolPerson.js",
    "app/Patrol/scripts/screens/patrolReport.js",
    "app/Patrol/scripts/screens/patrolSchedule.js",
    "app/Patrol/scripts/screens/patrolScreen.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/patrol_js_index.js'))

# asset bundled js
assets.register('patrol_app_js_bundle', Bundle(
    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/eventAdapter.js",
    "scripts/i18n/i18n.js",

    # core
    "app/PatrolApp/scripts/index.js",
    "app/MobileCommon/scripts/updateHelper.js",
    "app/PatrolApp/scripts/core/dataManager.js",

    # screen
    "app/PatrolApp/scripts/screen/logScreen.js",
    "app/PatrolApp/scripts/screen/userSelScreen.js",
    "app/PatrolApp/scripts/screen/pathSelScreen.js",
    "app/PatrolApp/scripts/screen/missionSelScreen.js",
    "app/PatrolApp/scripts/screen/pointScreen.js",
    "app/PatrolApp/scripts/screen/pointInfoScreen.js",
    "app/PatrolApp/scripts/screen/missionResultScreen.js",
    "app/PatrolApp/scripts/screen/adminConfigure.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/patrol_app_js_index.js'))

# asset bundled js
assets.register('input_app_js_bundle', Bundle(
    # core
    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/eventAdapter.js",
    "scripts/i18n/i18n.js",

    # screen
    "app/inputApp/scripts/index.js",
    "app/inputApp/scripts/screen/observerScreen.js",
    "app/inputApp/scripts/screen/parameterList.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/input_app_js_index.js'))

# assets.register('js_diagnosis_engine_tool_bundle', Bundle(
#     # library
#     "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
#     # core
#     "scripts/core/screenManager.js",
#     "scripts/core/cache/drivers/indexedDB.js",
#     "scripts/core/cache/drivers/localStorage.js",
#     "scripts/core/cache/baseCache.js",

#     filters=app.config['ASSETS_JS_FILTER'],
#     output='gen/js_diagnosis_engine_tool_bundle.js'))

# # diagnosis_engine js
# assets.register('js_diagnosis_engine_bundle', Bundle(

#     # diagnosis config
#     "app/DiagnosisEngine/scripts/diagnosisConfig/animController.js",
#     "app/DiagnosisEngine/scripts/diagnosisConfig/diagnosisConfigScreen.js",

#     # widget
#     "app/DiagnosisEngine/scripts/widget/panelToggle.js",
#     "app/DiagnosisEngine/scripts/widget/templateTree.js",

#     # recognize
#     "app/DiagnosisEngine/scripts/recognize/ptRecognizeScreen.js",

#     # configure
#     "app/DiagnosisEngine/scripts/configure/diagnosisConfigScreen.js",

#     # custom
#     "app/DiagnosisEngine/scripts/custom/dnCstmScreen.js",

#     # faultHistory
#     "app/DiagnosisEngine/scripts/faultHistory/faultHistoryScreen.js",

# "scripts/iot/config/addThing.js",

# "app/DiagnosisEngine/scripts/index.js",

# output='gen/js_diagnosis_engine_bundle.js'))

# # factory template js
# assets.register('js_diagnosis_template', Bundle(
#     "app/DiagnosisEngine/scripts/template/template.js",
#     "app/DiagnosisEngine/scripts/template/tab.js",
#     "app/DiagnosisEngine/scripts/template/equipment.js",

#     filters=app.config['ASSETS_JS_FILTER'],
#     output='gen/js_diagnosis_template.js'))

# # factory template js
# assets.register('js_diagnosis_template', Bundle(
#     "app/DiagnosisEngine/scripts/template/template.js",
#     "app/DiagnosisEngine/scripts/template/tab.js",
#     "app/DiagnosisEngine/scripts/template/equipment.js",

#     filters=app.config['ASSETS_JS_FILTER'],
#     output='gen/js_diagnosis_template.js'))


# diagnosis template js
assets.register('js_template', Bundle(
    "app/WebFactory/scripts/components/template/template.js",

    "app/WebFactory/scripts/components/template/tabs/tab.js",
    "app/WebFactory/scripts/components/template/tabs/layerTab.js",
    "app/WebFactory/scripts/components/template/tabs/pageTab.js",
    "app/WebFactory/scripts/components/template/tabs/widgetTab.js",
    "app/WebFactory/scripts/components/template/tabs/reportTab.js",
    "app/WebFactory/scripts/components/template/tabs/imageTab.js",
    "app/WebFactory/scripts/components/template/tabs/pageRecycleTab.js",
    "app/WebFactory/scripts/components/template/tabs/projectRecycleTab.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_template.js'))

# modbus bundled js
assets.register('modbus_js_bundle', Bundle(
    "scripts/modbus/mb.baseView.js",
    "scripts/modbus/mb.projectPanel.js",
    "scripts/modbus/mb.pointsTable.js",
    "scripts/modbus/mb.pointsObixTable.js",
    "scripts/modbus/mb.debug.js",
    "scripts/modbus/mb.history.js",

    filters=filter_with_babel,
    output='gen/modbus.js'))
# modbus bundled css
assets.register('modbus_css_bundle', Bundle(
    "scripts/modbus/content/data-access.css",

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/modbus.css'))

# css assets
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

assets.register('css_temperature', Bundle(
    "scripts/lib/rangeSlider/css/ion.rangeSlider.css",
    "scripts/lib/rangeSlider/css/ion.rangeSlider.skinNice.css",
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',
    'scripts/lib/beopNotification/infoBox.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_temperature.css'))

assets.register('dashboard_app_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',
    "scripts/lib/beopNotification/infoBox.css",
    "content/widget.css",
    'app/WebFactory/themes/default/css/report.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_dashboard.css'))

assets.register('css_report_detail', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',
    "content/index.css",
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_report.css'))

# asset bundled css
assets.register('asset_css_bundle', Bundle(
    'app/WebFactory/scripts/lib/dockspawn/css/dock-manager.css',
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'scripts/lib/beopNotification/infoBox.css',
    'fonts/beopIconFont/iconfont.css',
    'app/Asset/themes/default/css/main.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/asset_css_bundle.css'))

# asset app bundled css
assets.register('asset_app_css_bundle', Bundle(
    'app/WebFactory/scripts/lib/dockspawn/css/dock-manager.css',
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'scripts/lib/beopNotification/infoBox.css',

    'app/Asset/assetApp/themes/css/main.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/asset_app_css_bundle.css'))

# patrol bundled css
assets.register('patrol_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'app/Patrol/themes/default/css/main.css',
    'scripts/lib/beopNotification/infoBox.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/patrol_css_bundle.css'))

# patrolApp bundled css
assets.register('patrol_app_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'scripts/lib/beopNotification/infoBox.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/patrol_app_css_bundle.css'))

# ptImportApp bundled css
assets.register('input_app_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/input_app_css_bundle.css'))

# # DiagnosisEngine bundled css
# assets.register('css_diagnosis_engine_bundle', Bundle(
#     'scripts/lib/bootstrap/css/bootstrap.min.css',
#     'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

#     filters=app.config['ASSETS_CSS_FILTER'],
#     output='gen/css_diagnosis_engine_bundle.css'))

# bill bundled css
assets.register('bill_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'app/Bill/themes/default/css/main.css',
    'scripts/lib/beopNotification/infoBox.css',
    'fonts/beopIconFont/iconfont.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/bill_css_bundle.css'))

# kaide bundled css
assets.register('kaide_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'app/Benz/Kaide/themes/default/css/main.css',
    'scripts/lib/beopNotification/infoBox.css',
    'fonts/beopIconFont/iconfont.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',

    # factory bundle start
    'app/WebFactory/themes/default/css/comm.css',
    'app/WebFactory/themes/default/css/main.css',
    'app/WebFactory/themes/default/css/widget.css',
    # end

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/kaide_css_bundle.css'))

# fileMangement css
assets.register('file_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'app/fileManagement/themes/default/css/main.css',
    'scripts/lib/beopNotification/infoBox.css',
    'fonts/beopIconFont/iconfont.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',
    "content/index.css",

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/file_css_bundle.css'))
# CompatibleFrame
assets.register('js_compatible_frame', Bundle(
    "scripts/lib/jquery-2.1.4.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/spin.js",

    "scripts/lib/echart/echarts-all.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",

    "views/theme/dark.js",

    "scripts/i18n/i18n.js",
    "app/CompatibleFrame/factoryIoC.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/EventAdapter.js",

    "scripts/observer/energyScreen.js",
    "app/CompatibleFrame/index.js",
    "app/CompatibleFrame/dashboard.js",
    "app/CompatibleFrame/base.js",

    "scripts/spring/core/modalNone.js",
    "scripts/spring/entities/modalChart.js",
    "app/CompatibleFrame/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalMultiple.js",
    "scripts/spring/entities/modalPredictPointLine.js",
    "scripts/spring/entities/modalMix.js",
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalInteract.js",
    "scripts/spring/entities/modalDiagnosisPanel.js",
    "scripts/observer/diagnosis/diagnosisLogHistory.js",

    "scripts/observer/widgets/dataSource.js",

    # factory 报表 - start
    "app/WebFactory/scripts/core/comm.js",
    "app/WebFactory/scripts/core/core.js",

    "app/WebFactory/scripts/screens/report/config/chartThemeConfig.js",
    "app/WebFactory/scripts/screens/report/mixins/variableProcessMixin.js",

    "app/WebFactory/scripts/screens/report/components/component.js",
    "app/WebFactory/scripts/screens/report/components/base.js",
    "app/WebFactory/scripts/screens/report/components/container/container.js",
    "app/WebFactory/scripts/screens/report/components/reportContainer/reportContainer.js",
    "app/WebFactory/scripts/screens/report/components/chapterContainer/chapterContainer.js",
    "app/WebFactory/scripts/screens/report/components/chart/chart.js",
    "app/WebFactory/scripts/screens/report/components/text/text.js",
    "app/WebFactory/scripts/screens/report/components/html/html.js",
    "app/WebFactory/scripts/screens/report/components/summary/summary.js",
    "app/WebFactory/scripts/screens/report/components/block/block.js",
    "app/WebFactory/scripts/screens/report/components/table/table.js",
    "app/WebFactory/scripts/screens/report/components/dashboardWidget/dashboardWidget.js",

    "app/WebFactory/scripts/screens/dashboard/dashboardOb.js",

    "app/WebFactory/scripts/screens/report/reportOb.js",
    "app/WebFactory/scripts/screens/report/reportAPI.js",
    "app/CompatibleFrame/reportWrapOb.js",
    # factory 报表 - end

    filters=filter_with_babel,
    output='gen/js_compatible_frame.js'))

assets.register('css_compatible_frame', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

    "content/index.css",
    'app/WebFactory/themes/default/css/report.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_compatible_frame.css'))

# Logistics
assets.register('logistics_js_bundle', Bundle(
    "scripts/lib/jquery-2.1.4.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/spin.js",
    "scripts/lib/echart/echarts-all.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "views/theme/dark.js",
    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/EventAdapter.js",
    'scripts/lib/beopNotification/infoBox.js',

    "scripts/iot/iotFilter.js",
    "scripts/iot/config/addThing.js",

    "app/LogisticsPlantform/scripts/index.js",
    "app/LogisticsPlantform/scripts/screens/mapScreen.js",
    "app/LogisticsPlantform/scripts/screens/navScreen.js",
    "app/LogisticsPlantform/scripts/screens/fixedPoint.js",
    "app/LogisticsPlantform/scripts/screens/fixedMovePointDetail.js",
    "app/LogisticsPlantform/scripts/screens/dataStatistic.js",
    "app/LogisticsPlantform/scripts/screens/qualityManage.js",
    "app/LogisticsPlantform/scripts/screens/historicalPath.js",
    "app/LogisticsPlantform/scripts/screens/onlineHistory.js",
    "app/LogisticsPlantform/scripts/screens/switchAccount.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_logistics.js'))

assets.register('logistics_css_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',
    'scripts/lib/beopNotification/infoBox.css',

    "content/index.css",
    'app/WebFactory/themes/default/css/report.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_logistics.css'))

#  bill js
assets.register('bill_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/lib/echart/echarts-all.js",

    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",

    "app/Bill/scripts/screens/billManageScreen.js",
    "app/Bill/scripts/screens/billScreen.js",
    "app/Bill/scripts/screens/analysisQueryScreen.js",
    "app/Bill/scripts/screens/crosswiseScreen.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/bill_js_bundle.js'))

#  kaide js
assets.register('kaide_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/lib/echart/echarts-all.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",

    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",

    assets['web_factory_ob_page_js_bundle'],

    "app/Benz/Kaide/scripts/energyManageScreen.js",
    "app/Benz/Kaide/scripts/tempComfortScreen.js",
    "app/Benz/Kaide/scripts/inConditionScreen.js",
    "app/Benz/Kaide/scripts/energySaveScreen.js",
    "app/Benz/Kaide/scripts/workOrderFinishScreen.js",
    "app/Benz/Kaide/scripts/dataQualityScreen.js",
    "app/Benz/Kaide/scripts/kaideScreen.js",
    "app/Benz/Kaide/scripts/coldHotAnalysis.js",

    "scripts/index.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/kaide_js_bundle.js'))


#  fileManagement js
assets.register('file_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/lib/echart/echarts-all.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",

    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",

    assets['web_factory_ob_page_js_bundle'],

    "app/fileManagement/scripts/navFiles.js",
    "app/fileManagement/scripts/documentScreen.js",

    "scripts/index.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/file_js_bundle.js'))    

#  energyManagement js
assets.register('energy_management_css_bundle', Bundle(
    # library
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',
    'scripts/lib/beopNotification/infoBox.css',
    "scripts/lib/daterangepicker/css/daterangepicker.css",

    "content/index.css",
    'app/WebFactory/themes/default/css/report.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/energy_management_css_bundle.css'))  

assets.register('energy_management_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/lib/echart/echarts-all.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "scripts/lib/moment/moment.min.js",
    "scripts/lib/daterangepicker/daterangepicker.js",

    "scripts/core/permission.js",
    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/eventAdapter.js",
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
    "app/EnergyManagement/scripts/module/EnergyAnalysis.js",
    "app/EnergyManagement/scripts/module/energyReport.js",
    "app/EnergyManagement/scripts/module/energyParamConfig.js",


    "app/EnergyManagement/index.js",

    #filters=app.config['ASSETS_JS_FILTER'],
    filters=filter_with_babel,
    output='gen/energy_management_js_bundle.js'))    


#  platform js
assets.register('platform_css_bundle', Bundle(
    # library
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',
    'scripts/lib/beopNotification/infoBox.css',
    "scripts/lib/daterangepicker/css/daterangepicker.css",

    "content/index.css",
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/platform_css_bundle.css'))  

assets.register('platform_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/lib/echart/echarts-all.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "scripts/lib/moment/moment.min.js",
    "scripts/lib/daterangepicker/daterangepicker.js",
    "scripts/core/baseMap.js",
    "scripts/lib/widgets/validator.js",

    "scripts/core/permission.js",
    "scripts/i18n/i18n.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/eventAdapter.js",

    "app/Platform/scripts/core/nav.js",
    "app/Platform/scripts/core/frame.js",

    "app/Platform/index.js",
    "app/Platform/scripts/module/platformGuide.js",
    "app/Platform/scripts/module/projectCreate.js",    

    "app/Platform/scripts/module/platformOverview.js",
    "app/Platform/scripts/module/platformCopy.js",
    #filters=app.config['ASSETS_JS_FILTER'],
    filters=filter_with_babel,
    output='gen/platform_js_bundle.js'))    


##  Smart Service
# assets.register('smart_service_css_bundle', Bundle(
#     "app/MobileCommon/style/common.css",
#
#     filters=app.config['ASSETS_CSS_FILTER'],
#     output='gen/css_smart_service.css'))
#
# assets.register('smart_service_js_bundle', Bundle(
#     "app/SmartService/scripts/index.js",
#
#     #core
#     "scripts/observer/widgets/dataSource.js",
#     "scripts/observer/reportScreen.js",
#
#     # factory core
#     "app/WebFactory/scripts/screens/dashboard/dashboardOb.js",
#     "app/WebFactory/scripts/core/comm.js",
#     "app/WebFactory/scripts/core/core.js",
#
#     "scripts/spring/factoryIoC.js",
#     # dashboard core
#     "scripts/observer/analysis/sharpViewScreen.js",
#     "scripts/observer/analysis/enerties/anlzBase.js",
#     "scripts/observer/analysis/enerties/anlzChart.js",
#     "scripts/observer/analysis/enerties/anlzHistoryCompare.js",
#     "scripts/observer/analysis/enerties/anlzScatter.js",
#     "scripts/observer/analysis/enerties/anlzSpectrum.js",
#     "scripts/observer/analysis/enerties/anlzTendency.js",
#     "scripts/observer/analysis/enerties/anlzStack.js",
#     "scripts/observer/analysis/enerties/anlzCluster.js",
#     "scripts/observer/analysis/enerties/anlzEnergy.js",
#     "scripts/spring/core/base.js",
#     "scripts/spring/core/modalNone.js",
#     "scripts/spring/core/modalAnalysis.js",
#     "scripts/spring/entities/modalConfig.js",
#     "scripts/spring/entities/modalChart.js",
#     "scripts/spring/entities/modalHistoryChart.js",
#     "scripts/spring/entities/modalCarbonFootprint.js",
#     "scripts/spring/entities/modalAppChart.js",
#     "scripts/spring/entities/modalKPIStruct.js",
#     # "scripts/spring/entities/modalWeather.js",
#     "scripts/spring/entities/modalEnergySaveRate.js",
#     "scripts/spring/entities/modalCoalSaveTotal.js",
#     "scripts/spring/entities/modalCo2SaveTotal.js",
#     "scripts/spring/entities/modalKPIChart.js",
#     "scripts/spring/entities/modalObserver.js",
#     "scripts/spring/entities/modalMultiple.js",
#     "scripts/spring/entities/modalPredictPointLine.js",
#     "scripts/spring/entities/modalNote.js",
#     "scripts/spring/entities/modalRank.js",
#     "scripts/spring/entities/modalRankNormal.js",
#     "scripts/spring/entities/modalMix.js",
#     "scripts/spring/entities/modalMonitor.js",
#     "scripts/spring/entities/modalHtml.js",
#     "scripts/spring/entities/modalChartCustom.js",
#     "scripts/spring/entities/modalPointKPI.js",
#     "scripts/spring/entities/modalPointKpiGrid.js",
#     "scripts/spring/entities/modalReportChapter.js",
#     "scripts/spring/entities/modalInteract.js",
#     "scripts/spring/entities/modalMobile.js",
#     "scripts/spring/entities/modalAppKPICollect.js",
#     "scripts/spring/entities/modalDataMonitorList.js",
#     "scripts/spring/entities/modalDiagnosisPanel.js",
#     "scripts/spring/entities/modalDiagnosisStruct.js",
#     "scripts/spring/entities/modalRealtimeWeather.js",
#     "scripts/spring/entities/modalKpiOverview.js",
#     "scripts/spring/entities/modalCumulantChart.js",
#
#
#     filters=app.config['ASSETS_JS_FILTER'],
#     output='gen/js_smart_service.js'))

assets.register('css_mobile_common_bundle', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'fonts/beopIconFont/iconfont.css',

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/css_mobile_common.js'))

if app.config['ASSETS_PACKING']:
    print('start packing')
    log = logging.getLogger('webassets')
    log.addHandler(logging.StreamHandler())
    log.setLevel(logging.DEBUG)
    cmdenv = CommandLineEnvironment(assets, log)
    cmdenv.build()
    print('generate package sucessful!')

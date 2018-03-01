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
filter_with_babel = ()
print('babel 工具状态：开启')
filter_with_babel = es2015


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

    "scripts/lib/echart/echarts-3.8.4-ex.min.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "scripts/lib/moment/moment.min.js",
    "scripts/lib/moment/moment-timezone-with-data-2012-2022.min.js",

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


# web factory report preview bundled js
assets.register('web_factory_ob_report_js_bundle', Bundle(
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
    "app/WebFactory/scripts/screens/report/components/customSummary/customSummary.js",
    "app/WebFactory/scripts/screens/report/components/block/block.js",
    "app/WebFactory/scripts/screens/report/components/diagnosisBlock/diagnosisBlock.js",
    "app/WebFactory/scripts/screens/report/components/dataBlock/dataBlock.js",
    "app/WebFactory/scripts/screens/report/components/table/table.js",
    "app/WebFactory/scripts/screens/report/components/dashboardWidget/dashboardWidget.js",

    "app/WebFactory/scripts/screens/report/reportOb.js",
    "app/WebFactory/scripts/screens/report/reportAPI.js",
    "app/WebFactory/scripts/screens/reportWrap/reportWrapOb.js",

    # unit
    "scripts/observer/units/unit.js",
    "scripts/observer/units/I_PUnits.js",
    "scripts/observer/units/SIUnits.js",

    filters=filter_with_babel,
    output='gen/web_factory_ob_report_js_bundle.js'))


# web factory preview bundled js
assets.register('code_editor_js_bundle', Bundle(
    "scripts/lib/codemirror/lib/codemirror.js",
    "scripts/lib/codemirror/mode/xml/xml.js",
    "scripts/lib/codemirror/mode/css/css.js",
    "scripts/lib/codemirror/mode/javascript/javascript.js",

    "scripts/lib/codemirror/mode/htmlmixed/htmlmixed.js",

    "app/WebFactory/scripts/modals/codeEditorModal/codeEditorModal.js",

    output='gen/code_editor_js_bundle.js'))


if True:
    print('start packing')
    log = logging.getLogger('webassets')
    log.addHandler(logging.StreamHandler())
    log.setLevel(logging.DEBUG)
    cmdenv = CommandLineEnvironment(assets, log)
    cmdenv.build()
    print('generate package sucessful!')

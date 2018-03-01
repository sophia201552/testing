import logging
from beopWeb import app
from flask.ext.assets import Environment, Bundle
from webassets.script import CommandLineEnvironment

assets = Environment(app)
assets.debug = app.config.get('ASSETS_DEBUG')
assets.manifest = False
assets.cache = False
assets.auto_build = False
assets.init_app(app)

# js assets
assets.register('js_tool', Bundle(
    # min
    "scripts/lib/jquery-2.1.4.js",
    "scripts/lib/bootstrap/responsive-nav/responsive-nav.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/rangeSlider/js/ion.rangeSlider.js",
    # "scripts/lib/effects/three.min.js",
    "scripts/lib/mathquill/mathquill.min.js",

    "scripts/lib/echart/echarts-all.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",

    "scripts/lib/beopNotification/infoBox.js",
    output='gen/js_tool.js'))

assets.register('js_index', Bundle(
    "scripts/lib/bootstrap-wysiwyg.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",

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
    "scripts/admin/versionHistory.js",
    "scripts/index.js",
    "scripts/admin/allMessages.js",
    "scripts/core/pyFormat.js",
    "scripts/core/beopMap.js",
    "scripts/core/baseMap.js",
    "scripts/admin/benchmark/dataRange.js",
    "scripts/core/eventAdapter.js",
    "scripts/core/screenManager.js",

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
    "scripts/observer/widgets/pointManager.js",
    "scripts/observer/widgets/alarmLogging.js",
    "scripts/observer/widgets/dataSourceAdd.js",
    "scripts/observer/widgets/dataSource.js",
    "scripts/observer/widgets/modalConfigurePane.js",
    "scripts/observer/widgets/shareLogging.js",
    "scripts/observer/diagnosis/diagnosisConfig.js",
    "scripts/observer/widgets/temperatureSetting.js",
    "scripts/observer/widgets/dataCalcFilter.js",
    "scripts/observer/widgets/modalAppendPointToDs.js",
    "scripts/observer/widgets/modalInteractCfgPanel.js",

    "scripts/observer/observerScreen.js",
    "scripts/observer/analysisScreen.js",
    "scripts/observer/analysis/analysisModel.js",
    "scripts/observer/analysis/analysisTemplate.js",
    "scripts/observer/analysis/centerSliderPanel.js",
    "scripts/observer/analysis/leftSliderPanel.js",
    "scripts/observer/analysis/workspacePanel.js",
    "scripts/observer/analysis/templatePanel.js",

    "scripts/observer/energyScreen.js",
    "scripts/observer/reportScreen.js",
    "scripts/observer/diagnosisScreen.js",
    "scripts/dataCenter3D/DataCenter3D.js",

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
    "scripts/admin/paneProjectCreator.js",
    "scripts/admin/paneProjectConfigure.js",
    "scripts/admin/menuConfigure.js",
    "scripts/admin/benchmark/benchmarkConfigure.js",
    "scripts/admin/benchmark/benchMark.js",
    "views/theme/dark.js",


    filters=app.config['ASSETS_JS_FILTER'],
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
    "scripts/observer/analysis/enerties/anlzCluster.js",
    "scripts/observer/analysis/enerties/anlzEnergy.js",

    # dashboard
    "scripts/spring/core/base.js",
    "scripts/spring/core/modalNone.js",
    "scripts/spring/core/modalAnalysis.js",
    "scripts/spring/entities/modalConfig.js",
    "scripts/spring/entities/modalChart.js",
    "scripts/spring/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalCarbonFootprint.js",
    "scripts/spring/entities/modalWeather.js",
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
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalChartCustom.js",
    "scripts/spring/entities/modalPointKPI.js",
    "scripts/spring/entities/modalPointKpiGrid.js",
    "scripts/spring/entities/modalReportChapter.js",
    "scripts/spring/entities/modalInteract.js",

    # workflow
    "scripts/workflow2.0/workflowInsert.js",
    "scripts/workflow2.0/workflowRemind.js",
    "scripts/workflow2.0/wf.apiMap.js",
    "scripts/workflow2.0/wf.data.js",
    "scripts/workflow2.0/wf.fake.js",
    "scripts/workflow2.0/wf.debug.js",
    "scripts/workflow2.0/wf.eventPubsub.js",
    "scripts/workflow2.0/wf.util.js",
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
    "scripts/workflow2.0/wf.view.taskDetail.js",
    "scripts/workflow2.0/wf.view.faultCurve.js",
    "scripts/workflow2.0/wf.view.replyList.js",
    "scripts/workflow2.0/wf.view.progress.js",
    "scripts/workflow2.0/wf.view.groupEdit.js",
    "scripts/workflow2.0/wf.view.menu.groupList.js",
    "scripts/workflow2.0/wf.view.menu.labelList.js",
    "scripts/workflow2.0/wf.view.taskTeam.js",
    "scripts/workflow2.0/wf.view.teamProcess.js",
    "scripts/workflow2.0/workflowCalendar.js",
    "scripts/workflow2.0/wf.main.js",
    "scripts/workflow2.0/taskPool.js",
    "scripts/workflow2.0/wf.fileUpload.js",

    # pagescreen
    "app/WebFactory/scripts/lib/konva/konva.js",

    # core
    "app/WebFactory/scripts/core/comm.js",
    "app/WebFactory/scripts/core/core.js",

    # mixins
    "app/WebFactory/scripts/screens/page/mixins//canvasWidgetMixin.js",
    "app/WebFactory/scripts/screens/page/mixins//htmlWidgetMixin.js",

    # observer widgets
    "app/WebFactory/scripts/screens/page/widgets/factory/widget.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasLine.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasCircle.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasRect.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasImage.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipeShape.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipe.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlButton.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlText.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlScreenContainer.js",
    
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasImage.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasPipe.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasPipeShape.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/htmlContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/htmlScreenContainer.js",

    # painter
    "app/WebFactory/scripts/screens/page/painter/gUtil.js",
    "app/WebFactory/scripts/screens/page/painter/gStage.js",
    "app/WebFactory/scripts/screens/page/painter/gCanvasStage.js",
    "app/WebFactory/scripts/screens/page/painter/gHtmlStage.js",
    "app/WebFactory/scripts/screens/page/painter/gLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gBgLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gPreviewBgLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gHtmlLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gCommLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gPreviewPainter.js",

    # page
    "app/WebFactory/scripts/screens/page/pageOb.js",
    "app/WebFactory/scripts/screens/dashboard/dashboardOb.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_screen.js'))

assets.register('js_share-dashboard', Bundle(
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap-wysiwyg.js",
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

    "scripts/spring/core/base.js",
    "scripts/spring/core/modalNone.js",
    "scripts/spring/core/modalAnalysis.js",
    "scripts/spring/entities/modalChart.js",
    "scripts/spring/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalCarbonFootprint.js",
    "scripts/spring/entities/modalWeather.js",
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
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalChartCustom.js",
    "scripts/spring/entities/modalPointKpiGrid.js",
    "scripts/spring/entities/modalPointKPI.js",
    "scripts/spring/entities/modalReportChapter.js",
    "scripts/spring/entities/modalInteract.js",

    "scripts/observer/analysis/enerties/anlzBase.js",
    "scripts/observer/analysis/enerties/anlzChart.js",
    "scripts/observer/analysis/enerties/anlzHistoryCompare.js",
    "scripts/observer/analysis/enerties/anlzScatter.js",
    "scripts/observer/analysis/enerties/anlzSpectrum.js",
    "scripts/observer/analysis/enerties/anlzTendency.js",
    "scripts/observer/analysis/enerties/anlzStack.js",
    "scripts/observer/analysis/enerties/anlzCluster.js",
    "scripts/observer/analysis/enerties/anlzEnergy.js",
    "scripts/observer/widgets/dataSource.js",
    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_share-dashboard.js'))

assets.register('js_temperature_tools', Bundle(
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/rangeSlider/js/ion.rangeSlider.js",
    "scripts/lib/hammer/hammer.min.js",
    "scripts/lib/hammer/jquery.hammer.js",
    "app/MobileCommon/scripts/mobileCommon.js",
    "app/MobileCommon/scripts/router.js",
    "app/MobileCommon/scripts/toggle.js",
    "scripts/lib/echart/echarts-all.js",

    output='gen/js_temperature_tools.js'))

assets.register('js_temperature', Bundle(
    "scripts/lib/spin.js",

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

    "app/temperatureControl/scripts/index.js",
    "app/temperatureControl/scripts/admin/adminConfigure.js",
    "app/temperatureControl/scripts/admin/projectSel.js",
    "app/temperatureControl/scripts/admin/historyChart.js",
    "app/temperatureControl/scripts/admin/controllers.js",
    "app/temperatureControl/scripts/observer/observerScreen.js",
    "app/temperatureControl/scripts/observer/widgets/observerMap.js",
    "app/temperatureControl/scripts/observer/widgets/observerEquip.js",

    "app/temperatureControl/scripts/config/schedule.js",
    "app/temperatureControl/scripts/config/mode.js",
    "app/temperatureControl/scripts/config/newsCenter.js",

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
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/rangeSlider/js/ion.rangeSlider.js",
    "scripts/lib/echart/echarts-all.js",
    # "scripts/lib/hammer/hammer.min.js",
    # "scripts/lib/hammer/jquery.hammer.js",
    "scripts/lib/spin.js",
    "scripts/lib/zepto/zepto.js",
    "scripts/lib/zepto/event.js",
    # "scripts/lib/zepto/gesture.js",
    "scripts/lib/zepto/touch.js",

    output='gen/js_mobile_tool.js'))

assets.register('js_dashboard', Bundle(
    "scripts/core/screenManager.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/cache/drivers/indexedDB.js",
    "scripts/core/cache/drivers/localStorage.js",
    "scripts/core/cache/baseCache.js",
    "scripts/core/eventAdapter.js",
    "scripts/i18n/i18n.js",
    "scripts/observer/reportScreen.js",
    # index
    "app/dashboard/scripts/index.js",
    "app/dashboard/scripts/core/toggle.js",
    "app/dashboard/scripts/core/mobileCommon.js",
    "app/dashboard/scripts/core/router.js",
    "app/dashboard/scripts/core/baseMap.js",
    "app/dashboard/scripts/core/beopMap.js",
    "app/dashboard/scripts/core/selectPage.js",
    # project
    "app/dashboard/scripts/project/projectSummary.js",
    "app/dashboard/scripts/project/projectReport.js",
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
    "scripts/observer/analysis/enerties/anlzCluster.js",
    "scripts/observer/analysis/enerties/anlzEnergy.js",
    # dashboard
    "scripts/spring/core/base.js",
    "scripts/spring/core/modalNone.js",
    "scripts/spring/core/modalAnalysis.js",
    "scripts/spring/entities/modalConfig.js",
    "scripts/spring/entities/modalChart.js",
    "scripts/spring/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalCarbonFootprint.js",
    "scripts/spring/entities/modalWeather.js",
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
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalChartCustom.js",
    "scripts/spring/entities/modalPointKPI.js",
    "scripts/spring/entities/modalPointKpiGrid.js",
    "scripts/spring/entities/modalReportChapter.js",
    "scripts/spring/entities/modalInteract.js",
    # message
    "app/dashboard/scripts/message/messageIndex.js",
    "app/dashboard/scripts/message/messageWorkflow.js",
    "app/dashboard/scripts/message/messageReport.js",
    # workflow
    "app/dashboard/scripts/workflow/workflowList.js",
    "app/dashboard/scripts/workflow/workflowAdd.js",
    "app/dashboard/scripts/workflow/workflowDetail.js",
    # configure
    "app/dashboard/scripts/admin/adminConfig.js",

    filters=app.config['ASSETS_JS_FILTER'],
    output='gen/js_dashboard.js'))

assets.register('js_report_detail', Bundle(
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/echart/echarts-all.js",
    "scripts/i18n/i18n.js",
    "scripts/report/index.js",
    "scripts/core/common.js",
    "scripts/observer/reportScreen.js",

    output='gen/js_report.js'))

assets.register('js_cx_tool_point_table', Bundle(
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/workflow2.0/jquery.twbsPagination.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "app/CxTool/scripts/lib/chosen.jquery.min.js",
    "app/CxTool/scripts/lib/pikaday.js",
    "app/CxTool/scripts/lib/moment.js",
    "app/CxTool/scripts/lib/ZeroClipboard.js",
    "app/CxTool/scripts/lib/handsontable.js",
    "app/CxTool/scripts/lib/path.min.js",

    "scripts/lib/echart/echarts-all.js",

    "scripts/core/permission.js",

    "scripts/core/webAPI.js",
    "scripts/lib/spin.js",
    "scripts/i18n/i18n.js",
    "app/CxTool/scripts/pointTable/toolsHistoryChart.js",
    "scripts/core/common.js",
    "app/CxTool/scripts/apiMap.js",
    "scripts/workflow2.0/wf.data.js",
    "scripts/workflow2.0/wf.debug.js",
    "scripts/workflow2.0/wf.eventPubsub.js",
    "scripts/workflow2.0/wf.util.js",

    "app/CxTool/scripts/util.js",
    "app/CxTool/scripts/ws.js",
    "app/CxTool/scripts/pointTable/model.js",
    "app/CxTool/scripts/pointTable/pt_view_login.js",
    "app/CxTool/scripts/pointTable/pt_view_sheet.js",
    "app/CxTool/scripts/pointTable/pt_cloud_sheet.js",
    "app/CxTool/scripts/pointTable/pt_view_point_type.js",
    "app/CxTool/scripts/pointTable/pt_view_name_set.js",
    "app/CxTool/scripts/pointTable/pt_view_server_manage.js",
    "app/CxTool/scripts/pointTable/pt_view_engine_debuging.js",
    "app/CxTool/scripts/pointTable/pt_view_operation_record.js",
    "app/CxTool/scripts/pointTable/pt_point_mapping.js",
    "app/CxTool/scripts/pointTable/pt_view_real_time_data.js",
    "app/CxTool/scripts/pointTable/pt_auto_mapping.js",
    "app/CxTool/scripts/pointTable/pt_auto_mapping_result.js",
    "app/CxTool/scripts/main.js",

    output='gen/js_cx_tool_point_table.js'))

# web factory bundled js
assets.register('web_factory_js_bundle', Bundle(
    # third-party library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/mathquill/mathquill.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/echart/echarts-all.js",
    "app/WebFactory/scripts/lib/dockspawn/js/dockspawn.js",
    "app/WebFactory/scripts/lib/konva/konva.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "scripts/lib/ueditor/ueditor.config.js",
    "scripts/lib/ueditor/ueditor.all.js",

    # beop library
    "scripts/i18n/i18n.js",
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/eventAdapter.js",
    "views/theme/dark.js",

    # factory library
    "app/WebFactory/scripts/core/comm.js",
    "app/WebFactory/scripts/core/core.js",
    "app/WebFactory/scripts/core/diff.js",
    
    # datasource
    "scripts/observer/widgets/dataSource.js",
    "scripts/iot/hierFilter.js",
    "scripts/iot/config/addThing.js",
    
    # factory sync worker
    "app/WebFactory/scripts/core/syncWorker.js",

    # mixins
    "app/WebFactory/scripts/screens/page/mixins/canvasWidgetMixin.js",
    "app/WebFactory/scripts/screens/page/mixins/htmlWidgetMixin.js",

    # panels
    "app/WebFactory/scripts/panels/pagePanel.js",
    "app/WebFactory/scripts/panels/dataSourcePanel.js",
    "app/WebFactory/scripts/screens/page/panels/layerPanel.js",
    "app/WebFactory/scripts/screens/page/panels/propertyPanel.js",
    "app/WebFactory/scripts/screens/page/panels/historyPanel.js",
    "app/WebFactory/scripts/screens/dashboard/panels/modulePanel.js",

    # factory widgets
    "app/WebFactory/scripts/screens/page/widgets/factory/widget.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasLine.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasCircle.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasRect.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasImage.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipeShape.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipe.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlButton.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlText.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlScreenContainer.js",

    # toolbar
    "app/WebFactory/scripts/screens/page/toolbar/toolbar.js",
    "app/WebFactory/scripts/screens/page/toolbar/tBase.js",
    "app/WebFactory/scripts/screens/page/toolbar/tPointer.js",
    "app/WebFactory/scripts/screens/page/toolbar/tHand.js",
    "app/WebFactory/scripts/screens/page/toolbar/tShape.js",
    "app/WebFactory/scripts/screens/page/toolbar/tHtml.js",
    "app/WebFactory/scripts/screens/page/toolbar/tText.js",
    "app/WebFactory/scripts/screens/page/toolbar/tButton.js",
    "app/WebFactory/scripts/screens/page/toolbar/tImage.js",
    "app/WebFactory/scripts/screens/page/toolbar/tPipe.js",
    "app/WebFactory/scripts/screens/page/toolbar/tZoomSelect.js",
    "app/WebFactory/scripts/screens/page/toolbar/tProjectMaterial.js",
    "app/WebFactory/scripts/screens/page/toolbar/tScreen.js",
    "app/WebFactory/scripts/screens/page/toolbar/tGridLine.js",
    "app/WebFactory/scripts/screens/page/toolbar/tLayout.js",

    # painter
    "app/WebFactory/scripts/screens/page/painter/gUtil.js",
    "app/WebFactory/scripts/screens/page/painter/gResizableRect.js",
    "app/WebFactory/scripts/screens/page/painter/gResizableLine.js",
    "app/WebFactory/scripts/screens/page/painter/gStage.js",
    "app/WebFactory/scripts/screens/page/painter/gCanvasStage.js",
    "app/WebFactory/scripts/screens/page/painter/gHtmlStage.js",
    "app/WebFactory/scripts/screens/page/painter/gLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gBgLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gHtmlLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gCommLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gPainter.js",

    # widgets property
    "app/WebFactory/scripts/screens/page/widgets/props/widgetProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasImageProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasPipeProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/htmlContainerProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/htmlButtonProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/htmlTextProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/bgProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/htmlScreenContainerProp.js",

    # history
    "app/WebFactory/scripts/screens/page/history/historyController.js",

    # modals
    "app/WebFactory/scripts/modals/addProject/addProject.js",
    "app/WebFactory/scripts/modals/removeProject/removeProject.js",
    "app/WebFactory/scripts/modals/importProjectModal/importProjectModal.js",
    "app/WebFactory/scripts/modals/pageEditModal/pageEditModal.js",
    "scripts/core/pyFormat.js",
    "scripts/workflow2.0/wf.util.js",
    "scripts/workflow2.0/wf.view.memberSelected.js",
    "app/WebFactory/scripts/modals/memberSelectedModal/memberSelectedModal.js",
    # page modals
    "app/WebFactory/scripts/screens/page/modals/editorModal/editorModal.js",
    "app/WebFactory/scripts/screens/page/modals/materialModal/materialModal.js",
    "app/WebFactory/scripts/screens/page/modals/releaseModal/releaseModal.js",
    "app/WebFactory/scripts/screens/page/modals/templateEditorModal/templateEditorModal.js",
    "app/WebFactory/scripts/screens/page/modals/templateBatchEditorModal/templateBatchEditorModal.js",

    # page screen
    "app/WebFactory/scripts/screens/page/page.js",

    # factory enterance
    "app/WebFactory/scripts/factory.js",
    "app/WebFactory/scripts/factoryTpl.js",

    # login + welcome page
    "app/WebFactory/scripts/template.js",
    "app/WebFactory/scripts/login.js",

    output='gen/web_factory_js_index.js'))

# web factory dashboard bundled js
assets.register('web_factory_dashboard_js_bundle', Bundle(
    # datatimepicker
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",

    "scripts/spring/factoryIoC.js",

    "scripts/observer/widgets/modalConfigurePane.js",

    # dashboard
    "scripts/spring/core/base.js",
    "scripts/spring/core/modalNone.js",
    "scripts/spring/core/modalAnalysis.js",
    "scripts/spring/entities/modalConfig.js",
    "scripts/spring/entities/modalChart.js",
    "scripts/spring/entities/modalHistoryChart.js",
    "scripts/spring/entities/modalCarbonFootprint.js",
    "scripts/spring/entities/modalWeather.js",
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
    "scripts/spring/entities/modalHtml.js",
    "scripts/spring/entities/modalChartCustom.js",
    "scripts/spring/entities/modalPointKPI.js",
    "scripts/spring/entities/modalPointKpiGrid.js",
    "scripts/spring/entities/modalReportChapter.js",
    "scripts/spring/entities/modalInteract.js",

    "app/WebFactory/scripts/screens/dashboard/dashboard.js",

    output='gen/web_factory_dashboard_js_bundle.js'))

# web factory report bundled js
assets.register('web_factory_report_js_bundle', Bundle(

    "app/WebFactory/scripts/screens/report/panels/reportModulePanel.js",
    "app/WebFactory/scripts/screens/report/panels/reportTplPanel.js",
    "app/WebFactory/scripts/screens/report/panels/reportTplParamsPanel.js",
    "app/WebFactory/scripts/screens/reportWrap/panels/reportConfigPanel.js",

    "app/WebFactory/scripts/screens/report/components/component.js",
    "app/WebFactory/scripts/screens/report/components/base.js",
    
    "app/WebFactory/scripts/screens/report/components/container/container.js",

    "app/WebFactory/scripts/screens/report/components/chapterContainer/chapterContainer.js",
    "app/WebFactory/scripts/screens/report/components/chapterContainer/chapterContainerConfigModal.js",
    "app/WebFactory/scripts/screens/report/components/chapterContainer/reportTplParamsConfigModal.js",

    "app/WebFactory/scripts/screens/report/components/chart/chart.js",
    "app/WebFactory/scripts/screens/report/components/chart/chartConfigModal.js",

    "app/WebFactory/scripts/screens/report/components/html/html.js",
    "app/WebFactory/scripts/screens/report/components/html/htmlConfigModal.js",

    "app/WebFactory/scripts/screens/report/components/summary/summary.js",

    "app/WebFactory/scripts/screens/report/report.js",
    # report template screen
    "app/WebFactory/scripts/screens/report/reportTpl.js",
    "app/WebFactory/scripts/screens/reportWrap/reportWrap.js",

    output='gen/web_factory_report_js_bundle.js'))

# web factory preview bundled js
assets.register('web_factory_ob_js_bundle', Bundle(
    # third-party library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "app/WebFactory/scripts/lib/konva/konva.js",
    "scripts/lib/echart/echarts-all.js",
    "scripts/lib/spin.js",

    # beop library
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/eventAdapter.js",
    "scripts/i18n/i18n.js",
    "scripts/spring/factoryIoC.js",
    "views/theme/dark.js",

    "scripts/observer/widgets/dataSource.js",

    # factory library
    "app/WebFactory/scripts/core/comm.js",
    "app/WebFactory/scripts/core/core.js",

    # mixins
    "app/WebFactory/scripts/screens/page/mixins/canvasWidgetMixin.js",
    "app/WebFactory/scripts/screens/page/mixins/htmlWidgetMixin.js",

    # observer widgets
    "app/WebFactory/scripts/screens/page/widgets/factory/widget.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasLine.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasCircle.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasRect.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasImage.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasImage.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipeShape.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipe.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasPipe.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/htmlContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlButton.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlText.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlScreenContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/htmlScreenContainer.js",

    # painter
    "app/WebFactory/scripts/screens/page/painter/gUtil.js",
    "app/WebFactory/scripts/screens/page/painter/gStage.js",
    "app/WebFactory/scripts/screens/page/painter/gCanvasStage.js",
    "app/WebFactory/scripts/screens/page/painter/gHtmlStage.js",
    "app/WebFactory/scripts/screens/page/painter/gLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gBgLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gPreviewBgLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gHtmlLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gCommLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gPreviewPainter.js",

    # page
    "app/WebFactory/scripts/screens/page/pageOb.js",
    "app/WebFactory/scripts/screens/dashboard/dashboardOb.js",

    # enterance
    "app/WebFactory/scripts/preview.js",

    output='gen/web_factory_ob_js_index.js'))

# web factory report bundled js
assets.register('web_factory_ob_report_js_bundle', Bundle(

    "app/WebFactory/scripts/screens/report/components/component.js",
    "app/WebFactory/scripts/screens/report/components/base.js",
    "app/WebFactory/scripts/screens/report/components/container/container.js",
    "app/WebFactory/scripts/screens/report/components/chapterContainer/chapterContainer.js",  
    "app/WebFactory/scripts/screens/report/components/chart/chart.js",
    "app/WebFactory/scripts/screens/report/components/html/html.js",

    "app/WebFactory/scripts/screens/report/reportOb.js",
    "app/WebFactory/scripts/screens/reportWrap/reportWrapOb.js",

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

# asset bundled js
assets.register('asset_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "app/WebFactory/scripts/lib/dockspawn/js/dockspawn.js",
    "scripts/lib/echart/echarts-all.js",

    "scripts/core/common.js",
    "scripts/core/webAPI.js",

    "scripts/iot/iotFilter.js",
    "scripts/iot/hierFilter.js",
    "scripts/iot/config/addThing.js",

    "scripts/workflow2.0/workflowInsert.js",

    "app/Asset/scripts/equipments/basicInfo.js",
    "app/Asset/scripts/equipments/diagnosisRecord.js",
    "app/Asset/scripts/equipments/fileManagement.js",
    "app/Asset/scripts/equipments/maintenanceRecord.js",
    "app/Asset/scripts/equipments/nameplateInfo.js",
    "app/Asset/scripts/equipments/realtimeData.js",
    "app/Asset/scripts/equipments/workOrder.js",

    "app/Asset/scripts/panels/assetListPanel.js",
    "app/Asset/scripts/panels/assetInfoPanel.js",

    "app/Asset/scripts/screens/assetScreen.js",

    "app/Asset/scripts/equipments/nameplateInfo.js",
    output='gen/asset_js_index.js'))

# asset bundled js
assets.register('patrol_js_bundle', Bundle(
    # library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/spin.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "scripts/lib/sha1.js",
    "scripts/lib/qrcode.js",
    "scripts/lib/jquery.qrcode.js",

    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/lib/beopNotification/infoBox.js",

    "app/Patrol/scripts/screens/patrolPath.js",
    "app/Patrol/scripts/screens/patrolPoint.js",
    "app/Patrol/scripts/screens/patrolPerson.js",
    "app/Patrol/scripts/screens/patrolReport.js",
    "app/Patrol/scripts/screens/patrolSchedule.js",
    "app/Patrol/scripts/screens/patrolScreen.js",


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
    "app/PatrolApp/scripts/core/toggle.js",
    "app/PatrolApp/scripts/core/mobileCommon.js",
    "app/PatrolApp/scripts/core/router.js",
    "app/PatrolApp/scripts/core/patrolAppCommon.js",

    #screen
    "app/PatrolApp/scripts/screen/updateScreen.js",
    "app/PatrolApp/scripts/screen/userSelScreen.js",
    "app/PatrolApp/scripts/screen/pathSelScreen.js",
    "app/PatrolApp/scripts/screen/missionSelScreen.js",
    "app/PatrolApp/scripts/screen/pointScreen.js",
    "app/PatrolApp/scripts/screen/pointErrScreen.js",
    "app/PatrolApp/scripts/screen/missionResultScreen.js",
    "app/PatrolApp/scripts/screen/adminConfigure.js",

    output='gen/patrol_app_js_index.js'))

# css assets
assets.register('css_index', Bundle(
    "scripts/lib/rangeSlider/css/ion.rangeSlider.css",
    "scripts/lib/rangeSlider/css/ion.rangeSlider.skinNice.css",
    # 'content/font-awesome.css',
    'scripts/lib/bootstrap/responsive-nav/responsive-nav.css',
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    # beop自定义IconFont
    'fonts/beopIconFont/iconfont.css',

    'scripts/lib/mathquill/mathquill.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',
    "content/index.css",
    "content/workflow.css",
    'app/WebFactory/themes/default/css/widget.css',

    'scripts/lib/beopNotification/infoBox.css',

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

assets.register('css_dashboard', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_dashboard.css'))

assets.register('css_report_detail', Bundle(
    'scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    "content/index.css",
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_report.css'))

assets.register('css_cx_tool_point_table', Bundle(
    'app/CxTool/css/lib/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'app/CxTool/css/lib/chosen.css',
    'app/CxTool/css/lib/handsontable.css',
    'app/CxTool/css/lib/pikaday.css',
    'app/CxTool/css/common.css',
    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/css_cx_tool_point_table.css'))

# web factory bundled css
assets.register('web_factory_css_bundle', Bundle(
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

    'app/WebFactory/scripts/lib/dockspawn/css/dock-manager.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',
    'fonts/beopIconFont/iconfont.css',
    'scripts/lib/mathquill/mathquill.css',
    'app/WebFactory/themes/default/css/main.css',
    'app/WebFactory/themes/default/css/widget.css',
    'scripts/lib/beopNotification/infoBox.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/web_factory_css_bundle.css'))

# web factory bundled css
assets.register('web_factory_ob_css_bundle', Bundle(
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',

    'app/WebFactory/scripts/lib/dockspawn/css/dock-manager.css',
    'app/WebFactory/themes/default/css/main.css',
    'app/WebFactory/themes/default/css/widget.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/web_factory_ob_css_bundle.css'))

# code editor bundled css
assets.register('code_editor_css_bundle', Bundle(
    'scripts/lib/codemirror/lib/codemirror.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/code_editor_css_bundle.css'))

# asset bundled css
assets.register('asset_css_bundle', Bundle(
    'app/WebFactory/scripts/lib/dockspawn/css/dock-manager.css',
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',

    'app/Asset/themes/default/css/main.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/asset_css_bundle.css'))

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

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/patrol_app_css_bundle.css'))

if app.config['Condition'] == 10:
    print('start packing')
    log = logging.getLogger('webassets')
    log.addHandler(logging.StreamHandler())
    log.setLevel(logging.DEBUG)
    cmdenv = CommandLineEnvironment(assets, log)
    cmdenv.build()
    print('generate package sucessful!')


"""
js/css bundle
"""

from beopWeb import app
from beopWeb.bundle import assets, filter_with_babel
from flask_assets import Bundle

# web factory bundled js
assets.register('web_factory_js_bundle', Bundle(
    # third-party library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/mathquill/mathquill.min.js",
    "scripts/lib/bootstrap/js/bootstrap.min.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/lib/echart/echarts-all.js",
    "scripts/lib/ueditor/ueditor.config.js",
    "scripts/lib/ueditor/ueditor.all.js",
    "scripts/lib/spin.js",
    "scripts/lib/socket.io/socket.io.min.js",

    "app/WebFactory/scripts/lib/dockspawn/js/dockspawn.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "scripts/lib/moment/moment.min.js",

    # beop library
    "scripts/core/baseMap.js",
    "scripts/lib/widgets/validator.js",
    "scripts/i18n/i18n.js",
    "scripts/lib/beopNotification/infoBox.js",
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/eventAdapter.js",
    "views/theme/dark.js",

    #config modal
    "scripts/core/configWidget/configModal.js",
    "scripts/core/configWidget/baseConfigWidget.js",
    "scripts/core/configWidget/baseOptionWidget.js",
    "scripts/core/configWidget/baseDataWidget.js",
    "scripts/core/configWidget/baseFooterWidget.js",
    "scripts/core/configWidget/baseConfigModule.js",

    # factory library
    "app/WebFactory/scripts/core/comm.js",
    "app/WebFactory/scripts/core/core.js",
    "app/WebFactory/scripts/core/diff.js",

    # datasource
    "scripts/dataManage/dm.utils.js",
    "scripts/dataManage/dm.tag.panel.js",
    "scripts/dataManage/dm.model.js",
    "scripts/dataManage/dm.tag.external.tree.js",
    "scripts/dataManage/dm.tag.tree.js",
    "scripts/observer/widgets/dataSource.js",
    "scripts/iot/hierFilter.js",
    "scripts/iot/config/addThing.js",

    # panels
    "app/WebFactory/scripts/panels/pagePanel.js",
    "app/WebFactory/scripts/panels/dataSourcePanel.js",

    # modals
    "app/WebFactory/scripts/modals/addProject/addProject.js",
    "app/WebFactory/scripts/modals/removeProject/removeProject.js",
    "app/WebFactory/scripts/modals/importProjectModal/importProjectModal.js",
    "app/WebFactory/scripts/modals/pageEditModal/pageEditModal.js",
    "app/WebFactory/scripts/modals/bgModal/bgProp.js",
    "app/WebFactory/scripts/modals/mergeNavModal/mergeNavModal.js",
    "scripts/core/pyFormat.js",
    "scripts/workflow2.0/wf.view.memberSelected.js",
    "app/WebFactory/scripts/modals/memberSelectedModal/memberSelectedModal.js",

    # factory enterance
    "app/WebFactory/scripts/factory.js",
    "app/WebFactory/scripts/factoryTpl.js",

    # login + welcome page
    "app/WebFactory/scripts/login.js",

    # reload auth validate
    "scripts/loginValidate.js",

    output='gen/web_factory_js_index.js'))

assets.register('web_factory_page_js_bundle', Bundle(
    # library
    "app/WebFactory/scripts/lib/konva/konva.js",

    # factory sync worker
    "app/WebFactory/scripts/core/syncWorker.js",

    # page panels
    "app/WebFactory/scripts/screens/page/panels/layerPanel.js",
    "app/WebFactory/scripts/screens/page/panels/propertyPanel.js",
    "app/WebFactory/scripts/screens/page/panels/historyPanel.js",

    # mixins
    "app/WebFactory/scripts/screens/page/mixins/canvasWidgetMixin.js",
    "app/WebFactory/scripts/screens/page/mixins/htmlWidgetMixin.js",

    # factory widgets
    "app/WebFactory/scripts/screens/page/widgets/factory/widget.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlWidget.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasLine.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasCircle.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasRect.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasText.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasImage.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipeShape.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipe.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasHeatC.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasHeat.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasHeatP.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPolygon.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasDevice.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasCustomLineShape.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasCustomLine.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlButton.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlDashboard.js",
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
    "app/WebFactory/scripts/screens/page/toolbar/tHtmlText.js",
    "app/WebFactory/scripts/screens/page/toolbar/tButton.js",
    "app/WebFactory/scripts/screens/page/toolbar/tImage.js",
    "app/WebFactory/scripts/screens/page/toolbar/tPipe.js",
    "app/WebFactory/scripts/screens/page/toolbar/tZoomSelect.js",
    "app/WebFactory/scripts/screens/page/toolbar/tProjectMaterial.js",
    "app/WebFactory/scripts/screens/page/toolbar/tScreen.js",
    "app/WebFactory/scripts/screens/page/toolbar/tGridLine.js",
    "app/WebFactory/scripts/screens/page/toolbar/tLayout.js",
    "app/WebFactory/scripts/screens/page/toolbar/tDevice.js",
    "app/WebFactory/scripts/screens/page/toolbar/tHeatP.js",
    "app/WebFactory/scripts/screens/page/toolbar/tHeat.js",
    "app/WebFactory/scripts/screens/page/toolbar/tHtmlTpl.js",
    "app/WebFactory/scripts/screens/page/toolbar/tPolygon.js",
    "app/WebFactory/scripts/screens/page/toolbar/tCustomLine.js",

    # painter
    "app/WebFactory/scripts/screens/page/painter/gUtil.js",
    "app/WebFactory/scripts/screens/page/painter/gResizableRect.js",
    "app/WebFactory/scripts/screens/page/painter/gResizableLine.js",
    "app/WebFactory/scripts/screens/page/painter/gResizablePolygon.js",
    "app/WebFactory/scripts/screens/page/painter/gStage.js",
    "app/WebFactory/scripts/screens/page/painter/gCanvasStage.js",
    "app/WebFactory/scripts/screens/page/painter/gHtmlStage.js",
    "app/WebFactory/scripts/screens/page/painter/gLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gPainter.js",

    # widgets property
    "app/WebFactory/scripts/screens/page/widgets/props/widgetProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasImageProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasPipeProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasHeatProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasHeatPProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasPolygonProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasTextProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasCustomLineProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/htmlContainerProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/htmlButtonProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/canvasDeviceProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/htmlTextProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/htmlScreenContainerProp.js",
    "app/WebFactory/scripts/screens/page/widgets/props/htmlDashboardProp.js",

    # history
    "app/WebFactory/scripts/screens/page/history/historyController.js",

    # page modals
    "app/WebFactory/scripts/screens/page/modals/editorModal/editorModal.js",
    "app/WebFactory/scripts/screens/page/modals/addByTplModal/addByTplModal.js",
    "app/WebFactory/scripts/screens/page/modals/materialModal/materialModal.js",
    "app/WebFactory/scripts/screens/page/modals/configTplModal/configTplModal.js",
    "app/WebFactory/scripts/screens/page/modals/releaseModal/releaseModal.js",
    "app/WebFactory/scripts/screens/page/modals/templateEditorModal/templateEditorModal.js",
    "app/WebFactory/scripts/screens/page/modals/templateBatchEditorModal/templateBatchEditorModal.js",

    # page screen
    "app/WebFactory/scripts/screens/page/page.js",

    output='gen/web_factory_page_js_bundle.js'))

# web factory dashboard bundled js
assets.register('web_factory_dashboard_js_bundle', Bundle(
    "scripts/spring/factoryIoC.js",

    "scripts/observer/widgets/modalConfigurePane.js",
    "scripts/observer/diagnosis/diagnosisInfo.js",
    "scripts/observer/diagnosis/diagnosisLogHistory.js",
    "scripts/observer/diagnosis/diagnosisROI.js",
    "scripts/observer/diagnosis/diagnosisNav.js",

    "scripts/observer/widgets/modalWiki.js",

    # panels
    "app/WebFactory/scripts/screens/dashboard/panels/modulePanel.js",

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
    "scripts/spring/entities/modalReportFactory.js",
    "scripts/spring/entities/modalInteract.js",
    "scripts/spring/entities/modalMobile.js",
    "scripts/spring/entities/modalAppKPICollect.js",
    "scripts/spring/entities/modalDataMonitorList.js",
    "scripts/spring/entities/modalDiagnosisPanel.js",
    "scripts/spring/entities/modalKpiOverview.js",
    "scripts/spring/entities/modalRealtimeWeather.js",
    "scripts/spring/entities/modalDiagnosisStruct.js",
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

    "scripts/observer/widgets/modalInteractCfgPanel.js",

    "app/WebFactory/scripts/screens/dashboard/dashboard.js",
    "app/WebFactory/scripts/screens/mobile/mobile.js",
    "app/Asset/scripts/panels/assetStatePanel.js",
    "app/Asset/scripts/widget/imgGallery.js",

    # unit get
    "scripts/observer/units/unit.js",
    "scripts/observer/units/I_PUnits.js",
    "scripts/observer/units/SIUnits.js",

    filters=filter_with_babel,
    output='gen/web_factory_dashboard_js_bundle.js'))

# web factory report bundled js
assets.register('web_factory_report_js_bundle', Bundle(
    "app/WebFactory/scripts/screens/report/config/chartThemeConfig.js",

    # panels
    "app/WebFactory/scripts/screens/report/panels/reportModulePanel.js",
    "app/WebFactory/scripts/screens/report/panels/reportTplPanel.js",
    "app/WebFactory/scripts/screens/report/panels/reportTplParamsPanel.js",
    "app/WebFactory/scripts/screens/reportWrap/panels/reportConfigPanel.js",

    # report 变量配置框
    "app/WebFactory/scripts/screens/report/modals/declareVariablesModal/declareVariablesModal.js",
    "app/WebFactory/scripts/screens/report/modals/layoutsConfigModal/layoutsConfigModal.js",

    # mixins
    "app/WebFactory/scripts/screens/report/mixins/variableProcessMixin.js",

    # 基类
    "app/WebFactory/scripts/screens/report/components/component.js",
    "app/WebFactory/scripts/screens/report/components/base.js",

    # 基础容器类
    "app/WebFactory/scripts/screens/report/components/container/container.js",

    # 报表容器类
    "app/WebFactory/scripts/screens/report/components/reportContainer/reportContainer.js",
    "app/WebFactory/scripts/screens/report/components/reportContainer/reportContainerConfigModal.js",

    # 章节容器类
    "app/WebFactory/scripts/screens/report/components/chapterContainer/chapterContainer.js",
    "app/WebFactory/scripts/screens/report/components/chapterContainer/chapterContainerConfigModal.js",
    "app/WebFactory/scripts/screens/report/components/chapterContainer/reportTplParamsConfigModal.js",

    # 图表类
    "app/WebFactory/scripts/screens/report/components/chart/chart.js",
    "app/WebFactory/scripts/screens/report/components/chart/chartConfigModal.js",

    # Html 类
    "app/WebFactory/scripts/screens/report/components/html/html.js",
    "app/WebFactory/scripts/screens/report/components/html/htmlConfigModal.js",

    # 汇总类
    "app/WebFactory/scripts/screens/report/components/summary/summary.js",

    # 自定义汇总类
    "app/WebFactory/scripts/screens/report/components/customSummary/customSummary.js",

    # 动态数据块类
    "app/WebFactory/scripts/screens/report/components/block/block.js",
    "app/WebFactory/scripts/screens/report/components/block/blockConfigModal.js",

    # 诊断数据块类
    "app/WebFactory/scripts/screens/report/components/diagnosisBlock/diagnosisBlock.js",

    # 数据块类
    "app/WebFactory/scripts/screens/report/components/dataBlock/dataBlock.js",

    # 表格类
    "app/WebFactory/scripts/screens/report/components/table/table.js",
    "app/WebFactory/scripts/screens/report/components/table/tableConfigModal.js",

    # 文本类
    "app/WebFactory/scripts/screens/report/components/text/text.js",

    # dashboard 控件类
    "app/WebFactory/scripts/screens/report/components/dashboardWidget/dashboardWidget.js",
    # "app/WebFactory/scripts/screens/report/components/dashboardWidget/dashboardWidgetConfigModal.js",

    "app/WebFactory/scripts/screens/report/report.js",
    "app/WebFactory/scripts/screens/report/reportAPI.js",
    # report template screen
    "app/WebFactory/scripts/screens/report/reportTpl.js",
    "app/WebFactory/scripts/screens/reportWrap/reportWrap.js",

    output='gen/web_factory_report_js_bundle.js'))

# web factory preview thirdparty bundled js
assets.register('web_factory_ob_thirdparty_js_bundle', Bundle(
    # third-party library
    "scripts/lib/jquery-2.1.4.min.js",
    "scripts/lib/bootstrap/js/bootstrap.js",
    "scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
    "app/WebFactory/scripts/lib/ztree/jquery.ztree.all-3.5.min.js",
    "scripts/lib/echart/echarts-all.js",

    output='gen/web_factory_ob_thirdparty_js_bundle.js'))

# web factory preview bundled js
assets.register('web_factory_ob_js_bundle', Bundle(
    # third-party library
    "scripts/lib/widgets/inputDatetime.js",
    "scripts/lib/spin.js",

    # beop library
    "scripts/core/common.js",
    "scripts/core/webAPI.js",
    "scripts/core/eventAdapter.js",
    "scripts/i18n/i18n.js",
    "scripts/spring/factoryIoC.js",
    "views/theme/dark.js",
    "scripts/dataManage/dm.utils.js",
    "scripts/dataManage/dm.tag.panel.js",
    "scripts/dataManage/dm.model.js",
    "scripts/dataManage/dm.tag.tree.js",
    "scripts/observer/widgets/dataSource.js",

    # factory library
    "app/WebFactory/scripts/core/comm.js",
    "app/WebFactory/scripts/core/core.js",

    # refresh load
    "scripts/loginValidate.js",

    filters=filter_with_babel,
    output='gen/web_factory_ob_js_index.js'))

# web factory page preview bundled js
assets.register('web_factory_ob_page_js_bundle', Bundle(
    # library
    "app/WebFactory/scripts/lib/konva/konva.js",

    # factory library
    "app/WebFactory/scripts/core/comm.js",
    "app/WebFactory/scripts/core/core.js",

    # mixins
    "app/WebFactory/scripts/screens/page/mixins/canvasWidgetMixin.js",
    "app/WebFactory/scripts/screens/page/mixins/htmlWidgetMixin.js",
    "app/WebFactory/scripts/screens/page/mixins/tooltipMixin.js",

    # observer widgets
    "app/WebFactory/scripts/screens/page/widgets/factory/widget.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlWidget.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasLine.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasCircle.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasRect.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasImage.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasImage.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipeShape.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPipe.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasHeatC.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasHeat.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasHeatP.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasPipe.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasPolygon.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasPolygon.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasText.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasText.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasCustomLineShape.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasCustomLine.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/htmlContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlButton.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/htmlButton.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/canvasDevice.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/canvasDevice.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlText.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/htmlText.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlScreenContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/htmlScreenContainer.js",
    "app/WebFactory/scripts/screens/page/widgets/factory/htmlDashboard.js",
    "app/WebFactory/scripts/screens/page/widgets/observer/htmlDashboard.js",

    # painter
    "app/WebFactory/scripts/screens/page/painter/gUtil.js",
    "app/WebFactory/scripts/screens/page/painter/gStage.js",
    "app/WebFactory/scripts/screens/page/painter/gCanvasStage.js",
    "app/WebFactory/scripts/screens/page/painter/gHtmlStage.js",
    "app/WebFactory/scripts/screens/page/painter/gLayer.js",
    "app/WebFactory/scripts/screens/page/painter/gPreviewPainter.js",

    # page
    "app/WebFactory/scripts/screens/page/pageOb.js",

    output='gen/web_factory_ob_page_js_bundle.js'))

# web factory dashboard preview bundled js
assets.register('web_factory_ob_dashboard_js_bundle', Bundle(
    "scripts/core/commonCanvas.js",
    "app/WebFactory/scripts/screens/dashboard/dashboardOb.js",
    "app/WebFactory/scripts/screens/mobile/mobileOb.js",
    "app/WebFactory/scripts/screens/page/mixins/tooltipMixin.js",

    filters=filter_with_babel,
    output='gen/web_factory_ob_dashboard_js_bundle.js'))

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

# web factory bundled css
assets.register('web_factory_css_bundle', Bundle(
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',

    'content/widget.css',

    'app/WebFactory/scripts/lib/dockspawn/css/dock-manager.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',
    'fonts/beopIconFont/iconfont.css',
    'scripts/lib/mathquill/mathquill.css',
    'app/WebFactory/themes/default/css/comm.css',
    'app/WebFactory/themes/default/css/main.css',
    'app/WebFactory/themes/default/css/widget.css',
    'app/WebFactory/themes/default/css/report.css',
    'scripts/lib/beopNotification/infoBox.css',
    'scripts/dataManage/contents/dm.tag.tree.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/web_factory_css_bundle.css'))

# web factory bundled css
assets.register('web_factory_ob_css_bundle', Bundle(
    'app/WebFactory/scripts/lib/bootstrap/css/bootstrap.min.css',
    'scripts/lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
    'app/WebFactory/scripts/lib/dockspawn/css/dock-manager.css',
    'app/WebFactory/scripts/lib/ztree/css/zTreeStyle.css',

    'content/widget.css',

    'app/WebFactory/themes/default/css/comm.css',
    'app/WebFactory/themes/default/css/report.css',
    'app/WebFactory/themes/default/css/widget.css',
    'fonts/beopIconFont/iconfont.css',
    'content/index-black.css',
    'content/report-black.css',
    "scripts/dataManage/contents/dm.tag.tree.css",

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/web_factory_ob_css_bundle.css'))

# code editor bundled css
assets.register('code_editor_css_bundle', Bundle(
    'scripts/lib/codemirror/lib/codemirror.css',

    filters=app.config['ASSETS_CSS_FILTER'],
    output='gen/code_editor_css_bundle.css'))


// build.js
// Compatible with CommonJS
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJs
        module.exports = factory;
    } else {
        // Browser
        root.buildConfig = factory;
    }
}(this, {
    // 'info', 'warn', 'error'('error' as default)
    log: 'warn',
    // 'exc', 'load'('load' as default)
    mode: 'load',
    // true, false(false as default)
    debug: false,
    // root url, userd by optimizer and web
    baseUrl: "/static/scripts/",
    // compiled js url, userd by optimizer and web
    compileUrl: "/static/build/",
    // packages folder, userd by optimizer
    compileDir: "pkgs/20150525/",
    // packages options info, userd by optimizer and web
    packages: [
        {
            name: "chart",
            include: [
                "lib/echart/echarts-all.js",
                //"lib/echart/chart/echarts-all.js",
            ]
        },

        {
           name: "ui-widgets",
           include: [
               "lib/widgets/table.js",
               "lib/widgets/validator.js"
           ]
        },

        {
            name: "index",
            include: [
                "lib/spin.js",
                "lib/bootstrap/responsive-nav/responsive-nav.min.js",
                "lib/bootstrap/js/bootstrap.min.js",
                "lib/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
                "lib/bootstrap-wysiwyg.js",
                "lib/effects/cloud/Detector.js",
                "lib/effects/three.min.js",
                "lib/mathquill/mathquill.min.js",

                "spring/factoryIoC.js",
                "core/common.js",
                "core/webAPI.js",
                "i18n/i18n.js",
                "index.js",
                "core/beopMap.js",
                "core/baseMap.js"
            ]
        },

        {
            name: "entrance",
            include: [
                "observer/widgets/operatingPane.js",
                "observer/widgets/operatingRecord.js",
                "observer/widgets/historyChart.js",
                "observer/widgets/uploadFile.js",
                "observer/widgets/dataWatch.js",
                "observer/widgets/pointManager.js",
                "observer/widgets/alarmLogging.js",
                'lib/mathquill/mathquill.min.js',
                "observer/widgets/dataSourceAdd.js",
                "observer/widgets/dataSource.js",
                "observer/widgets/modalConfigurePane.js",

                "observer/observerScreen.js",
                "observer/analysisScreen.js",
                "observer/energyScreen.js",
                "observer/reportScreen.js",
                "observer/diagnosisScreen.js",
                "dataCenter3D/DataCenter3D.js"
            ]
        },

        {
            name: "observer",
            include: [
                "core/timer.js",
                "core/sprites.js",
                "core/commonCanvas.js",
                "lib/Chart.min.js",
                "observer/widgets/timeShaft.js",

                "observer/entities/modelPipeline.js",
                "observer/entities/modelEquipment.js",
                "observer/entities/modelButton.js",
                "observer/entities/modelText.js",
                "observer/entities/modelChart.js",
                "observer/entities/modelGage.js",
                "observer/entities/modelRuler.js",
                "observer/entities/modelCheckbox.js",
                "observer/entities/modelTempDistribution.js",
            ]
        },

        {
            name: "analysis",
            include: [
                "observer/analysis/sharpViewScreen.js",
                "observer/analysis/anlsWorkspace.js",

                "observer/analysis/enerties/anlzBase.js",
                "observer/analysis/enerties/anlzChart.js",
                "observer/analysis/enerties/anlzHistoryCompare.js",
                "observer/analysis/enerties/anlzScatter.js",
                "observer/analysis/enerties/anlzSpectrum.js",
                "observer/analysis/enerties/anlzTendency.js",
                "observer/analysis/enerties/anlzStack.js",
                "observer/analysis/enerties/anlzCluster.js",
                "observer/analysis/enerties/anlzEnergy.js"
            ]
        },

        {
            name: "dashboard",
            include: [
                "spring/core/base.js",
                "spring/core/modalNone.js",
                "spring/core/modalAnalysis.js",
                "spring/entities/modalChart.js",
                "spring/entities/modalHistoryChart.js",
                "spring/entities/modalCarbonFootprint.js",
                "spring/entities/modalWeather.js",
                "spring/entities/modalEnergySaveRate.js",
                "spring/entities/modalCoalSaveTotal.js",
                "spring/entities/modalCo2SaveTotal.js",
                "spring/entities/modalKPIChart.js"
            ]
        },

        {
            name: "workflow",
            include: [
                "workflow/workflowEfficiency.js",
                "workflow/workflowMain.js",
                "workflow/workflowMine.js",
                "workflow/workflowNotice.js",
                "workflow/workflowNoticeDetail.js",
                "workflow/workflowReport.js",
                "workflow/workflowTeam.js",
                "workflow/workflowInsert.js",
                "workflow/workflowTransaction.js"
            ]
        },

        {
            name: "admin",
            include: [
                "admin/productDownload.js",
                "admin/paneProjectSelector.js",
                "admin/userManager/userManagerController.js",
                "admin/userManager/accountManager.js",
                "admin/userManager/memberManager.js",
                "admin/userManager/projectPermissionManager.js",
                "admin/paneProjectCreator.js",
                "admin/paneProjectConfigure.js",
                "admin/MenuConfigure.js"
            ]
        },

        {
            name: "share-dashboard",
            include: [
                "lib/spin.js",
                "lib/bootstrap/js/bootstrap.min.js",

                "spring/factoryIoC.js",
                "core/common.js",
                "core/webAPI.js",
                "i18n/i18n.js",

                "observer/energyScreen.js",

                "../views/share/dashboard/index.js",
                "observer/widgets/modalConfigurePane.js",

                "spring/core/base.js",
                "spring/core/modalNone.js",
                "spring/core/modalAnalysis.js",
                "spring/entities/modalChart.js",
                "spring/entities/modalHistoryChart.js",
                "spring/entities/modalCarbonFootprint.js",
                "spring/entities/modalWeather.js",
                "spring/entities/modalEnergySaveRate.js",
                "spring/entities/modalCoalSaveTotal.js",
                "spring/entities/modalCo2SaveTotal.js",

                "observer/analysis/enerties/anlzBase.js",
                "observer/analysis/enerties/anlzChart.js",
                "observer/analysis/enerties/anlzHistoryCompare.js",
                "observer/analysis/enerties/anlzScatter.js",
                "observer/analysis/enerties/anlzSpectrum.js",
                "observer/analysis/enerties/anlzTendency.js",
                "observer/analysis/enerties/anlzStack.js",
                "observer/analysis/enerties/anlzCluster.js",
                "observer/analysis/enerties/anlzEnergy.js",
                "observer/widgets/dataSource.js"
            ]
        }
    ]
}));
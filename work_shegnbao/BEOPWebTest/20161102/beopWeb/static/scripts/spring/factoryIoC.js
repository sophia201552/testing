var FactoryIoC = (function () {
    function FactoryIoC(strType) {
        this.listClass = [];
        this.init(strType);
    };

    FactoryIoC.prototype = {
        init: function (strType) {
            switch (strType) {
                case 'analysis': this.initAnalysisModule(); break;
                case 'dashboard': this.initDashboardModule(); break;
                case 'report': this.initReportModule(); break;
                default: break;
            }
        },

        add: function (entityClass) {
            this.listClass.push(entityClass);
        },

        getModel: function (strModelName) {
            for (var i = 0, len = this.listClass.length; i < len; i++) {
                if (strModelName.toLowerCase() == this.listClass[i].name.toLowerCase()) {
                    return this.listClass[i];
                }
            }
            return null;
        },

        getList: function () {
            return this.listClass;
        },

        initAnalysisModule: function () {
            this.add(AnlzTendency);
            this.add(AnlzSpectrum);
            this.add(AnlzScatter);

            //this.add(AnlzHistory);

            this.add(AnlzHistoryCompare);
            this.add(AnlzHistoryCompare_Line);
            //this.add(AnlzChart);
            this.add(AnlzStack);
            this.add(AnlzPieRealtime);
            this.add(AnlzEnergy);
            this.add(AnlzCluster);
            this.add(AnlzCluster_AHU);
            this.add(AnlzCluster_Chiller);
        },

        initDashboardModule: function () {
            this.add(ModalNone);
            this.add(ModalAnalysis);

            this.add(ModalHistoryChart);
            this.add(ModalHistoryChartNormal);//line
            this.add(ModalHistoryChartEnergyConsume);//bar
            this.add(ModalHistoryChartYearOnYearLine);
            this.add(ModalHistoryChartYearOnYearBar);
            this.add(ModalHistoryDataAnalyze);

            this.add(ModalChart);
            this.add(ModalRealtimePieEnegBrkd);
            //this.add(ModalRealtimePieDataRoom);
            this.add(ModalRealtimeLineOutdoor);
            this.add(ModalRealtimeBarSub);
            //this.add(ModalRealtimeLinePUE);
            this.add(ModalRealtimeGauge);
            this.add(ModalRealtimeBarEnegBrkd);
            this.add(ModalMultiple);
            //this.add(ModalRealtimeLineEnegBrkd);

            //this.add(ModalCarbonFootprint);
            //this.add(ModalWeather);
            //this.add(ModalEnergySaveRate);
            //this.add(ModalCoalSaveTotal);
            //this.add(ModalCo2SaveTotal);

            this.add(ModalKPIChart);
            this.add(ModalObserver);
            this.add(ModalPredictPointLine);
            this.add(ModalNote);
            this.add(ModalRank);
            this.add(ModalRankNormal);
            this.add(ModalMix);
            this.add(ModalHtml); 
            this.add(ModalChartCustom);
            this.add(ModalPointKPI);
            this.add(ModalReportChapter);
            (typeof ModalReportFactory != "undefined") && this.add(ModalReportFactory);
            this.add(ModalInteract);
            //this.add(ModalKPIManage);

            this.add(ModalMonitor);
            this.add(ModalAppChart);
            this.add(ModalAppGauge);
            this.add(ModalAppButton);
            this.add(ModalAppHistory);
            this.add(ModalHistoryDataAnalyze);            
			this.add(ModalKPIStruct);
            this.add(ModalAppBlind);            
			this.add(ModalAppDiagRanking);
            this.add(ModalAPPMonthHistory);
			//this.add(ModalMobileWorkDiagnosis);
			this.add(ModalAppKPICollect);
			this.add(ModalAppPie);
			this.add(ModalDiagnosisPanelHtml);
            this.add(ModalRealtimeWeather);
			this.add(ModalDataMonitorList);
            this.add(ModalKpiOverview);//kpi总览
            this.add(ModalDiagnosisStruct);//诊断汇总
            this.add(ModalCumulantChart);
        },

        initReportModule: function () {
            var ns = namespace('factory.report.components');

            this.add(ns.Summary);
            this.add(ns.ChapterContainer);
            this.add(ns.Text);
            this.add(ns.Html);
            this.add(ns.Chart);
            this.add(ns.Block);
            this.add(ns.Table);
        },
    }

    return FactoryIoC;
})();
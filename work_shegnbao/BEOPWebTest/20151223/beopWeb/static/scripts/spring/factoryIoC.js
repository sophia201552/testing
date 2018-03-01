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
            this.add(ModalWeather);
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
            this.add(ModalInteract);
        }
    }

    return FactoryIoC;
})();
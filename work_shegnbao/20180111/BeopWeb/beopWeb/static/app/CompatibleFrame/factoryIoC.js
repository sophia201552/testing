var FactoryIoC = (function () {
    function FactoryIoC(strType) {
        this.listClass = [];
        this.init(strType);
    };

    FactoryIoC.prototype = {
        init: function (strType) {
            switch (strType) {
                case 'compatibleFrame': this.initCompatibleFrameModule(); break;
                case 'report': this.initReportModule(); break;
                default: break;
            }
        },

        add: function (entityClass) {
            this.listClass.push(entityClass);
        },

        getModel: function (strModelName) {
            for (var i = 0, len = this.listClass.length; i < len; i++) {
                if (strModelName.toLowerCase() == this.listClass[i].prototype.optionTemplate.type.toLowerCase()) {
                    return this.listClass[i];
                }
            }
            return null;
        },

        getList: function () {
            return this.listClass;
        },

        initCompatibleFrameModule: function () {
            this.add(ModalNone);

            this.add(ModalHistoryChart);
            this.add(ModalHistoryChartNormal);//line
            this.add(ModalHistoryChartEnergyConsume);//bar
            this.add(ModalHistoryChartYearOnYearLine);
            this.add(ModalHistoryChartYearOnYearBar);

            this.add(ModalChart);
            this.add(ModalRealtimePieEnegBrkd);
            this.add(ModalRealtimeLineOutdoor);
            this.add(ModalRealtimeBarSub);
            this.add(ModalRealtimeGauge);
            this.add(ModalRealtimeBarEnegBrkd);
            this.add(ModalMultiple);

            this.add(ModalPredictPointLine);
            this.add(ModalMix);
            this.add(ModalHtml);
            this.add(ModalInteract);
            this.add(ModalDiagnosisPanelHtml);
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
        }
    }

    return FactoryIoC;
})();
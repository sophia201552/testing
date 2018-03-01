// Roi.js
;(function (exports, FaultTable) {
    class Roi {
        constructor(container, conditionModel) {
            this.faultTable = null;
            this.container = container;
            this.conditionModel = conditionModel;
            this.init();
        }
        init() {

        }
        show() {
            this.faultTable = new FaultTable(this.container, this.conditionModel);
            this.faultTable.show();
        }
        close() {
            if (this.faultTable){
                this.faultTable.close();
                this.faultTable = null;
            }
        }
    }
    exports.Roi = Roi;
} ( namespace('diagnosis.Pages'), namespace('diagnosis.Roi.FaultTable') ));

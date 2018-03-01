// history.js
;(function (exports, FaultTable) {
    class HistoryPage {
        constructor(container, conditionModel, diagnosis) {
            this.container = container;
            this.conditionModel = conditionModel;
            this.diagnosis = diagnosis;

            this.faultTable = null;

            this.init();
        }
        init() {

        }
        show() {
            $('#divWorkOrder').hide();
            $('#divAddWork').show();
            this.faultTable = new FaultTable(this.container, this.conditionModel, this.diagnosis);
            this.faultTable.show();
        }
        getWorkOrderData() {
            if (!this.faultTable) {
                return [];
            }
            return this.faultTable.getSelectedRows();
        }
        close() {
            if (this.faultTable){
                this.faultTable.close();
                this.faultTable = null;
            }
            window.CAPTURE_INSTANCES.forEach(ins=>{
                ins.captureDoms = [];
            });
            window.CAPTURE_INSTANCES = [];
            $('.feedBackModalBtn').removeClass('highLight');
            $('#divWorkOrder').show();
            $('#divAddWork').hide();
        }
    }

    exports.HistoryPage = HistoryPage;
} ( namespace('diagnosis.Pages'), namespace('diagnosis.History.FaultTable') ));

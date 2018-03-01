// spectrum.js
;(function (exports, FaultTable) {
    class Spectrum {
        constructor(container, conditionModel) {
            this.container = container;
            this.conditionModel = conditionModel;

            this.faultTable = null;

            this.init();
        }
        init() {

        }
        show() {
            this.faultTable = new FaultTable(this.container, this.conditionModel);
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
        }
    }

    exports.Spectrum = Spectrum;
} ( namespace('diagnosis.Pages'), namespace('diagnosis.Spectrum.FaultTable') ));

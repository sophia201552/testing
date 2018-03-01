// history.js
;(function (exports, FaultTable) {
    class CaseRecord {
        constructor(container, conditionModel,diagnosis) {
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
            var html=`<div class="showModuleName"> </div>`
            
            if(!$('#timePicker').find('.showModuleName').length){
                $('#timePicker').append(html)
            }
            this.faultTable = new FaultTable(this.container, this.conditionModel,this);
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
            $('.showModuleName').remove()
            window.CAPTURE_INSTANCES = [];
            $('.feedBackModalBtn').removeClass('highLight');
            $('#divWorkOrder').show();
            $('#divAddWork').hide();
        }
    }

    exports.CaseRecord = CaseRecord;
} ( namespace('diagnosis.Pages'), namespace('diagnosis.CaseRecord.FaultTable') ));

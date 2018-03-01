// task.js
;(function (exports, FaultTable) {
    class Task {
        constructor(container, conditionModel, diagnosis) {
            this.container = container;
            this.conditionModel = conditionModel;
            this.diagnosis = diagnosis;

            this.faultTable = null;
        }
        show() {
            $('#divWorkOrder').hide();
            $('#divOpt').hide();
            $('.taskButton').show();
            $('#divDelete').hide();
            this.faultTable = new FaultTable(this.container, this.conditionModel, this.diagnosis);
            this.faultTable.show();
            var html=`<div class="showModuleName"> </div>`
            
            if(!$('#timePicker').find('.showModuleName').length){
                $('#timePicker').append(html)
            }
            
        }
        close() {
            if (this.faultTable){
                this.faultTable.close();
                this.faultTable = null;
            }
            $('#divWorkOrder').show();
            $('#divOpt').show();
            $('.taskButton').hide();
            $('.showModuleName').remove()
        }
    }

    exports.Task = Task;
} ( namespace('diagnosis.Pages'), namespace('diagnosis.Task.FaultTable') ));

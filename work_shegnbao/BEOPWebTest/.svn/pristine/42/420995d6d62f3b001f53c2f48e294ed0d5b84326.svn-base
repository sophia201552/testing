
;(function (exports, SuperClass) {

    function Summary() {
         SuperClass.apply(this, arguments);

        this.chapterNo = null;
    }

    Summary.prototype = Object.create(SuperClass.prototype);

    +function () {

        this.optionTemplate = Mixin(this.optionTemplate, {
            name: '汇总',
            type: 'Summary',
            spanC: 12,
            spanR: 4
        });

        this.initTools = function (tools) {
            tools = tools ||  ['remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        this.refreshSummary = (function(){
            if (AppConfig.isReportConifgMode){
                return function(chapterNo){
                    
                }
            }
        }())

    }.call(Summary.prototype);

    exports.Summary = Summary;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Container') ));

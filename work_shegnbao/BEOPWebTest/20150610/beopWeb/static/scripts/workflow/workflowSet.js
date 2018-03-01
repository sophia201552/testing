/// <reference path="../lib/jquery-1.11.1.js" />
var WorkflowSet = (function () {

    function WorkflowSet() {
        this.i18 = I18n.resource.workflow.urgencyLevel;
    };

    WorkflowSet.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/workflow/set.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();
                I18n.fillArea($("#workflow-set"));
            });
        },

        close: function () {
        },

        init: function () {
                $("#btnSet").click(function(){
                    var str="";
                    var input=$("#mailNotifiOptionsUl input[name='mailNotifiOptions']:checked");
                    var inputL=input.length;
                    if(!inputL){
                        $(".mailErrorInfo").show();
                        return false;
                    }else{
                        $(".mailErrorInfo").hide();
                        for(var i=0;i<inputL;i++){
                            var val=input.eq(i).val();
                            if(i!=inputL-1){
                                str+=val+"-";
                            }else{
                               str+=val;
                            }
                        }
                    }
                })
        }
    }

    return WorkflowSet;
})();
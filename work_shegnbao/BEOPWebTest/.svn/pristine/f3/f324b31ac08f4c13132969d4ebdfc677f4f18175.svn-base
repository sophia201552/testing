/**
 * Created by liqian on 2015/5/20.
 */
var WorkflowInsert = (function () {

    function WorkflowInsert() {
        this.$container = {};
    };

    WorkflowInsert.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/workflow/insert.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.$container = $("#workflow-insert");
                _this.init();
            });
        },

        close: function () {
        },

        init: function () {
            $("#txtLogDateStart").datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true,
                startDate: new Date()
            });
            this.loadData();//加载页面数据
            this.attachEvents();//绑定页面点击事件
        },

        attachEvents: function (){
            var _this = this;
            this.$container.on("click","#workflow-insert-submit",function(){
                if(_this.submitCheck()){//表单校验
                    $("#insert-errorInfo").hide();
                    WebAPI.post('/admin/updateUsersSetting', {
                        selectGroup: $("#selectGroup").val(),
                        selectOperator: $("#selectOperator").val(),
                        Severity: $("#Severity").val(),
                        txtLogDateStart: $("#txtLogDateStart").val(),
                        title: $("#workflow-insert-title").val(),
                        detail: $("#workflow-insert-detail").val()
                    }).done(function (result) {
                        if (result.success) {
                           //生成统计图
                            getChart();
                        }
                    })
                }
            });

            this.$container.on("click","#workflow-insert-cancel",function(){

            });
        },

        submitCheck: function (){
            if($.trim($("#txtLogDateStart").val())===""){
                $("#insert-errorInfo").text("截止时间不能为空");
                return false;
            }
            if($.trim($("#workflow-insert-title").val())===""){
                $("#insert-errorInfo").text("标题不能为空");
                return false;
            }
            if($.trim($("#workflow-insert-detail").val())===""){
                $("#insert-errorInfo").text("详细信息不能为空");
                return false;
            }
            return true;
        },

        loadData: function (){
            WebAPI.post('/admin/updateUsersSetting', {

            }).done(function (result) {
                if (result.success) {
                   //加载页面数据
                    $("#selectGroup").val();
                    $("#selectOperator").val();
                    $("#Severity").val();
                    $("#txtLogDateStart").val();
                    $("#workflow-insert-title").val();
                    $("#workflow-insert-detail").val();
                }
            })
        },

        getChart: function (){

        }
    };
    return WorkflowInsert;
})();
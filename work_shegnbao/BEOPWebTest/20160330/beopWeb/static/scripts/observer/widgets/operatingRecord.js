/// <reference path="../../lib/jquery-2.1.4.min.js" />
/// <reference path="../../core/common.js" />

var OperatingRecord = (function () {
    function OperatingRecord() {
        this.init();
    };

    OperatingRecord.prototype = {
        show: function () {
            $('#dialogModal').modal({});
        },

        init: function () {
            var _this = this;
            WebAPI.get("/static/views/observer/widgets/operatingRecord.html").done(function (resultHtml) {
                var $dialogContent = $("#dialogContent");
                $dialogContent.html(resultHtml);

                $("#datePickerLog").datetimepicker({
                    minView: "month",
                    autoclose: true,
                    todayBtn: true,
                    initialDate: new Date()
                });

                $("#txtLogDate").val(new Date().toLocaleDateString().replace('/', '-').replace('/', '-'));
                $("#txtLogDate").change(function (e) {
                    _this.refreshData();
                });

                $("#btnLogPre").click(function (e) {
                    var preDay = new Date($("#txtLogDate").val().toDate() - 86400000);
                    $("#txtLogDate").val(preDay.toLocaleDateString().replace('/', '-').replace('/', '-'));
                    _this.refreshData();
                });

                $("#btnLogNext").click(function (e) {
                    var nextDay = new Date($("#txtLogDate").val().toDate() + 86400000);
                    $("#txtLogDate").val(nextDay.toLocaleDateString().replace('/', '-').replace('/', '-'));
                    _this.refreshData();
                });

                _this.refreshData();
                I18n.fillArea($dialogContent);
            });
        },

        refreshData: function () {
            Spinner.spin($("#dialogContent .modal-body")[0]);
            var _this = this;
            WebAPI.post("/get_operation_log", { proj: AppConfig.projectId, date: $("#txtLogDate").val() })
                .done(function (data) {
                    _this.renderData(data);
                })
                .always(function () {
                    Spinner.stop();
                });
        },

        renderData: function (data) {
            var sb = new StringBuilder();
            if (data.length && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    sb.append("<tr><td>").append(new Date(data[i].RecordTime * 1000).format("yyyy-MM-dd HH:mm:ss")).append("</td>");
                    sb.append("<td>").append(data[i].user).append("</td>");
                    sb.append("<td>").append(data[i].OptRemart).append("</td></tr>");
                }
            }
            else {
                sb.append("<tr><td colspan=3 i18n='observer.widgets.NO_OPERATIONS_TODAY'></td></tr>");
            }
            $("#tableOperatingRecord tbody").html(sb.toString());
        }
    }

    return OperatingRecord;
})();
/// <reference path="../analysisScreen.js" />
/// <reference path="../../lib/jquery-1.11.1.min.js" />
/// <reference path="../../core/common.js" />
/// <reference path="../../lib/jquery-1.8.3.js" />


var AnalysisData = (function () {
    function AnalysisData() {
        this.lostCount = 0;
        this.lostPercent = undefined;
    }

    AnalysisData.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(document.getElementById('divAnalysisPane'));
            $.get("/static/views/observer/analysis/analysisData.html", null, function (resultHtml) {
                Spinner.spin(document.getElementById('divAnalysisPane'));
                $("#divAnalysisPane").html(resultHtml);
                _this.init();

                I18n.fillArea($("#divAnalysisPane"));
            })
        },

        close: function () {
        },

        init: function () {
            this.initTable();
            this.initDisplayPane();
            this.initChart();
            Spinner.stop();
        },

        initDisplayPane: function () {
            $("#spanPointCount").html(ScreenCurrent.listPoints.length);
            $("#spanStartTime").html(ScreenCurrent.startTime);
            $("#spanEndTime").html(ScreenCurrent.endTime);
            $("#spanInterval").html(ScreenCurrent.interval);
            $("#spanLostCount").html(this.lostCount);
            $("#spanLostPercent").html(this.lostPercent);
        },

        initTable: function () {
            var thead = $("#tablePoints thead tr");
            var tbody = $("#tablePoints tbody");

            //insert row
            for (var i = 0; i < ScreenCurrent.timeShaft.length; i++) {
                tr = document.createElement("tr");
                tr.id = ScreenCurrent.timeShaft[i];
                tr.innerHTML = "<td>" + ScreenCurrent.timeShaft[i] + "</td>";
                tbody.append(tr);
            }

            var th, td, point, history;
            var trs = $("#tablePoints tbody tr");
            for (var i = 0; i < ScreenCurrent.listPoints.length; i++) {
                point = ScreenCurrent.listPoints[i];
                //insert head
                th = document.createElement("th");
                th.textContent = point.name;
                th.style.textAlign = "center";
                thead.append(th);

                for (var j = 0; j < trs.length; j++) {
                    history = point.history[j];
                    td = document.createElement("td");
                    td.id = "td-" + ScreenCurrent.timeShaft[j] + ":" + point.name;
                    td.textContent = history.value;
                    td.classList.add(history.error ? "danger" : "success");
                    trs[j].appendChild(td);

                    if (history.error) this.lostCount++;
                }
            }

            //calculate lost percent;
            this.lostPercent = (this.lostCount * 100 / (trs.length * ScreenCurrent.listPoints.length)).toFixed(2).toString() + "%";
        },

        initChart: function () {
            var trData = $("#chartPoints .trData");
            var sbLabel = new StringBuilder();

            for (var k = 0; k < ScreenCurrent.listPoints[0].history.length; k++) {
                for (var i = 0; i < ScreenCurrent.listPoints.length; i++) {
                    var point = ScreenCurrent.listPoints[i];
                    var td = document.createElement("td");
                    td.style.width = "1px";
                    td.title = ScreenCurrent.timeShaft[i] + ": " + point.history[k].value;
                    td.classList.add(point.history[k].error ? "danger" : "success");
                    td.onmouseover = function (e) {

                    };
                    trData.append(td);
                }
                sbLabel.append('<td colspan="').append(ScreenCurrent.listPoints.length)
                sbLabel.append('" style="border-top: 0 !important; border-left: 1px inset #ccc; height: 3px;"></td>');
            }
            $("#chartPoints .trLabel").html(sbLabel.toString());
            sbLabel = null;
        }
    }

    return AnalysisData;
})();
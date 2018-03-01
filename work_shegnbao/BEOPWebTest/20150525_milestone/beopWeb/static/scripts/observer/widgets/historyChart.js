/// <reference path="../../lib/jquery-1.11.1.min.js" />
/// <reference path="../../core/common.js" />

var HistoryChart = (function () {
    function HistoryChart(data) {
        this.init();
        this.m_data = data;
    };

    HistoryChart.prototype = {
        show: function () {
            $('#dialogModal').modal({});
        },

        init: function () {
            var _this = this;
            $.get("/static/views/observer/widgets/historyChart.html").done(function (resultHtml) {
                $("#dialogContent").html(resultHtml);

                _this.refreshData();
            });
        },

        refreshData: function () {
            //Spinner.spin($("#dialogContent .modal-body")[0]);

            //do show logic
            this.drawEChart(this.m_data);
        },

        drawEChart: function(data) {
            var arrayName = new Array();
            var nArraySize = data.length;
            var arraySeries = new Array();

            for (var i=0; i<nArraySize; i++) {
                arrayName.push(data[i].name);

                var arrPt = new Array();
                var nEachSize = data[i].point.length;
                for (var j=0; j<nEachSize; j++) {
                    var tm = data[i].point[j].time;
                    arrPt.push([new Date(Date.parse(tm.replace(/-/g, "/"))), data[i].point[j].value]);
                }
                if (0 == arrPt.length) {
                    continue;
                }

                arraySeries.push({
                    name:data[i].name,
                    type:'line',
                    data:arrPt,
                    markPoint : {
                        data : [
                            {type : 'max', name: I18n.resource.observer.widgets.MAXIMUM},
                            {type : 'min', name: I18n.resource.observer.widgets.MINIMUM}
                        ]
                    }
                });
            }

            option = {
                title : {
                    text: '',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'axis',
                    formatter : function (params) {
                        var date = new Date(params.value[0]);
                        data = date.getFullYear() + '-'
                               + (date.getMonth() + 1) + '-'
                               + date.getDate() + ' '
                               + date.getHours() + ':'
                               + date.getMinutes();
                        return data + '<br/>'
                               + ',' + params.value[1];
                    }
                },
                legend: {
                    data:arrayName
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataZoom : {show: true, readOnly: false},
                        dataView : {show: true, readOnly: true},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                dataZoom: {
				    show: true
			    },
                grid: {
                    y2: 80
                },
                calculable : true,
                xAxis : [
                    {
                        type: 'time'
                    }
                ],
                yAxis : [
                    {
                        type: 'value'
                    }
                ],
                series : arraySeries
            };

            var myChart = echarts.init(document.getElementById("tableOperatingRecord"));
            myChart.setOption(option);
        },

        uniqueArray: function(arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }
    }

    return HistoryChart;
})();

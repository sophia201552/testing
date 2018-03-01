/// <reference path="../../lib/jquery-1.11.1.min.js" />
/// <reference path="../../core/common.js" />
var chartTimer = null;
var HistoryChart = (function () {
    function HistoryChart(data, startDate, endDate, $targetBox) {
        this.historyData = data;
        this.startDate = startDate;
        this.endDate = endDate;
        this.$dialogContent = $targetBox;
        this.historyChart = null;
    }

    HistoryChart.prototype = {
        init: function () {
            var _this = this;
            if (_this.$dialogContent.attr("id") === "dialogContent") {
                return WebAPI.get("/static/views/observer/widgets/historyChart.html").done(function (resultHtml) {
                    _this.$dialogContent.html(resultHtml);
                    _this.refreshData();
                });
            } else {
                _this.refreshData();
            }

        },

        destroy: function () {
            this.historyChart.dispose();
        },

        refreshData: function () {
            var legends = [], series = [];
            if (!this.historyData.data) {
                series.push({
                    data: []
                });
            } else {
                for (var pointName in this.historyData.data) {
                    legends.push(pointName);
                    series.push({
                        name: pointName,
                        type: 'line',
                        data: this.historyData.data[pointName]
                    });
                }
            }

            var legends_handled = [];

            for (var l = 0, l_length = legends.length; l < l_length; l++) {
                legends_handled.push(legends[l]);
                if ((l + 1) % 3 === 0) {
                    legends_handled.push('');
                }
            }
            var i18nEcharts = I18n.resource.echarts;
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    }
                },
                legend: {
                    data: legends_handled,
                    x: 'left'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true,
                            title : {
                                mark : i18nEcharts.MARK,
                                markUndo : i18nEcharts.MARKUNDO,
                                markClear : i18nEcharts.MARKCLEAR
                            }
                        },
                        dataView: {
                            show: true,
                            readOnly: false,
                            title : i18nEcharts.DATAVIEW,
                            lang: [i18nEcharts.DATAVIEW, i18nEcharts.CLOSE, i18nEcharts.REFRESH]
                        },
                        restore: {
                            show: true,
                            title: i18nEcharts.REDUCTION
                        },
                        saveAsImage: {
                            show: true,
                            title: i18nEcharts.SAVE_AS_PICTURE,
                            lang : i18nEcharts.SAVE
                        }
                    }
                },
                dataZoom: {
                    show: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.historyData.timeStamp
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: series
            };
            var $tableOperatingRecord = this.$dialogContent.find('.tableOperatingRecord');
            if (this.$dialogContent.attr("id") === "dialogContent") {
                $tableOperatingRecord.css('width', ($tableOperatingRecord.parent().width()).toFixed(1) + 'px');
            } else {
                $tableOperatingRecord.css({
                    'width':'950px',
                    'height':'500px'
                });
            }

            this.historyChart = echarts.init($tableOperatingRecord.get(0)).setOption(option);


            function getNowFormatDate() {
                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + date.getHours() + seperator2 + date.getMinutes()
                    + seperator2 + date.getSeconds();
                return currentdate;
            }

            var _this = this;
            var chartNameList = [];
            for (var prop in this.historyData.data) {
                chartNameList.push(prop);
            }
            clearInterval(chartTimer);
            chartTimer = setInterval(function () {
                return WebAPI.post("/get_realtimedata", {
                    proj: localStorage.getItem("current_project"),
                    pointList: chartNameList
                }).done(function (result) {
                    var chartList = []
                    for (var i = 0; i < result.length; i++) {
                        var curveAttrList = [];
                        curveAttrList.push(i);
                        curveAttrList.push(result[i].value);
                        curveAttrList.push(false);
                        curveAttrList.push(false);
                        curveAttrList.push(getNowFormatDate());
                        chartList.push(curveAttrList);
                    }
                     _this.historyChart.addData(chartList);
                });
            }, 30000);


        },
        optionToContent: function (opt) {
            //图例切换为数据视图
            var axisData = opt.xAxis && opt.xAxis[0].data,
                series = opt.series;
            var html = '<table  class="table table-bordered table-hover table-striped" style="-webkit-user-select: initial;  width: 80%;margin: 0 auto;"><tbody>';

            if (BEOPUtil.isUndefined(axisData)) {
                //table header
                html += '<tr>';
                for (var i = 0, l = series.length; i < l; i++) {
                    html += '<td colspan="2">' + series[i].name + '</td>';
                }
                html += '</tr>';
                var longestSeriesData = [], longestLength = 0;
                for (var j = 0, sl = series.length; j < sl; j++) {
                    if (series[j].data.length > longestLength) {
                        longestSeriesData = series[j].data;
                        longestLength = longestSeriesData.length;
                    }
                }

                for (var i = 0, il = longestSeriesData.length; i < il; i++) {
                    html += '<tr>';

                    for (var m = 0, ml = series.length; m < ml; m++) {
                        if (!BEOPUtil.isUndefined(series[m].data[i])) {
                            for (var n = 0, nl = series[m].data[i].length; n < nl; n++) {
                                html += '<td>' + series[m].data[i][n] + '</td>';
                            }
                        }
                    }

                    html += '</tr>';
                }
            } else {
                //table header
                html += '<tr><td>' + opt.xAxis[0].name + '</td>';
                for (var i = 0, l = series.length; i < l; i++) {
                    html += '<td>' + series[i].name + '</td>';
                }
                html += '</tr>';
                //table content
                for (var i = 0, l = axisData.length; i < l; i++) {
                    html += '<tr>' + '<td>' + axisData[i] + '</td>';

                    for (var j = 0, sl = series.length; j < sl; j++) {
                        html += '<td>' + series[j].data[i] + '</td>';
                    }

                    html += '</tr>';
                }
            }

            html += '</tbody></table>';
            return html;
        }
    };

    return HistoryChart;
})();

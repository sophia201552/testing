/// <reference path="../../lib/jquery-2.1.4.min.js" />
/// <reference path="../../core/common.js" />

var HistoryChart = (function () {
    function HistoryChart(data, startDate, endDate) {
        this.historyData = data;
        this.startDate = startDate;
        this.endDate = endDate;
        this.$dialogContent = $("#dialogContent");
        this.historyChart = null;
    }

    HistoryChart.prototype = {
        show: function () {
            var _this = this;
            $('#dialogModal').one('hidden.bs.modal', function () {
                _this.historyChart && _this.historyChart.dispose && _this.historyChart.dispose();
                $(this).find('#dialogContent').removeClass('historyChartBigModel');
                _this.$dialogContent.empty();
            }).one('shown.bs.modal', function () {
                _this.$dialogContent.addClass('historyChartBigModel');
                _this.init();
            }).modal();
        },

        init: function () {
            var _this = this;
            return WebAPI.get("/static/views/observer/widgets/historyChart.html").done(function (resultHtml) {
                _this.$dialogContent.html(resultHtml);
                _this.refreshData();
            });
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
                        data: this.historyData.data[pointName],
                        markPoint: {
                            data: [
                                {type: 'max', name: I18n.resource.observer.widgets.MAXIMUM},
                                {type: 'min', name: I18n.resource.observer.widgets.MINIMUM}
                            ]
                        }
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
            var option = {
                title: {
                    text: I18n.resource.dataManage.HISTORY_CURVE,
                    subtext: this.startDate.format('yyyy-MM-dd HH:mm:ss') + '  -  ' + this.endDate.format('yyyy-MM-dd HH:mm:ss'),
                    x: 'center'
                },
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
                        mark: {show: true},
                        dataZoom: {show: true, readOnly: false},
                        dataView: {
                            show: true, readOnly: true,
                            optionToContent: this.optionToContent
                        },
                        restore: {show: true},
                        saveAsImage: {show: true}
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
            var $tableOperatingRecord = $('#tableOperatingRecord');
            $tableOperatingRecord.css('width', ($tableOperatingRecord.parent().width() * 0.9).toFixed(1) + 'px');

            this.historyChart = echarts.init($tableOperatingRecord.get(0), AppConfig.chartTheme).setOption(option);
        },
        optionToContent: function (opt) {
            //图例切换为数据视图
            var axisData = opt.xAxis && opt.xAxis[0].data,
                series = opt.series;
            var title = '<p style=" text-align: center; font-size: 15px;font-weight: bold;">' + opt.title.text + '</p>';
            var html = title + '<table  class="table table-bordered table-hover table-striped" style="-webkit-user-select: initial;  width: 80%;margin: 0 auto;"><tbody>';

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

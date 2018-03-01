/// <reference path="../lib/jquery-1.8.3.js" />
/// <reference path="analysis/analysisTendency.js" />
/// <reference path="analysis/analysisSpectrum.js" />
/// <reference path="../core/common.js" />
/// <reference path="../lib/jquery-1.8.3.js" />

//mango modified 2015-1-6 change line,bar,pie to echart
var ReportScreen = (function () {


    var getThisWeekReportNum = function () {
        var weekNum = DateUtil.getWeekNumber(new Date());
        return DateUtil.getLastWeekNumberOf(weekNum[0], weekNum[1]);
    };

    function ReportScreen(reportStringId, reportType, reportFolder) {
        this.$reportNavigation = null;
        this.$ElScreenContainer = $(ElScreenContainer);
        this.reportStringId = reportStringId;
        this.reportType = reportType;
        this.reportFolder = reportFolder;
    }

    ReportScreen.prototype = {
        displayWeek: getThisWeekReportNum(),
        reportTypeMap: {
            daily: '0',
            monthly: '1'
        },
        baseChartOption: {
            title: {
                x: 'center',
                textStyle: {
                    fontSize: 15
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: true},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            animation: false
        },
        chartYOffsetSetting: {
            grid: {
                y: 100
            },
            legend: {
                y: 40
            }
        },
        chartType: {
            pie: 'pie',
            line: 'line',
            scatter: 'scatter',
            bar: 'bar',
            area: 'area',
            table: 'table'
        },
        chartList: {},
        show: function () {
            this.init();
        },

        close: function () {
            this.unregisterChartResize();
            //this.unregisterMousewheelEvent();
            this.clearHash();
            this.disposeChart();
            this.chartList = {};
            $(window).off('resize');
            this.unregisterPrintEvent();
        },

        disposeChart: function () {
            for (var chartId in this.chartList) {
                this.chartList[chartId].dispose();
            }
        },

        init: function () {
            this.getReport();
            this.chartList = {};
            this.registerPrintEvent();
        },
        registerChartResize: function () {
            var _this = this;
            this.unregisterChartResize();
            $(window).on('resize.beop.report.echarts', function () {
                for (var m in _this.chartList) {
                    _this.chartList[m].resize();
                }
            });
        },
        unregisterChartResize: function () {
            $(window).off('resize.beop.report.echarts');
        },
        beforePrintReportScreen: function () {
            var chart = null, image, $chart;
            for (var m in this.chartList) {
                chart = this.chartList[m];
                if (chart) {
                    image = this.chartList[m].getImage();
                    $(image).addClass('chartImage');
                    $chart = $(chart.dom);
                    $chart.parent().append(image);
                    $chart.hide();
                }
            }
        },
        afterPrintReportSceen: function () {
            var chart = null, $chart;
            for (var m in this.chartList) {
                chart = this.chartList[m];
                if (chart) {
                    $chart = $(chart.dom);
                    $chart.show();
                    $chart.parent().children('.chartImage').remove();
                    chart.resize();
                }
            }
        },
        mediaPrintEvent: function (mql) {
            if (mql.matches) {
                this.beforePrintReportScreen();
            } else {
                this.afterPrintReportSceen();
            }
        },
        registerPrintEvent: function () {
            if (window.matchMedia) {
                window.matchMedia('print').addListener(this.mediaPrintEvent.bind(this));
            }
            $(window).on('beforeprint.beop.report.echarts', this.beforePrintReportScreen.bind(this));
            $(window).on('afterprint.beop.report.echarts', this.afterPrintReportSceen.bind(this));
        },
        unregisterPrintEvent: function () {
            if (window.matchMedia) {
                window.matchMedia('print').removeListener(this.mediaPrintEvent.bind(this));
            }
            $(window).off('beforeprint.beop.report.echarts');
            $(window).off('afterprint.beop.report.echarts');
        },
        registerMousewheelEvent: function () {
            var _this = this;

            $('#indexMain').on('mousewheel.beop.report', '.step-container', function (event) {
                var $target = $(this);
                if (event.originalEvent.wheelDelta > 0) {//Up
                    if ($target.scrollTop() === 0) {
                        _this.preReportUnit();
                        event.stopPropagation();
                        return false;
                    } else {
                        event.stopPropagation();
                        return true;
                    }
                } else {
                    if ($target.scrollTop() + $target.innerHeight() + 1 >= $target[0].scrollHeight) {
                        _this.nextReportUnit();
                        event.stopPropagation();
                        return false;
                    } else {
                        event.stopPropagation();
                        return true;
                    }
                }
            }).on('mousewheel.beop.report', function (event) {
                if (event.originalEvent.wheelDelta > 0) {//Up
                    _this.preReportUnit();
                } else {
                    _this.nextReportUnit();
                }
                return false;
            });
        },
        unregisterMousewheelEvent: function () {
            $('#indexMain').off('mousewheel.beop.report');
        },
        clearHash: function () {
            window.location.replace("#")
        },
        _getNextReportUnitItem: function (nextItemFunc) {
            var $reportUnitList = this.$ElScreenContainer.find('.report-unit'),
                currentIndex,
                nextIndex,
                nextReportUnit,
                nextListItemId;
            $reportUnitList.each(function (index, item) {
                if ($(item).hasClass('active')) {
                    currentIndex = index;
                }
            });
            nextIndex = nextItemFunc($reportUnitList.length - 1, currentIndex);
            nextReportUnit = $reportUnitList.get(nextIndex);
            if (nextReportUnit) {
                nextListItemId = nextReportUnit.id;
                return this.$reportNavigation.find('a[report-unit="' + nextListItemId + '"]').closest('li');
            } else {
                return null;
            }

        },
        nextReportUnit: function () {
            var $nextItem = this._getNextReportUnitItem(function (total, current) {
                return current === total ? 0 : current + 1;
            });
            $nextItem && $nextItem.trigger('click');
        },
        preReportUnit: function () {
            var $nextItem = this._getNextReportUnitItem(function (total, current) {
                return current === 0 ? total : current - 1;
            });
            $nextItem && $nextItem.trigger('click', true);
        },
        getReportFolder: function (key) {
            return this.reportFolder;
        },
        getReportType: function () {
            return this.reportType;
        },

        getReport: function (year, month, day) {
            var _this = this, version, thisDay;
            Spinner.spin(ElScreenContainer);
            var reportFolderName = this.getReportFolder();
            if (this.getReportType() === this.reportTypeMap.daily) {
                if (!month || !year || !day) {
                    thisDay = new Date();
                    year = thisDay.getFullYear();
                    month = thisDay.getMonth() + 1;
                    day = thisDay.getDate() > 1 ? thisDay.getDate() - 1 : 1;
                }

                version = year + "-" + StringUtil.padLeft(month, 2, '0') + "-" + StringUtil.padLeft(day, 2, '0');
            }
            else {
                if (!month || !year) {
                    thisDay = new Date();
                    year = thisDay.getFullYear();
                    month = DateUtil.getLastMonth();
                }
                version = year + '-' + StringUtil.padLeft(month, 2, '0');
            }

            return $.ajax({
                url: "/static/projectReports/reports/" + AppConfig.projectName + "/" + reportFolderName + '/' + version + '.html',
                cache: false
            }).done(function (resultHtml) {
                I18n.fillArea($(ElScreenContainer).html(resultHtml));
                _this.renderCharts($('#beopReport .report-unit'));
                _this.$reportNavigation = $('.reportNavigation');
                //_this.initReportNavigation();
                _this.initDatePicker(year, month, day);

                //定位
                BEOPUtil.setRelativePosition($(".step-container"), _this.$reportNavigation, 0, 50);
                $(window).resize(function () {
                    BEOPUtil.setRelativePosition($(".step-container"), _this.$reportNavigation, 0, 50);
                });
                _this.$reportNavigation.affix({
                    offset: {
                        top: 100
                    }
                });
                $('.step-container').scrollspy({target: '.reportNavigation'});
                Spinner.stop();
            }).fail(function () {
                $.get('/static/projectReports/emptyReport.html').done(function (resultHtml) {
                    I18n.fillArea($(ElScreenContainer).html(resultHtml));
                    _this.initDatePicker(year, month, day);
                    BEOPUtil.setRelativePosition($(".step-container"), $(".reportNavigation"), 0, 50);
                    $(window).resize(function () {
                        BEOPUtil.setRelativePosition($(".step-container"), $(".reportNavigation"), 0, 50);
                    });
                }).always(function () {
                    Spinner.stop();
                })
            });
        },
        renderCharts: function ($chartContainer) {
            var charts = $chartContainer.find('.chart-param');
            for (var i = 0; i < charts.length; i++) {
                this.initCharts($(charts[i]));
            }
        },
        initDatePicker: function (year, month, day) {
            var now = new Date();
            var year = !year ? now.getFullYear() : year;
            var monthName = !month ? DateUtil.getMonthName(DateUtil.getLastMonth() - 1) : DateUtil.getMonthName(month - 1);
            var day = !day ? now.getDate() : day;
            var $datePick = $(".form_datetime");
            var _this = this;
            var dateDisplay;

            if (this.getReportType() == this.reportTypeMap.daily) {
                $datePick.find('input').val(monthName + ' ' + day + ',' + year);
                $datePick.datetimepicker({
                    format: "MM dd,yyyy",
                    minView: "month",
                    startView: "month",
                    todayBtn: true,
                    autoclose: true,
                    endDate: new Date()
                }).on('changeDate', function (ev) {
                    try {
                        var date = new Date(ev.date.valueOf());
                        _this.getReport(date.getFullYear(), date.getMonth() + 1, date.getDate());
                    } catch (e) {
                        return false;
                    }
                }).on('show', function (ev) {
                    dateDisplay = DateUtil.getMonthName(ev.date.getMonth()) + ' ' + ev.date.getDate() + ',' + ev.date.getFullYear();
                    $datePick.find('input').val(dateDisplay);
                });
            } else {
                $datePick.find('input').val(monthName + ',' + year);
                $datePick.datetimepicker({
                    format: "MM,yyyy",
                    minView: "year",
                    startView: "year",
                    todayBtn: true,
                    autoclose: true,
                    endDate: new Date()
                }).on('changeDate', function (ev) {
                    try {
                        var date = new Date(ev.date.valueOf());
                        _this.getReport(date.getFullYear(), date.getMonth() + 1);
                    } catch (e) {
                        return false;
                    }
                }).on('show', function (ev) {
                    dateDisplay = DateUtil.getMonthName(ev.date.getMonth()) + ',' + ev.date.getFullYear();
                    $datePick.find('input').val(dateDisplay);
                });
            }

        },

        initReportNavigation: function () {
            var _this = this;
            this.$reportNavigation.on('click', 'li.reportChapter', function () {
                var $this = $(this), $reportUnit, reportUnitId, $sub_li;
                if ($this.hasClass('active')) {
                    return false;
                }
                $this.closest('.reportNavigation').find('li.active').removeClass('active');
                $this.addClass('active');
                $sub_li = $this.find('li:first');
                if ($sub_li.size() > 0) {
                    reportUnitId = $sub_li.addClass('active').find('a').attr('report-unit');
                }
                $reportUnit = $('#' + reportUnitId);
                _this.showReportUnit($reportUnit).done(function () {
                    _this.renderCharts($reportUnit);
                    if (_this.chartList[reportUnitId]) {
                        _this.chartList[reportUnitId].resize();
                    }
                });

            })
        },

        showReportUnit: function ($reportUnit, isUp) {
            $reportUnit.closest('.step-play-list').find('.report-unit.active').removeClass('active');
            var dfd = $.Deferred();
            $('.step-container').animate({
                top: isUp ? '-200px' : '100px',
                opacity: "toggle"
            }, 'fast', function () {
                $reportUnit.addClass('active');
                $('.step-container').css('top', isUp ? '200px' : '-100px').animate({
                    top: '0px',
                    opacity: "toggle"
                }, function () {
                    dfd.resolve();
                });
            });
            return dfd;
        },
        generateChartId: function () {
            return new Date().getTime();
        },

        initCharts: function ($canvasChart) {
            var chartOpts = this.getChartParam($canvasChart);
            if (!chartOpts) {
                return;
            }
            var chartDom = $canvasChart.parent()[0],
                chartId = this.generateChartId(),
                chartInstance;
            $(chartDom).attr('chart-id', chartId);
            //draw chart
            switch (chartOpts.type) {
                case this.chartType.line:
                    chartInstance = this.initChartLine(chartDom, chartOpts);
                    break;
                case this.chartType.pie:
                    chartInstance = this.initChartPie(chartDom, chartOpts);
                    break;
                case this.chartType.bar:
                    chartInstance = this.initChartBar(chartDom, chartOpts);
                    break;
                case this.chartType.scatter:
                    chartInstance = this.initChartScatter(chartDom, chartOpts);
                    break;
                case this.chartType.area:
                    chartInstance = this.initChartArea(chartDom, chartOpts);
                    break;
                case this.chartType.table:
                    chartInstance = this.initChartTable(chartDom, chartOpts);
                    break;
                default:
                    console.log('生成图像错误:没有类型' + chartOpts.type);
                    break;
            }
            if (chartInstance) {
                this.chartList[chartId] = chartInstance;
                this.registerChartResize();
            }
        },

        getChartParam: function ($chartParam) {
            try {
                var unitString = $chartParam.text();
                if (!unitString) {
                    return null;
                }
                unitString = unitString.replace(/'/g, "\"");
                return JSON.parse(unitString);
            } catch (e) {
                console.error(e);
                return null;
            }
        },

        getChartSeriesData: function (type, x, yData, y) {
            var result = [];
            switch (type) {
                case this.chartType.bar:
                case this.chartType.line:
                case this.chartType.scatter:
                case this.chartType.area:
                {
                    result = yData;
                    break;
                }
                case this.chartType.pie:
                {
                    for (var i = 0; i < y.length; i++) {
                        result.push({name: y[i].name, value: y[i].value})
                    }
                    break;
                }
                default :
                {
                    result = yData;
                }
            }
            return result;
        },

        getChartOptsFromParam: function (chartParam, type) {
            var y = chartParam.chartItems.y,
                x = chartParam.chartItems.x,
                series = [],
                legend = [],
                yItem,
                seriesItem, result, yAxis = [],
                _this = this;
            ;
            if (type === this.chartType.pie) {
                legend = x;
                seriesItem = {};
                seriesItem.name = chartParam.title;
                seriesItem.data = this.getChartSeriesData(type, x, null, y);
                seriesItem.type = type;
                seriesItem.selectedMode = 'single';
                series.push(seriesItem);
            } else {
                if (!$.isArray(y)) {//兼容之前的数据结构
                    var temp = [];
                    for (var key in y) {
                        var obj = {
                            name: key,
                            value: y[key],
                            yAxisIndex: 0
                        };
                        temp.push(obj);
                    }
                    y = temp;
                }
                for (var m = 0, length = y.length; m < length; m++) {
                    yItem = y[m];
                    var seriesItem = {};
                    seriesItem.yAxisIndex = Number(yItem.yAxisIndex) || 0;
                    seriesItem.name = yItem.name;
                    seriesItem.data = this.getChartSeriesData(type, x, yItem.value, yItem);

                    if (type === this.chartType.area) {
                        seriesItem.type = this.chartType.line;
                        seriesItem.stack = I18n.resource.observer.widgets.TOTAL_AMOUNT;
                        seriesItem.itemStyle = {normal: {areaStyle: {type: 'default'}}};
                    } else {
                        if (yItem.type) {
                            seriesItem.type = yItem.type;
                        } else {
                            seriesItem.type = type;
                        }
                    }
                    seriesItem._name = yItem.name;
                    series.push(seriesItem);
                    legend.push(yItem.name);
                }
                if (!$.isArray(chartParam.Options.y)) {//兼容之前数据,后面会去掉
                    yAxis.push({
                        name: chartParam.Options.y,
                        type: 'value',
                        scale: true
                    })
                } else {
                    for (var i = 0; i < chartParam.Options.y.length; i++) {
                        var yAxisItem = {
                            name: chartParam.Options.y[i],
                            type: 'value'
                        };
                        if (!BEOPUtil.isUndefined(chartParam.yMax)) {
                            yAxisItem.max = chartParam.yMax[i];
                        } else if (!BEOPUtil.isUndefined(chartParam.yMin)) {
                            yAxisItem.min = chartParam.yMin[i];
                        } else {
                            yAxisItem.scale = true;
                        }
                        yAxis.push(yAxisItem);
                    }
                }
            }

            result = {
                title: {
                    text: chartParam.title
                },
                noDataLoadingOption: {
                    text: I18n.resource.observer.reportScreen.TITLE_NO_DATA,
                    effect: 'whirling'
                },
                legend: {data: this._sortLegend(legend)},
                series: series.sort(function (a, b) {
                    return _this._sortFunction(a._name, b._name);
                }),
                xAxis: [{
                    scale: true,
                    name: chartParam.Options.x
                }],
                yAxis: yAxis
            };
            if (x && x.length > 0) {
                result.xAxis[0].data = x;
                result.xAxis[0].type = 'category';
            } else {
                result.xAxis[0].type = 'value';
            }

            if (type === this.chartType.pie) {
                delete result.xAxis;
                delete result.yAxis;
            }
            return result;
        },
        _sortFunction: function (a, b) {
            return a > b;
        },
        _sortLegend: function (legend) {
            if (!legend) {
                return [];
            }
            legend.sort(this._sortFunction);
            var ret = [];
            for (var i = 0, j = legend.length; i < j; i++) {
                ret.push(legend[i]);
                if ((i + 1) % 5 === 0) {
                    ret.push('');
                }
            }
            return ret;
        },
        initChartLine: function (chartDom, chartParam) {
            var option = $.extend(true, {}, this.baseChartOption, this.getChartOptsFromParam(chartParam, this.chartType.line), this.chartYOffsetSetting);
            option.toolbox.feature.magicType = {
                show: true,
                type: ['line', 'bar', 'stack', 'tiled']
            };
            return echarts.init(chartDom).setOption(option);
        },

        initChartPie: function (chartDom, chartParam) {
            var option = $.extend(true, {}, this.getChartOptsFromParam(chartParam, this.chartType.pie), this.baseChartOption, {
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    y: 40
                }, tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/> {b} : {c} ({d}%)"
                }
            });
            return echarts.init(chartDom).setOption(option);
        },

        initChartBar: function (chartDom, chartParam) {
            var option = $.extend(true, {}, this.baseChartOption, this.getChartOptsFromParam(chartParam, this.chartType.bar), this.chartYOffsetSetting);
            option.toolbox.feature.magicType = {
                show: true,
                type: ['line', 'bar', 'stack', 'tiled']
            };
            return echarts.init(chartDom).setOption(option);
        },

        initChartScatter: function (chartDom, chartParam) {
            var option = $.extend(true, {}, this.baseChartOption, this.getChartOptsFromParam(chartParam, this.chartType.scatter), this.chartYOffsetSetting);
            return echarts.init(chartDom).setOption(option);
        },

        initChartArea: function (chartDom, chartParam) {
            var option = $.extend(true, {}, this.baseChartOption, this.getChartOptsFromParam(chartParam, this.chartType.area), this.chartYOffsetSetting);
            return echarts.init(chartDom).setOption(option);
        },
        initChartTable: function (chartDom, chartParam) {
            if (chartParam && chartParam.chartItems && chartDom) {
                $(chartDom).replaceWith(beopTmpl('tmpl_table', chartParam.chartItems));
            }
        }
    };

    return ReportScreen;
})();
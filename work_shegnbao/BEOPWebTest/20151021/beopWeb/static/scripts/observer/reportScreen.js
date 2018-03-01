/**
 * Created by Administrator on 2015/9/9.
 */
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

    function ReportScreen(reportStringId, reportType, reportFolder, reportDate) {
        this.$reportNavigation = null;
        this.$ElScreenContainer = $(ElScreenContainer);
        this.reportStringId = reportStringId;
        this.reportType = reportType;
        this.reportFolder = reportFolder;
        this.dateList = [];
        this.pdfMap = [];
        this.datePickerInstance = null;
        this.reportDate = reportDate;
        this.reportName = '';
        this.week = null;
        this.getMonthFirst = true;
        this.currentTR = null;
        this.currentDatePicker = null;
        this.currentYear = null;
        this.currentGoToday = false;
        this.firstOpen = true;
        this.i18nEcharts = I18n.resource.echarts;
    }

    ReportScreen.prototype = {
        displayWeek: getThisWeekReportNum(),
        reportTypeMap: {
            daily: '0',
            monthly: '1',
            weekly: '2'
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
                    dataView: {
                        show: true,
                        readOnly: true
                    },
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
            if (this.reportDate) {
                this.getReport.apply(this, this.reportDate.split('-'));
            } else {
                this.getReport();
            }
            this.chartList = {};
            this.registerPrintEvent();
            this.registerExportPDFEvent();
        },
        pieOptionToContent: function (opt) {
            var html = '';
            var series = $.extend(true, [], opt.series);

            for (var m = 0, ml = series.length; m < ml; m++) {
                series[m].data.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                var title = '<p style=" text-align: center; font-size: 15px;font-weight: bold;">' + series[m].name + '</p>';
                html = title + '<table  class="table table-bordered table-hover table-striped" style="-webkit-user-select: initial;  width: 80%;margin: 0 auto;"><tbody>';
                for (var n = 0, nl = series[m].data.length; n < nl; n++) {
                    html += '<tr>' + '<td>' + series[m].data[n].name + '</td>';
                    for (var j = 0, jl = series[m].data[n].value.length; j < jl; j++) {
                        html += '<td>' + series[m].data[n].value[j] + '</td>'
                    }
                    html += '</tr>'
                }
                html += '</tbody></table>';
            }
            return html;
        },
        optionToContent: function (opt) {
            //报表 图例切换为数据视图
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
        registerExportPDFEvent: function () {
            var _this = this;
            var downloadPDF = function (href, filename) {
                var a = $("<a id='test' download='" + filename + "' target='_self'' href='" + href + "'>Download2</a>")[0];
                try {
                    try {
                        a.click();
                    } catch (ex) {
                        var evObj = document.createEvent('MouseEvents');
                        evObj.initEvent('click', true, true, window);
                        a.dispatchEvent(evObj);
                    }
                } catch (ex) {
                    alert('download failed.Please contact the administrator.');
                    return false;
                }
            };
            $(ElScreenContainer).off('click', '#exportPDF').on('click', '#exportPDF', function () {
                var chart = null, $image, $chart,
                    $this = $(this),
                    $report = $('.step-play-list').clone(),
                    reportFolderName = $this.attr('reportFolderName'),
                    version = $this.attr('version'),
                    pdfName = AppConfig.projectShowName + '.' + _this.getReportName() + '.' + version + '.pdf';

                if (_this.pdfMap[version]) {
                    downloadPDF(_this.pdfMap[version], pdfName);
                } else {
                    Spinner.spin(ElScreenContainer);
                    for (var m in _this.chartList) {
                        chart = _this.chartList[m];
                        if (chart) {
                            $chart = $report.find('[chart-id=' + $(chart.dom).attr('chart-id') + ']');
                            $image = $(_this.chartList[m].getImage()).addClass('chartImage');
                            $chart.replaceWith($image);
                        }
                    }
                    // 防止不应该的分页
                    $('.canvas-container', $report).each(function (index, item) {
                        $(item).prev('.summary').addBack().wrapAll('<div class="pageHeaderWrapper"></div>');
                    });
                    $('.step-item-container', $report).each(function (index, item) {
                        $(item).find('.page-header').next().addBack().wrapAll('<div class="pageHeaderWrapper"></div>');
                    });

                    WebAPI.post('/admin/getReportPDF', {
                        html: $report.html(),
                        folder: reportFolderName,
                        version: version,
                        projectName: AppConfig.projectName
                    }).done(function (result) {
                        if (result.success) {
                            downloadPDF(result.data.createdPDF, pdfName);
                            _this.pdfMap = result.data.pdfMap;
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                }
            })
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
            //window.location.replace("#")
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
        getReportName: function () {
            if (!this.reportStringId) {
                return '';
            }
            if (!this.reportName) {
                for (var i = 0; i < AppConfig.navItems.length; i++) {
                    var navItem = AppConfig.navItems[i];
                    if (navItem.id === this.reportStringId) {
                        this.reportName = navItem.text;
                    }
                }
            }
            return this.reportName;
        },
        initReportList: function () {
            if (!AppConfig.navItems) {
                return false;
            }
            var reportItem,
                reportItemList,
                $reportItemBtn,
                _this = this,
                $listGroup = $('<ul id="reportNavList" class="list-group reportList" style="width:110px;overflow-y: auto;height: 90%;overflow-x: hidden;"></ul>');

            reportItemList = AppConfig.navItems.filter(function (item) {
                return item.type === 'ReportScreen';
            });

            for (var i = 0; i < reportItemList.length; i++) {
                reportItem = reportItemList[i];
                $reportItemBtn = $('<li class="list-group-item ellipsis" id="' + reportItem.id + '" title="' + reportItem.text + '">' + reportItem.text + '</li>');
                $reportItemBtn.click((function (reportItem) {
                    return function () {
                        ScreenManager.show(ReportScreen,
                            reportItem.id,
                            reportItem.reportType,
                            reportItem.reportFolder,
                            _this.reportDate ? _this.reportDate.format('yyyy-MM-dd') : null);
                    };
                })(reportItem));
                $listGroup.append($reportItemBtn);
            }
            $('#indexMain').append($listGroup);
            $("#" + _this.reportStringId).addClass("active");
            var $reportNavList = $("#reportNavList");
            $reportNavList.css({
                left: parseInt($(".step-container").offset().left) - parseInt($reportNavList.width()) + 1 + 'px'
            });
            $(window).resize(function () {
                $reportNavList.css({
                    left: parseInt($(".step-container").offset().left) - parseInt($reportNavList.width()) + 1 + 'px'
                });
            });
        },
        getReport: function (year, month, day, isWeekly) {
            var _this = this, version, thisDay;
            Spinner.spin(ElScreenContainer);
            var reportFolderName = this.getReportFolder();
            if (this.getReportType() === this.reportTypeMap.daily) {
                if (!month || !year || !day) {
                    thisDay = new Date();
                    thisDay.setDate(thisDay.getDate() - 1);
                    version = thisDay.format('yyyy-MM-dd');
                    year = thisDay.getFullYear();
                    month = thisDay.getMonth() + 1;
                    day = thisDay.getDate();
                } else {
                    version = year + "-" + StringUtil.padLeft(month, 2, '0') + "-" + StringUtil.padLeft(day, 2, '0');
                }
            }
            else if (this.getReportType() === this.reportTypeMap.monthly) {
                if (!month || !year) {
                    thisDay = new Date();
                    year = thisDay.getFullYear();
                    month = DateUtil.getLastMonth();
                }
                version = year + '-' + StringUtil.padLeft(month, 2, '0');
                //TODO 添加周视图请求处理
            } else {
                thisDay = new Date();
                year = thisDay.getFullYear();
                month = month ? month : (_this.iso8601Week(new Date(year, thisDay.getMonth() - 1)));
                version = year + '-' + month + '-w';
            }

            var getReportFailed = function () {
                WebAPI.get('/static/projectReports/emptyReport.html').done(function (resultHtml) {
                    I18n.fillArea($(ElScreenContainer).html(resultHtml));
                    if (day) {
                        day = day < 10 ? day.length == 2 ? day : '0' + day : day;
                    }
                    _this.initDatePicker(year, month, day);
                    BEOPUtil.setRelativePosition($(".step-container"), $(".reportNavigation"), 0, 50);
                    $(window).resize(function () {
                        BEOPUtil.setRelativePosition($(".step-container"), $(".reportNavigation"), 0, 50);
                    });
                    _this.initReportList();
                })
            };

            return WebAPI.get("/report/getReport/" + AppConfig.projectName + "/" + reportFolderName + '/' + version).done(function (resultHtml) {
                I18n.fillArea($(ElScreenContainer).html(resultHtml));
                _this.renderCharts($('#beopReport .report-unit'));
                _this.$reportNavigation = $('.reportNavigation');
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

                var $pdfContent = '<a id="exportPDF" class="pdf_download exportPDF pa"><span class="add-on"><img class="pdf_img" src="http://images.rnbtech.com.hk/static/images/pdf_download.png"　alt="PDF" /></span><span class="pdf_text" i18n="observer.reportScreen.PDF_DOWNLOAD"></span></a>';
                $(".reportNavigation").prepend($pdfContent);
                var $exportPDF = $('#beopReport #exportPDF');

                if (!$exportPDF.length) {
                    $('#beopReport').append($exportPDF);
                }
                $exportPDF.attr('reportFolderName', reportFolderName).attr('version', version);
                _this.initReportList();
            }).fail(function () {
                getReportFailed();
            }).always(function () {
                WebAPI.get("/report/getReportList/" + AppConfig.projectName + "/" + reportFolderName + '/' + version).done(function (result) {
                    if (result.success) {
                        _this.dateList = $.unique(result.data.htmlReport);
                        _this.pdfMap = result.data.pdfReportMap;
                    }
                });
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            });
        },
        addActiveWeeksStyle: function () {  // TODO 2-给有报表的周添加样式
            var $con = this.datePickerInstance.picker,
                yearMonth = this.datePickerInstance.viewDate.format('yyyy-MM').split('-'),
                year = yearMonth[0],
                i, timeList;
            this.filterDateList('week');
            for (i = 0; i < this.dateList.length; i++) {
                timeList = this.dateList[i].split('-');
                if (timeList[0] == year) {
                    $con.find('.datetimepicker-days table tbody td.ui-week-col').each(function () {
                        if ($(this).text() == timeList[1]) {
                            $(this).parent().addClass('hasReport');
                        }
                    });
                }
            }
        },
        addActiveDaysStyle: function () { //给有报表的天添加样式
            var $con = this.datePickerInstance.picker;
            var yearMonth = this.datePickerInstance.viewDate.format('yyyy-MM').split("-");
            var year = yearMonth[0];
            var month = yearMonth[1];
            this.filterDateList('day');
            for (var i = 0; i < this.dateList.length; i++) {
                var timeList = this.dateList[i].split("-");
                if (timeList[0] == year && timeList[1] == month) {
                    $con.find(".day:not('.old,.new')").eq(Number(timeList[2]) - 1).addClass("hasReport");
                }
            }
        },
        addActiveMonthsStyle: function () { //给有报表的月份添加样式
            var $con = this.datePickerInstance.picker;
            var year = this.datePickerInstance.viewDate.format('yyyy').split("-");
            this.filterDateList('month');
            for (var i = 0; i < this.dateList.length; i++) {
                var timeList = this.dateList[i].split("-");
                if (timeList[0] == year) {
                    $con.find(".month").eq(Number(timeList[1]) - 1).addClass("hasReport");
                }
            }
        },
        filterDateList: function (val) {
            var dayList = [];
            var monthList = [];
            var weekList = [];
            for (var i = 0; i < this.dateList.length; i++) {
                var timeList = this.dateList[i].split("-");
                //TODO  1-添加周判断
                if (timeList.length == 3 && this.getReportType() == this.reportTypeMap.weekly) {
                    weekList.push(this.dateList[i]);
                }
                else if (timeList.length > 2) {
                    dayList.push(this.dateList[i]);
                } else {
                    monthList.push(this.dateList[i]);
                }
            }
            if (val == "day") {
                this.dateList = dayList;
            } else if (val == 'month') {
                this.dateList = monthList;
            } else {
                this.dateList = weekList;
            }
        },
        triggerDateStyle: function (val) { //触发有报表日期的样式
            var _this = this;
            var t1 = null;
            t1 && clearTimeout(t1);
            t1 = setTimeout(function () {
                if (val == "day") {
                    _this.addActiveDaysStyle();
                } else if (val == "month") {
                    _this.addActiveMonthsStyle();
                } else if (val == 'weekly') {
                    _this.addActiveWeeksStyle();
                }
            }, 50);
        },
        iso8601Week: function (date) {
            var time,
                checkDate = new Date(date.getTime());

            // Find Thursday of this week starting on Monday
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

            time = checkDate.getTime();
            checkDate.setMonth(0); // Compare with Jan 1
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        renderCharts: function ($chartContainer) {
            var echartForI18Option = {};
            if (this.i18nEcharts) {
                echartForI18Option = {
                    toolbox: {
                        feature: {
                            mark: {
                                show: true,
                                title: {
                                    mark: this.i18nEcharts.MARK,
                                    markUndo: this.i18nEcharts.MARKUNDO,
                                    markClear: this.i18nEcharts.MARKCLEAR
                                }
                            },
                            dataZoom: {
                                title: {
                                    dataZoom: this.i18nEcharts.DATAZOOM,
                                    dataZoomReset: this.i18nEcharts.DATAZOOMRESET
                                }
                            },
                            dataView: {
                                title: this.i18nEcharts.DATAVIEW,
                                lang: [this.i18nEcharts.DATAVIEW, this.i18nEcharts.CLOSE, this.i18nEcharts.REFRESH],
                                show: true,
                                readOnly: true
                            },
                            magicType: {
                                title: {
                                    line: this.i18nEcharts.LINE,
                                    bar: this.i18nEcharts.BAR,
                                    stack: this.i18nEcharts.STACK,
                                    tiled: this.i18nEcharts.TILED,
                                    force: this.i18nEcharts.FORCE,
                                    chord: this.i18nEcharts.CHORD,
                                    pie: this.i18nEcharts.PIE,
                                    funnel: this.i18nEcharts.FUNNEL
                                }
                            },
                            restore: {
                                show: true,
                                title: this.i18nEcharts.REDUCTION
                            },
                            saveAsImage: {
                                show: true,
                                title: this.i18nEcharts.SAVE_AS_PICTURE,
                                lang: [this.i18nEcharts.SAVE]
                            }
                        }
                    }
                };
            }
            this.baseChartOption = $.extend(true, this.baseChartOption, echartForI18Option);
            var charts = $chartContainer.find('.chart-param');
            for (var i = 0; i < charts.length; i++) {
                this.initCharts($(charts[i]));
            }
        },
        initDatePicker: function (year, month, day) {
            var now = new Date();
            var year = !year ? now.getFullYear() : year;
            var monthNameShort = !month ? DateUtil.getMonthNameShort(DateUtil.getLastMonth() - 1) : DateUtil.getMonthNameShort(month - 1);
            var monthName = !month ? DateUtil.getMonthName(DateUtil.getLastMonth() - 1) : DateUtil.getMonthName(month - 1);
            var day = !day ? now.getDate() : day;
            var $datePick = $(".form_datetime");
            var _this = this;
            var dateDisplay;


            if (this.getReportType() == this.reportTypeMap.daily) {
                $datePick.find('input').val(monthNameShort + ' ' + day + ',' + year);
                $datePick.datetimepicker({
                    format: "MM dd,yyyy",
                    minView: "month",
                    startView: "month",
                    todayBtn: true,
                    autoclose: true,
                    endDate: new Date()
                }).on('changeDate', function (ev) {
                    try {
                        var date = ev.date.valueOf().toDate();
                        _this.reportDate = date;
                        _this.getReport(date.getFullYear(), date.getMonth() + 1, date.getDate());
                    } catch (e) {
                        return false;
                    }
                }).on('changeYear changeMonth', function (ev) {
                    _this.triggerDateStyle('day');
                }).on('show', function (ev) {
                    var dayFormat = ev.date.getDate() >= 10 ? ev.date.getDate() : '0' + ev.date.getDate();
                    dateDisplay = DateUtil.getMonthNameShort(ev.date.getMonth()) + ' ' + dayFormat + ',' + ev.date.getFullYear();
                    $datePick.find('input').val(dateDisplay);
                    _this.addActiveDaysStyle();
                    _this.datePickerInstance.picker.find(".prev,.next").click(function () {
                        _this.triggerDateStyle('day');
                    });
                });
            } else if (this.getReportType() == this.reportTypeMap.monthly) {
                $datePick.find('input').val(monthNameShort + ',' + year);
                $datePick.datetimepicker({
                    format: "MM,yyyy",
                    minView: "year",
                    startView: "year",
                    todayBtn: true,
                    autoclose: true,
                    endDate: new Date(),
                    monthAbbreviation: true
                }).on('changeDate', function (ev) {
                    try {
                        var date = ev.date.valueOf().toDate();
                        _this.reportDate = date;
                        _this.getReport(date.getFullYear(), date.getMonth() + 1);
                    } catch (e) {
                        return false;
                    }
                }).on('changeYear changeMonth', function (ev) {
                    _this.triggerDateStyle('month');
                }).on('show', function (ev) {
                    dateDisplay = DateUtil.getMonthNameShort(ev.date.getMonth()) + ',' + ev.date.getFullYear();
                    $datePick.find('input').val(dateDisplay);
                    _this.addActiveMonthsStyle();
                    _this.datePickerInstance.picker.find(".prev,.next").click(function () {
                        _this.triggerDateStyle('month');
                    });
                });
                //TODO 增加weekly
            } else if (this.getReportType() == this.reportTypeMap.weekly) {
                var week;

                if (this.week != null) {
                    week = this.week;
                } else if (this.getMonthFirst = true) {
                    var date = new Date();
                    week = this.iso8601Week(new Date(date.getFullYear(), date.getMonth() - 1));
                } else {
                    week = this.iso8601Week(new Date(year, ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName)));
                }
                this.getMonthFirst = false;
                if (this.currentYear) {
                    year = this.currentYear;
                }
                $datePick.find('input').val(year + '-' + week + '-周');
                $datePick.datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    todayBtn: true,
                    autoclose: true,
                    showWeek: true,
                    minView: 2,
                    endDate: new Date()
                }).on('changeYear changeMonth', function (ev) {
                    _this.triggerDateStyle('weekly');
                }).on('show', function (ev) {
                    _this.addActiveWeeksStyle();
                    //判断是第几行，由changeDay事件触发
                    if (_this.currentTR) {
                        if (_this.currentDatePicker) {
                            //判断是否是回到今天
                            if (!_this.currentGoToday) {
                                $datePick.datetimepicker('update', new Date(_this.currentDatePicker).format('yyyy-MM-dd'));
                                _this.addActiveWeeksStyle();
                                $('.datetimepicker:last .datetimepicker-days table tbody tr').eq(_this.currentTR).addClass('active');
                            } else {
                                var weekNow = _this.iso8601Week(new Date()) - 1;
                                $('.datetimepicker .datetimepicker-days table tbody').find('td').each(function () {
                                    if ($(this).text() == weekNow) {
                                        $(this).parent().addClass('active');
                                    }
                                });
                                _this.currentGoToday = false;
                            }
                            _this.addActiveWeeksStyle();
                        }
                        //是不是第一次打开的时候
                    } else {
                        if (_this.firstOpen) {
                            $datePick.datetimepicker('update', new Date(year, date.getMonth() - 1).format('yyyy-MM-dd'));
                            _this.addActiveWeeksStyle();
                        } else {
                            var weekNow = _this.iso8601Week(new Date()) - 1;
                            $('.datetimepicker .datetimepicker-days table tbody').find('td').each(function () {
                                if ($(this).text() == weekNow) {
                                    $(this).parent().addClass('active');
                                }
                            });
                        }
                    }
                    dateDisplay = DateUtil.getMonthName(ev.date.getMonth()) + ',' + ev.date.getFullYear();
                    _this.datePickerInstance.picker.find(".prev,.next").click(function () {
                        _this.triggerDateStyle('weekly');
                    });
                }).on('changeDay', function (date) {
                    //TODO 更改获取报表的方式
                    try {
                        _this.reportDate = date.date;
                        _this.getReport(new Date(date.date).getFullYear(), date.week, null, true);
                        _this.week = date.week;
                        _this.currentTR = date.currentTr;
                        _this.currentDatePicker = date.date;
                        _this.currentYear = new Date(date.date).getFullYear();
                    } catch (e) {
                        return false;
                    }
                }).on('goToToday', function (date) {
                    _this.currentGoToday = false;
                    _this.firstOpen = false;
                    try {
                        _this.reportDate = date.date;
                        _this.getReport(new Date(date.date).getFullYear(), date.week, null, true);
                        _this.week = date.week;
                        _this.currentTR = date.currentTr;
                        _this.currentDatePicker = date.date;
                        _this.currentYear = new Date(date.date).getFullYear();
                    } catch (e) {
                        return false;
                    }
                });
            }
            this.datePickerInstance = $datePick.data('datetimepicker');
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
            if (chartOpts.theme) {
                chartInstance.setTheme(chartOpts.theme);
            }
            if (chartInstance) {
                chartInstance.on(echarts.config.EVENT.MAGIC_TYPE_CHANGED, function (event, chart) {

                    if (event.magicType.line) {
                        chart.setOption({
                            tooltip: {
                                axisPointer: {
                                    type: 'line'
                                }
                            }
                        })
                    } else if (event.magicType.bar) {
                        chart.setOption({
                            tooltip: {
                                axisPointer: {
                                    type: 'shadow'
                                }
                            }
                        })
                    }
                });
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
                unitString = unitString.replace(/"/g, "\\\"").replace(/'/g, "\"");
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

                    if (yItem.stack) {
                        seriesItem.stack = yItem.stack;
                    }

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
                    if (yItem.otherOptions) {
                        $.extend(seriesItem, yItem.otherOptions);
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
                            type: 'value',
                            scale: true
                        };
                        if (!BEOPUtil.isUndefined(chartParam.yMax) && chartParam.yMax.length) {
                            yAxisItem.max = +chartParam.yMax[i];
                            yAxisItem.scale = false;
                        }
                        if (!BEOPUtil.isUndefined(chartParam.yMin) && chartParam.yMin.length) {
                            yAxisItem.min = +chartParam.yMin[i];
                            yAxisItem.scale = false;
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
            if (chartParam.commonChartOptions) {
                var convertTheFunction = function (obj) {
                    for (var prop in obj) {
                        if (typeof obj[prop] === 'string' && obj[prop].indexOf('function(') != -1) {
                            obj[prop] = eval(obj[prop]);
                        } else if ($.isPlainObject(obj[prop])) {
                            convertTheFunction(obj[prop]);
                        }
                    }
                };
                try {
                    convertTheFunction(chartParam.commonChartOptions);
                    $.extend(result, chartParam.commonChartOptions);
                } catch (e) {
                }
            }
            return result;
        },
        _sortFunction: function (a, b) {
            var ax = [], bx = [];

            a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                ax.push([$1 || Infinity, $2 || ""])
            });
            b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                bx.push([$1 || Infinity, $2 || ""])
            });

            while (ax.length && bx.length) {
                var an = ax.shift();
                var bn = bx.shift();
                var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn) return nn;
            }

            return ax.length - bx.length;
        },
        _sortLegend: function (legend) {
            if (!legend) {
                return [];
            }
            legend.sort(this._sortFunction);
            var ret = [], splitNum;
            if (legend.length > 15) {
                splitNum = Math.ceil(legend.length / 3);
            } else {
                splitNum = 5;
            }
            for (var i = 0, j = legend.length; i < j; i++) {
                ret.push(legend[i]);
                if ((i + 1) % splitNum === 0) {
                    ret.push('');
                }
            }
            return ret;
        },
        initChartLine: function (chartDom, chartParam) {
            var _this = this;
            var defaultOption = {
                toolbox: {
                    feature: {
                        magicType: {
                            show: true,
                            type: ['line', 'bar', 'stack', 'tiled']
                        }, dataView: {
                            show: true,
                            readOnly: true,
                            optionToContent: _this.optionToContent
                        }
                    }
                }
            };
            var option = $.extend(true, defaultOption, this.baseChartOption, this.chartYOffsetSetting, this.getChartOptsFromParam(chartParam, this.chartType.line));

            return echarts.init(chartDom).setOption(option);
        },

        initChartPie: function (chartDom, chartParam) {
            var _this = this;
            var defaultOption = {
                toolbox: {
                    feature: {
                        dataView: {
                            show: true,
                            readOnly: true,
                            optionToContent: _this.pieOptionToContent
                        }
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    y: 40
                }
            };
            var option = $.extend(true, defaultOption, this.getChartOptsFromParam(chartParam, this.chartType.pie), this.baseChartOption);
            if (!option.tooltip.formatter || $.isEmptyObject(option.tooltip.formatter)) {
                $.extend(true, option, {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/> {b} : {c} ({d}%)"
                    }
                })
            }
            return echarts.init(chartDom).setOption(option);
        },

        initChartBar: function (chartDom, chartParam) {
            var _this = this;
            var defaultOption = {
                toolbox: {
                    feature: {
                        magicType: {
                            show: true,
                            type: ['line', 'bar', 'stack', 'tiled']
                        },
                        dataView: {
                            show: true,
                            readOnly: true,
                            optionToContent: _this.optionToContent
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            };
            var option = $.extend(true, defaultOption, this.baseChartOption, this.chartYOffsetSetting, this.getChartOptsFromParam(chartParam, this.chartType.bar));
            return echarts.init(chartDom).setOption(option);
        },

        initChartScatter: function (chartDom, chartParam) {
            var _this = this;
            var defaultOption = {
                toolbox: {
                    feature: {
                        dataView: {
                            show: true,
                            readOnly: true,
                            optionToContent: _this.optionToContent
                        }
                    }
                }
            };
            var option = $.extend(true, defaultOption, this.baseChartOption, this.chartYOffsetSetting, this.getChartOptsFromParam(chartParam, this.chartType.scatter));
            return echarts.init(chartDom).setOption(option);
        },

        initChartArea: function (chartDom, chartParam) {
            var _this = this;
            var defaultOption = {
                toolbox: {
                    feature: {
                        dataView: {
                            show: true,
                            readOnly: true,
                            optionToContent: _this.optionToContent
                        }
                    }
                }
            };
            var option = $.extend(true, defaultOption, this.baseChartOption, this.chartYOffsetSetting, this.getChartOptsFromParam(chartParam, this.chartType.area));
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
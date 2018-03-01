(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'wf.report.components.Block']);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('wf.report.components.Block'));
    } else {
        factory(
            root,
            namespace('factory.report.components.Block')
        );
    }
} (namespace('factory.report.components'), function (exports, Super) {

    function DiagnosisBlock() {
        Super.apply(this, arguments);
    }

    DiagnosisBlock.prototype = Object.create(Super.prototype);
    DiagnosisBlock.prototype.constructor = DiagnosisBlock;

    +function () {
        /**
         * @override
         */
        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.DIAGNOSIS_BLOCK',
            type: 'DiagnosisBlock',
            spanC: 12,
            spanR: 4,
            className: 'block-container'
        });

        /**
         * @override
         */
        this.configModalType = 'Block';

        /** @override */
        this.refreshTitle = function (chapterNo) {
            Super.prototype.refreshTitle.apply(this, [chapterNo, true]);
        };

        // 支持的小节类型
        this.SUPPORT_SUBUNIT_TYPE = {
            PIE: 'pie',
            LINE: 'line',
            SCATTER: 'scatter',
            BAR: 'bar',
            AREA: 'area',
            TABLE: 'table',
            TEXT: ''
        };

        // 公共图表配置
        this.baseChartOptions = {
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
                feature: {},
                showTitle: true,
                right: 40
            },
            animation: false
        };

        // 直角系系图表配置
        this.axisChartOptions = $.extend(false, {
            yAxis:{
                splitLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            }
        }, this.baseChartOptions);

        this.chartYOffsetSetting = {
            grid: {
                y: 100
            },
            legend: {
                y: 40
            }
        };

        this.initI18n = function () {
            var i18nEcharts = I18n.resource.echarts;
            if (i18nEcharts) {
                this.baseChartOptions.toolbox.feature = {
                    mark: {
                        show: true,
                        title: {
                            mark: i18nEcharts.MARK,
                            markUndo: i18nEcharts.MARKUNDO,
                            markClear: i18nEcharts.MARKCLEAR
                        }
                    },
                    dataZoom: {
                        title: {
                            zoom: i18nEcharts.DATAZOOM,
                            back: i18nEcharts.DATAZOOMRESET
                        }
                    },
                    dataView: {
                        title: i18nEcharts.DATAVIEW,
                        lang: [i18nEcharts.DATAVIEW, i18nEcharts.CLOSE, i18nEcharts.REFRESH],
                        show: true,
                        readOnly: true
                    },
                    magicType: {
                        title: {
                            line: i18nEcharts.LINE,
                            bar: i18nEcharts.BAR,
                            stack: i18nEcharts.STACK,
                            tiled: i18nEcharts.TILED,
                            force: i18nEcharts.FORCE,
                            chord: i18nEcharts.CHORD,
                            pie: i18nEcharts.PIE,
                            funnel: i18nEcharts.FUNNEL
                        }
                    },
                    restore: {
                        show: true,
                        title: i18nEcharts.REDUCTION
                    },
                    saveAsImage: {
                        show: true,
                        title: i18nEcharts.SAVE_AS_PICTURE,
                        lang: [i18nEcharts.SAVE]
                    }
                };
            }
        };
        
        this.showNoData = function () {
            var str = '<div style="margin: 0 auto;width: 500px;height: 160px;margin-top:200px;">\
                            <img src="/static/images/project_img/report.png" alt="report">\
                            <div style="display:inline-block;margin-left:50px;"><p><strong i18n="observer.reportScreen.REPORT_FAIL_INFO">当前报表尚未生成</strong></p></div>\
                        </div>'
            $(this.container).html(str);  
        };
        /**
         * @override
         */
        this.formatBlockData = function (data) {
            if (data.type && data.type === 'DiagnosisReport') {
                return this.transformData(data.content);
            } else {
                return Super.formatBlockData.apply(this, arguments);
            }
        };
        
        this.transformData = function (content) {
            var layouts = [];
            try {
                content = JSON.parse(content);
            } catch (e) {
                Log.error('诊断数据解析时发生错误!');
                return;
            }

            this.initI18n();

            content.forEach(function (chapter) {
                layouts = layouts.concat(this.transformChapterToChapterContainer(chapter));
            }, this);

            return layouts;
        };

        this.transformChapterToChapterContainer = function (chapter) {
            var data = chapter.name ? this.getChapterContainerTpl({
                chapterTitle: chapter.name
            }) : [];
            var chapterLayouts = Array.isArray(data) ? data : data.modal.option.layouts;
            var layouts;

            chapter.units.forEach(function (unit) {
                var container;
                if (unit.unitName) {
                    container = this.getChapterContainerTpl({
                        chapterTitle: unit.unitName
                    });
                    chapterLayouts.push(container);
                    layouts = container.modal.option.layouts;
                } else {
                    layouts = chapterLayouts;
                }
                unit.subUnits.forEach(function (subUnit) {
                    layouts.push( this.transformToHtml(subUnit) );
                }, this);
            }, this);

            return data;
        };

        this.transformToHtml = function (subUnit) {
            var data = this.getHtmlTpl({
                html: '<div class="summary">'+subUnit.summary+'</div>',
                css: '.summary{font-size: 15px; padding: 0 25px 30px 25px; color: #555;}',
                js: "var _v=_variables;if (!_v.type || _v.type==='table'){_container.insertAdjacentHTML('beforeend', JSON.parse(_v.options));}else{var domChart=document.createElement('div'); domChart.className='canvas-container'; domChart.style.height='550px';_container.appendChild(domChart); echarts.init(domChart).setOption( JSON.parse(_v.options) );}",
                variables: {
                    type: subUnit.type
                }
            }), option;

            switch(subUnit.type) {
                case this.SUPPORT_SUBUNIT_TYPE.LINE:
                    option = this.getLineChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.PIE:
                    option = this.getPieChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.BAR:
                    option = this.getBarChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.SCATTER:
                    option = this.getScatterChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.AREA:
                    option = this.getAreaChartOptions(subUnit);
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.TABLE:
                    option = this.getTableOptions(subUnit);
                    break;
                // 为空则不做任何事
                case this.SUPPORT_SUBUNIT_TYPE.TEXT:
                    data.modal.option.js = '';
                    data.modal.variables = {};
                    break;
                default:
                    Log.error('不支持的小节类型：' + subUnit.type);
                    break;
            }
            option && (data.modal.variables.options = JSON.stringify(option));

            return data;
        };

        this.getChapterContainerTpl = function (params) {
            return {
                id: ObjectId(),
                modal: {
                    option: {
                        chapterTitle: params.chapterTitle,
                        layouts: []
                    },
                    type: 'ChapterContainer'
                },
                spanC: 12,
                spanR: 3
            };
        };

        this.getHtmlTpl = function (params) {
            return {
                id: ObjectId(),
                modal: {
                    option: {
                        html: params.html || '',
                        css: params.css || '',
                        js: params.js || ''
                    },
                    variables: params.variables || {},
                    type: 'Html'
                },
                spanC: 12,
                spanR: 6
            }
        };

        /**
         * 获取图表 - 折线图的配置信息
         * 
         * @param {object} subUnit 小节的 json 数据
         * @returns 折线图的配置信息
         */
        this.getLineChartOptions = function (subUnit) {
            var _this = this;
            var x = subUnit.chartItems, y = subUnit.chartItems.y;
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

            if ((subUnit.yMin && subUnit.yMin.length) || (subUnit.yMax && subUnit.yMax.length)) {
                defaultOption.tooltip = {
                    formatter: function (params) {
                        var tooltipReturnData = '';
                        tooltipReturnData += x.x[params[0].dataIndex] + '<br/>';
                        for (var i = 0; i < params.length; i++) {
                            for (var j = 0; j < y.length; j++) {
                                if (y[j].name == params[i].seriesName) {
                                    tooltipReturnData += '<div style="display:inline-block;width:10px;width:10px;margin-right:4px;height:10px;border-radius:5px;background-color:' + params[i].color + '"></div>' + params[i].seriesName + ' :' + y[j].value[params[i].dataIndex] + '<br />';
                                    break;
                                }
                            }
                        }
                        return tooltipReturnData;
                    }
                }
            }

            return $.extend(true, defaultOption, this.axisChartOptions, this.chartYOffsetSetting, this.getChartOptsFromParam(subUnit, this.SUPPORT_SUBUNIT_TYPE.LINE));
        };

        
        this.getPieChartOptions = function (subUnit) {
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
            var option = $.extend(true, defaultOption, this.baseChartOptions, this.getChartOptsFromParam(subUnit, this.SUPPORT_SUBUNIT_TYPE.PIE));

            if (!option.tooltip.formatter || $.isEmptyObject(option.tooltip.formatter)) {
                $.extend(true, option, {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/> {b} : {c} ({d}%)"
                    }
                })
            }
            return option;
        };

        this.getBarChartOptions = function (subUnit) {
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
            var option = $.extend(true, defaultOption, this.baseChartOptions, this.chartYOffsetSetting, this.getChartOptsFromParam(subUnit, this.SUPPORT_SUBUNIT_TYPE.BAR));
            
            if (option.yAxis && option.yAxis.length == 1) {
                delete option.yAxis.scale;
            }
            return option;
        };

        this.getScatterChartOptions = function () {};

        this.getAreaChartOptions = function () {};

        this.getTableOptions = function (subUnit) {
            var arrHtml = ['<table class="table table-bordered table-striped report-table">'];
            var items = subUnit.chartItems;

            // 拼接 thead
            arrHtml.push('<thead><tr>');
            // 第一行第一列
            if (subUnit.Options && subUnit.Options.x && subUnit.Options.x.length) {
                arrHtml.push('<th>'+subUnit.Options.x.toString()+'</th>');
            } else {
                arrHtml.push('<th></th>');
            }
            items.x.forEach(function (row) {
                arrHtml.push('<th>'+row+'</th>');
            });
            arrHtml.push('</tr></thead>');

            // 拼接 tbody
            arrHtml.push('<tbody>');
            if (items.yOrder && items.yOrder.length) {
                items.y.sort(function (x, y) {
                    return items.yOrder.indexOf(x.name) - items.yOrder.indexOf(y.name);
                });
            }
            items.y.forEach(function (row) {
                arrHtml.push('<tr><td>'+row.name+'</td>');
                row.value.forEach(function (col) {
                    arrHtml.push('<td>'+col+'</td>');
                });
                arrHtml.push('</tr>');
            });
            arrHtml.push('</tbody></table>');

            return arrHtml.join('');
        };

        this.getChartSeriesData = function (type, x, yData, y) {
            var result = [];

            switch (type) {
                case this.SUPPORT_SUBUNIT_TYPE.BAR:
                case this.SUPPORT_SUBUNIT_TYPE.LINE:
                case this.SUPPORT_SUBUNIT_TYPE.SCATTER:
                case this.SUPPORT_SUBUNIT_TYPE.AREA:
                    result = yData;
                    break;
                case this.SUPPORT_SUBUNIT_TYPE.PIE:
                    for (var i = 0; i < y.length; i++) {
                        result.push({name: y[i].name, value: y[i].value})
                    }
                    break;
                default :
                    result = yData;
            }
            return result;
        };

        /**
         * 饼图的数据视图处理
         * 
         * @param {object} opt dataView 配置传过来的参数
         * @returns
         */
        this.pieOptionToContent = function (opt) {
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
        };

        
        /**
         * 通用图表的数据视图处理（不包括饼图）
         * 
         * @param {object} opt dataView 配置传过来的参数
         * @returns
         */
        this.optionToContent = function (opt) {
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
        };

        this._sortFunction = function (a, b) {
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
        };

        this._sortLegend = function (legend) {
            var ret = [], splitNum;

            if (!legend) {
                return [];
            }
            legend.sort(this._sortFunction);
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
        };

        this.getChartOptsFromParam = function (chartParam, type) {
            var y = chartParam.chartItems.y,
                x = chartParam.chartItems.x,
                series = [], legend = [],
                chartSeriesData = [], yItem,
                seriesItem, result, yAxis = [],
                _this = this;
            var sortedLegend;

            if (type === this.SUPPORT_SUBUNIT_TYPE.PIE) {
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
                        var obj = {name: key, value: y[key], yAxisIndex: 0};
                        temp.push(obj);
                    }
                    y = temp;
                }
                for (var m = 0, noMaxNoMinchartSeriesData = [], length = y.length; m < length; m++) {
                    yItem = y[m];
                    seriesItem = {};
                    seriesItem.yAxisIndex = Number(yItem.yAxisIndex) || 0;
                    seriesItem.name = yItem.name;
                    chartSeriesData = this.getChartSeriesData(type, x, yItem.value, yItem);
                    if ((chartParam.yMax && chartParam.yMax.length) || (chartParam.yMin && chartParam.yMin.length)) {
                        noMaxNoMinchartSeriesData = [];
                        for (var i = 0, chartDataPush, iLen = chartSeriesData.length; i < iLen; i++) {
                            chartParam.yMax.length ? chartDataPush = Math.min(chartParam.yMax, chartSeriesData[i]) : '';
                            chartParam.yMin.length ? (chartDataPush = chartParam.yMax.length ? Math.max(chartParam.yMin, chartDataPush) : Math.max(chartParam.yMin, chartSeriesData[i])) : '';
                            noMaxNoMinchartSeriesData.push(chartDataPush);
                        }
                        seriesItem.data = noMaxNoMinchartSeriesData;
                    } else {
                        seriesItem.data = chartSeriesData;
                    }
                    if (yItem.stack) {
                        seriesItem.stack = yItem.yAxisIndex + yItem.stack;
                    }

                    if (type === this.SUPPORT_SUBUNIT_TYPE.AREA) {
                        seriesItem.type = this.SUPPORT_SUBUNIT_TYPE.LINE;
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

                // 处理图表（饼图除外，饼图目前是不需要根据 yOrder 进行排序的）
                if (chartParam.chartItems && chartParam.chartItems.yOrder && chartParam.chartItems.yOrder.length) {
                    sortedLegend = chartParam.chartItems.yOrder;
                } else {
                    sortedLegend = this._sortLegend(legend);
                }
            }

            if (yAxis && yAxis.length === 1) {
                yAxis = yAxis[0];
            }

            result = {
                title: {
                    text: chartParam.title
                },
                noDataLoadingOption: {
                    text: I18n.resource.report.diagnosisBlockConfig.TITLE_NO_DATA,
                    effect: 'whirling'
                },
                legend: {data: sortedLegend, padding: [-10, 5, 0, 10], itemHeight: 10},
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


            if (result.xAxis && result.xAxis.length == 1) {
                result.xAxis = result.xAxis[0];
            }

            if (type === this.SUPPORT_SUBUNIT_TYPE.PIE) {
                delete result.xAxis;
                delete result.yAxis;
            }
            if (chartParam.commonChartOptions) {
                var convertTheFunction = function (obj) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            if (typeof obj[prop] === 'string' && obj[prop].indexOf('function(') != -1) {
                                obj[prop] = eval(obj[prop]);
                            } else if ($.isPlainObject(obj[prop])) {
                                convertTheFunction(obj[prop]);
                            }
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
        };

    }.call(DiagnosisBlock.prototype);

    exports.DiagnosisBlock = DiagnosisBlock;
}));
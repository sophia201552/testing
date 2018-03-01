
;(function (exports, SuperClass) {

    function Chart() {
        SuperClass.apply(this, arguments);

        this.store = null;
    }

    Chart.prototype = Object.create(SuperClass.prototype);

    +function () {

        var DEFAULT_CHART_OPTIONS = {
                title : {
                    text: '',
                    subtext: '',
                    x:'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    y: 'top',
                    data: []
                },
                grid: {
                    y: 50,
                    x2: 30,
                    y2: 25
                },
                toolbox: {
                    show: false
                },
                color: ['#e84c3d', '#1abc9c', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'value'
                }]
            };

        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: '图表',
            minWidth: 3,
            minHeight: 2,
            maxWidth: 12,
            maxHeight: 15,
            type: 'Chart'
        });

        /** @override */
        this.resize = function () {
            SuperClass.prototype.resize.call(this);
            if (this.chart) {
                this.__renderChart();
            }
        };

        this.__renderChart = function () {
            var options = this.entity.modal.option;
            var series = [];
            var rs = this.store;
            var chartOptions = this.__getChartOptions();

            rs.list.forEach(function (row) {
                series.push({
                    type: options.chartType,
                    data: row.data
                });
            });
            // 默认显示昨天24小时的数据
            if (this.chart) {
                this.chart.dispose();
            }

            // 加上数据
            chartOptions['xAxis'][0].data = rs.timeShaft;
            chartOptions['series'] = series;

            this.chart = echarts.init(this.container);
            this.chart.setOption( chartOptions );
        };

        this.__getChartOptions = function () {
            var options = DEFAULT_CHART_OPTIONS;
            var userOptions = new Function ('return ' + this.entity.modal.option.chartOptions)();

            return $.extend(true, options, userOptions);
        };

        /** @override */
        this.getTplParams = function () {
            var str = (this.entity.modal.points || []).join(',');
            var pattern = this.TPL_PARAMS_PATTERN;
            var match = null;
            var params = [];

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }

            return params;
        };

        /** @override */
        this.render = function () {
            var options = this.entity.modal.option;

            if (!this.entity.modal.points || !this.entity.modal.points.length) {
                return;
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: this.__getTplParamsAttachedPoints(),
                timeStart: '2016-03-10 00:00:00',
                timeEnd: '2016-03-11 00:00:00',
                timeFormat: options.timeFormat
            }).done(function (rs) {
                this.store = rs;
                this.__renderChart();
            }.bind(this));
        };

        // 获取替换模板参数后的 points
        this.__getTplParamsAttachedPoints = function () {
            var _this = this;
            var points = this.entity.modal.points;
            var pattern = this.TPL_PARAMS_PATTERN;

            if (!this.entity.modal.option.tplParams || points.length <= 0) {
                return points;
            } else {
                return points.join(',').replace(pattern, function ($0, $1) {
                    return _this.tplParams[$1] || '';
                }).split(',');
            }
        };

    }.call(Chart.prototype);

    exports.Chart = Chart;

} ( namespace('factory.report.components'), namespace('factory.report.components.Base') ));
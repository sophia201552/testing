;(function (exports, SuperClass, ChartThemeConfig) {

    function Chart() {
        SuperClass.apply(this, arguments);

        this.store = null;
        this.chart = null;
        this.pointsSet = null;
    }

    Chart.prototype = Object.create(SuperClass.prototype);

    +function () {
        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.optionModal.ECHARTS',
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
                this.__renderChart({
                    animation: false
                });
            }
        };

        this.__renderChart = function (extendOptions) {
            var rs = this.store;
            var chartOptions = $.extend(false, this.__getChartOptions(), extendOptions);
            if(chartOptions.customFormat){
                chartOptions.xAxis.forEach(function(row) {
                    if (row.data && row.data.length) {
                        row.data = row.data.map(function(it, i) {
                            return timeFormat(it, chartOptions.customFormat);
                        });
                    }
                });
            }
            if (this.chart) {
                this.chart.dispose();
            }

            if (chartOptions.series.length === 0) {
                return;
            }

            this.chart = echarts.init(this.container);
            this.chart.setOption( chartOptions );
        };

        this.__getChartOptions = function () {
            var _this = this;
            var options;
            var moduleOptions = this.entity.modal.option;
            var data = this.store;
            var legend, series;

            if (moduleOptions.chartType === 'pie') {
                options = $.extend(true, {}, ChartThemeConfig.PIE_CHART_OPTIONS, new Function('return ' + this.entity.modal.option.chartOptions)());
                
                if (AppConfig.isMobile) {//手机APP上的饼图取消图例 并改变高度
                    $(this.container).closest('.report-container-wrap').css('height','240px');
                    options.legend.data = [];
                    options.title.textStyle.color = '#d8d6df';
                }
            } else {
                options = $.extend(true, {}, ChartThemeConfig.AXIS_CHART_OPTIONS, new Function('return ' + this.entity.modal.option.chartOptions)());
                
                if (AppConfig.isMobile&&_this.variables.a) {//手机APP上的对横坐标的修改
                    options.xAxis.forEach(function (row) {
                        row.data = _this.variables.a.timeShaft;
                        row.axisLabel = row.axisLabel || {};
                        row.axisLabel.rotate = 270;
                        delete row.name;
                        row.axisLabel.textStyle = row.axisLabel.textStyle || {};
                        row.axisLabel.textStyle.color = '#d8d6df';
                        row.data.textStyle = row.data.textStyle || {};
                        row.data.textStyle.color = '#d8d6df';
                    });
                    options.yAxis.forEach(function (row) {
                        row.nameTextStyle = row.nameTextStyle || {};
                        row.nameTextStyle.color = '#d8d6df';
                        row.axisLabel = row.axisLabel || {};
                        row.axisLabel.textStyle = row.axisLabel.textStyle || {};
                        row.nameLocation = 'middle';
                        row.axisLabel.textStyle.color = '#d8d6df';
                    });
                    options.legend.textStyle = options.legend.textStyle || {};
                    options.title.textStyle.color = '#d8d6df';
                }
                options.xAxis.forEach(function (row) {
                    if (typeof row.data === 'function') {
                        try {
                            row.data = row.data.call(null, data, _this.variables);
                        } catch(e) {
                            row.data = [];
                        }
                    }
                });
                // 处理纵坐标
                options.yAxis.forEach(function (row) {
                    if (typeof row.data === 'function') {
                        try {
                            row.data = row.data.call(null, data, _this.variables);
                        } catch(e) {
                            row.data = [];
                        }
                    }
                });  
            }

            // 处理图例
            if (typeof options.legend.data === 'function') {
                try {
                    options.legend.data = options.legend.data.call(null, data, _this.variables);
                } catch(e) {
                    options.legend.data = [];
                }
            }
            // 处理 series
            options.series.forEach(function (row) {
                if (typeof row.data === 'function') {
                    try {
                        row.data = row.data.call(null, data, _this.variables);
                    } catch(e) {
                        row.data = [];                        
                    }
                }
            });

            // 直角系的数据填充
            if (moduleOptions.chartType !== 'pie') {
                // 部分重要配置没有时，进行默认的数据填充
                if (options.series.length === 0) {
                    series = [];
                    Object.keys(data.list).forEach(function (id) {
                        var row = data.list[id];
                        series.push({
                            type: moduleOptions.chartType,
                            data: row.data,
                            yAxisIndex: _this.pointsSet[id],
                        });
                    });
                    // 数据填充
                    options['xAxis'][0].data = data.timeShaft;
                    options['series'] = series;
                }
                if (options.legend.data.length === 0) {
                    var dsInfo, legend = [];
                    if (moduleOptions.legend && moduleOptions.legend.length) {
                        legend = moduleOptions.legend;
                        // 处理 series 中的 name
                        moduleOptions.legend.forEach(function (row, i) {
                            options['series'][i] && (options['series'][i].name = row);
                        });
                    } else {
                        dsInfo = AppConfig.datasource.getDSItemById( Object.keys(data.list) );
                        // 为防止返回数组 dsInfoArr 的顺序和请求时发送的数据源 id 数组不一致，做以下处理
                        dsInfo = Array.toMap(dsInfo, 'id');
                        Object.keys(data.list).forEach(function (dsId, i) {
                            var alias = dsInfo[dsId] ? (dsInfo[dsId].alias || dsId) : dsId;
                            options['series'][i].name = alias;
                            legend.push(alias);
                        });
                    }
                    options['legend'].data = legend;
                }
            }

            return options;
        };

        /** @override */
        this.getTplParams = function () {
            var str = (this.entity.modal.points || []).join(',');
            var pattern = this.TPL_PARAMS_PATTERN;
            var match = null;
            var params = SuperClass.prototype.getTplParams.call(this);

            while( match = pattern.exec(str) ) {
                params.push(match[1]);
            }
            return params;
        };

        /** @override */
        this.render = function (isProcessTask) {
            var promise = $.Deferred();

            this.registVariableProcessTask(this.getVariables()).done(function () {
                promise.resolve();
            }.bind(this));

            promise.done(function () {
                var points = this.entity.modal.points;
                var pointsSet = this.entity.modal.pointsSet || [];
                this.pointsSet = {};
                points.forEach(function(point, index){ //兼容没有pointsSet的数据
                    this.pointsSet[point] = pointsSet[index] || 0;
                }, this);
                if (!this.entity.modal.points || !this.entity.modal.points.length) {
                    this.store = {
                        list: {},
                        timeStart: []
                    };
                    this.__renderChart();
                }else{
                    var variables = this.variables;
                    var rs = {
                        list:{}
                    };
                    for(var key in variables){
                        var row = variables[key];
                        if(key.indexOf('__p') === 0){
                            var index = key.slice(3,-2);
                            rs.list[points[index]] = {
                                data:row.data,
                                dsItemId:points[index]
                            };
                            if(!rs.timeShaft){
                                rs.timeShaft = row.timeShaft;
                            }
                        }
                    }
                    if (!rs.list) {
                        Log.warn('chart has no data.');
                        return;
                    }
                    this.store = rs;
                    this.__renderChart();
                }
            }.bind(this));

            if (isProcessTask === true) {
                this.root.processTask();
            }
        };

        //数据源和变量统一处理
        this.getVariables = function(){
            var modal = $.extend(true,{},this.entity.modal);
            var option = modal.option;
            var variables = modal.variables || {};
            var points = modal.points;
            var timeStart = option.timeStart,
                timeEnd = option.timeEnd;
            if(points){
                points.forEach(function(row,i){
                    variables['__p'+i+'__'] = {
                        'descr':option.legend[i],
                        'val':'<%'+ row + ',tf=' + option.timeFormat + (timeStart?(',timeStart='+timeStart):'')+(timeEnd?(',timeEnd='+timeEnd):'')+ '%>'
                    };
                });
            }

            return variables;
        };
        // 获取替换模板参数后的 points
        this.__getTplParamsAttachedPoints = function () {
            var _this = this;
            var points = this.entity.modal.points;
            var pattern = this.TPL_PARAMS_PATTERN;
            var params = this.getTplParamsValue();

            if (!params || points.length <= 0) {
                return points;
            } else {
                return points.join(',').replace(pattern, function ($0, $1) {
                    // 如果不是云点
                    // if (params[0] !== '@')
                    return params[$1] || '';
                }).split(',');
            }
        };
        /** @override */
        this.destroy = function () {
            SuperClass.prototype.destroy.apply(this, arguments);

            if (this.chart) {
                this.chart.dispose();
            }
            this.wrap.parentNode.removeChild(this.wrap);
        };

    }.call(Chart.prototype);

    exports.Chart = Chart;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Base'),
    namespace('factory.report.config.ChartThemeConfig') ));
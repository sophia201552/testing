;(function (exports) {

    exports.ModalChartMixin = {
        renderModal: function () {
            var options = this.entity.modal.option = {
                timeRange: 'last24hours',
                timeFormat: 'm5',
                chartType: this.optionTemplate.chartType
            };
            // 默认显示昨天24小时的数据（时间间隔为5分钟）
            if (this.chart) {
                this.chart.dispose();
                this.preview();
            }

            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: this.entity.modal.points,
                timeStart: '2016-03-10 00:00:00',
                timeEnd: '2016-03-11 00:00:00',
                timeFormat: options.timeFormat
            }).done(function (rs) {
                var series = [];
                rs.list.forEach(function (row) {
                    series.push({
                        type: options.chartType,
                        data: row.data
                    });
                });

                this.chart = echarts.init(this.container);
                this.chart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [],
                        orient: 'horizontal',
                        x: 'center',
                        y: 'top'
                    },
                    grid: {
                        y: 30,
                        x2: 30,
                        y2: 30
                    },
                    toolbox: {
                        show: false
                    },
                    color: ['#e84c3d', '#1abc9c', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                             '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                             '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
                    xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            axisTick: {
                                show: false
                            },
                            data: rs.timeShaft
                    }],
                    yAxis: [{
                            type: 'value',
                            scale: true
                    }],
                    series: series,
                    animation: true
                });
            }.bind(this));
        }
    };

} ( namespace('factory.mixins') ));
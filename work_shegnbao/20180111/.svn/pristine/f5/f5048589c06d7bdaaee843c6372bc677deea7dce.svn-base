var ModalChart = (function () {
    function ModalChart(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        this.dicPeriod = {
            '30s': 30000,
            'm1': 60000,
            'm5': 300000,
            '10m': 600000,
            '30m': 1800000,
            'h1': 3600000,
            'd1': 86400000,
            'M1': 2592000000
        }
    }
    ModalChart.prototype = new ModalBase();

    ModalChart.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_CHART',
        parent: 0,
        mode: ['realTime'],
        maxNum: 10,
        title: '',
        minHeight: 1,
        minWidth: 1,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalChart'
    };

    ModalChart.prototype.optionDefault = {
        // 默认色板
        color: [
            '#E2583A', '#FD9F08', '#1D74A9', '#04A0D6', '#689C0F', '#109d83', '#FEC500'
        ],

        // 图表标题
        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#008acd' // 主标题文字颜色
            }
        },
        legend: {
            textStyle: {
                fontFamily: "Microsoft YaHei",
                fontSize: 10
            },
            top: '10', //单位:px
            left: 'center'
        },
        // 值域
        dataRange: {
            itemWidth: 15,
            color: ['#5ab1ef', '#e0ffff']
        },

        // 工具箱
        toolbox: {
            x: 'right',
            y: 'center',
            feature: {
                mark: { show: true },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            },
            color: ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
            effectiveColor: '#ff4500'
        },

        // 提示框
        tooltip: {
            trigger: 'axis',
            //backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: { // 直线指示器样式设置
                    color: '#008acd'
                },
                crossStyle: {
                    color: '#008acd'
                },
                shadowStyle: { // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            }
        },

        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#efefff', // 数据背景颜色
            fillerColor: 'rgba(182,162,222,0.2)', // 填充颜色
            handleColor: '#008acd' // 手柄颜色
        },

        // 网格
        grid: (function (isMobile) { //统一配置grid
            var grid = {
                borderWidth: 0,
                borderColor: '#eee',
                left: 50,
                bottom: 40,
                right: 50,
                top: 40
            }
            if (isMobile) {
                grid.x = 40;
            }
            return grid;
        }(AppConfig.isMobile)),

        // 类目轴
        categoryAxis: {
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: '#008acd'
                }
            },
            splitLine: { // 分隔线
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },

        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: '#008acd'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: { // 分隔线
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },

        polar: {
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.2)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        },

        timeline: {
            lineStyle: {
                color: '#008acd'
            },
            controlStyle: {
                normal: { color: '#008acd' },
                emphasis: { color: '#008acd' }
            },
            symbol: 'emptyCircle',
            symbolSize: 3
        },

        // 柱形图默认参数
        bar: {
            itemStyle: {
                normal: {
                    barBorderRadius: 5
                },
                emphasis: {
                    barBorderRadius: 5
                }
            },
            barMaxWidth: 80
        },

        // 折线图默认参数
        line: {
            smooth: true,
            symbol: 'none', // 拐点图形类型
            symbolSize: 3 // 拐点图形大小
        },

        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#d87a80', // 阳线填充颜色
                    color0: '#2ec7c9', // 阴线填充颜色
                    lineStyle: {
                        color: '#d87a80', // 阳线边框颜色
                        color0: '#2ec7c9' // 阴线边框颜色
                    }
                }
            }
        },

        // 散点图默认参数
        scatter: {
            symbol: 'circle', // 图形类型
            symbolSize: 4 // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
        },

        // 雷达图默认参数
        radar: {
            symbol: 'emptyCircle', // 图形类型
            symbolSize: 3
            //symbol: null,         // 拐点图形类型
            //symbolRotate : null,  // 图形旋转控制
        },

        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#d87a80'
                        }
                    }
                },
                emphasis: { // 也是选中样式
                    areaStyle: {
                        color: '#fe994e'
                    }
                }
            }
        },

        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        color: '#1e90ff'
                    }
                }
            }
        },

        chord: {
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle: {
                        lineStyle: {
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle: {
                        lineStyle: {
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },

        gauge: {
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [
                        [0.2, '#2ec7c9'],
                        [0.8, '#5ab1ef'],
                        [1, '#d87a80']
                    ],
                    width: 10
                }
            },
            axisTick: { // 坐标轴小标记
                splitNumber: 10, // 每份split细分多少段
                length: 15, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: { // 分隔线
                length: 22, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width: 5
            }
        },

        textStyle: {
            fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
        }
    };
    ModalChart.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.chart.setOption(this.options);
    },
        ModalChart.prototype.updateModal = function (pointName, pointValue) { },
        ModalChart.prototype.showConfigMode = function () { },
        ModalChart.prototype.dsChartCog = function (cog, option) {
            if (!cog) return;
            if (cog[0].upper) option.yAxis[0].max = cog[0].upper;
            if (cog[0].lower) option.yAxis[0].min = cog[0].lower;
            if (cog[0].unit) option.yAxis[0].name = cog[0].unit;
            if (cog[0].markLine) {
                if (!option.series[0].markLine) {
                    option.series[0].markLine = {};
                    option.series[0].markLine.data = new Array();

                }
                for (var i in cog[0].markLine) {
                    var markLine = cog[0].markLine[i];
                    if (!markLine.value) continue;
                    var arr = [
                        { name: markLine.name, xAxis: -1, yAxis: markLine.value },
                        { name: markLine.name, xAxis: option.series[0].data.length, yAxis: markLine.value }
                    ];
                    option.series[0].markLine.data.push(arr);
                }
            }
        }
    ModalChart.prototype.coordinate = function (timeShaft) {
        var arr = [],
            timeFormat = this.entity.modal.option.timeFormat,
            format;
        switch (timeFormat) {
            case 'm5':
                format = 'HH:mm';
                break;
            case 'h1':
                format = 'HH:00';
                break;
            case 'd1':
                format = 'yyyy-MM-dd';
                break;
            case 'M1':
                format = 'yyyy-MM';
                break;
            default:
                format = 'yyyy-MM-dd HH:mm';
                break;
        }

        for (var i = 0, l = timeShaft.length; i < l; i++) {
            arr.push(timeShaft[i].toDate().format(format));
        }
        return [{ data: arr }];
    },
        ModalChart.prototype.resize = function () {
            this.chart && this.chart.resize();
        }
    ModalChart.prototype.getData = function (params) {
        var startTime, endTime, timeFormat, unit, postData = {},
            arrPoint;
        var now = new Date();

        //获取dsItemIds
        if (params && params.dsItemIds) {
            arrPoint = params.dsItemIds;
        } else {
            arrPoint = this.entity.modal.points[0] instanceof Array ? this.entity.modal.points[0] : this.entity.modal.points;
        }

        //获取timeFormat
        if (params && params.timeFormat) {
            timeFormat = params.timeFormat;
        } else {
            timeFormat = this.entity.modal.option.format;
        }

        //获取startTime endTime
        if (!params || !params.startTime || !params.endTime) {
            if (this.entity.modal.option.mode == 0) {
                switch (this.entity.modal.option.recentTime) {
                    case 'today': //过去24小时,timeFormat:h1
                        startTime = new Date(now.getTime() - 86400000 + 3600000).format('yyyy-MM-dd HH:00:00');
                        endTime = now.format('yyyy-MM-dd HH:00:00');
                        break;
                    case 'threeDay': //过去72小时,timeFormat:h1
                        startTime = new Date(now.getTime() - 86400000 * 3 + 3600000).format('yyyy-MM-dd HH:00:00');
                        endTime = now.format('yyyy-MM-dd HH:00:00');
                        break;
                    case 'yesterday': //昨天,timeFormat:h1
                        endTime = now;
                        endTime.setHours(0);
                        endTime.setMinutes(0);
                        endTime.setSeconds(0);
                        startTime = new Date(endTime.getTime() - 86400000 + 3600000).format('yyyy-MM-dd HH:00:00');
                        endTime = endTime.format('yyyy-MM-dd HH:00:00');
                        break;
                    case 'thisWeek': //过去7天,timeFormat:d1
                        endTime = now.format('yyyy-MM-dd 00:00:00');
                        startTime = new Date(endTime);
                        startTime.setDate(startTime.getDate() - 6);
                        startTime = startTime.format('yyyy-MM-dd 00:00:00');
                        break;
                    case 'lastWeek': //上个星期,timeFormat:d1
                        endTime = new Date(now.getTime() - now.getDay() * 86400000).format('yyyy-MM-dd 00:00:00');; //上周的最后一天,即周日
                        startTime = new Date(now.getTime() - (now.getDay() + 6) * 86400000).format('yyyy-MM-dd 00:00:00');; //上周的第一天,即周一
                        break;
                    case 'thisYear':
                        endTime = now.format('yyyy-MM-01 00:00:00'); //本月的第一天
                        startTime = now;
                        startTime.setMonth(startTime.getMonth() - 12);
                        startTime = startTime.format('yyyy-MM-01 00:00:00');
                        break;
                }

            } else if (this.entity.modal.option.mode == 1) {
                if (this.entity.modal.option.startTime && this.entity.modal.option.endTime) {
                    startTime = new Date(this.entity.modal.option.startTime).format('yyyy-MM-dd HH:mm:ss');
                    endTime = new Date(this.entity.modal.option.endTime).format('yyyy-MM-dd HH:mm:ss');

                } else {
                    alert(I18n.resource.modalConfig.err.TYPE14);
                    return;
                }
            } else if (this.entity.modal.option.mode == 2) {

                if (this.entity.modal.option.unit === 'hour') { //时间周期为小时
                    unit = 3600000;
                    endTime = new Date();
                    //采样周期为5分钟或者1小时
                    if (timeFormat === 'h1') {
                        //结束时间设置为当前小时的00:00
                        endTime.setMinutes(0);
                        endTime.setSeconds(0);
                    }
                    startTime = new Date(endTime.getTime() - unit * parseInt(this.entity.modal.option.val) + 1000).format('yyyy-MM-dd HH:mm:ss');
                } else if (this.entity.modal.option.unit === 'day') { //时间周期为天
                    unit = 86400000;
                    endTime = new Date();
                    //结束时间设置为当天的00:00:00
                    endTime.setMinutes(0);
                    endTime.setSeconds(0);
                    if (timeFormat === 'h1') {
                        startTime = new Date(endTime.getTime() - unit * parseInt(this.entity.modal.option.val) + 3600000).format('yyyy-MM-dd HH:mm:ss');
                    } else if (timeFormat === 'd1') {
                        //endTime.setHours(0);
                        startTime = new Date(endTime.getTime() - unit * parseInt(this.entity.modal.option.val) + 1000).format('yyyy-MM-dd HH:mm:ss');
                    }
                } else if (this.entity.modal.option.unit === 'month') { //默认三十天
                    unit = 2592000000; //86400000*30
                    if (timeFormat === 'd1') {
                        endTime = now.format('yyyy-MM-dd 00:00:00');
                        startTime = new Date(now.getTime() - 86400000 * 30).format('yyyy-MM-dd 00:00:00');
                    } else if (timeFormat === 'M1') {
                        //todo
                        alert(I18n.resource.modalConfig.err.TYPE15);
                        return;
                    }
                }

                endTime = endTime.format('yyyy-MM-dd HH:mm:ss');
            }


        } else {
            startTime = params.startTime;
            endTime = params.endTime;
        }

        //验证数据及格式是否正确
        if (!arrPoint || arrPoint.length === 0) {
            postData.errorMsg = 'Data source is error';
        }
        if (!startTime || !endTime) {
            postData.errorMsg = 'Start time or end time is error';
        }
        if (!timeFormat) {
            postData.errorMsg = 'timeFormat is error';
        }

        if (postData.errorMsg) {
            alert(postData.errorMsg);
            return;
        }

        postData.dsItemIds = arrPoint;
        postData.timeStart = startTime;
        postData.timeEnd = endTime;
        postData.timeFormat = timeFormat;

        return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData);
    }
    return ModalChart;
})();

/* 饼图 start */
var ModalRealtimePie = (function () {

    function ModalRealtimePie(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalRealtimePie.prototype = new ModalBase();
    ModalRealtimePie.prototype.optionTemplate = {
        name: '',
        parent: 0,
        mode: ['realTimeDashboard'],
        maxNum: 10,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12
    };
    ModalRealtimePie.prototype.optionDefault = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            y: 'center'
        },
        toolbox: {
            show: false,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'center',
                            max: 1548
                        }
                    }
                },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        color: ['#E2583A', '#FD9F08', '#FEC500', '#1D74A9', '#04A0D6', '#689C0F', '#109d83'],
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            labelLine: {
                normal: {
                    show: true,
                    length: 6,
                    length2: 60,
                    lineStyle: {
                        width: [2]
                    }
                }
            },
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        formatter: '{d}%' //  '{b} : {c} ({d}%)'
                    },
                    labelLine: {
                        show: true
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        position: 'center',
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    }
                }
            }
        }]
    };
    ModalRealtimePie.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.chart.setOption($.extend(true, {}, this.optionDefault, this.option));
    },
        ModalRealtimePie.prototype.updateModal = function (points) { },
        ModalRealtimePie.prototype.showConfigMode = function () { },
        ModalRealtimePie.prototype.dealWithData = function (points, len) {
            var arr = [];
            var arrLegend = this.initPointAlias(points);
            var arrSeries = [];
            for (var i = 0; i < points.length; i++) {
                var seriesData = {
                    value: tofixed(points[i].data),
                    name: arrLegend[i]
                };
                arrSeries.push(seriesData);
            }
            arr.push(arrLegend);
            arr.push(arrSeries);
            return arr;
        },

        ModalRealtimePie.prototype.setModalOption = function (option) {
            this.entity.modal.interval = 5;
        };

    return ModalRealtimePie;
})();
/* 饼图 end */

/* 折线图 start */
var ModalRealtimeLine = (function () {
    function ModalRealtimeLine(screen, entityParams) {
        if (!entityParams) return;
        ModalChart.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalRealtimeLine.prototype = new ModalChart();
    ModalRealtimeLine.prototype.optionTemplate = {
        name: '',
        parent: 0,
        mode: ['realTimeDashboard'],
        maxNum: 10,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12
    };
    ModalRealtimeLine.prototype.optionDefault = $.extend(true, {}, { grid: ModalChart.prototype.optionDefault.grid, legend: ModalChart.prototype.optionDefault.legend }, {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [],
            orient: 'horizontal'
        },
        //grid: {x: 70, y: 38, x2: 10, y2: 24},
        toolbox: {
            show: true,
            left: 'left',
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] }
            }
        },
        calculable: (function () {
            if (AppConfig.isMobile) {
                return false;
            } else {
                return true;
            }
        }()),
        color: ['#E2583A', '#FEC500', '#04A0D6', '#FD9F08', '#1D74A9', '#689C0F', '#109d83'],
        xAxis: [{
            type: 'category',
            boundaryGap: true,
            splitLine: { show: false },
            splitArea: { show: false },
            axisTick: {
                show: false
            }
        }],
        yAxis: [{
            type: 'value',
            scale: true,
            splitLine: {
                show: (function () {
                    if (AppConfig.isMobile) {
                        return false;
                    } else {
                        return true;
                    }
                }())
            },
            splitArea: { show: false },
            axisLabel: {
                formatter: function (value) {
                    if (AppConfig.isMobile && value / 1000 >= 1) {
                        return value / 1000 + 'k';
                    } else {
                        return value;
                    }
                }
            }
        }],
        series: [{
            type: 'line',
            symbol: 'none',
            smooth: true
        }],
        animation: true
    });
    ModalRealtimeLine.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.chart.setOption($.extend(true, {}, this.optionDefault, this.option));
    },
        ModalRealtimeLine.prototype.updateModal = function (points) { },
        ModalRealtimeLine.prototype.showConfigMode = function () { },
        ModalRealtimeLine.prototype.dealWithData = function (points, dsChartCog) {
            var arr = [],
                arrLegend = [],
                arrSeries = [],
                accuracy;
            if (!dsChartCog) {
                accuracy = 2;
            } else {
                accuracy = parseInt(dsChartCog[0].accuracy);
            }
            arrLegend = this.initPointAlias(points.list);
            for (var i = 0; i < points.list.length; i++) {
                var dataList = [];
                for (var j in points.list[i].data) {
                    if (typeof (points.list[i].data[j]) === 'number') {
                        dataList.push(points.list[i].data[j].toFixed(accuracy));
                    }
                }
                var series = {
                    name: arrLegend[i],
                    type: this.entity.modal.option.showType ? this.entity.modal.option.showType : 'line', //
                    symbol: 'none',
                    smooth: true,
                    data: dataList,
                    z: 3,
                    itemStyle: {
                        normal: {
                            label: {
                                show: false,
                                position: 'top',
                                formatter: '{b}\n{c}'
                            },
                            barBorderRadius: [5, 5, 0, 0]
                        }
                    }
                }
                arrSeries.push(series);
            }

            arr.push(arrLegend);
            arr.push(arrSeries);

            return arr;
        },
        ModalRealtimeLine.prototype.setModalOption = function (option) {
            this.entity.modal.interval = 5;
        };
    return ModalRealtimeLine;
})();
/* 折线图 end */

/* 柱图 start*/
var modalRealtimeBar = (function () {
    function modalRealtimeBar(screen, entityParams) {
        if (!entityParams) return;
        ModalChart.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    modalRealtimeBar.prototype = new ModalChart();
    modalRealtimeBar.prototype.optionTemplate = {
        parent: 0,
        mode: ['realTimeDashboard'],
        maxNum: 10,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12
    };
    modalRealtimeBar.prototype.optionDefault = $.extend(true, {}, { grid: ModalChart.prototype.optionDefault.grid, legend: ModalChart.prototype.optionDefault.legend }, {
        tooltip: {
            trigger: 'item'
        },
        calculable: (function () {
            if (AppConfig.isMobile) {
                return false;
            } else {
                return true;
            }
        }()),
        //grid: {x: 70, y: 38, x2: 10, y2: 24},
        xAxis: [{
            type: 'category',
            show: true,
            splitLine: { show: false },
            splitArea: { show: false },
            axisTick: {
                show: false
            }
        }],
        yAxis: [{
            type: 'value',
            splitArea: { show: false },
            splitLine: {
                show: (function () {
                    if (AppConfig.isMobile) {
                        return false;
                    } else {
                        return true;
                    }
                }())
            },
            axisLabel: {
                formatter: function (value) {
                    if (AppConfig.isMobile && value / 1000 >= 1) {
                        return value / 1000 + 'k';
                    } else {
                        return value;
                    }
                }
            }
        }],
        animation: true
    });
    modalRealtimeBar.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.chart.setOption($.extend(true, {}, this.optionDefault, this.option));
    },
        modalRealtimeBar.prototype.updateModal = function (points) { },
        modalRealtimeBar.prototype.showConfigMode = function () { },
        modalRealtimeBar.prototype.setModalOption = function (option) {
            this.entity.modal.interval = 5;
        };
    return modalRealtimeBar;
})();
/* 柱图 end*/


/* 横向比较 自定义柱图 start*/
var ModalRealtimeBarEnegBrkd = (function () {

    function ModalRealtimeBarEnegBrkd(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        modalRealtimeBar.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

    };
    ModalRealtimeBarEnegBrkd.prototype = new modalRealtimeBar();

    ModalRealtimeBarEnegBrkd.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_CHART_BAR_ENERGY',
        parent: 0,
        mode: ['realTimeDashboard'],
        maxNum: 10,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalRealtimeBarEnegBrkd',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };

    ModalRealtimeBarEnegBrkd.prototype.renderModal = function () {

    },

        ModalRealtimeBarEnegBrkd.prototype.updateModal = function (points) {
            if (points.length < 1) return;

            var now = new Date();
            if (!this.lastRenderTime || now.getTime() - this.lastRenderTime > this.dicPeriod[_this.entity.modal.option.timeFormat]) {
                this.lastRenderTime = now;
                var _this = this;
                var dsChartCog = this.entity.modal.dsChartCog;
                var entityItem = dealWithData(points, dsChartCog);
                var optionDefault = {
                    tooltip: {
                        trigger: 'item'
                    },
                    toolbox: {
                        show: false
                    },
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        show: true
                    }],
                    yAxis: [{
                        type: 'value',
                        show: true
                    }],
                    series: [{
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    // build a color map as your need.
                                    var colorList = [
                                        '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                    ];
                                    return colorList[params.dataIndex]
                                },
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{c}'
                                }
                            }
                        },
                        barMaxWidth: 80
                    }]
                };
                var entityData = {
                    xAxis: [{
                        data: entityItem[0]
                    }],
                    series: [{
                        data: entityItem[1],
                        markPoint: {
                            data: entityItem[2]
                        }
                    }]
                };
                this.dsChartCog(dsChartCog, entityData);
                !this.chart && (this.chart = echarts.init(this.container, AppConfig.chartTheme));
                this.chart.setOption($.extend(true, {}, this.optionDefault, optionDefault, entityData));

            }
            /*else{
                        this.chart.setSeries([
                                {
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: function (params) {
                                                var colorList = [
                                                 '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                                  '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                                  '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                                ];
                                                return colorList[params.dataIndex]
                                            }
                                        }
                                    },
                                    data: entityItem[1],
                                    markPoint: {
                                        data: entityItem[2]
                                    }
                                }
                            ])
                    }*/
            function dealWithData(points, dsChartCog) {
                var arr = [],
                    arrXAxis = [],
                    arrData = [],
                    arrMpData = [],
                    accuracy;
                if (!dsChartCog) {
                    accuracy = 2;
                } else {
                    accuracy = parseInt(dsChartCog[0].accuracy);
                };
                arrXAxis = _this.initPointAlias(points);
                for (var i = 0, temp; i < points.length; i++) {
                    temp = points[i];
                    arrData.push(tofixed(temp.data, accuracy));
                    arrMpData.push({ xAxis: i, value: tofixed(temp.data, accuracy), name: arrXAxis[i], symbol: 'none' })
                }
                arr.push(arrXAxis);
                arr.push(arrData);
                arr.push(arrMpData);
                return arr;
            }
        },
        ModalRealtimeBarEnegBrkd.prototype.setModalOption = function (option) {
            this.entity.modal.interval = 5;
        };
    return ModalRealtimeBarEnegBrkd;
})();
/* 横向比较 自定义柱图 end*/

/* 横向比较 柱图 start*/
var ModalRealtimeBarSub = (function () {

    function ModalRealtimeBarSub(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        modalRealtimeBar.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };
    ModalRealtimeBarSub.prototype = new modalRealtimeBar();

    ModalRealtimeBarSub.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_BAR',
        parent: 0,
        mode: ['realTimeDashboard'],
        maxNum: 10,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalRealtimeBarSub',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };

    ModalRealtimeBarSub.prototype.renderModal = function () { },

        ModalRealtimeBarSub.prototype.updateModal = function (points) {
            if (points.length < 1) return;
            var _this = this;
            var now = new Date();
            //首次渲染 或则 上次刷新间隔时间大于 时间周期
            if (!this.lastRenderTime || now.getTime() - this.lastRenderTime > this.dicPeriod[_this.entity.modal.option.timeFormat]) {
                var pointNameList = (function (points) {
                    var arr = [];
                    for (var i = 0; i < points.length; i++) {
                        arr.push(points[i].dsItemId)
                    }
                    return arr;
                })(points);
                var endTime;
                if (!_this.m_bIsGoBackTrace) {
                    endTime = new Date();
                    _this.optionDefault.animation = true;
                } else {
                    this.m_bIsGoBackTrace = false;
                    endTime = new Date(_this.m_traceData.currentTime);
                    _this.optionDefault.animation = false;
                }
                if (!this.entity.modal.option) this.entity.modal.option = {};
                if (!this.entity.modal.option.timeFormat) { this.entity.modal.option.timeFormat = 'h1'; }
                if (this.entity.modal.option.timeFormat === 'm1' || this.entity.modal.option.timeFormat === 'm5' || this.entity.modal.option.timeFormat === 'h1') {
                    var startTime = new Date(endTime - 86400000);
                } else if (this.entity.modal.option.timeFormat === 'd1') {
                    var startTime = new Date(endTime - 2592000000);
                } else if (this.entity.modal.option.timeFormat === 'M1') {
                    var startTime = new Date(endTime - 31536000000);
                }
                this.lastRenderTime = now;
                WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                    dsItemIds: pointNameList,
                    timeStart: startTime.format('yyyy-MM-dd HH:mm:ss'),
                    timeEnd: endTime.format('yyyy-MM-dd HH:mm:ss'),
                    timeFormat: _this.entity.modal.option.timeFormat
                }).done(function (dataSrc) {
                    if (dataSrc == undefined || dataSrc.length <= 0) {
                        return;
                    }
                    var dsChartCog = _this.entity.modal.dsChartCog;
                    var entityItem = _this.dealWithData(dataSrc, dsChartCog);
                    var entityData = {
                        legend: {
                            data: entityItem[0],
                            icon: 'circle',
                            itemWidth: 22,
                            itemHeight: 10
                        },
                        xAxis: _this.coordinate(dataSrc.timeShaft),
                        yAxis: [{}],
                        toolbox: {
                            show: false,
                            feature: {
                                dataView: { show: true, readOnly: false },
                                magicType: { show: true, type: ['line', 'bar'] }
                            }
                        },
                        series: entityItem[1]
                    };

                    _this.dsChartCog(dsChartCog, entityData);
                    !_this.chart && (_this.chart = echarts.init(_this.container, AppConfig.chartTheme));
                    _this.chart.clear();
                    _this.chart.setOption($.extend(true, {}, _this.optionDefault, entityData));
                }).error(function (e) {

                }).always(function (e) {

                });
            }
        },
        ModalRealtimeBarSub.prototype.dealWithData = function (points, dsChartCog) {
            var arr = [],
                arrLegend = [],
                arrSeries = [],
                accuracy;
            if (!dsChartCog) {
                accuracy = 2;
            } else {
                accuracy = parseInt(dsChartCog[0].accuracy);
            }
            arrLegend = this.initPointAlias(points.list);
            for (var i = 0; i < points.list.length; i++) {
                var key = points.list[i].dsItemId,
                    dataList = [];
                for (var j in points.list[i].data) {
                    if (typeof (points.list[i].data[j]) === 'number') {
                        dataList.push(points.list[i].data[j].toFixed(accuracy));
                    }
                }
                var series = {
                    name: arrLegend[i],
                    type: 'bar',
                    symbol: 'none',
                    smooth: true,
                    data: dataList,
                    itemStyle: {
                        normal: {
                            label: {
                                show: false,
                                position: 'top',
                                formatter: '{b}\n{c}'
                            },
                            barBorderRadius: [5, 5, 0, 0]
                        }
                    }
                }
                arrSeries.push(series);
            }
            arr.push(arrLegend);
            arr.push(arrSeries);
            return arr;
        },
        ModalRealtimeBarSub.prototype.setModalOption = function (option) {
            this.entity.modal.interval = 5;
        };
    ModalRealtimeBarSub.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    };
    return ModalRealtimeBarSub;
})();
/* 横向比较 柱图 end*/


/* 主页 饼图 分项能耗 start*/
var ModalRealtimePieEnegBrkd = (function () {

    function ModalRealtimePieEnegBrkd(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimePie.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

    };

    ModalRealtimePieEnegBrkd.prototype = new ModalRealtimePie();

    ModalRealtimePieEnegBrkd.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_CHART_PIE_ENERGY',
        parent: 0,
        mode: ['realTimeDashboard'],
        maxNum: 10,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalRealtimePieEnegBrkd',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };

    ModalRealtimePieEnegBrkd.prototype.renderModal = function () {

    }

    ModalRealtimePieEnegBrkd.prototype.updateModal = function (points) {
        if (points.length < 1) return;
        var _this = this;
        var now = new Date();
        if (!this.lastRenderTime || now.getTime() - this.lastRenderTime > this.dicPeriod[_this.entity.modal.option.timeFormat]) {
            this.lastRenderTime = now;
            var entityItem = this.dealWithData(points, 4);
            var entityData = {
                legend: {
                    data: entityItem[0],
                    icon: 'circle',
                    itemWidth: 22,
                    itemHeight: 10,
                    top: 20
                },
                series: [{
                    data: entityItem[1]
                }]
            };
            this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, entityData));
        }
    },
        ModalRealtimePieEnegBrkd.prototype.setModalOption = function (option) {
            this.entity.modal.interval = 5;
        };
    return ModalRealtimePieEnegBrkd;
})();
/* 主页 饼图 分项能耗 end*/


/* 实时折线图 start*/
var ModalRealtimeLineOutdoor = (function () {

    function ModalRealtimeLineOutdoor(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, null);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        //兼容老数据
        !this.entity.modal.option && (this.entity.modal.option = {});
        !this.entity.modal.option.mode && (this.entity.modal.option.mode = 0);
        !this.entity.modal.option.recentTime && (this.entity.modal.option.recentTime = 'today');
        !this.entity.modal.option.format && (this.entity.modal.option.format = 'h1');
        this.entity.modal.option.timeFormat = this.entity.modal.option.format;
    };

    ModalRealtimeLineOutdoor.prototype = new ModalRealtimeLine();
    ModalRealtimeLineOutdoor.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_CHART_LINE_OUTDOOR',
        parent: 0,
        mode: ['realTimeDashboard'],
        maxNum: 10,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalRealtimeLineOutdoor',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    },
        ModalRealtimeLineOutdoor.prototype.renderModal = function () {
            this.updateModal();
        }
    ModalRealtimeLineOutdoor.prototype.updateModal = function (points) {
        var pointNameList = [];
        if (this.screen.store) {
            if (this.screen.store.model) { //在page頁面作為htmlDashboard控件才有
                if (this.screen.store.model.option().bg === "whiteBg") {
                    this.optionDefault.tooltip = {
                        trigger: 'axis',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        textStyle: {
                            color: "#ffffff"
                        }
                    }
                } else {
                    this.optionDefault.tooltip = {
                        trigger: 'axis',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        textStyle: {
                            color: "#000000"
                        }
                    }
                }
            }
        }


        if (!points && this.entity.modal.points) {
            if (this.entity.modal.points[0] instanceof Array) {
                pointNameList = this.entity.modal.points[0];
            } else {
                pointNameList = this.entity.modal.points;
            }
        } else {
            points && points.length > 0 && (pointNameList = (function (points) {
                var arr = [];
                for (var i = 0; i < points.length; i++) {
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points));
        }

        if (pointNameList.length < 1) return;
        var _this = this;
        var now = new Date();

        if (!this.lastRenderTime || now.getTime() - this.lastRenderTime > this.dicPeriod[_this.entity.modal.option.timeFormat]) {

            var endTime, startTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date();
                _this.optionDefault.animation = true;
            } else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime);
                _this.optionDefault.animation = false;
            }
            if (!this.entity.modal.option) this.entity.modal.option = {};
            if (!this.entity.modal.option.timeFormat) { this.entity.modal.option.timeFormat = 'h1'; }
            if (this.entity.modal.option.timeFormat === 'm1' || this.entity.modal.option.timeFormat === 'm5' || this.entity.modal.option.timeFormat === 'h1') {
                startTime = new Date(endTime - 86400000);
            } else if (this.entity.modal.option.timeFormat === 'd1') {
                startTime = new Date(endTime - 2592000000);
            } else if (this.entity.modal.option.timeFormat === 'M1') {
                startTime = new Date(endTime - 31536000000);
            }
            this.lastRenderTime = now;

            this.getData({ dsItemIds: pointNameList, timeFormat: this.entity.modal.option.timeFormat }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var dsChartCog = _this.entity.modal.dsChartCog;
                var entityItem = _this.dealWithData(dataSrc, dsChartCog);
                var entityData = {
                    legend: {
                        data: entityItem[0],
                        icon: 'circle',
                        itemWidth: 22,
                        itemHeight: 10
                    },
                    xAxis: _this.coordinate(dataSrc.timeShaft),
                    yAxis: [{
                        max: _this.entity.modal.option.yMaxValue != undefined && _this.entity.modal.option.yMaxValue.val != '' ? _this.entity.modal.option.yMaxValue.val : null,
                        min: _this.entity.modal.option.yMinValue != undefined && _this.entity.modal.option.yMinValue.val != '' ? _this.entity.modal.option.yMinValue.val : null

                    }],
                    series: entityItem[1]
                };
                if (_this.optionDefault.toolbox) {
                    _this.optionDefault.toolbox.feature.dataView.show = false;
                }
                _this.dsChartCog(dsChartCog, entityData);
                !_this.chart && (_this.chart = echarts.init(_this.container, AppConfig.chartTheme));
                _this.chart.clear();
                _this.chart.setOption($.extend(true, {}, _this.optionDefault, entityData));
            }).error(function (e) {

            }).always(function (e) {

            });
        }
    },
        ModalRealtimeLineOutdoor.prototype.setModalOption = function (option) {
            this.entity.modal.interval = 5;
        };
    ModalRealtimeLineOutdoor.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    };

    ModalRealtimeLineOutdoor.prototype.modalInit = function () {
        !this.entity.modal.option && (this.entity.modal.option = {});
        var _this = this;

        var configModalOpt = {
            "header": {
                "needBtnClose": true,
                "title": I18n.resource.modalConfig.TITLE
            },
            "area": [{
                module: 'timeConfig',
                data: {
                    mode: this.entity.modal.option.mode,
                    timeFormat: this.entity.modal.option.format,
                    timeRecent: this.entity.modal.option.recentTime,
                    timeStart: this.entity.modal.option.startTime,
                    timeEnd: this.entity.modal.option.endTime
                }
            },
            {
                "type": 'option',
                "widget": [{
                    id: 'selChartType',
                    type: 'select',
                    name: I18n.resource.modalConfig.option.LABEL_CHART_SELECT,
                    opt: {
                        option: [
                            { val: 'bar', name: I18n.resource.modalConfig.option.CHART_SELECT_BAR },
                            { val: 'line', name: I18n.resource.modalConfig.option.CHART_SELECT_LINE }
                        ]
                    },
                    data: { val: this.entity.modal.option.showType }
                }]
            }, {
                "type": 'input',
                "widget": [


                    {
                        id: 'yMinValue',
                        type: 'text',
                        name: I18n.resource.modalConfig.option.YMIN,
                        opt: {
                            data: this.entity.modal.option.yMinValue != undefined ? this.entity.modal.option.yMinValue.val : "",
                            attr: {
                                placeholder: I18n.resource.modalConfig.option.YTIP
                            }
                        }
                    },
                    {
                        id: 'yMaxValue',
                        type: 'text',
                        name: I18n.resource.modalConfig.option.YMAX,
                        opt: {
                            data: this.entity.modal.option.yMaxValue != undefined ? this.entity.modal.option.yMaxValue.val : "",
                            attr: {
                                placeholder: I18n.resource.modalConfig.option.YTIP
                            }
                        }


                    },

                ]
            },
            {
                "module": "dsDrag",
                "data": [{
                    type: 'point',
                    name: I18n.resource.modalConfig.data.DEFAULT_NAME,
                    data: this.entity.modal.points ? (this.entity.modal.points[0] instanceof Array ? this.entity.modal.points[0] : this.entity.modal.points) : [],
                    forChart: false
                }]
            }, {
                'type': 'footer',
                "widget": [{ type: 'confirm', opt: { needClose: true } }, { type: 'cancel' }]
            },
            ],
            event: {
                afterHide: function () {
                    _this.hideConfigModal();
                }
            },
            result: {
                func: function (data) {
                    !_this.entity.modal.option && (_this.entity.modal.option = {});
                    _this.entity.modal.option.mode = data.mode;
                    _this.entity.modal.option.format = data.interval;
                    _this.entity.modal.option.timeFormat = data.interval;
                    if (data.mode === '1') {
                        _this.entity.modal.option.startTime = data.timeStart;
                        _this.entity.modal.option.endTime = data.timeEnd;
                    } else if (data.mode === '2') {
                        _this.entity.modal.option.unit = data.timeRecent.unit;
                        _this.entity.modal.option.val = data.timeRecent.val;
                    }
                    _this.entity.modal.option.yMaxValue = data.yMaxValue;
                    _this.entity.modal.option.yMinValue = data.yMinValue;
                    _this.entity.modal.option.recentTime = data.timeRecent;
                    _this.entity.modal.option.showType = data.selChartType.val;
                    _this.entity.modal.points = data.points[0];
                    _this.lastRenderTime = null;
                    _this.setModalOption();
                    _this.updateModal();
                    _this.configModal.hide();
                }
            }
        };
        var container = this.screen.container ? this.screen.container : this.screen.page.painterCtn;
        var modalCtn = $(container).children('.cfgModal')[0]
        this.configModal = new ConfigModal(configModalOpt, modalCtn ? modalCtn : container);
        this.configModal.init();
        this.configModal.show();
        this.toggleDataSource(true);
    };

    return ModalRealtimeLineOutdoor;
})();
/* 实时折线图 end*/


/*实时仪表盘 start */
var ModalRealtimeGauge = (function () {

    function ModalRealtimeGauge(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.entityOption = entityParams.modal.option;
        //若accuracy有数字传入仪表盘
        entityParams.modal.dsChartCog == undefined ? this.accuracy = 2 : this.accuracy = entityParams.modal.dsChartCog[0].accuracy
    };
    ModalRealtimeGauge.prototype = new ModalBase();

    ModalRealtimeGauge.prototype.optionTemplate = {

        name: 'toolBox.modal.REAL_TIME_CHART_GAUGE',
        parent: 0,
        mode: ['gauge'],
        maxNum: 1,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalRealtimeGauge',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };

    ModalRealtimeGauge.prototype.optionDefault = {
        tooltip: {
            formatter: "{c}"
        },
        animation: true,
        animationDuration: 1000,
        animationDurationUpdate: 1000,
        series: [{
            name: 'PUE',
            type: 'gauge',
            splitNumber: 8,
            radius: '100%',
            axisLine: {
                show: true,
                lineStyle: {
                    width: 6
                }
            },
            axisTick: {
                show: true,
                splitNumber: 5,
                length: 10,
                lineStyle: {
                    width: 1,
                    type: 'solid',
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                },
                formatter: function (v) {
                    return v.toFixed(0);
                }
            },
            splitLine: {
                show: true,
                length: 15,
                lineStyle: {
                    color: 'auto',
                    width: 3
                }
            },
            pointer: {
                width: 5
            },
            detail: {
                formatter: '{value}',
                textStyle: {
                    fontSize: 12
                }
            }
        }]
    };

    ModalRealtimeGauge.prototype.renderModal = function () {

    },

        ModalRealtimeGauge.prototype.updateModal = function (points) {
            if (points.length < 1) return;
            var _this = this;

            var scaleList = [];
            for (var i = 0; i < _this.entityOption.scaleList.length; i++) {
                scaleList.push(_this.entityOption.scaleList[i]);
            }
            var colorList = ['#1abc9c', '#3598db', '#e84c3d'];

            if (scaleList[scaleList.length - 1] < scaleList[0]) {
                scaleList.reverse();
                colorList = ['#e84c3d', '#3598db', '#1abc9c'];
            }

            var panelUnit = this.entityOption.panelUnit ? this.entityOption.panelUnit : "";
            this.optionDefault.series[0].max = scaleList[scaleList.length - 1];
            this.optionDefault.series[0].min = scaleList[0];
            this.optionDefault.series[0].detail.formatter = function (value) {
                return value.toFixed(_this.accuracy) + panelUnit + '';;
            }
            this.optionDefault.series[0].data = [{ value: parseFloat(points[0].data).toFixed(_this.accuracy) }];
            this.optionDefault.series[0].axisLine.lineStyle.color = function (option) {
                var arr = [],
                    colorIndex = 0;
                for (var i = 0; i < option.length; i++) {
                    if (i == 0) {
                        continue;
                    }
                    arr.push([((option[i] - option[0]) / (_this.optionDefault.series[0].max - _this.optionDefault.series[0].min)).toFixed(3), colorList[colorIndex]]);
                    colorIndex++;
                }
                return arr;
            }(scaleList);

            !this.chart && (this.chart = echarts.init(this.container, AppConfig.chartTheme));
            this.chart.setOption(this.optionDefault);
        },

        ModalRealtimeGauge.prototype.showConfigMode = function () {

        },

        ModalRealtimeGauge.prototype.setModalOption = function (option) {
            this.entity.modal.option = {};
            this.entity.modal.option.scaleList = option.scaleList;
            this.entity.modal.option.panelUnit = option.panelUnit;
            this.entity.modal.interval = 5;
        };

    return ModalRealtimeGauge;
})();
/*实时仪表盘 start */

function tofixed(str, accuracy) {
    if (!accuracy) accuracy = 2;
    return parseFloat(str).toFixed(accuracy);
}
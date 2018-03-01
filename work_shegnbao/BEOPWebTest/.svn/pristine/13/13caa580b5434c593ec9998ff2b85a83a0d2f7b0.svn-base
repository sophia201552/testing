var ModalChart = (function () {
    function ModalChart(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);

    }
    ModalChart.prototype = new ModalBase();

    ModalChart.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_CHART',
        parent:0,
        mode:['realTime'],
        maxNum: 10,
        title:'',
        minHeight:1,
        minWidth:1,
        maxHeight:6,
        maxWidth:12,
        type:'ModalChart'
    };

    ModalChart.prototype.optionDefault = {
        // 默认色板
        color: [
            '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
            '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
            '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
            '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
        ],

        // 图表标题
        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#008acd'          // 主标题文字颜色
            }
        },
        legend: {
            textStyle: {
                fontFamily: "Microsoft YaHei"
            }
        },
        // 值域
        dataRange: {
            itemWidth: 15,
            color: ['#5ab1ef','#e0ffff']
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
            color : ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
            effectiveColor : '#ff4500'
        },

        // 提示框
        tooltip: {
            trigger: 'axis',
            //backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line',         // 默认为直线，可选为：'line' | 'shadow'
                lineStyle : {          // 直线指示器样式设置
                    color: '#008acd'
                },
                crossStyle: {
                    color: '#008acd'
                },
                shadowStyle : {                     // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            }
        },

        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#efefff',            // 数据背景颜色
            fillerColor: 'rgba(182,162,222,0.2)',   // 填充颜色
            handleColor: '#008acd'    // 手柄颜色
        },

        // 网格
        grid: (function(isMobile){//统一配置grid
            var grid = {
                    borderWidth: 0,
                    borderColor: '#eee',
                    x: 70, y: 38, x2: 30, y2: 24
                }
            if(isMobile){
                grid.x = 40;
            }
            return grid;
        }(AppConfig.isMobile)),

        // 类目轴
        categoryAxis: {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#008acd'
                }
            },
            splitLine: {           // 分隔线
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },

        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#008acd'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
                }
            },
            splitLine: {           // 分隔线
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },

        polar : {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
                }
            },
            splitLine : {
                lineStyle : {
                    color : '#ddd'
                }
            }
        },

        timeline : {
            lineStyle : {
                color : '#008acd'
            },
            controlStyle : {
                normal : { color : '#008acd'},
                emphasis : { color : '#008acd'}
            },
            symbol : 'emptyCircle',
            symbolSize : 3
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
            smooth : true,
            symbol: 'none',  // 拐点图形类型
            symbolSize: 3           // 拐点图形大小
        },

        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#d87a80',       // 阳线填充颜色
                    color0: '#2ec7c9',      // 阴线填充颜色
                    lineStyle: {
                        color: '#d87a80',   // 阳线边框颜色
                        color0: '#2ec7c9'   // 阴线边框颜色
                    }
                }
            }
        },

        // 散点图默认参数
        scatter: {
            symbol: 'circle',    // 图形类型
            symbolSize: 4        // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
        },

        // 雷达图默认参数
        radar : {
            symbol: 'emptyCircle',    // 图形类型
            symbolSize:3
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
                emphasis: {                 // 也是选中样式
                    areaStyle: {
                        color: '#fe994e'
                    }
                }
            }
        },

        force : {
            itemStyle: {
                normal: {
                    linkStyle : {
                        color : '#1e90ff'
                    }
                }
            }
        },

        chord : {
            itemStyle : {
                normal : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },

        gauge : {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']],
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                splitNumber: 10,   // 每份split细分多少段
                length :15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length :22,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer : {
                width : 5
            }
        },

        textStyle: {
            fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
        }
    };
    ModalChart.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption(this.options);
    },
    ModalChart.prototype.updateModal = function (pointName, pointValue) {
    },
    ModalChart.prototype.showConfigMode = function () {
    },
    ModalChart.prototype.dsChartCog = function (cog, option) {
        if(!cog) return;
        if(cog[0].upper) option.yAxis[0].max = cog[0].upper;
        if(cog[0].lower) option.yAxis[0].min = cog[0].lower;
        if(cog[0].unit) option.yAxis[0].name = cog[0].unit;
        if(cog[0].markLine){
            if(!option.series[0].markLine) {
                option.series[0].markLine = {};
                option.series[0].markLine.data = new Array();

            }
            for(var i in cog[0].markLine){
                var markLine = cog[0].markLine[i];
                if(!markLine.value) continue;
                var arr = [
                    {name: markLine.name, xAxis: -1, yAxis: markLine.value},
                    {name: markLine.name, xAxis: option.series[0].data.length, yAxis: markLine.value}
                ];
                option.series[0].markLine.data.push(arr);
            }
        }
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
        name:'',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12
    };
    ModalRealtimePie.prototype.optionDefault = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
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
        color: ['rgb(233,77,60)', 'rgb(105,170,187)', 'rgb(244,116,38)', 'rgb(73,152,234)', 'rgb(241,156,15)', 'rgb(241,191,0)', 'rgb(241,209,0)', 'rgb(230,224,13)', 'rgb(182,209,78)', 'rgb(146,192,129)'],
        series: [
            {
                type: 'pie',
                radius: ['50%', '70%'],
                center:['50%','50%'],
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
            }
        ]
    };
    ModalRealtimePie.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, this.option));
    },
    ModalRealtimePie.prototype.updateModal = function (points) {
    },
    ModalRealtimePie.prototype.showConfigMode = function () {
    },
    ModalRealtimePie.prototype.dealWithData = function(points, len){
        var arr = [];
        var arrLegend = this.initPointAlias(points);
        var arrSeries = [];
        for(var i = 0; i < points.length; i++){
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
        name:'',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12
    };
    ModalRealtimeLine.prototype.optionDefault = $.extend(true,{}, {grid: ModalChart.prototype.optionDefault.grid, legend: ModalChart.prototype.optionDefault.legend}, {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [],
            orient: 'horizontal',
            x: 'center',
            y: 'top'
        },
        //grid: {x: 70, y: 38, x2: 10, y2: 24},
        toolbox: {
            show: false,
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] }
            }
        },
        calculable: (function(){
            if(AppConfig.isMobile){
                return false;
            }else{
                return true;
            }
        }()),
        color: ['#e84c3d', '#1abc9c', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                 '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                 '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine: {show: false},
                splitArea:{show:false},
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                splitLine: {
                    show:(function(){
                        if(AppConfig.isMobile){
                            return false;
                        }else{
                            return true;
                        }
                    }())
                },
                splitArea:{show:false},
                axisLabel : {
                    formatter: function (value){
                        if(AppConfig.isMobile && value/1000 >= 1){
                            return value/1000 + 'k';
                        }else{
                            return value;
                        }
                    }
                }
            }
        ],
        series: [
            {
                type: 'line',
                symbol: 'none',
                smooth: true
            }
        ],
        animation: true
    });
    ModalRealtimeLine.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, this.option));
    },
    ModalRealtimeLine.prototype.updateModal = function (points) {
    },
    ModalRealtimeLine.prototype.showConfigMode = function () {
    },
    ModalRealtimeLine.prototype.dealWithData = function (points,dsChartCog) {
        var arr = [], arrLegend = [],arrSeries = [], accuracy;
        var index,strArrLegend,pointNameReg;
        if(!dsChartCog){
            accuracy = 2;
        }else{
            accuracy = parseInt(dsChartCog[0].accuracy);
        }
        arrLegend = this.initPointAlias(points.list);
        for (var i = 0; i < points.list.length; i++) {
            var dataList = [];
            for(var j in points.list[i].data){
                dataList.push(points.list[i].data[j].toFixed(accuracy));
            }
            var series = {
                 name: arrLegend[i],
                 type: 'line',
                 symbol: 'none',
                 smooth: true,
                 data: dataList,
                z:3
            }
            arrSeries.push(series);
        }
        arr.push(arrLegend);
        arr.push(arrSeries);
        return arr;
    },
    ModalRealtimeLine.prototype.dealWithAddData = function (points,len) {
        var arr = [];
        for(var i = 0; i < points.length; i++){
            var temp = [i, tofixed(points[i].data), false, true];
            arr.push(temp);
        }
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
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12
    };
    modalRealtimeBar.prototype.optionDefault = $.extend(true,{},{grid: ModalChart.prototype.optionDefault.grid}, {
        tooltip: {
            trigger: 'item'
        },
        calculable: (function(){
            if(AppConfig.isMobile){
                return false;
            }else{
                return true;
            }
        }()),
        //grid: {x: 70, y: 38, x2: 10, y2: 24},
        xAxis: [
            {
                type: 'category',
                show: true,
                splitLine: {show: false},
                splitArea:{show:false},
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea:{show:false},
                splitLine: {
                    show:(function(){
                        if(AppConfig.isMobile){
                            return false;
                        }else{
                            return true;
                        }
                    }())
                },
                axisLabel : {
                    formatter: function (value){
                        if(AppConfig.isMobile && value/1000 >= 1){
                            return value/1000 + 'k';
                        }else{
                            return value;
                        }
                    }
                }
            }
        ],
        animation: true
    });
    modalRealtimeBar.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, this.option));
    },
    modalRealtimeBar.prototype.updateModal = function (points) {
    },
    modalRealtimeBar.prototype.showConfigMode = function () {
    },
    modalRealtimeBar.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    return modalRealtimeBar;
})();
/* 柱图 end*/


/* 横向比较 自定义柱图 start*/
var ModalRealtimeBarEnegBrkd = (function () {

    function ModalRealtimeBarEnegBrkd(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        modalRealtimeBar.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

    };
    ModalRealtimeBarEnegBrkd.prototype = new modalRealtimeBar();

    ModalRealtimeBarEnegBrkd.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_CHART_BAR_ENERGY',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeBarEnegBrkd'
    };

    ModalRealtimeBarEnegBrkd.prototype.renderModal = function () {
        this.isFirstRender = true;
    },

    ModalRealtimeBarEnegBrkd.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        var dsChartCog = this.entity.modal.dsChartCog;
        var entityItem = dealWithData(points,dsChartCog);
        var optionDefault = {
            tooltip: {
                trigger: 'item'
            },
            toolbox: {
                show: false
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    show: true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    show: true
                }
            ],
            series: [
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = [
                                  '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                   '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                   '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
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
                }
            ]
        };

        if(!this.chart || this.isFirstRender){
            var entityData = {
                xAxis: [
                    {
                        data: entityItem[0]
                    }
                ],
                series: [
                    {
                        data: entityItem[1],
                        markPoint: {
                            data: entityItem[2]
                        }
                    }
                ]
            };
            this.dsChartCog(dsChartCog,entityData);
            this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {},this.optionDefault, optionDefault,entityData));
            this.isFirstRender = false;
        }else{
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
        }
        function dealWithData(points,dsChartCog){
            var arr = [], arrXAxis = [], arrData = [], arrMpData = [], accuracy;
            if(!dsChartCog){
                accuracy = 2;
            }else{
                accuracy = parseInt(dsChartCog[0].accuracy);
            };
            arrXAxis = _this.initPointAlias(points);
            for(var i = 0, temp; i < points.length; i++){
                temp = points[i];
                arrData.push(tofixed(temp.data, accuracy));
                arrMpData.push({xAxis: i, value: tofixed(temp.data, accuracy), name: arrXAxis[i], symbol: 'none'})
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
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        modalRealtimeBar.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };
    ModalRealtimeBarSub.prototype = new modalRealtimeBar();

    ModalRealtimeBarSub.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_BAR',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeBarSub'
    };

    ModalRealtimeBarSub.prototype.renderModal = function () {
        this.isFirstRender = true;
    },

    ModalRealtimeBarSub.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(!this.chart || this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            var startTime = endTime.split(' ')[0] + ' 00:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var dsChartCog = _this.entity.modal.dsChartCog;
                var entityItem = _this.dealWithData(dataSrc,dsChartCog);
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis: [
                        {
                            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                        }
                    ],
                    yAxis:[{}],
                    toolbox: {
                        show : false,
                        feature : {
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']}
                        }
                    },
                    series: entityItem[1]
                };
                _this.dsChartCog(dsChartCog, entityData);
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        } else{
            if(!this.chart.getSeries()) return;
            var crtHour = new Date().getHours();
            if (points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour) {//seriesData[i].dsItemId
                this.chart.addData(this.dealWithAddData(points,2));
            }
            if(this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
        }
    },
    ModalRealtimeBarSub.prototype.dealWithData = function (points,dsChartCog) {
        var arr = [], arrLegend = [], arrSeries = [], accuracy;
        var index, strArrLegend, pointNameReg;
        if(!dsChartCog){
            accuracy = 2;
        }else{
            accuracy = parseInt(dsChartCog[0].accuracy);
        }
        arrLegend = this.initPointAlias(points.list);
        for (var i = 0; i < points.list.length; i++) {
            var key = points.list[i].dsItemId, dataList = [];
            for(var j in points.list[i].data){
                dataList.push(points.list[i].data[j].toFixed(accuracy));
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
        name:'toolBox.modal.REAL_TIME_CHART_PIE_ENERGY',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimePieEnegBrkd'
    };

    ModalRealtimePieEnegBrkd.prototype.renderModal = function () {
        this.isFirstRender = true;
    }

    ModalRealtimePieEnegBrkd.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var  _this = this;
        if(!this.chart || this.isFirstRender){
            var entityItem = this.dealWithData(points,4);
            var entityData = {
                legend: {
                    data: entityItem[0]
                },
                series: [
                    {
                        data: entityItem[1]
                    }
                ]
            };
            this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, entityData));
            this.isFirstRender = false
        }else{
            var seriesData = (function(points,len){
                var arr = [];
                var arrName = _this.initPointAlias(points);
                for(var i = 0; i < points.length; i++){
                    arr.push({value: tofixed(points[i].data), name: arrName[i]});
                }
                return arr;
            })(points, 4);
            this.chart.setSeries([{
                type: 'pie',
                radius: ['50%', '70%'],
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
                            formatter: '{d}%',
                            position: 'center',
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        }
                    }
                },
                data: seriesData
            }],true)
        }
    },
    ModalRealtimePieEnegBrkd.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    return ModalRealtimePieEnegBrkd;
})();
/* 主页 饼图 分项能耗 end*/

/* PUE分析 饼图 数据机房分项能耗 start*/
var ModalRealtimePieDataRoom = (function () {
    function ModalRealtimePieDataRoom(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimePie.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

    };

    ModalRealtimePieDataRoom.prototype = new ModalRealtimePie();

    ModalRealtimePieDataRoom.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_PIE_DATAROOM',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimePieDataRoom'
    };

    ModalRealtimePieDataRoom.prototype.renderModal = function () {
        this.isFirstRender = true;
    }

    ModalRealtimePieDataRoom.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var entityItem = this.dealWithData(points,3);
        if(!this.chart || this.isFirstRender){
            var entityData = {
                legend: {
                    data: entityItem[0]//['服务器', '精密空调', 'VRV空调']
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['50%', '70%'],
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
                        },
                        data: entityItem[1]
                    }
                ]
            };
            this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, entityData));
            this.isFirstRender = false
        }else{
            this.chart.setSeries(
                   [{
                        type: 'pie',
                        radius: ['50%', '70%'],
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
                        },
                        data: entityItem[1]
                   }]
                , true
            );
        }
    },
    ModalRealtimePieDataRoom.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    return ModalRealtimePieDataRoom;
})();
/* PUE分析 饼图 数据机房分项能耗 end*/

/* PUE分析 折线图 室外温度趋势分析 start*/
var ModalRealtimeLineOutdoor = (function () {

    function ModalRealtimeLineOutdoor(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, null);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalRealtimeLineOutdoor.prototype = new ModalRealtimeLine();
    ModalRealtimeLineOutdoor.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_LINE_OUTDOOR',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeLineOutdoor'
    },
    ModalRealtimeLineOutdoor.prototype.renderModal = function () {
        this.isFirstRender = true;
    }
    ModalRealtimeLineOutdoor.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(!this.chart || this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            if(!this.entity.modal.option) this.entity.modal.option = {};
            if(!this.entity.modal.option.timeFormat) {this.entity.modal.option.timeFormat = 'h1'}
            if(this.entity.modal.option.timeFormat == 'm1'|| 'm5'||'h1'){
                var startTime=new Date(new Date()-86400000).format('yyyy-MM-dd HH:mm:ss');
            }else if (this.entity.modal.option.timeFormat == 'd1'){
                var startTime=new Date(new Date()-2592000000).format('yyyy-MM-dd HH:mm:ss');
            }else if (this.entity.modal.option.timeFormat == 'M1'){
                var startTime=new Date(new Date()-31536000000).format('yyyy-MM-dd HH:mm:ss');
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: this.entity.modal.option.timeFormat
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var dsChartCog = _this.entity.modal.dsChartCog;
                var entityItem = _this.dealWithData(dataSrc,dsChartCog);
                //不同采样间隔的x轴坐标值
                function coordinate(e){
                    var arr = [];
                    var endTime = new Date().valueOf();
                    if (e == 'm1') {
                        var startTime = endTime - 21600000;//6*60*60*1000
                        var interval = 60000;//一分钟
                        while (startTime <= endTime) {
                            arr.push(new Date(startTime).format('HH:mm'));
                            startTime += interval;
                        }
                    } else if (e == 'm5'){
                        var startTime = endTime - 86100000;//减去24个小时
                        var interval = 300000;//五分钟
                        while( startTime <= endTime ) {
                        arr.push(new Date(startTime - startTime%300000).format('HH:mm'));
                        startTime += interval;
                        }
                    }else if(e == 'h1') {
                        var startTime = endTime - 82800000;//23*60*60*1000
                        var interval = 3600000;//一个小时
                        while( startTime <= endTime ) {
                        arr.push(new Date(startTime).format('HH:00'));
                        startTime += interval;
                        }
                    }else if(e == 'd1') {
                        var startTime = endTime - 2592000000;//减去一个月
                        var interval = 86400000;//一天
                        while( startTime <= endTime ) {
                            arr.push(new Date(startTime).format('yyyy-MM-dd'));
                            startTime += interval;
                        }
                    }else if(e == 'M1'){
                        var fullYear = new Date().getFullYear()-1;
                        var month = new Date().getMonth() + 1;
                        //var startTime = fullYear+ '-' + month;
                        var interval = 1;//一个月
                        for(var i=0;i<12;i++){
                            var startTime = fullYear+ '-' + month;
                            arr.push(startTime);
                            month = month%12 + interval;
                            if(month === 1){
                                fullYear +=1;
                            }
                        }
                    }
                    return arr;
                }
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis:
                    //[
                    //    {
                    //        data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
                    //    }
                    //],
                        (function(type){
                            switch (type){
                                case 'm1':
                                    return [{
                                        data: coordinate('m1')
                                    }];
                                case 'm5':
                                    return [{
                                        data: coordinate('m5')
                                    }];
                                case 'h1':
                                    return [{
                                        data: coordinate('h1')
                                    }];
                                case 'd1':
                                    return [{
                                        data: coordinate('d1')
                                    }];
                                case 'M1':
                                    return [{
                                        data: coordinate('M1')
                                    }];
                            }
                        }(_this.entity.modal.option.timeFormat)),//采样间隔作为参数
                    yAxis: [{}],
                    series: entityItem[1]
                };

                _this.dsChartCog(dsChartCog, entityData);
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        } else{
            if (!this.chart.getSeries()) return;
            var crtHour = new Date().getHours();
            if (points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour) {//seriesData[i].dsItemId
                this.chart.addData(this.dealWithAddData(points,2));
            }
            if(this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
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
    return ModalRealtimeLineOutdoor;
})();
/* PUE分析 折线图 室外温度趋势分析 end*/

/* PUE分析 折线图  PUE趋势 start */
var ModalRealtimeLinePUE = (function () {

    function ModalRealtimeLinePUE(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalRealtimeLinePUE.prototype = new ModalRealtimeLine();

    ModalRealtimeLinePUE.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_LINE_PUE',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeLinePUE'
    };

    ModalRealtimeLinePUE.prototype.renderModal = function () {
        this.isFirstRender = true;
    }
    ModalRealtimeLinePUE.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(!this.chart || this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < 1; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            var startTime = endTime.split(' ')[0] + ' 00:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var dsChartCog = _this.entity.modal.dsChartCog;
                var entityItem = _this.dealWithData(dataSrc,dsChartCog.accuracy);
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis: [
                        {
                            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                        }
                    ],
                    yAxis: [{}],
                    series: entityItem[1]
                };
                _this.dsChartCog(dsChartCog, entityData);
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        }else{
            if(!this.chart.getSeries()) return;
            var crtHour = new Date().getHours();
            if(points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour){
                this.chart.addData(this.dealWithAddData(points, 1));
            }
            if(this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
        }
    },
    ModalRealtimeLinePUE.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    ModalRealtimeLinePUE.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    }
    return ModalRealtimeLinePUE;
})();
/* PUE分析 折线图  PUE趋势 end */

/*PUE分析 仪表盘 PUE实时指标 start */
var ModalRealtimeGauge = (function () {

    function ModalRealtimeGauge(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.entityOption = entityParams.modal.option;
    };
    ModalRealtimeGauge.prototype = new ModalBase();

    ModalRealtimeGauge.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_GAUGE',
        parent:0,
        mode:['gauge'],
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeGauge'
    };

    ModalRealtimeGauge.prototype.optionDefault = {
        tooltip: {
            formatter: "{c}"
        },
        animation: true,
        animationDuration: 1000,
        animationDurationUpdate: 1000,
        series: [
            {
                name: 'PUE',
                type: 'gauge',
                splitNumber: 10,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 8
                    }
                },
                radius:[0,'90%'],
                axisTick: {
                    show: true,
                    splitNumber: 5,
                    length: 15,
                    lineStyle: {
                        width: 1,
                        type: 'solid',
                        color:'auto'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'auto'
                    },
                    formatter: function (v){
                      return v.toFixed(2);
                    }
                },
                splitLine: {
                    show: true,
                    length :20,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                pointer : {
                    width : 5
                },
                detail: { formatter: '{value}' }
            }
        ]
    };

    ModalRealtimeGauge.prototype.renderModal = function () {

    },

    ModalRealtimeGauge.prototype.updateModal = function (points) {
        if(points.length < 1) return;

        var _this = this;
        var scaleList = [];
        for (var i = 0 ; i < _this.entityOption.scaleList.length; i++){
            scaleList.push(_this.entityOption.scaleList[i]);
        }
        var colorList = ['#1abc9c','#3598db','#e84c3d'];

        if(scaleList[scaleList.length-1] < scaleList[0]){
            scaleList.reverse();
            colorList = ['#e84c3d','#3598db','#1abc9c'];
        }
        this.optionDefault.series[0].max = scaleList[scaleList.length-1];
        this.optionDefault.series[0].min = scaleList[0];
        this.optionDefault.series[0].data = [{value: parseFloat(points[0].data).toFixed(2)}];

        this.optionDefault.series[0].axisLine.lineStyle.color = function(option){
            var arr = [], colorIndex =0;
            for(var i = 0; i < option.length; i++){
                if(i == 0){
                    continue;
                }
                arr.push([((option[i] - option[0])/(_this.optionDefault.series[0].max - _this.optionDefault.series[0].min)).toFixed(3),colorList[colorIndex]]);
                colorIndex ++;
            }
            return arr;
        }(scaleList);

        if(this.chart){
            this.chart.setOption(this.optionDefault)
        }else{
            this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption(this.optionDefault);
        }
    },

    ModalRealtimeGauge.prototype.showConfigMode = function () {

    },

    ModalRealtimeGauge.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.scaleList = option.scaleList;
        this.entity.modal.interval = 5;
    };

    return ModalRealtimeGauge;
})();
/*PUE分析 仪表盘 PUE实时指标 start */

/* 横向比较 折线图 分项能耗分析 start*/
var ModalRealtimeLineEnegBrkd = (function () {

    function ModalRealtimeLineEnegBrkd(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalRealtimeLineEnegBrkd.prototype = new ModalRealtimeLine();

    ModalRealtimeLineEnegBrkd.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_LINE_ENERGY',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeLineEnegBrkd'
    };

    ModalRealtimeLineEnegBrkd.prototype.renderModal = function () {
        this.isFirstRender = true;
    }
    ModalRealtimeLineEnegBrkd.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(!this.chart || this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            var startTime = endTime.split(' ')[0] + ' 00:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var dsChartCog = _this.entity.modal.dsChartCog;
                var entityItem = _this.dealWithData(dataSrc,dsChartCog);
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis: [
                        {
                            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                        }
                    ],
                    yAxis: [{}],
                    series: entityItem[1]
                };
                _this.dsChartCog(dsChartCog, entityData);
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        }else{
            if(!this.chart.getSeries()) return;
            var crtHour = new Date().getHours();
            if(points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour){
                this.chart.addData(this.dealWithAddData(points, 4));
            }
            if(this.chart.getSeries() && this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
        }
    },
    ModalRealtimeLineEnegBrkd.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    ModalRealtimeLineEnegBrkd.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    }
    return ModalRealtimeLineEnegBrkd;
})();
/* 横向比较 折线图 分项能耗分析 end*/
function tofixed(str, accuracy){
    if(!accuracy) accuracy = 2;
    return parseFloat(str).toFixed(accuracy);
}
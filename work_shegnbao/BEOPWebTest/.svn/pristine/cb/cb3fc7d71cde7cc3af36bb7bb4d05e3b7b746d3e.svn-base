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
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            feature: {
                mark: { show: true },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true
    };
    ModalChart.prototype.renderModal = function () {
        this.chart = echarts.init(this.container).setOption(this.options);
    },
    ModalChart.prototype.updateModal = function (pointName, pointValue) {
    },
    ModalChart.prototype.showConfigMode = function () {
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
        color: ['#e84c3d', '#293949', '#1abc9c', '#f1c40f'],
        series: [
            {
                type: 'pie',
                radius: ['50%', '70%'],
                center:['60%','50%'],
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
        this.chart = echarts.init(this.container).setOption($.extend(true, {}, this.optionDefault, this.option));
    },
    ModalRealtimePie.prototype.updateModal = function (points) {
    },
    ModalRealtimePie.prototype.showConfigMode = function () {
    },
    ModalRealtimePie.prototype.dealWithData = function(points, len){
        var arr = [];
        var arrLegend = [];
        var arrSeries = [];
        for(var i = 0; i < points.length; i++){
            var temp = points[i];
            var pointAlias = AppConfig.datasource.getDSItemById(temp.dsItemId).alias;
            arrLegend.push(pointAlias);
            var seriesData = {
                 value: tofixed(temp.data),
                 name: pointAlias
            }
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
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalRealtimeLine.prototype = new ModalBase();
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
    ModalRealtimeLine.prototype.optionDefault = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            y: 'top'
        },
        grid: {x: 70, x2: 10, y2: 24},
        toolbox: {
            show: false,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        color: ['#e84c3d', '#1abc9c', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                 '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                 '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
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
                splitArea:{show:false}
            }
        ],
        series: [
            {
                type: 'line',
                symbol: 'emptyCircle',
                smooth: true
            }
        ]
    };
    ModalRealtimeLine.prototype.renderModal = function () {
        this.chart = echarts.init(this.container).setOption($.extend(true, {}, this.optionDefault, this.option));
    },
    ModalRealtimeLine.prototype.updateModal = function (points) {
    },
    ModalRealtimeLine.prototype.showConfigMode = function () {
    },
    ModalRealtimeLine.prototype.dealWithData = function (points,len) {
        var arr = [];
        var arrLegend = [];
        var arrSeries = [];
        for (var i = 0; i < points.list.length; i++) {
            var key = points.list[i].dsItemId;
            var pointAlias = AppConfig.datasource.getDSItemById(key).alias;
            arrLegend.push(pointAlias);

            var series = {
                 name: pointAlias,
                 type: 'line',
                 symbol: 'emptyCircle',
                 smooth: true,
                 data: points.list[i].data
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
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    modalRealtimeBar.prototype = new ModalBase();
    modalRealtimeBar.prototype.optionTemplate = {
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
    modalRealtimeBar.prototype.optionDefault = {
        tooltip: {
            trigger: 'item'
        },
        calculable: true,
        /*grid: {

            y: 80,
            y2: 60
        },*/
        grid: {borderWidth: 0,x: 70, x2: 10, y2: 24},
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
                splitArea:{show:false}
            }
        ],
        series: [
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
                        },
                        label: {
                            show: false,
                            position: 'top',
                            formatter: '{b}\n{c}'
                        },
                        barBorderRadius: [5, 5, 0, 0]
                    }
                }
            }
        ]
    };
    modalRealtimeBar.prototype.renderModal = function () {
        this.chart = echarts.init(this.container).setOption($.extend(true, {}, this.optionDefault, this.option));
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
var modalRealtimeBarEnegBrkd = (function () {

    function modalRealtimeBarEnegBrkd(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        modalRealtimeBar.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

    };
    modalRealtimeBarEnegBrkd.prototype = new modalRealtimeBar();

    modalRealtimeBarEnegBrkd.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_CHART_BAR_ENERGY',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'modalRealtimeBarEnegBrkd'
    };

    modalRealtimeBarEnegBrkd.prototype.renderModal = function () {
        this.isFirstRender = true;
    },

    modalRealtimeBarEnegBrkd.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var entityItem = dealWithData(points,4);
        if(this.isFirstRender){
            var entityData = {
                grid: {x: 70, x2: 10, y2: 24},
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
            this.chart = echarts.init(this.container,'macarons').setOption($.extend(true, {}, this.optionDefault, entityData));
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
        function dealWithData(points,len){
            var arr = [];
            var arrXAxis = [];
            var arrData = [];
            var arrMpData = [];
            for(var i = 0, temp; i < points.length; i++){
                temp = points[i];
                var pointAlias = AppConfig.datasource.getDSItemById(temp.dsItemId).alias;
                arrXAxis.push(pointAlias);
                arrData.push(tofixed(temp.data));
                arrMpData.push({xAxis: i, yAxis: tofixed(temp.data), value: tofixed(temp.data), name: pointAlias, symbolSize: 32})
            }
            arr.push(arrXAxis);
            arr.push(arrData);
            arr.push(arrMpData);
            return arr;
        }
    },
    modalRealtimeBarEnegBrkd.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    return modalRealtimeBarEnegBrkd;
})();
/* 横向比较 自定义柱图 end*/


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
        if(this.isFirstRender){
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
            this.chart = echarts.init(this.container).setOption($.extend(true, {}, this.optionDefault, entityData));
            this.isFirstRender = false
        }else{
            var seriesData = (function(points,len){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push({value: tofixed(points[i].data), name: AppConfig.datasource.getDSItemById(points[i].dsItemId).alias});
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
        if(this.isFirstRender){
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
            this.chart = echarts.init(this.container).setOption($.extend(true, {}, this.optionDefault, entityData));
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
        if(this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
            var startTime = endTime.split(' ')[0] + ' 01:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (result) {
                var dataSrc = JSON.parse(result);
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var entityItem = _this.dealWithData(dataSrc,2);
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis: [
                        {
                            data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
                        }
                    ],
                    series: entityItem[1]
                };
                _this.chart = echarts.init(_this.container,'macarons').setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        } else{
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
        if(this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < 1; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
            var startTime = endTime.split(' ')[0] + ' 01:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (result) {
                var dataSrc = JSON.parse(result);
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var entityItem = _this.dealWithData(dataSrc,1);
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis: [
                        {
                            data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
                        }
                    ],
                    series: entityItem[1]
                };
                _this.chart = echarts.init(_this.container,'macarons').setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        }else{
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
        var scaleList = _this.entityOption.scaleList;
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
            this.chart = echarts.init(this.container).setOption(this.optionDefault);
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
        if(this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
            var startTime = endTime.split(' ')[0] + ' 01:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (result) {
                var dataSrc = JSON.parse(result);
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var entityItem = _this.dealWithData(dataSrc,4);
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis: [
                        {
                            data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
                        }
                    ],
                    series: entityItem[1]
                };
                _this.chart = echarts.init(_this.container,'macarons').setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        }else{
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
    return ModalRealtimeLineEnegBrkd;
})();
/* 横向比较 折线图 分项能耗分析 end*/
function tofixed(str){
    return parseFloat(str).toFixed(2);
}
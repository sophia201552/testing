/*2017 1 5  能耗趋势分析图*/
var ModalEnergyTrendAnalysis = (function () {
    function ModalEnergyTrendAnalysis(screen, entityParams, _renderModal) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        ModalBase.call(this, screen, entityParams, renderModal);
    };
    ModalEnergyTrendAnalysis.prototype = new ModalBase();
    ModalEnergyTrendAnalysis.prototype.optionTemplate = {
        name: 'toolBox.modal.ENERGY_TREND_ANALYSIS',
        parent: 0,
        mode: 'noConfigModal',
        maxNum: 1,
        title: '',
        minHeight: 3,
        minWidth: 3,
        maxHeight: 2,
        maxWidth: 4,
        type: 'ModalEnergyTrendAnalysis',
        scroll: false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };

    ModalEnergyTrendAnalysis.prototype.resize = function () {
        this.chart && this.chart.resize();
    };

    ModalEnergyTrendAnalysis.prototype.renderChartOption = function (data, time) {
        var year = new Date().getFullYear();
        var option = {
            color: ['rgb(23,171,227)'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: 10,
                right: 10,
                bottom: 10,
                top: 10,
                containLabel: true
            },
            axisLabel: {
                formatter: function (value) {
                    if (value >= 1000000 || value <= -1000) {
                        return value / 1000000 + 'm';
                    } else if (value >= 1000 || value <= -1000) {
                        return value / 1000 + 'k';
                    } else {
                        return value;
                    }
                },
                textStyle: {
                    color: '#000000'
                }
            },
            xAxis: [{
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: time,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#666666',
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#888888'
                    }
                }
            }],
            series: {
                type: 'bar',
                name: year,
                data: data
            }
        }
        var $chartContainer = $(this.container).find('.chartBox');
        this.chart = echarts.init($chartContainer[0]);
        this.chart.setOption(option);
        this.spinner && this.spinner.stop();
    };

    ModalEnergyTrendAnalysis.prototype.renderModal = function () {
        var _this = this;
        var layoutInfo = '<div class="energyAnalysis">\
							<div class="chartBox"></div>\
						</div>';
        if ($(this.container).find('.dashboardCtn').length !== 0) {
            $(this.container).find('.dashboardCtn').html(layoutInfo);
        } else {
            $(this.container).html(layoutInfo);
        }
        if (AppConfig.project === undefined) {
            var projectId = AppConfig.projectId;
        } else {
            var projectId = AppConfig.project.bindId;
        }
        var point = this.entity.modal.pointName !== '' ? this.entity.modal.pointName : ['@' + projectId + '|Accum_RealTimePower_svr'];
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { "dsItemIds": ["@" + projectId + "|Accum_RealTimePower_svr"] }).done(function (rs) {
            var date = new Date().format('yyyy-MM-dd hh:mm:ss');
            var realTimeData = rs.dsItemList[0].data;
            var timeStart = new Date().format('yyyy-01-01 00:00:00');
            var year = date.split('-')[0];
            var month = date.split('-')[1];
            var nextMonth = DateUtil.getNextMonth(Number(month));
            if (nextMonth === 1){
                year = Number(year) + 1;
            }
            if (nextMonth < 10){
                nextMonth = '0' + nextMonth;
            }
            var postData = {
                dsItemIds: point,
                timeStart: timeStart,
                timeEnd: year + '-' + nextMonth + "-01 00:00:00",
                timeFormat: 'd1'
            }
            WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(function (result) {
                if (result.timeShaft === undefined) {
                    $(_this.container).find('.chartBox').html('<div class="noData">没有历史数据</div>');
                } else {
                    var time = result.timeShaft;
                    var data = result.list[0].data;
                    var timeArr = [],
                        dataArr = [];
                    var arr = [];
                    var renderData = [];
                    for (var i = 0, length = time.length; i < length; i++) {
                        var currentMonth = time[i].split('-')[1];
                        if (i === 0) {
                            arr.push(data[i]);
                            timeArr.push(new Date(time[i]).format("MM"));
                        } else {
                            var lasttMonth = time[i - 1].split('-')[1];
                            if (lasttMonth === currentMonth) {
                                arr.push(data[i]);
                            } else {
                                if (i === length - 1) {//最后一个不要后一个的值  拿到当前的实时值 存进去
                                    dataArr.push(arr);
                                    arr = [realTimeData];
                                    dataArr.push(arr);
                                    arr = [];
                                } else {
                                    timeArr.push(new Date(time[i]).format("MM"));
                                    dataArr.push(arr);
                                    arr = [data[i]];
                                }
                            }
                        }
                    }
                    for (var j = 0, jLength = dataArr.length; j < jLength; j++) {
                        if (j !== jLength - 1) { 
                            var allNull = true, index;
                            for (var d = 0, dlen = dataArr[j].length; d < dlen;d++){//如果当前月份的所有data都是null 则当月存为0 
                                if (dataArr[j][d] !== null) { 
                                    allNull = false;
                                    index = d;
                                    break;
                                }
                            }
                            if (allNull){
                                renderData.push(0);
                            } else {
                                renderData.push(Number((dataArr[j + 1][0] - dataArr[j][index]).toFixed(0)));
                            }
                        }
                    }
                    var supplyTimeArr = [],
                        supplyDataArr = [];
                    for (var t = 0; t < 12; t++) {
                        if (timeArr[t] === undefined) {
                            var month = t + 1;
                            if (month < 10) {
                                month = '0' + month;
                            }
                            supplyTimeArr.push(month);
                            supplyDataArr.push(0);
                        } else {
                            supplyTimeArr.push(timeArr[t]);
                            supplyDataArr.push(renderData[t]);
                        }
                    }
                    _this.renderChartOption(supplyDataArr, supplyTimeArr);
                }
            })
            _this.attatchEvents();
        });
    };
    //往前推12个月
    // ModalEnergyTrendAnalysis.prototype.getPostData = function (date) {
    //     var date = new Date().format('yyyy-MM-dd hh:mm:ss');
    //     var currentYear = Number(date.split('-')[0]);
    //     var currentMonth = Number(date.split('-')[1]);
    //     var nextMonth = DateUtil.getNextMonth(12);
    //     var endTimeOneYear = currentYear;
    //     if (nextMonth === 1){
    //         endTimeOneYear = currentYear + 1;
    //     }
    //     if (nextMonth < 10){
    //         nextMonth = '0' + nextMonth;
    //     }
    //     var endMonth = nextMonth;
    //     var postData = [{
    //         dsItemIds: point,
    //         timeStart: (endTimeOneYear-1) + '-' + nextMonth + '-01 00:00:00',
    //         timeEnd: endTimeOneYear + '-' + nextMonth + '-01 00:00:00',
    //         timeFormat: 'd1'
    //     }];
    //     return postData;
    // };
    ModalEnergyTrendAnalysis.prototype.attatchEvents = function (points) {
        var _this = this;
        $(this.container).off('click').on('click', function () {
            if (AppConfig.isFactory === 0) {
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: _this.screen.store.model.option().router_id ? _this.screen.store.model.option().router_id : '1484041916218511e04b5c4e'
                    },
                    container: 'indexMain'
                });
            }
        })
    };
    return ModalEnergyTrendAnalysis;
})();
var ModalEnergyTrendAnalysisCoolSkin = (function () {
    function ModalEnergyTrendAnalysisCoolSkin(screen, entityParams) {
        ModalEnergyTrendAnalysis.call(this, screen, entityParams);
    }
    ModalEnergyTrendAnalysisCoolSkin.prototype = new ModalEnergyTrendAnalysis();
    ModalEnergyTrendAnalysisCoolSkin.prototype.renderModal = function () {
        var _this = this;
        var layoutInfo = '<div class="energyAnalysis">\
							<div class="chartBox"></div>\
						</div>';
        if ($(this.container).find('.dashboardCtn').length !== 0) {
            $(this.container).find('.dashboardCtn').html(layoutInfo);
        } else {
            $(this.container).html(layoutInfo);
        }
        if (AppConfig.project === undefined) {
            var projectId = AppConfig.projectId;
        } else {
            var projectId = AppConfig.project.bindId;
        }
        var point = this.entity.modal.pointName !== '' ? this.entity.modal.pointName : ['@' + projectId + '|Accum_RealTimePower_svr'];
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', { "dsItemIds": point}).done(function (rs) {
            var realTimeData = rs.dsItemList[0].data;
            var postData = _this.getPostData(point);
            WebAPI.post("/analysis/startWorkspaceDataGenHistogramMulti", postData).done(function (result) {
                var renderChartDataArr = [];
                var timeArr = [];
                //处理下legendName
                var nameArr = _this.tooltipName(postData);
                for (var d = 0, dlen = result.length; d < dlen; d++){
                    var data = result[d].list[0].data;
                    var time = result[d].timeShaft;
                    var dataArr = [];
                    var arr = [];
                    var renderData = [];
                    if (time.length === 0) {//没有数据的时候 补数据
                        var startTime = postData[d].timeStart;

                        var year = postData[d].timeEnd.split('-')[0];
                        var month = postData[d].timeEnd.split('-')[1];
                        var lastMonth = DateUtil.getLastMonth(Number(month));
                        if (lastMonth < 10){
                            lastMonth = '0' + lastMonth;
                        }
                        if (lastMonth === 1){
                            year = Number(year) - 1;
                        }
                        var endTime = year+'-'+lastMonth+'-01 00:00:00';
                        renderData = [0];
                        timeArr = [month+'月'];
                        getNextTime(startTime);
                        function getNextTime(time) {
                            var year = Number(time.split('-')[0]);
                            var month = Number(time.split('-')[1]);
                            var nextMonth = DateUtil.getNextMonth(month); 
                            if (nextMonth === 1){
                                year = year + 1;
                            }
                            if (nextMonth < 10){
                                nextMonth = '0' + nextMonth;
                            }
                            var getDate = year + '-' + nextMonth + '-01 00:00:00';
                            renderData.push(0);
                            timeArr.push(nextMonth+'月');
                            if (getDate !== endTime){
                                getNextTime(getDate);
                            }
                        }
                    } else { 
                        for (var i = 0, length = time.length; i < length; i++) {
                            var currentMonth = time[i].split('-')[1];
                            if (i === 0){
                                arr.push(data[i]);
                                timeArr.push(new Date(time[i]).format("MM月"));
                            } else {
                                var lastMonth = time[i - 1].split('-')[1];
                                if (lastMonth === currentMonth){
                                    arr.push(data[i]);
                                } else {
                                    if (i === length - 1) {
                                            dataArr.push(arr);
                                        //如果是当月没过完 最后一个存进去当前的实时值
                                        if (time[i] === postData[0].timeEnd){
                                            arr = [realTimeData];
                                        } else {
                                            arr = [data[i]];
                                        }
                                        dataArr.push(arr);
                                        arr = [];
                                    } else {
                                        dataArr.push(arr);
                                        arr = [data[i]];
                                        timeArr.push(new Date(time[i]).format("MM月"));
                                    }
                                }
                            }
                        }
                        for (var j = 0, jLength = dataArr.length; j < jLength; j++) {
                            if (j !== jLength - 1) { 
                                var allNull = true, index;
                                for (var m = 0, mlen = dataArr[j].length; m < mlen;m++){//如果当前月份的所有data都是null 则当月存为0 
                                    if (dataArr[j][m] !== 0) { 
                                        allNull = false;
                                        index = m;
                                        break;
                                    }
                                }
                                if (allNull){
                                    renderData.push(0);
                                } else {
                                    renderData.push(Number((dataArr[j + 1][0] - dataArr[j][index]).toFixed(0)));
                                }
                            }
                        }
                    }
                    renderChartDataArr.push({
                        name: nameArr[d],
                        data: renderData
                    });
                }
                _this.renderChartOption(renderChartDataArr, timeArr);
            })
            _this.attatchEvents();
        });
    };
    ModalEnergyTrendAnalysisCoolSkin.prototype.getPostData = function (point) { 
        var date = new Date().format('yyyy-MM-dd hh:mm:ss');
        var currentYear = Number(date.split('-')[0]);
        var currentMonth = Number(date.split('-')[1]);
        var nextMonth = DateUtil.getNextMonth(currentMonth);
        var endTimeOneYear = currentYear;
        if (nextMonth === 1){
            endTimeOneYear = currentYear + 1;
        }
        if (nextMonth < 10){
            nextMonth = '0' + nextMonth;
        }
        var endMonth = nextMonth;
        var postData = [{
            dsItemIds: point,
            timeStart: (endTimeOneYear-1) + '-' + nextMonth + '-01 00:00:00',
            timeEnd: endTimeOneYear + '-' + nextMonth + '-01 00:00:00',
            timeFormat: 'd1'
        }, {
            dsItemIds: point,
            timeStart: (endTimeOneYear-2) + '-' + nextMonth + '-01 00:00:00',
            timeEnd: (endTimeOneYear-1) + '-' + nextMonth + '-01 00:00:00',
            timeFormat: 'd1'
        }];
        return postData;
    };
    ModalEnergyTrendAnalysisCoolSkin.prototype.tooltipName = function (postData) {
        function getLastMonth(date) {
            var year = date.split('-')[0];
            var month = date.split('-')[1];
            var lastMonth = DateUtil.getLastMonth(Number(month));
            if (lastMonth === 12){
                year = Number(year) - 1;
            }
            if (lastMonth < 10){
                lastMonth = '0' + lastMonth;
            }
            return year + '-' + lastMonth;
        }
        var nameArr = [];
        for (var i = 0, len = postData.length; i < len;i++){
            var startYear = new Date(postData[i].timeStart).format('yyyy-MM');
            var endYear = getLastMonth(postData[i].timeEnd);
            var name = startYear + ' ~ ' + endYear;
            nameArr.push(name);
        }
        return nameArr;
    };
    ModalEnergyTrendAnalysisCoolSkin.prototype.renderChartOption = function (dataArr, time) {
        var nameOne = dataArr[0].name,
            nameTwo = dataArr[1].name,
            dataOne = dataArr[0].data,
            dataTwo = dataArr[1].data;
        var option = {
            color: ['rgb(215, 100, 93)','rgb(100, 244, 230)'],
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                right: 0
            },
            xAxis: [{
                type: 'category',
                show: false,
                boundaryGap: false,
                data: time
            }],
            yAxis: [{
                type: 'value',
                show: false
            }],
            // axisPointer:{
            //     lineStyle:{
            //         color: {
            //             type: 'linear',
            //             x: 0,
            //             y: 0,
            //             x2: 0,
            //             y2: 1,
            //             colorStops: [{
            //                 offset: 0, color: 'rgb(239, 255, 242)' // 0% 处的颜色
            //             }, {
            //                 offset: 1, color: 'rgba(239, 255, 242, 0.2)' // 100% 处的颜色
            //             }],
            //             globalCoord: false // 缺省为 false
            //         }
            //     },
            // },
            tooltip: {
                axisPointer : {
                    type : 'line',
                    lineStyle : {
                            color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(239, 255, 242, 0.2)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(239, 255, 242, 0.1)' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    },
                },
                textStyle: {
                    color: '#333'
                },
                extraCssText: 'text-align: left;'
            },
            series: [{
                name: nameOne,
                type: 'line',
                symbolSize:6,
                showSymbol: false,
                smooth: true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(215, 100, 93, 0.8)',
                        }, {
                            offset: 0.8,
                            color: 'rgba(244, 181, 136, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                lineStyle: {
                    normal: {
                        color: 'rgb(215, 100, 93)',
                        width: 3
                    }
                },
                data: dataOne
            }, {
                name: nameTwo,    
                type: 'line',
                symbolSize:6,
                showSymbol: false,
                smooth: true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(100, 244, 230, 0.8)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(16, 184, 249, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                lineStyle: {
                    normal: {
                        width: 3,
                        color: 'rgb(100, 244, 230)',
                    }
                },
                data: dataTwo
            }
            ]
        };
        var $chartContainer = $(this.container).find('.chartBox');
        this.chart = echarts.init($chartContainer[0], AppConfig.chartTheme);
        this.chart.setOption(option);
        this.spinner && this.spinner.stop();
    }
    return ModalEnergyTrendAnalysisCoolSkin;
})()
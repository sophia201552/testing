class EnergyMD {
    constructor(opt) {
        this.opt = opt;
        this.timeConfig = opt.timeConfig;
        this.nodesInfo = undefined;
        this.container = undefined;

    }
    show() {
        var _this = this;
        WebAPI.get('/static/app/EnergyManagement/views/module/energyMD.html').done(rsHtml => {
            this.container = $('#containerDisplayboard');
            this.container.html('').append(rsHtml);

            I18n.fillArea(this.container);
            var SpinnerLine = new LoadingSpinner({
                color: '#00FFFF'
            });
            // $('#echartDaylyMD').empty();
            SpinnerLine.spin($('.MDBox')[0]);
            WebAPI.post('/energy/getConfigInfo', {
                projectId: AppConfig.projectId,
                entityId: -1
            }).done((result) => {
                if (result.data && result.data[0]) {
                    _this.node = result.data[0];
                    _this.MDBox = $('.MDBox');
                    _this.init();

                }
            }).always(() => {
                SpinnerLine.stop();
            })
        });

    };
    init() {
        var tabId = Number($('.MDContainer .MDTabOne.MDactived').attr('data-tabId'));
        var _this = this;
        switch (tabId) {
            case 0:
                _this.initGoOverview();
                break;
            case 1:
                _this.initGoAnalysis();
                break;
            default:
                _this.initGoOverview();
                break;
        }
        // this.attachEvent();
        // this.initTimeQuery();
        // this.initTimeWidget(this.timeConfig);
        // this.dailyData();
        // this.montlyData();
        // this.yearlyData();
        // this.leftPartData();
        // this.gauge();
    };
    initGoOverview() {
        this.initMDOverview(this.MDBox);
        this.changeTab();
        this.attachEvent();
        this.initTimeQuery();
        this.initTimeWidget(this.timeConfig);
        this.dailyData();
        this.montlyData();
        this.yearlyData();
        this.leftPartData();
        this.gauge();
    }
    initGoAnalysis() {
        this.initMDAnalysis(this.MDBox);
        this.changeTab();
        this.getAnalysisPartOne();
        this.getAnalysisPartTwo();
        this.getAnalysisPartThree();
        this.getAnalysisPartFour();
        // this.attachEvent();
    }
    changeTab() {
        var _this = this;
        $('.MDTabOne').off('click.MDTabOne').on('click.MDTabOne', function() {
            $(this).removeClass('MDactived').siblings().removeClass('MDactived');
            $(this).addClass('MDactived');
            $(_this.MDBox).empty();
            _this.init()
        })
    }
    initTimeQuery() {
        $('#startTime').val(toDate().format('yyyy-MM')).datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            minView: 3,
            startView: 3,
            startDate: toDate(),
            endDate: toDate(),

        });
        $('#endTime').val(toDate().format('yyyy-MM')).datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            minView: 3,
            startView: 3,
            startDate: toDate(),
            endDate: toDate(),
        });
    }
    initMDOverview(container) {
        var dom = ``;
        dom = `<div class="MdWrap">
                    <div class="MDLeft">
                        <div class="MDBody">
                            <div class="MDParamWrap">
                                <div class="MDParamHeader"><span class="MDHeaderSpan" i18n="energyManagement.md.PARAMETER">参数管理1</span>
                                    <div class="statisTime" style="display:flex">
                                        <input type="text" id="queryTimIpt" class="form-control" />
                                        <!-- <div class="btn btnQuery" id="queryTimIptDiv"i18n="energyManagement.overview.QUERY">查询</div> -->
                                    </div>
                                </div>
                                <div class="MDParamCtn">
                                    <div class="MDParamCtnTable">
                                        <div class="MDParamCtnRow MDParamCtnTitle">
                                            <div class="MDParamCtnTd MDParamCtnTdRight"><span class="MDParamCtnSpan"style="width:auto;color:rgb(191,198,206);" i18n="energyManagement.md.PERIOD">时间周期</span>
                                                <div class="MDParamCtnTdLine"></div>
                                            </div>
                                            <div class="MDParamCtnTd"><span class="MDParamCtnSpan" i18n="energyManagement.md.LAST_MONTH">上月</span></div>
                                            <div class="MDParamCtnTd"><span class="MDParamCtnSpan MDParamCtnSpanColor1" i18n="energyManagement.md.THIS_MONTH">当月</span></div>
                                            <div class="MDParamCtnTd"><span class="MDParamCtnSpan" i18n="energyManagement.md.NEXT_MONTH">下月</span></div>
                                        </div>
                                        <div class="MDParamCtnRow MDParamCtnTitle">
                                            <div class="MDParamCtnTd "><span class="MDParamCtnSpan" i18n="energyManagement.md.RATED_CAPACITY">额定容量(KVA)</span>
                                            </div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                        </div>
                                        <div class="MDParamCtnRow MDParamCtnTitle">
                                            <div class="MDParamCtnTd "><span class="MDParamCtnSpan" i18n="energyManagement.md.DECLARATION_KVA">申报额度(KVA)</span>
                                            </div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan  MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content" id="editNextDemand"><span class="MDParamCtnSpan MDParamCtnSpanColor" ><span class="MDParamCtnSpanNextDemand">--</span><span class=" iconfont  icon-wenjianjia-"></span></span></div>
                                        </div>
                                        <div class="MDParamCtnRow MDParamCtnTitle">
                                            <div class="MDParamCtnTd "><span class="MDParamCtnSpan" i18n="energyManagement.md.MONTH_DEMAND_KVA">月最大需量(KVA)</span>
                                            </div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan  MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                        </div>
                                        <div class="MDParamCtnRow MDParamCtnTitle">
                                            <div class="MDParamCtnTd "><span class="MDParamCtnSpan" i18n="energyManagement.md.MONTH_USING">月最大使用率</span>
                                            </div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                        </div>
                                        <div class="MDParamCtnRow MDParamCtnTitle">
                                            <div class="MDParamCtnTd "><span class="MDParamCtnSpan"i18n="energyManagement.md.REALITY_USING">实时使用率</span>
                                            </div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                            <div class="MDParamCtnTd content"><span class="MDParamCtnSpan MDParamCtnSpanColor">--</span></div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div class="MDUsingWrap">
                                <div class="MDUsingHeader"><span class="MDHeaderSpan" i18n="energyManagement.md.THIS_MONTH_USING">本月实时使用量</span></div>
                                <div class="MDUsingCtn">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="MDRight">
                        <div class="MDEchartWrap">
                            <div class="MDEchartBody">
                                <div class="MDParamHeader"><span class="MDHeaderSpan" i18n="energyManagement.md.YEAR_TREND">年趋势分析</span>
                                    <div class="statisTime" style="display:flex">
                                        <input type="text" id="queryYearTimIpt" class="form-control" />
                                    </div>
                                </div>
                                <div class="MDEchartCtn echartYearMD" id="echartYearMD"></div>
                            </div>
                        </div>
                        <div class="MDEchartWrap">
                            <div class="MDEchartBody">
                                <div class="MDParamHeader"><span class="MDHeaderSpan" i18n="energyManagement.md.MONTH_TREND">月趋势分析</span>
                                    <div class="statisTime" style="display:flex">
                                        <input type="text" id="queryMonthlyTimIpt" class="form-control" />
                                    </div>
                                </div>
                                <div class="MDEchartCtn echartMonthlyMD"id="echartMonthlyMD"></div>
                            </div>
                        </div>
                        <div class="MDEchartWrap">
                            <div class="MDEchartBody">
                                <div class="MDParamHeader"><span class="MDHeaderSpan" i18n="energyManagement.md.DAILY_TREND">日趋势分析</span>
                                    <div class="statisTime" style="display:flex">
                                        <input type="text" id="queryDailyTimIpt" class="form-control" />
                                    </div>
                                </div>
                                <div class="MDEchartCtn echartDaylyMD"id="echartDaylyMD"></div>
                            </div>
                        </div>
                    </div>
            </div>`
        container.html(dom);
        I18n.fillArea(container);
    }
    initMDAnalysis(container) {
        var dom = ``;
        dom = `<div class="MDAnalysisContainer">
                <div class="MDAnalysisTop">
                    <div class="MDAnalysisTopWrap">
                        <div class="MDAnalysisTopCtn">
                            <div class="MDAnalysisTopCtnBox">
                                <div class="MDAnalysisTopCtnBoxTitle" i18n="energyManagement.md.TITLE_ONE">时序特征1</div>
                                <div class="MDAnalysisTopCtnBoxBody">
                                    <div class="MDAnalysisTopCtnTimePartTabBox">
                                        <div class="MDAnalysisTopCtnTimePartTabOne MDtimeActived" data-timeTabId="0"  i18n="energyManagement.md.WEEKDAY">工作日</div>
                                        <div class="MDAnalysisTopCtnTimePartTabOne" data-timeTabId="1"  i18n="energyManagement.md.WEEKEND">周末</div>
                                    </div>
                                    <div class="MDAnalysisTopCtnBoxBodyChart"></div>
                                </div>
                            </div>
                        </div>
                        <div class="MDAnalysisTopCtn MDAnalysisTopCtnMid">
                            <div class="MDAnalysisTopCtnBox">
                                <div class="MDAnalysisTopCtnBoxTitle" i18n="energyManagement.md.TITLE_TWO">关联性特征</div>
                                <div class="MDAnalysisTopCtnBoxBody">
                                    <div class="MDAnalysisTopCtnBoxBodyTable">
                                        <div class="MDAnalysisTopCtnBoxBodyTableThead">
                                            <div class="MDAnalysisTopCtnBoxBodyTableTheadTd" i18n="energyManagement.md.RANK">排名</div>
                                            <div class="MDAnalysisTopCtnBoxBodyTableTheadTd MDAnalysisTopCtnBoxBodyTableTheadTdMid" i18n="energyManagement.md.FACTOR">因素</div>
                                            <div class="MDAnalysisTopCtnBoxBodyTableTheadTd" i18n="energyManagement.md.CONTRIBUTE">权重</div>
                                        </div>
                                        <div class="MDAnalysisTopCtnBoxBodyTableTBody">
                                          
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="MDAnalysisTopCtn">
                            <div class="MDAnalysisTopCtnBox">
                                <div class="MDAnalysisTopCtnBoxTitle" i18n="energyManagement.md.TITLE_THREEE">预测历史</div>
                                <div class="MDAnalysisTopCtnBoxBody">
                                    <div class="MDAnalysisTopCtnHistoryChartLegend">
                                        <div class="MDAnalysisTopCtnHistoryChartLegendLine"><div class="MDAnalysisTopCtnHistoryChartLegendOne"> </div><div class="MDAnalysisTopCtnHistoryChartLegendLineText" i18n="energyManagement.md.FORMART">预测需量</div></div>
                                        <div class="MDAnalysisTopCtnHistoryChartLegendLine"><div class="MDAnalysisTopCtnHistoryChartLegendTwo"> </div><div class="MDAnalysisTopCtnHistoryChartLegendLineText" i18n="energyManagement.md.REALITY">实际需量</div></div>
                                    </div>
                                    <div class="MDAnalysisTopCtnHistoryChart"></div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="MDAnalysisBottom">
                    
                    <div class="MDAnalysisBottomBox">
                        <div class="MDAnalysisBottomWrap">
                            <div class="MDAnalysisBottomWrapTitle" i18n="energyManagement.md.TITLE_FOUR">未来24小时预测</div>
                            <div class="MDAnalysisBottomCtn">
                                <div class="MDAnalysisBottomLeft">
                                    <div class="MDAnalysisTopCtnHistoryChartLegend">
                                        <div class="MDAnalysisTopCtnHistoryChartLegendLine"><div class="MDAnalysisTopCtnHistoryChartLegendOne"> </div><div class="MDAnalysisTopCtnHistoryChartLegendLineText" i18n="energyManagement.md.Declaration">预测需量</div></div>
                                        <div class="MDAnalysisTopCtnHistoryChartLegendLine"><div class="MDAnalysisTopCtnHistoryChartLegendTwo"> </div><div class="MDAnalysisTopCtnHistoryChartLegendLineText" i18n="energyManagement.md.FORMART">实际需量</div></div>
                                    </div>
                                    <div class="MDAnalysisBottomLeftChart"></div>
                                </div>
                                <div class="MDAnalysisBottomRight">
                                    <div class="MDAnalysisBottomRightTitle" i18n="energyManagement.md.SCHEME">优化方案</div> 
                                    <div class="MDAnalysisBottomRightTable">
                                        <div class="MDAnalysisBottomRightTableThead">
                                            <div class="MDAnalysisBottomRightTableTheadTd"  i18n="energyManagement.md.RANK">排名</div>
                                            <div class="MDAnalysisBottomRightTableTheadTd MDAnalysisBottomRightTableTheadTdMid"  i18n="energyManagement.md.SCHEME_PROPOSAL">建议方案</div>
                                            <div class="MDAnalysisBottomRightTableTheadTd"  i18n="energyManagement.md.REDUCTION">预计降低需量</div>
                                        </div>
                                        <div class="MDAnalysisBottomRightTableTBody">
                                        
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        container.html(dom);
        I18n.fillArea(container);
    }
    initTimeWidget(time) {
        $('#queryTimIpt').val(toDate(time).format('yyyy-MM')).datetimepicker('remove').datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            minView: 3,
            startView: 3,
            endDate: toDate().format('yyyy-MM')
        });
        $('#queryDailyTimIpt').val(toDate(time).format('yyyy-MM-dd')).datetimepicker('remove').datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            minView: 2,
            startView: 2,
            endDate: toDate().format('yyyy-MM-dd')
        });
        $('#queryMonthlyTimIpt').val(toDate(time).format('yyyy-MM')).datetimepicker('remove').datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            minView: 3,
            startView: 3,
            endDate: toDate().format('yyyy-MM')
        });
        $('#queryYearTimIpt').val(toDate(time).format('yyyy')).datetimepicker('remove').datetimepicker({
            format: 'yyyy',
            autoclose: true,
            minView: 4,
            startView: 4,
            endDate: toDate().format('yyyy')
        });

    }

    dailyData() {
        var $iptTime = $('#queryDailyTimIpt');
        var setTime = toDate($iptTime.val());
        var clone_setTime = toDate($iptTime.val());
        var time, timeBefore;

        var isCurrentTime = (toDate(setTime.format('yyyy-MM-dd 00:00:00')).getTime() >= toDate(toDate().format('yyyy-MM-dd 00:00:00')).getTime())
        if (isCurrentTime) {
            time = {
                startTime: toDate(+toDate() - 86400000).format('yyyy-MM-dd HH:mm:ss'),
                endTime: toDate().format('yyyy-MM-dd HH:mm:ss'),
                format: 'h1',
                asd: '1'
            };
            timeBefore = {
                startTime: toDate(+toDate() - 86400000 - 86400000).format('yyyy-MM-dd HH:mm:ss'),
                endTime: toDate(+toDate() - 86400000).format('yyyy-MM-dd HH:mm:ss'),
                format: 'h1'
            }
        } else {
            time = {
                startTime: toDate(+setTime - 3600000).format('yyyy-MM-dd 00:00:00'),
                endTime: setTime.format('yyyy-MM-dd 23:59:59'),
                format: 'h1'
            };
            timeBefore = {
                startTime: toDate(+setTime - 90000000).format('yyyy-MM-dd 00:00:00'),
                endTime: toDate(+setTime - 86400000).format('yyyy-MM-dd 23:59:59'),
                format: 'h1'
            }
        }

        time.endTime = toDate(toDate(time.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss')
        timeBefore.endTime = toDate(toDate(timeBefore.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss')
        var container = $('#echartDaylyMD')[0];
        var SpinnerLine = new LoadingSpinner({
            color: '#00FFFF'
        });
        // $('#echartDaylyMD').empty();
        SpinnerLine.spin($('#echartDaylyMD')[0]);
        var timeArr = [];
        var timeArrs = [];
        this.getStackData(timeBefore, "day").done(results => {
            var timeArrs = results.timeShaft
            timeArrs.pop();
            timeArr.push(timeArrs);
            var legend = [I18n.resource.energyManagement.md.TODAY_DEMAND, I18n.resource.energyManagement.md.YESTERDAY_DEMAND];
            var series = []
            var seriesCost = [];
            series.push({
                name: I18n.resource.energyManagement.md.YESTERDAY_DEMAND,
                type: 'line',
                stack: '昨日',
                smooth: true,
                symbolSize: 0,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#FFD428'
                        }, {
                            offset: 1,
                            color: '#FFD428'
                        }], false)
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#FFD428'
                        }, {
                            offset: 1,
                            color: 'rgba(255,212,40,0)'
                        }], false)
                    }
                },

                data: results.list[0].data.map(function(ele) {
                    return parseFloat(ele).toFixed(0);
                })
            });
            this.getStackData(time, "day").done(result => {
                var timeShaft = result.timeShaft;
                timeShaft.pop();
                timeArr.push(timeShaft);
                timeArr.push(timeShaft);
                series.push({
                    name: I18n.resource.energyManagement.md.TODAY_DEMAND,
                    type: 'line',
                    stack: '今日',
                    smooth: true,
                    symbolSize: 0,
                    markLine: {
                        symbolSize: 0,
                        lineStyle: {
                            normal: {
                                symbolSize: [0, 0],
                                type: 'dotted',
                                width: 1,
                                color: '#B03A5B'
                            }
                        },
                        label: {},
                        data: [{
                                yAxis: 50000,
                                label: {
                                    normal: {
                                        show: true,
                                        color: "#F8B72D",
                                        position: 'middle',
                                        formatter: I18n.resource.energyManagement.md.DAY_DEMAND
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        color: "#F8B72D",
                                    }
                                }
                            },
                            {
                                yAxis: 60000,
                                symbolSize: [0, 0],
                                label: {
                                    normal: {
                                        color: "#EA5C02",
                                        position: 'middle',
                                        formatter: I18n.resource.energyManagement.md.DECLARATION
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        color: "#EA5C02",
                                        opacity: 1
                                    }
                                }
                            },

                        ]
                    },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#45ABFF'
                            }, {
                                offset: 1,
                                color: '#45ABFF'
                            }], false)
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#45ABFF'
                            }, {
                                offset: 1,
                                color: 'rgba(69,171,255,0.00)'
                            }], false)
                        }
                    },
                    data: result.list[0].data.map(function(ele) {
                        return parseFloat(ele).toFixed(0);
                    })
                })

                this.renderStackAreaLine(timeShaft, series, legend, container, 'day', seriesCost, timeArr)
            })

        }).always(() => {
            SpinnerLine.stop();
        })
    }
    renderStackAreaLine(xAxisData, seriesArr, lengendArr, dom, colorObj, seriesCost, timeArr) {
        var lineColor, areaColor;
        var _this = this;
        this.echartGradientList = {
            dayLine: [{
                offset: 0,
                color: '#ffd843'
            }, {
                offset: 1,
                color: '#70d35f'
            }],
            dayArea: [{
                offset: 0,
                color: 'rgba(255,216,67,0.3)'
            }, {
                offset: 1,
                color: 'rgba(112,211,95,0.3)'
            }],
            monthLine: [{
                offset: 0,
                color: '#c292f0'
            }, {
                offset: 1,
                color: '#6091ff'
            }],
            monthArea: [{
                offset: 0,
                color: 'rgba(194,146,240,0.3)'
            }, {
                offset: 1,
                color: 'rgba(96,145,255,0.3)'
            }],
            yearLine: [{
                offset: 0,
                color: '#86a9f6'
            }, {
                offset: 1,
                color: '#5edbed'
            }],
            yearArea: [{
                offset: 0,
                color: 'rgba(134,169,246,0.3)'
            }, {
                offset: 1,
                color: 'rgba(94,219,237,0.3)'
            }]
        }

        lineColor = this.echartGradientList.monthLine;
        areaColor = this.echartGradientList.monthArea;

        var option = {
            tooltip: {
                textStyle: {
                    color: "#333"
                },
                backgroundColor: "rgba(250,250,250,0.9)",
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, lineColor, false)
                    }
                },
                formatter: function(params) {
                    var dom = ``;
                    dom = `${params[0].name}</br>`
                    var keys = Object.keys(params);
                    if (params.length == 1) {
                        dom += `<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:${params[0].color.colorStops[0].color}"></span>  ${params[0].seriesName} : ${_this.getThousandsBit(params[0].data)}</br>`
                        return dom;
                    }
                    params.forEach(item => {
                        dom += `<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:${item.color.colorStops[0].color}"></span>${timeArr[params[keys[0]].seriesIndex][params[keys[0]].dataIndex].substring(5,10)} ${item.seriesName} : ${_this.getThousandsBit(item.data)}</br>`
                        keys.shift();
                    });
                    return dom;
                    // return params[0].name+'</br>'+'<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:'+params[0].color.colorStops[0].color+'"></span>'+dayOne+' '+seriesNameOne+': '+dataOne+'</br>'+'<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:'+params[1].color.colorStops[0].color+'"></span>'+dayTwo+' '+seriesNameTwo+': '+dataTwo+'</br>'
                }
            },
            legend: {
                data: lengendArr,
                show: true,
                itemHeight: 10,
                itemWidth: 10,
                symbol: 'circle',
            },
            toolbox: {},
            grid: {
                left: '2%',
                right: '4%',
                bottom: '3%',
                top: 45,
                containLabel: true
            },


            axisLabel: {
                formatter: function(value) {
                    if (value >= 1000 || value <= -1000) {
                        return value / 1000 + 'k';
                    } else {
                        return value;
                    }
                }
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: xAxisData,
                axisLine: {
                    lineStyle: {
                        color: '#E7EAEF'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#a7b1c0'
                    }
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
                    name: 'KVA',
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    min: 'dataMin',
                    splitLine: {
                        lineStyle: {
                            color: ['#E7EAEF'],
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    // axisLine: {
                    //     lineStyle:{
                    //         color:'#E7EAEF'
                    //     }
                    // },
                    axisLabel: {
                        textStyle: {
                            color: '#a7b1c0'
                        }
                    }
                }

            ],
            series: seriesArr
        };
        var charta = echarts.init(dom); //,this.opt.chartTheme
        charta.setOption(option);
        _this.charta = charta;
        // window.onresize = charta.resize;
    };
    montlyData() {
        var $iptTime = $('#queryMonthlyTimIpt');
        var setTime = toDate($iptTime.val());
        // setTime = toDate(setTime.valueOf() + toDate().getTimezoneOffset() * 60000);
        var clone_setTime = toDate($iptTime.val());
        // clone_setTime = toDate(clone_setTime.valueOf() + toDate().getTimezoneOffset() * 60000);
        var time, timeBefore;
        var isCurrentTime = (toDate(setTime.format('yyyy-MM-dd 00:00:00')).getTime() >= toDate(toDate().format('yyyy-MM-dd 00:00:00')).getTime())
        if (isCurrentTime) {
            time = {
                startTime: toDate(toDate(setTime.startTime).valueOf() - 86400000 * 30).format('yyyy-MM-dd 00:00:00'),
                endTime: toDate().format('yyyy-MM-dd HH:mm:ss'),
                format: 'd1'
            }

            var now = setTime;
            now.setMonth(now.getMonth() - 1)
            timeBefore = {
                startTime: toDate(toDate(time.startTime).valueOf() - 86400000).format('yyyy-MM-01 00:00:00'),
                endTime: toDate(now).format('yyyy-MM-dd HH:mm:ss'),
                format: 'd1'
            }

        } else {
            time = {
                startTime: toDate(+setTime).format('yyyy-MM-01 00:00:00'),
                endTime: setTime.format('yyyy-MM-' + DateUtil.daysInMonth(setTime) + ' 23:59:59'),
                format: 'd1'
            }

            timeBefore = {
                startTime: toDate(toDate(time.startTime).valueOf() - 86400000).format('yyyy-MM-01 00:00:00'),
                endTime: toDate(toDate(time.startTime).valueOf() - 86400000).format('yyyy-MM-' + DateUtil.daysInMonth(toDate(toDate(time.startTime).valueOf() - 86400000)) + ' 23:59:59'),
                format: 'd1'
            }
        }
        if (toDate(time.endTime) > toDate()) {
            time.endTime = toDate().format('yyyy-MM-dd HH:mm:ss')
            time.startTime = toDate(toDate(time.endTime).valueOf() - 86400000 * 30).format('yyyy-MM-dd 00:00:00')
        }
        time.endTime = toDate(toDate(time.endTime).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
        timeBefore.endTime = toDate(toDate(timeBefore.endTime).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
        var container = $('#echartMonthlyMD')[0];
        var SpinnerDaily = new LoadingSpinner({
            color: '#00FFFF'
        });
        SpinnerDaily.spin(container);
        this.getStackData(time, "month").done(result => {
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            var legend = [I18n.resource.energyManagement.md.NOW_MONTH_DEMAND]
            var series = []
            series.push({
                name: I18n.resource.energyManagement.md.NOW_MONTH_DEMAND,
                type: 'line',
                stack: '本月需量',
                smooth: true,
                symbolSize: 0,
                markLine: {
                    symbolSize: 0,
                    lineStyle: {
                        normal: {
                            symbolSize: [0, 0],
                            type: 'dotted',
                            width: 1,
                            color: '#B03A5B'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            formatter: '月最大需量'

                        }
                    },
                    data: [{
                            yAxis: 50000,
                            label: {
                                normal: {
                                    show: true,
                                    color: "#F8B72D",
                                    position: 'middle',
                                    formatter: I18n.resource.energyManagement.md.MONTH_DEMAND
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: "#F8B72D",
                                }
                            }
                        },
                        {
                            yAxis: 60000,
                            symbolSize: [0, 0],
                            label: {
                                normal: {
                                    color: "#EA5C02",
                                    position: 'middle',
                                    formatter: I18n.resource.energyManagement.md.DECLARATION
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: "#EA5C02",
                                    opacity: 1
                                }
                            }
                        },

                    ]
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00D0D5'
                        }, {
                            offset: 1,
                            color: '#00D0D5'
                        }], false)
                    }
                },


                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00B0AD'
                        }, {
                            offset: 1,
                            color: 'rgba(0,176,173,0.00)'
                        }], false)
                    }
                },
                data: result.list[0].data.map(function(ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })


            this.renderStackAreaLine(timeShaft, series, legend, container, 'month');
        }).always(() => {
            SpinnerDaily.stop();
        })
    }
    yearlyData() {
        var $iptTime = $('#queryYearTimIpt');
        var yearFull = $iptTime.val();
        var setTime = toDate($iptTime.val())
        var clone_setTime = toDate($iptTime.val());
        var setTimenew = toDate();
        setTimenew.setMonth(setTimenew.getMonth() - 11);
        var time = {
            startTime: yearFull + '-01-01 00:00:00', //setTime.format('yyyy-01-01 00:00:00'),
            endTime: parseInt(yearFull) + 1 + '-01-01 23:59:59', //toDate(clone_setTime.setFullYear(clone_setTime.getFullYear()+1)).format('yyyy-01-01 00:00:00'),  //toDate(clone_setTime.setYear(+1)).format('yyyy-01-01 00:00:00'),
            format: 'M1'
        }
        var timeBefore = {
            endTime: yearFull + '-01-01 23:59:59', //setTime.format('yyyy-01-01 00:00:00'),
            startTime: parseInt(yearFull) - 1 + '-01-01 00:00:00', //new Date(clone_setTime.setFullYear(clone_setTime.getFullYear()+1)).format('yyyy-01-01 00:00:00'),  //new Date(clone_setTime.setYear(+1)).format('yyyy-01-01 00:00:00'),
            format: 'M1'
        }
        var SpinnerYear = new LoadingSpinner({
            color: '#00FFFF'
        });
        var container = $('#echartYearMD')[0];
        SpinnerYear.spin(container);
        this.getStackData(time, 'year').done(result => {
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            var arrLastDayIndex = this.getDataForLastDayOfMonth(timeShaft)
            var legend = [I18n.resource.energyManagement.md.NOW_YEAR_DEMAND, I18n.resource.energyManagement.md.LAST_YEAR_DEMAND]
            var series = []
            series.push({
                name: I18n.resource.energyManagement.md.NOW_YEAR_DEMAND,
                type: 'bar',
                barGap: '50%',
                stack: '今年最大需求',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00CDD2'
                        }, {
                            offset: 1,
                            color: '#00CDD2'
                        }], false)
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00CDD2'
                        }, {
                            offset: 1,
                            color: '#00CDD2'
                        }], false)
                    }
                },
                data: arrLastDayIndex.map(function(ele) {
                    return parseFloat(result.list[0].data[ele]).toFixed(0);
                })
            });
            this.getStackData(timeBefore, 'year').done(results => {
                var _arrLastDayIndex = this.getDataForLastDayOfMonth(results.timeShaft)
                series.push({
                    name: I18n.resource.energyManagement.md.LAST_YEAR_DEMAND,
                    type: 'bar',
                    barGap: '50%',
                    stack: '去年最大需求',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#7094EC'
                            }, {
                                offset: 1,
                                color: '#7094EC'
                            }], false)
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#00CDD2'
                            }, {
                                offset: 1,
                                color: '#00CDD2'
                            }], false)
                        }
                    },
                    data: _arrLastDayIndex.map(function(ele) {
                        return parseFloat(results.list[0].data[ele]).toFixed(0);
                    })
                })
                this.renderStackArea(timeShaft, series, legend, container, 'year')
            })
        }).always(() => {
            SpinnerYear.stop();
        })
    }

    getDataForLastDayOfMonth(timeShaft) {
        var arrIndex = [];
        var date = new Date();
        if (timeShaft instanceof Array) {
            for (var i = 0; i < timeShaft.length; i++) {
                date = toDate(timeShaft[i]);
                if (DateUtil.daysInMonth(date) == date.getDate()) {
                    arrIndex.push(i);
                }
            }
        }
        return arrIndex
    }
    renderStackArea(xAxisDatas, seriesArr, lengendArr, dom, colorObj) {
        var _this = this;
        var lineColor, areaColor;
        var dataSeries = $.extend([], seriesArr[0].data);
        var yseriesMin = 0;
        dataSeries.sort(function(a, b) {
            return a - b
        });

        var seriesArra = seriesArr;
        yseriesMin = (parseFloat(dataSeries[0]) * 0.8).toFixed(0);
        var xAxisData = [];
        var keys = Object.keys(xAxisDatas);
        var XAxisEn = ['Jan', 'Feb', 'Mar', 'Apr', ' May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var XAxisZh = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        xAxisData = XAxisZh

        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
                textStyle: {
                    color: "#333"
                },
                backgroundColor: "rgba(250,250,250,0.9)",
                formatter: function(params) {
                    var dom = ``;
                    dom = `${params[0].name}</br>`
                    var keys = Object.keys(params);
                    if (params.length == 1) {
                        dom += `<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:red"></span>${params[0].name}  ${params[0].seriesName} : ${Number(params[0].data).toLocaleString()}</br>`
                        return dom;
                    }
                    params.forEach(item => {
                        dom += `<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:${item.color.colorStops[0].color}"></span> ${item.seriesName} : ${Number(item.data).toLocaleString()=='NaN'?'-':Number(item.data).toLocaleString()}</br>`
                        keys.shift();
                    });
                    return dom;
                }
            },
            legend: {
                data: lengendArr,
                show: true,
            },
            toolbox: {},
            grid: {
                left: '1%',
                right: '3%',
                bottom: '3%',
                top: 45,
                containLabel: true
            },
            lineStyle: {
                normal: {
                    width: 3,
                    shadowColor: 'rgba(0,0,0,0.4)',
                    shadowBlur: 15,
                    shadowOffsetY: 10
                }
            },
            areaStyle: {
                normal: {}
            },
            itemStyle: {
                normal: {
                    width: 3, // //new echarts.graphic.LinearGradient(0, 0, 0, 1,lineColor , false)

                }
            },
            axisLabel: {
                formatter: function(value) {
                    if (value >= 1000 || value <= -1000) {
                        return value / 1000 + 'k';
                    } else {
                        return value;
                    }
                }
            },
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: xAxisData,
                axisLine: {
                    lineStyle: {
                        color: '#E7EAEF'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#a7b1c0'
                    }
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
                name: 'KVA',
                type: 'value',
                axisLine: {
                    show: false
                },
                min: 'dataMin', //'dataMin',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#a7b1c0'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#E7EAEF'],
                    }
                }

            }, ],
            series: seriesArra
        };
        var charts = echarts.init(dom); //,this.opt.chartTheme
        charts.setOption(option);
        // window.onresize = charts.resize;
    }

    leftPartData() {
        $('.MDParamCtnTd.content').each(function(i, dom) {
            if ($(dom).find('.MDParamCtnSpanNextDemand').length > 0) {
                $(dom).find('.MDParamCtnSpanNextDemand').text('--')
            } else {
                $(dom).find('.MDParamCtnSpan ').text('--')
            }
        })
        var _this = this;
        var $iptTime = $('#queryTimIpt');
        var setTime = toDate($iptTime.val());
        // setTime = toDate(setTime.valueOf() + toDate().getTimezoneOffset() * 60000);
        var isCurrentMonth = (setTime.getMonth() == toDate().getMonth());


        var spinner = new LoadingSpinner({
            color: '#00FFFF'
        });
        var container = $('.MDParamWrap')[0];
        spinner.spin(container);

        var arrMaxUsage = [];
        var curUsage;
        var arrDeclareLimit = [];
        getRatedCapacity();
        $.when(getDeclaredLimit(), getMaxUsage(), getRealtimeUsage()).done(function() {
            var percent = [];
            for (var i = 0; i < 3; i++) {
                if (!isNaN(Number(arrMaxUsage[i])) && !isNaN(Number(arrDeclareLimit[i])) && Number(arrDeclareLimit[i]) != 0) {
                    percent[i] = (100 * arrMaxUsage[i] / arrDeclareLimit[i]).toFixed(2) + '%'
                } else {
                    percent[i] = '--'
                }
            }
            $('.MDParamCtnRow').eq(4).find('.MDParamCtnTd').eq(1).find('.MDParamCtnSpan').text(percent[0]);
            $('.MDParamCtnRow').eq(4).find('.MDParamCtnTd').eq(2).find('.MDParamCtnSpan').text(percent[1]);
            $('.MDParamCtnRow').eq(4).find('.MDParamCtnTd').eq(3).find('.MDParamCtnSpan').text(percent[2]);

            var curPercentage = '--'
            if (isCurrentMonth) {
                if (!isNaN(Number(curUsage)) && !isNaN(Number(arrDeclareLimit[1])) && Number(arrDeclareLimit[1]) != 0) {
                    curPercentage = (100 * curUsage / arrDeclareLimit[1]).toFixed(2) + '%'
                }
                $('.MDParamCtnRow').eq(5).find('.MDParamCtnTd').eq(2).find('.MDParamCtnSpan').text(curPercentage);
            } else if (toDate().getMonth() - toDate(setTime).getMonth() == 1) {
                if (!isNaN(Number(curUsage)) && !isNaN(Number(arrDeclareLimit[2])) && Number(arrDeclareLimit[2]) != 0) {
                    curPercentage = (100 * curUsage / arrDeclareLimit[2]).toFixed(2) + '%'
                }
                $('.MDParamCtnRow').eq(5).find('.MDParamCtnTd').eq(3).find('.MDParamCtnSpan').text(curPercentage);
            } else if (toDate().getMonth() - toDate(setTime).getMonth() == -1) {
                if (!isNaN(Number(curUsage)) && !isNaN(Number(arrDeclareLimit[0])) && Number(arrDeclareLimit[0]) != 0) {
                    curPercentage = (100 * curUsage / arrDeclareLimit[0]).toFixed(2) + '%'
                }
                $('.MDParamCtnRow').eq(5).find('.MDParamCtnTd').eq(1).find('.MDParamCtnSpan').text(curPercentage);
            }
        }).always(function() {
            spinner.stop();
        })

        function getRatedCapacity() {
            var $promise = $.Deferred();
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: ['@' + AppConfig.projectId + '|MD_ratedCapacity'],
                timeFormat: 'M1',
                timeStart: toDate(+toDate(setTime).setMonth(setTime.getMonth() - 1)).format('yyyy-MM-01 00:00:00'),
                timeEnd: toDate(+toDate(setTime).setMonth(setTime.getMonth() + 1)).format('yyyy-MM-01 00:00:00'),
            }).done(function(result) {
                $('.MDParamCtnRow').eq(1).find('.MDParamCtnTd').eq(1).find('.MDParamCtnSpan').text(result.list[0].data[0]);
                $('.MDParamCtnRow').eq(1).find('.MDParamCtnTd').eq(2).find('.MDParamCtnSpan').text(result.list[0].data[1]);
                $('.MDParamCtnRow').eq(1).find('.MDParamCtnTd').eq(3).find('.MDParamCtnSpan').text(result.list[0].data[2]);
            }).always(function() { $promise.resolve(); })
            return $promise.promise();
        }

        function getDeclaredLimit() {
            var $promise = $.Deferred();
            if (!isCurrentMonth) {
                WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                    dsItemIds: ['@' + AppConfig.projectId + '|MD_declaredLimit'],
                    timeFormat: 'M1',
                    timeStart: toDate(+toDate(setTime).setMonth(setTime.getMonth() - 1)).format('yyyy-MM-01 00:00:00'),
                    timeEnd: toDate(+toDate(setTime).setMonth(setTime.getMonth() + 1)).format('yyyy-MM-01 00:00:00'),
                }).done(function(result) {
                    var dataList = result.list[0].data
                    arrDeclareLimit = dataList
                    $('.MDParamCtnRow').eq(2).find('.MDParamCtnTd').eq(1).find('.MDParamCtnSpan').text(dataList[0]);
                    $('.MDParamCtnRow').eq(2).find('.MDParamCtnTd').eq(2).find('.MDParamCtnSpan').text(dataList[1]);
                    $('.MDParamCtnRow').eq(2).find('.MDParamCtnTd').eq(3).addClass('disableEdit').find('.MDParamCtnSpanNextDemand').text(dataList[2]);
                }).always(function() {
                    $promise.resolve();
                })
            } else {
                $.when(WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                        dsItemIds: ['@' + AppConfig.projectId + '|MD_declaredLimit'],
                        timeFormat: 'M1',
                        timeStart: toDate(+toDate(setTime).setMonth(setTime.getMonth() - 1)).format('yyyy-MM-01 00:00:00'),
                        timeEnd: toDate().format('yyyy-MM-01 00:00:00'),
                    }).done(function(result) {
                        arrDeclareLimit[0] = result.list[0].data[0]
                        arrDeclareLimit[1] = result.list[0].data[1]
                        $('.MDParamCtnRow').eq(2).find('.MDParamCtnTd').eq(1).find('.MDParamCtnSpan').text(result.list[0].data[0]);
                        $('.MDParamCtnRow').eq(2).find('.MDParamCtnTd').eq(2).find('.MDParamCtnSpan').text(result.list[0].data[1]);
                    }),
                    WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {
                        dsItemIds: ['@' + AppConfig.projectId + '|MD_declaredLimitNext']
                    }).done(function(result) {
                        arrDeclareLimit[2] = result.dsItemList[0].data
                        $('.MDParamCtnRow').eq(2).find('.MDParamCtnTd').eq(3).removeClass('disableEdit').find('.MDParamCtnSpanNextDemand').text(result.dsItemList[0].data);
                    })
                ).always(function() {
                    $promise.resolve();
                })
            }
            return $promise.promise();
        }

        function getMaxUsage() {
            var $promise = $.Deferred();
            var postData
            if (!isCurrentMonth) {
                postData = {
                    dsItemIds: ['@' + AppConfig.projectId + '|MD_maxUsage'],
                    timeFormat: 'd1',
                    timeStart: toDate(+toDate(setTime).setMonth(setTime.getMonth() - 1)).format('yyyy-MM-01 00:00:00'),
                    timeEnd: toDate(+toDate(setTime).setMonth(setTime.getMonth() + 2)).format('yyyy-MM-01 00:00:00'),
                }
                WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result) {
                    var arrIndex = _this.getDataForLastDayOfMonth(result.timeShaft)
                    arrMaxUsage[0] = result.list[0].data[arrIndex[0]];
                    arrMaxUsage[1] = result.list[0].data[arrIndex[1]];
                    arrMaxUsage[2] = result.list[0].data[arrIndex[2]];
                    $('.MDParamCtnRow').eq(3).find('.MDParamCtnTd').eq(1).find('.MDParamCtnSpan').text(arrMaxUsage[0]);
                    $('.MDParamCtnRow').eq(3).find('.MDParamCtnTd').eq(2).find('.MDParamCtnSpan').text(arrMaxUsage[1]);
                    $('.MDParamCtnRow').eq(3).find('.MDParamCtnTd').eq(3).find('.MDParamCtnTdTipBox').remove();
                    $('.MDParamCtnRow').eq(3).find('.MDParamCtnTd').eq(3).find('.MDParamCtnSpan').text(arrMaxUsage[2]);
                }).always(function() {
                    $promise.resolve();
                })
            } else {
                postData = {
                    dsItemIds: ['@' + AppConfig.projectId + '|MD_maxUsage'],
                    timeFormat: 'd1',
                    timeStart: toDate(+toDate(setTime).setMonth(setTime.getMonth() - 1)).format('yyyy-MM-01 00:00:00'),
                    timeEnd: toDate().format('yyyy-MM-dd 00:00:00'),
                }
                var postData2 = {
                    dsItemIds: ['@' + AppConfig.projectId + '|MD_forecast'],
                }
                var postArrs = [WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData), WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData2)]
                $.when(...postArrs).done(function(result, rs2) {
                    var arrIndex = _this.getDataForLastDayOfMonth(result[0].timeShaft)
                    arrMaxUsage[0] = result[0].list[0].data[arrIndex[0]];
                    arrMaxUsage[1] = result[0].list[0].data[result[0].list[0].data.length - 1];
                    $('.MDParamCtnRow').eq(3).find('.MDParamCtnTd').eq(1).find('.MDParamCtnSpan').text(arrMaxUsage[0]);
                    $('.MDParamCtnRow').eq(3).find('.MDParamCtnTd').eq(2).find('.MDParamCtnSpan').text(arrMaxUsage[1]);
                    var dom = `<span class="MDParamCtnTdTipBox"><span class="MDParamCtnTdTip">${i18n_resource.energyManagement.md.FORMART_TIP}</span></span>`
                    $('.MDParamCtnRow').eq(3).find('.MDParamCtnTd').eq(3).find('.MDParamCtnSpan').before(dom);
                    $('.MDParamCtnRow').eq(3).find('.MDParamCtnTd').eq(3).find('.MDParamCtnSpan').text(!isNaN(rs2[0].dsItemList[0].data) ? parseInt(rs2[0].dsItemList[0].data) : '--');
                }).always(function() {
                    $promise.resolve();
                })
            }
            return $promise.promise();
        }

        function getRealtimeUsage() {
            return WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {
                dsItemIds: ['@' + AppConfig.projectId + '|MD_currentUsage']
            }).done(function(result) {
                curUsage = result.dsItemList[0].data
            })
        }

    }
    gauge() {
        var _this = this;
        var $queryTimIpt = $('#queryTimIpt')
        var val = $queryTimIpt.val();
        var postData = {
            dsItemIds: ['@' + AppConfig.projectId + '|MD_currentUsage', '@' + AppConfig.projectId + '|MD_ratedCapacity','@' + AppConfig.projectId + '|MD_declaredLimit'],
        };
        var SpinnerYears = new LoadingSpinner({
            color: '#00FFFF'
        });
        var container = $('.MDUsingCtn')[0];
        SpinnerYears.spin(container);
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData).done(function(result) {
            var dataList = _this.sortDsList(result.dsItemList, postData.dsItemIds);
            _this.renderGauge(dataList[0].data, dataList[1].data, dataList[2].data);
        }).always(() => {
            SpinnerYears.stop();
        })

    }
    sortDsList(list, arrKey) {
        var __list__ = [];
        arrKey.forEach(function(key) {
            var flag = false;
            for (var i = 0; i < list.length; i++) {
                if (list[i].dsItemId == key) {
                    __list__.push(list[i])
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                __list__.push({ dsItemId: key, data: null })
            }
        })
        return __list__;
    }

    renderGauge(dataOne, dataTwo, dataThree) {
            dataOne == "NaN" ? dataOne = 0 : 1;
            var option = {
                tooltip: {
                    formatter: "{a} <br/>{c} {b}"
                },
                color: '#333',
                legend: {
                    show: true,
                    data: [I18n.resource.energyManagement.md.WITHIN, I18n.resource.energyManagement.md.WITHOUT],
                    selectedMode: false, //图例禁止点击
                    right: 10,
                    top: 20,
                    orient: 'vertical',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        color: '#707070',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: 'sans-serif',
                        fontSize: 11,
                    },
                },
                grid: {
                    z: 1, //grid作为柱状图的坐标系，其层级要和仪表图层级不同，同时隐藏
                    show: false,
                    left: '-30%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                    splitLine: {
                        show: false //隐藏分割线
                    },

                },
                xAxis: [ //这里有很多的show，必须都设置成不显示
                    {
                        type: 'category',
                        data: [],
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        splitArea: {
                            interval: 'auto',
                            show: false
                        }
                    }
                ],
                yAxis: [ //这里有很多的show，必须都设置成不显示
                    {
                        type: 'value',
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                    }
                ],
                toolbox: {
                    show: false,
                },
                series: [{
                        title: {
                            color: "#333",
                            offsetCenter: [0, '80%']
                        },
                        name: I18n.resource.energyManagement.md.THIS_MONTH_USING,
                        type: 'gauge',
                        // radius:'85%',
                        startAngle: '195',
                        endAngle: '-15',
                        detail: {

                            formatter: '{value}',
                            color: '#25272B',
                            fontWeight: 'lighter',
                            fontSize: '10',
                        },
                        pointer: {
                            width: "2"
                        },
                        axisLabel: {
                            show: false
                        },
                        max: dataTwo,
                        axisTick: {
                            length: 2,
                            lineStyle: {
                                color: "rgb(241,243,250)",
                                width: "1",
                            }
                        },
                        splitLine: {
                            length: '10',
                            lineStyle: {
                                color: "rgb(241,243,250)",
                                width: "1",
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: [
                                    [isNaN(dataThree / dataTwo)?1:(dataThree / dataTwo), 'rgb(0,208,213)'],
                                    [1, 'rgb(233,80,9)']
                                ],
                                width: 10
                            }
                        },
                        data: [{ value: dataOne, name: 'KVA' }]
                    },
                    {
                        name: I18n.resource.energyManagement.md.WITHIN,
                        type: 'bar',
                        barWidth: '60%',
                        data: [0],
                        itemStyle: {
                            normal: {
                                color: 'rgb(0,208,213)',
                            }
                        }
                    },
                    {
                        name: I18n.resource.energyManagement.md.WITHOUT,
                        type: 'bar',
                        barWidth: '60%',
                        data: [0],
                        itemStyle: {
                            normal: {
                                color: 'rgb(233,80,9)',
                            }
                        }
                    },
                ]
            };

            var chart = echarts.init($('.MDUsingCtn')[0]); //,this.opt.chartTheme
            chart.setOption(option);
            window.onresize = chart.resize;
        }
        //获取千分位
    getThousandsBit(num) {　　
        var re = /\d{1,3}(?=(\d{3})+$)/g;　　
        var n1 = num.toString().replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
            return s1.replace(re, "$&,") + s2;
        });　　
        return n1;
    }
    getStackData(time, day) {
        var _this = this;
        var $promise = $.Deferred();
        if (!this.node || (this.node && this.node.energy == '') || (this.node && !this.node.energy)) {

            // alert(I18n.resource.energyManagement.overview.NO_POINT_ALERT);
            return $promise.reject();
        }
        var postData = {
            dsItemIds: ['@' + AppConfig.projectId + '|MD_currentUsage'],
            timeStart: time.startTime,
            timeEnd: time.endTime,
            timeFormat: time.format
        };
        if (day == 'year') {
            postData = {
                dsItemIds: ['@' + AppConfig.projectId + '|MD_maxUsage', '@' + AppConfig.projectId + '|MD_maxUsage', '@' + AppConfig.projectId + '|MD_declaredLimit'],
                timeStart: time.startTime,
                timeEnd: time.endTime,
                timeFormat: 'd1'
            };
        }
        if (day == "day") {
            postData = {
                dsItemIds: ['@' + AppConfig.projectId + '|MD_currentUsage', '@' + AppConfig.projectId + '|MD_maxUsage', '@' + AppConfig.projectId + '|MD_declaredLimit'],
                timeStart: time.startTime,
                timeEnd: time.endTime,
                timeFormat: time.format
            };
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result) {
            if (result.list) {
                $promise.resolveWith(_this, [result]);
            } else {
                $promise.reject();
            }
        }).fail(function() {
            $promise.reject();
        })
        return $promise.promise();
    };
    onTimeChange(time) {
        this.timeConfig = time
        this.attachEvent()
    };
    attachEvent() {
            var _this = this;
            var $MDRight = $('.MDRight');
            var $MDLeft = $('.MDLeft');
            $MDRight.find('#queryDailyTimIpt').off('change').on('change', function() {
                _this.dailyData();
            });
            $MDRight.find('#queryMonthlyTimIpt').off('change').on('change', function() {
                _this.montlyData();
            });
            $MDRight.find('#queryYearTimIpt').off('change').on('change', function() {
                _this.yearData();
            });
            $MDLeft.find('#queryTimIpt').off('change').on('change', function() {
                _this.leftPartData();
            });
            $MDLeft.find('#editNextDemand').off('click').on('click', function(e) {
                var str = window.prompt("请输入下月申报额度", "");
                str = str.replace(/(^\s*)|(\s*$)/g, "");
                if (str == null || str == '' || str == undefined) { return }
                WebAPI.post("/set_realtimedata", { db: AppConfig.projectId, point: 'MD_declaredLimitNext', value: str }).done((rs) => {
                    $(e.currentTarget).find('.MDParamCtnSpanNextDemand').text(str);
                    alert('修改成功');
                })


            })
            $(window).off('resize.temperatureCtn').on('resize.temperatureCtn', function() {
                //echarts重绘
                $('[_echarts_instance_]').each(function(i, dom) {
                    var img = echarts.getInstanceById(dom.getAttribute('_echarts_instance_')).resize()
                });

            })

        }
        //时间特征
    getAnalysisPartOne() {
        var _this = this;
        var postData = {
            dsItemIds: ['@' + AppConfig.projectId + '|MD_his_feature']
        }
        var Spinner = new LoadingSpinner({
            color: '#00FFFF'
        });
        Spinner.spin($('.MDAnalysisTopCtnBoxBody')[0]);
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData).done((rs) => {
            if (rs.dsItemList[0].data == 'Null') { return }
            var json = JSON.parse(rs.dsItemList[0].data.replace(/'/g, '"'));
            _this.jsonOne = json;
            _this.getAnalysisPartOneMain(json);
            _this.AnalysisPartOneAttachEvent();
        }).always(() => {
            Spinner.stop()
        })
    }
    getAnalysisPartOneMain(json) {
        var _this = this;
        if (typeof(json.weekday) != 'object') { return }
        var timeTabId = Number($('.MDAnalysisTopCtnTimePartTabOne.MDtimeActived').attr('data-timeTabId'));
        switch (timeTabId) {
            case 0:
                _this.renderAnalysisChart(json.weekday);
                break;
            case 1:
                _this.renderAnalysisChart(json.weekend);
                break;
            default:
                _this.renderAnalysisChart(json.weekday);
                break;
        }
    }
    AnalysisPartOneAttachEvent() {
            var _this = this;
            $('.MDAnalysisTopCtnTimePartTabOne').off('click').on('click', function() {
                $(this).removeClass('MDtimeActived').siblings().removeClass('MDtimeActived');
                $(this).addClass('MDtimeActived');
                _this.getAnalysisPartOneMain(_this.jsonOne);
            })
        }
        //时间特征折线
    renderAnalysisChart(data) {
        var timeShaft = [];
        var classCt = $('.MDAnalysisTopCtnBoxBodyChart')[0]
        for (var i = 0; i < 24; i++) {
            i < 10 ? timeShaft.push("0" + i + ":00") : timeShaft.push(i + ":00")
        }
        var option = {
            backgroundColor: 'transport',
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                show: false,
            },
            grid: {
                left: 30,
                top: '30px',
                right: 0,
                bottom: '25px',
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#808FA3',
                        fontSize: 10,
                        align: 'left'
                    }
                },

                data: timeShaft
            }],
            yAxis: [{
                type: 'value',
                /*min:'dataMin',*/
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                axisLabel: {
                    margin: 10,
                    formatter: function(value) {
                        if (value >= 1000 || value <= -1000) {
                            return value / 1000 + 'k';
                        } else {
                            return value;
                        }
                    },
                    textStyle: {
                        color: '#808FA3',
                        fontSize: 10
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#dfe2e5'
                    }
                }
            }],
            series: {
                name: '',
                type: 'line',
                // smooth: true,
                symbol: 'none',
                // symbolSize: 5,
                // showSymbol: false,
                markPoint: {
                    symbolSize: 40,
                    label: {
                        normal: {
                            color: '#333',
                            formatter: function(params) {
                                params.data.value = params.data.value.toLocaleString();
                                return params.data.value
                            },
                            fontSize: 10
                        }
                    },
                    itemStyle: {
                        color: '#7aabf3'
                    },
                    data: [
                        { type: 'max', name: '最大值' },
                    ]
                },
                lineStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#5edbed'
                        }, {
                            offset: 1,
                            color: '#86a9f6'
                        }]),
                        width: 3,
                        shadowColor: 'rgba(0,0,0,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(94,219,237,0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(134,169,246,0)'
                        }], false),
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#5edbed'
                        }, {
                            offset: 1,
                            color: '#86a9f6'
                        }])
                    },
                    emphasis: {
                        borderWidth: 0
                    }
                },
                data: data
            }

        };
        var chart = echarts.init(classCt); //,this.opt.chartTheme
        chart.setOption(option);
    }

    //关联性特征
    getAnalysisPartTwo() {
        var _this = this;
        var postData = {
            dsItemIds: ['@' + AppConfig.projectId + '|MD_relation_feature']
        }
        var Spinner = new LoadingSpinner({
            color: '#00FFFF'
        });
        Spinner.spin($('.MDAnalysisTopCtnBoxBody')[1]);
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData).done((rs) => {
            if (rs.dsItemList[0].data == 'Null') { return }
            var json = eval(rs.dsItemList[0].data);
            _this.jsonTwo = json;
            _this.getAnalysisPartTwoMain(json);
        }).always(() => {
            Spinner.stop();
        })
    }
    getAnalysisPartTwoMain(json) {
        if (typeof(json) != 'object') { return }
        var $MDAnalysisTopCtnBoxBodyTableTBody = $('.MDAnalysisTopCtnBoxBodyTableTBody');
        $MDAnalysisTopCtnBoxBodyTableTBody.empty();
        var html = ``;
        for (var i = 0, len = json.length; i <= len - 1; i++) {
            html += `<div class="MDAnalysisTopCtnBoxBodyTableTr">
                        <div class="MDAnalysisTopCtnBoxBodyTableTheadTd">${i+1}</div>
                        <div class="MDAnalysisTopCtnBoxBodyTableTheadTd MDAnalysisTopCtnBoxBodyTableTheadTdMid">${json[i].factor}</div>
                        <div class="MDAnalysisTopCtnBoxBodyTableTheadTd">${json[i].contribute}</div>
                    </div>`
        }
        $MDAnalysisTopCtnBoxBodyTableTBody.html(html);

    }
    getAnalysisPartThree() {
        var _this = this;
        var postData1 = {
            "dsItemIds": ["@" + AppConfig.projectId + "|MD_predict_nexthour"],
            "timeFormat": "h1",
            "timeStart": toDate(toDate(this.timeConfig).valueOf() - 3600000 * 23).format('yyyy-MM-dd HH:00:00'),
            "timeEnd": toDate(this.timeConfig).format('yyyy-MM-dd HH:00:00')
        }
        var postData2 = {
            "dsItemIds": ["@" + AppConfig.projectId + "|MD_real_last_hour"],
            "timeFormat": "h1",
            "timeStart": toDate(toDate(this.timeConfig).valueOf() - 3600000 * 22).format('yyyy-MM-dd HH:00:00'),
            "timeEnd": toDate(toDate(this.timeConfig).valueOf() + 3600000).format('yyyy-MM-dd HH:00:00')
        }
        var Spinner = new LoadingSpinner({
            color: '#00FFFF'
        });
        Spinner.spin($('.MDAnalysisTopCtnBoxBody')[2]);
        var promiseArr = [WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData1), WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData2)];
        $.when(...promiseArr).done((rs, rs1) => {
            // var timeShaft=[];
            // for (var i=0;i<24;i++){
            //     i<10?timeShaft.push("0"+i+":00"):timeShaft.push(i+":00")
            // }
            // rs[0].list[0].data=[1,5,63,53,55,6,1,1,1,1,1,5,63,53,55,1,5,63,53,55,1,5,63,53];
            // rs1[0].list[0].data=[13,53,63,53,55,6,14,1,1,16,1,5,63,33,1,5,63,53,55,1,5,63,53,55];
            // rs1[0].timeShaft=timeShaft;
            // rs[0].timeShaft=timeShaft;
            _this.getAnalysisPartThreeMain(rs[0].timeShaft, rs[0].list[0].data, rs1[0].list[0].data);
        }).always(() => {
            Spinner.stop();
        });
    }
    getAnalysisPartThreeMain(x1, data1, data2) {
        this.getAnalysisPartThreeChart(x1, data1, data2);
    }
    getAnalysisPartThreeChart(x1, data1, data2) {
        var classCt = $('.MDAnalysisTopCtnHistoryChart')[0]
        var option = {
            backgroundColor: 'transport',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                }
            },
            legend: {
                show: false,
                // data:['预测需量','实际需量'],
                // formatter: function (name,index) {
                //     console.log(name);
                //     console.log(index)
                //         var dom=``;
                //         dom=`<div style="display:inline-block;width:40px;height:20px;background:red;"> ${name}</div>`
                //     return   name;
                // }
            },
            grid: {
                left: 30,
                top: '25px',
                right: 0,
                bottom: '25px',
            },
            xAxis: [{
                type: 'category',
                // boundaryGap: false,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#808FA3',
                        fontSize: 10,
                        align: 'left'
                    }
                },

                data: x1
            }],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                axisLabel: {
                    margin: 10,
                    formatter: function(value) {
                        if (value >= 1000 || value <= -1000) {
                            return value / 1000 + 'k';
                        } else {
                            return value;
                        }
                    },
                    textStyle: {
                        color: '#808FA3',
                        fontSize: 10
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#dfe2e5'
                    }
                }
            }],
            series: [{
                    name: i18n_resource.energyManagement.md.FORMART,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#7094ec'
                            }, {
                                offset: 1,
                                color: '#7094ec'
                            }], false),
                        },
                        width: 3,
                        shadowColor: 'rgba(211,187,172,1)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    },
                    // areaStyle: {
                    //     normal: {
                    //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //             offset: 0,
                    //             color:'rgba(112,148,236,0.5)'
                    //         }, {
                    //             offset: 1,
                    //             color: 'rgba(112,148,236,0)'
                    //         }], false),
                    //     }
                    // },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#7094ec'
                            }, {
                                offset: 1,
                                color: '#7094ec'
                            }])
                        },
                        emphasis: {
                            borderWidth: 0
                        }
                    },
                    data: data1
                },
                {
                    name: i18n_resource.energyManagement.md.REALITY,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#fdbf58'
                            }, {
                                offset: 1,
                                color: '#fdbf58'
                            }]),
                            width: 3,
                            shadowColor: 'rgba(211,187,172,1)',
                            shadowBlur: 10,
                            shadowOffsetY: 10
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(253,191,88,0.3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(253,191,88,0)'
                            }], false),
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#ffcf00'
                            }, {
                                offset: 1,
                                color: '#ffcf00'
                            }])
                        },
                        emphasis: {
                            borderWidth: 0
                        }
                    },
                    data: data2
                }
            ]

        };
        var chart = echarts.init(classCt); //,this.opt.chartTheme
        chart.setOption(option);
    }
    getAnalysisPartFour() {
        var _this = this;
        var postData = {
            dsItemIds: ['@' + AppConfig.projectId + '|MD_declaredLimit']
        }
        var postData1 = {
            dsItemIds: ['@' + AppConfig.projectId + '|MD_prediction_day']
        }
        var postData2 = {
            dsItemIds: ['@' + AppConfig.projectId + '|MD_suggestion']
        }
        var promiseArrs = [WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData), WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData1), WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData2)]
        var Spinner = new LoadingSpinner({
            color: '#00FFFF'
        });
        Spinner.spin($('.MDAnalysisBottomCtn')[0]);
        $.when(...promiseArrs).done((rs, rs1, rs2) => {
            if (rs[0].dsItemList[0].data == 'Null') { return }
            if (rs1[0].dsItemList[0].data == 'Null') { return }
            _this.getAnalysisPartFourMain(rs[0].dsItemList[0].data, rs1[0].dsItemList[0].data, rs2[0].dsItemList[0].data);
        }).always(() => {
            Spinner.stop();
        });
    }
    getAnalysisPartFourMain(data1, data2, data3) {
        var json = eval(data2);
        var jsonSug = eval(data3);
        var timeArr = [];
        var dataArr = [];
        var sugArr = [];
        for (var i = 0, len = json.length; i <= len - 1; i++) {
            if (jsonSug.length) {
                $('.MDAnalysisBottomRight').css({ 'width': '40%' });
                $('.MDAnalysisBottomLeft').css({ 'width': '60%' });
                // sugArr.push({"suggestion":json[i].suggestion,"contribute":json[i].contribute,"md_diff":Math.abs(json[i].md_diff)});
            }
            dataArr.push(parseInt(json[i].md_prediction));

        }
        // sugArr.sort((a,b)=>{
        //     return a.md_diff>b.md_diff?-1:a.md_diff<b.md_diff?1:0;
        // });
        var timeHour = Number(toDate(this.timeConfig).format('HH'));
        for (var i = (timeHour + 1); i < 24; i++) {
            i < 10 ? timeArr.push("0" + i + ":00") : timeArr.push(i + ":00")
        }
        for (var i = 0; i <= timeHour; i++) {
            i < 10 ? timeArr.push("0" + i + ":00") : timeArr.push(i + ":00")
        }

        this.getAnalysisPartFourChart(data1, dataArr, timeArr);
        this.getAnalysisPartFourTable(jsonSug);
    }
    getAnalysisPartFourChart(data1, data2, timeArr) {
        var seriesArr = [];
        var classCt = $('.MDAnalysisBottomLeftChart')[0];
        seriesArr.push({
            name: i18n_resource.energyManagement.md.FORMART,
            type: 'line',
            smooth: true,
            symbol: 'none',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#fdbf58'
                    }, {
                        offset: 1,
                        color: '#fdbf58'
                    }]),
                    width: 3,
                    shadowColor: 'rgba(211,187,172,1)',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(253,191,88,0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(253,191,88,0)'
                    }], false),
                }
            },
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#fdbf58'
                    }, {
                        offset: 1,
                        color: '#fdbf58'
                    }])
                },
                emphasis: {
                    borderWidth: 0
                }
            },

            data: data2
        });
        if (!isNaN(data1)) {
            var data1Arr = [];
            for (var i = 0; i < 24; i++) {
                data1Arr.push(data1)
            }
            seriesArr.push({
                name: i18n_resource.energyManagement.md.Declaration,
                type: 'line',
                smooth: true,
                symbol: 'none',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#6091ff'
                        }, {
                            offset: 1,
                            color: '#c292f0'
                        }]),
                        width: 3,
                        shadowColor: 'rgba(0,0,0,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#c292f0'
                        }, {
                            offset: 1,
                            color: '#c292f0'
                        }])
                    },
                    emphasis: {
                        borderWidth: 0
                    }
                },

                data: data1Arr
            });
        }
        var option = {
            backgroundColor: 'transport',
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                show: false,
                // data:['申报需量','预测需量']
            },
            grid: {
                left: 30,
                top: '25px',
                right: 0,
                bottom: '25px',
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#808FA3',
                        fontSize: 10,
                        align: 'left'
                    }
                },
                data: timeArr
            }],
            yAxis: [{
                type: 'value',
                /*min:'dataMin',*/
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                axisLabel: {
                    margin: 10,
                    formatter: function(value) {
                        if (value >= 1000 || value <= -1000) {
                            return value / 1000 + 'k';
                        } else {
                            return value;
                        }
                    },
                    textStyle: {
                        color: '#808FA3',
                        fontSize: 10
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#dfe2e5'
                    }
                }
            }],
            series: seriesArr

        };
        var chart = echarts.init(classCt); //,this.opt.chartTheme
        chart.setOption(option);
    }
    getAnalysisPartFourTable(json) {
        var $MDAnalysisTopCtnBoxBodyTableTBody = $('.MDAnalysisBottomRightTableTBody');
        $MDAnalysisTopCtnBoxBodyTableTBody.empty();
        var html = ``;
        for (var i = 0, len = json.length; i <= len - 1; i++) {
            html += `<div class="MDAnalysisBottomRightTableTr">
                        <div class="MDAnalysisBottomRightTableTheadTd">${i+1}</div>
                        <div class="MDAnalysisBottomRightTableTheadTd MDAnalysisBottomRightTableTheadTdMid" title="${json[i].Suggestion}">${json[i].Suggestion}</div>
                        <div class="MDAnalysisBottomRightTableTheadTd">${json[i].predict_md}</div>
                    </div>`
        }
        $MDAnalysisTopCtnBoxBodyTableTBody.html(html);
    }
    destory() {
        this.opt = null;
        this.timeConfig = null;
        this.nodesInfo = null;
        this.container = null;
    }
}
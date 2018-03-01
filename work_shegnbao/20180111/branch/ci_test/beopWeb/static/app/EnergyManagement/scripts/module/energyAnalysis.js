class EnergyAnalysis {
    constructor(opt) {
        this.opt = opt;
        this.timeConfig = opt.timeConfig;
        this.nodesInfo = undefined;
        this.container = undefined;

    }
    show() {
        WebAPI.get('/static/app/EnergyManagement/views/module/energyAnalysis.html').done(rsHtml => {
            this.container = $('#containerDisplayboard');
            this.container.html('').append(rsHtml);
            I18n.fillArea(this.container);
            this.init();
        });

    };
    init() {
        let $factorsCanvas = $(this.container).find('.factorsCanvas')
        this.renderEcharts($factorsCanvas[0]);
        this.attachEvent();
        this.initTimeQuery();
    };
    initTimeQuery(){
        $('#startTime').val(new Date().format('yyyy-MM')).datetimepicker({
            format: 'yyyy-mm',
            autoclose:true,
            minView:3,
            startView:3
        });
        $('#endTime').val(new Date(new Date().setMonth(new Date().getMonth()+1)).format('yyyy-MM')).datetimepicker({
            format: 'yyyy-mm',
            autoclose:true,
            minView:3,
            startView:3
        });        
    }
    renderEcharts(echartsCtn) {
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c}"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                top: "55%",
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 10,
                textStyle: {
                    color: 'rgb(143,143,145)'
                },
                formatter: '{name}',
                data: [{
                    name: 'Primary chilled water pump',
                    icon: 'circle',
                    textStyle: {
                        fontSize: '13',
                    }
                },
                {
                    name: 'Fouling in condenser of chiller',
                    icon: 'circle',
                    textStyle: {
                        fontSize: '13',
                    }
                },
                {
                    name: 'Outdoor dry bulb temperature',
                    icon: 'circle',
                    textStyle: {
                        fontSize: '13',
                    }
                },
                {
                    name: 'Cooling tower status control fault',
                    icon: 'circle',
                    textStyle: {
                        fontSize: '13',
                    }
                },
                {
                    name: 'Secondary chilled water pump',
                    icon: 'circle',
                    textStyle: {
                        fontSize: '13',
                    }
                },
                {
                    name: 'Cooling water pump status control fault',
                    icon: 'circle',
                    textStyle: {
                        fontSize: '13',
                    }
                },
                ]
            },
            color:
            ['rgb(237,74,9)', 'rgb(248,147,41)', 'rgb(245,210,82)', 'rgb(117,148,230)', 'rgb(68,168,254)', 'rgb(120,196,220)']
            ,
            series: [
                {
                    type: 'pie',
                    radius: ['10%', '65%'],
                    center: ['50%', '30%'],
                    roseType: 'area',
                    labelLine: {
                        normal: {
                            length: 3,
                            length2: 3,
                        }
                    },
                    label: {
                        normal: {

                            formatter: '{d}%',
                            textStyle: {
                                color: 'rgb(143,143,145)',
                                fontWeight: 'lighter',
                            }
                        }
                    },
                    data: [
                        {
                            value: 16900,
                            name: 'Primary chilled water pump',

                        },
                        {
                            value: 8400,
                            name: 'Fouling in condenser of chiller',

                        },
                        {
                            value: 5240,
                            name: 'Outdoor dry bulb temperature',

                        },
                        {
                            value: 4200,
                            name: 'Cooling tower status control fault',
                        },
                        {
                            value: 3420,
                            name: 'Secondary chilled water pump',
                        },
                        {
                            value: 360,
                            name: 'Cooling water pump status control fault',
                        },


                    ]
                }
            ]
        }
        var echart = echarts.init(echartsCtn);
        echart.setOption(option);
        window.onresize = echart.resize;
    };

    renderLineEcharts($container, dataSrc) {
        let seriesArr = [];
        var timeArr = [];
        var lengendName = [];
        var yName = '';
        var isNum;
        let historyArr = [];
        if (this.lineName == "Fouling in condenser of chiller" || this.lineName == "Weather outdoor dry bulb temperature") {
            yName = '℃';
        }
        yName === '℃' ? isNum = true : 1;
        var lineColorArr = [[{ offset: 0, color: '#c292f0' }, { offset: 1, color: '#6091ff' }], [{ offset: 0, color: '#ffd843' }, { offset: 1, color: '#70d35f' }], [{ offset: 0, color: '#86a9f6' }, { offset: 1, color: '#5edbed' }]];
        var areaColorArr = [[{ offset: 0, color: 'rgba(194,146,240,0.3)' }, { offset: 1, color: 'rgba(96,145,255,0.3)' }], [{ offset: 0, color: 'rgba(255,216,67,0.3)' }, { offset: 1, color: 'rgba(112,211,95,0.3)' }], [{ offset: 0, color: 'rgba(134,169,246,0.3)' }, { offset: 1, color: 'rgba(94,219,237,0.3)' }]]
        for (let k = 0, length = dataSrc[0].history.length; k < length; k++) {
            let time = dataSrc[0].history[k].time.substring(5, 16)
            timeArr.push(time)
        }
        for (let i = 0, length = dataSrc.length; i < length; i++) {
            lengendName.push(dataSrc[i].name);
            historyArr = [];
            //若是温度类的data 保留小数一位。
            if (isNum === true) {
                dataSrc[i].history.forEach(function (element) {
                    historyArr.push(Number(element.value).toFixed(1))
                });
            } else {
                historyArr = dataSrc[i].history
            }
            seriesArr.push({
                name: dataSrc[i].name,
                type: 'line',
                data: historyArr,
                smooth: true,
                symbol: 'circle',
                symbolSize: 3,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, lineColorArr[i], false),
                        shadowColor: 'rgba(0,0,0,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, areaColorArr[i], false)
                    }
                },
            })
        }
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#b3b3b3',
                        width: '1',
                    },
                },
                backgroundColor: '#ffffff',
                padding: 0,
                textStyle: {
                    color: '#333',
                    fontSize: '10',
                },
                formatter: function (value) {
                    var dom = ``;
                    for (var i in value) {
                        dom += `<div style='padding-left:10px;padding-right:10px;padding-top:8px;'><span style='border-radius:9px;display:inline-block;width:8px;height:8px;background:` + value[i].color + `;'></span><span style="display:inline-block;padding-left:12px;">` + value[i].seriesName + `:<span style="display:inline-block;padding-left:1px;">` + value[i].value + `</span></div>`
                    }
                    return ` <div style="padding-bottom:8px;"> <div style='padding:5px;background:#f3f6f8;color:#333333;text-align:center;'>${value[0].name}</div>${dom}</div>`
                },
                extraCssText: 'box-shadow: 0 6px 8px 0 rgba(191,193,201,0.50);'
            },
            legend: {
                icon: 'circle',
                top: '15',
                itemHeight: '10',
                textStyle: {
                    color: 'rgb(76,86,102)',
                    fontWeight: 'blod'
                },
                data: lengendName,
            },
            grid: {
                left: '8%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                name: timeArr[0].split(' ')[0],
                nameLocation: 'middle',
                type: 'category',
                nameGap: '10',
                boundaryGap: false,
                data: timeArr,
                lineStyle: {
                    width: 0
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                    textStyle: {
                        fontSize: 12,
                        align: 'right'
                    },
                }
            },
            color: ['#6091ff', '#70d35f', '#45ABFF', '#7094EC', '#54CADD', '#71D360', '#426EC1'],
            yAxis: [{
                name: yName,
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 12,
                    },
                },
                splitLine: {
                    lineStyle: { color: 'rgb(227,230,232)', }
                }
            },],
            series: seriesArr
        };
        echarts.init($container).setOption(option, { notMerge: true });
    }
    onTimeChange(time) {
        this.timeConfig = time
        this.attachEvent()
    };
    attachEvent() {
        var _this = this;
        let endTime, startTime;
        startTime = new Date(this.timeConfig).format('yyyy-MM-dd 00:00:00');
        endTime = new Date(this.timeConfig).format('yyyy-MM-dd 23:59:59');
        endTime.split(' ')[0] == new Date().format('yyyy-MM-dd 23:59:59').split(' ')[0] ? endTime = new Date().format('yyyy-MM-dd HH:00:00') : 1;
        //对应点名
        var dsIdList = {
            "Primary chilled water pump": ['talou_PriCHWPGroup_RunNum'],
            "Fouling in condenser of chiller": ["qunlou_Ch03_CondSatuTemp", "qunlou_Ch03_CondLeaveT"],
            "Weather outdoor dry bulb temperature": ["web_outdoorWetTemp"],
            "Cooling tower status control fault": ["talou_ChGroup_RunNum", "talou_CTGroup_RunNum"],
            "Secondary chilled water pump": ["talou_SecCHWPGroup_RunNum"],
            "Cooling water pump status control fault": ["talou_ChGroup_RunNum", "talou_CWPGroup_RunNum"]
        }
        $('.curveBtn').removeClass('curveBtnHover')
        $('.curveBtn').off('click').on('click', function () {
            _this.lineName = $(this).attr('data-name')

            $(this).addClass('curveBtnHover')
            if (_this.lineName === "Primary chilled water pump" || _this.lineName === "Weather outdoor dry bulb temperature" || _this.lineName === "Secondary chilled water pump") {
                _this.renderTwoLine(dsIdList[_this.lineName]);
                return
            }
            var postData = {
                projectId: AppConfig.projectId,
                pointList: dsIdList[_this.lineName],
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1',
                prop: {}
            }

            Spinner.spin($('.curvePanelCanvas')[0]);
            WebAPI.post("/get_history_data_padded", postData).done(dataSrc => {
                if (jQuery.isEmptyObject(dataSrc)) {
                    return;
                }

                _this.renderLineEcharts($('.curvePanelCanvas')[0], dataSrc)
            }).always(function () {
                Spinner.stop();
            });
        });
        $('#curvePanel , .modal-backdrop').off('click').on('click', function (e) {
            $('.curveBtn').removeClass('curveBtnHover')
        })

    }
    renderTwoLine(lineName) {
        var _this = this;
        var postData = {
            projectId: AppConfig.projectId,
            pointList: lineName,
            timeStart: new Date('2017-06-06').format('yyyy-MM-dd 00:00:00'),
            timeEnd: new Date('2017-06-07').format('yyyy-MM-dd 23:59:59'),
            timeFormat: 'h1',
            prop: {}
        }
        Spinner.spin($('.curvePanelCanvas')[0]);
        WebAPI.post("/get_history_data_padded", postData).done(dataSrc => {
            if (jQuery.isEmptyObject(dataSrc)) {
                return;
            }
            _this.renderTwoLinesEcharts($('.curvePanelCanvas')[0], dataSrc)
        }).always(function () {
            Spinner.stop();
        });
    }

    renderTwoLinesEcharts($container, dataSrc) {
        let seriesArr = [];
        var timeArr = [];
        var lengendName = [];
        var yName = '';
        var isNum;
        let historyArr = [], historyArrNew = [];
        let dataTempJun=[19.54,19.54,19.8,19.85,19.7,20.1,20.1,20.1,20.1,19.9,19.9,19.9,19.9,19.9,19.9,19.24,18.75,18.91,18.3,18.7,17.9,17.6,17.1,17.1],
            dataTempMay=[17.75,17.75,18.3,18.3,18.7,18.7,19,19,19,18.5,18.5,18.7,18.7,19.5,19.5,18.3,18.3,18.3,17.6,16.5,16.5,16.5,16,16]
        if (this.lineName == "Fouling in condenser of chiller" || this.lineName == "Weather outdoor dry bulb temperature") {
            yName = '℃';
        }
        yName === '℃' ? isNum = true : 1;
        var lineColorArr = [[{ offset: 0, color: '#c292f0' }, { offset: 1, color: '#6091ff' }], [{ offset: 0, color: '#ffd843' }, { offset: 1, color: '#70d35f' }], [{ offset: 0, color: '#86a9f6' }, { offset: 1, color: '#5edbed' }]];
        var areaColorArr = [[{ offset: 0, color: 'rgba(194,146,240,0.3)' }, { offset: 1, color: 'rgba(96,145,255,0.3)' }], [{ offset: 0, color: 'rgba(255,216,67,0.3)' }, { offset: 1, color: 'rgba(112,211,95,0.3)' }], [{ offset: 0, color: 'rgba(134,169,246,0.3)' }, { offset: 1, color: 'rgba(94,219,237,0.3)' }]]
        for (let k = 0, length = dataSrc[0].history.length; k < length / 2; k++) {
            let time = dataSrc[0].history[k].time.substring(10, 16)
            timeArr.push(time)
        }

        for (let i = 0, length = dataSrc.length; i < length; i++) {
            lengendName.push(dataSrc[i].name + ' 05-07');
            lengendName.push(dataSrc[i].name + ' 06-06');
            historyArr = [];
            //若是温度类的data 保留小数一位。

            if (isNum === true) {
                dataSrc[i].history.forEach(function (element) {
                    if (element.time.substring(5, 10) == '06-06') {
                        historyArr.push(Number(element.value).toFixed(1))
                    } else {
                        historyArrNew.push(Number(element.value).toFixed(1))
                    }

                });
            } else {
                dataSrc[i].history.forEach(function (element) {
                    if (element.time.substring(5, 10) == '06-06') {
                        historyArr.push(Number(element.value))
                    } else {
                        historyArrNew.push(Number(element.value))
                    }

                });
            }
            if(this.lineName === "Weather outdoor dry bulb temperature"){
                historyArr=dataTempJun
                historyArrNew=dataTempMay
            }
            seriesArr[0] = {
                name: dataSrc[i].name + ' 06-06',
                type: 'line',
                data: historyArr,
                smooth: true,
                symbol: 'circle',
                symbolSize: 3,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, lineColorArr[0], false),
                        shadowColor: 'rgba(0,0,0,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, areaColorArr[0], false)
                    }
                },
            };
            seriesArr[1] = {
                name: dataSrc[i].name + ' 05-07',
                type: 'line',
                data: historyArrNew,
                smooth: true,
                symbol: 'circle',
                symbolSize: 3,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, lineColorArr[1], false),
                        shadowColor: 'rgba(0,0,0,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, areaColorArr[1], false)
                    }
                },
            }

        }
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#b3b3b3',
                        width: '1',
                    },
                },
                backgroundColor: '#ffffff',
                padding: 0,
                textStyle: {
                    color: '#333',
                    fontSize: '10',
                },
                formatter: function (value) {
                    var dom = ``;
                    for (var i in value) {
                        dom += `<div style='padding-left:10px;padding-right:10px;padding-top:8px;'><span style='border-radius:9px;display:inline-block;width:8px;height:8px;background:` + value[i].color + `;'></span><span style="display:inline-block;padding-left:12px;">` + value[i].seriesName + `:<span style="display:inline-block;padding-left:1px;">` + value[i].value + `</span></div>`
                    }
                    return ` <div style="padding-bottom:8px;"> <div style='padding:5px;background:#f3f6f8;color:#333333;text-align:center;'>${value[0].name}</div>${dom}</div>`
                },
                extraCssText: 'box-shadow: 0 6px 8px 0 rgba(191,193,201,0.50);'
            },
            legend: {
                icon: 'circle',
                top: '15',
                itemHeight: '10',
                textStyle: {
                    color: 'rgb(76,86,102)',
                    fontWeight: 'blod'
                },
                data: lengendName,
            },
            grid: {
                left: '8%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                name: '',
                nameLocation: 'middle',
                type: 'category',
                nameGap: '10',
                boundaryGap: false,
                data: timeArr,
                lineStyle: {
                    width: 0
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 12,
                        align: 'right'
                    },
                }
            },
            color: ['#6091ff', '#70d35f', '#45ABFF', '#7094EC', '#54CADD', '#71D360', '#426EC1'],
            yAxis: [{
                name: yName,
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                min: yName === "℃" ? 15 : null,
                max: yName === "℃" ? 25 : null,
                axisLabel: {
                    textStyle: {
                        fontSize: 12,
                    },
                },
                splitLine: {
                    lineStyle: { color: 'rgb(227,230,232)', }
                }
            },],
            series: seriesArr
        };
        echarts.init($container).setOption(option, { notMerge: true });
    }
    destory() {
        this.opt = null;
        this.timeConfig = null;
        this.nodesInfo = null;
        this.container = null;
    }
}
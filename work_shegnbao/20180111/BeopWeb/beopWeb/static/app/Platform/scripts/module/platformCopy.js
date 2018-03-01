/**
 * Created by vivian on 2017/7/13.
 */
class PlatformCopy {
    constructor() {
        this.opt = AppDriver;
    }
    show() {
        this.init();
    }
    init() {
        var _this = this;
        WebAPI.get('/static/app/Platform/views/module/platformOverview.html').done(function (result) {
            _this.ctn = document.getElementById('indexMain');
            _this.ctn.innerHTML = result;
            _this.attachEvent();
            _this.renderAlgorithmChart();
            _this.renderUserChart();
            _this.renderPvWebChart();
        }).always(function () {
            I18n.fillArea($('#containerDisplayboard'));
        });
    }
    initQueryTime() {
        var $iptSelectTime = $('.iptSelectTime');
        $iptSelectTime.val(new Date().format('yyyy-MM-dd'));
        $('#spanSelectTime').datetimepicker({
            Format: 'yyyy-mm-dd',
            autoclose: true,
            startView: 2,
            minView: 2,
            todayHighlight: true
        });
        $('#spanSelectTime').datetimepicker().on('changeDay', function (ev) {
            $iptSelectTime.val(new Date(ev.date).format('yyyy-MM-dd'));
        });
    }
    attachEvent() {

    }


    resizeEchart(options, dom) {
        var echartDom = echarts.init(dom);
        echartDom.setOption(options);
        $(window).resize(function () {
            $(echartDom).resize();
        });
    }

    getUnit(num) {
        if (num == null || num === "") return '-';
        if (num == 0) return 0;
        if (num >= 1000) {
            return parseFloat(num / 1000).toFixed(0) + ' MWh';
        } else {
            return parseFloat(num).toFixed(0) + ' kWh';
        }
    }
    //获取千分位
    getThousandsBit(num) {
        if (num == null || num === "") return '-';
        if (num == 0) return 0;
        num = num.toFixed(0);　　
        var re = /\d{1,3}(?=(\d{3})+$)/g;　　
        var n1 = num.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
            return s1.replace(re, "$&,") + s2;
        });　　
        return n1 + ' kWh';
    }

    choiceTimeFormat() {
        var timeDifference = new Date(this.timeConfig.endTime).getTime() - new Date(this.timeConfig.startTime).getTime();
        return timeDifference > 24 * 60 * 60 * 1000 ? 'd1' : 'h1';
    }
    renderPvWebChart() {
        var option = this.setEchartOption({
            lineColor: [{
                offset: 0,
                color: 'rgba(255,216,67,0.3)'
            }, {
                offset: 1,
                color: 'rgba(112,211,95,0.3)'
            }],
            xdata: ['Mon', 'Tue', 'Wed', 'Tur', 'Fri'],
            sdata: [26, 20, 25, 44, 32]
        });
        option.backgroundColor = '#ebeef7';
        /*        option.yAxis[1] = {
                    type: 'value',
                    name: '降水量',
                    min: 0,
                    max: 250,
                    position: 'right',
                    offset: 80,
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} ml'
                    }
                }*/
        this.resizeEchart(option, document.getElementById('pv-web-chart'));
    }
    renderUserChart() {
        var option = this.setEchartOption({
            lineColor: [{
                offset: 0,
                color: 'rgba(255,216,67,0.3)'
            }, {
                offset: 1,
                color: 'rgba(112,211,95,0.3)'
            }],
            xdata: ['Mon', 'Tue', 'Wed', 'Tur', 'Fri'],
            sdata: [26, 20, 25, 44, 32]
        });
        option.yAxis = [{
            type: 'value',
            name: "",
            show: false,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
        }]
        option.series = [{
            type: 'bar',
            barMaxWidth: 60,
            data: [5, 20, 36, 10, 20],
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#93cef4'
                    }, {
                        offset: 1,
                        color: '#5d94ed'
                    }]),
                    barBorderRadius: [10, 10, 0, 0],
                }
            }

        }]
        this.resizeEchart(option, document.getElementById('user-chart'));
    }
    renderAlgorithmChart() {
        var option = this.setEchartOption({
            lineColor: [{
                offset: 0,
                color: 'rgba(255,216,67,0.3)'
            }, {
                offset: 1,
                color: 'rgba(112,211,95,0.3)'
            }],
            xdata: ['Mon', 'Tue', 'Wed', 'Tur', 'Fri'],
            sdata: [26, 20, 25, 44, 32]
        });
        option.backgroundColor = 'rgba(235,238,247,0.15)';
        this.resizeEchart(option, document.getElementById('algorithmChart'));
    }
    setEchartOption(options) {
        var choices = options || {};
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, choices.lineColor, false)
                    }
                }
            },
            legend: {
                show: false,
                icon: 'circle',
                top: '15',
                itemHeight: '10',
                /* data: [options.legend],*/
                textStyle: {
                    fontSize: 14,
                    color: '#333'
                }
            },
            grid: {
                top: '30px',
                left: '10px',
                right: '10px',
                bottom: '10px',
                containLabel: true
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
                        align: 'center'
                    }
                },

                data: choices.xdata
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
                    formatter: function (value) {
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
                name: options.legend,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 3,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, choices.lineColor, false),
                        shadowColor: 'rgba(0,0,0,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, choices.lineColor, false)
                    }
                },
                itemStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, choices.lineColor, false)
                    }
                },
                data: choices.sdata.map(function (ele) {
                    return ele ? ele.toFixed(0) : 0;
                })
            }]
        };
        return option;
    }
    close() {

    }
}
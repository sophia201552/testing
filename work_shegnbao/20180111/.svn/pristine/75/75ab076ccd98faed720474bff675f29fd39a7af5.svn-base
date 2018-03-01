/**
 * Created by vivian on 2017/7/13.
 */
class PlatformOverview {
    constructor(opt) {
        this.opt = opt;
    }
    show() {
        this.init();
    }
    init() {
        var _this = this;
        WebAPI.get('/static/app/Platform/views/module/platformOverview.html').done(function (result) {
            _this.ctn = document.getElementById('moduleCtn');
            _this.ctn.innerHTML = result;
            _this.attachEvent();
            _this.renderAlgorithmChart();
            _this.renderUserChart();
            _this.renderPvWebChart();
            _this.renderConnectionChart();
            _this.renderPrehandlingChart();
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
        $('#myModal').on('shown.bs.modal', function () {
            let data = [{
                id: 1,
                projectName: 'demo1',
                status: 'online',
                data_flux: '850k / 1min',
                point: '46',
                storage: '10G',
                fault: '34'
            }, {
                id: 2,
                projectName: 'demo2',
                status: 'online',
                data_flux: '880k / 1min',
                point: '25',
                storage: '10G',
                fault: '31'
            }, {
                id: 3,
                projectName: 'demo3',
                status: 'offline',
                data_flux: '860k / 1min',
                point: '50',
                storage: '10G',
                fault: '26'
            }, {
                id: 4,
                projectName: 'demo4',
                status: 'offline',
                data_flux: '810k / 1min',
                point: '43',
                storage: '10G',
                fault: '35'
            }];
            $('#myModal .modal-body').html(`<div class="projInfoNav">
                            <span style="width: 6%;">ID</span>
                            <span style="width: 24%;">Project</span>
                            <span style="width: 12%;">Status</span>
                            <span style="width: 16%;">Data Flux</span>
                            <span style="width: 12%;">Point</span>
                            <span style="width: 12%;">Storage</span>
                            <span style="width: 12%;">Fault</span>
                        </div><div class="projInfoCtn"></div>`);
            let trDom = '';
            for (let i = 0, length = data.length; i < length; i++) {
                let item = data[i];
                trDom += `<div class="projInfoTr">
                            <span style="width: 6%;">${item.id}</span>
                            <span style="width: 24%;">${item.projectName}</span>
                            <span style="width: 12%;">${item.status}</span>
                            <span style="width: 16%;">${item.data_flux}</span>
                            <span style="width: 12%;">${item.point}</span>
                            <span style="width: 12%;">${item.storage}</span>
                            <span style="width: 12%;">${item.fault}</span>
                        </div>`;
            }
            $('#myModal .modal-body .projInfoCtn').html(trDom);
        });

        $('#visual-tran,#algorithm-tran').off('click').on('click',function(e){
            var projectId = e.currentTarget.dataset.tran;
            localStorage.setItem('indexToFactoryId',projectId);
        })
    }
    renderConnectionChart() {
        let dom = `<div class="firstLine">
                        <span class="realVal" data-toggle="modal" data-target="#myModal">2</span>
                        <span>/30</span>
                    </div>
                    <div class="secondLine">
                        <span>Offline</span>
                    </div>`;
        $('.connect-center').html(dom);
        var option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255,255,255,1)',
                textStyle: {
                    color: '#566ea3'
                },
                formatter: function (params, ticket, callback, a, v, d) {
                    console.log(1);
                    let color, dom, percent;
                    percent = Number(params.value) * 100 + '%';
                    if (typeof (params.color) === "object") {
                        color = params.color.colorStops[0].color;
                    } else {
                        color = params.color;
                    }
                    dom = `<span>${params.seriesName}</span></br>
                            <div style="background:${color};width: 8px;height: 8px;border-radius:50%;display: inline-block;margin-right: 5px;"></div><span>${params.name}: ${percent}</span>`;
                    return dom;
                }
            },
            series: [{
                    name: '',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '45%'],
                    selectedMode: 'single',
                    data: [{
                        value: 1
                    }],
                    itemStyle: {
                        normal: {
                            color: function (obj) {
                                return {
                                    type: 'radial',
                                    x: 0.5,
                                    y: 0.5,
                                    r: 0.5,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'rgba(255,255,255,0.1)' // 0% 处的颜色
                                    }, {
                                        offset: 0.8,
                                        color: 'rgba(88, 186, 231, 0.2)'
                                    }, {
                                        offset: 0.95,
                                        color: 'rgba(88, 186, 231, 0.45)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(88, 186, 231, 0.55)'
                                    }]
                                }

                            },
                        }
                    },
                    silent: true,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    }
                },
                {
                    name: 'Connection',
                    type: 'pie',
                    clockWise: false,
                    radius: ['64%', '68%'],
                    center: ['50%', '45%'],
                    hoverAnimation: false,
                    data: [{

                        value: 0.25,
                        name: 'Offline',
                        itemStyle: {
                            normal: {
                                color: '#e8efff'
                            }
                        }
                    }, {

                        value: 0.067,
                        name: 'Online',
                        itemStyle: {
                            normal: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: '#7abcee' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#8ea3d2' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                                shadowBlur: 10,
                                shadowColor: 'rgba(222, 179, 151, 0.6)'
                            }
                        }
                    }],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    }
                }
            ]
        };
        option.backgroundColor = 'rgba(235,238,247,0.15)';
        this.resizeEchart(option, document.getElementById('connect-chart'));
    }
    renderPrehandlingChart() {
        let dom = `<span class="min">1 min</span>
                    <div class="firstLine">
                        <span class="realVal">850k</span>
                        <span>/900k</span>
                    </div>
                    <div class="secondLine">
                        <span class="iconfont icon-xiajiang"></span>
                        <span>Data Flux</span>
                    </div>`;
        $('.cloud-center').html(dom);
        var option = {
            // tooltip: {
            //     trigger: 'item',
            //     backgroundColor: 'rgba(255,255,255,1)',
            //     textStyle: {
            //         color: '#566ea3'
            //     },
            //     formatter: function (params, ticket, callback,a,v,d) {
            //         console.log(1);
            //         let color, dom, percent;
            //         percent = Number(params.value) * 100 + '%';
            //         if (typeof(params.color) === "object"){
            //             color = params.color.colorStops[0].color;
            //         } else {
            //             color = params.color;
            //         }
            //         dom = `<span>${params.seriesName}</span></br>
            //                 <div style="background:${color};width: 8px;height: 8px;border-radius:50%;display: inline-block;margin-right: 5px;"></div><span>${params.name}: ${percent}</span>`;
            //         return dom;
            //     }  
            // },
            series: [{
                    name: '',
                    type: 'pie',
                    radius: '60%',

                    center: ['50%', '45%'],
                    selectedMode: 'single',
                    data: [{
                        value: 1
                    }],
                    itemStyle: {
                        normal: {
                            color: function (obj) {
                                return {
                                    type: 'radial',
                                    x: 0.5,
                                    y: 0.5,
                                    r: 0.5,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'rgba(255,255,255,0.1)' // 0% 处的颜色
                                    }, {
                                        offset: 0.8,
                                        color: 'rgba(246, 180, 136, 0.2)'
                                    }, {
                                        offset: 0.95,
                                        color: 'rgba(246, 180, 136, 0.45)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(246, 180, 136, 0.55)'
                                    }]
                                }

                            },
                        }
                    },
                    silent: true,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    }
                },
                {
                    name: 'Connection',
                    type: 'pie',
                    clockWise: false,
                    radius: ['64%', '68%'],
                    center: ['50%', '45%'],
                    hoverAnimation: false,
                    data: [{
                        value: 0.1,
                        name: 'Offline',
                        itemStyle: {
                            normal: {
                                color: '#fff1e8'
                            }
                        }
                    }, {

                        value: 0.94,
                        name: 'Online',
                        itemStyle: {
                            normal: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: '#f19f72' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#f16c5a' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                                shadowBlur: 10,
                                shadowColor: 'rgba(222, 179, 151, 0.6)'
                            }
                        }
                    }],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    }
                }
            ]
        };
        option.backgroundColor = 'rgba(235,238,247,0.15)';
        this.resizeEchart(option, document.getElementById('preHandling-chart'));
    }
    renderPvWebChart() {
        var option = this.setEchartOption({
            legend: ['Web'],
            lineColor: [{
                offset: 0,
                color: '#86f1fc'
            }, {
                offset: 1,
                color: '#85befc'
            }],
            areaColor: [{
                offset: 0,
                color: 'rgba(134,241,252,0.3)'
            }, {
                offset: 1,
                color: 'rgba(133,190,252,0.3)'
            }],
            xdata: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
            sdata: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
        });
        option.backgroundColor = 'rgba(235,238,247,0.15)';
        option.legend.show = true;
        option.legend.data = ['Web','APP'];
        option.grid.top = '45px';
        option.tooltip.formatter = function (params) {
            var str = '',
                total = 0;
            params.forEach(function (ele) {
                str += ele.seriesName + ' : ' + ele.value + '<br/>';
                total += parseFloat(ele.value);
            });
            str += 'PV' + ' : ' + total.toFixed(0);
            return str;
        };
        option.series[1] = {
            type: 'line',
            name: 'APP',
            symbol: 'circle',
            smooth: true,
            showSymbol: false,
            stack: '总量',
            lineStyle: {
                normal: {
                    width: 3,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#e670fa'
                    }, {
                        offset: 1,
                        color: '#b6ccff'
                    }]),
                    shadowColor: 'rgba(156,80,70,0.4)',
                    shadowBlur: 10,
                    shadowOffsetY: 0
                }
            },
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#b6ccff'
                    }, {
                        offset: 1,
                        color: '#e670fa'
                    }]),
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: 'rgba(182,204,255,0.3)'
                    }, {
                        offset: 1,
                        color: 'rgba(230,112,250,0.3)'
                    }]),
                }
            },
            data: [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
        }
        this.resizeEchart(option, document.getElementById('pv-web-chart'));
    }
    /*    渲染Connection中柱图和Visualization的图*/
    renderUserChart() {
        var option = this.setBarOption({
            areaColor: [{
                offset: 0,
                color: '#93cef4'
            }, {
                offset: 1,
                color: '#5d94ed'
            }],
            xdata: ['CBRE', 'ZTE', 'BENZ', 'RCS', 'BOMA'],
            sdata: [36, 28, 23, 18, 12]
        });
        this.resizeEchart(option, document.getElementById('user-chart'));
        var buildOption = this.setBarOption({
            areaColor: [{
                offset: 0,
                color: '#93cef4'
            }, {
                offset: 1,
                color: '#5d94ed'
            }],
            xdata: ['Office', 'Factory', 'Hotel', 'Market'],
            sdata: [12, 10, 5, 3]
        });
        buildOption.grid.top = '40px';
        buildOption.xAxis[0].axisLabel.inside = false;
        buildOption.xAxis[0].axisLabel.textStyle.color = '#949ab3';
        buildOption.series[0].label.normal.textStyle.color = '#566ea3';
        this.resizeEchart(buildOption, document.getElementById('building-chart'));

    }


    /*渲染算法图表*/
    renderAlgorithmChart() {
        var option = this.setEchartOption({
            legend: 'fault',
            lineColor: [{
                offset: 0,
                color: '#fa6653'
            }, {
                offset: 1,
                color: '#ffc675'
            }],
            areaColor: [{
                offset: 0,
                color: 'rgba(255,198,117,0.3)'
            }, {
                offset: 1,
                color: 'rgba(250,102,83,0.3)'
            }],
            xdata: ['07-10', '07-11', '07-12', '07-13', '07-14', '07-15', '07-16', '07-17'],
            sdata: [26, 20, 25, 44, 32, 53, 35]
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
                data: [options.legend],
                textStyle: {
                    fontSize: 14,
                    color: '#333'
                }
            },
            grid: {
                top: '10px',
                left: '10px',
                right: '15px',
                bottom: '0px',
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
                        align: 'right'
                    }
                },

                data: choices.xdata
            }],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false,
                    alignWithLabel: false
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
                        color: '#949ab3',
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
                stack: '总量',
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, choices.lineColor, false),
                        shadowColor: 'rgba(156,80,70,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 0
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, choices.areaColor, false)
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
    setBarOption(options) {
        var choices = options || {};
        var option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                show: false,
                icon: 'circle',
                top: '15',
                itemHeight: '10',
                /*data: [options.legend],*/
                textStyle: {
                    fontSize: 14,
                    color: '#949ab3'
                }
            },
            grid: {
                top: '10px',
                left: '-30px',
                right: '10px',
                bottom: '10px',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: true,
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
                    inside: true,
                    margin: 3,
                    textStyle: {
                        color: '#fff'
                    },
                },
                z: 10,
                data: choices.xdata
            }],
            yAxis: [{
                type: 'value',
                name: "Users",
                show: false,
                symbol: 'circle',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
            }],

            series: [{
                type: 'bar',
                barWidth: '80%',
                barCategoryGap: '10px',
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, choices.lineColor, false),
                        shadowColor: 'rgba(156,80,70,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 0
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, choices.areaColor, false)
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#949ab3',
                            fontSize: 8,
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, choices.areaColor, false),
                        barBorderRadius: [4, 4, 0, 0],
                    }
                },
                data: choices.sdata.map(function (ele) {
                    return ele ? ele.toFixed(0) : 0;
                })
            }]
        };
        return option;
    }
    resizeEchart(options, dom) {
        var echartDom = echarts.init(dom);
        echartDom.setOption(options);
        $(window).resize(function () {
            $(echartDom).resize();
        });
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
    close() {

    }
}
(function (exports, Base) {
    const DEFAULT_OPTIONS = {
    }

    class ProportionPieWithBar extends Base {
        constructor(container, options = DEFAULT_OPTIONS) {
            if (options !== DEFAULT_OPTIONS) {
                options = Object.assign({}, DEFAULT_OPTIONS, options);
            }
            super(container, options);
        }
        show() {
            let $thisContainer = $(this.container);
            var dom=`<div class="pieWidthBarBox BlackBox clickShadow">
                <div class="summaryTitle">
                        <span>${I18n.resource.overview.ISSUES_CLASSIFICATION}</span>
                        <span class="glyphicon glyphicon-question-sign helpInfo" aria-hidden="true"></span>
                    </div>
                    <div class="pieWidthBarContent">
                        <div class="pieWidthBarByPie">
                        <div class="pieWidthBarEchart"></div>
                        <div class="pieWidthBarMain">
                        <div style="position: relative;top: 50%;transform: translateY(-50%);">
                            <div class="pieWidthBarRow">
                                <div class="pieWidthBarDot"> <span class="pieWidthBarDotBox" style="background:#51f1c6"></span></div>
                                <div class="pieWidthBarName" title="BMS">BMS</div>
                                <div class="pieWidthBarData" title="18%">18%</div>
                            </div>
                            <div class="pieWidthBarRow">
                                <div class="pieWidthBarDot"> <span class="pieWidthBarDotBox" style="background:#5c68ed"></span></div>
                                <div class="pieWidthBarName" title="Precise Air">Precise Air</div>
                                <div class="pieWidthBarData" title="30%">20%</div>
                            </div>
                            <div class="pieWidthBarRow">
                                <div class="pieWidthBarDot"> <span class="pieWidthBarDotBox" style="background:#57c9ff"></span></div>
                                <div class="pieWidthBarName" title="Mech. Contractor">Mech. Contractor</div>
                                <div class="pieWidthBarData" title="30%">30%</div>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div class="pieWidthBarByBar"></div>
                    </div>
                </div>`
            $thisContainer.html(dom)
            var $pieWidthBarByPie = $thisContainer.find('.pieWidthBarEchart')[0];
            var $pieWidthBarByBar = $thisContainer.find('.pieWidthBarByBar')[0];
            this.renderEcharts($pieWidthBarByPie);
            this.renderEchartsBar($pieWidthBarByBar);
            this.attachEvents();
        }
        renderEcharts($echartsCtn) {
            let option = {
                tooltip: {
                    formatter: "{b}: {c} ({d}%)"
                },

                color: ['#57c9ff', '#51f1c6',  '#5c68ed','#00a7ce'],
                // legend: {
                //     orient: 'vertical',
                //     left: "40%",
                //     y: 'center',
                //     textStyle: {
                //         color: '#69779f',
                //     },
                //     formatter: function (name) {
                //         console.log(key[name]);
                //         return name + " " +key[name];
                //     },
                //     itemHeight: 6,
                //     itemWidth: 6,
                //     align: 'left',
                //     data: ['BMS', 'Precise Air', 'Mech. Contractor',],
                //     shadowColor: 'rgba(0, 0, 0, 0.5)',
                //     shadowBlur: 10

                // },

                series: [
                    {
                        type: 'pie',
                        radius: ['62%', '70%'],
                        avoidLabelOverlap: false,
                        center: ['50%', '50%'],
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                borderColor: '#28292e',
                                borderWidth: '2',
                                shadowColor: 'rgba(92, 104, 237, 0.1)',
                                shadowBlur: 1
                            },
                            emphasis: {
                                borderColor: '#28292e',
                                borderWidth: '2'
                            }
                        },
                        label: {
                            normal: {
                                show: false,
                            },
                            emphasis: {
                                show: false,
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            { value: 335, name: 'BMS' },
                            { value: 234, name: 'Precise Air' },
                            { value: 135, name: 'Mech. Contractor' },

                        ]
                    }
                ]
            };
            echarts.init($echartsCtn).setOption(option);
        }
        renderEchartsBar($echartsCtn) {
            var dataAxis = ['Abby', 'Crole', 'Woody', 'Cloe', 'Kaity','Rose'];
            var data = [48, 46, 45, 35, 30,20];
            var yMax = 50;
            var dataShadow = [];

            for (var i = 0; i < data.length; i++) {
                dataShadow.push(yMax);
            }

            var option = {

                xAxis: {
                    data: dataAxis,
                    axisLabel: {
                        inside: true,
                        textStyle: {
                            color: '#fff'
                        },
                        rotate: 90,
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            width: 0
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle:{width:2}

                    },
                    z: 10
                },
                grid: {
                    show: false,
                    width: '90% ',
                    height: '80%',
                    top: 9,
                    containLabel: false,
                },
                yAxis: {
                    offset: 25,
                    min:10,
                    max:50,
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },

                    axisLabel: {
                        textStyle: {
                            color: '#69779f'
                        },
                        inside: true,
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            width: 0
                        }
                    },
                },
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    { // For shadow
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#2e314b',
                                shadowColor: 'rgb(164, 173, 201)',
                                opacity: '0.6'
                            }
                        },
                        barGap: '-100%',
                        barCategoryGap: '40%',
                        data: dataShadow,
                        animation: false,

                    },
                    {
                        type: 'bar',
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#28292e'
                                }
                            }

                        },
                        itemStyle: {
                            normal: {
                                color: '#00a7ce'
                            },
                            emphasis: {
                                color: '#83bff6'
                            }
                        },
                        data: data,

                    }
                ]
            };
            echarts.init($echartsCtn).setOption(option);
        }
        attachEvents(){
            var _this = this;
            $(this.container).off("click",".pieWidthBarBox .helpInfo").on("click",".pieWidthBarBox .helpInfo",function(){
                _this.__proto__.setHelpTppltip([
                    {
                        id:"pieWidthBarByPie",
                        position:{
                            left: "100%",
                            top:I18n.type === "zh"?-32:-32
                        },
                        location:"right",
                        msg:`<p style="width: 244px;">${I18n.resource.overview.Issues_Classification_BAR_HELP_INFO}</p>
                        <img style="width: 100%;" src = "../static/app/Diagnosis/themes/default/images/questionClassificationAnnualarChart.png">`,
                        container: $(_this.container).find(".pieWidthBarByPie")
                    },
                    {
                        id:"pieWidthBarByBar",
                        position:{
                            left: -280,
                            top:-50
                        },
                        location:"left",
                        msg:`<p style="">${I18n.resource.overview.Issues_Classification_LINE_HELP_INFO}</p>
                        <img style="width: 100%;" src = "../static/app/Diagnosis/themes/default/images/questionClassificationBarChart.png">`,
                        container: $(_this.container).find(".pieWidthBarByBar")
                    }
                ]);
            })
        }
        update(condition) {

        }
        close() {
            this.__proto__.destroyHelpTooltip(this.container);
        }
    }

    exports.ProportionPieWithBar = ProportionPieWithBar;
}(
    namespace('diagnosis.components'),
    namespace('diagnosis.components.Base')
    ));

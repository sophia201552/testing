(function (exports, Base, diagnosisEnum) {
    const DEFAULT_OPTIONS = {
    }

    class ProportionPieWithLine extends Base {
        constructor(container, options = DEFAULT_OPTIONS, overview) {
            if (options !== DEFAULT_OPTIONS) {
                options = $.extend({}, DEFAULT_OPTIONS, options);
            }
            super(container, options);
            this.overview = overview;
            this.pieData = null;
            this.color = ['#48acf5', '#4e81ed', '#fcd341', '#73d366'];
        }
        show() {
            let $thisContainer = $(this.container);
            var dom = ` <div class="pieWithLineContainBox clickShadow goto">
                    <div class="pieWithLineContainTitle">
                        <span>${I18n.resource.overview.ENERGY_SAVING_POTENTIAL}</span>
                        <span class="glyphicon glyphicon-question-sign helpInfo" aria-hidden="true"></span>
                    </div>
                    <div class="pieWithLineContent">
                        <div class="pieContent">
                            <div class="pieCanvas"></div>
                            <div class="legendCtn"></div>
                        </div>
                        <div class="piePanel"></div>
                        <div class="lineContent"></div>
                    </div>
                    <div class="gotoBtn" data-info="Energy waste">
                        <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
                    </div>
                </div>`
            $thisContainer.html(dom)
            this.$lineContent = $thisContainer.find('.lineContent')[0];
            this.$pieCanvas = $thisContainer.find('.pieCanvas')[0];
            this.$legendCtn = $thisContainer.find('.legendCtn');
            this.$piePanel = $thisContainer.find('.piePanel')[0];
            this.getElecPrice();
            this.attachEvents();
        }
        getElecPrice() {
            var _this = this;
            var promise = $.Deferred();
            promise = WebAPI.post('/iot/search', { "parent": [], "projId": [AppConfig.projectId] }).done(function (result) { //AppConfig.projectId
                _this._id = result.projects[0]._id;
            });
            promise.then(function () {
                WebAPI.get('/benchmark/config/get/' + _this._id).done(function (result) {
                    // 计算平均电价
                    _this.powerPrice = 0;
                    if (!result || !result.cost || result.cost.length === 0) {
                        alert('Please config electricity price first!');
                        return;
                    }
                    for (var i = 0, l = result.cost.length, cost, weight; i < l; i++) {
                        cost = Number(result.cost[i].cost);
                        weight = result.cost[i].weight ? Number(result.cost[i].weight) : 1;
                        if (!isNaN(cost) && !isNaN(weight)) {
                            _this.powerPrice += (cost * weight);
                        }
                    }
                    _this.powerPrice = Number((_this.powerPrice / result.cost.length).toFixed(2));
                    _this.getFault();
                });
            });
        }
        getFault() {
            var _this = this;
            let getData = {
                "projectId": AppConfig.projectId,
                "startTime": this.options.time().startTime, 
                "endTime": this.options.time().endTime,
                "lang": I18n.type
            }
            var entityIds = this.options.activeEntities().map(function(row){return row.id}).join(",") || null;
            entityIds && (getData.entityIds = entityIds)
            var classNames = this.options.activeCategories().map(function(row){return row.className}).join(",") || null;
            classNames && (getData.classNames = classNames)
            var faultIds = this.options.activeFaults().map(function(row){return row.faultId}).join(",") || null;
            faultIds && (getData.faultIds = faultIds)
            $.get('/diagnosis_v2/getEnergySavingPotentialInfo', getData).done(function (rs) {
                // var num = {
                //     'resolved': rs.data.processed,
                //     'total': rs.data.total
                // }
                let obj = {};
                Object.keys(diagnosisEnum.faultTypeName).forEach(function(row){
                    obj[row] = [];
                })
                rs.data.faults.forEach(function(row){
                    let curFaultType = row.faultType;
                    if(curFaultType >= 0 && curFaultType <= diagnosisEnum.faultTypeValue['FIRST_FAULT']){
                        obj[diagnosisEnum.faultType['FIRST_FAULT']].push(row);
                    }else if(curFaultType > diagnosisEnum.faultTypeValue['FIRST_FAULT'] && curFaultType <= diagnosisEnum.faultTypeValue['SECOND_FAULT']){
                        obj[diagnosisEnum.faultType['SECOND_FAULT']].push(row);
                    }else if(curFaultType > diagnosisEnum.faultTypeValue['SECOND_FAULT'] && curFaultType <= diagnosisEnum.faultTypeValue['THIRD_FAULT']){
                        obj[diagnosisEnum.faultType['THIRD_FAULT']].push(row);
                    }else {
                        obj[diagnosisEnum.faultType['SENSOR_FAULT']].push(row);
                    }
                })
                Object.keys(obj).forEach(function(row){
                    if(obj[row].length === 0){
                        delete obj[row];
                    }
                })
                _this.pieData = obj;
                //渲染legendName
                var colorArr = ['#48acf5', '#4e81ed', '#fcd341', '#73d366'];
                Object.keys(obj).forEach(function (row, index) {
                    let singleDom = `<div>
                                        <div class="legendColorBox" style="background: ${colorArr[index]}"></div>
                                        <span>${diagnosisEnum.faultTypeName[row]}</span>
                                    </div>`;
                    _this.$legendCtn.append(singleDom);
                })

                _this.renderEchartsPie(obj, _this.color);
                var energyAll = 0;
                for (var key in rs.data.energyList) {
                    energyAll += rs.data.energyList[key].energy
                }
                var cost = Number(energyAll) * Number(_this.powerPrice);
                var unit=AppConfig.project?Unit.prototype.getCurrencyUnit(AppConfig.project.unit_currency):AppConfig.projectCurrent?Unit.prototype.getCurrencyUnit(AppConfig.projectCurrent.unit_currency): Unit.prototype.getCurrencyUnit()
                
                var dom = `<div  style="margin:0 auto;" title="From ${_this.options.time().startTime} to ${_this.options.time().endTime},if faults being solved,which can save the energy of ${energyAll.toFixed(2)}kWh,and the cost of $${cost.toFixed(2)}.">
                                <div class="piePanelRow"> <span class="piePanelDot" style="margin-top: -1px;"></span><span class="piePanelName">Energy Saving</span> <span class="piePanelNum" style="color:#2CB6F3">${energyAll.toFixed(2)}</span><span class="piePanelUnit" style="color:#2CB6F3">kWh</span></div>
                                <div class="piePanelRow"> <span class="piePanelDot" style=" background-color:#4B7BEA;margin-top: -1px;"></span><span class="piePanelName">Cost Saving</span><span class="piePanelUnit" style="padding-left:5px;color:#4B7BEA;">${unit}</span><span class="piePanelNum" style="color:#4B7BEA">${cost.toFixed(2)}</span></div>
                                </div>`
                $(_this.$piePanel).html(dom)
                _this.renderEcharts(_this.$lineContent, rs.data)
            })
        }
        renderEcharts($echartsCtn, data) {
            var energyData = [], costData = [], energyX = [];
            var nowDay = moment(this.options.time().startTime);
            // 格式化时间
            var endTimeNow = moment(this.options.time().endTime)
            //循环直到时间达到选定时间+1day
            while (nowDay < endTimeNow) {
                let nowDayFormattedStr = nowDay.format('YYYY-MM-DD');
                let dataNew = 0;
                let cost = 0;
                for (let key in data.energyList) {
                    if (data.energyList[key].time == nowDayFormattedStr) {
                        dataNew = data.energyList[key].energy;
                        cost = this.powerPrice * data.energyList[key].energy;
                    }
                }
                let energy, costList;
                dataNew == null ? energy = '-' : energy = dataNew.toFixed(2);
                dataNew == null ? costList = '-' : costList = cost.toFixed(2);
                energyData.push(energy);
                energyX.push(nowDay.format('MM-DD'));
                costData.push(costList);
                nowDay.add(1, 'days');
            }
            let lastTime = energyX[energyX.length - 1],
                firstTime = energyX[0];
            energyX[0] = Array(firstTime.length + 5).join(' ') + firstTime;
            energyX[energyX.length - 1] = lastTime + Array(lastTime.length + 5).join(' ');
            var unit=AppConfig.project?Unit.prototype.getCurrencyUnit(AppConfig.project.unit_currency):AppConfig.projectCurrent?Unit.prototype.getCurrencyUnit(AppConfig.projectCurrent.unit_currency): Unit.prototype.getCurrencyUnit()
            
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#b3b3b3',
                            width: "1",
                        },
                    },
                    backgroundColor: '#ffffff',
                    padding: 0,
                    textStyle: {
                        color: '#333',
                        fontSize: '10',
                    },
                    formatter: function (obj) {
                        return " <div style='box-shadow: 0px 2px 12px 0 #929cb9;'><div style='background:#f3f6f8;padding:5px; color:#333333;text-align:center;'>" + obj[0].name + "</div> \
                    <div style='padding-left:10px;padding-right:10px;padding-top:8px;'><span style='display:inline-block;width:6px;height:6px;background:"+ obj[0].color + "'></span>   " + obj[0].value + " kWh <br/></div>\
                    <div style='padding-left:10px;padding-right:10px;padding-bottom:8px;'><span style='display:inline-block;width:6px;height:6px;background:"+ obj[1].color + "'></span> " + obj[1].value + unit + "  </div></div>"
                    }
                },
                color: ['#2CB6F3', '#4B7BEA'],
                // axisPointer: {
                //     link: { xAxisIndex: 'all' }
                // },
                grid: {
                    left: '30',
                    right: '30',
                    bottom: '25',
                    // containLabel: true,
                    width: 'auto',
                    height: 'auto',
                    top:30
                },
                xAxis:
                {
                    type: 'category',
                    // z: 1111,
                    boundaryGap: false,
                    // offset: 5,
                    data: energyX,
                    // lineStyle: {
                    //     width: 0
                    // },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    }, 
                    axisLabel: {
                        textStyle: {
                            color: '#666',
                            // baseline: 'bottom',
                            fontSize: 10,
                        },
                        // inside: true,
                    }
                }
                ,
                yAxis:[{
                    type: 'value',
                    // z: 1111,
                    name: 'kWh',
                    nameTextStyle: {
                        color: '#999'
                    },
                    // offset: 0,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            width: 0
                        },
                    },
                    axisLine: {
                        show: false,
                        // onZero: false,
                    },
                    axisTick: {
                        show: false,
                    }, 
                    axisLabel: {
                        textStyle: {
                            color: '#69779f',
                            fontSize: 10,
                        },
                        // inside: true,
                        // showMinLabel: false,
                    }
                },
                {
                    type: 'value',
                    // z: 1111,
                    name: unit,
                    nameTextStyle: {
                        color: '#999'
                    },
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    }
                    , axisLabel: {
                        textStyle: {
                            color: '#69779f',
                            fontSize: 10,
                        },
                        // inside: true,
                        // showMinLabel: false,
                    }
                },
                ],
                series: [
                    {
                        // name: 'a',
                        type: 'line',
                        // showSymbol:false,
                        symbol: 'none',
                        yAxisIndex: 0,
                        z:0,
                        areaStyle: {
                            normal: {
                                // color: {
                                //     type: 'linear',
                                //     x: 0,
                                //     y: 0,
                                //     x2: 0,
                                //     y2: 1,
                                //     colorStops: [{
                                //         offset: 0, color: '#abccfd' // 0% 处的颜色
                                //     }, {
                                //         offset: 1, color: '#ced5fb' // 100% 处的颜色
                                //     }],
                                // },
                                // shadowColor: 'rgba(0, 0, 0, 0.8)',
                                opacity: 0.1
                            }
                        },
                        // lineStyle: {
                        //     normal: {
                        //         color: "#6c90ca",
                        //     }
                        // },
                        smoothMonotone: 'x',
                        smooth: true,
                        data: energyData
                    },
                    {
                        // name: 'b',
                        type: 'line',
                        symbol: 'none',
                        yAxisIndex: 1,
                        z:1,
                        areaStyle: {
                            normal: {
                                // color: {
                                //     type: 'linear',
                                //     x: 0,
                                //     y: 0,
                                //     x2: 0,
                                //     y2: 1,
                                //     colorStops: [{
                                //         offset: 0, color: '#df92e6' // 0% 处的颜色
                                //     }, {
                                //         offset: 1, color: '#cab8e6' // 100% 处的颜色
                                //     }],
                                // },
                                // shadowColor: 'rgba(0, 0, 0, 0.2)',
                                opacity: 0.1
                            }
                        },
                        // lineStyle: {
                        //     normal: {
                        //         color: "#f8b8eb"
                        //     }
                        // },
                        smooth: true,
                        data: costData
                    },
                ]
            };

            echarts.init($echartsCtn).setOption(option);
        }
        renderEchartsPie(obj, realColor) {
            let option = {
                color: realColor,
                tooltip: {
                    trigger: 'item',
                    formatter: function(params, ticket, callback){
                        return params.name + ": " + params.value + " (" + params.percent + "%)" + "<br/>" + params.data.faultDes
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['60%', '72%'],
                        avoidLabelOverlap: false,
                        center: ['50%', '50%'],
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: (function(){
                            var pieData = []
                            Object.keys(obj).forEach(function(faultType){
                                var item = {
                                    value:obj[faultType].length, 
                                    name:diagnosisEnum.faultTypeName[faultType],
                                    faultDes:diagnosisEnum.faultTypeDes[faultType]
                                }
                                pieData.push(item)
                            })
                            return pieData;
                        }())
                    }
                ]
            };
            echarts.init(this.$pieCanvas).setOption(option);
        }
        attachEvents() {
            var _this = this;
            $(this.container).off("click", ".pieWithLineContainBox .helpInfo").on("click", ".pieWithLineContainBox .helpInfo", function () {
                _this.__proto__.setHelpTppltip([
                    {
                        id: "pieContent",
                        position: {
                            left: "50%",
                            top: I18n.type === "zh" ? -130 : -180
                        },
                        location: "top",
                        msg: `<p style="">${I18n.resource.overview.Energy_Saving_BAR_HELP_INFO}</p>
                        <img style="width: 100%;" src = "../static/app/Diagnosis/themes/default/images/energySavingAnnularChart.png">`,
                        container: $(_this.container).find(".pieContent")
                    },
                    {
                        id: "lineContent",
                        position: {
                            left: -300,
                            top: 0
                        },
                        location: "left",
                        msg: `<p style="">${I18n.resource.overview.Energy_Saving_LINE_HELP_INFO}</p>
                        <img style="width: 100%;" src = "../static/app/Diagnosis/themes/default/images/energySavingLineChart.png">`,
                        container: $(_this.container).find(".lineContent")
                    }
                ]);
            })
            $(this.container).off('click.goto','.gotoBtn').on('click.goto','.gotoBtn',function(e){
                e.stopPropagation();
                const {info} = this.dataset;
                _this.overview.diagnosis.setBack();
                _this.overview.diagnosis.changePage(document.querySelector('#diagnosisV2Detail [data-class="HistoryPage"]'));
                _this.overview.diagnosis.conditionModel.searchKey(info);
                _this.overview.diagnosis.page.show();
            })
            $(this.container).off('click.color').on('click.color', '.legendColorBox', function () {
                if ($(this).hasClass('selected')){
                    $(this).removeClass('selected');
                } else {
                    $(this).addClass('selected');
                }
                var selectedArr = [];
                $('.legendColorBox').each((index, v) => {
                    if ($(v).hasClass('selected')){
                        selectedArr.push($(v).next('span').html());
                    }
                })
                var data = {};
                var realColor = [];
                Object.keys(_this.pieData).forEach((v, index) => {
                    if (selectedArr.indexOf(diagnosisEnum.faultTypeName[v]) === -1) {
                        data[v] = _this.pieData[v];
                        realColor.push(_this.color[index]);
                    }
                });
                _this.renderEchartsPie(data, realColor);
            })
        }
        update(condition) {

        }
        close() {
            this.__proto__.destroyHelpTooltip(this.container);
        }
    }

    exports.ProportionPieWithLine = ProportionPieWithLine;
}(
    namespace('diagnosis.components'),
    namespace('diagnosis.components.Base'),
    namespace('diagnosis.enum')
    ));

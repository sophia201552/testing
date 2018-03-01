class EnergyOverview {
    constructor(opt) {
        this.opt = opt;
        this.timeConfig = opt.timeConfig;
        // this.nodesInfo = undefined;
        this.container = undefined;
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
        this.node = undefined;
        this.energyAnalysis = undefined;

        this.chartTheme = this.opt.chartTheme;

        this.selectEnergyId = AppConfig.energyCurrent?AppConfig.energyCurrent:0;

        //判断不同类型显示对应的文字和单位
        this.typeDiff={
            0:{
                todayType:I18n.resource.energyManagement.overview.TODAY_ENERGY_NEW,
                monthType:I18n.resource.energyManagement.overview.MONTH_ENERGY_NEW,
                yearType:I18n.resource.energyManagement.overview.YEAR_ENERGY_NEW,
                unit:' kWh',
                hourlyType:I18n.resource.energyManagement.overview.HOURLY_ENERGY,
                dailyType:I18n.resource.energyManagement.overview.DAILY_ENERGY,
                monthlyType:I18n.resource.energyManagement.overview.MONTH_ENERGY
            },
            1:{
                todayType:I18n.resource.energyManagement.overview.TODAY_ENERGY_NEW,
                monthType:I18n.resource.energyManagement.overview.MONTH_ENERGY_NEW,
                yearType:I18n.resource.energyManagement.overview.YEAR_ENERGY_NEW,
                unit:' kWh',
                hourlyType:I18n.resource.energyManagement.overview.HOURLY_ENERGY,
                dailyType:I18n.resource.energyManagement.overview.DAILY_ENERGY,
                monthlyType:I18n.resource.energyManagement.overview.MONTH_ENERGY
            },
            2:{
                todayType:I18n.resource.energyManagement.overview.TODAY_WATER_NEW,
                monthType:I18n.resource.energyManagement.overview.MONTH_WATER_NEW,
                yearType:I18n.resource.energyManagement.overview.YEAR_WATER_NEW,
                unit:' m³',
                hourlyType:I18n.resource.energyManagement.overview.HOURLY_WATER,
                dailyType:I18n.resource.energyManagement.overview.DAILY_WATER,
                monthlyType:I18n.resource.energyManagement.overview.MONTH_WATER
            },
            3:{
                todayType:I18n.resource.energyManagement.overview.TODAY_GAS_NEW,
                monthType:I18n.resource.energyManagement.overview.MONTH_GAS_NEW,
                yearType:I18n.resource.energyManagement.overview.YEAR_GAS_NEW,
                unit:' m³',
                hourlyType:I18n.resource.energyManagement.overview.HOURLY_GAS,
                dailyType:I18n.resource.energyManagement.overview.DAILY_GAS,
                monthlyType:I18n.resource.energyManagement.overview.MONTH_GAS
            },
            4:{
                todayType:I18n.resource.energyManagement.overview.TODAY_OIL_NEW,
                monthType:I18n.resource.energyManagement.overview.MONTH_OIL_NEW,
                yearType:I18n.resource.energyManagement.overview.YEAR_OIL_NEW,
                unit:' m³',
                hourlyType:I18n.resource.energyManagement.overview.HOURLY_OIL,
                dailyType:I18n.resource.energyManagement.overview.DAILY_OIL,
                monthlyType:I18n.resource.energyManagement.overview.MONTH_OIL
            },
            5:{
                todayType:I18n.resource.energyManagement.overview.TODAY_WATER_SUPPLY,
                monthType:I18n.resource.energyManagement.overview.MONTH_WATER_SUPPLY,
                yearType:I18n.resource.energyManagement.overview.YEAR_WATER_SUPPLY,
                unit:' m³',
                hourlyType:I18n.resource.energyManagement.overview.HOURLY_WATER_SUPPLY,
                dailyType:I18n.resource.energyManagement.overview.DAILY_WATER_SUPPLY,
                monthlyType:I18n.resource.energyManagement.overview.MONTHLY_WATER_SUPPLY
            },
            6:{
                todayType:I18n.resource.energyManagement.overview.TODAY_WATER_DRAINAGE,
                monthType:I18n.resource.energyManagement.overview.MONTH_WATER_DRAINAGE,
                yearType:I18n.resource.energyManagement.overview.YEAR_WATER_DRAINAGE,
                unit:' m³',
                hourlyType:I18n.resource.energyManagement.overview.HOURLY_DRAINAGE,
                dailyType:I18n.resource.energyManagement.overview.DAILY_DRAINAGE,
                monthlyType:I18n.resource.energyManagement.overview.MONTH_DRAINAGE
            }
        };
    }
    show() {
        var _this = this;
        $('.wrapTagTree').hide();
        WebAPI.get('/static/app/EnergyManagement/views/module/energyOverview.html').done(rsHtml => {
            this.container = $('#containerDisplayboard');
            this.container.html('').append(rsHtml);
            I18n.fillArea(this.container);
            this.container.find('.todayType').html(this.typeDiff[Number(this.selectEnergyId)].todayType);
            this.container.find('.monthType').html(this.typeDiff[Number(this.selectEnergyId)].monthType);
            this.container.find('.yearType').html(this.typeDiff[Number(this.selectEnergyId)].yearType);
            this.container.find('.hourlyType').html(this.typeDiff[Number(this.selectEnergyId)].hourlyType + '(' + AppConfig.energyUnit.name + ')');
            this.container.find('.dailyType').html(this.typeDiff[Number(this.selectEnergyId)].dailyType + '(' + AppConfig.energyUnit.name + ')');
            this.container.find('.monthlyType').html(this.typeDiff[Number(this.selectEnergyId)].monthlyType + '(' + AppConfig.energyUnit.name + ')');
            $('#compareToYest').tooltip();
            $('#compareMom').tooltip();
            $('#compareAn').tooltip();
            $('#compareAnYear').tooltip();
            var postData = {
                projectId: AppConfig.projectId,
                entityId: -1
            }
            if(AppConfig.energyCurrent){
                postData.energyType = AppConfig.energyCurrent
            }
            WebAPI.post('/energy/getConfigInfo', postData).done((result) => {
                if (result.data && result.data[0]) {
                    if (AppConfig.projectCurrent && AppConfig.projectCurrent.i18n == 1) {
                        _this.node = JSON.parse(I18n.trans(JSON.stringify(result.data[0])));
                    } else {
                        _this.node = result.data[0];
                    }
                    _this.init();
                }
            })
        });
    };
    init() {
        //左上角数据接入
        this.initTimeWidget(this.timeConfig)
        this.energyDayYear();
        //右上角
        this.renderEnergyStati();
        //this.renderElectricity();
        //判断是否有数据点
        if (!this.node || !this.node.energy) {
            alert('no point');
            return;
        }
        this.setHourlyHistoryChart();
        this.setDailyHistoryChart();
        this.setMonthlyHistoryChart();
        this.attEvent()
    };
    initTimeWidget(time) {
        $('#queryTimIpt').val(toDate(time).getFullYear()).datetimepicker('remove').datetimepicker({
            format: 'yyyy',
            autoclose: true,
            minView: 4,
            startView: 4
        });
        $('#hourlyTimIpt').val(toDate(time).format('yyyy-MM-dd')).datetimepicker('remove').datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            minView: 2,
            startView: 2,
            endDate: toDate().format('yyyy-MM-dd')
        });
        $('#dailyTimIpt').val(toDate(time).format('yyyy-MM')).datetimepicker('remove').datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            minView: 3,
            startView: 3,
            endDate: toDate().format('yyyy-MM')
        });
        $('#monthlyTimIpt').val(toDate(time).format('yyyy')).datetimepicker('remove').datetimepicker({
            format: 'yyyy',
            autoclose: true,
            minView: 4,
            startView: 4,
            endDate: toDate().format('yyyy')
        });
    }
    setHourlyHistoryChart() {
        var $iptTime = $('#hourlyTimIpt');
        var setTime = toDate($iptTime.val());
        var clone_setTime = toDate($iptTime.val());
        var time, timeBefore;

        var isCurrentTime = (toDate(setTime.format('yyyy-MM-dd 00:00:00')).getTime() >= toDate(toDate().format('yyyy-MM-dd 00:00:00')).getTime())
        if (isCurrentTime) {
            time = {
                startTime: toDate(+toDate() - 86400000).format('yyyy-MM-dd HH:00:00'),
                endTime: toDate().format('yyyy-MM-dd HH:00:00'),
                format: 'h1',
            };
            timeBefore = {
                startTime: toDate(+toDate() - 86400000 - 86400000).format('yyyy-MM-dd HH:00:00'),
                endTime: toDate(+toDate() - 86400000).format('yyyy-MM-dd HH:00:00'),
                format: 'h1'
            }
        } else {
            time = {
                startTime: toDate(+setTime).format('yyyy-MM-dd 00:00:00'),
                endTime: setTime.format('yyyy-MM-dd 23:59:59'),
                format: 'h1'
            };
            timeBefore = {
                startTime: toDate(+setTime - 86400000).format('yyyy-MM-dd 00:00:00'),
                endTime: toDate(+setTime - 86400000).format('yyyy-MM-dd 23:59:59'),
                format: 'h1'
            }
        }
        // if (toDate(time.endTime) >  toDate()){
        //     time.endTime = toDate().format('yyyy-MM-dd HH:mm:ss')
        //     time.startTime = toDate(+toDate() - 3600000).format('yyyy-MM-dd 00:00:00')
        // }
        time.endTime = toDate(toDate(time.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss')
        timeBefore.endTime = toDate(toDate(timeBefore.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss')
        var container = $('#hourlyPower')[0];
        var SpinnerLine = new LoadingSpinner({
            color: '#00FFFF'
        });
        SpinnerLine.spin($('#hourlyPower')[0]);
        var timeArr = [];
        var timeArrs = [];
        var series = []
        var seriesCost = [];
        var currentType = this.typeDiff[Number(this.selectEnergyId)].hourlyType + '(' + AppConfig.energyUnit.name + ')';
        var legend = [currentType];
        this.getStackData(time).done(result => {
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            timeArr.push(timeShaft);
            timeArr.push(timeShaft);
            series.push({
                name: currentType,
                type: 'bar',
                stack: '逐时用电',
                smooth: true,
                symbolSize: 0,
                itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(94,219,237,1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(134,169,246,1)'
                                    }], false)
                                }
                            },
                // itemStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: 'rgba(112,211,95,0.5)'
                //         }, {
                //             offset: 1,
                //             color: 'rgba(112,211,95,1)'
                //         }], false)
                //     }
                // },
                data: result.list[0].data.map(function (ele) {
                    if(ele >= 100){
                        return parseInt(ele)
                    }else{
                        return parseFloat(parseFloat(ele).toFixed(2))
                    }
                })
            })
            if(!this.node||!this.node.cost){
               
            }else{
                series.push({
                    name: I18n.resource.energyManagement.overview.HOURLY_COST,
                    type: 'line',
                    yAxisIndex: 1,
                    stack: '逐时用电费',
                    smooth: true,
                    symbolSize: 0,
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, this.echartGradientList.dayArea, false),
                            opacity: 0
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 3,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(250,128,114,0.9)'
                            }, {
                                offset: 1,
                                color: 'rgba(250,128,114,0.5)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            shadowBlur: 15,
                        }
                    },
                    data: result.list[1].data.map(function (ele) {
                        if(ele >= 100){
                            return parseInt(ele)
                        }else{
                            return parseFloat(parseFloat(ele).toFixed(2))
                        }
                    })
                })
            }
            

            this.renderStackAreaLine(timeShaft, series, legend, container, 'day', seriesCost, timeArr)
        }).always(() => {
                SpinnerLine.stop();
            })
        // this.getStackData(timeBefore).done(results => {
        //     var timeArrs = results.timeShaft
        //     timeArrs.pop();
        //     timeArr.push(timeArrs);
        //     var legend = [I18n.resource.energyManagement.overview.HOURLY_ENERGY];
        //     var series = []
        //     var seriesCost = [];
        //     series.push({
        //         name: I18n.resource.energyManagement.overview.HOURLY_ENERGY,
        //         type: 'bar',
        //         stack: '逐时用电昨日',
        //         smooth: true,
        //         symbolSize: 0,
        //         itemStyle: {
        //             normal: {
        //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                     offset: 0,
        //                     color: 'rgba(94,219,237,1)'
        //                 }, {
        //                     offset: 1,
        //                     color: 'rgba(134,169,246,1)'
        //                 }], false)
        //             }
        //         },
        //         areaStyle: {
        //             normal: {

        //             }
        //         },
        //         data: results.list[0].data.map(function (ele) {
        //             return parseFloat(ele).toFixed(0);
        //         })
        //     });
        //     this.getStackData(time).done(result => {
        //         var timeShaft = result.timeShaft;
        //         timeShaft.pop();
        //         timeArr.push(timeShaft);
        //         timeArr.push(timeShaft);
        //         series.push({
        //             name: I18n.resource.energyManagement.overview.HOURLY_ENERGY,
        //             type: 'bar',
        //             stack: '逐时用电',
        //             smooth: true,
        //             symbolSize: 0,
        //             itemStyle: {
        //                 normal: {
        //                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                         offset: 0,
        //                         color: 'rgba(112,211,95,0.5)'
        //                     }, {
        //                         offset: 1,
        //                         color: 'rgba(112,211,95,1)'
        //                     }], false)
        //                 }
        //             },
        //             data: result.list[0].data.map(function (ele) {
        //                 return parseFloat(ele).toFixed(0);
        //             })
        //         })
        //         series.push({
        //             name: I18n.resource.energyManagement.overview.HOURLY_COST,
        //             type: 'line',
        //             yAxisIndex: 1,
        //             stack: '逐时用电费',
        //             smooth: true,
        //             symbolSize: 0,
        //             areaStyle: {
        //                 normal: {
        //                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, this.echartGradientList.dayArea, false),
        //                     opacity: 0
        //                 }
        //             },
        //             lineStyle: {
        //                 normal: {
        //                     width: 3,
        //                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                         offset: 0,
        //                         color: 'rgba(250,128,114,0.9)'
        //                     }, {
        //                         offset: 1,
        //                         color: 'rgba(250,128,114,0.5)'
        //                     }], false),
        //                     shadowColor: 'rgba(0, 0, 0, 0.4)',
        //                     shadowBlur: 15,
        //                 }
        //             },
        //             data: result.list[1].data.map(function (ele) {
        //                 return parseFloat(ele).toFixed(0);
        //             })
        //         })

        //         this.renderStackAreaLine(timeShaft, series, legend, container, 'day', seriesCost, timeArr)
        //     })

        // }).always(() => {
        //     SpinnerLine.stop();
        // })
    }
    setDailyHistoryChart() {
        var $iptTime = $('#dailyTimIpt');
        var setTime = toDate($iptTime.val());
        // setTime = toDate(setTime.valueOf() + toDate().getTimezoneOffset() * 60000);
        var clone_setTime = toDate($iptTime.val());
        // clone_setTime = toDate(clone_setTime.valueOf() + toDate().getTimezoneOffset() * 60000);
        var time, timeBefore;
        // if(setTime.getMonth()>=toDate().getMonth()){
        //     time = {
        //         startTime:toDate(toDate().valueOf() - 30*24*60*60*1000).format('yyyy-MM-dd HH:mm:ss'),
        //         endTime:setTime.format('yyyy-MM-'+ DateUtil.daysInMonth(setTime) +' 23:59:59'),
        //         format:'d1'
        //     }
        // }else{
        //     time = {
        //         startTime:setTime.format('yyyy-MM-01 00:00:00'),
        //         endTime:setTime.format('yyyy-MM-'+ DateUtil.daysInMonth(setTime) +' 23:59:59'),
        //         format:'d1'
        //     }
        // }
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
        var container = $('#dailyPower')[0];
        var SpinnerDaily = new LoadingSpinner({
            color: '#00FFFF'
        });
        SpinnerDaily.spin(container);
        this.getStackData(time).done(result => {
            // result.timeShaft.splice(result.timeShaft.length-1,1)
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            timeShaft=timeShaft.map(item=>{
                return item.substring(5,11)
            })
            var currentType = this.typeDiff[Number(this.selectEnergyId)].dailyType + '(' + AppConfig.energyUnit.name + ')';
            var legend = [currentType];
            var series = []
            series.push({
                name: currentType,
                type: 'bar',
                stack: '逐日用电',
                markPoint: (function () { //575项目才添加区分
                    var markdata;
                    if (AppConfig.projectId == 575) {
                        markdata = {
                            itemStyle: {
                                normal: {
                                    color:'#23E5FF'
                                    // new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    //     offset: 0,
                                    //     color: '#5EDBED'
                                    // }, {
                                    //     offset: 1,
                                    //     color: '#7DA2F5'
                                    // }], false)
                                }
                            },
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        if (params.data.yAxis >= 1000 || params.data.yAxis <= -1000) {
                                            return (params.data.yAxis / 1000).toFixed(0) + 'k';
                                        } else {
                                            return params.data.yAxis;
                                        }
                                    }
                                }
                            },
                            data: (function () {
                                var markpoint = [];
                                var len = result.list[0].data.length;
                                result.list[0].data.forEach(function (ele, index) {
                                    if (len - index < 4) {
                                        markpoint.push({
                                            xAxis: index,
                                            yAxis: parseFloat(ele).toFixed(0),
                                        })
                                    }
                                })
                                return markpoint;
                            })()
                        }
                    } else {
                        markdata = {};
                    }
                    return markdata
                })(),
                temStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#5EDBED'
                        }, {
                            offset: 1,
                            color: '#7DA2F5'
                        }], false)
                    }
                },
                data: result.list[0].data.map(function (ele) {
                    if(ele >= 100){
                        return parseInt(ele)
                    }else{
                        return parseFloat(parseFloat(ele).toFixed(2))
                    }
                })
            })
            if(this.node&&this.node.cost){
                series.push({
                    name: I18n.resource.energyManagement.overview.DAILY_COST,
                    yAxisIndex: 1,
                    smooth: true,
                    type: 'line',
                    stack: '逐日用电1',
                    symbolSize: 0,
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, this.echartGradientList.dayArea, false),
                            opacity: 0
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 3,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(250,128,114,0.9)'
                            }, {
                                offset: 1,
                                color: 'rgba(250,128,114,0.5)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            shadowBlur: 15,
                        }
                    },
                    data: result.list[1].data.map(function (ele) {
                        if(ele >= 100){
                            return parseInt(ele)
                        }else{
                            return parseFloat(parseFloat(ele).toFixed(2))
                        }
                    })
                })
            }else{
               
            }
            


            this.renderStackArea(timeShaft, series, legend, container, 'month');
        }).always(() => {
            SpinnerDaily.stop();
        })
    }
    setMonthlyHistoryChart() {
        var $iptTime = $('#monthlyTimIpt');
        var yearFull = $iptTime.val();
        var setTime = toDate($iptTime.val())
        var clone_setTime = toDate($iptTime.val());
        var setTimenew = toDate();
        setTimenew.setMonth(setTimenew.getMonth() - 11)
        var time = {
            startTime: yearFull + '-01-01 00:00:00', //setTime.format('yyyy-01-01 00:00:00'),
            endTime: parseInt(yearFull) + 1 + '-01-01 00:00:00', //toDate(clone_setTime.setFullYear(clone_setTime.getFullYear()+1)).format('yyyy-01-01 00:00:00'),  //toDate(clone_setTime.setYear(+1)).format('yyyy-01-01 00:00:00'),
            format: 'M1'
        }
        if (toDate(time.endTime) > toDate()) {
            time.endTime = toDate(toDate().setMonth(toDate().getMonth() + 1)).format('yyyy-MM-dd HH:mm:ss') //toDate(toDate().setMonth(+1)).format('yyyy-MM-dd HH:mm:ss')
            time.startTime = toDate(setTimenew).format('yyyy-MM-dd 00:00:00')
        }
        var container = $('#monthlyPower')[0];
        var xAxisNum = 0
        if (setTime.getFullYear() == toDate().getFullYear()) {
            xAxisNum = 12;
        } else {
            xAxisNum = 12;
        }
        var SpinnerYear = new LoadingSpinner({
            color: '#00FFFF'
        });
        SpinnerYear.spin(container);
        this.getStackData(time).done(result => {
            // result.timeShaft.splice(result.timeShaft.length-1,1)
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            var currentType = this.typeDiff[Number(this.selectEnergyId)].monthlyType + '(' + AppConfig.energyUnit.name + ')';
            var legend = [currentType]
            var series = []
            series.push({
                name: currentType,
                type: 'bar',
                barGap: '50%',
                markPoint: (function () { //575项目才添加区分
                    var markdata;
                    if (AppConfig.projectId == 575) {
                        markdata = {
                            itemStyle: {
                                normal: {
                                    color: '#23E5FF'
                                }
                            },
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        if (params.data.yAxis >= 1000 || params.data.yAxis <= -1000) {
                                            return (params.data.yAxis / 1000).toFixed(0) + 'k';
                                        } else {
                                            return params.data.yAxis;
                                        }
                                    }
                                }
                            },
                            data: [{
                                xAxis: xAxisNum - 1,
                                yAxis: result.list[0].data[result.list[0].data.length - 1],
                                symbolSize: 60
                            }]
                        };
                    } else {
                        markdata = {};
                    }
                    return markdata;
                })(),
                stack: '逐月用电',
                data: result.list[0].data.map(function (ele) {
                    if(ele >= 100){
                        return parseInt(ele)
                    }else{
                        return parseFloat(parseFloat(ele).toFixed(2))
                    }
                })
            })
            if(this.node&&this.node.cost){
                series.push({
                    name: I18n.resource.energyManagement.overview.MONTH_COST,
                    yAxisIndex: 1,
                    type: 'line',
                    smooth: true,
                    symbolSize: 0,
                    stack: '逐月用电1',
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(173,216,230,0.3)'
                            }, {
                                offset: 1,
                                color: 'rgba(51,152,219,0.3)'
                            }], false),
                            opacity: 0
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 3,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(250,128,114,0.9)'
                            }, {
                                offset: 1,
                                color: 'rgba(250,128,114,0.5)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            shadowBlur: 15,
                        }
                    },
                    data: result.list[1].data.map(function (ele) {
                        if(ele >= 100){
                            return parseInt(ele)
                        }else{
                            return parseFloat(parseFloat(ele).toFixed(2))
                        }
                    })
                })
            }else{
               
            }
            
            this.renderStackArea(timeShaft, series, legend, container, 'year')
        }).always(() => {
            SpinnerYear.stop();
        })
    }
    getStackData(time) {
        var _this = this;
        var $promise = $.Deferred();
        if (!this.node || (this.node && this.node.energy == '') || (this.node && !this.node.energy)) {
            // alert(I18n.resource.energyManagement.overview.NO_POINT_ALERT);
            return $promise.reject();
        }
        
        var postData = {
            dsItemIds: [this.node.energy, this.node.cost],
            timeStart: time.startTime,
            timeEnd: time.endTime,
            timeFormat: time.format
        }
        postData.dsItemIds.forEach((item,i)=>{
            item==null?postData.dsItemIds.splice(i,1):item
        })
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', postData).done(function (result) {
            if (result.list) {
                $promise.resolveWith(_this, [result]);
            } else {
                $promise.reject();
            }
        }).fail(function () {
            $promise.reject();
        })
        return $promise.promise();
    };
    energyDayYear() {
        var _this = this;
        //var pointEnergyId = this.nodesInfo?this.nodesInfo.energy:this.opt.store[0].config.energy;
        //var pointPowerId = this.nodesInfo?this.nodesInfo.power:this.opt.store[0].config.power;
        //var pointCostId = this.nodesInfo?this.nodesInfo.cost:this.opt.store[0].config.cost;
        // if(!this.opt.store[0].config||(this.opt.store[0].config&&(this.opt.store[0].config.energy==''||this.opt.store[0].config.cost==''))||(this.opt.store[0].config&&(!this.opt.store[0].config.energy||!this.opt.store[0].config.cost))){
        //     alert(I18n.resource.energyManagement.overview.NO_POINT_ALERT);
        //     return;
        // }
        // if (!this.node || ((this.node.energy == '' || this.node.cost == '')) || (this.node && (!this.node.energy || !this.node.cost))) {
        //     // alert(I18n.resource.energyManagement.overview.NO_POINT_ALERT);
        //     return;
        // }
        if (!this.node || ((this.node.energy == '')) || (this.node && (!this.node.energy))) {
                // alert(I18n.resource.energyManagement.overview.NO_POINT_ALERT);
                return;
        }
        var pointEnergyId = this.node.energy;
        var pointPowerId = this.node.power;
        var pointCostId = this.node.cost;
        var arrParamId = [];
        //arrParamId.push(pointPowerId);//pointEnergyId
        arrParamId.push(pointEnergyId); //pointEnergyId
        if(pointCostId){
            arrParamId.push(pointCostId);
        }
        var timeEnd = toDate(this.timeConfig).format('yyyy-MM-dd') == (toDate().format('yyyy-MM-dd'))  ? toDate(toDate().valueOf() + 86400000).format('yyyy-MM-dd 00:00:00') : toDate(toDate(this.timeConfig).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00');
        var timeStart = toDate(this.timeConfig).format('yyyy-MM-dd') == (toDate().format('yyyy-MM-dd'))  ? toDate(toDate().valueOf() - 86400000 * 1).format('yyyy-MM-dd 00:00:00') : toDate(toDate(this.timeConfig).valueOf() - 86400000 * 1).format('yyyy-MM-dd 00:00:00');
        //今日能耗
        var postData = {
            dsItemIds: arrParamId,
            timeStart: timeStart,
            timeEnd: timeEnd,
            timeFormat: 'd1'
        }
        var time;
        var timeBefore;
        var isCurrentTime = (toDate(toDate(this.timeConfig).format('yyyy-MM-dd 00:00:00')).getTime() >= toDate(toDate().format('yyyy-MM-dd 00:00:00')).getTime())
        if (isCurrentTime) {
            time = {
                dsItemIds: arrParamId,
                timeStart: toDate().format('yyyy-MM-dd 00:00:00'),
                timeEnd: toDate().format('yyyy-MM-dd HH:00:00'),
                timeFormat: 'h1'
            };
            timeBefore = {
                dsItemIds: arrParamId,
                timeStart: toDate(+toDate().valueOf()  - 86400000).format('yyyy-MM-dd 00:00:00'),
                timeEnd: toDate(+toDate().valueOf() - 86400000).format('yyyy-MM-dd HH:00:00'),
                timeFormat: 'h1'
            }
        } else {
            time = {
                dsItemIds: arrParamId,
                timeStart: toDate(+toDate(this.timeConfig)).format('yyyy-MM-dd 00:00:00'),
                timeEnd: toDate(this.timeConfig).format('yyyy-MM-dd 23:59:59'),
                timeFormat: 'h1'
            };
            timeBefore = {
                dsItemIds: arrParamId,
                timeStart: toDate(+toDate(this.timeConfig).valueOf() - 86400000).format('yyyy-MM-dd 00:00:00'),
                timeEnd: toDate(+toDate(this.timeConfig).valueOf() - 86400000).format('yyyy-MM-dd 23:59:59'),
                timeFormat: 'h1'
            }
        }
        var onPerent = '--';
        time.timeEnd = toDate(toDate(time.timeEnd).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss')
        timeBefore.timeEnd = toDate(toDate(timeBefore.timeEnd).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss')
        $.when(WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', time),WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', timeBefore)).done((rs,rss)=>{
            var $compareToYest = $('#compareToYest');
            // 今日电费、今日电耗
            var energyThis=0;
            var energyLast=0;
            var costThis=0;
            var costLast=0;
            if(!pointCostId){
                rs[0].list[1].data=[];
                rss[0].list[1].data=[];
            }
            rs[0].list[0].data.forEach(item=>{energyThis+=item});
            rs[0].list[1].data.forEach(item=>{costThis+=item});
            rss[0].list[0].data.forEach(item=>{energyLast+=item});
            rss[0].list[1].data.forEach(item=>{costLast+=item});
            if(rs[0].list[1].data.length!=0 || rs[0].list[0].data.length){
                var todayNum;
                if(energyThis >= 10){
                    todayNum = _this.getThousandsBit(parseFloat(energyThis).toFixed(0)) + ' ' + AppConfig.energyUnit.name;//CONSTANT.energy.type[Number(this.selectEnergyId)].unit.name;//' kWh';
                }else{
                    todayNum = parseFloat(parseFloat(energyThis).toFixed(2)) + ' ' + AppConfig.energyUnit.name;
                }
                $('#todayEnergyChat').html(todayNum);
                var $arrorDisplyTody = $('.arrorDisplyTody ');
                $arrorDisplyTody.removeClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-up');
                if(energyThis>energyLast){
                    $arrorDisplyTody.addClass('glyphicon-arrow-up');
                } else {
                    $arrorDisplyTody.addClass('glyphicon-arrow-down');
                }
                onPerent = energyThis == energyLast? 0 : parseInt(energyThis / energyLast * 100);
                energyLast==0?energyThis!=0?onPerent=0:'':'';
                onPerent = Math.abs(100 - onPerent) + '%'
                if (rs[0].list[1].data.length!= 0) {
                    var value = parseFloat(costThis);
                    if(value <= 10){
                        value = parseFloat(value.toFixed(2));
                    }else{
                        value = value.toFixed(0);
                    }
                    if (value < 0) value = 0;
                    $('#todayEnergyCost').html(AppConfig.unit_currency + ' ' + _this.getThousandsBit(value));
                }
                $compareToYest.html(onPerent)
            }
        })
        
        //本月环比
        // 本月环比：每月初到当天比上月当天
        var nowYear = toDate(this.timeConfig).getFullYear();
        var nowMonth = toDate(this.timeConfig).getMonth();
        var nowDay = toDate(this.timeConfig).getDate();
        var currentYear = toDate().getFullYear();
        var currentBeforMonth = toDate().getMonth() - 1;
        var currentDate = toDate().getDate();
        var timeStartM = toDate(this.timeConfig).format('yyyy-MM') == (toDate().format('yyyy-MM')) ? toDate(currentYear, currentBeforMonth, currentDate).format('yyyy-MM-01 00:00:00') : toDate(nowYear, nowMonth - 1, nowDay).format('yyyy-MM-01 00:00:00');
        var timeEndM = toDate(this.timeConfig).format('yyyy-MM') == (toDate().format('yyyy-MM'))  ? toDate(currentYear, currentBeforMonth + 2, currentDate).format('yyyy-MM-01 00:00:00') : toDate(nowYear, nowMonth + 1, nowDay).format('yyyy-MM-01 00:00:00');
        var postDataMonth = {
            dsItemIds: arrParamId,
            timeStart: timeStartM,
            timeEnd: timeEndM,
            timeFormat: 'M1'
        }
        var curMonthData = 0
        var onPerentMom = '--',
            onPerentAn = '--';
        var LastDateForCurMon = this.timeConfig;
        if (toDate(this.timeConfig).format('yyyy-MM') == (toDate().format('yyyy-MM'))){
            LastDateForCurMon = toDate();
        }else{
            LastDateForCurMon = toDate(toDate(this.timeConfig).setDate(DateUtil.daysInMonth(toDate(this.timeConfig))))
        }

        var timeM={
            dsItemIds: arrParamId,
            timeStart: toDate(+toDate(LastDateForCurMon)).format('yyyy-MM-01 00:00:00'),
            timeEnd: toDate(+toDate(LastDateForCurMon)).format('yyyy-MM-dd 23:59:59'),
            timeFormat: 'd1'
        }
        var nowdays = toDate(LastDateForCurMon);
        var year = nowdays.getFullYear();
        var month = nowdays.getMonth();

        var lastMonth = toDate(year,month,0)

        if(toDate(LastDateForCurMon).getDate()>DateUtil.daysInMonth(lastMonth)){
            var timeBeforeM={
                dsItemIds: arrParamId,
                timeStart: toDate(lastMonth).format('yyyy-MM-01 00:00:00'),
                timeEnd: toDate(toDate(year,month,0).setDate(toDate(LastDateForCurMon).getDate() - DateUtil.daysInMonth(lastMonth))).format('yyyy-MM-dd 23:59:59'),
                timeFormat: 'd1'
            }
        }else {
            var timeBeforeM={
                dsItemIds: arrParamId,
                timeStart: toDate(lastMonth).format('yyyy-MM-01 00:00:00'),
                timeEnd: toDate(lastMonth).format('yyyy-MM-'+toDate(LastDateForCurMon).format('dd')+' 23:59:59'),
                timeFormat: 'd1'
            }
        }
        timeM.timeEnd = toDate(toDate(timeM.timeEnd).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
        timeBeforeM.timeEnd = toDate(toDate(timeBeforeM.timeEnd).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
        $.when(WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', timeM),WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', timeBeforeM)).done((rs,rss)=>{
            var $compareMom = $('#compareMom');
               // 今yue电费、今yue电耗
               var energyThis=0;
               var energyLast=0;
               var costThis=0;
               var costLast=0;
               if(!pointCostId){
                   if(rs[0].list.length==1){
                    rs[0].list.push({data:[]});
                    rss[0].list.push({data:[]});
                   }
                    
                }
               rs[0].list[0].data.forEach(item=>{energyThis+=item;})
               rs[0].list[1].data.forEach(item=>{costThis+=item;})
               rss[0].list[0].data.forEach(item=>{energyLast+=item})
               rss[0].list[1].data.forEach(item=>{costLast+=item})
               //昨yue同时电费、电耗
               if(rs[0].list.length>0){
                     var mothNum;
                     curMonthData=energyThis;
                     mothNum = _this.getThousandsBit(parseFloat(energyThis).toFixed(0)) + ' ' + AppConfig.energyUnit.name;//CONSTANT.energy.type[Number(this.selectEnergyId)].unit.name;//' kWh'
                     $('#MonthEnergyChat').html(mothNum);
                     var $arrorDisplyMonth = $('.arrorDisplyMonth ');
                     $arrorDisplyMonth.removeClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-up');
                     if (energyThis>= energyLast) {
                        $arrorDisplyMonth.addClass('glyphicon-arrow-up');
                    } else {
                        $arrorDisplyMonth.addClass('glyphicon-arrow-down');
                    }
                    if (energyLast == 0) {
                        $compareMom.html('--')
                    } else {
                        onPerentMom = energyThis ==energyLast ? '0%' : Math.abs(100 - ((energyThis /energyLast * 100).toFixed(0))) + '%';
                    }
                    $compareMom.html(onPerentMom)
               }else {
                $compareMom.html('--')
            }
            if (rs[0].list[1].data.length != 0) {
                var value = parseFloat(costThis).toFixed(0);
                if (value < 0) value = 0;
                $('#MonthEnergyCost').html(AppConfig.unit_currency + ' ' + _this.getThousandsBit(value));
            }
        }).always(function () {
            return ;
            //本月同比
            var timeStartY = toDate(nowYear - 1, nowMonth - 1, nowDay).format('yyyy-MM-01 00:00:00');
            var timeEndY = toDate(nowYear - 1, nowMonth, nowDay).format('yyyy-MM-20 00:00:00');
            var postDataYear = {
                dsItemIds: arrParamId,
                timeStart: timeStartY,
                timeEnd: timeEndY,
                timeFormat: 'M1'
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment', postDataYear).done(rsDataY => {
                var $compareAn = $('#compareAn');
                if (rsDataY && rsDataY.list.length > 0) {
                    for (var i = 0; i < rsDataY.list.length; i++) {
                        if (i == 0) {
                            var item = rsDataY.list[i].data;
                            if (item.length != 0) {
                                var currentData = item[item.length - 1];
                                var mothNum;
                                //if(currentData>=1000){
                                //    mothNum = parseFloat(currentData/1000).toFixed(0)+' MWh'
                                //}else{
                                mothNum = _this.getThousandsBit(parseFloat(currentData).toFixed(0)) + ' ' + AppConfig.energyUnit.name;//CONSTANT.energy.type[Number(this.selectEnergyId)].unit.name;//' kWh'
                                //}
                                $('#MonthEnergyChat').html(mothNum);
                                var $arrorOnDisplyMonth = $('.arrorOnDisplyMonth ');
                                $arrorOnDisplyMonth.removeClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-up');
                                if (currentData >= curMonthData) {
                                    $arrorOnDisplyMonth.addClass('glyphicon-arrow-up');
                                } else {
                                    $arrorOnDisplyMonth.addClass('glyphicon-arrow-down');
                                }
                                //var onPerent; //= currentData==item[0]?0:(currentData/item[0]*100).toFixed(2);
                                if (currentData == curMonthData) {
                                    onPerentAn = 0 + '%'
                                } else {
                                    if (curMonthData == 0) {
                                        onPerentAn = '--%';
                                    } else {
                                        
                                        onPerentAn = Math.abs(100 - (currentData / curMonthData * 100).toFixed(0)) + '%';
                                    }
                                }
                            }
                            $compareAn.html(onPerentAn)
                        }
                        // else{
                        //     var item = rsDataY.list[i].data;
                        //     if(item.length!=0){
                        //         $('#MonthEnergyCost').html('$'+_this.getThousandsBit(parseFloat(item[item.length-1]).toFixed(0)));
                        //     }
                        // }
                    }
                } else {
                    $compareAn.html(onPerentAn)
                    //infoBox.alert('no data')
                }
            }).always(() => {
            
            })
        })
     
        // //本年
        this.setYearContrast(arrParamId)
      
    };
    setYearContrast(points) {
        //本年
        var _this = this;
        var setTime = toDate(this.timeConfig)
        var timeStartThisYear = toDate(setTime).format('yyyy-01-01 00:00:00')
        var timeEndThisYear = toDate(toDate(setTime).setFullYear(setTime.getFullYear() + 1)).format('yyyy-01-01 00:00:00');
        var timeStartLastYear = toDate(toDate(setTime).setFullYear(toDate(setTime).getFullYear() - 1)).format('yyyy-01-01 00:00:00')
        var timeEndLastYear = toDate(setTime).format('yyyy-01-01 00:00:00');
        var onYearPerent = '--';
        var thisMonthLastDay=toDate(setTime.getFullYear(),setTime.getMonth()+1,0);
        var lastMonthFirstDay=toDate(thisMonthLastDay.valueOf()+86400000).format("yyyy-MM-dd HH:mm:ss");
        if (toDate(timeEndThisYear) > toDate()) {
            var lastYear=toDate(toDate(setTime).setFullYear(toDate(setTime).getFullYear() - 1));
            var lastYear_thisMonthLastDay=toDate(lastYear.getFullYear(),lastYear.getMonth()+1,0);
            var lastYear_lastMonthFirstDay=toDate(lastYear_thisMonthLastDay.valueOf()+86400000).format("yyyy-MM-dd HH:mm:ss");
            timeEndThisYear=lastMonthFirstDay;
            timeEndLastYear=lastYear_lastMonthFirstDay;
            // timeEndThisYear = toDate().format('yyyy-MM-01 00:00:00')
            // timeEndLastYear = toDate(toDate(setTime).setFullYear(toDate(setTime).getFullYear() - 1)).format('yyyy-MM-01 00:00:00')
        }
        var postThisYear = {
            dsItemIds: points,
            timeStart: timeStartThisYear,
            timeEnd: timeEndThisYear,
            timeFormat: 'M1'
        }
        var postLastYear = {
            dsItemIds: points,
            timeStart: timeStartLastYear,
            timeEnd: timeEndLastYear,
            timeFormat: 'M1'
        }
        $.when(WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', postThisYear), WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', postLastYear)).done((function () {
            var rsThisYear = arguments[0][0].list
            var rsLastYear = arguments[1][0].list
            var eleThisYear = rsThisYear[0].data
            var eleLastYear = rsLastYear[0].data
            if(arguments[0][0].list.length==1){
                arguments[0][0].list.push({data:[]});
                arguments[1][0].list.push({data:[]});
               }
            var costThisYear = rsThisYear[1].data
            var costLastYear = rsLastYear[1].data
           
            var numEleThisYear = 0
            var numEleLastYear = 0
            var numCostThisYear = 0
            var numCostLastYear = 0
            eleThisYear.forEach(item=>{numEleThisYear+=item;})
            eleLastYear.forEach(item=>{numEleLastYear+=item;})
            costThisYear.forEach(item=>{numCostThisYear+=item;})
            costLastYear.forEach(item=>{numCostLastYear+=item;})
            if (isNaN(numEleThisYear)) numEleThisYear = 0;
            if (isNaN(numEleLastYear)) numEleLastYear = 0;
            if (isNaN(numCostThisYear)) numCostThisYear = 0;
            if (isNaN(numCostLastYear)) numCostLastYear = 0;

            var $compareAnYear = $('#compareAnYear');
            if (costThisYear.length != 0) {
                if (numCostThisYear < 0) numCostThisYear = 0;
                $('#yearEnergyCost').html(AppConfig.unit_currency + ' ' + _this.getThousandsBit(parseFloat(numCostThisYear).toFixed(0)));
            }


            numEleLastYear = parseFloat(parseFloat(numEleLastYear).toFixed(2));
            numEleThisYear = parseFloat(parseFloat(numEleThisYear).toFixed(2));
            var yearNum;
            //if(numEleThisYear>=1000){
            //    yearNum = parseFloat(numEleThisYear/1000).toFixed(0)+' MWh'
            //}else{
            yearNum = _this.getThousandsBit(parseFloat(numEleThisYear).toFixed(0)) + ' ' + AppConfig.energyUnit.name;//CONSTANT.energy.type[Number(_this.selectEnergyId)].unit.name;//' kWh'
            //}
            $('#yearEnergyChat').html(yearNum);
            var $arrorDisplyYear = $('.arrorDisplyYear');
            $arrorDisplyYear.removeClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-up');
            if (numEleThisYear >= numEleLastYear) {
                $arrorDisplyYear.addClass('glyphicon-arrow-up');
            } else {
                $arrorDisplyYear.addClass('glyphicon-arrow-down');
            }
            //var onPerent; //= nowYear==lastYear?0:(nowYear/lastYear*100).toFixed(2);
            $arrorDisplyYear.show()
            $compareAnYear.show()
            if (numEleLastYear == numEleThisYear) {
                onYearPerent = 0;
            } else {
                if (numEleLastYear == 0) {
                    onYearPerent = '--';
                    $arrorDisplyYear.hide()
                    $compareAnYear.hide()
                } else {
                    onYearPerent = 100 - (numEleThisYear / numEleLastYear * 100).toFixed(0)
                }
            }
            if (typeof onYearPerent == "number") {
                $compareAnYear.html(Math.abs(onYearPerent) + '%')
            } else {
                $compareAnYear.html(onYearPerent + '%')
            }
        })).always(() => {
            //var templateToday = new StringBuilder();
            //templateToday.append('<div class="tooltip" role="tooltip" style="position: absolute;">');
            //templateToday.append('<div class="tooltipTitle tooltip-inner" style="display:none"></div>');
            //templateToday.append('<div class="tooltipContent"><div class="tooltipModal"><span>').append(I18n.resource.energyManagement.overview.COMPARISON_LAST_YEAR).append('</span>  <span class="arrorDisplyYear glyphicon glyphicon-arrow-down"></span><span id="compareAnYear">').append(onYearPerent).append('</span></div></div>');
            //templateToday.append('<div class="tooltip-arrow"></div>');
            //templateToday.append('</div>');
            //var options = {
            //    placement: 'auto',
            //    title: 'compare',
            //    template: templateToday.toString()
            //};
            //$('.yearEnergyTool').tooltip(options);
        })
        // WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postUpYear).done(rsDataUpY => {
        //     var $compareAnYear = $('#compareAnYear');
        //     if(rsDataUpY&&rsDataUpY.list.length>0){
        //         for(var i = 0;i<rsDataUpY.list.length;i++){
        //             if(i ==0){
        //                 var item = rsDataUpY.list[i].data;
        //                 if(item.length!=0){
        //                     var lastYear = 0,nowYear = 0;
        //                     for(var j = 0;j<item.length;j++){
        //                         if(j<=11){
        //                             lastYear+=item[j];
        //                         }else{
        //                             nowYear+=item[j];
        //                         }
        //                     }
        //                     lastYear = parseFloat(parseFloat(lastYear).toFixed(2));
        //                     nowYear = parseFloat(parseFloat(nowYear).toFixed(2));
        //                     var yearNum;
        //                     if(nowYear>=1000){
        //                         yearNum = parseFloat(nowYear/1000).toFixed(0)+' MWh'
        //                     }else{
        //                         yearNum = parseFloat(nowYear).toFixed(0)+' kWh'
        //                     }
        //                     $('#yearEnergyChat').html(yearNum);
        //                     var $arrorDisplyYear  = $('.arrorDisplyYear');
        //                     $arrorDisplyYear.removeClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-up');
        //                     if(nowYear>=lastYear){
        //                         $arrorDisplyYear.addClass('glyphicon-arrow-up');
        //                     }else{
        //                         $arrorDisplyYear.addClass('glyphicon-arrow-down');
        //                     }
        //                     var onPerent; //= nowYear==lastYear?0:(nowYear/lastYear*100).toFixed(2);
        //                     if(nowYear==lastYear){
        //                         onPerent = 0;
        //                     }else{
        //                         if(lastYear==0){
        //                             onPerent = 100
        //                         }else{
        //                             onPerent = (nowYear/lastYear*100).toFixed(0)
        //                         }
        //                     }
        //                     $compareAnYear.html(onPerent+'%')
        //                 }
        //             }else{
        //                 var item = rsDataUpY.list[i].data;
        //                 if(item.length!=0){
        //                     var nowYear = 0;
        //                     for(var j = 0;j<item.length;j++){
        //                         if(j>11){
        //                             nowYear+=item[j];
        //                         }
        //                     }
        //                     $('#yearEnergyCost').html('$'+_this.getThousandsBit(parseFloat(nowYear).toFixed(0)));
        //                 }
        //             }
        //         }
        //     }else{
        //         //infoBox.alert('no data')
        //     }
        // })
    };
    //获取千分位
    getThousandsBit(num) {　　
        var re = /\d{1,3}(?=(\d{3})+$)/g;　　
        var n1 = num.toString().replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
            return s1.replace(re, "$&,") + s2;
        });　　
        return n1;
    }
    // renderEnergyStati(){
    //     var itemizePoints = [];
    //     var itemizePointsName = [];
    //     var detailArr ;
    //     try{
    //         detailArr = this.opt.tree.getChildNode();
    //         if(this.node){
    //             if(this.node[0]&&!this.node[0].isParent){
    //                 detailArr = this.node[0].getParentNode().children;
    //             }
    //         }
    //     }catch(e){
    //         detailArr = undefined;
    //     }
    //     if(!detailArr){
    //         infoBox.alert('no data');
    //         return;
    //     };
    //     var entityId = [];
    //     for(var i = 0;i<detailArr.length;i++){
    //         if(i<5){//新需求后面可能需要修改  右上角不管子节点多少只显示5个，多的不显示
    //            detailArr[i].id && entityId.push(detailArr[i].id);
    //             itemizePointsName.push(detailArr[i].name);
    //         }
    //         this.itemizePointsName=itemizePointsName;
    //     }
    //     if(entityId.length==0){
    //         alert('no point');
    //         return;
    //     }
    //     WebAPI.post('/energy/getConfigInfo',{
    //         // projectId:293,//AppConfig.projectId
    //         projectId:AppConfig.projectId,
    //         entityId:entityId
    //     }).done((configInfo)=>{
    //         if(configInfo&&configInfo.data){
    //             for(var i = 0;i<configInfo.data.length;i++){
    //                 itemizePoints.push(configInfo.data[i].energy);
    //             }
    //             var isExist = false;
    //             for(var item of itemizePoints){
    //                 if(item){
    //                   isExist = true;
    //                 }
    //             }
    //             if(!isExist){
    //                 alert('no point!');
    //                 return;
    //             }
    //             var endTime = this.timeConfig;
    //             var focusTime = toDate(endTime)
    //             var focusTime_clone = toDate(endTime);
    //             this.itemizePoints=itemizePoints;
    //             var postData = {
    //                 dsItemIds: itemizePoints,
    //                 timeStart: toDate(+focusTime_clone - 86400000).format('yyyy-MM-dd 00:00:00'),
    //                 timeEnd: toDate(focusTime).format('yyyy-MM-dd HH:mm:ss'),
    //                 timeFormat: 'd1'
    //             }
    //             Spinner.spin(this.container[0]);
    //             WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment',postData).done(resultDate => {
    //                 if(resultDate&&Object.prototype.toString.call(resultDate)!='[object Object]'){
    //                     Spinner.stop();
    //                      return;
    //                 }
    //                 if(resultDate&&resultDate.list.length>0){
    //                     var yearData = [];
    //                     var yearDateArr = [];
    //                     for(var i = 0;i<resultDate.list.length;i++){
    //                         var item = resultDate.list[i];
    //                         var currentData = 0;
    //                         for(var j = 0;j<item.data.length;j++){
    //                             currentData+=item.data[j];
    //                         }
    //                         yearData.push(currentData);
    //                         yearDateArr.push({
    //                             name:itemizePointsName[i],
    //                             data:currentData
    //                         })
    //                     }
    //                     this.renderPie(itemizePointsName,yearData);
    //                     this.renderItemizeBar(yearDateArr)
    //                 }
    //                 Spinner.stop();
    //             });
    //         }
    //     });
    // };

    renderEnergyStati() {
        var itemizePoints = [];
        var itemizePointsName = [];
        // var detailArr ;
        // try{
        //     detailArr = this.opt.tree.getChildNode();
        //     if(this.node){
        //         if(this.node[0]&&!this.node[0].isParent){
        //             detailArr = this.node[0].getParentNode().children;
        //         }
        //     }
        // }catch(e){
        //     detailArr = undefined;
        // }
        // if(!detailArr){
        //     infoBox.alert('no data');
        //     return;
        // };
        // var entityId = [];
        // for(var i = 0;i<detailArr.length;i++){
        //     if(i<5){//新需求后面可能需要修改  右上角不管子节点多少只显示5个，多的不显示
        //        detailArr[i].id && entityId.push(detailArr[i].id);
        //         itemizePointsName.push(detailArr[i].name);
        //     }
        //     this.itemizePointsName=itemizePointsName;
        // }
        // if(entityId.length==0){
        //     alert('no point');
        //     return;
        // }
        var items = this.node.children
        for (var i = 0; i < items.length; i++) {
            itemizePointsName.push(items[i].name)
            itemizePoints.push(items[i].energy);
        }
        this.itemizePointsName = itemizePointsName;
        var isExist = false;
        for (var item of itemizePoints) {
            if (item) {
                isExist = true;
            }
        }
        if (!isExist) {
            alert('no point!');
            return;
        }
        var endTime = this.timeConfig;
        var focusTime = toDate(endTime)
        var focusTime_clone = toDate(endTime);
        this.itemizePoints = itemizePoints;
        var postData = {
            dsItemIds: itemizePoints,
            timeStart: toDate(+focusTime_clone).format('yyyy-MM-dd 00:00:00'),
            timeEnd: toDate(+focusTime + 86400000).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'd1'
        }
        Spinner.spin($('.energyStatisContent')[0]);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', postData).done(resultDate => {
            if (resultDate && Object.prototype.toString.call(resultDate) != '[object Object]') {
                Spinner.stop();
                return;
            }
            if (resultDate && resultDate.list.length > 0) {
                var yearData = [];
                var yearDateArr = [];
                for (var i = 0; i < resultDate.list.length; i++) {
                    var item = resultDate.list[i];
                    var currentData = 0;
                    for (var j = 0; j < item.data.length; j++) {
                        currentData += item.data[j];
                    }
                    yearData.push(currentData);
                    yearDateArr.push({
                        name: itemizePointsName[i],
                        data: currentData,
                        index:i
                    })
                }
                this.renderPie(itemizePointsName, yearData);
                this.renderItemizeBar(yearDateArr)
            }
            Spinner.stop();
        });
    };
    renderElectricity() {
        var point = this.node.energy;
        //逐时
        var hourlyTimIptVal = $('#hourlyTimIpt').val();
        var startTime = toDate(hourlyTimIptVal).format('yyyy-MM-dd 00:00:00');
        var endTime = hourlyTimIptVal.split('-')[2] == toDate().getDate() ? toDate().format('yyyy-MM-dd HH:mm:ss') : toDate(hourlyTimIptVal).format('yyyy-MM-dd 23:59:59');
        var postData = {
            dsItemIds: [point],
            timeStart: startTime,
            timeEnd: endTime,
            timeFormat: 'h1'
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(rsDataHo => {})
    };
    renderPie(itemizePointsName, yearData) {
        var seriesData = [];
        if (!itemizePointsName) return;
        for (var i = 0; i < itemizePointsName.length; i++) {
            seriesData.push({
                value: parseFloat(yearData[i]).toFixed(2),
                name: itemizePointsName[i]
            })
        }
        var option = {
            color:['#FFD428','#71D360','#55CADC','#45ABFF','#7094EC','#FFD428','#71D360','#55CADC','#45ABFF','#7094EC'],
            title: {
                // text: I18n.resource.energyManagement.overview.SUB_ENERGY,
                show: false
            },
            tooltip: {
                trigger: 'item',
                formatter: function () {
                    var value = arguments[0];
                    return value.percent + '%<br/>' + value.name + ': ' + value.value + AppConfig.energyUnit.name
                }
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: itemizePointsName,
                top: 'middle',
                left: '58%',
                icon: 'circle',
                itemHeight: '9',
                textStyle: {
                    fontSize: 12,
                    color: '#5C6777'
                }
            },
            series: [{
                // name:I18n.resource.energyManagement.overview.SUB_ENERGY,
                type: 'pie',
                radius: ['35%', '53%'],
                avoidLabelOverlap: false,
                center: ['30%', '50%'],
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: seriesData
            }]
        }
        var echart = echarts.init($('.energyItemize')[0], this.chartTheme);
        echart.setOption(option);
    };
    renderItemizeBar(yearDateArr) {
        if (!yearDateArr) return;
        var yData = [];
        var arrName = [];
        yearDateArr.sort(function (a, b) {
            return a.data - b.data
        });
        var itemizePointsName = [],
            yearData = [];
        for (var i = 0; i < yearDateArr.length; i++) {
            itemizePointsName.push(yearDateArr[i].name);
            yearData.push(parseFloat(yearDateArr[i].data).toFixed(2));
        }
        for (var i = 0; i < itemizePointsName.length; i++) {
            var item = itemizePointsName[i];
            arrName.push(item)
            if (item.length > 8) {
                yData.push(item.slice(0, 9) + '...');
            } else {
                yData.push(item)
            }
        }
        //var seriesArr = [];
        //for(var i = 0;i<yearData.length;i++){
        //    seriesArr.push({
        //            name: I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION,
        //            type: 'bar',
        //            barWidth:parseFloat(100/yearData.length).toFixed(0)+'%',
        //            data: [yearData[i]]
        //        })
        //}
        var option = {
            title: {
                show: false,
                text: I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: "{a} <br/>{b}: {c}" + AppConfig.energyUnit.name
            },
            legend: {
                show: false,
                data: [I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION]
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                "axisLine": {
                    "show": true,
                    lineStyle: {
                        color: '#a7b1c0'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#a7b1c0'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#5C6777'
                    }
                }
            },
            yAxis: {
                type: 'category',
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    textStyle: {
                        color: '#5C6777'
                    }
                },
                data: yData //[I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION]
            },
            series: //seriesArr
                [{
                    name: I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION,
                    type: 'bar',
                    barWidth: 22, //parseFloat(100/yearData.length).toFixed(0)+'%' yearData.length > 6 ? '18%' : '25%'
                    itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    // var colorList = ['#7094EC','#45ABFF','#55CADC','#71D360','#FFD428'];
                                    var colorList = ['#FFD428','#71D360','#55CADC','#45ABFF','#7094EC','#FFD428','#71D360','#55CADC','#45ABFF','#7094EC'];
                                    return colorList[yearDateArr[params.dataIndex].index % colorList.length]
                                }
                            }
                        },                    
                    data: yearData
                }]
        };

        // var series = yearData.map(function(item,index){
        //     return                 {
        //             name: item,
        //             type: 'bar',
        //             // barWidth:parseFloat(100/yearData.length).toFixed(0)+'%',
        //             data: [item]
        //         }
        // })
        // var option = {
        //     title: {
        //         show:false,
        //         text: I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION
        //     },
        //     tooltip: {
        //         trigger: 'axis',
        //         axisPointer: {
        //             type: 'shadow'
        //         }
        //     },
        //     legend: {
        //         show:false,
        //         data: arrName
        //     },
        //     grid: {
        //         left: '3%',
        //         right: '4%',
        //         bottom: '3%',
        //         top:'15%',
        //         containLabel: true
        //     },
        //     xAxis: {
        //         type: 'value',
        //         "axisLine":{
        //             "show":true,
        //             lineStyle:{
        //                 color:'#eceeef'
        //             }
        //         }
        //     },
        //     yAxis: {
        //         type: 'category',
        //         axisLine:{
        //             show:false,
        //         },
        //         data: yData//[I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION]
        //     },
        //     series: series
        // };
        var echarter = echarts.init($('.energyContrast')[0], this.chartTheme);
        echarter.setOption(option);
    }
    //     initEnergyModule(options) {
    //         var _this = this; 
    //         var pointEnergyId = this.nodesInfo?this.nodesInfo.config.energy:this.opt.store[0].config.energy;
    // /*        var postDayData = {
    //             dsItemIds: [pointEnergyId],
    //             timeEnd: toDate().format('yyyy-MM-dd HH:mm:ss'),
    //             timeFormat: "h1",
    //             timeStart: toDate().format('yyyy-MM-dd 00:00:00')
    //         }*/
    //         var postDayData = {
    //             dsItemIds: [pointEnergyId],
    //             timeEnd: options.endTime,
    //             timeFormat: options.timeformat,
    //             timeStart: options.startTime
    //         }        
    //         WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postDayData).done(function (result) {            
    //             if(!result) return;
    //             options.seriesArr[0].data = result.list[0].data;
    //             _this.renderStackArea(result.timeShaft,options.seriesArr,options.lengendArr,options.dom);           
    //         });        
    //     }
    renderStackArea(xAxisData, seriesArr, lengendArr, dom, colorObj) {
        var _this = this;
        var lineColor, areaColor;
        var dataSeries = $.extend([], seriesArr[0].data);
        var yseriesMin = 0;
        dataSeries.sort(function (a, b) {
            return a - b
        });
        yseriesMin = (parseFloat(dataSeries[0]) * 0.8).toFixed(0);

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
                color: 'rgba(134,169,246,1)'
            }, {
                offset: 1,
                color: 'rgba(94,219,237,1)'
            }],
            markPoint: [{
                offset: 0,
                color: '#ffd843'
            }, {
                offset: 1,
                color: '#70d35f'
            }]
        }
        var colors = [];
        if (colorObj == 'day') {
            lineColor = this.echartGradientList.monthLine;
            areaColor = this.echartGradientList.monthArea;
            for (var i = 0; i < xAxisData.length; i++) {
                colors.push(new echarts.graphic.LinearGradient(0, 0, 0, 1, lineColor, false))
            }
        } else if (colorObj == 'month') {
            lineColor = this.echartGradientList.yearLine;
            areaColor = this.echartGradientList.yearArea;
            for (var i = 0, len = xAxisData.length; i < len; i++) {
                if (len - i < 4 && AppConfig.projectId == 575) { //575项目才添加区分
                    colors.push('#23E5FF')
                } else {
                    colors.push(new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#5EDBED'
                    }, {
                        offset: 1,
                        color: '#7DA2F5'
                    }], false))
                }
            }
        } else {
            lineColor = this.echartGradientList.yearLine;
            areaColor = this.echartGradientList.yearArea;
            for (var i = 0; i < xAxisData.length; i++) {
                if (i == xAxisData.length - 1 && AppConfig.projectId == 575) { //575项目才添加区分
                    colors.push('#23E5FF')
                } else {
                    colors.push(new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#5EDBED'
                    }, {
                        offset: 1,
                        color: '#7DA2F5'
                    }], false))
                }
            }
        }
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow' //,
                    //lineStyle:{
                    //    color:new echarts.graphic.LinearGradient(0, 0, 0, 1,lineColor , false)
                    //}
                },
                formatter: function (params) {
                    var str = '';
                    if (params[0]){
                        var seriesNameOne = params[0].seriesName;
                        var dataOne = _this.getThousandsBit(params[0].data);
                        var colorOne = params[0].color.colorStops ? params[0].color.colorStops[0].color : params[0].color;
                        str += params[0].name + '</br>' + '<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:' + colorOne + '"></span>' + ' ' + seriesNameOne + ': ' + dataOne
                    }
                    if(params[1]){
                        var seriesNameTwo = params[1].seriesName;
                        var dataTwo = _this.getThousandsBit(params[1].data);
                        str += '</br>' + '<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:rgb(246,174,165)"></span>' + ' ' + seriesNameTwo + ': ' + dataTwo + '</br>';
                    }
                    return  str;

                }
            },
            legend: {
                data: lengendArr,
                show: false
            },
            toolbox: {},
            grid: {
                left: '1%',
                right: '3%',
                bottom: '3%',
                top: 45,
                containLabel: true
            },
            //lineStyle: {
            //    normal: {
            //        width: 3,
            //        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,lineColor , false),
            //        shadowColor: 'rgba(0,0,0,0.4)',
            //        shadowBlur: 15,
            //        shadowOffsetY: 10
            //    }
            //},
            //areaStyle: {
            //    normal: {
            //        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,areaColor , false)
            //    }
            //},
            itemStyle: {
                normal: {
                    width: 3, // //new echarts.graphic.LinearGradient(0, 0, 0, 1,lineColor , false)
                    color: function (params) {
                        return colors[params.dataIndex]
                    }
                }
            },
            axisLabel: {
                formatter: function (value) {
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
                        color: '#a7b1c0'
                    }
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    // min: yseriesMin, //'dataMin',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#a7b1c0'
                        }
                    }
                },
                {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    // min:yseriesMin,//'dataMin',
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#a7b1c0'
                        }
                    }
                }
            ],
            series: seriesArr
        };
        var chart = echarts.init(dom, this.chartTheme); //,this.opt.chartTheme
        chart.setOption(option);
        chart.on('click', (params) => {
            if (params.componentType == 'markPoint') {
                if (!this.energyAnalysis) {
                    this.energyAnalysis = new EnergyAnalysis(this.opt);
                    $('.wrapNavToggle').find('[data-module|=analysis]').click()
                    // this.energyAnalysis.show();
                } else {
                    this.energyAnalysis.destory();
                }
            }
        })
    };
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
        // if(colorObj=='day'){
        //     lineColor = this.echartGradientList.dayLine;
        //     areaColor = this.echartGradientList.dayArea;
        // }else if(colorObj=='month'){
        lineColor = this.echartGradientList.monthLine;
        areaColor = this.echartGradientList.monthArea;
        // }else{
        //     lineColor = this.echartGradientList.yearLine;
        //     areaColor = this.echartGradientList.yearArea;
        // }
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, lineColor, false)
                    }
                },
                formatter: function (params) {
                    var str = '';
                    if(params[0]){
                        var dayOne = timeArr[params[0].seriesIndex][params[0].dataIndex].substring(5, 10);
                        var seriesNameOne = params[0].seriesName;
                        var dataOne = _this.getThousandsBit(params[0].data);
                        str += params[0].name + '</br>' + '<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:' + params[0].color.colorStops[0].color + '"></span>' + dayOne + ' ' + seriesNameOne + ': ' + dataOne;
                    }
                    if(params[1]){
                        var dayTwo = timeArr[params[1].seriesIndex][params[1].dataIndex].substring(5, 10);
                        var seriesNameTwo = params[1].seriesName;var dataTwo = _this.getThousandsBit(params[1].data);
                        str += '</br>' + '<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:rgb(246,174,165)"></span>' + dayTwo + ' ' + seriesNameTwo + ': ' + dataTwo + '</br>';
                    }
                    return  str;
                    
                    // return params[0].name + '</br>' + '<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:' + params[0].color.colorStops[0].color + '"></span>' + dayOne + ' ' + seriesNameOne + ': ' + dataOne + '</br>' + '<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:' + params[1].color.colorStops[0].color + '"></span>' + dayTwo + ' ' + seriesNameTwo + ': ' + dataTwo + '</br>' + '<span style="display:inline-block;width:12px;height:12px; margin-right:5px;background:rgb(246,174,165)"></span>' + dayThree + ' ' + seriesNameThree + ': ' + dataThree + '</br>'
                }
            },
            legend: {
                data: lengendArr,
                show: false
            },
            toolbox: {},
            grid: {
                left: '2%',
                right: '4%',
                bottom: '3%',
                top: 45,
                containLabel: true
            },

            lineStyle: {
                normal: {
                    width: 3,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, lineColor, false),
                    shadowColor: 'rgba(0,0,0,0.4)',
                    shadowBlur: 15,
                    shadowOffsetY: 10
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor, false)
                }
            },
            itemStyle: {
                normal: {
                    width: 3,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, lineColor, false)
                }
            },
            axisLabel: {
                formatter: function (value) {
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
                        color: '#a7b1c0'
                    }
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    // min: 'dataMin',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#a7b1c0'
                        }
                    }
                },
                {
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#a7b1c0'
                        }
                    }
                }
            ],
            series: seriesArr
        };
        var chart = echarts.init(dom, this.chartTheme); //,this.opt.chartTheme
        chart.setOption(option);
    };
    attEvent() {
        $('#hourlyTimIpt').off('change').on('change', (e) => {
            this.setHourlyHistoryChart();
        });
        $('#dailyTimIpt').off('change').on('change', (e) => {
            this.setDailyHistoryChart();
        })
        $('#monthlyTimIpt').off('change').on('change', (e) => {
            this.setMonthlyHistoryChart();
        })
        //$('.energyStatisTitle .btnQuery').off('click').on('click',(e)=>{
        //    switch (e.currentTarget.dataset.target){
        //        case 'hourly':
        //            this.setHourlyHistoryChart();
        //            break;
        //        case 'daily':
        //            this.setDailyHistoryChart();
        //            break;
        //        case 'monthly':
        //            this.setMonthlyHistoryChart();
        //            break;
        //        default:
        //            break;
        //    }
        //})
        var _this = this;
        $('.energyStatistic .statisTime .btn').off('click').on('click', function () {
            $(this).addClass('statisticBtnActive')
            $(this).siblings().removeClass('statisticBtnActive')
            var searchTime = $(this).attr('data-time');
            var searchTime = $(this).attr('data-time');
            var stamp;
            var endTime = _this.timeConfig;
            var focusTime = toDate(endTime)
            var focusTime_clone = toDate(endTime);
            searchTime === 'day' ? stamp = 86400000*0 : searchTime === 'week' ? stamp = 86400000 * 6 : stamp = 86400000 * 29;
            var postData = {
                dsItemIds: _this.itemizePoints,
                timeStart: toDate(+focusTime_clone - stamp).format('yyyy-MM-dd 00:00:00'),
                timeEnd: toDate(+focusTime +86400000).format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: 'd1'
            }
            Spinner.spin($('.energyStatisContent')[0]);
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', postData).done(resultDate => {
                if (resultDate && Object.prototype.toString.call(resultDate) != '[object Object]') {
                    Spinner.stop();
                    return;
                }
                if (resultDate && resultDate.list.length > 0) {
                    var yearData = [];
                    var yearDateArr = [];
                    for (var i = 0; i < resultDate.list.length; i++) {
                        var item = resultDate.list[i];
                        var currentData = 0;
                        for (var j = 0; j < item.data.length; j++) {
                            currentData += item.data[j];
                        }
                        yearData.push(currentData);
                        yearDateArr.push({
                            name: _this.itemizePointsName[i],
                            data: currentData,
                            index:i
                        })
                    }
                    _this.renderPie(_this.itemizePointsName, yearData);
                    _this.renderItemizeBar(yearDateArr)
                }
                Spinner.stop();
            });
        })
        $('.energyStatisTitle .statisTime .btnQuery').off('click').on('click', function () {
            $('#dialogModal').modal('show');
           
            _this.util_date(); //初始化获取周一、周日函数
            var sort = $(this).attr('data-target');
            $('#dialogModal').off('shown.bs.modal').on('shown.bs.modal', function (e) {
                _this.setModal(sort);
              })
        })
    };
    // 设置modal显示内容
    setModal(sort) {
        var dataTimeArr;
        var _this = this;
        var group = document.querySelector('#dialogModal .btn-group');
        $('#intervalType').empty();
        if (sort == "hourly") {
            dataTimeArr = ['today', 'yesterday', 'week'];
            $('#myModalLabel')[0].setAttribute('i18n', 'energyManagement.overview.HOURLY_ENERGY')
            $('#intervalType').append('<option value="h1">1hour</option>');
            $('#curveDateStart').val(toDate(_this.timeConfig).format('yyyy-MM-dd 00:00')).datetimepicker('remove').datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true,
                minView: 1,
                startView: 2,
                startDate: toDate(+toDate() - 86400000 * 30).format('yyyy-MM-dd 00:00'),
                endDate: toDate().format('yyyy-MM-dd 23:00')
            });
            $('#curveDateEnd').val(toDate(_this.timeConfig).format('yyyy-MM-dd 23:59')).datetimepicker('remove').datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true,
                minView: 1,
                startView: 2,
                startDate: toDate(+toDate() - 86400000 * 30).format('yyyy-MM-dd 00:00'),
                endDate: toDate().format('yyyy-MM-dd 23:00')
            });
        } else if (sort == "daily") {
            dataTimeArr = ['week', 'last_week', 'month', 'last_month'];
            $('#myModalLabel')[0].setAttribute('i18n', 'energyManagement.overview.DAILY_ENERGY')
            $('#intervalType').append('<option value="d1">1day</option>');
            $('#curveDateStart').val(toDate(_this.timeConfig).format('yyyy-MM-01')).datetimepicker('remove').datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                minView: 2,
                startView: 2,
                startDate: toDate(+toDate() - 86400000 * 30 * 2).format('yyyy-MM-dd'),
                endDate: toDate().format('yyyy-MM-' + DateUtil.daysInMonth(toDate(_this.timeConfig)))
            });
            $('#curveDateEnd').val(toDate(_this.timeConfig).format('yyyy-MM-' + DateUtil.daysInMonth(toDate(_this.timeConfig)))).datetimepicker('remove').datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                minView: 2,
                startView: 2,
                startDate: toDate(+toDate() - 86400000 * 30 * 2).format('yyyy-MM-dd '),
                endDate: toDate().format('yyyy-MM-' + DateUtil.daysInMonth(toDate(_this.timeConfig)))
            });

        } else if (sort == "monthly") {
            dataTimeArr = ['year', 'last_year'];
            $('#myModalLabel')[0].setAttribute('i18n', 'energyManagement.overview.MONTH_ENERGY')
            $('#intervalType').append('<option value="M1">1month</option>');
            $('#curveDateStart').val(toDate(_this.timeConfig).format('yyyy')).datetimepicker('remove').datetimepicker({
                format: 'yyyy',
                autoclose: true,
                minView: 4,
                startView: 4,
                startDate: toDate(+toDate() - 86400000 * 30 * 24).format('yyyy'),
                endDate: toDate().format('yyyy-MM-dd HH:00')
            });
            $('#curveDateEnd').val(toDate(_this.timeConfig).format('yyyy')).datetimepicker('remove').datetimepicker({
                format: 'yyyy',
                autoclose: true,
                minView: 4,
                startView: 4,
                startDate: toDate(+toDate() - 86400000 * 30 * 24).format('yyyy-MM-dd 00:00'),
                endDate: toDate().format('yyyy-MM-dd HH:00')
            });
        }
        $(group).empty();
        $('#tableOperatingRecord').empty().removeAttr('_echarts_instance_');
        dataTimeArr.forEach(item => {
            _this.createModalButton(item);
        });
        I18n.fillArea($('#dialogContent'));
        _this.setEchartData(sort);
        
        //确定键
        $('#filterCurveConfirm').off('click').on('click', function () {
            _this.setEchartData(sort);
        })
        //按钮组
        $('#dialogContent .btn-group .btn').off('click').on('click', function () {
            var datetype = $(this).attr('datetype');
            _this.searchBtnTime(sort, datetype);
        })

    }
    //按钮查询事件
    searchBtnTime(sort, datetype) {
        var time;
        var timeBefore;
        if (sort == "hourly") {
            time = this.returnTime(sort, datetype).time;
            timeBefore = this.returnTime(sort, datetype).timeBefore;
            time.endTime = toDate(toDate(time.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss');
            timeBefore.endTime = toDate(toDate(timeBefore.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss');
            this.setHourlyEchartData(time, timeBefore);
        } else if (sort == "daily") {
            time = this.returnTime(sort, datetype).time;
            time.endTime = toDate(toDate(time.endTime).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
            this.setDailyEchartData(time)
        } else if (sort == "monthly") {
            time = this.returnTime(sort, datetype).time;
            this.setMonthEchartData(time)
        }
    }
    //获取周一周日时间
    util_date() { 
        var _today = toDate(this.timeConfig);
        var today = _today;
        var year = _today.getYear() + 1900; //当前年份
            
        var Month_a = _today.getMonth();    
        var Month = Month_a + 1; //当前月份
            
        var day = _today.getDate(); //当前日期
            
        var date = _today.getDay() == 0 ? 7 : _today.getDay(); //本周第几天 因系统会把周日作为第0天
            
        var Monday = "";    
        var Sunday = "";    
        var day_one = "";
        this.util_date.getMonday = function () {        
            if (Monday.length != 0) {          
                return Monday;        
            } else {          
                var _monday = toDate(year, Month_a, day - date + 1);        
                Monday = _monday;          
                return _monday;        
            }      
        };
        this.util_date.getSunday = function () {        
            if (Sunday.length != 0) {          
                return Sunday;        
            } else {          
                var _Sunday = toDate(year, Month_a, day - date + 7);          
                Sunday = _Sunday;          
                return _Sunday;        
            }      
        }
    }
    //获取按钮组时间
    returnTime(sort, datetype) {
        var time;
        var timeBefore;
        var timeArr;
        var _this = this;
        if (sort == "hourly") {
            switch (datetype) {
                case 'today':
                    timeArr = {
                        time: {
                            startTime: toDate(_this.timeConfig).format('yyyy-MM-dd 00:00:00'),
                            endTime: toDate(_this.timeConfig).format('yyyy-MM-dd 23:59:59'),
                            format: 'h1',
                        },
                        timeBefore: {
                            startTime: toDate(+toDate(_this.timeConfig) - 86400000).format('yyyy-MM-dd 00:00:00'),
                            endTime: toDate(+toDate(_this.timeConfig) - 86400000).format('yyyy-MM-dd 23:59:59'),
                            format: 'h1'
                        }
                    }
                    return timeArr
                case 'yesterday':
                    timeArr = {
                        time: {
                            startTime: toDate(+toDate(_this.timeConfig) - 86400000).format('yyyy-MM-dd 00:00:00'),
                            endTime: toDate(+toDate(_this.timeConfig) - 86400000).format('yyyy-MM-dd 23:59:59'),
                            format: 'h1',
                        },
                        timeBefore: {
                            startTime: toDate(+toDate(_this.timeConfig) - 86400000 * 2).format('yyyy-MM-dd 00:00:00'),
                            endTime: toDate(+toDate(_this.timeConfig) - 86400000 * 2).format('yyyy-MM-dd 23:59:59'),
                            format: 'h1'
                        }
                    }
                    return timeArr
                case 'week':
                    timeArr = {
                        time: {
                            startTime: toDate(+toDate(_this.util_date.getMonday())).format('yyyy-MM-dd 00:00:00'),
                            endTime: toDate(+toDate(_this.util_date.getSunday())).format('yyyy-MM-dd 23:59:59'),
                            format: 'h1',
                        },
                        timeBefore: {
                            startTime: toDate(+toDate(_this.util_date.getMonday()) - 86400000 * 7).format('yyyy-MM-dd 00:00:00'),
                            endTime: toDate(+toDate(_this.util_date.getSunday()) - 86400000 * 7).format('yyyy-MM-dd 23:59:59'),
                            format: 'h1',
                        }
                    }
                    return timeArr

                default:
                    return
            }
        } else if (sort == "daily") {
            switch (datetype) {
                case 'week':
                    timeArr = {
                        time: {
                            startTime: toDate(+toDate(_this.util_date.getMonday())).format('yyyy-MM-dd 00:00:00'),
                            endTime: toDate(+toDate(_this.util_date.getSunday())).format('yyyy-MM-dd 23:59:59'),
                            format: 'd1',
                        },
                    }
                    return timeArr

                case 'last_week':
                    timeArr = {
                        time: {
                            startTime: toDate(+toDate(_this.util_date.getMonday()) - 86400000 * 7).format('yyyy-MM-dd 00:00:00'),
                            endTime: toDate(+toDate(_this.util_date.getSunday()) - 86400000 * 7).format('yyyy-MM-dd 23:59:59'),
                            format: 'd1',
                        },
                    }
                    return timeArr
                case 'month':
                    DateUtil.daysInMonth(toDate(_this.timeConfig))
                    timeArr = {
                        time: {
                            startTime: toDate(+toDate(_this.timeConfig)).format('yyyy-MM-01 00:00:00'),
                            endTime: toDate(toDate(_this.timeConfig).format('yyyy-MM-' + DateUtil.daysInMonth(toDate(_this.timeConfig)))).format('yyyy-MM-dd 23:59:59'),
                            format: 'd1',
                        },
                    }
                    return timeArr
                case 'last_month':
                    var dateNew = toDate(_this.timeConfig);
                    dateNew.setMonth(dateNew.getMonth() - 1);
                    var nowdays = toDate(this.timeConfig);
                    var year = nowdays.getFullYear();
                    var month = nowdays.getMonth();
                    if(month==0)
                    {
                        month=12;
                        year=year-1;
                    }
                    if (month < 10) {
                        month = "0" + month;
                    }
                    var firstDay = year + "-" + month + "-" + "01";//上个月的第一天
                    var myDate = toDate(year, month, 0);
                    var lastDay = year + "-" + month + "-" + myDate.format('dd');//上个月的最后一天
                    timeArr = {
                        time: {
                            startTime: toDate(+toDate(firstDay)).format('yyyy-MM-01 00:00:00'),
                            endTime: toDate(lastDay).format('yyyy-MM-dd 23:59:59'),
                            format: 'd1',
                        },
                    }
                    return timeArr
                default:
                    return
            }
        } else if (sort == "monthly") {
            switch (datetype) {
                case 'year':
                    var dateNext = toDate(_this.timeConfig);
                    dateNext.setYear(dateNext.getFullYear() + 1);
                    timeArr = {
                        time: {
                            startTime: toDate(+toDate(_this.timeConfig)).format('yyyy-01-01 00:00:00'),
                            endTime: toDate(toDate(dateNext)).format('yyyy-01-01 00:00:00'),
                            format: 'M1',
                        },
                    }
                    return timeArr
                case 'last_year':
                    var dateNew = toDate(_this.timeConfig);
                    var dateNext = toDate(_this.timeConfig);
                    dateNew.setYear(dateNew.getFullYear() - 1);
                    dateNext.setYear(dateNext.getFullYear());
                    timeArr = {
                        time: {
                            startTime: toDate(+toDate(dateNew)).format('yyyy-01-01 00:00:00'),
                            endTime: toDate(+toDate(dateNext)).format('yyyy-01-01 00:00:00'),
                            format: 'M1',
                        },
                    }
                    return timeArr
                default:
                    return
            }
        }
    }
    //设置modal数据
    setEchartData(sort) {
        var time;
        var timeBefore;
        if (sort == "hourly") {
            time = {
                startTime: toDate($('#curveDateStart').val()).format('yyyy-MM-dd HH:00:00'),
                endTime: toDate($('#curveDateEnd').val()).format('yyyy-MM-dd HH:00:00'),
                format: 'h1',
            };
            timeBefore = {
                startTime: toDate(+toDate($('#curveDateStart').val()) - 86400000).format('yyyy-MM-dd HH:00:00'),
                endTime: toDate(+toDate($('#curveDateEnd').val()) - 86400000).format('yyyy-MM-dd HH:00:00'),
                format: 'h1'
            }
            time.endTime = toDate(toDate(time.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss');
            timeBefore.endTime = toDate(toDate(timeBefore.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss');
            this.setHourlyEchartData(time, timeBefore);
        } else if (sort == "daily") {
            time = {
                startTime: toDate($('#curveDateStart').val()).format('yyyy-MM-dd HH:00:00'),
                endTime: toDate($('#curveDateEnd').val()).format('yyyy-MM-dd HH:00:00'),
                format: 'd1',
            };
            time.endTime = toDate(toDate(time.endTime).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
            this.setDailyEchartData(time)
        } else if (sort == "monthly") {
            time = {
                startTime: $('#curveDateStart').val() + '-01-01 00:00:00',
                endTime: parseInt($('#curveDateEnd').val()) + 1 + '-01-01 00:00:00',
                format: 'M1'
            }
            this.setMonthEchartData(time)
        }
    }
    //逐时
    setHourlyEchartData(time, timeBefore) {
        var container = $('#tableOperatingRecord')[0];
        var SpinnerLine = new LoadingSpinner({
            color: '#00FFFF'
        });
        SpinnerLine.spin($('#tableOperatingRecord')[0]);
        var timeArr = [];
        var timeArrs = [];
        var series = []
        var seriesCost = [];
        var legend = [I18n.resource.energyManagement.overview.HOURLY_ENERGY];
        this.getStackData(time).done(result => {
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            timeArr.push(timeShaft);
            timeArr.push(timeShaft);
            series.push({
                name: I18n.resource.energyManagement.overview.HOURLY_ENERGY,
                type: 'bar',
                stack: '逐时用电',
                smooth: true,
                symbolSize: 0,
                itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(94,219,237,1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(134,169,246,1)'
                                    }], false)
                                }
                            },
                // itemStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: 'rgba(112,211,95,0.5)'
                //         }, {
                //             offset: 1,
                //             color: 'rgba(112,211,95,1)'
                //         }], false)
                //     }
                // },
                data: result.list[0].data.map(function (ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })
            series.push({
                name: I18n.resource.energyManagement.overview.HOURLY_COST,
                type: 'line',
                yAxisIndex: 1,
                stack: '逐时用电费',
                smooth: true,
                symbolSize: 0,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, this.echartGradientList.dayArea, false),
                        opacity: 0
                    }
                },
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(250,128,114,0.9)'
                        }, {
                            offset: 1,
                            color: 'rgba(250,128,114,0.5)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        shadowBlur: 15,
                    }
                },
                data: result.list[1].data.map(function (ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })

            this.renderStackAreaLine(timeShaft, series, legend, container, 'day', seriesCost, timeArr)
        }).always(() => {
                SpinnerLine.stop();
            })
        // this.getStackData(timeBefore).done(results => {
        //     var timeArrs = results.timeShaft
        //     timeArrs.pop();
        //     timeArr.push(timeArrs);
        //     var legend = [I18n.resource.energyManagement.overview.HOURLY_ENERGY];
        //     var series = []
        //     var seriesCost = [];
        //     series.push({
        //         name: I18n.resource.energyManagement.overview.HOURLY_ENERGY,
        //         type: 'bar',
        //         stack: '逐时用电昨日',
        //         smooth: true,
        //         symbolSize: 0,
        //         itemStyle: {
        //             normal: {
        //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                     offset: 0,
        //                     color: 'rgba(94,219,237,1)'
        //                 }, {
        //                     offset: 1,
        //                     color: 'rgba(134,169,246,1)'
        //                 }], false)
        //             }
        //         },
        //         areaStyle: {
        //             normal: {

        //             }
        //         },
        //         data: results.list[0].data.map(function (ele) {
        //             return parseFloat(ele).toFixed(0);
        //         })
        //     });
        //     this.getStackData(time).done(result => {
        //         var timeShaft = result.timeShaft;
        //         timeShaft.pop();
        //         timeArr.push(timeShaft);
        //         timeArr.push(timeShaft);
        //         series.push({
        //             name: I18n.resource.energyManagement.overview.HOURLY_ENERGY,
        //             type: 'bar',
        //             stack: '逐时用电',
        //             smooth: true,
        //             symbolSize: 0,
        //             itemStyle: {
        //                 normal: {
        //                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                         offset: 0,
        //                         color: 'rgba(112,211,95,0.5)'
        //                     }, {
        //                         offset: 1,
        //                         color: 'rgba(112,211,95,1)'
        //                     }], false)
        //                 }
        //             },
        //             data: result.list[0].data.map(function (ele) {
        //                 return parseFloat(ele).toFixed(0);
        //             })
        //         })
        //         series.push({
        //             name: I18n.resource.energyManagement.overview.HOURLY_COST,
        //             type: 'line',
        //             yAxisIndex: 1,
        //             stack: '逐时用电费',
        //             smooth: true,
        //             symbolSize: 0,
        //             areaStyle: {
        //                 normal: {
        //                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, this.echartGradientList.dayArea, false),
        //                     opacity: 0
        //                 }
        //             },
        //             lineStyle: {
        //                 normal: {
        //                     width: 3,
        //                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                         offset: 0,
        //                         color: 'rgba(250,128,114,0.9)'
        //                     }, {
        //                         offset: 1,
        //                         color: 'rgba(250,128,114,0.5)'
        //                     }], false),
        //                     shadowColor: 'rgba(0, 0, 0, 0.4)',
        //                     shadowBlur: 15,
        //                 }
        //             },
        //             data: result.list[1].data.map(function (ele) {
        //                 return parseFloat(ele).toFixed(0);
        //             })
        //         })

        //         this.renderStackAreaLine(timeShaft, series, legend, container, 'day', seriesCost, timeArr)
        //     })
        // }).always(() => {
        //     SpinnerLine.stop();
        // })
    }
    //逐日
    setDailyEchartData(time) {
        var container = $('#tableOperatingRecord')[0];
        var SpinnerDaily = new LoadingSpinner({
            color: '#00FFFF'
        });
        SpinnerDaily.spin(container);
        this.getStackData(time).done(result => {
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            var legend = [I18n.resource.energyManagement.overview.DAILY_ENERGY]
            var series = []
            series.push({
                name: I18n.resource.energyManagement.overview.DAILY_ENERGY,
                type: 'bar',
                stack: '逐日用电',
                temStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#5EDBED'
                        }, {
                            offset: 1,
                            color: '#7DA2F5'
                        }], false)
                    }
                },
                data: result.list[0].data.map(function (ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })
            series.push({
                name: I18n.resource.energyManagement.overview.DAILY_COST,
                yAxisIndex: 1,
                smooth: true,
                type: 'line',
                stack: '逐日用电1',
                symbolSize: 0,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, this.echartGradientList.dayArea, false),
                        opacity: 0
                    }
                },
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(250,128,114,0.9)'
                        }, {
                            offset: 1,
                            color: 'rgba(250,128,114,0.5)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        shadowBlur: 15,
                    }
                },
                data: result.list[1].data.map(function (ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })


            this.renderStackArea(timeShaft, series, legend, container, 'month');
        }).always(() => {
            SpinnerDaily.stop();
        })
    }
    //逐月
    setMonthEchartData(time) {
        var container = $('#tableOperatingRecord')[0];
        var SpinnerYear = new LoadingSpinner({
            color: '#00FFFF'
        });
        SpinnerYear.spin(container);
        this.getStackData(time).done(result => {
            if (result.timeShaft == '') {
                $('#tableOperatingRecord').empty()
                alert(I18n.resource.energyManagement.overview.NO_DATA_TIP);
                return;
            }
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            var legend = [I18n.resource.energyManagement.overview.MONTH_ENERGY]
            var series = []
            series.push({
                name: I18n.resource.energyManagement.overview.MONTH_ENERGY,
                type: 'bar',
                barGap: '50%',
                stack: '逐月用电',
                data: result.list[0].data.map(function (ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })
            series.push({
                name: I18n.resource.energyManagement.overview.MONTH_COST,
                yAxisIndex: 1,
                type: 'line',
                smooth: true,
                symbolSize: 0,
                stack: '逐月用电1',
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(173,216,230,0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(51,152,219,0.3)'
                        }], false),
                        opacity: 0
                    }
                },
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(250,128,114,0.9)'
                        }, {
                            offset: 1,
                            color: 'rgba(250,128,114,0.5)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        shadowBlur: 15,
                    }
                },
                data: result.list[1].data.map(function (ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })
            this.renderStackArea(timeShaft, series, legend, container, 'year')
        }).always(() => {
            SpinnerYear.stop();
        })
    }
    //画按钮
    createModalButton(time) {
        var group = document.querySelector('#dialogModal .btn-group')
        group.appendChild(this.createNavList(time, this.getI18n(time)))
    }
    //按钮国际化
    getI18n(key) {
        switch (key) {
            case 'today':
                return `energyManagement.overview.TODAY`
            case 'yesterday':
                return `energyManagement.overview.YESTERDAY`
            case 'week':
                return `energyManagement.overview.THIS_WEEK`
            case 'last_week':
                return `energyManagement.overview.LAST_WEEK`
            case 'month':
                return `energyManagement.overview.THIS_MONTH`
            case 'last_month':
                return `energyManagement.overview.LAST_MONTH`
            case 'year':
                return `energyManagement.overview.THIS_YEAR`
            case 'last_year':
                return `energyManagement.overview.LAST_YEAR`
            default:
                return
        }
    }
    createNavList(type, i18n) {
        var dom = document.createElement('button');
        dom.className = 'btn btn-default searchCurveOfTime';
        dom.type = 'button';
        dom.setAttribute('dateType', type);
        dom.setAttribute('i18n', i18n);
        return dom;
    }
    // onNodeClick(nodes){
    //     this.nodesInfo = nodes[0].config;
    //     this.node = nodes;
    //     console.log(this.node);
    //     this.init();
    // };
    onTimeChange(time) {
        this.timeConfig = time
        this.initTimeWidget(this.timeConfig);
        this.renderEnergyStati();
        this.energyDayYear();
        this.setHourlyHistoryChart();
        this.setDailyHistoryChart();
        this.setMonthlyHistoryChart();
    };
    close() {
        $('.wrapTagTree').show();
        this.opt = null;
        this.timeConfig = null;
        this.node = null;
        // this.nodesInfo = null;
        this.container = null;
        this.energyAnalysis = null;
    }
}

EnergyOverview.option = {
    needTime: true,
    needTagTree:false
}
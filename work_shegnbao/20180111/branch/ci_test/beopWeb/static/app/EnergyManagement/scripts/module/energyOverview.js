class EnergyOverview{
    constructor(opt){
        this.opt = opt;
        this.timeConfig = opt.timeConfig;
        // this.nodesInfo = undefined;
        this.container = undefined;
        this.echartGradientList = {
            dayLine: [{offset: 0,color: '#ffd843'}, {offset: 1, color: '#70d35f'}],
            dayArea: [{offset: 0,color: 'rgba(255,216,67,0.3)'}, {offset: 1,color: 'rgba(112,211,95,0.3)'}],
            monthLine: [{offset: 0,color: '#c292f0'}, {offset: 1,color: '#6091ff'}],
            monthArea: [{offset: 0,color: 'rgba(194,146,240,0.3)'}, {offset: 1,color: 'rgba(96,145,255,0.3)'}],
            yearLine: [{offset: 0,color: '#86a9f6'}, { offset: 1,color: '#5edbed'}],
            yearArea: [{offset: 0, color: 'rgba(134,169,246,0.3)'}, {offset: 1,color: 'rgba(94,219,237,0.3)'}]
        }
        this.node = undefined;
        this.energyAnalysis = undefined;

    }
    show() {
        var _this = this;
        $('.wrapTagTree').hide();
        WebAPI.get('/static/app/EnergyManagement/views/module/energyOverview.html').done(rsHtml => {
            this.container = $('#containerDisplayboard');
            this.container.html('').append(rsHtml);
            I18n.fillArea(this.container);
            $('#compareToYest').tooltip();
            $('#compareMom').tooltip();
            $('#compareAn').tooltip();
            $('#compareAnYear').tooltip();
            WebAPI.post('/energy/getConfigInfo',{
                // projectId:293,//AppConfig.projectId
                projectId:AppConfig.projectId,
                entityId:-1
            }).done((result)=>{
                if (result.data && result.data[0]){
                    _this.node = result.data[0];
                    _this.init();
                }
            })
            console.log(this.opt)
        });
    };
    init(){
        //左上角数据接入
        this.initTimeWidget(this.timeConfig)
        this.energyDayYear();
        //右上角
        this.renderEnergyStati();
        //this.renderElectricity();
        //判断是否有数据点
        if(!this.node||!this.node.energy){
            alert('no point');
            return;
        }
        this.setHourlyHistoryChart();
        this.setDailyHistoryChart();
        this.setMonthlyHistoryChart();
        this.attEvent()
    };
    initTimeWidget(time){
        $('#queryTimIpt').val(new Date(time).getFullYear()).datetimepicker('remove').datetimepicker({
            format: 'yyyy',
            autoclose:true,
            minView:4,
            startView:4
        });
        $('#hourlyTimIpt').val(new Date(time).format('yyyy-MM-dd')).datetimepicker('remove').datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose:true,
            minView:2,
            startView:2,
            endDate:new Date().format('yyyy-MM-dd')
        });
        $('#dailyTimIpt').val(new Date(time).format('yyyy-MM')).datetimepicker('remove').datetimepicker({
            format: 'yyyy-mm',
            autoclose:true,
            minView:3,
            startView:3,
            endDate:new Date().format('yyyy-MM')
        });
        $('#monthlyTimIpt').val(new Date(time).format('yyyy')).datetimepicker('remove').datetimepicker({
            format: 'yyyy',
            autoclose:true,
            minView:4,
            startView:4,
            endDate:new Date().format('yyyy')
        });
    }
    setHourlyHistoryChart() {
            var $iptTime = $('#hourlyTimIpt');
        var setTime = new Date($iptTime.val());
        var clone_setTime = new Date($iptTime.val());
        var time, timeBefore;

        var isCurrentTime = (new Date(setTime.format('yyyy-MM-dd 00:00:00')).getTime() >= new Date(new Date().format('yyyy-MM-dd 00:00:00')).getTime())
        console.log(isCurrentTime)
        if (isCurrentTime) {
            // time = {
            //     startTime:new Date(new Date().valueOf()).format('yyyy-MM-dd HH:mm:ss'),
            //     endTime:setTime.format('yyyy-MM-dd 23:59:59'),
            //     format:'h1'
            // }
            time = {
                startTime: new Date(+new Date()  - 86400000).format('yyyy-MM-dd HH:mm:ss'),
                endTime: new Date().format('yyyy-MM-dd HH:mm:ss'),
                format: 'h1',
                asd: '1'
            };
            timeBefore = {
                startTime: new Date(+new Date() - 90000000 - 86400000).format('yyyy-MM-dd HH:mm:ss'),
                endTime: new Date(+new Date() - 86400000).format('yyyy-MM-dd HH:mm:ss'),
                format: 'h1'
            }
        } else {
            time = {
                startTime: new Date(+setTime - 3600000).format('yyyy-MM-dd 00:00:00'),
                endTime: setTime.format('yyyy-MM-dd 23:59:59'),
                format: 'h1'
            };
            timeBefore = {
                startTime: new Date(+setTime - 90000000).format('yyyy-MM-dd 00:00:00'),
                endTime: new Date(+setTime - 86400000).format('yyyy-MM-dd 23:59:59'),
                format: 'h1'
            }
        }
        // if (new Date(time.endTime) >  new Date()){
        //     time.endTime = new Date().format('yyyy-MM-dd HH:mm:ss')
        //     time.startTime = new Date(+new Date() - 3600000).format('yyyy-MM-dd 00:00:00')
        // }
        time.endTime = new Date(new Date(time.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss')
        timeBefore.endTime = new Date(new Date(timeBefore.endTime).valueOf() + 3600000).format('yyyy-MM-dd HH:mm:ss')
        var container = $('#hourlyPower')[0];
        var SpinnerLine = new LoadingSpinner({color: '#00FFFF'});
        SpinnerLine.spin($('#hourlyPower')[0]);
        var timeArr=[];
        var timeArrs=[];
        this.getStackData(timeBefore).done(results => {
            var timeArrs=results.timeShaft
            timeArrs.pop();
            timeArr.push(timeArrs);
            var legend = [I18n.resource.energyManagement.overview.HOURLY_ENERGY];
            var series = []
            var seriesCost = [];
            series.push({
                name: I18n.resource.energyManagement.overview.HOURLY_ENERGY,
                type: 'bar',
                stack: '逐时用电昨日',
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
                areaStyle: {
                    normal: {

                    }
                },
                data: results.list[0].data.map(function(ele) {
                    return parseFloat(ele).toFixed(0);
                })
            });
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
                                color: 'rgba(112,211,95,0.5)'
                            }, {
                                offset: 1,
                                color: 'rgba(112,211,95,1)'
                            }], false)
                        }
                    },
                    data: result.list[0].data.map(function(ele) {
                        return parseFloat(ele).toFixed(0);
                    })
                })
                series.push({
                    name:  'Cost',
                    type: 'line',
                    yAxisIndex: 1,
                    stack: '逐时用电费',
                    smooth: true,
                    symbolSize: 0,
                    areaStyle: {

                    },
                    lineStyle: {
                        normal: {
                            width:3,
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
                    data: result.list[1].data.map(function(ele) {
                        return parseFloat(ele).toFixed(0);
                    })
                })

                this.renderStackAreaLine(timeShaft, series, legend, container, 'day', seriesCost,timeArr)
            })

        }).always(() => {
            SpinnerLine.stop();
        })
    }
    setDailyHistoryChart(){
       var $iptTime = $('#dailyTimIpt');
        var setTime = new Date($iptTime.val());
        setTime = new Date(setTime.valueOf() + new Date().getTimezoneOffset() * 60000);
        var clone_setTime = new Date($iptTime.val());
        clone_setTime = new Date(clone_setTime.valueOf() + new Date().getTimezoneOffset() * 60000);
        var time, timeBefore;
        // if(setTime.getMonth()>=new Date().getMonth()){
        //     time = {
        //         startTime:new Date(new Date().valueOf() - 30*24*60*60*1000).format('yyyy-MM-dd HH:mm:ss'),
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
        var isCurrentTime = (new Date(setTime.format('yyyy-MM-dd 00:00:00')).getTime() >= new Date(new Date().format('yyyy-MM-dd 00:00:00')).getTime())
        if (isCurrentTime) {
            time = {
                startTime: new Date(new Date(setTime.startTime).valueOf() - 86400000 * 30).format('yyyy-MM-dd 00:00:00'),
                endTime: new Date().format('yyyy-MM-dd HH:mm:ss'),
                format: 'd1'
            }
            var now = setTime;
            now.setMonth(now.getMonth() - 1)
            timeBefore = {
                startTime: new Date(new Date(time.startTime).valueOf() - 86400000).format('yyyy-MM-01 00:00:00'),
                endTime: new Date(now).format('yyyy-MM-dd HH:mm:ss'),
                format: 'd1'
            }
        } else {
            time = {
                startTime: new Date(+setTime).format('yyyy-MM-01 00:00:00'),
                endTime: setTime.format('yyyy-MM-' + DateUtil.daysInMonth(setTime) + ' 23:59:59'),
                format: 'd1'
            }

            timeBefore = {
                startTime: new Date(new Date(time.startTime).valueOf() - 86400000).format('yyyy-MM-01 00:00:00'),
                endTime: new Date(new Date(time.startTime).valueOf() - 86400000).format('yyyy-MM-' + DateUtil.daysInMonth(new Date(new Date(time.startTime).valueOf() - 86400000)) + ' 23:59:59'),
                format: 'd1'
            }
        }
        if (new Date(time.endTime) > new Date()) {
            time.endTime = new Date().format('yyyy-MM-dd HH:mm:ss')
            time.startTime = new Date(new Date(time.endTime).valueOf() - 86400000 * 30).format('yyyy-MM-dd 00:00:00')
        }
        time.endTime = new Date(new Date(time.endTime).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
        timeBefore.endTime = new Date(new Date(timeBefore.endTime).valueOf() + 86400000).format('yyyy-MM-dd 00:00:00')
        var container = $('#dailyPower')[0];
         var SpinnerDaily = new LoadingSpinner({color: '#00FFFF'});
        SpinnerDaily.spin(container);
        this.getStackData(time).done(result => {
            // result.timeShaft.splice(result.timeShaft.length-1,1)
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            var legend = [I18n.resource.energyManagement.overview.DAILY_ENERGY]
            var series = []
            series.push({
                name: I18n.resource.energyManagement.overview.DAILY_ENERGY,
                type: 'bar',
                stack: '逐日用电',
                markPoint: {
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#5EDBED' }, { offset: 1, color: '#7DA2F5' }], false)
                        }
                    },
                    label: {
                        normal: {
                            formatter: function(params) {
                                if (params.data.yAxis >= 1000 || params.data.yAxis <= -1000) {
                                    return (params.data.yAxis / 1000).toFixed(0) + 'k';
                                } else {
                                    return params.data.yAxis;
                                }
                            }
                        }
                    },
                    data: (function() {
                        var markpoint = [];
                        var len = result.list[0].data.length;
                        result.list[0].data.forEach(function(ele, index) {
                            if (len - index < 4) {
                                markpoint.push({
                                    xAxis: index,
                                    yAxis: parseFloat(ele).toFixed(0),
                                })
                            }
                        })
                        return markpoint;
                    })()
                },
                  temStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0,color: '#5EDBED'}, {offset: 1,color: '#7DA2F5'}], false)
                    }
                },
                data: result.list[0].data.map(function (ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })
            series.push({
                name: 'Cost',
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
                       width:3,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(250,128,114,0.9)'
                            }, {
                                offset: 1,
                                color: 'rgba(250,128,114,0.5)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            shadowBlur: 15,                    }
                },
                data: result.list[1].data.map(function(ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })


            this.renderStackArea(timeShaft, series, legend, container, 'month');
        }).always(() => {
            SpinnerDaily.stop();
        })
    }
    setMonthlyHistoryChart(){
      var $iptTime = $('#monthlyTimIpt');
        var yearFull = $iptTime.val();
        var setTime = new Date($iptTime.val())
        var clone_setTime = new Date($iptTime.val());
        var setTimenew=new Date();
        setTimenew.setMonth(setTimenew.getMonth()-11)
        var time = {
            startTime: yearFull + '-01-01 00:00:00', //setTime.format('yyyy-01-01 00:00:00'),
            endTime: parseInt(yearFull) + 1 + '-01-01 00:00:00', //new Date(clone_setTime.setFullYear(clone_setTime.getFullYear()+1)).format('yyyy-01-01 00:00:00'),  //new Date(clone_setTime.setYear(+1)).format('yyyy-01-01 00:00:00'),
            format: 'M1'
        }
        if (new Date(time.endTime) > new Date()) {
            time.endTime = new Date(new Date().setMonth(new Date().getMonth() + 1)).format('yyyy-MM-dd HH:mm:ss') //new Date(new Date().setMonth(+1)).format('yyyy-MM-dd HH:mm:ss')
            time.startTime = new Date(setTimenew).format('yyyy-MM-dd 00:00:00')
        }
        var container = $('#monthlyPower')[0];
        var xAxisNum = 0
        if (setTime.getFullYear() == new Date().getFullYear()) {
            xAxisNum = 12;
        } else {
            xAxisNum = 12;
        }
        console.log(time)
        var SpinnerYear = new LoadingSpinner({color: '#00FFFF'});
        SpinnerYear.spin(container);
        this.getStackData(time).done(result => {
            // result.timeShaft.splice(result.timeShaft.length-1,1)
            var timeShaft = result.timeShaft;
            timeShaft.pop();
            var legend = [I18n.resource.energyManagement.overview.MONTH_ENERGY]
            var series = []
            series.push({
                name: I18n.resource.energyManagement.overview.MONTH_ENERGY,
                type: 'bar',
                barGap: '50%',
                markPoint: {
                    itemStyle: {
                        normal: {
                            color: '#23E5FF'
                        }
                    },
                    label: {
                        normal: {
                            formatter: function(params) {
                                console.log(params);
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
                },
                stack: '逐月用电',
                data: result.list[0].data.map(function(ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })
            series.push({
                name: 'Cost',
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
                        width:3,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(250,128,114,0.9)'
                            }, {
                                offset: 1,
                                color: 'rgba(250,128,114,0.5)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            shadowBlur: 15,                    }
                },
                data: result.list[1].data.map(function(ele) {
                    return parseFloat(ele).toFixed(0);
                })
            })
            console.log(series)
            this.renderStackArea(timeShaft, series, legend, container, 'year')
        }).always(() => {
            SpinnerYear.stop();
        })
    }
    getStackData(time){
        var _this = this;
        console.log(this)
        var $promise = $.Deferred();
        if(!this.node||(this.node&&this.node.energy=='')||(this.node&&!this.node.energy)){
            alert(I18n.resource.energyManagement.overview.NO_POINT_ALERT);
            return $promise.reject();
        }
        var postData = {
            dsItemIds:[this.node.energy,this.node.cost],
            timeStart:time.startTime,
            timeEnd:time.endTime,
            timeFormat:time.format
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2',postData).done(function(result){
            if(result.list){
                $promise.resolveWith(_this,[result]);
            }else{
                $promise.reject();
            }
        }).fail(function(){
            $promise.reject();
        })
        return  $promise.promise();
    };
    energyDayYear(){
        var _this = this;
        //var pointEnergyId = this.nodesInfo?this.nodesInfo.energy:this.opt.store[0].config.energy;
        //var pointPowerId = this.nodesInfo?this.nodesInfo.power:this.opt.store[0].config.power;
        //var pointCostId = this.nodesInfo?this.nodesInfo.cost:this.opt.store[0].config.cost;
        // if(!this.opt.store[0].config||(this.opt.store[0].config&&(this.opt.store[0].config.energy==''||this.opt.store[0].config.cost==''))||(this.opt.store[0].config&&(!this.opt.store[0].config.energy||!this.opt.store[0].config.cost))){
        //     alert(I18n.resource.energyManagement.overview.NO_POINT_ALERT);
        //     return;
        // }
        if(!this.node||((this.node.energy==''||this.node.cost==''))||(this.node&&(!this.node.energy||!this.node.cost))){
            alert(I18n.resource.energyManagement.overview.NO_POINT_ALERT);
            return;
        }
        var pointEnergyId = this.node.energy;
        var pointPowerId = this.node.power;
        var pointCostId = this.node.cost;
        var arrParamId = [];
        //arrParamId.push(pointPowerId);//pointEnergyId
        arrParamId.push(pointEnergyId);//pointEnergyId
        arrParamId.push(pointCostId);
        var timeEnd = new Date(this.timeConfig).getDate()>=new Date().getDate()?new Date(new Date().valueOf()+86400000).format('yyyy-MM-dd 00:00:00'):new Date(new Date(this.timeConfig).valueOf()+86400000).format('yyyy-MM-dd 00:00:00');
        var timeStart = new Date(new Date(this.timeConfig).valueOf()-86400000*1).getDate()>new Date(new Date().valueOf()-86400000*1).getDate()?new Date(new Date().valueOf()-86400000*1).format('yyyy-MM-dd 00:00:00'):new Date(new Date(this.timeConfig).valueOf()-86400000*1).format('yyyy-MM-dd 00:00:00');
        //今日能耗
        var postData = {
            dsItemIds: arrParamId,
            timeStart: timeStart,
            timeEnd: timeEnd,
            timeFormat: 'd1'
        }
        var onPerent = '--';
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2',postData).done(rsData => {
            var $compareToYest = $('#compareToYest');
            if(rsData&&rsData.list.length>0){
                for(var i = 0;i<rsData.list.length;i++){
                    if(i ==0){
                        var item = rsData.list[i].data;
                        if(item.length!=0){
                            var todayNum;
                            //if(item[1]>=1000){
                            //    todayNum = parseFloat(item[1]/1000).toFixed(0)+' MWh'
                            //}else{
                            todayNum = _this.getThousandsBit(parseFloat(item[1]).toFixed(0))+' kWh'
                            //}
                            $('#todayEnergyChat').html(todayNum);
                            var $arrorDisplyTody = $('.arrorDisplyTody ');
                            $arrorDisplyTody.removeClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-up');
                            if(item[1]>=item[0]){
                                $arrorDisplyTody.addClass('glyphicon-arrow-up');
                            }else{
                                $arrorDisplyTody.addClass('glyphicon-arrow-down');
                            }
                            onPerent = item[1]==item[0]?0:(item[1]/item[0]*100).toFixed(0);
                            onPerent = Math.abs(100 - onPerent)+'%'
                        }
                    }else{
                        var item = rsData.list[i].data;
                        if(item.length!=0){
                            var value = parseFloat(item[1]).toFixed(0)
                            if (value <0)value = 0;
                            $('#todayEnergyCost').html('$ '+_this.getThousandsBit(value));
                        }
                    }

                    $compareToYest.html(onPerent)
                }
            }else{
                //infoBox.alert('no data')
            }
        }).always(()=>{
            //var templateToday = new StringBuilder();
            //templateToday.append('<div class="tooltip" role="tooltip" style="position: absolute;">');
            //templateToday.append('<div class="tooltipTitle tooltip-inner" style="display:none"></div>');
            //templateToday.append('<div  class="tooltipContent"><div class="tooltipModal"><span class="compareAllStyle">').append(I18n.resource.energyManagement.overview.COMPARISON_YESTERDAY).append('</span>  <span class="arrorDisplyTody glyphicon glyphicon-arrow-down"></span><span id="compareToYest">').append(onPerent).append('</span></div></div>');
            //templateToday.append('<div class="tooltip-arrow"></div>');
            //templateToday.append('</div>');
            //var options = {
            //    placement: 'auto',
            //    title: 'compare',
            //    template: templateToday.toString()
            //};
            //$('.todayEnergyTool').tooltip(options);
        })
        //本月环比
        var nowYear = new Date(this.timeConfig).getFullYear();
        var nowMonth = new Date(this.timeConfig).getMonth();
        var nowDay = new Date(this.timeConfig).getDate();
        var currentYear = new Date().getFullYear();
        var currentBeforMonth = new Date().getMonth()-1;
        var currentDate = new Date().getDate();
        var timeStartM = (nowMonth)>=(new Date().getMonth())?new Date(currentYear,currentBeforMonth,currentDate).format('yyyy-MM-01 00:00:00'):new Date(nowYear,nowMonth-1,nowDay).format('yyyy-MM-01 00:00:00');
        var timeEndM = nowMonth>=new Date().getMonth()?new Date(currentYear,currentBeforMonth+2,currentDate).format('yyyy-MM-01 00:00:00'):new Date(nowYear,nowMonth+1,nowDay).format('yyyy-MM-01 00:00:00');
        var postDataMonth = {
            dsItemIds: arrParamId,
            timeStart: timeStartM,
            timeEnd: timeEndM,
            timeFormat: 'M1'
        }
        var curMonthData = 0
        var onPerentMom = '--',onPerentAn= '--';
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2',postDataMonth).done(rsDataM => {
            var $compareMom = $('#compareMom');
            if(rsDataM&&rsDataM.list.length>0){
                for(var i = 0;i<rsDataM.list.length;i++){
                    if(i ==0){
                        var item = rsDataM.list[i].data;
                        //当前月和上个月
                        // var item=[];
                        // item.push(rsDataM.list[0].data);
                        // item.push(rsDataM.list[1].data);
                        
                        if(item.length!=0){
                            var mothNum;
                            curMonthData = item[1]
                            
                            //if(item[1]>=1000){
                            //    mothNum = parseFloat(item[1]/1000).toFixed(0)+' MWh'
                            //}else{
                            mothNum = _this.getThousandsBit(parseFloat(item[1]).toFixed(0))+' kWh'
                            //}
                            $('#MonthEnergyChat').html(mothNum);
                            var $arrorDisplyMonth = $('.arrorDisplyMonth ');
                            $arrorDisplyMonth.removeClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-up');
                            if(item[1]>=item[0]){
                                $arrorDisplyMonth.addClass('glyphicon-arrow-up');
                            }else{
                                $arrorDisplyMonth.addClass('glyphicon-arrow-down');
                            }
                            onPerentMom = item[1]==item[0]?0:Math.abs(100 - ((item[1]/item[0]*100).toFixed(0)))+'%';
                            $compareMom.html(onPerentMom)
                        }else{
                            $compareMom.html('--')
                        }
                    }else{
                        var item = rsDataM.list[i].data;
                        // //当前月和上个月
                        // var item=[];
                        // item.push(rsDataM.list[0].data);
                        // item.push(rsDataM.list[1].data);
                        if(item.length!=0){
                            var value = parseFloat(item[1]).toFixed(0)
                            if (value <0)value = 0;
                            $('#MonthEnergyCost').html('$ '+_this.getThousandsBit(value));
                        }
                    }
                }
            }else{
                //infoBox.alert('no data')
            }
        }).always(function(){
            //本月同比
            var timeStartY = new Date(nowYear-1,nowMonth-1,nowDay).format('yyyy-MM-01 00:00:00');
            var timeEndY = new Date(nowYear-1,nowMonth,nowDay).format('yyyy-MM-20 00:00:00');
            var postDataYear = {
                dsItemIds: arrParamId,
                timeStart: timeStartY,
                timeEnd: timeEndY,
                timeFormat: 'M1'
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment',postDataYear).done(rsDataY => {
                var $compareAn = $('#compareAn');
                if(rsDataY&&rsDataY.list.length>0){
                    for(var i = 0;i<rsDataY.list.length;i++){
                        if(i ==0){
                            var item = rsDataY.list[i].data;
                            if(item.length!=0){
                                var currentData = item[item.length-1];
                                var mothNum;
                                //if(currentData>=1000){
                                //    mothNum = parseFloat(currentData/1000).toFixed(0)+' MWh'
                                //}else{
                                mothNum = _this.getThousandsBit(parseFloat(currentData).toFixed(0))+' kWh'
                                //}
                                $('#MonthEnergyChat').html(mothNum);
                                var $arrorOnDisplyMonth = $('.arrorOnDisplyMonth ');
                                $arrorOnDisplyMonth.removeClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-up');
                                if(currentData>=curMonthData){
                                    $arrorOnDisplyMonth.addClass('glyphicon-arrow-up');
                                }else{
                                    $arrorOnDisplyMonth.addClass('glyphicon-arrow-down');
                                }
                                //var onPerent; //= currentData==item[0]?0:(currentData/item[0]*100).toFixed(2);
                                if(currentData==curMonthData){
                                    onPerentAn = 0+'%'
                                }else{
                                    if(curMonthData==0){
                                        onPerentAn = '--%';
                                    }else{
                                        onPerentAn = Math.abs(100 - (currentData/curMonthData*100).toFixed(0))+'%';
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
                }else{
                     $compareAn.html(onPerentAn)
                    //infoBox.alert('no data')
                }
            }).always(()=>{
                //var templateMonth = new StringBuilder();
                //templateMonth.append('<div class="tooltip" role="tooltip" style="position: absolute;">');
                //templateMonth.append('<div class="tooltipTitle tooltip-inner" style="display:none"></div>');
                //templateMonth.append('<div  class="tooltipContent">');
                //templateMonth.append('<div class="tooltipModals">');
                //templateMonth.append(' <span class="compareAllStyle compareAllStyleMoM">').append(I18n.resource.energyManagement.overview.MOM).append('</span>  <span class="arrorDisplyMonth glyphicon glyphicon-arrow-up"></span><span id="compareMom">').append(onPerentMom).append('</span>');
                //templateMonth.append('</div>');
                //templateMonth.append('<div class="tooltipModals">');
                //templateMonth.append('<span class="compareAllStyle compareAllStyleYoY">').append(I18n.resource.energyManagement.overview.YOY).append('</span>  <span class="arrorOnDisplyMonth arrorDisplyMonthOn glyphicon glyphicon-arrow-up"></span><span id="compareAn">').append(onPerentAn).append('</span>');
                //templateMonth.append('</div>');
                //templateMonth.append('</div>');
                //templateMonth.append('<div class="tooltip-arrow"></div>');
                //templateMonth.append('</div>');
                //var options = {
                //    placement: 'auto',
                //    title: 'compare',
                //    template: templateMonth.toString()
                //};
                //$('.monthEnergyTool').tooltip(options);
            })
        })
        // //本年
        this.setYearContrast(arrParamId)
        // var timeStartUpY = new Date(nowYear-2,nowMonth,nowDay).format('yyyy-01-01 00:00:00');
        // var postUpYear = {
        //     dsItemIds: arrParamId,
        //     timeStart: timeStartUpY,
        //     timeEnd: timeEndM,
        //     timeFormat: 'M1'
        // }
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
    setYearContrast(points){
        //本年
        var _this = this;
        var setTime = new Date(this.timeConfig)
        var timeStartThisYear = new Date(setTime).format('yyyy-01-01 00:00:00')
        var timeEndThisYear = new Date(new Date(setTime).setFullYear(setTime.getFullYear()+1)).format('yyyy-01-01 00:00:00')
        var timeStartLastYear = new Date(new Date(setTime).setFullYear(new Date(setTime).getFullYear()-1)).format('yyyy-01-01 00:00:00')
        var timeEndLastYear = new Date(setTime).format('yyyy-01-01 00:00:00');
        var onYearPerent = '--';

        if (new Date(timeEndThisYear) > new Date()){
            timeEndThisYear = new Date().format('yyyy-MM-01 00:00:00')
            timeEndLastYear = new Date(new Date(setTime).setFullYear(new Date(setTime).getFullYear()-1)).format('yyyy-MM-01 00:00:00')
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
        $.when(WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postThisYear),WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postLastYear)).done((function(){
            var rsThisYear = arguments[0][0].list
            var rsLastYear = arguments[1][0].list

            var eleThisYear = rsThisYear[0].data
            var eleLastYear = rsLastYear[0].data
            var costThisYear = rsThisYear[1].data
            var costLastYear = rsLastYear[1].data

            var numEleThisYear = eleThisYear[eleThisYear.length - 1] - eleThisYear[0]
            var numEleLastYear = eleLastYear[eleLastYear.length - 1] - eleLastYear[0]
            var numCostThisYear = costThisYear[costThisYear.length - 1] - costThisYear[0]
            var numCostLastYear = costLastYear[costLastYear.length - 1] - costLastYear[0]

            if (isNaN(numEleThisYear))numEleThisYear = 0;
            if (isNaN(numEleLastYear))numEleLastYear = 0;
            if (isNaN(numCostThisYear))numCostThisYear = 0;
            if (isNaN(numCostLastYear))numCostLastYear = 0;

            var $compareAnYear = $('#compareAnYear');
            if(costThisYear.length!=0){
                if (numCostThisYear < 0 )numCostThisYear = 0;
                $('#yearEnergyCost').html('$ '+_this.getThousandsBit(parseFloat(numCostThisYear).toFixed(0)));
            }


            numEleLastYear = parseFloat(parseFloat(numEleLastYear).toFixed(2));
            numEleThisYear = parseFloat(parseFloat(numEleThisYear).toFixed(2));
            var yearNum;
            //if(numEleThisYear>=1000){
            //    yearNum = parseFloat(numEleThisYear/1000).toFixed(0)+' MWh'
            //}else{
            yearNum = _this.getThousandsBit(parseFloat(numEleThisYear).toFixed(0))+' kWh'
            //}
            $('#yearEnergyChat').html(yearNum);
            var $arrorDisplyYear  = $('.arrorDisplyYear');
            $arrorDisplyYear.removeClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-up');
            if(numEleThisYear>=numEleLastYear){
                $arrorDisplyYear.addClass('glyphicon-arrow-up');
            }else{
                $arrorDisplyYear.addClass('glyphicon-arrow-down');
            }
            //var onPerent; //= nowYear==lastYear?0:(nowYear/lastYear*100).toFixed(2);
            $arrorDisplyYear.show()
            $compareAnYear.show()
            if(numEleLastYear==numEleThisYear){
                onYearPerent = 0;
            }else{
                if(numEleLastYear==0){
                    onYearPerent = '--';
                    $arrorDisplyYear.hide()
                    $compareAnYear.hide()
                }else{
                    onYearPerent = 100 - (numEleThisYear/numEleLastYear*100).toFixed(0)
                }
            }
            if (typeof onYearPerent == "number"){
                $compareAnYear.html(Math.abs(onYearPerent)+'%')
            }else{
                $compareAnYear.html(onYearPerent+'%')
            }
        })).always(()=>{
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
    //             var focusTime = new Date(endTime)
    //             var focusTime_clone = new Date(endTime);
    //             this.itemizePoints=itemizePoints;
    //             var postData = {
    //                 dsItemIds: itemizePoints,
    //                 timeStart: new Date(+focusTime_clone - 86400000).format('yyyy-MM-dd 00:00:00'),
    //                 timeEnd: new Date(focusTime).format('yyyy-MM-dd HH:mm:ss'),
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

    renderEnergyStati(){
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
        for(var i = 0;i<items.length;i++){
            itemizePointsName.push(items[i].name)
            itemizePoints.push(items[i].energy);
        }
        this.itemizePointsName=itemizePointsName;
        var isExist = false;
        for(var item of itemizePoints){
            if(item){
                isExist = true;
            }
        }
        if(!isExist){
            alert('no point!');
            return;
        }
        var endTime = this.timeConfig;
        var focusTime = new Date(endTime)
        var focusTime_clone = new Date(endTime);
        this.itemizePoints=itemizePoints;
        var postData = {
            dsItemIds: itemizePoints,
            timeStart: new Date(+focusTime_clone - 86400000).format('yyyy-MM-dd 00:00:00'),
            timeEnd: new Date(focusTime).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'd1'
        }
         Spinner.spin($('.energyStatisContent')[0]);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment',postData).done(resultDate => {
            if(resultDate&&Object.prototype.toString.call(resultDate)!='[object Object]'){
                Spinner.stop();
                    return;
            }
            if(resultDate&&resultDate.list.length>0){
                var yearData = [];
                var yearDateArr = [];
                for(var i = 0;i<resultDate.list.length;i++){
                    var item = resultDate.list[i];
                    var currentData = 0;
                    for(var j = 0;j<item.data.length;j++){
                        currentData+=item.data[j];
                    }
                    yearData.push(currentData);
                    yearDateArr.push({
                        name:itemizePointsName[i],
                        data:currentData
                    })
                }
                this.renderPie(itemizePointsName,yearData);
                this.renderItemizeBar(yearDateArr)
            }
            Spinner.stop();
        });
    };
    renderElectricity(){
        var point = this.node.energy;
        //逐时
        var hourlyTimIptVal = $('#hourlyTimIpt').val();
        var startTime = new Date(hourlyTimIptVal).format('yyyy-MM-dd 00:00:00');
        var endTime = hourlyTimIptVal.split('-')[2]==new Date().getDate()?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(hourlyTimIptVal).format('yyyy-MM-dd 23:59:59');
        var postData = {
            dsItemIds: [point],
            timeStart: startTime,
            timeEnd: endTime,
            timeFormat: 'h1'
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postData).done(rsDataHo => {
            console.log(rsDataHo)
        })
    };
    renderPie(itemizePointsName,yearData){
        var seriesData = [];
        if(!itemizePointsName) return;
        for(var i = 0;i<itemizePointsName.length;i++){
            seriesData.push({
                value:parseFloat(yearData[i]).toFixed(2),
                name:itemizePointsName[i]
            })
        }
        var option = {
            title : {
                // text: I18n.resource.energyManagement.overview.SUB_ENERGY,
                show:false
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c}kWh"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:itemizePointsName,
                top:'middle',
                left:'60%',
                icon:'circle',
                itemHeight: '9',
                textStyle:{
                    fontSize:12,
                    color:'#a7b1c0'
                }
            },
            series: [
                {
                    // name:I18n.resource.energyManagement.overview.SUB_ENERGY,
                    type:'pie',
                    radius: ['40%', '50%'],
                    avoidLabelOverlap: false,
                    center:['30%','50%'],
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
                    data:seriesData
                }
            ]
        }
        var echart = echarts.init($('.energyItemize')[0],this.opt.chartTheme);
        echart.setOption(option);
    };
    renderItemizeBar(yearDateArr){
        if(!yearDateArr) return;
        var yData = [];
        var arrName = [];
        yearDateArr.sort(function(a,b){return a.data-b.data});
        var itemizePointsName = [],yearData = [];
        for(var i = 0;i<yearDateArr.length;i++){
            itemizePointsName.push(yearDateArr[i].name);
            yearData.push(parseFloat(yearDateArr[i].data).toFixed(2));
        }
        for(var i = 0;i<itemizePointsName.length;i++){
            var item = itemizePointsName[i];
            arrName.push(item)
            if(item.length>8){
                yData.push(item.slice(0,9)+'...');
            }else{
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
                show:false,
                text: I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: "{a} <br/>{b}: {c}kWh"
            },
            legend: {
                show:false,
                data: [I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION]
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'15%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                "axisLine":{
                    "show":true,
                    lineStyle:{
                        color:'#a7b1c0'
                    }
                },
                splitLine :{
                    lineStyle:{
                        color:'#a7b1c0'
                    }
                }
            },
            yAxis: {
                type: 'category',
                axisLine:{
                    show:false,
                },
                data: yData//[I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION]
            },
            series: //seriesArr
                [
                {
                    name: I18n.resource.energyManagement.overview.SUB_ITEM_CONPARSION,
                    type: 'bar',
                    barWidth:yearData.length>6?'18%':'22%',//parseFloat(100/yearData.length).toFixed(0)+'%'
                    data: yearData
                }
            ]
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
        var echarter = echarts.init($('.energyContrast')[0],this.opt.chartTheme);
        echarter.setOption(option);
    }
//     initEnergyModule(options) {
//         var _this = this; 
//         var pointEnergyId = this.nodesInfo?this.nodesInfo.config.energy:this.opt.store[0].config.energy;
// /*        var postDayData = {
//             dsItemIds: [pointEnergyId],
//             timeEnd: new Date().format('yyyy-MM-dd HH:mm:ss'),
//             timeFormat: "h1",
//             timeStart: new Date().format('yyyy-MM-dd 00:00:00')
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
    renderStackArea(xAxisData,seriesArr,lengendArr,dom,colorObj){
         var lineColor, areaColor;
        var dataSeries = $.extend([], seriesArr[0].data);
        var yseriesMin = 0;
        dataSeries.sort(function(a, b) { return a - b });
        yseriesMin = (parseFloat(dataSeries[0]) * 0.8).toFixed(0);

        this.echartGradientList = {
            dayLine: [{ offset: 0, color: '#ffd843' }, { offset: 1, color: '#70d35f' }],
            dayArea: [{ offset: 0, color: 'rgba(255,216,67,0.3)' }, { offset: 1, color: 'rgba(112,211,95,0.3)' }],
            monthLine: [{ offset: 0, color: '#c292f0' }, { offset: 1, color: '#6091ff' }],
            monthArea: [{ offset: 0, color: 'rgba(194,146,240,0.3)' }, { offset: 1, color: 'rgba(96,145,255,0.3)' }],
            yearLine: [{ offset: 0, color: '#86a9f6' }, { offset: 1, color: '#5edbed' }],
            yearArea: [{ offset: 0, color: 'rgba(134,169,246,1)' }, { offset: 1, color: 'rgba(94,219,237,1)' }],
            markPoint: [{ offset: 0, color: '#ffd843' }, { offset: 1, color: '#70d35f' }]
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
                if (len - i < 4) {
                    colors.push('#23E5FF')
                } else {
                    colors.push(new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#5EDBED' }, { offset: 1, color: '#7DA2F5' }], false))
                }
            }
        } else {
            lineColor = this.echartGradientList.yearLine;
            areaColor = this.echartGradientList.yearArea;
            for (var i = 0; i < xAxisData.length; i++) {
                if (i == xAxisData.length - 1) {
                    colors.push('#23E5FF')
                } else {
                    colors.push(new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#5EDBED' }, { offset: 1, color: '#7DA2F5' }], false))
                }
            }
        }
        console.log(colors)
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow' //,
                        //lineStyle:{
                        //    color:new echarts.graphic.LinearGradient(0, 0, 0, 1,lineColor , false)
                        //}
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
                    color: function(params) {
                        return colors[params.dataIndex]
                    }
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
                    min: yseriesMin, //'dataMin',
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
        var chart = echarts.init(dom, AppConfig.chartTheme); //,this.opt.chartTheme
        chart.setOption(option);
        chart.on('click', (params) => {
            if (params.componentType == 'markPoint') {
                if (!this.energyAnalysis) {
                    this.energyAnalysis = new EnergyAnalysis(this.opt);
                    this.energyAnalysis.show();
                } else {
                    this.energyAnalysis.destory();
                }
            }
        })
    };
    renderStackAreaLine(xAxisData,seriesArr,lengendArr,dom,colorObj,seriesCost,timeArr){
           var lineColor, areaColor;
        var _this=this;
        this.echartGradientList = {
                dayLine: [{ offset: 0, color: '#ffd843' }, { offset: 1, color: '#70d35f' }],
                dayArea: [{ offset: 0, color: 'rgba(255,216,67,0.3)' }, { offset: 1, color: 'rgba(112,211,95,0.3)' }],
                monthLine: [{ offset: 0, color: '#c292f0' }, { offset: 1, color: '#6091ff' }],
                monthArea: [{ offset: 0, color: 'rgba(194,146,240,0.3)' }, { offset: 1, color: 'rgba(96,145,255,0.3)' }],
                yearLine: [{ offset: 0, color: '#86a9f6' }, { offset: 1, color: '#5edbed' }],
                yearArea: [{ offset: 0, color: 'rgba(134,169,246,0.3)' }, { offset: 1, color: 'rgba(94,219,237,0.3)' }]
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
                 formatter:function (params){
                    var dayOne=timeArr[params[0].seriesIndex][params[0].dataIndex].substring(5,10);
                    var dayTwo=timeArr[params[1].seriesIndex][params[1].dataIndex].substring(5,10);
                    var dayThree=timeArr[params[2].seriesIndex][params[2].dataIndex].substring(5,10);
                    var seriesNameOne=params[0].seriesName;
                    var seriesNameTwo=params[1].seriesName;
                    var seriesNameThree=params[2].seriesName;
                    var dataOne=_this.getThousandsBit(params[0].data);
                    var dataTwo=_this.getThousandsBit(params[1].data);
                    var dataThree=_this.getThousandsBit(params[2].data);
                    return params[0].name+'</br>'+dayOne+' '+seriesNameOne+': '+dataOne+'</br>'+dayTwo+' '+seriesNameTwo+': '+dataTwo+'</br>'+dayThree+' '+seriesNameThree+': '+dataThree+'</br>'
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
                    min: 'dataMin',
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
        var chart = echarts.init(dom, AppConfig.chartTheme); //,this.opt.chartTheme
        chart.setOption(option);
    };
    attEvent(){
        $('#hourlyTimIpt').off('change').on('change',(e)=>{
            this.setHourlyHistoryChart();
        });
        $('#dailyTimIpt').off('change').on('change',(e)=>{
            this.setDailyHistoryChart();
        })
        $('#monthlyTimIpt').off('change').on('change',(e)=>{
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
        var _this=this;
        $('.energyStatisTitle .statisTime .btn').off('click').on('click',function(){
        
            var searchTime=$(this).attr('data-time');
            var stamp;
            var endTime = _this.timeConfig;
            var focusTime = new Date(endTime)
            var focusTime_clone = new Date(endTime);
            searchTime==='day'?stamp=86400000:searchTime==='week'?stamp=86400000*7:stamp=86400000*30;
             var postData = {
                    dsItemIds: _this.itemizePoints,
                    timeStart: new Date(+focusTime_clone - stamp).format('yyyy-MM-dd 00:00:00'),
                    timeEnd: new Date(focusTime).format('yyyy-MM-dd HH:mm:ss'),
                    timeFormat: 'd1'
                }
                Spinner.spin($('.energyStatisContent')[0]);
                WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment',postData).done(resultDate => {
                    if(resultDate&&Object.prototype.toString.call(resultDate)!='[object Object]'){
                        Spinner.stop();
                         return;
                    }
                    if(resultDate&&resultDate.list.length>0){
                        var yearData = [];
                        var yearDateArr = [];
                        for(var i = 0;i<resultDate.list.length;i++){
                            var item = resultDate.list[i];
                            var currentData = 0;
                            for(var j = 0;j<item.data.length;j++){
                                currentData+=item.data[j];
                            }
                            yearData.push(currentData);
                            yearDateArr.push({
                                name:_this.itemizePointsName[i],
                                data:currentData
                            })
                        }
                        _this.renderPie(_this.itemizePointsName,yearData);
                        _this.renderItemizeBar(yearDateArr)
                    }
                    Spinner.stop();
                });
        })
    };
    // onNodeClick(nodes){
    //     this.nodesInfo = nodes[0].config;
    //     this.node = nodes;
    //     console.log(this.node);
    //     this.init();
    // };
    onTimeChange(time){
        this.timeConfig = time
        this.initTimeWidget(this.timeConfig);
        this.renderEnergyStati();
        this.energyDayYear();
        this.setHourlyHistoryChart();
        this.setDailyHistoryChart();
        this.setMonthlyHistoryChart();
    };
    close(){
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
    needTime:true
} 
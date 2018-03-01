class EnergyHistoryQuery {
    constructor(opt) {
        this.opt = opt;
        this.nodesArr = this.opt.tree.getChildNode();
        this.pointEnergyArr = [];
        this.pointNameArr = [];
        this.pointPowerArr = [];
        this.normalColor = ['#426ec1', '#4fcade', '#F3CB2A', '#7094ec', '#71d360', '#3faaff']; //ffd600['#426ec1','#7094ec','#3faaff','#4fcade','#71d360','#ffd600'];//['#ffd428','#71d360','#54cadd','#45abff','#7094ec','#4470bf'];
        this.onTimeArr = [];
        this.onTime = [];
        this.postData = undefined;
        this.async = [];
        this.resultArr = [];

        this.selectEnergyId = AppConfig.energyCurrent?AppConfig.energyCurrent:0;

        //判断不同类型显示对应的文字
        this.typeDiff = {
            0:{
                energyType:I18n.resource.energyManagement.history.ENERGY_CONSUMPTION,
                powerType:I18n.resource.energyManagement.history.POWER
            },
            1:{
                energyType:I18n.resource.energyManagement.history.ENERGY_CONSUMPTION,
                powerType:I18n.resource.energyManagement.history.POWER
            },
            2:{
                energyType:I18n.resource.energyManagement.history.WATER_CONSUMPTION,
                powerType:I18n.resource.energyManagement.history.FLOW_RATE
            },
            3:{
                energyType:I18n.resource.energyManagement.history.GAS_CONSUMPTION,
                powerType:I18n.resource.energyManagement.history.FLOW_RATE
            },
            4:{
                energyType:I18n.resource.energyManagement.history.OIL_CONSUMPTION,
                powerType:I18n.resource.energyManagement.history.FLOW_RATE
            },
            5:{
                energyType:I18n.resource.energyManagement.history.WATER_CONSUMPTION,
                powerType:I18n.resource.energyManagement.history.FLOW_RATE
            },
            6:{
                energyType:I18n.resource.energyManagement.history.WATER_CONSUMPTION,
                powerType:I18n.resource.energyManagement.history.FLOW_RATE
            }
        }
    }
    show() {
        WebAPI.get('/static/app/EnergyManagement/views/module/energyHistoryQuery.html').done(function (rsHtml) {
            $('#containerDisplayboard').html('').append(rsHtml);
            I18n.fillArea($('#containerDisplayboard'));
            $('#energyHistoryBtn').html(this.typeDiff[Number(this.selectEnergyId)].energyType);
            $('#powerHistoryBtn').html(this.typeDiff[Number(this.selectEnergyId)].powerType);
            $('#iptStartTime').val(toDate(toDate().setMonth(toDate().getMonth() - 1)).format('yyyy-MM-dd'));
            $('#endTime').val(toDate().format('yyyy-MM-dd'));
            $('#endTime,#iptStartTime').datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                minView: 2,
                startView: 2
            }).on('changeDate', function (e) {
                $(this).datetimepicker('hide');
            });;
            this.cycleCount = 1;
            this.getPointChildren();
        }.bind(this));
    }
    getPointChildren(isNode) {
        var selectNodeChildren = [];
        var type = $('.energyPover').find('.selected').attr('data-type');
        var points = [];
        this.pointNameArr = [this.opt.store[0].name];
        this.pointEnergyArr = [];
        this.pointPowerArr = [];
        var configInfo = this.opt.store[0].config;
        $('.onTimeBox').empty().remove();
        this.async = [];
        this.resultArr = [];
        this.cycleCount = 1;
        type == 'energy' && $('.wrapQuery').addClass('conYoYActive');
        
        if (configInfo) {
            this.pointEnergyArr.push(configInfo.energy);
            this.pointPowerArr.push(configInfo.power);

            if (!isNode) {
                /*                var postD = {
                                    dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
                                    timeEnd:this.opt.timeConfig>=toDate().format('yyyy-MM-dd')?toDate().format('yyyy-MM-dd HH:mm:ss'):toDate(this.opt.timeConfig).format('yyyy-MM-dd HH:mm:ss'),
                                    timeFormat:'d1',
                                    timeStart:this.opt.timeConfig>=toDate().format('yyyy-MM-dd')?toDate().format('yyyy-MM-01 00:00:00'):toDate(this.opt.timeConfig).format('yyyy-MM-01 00:00:00')
                                }*/
                /*初始周期为倒退30天*/
                /*                var startTime = toDate(toDate().getTime() - 30 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss');
                                var endTime = toDate(toDate().getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss');*/
                //var startTime = toDate(toDate().getFullYear(), toDate().getMonth() - 1, toDate().getDate()).format('yyyy-MM-dd HH:mm:ss');
                var startTime = toDate(toDate().getTime() - 30 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00');
                var endTime = toDate(toDate().getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00');
                var postD = {
                    dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                    timeEnd: endTime,
                    timeFormat: 'd1',
                    timeStart: startTime
                }
                this.fixedDipkerTime(toDate(toDate(startTime)).format('yyyy-MM-dd'), toDate().format('yyyy-MM-dd'), 'd1');
                this.postData = postD;
                this.init(type, postD)
                //var postData = this.getPostData('d1');
                //this.init(type,postData);
                this.attEvent();

                this.async.push(this.childrenColumn());
                //this.async.push(this.normalYoY());
            } else {
                var startTime = $('#iptStartTime').val(),
                    endTime = $('#endTime').val();
                var timeFormat = $('.periodHistory').val();

                var postData = {
                    dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                    timeEnd: this.postData && this.postData.timeEnd ? this.postData.timeEnd : toDate(toDate(endTime).getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00'), //this.postData?this.postData.timeEnd:endTime,
                    timeFormat: timeFormat,
                    timeStart: this.postData && this.postData.timeStart ? this.postData.timeStart : toDate(startTime).format('yyyy-MM-dd 00:00:00') //this.postData?this.postData.timeStart:startTime
                }
                this.postData = postData;

                var isPointValid = false;
                for (var i = 0; i < postData.dsItemIds.length;i++){
                    if (postData.dsItemIds[i] != null){
                        isPointValid = true;
                        break;
                    }
                }
                if (!isPointValid){
                    if (!this.opt.store[0].isParent) infoBox.alert('no data!');
                    return;
                }
                
                this.async.push(this.childrenColumn());
                //this.async.push(this.normalYoY());
                this.init(type, postData);
                this.attEvent();
            }
        } else {
            if (!this.opt.store[0].isParent) alert('no point');
        }
        //$('.addOnqueryTime').trigger('click');
    }
    init(type, postData) {
        var isPointValid = false;
        for (var i = 0; i < postData.dsItemIds.length;i++){
            if (postData.dsItemIds[i] != null){
                isPointValid = true;
                break;
            }
        }
        if (!isPointValid){
            if (!this.opt.store[0].isParent) infoBox.alert('no data!');
            return;
        }
        Spinner.spin($('#containerDisplayboard')[0]);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram' + (type == 'energy' ? '/increment/v2' : ''), postData).done(resultData => { ///increment
            if (resultData &&resultData.timeShaft && resultData.timeShaft.length > 0) {
                var xAxisTime = [], dataArr = [];
                xAxisTime.push(resultData.timeShaft);
                for (var i = 0; i < resultData.list.length; i++) {
                    dataArr.push(resultData.list[i].data);
                }
                if (type == 'energy') {
                    this.renderStackedColumn(xAxisTime, dataArr);
                } else {
                    this.renderBrokenLine(xAxisTime[0], dataArr);
                }
            } else {
                if (!this.opt.store[0].isParent) infoBox.alert('no data!');
            }
        }).always(() => {
            Spinner.stop();
        });
    }
    renderStackedColumn(xAxisTime, data, isNormal, arrLengend) {
        var _this = this;
        var seriesArr = [];
        var thisCurrentNodeName = this.opt.store && this.opt.store[0] ? this.opt.store[0].name : '';
        var type = $('.energyPover').find('.selected').attr('data-type');
        if (this.pointNameArr[0].indexOf(thisCurrentNodeName) < 0) {
            for (var i = 0; i < this.pointNameArr.length; i++) {
                this.pointNameArr[i] = thisCurrentNodeName + '-' + this.pointNameArr[i];
            }
        }
        var color = [];
        var index = 0,
            totalSum = 0;
        var period = $('.periodHistory').val();
        if (!isNormal) {
            for (var i = 0; i < data.length; i++) {
                seriesArr.push({
                    name: this.pointNameArr[i],
                    type: 'bar',
                    itemStyle:{
                        normal:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: ' #48E1CE'
                            }, {
                                offset: 0.8,
                                color: '#00CBDE'
                            }], false),
                        }
                    },
                    data: this.toFixedTwoNum(data[i])
                });
                color.push(this.normalColor[index]);
                index++;
                if (index == data.length) {
                    index = 0;
                }
            }
        } else {
            var indexLengend = 0;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var stackName = toDate(this.onTime[i].timeStart).format('yyyy-MM');
                if (period == 'h1') {
                    stackName = toDate(this.onTime[i].timeStart).format('yyyy-MM-dd');
                } else if (period == 'm5') {
                    stackName = toDate(this.onTime[i].timeStart).format('yyyy-MM-dd HH');
                }
                for (var j = 0; j < item.length; j++) {
                    seriesArr.push({
                        name: arrLengend[indexLengend],
                        type: 'bar',
                        data: this.toFixedTwoNum(item[j])
                    });
                    indexLengend++;
                    color.push(this.normalColor[index]);
                    index++;
                    if (index == this.normalColor.length) {
                        index = 0;
                    }
                }
            }
        }
        data[0].forEach(function (ele) {
            totalSum += ele;
        })
        $('.listTotalNum').html(this.getThousandsBit(this.toFixedTwoNum([totalSum], 0)) + CONSTANT.energy.type[Number(this.selectEnergyId)].unit.name);
        var option = {
            color: color,
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                backgroundColor: 'rgba(230,232,236,0.9)',
                textStyle: {
                    color: '#5C6777'
                },
                formatter: function (data) {
                    console.log(data);
                    var dom = '', sliceName = '', value = '';
                    data.forEach(function (element, index) {
                        var unit = type == 'energy' ? CONSTANT.energy.type[Number(_this.selectEnergyId)].unit.name : CONSTANT.energy.type[Number(_this.selectEnergyId)].unit.name_power;
                        //sliceName = xAxisTime[index].length > 0 && xAxisTime[index][element.dataIndex] ? xAxisTime[index][element.dataIndex] : '--'
                        sliceName = element.axisValue;
                        value = element.value ? element.value : '--';
                        dom += '<div>' + sliceName + '</div>' +
                            '<div><span style="width:8px;height:8px;border-radius:50%;margin-right: 5px;margin-top: 6px;background:' +
                            element.color + ';display:inline-block"></span>' + element.seriesName + '：' + value + unit + '</div>';
                    })
                    return dom;
                },                
                padding: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
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
                data: xAxisTime[0],
                axisLine: {
                    lineStyle: {
                        color: '#eceeef'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                }
            }],
            legend: {
                data: isNormal ? arrLengend : this.pointNameArr,
                top: '2%',
                icon: 'circle',
                itemHeight: '9',
            },
            series: seriesArr
        };
        var chart = echarts.init($('.energyEcharts')[0], this.opt.chartTheme); //AppConfig.chartTheme
        //chart.clear();
        chart.setOption(option, true);
    };
    renderBrokenLine(xAxisTime, data, isNomal, arrLengendData) {
        var _this = this;
        var seriesArr = [];
        var color = [];
        var indexColor = 0;
        var thisCurrentNodeName = this.opt.store && this.opt.store[0] ? this.opt.store[0].name : '';
        if (this.pointNameArr[0].indexOf(thisCurrentNodeName) < 0) {
            for (var i = 0; i < this.pointNameArr.length; i++) {
                this.pointNameArr[i] = thisCurrentNodeName + '-' + this.pointNameArr[i];
            }
        }
       
        if (isNomal) {
            var index = 0;
            for (var i = 0, len = data.length; i < len; i++) {
                var seriesData = [];
                var item = data[i];
                //for(var j = 0; j < item.length; j++){
                //    seriesData = item[j];
                seriesArr.push({
                    name: arrLengendData[index],
                    type: 'line',
                    data: this.toFixedTwoNum(item),
                    symbolSize: 0,
                    smooth: true
                });
                index = index + 1;
                color.push(this.normalColor[indexColor]);
                indexColor++;
                if (indexColor == this.normalColor.length) {
                    indexColor = 0;
                }
                //}
            }
        } else {
            for (var i = 0; i < data.length; i++) {
                seriesArr.push({
                    name: this.pointNameArr[i],
                    type: 'line',
                    data: this.toFixedTwoNum(data[i]),
                    symbolSize: 0,
                    smooth: true
                });
                color.push(this.normalColor[indexColor]);
                indexColor++;
                if (indexColor == data.length) {
                    indexColor = 0;
                }
            }
        }
        var option = {
            color: color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                backgroundColor: 'rgba(230,232,236,0.9)',
                textStyle: {
                    color: '#5C6777'
                },
                padding: 10,
                formatter: '{a0}<br />{b0}: {c0}'+CONSTANT.energy.type[Number(_this.selectEnergyId)].unit.name_power
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
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
                data: xAxisTime.map(function (ele) {
                    return ele.slice(5).slice(0, -3);
                }),
                axisLine: {
                    lineStyle: {
                        color: '#555'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#555'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#555'
                    }
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
                        color: '#555'
                    }
                }
            }],
            legend: {
                data: isNomal ? arrLengendData : this.pointNameArr,
                top: '2%'
            },
            series: seriesArr
        };
        var chart = echarts.init($('.energyEcharts')[0], AppConfig.chartTheme);
        //chart.clear();
        chart.setOption(option, true);
    };
    toFixedTwoNum(item, n) {
        var saveData = [];
        var fixedNum = n || n == 0 ? n : 2;
        saveData = item.map(function (ele) {
            var val = parseFloat(ele);
            return !isNaN(val) ? val.toFixed(fixedNum) : '-';
        });
        return saveData;
    }
    fixedDipkerTime(start, end, format) {
        $('#endTime').val(end);
        $('#iptStartTime').val(start);
        $('.periodHistory').val(format)
    }
    getPostData(timeFormat) {
        var type = $('.energyPover').find('.selected').attr('data-type');
        var postData, queryPost;
        var timeStart = $('#iptStartTime').val();
        var timeEnd = $('#endTime').val();
        var startTime, endTime, queryEndTime, queryStartTime;
        if (timeFormat == 'm5') {
            startTime = toDate(timeStart).format('yyyy-MM-dd HH:mm:ss');
            if (type == 'energy') {
                endTime = toDate(toDate(timeEnd).getTime() + 5 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss');
            } else {
                endTime = toDate(timeEnd).format('yyyy-MM-dd HH:mm:ss');
            }

        } else if (timeFormat == 'h1') {
            if (type == 'energy') {
                endTime = toDate(toDate(timeEnd).getTime() + 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss');
            } else {
                endTime = toDate(timeEnd).format('yyyy-MM-dd HH:mm:ss');
            }
            startTime = toDate(timeStart).format('yyyy-MM-dd HH:mm:ss');

        } else if (timeFormat == 'd1') {

            var bTime = toDate().format('yyyy-MM-dd 00:00:00').split(' ')[1];
            var startTime = toDate(timeStart).format('yyyy-MM-dd HH:mm:ss').split(' ')[0] + ' ' + bTime;
            var endTime = toDate(toDate(timeEnd).getTime() + 86400000).format('yyyy-MM-dd HH:mm:ss').split(' ')[0] + ' ' + bTime;
        } else {

            var bTime = toDate().format('yyyy-MM-dd 00:00:00').split(' ')[1];
            var eTime = timeEnd.split('-');
            var startTime = toDate(timeStart).format('yyyy-MM-dd HH:mm:ss').split(' ')[0] + ' ' + bTime;
            var endTime = toDate(eTime[0], parseInt(eTime[1]), 1).format('yyyy-MM-dd HH:mm:ss').split(' ')[0] + ' ' + bTime;
        }
        postData = {
            dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
            timeEnd: endTime,
            timeFormat: timeFormat,
            timeStart: startTime
        };
        queryPost = {
            dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
            timeEnd: queryEndTime ? queryEndTime : endTime,
            timeFormat: timeFormat,
            timeStart: queryStartTime ? queryStartTime : startTime
        }
        this.onTimeArr.push(postData);
        this.onTime.push({
            timeEnd: endTime,
            timeStart: startTime
        });
        console.log(this.onTimeArr);
        this.postData = queryPost;
        return queryPost;
    };
    timeChange(timeStart, isOn, nowIndex, nextDom) {
        var period = $('.periodHistory').val();
        var type = $('.energyPover').find('.selected').attr('data-type');
        var startTime, endTime, nextEndTime, queryEndTime, endTimeVal;
        var endTimeValue = $('#endTime').val();
        var iptStartTime = $('#iptStartTime').val();
        if (period == 'M1') {
            startTime = timeStart + '-01-01 00:00:00';
            endTimeVal = endTimeValue + '-01-01 00:00:00';
            var nowYear = toDate(timeStart).getFullYear();
            var nowMonth = toDate(timeStart).getMonth();
            var nowDay = toDate(timeStart).getDate();
            nextEndTime = parseInt(timeStart) + 1;
            //endTime = toDate(startTime).getFullYear() == toDate().getFullYear() ? toDate().format('yyyy-MM') + '-01 00:00:00' : toDate(startTime).format('yyyy-12-01 00:00:00');
            endTime = toDate(nowYear,nowMonth+12,nowDay).format('yyyy-MM-dd HH:mm:ss');
            nextEndTime = toDate(endTime).format('yyyy-MM');
            queryEndTime = toDate(endTimeVal).getFullYear() >= toDate().getFullYear() ? toDate().format('yyyy-MM') + '-01 00:00:00' : toDate(endTimeVal).format('yyyy-12-01 00:00:00');
        } else if (period == 'd1') {
            startTime = timeStart + ' 00:00:00';
            endTimeVal = endTimeValue + ' 00:00:00';
            iptStartTime = iptStartTime + ' 00:00:00';
            var dayLength =  (toDate(endTimeVal).getTime() - toDate(iptStartTime).getTime());
            //endTime = nowMonth == toDate().getMonth() ? toDate().format('yyyy-MM-dd 00:00:00') : toDate(nowYear, nowMonth, nowDate).format('yyyy-MM-dd 00:00:00');
            endTime = toDate(toDate(startTime).getTime() + dayLength + 1000 * 60 * 60 * 24).format('yyyy-MM-dd HH:mm:ss');
            nextEndTime = toDate(toDate(startTime).getTime() + dayLength).format('yyyy-MM-dd');
        } else if (period == 'h1') {
            startTime = timeStart + ':00';
            endTimeVal = endTimeValue + ':00';
            iptStartTime = iptStartTime + ':00';
            var hourLength =  (toDate(endTimeVal).getTime() - toDate(iptStartTime).getTime());
            var dayTime = type == 'energy'? hourLength + 3600000 : hourLength;
            nextEndTime = toDate(toDate(startTime).valueOf() + hourLength).format('yyyy-MM-dd HH:00');
            //endTime = toDate(startTime).getDate() == toDate().getDate() ? toDate().format('yyyy-MM-dd HH') + ':00:00' : toDate(startTime).format('yyyy-MM-dd 23:59:59');
            endTime = toDate(toDate(startTime).valueOf() + dayTime).format('yyyy-MM-dd HH:mm:ss');
        } else {
            startTime = timeStart + ':00';
            endTimeVal = endTimeValue + ':00';
            iptStartTime = iptStartTime + ':00';
            var hourLength =  (toDate(endTimeVal).getTime() - toDate(iptStartTime).getTime());     
            var hourTime = type == 'energy'? hourLength + 300000: hourLength;       
            nextEndTime = toDate(toDate(startTime).valueOf() + hourLength).format('yyyy-MM-dd HH:00');
            //endTime = startTime.split(' ')[1].split(':')[0] == toDate().format('yyyy-MM-dd HH').split(' ')[1] ? toDate().format('yyyy-MM-dd HH:mm:ss') : toDate(startTime).format('yyyy-MM-dd HH:59:59');
            endTime = toDate(toDate(startTime).valueOf() + hourTime).format('yyyy-MM-dd HH:mm:00');
        }
        if (isOn) {
            nextDom.val(nextEndTime);
            this.onTimeArr[nowIndex].timeEnd = endTime;
            this.onTimeArr[nowIndex].timeStart = startTime;
            this.onTime[nowIndex].timeStart = endTime;
            this.onTime[nowIndex].timeEnd = startTime;
            //this.onQueryTime();
            this.async.splice(nowIndex,1,this.anYoY(this.onTimeArr[nowIndex]));
            this.columnLine();
        } else {
            this.onTimeArr[0].timeEnd = endTime;
            this.onTimeArr[0].timeStart = startTime;
            this.onTime[0].timeStart = timeStart;
            this.onTime[0].timeEnd = nextEndTime;
            var postData = {
                dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                timeEnd: endTime,
                timeFormat: period,
                timeStart: startTime
            };
            this.postData = postData;
            //this.init(type,postData);
        }
    };
    timeEndChange(timeEnd, isOn, nowIndex, nextDom) {
        var period = $('.periodHistory').val();
        var type = $('.energyPover').find('.selected').attr('data-type');
        var startTime, endTime, nextStartTime, queryEndTime, endTimeVal;
        var endTimeValue = $('#endTime').val();
        var iptStartTime = $('#iptStartTime').val();
        if (period == 'M1') {
            endTime = timeEnd + '-01 00:00:00';
            endTimeVal = endTimeValue + '-01-01 00:00:00';
            var nowYear = toDate(timeEnd).getFullYear();
            var nowMonth = toDate(timeEnd).getMonth();
            var nowDay = toDate(timeEnd).getDate();
            nextEndTime = parseInt(timeStart) + 1;
            startTime = toDate(nowYear, nowMonth - 12, nowDay).format('yyyy-MM-dd HH:mm:ss');
            nextStartTime = toDate(startTime).format('yyyy-MM');
        } else if (period == 'd1') {
            endTime = timeEnd + ' 00:00:00';
            endTimeVal = endTimeValue + ' 00:00:00';
            iptStartTime = iptStartTime + ' 00:00:00';
            var nowYear = toDate(endTime).getFullYear();
            var nowMonth = toDate(endTime).getMonth();
            var nowDay = toDate(endTime).getDate();
            var dayLength =  (toDate(endTimeVal).getTime() - toDate(iptStartTime).getTime());
            startTime = toDate(toDate(endTime).getTime() + dayLength).format('yyyy-MM-dd 00:00:00');
            endTime = toDate(nowYear, nowMonth, nowDay + 1).format('yyyy-MM-dd 00:00:00');
            nextStartTime =toDate(startTime).format('yyyy-MM-dd');
        } else if (period == 'h1') {
            var dayTime = type == 'energy' ? 3600000 : 0;
            endTime = timeEnd + ':00';
            iptStartTime = iptStartTime + ':00';
            endTimeVal = endTimeValue + ':00';
            var hTime =  (toDate(endTimeVal).getTime() - toDate(iptStartTime).getTime());
            nextStartTime = toDate(toDate(endTime).valueOf() - hTime).format('yyyy-MM-dd HH:00');
            startTime = toDate(toDate(endTime).valueOf() - hTime).format('yyyy-MM-dd HH:mm:ss');
            endTime = toDate(toDate(endTime).getTime() + dayTime).format('yyyy-MM-dd HH:mm:ss');
        } else {
            var hourTime = type == 'energy' ? 300000 : 0;
            endTime = timeEnd + ':00';
            iptStartTime = iptStartTime + ':00';
            endTimeVal = endTimeValue + ':00';
            var fiveMinuteTime =  (toDate(endTimeVal).getTime() - toDate(iptStartTime).getTime());
            nextStartTime = toDate(toDate(endTime).valueOf() - fiveMinuteTime).format('yyyy-MM-dd HH:mm');
            startTime = toDate(toDate(endTime).valueOf() - fiveMinuteTime).format('yyyy-MM-dd HH:mm:00');
            endTime = toDate(toDate(endTime).getTime() + hourTime).format('yyyy-MM-dd HH:mm:ss');
        }
        if (isOn) {
            nextDom.val(nextStartTime);
            this.onTimeArr[nowIndex].timeEnd = endTime;
            this.onTimeArr[nowIndex].timeStart = startTime;
            this.onTime[nowIndex].timeStart = endTime;
            this.onTime[nowIndex].timeEnd = startTime;
            this.async.splice(nowIndex,1,this.anYoY(this.onTimeArr[nowIndex]));
            this.columnLine();
        } else {
            this.onTimeArr[0].timeEnd = endTime;
            this.onTimeArr[0].timeStart = startTime;
            this.onTime[0].timeStart = timeStart;
            this.onTime[0].timeEnd = nextEndTime;
            var postData = {
                dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                timeEnd: endTime,
                timeFormat: period,
                timeStart: startTime
            };
            this.postData = postData;
        }
    };    
    attEvent() {
        //时间周期改变时
        $('.periodHistory').off('change').change((e) => {
            var $this = $(e.currentTarget);
            var period = $this.val();
            var startTime, endTime;
            this.cycleCount = 1;
            this.onTimeArr = [];
            this.onTime = [];
            //$('.onTimeBox').empty().remove();
            // $('.onQuery ').hide();
            // $('.slideBtn').removeClass('icon-unfold').addClass('icon-packup');
            if (period == 'h1') {
                endTime = toDate().format('yyyy-MM-dd HH:00');
                startTime = toDate(toDate().valueOf() - 86400000).format('yyyy-MM-dd HH:00');
                $('#iptStartTime').val(startTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    minView: 1,
                    startView: 2
                });
                $('#endTime').val(endTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    minView: 1,
                    startView: 2
                });
                this.getPostData('h1');
            } else if (period == 'd1') {
                var eTime = toDate(toDate().getTime()).format('yyyy-MM-dd');
                startTime = toDate(toDate().getFullYear(), toDate().getMonth() - 1, toDate().getDate()).format('yyyy-MM-dd');
                endTime = toDate(toDate().getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd');
                $('#iptStartTime').val(startTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    minView: 2,
                    startView: 3
                });
                $('#endTime').val(eTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    minView: 2,
                    startView: 3
                });
                this.getPostData('d1');
            } else if (period == 'm5') {
                endTime = toDate().format('yyyy-MM-dd HH:00');
                startTime = toDate(toDate().valueOf() - 3600000).format('yyyy-MM-dd HH:00');
                $('#iptStartTime').val(startTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    minView: 1,
                    startView: 1
                });
                $('#endTime').val(endTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    minView: 1,
                    startView: 1
                });
                this.getPostData('m5');
            } else {
                /*                startTime = toDate().format('yyyy-MM');
                                endTime = toDate(toDate().getFullYear() + 1, toDate().getMonth(), toDate().getDate()).format('yyyy-MM');*/
                endTime = toDate().format('yyyy-MM');
                startTime = toDate(toDate().getFullYear() - 1, toDate().getMonth(), toDate().getDate()).format('yyyy-MM');
                $('#iptStartTime').val(startTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm',
                    autoclose: true,
                    minView: 3,
                    startView: 3
                });
                $('#endTime').val(endTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm',
                    autoclose: true,
                    minView: 3,
                    startView: 3
                });
                this.getPostData('M1');
            }
            this.async = [];
            this.resultArr = [];
            this.async.push(this.childrenColumn());
            this.async.push(this.normalYoY());
        });
        $('.wrapQuery').off('click').on('click', (e) => {
            var $this = $(e.currentTarget);
            if ($this.find('.onTimeBox').length > 0) {
                $('.wrapQuery').height('350');
                if(!$('.slideBtn').hasClass('rot')){
                    $('.slideBtn').addClass('rot')
                }
            }
        });
        $('.slideBtn').off('click').on('click', (e) => {
            var target = $(e.currentTarget);
            if (target.hasClass('rot')) {
                $('.wrapQuery').height('40');
                target.removeClass('rot');
            } else {
                $('.wrapQuery').height('350');
                target.addClass('rot');
            }
            e.stopPropagation();
        })
        //查询按钮事件
        $('#historyQuery').off('click').on('click', function (e) {
            var $this = $(e.currentTarget);
            $('.shortcutBtnBox>div').removeClass('avtive');
            $this.addClass('avtive');
            var type = $('.energyPover').find('.selected').attr('data-type');
            var timeFormat = $('.periodHistory').val();
            this.onTimeArr = [];
            this.onTime = [];
            var postData;
            if (timeFormat == 'm5') {
                postData = this.getPostData('m5');
            } else if (timeFormat == 'h1') {
                postData = this.getPostData('h1');
            } else if (timeFormat == 'd1') {
                postData = this.getPostData('d1');
            } else {
                postData = this.getPostData('M1');
            }
            this.postData = postData;
            if (postData.timeStart == postData.timeEnd) {
                alert('startTime>endTime');
                return;
            }
            this.resetComparison(type);
            this.init(type, postData);
            this.async.push(this.childrenColumn());
        }.bind(this));
        //本年事件
        $('.yearHistoryBtn').off('click').on('click', function (e) {
            var $this = $(e.currentTarget);
            $this.siblings().removeClass('avtive');
            $('#historyQuery').removeClass('avtive');
            $this.addClass('avtive');
            var type = $('.energyPover').find('.selected').attr('data-type');
            var data = toDate();
            var postData = {
                dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                timeEnd: toDate(data.getFullYear() + 1, 1, 1).format('yyyy-01-01 00:00:00'),
                timeFormat: 'M1',
                timeStart: toDate().format('yyyy-01-01 00:00:00')
            };
            this.fixedDipkerTime(toDate().format('yyyy-01-01'), toDate().format('yyyy-12-31'), 'M1')
            this.postData = postData;
            this.resetComparison(type);
            this.async.push(this.childrenColumn());
            this.init(type, postData);
        }.bind(this));
        //本月事件
        $('.monthHistoryBtn').off('click').on('click', function (e) {
            var $this = $(e.currentTarget);
            var date = toDate();
            var currentMonth = date.getMonth();
            var nextMonth = ++currentMonth;
            var nextMonthFirstDay = toDate(date.getFullYear(), nextMonth, 1);
            var endTime = toDate(nextMonthFirstDay).format('yyyy-MM-dd HH:mm:ss');
            $this.siblings().removeClass('avtive');
            $('#historyQuery').removeClass('avtive');
            $this.addClass('avtive');
            var type = $('.energyPover').find('.selected').attr('data-type');
            var postData = {
                dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                timeEnd: endTime,
                timeFormat: 'd1',
                timeStart: toDate().format('yyyy-MM-01 00:00:00')
            };
            this.fixedDipkerTime(toDate().format('yyyy-MM-01'), toDate(toDate(endTime).getTime() - 24 * 60 * 60 * 1000).format('yyyy-MM-dd'), 'd1')
            this.postData = postData;
            this.resetComparison(type);
            this.async.push(this.childrenColumn());
            this.init(type, postData);
        }.bind(this));
        //本日事件
        $('.dayHistoryBtn').off('click').on('click', function (e) {
            var $this = $(e.currentTarget);
            $this.siblings().removeClass('avtive');
            $('#historyQuery').removeClass('avtive');
            $('.wrapQuery').removeClass('conYoYActive');
            $this.addClass('avtive');
            var type = $('.energyPover').find('.selected').attr('data-type');
            var postData = {
                dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                timeEnd: toDate(toDate().getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00'),
                timeFormat: 'h1',
                timeStart: toDate().format('yyyy-MM-dd 00:00:00')
            };
            this.fixedDipkerTime(toDate().format('yyyy-MM-dd 00:00'), toDate().format('yyyy-MM-dd 24:00'), 'h1')
            this.postData = postData;
            this.resetComparison(type);
            this.async.push(this.childrenColumn());
            this.init(type, postData);
        }.bind(this));
        $('.energyPover>div').off('click').on('click', function (e) {
            var $this = $(e.currentTarget)
            var type = $this.attr('data-type');
            $this.siblings().removeClass("selected");
            $this.addClass("selected");
            $('.onTimeBox').empty().remove();
            // $('.onQuery ').hide();
            // $('.slideBtn').removeClass('icon-unfold').addClass('icon-packup');
            var $periodHistory = $('.periodHistory');
            if (type == "power") {
                this.resetComparison(type);
                $periodHistory.find('option[value="d1"]').hide();
                $periodHistory.find('option[value="M1"]').hide();
                $periodHistory.val('h1');
                $periodHistory.trigger('change');
                $('.yearHistoryBtn').hide();
                $('.monthHistoryBtn').hide();
                $('.shortcutBtnBox').width('90px');
            } else {
                $('.wrapQuery').addClass('conYoYActive');
                $periodHistory.find('option[value="d1"]').show();
                $periodHistory.find('option[value="M1"]').show();
                var startTime = toDate(toDate().getFullYear(), toDate().getMonth() - 1, toDate().getDate()).format('yyyy-MM-dd HH:mm:ss');
                var endTime = toDate(toDate().getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss');
                this.postData = {
                    dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                    timeEnd: endTime,
                    timeFormat: 'd1',
                    timeStart: startTime
                }
                this.fixedDipkerTime(toDate(toDate(startTime)).format('yyyy-MM-dd'), toDate().format('yyyy-MM-dd'), 'd1');
                $periodHistory.trigger('change');
                $('.yearHistoryBtn').show();
                $('.monthHistoryBtn').show();
                $('.shortcutBtnBox').width('300px');
            }
            this.onTime = [];
            this.onTimeArr = [];
            this.cycleCount = 1;
            this.async = [];
            this.resultArr = [];
            this.async.push(this.childrenColumn());
            //this.async.push(this.normalYoY());
            //this.getPostData($('.periodHistory').val())
            this.init(type, this.postData);
        }.bind(this));
        //添加同比时间
        $('.wrapQuery').off('click','.addOnqueryTime').on('click','.addOnqueryTime', function () {
            var onTimeBox = '<div class="onTimeBox">' +
                '<div class="totalNumBox"><span>' + i18n_resource.energyManagement.history.TOTAL + '</span><span class="totalConsumption"></span></div>' +
                '<div class="onTimeGroup">' +
                '<div class="input-group">' +
                '<input type="text" class="onTimeStart">' +
                '<span class="addonOn">To</span>' +
                '<input type="text" class="onTimeEnd">' +
                '</div>' +
                '</div>' +
                '<span class="iconfont icon-cuowu removeOnTime"></span>' +
                '</div>'; //glyphicon glyphicon-remove
            // $('.onQuery').show();
            $('.queryTimeBox').append(onTimeBox);
            var type = $('.energyPover').find('.selected').attr('data-type');
            type == 'energy' ? $('.wrapQuery').addClass('conYoYActive') : $('.wrapQuery').removeClass('conYoYActive');
            var period = $('.periodHistory').val();
            var now = toDate();
            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth();
            var nowDay = now.getDate();
            var type = $('.energyPover').find('.selected').attr('data-type');
            var postData, nowVal, nowStartVal, nowEndVal, startTime, endTime;
            Spinner.spin($('#containerDisplayboard')[0]);
            startTime = $('#iptStartTime').val();
            endTime = $('#endTime').val();
            if (this.cycleCount == 1) {
                $('.queryTimeBox').find('.removeOnTime').remove();
                $('.onTimeStart').eq(this.cycleCount - 1).val(startTime);
                $('.onTimeEnd').eq(this.cycleCount - 1).val(endTime);
                $('.queryTimeBox').append(onTimeBox);
            }
            var len = $('.onTimeStart').length;
            if (period == 'M1') {
                //获取去年此时的月份
                var lastStartMonth = startTime.split('-');
                var lastEndTime = endTime.split('-');
                nowStartVal = toDate(lastStartMonth[0] - this.cycleCount, lastStartMonth[1] - 1).format('yyyy-MM-dd HH:mm:ss');
                nowEndVal = toDate(lastEndTime[0] - this.cycleCount, lastEndTime[1] - 1, 31).format('yyyy-MM-dd HH:mm:ss');
                $('.onTimeStart').eq(len - 1).val(toDate(nowStartVal).format('yyyy-MM'))
                .datetimepicker({
                    format: 'yyyy-mm',
                    autoclose: true,
                    minView: 4,
                    startView: 3
                });
                $('.onTimeEnd').eq(len - 1).val(toDate(nowEndVal).format('yyyy-MM'))
                .datetimepicker({
                    format: 'yyyy-mm',
                    autoclose: true,
                    minView: 4,
                    startView: 3
                });
            } else if (period == 'd1') {
                //获取上一个月                
                var lastStartTime = startTime.split('-');
                lastStartTime[1] = lastStartTime[1] - this.cycleCount - 1;
                nowStartVal = toDate(lastStartTime[0], lastStartTime[1], lastStartTime[2]).format('yyyy-MM-dd HH:mm:ss');
/*                var lastEndTime = endTime.split('-');
                lastEndTime[1] = lastEndTime[1] - this.cycleCount - 1;
                nowEndVal = toDate(lastEndTime[0], lastEndTime[1], parseInt(lastEndTime[2]) + 1).format('yyyy-MM-dd HH:mm:ss');
                var eTime  = toDate(lastEndTime[0], lastEndTime[1], parseInt(lastEndTime[2])).format('yyyy-MM-dd HH:mm:ss')*/
                var daylength = (toDate(endTime).getTime() - toDate(startTime).getTime());
                var lastEndTime = endTime.split('-');
                nowEndVal = toDate(toDate(nowStartVal).getTime() + daylength + 1000 * 60 * 60 * 24).format('yyyy-MM-dd HH:mm:ss');
                var eTime = toDate(toDate(nowStartVal).getTime() + daylength).format('yyyy-MM-dd HH:mm:ss')                
                $('.onTimeStart').eq(len - 1).val(toDate(nowStartVal).format('yyyy-MM-dd'))
                .datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    minView: 4,
                    startView: 2
                })
                $('.onTimeEnd').eq(len - 1).val(toDate(eTime).format('yyyy-MM-dd'))
                .datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    minView: 4,
                    startView: 2
                });
            } else if (period == 'h1') {
                //获取前24个小时
                var circleHour = 24 * 60 * 60 * 1000 * this.cycleCount;
                var hourTime = type == 'energy' ?  60 * 60 *1000 : 0;
                nowStartVal = toDate(toDate(startTime).getTime() - circleHour).format('yyyy-MM-dd HH:mm:ss');
                var eTime = toDate(toDate(endTime).getTime() - circleHour).format('yyyy-MM-dd HH:mm:ss');
                nowEndVal = toDate(toDate(eTime).getTime() + hourTime).format('yyyy-MM-dd HH:mm:ss');
                $('.onTimeStart').eq(len - 1).val(toDate(toDate(nowStartVal).getTime()).format('yyyy-MM-dd HH:mm'))
                .datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    minView: 1,
                    startView: 1
                });
                $('.onTimeEnd').eq(len - 1).val(toDate(toDate(eTime).getTime()).format('yyyy-MM-dd HH:mm'))
                .datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    minView: 1,
                    startView: 1
                });
            } else {
                var circleHour = 24 * 60 * 60 * 1000 * this.cycleCount;
                var fiveMinutes = type == 'energy' ? 60 * 1000 * 5 : 0;
                nowStartVal = toDate(toDate(startTime).getTime() - circleHour).format('yyyy-MM-dd HH:mm:ss');
                var eTime = toDate(toDate(endTime).getTime() - circleHour).format('yyyy-MM-dd HH:mm:ss');
                nowEndVal = toDate(toDate(eTime).getTime() + fiveMinutes).format('yyyy-MM-dd HH:mm:ss');
                $('.onTimeStart').eq(len - 1).val(toDate(toDate(nowStartVal).getTime()).format('yyyy-MM-dd HH:mm'))
                .datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    minView: 1,
                    startView: 2
                });
                $('.onTimeEnd').eq(len - 1).val(toDate(toDate(eTime).getTime()).format('yyyy-MM-dd HH:mm'))
                .datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    minView: 1,
                    startView: 2
                });

            }
            postData = {
                dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                timeEnd: nowEndVal,
                timeFormat: period,
                timeStart: nowStartVal
            }
            this.async.push(this.anYoY(postData));
            if (this.onTimeArr.length == 0) {
                this.getPostData(period);
            }
            this.onTimeArr.push(postData);
            this.onTime.push({
                timeEnd: nowEndVal,
                timeStart: nowStartVal
            });
            this.cycleCount += 1;
            this.columnLine();
            //this.onQueryTime();
            this.attEvent();
        }.bind(this));
        // $('.slideBtn').off('click').on('click',(e)=>{
        //     var $this = $(e.currentTarget);
        //     e.stopPropagation();
        //     if($this.hasClass('icon-packup')){
        //         $this.removeClass('icon-packup');
        //         $this.addClass('icon-unfold');
        //         $('.onQuery').slideUp(1000);
        //     }else{
        //         $this.removeClass('icon-unfold');
        //         $this.addClass('icon-packup');
        //         $('.onQuery').slideDown(500);
        //     }
        // });
        //开始时间更改事件
        $('#iptStartTime').off('change').on('change', (e) => {
            var $this = $(e.currentTarget);
            var timeStart = $this.val();
            //this.timeChange(timeStart);
        });
        //同比查询时间更改事件
        $('.onTimeStart').off('change').on('change', function (e) {
            var $this = $(e.currentTarget);
            var timeStart = $this.val();
            var period = $('.periodHistory').val();
            var nowIndex = $this.parents('.onTimeBox').index();
            var nextDom = $this.siblings('.onTimeEnd');
            this.timeChange(timeStart, true, nowIndex, nextDom);
        }.bind(this));
        $('.onTimeEnd').off('change').on('change', function (e) {
            var $this = $(e.currentTarget);
            var timeEnd = $this.val();
            var period = $('.periodHistory').val();
            var nowIndex = $this.parents('.onTimeBox').index();
            var nextDom = $this.siblings('.onTimeStart');
            this.timeEndChange(timeEnd, true, nowIndex, nextDom);
        }.bind(this));        
        //同比时间删除事件
        $('.removeOnTime').off('click').on('click', function (e) {
            var $this = $(e.currentTarget);
            var index = $this.parents('.onTimeBox').index();
            this.onTimeArr.splice(index, 1);
            this.resultArr.splice(index, 1);
            this.async.splice(index, 1);
            this.onTime.splice(index, 1);
            $this.parents('.onTimeBox').empty().remove();
            //this.cycleCount = this.cycleCount - 1;
            this.initColumnLine();
            //this.onQueryTime();
       
        }.bind(this));
    };
    childrenColumn() {
        // return $.Deferred().resolve();
        var type = $('.energyPover').find('.selected').attr('data-type');
        return WebAPI.post('/analysis/startWorkspaceDataGenHistogram' + (type == 'energy' ? '/increment/v2' : ''), this.postData)
    };
    normalYoY() {
        var period = $('.periodHistory').val();
        if (this.onTimeArr.length == 0) {
            this.getPostData(period);
        }
        var type = $('.energyPover').find('.selected').attr('data-type');
        var thisNodePoint = type == 'energy' ? this.opt.store[0].config.energy : this.opt.store[0].config.power;
        this.onTimeArr[0].dsItemIds = [thisNodePoint];
        return WebAPI.post('/analysis/startWorkspaceDataGenHistogram' + (type == 'energy' ? '/increment' : ''), this.onTimeArr[0])
    };
    anYoY(postData) {
        var type = $('.energyPover').find('.selected').attr('data-type');
        var thisNodePoint = type == 'energy' ? this.opt.store[0].config.energy : this.opt.store[0].config.power;
        postData.dsItemIds = [thisNodePoint];
        return WebAPI.post('/analysis/startWorkspaceDataGenHistogram' + (type == 'energy' ? '/increment' : ''), postData).always(() => {
            Spinner.stop();
        })
    };
    columnLine() {
        var _this = this;
        $.when.apply(this, this.async).done(function () {
            //console.log(resultArr)
            //var resultsArr =  Array.prototype.slice.apply(arguments);
            var resultsArr = [];
            var len = _this.async.length;
            var store = {};
            if (len == 1) {
                resultsArr.push(arguments[0])
            } else {
                for (var i = 0; i < len; i++) {
                    store = {
                        timeShaft: arguments[i][0].timeShaft,
                        list: arguments[i][0].list,
                    }
                    resultsArr.push(store)
                }
            }
            _this.initColumnLine(resultsArr);
        }).always(function () {
            //_this.async = [];
        });
    };
    initColumnLine(argumentsArr) {
        if (this.resultArr.length == 0) {
            if (argumentsArr) {
                this.resultArr = argumentsArr;
            }
        } else {
            if (argumentsArr) {
                //this.resultArr = this.resultArr.concat(argumentsArr);
                this.resultArr = argumentsArr;
            }
        }
        //this.resultArr = this.resultArr.length==0?argumentsArr:this.resultArr.concat(argumentsArr);
        var type = $('.energyPover').find('.selected').attr('data-type');
        var period = $('.periodHistory').val();
        var arrLegendData = [];
        var timeShaftArr = [];
        var dataArr = [];
        var seriesArr = [],
            totalSum = 0,
            xAxiesArr = [];
        /*        for (var item of this.pointNameArr) {
                    arrLegendData.push(item);
                }*/
        for (var i = 0; i < this.resultArr.length; i++) {
            var item = this.resultArr[i];
            var consumption = item.list[0].data.length && item.list[0].data.reduce(function (pre, cur) {
                return pre + cur;
            });
            var totalSumption = consumption ? this.getThousandsBit(this.toFixedTwoNum([consumption],0)) + CONSTANT.energy.type[Number(this.selectEnergyId)].unit.name : '--';
            totalSum += consumption ? parseFloat(this.toFixedTwoNum([consumption])) : 0;
            $('.totalConsumption').eq(i).html(totalSumption);
            // if (i == 0) {
            //     for (var j = 0; j < item.list.length; j++) {
            //         dataArr.push(item.list[j].data);
            //         if (type == 'energy') {
            //             seriesArr.push({
            //                 name: this.pointNameArr[j],
            //                 type: 'bar',
            //                 stack: '累积量',
            //                 data: this.toFixedTwoNum(item.list[j].data)
            //             })
            //         } else {
            //             seriesArr.push({
            //                 name: this.pointNameArr[j],
            //                 type: 'line',
            //                 symbolSize: 0,
            //                 smooth: true,
            //                 data: this.toFixedTwoNum(item.list[j].data)
            //             })
            //         }
            //     }
            // } else {
            var currentLegend;
            if (period == 'd1') {
                currentLegend = this.opt.store[0].name + ':' + (item.timeShaft.length == 0 ? '' : item.timeShaft[0].split(' ')[0]);
            } else if (period == 'M1') {
                currentLegend = this.opt.store[0].name + ':' + (item.timeShaft.length == 0 ? '' : item.timeShaft[0].split(' ')[0].split('-')[0]);
            } else if (period == 'h1') {
                currentLegend = this.opt.store[0].name + ':' + (item.timeShaft.length == 0 ? '' : item.timeShaft[0].split(' ')[0]);
            } else {
                currentLegend = this.opt.store[0].name + ':' + (item.timeShaft.length == 0 ? '' : item.timeShaft[0].split(' ')[0]);
            }
            arrLegendData.push(currentLegend);
            timeShaftArr.push(item.timeShaft);
            dataArr.push(item.list[0].data);
            if (type == 'energy') {
                seriesArr.push({
                    name: currentLegend,
                    type: 'bar',
                    symbolSize: 0,
                    smooth: true,
                    data: this.toFixedTwoNum(item.list[0].data)
                });
            } else {
                seriesArr.push({
                    name: currentLegend,
                    type: 'line',
                    symbolSize: 0,
                    smooth: true,
                    data: this.toFixedTwoNum(item.list[0].data)
                });
            }
            //}
        }
        $('.listTotalNum').html(this.getThousandsBit(this.toFixedTwoNum([totalSum],0)) + CONSTANT.energy.type[Number(this.selectEnergyId)].unit.name); //total总和
        /*        timeShaftArr.sort(function (a, b) {
                    return b.length - a.length
                });
                var timeShaftArrMx = timeShaftArr[0];
                for (var i = 0; i < timeShaftArrMx.length; i++) {
                    if (period == 'd1') {
                        //xAxiesArr.push('Day' + toDate(timeShaftArrMx[i]).getDate());
                        xAxiesArr.push(timeShaftArrMx[i]);
                    } else if (period == 'M1') {
                        //xAxiesArr.push('Month' + (toDate(timeShaftArrMx[i]).getMonth() + 1));
                        xAxiesArr.push(timeShaftArrMx[i]);
                    } else if (period == 'h1') {
                        //xAxiesArr.push('Hour' + (parseInt(timeShaftArrMx[i].split(' ')[1].split(':')[0]) + 1));
                        xAxiesArr.push(timeShaftArrMx[i]);
                    } else {
                        //xAxiesArr.push('Minute' + (parseInt(timeShaftArrMx[i].split(':')[1])));
                        xAxiesArr.push(timeShaftArrMx[i]);
                    }
                }*/
        if (type == 'energy') {
            this.columnLineEchart(timeShaftArr, arrLegendData, seriesArr)
        } else {
            this.renderBrokenLine(timeShaftArr[0], dataArr, true, arrLegendData);
        }

    }
    columnLineEchart(xAxiesArr, arrLegendData, seriesArr) {
        var _this = this;
        var type = $('.energyPover').find('.selected').attr('data-type');
        var axiesArray = [];
        /*        xAxiesArr.forEach(function (element, index) {
                    axiesArray.push({
                        show: false,
                        type: 'category',
                        data: element,
                        axisLine: {
                            lineStyle: {
                                color: '#555'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#555'
                            }
                        }
                    })
                    if(index == 0){
                        axiesArray[0].show = true;
                    }
                })*/
        var option = {
            color: this.normalColor,
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                backgroundColor: 'rgba(230,232,236,0.9)',
                textStyle: {
                    color: '#5C6777'
                },
                padding: 10,
                formatter: function (data) {
                    var unit = type == 'energy' ? CONSTANT.energy.type[Number(_this.selectEnergyId)].unit.name : CONSTANT.energy.type[Number(_this.selectEnergyId)].unit.name_power;
                    var dom = '', sliceName = '', value = '';
                    data.forEach(function (element, index) {
                        //sliceName = xAxiesArr[index].length > 0 && xAxiesArr[index][element.dataIndex] ? xAxiesArr[index][element.dataIndex] : '--'
                        sliceName = element.axisValue;
                        value = element.value ? element.value : '--';
                        dom += '<div>' + sliceName + '</div>' +
                            '<div><span style="width:8px;height:8px;border-radius:50%;margin-right: 5px;margin-top: 6px;background:' +
                            element.color + ';display:inline-block"></span>' + element.seriesName + '：' + value + unit + '</div>';
                    })
                    return dom;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
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
                data: xAxiesArr[0],
                axisLine: {
                    lineStyle: {
                        color: '#555'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#555'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#555'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#555'
                    }
                }
            }],
            legend: {
                data: arrLegendData,
                top: '2%',
                icon: 'circle',
                itemHeight: '9',
            },
            series: seriesArr
        }
        var chart = echarts.init($('.energyEcharts')[0], AppConfig.chartTheme);
        //chart.clear();
        chart.setOption(option, true);
    }
    onQueryTime() {
        var type = $('.energyPover').find('.selected').attr('data-type');
        var period = $('.periodHistory').val();
        Spinner.spin($('#containerDisplayboard')[0]);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', this.onTimeArr).done(resultData => {
            var arrLegendData = [];
            var xAxiesArr = [];
            var timeShaftArr = [];
            var dataArr = [];
            if (resultData && resultData.length > 0) {
                for (var i = 0; i < resultData.length; i++) {
                    var item = resultData[i];
                    timeShaftArr.push(item.timeShaft);
                    dataArr[i] = [];
                    for (var j = 0; j < item.list.length; j++) {
                        var point = item.list[j];
                        dataArr[i][j] = point.data;
                        if (period == 'd1') {
                            arrLegendData.push(this.pointNameArr[j] + ':' + (item.timeShaft.length == 0 ? '' : item.timeShaft[0].split(' ')[0].split('-')[0] + '-' + item.timeShaft[0].split(' ')[0].split('-')[1]));
                        } else if (period == 'M1') {
                            arrLegendData.push(this.pointNameArr[j] + ':' + (item.timeShaft.length == 0 ? '' : item.timeShaft[0].split(' ')[0].split('-')[0]));
                        } else if (period == 'h1') {
                            arrLegendData.push(this.pointNameArr[j] + ':' + (item.timeShaft.length == 0 ? '' : item.timeShaft[0].split(' ')[0]));
                        } else {
                            arrLegendData.push(this.pointNameArr[j] + ':' + (item.timeShaft.length == 0 ? '' : item.timeShaft[0].split(':')[0]));
                        }
                    }
                }
/*                timeShaftArr.sort(function (a, b) {
                    return b.length - a.length
                });*/
                var timeShaftArrMx = timeShaftArr[0];
                for (var i = 0; i < timeShaftArrMx.length; i++) {
                    if (period == 'd1') {
                        //xAxiesArr.push('Day' + toDate(timeShaftArrMx[i]).getDate());
                        xAxiesArr.push(timeShaftArrMx[i]);
                    } else if (period == 'M1') {
                        //xAxiesArr.push('Month' + (toDate(timeShaftArrMx[i]).getMonth() + 1));
                        xAxiesArr.push(timeShaftArrMx[i]);
                    } else if (period == 'h1') {
                        //xAxiesArr.push('Hour' + (parseInt(timeShaftArrMx[i].split(' ')[1].split(':')[0]) + 1));
                        xAxiesArr.push(timeShaftArrMx[i]);
                    } else {
                        //xAxiesArr.push('Minute' + (parseInt(timeShaftArrMx[i].split(':')[1])));
                        xAxiesArr.push(timeShaftArrMx[i]);
                    }
                }
            } else {
                infoBox.alert('no data');
            }
            if (type == 'energy') {
                this.renderStackedColumn(timeShaftArr, dataArr, true, arrLegendData);
            } else {
                this.renderBrokenLine(xAxiesArr, dataArr, true, arrLegendData);
            }
        }).always(() => {
            Spinner.stop();
        });
    };
    onNodeClick(nodes) {
        this.nodesArr = nodes;
        this.getPointChildren(true);
        console.log(nodes)
    };
    getThousandsBit(num) {　　
        var re = /\d{1,3}(?=(\d{3})+$)/g;　　
        var n1 = num.toString().replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
            return s1.replace(re, "$&,") + s2;
        });　　
        return n1;
    }
    onTimeChange(time) {
        var type = $('.energyPover').find('.selected').attr('data-type');
        var timeFormat = $('.periodHistory').val();
        var postD = {
            dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
            timeEnd: time >= toDate().format('yyyy-MM-dd') ? toDate().format('yyyy-MM-dd HH:mm:ss') : toDate(time).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: timeFormat,
            timeStart: time >= toDate().format('yyyy-MM-dd') ? toDate().format('yyyy-MM-01 00:00:00') : toDate(time).format('yyyy-MM-01 00:00:00')
        }
        this.postData = postD;
        this.init(type, postD)
    }
    resetComparison(type) {
        type == 'energy' ? $('.wrapQuery').addClass('conYoYActive') : $('.wrapQuery').removeClass('conYoYActive');
        $('.onTimeBox').empty().remove();
        $('.wrapQuery').height('40');
        this.async = [];
        this.resultArr = [];
        this.cycleCount = 1;
    }
    close() {
        this.opt = null;
        this.nodesArr = null;
        this.pointEnergyArr = null;
        this.pointPowerArr = null;
        this.normalColor = null;
        this.onTimeArr = null;
        this.onTime = null;
        this.postData = null;
    }
}
/**
 * Created by win7 on 2017/3/1.
 */

var FixedPoint = (function () {
    var _this;

    function FixedPoint(point) {
        _this = this;
        this.container = "";
        this._id = point._id;
        this.type = point.type;
        this.node = point;
        this.tempChart = undefined;
        this.qualityChart = undefined;
        this.dictAlarm = {
            0: '无报警',
            1: '硬件报警',
            2: '上限报警'
        }
    }

    FixedPoint.prototype = {
        show: function () {
            this.init();
        },
        init: function () {
            $('#divMap').append('<div class="MFrghList"></div>');
            this.container = $('.MFrghList');
            WebAPI.get('/static/app/LogisticsPlantform/views/fixedMoveScreen.html').done(function (result) {
                _this.container.append($(result));
                _this.renderInfo();
            });
        },
        renderInfo: function () {
            var postType = {
                "fixed":0,
                "move":1,
                "coolStorage": 2
            };
            WebAPI.get('/logistics/thing/getDetail/' + this._id + '/'+postType[this.type ]+'').done(function (result) {
                _this.showDotInfo(result.data);
            });
        },
        showDotInfo: function (data) {
            var infoCtn = this.container[0].querySelector(".MFparameters .paramList");
            var strHtml = '', tplHtml = '<div class="param"><span>温度</span><span>{temp}</span></div>\
                <div class="param"><span>湿度</span><span>{humidity}</span></div>\
                <div class="param"><span>报警状态</span><span>{alarm}</span></div>\
                <div class="param"><span>联机状态</span><span>{online}</span></div>\
                <div class="param"><span>库门状态</span><span>{doorstatus}</span></div>\
                <div class="param"><span>压缩机状态</span><span>{comstatus}</span></div>\
                <div class="param"><span>压缩机工作时长</span><span>{workhours}</span></div>\
                <div class="param lstParam"><span>采集时间</span><span>{updateTime}</span></div>';

            var strPar = '' ,paramHtml = '<div class="param"><span>温度</span><span>{temp}</span></div>\
                <div class="param"><span>速度</span><span>{speed}</span></div>\
                <div class="param"><span>状态</span><span>{status}</span></div>\
                <div class="param"><span>位置</span><span>{area}<!--<span class="queryTrack">轨迹查询</span>--></span></div>\
                <div class="param lstParam"><span>采集时间</span><span>{gpstime}</span></div>';

            var strCool = '', coolHtml = '<div class="param"><span>温度</span><span>{temp}</span></div>\
            <div class="param"><span>经度</span><span>{longitude}</span></div>\
            <div class="param"><span>纬度</span><span>{latitude}</span></div>\
            <div class="param"><span>采集时间</span><span>{updateTime}</span></div>';
            $('.paramIst').html(data.name);
            if (this.type == "move") {
                strPar += (paramHtml.formatEL({
                    temp: (data.option.temp || data.option.temp == 0) ? data.option.temp + '℃' : "--",
                    speed: data.option.speed ? data.option.speed : "--",
                    status: data.option.status ? data.option.status : "--",
                    area: data.option.area ? data.option.area : "--",
                    gpstime: data.option.updateTime ? new Date(data.option.gpstime).timeFormat() : "--"
                }));
                $(infoCtn).html(strPar);
            } else if (this.type == "fixed") {
                strHtml += (tplHtml.formatEL({
                    temp: (data.option.temp || data.option.temp == 0)? data.option.temp + '℃' : "--",
                    humidity: data.option.humidity ? data.option.humidity + '%' : "--",
                    alarm: this.dictAlarm[data.option.alarm] ? this.dictAlarm[data.option.alarm] : "--",
                    online: data.option.online ? data.option.online : "--",
                    doorstatus: data.option.doorstatus ? data.option.doorstatus : "--",
                    comstatus: data.option.comstatus ? data.option.comstatus : "--",
                    workhours: data.option.workhours ? data.option.workhours : "--",
                    updateTime: data.option.updateTime ? new Date(data.option.gpstime).timeFormat() : "--"
                }));
             $(infoCtn).html(strHtml);   
            } else if (this.type == "coolStorage") {
                strCool += (coolHtml.formatEL({
                    temp: (data.option.temp || data.option.temp == 0)? data.option.temp + '℃' : "--",
                    longitude: data.option.lng ? data.option.lng : "--",
                    latitude: data.option.lat ? data.option.lat : "--",
                    updateTime: data.option.updateTime ? new Date(data.option.gpstime).timeFormat() : "--"
                }));
                $(infoCtn).html(strCool);
            }
            this.renderTempChart();
            this.attachEvent();
        },
        renderTempChart: function () {
            var ctnHeight = $('#MFPointContainer').height();
/*            var echartHeight = parseInt(((ctnHeight - $('.MFparameters').height()) / 2 - 23) / ctnHeight*100) + '%';
            $('.MFtempTrends').css({'height': echartHeight});
            $('.MFqualifiedTrends').css({'height': echartHeight});*/
            this.tempChart = echarts.init(this.container[0].querySelector(".tempChart"));
            this.qualityChart = echarts.init(this.container[0].querySelector(".qualityChart"));

            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                },
                grid: {
                    top: '10%',
                    right: '0',
                    left: '0',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: ['5px', '50px'],
                    splitNumber: 4,
                    axisTick: {
                        show: false
                    },                    
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
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
                        show: true,
                        margin: 4,
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                }],
                series: [{
                    name: '温度',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    },
                    areaStyle: {
                        normal: {
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(137,189,2,0.27)',
                            borderWidth: 12
                        }
                    },
                    data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
                }]
            };

            var rateOption = $.extend(true,{},option);
            var date_start = new Date(), data_end = new Date();
            date_start.setDate(date_start.getDate() - 1);
            data_end.setDate(data_end.getDate());            
            var postData = {
                projectId:425,
                pointList: [this._id+'_T'],
                timeStart: date_start.format("yyyy-MM-dd HH:mm:ss"),
                timeEnd: data_end.format("yyyy-MM-dd HH:mm:ss"),
                timeFormat: 'm5',
                prop:{}
            }
            
            //温度趋势曲线
            WebAPI.post("/get_history_data_padded", postData).done(function (result) {
                if(!result[0]) return;
                var rs = result[0].history;
                var xData = [],seriesData = [];
                for(var i=0;i<rs.length;i++){
                    if (_this.type == 'coolStorage') {
                        seriesData.push(rs[i].value);
                        xData.push(rs[i].time);
                    } else {
                        if(rs[i].error == false){
                            seriesData.push(rs[i].value);
                        }else{
                            seriesData.push('--');
                        }
                        xData.push(rs[i].time);
                    }
                    
                }
                option.yAxis[0].axisLabel.formatter = '{value}℃';
                option.tooltip.formatter = '{b} </br> {a}:{c}℃';
                option.xAxis[0].data = xData;
                option.series[0].data = seriesData;
                option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(57, 122, 201, 0.6)'
                }, {
                    offset: 0.8,
                    color: 'rgba(57, 122, 201, 0)'
                }], false);
                option.series[0].itemStyle.normal = {
                    color: '#397ac9'
                };
                _this.tempChart.setOption(option);
            });

            //合格率趋势
            var ptRateData = Object.assign({}, postData);
            ptRateData.pointList = [this._id + '_RATE'];
            var rateStartTime = date_start.setDate(date_start.getDate() - 6);
            ptRateData.timeStart = new Date(rateStartTime).format("yyyy-MM-dd 00:00:00");
            ptRateData.timeEnd = new Date(data_end.setDate(data_end.getDate()-1)).format("yyyy-MM-dd 00:00:00"); 
            ptRateData.timeFormat = 'd1';
            WebAPI.post("/get_history_data_padded", ptRateData).done(function (result) {
                console.log(result);
                if (!result[0]) return;
                var rs = result[0].history;
                var xData = [],
                    seriesData = [];
                for (var i = 0; i < rs.length; i++) {
                    if (rs[i].value) {
                        if (_this.type == 'coolStorage') {
                            seriesData.push((rs[i].value.quarate * 100).toFixed(2));
                            xData.push(rs[i].time);
                        } else {
                            if(rs[i].error == false){
                                seriesData.push((rs[i].value.quarate * 100).toFixed(2));
                            }else{
                                seriesData.push("--");
                            }
                            xData.push(rs[i].time);
                        }
                    }
                }
                rateOption.tooltip.formatter = '{b} </br> {a}:{c}%';
                rateOption.yAxis[0].axisLabel.formatter = '{value}%';
                rateOption.xAxis[0].data = xData;
                rateOption.series[0].type = 'bar';
                rateOption.series[0].name = '合格率';
                rateOption.series[0].data = seriesData;                
                rateOption.series[0].itemStyle.normal= {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(239, 189, 0,0.65)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(239, 189, 0, 0.32)'
                    }], false)
                };
                _this.qualityChart.setOption(rateOption);
            });
            window.onresize = function() {
                _this.tempChart.resize();
                _this.qualityChart.resize();
            };
         
        },
        renderRateChart: function(){

        },
        attachEvent: function () {
            $('#showFMDetail').off('click').on('click', e => {
                this.close();
                Router.to(OnlineHistory, [_this.node]);
            });

        },
        close: function () {
            $(this.container).remove();
            this.qualityChart && this.qualityChart.dispose();
            this.tempChart && this.tempChart.dispose();
        }
    }

    return FixedPoint;
})();
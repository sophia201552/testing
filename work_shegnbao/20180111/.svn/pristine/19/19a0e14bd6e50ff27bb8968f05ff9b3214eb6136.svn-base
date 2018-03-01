/**
 * Created by vivian on 2017/6/23.
 */
class EnergyParameter {
    constructor(opt) {
        this.opt = opt;
        this.timeConfig = opt.timeConfig;
        this.ctn = undefined;
        this.moduleCtn = undefined;
        this.nodeList = opt.store[0].config;
        this.conTime = {
            startTime: new Date().format('yyyy-MM-dd 00:00:00'),
            endTime: new Date().format('yyyy-MM-dd HH:mm:ss'),            
        };
        this.typeModule = 'EnergyParameter';
        this.echartGradientList = {
            dayLine: [{offset: 0,color: '#ffd843'}, {offset: 1, color: '#70d35f'}],
            dayArea: [{offset: 0,color: 'rgba(112,211,95,0.3)'}, {offset: 1,color: 'rgba(255,216,67,0.3)'}],
            monthLine: [{offset: 0,color: '#c292f0'}, {offset: 1,color: '#6091ff'}],
            monthArea: [{offset: 0,color: 'rgba(96,145,255,0.3)'}, {offset: 1,color: 'rgba(194,146,240,0.3)'}],
            yearLine: [{offset: 0,color: '#86a9f6'}, { offset: 1,color: '#5edbed'}],
            yearArea: [{offset: 0, color: 'rgba(94,219,237,0.3)'}, {offset: 1,color: 'rgba(134,169,246,0.3)'}]
        }
    }
    show() {
        this.init();
    }
    init() {
        var _this = this;
        WebAPI.get('/static/app/EnergyManagement/views/module/energyParameter.html').done(function (result) {
            _this.ctn = document.getElementById('containerDisplayboard');            
            _this.ctn.innerHTML = result;
            _this.initQueryTime();
            if(_this.nodeList){
                _this.parameterAnaly();
            }            
            _this.attachEvent();
        }).always(function(){
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
        var _this = this;
        $('.divTabModule').off('click').on('click', '.ParameterOrTable', function (e) {
            var $targetDom = $(e.currentTarget);
            _this.typeModule = $targetDom.attr('type-model');
            _this.typeModule == 'EnergyParameter' ? _this.init() : _this.renderMeterTable();
            $(this).addClass('cur').siblings().removeClass('cur');
        });
        $('.mBtnQuery').off('click').on('click',function(e){
            var $iptSelectTime = $('.iptSelectTime').val();
            _this.timeConfig.startTime = new Date($iptSelectTime).format('yyyy-MM-dd 00:00:00');
            _this.timeConfig.endTime =new Date($iptSelectTime).format('yyyy-MM-dd 23:59:59');
            _this.renderTotalTable();
        })
    }
    renderMeterTable() {
        var _this = this;
        $('.analyBody').hide();
        $('.meterTable').show();
        this.renderTotalTable();
    }
    onNodeClick(nodes) {
        this.nodeList = nodes[0].config; 
        if(nodes[0].isParent){
            this.typeModule == 'EnergyParameter' ? this.parameterAnaly() : this.renderTotalTable();
        } 
    }
    onTimeChange(time) {
        this.timeConfig = time;
        this.typeModule == 'EnergyParameter' ? this.parameterAnaly() : this.renderTotalTable();
    }
    //渲染参数分析
    parameterAnaly() {
        this.renderTrendyChart();
        this.renderParameterTable();
        this.renderConsumptionMoule();
    }
    renderParameterTable() {
        var _this = this;  
        var $totalMeterTable = $('.totalMeterTable');
        var psIds = this.nodeList.detail.map(function(ele){
            return ele.point;
        }); 

/*        var endTime = new Date().format('yyyy-MM-dd HH:00:00');  
        var startTime = new Date(new Date(endTime).getTime() - 1 * 60 * 60 * 1000).format('yyyy-MM-dd HH:00:00');    */    
        var endTime = this.timeConfig.split(' ')[0] + ' ' +new Date().format('yyyy-MM-dd HH:00:00').split(' ')[1];
        var startTime = new Date(new Date(endTime).getTime() - 1 * 60 * 60 * 1000).format('yyyy-MM-dd HH:00:00');        
        var postData = {
            dsItemIds: psIds,
            timeEnd: new Date(new Date(startTime).getTime()).format('yyyy-MM-dd HH:59:59'),
            timeFormat: "h1",
            timeStart: startTime
        };
        Spinner.spin($('.analyBody')[0]);       
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(function (result) {
            $totalMeterTable.empty();
            if(!result.list) return;
            $('.updateTime').html('Update: ' + result.timeShaft + '');
            for (var i = 0; i * 3 < result.list.length; i++) {
                var sData = _this.getParameterValue(result.list[i * 3]);
                var $meterTableRow = $('<div class="meterTableRow"></div>');
                $meterTableRow.append(' <span>' + sData.name + '</span><span class="spValue" data-point="'+_this.nodeList.detail[i * 3].point+'">' + sData.value + '</span>');
                if(_this.nodeList.detail[i * 3 + 1]){
                    sData = _this.getParameterValue(result.list[i * 3 + 1]);
                    $meterTableRow.append(' <span>' + sData.name + '</span><span class="spValue" data-point="'+_this.nodeList.detail[i * 3+1].point+'">' + sData.value + '</span>');
                }
                if(_this.nodeList.detail[i * 3 + 2]){
                     sData = _this.getParameterValue(result.list[i * 3 + 2]);
                    $meterTableRow.append(' <span>' + sData.name + '</span><span class="spValue" data-point="'+_this.nodeList.detail[i * 3+2].point+'">' + sData.value + '</span>');
                }
                $totalMeterTable.append($meterTableRow);
            }
            $totalMeterTable.find('.spValue').off('click').on('click',function(e){
                var $point = $(e.currentTarget).attr('data-point');
                _this.renderParaPointChart($point);
            });
        }).always(function(){
            Spinner.stop();
        });
    }
    renderConsumptionMoule(psPoint) {
        var _this = this;
        var energyPoint = psPoint ? psPoint : this.nodeList.energy;
        var sTime = new Date(this.timeConfig).format('yyyy-MM-dd 23:59:59');         
        if(new Date().format('yyyy-MM-dd') == this.timeConfig.split(' ')[0]){
            sTime = new Date().format('yyyy-MM-dd HH:00:00');
        }
        var eTime = this.timeConfig ? this.timeConfig : ''          
        var postData = {
            dsItemIds: [this.nodeList.energy],
            timeEnd: sTime,
            timeFormat: 'h1',
            timeStart: new Date(this.timeConfig).format('yyyy-MM-dd 00:00:00')
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment', postData).done(function (result) {
            if (!result) return;
            result.list[0].data.length > 0 ? $('.spDayValue').html(_this.getThousandsBit(_this.getAccumulation(result))): $('.spDayValue').html('--');
        });
        var postMonthData = {
            dsItemIds: [this.nodeList.energy],
            timeEnd: new Date(this.timeConfig).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'd1',
            timeStart: new Date(this.timeConfig).format('yyyy-MM-01 00:00:00')
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment', postMonthData).done(function (result) {
            if (!result) return;
            result.list[0].data.length > 0 ? $('.spMonthValue').html(_this.getThousandsBit(_this.getAccumulation(result))): $('.spMonthValue').html('--');
        });
        var postYearData = {
            dsItemIds: [this.nodeList.energy],
            timeEnd: new Date(this.timeConfig).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'M1',
            timeStart: new Date(this.timeConfig).format('yyyy-01-01 00:00:00')
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment', postYearData).done(function (result) {
            if (!result) return;
            result.list[0].data.length > 0 ? $('.spYearValue').html(_this.getThousandsBit(_this.getAccumulation(result))): $('.spYearValue').html('--');           
        });                 
    }
    renderTrendyChart(psPoint) {
        var _this = this;
        var energyPoint = psPoint ? psPoint : this.nodeList.energy;
        var lastData = {
            'hours':86400000,
            'days':2592000000,
            'months':31104000000
        }
        var sTime = new Date(this.timeConfig).format('yyyy-MM-dd 23:59:59');         
        if(new Date().format('yyyy-MM-dd') == this.timeConfig.split(' ')[0]){
            sTime = new Date().format('yyyy-MM-dd HH:mm:ss');
        }
        var eTime = this.timeConfig ? this.timeConfig : ''        
        var postDayData = {
            dsItemIds: [energyPoint],
            timeEnd: sTime,
            timeFormat: "h1",
            timeStart: new Date(new Date(eTime).getTime() - lastData.hours).format('yyyy-MM-dd HH:mm:ss')
        }
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment", postDayData).done(function (result) {            
            if(!result) return;
            var dayOption = _this.setEchartOption({
                xdata: result.timeShaft,
                sdata: result.list[0].data,
                legend: i18n_resource.energyManagement.overview.HOURLY_ENERGY,
                lineColor: _this.echartGradientList.dayLine,
                areaColor: _this.echartGradientList.dayArea
            });
            _this.resizeEchart(dayOption,powTrendyEchart.querySelector('.powTrendyDay'));           
        });
        var postMonthData = {
            dsItemIds: [energyPoint],
            timeEnd: this.timeConfig? this.timeConfig : sTime,
            timeFormat: "d1",
            timeStart: new Date(new Date(eTime).getTime() - lastData.days).format('yyyy-MM-dd HH:mm:ss')
        }
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment", postMonthData).done(function (result) {
            if(!result) return;
            var monthOption = _this.setEchartOption({
                xdata: result.timeShaft,
                sdata: result.list[0].data,
                legend: i18n_resource.energyManagement.overview.DAILY_ENERGY,
                lineColor: _this.echartGradientList.monthLine,
                areaColor: _this.echartGradientList.monthArea
            });  
            _this.resizeEchart(monthOption,powTrendyEchart.querySelector('.powTrendyMonth'));
        });
        var postYearData = {
            dsItemIds: [energyPoint],
            timeEnd: this.timeConfig ? this.timeConfig : sTime,
            timeFormat: "M1",
            timeStart: new Date(new Date(eTime).getTime() - lastData.months).format('yyyy-MM-dd HH:mm:ss')
        }
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment", postYearData).done(function (result) {
            if(!result) return;            
            var option = _this.setEchartOption({
                xdata: result.timeShaft,
                sdata: result.list[0].data,
                legend: i18n_resource.energyManagement.overview.MONTH_ENERGY,
                lineColor: _this.echartGradientList.yearLine,
                areaColor: _this.echartGradientList.yearArea
            });
            _this.resizeEchart(option,powTrendyEchart.querySelector('.powTrendyYear'));
        });
       
    }
    renderHistogramTrendyChart(psPoint) {
        var _this = this;
        var energyPoint = psPoint ? psPoint : this.nodeList.energy;
        var sTime = new Date(this.timeConfig).format('yyyy-MM-dd 23:59:59');
        if (new Date().format('yyyy-MM-dd') == this.timeConfig.split(' ')[0]) {
            sTime = new Date().format('yyyy-MM-dd HH:mm:ss');
        }
        var eTime = this.timeConfig ? this.timeConfig : ''
        var postData = [{
            dsItemIds: [energyPoint],
            timeEnd: sTime,
            timeFormat: "h1",
            timeStart: new Date(eTime).format('yyyy-MM-dd 00:00:00')
        }, {
            dsItemIds: [energyPoint],
            timeEnd: this.timeConfig ? this.timeConfig : sTime,
            timeFormat: "d1",
            timeStart: new Date(eTime).format('yyyy-MM-01 00:00:00')
        }, {
            dsItemIds: [energyPoint],
            timeEnd: this.timeConfig ? this.timeConfig : sTime,
            timeFormat: "M1",
            timeStart: new Date(eTime).format('yyyy-01-01 00:00:00')
        }];
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment", postData[0]).done(function (result) {            
            if(!result) return;
            var dayOption = _this.setEchartOption({
                xdata: result.timeShaft,
                sdata: result.list[0].data,
                legend: i18n_resource.energyManagement.overview.HOURLY_ENERGY,
                lineColor: _this.echartGradientList.dayLine,
                areaColor: _this.echartGradientList.dayArea
            });
            _this.resizeEchart(dayOption,powTrendyEchart.querySelector('.powTrendyDay'));           
        });
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment", postData[1]).done(function (result) {
            if(!result) return;
            var monthOption = _this.setEchartOption({
                xdata: result.timeShaft,
                sdata: result.list[0].data,
                legend: i18n_resource.energyManagement.overview.DAILY_ENERGY,
                lineColor: _this.echartGradientList.monthLine,
                areaColor: _this.echartGradientList.monthArea
            });  
            _this.resizeEchart(monthOption,powTrendyEchart.querySelector('.powTrendyMonth'));
        });

        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment", postData[2]).done(function (result) {
            if(!result) return;            
            var option = _this.setEchartOption({
                xdata: result.timeShaft,
                sdata: result.list[0].data,
                legend: i18n_resource.energyManagement.overview.MONTH_ENERGY,
                lineColor: _this.echartGradientList.yearLine,
                areaColor: _this.echartGradientList.yearArea
            });
            _this.resizeEchart(option,powTrendyEchart.querySelector('.powTrendyYear'));
        });        
/*        WebAPI.post("/analysis/startWorkspaceDataGenHistogramMulti", postData).done(function (rs) {
            if (!rs) return;
            rs.forEach(function (result, index) {
                if (index == 0) {
                    var dayOption = _this.setEchartOption({
                        xdata: result.timeShaft,
                        sdata: result.list[0].data,
                        legend: i18n_resource.energyManagement.overview.HOURLY_ENERGY,
                        lineColor: _this.echartGradientList.dayLine,
                        areaColor: _this.echartGradientList.dayArea
                    });
                    _this.resizeEchart(dayOption, powTrendyEchart.querySelector('.powTrendyDay'));
                }
                if (index == 1) {
                    var monthOption = _this.setEchartOption({
                        xdata: result.timeShaft,
                        sdata: result.list[0].data,
                        legend: i18n_resource.energyManagement.overview.DAILY_ENERGY,
                        lineColor: _this.echartGradientList.monthLine,
                        areaColor: _this.echartGradientList.monthArea
                    });
                    _this.resizeEchart(monthOption, powTrendyEchart.querySelector('.powTrendyMonth'));
                }
                if (index == 2) {
                    var option = _this.setEchartOption({
                        xdata: result.timeShaft,
                        sdata: result.list[0].data,
                        legend: i18n_resource.energyManagement.overview.MONTH_ENERGY,
                        lineColor: _this.echartGradientList.yearLine,
                        areaColor: _this.echartGradientList.yearArea
                    });
                    _this.resizeEchart(option, powTrendyEchart.querySelector('.powTrendyYear'));
                }
            })
        }).always(function () {
            Spinner.stop()
        });*/
    }
    resizeEchart(options, dom) {
        var echartDom = echarts.init(dom);
        echartDom.setOption(options);
        $(window).resize(function () {
            $(echartDom).resize();
        });
    }
    //渲染一键抄表页面
    renderTotalTable() {
        var _this = this;
        var psIds = this.nodeList.detail.map(function (ele) {
            return ele.point;
        });
        var existData = [];
        var sTime = new Date(this.timeConfig).format('yyyy-MM-dd 23:59:59');
        if (new Date().format('yyyy-MM-dd') == this.timeConfig.split(' ')[0]) {
            sTime = new Date().format('yyyy-MM-dd HH:mm:ss');
        }
        var eTime = this.timeConfig ? this.timeConfig : '';
        var postDayData = {
            dsItemIds: psIds,
            timeEnd: sTime,
            timeFormat: "h1",
            timeStart: new Date(eTime).format('yyyy-MM-dd 00:00:00')
        }
        var $tableBody = $('.tableBody table').find('tbody');
        Spinner.spin($tableBody[0]);
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postDayData).done(function (result) {
            $tableBody.empty();
            //将list中data长度大于0的进行存储 并且添加表头
            if (result.timeShaft.length > 0) {
                var $theadRow = $('<tr class="tableThead"><td>Time</td></tr>');
            }
            result.list.forEach(function (element) {
                if (element.data.length > 0) {
                    existData.push(element);
                    var tdName = _this.getTableTdName(element.dsItemId);
                    $theadRow.append('<td>' + tdName + '</td>');
                }
            })
            $tableBody.append($theadRow);
            //添加内容
            for (var i = 0; i < result.timeShaft.length; i++) {
                var $tableRow = $('<tr class="tableRow"></tr>');
                var timeNum = postDayData.timeFormat == "d1" ? result.timeShaft[i].split(' ')[0] : result.timeShaft[i].split(' ')[1]
                $tableRow.append('<td>' + timeNum + '</td>')
                for (var j = 0; j < existData.length; j++) {
                    var tData = existData[j].data[i];
                    if (!(isNaN(tData)) && tData > 0) {
                        tData = tData.toFixed(2);
                    } else {
                        tData = '-'
                    }
                    $tableRow.append('<td>' + tData + '</td>')
                }
                $tableBody.append($tableRow);
            }
        }).always(function () {
            Spinner.stop();
        });
    }
    renderParaPointChart(point){
        var _this = this;
        $('.modal').show();
        var endTime = this.timeConfig.split(' ')[0] + ' ' +new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[1];
        var startTime = new Date(new Date(endTime).getTime()).format('yyyy-MM-dd HH:mm:ss');        
        var postData = {
            dsItemIds: [point],
            timeEnd: startTime,
            timeFormat: "h1",
            timeStart: new Date(startTime).format('yyyy-MM-dd 00:00:00')
        };            
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(function (result) {
            if(!result) return;            
            var option = _this.setEchartOption({
                xdata: result.timeShaft,
                sdata: result.list[0].data,
                legend: 'Daily(kWh)',
                lineColor: _this.echartGradientList.yearLine,
                areaColor: _this.echartGradientList.yearArea
            });
            _this.resizeEchart(option,document.querySelector('.pointCurve'));
        })        
        $('#closeCurve').off('click').on('click',function(){ 
            $('.pointCurve').empty();
            $('.modal').hide();
        })
        
    }
    //获取record界面表头
    getTableTdName(tName) {
        var theadName = ['Ia', 'Ib', 'Ic', 'Ua', 'Ub', 'Uc', 'Uab', 'Ucb', 'Uac', 'fac', 'energy'];
        for (var i = 0; i < theadName.length; i++) {
            if (tName.indexOf(theadName[i]) > -1) {
                return theadName[i];
            } else if (tName.indexOf('qunlou_Plant_ElecUse') > -1) {
                return 'energy';
            }
        }
    }
    //向Meters->overview中Parameter面板添加单位
    getParameterValue(data) {
        var sData = data.data[0] ? data.data[0].toFixed(2) : '--'
        var psValue = {
            'name': '',
            'value': sData
        };
        var nUnit = {
            'Current': ['Ia', 'Ib', 'Ic'],
            'Voltage': ['Ua', 'Ub', 'Uc', 'Uab', 'Ucb', 'Uac']
        };
        psValue.name = this.getTableTdName(data.dsItemId);
        if (psValue.value != '--') {
            if (nUnit.Current.indexOf(psValue.name) > -1) {
                psValue.value += 'A';
            } else if (nUnit.Voltage.indexOf(psValue.name) > -1) {
                psValue.value += 'kV';
            }
        }
        return psValue;
    }
    getUnit(num) {
        /*        if (num == null || num === "") return '-';
                if (num == 0) return 0;
                var k = 1000;
                var sizes = ['KWh','MWh','GWh'];
                var i = Math.floor(Math.log(num) / Math.log(k));
                return (num / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];*/
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
    getAccumulation(result) {
        var totalDayCol = 0;
        result.list[0].data.forEach(function (element) {
/*            if(element>0){
                totalDayCol += element;
            }*/
            totalDayCol += element;
        });
        return totalDayCol;
    }
    choiceTimeFormat(){
        var timeDifference = new Date(this.timeConfig.endTime).getTime() - new Date(this.timeConfig.startTime).getTime();
        return timeDifference > 24 * 60 * 60 * 1000 ? 'd1' : 'h1';
    }
    setEchartOption (options){
        var choices = options || {};
        var option = {
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,choices.lineColor , false)
                    }
                }
            },
            legend: {
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
                top: '55px',
                left: '10px',
                right: '30px',
                bottom: '5px',
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
                    formatter: function(value){
                        if(value >= 1000||value <= -1000){
                            return value/1000 + 'k';
                        }else{
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
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,choices.lineColor , false),
                        shadowColor: 'rgba(0,0,0,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0,choices.areaColor , false)
                    }
                },
                itemStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0,choices.lineColor , false)
                    }
                },
                data: choices.sdata.map(function (ele) {
                    return ele ? ele.toFixed(2) : 0;
                })
            }]
        };        
        return option;
    }
    close() {

    }
}

EnergyParameter.option = {
    needTime:true
}
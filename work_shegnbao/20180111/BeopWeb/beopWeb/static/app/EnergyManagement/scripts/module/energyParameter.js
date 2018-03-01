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
        this.node = opt.store;
        this.conTime = {
            startTime: toDate().format('yyyy-MM-dd 00:00:00'),
            endTime: toDate().format('yyyy-MM-dd HH:mm:ss'),            
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
        WebAPI.get('/static/app/EnergyManagement/views/module/energyParameter.html').done(function (result) {
            this.ctn = document.getElementById('containerDisplayboard');            
            this.ctn.innerHTML = result;
            //this.initQueryTime();
            if(this.nodeList){
                this.parameterAnaly();
            }            
            this.attachEvent();
        }.bind(this)).always(function(){
            I18n.fillArea($('#containerDisplayboard'));
        });
    }
    initQueryTime() {
        var $iptSelectTime = $('.iptSelectTime');
        $iptSelectTime.val(toDate().format('yyyy-MM-dd'));
        $('#spanSelectTime').datetimepicker({
            Format: 'yyyy-mm-dd',
            autoclose: true,
            startView: 2,
            minView: 2,
            todayHighlight: true
        });
        $('#spanSelectTime').datetimepicker().on('changeDay', function (ev) {
            $iptSelectTime.val(toDate(ev.date).format('yyyy-MM-dd'));
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
            _this.timeConfig.startTime = toDate($iptSelectTime).format('yyyy-MM-dd 00:00:00');
            _this.timeConfig.endTime =toDate($iptSelectTime).format('yyyy-MM-dd 23:59:59');
            _this.renderTotalTable();
        });
        $('#btnExportExcel').off('click').on('click', function (e) {
            var $exportModal = $('#exportModal')
            $exportModal.show();
            var now = new Date();
            var startTime = new Date(now.getFullYear(),now.getMonth()-1,1);//上上个月底
            var endTime = new Date(now.getFullYear(),now.getMonth(),0);//上个月月末
            
            $('#inputTime', $exportModal).val(now.format('yyyy-MM'));
            $('#inputEndTime', $exportModal).val(now.format('yyyy-MM'));
            $('#inputTime', $exportModal).datetimepicker({
                format: 'yyyy-mm',
                autoclose: true,
                startView: 3,
                minView: 4
            });;
        }.bind(this));
        $('#btnDownloadExcel').off('click').on('click', function (e) {
            var $inputTime = $('#inputTime').val();
            var $inputEndTime = $('#inputEndTime').val();
            var pointsArr = [],
                pointName = [];
            if (this.nodeList.detail && this.nodeList.detail.length > 0) {
                this.nodeList.detail.forEach(function(ele){
                    pointsArr.push(ele.point);
                    pointName.push(ele.name);
                })
            }

            var now = new Date();
            var timeStart = new Date($inputTime);
            var timeEnd = new Date(timeStart.getFullYear(),timeStart.getMonth()+1,0);
            
            if(timeEnd.getTime() > now.getTime()){
                timeEnd = now;
            }
            var postData = {
                "dsItemIds": pointsArr,
                "columnNames": pointName,
                "timeEnd": timeEnd.format("yyyy-MM-dd HH:mm:ss"),
                "timeFormat": "h1",
                "timeStart": timeStart.format("yyyy-MM-dd 00:00:00")
            }
            //postData ={"dsItemIds":["@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_Vab","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_Vbc","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_Vca","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_Ia","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_Ib","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_Ic","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_RealPowerkW","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_ReactivePower","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_ApparentPower","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_PF_Apparent","@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_ForwardRealEnergykWh"],"columnNames":["Uab","Ubc","Uca","Ia","Ib","Ic","P","Q","S","Fac","Eng"],"timeEnd":"2018-02-28 00:00:00","timeFormat":"d1","timeStart":"2018-02-01 00:00:00"};
            Spinner.spin($('.MeterContainer')[0]);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/history/exportHisDataExcel');
            xhr.onload = function() {
                var blob;
                if (this.status === 200 && this.response) {
                    blob = new Blob([xhr.response], { type: "application/vnd.ms-excel" });
                    jQuery.getScript("/static/scripts/lib/html-docx/FileSaver.js").done(function () {
                        saveAs(blob,  AppConfig.projectName+ '-'+ _this.node[0].name+'-' + $inputTime + '.xlsx');
                    })
                } else {
                    alert('Generate excel failed, please try it again soon!');
                }
                Spinner.stop();
            };
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.responseType = 'arraybuffer';
            xhr.send(JSON.stringify(postData));
        }.bind(this))
    }
    renderMeterTable() {
        var _this = this;
        $('.analyBody').hide();
        $('.meterTable').show();
        this.renderTotalTable();
    }
    onNodeClick(nodes) {
        this.node = nodes;
        this.nodeList = nodes[0].config;       
        this.typeModule == 'EnergyParameter' ? this.parameterAnaly() : this.renderTotalTable();
  
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
        var psIds = this.nodeList.detail?this.nodeList.detail.map(function(ele){
            return ele.point;
        }):''; 

/*        var endTime = toDate().format('yyyy-MM-dd HH:00:00');  
        var startTime = toDate(toDate(endTime).getTime() - 1 * 60 * 60 * 1000).format('yyyy-MM-dd HH:00:00');    */    
        var endTime = this.timeConfig.split(' ')[0] + ' ' +toDate().format('yyyy-MM-dd HH:00:00').split(' ')[1];
        var startTime = toDate(toDate(endTime).getTime() - 1 * 60 * 60 * 1000).format('yyyy-MM-dd HH:00:00');        
        var postData = {
            dsItemIds: psIds,
            timeEnd: toDate(toDate(startTime).getTime()).format('yyyy-MM-dd HH:59:59'),
            timeFormat: "h1",
            timeStart: startTime
        };
        $totalMeterTable.empty();
        if (psIds.length == 0 )return;
        Spinner.spin($('.analyBody')[0]);       
        // WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(function (result) {
        //     $totalMeterTable.empty();
        //     if(!result.list) return;
        //     $('.updateTime').html('Update: ' + result.timeShaft + '');
        //     for (var i = 0; i * 3 < result.list.length; i++) {
        //         var sData = _this.getParameterValue(_this.nodeList.detail[i * 3].name,result.list[i * 3],_this.nodeList.detail[i * 3],true);
        //         var $meterTableRow = $('<div class="meterTableRow"></div>');
        //         $meterTableRow.append(' <span>' + sData.name + '</span><span class="spValue" title="'+ sData.realData +'" data-point="'+_this.nodeList.detail[i * 3].point+'">' + sData.value + sData.unit + '</span>');
        //         if(_this.nodeList.detail[i * 3 + 1]){
        //             sData = _this.getParameterValue(_this.nodeList.detail[i * 3 + 1].name,result.list[i * 3 + 1],_this.nodeList.detail[i * 3 + 1],true);
        //             $meterTableRow.append(' <span>' + sData.name + '</span><span class="spValue" title="'+ sData.realData +'" data-point="'+_this.nodeList.detail[i * 3+1].point+'">' + sData.value + sData.unit + '</span>');
        //         }
        //         if(_this.nodeList.detail[i * 3 + 2]){
        //              sData = _this.getParameterValue(_this.nodeList.detail[i * 3 + 2].name,result.list[i * 3 + 2],_this.nodeList.detail[i * 3 + 2],true);
        //             $meterTableRow.append(' <span>' + sData.name + '</span><span class="spValue" title="'+ sData.realData +'" data-point="'+_this.nodeList.detail[i * 3+2].point+'">' + sData.value + sData.unit + '</span>');
        //         }
        //         $totalMeterTable.append($meterTableRow);
        //     }
        //     $totalMeterTable.find('.spValue').off('click').on('click',function(e){
        //         var $point = $(e.currentTarget).attr('data-point');
        //         _this.renderParaPointChart($point);
        //     });
        // }).always(function(){
        //     Spinner.stop();
        // });
        WebAPI.post("/analysis/startWorkspaceDataGenPieChart", postData).done(function (result) {
            if(!(result.dsItemList && result.dsItemList .length > 0 )) return;
            var list = _this.sortDataList(result.dsItemList,_this.nodeList.detail.map(function(item){return item.point}),'dsItemId')
            $('.updateTime').html('Update: ' + +toDate().format('yyyy-MM-dd HH:mm:ss') + '');
            for (var i = 0; i * 3 < list.length; i++) {
                var sData = _this.getParameterValue(_this.nodeList.detail[i * 3].name,list[i * 3].data,_this.nodeList.detail[i * 3],true);
                var $meterTableRow = $('<div class="meterTableRow"></div>');
                $meterTableRow.append(' <span class="spName">' + sData.name + '</span><span class="spValue" title="'+ sData.realData +'" data-point="'+_this.nodeList.detail[i * 3].point+'">' + sData.value + sData.unit + '</span>');
                if(_this.nodeList.detail[i * 3 + 1]){
                    sData = _this.getParameterValue(_this.nodeList.detail[i * 3 + 1].name,list[i * 3 + 1].data,_this.nodeList.detail[i * 3 + 1],true);
                    $meterTableRow.append(' <span class="spName">' + sData.name + '</span><span class="spValue" title="'+ sData.realData +'" data-point="'+_this.nodeList.detail[i * 3+1].point+'">' + sData.value + sData.unit + '</span>');
                }
                if(_this.nodeList.detail[i * 3 + 2]){
                     sData = _this.getParameterValue(_this.nodeList.detail[i * 3 + 2].name,list[i * 3 + 2].data,_this.nodeList.detail[i * 3 + 2],true);
                    $meterTableRow.append(' <span class="spName">' + sData.name + '</span><span class="spValue" title="'+ sData.realData +'" data-point="'+_this.nodeList.detail[i * 3+2].point+'">' + sData.value + sData.unit + '</span>');
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
    sortDataList(list,order,key){
        var rs = [];
        if (!(list && list.length >0)){
            return rs;
        }
        if (!key)key = 'key';
        var flag = false;
        for (var  i = 0 ; i < order.length ;i++){
            flag = false;
            for (var j = 0 ;j < list.length;j++){
                if (list[j][key] == order[i]){
                    rs.push(list[j])
                    flag = true;
                    break;
                }
            }
            if (flag == false){
                rs.push({})
            }
        }
        return rs;
    }
    renderConsumptionMoule(psPoint) {
        $('.spYearValue').html('--');   
        $('.spDayValue').html('--');
        $('.spMonthValue').html('--');
        var _this = this;
        var isCurrentDay = toDate(this.timeConfig).format('yyyy-MM-dd') == toDate().format('yyyy-MM-dd')
        var isCurrentMonth = toDate(this.timeConfig).format('yyyy-MM') == toDate().format('yyyy-MM')
        var isCurrentYear = toDate(this.timeConfig).format('yyyy') == toDate().format('yyyy')
        var energyPoint = psPoint ? psPoint : this.nodeList.energy;
        if(!energyPoint)return;
        var sTime = toDate(this.timeConfig).format('yyyy-MM-dd 23:59:59');         
        if(toDate().format('yyyy-MM-dd') == this.timeConfig.split(' ')[0]){
            sTime = toDate().format('yyyy-MM-dd HH:00:00');
        }
        var eTime = this.timeConfig ? this.timeConfig : ''          
        var postData = {
            dsItemIds: [this.nodeList.energy],
            timeEnd: toDate(+toDate(sTime)+3600000).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'h1',
            timeStart: toDate(this.timeConfig).format('yyyy-MM-dd 00:00:00')
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', postData).done(function (result) {
            if (!result) return;
            result.list[0].data.length > 0 ? $('.spDayValue').html(_this.getThousandsBit(_this.getAccumulation(result))): $('.spDayValue').html('--');
        });
        var sTimeMonth = toDate(this.timeConfig).format('yyyy-MM-dd 23:59:59');         
        if(!isCurrentMonth){
            sTimeMonth = toDate(toDate(this.timeConfig).getFullYear(),toDate(this.timeConfig).getMonth(),DateUtil.daysInMonth(toDate(this.timeConfig)))
        }
        var postMonthData = {
            dsItemIds: [this.nodeList.energy],
            timeEnd: toDate(+toDate(sTimeMonth)+86400000).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'd1',
            timeStart: toDate(this.timeConfig).format('yyyy-MM-01 00:00:00')
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', postMonthData).done(function (result) {
            if (!result) return;
            result.list[0].data.length > 0 ? $('.spMonthValue').html(_this.getThousandsBit(_this.getAccumulation(result))): $('.spMonthValue').html('--');
        });
        var sTimeYear = toDate(this.timeConfig).format('yyyy-MM-dd 23:59:59');         
        if(!isCurrentYear){
            sTimeYear = toDate(toDate(this.timeConfig).getFullYear(),11,31).format('yyyy-MM-dd 23:59:59')
        }
        var postYearData = {
            dsItemIds: [this.nodeList.energy],
            timeEnd: toDate(toDate(sTimeYear).getFullYear(),toDate(sTimeYear).getMonth()+1,1).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'M1',
            timeStart: toDate(this.timeConfig).format('yyyy-01-01 00:00:00')
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment/v2', postYearData).done(function (result) {
            if (!result) return;
            result.list[0].data.length > 0 ? $('.spYearValue').html(_this.getThousandsBit(_this.getAccumulation(result))): $('.spYearValue').html('--');           
        });                 
    }
    renderTrendyChart(psPoint) {
        var _this = this;
        var energyPoint = psPoint ? psPoint : this.nodeList.energy;
        $('#powTrendyEchart').find('[_echarts_instance_]').each(function(index,dom){
            echarts.getInstanceByDom(dom).clear()
        })
        if(!energyPoint){
            return;
        }
        var lastData = {
            'hours':86400000,
            'days':2592000000,
            'months':31104000000
        }
        var sTime = toDate(this.timeConfig).format('yyyy-MM-dd 23:59:59');         
        if(toDate().format('yyyy-MM-dd') == this.timeConfig.split(' ')[0]){
            sTime = toDate().format('yyyy-MM-dd HH:mm:ss');
        }
        var eTime = this.timeConfig ? this.timeConfig : '';
        var timeEndForHourlyRequest = toDate(+toDate(sTime) + 3600000);
        var timeStartForHourlyRequest = toDate(+timeEndForHourlyRequest - lastData.hours);
        var postDayData = {
            dsItemIds: [energyPoint],
            timeEnd: timeEndForHourlyRequest.format('yyyy-MM-dd HH:00:00'),
            timeFormat: "h1",
            timeStart: timeStartForHourlyRequest.format('yyyy-MM-dd HH:00:00')
        }      
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment/v2", postDayData).done(function (result) {            
            if(!result) return;
            var dayOption = _this.setEchartOption({
                xdata: result.timeShaft.slice(0,-1),
                sdata: result.list[0].data,
                legend: i18n_resource.energyManagement.overview.HOURLY_ENERGY,
                lineColor: _this.echartGradientList.dayLine,
                areaColor: _this.echartGradientList.dayArea
            });
            _this.resizeEchart(dayOption,powTrendyEchart.querySelector('.powTrendyDay'));           
        });
        var timeEndForMonthlyRequest = toDate(+toDate(sTime) + 86400000);
        var timeStartForMonthlyRequest = toDate(+timeEndForHourlyRequest - lastData.days);
        var postMonthData = {
            dsItemIds: [energyPoint],
            timeEnd: timeEndForMonthlyRequest.format('yyyy-MM-dd 00:00:00'),
            timeFormat: "d1",
            timeStart: timeStartForMonthlyRequest.format('yyyy-MM-dd 00:00:00')
        };
        // var postMonthData = {
        //     dsItemIds: [energyPoint],
        //     // timeEnd: this.timeConfig? this.timeConfig : sTime,
        //     timeEnd: toDate(+toDate(sTime) + 3600000),
        //     timeFormat: "d1",
        //     timeStart: toDate(toDate(eTime).getTime() - lastData.days).format('yyyy-MM-dd HH:mm:ss')
        // }
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment/v2", postMonthData).done(function (result) {
            if(!result) return;
            var monthOption = _this.setEchartOption({
                xdata: result.timeShaft.slice(0,-1),
                sdata: result.list[0].data,
                legend: i18n_resource.energyManagement.overview.DAILY_ENERGY,
                lineColor: _this.echartGradientList.monthLine,
                areaColor: _this.echartGradientList.monthArea
            });  
            _this.resizeEchart(monthOption,powTrendyEchart.querySelector('.powTrendyMonth'));
        });
        
        var timeEndForYearlyRequest = toDate(toDate().setMonth(toDate(sTime).getMonth() + 1));
        var timeStartForYearlyRequest = toDate(toDate(timeEndForYearlyRequest).setMonth(toDate(timeEndForYearlyRequest).getMonth() - 12));
        var postYearData = {
            dsItemIds: [energyPoint],
            timeEnd: timeEndForYearlyRequest.format('yyyy-MM-01 00:00:00'),
            timeFormat: "M1",
            timeStart: timeStartForYearlyRequest.format('yyyy-MM-01 00:00:00')
        };

        // var postYearData = {
        //     dsItemIds: [energyPoint],
        //     timeEnd: this.timeConfig ? this.timeConfig : sTime,
        //     timeFormat: "M1",
        //     timeStart: toDate(toDate(eTime).getTime() - lastData.months).format('yyyy-MM-dd HH:mm:ss')
        // }
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment/v2", postYearData).done(function (result) {
            if(!result) return;            
            var option = _this.setEchartOption({
                xdata: result.timeShaft.slice(0,-1),
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
        var sTime = toDate(this.timeConfig).format('yyyy-MM-dd 23:59:59');
        if (toDate().format('yyyy-MM-dd') == this.timeConfig.split(' ')[0]) {
            sTime = toDate().format('yyyy-MM-dd HH:mm:ss');
        }
        var eTime = this.timeConfig ? this.timeConfig : ''
        var postData = [{
            dsItemIds: [energyPoint],
            timeEnd: sTime,
            timeFormat: "h1",
            timeStart: toDate(eTime).format('yyyy-MM-dd 00:00:00')
        }, {
            dsItemIds: [energyPoint],
            timeEnd: this.timeConfig ? this.timeConfig : sTime,
            timeFormat: "d1",
            timeStart: toDate(eTime).format('yyyy-MM-01 00:00:00')
        }, {
            dsItemIds: [energyPoint],
            timeEnd: this.timeConfig ? this.timeConfig : sTime,
            timeFormat: "M1",
            timeStart: toDate(eTime).format('yyyy-01-01 00:00:00')
        }];
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment/v2", postData[0]).done(function (result) {            
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
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment/v2", postData[1]).done(function (result) {
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

        WebAPI.post("/analysis/startWorkspaceDataGenHistogram/increment/v2", postData[2]).done(function (result) {
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
        var psIds = this.nodeList.detail?this.nodeList.detail.map(function (ele) {
            return ele.point;
        }):'';
        var existData = [];
        var sTime = toDate(this.timeConfig).format('yyyy-MM-dd 23:59:59');
        if (toDate().format('yyyy-MM-dd') == this.timeConfig.split(' ')[0]) {
            sTime = toDate().format('yyyy-MM-dd HH:mm:ss');
        }
        var eTime = this.timeConfig ? this.timeConfig : '';
        var postDayData = {
            dsItemIds: psIds,
            timeEnd: sTime,
            timeFormat: "h1",
            timeStart: toDate(eTime).format('yyyy-MM-dd 00:00:00')
        }
        var $tableBody = $('.tableBody table').find('tbody');
        Spinner.spin($tableBody[0]);
        var arrLevel = ['','k','M']
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postDayData).done(function (result) {
            $tableBody.empty();
            //将list中data长度大于0的进行存储 并且添加表头
            if (result.timeShaft.length > 0) {
                var $theadRow = $('<tr class="tableThead"><td>Time</td></tr>');
            }
            _this.nodeList.detail.forEach(function (element, index) {
                if (element.name) {
                    if (result.list[index].data.length > 0) {
                        var level = arrLevel[element.level]
                        var sData = _this.getParameterValue(element.name,0,element);
                        existData.push(result.list[index]);
                        var thead = sData.initUnit ? sData.name + '(' + sData.initUnit + ')': sData.name 
                        $theadRow.append('<td>' + thead + '</td>');
                    }
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
                    if (!(isNaN(tData)) && tData >= 0) {
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
    renderParaPointChart(point) {
        var _this = this;
        var endTime = this.timeConfig.split(' ')[0] + ' ' + toDate().format('yyyy-MM-dd HH:mm:ss').split(' ')[1];
        var startTime = toDate(toDate(endTime).getTime()).format('yyyy-MM-dd HH:mm:ss');
        var postData = {
            dsItemIds: [point],
            timeEnd: startTime,
            timeFormat: "h1",
            timeStart: toDate(startTime).format('yyyy-MM-dd 00:00:00')
        };
        WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(function (result) {
            if (!result) return;
            var chartTpl = `<div class="form-horizontal">
               <div class="pointCurve" id="pointCurve"></div>
              </div>`;
            var myMetersModal = $('#myMetersModal');
            myMetersModal.find('.modal-body').empty().append(chartTpl);
            myMetersModal.show();
            var option = _this.setEchartOption({
                xdata: result.timeShaft,
                sdata: result.list[0].data,
                legend: 'Daily(kWh)',
                lineColor: _this.echartGradientList.yearLine,
                areaColor: _this.echartGradientList.yearArea
            });
            _this.resizeEchart(option, document.getElementById('pointCurve'));
        })
        $('#closeCurve').off('click').on('click', function () {
            $('.pointCurve').empty();
            $('#myMetersModal').hide();
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
    getParameterValue(name,data,custom,needProcess) {
        var sData = data ;
        if (!isNaN(Number(data))){
            sData = Number(data)
        }else if(!sData){
            sData = '--'
        }
        var psValue = {
            'name': name,
            'value': sData,
            'unit': '',
            'realData':sData,
            'initData':sData,
            'initUnit':''
        };
        var nUnit = {
            'Current': ['ia', 'ib', 'ic'],
            'Voltage': ['ua', 'ub', 'uc', 'uab','uba', 'ucb','ubc', 'uac','uca'],
            'Energy':['wp'],
            'Power':['p']
        };
        var short = {};
        var numLevel = 0;
        var numLevel_custom_set = false;
        var paraUnit = '';
        if (!(custom && custom.unit)){
            if (custom && !isNaN(Number(custom.level))){
                numLevel = Number(custom.level)
                numLevel_custom_set = true;
            }
            if (typeof name == 'string'){
                if (nUnit.Current.indexOf(psValue.name.toLowerCase()) > -1) {
                    psValue.name = 'I' + psValue.name.slice('1');
                    paraUnit = 'A'
                } else if (nUnit.Voltage.indexOf(psValue.name.toLowerCase()) > -1) {
                    psValue.name = 'U'+ psValue.name.slice('1');
                    paraUnit = 'V'
                    if (!numLevel_custom_set)numLevel = 1;
                }else if (nUnit.Energy.indexOf(psValue.name.toLowerCase()) > -1){
                    paraUnit = 'Wh'
                    if (!numLevel_custom_set)numLevel = 1;
                }else if (nUnit.Power.indexOf(psValue.name.toLowerCase()) > -1){
                    paraUnit = 'W'
                    if (!numLevel_custom_set)numLevel = 1;
                }else{
                    paraUnit = ''
                }
            }
        }else{
            paraUnit = custom.unit
            numLevel = custom.level;
        }
        short = this.getNumberShort(sData,numLevel)
        psValue.unit = short.unit + paraUnit;
        psValue.initUnit = short.initUnit + paraUnit
        psValue.value = short.value;
        psValue.realData = short.realValue;
        return psValue;
    }
    getNumberShort(data,level){
        if (!level)level = 0;
        var step = 1;
        var arrLevel = ['','k','M','G'].slice(level)
        var unit = arrLevel[0];
        if (isNaN(Number(data)))return {value:'--',unit:unit,realValue:'--',initUnit:unit};
        var num = Number(data);
        var curLevel = 0;
        if (isNaN(num))return {value:data,unit:unit};
        // while (curLevel+1 <arrLevel.length && (num / Math.pow(1000,curLevel+1)>= 1)){
        while ((num / Math.pow(1000,curLevel+1)>= 1)){
            curLevel++;
        }
        curLevel = step * Math.floor((curLevel)/step) 
        curLevel = Math.min(curLevel,arrLevel.length - 1);
        unit =  arrLevel[curLevel]
        if (curLevel == 0){
            return {
                value:num.toFixed(2),
                unit:unit,
                realValue:num,
                initUnit:arrLevel[0]
            }
        }else{
            return {
                value:Number((data/(Math.pow(1000,curLevel))).toFixed(2)),
                unit:unit,
                realValue:Number((data/(Math.pow(1000,curLevel)))),
                initUnit:arrLevel[0]
            }
        }
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
        var timeDifference = toDate(this.timeConfig.endTime).getTime() - toDate(this.timeConfig.startTime).getTime();
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
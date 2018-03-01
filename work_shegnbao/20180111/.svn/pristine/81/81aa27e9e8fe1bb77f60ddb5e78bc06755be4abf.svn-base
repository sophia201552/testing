class BenchmarkEnergyDiagnosis{
    constructor(ctn,screen,opt){
        this.ctn = ctn;
        this.screen = screen;
        this.opt = opt;
        this.parentNode = undefined;
    }
    show(){
        var _this = this;
        WebAPI.get('/static/views/observer/benchmark/benchmarkEnergyDiagnosis.html').done(resultHtml=>{
            $('.panelBmModule').html('').append(resultHtml);
            I18n.fillArea($('#benchDiagnosis'));
            //_this.echartsLineInt();
            _this.diagnosisListInit();
            _this.init();
        });
    }
    init(){
        var _this = this;
        var currentMonth = new Date().getMonth();//+1;
        var timeMList =  [1,3,5,7,8,10,12];
        var monthLastDay ;
        var currentYear = new Date().getFullYear();
        if(timeMList.indexOf(currentMonth) !== -1){
            monthLastDay = '-31';
        }else if(currentMonth==2){
            if(((currentYear%4 == 0)&&(currentYear%100 != 0))||(currentYear%400 == 0)){
                monthLastDay = '-29';
            }else{
                monthLastDay = '-28';
            }
        }else{
            monthLastDay = '-30';
        }
        currentMonth = currentMonth<10?'0'+currentMonth.toString():currentMonth;
        var currentPonit = this.screen.iotFilter.tree.getNodes()[0]._id;
        var dsItemIds = this.screen.opt.point[currentPonit].energy;
        var resultList = [];
        var postDate = {
            dsItemIds: [dsItemIds],
            timeEnd: new Date().format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'd1',
            timeStart: currentYear + '-' + currentMonth + monthLastDay + ' 00:00:00'
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postDate).done(result=>{
            var currentTime = {};
            currentTime.data = [];
            var resultListData = result.list[0].data;
            if(resultListData.length===0){
                alert(I18n.resource.benchmark.energyDiagnosis.CURRENT_POINT_NO_DATA);
                return;
            }
            for(var i = 1;i<resultListData.length;i++){
                currentTime.data.push((resultListData[i]-resultListData[i-1]).toFixed(2));
            }
            currentTime.timeShaft =result.timeShaft.slice(1,result.timeShaft.length);
            //currentTime.data = result.list[0].data;
            _this.parentNode = currentTime;
            resultList.push(currentTime);
            _this.echartsLineInt(resultList);
            _this.attEvents();
        })
    }
    attEvents(){
        var _this = this;
        //右侧诊断点击事件
        $('#diagnosisInfoBox').find('.diagnosisSin').off('click').click(function(){
            var $this = $(this);
            var $diagnosisSelect = $this.find('.diagnosisSelect');
            if($this.hasClass('active')){
                $this.removeClass('active');
                $diagnosisSelect.removeClass('selectActive');
            }else{
                $this.addClass('active');
                $diagnosisSelect.addClass('selectActive');
            }
        });
        //查看按钮点击事件
        $('#diagnoForestData').off('click').click(function(){
            if(!_this.parentNode){
                alert(I18n.resource.benchmark.energyDiagnosis.CURRENT_POINT_NO_DATA);
                return;
            }
            var disgnosisActive = $('.diagnosisSin.active');
            var arrFault = [];
            var resultList = [];
            var addResult = [];
            if(disgnosisActive.length===0){
                alert(I18n.resource.benchmark.energyDiagnosis.SELECT_DIAGNOSIS);
                return;
            }
            for(var i = 0;i<disgnosisActive.length;i++){
                arrFault.push(disgnosisActive.eq(i).find('.disgName').attr('data-name'));
            }
            resultList.push(_this.parentNode);
            var currentMonth = new Date().getMonth()+1;
            currentMonth = currentMonth<10?'0'+currentMonth.toString():currentMonth;
            Spinner.spin($('#benchDiagnosis')[0]);
            WebAPI.post('/benchmark/diagnosis/getPredict',{
                arrFault:arrFault,
                endTime: new Date().format('yyyy-MM-dd HH:mm:ss'),
                interval: 'd1',
                startTime: new Date().getFullYear() + '-' + currentMonth + '-01' + ' 00:00:00',
                projectId:AppConfig.projectId
            }).done(resultAll=>{
                //console.log(result);
                var secondData = {};
                var resultData = [];
                var result = [];
                var barOne = {};
                var barTwo = {};
                barOne.timeShaft = _this.parentNode.timeShaft;
                for(var i = 0;i<_this.parentNode.data.length;i++){
                    if(!resultAll.data||resultAll.data.length===0){
                        alert(I18n.resource.benchmark.energyDiagnosis.NO_DIAGNOSIS_ADD);
                        return;
                    }else{
                        var finalData = (parseInt(_this.parentNode.data[i])-resultAll.data[i]).toFixed(2);
                        if(finalData<0){
                            finalData = 0;
                        }
                        result.push(finalData);
                    }
                }
                secondData.data = result;
                barOne.data = result;
                //addResult.push(barOne);
                addResult.push(_this.parentNode)
                barTwo.data = resultAll.data;
                addResult.push(barTwo);
                //for(var i = 0;i<_this.parentNode.data.length;i++){
                //    if((parseInt(addResult[0].data[i])>0&&parseInt(addResult[1].data[i])<0)||(parseInt(addResult[0].data[i])<0&&parseInt(addResult[1].data[i])>0)){
                //        addResult[0].data[i]='-';
                //        addResult[1].data[i] = '-';
                //    }
                //}
                if(resultList.length>1){
                    resultList = resultList.slice(1,resultList.length);
                }
                resultList.push(secondData);
                _this.echartsLineInt(resultList,resultAll.data);
                //_this.echartsBarInt(addResult);
            }).always(function(){
                Spinner.stop();
            });

        });
    }
    echartsLineInt(resultData,addResult){
        var timeShift = [];
        for(var i = 0;i<resultData[0].timeShaft.length;i++){
            timeShift.push(resultData[0].timeShaft[i].split(' ')[0]);
        }
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            axisLabel:{
                formatter: function(value){
                    if(value >= 1000||value<=-1000){
                        return value/1000 + 'k';
                    }else{
                        return value;
                    }
                }
            },
            legend: {
                data:[I18n.resource.benchmark.energyDiagnosis.CURRENT_DATE]//'当前周期','预测周期'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
           xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data:  timeShift
                    }
            ],
           yAxis: [{
                type: 'value',
                axisLine: {onZero: false},
                boundaryGap: false
            }],
           series: [
                {
                    name:I18n.resource.benchmark.energyDiagnosis.CURRENT_DATE,
                    type: 'line',
                    smooth: true,
                    symbol :'rect',
                    lineStyle:{
                        normal:{
                            width:3
                        }
                    },
                    //markPoint:{
                    //    symbol :'rect'
                    //},
                    data:resultData[0].data
                }
           ]
        }
        if(resultData.length>1){
            option.legend.data .push(I18n.resource.benchmark.energyDiagnosis.FORCAST_DATE);
            option.series.push({
                name:I18n.resource.benchmark.energyDiagnosis.FORCAST_DATE,
                type: 'line',
                smooth: true,
                lineStyle:{
                    normal:{
                        type:'dashed',
                        width:3
                    }
                },
                data:resultData[1].data
            });
        }
        if(addResult&&addResult.length>0){
            option.yAxis.push({
                type: 'value',
                axisLine: {show: false},
                boundaryGap: false,
                splitLine:{
                    show :false
                }
            });
            option.series.push({
                name:'增量',
                type:'bar',
                itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(6,113,162,0.8)',
                                    color: 'rgba(6,113,162,0.8)'
                                },
                                emphasis: {
                                    barBorderColor: 'rgba(6,113,162,0.8)',
                                    color: 'rgba(6,113,162,0.8)'
                                }
                            },
                yAxisIndex: 1,
                data:addResult
            });
            //for(var i = 0;i<addResult.length;i++){
            //    if(i===0){
            //         option.series.push(
            //            {
            //                name: '预测',
            //                type: 'bar',
            //                barWidth: 3,
            //                stack:  '总量',
            //                itemStyle: {
            //                    normal: {
            //                        barBorderColor: 'rgba(0,0,0,0)',
            //                        color: 'rgba(0,0,0,0)'
            //                    },
            //                    emphasis: {
            //                        barBorderColor: 'rgba(0,0,0,0)',
            //                        color: 'rgba(0,0,0,0)'
            //                    }
            //                },
            //                data: addResult[i].data
            //            })
            //    }else {
            //        option.series.push(
            //            {
            //                name: '增量',
            //                type: 'bar',
            //                barWidth: 3,
            //                stack:  '总量',
            //                //label: {
            //                //    normal: {
            //                //        show: true,
            //                //        position: 'inside'
            //                //    }
            //                //},
            //                data: addResult[i].data
            //            })
            //    }
            //}
        }
        var dom = $('#lineEchartsBox')[0];
        var chart = echarts.init(dom, AppConfig.chartTheme);
        chart.setOption(option);
    }
    diagnosisListInit(){
        var _this = this
        WebAPI.get('/benchmark/diagnosis/get/'+AppConfig.projectId).done(result=>{
            //console.log(result)
        //});
            if(result.data.length===0) {
                alert(I18n.resource.benchmark.energyDiagnosis.NO_DIAGNOSIS_INFO);
                return;
            }else{
                var result = result.data;
            }
            for(var i = 0;i<result.length;i++){//     <span class="glyphicon glyphicon-ok-circle diagnosisSelect"></span>\
                var diagnosisSin = '<div class="diagnosisSin clearfix">\
                    <div class="leftDiagInfo col-xs-12">\
                        <div class="disgName" data-name="'+result[i].name+'">'+(i+1)+'.'+result[i].name+'</div>\
                        <div class="disgNum clearfix"><div class="col-xs-6 disgNumList">'+kIntSeparate(result[i].energy)+' kWh/'+I18n.resource.benchmark.energyDiagnosis.DIAGNOSIS_DAY+'</div><div class="col-xs-6 disgNumList">'+kIntSeparate(result[i].coust)+' '+I18n.resource.benchmark.energyOverView.MONEY+'/'+I18n.resource.benchmark.energyDiagnosis.DIAGNOSIS_DAY+'</div></div>\
                        <div class="disgDetail">'+result[i].detail+'</div>\
                    </div>\
                    <div class="rightMore col-xs-3">\
                        <div class="btnMore">More</div>\
                    </div>\
                    <i class="iconfont gouxuan diagnosisSelect">&#xe661;</i>\
                    </div>';
                $('#diagnosisInfoBox').append(diagnosisSin);
            }
            _this.attEvents();
        });
    }
    onNodeClick(e,node){
        var _this = this;

    }
    destroy(){
        this.ctn = null;
        this.screen = null;
        this.opt = null;
        this.parentNode = null;
    }
}
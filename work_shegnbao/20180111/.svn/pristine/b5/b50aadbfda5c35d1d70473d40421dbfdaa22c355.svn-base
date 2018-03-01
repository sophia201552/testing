class EnergyHistoryQuery {
    constructor(opt){
        this.opt = opt;
        this.nodesArr = this.opt.tree.getChildNode();
        this.pointEnergyArr = [];
        this.pointNameArr = [];
        this.pointPowerArr = [];
        this.normalColor =['#426ec1','#4fcade','#F3CB2A','#7094ec','#71d360','#3faaff']; //ffd600['#426ec1','#7094ec','#3faaff','#4fcade','#71d360','#ffd600'];//['#ffd428','#71d360','#54cadd','#45abff','#7094ec','#4470bf'];
        this.onTimeArr = [];
        this.onTime = [];
        this.postData = undefined;
        this.async = [];
        this.resultArr = [];
    }
    show() {
        WebAPI.get('/static/app/EnergyManagement/views/module/energyHistoryQuery.html').done(function(rsHtml) {
            $('#containerDisplayboard').html('').append(rsHtml);
            I18n.fillArea($('#containerDisplayboard'));
            $('#startTime').val(new Date().format('yyyy-MM-dd')).datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose:true,
                minView:2,
                startView:2
            });
            $('#endTime').val(new Date(new Date().setMonth(new Date().getMonth()+1)).format('yyyy-MM-dd')).datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose:true,
                minView:2,
                startView:2
            });
            this.cycleCount = 1;
            this.getPointChildren();
        }.bind(this));
    }
    // getPointChildren(isNode){
    //     var selectNodeChildren = [];
    //     var childrenNodes = this.opt.tree.getChildNode();
    //     if(childrenNodes.length==0&&this.nodesArr.length!=0){
    //         childrenNodes = this.nodesArr;//this.nodesArr[0].getParentNode().children    //新需求，当点击子节点显示子节点的数据《=-=》
    //     }
    //     if(childrenNodes.length==0){
    //         alert('no point');
    //         return
    //     }
    //     var type = $('.energyPover').find('.selected').attr('data-type');
    //     var points = [];
    //     this.pointNameArr =[];
    //     this.pointEnergyArr = [];
    //     this.pointPowerArr = [];
    //     for(var i = 0;i<childrenNodes.length;i++){
    //         childrenNodes[i].id&&points.push(childrenNodes[i].id);
    //         this.pointNameArr.push(childrenNodes[i].name);
    //     }
    //     WebAPI.post('/energy/getConfigInfo',{
    //         // projectId:293,//AppConfig.projectId
    //         projectId:AppConfig.projectId,
    //         entityId:points
    //     }).done((configInfo)=>{
    //         if(configInfo&&configInfo.data) {
    //             if(configInfo.data.length==0){
    //                 alert('no point');
    //                 return;
    //             }
    //             var isExist = false;
    //             for(var item of configInfo.data){
    //                 if(item&&item.energy){
    //                   isExist = true;
    //                 }
    //             }
    //             if(!isExist){
    //                 alert('no point!');
    //                 return;
    //             }
    //             for (var i = 0; i < configInfo.data.length; i++) {
    //                 this.pointEnergyArr.push(configInfo.data[i].energy);
    //                 this.pointPowerArr.push(configInfo.data[i].power);
    //             }
    //             if(!isNode){
    //                 var postD = {
    //                     dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
    //                     timeEnd:this.opt.timeConfig>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(this.opt.timeConfig).format('yyyy-MM-dd HH:mm:ss'),
    //                     timeFormat:'d1',
    //                     timeStart:this.opt.timeConfig>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-01 00:00:00'):new Date(this.opt.timeConfig).format('yyyy-MM-01 00:00:00')
    //                 }
    //                 this.postData = postD;
    //                 this.init(type,postD)
    //                 //var postData = this.getPostData('d1');
    //                 //this.init(type,postData);
    //                 this.attEvent();

    //                 this.async.push(this.childrenColumn());
    //                 this.async.push(this.normalYoY());
    //             }else{
    //                 var startTimeVal = $('#startTime').val();
    //                 var startYear = new Date(startTimeVal).getFullYear();
    //                 var startMonth = new Date(startTimeVal).getMonth();
    //                 var startDate = new Date(startYear,startMonth+1,0).getDate();
    //                 var startTime = new Date(startTimeVal).format('yyyy-MM-01 00:00:00');
    //                 var endTime = startMonth==new Date().getMonth()?new Date().format('yyyy-MM-dd 00:00:00'):new Date(startYear,startMonth,startDate).format('yyyy-MM-dd 00:00:00');
    //                 var timeFormat = $('.periodHistory').val();
    //                 var postData = {
    //                     dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
    //                     timeEnd:this.opt.timeConfig>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(this.opt.timeConfig).format('yyyy-MM-dd HH:mm:ss'),//this.postData?this.postData.timeEnd:endTime,
    //                     timeFormat:timeFormat,
    //                     timeStart:this.opt.timeConfig>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-01 00:00:00'):new Date(this.opt.timeConfig).format('yyyy-MM-01 00:00:00')//this.postData?this.postData.timeStart:startTime
    //                 }
    //                 this.postData = postData;
    //                 this.async = [];
    //                 this.resultArr = [];
    //                 this.async.push(this.childrenColumn());
    //                 this.async.push(this.normalYoY());
    //                 this.init(type,postData);
    //                 this.attEvent();
    //             }
    //         }else{
    //             alert('no point')
    //         }
    //     })
    // }

    getPointChildren(isNode){
        var selectNodeChildren = [];
        var type = $('.energyPover').find('.selected').attr('data-type');
        var points = [];
        this.pointNameArr =[this.opt.store[0].name];
        this.pointEnergyArr = [];
        this.pointPowerArr = [];
        var configInfo  = this.opt.store[0].config
        if(configInfo) {

            this.pointEnergyArr.push(configInfo.energy);
            this.pointPowerArr.push(configInfo.power);

            if(!isNode){
/*                var postD = {
                    dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
                    timeEnd:this.opt.timeConfig>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(this.opt.timeConfig).format('yyyy-MM-dd HH:mm:ss'),
                    timeFormat:'d1',
                    timeStart:this.opt.timeConfig>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-01 00:00:00'):new Date(this.opt.timeConfig).format('yyyy-MM-01 00:00:00')
                }*/
                /*初始周期为倒退30天*/
                var startTime = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss');
                var endTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss');
                var postD = {
                    dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                    timeEnd: endTime,
                    timeFormat: 'd1',
                    timeStart: startTime
                }
                this.fixedDipkerTime(new Date(new Date(startTime)).format('yyyy-MM-dd'),new Date().format('yyyy-MM-dd'),'d1');
                this.postData = postD;
                this.init(type,postD)
                //var postData = this.getPostData('d1');
                //this.init(type,postData);
                this.attEvent();

                this.async.push(this.childrenColumn());
                this.async.push(this.normalYoY());
            }else{
                var startTimeVal = $('#startTime').val();
                var startYear = new Date(startTimeVal).getFullYear();
                var startMonth = new Date(startTimeVal).getMonth();
                var startDate = new Date(startYear,startMonth+1,0).getDate();
                var startTime = new Date(startTimeVal).format('yyyy-MM-01 00:00:00');
                var endTime = startMonth==new Date().getMonth()?new Date().format('yyyy-MM-dd 00:00:00'):new Date(startYear,startMonth,startDate).format('yyyy-MM-dd 00:00:00');
                var timeFormat = $('.periodHistory').val();
                var postData = {
                    dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
                    timeEnd:this.opt.timeConfig>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(this.opt.timeConfig).format('yyyy-MM-dd HH:mm:ss'),//this.postData?this.postData.timeEnd:endTime,
                    timeFormat:timeFormat,
                    timeStart:this.opt.timeConfig>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-01 00:00:00'):new Date(this.opt.timeConfig).format('yyyy-MM-01 00:00:00')//this.postData?this.postData.timeStart:startTime
                }
                this.postData = postData;
                this.async = [];
                this.resultArr = [];
                this.async.push(this.childrenColumn());
                this.async.push(this.normalYoY());
                this.init(type,postData);
                this.attEvent();
            }
        }else{
            alert('no point');
        }
    }
    init(type,postData){
        Spinner.spin($('#containerDisplayboard')[0]);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram'+(type== 'energy'?'/increment':''),postData).done(resultData=>{///increment
            if(resultData&&resultData.timeShaft.length>0){
                var xAxisTime = resultData.timeShaft;
                var dataArr = [];
                for(var i = 0;i<resultData.list.length;i++){
                    dataArr.push(resultData.list[i].data);
                }
                if(type=='energy'){
                    this.renderStackedColumn(xAxisTime,dataArr);
                }else{
                    this.renderBrokenLine(xAxisTime,dataArr);
                }
            }else{
                infoBox.alert('no data!');
            }
        }).always(()=>{
            Spinner.stop();
        });
    }
    renderStackedColumn(xAxisTime,data,isNormal,arrLengend){
        var seriesArr = [];
        var thisCurrentNodeName = this.opt.store&&this.opt.store[0]?this.opt.store[0].name:'';
        if(this.pointNameArr[0].indexOf(thisCurrentNodeName)<0){
            for(var i = 0;i<this.pointNameArr.length;i++){
                this.pointNameArr[i] = thisCurrentNodeName+'-'+this.pointNameArr[i];
            }
        }
        var color = [];
        var index = 0;
        var period = $('.periodHistory').val();
        if(!isNormal) {
            for (var i = 0; i < data.length; i++) {                    
                seriesArr.push({
                    name: this.pointNameArr[i],
                    type: 'bar',
                    stack: '能耗',
                    data: this.toFixedTwoNum(data[i])
                });
                color.push(this.normalColor[index]);
                index++;
                if(index==data.length){
                    index = 0;
                }
            }
        }else{
            var indexLengend = 0;
            for(var i = 0;i<data.length;i++){
                var item = data[i];
                var stackName = new Date(this.onTime[i].timeStart).format('yyyy-MM');
                if(period=='h1'){
                    stackName = new Date(this.onTime[i].timeStart).format('yyyy-MM-dd');
                }else if(period=='m5'){
                    stackName = new Date(this.onTime[i].timeStart).format('yyyy-MM-dd HH');
                }
                for(var j = 0;j<item.length;j++){
                    seriesArr.push({
                        name: arrLengend[indexLengend],
                        type: 'bar',
                        stack: stackName,
                        data: this.toFixedTwoNum(item[j])
                    });
                    indexLengend++;
                    color.push(this.normalColor[index]);
                    index++;
                    if(index==this.normalColor.length){
                        index = 0;
                    }
                }
            }
        }

        var option = {
            color:color,
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'       // 默认为直线，可选为：'line' | 'shadow'
                },
                backgroundColor:'rgba(230,232,236,0.9)',
                textStyle:{
                    color:'#5C6777'
                },
                padding:10
            },
            grid:{
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'15%',
                containLabel: true
            },
            axisLabel:{
                formatter: function(value){
                    if(value >= 1000||value <= -1000){
                        return value/1000 + 'k';
                    }else{
                        return value;
                    }
                }
            },
            xAxis : [
                {
                    type : 'category',
                    data : xAxisTime,
                    axisLine:{
                        lineStyle:{
                           color:'#eceeef'
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisTick:{
                        show:false
                    }
                }
            ],
            legend: {
                data:isNormal?arrLengend:this.pointNameArr,
                top:'2%',
                icon:'circle',
                itemHeight: '9',
            },
            series:seriesArr
        };
        var chart = echarts.init($('.energyEcharts')[0],this.opt.chartTheme);//AppConfig.chartTheme
        chart.setOption(option);
    };
    renderBrokenLine(xAxisTime,data,isNomal,arrLengendData){
        var seriesArr = [];
        var color = [];
        var indexColor = 0;
        var thisCurrentNodeName = this.opt.store&&this.opt.store[0]?this.opt.store[0].name:'';
        if(this.pointNameArr[0].indexOf(thisCurrentNodeName)<0){
            for(var i = 0;i<this.pointNameArr.length;i++){
                this.pointNameArr[i] = thisCurrentNodeName+'-'+this.pointNameArr[i];
            }
        }
        if(isNomal){
            var index = 0;
            for(var i = 0,len = data.length;i<len;i++){
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
                    index = index+1;
                    color.push(this.normalColor[indexColor]);
                    indexColor++;
                    if(indexColor==this.normalColor.length){
                        indexColor = 0;
                    }
                //}
            }
        }else{
           for(var i = 0;i<data.length;i++){
                seriesArr.push({
                    name: this.pointNameArr[i],
                    type: 'line',
                    data: this.toFixedTwoNum(data[i]),
                    symbolSize: 0,
                    smooth: true
                });
               color.push(this.normalColor[indexColor]);
                indexColor++;
                if(indexColor==data.length){
                    indexColor = 0;
                }
            }
        }
        var option = {
            color:color,
            tooltip : {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                },
                backgroundColor:'rgba(230,232,236,0.9)',
                textStyle:{
                    color:'#5C6777'
                },
                padding:10
            },
            grid:{
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'15%',
                containLabel: true
            },
            axisLabel:{
                formatter: function(value){
                    if(value >= 1000||value <= -1000){
                        return value/1000 + 'k';
                    }else{
                        return value;
                    }
                }
            },
            xAxis : [
                {
                    type : 'category',
                    data : xAxisTime,
                    axisLine:{
                        lineStyle:{
                           color:'#eceeef'
                        }
                    },
                    splitLine:{
                        lineStyle:{
                           color:'#eceeef'
                        }
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#a2adbc'
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLine:{
                        show:false
                    },
                    min:'dataMin',
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#a2adbc'
                        }
                    }
                }
            ],
            legend: {
                data:isNomal?arrLengendData:this.pointNameArr,
                top:'2%'
            },
            series:seriesArr
        };
        var chart = echarts.init($('.energyEcharts')[0],AppConfig.chartTheme);
        chart.setOption(option);
    };
    toFixedTwoNum(item) {
        var saveData = [];
        saveData = item.map(function (ele) {
            var val = parseFloat(ele);
            return !isNaN(val) ? val.toFixed(2) : '-';
        });
        return saveData;
    }
    fixedDipkerTime(start, end, format) {
        $('#endTime').val(end);
        $('#startTime').val(start);
        $('.periodHistory').val(format)
    }
    getPostData(timeFormat){
        var type = $('.energyPover').find('.selected').attr('data-type');
        var postData,queryPost;
        var timeStart = $('#startTime').val();
        var timeEnd = $('#endTime').val();
        var startTime,endTime,queryEndTime,queryStartTime;
        if(timeFormat=='m5'){
/*            var startYear = new Date(timeStart).getFullYear();
            var startMonth = new Date(timeStart).getMonth();
            var startDay = new Date(timeStart).getDate();
            startTime = new Date(timeStart).format('yyyy-MM-dd HH:00:00');
            queryEndTime = new Date(timeEnd).format('yyyy-MM-dd HH:00:00');
            endTime = timeStart.split(' ')[1].split(':')[0]==new Date().format('yyyy-MM-dd HH:mm:00').split(' ')[1].split(':')[0]?new Date().format('yyyy-MM-dd HH:mm:00'):new Date(timeStart).format('yyyy-MM-dd 23:59:59');
            queryEndTime = queryEndTime.split(' ')[1].split(':')[0]==new Date().format('yyyy-MM-dd HH').split(' ')[1]?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(queryEndTime).format('yyyy-MM-dd HH:59:59');*/
            var startTime = new Date(timeStart).format('yyyy-MM-dd HH:mm:ss');
            var endTime = new Date(timeEnd).format('yyyy-MM-dd HH:mm:ss');            
        }else if(timeFormat=='h1'){
/*            var startYear = new Date(timeStart).getFullYear();
            var startMonth = new Date(timeStart).getMonth();
            var startDay = new Date(timeStart).getDate();
            startTime = new Date(timeStart).format('yyyy-MM-dd 00:00:00');
            queryEndTime = new Date(timeEnd).format('yyyy-MM-dd 00:00:00');
            endTime = startDay==new Date().getDate()?new Date().format('yyyy-MM-dd HH:00:00'):new Date(timeStart).format('yyyy-MM-dd 23:59:59');
            queryEndTime = new Date(timeEnd).getDate()>=new Date().getDate()?new Date().format('yyyy-MM-dd HH')+':00:00':new Date(timeEnd).format('yyyy-MM-dd 23:59:59');*/
            var startTime = new Date(timeStart).format('yyyy-MM-dd HH:mm:ss');
            var endTime = new Date(timeEnd).format('yyyy-MM-dd HH:mm:ss');
        }else if(timeFormat=='d1'){
/*            var startYear = new Date(timeStart).getFullYear();
            var startMonth = new Date(timeStart).getMonth();
            var startDate = new Date(startYear,startMonth+1,0).getDate();
            startTime = queryStartTime = new Date(timeStart).format('yyyy-MM-01 00:00:00');
            queryEndTime = new Date(timeEnd).format('yyyy-MM-01 00:00:00');
            var queryEndTimeYear = new Date(queryEndTime).getFullYear();
            var queryEndTimeMonth = new Date(queryEndTime).getMonth();
            var queryEndTimeDate = new Date(queryEndTimeYear,queryEndTimeMonth+1,0).getDate();
            endTime = startMonth==new Date().getMonth()?new Date().format('yyyy-MM-dd 00:00:00'):new Date(startYear,startMonth,startDate).format('yyyy-MM-dd 00:00:00');
            queryEndTime = queryEndTimeMonth>=new Date().getMonth()?new Date().format('yyyy-MM-dd 00:00:00'):new Date(queryEndTimeYear,queryEndTimeMonth,queryEndTimeDate).format('yyyy-MM-dd 00:00:00');*/
            var bTime = new Date().format('yyyy-MM-dd 00:00:00').split(' ')[1];
            var startTime = new Date(timeStart).format('yyyy-MM-dd HH:mm:ss').split(' ')[0] + ' ' + bTime;
            var endTime = new Date(timeEnd).format('yyyy-MM-dd HH:mm:ss').split(' ')[0] + ' ' + bTime;
        }else{
/*            var startYear = new Date(timeStart).getFullYear();
            startTime = new Date(timeStart).format('yyyy-01-01 00:00:00');
            queryEndTime = new Date(timeEnd).format('yyyy-01-01 00:00:00')
            endTime = startYear==new Date().getFullYear()?new Date().format('yyyy-MM')+'-01 00:00:00':new Date(timeStart).format('yyyy-12')+'-01 00:00:00';
            queryEndTime = new Date(queryEndTime).getFullYear()>=new Date().getFullYear()?new Date().format('yyyy-MM')+'-01 00:00:00':new Date(queryEndTime).format('yyyy-12-01 00:00:00');*/
            var bTime = new Date().format('yyyy-MM-dd 00:00:00').split(' ')[1];
            var startTime = new Date(timeStart).format('yyyy-MM-dd HH:mm:ss').split(' ')[0] + ' ' + bTime;
            var endTime = new Date(timeEnd).format('yyyy-MM-dd HH:mm:ss').split(' ')[0] + ' ' + bTime;
        }
        postData = {
            dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
            timeEnd:endTime,
            timeFormat:timeFormat,
            timeStart:startTime
        };
        queryPost = {
            dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
            timeEnd:queryEndTime?queryEndTime:endTime,
            timeFormat:timeFormat,
            timeStart:queryStartTime?queryStartTime:startTime
        }
        this.onTimeArr.push(postData);
        this.onTime.push({
            timeEnd:endTime,
            timeStart:startTime
        });
        console.log(this.onTimeArr);
        this.postData = queryPost;
        return queryPost;
    };
    timeChange(timeStart,isOn,nowIndex,nextDom){
        var period = $('.periodHistory').val();
        var startTime,endTime,nextEndTime,queryEndTime,endTimeVal;
        var endTimeValue = $('#endTime').val();
        if(period=='M1'){
            startTime = timeStart+'-01-01 00:00:00';
            endTimeVal = endTimeValue+'-01-01 00:00:00';
            var nowYear = new Date(timeStart).getFullYear();
            var nowMonth = new Date(timeStart).getMonth();
            var nowDay = new Date(timeStart).getDate();
            nextEndTime = parseInt(timeStart)+1;
            endTime = new Date(startTime).getFullYear()==new Date().getFullYear()?new Date().format('yyyy-MM')+'-01 00:00:00':new Date(startTime).format('yyyy-12-01 00:00:00');
            queryEndTime = new Date(endTimeVal).getFullYear()>=new Date().getFullYear()?new Date().format('yyyy-MM')+'-01 00:00:00':new Date(endTimeVal).format('yyyy-12-01 00:00:00');
        }else if(period=='d1'){
            startTime = timeStart+'-01 00:00:00';
            endTimeVal = endTimeValue+'-01 00:00:00';
            var nowYear = new Date(startTime).getFullYear();
            var nowMonth = new Date(startTime).getMonth();
            var nowDay = new Date(startTime).getDate();
            var queryEndTimeYear = new Date(endTimeVal).getFullYear();
            var queryEndTimeMonth = new Date(endTimeVal).getMonth();
            var queryEndTimeDate = new Date(queryEndTimeYear,queryEndTimeMonth+1,0).getDate();
            nextEndTime = new Date(nowYear,nowMonth+1,nowDay).format('yyyy-MM');
            var nowDate = new Date(nowYear,nowMonth+1,0).getDate();
            endTime = nowMonth==new Date().getMonth()?new Date().format('yyyy-MM-dd 00:00:00'):new Date(nowYear,nowMonth,nowDate).format('yyyy-MM-dd 00:00:00');
            queryEndTime = queryEndTimeMonth>=new Date().getMonth()?new Date().format('yyyy-MM-dd 00:00:00'):new Date(queryEndTimeYear,queryEndTimeMonth,queryEndTimeDate).format('yyyy-MM-dd 00:00:00');
        }else if(period=='h1'){
            startTime = timeStart+' 00:00:00';
            endTimeVal = endTimeValue+' 00:00:00';
            nextEndTime = new Date(new Date(startTime).valueOf()+86400000).format('yyyy-MM-dd');
            endTime = new Date(startTime).getDate()==new Date().getDate()?new Date().format('yyyy-MM-dd HH')+':00:00':new Date(startTime).format('yyyy-MM-dd 23:59:59');
            queryEndTime = new Date(endTimeVal).getDate()>=new Date().getDate()?new Date().format('yyyy-MM-dd HH')+':00:00':new Date(endTimeVal).format('yyyy-MM-dd 23:59:59');
        }else{
            startTime = timeStart+':00';
            endTimeVal = endTimeValue+':00';
            nextEndTime = new Date(new Date(startTime).valueOf()+3600000).format('yyyy-MM-dd HH:00');
            endTime = startTime.split(' ')[1].split(':')[0]==new Date().format('yyyy-MM-dd HH').split(' ')[1]?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(startTime).format('yyyy-MM-dd HH:59:59');
            queryEndTime = endTimeVal.split(' ')[1].split(':')[0]==new Date().format('yyyy-MM-dd HH').split(' ')[1]?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(endTimeVal).format('yyyy-MM-dd HH:59:59');
        }
        if(isOn){
            nextDom.val(nextEndTime);
            this.onTimeArr[nowIndex+1].timeEnd = endTime;
            this.onTimeArr[nowIndex+1].timeStart = startTime;
            this.onTime[nowIndex+1].timeStart = timeStart;
            this.onTime[nowIndex+1].timeEnd = nextEndTime;
            this.onQueryTime();
            console.log(this.onTimeArr);
        }else{
            var type = $('.energyPover').find('.selected').attr('data-type');
            this.onTimeArr[0].timeEnd = endTime;
            this.onTimeArr[0].timeStart = startTime;
            this.onTime[0].timeStart = timeStart;
            this.onTime[0].timeEnd = nextEndTime;
            var postData = {
                dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
                timeEnd:queryEndTime,
                timeFormat:period,
                timeStart:startTime
            };
            this.postData = postData;
            //this.init(type,postData);
        }
    };
    attEvent(){
        //时间周期改变时
        $('.periodHistory').off('change').change((e)=>{
            var $this = $(e.currentTarget);
            var period = $this.val();
            var startTime,endTime;
            this.cycleCount = 1;
            this.onTimeArr = [];
            this.onTime = [];
            $('.onTimeBox').empty().remove();
            // $('.onQuery ').hide();
            // $('.slideBtn').removeClass('icon-unfold').addClass('icon-packup');
            if(period == 'h1'){
                startTime = new Date().format('yyyy-MM-dd HH:00');
                endTime = new Date(new Date().valueOf()+86400000).format('yyyy-MM-dd HH:00');
                $('#startTime').val(startTime).datetimepicker('remove').datetimepicker({
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
            }else if(period == 'd1'){
                startTime = new Date().format('yyyy-MM-dd');
                endTime = new Date(new Date().setMonth(new Date().getMonth()+1)).format('yyyy-MM-dd');
                $('#startTime').val(startTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose:true,
                    minView:2,
                    startView:3
                });
                $('#endTime').val(endTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose:true,
                    minView:2,
                    startView:3
                });
                this.getPostData('d1');
            }else if(period == 'm5'){
                startTime = new Date().format('yyyy-MM-dd HH:00');
                endTime = new Date(new Date().valueOf()+3600000).format('yyyy-MM-dd HH:00');
                $('#startTime').val(startTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose:true,
                    minView:1,
                    startView:1
                });
                $('#endTime').val(endTime).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose:true,
                    minView:1,
                    startView:1
                });
                this.getPostData('m5');
            }else{
                startTime = new Date().format('yyyy-MM');
                endTime = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).format('yyyy-MM');
                $('#startTime').val(startTime).datetimepicker('remove').datetimepicker({
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
        $('.wrapQuery').hover((e)=>{
            var $this = $(e.currentTarget);
            if($this.find('.onTimeBox').length>0){
                $this.height('350px');
            }
        },(e)=>{
            var $this = $(e.currentTarget);
            $this.height('40px')
        })
        //查询按钮事件
        $('#historyQuery').off('click').on('click',function(e){
            var $this = $(e.currentTarget);
            $('.shortcutBtnBox>div').removeClass('avtive');
            $this.addClass('avtive');
            var type = $('.energyPover').find('.selected').attr('data-type');
            var timeFormat = $('.periodHistory').val();
            this.onTimeArr = [];
            this.onTime = [];
            var postData;
            if(timeFormat=='m5'){
                postData = this.getPostData('m5');
            }else if(timeFormat=='h1'){
                postData = this.getPostData('h1');
            }else if(timeFormat=='d1'){
               postData = this.getPostData('d1');
            }else{
                postData = this.getPostData('M1');
            }
            this.postData = postData;
            this.init(type,postData);
        }.bind(this));
        //本年事件
        $('.yearHistoryBtn').off('click').on('click', function (e) {
            var $this = $(e.currentTarget);
            $this.siblings().removeClass('avtive');
            $('#historyQuery').removeClass('avtive');
            $this.addClass('avtive');
            var type = $('.energyPover').find('.selected').attr('data-type');
            var data = new Date();
            var postData = {
                dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                timeEnd: new Date(data.getFullYear() + 1,1,1).format('yyyy-01-01 00:00:00'),
                timeFormat: 'M1',
                timeStart: new Date().format('yyyy-01-01 00:00:00')
            };
            this.fixedDipkerTime(new Date().format('yyyy-01-01'), new Date().format('yyyy-MM-01'),'M1')
            this.postData = postData;
            this.init(type, postData);
        }.bind(this));
        //本月事件
        $('.monthHistoryBtn').off('click').on('click',function(e){
            var $this = $(e.currentTarget);
            var date = new Date();
            var currentMonth = date.getMonth();
            var nextMonth = ++currentMonth;
            var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
            var endTime = new Date(nextMonthFirstDay).format('yyyy-MM-dd HH:mm:ss');
            $this.siblings().removeClass('avtive');
            $('#historyQuery').removeClass('avtive');
            $this.addClass('avtive');
            var type = $('.energyPover').find('.selected').attr('data-type');
            var postData = {
                dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                timeEnd: endTime,
                timeFormat: 'd1',
                timeStart: new Date().format('yyyy-MM-01 00:00:00')
            };
            this.fixedDipkerTime(new Date().format('yyyy-MM-dd'), new Date(new Date(endTime)).format('yyyy-MM-dd'),'d1')
            this.postData = postData;
            this.init(type, postData);
        }.bind(this));
        //本日事件
        $('.dayHistoryBtn').off('click').on('click',function(e){
            var $this = $(e.currentTarget);
            $this.siblings().removeClass('avtive');
            $('#historyQuery').removeClass('avtive');
            $this.addClass('avtive');
            var type = $('.energyPover').find('.selected').attr('data-type');
            var postData = {
                dsItemIds: type == 'energy' ? this.pointEnergyArr : this.pointPowerArr,
                timeEnd: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00'),
                timeFormat: 'h1',
                timeStart: new Date().format('yyyy-MM-dd 00:00:00')
            };
            this.fixedDipkerTime(new Date().format('yyyy-MM-dd 00:00'), new Date().format('yyyy-MM-dd HH:00'),'h1')
            this.postData = postData;
            this.init(type,postData);
        }.bind(this));
        $('.energyPover>div').off('click').on('click',function(e){
            var $this = $(e.currentTarget)
            var type = $this.attr('data-type');
            $this.siblings().removeClass("selected");
             $this.addClass("selected");
            $('.onTimeBox').empty().remove();
            // $('.onQuery ').hide();
            // $('.slideBtn').removeClass('icon-unfold').addClass('icon-packup');
            var $periodHistory = $('.periodHistory');
            if(type=="power"){
                $periodHistory.find('option[value="d1"]').hide();
                $periodHistory.find('option[value="M1"]').hide();
                $periodHistory.val('h1');
                $periodHistory.trigger('change');
                $('.yearHistoryBtn').hide();
                $('.monthHistoryBtn').hide();
                $('.shortcutBtnBox').width('90px');
            }else{
                $periodHistory.find('option[value="d1"]').show();
                $periodHistory.find('option[value="M1"]').show();
                $periodHistory.val('d1');
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
            this.async.push(this.normalYoY());
            //this.getPostData($('.periodHistory').val())
            this.init(type,this.postData);
        }.bind(this));
        //添加同比时间
        $('.addOnqueryTime').off('click').on('click',function(){
            var onTimeBox = '<div class="onTimeBox">'+
                    '<div class="onTimeGroup">' +
                        '<div class="input-group">' +
                            '<input type="text" class="onTimeStart">'+
                            '<span class="addonOn">To</span>'+
                            '<input type="text" class="onTimeEnd">'+
                        '</div>'+
                    '</div>'+
                    '<span class="iconfont icon-cuowu removeOnTime"></span>'+
                '</div>';//glyphicon glyphicon-remove
            // $('.onQuery').show();
            $('.queryTimeBox').append(onTimeBox);
            var period = $('.periodHistory').val();
            var now = new Date();
            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth();
            var nowDay = now.getDate();
            var type = $('.energyPover').find('.selected').attr('data-type');
            var postData,nowVal,nowStartVal,nowEndVal,startTime,endTime;
            if(period=='M1'){
                nowStartVal = new Date(nowYear-this.cycleCount,nowMonth,nowDay).format('yyyy');
                nowEndVal = new Date(nowYear-this.cycleCount+1,nowMonth,nowDay).format('yyyy');
                $('.onTimeStart').eq(this.cycleCount-1).val(nowStartVal)
                .datetimepicker({
                    format: 'yyyy',
                    autoclose:true,
                    minView:4,
                    startView:4
                });
                $('.onTimeEnd').eq(this.cycleCount-1).val(nowEndVal)
                .datetimepicker({
                    format: 'yyyy',
                    autoclose:true,
                    minView:4,
                    startView:4
                });
                startTime = nowStartVal+'-01-01 00:00:00';
                //endTime = new Date(nowYear,nowMonth-this.cycleCount+1,nowDay).format('yyyy-MM')+'-01 00:00:00';
            }else if(period=='d1'){
                nowStartVal = new Date(nowYear,nowMonth-this.cycleCount-1+1,nowDay).format('yyyy-MM');
                nowEndVal = new Date(nowYear,nowMonth-this.cycleCount+1,nowDay).format('yyyy-MM');
                $('.onTimeStart').eq(this.cycleCount-1).val(nowStartVal)
                .datetimepicker({
                    format: 'yyyy-mm',
                    autoclose:true,
                    minView:3,
                    startView:3
                });
                $('.onTimeEnd').eq(this.cycleCount-1).val(nowEndVal)
                .datetimepicker({
                    format: 'yyyy-mm',
                    autoclose:true,
                    minView:3,
                    startView:3
                });
                startTime = nowStartVal+'-01 00:00:00';
                //endTime = nowEndVal+'-01 00:00:00';
            }else if(period=='h1'){
                nowStartVal = new Date(nowYear,nowMonth,nowDay-this.cycleCount).format('yyyy-MM-dd');
                nowEndVal = new Date(nowYear,nowMonth,nowDay-this.cycleCount+1).format('yyyy-MM-dd');
                $('.onTimeStart').eq(this.cycleCount-1).val(nowStartVal)
                .datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    minView: 2,
                    startView: 2
                });
                $('.onTimeEnd').eq(this.cycleCount-1).val(nowEndVal)
                .datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose:true,
                    minView:2,
                    startView:2
                });
                startTime = nowStartVal+' 00:00:00';
                //endTime = new Date(new Date(startTime).valueOf()+3600000).format('yyyy-MM-dd HH')+':00:00';
            }else{
                nowStartVal = new Date(new Date().valueOf() - 3600000*this.cycleCount).format('yyyy-MM-dd HH:00');
                nowEndVal = new Date(new Date().valueOf() - 3600000*(this.cycleCount-1)).format('yyyy-MM-dd HH:00');
                $('.onTimeStart').eq(this.cycleCount-1).val(nowStartVal)
                .datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose:true,
                    minView:1,
                    startView:1
                });
                $('.onTimeEnd').eq(this.cycleCount-1).val(nowEndVal)
                .datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose:true,
                    minView:1,
                    startView:1
                });
                startTime = nowStartVal+':00';
                //endTime = new Date(new Date(startTime).valueOf()+300000).format('yyyy-MM-dd HH:mm')+':00';
            }
            var startYear = new Date(startTime).getFullYear();
            var startMonth = new Date(startTime).getMonth();
            var startDay = new Date(startTime).getDate();
            var startAllDay = new Date(startYear,startMonth+1,0).getDate();
            if(period=='d1'){
                endTime = new Date(startYear,startMonth,startAllDay).format('yyyy-MM-dd')+' 00:00:00';
            }else if(period=='M1'){
                endTime = startYear==new Date().getFullYear()?new Date().format('yyyy-MM-01')+' 00:00:00':new Date(startYear,startMonth,startDay).format('yyyy-12-01')+' 00:00:00';
            }else if(period=='h1'){
                endTime = startDay==new Date().getDate()?new Date().format('yyyy-MM-dd 00:00:00'):new Date(startTime).format('yyyy-MM-dd 23:59:59');
            }else{
                endTime = startTime.split(' ')[1].split(':')[0]==new Date().format('yyyy-MM-dd HH').split(' ')[1]?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(startTime).format('yyyy-MM-dd HH:59:59');
            }
            postData = {
                dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
                timeEnd:endTime,
                timeFormat:period,
                timeStart:startTime
            }
            this.async.push(this.anYoY(postData));
            if(this.onTimeArr.length==0){
                this.getPostData(period);
            }
            this.onTimeArr.push(postData);
            this.onTime.push({
                timeEnd:endTime,
                timeStart:startTime
            });
            console.log(this.onTimeArr)
            this.cycleCount +=1;
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
        $('#startTime').off('change').on('change',(e)=>{
            var $this = $(e.currentTarget);
            var timeStart = $this.val();
            this.timeChange(timeStart);
        });
        //同比查询时间更改事件
        $('.onTimeStart').off('change').on('change',function(e){
            var $this = $(e.currentTarget);
            var timeStart = $this.val();
            var period = $('.periodHistory').val();
            var nowIndex = $this.parents('.onTimeBox').index();
            var nextDom = $this.siblings('.onTimeEnd');
            this.timeChange(timeStart,true,nowIndex,nextDom);
        }.bind(this));
        //同比时间删除事件
        $('.removeOnTime').off('click').on('click',function(e){
            var $this = $(e.currentTarget);
            var index = $this.parents('.onTimeBox').index();
            this.onTimeArr.splice(index+1,1);
            this.onTime.splice(index+1,1);
            $this.parents('.onTimeBox').empty().remove();
            this.cycleCount = this.cycleCount-1;
            this.resultArr.splice(index+2,1)
            this.initColumnLine();
            //this.onQueryTime();
            console.log(this.onTimeArr);
        }.bind(this));
    };
    childrenColumn(){
        var type = $('.energyPover').find('.selected').attr('data-type');
        return WebAPI.post('/analysis/startWorkspaceDataGenHistogram'+(type=='energy'?'/increment':''),this.postData)
    };
    normalYoY(){
        var period = $('.periodHistory').val();
        if(this.onTimeArr.length==0){
            this.getPostData(period);
        }
        var type = $('.energyPover').find('.selected').attr('data-type');
        var thisNodePoint = type =='energy'?this.opt.store[0].config.energy:this.opt.store[0].config.power;
        this.onTimeArr[0].dsItemIds = [thisNodePoint];
        return WebAPI.post('/analysis/startWorkspaceDataGenHistogram'+(type=='energy'?'/increment':''),this.onTimeArr[0])
    };
    anYoY(postData){
        var type = $('.energyPover').find('.selected').attr('data-type');
        var thisNodePoint = type =='energy'?this.opt.store[0].config.energy:this.opt.store[0].config.power;
        postData.dsItemIds = [thisNodePoint];
        return WebAPI.post('/analysis/startWorkspaceDataGenHistogram'+(type=='energy'?'/increment':''),postData)
    };
    columnLine(){
        var _this = this;
        $.when.apply(this,this.async).done(function(){
            //console.log(resultArr)
            //var resultsArr =  Array.prototype.slice.apply(arguments);
            var resultsArr =  [];
            var len = _this.async.length;
            var store = {};
            if (len == 1){
                resultsArr.push(arguments[0])
            }else {
                for (var i = 0; i < len; i++) {
                    store = {
                        timeShaft:arguments[i][0].timeShaft,
                        list:arguments[i][0].list,
                    }
                    resultsArr.push(store)
                }
            }
            _this.initColumnLine(resultsArr);
        }).always(function(){
            _this.async = [];
        });
    };
    initColumnLine(argumentsArr){
        if(this.resultArr.length==0){
            if(argumentsArr){
                this.resultArr = argumentsArr;
            }
        }else{
            if(argumentsArr){
                this.resultArr = this.resultArr.concat(argumentsArr);
            }
        }
        //this.resultArr = this.resultArr.length==0?argumentsArr:this.resultArr.concat(argumentsArr);
        var type = $('.energyPover').find('.selected').attr('data-type');
        var period = $('.periodHistory').val();
        var arrLegendData = [];
        var timeShaftArr = [];
        var dataArr = [];
        var seriesArr = [],xAxiesArr = [];
        for(var item of this.pointNameArr){
            arrLegendData.push(item);
        }
        for(var i=0;i<this.resultArr.length;i++){
            var item = this.resultArr[i];
            if(i==0){
                for(var j = 0;j<item.list.length;j++){
                    dataArr.push(item.list[j].data);
                    if(type=='energy'){
                        seriesArr.push({
                            name:this.pointNameArr[j],
                            type:'bar',
                            stack:'累积量',
                            data:item.list[j].data
                        })
                    }else{
                        seriesArr.push({
                            name:this.pointNameArr[j],
                            type:'line',
                            symbolSize:0,
                            smooth:true,
                            data:item.list[j].data
                        })
                    }
                }
            }else{
                var currentLegend;
                if(period=='d1'){
                    currentLegend = this.opt.store[0].name+':'+(item.timeShaft.length==0?'':item.timeShaft[0].split(' ')[0].split('-')[0]+'-'+item.timeShaft[0].split(' ')[0].split('-')[1]);
                }else if(period=='M1'){
                    currentLegend = this.opt.store[0].name+':'+(item.timeShaft.length==0?'':item.timeShaft[0].split(' ')[0].split('-')[0]);
                }else if(period=='h1'){
                    currentLegend = this.opt.store[0].name+':'+(item.timeShaft.length==0?'':item.timeShaft[0].split(' ')[0]);
                }else{
                    currentLegend = this.opt.store[0].name+':'+(item.timeShaft.length==0?'':item.timeShaft[0].split(':')[0]);
                }
                arrLegendData.push(currentLegend);
                timeShaftArr.push(item.timeShaft);
                dataArr.push(item.list[0].data);
                if(type=='energy'){
                    seriesArr.push({
                        name:currentLegend,
                        type:'bar',
                        symbolSize:0,
                        smooth:true,
                        data:item.list[0].data
                    });
                }else{
                    seriesArr.push({
                        name:currentLegend,
                        type:'line',
                        symbolSize:0,
                        smooth:true,
                        data:item.list[0].data
                    });
                }
            }
        }
        timeShaftArr.sort(function(a,b){return b.length-a.length});
        var timeShaftArrMx = timeShaftArr[0];
        for(var i = 0;i<timeShaftArrMx.length;i++){
            if(period=='d1'){
               xAxiesArr.push('Day'+new Date(timeShaftArrMx[i]).getDate());
            }else if(period=='M1'){
                xAxiesArr.push('Month'+(new Date(timeShaftArrMx[i]).getMonth()+1));
            }else if(period=='h1'){
                xAxiesArr.push('Hour'+(parseInt(timeShaftArrMx[i].split(' ')[1].split(':')[0])+1));
            }else{
                xAxiesArr.push('Minute'+(parseInt(timeShaftArrMx[i].split(':')[1])));
            }
        }
        if(type=='energy'){
            this.columnLineEchart(xAxiesArr,arrLegendData,seriesArr)
        }else{
            this.renderBrokenLine(xAxiesArr,dataArr,true,arrLegendData);
        }

    }
    columnLineEchart(xAxiesArr,arrLegendData,seriesArr){
        var option = {
                color:this.normalColor,
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'       // 默认为直线，可选为：'line' | 'shadow'
                    },
                    backgroundColor:'rgba(230,232,236,0.9)',
                    textStyle:{
                        color:'#5C6777'
                    },
                    padding:10
                },
                grid:{
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top:'15%',
                    containLabel: true
                },
                axisLabel:{
                    formatter: function(value){
                        if(value >= 1000||value <= -1000){
                            return value/1000 + 'k';
                        }else{
                            return value;
                        }
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        data : xAxiesArr,
                        axisLine:{
                            lineStyle:{
                               color:'#eceeef'
                            }
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#a7b1c0'
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisTick:{
                            show:false
                        },
                        axisLine:{
                            lineStyle:{
                               color:'#eceeef'
                            }
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#a7b1c0'
                            }
                        }
                    }
                ],
                legend: {
                    data:arrLegendData,
                    top:'2%',
                    icon:'circle',
                    itemHeight: '9',
                },
                series:seriesArr
            }
            var chart = echarts.init($('.energyEcharts')[0],AppConfig.chartTheme);
            chart.setOption(option);
    }
    onQueryTime(){
        var type = $('.energyPover').find('.selected').attr('data-type');
        var period = $('.periodHistory').val();
        Spinner.spin($('#containerDisplayboard')[0]);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti',this.onTimeArr).done(resultData=>{
            var arrLegendData = [];
            var xAxiesArr = [];
            var timeShaftArr = [];
            var dataArr = [];
            if(resultData&&resultData.length>0){
                for(var i = 0;i<resultData.length;i++){
                    var item = resultData[i];
                    timeShaftArr.push(item.timeShaft);
                    dataArr[i] = [];
                    for(var j = 0;j<item.list.length; j++){
                        var point = item.list[j];
                        dataArr[i][j] = point.data;
                        if(period=='d1'){
                            arrLegendData.push(this.pointNameArr[j]+':'+(item.timeShaft.length==0?'':item.timeShaft[0].split(' ')[0].split('-')[0]+'-'+item.timeShaft[0].split(' ')[0].split('-')[1]));
                        }else if(period=='M1'){
                            arrLegendData.push(this.pointNameArr[j]+':'+(item.timeShaft.length==0?'':item.timeShaft[0].split(' ')[0].split('-')[0]));
                        }else if(period=='h1'){
                            arrLegendData.push(this.pointNameArr[j]+':'+(item.timeShaft.length==0?'':item.timeShaft[0].split(' ')[0]));
                        }else{
                            arrLegendData.push(this.pointNameArr[j]+':'+(item.timeShaft.length==0?'':item.timeShaft[0].split(':')[0]));
                        }
                    }
                }
                timeShaftArr.sort(function(a,b){return b.length-a.length});
                var timeShaftArrMx = timeShaftArr[0];
                for(var i = 0;i<timeShaftArrMx.length;i++){
                    if(period=='d1'){
                       xAxiesArr.push('Day'+new Date(timeShaftArrMx[i]).getDate());
                    }else if(period=='M1'){
                        xAxiesArr.push('Month'+(new Date(timeShaftArrMx[i]).getMonth()+1));
                    }else if(period=='h1'){
                        xAxiesArr.push('Hour'+(parseInt(timeShaftArrMx[i].split(' ')[1].split(':')[0])+1));
                    }else{
                        xAxiesArr.push('Minute'+(parseInt(timeShaftArrMx[i].split(':')[1])));
                    }
                }
            }else{
                infoBox.alert('no data');
            }
            if(type=='energy'){
                this.renderStackedColumn(xAxiesArr,dataArr,true,arrLegendData);
            }else{
                this.renderBrokenLine(xAxiesArr,dataArr,true,arrLegendData);
            }
        }).always(()=>{
            Spinner.stop();
        });
    };
    onNodeClick(nodes){
        this.nodesArr = nodes;
        this.getPointChildren(true);
        console.log(nodes)
    };
    onTimeChange(time){
        var type = $('.energyPover').find('.selected').attr('data-type');
        var timeFormat = $('.periodHistory').val();
        var postD = {
            dsItemIds:type=='energy'?this.pointEnergyArr:this.pointPowerArr,
            timeEnd:time>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-dd HH:mm:ss'):new Date(time).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat:timeFormat,
            timeStart:time>=new Date().format('yyyy-MM-dd')?new Date().format('yyyy-MM-01 00:00:00'):new Date(time).format('yyyy-MM-01 00:00:00')
        }
        this.postData = postD;
        this.init(type,postD)
    }
    close(){
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
var WorkflowSummary = (function () {
    var _this
    function WorkflowSummary() {
        _this = this;
        _this.$container = undefined;
        _this.data = undefined;
        _this.projTeamId = undefined;
        _this.responseChart = undefined;
        _this.complateChart = undefined;
    }

    WorkflowSummary.prototype = {
        show: function (containerId) {
            WebAPI.get('/static/views/workflow/workflowSummary.html').done(function(resultHtml){
                _this.$container = $(containerId);
                _this.$container.html(resultHtml);
                I18n.fillArea(_this.$container);
                $('#timeCircleSum').val('month');
                if(Spinner) Spinner.stop();
                $('#timeConfigSum').val(new Date().format('yyyy-MM'))
                    .datetimepicker({
                        format: "yyyy-mm",
                        autoclose: true,
                        minView: 3,
                        startView: 3,
                    });

                Spinner.spin($('#orderSummary')[0]);
                _this.initTeam();
                _this.initTaskGroup();
                _this.attevent();
            })
        },
        attevent:function(){
            //周期更改
            $('#timeCircleSum').off('change').on('change',function(e){
                var currentVal = $(this).val();
                var minView,startView,currentFormat,calenderFormat;
                if(currentVal=='week'){
                    minView = 2;
                    startView = 2;
                    currentFormat = 'yyyy-MM-dd';
                    calenderFormat = 'yyyy-mm-dd';
                }else if(currentVal=='month'){
                    minView = 3;
                    startView = 3;
                    currentFormat = 'yyyy-MM';
                    calenderFormat = 'yyyy-mm';
                }else{
                    minView = 4;
                    startView = 4;
                    currentFormat = 'yyyy';
                    calenderFormat = 'yyyy';
                }
                $('#timeConfigSum').val('').datetimepicker('remove')
                    .datetimepicker({
                        format: calenderFormat,
                        autoclose: true,
                        minView: minView,
                        startView: startView,
                    }).val(new Date().format(currentFormat));
            });
            //查询事件
            $('#btnQueryOrder').off('click').on('click',function(e){
                var nowTime;
                var timeStartSel;
                var returnTime = _this.getStartOrEnd(true);
                nowTime = returnTime.nowTime;
                timeStartSel = returnTime.timeStartSel;
                var teamVal = $('#teamSum').val();
                var taskGroupVal = $('#taskGroup').val();
                var postData = {
                    userId:AppConfig.userId,
                    timeStart:timeStartSel,
                    timeEnd:nowTime
                }
                if(teamVal!='all'){
                    postData['team'] = teamVal;
                }
                 if(taskGroupVal!='all'){
                    postData['taskGroup'] = taskGroupVal;
                }
                console.log(postData);
                Spinner.spin($('#orderSummary')[0]);
                _this.responseSummary(postData);
            });
            //每个进度条点击事件
            $('.compResProgress').off('click').on('click',function(){
                var $this = $(this);
                var $parent = $this.parent();
                var $parentNext = $parent.next();
                var $echartsDom = $parentNext.find('.echatsLine');
                $parent.css('height','50%');
                $parentNext.show();
                var now,weekStartDate,timeFormat;
                var returnTime = _this.getStartOrEnd();
                now = returnTime.nowTime;
                weekStartDate = returnTime.timeStartSel;
                timeFormat = returnTime.timeFormat;
                var seriesName = $parent.parent().prev().html();
                var parasname = $this.find('.compResName').html();
                var arrUserId = [];
                var type = $this.attr('type');
                arrUserId.push(parseInt($this.attr('data-id')));
                var itemType = $parent.attr('data-type')=='complateRate'?'completeRate':'completeTime';
                var postData = {
                    arrUserId:arrUserId,
                    timeStart:weekStartDate,
                    timeEnd:now,
                    timeFormat:timeFormat,
                    item:[itemType]
                }
                if(type=="complateRate"){
                    _this.complateChart&&_this.complateChart.dispose();
                }else{
                    _this.responseChart&&_this.responseChart.dispose();
                }
                WebAPI.post('/workflow/task/getHistoryStatistics',postData).done(function(resultData){
                    var data = resultData[0];
                    var comData = data.data[itemType];
                    for(var i = 0;i<comData.length;i++){
                        comData[i] = parseFloat(comData[i]).toFixed(2);
                    }
                    var optionLine = {
                        color:['#2d91d6','#3cbf62','#f9bc2b','#c87e72','#15c3c2','#0a72bar'],
                        title: {
                            text: seriesName,
                            textStyle:{
                                color:'#333'
                            },
                            left:'center'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'line'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            top:'15%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            data: data.timeShaft,
                            axisLine:{
                              lineStyle:{
                                    color:'#ddd'
                                }
                            },
                            textStyle:{
                                color:'#333'
                            }
                        },
                        yAxis: {
                            type: 'value',
                            splitLine:{
                                lineStyle:{
                                    color:'#ddd'
                                }
                            },
                            textStyle:{
                                color:'#333'
                            }
                        },
                        series: [{
                            name: parasname,
                            type: 'line',
                            data: comData
                        }]
                    }
                    if(type=="complateRate"){
                        _this.complateChart = echarts.init($echartsDom[0], AppConfig.chartTheme);
                        _this.complateChart.setOption(optionLine);
                    }else{
                        _this.responseChart = echarts.init($echartsDom[0], AppConfig.chartTheme);
                        _this.responseChart.setOption(optionLine);
                    }
                })
            });
            //echarts图关闭事件
            $('.closeBtn').off('click').on('click',function(){
                var $this = $(this);
                $this.parent().hide();
                $this.parent().prev().css('height','100%');
            })
        },
        responseSummary:function(postData){
            WebAPI.post('/workflow/task/getStatistics/'+_this.projTeamId,postData).done(function(resultData){
                _this.data = resultData;
                _this.initSummary(resultData);
                _this.initComplateRes(resultData);
                //_this.initComplateRate(resultData);echarts图元版本
            }).always(function(){
                Spinner.stop();
            })
        },
        getStartOrEnd:function(isShowAll){
            var currentTime = new Date();
            var now = new Date($('#timeConfigSum').val());
            var nowTime = now.format('yyyy-MM-dd 23:59:59');
            var nowDayOfWeek = now.getDay()?now.getDay():7;//获取当前为本周的第几天
            var currentDayOfWeek = currentTime.getDay();
            var nowDay = now.getDate();
            var currentDay = currentTime.getDate();
            var nowMonth = now.getMonth();
            var currentMonth = currentTime.getMonth();
            var nowYear = now.getFullYear();
            var currentYear = currentTime.getFullYear();
            var weekStartDate,currentWeekStartDate,monthStartDate,yearStartDate;
            if(isShowAll){
                weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1).format('yyyy-MM-dd HH:mm:ss');
                currentWeekStartDate = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek+1).format('yyyy-MM-dd HH:mm:ss');
                monthStartDate = new Date(nowYear, nowMonth, 1).format('yyyy-MM-dd HH:mm:ss');//一月开始时间 HH:mm:ss
                yearStartDate = new Date(nowYear,0, 1).format('yyyy-MM-dd HH:mm:ss');//一年开始时间 HH:mm:ss
            }else{
                weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1).format('yyyy-MM-dd');//一周开始时间周一 HH:mm:ss
                currentWeekStartDate = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek+1).format('yyyy-MM-dd');// HH:mm:ss
                monthStartDate = new Date(nowYear, nowMonth, 1).format('yyyy-MM-dd');//一月开始时间 HH:mm:ss
                yearStartDate = new Date(nowYear,0, 1).format('yyyy-MM-dd');//一年开始时间 HH:mm:ss
            }
            var currentCircle = $('#timeCircleSum').val();
            var timeStartSel,timeFormat;
            if(currentCircle=='week'){
                timeStartSel = weekStartDate;
                if(nowDay==currentTime.getDate()){
                    if(isShowAll){
                        nowTime = currentTime.format('yyyy-MM-dd HH:mm:ss');
                    }else{
                        nowTime = currentTime.format('yyyy-MM-dd');// HH:mm:ss
                    }
                }else{
                    if(new Date(weekStartDate).valueOf()<new Date(currentWeekStartDate).valueOf()){
                       //nowTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+7).format('yyyy-MM-dd');//一周结束 HH:mm:ss
                        if(isShowAll){
                            nowTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+7).format('yyyy-MM-dd HH:mm:ss');
                        }else{
                            nowTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+7).format('yyyy-MM-dd');//一周结束 HH:mm:ss
                        }
                    }
                }
                //nowTime = nowDayOfWeek==1?nowTime.format('yyyy-MM-dd 23:59:59'):nowTime;
                timeFormat = 'd1';
            }else if(currentCircle=='month'){
                timeStartSel = monthStartDate;
                timeFormat = 'd1';
                if(nowMonth==currentTime.getMonth()){
                    if(isShowAll){
                        nowTime = currentTime.format('yyyy-MM-dd HH:mm:ss');
                    }else{
                        nowTime = currentTime.format('yyyy-MM-dd');// HH:mm:ss
                    }
                }else{
                    if(isShowAll){
                        nowTime = new Date(nowYear, nowMonth+1, 0).format('yyyy-MM-dd 23:59:59');
                    }else{
                        nowTime = new Date(nowYear, nowMonth+1, 0).format('yyyy-MM-dd');// 23:59:59
                    }
                }
            }else{
                timeStartSel = yearStartDate;
                timeFormat = 'M1';
                if(nowYear==currentTime.getFullYear()){
                    if(isShowAll){
                        nowTime = currentTime.format('yyyy-MM-dd HH:mm:ss');
                    }else{
                        nowTime = currentTime.format('yyyy-MM-dd');// HH:mm:ss
                    }
                }else{
                    if(isShowAll){
                        nowTime = new Date(nowYear, 12, 0).format('yyyy-MM-dd 23:59:59');//
                    }else{
                        nowTime = new Date(nowYear, 12, 0).format('yyyy-MM-dd');// 23:59:59
                    }
                }
            }
            return {
                timeStartSel:timeStartSel,
                nowTime:nowTime,
                timeFormat:timeFormat
            }
        },
        initComplateRes:function(resultData){
            var singleDom = '<div class="compResProgress" data-id="{id}" type="{type}">\
                    <div class="compResName">{name}</div>\
                    <div class="progress">\
                      <div class="progress-bar" role="progressbar" aria-valuenow="{width}" aria-valuemin="0" aria-valuemax="100" style="width: {width}%;background-color:{bgColor}">\
                      </div>\
                    </div>\
                    <div class="compResNum">{compResNum}</div>\
                </div>';
            var detailData = resultData.detail;
            var complateDom = '';
            var responseDom = '';
            var totalOrder = resultData.overview?resultData.overview.total:0;//总公单
            var totalReponseTime = resultData.overview?resultData.overview.completeTime:0;//总响应时间
            var color = ['#2d91d6','#3cbf62','#f9bc2b','#c87e72','#15c3c2','#0a72bar'];
            var j = 0;
            //根据完成率排序
            var complateDate = detailData?detailData.sort(function (a, b) {
                return parseFloat(b.completeRate) - parseFloat(a.completeRate);
            }):[];
            //完成率显示
            for(var i = 0;i<complateDate.length;i++){
                var item = complateDate[i];
                complateDom += singleDom.formatEL({
                    id:item.id,
                    name:item.name,
                    width:parseFloat(item.completeRate)*100,
                    compResNum:(parseFloat(item.completeRate)*100).toFixed(2),
                    bgColor:color[j],
                    type:'complateRate'
                });
                j++;
                if(j==color.length) j = 0;
            }
            //根据响应时间排序
            var responseData = detailData?detailData.sort(function (a, b) {
                return parseFloat(b.completeTime) - parseFloat(a.completeTime);
            }):[];
            //响应时间显示
            for(var i = 0;i<responseData.length;i++){
                var item = responseData[i];
                responseDom += singleDom.formatEL({
                    id:item.id,
                    name:item.name,
                    width:parseFloat(item.completeTime)*100/parseFloat(responseData[0].completeTime),
                    compResNum:parseFloat(item.completeTime).toFixed(2)+'h',
                    bgColor:color[j],
                    type:'responseTime'
                })
                j++;
                if(j==color.length) j = 0;
            }
            $('.complateOrderList').html('').append(complateDom);
            $('.responseTimeList').html('').append(responseDom);
            _this.attevent();
        },
        initComplateRate:function(resultData){
            var detailData = resultData.detail;
            var yAxiesData = [];
            var complateRateArr = [];
            var responseTimeArr = [];
            for(var i = 0;i<detailData.length;i++){
                var item = detailData[i];
                yAxiesData.push(item.name);
                complateRateArr.push(item.completeRate);
                responseTimeArr.push(item.completeTime);
            }
            _this.renderBar(yAxiesData,complateRateArr,'完成率',$('.complateOrderList'));
            _this.renderBar(yAxiesData,responseTimeArr,'响应时间',$('.responseTimeList'));
        },
        renderBar:function(yAxiesData,seriesData,seriesName,$dom){
            var option = {
                color:['#2d91d6','#3cbf62','#f9bc2b','#c87e72','#15c3c2','#0a72bar'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    splitLine:{
                        show:false
                    }
                },
                yAxis: {
                    type: 'category',
                    data: yAxiesData,
                    axisLine:{
                        show:true
                    }
                },
                series: [
                    {
                        name: seriesName,
                        type: 'bar',
                        data: seriesData
                    }
                ]
            }
            var myEcharts = echarts.init($dom[0], AppConfig.chartTheme);
            myEcharts.setOption(option);
            myEcharts.on('click', function (params) {
                var arrUserId = [];
                if (params.componentType === 'series') {
                    var currentInfo = _this.data.detail;
                    var name = params.name;
                    for(var i = 0;i<currentInfo.length;i++){
                        var item = currentInfo[i];
                        if(item.name==name){
                            arrUserId.push(item.id);
                        }
                    }
                }
                var now,weekStartDate,timeFormat;
                var returnTime = _this.getStartOrEnd();
                now = returnTime.nowTime;
                weekStartDate = returnTime.timeStartSel;
                timeFormat = returnTime.timeFormat;
                var postData = {
                    arrUserId:arrUserId,
                    timeStart:weekStartDate,
                    timeEnd:now,
                    timeFormat:timeFormat,
                }
                //WebAPI.post('/workflow/task/getHistoryStatistics',postData).done(function(resultData){
                    var resultData = {
                        list: [{
                            userId: 233,
                            data: [43,54,67,3,56,64,35,5],//每个数值
                            timeShaft: ['2017-05-16 10:00:00','2017-05-17 10:00:00','2017-05-18 10:00:00','2017-05-19 10:00:00','2017-05-20 10:00:00','2017-05-21 10:00:00','2017-05-22 10:00:00','2017-05-23 10:00:00']//时间序列
                        }]
                    };
                    var optionLine = {
                        color:['#2d91d6','#3cbf62','#f9bc2b','#c87e72','#15c3c2','#0a72bar'],
                        title: {
                            text: seriesName,
                            textStyle:{
                                color:'#333'
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'line'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            data: resultData.list[0].timeShaft
                        },
                        yAxis: {
                             type: 'value'
                        },
                        series: [{
                            name:  params.name,
                            type: 'line',
                            data: resultData.list[0].data
                        }]
                    }
                $dom.next().show();
                echarts.init($dom.next()[0], AppConfig.chartTheme).setOption(optionLine);
                // })
            });
        },
        initSummary:function(resultData){
            var orderSummary = resultData.overview;
            var $orderSin = _this.$container.find('.orderSin');
            $orderSin.find('.pendingOrder').html(orderSummary?orderSummary.incomplete:'--');
            $orderSin.find('.delayOrder').html(orderSummary?orderSummary.delay:'--');
            $orderSin.find('.totalOrder').html(orderSummary?orderSummary.total:'--');
            $orderSin.find('.averageComp').html(orderSummary?(parseFloat(orderSummary.completeRate)*100).toFixed(2)+'%':'--');
            $orderSin.find('.responseTime').html(orderSummary?parseFloat(orderSummary.completeTime).toFixed(2)+'h':'--');
        },
        initTeam:function(){
            WebAPI.get('/workflow/team/').done(function(teamInfo){
                var teamDom = '<option value="all" i18n="workflow.team.ALL_TEAM">所有团队</option>';
                if(teamInfo.data&&teamInfo.data.team&&teamInfo.data.team.arch.length!=0){
                    var teamArr = teamInfo.data.team.arch;
                    for(var i = 0;i<teamArr.length;i++){
                        var item = teamArr[i];
                        teamDom += '<option value="'+item.id+'" data-type="'+item.type+'">'+item.name+'</option>';
                    }
                }
                $('#teamSum').html(teamDom);
                I18n.fillArea($('#teamSum'));
                _this.projTeamId = teamInfo.data&&teamInfo.data.team?teamInfo.data.team._id:undefined;
                //获取汇总的总数据
                var now;
                var weekStartDate;
                var returnTime = _this.getStartOrEnd(true);
                now = returnTime.nowTime;
                weekStartDate = returnTime.timeStartSel;
                var postDataInit = {
                    userId:AppConfig.userId,
                    timeStart:weekStartDate,
                    timeEnd:now
                }
                console.log(postDataInit);
                _this.responseSummary(postDataInit);
            })
        },
        initTaskGroup:function(){
            WebAPI.post('/workflow/taskGroupProcess/').done(function(taskGroupInfo){
                var tskGroupDom = '<option value="all" i18n="workflow.team.ALL_PROJECTS">所有任务组</option>';
                if(taskGroupInfo.data&&taskGroupInfo.data.length!=0){
                    var taskGroupArr = taskGroupInfo.data;
                    for(var i = 0;i<taskGroupArr.length;i++){
                        var item = taskGroupArr[i];
                        tskGroupDom += '<option value="'+item._id+'" data-desc="'+item.desc+'">'+(item.name?item.name:I18n.resource.workflow.team.DEFAULT_PROJECT)+'</option>';
                    }
                }
                $('#taskGroup').html(tskGroupDom);
                I18n.fillArea($('#taskGroup'));
            })
        },
        close: function () {
            _this.$container = null;
            _this.data = null;
            _this.projTeamId = null;
            _this.responseChart = null;
            _this.complateChart = null;
        }
    };

    return WorkflowSummary;
})();
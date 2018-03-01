class BenchmarkEnergyForecast{
    constructor(ctn,screen,opt){
        this.ctn = ctn;
        this.screen = screen;
        this.opt = opt;
        this.$bechForecast = undefined;
        this.paramsRelate = undefined;
        this.nodeMode = undefined;
        this.historyData = [];
        this.mathListData = [];
        this.importSuccess = undefined;
    }
    show(){
        var _this = this;
        WebAPI.get('/static/views/observer/benchmark/benchmarkEnergyForecast.html').done(resultHtml=>{
            $('.panelBmModule').html('').append(resultHtml);
            _this.$bechForecast = $('#bechForecast');
            I18n.fillArea(_this.$bechForecast);
            var startTime = new Date(new Date().valueOf() - 86400000).format('yyyy-MM');
            var showStart = parseInt(startTime.split('-')[0]) - 1 + '-' + startTime.split('-')[1];
            var timeFormatStr = timeFormatChange('yyyy-mm');
            var start = showStart.toDate(),
                end = new Date();
            
            $('#startTimeCog').datetimepicker({
                format: timeFormatStr,
                autoclose: true,
                todayBtn: true,
                minView:3,//new Date().format('yyyy-MM-dd hh:mm:ss')
                startView: 3,
                forceParse: false,
                startDate: "2010-01-01 00:00",
                endDate: end,
                initialDate: start
            }).val(start.timeFormat(timeFormatStr));
            $('#endTimeCog').datetimepicker({
                format: timeFormatStr,
                autoclose: true,
                todayBtn: true,
                minView:3,
                startView: 3,
                forceParse: false,
                startDate: "2010-01-01 00:00",
                endDate: end,
                initialDate: end
            }).val(end.timeFormat(timeFormatStr));

            _this.init();
            _this.attEvents();
        });
    }
    init(){
        var _this = this;
        var currentNode = this.screen.iotFilter.tree.getSelectedNodes()[0];
        var nodeId = currentNode._id;
        Spinner.spin($('#bechForecast')[0]);
        this.screen.getModel(nodeId).done((rs)=>{
            _this.nodeMode = rs;
            var $modalSelect = $('.modalSelect');
            $modalSelect.html('');
            if(rs.length===0){
                alert(I18n.resource.benchmark.energyForecast.NO_MODEL_CREAT);
                var option = '<option class="modalSin" i18n="benchmark.energyForecast.NO_MODEL">无模型</option>';
                $modalSelect.append(option);
                I18n.fillArea($modalSelect);
                return;
            }
            for(var i = 0;i<rs.length;i++){
                var name = rs[i].name==''?'Untitled':rs[i].name;
                var option = '<option class="modalSin" data-id = "'+rs[i]._id+'" data-interval="'+rs[i].interval+'">'+name+'('+rs[i].interval+')'+'</option>';
                $modalSelect.append(option);
            }
            var intervalFirst = $('.modalSelect').find('.modalSin:selected').attr('data-interval'); ;
            _this.attEvents();
            $('.timeSelsect').val(intervalFirst+'1');
            $('.timeSelsect').change();
       }).always(function(){
            Spinner.stop();
        });

    }
    attEvents(){
        var _this = this;
        //更换周期
        $('.timeSelsect').off('change').change(function(){
            var $this = $(this);
            //var startTime = new Date(new Date().valueOf() - 86400000).format('yyyy-MM');
            //var showStart = parseInt(startTime.split('-')[0])-1+'-'+startTime.split('-')[1];
            var $startTimeCog = $('#startTimeCog');
            var $endTimeCog = $('#endTimeCog');
            var $inputTime = _this.$bechForecast.find('.input-group').find('input.form-control');
            var timeFormatStr, start, end, minView, startView;
            if ($this.val() === 'M1') {
                timeFormatStr = timeFormatChange('yyyy-mm');
                start = new Date();
                end = new Date();
                minView = 3;
                startView = 3;
                
            }else if($this.val()==='h1'){
                timeFormatStr = timeFormatChange('yyyy-mm-dd hh')+':00';
                start = new Date().format('yyyy-MM-dd').toDate();
                end = new Date();
                minView = 1;
                startView = 2;
            } else {
                timeFormatStr = timeFormatChange('yyyy-mm-dd');
                start = new Date(new Date().valueOf() - 86400000);
                end = new Date();
                minView = 2;
                startView = 2;
            }
            $startTimeCog.val('').datetimepicker('remove').datetimepicker({
                format: timeFormatStr,
                autoclose: true,
                todayBtn: true,
                minView: minView,
                startView: startView,
                forceParse: false,
                startDate: "2010-01-01 00:00",
                endDate: new Date(),
                initialDate: start
            }).val(start.timeFormat(timeFormatStr));
            $endTimeCog.val('').datetimepicker('remove').datetimepicker({
                format: timeFormatStr,
                autoclose: true,
                todayBtn: true,
                minView: minView,
                startView: startView,
                forceParse: false,
                startDate: "2010-01-01 00:00",
                endDate: new Date(),
                initialDate: end
            }).val(end.timeFormat(timeFormatStr));

        });
        //模型选择
        function judgeModalInter(dataInterval){
            var currentTimeIn = $('.timeSelsect').val();
            var intervalStr = '';
            if(dataInterval==='h'){
                intervalStr = I18n.resource.benchmark.energyForecast.HOUR;//'时';
            }else if(dataInterval==='d'){
                intervalStr = I18n.resource.benchmark.energyOverView.DAY;
            }else{
                intervalStr = I18n.resource.benchmark.energyOverView.MONTH;
            }
            if(currentTimeIn.indexOf(dataInterval)===-1){
                alert(I18n.resource.benchmark.energyForecast.MODEL_NOT_ACCORD+intervalStr+I18n.resource.benchmark.energyForecast.PERIOD_CHANGE_MODEL);
                return false;
            }else{
                    return true;
            }
        }
        $('.modalSin').off('click').click(function(){
            var $this = $(this);
            var dataInterval =$this.attr('data-interval');
            judgeModalInter(dataInterval);
            var dataId = $this.attr('data-id');
        });
        //参数输入
        $('.tabalCell').off('click').click(function(){
            var $this = $(this);
            $this.find('lable.paramsShow').hide();
            $this.find('.paramsEnter').html('').show().focus();
        });
        $('.paramsEnter').blur(function(){
            var $this = $(this);
            var paramsValue = $this.val();
            $this.siblings('lable.paramsShow').html(paramsValue).show();
            $this.hide();
        });
        function historyForest(startTimes,endTimes,isRepeat,isConfig){
            var currentNode = _this.screen.iotFilter.tree.getSelectedNodes()[0];
            var nodeId = currentNode._id;
            var currentNodeCon = _this.screen.opt.point[nodeId];//当前节点包含的一些点Id
            var currentModal;
            var selectModalInte = $('.modalSelect').find('.modalSin:selected').attr('data-interval');
            var currentModalId = $('.modalSin:selected').attr('data-id');
            var isAccord = judgeModalInter(selectModalInte);
            if(!isAccord) return;
            var period = $('.timeSelsect').val();
            var isExistModal = false;
            for(var i = 0;i<_this.nodeMode.length;i++){
                if(period.indexOf(_this.nodeMode[i].interval)!==-1&&currentModalId === _this.nodeMode[i]._id){
                    isExistModal = true;
                    _this.paramsRelate = _this.nodeMode[i].params;
                    currentModal = _this.nodeMode[i];
                }
            }
            if(!isExistModal){
                alert(I18n.resource.benchmark.energyForecast.CHANGE_MODEL);
                return;
            }
            var startTimeCogVal = startTimes;//$('#startTimeCog').val();
            var endTimeCogVal = endTimes;//$('#endTimeCog').val();
            var startYear = parseInt(startTimeCogVal.split('-')[0]);
            var startMonth = parseInt(startTimeCogVal.split('-')[1]);
            var startDay = parseInt(startTimeCogVal.split(' ')[0].split('-')[2]);
            var endYear = parseInt(endTimeCogVal.split('-')[0]);
            var endMonth = parseInt(endTimeCogVal.split('-')[1]);
            var endDay = parseInt(endTimeCogVal.split(' ')[0].split('-')[2]);
            if(new Date(startTimeCogVal).valueOf()>new Date(endTimeCogVal).valueOf()){
                alert(I18n.resource.benchmark.energyForecast.TIME_WRONG);
                return;
            }
            var modalPeriod ;
            var rowLength,rowContent;
            var monthLength = 0;
            var monthArr = [];
            var monthArrCount = [];//手动计算
            var timeFormatStr;
            //var currentModal;
            var startTime,endTime,judgeStartTime;
            if(period ==='d1'){
                modalPeriod = 'd';
                startTimeCogVal = new Date(new Date(startTimeCogVal).valueOf()).format('yyyy-MM-dd');
                endTimeCogVal = new Date(new Date(endTimeCogVal).valueOf()).format('yyyy-MM-dd');
                if (!isRepeat) {
                    timeFormatStr = timeFormatChange('yyyy-mm-dd 00:00:00');
                    startTime = new Date(new Date(startTimeCogVal+' 00:00:00').valueOf()-86400000).format('yyyy-MM-dd 00:00:00');//startTimeCogVal.split('-')[0]+'-'+startTimeCogVal.split('-')[1]+'-'+(parseInt(startTimeCogVal.split('-')[1])-1>10?(parseInt(startTimeCogVal.split('-')[1])-1):('0'+(parseInt(startTimeCogVal.split('-')[1])-1).toString()))+' 00:00:00';
                    endTime = endTimeCogVal+' 00:00:00';
                    judgeStartTime = startTimeCogVal+' 00:00:00';
                } else {
                    timeFormatStr = timeFormatChange('yyyy-mm-dd 00:00:00');
                    startTime = new Date(new Date(startTimeCogVal).valueOf()-86400000).format('yyyy-MM-dd 00:00:00');
                    endTime = endTimeCogVal+' 00:00:00';
                    judgeStartTime = startTimeCogVal;
                }
                if(endYear-startYear>1){
                    alert(I18n.resource.benchmark.energyForecast.INTERVAL_LOOG);
                    return;
                }else{
                    if(endYear-startYear===0){
                        if(startMonth===endMonth){//当年月相同时
                            var intervalD = endDay-startDay+1;
                            monthLength += intervalD;
                            for(var i = 0;i<intervalD;i++){
                                var startDayF = startDay+i>9?(startDay+i):('0'+(startDay+i).toString());
                                monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+startDayF);
                            }
                        }else{//当年月不同时
                            var StartMonthDCount = new Date(startYear,startMonth,0).getDate();
                            var startMonthDay =StartMonthDCount - startDay+1;
                            //开始月份的时间间隔
                            monthLength += startMonthDay;
                            for(var i = 0;i<startMonthDay;i++){
                                var startMDayF = startDay+i>9?(startDay+i):('0'+(startDay+i).toString());
                                monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+startMDayF);
                            }
                            //中间月份的间隔
                            if(endMonth-startMonth>1){
                                var intervalM = endMonth-startMonth;
                                for(var i = 1;i<intervalM;i++){
                                    var intervalMcount = new Date(startYear,startMonth+1,0).getDate();
                                    monthLength+=intervalMcount;
                                    for(var j =1;j<=intervalMcount;j++ ){
                                        monthArrCount.push(startYear+'-'+(startMonth+1>9?(startMonth+1):('0'+(startMonth+1).toString()))+'-'+(j>9?j:'0'+j.toString()));
                                    }
                                }
                            }
                            //最后月份的时间间隔
                            monthLength+=endDay;
                            if(endDay===1){
                                monthArrCount.push(startYear + '-' + (endMonth > 9 ? endMonth : ('0' + endMonth.toString())) + '-' + '01');
                            }else {
                                for (var i = 1; i < endDay; i++) {
                                    monthArrCount.push(startYear + '-' + (endMonth > 9 ? endMonth : ('0' + endMonth.toString())) + '-' + (i > 9 ? i : '0' + i.toString()));
                                }
                            }
                        }
                    }else{
                        var StartMonthDCount = new Date(startYear,startMonth,0).getDate();
                        var startMonthDay =StartMonthDCount - startDay+1;
                        //开始月份的时间间隔
                        monthLength += startMonthDay;
                        for(var i = 0;i<startMonthDay;i++){
                            var startMDayF = startDay+i>9?(startDay+i):('0'+(startDay+i).toString());
                            monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+startMDayF);
                        }
                        //中间月份的计算
                        var startMonthArr = 12-startMonth;
                        for(var i = 1;i<=startMonthArr;i++){
                            var intervalMCountD =  new Date(startYear,startMonth+1,0).getDate();
                            monthLength+=intervalMcount;
                            for(var j = 1;j<=intervalMcount;j++){
                                monthArrCount.push(startYear+'-'+(startMonth+1>9?(startMonth+1):('0'+(startMonth+1).toString()))+'-'+(j>9?j:'0'+j.toString()));
                            }
                        }
                        for(var i =1;i<endMonth;i++){
                            var intervalEndMCountD = new Date(endYear,i,0).getDate();
                            monthLength+=intervalEndMCountD;
                            for(var j = 1;j<=intervalEndMCountD;j++){
                                monthArrCount.push(endYear+'-'+(i>9?i:'0'+i.toString())+(j>9?j:'0'+'-'+j.toString()));
                            }
                        }
                        //最后月份的时间间隔
                        monthLength+=endDay;
                        if(endDay===1){
                                monthArrCount.push(endYear + '-' + (endMonth > 9 ? endMonth : ('0' + endMonth.toString())) + '-' + '01');
                        }else{
                            for(var i = 1;i<endDay;i++){
                                monthArrCount.push(endYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(i>9?i:'0'+i.toString()));
                            }
                        }
                    }
                }

                monthArrCount = monthArrCount.map(function (v) {
                    return timeFormat(v,timeFormatChange('yyyy-mm-dd'));
                });
            //时间为月
            }else if(period ==='M1'){
                modalPeriod = 'M';
                startTimeCogVal = new Date(new Date(startTimeCogVal).valueOf()).format('yyyy-MM');
                endTimeCogVal = new Date(new Date(endTimeCogVal).valueOf()).format('yyyy-MM');
                if (!isRepeat) {
                    timeFormatStr = timeFormatChange('yyyy-mm-dd 00:00:00');
                    startTime = startYear + '-' + (startMonth - 1 > 9 ? (startMonth - 1) : ('0' + (startMonth - 1).toString())) + '-01 00:00:00';//startTimeCogVal+'-01 00:00:00';
                    endTime = endTimeCogVal + '-01 00:00:00';
                    judgeStartTime = startTimeCogVal + '-01 00:00:00';
                } else {
                    timeFormatStr = timeFormatChange('yyyy-mm-dd 00:00:00');
                    startTime = startYear + '-' + (startMonth - 1 > 9 ? (startMonth - 1) : ('0' + (startMonth - 1).toString())) + '-01 00:00:00';
                    endTime = endTimeCogVal+ '-01 00:00:00';
                    judgeStartTime = startTimeCogVal;
                }
                if(((startYear===endYear)&&(startMonth===endMonth))||(startYear>endYear)){
                    alert(I18n.resource.benchmark.energyForecast.TIME_REPEAT_SELECT);
                    return;
                }

                //var monthLength = 0;
                //var monthArr = [];
                if(startYear!==endYear){
                    //开始年份的月份总和
                    var startMonthInter = 12-startMonth;
                    monthLength+=startMonthInter;
                    for(var i =0;i<=startMonthInter;i++){
                        monthArrCount.push(startYear+'-'+((startMonth+i)<10?('0'+(startMonth+i)):(startMonth+i)));
                    }
                    //中间跨度年份的月份总和
                    if(endYear-startYear>1){
                        for(var i = 0;i<endYear-startYear-1;i++){
                            monthLength+=12;
                            var currentYear = startYear+1;
                            for(var j=1;j<=12;j++){
                              monthArrCount.push(currentYear+'-'+(j<10?('0'+j):j));
                            }
                        }
                    }
                    //最后年份的月份总和
                    monthLength+=endMonth;
                    for(var i = 1;i<=endMonth;i++){
                        monthArrCount.push(endYear+'-'+(i<10?('0'+i):i))
                    }
                }else{
                    monthLength+=(endMonth-startMonth);
                    for(var i = 0;i<=endMonth-startMonth;i++){
                        monthArrCount.push(startYear+'-'+((startMonth+i)<10?('0'+(startMonth+i)):(startMonth+i)))
                    }
                }

                monthArrCount = monthArrCount.map(function (v) {
                    return timeFormat(v,timeFormatChange('yyyy-mm'));
                });
            //时间为小时
            }else{
                 modalPeriod = 'h';
                startTimeCogVal = new Date(new Date(startTimeCogVal).valueOf()).format('yyyy-MM-dd HH:mm');
                endTimeCogVal = new Date(new Date(endTimeCogVal).valueOf()).format('yyyy-MM-dd HH:mm');
                 if (!isRepeat) {
                    timeFormatStr = timeFormatChange('yyyy-mm-dd hh:ii:ss');
                    startTime = new Date(new Date(startTimeCogVal + ':00').valueOf() - 3600000).format('yyyy-MM-dd HH:mm:ss')//startTimeCogVal+':00';
                    endTime = endTimeCogVal + ':00';
                    judgeStartTime = startTimeCogVal + ':00';
                 } else {
                    timeFormatStr = timeFormatChange('yyyy-mm-dd hh:ii:ss');
                    startTime = new Date(new Date(startTimeCogVal).valueOf() - 3600000).format('yyyy-MM-dd HH:mm:ss')//startTimeCogVal+':00';
                    endTime = endTimeCogVal+ ':00';
                    judgeStartTime = startTimeCogVal;
                }

                var startHour = parseInt(startTimeCogVal.split(' ')[1].split(':')[0]);
                startHour = startHour===0?24:startHour;

                var endHour = parseInt(endTimeCogVal.split(' ')[1].split(':')[0]);
                endHour = endHour===0?24:endHour;
                if(endYear!==startYear){
                    alert(I18n.resource.benchmark.energyForecast.INTERVAL_LOOG);
                    return;
                }else{
                    if(startMonth===endMonth){
                        if(startDay===endDay){
                            startHour = startHour===24?0:startHour;
                            var intervalHour = endHour-startHour;
                            monthLength+=intervalHour+1;
                            for(var i = 0;i<=intervalHour;i++){
                                var startHourF = startHour+i>9?(startHour+i):('0'+(startHour+i).toString());
                                if(startHourF===24){
                                    startHourF='00';
                                    monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay+1>9?(startDay+1):('0'+(startDay+1).toString()))+' '+startHourF+':00:00');
                                }else{
                                    monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startHourF+':00:00');
                                }
                            }
                        }else{
                            startHour = startHour===24?0:startHour;
                            var startDayHour =24 - startHour+1;
                            //开始时刻的时间间隔
                            monthLength += startDayHour;
                            for(var i = 0;i<startDayHour;i++){
                                var startDayHourF = startHour+i>9?(startHour+i):('0'+(startHour+i).toString());
                                //startDayHourF = startDayHourF===24?'00':startDayHourF;
                                if(startDayHourF===24){
                                    startDayHourF='00';
                                    monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay+1>9?(startDay+1):('0'+(startDay+1).toString()))+' '+startDayHourF+':00:00');
                                }else{
                                    monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00');
                                }
                                //monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00');
                            }
                            //中间时刻的间隔
                            if(endDay-startDay>1){
                                var intervalDays = endDay-startDay;
                                for(var i = 1;i<intervalDays;i++){
                                    monthLength+=24;
                                    for(var j =1;j<=24;j++ ){
                                        var endHourCur = (j>9?j:'0'+j.toString());
                                        //endHourCur = endHourCur===24?'00':endHourCur;
                                        if(endHourCur===24){
                                            endHourCur='00';
                                            monthArrCount.push(startYear+'-'+(startMonth>9?(startMonth):('0'+(startMonth).toString()))+'-'+(startDay+2>9?(startDay+2):('0'+(startDay+2).toString()))+' '+endHourCur+':00:00');
                                        }else{
                                            monthArrCount.push(startYear+'-'+(startMonth>9?(startMonth):('0'+(startMonth).toString()))+'-'+(startDay+1>9?(startDay+1):('0'+(startDay+1).toString()))+' '+endHourCur+':00:00');
                                        }
                                        //monthArrCount.push(startYear+'-'+(startMonth>9?(startMonth):('0'+(startMonth).toString()))+'-'+(startDay+1>9?(startDay+1):('0'+(startDay+1).toString()))+' '+endHourCur+':00:00');
                                    }
                                }
                            }
                            //最后时刻的时间间隔
                            monthLength+=endHour;
                            if(endHour===1){
                                monthArrCount.push(startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+'01:00:00');
                            }else{
                                for(var i = 1;i<=endHour;i++){
                                    var endHourCue = i>9?i:'0'+i.toString();
                                    //endHourCue = endHourCue===24?'00':endHourCue;
                                    if(endHourCue===24){
                                        endHourCue='00';
                                        monthArrCount.push(startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay+1>9?(endDay+1):('0'+(endDay+1).toString()))+' '+endHourCue+':00:00');
                                    }else{
                                       monthArrCount.push(startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+endHourCue+':00:00');
                                    }
                                    //monthArrCount.push(startYear+'-'+(endMonth>9?endMonth:('0'+endMonth.toString()))+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+endHourCue+':00:00');
                                }
                            }
                        }
                    }else{
                        //if(endMonth-startMonth>1)
                        startHour = startHour===24?0:startHour;
                        var startDayHour =24 - startHour+1;
                        //开始时刻的时间间隔
                        monthLength += startDayHour;
                        for(var i = 0;i<startDayHour;i++){
                            var startDayHourF = startHour+i>9?(startHour+i):('0'+(startHour+i).toString());
                            //startDayHourF = startDayHourF===24?'00':startDayHourF;
                            if(startDayHourF===24){
                                startDayHourF='00';
                               monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay+1>9?(startDay+1):('0'+(startDay+1).toString()))+' '+startDayHourF+':00:00');
                            }else{
                               monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00');
                            }
                            //monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+(startDay>9?startDay:('0'+startDay.toString()))+' '+startDayHourF+':00:00');
                        }
                        var startMonthDCount = new Date(startYear,startMonth,0).getDate();
                        var intervalDay = startMonthDCount-startDay;
                        for(var i = 1;i<=intervalDay;i++){
                            var pushStartDay = (startDay+i)>9?(startDay+i):('0'+(startDay+i).toString());
                            var pushStartDay1 = (startDay+i+1)>9?(startDay+i+1):('0'+(startDay+i+1).toString());
                            for(var j = 1;j<=24;j++){
                                monthLength+=24;
                                var pushDayHourCound =  m>9?m:('0'+m.toString());
                                //pushDayHourCound = pushDayHourCound===24?'00':pushDayHourCound;
                                if(pushDayHourCound===24){
                                    pushDayHourCound='00';
                                   monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+pushStartDay1+' '+pushDayHourCound+':00:00');
                                }else{
                                   monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+pushStartDay+' '+pushDayHourCound+':00:00');
                                }
                                //monthArrCount.push(startYear+'-'+(startMonth>9?startMonth:('0'+startMonth.toString()))+'-'+pushStartDay+' '+pushDayHourCound+':00:00');
                            }
                        }
                        //中间时刻的计算
                        var startMonthArr = endMonth-startMonth;
                        if(endMonth-startMonth>1){
                            var monthHourArr = endMonth-startMonth;
                            for(var i = 1;i<monthHourArr;i++){
                                var currentMonths = startMonth+i>9?(startMonth+i):('0'+(startMonth+i).toString());
                                var currentMonthDays = new Date(startYear,currentMonths,0).getDate();
                                for(var j = 1;j<=currentMonthDays;j++){
                                    var currentMonthDay = j>9?j:('0'+j.toString());
                                    var currentMonthDay1 = j+1>9?j+1:('0'+(j+1).toString());
                                    for(var k = 1;k<=24;k++){
                                        monthLength+=24;
                                        var currentMonthDayHour =  k>9?k:('0'+k.toString());
                                        //currentMonthDayHour = currentMonthDayHour===24?'00':currentMonthDayHour;
                                        if(currentMonthDayHour===24){
                                            currentMonthDayHour='00';
                                           monthArrCount.push(startYear+'-'+currentMonths+'-'+currentMonthDay1+' '+currentMonthDayHour+':00:00');
                                        }else{
                                           monthArrCount.push(startYear+'-'+currentMonths+'-'+currentMonthDay+' '+currentMonthDayHour+':00:00');
                                        }
                                        //monthArrCount.push(startYear+'-'+currentMonths+'-'+currentMonthDay+' '+currentMonthDayHour+':00:00');
                                    }
                                }
                            }
                        }
                        //最后时刻的时间间隔
                        var endMonthGe = endMonth>9?endMonth:('0'+endMonth.toString());
                        for(var i = 1;i<endDay;i++){
                            var currendEndDay = i>9?i:('0'+i.toString());
                            var currendEndDay1 = i+1>9?i+1:('0'+(i+1).toString());
                            for(var j = 1;j<=24;j++){
                                 monthLength+=24;
                                var currentEndDayHours =  j>9?j:('0'+j.toString());
                                //currentEndDayHours = currentEndDayHours===24?'00':currentEndDayHours;
                                if(currentEndDayHours===24){
                                    currentEndDayHours='00';
                                   monthArrCount.push(startYear+'-'+endMonthGe+'-'+currendEndDay1+' '+currentEndDayHours+':00:00');
                                }else{
                                   monthArrCount.push(startYear+'-'+endMonthGe+'-'+currendEndDay+' '+currentEndDayHours+':00:00');
                                }
                                //monthArrCount.push(startYear+'-'+endMonthGe+'-'+currendEndDay+' '+currentEndDayHours+':00:00');
                            }
                        }
                        monthLength+=endHour;
                        if(endHour===1){
                            monthArrCount.push(startYear+'-'+endMonthGe+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+'01:00:00');
                        }else{
                            for(var i = 1;i<endHour;i++){
                                monthArrCount.push(startYear+'-'+endMonthGe+'-'+(endDay>9?endDay:('0'+endDay.toString()))+' '+(i>9?i:('0'+i.toString()))+':00:00');
                            }
                        }
                    }

                    monthArrCount = monthArrCount.map(function (v) {
                        return timeFormat(v,timeFormatChange('yyyy-mm-dd hh:00:00'));
                    });
                }
            }
            if(new Date(startTime).valueOf()>new Date().valueOf()){
                startTime = parseInt(judgeStartTime.split('-')[0])-1+'-'+judgeStartTime.split('-')[1]+'-'+judgeStartTime.split('-')[2];
                endTime = parseInt(endTime.split('-')[0])-1+'-'+endTime.split('-')[1]+'-'+endTime.split('-')[2];
            }
            var itemIds = [];
            var energyId = currentNodeCon?currentNodeCon.energy:'';
            itemIds.push(energyId);
            if(_this.paramsRelate.length>0){
                for(var i = 0;i<_this.paramsRelate.length;i++){
                    itemIds.push( _this.paramsRelate[i].point);
                }
            }
            if(isConfig){
                if(!isRepeat){
                    var $paramsListBox = $('#paramsListBox');
                    $paramsListBox.html('');
                    var params =  currentModal.params;//[{name:'cc',pName:'x1',point:'55890f8594022d0344b59ec2'}]{'x2': '55504c7977d2f006e0b0d0f4', 'x1': '55890f8594022d0344b59ec2', 'x3': '55504c7977d2f006e0b0d0f5'};
                    var cellLength=0;
                    var cellOther='';
                    var timeListBox = '<div class="tableHeadBox clearfix"><div class="tabalCellH" i18n="benchmark.energyForecast.TIME">时间</div>';
                    for(var i = 0;i< params.length;i++){
                        cellOther+='<div class="tabalCellH" data-x="'+params[i].pName+'">'+(params[i].name.trim()!==''?params[i].name:params[i].pName)+'</div>';
                        cellLength+=1;
                    }
                    $paramsListBox.append(timeListBox+cellOther+'</div>');
                    I18n.fillArea($paramsListBox);
                    for(var i = 0;i<monthArrCount.length;i++){
                        var timeListBox1;
                        var cellOther1='';
                        timeListBox1 = '<div class="tableContentBox clearfix"><div class="tabalCellT">'+monthArrCount[i]+'</div>';
                        for(var m = 0;m<params.length;m++){
                            cellOther1+='<div class="tabalCell" data-param="'+params[m].pName+'" data-id="'+params[m].point+'"><input type="text" class="paramsEnter"/><lable class="paramsShow"></lable></div>';
                        }

                        $paramsListBox.append(timeListBox1+cellOther1+'</div>');
                    }
                    $('.tabalCellH').width(100/(cellLength+1)-2+'%');
                    $('.tabalCellT').width(100/(cellLength+1)-2+'%');
                    $('.tabalCell').width(100/(cellLength+1)-2+'%');
                    $('#configForestModal').modal('show');
                    _this.attEvents();
                    return;
                }
            }
            var postData = {
                dsItemIds:itemIds,
                timeEnd:endTime,
                timeFormat:period,
                timeStart:startTime
            }
            Spinner.spin($('#configForestModal')[0]);
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postData).done(result=>{
                if(new Date(judgeStartTime).valueOf()>new Date().valueOf()){
                    //monthArr = result.timeShaft;
                    if(result.timeShaft.length===0){
                        monthArr = monthArrCount;
                    }else {
                        var mothArrRep = [];
                        var resultList = result.list[0];
                        for (var i = 0; i < result.timeShaft.length; i++) {
                            mothArrRep.push(parseInt(result.timeShaft[i].split('-')[0]) + 1 + '-' + result.timeShaft[i].split('-')[1] + '-' + result.timeShaft[i].split('-')[2]);
                            if (period == 'd1') {
                                monthArr.push(timeFormat(mothArrRep[i],timeFormatChange('yyyy-mm-dd')));
                            } else if (period == 'M1') {
                                rmonthArr.push(timeFormat(mothArrRep[i],timeFormatChange('yyyy-mm')));
                            } else {
                                monthArr.push(timeFormat(mothArrRep[i],timeFormatChange('yyyy-mm-dd hh:ii')));
                            }
                        }
                        if (isRepeat) {
                            monthArr = monthArrCount;
                        }
                    }
                }else {
                    var resultList = result.list[0];
                    if (resultList.data.length !== 0) {
                        resultList.timeShift = [];
                        var tempArr = [];
                        for (var i = 1; i < resultList.data.length; i++) {
                            resultList.data[i - 1] = (resultList.data[i] - resultList.data[i - 1]).toFixed(2);
                            if (period == 'd1') {
                                resultList.timeShift.push(result.timeShaft[i].split(' ')[0]);
                                tempArr.push(timeFormat(result.timeShaft[i],timeFormatChange('yyyy-mm-dd')));
                            } else if (period == 'M1') {
                                resultList.timeShift.push(result.timeShaft[i].split('-')[0] + '-' + result.timeShaft[i].split('-')[1]);
                                tempArr.push(timeFormat(result.timeShaft[i],timeFormatChange('yyyy-mm')));
                            } else {
                                resultList.timeShift.push(result.timeShaft[i].split(':')[0] + ':' + result.timeShaft[i].split(':')[1]);
                                tempArr.push(timeFormat(result.timeShaft[i],timeFormatChange('yyyy-mm-dd hh:ii')));
                            }
                        }
                        resultList.data = resultList.data.slice(0, resultList.data.length - 1);
                        _this.historyData = [resultList];
                        monthArr = tempArr;
                         if(isRepeat){
                            monthArr = monthArrCount;
                        }
                    }else{
                        monthArr = monthArrCount;
                    }
                }
                _this.mathListData = monthArr;
                if(!isRepeat){
                    var $paramsListBox = $('#paramsListBox');
                    $paramsListBox.html('');
                    var params =  currentModal.params;//[{name:'cc',pName:'x1',point:'55890f8594022d0344b59ec2'}]{'x2': '55504c7977d2f006e0b0d0f4', 'x1': '55890f8594022d0344b59ec2', 'x3': '55504c7977d2f006e0b0d0f5'};
                    var cellLength=0;
                    var cellOther='';
                    var timeListBox = '<div class="tableHeadBox clearfix"><div class="tabalCellH" i18n="benchmark.energyForecast.TIME">时间</div>';
                    for(var i = 0;i< params.length;i++){
                        cellOther+='<div class="tabalCellH" data-x="'+params[i].pName+'">'+(params[i].name.trim()!==''?params[i].name:params[i].pName)+'</div>';
                        cellLength+=1;
                    }
                    $paramsListBox.append(timeListBox+cellOther+'</div>');
                    I18n.fillArea($paramsListBox);
                    for(var i = 0;i<monthArr.length;i++){
                        var timeListBox1;
                        var cellOther1='';
                        timeListBox1 = '<div class="tableContentBox clearfix"><div class="tabalCellT">'+monthArr[i]+'</div>';
                        for(var m = 0;m<params.length;m++){
                            cellOther1+='<div class="tabalCell" data-param="'+params[m].pName+'" data-id="'+params[m].point+'"><input type="text" class="paramsEnter"/><lable class="paramsShow"></lable></div>';
                        }

                        $paramsListBox.append(timeListBox1+cellOther1+'</div>');
                    }
                    $('.tabalCellH').width(100/(cellLength+1)-2+'%');
                    $('.tabalCellT').width(100/(cellLength+1)-2+'%');
                    $('.tabalCell').width(100/(cellLength+1)-2+'%');
                    $('#configForestModal').modal('show');

                    for(var i = 1;i<result.list.length;i++){
                        var currentPList = result.list[i];
                        var nowPPoint = currentPList.dsItemId;
                        for(var j = 1;j<currentPList.data.length;j++){
                            var nowReduce = parseFloat((currentPList.data[j]).toFixed(2))>0?(currentPList.data[j]).toFixed(2):0;
                            currentPList.data[j-1] = nowReduce;
                            $('.tabalCell[data-id="'+nowPPoint+'"]').eq(j-1).find('.paramsShow').html(nowReduce);
                        }
                    }
                    //$('#modalConfigStartTime').val(timeFormat(startTimeCogVal,timeFormatStr));
                    //$('#modalConfigEndTime').val(timeFormat(endTimeCogVal,timeFormatStr));

                    _this.attEvents();
                }

            }).always(function () {
                Spinner.stop();
            });
        };
        //点击配置按钮
        $('#forestConfig').off('click').click(function(){
            var currentNode = _this.screen.iotFilter.tree.getSelectedNodes()[0];
            var nodeId = currentNode._id;
            var currentNodeCon = _this.screen.opt.point[nodeId];//当前节点包含的一些点Id
            var currentModal;
            if(_this.nodeMode.length===0){
                alert(I18n.resource.benchmark.energyForecast.NO_MODEL_CREAT);
                return;
            }
            var selectModalInte = $('.modalSelect').find('.modalSin:selected').attr('data-interval');
            var currentModalId = $('.modalSin:selected').attr('data-id');
            var isAccord = judgeModalInter(selectModalInte);
            if(!isAccord) return;
            var period = $('.timeSelsect').val();
            var isExistModal = false;
            for(var i = 0;i<_this.nodeMode.length;i++){
                if(period.indexOf(_this.nodeMode[i].interval)!==-1&&currentModalId === _this.nodeMode[i]._id){
                    isExistModal = true;
                    _this.paramsRelate = _this.nodeMode[i].params;
                    currentModal = _this.nodeMode[i];
                }
            }
            if(!isExistModal){
                alert(I18n.resource.benchmark.energyForecast.CHANGE_MODEL);
                return;
            }

            var startTimeCogVal = $('#startTimeCog').val()//timeFormat($('#startTimeCog').val(),'yyyy-mm-dd hh:ii');
            var endTimeCogVal = $('#endTimeCog').val()//timeFormat($('#endTimeCog').val(),'yyyy-mm-dd hh:ii');
            //var startYear = parseInt(startTimeCogVal.split('-')[0]);
            //var startMonth = parseInt(startTimeCogVal.split('-')[1]);
            //var startDay = parseInt(startTimeCogVal.split(' ')[0].split('-')[2]);
            //var endYear = parseInt(endTimeCogVal.split('-')[0]);
            //var endMonth = parseInt(endTimeCogVal.split('-')[1]);
            //var endDay = parseInt(endTimeCogVal.split(' ')[0].split('-')[2]);
            //if(new Date(startTimeCogVal).valueOf()>new Date(endTimeCogVal).valueOf()){
            //    alert(I18n.resource.benchmark.energyForecast.TIME_WRONG);
            //    return;
            //}
            if(currentModal) {
                if($('#configForestModal').length!==0){$('#configForestModal').empty().remove()}
                if($('#configForestModal').length===0) {
                    var configForestModal = '<div class="modal fade" id="configForestModal">\
                                <div class="modal-dialog">\
                                <div class="modal-content">\
                                  <div class="modal-header">\
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                    <h4 class="modal-title" i18n="benchmark.energyForecast.PARAMS_CONFIG">参数配置</h4>\
                                  </div>\
                                  <div class="modal-body">\
                                    <div class="configTopTime clearfix">\
                                    <div class="timeBox">\
                                        <span i18n="benchmark.energyForecast.FROM">从</span><input  type="text" class="form-control" id="modalConfigStartTime">\
                                        <span i18n="benchmark.energyForecast.TO">到</span><input  type="text" class="form-control" id="modalConfigEndTime">\
                                    </div><input type="file" id="importDataIpt" style="display:none"/>\
                                    <div class="checkAll btn btn-primary" i18n="benchmark.energyQuery.QUERY">查询</div>\
                                    <div class="importData btn btn-primary" i18n="benchmark.energyForecast.IMPORT_DATA">导入数据</div>\
                                    <div class="excelTemplate btn btn-primary" i18n="benchmark.energyForecast.DOWN_EXCEL_TEMPLATE">下载模板</div>\
                                    </div>\
                                    <div class="configContent"><div id="paramsListBox"></div></div>\
                                  </div>\
                                  <div class="modal-footer">\
                                    <button type="button" class="btn btn-default" data-dismiss="modal" i18n="benchmark.energyForecast.CANCEL">取消</button>\
                                    <button type="button" class="btn btn-primary" id="savaParams" i18n="benchmark.energyForecast.OK">确定</button>\
                                  </div>\
                                </div>\
                              </div>\
                            </div>';
                    $('.panelBmModule').append(configForestModal);
                    var timeFormatStr;
                    var start ,end,minView,startView;
                    var $timeSelsect = $('.timeSelsect');

                    if ($timeSelsect.val() === 'M1') {
                        timeFormatStr = timeFormatChange('yyyy-mm');
                        start = new Date();
                        end = new Date();
                        minView = 3;
                        startView = 3;

                    }else if($timeSelsect.val()==='h1'){
                        timeFormatStr = timeFormatChange('yyyy-mm-dd hh')+':00';
                        start = new Date().format('yyyy-MM-dd').toDate();
                        end = new Date();
                        minView = 1;
                        startView = 2;
                    } else {
                        timeFormatStr = timeFormatChange('yyyy-mm-dd');
                        start = new Date(new Date().valueOf() - 86400000);
                        end = new Date();
                        minView = 2;
                        startView = 2;
                    }
                    $('#modalConfigStartTime').val('').datetimepicker('remove').datetimepicker({
                        format: timeFormatStr,
                        autoclose: true,
                        todayBtn: true,
                        minView: minView,
                        startView: startView,
                        forceParse: false,
                        startDate: "2010-01-01 00:00",
                        endDate: new Date(),
                        initialDate: start
                    }).val(startTimeCogVal);//start.timeFormat(timeFormatStr)
                    $('#modalConfigEndTime').val('').datetimepicker('remove').datetimepicker({
                        format: timeFormatStr,
                        autoclose: true,
                        todayBtn: true,
                        minView: minView,
                        startView: startView,
                        forceParse: false,
                        startDate: "2010-01-01 00:00",
                        endDate: new Date(),
                        initialDate: end
                    }).val(endTimeCogVal);//end.timeFormat(timeFormatStr)
                    I18n.fillArea($('.panelBmModule'));

                    historyForest(startTimeCogVal,endTimeCogVal,false,true);

                }
            }else{
                alert(I18n.resource.benchmark.energyForecast.NO_MODEL);
            }
        });
        //参数输入
        //$('.tabalCell').off('click').click(function(){
        //    var $this = $(this);
        //    $this.find('lable.paramsShow').hide();
        //    $this.find('.paramsEnter').html('').show().focus();
        //});
        $('.paramsEnter').blur(function(){
            var $this = $(this);
            var paramsValue = $this.val();
            $this.siblings('lable.paramsShow').html(paramsValue).show();
            $this.hide();
        });
        //导入数据按钮
        $('.importData').off('click').click(function(){
            $('#importDataIpt').click();
        });
        $('#importDataIpt').change(function(e){
            //console.log(e);
            var currentModalId = $('.modalSin:selected').attr('data-id');
            var currentModal ;
            var period = $('.timeSelsect').val();
            var modalPeriod ;
            if(period ==='d1'){
                modalPeriod = 'd';
            }else if(period ==='M1'){
                modalPeriod = 'M';
            }else{
                 modalPeriod = 'h';
            }
            for(var m = 0;m<_this.nodeMode.length;m++){
                if(modalPeriod===_this.nodeMode[m].interval&&currentModalId === _this.nodeMode[m]._id){
                    currentModal = _this.nodeMode[m];
                    continue;
                }
            }
            var currentMParams = currentModal.params;
            var files = e.target.files;
            if(!files||files.length<1) return;
            //var fileSuffix = file.name.split('.')[1];
            if(!/(xls|xlsx|csv)$/i.test(files[0].name)){
                alert(I18n.resource.benchmark.energyForecast.SELECT_EXCEL);
            }else{
                var formData = new FormData();
                formData.append('file', files[0]);
                $.ajax({
                    url: '/benchmark/importHistoryData',
                    type: 'post',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(result){
                        //console.log(result);
                        if(!result.data||result.time.length===0){
                            alert(I18n.resource.benchmark.energyOverView.NO_DATA)
                        }else{
                            _this.importSuccess = true;
                            var resultData = result.data;
                            $('#modalConfigStartTime').val(result.time[0]);
                            $('#modalConfigEndTime').val(result.time[result.time.length-1]);
                            var cellOther = '';
                            var timeListBox = '<div class="tableHeadBox clearfix"><div class="tabalCellH" i18n="benchmark.energyForecast.TIME">时间</div>';
                            for(var item in resultData){
                                var dataX;
                                for(var i = 0;i<currentMParams.length;i++){
                                    if(item===currentMParams[i].name){
                                        dataX = currentMParams[i].pName;
                                    }
                                }
                                cellOther+='<div class="tabalCellH" data-x="'+dataX+'">'+item+'</div>';
                                //var xDataList = resultData[item];
                                //if(xDataList.length!==0){
                                //    for(var i=0;i<xDataList.length;i++){
                                //        cellOther1+='<div class="tabalCell" data-param="'+item+'"><input type="text" class="paramsEnter"/><lable class="paramsShow">'+xDataList[i]+'</lable></div>';// data-id="'+params[m].point+'"
                                //    }
                                //}
                            }
                            $('#paramsListBox').html('').append(timeListBox+cellOther+'</div>');
                            I18n.fillArea($('#paramsListBox'));
                            var itemCount = 0;
                            for(var item in resultData){
                                var xDataList = resultData[item];
                                var dataX;
                                for(var i = 0;i<currentMParams.length;i++){
                                    if(item===currentMParams[i].name){
                                        dataX = currentMParams[i].pName;
                                    }
                                }
                                if(xDataList.length!==0){
                                    for(var i=0;i<xDataList.length;i++){
                                        if(itemCount===0){
                                            var timeListBox1 = '<div class="tableContentBox clearfix"><div class="tabalCellT">'+result.time[i]+'</div>';
                                            var cellOther1='<div class="tabalCell" data-param="'+dataX+'"><input type="text" class="paramsEnter"/><lable class="paramsShow">'+xDataList[i]+'</lable></div>';// data-id="'+params[m].point+'"
                                            $('#paramsListBox').append(timeListBox1+cellOther1+'</div>');
                                        }else{
                                            var cellOther2='<div class="tabalCell" data-param="'+dataX+'"><input type="text" class="paramsEnter"/><lable class="paramsShow">'+xDataList[i]+'</lable></div>'
                                            $('#paramsListBox').find('.tableContentBox').eq(i).append(cellOther2);
                                        }
                                    }
                                }
                                itemCount+=1;
                            }
                            var cellLength = $('.tableHeadBox').find('.tabalCellH').length;
                            $('.tabalCellH').width(100/(cellLength)-2+'%');
                            $('.tabalCellT').width(100/(cellLength)-2+'%');
                            $('.tabalCell').width(100/(cellLength)-2+'%');
                            _this.attEvents();
                        }
                        //if(!result.data || result.data.length == 0) return;
                        //result.data.forEach(function(i){
                        //    _this.$divAssetImg.html('<div class="imgItem"><img src="http://images.rnbtech.com.hk/' + i + '?_=' + Date.now().valueOf() + '" class="imgAsset" id="imgAsset"/></div>');//
                        //});
                    }
                })
            }
        });
        //保存参数
        $('#savaParams').off('click').click(function(){
            var period = $('.timeSelsect').val();
            var startTimeCogVal = $('#modalConfigStartTime').val();
            var endTimeCogVal = $('#modalConfigEndTime').val();
            var startTimeCogValPer = $('#startTimeCog').val();
            var endTimeCogValPer = $('#endTimeCog').val();
            var currentModalId = $('.modalSin:selected').attr('data-id');
            var modalPeriod ;
            var startTime,endTime;
            var isRepeat = false;
            if(period ==='d1'){
                modalPeriod = 'd';
                startTimeCogVal = new Date(new Date(startTimeCogVal).valueOf()).format('yyyy-MM-dd');
                endTimeCogVal = new Date(new Date(endTimeCogVal).valueOf()).format('yyyy-MM-dd');
                startTime = startTimeCogVal + ' 00:00:00';
                endTime = endTimeCogVal + ' 00:00:00';
                startTimeCogValPer = timeFormat(startTimeCogValPer,'yyyy-mm-dd 00:00:00');
                endTimeCogValPer = timeFormat(endTimeCogValPer,'yyyy-mm-dd 00:00:00');

            }else if(period ==='M1'){
                modalPeriod = 'M';
                startTimeCogVal = new Date(new Date(startTimeCogVal).valueOf()).format('yyyy-MM');
                endTimeCogVal = new Date(new Date(endTimeCogVal).valueOf()).format('yyyy-MM');
                startTime = startTimeCogVal+'-01 00:00:00';
                endTime = endTimeCogVal+'-01 00:00:00';
                startTimeCogValPer = timeFormat(startTimeCogValPer,'yyyy-mm-01 00:00:00');
                endTimeCogValPer = timeFormat(endTimeCogValPer,'yyyy-mm-01 00:00:00');
            }else{
                 modalPeriod = 'h';
                startTimeCogVal = new Date(new Date(startTimeCogVal).valueOf()).format('yyyy-MM-dd HH:mm');
                endTimeCogVal = new Date(new Date(endTimeCogVal).valueOf()).format('yyyy-MM-dd HH:mm');
                startTime = startTimeCogVal+':00';
                endTime = endTimeCogVal+':00';
                startTimeCogValPer = timeFormat(startTimeCogValPer,'yyyy-mm-dd hh:00:00');
                endTimeCogValPer = timeFormat(endTimeCogValPer,'yyyy-mm-dd hh:00:00');
            }
            //if(new Date(startTimeCogValPer).valueOf()!==new Date(startTime).valueOf()||new Date(endTimeCogValPer).valueOf()!==new Date(endTime).valueOf()){
            //    historyForest(startTime,endTime,true);
            //}
            var currentModal ;
            for(var m = 0;m<_this.nodeMode.length;m++){
                if(modalPeriod===_this.nodeMode[m].interval&&currentModalId === _this.nodeMode[m]._id){
                    currentModal = _this.nodeMode[m];
                    continue;
                }
            }
            var currentParams = currentModal.params;
            var tableCell = $('#configForestModal').find('.tabalCell');
            var xNum = $('#configForestModal').find('.tableHeadBox').find('div').length-1;
            var xGene = {};
            for(var j = 0;j<currentParams.length;j++){
                xGene[currentParams[j].pName] = [];
            }
            //var isNull = false;
            for(var i = 0;i<tableCell.length;i++){
                var $current = tableCell.eq(i);
                var currentVal = parseFloat($current.find('.paramsShow').html().trim());
                if(currentVal===''){
                    alert(I18n.resource.benchmark.energyForecast.INTER_COMPLETE);
                    return;
                }else{
                    if(currentVal!==0&&!Number(currentVal)){
                        alert(I18n.resource.benchmark.energyForecast.INTER_NUBMER);
                        return;
                    }
                }
            }
            for(var i = 0;i<tableCell.length;i++){
                var $current = tableCell.eq(i);
                var currentVal = parseFloat($current.find('.paramsShow').html().trim());
                var xSin = $current.attr('data-param');
                if(!xGene[xSin]){
                    alert(I18n.resource.benchmark.energyForecast.EXCEL_WRONG);
                    return;
                }
                xGene[xSin].push(currentVal);
            }
            var postData = {
                'modeltype': currentModal.type,
                'model':currentModal.model,
                'x': xGene
            };
            var resultFinally = [];
            var result = {};
            result['timeShift'] = _this.mathListData;
            //_this.echartsInit(result);
            //预测值
            WebAPI.post('/analysis/model/exec',postData).done(data=>{
                var resultData = [];
                //var dataString = data.split('[')[1].split(']')[0].split(',');
                var dataStr = data.split('[')[1];
                if(dataStr){
                    var dataString = data.split('[')[1].split(']')[0].split(',');
                }else{
                    alert(I18n.resource.benchmark.energyForecast.DATA_BACK_FAIL);
                    return;
                }
                for(var i = 0;i<dataString.length;i++){
                    resultData.push(parseInt(dataString[i]));
                }
                result['timeShift'] = _this.mathListData;
                //result['data'] = [3,10]//resultData;
                result['data'] = resultData;
                if(new Date(startTime).valueOf()<=new Date().valueOf()){
                    if(_this.historyData.length!==0){
                        if(_this.historyData[0].data.length!==0){
                            if(_this.mathListData.length!==_this.historyData[0].timeShift.length&&resultData.length!==0){
                                _this.historyData[0].timeShift = _this.mathListData;
                            }
                            resultFinally.push(_this.historyData[0]);
                        }
                    }
                }
                resultFinally.push(result);
                //_this.echartsInit(result);
            }).always(function(){
               // $('#configForestModal').modal('hide');
                _this.echartsInit(resultFinally);
                $('#configForestModal').modal('hide');
                _this.importSuccess = false;
            });
        });
        //查询按钮
        $('#configForestModal').find('.checkAll').off('click').click(function(){
            var modalConfigStartTime = $('#modalConfigStartTime').val();
            var modalConfigEndTime = $('#modalConfigEndTime').val();
            var timeSelsect = $('.timeSelsect').val();
            var startTime,endTime;
            if(timeSelsect==='h1'){
                modalConfigStartTime = new Date(new Date(modalConfigStartTime).valueOf()).format('yyyy-MM-dd HH:mm');
                modalConfigEndTime = new Date(new Date(modalConfigEndTime).valueOf()).format('yyyy-MM-dd HH:mm');
                startTime = modalConfigStartTime+':00';
                endTime = modalConfigEndTime+':00';
            }else if(timeSelsect==='d1'){
                modalConfigStartTime = new Date(new Date(modalConfigStartTime).valueOf()).format('yyyy-MM-dd');
                modalConfigEndTime = new Date(new Date(modalConfigEndTime).valueOf()).format('yyyy-MM-dd');
                startTime = modalConfigStartTime+' 00:00:00';
                endTime = modalConfigEndTime+' 00:00:00';
            }else{
                modalConfigStartTime = new Date(new Date(modalConfigStartTime).valueOf()).format('yyyy-MM');
                modalConfigEndTime = new Date(new Date(modalConfigEndTime).valueOf()).format('yyyy-MM');
                startTime = modalConfigStartTime+'-01 00:00:00';
                endTime = modalConfigEndTime+'-01 00:00:00';
            }
            if(new Date(startTime).valueOf()>new Date().valueOf()) {
                alert(I18n.resource.benchmark.energyForecast.TIME_WRONG);
            }else{
                historyForest(startTime,endTime);
            }
        });
    }
    echartsInit(result){
        if(result.length===0) return;
        var option = {
           tooltip: {
                trigger: 'axis'
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
                        data: result[0].timeShift//['2016-06','2016-07','2016-08','2016-09','2016-10','2016-11','2016-12'],
                        //axisLabel: {
                        //    formatter: '{value} '
                        //}
                    }
            ],
            yAxis: {
                type: 'value',
                axisLine: {onZero: false},
                boundaryGap: false
            },
            series: [
                {
                    name:'预测值',
                    type: 'line',
                    smooth: true,
                    data:result[0].data//[15, -50, -15,1,9,20,-40]
                }]
        };
        if(result.length>1){
            option.series[0].name='历史值';
            for(var i = 1;i<result.length;i++){
                option.series.push({
                    name:'预测值',
                    type: 'line',
                    smooth: true,
                    data:result[i].data
                });
            }
        }
        var dom = this.$bechForecast.find('.forecastEchartsBox')[0];
         var chart = echarts.init(dom, AppConfig.chartTheme);
        chart.setOption(option);
    }

    onNodeClick(e,node){
        var _this = this;
        console.log(_this.screen);
        _this.init();
        //if(!_this.screen.opt.point[node['_id']].model){
        //    alert('无数据');
        //}
    }
    destroy(){
        this.ctn = null;
        this.screen = null;
        this.opt = null;
        this.$bechForecast = null;
        this.paramsRelate = null;
        this.nodeMode = null;
        this.historyData = null;
        this.mathListData = null;
        this.importSuccess = null;
    }
}
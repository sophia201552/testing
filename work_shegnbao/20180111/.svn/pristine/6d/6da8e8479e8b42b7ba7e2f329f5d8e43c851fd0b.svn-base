class BenchmarkEnergyBenchmarking{
    constructor(ctn,screen,opt){
        this.ctn = ctn;
        this.screen = screen;
        this.opt = opt;
        this.$bechingBox = undefined;
        this.projectIdArr = [];//当前账号项目id数组
        this.pointToName = {};//点对应的名
        this.pointToProjId = {};//点对应Id
        this.resultDataEcharts = {};//echarts最终数据
        this.hideOrShowData = undefined;
        this.dataGetDetail = undefined;
    }
    show(){
        var _this = this;
        var projectId = AppConfig.projectId;
        WebAPI.get('/static/views/observer/benchmark/benchmarkEnergyBenchmarking.html').done(resultHtml=>{
            $('.panelBmModule').html('').append(resultHtml);
            Spinner.spin($('#bechingBox')[0]);
            _this.$bechingBox = $('#bechingBox');
            I18n.fillArea(_this.$bechingBox);
            var timeFormatStr = timeFormatChange('yyyy-mm-dd');
            var start = new Date(new Date().valueOf() - 86400000),
                end = new Date();
            
            $('#startTimeCog').datetimepicker({
                format: timeFormatStr,
                autoclose: true,
                todayBtn: true,
                forceParse: false,
                startDate: "2010-01-01 00:00",
                endDate: end,
                initialDate: start,
                minView:2//new Date().format('yyyy-MM-dd hh:mm:ss')
            }).val( start.timeFormat(timeFormatStr));
            $('#endTimeCog').datetimepicker({
                format: timeFormatStr,
                autoclose: true,
                todayBtn: true,
                forceParse: false,
                startDate: "2010-01-01 00:00",
                endDate: end,
                initialDate: end,
                minView:2
            }).val(end.timeFormat(timeFormatStr));

            _this.init();
            if(AppConfig.projectId){
                _this.$bechingBox.find('.areaSingleBox[data_projId="'+AppConfig.projectId+'"]').trigger('click');
            }
            _this.attEvents();
        });
    }
    init(){
        var _this = this;
        var resultData = [];
        var projectIdArr = [];
        var projectList = AppConfig.projectList;
        for(var i = 0,len =projectList.length;i<len;i++ ){
            var item = projectList[i];
            projectIdArr.push(item.id);
        }
        var parentNode = this.screen.iotFilter.tree.getNodes()[0];
        var currentNode = this.screen.iotFilter.tree.getSelectedNodes()[0];
        var postDataG;
        var currenType = currentNode.baseType;
        if(currenType==='projects'){
            currenType = 'Project';
        }else if(currenType==='groups'){
            currenType = 'Group';
        }else{
            currenType = 'Thing';
        }
        postDataG = {
            arrProjId:projectIdArr,
            nodeName:currentNode.name,
            type:currenType
        };
         function isEmptyObject(obj){
               for(var key in obj){
                   return false
               };
               return true
         };
        //显示柱图
        WebAPI.post('/benchmark/config/getDetails',postDataG).done(data=>{
            var isEmpty = isEmptyObject(data);
            if(!isEmpty){
                for(var item in data){
                    var language = localStorage["language"]?localStorage["language"]:AppConfig.language;
                    var nameLan ;
                    var resultDataObj = {};
                    resultDataObj.projId = data[item].projId;
                    resultDataObj.id = data[item]._id;
                    if(language==='zh'){
                        nameLan = data[item].name
                    }else{
                        var projectListAll = AppConfig.projectList;
                        for(var i = 0;i<projectListAll.length;i++){
                            var projItem = projectListAll[i];
                            if(data[item].projId===projItem.id){
                                nameLan = projItem.name_english;
                            }
                        }
                    }
                    if(AppConfig.projectId === 466){
                        nameLan = AppConfig.projectName;
                    }
                    resultDataObj.name =nameLan;//data[item].name;
                    resultDataObj.pointEnergy = data[item].energy;
                    resultDataObj.pointSummary = data[item].summary;
                    resultData.push(resultDataObj);
                    _this.pointToName[data[item].energy] =nameLan;// data[item].name;
                    _this.pointToProjId[data[item].energy] = data[item].projId;
                }
                _this.dataGetDetail = resultData;
                _this.echartsData();
            }else{
                alert(I18n.resource.benchmark.energyOverView.NO_DATA);
                _this.projectListShow();
            }
        });
    }
    attEvents(){
        var _this = this;
        //点击单个项目改变左侧项目所含内容项
        this.$bechingBox.find('.areaSingleBox').off('click').click(function(){
            var $this = $(this);
            var projId = $(this).attr('data_projId');
            if(!$this.hasClass('attSelected')){
                $this.addClass('attSelected');
            }
            $this.siblings('.areaSingleBox').removeClass('attSelected');
            _this.screen.initIotFilter(parseInt(projId));
        });
        //周期选择
        this.$bechingBox.find('.timeSelsect').off('change').change(function(){
            var $this = $(this);
            var $inputTime = _this.$bechingBox.find('.input-group').find('input.form-control');
            var timeFormatStr, minView, startView, start, end;
            var $startTimeCog = $('#startTimeCog'),
                $endTimeCog = $('#endTimeCog');
            if ($this.val() === 'M1') {
                timeFormatStr = timeFormatChange('yyyy-mm');
                minView = 3;
                startView = 3;
            } else if ($this.val() === 'M12') {
                timeFormatStr = timeFormatChange('yyyy-mm-dd');
                minView = 4;
                startView = 4;
            } else {
                timeFormatStr = timeFormatChange('yyyy-mm-dd');
                minView = 2;
                startView = 2;
            }
            start = new Date(new Date().valueOf() - 86400000);
            end = new Date();
            $startTimeCog.datetimepicker('remove').datetimepicker({
                format: timeFormatStr,
                autoclose: true,
                todayBtn: true,
                forceParse: false,
                startDate: "2010-01-01 00:00",
                endDate: end,
                minView:minView,//new Date().format('yyyy-MM-dd hh:mm:ss')
                startView: startView,
                initialDate: start
            }).val( start.timeFormat(timeFormatStr) );
            $endTimeCog.datetimepicker('remove').datetimepicker({
                format: timeFormatStr,
                autoclose: true,
                todayBtn: true,
                forceParse: false,
                startDate: "2010-01-01 00:00",
                endDate: end,
                minView:minView,//new Date().format('yyyy-MM-dd hh:mm:ss')
                startView: startView,
                initialDate: end
            }).val( end.timeFormat(timeFormatStr) );
            //_this.echartsData();
        });
        //查询按钮事件
        $('#refreshEcharts').off('click').click(function(){
            var startTime = timeFormat($('#startTimeCog').val(),'yyyy-mm-dd 00:00:00');
            var endTime = timeFormat($('#endTimeCog').val(),'yyyy-mm-dd 00:00:00');
            var timeShaft = $('.timeSelsect').val();
            if(new Date(startTime).valueOf()>new Date(endTime).valueOf()){
                alert(I18n.resource.benchmark.energyBenchmarking.STARTTIME_LT_ENDTIME);
                return;
            }
            if(timeShaft=='M1'){
                if(parseInt(startTime.split('-')[1])===parseInt(endTime.split('-')[1])){
                    alert(I18n.resource.benchmark.energyForecast.TIME_REPEAT_SELECT);
                    return;
                }
            }
            _this.echartsData();
        });
        //眼睛按钮当前项目数据显示或隐藏
        this.$bechingBox.find('.showOrHide').off('click').click(function(e){
            e.stopPropagation();
            var $this = $(this);
            var currentData = {nameList:[],dataList:[],projIdList:[]};
            var currentProjId = parseInt($this.parents('.areaSingleBox').attr('data_projid'));
            if(!$this.hasClass('hideProj')){
                $this.addClass('hideProj');
                $this.find('i').removeClass('selected');
                for(var i = 0;i<_this.hideOrShowData.projIdList.length;i++){
                    if(_this.hideOrShowData.projIdList[i]!==currentProjId){
                        currentData.projIdList.push(_this.hideOrShowData.projIdList[i]);
                        currentData.nameList.push(_this.hideOrShowData.nameList[i]);
                        currentData.dataList.push(_this.hideOrShowData.dataList[i]);
                    }
                }
                _this.hideOrShowData = currentData;
            }else{
                var hideOrShowDataArr = [];
                 $this.removeClass('hideProj');
                $this.find('i').addClass('selected');
                for(var i = 0;i<_this.resultDataEcharts.projIdList.length;i++){
                    if(_this.resultDataEcharts.projIdList[i]===currentProjId){
                        _this.hideOrShowData.projIdList.push(_this.resultDataEcharts.projIdList[i]);
                        _this.hideOrShowData.nameList.push(_this.resultDataEcharts.nameList[i]);
                        _this.hideOrShowData.dataList.push(_this.resultDataEcharts.dataList[i]);
                    }
                }
                for(var i = 0;i<_this.hideOrShowData.dataList.length;i++){
                    var objSin = {};
                    hideOrShowDataArr.push(objSin);
                }
                //对象转换成对象数组再比较
                for(var item in _this.hideOrShowData){
                    var itemArr = _this.hideOrShowData[item];
                    //hideOrShowDataArr[j] = {};
                    for(var j = 0;j<itemArr.length;j++){
                        if(item==='nameList'){
                            hideOrShowDataArr[j].name = itemArr[j];
                        }else if(item==='projIdList'){
                            hideOrShowDataArr[j].projId = itemArr[j];
                        }else{
                            hideOrShowDataArr[j].data = itemArr[j];
                        }
                    }
                }
                hideOrShowDataArr = _this.sortArrBigToSmall(hideOrShowDataArr);
                //对象数组转换成对象
                var resultNameList = [];
                var resultdataList = [];
                var resultToProjId = [];
                for(var j=0;j<hideOrShowDataArr.length;j++){
                    resultNameList.push(hideOrShowDataArr[j].name);
                    resultdataList.push(hideOrShowDataArr[j].data);
                    resultToProjId.push(hideOrShowDataArr[j].projId);
                }
                _this.hideOrShowData.nameList = resultNameList;
                _this.hideOrShowData.dataList = resultdataList;
                _this.hideOrShowData.projIdList = resultToProjId;
            }
            _this.echartsShow();
        });
    }
    //显示底部项目列表
    projectListShow(){
        var _this = this;
        var projectList = AppConfig.projectList;
        _this.$bechingBox.find('.diffAreaList').html('');
        for (var i = 0, len = projectList.length; i < len; i++) {
            var item = projectList[i], flag = true;
            if(!_this.dataGetDetail){return;}
            for (var j = 0; j < _this.dataGetDetail.length; j++) {
                if (_this.dataGetDetail[j].projId == item.id) {
                    flag = false;
                    break;
                }
            }
            if (flag) continue;
            this.projectIdArr.push(item.id);
            var language = localStorage["language"]?localStorage["language"]:AppConfig.language;
            var nameLan =(language==='zh')?item.name_cn:item.name_english;
            if(AppConfig.projectId === 466){
                nameLan = AppConfig.projectName;
            }
            var projSingle = '<div class="areaSingleBox" data_projId="'+item.id+'" title="'+nameLan+'">'+
                             '<span  class="projNameCn">'+nameLan+'</span>'+
                             '<b class="showOrHide"><i class="iconfont gouxuan selected">&#xe661;</i></b></div>';
            _this.$bechingBox.find('.diffAreaList').append(projSingle);
        }
        _this.attEvents();
    }
    //获得生成图表所需要的数据
    echartsData(){
        var resultData =this.dataGetDetail;
        var _this = this;
        //if(_this.hideOrShowData){
        //    _this.echartsShow();
        //    _this.projectListShow();
        //}else {
        var dsItemIds = [];
        var timeFormatStr = _this.$bechingBox.find('.timeSelsect').val();
        for (var i = 0, len = resultData.length; i < len; i++) {
            dsItemIds.push(resultData[i].pointEnergy);
        }
        if (dsItemIds.length === 0) {
            return;
        }

        Spinner.spin($('#bechingBox')[0]);
        var postData = {
            dsItemIds: dsItemIds,
            timeEnd: timeFormat($('#endTimeCog').val(),'yyyy-mm-dd 00:00:00'),
            timeFormat: timeFormatStr,
            timeStart: timeFormat($('#startTimeCog').val(),'yyyy-mm-dd 00:00:00')
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(data=> {
            if (!data.list) {
                alert(I18n.resource.benchmark.energyOverView.NO_DATA);
                return;
            }
            var dataList = (data.list.length > 0) ? (data.list) : [];
            var echartsDataRe = [];
            _this.resultDataEcharts = {};
            var resultNameList = [];
            var resultdataList = [];
            var resultToProjId = [];
            if (dataList.length > 0) {
                for (var i = 0; i < dataList.length; i++) {
                    var echartsDataRep = {};
                    var item = dataList[i];
                    var itemDataLast = (item.data[item.data.length - 1]) ? (item.data[item.data.length - 1]) : 0;
                    var itemDataStart = (item.data[0]) ? (item.data[0]) : 0;
                    echartsDataRep.name = _this.pointToName[item.dsItemId];
                    echartsDataRep.point = item.dsItemId;
                    echartsDataRep.data = (itemDataLast - itemDataStart).toFixed(2);
                    if(itemDataLast - itemDataStart<0){
                        echartsDataRep.data = 0
                    }
                    echartsDataRep.projId = _this.pointToProjId[item.dsItemId];
                    echartsDataRe.push(echartsDataRep);
                }
                //对对象中的数据进行排序（从大到小）
                echartsDataRe = _this.sortArrBigToSmall(echartsDataRe);
                //echartsDataRe.sort(function(a,b){
                //    return b.data-a.data
                //});
                for (var j = 0; j < echartsDataRe.length; j++) {
                    resultNameList.push(echartsDataRe[j].name);
                    resultdataList.push(echartsDataRe[j].data);
                    resultToProjId.push(echartsDataRe[j].projId);
                }
                _this.resultDataEcharts.nameList = resultNameList;
                _this.resultDataEcharts.dataList = resultdataList;
                _this.resultDataEcharts.projIdList = resultToProjId;
                _this.hideOrShowData = _this.resultDataEcharts;
                _this.echartsShow();

                _this.projectListShow();
                // _this.attEvents();
            }

        }).always(function () {
            Spinner.stop();
        });
        //}
    }
    sortArrBigToSmall(data){
        data.sort(function(a,b){
            if(a.data!=undefined){
                return a.data-b.data
            }else{
                return a.dataList.data-b.dataList.data
            }
        });
        return data;
    }
    echartsShow(){
        var resultData =this.hideOrShowData;
        var _this = this;
        var summaryList = _this.dataGetDetail;
        var option = {
            color: ['#f1ab21'],
            tooltip: {
                trigger: 'axis',
                position: function (point, params, dom) {
                      // 固定在左部
                    return [180, point[1]];
                },
                formatter:function (params,ticket,callback) {
                    var currentName = params[0].name;
                    var res = '<div>'+currentName+' : '+params[0].data+'</div>';
                    var currentSummary ;
                    var summaryArray = [];
                    //res += '<br/>'+"iphone3:"+''+'<br/>'+"iphone4:"+''+params[0].seriesName;
                    for(var i = 0;i<summaryList.length;i++){
                        if(summaryList[i].name===currentName){
                            currentSummary = summaryList[i].pointSummary;
                        }
                    }
                    if(currentSummary){
                        summaryArray.push(currentSummary);
                         WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {dsItemIds: summaryArray}).done(function(resultSummary){
                            res +='<div style="white-space:normal;">'+resultSummary.dsItemList[0].data+'</div>';
                             synOper();
                         })
                    }else{
                        synOper();
                    }
                    function synOper(){
                        setTimeout(function (){
                            // 仅为了模拟异步回调,每隔1000毫秒刷新一次
                            callback(ticket, res);
                        }, 1)
                    }
                    //return 'loading';
                }
            },
            grid:{
                left:160,
                top:20
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
            calculable: false,
            dataZoom: {
                show: false
            },
            xAxis:{
                axisLabel: {
                    inside: true
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                offset:30
            },
            yAxis:{
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    }
                },
                data:resultData.nameList
            },
            series : [
                {
                    type:'bar',
                    data:resultData.dataList
                }
            ]
        }
        var chart = echarts.init(_this.$bechingBox.find('.echartsListBox')[0], AppConfig.chartTheme);
        chart.setOption(option);
    }
    onNodeClick(node){
        //console.log(node);
        this.init();
    }
    destroy(){
        this.ctn = null;
        this.screen = null;
        this.opt = null;
        this.$bechingBox = null;
        this.projectIdArr = null;//当前账号项目id数组
        this.pointToName = null;//点对应的名
        this.pointToProjId = null;//点对应Id
        this.resultDataEcharts = null;//echarts最终数据
        this.hideOrShowData = null;
        this.dataGetDetail = null;
    }
}
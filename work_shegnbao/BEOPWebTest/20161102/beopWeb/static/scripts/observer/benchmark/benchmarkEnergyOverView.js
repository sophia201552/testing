class BenchmarkEnergyOverView{
    constructor(ctn,screen,opt){
        this.ctn = ctn;
        this.screen = screen;
        this.opt = opt;
        this.selectNode = undefined;
        this.costFinally = undefined;
        this.costType = 0;
    }
    show(){
        var _this = this;
        WebAPI.get('/static/views/observer/benchmark/benchmarkEnergyOverView.html').done(resultHtml=>{
            $('.panelBmModule').html('').append(resultHtml);
            I18n.fillArea($('#bechOverViewBox'));
            _this.TopOneDataShow();
            _this.TopTwoDataShow();
            _this.TopThreeFirstDataShow();
            _this.TopThreeSecondDataShow();
            _this.attEvents();
        });
    }
    init(){

    }
    attEvents(){
        var _this = this;
        function getIndex(arr,value){
            var str = arr.toString();
            var index = str.indexOf(value);
            if(index >= 0){
                value = value.toString().replace(/(\[|\])/g,"\\$1");
                var reg1 = new RegExp("((^|,)"+value+"(,|$))","gi");
                return str.replace(reg1,"$2@$3").replace(/[^,@]/g,"").indexOf("@");
            }else{
                return -1;//不存在此项
            }
        };
        //第二页滚动页事件
        $('#echartsList').off('slid.bs.carousel').on('slid.bs.carousel', function (e) {
            switch ($(e.relatedTarget).attr('id')) {
                case 'energyDay':
                    _this.TopTwoDataShow('energyDay')
                    break;
                case 'costDay':
                    _this.TopTwoDataShow('costDay')
            }
        });
        //能耗费用点击事件
        $('.calcButtonCost').click(function() {
            var btnStatiId=['btnCost0','btnCost1'];
            var btnNth=getIndex(btnStatiId,this.id);
            _this.costType=btnNth;
            _this.TopThreeSecondDataShow();
            $('.colorBartip').css('display','none');
            $('.statiColorBarC').removeClass('pointerC');
            for (var i = 0;i<btnStatiId.length;i++) {
                      $('#'+btnStatiId[i]).removeClass('calcButtonCostActive');
                      $('#'+btnStatiId[i]).addClass('calcButtonCost');
                  };
            $(this).addClass('calcButtonCostActive');
            $(this).removeClass('calcButtonCost');
       });
       // //日月年点击事件
       // $('.calcButton').click(function() {
       //     var btnStatiId=['btnDay','btnWeek', 'btnMonth', 'btnYear'];
       //     var btnNth=getIndex(btnStatiId,this.id);
       //     //drawPieChartZone();渲染饼图通过传参判定周期
       //     for (var i = 0;i<btnStatiId.length;i++) {
       //               $('#'+btnStatiId[i]).removeClass('calcButtonActive');
       //               $('#'+btnStatiId[i]).addClass('calcButton');
       //           };
       //
       //     $(this).addClass('calcButtonActive');
       //     $(this).removeClass('calcButton');
       //
       //});
        //日周月点击事件
        $('.calcButton').off('click').click(function () {
            var btnStatiId = ['btnDay', 'btnWeek', 'btnMonth'];
            var $this = $(this);
            //var btnNth = getIndex(btnStatiId, this.id);
            //elecPieData = elecPieDataCa[btnNth];
            if( $this.hasClass('calcButtonActive')) return;
            //statiPeriod = btnNth;
            //drawPieChartZone();
            $this.addClass('calcButtonActive');
            $this.removeClass('calcButton');
            $this.siblings('div').removeClass('calcButtonActive');
            $this.siblings('div').addClass('calcButton');
           _this.selectNode =  _this.screen.iotFilter.tree.getSelectedNodes()[0];
            if(!_this.selectNode.isParent||(_this.selectNode.isParent&&!_this.selectNode.children)) return;
            var pointsAll = _this.screen.opt.point;
            var legendColor=['#fed001', 'rgb(248,245,124)', 'rgb(182,209,78)', 'rgb(146,192,129)', 'rgb(105,170,187)', 'rgb(73,152,234)'];
            var pointsIdList = [];
            var pointsNameList = [];
            var pointsData = [];
            var pieData = {};
            var childrenPoints = _this.selectNode.children;
            var isExidEnergy = false;
            for(var i = 0;i<childrenPoints.length;i++){
                if(pointsAll[childrenPoints[i]._id]){
                    isExidEnergy = true;
                    pointsIdList.push(pointsAll[childrenPoints[i]._id].energy);//childrenPoints[i]._id
                    pointsNameList.push(childrenPoints[i].name);
                }
            }
            if(!isExidEnergy){
                alert(I18n.resource.benchmark.energyOverView.NO_CHILDREN);//子节点没有对应能耗点，请配置！
                return;
            }
            pieData['nameList'] = pointsNameList;
            var postDataPieChart;
            if(this.id==='btnDay'){
                postDataPieChart = {
                    dsItemIds:pointsIdList,
                    timeEnd:new Date().format('yyyy-MM-dd HH:mm:ss'),
                    timeFormat:'h1',
                    timeStart:new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00'
                }
            }else if(this.id==='btnWeek'){
                var weekNum = new Date().getDay();
                weekNum = weekNum==0?7:weekNum;
                if(weekNum===1){
                    postDataPieChart = {
                        dsItemIds:pointsIdList,
                        timeEnd:new Date().format('yyyy-MM-dd HH:mm:ss'),
                        timeFormat:'h1',
                        timeStart:new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00'
                    }
                }else{
                    postDataPieChart = {
                        dsItemIds:pointsIdList,
                        timeEnd:new Date().format('yyyy-MM-dd HH:mm:ss'),
                        timeFormat:'d1',
                        timeStart:new Date(new Date().valueOf() - 86400000*weekNum).format('yyyy-MM-dd 00:00:00')
                    }
                }
            }else{
                var currentMonth = new Date().getMonth()+1;
                currentMonth = currentMonth-1<10?'0'+(currentMonth-1).toString():(currentMonth-1);
                if(new Date().getDate()===1){
                    postDataPieChart = {
                        dsItemIds:pointsIdList,
                        timeEnd:new Date().format('yyyy-MM-dd HH:mm:ss'),
                        timeFormat:'h1',
                        timeStart:new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00'
                    }
                }else{
                    postDataPieChart = {
                        dsItemIds: pointsIdList,
                        timeEnd: new Date().format('yyyy-MM-dd HH:mm:ss'),
                        timeFormat: 'd1',
                        timeStart: new Date().getFullYear() + '-' + currentMonth + '-31' + ' 00:00:00'
                    }
                }
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postDataPieChart).done(result=>{
                //console.log(result);
                var isExistData = false;
                for(var i = 0;i<result.list.length;i++){
                    if(result.list[i].data.length>0){
                        isExistData = true;
                    }
                }
                if(!isExistData){
                    alert(I18n.resource.benchmark.energyOverView.NO_DATA);
                    return;
                }
                var totalList = 1;
                for(var i = 0;i<result.list.length;i++){
                    var currentData
                   if(result.list[i].data.length===0){
                       currentData = 0;
                   }else{
                       currentData = result.list[i].data[result.list[i].data.length-1]-result.list[i].data[0];
                       if(currentData<0){
                           currentData = 0
                       }
                   }
                    totalList+=currentData;
                    pointsData.push(currentData);
                }
                pieData['data'] = [];
                pieData['data'] = pointsData;
                totalList = totalList>1?totalList-1:totalList;
                var legendInner= $('.legendInner');
                for(var i = 0;i<result.list.length;i++){
                    for(var j = 0;j<legendInner.length;j++){
                        if(legendInner.eq(j).attr('current_id')==result.list[i].dsItemId){
                            legendInner.eq(j).find('.legendInnerData>span').html(kIntSeparate(pointsData[i])+'  kWh');
                            legendInner.eq(j).find('.legendInnerText2>span').html(kIntSeparate(Math.abs(pointsData[i]*1000/totalList)/10)+'%');
                        }
                    }
                }
                _this.TopThreeFirstEcharts(pieData);
            });
        });
    }
    //通过能耗计算不同时段费用
    countCost(corresTimeH){
        var _this = this;
        var nowCost = 0;
        if(!_this.costFinally) return 1;
        for (var j = 0; j < _this.costFinally.length; j++) {
            var costTime = parseInt(_this.costFinally[j].time.split(':')[0]);
            var costFistTime = parseInt(_this.costFinally[0].time.split(':')[0]);
            costTime = costTime == 0 ? 24 : costTime;
            if(corresTimeH===costTime){
                nowCost = parseFloat(_this.costFinally[j].cost);
                return nowCost;
            }
            if (j === _this.costFinally.length - 1) {
                if (corresTimeH >= costTime) {
                    nowCost = parseFloat(_this.costFinally[j].cost);
                    return nowCost;
                }
            }else {
                if (corresTimeH < costFistTime) {
                    nowCost = parseFloat(_this.costFinally[_this.costFinally.length-1].cost);
                    return nowCost;
                }
                var costlatTime = parseInt(_this.costFinally[j + 1].time.split(':')[0]);
                costlatTime = costlatTime == 0 ? 24 : costlatTime;
                if (corresTimeH >= costTime && corresTimeH < costlatTime) {
                    nowCost = parseFloat(_this.costFinally[j].cost);
                    return nowCost;
                }
            }
        }
    }
    //
    TopOneDataShow(){
        var _this = this;
        this.selectNode = this.screen.iotFilter.tree.getSelectedNodes()[0];
        var selectNodeId = this.selectNode._id;
        var dataList = this.screen.opt.point[selectNodeId];
        //var nowHour = parseInt(new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[1].split(':')[0]);
        var costSin = this.screen.opt.cost;
        if(costSin&&costSin.length>0){
            costSin.sort(function(a,b){
                return parseInt(a.time.split(':')[0])-parseInt(b.time.split(':')[0]);
            });
            this.costFinally = costSin;
            //for(var i = 0;i<costSin.length;i++){
            //    var costSinTime = parseInt(costSin[i].time.split(':')[0]);
            //    if(nowHour<costSinTime){
            //        this.costFinally = parseInt(costSin[i].cost);
            //    }
            //}
        }
        if(dataList){
            var dsItemIds = [];
            var dsItemIds1 = [];
            dsItemIds.push(dataList.energy);
            dsItemIds1.push(dataList.power);
            // var postData = {
            //    dsItemIds:dsItemIds,
            //    timeEnd:new Date().format('yyyy-MM-dd hh:mm:ss'),
            //    timeFormat:'h1',
            //    timeStart:new Date().format('yyyy-MM-dd hh:mm:ss').split(' ')[0]+' 00:00:00'
            //}
            var $threeItem3Span = $('#threeItem3').find('span.threeItem3Span');
            if(dataList.power){
                WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {dsItemIds: dsItemIds1}).done(function(resultPower) {
                   //console.log(resultPower);
                    if(!resultPower || !resultPower.dsItemList || !(resultPower.dsItemList instanceof Array)) return;
                    if(resultPower.dsItemList[0].data){
                        if(parseFloat(resultPower.dsItemList[0].data)<1){
                            $threeItem3Span.html(kIntSeparate(parseFloat(resultPower.dsItemList[0].data),1));
                        }else{
                            $threeItem3Span.html(kIntSeparate(parseInt(resultPower.dsItemList[0].data)));
                        }
                    }else{
                        $threeItem3Span.html(I18n.resource.benchmark.energyOverView.NO_DATA);
                    }
                })
            }else{
                $threeItem3Span.html(I18n.resource.benchmark.energyOverView.NO_DATA);
                alert(I18n.resource.benchmark.energyOverView.NO_CURRENT_NODE);
            }
            Spinner.spin($('.panelBmModule')[0]);
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram',{
                dsItemIds:dsItemIds,
                timeEnd:new Date().format('yyyy-MM-dd HH:mm:ss'),
                timeFormat:'h1',
                timeStart:new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00'
            }).done(result=>{
                var resultList = result.list;
                if(resultList&&resultList.length>0){
                    for(var i = 0;i<resultList.length;i++){
                        if(resultList[i].dsItemId===dataList.energy){//能耗或电量
                            var $threeItem1Span = $('#threeItem1').find('span.threeItem1Span');
                            var $threeItem2Span = $('#threeItem2').find('span.threeItem2Span');
                            if(resultList[i].data.length>0){
                                var resultListData = resultList[i].data;
                                var energyDataFin = Math.abs(resultListData[resultListData.length-1]-resultListData[0]);
                                //费用计算
                                if(energyDataFin<1){
                                    $threeItem1Span.html(kIntSeparate(energyDataFin,1));
                                }else{
                                    $threeItem1Span.html(kIntSeparate(energyDataFin));
                                }
                                var nowHour = parseInt(new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[1].split(':')[0]);
                                nowHour = nowHour==0?24:nowHour;
                                var nowCost = 0;
                                nowCost =  _this.countCost(nowHour);
                                //var lastCost =(_this.costFinally)? parseInt(_this.costFinally[_this.costFinally.length-1].cost):1;
                                var todayCostReduct = 0;
                                for(var k = 1;k<resultListData.length;k++){
                                    var currentHourEnergy = resultListData[k]-resultListData[k-1];
                                    var currentHour = parseInt(result.timeShaft[k-1].split(' ')[1].split(':')[0]);
                                    currentHour = currentHour==0?24:currentHour;
                                    var currentHourCost = _this.countCost(currentHour);
                                    todayCostReduct+=currentHourEnergy*currentHourCost;
                                }
                                if(todayCostReduct<1){
                                    $threeItem2Span.html(kIntSeparate(todayCostReduct,1))
                                }else{
                                    $threeItem2Span.html(kIntSeparate(todayCostReduct))
                                }
                                //$threeItem2Span.html(kIntSeparate(todayCostReduct,1));//Math.abs(resultListData[resultListData.length-1]*nowCost-resultListData[0]*1)
                            }else{
                                if(dataList.energy===''){
                                    alert(I18n.resource.benchmark.energyOverView.NO_CURRENT_NODE);
                                }
                                $threeItem1Span.html(I18n.resource.benchmark.energyOverView.NO_DATA);
                            }
                        }
                        //else if(resultList[i].dsItemId===dataList.power){
                        //    var $threeItem1Span = $('#threeItem3').find('span.threeItem3Span');
                        //    if(resultList[i].data.length>0){
                        //        var resultListData = resultList[i].data;
                        //        $threeItem1Span.html(kIntSeparate(resultListData[resultListData.length-1]));
                        //    }else{
                        //        if(dataList.power===''){
                        //            alert(I18n.resource.benchmark.energyOverView.NO_CURRENT_NODE);
                        //        }
                        //        $threeItem1Span.html(I18n.resource.benchmark.energyOverView.NO_DATA)
                        //    }
                        //}
                    }
                }
            }).always(function(){
                Spinner.stop();
            });
        }else{
            alert(I18n.resource.benchmark.energyOverView.NO_CURRENT_NODE);
        }
    }
    TopTwoDataShow(id){
        var _this = this;
        var selectNodeId = this.selectNode._id;
        var dataList = this.screen.opt.point[selectNodeId];
        if(dataList){
            var dsItemIds = [];
            dsItemIds.push(dataList.energy);
            var timeYesday = new Date(new Date().valueOf() - 86400000).format('yyyy-MM-dd HH:mm:ss');
            //timeStart为前一天当前的前一个小时
            //var postData = {
            //    dsItemIds:dsItemIds,
            //    timeEnd:new Date(new Date().valueOf() - 86400000).format('yyyy-MM-dd HH:mm:ss'),//new Date().format('yyyy-MM-dd HH:mm:ss'),
            //    timeFormat:'h1',
            //    timeStart:timeYesday.split(' ')[0]+' '+((parseInt(timeYesday.split(' ')[1].split(':')[0])-1)>=10?(parseInt(timeYesday.split(' ')[1].split(':')[0])-1):('0'+(parseInt(timeYesday.split(' ')[1].split(':')[0])-1)).toString())+':'+timeYesday.split(' ')[1].split(':')[1]+':'+timeYesday.split(' ')[1].split(':')[2]
            //}
             //Spinner.spin($('.panelBmModule')[0]);
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram',{
                dsItemIds:dsItemIds,
                timeEnd:new Date().format('yyyy-MM-dd HH:mm:ss'),//new Date().format('yyyy-MM-dd HH:mm:ss'),
                timeFormat:'h1',
                timeStart:timeYesday.split(' ')[0]+' '+((parseInt(timeYesday.split(' ')[1].split(':')[0])-1)>=10?(parseInt(timeYesday.split(' ')[1].split(':')[0])-1):('0'+(parseInt(timeYesday.split(' ')[1].split(':')[0])-1)).toString())+':'+timeYesday.split(' ')[1].split(':')[1]+':'+timeYesday.split(' ')[1].split(':')[2]
            }).done(result=>{
                var resultList = result.list;
                var powerList ;
                if(resultList&&resultList[0].data.length>0){
                    resultList[0].name = I18n.resource.benchmark.energyOverView.HOURLY_ENERGY;//'逐时能耗';
                   // resultList[0].name = '逐时能耗';
                    resultList[0].timeShaft = result.timeShaft;
                    resultList[0].domBox = $('#energyDay')[0];
                    powerList = $.extend(true,{}, resultList[0]);
                    for(var i = 1;i<powerList.data.length;i++){
                        powerList.data[i-1] = (powerList.data[i] - powerList.data[i-1]).toFixed(2)//kIntSeparate(powerList.data[i] - powerList.data[i-1]);//.toFixed(2);
                    }
                    if(!id||id==='energyDay'){
                        powerList.data = powerList.data.slice(0,powerList.data.length-1);
                        powerList.timeShaft = powerList.timeShaft.slice(1,powerList.timeShaft.length);
                        _this.echartsBar(powerList);
                    }else{
                        powerList.data = [];
                        for(var i = 1;i<resultList[0].data.length;i++){
                            var corresTimeH = parseInt(result.timeShaft[i].split(' ')[1].split(':')[0]);
                            corresTimeH = corresTimeH===0?24:corresTimeH;
                            var nowCost = 0;
                            //for(var j = 0;j<_this.costFinally.length;j++){
                            //    var costTime = parseInt(_this.costFinally[j].time.split(':')[0]);
                            //    costTime = costTime==0?24:costTime;
                            //    if(j===_this.costFinally.length-1){
                            //        if(corresTimeH>=costTime){
                            //            nowCost =parseInt(_this.costFinally[j].cost);
                            //        }
                            //    }else{
                            //        var costlatTime = parseInt(_this.costFinally[j+1].time.split(':')[0]);
                            //        costlatTime = costlatTime==0?24:costlatTime;
                            //        if(corresTimeH>=costTime&&corresTimeH<costlatTime){
                            //             nowCost =parseFloat(_this.costFinally[j].cost);
                            //        }
                            //    }
                            //}
                            nowCost =  _this.countCost(corresTimeH);
                            powerList.data.push(((resultList[0].data[i]-resultList[0].data[i-1])*nowCost).toFixed(2));
                        }
                        powerList.name = I18n.resource.benchmark.energyOverView.HOURLY_COST;//'逐时费用';
                        powerList.domBox = $('#costDay')[0];
                        //powerList.data = powerList.data.slice(0,powerList.data.length-1);
                        powerList.timeShaft = powerList.timeShaft.slice(1,powerList.timeShaft.length);
                        _this.echartsBar(powerList);
                    }
                }else{
                    //alert('无数据');
                }
            }).always(function(){
                //Spinner.stop();
            });
        }else{
            alert(I18n.resource.benchmark.energyOverView.NO_CURRENT_NODE);
        }
    }
    TopThreeFirstDataShow(period){
        //下面左半部分
        var _this = this;
        if(!_this.selectNode.isParent||(_this.selectNode.isParent&&!_this.selectNode.children)) return;
        var pointsAll = _this.screen.opt.point;
        var legendColor=['#fed001', 'rgb(248,245,124)', 'rgb(182,209,78)', 'rgb(146,192,129)', 'rgb(105,170,187)', 'rgb(73,152,234)'];
        var pointsIdList = [];
        var pointsNameList = [];
        var pointsData = [];
        var pieData = {};
        $('#btnDay').siblings('div').removeClass('calcButtonActive');
        $('#btnDay').siblings('div').addClass('calcButton');
        $('#btnDay').addClass('calcButtonActive');
        var childrenPoints = _this.selectNode.children;
        var isExidEnergy = false;
        for(var i = 0;i<childrenPoints.length;i++){
            if(pointsAll[childrenPoints[i]._id]){
                isExidEnergy = true;
                pointsIdList.push(pointsAll[childrenPoints[i]._id].energy);//childrenPoints[i]._id
                pointsNameList.push(childrenPoints[i].name);
            }
        }
        if(!isExidEnergy){
            alert(I18n.resource.benchmark.energyOverView.NO_ENERGY_POINT);
            return;
        }
        pieData['nameList'] = pointsNameList;
        //var postDataThreeOne = {
        //    dsItemIds:pointsIdList,
        //    timeEnd:new Date().format('yyyy-MM-dd HH:mm:ss'),
        //    timeFormat:'d1',
        //    timeStart:new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00'
        //};
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram',{
            dsItemIds:pointsIdList,
            timeEnd:new Date().format('yyyy-MM-dd HH:mm:ss'),
            timeFormat:'h1',
            timeStart:new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00'
        }).done(result=>{
            //console.log(result);
            var $legendZone = $('#SubZone_container002').find('.legendZone');
            $legendZone.html('');
            var totalList = 1;
            for(var i = 0;i<result.list.length;i++){
                var currentData
                if(result.list[i].data.length===0){
                     currentData =  0;
                }else{
                    currentData = result.list[i].data[result.list[i].data.length-1]-result.list[i].data[0];
                    if(currentData<0){
                           currentData = 0
                   }
                }
                totalList+=currentData;
                pointsData.push(currentData);
            }
            pieData['data'] = [];
            pieData['data'] = pointsData;
            totalList = totalList>1?totalList-1:totalList;
            var j = 0
            for(var i = 0;i<result.list.length;i++){
                var idEn = i<10?'0'+i:i;//<div class="legendInnerText">\</div>\
                var legendInner = ' <div class="legendInner" id="legendData'+idEn+'" current_id="'+result.list[i].dsItemId+'">\
                                    <div class="legendInnerLeft" id="legendInnerDiv'+i+'">\
                                    </div>\
                                    <div class="legendInnerRight">\
                                            <div class="legendInnerText1">\
                                                <p>'+pointsNameList[i]+'</p>\
                                            </div>\
                                            <div class="legendInnerText2">\
                                                <span id="legendPercent'+i+'">68.0%</span>\
                                            </div>\
                                        <div class="legendInnerData">\
                                            <span id="legendValue'+i+'">'+kIntSeparate(pointsData[i])+'  kWh</span>\
                                        </div>\
                                    </div>\
                                </div>';
                $legendZone.append(legendInner);
                if(j>5){
                    j=0;
                }
                $('#legendInnerDiv'+i).css({'background-color':legendColor[j]});
                $('#legendPercent'+i).html(((pointsData[i]*1000/totalList)/10).toFixed(2)+'%');
                j++;
            }
            _this.TopThreeFirstEcharts(pieData);
        });
    }
    TopThreeFirstEcharts(resultData){
        var legendColor=['#fed001', 'rgb(248,245,124)', 'rgb(182,209,78)', 'rgb(146,192,129)', 'rgb(105,170,187)', 'rgb(73,152,234)'];
        var option = {
           color: [],
           tooltip : {
                trigger: 'item'
            },
           calculable : false,
            series :[{
                name:I18n.resource.benchmark.energyOverView.ENERGY_COMP,//'能耗(kWh)',
                type:'pie',
                radius : ['50%' , '70%'],//100, 140
                itemStyle : {
                    normal : {borderColor:'white',
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    }},

                data:[
                    //{value:elecPieData[0], name:'冷机'},
                    //{value:elecPieData[1], name:'冷却塔'},
                    //{value:elecPieData[2], name:'冷却泵'},
                    //{value:elecPieData[3], name:'板换泵'},
                    //{value:elecPieData[4], name:'二次冷冻泵'},
                    //{value:elecPieData[5], name:'一次冷冻泵'}
                ]
            }]
        };
        var j = 0;
        for(var i= 0;i<resultData.data.length;i++){
            option.color.push(legendColor[j]);
            if(i==legendColor.length){
                j = 0;
            }
            j++;
            option.series[0].data.push({value:resultData.data[i],name:resultData.nameList[i]});
        }
        if(document.getElementById('divJAJLCircle13')){
            var chart = echarts.init(document.getElementById('divJAJLCircle13'));
            chart.setOption(option);
        }
    }
    TopThreeSecondDataShow(){
        var _this = this;
        //下面右半部分文本值
        //function kIntSeparate(num) {
        //    var source = String(num).split(".");
        //    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
        //    return source.join(".");//再将小数部分合并进来
        //};
        //配置时间：开始/结束
        var now = new Date();
        //var startTime = new Date().setDate(1).toDate().setHours(0, 0, 0).toDate().format('yyyy-MM-dd HH:mm:ss');
        var stDay = new Date().setDate(now.getDate()).toDate().setHours(0, 0, 0).toDate().format('dd');
        var endTime = new Date().setDate(now.getDate()-1).toDate().setHours(0, 0, 0).toDate().format('yyyy-MM-dd HH:mm:ss');
        var DateStr = new Date( (new Date().valueOf() - 86400000) ).format('MM/dd');
        if (stDay=='01') {var startTime = new Date().setMonth(now.getMonth()-1,1).toDate().setHours(0, 0, 0).toDate().format('yyyy-MM-dd HH:mm:ss');}
           else {var startTime = new Date().setDate(1).toDate().setHours(0, 0, 0).toDate().format('yyyy-MM-dd HH:mm:ss')};

        var selectNodeId = this.selectNode._id;
        var dataList = this.screen.opt.point[selectNodeId];
        if(dataList) {
            var dsItemIds = [];
            dsItemIds.push(dataList.energy);
            //获取后台历史数据
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: dsItemIds,
                timeStart: new Date(new Date().valueOf() - 86400000).format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00',
                timeEnd: new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00',
                timeFormat: 'h1'
            }).done(function (resultData) {
                var result = resultData;
                var dataList = result.list;
                //var powerList = $.extend(true,{}, dataList);
                var energyDValue=result.list[0].data;
                //费用计算
                //var costDValue=[];
                //for(var j = 0;j<energyDValue.length;j++){
                //    costDValue.push(energyDValue[j]*_this.costFinally);
                //}
                var nowCost =_this.costFinally? parseInt(_this.costFinally[_this.costFinally.length-1].cost):1;
                var lastdayERank=1;
                $('#reportTittle').text(I18n.resource.benchmark.energyOverView.YESTODAY_ENERGY_OVERVIEW+'('+DateStr+')');
                $('#lastDayEnergyValue').text(kIntSeparate(parseInt(energyDValue[energyDValue.length-1]-energyDValue[0])));
                var yesCostReduct = 0;
                for(var k = 1;k<energyDValue.length;k++){
                    var currentHourEnergy = energyDValue[k]-energyDValue[k-1];
                    var currentHour = parseInt(result.timeShaft[k-1].split(' ')[1].split(':')[0]);
                    currentHour = currentHour==0?24:currentHour;
                    var currentHourCost = _this.countCost(currentHour);
                    yesCostReduct+=currentHourEnergy*currentHourCost;
                }
                $('#lastDayCostValue').text(kIntSeparate(yesCostReduct,1));
                for (var i = 0;i<energyDValue.length;i++){
                    if (energyDValue[energyDValue.length-1]<energyDValue[i]) {lastdayERank=lastdayERank+1;};
                };
                /*if (stDay=='01') {$('#lastDayEnergyRank').text('在上月排名第'+lastdayERank+'名。');} else {$('#lastDayEnergyRank').text('在本月排名第'+lastdayERank+'名。');};*/
            });
        }

        //下右半部分时间色值
        $('#btnCost0').addClass('calcButtonCostActive');
        $('#btnCost1').removeClass('calcButtonCostActive').addClass('calcButtonCost');
        function toFamot00(str,num){
            if (num<10) {return str+'0'+num;}
                 else {return str+num;};
        };
        var elecFeeColor=['#2ecc71', '#92d050', '#c0df40', '#fbf30c', '#fed001', '#fe5050'];
        var maxValue=1;
        var minValue=0;
        var pricePeriod=[];
        pricePeriod[0]=[8,9,10,13,14,18,19,20];
        pricePeriod[1]=[6,7,11,12,15,16,17,21];
        pricePeriod[2]=[0,1,2,3,4,5,22,23];
        var cost=[];

        function costColorType(a) {var typeN=parseInt((5*(a-minValue))/(maxValue-minValue));
            return typeN<0?0:typeN;
            //return parseInt((Math.max(a,600)-600)/200);//色条基准
        };

        function costColorFill(num,idStr) {
          $(idStr).css("background-color",elecFeeColor[costColorType(num)<5?costColorType(num):5]);
          $(idStr).css("opacity",'1');
        };

        //配置时间：开始/结束
        var now = new Date();
        var startTime = new Date(new Date().valueOf() - 86400000).format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00';//new Date().setDate(now.getDate() - 2).toDate().setHours(23, 0, 0).toDate().format('yyyy-MM-dd HH:mm:ss');
        var endTime = new Date().format('yyyy-MM-dd HH:mm:ss').split(' ')[0]+' 00:00:00';//new Date().setDate(now.getDate() - 1).toDate().setHours(23, 59, 59).toDate().format('yyyy-MM-dd HH:mm:ss');
        if(dataList){
            var dsItemIds = [];
            dsItemIds.push(dataList.energy);
            //获取后台历史数据
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: dsItemIds,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (resultData) {
                var result = resultData;
                var dataList = result.list;
               // for  (var i = 0;i<24;i++){var p=[1.166,0.704,0.351];for  (var j = 0;j<3;j++){if (getIndex(pricePeriod[j],i)>=0) {result.list[1].data[i]=Math.round((result.list[0].data[i])*100/p[j])/100};}};//临时
                var resultListData = result.list[0].data;
                var energyCost = [];
                if(resultListData.length>0){
                    for(var j = 1;j<resultListData.length;j++){
                        resultListData[j-1] = parseFloat((resultListData[j]-resultListData[j-1]).toFixed(2));
                        var corresTimeH = parseInt(result.timeShaft[j-1].split(' ')[1].split(':')[0]);
                        corresTimeH = corresTimeH===0?24:corresTimeH;
                        var nowCost = 0;
                        nowCost =  _this.countCost(corresTimeH);
                        energyCost.push(parseFloat((resultListData[j-1]*nowCost).toFixed(2)));

                        //energyCost.push(resultListData[j-1]*(_this.costFinally));
                    }
                    resultListData.pop();
                    //resultListData = resultListData.slice(0,resultListData.length-1)
                    //energyCost = energyCost.slice(0,energyCost.length-1);
                    result.timeShaft = result.timeShaft.slice(1,result.timeShaft.length)
                }

                if(_this.costType===1){//判断是能耗还是费用
                    cost = energyCost;
                }else{
                    cost = resultListData;
                }
                //cost=result.list[costType].data;
                var costCopy=[];
                var costRank=[];
                var hourName=['0:00~1:00 am','1:00~2:00 am','2:00~3:00 am','3:00~4:00 am','4:00~5:00 am','5:00~6:00 am','6:00~7:00 am','7:00~8:00 am','8:00~9:00 am','9:00~10:00 am','10:00~11:00 am','11:00~12:00 am','12:00~1:00 pm','1:00~2:00 pm','2:00~3:00 pm','3:00~4:00 pm','4:00~5:00 pm','5:00~6:00 pm','6:00~7:00 pm','7:00~8:00 pm','8:00~9:00 pm','9:00~10:00 pm','10:00~11:00 pm','11:00~0:00 am'];
                for (var i = 0;i<cost.length;i++){
                    costCopy[i]=cost[i];
                };
                costCopy.sort(function(a,b){return a<b?1:-1});
                for (var i = 0;i<cost.length;i++){
                    for (var j = 0;j<costCopy.length;j++){
                    if (costCopy[j]==cost[i]) {costRank[j]=i;}
                };
                };
                maxValue=costCopy[0];
                minValue=costCopy[23];
                for (var i = 0;i<cost.length;i++) {
                 if (_this.costType==0) {$(toFamot00('#elecFee',i)).text(cost[i]+'kWh');}
                 else {$(toFamot00('#elecFee',i)).text('￥'+cost[i]);};
                 costColorFill(cost[i],toFamot00('#elecFeeColor',i));
                };
                for (var i = 0;i<3;i++){
                    var calcSum=0;
                     for (var j = 0;j<pricePeriod[i].length;j++){
                        calcSum=calcSum+cost[pricePeriod[i][j]];
                     };
                     if (_this.costType==0) {$('#rankCost'+i).text(kIntSeparate(parseInt(calcSum))+' kWh');}
                     else {$('#rankCost'+i).text('￥ '+kIntSeparate(parseInt(calcSum)));};

                };
                });
            }
    }
    historyData(postData){
        Spinner.spin($('.panelBmModule')[0]);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram',postData).done(data=>{
            if(data){
                return data
            }
        }).always(function(){
            Spinner.stop();
        });;
    }
    echartsBar(resultData){
        var timeShift = [];
        for(var i = 0;i<resultData.timeShaft.length;i++){
            timeShift.push(resultData.timeShaft[i].split(' ')[1].split(':')[0]+':'+resultData.timeShaft[i].split(' ')[1].split(':')[1]);
        }
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [resultData.name]
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
                left:70
            },
            calculable: false,
            dataZoom: {
                show: false
            },
            xAxis: [
                {
                    type: 'category',
                    splitLine: {show: false},
                    data:timeShift
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitArea: {show: false}
                }
            ],
            series : [
                {
                    name:resultData.name,
                    type:'bar',
                    data:resultData.data
                }
            ]
        }
         var chart = echarts.init(resultData.domBox, AppConfig.chartTheme);
        chart.setOption(option);
    }
    onNodeClick(e,node){
        var _this = this;
        //_this.screen.iotFilter.childAppend(node,function(){});
        _this.TopOneDataShow();
        _this.TopTwoDataShow();
        _this.TopThreeSecondDataShow();
        _this.TopThreeFirstDataShow();
        _this.attEvents();
    }
    destroy(){
        this.ctn = null;
        this.screen = null;
        this.opt = null;
        this.selectNode = null;
        this.costFinally = null;
        this.costType = null;
        $('#echartsList').off('slid.bs.carousel');
        $('#echartsList').empty().remove();
    }
}
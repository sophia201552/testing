/*2017 1 5  能耗趋势分析图*/
var ModalEnergyTrendAnalysis = (function () {
	function ModalEnergyTrendAnalysis(screen, entityParams, _renderModal) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        ModalBase.call(this, screen, entityParams, renderModal);
    };
	ModalEnergyTrendAnalysis.prototype = new ModalBase();
	ModalEnergyTrendAnalysis.prototype.optionTemplate = {
		name: 'toolBox.modal.ENERGY_TREND_ANALYSIS',
        parent:0,
        mode: 'noConfigModal',
        maxNum: 1,
        title:'',
        minHeight:3,
        minWidth:3,
        maxHeight:2,
        maxWidth:4,
        type: 'ModalEnergyTrendAnalysis',
        scroll:false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
        }
	};

    ModalEnergyTrendAnalysis.prototype.resize = function(){
        this.chart && this.chart.resize();
    };
    
    ModalEnergyTrendAnalysis.prototype.renderChartOption = function (data,time) {
        var year = new Date().getFullYear() - 1;
    	var option = {
    		color:['rgb(23,171,227)'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: 10,
                right: 10,
                bottom: 10,
                top:10,
                containLabel: true
            },
            axisLabel:{
                formatter: function(value){
                    if(value >= 1000000||value <= -1000){
                    	return value/1000000 + 'm';
                    }else if(value >= 1000||value <= -1000){
                        return value/1000 + 'k';
                    } else{
                        return value;
                    }
                },
                textStyle:{
                    color:'#666666'
                } 
            },
            xAxis : [
                {
                    type : 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data : time,
                    axisTick:{
                        show:false
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#666666',
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
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        lineStyle:{
                            color:'#888888'
                        }
                    }
                }
            ],
            series : {
            	type:'bar',
            	label: {
                	normal: {
	                    show: true,
	                    position: 'top',
	                    formatter: function(value){
		                    if(value.value >= 1000000||value.value <= -1000000){
		                    	return (value.value/1000000).toFixed(2) + 'm';
		                    }else if(value.value >= 1000||value.value <= -1000){
		                        return (value.value/1000).toFixed(2) + 'k';
		                    }else{
		                        return value.value;
		                    }
		                }
	                },
	            },
                name:year,
            	data:data
            }
        }

        var $chartContainer = $(this.container).find('.chartBox');
        this.chart = echarts.init($chartContainer[0]);
        this.chart.setOption(option);
        this.spinner && this.spinner.stop();
    };

    ModalEnergyTrendAnalysis.prototype.renderModal = function () {
    	var _this = this;
    	var layoutInfo = '<div class="energyAnalysis">\
							<div class="chartBox"></div>\
						</div>';
        if($(this.container).find('.dashboardCtn').length !== 0){
            $(this.container).find('.dashboardCtn').html(layoutInfo);
        }else{
           $(this.container).html(layoutInfo);
        }
    	if(AppConfig.project === undefined){
            var projectId = AppConfig.projectId;
        }else{
            var projectId = AppConfig.project.bindId;
        }
        var year = new Date().getFullYear() - 1;
    	var postData = {
            dsItemIds: ['@'+projectId+'|Accum_RealTimePower_svr'],
            timeStart: year+"-01-01 00:00:00",
            timeEnd: year+"-12-01 00:00:00",
            timeFormat: 'd1'
        }
		WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(function (result) {
            if(result.timeShaft === undefined){
                $(_this.container).find('.chartBox').html('<div class="noData">没有历史数据</div>');
            }else{
                var time = result.timeShaft;
                var data = result.list[0].data;
                var timeArr = [],dataArr=[];
                var arr=[];
                var renderData = [];
                for(var i=0,length=time.length;i<length;i++){
                  var currentMonth = time[i].split('-')[1];
                  if(i === 0){
                    arr.push(data[i]);
                  }else{
                    var lasttMonth = time[i-1].split('-')[1];
                    if(lasttMonth === currentMonth){
                      arr.push(data[i]);
                    }else if(i === length-1){
                      timeArr.push(new Date(time[i]).format("MM"));
                      arr.push(data[i]);
                      dataArr.push(arr);
                      arr = [];
                    }else{
                      timeArr.push(new Date(time[i-1]).format("MM"));
                      dataArr.push(arr);
                      arr = [data[i]];
                    }
                  }
                }
                for(var j=0,jLength=dataArr.length;j<jLength;j++){
                  renderData.push( Number( (dataArr[j][dataArr[j].length-1]-dataArr[j][0]).toFixed(1) ) );
                }
                _this.renderChartOption(renderData,timeArr);
            }
		})
        this.attatchEvents();
    };

    ModalEnergyTrendAnalysis.prototype.attatchEvents = function (points) {
        $(this.container).off('click').on('click',function(){
            if(AppConfig.isFactory === 0){
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: '1484041916218511e04b5c4e'
                    },
                    container: 'indexMain'
                });
            }
        })
    };
	return ModalEnergyTrendAnalysis;
})()
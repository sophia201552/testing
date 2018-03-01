/**
 * Created by vivian on 2016/11/3.
 */
var analysisQueryScreen=(function(){
    function analysisQueryScreen(screen){
    	_this=this;
    	this.container=$('.panelBmModule');
    	this.selectedNode=null;
        this.screen=screen;    
    };
    analysisQueryScreen.prototype={
    	show:function(ids){
    		this.init();
    		this.selectedNode=ids;
    	},
    	init:function(){
    		var _this = this;
    		WebAPI.get('static/app/Bill/views/screens/analysisQueryScreen.html').done(function(result){
    			$('.panelBmModule').html(result);
    			_this.initTimeQuery();
				_this.initChart();
    		});
    	},
    	initTimeQuery:function(){
    		var now = new Date();
            var startTime = new Date(now.getFullYear(), now.getMonth()-1, now.getDate());
            var endTime= new Date(now.getFullYear(), now.getMonth(), now.getDate());
    		$('#iptTimeStart').val(startTime.format("yyyy-MM-dd HH:mm:ss"));
    		$('#iptTimeEnd').val(endTime.format("yyyy-MM-dd HH:mm:ss"));
            $('.divTimeRange').find('.timeStyle').datetimepicker({
                todayBtn:'linked',
                endTime:new Date(),
                format:'yyyy-mm-dd hh:ii:ss',
                autoclose:true,
                initialDate:new Date()
            })
    	},
    	initChart:function(){
    		var dataBranch=this.screen.dataBranch;
    		var selectedId=this.selectedNode;
    		var $chartContainer='<div id="echartPlane"></div>';
			var arrXaxis=[];
			for(var i=1;i<31;i++){
				arrXaxis.push(i);
			}
    		this.container.append($chartContainer);
    		for(var i=0,len=selectedId.length;i<len;i++){
    			var $divChart='<div id="echartPlane'+i+'" class="echartPlane"></div>';
    			$('#echartPlane').append($divChart);
	        var option = {
			    title : {
			        text:dataBranch[selectedId[i]].name,
			        left:50,
			        top:20,
			        textStyle:{
			        	color:'#fff',
			        	fontWeight:'200',
			        	fontSize:'25'
			        }
			    },
				tooltip : {
			        trigger: 'axis'
			    },
/*			    toolbox:{
			    	show:true,
			    	feature:{
			    		magicType: {type: ['line', 'bar']},
			    	}
			    },*/
			    grid:{
			    	top:120,
			    },
			    color:['#118db8','#00a082','#ffc400'],
	            legend: {
	            	top:60,
	            	itemGap:50,
	            	textStyle:{
	            		color:'#fff'
	            	},
	                data:['Electricity','Natural Gas','Water']
	            },
	            xAxis: {
		            type : 'category',
		            nameTextStyle:{
		            	color:'#fff',
		            	fontSize:'25'
		            },
		            axisLabel:{
	                	show:true,
	                	textStyle:{
	                		color:'#ffffff'
	                	}
	                },
	                axisLine:{
	                    show:true,
	                    lineStyle:{
	                    	color:'#ffffff'
	                    }
	                },
	                axisTick:{
		                show:false
		            },
		            data :arrXaxis

	            },
	            yAxis: {
	            	type : 'value',
	            	nameTextStyle:{
		            	color:'#fff',
		            	fontSize:'25'
		            },
	                axisLine:{
	                    show:false
	                },
	                axisLabel:{
	                	show:true,
	                	textStyle:{
	                		color:'#ffffff'
	                	}
	                }
	            },
	            series: [
			        {
			            name:'Electricity',
			            type:'bar',
			            stack:'总量',
			            data:[19.22,21.97,44.26,45.30,18.16,16.39,16.46,18.13,20.26,45.11,43.22,20.47,18.69,19.33,20.57,21.23,43.30,42.25,17.66,20.34,18.47,20.31,22.48,42.24,43.78,17.21,17.40,18.15,21.48,21.69]
			        },
			        {
			            name:'Natural Gas',
			            type:'bar',
			            stack:'总量',
			            data:[26.21,25.97,52.12,53.63,22.47,23.66,24.33,23.98,25.41,51.12,53.66,23.11,21.70,23.68,24.50,24.83,53.76,53.24,22.68,26.48,24.64,23.17,23.38,54.30,52.18,22.41,25.90,26.13,26.98,27.33]
			        },
			        {
			            name:'Water',
			            type:'bar',
			            stack:'总量',
			            data:[17.33,22.26,45.15,43.26,18.33,19.50,17.61,18.27,19.83,43.89,44.28,17.60,18.61,18.32,20.82,20.49,44.21,42.72,16.81,16.29,18.37,20.45,21.11,40.62,42.70,15.39,16.62,18.58,17.64,20.33]
			        }


	            ]
	        };   
			var billChart=echarts.init(document.querySelector('#echartPlane'+i+''));
			billChart.setOption(option);
			$(window).resize(function() {
            	$(billChart).resize();
        	});
		}	
    	},
    	refresh:function(){

    	},
    	eventOnSelectedItem:function(){

    	},
    	close:function(){

    	},
    	destroy:function(){
    		this.screen=null;
    	}

    };

    return analysisQueryScreen;
})();
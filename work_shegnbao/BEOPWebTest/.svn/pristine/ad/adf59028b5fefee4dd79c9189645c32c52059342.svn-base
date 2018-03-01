var ModalAppChart = (function () {
    function ModalAppChart(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        this.dicPeriod = {
            '30s': 30000,
            'm1': 60000,
            'm5': 300000,
            '10m': 600000,
            '30m': 1800000,
            'h1': 3600000,
            'd1': 86400000,
            'M1': 2592000000
    }
    }
    ModalAppChart.prototype = new ModalBase();

    ModalAppChart.prototype.optionTemplate = {
        name: 'toolBox.modal.APP_CHART',
        parent:3,
        mode:['realTime'],
        maxNum: 10,
        title:'',
        minHeight:1,
        minWidth:1,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalAppChart'
    };

    ModalAppChart.prototype.optionDefault = {
        // 默认色板
        color: [
            '#E2583A','#FD9F08','#1D74A9','#04A0D6','#689C0F','#109d83','#FEC500'
        ],

        // 图表标题
        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#008acd'          // 主标题文字颜色
            }
        },
        legend: {
            textStyle: {
                fontFamily: "Microsoft YaHei",
                fontSize:10
            }
        },
        // 值域
        dataRange: {
            itemWidth: 15,
            color: ['#5ab1ef','#e0ffff']
        },

        // 工具箱
        toolbox: {
            x: 'right',
            y: 'center',
            feature: {
                mark: { show: true },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            },
            color : ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
            effectiveColor : '#ff4500'
        },

        // 提示框
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line',         // 默认为直线，可选为：'line' | 'shadow'
                lineStyle : {          // 直线指示器样式设置
                    color: '#008acd'
                },
                crossStyle: {
                    color: '#008acd'
                },
                shadowStyle : {                     // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            }
        },

        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#efefff',            // 数据背景颜色
            fillerColor: 'rgba(182,162,222,0.2)',   // 填充颜色
            handleColor: '#008acd'    // 手柄颜色
        },

        // 网格
        grid: (function(isMobile){//统一配置grid
            var grid = {
                    borderWidth: 0,
                    borderColor: '#eee',
                    left:50,
                    bottom:40,
                    right:50,
                    top:40
                }
            if(isMobile){
                grid.x = 40;
            }
            return grid;
        }(AppConfig.isMobile)),

        // 类目轴
        categoryAxis: {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#008acd'
                }
            },
            splitLine: {           // 分隔线
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },

        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#008acd'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
                }
            },
            splitLine: {           // 分隔线
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },

        polar : {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
                }
            },
            splitLine : {
                lineStyle : {
                    color : '#ddd'
                }
            }
        },

        timeline : {
            lineStyle : {
                color : '#008acd'
            },
            controlStyle : {
                normal : { color : '#008acd'},
                emphasis : { color : '#008acd'}
            },
            symbol : 'emptyCircle',
            symbolSize : 3
        },

        // 柱形图默认参数
        bar: {
            itemStyle: {
                normal: {
                    barBorderRadius: 5
                },
                emphasis: {
                    barBorderRadius: 5
                }
            },
            barMaxWidth: 80
        },

        // 折线图默认参数
        line: {
            smooth : true,
            symbol: 'none',  // 拐点图形类型
            symbolSize: 3           // 拐点图形大小
        },

        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#d87a80',       // 阳线填充颜色
                    color0: '#2ec7c9',      // 阴线填充颜色
                    lineStyle: {
                        color: '#d87a80',   // 阳线边框颜色
                        color0: '#2ec7c9'   // 阴线边框颜色
                    }
                }
            }
        },

        // 散点图默认参数
        scatter: {
            symbol: 'circle',    // 图形类型
            symbolSize: 4        // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
        },

        // 雷达图默认参数
        radar : {
            symbol: 'emptyCircle',    // 图形类型
            symbolSize:3
            //symbol: null,         // 拐点图形类型
            //symbolRotate : null,  // 图形旋转控制
        },

        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#d87a80'
                        }
                    }
                },
                emphasis: {                 // 也是选中样式
                    areaStyle: {
                        color: '#fe994e'
                    }
                }
            }
        },

        force : {
            itemStyle: {
                normal: {
                    linkStyle : {
                        color : '#1e90ff'
                    }
                }
            }
        },

        chord : {
            itemStyle : {
                normal : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },

        gauge : {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']],
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                splitNumber: 10,   // 每份split细分多少段
                length :15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length :22,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer : {
                width : 5
            }
        },

        textStyle: {
            fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
        }
    };
    ModalAppChart.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.chart.setOption(this.options);
    },
    ModalAppChart.prototype.updateModal = function (pointName, pointValue) {
    },
    ModalAppChart.prototype.showConfigMode = function () {
    },
    ModalAppChart.prototype.dsChartCog = function (cog, option) {
        if(!cog) return;
        if(cog[0].upper) option.yAxis[0].max = cog[0].upper;
        if(cog[0].lower) option.yAxis[0].min = cog[0].lower;
        if(cog[0].unit) option.yAxis[0].name = cog[0].unit;
        if(cog[0].markLine){
            if(!option.series[0].markLine) {
                option.series[0].markLine = {};
                option.series[0].markLine.data = new Array();

            }
            for(var i in cog[0].markLine){
                var markLine = cog[0].markLine[i];
                if(!markLine.value) continue;
                var arr = [
                    {name: markLine.name, xAxis: -1, yAxis: markLine.value},
                    {name: markLine.name, xAxis: option.series[0].data.length, yAxis: markLine.value}
                ];
                option.series[0].markLine.data.push(arr);
            }
        }
    }
    ModalAppChart.prototype.coordinate = function (e) {
        var arr = [];
        var endTime = new Date().valueOf();
        if (e == 'm1') {
            var startTime = endTime - 21600000;//6*60*60*1000
            var interval = 60000;//一分钟
            while (startTime <= endTime) {
                arr.push(new Date(startTime).format('HH:mm'));
                startTime += interval;
            }
        } else if (e == 'm5'){
            var startTime = endTime - 86100000;//减去24个小时
            var interval = 300000;//五分钟
            while( startTime <= endTime ) {
            arr.push(new Date(startTime - startTime%300000).format('HH:mm'));
            startTime += interval;
            }
        }else if(e == 'h1') {
            var startTime = endTime - 82800000;//23*60*60*1000
            var interval = 3600000;//一个小时
            while( startTime <= endTime ) {
            arr.push(new Date(startTime).format('HH:00'));
            startTime += interval;
            }
        }else if(e == 'd1') {
            var startTime = endTime - 2592000000;//减去一个月
            var interval = 86400000;//一天
            while( startTime <= endTime ) {
                arr.push(new Date(startTime).format('yyyy-MM-dd'));
                startTime += interval;
            }
        }else if(e == 'M1'){
            var fullYear = new Date().getFullYear()-1;
            var month = new Date().getMonth() + 1;
            //var startTime = fullYear+ '-' + month;
            var interval = 1;//一个月
            for(var i=0;i<12;i++){
                var startTime = fullYear+ '-' + month;
                arr.push(startTime);
                month = month%12 + interval;
                if(month === 1){
                    fullYear +=1;
                }
            }
        }
        return [{data: arr}];
    }
    return ModalAppChart;
})();

/*PUE分析 仪表盘 PUE实时指标 start */
var ModalAppGauge = (function () {

    function ModalAppGauge(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.entityOption = entityParams.modal.option;
    };
    ModalAppGauge.prototype = new ModalBase();

    ModalAppGauge.prototype.optionTemplate = {
        name: 'toolBox.modal.APP_GAUGE_CHART',
        parent:3,
        mode: ['appGauge'],
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalAppGauge',
        tooltip: {
            'imgPC': true,
            'imgMobile': true,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalAppGauge.prototype.optionDefault = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}"
        },
        backgroundColor: '#2f91e8',
        animation: true,
        animationDuration: 1000,
        animationDurationUpdate: 1000,
        //backgroundColor: '#2f91e8',
        toolbox: {
            show: false
        },
        title: {
            show: true,
            text: '项目实时评估得分',
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: '100',
                fontFamily: 'Microsoft Yahei',
                fontSize: 16,
                color: '#fff'
            },
            x: 'center'
        },
        series: [
            {
                //name: 'PUE',
                type: 'gauge',
                splitNumber: 4,
                center: ['50%', '55%'],
                radius: '75%',
                startAngle: -270,
                endAngle: 89.9999,
                axisLine: {
                    show: false,
                    lineStyle: {
                        width: 13,
                        opacity: 0
                    }
                },
                axisTick: {
                    splitNumber: 20,   // 每份split细分多少段
                    length: 12,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        width: 2
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#eee'
                    }
                },
                splitLine: {
                    show: true,        // 默认显示，属性show控制显示与否
                    length: 12,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 2,
                        color: 'auto'
                    }
                },
                pointer : {
                    show: false
                },
                itemStyle: {
                    normal: {
                        opacity: 0
                    }
                },
                title: {
                    show: true,
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: 'white'
                    },
                    offsetCenter: [0, '-40%']
                },
                detail: { 
                    formatter: '{value}',
                    offsetCenter: ['0%', '-5%'],
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#fff',
                        fontSize: 36
                    }
                }
            }
        ]
    };
    ModalAppGauge.prototype.renderPercentPlane=function(points){
    	if(points.length < 1) return;
		var c = document.getElementById('gaugeTop'),
	    d=document.getElementById('gaugeBottom'),
	    circleLength,rotDegree,
	    ctx = c.getContext('2d'),
	    ctd=d.getContext('2d'),
	    containerWidth=$(this.container).width(),
	    containerHeight=$(this.container).height(),
	    circleRadius=containerWidth < containerHeight ? containerWidth : containerHeight,
	    dw=d.width=cw = c.width=containerWidth,
	    dh=d.height=ch = c.height=containerHeight,
		data=points[0].data,
		guageOption={
			'guageTitle':points[1].guageTitle ? points[1].guageTitle : '',
			'guageFixed': points[1].guageFixed ? points[1].guageFixed : 0,
			'guageUnit': points[1].guageUnit ? points[1].guageUnit : '',
			'guageMax':points[1].guageMax ? points[1].guageMax : ''
		},
		optionData={
			startData:0,
			totalTime:200,
		},animFrame=null,
	    dToR = function(degrees){
	        return degrees * (Math.PI / 180);
	    },
	    minRadiusValue=(parseInt(circleRadius/3)+20)<(parseInt(circleRadius/2))?(parseInt(circleRadius/3)+20):(parseInt(circleRadius/2)),
	    circle = {
	        x: (cw / 2),
	        y: parseInt(circleRadius/3)+50,
	        radius:minRadiusValue,
	        speed: parseInt(data/(optionData.totalTime/16.7)),
	        rotation: 0,
	        angleEnd: 360,
	        hue: 200,
	        blur: 10
	    };

		(function() {
		    var lastTime = 0;
		    var vendors = ['ms', 'moz', 'webkit', 'o'];
		    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		    }
		    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
		        var currTime = new Date().getTime();
		        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		        var id = window.setTimeout(function() {
		            callback(currTime + timeToCall);
		        }, timeToCall);
		        lastTime = currTime + timeToCall;
		        return id;
		    };
		    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
		        clearTimeout(id);
		    };
		}());
	    function setOption(){
	    	if(data>100){
	    		if(guageOption.guageUnit=='%'&&guageOption.guageMax!=''){
		    		data=parseFloat(data/guageOption.guageMax).toFixed(guageOption.guageFixed);
		    	}else if(guageOption.guageUnit=='%'&&guageOption.guageMax==''){

		    	}else if(guageOption.guageUnit!='%'&&guageOption.guageMax!=''){

		    	}
		    	else{
		    		data=100;
		    	}
	    	}

	    	rotDegree=data*3.6;
	    	!data &&(data=0);
	    	circleLength=120;
	    	data<=25 && (circleLength=90);
	    	data<=15 && (circleLength=50);
	    	data<=8 && (circleLength=25);
	    	data<=2 && (circleLength=1);
	    };
	    function updateCircle(){
	        circle.rotation < circle.angleEnd?circle.rotation += circle.speed:circle.rotation = 0; 
	    };
	    function renderStaticCanvas(){
	    	var fontSize=15;
	    	ctd.shadowColor='rgba(240, 240, 240, 0.3)';
			ctd.shadowBlur = 2;
			ctd.shadowoffsetx=5;
			ctd.shadowoffsety=5;
		    ctd.beginPath();
		    ctd.arc(circle.x, circle.y, circle.radius ,0, Math.PI *2, true);
		    ctd.lineWidth = 4;
		    ctd.strokeStyle = 'rgba(240, 240, 240, 0.3)';
		    ctd.stroke();
		    /*标题*/
		    var titleWidth=Math.sqrt(circle.radius*circle.radius-70*70)*2;
	        ctd.font = '20px 微软雅黑';
	        ctd.fillStyle = '#9ea0ba';
	        ctd.textBaseline = 'middle';
	        ctd.textAlign = 'center';
	        if (titleWidth && ctd.measureText(guageOption.guageTitle).width < titleWidth) {
	            ctd.fillText(guageOption.guageTitle, circle.x-5, circle.y+40);
	        } else {
	            StringTools.wordWrap(ctd, circle.x, circle.y+40,titleWidth, guageOption.guageTitle, null);
	        }
	        
	    };
	    function renderProgressBar(){
	    	ctd.clearRect(0,0,cw,ch);
	    	renderStaticCanvas();
		    ctd.beginPath();
		    ctd.shadowBlur = 2;
			ctd.shadowoffsetx=5;
			ctd.shadowoffsety=5;
            ctd.lineWidth = 4;
            ctd.strokeStyle = 'rgba(222,222,222,0.8)';
            ctd.lineCap="round";
            ctd.arc(circle.x, circle.y, circle.radius,-90 * Math.PI / 180, -(optionData.startData+90)*Math.PI/180,true);
            ctd.stroke();

	    };
	    function renderPercentCircle(){
       		renderText();
          	if(optionData.startData<=rotDegree){
          		animFrame=window.requestAnimationFrame(renderPercentCircle);
          		renderProgressBar();
                optionData.startData+=circle.speed;
                clear();
		        updateCircle();
		        renderText();
		        renderCircle();
		        for(var i=0;i<circleLength;i+=1){
		       		renderCircleFlare(i,circleLength);
		        }
		    }
          else{
                window.cancelAnimationFrame(animFrame);
            }
	    };
	    /*渲染百分比文字*/
	    function renderText(){
	        var percentText=optionData.startData>rotDegree?parseInt(data)+guageOption.guageUnit:parseInt(optionData.startData/3.6)+guageOption.guageUnit;	        
		    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
			ctx.shadowOffsetX = 5;
			ctx.shadowOffsetY = 4;
			ctx.shadowBlur = 8;
	        ctx.font = parseInt(circle.radius*1/2)+'px 微软雅黑';
	        ctx.fillStyle = '#fff';
	        ctx.textBaseline = 'middle';
	        ctx.textAlign = 'center';
	        var textWidth=ctx.measureText(percentText).width+20;
	        ctx.clearRect(circle.x-textWidth/2,circle.y-55,textWidth,110);
	        ctx.fillText(percentText, circle.x, circle.y-10);
	    };
	    /*刷新时间*/
	    function renderRefreshText(){
	    	var refreshTime=new Date().format('yyyy-MM-dd HH:mm');
	    	ctd.clearRect(0,0,100,30);
	    	ctd.font='10px 微软雅黑';
	    	ctd.fillStyle='rgba(255,255,255,0.6)';
	    	ctd.fillText(refreshTime,5,15);
	    };
	    /*将画布逆时针旋转*/
		function renderCircleFlare(i,circleLength){
			var count=1-parseFloat(i/circleLength);
	        ctx.save();
	        ctx.translate(circle.x, circle.y);
	        ctx.rotate(-dToR(circle.rotation+180-i));
        	ctx.scale(1,1);
	        ctx.beginPath();
	        ctx.arc(0, circle.radius, 10*count, 0, Math.PI *2, false);
	        ctx.closePath();
	        ctx.shadowColor = 'rgba(255, 255, 255, 0)';
	        var gradient3 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 12);
	        gradient3.addColorStop(0, 'rgba(255, 255, 255, '+parseFloat(0.06*count)+')');
	        gradient3.addColorStop(1, 'rgba(255, 255, 255, 0)');
	        ctx.fillStyle = gradient3;
	        ctx.fill();     
	        ctx.restore();
	    };
	    function renderCircle(){
	        ctx.save();
	        ctx.translate(circle.x, circle.y);
	        ctx.rotate(-dToR(circle.rotation+180));
        	ctx.scale(1,1);
	        ctx.beginPath();
	        ctx.arc(0, circle.radius, 10, 0, Math.PI *2, false);
	        ctx.closePath();
	        ctx.shadowColor = 'rgba(255, 255, 255, 0)';
	        var gradient4 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 12);
	        gradient4.addColorStop(0, 'rgba(255, 255, 255, '+0.08+')');
	        gradient4.addColorStop(1, 'rgba(255, 255, 255, 0)');
	        ctx.fillStyle = gradient4;
	        ctx.fill();     
	        ctx.restore();
	    };
	    clear = function(){
	        ctx.globalCompositeOperation = 'destination-out';
	        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
	        ctx.fillRect(0, 0, cw, ch);
	        ctx.globalCompositeOperation = 'lighter';
	    };
	    setOption();
	    renderPercentCircle();
	    //renderRefreshText();
		ctd.shadowColor='rgba(222,222,222,0.3)';
		ctd.shadowBlur = 3;
		ctd.shadowoffsetx=5;
		ctd.shadowoffsety=5;
	    ctx.shadowColor = 'hsla('+circle.hue+', 80%, 60%, 1)';
		ctx.lineCap = 'round';
		this.spinner.stop();
    }
    ModalAppGauge.prototype.renderModal = function () {
    	var canvasModal='<canvas id="gaugeTop"></canvas><canvas id="gaugeBottom"></canvas>';
    	$(this.container).append(canvasModal);
    	$('#gaugeTop',this.container).css({'display':'block','position':'absolute','top':'0','left':'0','zIndex':'11'});
    	$('#gaugeBottom',this.container).css({'display':'block','position':'absolute','top':'0','left':'0','zIndex':'10','background':'rgba(0,0,0,0)'});
    },

    ModalAppGauge.prototype.updateModal = function (points) {
	    if(!AppConfig.isMobile){
	        if(points.length < 1) return;
	        var _this = this;
	        var dataSeries;

	        if(parseFloat(points[0].data)>100){
	            this.optionDefault.series[0].max = parseFloat(points[0].data).toFixed(0);
	            this.optionDefault.series[0].formatter = function (v) {
	                    switch (v + '') {
	                        case (parseFloat(points[0].data)/4).toFixed(0): return (parseFloat(points[0].data)/4).toFixed(0);
	                        case (parseFloat(points[0].data)/2).toFixed(0): return (parseFloat(points[0].data)/2).toFixed(0);
	                        case (parseFloat(points[0].data)*3/4).toFixed(0): return (parseFloat(points[0].data)*3/4).toFixed(0);
	                        case parseFloat(points[0].data).toFixed(0): return parseFloat(points[0].data).toFixed(0);
	                        default: return '';
	                    }
	                }
	        }else{
	            this.optionDefault.series[0].max = 100;
	            this.optionDefault.series[0].formatter = function (v) {
	                    switch (v + '') {
	                            case '25': return '25';
	                            case '50': return '50';
	                            case '75': return '75';
	                            case '0': return '0';
	                            default: return '';
	                    }
	                }
	        }
				if(points[1]){
	            //var guageTitle = points[1].guageTitle ? points[1].guageTitle : '';
	            if(points[1].guageTitle){
	                this.optionDefault.title.text = points[1].guageTitle;
	            }
	            var guageFulTitle = points[1].guageFulTitle ? points[1].guageFulTitle : '';
	            //var guageFixed = points[1].guageFixed ? points[1].guageFixed : 2;

	            if(points[1].guageFixed===0||points[1].guageFixed){
	                dataSeries = parseFloat(points[0].data).toFixed(points[1].guageFixed);
	            }else{
	                dataSeries = parseFloat(points[0].data).toFixed(2);
	            }
	            if(parseFloat(points[0].data)>100){
	                this.optionDefault.series[0].max = parseFloat(points[0].data).toFixed(0);
	                this.optionDefault.series[0].formatter = function (v) {
	                        switch (v + '') {
	                            case (parseFloat(points[0].data)/4).toFixed(0): return (parseFloat(points[0].data)/4).toFixed(0);
	                            case (parseFloat(points[0].data)/2).toFixed(0): return (parseFloat(points[0].data)/2).toFixed(0);
	                            case (parseFloat(points[0].data)*3/4).toFixed(0): return (parseFloat(points[0].data)*3/4).toFixed(0);
	                            case parseFloat(points[0].data).toFixed(0): return parseFloat(points[0].data).toFixed(0);
	                            default: return '';
	                        }
	                    }
	            }else{
	                this.optionDefault.series[0].max = 100;
	                this.optionDefault.series[0].formatter = function (v) {
	                        switch (v + '') {
	                                case '25': return '25';
	                                case '50': return '50';
	                                case '75': return '75';
	                                case '0': return '0';
	                                default: return '';
	                        }
	                    }
	            }
	            //var guageUnit = points[1].guageUnit ? points[1].guageUnit : '';
	           if(points[1].guageUnit){
	                this.optionDefault.series[0].detail.formatter = '{value}'+points[1].guageUnit;
	            }

	            var guageDirect = points[1].guageDirect ? points[1].guageDirect : '';
	            if(guageDirect==='antiClockwise'){
	                //逆时针
	                this.optionDefault.series[0].startAngle = -270;
	                this.optionDefault.series[0].endAngle = 89.9999;
	            }else{
	                this.optionDefault.series[0].startAngle = 90;
	                this.optionDefault.series[0].endAngle = -269.9999;
	            }
	            if(points[1].guageBgColor){
	                this.optionDefault.backgroundColor = points[1].guageBgColor;
	            }
	            if(points[1].transDataDot){
	                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	                String.prototype.colorRgb = function () {
	                    var sColor = this.toLowerCase();
	                    if (sColor && reg.test(sColor)) {
	                        if (sColor.length === 4) {
	                            var sColorNew = "#";
	                            for (var i = 1; i < 4; i += 1) {
	                                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
	                            }
	                            sColor = sColorNew;
	                        }
	                        //处理六位的颜色值
	                        var sColorChange = [];
	                        for (var i = 1; i < 7; i += 2) {
	                            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
	                        }
	                        return "RGB(" + sColorChange.join(",") + ")";
	                    } else {
	                        return sColor;
	                    }
	                };
	                var currentRGB = points[1].guageBgColor.colorRgb();
	                var rgb = currentRGB.split("(")[1].split(")")[0];
	                var r = rgb.split(",")[0];
	                var g = rgb.split(",")[1];
	                var b = rgb.split(",")[2];
	                var finalRGB = 'rgba('+r+','+g+','+b+','+points[1].transDataDot+')';
	                this.optionDefault.backgroundColor = finalRGB;
	            }
	        }
	        this.optionDefault.series[0].data = [{ value: dataSeries, name: guageFulTitle }];

	        this.optionDefault.series[0].axisLine.lineStyle.color = function () {
	            var arrColor = ['tomato', '#f7ba49', '#11fff1', '#89dd4b'];
	            var seriesDataInt = parseInt(dataSeries);
	            var numCount = dataSeries.toString().length;
	            var numCount1 = numCount-2<=0?1:(numCount-2);
	            var numFinally = Math.pow(10,numCount1);
	            var kpiColor;
	            if(seriesDataInt>100){
	                //kpiColor = arrColor[Math.floor(Math.abs(seriesDataInt - 1) / (25*numFinally))];
	                kpiColor = '#89dd4b';
	            }else{
	                kpiColor = arrColor[Math.floor(Math.abs(seriesDataInt - 1) / 25)];
	            }
	            return [[seriesDataInt / 100, kpiColor], [1, '#87a8c5']];
	        }();

	        !this.chart && (this.chart = echarts.init(this.container, AppConfig.chartTheme));
	        this.chart.setOption(this.optionDefault);
	        var spanTime = '<span class="spanTime" style="position:absolute;color:#fff">'+new Date().format('yyyy-MM-dd')+'</span>'
	        $(this.container).find('.spanTime').empty().remove();
	        $(this.container).append(spanTime);
	        var timeLocal = points[1].timeLocal ? points[1].timeLocal : 'leftTop';
	        if(timeLocal){
	            var $spanTimeDom = $(this.container).find('.spanTime');
	            if(timeLocal==='leftTop'){
	                $spanTimeDom.css({'top':'10px','left':'10px'});
	            }else if(timeLocal==='rightTop'){
	                $spanTimeDom.css({'top':'10px','right':'10px'});
	            }else if(timeLocal==='leftBottom'){
	                $spanTimeDom.css({'bottom':'10px','left':'10px'});
	            }else{
	                $spanTimeDom.css({'bottom':'10px','right':'10px'});
	            }
	        }
	    }else{
			this.renderPercentPlane(points);
	    }
    },

    ModalAppGauge.prototype.showConfigMode = function () {

    },

    ModalAppGauge.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        //this.entity.modal.option.scaleList = option.scaleList;
        //this.entity.modal.option.appGuageList = option.appGuageList;
        this.entity.modal.option.guageTitle = option.guageTitle;
        this.entity.modal.option.guageFulTitle = option.guageFulTitle;
        this.entity.modal.option.guageFixed = option.guageFixed;
        this.entity.modal.option.guageUnit = option.guageUnit;
        this.entity.modal.option.guageMax = option.guageMax;
        this.entity.modal.option.timeLocal = option.timeLocal;
        this.entity.modal.option.guageDirect = option.guageDirect;
        this.entity.modal.option.guageBgColor = option.guageBgColor;
        this.entity.modal.option.transDataDot = option.transDataDot;
        this.entity.modal.interval = 5;
    };

    return ModalAppGauge;
})();
/*PUE分析 仪表盘 PUE实时指标 start */

/*APP 按钮*/
var ModalAppButton = (function () {
    var _this;
    function ModalAppButton(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        _this = this;
        if (!screen) return;
        this.screen = screen;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.entityOption = entityParams.modal.option;
    };
    ModalAppButton.prototype = new ModalBase();

    ModalAppButton.prototype.optionTemplate = {
        name: 'toolBox.modal.APP_BUTTON',
        parent: 3,
        mode: ['appGauge'],
        maxNum: 10,
        title: '',
        //defaultHeight: 4.5,
        //defaultWidth: 3,
        minHeight: 1.5,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalAppButton',
        tooltip: {
            'imgPC': false,
            'imgMobile': true,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalAppButton.prototype.show = function () {
        this.init();
    };

    ModalAppButton.prototype.init = function () {
        this.container.style.overflowX = 'hidden';
        this.container.style.overflowY = 'auto';
    };

    ModalAppButton.prototype.configure = function () {
        this.spinner && this.spinner.stop();
        var _this = this;

        if (this.chart) this.chart.clear();
        this.divResizeByMouseInit();

        var divMask = document.createElement('div');
        divMask.className = 'springConfigMask';
        divMask.draggable = 'true';

        var btnRemove = document.createElement('span');
        btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
        btnRemove.title = 'Remove';
        btnRemove.onclick = function (e) {
            //TODO 测试confirm
            confirm('Are you sure you want to delete it ?', function () {
                if (_this.chart) _this.chart.clear();
                var oldIndex = _this.screen.arrEntityOrder.indexOf(_this.entity.id);
                if (_this.screen.screen) {//兼容ModalMix
                    _this.screen.screen.removeEntity(_this.entity.id);
                } else {
                    _this.screen.removeEntity(_this.entity.id);
                }
                _this.screen.isScreenChange = true;

                //重新生成窗口
                var entity = new ModalNone(_this.screen, {
                    id: _this.entity.id,
                    spanC: _this.entity.spanC,
                    spanR: _this.entity.spanR,
                    modal: {type:"ModalNone"}
                }, _this.entity.id);
                _this.screen.arrEntityOrder.splice(oldIndex,0,entity.entity.id);
                _this.screen.listEntity[entity.entity.id] = entity;
                entity.render();
                entity.configure();
                entity.hasEdit = true;
                _this = null;
            })
        };
        divMask.appendChild(btnRemove);

        if (this.entity.modal.type != 'ModalAnalysis' || !this.screen.isForReport) {
            var btnConfig = document.createElement('span');
            btnConfig.className = 'glyphicon glyphicon-cog springConfigBtn grow';
            btnConfig.title = 'Options';
            btnConfig.onclick = btnConfig_clickEvent;
            divMask.appendChild(btnConfig);
        }
        function btnConfig_clickEvent(e) {
            $('.springSel').removeClass('springSel');
            $(e.target).closest('.springContainer').addClass('springSel');
            _this.modalInit();
            //$('#energyModal').modal('show');
        }

        var btnHeightResize = document.createElement('div');
        var maxHeight = this.spanRange.maxHeight;
        var maxWidth = this.spanRange.maxWidth;
        var minHeight = this.spanRange.minHeight;
        var minWidth = this.spanRange.minWidth;
        btnHeightResize.className = 'divResize divHeightResize';
        btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
        '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanR + ' /' + _this.spanRange.maxHeight + '</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
        divMask.appendChild(btnHeightResize);
        var btnWidthResize = document.createElement('div');
        btnWidthResize.className = 'divResize divWidthResize';
        btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
        '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanC + ' /' + _this.spanRange.maxWidth + '</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
        divMask.appendChild(btnWidthResize);
        var divTitleAndType = document.createElement('div');
        divTitleAndType.className = 'divTitleAndType';
        divMask.appendChild(divTitleAndType);


        var $divTitle = $('<div class="divResize chartTitle">');
        var $labelTitle = $('<label for="title">').text(I18n.resource.dashboard.show.TITLE);
        var inputChartTitle = document.createElement('input');
        inputChartTitle.id = 'title';
        inputChartTitle.className = 'form-control';
        inputChartTitle.value = this.entity.modal.title;
        inputChartTitle.setAttribute('placeholder', I18n.resource.dashboard.show.TITLE_TIP);
        if (this.entity.modal.title != '') {
            inputChartTitle.style.display = 'none';
        }
        inputChartTitle.setAttribute('type', 'text');
        $divTitle.append($labelTitle).append($(inputChartTitle));
        divTitleAndType.appendChild($divTitle[0]);

        var $divType = $('<div class="divResize chartType">');
        var $labelType = $('<label>').text(I18n.resource.dashboard.show.TYPE);
        var chartType = document.createElement('span');
        chartType.innerHTML = I18n.findContent(this.optionTemplate.name);
        $divType.append($labelType).append($(chartType));
        divTitleAndType.appendChild($divType[0]);

        var chartTitleShow = document.createElement('p');
        chartTitleShow.innerHTML = inputChartTitle.value;
        chartTitleShow.className = 'chartTitleShow';
        $divTitle[0].appendChild(chartTitleShow);
        if (this.entity.modal.title == '' || this.entity.modal.title == undefined) {
            chartTitleShow.style.display = 'none';
        }
        chartTitleShow.onclick = function () {
            chartTitleShow.style.display = 'none';
            inputChartTitle.style.display = 'inline-block';
            inputChartTitle.focus();
        };
        inputChartTitle.onchange = function () {
            if (inputChartTitle.value != '') {
                inputChartTitle.style.display = 'none';
                chartTitleShow.style.display = 'inline';
            }
            chartTitleShow.innerHTML = inputChartTitle.value;
            _this.entity.modal.title = inputChartTitle.value;

            _this.screen.isScreenChange = true;
        };

        _this.entity.modal.interval = '300000';//设置请求间隔

        //如果entity的isRender为false,添加到chartsCt中
        this.container.parentNode.appendChild(divMask);
        if (this.entity.isNotRender && this.screen.listEntity) {//兼容ModalMix
            var parentId = undefined, subChartIds;
                if(this.entity && this.entity.id){//observer
                    parentId = this.entity.id;
                }
                if(this.screen.store && this.screen.store.layout[0]){//factory
                    for(var i = 0, len = this.screen.store.layout[0].length, entity; i < len; i++){
                        entity = this.screen.store.layout[0][i];
                        if(entity.modal.type == 'ModalMix' && entity.modal.option.subChartIds &&  entity.modal.option.subChartIds.length > 0){
                            subChartIds = entity.modal.option.subChartIds;
                            for(var j = 0, l = subChartIds.length; j < l; j++){
                                if(subChartIds[j].id == this.entity.id){
                                    parentId = entity.id;
                                    break;
                                }
                            }
                        }
                        if(entity.modal.type == 'ModalAppBlind'&& entity.modal.option && entity.modal.option.length>0&&entity.modal.option[0].subChartIds.length>0){
                            var opts = entity.modal.option;
                            for(var m = 0;m<opts.length;m++){
                                if(opts[m].subChartIds[0].id===this.entity.id){
                                    parentId = entity.id;
                                    break;
                    }
                }
                        }
                    }
                }
                if(parentId){
                    $(document.getElementById('divContainer_' + parentId)).find('.chartsCt')[0].appendChild(this.container.parentNode.parentNode);
                }
        }

        this.divResizeByToolInit();

        //drag event of replacing entity

        this.executeConfigMode();
    };
    ModalAppButton.prototype.renderModal = function (e) {
        this.spinner && this.spinner.stop();
        var divAppButton, divIcon, divDetail, spName, spValue, spUnit;
        var $springContentCur = $(this.container);
        $springContentCur.css("overflow", "auto");
        var appButtonArr = _this.entity.modal.option.appButton;
        var len = appButtonArr.length;
        //默认颜色组
        var staticColor = ['#5A95F7', '#FBDE54', '#89D164', '#89D164', '#5A95F7', '#23D29C'];
        for (var i = 0 ; i < len; i++) {
            divAppButton = document.createElement('div');
            divAppButton.className = 'divAppButton';
            if (appButtonArr[i].link !== '') {
                divAppButton.setAttribute('data-link-to', appButtonArr[i].link);
            }
            if(appButtonArr[i].linkType !== ''){
                divAppButton.setAttribute('data-type', appButtonArr[i].linkType);
            }
            $(divAppButton).on('tap',function(){
                var triggerId = $(this).attr('data-link-to');
                var dataType =$(this).attr('data-type');
                var linkName = $(this).find('.divMonitorInfo .spName').text();
                if (!triggerId) return;

                if(!AppConfig.isMobile) {
                    ScreenManager.show(EnergyScreen, triggerId);
                }else{
                    var isIndex = dataType == 'EnergyScreen_M';
                    router.to({
                        typeClass: ProjectDashboard,
                        data: {
                            menuId:triggerId,
                            isIndex:isIndex,
                            name:linkName
                        }
                    })
                }
            });
            switch (len) {
                case 1:
                    divAppButton.className += ' divAppButtonOne col-xs-6 zepto-ev';
                    break;
                case 2:
                    divAppButton.className += ' divAppButtonTwo col-xs-6 zepto-ev';
                    break;
                case 3:
                    divAppButton.className += ' divAppButtonThree col-xs-4 zepto-ev';
                    break;
                case 4:
                    divAppButton.className += ' divAppButtonFour col-xs-6 zepto-ev';
                    break;
                case 5:
                    divAppButton.className += ' divAppButtonFive col-xs-4 zepto-ev';
                    break;
                case 6:
                    divAppButton.className += ' divAppButtonSix col-xs-4 zepto-ev';
                    break;
                default:
                    divAppButton.className += ' divAppButtonSix col-xs-4 zepto-ev';
                    break;
            }

            divIcon = document.createElement('div');
            var curType = appButtonArr[i].iconType?appButtonArr[i].iconType:'bootIcon';
            if(curType==='image'){
                divIcon.className = 'divIcon glyphicon';
                var imgDom = appButtonArr[i].icon.split('@*')[1];
                if(AppConfig.isMobile){
                    $(divIcon).html(imgDom);
                }else{
                    imgDom = appButtonArr[i].icon.split('@*')[1].split('=')[0]+'='+appButtonArr[i].icon.split('@*')[1].split('=')[1].replace(/(.{1})/,'"/');
                    $(divIcon).html(imgDom);
                }
            }else if(curType==='svg'){
                divIcon.className = 'divIcon glyphicon';
                $(divIcon).html(appButtonArr[i].icon.split('@*')[1]);
            }else{
                divIcon.className = 'divIcon ' + appButtonArr[i].icon;
            }
            if (appButtonArr[i].icon) divIcon.style.color = appButtonArr[i].iconColor;

            divDetail = document.createElement('div');
            divDetail.className = 'divMonitorInfo';

            spName = document.createElement('span');
            spName.className = 'spName';
            spName.textContent = appButtonArr[i].name;

            if (appButtonArr[i].backColor == "") {
                divIcon.style.background = 'transparent'//staticColor[i];//"-webkit-gradient(radial, 184 -25, 161, 220 -257, 465, from(#fabd3e), to(#f4ae32))";
            } else {
                divIcon.style.background = appButtonArr[i].backColor;
            }

            divDetail.appendChild(spName);

            divAppButton.appendChild(divIcon);
            divAppButton.appendChild(divDetail);

            _this.container.appendChild(divAppButton);

        }
        $(_this.container).addClass('backOperate');
        if($springContentCur.height()<200){
            $springContentCur.find('.divIcon').addClass('divIconLittle');
            $springContentCur.find('.divMonitorInfo').addClass('divMonitorInfoLit');
        }else{
            $springContentCur.find('.divIcon').removeClass('divIconLittle');
            $springContentCur.find('.divMonitorInfo').removeClass('divMonitorInfoLit');
        }
    };
    ModalAppButton.prototype.showConfigMode = function () {
    };

    ModalAppButton.prototype.showConfigModal = function () {
        _this.tempOpt = $.extend(true, {}, this.entity.modal);
        var configModalTpl = '\
                <div id="ModalAppButtonConfig" class="modal fade"  role="dialog" aria-labelledby="ttlNodeTool">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <span id="btnMonitorAdd" class="glyphicon glyphicon-plus-sign btnMonitorAdd grow"></span>\
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title" id="ttlNodeTool">Diagnosis Edit</h4>\
                            </div>\
                            <div class="modal-body gray-scrollbar" id="ctnMonitor">\
                            </div>\
                            <div class="modal-footer">\
                                <input type ="color">\
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                                <button type="button" class="btn btnSure btn-primary">Save</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>';
        _this.$configModal = $('#ModalAppButtonConfig');
        if (_this.$configModal.length == 0) _this.$configModal = $(configModalTpl);
        _this.$configModal.appendTo($(_this.container).parentsUntil('.springContainer').parent().parent());
        var $ctnMonitor = _this.$configModal.find('#ctnMonitor').html('');

        var btnAdd = _this.$configModal.find('#btnMonitorAdd')[0];
        btnAdd.title = 'Monitor Type Add';
        btnAdd.onclick = function () {
            //if (_this.entity.modal.option && _this.entity.modal.option.appButton && _this.entity.modal.option.appButton.length === 6) {
            //    alert('最多添加6项！');
            //    return;
            //}
            $ctnMonitor.append(_this.createDivMonitor());
            _this.attachMonitorEvent();
        };
        if (this.entity.modal.option && this.entity.modal.option.appButton && this.entity.modal.option.appButton.length > 0) {
            for (var i = 0; i < this.entity.modal.option.appButton.length ; i++) {
                if(this.entity.modal.option.appButton[i].entityId===this.entity.id){
                	$ctnMonitor[0].appendChild(_this.createDivMonitor(this.entity.modal.option.appButton[i]));
				}
            }
        } else {
            $ctnMonitor[0].appendChild(_this.createDivMonitor());
        }
        _this.$configModal.modal('show');
        _this.$configModal.find('.btnSure').off('click').on('click', function () {
            if(_this.tempOpt.option.appButton&&_this.tempOpt.option.appButton.length>0){
                var appButtonArr = _this.tempOpt.option.appButton;
                for(var i = 0;i<appButtonArr.length;i++){
                    if(!appButtonArr[i].entityId){
                        appButtonArr[i].entityId = _this.entity.id;
                    }
                }
            }
            _this.entity.modal = $.extend(true, {}, _this.tempOpt);
            _this.$configModal.modal('hide');
        });

        _this.attachMonitorEvent();
    };

    ModalAppButton.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    ModalAppButton.prototype.close = function(){
        _this.entity = null;
        this.entity = null;
    }
    ModalAppButton.prototype.createDivMonitor = function (opt) {
        var divMonitor = document.createElement('div');
        divMonitor.className = 'divMonitor';
        var $divMonitor = $(divMonitor);
        //<span class="spLink"></span>\
        //<input class="iptLink form-control"></input>\
        divMonitor.innerHTML =
            '\
            <div class="divIcon"></div>\
            <div class="divMonitorInfo">\
                <div class="divName">\
                    <label>name:</label>\
                    <span class="spName"></span>\
                    <input class="iptName form-control" ></input>\
                </div>\
                <div class="divLink">\
                    <label>link:</label>\
                    <select class="form-control linkList"></select>\
                </div>\
            </div>\
            <div class="divMonitorDel glyphicon glyphicon-remove-circle"></div>';


        var $linkList = $divMonitor.find('select.linkList');
        $linkList[0].options.add(new Option(I18n.resource.dashboard.show.SELECT_LINK, ''));
        if(AppConfig.menu.length>0){
            for (var i in AppConfig.menu) {
                var option = new Option(AppConfig.menu[i], i);
                if (opt && opt.link && opt.link == i) {
                    option.selected = 'selected';
                }
                $linkList[0].options.add(option);
            }
        }else{
            if(_this.screen.facScreen) {
                var pageDataMenus = _this.screen.facScreen.pagePanel.getPageList();//getPagesData.serialize()
                for(var i = 0;i<pageDataMenus.length;i++){
                   var option = new Option(pageDataMenus[i].text, pageDataMenus[i]._id);
                    $(option).attr('data-type',pageDataMenus[i].type);
                    if (opt && opt.link && opt.link == pageDataMenus[i]._id) {
                        option.selected = 'selected';
                    }
                    $linkList[0].options.add(option);
                }
            }

        }
        $linkList[0].onchange = function () {
            //opt.link = $linkList[0].value;
            var index = $('#ctnMonitor').children().index($divMonitor);
            _this.tempOpt.option.appButton[index].link = $linkList[0].value;
            _this.tempOpt.option.appButton[index].linkType = $(this).find('option:selected').attr('data-type');
        };

        if (opt && opt.icon) {
            var curType = opt.iconType?opt.iconType:'bootIcon';
            if(curType==='image'||curType==='svg'){
                 $divMonitor.find('.divIcon').addClass('glyphicon');
                $divMonitor.find('.divIcon').html(opt.icon.split('@*')[1]);
            }else{
                $divMonitor.find('.divIcon').addClass(opt.icon);
            }
            if (opt.iconColor) $divMonitor.find('.divIcon').css({
                'color': opt.iconColor,
                'box-shadow': '0 0 15px ' + opt.iconColor
            })
        } else {
            $divMonitor.find('.divIcon').addClass('glyphicon glyphicon-plus').css('color', 'black');
        }

        if (opt && opt.name) {
            $divMonitor.find('.spName').show().text(opt.name);
            $divMonitor.find('.iptName').hide().val(opt.name)
        } else {
            $divMonitor.find('.spName').hide();
            $divMonitor.find('.iptName').show();
        }

        if(opt && opt.backColor){
            $divMonitor.css('background',opt.backColor);
        }

        //if (opt && opt.link) {
        //    $divMonitor.find('.spLink').show().text(opt.link);
        //    $divMonitor.find('.iptLink').hide().val(opt.link)
        //} else {
        //    $divMonitor.find('.spLink').hide();
        //    $divMonitor.find('.iptLink').show();
        //}

        if (!opt) {
            if ( !_this.tempOpt.option) {
                _this.tempOpt.option = {};
            }
            if (!_this.tempOpt.option.appButton) { 
                _this.tempOpt.option.appButton = [];
            }
            
            _this.tempOpt.option.appButton.push(
                {
                    icon: 'glyphicon glyphicon-plus',
                    iconColor: '#000000',
                    name: '',
                    link: '',
                    backColor: '',
                    linkType:''
                })
        }
        return divMonitor
    };

    ModalAppButton.prototype.attachMonitorEvent = function () {
        var $ctnMonitor = _this.$configModal.find('#ctnMonitor');
        var $iptColor;
        //选中状态
        var indexDivMonitor;
        $ctnMonitor.find(".divMonitor").off('click').on('click', function () {
            var currentBg = $(this).css('background');
            $ctnMonitor.find(".divMonitor").css("border", "1px dotted");

            indexDivMonitor = $ctnMonitor.find(".divMonitor").index($(this));

            $(this).css("border", "1px solid black");
            //var $modalFoot = $('#ModalAppButtonConfig').find('.modal-footer');
            //$modalFoot .find('input').empty().remove();
            //$modalFoot.prepend('<input type="color" value="'+currentBg+'"/>');
            //_this.attachMonitorEvent();
        })

        $(".modal-footer").find("input").off("change").on("change", function () {
            var colorVal = $(this).val();

            var rgb = colorVal.colorRgb().split("(")[1].split(")")[0];

            var r = rgb.split(",")[0];
            var g = rgb.split(",")[1];
            var b = rgb.split(",")[2];
            var hsl = rgbToHsl(r, g, b);
            var hslEndL = hsl[2] + 0.05;



            var rgbStartColor = hslToRgb(hsl[0], hsl[1], hsl[2]);
            var rgbEndColor = hslToRgb(hsl[0], hsl[1], hslEndL);

            var backColor = '-webkit-gradient(radial, 184 -25, 161, 220 -257, 465, from(rgb(' + rgbStartColor[0] + ',' + rgbStartColor[1] + ',' + rgbStartColor[2] + ')), to(rgb(' + rgbEndColor[0] + ',' + rgbEndColor[1] + ',' + rgbEndColor[2] + '))';
            if (indexDivMonitor!==0){
                if(!indexDivMonitor) return;
            }
            _this.tempOpt.option.appButton[indexDivMonitor].backColor = colorVal;
            $ctnMonitor.find(".divMonitor").eq(indexDivMonitor).css("background", colorVal);
        })
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        String.prototype.colorRgb = function () {
            var sColor = this.toLowerCase();
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                var sColorChange = [];
                for (var i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return "RGB(" + sColorChange.join(",") + ")";
            } else {
                return sColor;
            }
        };
        function rgbToHsl(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            return [h, s, l];
        }
        function hslToRgb(h, s, l) {
            var r, g, b;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        //选择icon
        $(".divMonitor").on('click', '.divIcon', function (e) {
            e.stopPropagation();
            $('#ctnMonitor .divMonitor.selected').removeClass('selected');
            var $divMonitor = $(e.currentTarget).parentsUntil('.ctnMonitor', '.divMonitor').addClass('selected');
            var index = $ctnMonitor.children().index($divMonitor);
            var currentEntityId = _this.entity.id;
            var thisEntity = _this.tempOpt.option.appButton[index];
            new ModalIconManage().show(thisEntity,currentEntityId,callback);
            function callback(icon,color,iconType){
                if(iconType ==='svg'||iconType ==='image'){
                    $divMonitor.find('.divIcon').eq(0).html(icon.split('@*')[1]);
                    $divMonitor.find('.divIcon').eq(0).attr('class','divIcon glyphicon');
                }else{
                    $divMonitor.find('.divIcon').eq(0).html('');
                    $divMonitor.find('.divIcon')[0].className = 'divIcon ' + icon;
                    $divMonitor.find('.divIcon').css({
                        'color': color,
                        'box-shadow': '0 0 15px ' + color
                    });
                }
            }
        });
        //删除
        $(".divMonitor").on('click', '.divMonitorDel', function (e) {
            var index = $ctnMonitor.children().index($(e.currentTarget).parentsUntil('.ctnMonitor', '.divMonitor'));
            $ctnMonitor.children().eq(index).remove();
            _this.tempOpt.option.appButton.splice(index, 1);
            _this.tempOpt.points = [];
            for (var i = 0 ; i < $ctnMonitor.find('.divValue').length; i++) {
                _this.tempOpt.points.push($ctnMonitor.find('.divValue')[i].dataset.dsId);
            }
        });

        $(".divMonitor").on('click', '.spName', function (e) {
            $(e.currentTarget).hide();
            $(e.currentTarget).parentsUntil('.ctnMonitor', '.divMonitor').find('.iptName').show().focus();
        });

        //$(".divMonitor").on('click', '.spLink', function (e) {
        //    $(e.currentTarget).hide();
        //    $(e.currentTarget).parentsUntil('.ctnMonitor', '.divMonitor').find('.iptLink').show().focus();
        //});
        $ctnMonitor.off('blur').on('blur', 'input', function (e) {
            var $divMonitor = $(e.currentTarget).parentsUntil('.ctnMonitor', '.divMonitor');
            var index = $ctnMonitor.children().index($divMonitor);
            var value = $(e.currentTarget).val();
            if ($(e.currentTarget).hasClass('iptName')) {
                _this.tempOpt.option.appButton[index].name = value;
                if (!value) return;
                $(e.currentTarget).hide();
                $divMonitor.find('.spName').text(value).show();
            }
            _this.tempOpt.option.appButton[index].entityId = _this.entity.id;
            //else if ($(e.currentTarget).hasClass('iptLink')) {
            //    _this.tempOpt.option.appButton[index].link = value;
            //    if (!value) return;
            //    $(e.currentTarget).hide();
            //    $divMonitor.find('.spLink').text(value).show();
            //}
        });
        $ctnMonitor.find('.linkList').off('change').on('change', function (e) {
            var $divMonitor = $(e.currentTarget).parentsUntil('.ctnMonitor', '.divMonitor');
            var index = $ctnMonitor.children().index($divMonitor);
            var value = $(e.currentTarget).val();
            _this.tempOpt.option.appButton[index].entityId = _this.entity.id;
            if ($(e.currentTarget).hasClass('linkList')) {
                _this.tempOpt.option.appButton[index].link = value;
                if (!value) return;
            }
        })

    };
    return ModalAppButton;
})();
/*APP 按钮*/
/*app history start */
var ModalAppHistory = (function () {
    function ModalAppHistory(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.attachEvent();

        this.echarShowName = [];
        this.echarShowData = [];
        this.echarShowTime = undefined;

        this.dataInfo = [];
    };
    ModalAppHistory.prototype = new ModalBase();

    ModalAppHistory.prototype.optionTemplate = {
        name: 'toolBox.modal.APP_HISTORY_QUERY',
        parent:3,
        mode: ['appGauge'],
        maxNum: 1,
        title:'',
        minHeight:4,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalAppHistory',
        scroll:false,
        tooltip: {
            'imgPC': false,
            'imgMobile': true,
            'isSpecData':false,
            'desc': ''
        }
    };
    ModalAppHistory.prototype.echarsShow = function(data,time){
        var option = {
            
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                position: function (point, params, dom) {
                      // 固定在左部
                    return [50, point[1]];
                }
            },
            toolbox:{
                show:true,
                feature: {
                    magicType: {
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    // dataView: {}
                },
                top:15,
                showTitle:true
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:50,
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
                    axisTick: {
                        alignWithLabel: true
                    },
                    data : time
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : data
        }
        if(this.chart){
            this.chart.clear();
        }
        var $chartContainer = $(this.container).find("#chartBox");
        var pWidth = $(this.container).width();
        $chartContainer.css('width',pWidth+'px');
        !this.chart && (this.chart = echarts.init($chartContainer[0], AppConfig.chartTheme));
        this.chart.setOption(option);
        this.spinner && this.spinner.stop();
    };

    ModalAppHistory.prototype.layoutStyle = function (points) {
        var _this = this;

        var $chartBox = $('<div id="chartBox" style="height:235px;"></div>');
        $chartBox.appendTo(this.container);

        var btnCtn = '<div class="switchBtnCtn">\
                            <div class="switch">\
                                <div class="circle"></div>\
                            </div>\
                            <button type="button" class="btn btn-default configBtn" i18n="toolBox.APP_HISTORY_QUERY.CONFIG_BTN"></button>\
                        </div>';
        $(btnCtn).appendTo(this.container);

        var $middlePointers = $('<div class="middlePointers gray-scrollbar"><div class="listDataBox"></div></div>');
        $middlePointers.appendTo(this.container);

        var $bottomBox = $('<div class="bottomBox" style="display:none;"></div>');
        $bottomBox.appendTo(this.container);
     //底部选择时间的容器
        var content = '<div id="bottomPoints">\
                    </div>\
                    <div id="bottomAppHistory">\
                        <div class="bottomAppHistoryTitle" i18n="toolBox.APP_HISTORY_QUERY.TITLE"></div>\
                        <span class="glyphicon glyphicon-remove closeBtn"></span>\
                        <div class="bottomAppHistoryContent">\
                            <div class="clearfix hisCommenBox">\
                                <div class="col-xs-4 hisCommen" i18n="toolBox.APP_HISTORY_QUERY.PERIOD">采样周期</div>\
                                <select class="col-xs-6 hisCommen" id="timePeriod" value="h1">\
                                    <option value="m5" i18n="toolBox.APP_HISTORY_QUERY.MINUTE">5分钟</option>\
                                    <option value="h1" i18n="toolBox.APP_HISTORY_QUERY.HOUR">1小时</option>\
                                    <option value="d1" i18n="toolBox.APP_HISTORY_QUERY.DAY">1天</option>\
                                    <option value="M1" i18n="toolBox.APP_HISTORY_QUERY.MONTH">1月</option>\
                                </select>\
                            </div>\
                            <div class="clearfix hisCommenBox">\
                                <div class="col-xs-4 hisCommen" i18n="toolBox.APP_HISTORY_QUERY.START_TIME">开始时间</div>\
                                <div class="input-append date col-xs-8">\
                                    <input id="datetimepickerStarts" class="form_datetime hisCommen" data-date="12-02-2012" type="text" readonly />\
                                    <span class="add-on"><i class="icon-th"></i></span>\
                                </div>\
                            </div>\
                            <div class="clearfix hisCommenBox">\
                                <div class="col-xs-4 hisCommen" i18n="toolBox.APP_HISTORY_QUERY.END_TIME">结束时间</div>\
                                <div class="input-append date col-xs-8">\
                                    <input id="datetimepickerEnds" class="form_datetime hisCommen" data-date="12-02-2012" type="text" readonly />\
                                    <span class="add-on"><i class="icon-th"></i></span>\
                                </div>\
                            </div>\
                            <div class="text-center">\
                                <button class="btnQuery" id="btnQuery"><span i18n="toolBox.APP_HISTORY_QUERY.SEARCH">查询</span></button>\
                            </div>\
                        </div>\
                    </div>';
        $(_this.container).find(".bottomBox").html(content);
        var nowDate = new Date();
        var endTime = nowDate.timeFormat(timeFormatChange('yyyy-mm-dd hh:00'));
        var startTime = nowDate.timeFormat(timeFormatChange("yyyy-mm-dd"))+' 00:00';
        var $datetimepickerStart = $(_this.container).find('#datetimepickerStarts');
        var $datetimepickerEnd = $(_this.container).find('#datetimepickerEnds');
        $datetimepickerStart.val(startTime);
        $datetimepickerEnd.val(endTime);

        $datetimepickerStart.datetimepicker({
            format: 'yyyy-mm-dd hh:00',
            pickerPosition: 'bottom-right',
            pickerReferer: 'input',
            startView: 2,
            minView: 2,
            autoclose: true,
            forceParse: false
        });
        $datetimepickerEnd.datetimepicker({
            format: 'yyyy-mm-dd hh:00',
            pickerPosition: 'bottom-right',
            pickerReferer: 'input',
            startView: 2,
            minView: 2,
            autoclose: true,
            forceParse: false
        });

        //拿到数据源的备注
        WebAPI.post('/analysis/datasource/getDsItemsById',points).done(function(result){
            for(var j=0,jLength=result.length;j<jLength;j++){
                var name = result[j].alias===''?result[j].value:result[j].alias;
                var singlePointer='<div class="singleContent activeSingle row" data-id='+result[j].id+'>\
                                        <div class="singleTitle col-xs-12">'+name+'</div>\
                                        <i class="iconfont icon-xuanze"></i>\
                                    </div>';
                
                $(singlePointer).appendTo($(_this.container).find(".listDataBox"));
                var obj={
                    id:result[j].id,
                    name:name
                }
                _this.echarShowName.push(obj);
            }
            var $allSingleContent = $(_this.container).find(".singleContent");
        })

    },
    ModalAppHistory.prototype.updateModal = function (){

    },
    ModalAppHistory.prototype.renderChart = function (id,startTime,endTime,tPeriod) {
        var _this = this;
        //当天
        var todayEndTime = new Date().format('yyyy-MM-dd HH:00:00');
        var todayStartTime = new Date().format("yyyy-MM-dd 00:00:00");

        var id = id === undefined?this.entity.modal.points:id;
        var startTime = startTime === undefined?todayStartTime:startTime;
        var endTime = endTime === undefined?todayEndTime:endTime;
        var tPeriod = tPeriod === undefined?'h1':tPeriod;
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            dsItemIds: id,
            timeStart: startTime,
            timeEnd: endTime,
            timeFormat: tPeriod
        }).done(function (dataSrc) {
            var dataArr = dataSrc.list;
            var time = dataSrc.timeShaft;
            var datas = [];
            for(var i=0,length=dataArr.length;i<length;i++){
                for(var j=0,jLength=_this.echarShowName.length;j<jLength;j++){
                    if(dataArr[i].dsItemId === _this.echarShowName[j].id){
                        var obj = {
                            name: _this.echarShowName[j].name,
                            type:'bar',
                            data:dataArr[i].data,
                            itemStyle: {
                                 normal: {
                                    barBorderRadius: [5, 5, 0, 0]
                                 }
                            }
                        }
                        var info = {
                            id:_this.echarShowName[j].id,
                            name:_this.echarShowName[j].name
                        }
                        _this.echarShowData.push(obj);
                        datas.push(obj);
                        _this.dataInfo.push(info);
                    }   
                }
            }
            _this.echarShowTime = time;
            _this.echarsShow(datas,_this.echarShowTime);
        })
    },
    ModalAppHistory.prototype.renderModal = function () {
        var idsArr = this.entity.modal.points;

        this.layoutStyle(idsArr);

        I18n.fillArea($('.springContent'));

        this.renderChart(idsArr);
    },
    
    ModalAppHistory.prototype.attachEvent = function () {
        var _this = this;
        //查询按钮
       $(this.container).off('click').on("click","#btnQuery",function () {
            var tPeriod = $(_this.container).find("#timePeriod").val();
            var startTime = $(_this.container).find("#datetimepickerStarts").val().toDate().timeFormat('yyyy-mm-dd hh:ii:ss');
            var endTime = $(_this.container).find("#datetimepickerEnds").val().toDate().timeFormat('yyyy-mm-dd hh:ii:ss');
            var idArr = [];
            $(_this.container).find('.singleContent.activeSingle').each(function(){
                idArr.push($(this).attr('data-id'));
            })
            _this.renderChart(idArr,startTime,endTime,tPeriod);
            $(_this.container).find('.bottomBox').hide();
        })
       //中间各项点击事件
        $(this.container).off('click.singleContent').on("click.singleContent",".singleContent",function () {
            var activeId = $(this).attr('data-id');
            var data=[],time=[];
            if($(this).hasClass('activeSingle')){//取消选中
                $(this).removeClass('activeSingle');
            }else{//选中
                $(this).addClass('activeSingle');
            }
            if ($(_this.container).find('.singleContent.activeSingle').length !== 0) {
                $(_this.container).find('.circle').css('margin-left','0px');
                $(_this.container).find('.circle').closest('.switch').css('background','#5a96f9');
            }else{
                $(_this.container).find('.circle').css('margin-left','25px');
                $(_this.container).find('.circle').closest('.switch').css('background','#cccccc');
            }
            $(_this.container).find('.singleContent.activeSingle').each(function(){
                var id = $(this).attr('data-id');
                _this.echarShowName
                for(var i=0,length=_this.dataInfo.length;i<length;i++){
                    if(id === _this.dataInfo[i].id){
                       data.push(_this.echarShowData[i]);
                    }
                }
            })
            _this.echarsShow(data,_this.echarShowTime);
        });
        //配置按钮 
        $(this.container).off('click.configBtn').on("click.configBtn",".configBtn",function () {
            $(_this.container).find('.bottomBox').show();
        });
        $(this.container).off('click.closeBtn').on("click.closeBtn",".closeBtn",function () {
            $(_this.container).find('.bottomBox').hide();
        });
        //点击开关
        $(this.container).off('click.circle').on('click.circle','.circle',function(){
            if($(this).css('margin-left') === '0px'){
                $(this).css('margin-left','25px');
                $(this).closest('.switch').css('background','#cccccc');

                $(_this.container).find('.singleContent').removeClass('activeSingle');
                _this.echarsShow([],_this.echarShowTime);
            }else{
                $(this).css('margin-left','0px');
                $(this).closest('.switch').css('background','#5a96f9');

                $(_this.container).find('.singleContent').addClass('activeSingle');
                _this.echarsShow(_this.echarShowData,_this.echarShowTime);
            }
        })
    },

    ModalAppHistory.prototype.showConfigMode = function () {

    },

    ModalAppHistory.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.interval = 5;
    };

    return ModalAppHistory;
})();
/*app history end  */
/*APP Diagnostic Ranking start*/
var ModalAppDiagRanking = (function(){
    function ModalAppDiagRanking(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
    };
    ModalAppDiagRanking.prototype = new ModalBase();

    ModalAppDiagRanking.prototype.optionTemplate = {
        name: 'toolBox.modal.APP_DIAGNOSTIC_RANKING',
        parent:3,
        mode: ['appDiagRanking'],
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalAppDiagRanking',
        scroll:false,
        tooltip: {
            'imgPC': true,
            'imgMobile': true,
            'isSpecData':true,
            'desc': '#DiagStatics'
        }
    };

    ModalAppDiagRanking.prototype.optionDefault = {
        
    };
    ModalAppDiagRanking.prototype.updateModal = function (points) {
        l
    },
    ModalAppDiagRanking.prototype.renderModal = function () {
        var _this =this;
        var dsItemIds = this.entity.modal.points;
        var diagType = this.entity.modal.option.diagType?this.entity.modal.option.diagType:'fault';
        var rankName;
        if(diagType==='equipment'){//设备
            rankName = I18n.resource.modalConfig.modalApp.EQUIPMENT_NAME;
        }else if(diagType==='zone'){
            rankName = I18n.resource.modalConfig.modalApp.ZONE_NAME;
        }else{
            rankName = I18n.resource.modalConfig.modalApp.FAULT_NAME;
        }
        var str = '<div class=" diagnosisBg gray-scrollbar scrollY"><table class="diagRanking" data-type="'+diagType+'">\
                        <thead class="bgColorTemp2 diagnosisThead">\
                            <tr>\
                                <th width="15%" title="'+I18n.resource.modalConfig.modalApp.RANKING+'">'+I18n.resource.modalConfig.modalApp.RANKING+'</th>\
                                <th title="'+rankName+'">'+rankName+'</th>\
                                <th title="'+I18n.resource.modalConfig.modalApp.MOTH_TIME+'">'+I18n.resource.modalConfig.modalApp.TIMES+'</th>\
                                <th title="'+I18n.resource.modalConfig.modalApp.AVE_DURATION+'">'+I18n.resource.modalConfig.modalApp.DURATION+'</th>\
                            </tr>\
                        </thead>\
                        <tbody>\
                        </tbody>\
                    </table><div>';
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart',{dsItemIds: dsItemIds}).done(function(result){
            if($(_this.container).find(".alertError") || $(_this.container).find(".diagRanking")){
                $(_this.container).find(".alertError").remove();
                $(_this.container).find(".diagRanking").remove();
            }   
            $(_this.container).append($(str));
            var dataArr = result.dsItemList;
            if(result.dsItemList[0].data.indexOf('MonthRankList') !== -1){
                var data = JSON.parse(result.dsItemList[0].data).MonthRankList;
                for(var j=0,jLength=data.length;j<jLength;j++){
                    var sonContent = '<tr class="diagnosisTr borderColorTemp3 diagnosisStyle">\
                                    <td>'+(j+1)+'</td>\
                                    <td class="disgnosisName">'+data[j].name+'</td>\
                                    <td>'+data[j].count+'</td>\
                                    <td>'+data[j].timespan+'</td>\
                                </tr>';
                    $(_this.container).find(".diagRanking").find("tbody").append($(sonContent));
                }
                _this.spinner && _this.spinner.stop();
                $(_this.container).find('.diagnosisTr').off('click').click(function(){
                    var faultName = $(this).find('.disgnosisName').text().trim();
                    var diagType = $(this).parents('table.diagRanking').attr('data-type');
                    var faultInfos ={};
                    var postData = {
                        value:faultName,
                        type:diagType,
                        //faultName:faultName,
                        startTime: new Date(new Date().valueOf()-86400000*7).format('yyyy-MM-dd ')+'00:00:00',
                        endTime: new Date().format('yyyy-MM-dd HH:mm:ss'),
                        projId: AppConfig.projectId
                    }
                    if($(_this.container).parents('.indexContent').length === 0){
                        Spinner.spin($(_this.container)[0]);
                        var containerScreen = $(_this.container).closest('.html-layer');
                    }else{
                        Spinner.spin($(_this.container).parents('.indexContent')[0]);
                        var containerScreen = $(_this.container).parents('.indexContent');
                    }
                    WebAPI.post('/diagnosis/getFaultDetails',postData).done(function(faultDetail){
                        var faultDetailData = faultDetail.data;
                        faultInfos['faultName'] = faultName;
                        faultInfos['faultDetailData'] = faultDetailData;
                        faultInfos['containerScreen'] = containerScreen;
                        faultInfos['diagType'] = diagType;
                        new DiagnosisInfo().show(faultInfos);
                    })
                });
            }else{
                var alertError = '<div class="alertError" style="width:40%;height:12%;position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;z-index:1200;background:#eee;color:#aaa;border-radius:6px;padding:10px;">所填数据点的格式不符合该控件所需的数据格式</div></div>'
                $(_this.container).append($(alertError))
            }
        })
    },
    ModalAppDiagRanking.prototype.attachEvent = function () {
       
    },
    ModalAppDiagRanking.prototype.showConfigMode = function () {

    },
    ModalAppDiagRanking.prototype.setModalOption = function (option) {
        this.entity.modal.option.diagType = option.diagType;
    };

    return ModalAppDiagRanking;
})()
/*APP Diagnostic Ranking end*/
/*APP Month History start*/
var ModalAPPMonthHistory = (function(){
    function ModalAPPMonthHistory(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.entityOption = entityParams.modal.option;
        this.dsItems = undefined;

        this.layout();
        this.attachEvent();
    };
    ModalAPPMonthHistory.prototype = new ModalBase();

    ModalAPPMonthHistory.prototype.optionTemplate = {
        name: 'toolBox.modal.APP_MONTH_HISTORY_QUERY',
        parent:3,
        mode: ['appMonthHistory'],
        maxNum: 1,
        title:'',
        minHeight:2.5,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalAPPMonthHistory',
        tooltip: {
            'imgPC': false,
            'imgMobile': true,
            'isSpecData':false,
            'desc': ''
        }
    };

    ModalAPPMonthHistory.prototype.optionDefault = {
        title:{
            left:'center',
            textStyle:{
                color:'#000000'
            }
        },
        // color: ['rgb(194,53,49)'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            backgroundColor:'rgba(0,0,0,0.6)',
            textStyle:{
                color:'#ffffff'
            }
        },
        legend:{
            data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '4%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : []
    };
    ModalAPPMonthHistory.prototype.updateModal = function (points) {
        
    },
    ModalAPPMonthHistory.prototype.layout = function () {
        var showMonth = '<div id="topMonthShow" style="height:9%">\
                            <div class="col-xs-4 leftButton">\
                                <span class="glyphicon glyphicon-arrow-left"></span>\
                            </div>\
                            <div class="col-xs-4 month">\
                            </div>\
                            <div class="col-xs-4 rightButton">\
                                <span class="glyphicon glyphicon-arrow-right"></span>\
                            </div>\
                        </div>';
        var chartContainer = '<div id="chartContainer" style="height:91%"></div>';
        $(this.container).append(showMonth);
        $(this.container).append(chartContainer);
    },
    ModalAPPMonthHistory.prototype.getDsItemsById = function () {
        var ids = this.entity.modal.points;
        var _this = this;
        WebAPI.post('/analysis/datasource/getDsItemsById',ids).done(function(result){
            _this.dsItems = result;
        });;
    },
    ModalAPPMonthHistory.prototype.renderModal = function (start,end,month) {
        this.getDsItemsById();
        //显示的上一个月的数据
        var nowYear = Number(new Date().format("yyyy"));
        var nowMonth = Number(new Date().format('yyyy-MM-dd').split("-")[1]);
        var showYear,showMonth,startTime,endTime;
        if(1 < nowMonth&&nowMonth <= 10){
            showYear = nowYear;
            showMonth = '0'+(nowMonth - 1);
        }else if(10 < nowMonth && nowMonth <= 12){
            showYear = nowYear;
            showMonth = nowMonth - 1;
        }else if(nowMonth === 1){//就显示上一年12月份的时间
            showYear= nowYear - 1;
            showMonth = 12;
        }
        startTime = new Date().format(showYear+"-"+showMonth+"-01 00:00:00");
        var days = DateUtil.daysInMonth(new Date(startTime));
        endTime = new Date().format(showYear+"-"+showMonth+"-"+days+" 23:59:59");
        //日期显示上一个月的
        var topMonth = month === undefined?showMonth:month;
        $(this.container).find(".month").html(topMonth+" 月");
        //传送的数据
        var id = this.entity.modal.points;
        var tPeriod = 'd1';
        var timeStart = start === undefined?startTime:start;
        var timeEnd = end === undefined?endTime:end;

        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            dsItemIds: id,
            timeStart: timeStart,
            timeEnd: timeEnd,
            timeFormat: tPeriod
        }).done(function (result) {
            this.optionDefault.xAxis[0].data = [];
            this.optionDefault.series = [];
            this.optionDefault.title.text = [];
            this.optionDefault.legend.data = [];
            var dataList = result.list;
            var timeData = result.timeShaft;
            var timeArr = [];
            var datas = [];
            var ids = [];
            var obj = {
                name:'1',
                type:'bar',
                data:[]
            }
            for(var i=0,length=dataList.length;i<length;i++){
                datas.push(dataList[i].data);
                ids.push(dataList[i].dsItemId);
            }
            for(var j=0,jLength=datas.length;j<jLength;j++){
                for(var k=0,kLength=this.dsItems.length;k<kLength;k++){
                    if(this.dsItems[k].id === ids[j]){
                        obj.data = datas[j];
                        obj.name = this.dsItems[k].alias;
                        this.optionDefault.series.push(obj);
                        this.optionDefault.title.text = this.dsItems[k].alias;
                        this.optionDefault.legend.data.push(this.dsItems[k].alias);
                    }
                }
            }
            for(var t=0,tLength=timeData.length;t<tLength;t++){
                timeArr.push(timeData[t].split(" ")[0].split("-")[2])
            }

            this.optionDefault.xAxis[0].data = timeArr;

            
            var $chartContainer = $(this.container).find("#chartContainer");
            !this.chart && (this.chart = echarts.init($chartContainer[0], AppConfig.chartTheme));
            this.chart.setOption(this.optionDefault);
            this.spinner && this.spinner.stop();
        }.bind(this))
    },
    ModalAPPMonthHistory.prototype.attachEvent = function () {
        var _this = this;
        var leftCount = 0,rightCount = 0;
        var nowYear = Number(new Date().format("yyyy"));
        var current;
        $(this.container).find(".leftButton").click(function(){
            leftCount = leftCount+1;
            if(leftCount === 1){
                current = Number($(_this.container).find(".month").html().split(" ")[0]);//当前显示的
            }
            var value = (leftCount-current)/12;
            var yearNums,showYear,showMonth;
            if(value > 0){
                yearNums = parseInt(value)+1;
            }else if(value === 0){
                yearNums = 1;
            }else{
                yearNums = 0;
            }
            
            showYear = nowYear - yearNums;

            var showCurrentMonth = Number($(_this.container).find(".month").html().split(" ")[0]);//点击时 显示的时间
            if(1 < showCurrentMonth&&showCurrentMonth <= 10){
                showMonth = '0'+(showCurrentMonth - 1);
            }else if(10 < showCurrentMonth && showCurrentMonth <= 12){
                showMonth = showCurrentMonth - 1;
            }else if(showCurrentMonth === 1){//就显示上一年12月份的时间
                showMonth = 12;
            }
            $(_this.container).find(".month").html(showMonth);
            timeStart = new Date().format(showYear+"-"+showMonth+"-01 00:00:00");
            var days = DateUtil.daysInMonth(new Date(timeStart));
            timeEnd = new Date().format(showYear+"-"+showMonth+"-"+days+" 23:59:59");
            _this.renderModal(timeStart,timeEnd,showMonth);
        })
        $(this.container).find(".rightButton").click(function(){
            rightCount = rightCount+1;
            if(rightCount === 1){
                current = Number($(_this.container).find(".month").html().split(" ")[0]);//当前显示的
            }
            var value = (rightCount-(12-current))/12;
            var yearNums,showYear,showMonth;
            if(value > 0){
                yearNums = parseInt(value)+1;
            }else if(value === 0){
                yearNums = 1;
            }else{
                yearNums = 0;
            }
            showYear = nowYear - yearNums;

            var showCurrentMonth = Number($(_this.container).find(".month").html().split(" ")[0]);//点击时 显示的时间
            if(showCurrentMonth>=1&&showCurrentMonth < 9){
                showMonth = '0'+(showCurrentMonth + 1);
            }else if(showCurrentMonth >= 9){
                showMonth = showCurrentMonth + 1;
            }else if(showCurrentMonth === 12){//就显示上一年12月份的时间
                showMonth = '01';
            }
            $(_this.container).find(".month").html(showMonth);
            timeStart = new Date().format(showYear+"-"+showMonth+"-01 00:00:00");
            var days = DateUtil.daysInMonth(new Date(timeStart));
            timeEnd = new Date().format(showYear+"-"+showMonth+"-"+days+" 23:59:59");
            _this.renderModal(timeStart,timeEnd,showMonth);
        })
    },
    ModalAPPMonthHistory.prototype.showConfigMode = function () {

    },
    ModalAPPMonthHistory.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
    };

    return ModalAPPMonthHistory;
})()
/*APP APP Month History end*/
/*app 百叶窗*/
var ModalAppBlind = (function(){

    function ModalAppBlind(screen, entityParams) {
        if (!screen) return;
        if (!entityParams) return;
        this.screen = screen;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        this.tempOpt = undefined;
    };
    ModalAppBlind.prototype = new ModalBase();
    ModalAppBlind.prototype.optionTemplate = {
        name: 'toolBox.modal.APP_BLIND',
        parent: 3,//图例的父级的index如
        mode: ['appGauge'],
        maxNum: 10,
        title: '',
        //defaultHeight: 4.5,
        //defaultWidth: 3,
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 3,
        type: 'ModalAppBlind',
        scroll:false,
        tooltip: {
            'imgPC': false,
            'imgMobile': true,
            'isSpecData':false,
            'desc': ''
        }
    };
    ModalAppBlind.prototype.show = function(){
        this.init();
    }
    ModalAppBlind.prototype.init = function(){
        this.container.style.overflowX = 'hidden';
        this.container.style.overflowY = 'auto';
    }
    ModalAppBlind.prototype.renderModal = function (){
        var _this = this;
        //兼容数据
        if(this.entity.modal.option && this.entity.modal.option instanceof Array){
            var arrItem = this.entity.modal.option;
            this.entity.modal.option = {};
            this.entity.modal.option.arrItem = arrItem;
        }
        var blindOpt = undefined;
        _this.entity.modal.option && (blindOpt = _this.entity.modal.option.arrItem);

        if(!blindOpt||blindOpt.length===0) return;
        var $currentContainer = $(_this.container);
        var blindDivBox = '<div id="blindDivBox" class="gray-scrollbar"></div>';
        $currentContainer.append(blindDivBox);
        var $blindDivBox = $currentContainer.find('#blindDivBox');
        //去除重复的id
        function unique(arr) {
              var result = [], isRepeated;
              for (var i = 0, len = arr.length; i < len; i++) {
                  isRepeated = false;
                  for (var j = 0, len1 = result.length; j < len1; j++) {
                      if (arr[i].id === result[j].id) {
                          isRepeated = true;
                          break;
                      }
                 }
                 if (!isRepeated) {
                     result.push(arr[i]);
                 }
             }
             return result;
        }
        for(var m = 0;m<blindOpt.length;m++){
            var isExist = false;
            var classNameFlag;
            if(m%2 ===0){
                classNameFlag = 'blindContainerOdd';
            }else{
                classNameFlag = 'blindContainerEven';
            }
            for (var i = 0, item; i < _this.screen.store.layout.length; i++) {
                $currentContainer.css({ 'display': 'flex', 'overflow-y': 'hidden', 'flex-flow': 'wrap' });
                var currentLayout = _this.screen.store.layout[i];
                currentLayout = unique(currentLayout);
                for (var j = 0; j < currentLayout.length; j++) {
                    item = currentLayout[j];
                    if (blindOpt[m].subChartIds[0].id != item.id) continue;
                    isExist = true;
                    var modelClass, entity;
                    var blindContainerSin = '<div class="blindContainerSin '+classNameFlag+'">\
                                        <div class="blindConTitle bgColorTemp1 borderColorTemp1 blindConTitleCover" style="border-radius:0"><!--<span class="glyphicon glyphicon-align-justify" style="color:#ca2929;padding-right:10px;"></span>-->'+blindOpt[m].blindTitle+'<span class="iconfont icon-xiala rotArrow" style="display:block;float:right;margin-right:10px;font-size: 12px;"></span></div>\
                                        <div class="blindConContent gray-scrollbar blindConContentCover" style="width:100%;overflow-y:auto"></div>\
                                    </div>';
                    $blindDivBox.append(blindContainerSin);
                    $currentContainer.find('.blindConTitle').off('click').click(function(){
                        var $this = $(this);
                        if($this.siblings('.blindConContent').hasClass('showSibling')) return;
                        $currentContainer.find('.blindConContent').removeClass('showSibling').hide();
                        $currentContainer.find('.rotArrow').removeClass('rotArrowCur');
                        $this.find('.rotArrow').addClass('rotArrowCur');
                        $this.siblings('.blindConContent').addClass('showSibling').show().css({maxHeight: $blindDivBox.parent().height() - $('.blindContainerSin',$currentContainer).length*$('.blindContainerSin',$currentContainer).height()});
                    });
                    if (item.modal.type && item.modal.type != 'ModalNone') {
                        //regist IoC
                        modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                        if (!modelClass) continue;
                        if (item.isNotRender && _this.entity.modal.type == 'ModalAppBlind') {
                            //_this.screen.container = document.getElementById('divContainer_' + _this.entity.id);
                            item.scroll = false;
                            entity = new modelClass(_this, item);
                            _this.screen.listEntity[item.id] = entity;
                            if(item.modal.type==='ModalAppButton'){
                                entity.container.style.overflowY  = "auto";
                                entity.render();
                                var $currentBlindCon = $blindDivBox.find('.blindContainerSin').eq(m).children('.blindConContent');
                                $currentBlindCon.height($currentContainer.children('.springContainer').height());
                                $currentBlindCon.append($currentContainer.children('.springContainer'));
                                continue;
                            }
                            if ($.inArray(item.id, _this.screen.arrEntityOrder) < 0) {
                                _this.screen.arrEntityOrder.push(item.id);
                            }
                            if (item.modal.interval && item.modal.interval >= 0) {
                                for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                                    point = item.modal.points[k];
                                    if (_this.screen.requestPoints.indexOf(point) < 0) {
                                        _this.screen.requestPoints.push(point);
                                    }
                                }
                            }
                            if (item.modal.popId) {
                                if (!_this.screen.dictPopToEntity[item.modal.popId]) _this.screen.dictPopToEntity[item.modal.popId] = [];
                                _this.screen.dictPopToEntity[item.modal.popId].push(item.id);
                                if (_this.screen.requestPoints.indexOf(item.modal.popId) < 0) {
                                    _this.screen.requestPoints.push(item.modal.popId);
                                }
                            }
                            if(entity.optionTemplate.scroll !== false) {
                                //设置echart的高度
                                if (AppConfig.isMobile) {
                                    entity.container.style.height = ElScreenContainer.offsetHeight * entity.entity.spanR * 2/9  + 'px';
                                } else {
                                    entity.container.style.height = $blindDivBox.height() * entity.entity.spanR/6 + 'px';
                                }
                            }
                            entity.container.style.width = $(entity.container).parent().parent('.springContainer').width()+'px';
                            entity.container.style.overflowY  = "auto";
                            entity.render();
                        }
                    } else if (item.modal.type == 'ModalNone') {
                        modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                        //_this.screen.container = $('#divContainer_' + _this.entity.id).find('.springContent')[0];
                        entity = new modelClass(_this, item);
                        _this.screen.listEntity[item.id] = entity;
                        _this.screen.arrEntityOrder.push(item.id);
                        entity.render();
                        _this.screen.isForReport && entity.configure();
                    }

                    var $currentBlindCon = $blindDivBox.find('.blindContainerSin').eq(m).children('.blindConContent');
                    if(entity.optionTemplate.scroll !== false) {
                        if (!AppConfig.isMobile) {
                            $currentBlindCon.height($currentContainer.children('.springContainer').height());
                        }
                    }
                    $currentBlindCon.append($currentContainer.children('.springContainer'));
                }
            }
        }
        $currentContainer.find('#blindDivBox').find('.blindContainerSin:first-child .rotArrow').addClass('rotArrowCur');
        $currentContainer.find('#blindDivBox').find('.blindContainerSin').find('.blindConContent').hide();
        $currentContainer.find('#blindDivBox').find('.blindContainerSin:first-child').find('.blindConContent').addClass('showSibling').show();
        Spinner&&Spinner.stop();
    }
    ModalAppBlind.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    }
    ModalAppBlind.prototype.configureModalNone = function($chartsCt,opt){
        //创建一个modalNone
        var spanC = 12, spanR = 3;
        //height width 和最后一个节点一样
        //if ($chartsCt.children().length > 0) {
        //    //return;
        //    var lastDiv = $chartsCt.children()[$chartsCt.children().length - 1];
        //    spanC = Math.round(parseInt(lastDiv.style.width.split('%')[0]) / 10) * 12 / 10;
        //    spanR = Math.round(parseInt(lastDiv.style.height.split('%')[0]) / 10) * 6 / 10;
        //}


        if (!this.container.classList.contains('chartsCt')) { 
            this.container = this.container.parentElement.getElementsByClassName('chartsCt')[0];
        }
        var entity = new ModalNone(this, {
            id: (+new Date()).toString(),
            spanC: spanC,
            spanR: spanR,
            modal: {type: "ModalNone"},
            isNotRender: true
        });
        this.screen.arrEntityOrder.push(entity.entity.id);
        this.screen.listEntity[entity.entity.id] = entity;


        opt.subChartIds = new Array();
        opt.subChartIds.push({id: entity.entity.id});
        entity.render();
        entity.configure();
        this.entity.modal = this.tempOpt;
    }
    ModalAppBlind.prototype.showConfigMode = function(){

    }
    ModalAppBlind.prototype.configure = function () {
        var _this = this;
        if(this.spinner) this.spinner.stop();
        if (this.chart) this.chart.clear();
        this.divResizeByMouseInit();

        //更改数据结构option原来是数组,改为对象
        if(this.entity.modal.option && this.entity.modal.option instanceof Array){
            var arrItem = this.entity.modal.option;
            this.entity.modal.option = {};
            this.entity.modal.option.arrItem = arrItem;
        }

        var divMask = document.createElement('div');
        divMask.className = 'springConfigMask';
        divMask.draggable = 'true';

        var btnRemove = document.createElement('span');
        btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
        btnRemove.title = 'Remove';
        btnRemove.onclick = function (e) {
            confirm('Are you sure you want to delete it ?', function () {
                if (_this.chart) _this.chart.clear();
                _this.tempOpt = _this.tempOpt?_this.tempOpt:_this.entity.modal;
                if(_this.tempOpt.option && _this.tempOpt.option.arrItem && _this.tempOpt.option.arrItem.length>0){
                    //先删除百叶窗内部子元素
                    for(var i = 0;i<_this.tempOpt.option.arrItem.length;i++){
                        for(var j = 0;j<_this.screen.arrEntityOrder.length;j++){
                            if(_this.tempOpt.option.arrItem[i].subChartIds.length===0) continue;
                            if(_this.tempOpt.option.arrItem[i].subChartIds[0].id===_this.screen.arrEntityOrder[j]){
                                _this.screen.removeEntity(_this.screen.arrEntityOrder[j]);
                            }
                        }
                    }
                    _this.tempOpt.option = [];
                }
                var oldIndex = _this.screen.arrEntityOrder.indexOf(_this.entity.id);
                _this.screen.removeEntity(_this.entity.id);

                //重新生成窗口
                var entity = new ModalNone(_this.screen, {
                    id: _this.entity.id,
                    spanC: _this.entity.spanC,
                    spanR: _this.entity.spanR,
                    modal: {type:"ModalNone"}
                }, _this.entity.id);
                _this.screen.arrEntityOrder.splice(oldIndex,0,entity.entity.id);
                _this.screen.listEntity[entity.entity.id] = entity;
                entity.render();
                entity.configure();
                entity.hasEdit = true;
                //_this = null;
            })
            
        };
        divMask.appendChild(btnRemove);
        //install button for mix
        var btnInstall = document.createElement('span');
        btnInstall.className = 'glyphicon glyphicon-cog springBlindConfigInstallBtn grow';
        btnInstall.title = 'config';
        
        //配置按钮
        btnInstall.onclick = function (e) {
            _this.showConfigModal();
        }
        divMask.appendChild(btnInstall);


        var btnHeightResize = document.createElement('div');
        var maxHeight = this.optionTemplate.maxHeight;
        var maxWidth = this.optionTemplate.maxWidth;
        var minHeight = this.optionTemplate.minHeight;
        var minWidth = this.optionTemplate.minWidth;
        btnHeightResize.className = 'divResize divHeightResize';
        btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
        '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanR + ' /6</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
        divMask.appendChild(btnHeightResize);
        var btnWidthResize = document.createElement('div');
        btnWidthResize.className = 'divResize divWidthResize';
        btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
        '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanC + ' /3</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
        divMask.appendChild(btnWidthResize);
        var divTitleAndType = document.createElement('div');
        divTitleAndType.className = 'divTitleAndType';
        divMask.appendChild(divTitleAndType);

        //chartCt
        var $chartCt = $('<div class="divResize chartsCt gray-scrollbar">');
        divMask.appendChild($chartCt[0]);


        var $divTitle = $('<div class="divResize chartTitle">');
        var $labelTitle = $('<label for="title">').text(I18n.resource.dashboard.show.TITLE);
        var inputChartTitle = document.createElement('input');
        inputChartTitle.id = 'title';
        inputChartTitle.className = 'form-control';
        inputChartTitle.value = this.entity.modal.title;
        inputChartTitle.setAttribute('placeholder',I18n.resource.dashboard.show.TITLE_TIP);
        if(this.entity.modal.title != ''){
            inputChartTitle.style.display = 'none';
                    }
        inputChartTitle.setAttribute('type','text');
        $divTitle.append($labelTitle).append($(inputChartTitle));
        divTitleAndType.appendChild($divTitle[0]);

        var $divType = $('<div class="divResize chartType">');
        var $labelType = $('<label>').text(I18n.resource.dashboard.show.TYPE);
        var chartType = document.createElement('span');
        chartType.innerHTML = I18n.findContent(this.optionTemplate.name);
        $divType.append($labelType).append($(chartType));
        divTitleAndType.appendChild($divType[0]);



        var chartTitleShow = document.createElement('p');
        chartTitleShow.innerHTML = inputChartTitle.value;
        chartTitleShow.className = 'chartTitleShow';
        $divTitle[0].appendChild(chartTitleShow);
        if(this.entity.modal.title == '' || this.entity.modal.title == undefined){
            chartTitleShow.style.display = 'none';
                }
        chartTitleShow.onclick = function(){
            chartTitleShow.style.display = 'none';
            inputChartTitle.style.display = 'inline-block';
            inputChartTitle.focus();
        };
        inputChartTitle.onblur = function(){
            if (inputChartTitle.value != ''){
                inputChartTitle.style.display = 'none';
                chartTitleShow.style.display = 'inline';
            }
            chartTitleShow.innerHTML = inputChartTitle.value;
            _this.entity.modal.title = inputChartTitle.value;
        };


        this.container.parentNode.appendChild(divMask);
        this.divResizeByToolInit();

        //drag event of replacing entity
        divMask.ondragstart = function (e) {
            //e.preventDefault();
            e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
        };
        divMask.ondragover = function (e) {
            e.preventDefault();
        };
        divMask.ondragleave = function (e) {
            e.preventDefault();
        };
        this.showConfigMode();
    }
    ModalAppBlind.prototype.attBlindEvent = function(){
        //标题框失去焦点事件
        var _this = this;
        $('.blindNameEnter').off('blur').blur(function(){
            var $this = $(this);
            var currentTitle = $this.val().trim();
            if(currentTitle ==='') return;
            var $currentBlind = $this.parents('.divBlind');
            $this.hide();
            $this.siblings('.blindNameShow').text(currentTitle).css('display','inline-block');
            var index = $('.divBlind').index($currentBlind);
            _this.tempOpt.option.arrItem[index].blindTitle = currentTitle;
        });
        $('.blindNameShow').off('click').click(function(){
            var $this = $(this);
            var currentTitle = $this.text();
            $this.hide();
            $this.siblings('.blindNameEnter').val(currentTitle).css('display','inline-block').focus();
        });
        $('.deleteBlind').off('click').click(function(){
            var $this = $(this);
            var $parents =  $this.parents('.divBlind');
            var parentId = $parents.attr('data-id');
            for(var i = 0;i<_this.tempOpt.option.arrItem.length;i++){
                var currentOpt ;
                if(_this.tempOpt.option.arrItem[i].domDataId.toString()===parentId){
                    currentOpt = _this.tempOpt.option.arrItem[i];
                    if(currentOpt&&currentOpt.subChartIds.length!==0){
                        for(var j = 0;j<_this.screen.arrEntityOrder.length;j++ ){
                            if(currentOpt.subChartIds[0].id===_this.screen.arrEntityOrder[j]){
                                //处理modalNone的情况
                                var isNotModalNone = false;
                                if($('#divContainer_'+_this.screen.arrEntityOrder[j]).length>0&&$('#divContainer_'+_this.screen.arrEntityOrder[j]).find('.divTitleAndType').length>0){
                                    isNotModalNone = true;
                                }
                                if(!isNotModalNone){
                                    if (_this.chart) _this.chart.clear();
                                    _this.tempOpt.option.arrItem.splice(i,1);
                                    $parents.empty().remove();
                                    i = i-1;
                                }
                                var num = i;
                                $('#divContainer_'+_this.screen.arrEntityOrder[j]).find('span.springConfigRemoveBtn').trigger('click',callback);
                                function callback(isDelete){
                                    if(isDelete){
                                        if (_this.chart) _this.chart.clear();
                                        _this.tempOpt.option.arrItem.splice(num,1);
                                        $parents.empty().remove();
                                    }
                                }
                            }
                        }
                    }else{
                        _this.tempOpt.option.arrItem.splice(i,1);
                        $parents.empty().remove();
                        i = i-1;
                    }
                }
            }
            _this.entity.modal.option = _this.tempOpt.option;
        });
    }
    ModalAppBlind.prototype.createDivBlind = function(opt){
        var divBlind = document.createElement('div');
        divBlind.className = 'divBlind';
        if(opt&&opt.domDataId){
            divBlind.setAttribute('data-id',opt.domDataId);
        }else{
           var nowValue = new Date().valueOf();
            divBlind.setAttribute('data-id',nowValue);
        }
        var $divBlind = $(divBlind);

        divBlind.innerHTML =
            '<label class="blindName">标题：</label>\
            <span class="blindNameShow"></span>\
            <input type="text" class="blindNameEnter"/>\
            <span class="deleteBlind glyphicon glyphicon-remove-circle"></span>\
            ';
        //当有数据时填充数据
        if(opt&&opt.blindTitle){
            $divBlind.find('.blindNameShow').text(opt.blindTitle).css('display','inline-block');
            $divBlind.find('.blindNameEnter').hide();
        }
        if(!opt){
            if(!this.tempOpt.option){
                this.tempOpt.option = {};
                this.tempOpt.option.arrItem = [];
            }else if(this.tempOpt.option instanceof Array){//为了兼容老数据
                var arrItem = this.tempOpt.option;
                this.tempOpt.option = {};
                this.tempOpt.option.arrItem = arrItem;
            }
            this.tempOpt.option.arrItem.push(
                {
                    id: '',
                    domDataId:nowValue,
                    title: '',
                    blindTitle: '',
                    modalType: '',
                    subChartIds: []
                })
    };
        return divBlind;
    }
    ModalAppBlind.prototype.showConfigModal = function(){
        var _this = this;
        var $blindChartShow = $('#blindChartShow');
        $blindChartShow.empty().remove();
        if ($blindChartShow.length===0) {
            $blindChartShow = $('<div class="modal fade" id="blindChartShow"></div>');
        }
        $('#paneContent').append($blindChartShow);
        var blindChartCon = '<div class="modal-dialog"><div class="modal-content">' +
                            '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title">APP百叶窗</h4><span class="glyphicon glyphicon-plus-sign blindAddBtn grow" style=""></span></div>' +
                            '<div class="modal-body gray-scrollbar">' +
                            '</div>' +
                            '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" id="btnBlindListShow">确定</button></div>' +
                            '</div></div>';
        $blindChartShow.append(blindChartCon);
        _this.tempOpt =_this.tempOpt?_this.tempOpt: $.extend(true, {}, _this.entity.modal);
        $blindChartShow.find('.modal-body').html('<div class="row" style="margin:15px 0;">\
                        <div class="col-xs-3">背景颜色</div>\
                        <div class="col-xs-2">\
                        <select id="selBgColor">\
                        <option value="transparent">无</option>\
                        <option value="#ffffff">白</option>\
                        <option value="#000000">黑</option>\
                        <option value="#337ab7">蓝</option>\
                        <option value="#5cb85c">绿</option>\
                        <option value="custom">自定义</option>\
                        </select>\
                        </div>\
                        <div class="col-xs-2"><input type="input" id="iptBgColor" placeholder="#ffffff" style="width:60px;display:none;"/></div>\
                        <div class="col-xs-2"><input type="color" class="" id="bgColorView" style="display:none;"/></div>\
                        </div>');
        if(!_this.tempOpt.option || !_this.tempOpt.option.arrItem || _this.tempOpt.option.arrItem.length===0) {
            $blindChartShow.find('.modal-body').append(_this.createDivBlind());
        }else{
            for (var i = 0; i < _this.tempOpt.option.arrItem.length; i++) {
                var item = _this.tempOpt.option.arrItem[i];
                var isExist = false;
                for (var j in _this.screen.listEntity) {
                    if(item.subChartIds.length===0){continue;}
                    if (item.subChartIds[0].id === j) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    _this.tempOpt.option.arrItem.splice(i, 1);
                    i = i-1;
                } else {
                    $blindChartShow.find('.modal-body').append(_this.createDivBlind(_this.tempOpt.option.arrItem[i]));
                }
            }
        }
        $blindChartShow.modal('show');
        $blindChartShow.find('.blindAddBtn').off('click').click(function(e){
            $blindChartShow.find('.modal-body').append(_this.createDivBlind());
            _this.attBlindEvent();
        });
        _this.attBlindEvent();

        var $iptBgColor = $('#iptBgColor', $blindChartShow);
        var $bgColorView = $('#bgColorView', $blindChartShow);
        var $selBgColor = $('#selBgColor', $blindChartShow);
        //确定按钮
        $('#btnBlindListShow').off('click').click(function(){
            var opts = _this.tempOpt.option.arrItem;
            if(opts) {
                var $chartsCt = _this.container.classList.contains('chartsCt') ? $(_this.container) : $(_this.container).siblings().find('.chartsCt');
                if (opts[0].subChartIds.length === 0) {
                    $chartsCt.children().empty().remove();
                    for (var i = 0; i < opts.length; i++) {
                        _this.configureModalNone($chartsCt,opts[i]);
                    }
                }else {
                    var $containerChartsCt = $(_this.container);
                    if(_this.screen.arrEntityOrder.length===1){
                        _this.tempOpt.option = [];
                        return;
                    }
                    for (var i = 0; i <opts.length; i++){
                        var isExist = false;
                        var currentOption =$containerChartsCt.children('.springContainer').length>0?$containerChartsCt.children('.springContainer'): $containerChartsCt.siblings('.springConfigMask').find('.chartsCt').find('.springContainer') ;
                        for (var j = 0; j <  currentOption.length; j++) {
                            var currentId = currentOption[j].id.split('_')[1];
                            if(opts[i].subChartIds.length!==0) {
                                if (currentId === opts[i].subChartIds[0].id) {
                                    isExist = true;
                                    continue;
                                }
                            }
                        }
                        if(!isExist){
                            _this.configureModalNone($chartsCt,opts[i]);
                        }
                    }
                }
                _this.entity.modal.option.bgColor = $iptBgColor.val();//背景颜色
            }
        });

        _this.entity.modal.option && setShow(_this.entity.modal.option.bgColor);

        $selBgColor.off('change').on('change', function(e){
            setShow(this.value,e);
        });

        $iptBgColor.off('input').on('input', function(){
            $bgColorView.val(this.value);
        });


        $blindChartShow.children('.modal').modal();

        function setShow(selected, event){
            if(selected === 'transparent'){
                $bgColorView.hide();
            }else{
                $bgColorView.val(selected);
                $bgColorView.show();
            }

            if(selected === 'custom'){
                $iptBgColor.show();
                $iptBgColor.val('').focus();
            }else{
                $iptBgColor.hide();
                $iptBgColor.val(selected);
            }

            if(!event){
                $selBgColor.val(selected);
                if(!$selBgColor.val()){
                    $selBgColor.val('custom');
                    $iptBgColor.val(selected).show().focus();
                }
            }
        }
    }
    return ModalAppBlind;
})()
/*app 百叶窗*/

/*app饼图*/
var ModalAppPie = (function(){
    function ModalAppPie(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        this.screen = screen;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.entityOption = entityParams.modal.option;
    };
    ModalAppPie.prototype = new ModalBase();

    ModalAppPie.prototype.optionTemplate = {
        name: 'toolBox.modal.APP_PIE',
        parent: 3,
        mode: ['appGauge'],
        maxNum: 10,
        title: '',
        //defaultHeight: 4.5,
        //defaultWidth: 3,
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalAppPie',
        tooltip: {
            'imgPC': true,
            'imgMobile': true,
            'isSpecData':true,
            'desc': '#EnergyStruct'
        }
    };

    ModalAppPie.prototype.show = function () {
        this.init();
    };

    ModalAppPie.prototype.init = function () {
        this.container.style.overflowX = 'hidden';
        this.container.style.overflowY = 'auto';
    };
    ModalAppPie.prototype.renderModal = function () {
        this.entity.modal.interval = 5;
        var $appPieTotalBox = $(this.container).find('.appPieTotalBox');
        if($appPieTotalBox.length > 0) return;
         var appPieTotalBox = '<div class="appPieTotalBox"><div class="appPieTextShow">\
                <div class="appPieTotalBoxTitle"><span>能耗统计</span></div>\
                <div class="leftAppChartLegend divAppChartTip row">\
                </div>\
                <div class="divAppEnergyLabel">\
                    <div class="ctnRealVal">\
                        <div class="divRealVal">\
                            <span class="spLabelName">今日能耗：</span></br>\
                            <span class="spRealVal spTodayEnergy"></span>\
                        </div>\
                        <div class="divRealVal">\
                            <span class="spLabelName">昨日能耗：</span></br>\
                            <span class="spRealVal spYestEnergy"></span>\
                        </div>\
                        <div class="divRealVal">\
                            <span class="spLabelName">今日费用：</span></br>\
                            <span class="spRealVal spAppTodayCost"></span>\
                        </div>\
                        <div class="divRealVal">\
                            <span class="spLabelName">昨日费用：</span></br>\
                            <span class="spRealVal spAppYestCost"></span>\
                        </div>\
                    </div>\
                    <div class="ctnPercentage">\
                        <div class="divPercentage">\
                            <span class="spPercentVal spTodayEnergyPercent">\
                            </span>\
                            <span class="spPercentIcon">\
                            </span>\
                        </div>\
                        <div class="divPercentage">\
                            <span class="spPercentVal spYestEnergyPercent">\
                            </span>\
                            <span class="spPercentIcon">\
                            </span>\
                        </div>\
                        <div class="divPercentage">\
                            <span class="spPercentVal spAppTodayCostPercent">\
                            </span>\
                            <span class="spPercentIcon">\
                            </span>\
                        </div>\
                        <div class="divPercentage">\
                            <span class="spPercentVal spAppYestCostPercent">\
                            </span>\
                            <span class="spPercentIcon">\
                            </span>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="divAppChart " id="divEnergyChart">\
                <div class="divAppChildChart divAppItemEnergy"></div>\
                <div class="divAppChildChart divAppTotalEnergy"></div>\
            </div>\
            </div>';

        $(this.container).append(appPieTotalBox);
        $(this.container).find('.divAppItemEnergy').css({width: $(this.container).width()*0.6, height: $(this.container).height()});
        $(this.container).find('.divAppTotalEnergy').css({width: $(this.container).width()*0.37, height: $(this.container).height()});
    };

    ModalAppPie.prototype.updateModal = function (point) {

        var $currentContainer = $(this.container);

        $currentContainer.find('.panel-default').css('background-color','#fff')

        var data = JSON.parse(point[0].data);

        //左侧对应
        var nameList = [];
        var pointList = [];
        var spIconColor = ['#6dbef3', '#008ae2', '#028f68', '#00a045', '#6cc332', '#eeed00'];
        var colorJ = 0;
        var $leftAppChartLegend = $currentContainer.find('.leftAppChartLegend');
        $leftAppChartLegend.children().empty().remove();
        var projectId = data.EnergyList[0].projectId;
        if(!projectId){
            if(AppConfig.project && AppConfig.project.bindId){
                projectId = AppConfig.project.bindId;
            }else{
                projectId = AppConfig.projectId;
            }
        }
        for(var i = 0;i<data.EnergyList[0].children.length;i++){
            var item = data.EnergyList[0].children[i];
            nameList.push(item.name);
            pointList.push('@'+projectId+'|'+item.accumEnergyPoint);//AppConfig.projectId
            var singleLegendDiv = '<div class="spAppChartLegend col-xs-6">\
                                <span class="spIcon" style="background-color:'+spIconColor[colorJ]+'"></span>\
                                <span class="spName">\
                                </span>\
                            </div>'
            $leftAppChartLegend.append(singleLegendDiv);
            if(colorJ===spIconColor.length-1) colorJ = 0;
            $currentContainer.find('.appPieTotalBox').find('.spAppChartLegend').eq(i).find('.spName').text(item.name);
            colorJ++;
        }
        var accumPostData = {
            dsItemIds: pointList,//数组
            timeEnd: new Date().format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'm5',
            timeStart: new Date().format('yyyy-MM-dd') + ' 00:00:00'
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram',accumPostData ).done(function (result) {
            if (result&&result.list&&result.list.length!==0) {
                var dataArr = [];
                for(var i = 0;i<result.list.length;i++){
                    if(result.list[i].data&&result.list[i].data.length>0){
                        dataArr.push({value:(result.list[i].data[result.list[i].data.length-1]-result.list[i].data[0]).toFixed(2),name:nameList[i]});
                    }else{
                        dataArr.push({value:0,name:nameList[i]});
                    }

                }
                var $divAppItemEnergy = $currentContainer.find('.divAppItemEnergy');
                var leftOption = {
					color:['#6dbef3', '#008ae2', '#028f68', '#00a045', '#6cc332', '#eeed00'],
                    tooltip : {
                        trigger: 'item'
                    },
                    calculable : false,
                    legend: {
                        show:false,
                        data:nameList
                    },
                    toolbox: {
                        show : false
                    },
                    series : [
                        {
                            name:'能耗(kWh)',
                            type:'pie',
                            radius:['40%','60%'],
                            clockWise:false,
                            center:['48%','33%'],
                            label:{
                                normal:{
                                    textStyle:{
                                        color:'#fff'
                                    }
                                }
                            },
                            labelLine :{
                                normal :{
                                    length :3,
                                    length2:3
                                }
                            },
                            itemStyle : {
                                normal : {
                                    borderColor:'transparent',
                                    shadowBlur: 40,
                                    shadowColor: 'rgba(51, 51, 51, 0.5)',//'rgba(200, 200, 200, 0.5)'
                                    label : {
                                        show : true,
                                        formatter : function (params){
                                            return params.percent.toFixed(1) + '%'
                                        },
                                        textStyle:{
                                            color:'#dbeafe',
                                            fontFamily:'Microsoft Yahei'
                                        }
                                    },
                                    labelLine : {
                                        show : true,
                                        length:0
                                    }
                                }},

                            data:dataArr
                        }
                    ]
                }
                //if(dataArr.length>1){
                //    leftOption.color = ['#e6b560','#6aa0f1','#8259ce','#d374d7'];
                //}
                 var chart = echarts.init($divAppItemEnergy[0]);
                chart.setOption(leftOption);
            }
        });
        //右侧数据
        var dsItemIds = [];
        dsItemIds.push('@'+projectId+'|'+data.EnergyList[0].accumCostPoint);
        dsItemIds.push('@'+projectId+'|'+data.EnergyList[0].accumEnergyPoint);
        var postData = {
            dsItemIds: dsItemIds,//数组
            timeEnd: new Date().format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: 'm5',
            timeStart: new Date().format('yyyy-MM-dd') + ' 00:00:00'
        }
        var yestodayEnergy,yestodayCost,todayEnergy,todayCost,todayEnergyEnd,todayCostEnd;
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function (resultData){
            //console.log(resultData);
            if(resultData.list.length>0){
                var todayEnergyDataAll = resultData.list[1].data;
                var todayCostDataAll = resultData.list[0].data;
                if(point.length===2){
                    todayEnergyEnd = point[1].data;
                    todayCostEnd =  point[1].data;
                }else if(point.length===3){
                    todayEnergyEnd = point[2].data;
                    todayCostEnd =  point[1].data;
                }else{
                    todayEnergyEnd = todayEnergyDataAll[todayEnergyDataAll.length-1];
                    todayCostEnd = todayCostDataAll[todayCostDataAll.length-1];
                }
                if(todayEnergyDataAll.length!==0){
                    //todayEnergy = todayEnergyDataAll[todayEnergyDataAll.length-1] - todayEnergyDataAll[0];
                    todayEnergy = todayEnergyEnd - todayEnergyDataAll[0];
                }else{
                    todayEnergy=0;
                }
                if(todayCostDataAll.length!==0){
                    //todayCost = todayCostDataAll[todayCostDataAll.length-1] - todayCostDataAll[0];
                    todayCost = todayCostEnd - todayCostDataAll[0];
                }else{
                    todayCost=0;
                }
            }
            var $divAppEnergyLabel = $currentContainer.find('.divAppEnergyLabel');
            $divAppEnergyLabel.find('.spTodayEnergy').text(kIntSeparate(todayEnergy)+' kwh');
            $divAppEnergyLabel.find('.spAppTodayCost').text('￥ '+ kIntSeparate(todayCost));
            var postDataYes = {
                dsItemIds: dsItemIds,//数组
                timeEnd: new Date(new Date().valueOf()-86400000).format('yyyy-MM-dd') + ' 23:59:59',//new Date().format('yyyy-MM-dd')+' 00:00:00',
                timeFormat: 'm5',
                timeStart: new Date(new Date().valueOf()-86400000).format('yyyy-MM-dd') + ' 00:00:00'
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postDataYes).done(function (resultDataYes){
                 //console.log(resultDataYes);
                if(resultDataYes.list.length>0){
                    var yestodayEnergyDataAll = resultDataYes.list[1].data;
                    var yestodayCostDataAll = resultDataYes.list[0].data;
                    if(yestodayEnergyDataAll.length!==0){
                        yestodayEnergy = yestodayEnergyDataAll[yestodayEnergyDataAll.length-1] - yestodayEnergyDataAll[0];
                    }else{
                        yestodayEnergy=0;
                    }
                    if(yestodayCostDataAll.length!==0){
                        yestodayCost = yestodayCostDataAll[yestodayCostDataAll.length-1] - yestodayCostDataAll[0];
                    }else{
                        yestodayCost=0;
                    }
                    $divAppEnergyLabel.find('.spYestEnergy').text(kIntSeparate(yestodayEnergy)+' kwh');
                    $divAppEnergyLabel.find('.spAppYestCost').text('￥ '+kIntSeparate(yestodayCost));
                    $divAppEnergyLabel.find('.spTodayEnergyPercent').text((todayEnergy*100/(todayEnergy+yestodayEnergy)).toFixed(0)+'%');
                    $divAppEnergyLabel.find('.spYestEnergyPercent').text((yestodayEnergy*100/(todayEnergy+yestodayEnergy)).toFixed(0)+'%');
                    $divAppEnergyLabel.find('.spAppTodayCostPercent').text((todayCost*100/(todayCost+yestodayCost)).toFixed(0)+'%');
                    $divAppEnergyLabel.find('.spAppYestCostPercent').text((yestodayCost*100/(todayCost+yestodayCost)).toFixed(0)+'%');
                    var labelTop = {
                        normal : {
                            color:'#6aa7fd',
                            label : {
                                show : false,
                                position : 'center',
                                formatter : '{b}',
                                textStyle: {
                                    baseline : 'bottom'
                                }
                            },
                            labelLine : {
                                show : false
                            }
                        }
                    };
                    var labelFromatter = {
                        normal : {
                            label : {
                                show: false,
                                formatter : function (params){
                                    return 100 - params.value + '%'
                                },
                                textStyle: {
                                    baseline : 'top'
                                }
                            }
                        }
                    };
                    var labelBottom = {
                        normal : {
                            color: 'white',
                            label : {
                                show : false,
                                position : 'center'
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis: {
                            color: 'rgba(0,0,0,0)'
                        }
                    };
                    var borderItemStyle ={
                        normal : {
                            color: '#6aa7fd',
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        }
                    };
                    var radius = [0, '16%'];
                    var borderRadius = ['17%','21%'];
                    var rightOption = {
                        legend: {
                            show:false,
                            data:['今日能耗','昨日能耗','今日费用','昨日费用']
                        },
                        title : {
                            text: 'The App World',
                            show:false
                        },
                        toolbox: {
                            show : false
                        },
                        series : [
                            {
                                type : 'pie',
                                center : ['75%', '15%'],
                                radius : radius,
                                x: '0%', // for funnel
                                itemStyle : labelFromatter,
                                data : [
                                    {name:'other', value:yestodayEnergy, itemStyle : labelBottom},
                                    {name:'今日能耗', value:todayEnergy,itemStyle : labelTop}
                                ]
                            },
                            {
                                type : 'pie',
                                center : ['75%', '15%'],
                                radius : borderRadius,
                                x: '0%', // for funnel
                                itemStyle : labelFromatter,
                                data : [
                                    {name:'border', value:1, itemStyle : borderItemStyle}
                                ]
                            },
                            {
                                type : 'pie',
                                center : ['75%', '35%'],
                                radius : radius,
                                x:'20%', // for funnel
                                itemStyle : labelFromatter,
                                data : [
                                    {name:'other', value:todayEnergy, itemStyle : labelBottom},
                                    {name:'昨日能耗', value:yestodayEnergy,itemStyle : labelTop}
                                ]
                            },
                            {
                                type : 'pie',
                                center : ['75%', '35%'],
                                radius : borderRadius,
                                x: '0%', // for funnel
                                itemStyle : labelFromatter,
                                data : [
                                    {name:'border', value:1, itemStyle : borderItemStyle}
                                ]
                            },
                            {
                                type : 'pie',
                                center : ['75%', '55%'],
                                radius : radius,
                                x:'40%', // for funnel
                                itemStyle : labelFromatter,
                                data : [
                                    {name:'other', value:yestodayCost, itemStyle : labelBottom},
                                    {name:'今日费用', value:todayCost,itemStyle : labelTop}
                                ]
                            },
                            {
                                type : 'pie',
                                center : ['75%', '55%'],
                                radius : borderRadius,
                                x: '0%', // for funnel
                                itemStyle : labelFromatter,
                                data : [
                                    {name:'border', value:1, itemStyle : borderItemStyle}
                                ]
                            },
                            {
                                type : 'pie',
                                center : ['75%', '75%'],
                                radius : radius,
                                x:'60%', // for funnel
                                itemStyle : labelFromatter,
                                data : [
                                    {name:'other', value:todayCost, itemStyle : labelBottom},
                                    {name:'昨日费用', value:yestodayCost,itemStyle : labelTop}
                                ]
                            },
                            {
                                type : 'pie',
                                center : ['75%', '75%'],
                                radius : borderRadius,
                                x: '0%', // for funnel
                                itemStyle : labelFromatter,
                                data : [
                                    {name:'border', value:1, itemStyle : borderItemStyle}
                                ]
                            }
                        ]
                    };
                    var $divAppTotalEnergy = $currentContainer.find('.divAppTotalEnergy');
                     var chart = echarts.init($divAppTotalEnergy[0]);
                    chart.setOption(rightOption);
                }
            }).always(function(){
                this.spinner && this.spinner.stop();
            })
        })




    };

    ModalAppPie.prototype.showConfigMode = function () {
    }
    //ModalAppGauge.prototype.setModalOption = function (option) {
    //    this.entity.modal.interval = 5;
    //};
    return ModalAppPie;
})()
/*app饼图*/
function tofixed(str, accuracy){
    if(!accuracy) accuracy = 2;
    return parseFloat(str).toFixed(accuracy);
}
/**
 * Created by vicky on 2016/5/23.
 * 诊断历史
 */
var FaultHistoryScreen = (function(){
    var _this = undefined;
    function FaultHistoryScreen(){

        this.codemirror = undefined;
        _this = this;
        AppConfig.module = 'faultHistory';

        this.chartOpt1 = {
                title: {
                    text: '',
                    subtext: '',
                    x: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    data:[],
                    x: 'center'
                },
                grid: {
                    left: 70,
                    right: 70,
                    bottom: 40,
                    //height: '66%',
                    borderColor: '#fff'
                },
                xAxis : {
                    type : 'category',
                    boundaryGap : false,
                    axisLine: {onZero: true},
                    data: [],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                }
                ,
                yAxis : {
                    name : '',
                    type : 'value',
                    splitLine:{
                        lineStyle: {
                            color: 'rgba(80,80,80,0.5)'
                        }
                    },axisTick:{
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                }
            }

        this.chartOpt2 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    data:[],
                    x: 'center',
                    show: false
                },
                grid: {
                    left: 70,
                    right: 70,
                    top: 40,
                    /*top: '80%',
                    height: '10%',*/
                    borderColor: '#000'
                },
                xAxis : {
                    //gridIndex: 1,
                    type : 'category',
                    boundaryGap : false,
                    axisLine: {onZero: true},
                    data: [],
                    position: 'top',
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                yAxis : {
                    //gridIndex: 1,
                    name : '',
                    type : 'value',
                    inverse: true,
                    //splitNumber: 1,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel: {
                        show: true
                    }
                }
            }
    }
    FaultHistoryScreen.prototype = {
        show:function(){
            try{
                /*PanelToggle = window.PanelToggle || window.frames[0].PanelToggle;
                TemplateTree = window.TemplateTree || window.frames[0].TemplateTree;*/
                if(!PanelToggle) return;
                WebAPI.get('/static/app/DiagnosisEngine/views/faultHistory/faultHistoryScreen.html').done(function(resultHTML){
                    PanelToggle.panelCenter.innerHTML = resultHTML;
                    PanelToggle.toggle({
                        left: {
                            show:true
                        },
                        center:{
                            show:true
                        },
                        right:{
                            show:false
                        }
                    });
                    _this.init();
                })
            }catch (e){

            }
        },
        init:function(){
            var chartWrap = document.getElementById('chartWrap');// || window.frames[0].document.getElementById('chartWrap');
            var chart1 = document.getElementById('chart1');// || window.frames[0].document.getElementById('chart1');
            var chart2 = document.getElementById('chart2');// || window.frames[0].document.getElementById('chart2');
            this.chart1 = echarts.init(chart1);
            this.chart2 = echarts.init(chart2);
            echarts.connect([chart1, chart2]);

            var $indexLine = $('#indexLine');
            var mouseLeft = 0;
            //鼠标移动时显示竖直线
            chartWrap.onmousemove = function(e){
                //鼠标相对于模态框的位置

                if(e.x != mouseLeft && _this.chart1.getOption()){
                    mouseLeft = e.x;
                }else{
                    return;
                }

                var modal = window.parent.document.getElementById('modalFaultHist'),modalDialog;
                if(modal){
                    modalDialog = $(modal).find('.modal-dialog')[0];
                }else{
                    modalDialog = document.getElementById('chartWrap');
                }
                var relativePosLeft = e.x - modalDialog.offsetLeft;
                if(relativePosLeft < _this.chartOpt1.grid.left || relativePosLeft > (modalDialog.offsetWidth - _this.chartOpt1.grid.right)){
                    $indexLine.hide();
                }else{
                    $indexLine.show().css({left: relativePosLeft});
                }
            }

            TemplateTree.setOpt({
                click:{
                    'faultHistory':function(e,treeNode){
                        _this.showChartFaultHist(treeNode);
                    }
                }
            });

            if(TemplateTree.tree && TemplateTree.tree.getNodes().length > 0){
                _this.showChartFaultHist(TemplateTree.tree.getNodes()[0]);
            }
        },
        onresize:function(){
            PanelToggle.onresize();
        },
        close:function(){

        },
        showChartFaultHist: function(treeNode){
            var now = new Date();
            this.param = {
                timeStart: new Date(now.getTime() - 604800000).format('yyyy-MM-dd HH:mm:00'),//7*24*60*60*1000=604800000
                timeEnd: now.format('yyyy-MM-dd HH:mm:00'),
                timeFormat: "h1"
            }
            $.when(this.getHistData(treeNode), this.getFaultData(treeNode)).done(function(){
                var option1 = {
                    legend: {
                        data: []
                    },
                    xAxis:{data: []}
                };
                var option2 = {
                    legend: {
                        data: []
                    },
                    xAxis:{data: []}
                };
                var arrSeries = [], arrLegend = [];

                //折线部分
                _this.dataHist.list.forEach(function(item){
                    var seriesI = {
                        name: item.dsItemId,
                        type:'line',
                        smooth: true,
                        data: item.data,
                        //xAxisIndex: 0,
                        //yAxisIndex: 0,
                        symbol: 'none',
                        itemStyle: {
                            normal:{
                                color: 'rgb(208, 158, 66)'
                            }
                        }
                    }
                    arrLegend.push(item.dsItemId);
                    arrSeries.push(seriesI)
                });
                //故障个数
                option2.legend.data = ['故障'];
                option2.series = [{
                    name: '故障',
                    type: 'bar',
                    //xAxisIndex: 1,
                    //yAxisIndex: 1,
                    data: _this.arrFault,
                    barWidth: 5,
                    itemStyle: {
                        normal: {
                            color: 'rgb(4, 160, 212)',
                            barBorderRadius: 2
                        }
                    }
                }];

                //格式化时间

                for(var i = 0, time; i < _this.dataHist.timeShaft.length; i++){
                    time = _this.dataHist.timeShaft[i];
                    _this.dataHist.timeShaft[i] = time.replace(/^\d{4}-/g, '').replace(/:\d{2}$/g, '');
                }

                option1.xAxis.data = _this.dataHist.timeShaft;
                option2.xAxis.data = _this.dataHist.timeShaft;
                option1.series = arrSeries;
                option1.legend.data = arrLegend;
                _this.chart1.clear();
                _this.chart1.setOption($.extend(true, option1, _this.chartOpt1));
                _this.chart2.clear();
                _this.chart2.setOption($.extend(true, option2, _this.chartOpt2));
            });
        },
        getHistData: function(treeNode){
            var postData = $.extend(true,{dsItemIds: []}, this.param);
            for(var i in treeNode.dictVariable){
                var dsItem = treeNode.dictVariable[i];
                if(dsItem && dsItem != ''){
                    postData.dsItemIds.push(dsItem);
                }
            }
            if(postData.dsItemIds.length > 0){
                return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result){
                    _this.dataHist = result;
                });
            }
            return null;
        },
        getFaultData: function(treeNode){
            return WebAPI.get('/diagnosisEngine/getNoticeOccurrenceStatistics/'+ treeNode._id +'/'+ this.param.timeStart +'/'+ this.param.timeStart +'/' + this.param.timeFormat).done(function(result){
                _this.arrFault = result.data;
            });
        }
    };
    return FaultHistoryScreen;
})();
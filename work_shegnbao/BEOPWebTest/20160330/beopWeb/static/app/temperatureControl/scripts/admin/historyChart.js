/**
 * Created by vicky on 2016/3/18.
 */
var HistoryChart = (function(){
    var _this;

    HistoryChart.navOptions = {
        top: '<span class="topNavTitle">历史曲线</span>'
    };

    function HistoryChart(data){
        _this = this;
        this.data = data;
    }

    HistoryChart.prototype = {
        show: function () {
            var getHtml = WebAPI.get('/static/app/temperatureControl/views/observer/historyChart.html');
            getHtml.done(function(resultHtml){
                $('#indexMain').empty().html(resultHtml)
                _this.getHistoryData();
            })

        },
        attachEvents: function () {
            // 后退按钮
            /*$('#btnBack').hammer().off('tap').on('tap', function (e) {
                _this.save();
                router.back();
            });*/
        },
        close:function(){

        },
        option: {// 默认色板
            color: [
                '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
                '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
                '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
                '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
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
                    fontFamily: "Microsoft YaHei"
                }
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
                //backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
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
                        x: 70, y: 38, x2: 30, y2: 24
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

            textStyle: {
                fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
            }
        },
        getHistoryData: function(){
            var now = new Date();
            var postData = {
                dsItemIds: this.data.ids,
                timeEnd: now.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: "h1",
                timeStart: new Date(now.getTime() - 86400000).format('yyyy-MM-dd HH:mm:ss')
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result){
                var opt = _this.createOpt(result);
                echarts.init(document.getElementById('chartCtn')).setOption($.extend(_this.option, opt));
            });
        },
        createOpt: function(data){
            var opt = {
                legend: {
                    data: []
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : data.timeShaft
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: []
            }
            for(var i = 0, name; i < data.list.length; i++){
                name = data.list[i].dsItemId;
                opt.legend.data.push(name); //todo id转换成alias
                opt.series.push({
                    name: name,
                    type:'line',
                    smooth: true,
                    data: data.list[i].data
                });
            }

            return opt;
        }
    };

    return HistoryChart;
})();

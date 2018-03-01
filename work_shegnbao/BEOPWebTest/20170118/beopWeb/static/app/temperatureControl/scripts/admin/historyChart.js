/**
 * Created by vicky on 2016/3/18.
 */
var HistoryChart = (function(){
    var _this;

    HistoryChart.navOptions = {
        top: '<span class="topNavTitle" i18n="admin.navTitle.HISTORY_CURVE"></span>\
              <span class="topNavRight" id="btnChangeDevice">\
                  <span class="glyphicon glyphicon-option-horizontal" aria-hidden="true"></span>\
            </span>'
    };

    function HistoryChart(screen){
        _this = this;
        this.screen = screen;

    }

    HistoryChart.prototype = {
        show: function () {
            /*var deviceAll = '<div id="deviceAll"></div>';
            var getHtml = WebAPI.get('/static/app/temperatureControl/views/observer/historyChart.html');
            getHtml.done(function(resultHtml){
                $('#indexMain').empty().html(resultHtml).append(deviceAll);
                AppConfig.roomInit = false;
            })*/
        },
        showChart: function () {
            $('body').append('<div id="indexChartCtn">\
                <span class="btnTopMore" id="btnChangeDevice">\
                    <span class="glyphicon glyphicon-option-horizontal" aria-hidden="true"></span>\
                </span>\
                <div id="deviceAll"></div>\
                <div id="divChart"></div>\
                <span id="btnCloseHis" ontouchend="$(\'#indexChartCtn\').remove();">&nbsp;&nbsp;&nbsp;&times;</span></div>');
            var dict = {};

            dict[this.screen.device.arrP.SensorT] = this.screen.device.name + this.screen.postfix;
            _this.getHistoryData([this.screen.device.arrP.SensorT], dict);
            _this.attachEvents();
            I18n.fillArea($('#indexChartCtn'));
            I18n.fillArea($('#navTop'));
        },
        attachEvents: function () {
            var $deviceAll = $('#deviceAll');
            var deviceList_tpl = '<div class="deviceOption" dict-id={_id} title={name}><span class="deviceName">{name}</span><span class="glyphicon glyphicon-ok-circle selectedDevice"></span></div>';
            //切换设备按钮
            $('#btnChangeDevice').off('click').click(function () {
                var $this = $(this);
                var temp = '';
                if (!$this.hasClass('selectOpen')) {
                    $this.addClass('selectOpen');
                    if (_this.screen.device.type === 'SensorTemp') {
                    //传感器处理
                        var sensorLen = sensorAll.length;
                        if (sensorLen > 0) {
                            for (var i = 0; i < sensorLen; i++) {
                                if (sensorAll[i].arrP.SensorT) {
                                    temp += deviceList_tpl.formatEL({
                                        _id: sensorAll[i].arrP.SensorT,
                                        name: sensorAll[i].name+ _this.screen.postfix//_this.getName(sensorAll[i].name, sensorAll[i].type)'温度'
                                    })
                                }
                            }
                            temp += '<button class="btn" id="freshData" i18n="admin.roomPage.SURE">确定</button>';
                            $deviceAll.show().empty().append(temp);
                        }
                    } else {
                        //控制器处理
                        var ctrLen = ctrAll.length;
                        if (ctrLen > 0) {
                            for (var i = 0; i < ctrLen; i++) {
                                if (ctrAll[i].arrP.FCUTSet) {
                                    temp += deviceList_tpl.formatEL({
                                        _id: ctrAll[i].arrP.FCUTSet,
                                        name: ctrAll[i].name + _this.screen.postfix//'-温度设定'//_this.getName(ctrAll[i].name, ctrAll[i].type)
                                    });
                                }
                                if (ctrAll[i].arrP.FCUSpeedDSet) {
                                    temp += deviceList_tpl.formatEL({
                                        _id: ctrAll[i].arrP.FCUSpeedDSet,
                                        name: ctrAll[i].name + I18n.resource.admin.controllers.SET_WIND_SPEED//_this.getName(ctrAll[i].name, ctrAll[i].type)
                                    });
                                }
                            }
                            temp += '<button class="btn" id="freshData" i18n="admin.roomPage.SURE">确定</button>';
                            $deviceAll.show().empty().append(temp);
                        }
                    }
                    $deviceAll.find('.selectedDevice').off('click').click(function () {
                        var $this = $(this);
                        var $deviceOption = $this.parents('.deviceOption');
                        if (!$this.hasClass('selectButton')) {
                            $this.addClass('selectButton');
                            $deviceOption.addClass('selectOption');
                        } else {
                            $this.removeClass('selectButton');
                            $deviceOption.removeClass('selectOption');
                        }
                    });
                    //确定按钮 重绘曲线图
                    $('#freshData').off('click').click(function () {
                        var dictIdName = {};
                        if ($(this).siblings().hasClass('selectOption')) {
                            var $selectOption = $(this).siblings('.selectOption');
                            var ids = [];
                            //var lengendTitle = [];
                            for (var i = 0, id, len = $selectOption.length; i < len; i++) {
                                id = $selectOption.eq(i).attr('dict-id');
                                ids.push(id);
                                dictIdName[id] = $selectOption.eq(i).find('.deviceName').text();
                            }
                            if(ids.length === 0)return;
                            _this.getHistoryData(ids, dictIdName);
                            $deviceAll.hide();
                        } else {
                            //alert('请至少选择一项！');
                            return;
                        }
                    });
                } else {
                    $this.removeClass('selectOpen');
                    $deviceAll.hide();
                }

            });
        },
        deviceList:function(){},
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
                symbolSize: 0           // 拐点图形大小
            },

            textStyle: {
                fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
            }
        },
        getHistoryData: function(arrId, dictIdName){
            var now = new Date();
            var postData = {
                dsItemIds: arrId,
                timeEnd: now.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: "m5",
                timeStart: new Date(now.getTime() - 86400000).format('yyyy-MM-dd HH:mm:ss')
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result){
                var opt = _this.createOpt(result, dictIdName);
                echarts.init(document.getElementById('divChart')).setOption($.extend(_this.option, opt));
            });
        },
        getName: function (deviceName,deviceType) {
            var name = [];
            var propName;
            /*if (deviceType === 'SensorTemp') {
                propName = this.screen.dictClass[deviceType].name;
            } else {
                propName = '温度设定';//this.dictClass[deviceType].attrs.FCUTSet.name;
            }*/
            if (Object.prototype.toString.call(deviceName) === '[object Array]') {
                for (var i = 0, len = deviceName.length; i < len; i++) {
                    name.push(deviceName[i] + '-' + propName);
                }
            } else { 
                name.push(deviceName + '-' + propName);
            }
            return name;
        },
        createOpt: function (data, dictIdName) {
            var opt = {
                grid: {
                    x: '10%',
                    x2:'5%',
                    y:'46',
                    y2:'30%'
                },
                legend: {
                    data: [],
                    y: '83%',
                    textStyle: {color:'#fff'}
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap: false,
                        splitLine: false,
                        axisLabel: {
                            textStyle: {color:'#fff'}
                        },
                        data : function(){
                            //data.timeShaft
                            var timeList = [];
                            for (var i = 0, len = data.timeShaft.length; i < len; i++) {
                                var hTime = data.timeShaft[i].split(' ')[1];
                                var finTime = hTime.substring(0, hTime.length - 3);
                                timeList.push(finTime);
                            }
                            return timeList;
                        }()
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            textStyle: { color: '#fff' }
                        },
                        splitLine: {
                            lineStyle: { color: ['#85bbf7'] }
                        },
                        scale: true
                    }
                ],
                series: []
            }

            for(var i = 0, name; i < data.list.length; i++){
                name = dictIdName[data.list[i].dsItemId];
                opt.legend.data.push(name); //todo id转换成alias
                opt.series.push({
                    name: name,
                    type:'line',
                    symbol: 'none',
                    smooth: true,
                    data: data.list[i].data
                });
            }

            return opt;
        }
    };

    return HistoryChart;
})();

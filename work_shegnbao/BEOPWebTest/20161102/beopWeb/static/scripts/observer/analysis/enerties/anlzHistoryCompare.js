var AnlzHistoryCompare = (function () {
    var _this;
    function AnlzHistoryCompare(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
        _this = this;
        this.curIndex = 1;
        if (this.options) {
            this.options.xAxisData = this.options.xAxisData ? this.options.xAxisData : [];
            this.options.dataList = {};
        }
    }

    AnlzHistoryCompare.prototype = new AnlzBase();

    AnlzHistoryCompare.prototype.optionTemplate = {
        imgName: 'anlsHistory.png',
        imgIndex: 3,
        imgColor: '65,131,189',
        templateName: 'analysis.modalType.HISTORY_COMPARE',
        templateParams: {paraName:['X'],paraAnlysMode:'all'},
        chartConfig: ['easyCompareAnalyz','compareSensor','compareMeter']
    };

    AnlzHistoryCompare.prototype.show = function () {
        this.container.innerHTML = '';

        this.initTools();
        
        // 初始化便签
        this.$paneNotes = $('<div style="position: relative; width: 100%; height: 100%;">');
        this.paneNotes = this.$paneNotes[0];
        // 初始化 docker
        this.$parentContainer = $(this.container).parent();
        this.$parentContainer.append($('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">').append(this.paneNotes));
        this.initDock();

        //显示图形 遍历
        if (!this.screen.curModal.graphList) {
            this.screen.curModal.graphList = [];
        } else {
            var graphList = this.screen.curModal.graphList;
            var graph = undefined;
            for (var i = 0; i < graphList.length; i++) {
                if (graphList[i].type == 'arrow') {
                    graph = new DrawArrow(_this.screen, graphList[i], this.container, '');
                } else if (graphList[i].type == 'rect') {
                    graph = new DrawRect(_this.screen, graphList[i], this.container, '');
                } else if (graphList[i].type == 'circle') {
                    graph = new DrawCircle(_this.screen, graphList[i], this.container, '');
                }
                graph.show();
            }
        }

        if (!this.options.noteList) {
            this.options.noteList = [];
        } else {
            this.initNotes(this.options.noteList);
        }
        $('.itemTools .glyphicon-bookmark').off('click').click(function () {
            _this.createNote();
        });

        var temp;
        this.paneChart = document.createElement('div');
        temp = this.paneChart.style;
        temp.cssFloat = 'left';
        temp.width = '100%';
        temp.height = '100% ';


        this.container.appendChild(this.paneChart);

        temp = null;
        _this.spinnerRender.spin(this.container.parentElement);
        this.init();
    };

    AnlzHistoryCompare.prototype.close = function () {
        this.spinnerRender.stop();
        
        this.options = null;
        this.screen = null;

        this.paneChart = null;

        this.chart = null;
        this.dictLegend = null;
        this.curIndex = null;

        this.$paneNotes.parent().remove();
        this.$paneNotes = null;
        this.paneNotes = null;
        $('.svgBox').remove();
        $('#graphBox').hide();

        this.resetDock();
        this.$paneDock = null;
        this.$dockManager = null;
        this.$dockPreviewer = null;
        this.container = null;
    };

    AnlzHistoryCompare.prototype.init = function () {
        AppConfig.datasource.getDSItemDataMulti(this, this.options.itemDS[0].arrId);
    };

    AnlzHistoryCompare.prototype.render = function (data) {
        this.chart ? this.refreshChart(data) : this.initChart(data);
    };


    AnlzHistoryCompare.prototype.initChart = function (data) {
        this.createSeries(data);

        var i18nEcharts = I18n.resource.echarts;
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                //backgroundColor: 'rgba(100,100,100,0.7)',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                x: 'right',
                data: this.arrLegendData
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {
                        show: true,
                        title : {
                            mark : i18nEcharts.MARK,
                            markUndo : i18nEcharts.MARKUNDO,
                            markClear : i18nEcharts.MARKCLEAR
                        }
                    },
                    dataView: {
                        show: true,
                        readOnly: false,
                        title : i18nEcharts.DATAVIEW,
                        lang: [i18nEcharts.DATAVIEW, i18nEcharts.CLOSE, i18nEcharts.REFRESH]
                    },
                    restore: {
                        show: true,
                        title: i18nEcharts.REDUCTION
                    },
                    saveAsImage: {
                        show: true,
                        title: i18nEcharts.SAVE_AS_PICTURE,
                        lang : i18nEcharts.SAVE
                    }
                }
            },
            calculable: true,
            grid: { x: 60, x2: 20, y: 60, borderColor: '#eee' },
            xAxis: [
                {
                    type: 'category',
                    data: this.options.arrComparePeriodLabel
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: this.arrSeries
        };
        this.options.xAxisData = this.options.arrComparePeriodLabel;
        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme);
        this.chart.setOption(option);
        var _this = this;
    };

    AnlzHistoryCompare.prototype.refreshChart = function (data) {
        var arrData = [], item = data.list[0];
        if (this.dictLegend[item.dsItemId]) return;
        
        var tempOption = this.chart.getOption();
        var arrTemp = tempOption.series;
        arrTemp.push(this.createSeries(item.data));
        this.chart.setOption(tempOption);
        arrTemp = null;

        this.options.itemDS[0].arrId.push(item.dsItemId);
        var _this = this;
        this.screen.saveModal();
    };

    AnlzHistoryCompare.prototype.createSeries = function (data) {

        var arrSeries = [], arrLegendData = [], calcResult = [], arrId = [];

        var mode = this.options.mode;

        if( mode == 'easyCompareAnalyz' || mode == 'compareSensor'){
            for (var i = 0; i < data.length; i++) {
                var item = data[i];//第i周期
                calcResult[i] = [];
                for(var j = 0; j < item.list.length; j++){//第i个绑点
                    var point = item.list[j];
                    var dsItemIdName = AppConfig.datasource.getDSItemById(point.dsItemId).alias;
                    calcResult[i][j] = 0;
                    if(i == 0){
                        arrId.push(point.dsItemId);
                        arrLegendData.push(dsItemIdName);
                    }
                    for(var k = 0; k < point.data.length; k++){
                        calcResult[i][j] += parseFloat(point.data[k])
                    }
                    calcResult[i][j] = calcResult[i][j] / point.data.length;//求平均值

                    this.options.dataList[dsItemIdName] = this.options.dataList[dsItemIdName]?this.options.dataList[dsItemIdName]:[];
                    this.options.dataList[dsItemIdName].push(calcResult[i][j]);
                }
            }
        }else if(mode == 'compareMeter'){
            for (var i = 0; i < data.length; i++) {
                var item = data[i];//第i周期
                calcResult[i] = [];
                for(var j = 0; j < item.list.length; j++){//第i个绑点
                    var point = item.list[j];
                    if(i == 0){
                        arrLegendData.push(AppConfig.datasource.getDSItemById(point.dsItemId).alias);
                    }
                    calcResult[i][j] = point.data[point.data.length - 1] - point.data[0];
                    this.options.dataList[dsItemIdName] = this.options.dataList[dsItemIdName] ? this.options.dataList[dsItemIdName] : [];
                    this.options.dataList[dsItemIdName].push(calcResult[i][j]);
                }
            }
        }

        arrLegendData = _this.initPointAlias(arrLegendData);
        var arrItem = [];
        arrItem = AppConfig.datasource.getDSItemById(data[0].list[0].dsItemId);

        for(var i = 0; i < data[0].list.length; i++){
            //for (var m = 0; m < arrItem.length; m++) {
                //if (data[0].list[i] == arrItem[m].id) {
                    var seriesData = [];
                    for(var j = 0; j < data.length; j++){
                        seriesData.push(calcResult[j][i])
                    }
                    var color = echarts.config.color[this.curIndex++];
                    var series = {
                        //id: arrId[i],
                        name: arrLegendData[i],
                        type: 'bar',
                        data: seriesData,
                        itemStyle: {
                            normal: {
                                lineStyle: { color: color },
                                barBorderRadius: [5,5,5,5]
                            }
                        }
                    }
                    arrSeries.push(series);
                    //break;
                //}
            //}
        }

        this.arrSeries = arrSeries;
        this.arrLegendData = arrLegendData;
    };

    return AnlzHistoryCompare;
})();
var AnlzHistoryCompare_Line = (function () {
    var _this;
    function AnlzHistoryCompare_Line(container, option, screen) {
        _this = this;
        AnlzHistoryCompare.call(this, container, option, screen);
        this.options.xAxisData = this.options.xAxisData ? this.options.xAxisData : [];
        this.options.dataList = { };
    }


    AnlzHistoryCompare_Line.prototype = new AnlzHistoryCompare();

    AnlzHistoryCompare_Line.prototype.optionTemplate = {
        imgName: 'anlsHistory.png',
        imgIndex: 3,
        imgColor: '65,131,189',
        templateName: 'analysis.modalType.HISTORY_COMPARE_LINE',
        templateParams: {paraName:['X'],paraAnlysMode:'all'},
        chartConfig: ['easyCompareAnalyz','compareSensor','compareMeter']
    };

    AnlzHistoryCompare_Line.prototype.initChart = function (data) {

        this.createSeries(data);
        var xAxis = [];
        for (var i = 0; i< data[0].timeShaft.length ; ++i){
            xAxis.push('Day' + new Date(data[0].timeShaft[i]).getDate() +' ' + new Date(data[0].timeShaft[i]).format("HH:mm:ss"));
        }
        var i18nEcharts = I18n.resource.echarts;
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                //backgroundColor: 'rgba(100,100,100,0.7)',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    var strToolTip = '',date;
                    var arrItem = [];
                    arrItem = AppConfig.datasource.getDSItemById(_this.options.itemDS[0].arrId);
                    for (var i = 0;i < params.length;i++){
                        if(i % 2 == 0){
                            for (var m = 0; m < arrItem.length; m++) {
                                if (_this.options.itemDS[0].arrId[i/2] == arrItem[m].id) {
                                    strToolTip += arrItem[m].alias + '<br/>';
                                    strToolTip += data[0].timeShaft[params[i].dataIndex] + '<br/>Value: ' + params[i].value + '<br/>'
                                    break;
                                }
                            }
                            //strToolTip += AppConfig.datasource.getDSItemById(_this.options.itemDS[0].arrId[i/2]).alias + '<br/>';
                            //strToolTip += data[0].timeShaft[params[i].dataIndex] + '<br/>Value: ' + params[i].value + '<br/>'
                        }else {
                            strToolTip += data[1].timeShaft[params[i].dataIndex] + '<br/>Value: ' + params[i].value + '<br/>'
                        }
                    }
                    return strToolTip;
                }
            },
            legend: {
                x: 'right',
                data: this.arrLegendData
            },
            toolbox: {
                show: false,
                feature: {
                    dataView: {
                        show: false,
                        readOnly: true,
                        title : i18nEcharts.DATAVIEW,
                        lang: [i18nEcharts.DATAVIEW, i18nEcharts.CLOSE, i18nEcharts.REFRESH]
                    },
                    restore: {
                        show: true,
                        title: i18nEcharts.REDUCTION
                    },
                    saveAsImage: {
                        show: true,
                        title: i18nEcharts.SAVE_AS_PICTURE,
                        lang : i18nEcharts.SAVE
                    }
                }
            },
            calculable: false,
            grid: { x: 60, x2: 20, y: 60, borderColor: '#eee' },
            dataZoom: {
                show: false
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxis,
                    splitLine: {show : false}
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true
                }
            ],
            series: this.arrSeries
        };
        this.options.xAxisData = xAxis;
        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme);
        this.chart.setOption(option);
        var _this = this;
    };
    AnlzHistoryCompare_Line.prototype.createSeries = function (data) {

        var arrSeries = [], arrLegendData = [], pointData = [], arrId = [];

        var mode = this.options.mode;

        if( mode == 'easyCompareAnalyz' || mode == 'compareSensor'){
            for (var i = 0; i < data.length; i++) {
                var item = data[i];//第i周期
                pointData[i] = [];
                //calcResult[i] = [];
                for(var j = 0; j < item.list.length; j++){//第i个绑点
                    var point = item.list[j];
                    var pointName = AppConfig.datasource.getDSItemById(point.dsItemId).alias;
                    pointData[i][j] = [];
                    //arrLegendData[j] = [];
                    //calcResult[i][j] = 0;
                    if(i == 0){
                        arrId.push(point.dsItemId);
                        arrLegendData.push(this.options.arrComparePeriodLabel[0] + ':' + pointName);
                        arrLegendData.push(this.options.arrComparePeriodLabel[1] + ':' + pointName);
                    }
                    for(var k = 0; k < point.data.length; k++){
                        pointData[i][j].push(parseFloat(point.data[k]));
                    }

                    this.options.dataList[pointName] =this.options.dataList[pointName]?this.options.dataList[pointName]: [];
                    this.options.dataList[pointName].push(pointData[i][j]);
                    //calcResult[i][j] = calcResult[i][j]/point.data.length;//求平均值
                }
            }
        }else if(mode == 'compareMeter'){
            for (var i = 0; i < data.length; i++) {
                pointData[i] = [];
                var item = data[i];//第i周期
                //calcResult[i] = [];
                for(var j = 0; j < item.list.length; j++){//第i个绑点
                    pointData[i][j] = [];
                    var point = item.list[j];
                    var pointName = AppConfig.datasource.getDSItemById(point.dsItemId).alias;
                    if(i == 0){
                        arrLegendData.push(this.options.arrComparePeriodLabel[0] + ':' + pointName);
                        arrLegendData.push(this.options.arrComparePeriodLabel[1] + ':' + pointName);
                    }
                    for(var k = 0; k < point.data.length; k++){
                        pointData[i][j].push(parseFloat(point.data[k]));
                    }

                    this.options.dataList[pointName] =this.options.dataList[pointName]?this.options.dataList[pointName]: [];
                    this.options.dataList[pointName].push(pointData[i][j] + '\n');
                    //calcResult[i][j] = point.data[point.data.length-1] - point.data[0];
                }
            }
        }
        if (arrLegendData[0] == arrLegendData[1]){
            arrLegendData[0] +='_No1';
            arrLegendData[1] +='_No2';
        }

        //var arrItem = [];
        //arrItem = AppConfig.datasource.getDSItemById(data[0].list);

        var index = 0;
        for(var i = 0; i < data[0].list.length; i++){
            //for (var m = 0; m < arrItem.length; m++) {
                //if (data[0].list[i] == arrItem[m].id) {
                    var seriesData = [];
                    //var name = AppConfig.datasource.getDSItemById(data[0].list[i]).alias;
                    for(var j = 0; j < data.length; j++){
                        seriesData = pointData[j][i];
                        var color = echarts.config.color[this.curIndex++];

                        var series = {
                            //id: arrId[i],
                            name: arrLegendData[index],
                            type: 'line',
                            data: seriesData,
                            itemStyle: {
                                normal: {
                                    //lineStyle: { color: color },
                                    barBorderRadius: [5,5,5,5]
                                }
                            }
                        };
                        arrSeries.push(series);
                        index = index + 1;
                    }
                //    break;
                //}
            //}
        }

        this.arrSeries = arrSeries;
        this.arrLegendData = arrLegendData;
    };


    return AnlzHistoryCompare_Line;
})();

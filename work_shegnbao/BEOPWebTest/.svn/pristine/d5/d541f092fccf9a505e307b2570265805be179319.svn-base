var AnlzHistoryCompare = (function () {
    var _this;
    function AnlzHistoryCompare(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
        _this = this;
        this.curIndex = 1;
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
        //TODO
        this.paneNotes = $('<div style="position: relative; width: 100%; height: 100%;">')[0];
        $(this.container).append($('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">').append(this.paneNotes));
        if (!this.screen.curModal.noteList) {
            this.screen.curModal.noteList = [];
        } else {
            this.initNotes(this.screen.curModal.noteList);
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
        _this.spinnerRender.spin(this.container);
        this.init();
    };

    AnlzHistoryCompare.prototype.close = function () {
        this.container = null;
        this.options = null;
        this.screen = null;

        this.paneChart = null;

        this.chart = null;
        this.dictLegend = null;
        this.curIndex = null;
    };

    AnlzHistoryCompare.prototype.init = function () {
        var _this = this;
        AppConfig.datasource.getDSItemDataMulti(this, this.screen.curModal.itemDS[0].arrId);
    };

    AnlzHistoryCompare.prototype.render = function (data) {
        this.chart ? this.refreshChart(data) : this.initChart(data);
    };

    AnlzHistoryCompare.prototype.initChart = function (data) {

        this.createSeries(data);

        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(100,100,100,0.7)',
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
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            grid: { x: 60, x2: 20, y: 60, borderColor: '#eee' },
            xAxis: [
                {
                    type: 'category',
                    data: this.screen.curModal.arrComparePeriodLabel
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: this.arrSeries
        };

        this.chart = echarts.init(this.paneChart).setOption(option);
        var _this = this;
    };

    AnlzHistoryCompare.prototype.refreshChart = function (data) {
        var arrData = [], item = data.list[0];
        if (this.dictLegend[item.dsItemId]) return;

        var arrTemp = this.chart.getSeries();
        arrTemp.push(this.createSeries(item.data));
        this.chart.setSeries(arrTemp);
        arrTemp = null;

        this.screen.curModal.itemDS[0].arrId.push(item.dsItemId);
        var _this = this;
        this.screen.saveModal();
    };

    AnlzHistoryCompare.prototype.createSeries = function (data) {

        var arrSeries = [], arrLegendData = [], calcResult = [], arrId = [];

        var mode = this.screen.curModal.mode;

        if( mode == 'easyCompareAnalyz' || mode == 'compareSensor'){
            for (var i = 0; i < data.length; i++) {
                var item = data[i];//第i周期
                calcResult[i] = [];
                for(var j = 0; j < item.list.length; j++){//第i个绑点
                    var point = item.list[j];
                    calcResult[i][j] = 0;
                    if(i == 0){
                        arrId.push(point.dsItemId);
                        arrLegendData.push(AppConfig.datasource.getDSItemById(point.dsItemId).alias)
                    }
                    for(var k = 0; k < point.data.length; k++){
                        calcResult[i][j] += parseFloat(point.data[k])
                    }
                    calcResult[i][j] = calcResult[i][j]/point.data.length;//求平均值
                }
            }
        }else if(mode == 'compareMeter'){
            for (var i = 0; i < data.length; i++) {
                var item = data[i];//第i周期
                calcResult[i] = [];
                for(var j = 0; j < item.list.length; j++){//第i个绑点
                    var point = item.list[j];
                    if(i == 0){
                        arrLegendData.push(AppConfig.datasource.getDSItemById(point.dsItemId).alias)
                    }
                    calcResult[i][j] = point.data[point.data.length-1] - point.data[0];
                }
            }
        }


        for(var i = 0; i < data[0].list.length; i++){
            var seriesData = [];
            var name = AppConfig.datasource.getDSItemById(data[0].list[i]).alias;
            for(var j = 0; j < data.length; j++){
                seriesData.push(calcResult[j][i])
            }
            var color = echarts.config.color[this.curIndex++];

            var series = {
                id: arrId[i],
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
        }

        this.arrSeries = arrSeries;
        this.arrLegendData = arrLegendData;
    };

    return AnlzHistoryCompare;
})();
var AnlzHistoryCompare_Line = (function () {
    var _this;
    function AnlzHistoryCompare_Line(container, option, screen) {
        AnlzHistoryCompare.call(this, container, option, screen);
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

        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(100,100,100,0.7)',
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
                    dataView : {show: false, readOnly: true},
                    restore : {show: true},
                    saveAsImage : {show: true}
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
                    data: data[0].timeShaft,
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

        this.chart = echarts.init(this.paneChart).setOption(option);
        var _this = this;
    };
    AnlzHistoryCompare_Line.prototype.createSeries = function (data) {

        var arrSeries = [], arrLegendData = [], pointData = [], arrId = [];

        var mode = this.screen.curModal.mode;

        if( mode == 'easyCompareAnalyz' || mode == 'compareSensor'){
            for (var i = 0; i < data.length; i++) {
                var item = data[i];//第i周期
                pointData[i] = [];
                //calcResult[i] = [];
                for(var j = 0; j < item.list.length; j++){//第i个绑点
                    var point = item.list[j];
                    pointData[i][j] = [];
                    //arrLegendData[j] = [];
                    //calcResult[i][j] = 0;
                    if(i == 0){
                        arrId.push(point.dsItemId);
                        arrLegendData.push(this.screen.curModal.arrComparePeriodLabel[0] + AppConfig.datasource.getDSItemById(point.dsItemId).alias);
                        arrLegendData.push(this.screen.curModal.arrComparePeriodLabel[1] + AppConfig.datasource.getDSItemById(point.dsItemId).alias);
                    }
                    for(var k = 0; k < point.data.length; k++){
                        pointData[i][j].push(parseFloat(point.data[k]));
                    }
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
                    if(i == 0){
                        arrLegendData.push(this.screen.curModal.arrComparePeriodLabel[0] + AppConfig.datasource.getDSItemById(point.dsItemId).alias);
                        arrLegendData.push(this.screen.curModal.arrComparePeriodLabel[1] + AppConfig.datasource.getDSItemById(point.dsItemId).alias);
                    }
                    for(var k = 0; k < point.data.length; k++){
                        pointData[i][j].push(parseFloat(point.data[k]));
                    }
                    //calcResult[i][j] = point.data[point.data.length-1] - point.data[0];
                }
            }
        }

        var index = 0;
        for(var i = 0; i < data[0].list.length; i++){
            var seriesData = [];
            var name = AppConfig.datasource.getDSItemById(data[0].list[i]).alias;
            for(var j = 0; j < data.length; j++){
                seriesData = pointData[j][i];
                var color = echarts.config.color[this.curIndex++];

                var series = {
                    id: arrId[i],
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
        }

        this.arrSeries = arrSeries;
        this.arrLegendData = arrLegendData;
    };


    return AnlzHistoryCompare_Line;
})();

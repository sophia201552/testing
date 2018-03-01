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
                backgroundColor: 'rgba(255,255,255,0.7)',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                x: 'right',
                data: this.arrLegendData
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                y: 'center',
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

    AnlzHistoryCompare.prototype.initOption = function (series, timeSHaft) {
        return {
            tooltip: { trigger: 'axis' },
            grid: { x: 60, x2: 20, y: 60, borderColor: '#eee' },
            toolbox: {
                show: true,
                feature: {
                    magicType: { show: true, type: ['line', 'bar'] },
                    dataZoom: { show: true },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            dataZoom: { show: true, start: 0, end: 100 },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: timeSHaft
                }
            ],
            yAxis: [{ type: 'value', scale: true }],
            series: series,
            animationDuration: this.chartAnimationDuration,
            animationDurationUpdate: this.chartAnimationDuration
        };
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
                }
            }
        }

        if(this.screen.curModal.mode == 'compareMeter'){
            for (var i = 0; i < data.length; i++) {
                var item = data[i];//第i周期
                calcResult[i] = [];
                for(var j = 0; j < item.list.length; j++){//第i个绑点
                    var point = item.list[j];
                    if(i == 0){
                        arrLegendData.push(AppConfig.datasource.getDSItemById(point.dsItemId).alias)
                    }
                    calcResult[i][j] = item.list[item.list.length - 1] - item.list[0]
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
                itemStyle: { normal: { lineStyle: { color: color } } }
            }
            arrSeries.push(series);
        }

        this.arrSeries = arrSeries;
        this.arrLegendData = arrLegendData;
    };

    return AnlzHistoryCompare;
})();

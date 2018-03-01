var AnlzStack = (function () {
    var _this;
    function AnlzStack(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
        this.screen = screen;
        _this = this;
    }

    AnlzStack.prototype = new AnlzBase();

    AnlzStack.prototype.optionTemplate = {
        imgName: 'anlsStack.png',
        imgIndex: 4,
        imgColor: '148,193,142',
        templateName: 'analysis.modalType.STACK',
        templateParams: {paraName:['X'],paraAnlysMode:'all'},
        chartConfig: ['easy','fixed','recent']
    };

    AnlzStack.prototype.show = function () {
        this.initTools();
        this.container.innerHTML = '';
        var temp;
        this.paneChart = document.createElement('div');
        temp = this.paneChart.style;
        temp.cssFloat = 'left';
        temp.width = '100%';
        temp.height = '100%';
        this.container.appendChild(this.paneChart);
        this.spinnerRender.spin(this.container);
        this.init();

        //to do
        this.paneNotes = $('<div style="position: relative; width: 100%; height: 100%;">')[0];
        $(this.container).append($('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">').append(this.paneNotes));

        if(!this.screen.curModal.noteList){
            this.screen.curModal.noteList = [];
        }else{
            _this.initNotes(this.screen.curModal.noteList);
        }
        $('.itemTools .glyphicon-bookmark').off('click').click(function(){
                _this.createNote();
        });
    };

    AnlzStack.prototype.close = function () {
        this.container = null;
        this.options = null;
        this.screen = null;
        this.paneChart = null;
        this.chart = null;
    };

    AnlzStack.prototype.init = function () {
        var _this = this;
        AppConfig.datasource.getDSItemData(this, this.screen.curModal.itemDS[0].arrId);
    };

    AnlzStack.prototype.render = function (data) {
        this.initChart(data);
        var _this = this;
    };

    AnlzStack.prototype.initChart = function (data) {
        var arrSeries = [];
        var arrLengend = [];
        for (var i = 0; i < data.list.length; i++) {
            var item = data.list[i];
            arrSeries.push(this.createSeries(item.dsItemId, item.data));
            arrLengend.push(arrSeries[i].name);
        }

        this.chart = echarts.init(this.paneChart).setOption(this.initOption(arrSeries, arrLengend, data.timeShaft));
    };

    AnlzStack.prototype.initOption = function (series, arrLengend, timeSHaft) {
        return {
            tooltip: { trigger: 'axis' },
            legend: {
                data: arrLengend
            },
            grid: { x: 60, x2: 20, y: 60, borderColor: '#eee' },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
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
            animationDurationUpdate: this.chartAnimationDuration / 4
        };
    };

    AnlzStack.prototype.createSeries = function (id, data, type) {
        return {
            id: id,
            name: AppConfig.datasource.getDSItemById(id).alias,
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            symbol: 'none',
            stack: I18n.resource.observer.analysis.TOTAL_AMOUNT,
            data: data
        }
    };

    return AnlzStack;
})();

var AnlzStack = (function () {
    var _this;
    function AnlzStack(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
        this.screen = screen;
        _this = this;
        this.options.xAxisData = this.options.xAxisData ? this.options.xAxisData : [];
        this.options.dataList = {};
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

        this.container.appendChild(this.paneChart);

        this.spinnerRender.spin(this.container.parentElement);
        this.init();

        if(!this.options.noteList){
            this.options.noteList = [];
        }else{
            _this.initNotes(this.options.noteList);
        }
        $('.itemTools .glyphicon-bookmark').off('click').click(function(){
                _this.createNote();
        });
    };

    AnlzStack.prototype.close = function () {
        this.spinnerRender.stop();
        
        this.options = null;
        this.screen = null;
        this.paneChart = null;
        this.chart = null;

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

    AnlzStack.prototype.init = function () {
        var _this = this;
        AppConfig.datasource.getDSItemData(this, this.options.itemDS[0].arrId);
    };

    AnlzStack.prototype.render = function (data) {
        this.initChart(data);
        var _this = this;
    };

    AnlzStack.prototype.initChart = function (data) {
        var arrSeries = [];
        var arrLengend = [];
        this.options.xAxisData = data.timeShaft;
        for (var i = 0; i < data.list.length; i++) {
            var item = data.list[i];
            arrSeries.push(this.createSeries(item.dsItemId, item.data));
            arrLengend.push(arrSeries[i].name);
            this.options.dataList[arrSeries[i].name] = item.data;
        }

        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme).setOption(this.initOption(arrSeries, arrLengend, data.timeShaft));
    };

    AnlzStack.prototype.initOption = function (series, arrLengend, timeSHaft) {
        var i18nEcharts = I18n.resource.echarts;
        return {
            tooltip: { trigger: 'axis' },
            legend: {
                data: arrLengend
            },
            grid: { x: 60, x2: 20, y: 60, borderColor: '#eee' },
            toolbox: {
                show: true,
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
                    magicType: {
                        show: true,
                        type: ['line', 'bar', 'stack', 'tiled'],
                        title : {
                            line : i18nEcharts.LINE,
                            bar : i18nEcharts.BAR,
                            stack : i18nEcharts.STACK,
                            tiled : i18nEcharts.TILED
                        }
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

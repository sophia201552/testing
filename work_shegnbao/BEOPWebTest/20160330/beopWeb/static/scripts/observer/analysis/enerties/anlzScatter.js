var AnlzScatter = (function () {
    function AnlzScatter(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
        this.animation = true;
        this.options.xAxisData = this.options.xAxisData ? this.options.xAxisData : [];
        this.options.dataList = {};
    }

    AnlzScatter.prototype = new AnlzBase();

    AnlzScatter.prototype.optionTemplate = {
        imgName: 'anlsScatter.png',
        imgIndex:2,
        imgColor: '211,97,78',
        templateName: 'analysis.modalType.SCATTER',
        templateParams: {paraName:['X', 'Y'],paraAnlysMode:'all',dataTypeMaxNum:[1,5]},
        chartConfig: ['easy','fixed','recent']
    };

    AnlzScatter.prototype.init = function () {
        var _this = this;

        var arrIds = [];
        arrIds.push(this.options.itemDS[0].arrId[0]);
        arrIds = arrIds.concat(this.options.itemDS[1].arrId);

        var postData = {
            //dataSourceId: AppConfig.datasource.getId(),
            dsItemIds: arrIds,
            timeStart: this.options.startTime.format('yyyy-MM-dd HH:mm:ss'),
            timeEnd: this.options.endTime.format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: this.options.format
        };
        //Spinner.spin(ElScreenContainer);
        WebAPI.post('/analysis/startWorkspaceDataGenScatterChart', postData).done(function (data) {
            if(data.error && data.error.length > 0) {
                _this.errAlert(data.error);
                _this.spinnerStop();
                return;
            }
            _this.renderModal(data);
            //_this.screen.spinnerStop();
        }).error(function (e) {
            _this.screen.alertNoData();
            _this.spinnerStop();
        });
    };

    AnlzScatter.prototype.render = function (data) {
        var arrXAxis = data.list[0].data, arrData = [], arrLegend = [], arrSeries = [];

        var arrId = [];
        var arrItem = [];
        var dataListBack = {};
        for (var i = 1; i < data.list.length; i++) {
            arrId.push(data.list[i].dsItemId);
        }
        arrItem = AppConfig.datasource.getDSItemById(arrId);
        for (var i = 0; i < data.list.length; i++) {
            if (i === 0) {
                this.options.xAxisData = data.list[i].data;
            } else { 
                arrData.push([]);
                for (var m = 0; m < arrItem.length; m++) {
                    if (data.list[i].dsItemId == arrItem[m].id) {
                        arrLegend.push(arrItem[m].alias);
                        this.options.dataList[arrItem[m].alias] = data.list[i].data;
                        break;
                    }
                }
            }
            //arrLegend.push(AppConfig.datasource.getDSItemById(data.list[i].dsItemId).alias)
        }

        for (var dictItems in this.options.dataList) {
            var dictYItem = this.options.dataList[dictItems];
            dataListBack[dictItems] = [];
            for (var n = 0, len = dictYItem.length; n < len; n++) {
                dataListBack[dictItems].push('(' + this.options.xAxisData[n] + '、' + dictYItem[n] + ')');
            }
        }
        this.options.dataList = dataListBack;

        for (var i = 0, valueX; i < arrXAxis.length; i++) {
            valueX = data.list[0].data[i];
            for (var j = 0, jLen = data.list.length - 1; j < jLen; j++) {
                arrData[j].push([valueX, data.list[j + 1].data[i]]);
            }
        }

        for (var i = 0; i < arrData.length; i++) {
            arrSeries.push({
                name: arrLegend[i],
                type: 'scatter',
                data: arrData[i],
                markLine: {
                    data: [
                        { type: 'average', name: I18n.resource.observer.analysis.AVERAGE }
                    ]
                }
            });
        }

        var i18nEcharts = I18n.resource.echarts;
        var option = {
            title: {
                text: 'X: ' + AppConfig.datasource.getDSItemById(data.list[0].dsItemId).alias,
                subtext: 'Scatter'
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            legend: {
                data: arrLegend
            },
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
                    dataZoom: {
                        show: true,
                        title : {
                            dataZoom : i18nEcharts.DATAZOOM,
                            dataZoomReset : i18nEcharts.DATAZOOMRESET
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
            xAxis: [
                {
                    type: 'value',
                    scale: true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true
                }
            ],
            series: arrSeries,
            animation: this.animation,
            animationDuration: this.chartAnimationDuration,
            animationDurationUpdate: this.chartAnimationDuration / 4
        };

        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme).setOption(option);
    };

    return AnlzScatter;
})();

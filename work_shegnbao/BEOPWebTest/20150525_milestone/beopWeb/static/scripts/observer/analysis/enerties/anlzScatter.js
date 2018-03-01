var AnlzScatter = (function () {
    function AnlzScatter(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
    }

    AnlzScatter.prototype = new AnlzBase();

    AnlzScatter.prototype.optionTemplate = {
        imgName: 'anlsScatter.png',
        imgColor: '211,97,78',
        templateName: 'analysis.modalType.SCATTER',
        templateParams: {paraName:['X', 'Y'],paraAnlysMode:'all',dataTypeMaxNum:[1,5]},
        chartConfig: ['easy','fixed','recent']
    };

    AnlzScatter.prototype.init = function () {
        var _this = this;

        var arrIds = [];
        arrIds.push(this.screen.curModal.itemDS[0].arrId[0]);
        arrIds = arrIds.concat(this.screen.curModal.itemDS[1].arrId);

        var postData = {
            //dataSourceId: AppConfig.datasource.getId(),
            dsItemIds: arrIds,
            timeStart: this.screen.curModal.startTime.format('yyyy-MM-dd HH:mm:ss'),
            timeEnd: this.screen.curModal.endTime.format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: this.screen.curModal.format
        };
        //Spinner.spin(ElScreenContainer);
        WebAPI.post('/analysis/startWorkspaceDataGenScatterChart', postData).done(function (result) {
            var data = JSON.parse(result);
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

        for (var i = 1; i < data.list.length; i++) {
            arrData.push([]);
            arrLegend.push(AppConfig.datasource.getDSItemById(data.list[i].dsItemId).alias)
        }

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
                    mark: { show: true },
                    dataZoom: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
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
            animationDuration: this.chartAnimationDuration,
            animationDurationUpdate: this.chartAnimationDuration
        };

        this.chart = echarts.init(this.paneChart).setOption(option);
    };

    return AnlzScatter;
})();

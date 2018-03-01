var AnlzSpectrum = (function () {
    function AnlzSpectrum(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
    }

    AnlzSpectrum.prototype = new AnlzBase();

    AnlzSpectrum.prototype.optionTemplate = {
        imgName: 'anlsSpectrum.png',
        imgColor: '148,193,142',
        templateName: 'analysis.modalType.SPECTRUM',
        templateParams: {paraName:['X'],paraAnlysMode:'all',dataTypeMaxNum:[1]},
        chartConfig: ['easy','fixed','recent']
    };

    AnlzSpectrum.prototype.init = function () {
        var _this = this;
        var postData = {
            dsItemIds: this.screen.curModal.itemDS[0].arrId,
            timeStart: this.screen.curModal.startTime.format('yyyy-MM-dd HH:mm:ss'),
            timeEnd: this.screen.curModal.endTime.format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: this.screen.curModal.format
        };
        //postData.dataSourceId = this.screen.store ? AppConfig.datasource.getId() : '';

        //Spinner.spin(ElScreenContainer);
        WebAPI.post('/analysis/startWorkspaceDataGenPattern', postData).done(function (result) {
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

    AnlzSpectrum.prototype.render = function (data) {
        //Spinner.spin(ElScreenContainer);
        var arrLabel = [], arrData = [];
        for (var i = 0, item; i < data.list.length; i++) {
            item = data.list[i];
            arrLabel.push(item.data);
            arrData.push(item.pattern);
        }

        var option = {
            title: {
                text: AppConfig.datasource.getDSItemById(this.screen.curModal.itemDS[0].arrId[0]).alias,
                subtext: 'Spectrum'
            },
            tooltip: { trigger: 'axis' },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: arrLabel
                }
            ],
            yAxis: [{ type: 'value' }],
            series: [
                {
                    type: 'bar',
                    data: arrData,
                    itemStyle: {
                        normal: {
                            color: '#5bc0de',
                            barBorderRadius: [5, 5, 0, 0]
                        }
                    },
                    markLine: { data: [{ type: 'average', name:I18n.resource.observer.analysis.AVERAGE }] }
                }
            ],
            animationDuration: this.chartAnimationDuration,
            animationDurationUpdate: this.chartAnimationDuration
        };
        this.chart = echarts.init(this.paneChart).setOption(option);
    };

    return AnlzSpectrum;
})();

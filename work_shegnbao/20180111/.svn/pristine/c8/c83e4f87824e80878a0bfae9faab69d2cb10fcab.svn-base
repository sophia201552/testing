var AnlzSpectrum = (function () {
    function AnlzSpectrum(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
        this.options.xAxisData = this.options.xAxisData ? this.options.xAxisData : [];
        this.options.dataList ={};
    }

    AnlzSpectrum.prototype = new AnlzBase();

    AnlzSpectrum.prototype.optionTemplate = {
        imgName: 'anlsSpectrum.png',
        imgIndex: 1,
        imgColor: '148,193,142',
        templateName: 'analysis.modalType.SPECTRUM',
        templateParams: {paraName:['X'],paraAnlysMode:'all',dataTypeMaxNum:[1]},
        chartConfig: ['easy','fixed','recent']
    };

    AnlzSpectrum.prototype.init = function () {
        var _this = this;
        var timeConfig;
        if(this.options.timeRecent){
            timeConfig = generateTimeOption(this.options)
        }else{
            timeConfig = this.options
        }
        var postData = {
            dsItemIds: [this.options.itemDS[0].arrId[0]],//当拖拽多个点时只保留第一个
            timeStart: new Date(timeConfig.startTime).format('yyyy-MM-dd HH:mm:ss'),
            timeEnd: new Date(timeConfig.endTime).format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: timeConfig.format
        };
        //postData.dataSourceId = this.screen.store ? AppConfig.datasource.getId() : '';

        //Spinner.spin(ElScreenContainer);
        WebAPI.post('/analysis/startWorkspaceDataGenPattern', postData).done(function (data) {
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

        var i18nEcharts = I18n.resource.echarts;
        var name = AppConfig.datasource.getDSItemById(this.options.itemDS[0].arrId[0]).alias;
        var option = {
            title: {
                text: name,
                subtext: 'Spectrum'
            },
            tooltip: { trigger: 'axis' },
            toolbox: {
                show: true,
                showTitle: true,
                feature: {
                    mark: {
                        show: true,
                        title : {
                            mark : i18nEcharts.MARK,
                            markUndo : i18nEcharts.MARKUNDO,
                            markClear : i18nEcharts.MARKCLEAR
                        }
                    },
                    restore: {
                        show: true,
                        title: i18nEcharts.REDUCTION
                    },
                    saveAsImage: {
                        show: true,
                        title: i18nEcharts.SAVE_AS_PICTURE,
                        lang: i18nEcharts.SAVE,
                        backgroundColor: (AppConfig.chartTheme == theme.Dark ? '#192234' : '#fafbfc')
                    }
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
            animationDurationUpdate: this.chartAnimationDuration / 4
        };
        this.options.xAxisData = arrLabel;
        this.options.dataList[name] = arrData;
        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme);
        this.chart.setOption(option);
    };

    return AnlzSpectrum;
})();

var AnlzChart = (function() {
    function AnlzChart(containerId, entityParams) {
        //ModalBase.call(this, containerId, entityParams.title, this.renderModal, this.updateModal, this.showConfigMode);
        //this.options = entityParams.option;
    }

    AnlzChart.prototype.renderModal = function() {
            this.container.innerHTML = template;

        },

        AnlzChart.prototype.updateModal = function(name, value) {

        },

        AnlzChart.prototype.showConfigMode = function() {

        }

    return AnlzChart;
})();

var AnlzPieRealtime = (function() {
    var _this;

    function AnlzPieRealtime(container, option, screen) {
        AnlzBase.call(this, container, option, screen);

        _this = this;
        this.paneChart = undefined;
        this.chart = undefined;
        this.dictLegend = {};
        this.postData = {};
        this.interv = undefined;
        this.options.dataList = {};
    }

    AnlzPieRealtime.prototype = new AnlzBase();

    AnlzPieRealtime.prototype.optionTemplate = {
        imgName: 'anlsPieRealtime.png',
        imgIndex: 5,
        imgColor: '211,97,78',
        templateName: 'analysis.modalType.PIE_REAL_TIME',
        templateParams: { paraName: ['X'], paraAnlysMode: 'all' },
        chartConfig: ['realTime']
    };

    AnlzPieRealtime.prototype.close = function() {
        this.spinnerRender.stop();

        this.options = null;
        this.screen = null;
        this.paneChart = null;
        this.chart = null;
        this.dictLegend = null;
        clearInterval(_this.interv);

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

    AnlzPieRealtime.prototype.init = function() {
        _this.postData = {
            //dataSourceId: AppConfig.datasource.getId(),
            dsItemIds: _this.options.itemDS[0].arrId
        };
        //Spinner.spin(ElScreenContainer);
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', _this.postData).done(function(result) {
            if (result && result.dsItemList) {
                var rslt = result.dsItemList;
                if (rslt.error && rslt.error.length > 0) {
                    alert(rslt.error);
                    _this.spinnerStop();
                    return;
                }
                _this.renderModal(rslt);
            }
            //_this.screen.spinnerStop();
        }).error(function(e) {
            _this.screen.alertNoData();
            _this.spinnerStop();
        });
        _this.interv = setInterval(function() {
            _this.spinnerRender.spin(_this.container.parentElement);
            WebAPI.post('/analysis/startWorkspaceDataGenPieChart', _this.postData).done(function(result) {
                var data = result.dsItemList;
                if (data.error && data.error.length > 0) {
                    _this.errAlert(data.error);
                    _this.spinnerStop();
                    return;
                }
                if (data && data != '') {
                    var arrData = [];

                    var arrId = [];
                    var arrItem = [];
                    for (var i = 0; i < data.length; i++) {
                        arrId.push(data[i].dsItemId);
                    }
                    arrItem = AppConfig.datasource.getDSItemById(arrId);
                    for (var i = 0, item; i < data.length; i++) {
                        item = data[i];
                        for (var m = 0; m < arrItem.length; m++) {
                            if (item.dsItemId == arrItem[m].id) {
                                var itemName = arrItem[m].alias;
                                arrData.push({ value: parseFloat(item.data), name: itemName });
                                break;
                            }
                        }
                        //var itemName = AppConfig.datasource.getDSItemById(item.dsItemId).alias;
                        //arrData.push({ value: parseFloat(item.data), name: itemName });
                    }
                    var series = [{
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: arrData
                    }];
                    //_this.chart && _this.chart.setSeries(series, true);
                    _this.chart && _this.chart.getOption().series.push(series);
                }
                _this.spinnerStop();
            }).error(function(e) {
                _this.screen.alertNoData();
                _this.spinnerStop();
            });
        }, 60000);
    };

    AnlzPieRealtime.prototype.render = function(data) {
        var arrLabel = [],
            arrData = [];
        var arrId = [];
        var arrItem = [];
        for (var i = 0; i < data.length; i++) {
            arrId.push(data[i].dsItemId);
        }
        arrItem = AppConfig.datasource.getDSItemById(arrId);

        for (var i = 0, item; i < data.length; i++) {
            item = data[i];
            for (var m = 0; m < arrItem.length; m++) {
                if (item.dsItemId == arrItem[m].id) {
                    var itemName = arrItem[m].alias;
                    arrLabel.push(itemName);
                    arrData.push({ value: parseFloat(item.data), name: itemName });
                    this.options.dataList[itemName] = this.options.dataList[itemName] ? this.options.dataList[itemName] : [];
                    this.options.dataList[itemName].push(parseFloat(item.data));
                    break;
                }
            }
            //var itemName = AppConfig.datasource.getDSItemById(item.dsItemId).alias;
            //arrLabel.push(itemName);
            //arrData.push({ value: parseFloat(item.data), name: itemName });
        }

        var i18nEcharts = I18n.resource.echarts;
        var option = {
            title: {
                text: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: arrLabel
            },
            toolbox: {
                show: true,
                showTitle: true,
                feature: {
                    mark: {
                        show: true,
                        title: {
                            mark: i18nEcharts.MARK,
                            markUndo: i18nEcharts.MARKUNDO,
                            markClear: i18nEcharts.MARKCLEAR
                        }
                    },
                    dataView: {
                        show: true,
                        readOnly: false,
                        title: i18nEcharts.DATAVIEW,
                        lang: [i18nEcharts.DATAVIEW, i18nEcharts.CLOSE, i18nEcharts.REFRESH]
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
            series: [{
                type: 'pie',
                center: ['50%', '60%'],
                data: arrData
            }],
            animationDuration: this.chartAnimationDuration,
            animationDurationUpdate: this.chartAnimationDuration / 4
        };
        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme);
        this.chart.setOption(option); //,'dark'
    };

    return AnlzPieRealtime;
})();
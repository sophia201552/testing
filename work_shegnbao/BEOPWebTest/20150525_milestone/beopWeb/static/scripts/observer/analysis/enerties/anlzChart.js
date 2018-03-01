var AnlzChart = (function () {
    function AnlzChart(containerId, entityParams) {
        //ModalBase.call(this, containerId, entityParams.title, this.renderModal, this.updateModal, this.showConfigMode);
        //this.options = entityParams.option;
    }

    AnlzChart.prototype.renderModal = function () {
        this.container.innerHTML = template;

    },

    AnlzChart.prototype.updateModal = function (name, value) {

    },

    AnlzChart.prototype.showConfigMode = function () {

    }

    return AnlzChart;
})();

var AnlzPieRealtime = (function () {
    var _this;
    function AnlzPieRealtime(container, option, screen) {
        AnlzBase.call(this, container, option, screen);

        _this = this;
        this.paneChart = undefined;
        this.chart = undefined;
        this.dictLegend = {};
        this.postData = {};
        this.interv = undefined;
    }

    AnlzPieRealtime.prototype = new AnlzBase();

    AnlzPieRealtime.prototype.optionTemplate = {
        imgName: 'anlsPieRealtime.png',
        imgColor: '211,97,78',
        templateName: 'analysis.modalType.PIE_REAL_TIME',
        templateParams: {paraName:['X'],paraAnlysMode:'all'},
        chartConfig: ['realTime']
    };

    AnlzPieRealtime.prototype.close = function () {
        this.container = null;
        this.options = null;
        this.screen = null;
        this.paneChart = null;
        this.chart = null;
        this.dictLegend = null;
        clearInterval(_this.interv);
    };

    AnlzPieRealtime.prototype.init = function () {
        _this.postData = {
            //dataSourceId: AppConfig.datasource.getId(),
            dsItemIds: _this.screen.curModal.itemDS[0].arrId
        };
        //Spinner.spin(ElScreenContainer);
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', _this.postData).done(function (result) {
            if (result && result != '') {
                var rslt = JSON.parse(result);
                if(rslt.error && rslt.error.length > 0) {
                    alert(rslt.error);
                    _this.spinnerStop();
                    return;
                }
                _this.renderModal(rslt);
            }
            //_this.screen.spinnerStop();
        }).error(function (e) {
            _this.screen.alertNoData();
            _this.spinnerStop();
        });
        _this.interv = setInterval(function () {
            _this.spinnerRender.spin(this.container);
            WebAPI.post('/analysis/startWorkspaceDataGenPieChart', _this.postData).done(function (result) {
                var data = JSON.parse(result);
                if (data.error && data.error.length > 0) {
                    _this.errAlert(data.error);
                    _this.spinnerStop();
                    return;
                }
                if (data && data != '') {
                    var arrData = [];
                    for (var i = 0, item; i < data.length; i++) {
                        item = data[i];
                        var itemName = AppConfig.datasource.getDSItemById(item.dsItemId).alias;
                        arrData.push({ value: parseFloat(item.data), name: itemName });
                    }
                    var series = [
                        {
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: arrData
                        }
                    ];
                    _this.chart.setSeries(series, true);
                }
                //_this.screen.spinnerStop();
            }).error(function (e) {
                _this.screen.alertNoData();
                _this.spinnerStop();
            });
        }, 60000);
    };

    AnlzPieRealtime.prototype.render = function (data) {
        var arrLabel = [], arrData = [];
        for (var i = 0, item; i < data.length; i++) {
            item = data[i];
            var itemName = AppConfig.datasource.getDSItemById(item.dsItemId).alias;
            arrLabel.push(itemName);
            arrData.push({ value: parseFloat(item.data), name: itemName });
        }

        var option = {
            title: {
                text: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: arrLabel
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            series: [
                {
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: arrData
                }
            ],
            animationDuration: this.chartAnimationDuration,
            animationDurationUpdate: this.chartAnimationDuration
        };
        this.chart = echarts.init(this.paneChart).setOption(option);
    };

    return AnlzPieRealtime;
})();

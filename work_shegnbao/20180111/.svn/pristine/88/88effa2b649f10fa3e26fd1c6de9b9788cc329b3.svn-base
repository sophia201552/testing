var ModalRealTimeAndHistoryChart = (function () {
    function ModalRealTimeAndHistoryChart(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.projectId = AppConfig.projectId;
    }
    ModalRealTimeAndHistoryChart.prototype = new ModalBase();
    ModalRealTimeAndHistoryChart.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_AND_HISTORY_CHART',
        parent: 0,
        mode: 'custom',
        maxNum: 5,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalRealTimeAndHistoryChart',
        scroll: true,
        needRefresh: false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };
    ModalRealTimeAndHistoryChart.prototype.configModalOptDefault = {
        "header": {
            "needBtnClose": true,
            "title": "配置"
        },
        "area": [{
                'type': 'option',
                widget: [{
                            type: 'text',
                            name: '标题内容',
                            id: 'chartTitle',
                            opt: {}
                        }]
                },{
                'type': 'option',
                widget: [{
                            type: 'text',
                            name: '单位',
                            id: 'unit',
                            opt: {}
                        }]
                },{
                    'type': 'option',
                    widget: [{
                        type: 'select',
                        name: '图表类型',
                        id: 'chartType',
                        opt: {
                            attr: {
                                class: 'form-inline'
                            },
                            option: [
                                { val: 'bar', name: '柱图' },
                                { val: 'line', name: '折线图' }
                            ]
                        }
                    }, {
                        type: 'color',
                        name: '折线颜色',
                        id: 'lineColor',
                        opt: {
                            attr: {
                                class: 'form-inline'
                            }
                        }
                    }]
                },{
                    "module": "dsDrag",
                    "data": [{
                        type: 'point',
                        name: '数据点位',
                        data: [],
                        forChart: false
                    }]
                }, {
                    'type': 'footer',
                    "widget": [{ type: 'confirm', opt: { needClose: false } }, { type: 'cancel' }]
                }
            ],
        "result": {}
    };
    ModalRealTimeAndHistoryChart.prototype.initConfigModalOpt = function() {
        var _this = this;
        //国际化
        this.configModalOptDefault.header.title = I18n.resource.modalConfig.TITLE;
        this.configModalOptDefault.area[0].widget[0].name = I18n.resource.modalConfig.option.MODIFY_CHART_TITLE;
        this.configModalOptDefault.area[1].widget[0].name = I18n.resource.modalConfig.option.UINT;
        this.configModalOptDefault.area[2].widget[0].name = I18n.resource.modalConfig.option.LABEL_CHART_SELECT;
        this.configModalOptDefault.area[2].widget[0].opt.option[0].name = I18n.resource.modalConfig.option.CHART_SELECT_BAR;
        this.configModalOptDefault.area[2].widget[0].opt.option[1].name = I18n.resource.modalConfig.option.CHART_SELECT_LINE;
        this.configModalOptDefault.area[2].widget[1].name = I18n.resource.modalConfig.option.CHART_LINE_COLOR;
        this.configModalOptDefault.area[3].data[0].name = I18n.resource.modalConfig.data.DATA_CONFIG_TITLE;

        if (this.entity.modal.option) {
            this.configModalOpt.area[0].widget[0].opt.data = this.entity.modal.option.chartTitle;
            this.configModalOpt.area[1].widget[0].opt.data = this.entity.modal.option.unit;
            this.configModalOpt.area[3].data[0].data = this.entity.modal.option.dsItemIds;
            this.configModalOpt.area[2].widget[0].data = { val: this.entity.modal.option.chartType };
            this.configModalOpt.area[2].widget[1].opt.data = this.entity.modal.option.lineColor;
        }
        this.configModalOpt.result.func = function(option) {
            _this.setModalOption(option);
            _this.configModal.hide();
            _this.updateRealTimeModal();
            _this.renderModal();
        }
    };
    ModalRealTimeAndHistoryChart.prototype.setModalOption = function(option) {
        this.entity.modal.interval = 5;
        this.entity.modal.points = option.points[0];
        this.entity.modal.option = {
            unit: option.unit.val,
            dsItemIds: option.points[0],
            chartType: option.chartType.val,
            chartTitle: option.chartTitle.val,
            lineColor: option.lineColor.val
        };
    };
    ModalRealTimeAndHistoryChart.prototype.showConfigMode = function() {

    };
    ModalRealTimeAndHistoryChart.prototype.layout = function () { 
        var titleName = this.entity.modal.option.chartTitle;
        var unit = this.entity.modal.option.unit;
        var dom = `<div class="realTimeHistoryCtn">
                        <div class="textCtn">
                            <div class="realTimeCtn">
                                <span class="realTimeVal"></span>
                                <span class="unit">${unit}</span>
                            </div>
                            <div class="topTitle">
                                <span class="titleName">${titleName}</span>
                                <span class="glyphicon glyphicon-info-sign"></span>
                            </div>
                        </div>
                        <div class="historyChart"></div>
                    </div>`;
        if ($(this.container).find('.dashboardCtn').length !== 0){
            $(this.container).find('.dashboardCtn').html(dom);
        } else {
            $(this.container).html(dom);
        }
    };
    ModalRealTimeAndHistoryChart.prototype.resize = function() {
        this.chart && this.chart.resize();
    };
    ModalRealTimeAndHistoryChart.prototype.renderModal = function () {
        var _this = this;
        if (_this.entity.modal.option !== undefined){ 
            _this.layout();
            if (_this.entity.modal.option.dsItemIds) var pointsArr = _this.entity.modal.option.dsItemIds;
            var postData = {
                dsItemIds: pointsArr,
                timeStart: new Date().format("yyyy-MM-dd 00:00:00"),
                timeEnd: new Date().format("yyyy-MM-dd HH:mm:ss"),
                timeFormat: 'h1'
            }
            WebAPI.post("/analysis/startWorkspaceDataGenHistogram", postData).done(function (data) {
                var dataList = data.list[0].data;
                var time = data.timeShaft;
                _this.renderChart(dataList,time);
            });
        }
    };
    ModalRealTimeAndHistoryChart.prototype.updateModal = function (option) {
        var color = this.entity.modal.option.lineColor;
        var realTimeVal = Number(option[0].data).toFixed(1).replace(/(\d{1,2})(?=(\d{3})+\.)/g, '$1,');
        $(this.container).find('.realTimeVal').css({color:color}).html(realTimeVal);
    };
    ModalRealTimeAndHistoryChart.prototype.updateRealTimeModal = function () {
        var _this = this;
        var color = _this.entity.modal.option.lineColor;
        if (_this.entity.modal.option !== undefined){
            if (_this.entity.modal.option.dsItemIds) var pointsArr = _this.entity.modal.option.dsItemIds;
            var postData = {
                "dsItemIds": pointsArr
            }
            WebAPI.post("/analysis/startWorkspaceDataGenPieChart", postData).done(function (data) {
                var realTimeVal = Number(data.dsItemList[0].data).toFixed(1).replace(/(\d{1,2})(?=(\d{3})+\.)/g, '$1,');
                 $(_this.container).find('.realTimeVal').css({color:color}).html(realTimeVal);
            });
        }
    };
    ModalRealTimeAndHistoryChart.prototype.renderChart = function (data, time) {
        var chartType = this.entity.modal.option.chartType;
        if (chartType === 'bar'){
             var option = {
                tooltip: {},
                xAxis: {
                    show: false,
                    data: time
                },
                visualMap: {
                    show: false,
                    min: 0,
                    max: 15,
                    dimension: 0,
                    inRange: {
                        color: ['rgba(4, 160, 214, 0.8)', 'rgba(16, 157, 131, 0.8)', 'rgba(254, 197, 0, 0.8)', 'rgba(226, 88, 58, 0.8)']
                    }
                },
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 0,
                    top: 12
                },
                yAxis: {
                    type: 'value',
                    name: 'y',
                    show: false,
                },
                series: [{
                    type: chartType,
                    data: data
                }]
            };
        } else {
            var lineColor = this.entity.modal.option.lineColor;
            var option = {
                color: [lineColor],
                tooltip: {},
                xAxis: {
                    show: false,
                    data: time
                },
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 0,
                    top: 12
                },
                yAxis: {
                    type: 'value',
                    name: 'y',
                    show: false,
                },
                series: [{
                    type: chartType,
                    data: data,
                    showSymbol: false,
                    symbol: 'none',
                    lineStyle: {
                        normal: {
                            width: 3,
                        }
                    }
                }]
            };
        }
        this.chart = echarts.init($(this.container).find('.historyChart')[0], AppConfig.chartTheme);
        this.chart.setOption(option);
    };
    return ModalRealTimeAndHistoryChart;
})()
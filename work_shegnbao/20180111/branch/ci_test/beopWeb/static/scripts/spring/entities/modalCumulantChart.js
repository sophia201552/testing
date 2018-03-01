var ModalCumulantChart = (function() {
    function ModalCumulantChart(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };
    ModalCumulantChart.prototype = new ModalBase();
    ModalCumulantChart.prototype.optionTemplate = {
        name: 'toolBox.modal.CUMULANT_CHART',
        parent: 0,
        mode: 'custom',
        maxNum: 5,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalCumulantChart',
        scroll: true,
        needRefresh: false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };
    ModalCumulantChart.prototype.configModalOptDefault = {
        "header": {
            "needBtnClose": true,
            "title": "配置"
        },
        "area": [{
                "module": 'timeConfig',

            },
            {
                'type': 'option',
                widget: [{
                        type: 'text',
                        name: '标题内容',
                        id: 'chartTitle',
                        opt: {}
                    },
                ]
            },
            {
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
                    },
                    {
                        type: 'checkbox',
                        name: '启用堆叠',
                        id: 'isStack',
                        opt: {}
                    }
                ]
            },
            {
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
    ModalCumulantChart.prototype.initConfigModalOpt = function() {
        var _this = this;
        //国际化
        this.configModalOptDefault.header.title = I18n.resource.modalConfig.TITLE;
        this.configModalOptDefault.area[1].widget[0].name = I18n.resource.modalConfig.option.MODIFY_CHART_TITLE;
        this.configModalOptDefault.area[2].widget[0].name = I18n.resource.modalConfig.option.LABEL_CHART_SELECT;
        this.configModalOptDefault.area[2].widget[0].opt.option[0].name = I18n.resource.modalConfig.option.CHART_SELECT_BAR;
        this.configModalOptDefault.area[2].widget[0].opt.option[1].name = I18n.resource.modalConfig.option.CHART_SELECT_LINE;
        this.configModalOptDefault.area[2].widget[1].name = I18n.resource.modalConfig.data.ENABLE_STACKING;
        this.configModalOptDefault.area[3].data[0].name = I18n.resource.modalConfig.data.DATA_CONFIG_TITLE;


        if (this.entity.modal.option) {
            this.configModalOpt.area[1].widget[0].opt.data = this.entity.modal.option.chartTitle;
            this.configModalOpt.area[3].data[0].data = this.entity.modal.option.dsItemIds;
            this.configModalOpt.area[2].widget[0].data = { val: this.entity.modal.option.chartType };
            this.configModalOpt.area[2].widget[1].data = this.entity.modal.option.isStack;
            (this.entity.modal.option.timeStart && this.entity.modal.option.timeEnd) && (this.configModalOpt.area[0].data = {
                mode: '1',
                timeStart: this.entity.modal.option.timeStart,
                timeEnd: this.entity.modal.option.timeEnd,
                interval: this.entity.modal.option.timeFormat
            });
            if (typeof this.entity.modal.option.timeRecent == 'string') {
                this.configModalOpt.area[0].data = {
                    mode: '0',
                    timeRecent: this.entity.modal.option.timeRecent,
                    interval: this.entity.modal.option.timeFormat
                }
            } else if (typeof this.entity.modal.option.timeRecent == 'object' &&
                this.entity.modal.option.timeRecent.hasOwnProperty('val') &&
                this.entity.modal.option.timeRecent.hasOwnProperty('unit')
            ) {
                this.configModalOpt.area[0].data = {
                    mode: '2',
                    timeRecent: this.entity.modal.option.timeRecent,
                    interval: this.entity.modal.option.timeFormat
                }
            }
        }
        this.configModalOpt.result.func = function(option) {
            _this.setModalOption(option);
            _this.configModal.hide();
            _this.renderModal();
        }
    };
    ModalCumulantChart.prototype.optionDefault = {

    };

    ModalCumulantChart.prototype.renderModal = function() {
        var timeConfig = generateTimeOption(this.entity.modal.option);
        var postData = {
            timeStart: timeConfig.timeStart,
            timeEnd: timeConfig.timeEnd,
            timeFormat: timeConfig.timeFormat,
            dsItemIds: timeConfig.dsItemIds
        };
        var _this = this;
        var intervalTime = 0;
        switch (postData.timeFormat) {
            case 'm1':
                intervalTime = 60000;
                break;
            case 'm5':
                intervalTime = 300000;
                break;
            case 'h1':
                intervalTime = 3600000;
                break;
            case 'd1':
                intervalTime = 86400000;
                break;
            case 'M1':
                intervalTime = 0;
                postData.timeStart = new Date(new Date(postData.timeStart.replace(/-/g, '/')).setMonth(new Date(postData.timeStart.replace(/-/g, '/')).getMonth() - 1)).format('yyyy-MM-dd HH:mm:ss')
                break;
        }
        if (intervalTime) {
            postData.timeStart = new Date(+new Date(postData.timeStart.replace(/-/g, '/')) - intervalTime).format('yyyy-MM-dd HH:mm:ss')
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram/increment', postData).done(function(result) {
            var arrLegend = _this.entity.modal.option.dsItemIds.map(function(point) {
                var point = AppConfig.datasource.getDSItemById(point);
                return (point.alias ? point.alias : point.value);
            });
            if (!result.list) {
                // _this.spinner.stop();
                return;
            }
            var arrSeries = [];
            for (var i = 0; i < result.list.length; i++) {
                arrSeries.push({
                    name: arrLegend[i],
                    type: _this.entity.modal.option.chartType,
                    areaStyle: { normal: {} },
                    stack: _this.entity.modal.option.isStack,
                    data: result.list[i].data.map(function(data) {
                        var val = parseFloat(data);
                        if (!(isNaN(val)) && val > 0) {
                            return val.toFixed(2);
                        } else {
                            return 0
                        }
                    })
                });
            }
            var isBeyondDay = false;
            try {
                if (new Date(result.timeShaft[1].replace(/-/g, '/')).format('yyyy-MM-dd') != new Date(result.timeShaft[result.timeShaft.length - 1].replace(/-/g, '/')).format('yyyy-MM-dd')) {
                    isBeyondDay = true
                }
            } catch (e) {}
            var opt = {
                title: {
                    text: _this.entity.modal.option.chartTitle,
                    left: 'center',
                    textStyle:{
                        color:'#aaaaaa'
                    }
                }, 
                legend: {
                    data: arrLegend,
                    top: 40
                },
                grid: {
                    left: 40,
                    right: 20,
                    top: 80
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function() {
                        var data = arguments[0]
                        date = new Date(data[0].name.replace(/-/g, '/'))
                        var str = '';
                        str += date.timeFormat('yyyy-mm-dd', AppConfig.projectTimeFormat) + ' ' + date.format('HH:mm:ss');
                        data.forEach(function(series) {
                            str += '</br>' + series.seriesName + ' : ' + series.data
                        })
                        return str
                    }
                },
                //toolbox:{
                //    show:true,
                //    feature:{
                //        magicType:['line', 'bar', 'stack']
                //    }
                //},
                toolbox: {
                    showTitle: true,
                    feature: {
                        magicType: {
                            type: ['line', 'bar', 'stack', 'tiled']
                        }
                    },
                    left: 'left'
                },
                xAxis: {
                    //data: result.timeShaft ? result.timeShaft.map(function(item) { return timeFormat(new Date(item.replace(/-/g, '/')), timeFormatChange('mm-dd hh:ii')); }) : [],
                    data: result.timeShaft ? result.timeShaft.slice(0,-1) : [],
                    type: 'category',
                    axisLabel: {
                        formatter: function(value, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            var date = new Date(value.replace(/-/g, '/'));
                            var texts, textsDiff;
                            if (index === 0) {
                                switch (postData.timeFormat) {
                                    case 'm1':
                                    case 'm5':
                                    case 'h1':
                                        texts = new Date(date).timeFormat('yyyy-mm-dd', AppConfig.projectTimeFormat) + '\n' + date.format('HH:mm');
                                        break;
                                    case 'd1':
                                        // if (preDate.getFullYear() == date.getFullYear()) {
                                        //     texts = new Date(date).timeFormat('mm-dd', AppConfig.projectTimeFormat);
                                        // } else {
                                        //     texts = new Date(date).timeFormat('yyyy-mm-dd', AppConfig.projectTimeFormat);
                                        // }
                                        texts = new Date(date).timeFormat('yyyy-mm-dd', AppConfig.projectTimeFormat);
                                        break;
                                    case 'M1':
                                        texts = new Date(date).timeFormat('yyyy-mm', AppConfig.projectTimeFormat);
                                        break;
                                    default:
                                        texts = new Date(date).format('yyyy-MM-dd HH:mm')
                                        break;
                                }
                                // if (postData.timeFormat == 'M1') {
                                //     texts = new Date(date).timeFormat('yyyy-mm', AppConfig.projectTimeFormat);
                                // } else {
                                //     texts = new Date(date).timeFormat('mm-dd', AppConfig.projectTimeFormat) + '\n' + date.format('HH:mm');
                                // }
                            } else {
                                var preDate = new Date(result.timeShaft[index - 1].replace(/-/g, '/'));
                                switch (postData.timeFormat) {
                                    case 'm1':
                                    case 'm5':
                                    case 'h1':
                                        if (isBeyondDay) {
                                            texts = new Date(date).timeFormat('mm-dd', AppConfig.projectTimeFormat) + '\n' + date.format('HH:mm');
                                        } else {
                                            texts = date.format('HH:mm');
                                        }
                                        break;
                                    case 'd1':
                                        // if (preDate.getFullYear() == date.getFullYear()) {
                                        //     texts = new Date(date).timeFormat('mm-dd', AppConfig.projectTimeFormat);
                                        // } else {
                                        //     texts = new Date(date).timeFormat('yyyy-mm-dd', AppConfig.projectTimeFormat);
                                        // }
                                        texts = new Date(date).timeFormat('mm-dd', AppConfig.projectTimeFormat);
                                        break;
                                    case 'M1':
                                        texts = new Date(date).timeFormat('yyyy-mm', AppConfig.projectTimeFormat);
                                        break;
                                    default:
                                        texts = new Date(date).format('yyyy-MM-dd HH:mm')
                                        break;
                                }
                                // if (preDate.format('yyyy-MM-dd') != date.format('yyyy-MM-dd')) {
                                //     if (preDate.getFullYear() == date.getFullYear()) {
                                //         texts = new Date(date).timeFormat('mm-dd', AppConfig.projectTimeFormat) + '\n' + texts;
                                //     } else {
                                //         texts = new Date(date).timeFormat('yyyy-mm-dd', AppConfig.projectTimeFormat) + '\n' + texts;
                                //     }
                                // }
                            }
                            return texts;
                        }

                    }
                },
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: function(value) { //格式化y轴数量
                            var len = parseInt(value).toString().length;
                            if (len >= 8) {
                                return value / 10000000 + 'B';
                            } else if (len >= 6) {
                                return value / 100000 + 'M';
                            } else if (len >= 4) {
                                return value / 1000 + 'k';
                            } else {
                                return value;
                            }
                        }
                    }
                }],
                series: arrSeries
            };
            if (AppConfig.isMobile) {
                opt.legend = {
                    data: arrLegend,
                    top: 10,
                    itemWidth: 15,
                    itemHeight: 10,
                    textStyle: {
                        fontSize: 12
                    }
                };
            }
            var chart = echarts.init(_this.container, AppConfig.chartTheme);
            chart.setOption(opt);
            // _this.spinner.stop();
        })
    };
    ModalCumulantChart.prototype.updateModal = function(points) {

    };
    ModalCumulantChart.prototype.showConfigMode = function() {

    };

    ModalCumulantChart.prototype.setModalOption = function(option) {
        this.entity.modal.interval = 5;
        this.entity.modal.points = option.points[0];
        this.entity.modal.option = {
            mode: option.mode,
            timeStart: option.timeStart,
            timeEnd: option.timeEnd,
            timeFormat: option.interval,
            dsItemIds: option.points[0],
            isStack: option.isStack ? 1 : 0,
            chartType: option.chartType.val,
            timeRecent: option.timeRecent,
            chartTitle: option.chartTitle.val
        };
    };
    ModalCumulantChart.prototype.goBackTrace = function(data) {

    };

    return ModalCumulantChart;
})();
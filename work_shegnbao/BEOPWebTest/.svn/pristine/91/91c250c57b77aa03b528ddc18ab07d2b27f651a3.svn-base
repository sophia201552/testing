var AnlzTendency = (function () {
    var _this;

    function AnlzTendency(container, option, screen) {
        AnlzBase.call(this, container, option, screen);

        this.paneLegend = undefined;
        // this.dropMaskLayer = undefined;
        this.dictLegend = {};
        this.dictTooltip = {};
        this.curIndex = 0;
        this.legendType = { NORMAL: 0, Prediction: 1, Regression: 2 };
        this.screen = screen;
        this.animation = true;
        this.timeType = !option ? 'h1' : option.format;
        if (this.screen.curModal.chartOption) {
            this.modifyData = this.screen.curModal.chartOption;
            if (!this.modifyData.chartName) {
                this.modifyData.chartName = '';
            }
            if (!this.modifyData.xUnit) {
                this.modifyData.xUnit = '';
            }
            if (!this.modifyData.yUnit) {
                this.modifyData.yUnit = '';
            }
            if (!this.modifyData.yMark) {
                this.modifyData.yMark = '';
            }
            if (!this.modifyData.yMax) {
                this.modifyData.yMax = '';
            }
            if (this.modifyData.yMin || this.modifyData.yMin == 0) {//||this.modifyData.yMin!==0
                    this.modifyData.yMin=this.modifyData.yMin;
                } else {
                    this.modifyData.yMin='';
                }
        } else {
            this.modifyData = {};
        }
        _this = this;
    }

    AnlzTendency.prototype = new AnlzBase();

    AnlzTendency.prototype.optionTemplate = {
        imgName: 'anlsTendency.png',
        imgIndex: 0,
        imgColor: '65,131,189',
        templateName: 'analysis.modalType.TENDENCY',
        templateParams: {paraName:['X'],paraAnlysMode:'all'},
        chartConfig: ['easy','fixed','recent']
    };

    AnlzTendency.prototype.show = function () {
        this.container.innerHTML = '';

        this.initTools();

        // 初始化便签
        this.$paneNotes = $('<div style="position: relative; width: 100%; height: 100%;">');
        this.paneNotes = this.$paneNotes[0];
        // 初始化 docker
        this.$parentContainer = $(this.container).parent();
        this.$parentContainer.append($('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">').append(this.paneNotes));
        this.initDock();

        //初始化画板
        $('#graphBox').hide();
        $('.graphActive').click();
        this.$svgBox = $('<div class="svgBox" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>');
        this.$parentContainer.append(this.$svgBox);
        //編輯图表信息按钮显示
        $('#chartModify').hide();
        $('#btnDataFilter').hide();
        if (this.container.id === 'anlsPane' && !$(this.container).hasClass('panel-readonly')) {
            $('#chartModify').show();
            $('#btnDataFilter').show();
        }
        _this.modifyEcharts();
        //_this.createGraphs();
        //显示图形集合
        if (!this.screen.curModal.graphList) {
            this.screen.curModal.graphList = [];
        } else {
            _this.initGraphs(this.screen.curModal.graphList);
        }

        if (!this.screen.curModal.noteList) {
            this.screen.curModal.noteList = [];
        } else {
            this.initNotes(this.screen.curModal.noteList);
        }
        $('.itemTools .glyphicon-bookmark').off('click').click(function () {
            _this.createNote();
        });

        var temp, wrap;
        this.paneChart = document.createElement('div');
        this.paneChart.className = 'divPaneChart';
        temp = this.paneChart.style;
        temp.cssFloat = 'left';
        temp.width = '100%';
        temp.height = 'calc(100% - 170px)';

        this.paneLegend = document.createElement('div');
        this.paneLegend.className = 'divHover';
        temp = this.paneLegend.style;
        temp.marginTop = '10px';
        temp.padding = '10px';
        temp.cssFloat = 'left';
        temp.width = '100%';
        temp.height = '160px';
        temp.position = 'relative';
        // temp.bottom = '0px';
        // temp.overflowY = 'scroll';

        // this.dropMaskLayer = document.createElement('div');
        // this.dropMaskLayer.id = 'dropMaskLayer'

        // var wrap = document.createElement('div');
        // wrap.style.position = 'relative';
        // wrap.style.width = '100%';
        // wrap.style.height = '100%';

        this.container.appendChild(this.paneChart);
        this.container.appendChild(this.paneLegend);
        // this.container.appendChild(wrap);
        // this.paneLegend.appendChild(this.dropMaskLayer);

        if(this.isShareMode === 1) $(this.container).addClass('read-mode');
        
        temp = null;
        _this.spinnerRender.spin(this.container.parentElement);
        this.init();
    };

    //修改Echart图
    AnlzTendency.prototype.modifyEcharts = function () {
        var _this = this;
        var $modifyLayer = $('.modifyLayer');
        if ($modifyLayer.length === 0) {
            $modifyLayer = $('<div class="modal fade modifyLayer" style="position:absolute;z-index:151;"><div class="modal-dialog" style="width:65%;"><div class="modal-content">' +
                '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title">' + I18n.resource.modalConfig.editChart.TITLE + '</h4></div>' +
                '<div class="modal-body">' +
                '<div width="100%" style="margin-top:20px;"><div style="width:92%;padding:0 4%;font-size:16px;line-height:24px;margin:10px 0 10px 4%;"><span style="display:inline-block;width:100px;text-align:right">' + I18n.resource.modalConfig.editChart.CHART_NAME + ':</span><input type="text" id="changeEchName" style="display:inline-block;width:calc(92% - 110px);margin-left:10px;"/></div>' +
                '<div style="width:92%;padding:0 4%;font-size:16px;line-height:24px;margin:10px 0 10px 4%;"><span style="display:inline-block;width:100px;text-align:right">' + I18n.resource.modalConfig.editChart.X_AXIS_UNIT + ':</span><input type="text" id="addXUnit" style="display:inline-block;width:calc(92% - 110px);margin-left:10px;"/></div>' +
                '<div style="width:92%;padding:0 4%;font-size:16px;line-height:24px;margin:10px 0 10px 4%;"><span style="display:inline-block;width:100px;text-align:right">' + I18n.resource.modalConfig.editChart.Y_AXIS_UNIT + ':</span><input type="text" id="addYUnit" style="display:inline-block;width:calc(92% - 110px);margin-left:10px;"/></div>' +
                '<div style="width:92%;padding:0 4%;font-size:16px;line-height:24px;margin:10px 0 10px 4%;"><span style="display:inline-block;width:100px;text-align:right">' + I18n.resource.modalConfig.editChart.Y_AXIS_SCALE + ':</span><input type="text" id="changeYMark" style="display:inline-block;width:calc(92% - 110px);margin-left:10px;"/></div>' +
                '<div style="width:92%;padding:0 4%;font-size:16px;line-height:24px;margin:10px 0 10px 4%;"><span style="display:inline-block;width:100px;text-align:right">' + I18n.resource.modalConfig.editChart.Y_AXIS_MAX + ':</span><input type="text" id="changeYMax" style="display:inline-block;width:calc(92% - 110px);margin-left:10px;"/></div>' +
                '<div style="width:92%;padding:0 4%;font-size:16px;line-height:24px;margin:10px 0 40px 4%;"><span style="display:inline-block;width:100px;text-align:right">' + I18n.resource.modalConfig.editChart.Y_AXIS_MIN + ':</span><input type="text" id="changeYMin" style="display:inline-block;width:calc(92% - 110px);margin-left:10px;"/></div></div>' +
                '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" id="modifyBtn">' + I18n.resource.modalConfig.editChart.BTN_CONFIRM + '</button></div>' +
                '</div></div></div>');
            $(_this.container).parents('#anlsPaneContain').append($modifyLayer);
        }
        $('#chartModify').off('click').click(function () {
            _this.modifyEcharts();
            if ($modifyLayer.is(':hidden')) {//visible
                $modifyLayer.modal('show');
                $('#changeEchName')[0].value = _this.modifyData.chartName ? _this.modifyData.chartName : '';
                $('#addXUnit')[0].value = _this.modifyData.xUnit ? _this.modifyData.xUnit : '';
                $('#addYUnit')[0].value = _this.modifyData.yUnit ? _this.modifyData.yUnit : '';
                $('#changeYMark')[0].value = _this.modifyData.yMark ? _this.modifyData.yMark : '';
                $('#changeYMax')[0].value = _this.modifyData.yMax ? _this.modifyData.yMax : '';
                $('#changeYMin')[0].value = (_this.modifyData.yMin === 0||_this.modifyData.yMin) ? _this.modifyData.yMin : '';
            } else {
                    $modifyLayer.modal('hide');
                }
                });
            $('#modifyBtn').off('click').click(function () {
                if ($('#addYUnit').val() == null || $('#addYUnit').val() == 0 || $('#addYUnit').val() == undefined) {
                    _this.modifyData.yUnit = '';
                } else {
                    //if (/^[0-9]{1,20}$/.test($('#addYUnit').val())) {
                    //    _this.yUnit = '';
                        //} else { 
                    _this.modifyData.yUnit = $('#addYUnit').val();
                        //}
            }
                if ($('#addXUnit').val() == null || $('#addXUnit').val() == 0 || $('#addXUnit').val() == undefined) {
                    _this.modifyData.xUnit = '';
                    } else {
                        //if (/^[0-9]{1,20}$/.test($('#addXUnit').val())) {
                    //    _this.xUnit = '';
                        //}else{
                        _this.modifyData.xUnit = $('#addXUnit').val();
                        //}
                    }
            if ($('#changeEchName').val() == null || $('#changeEchName').val() == 0 || $('#changeEchName').val() == undefined) {
                _this.modifyData.chartName = '';
                } else {
                _this.modifyData.chartName = $('#changeEchName').val();
            }
            if ($('#changeYMark').val() == null || $('#changeYMark').val() == 0 || $('#changeYMark').val() == undefined) {
                _this.modifyData.yMark = null;
            } else {
                if(isNaN($('#changeYMark').val())) {
                    _this.modifyData.yMark = null;
                    } else {
                    _this.modifyData.yMark = parseInt($('#changeYMark').val());
                    }
            }
            if ($('#changeYMax').val() == null || $('#changeYMax').val() == 0 || $('#changeYMax').val() == undefined) {
                _this.modifyData.yMax = null;
            } else {
                if(isNaN($('#changeYMax').val())) {
                    _this.modifyData.yMax =null;
                    } else {
                    _this.modifyData.yMax = parseInt($('#changeYMax').val());
                    }
                    }
            if ($('#changeYMin').val() == null || $('#changeYMin').val() == undefined) {
                _this.modifyData.yMin = null;
            } else {
                if (isNaN($('#changeYMin').val())) {//!/^\d+$/.test
                    _this.modifyData.yMin = null;
                    } else {
                    _this.modifyData.yMin = parseInt($('#changeYMin').val());
                }
                    }
            if (parseInt(_this.yMin) >= parseInt(_this.yMax)) {
                _this.modifyData.yMin = 0;
                _this.modifyData.yMax = 100;
            }
            _this.saveChartModify();
            $('.divPage.selected').trigger('click');
        });
    },
    AnlzTendency.prototype.saveChartModify = function () {
        _this.screen.curModal.chartOption = {
            chartName: _this.modifyData.chartName ? _this.modifyData.chartName: null,
            xUnit: _this.modifyData.xUnit ? _this.modifyData.xUnit: null,
            yUnit: _this.modifyData.yUnit ? _this.modifyData.yUnit: null,
            yMark: _this.modifyData.yMark ? parseInt(_this.modifyData.yMark): null,
            yMax: _this.modifyData.yMax ? parseInt(_this.modifyData.yMax): null,
            yMin: (_this.modifyData.yMin||_this.modifyData.yMin===0) ? parseInt(_this.modifyData.yMin): null
        }
        doSave();
        function doSave() {
            _this.screen.saveModal();
            _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1, _this.chart, $('#divWSPane .selected'), _this.screen.curModal, false]);
        }
    },
    AnlzTendency.prototype.close = function () {
        this.spinnerRender.stop();

        this.options = null;
        this.screen = null;

        this.dropMaskLayer = null;
        this.paneLegend = null;
        this.paneChart = null;

        this.chart = null;
        this.dictLegend = null;
        this.curIndex = null;

        this.$paneNotes.parent().remove();
        this.$paneNotes = null;
        this.paneNotes = null;
        $('.svgBox').remove();
        this.$svgBox = null;
        $('#graphBox').hide();
        $('#chartModify').hide();
        $('#btnDataFilter').hide();
        this.chartName = null;
        this.xUnit = null;
        this.yUnit = null;
        this.yMark = null;
        this.yMax = null;
        this.yMin = null;

        this.resetDock();
        this.$paneDock = null;
        this.$dockManager = null;
        this.$dockPreviewer = null;
        this.container = null;
    };

    AnlzTendency.prototype.init = function () {
        var _this = this;
        AppConfig.datasource.getDSItemData(this, this.screen.curModal.itemDS[0].arrId);

        this.paneLegend.ondragenter = function (e) {
            var $ele = $(_this.paneLegend);
            if( $ele.hasClass('dis') ) return;
            $ele.addClass('dragHover');
            e.stopPropagation();
            e.preventDefault();
        };
        this.paneLegend.ondragleave = function (e) {
            $(_this.paneLegend).removeClass('dragHover');
            e.stopPropagation();
            e.preventDefault();
        };
        this.paneLegend.ondragover = function (e) {
            e.preventDefault();
        };
        this.paneLegend.ondrop = function (e) {
            _this.spinnerRender.spin(_this.container.parentElement);
            var dsItemId = EventAdapter.getData().dsItemId;
            var $ele = $(_this.paneLegend);
            $ele.removeClass('dragHover dis');

            if (dsItemId) {
                if( $ele.find('[id="lg_'+dsItemId+'"]').length > 0 ) {
                    _this.spinnerStop();
                    return;
                }
                AppConfig.datasource.getDSItemData(_this, [dsItemId]);
            } else _this.spinnerStop();
        }

    };

    AnlzTendency.prototype.render = function (data) {
        this.chart ? this.refreshChart(data) : this.initChart(data);
        this.spinnerRender.stop();
    };

    AnlzTendency.prototype.initChart = function (data) {
        var arrSeries = [], legend = [];
        var series, item, i, option;
        for (i = 0; i < data.list.length; i++) {
            item = data.list[i];
            series = this.createSeries(item.dsItemId, item.data);
            legend.push(series.name);
            arrSeries.push(series);
        }

        option = this.initOption(arrSeries, data.timeShaft);
        if(this.isShareMode === 1) option.legend = {data: legend};

        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme).setOption(option);
        this.showFilterCharts();
    };

    AnlzTendency.prototype.initOption = function (series, timeSHaft) {
        var i18nEcharts = I18n.resource.echarts;
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                x: 60, x2: 20, y: 60, borderColor: '#eee'
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        show: true,
                        title : {
                            dataZoom : i18nEcharts.DATAZOOM,
                            dataZoomReset : i18nEcharts.DATAZOOMRESET
                        }
                    },
                    dataView: {
                        show: false,
                        readOnly: true,
                        title : i18nEcharts.DATAVIEW,
                        lang: [i18nEcharts.DATAVIEW, i18nEcharts.CLOSE, i18nEcharts.REFRESH]
                    },
                    magicType: {
                        show: true,
                        type: ['line', 'bar'],
                        title : {
                            line : i18nEcharts.LINE,
                            bar : i18nEcharts.BAR
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
            dataZoom: {
                show: true, start: 0, end: 100
            },
            xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: timeSHaft,
                        axisLabel: {
                            formatter: '{value} '
                        }
                    }
            ],
            yAxis: [{
                type: 'value', scale: true, axisLabel: { formatter: '{value} '}
            }],//改变刻度（max-min）/yMark
            series: series,
            animation: this.animation,
            animationDuration: this.chartAnimationDuration,
            animationDurationUpdate: this.chartAnimationDuration / 4
        };
        if (this.modifyData&&this.modifyData.chartName) {
            option.title = { text: this.modifyData.chartName };
        }
        if (this.modifyData && this.modifyData.xUnit) {
            //option.xAxis[0].axisLabel.formatter = '{value}' + this.modifyData.xUnit;
            option.xAxis[0].name = this.modifyData.xUnit;
            option.xAxis[0].nameLocation = 'start';
        }
        if (this.modifyData && this.modifyData.yUnit) {
            //option.yAxis[0].axisLabel.formatter = '{value}' + this.modifyData.yUnit;
            option.yAxis[0].name = this.modifyData.yUnit; 
        }
        if (this.modifyData && this.modifyData.yMax) {
            option.yAxis[0].max = this.modifyData.yMax;
        }
        if (this.modifyData && this.modifyData.yMin !== null) {
            option.yAxis[0].min = this.modifyData.yMin;
        }
        if (this.modifyData && this.modifyData.yMark) {
            option.yAxis[0].splitNumber = (this.modifyData.yMax - this.modifyData.yMin) / this.modifyData.yMark;
        }
        return option;
    };

    AnlzTendency.prototype.refreshChart = function (data) {
        var arrData = [], item = data.list[0];
        if (this.dictLegend[item.dsItemId]) return;

        var arrTemp = this.chart.getSeries();
        arrTemp.push(this.createSeries(item.dsItemId, item.data));
        this.chart.setSeries(arrTemp);
        arrTemp = null;

        this.screen.curModal.itemDS[0].arrId.push(item.dsItemId);
        var _this = this;
        this.screen.saveModal();
    };

    AnlzTendency.prototype.createSeries = function (id, data, type) {
        if (!type) type = this.legendType.NORMAL;

        var name, len;
        if (type == this.legendType.NORMAL) {
            name = AppConfig.datasource.getDSItemById(id).alias;
        }
        else {
            name = id.split('_');
            name = AppConfig.datasource.getDSItemById(name[0]).alias + '_' + id[1];
        }

        len = echarts.config.color.length;
        var color = echarts.config.color[this.curIndex % len];
        this.curIndex ++;
        var div = this.renderLegend(id, name, type, color);
        if ('h1' == this.timeType || 'm5' == this.timeType) {
            var tipInf = this.getStatisticsInfo(data);
            if (Boolean(tipInf)) {
                this.initTendencyTips($(div), tipInf.max, tipInf.min, tipInf.avg, tipInf.sum);
            }
        }

        return {
            id: id,
            name: name,
            type: 'line',
            symbol: 'none',
            data: data,
            itemStyle: { normal: { lineStyle: { color: color } } }
        }
    };

    AnlzTendency.prototype.refreshChartFilter = function (data, condition) {
        var arrData = [], item = data.list[0];
        if (this.dictLegend[item.dsItemId]) return;

        //var newId = (+new Date()).toString();
        var newFilterId = item.dsItemId + '_filter';
        var arrTemp = this.chart.getSeries();

        var bFilterFind = false;
        for (var i = 0, len = arrTemp.length; i < len; i++) {
            if (newFilterId == arrTemp[i].id) {
                bFilterFind = true;
                break;
            }
        }
        if (bFilterFind) {
            arrTemp[i].data = item.data;

            // change tooltips
            var $div = $('#lg_' + newFilterId);
            var tip = $div.data('bs.tooltip').$tip;
            if (tip) {
                var tipInf = this.getStatisticsInfo(item.data);
                tip.find('.filterMax').text(I18n.resource.observer.widgets.MAXIMUM + ': ' + tipInf.max);
                tip.find('.filterMin').text(I18n.resource.observer.widgets.MINIMUM + ': ' + tipInf.min);
                tip.find('.filterAvg').text(I18n.resource.observer.widgets.AVERAGE + ': ' + tipInf.avg);
                tip.find('.filterSum').text(I18n.resource.observer.widgets.TOTAL_AMOUNT + ': ' + tipInf.sum);
                tip.find('.filterCondition').text(I18n.resource.observer.widgets.FILTER_FORMULA + ': ' + condition);
            }

            // remove append charts
            var appendId = item.dsItemId + '_append';
            var arrAppend = [];
            for (var i = 0, len = arrTemp.length; i < len; i++) {
                if (appendId == arrTemp[i].id) {
                    arrAppend.push(i);
                }
            }
            if (arrAppend.length > 0) {
                for (var j = 0, len2 = arrAppend.length; j < len2; j++) {
                    arrTemp.splice(arrAppend[j], 1);
                }
                var opt = this.chart.getOption();
                opt.series = arrTemp;
                this.chart.clear();
                this.chart.setOption(opt);
            }
        }
        else {
            arrTemp.push(this.createSeriesFilter(item.dsItemId, item.data, newFilterId, condition));
            this.chart.setOption({series: arrTemp});
        }
        arrTemp = null;
        this.spinnerRender.stop();
    };

    AnlzTendency.prototype.createSeriesFilter = function (id, data, newId, condition) {
        var name, len;
        name = AppConfig.datasource.getDSItemById(id).alias + '_filter';

        len = echarts.config.color.length;
        var color = echarts.config.color[this.curIndex % len];
        this.curIndex++;
        var div = this.renderLegend(newId, name, 0, color);
        if ('h1' == this.timeType || 'm5' == this.timeType) {
            var tipInf = this.getStatisticsInfo(data);
            if (Boolean(tipInf)) {
                this.initTendencyTipsFilter($(div), tipInf.max, tipInf.min, tipInf.avg, tipInf.sum, condition);
            }
        }

        return {
            id: newId,
            name: name,
            type: 'line',
            symbol: 'none',
            data: data,
            itemStyle: { normal: { lineStyle: { color: color } } }
        }
    };

    AnlzTendency.prototype.removeSeries = function (id) {
        var _this = this;
        delete this.dictLegend[id];
        $('#lg_' + id).remove();

        var option = this.chart.getOption();
        var arrSeries = option.series;
        for (var i = 0; i < arrSeries.length; i++) {
            if (arrSeries[i].id == id) {
                arrSeries.splice(i, 1);
                break;
            }
        }

        var arrIds = this.screen.curModal.itemDS[0].arrId;
        for (var i = 0; i < arrIds.length; i++) {
            if (arrIds[i] == id) {
                arrIds.splice(i, 1);
            }
        }
        this.screen.curModal.itemDS[0].arrId = arrIds;
        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme).setOption(this.initOption(arrSeries, option.xAxis[0].data));
        window.setTimeout(function () {
            _this.screen.saveModal();
            _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1,_this.chart,$('#divWSPane .selected'),_this.screen.curModal,true]);
        }, 500);
    };

    AnlzTendency.prototype.getDataById = function (id) {
        var arrSeries = this.chart.getSeries();
        for (var i = 0; i < arrSeries.length; i++) {
            if (arrSeries[i].id == id) {
                return arrSeries[i].data;
            }
        }
    };

    //pe: enmu, this.legendType
    AnlzTendency.prototype.renderLegend = function (id, name, type, color) {
        var _this = this;

        var name = name;
        var div = document.createElement("div");
        var closeBtn = '<button type="button" class="close"><span>&times;</span></button>';
        
        div.id = 'lg_'+id;
        div.dataset.id = id;
        div.className = "divLegend";
        div.draggable = true;
        div.style.backgroundColor = color;

        div.setAttribute('ty', type);
        switch (type) {
            case this.legendType.Regression: {
                div.innerHTML = "<div class='divTxtWrap'><span class='glyphicon glyphicon-retweet' style='margin-right: 10px;'></span>" + name.split('_Regression_')[0] + "_Regression</div>" + closeBtn;
                this.initGeneralRegressorTooltip(id, div);
            }; break;
            case this.legendType.Prediction: {
                div.innerHTML = "<div class='divTxtWrap'><span class='glyphicon glyphicon-retweet' style='margin-right: 10px;'></span>" + name.split('_Prediction_')[0] + "_Prediction</div>" + closeBtn;
                this.initGeneralPredictorTooltip(id, div);
            }; break;
            default: {
                div.innerHTML = "<div class='divTxtWrap'><span class='glyphicon glyphicon-stats' style='margin-right: 10px;'></span>" + name + '</div>'+ closeBtn
            }; break
        }

        div.getElementsByClassName('close')[0].onclick = function (e) {
            var $ele = $(e.currentTarget).parent();
            var id = $ele[0].dataset.id;
            if ($('.divLegend').length > 1) {
                $ele.tooltip('destroy');
                _this.removeSeries(id);

                var cnt = id.indexOf('_filter');
                if (-1 != cnt) {
                    var preId = id.substr(0, cnt);
                    if (preId) {
                        _this.removeSeries(preId + '_append');
                    }
                }
            } else {
                alert('The only parameters can\'t be removed');
            }
            e.stopPropagation();
        };

        div.ondragstart = function (e) {
            $(_this.paneLegend).addClass('dis');
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("id", e.currentTarget.dataset.id);
            e.dataTransfer.setData("source", "legend");
        };
        div.ondragenter = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        div.ondragover = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        div.ondrop = function (e) {
            var srcId = e.dataTransfer.getData('id');
            var toId = e.currentTarget.dataset.id;
            $(_this.paneLegend).removeClass('dis');
            e.stopPropagation();
            if(srcId === '' || srcId === toId) return;
            var source = e.dataTransfer.getData("source");
            if (source && source == "legend") {
                if (e.currentTarget.getAttribute('ty') == _this.legendType.Regression)
                    generatePredictor(e, srcId, toId);
                else
                    generateRegressor(e, srcId, toId);
            }

            function generateRegressor(e, sourceId, targetId) {
                var data = {
                    source: [_this.getDataById(sourceId).map(function (row, i) {return row+'';})],
                    target: _this.getDataById(targetId).map(function (row, i) {return row+'';}),
                    sourceNames: sourceId,
                    targetName: targetId
                };
                _this.spinnerRender.spin(_this.container.parentElement);
                WebAPI.post('/analysis/generalRegressor', data).done(function (result) {
                    var id = targetId + "_Regression_" + (+new Date());
                    var data = JSON.parse(result);
                    var arrTemp = _this.chart.getSeries();
                    data.SourceId = sourceId;
                    data.TargetId = targetId;

                    _this.dictTooltip[id] = data;
                    arrTemp.push(_this.createSeries(id, data.PredicatedResults, _this.legendType.Regression));
                    _this.chart.setSeries(arrTemp);
                    arrTemp = null;
                    _this.spinnerRender.stop();
                }).error(function (result) {
                    //new Alert($("#" + targetName + "-" + targetIndex), "danger", " 回归失败").show().close();
                    _this.spinnerRender.stop();
                });
            }

            function generatePredictor(e, sourceId, targetId) {
                var arrCoefficient = _this.dictTooltip[e.currentTarget.dataset.id].Coefficients;
                for (var i = 0; i < arrCoefficient.length; i++) arrCoefficient[i] = arrCoefficient[i].toString();

                var data = {
                    source: [_this.getDataById(sourceId).map(function (row, i) {return row+'';})],
                    Coefficients: arrCoefficient
                };
                _this.spinnerRender.spin(_this.container.parentElement);
                WebAPI.post('/analysis/generalPredictor', data).done(function (result) {
                    var id = targetId.split('_')[0] + "_Prediction_" + (+new Date());
                    var arrTemp = _this.chart.getSeries();
                    var data = JSON.parse(result);
                    if (data.PredicatedResults) {
                        arrTemp.push(_this.createSeries(id, data.PredicatedResults, _this.legendType.Prediction));
                        _this.chart.setSeries(arrTemp);
                    }
                    _this.spinnerRender.stop();
                }).error(function (result) {
                    //new Alert($("#" + targetName + "-" + targetIndex), "danger", " 预测生成失败").show().close();
                    _this.spinnerRender.stop();
                });
            }
        }

        this.paneLegend.appendChild(div);
        return div;
    };

    AnlzTendency.prototype.initGeneralRegressorTooltip = function (id, element) {
        var data = this.dictTooltip[id];

        var sb = new StringBuilder();
        sb.append('<div class="tooltip" role="tooltip" style="position: fixed;">');
        sb.append('    <div class="tooltipTitle tooltip-inner">GeneralRegressor</div>');
        sb.append('    <div class="tooltipContent">');
        sb.append('        <p style="white-space:nowrap;">RSquared: ').append(data.RSquared).append('</p> ');
        sb.append('        <p>Formula: </p><p style="margin-left: 20px; white-space:nowrap;">').append(data.Formula).append('</p> ');
        sb.append('        <p style="margin-left: 20px; white-space:nowrap;">x: ').append(AppConfig.datasource.getDSItemById(data.SourceId).alias).append('</p>');
        sb.append('        <p style="margin-left: 20px; white-space:nowrap;">y: ').append(AppConfig.datasource.getDSItemById(data.TargetId).alias).append('</p>');
        sb.append('    </div>');
        sb.append('    <div class="tooltip-arrow"></div>');
        sb.append('</div>');

        var options = {
            placement: 'top',
            title: 'GeneralRegressor',
            template: sb.toString()
        };

        $(element).tooltip(options);
    };

    AnlzTendency.prototype.initGeneralPredictorTooltip = function (id, element) {
        var data = this.dictTooltip[id];

        var sb = new StringBuilder();
        sb.append('<div class="tooltip" role="tooltip" style="position: fixed;">');
        sb.append('    <div class="tooltipTitle tooltip-inner">GeneralPredictor</div>');
        sb.append('    <div class="tooltipContent">');
        sb.append('        <p style="white-space:nowrap;">Source: ').append(AppConfig.datasource.getDSItemById(id.split('_')[0]).alias).append('</p> ');
        sb.append('    </div>');
        sb.append('    <div class="tooltip-arrow"></div>');
        sb.append('</div>');

        var options = {
            placement: 'top',
            title: 'GeneralPredictor',
            template: sb.toString()
        };

        $(element).tooltip(options);
    };

    AnlzTendency.prototype.initTendencyTips = function (parent, max, min, avg, sum) {
            var _this = this;

            var show = new StringBuilder();
            show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px;">');
            show.append('    <div class="tooltipTitle tooltip-inner">Statistics</div>');
            show.append('    <div class="tooltipContent">');
            show.append('        <p style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.MAXIMUM).append('</span>: ').append(max).append('</p>');
            show.append('        <p style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.MINIMUM).append('</span>: ').append(min).append('</p> ');
            show.append('        <p style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.AVERAGE).append('</span>: ').append(avg).append('</p> ');
            show.append('        <p style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.TOTAL_AMOUNT).append('</span>: ').append(sum).append('</p> ');
            show.append('    </div>');
            show.append('    <div class="tooltip-arrow"></div>');
            show.append('</div>');
            var options = {
                placement: 'top',
                title: I18n.resource.observer.widgets.PARAMETER,
                template: show.toString()
            };
            parent.tooltip(options);
    };

    AnlzTendency.prototype.initTendencyTipsFilter = function (parent, max, min, avg, sum, condition) {
            var _this = this;

            var show = new StringBuilder();
            show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px;">');
            show.append('    <div class="tooltipTitle tooltip-inner">Statistics</div>');
            show.append('    <div class="tooltipContent">');
            show.append('        <p class="filterMax" style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.MAXIMUM).append('</span>: ').append(max).append('</p>');
            show.append('        <p class="filterMin" style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.MINIMUM).append('</span>: ').append(min).append('</p> ');
            show.append('        <p class="filterAvg" style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.AVERAGE).append('</span>: ').append(avg).append('</p> ');
            show.append('        <p class="filterSum" style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.TOTAL_AMOUNT).append('</span>: ').append(sum).append('</p> ');
            show.append('        <p class="filterCondition" style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.FILTER_FORMULA).append('</span>: ').append(condition).append('</p> ');
            show.append('    </div>');
            show.append('    <div class="tooltip-arrow"></div>');
            show.append('</div>');
            var options = {
                placement: 'top',
                title: I18n.resource.observer.widgets.PARAMETER,
                template: show.toString()
            };
            parent.tooltip(options);
    };

    AnlzTendency.prototype.getStatisticsInfo = function (data) {
        if (!data || data.length <= 0) {
            return {'max':0, 'min':0, 'avg':0, 'sum':0};
        }
        var max = 0;
        var min = 0;
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i]) {
                max = data[i];
                min = data[i];
                break;
            }
        }
        var avg = 0;
        var sum = 0;
        var flag = 2;
        var len = data.length;
        var lenAct = len;
        if ('h1' == this.timeType) {
            for (var i=0; i<len; i++) {
                if (!data[i]) {
                    lenAct--;
                    continue;
                }
                if (data[i] > max) {
                    max = data[i];
                }
                if (data[i] < min) {
                    min = data[i];
                }
                sum += data[i];
            }
        }
        else if ('m5' == this.timeType) {
            for (var i=0; i<len; i++) {
                if (!data[i]) {
                    lenAct--;
                    continue;
                }
                if (data[i] > max) {
                    max = data[i];
                }
                if (data[i] < min) {
                    min = data[i];
                }
                if (0 == i%12) {
                    sum += data[i];
                }
            }
        }
        else {
            return null;
        }
        avg = sum / lenAct;
        return {'max':max, 'min':min, 'avg':avg.toFixed(flag), 'sum':sum.toFixed(flag)};
    };

    AnlzTendency.prototype.showFilterCharts = function () {
        for (var i = 0, len = this.options.arrFilter.length; i < len; i++) {
            var item = this.options.arrFilter[i];
            for (var j = 0, len2 = item.appendData.length; j < len2; j++) {
                if (!item.appendData[j]) {
                    item.appendData[j] = undefined;
                }
            }
            for (var k = 0, len3 = item.filterDrawObj.list[0].data.length; k < len3; k++) {
                if (!item.filterDrawObj.list[0].data[k]) {
                    item.filterDrawObj.list[0].data[k] = undefined;
                }
            }
            if (item.filterDrawObj) {
                this.refreshChartFilter(item.filterDrawObj, item.filterCondition);
            }
            if (0 == item.showType) {// remove dotted line
                this.removeAppendCharts(item);
            }
            else {// draw dotted line
                this.setAppendCharts(item);
            }
        }
    };

    AnlzTendency.prototype.setAppendCharts = function (itemFilter) {
        var colorShow;
        var id = itemFilter.pointId;
        var idLen = id.length;
        var bFind = false;
        var arrSeriesTemp = this.chart.getSeries();
        for (var i = 0, len = arrSeriesTemp.length; i < len; i++) {
            var tempLen = arrSeriesTemp[i].id.length;
            var tempEx = (tempLen > idLen) ? (arrSeriesTemp[i].id.substr(idLen, tempLen - idLen)) : ('');
            if (arrSeriesTemp[i].id.substr(0, idLen) == id && '_filter' == tempEx) {
                bFind = true;
                colorShow = arrSeriesTemp[i].itemStyle.normal.lineStyle.color;
                break;
            }
        }
        if (bFind) {
            var itemAppend = {
                id: itemFilter.pointId + '_append',
                name: '',
                type: 'line',
                symbol: 'none',
                data: itemFilter.appendData,
                smooth: false,
                itemStyle: { normal: { lineStyle: { color: colorShow, width: 3, type:'dotted'} } }
            }
            var arrSeriesTemp = this.chart.getSeries();
            arrSeriesTemp.push(itemAppend);
            this.chart.setOption({series: arrSeriesTemp});
        }
        arrSeriesTemp = null;
    };

    AnlzTendency.prototype.removeAppendCharts = function (itemFilter) {
        var id = itemFilter.pointId;
        var idLen = id.length;
        var bFind = false;
        var arrSeriesTemp = this.chart.getSeries();
        for (var i = 0, len = arrSeriesTemp.length; i < len; i++) {
            var tempLen = arrSeriesTemp[i].id.length;
            var tempEx = (tempLen > idLen) ? (arrSeriesTemp[i].id.substr(idLen, tempLen - idLen)) : ('');
            if (arrSeriesTemp[i].id.substr(0, idLen) == id && '_append' == tempEx) {
                bFind = true;
                arrSeriesTemp.splice(i, 1);
                break;
            }
        }
        if (bFind) {
            var opt = this.chart.getOption();
            opt.series = arrSeriesTemp;
            this.chart.clear();
            this.chart.setOption(opt);
            //this.chart.setOption({series: arrSeriesTemp});
        }
        arrSeriesTemp = null;
    };

    return AnlzTendency;
})();
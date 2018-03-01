var AnlzTendency = (function () {
    var _this;
    function AnlzTendency(container, option, screen) {
        AnlzBase.call(this, container, option, screen);

        this.paneLegend = undefined;
        this.dictLegend = {};
        this.dictTooltip = {};
        this.curIndex = 0;
        this.legendType = { NORMAL: 0, Prediction: 1, Regression: 2 };
        this.screen = screen;
        _this = this;
    }

    AnlzTendency.prototype = new AnlzBase();

    AnlzTendency.prototype.optionTemplate = {
        imgName: 'anlsTendency.png',
        imgColor: '65,131,189',
        templateName: 'analysis.modalType.TENDENCY',
        templateParams: {paraName:['X'],paraAnlysMode:'all'},
        chartConfig: ['easy','fixed','recent']
    };

    AnlzTendency.prototype.show = function () {
        this.container.innerHTML = '';

        this.initTools();
        //TODO
        this.paneNotes = $('<div style="position: relative; width: 100%; height: 100%;">')[0];
        $(this.container).append($('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">').append(this.paneNotes));
        if (!this.screen.curModal.noteList) {
            this.screen.curModal.noteList = [];
        } else {
            this.initNotes(this.screen.curModal.noteList);
        }
        $('.itemTools .glyphicon-bookmark').off('click').click(function () {
            _this.createNote();
        });

        var temp;
        this.paneChart = document.createElement('div');
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
        temp.position = 'absolute';
        temp.bottom = '0px';

        this.container.appendChild(this.paneChart);
        this.container.appendChild(this.paneLegend);
        temp = null;
        _this.spinnerRender.spin(this.container);
        this.init();
    };

    AnlzTendency.prototype.close = function () {
        this.container = null;
        this.options = null;
        this.screen = null;

        this.paneLegend = null;
        this.paneChart = null;

        this.chart = null;
        this.dictLegend = null;
        this.curIndex = null;
    };

    AnlzTendency.prototype.init = function () {
        var _this = this;
        AppConfig.datasource.getDSItemData(this, this.screen.curModal.itemDS[0].arrId);

        this.paneLegend.ondragover = function (e) {
            e.currentTarget.classList.add('dragHover');
            return false;
        };
        this.paneLegend.ondragleave = function (e) {
            e.currentTarget.classList.remove('dragHover');
            return false;
        };
        this.paneLegend.ondrop = function (e) {
            _this.spinnerRender.spin(_this.container);
            var $ele = $(e.currentTarget);
            var dsItemId = e.dataTransfer.getData('dsItemId');
            e.currentTarget.classList.remove('dragHover');

            if (dsItemId) {
                if($ele.find('[id="'+dsItemId+'"]').length > 0) return;
                AppConfig.datasource.getDSItemData(_this, [e.dataTransfer.getData("dsItemId")]);
            }
        }

    };

    AnlzTendency.prototype.render = function (data) {
        this.chart ? this.refreshChart(data) : this.initChart(data);
    };

    AnlzTendency.prototype.initChart = function (data) {
        var arrSeries = [];
        for (var i = 0; i < data.list.length; i++) {
            var item = data.list[i];
            arrSeries.push(this.createSeries(item.dsItemId, item.data));
        }

        this.chart = echarts.init(this.paneChart).setOption(this.initOption(arrSeries, data.timeShaft));
        var _this = this;
    };

    AnlzTendency.prototype.initOption = function (series, timeSHaft) {
        return {
            tooltip: { trigger: 'axis' },
            grid: { x: 60, x2: 20, y: 60, borderColor: '#eee' },
            toolbox: {
                show: true,
                feature: {
                    magicType: { show: true, type: ['line', 'bar'] },
                    dataZoom: { show: true },
                    restore: { show: true },
                    saveAsImage: { show: true }
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
            animationDurationUpdate: this.chartAnimationDuration
        };
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

        var name;
        if (type == this.legendType.NORMAL) {
            name = AppConfig.datasource.getDSItemById(id).alias;
        }
        else {
            name = id.split('_');
            name = AppConfig.datasource.getDSItemById(name[0]).alias + '_' + id[1];
        }

        var color = echarts.config.color[this.curIndex++];
        this.renderLegend(id, name, type, color);

        return {
            id: id,
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
        $('#' + id).remove();

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
        this.chart = echarts.init(this.paneChart).setOption(this.initOption(arrSeries, option.xAxis[0].data));
        window.setTimeout(function () {
            _this.screen.saveModal();
            _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, _this.chart]);
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
        
        div.id = id;
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
            var id = $ele[0].id;
            if ($('.divLegend').length > 1) {
                $ele.tooltip('destroy');
                _this.removeSeries(id);
            } else {
                alert('The only parameters can\'t be removed');
            }
            e.stopPropagation();
        };

        div.ondragstart = function (e) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("id", e.currentTarget.id);
            e.dataTransfer.setData("source", "legend");
        };

        div.ondragover = function (e) {
            return false;
        };
        div.ondrop = function (e) {
            var srcId = e.dataTransfer.getData('id');
            var toId = e.currentTarget.id;
            e.stopPropagation();
            if(srcId === toId) return;
            var source = e.dataTransfer.getData("source");
            if (source && source == "legend") {
                if (e.currentTarget.getAttribute('ty') == _this.legendType.Regression)
                    generatePredictor(e, srcId, toId);
                else
                    generateRegressor(e, srcId, toId);
            }

            function generateRegressor(e, sourceId, targetId) {
                var data = {
                    source: [_this.getDataById(sourceId)],
                    target: _this.getDataById(targetId),
                    sourceNames: sourceId,
                    targetName: targetId
                };
                _this.spinnerRender.spin(_this.container);
                WebAPI.post('/analysis/generalRegressor', data).done(function (result) {
                    var id = targetId + "_Regression_" + +new Date();
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
                var arrCoefficient = _this.dictTooltip[e.currentTarget.id].Coefficients;
                for (var i = 0; i < arrCoefficient.length; i++) arrCoefficient[i] = arrCoefficient[i].toString();

                var data = {
                    source: [_this.getDataById(sourceId)],
                    Coefficients: arrCoefficient
                };
                _this.spinnerRender.spin(_this.container);
                WebAPI.post('/analysis/generalPredictor', data).done(function (result) {
                    var id = targetId.split('_')[0] + "_Prediction_" + +new Date();
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
    };

    AnlzTendency.prototype.initGeneralRegressorTooltip = function (id, element) {
        var data = this.dictTooltip[id];

        var sb = new StringBuilder();
        sb.append('<div class="tooltip" role="tooltip">');
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
        sb.append('<div class="tooltip" role="tooltip">');
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

    return AnlzTendency;
})();

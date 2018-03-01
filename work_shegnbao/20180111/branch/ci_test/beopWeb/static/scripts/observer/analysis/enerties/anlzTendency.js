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
        this.timeType = !option||!option.format ? 'h1' : option.format;
        this.options.xAxisData = this.options.xAxisData ? this.options.xAxisData : [];
        this.options.dataList = {};
        if (this.options.chartOption) {
            this.modifyData = this.options.chartOption;
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

        // store line data
        if (!this.options.dictShowData) {
            this.options.dictShowData = {}
        }
        this.dictShowData = this.options.dictShowData;
        for (var key in this.dictShowData) {
            for (var i = 0, len = this.dictShowData[key].length; i < len; i++) {
                this.dictShowData[key][i] = this.fillData(this.dictShowData[key][i]);
            }
        }

        // store line show or not
        if (!this.options.dictShowFlag) {
            this.options.dictShowFlag = {};
        }
        this.dictShowFlag = this.options.dictShowFlag;

        _this = this;
    }

    AnlzTendency.prototype = new AnlzBase();

    AnlzTendency.prototype.optionTemplate = {
        imgName: 'anlsTendency.png',
        imgIndex: 0,
        imgColor: '65,131,189',
        templateName: 'analysis.modalType.TENDENCY',
        templateParams: {paraName:['X','X2'],paraAnlysMode:'part'},
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

        $('#chartModify').hide();
        $('#btnDataFilter').hide();
        if (this.container.id === 'anlsPane' && !$(this.container).hasClass('panel-readonly')) {
            $('#chartModify').show();
            $('#btnDataFilter').show();
        }
        _this.modifyEcharts();
      
        //图元修改y轴参数默认隐藏
        $('#modifyChart .row').hide();

        if (!this.options.noteList) {
            this.options.noteList = [];
        } else {
            this.initNotes(this.options.noteList);
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


        //显示图形 遍历
        if (!this.screen.curModal.graphList) {
            this.screen.curModal.graphList = [];
        } else {
            var graphList = this.screen.curModal.graphList;
            var graph = undefined;
            var containerChilBox = '<div class="containerChi" style=""></div>';
            $(this.container).prepend(containerChilBox);
            $('.containerChi').css({width:'100%',height:'calc(100% - 210px)',position:'absolute',top:'20px',left:0});
            //var containerChilBox = $(this.container).append()
            for (var i = 0; i < graphList.length; i++) {
                if (graphList[i].type == 'arrow') {
                    graph = new DrawArrow(_this.screen, graphList[i], $(this.container).find('.containerChi'), '');
                } else if (graphList[i].type == 'rect') {
                    graph = new DrawRect(_this.screen, graphList[i], $(this.container).find('.containerChi'), '');
                } else if (graphList[i].type == 'circle') {
                    graph = new DrawCircle(_this.screen, graphList[i], $(this.container).find('.containerChi'), '');
                }
                graph.show();
            }
        }
    };

    //修改Echart图
    AnlzTendency.prototype.modifyEcharts = function () {
        var _this = this;
        var $modifyLayer = $('.modifyLayer');
        if ($modifyLayer.length === 0) {
            $modifyLayer = $('<div class="modal fade modifyLayer" style="position:absolute;z-index:151;"><div class="modal-dialog" style="width:65%;"><div class="modal-content">' +
                '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title">' + I18n.resource.modalConfig.editChart.TITLE + '</h4></div>' +
                '<div class="modal-body">'+
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
        _this.options.chartOption = {
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
            _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1, _this.chart, $('#divWSPane .selected'), _this.options, false]);
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
        $('#graphBox').hide();
        $('#chartModify').hide();
        $('#btnDataFilter').hide();
        $('#modifyChart .row').hide();
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
        var itemDSLength = this.options.itemDS ? this.options.itemDS.length : 0;
        var arrIdList = [];
        if (itemDSLength) {
            for (var j = 0; j < itemDSLength; j++) {
                var arrDsId = this.options.itemDS[j].arrId;
                if (arrDsId) {
                    for (var i = 0, len = arrDsId.length; i < len; i++) {
                        var bFind = false;
                        for (var key in this.dictShowFlag) {
                            if (key == arrDsId[i]) {
                                bFind = true;
                                break;
                            }
                        }
                        if (!bFind) {
                            this.dictShowFlag[arrDsId[i]] = true;
                        }
                    }
                }
            }
        }
        arrIdList = arrIdList.concat(this.options.itemDS[0].arrId);
        arrIdList = this.options.itemDS[1] ? arrIdList.concat(this.options.itemDS[1].arrId) : arrIdList;
        //var arrDsExistData = this.getExistDsData(this.options.itemDS[0].arrId);
        AppConfig.datasource.getDSItemData(this, arrIdList);//this.options.itemDS[0].arrId

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
                if (Object.prototype.toString.call(dsItemId) === '[object Array]') {
                    var len = dsItemId.length;
                    for (var i = 0, len = dsItemId.length; i < len; i++) {
                        if ($ele.find('[id="lg_' + dsItemId[i] + '"]').length > 0) {
                            //_this.spinnerStop();
                            dsItemId.splice(i,1);
                            len = len - 1;
                            i = i - 1;
                        }
                    }
                    if (dsItemId.length < 1) {
                        _this.spinnerStop();
                    } else {
                        AppConfig.datasource.getDSItemData(_this, dsItemId);
                    }
                } else {
                    if ($ele.find('[id="lg_' + dsItemId + '"]').length > 0) {
                        _this.spinnerStop();
                        return;
                    }
                    AppConfig.datasource.getDSItemData(_this, [dsItemId]);
                }
            } else _this.spinnerStop();
        }

    };

    AnlzTendency.prototype.render = function (data) {
        if (data) {
            this.chart ? this.refreshChart(data) : this.initChart(data);
        }
        this.spinnerRender.stop();
    };

    AnlzTendency.prototype.initChart = function (data) {
        var arrSeries = [], legend = [];
        var series, item, i, option;
        for (i = 0; i < data.list.length; i++) {
            item = data.list[i];
            series = this.createSeries(item.dsItemId, item.data);
            arrSeries.push(series);
        }

        // set filter charts
        this.showFilterCharts(arrSeries);

        // set legend
        for (i = 0; i < arrSeries.length; i++) {
            legend.push(arrSeries[i].name);
        }

        // store show charts data
        this.resetShowData(data, 0);

        // set show flag
        for (var key in this.dictShowFlag) {
            for (var j = 0, lenJ = arrSeries.length; j < lenJ; j++) {
                if (key == arrSeries[j].id) {
                    if (!this.dictShowFlag[key]) {
                        arrSeries[j].data = [];
                    }
                    break;
                }
            }
        }
        //判断点属于X或X2
        var itemDsList = this.options.itemDS;
        if (itemDsList[0].arrId && itemDsList.length > 1) {
            if (itemDsList[0].arrId.length>0&& itemDsList[1].arrId.length> 0) {
                for (var n = 0, len = itemDsList.length; n < len; n++) {
                    var item = itemDsList[n];
                    if (item) {
                        if (item.type === 'X2') {
                            var itemOneArrId = item.arrId;
                            for (var p = 0, lenP = itemOneArrId.length; p < lenP; p++) {
                                for (var m = 0, lenJ = arrSeries.length; m < lenJ; m++) {
                                    if (itemOneArrId[p] === arrSeries[m].id) {
                                        arrSeries[m].yAxisIndex = 1;
                                    }
                                }
                            }
                        } else if (item.type === 'X') {
                            continue;
                        }
                    }
                }
            }
        }

        option = this.initOption(arrSeries, data.timeShaft);
        if(this.isShareMode === 1) option.legend = {data: legend};

        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme);
        this.chart.setOption(option);
    };

    AnlzTendency.prototype.initOption = function (series, timeSHaft) {
        var i18nEcharts = I18n.resource.echarts;
        var option = {
            formatTime: false,//自定义时间格式
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                x: 60, x2: 60, y: 60,y2:70, borderColor: '#eee'
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
                        show: true,
                        readOnly: false,
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
                        lang: i18nEcharts.SAVE,
                        backgroundColor: (AppConfig.chartTheme == theme.Dark ? '#192234' : '#fafbfc')
                    }
                },
                showTitle:true
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
                            formatter: function(d){
                                return new Date(d).format(echarts.formatTimePattern);
                            }
                        }
                    }
            ],
            yAxis: [{
                type: 'value', scale: true,
                axisLabel: {
                    formatter: function (value) {
                        var ret;
                        if (value < 1000) {
                            ret = value;
                        }
                        else if (value < 1000000) {
                            ret = value / 1000 + 'k';
                        }
                        else {
                            ret = value / 1000000 + 'M';
                        }
                        return ret;
                    }
                },
                splitLine:{
                    lineStyle:{
                        opacity:0.8
                    }
                }
            }
        //    ,
        //    {
        //        type: 'value', scale: true,
        //        axisLabel: {
        //            formatter: function (value) {
        //                var ret;
        //                if (value < 1000) {
        //                    ret = value;
        //                }
        //                else if (value < 1000000) {
        //                    ret = value / 1000 + 'k';
        //                }
        //                else {
        //                    ret = value / 1000000 + 'M';
        //                }
        //                return ret;
        //            }
        //        }
        //}
        ],//改变刻度（max-min）/yMark
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
        if (this.modifyData && this.modifyData.yMin !== null && this.modifyData.yMin!=='') {
            option.yAxis[0].min = this.modifyData.yMin;
        }
        if (this.modifyData && this.modifyData.yMark) {
            option.yAxis[0].splitNumber = (this.modifyData.yMax - this.modifyData.yMin) / this.modifyData.yMark;
        }
        this.options.xAxisData = option.xAxis[0].data;
        //判断有几条y轴
        var itemDsList = this.options.itemDS;
        if (itemDsList.length > 1) {
            if (itemDsList[0].arrId.length > 0 && itemDsList[1].arrId.length > 0) {
                var yAxisTwo = {
                    type: 'value', scale: true,
                    axisLabel: {
                        formatter: function (value) {
                            var ret;
                            if (value < 1000) {
                                ret = value;
                            }
                            else if (value < 1000000) {
                                ret = value / 1000 + 'k';
                            }
                            else {
                                ret = value / 1000000 + 'M';
                            }
                            return ret;
                        }
                    },
                    splitLine:{
                        lineStyle:{
                            opacity:0
                        }
                    }
                }
                option.yAxis.push(yAxisTwo);
            } else {
                //当只有右侧轴时
                var isRight = 0;
                for (var i = 0; i < itemDsList.length; i++) {
                    var item = itemDsList[i]
                    if (item.type === 'X2' && item.arrId.length > 0) {
                        isRight += 1;
                    } else if (item.type === 'X' && item.arrId.length <= 0) {
                        isRight += 1;
                    }
                }
                if (isRight === 2) {
                    option.yAxis[0].position = 'right';
                }
            }
        }
        return option;
    };

    AnlzTendency.prototype.refreshChart = function (data) {
        for (var i = 0, len = data.list.length; i < len; i++) {
            var item = data.list[i];
            if (this.dictLegend[item.dsItemId]) return;

            this.resetShowData(data, 0);
            this.dictShowFlag[item.dsItemId] = true;

            var tempOption = this.chart.getOption();
            if (tempOption.xAxis[0].data.length === 0 && data.timeShaft.length > 0) {
                tempOption.xAxis[0].data = data.timeShaft;
                this.timeShift = data.timeShaft;
            }
            var arrTemp = tempOption.series;
            arrTemp.push(this.createSeries(item.dsItemId, item.data));
            this.chart.setOption(tempOption);
            arrTemp = null;

            this.options.itemDS[0].arrId.push(item.dsItemId);
            var _this = this;
            this.screen.saveModal();
        }
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
        this.options.dataList[name] = data;
        len = echarts.config.color.length;
        var color = echarts.config.color[this.curIndex % len];
        this.curIndex ++;
        var div = this.renderLegend(id, name, type, color);
        var tipInf = this.getStatisticsInfo(data);
        if (Boolean(tipInf)) {
            this.initTendencyTips($(div), tipInf.max, tipInf.min, tipInf.avg, tipInf.sum);
        }

        return {
            id: id,
            name: name,
            type: 'line',
            symbol: 'none',
            data: data,
            itemStyle: { normal: { color: color } }
        }
    };

    AnlzTendency.prototype.refreshChartFilter = function (data, condition, series) {
        var item = data.list[0];
        if (this.dictLegend[item.dsItemId]) return;

        var newFilterId = item.dsItemId + '_filter';
        var bFilterFind = false;
        for (var i = 0, len = series.length; i < len; i++) {
            if (newFilterId == series[i].id) {
                bFilterFind = true;
                break;
            }
        }
        if (bFilterFind) {
            series[i].data = item.data;

            // change tooltips
            var $div = $('#lg_' + newFilterId);
            var tipTmp = $div.data('bs.tooltip');
            if (!tipTmp) {
                return;
            }
            var tip = tipTmp.$tip;
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
            for (var i = 0, len = series.length; i < len; i++) {
                if (appendId == series[i].id) {
                    arrAppend.push(i);
                }
            }
            if (arrAppend.length > 0) {
                for (var j = 0, len2 = arrAppend.length; j < len2; j++) {
                    series.splice(arrAppend[j], 1);
                }
            }
        }
        else {
            series.unshift(this.createSeriesFilter(item.dsItemId, item.data, newFilterId, condition));
        }
        this.spinnerRender.stop();
    };

    AnlzTendency.prototype.createSeriesFilter = function (id, data, newId, condition) {
        var name, len;
        name = AppConfig.datasource.getDSItemById(id).alias + '_filter';

        len = echarts.config.color.length;
        var color = echarts.config.color[this.curIndex % len];
        this.curIndex++;
        var div = this.renderLegend(newId, name, 0, color);
        var tipInf = this.getStatisticsInfo(data);
        if (Boolean(tipInf)) {
            this.initTendencyTipsFilter($(div), tipInf.max, tipInf.min, tipInf.avg, tipInf.sum, condition);
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

        var arrIds = this.options.itemDS[0].arrId;
        for (var i = 0; i < arrIds.length; i++) {
            if (arrIds[i] == id) {
                arrIds.splice(i, 1);
            }
        }
        this.options.itemDS[0].arrId = arrIds;

        // delete filter chart
        var nIdx = id.indexOf('_filter');
        if (-1 != nIdx) {
            var origId = id.substr(0, nIdx);
            var arrFilter = this.options.arrFilter;
            if (arrFilter) {
                for (var i = 0, len = arrFilter.length; i < len; i++) {
                    if (origId == arrFilter[i].pointId) {
                        arrFilter.splice(i, 1);
                        break;
                    }
                }
            }
        }
        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme);
        this.chart.setOption(this.initOption(arrSeries, option.xAxis[0].data));
        window.setTimeout(function () {
            _this.screen.saveModal();
            _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1,_this.chart,$('#divWSPane .selected'),_this.options,true]);
        }, 500);
    };

    AnlzTendency.prototype.getDataById = function (id) {
        var arrSeries = this.chart.getOption().series;
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
        var btnShow;
        if (this.dictShowFlag[id]) {
            btnShow = '<span class="glyphicon glyphicon-eye-open btnShow" aria-hidden="true"></span>';
        }
        else {
            btnShow = '<span class="glyphicon glyphicon-eye-close btnShow" aria-hidden="true"></span>';
        }

        div.id = 'lg_'+id;
        div.dataset.id = id;
        div.className = "divLegend";
        div.draggable = true;
        div.style.backgroundColor = color;

        div.setAttribute('ty', type);
        switch (type) {
            case this.legendType.Regression: {
                div.innerHTML = "<div class='divTxtWrap'><span class='glyphicon glyphicon-retweet' style='margin-right: 10px;'></span>" + name.split('_Regression_')[0] + "_Regression</div>" + btnShow + closeBtn;
                this.initGeneralRegressorTooltip(id, div);
            }; break;
            case this.legendType.Prediction: {
                div.innerHTML = "<div class='divTxtWrap'><span class='glyphicon glyphicon-retweet' style='margin-right: 10px;'></span>" + name.split('_Prediction_')[0] + "_Prediction</div>" + btnShow + closeBtn;
                this.initGeneralPredictorTooltip(id, div);
            }; break;
            default: {
                div.innerHTML = "<div class='divTxtWrap'><span class='glyphicon glyphicon-stats' style='margin-right: 10px;'></span>" + name + '</div>'+ btnShow + closeBtn;
            }; break
        }

        div.getElementsByClassName('close')[0].onclick = function (e) {
            var $ele = $(e.currentTarget).parent();
            var id = $ele[0].dataset.id;
            if ($('.divLegend').length > 1) {
                var option = _this.chart.getOption();
                if (option) {
                    var arrSeries = option.series;
                    if (arrSeries) {
                        var cnt = 0;
                        for (var key in _this.options.dataList) cnt++;
                        if (cnt <= 1) {
                            alert('The only parameters can\'t be removed');
                            return;
                        }
                    }
                }
                //当删除一个点时同时把导出数据里对应点删除
                var doct = $ele.eq(0).find('.divTxtWrap').text();
                delete _this.options.dataList[doct];
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
        div.getElementsByClassName('btnShow')[0].onclick = function (e) {
            var $ele = $(e.currentTarget).parent();
            var id = $ele[0].dataset.id;
            _this.switchSeries(id);// switch for show or hide
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
                WebAPI.post('/analysis/generalRegressor', data).done(function (data) {
                    var id = targetId + "_Regression_" + (+new Date());

                    var tempOption = _this.chart.getOption();
                    var arrTemp = tempOption.series;
                    data.SourceId = sourceId;
                    data.TargetId = targetId;

                    _this.dictTooltip[id] = data;
                    arrTemp.push(_this.createSeries(id, data.PredicatedResults, _this.legendType.Regression));
                    _this.chart.setOption(tempOption);
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
                WebAPI.post('/analysis/generalPredictor', data).done(function (data) {
                    var id = targetId.split('_')[0] + "_Prediction_" + (+new Date());

                    var tempOption = _this.chart.getOption();
                    var arrTemp = tempOption.series;
                    if (data.PredicatedResults) {
                        arrTemp.push(_this.createSeries(id, data.PredicatedResults, _this.legendType.Prediction));
                        _this.chart.setOption(tempOption);
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

        var arrId = [];
        arrId.push(data.SourceId);
        arrId.push(data.TargetId);
        var arrItem = [];
        arrItem = AppConfig.datasource.getDSItemById(arrId);
        var srcAlias, tarAlias;
        for (var m = 0; m < arrItem.length; m++) {
            if (data.SourceId == arrItem[m].id) {
                srcAlias = arrItem[m].alias;
            }
            if (data.TargetId == arrItem[m].id) {
                tarAlias = arrItem[m].alias;
            }
        }

        var sb = new StringBuilder();
        sb.append('<div class="tooltip" role="tooltip" style="position: fixed;">');
        sb.append('    <div class="tooltipTitle tooltip-inner">GeneralRegressor</div>');
        sb.append('    <div class="tooltipContent">');
        sb.append('        <p style="white-space:nowrap;">RSquared: ').append(data.RSquared).append('</p> ');
        sb.append('        <p>Formula: </p><p style="margin-left: 20px; white-space:nowrap;">').append(data.Formula).append('</p> ');
        sb.append('        <p style="margin-left: 20px; white-space:nowrap;">x: ').append(srcAlias).append('</p>');
        sb.append('        <p style="margin-left: 20px; white-space:nowrap;">y: ').append(tarAlias).append('</p>');
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
            var dotName = parent.find('.divTxtWrap').text()==''?'--': parent.find('.divTxtWrap').text();

            var show = new StringBuilder();
            show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px;">');
            show.append('    <div class="tooltipTitle tooltip-inner">Statistics</div>');
            show.append('    <div class="tooltipContent">');
            show.append('        <p style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.MAXIMUM).append('</span>: ').append(max).append('</p>');
            show.append('        <p style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.MINIMUM).append('</span>: ').append(min).append('</p> ');
            show.append('        <p style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.AVERAGE).append('</span>: ').append(avg).append('</p> ');
            show.append('        <p style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.TOTAL_AMOUNT).append('</span>: ').append(sum).append('</p> ');
            show.append('        <p style="word-break:break-all;"><span style="font-weight:bold">').append(I18n.resource.observer.widgets.POINT_NAME).append('</span>: ').append(dotName).append('</p> ');
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
        if ('h1' == this.timeType || 'd1' == this.timeType || 'M1' == this.timeType) {
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
        else if ('m1' == this.timeType) {
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
                if (0 == i%60) {
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

    AnlzTendency.prototype.showFilterCharts = function (series) {
        if (!series) {
            series = this.chart.getOption().series;
        }
        if (this.options.arrFilter) {
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
                    this.refreshChartFilter(item.filterDrawObj, item.filterCondition, series);
                }
                if (0 == item.showType) {// remove dotted line
                    this.removeAppendCharts(item, series);
                }
                else {// draw dotted line
                    this.setAppendCharts(item, series);
                }
            }
        }
    };

    AnlzTendency.prototype.setAppendCharts = function (itemFilter, series) {
        var colorShow;
        var id = itemFilter.pointId;
        var idLen = id.length;
        var bFind = false;
        for (var i = 0, len = series.length; i < len; i++) {
            var tempLen = series[i].id.length;
            var tempEx = (tempLen > idLen) ? (series[i].id.substr(idLen, tempLen - idLen)) : ('');
            if (series[i].id.substr(0, idLen) == id && '_filter' == tempEx) {
                bFind = true;
                //colorShow = series[j].itemStyle.normal.color;
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
                itemStyle: { normal: { lineStyle: { width: 3, type: 'dotted' } } }// color: colorShow,
            }
            series.push(itemAppend);
        }
    };

    AnlzTendency.prototype.removeAppendCharts = function (itemFilter, series) {
        var id = itemFilter.pointId;
        var idLen = id.length;
        var bFind = false;
        for (var i = 0, len = series.length; i < len; i++) {
            var tempLen = series[i].id.length;
            var tempEx = (tempLen > idLen) ? (series[i].id.substr(idLen, tempLen - idLen)) : ('');
            if (series[i].id.substr(0, idLen) == id && '_append' == tempEx) {
                bFind = true;
                series.splice(i, 1);
                break;
            }
        }
    };

    AnlzTendency.prototype.switchSeries = function (id) {
        var option = this.chart.getOption();
        if (!option) {
            return;
        }
        var arrSeries = option.series;
        if (!arrSeries) {
            return;
        }

        var cnt = 0;
        var flag = false;
        for (var i = 0; i < arrSeries.length; i++) {
            if (-1 != arrSeries[i].id.indexOf('_append')) {
                continue;
            }
            if (arrSeries[i].data.length > 0) {
                cnt++;
            }
            if (arrSeries[i].id == id && arrSeries[i].data.length > 0) {
                flag = true;
            }
        }
        if (cnt <= 1 && flag) {
            alert('The only parameters can\'t be removed');
            return;
        }

        var spanPic = $('#lg_' + id).children('.btnShow');
        if (spanPic) {
            var bIsExist = false;
            for (var key in this.dictShowFlag) {
                if (id == key) {
                    bIsExist = true;
                    break;
                }
            }
            if (!bIsExist) {
                return;
            }

            var bIsShow = !this.dictShowFlag[id];
            this.dictShowFlag[id] = bIsShow;
            if (bIsShow) {  // show
                spanPic.attr('class', 'glyphicon glyphicon-eye-open btnShow');
            }
            else {  // hide
                spanPic.attr('class', 'glyphicon glyphicon-eye-close btnShow');
            }

            for (var i = 0, len = arrSeries.length; i < len; i++) {
                if (arrSeries[i].id == id) {
                    if (bIsShow) {
                        arrSeries[i].data = this.dictShowData[id];
                    }
                    else {
                        arrSeries[i].data = [];
                    }
                    break;
                }
            }

            // check if filter line
            var appendId = '';
            var nIdx = id.indexOf('_filter');
            if (-1 != nIdx) {
                appendId = id.substr(0, nIdx) + '_append';
                for (var i = 0, len = arrSeries.length; i < len; i++) {
                    if (arrSeries[i].id == appendId) {
                        if (bIsShow) {
                            arrSeries[i].data = this.dictShowData[appendId];
                        }
                        else {
                            arrSeries[i].data = [];
                        }
                        break;
                    }
                }
            }
        }
        this.chart = echarts.init(this.paneChart, AppConfig.chartTheme);
        this.chart.setOption(this.initOption(arrSeries, option.xAxis[0].data));
        window.setTimeout(function () {
            _this.screen.saveModal();
            _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1,_this.chart,$('#divWSPane .selected'),_this.options,true]);
        }, 500);
    };

    AnlzTendency.prototype.setTendencyOption = function (series) {
        if (!series) {
            series = this.chart.getOption().series;
        }
        var opt = this.chart.getOption();
        opt.series = series;
        this.chart.clear();
        this.chart.setOption(opt);
    };

    AnlzTendency.prototype.resetIcon = function (arrCloseId) {
        if (!arrCloseId) {
            return;
        }
        var legend = $('.divHover').find('.divLegend');
        if (legend) {
            for (var i = 0, lenI = legend.length; i < lenI; i++) {
                var bFind = false;
                for (var j = 0, lenJ = arrCloseId.length; j < lenJ; j++) {
                    if ('lg_' + arrCloseId[j] == legend[i].id) {
                        bFind = true;
                        break;
                    }
                }
                if (bFind) {
                    var icon = legend.eq(i).children('.btnShow');
                    if (icon) {
                        icon.attr('class', 'glyphicon glyphicon-eye-close btnShow');
                    }
                }
            }
        }
    };

    AnlzTendency.prototype.resetShowData = function (data, nFlag) {
        // nFlag = 0    原始数据
        // nFlag = 1    筛选数据
        // nFlag = 2    补齐数据
        if (!data) {
            return;
        }
        var list = data.list;
        if (list) {
            var nLenTime = data.timeShaft.length;
            //var nLenTimeOld = nLenTime;
            //for (var key in this.dictShowData) {    // data length may difference
            //    if (this.dictShowData[key]) {
            //        nLenTimeOld = this.dictShowData[key].length;
            //        break;
            //    }
            //}
            //if (nLenTime > nLenTimeOld) {
            //    nLenTime = nLenTimeOld
            //}

            if (0 == nFlag) {
                for (var i = 0, len = list.length; i < len; i++) {
                    this.dictShowData[list[i].dsItemId] = [];
                    for (var j = 0; j < nLenTime; j++) {
                        this.dictShowData[list[i].dsItemId][j] = this.fillData(list[i].data[j]);
                    }
                }
            }
            else if (1 == nFlag) {
                for (var i = 0, len = list.length; i < len; i++) {
                    this.dictShowData[list[i].dsItemId + '_filter'] = [];
                    for (var j = 0; j < nLenTime; j++) {
                        this.dictShowData[list[i].dsItemId + '_filter'][j] = this.fillData(list[i].data[j]);
                    }
                }
            }
            else if (2 == nFlag) {
                for (var i = 0, len = list.length; i < len; i++) {
                    this.dictShowData[list[i].dsItemId + '_append'] = [];
                    for (var j = 0; j < nLenTime; j++) {
                        this.dictShowData[list[i].dsItemId + '_append'][j] = this.fillData(list[i].data[j]);
                    }
                }
            }
        }
    };

    AnlzTendency.prototype.fillData = function (data) {
        if (!data && 0 != data) {
            data = undefined;
        }
        return data;
    };

    AnlzTendency.prototype.getExistDsData = function (arrSrc) {
        var arrPoints = AppConfig.datasource.m_allPointList;
        if (arrPoints.length <= 0) {
            return arrSrc;
        }

        var arrRet = [];
        if (!arrSrc || arrSrc.length <= 0 || !arrPoints || arrPoints.length <= 0) {
            return arrRet;
        }
        for (var i = 0, len = arrSrc.length; i < len; i++) {
            for (var j = 0, len2 = arrPoints.length; j < len2; j++) {
                if (arrSrc[i] == arrPoints[j].itemId) {
                    arrRet.push(arrSrc[i]);
                    break;
                }
            }
        }
        return arrRet;
    };

    return AnlzTendency;
})();
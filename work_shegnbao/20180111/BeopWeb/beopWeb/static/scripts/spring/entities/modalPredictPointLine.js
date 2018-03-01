// 单点预测折线图配置 start
var ModalPredictPointLineConfig = (function ($, window, undefined) {
    var _this;

    function ModalPredictPointLineConfig(options) {
        _this = this;
        ModalConfig.call(this, options);
    }

    ModalPredictPointLineConfig.prototype = Object.create(ModalConfig.prototype);
    ModalPredictPointLineConfig.prototype.constructor = ModalPredictPointLineConfig;


    ModalPredictPointLineConfig.prototype.DEFAULTS = {
        htmlUrl: '/static/views/observer/widgets/modalPredictPointLineConfig.html'
    };

    ModalPredictPointLineConfig.prototype.init = function () {
        // DOM
        this.$formWrap             = $('.form-wrap', this.$wrap);
        this.$iptChartYaxisMin     = $('.ipt-chart-y-axis-min', this.$formWrap);
        this.$iptChartYaxisMax     = $('.ipt-chart-y-axis-max', this.$formWrap);
        this.$iptChartValUnits     = $('.ipt-chart-val-units', this.$formWrap);
        this.$iptChartValPrecision = $('.ipt-chart-val-precision', this.$formWrap);
        
        this.$btnOptionMode        = $('.btn-option-mode', this.$formWrap);
        this.$btnTimeMode          = $('.btn-time-mode', this.$formWrap);
        this.$btnPredictMode       = $('.btn-predict-mode', this.$formWrap);
        this.$divTargetPoint       = $('.div-target-point', this.$formWrap);
        this.$divPredictPoint      = $('.div-predict-point', this.$formWrap);
        this.$btnSubmit            = $('.btn-submit', this.$wrap);
        
        // drop area
        this.$dropArea             = $('.drop-area', this.$formWrap);

        this.attachEvents();
    };

    ModalPredictPointLineConfig.prototype.recoverForm = function (modal) {
        var name, form, dsChartConfig;
        if(!modal) return;
        form = modal.option;
        dsChartConfig = (modal.dsChartCog && modal.dsChartCog.length) ? modal.dsChartCog[0] : {};
        if(!form) return;
        this._setField('input', this.$iptChartYaxisMin, dsChartConfig.lower);
        this._setField('input', this.$iptChartYaxisMax, dsChartConfig.upper);
        this._setField('input', this.$iptChartValUnits, dsChartConfig.unit);
        this._setField('input', this.$iptChartValPrecision, dsChartConfig.accuracy);

        this._setField('droparea', this.$divTargetPoint, form.targetPointId);
        this._setField('droparea', this.$divPredictPoint, form.predictPointId);

        this._setField('dropdown', this.$btnOptionMode, form.optionsMode);
        this._setField('dropdown', this.$btnTimeMode, form.timeMode);
        this._setField('dropdown', this.$btnPredictMode, form.predictMode);
    };

    ModalPredictPointLineConfig.prototype.reset = function () {
        this._setField('input', this.$iptChartYaxisMin);
        this._setField('input', this.$iptChartYaxisMax);
        this._setField('input', this.$iptChartValUnits);
        this._setField('input', this.$iptChartValPrecision);

        this._setField('droparea', this.$divTargetPoint);
        this._setField('droparea', this.$divPredictPoint);

        this._setField('dropdown', this.$btnOptionMode);
        this._setField('dropdown', this.$btnTimeMode);
        this._setField('dropdown', this.$btnPredictMode);
    };

    ModalPredictPointLineConfig.prototype.attachEvents = function () {
        ///////////////////
        // submit EVENTS //
        ///////////////////
        this.$btnSubmit.off().click( function (e) {
            var modalIns = _this.options.modalIns;
            var modal = modalIns.entity.modal;
            var dsChartConfig = {}, form = {};
            var val;

            // Y轴下限值
            val = parseFloat( _this.$iptChartYaxisMin.val() );
            dsChartConfig.lower = !isNaN(val) ? val : '';
            // Y轴上限值
            val = parseFloat( _this.$iptChartYaxisMax.val() );
            dsChartConfig.upper = !isNaN(val) ? val : '';
            // 数值显示精度, 默认值2
            val = parseInt( _this.$iptChartValPrecision.val() );
            dsChartConfig.accuracy = !isNaN(val) ? val : '';
            // 数值单位
            dsChartConfig.unit = _this.$iptChartValUnits.val();

            form.optionMode     = parseInt(_this.$btnOptionMode.attr('data-value'));
            form.timeMode       = parseInt(_this.$btnTimeMode.attr('data-value'));
            form.predictMode    = parseInt(_this.$btnPredictMode.attr('data-value'));
            form.targetPointId  = _this.$divTargetPoint.attr('data-value');
            form.predictPointId = _this.$divPredictPoint.attr('data-value');

            // save to modal
            modal.dsChartCog = [dsChartConfig];
            modal.option = form;
            modal.points = form.predictMode === 0 ?
                [form.targetPointId, form.predictPointId] : [form.targetPointId];
            modal.interval = 60000;

            // close modal
            _this.$modal.modal('hide');
            e.preventDefault();
        } );
    };

    return ModalPredictPointLineConfig;

} (jQuery, window));
// 单点预测折线图配置 end

// 单点预测折线图 start
var ModalPredictPointLine = (function ($, window, undefined) {

    function ModalPredictPointLine(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        var _this = this;
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;

        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, null);

        this.chart = null;
        this.chartOptions = $.extend(true, {}, this.optionDefault, DEFAULTS_CHARTS_OPTIONS);
        this.period = null;
        this.firstload = $.Deferred();

        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalPredictPointLine.prototype = Object.create(ModalRealtimeLine.prototype);
    ModalPredictPointLine.prototype.constructor = ModalPredictPointLine;

    ModalPredictPointLine.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_PREDICT_POINT_LINE',
        parent:0,
        mode:'custom',
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalPredictPointLine',
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData':false,
            'desc': ''
            
        }
    };

    ModalPredictPointLine.prototype.renderModal = function () {
        var _this             = this;
        var modal             = this.entity.modal;
        var dsChartOption     = (modal.dsChartCog && modal.dsChartCog.length) ? modal.dsChartCog[0] : {};
        var option            = modal.option;
        // CHART OPTIONS
        var chartYaxisMin     = dsChartOption.lower;
        var chartYaxisMax     = dsChartOption.upper;
        var chartValUnits     = dsChartOption.unit;
        var chartValPrecision = dsChartOption.accuracy;
        
        var timeMode          = option.timeMode;
        var targetPointId     = this.entity.modal.points[0];
        var predictPointId    = option.predictPointId;
        var predictMode       = option.predictMode;
        var period            = this.period = this.getPeriod(timeMode);
        var params            = [];

        var dsName            = [];

        // 默认为单点预测
        if(predictMode === undefined) predictMode = option.predictMode = 0;

        params.push({
            dsItemIds: [targetPointId],
            timeStart: period.startTime,
            timeEnd: period.endTime,
            timeFormat: period.tmFmt
        });

        // 初始化 legend
        dsName = AppConfig.datasource.getDSItemById(targetPointId).alias || targetPointId;
        this.chartOptions.legend.data =  [dsName];
        this.chartOptions.series[0].name = dsName;

        // 如果是多点预测模式
        if(predictMode === 1 && period.endTime < period.rangeEndTime) {
            params.push({
                dsItemIds: [predictPointId],
                timeStart: period.endTime,
                timeEnd: period.rangeEndTime,
                timeFormat: period.tmFmt
            });
            // 添加预测点的 legend
            this.chartOptions.legend.data.push('Predict Line');
        }

        // USE THE CHART OPTIONS
        if(chartYaxisMin !== '') this.chartOptions.yAxis[0].min = chartYaxisMin;    
        if(chartYaxisMax !== '') this.chartOptions.yAxis[0].max = chartYaxisMax;
        this.chartOptions.yAxis[0].name = chartValUnits;
        // default precision is 2
        if(chartValPrecision === '') chartValPrecision = 2;

        WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', params).done(function (rsList) {
            var predictData;
            var i, t, leni, lent;

            // deal with precision
            for (i = 0, leni = rsList.length; i < leni; i++) {
                rsList[i].list[0].data = rsList[i].list[0].data.map(function (row, i) {
                    return row.toFixed(chartValPrecision);
                });
            }

            _this.chartOptions.xAxis[0].data = _this.period.timeShaft;
            predictData = rsList[0].list[0].data;
            predictData[0] = rsList[0].list[0].data[rsList[0].list[0].data.length - 1];
            predictData =predictData.concat( new Array(_this.period.timeShaft.length - predictData.length + 1)
                    .join('-').split(''));
            _this.chartOptions.series[0].data = predictData;


            // 初始化 echart
            if(_this.chart) { _this.chart.clear(); _this.chart = null; }
            _this.chart = echarts.init(_this.container, AppConfig.chartTheme);

            // 如果是多点预测模式，则再增加一条曲线
            if (predictMode === 1 && rsList[1]) {
                // 新增 legend
                _this.chartOptions.legend.data.push()
                predictData = rsList[1].list[0].data;
                // 将 predictData 的第一个数据用实时值的最后一个替代，从而使整条曲线连贯
                predictData[0] = rsList[0].list[0].data[rsList[0].list[0].data.length - 1];
                // 给 rsList 补充数据
                predictData = new Array(_this.period.timeShaft.length - predictData.length + 1)
                    .join('-').split('').concat(predictData);
                _this.chartOptions.series.push({
                    type: 'line',
                    name: 'Predict Line',
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                type: 'dotted'
                            },
                            color: '#6495ed',
                            label: { position: 'right' }
                        }
                    },
                    data: predictData
                });
                _this.chart.clear();
                _this.chart.setOption(_this.chartOptions);

                return;
            } 

            _this.firstload.done(function (points) {
                _this.updateModal(points, true);
            });
        });

    };

    // force 标记主要是处理第一次加载预测点的情况
    ModalPredictPointLine.prototype.updateModal = function (points, force) {
        // 屏蔽掉第一次的加载，因为和 render 几乎是同时发生的，没必要掉一次
        if(this.firstload.state() === 'pending') return this.firstload.resolve(points);

        if(!points || points.length === 0) return;
        var _this = this;
        var data = this.chartOptions.series[0].data, predictData;
        var timeShaft = this.chartOptions.xAxis[0].data;
        var modal = this.entity.modal;
        var predictMode = modal.option.predictMode;
        var pointVal, predictPointVal;
        var pointId = modal.points[0], predictPointId = modal.points[1];
        var timeInterval = this.period.tmInterval;
        var dataLen = data.indexOf('-')-1, timeLen = timeShaft.length;
        var lastTickVal = timeShaft[dataLen].toDate().valueOf();
        var nowTick = new Date().valueOf();
        var row, i, len;

        force = force === undefined ? false : force;

        // 判断当前是否达到时间间隔
        // 注释掉该行可以使图表 1 分钟(刷新间隔取决于拉接口的时间间隔)更新一次
        if( (nowTick - lastTickVal) < this.period.tmInterval && !force ) return;
        for (i = 0, len = points.length; i < len; i++) {
            row = points[i];
            if(row.dsItemId === pointId) {
                pointVal = parseFloat(row.data);
            }
            if(row.dsItemId === predictPointId) {
                predictPointVal = parseFloat(row.data);
            }
        }

        // 进入到下一个周期
        // if(nowTick >= this.period.deadlineTick) {
        //     this.period = this.getPeriod(this.entity.modal.option.timeMode);
        //     timeShaft  = this.period.timeShaft;
        //     data.splice(0, data.length);
        // }

        if(pointVal !== undefined && !force) {
            // 保留 3 位小数
            pointVal = Math.round(pointVal*1000)/1000
            data.push( pointVal );
        }

        // 多点预测
        if(predictMode === 1) {
            // 当这个周期更完之后，此时 series[1] 是被 pop 掉了
            // 如果这时候继续更新，会出错，这里处理下这种情况
            if( !this.chartOptions.series[1] ) return;

            predictData = this.chartOptions.series[1].data;

            // 如果没有值了，删除这个 series
            if( predictData[predictData.length-1] === '-' ) {
                this.chartOptions.series.pop();
            }
            // 将下一个数据点用 '-' 代替
            // 因为预测点的数据是 ['-', '-', ..., '1', '2']
            // 前面的 '-' 都是占位用的，因为 echart 不支持从某个点开始渲染数据
            else {
                predictData.splice( predictData.lastIndexOf('-')+1, 1, '-' );
            }

            // 如果预测数据还没有达到周期边界，则将预测的下一个值置为实时值的最新值
            if( predictData[predictData.length-1] !== '-' ) {
                predictData.splice( predictData.lastIndexOf('-')+1, 1,  pointVal);
            }
        }
        // 单点预测
        else if(predictPointVal !== undefined) {
            dataLen = data.indexOf('-') - 1;
            // 针对最后一个点做特殊处理
            if(dataLen === timeLen ) {
                timeShaft.push( new Date(lastTickVal + timeInterval).format('yyyy-MM-dd HH:00:00') );
            }

            this.chartOptions.series[0].markPoint.data = [
                {name: 'Predict Value', value: predictPointVal, xAxis: dataLen+1, yAxis: predictPointVal}
            ];

            // 当前的最后一个有效数据
            lastVal = data[data.indexOf('-')-1];//data[data.length-1];
            //this.chartOptions.series[0].markLine.data = [
            //    [
            //        {xAxis: dataLen-1, yAxis: lastVal},
            //        { value: predictPointVal, xAxis: dataLen, yAxis: predictPointVal }
            //    ]
            //];
            var seriesRepeat = $.extend(true,{}, this.chartOptions.series[0]);//预测series虚线
            var seriesOne = this.chartOptions.series[0];
            seriesRepeat.data[dataLen + 1] = predictPointVal;
            for (var i = 0; i <= dataLen; i++) {
                seriesRepeat.data[i] = '-';
            }
            seriesRepeat['lineStyle'] = {
                normal: {
                    color:'#81a9f0',
                    type: 'dotted'
                }
            };
            seriesRepeat.type='effectScatter';
            seriesRepeat.markLine.data = [
                [
                    {xAxis: dataLen, yAxis: lastVal},
                    {  xAxis: dataLen+1, yAxis: predictPointVal }
                ]
            ];
            seriesRepeat.markLine.label.normal.show = false;
            seriesRepeat.showEffectOn= 'render';
            seriesRepeat.rippleEffect = {
                    brushType: 'stroke'
            };

            seriesRepeat.itemStyle= {
                normal: {
                color: '#6898ed',
                shadowBlur: 10,
                shadowColor: '#333'
                }
            };
            seriesRepeat.symbol = 'circle'
            seriesRepeat.symbolSize= 10;
            seriesOne['lineStyle'] = {
                normal: {
                    color: '#e84c3d'
                }
            };
            this.chartOptions.series.push(seriesRepeat);
        }
        // repaint
        this.chart.setOption(this.chartOptions);
    };

    ModalPredictPointLine.prototype.getPeriod = function (timeMode) {
        var _this = this;
        var now, tmFmt, tmInterval, tick, endTick;
        var start, end;
        var timeShaft  = [];

        if (!this.m_bIsGoBackTrace) {
            now = new Date();
            _this.optionDefault.animation = true;
        }
        else {
            now = this.m_traceData.currentTime;
            _this.optionDefault.animation = false;
        }

        switch(timeMode) {
            // daily
            case 0:
                tmFmt = 'h1';
                tmInterval = 3600000; // 60*60*1000
                start = now.format('yyyy-MM-dd') + ' 00:00:00';
                end = now.format('yyyy-MM-dd HH:00:00');
                endTick = end.toDate().valueOf();
                // 至少保留 8 小时的时间
                deadlineTick = Math.max(start.toDate().valueOf()+86400000, endTick+28800000/*--8*60*60*1000--*/);
                break;
            // monthly
            case 1:
            default:
                tmFmt = 'd1';
                tmInterval = 86400000; // 24*60*60*1000
                start = now.format('yyyy-MM') + '-01 00:00:00';
                end = now.format('yyyy-MM-dd 00:00:00');
                endTick = end.toDate().valueOf();

                if(this.entity.modal.option.predictMode === 1) {
                    // 始终向后预测 7 天
                    // 仅针对多点预测
                    deadlineTick = now.valueOf() + 604800000;/*--7*24*60*60*1000--*/
                } else {
                    // 至少保留 7 天
                    deadlineTick = Math.max(start.toDate().valueOf()+DateUtil.daysInMonth(now)*86400000, endTick+604800000/*--7*24*60*60*1000--*/);
                }
                
                break;
            // weekly
            case 2:
                tmFmt = 'h1';
                tmInterval = 3600000; // 60*60*1000
                // 定位到这一周的起始时间
                // getDay 默认是从周日开始的，这里转换成从周一开始
                start = new Date( now.valueOf()-( (now.getDay()+6)%7 )*86400000/*--24*60*60*1000--*/ ).format('yyyy-MM-dd 00:00:00');
                end = now.format('yyyy-MM-dd HH:00:00');
                endTick = end.toDate().valueOf();
                // 至少保留 40 小时的时间空余
                deadlineTick = Math.max(start.toDate().valueOf()+604800000/*--7*24*60*60*1000--*/, endTick+144000000/*--40*60*60*1000--*/);
                break;
        };

        tick = start.toDate().valueOf();

        while(tick < deadlineTick) {
            timeShaft.push(tick.toDate().format('yyyy-MM-dd HH:00:00'));
            tick += tmInterval;
        };

        return {
            startTime: start,
            endTime: end,
            rangeStartTime: start,
            rangeEndTime: timeShaft[timeShaft.length-1],
            tmFmt: tmFmt,
            tmInterval: tmInterval,
            timeShaft: timeShaft,
            deadlineTick: deadlineTick
        }
    };

    ModalPredictPointLine.prototype.showConfigModal = function (container, options) {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    };

    ModalPredictPointLine.prototype.setOptions = function (options) {
        this.options = $.extend({}, this.opitons, options);
    };

    ModalPredictPointLine.prototype.setModalOption = function (option) { };

    ModalPredictPointLine.prototype.configModal = new ModalPredictPointLineConfig();

    ModalPredictPointLine.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
        this.m_bIsGoBackTrace = false;
    };

    var DEFAULTS_CHARTS_OPTIONS = {
        tooltip: {
            formatter: function (p) {
                var arrHtml = [p[0].name];
                p.forEach(function (row) {
                    if(row.value === '-') return;
                    arrHtml.push(row.seriesName + ': ' + row.value);
                });
                return arrHtml.join('<br/>');
            }
        },
        //grid: {x: 50, y: 38, x2: 25, y2: 45},
        series: [{
            markPoint: {
                symbol:'emptyCircle',
                symbolSize : 5,
                effect: {
                    show: true,
                    shadowBlur : 0
                },
                itemStyle: {
                    normal: {
                        color: '#6495ed',
                        label: {position:'top'}
                    }
                },
                data: []
            },
            markLine: {
                symbol: 'circle',
                symbolSize: 1.5,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            type: 'dotted'
                        },
                        color: '#6495ed',
                        label: {position:'right'}
                    }
                },
                label: {
                    normal:
                        {
                            show: true
                        }
                },
                tooltip: {
                    show: false
                },
                data: []
            }
        }],
        toolbox: { show: false }
    };

    return ModalPredictPointLine;
}(jQuery, window) );
// 单点预测折线图 end
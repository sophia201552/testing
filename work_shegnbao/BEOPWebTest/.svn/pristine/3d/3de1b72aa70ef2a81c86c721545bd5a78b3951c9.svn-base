// ModalKPIConfig CLASS DEFINITION
var ModalKPIConfig = (function ($, window, undefined) {
    var _this;
    function ModalKPIConfig(options) {
        _this = this;
        // parameters
        this.options = $.extend({}, DEFAULTS, options);

        // DOM
        this.$wrap = null;

    }

    ModalKPIConfig.prototype.show = function () {
        // if there already has one "KPI Config" modal, do not load another one
        if($('#modalKPIConfigWrap').length > 0) {
            this.$modal.modal('show');
            return;
        }

        // get the template from server
        $.get('/static/views/observer/widgets/modalKPIConfig.html', function (html) {
            _this.$wrap = $('<div class="modal-kpi-config-wrap" id="modalKPIConfigWrap">')
                .appendTo(document.getElementById('paneContent')).html(html);
            _this.$modal = _this.$wrap.children('.modal');
            _this.init();
            _this.$modal.modal('show');
        });
    };

    ModalKPIConfig.prototype.init = function () {
        // DOM
        this.$formWrap                 = $('#formWrap');
        this.$btnClose                 = $('.close');
        this.$btnWarnMode              = $('#btnWarnMode', '#formWrap');
        this.$ulWarnMode               = $('#ulWarnMode', '#formWrap');
        this.$btnWarnTimeMode          = $('#btnWarnTimeMode', '#formWrap');
        this.$ulWarnTimeMode           = $('#ulWarnTimeMode', '#formWrap');
        this.$btnPreWarnMode           = $('#btnPreWarnMode', '#formWrap');
        this.$ulPreWarnMode            = $('#ulPreWarnMode', '#formWrap');
        this.$btnPreWarnTimeMode       = $('#btnPreWarnTimeMode', '#formWrap');
        this.$ulPreWarnTimeMode        = $('#ulPreWarnTimeMode', '#formWrap');
        this.$btnDataCycleMode         = $('#btnDataCycleMode', '#formWrap');
        this.$ulDataCycleMode          = $('#ulDataCycleMode', '#formWrap');
        this.$btnStartMonth            = $('#btnStartMonth', '#formWrap');
        this.$ulStartMonth             = $('#ulStartMonth', '#formWrap');
        this.$btnHistoryValUsage       = $('#btnHistoryValUsage', '#formWrap');
        this.$ulHistoryValUsage        = $('#ulHistoryValUsage', '#formWrap');
        // form groups
        this.$fgWarnRange              = $('#fgWarnRange', '#formWrap');
        this.$fgWarnTime               = $('#fgWarnTime', '#formWrap');
        this.$fgWarnTimeRange          = $('#fgWarnTimeRange', '#formWrap');
        this.$fgPreWarnRange           = $('#fgPreWarnRange', '#formWrap');
        this.$fgPreWarnTime            = $('#fgPreWarnTime', '#formWrap');
        this.$fgPreWarnTimeRange       = $('#fgPreWarnTimeRange', '#formWrap');
        // form group items
        this.$fgiStartMonth            = $('#fgiStartMonth', '#formWrap');
        // form field
        this.$iptChartName             = $('#iptChartName', '#formWrap');
        this.$iptChartLowerLimit       = $('#iptChartLowerLimit', '#formWrap');
        this.$iptChartUpperLimit       = $('#iptChartUpperLimit', '#formWrap');
        this.$divTargetPoint           = $('#divTargetPoint', '#formWrap');
        this.$divReferencePoint        = $('#divReferencePoint', '#formWrap');
        this.$btnCondition             = $('#btnCondition', '#formWrap');
        this.$iptConditionVal          = $('#iptConditionVal', '#formWrap');
        this.$btnIsShowRC              = $('#btnIsShowRC', '#formWrap');
        this.$iptLowerWarnVal          = $('#iptLowerWarnVal', '#formWrap');
        this.$iptUpperWarnVal          = $('#iptUpperWarnVal', '#formWrap');
        this.$iptPreGreaterThan        = $('#iptPreGreaterThan', '#formWrap');
        this.$iptPreLessThan           = $('#iptPreLessThan', '#formWrap');
        this.$iptWarnTimeRangeStart    = $('#iptWarnTimeRangeStart', '#formWrap');
        this.$iptPreWarnTimeRangeStart = $('#iptPreWarnTimeRangeStart', '#formWrap');
        // drop area
        this.$dropArea                 = $('.drop-area', '#formWrap');
        // submit button
        this.$btnSubmit                = $('#btnSubmit');

        this.attachEvents();
        this.initValidator();

        // initialize the datetimepicker
        // Deprecate
        $(".datetime").datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: true,
            startView: 'year',
            minView: 'month',
            pickerPosition: 'top-right'
        });
    };

    ModalKPIConfig.prototype.initValidator = function () {

    };

    ModalKPIConfig.prototype.displayField = function (animArr) {
        // every object in array is like: {$ele: [jQuery Object], action: 'show'/'hide'}
        var $animWrap = animArr[0].$ele.parent('.optional');
        var actionGroup = {$show: $(), $hide: $()};
        var showLen, curShowLen = $animWrap.children('.on').length;
        var $all;
        // group by 'action'
        for (var i = 0, len = animArr.length; i < len; i++) {
            actionGroup['$'+animArr[i].action] = actionGroup['$'+animArr[i].action].add(animArr[i].$ele);
        }
        showLen = actionGroup.$show.length;

        $all = actionGroup.$hide.add(actionGroup.$show).filter('.on');

        $all.filter('.on').eq(0).one('transitionend', function (e) {
            e = e.originalEvent;
            if(e.propertyName === 'opacity') {
                $all.css('display', 'none');
                if(showLen !== curShowLen) {
                    // do expend/collapse animation
                    $animWrap.height(49*showLen);
                    $animWrap.off('transitionend').on('transitionend', function (e) {
                        e = e.originalEvent;
                        if(e.propertyName === 'height') {
                            actionGroup.$show.css('display', '');
                            // use setTimeout to prevent the influence from 'display'
                            window.setTimeout(function () {
                                actionGroup.$show.addClass('on');
                            }, 0);
                        }
                        e.stopPropagation();
                    });
                } else {
                    actionGroup.$show.css('display', '');
                    // use setTimeout to prevent the influence from 'display'
                    window.setTimeout(function () {
                        actionGroup.$show.addClass('on');
                    }, 0);
                }
            }
            e.stopPropagation();
        });
        // do hide animation
        $all.removeClass('on');
    };

    // reset the modal
    ModalKPIConfig.prototype.reset = function (name) {
        name = typeof name === 'string' ? [name] : name;
        this.$iptChartName.val('');
        this.$iptChartLowerLimit.val('');
        this.$iptChartUpperLimit.val('');
        this.$divTargetPoint.html('<span class="glyphicon glyphicon-plus"></span>');
        this.$iptLowerWarnVal.val('');
        this.$iptUpperWarnVal.val('');
        this.$iptPreGreaterThan.val('');
        this.$iptPreLessThan.val('');
        // reset 'warn time' filed
        if(!name || name.indexOf('warn-time') > -1 ) {
            this.$btnWarnTimeMode.attr('data-value', 0);
            this.$btnWarnTimeMode.children('span').eq(0).text('From User Input');
            this.$btnHistoryValUsage.attr('data-value', 0);
            this.$btnHistoryValUsage.children('span').eq(0).text('Use As Lower Limit');
        }

        if(!name || name.indexOf('start-month') > -1 ) {
            this.$btnStartMonth.attr('data-value', '');
            this.$btnStartMonth.children('span').eq(0).text('Start Month');
        }

        if(!name || name.indexOf('pre-warn-time') > -1 ) {
            this.$btnPreWarnTimeMode.attr('data-value', 0);
            this.$btnPreWarnTimeMode.children('span').eq(0).text('From User Input');
        }
    };

    ModalKPIConfig.prototype.recoverForm = function (form) {
        var name;
        if(!form) return;
        this.$iptChartName.val(form.chartName);
        this.$iptChartLowerLimit.val(form.chartLowerLimit);
        this.$iptChartUpperLimit.val(form.chartUpperLimit);
        name = AppConfig.datasource.getDSItemById(form.targetPointId).alias;
        this.$divTargetPoint.attr({'data-value': form.targetPointId, 'title': name})
            .html('<span>'+name+'</span>');
        this.$btnDataCycleMode.attr('data-value', form.dataCycleMode).children('span').eq(0).text(form.dataCycleModeName);
        this.$btnWarnMode.attr('data-value', form.warnMode).children('span').eq(0).text(form.warnModeName);
        this.$btnIsShowRC.attr('data-value', form.isShowRC).children('span').eq(0).text(form.isShowRCName);
        this.$iptLowerWarnVal.val(form.warnLowerLimit);
        this.$iptUpperWarnVal.val(form.warnUpperLimit);
        this.$btnPreWarnMode.attr('data-value', form.preWarnMode).children('span').eq(0).text(form.preWarnModeName);
        this.$iptPreGreaterThan.val(form.preGreaterThan);
        this.$iptPreLessThan.val(form.preLessThan);
    };

    // update this.options by the specified options
    ModalKPIConfig.prototype.setOptions = function (options) {
        this.options = $.extend({}, this.options, options);
    };

    ModalKPIConfig.prototype.attachEvents = function () {
        /////////////////////////////////
        // all dropdown selected event //
        /////////////////////////////////
        $('.dropdown-menu').off('click.selected').on('click.selected', 'a', function (e) {
            var $this = $(this);
            var $btn = $this.parents('.dropdown-wrap').children('button');
            var value = $this.attr('data-value');
            var text = $this.text();

            $btn.attr('data-value', value);
            $btn.children('span').eq(0).text(text);

            e.preventDefault();
        });

        ////////////////////////////
        // modal show/hide events //
        ////////////////////////////
        this.$modal.off('show.bs.modal').on('show.bs.modal', function (e) {
            var $rightCt;
            if(e.namespace !== 'bs.modal') return true;
            $rightCt = $('#rightCt');
            // recover the form
            _this.recoverForm(_this.options.modalIns.entity.modal.option);
            // show the data soucre panel
            if(!$rightCt.hasClass('rightCtOpen')) $rightCt.click();
        });
        this.$modal.off('hide.bs.modal').on('hide.bs.modal', function (e) {
            var $rightCt;
            if(e.namespace !== 'bs.modal') return true;
            $rightCt = $('#rightCt');
            // reset the form state
            _this.reset();
            // hide the data soucre panel
            if($rightCt.hasClass('rightCtOpen')) $rightCt.click();
        });

        ////////////////////////////
        // field hide/show EVENTS //
        ////////////////////////////
        this.$ulWarnMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnWarnMode.attr('data-value'));
            var animArr = [];

            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnWarnMode.attr('data-value', value);

            // display hiden/shown field
            if(value === 0) {
                animArr.push({$ele: _this.$fgWarnRange, action: 'show'});
                animArr.push({$ele: _this.$fgWarnTime, action: 'hide'});
                animArr.push({$ele: _this.$fgWarnTimeRange, action: 'hide'});
            } else {
                // reset
                _this.reset(['warn-time']);
                animArr.push({$ele: _this.$fgWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgWarnTimeRange, action: 'show'});
            }
            _this.displayField(animArr);
        });
        this.$ulWarnTimeMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnWarnTimeMode.attr('data-value'));
            var animArr = [];

            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnWarnTimeMode.attr('data-value', value);

            // display hiden/shown field
            if(value === 0) {
                animArr.push({$ele: _this.$fgWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgWarnTimeRange, action: 'show'});
            } else {
                animArr.push({$ele: _this.$fgWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgWarnTimeRange, action: 'hide'});
            }
            _this.displayField(animArr);
        });
        this.$ulPreWarnMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnPreWarnMode.attr('data-value'));
            var animArr = [];

            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnPreWarnMode.attr('data-value', value);

            // display hiden/shown field
            if(value === 0) {
                animArr.push({$ele: _this.$fgPreWarnRange, action: 'show'});
                animArr.push({$ele: _this.$fgPreWarnTime, action: 'hide'});
                animArr.push({$ele: _this.$fgPreWarnTimeRange, action: 'hide'});
            } else {
                // reset
                _this.reset('pre-warn-time');
                animArr.push({$ele: _this.$fgPreWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgPreWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgPreWarnTimeRange, action: 'show'});
            }
            _this.displayField(animArr);
        });
        this.$ulPreWarnTimeMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnPreWarnTimeMode.attr('data-value'));
            var animArr = [];

            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnPreWarnTimeMode.attr('data-value', value);

            // display hiden/shown field
            if(value === 0) {
                animArr.push({$ele: _this.$fgPreWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgPreWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgPreWarnTimeRange, action: 'show'});
            } else {
                animArr.push({$ele: _this.$fgPreWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgPreWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgPreWarnTimeRange, action: 'hide'});
            }
            _this.displayField(animArr);
        });
        this.$ulDataCycleMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnDataCycleMode.attr('data-value'));
            var lastMonth, lastMonth2, nowMonth, lang, arrHtml = [];
            var liTmpl = '<li><a href="javascript:;" data-value="{0}">{1}</a></li>';
            
            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnDataCycleMode.attr('data-value', value);


            if(value === 0) _this.$fgiStartMonth.removeClass('on');
            else {
                lang = I18n.type
                // get "start months" options
                nowMonth = DateUtil.getNextMonth(new Date().getMonth());
                lastMonth = DateUtil.getLastMonth(nowMonth);
                lastMonth2 = DateUtil.getLastMonth(lastMonth);
                // get html
                arrHtml.push(liTmpl.format(lastMonth2, DateUtil.getMonthNameShort(lastMonth2-1, lang)));
                arrHtml.push(liTmpl.format(lastMonth, DateUtil.getMonthNameShort(lastMonth-1, lang)));
                arrHtml.push(liTmpl.format(nowMonth, DateUtil.getMonthNameShort(nowMonth-1, lang)));
                _this.$ulStartMonth.html(arrHtml.join(''));
                // reset button value and text
                _this.reset('start-month');

                _this.$fgiStartMonth.addClass('on');
            }
        });

        ///////////////////////
        // point Drop EVENTS //
        ///////////////////////
        this.$dropArea.off('dragover').on('dragover', function (e) {
            e.preventDefault();
        });
        this.$dropArea.off('dragenter').on('dragenter', function (e) {
            $(e.target).addClass('on');
            e.preventDefault();
            e.stopPropagation();
        });
        this.$dropArea.off('dragleave').on('dragleave', function (e) {
            $(e.target).removeClass('on');
            e.stopPropagation();
        });
        this.$dropArea.off('drop').on('drop', function (e) {
            var transfer = e.originalEvent.dataTransfer;
            var itemId = transfer.getData('dsItemId');
            var $target = $(e.target);
            var name;
            if(!itemId) return;
            $target.removeClass('on');
            name = AppConfig.datasource.getDSItemById(itemId).alias;
            $target.attr({'data-value': itemId, 'title': name});
            $target.html('<span>'+name+'</span>');
            e.stopPropagation();
        });

        //////////////////
        // submit EVENT //
        //////////////////
        this.$btnSubmit.off().click(function () {
            // validation
            var form = {};

            //////////////////
            // Base Options //
            //////////////////
            form.chartName             = _this.$iptChartName.val();
            form.chartLowerLimit       = parseInt(_this.$iptChartLowerLimit.val());
            form.chartUpperLimit       = parseInt(_this.$iptChartUpperLimit.val());
            ///////////////////
            // Point Options //
            ///////////////////
            form.targetPointId         = _this.$divTargetPoint.attr('data-value');
            form.referencePointId      = _this.$divReferencePoint.attr('data-value');
            form.referenceCondition    = parseInt(_this.$btnCondition.attr('data-value')) || '';
            form.referenceConditionVal = parseInt(_this.$iptConditionVal.val()) || '';
            ////////////////
            // Data Cycle //
            ////////////////
            // 0-Monthly, 1-Quarterly
            form.dataCycleMode         = parseInt(_this.$btnDataCycleMode.attr('data-value'));
            form.dataCycleModeName     = _this.$btnDataCycleMode.children('span').eq(0).text();
            form.btnStartMonth         = _this.$btnStartMonth.attr('data-value');
            ////////////////
            // Warn Range //
            ////////////////
            // 0-user input, 1-history
            form.warnMode              = parseInt(_this.$btnWarnMode.attr('data-value'));
            form.warnModeName          = _this.$btnWarnMode.children('span').eq(0).text();
            // 0-show, 1-hide
            form.isShowRC              = parseInt(_this.$btnIsShowRC.attr('data-value'));
            form.isShowRCName          = _this.$btnIsShowRC.children('span').eq(0).text();
            form.warnLowerLimit        = parseInt(_this.$iptLowerWarnVal.val());
            form.warnUpperLimit        = parseInt(_this.$iptUpperWarnVal.val());
            // 0-user input, 1-history
            form.warnTimeMode          = parseInt(_this.$btnWarnTimeMode.attr('data-value'));
            form.warnTimeModeName      = _this.$btnWarnTimeMode.children('span').eq(0).text();
            // 0-use as lower, 1-use as upper
            form.historyValUsage       = parseInt(_this.$btnHistoryValUsage.attr('data-value'));
            form.warnTimeRangeStart    = _this.$iptWarnTimeRangeStart.val();
            
            ////////////////////
            // Pre-Warn Range //
            ////////////////////
            // 0-user input, 1-history
            form.preWarnMode           = parseInt(_this.$btnPreWarnMode.attr('data-value'));
            form.preWarnModeName       = _this.$btnPreWarnMode.children('span').eq(0).text();
            form.preGreaterThan        = parseInt(_this.$iptPreGreaterThan.val());
            form.preLessThan           = parseInt(_this.$iptPreLessThan.val());
            // 0-user input, 1-history
            form.preWarnTimeMode       = parseInt(_this.$btnPreWarnTimeMode.attr('data-value'));
            form.preWarnTimeRangeStart = _this.$iptPreWarnTimeRangeStart.val();

            // save to modal
            _this.options.onSubmit.call(_this.options.modalIns, form);

            // close
            _this.$btnClose.trigger('click');
        });
    };

    ModalKPIConfig.prototype.detachEvents = function () { };

    ModalKPIConfig.prototype.destroy = function () {
        this.detachEvents();
        this.$wrap.remove();
    };

    //////////////
    // DEFAULTS //
    //////////////
    var DEFAULTS = {};

    return ModalKPIConfig;
} (jQuery, window));

// ModalKPIChart CLASS DEFINITION
var ModalKPIChart = (function ($) {

    var modalConfig = null;

    function ModalKPIChart (screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this._render, this._update, this._showConfig);
        
        // options
        this.options = $.extend(true, {}, DEFAULTS);
        this.historyChartOptions = $.extend(true, {}, HISTORY_CHART_DEFAULTS);

        // params
        this.startline = null;
        this.endline = null;

        // indicators
        this.indicators = {};

        // DOM
        this.historyChart = null;
    }

    // all I need is ModalBase.prototype
    ModalKPIChart.prototype = Object.create(ModalBase.prototype);
    // recover the constructor
    ModalKPIChart.prototype.constructor = ModalKPIChart;

    ModalKPIChart.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_KPI_CHART',
        parent: 0,
        mode: 'custom',
        maxNum: 1,
        title: '',
        minHeight: 3,
        minWidth: 4,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalKPIChart'
    };

    // render the chart
    ModalKPIChart.prototype._render = function () {
        var _this = this;
        var option = this.entity.modal.option;
        // chart options
        var min = option.chartLowerLimit || 0;
        var max = option.chartUpperLimit || 100;
        var len = max - min;
        var warnLower = option.warnLowerLimit;
        var warnUpper = option.warnUpperLimit;
        var preWarnLower = warnLower + option.preGreaterThan;
        var preWarnUpper = warnUpper - option.preLessThan;
        // point options
        var targetPointId = option.targetPointId;
        var referencePointId = option.referencePointId;
        // 
        // data cycle mode
        var dataCycleMode = option.dataCycleMode;
        var period = this.getTimePeriod(option.dataCycleMode, option.startMonth);

        var postData = [{
            dsItemIds: [targetPointId/*, referencePointId*/],
            timeStart: period.nowStart,
            timeEnd: period.nowEnd,
            timeFormat: 'm5'
        }];

        var now = new Date();
        
        this.setDeadline();

        var axisColor = this.options.series[0].axisLine.lineStyle.color;
        if(warnLower !== undefined && (warnLower-min) > 0){
            axisColor.push([(warnLower-min)/len, '#ff4500']);
            this.historyChartOptions.series[0].markLine.data.push([
                {name: 'Lower Warn Line', value: warnLower, xAxis: 0, yAxis: warnLower, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                {xAxis: this.deadline, yAxis: warnLower}
            ]);
        } 
        if(preWarnLower !== undefined && (preWarnLower-min) > 0) {
            axisColor.push([(preWarnLower-min)/len, 'orange']);
            this.historyChartOptions.series[0].markLine.data.push([
                {name: 'Lower Pre-Warn Line', value: preWarnLower, xAxis: 0, yAxis: preWarnLower, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                {xAxis: this.deadline, yAxis: preWarnLower}
            ]);
        }
        if(preWarnUpper !== undefined && (preWarnUpper-min) > 0) {
            axisColor.push([(preWarnUpper-min)/len, 'lightgreen']);
            this.historyChartOptions.series[0].markLine.data.push([
                {name: 'Upper Pre-Warn Line', value: preWarnUpper, xAxis: 0, yAxis: preWarnUpper, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                {xAxis: this.deadline, yAxis: preWarnUpper}
            ]);
        } 
        if(warnUpper !== undefined && (warnUpper-min) > 0) {
            axisColor.push([(warnUpper-min)/len, 'orange']);
            this.historyChartOptions.series[0].markLine.data.push([
                {name: 'Upper Warn Line', value: warnUpper, xAxis: 0, yAxis: warnUpper, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                {xAxis: this.deadline, yAxis: warnUpper}
            ]);
        }
        axisColor.push([1, '#ff4500']);

        this.initHistoryModal();
        // initialize series
        this.options.series[0].data[0].value = min;
        this.options.series[0].min = min;
        this.options.series[0].max = max;
        this.historyChartOptions.yAxis[0].min = min;
        this.historyChartOptions.yAxis[0].max = max;
        // initialize tooltip
        this.options.tooltip.formatter = function (p) {
            return p.seriesName+': <strong>'+p.value.toFixed(2)+'</strong><br/>From: ' + 
                _this.store.timeShaft[0] + '<br/>To: '+ _this.store.timeShaft[_this.store.timeShaft.length-1];
        };

        this.chart = echarts.init(_this.container, 'macarons').setOption(this.options);

        // show chart loading
        // this.chart.showLoading({
        //     text : 'Pending...',
        //     effect : 'whirling',
        //     textStyle : {
        //         fontSize : 20
        //     }
        // });
        this.spinner.spin(this.container);

        WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', postData)
            .done(function (rs) {
                rs = JSON.parse(rs);
                rs = rs[0];
                _this.store = rs;

                _this.initIndicators(_this.store, option.targetPointId);
                _this.options.series[0].data[0].value = _this.indicators.average;

                _this.reloadChart();

                // _this.chart.hideLoading();
                _this.setFullTimeShaftM5();

            }).always(function () {
                _this.spinner.stop();
                console.log('finish');
            });
    };

    ModalKPIChart.prototype.setAnimation = function () {
        var option = this.entity.modal.option;
        var warnLower = option.warnLowerLimit;
        var warnUpper = option.warnUpperLimit;
        var preWarnLower = warnLower + option.preGreaterThan;
        var preWarnUpper = warnUpper - option.preLessThan;
        var $parent = $(this.container).parents('.panel');
        var curVal = this.indicators.average;
        // reset
        $parent.removeClass('warn-anim pre-warn-anim');
        switch (true) {
            case curVal < preWarnLower:
                $parent.addClass('pre-warn-anim');
                break;
            case curVal  < warnLower:
                $parent.addClass('warn-anim');
                break;
            case curVal  < preWarnUpper: break;
            case curVal  < warnUpper:
                $parent.addClass('pre-warn-anim');
                break;
            default:
                $parent.addClass('warn-anim');
                break;
        }
    };

    // initialize history chart
    ModalKPIChart.prototype.initHistoryModal = function () {
        var _this = this;
        var $modalKPI = $('#modalKPIHistory');
        if($modalKPI.length === 0) {
            $modalKPI = $('\
            <div class="modal" id="modalKPIHistory">\
            <div class="modal-dialog" style="width: 1000px;margin-top: 110px;">\
                <div class="modal-content">\
                    <div class="modal-body">\
                        <div style="height: 550px;" id="divKPIHistoryPanel"></div>\
                    </div>\
                </div>\
            </div>\
            </div>').appendTo(document.getElementById('paneContent'));
        }

        this.options.toolbox.feature.showHistory.onclick = function () {
            $modalKPI.one('shown.bs.modal', function () {
                var markLine = [];
                // render line charts
                _this.historyChartOptions.series[0].data = (function () {
                    var option = _this.entity.modal.option;
                    var targetPointId = option.targetPointId;
                    var list = _this.store.list;
                    // find the data by indicated dsId
                    for (var i = 0, len = list.length; i < len; i++) {
                        if(list[i]['dsItemId'] === targetPointId) {
                            return list[i].data;
                            break;
                        }
                    };
                    return [];
                }());

                _this.historyChartOptions.xAxis[0].data = _this.store.fullTimeShaft;

                // initialize history chart
                _this.historyChart = echarts.init(document.getElementById('divKPIHistoryPanel'), 'macarons');
                _this.historyChart.setOption(_this.historyChartOptions);
            });

            window.setTimeout(function () {
                $modalKPI.modal('show');
            }, 0);

            $modalKPI.one('hiden.bs.modal', function () {
                _this.historyChart.dispose();
                document.getElementById('divKPIHistoryPanel').innerHTML = '';
            });
        };
    };

    // update the chart
    ModalKPIChart.prototype._update = function (rs) {
        var option = this.entity.modal.option;
        var targetPointId = option.targetPointId;
        var targetPointData;

        var lastTick, nowTick;

        // if store object is null, the first load is pending or failed
        // do not do anything
        if(!this.store) return;

        // get the last tick, and move after 5 minutes
        lastTick = this.store.timeShaft[this.store.timeShaft.length-1];
        lastTick = new Date(lastTick).valueOf() + 300000;
        nowTick = new Date().valueOf();
        // only now time greater than lastTick time, we do update
        if( nowTick < lastTick) {
            console.log('time is not on!');
            return;
        }

        for (var i = 0, len = rs.length; i < len; i++) {
            if(targetPointId === rs[i].dsItemId) {
                targetPointData = parseFloat(rs[i].data);
                break;
            }
        }

        if(isNaN(targetPointData)) return;

        this.appendData(targetPointData, targetPointId);

        // reload the chart
        this.options.series[0].data[0].value = this.indicators.average;
        this.reloadChart();
    };

    ModalKPIChart.prototype.reloadChart = function () {
        this.chart.setSeries(this.options.series, true);
        this.setAnimation();
    };

    // show config mode
    ModalKPIChart.prototype._showConfig = function () {
        // this.chart.dispose();
    };

    ModalKPIChart.prototype.showConfigModal = function (container, options) {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    };

    ModalKPIChart.prototype.setOptions = function (options) {
        this.options = $.extend({}, this.opitons, options);
    };

    ModalKPIChart.prototype.destroy = function () {
    };

    ModalKPIChart.prototype.saveConfig = function (form) {
        this.entity.modal.title = form.chartName;
        this.entity.modal.points = [form.targetPointId];
        this.entity.modal.option = form;
        this.entity.modal.interval = 60000;
    };

    ModalKPIChart.prototype.configModal = new ModalKPIConfig({onSubmit: function (form) { this.saveConfig(form); }});

    ModalKPIChart.prototype.getTimePeriod = function (mode, startMonth) {
        var now = new Date();
        var period = {};
        // monthly
        if(mode === 0) {
            period.nowStart = now.format('yyyy-MM-01 00:00:00');
            period.nowEnd = now.format('yyyy-MM-dd HH:mm:ss');
            period.lastyearStart = (now.format('yyyy')-1) + now.format('-MM');
            // deal with leap year
            period.lastyearEnd = period.lastyearStart + DateUtil.daysInMonth(new Date(period.lastyearStart)) + ' 23:59:59';
            period.lastyearStart += '-01 00:00:00';
        }
        // quarterly
        else {

        }

        return period;
    };

    ModalKPIChart.prototype.initIndicators = function (rs, dsId) {
        var list = rs.list;
        var data = null;
        var average = 0;
        
        // find the data by indicated dsId
        for (var i = 0, len = list.length; i < len; i++) {
            if(list[i].dsItemId === dsId) {
                data = list[i].data;
                break;
            }
        };

        // AVERAGE INDICATOR
        for (i = 0, len = data.length; i < len; i++) {
            average += data[i]*1;
        };
        this.indicators.average = average / len;
    };

    ModalKPIChart.prototype.appendData = function (value, dsId) {
        var lastTick = this.store.timeShaft[this.store.timeShaft.length-1];
        var list = this.store.list;
        // move after 5 minutes, and push to timeShaft
        this.store.timeShaft.push(new Date(new Date(lastTick).valueOf() + 300000).format('yyyy-MM-dd HH:mm:00'));
        
        // find the data by indicated dsId
        for (var i = 0, len = list.length; i < len; i++) {
            if(list[i]['dsItemId'] === dsId) {
                data = list[i].data;
                break;
            }
        };

        // push new value
        data.push(value);

        // recalculate
        this.indicators.average = (this.indicators.average*len+value) / (len+1);
    };

    ModalKPIChart.prototype.setDeadline = function () {
        var option = this.entity.modal.option;
        var now = new Date();

        // monthly
        if(option.dataCycleMode === 0) {
            this.deadline = new Date(now.format('yyyy-MM-'+DateUtil.daysInMonth(now)+' 23:55:00'));
        } 
        // quarterly
        else {

        }
    };

    ModalKPIChart.prototype.setFullTimeShaftM5 = function () {
        var lastTick = new Date(this.store.timeShaft[this.store.timeShaft.length-1]).valueOf();
        var option = this.entity.modal.option;
        var tick = lastTick + 300000;
        var now = new Date();

        this.store.fullTimeShaft = this.store.timeShaft.concat();
        // monthly
        if(option.dataCycleMode === 0) {
            // get the last day of current month
            while(tick <= this.deadline) {
                tick += 300000;
                this.store.fullTimeShaft.push(new Date(tick).format('yyyy-MM-dd HH:mm:ss'));
            }
        }
        // quarterly
        else {

        }

    };

    var DEFAULTS = {
        tooltip : {
            formatter: function (p) {
                return p.seriesName+': <strong>'+p.value+'</strong><br/>From: 2000-01-01 00:00:00<br/>To: 2000-01-02 00:00:00';
            }
        },
        toolbox: {
            show : true,
            feature : {
                showHistory: {
                    show : true,
                    title : 'Show History Data'
                },
            }
        },
        series: [{
            name: 'KPI Indicator',
            type: 'gauge',
            precision: 2,
            splitNumber: 10,
            startAngle: 140,
            endAngle : -140,
            axisLine: {
                show: true,
                lineStyle: {
                    width: 30,
                    color: []
                }
            },
            axisTick: {
                show: true,
                splitNumber: 5,
                length :8,
                lineStyle: {
                    color: '#eee',
                    width: 1,
                    type: 'solid'
                }
            },
            splitLine: {
                show: true,
                length :30,
                lineStyle: {
                    color: '#eee',
                    width: 2,
                    type: 'solid'
                }
            },
            pointer : {
                length : '80%',
                width : 8
            },
            title : {
                show : true,
                offsetCenter: ['-65%', -20],
                textStyle: {
                    color: '#333',
                    fontSize : 15
                }
            },
            detail : {
                offsetCenter: ['-65%', -15],
                formatter: function (v) {
                    return v.toFixed(2);
                }
            },
            data: [{name: ''}]
        }]
    };

    var HISTORY_CHART_DEFAULTS = {
        title : {
            text : 'History Data'
        },
        calculable : true,
        tooltip : {
            trigger: 'axis'
        },
        dataZoom: {
            show: false,
            realtime : true,
            start : 0,
            end : 100
        },
        grid: {
            y2: 80
        },
        xAxis : [
            {
                type : 'category'
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                type: 'line',
                markLine: {
                    data: []
                }
            }
        ]
    };

    return ModalKPIChart;

} (jQuery));
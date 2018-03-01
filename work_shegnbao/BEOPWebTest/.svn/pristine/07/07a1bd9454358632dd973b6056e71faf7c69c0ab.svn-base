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
        var domPanelContent = document.getElementById('paneContent');
        // if there already has one "KPI Config" modal, do not load another one
        if($('#modalKPIConfigWrap').length > 0) {
            this.$modal.modal('show');
            return;
        }

        Spinner.spin(domPanelContent);
        // get the template from server
        WebAPI.get('/static/views/observer/widgets/modalKPIConfig.html').done(function (html) {
            Spinner.stop();
            _this.$wrap = $('<div class="modal-kpi-config-wrap" id="modalKPIConfigWrap">')
                .appendTo(domPanelContent).html(html);
            _this.$modal = _this.$wrap.children('.modal');
            _this.init();
            _this.$modal.modal('show');
        });
    };
    
    ModalKPIConfig.prototype.init = function () {
        // DOM
        this.$formWrap                 = $("#formWrap", this.$wrap);
        this.$btnClose                 = $('.close', this.$wrap);
        this.$btnWarnMode              = $('#btnWarnMode', this.$formWrap);
        this.$ulWarnMode               = $('#ulWarnMode', this.$formWrap);
        this.$btnWarnTimeMode          = $('#btnWarnTimeMode', this.$formWrap);
        this.$ulWarnTimeMode           = $('#ulWarnTimeMode', this.$formWrap);
        this.$btnPreWarnMode           = $('#btnPreWarnMode', this.$formWrap);
        this.$ulPreWarnMode            = $('#ulPreWarnMode', this.$formWrap);
        this.$btnPreWarnTimeMode       = $('#btnPreWarnTimeMode', this.$formWrap);
        this.$ulPreWarnTimeMode        = $('#ulPreWarnTimeMode', this.$formWrap);
        this.$btnDataCycleMode         = $('#btnDataCycleMode', this.$formWrap);
        this.$ulDataCycleMode          = $('#ulDataCycleMode', this.$formWrap);
        this.$btnStartMonth            = $('#btnStartMonth', this.$formWrap);
        this.$ulStartMonth             = $('#ulStartMonth', this.$formWrap);
        this.$btnHistoryValUsage       = $('#btnHistoryValUsage', this.$formWrap);
        this.$btnPreHistoryValUsage    = $('#btnPreHistoryValUsage', this.$formWrap);
        // form groups
        this.$fgWarnRange              = $('#fgWarnRange', this.$formWrap);
        this.$fgWarnTime               = $('#fgWarnTime', this.$formWrap);
        this.$fgWarnTimeRange          = $('#fgWarnTimeRange', this.$formWrap);
        this.$fgPreWarnRange           = $('#fgPreWarnRange', this.$formWrap);
        this.$fgPreWarnTime            = $('#fgPreWarnTime', this.$formWrap);
        this.$fgPreWarnTimeRange       = $('#fgPreWarnTimeRange', this.$formWrap);
        // form group items
        this.$fgiStartMonth            = $('#fgiStartMonth', this.$formWrap);
        // form field
        this.$iptChartName             = $('#iptChartName', this.$formWrap);
        this.$iptChartLowerLimit       = $('#iptChartLowerLimit', this.$formWrap);
        this.$iptChartUpperLimit       = $('#iptChartUpperLimit', this.$formWrap);
        this.$divTargetPoint           = $('#divTargetPoint', this.$formWrap);
        this.$divReferencePoint        = $('#divReferencePoint', this.$formWrap);
        this.$btnCondition             = $('#btnCondition', this.$formWrap);
        this.$iptConditionVal          = $('#iptConditionVal', this.$formWrap);
        this.$btnIsShowRC              = $('#btnIsShowRC', this.$formWrap);
        this.$iptLowerWarnVal          = $('#iptLowerWarnVal', this.$formWrap);
        this.$iptUpperWarnVal          = $('#iptUpperWarnVal', this.$formWrap);
        this.$iptPreGreaterThan        = $('#iptPreGreaterThan', this.$formWrap);
        this.$iptPreLessThan           = $('#iptPreLessThan', this.$formWrap);
        this.$iptWarnTimeRangeStart    = $('#iptWarnTimeRangeStart', this.$formWrap);
        this.$iptPreWarnTimeRangeStart = $('#iptPreWarnTimeRangeStart', this.$formWrap);
        // drop area
        this.$dropArea                 = $('.drop-area', this.$formWrap);
        // submit button
        this.$btnSubmit                = $('#btnSubmit', this.$wrap);

        this.attachEvents();
        this.initValidator();

        // initialize the datetimepicker
        /*$(".datetime").datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: true,
            startView: 'year',
            minView: 'year',
            pickerPosition: 'top-right'
        });*/
        $(".datetime").datetimepicker('remove');
        $(".datetime").datetime({pickerPosition: 'top-right'});
    };

    ModalKPIConfig.prototype.initValidator = function () {

    };

    ModalKPIConfig.prototype.displayField = function (animArr, doAnim) {
        // every object in array is like: {$ele: [jQuery Object], action: 'show'/'hide'}
        var $animWrap = animArr[0].$ele.parent('.optional');
        var actionGroup = {$show: $(), $hide: $()};
        var showLen, curShowLen = $animWrap.children('.on').length;
        var $all;
        if(doAnim === undefined) doAnim = true;
        // group by 'action'
        for (var i = 0, len = animArr.length; i < len; i++) {
            actionGroup['$'+animArr[i].action] = actionGroup['$'+animArr[i].action].add(animArr[i].$ele);
        }
        showLen = actionGroup.$show.length;
        if(!doAnim) {
            actionGroup.$hide.removeClass('on').css('display', 'none');
            actionGroup.$show.addClass('on').css('display', '');
            $animWrap.height(49*showLen);
            return;
        }

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
        var animArr = [];
        name = typeof name === 'string' ? [name] : name;

        if(!name) {
            this.$iptChartName.val('');
            this.$iptChartLowerLimit.val('');
            this.$iptChartUpperLimit.val('');
            this.$divTargetPoint.attr('data-value', '').html('<span class="glyphicon glyphicon-plus"></span>');
            this.$divReferencePoint.attr('data-value', '').html('<span class="glyphicon glyphicon-plus"></span>');
            this.$btnCondition.attr('data-value', 0).children('span').eq(0).text('Equal To (=)');
            this.$iptConditionVal.val('');

            this.$btnWarnMode.attr('data-value', 0).children('span').eq(0).text('From User Input');
            this.$btnHistoryValUsage.attr('data-value', 0).children('span').eq(0).text('Use As Lower Limit');
            this.$iptWarnTimeRangeStart.val('');
            this.$iptLowerWarnVal.val('');
            this.$iptUpperWarnVal.val('');

            this.$btnPreWarnMode.attr('data-value', 0).children('span').eq(0).text('From User Input');
            this.$iptPreGreaterThan.val('');
            this.$iptPreLessThan.val('');

            animArr = [];
            animArr.push({$ele: this.$fgWarnRange, action: 'show'});
            animArr.push({$ele: this.$fgWarnTime, action: 'hide'});
            animArr.push({$ele: this.$fgWarnTimeRange, action: 'hide'});
            this.displayField(animArr, false);

            animArr = [];
            animArr.push({$ele: this.$fgPreWarnRange, action: 'show'});
            animArr.push({$ele: this.$fgPreWarnTime, action: 'hide'});
            animArr.push({$ele: this.$fgPreWarnTimeRange, action: 'hide'});
            this.displayField(animArr, false);
        }
        

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
        var name, animArr = [], animArr2 = [];
        var _this = this;
        if(!form) return;
        this.$iptChartName.val(form.chartName);
        this.$iptChartLowerLimit.val(form.chartLowerLimit);
        this.$iptChartUpperLimit.val(form.chartUpperLimit);
        name = AppConfig.datasource.getDSItemById(form.targetPointId).alias;
        this.$divTargetPoint.attr({'data-value': form.targetPointId, 
                'title': name}).html('<span>'+name+'</span>');
        name = AppConfig.datasource.getDSItemById(form.referencePointId).alias;
        if(name) {
            this.$divReferencePoint.attr({'data-value': form.referencePointId, 
                'title': name}).html('<span>'+name+'</span>');
        }
        
        this.$btnCondition.attr('data-value', form.referenceCondition).children('span').eq(0).text(form.referenceConditionName);
        this.$iptConditionVal.val(form.referenceConditionVal);
        this.$btnDataCycleMode.attr('data-value', form.dataCycleMode).children('span').eq(0).text(form.dataCycleModeName);

        this.$btnWarnMode.attr('data-value', form.warnMode).children('span').eq(0).text(form.warnModeName);
        this.$btnWarnTimeMode.attr('data-value', form.warnTimeMode).children('span').eq(0).text(form.warnTimeModeName);
        this.$btnHistoryValUsage.attr('data-value', form.historyValUsage).children('span').eq(0).text(form.historyValUsageName);
        this.$iptWarnTimeRangeStart.val(form.warnTimeRangeStart);
        if(form.warnMode === 1) {
            animArr.push({$ele: this.$fgWarnRange, action: 'hide'});
            animArr.push({$ele: this.$fgWarnTime, action: 'show'});
            if(form.warnTimeMode === 0) {
                animArr.push({$ele: this.$fgWarnTimeRange, action: 'show'});
            } else {
                animArr.push({$ele: this.$fgWarnTimeRange, action: 'hide'});
            }
            window.setTimeout(function () {
                _this.displayField(animArr);
            }, 1200);
        }

        this.$iptLowerWarnVal.val(form.warnLowerLimit);
        this.$iptUpperWarnVal.val(form.warnUpperLimit);
        this.$btnPreWarnMode.attr('data-value', form.preWarnMode).children('span').eq(0).text(form.preWarnModeName);
        this.$iptPreGreaterThan.val(form.preGreaterThan);
        this.$iptPreLessThan.val(form.preLessThan);
        this.$btnPreWarnTimeMode.attr('data-value', form.preWarnTimeMode).children('span').eq(0).text(form.preWarnTimeModeName);
        this.$btnPreHistoryValUsage.attr('data-value', form.preHistoryValUsage).children('span').eq(0).text(form.preHistoryValUsageName);
        this.$iptPreWarnTimeRangeStart.val(form.preWarnTimeRangeStart);
        if(form.preWarnMode === 1) {
            animArr2.push({$ele: this.$fgPreWarnRange, action: 'hide'});
            animArr2.push({$ele: this.$fgPreWarnTime, action: 'show'});
            if(form.preWarnTimeMode === 0) {
                animArr2.push({$ele: this.$fgPreWarnTimeRange, action: 'show'});
            } else {
                animArr2.push({$ele: this.$fgPreWarnTimeRange, action: 'hide'});
            }
            window.setTimeout(function () {
                _this.displayField(animArr2);
            }, 1200);
        }
    };

    // update this.options by the specified options
    ModalKPIConfig.prototype.setOptions = function (options) {
        this.options = $.extend({}, this.options, options);
    };

    ModalKPIConfig.prototype.attachEvents = function () {
        /////////////////////////////////
        // all dropdown selected event //
        /////////////////////////////////
        $('.dropdown-menu', this.$wrap).off('click.selected').on('click.selected', 'a', function (e) {
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
            var itemId = EventAdapter.getData().dsItemId;
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
            form.chartName              = _this.$iptChartName.val();
            form.chartLowerLimit        = parseFloat(_this.$iptChartLowerLimit.val());
            form.chartUpperLimit        = parseFloat(_this.$iptChartUpperLimit.val());
            ///////////////////
            // Point Options //
            ///////////////////
            form.targetPointId          = _this.$divTargetPoint.attr('data-value');
            form.referencePointId       = _this.$divReferencePoint.attr('data-value');
            form.referenceCondition     = parseInt(_this.$btnCondition.attr('data-value'));
            form.referenceConditionName = _this.$btnCondition.children('span').eq(0).text();
            form.referenceConditionVal  = parseFloat(_this.$iptConditionVal.val());
            ////////////////
            // Data Cycle //
            ////////////////
            // 0-Monthly, 1-Quarterly
            form.dataCycleMode          = parseInt(_this.$btnDataCycleMode.attr('data-value'));
            form.dataCycleModeName      = _this.$btnDataCycleMode.children('span').eq(0).text();
            form.btnStartMonth          = _this.$btnStartMonth.attr('data-value');
            ////////////////
            // Warn Range //
            ////////////////
            // 0-user input, 1-history
            form.warnMode               = parseInt(_this.$btnWarnMode.attr('data-value'));
            form.warnModeName           = _this.$btnWarnMode.children('span').eq(0).text();
            // 0-show, 1-hide
            form.isShowRC               = parseInt(_this.$btnIsShowRC.attr('data-value'));
            form.isShowRCName           = _this.$btnIsShowRC.children('span').eq(0).text();
            form.warnLowerLimit         = parseFloat(_this.$iptLowerWarnVal.val());
            form.warnUpperLimit         = parseFloat(_this.$iptUpperWarnVal.val());
            // 0-user input, 1-history
            form.warnTimeMode           = parseInt(_this.$btnWarnTimeMode.attr('data-value'));
            form.warnTimeModeName       = _this.$btnWarnTimeMode.children('span').eq(0).text();
            // 0-use as lower, 1-use as upper
            form.historyValUsage        = parseInt(_this.$btnHistoryValUsage.attr('data-value'));
            form.historyValUsageName    = _this.$btnHistoryValUsage.children('span').eq(0).text();
            // start date
            form.warnTimeRangeStart     = _this.$iptWarnTimeRangeStart.val();
            
            ////////////////////
            // Pre-Warn Range //
            ////////////////////
            // 0-user input, 1-history
            form.preWarnMode            = parseInt(_this.$btnPreWarnMode.attr('data-value'));
            form.preWarnModeName        = _this.$btnPreWarnMode.children('span').eq(0).text();
            form.preGreaterThan         = parseFloat(_this.$iptPreGreaterThan.val());
            form.preLessThan            = parseFloat(_this.$iptPreLessThan.val());
            // 0-user input, 1-history
            form.preWarnTimeMode        = parseInt(_this.$btnPreWarnTimeMode.attr('data-value'));
            form.preWarnTimeModeName    = _this.$btnPreWarnTimeMode.children('span').eq(0).text();
            // 0-use as lower, 1-use as upper
            form.preHistoryValUsage     = parseInt(_this.$btnPreHistoryValUsage.attr('data-value'));
            form.preHistoryValUsageName = _this.$btnPreHistoryValUsage.children('span').eq(0).text();
            // start date
            form.preWarnTimeRangeStart  = _this.$iptPreWarnTimeRangeStart.val();

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

    var PRECISION = 2;

    function ModalKPIChart (screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this._render, null, this._showConfig);
        
        // options
        this.options = $.extend(true, {}, DEFAULTS);
        this.historyChartOptions = $.extend(true, {}, HISTORY_CHART_DEFAULTS);

        // params
        this.startline = null;
        this.endline = null;
        this.targetPointData = null;
        this.referencePointData = null;
        this.refreshTimesInOneHour = 1;
        this.period = null;

        // indicators
        this.indicators = {};
        this.samplingPeriod = {
            format: 'h1',
            value2ms: 3600000
        };

        // chart
        this.historyChart = null;

        // DOM
        this.$lkUpdateTime = null;

        // trace
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
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
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalKPIChart'
    };

    ModalKPIChart.prototype.init = function () {
        var $panel = $(this.container).closest('.panel');
        // add 'update time' info
        this.$lkUpdateTime = $('<div class="lk-update-time" title="Last Update Time"><span class="glyphicon glyphicon-time"></span><span>updating...</span></div>')
            .appendTo($panel);
    };

    // render the chart
    ModalKPIChart.prototype._render = function () {
        var _this = this;
        var option = this.entity.modal.option;
        // chart options
        var min = option.chartLowerLimit || 0;
        var max = option.chartUpperLimit || 100;
        var warnMode = option.warnMode;
        var warnLower = option.warnLowerLimit;
        var warnUpper = option.warnUpperLimit;
        var preWarnMode = option.preWarnMode;
        var preWarnLower = warnLower + option.preGreaterThan;
        var preWarnUpper = warnUpper - option.preLessThan;
        var historyValUsage = option.historyValUsage;
        // point options
        var targetPointId = option.targetPointId;
        var referencePointId = option.referencePointId;
        // data cycle mode
        var dataCycleMode = option.dataCycleMode;
        var period = this.period = this.getTimePeriod();

        var postData;
        var ids = referencePointId ? [targetPointId, referencePointId] : [targetPointId];
        
        postData = [{
            dsItemIds: ids,
            timeStart: period.nowStart,
            timeEnd: period.nowEnd,
            timeFormat: this.samplingPeriod.format
        }];

        if(warnMode === 1) {
            postData.push({
                dsItemIds: ids,
                timeStart: period.refStart,
                timeEnd: period.refEnd,
                timeFormat: this.samplingPeriod.format
            });
        }

        this.init();

        // initialize series
        this.options.series[0].data[0].value = min;
        this.options.series[0].min = min;
        this.options.series[0].max = max;
        this.historyChartOptions.yAxis[0].min = min;
        this.historyChartOptions.yAxis[0].max = max;
        // initialize tooltip
        this.options.tooltip.formatter = function (p) {
            return p.seriesName+': <strong>'+p.value+'</strong><br/>From: '+ 
                _this.store.timeShaft[0] + '<br/>To: '+ _this.store.timeShaft[_this.store.timeShaft.length-1];
        };

        this.spinner.spin(this.container);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', postData)
            .done(function (rs) {
                var axisColor = _this.options.series[0].axisLine.lineStyle.color;
                var range = max - min;
                var maxIndex;
                _this.store = {list: {}, timeShaft: rs[0].timeShaft};

                // format the array to map
                for (var i = 0, len = rs[0].list.length; i < len; i++) {
                    _this.store.list[rs[0].list[i].dsItemId] = rs[0].list[i].data;
                }

                if(rs[1] !== undefined) {
                    _this.store2 = {list: {}, timeShaft: rs[1].timeShaft};
                    for (i = 0, len = rs[1].list.length; i < len; i++) {
                        _this.store2.list[rs[1].list[i].dsItemId] = rs[1].list[i].data;
                    }
                }

                // filter target point data by reference point data
                _this.filterPointData();
                _this.initIndicators();
                _this.setTimeParams();

                maxIndex = _this.store.fullTimeShaft.length - 1;
                if(warnMode === 0) {
                    if(warnLower !== undefined && (warnLower-min) > 0){
                        axisColor.push([(warnLower-min)/range, '#ff4500']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Lower Warn Line', value: warnLower, xAxis: 0, yAxis: warnLower, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                            {xAxis: _this.store.deadline, yAxis: warnLower}
                        ]);
                    } 
                    if(preWarnLower !== undefined && (preWarnLower-min) > 0) {
                        axisColor.push([(preWarnLower-min)/range, 'orange']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Lower Pre-Warn Line', value: preWarnLower, xAxis: 0, yAxis: preWarnLower, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                            {xAxis: _this.store.deadline, yAxis: preWarnLower}
                        ]);
                    }
                    if(preWarnUpper !== undefined && (preWarnUpper-min) > 0) {
                        axisColor.push([(preWarnUpper-min)/range, 'lightgreen']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Upper Pre-Warn Line', value: preWarnUpper, xAxis: 0, yAxis: preWarnUpper, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                            {xAxis: maxIndex, yAxis: preWarnUpper}
                        ]);
                    } 
                    if(warnUpper !== undefined && (warnUpper-min) > 0) {
                        axisColor.push([(warnUpper-min)/range, 'orange']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Upper Warn Line', value: warnUpper, xAxis: 0, yAxis: warnUpper, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                            {xAxis: maxIndex, yAxis: warnUpper}
                        ]);
                    }
                    axisColor.push([1, '#ff4500']);
                }
                // if use history, calculate the markLine position
                else {
                    // use as warn lower limit
                    if(historyValUsage === 0) {
                        axisColor.push([(_this.indicators.average2-min)/range, '#ff4500']);

                        if(preWarnMode === 0) {
                            preWarnLower = _this.indicators.average2 + option.preGreaterThan;
                            if( preWarnLower !== undefined && (preWarnLower-min) > 0 ) {
                                axisColor.push([(preWarnLower-min)/range, 'orange']);
                                _this.historyChartOptions.series[0].markLine.data.push([
                                    {name: 'Lower Pre-Warn Line', value: preWarnLower.toFixed(PRECISION), xAxis: 0, yAxis: preWarnLower, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                                    {xAxis: _this.store.deadline, yAxis: preWarnLower}
                                ]);
                            }
                        } else if(preWarnMode === 1 && _this.indicators.preWarnValue > _this.indicators.average2) {
                            axisColor.push([(_this.indicators.preWarnValue-min)/range, 'orange']);
                            _this.historyChartOptions.series[0].markLine.data.push([
                                {name: 'Lower Pre-Warn Line', value: _this.indicators.preWarnValue.toFixed(PRECISION), xAxis: 0, yAxis: _this.indicators.preWarnValue, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                                {xAxis: _this.store.deadline, yAxis: _this.indicators.preWarnValue}
                            ]);
                        }
                        axisColor.push([1, 'lightgreen']);

                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Lower Warn Line', value: _this.indicators.average2.toFixed(PRECISION), xAxis: 0, yAxis: _this.indicators.average2, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                            {xAxis: _this.store.deadline, yAxis: _this.indicators.average2}
                        ]);

                    }
                    // use as upper limit
                    else {
                        // from user input
                        if(preWarnMode === 0) {
                            preWarnUpper = _this.indicators.average2 - option.preLessThan;
                            if(preWarnUpper !== undefined && (preWarnUpper-min) > 0) {
                                axisColor.push([(preWarnUpper-min)/range, 'lightgreen']);
                                axisColor.push([(_this.indicators.average2-min)/range, 'orange']);
                                _this.historyChartOptions.series[0].markLine.data.push([
                                    {name: 'Upper Pre-Warn Line', value: preWarnUpper.toFixed(PRECISION), xAxis: 0, yAxis: preWarnUpper, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                                    {xAxis: _this.store.deadline, yAxis: preWarnUpper}
                                ]);
                            }
                        } else if(preWarnMode === 1 && _this.indicators.preWarnValue < _this.indicators.average2) {
                            axisColor.push([(_this.indicators.preWarnValue-min)/range, 'lightgreen']);
                            axisColor.push([(_this.indicators.average2-min)/range, 'orange']);
                            _this.historyChartOptions.series[0].markLine.data.push([
                                {name: 'Upper Pre-Warn Line', value: _this.indicators.preWarnValue.toFixed(PRECISION), xAxis: 0, yAxis: _this.indicators.preWarnValue, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                                {xAxis: _this.store.deadline, yAxis: _this.indicators.preWarnValue}
                            ]);
                        } else {
                            axisColor.push([(_this.indicators.average2-min)/range, 'lightgreen']);
                        }
                        
                        axisColor.push([1, '#ff4500']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Upper Warn Line', value: _this.indicators.average2.toFixed(PRECISION), xAxis: 0, yAxis: _this.indicators.average2, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                            {xAxis: _this.store.deadline, yAxis: _this.indicators.average2}
                        ]);
                    }
                }

                // 自适应
                _this.fitContainer();
                _this.chart = echarts.init(_this.container, AppConfig.chartTheme);
                _this.chart.clear();
                _this.chart.setOption(_this.options);
                _this.reloadChart();

                // _this.chart.hideLoading();

            }).always(function () {
                _this.spinner.stop();
            });
    };

    ModalKPIChart.prototype.filterPointData = function () {
        var option = this.entity.modal.option;
        var warnMode = option.warnMode;
        var cond = option.referenceCondition;
        var condVal = option.referenceConditionVal;
        var tPoints = null, rPoints = null;

        // don't filter if the referencePointId is not specified
        if(!option.referencePointId) return;

        tPoints = this.store.list[option.targetPointId];
        rPoints = this.store.list[option.referencePointId];
        // if the tPoints.length !== rPoints.length, we can't deal with this suitation :-(
        if(tPoints.length !== rPoints.length) return;
        for (var i = 0, len = rPoints.length; i < len; i++) {
            // turn int to float
            tPoints[i] = parseFloat(tPoints[i]);
            rPoints[i] = parseFloat(rPoints[i]);
            if(!this.isPointRuled(rPoints[i], condVal, cond)) {
                tPoints[i] = '-';
            }
        }
        // reference point data only used once, so we delete it to save memories
        // delete this.store.list[option.referencePointId];

        // filter history data
        if(warnMode === 1) {
            tPoints = this.store2.list[option.targetPointId];
            rPoints = this.store2.list[option.referencePointId];
            if(tPoints.length !== rPoints.length) return;
            for (var i = 0, len = rPoints.length; i < len; i++) {
                // turn int to float
                tPoints[i] = parseFloat(tPoints[i]);
                rPoints[i] = parseFloat(rPoints[i]);
                if(!this.isPointRuled(rPoints[i], condVal, cond)) {
                    tPoints[i] = '-';
                }
            }
            // delete this.store2.list[option.referencePointId];
        }
        
    };

    ModalKPIChart.prototype.isPointRuled = function (pointVal, condVal, cond) {
        if(condVal === null) return true;
        switch(cond) {
            // '==='
            case 0:
                return pointVal === condVal;
            // '<'
            case 1:
                return pointVal < condVal;
            // '>'
            case 2:
                return pointVal > condVal;
            default:
                return true;
        }
    };

    ModalKPIChart.prototype.setAnimation = function () {
        var option = this.entity.modal.option;
        var warnMode = option.warnMode;
        var historyValUsage = option.historyValUsage;
        var warnLower = option.warnLowerLimit;
        var warnUpper = option.warnUpperLimit;
        var preWarnLower = warnLower + option.preGreaterThan;
        var preWarnUpper = warnUpper - option.preLessThan;
        var $parent = $(this.container).parents('.panel');
        var curVal = this.indicators.average;
        // reset
        $parent.removeClass('warn-anim pre-warn-anim');
        if(warnMode === 1) {
            if( (historyValUsage === 0 && curVal < this.indicators.average2) ||
                (historyValUsage === 1 && curVal > this.indicators.average2)) {
                $parent.addClass('warn-anim');
            }
        } else {
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
        }
        
    };

    // update the chart
    ModalKPIChart.prototype.update = function (rs) {
        var option = this.entity.modal.option;
        var targetPointId = option.targetPointId;
        var referencePointId = option.referencePointId;
        var targetPointData, referencePointData;

        var lastTick, nowTick;

        // if store object is null, the first load is pending or failed
        // do not do anything
        if(!this.store) return;

        // get the last tick, and move after 5 minutes
        lastTick = this.store.timeShaft[this.store.timeShaft.length-1];
        lastTick = lastTick.toDate().valueOf() + 60000;
        nowTick = new Date().valueOf();
        // only now time greater than lastTick time, we do update
        if( nowTick < lastTick) {
            return;
        }

        for (var i = 0, len = rs.length; i < len; i++) {
            if(targetPointId === rs[i].dsItemId) {
                targetPointData = parseFloat(rs[i].data);
            }
            if(referencePointId === rs[i].dsItemId) {
                referencePointData = parseFloat(rs[i].data);
            }
        }

        if(isNaN(targetPointData)) return;

        this.appendData(targetPointData, referencePointData);

        // reload the chart
        this.reloadChart();
    };

    ModalKPIChart.prototype.reloadChart = function () {
        this.options.series[0].data[0].value = this.indicators.average.toFixed(PRECISION);
        //this.chart.setSeries(this.options.series, true);
        var opt = this.chart.getOption();
        opt.series = this.options.series;
        this.chart.setOption(opt);
        this.setAnimation();

        // set update time
        this.$lkUpdateTime.children('span').eq(1).text(new Date().format('HH:mm'));
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
        if(form.referencePointId) this.entity.modal.points.push(form.referencePointId);
        this.entity.modal.option = form;
        this.entity.modal.interval = 60000;
    };

    ModalKPIChart.prototype.configModal = new ModalKPIConfig({onSubmit: function (form) { this.saveConfig(form); }});

    ModalKPIChart.prototype.getTimePeriod = function () {
        var now;
        var period = {};
        var option = this.entity.modal.option;
        var warnMode = option.warnMode;
        var historyValUsage = option.historyValUsage;
        var warnStart = option.warnTimeRangeStart;
        var warnTimeMode = option.warnTimeMode;
        var startDate = option.warnTimeRangeStart;
        var circleMode = option.dataCycleMode;
        var startMonth;

        if (!this.m_bIsGoBackTrace) {
            now = new Date();
            this.DEFAULTS = true;
            this.HISTORY_CHART_DEFAULTS = true;
        }
        else {
            now = this.m_traceData.currentTime;
            this.DEFAULTS = false;
            this.HISTORY_CHART_DEFAULTS = false;
        }

        // monthly
        if(circleMode === 0) {
            period.nowStart = now.format('yyyy-MM-01 00:00:00');
            period.nowEnd = now.format('yyyy-MM-dd HH:mm:ss');
            
            // if warnMode is 0, we need not to continue
            if(warnMode === 0) return period;

            // calculate history start date
            if(warnTimeMode === 0) {
                period.refStart = warnStart.toDate().format('yyyy-MM');
                period.refEnd = period.refStart + '-' + DateUtil.daysInMonth(period.refStart.toDate()) + ' 23:59:59';
                period.refStart += '-01 00:00:00';
            } else {
                period.refStart = (now.format('yyyy')-1) + now.format('-MM');
                // deal with leap year
                period.refEnd = period.refStart + '-' + DateUtil.daysInMonth(period.refStart.toDate()) + ' 23:59:59';
                period.refStart += '-01 00:00:00';
            }
            period.lag = period.nowStart.toDate().valueOf() - period.refStart.toDate().valueOf();
        }
        // quarterly
        else {

        }

        return period;
    };

    ModalKPIChart.prototype.initIndicators = function () {
        var option = this.entity.modal.option;
        var warnMode = option.warnMode;
        var preWarnMode = option.preWarnMode;
        var dsId = option.targetPointId;
        var data = this.store.list[dsId];
        var average = 0, sum = 0;
        var list1, list2;

        // AVERAGE INDICATOR
        for (var i = 0, len = data.length; i < len; i++) {
            if(isNaN(data[i])) continue;
            average += data[i]*1;
        };
        // if average is NaN
        if(isNaN(average)) this.indicators.average = this.entity.modal.option.chartLowerLimit;
        else this.indicators.average = average / len;

        // history data
        if(warnMode === 1) {
            average = 0;
            data = this.store2.list[dsId];
            for (var i = 0, len = data.length; i < len; i++) {
                if(isNaN(parseFloat(data[i]))) continue;
                average += data[i]*1;
            };
            // if average is NaN
            if(isNaN(average)) this.indicators.average2 = this.entity.modal.option.chartLowerLimit;
            else this.indicators.average2 = average / len;
        }

        if(preWarnMode === 1) {
            this.setPreWarnValue();
        }
    };

    ModalKPIChart.prototype.setPreWarnValue = function () {
        var option = this.entity.modal.option;
        var targetPointId = option.targetPointId;
        var warnMode = option.warnMode;
        var preHistoryValUsage = option.preHistoryValUsage;
        var list1 = this.store.list[targetPointId];
        var list2 = this.store2.list[targetPointId];
        var average = 0;
        var sum = 0;
        var validNum = 0;
        for (var i = 0, len1 = list1.length, len2 = list2.length; i < len2; i++) {
            if(i >= len1) {
                if(isNaN(list2[i])) continue;
                sum += list2[i];
            } else {
                if(isNaN(list1[i])) continue;
                sum += list1[i];
            }
            validNum += 1;
        }
        if(warnMode === 1) {
            this.indicators.preWarnValue = this.indicators.average + this.indicators.average2 - sum/validNum;
        } else {
            if(preHistoryValUsage === 0) {
                this.indicators.preWarnValue = this.indicators.average + option.warnLowerLimit - sum/validNum;
            } else {
                this.indicators.preWarnValue = this.indicators.average + option.warnUpperLimit - sum/validNum;
            }
        }
    };

    ModalKPIChart.prototype.appendData = function (tValue, rValue) {
        var lastTick = this.store.timeShaft[this.store.timeShaft.length-1];
        var option = this.entity.modal.option;
        var preWarnMode = option.preWarnMode;
        var targetPointId = option.targetPointId;
        var targetPointList = this.store.list[targetPointId];
        var cond = option.referenceCondition;
        var condVal = option.referenceConditionVal;
        var len = this.store.list[targetPointId].length;
        var nowStr = new Date().format('yyyy-MM-dd HH:00:00')
        var lastValue, newLastValue;
        var timeStamp;

        if(isNaN(rValue) || this.isPointRuled(rValue, condVal, cond)) {
            // here, don not care about the precision
            tValue = tValue.toFixed(3) * 1;
            if(lastTick !== nowStr) {
                timeStamp = lastTick.toDate().valueOf();
                // deal with the suitation when there is no data in last hour
                if ((nowStr.toDate().valueOf() - timeStamp) > 3600000) {
                    this.store.timeShaft.push(new Date(timeStamp+3600000).format('yyyy-MM-dd HH:00:00'));
                }

                this.store.timeShaft.push(nowStr);
                this.refreshTimesInOneHour = 0;
                // push new value
                this.indicators.average = (this.indicators.average*len+tValue) / (len+1);
                targetPointList.push(tValue);

            } else {
                lastValue = targetPointList[targetPointList.length-1]
                newLastValue =
                    (lastValue*this.refreshTimesInOneHour+tValue) / (this.refreshTimesInOneHour+1);
                targetPointList[targetPointList.length-1] = newLastValue.toFixed(3)*1;
                this.indicators.average = (this.indicators.average*len-lastValue+newLastValue) / len;
                this.refreshTimesInOneHour += 1;
            }
            
            if(preWarnMode === 1) {
               this.setPreWarnValue();
            }
        }
    };

    ModalKPIChart.prototype.setTimeParams = function () {
        if(this.store.timeShaft.length == 0) return;
        var lastTick = this.store.timeShaft[this.store.timeShaft.length-1].toDate().valueOf();
        var option = this.entity.modal.option;
        var tick = lastTick + this.samplingPeriod.value2ms;
        var now = new Date();

        // copy array
        this.store.fullTimeShaft = this.store.timeShaft.concat();
        // monthly
        if(option.dataCycleMode === 0) {
            this.store.deadline = now.format('yyyy-MM-' + DateUtil.daysInMonth(now) + ' 23:55:00').toDate();
            // get the last day of current month
            while(tick <= this.store.deadline) {
                tick += this.samplingPeriod.value2ms;
                this.store.fullTimeShaft.push(tick.toDate().format('yyyy-MM-dd HH:mm:ss'));
            }
        }
        // quarterly
        else {

        }
    };

    ModalKPIChart.prototype.fitContainer = function () {
        var row = this.entity.spanR;
        var column = this.entity.spanC;

        if(Math.min(row, column) < 3) {
            this.options.series[0].splitLine.length = 15;
            this.options.series[0].axisLine.lineStyle.width = 6;
            this.options.series[0].axisTick.length = 12;
            this.options.series[0].pointer.width = 4;
            this.options.series[0].detail.textStyle.fontSize = 16;
        }

    };

    ModalKPIChart.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this._render();
        this.m_bIsGoBackTrace = false;
    };

    var DEFAULTS = {
        tooltip: {},
        visualMap: {
            show: false
        },
        series: [{
            name: 'KPI Indicator',
            type: 'gauge',
            precision: 2,
            splitNumber: 10,
            axisTick: {
                show: true,
                splitNumber: 5,
                length :20,
                lineStyle: {
                    color: 'auto',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLine:{ // 坐标轴线  外围一圈
                show: true,
                lineStyle: {
                    color:[],
                    width:1
                }
            },
            axisLabel: {//刻度标签  字体
                textStyle: {
                    color: '#a2adbc'
                }
            },
            splitLine: { //分割线
                show: true,
                length :30,
                lineStyle: {
                    color: 'auto',
                    width: 2,
                    type: 'solid'
                }
            },
            pointer : {
                length : '80%',
                width : 4
            },
            detail : {
                offsetCenter:['0', '-30%'],
                textStyle: {
                    color: '#ccc',
                    fontSize : 20
                }
            },
            data: [{name: ''}]
        }
        ],
        animation: true
    };

    var HISTORY_CHART_DEFAULTS = {
        title : {
            text : 'History Data'
        },
        legend: {data: ['Target Point']},
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
                type: 'category'
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name: 'Target Point',
                type: 'line',
                symbolSize: 0,
                markLine: {
                    precision: 3,
                    symbol: 'none',
                    data: []
                },
                markPoint: {
                    symbol:'emptyCircle',
                    effect : {
                        show: true,
                        shadowBlur : 0
                    },
                    data: []
                }
            }
        ],
        animation: true
    };

    return ModalKPIChart;

} (jQuery));
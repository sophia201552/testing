﻿(function ($) {

    function ModalDBHistory() {
        this.options = undefined;
        // 当前需要渲染的实例
        this.modal = null;
        this.refChart = null;

        this.showOptions = {};
    }

    ModalDBHistory.prototype.show = function () {
        var _this = this;
        var domPanelContent = document.getElementById('paneCenter');

        if(!this.modal) return;
        this.options = getDefaultOption();

        // 查看页面是否已经缓存过模板
        // 没有缓存，则从服务端获取模板
        if($('#modalDBHistoryWrap').length > 0) {
            this.initCustomShow();
            return;
        }

        Spinner.spin(domPanelContent);
        WebAPI.get('/static/views/observer/widgets/modalDBHistory.html')
        .done(function (html) {
            Spinner.stop();
            _this.$wrap = $('<div class="modal-db-history-wrap" id="modalDBHistoryWrap">')
                .appendTo(domPanelContent).html(html);
            _this.$modal = _this.$wrap.children('.modal');
            I18n.fillArea(_this.$wrap);
            _this.init();
            _this.initCustomShow();
        });
    };

    // 自定义显示
    ModalDBHistory.prototype.displayCustomShow = function (options) {
        if(!options) return;

        this.$selMode.val(options.mode);
        this.$selMode.trigger('change');

        // 处理显示时间间隔，开始结束时间
        if(options.mode === 'fast') {
            this.$selTimerange.val(options.timeRange);
        } else {
            this.$selInterval.val(options.timeFmt);
            this.$selInterval.trigger('change');

            this.$iptTimeStart.val(options.startTimeStr);
            this.$iptTimeEnd.val(options.endTimeStr);
        }

        this.$modal.modal('show');
    };

    ModalDBHistory.prototype.initCustomShow = function () {
        var showOptions = this.showOptions;
        var now;

        if(this.modal.type === "ModalMultiple") {
            now = new Date();
            showOptions.mode = 'custom';
            showOptions.timeFmt = 'h1';
            // 向前推100个小时
            showOptions.startTimeStr = function () {
                return new Date(now.valueOf() - 360000000/* 100*60*60*1000 */).format('yyyy-MM-dd HH:00'); 
            }.call(this);
            showOptions.endTimeStr = function () {
                return now.format('yyyy-MM-dd HH:00');
            }.call(this);

        } else {
            showOptions = this.showOptions = {
                mode: 'fast',
                timeRange: 'day'
            };
        }
        this.displayCustomShow(showOptions);
    };

    ModalDBHistory.prototype.getOptionsByType = function (data) {
        var options = [];

        if(this.modal.type === 'ModalMultiple') {
            options = function () {
                var series = [];
                var legend = [];
                var typeMap = {};
                var paraType = this.modal.option.paraType || [];
                var usedDsNameMap = {};
                
                paraType.forEach(function (row) {
                    if(!row.arrId || !row.arrId.length) return;
                    row.arrId.forEach(function (dsId) {
                        if(typeMap[dsId] === undefined) {
                            typeMap[dsId] = [row.type];
                        } else {
                            typeMap[dsId].push(row.type);
                        }
                    });
                });

                data.list.forEach(function (row) {
                    var type = typeMap[row.dsItemId].shift();
                    var dsId = row.dsItemId;
                    var name = AppConfig.datasource.getDSItemById(dsId).alias || dsId;
                    // 处理 undefined 的情况
                    usedDsNameMap[dsId] = usedDsNameMap[dsId] || 0;
                    usedDsNameMap[dsId] += 1;

                    if(usedDsNameMap[dsId] > 1) {
                        name = name + '_' + usedDsNameMap[dsId];
                    }

                    legend.push(name);

                    switch(type) {
                        case 'line':
                            series.push({
                                name: name,
                                type: 'line',
                                symbol: 'none',
                                data: row.data,
                                yAxisIndex: 1
                            });
                            break;
                        case 'bar':
                            series.push({
                                name: name,
                                type: 'bar',
                                symbol: 'none',
                                data: row.data,
                                yAxisIndex: 0
                            });
                            break;
                        case 'area':
                            series.push({
                                name: name,
                                type: 'line',
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                symbol: 'none',
                                data: row.data,
                                yAxisIndex: 0
                            });
                            break;
                        case 'cumulativeBar':
                            series.push({
                                name: name,
                                type: 'bar',
                                stack:'realtime total',
                                symbol: 'none',
                                data: row.data,
                                yAxisIndex: 0
                            });
                            break;
                        default: break;
                    }

                });
                return {
                    series: series,
                    legend: {data: legend},
                    yAxis: [
                        {
                            type: 'value',
                            scale: false,
                            splitArea:{show:false}
                        },
                        {
                            type: 'value',
                            scale: false,
                            splitArea:{show:false}
                        }
                    ]
                };
            }.call(this);

        } else {
            options = function () {
                var series = [];
                var legend = [];
                var usedDsNameMap = {};

                data.list.forEach(function (row) {
                    var dsId = row.dsItemId;
                    var name = AppConfig.datasource.getDSItemById(dsId).alias || dsId;
                    // 处理 undefined 的情况
                    usedDsNameMap[dsId] = usedDsNameMap[dsId] || 0;
                    usedDsNameMap[dsId] += 1;

                    if(usedDsNameMap[dsId] > 1) {
                        name = name + '_' + usedDsNameMap[dsId];
                    }

                    series.push({
                        name: name,
                        symbol: 'none',
                        type: 'line',
                        markLine: {
                            data: [{type : 'average', name: 'average'}]
                        },
                        data: row.data
                    });

                    legend.push(name);
                });
                return {
                    series: series,
                    legend: {data: legend}
                };
            }.call(this);
        }

        if(this.refChart) {
            try {
                options.color = this.refChart.getOption().color || [];
            } catch (e) {}
            
        }

        return options;
    };

    ModalDBHistory.prototype.init = function () {
        this.$chartContainer = $('.chart-container', this.$modal);
        this.$btnSearch = $('.btn-search', this.$modal);
        this.$selMode = $('.sel-mode', this.$modal);

        this.$selTimerange = $('.sel-timerange', this.$modal);
        this.$selInterval = $('.sel-interval', this.$modal);
        this.$iptTimeStart = $('.ipt-timestart', this.$modal);
        this.$iptTimeEnd = $('.ipt-timeend', this.$modal);

        this.$groupFast = $('[data-group="fast"]', this.$modal);
        this.$groupCustom = $('[data-group="custom"]', this.$modal);

        this.initValidator();
        // 添加事件
        this.attachEvents();
    };

    ModalDBHistory.prototype.initValidator = function () {
        var _this = this;
        this.validator = new Validator({
            elements: [{
                name: 'endTime',
                selector: this.$iptTimeEnd,
                rules: [{
                    valid: function (val) {
                        var startTimeVal = _this.$iptTimeStart.val();
                        if(val <= startTimeVal) {
                            this.fail();
                        } else {
                            this.success();
                        }
                    },
                    msg: 'the end time should later than start time.'
                }]
            }],
            icon: false
        });
    };

    ModalDBHistory.prototype.initTimePlugin = function (fmt) {
        var now = new Date();
        if(!fmt) {
            fmt = {
                format: 'yyyy-mm-dd hh:ii',
                showFormat: 'yyyy-MM-dd HH:mm',
                minView: 'hour',
                startView: 'month',
                startTime: new Date(now.valueOf() - 60*60*24*1000)
            };
        } else {
            this.$iptTimeStart.datetimepicker('remove');
            this.$iptTimeEnd.datetimepicker('remove');
        }

        this.$iptTimeStart.datetimepicker({
            format: fmt.format,
            minView: fmt.minView,
            startView: fmt.startView,
            autoclose: true,
            todayBtn: true,
            initialDate: now
        });
        this.$iptTimeStart.val( fmt.startTime.format(fmt.showFormat) );

        this.$iptTimeEnd.datetimepicker({
            format: fmt.format,
            minView: fmt.minView,
            startView: fmt.startView,
            autoclose: true,
            todayBtn: true,
            initialDate: now
        });
        this.$iptTimeEnd.val( now.format(fmt.showFormat) );
    };

    ModalDBHistory.prototype.initChart = function () {
        if(!this.chart) {
            this.chart = echarts.init(this.$chartContainer[0], 'macarons');//不需要跟随皮肤切换
        }
    };

    // 设置
    ModalDBHistory.prototype.setOptions = function (options) {
        this.options = options;
    };

    ModalDBHistory.prototype.setModal = function (modal, chart) {
        this.modal = modal;
        this.refChart = chart;
    };

    ModalDBHistory.prototype.attachEvents = function () {
        var _this = this;

        this.$selMode.off('change').on('change', function (e) {
            var mode = $(this).val();

            if(mode === 'fast') {
                _this.$selTimerange.val('hour');
                _this.$groupFast.show();
                _this.$groupCustom.hide();
            } else {
                _this.$groupFast.hide();
                _this.$groupCustom.show();
                _this.$selInterval.trigger('change');
            }
            _this.showOptions.mode = mode;
        });

        this.$selInterval.off('change').on('change', function (e) {
            var interval = $(this).val();
            var fmt = {};
            var now = new Date(), nowTick = now.valueOf();
            fmt.endTime = now;

            switch (interval) {
                case 'm1':
                    fmt.startTime = new Date(nowTick - 60000); /* 60*1000 */
                    fmt.format = "yyyy-mm-dd hh:ii";
                    fmt.showFormat = 'yyyy-MM-dd HH:mm';
                    fmt.minView = 'hour';
                    fmt.startView = 'month';
                    break;
                case 'm5':
                    fmt.startTime = new Date(nowTick - 300000); /* 5*60*1000 */
                    fmt.format = "yyyy-mm-dd hh:ii";
                    fmt.showFormat = 'yyyy-MM-dd HH:mm';
                    fmt.minView = 'hour';
                    fmt.startView = 'month';
                    break;
                case 'h1':
                    fmt.startTime = new Date(nowTick - 3600000); /* 60*60*1000 */
                    fmt.format = "yyyy-mm-dd hh:00";
                    fmt.showFormat = 'yyyy-MM-dd HH:00';
                    fmt.minView = 'day';
                    fmt.startView = 'month';
                    break;
                case 'd1':
                    fmt.startTime = new Date(nowTick - 86400000); /* 24*60*60*1000 */
                    fmt.format = "yyyy-mm-dd";
                    fmt.showFormat = 'yyyy-MM-dd';
                    fmt.minView = 'month';
                    fmt.startView = 'month';
                    break;
                case 'M1':
                    fmt.startTime = new Date(nowTick - 2592000000); /* 30*24*60*60*1000 */
                    fmt.format = "yyyy-mm";
                    fmt.showFormat = 'yyyy-MM';
                    fmt.minView = 'year';
                    fmt.startView = 'year';
                    break;
            }
            _this.initTimePlugin(fmt);
        });

        this.$btnSearch.off('click').on('click', function (e) {
            var startTime, endTime, timeFmt;
            var rangeTick;

            if(_this.showOptions.mode === 'fast') {
                switch(_this.$selTimerange.val()) {
                    case 'hour':
                        rangeTick = 3600000; // 60*60*1000
                        timeFmt = 'm5';
                        break;
                    case 'day':
                        rangeTick = 86400000; // 24*60*60*1000
                        timeFmt = 'h1';
                        break;
                    case 'week':
                        rangeTick = 604800000; // 7*24*60*60*1000
                        timeFmt = 'h1';
                        break;
                    case 'month':
                        rangeTick = 2592000000; // 30*24*60*60*1000
                        timeFmt = 'd1';
                        break;
                    case 'quarter':
                        rangeTick = 7776000000; // 90*24*60*60*1000
                        timeFmt = 'd1';
                        break;
                    default:
                        break;
                }
                endTime = new Date();
                startTime = new Date( endTime.valueOf() - rangeTick );
                _this.updateChart(startTime, endTime, timeFmt);
            } else {
                _this.validator.valid().done(function () {
                    startTime = new Date( _this.$iptTimeStart.val() );
                    endTime = new Date( _this.$iptTimeEnd.val() );
                    timeFmt = _this.$selInterval.val();
                    _this.updateChart(startTime, endTime, timeFmt);
                });
            }
            e.stopPropagation();
        });

        this.$modal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
            // 重置一下
            _this.reset();
            e.preventDefault();
            e.stopPropagation();
        });

        this.$modal.off('shown.bs.modal').on('shown.bs.modal', function (e) {
            // 初始化图表
            _this.initChart();
            // 触发刷新
            _this.$btnSearch.trigger('click');
        });
    };

    ModalDBHistory.prototype.updateChart = function (start, end, timeFmt) {
        var _this = this;
        var startTick, endTick;
        var points = this.modal.points;

        // 如果没有 points, 界面显示无数据
        if(!points || !points.length) {
            this.chart.setSeries([]);
            return;
        }

        // show loading
        this.chart.showLoading({
            text : 'Loading',
            effect: 'spin',
            textStyle : {
                fontSize : 20
            }
        });

        // 获取数据
        return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            dsItemIds: points,
            timeStart: start.format('yyyy-MM-dd HH:mm:ss'),
            timeEnd: end.format('yyyy-MM-dd HH:mm:ss'),
            // 1 小时数据默认间隔 5 分钟
            timeFormat: timeFmt
        }).then(function (rs) {
            rs = JSON.parse(rs);
            var seriesData = [];
            var xAxisData = [];
            var timeShaft = rs.timeShaft;
            var list = rs.list;
            var optionsFromType;
            
            // 如果没数据，直接不处理
            if(!rs.timeShaft || !rs.timeShaft.length) {
                _this.chart.setOption({
                    series: [{}]
                }, true);
                return;   
            }

            // x 轴数据
            timeShaft.forEach(function (row, i) {
                xAxisData.push( row.toDate().format('MM-dd HH:mm') );
            });

            optionsFromType = _this.getOptionsByType(rs);

            // rendering
            _this.options.chartOptions.xAxis = [{
                boundaryGap: false,
                type: 'category',
                data: xAxisData
            }];

            _this.options.chartOptions = $.extend(false, _this.options.chartOptions, optionsFromType);

            _this.chart.setOption(_this.options.chartOptions, true);

            _this.chart.hideLoading();
        }, function () {
            // 如果接口返回错误，界面显示无数据
            _this.chart.setOption({
                series: [{}]
            }, true);
        });
    };

    ModalDBHistory.prototype.reset = function () {
        if(!!this.chart) {
            this.chart.clear();
            this.chart.dispose();
            this.chart = null;
        }
    };

    ModalDBHistory.prototype.close = function () {
        this.$wrap.remove();
    };

    function getDefaultOption () {
        var i18nEcharts = I18n.resource.echarts;
        return {
            chartOptions: {
                toolbox: {
                    show : true,
                    feature : {
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
                            lang : i18nEcharts.SAVE
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                dataZoom: {
                    show: true
                },
                grid: {
                    y: 50,
                    y2: 80
                },
                yAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0.1, 0.1]
                    }
                ],
                series: []
            }
        };
    }

    this.ModalDBHistory = ModalDBHistory;
}).call(this, jQuery);

var ModalBase = (function () {

    function ModalBase(parent, entity, _funcRender, _funcUpdate,_funcConfigMode) {
        if (!parent) return;
        this.screen = parent;
        this.entity = entity;
        this.wikis = {};

        this.container = undefined;
        this.chart = undefined; //chart or other
        this.spinner = undefined;

        this.executeRender = _funcRender;
        this.executeConfigMode = _funcConfigMode;
        this.executeUpdate = _funcUpdate;

        this.modalWikiCtr = undefined;

        this.initContainer();
    };

    ModalBase.prototype = {
        UNIT_WIDTH: 8.325,   // 100/12 = 8.3 一行均分为12列,为了精确,保留3位小数
        UNIT_HEIGHT: 16.5,    // 100/6 = 16.5   一屏均分为6行

        initContainer: function (replacedElementId) {
            var divParent = document.getElementById('divContainer_' + this.entity.id);
            var isNeedCreateDivParent = false;
            var scrollClass = '';

            if ((!divParent) || replacedElementId) {
                var isNeedCreateDivParent = true;
            }

            if (isNeedCreateDivParent) {
                divParent = document.createElement('div');
                divParent.id = 'divContainer_' + this.entity.id;
            }

            //get container
            if (replacedElementId) {
                var $old = $('#divContainer_' + replacedElementId);
                $(divParent).insertAfter($old);
                $old.remove();
            }
            else {
                isNeedCreateDivParent && this.screen.container.appendChild(divParent);
            }
            
            divParent.className = 'springContainer';
            //adapt ipad 1024px
            if (AppConfig.isMobile) {
                divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR * 2 + '%';
                divParent.style.width = this.UNIT_WIDTH * this.entity.spanC * 2 + '%';
            } else {
                divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR + '%';
                divParent.style.width = this.UNIT_WIDTH * this.entity.spanC + '%';
            }
            //便签和组合图高度超出部分要加滚动条样式
            if(this.entity.modal.type == 'ModalNote' || this.entity.modal.type == 'ModalMix'){
                scrollClass = ' gray-scrollbar scrollY'
            }
            if (this.entity.modal.title && this.entity.modal.title != '' && (!this.entity.isNotRender)) {
                divParent.innerHTML = '<div class="panel panel-default">\
                    <div class="panel-heading springHead">\
                        <h3 class="panel-title" style="font-weight: bold;">' + this.entity.modal.title + '</h3>\
                    </div>\
                    <div class="panel-body springContent' + scrollClass + '" style="position: relative;"></div>\
                </div>';
            } else {
                divParent.innerHTML = '<div class="panel panel-default" >\
                    <div class="panel-body springContent' + scrollClass + '" style="position: relative;height:100%;"></div>\
                </div>';
            }

            //按钮容器:锚链接,历史数据,wiki
            if(!(this instanceof ModalAnalysis)){
                var divBtnCtn = document.createElement('div');
                divBtnCtn.className = 'springLinkBtnCtn';

                var domPanel = divParent.getElementsByClassName('panel')[0];
                var lkHistory;

                // jump button
                if (this.entity.modal.points && this.entity.modal.points.length > 0) {
                    var lkJump;
                    lkJump = document.createElement('a');
                    lkJump.className = 'springLinkBtn';
                    lkJump.title = 'Add to datasource';
                    lkJump.href = 'javascript:;';
                    lkJump.innerHTML = '<span class="glyphicon glyphicon-export"></span>';
                    divBtnCtn.appendChild(lkJump);
                    lkJump.onclick = function() {
                        new ModalAppendPointToDs(true, _this.entity.modal.points, null).show();
                    }
               }

                // '历史数据' 按钮逻辑开始
                if(['ModalHtml', 'ModalMix', 'ModalObserver', 'ModalRank', 'ModalRankNormal', 'ModalNone'].indexOf(this.entity.modal.type) > -1
                    || !this.entity.modal.points || !this.entity.modal.points.length) {
                } else {
                    lkHistory = document.createElement('a');
                    lkHistory.className = 'springLinkBtn';
                    lkHistory.title = 'Show History';
                    lkHistory.href = 'javascript:;';
                    lkHistory.innerHTML = '<span class="glyphicon glyphicon-stats"></span>';
                    divBtnCtn.appendChild(lkHistory);
                    // 添加 "历史数据" 按钮事件
                    this.attachLkHistoryEvents( lkHistory );
                }
                // '历史数据' 按钮逻辑结束

                //锚链接 start
                var link = this.entity.modal.link;
                var _this = this;
                if(link && AppConfig.menu[link]){
                    var linkBtn = document.createElement('a');
                    linkBtn.className = 'springLinkBtn';
                    linkBtn.innerHTML = '<span class="glyphicon glyphicon-link"></span>';
                    linkBtn.setAttribute('pageid',link);
                    linkBtn.title = 'Link to ' + AppConfig.menu[link];
                    divBtnCtn.appendChild(linkBtn);
                    linkBtn.onclick = function(e){
                        var $ev =  $('#ulPages [pageid="'+ link +'"]');
                        if($ev[0].className != 'nav-btn-a'){
                            $ev = $ev.children('a');
                            $ev.closest('.dropdown').children('a').trigger('click');
                        }
                        $ev.trigger('click');
                    }
                }
                //锚链接 end

                //wiki start
                //var wiki = this.entity.modal.wiki;
                var wikiId = this.entity.modal.wikiId;
                if(wikiId){
                    var wikiBtn = document.createElement('a');
                    wikiBtn.className = 'springLinkBtn';
                    wikiBtn.innerHTML = '<span class="glyphicon glyphicon-info-sign"></span>';
                    wikiBtn.title = 'View detail info';
                    wikiBtn.id = wikiId;
                    divBtnCtn.appendChild(wikiBtn);
                    wikiBtn.onclick = function(){
                        _this.getInstanceOfModalWiki().viewWikiInfo(wikiId);
                    }
                }
                //wiki end

                domPanel.appendChild(divBtnCtn);
            }

            //this.initToolTips(divParent.getElementsByClassName('springHead'));
            this.container = divParent.getElementsByClassName('springContent')[0];

            if(this.entity.modal.type !== 'ModalMix'){
                this.spinner = new LoadingSpinner({color: '#00FFFF'});
                this.spinner.spin(this.container);
            }
            return this;
        },

        initToolTips: function(parent) {
            var _this = this;
            if (!parent) return;
            var descTip = new StringBuilder();
            descTip.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px;">');
            descTip.append('    <div class="tooltipTitle tooltip-inner" style="display:none">GeneralRegressor</div>');
            descTip.append('    <div class="tooltipContent" style="border:1px solid black">');
            descTip.append('        <p class="containerDesc" style="word-break:break-all;"><span style="font-weight:bold">').append(_this.entity.modal.desc).append('</span> ').append('</p>');
            descTip.append('    </div>');
            descTip.append('    <div class="tooltip-arrow"></div>');
            descTip.append('</div>');
            var options = {
                placement: 'bottom',
                title: _this.entity.modal.title,
                template: descTip.toString()
            };
            if (_this.entity.modal.desc && _this.entity.modal.desc !=''){
                $(parent).tooltip(options);
            }
        },

        render: function () {
            try {
                this.executeRender();
            } catch (e) {
                console.warn(e);
            }

            if (this.chart) {
                this.chart.on('resize', function (param) {
                    this.resize();
                });
            }
        },

        update: function (options) {
            var modal, dsChartConfig, accuracy;
            var num, specialCond;
            if ((!options) || options.length == 0) return;

            // 新增精度处理逻辑
            modal = this.entity.modal;
            dsChartConfig = modal.dsChartCog && modal.dsChartCog.length ? modal.dsChartCog[0] : {};
            accuracy = dsChartConfig.accuracy;

            // 将字符串转换成数字的方法: +str
            // +'12'      = 12
            // +'12.'     = 12
            // +'12..'    = NaN
            // +'.12'     = 0.12
            // +'..12'    = NaN
            // +'今天天气不错' = NaN
            // +'12号闸有问题' = NaN
            // 特殊情况需注意
            // +''        = 0
            // +null      = 0
            // +undefined = 0
            
            // 如果精度不为空，且为数字
            if( accuracy !== '' && !isNaN(accuracy) ) {
                specialCond = ['', null, undefined];
                options = options.map(function (row, i) {
                    // 排除特殊情况 ('', null, undefined)
                    // 和字符串文本的情况 ('今天天气不错'、'12号闸有问题'等)
                    if( specialCond.indexOf(row.data) > -1 || isNaN(row.data) ) {
                        // 特殊情况不做处理
                        return row;
                    } else {
                        // 如果不是，做进制转换
                        // 首先转换成数字，若本身就是数字，则不受影响
                        num = +row.data;
                        // 这边将数据统一返回成字符串格式，可能有风险
                        row.data = num.toFixed(accuracy);
                        return row;
                    }
                });
            }

            try {
                this.executeUpdate(options);
            } catch(e) {
                console.warn(e);                
            }
        },

        configure: function () {
            this.spinner && this.spinner.stop();
            var _this = this;

            if (this.chart) this.chart.clear();
            this.divResizeByMouseInit();

            var divMask = document.createElement('div');
            divMask.className = 'springConfigMask';
            divMask.draggable = 'true';
            if (this.entity.modal.type !='ModalAnalysis' || !this.screen.isForReport) {
                var btnConfig = document.createElement('span');
                btnConfig.className = 'glyphicon glyphicon-cog springConfigBtn grow';
                btnConfig.title = 'Options';
                btnConfig.onclick = btnConfig_clickEvent;
                divMask.appendChild(btnConfig);
            }
            var btnRemove = document.createElement('span');
            btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
            btnRemove.title = 'Remove';
            btnRemove.onclick = function (e) {
                if (_this.chart) _this.chart.clear();
                if(_this.screen.screen){//兼容ModalMix
                    _this.screen.screen.removeEntity(_this.entity.id);
                }else{
                    _this.screen.removeEntity(_this.entity.id);
                }

                $('#divContainer_' + _this.entity.id).remove();
                _this.screen.isScreenChange = true;
                _this = null;
            };
            divMask.appendChild(btnRemove);

            var btnHeightResize = document.createElement('div');
            var maxHeight = this.optionTemplate.maxHeight;
            var maxWidth = this.optionTemplate.maxWidth;
            var minHeight = this.optionTemplate.minHeight;
            var minWidth = this.optionTemplate.minWidth;
            btnHeightResize.className = 'divResize divHeightResize';
            btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
            '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
            '<h5 class="rangeVal">' + _this.entity.spanR + ' /6</h5>' +
            '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
            divMask.appendChild(btnHeightResize);
            var btnWidthResize = document.createElement('div');
            btnWidthResize.className = 'divResize divWidthResize';
            btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
            '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
            '<h5 class="rangeVal">' + _this.entity.spanC + ' /12</h5>' +
            '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
            divMask.appendChild(btnWidthResize);
            var divTitleAndType = document.createElement('div');
            divTitleAndType.className = 'divTitleAndType';
            divMask.appendChild(divTitleAndType);


            var $divTitle = $('<div class="divResize chartTitle">');
            var $labelTitle = $('<label for="title">').text(I18n.resource.dashboard.show.TITLE);
            var inputChartTitle = document.createElement('input');
            inputChartTitle.id = 'title';
            inputChartTitle.className = 'form-control';
            inputChartTitle.value = this.entity.modal.title;
            inputChartTitle.setAttribute('placeholder',I18n.resource.dashboard.show.TITLE_TIP);
            if(this.entity.modal.title != ''){
                inputChartTitle.style.display = 'none';
            }
            inputChartTitle.setAttribute('type','text');
            $divTitle.append($labelTitle).append($(inputChartTitle));
            divTitleAndType.appendChild($divTitle[0]);

            var $divType = $('<div class="divResize chartType">');
            var $labelType = $('<label>').text(I18n.resource.dashboard.show.TYPE);
            var chartType = document.createElement('span');
            chartType.innerHTML = I18n.findContent(this.optionTemplate.name);
            $divType.append($labelType).append($(chartType));
            divTitleAndType.appendChild($divType[0]);

            //ModalAnalysis类型(来自数据分析)不需要link wiki pop功能
            if(!(this instanceof ModalAnalysis)){
                //link
                var $divLink = $('<div class="divResize chartLink">');
                var $labelLink = $('<label>').text(I18n.resource.dashboard.show.LINK_TO);
                var chartLink = document.createElement('select');
                chartLink.className = 'form-control';
                chartLink.options.add(new Option(I18n.resource.dashboard.show.SELECT_LINK,''));
                for(var i in AppConfig.menu){
                    var option = new Option(AppConfig.menu[i],i);
                    if(this.entity.modal.link == i){
                        option.selected = 'selected';
                    }
                    chartLink.options.add(option);
                }
                chartLink.onchange = function(){
                    _this.entity.modal.link = chartLink.value;
                    _this.screen.isScreenChange = true;
                };
                $divLink.append($labelLink).append($(chartLink));
                divMask.appendChild($divLink[0]);

                //wiki ID
                var $divWiki = $('<div class="divResize chartId chartWiki">');
                var $labelWiki = $('<label for="title">').text(I18n.resource.dashboard.show.WIKI_ID);
                var inputChartWiki = document.createElement('input');
                inputChartWiki.id = 'wikiId';
                inputChartWiki.className = 'form-control';
                inputChartWiki.value = this.entity.modal.wikiId?this.entity.modal.wikiId:'';
                //inputChartPop.setAttribute('placeholder',I18n.resource.dashboard.show.DESC_TIP);
                if(this.entity.modal.wikiId != ''  && this.entity.modal.wikiId != undefined){
                    inputChartWiki.style.display = 'none';
                }

                $divWiki.append($labelWiki).append($(inputChartWiki));
                divMask.appendChild($divWiki[0]);


                var chartWikiShow = document.createElement('p');
                chartWikiShow.innerHTML = inputChartWiki.value;
                chartWikiShow.className = 'chartTitleShow';
                $divWiki[0].appendChild(chartWikiShow);
                if(this.entity.modal.wikiId == '' || this.entity.modal.wikiId == undefined){
                    chartWikiShow.style.display = 'none';
                }
                chartWikiShow.onclick = function(){
                    chartWikiShow.style.display = 'none';
                    inputChartWiki.style.display = 'inline-block';
                    inputChartWiki.focus();
                };
                inputChartWiki.onchange = function(){
                    if (inputChartWiki.value != ''){
                        inputChartWiki.style.display = 'none';
                        chartWikiShow.style.display = 'inline';
                    }
                    chartWikiShow.innerHTML = inputChartWiki.value;
                    _this.entity.modal.wikiId = inputChartWiki.value;
                    _this.screen.isScreenChange = true;
                };

                var $btnCreateWiki = $('<button  type="button" class="btn btn-primary" style="padding: 3px;line-height: 1.2;">Wiki</button>');
                $btnCreateWiki.click(function (){
                    var modalWiki = _this.getInstanceOfModalWiki();
                    if(_this.entity.modal.wikiId != ''){
                        if(_this.wikis[_this.entity.modal.wikiId]){
                            modalWiki.showWikiEdit(_this.wikis[_this.entity.modal.wikiId]);
                        }else{
                            WebAPI.get('/getWikiById/'+ _this.entity.modal.wikiId)
                            .done(function(result){
                                var result = JSON.parse(result);
                                if(result.id){
                                    _this.wikis[result.id] = result
                                    modalWiki.showWikiEdit(result);
                                }else{
                                    modalWiki.showWikiSearch();
                                }
                            })
                            .fail(function(result){
                                alert(result)
                            });
                        }
                    }else{
                        var modalWiki = _this.getInstanceOfModalWiki();
                        modalWiki.showWikiSearch();
                    }
                });
                $divWiki[0].appendChild($btnCreateWiki[0]);

                //Pop dataSourceId
                var $divPop = $('<div class="divResize chartId chartPop">');
                var $labelPop = $('<label for="title">').text(I18n.resource.dashboard.show.POP_ID);
                var inputChartPop = document.createElement('input');
                inputChartPop.id = 'popId';
                inputChartPop.className = 'form-control';
                inputChartPop.value = this.entity.modal.popId?this.entity.modal.popId:'';
                //inputChartPop.setAttribute('placeholder',I18n.resource.dashboard.show.DESC_TIP);
                if(this.entity.modal.popId != ''  && this.entity.modal.popId != undefined){
                    inputChartPop.style.display = 'none';
                }
                $divPop.append($labelPop).append($(inputChartPop));
                divMask.appendChild($divPop[0]);


                var chartPopShow = document.createElement('p');
                chartPopShow.innerHTML = inputChartPop.value;
                chartPopShow.className = 'chartTitleShow';
                $divPop[0].appendChild(chartPopShow);
                if(this.entity.modal.popId == '' || this.entity.modal.popId == undefined){
                    chartPopShow.style.display = 'none';
                }
                chartPopShow.onclick = function(){
                    chartPopShow.style.display = 'none';
                    inputChartPop.style.display = 'inline-block';
                    inputChartPop.focus();
                };
                inputChartPop.onchange = function(){
                    if (inputChartPop.value != ''){
                        inputChartPop.style.display = 'none';
                        chartPopShow.style.display = 'inline';
                    }
                    chartPopShow.innerHTML = inputChartPop.value;
                    _this.entity.modal.popId = inputChartPop.value;
                    _this.screen.isScreenChange = true;
                };
            }


            ////description
            //var $divDesc = $('<div class="divResize chartDesc">');
            //var $labelDesc = $('<label for="title">').text(I18n.resource.dashboard.show.DESC);
            //var inputChartDesc = document.createElement('textarea');
            //inputChartDesc.id = 'description';
            //inputChartDesc.className = 'form-control';
            //inputChartDesc.value = this.entity.modal.desc?this.entity.modal.desc:'';
            //inputChartDesc.setAttribute('placeholder',I18n.resource.dashboard.show.DESC_TIP);
            //if(this.entity.modal.desc != ''  && this.entity.modal.desc != undefined){
            //    inputChartDesc.style.display = 'none';
            //}
            //$divDesc.append($labelDesc).append($(inputChartDesc));
            //divMask.appendChild($divDesc[0]);

            var chartTitleShow = document.createElement('p');
            chartTitleShow.innerHTML = inputChartTitle.value;
            chartTitleShow.className = 'chartTitleShow';
            $divTitle[0].appendChild(chartTitleShow);
            if(this.entity.modal.title == '' || this.entity.modal.title == undefined){
                chartTitleShow.style.display = 'none';
            }
            chartTitleShow.onclick = function(){
                chartTitleShow.style.display = 'none';
                inputChartTitle.style.display = 'inline-block';
                inputChartTitle.focus();
            };
            inputChartTitle.onchange = function(){
                if (inputChartTitle.value != ''){
                    inputChartTitle.style.display = 'none';
                    chartTitleShow.style.display = 'inline';
                }
                chartTitleShow.innerHTML = inputChartTitle.value;
                _this.entity.modal.title = inputChartTitle.value;
                _this.screen.isScreenChange = true;
            };

            //var chartDescShow = document.createElement('p');
            //chartDescShow.innerHTML = inputChartDesc.value;
            //chartDescShow.className = 'chartDescShow';
            //$divDesc[0].appendChild(chartDescShow);
            //if(this.entity.modal.desc == ''){
            //    chartDescShow.style.display = 'none';
            //}
            //chartDescShow.onclick = function(){
            //    chartDescShow.style.display = 'none';
            //    inputChartDesc.style.display = 'block';
            //    inputChartDesc.focus();
            //};
            //inputChartDesc.onblur = function(){
            //    if (inputChartDesc.value != ''){
            //        inputChartDesc.style.display = 'none';
            //        chartDescShow.style.display = 'block';
            //    }
            //    chartDescShow.innerHTML = inputChartDesc.value;
            //    _this.entity.modal.desc = inputChartDesc.value;
            //};

            //如果entity的isRender为false,添加到chartsCt中
            this.container.parentNode.appendChild(divMask);
            if (this.entity.isNotRender && this.screen.entity) {//兼容ModalMix
                $(document.getElementById('divContainer_' + this.screen.entity.id)).find('.chartsCt')[0].appendChild(this.container.parentNode.parentNode);
            }

            this.divResizeByToolInit();
            function btnConfig_clickEvent(e) {
                $('.springSel').removeClass('springSel');
                $(e.target).closest('.springContainer').addClass('springSel');
                _this.modalInit();
                //$('#energyModal').modal('show');
            }

            function btnEdit_clickEvent(e) {
                $('.springSel').removeClass('springSel');
                $(e.target).closest('.springContainer').addClass('springSel');
                _this.showEditModal();
                //$('#energyModal').modal('show');
            }

            //drag event of replacing entity
            var divContainer = $(this.container).closest('.springContainer')[0];
            divMask.ondragstart = function (e) {
                //e.preventDefault();
                e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
            };
            divMask.ondragover = function (e) {
                e.preventDefault();
            };
            divMask.ondragleave = function (e) {
                e.preventDefault();
            };
            divContainer.ondrop = function (e) {
                e.stopPropagation();
                var sourceId = e.dataTransfer.getData("id");
                var $sourceParent, $targetParent;
                if (sourceId) {
                    var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                    $sourceParent = $('#divContainer_' + sourceId).parent();
                    $targetParent = $('#divContainer_' + targetId).parent();
                    //外部chart拖入组合图
                    if(!$sourceParent[0].classList.contains('chartsCt') && $targetParent[0].classList.contains('chartsCt')){
                        _this.screen.insertChartIntoMix(sourceId, $(e.target).closest('.chartsCt')[0])
                    }else{//平级之间交换
                        if(_this.screen.screen){//组合图内部交换
                            _this.screen.screen.replaceEntity(sourceId, targetId, _this.screen.entity.id);
                        }else{
                            _this.screen.replaceEntity(sourceId, targetId);
                        }
                    }
                }
                _this.screen.isScreenChange = true;
            }

            this.executeConfigMode();
        },

        //interface
        setModalOption: function (option) { },

        modalInit: function() {
            var _this = this;
            var dataItem = [], option;
            var dataTypeUnit;
            var type = false;
            if (_this.entity.modal.points != undefined){
                if (_this.entity.modal.option && _this.entity.modal.option.paraType){
                    for (var i = 0; i < _this.entity.modal.option.paraType.length; i++) {
                        dataTypeUnit = {dsId: [], dsType: '', dsName: []};
                        dataTypeUnit.type = _this.entity.modal.option.paraType[i].type;
                        for (var j = 0; j < _this.entity.modal.option.paraType[i].arrId.length;j++) {
                            dataTypeUnit.dsId.push(_this.entity.modal.option.paraType[i].arrId[j]);
                            dataTypeUnit.dsName.push(AppConfig.datasource.getDSItemById(_this.entity.modal.option.paraType[i].arrId[j]).alias);
                        }
                        dataItem.push(dataTypeUnit);
                    }
                }else {
                    dataTypeUnit = {dsId: [], dsType: '', dsName: []};
                    for (var i = 0; i < _this.entity.modal.points.length; i++) {
                        dataTypeUnit.dsId.push(_this.entity.modal.points[i]);
                        dataTypeUnit.dsName.push(AppConfig.datasource.getDSItemById(_this.entity.modal.points[i]).alias);
                    }
                    dataItem.push(dataTypeUnit);
                }
            }
            // deal with 'custom' mode
            if(_this.optionTemplate.mode === 'custom') {
                _this.showConfigModal();
                return;
            }
            //deal with 图元 报表章节
            if(_this.optionTemplate.type === 'ModalReportChapter') {
                _this.showConfigModal();
                return;
            }
            var tempOptionPara;
            _this.entity.modal.option ? tempOptionPara = _this.entity.modal.option:tempOptionPara = {};
            tempOptionPara.dataItem = dataItem;
            //if(_this.entity.modal.option && _this.entity.modal.option.dsChartCog){
            //    tempDsChartCog = _this.entity.modal.option.dsChartCog;
            //}else{
            //    tempDsChartCog = null;
            //}
            option = {
                modeUsable: _this.optionTemplate.mode,
                allDataNeed: _this.optionTemplate.modelParams?_this.optionTemplate.modelParams.paraAnlysMode:true,
                rowDataType: _this.optionTemplate.modelParams?_this.optionTemplate.modelParams.paraName:[I18n.resource.analysis.paneConfig.DATA_TYPE_DEFAULT],
                rowDataTypeShowName: _this.optionTemplate.modelParams?_this.optionTemplate.modelParams.paraShowName:undefined,
                dataTypeMaxNum:[_this.optionTemplate.maxNum],
                templateType: _this.optionTemplate.type,
                dsChartCog: _this.entity.modal.dsChartCog?_this.entity.modal.dsChartCog:null,
                optionPara: tempOptionPara
            };

            if(dataItem.length == 0){
                type = true;
            }
            if(_this.screen.screen){
                _this.screen.screen.modalConfigPane.showModalInit(type, option, _this);
            }else{
                _this.screen.modalConfigPane.showModalInit(type, option, _this);
            }
            _this.screen.isScreenChange = true;
        },

        divResizeByToolInit: function(){ 
            var _this = this;
            var $divContainer = $('#divContainer_' +  _this.entity.id);
            var $divResize = $('.divResize');
            var $inputResize = $('.inputResize');
            $divContainer.find('#heightResize').mousedown(function(e){
                $('.springConfigMask').attr('draggable','false');
                $('.springContent').attr('draggable','false');
                $(e.target).mousemove(function(e){
                    $(e.target).closest('.springContainer').css('height',$(e.target).val() * _this.UNIT_HEIGHT + '%');
                    _this.entity.spanR = Number($(e.target).val());
                    $(e.target).next().text($(e.target).val() + ' /6');
                    if(_this.screen.screen){//兼容ModalMix
                        _this.screen.screen.setEntity(_this.entity);
                    }else{
                        _this.screen.setEntity(_this.entity);
                    }
                });
            }).mouseup(function(e){
                $('.springConfigMask').attr('draggable','true');
                $('.springContent').attr('draggable','true');
                $(e.target).off('mousemove');
               if(_this.chart) _this.chart.resize();
                _this.screen.isScreenChange = true;
            });
            $divContainer.find('#widthResize').mousedown(function(e){
                $('.springConfigMask').attr('draggable','false');
                $('.springContent').attr('draggable','false');
                $(e.target).mousemove(function(e){
                    $(e.target).closest('.springContainer').css('width',$(e.target).val() * _this.UNIT_WIDTH + '%');
                    _this.entity.spanC = Number($(e.target).val());
                    $(e.target).next().text($(e.target).val() + ' /12');
                    if(_this.screen.screen) {//兼容ModalMix
                        _this.screen.screen.setEntity(_this.entity);
                    }else{
                        _this.screen.setEntity(_this.entity);
                    }
                });
            }).mouseup(function(e){
                $('.springConfigMask').attr('draggable','true');
                $('.springContent').attr('draggable','true');
                $(e.target).off('mousemove');
                if(_this.chart) _this.chart.resize();
                _this.screen.isScreenChange = true;
            });
            $divContainer.find('.rangeVal').click(function(e){
                e.stopPropagation();
                var valueCurrent = Number($(e.target).prev().val());
                var valuePre = $(e.target).prev().val();
                var valueMax = Number($(e.target).prevAll('.inputResize').attr('max'));
                var valueMin = Number($(e.target).prevAll('.inputResize').attr('min'));
                $(e.target).nextAll('.rangeChange').css('display','inline-block').focus().off('blur').blur(function(e){
                    valueCurrent = Number($(e.target).val());
                    if(valueCurrent <= valueMax && valueCurrent >= valueMin) {
                        $(e.target).prevAll('.inputResize').val(valueCurrent.toString());
                        if ($(e.target).prevAll('.inputResize').attr('id') == 'widthResize') {
                            $(e.target).closest('.springContainer').css('width',$(e.target).val() * _this.UNIT_WIDTH + '%');
                            _this.entity.spanC = Number($(e.target).val());
                            _this.screen.setEntity(_this.entity);
                            $(e.target).prev().text($(e.target).val() + ' /12');
                            if(_this.chart) _this.chart.resize();
                        } else{
                            $(e.target).closest('.springContainer').css('height',$(e.target).val() * _this.UNIT_HEIGHT + '%');
                            _this.entity.spanR = Number($(e.target).val());
                            _this.screen.setEntity(_this.entity);
                            $(e.target).prev().text($(e.target).val() + ' /6');
                            if(_this.chart) _this.chart.resize();
                        }
                        $(e.target).css('display', 'none');
                    }else if(valueCurrent > valueMax){
                        new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR1 + "</strong>").show().close();
                        $(e.target).val(valuePre).css('display', 'none');
                    }else if(valueCurrent < valueMin){
                        new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR2 + "</strong>").show().close();
                        $(e.target).val(valuePre).css('display', 'none');
                    }else{
                        if($(e.target).val() != ""){
                                new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR3 + "</strong>").show().close();
                            }
                        $(e.target).val(valuePre).css('display', 'none');
                    }
                    _this.screen.isScreenChange = true;
                })
            });
        },
        divResizeByMouseInit: function() {
            var _this = this;
            var $widthResize;
            var $heightResize;
            var divContainer = $('#divContainer_' +  _this.entity.id).get(0);
            var resizeOnRight = document.createElement('div');
            resizeOnRight.className = 'resizeOnRight';
            divContainer.appendChild(resizeOnRight);
            var resizeOnBottom = document.createElement('div');
            resizeOnBottom.className = 'resizeOnBottom';
            divContainer.appendChild(resizeOnBottom);
            var resizeOnCorner = document.createElement('div');
            resizeOnCorner.className = 'resizeOnCorner';
            divContainer.appendChild(resizeOnCorner);
            var mouseStart = {};
            var divStart = {};
            var rightStart = {};
            var bottomStart = {};
            var w, h,tempSpanR,tempSpanC;
            resizeOnRight.onmousedown =  function(e){
                e.stopPropagation();
                if (e.button != 0 )return;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',false)
                }
                $(e.target).prev().children(':last-child').attr('draggable',false);
                $widthResize = $(e.target).parent().find('#widthResize');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                rightStart.x = resizeOnRight.offsetLeft;
                doResizeOnRight(e);
                if(resizeOnRight.setCapture){
                    resizeOnRight.onmousemove = doResizeOnRight;
                    resizeOnRight.onmouseup = stopResizeOnRight;
                    resizeOnRight.setCapture();
                }else{
                    document.addEventListener("mousemove",doResizeOnRight,false);
                    document.addEventListener("mouseup",stopResizeOnRight,false);
                }
            };
            function doResizeOnRight(e){
                var oEvent = e || event;
                var l = oEvent.clientX - mouseStart.x + rightStart.x;
                w = l + resizeOnCorner.offsetWidth;
                if(w < resizeOnCorner.offsetWidth){
                    w = resizeOnCorner.offsetWidth;
                }
                else if( w > document.documentElement.clientWidth - divContainer.offsetLeft){
                    w = document.documentElement.clientWidth - divContainer.offsetLeft - 2;
                }
                //w = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH)) * _this.UNIT_WIDTH;
                divContainer.style.width = w + "px";
            }
            function stopResizeOnRight(e){
                if (resizeOnRight.releaseCapture) {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /12');
                    $widthResize.next().next().val(tempSpanC.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    _this.entity.spanC = tempSpanC;
                    resizeOnRight.onmousemove = null;
                    resizeOnRight.onmouseup = null;
                    resizeOnRight.releaseCapture();
                    if (_this.chart) _this.chart.resize();
                } else {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /12');
                    $widthResize.next().next().val(tempSpanC.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    _this.entity.spanC = tempSpanC;
                    document.removeEventListener("mousemove", doResizeOnRight, false);
                    document.removeEventListener("mouseup", stopResizeOnRight, false);
                    if (_this.chart) _this.chart.resize();
                }
                _this.screen.isScreenChange = true;
                $(e.target).prev().children(':last-child').attr('draggable',true);
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',true)
                }
            }
            resizeOnBottom.onmousedown = function(e){
                e.stopPropagation();
                if (e.button != 0 )return;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',false)
                }
                $(e.target).prev().children(':last-child').attr('draggable',false);
                $heightResize = $(e.target).parent().find('#heightResize');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                bottomStart.y = resizeOnBottom.offsetTop;
                doResizeOnBottom(e);
                if(resizeOnBottom.setCapture){
                    resizeOnBottom.onmousemove = doResizeOnBottom;
                    resizeOnBottom.onmouseup = stopResizeOnBottom;
                    resizeOnBottom.setCapture();
                }else{
                    document.addEventListener("mousemove",doResizeOnBottom,false);
                    document.addEventListener("mouseup",stopResizeOnBottom,false);
                }
            };
            function doResizeOnBottom(e){
                var oEvent = e || event;
                var t = oEvent.clientY - mouseStart.y + bottomStart.y;
                h = t + resizeOnCorner.offsetHeight;
                if(h < resizeOnCorner.offsetHeight){
                    h = resizeOnCorner.offsetHeight;
                }else if(h > document.documentElement.clientHeight - divContainer.offsetTop){
                    h = document.documentElement.clientHeight - divContainer.offsetTop - 2;
                }
                //h = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT)) * _this.UNIT_HEIGHT;
                divContainer.style.height = h + "px";
            }
            function stopResizeOnBottom(e){
                if (resizeOnBottom.releaseCapture) {
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $heightResize.val(tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /6');
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanR = tempSpanR;
                    resizeOnBottom.onmousemove = null;
                    resizeOnBottom.onmouseup = null;
                    resizeOnBottom.releaseCapture();
                    if (_this.chart) _this.chart.resize();
                } else {
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $heightResize.val(tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /6');
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanR = tempSpanR;
                    document.removeEventListener("mousemove", doResizeOnBottom, false);
                    document.removeEventListener("mouseup", stopResizeOnBottom, false);
                    if (_this.chart) _this.chart.resize();
                }
                _this.screen.isScreenChange = true;
                $(e.target).prev().children(':last-child').attr('draggable',true);
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',true)
                }
            }
            resizeOnCorner.onmousedown = function(e){
                e.stopPropagation();
                if (e.button != 0 )return;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',false)
                }
                $(e.target).prev().children(':last-child').attr('draggable',false);
                $widthResize = $(e.target).parent().find('#widthResize');
                $heightResize = $(e.target).parent().find('#heightResize');
                var oEvent = e||event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                divStart.x = resizeOnCorner.offsetLeft;
                divStart.y = resizeOnCorner.offsetTop;
                doResizeOnCorner(e);
                if(resizeOnCorner.setCapture){
                    resizeOnCorner.onmousemove = doResizeOnCorner;
                    resizeOnCorner.onmouseup = stopResizeOnCorner;
                    resizeOnCorner.setCapture();
                }else{
                    document.addEventListener("mousemove",doResizeOnCorner,false);
                    document.addEventListener("mouseup",stopResizeOnCorner,false);
                }
                //zhezhao.style.display='block';
            };
            function doResizeOnCorner(e){
                var oEvent = e||event;
                var l = oEvent.clientX - mouseStart.x + divStart.x;
                var t = oEvent.clientY - mouseStart.y + divStart.y;
                w = l + resizeOnCorner.offsetWidth;
                h = t + resizeOnCorner.offsetHeight;
                if(w < resizeOnCorner.offsetWidth){
                    w = resizeOnCorner.offsetWidth;
                }
                else if(w > document.documentElement.clientWidth - divContainer.offsetLeft){
                    w=document.documentElement.clientWidth - divContainer.offsetLeft - 2;
                }
                if(h < resizeOnCorner.offsetHeight){
                    h = resizeOnCorner.offsetHeight;
                }else if(h > document.documentElement.clientHeight - divContainer.offsetTop){
                    h = document.documentElement.clientHeight - divContainer.offsetTop - 2;
                }
                //w = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH)) * _this.UNIT_WIDTH;
                divContainer.style.width = w + "px";
                //h = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT)) * _this.UNIT_HEIGHT;
                divContainer.style.height = h + "px";
            }
             function stopResizeOnCorner(e){
                 if (resizeOnCorner.releaseCapture) {
                     tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                     tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                     rangeJudge();
                     $widthResize.val(tempSpanC.toString()).get(0).setAttribute('value', tempSpanC.toString());
                     $widthResize.next().text(tempSpanC.toString() + ' /12');
                     $widthResize.next().next().val(tempSpanC.toString());
                     $heightResize.val(tempSpanR.toString()).get(0).setAttribute('value', tempSpanR.toString());
                     $heightResize.next().text(tempSpanR.toString() + ' /6');
                     $heightResize.next().next().val(tempSpanR.toString());
                     divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                     divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                     _this.entity.spanC = tempSpanC;
                     _this.entity.spanR = tempSpanR;
                     resizeOnCorner.onmousemove = null;
                     resizeOnCorner.onmouseup = null;
                     resizeOnCorner.releaseCapture();
                     if (_this.chart) _this.chart.resize();
                 } else {
                     tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                     tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                     rangeJudge();
                     $widthResize.val(tempSpanC.toString());
                     $widthResize.next().text(tempSpanC.toString() + ' /12');
                     $widthResize.next().next().val(tempSpanC.toString());
                     $heightResize.val(tempSpanR.toString());
                     $heightResize.next().text(tempSpanR.toString() + ' /6');
                     $heightResize.next().next().val(tempSpanR.toString());
                     divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                     divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                     _this.entity.spanC = tempSpanC;
                     _this.entity.spanR = tempSpanR;
                     document.removeEventListener("mousemove", doResizeOnCorner, false);
                     document.removeEventListener("mouseup", stopResizeOnCorner, false);
                     if (_this.chart) _this.chart.resize();
                 }
                 _this.screen.isScreenChange = true;
                 var $possibleParent = $(e.target).closest('.springConfigMask');
                 if ($possibleParent.length > 0){
                     $possibleParent.attr('draggable',true)
                 }
                 $(e.target).prev().children(':last-child').attr('draggable',true);
             //zhezhao.style.display='none';
             }
            function rangeJudge(){
                if (tempSpanC > _this.optionTemplate.maxWidth){
                    tempSpanC = _this.optionTemplate.maxWidth
                }else if(tempSpanC < _this.optionTemplate.minWidth){
                    tempSpanC = _this.optionTemplate.minWidth
                }
                if (tempSpanR > _this.optionTemplate.maxHeight){
                    tempSpanR = _this.optionTemplate.maxHeight
                }else if(tempSpanR < _this.optionTemplate.minHeight){
                    tempSpanR = _this.optionTemplate.minHeight
                }
            }
        },

        // 附加 "历史数据" 按钮事件
        attachLkHistoryEvents: function (domItem) {
            var _this = this;
            
            domItem.onclick = function (e) {
                _this.modalDBHistory.setModal(_this.entity.modal, _this.chart);
                _this.modalDBHistory.show();
                e.preventDefault();
                e.stopPropagation();
            };
        },

        modalDBHistory: new ModalDBHistory(),

        initPointAlias :function(arrPoints){
            var arrPointsAlias = [];
            var lastRepeatIndex = -1 ;
            var tempAlias;
            var repeatNum = 0;
            var tempIndex;
            for (var i = 0; i< arrPoints.length; ++i){
                arrPointsAlias.push(AppConfig.datasource.getDSItemById(arrPoints[i].dsItemId).alias);
            }
            for (var i =0 ;i < arrPoints.length; ++i){
                lastRepeatIndex = arrPointsAlias.lastIndexOf(arrPointsAlias[i]);
                if (lastRepeatIndex > i){
                    repeatNum = 1;
                    tempAlias = arrPointsAlias[i];
                    arrPointsAlias[i] = tempAlias + '_No1';
                    tempIndex = i;
                    for (var j = tempIndex + 1; j < lastRepeatIndex + 1 ;j++){
                        repeatNum +=1;
                        tempIndex = arrPointsAlias.indexOf(tempAlias);
                        if(tempIndex == -1)break;
                        arrPointsAlias[tempIndex] = tempAlias + '_No' + repeatNum;
                    }
                }
            }
            return arrPointsAlias;
        },

        // close
        close: function () {
            if (this.chart) {
                this.chart.clear();
                this.chart.dispose();
            }
            this.container = null;
            this.entity = null;
            this.executeConfigMode = null;
            this.executeRender = null;
            this.executeUpdate = null;
            this.isFirstRender = null;
            this.modalWikiCtr = null;
            this.screen = null;
            this.isConfigMode = null;
            this.reportScreen = null;
            typeof this._close === 'function' && this._close();
        },

        //pop
        renderPop: function(pop){
            if(!pop) return;
            var $target = $('#divContainer_' + this.entity.id).find('.panel');
            var $panePop = $target.find('.panePop');
            var tpl = '<div class="divMove"><span>{popMsg}</span></div>\
                <span class="glyphicon glyphicon-remove-circle btnClosePop" title="Close"></span>';
            if(!$panePop[0]){
                $panePop = $('<div class="panel-body panePop"></div>');
                $target.append($panePop);
            }
            $panePop.html(tpl.formatEL({
                popMsg: pop.data
            }));//pop.data
            var spanWidth = $panePop.find('span').width();
            var $divMove = $panePop.find('.divMove');
            if(spanWidth > $divMove.width()){
                var $marquee = $('<marquee direction="left" onmouseover="this.stop()" onmouseout="this.start()" scrollAmount="3" style="height: 40px; width: calc(100% - 28px);"></marquee>');
                $marquee.html($panePop.find('span').html());
                $marquee.appendTo($panePop);
                $divMove.remove();
            }

            //events
            $panePop.find('.btnClosePop').off().click(function(){
                $panePop.hide();
            });
        },

        getInstanceOfModalWiki: function(){
            if(!this.modalWikiCtr){
                this.modalWikiCtr = new ModalWiki(this);
            }
            return this.modalWikiCtr;
        }
    };
    return ModalBase;
})();

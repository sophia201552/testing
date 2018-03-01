;(function (exports) {
    class MonthlyTrend {
        constructor(container, conditionModel) {
            this.container = container;
            this.conditionModel = conditionModel;
            this.components = [];
        }
        init() {
            this.initLayout();
            this.unbindStateOb();
            this.bindStateOb();
            this.update();
            this.attachEvents();
        }
        initLayout() {
            let $container = $(this.container);
            $container.html(`<div class="monthlyContainer"><div class="monthlyBox"><div class="monthlyTop"></div><div class="monthlyMain"></div></div></div><div class="errorModal"></div>`)
        }
        getMonthData() {
            let _this = this;
            let $container = $(this.container);
            let $monthlyMain = $container.find('.monthlyMain');
            //点名
            let projectId = AppConfig.projectId;
            let points = this.conditionModel.activePoints();
            let dsIdList = [];
            for (let i = 0, length = points.length; i < length; i++) {
                for (let key in points[i]) {
                    dsIdList.push(points[i][key]);
                }
            }
            var postData = {
                projectId: projectId,
                pointList: dsIdList,
                timeStart: this.conditionModel.time().startTime.format('yyyy-MM-dd 00:00:00'),
                timeEnd: this.conditionModel.time().endTime,
                timeFormat: 'm5',
                prop: {}
            }
            Spinner.spin($('.monthlyMain')[0]);
            WebAPI.post("/get_history_data_padded", postData).done(dataSrc => {
                if (jQuery.isEmptyObject(dataSrc)) {
                    $('.errorModal').css({'display':'block'})
                    new Alert($('.errorModal'), 'danger', i18n_resource.echartDetail.NODATA).show();
                    $('.ant-notification-notice-close').off('click.errorModal').on('click.errorModal',function(){
                        $('.errorModal').css({'display':'none'})
                    })
                    echarts.init($monthlyMain[0]).clear();
                    return
                }
                 $('.errorModal').css({'display':'none'})
                _this.lengendName = [];
                _this.time = [];
                _this.data = [];
                for (let i = 0, length = dataSrc.length; i < length; i++) {
                    _this.lengendName.push(dataSrc[i].name);
                    let history = dataSrc[i].history;
                    let singleData = [];
                    for (let j = 0, jlength = history.length; j < jlength; j++) {
                        if (i === 0) {
                            _this.time.push(history[j].time.substring(5, 16));
                        }
                        singleData.push(history[j].value);
                    }
                    _this.data.push(singleData);
                }
                this.renderEcharts($monthlyMain[0]);
            }).always(function (data) {
                Spinner.stop();
            });
        }
        renderEcharts($container) {
            let seriesArr = [];
            for (let i = 0, length = this.data.length; i < length; i++) {
                seriesArr.push({
                    name: this.lengendName[i],
                    type: 'line',
                    data: this.data[i]
                })
            }
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#b3b3b3',
                            width: '1',
                        },
                    },
                    backgroundColor: '#ffffff',
                    padding: 0,
                    textStyle: {
                        color: '#333',
                        fontSize: '10',
                    },
                    formatter: function (value) {
                        var dom = ``;
                        for (var i in value) {
                            dom += `<div style='padding-left:10px;padding-right:10px;padding-top:8px;'><span style='border-radius:9px;display:inline-block;width:8px;height:8px;background:` + value[i].color + `;'></span><span style="display:inline-block;padding-left:12px;">` + value[i].seriesName + `:<span style="display:inline-block;padding-left:1px;">` + value[i].value + `</span></div>`
                        }
                        return ` <div style="padding-bottom:8px;"> <div style='padding:5px;background:#f3f6f8;color:#333333;text-align:center;'>${value[0].name}</div>${dom}</div>`
                    },
                    extraCssText: 'box-shadow: 0 6px 8px 0 rgba(191,193,201,0.50);'
                },
                legend: {
                    icon: 'circle',
                    top: '15',
                    itemHeight: '10',
                    textStyle: {
                        color: 'rgb(76,86,102)',
                        fontWeight: 'blod'
                    },
                    data: this.lengendName,
                },
                grid: {
                    left: '6%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.time,
                    lineStyle: {
                        width: 0
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                            align: 'right'
                        },
                    }
                },
                color: ['#FFD428', '#45ABFF', '#7094EC', '#54CADD', '#71D360', '#426EC1'],
                yAxis: [{
                    type: 'value',
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                        },
                    },
                    splitLine: {
                        lineStyle: { color: 'rgb(227,230,232)', }
                    },
                    minInterval: 1
                },],
                series: seriesArr
            };
            echarts.init($container).setOption(option, {notMerge:true});
        }
        attachEvents() {
            var _this = this;
            let resizeTimer = null;
            $(window).off('resize.monthlyContainer').on('resize.monthlyContainer', function () {
                if ($('.monthlyContainer').length) {
                    if (resizeTimer) {
                        clearTimeout(resizeTimer);
                        resizeTimer = null;
                    }
                    resizeTimer = setTimeout(() => {
                        _this.init();
                        resizeTimer = null;
                    }, 300);
                }
            })
        }
        detachEvent() {
            $(window).off('resize.monthlyContainer');
        }
        show() {
        }
        bindStateOb() {
            this.conditionModel.addEventListener('update', this.update, this);
        }
        unbindStateOb() {
            this.conditionModel.removeEventListener('update', this.update, this);
        }
        update(e, propName) {
            let forbiddenArr = ['update.activeEntities'];
            let forbiddenArr1 = ['update.activeAllEntities'];
            if (forbiddenArr.indexOf(propName) > -1 || forbiddenArr1.indexOf(propName) > -1) {
                return;
            }
            this.getMonthData();
        }
        close() {
            this.detachEvent();
            this.unbindStateOb();
        }
    }
    exports.MonthlyTrend = MonthlyTrend;
}(namespace('thermalComfort.Pages')));
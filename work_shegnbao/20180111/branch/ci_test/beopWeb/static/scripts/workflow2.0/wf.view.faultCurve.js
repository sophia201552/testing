(function (beop) {
    var configMap = {
            htmlURL: '',
            settable_map: {
                transactions_model: true
            },
            transactions_model: null
        },
        stateMap = {chartInstance: null},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, renderChart, handleFault;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container
        };
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container, fault) {
        if (!$container || !$container.length) {
            return;
        }
        stateMap.$container = $container;

        if (handleFault(fault)) {
            stateMap.$container.show();
        } else {
            stateMap.$container.hide();
            return $.Deferred().reject('points is invalid.');
        }

        setJqueryMap();

        stateMap.chartInstance = echarts.init(jqueryMap.$container.get(0));
        stateMap.chartInstance.showLoading({
            text: 'loading',
            effect: 'spin',
            textStyle: {
                fontSize: 20
            }
        });

        var faultPromise = configMap.transactions_model.requestCurve(fault);
        return faultPromise.done(function (result) {
            if (result) {
                renderChart(result, fault);
            }
        });
    };

    //---------DOM操作------


    //---------方法---------

    handleFault = function (fault) {
        /**
         * points example:
         * "Ch02_OnOff,冷机|Ch02_Evap_FlowOnOff,冷机冷冻侧流量"
         */
        if (!fault.points || !fault.points.indexOf(',') < 0) {
            return false;
        }
        var pointList = fault.points.split('|');
        stateMap.dsItemIds = [];
        stateMap.legend = [];
        for (var i = 0; i < pointList.length; i++) {
            var mapList = pointList[i].split(',');
            stateMap.legend.push(mapList[1]);
            stateMap.dsItemIds.push('@' + fault.projectId + '|' + mapList[0]);
        }
        fault.dsItemIds = stateMap.dsItemIds;
        return true;
    };

    renderChart = function (record, fault) {
        var startTime = new Date(fault.timeStart).getTime(),
            endTime = new Date(fault.timeEnd).getTime(),
            sixHours = 6 * 60 * 60 * 1000;
        var zoomStart, zoomEnd;

        //故障在初始化曲线图内;
        //1: 如果故障时间+6小时 < 当前时间,则显示故障时间前后6个小时,初始化显示故障时间前后两个小时内的曲线图;
        if ((endTime - startTime) === 2 * sixHours) {
            zoomStart = 33.3;
            zoomEnd = 66.7;
        }

        //2: 如果故障时间+6小时 > 当前时间,则显示故障时间前6小时 至当前时间,初始化显示报警右侧显示全部,左侧显示2小时内的曲线图;
        if ((endTime - startTime) < 2 * sixHours) {
            zoomStart = (100 * (4 * 60 * 60 * 1000 / (endTime - startTime))).toFixed(1);
            zoomEnd = 100;
        }
        var list_value = record.list,
            arrXAxis = [];

        if (stateMap.legend.length !== list_value.length) {
            jqueryMap.$container.hide();
        }
        if (record.timeShaft.length > 0) {
            //返回的数据格式为
            //"2016-01-12 00:50,2016-01-12 00:55,2016-01-12 01:00,2016-01-12 01:05,2016-01-12 01:10"
            var timeRecord = record.timeShaft;
            timeRecord.forEach(function (item) {
                arrXAxis.push(timeFormat(new Date(item), timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC)));
            });
        }

        var series = [];

        for (var i = 0; i < list_value.length; i++) {
            var seriesItem = [];
            if (i < 8) {
                var item = list_value[i];
                if (item) {
                    for (var j = 0; j < item.data.length; ++j) {
                        seriesItem.push(parseFloat(item.data[j]).toFixed(1));
                    }
                }

                series.push(
                    {
                        name: stateMap.legend[i],
                        type: 'line',
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    type: 'solid'
                                }
                            }
                        },
                        data: seriesItem
                    });
            }
        }

        var option =
        {
            formatTime: false,
            color: ['#03d5c6', '#288add', '#fdbf05', '#f34704', '#f903d9', '#6d23dd', '#c088f9', '#2d05fb'],
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        show: true,
                        title: {
                            zoom: "zoom",
                            back: "back"
                        }
                    }

                }
            },
            legend: {
                data: stateMap.legend,
                x: 'center',
                width: '90%'
            },
            dataZoom: [
                {
                    show: true,
                    type: 'slider',
                    textStyle: {color: '#000'},
                    start: 0,
                    end: 100,
                    bottom: -3
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {onZero: false},
                    data: arrXAxis
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true
                }
            ],
            series: series
        };
        stateMap.chartInstance.hideLoading();
        stateMap.chartInstance.setOption(option);
        window.onresize = stateMap.chartInstance.resize;
    };
    //---------事件---------


    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.faultCurve = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

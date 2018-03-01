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
        init, renderChart;

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
        stateMap.$container.show();
        setJqueryMap();
        stateMap.chartInstance = echarts.init(jqueryMap.$container.get(0));
        stateMap.chartInstance.showLoading({
            text: 'loading',
            effect: 'spin',
            textStyle: {
                fontSize: 20
            }
        });
        var faultPromise = null;
        if (fault) {
            faultPromise = configMap.transactions_model.faultCurveByParam(fault)
        } else {
            faultPromise = configMap.transactions_model.faultCurve()
        }
        return faultPromise.done(function (result) {
            if (result.success) {
                renderChart(result.data);
            }
        });
    };

    //---------DOM操作------


    //---------方法---------

    renderChart = function (record) {
        var list_description = record.description,
            list_value = record.value,
            arrXAxis = [];
        if (list_description.length !== list_value.length) {
            jqueryMap.$container.hide();
        }
        if (record.time.length > 0) {
            //返回的数据格式为
            //"2016-01-12 00:50,2016-01-12 00:55,2016-01-12 01:00,2016-01-12 01:05,2016-01-12 01:10"
            var result = record.time[0].split(',');
            result.forEach(function (item) {
                item = timeFormat(item, timeFormatChange('yyyy-mm-dd hh:ii:ss'));
                arrXAxis.push(item);
            });
        }

        var arrSeriesTemp = [];

        for (var i = 0; i < list_value.length; i++) {
            var arrDatas = [];
            if (i < 8) {
                var item = list_value[i];
                if (item) {
                    var strDatas = item.split(",");
                    for (var j = 0; j < strDatas.length; ++j) {
                        arrDatas.push(parseFloat(strDatas[j]).toFixed(1));
                    }
                }

                arrSeriesTemp.push(
                    {
                        name: list_description[i],
                        type: 'line',
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    type: 'solid'
                                }
                            }
                        },
                        data: arrDatas
                    });
            }
        }

        var option =
        {
            color: ['#03d5c6', '#288add', '#fdbf05', '#f34704', '#f903d9', '#6d23dd', '#c088f9', '#2d05fb'],
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params[0].name.length > 0) {
                        //TODO 这个 params 所有的 dataIndex 应该是相同的
                        var strResult = params[0].name + '<br/>';
                        for (var i = 0; i < params.length; ++i) {
                            strResult += params[i].seriesName + ' : ' + params[i].value;
                            if (i != params.length - 1) {
                                strResult += '<br/>';
                            }
                        }
                    }
                    return strResult;
                }
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
                data: list_description,
                x: 'center'
            },
            dataZoom: [
                {
                    show: true,
                    type: 'slider',
                    textStyle: {color: '#000'},
                    start: 41.6,
                    end: 58.4,
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
            series: arrSeriesTemp
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

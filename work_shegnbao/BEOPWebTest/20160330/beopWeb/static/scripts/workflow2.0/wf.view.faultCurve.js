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

    init = function ($container) {
        if (!$container || !$container.length) {
            return;
        }
        stateMap.$container = $container;
        stateMap.$container.show();
        setJqueryMap();
        stateMap.chartInstance = echarts.init(jqueryMap.$container.get(0), AppConfig.chartTheme);
        stateMap.chartInstance.showLoading({
            text: 'loading',
            effect: 'spin',
            textStyle: {
                fontSize: 20
            }
        });
        configMap.transactions_model.faultCurve().done(function (result) {
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
                arrXAxis.push(item.split(' ')[1])
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
                        itemStyle: {normal: {lineStyle: {type: 'solid'}}},
                        data: arrDatas
                    });
            }
        }
        var option =
        {
            title: {
                text: I18n.resource.workflow.notice.FAULT_CURVE,
                x: 'left'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params[0].name.length > 0) {
                        //TODO 这个 params 所有的 dataIndex 应该是相同的
                        var strResult = result[params[0].dataIndex].replace('||', ' ') + '<br/>';
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
            legend: {
                data: list_description,
                x: 'center'
            },
            toolbox: {
                show: true
            },
            dataZoom: {
                show: true,
                realtime: true,
                start: 0,
                end: 100
            },
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

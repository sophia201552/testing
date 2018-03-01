var AnlzEnergy = (function () {
    function AnlzEnergy(container, option, screen) {
        AnlzBase.call(this, container, option, screen);
    }

    AnlzEnergy.prototype = new AnlzBase();
    AnlzEnergy.prototype.optionTemplate = {
        imgName: 'anlsEnergy.png',
        imgIndex: 9,
        imgColor: '65,131,189',
        templateName: 'analysis.modalType.ENERGY',
        templateParams: {paraName:['X'],paraAnlysMode:'all'},
        chartConfig: ['easy','fixed','recent']
    };

    AnlzEnergy.prototype.init = function () {
        AppConfig.datasource.getDSItemData(this, this.screen.curModal.itemDS[0].arrId);
    };

    AnlzEnergy.prototype.optionDefault = {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {show: false, readOnly: true},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: false,
        dataZoom: {
            show: false
        },
        grid: {
            "x": 70, "x2": 10, "y2": 24
        },
        xAxis: [
            {
                type: 'category',
                splitLine: {show: false}
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show: false}
            }
        ]
    };

    AnlzEnergy.prototype.render = function (dataSrc) {
        var _this = this;

        if (undefined == dataSrc
            || dataSrc.length <= 0
            || undefined == dataSrc.timeShaft
            || dataSrc.timeShaft.length <= 0) {
            _this.screen.saveModalJudge.rejectWith(_this.screen, [_this.screen]);
            alert('No data')
            return;
        }

        var xAxis;
        var arrXAxis = [];
        var len = dataSrc.timeShaft.length;
        for (var i = 0; i < len; i++) {
            arrXAxis.push(dataSrc.timeShaft[i]);
        }
        xAxis = [
            {
                type: 'category',
                data: arrXAxis
            }
        ]

        var dataName = [];
        var arrSeries = [];
        var showColor;
        len = dataSrc.list.length;
        for (var i = 0; i < len; i++) {
            showColor = echarts.config.color[i];

            var itemName = AppConfig.datasource.getDSItemById(dataSrc.list[i].dsItemId).alias;
            dataName.push(itemName);

            var arrData = [];
            var len2 = dataSrc.list[i].data.length;
            var defVal;
            for (var j = 1; j < len2; j++) {
                defVal = dataSrc.list[i].data[j] - dataSrc.list[i].data[j - 1];
                arrData.push(parseFloat(defVal.toFixed(1)));
            }

            arrSeries.push(
                {
                    name: dataName[i],
                    type: 'bar',
                    data: arrData,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    itemStyle: {
                        normal: {
                            color: showColor,
                            barBorderRadius: [5, 5, 5, 5]
                        },
                        emphasis: {
                            color: showColor,
                            barBorderRadius: [5, 5, 5, 5]
                        }
                    }
                }
            );
        }

        dataOption = {
            title: {
                text: '',
                subtext: ''
            },
            legend: {
                data: dataName
            },
            dataZoom: {
                show: false
            },
            grid: {
                "x": 70, "x2": 10, "y2": 24
            },
            xAxis: xAxis,
            series: arrSeries
        };

        _this.chart = echarts.init(_this.paneChart, 'macarons').setOption($.extend(true, {}, _this.optionDefault, dataOption));
    }

    return AnlzEnergy;
})();
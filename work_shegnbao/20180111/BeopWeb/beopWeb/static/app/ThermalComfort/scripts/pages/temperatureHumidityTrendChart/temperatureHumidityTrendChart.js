;(function (exports) {
    class TemperatureHumidityTrendChart {
        constructor(container, conditionModel) {
            let _this = this;
            this.container = container;
            this.conditionModel = conditionModel;
            this.treeData = [];
            //待取数据,,后期会从参数传入;
            this.deferred = $.Deferred();
            Spinner.spin(ElScreenContainer);
            this.deferred = WebAPI.get('tag/tempConfig/' + AppConfig.projectId).done(function (result) {
                if (result.success) {
                    if (result.data && result.data.length) {
                        _this.treeData = result.data[0].entity;
                    }
                }
            }).fail(function () {
                alert('request error');
            }).always(function () {
                Spinner.stop();
            });
            this.selectedSensor = [];
        }

        init() {
            this.unbindStateOb();
            this.bindStateOb();
            this.update();
            this.show();
            this.attachEvents();
        }

        show() {
            let _this = this;
            let trend_map_html = `
                <div id="temperature_trend">
                    <div class="thermalComfort_sensor"></div>
                    <div class="thermalComfort_trend_map"></div>
                </div>
                `;
            $(_this.container).empty().html(trend_map_html);
            _this.initLayoutDom();
        }

        initLayoutDom() {
            let $sensorBox = $(this.container).find(".thermalComfort_sensor");
            let sensorHtml;
            sensorHtml = `<div class="sensor-container thermalComfort_scroll"></div>
                        <div class="tooltips-container">
                            <div class="tooltips tooltip-pic-hot">
                                <span class="tooltip-pic"></span>
                                <span class="tooltip-text">${ i18n_resource.nav.OVERHEATED }</span>
                            </div>
                            <div class="tooltips tooltip-pic-cool">
                                <span class="tooltip-pic"></span>
                                <span class="tooltip-text">${ i18n_resource.nav.OVERCOOLED }</span>
                            </div>
                        </div>`;
            $sensorBox.empty().html(sensorHtml);
        }

        getSensorHistoryData() {
            let _this = this;
            let sensorNameArr = [];
            if (_this.selectedSensor.length === 0) {
                _this.renderEchart();
                return;
            }
            _this.selectedSensor.forEach((v) => {
                sensorNameArr.push(v.name);
            })
            var postData = {
                projectId: AppConfig.projectId,
                pointList: sensorNameArr,
                timeStart: _this.conditionModel.time().startTime,
                timeEnd: _this.conditionModel.time().endTime,
                timeFormat: 'h1',
                prop: {}
            };

            Spinner.spin($(_this.container)[0]);
            WebAPI.post("/get_history_data_padded", postData).done(function (result) {
                _this.handleEchartsData(result);
            }).always(function () {
                Spinner.stop();
            })
        }

        bindStateOb() {
            this.conditionModel.addEventListener('update', this.update, this);
        }

        unbindStateOb() {
            this.conditionModel.removeEventListener('update', this.update, this);
        }

        update(e, propName) {
            let _this = this;
            let forbiddenArr = ['update.activePoints'];
            let forbiddenArr1 = ['update.activeAllEntities'];
            if (forbiddenArr.indexOf(propName) > -1 || forbiddenArr1.indexOf(propName) > -1) {
                return;
            }
            if (_this.conditionModel.activeEntities() && _this.conditionModel.activeEntities().length !== 0) {
                _this.deferred.done(function () {
                    let sensorArrId, curSensorArr = [];
                    _this.curSensorArr = [];
                    if (_this.treeData) {
                        for (var k = 0; k < _this.conditionModel.activeEntities().length; k++) {
                            sensorArrId = _this.conditionModel.activeEntities()[k].id;
                            for (var i = 0; i < _this.treeData.length; i++) {
                                if (sensorArrId == _this.treeData[i].id) {
                                    curSensorArr = _this.treeData[i].arrSensor;
                                    _this.curSensorArr = _this.curSensorArr.concat(curSensorArr);
                                }
                            }
                        }
                    }
                    if (_this.curSensorArr && _this.curSensorArr.length) {
                        $(_this.container).find('.thermalComfort_scroll').empty();
                        _this.selectedSensor = [];
                        _this.handleData(_this.curSensorArr);
                    }
                })
            }
        }

        getRealTimeData(data) {
            var sensorNameArr = [];
            data.forEach((d) => {
                if (d.ds!=="") {
                    sensorNameArr.push(d.ds);
                }
            })
            let postData = {
                dsItemIds: sensorNameArr
            };
            return  WebAPI.post("/analysis/startWorkspaceDataGenPieChart", postData).done(function (result) {});
        }
        getDsSetValue(data) {
            var dsSetArr = [];
            data.forEach((d) => {
                if (d.dsSet!=="") {
                    dsSetArr.push(d.dsSet)
                }
            })
            let postData = {
                dsItemIds: dsSetArr
            };
           return WebAPI.post("/analysis/startWorkspaceDataGenPieChart", postData).done(function (result) {});
        }
        handleData(data) {
            let _this = this;
            let asynOne = this.getRealTimeData(data);
            let asynTwo = this.getDsSetValue(data);
            $.when(asynOne, asynTwo).done((realTime, dsSetValue) => {
                realTime = realTime[0].dsItemList;
                this.realTimeData = realTime;
                dsSetValue = dsSetValue[0].dsItemList;
                data.forEach((v) => { 
                    let realTimeData = realTime.find((r) => {
                        return r.dsItemId === v.ds
                    });
                    if (realTimeData) {
                        let dsSetData;
                        if (v.dsSet === "") {
                            dsSetData = 23;
                        } else {
                            dsSetData = dsSetValue.find((d) => {
                                return d.dsItemId === v.dsSet
                            });
                            dsSetData = dsSetData.data;
                        }
                        let obj ={
                            name: v.name,
                            temperature: realTimeData.data,
                            setValue: dsSetData,
                            upper: v.upper,
                            lower: v.lower
                        }
                        _this.renderLeftSlider(obj);
                    }
                })
            })
        }

        renderLeftSlider(v) {
            let maxTemp = Number(v.setValue) + Number(v.upper);
            let minTemp = Number(v.setValue) + Number(v.lower);
            let className;
            if (Number(v.temperature) < minTemp) {
                className = 'coolSensor';
            }
            if (Number(v.temperature) > maxTemp) {
                className = 'hotSensor';
            }
            let singleName = `<div class="sensorInfo ${className}"　title="Sensor: ${v.name}" data-name="${v.name}" data-max="${maxTemp}" data-min="${minTemp}" data-set="${v.setValue}">
                                <div>
                                    <input class="sensorInput" type="checkbox">
                                    <span class="sensorName">${v.name}</span>
                                </div>
                                <span class="sensor-temperature">${v.temperature}℃</span>
                            </div>`;
            $(this.container).find('.thermalComfort_scroll').append(singleName);
            if ($(this.container).find('.sensorInfo').length === 1) {
                $(this.container).find('.sensorInfo').eq(0).trigger('click');
            }
        }

        attachEvents() {
            var _this = this;
            $(this.container).off('click.sensorInfo').on('click.sensorInfo', '.sensorInfo', function (e) {
                let $input = $(this).find('.sensorInput');
                if (e.target.getAttribute('type') == 'checkbox') {
                    var isChecked = $(e.target).prop('checked');
                    $(e.target).prop('checked', !isChecked);
                }

                let $this = $(this);
                if (!$input.prop('checked')) {
                    $input.prop("checked", true);
                    _this.selectedSensor.push({
                        name: $this.data('name'),
                        max: $this.data('max'),
                        min: $this.data('min'),
                        setValue: $this.data('set')
                    })
                } else {
                    $input.prop("checked", false);
                    let index = _this.selectedSensor.findIndex((v) => {
                        return v.name === $this.data('name')
                    });
                    _this.selectedSensor.splice(index, 1);
                }
                _this.getSensorHistoryData();
            });
        }

        handleEchartsData(historyData) {
            let _this = this;
            let timeArr = [],
                seriesArr = [],
                lengedArr = [];
            let timeLength = historyData[0].history.length;
            historyData.forEach((v) => {
                let sensorInfo = _this.selectedSensor.find((s) => {
                    return s.name === v.name
                });
                let dataArr = [];
                v.history.forEach((d) => {
                    if (timeArr.length !== timeLength) {
                        timeArr.push(d.time);
                    }
                    dataArr.push(d.value);
                })
                //在最后加入一个实时值
                timeArr.push(new Date().format('yyyy-MM-dd HH:mm:ss'));
                let lastData = this.realTimeData.find(row => v.name === row.dsItemId.split('|')[1]);
                dataArr.push(lastData.data);
                
                lengedArr.push(sensorInfo.name);
                seriesArr.push({
                    name: sensorInfo.name,
                    data: dataArr,
                    type: 'line',
                    markLine: {
                        lineStyle: {
                            normal: {
                                type: 'dashed',
                                width: 1,
                                opacity: 0.3,
                                color: '#B03A5B'
                            }
                        },
                        data: [{
                            yAxis: sensorInfo.max,
                            label: {
                                normal: {
                                    position: 'middle',
                                    formatter: i18n_resource.nav.MAX_LIMIT.format(sensorInfo.max)
                                }
                            },
                            lineStyle: {
                                normal: {
                                    opacity: 0.3
                                }
                            }
                        }, {
                            yAxis: sensorInfo.min,
                            label: {
                                normal: {
                                    position: 'middle',
                                    formatter: i18n_resource.nav.MIN_LIMIT.format(sensorInfo.min)
                                }
                            },
                            lineStyle: {
                                normal: {
                                    opacity: 0.3
                                }
                            }
                        },
                            {
                                yAxis: sensorInfo.setValue,
                                label: {
                                    normal: {
                                        position: 'middle',
                                        formatter: i18n_resource.nav.SETTING_VALUE.format(sensorInfo.setValue)
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        color: '#00f',
                                        opacity: 0.3
                                    }
                                }
                            }
                        ]
                    }
                })
            });
            this.renderEchart(seriesArr, timeArr, lengedArr);
        }

        close() {
            this.unbindStateOb();
        }

        renderEchart(seriesData, timeArr, lengedArr) {
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#b3b3b3',
                            width: "1",
                        }
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
                            dom += `<div style='padding-left:10px;padding-right:10px;padding-top:8px;'>
                                        <span style='border-radius:9px;display:inline-block;width:8px;height:8px;background:` + value[i].color + `;'></span>
                                        <span style="display:inline-block;padding-left:12px;">` + value[i].seriesName + `:<span style="display:inline-block;padding-left:1px;">` + value[i].value + `</span>
                                    </div>`
                        }
                        return ` <div style="padding-bottom:8px;"> <div style='padding:5px;background:#f3f6f8;color:#333333;text-align:center;'>${value[0].name}</div>${dom}</div>`
                    }
                },
                dataZoom: [{
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ],
                legend: {
                    textStyle: {
                        color: 'rgb(76,86,102)',
                        fontWeight: 'blod'
                    },
                    data: lengedArr,
                    itemGap: 40
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '8%',
                    top: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: timeArr,
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
                            color: 'rgb(114,114,114)',
                            fontSize: 12,
                        },
                    }
                },
                color: ['#FFD428', '#45ABFF', '#7094EC', '#54CADD', '#71D360', '#426EC1'],
                yAxis: [{
                    type: 'value',
                    axisLine: {
                        show: false,
                    },
                    min: 10,
                    max: 40,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'rgb(114,114,114)',
                            fontSize: 12,
                        },
                    },
                    splitLine: {
                        lineStyle: {color: 'rgb(227,230,232)',}
                    }
                }],
                series: seriesData
            };
            var chart = echarts.init($(this.container).find('.thermalComfort_trend_map')[0]);
            chart.clear();
            chart.setOption(option, {notMerge: true});
            window.onresize = chart.resize;
        }
    }

    exports.TemperatureHumidityTrendChart = TemperatureHumidityTrendChart;
}(namespace('thermalComfort.Pages')));
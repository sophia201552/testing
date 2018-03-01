;(function (exports) {
    class TemperatureHumidityTrendChart {
        constructor(container, conditionModel) {
            let _this = this;
            this.container = container;
            this.conditionModel = conditionModel;
            this.components = [];
            this.sensorNameArr = [];    //传感器名称;
            this.seriesData = [];
            this.lengedArr = [];
            this.treeData = [];
            this.dfdSensorData = $.Deferred().resolve();

            //待取数据,,后期会从参数传入;
            this.deferred = $.Deferred().resolve();
            Spinner.spin(ElScreenContainer);
            this.deferred = WebAPI.post('/thermalComfort/getConfigInfo', {projectId: AppConfig.projectId}).done(function (result) {
                if (result.status == 'OK') {
                    if (result.data && result.data.length) {
                        _this.treeData = result.data[0].entity;
                    }
                }
            }).fail(function () {
                alert('request error');
            }).always(function () {
                Spinner.stop();
            });

        }

        init() {
            this.unbindStateOb();
            this.bindStateOb();
            this.update();
            this.show();
            this.attachEvents();
        }

        attachEvents() {
            let _this = this;
            let $container = $(_this.container);
            let $temperature_trend = $("#temperature_trend");
            $container.off('click.allSensor').on('click.allSensor', '#temperature_trend .allSensor', function (e) {
                var $this = $(this);
                var isChecked = !!$this.is(':checked');
                $temperature_trend.find('.sensor-container .sensorInput').prop('checked', isChecked);
                _this.getSensorHistoryData(_this.sensorNameArr);
                _this.dfdSensorData.done(function () {
                    _this.initSensorSelect()
                });
            }).off('click.sensorInput').on('click.sensorInput', '#temperature_trend .sensorInput', function (e) {
                var curSelectedLen = 0,
                    sensorInputArr = $temperature_trend.find('.sensor-container .sensorInput');
                var curSelectedNameArr = [];


                for (var i = 0; i < sensorInputArr.length; i++) {
                    if ($(sensorInputArr[i]).prop('checked')) {
                        curSelectedLen++;
                        curSelectedNameArr.push($(sensorInputArr[i]).siblings('.sensorName').text());
                    }
                }
                _this.getSensorHistoryData(curSelectedNameArr);
                if (curSelectedLen == sensorInputArr.length) {
                    $temperature_trend.find('.sensor-container .allSensor').prop('checked', true);
                } else {
                    $temperature_trend.find('.sensor-container .allSensor').prop('checked', false);
                }
                _this.dfdSensorData.done(function () {
                    _this.initSensorSelect()
                });
            });
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

            _this.initSensor(_this.sensorNameArr);

        }

        getSensorSetVal(setNameArr) {
            let _this = this;
            _this.setValueArr = [];
            let $container = $(_this.container);
            let postData = {
                dsItemIds: setNameArr
            };
            Spinner.spin($container[0]);
            _this.dfdSensorData = WebAPI.post("/analysis/startWorkspaceDataGenPieChart", postData).done(function (result) {
                var value;
                if (!!result.dsItemList) {
                    for (var i = 0; i < result.dsItemList.length; i++) {
                        value = result.dsItemList[i];
                        if (!isNaN(parseInt(value.data))) {
                            _this.setValueArr.push(value);
                        }
                    }
                }

                return _this.setValueArr;
            }).always(function () {
                Spinner.stop();
            });
        }

        getSettingVal(sensorName) {
            let _this = this;
            var val, name;
            for (var i = 0; i < _this.setValueArr.length; i++) {
                name = _this.setValueArr[i].dsItemId.split('|')[1];
                if (name == sensorName) {
                    val = _this.setValueArr[i].data;
                }
            }
            return val;
        }

        //上下限值
        getLimit(sensorName) {
            let _this = this;
            var setting = parseInt(_this.getSettingVal(sensorName));
            var upper, lower;
            for (var i = 0; i < _this.sensorLimit.length; i++) {
                if (sensorName == _this.sensorLimit[i].setName) {
                    upper = setting + parseInt(_this.sensorLimit[i].upper);
                    lower = setting + parseInt(_this.sensorLimit[i].lower);
                }
            }
            return {
                upper: upper,
                lower: lower
            };
        }

        getSensorHistoryData(sensorNameArr) {
            let _this = this;
            let $container = $(_this.container);
            _this.sensorHistoryData = [];
            var postData = {
                projectId: AppConfig.projectId,
                pointList: sensorNameArr,
                timeStart: _this.conditionModel.time().startTime,
                timeEnd: _this.conditionModel.time().endTime,
                timeFormat: 'h1',
                prop: {}
            };

            Spinner.spin($container[0]);
            _this.dfdSensorData = WebAPI.post("/get_history_data_padded", postData).done(function (result) {
                _this.sensorHistoryData = result;
            }).always(function () {
                Spinner.stop();
            })
        }

        //字典待做;

        getCurrentSensorData(sensorName) {
            let _this = this;
            let value = [], timer = [], sensor;
            for (var i = 0; i < _this.sensorHistoryData.length; i++) {
                if (sensorName == _this.sensorHistoryData[i].name) {
                    sensor = _this.sensorHistoryData[i].history;
                    for (var k = 0; k < sensor.length; k++) {
                        value.push(sensor[k].value);
                        timer.push(sensor[k].time);
                    }
                }
            }
            return {
                value: value,
                timer: timer
            };
        }

        initSensorSelect() {
            let _this = this;
            let $temperature_trend = $("#temperature_trend");
            _this.selectedSensorName = [];
            var allSelected = $temperature_trend.find('.sensor-container .allSensor').is(':checked');
            var curSelected = $temperature_trend.find('.sensor-container .sensorInput:checked'),
                curName;
            var series = [];
            for (let i = 0; i < curSelected.length; i++) {
                curName = $(curSelected[i]).siblings('.sensorName').text();
                _this.selectedSensorName.push(curName);
            }
            _this.lengedArr = _this.selectedSensorName;
            _this.seriesData = [];

            var curLimit = 0;

            var selectedName = [];
            var $selectedInput = $("#temperature_trend").find('.sensor-container .sensorInput:checked');
            for (var i = 0; i < $selectedInput.length; i++) {
                selectedName.push($($selectedInput[i]).siblings('.sensorName').text());
            }

            var settingValArr = [];
            for (var i = 0; i < selectedName.length; i++) {
                settingValArr.push('@' + AppConfig.projectId + '|' + selectedName[i]);
            }
            // _this.getSensorSetVal(settingValArr);
            _this.dfdSensorData.done(function () {
                if (selectedName && selectedName.length) {
                    for (var i = 0; i < selectedName.length; i++) {
                        curLimit = 0;
                        _this.seriesData.push({
                            name: selectedName[i],
                            type: 'line',
                            data: _this.getCurrentSensorData(selectedName[i]).value,
                            showSymbol: false,
                            smooth: true,
                            markLine: {
                                lineStyle: {
                                    normal: {
                                        type: 'dashed',
                                        width: 1,
                                        opacity: 0.3,
                                        color: '#B03A5B'
                                    }
                                },
                                data: [
                                    {
                                        yAxis: 26,
                                        label: {
                                            normal: {
                                                position: 'middle',
                                                formatter: i18n_resource.nav.MAX_LIMIT.format('26')
                                            }
                                        },
                                        lineStyle: {
                                            normal: {
                                                opacity: 0.3
                                            }
                                        }
                                    },
                                    {
                                        yAxis: 20,
                                        label: {
                                            normal: {
                                                position: 'middle',
                                                formatter: i18n_resource.nav.MIN_LIMIT.format('20')
                                            }
                                        },
                                        lineStyle: {
                                            normal: {
                                                opacity: 0.3
                                            }
                                        }
                                    },
                                    {
                                        yAxis: 23,
                                        label: {
                                            normal: {
                                                position: 'middle',
                                                formatter: i18n_resource.nav.SETTING_VALUE.format('23')
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
                    }
                }
                var selectOne = $("#temperature_trend").find('.sensor-container .sensorInput:checked')[0];
                var text = $(selectOne).siblings('.sensorName').text();
                _this.sensorTimer = _this.getCurrentSensorData(text);

                if (allSelected) {
                    _this.renderEchart($temperature_trend.find('.thermalComfort_trend_map')[0], _this.seriesData);
                } else if (!curSelected.length) {
                    var notSelect = [];
                    _this.renderEchart($temperature_trend.find('.thermalComfort_trend_map')[0], notSelect);
                } else {
                    for (let i = 0; i < _this.selectedSensorName.length; i++) {
                        var selectName = _this.selectedSensorName[i];
                        for (let k = 0; k < _this.seriesData.length; k++) {
                            if (selectName == _this.seriesData[k].name) {
                                series.push(_this.seriesData[k]);
                            }
                        }
                    }

                    _this.renderEchart($temperature_trend.find('.thermalComfort_trend_map')[0], series);
                }
            });
        }

        initSensor(sensorNameArr) {
            let _this = this;
            let $sensorBox = $("#temperature_trend").find('.thermalComfort_sensor');
            let sensorHtml, sensorDiv;
            sensorHtml = `
                    <div class="sensor-container thermalComfort_scroll">
                        <div class="checkbox">
                            <label>
                                <input class="allSensor" type="checkbox">
                                <span class="sensorAll">All</span>
                            </label>
                        </div>
                    </div>
                    <div class="tooltips-container">
                        <div class="tooltips tooltip-pic-hot">
                            <span class="tooltip-pic"></span>
                            <span class="tooltip-text">${ i18n_resource.nav.OVERHEATED }</span>
                        </div>
                        <div class="tooltips tooltip-pic-cool">
                            <span class="tooltip-pic"></span>
                            <span class="tooltip-text">${ i18n_resource.nav.OVERCOOLED }</span>
                        </div>
                    </div>
                `;
            $sensorBox.empty().html(sensorHtml);
            var $sensorContainer = $sensorBox.find('.sensor-container');
            for (let i = 0; i < sensorNameArr.length; i++) {
                sensorDiv = `
                        <div class="checkbox">
                            <label title="${'Sensor: ' + sensorNameArr[i] }">
                                <input class="sensorInput" type="checkbox">
                                <span class="sensorName">${ sensorNameArr[i] }</span>
                            </label>
                            <span class="sensor-temperature"></span>
                        </div>
                `;
                $sensorContainer.append(sensorDiv);
            }
            $sensorContainer.find('.checkbox:nth-child(2) input').prop('checked', true);
            _this.dfdSensorData.done(function () {
                _this.setHotColl();
            });
        }

        setHotColl() {
            let _this = this;
            let $sensorBox = $("#temperature_trend").find('.thermalComfort_sensor');
            var $sensor = $sensorBox.find('.sensorName');
            var sensor, temperatureVal;
            for (var i = 0; i < $sensor.length; i++) {
                sensor = $sensor[i];
                for (var k = 0; k < _this.setValueArr.length; k++) {
                    if ($(sensor).text() == _this.setValueArr[k].dsItemId.split('|')[1]) {
                        temperatureVal = parseFloat(_this.setValueArr[k].data, 10);
                        if (temperatureVal >= 26) {
                            $(sensor).parent().addClass('hotSensor');
                        } else if (temperatureVal <=20) {
                            $(sensor).parent().addClass('coolSensor');
                        }

                        $(sensor).parent().siblings('.sensor-temperature').text(temperatureVal.toFixed(1) + '℃');
                    }
                }
            }
        }

        bindStateOb() {
            this.conditionModel.addEventListener('update', this.update, this);
        }

        unbindStateOb() {
            this.conditionModel.removeEventListener('update', this.update, this);
        }

        update(e, propName) {
            let _this = this;
            let forBlen = ['update.activeEntities', 'update.time', 'undefined'];

            if (forBlen[0].indexOf(propName) < 0 && forBlen[1].indexOf(propName) < 0 && forBlen[2].indexOf(propName) < 0) {
                return;
            }

            if (!_this.conditionModel.activeEntities().length) {
                return;
            }

            _this.deferred.done(function () {
                _this.sensorNameArr = [];
                _this.sensorSetNameArr = [];
                _this.sensorLimit = [];
                _this.sensorNameArrDS = [];
                let sensorArrId, curSensorArr = [];
                _this.curSensorArr = [];
                if (_this.conditionModel.activeEntities() && _this.conditionModel.activeEntities().length) {
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
                        var curSensorName, curSensorSetName, upper, lower;
                        for (var i = 0; i < _this.curSensorArr.length; i++) {
                            curSensorName = _this.curSensorArr[i].ds.split('|')[1];
                            curSensorSetName = _this.curSensorArr[i].dsSet;
                            upper = _this.curSensorArr[i].upper;
                            lower = _this.curSensorArr[i].lower;
                             _this.sensorNameArrDS.push(_this.curSensorArr[i].ds);
                            _this.sensorNameArr.push(curSensorName);
                            _this.sensorSetNameArr.push(curSensorSetName);
                            _this.sensorLimit.push({
                                setName: curSensorName,
                                upper: upper,
                                lower: lower
                            })
                        }
                    }
                }
                _this.getSensorSetVal(_this.sensorNameArrDS);
                _this.initSensor(_this.sensorNameArr);
                // _this.getSensorSetVal(_this.sensorSetNameArr);
                _this.getSensorHistoryData([_this.sensorNameArr[0]]);
                _this.dfdSensorData.done(function () {
                    _this.initSensorSelect();
                })
            });


        }

        close() {
            this.unbindStateOb();
        }

        renderEchart($container, seriesData) {
            let _this = this;
            var series = seriesData.concat();
            if (series.length) {
                for (var i = 1; i < series.length; i++) {
                    series[i].markLine = null;
                }
            }

            var xAriArr = [], xAri;
            if (_this.sensorTimer.timer && _this.sensorTimer.timer.length) {
                for (var i = 0; i < _this.sensorTimer.timer.length; i++) {
                    xAri = new Date(_this.sensorTimer.timer[i]).format('MM-dd HH:mm');
                    xAriArr.push(xAri);
                }
            }


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
                dataZoom: [
                    {
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
                    data: _this.lengedArr,
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
                    data: xAriArr,
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
                series: series
            };
            var chart = echarts.init($container);
            chart.clear();
            chart.setOption(option, {notMerge: true});
            window.onresize = chart.resize;
        }
    }

    exports.TemperatureHumidityTrendChart = TemperatureHumidityTrendChart;
}(namespace('thermalComfort.Pages')));

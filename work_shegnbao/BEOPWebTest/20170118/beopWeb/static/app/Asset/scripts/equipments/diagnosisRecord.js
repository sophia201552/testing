/**
 * Created by vicky on 2016/1/28.
 */
var DiagnosisRecord = (function () {
    var _this = null;

    function DiagnosisRecord() {
        _this = this;
        this.$container = $("#tabDiagnosticRecords");
        this.tplDiagnosisi = "#tpl-diagnosis";
        this.diagnosisStructPromise = null;
        this.equipmentMap = {};
        this.equipment = null;
        this.equipmentList = [];
    }

    DiagnosisRecord.prototype.show = function (assetItem) {
        if (!assetItem || assetItem.length > 1) {
            return;
        }
        this.equipment = assetItem[0].name;

        var $startTime = $('#diagnosisStartTime');
        if (!$startTime.length) {
            this.$container.html($(this.tplDiagnosisi).html()).show();
            $startTime = $('#diagnosisStartTime');
        }
        this.$paneNoticeItems = this.$container.find("#paneNoticeItems");

        if (!$startTime.val()) {
            $startTime.datetimepicker({
                startView: 'month',
                minView: 'month',
                format: "yyyy-mm-dd",
                autoclose: true
            });
        }
        var $endTime = $('#diagnosisEndTime');
        if (!$endTime.val()) {
            $endTime.datetimepicker({
                startView: 'month',
                minView: 'month',
                format: "yyyy-mm-dd",
                autoclose: true
            });
        }

        _this.attachEvents();

    };

    DiagnosisRecord.prototype.attachEvents = function () {
        this.$container.off("click.search").on("click.search", ".diagnosis-search-btn", function () {
            _this.getList();
        });

        this.$container.off("click.detail").on("click.detail", ".diagnosis-detail", function () {
            var $thisItem = $(this).closest('.div-pane-log');
            var index = $("#tabDiagnosticRecords").find('.div-pane-log').index($thisItem);
            $("#diagnosisDetailWin").modal();
            $("#diagnosisDetailInfoBox").html(beopTmpl('tpl_diagnosis_detail', {
                info: _this.equipmentList[index]
            }));
            var canvasContainer = $("#diagnosis_detail_canvas")[0];
            Spinner.spin(canvasContainer);

            WebAPI.post('workflow/transaction/fault_curve_data/', {
                projectId: AppConfig.projectId,
                chartPointList: _this.equipmentList[index].points,
                chartQueryCircle: 'm5',
                chartStartTime: new Date(new Date(_this.equipmentList[index].time) - 24 * 60 * 60 * 1000 / 2).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
                chartEndTime: new Date(new Date(_this.equipmentList[index].time) + 24 * 60 * 60 * 1000 / 2).format('yyyy-MM-dd HH:mm:ss')   //报警发生后半天
            }).done(function (result) {
                if (result.success) {
                    _this.renderChart(result.data, canvasContainer);
                }
            }).fail(function () {
                alert('服务器请求出错！');
            }).always(function () {
                Spinner.stop();
            });
        });
    };

    DiagnosisRecord.prototype.renderChart = function (record, canvasContainer) {
        var list_description = record.description,
            list_value = record.value,
            arrXAxis = [], result = [];
        if (record.time.length > 0) {
            result = record.time[0].split(',');
        }
        result.forEach(function (item) {
            arrXAxis.push(item.split(' ')[1])
        });
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
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params[0].name.length > 0) {
                        var strResult = result[params[0].dataIndex] + '<br/>';
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

        var myChart = echarts.init(canvasContainer);
        myChart.setOption(option);
        window.onresize = myChart.resize;
    };

    DiagnosisRecord.prototype.filterDiagnosis = function (diagnosisList) {
        return diagnosisList.filter(function (item) {
            if (!item.equipmentId) {
                return false;
            }
            return _this.equipmentMap[item.equipmentId].name === _this.equipment;
        });
    };

    DiagnosisRecord.prototype.rendDiagnosisList = function (startDate, endDate) {
        Spinner.spin(_this.$paneNoticeItems[0]);
        WebAPI.get('/diagnosis/getHistoryFault/' + AppConfig.projectId + '/' + startDate + '/' + endDate + '').done(function (result) {
            if (result) {
                _this.equipmentList = [];
                _this.equipmentList = _this.filterDiagnosis(result);
                _this.$paneNoticeItems.html(beopTmpl('tpl_diagnosis_item', {
                    items: _this.equipmentList,
                    equipment: _this.equipment
                }));
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    DiagnosisRecord.prototype.loadDiagnosisStruct = function () {
        if (!this.diagnosisStructPromise) {
            this.diagnosisStructPromise = WebAPI.get('/diagnosis/getStruct/' + AppConfig.projectId).done(function (result) {
                if (result) {
                    var equipments = result.equipments, zones = result.zones;
                    for (var i = 0; i < equipments.length; i++) {
                        var equipment = equipments[i];
                        _this.equipmentMap[equipment.id] = equipment;
                    }
                }
            }).fail(function () {
                _this.diagnosisStructPromise = null;
            });
        }
        return this.diagnosisStructPromise;
    };

    DiagnosisRecord.prototype.getList = function () {
        var startDate = $('#diagnosisStartTime').val().trim();
        var endDate = $('#diagnosisEndTime').val().trim();
        var opt = {};
        if (!startDate) {
            alert('开始时间不可为空.');
            return;
        }
        if (!endDate) {
            alert('结束时间不可为空.');
            return;
        }
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                alert.danger('开始时间不能晚于结束时间');
                return;
            }
        }
        if (endDate) {
            opt.endTime = new Date(endDate).format('yyyy-MM-dd');
        } else {
            opt.endTime = new Date().format('yyyy-MM-dd');
            $('#maintainRecordEndTime').val(new Date().format('yyyy-MM-dd'));
        }
        if (startDate) {
            opt.startTime = new Date(startDate).format('yyyy-MM-dd');
        } else {
            opt.startTime = new Date(new Date() - 30 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd');
            $('#maintainRecordStartTime').val(new Date(new Date() - 30 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd'));
        }
        this.loadDiagnosisStruct().done(function () {
            _this.rendDiagnosisList(startDate, endDate);
        });
    };

    DiagnosisRecord.prototype.close = function () {
    };

    return new DiagnosisRecord();
}());
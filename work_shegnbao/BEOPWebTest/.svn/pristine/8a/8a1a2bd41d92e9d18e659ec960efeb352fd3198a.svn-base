var DiagnosisHistoryChart = (function () {
    var _this;

    function DiagnosisHistoryChart(obj) {
        _this = this;
        this.$container = $("#dialogContent");
        this.diagnosisList = obj.result.records;
        this.pointMap = obj.result.bindPoints;
        this.ExpertContainerUrl = obj.ExpertContainerUrl;
        this.sendData = obj.sendData;
        this.pointList = obj.pointList || [];
        this.hidePointList = obj.hidePointList || [];
        this.startDate = this.sendData.s_time;
        this.endDate = this.sendData.e_time;
        this.timeList = [];
        this.valueList = [];
        this.treeList = [];
        this.treeSelectPointMap = {};
        this.charts = [];

        this.historyData = $.extend(true, {}, this.pointMap);
        this.chart_bindPoints = null;
    }

    DiagnosisHistoryChart.prototype = {
        show: function () {
            $('#dialogModal').one('hidden.bs.modal', function () {
                $(this).find('#container').removeClass('wr80');
                _this.close();
            }).one('shown.bs.modal', function () {
                _this.$container.addClass('wr80');
                _this.init();
            }).modal({
                backdrop: 'static'
            });
        },

        close: function () {
            this.charts.forEach(function (chart) {
                chart && chart.dispose && chart.dispose();
                chart = null;
            });
            this.charts = [];
            this.chart_bindPoints = null;
            this.pointList = null;

            this.$container.empty();
            _this.$container.removeClass('wr80');
        },

        init: function () {
            return WebAPI.get("/static/views/observer/widgets/diagnosisHistoryChart.html").done(function (resultHtml) {
                _this.$container.empty().html(resultHtml);
                if (window.localStorage.getItem("systemSkin_" + AppConfig.userId) == "default") {
                    $('.modal-content').addClass('default');
                } else {
                    $('.modal-content').addClass('dark');
                }
                I18n.fillArea(_this.$container);
                _this.refreshDateTimePicker();
                _this.renderFilter();
                _this.loadTree();
                _this.getDataInfo();
                _this.refreshData();
                _this.attachEvent();
            });
        },

        attachEvent: function () {
            var _this = this;
            var $diagnosisCurveDateStart = $("#diagnosisCurveDateStart"),
                $diagnosisCurveDateEnd = $("#diagnosisCurveDateEnd");
            this.$container.off('click.filterCurveConfirm').on('click.filterCurveConfirm', '#filterCurveConfirm', function () {
                var startTime = $diagnosisCurveDateStart.val(),
                    endTime = $diagnosisCurveDateEnd.val();

                if (!startTime) {
                    alert(I18n.resource.common.START_TIME_REQUIRED);
                    return;
                }
                if (!endTime) {
                    alert(I18n.resource.common.END_TIME_REQUIRED);
                    return;
                }

                if (endTime < startTime) {
                    alert(I18n.resource.common.TIME_COMPARE);
                    return;
                }
                _this.startDate = startTime;
                _this.endDate = endTime;
                _this.fetchData();
            }).off('click.searchCurveOfTime').on('click.searchCurveOfTime', '.searchCurveOfTime', function () {
                _this.startDate = _this.getStartTime($(this).attr('dateType'));
                _this.endDate = new Date().format("yyyy-MM-dd HH:mm:00");
                $diagnosisCurveDateStart.val(_this.startDate);
                $diagnosisCurveDateEnd.val(_this.endDate);
                _this.fetchData();
            });
        },

        loadTree: function () {
            if ($.isEmptyObject(this.pointMap) || this.pointMap.error) {
                return;
            }
            var zTreeSetting = {
                view: {
                    selectedMulti: false,
                    showIcon: false
                },
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: this.zTreeOnCheck.bind(this),
                    beforeClick: this.zTreeBeforeClick,
                    onClick: this.zTreeClick.bind(this)
                }
            };
            this.changeToZTreeNodes();
            this.zTreeInstance = $.fn.zTree.init($("#diagnosisTreeUL"), zTreeSetting, this.treeList);
        },
        changeToZTreeNodes: function () {
            for (var prop in this.pointMap.data) {
                this.treeList.push({
                    id: ObjectId(),
                    name: prop,
                    pId: 1,
                    checked: true
                });
            }
            this.treeList.push({
                id: 1, pId: 0, name: "all", open: true, checked: true
            });
        },

        zTreeBeforeClick: function () {
            return true;
        },

        zTreeClick: function (e, treeId, treeNode) {
            this.zTreeInstance.checkNode(treeNode, null, true, true);
        },

        zTreeOnCheck: function (e, treeId, treeNode) { // e js event , treeId 父节点id, treeNode 当前节点信息
            if (treeNode.isParent) {
                if (treeNode.checked) {
                    this.historyData.data = $.extend(true, {}, this.pointMap.data);
                    this.hidePointList = [];
                } else {
                    this.historyData.data = {};
                    if (treeNode.children && treeNode.children.length) {
                        for (var i = 0; i < treeNode.children.length; i++) {
                            $('#' + treeNode.children[i].tId + '_span').css('color', '#fff');
                        }
                    }

                }
            } else {
                for (var prop in this.pointMap.data) {
                    if (prop == treeNode.name) {
                        if (treeNode.checked) {
                            this.historyData.data[prop] = this.pointMap.data[prop];
                            if ($.inArray(treeNode.name, this.hidePointList) !== -1) {
                                for (var i = 0; i < this.hidePointList.length; i++) {
                                    if (treeNode.name == this.hidePointList[i]) {
                                        this.hidePointList.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        } else {
                            delete this.historyData.data[prop];
                            $('#' + treeNode.tId + '_span').css('color', '#fff');
                        }
                        break;
                    }
                }
            }

            this.refreshData();
        },

        resetParam: function (obj) {
            this.diagnosisList = obj.records;
            this.pointMap = obj.bindPoints;
            this.treeList = [];
            this.getDataInfo();
        },

        getDataInfo: function () {
            this.timeList = [];
            this.valueList = [];
            for (var i = 0; i < this.diagnosisList.length; i++) {
                this.timeList.push(this.diagnosisList[i].time);
                this.valueList.push(this.diagnosisList[i].value);
            }
        },

        getStartTime: function (dateType) {
            var date = new Date();
            if (dateType === 'hour') {
                return new Date(date.getTime() - 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:00');
            } else if (dateType === 'today') {
                return date.format('yyyy-MM-dd 00:00:00');
            } else if (dateType === 'week') {
                var getDay = date.getDay() == 0 ? 7 : date.getDay(); // 周日 date.getDay() 为 0
                return new Date(date - (getDay - 1) * 86400000).format('yyyy-MM-dd 00:00:00');
            } else if (dateType === 'month') {
                return new Date(date.getFullYear(), date.getMonth(), 1).format('yyyy-MM-dd 00:00:00');
            }
        },

        serverRequestError: function (mes) {
            console.log(mes);
            alert(I18n.resource.debugTools.sitePoint.SERVER_REQUEST_FAILED);
        },

        renderFilter: function () {
            $('#diagnosisCurveDateStart').val(this.startDate.format("yyyy-MM-dd HH:mm:00"));
            $('#diagnosisCurveDateEnd').val(this.endDate.format("yyyy-MM-dd HH:mm:00"));
        },

        refreshDateTimePicker: function () {
            $("#diagnosisCurveDateStart").datetimepicker({
                startView: 'month',
                autoclose: true,
                format: 'yyyy-mm-dd hh:ii:00'
            });
            $("#diagnosisCurveDateEnd").datetimepicker({
                startView: 'month',
                autoclose: true,
                format: 'yyyy-mm-dd hh:ii:00'
            });
        },

        fetchData: function () {
            Spinner.spin(this.$container.get(0));
            _this.sendData.s_time = _this.startDate;
            _this.sendData.e_time = _this.endDate;
            $.ajax({
                url: _this.ExpertContainerUrl + 'diagnosis/get/moduleStatus/single',
                data: _this.sendData,
                type: "POST"
            }).done(function (result) {
                if (result && result.records.length) {
                    localStorage.setItem('diagnosisCurveStartDate', _this.startDate);
                    localStorage.setItem('diagnosisCurveEndDate', _this.endDate);
                    _this.resetParam(result);
                    _this.refreshData();
                } else {
                    alert(result.bindPoints.msg);
                }
            }).fail(function () {
                alert('Request data failed!');
            }).always(function () {
                Spinner.stop();
            });
        },

        refreshData: function () {
            var bindPointSeries = [], faultSeries = [];
            var $curveBox = $('.curveBox');
            if (!this.diagnosisList.length) {
                $curveBox.empty();
                return;
            } else {
                var pointIndex = 0;
                var len = echarts.config.color.length;
                for (var prop in this.historyData.data) {
                    if (this.historyData.data.hasOwnProperty(prop)) {
                        var color = echarts.config.color[pointIndex % len];
                        if ($.inArray(prop, this.hidePointList) === -1) {
                            var treeNode = this.zTreeInstance.getNodeByParam('name', prop, null);
                            $('#' + treeNode.tId + '_span').css('color', color);
                        }
                        pointIndex++;
                    }
                    bindPointSeries.push({
                        name: prop,
                        type: 'line',
                        data: this.historyData.data[prop],
                        smooth: true
                    });
                }
                faultSeries.push({
                    name: this.diagnosisList[0].name,
                    type: 'line',
                    data: this.valueList,
                    smooth: true
                });
            }

            var option_bindPoints = {
                title: {
                    text: '绑定点曲线',
                    textStyle: {
                        fontSize: '16',
                        fontWeight: '700',
                        color: '#eee'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    enterable: true,
                    showDelay: 0
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: true
                        },
                        brush: {
                            type: ['lineX', 'clear']
                        }
                    }
                },
                dataZoom: {
                    y: 600,
                    realtime: true,
                    show: true,
                    start: 0,
                    end: 100
                },
                grid: {
                    x: 80,
                    y: 40,
                    x2: 20,
                    y2: 25,
                },
                xAxis: {
                    type: 'category',
                    axisTick: {onGap: false},
                    splitLine: {show: false},
                    axisLabel: {
                        show: false
                    },
                    data: this.timeList
                },
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        boundaryGap: [0.05, 0.05],
                        splitArea: {show: false}
                    }
                ],
                series: bindPointSeries
            };
            var option_faults = {
                title: {
                    text: '诊断曲线',
                    textStyle: {
                        fontSize: '16',
                        fontWeight: '700',
                        color: '#eee'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    triggerOn: 'mousemove',
                    showDelay: 0,
                    enterable: true,
                    formatter: function (params) {
                        if (!params.length) {
                            return true;
                        }
                        var fault = _this.diagnosisList[params[0].dataIndex];
                        var $faults_info = $('.faults_info');
                        switch (params[0].value) {
                            case -1:
                                $faults_info.css('display', 'none');
                                return params[0].name + "<br />" +
                                    params[0].seriesName + ': ' + '未知';
                            case 0:
                                $faults_info.css('display', 'none');
                                return params[0].name + "<br />" +
                                    params[0].seriesName + ': ' + '正常';
                            case 1:
                                $faults_info.css('display', 'block').html(params[0].name + "<br />" +
                                    params[0].seriesName + ': ' + '报警' + "<br />" +
                                    fault.affect + "，" + fault.analysis + "<br />" +
                                    fault.problem + "&nbsp;" + "<br />" +
                                    fault.suggestion);
                                return params[0].name + "<br />" +
                                    params[0].seriesName + ': ' + '报警';
                        }
                    }
                },
                dataZoom: {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100,
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: {
                    x: 80,
                    y: 50,
                    x2: 20,
                    y2: 40,
                    height: '65%'
                },
                xAxis: {
                    type: 'category',
                    axisTick: {onGap: false},
                    splitLine: {show: false},
                    data: this.timeList
                },
                yAxis: {
                    show: true,
                    min: -1,
                    max: 1,
                    type: 'value',
                    axisLabel: {
                        show: true,
                        formatter: function (value) {
                            switch (value) {
                                case -1:
                                    return '未知';
                                case 0:
                                    return '正常';
                                case 1:
                                    return '报警';
                            }
                        }
                    }
                },
                series: faultSeries
            };


            var chart_faults, $oneChart = $('.one-chart'), $multiChart = $('.multi-chart'), $faults_info = $('.faults_info');
            if ($.isEmptyObject(this.pointMap) || this.pointMap.error) {
                $multiChart.hide();
                $oneChart.show();
                $curveBox.css('width', ($oneChart.width() * 0.95).toFixed(1) + 'px');
                $faults_info.css('width', ($oneChart.width() * 0.95).toFixed(1) + 'px');

                chart_faults = echarts.init(document.getElementById('curveBox'), AppConfig.chartTheme);
                chart_faults.setOption(option_faults);
                this.charts.push(chart_faults);
            } else {
                $multiChart.show();
                $oneChart.hide();
                $curveBox.css('width', ($multiChart.width() * 0.80).toFixed(1) + 'px');
                $faults_info.css('width', ($multiChart.width() * 0.75).toFixed(1) + 'px');

                this.chart_bindPoints = echarts.init(document.getElementById('curveBox_bindPoints'), AppConfig.chartTheme);
                this.chart_bindPoints.setOption(option_bindPoints);

                chart_faults = echarts.init(document.getElementById('curveBox_faults'), AppConfig.chartTheme);
                chart_faults.setOption(option_faults);

                echarts.connect([this.chart_bindPoints, chart_faults]);
                this.charts.push(this.chart_bindPoints);
                this.charts.push(chart_faults);
            }
        }
    };

    return DiagnosisHistoryChart;
})();

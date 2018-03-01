/// <reference path="../../lib/jquery-2.1.4.min.js" />
/// <reference path="../../core/common.js" />

var HistoryChart = (function () {
    function HistoryChart(obj) {
        this.allData = obj.data;
        this.historyData = $.extend(true, {}, this.allData);
        this.startDate = obj.startDate;
        this.endDate = obj.endDate;
        this.projectId = obj.projectId;
        this.pointList = obj.pointList || [];
        this.hidePointList = obj.hidePointList || [];
        this.format = obj.format;
        this.$dialogContent = $("#dialogContent");
        this.historyChart = null;
        this.ExpertContainerUrlPromise = $.Deferred();
        this.isShowRepairData = obj.isShowRepairData;
        this.repareDataKey = null;
        this.treeList = [];
    }

    HistoryChart.prototype = {
        show: function () {
            var _this = this;
            $('#dialogModal').one('hidden.bs.modal', function () {
                $(this).find('#dialogContent').removeClass('historyChartBigModel');
                _this.close();
                _this.repairDataInterval && clearInterval(_this.repairDataInterval);
            }).one('shown.bs.modal', function () {
                _this.$dialogContent.addClass('historyChartBigModel');
                _this.init();
            }).modal({
                backdrop: 'static'
            });
        },

        close: function () {
            this.historyChart && this.historyChart.dispose && this.historyChart.dispose();
            this.historyChart = null;
            this.$dialogContent.empty();
            this.allData = null;
            this.historyData = null;
            this.startDate = null;
            this.endDate = null;
            this.projectId = null;
            this.pointList = null;
            this.format = null;
            $('#curveDateStart').datetimepicker('remove');
            $('#curveDateEnd').datetimepicker('remove');
        },

        init: function () {
            var _this = this;
            $('[data-toggle="tooltip"]').tooltip();
            this.ExpertContainerUrlPromise = $.ajax({
                url: "/getExpertContainerUrl",
                type: "GET"
            });
            return WebAPI.get("/static/views/observer/widgets/historyChart.html").done(function (resultHtml) {
                _this.$dialogContent.html(resultHtml);
                if (window.localStorage.getItem("systemSkin_" + AppConfig.userId) == "default") {
                    $('.modal-content').addClass('default');
                } else {
                    $('.modal-content').addClass('dark');
                }
                if (!_this.isShowRepairData) {
                    $('#repairData').hide();
                }
                I18n.fillArea(_this.$dialogContent);
                _this.refreshDateTimePicker();
                _this.loadTree();
                _this.refreshData();
                _this.renderFilter();
                _this.attachEvent();
            });
        },
        getNotHidePoint: function () {
            var _this = this;
            this.pointList.filter(function (n) {
                return _this.hidePointList.indexOf(n) == -1;
            });

        },

        attachEvent: function () {
            var _this = this;
            var $curveDateStart = $("#curveDateStart"),
                $curveDateEnd = $("#curveDateEnd"),
                $intervalType = $("#intervalType");
            this.$dialogContent.off('click.filterCurveConfirm').on('click.filterCurveConfirm', '#filterCurveConfirm', function () {
                var startTime = $curveDateStart.val(),
                    endTime = $curveDateEnd.val(),
                    format = $intervalType.val();

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
                _this.format = format;
                localStorage.setItem('dataManagerStartDate', startTime);
                localStorage.setItem('dataManagerEndDate', endTime);
                localStorage.setItem('dataManagerFormat', format);
                _this.fetchData();
            }).off('click.searchCurveOfTime').on('click.searchCurveOfTime', '.searchCurveOfTime', function () {
                var dateType = $(this).attr('dateType');
                if (dateType === 'hour') {
                    _this.format = 'm5';
                } else if (dateType === 'today') {
                    _this.format = 'm5';
                } else if (dateType === 'week') {
                    _this.format = 'h1';
                } else if (dateType === 'month') {
                    _this.format = 'h1';
                }
                _this.startDate = _this.getStartTime(dateType);
                _this.endDate = new Date().format("yyyy-MM-dd HH:mm:00");
                $curveDateStart.val(_this.startDate);
                $curveDateEnd.val(_this.endDate);
                $intervalType.val(_this.format);
                localStorage.setItem('dataManagerStartDate', _this.startDate);
                localStorage.setItem('dataManagerEndDate', _this.endDate);
                localStorage.setItem('dataManagerFormat', _this.format);
                _this.fetchData();
            }).off('click.repairData').on('click.repairData', '#repairData', function () {
                var $self = $(this);
                if ($self.hasClass('disable')) {
                    return;
                }
                var start, end;
                try {
                    var xAxis = _this.historyChart.getModel().option.xAxis[0];
                    start = xAxis.data[xAxis.rangeStart] || xAxis.data[0];
                    end = xAxis.data[xAxis.rangeEnd] || xAxis.data[xAxis.data.length - 1];

                } catch (e) {
                    console.warn(e);
                    start = $("#curveDateStart").val();
                    end = $("#curveDateEnd").val();
                }

                infoBox.confirm(I18n.resource.dataManage.SURE_TO_GENERATE_DATA + ' ' + start + ' ' + I18n.resource.dataManage.TO + ' ' + end + ' ' + I18n.resource.dataManage.INTERVAL_AS + ' ' + $intervalType.val() + ' ' + I18n.resource.dataManage.OF_DATA, function () {
                    _this.ExpertContainerUrlPromise.done(function (result) {
                        if (result.success) {
                            $.ajax({
                                url: result.data + 'repairData/batch',
                                type: "POST",
                                data: {
                                    'list': JSON.stringify(_this.pointList),
                                    'timeFrom': start,
                                    'timeTo': end,
                                    'projId': _this.projectId,
                                    'format': $intervalType.val(),
                                    'userId': AppConfig.userId
                                }
                            }).done(function (isStartResult) {
                                $self.addClass('disable');
                                if (isStartResult.length == 24) {
                                    _this.repareDataKey = isStartResult;
                                    var repairDataToolTip;
                                    _this.repairDataInterval = setInterval(function () {
                                        $.ajax({
                                            url: result.data + "repairData/status/" + AppConfig.projectId,
                                            type: 'GET'
                                        }).done(function (repairDataResult) {
                                            var percent = 0;
                                            if (repairDataResult && repairDataResult[_this.repareDataKey]) {
                                                percent = repairDataResult[_this.repareDataKey].percent;
                                            }
                                            repairDataToolTip && repairDataToolTip.tooltip('destroy');
                                            repairDataToolTip = $('#repairData').tooltip({
                                                container: 'body',
                                                trigger: 'hover focus',
                                                html: true,
                                                placement: 'bottom',
                                                template: '<div class="tooltip" role="tooltip">' +
                                                '<div class="tooltip-arrow"></div>' +
                                                '<div class="tooltip-inner"></div>' +
                                                '</div>',
                                                title: I18n.resource.dataManage.GENERATE_DATA_FROM + ' ' + start + ' ' +
                                                I18n.resource.dataManage.TO + ' ' + end + ' ' + I18n.resource.dataManage.INTERVAL_AS +
                                                ' ' + $intervalType.val() + ' ' + I18n.resource.dataManage.OF_DATAS + I18n.resource.dataManage.PROGRESS +
                                                ' ' + percent
                                            });
                                            $self.text(I18n.resource.dataManage.GENERATE_DATA + ' ' + percent);
                                            if (parseInt(percent) == 100) {
                                                repairDataToolTip && repairDataToolTip.tooltip('destroy');
                                                _this.repairDataInterval && clearInterval(_this.repairDataInterval);
                                                $self.text(I18n.resource.dataManage.GENERATE_DATA);
                                                $self.removeClass('disable');
                                                alert(I18n.resource.debugTools.sitePoint.COMPLEMENT_HAS_BEEN_COMPLETED);
                                            }
                                        }).fail(function (e) {
                                            $self.text(I18n.resource.dataManage.GENERATE_DATA);
                                            $self.removeClass('disable');
                                            _this.serverRequestError(e);
                                        })
                                    }, 3000);
                                }
                            }).fail(function (e) {
                                _this.serverRequestError(e);
                            });
                        } else {
                            alert('server busy:can\'t get the Expert Container service url.')
                        }
                    })

                })
            });
        },

        loadTree: function () {
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
            this.zTreeInstance = $.fn.zTree.init($("#hcPointTree"), zTreeSetting, this.treeList);
        },

        changeToZTreeNodes: function () {
            for (var i = 0; i < this.pointList.length; i++) {
                var data = this.pointList[i];
                var item = {};
                item.id = ObjectId();
                item.name = data;
                item.pId = 1;
                $.inArray(data, this.hidePointList) !== -1 ? item.checked = false : item.checked = true;
                this.treeList.push(item);
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
            if (treeNode) {
                if (treeNode.isParent) {
                    if (treeNode.checked) {
                        this.historyData.data = $.extend(true, {}, this.allData.data);
                        this.hidePointList = [];
                    } else {
                        this.historyData.data = {};
                        if (treeNode.children && treeNode.children.length) {
                            for (var i = 0, iLen = treeNode.children.length; i < iLen; i++) {
                                $('#' + treeNode.children[i].tId + '_span').css('color', '#fff');
                            }
                        }
                    }
                } else {
                    for (var prop in this.allData.data) {
                        if (prop == treeNode.name) {
                            if (treeNode.checked) {
                                this.historyData.data[prop] = this.allData.data[prop];
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

            }
            this.refreshData();
        },

        serverRequestError: function (mes) {
            console.log(mes);
            alert(I18n.resource.debugTools.sitePoint.SERVER_REQUEST_FAILED);
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

        fetchData: function () {
            var _this = this;
            Spinner.spin(this.$dialogContent.get(0));
            WebAPI.post("/get_history_data_padded_reduce", {
                projectId: _this.projectId,
                pointList: this.pointList,
                timeStart: this.startDate.format("yyyy-MM-dd HH:mm:00"),
                timeEnd: this.endDate.format("yyyy-MM-dd HH:mm:00"),
                timeFormat: this.format ? this.format : 'm5'
            }).done(function (data) {
                if (!data || data == {}) {
                    data = [];
                }
                try {
                    _this.allData = data;
                    _this.historyData = $.extend(true, {}, _this.allData);

                    var treeObj = $.fn.zTree.getZTreeObj("hcPointTree");
                    var nodes = treeObj.getCheckedNodes(true);
                    var nodeNamelist = [];

                    for (var i = 0; i < nodes.length; i++) {
                        if (!nodes[i].isParent) {
                            nodeNamelist.push(nodes[i].name);
                        }
                    }

                    for (var prop in _this.historyData.data) {
                        if ($.inArray(prop, nodeNamelist) === -1) {
                            delete _this.historyData.data[prop];
                        }
                    }

                    _this.refreshData();
                } catch (e) {
                    console.error(e);
                }
            }).fail(function () {
                alert(I18n.resource.observer.widgets.HISTORY_CURVE_FAILED);
            }).always(function () {
                Spinner.stop();
            });
        },

        renderFilter: function () {
            $('#curveDateStart').val(this.startDate.format("yyyy-MM-dd HH:mm:00"));
            $('#curveDateEnd').val(this.endDate.format("yyyy-MM-dd HH:mm:00"));
            $('#intervalType').val(this.format);
        },

        refreshDateTimePicker: function () {
            $("#curveDateStart").datetimepicker({
                startView: 'month',
                autoclose: true,
                format: 'yyyy-mm-dd hh:ii:00'
            });
            $("#curveDateEnd").datetimepicker({
                startView: 'month',
                autoclose: true,
                format: 'yyyy-mm-dd hh:ii:00'
            });
        },

        refreshData: function () {
            var legends = [], series = [];
            var $tableOperatingRecord = $('#tableOperatingRecord');
            if (!this.historyData || !this.historyData.data) {
                $tableOperatingRecord.empty();
                return;
            } else {
                var pointIndex = 0;
                var len = echarts.config.color.length;
                for (var pointName in this.historyData.data) {
                    if (this.historyData.data.hasOwnProperty(pointName)) {
                        var color = echarts.config.color[pointIndex % len];
                        if ($.inArray(pointName, this.hidePointList) === -1) {
                            var treeNode = this.zTreeInstance.getNodeByParam('name', pointName, null);
                            $('#' + treeNode.tId + '_span').css('color', color);
                        }
                        pointIndex++;
                        legends.push(pointName);
                        series.push({
                            name: pointName,
                            type: 'line',
                            data: this.historyData.data[pointName],
                            markPoint: {
                                data: [
                                    {type: 'max', name: I18n.resource.observer.widgets.MAXIMUM},
                                    {type: 'min', name: I18n.resource.observer.widgets.MINIMUM}
                                ]
                            }
                        });
                    }
                }
            }

            var legends_handled = [];

            for (var l = 0, l_length = legends.length; l < l_length; l++) {
                legends_handled.push(legends[l]);
                if ((l + 1) % 3 === 0) {
                    legends_handled.push('');
                }
            }

            var hidePointListMap = {};
            for (var i = 0; i < this.hidePointList.length; i++) {
                var key = this.hidePointList[i];
                hidePointListMap[key] = false;
            }
            var option = {
                title: {
                    text: I18n.resource.dataManage.HISTORY_CURVE,
                    x: 'left'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    }
                },
                legend: {
                    //data: legends_handled,
                    x: 'center',
                    selected: hidePointListMap
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true, title: "mark"},
                        dataZoom: {
                            show: true, readOnly: false, title: {
                                zoom: "zoom",
                                back: "back"
                            }
                        },
                        dataView: {
                            show: true,
                            readOnly: false,
                            title: I18n.resource.echarts.DATAVIEW,
                            lang: [I18n.resource.echarts.DATAVIEW, I18n.resource.echarts.CLOSE, I18n.resource.echarts.REFRESH]
                        },
                        restore: {show: true, title: "restore"},
                        saveAsImage: {show: true, title: "saveAsImage"}
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        type: 'slider',
                        textStyle: {color: '#fff'}
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        data: this.historyData.timeStamp
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true
                    }
                ],
                grid: {
                    containLabel: true
                },

                series: series
            };
            $tableOperatingRecord.css('width', ($tableOperatingRecord.parent().width() * 0.83).toFixed(1) + 'px');
            this.historyChart = echarts.init($tableOperatingRecord.get(0), AppConfig.chartTheme);
            this.historyChart.setOption(option);
        },
        optionToContent: function (opt) {
            //图例切换为数据视图
            var axisData = opt.xAxis && opt.xAxis[0].data,
                series = opt.series;
            //var title = '<p style=" text-align: center; font-size: 15px;font-weight: bold;">' + opt.title.text + '</p>';
            var html = '<div class="historyDataTable"><table  class="table table-bordered table-hover table-striped" style="-webkit-user-select: initial;  width: 80%;margin: 0 auto;"><tbody>';
            //var html = title + '<table  class="table table-bordered table-hover table-striped" style="-webkit-user-select: initial;  width: 80%;margin: 0 auto;"><tbody>';

            if (BEOPUtil.isUndefined(axisData)) {
                //table header
                html += '<tr>';
                for (var i = 0, l = series.length; i < l; i++) {
                    html += '<td colspan="2">' + series[i].name + '</td>';
                }
                html += '</tr>';
                var longestSeriesData = [], longestLength = 0;
                for (var j = 0, sl = series.length; j < sl; j++) {
                    if (series[j].data.length > longestLength) {
                        longestSeriesData = series[j].data;
                        longestLength = longestSeriesData.length;
                    }
                }

                for (var i = 0, il = longestSeriesData.length; i < il; i++) {
                    html += '<tr>';
                    for (var m = 0, ml = series.length; m < ml; m++) {
                        if (!BEOPUtil.isUndefined(series[m].data[i])) {
                            for (var n = 0, nl = series[m].data[i].length; n < nl; n++) {
                                html += '<td>' + series[m].data[i][n] + '</td>';
                            }
                        }
                    }

                    html += '</tr>';
                }
            } else {
                //table header
                html += '<tr><td>' + opt.xAxis[0].name + '</td>';
                for (var i = 0, l = series.length; i < l; i++) {
                    html += '<td>' + series[i].name + '</td>';
                }
                html += '</tr>';
                //table content
                for (var i = 0, l = axisData.length; i < l; i++) {
                    html += '<tr>' + '<td>' + axisData[i] + '</td>';

                    for (var j = 0, sl = series.length; j < sl; j++) {
                        html += '<td>' + series[j].data[i] + '</td>';
                    }

                    html += '</tr>';
                }
            }

            html += '</tbody></table></div>';
            return html;
        }
    };

    return HistoryChart;
})();

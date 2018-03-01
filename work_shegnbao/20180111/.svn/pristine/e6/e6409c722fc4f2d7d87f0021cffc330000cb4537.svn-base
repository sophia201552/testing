/// <reference path="../../lib/jquery-2.1.4.min.js" />
/// <reference path="../../core/common.js" />

var HistoryChart = (function () {
    function HistoryChart(obj) {
        this.startDate = obj.startDate;
        this.endDate = obj.endDate;
        this.projectId = obj.projectId;
        this.pointList = obj.pointList || [];
        this.hidePointList = obj.hidePointList || [];
        this.hidePointListCopy = $.extend(true, [], obj.hidePointList);
        this.format = obj.format;
        this.$dialogContent = $("#dialogContent");
        this.historyChart = null;
        this.isShowRepairData = obj.isShowRepairData;
        this.repareDataKey = null;
        this.treeList = [];
        this.isShowTable = obj.isShowTable;
        this.structure_list = obj.structure_list;
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
            this.hidePaddingData = $("#isHideCompleteData").is(":checked");
            localStorage.setItem('hidePaddingData', this.hidePaddingData);
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
                if (_this.isShowTable) {
                    $('#tableOperatingRecord').addClass('historyTable');
                }
                I18n.fillArea(_this.$dialogContent);
                if (localStorage.getItem('hidePaddingData')) {
                    _this.hidePaddingData = localStorage.getItem('hidePaddingData') == 'true';
                    $("#isHideCompleteData").prop('checked', _this.hidePaddingData);
                }
                _this.refreshDateTimePicker();
                _this.renderFilter();
                _this.attachEvent();
                _this.fetchData();
            });
        },
        getNotHidePoint: function () {
            var _this = this;
            this.pointTreeList.filter(function (n) {
                return _this.hidePointList.indexOf(n) == -1;
            });

        },

        attachEvent: function () {
            var _this = this;
            var $curveDateStart = $("#curveDateStart"),
                $curveDateEnd = $("#curveDateEnd"),
                $intervalType = $("#intervalType");
            _this.timeFormatMap = {
                startView: 'month',
                autoclose: true,
                minView: 'hour',
                format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC),
                forceParse: false
            };
            //根据下拉菜单修改日历视图格式
            $intervalType.change(function () {
                var formatRule = $intervalType.val();
                $curveDateStart.datetimepicker('remove');
                $curveDateEnd.datetimepicker('remove');
                switch (formatRule) {
                    case 'm1':
                        _this.timeFormatMap.minView = 'hour';
                        _this.timeFormatMap.format = timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC);
                        break;
                    case 'm5':
                        _this.timeFormatMap.minView = 'hour';
                        _this.timeFormatMap.format = timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC);
                        break;
                    case 'h1':
                        _this.timeFormatMap.minView = 'day';
                        _this.timeFormatMap.format = timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_HH_00);
                        break;
                    case 'd1':
                        _this.timeFormatMap.minView = 'month';
                        _this.timeFormatMap.format = timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_00_00);
                }
                $curveDateStart.datetimepicker(_this.timeFormatMap);
                $curveDateEnd.datetimepicker(_this.timeFormatMap);
            });

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

                if (new Date(endTime) < new Date(startTime)) {
                    alert(I18n.resource.common.TIME_COMPARE);
                    return;
                }

                _this.startDate = startTime;
                _this.endDate = endTime;
                _this.format = format;
                _this.fetchData();
            }).off('click.time-group').on('click.time-group', '.time-group', function () {
                $(this).find('.time').focus();
            }).off('click.isHideCompleteData').on('click.isHideCompleteData', '#isHideCompleteData', function () {
                _this.hidePaddingData = $("#isHideCompleteData").is(":checked");
                _this.refreshData();
            }).off('click.chartReset').on('click.chartReset', '#chartReset', function () {
                $("#chartMin").val('');
                $("#chartMax").val('');
            }).off('click.chartConfirm').on('click.chartConfirm', '#chartConfirm', function () {
                var minVal = $("#chartMin").val().trim(),
                    MaxVal = $("#chartMax").val().trim();
                minVal = (minVal == '') ? '' : Number(minVal);
                MaxVal = (MaxVal == '') ? '' : Number(MaxVal);
                if ((minVal === '' && MaxVal !== "") || (minVal !== '' && MaxVal === "")) { // 不填写完整,再隐藏曲线的时候会有bug
                    alert(I18n.resource.historyChart.MIN_MAX_REQUIRED);
                    return;
                }
                if (minVal !== '' && MaxVal !== '' && minVal == MaxVal) {
                    alert(I18n.resource.historyChart.MIN_MAX_NOT_EQUAL);
                    return;
                }
                if (minVal !== '' && MaxVal !== '' && minVal > MaxVal) {
                    alert(I18n.resource.historyChart.MIN_MAX_INFO1);
                    return;
                }
                _this.refreshData();
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
                _this.endDate = new Date().format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE);
                $curveDateStart.val(timeFormat(_this.startDate, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC)));
                $curveDateEnd.val(timeFormat(_this.endDate, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC)));
                $intervalType.val(_this.format);
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
                    $.ajax({
                        url: beop.dm.constants.EXPERT_SERVICE_URL + 'repairData/batch',
                        type: "POST",
                        data: {
                            'list': JSON.stringify(_this.pointTreeList),
                            'timeFrom': new Date(start).format('yyyy-MM-dd HH:mm:00'),
                            'timeTo': new Date(end).format('yyyy-MM-dd HH:mm:00'),
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
                                    url: beop.dm.constants.EXPERT_SERVICE_URL + "repairData/status/" + AppConfig.projectId,
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
                })
            });

            $('.collapse-content').on('hide.bs.collapse', function () {
                $(this).closest('.collapse-box').find('.collapse-icon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
            }).on('show.bs.collapse', function () {
                $(this).closest('.collapse-box').find('.collapse-icon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
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
            this.treeList = [];
            for (var i = 0; i < this.pointTreeList.length; i++) {
                var data = this.pointTreeList[i];
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
                return new Date(date.getTime() - 60 * 60 * 1000).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE);
            } else if (dateType === 'today') {
                return date.format(DateUtil.DATA_FORMAT.FULL_DATETIME_ALL_SEC_CHANGE);
            } else if (dateType === 'week') {
                var getDay = date.getDay() == 0 ? 7 : date.getDay(); // 周日 date.getDay() 为 0
                return new Date(date - (getDay - 1) * 86400000).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ALL_SEC_CHANGE);
            } else if (dateType === 'month') {
                return new Date(date.getFullYear(), date.getMonth(), 1).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ALL_SEC_CHANGE);
            }
        },

        _convertData: function (data, sortStr) {
            if (!data || !data.length) {
                data = [];
            }
            var newData = {
                data: {},
                timeStamp: []
            };

            for (var i = 0; i < data.length; i++) {
                var history = data[i].history;
                if (sortStr == 'desc') {
                    if (this.hidePaddingData) {
                        history.forEach(function (item) {
                            item.value = item.error ? '' : item.value;
                        });
                    }
                    history = history.reverse();
                }
                newData.data[data[i].name] = history.map(function (point) {
                    return {
                        value: point.value,
                        padding: point.error
                    };
                });
                newData.timeStamp = history.map(function (point) {
                    return point.time;
                });
            }
            return newData;
        },

        fetchData: function () {
            Spinner.spin($("#dialogModal").get(0));
            var _this = this;
            WebAPI.post("/get_history_data_padded", {
                projectId: _this.projectId,
                pointList: this.pointList.concat(_this.hidePointListCopy),
                timeStart: new Date(this.startDate).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE),
                timeEnd: new Date(this.endDate).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE),
                timeFormat: this.format ? this.format : 'm5',
                prop: this.structure_list
            }).done(function (data) {
                //查询历史 成功后 才会记录选择的时间
                _this.startDate && localStorage.setItem('dataManagerStartDate', new Date(_this.startDate).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE));
                _this.endDate && localStorage.setItem('dataManagerEndDate', new Date(_this.endDate).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE));
                _this.format && localStorage.setItem('dataManagerFormat', _this.format);
                _this.historyDataArr = data;
                var unitedData = _this.isShowTable ? _this._convertData($.extend(true, [], _this.historyDataArr), 'desc') : _this._convertData(data);

                _this.pointTreeList = [];
                if (unitedData.data) {
                    _this.pointTreeList = Object.keys(unitedData.data);
                } else {
                    _this.pointTreeList = _this.pointList.concat(_this.hidePointList);
                }
                _this.loadTree();
                try {
                    _this.allData = unitedData;
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
                } catch (e) {
                    console.error(e);
                }
                _this.refreshData();
            }).fail(function (e) {
                alert(I18n.resource.observer.widgets.HISTORY_CURVE_FAILED);
            }).always(function () {
                Spinner.stop();
            });
        },

        renderFilter: function () {
            $('#curveDateStart').val(timeFormat(this.startDate, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC)));
            $('#curveDateEnd').val(timeFormat(this.endDate, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC)));
            $('#intervalType').val(this.format);
        },

        refreshDateTimePicker: function () {
            $("#curveDateStart").datetimepicker({
                startView: 'month',
                autoclose: true,
                format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC),
                forceParse: false
            });
            $("#curveDateEnd").datetimepicker({
                startView: 'month',
                autoclose: true,
                format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC),
                forceParse: false
            });
        },

        showMorePointValue: function (tr, data) {
            var _this = this;
            var prettyValue = JSON.parse(data.name).value ? JSON.parse(data.name).value : null;
            if (prettyValue && prettyValue.indexOf('{') != -1) {
                try {
                    eval('prettyValue = ' + prettyValue);
                    prettyValue = JSON.stringify(prettyValue, null, 4);
                } catch (e) {
                    prettyValue = data.pointValue;
                }
            }
            alert('<pre style="border:none; background-color: #ffffff;">' + StringUtil.htmlEscape(prettyValue) + '</pre>', {
                    icon: false,
                    title: data.value,
                    buttons: {
                        cancel: {
                            i18n: 'common.CANCEL',
                            class: 'alert-button',
                            callback: ''
                        },
                        ok: {
                            i18n: 'common.COPY',
                            css: 'btn-success',
                            callback: function () {
                                BEOPUtil.copyToClipboard(prettyValue, $('#dialogModal')[0]);
                                alert.success(I18n.resource.common.COPY_SUCCESS);
                            }
                        }
                    },
                    hasResize: true
                }
            );
            _this.tableCopyBoxStyle();
        },
        //  table  copy  弹出框 根据显示内容适应
        tableCopyBoxStyle: function () {
            var $infoBox = $(".infoBox").css({
                "width": "auto",
                "min-width": "400px",
                "max-width": "1600px"
            });
            $(".infoBox-body").css({"height": "auto", "max-height": "360px"});
            $('.infoBox-msg').css("width", "auto");
            $infoBox.css({"position": "absolute", "left": "50%", "margin-left": -1 / 2 * $infoBox.width() + "px"});
        },

        refreshTable: function ($container) {
            var _this = this;
            var historyData = $.extend(true, [], _this.historyDataArr);
            var showData = _this._convertData(historyData, 'desc');
            var tableData = [];
            var now = new Date();
            for (let i = 0, iLen = showData.timeStamp.length; i < iLen; i++) {
                var name = showData.data[Object.keys(showData.data)[0]][i];
                if (name instanceof Object) {
                    name = JSON.stringify(name);
                }
                tableData.push({
                    time: showData.timeStamp[i],
                    name: new Date(showData.timeStamp[i]) > now ? '' : name
                })
            }
            var dataTableOptions = {
                data: tableData,
                onBeforeRender: function () {
                    Spinner.spin(document.body);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                isSearch: false,
                colNames: [I18n.resource.historyChart.TIME, I18n.resource.historyChart.NAME],
                colModel: [
                    {index: 'time'},
                    {
                        index: 'name', copy: true,
                        converter: function (value) {
                            return JSON.parse(value).value ? JSON.parse(value).value : null;
                        }
                    }
                ],
                onShowMore: function (tr, data, e) {
                    _this.showMorePointValue(tr, data);
                    e.stopPropagation();
                },
                rowsNums: [200, 500]
            };
            $container.simpleDataTable(dataTableOptions);
        },

        refreshChart: function ($container) {
            var _this = this;
            var pointIndex = 0, len = echarts.config.color.length;
            var arrXAxis = [], legends = [], series = [];
            var dataIndex = false;
            var yAxisMap = {type: 'value', scale: true};
            var minVal = $("#chartMin").val().trim(),
                MaxVal = $("#chartMax").val().trim();
            if (!this.historyData || !this.historyData.data || $.isEmptyObject(this.historyData.data)) {
                $container.empty();
                return;
            }
            if (minVal != '') {
                yAxisMap.min = minVal;
            } else {
                delete yAxisMap.min;
            }
            if (MaxVal != '') {
                yAxisMap.max = MaxVal;
            } else {
                delete yAxisMap.max;
            }
            //y轴最小间距为1
            yAxisMap.minInterval=1; 
            if (this.historyData && this.historyData.timeStamp.length) {
                this.historyData.timeStamp.forEach(function (item, index) {
                    /*if (!dataIndex && (new Date(item) > new Date())) {
                     dataIndex = index;
                     }*/
                    item = item ? timeFormat(item, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC)) : item;
                    arrXAxis.push(item);
                })
            }
            for (var pointName in this.historyData.data) {
                if (this.historyData.data.hasOwnProperty(pointName)) {
                    var color = echarts.config.color[pointIndex % len], seriesData = [];
                    if ($.inArray(pointName, this.hidePointList) === -1) {
                        var treeNode = this.zTreeInstance.getNodeByParam('name', pointName, null);
                        $('#' + treeNode.tId + '_span').css('color', color);
                    }
                    if (dataIndex) {
                        seriesData = this.historyData.data[pointName].slice(0, dataIndex);
                        for (var d = dataIndex; d < this.historyData.data[pointName].length; d++) {
                            seriesData.push('');
                        }
                    } else {
                        seriesData = this.historyData.data[pointName];
                    }
                    pointIndex++;
                    legends.push(pointName);
                    series.push({
                        name: pointName,
                        type: 'line',
                        data: seriesData.map(function (item) {
                            if (_this.hidePaddingData) {
                                return item.padding ? '' : item.value;
                            }
                            if ($.isNumeric(item.value)) {
                                if (BEOPUtil.precision(item.value) > 20) {
                                    item.value = Number(item.value.toFixed(20));
                                }
                            }
                            return item.value;
                        }),
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    name: I18n.resource.observer.widgets.MAXIMUM,
                                    label: {
                                        normal: {
                                            textStyle: {
                                                color: '#333'
                                            }
                                        }
                                    }
                                },
                                {
                                    type: 'min',
                                    name: I18n.resource.observer.widgets.MINIMUM,
                                    label: {
                                        normal: {
                                            textStyle: {
                                                color: '#333'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    });
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
                        textStyle: {color: '#000'},
                        handleStyle: {
                            borderColor: '#0078dc'
                        }
                    }
                ],
                formatTime: false, // 当前数据不进行数据格式化
                xAxis: [
                    {
                        type: 'category',
                        data: arrXAxis
                    }
                ],
                yAxis: [yAxisMap],
                grid: {
                    containLabel: true
                },

                series: series
            };
            $container.css('width', ($container.parent().width() * 0.83).toFixed(1) + 'px');
            this.historyChart = echarts.init($container.get(0), AppConfig.chartTheme);
            this.historyChart.setOption(option);
        },


        refreshData: function () {
            var $container = $('#tableOperatingRecord');
            if (this.isShowTable) {
                //历史曲线如果点值为字符串类型, 不显示echarts, 显示Table格式
                this.refreshTable($container);
            } else {
                this.refreshChart($container);
            }
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

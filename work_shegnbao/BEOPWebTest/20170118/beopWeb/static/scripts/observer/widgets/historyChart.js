/// <reference path="../../lib/jquery-2.1.4.min.js" />
/// <reference path="../../core/common.js" />

var HistoryChart = (function () {
    function HistoryChart(obj) {
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
                if (_this.isShowTable) {
                    $('#tableOperatingRecord').addClass('historyTable');
                }
                I18n.fillArea(_this.$dialogContent);
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
                if (new Date(endTime) > new Date()) {
                    alert(I18n.resource.debugTools.exportData.END_TIME_THAN_NOW_TIME);
                    return;
                }

                _this.startDate = startTime;
                _this.endDate = endTime;
                _this.format = format;
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
                    _this.ExpertContainerUrlPromise.done(function (result) {
                        if (result.success) {
                            $.ajax({
                                url: result.data + 'repairData/batch',
                                type: "POST",
                                data: {
                                    'list': JSON.stringify(_this.pointTreeList),
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

        fetchData: function () {
            var _this = this;
            var url = this.isShowTable ? "/get_history_data_padded" : "/get_history_data_padded_reduce";
            Spinner.spin(this.$dialogContent.get(0));
            var UnitiedData = {};
            WebAPI.post(url, {
                projectId: _this.projectId,
                pointList: this.pointList.concat(_this.hidePointList),
                timeStart: new Date(this.startDate).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE),
                timeEnd: new Date(this.endDate).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE),
                timeFormat: this.format ? this.format : 'm5',
                prop: this.structure_list
            }).done(function (data) {
                if (!data || data == {}) {
                    data = [];
                }
                //查询历史 成功后 才会记录选择的时间
                _this.startDate && localStorage.setItem('dataManagerStartDate', new Date(_this.startDate).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE));
                _this.endDate && localStorage.setItem('dataManagerEndDate', new Date(_this.endDate).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE));
                _this.format && localStorage.setItem('dataManagerFormat', _this.format);
                if (_this.isShowTable) {
                    UnitiedData.data = {};
                    var i = data.length - 1;
                    while (i >= 0) {
                        var valueArr = [];
                        var timeArr = [];
                        if (data[i].history && data[i].history.length) {
                            var j = data[i].history.length - 1;
                            while (j >= 0) {
                                valueArr.push(data[i].history[j].value);
                                timeArr.push(data[i].history[j].time);
                                j--;
                            }
                        }
                        UnitiedData.data[data[i].name] = valueArr;
                        UnitiedData.timeStamp = timeArr;
                        i--;
                    }
                } else {
                    UnitiedData = data;
                }
                _this.pointTreeList = [];
                if (UnitiedData.data) {
                    for (var key in UnitiedData.data) {
                        _this.pointTreeList.push(key);
                    }
                } else {
                    for (var key in _this.pointList.concat(_this.hidePointList)) {
                        _this.pointTreeList.push(_this.pointList.concat(_this.hidePointList)[key]);
                    }
                }

                _this.loadTree();
                try {
                    _this.allData = UnitiedData;
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
            var _this = this, prettyValue = data.name;
            if (prettyValue && prettyValue.indexOf('{') != -1) {
                try {
                    eval('prettyValue = ' + prettyValue);
                    prettyValue = JSON.stringify(prettyValue, null, 4);
                } catch (e) {
                    prettyValue = data.pointValue;
                }
            }
            alert('<pre style="border:none;">' + StringUtil.htmlEscape(prettyValue) + '</pre>', {
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
                                BEOPUtil.copyToClipboard(prettyValue,$('#dialogModal')[0]);
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
            $(".infoBox").css({
                "width": "auto",
                "min-width": "400px",
                "max-width": "1600px"
            });
            $(".infoBox-body").css({"height": "auto", "max-height": "360px"});
            $('.infoBox-msg').css("width", "auto");
            var infoBoxWidth = -1 / 2 * $(".infoBox").width() + "px";
            $(".infoBox").css({"position": "absolute", "left": "50%", "margin-left": infoBoxWidth});
        },


        refreshData: function () {
            var _this = this, legends = [], series = [];
            var $tableOperatingRecord = $('#tableOperatingRecord');
            if (!this.historyData || !this.historyData.data || $.isEmptyObject(this.historyData.data)) {
                $tableOperatingRecord.empty();
                return;
            }
            if (this.isShowTable) {
                //历史曲线如果点值为字符串类型, 不显示echarts,显示Table格式
                var tableData = [];
                for (var i = 0, iLen = this.allData.timeStamp.length; i < iLen; i++) {
                    var name = this.allData.data[Object.keys(this.allData.data)[0]][i];
                    if (name instanceof Object) {
                        name = JSON.stringify(name)
                    }
                    tableData.push({
                        "time": this.allData.timeStamp[i],
                        "name": name
                    });
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
                    colNames: ['时间', '名称'],
                    colModel: [
                        {index: 'time'},
                        {index: 'name', copy: true}
                    ],
                    onShowMore: function (tr, data, e) {
                        _this.showMorePointValue(tr, data);
                        e.stopPropagation();
                    },
                    rowsNums: [200, 500]
                };
                $tableOperatingRecord.simpleDataTable(dataTableOptions);
                return;
            } else {
                var pointIndex = 0;
                var len = echarts.config.color.length;
                var arrXAxis = [];
                if (this.historyData && this.historyData.timeStamp.length) {
                    this.historyData.timeStamp.forEach(function (item) {
                        item = item ? timeFormat(item, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC)) : item;
                        arrXAxis.push(item);
                    })
                }
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
                formatTime: false, // 当前数据不进行数据格式化
                xAxis: [
                    {
                        type: 'category',
                        data: arrXAxis
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

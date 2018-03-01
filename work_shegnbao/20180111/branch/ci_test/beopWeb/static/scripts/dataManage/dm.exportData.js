var PointManagerExportData = (function () {
    var _this;

    function PointManagerExportData(projectId) {
        PointManager.call(this, projectId);
        _this = this;
        this.htmlUrl = '/static/scripts/dataManage/views/dm.exportData.html';
        this.pageSize = 20;
        this.currentPage = 1;
        this.timeFormatMap = {};
        this.exportDataTimer = null;
        this.configMap = {
            cloudPointType: {
                MAPPING_POINT: 0,
                VIRTUAL_POINT: 1,
                CALC_POINT: 2
            }
        };
        this.data = {
            'projId': AppConfig.projectId,
            'startTime': '',
            'endTime': '',
            'format': ''
        };
        _this.recordList = [];
    }

    PointManagerExportData.prototype = Object.create(PointManager.prototype);
    PointManagerExportData.prototype.constructor = PointManagerExportData;

    var PointManagerExportDataFunc = {
        show: function () {
            var _this = this;
            this.init().done(function () {
                _this.attachEvents();
                _this.loadSheet();
                I18n.fillArea($(ElScreenContainer));
            });
        },
        close: function () {
            _this.exportDataTimer && clearInterval(_this.exportDataTimer);
            this.detachEvents();
        },

        attachEvents: function () {
            var _this = this;
            var $exportDataBox = $("#exportDataBox");
            var $batchHistoryTimeStart = $("#batchHistoryTimeStart");
            var $batchHistoryTimeEnd = $("#batchHistoryTimeEnd");
            var $point_format = $("#point_format");
            _this.timeFormatMap = {
                startView: 'month',
                autoclose: true,
                minView: 'hour',
                format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC),
                forceParse: false
            };

            $('#exportDataList').on('hidden.bs.modal', function (e) {
                _this.exportDataTimer && clearInterval(_this.exportDataTimer);
            });

            //根据下拉菜单修改日历视图格式
            $point_format.change(function () {
                _this.data.format = $point_format.val();
                $batchHistoryTimeStart.val('');
                $batchHistoryTimeEnd.val('');
                $batchHistoryTimeStart.datetimepicker('remove');
                $batchHistoryTimeEnd.datetimepicker('remove');
                if (_this.data.format == 'm5') {
                    _this.timeFormatMap.minView = 'hour';
                    _this.timeFormatMap.format = timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC);
                } else if (_this.data.format == 'h1') {
                    _this.timeFormatMap.minView = 'day';
                    _this.timeFormatMap.format = timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_HH_00);
                } else if (_this.data.format == 'd1') {
                    _this.timeFormatMap.minView = 'month';
                    _this.timeFormatMap.format = timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_00_00);
                }
                $batchHistoryTimeStart.datetimepicker(_this.timeFormatMap);
                $batchHistoryTimeEnd.datetimepicker(_this.timeFormatMap);
            });
            $batchHistoryTimeStart.datetimepicker(_this.timeFormatMap);
            $batchHistoryTimeEnd.datetimepicker(_this.timeFormatMap);

            //点击导出
            $exportDataBox.off('click.exportData').on('click.exportData', '#exportData', function () {
                var startTime = $batchHistoryTimeStart.val().trim();
                var endTime = $batchHistoryTimeEnd.val().trim();
                if (!startTime) {
                    alert(I18n.resource.debugTools.exportData.START_TIME_IS_NEEDED);
                    return;
                }
                if (!endTime) {
                    alert(I18n.resource.debugTools.exportData.END_TIME_CANNOT_NEEDED);
                    return;
                }
                if (startTime && endTime) {
                    if (new Date(endTime) > new Date()) {
                        alert(I18n.resource.debugTools.exportData.END_TIME_THAN_NOW_TIME);
                        return;
                    } else if (new Date(startTime) > new Date(endTime)) {
                        alert(I18n.resource.debugTools.exportData.START_TIME_THAN_END_TIME);
                        return;
                    }
                }
                _this.data.format = $point_format.val();
                _this.data.userId = AppConfig.userId;
                _this.data.startTime = timeFormat(startTime, DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC);
                _this.data.endTime = timeFormat(endTime, DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC);

                //判断勾选的导出类型;
                var isChecked = $('[name=changePoint]:checked');
                if (isChecked && isChecked.length) {
                    _this.data.flag = parseInt(isChecked.val());
                    var valueList = _this.$datatable.simpleDataTable('getCheckedRows');
                    if (valueList.length) {
                        var values = [];
                        for (var i = 0; i < valueList.length; i++) {
                            values.push(valueList[i].value);
                        }
                        _this.data.points = JSON.stringify(values);
                    }
                }
                var pointType = '';
                if (valueList && valueList.length) {
                    pointType = I18n.resource.debugTools.exportData.CUSTOM;
                } else {
                    switch (_this.data.flag) {
                        case -1:
                            pointType = I18n.resource.debugTools.exportData.ALL_POINTS;
                            break;
                        case 0:
                            pointType = I18n.resource.dataManage.MAPPING_POINT;
                            break;
                        case 1:
                            pointType = I18n.resource.dataManage.VIRTUAL_POINT;
                            break;
                        case 2:
                            pointType = I18n.resource.dataManage.CALCULATION_POINT;
                            break;
                    }
                }
                confirm(I18n.resource.debugTools.exportData.IS_EXPORT_DATA_ALARM.format(startTime, endTime, pointType), function () {
                    Spinner.spin(document.body);
                    $.ajax({
                        url: beop.dm.constants.EXPERT_SERVICE_URL + 'dataManage/exportData/task/new',
                        type: "POST",
                        data: _this.data
                    }).done(function (result) {
                        if (!result.error) {
                            _this.searchExportList();
                            if (_this.data && _this.data.points) {
                                delete _this.data.points;
                            }
                        } else {
                            alert(result.msg);
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                });
            });

            // 清除全部
            $exportDataBox.off('click.exportClear').on('click.exportClear', '#exportClear', function () {
                confirm(I18n.resource.debugTools.exportData.IS_CLEAR_ALL_EXPORT_RECORDS, function () {
                    Spinner.spin(document.body);
                    $.ajax({
                        url: beop.dm.constants.EXPERT_SERVICE_URL + 'dataManage/exportData/task/clear',
                        type: "POST",
                        data: {
                            projId: parseInt(AppConfig.projectId)/*,
                             force: 1    // 强制删除进行中和完成的记录*/
                        }
                    }).done(function (result) {
                        if (result.success) {
                            alert(I18n.resource.debugTools.exportData.CLEAR_ALL_RECORDS_SUCCESSFULLY);
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                });
            });

            // 删除某一条记录
            $exportDataBox.off('click.record-delete').on('click.record-delete', '.record-delete', function () {
                var $this = $(this),
                    $tr = $this.closest('tr');
                Spinner.spin(document.body);
                $.ajax({
                    url: beop.dm.constants.EXPERT_SERVICE_URL + 'dataManage/exportData/task/clear',
                    type: "POST",
                    data: {
                        projId: parseInt(AppConfig.projectId),
                        taskId: $tr.attr('taskId')
                    }
                }).done(function (result) {
                    if (result.success) {
                        //$tr.remove();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });

            // 停止导出任务
            $exportDataBox.off('click.record-stop').on('click.record-stop', '.record-stop', function () {
                var $tr = $(this).closest('tr');
                Spinner.spin(document.body);
                $.ajax({
                    url: beop.dm.constants.EXPERT_SERVICE_URL + 'dataManage/exportData/task/stop',
                    type: "POST",
                    data: {
                        taskId: $tr.attr('taskId'),
                        force: true
                    }
                }).done(function (result) {
                    if (result.success) {
                        //$tr.remove();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });

            // 查看列表
            $exportDataBox.off('click.exportList').on('click.exportList', '#exportList', function () {
                _this.searchExportList();
            });
        },

        searchExportList: function () {
            Spinner.spin(document.body);
            $("#exportDataListTBody").empty();
            _this.exportDataTimer && clearInterval(_this.exportDataTimer);
            $("#exportDataList").modal().on('shown.bs.modal', function () {
                Spinner.spin(document.body);
            });

            _this.exportDataTimer = setInterval(function () {
                _this.refreshExportTasks();
            }, 3000);
        },

        refreshExportTasks: function () {
            $.ajax({
                url: beop.dm.constants.EXPERT_SERVICE_URL + 'dataManage/exportData/tasks',
                type: "POST",
                data: {
                    projId: parseInt(AppConfig.projectId)
                }
            }).done(function (result) {
                if (result) {
                    _this.recordList = result;
                    var $exportDataListTBody = $("#exportDataListTBody");
                    $exportDataListTBody.html(beopTmpl('tpl_exportData_List', {
                        list: result,
                        url: beop.dm.constants.EXPERT_SERVICE_URL.substr(0, beop.dm.constants.EXPERT_SERVICE_URL.length - 1)
                    }));
                    I18n.fillArea($exportDataListTBody);
                }
            }).fail(function () {
                _this.exportDataTimer && clearInterval(_this.exportDataTimer);
            }).always(function () {
                Spinner.stop();
            });
        },

        //加载
        loadSheet: function () {
            var $table = $("#exportData_list_table");
            var pageSizeIndex,
                $pageSizeSelect = $table.find(".pageSizeSelect");
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }
            var $radio = $('#exportDataBox').find('.changePointType [type=radio]');

            var dataTableOptions = {
                url: '/point_tool/getCloudPointTable/',
                post: WebAPI.post,
                postData: {
                    projectId: AppConfig.projectId,
                    searchText: '',
                    t_time: '',
                    pageSize: _this.pageSize, // 一页多少个
                    currentPage: _this.currentPage // 当前第几页
                },
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'currentPage'
                },
                searchInput: $("#exportData_Search"),
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                filters: [
                    {
                        param: 'pointType',
                        element: $radio,
                        event: 'click',
                        type: 'radio',
                        converter: function (val) {
                            if (parseInt(val) === -1) {
                                return undefined;
                            }
                            return parseInt(val);
                        }
                    }
                ],
                dataFilter: function (result) {
                    if (result.success) {
                        return result.data.pointTable;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($("#exportDataBox")[0]);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                totalNumIndex: 'data.pointTotal',
                colNames: [
                    //I18n.resource.debugTools.exportData.SELECT,
                    'checkbox',
                    I18n.resource.debugTools.exportData.CONFIGURATION_POINT,
                    I18n.resource.debugTools.exportData.REMARK,
                    I18n.resource.debugTools.exportData.TYPE,
                    I18n.resource.debugTools.exportData.UPDATE_TIME
                ],
                colModel: [
                    //{index: '', checkbox: true, disabled: false, width: '60px'},
                    {index: 'checkbox', isCheckColumn: true, width: '30px'},
                    {index: 'value', width: '200px'},
                    {index: 'alias'},
                    {
                        index: 'params.flag',
                        converter: function (value) {
                            return _this.converterExportDataType(value);
                        }
                    },
                    {
                        index: 'pointTime',
                        converter: function (value) {
                            return value ? timeFormat(value, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC)) : value;
                        },
                        type: 'time'
                    }
                ]
            };
            if (_this.$datatable) {
                _this.$datatable.removeData();
                _this.$datatable = null;
            }
            _this.$datatable = $table.off().simpleDataTable(dataTableOptions);
        },

        converterExportDataType: function (type) {
            if (type == _this.configMap.cloudPointType.MAPPING_POINT) {
                return I18n.resource.dataManage.MAPPING_POINT;
            } else if (type == _this.configMap.cloudPointType.VIRTUAL_POINT) {
                return I18n.resource.dataManage.VIRTUAL_POINT;
            } else if (type == _this.configMap.cloudPointType.CALC_POINT) {
                return I18n.resource.dataManage.CALCULATION_POINT;
            }
        }
    };

    $.extend(PointManagerExportData.prototype, PointManagerExportDataFunc);

    return PointManagerExportData;
})();

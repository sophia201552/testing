var PointManagerExportData = (function () {
    var _this;

    function PointManagerExportData(projectId) {
        PointManager.call(this, projectId);
        _this = this;
        this.htmlUrl = '/static/views/observer/pointManagerExportData.html';
        this.pageSize = 20;
        this.currentPage = 1;
        this.timeFormatMap = {};
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
            'isAll': false,
            'format': ''
        };
        _this.selectPoints = [];

    }

    PointManagerExportData.prototype = Object.create(PointManager.prototype);
    PointManagerExportData.prototype.constructor = PointManagerExportData;

    var PointManagerExportDataFunc = {
        show: function () {
            var _this = this;
            this.init().done(function () {
                _this.expertContainerUrlPromise = $.ajax({
                    url: "/getExpertContainerUrl",
                    type: "GET"
                }).done(function (result) {
                    if (result.success) {
                        _this.ExpertContainerUrl = result.data;
                        //_this.ExpertContainerUrl = 'http://192.168.1.8:4000/';  // 测试用

                        /*   --测试用--   */
                        /*$.ajax({  // 接口ok
                            url: _this.ExpertContainerUrl + 'dataManage/exportData/task/clear',
                            type: "POST",
                            data: {
                                projId: parseInt(AppConfig.projectId)
                            }
                        }).done(function (result) {
                            console.log('clear ok');
                            if (result.success) {
                                //$exportDataBox.find("#exportDataList").modal();
                            }
                        });*/

                        $.ajax({  // 接口 有问题 待调
                            url: _this.ExpertContainerUrl + 'dataManage/exportData/file/delete',
                            type: "POST",
                            data: {
                                projId: parseInt(AppConfig.projectId),
                                fileName: JSON.stringify(['dataExport_1_201611021240_201611021640_m5.zip', 'dataExport_1_201611021220_201611021720_m5.zip', 'dataExport_1_201611021320_201611021720_m5.zip'])
                            }
                        }).done(function (result) {
                            console.log('delete ok');
                            if (result.success) {
                            }
                        });

                        /*   --测试用--   */

                    } else {
                        alert('can\'t connect the ExpertContainer server.');
                    }
                });
                _this.attachEvents();
                _this.loadSheet();
                I18n.fillArea($(ElScreenContainer));
            });
        },
        close: function () {
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
                format: 'yyyy-mm-dd hh:ii'
            };

            //根据下拉菜单修改日历视图格式
            $point_format.change(function () {
                _this.data.format = $point_format.val();
                $batchHistoryTimeStart.val('');
                $batchHistoryTimeEnd.val('');
                $batchHistoryTimeStart.datetimepicker('remove');
                $batchHistoryTimeEnd.datetimepicker('remove');
                if (_this.data.format == 'm5') {
                    _this.timeFormatMap.minView = 'hour';
                    _this.timeFormatMap.format = 'yyyy-mm-dd hh:ii';
                } else if (_this.data.format == 'h1') {
                    _this.timeFormatMap.minView = 'day';
                    _this.timeFormatMap.format = 'yyyy-mm-dd hh:00';
                } else if (_this.data.format == 'd1') {
                    _this.timeFormatMap.minView = 'month';
                    _this.timeFormatMap.format = 'yyyy-mm-dd 00:00';
                }
                $batchHistoryTimeStart.datetimepicker(_this.timeFormatMap);
                $batchHistoryTimeEnd.datetimepicker(_this.timeFormatMap);
            });
            $batchHistoryTimeStart.datetimepicker(_this.timeFormatMap);
            $batchHistoryTimeEnd.datetimepicker(_this.timeFormatMap);

            //点击导出
            $exportDataBox.off('click.exportData').on('click.exportData', '#exportData', function () {
                _this.data.startTime = $batchHistoryTimeStart.val().trim();
                _this.data.endTime = $batchHistoryTimeEnd.val().trim();
                _this.data.format = $point_format.val();
                _this.data.userId = AppConfig.userId;
                if (!_this.data.startTime) {
                    alert('开始时间不可为空.');
                    return;
                }
                if (!_this.data.endTime) {
                    alert('结束时间不可为空.');
                    return;
                }
                if (_this.data.startTime && _this.data.endTime) {
                    if (new Date(_this.data.endTime) > new Date()) {
                        alert('结束时间不能晚于现在的时间');
                        return;
                    } else if (new Date(_this.data.startTime) > new Date(_this.data.endTime)) {
                        alert('开始时间不能晚于结束时间');
                        return;
                    }
                }
                //判断是否勾选全部;
                if ($('#batchAllPoints').is(':checked')) {
                    _this.data.isAll = true;
                    if (_this.data.points) {
                        delete _this.data.points;
                    }
                } else {
                    _this.data.isAll = false;
                    _this.data.points = JSON.stringify(_this.selectPoints);
                }

                Spinner.spin(document.body);
                _this.expertContainerUrlPromise.done(function () {
                    $.ajax({
                        url: _this.ExpertContainerUrl + 'dataManage/exportData/task/new',
                        type: "POST",
                        data: _this.data
                    }).done(function (result) {
                        if (result) {
                            $.ajax({
                                url: _this.ExpertContainerUrl + 'dataManage/exportData/tasks',
                                type: "POST",
                                data: {
                                    projId: parseInt(AppConfig.projectId)
                                }
                            }).done(function (result) {
                                if (result && result.length) {
                                    $("#exportDataListTBody").html(beopTmpl('tpl_exportData_List', {
                                        list: result
                                    }));
                                    $exportDataBox.find("#exportDataList").modal();
                                }
                            });
                        } else {
                            alert('请求失败');
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                });
            });

        },

        //加载
        loadSheet: function () {
            _this.selectPoints = [];
            var $table = $("#exportData_list_table");
            var pageSizeIndex,
                $pageSizeSelect = $table.find(".pageSizeSelect");
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }

            var $batchAllPoints = $("#batchAllPoints");
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
                rowsNums: [5, 25, 50, 100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                filters: [
                    {
                        param: 'status',
                        element: $batchAllPoints,
                        event: 'change',
                        type: 'checkbox'
                    }
                ],
                dataFilter: function (result) {
                    if (result.success) {
                        return result.data.pointTable;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin(document.body);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                totalNumIndex: 'data.pointTotal',
                colNames: [
                    I18n.resource.debugTools.exportData.SELECT,
                    I18n.resource.debugTools.exportData.CONFIGURATION_POINT,
                    I18n.resource.debugTools.exportData.REMARK,
                    I18n.resource.debugTools.exportData.TYPE,
                    I18n.resource.debugTools.exportData.UPDATE_TIME
                ],
                colModel: [
                    {index: '', checkbox: true, disabled: false, width: '60px'},
                    {index: 'value', width: '200px'},
                    {index: 'alias'},
                    {
                        index: 'params.flag',
                        converter: function (data) {
                            return _this.converterExportDataType(data.params.flag);
                        }
                    },
                    {index: 'pointTime'}
                ],
                onCheckboxSelect: function (checkbox, data, e) {
                    if ($(checkbox).is(':checked')) {
                        _this.selectPoints.push(data.value);
                    } else {
                        var index = _this.selectPoints.indexOf(data.value);
                        _this.selectPoints.slice(index, 1);
                    }
                    e.stopPropagation();
                }
            };
            if (_this.$datatable) {
                _this.$datatable.removeData();
                _this.$datatable = null;
            }
            _this.$datatable = $table.off().simpleDataTable(dataTableOptions);
        },

        converterExportDataType: function (type) {
            if (type == _this.configMap.cloudPointType.MAPPING_POINT) {
                return '现场点';
            } else if (type == _this.configMap.cloudPointType.VIRTUAL_POINT) {
                return '虚拟点';
            } else if (type == _this.configMap.cloudPointType.CALC_POINT) {
                return '计算点';
            }
        }
    };

    $.extend(PointManagerExportData.prototype, PointManagerExportDataFunc);

    return PointManagerExportData;
})();

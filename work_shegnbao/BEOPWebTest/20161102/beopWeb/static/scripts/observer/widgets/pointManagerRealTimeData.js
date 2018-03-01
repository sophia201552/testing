var PointManagerRealTimeData = (function () {

    function PointManagerRealTimeData(projectId) {
        PointManager.call(this, projectId);
        this.htmlUrl = '/static/views/observer/pointManagerRealTimeData.html';
        this.i18 = I18n.resource.observer.widgets;
        this.pointInfoList = [];
        this.hasMonitoredNameList = [];
        this.hasMonitoredList = [];
        this.projectId = projectId;
        this.currentPage = 1;
        this.pageSizeKey = 'PointManagerPageSize';
        this.defaultPageSize = 50;
        this.pointDateStartInstance = null;
        this.pointDateEndInstance = null;
        //搜索类型
        this.filterType = {
            'name': 0,
            'value': 1,
            'range': 2,
            'time': 3,
            'explain': 4,
            'define': 5
        };
        this.searchModel = {
            filterType: 0,
            isAdvance: false,
            text: ''
        };
        this.pointType = {
            mapping: 0 || null,
            Algorithm: 1,
            Calculation: 2
        };
    }

    PointManagerRealTimeData.prototype = Object.create(PointManager.prototype);
    PointManagerRealTimeData.prototype.constructor = PointManagerRealTimeData;

    var PointManagerRealTimeDataFunc = {
        show: function () {
            var _this = this;
            this.init().done(function () {
                _this.historyStatusPopover = $('#deleteExpiredData').popover({
                    html: true,
                    placement: 'bottom',
                    content: 'clear time setting', // 必须设置content有值
                    container: $("#realTimeBtnBox"),
                    template: $('#tpl_real_time_popover').html()
                });
                _this.refreshFilter(_this.filterType.name);
                _this.initProjectPointList();
                _this.attachEvents();
                $('#pageSizeSelector').val(_this.getPageSize());
            })
        },
        close: function () {
            this.detachEvents();
        },

        setFilterSort: function (sortId) {

            switch (sortId) {
                case '0':
                {
                    this.searchModel.order = 'pointname asc';
                    break;
                }
                case '1':
                {
                    this.searchModel.order = 'pointname desc';
                    break;
                }
                case '2':
                {
                    this.searchModel.order = 'pointvalue desc';
                    break;
                }
                case '3':
                {
                    this.searchModel.order = 'pointvalue asc';
                    break;
                }
                case '4':
                {
                    this.searchModel.order = 'time desc';
                    break;
                }
                case '5':
                {
                    this.searchModel.order = 'time asc';
                    break;
                }
                default :
                {
                    this.searchModel.order = null;
                }
            }
        },

        setSearchModel: function () {
            this.currentPage = 1;
            var value;
            this.searchModel.isRemark = false;
            if (this.searchModel.filterType == this.filterType.name) {
                value = $('#searchPoint').val().trim();
                this.searchModel.text = value;
            } else if (this.searchModel.filterType == this.filterType.value) {
                value = $('#searchPoint').val().trim();
                if (!value) {
                    this.searchModel.text = '1 = 1';
                } else {
                    this.searchModel.text = 'pointvalue = "' + value + '"';
                }
            } else if (this.searchModel.filterType == this.filterType.range) {
                var filterMin = $('#filterMin').val().trim(), filterMax = $('#filterMax').val().trim();

                if (filterMin === '' && filterMax !== '') {
                    this.searchModel.text = ' pointvalue <= ' + filterMax;
                } else if (filterMin !== '' && filterMax === '') {
                    this.searchModel.text = 'pointvalue >= ' + filterMin;
                } else {
                    this.searchModel.text = 'pointvalue >= ' + filterMin + ' and pointvalue <= ' + filterMax;
                }
                this.searchModel.text += ' and pointvalue REGEXP "^[0-9]+\\.?[0-9]*$" ';
            } else if (this.searchModel.filterType == this.filterType.time) {
                var pointDateStart = $('#pointDateStart').val().trim(), pointDateEnd = $('#pointDateEnd').val().trim();

                if (pointDateStart === '' && pointDateEnd !== '') {
                    this.searchModel.text = ' time <= "' + pointDateEnd + '"';
                } else if (pointDateStart !== '' && pointDateEnd === '') {
                    this.searchModel.text = 'time >= "' + pointDateStart + '"';
                } else {
                    this.searchModel.text = 'time >= "' + pointDateStart + '" and time <= "' + pointDateEnd + '"';
                }
            } else if (this.searchModel.filterType == this.filterType.explain) {
                this.searchModel.text = $('#searchPoint').val().trim();
                this.searchModel.isRemark = true;
            }
        },

        attachEvents: function () {
            var _this = this;
            var $divPointsList = $('#divPointsList'),
                $filterDefineWin = $('#filterDefineWin');
            $(".pointList").on('click', 'tbody tr', function () {
                $(this).toggleClass('active');
            }).on('click', 'tbody tr .data-manager-star', function (e) {
                var $this = $(this);
                var pointName = $this.closest('tr').data('point');
                if ($this.hasClass('glyphicon-star-empty')) {
                    _this.addHasMonitoredNameList(pointName);
                    WebAPI.post('/admin/dataManager/update/', {
                        userId: AppConfig.userId,
                        projectId: _this.projectId,
                        points: _this.hasMonitoredNameList.join(',')
                    }).done(function (result) {
                        if (result.success == true) {
                            $this.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
                        } else {
                            console.log('error :', result.msg);
                        }
                    })
                } else {
                    _this.deleteHasMonitoredNameList(pointName);
                    WebAPI.post('/admin/dataManager/update/', {
                        userId: AppConfig.userId,
                        projectId: _this.projectId,
                        points: _this.hasMonitoredNameList.join(',')
                    }).done(function (result) {
                        if (result.success == true) {
                            $this.removeClass('glyphicon-star').addClass('glyphicon-star-empty');
                        } else {
                            console.log('error :', result.msg);
                        }
                    })
                }
                e.stopPropagation();
            });

            $('#deleteExpiredData').click(function () {//清除过期数据
                var startTime = $("#expiredDataStartTime").datetime({
                    startView: 'month',
                    autoclose: true,
                    format: 'yyyy-mm-dd hh:ii'
                });
                var endTime = $("#expiredDataEndTime").datetime({
                    startView: 'month',
                    autoclose: true,
                    format: 'yyyy-mm-dd hh:ii'
                });
                I18n.fillArea($(".realTimePopover"));
            });

            $(document).on("click.hideExpiredTimeBox", function (e) {
                var $target = $(e.target);
                if (!$target.closest("#deleteExpiredData").length && !$target.closest(".popover").length) {
                    if (_this.historyStatusPopover.data("bs.popover")) {
                        _this.historyStatusPopover.data("bs.popover").inState.click = false;
                    }
                    _this.historyStatusPopover.popover('hide');
                }
            });

            $('#realTimeBtnBox').on('click', '#expiredDataConfirm', function () {
                var startTimeVal;
                var endTimeVal = new Date($('#expiredDataEndTime').val().trim()).format('yyyy-MM-dd HH:mm:59');
                if (!$('#expiredDataEndTime').val().trim()) {
                    alert('The end time can\'t be empty.');
                    return;
                } else if (new Date() < new Date(endTimeVal) || /[a-zA-Z]/.test($('#expiredDataEndTime').val().trim())) {
                    alert('End time error');
                    return;
                } else if(/[a-zA-Z]/.test($('#expiredDataStartTime').val().trim())){
                    alert('Start time error');
                    return;
                }

                if ($('#expiredDataStartTime').val().trim()) {
                    startTimeVal = new Date($('#expiredDataStartTime').val().trim()).format('yyyy-MM-dd HH:mm:00');
                } else {
                    startTimeVal = new Date(new Date(endTimeVal) - 30 * 60 * 1000).format('yyyy-MM-dd HH:mm:00');
                    $('#expiredDataStartTime').val(new Date(startTimeVal).format('yyyy-MM-dd HH:mm'));
                }

                if (new Date(startTimeVal) > new Date(endTimeVal)) {
                    alert(I18n.resource.common.TIME_COMPARE);
                    return;
                }
                infoBox.confirm(I18n.resource.dataManage.IS_DELETE_EXPIRED_DATA + ' ' + startTimeVal + ' ' + I18n.resource.dataManage.TO + ' ' + endTimeVal + ' ' + I18n.resource.dataManage.OF_DATA, function () {
                    WebAPI.post('/sitedata/clear', {
                        'projId': AppConfig.projectId,
                        'startTime': startTimeVal,
                        'endTime': endTimeVal
                    }).done(function (result) {
                        if (result.success) {
                            _this.refreshPointList().done(function () {
                                _this.historyStatusPopover.popover('hide');
                                _this.historyStatusPopover.data("bs.popover").inState.click = false;
                            });
                        } else {
                            console.log('error' + result.data);
                        }
                    })
                })
            });

            $("#isMonitoring").click(function () { //点击加入收藏按钮
                var $this = $(this), $span = $this.find('span');
                if ($span.hasClass("glyphicon-star")) {
                    _this.refreshPaginationTable();
                    $('#dataManagePagination').show();
                    $('#dataManagePaginationWrapper').show();
                    $span.removeClass("glyphicon-star").addClass('glyphicon-star-empty');
                } else {
                    Spinner.spin(ElScreenContainer);
                    WebAPI.get('/admin/dataPointManager/loadData/' + _this.projectId).done(function (result) {
                        if (result.list && result.list.length) {
                            _this.hasMonitoredList = result.list;
                        }
                        _this.refreshPaginationTable('isMonitored');
                        $('#dataManagePagination').hide();
                        $('#dataManagePaginationWrapper').hide();
                        $span.removeClass("glyphicon-star-empty").addClass('glyphicon-star');
                    }).always(function () {
                        Spinner.stop();
                    });
                }
            });

            $("#joinCurve").click(function () { //点击加入曲线按钮
                var $selectedItem = $("#tableWatch tr.active, #tableMonitor tr.active"),
                    $point_name_list,
                    point_name_list,
                    alert,
                    date_start,
                    data_end,
                    format;
                if (!$selectedItem.length) {
                    return;
                }
                if ($selectedItem.length > 10) {
                    //点名不能超过十条
                    alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.dataManage.UP_TO_TEN_RECORDS);
                    alert.showAtTop(2000);
                    return;
                }

                $point_name_list = $selectedItem.map(function (index, item) {
                    return $(item).data('point').toString();
                });
                point_name_list = $point_name_list.toArray();
                point_name_list = point_name_list.filter(function (item, pos) {
                    return point_name_list.indexOf(item) == pos;
                });

                if (localStorage.getItem('dataManagerStartDate')) {
                    date_start = localStorage.getItem('dataManagerStartDate');
                    data_end = localStorage.getItem('dataManagerEndDate');
                    format = localStorage.getItem('dataManagerFormat') ? localStorage.getItem('dataManagerFormat') : 'm5';
                } else {
                    date_start = new Date(new Date() - 24 * 60 * 60 * 1000).format("yyyy-MM-dd HH:mm:00");
                    data_end = new Date().format("yyyy-MM-dd HH:mm:00");
                    format = 'm5';
                }

                Spinner.spin(ElScreenContainer);
                WebAPI.post("/get_history_data_padded_reduce", {
                    projectId: _this.projectId,
                    pointList: point_name_list,
                    timeStart: date_start.format("yyyy-MM-dd HH:mm:00"),
                    timeEnd: data_end.format("yyyy-MM-dd HH:mm:00"),
                    timeFormat: format
                }).done(function (data) {
                    var obj = {
                        data: data,
                        startDate: date_start,
                        endDate: data_end,
                        format: format,
                        pointList: point_name_list,
                        projectId: _this.projectId,
                        isShowRepairData: false
                    };
                    new HistoryChart(obj).show();
                }).fail(function (e) {
                    alert(I18n.resource.observer.widgets.HISTORY_CURVE_FAILED);
                }).always(function () {
                    Spinner.stop();
                });
            });

            $("#pointRefresh").click(function () { //点击刷新按钮
                _this.currentPage = 1;
                _this.initProjectPointList();
            });

            $("#doSearch").click(function () {//删除查询关键字
                _this.currentPage = 1;
                _this.initProjectPointList();
            });


            $('#pageSizeSelector').change(function () {
                _this.setPageSize($(this).val());
                _this.initProjectPointList();
                _this.paginationRefresh(1);
            });

            $('#filterDefineConfirm').click(function () {
                _this.searchModel.text = $('#filterContent').val().trim();
                if (!_this.searchModel.text) {
                    return;
                }
                _this.refreshPointList();
                $filterDefineWin.modal('hide');
            });

            $divPointsList.on('change', '#filterType', function () {
                var val = $(this).val().trim();
                _this.refreshFilter(val);
                _this.searchModel = {
                    filterType: val,
                    isAdvance: true
                };

                if (val == _this.filterType.name) {
                    _this.searchModel.isAdvance = false;
                } else if (val == _this.filterType.define) {
                    _this.destroyDatePicker();
                    $filterDefineWin.modal();
                } else if (val == _this.filterType.time) {
                    _this.pointDateStartInstance = $("#pointDateStart").datetimepicker({
                        startView: 'month',
                        autoclose: true,
                        format: 'yyyy-mm-dd hh:ii:ss'
                    });
                    _this.pointDateEndInstance = $("#pointDateEnd").datetimepicker({
                        startView: 'month',
                        autoclose: true,
                        format: 'yyyy-mm-dd hh:ii:ss'
                    });
                    //_this.pointDateStartInstance = $("#pointDateStart").datetime();
                    //_this.pointDateEndInstance = $("#pointDateEnd").datetime();
                } else {
                    _this.destroyDatePicker();
                }
            }).on('change', '#filterSort', function () {
                _this.setFilterSort($(this).val());
                _this.refreshPointList();
            }).on('click', '#filterConfirm', function () {
                _this.setSearchModel();
                _this.refreshPointList();
            }).on('keyup', '#searchPoint', function (e) {
                if (e.keyCode == 13) {
                    _this.setSearchModel();
                    _this.refreshPointList();
                }
            }).on('click', '#defineFilterEdit', function () {
                $filterDefineWin.modal();
            });
        },
        destroyDatePicker: function () {
            if (this.pointDateStartInstance) {
                this.pointDateStartInstance = null;
                this.pointDateEndInstance = null;
            }
        },
        refreshFilter: function (type) {
            $("#filterBox").empty().html(beopTmpl('tpl_data_manage_filter', {'type': type}));
            I18n.fillArea($(ElScreenContainer));
        },
        detachEvents: function () {
            $(document).on("click.hideExpiredTimeBox");
        },
        paginationRefresh: function (totalNum) {//分页插件显示
            var _this = this;
            var totalPages = Math.ceil(totalNum / this.getPageSize());
            if (!totalNum) {
                return;
            }

            while (totalPages < this.currentPage && this.currentPage > 1) {
                this.currentPage = this.currentPage - 1;
            }
            var pageOption = {
                first: '&laquo;&laquo',
                prev: '&laquo;',
                next: '&raquo;',
                last: '&raquo;&raquo;',
                startPage: this.currentPage ? this.currentPage : 1,
                totalPages: !totalPages ? 1 : totalPages,
                onPageClick: function (event, page) {
                    _this.currentPage = page;
                    _this.refreshPointList();
                }
            };

            if (this.currentPage) {
                pageOption['startPage'] = this.currentPage ? this.currentPage : 1;
            }

            $("#dataManagePagination").replaceWith('<ul class="pagination fr" id="dataManagePagination"></ul>');
            $("#dataManagePagination").twbsPagination(pageOption);
        },
        renderSearchList: function () {
            if (this.pointInfoList.length) {
                this.refreshSearchTable(this.searchModel.text);
            }
        },
        refreshSearchTable: function (keyWordVal) { //刷新查询分页列表
            var _this = this, pointListHtml = '';
            var keywordList = keyWordVal.replace(/[^\w\d\s]/g, ' ').split(/\s/g);
            for (var i = 0; i < this.pointInfoList.length; i++) {
                var point = this.pointInfoList[i];
                var keyWordName = point.pointname;
                keywordList.forEach(function (item) {
                    if (item) {
                        keyWordName = keyWordName.replace(new RegExp("(" + item + ")(?![^<]*>|[^<>]*</)", "gi"), '<span class="keyword">$1</span>');
                    }
                });
                pointListHtml += '<tr data-point="' + point.pointname + '">' +
                    '<td>' + keyWordName + '</td><td>' + point.pointvalue + '</td>' +
                    '<td>' + timeFormat(point.time,timeFormatChange('yyyy-mm-dd hh:ii')) + '</td>' +
                    '<td>' + (point.alias ? point.alias : '') + '</td><td><span class="glyphicon cp data-manager-star ' + (_this.arrayToObject(_this.hasMonitoredNameList)[point.pointname] ? 'glyphicon-star' : 'glyphicon-star-empty') + '"></span></td>' +
                    '</tr>';
            }
            $("#tableWatch tbody").html(pointListHtml);
        },
        refreshPointList: function () {//刷新点名列表
            if (!this.projectId) {
                alert('invalid project, please try again.');
                return;
            }

            var _this = this;
            Spinner.spin($('#tableWatch').get(0));

            return WebAPI.post("/admin/dataPointManager/search/", {
                projectId: this.projectId,
                current_page: this.currentPage,
                page_size: this.getPageSize(),
                text: this.searchModel.text ? this.searchModel.text : '',
                isAdvance: this.searchModel.isAdvance ? this.searchModel.isAdvance : false,
                order: this.searchModel.order ? this.searchModel.order : null,
                isRemark: this.searchModel.isRemark,
                flag: 0
            }).done(function (result) {
                var total = result.total;
                $('#totalPointsNum').text(total);
                if (!total) {
                    _this.currentPage = 1;
                    $("#tableWatch tbody").html("");
                    _this.paginationRefresh(1);
                    return;
                }
                _this.pointInfoList = result.list;
                _this.refreshPaginationTable();

                _this.paginationRefresh(total);
                if (_this.searchModel.filterType == _this.filterType.name && _this.searchModel.text) {
                    _this.renderSearchList();
                }
            }).fail(function () {
                alert(I18n.resource.analysis.paneConfig.ERR1);
            }).always(function () {
                Spinner.stop();
            });
        },
        refreshPaginationTable: function (isMonitoredList) {//刷新分页列表
            var _this = this, pointListHtml = '', list = (isMonitoredList) ? _this.hasMonitoredList : _this.pointInfoList;
            for (var i = 0; i < list.length; i++) {
                var point = list[i];
                pointListHtml += '<tr data-point="' + (point.pointname || point.name) + '">' +
                    '<td>' + (point.pointname || point.name) + '</td><td title="' + (point.pointvalue || point.value || '') + '">' + (point.pointvalue || point.value || '') + '</td>' +
                    '<td>' + timeFormat(point.time,timeFormatChange('yyyy-mm-dd hh:ii')) + '</td>' +
                    '<td>' + (point.alias ? point.alias : '') + '</td>' +
                    '<td><span class="glyphicon cp data-manager-star ' + ((_this.arrayToObject(_this.hasMonitoredNameList)[point.pointname] || _this.arrayToObject(_this.hasMonitoredNameList)[point.name]) ? 'glyphicon-star' : 'glyphicon-star-empty') + '"></span></td>' +
                    '</tr>';
            }
            $("#tableWatch tbody").empty().html(pointListHtml);
            $('.gray-scrollbar').last().scrollTop(0);
        },

        //通过名字删除监视对象
        deleteHasMonitoredNameList: function (name) {
            var hasMonitoredNameList = this.hasMonitoredNameList;
            for (var i = 0, iLen = hasMonitoredNameList.length; i < iLen; i++) {
                if (hasMonitoredNameList[i] == name) {
                    hasMonitoredNameList.splice(i--, 1);
                }
            }
        },
        //通过名字增加监视对象
        addHasMonitoredNameList: function (name) {
            var hasMonitoredNameList = this.hasMonitoredNameList;
            for (var i = 0, iLen = hasMonitoredNameList.length; i < iLen; i++) {
                if (hasMonitoredNameList[i] == name) {
                    return;
                }
            }
            this.hasMonitoredNameList.push(name + '');
        },

        //数组转化成对象
        arrayToObject: function (arr) {
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                obj[arr[i]] = true;
            }
            return obj;
        },
        //报表的初始化
        initProjectPointList: function () {
            var _this = this, savedPointsPromise = WebAPI.get('/admin/dataPointManager/loadData/' + _this.projectId);
            Spinner.spin(ElScreenContainer);
            $.when(_this.refreshPointList(), savedPointsPromise).done(function (pointListResult, hasMonitoredResult) {
                if (pointListResult[1] == 'success' && hasMonitoredResult[1] == 'success') {
                    hasMonitoredResult[0].list.forEach(function (item) {
                        _this.hasMonitoredNameList.push(item.name);
                    });
                    _this.refreshPaginationTable();
                } else {
                    console.log(error + '获取报表数据失败');
                }
            }).always(function () {
                Spinner.stop();
            });
        },
        getPageSize: function () {
            if (!localStorage.getItem(this.pageSizeKey)) {

                localStorage.setItem(this.pageSizeKey, this.defaultPageSize);
            }
            return localStorage.getItem(this.pageSizeKey);
        },
        setPageSize: function (pageSize) {
            localStorage.setItem(this.pageSizeKey, pageSize ? Number(pageSize) : this.defaultPageSize);
        }
    };
    $.extend(PointManagerRealTimeData.prototype, PointManagerRealTimeDataFunc);
    return PointManagerRealTimeData;
})();

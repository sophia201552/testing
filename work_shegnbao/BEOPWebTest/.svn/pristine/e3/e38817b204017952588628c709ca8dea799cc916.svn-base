/// <reference path="../lib/jquery-2.1.4.js" />
/// <reference path="../core/common.js" />
/// <reference path="analysis/analysisTendency.js" />
/// <reference path="analysis/analysisSpectrum.js" />
/// <reference path="analysis/analysisGroup.js" />
/// <reference path="analysis/analysisData.js" />
/// <reference path="widgets/historyChart.js" />
/// <reference path="../core/common.js" />
/// <reference path="../lib/jquery-1.8.3.js" />


var PointManager = (function () {
    function PointManager(projectId) {
        this.i18 = I18n.resource.observer.widgets;
        this.pointInfoList = [];
        this.pageSize = 10;
        this.projectId = projectId;
        this.currentPage = 1;
        if ($(window).height() > 800) {
            this.pageSize = 13;
        }
    }

    PointManager.prototype = {
        show: function () {
            var _this = this;
            $("#ulPages li").removeClass("active");
            $("#page-DataWatch").parent().addClass("active");

            WebAPI.get("/static/views/observer/pointManager.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);

                if (AppConfig.projectName == null) {
                    $('#myTab li:last-child').hide();
                } else {
                    $('#stPjName').html(AppConfig.projectName);
                }

                I18n.fillArea($('#divUploadWrap'));
                _this.initProjectPointList();
                _this.attachEvents();
                I18n.fillArea($(ElScreenContainer));
            });
        },
        close: function () {
            this.detachEvents();
        },
        attachEvents: function () {
            var _this = this;

            // form elements
            var $pjData = $('#iptPjData');
            var $btnConfirm = $('#btnConfirmUpload');

            // upload *.csv elements
            var $spUploadInfo = $('#spUploadInfo');
            var $btnUploadCSV = $('#btnUploadCSV');

            // upload drag and drop elements
            var $divPjDataDropHandler = $('#divPjDataDropHandler');
            var $tip = $divPjDataDropHandler.children('p');
            var $uploadMask = $('#uploadMask');
            var $body = $('body');

            // -1: error
            // 0: success
            var uploadStatus = -1;
            var fileSelected;
            var dragFix = false;

            $spUploadInfo.tooltip({title: '', trigger: 'manual', placement: 'right'});

            var uploadHandler = function (file) {
                var formData = new FormData();
                var match = file.name.match(/\.[A-Za-z0-9]+$/);
                var supportFiles = ['.csv', '.xls', '.xlsx'];
                if (!file || !match || supportFiles.indexOf(match[0].toLowerCase()) < 0) {
                    util.tooltip.show($spUploadInfo, I18n.resource.dataManage.INVALID_FILE_TYPE);
                    isDataUploadReady = false;
                    return;
                }
                fileSelected = file;
                formData.append('config-file', file);
                $.ajax({
                    url: '/get_config_data/' + AppConfig.userId,
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload) {
                            xhr.upload.addEventListener('progress', function (e) {
                                var progress = Math.round(e.loaded / e.total);
                                if (e.lengthComputable) {
                                    $('#spUploadInfo').html(I18n.resource.dataManage.UPLOADING + progress * 100 + '%');
                                }
                            }, false);
                            xhr.upload.addEventListener('load', function (e) {
                                $('#spUploadInfo').html(I18n.resource.dataManage.PROCESSING);
                            }, false);
                        }
                        return xhr;
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function (rs) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-success')
                        .html(I18n.resource.dataManage.UPLOAD_SUCCESS + file.name);
                    uploadStatus = 0;
                }).fail(function (err) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-danger')
                        .html(I18n.resource.dataManage.UPLOAD_FAILED);
                    uploadStatus = -1;
                });
            };

            // bind *.csv upload event
            $btnUploadCSV.click(function (e) {
                $pjData.click();
            });
            $pjData.change(function () {
                uploadHandler($(this)[0].files[0]);
            });

            // drag and drop upload events
            // drag enter
            $divPjDataDropHandler.on('dragenter', function (e) {
                dragFix = true;
                $tip.html(I18n.resource.dataManage.DRAG_RELEASE_TIP);
                e.stopPropagation();
                e.preventDefault();
            });
            // drag leave
            $divPjDataDropHandler.on('dragleave', function (e) {
                dragFix = false;
                $tip.html(I18n.resource.dataManage.DRAG_TIP);
                e.stopPropagation();
                e.preventDefault();
            });
            // drop
            $divPjDataDropHandler.on('drop', function (e) {
                var files, file;
                $divPjDataDropHandler.hide();
                $uploadMask.hide();
                $tip.html(I18n.resource.dataManage.DRAG_TIP);
                // upload now
                files = e.originalEvent.dataTransfer.files;
                if (files.length > 1) alert(I18n.resource.dataManage.NOT_SUPPORT_MULTI_UPLOAD);
                file = files[0];
                uploadHandler(file);
                e.stopPropagation();
                e.preventDefault();
            });
            $uploadMask.on('dragleave', function (e) {
                e.stopPropagation();
                if (dragFix) return;
                $uploadMask.hide();
                $divPjDataDropHandler.hide();
            });
            $body.on('dragenter', function (e) {
                $divPjDataDropHandler.show();
                $uploadMask.show();
                e.preventDefault();
            });
            //  prevent 'drop' event on elements
            $body.add($uploadMask).add($divPjDataDropHandler).on('dragover', function (e) {
                e.preventDefault();
            });
            // mock escape event
            $body.on('keydown', function (e) {
                // console.log('body key up');
                if (e.keyCode === 27) {
                    $uploadMask.hide();
                    $divPjDataDropHandler.hide();
                    e.preventDefault();
                }
            });
            $body.on('drop', function (e) {
                $uploadMask.hide();
                $divPjDataDropHandler.hide();
                e.preventDefault();
            });

            $btnConfirm.click(function () {
                if (_this.projectId == null) {
                    alert(I18n.resource.dataManage.CHOOSE_PROJECT_FIRST);
                    return;
                }
                if (uploadStatus !== 0) {
                    alert(I18n.resource.dataManage.UPLOAD_DATA_FIRST);
                    return;
                }
                Spinner.spin($body[0]);
                // submit
                WebAPI.post('/project/import_user_data/' + AppConfig.userId, {
                    dataFileName: fileSelected.name,
                    projId: _this.projectId
                }).done(function (rs) {
                    if (typeof rs === 'object' && rs.error === 'successful') {
                        alert(I18n.resource.dataManage.DATA_IMPORT_SUCCESS);
                        ScreenManager.show(PointManager);
                    } else {
                        alert(I18n.resource.dataManage.DATA_IMPORT_FAILED);
                    }
                }).fail(function () {
                    alert(I18n.resource.dataManage.DATA_IMPORT_FAILED);
                }).always(function () {
                    Spinner.stop();
                });
            });

            $("#divPointManagerPage").on('click', '.pointList tbody tr', function () {
                var $this = $(this);
                if ($this.is('.active')) {
                    $this.removeClass('active');
                } else {
                    $this.addClass('active');
                }
            });

            $("#delSelect").click(function () { //点击删除选中按钮
                var pointsToUpdateList, $selectedItem, $notSelectedItem;

                $selectedItem = $('#tableMonitor tr.pointItem.active');
                $notSelectedItem = $('#tableMonitor tr.pointItem:not(.active)');
                pointsToUpdateList = $notSelectedItem.map(function (index, item) {
                    return $(item).data('point');
                });

                WebAPI.post('/admin/dataManager/update/', {
                    userId: AppConfig.userId,
                    projectId: _this.projectId,
                    points: pointsToUpdateList.toArray().join(',')
                }).done(function (result) {
                    if (result.success) {
                        $selectedItem.remove();
                    }
                });
            });

            $("#joinMonitoring").click(function () { //点击加入监视按钮
                var $item, $selectedItem, pointsToAdd, pointsMonitored, pointUpdateObject = {}, pointUpdateList;
                $selectedItem = $('#tableWatch tr.active');
                pointsToAdd = $selectedItem.map(function (index, item) {
                    $item = $(item);
                    return {name: $item.data('point'), value: $item.data('value'), time: $item.data('time')}
                }), pointsMonitored = $('#tableMonitor tr.pointItem').map(function (index, item) {
                    $item = $(item);
                    return {name: $item.data('point'), value: $item.data('value'), time: $item.data('time')}
                });

                for (var i = 0, i_len = pointsToAdd.length; i < i_len; i++) {
                    pointUpdateObject[pointsToAdd[i].name] = {};
                    pointUpdateObject[pointsToAdd[i].name]['name'] = pointsToAdd[i].name;
                    pointUpdateObject[pointsToAdd[i].name]['value'] = pointsToAdd[i].value;
                    pointUpdateObject[pointsToAdd[i].name]['time'] = pointsToAdd[i].time;
                }

                for (var i = 0, i_len = pointsMonitored.length; i < i_len; i++) {
                    pointUpdateObject[pointsMonitored[i].name] = {};
                    pointUpdateObject[pointsMonitored[i].name]['name'] = pointsMonitored[i].name;
                    pointUpdateObject[pointsMonitored[i].name]['value'] = pointsMonitored[i].value;
                    pointUpdateObject[pointsMonitored[i].name]['time'] = pointsMonitored[i].time;
                }

                pointUpdateList = Object.keys(pointUpdateObject);

                WebAPI.post('/admin/dataManager/update/', {
                    userId: AppConfig.userId,
                    projectId: _this.projectId,
                    points: pointUpdateList.join(',')
                }).done(function (result) {
                    if (result.success) {
                        var renderList = [];
                        for (var prop in pointUpdateObject) {
                            renderList.push({
                                name: pointUpdateObject[prop].name,
                                value: pointUpdateObject[prop].value,
                                time: pointUpdateObject[prop].time
                            });
                        }
                        _this.loadMonitorList(renderList);
                        $selectedItem.removeClass('active');
                    }
                });
            });

            $("#joinCurve").click(function () { //点击加入曲线按钮
                var $selectedItem = $("#tableWatch tbody tr.active, #tableMonitor tbody tr.active"),
                    $point_name_list,
                    point_name_list,
                    alert;
                if (!$selectedItem.length) {
                    return;
                }
                if ($selectedItem.length > 10) {
                    //点名不能超过十条
                    alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.dataManage.UP_TO_TEN_RECORDS);
                    alert.showAtTop(2000);
                    return;
                }

                Spinner.spin($("#divPointManagerPage")[0]);
                $point_name_list = $selectedItem.map(function (index, item) {
                    return $(item).data('point');
                });
                point_name_list = $point_name_list.toArray();
                point_name_list = point_name_list.filter(function (item, pos) {
                    return point_name_list.indexOf(item) == pos;
                });

                var date_start = new Date();
                var data_end = new Date();
                date_start.setDate(data_end.getDate() - 3);
                WebAPI.post("/get_history_data_padded_reduce", {
                    projectId: _this.projectId,
                    pointList: point_name_list,
                    timeStart: date_start.format("yyyy-MM-dd HH:mm:ss"),
                    timeEnd: data_end.format("yyyy-MM-dd HH:mm:ss"),
                    timeFormat: "m5"
                }).done(function (data) {
                    if (data || data != {}) {
                        new HistoryChart(data, date_start, data_end).show();
                    } else {
                        console.error(result);
                        alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.observer.widgets.HISTORY_CURVE_FAILED);
                        alert.showAtTop(2000);
                        return;
                    }
                }).fail(function (e) {
                    alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.observer.widgets.HISTORY_CURVE_FAILED);
                    alert.showAtTop(2000);
                }).always(function () {
                    Spinner.stop();
                });
            });

            $("#pointRefresh").click(function () { //点击刷新按钮
                Spinner.spin($("#divPointManagerPage")[0]);
                //$("#searchPointName").val("");
                _this.currentPage = 1;
                _this.initProjectPointList();

            });

            $("#searchPointName").keyup(function (e) {//查询输入框的
                if (e.keyCode == 13) {
                    _this.currentPage = 1;
                    _this.initProjectPointList();
                }
            });

            $("#serachDel").click(function () {//删除查询关键字
                $("#searchPointName").val("");
            });

        },
        detachEvents: function () {
            // detachEvents drag and drop upload events
            $('#divPjDataDropHandler').off();
            $('#uploadMask').off();
            $('body').off();
        },
        paginationRefresh: function (totalNum) {//分页插件显示
            var _this = this;
            var totalPages = Math.ceil(totalNum / this.pageSize);
            if (!totalNum) {
                return;
            }

            $("#dataManagePaginationWrapper").empty().html('<ul class="pagination fr" id="dataManagePagination"></ul>');

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

            $("#dataManagePagination").twbsPagination(pageOption);
        },
        searchList: function () {//根据关键字，控制点名列表显示
            var _this = this;
            var keyWordVal = $.trim($("#searchPointName").val());
            var val = keyWordVal.toLowerCase();
            var showPointArr = [];
            for (var i = 0; i < this.pointInfoList.length; i++) {
                var ptList = this.pointInfoList[i];
                var ptListName = ptList.name.toLowerCase();
                if (ptListName.indexOf(val) > -1) {
                    if (ptListName.indexOf(val) == 0) { //将关键字开头的行放在前面
                        showPointArr.unshift(ptList);
                    } else {
                        showPointArr.push(ptList);
                    }
                }
            }
            _this.currentPage = 1;
            _this.pointInfoList = showPointArr;
            if (_this.pointInfoList.length) {
                _this.refreshSearchTable(keyWordVal);
            }
        },
        refreshSearchTable: function (keyWordVal) { //刷新查询分页列表
            var pointListHtml = '';
            var reg = new RegExp("(" + keyWordVal + ")", "gi");
            for (var i = 0; i < this.pointInfoList.length; i++) {
                var point = this.pointInfoList[i];
                var keyWordName = point.name.replace(reg, '<span class="keyword">$1</span>');
                pointListHtml += '<tr data-point="' + point.name + '" data-value="' + point.value + '" data-time="' + point.time + '">' +
                    '<td class="point_' + point.name + '">' + keyWordName + '</td><td class="value_' + point.value + '">' + point.value + '</td>' +
                    '<td>' + point.time + '</td>' +
                    '</tr>';
            }
            $("#tableWatch tbody").html(pointListHtml);
        },
        refreshPointList: function () {//刷新点名列表
            var _this = this;
            var search_text = $("#searchPointName").val().trim();
            return WebAPI.post("/get_realtimedata_with_time", {
                proj: _this.projectId,
                current_page: _this.currentPage,
                page_size: _this.pageSize,
                search_text: search_text
            }).done(function (result) {
                var total = result.total, list = result.list;
                if (!total) {
                    _this.currentPage = 1;
                    $("#tableWatch tbody").html("");
                    _this.paginationRefresh(1);
                    return;
                }
                list.sort(function (a, b) { //点名排序
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                });
                _this.pointInfoList = list;
                _this.refreshPaginationTable();
                _this.paginationRefresh(total);
                if (search_text) {
                    _this.searchList();
                }
            }).fail(function () {
                alert(I18n.resource.analysis.paneConfig.ERR1);
            }).always(function () {
                Spinner.stop();
            });
        },
        refreshPaginationTable: function () {//刷新分页列表
            var _this = this, pointListHtml = '';
            for (var i = 0; i < _this.pointInfoList.length; i++) {
                var point = _this.pointInfoList[i];
                pointListHtml += '<tr data-point="' + point.name + '" data-value="' + point.value + '" data-time="' + point.time + '">' +
                    '<td class="point_' + point.name + '">' + point.name + '</td><td class="value_' + point.value + '">' + point.value + '</td>' +
                    '<td>' + point.time + '</td>' +
                    '</tr>';
            }
            $("#tableWatch tbody").empty().html(pointListHtml);
        },
        loadMonitorList: function (pointList) {//刷新点名列表
            var html = '';
            for (var i = 0; i < pointList.length; i++) {
                var point = pointList[i];
                html += '<tr class="pointItem" data-point="' + point.name + '" data-value="' + point.value + '" data-time="' + point.time + '">' +
                    '<td class="point_' + point.name + '">' + point.name + '</td><td class="value_' + point.value + '">' + point.value + '</td>' +
                    '<td>' + point.time + '</td>' +
                    '</tr>';
            }
            $("#tableMonitor tbody").empty().append(html);
        },
        initProjectPointList: function () {
            var _this = this, savedPointsPromise = WebAPI.get('/admin/dataPointManager/loadData/' + _this.projectId);
            $.when(_this.refreshPointList(), savedPointsPromise).done(function (pointListResult, savedPointsResult) {
                if (savedPointsResult[1]) {
                    _this.loadMonitorList(savedPointsResult[0].list);
                }
            });
        }
    };

    return PointManager;
})();

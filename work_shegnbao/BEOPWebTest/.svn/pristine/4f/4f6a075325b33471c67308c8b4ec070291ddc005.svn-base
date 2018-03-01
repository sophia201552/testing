/// <reference path="../lib/jquery-1.11.1.js" />
/// <reference path="../core/common.js" />
/// <reference path="analysis/analysisTendency.js" />
/// <reference path="analysis/analysisSpectrum.js" />
/// <reference path="analysis/analysisGroup.js" />
/// <reference path="analysis/analysisData.js" />
/// <reference path="widgets/historyChart.js" />
/// <reference path="../core/common.js" />
/// <reference path="../lib/jquery-1.8.3.js" />


var PointManager = (function () {
    function PointManager() {
        this.i18 = I18n.resource.observer.widgets;
        this.pointInfoList = [];
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

            $spUploadInfo.tooltip( {title: '', trigger: 'manual', placement: 'right'});

            var uploadHandler = function (file) {
                var formData = new FormData();
                var match = file.name.match(/\.[A-Za-z0-9]+$/);
                var supportFiles = ['.csv', '.xls', '.xlsx'];
                if(!file || !match || supportFiles.indexOf(match[0].toLowerCase()) < 0) {
                    util.tooltip.show($spUploadInfo, '文件格式有误，请上传正确的 .csv/.xls/.xlsx 格式文件！');
                    isDataUploadReady = false;
                    return;
                }
                fileSelected = file;
                formData.append('config-file', file);
                $.ajax({
                    url: '/get_config_data/'+AppConfig.userId,
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if(xhr.upload) {
                            xhr.upload.addEventListener('progress', function (e) {
                                var progress = Math.round(e.loaded / e.total);
                                if(e.lengthComputable) {
                                    $('#spUploadInfo').html('正在上传...'+progress*100+'%');
                                }
                            }, false);
                            xhr.upload.addEventListener('load', function (e) {
                                $('#spUploadInfo').html('正在处理数据...');
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
                        .html('上传成功 - '+file.name);
                    uploadStatus = 0;
                }).fail(function (err) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-danger')
                        .html('上传失败，文件中有错误！');
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
                $tip.html('松开鼠标开始上传');
                e.stopPropagation();
                e.preventDefault();
            });
            // drag leave
            $divPjDataDropHandler.on('dragleave', function (e) {
                dragFix = false;
                $tip.html('请将文件拖拽到此处进行上传');
                e.stopPropagation();
                e.preventDefault();
            });
            // drop
            $divPjDataDropHandler.on('drop', function (e) {
                var files, file;
                $divPjDataDropHandler.hide();
                $uploadMask.hide();
                $tip.html('请将文件拖拽到此处进行上传');
                // upload now
                files = e.originalEvent.dataTransfer.files;
                if(files.length > 1) alert('请注意：\n目前系统不支持同时上传多个文件，将会使用您选择的第一个文件进行上传！');
                file = files[0];
                uploadHandler(file);
                e.stopPropagation();
                e.preventDefault();
            });
            $uploadMask.on('dragleave', function (e) {
                e.stopPropagation();
                if(dragFix) return;
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
                if(e.keyCode === 27) {
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
                if(AppConfig.projectId == null) {
                    alert('请您先选择一个项目，再进行上传！');
                    return;
                }
                if(uploadStatus !== 0) {
                    alert('请您先上传数据，并保证数据的正确性！');
                    return;
                }
                Spinner.spin($body[0]);
                // submit
                WebAPI.post('/project/import_user_data/'+AppConfig.userId, {
                    dataFileName: fileSelected.name,
                    projId: AppConfig.projectId
                }).done(function (rs) {
                    rs = JSON.parse(rs);
                    if(typeof rs === 'object' && rs.error === 'successful') {
                        alert('数据导入成功！');
                        ScreenManager.show(PointManager);
                    } else {
                        alert('服务器忙碌中，请稍后重试！');
                    }
                }).fail(function () {
                    alert('服务器忙碌中，请稍后重试！');
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
                    projectId: AppConfig.projectId,
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
                    return {name: $item.data('point'), value: $item.data('value')}
                }), pointsMonitored = $('#tableMonitor tr.pointItem').map(function (index, item) {
                    $item = $(item);
                    return {name: $item.data('point'), value: $item.data('value')}
                });

                for (var i = 0, i_len = pointsToAdd.length; i < i_len; i++) {
                    pointUpdateObject[pointsToAdd[i].name] = pointsToAdd[i].value;
                }

                for (var i = 0, i_len = pointsMonitored.length; i < i_len; i++) {
                    pointUpdateObject[pointsMonitored[i].name] = pointsMonitored[i].value;
                }

                pointUpdateList = Object.keys(pointUpdateObject);

                WebAPI.post('/admin/dataManager/update/', {
                    userId: AppConfig.userId,
                    projectId: AppConfig.projectId,
                    points: pointUpdateList.join(',')
                }).done(function (result) {
                    if (result.success) {
                        var renderList = [];
                        for (var pointName in pointUpdateObject) {
                            renderList.push({name: pointName, value: pointUpdateObject[pointName]});
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
                    alert = new Alert(ElScreenContainer, Alert.type.danger, '最多只能加入十条记录');
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
                    projectId: AppConfig.projectId,
                    pointList: point_name_list,
                    timeStart: date_start.format("yyyy-MM-dd HH:mm:ss"),
                    timeEnd: data_end.format("yyyy-MM-dd HH:mm:ss"),
                    timeFormat: "m5"
                }).done(function (result) {
                    try {
                        var data = JSON.parse(result);
                    } catch (e) {
                        console.error(result);
                        alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.observer.widgets.HISTORY_CURVE_FAILED);
                        alert.showAtTop(2000);
                        return;
                    }
                    new HistoryChart(data, date_start, data_end).show();
                }).fail(function (e) {
                    console.log('历史数据请求失败' + e);
                    alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.observer.widgets.HISTORY_CURVE_FAILED);
                    alert.showAtTop(2000);
                }).always(function () {
                    Spinner.stop();
                });
            });

            $("#pointRefresh").click(function () { //点击刷新按钮
                Spinner.spin($("#divPointManagerPage")[0]);
                $("#searchPointName").val("");
                _this.refreshPointList();
            });

            $("#searchPointName").keyup(function () {//查询输入框的
                _this.searchList();
            });

            $("#serachDel").click(function () {//删除查询关键字
                $("#searchPointName").val("");
                _this.searchList();
            });

        },
        detachEvents: function () {
            // detachEvents drag and drop upload events
            $('#divPjDataDropHandler').off();
            $('#uploadMask').off();
            $('body').off();
        },
        searchList: function () {//根据关键字，控制点名列表显示
            var keyWordVal = $.trim($("#searchPointName").val());
            var val = keyWordVal.toLowerCase();
            var $tbody = $("#tableWatch tbody");
            var pointHtml = '';
            if (val == "") {//为空不进行筛选
                for (var i = 0; i < this.pointInfoList.length; i++) {
                    var ptList = this.pointInfoList[i];
                    pointHtml += '<tr data-point="' + ptList.name + '" data-value="' + ptList.value + '"><td>' + (i + 1) + '</td><td class="point_' + ptList.name + '">' + ptList.name + '</td><td class="value_' + ptList.value + '">' + ptList.value + '</td></tr>';
                }
            } else {//不为空进行关键字筛选
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
                for (var i = 0; i < showPointArr.length; i++) {
                    var ptList = showPointArr[i];
                    var name = ptList.name;
                    var reg = new RegExp("(" + keyWordVal + ")", "gi");
                    var keyWordName = name.replace(reg, '<span class="keyword">$1</span>');
                    pointHtml += '<tr data-point="' + name + '" data-value="' + ptList.value + '"><td>' + (i + 1) + '</td><td class="point_' + name + '">' + keyWordName + '</td><td class="value_' + ptList.value + '">' + ptList.value + '</td></tr>';
                }
            }
            $tbody.html(pointHtml);
        },
        refreshPointList: function () {//刷新点名列表
            var _this = this;
            return WebAPI.post("/get_realtimedata", {proj: AppConfig.projectId}).done(function (result) {
                var ptLists = JSON.parse(result);
                if (!ptLists.length) {
                    alert("'" + AppConfig.projectShowName + "' " + _this.i18.FAIL_FIND_POINT + "！");
                    return;
                }
                ptLists.sort(function (a, b) { //点名排序
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                });
                _this.pointInfoList = ptLists;
                var pointListHtml = '';
                for (var i = 0; i < ptLists.length; i++) {
                    var point = ptLists[i];
                    pointListHtml += '<tr data-point="' + point.name + '" data-value="' + point.value + '"><td>' + (i + 1) + '</td><td class="point_' + point.name + '">' + point.name + '</td><td class="value_' + point.value + '">' + point.value + '</td></tr>';
                }
                $("#tableWatch tbody").html(pointListHtml);
            }).fail(function () {
                alert(I18n.resource.analysis.paneConfig.ERR1);
            }).always(function () {
                Spinner.stop();
            });
        },
        loadMonitorList: function (pointList) {//刷新点名列表
            $("#tableMonitor tbody").empty();
            var html = '';
            for (var i = 0; i < pointList.length; i++) {
                var point = pointList[i];
                html += '<tr class="pointItem" data-point="' + point.name + '" data-value="' + point.value + '"><td class="point_' + point.name + '">' + point.name + '</td><td class="value_' + point.value + '">' + point.value + '</td></tr>';
            }
            $("#tableMonitor tbody").append(html);
        },
        initProjectPointList: function () {
            var _this = this, savedPointsPromise, savedPoints = [];
            savedPointsPromise = WebAPI.get('/admin/dataManager/load/' + AppConfig.userId + '/' + AppConfig.projectId);

            $.when(this.refreshPointList(), savedPointsPromise).done(function (pointListResult, savedPointsResult) {
                if (!savedPointsResult[0].success) {

                } else {
                    if (savedPointsResult[0].data && savedPointsResult[0].data.points) {
                        savedPoints = savedPointsResult[0].data.points.split(',').sort();
                    }
                }
                var monitorList = [];
                for (var i = 0, p_length = _this.pointInfoList.length; i < p_length; i++) {
                    for (var j = 0, s_length = savedPoints.length; j < s_length; j++) {
                        if (_this.pointInfoList[i].name === savedPoints[j]) {
                            monitorList.push(_this.pointInfoList[i]);
                            savedPoints.splice(j, 1)
                        }
                    }
                }
                _this.loadMonitorList(monitorList);
            });

        }
    };

    return PointManager;
})();

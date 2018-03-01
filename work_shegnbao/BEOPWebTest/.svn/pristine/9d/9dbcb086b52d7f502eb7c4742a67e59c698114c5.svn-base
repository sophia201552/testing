(function (beop) {
    var configMap = {
            htmlURL: '/point_tool/html/realTimeData',
            settable_map: {
                sheetModel: true
            },
            sheetModel: null,
            page_size: 12
        },

        stateMap = {
            currentPage: 1,
            pointInfoList: null,
            pointCurveList: [],
            selectedList: [],
            watchList: []
        },
        jqueryMap = {},
        setJqueryMap, configModel,
        init, destroy,
        refreshPointList, loadPointList, initProjectPointList, loadMonitorList, searchList, joinCurve, createCurve, addCurve, joinMonitoring, joinMonitoringMore, delWatchPoint, delWatchPoints, delWatchPointsAll, onAddIcons, onRemoveIcons, changeProject,
        onSearchDel, onPointRefresh, onSearchPointName, onChangeTrStyle, onIsDelWatchPoints, onManualAddPointWin, onManualAddPointBtn, paginationRefresh, /* onDragWatchPoints, onDropMonitorPoints;*/

        storage = window.localStorage;


    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $tableWatch: $container.find("#tableWatch"),
            $tableWatchTbody: $container.find("#tableWatchTbody"),
            $tableMonitorTbody: $container.find("#tableMonitorTbody"),
            $select_project: $container.find("#select_project"),
            $pointRefresh: $container.find("#pointRefresh"),
            $searchPointName: $container.find("#searchPointName"),
            $searchDel: $container.find("#searchDel"),
            $divPointManagerPage: $container.find("#divPointManagerPage"),
            $joinCurve: $container.find("#joinCurve"),
            $joinMonitoring: $container.find("#joinMonitoring"),
            $delSelect: $container.find("#delSelect"),
            $isDelPointsBtnWin: $container.find("#isDelPointsBtnWin"),
            $delPointsBtn: $container.find("#delPointsBtn"),
            $manualAddPoint: $container.find("#manualAddPoint"),
            $manualAddPointWin: $container.find("#manualAddPointWin"),
            $manualAddPointBtn: $container.find("#manualAddPointBtn"),
            $pointsContent: $container.find("#pointsContent"),
            $realTimePagination: $container.find("#realTimePagination"),
            $realTimePaginationWrapper: $container.find("#realTimePaginationWrapper"),
            $tableOperatingRecord: $container.find("#tableOperatingRecord")
        };
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container, page) {
        stateMap.$container = $container;
        $.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();

            jqueryMap.$pointRefresh.on('click', onPointRefresh);
            jqueryMap.$searchPointName.on('keyup', onSearchPointName);
            jqueryMap.$searchDel.on('click', onSearchDel);
            jqueryMap.$divPointManagerPage.on('click', '.pointList tbody tr', onChangeTrStyle);
            jqueryMap.$divPointManagerPage.on('mouseover', '.pointList tbody tr', onAddIcons);
            jqueryMap.$divPointManagerPage.on('mouseout', '.pointList tbody tr', onRemoveIcons);
            jqueryMap.$divPointManagerPage.on('click', '.delWatchPoint', delWatchPoint);
            jqueryMap.$divPointManagerPage.on('click', '.joinMonitoring', joinMonitoring);
            jqueryMap.$divPointManagerPage.on('click', '.joinCurve', addCurve);
            jqueryMap.$joinCurve.on('click', createCurve);
            jqueryMap.$delSelect.on('click', onIsDelWatchPoints);
            jqueryMap.$joinMonitoring.on('click', joinMonitoringMore);
            jqueryMap.$delPointsBtn.on('click', delWatchPointsAll);
            jqueryMap.$manualAddPoint.on('click', onManualAddPointWin);
            jqueryMap.$manualAddPointBtn.on('click', onManualAddPointBtn);

            jqueryMap.$select_project.change(changeProject);

            if (storage.getItem("current_project")) {
                jqueryMap.$select_project.val(storage.getItem("current_project"));
                loadPointList(page);
            }
        })
    };

    destroy = function () {
        if (location.hash.substr(0, 13) != "#realTimeData") {
            clearInterval(chartTimer);
            stateMap.selectedList = [];
            stateMap.pointCurveList = [];
            stateMap.watchList = [];
            stateMap.currentPage = 1;
        }
    };

//---------DOM操作------
    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.page_size);
        if (!totalNum) {
            return;
        }

        jqueryMap.$realTimePaginationWrapper.html('<ul id="realTimePagination" class="pagination"></ul>');

        while (totalPages < stateMap.currentPage && stateMap.currentPage > 1) {
            stateMap.currentPage = stateMap.currentPage - 1;
        }
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: stateMap.currentPage ? stateMap.currentPage : 1,
            totalPages: !totalPages ? 1 : totalPages,
            onPageClick: function (event, page) {
                stateMap.currentPage = page;
                location.hash = "#realTimeData/" + page;
            }
        };

        if (stateMap.currentPage) {
            pageOption['startPage'] = stateMap.currentPage ? stateMap.currentPage : 1;
        }

        stateMap.pagination = $("#realTimePagination").twbsPagination(pageOption);
    };

//---------方法---------
    searchList = function () {//根据关键字，控制点名列表显示
        var keyWordVal = $.trim(jqueryMap.$searchPointName.val());
        var val = keyWordVal.toLowerCase();
        var $tbody = jqueryMap.$tableWatchTbody;
        var pointHtml = '';
        if (val == "") {//为空不进行筛选
            for (var i = 0; i < stateMap.pointInfoList.length; i++) {
                var ptList = stateMap.pointInfoList[i];
                pointHtml += '<tr data-point="' + ptList.name + '" data-value="' + ptList.value + '"><td>' + (i + 1) + '</td><td class="point_' + ptList.name + '">' + ptList.name + '</td><td class="value_' + ptList.value + '">' + ptList.value + '</td></tr>';
            }
        } else {//不为空进行关键字筛选
            var showPointArr = [];
            for (var i = 0; i < stateMap.pointInfoList.length; i++) {
                var ptList = stateMap.pointInfoList[i];
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
                pointHtml += '<tr data-point="' + name + '" data-value="' + ptList.value + '" data-time="' + ptList.time + '"><td>' + (i + 1) + '</td><td class="point_' + name + '">' + keyWordName + '</td><td class="value_' + ptList.value + '">' + ptList.value + '</td><td><span>' + ptList.time + '</span><span class="iconGroup dn"><span class="glyphicon glyphicon-flash cp joinCurve" aria-hidden="true"></span><span class="glyphicon glyphicon-headphones cp joinMonitoring" aria-hidden="true"></span><span class="glyphicon glyphicon-refresh cp" aria-hidden="true"></span></span></td></tr>';
            }
        }
        $tbody.html(pointHtml);
    };

    changeProject = function () { //加载点名列表,观察者列表
        stateMap.currentPage = 1;
        stateMap.pointCurveList = [];
        storage.setItem("current_project", jqueryMap.$select_project.val());
        jqueryMap.$searchPointName.val("");
        loadPointList(stateMap.currentPage);
        clearInterval(chartTimer);
        $("#tableOperatingRecord").remove();
        location.hash = "#realTimeData/" + 1;
    };

    loadPointList = function (page) { //更换项目
        refreshPointList(page);
        initProjectPointList();
    };

    refreshPointList = function (page) { //加载点名列表
        //page = typeof(page) == ("object" || "undefined") ? 1 : page;
        if (page) {
            page = page;
        } else {
            page = 1;
        }
        //stateMap.currentPage = page;
        var project_id = jqueryMap.$select_project.val();
        var search_val = jqueryMap.$searchPointName.val().trim();
        if (!search_val) {
            search_val = '';
        }

        if (project_id) {
            return WebAPI.post("/get_realtimedata_with_time", {
                proj: project_id,
                current_page: page,
                page_size: configMap.page_size,
                search_text: search_val
            }).done(function (result) {
                var total = result.total, list = result.list;
                if (!total) {
                    stateMap.currentPage = 1;
                    jqueryMap.$tableWatchTbody.html("");
                    return;
                }

                list.sort(function (a, b) { //点名排序
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                });
                stateMap.pointInfoList = list;
                var pointListHtml = '';
                for (var i = 0; i < list.length; i++) {
                    var point = list[i];
                    pointListHtml += '<tr data-point="' + point.name + '" data-value="' + point.value + '" data-time="' + point.time + '"><td>' + (i + 1) + '</td><td class="point_' + point.name + '">' + point.name + '</td><td class="value_' + point.value + '">' + point.value + '</td><td><span>' + point.time + '</span><span class="iconGroup dn"><span class="glyphicon glyphicon-flash cp joinCurve" aria-hidden="true"></span><span class="glyphicon glyphicon-headphones cp joinMonitoring" aria-hidden="true"></span><span class="glyphicon glyphicon-refresh cp" aria-hidden="true"></span></span></td></tr>';
                }

                jqueryMap.$tableWatchTbody.html(pointListHtml);
                paginationRefresh(total);
                if (search_val) {
                    searchList(search_val);
                }
            }).fail(function () {
                //alert("请求后台数据失败");
            }).always(function () {
                //Spinner.stop();
            });
        }

    };

    initProjectPointList = function () { //加载观察者列表
        var project_id = jqueryMap.$select_project.val();
        var savedPointsPromise, savedPoints = [];
        savedPointsPromise = WebAPI.get('/admin/dataPointManager/loadData/' + project_id);

        $.when(refreshPointList(), savedPointsPromise).done(function (pointListResult, savedPointsResult) {
            if (savedPointsResult[1]) {
                loadMonitorList(savedPointsResult[0].list);
            }
        });
    };

    loadMonitorList = function (pointList) {//刷新点名列表
        jqueryMap.$tableMonitorTbody.empty();
        var html = '';
        for (var i = 0; i < pointList.length; i++) {
            var point = pointList[i];
            html += '<tr class="pointItem" data-point="' + point.name + '" data-value="' + point.value + '" data-time="' + point.time + '"><td class="point_' + point.name + '">' + point.name + '</td><td class="value_' + point.value + '">' + point.value + '</td><td><span>' + point.time + '</span><span class="iconGroup dn"><span class="glyphicon glyphicon-flash cp joinCurve" aria-hidden="true"></span> <span class="glyphicon glyphicon-trash cp delWatchPoint" aria-hidden="true"></span><span class="glyphicon glyphicon-refresh cp" aria-hidden="true"></span></td></tr>';
        }
        jqueryMap.$tableMonitorTbody.append(html);
    };

    joinMonitoring = function () { //点击加入监视按钮图标将一个点加入观察列表
        var $item, $selectedItem, pointsToAdd, pointsMonitored;
        $selectedItem = $(this).parents("tr");
        pointsToAdd = $selectedItem.map(function (index, item) {
            $item = $(item);
            return {name: $item.data('point'), value: $item.data('value'), time: $item.data('time')}
        }), pointsMonitored = $('#tableMonitor tr.pointItem').map(function (index, item) {
            $item = $(item);
            return {name: $item.data('point'), value: $item.data('value'), time: $item.data('time')}
        });

        var pointList = [];
        for (var i = 0; i < pointsToAdd.length; i++) {
            pointList.push(pointsToAdd[i]);
        }
        for (var i = 0; i < pointsMonitored.length; i++) {
            pointList.push(pointsMonitored[i]);
        }

        var pointNameList = [];
        for (var i = 0; i < pointList.length; i++) {
            if ($.inArray(pointList[i].name, pointNameList) === -1) {
                pointNameList.push(pointList[i].name);
                stateMap.selectedList.push(pointList[i]);
            }
        }

        var pointUpdateList = [];
        for (var i = 0; i < stateMap.selectedList.length; i++) {
            pointUpdateList.push(stateMap.selectedList[i].name);
        }

        WebAPI.post('/admin/dataPointManager/update/', {
            projectId: jqueryMap.$select_project.val(),
            points: pointUpdateList.join(',')
        }).done(function (result) {
            if (result.success) {
                loadMonitorList(stateMap.selectedList);
                stateMap.selectedList = [];
                $selectedItem.removeClass('active');
            }
        });
    };

    joinMonitoringMore = function () { //点击加入监视按钮将一个或多个点加入观察列表
        var $item, $selectedItem, pointsToAdd, pointsMonitored;
        $selectedItem = $('#tableWatch tr.active');
        pointsToAdd = $selectedItem.map(function (index, item) {
            $item = $(item);
            return {name: $item.data('point'), value: $item.data('value'), time: $item.data('time')}
        }), pointsMonitored = $('#tableMonitor tr.pointItem').map(function (index, item) {
            $item = $(item);
            return {name: $item.data('point'), value: $item.data('value'), time: $item.data('time')}
        });

        var pointList = [];
        for (var i = 0; i < pointsToAdd.length; i++) {
            pointList.push(pointsToAdd[i]);
        }
        for (var i = 0; i < pointsMonitored.length; i++) {
            pointList.push(pointsMonitored[i]);
        }

        var pointNameList = [];
        for (var i = 0; i < pointList.length; i++) {
            if ($.inArray(pointList[i].name, pointNameList) === -1) {
                pointNameList.push(pointList[i].name);
                stateMap.selectedList.push(pointList[i]);
            }
        }

        var pointUpdateList = [];
        for (var i = 0; i < stateMap.selectedList.length; i++) {
            pointUpdateList.push(stateMap.selectedList[i].name);
        }

        WebAPI.post('/admin/dataPointManager/update/', {
            projectId: jqueryMap.$select_project.val(),
            points: pointUpdateList.join(',')
        }).done(function (result) {
            if (result.success) {
                loadMonitorList(stateMap.selectedList);
                stateMap.selectedList = [];
                $selectedItem.removeClass('active');
            }
        });
    };

    addCurve = function () {
        var point = $(this).closest('tr').data('point');
        stateMap.pointCurveList.push(point);
        joinCurve();
    };

    createCurve = function () {
        stateMap.pointCurveList = [];
        var $selectedItem = $("#tableWatch tbody tr.active, #tableMonitor tbody tr.active"),
            $point_name_list,
            point_name_list;
        if (!$selectedItem.length) {
            return;
        }
        if ($selectedItem.length > 10) {
            alert('最多只能加入十条记录');
            return;
        }

        $point_name_list = $selectedItem.map(function (index, item) {
            return $(item).data('point');
        });
        point_name_list = $point_name_list.toArray();
        point_name_list = point_name_list.filter(function (item, pos) {
            return point_name_list.indexOf(item) == pos;
        });
        stateMap.pointCurveList = point_name_list;
        joinCurve();
    };

    joinCurve = function () {
        var date_start = new Date(), data_end = new Date();
        date_start.setDate(date_start.getDate()-3);
        data_end.setDate(data_end.getDate());
        WebAPI.post("/get_history_data_padded_reduce", {
            projectId: jqueryMap.$select_project.val(),
            pointList: stateMap.pointCurveList,
            //timeStart: "2015-07-15 16:50:51",
            //timeEnd: "2015-07-15 18:30:51",
            timeStart: date_start.format("yyyy-MM-dd HH:mm:ss"),
            timeEnd: data_end.format("yyyy-MM-dd HH:mm:ss"),
            timeFormat: "m5"
        }).done(function (data) {
            if (data || data != {}) {
                stateMap.chart = new HistoryChart(data, date_start, data_end).init();
            } else {
                alert('生成历史曲线失败');
                return;
            }
        }).fail(function (e) {
            alert('生成历史曲线失败');
        }).always(function () {
            //Spinner.stop();
        });
    };

    delWatchPoint = function () { //点击删除观察列表中选中的某一个点
        var $tr = $(this).parents("tr"),
            pointsToUpdateList = $tr.siblings("tr").map(function (index, item) {
                return $(item).data('point');
            });

        WebAPI.post('/admin/dataPointManager/update/', {
            projectId: jqueryMap.$select_project.val(),
            points: pointsToUpdateList.toArray().join(',')
        }).done(function (result) {
            if (result.success) {
                $tr.remove();
            }
        });
    };

    delWatchPoints = function () { //点击删除观察列表中选中的点
        var pointsToUpdateList, $selectedItem, $notSelectedItem;
        $selectedItem = $('#tableMonitor tr.pointItem.active');
        $notSelectedItem = $('#tableMonitor tr.pointItem:not(.active)');
        pointsToUpdateList = $notSelectedItem.map(function (index, item) {
            return $(item).data('point');
        });

        WebAPI.post('/admin/dataPointManager/update/', {
            projectId: jqueryMap.$select_project.val(),
            points: pointsToUpdateList.toArray().join(',')
        }).done(function (result) {
            if (result.success) {
                $selectedItem.remove();
            }
        });
    };

    delWatchPointsAll = function () { //点击删除观察列表中所有的点
        WebAPI.post('/admin/dataPointManager/update/', {
            projectId: jqueryMap.$select_project.val(),
            points: ''
        }).done(function (result) {
            if (result.success) {
                jqueryMap.$tableMonitorTbody.find("tr").remove();
                jqueryMap.$isDelPointsBtnWin.modal("hide");
            }
        });
    };

//---------事件---------
    onPointRefresh = function () { //点击刷新按钮
        //Spinner.spin($("#divPointManagerPage")[0]);
        jqueryMap.$searchPointName.val("");
        refreshPointList();
    };

    onSearchPointName = function (e) { //查询输入框的
        if (e.keyCode == 13) {
            stateMap.currentPage = 1;
            refreshPointList(1);
        }
    };

    onSearchDel = function () { //删除查询关键字
        jqueryMap.$searchPointName.val("");
        refreshPointList(1);
    };

    onChangeTrStyle = function (e) { //切换点击样式
        if (!$(e.target).closest(".iconGroup").length) {
            var $this = $(this);
            if ($this.is('.active')) {
                $this.removeClass('active');
            } else {
                $this.addClass('active');
            }
        }
    };

    onIsDelWatchPoints = function () { //是否删除观察点列表所有点
        var $selectedItem = $('#tableMonitor tr.pointItem.active');
        if ($selectedItem.length) {
            delWatchPoints();
        } else {
            jqueryMap.$isDelPointsBtnWin.modal();
        }
    };

    onAddIcons = function (e) { //滑入记录点，加载图标以供操作
        $(this).find(".iconGroup").show();
    };

    onRemoveIcons = function (e) { //滑出记录点，删除图标
        $(this).find(".iconGroup").hide();
    };

    onManualAddPointWin = function () {
        jqueryMap.$manualAddPointWin.modal();
    };

    onManualAddPointBtn = function () { // 手动加入点名
        var list = jqueryMap.$pointsContent.val().split("\n");
        var pointNameList = [];
        var $watchTr = $('#tableMonitor tr.pointItem');
        for (var i = 0; i < $watchTr.length; i++) {
            pointNameList.push($watchTr.eq(i).data('point'));
        }

        for (var i = 0; i < list.length; i++) {
            pointNameList.push(list[i]);
        }

        stateMap.watchList = $.unique(pointNameList);

        WebAPI.post('/admin/dataPointManager/update/', {
            projectId: jqueryMap.$select_project.val(),
            points: stateMap.watchList.join(',')
        }).done(function (result) {
            if (result.success) {
                WebAPI.get('/admin/dataPointManager/loadData/' + jqueryMap.$select_project.val()).done(function (result) {
                    loadMonitorList(result.list);
                    stateMap.watchList = [];
                    jqueryMap.$manualAddPointWin.modal("hide");
                });
            }
        });
    };

//---------Exports---------
    beop.view = beop.view || {};

    beop.view.real_time_data = {
        configModel: configModel,
        init: init,
        destroy: destroy,
        refreshPointList: refreshPointList
    };
}(beop || (beop = {})));

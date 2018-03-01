(function (beop) {
    var pageSize = 10;
    if ($(window).height() > 800) {
        pageSize = 15;
    }
    var configMap = {
            htmlURL: '/point_tool/html/realTimeData',
            settable_map: {
                sheetModel: true
            },
            sheetModel: null,
            page_size: pageSize,
            order: undefined
        },

        stateMap = {
            currentPage: 1,
            pointInfoList: null,
            chart: {},
            pointCurveList: [],  // 曲线列表 （添加曲线时用）
            refreshMonitorList: [],  // 刷新监视列表（进行加入监视）
            watchList: []  // 监视列表（手动加点需要用）
        },
        jqueryMap = {},
        setJqueryMap, configModel,
        init, destroy,
        refreshPointList, loadPointList, initProjectPointList, loadMonitorList, searchList, joinCurve, addCurve,
        joinMonitoring, tableWatchOrder, delWatchPoint, delWatchPointsSelect, delAllCurves, changeProject,
        onSearchDel, onSearchPointName, onIsDelWatchPoints, onIsDelCurves, onManualAddPointWin, onManualAddPointBtn,
        paginationRefresh, initialValueReset, onChartZoomIn, zoomInChartWinHide, refreshMonitorIcon, refreshCurveIcon, uniqueRefreshMonitorList,

        storage = window.localStorage;


    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $tableWatch: $container.find("#tableWatch"),
            $tableWatchOrder: $container.find(".tableWatchOrder"),
            $tableMonitor: $container.find("#tableMonitor"),
            $tableWatchTbody: $container.find("#tableWatchTbody"),
            $tableMonitorTbody: $container.find("#tableMonitorTbody"),
            $select_project: $container.find("#select_project"),
            $searchPointName: $container.find("#searchPointName"),
            $searchDel: $container.find("#searchDel"),
            $divPointManagerPage: $container.find("#divPointManagerPage"),
            $delSelect: $container.find("#delSelect"),
            $isDelPointsBtnWin: $container.find("#isDelPointsBtnWin"),
            $delPointsBtn: $container.find("#delPointsBtn"),
            $manualAddPoint: $container.find("#manualAddPoint"),
            $manualAddPointWin: $container.find("#manualAddPointWin"),
            $manualAddPointBtn: $container.find("#manualAddPointBtn"),
            $pointsContent: $container.find("#pointsContent"),
            $realTimePagination: $container.find("#realTimePagination"),
            $realTimePaginationWrapper: $container.find("#realTimePaginationWrapper"),
            $tableOperatingRecord: $container.find("#tableOperatingRecord"),
            $dialogContent: $container.find("#dialogContent"),
            $dialogContentPrompt: $container.find("#dialogContentPrompt"),
            $chartZoomIn: $container.find("#chartZoomIn"),
            $zoomInChartBox: $container.find("#zoomInChartBox"),
            $zoomInChartWin: $container.find("#zoomInChartWin"),
            $delAllCurve: $container.find("#delAllCurve"),
            $delCurvesBtn: $container.find("#delCurvesBtn"),
            $isDelCurvesBtnWin: $container.find("#isDelCurvesBtnWin")
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
        //stateMap.currentPage = page;
        $.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            jqueryMap.$searchPointName.on('keyup', onSearchPointName);
            jqueryMap.$searchDel.on('click', onSearchDel);
            jqueryMap.$tableWatchOrder.on('click', tableWatchOrder);
            jqueryMap.$divPointManagerPage.on('click', '.delWatchPoint', delWatchPoint);
            jqueryMap.$divPointManagerPage.on('click', '.joinMonitoring', joinMonitoring);
            jqueryMap.$divPointManagerPage.on('click', '.joinCurve', addCurve);
            jqueryMap.$delSelect.on('click', onIsDelWatchPoints);
            jqueryMap.$delAllCurve.on('click', onIsDelCurves);
            jqueryMap.$delCurvesBtn.on('click', delAllCurves);
            jqueryMap.$delPointsBtn.on('click', delWatchPointsSelect);
            jqueryMap.$manualAddPoint.on('click', onManualAddPointWin);
            jqueryMap.$manualAddPointBtn.on('click', onManualAddPointBtn);
            jqueryMap.$chartZoomIn.on('click', onChartZoomIn);
            jqueryMap.$zoomInChartWin.on('hidden.bs.modal', zoomInChartWinHide);

            jqueryMap.$select_project.change(changeProject);

            if (storage.getItem("current_project")) {
                jqueryMap.$select_project.val(storage.getItem("current_project"));
                loadPointList(page);
            }
            I18n.fillArea(jqueryMap.$container);
        })
    };

    destroy = function () {
        //if (location.hash.substr(0, 13) != "#realTimeData") {
        if (!(/^#realTimeData(\/|\/\d+)?$/.test(location.hash))) {
            initialValueReset();
        }
    };

    initialValueReset = function () { // 离开本页或者重选项目时将记录的值进行初始化
        clearInterval(chartTimer);
        if (stateMap.chart && stateMap.chart.historyChart) {
            stateMap.chart.historyChart.dispose();
            stateMap.chart = {};
        }
        stateMap.refreshMonitorList = [];
        stateMap.pointCurveList = [];
        stateMap.watchList = [];
        stateMap.currentPage = 1;
        jqueryMap.$searchPointName.val("");
    };

//---------DOM操作------
    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.page_size);
        if (!totalNum) {
            return;
        }

        jqueryMap.$realTimePaginationWrapper.empty().html('<ul id="realTimePagination" class="pagination"></ul>');

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
    searchList = function () {//根据关键字，控制点名列表显示 -- 为空不进行筛选
        var keyWordVal = $.trim(jqueryMap.$searchPointName.val());
        var pointHtml = '', pointInfo;
        var reg = new RegExp("(" + keyWordVal + ")", "gi");
        for (var i = 0; i < stateMap.pointInfoList.length; i++) {
            pointInfo = stateMap.pointInfoList[i];
            var remark = pointInfo.remark ? pointInfo.remark : " --- ";
            var keyWordName = pointInfo.name.replace(reg, '<span class="keyword">$1</span>');
            pointHtml += '<tr data-point="' + pointInfo.name + '" data-value="' + pointInfo.value + '" data-time="' + pointInfo.time + '" data-remark="' + remark + '">' +
                '<td class="point_' + pointInfo.name + '"><span class="db">' + keyWordName + '</span><span class="remark">' + remark + '</span></td>' +
                '<td class="value_' + pointInfo.value + '">' + pointInfo.value + '</td>' +
                '<td>' +
                '<span>' + pointInfo.time + '</span>' +
                '<span class="iconGroup">' +
                '<span class="svg-icon addToCurve ml10 cp joinCurve" aria-hidden="true" i18n="title=debugTools.realTimeData.ADD_TO_CURVE"></span>' +
                '<span class="svg-icon addToMonitor cp joinMonitoring" aria-hidden="true" i18n="title=debugTools.realTimeData.ADD_TO_WATCH"></span>' +
                '</td></tr>';
        }

        jqueryMap.$tableWatchTbody.html(pointHtml);
        I18n.fillArea(jqueryMap.$container);
    };

    changeProject = function () { //更换项目
        initialValueReset();
        storage.setItem("current_project", jqueryMap.$select_project.val());
        loadPointList(stateMap.currentPage);
        $("#tableOperatingRecord").remove();
        location.hash = "#realTimeData/" + 1;
    };

    loadPointList = function (page) { //加载点名列表,观察者列表
        refreshPointList(page);
        initProjectPointList();
    };

    refreshPointList = function (page) { //加载点名列表
        if (!page) {
            page = 1;
        }

        var project_id = jqueryMap.$select_project.val();
        var search_val = jqueryMap.$searchPointName.val().trim();
        if (!search_val) {
            search_val = '';
        }

        if (project_id) {
            return WebAPI.post("/admin/dataPointManager/search/", {
                projectId: project_id,
                current_page: page,
                page_size: configMap.page_size,
                text: search_val,
                order: configMap.order
            }).done(function (result) {
                var total = result.total, list = result.list;
                if (!total) {
                    stateMap.currentPage = 1;
                    jqueryMap.$tableWatchTbody.html("");
                    paginationRefresh(1);
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
                    var remark = point.remark ? point.remark : " --- ";
                    pointListHtml += '<tr data-point="' + point.name + '" data-value="' + point.value + '" data-time="' + point.time + '" data-remark="' + remark + '">' +
                        '<td class="point_' + point.name + '"><span class="db">' + point.name + '</span><span class="remark">' + remark + '</span></td>' +
                        '<td class="value_' + point.value + '">' + point.value + '</td>' +
                        '<td>' +
                        '<span>' + point.time + '</span>' +
                        '<span class="iconGroup">' +
                        '<span class="svg-icon addToCurve ml10 cp joinCurve" aria-hidden="true" i18n="title=debugTools.realTimeData.ADD_TO_CURVE"></span>' +
                        '<span class="svg-icon addToMonitor cp joinMonitoring" aria-hidden="true" i18n="title=debugTools.realTimeData.ADD_TO_WATCH"></span>' +
                        '</td>' +
                        '</tr>';
                }

                jqueryMap.$tableWatchTbody.html(pointListHtml);
                paginationRefresh(total);
                if (search_val) {
                    searchList(search_val);
                }
                I18n.fillArea(jqueryMap.$tableWatchTbody);
                refreshCurveIcon();
                refreshMonitorIcon();
            }).fail(function () {
            }).always(function () {
            });
        }
    };
    //点名列表排序
    tableWatchOrder = function () {
        var $this = $(this), icon = $this.find('.glyphicon');
        var decline = icon.hasClass('glyphicon-sort-by-attributes-alt');
        var rise = icon.hasClass('glyphicon-sort-by-attributes');
        if (!rise && !decline) {
            configMap.order = $this.data('value') === 'pointValue' ? 'pointvalue asc' : 'time asc';
            icon.addClass('glyphicon-sort-by-attributes');
        } else if (decline) {
            configMap.order = $this.data('value') === 'pointValue' ? 'pointvalue asc' : 'time asc';
            icon.removeClass('glyphicon-sort-by-attributes-alt').addClass('glyphicon-sort-by-attributes');
        } else if (rise) {
            configMap.order = $this.data('value') === 'pointValue' ? 'pointvalue desc' : 'time desc';
            icon.removeClass('glyphicon-sort-by-attributes').addClass('glyphicon-sort-by-attributes-alt');
        }
        refreshPointList();
    };

    initProjectPointList = function () { //加载观察者列表
        spinner.spin(stateMap.$container.get(0));
        var project_id = jqueryMap.$select_project.val();
        var savedPointsPromise;
        savedPointsPromise = WebAPI.get('/admin/dataPointManager/loadData/' + project_id);

        $.when(refreshPointList(), savedPointsPromise).done(function (pointListResult, savedPointsResult) {
            if (savedPointsResult[1]) {
                stateMap.refreshMonitorList = savedPointsResult[0].list;
                loadMonitorList(savedPointsResult[0].list);
            }
        }).always(function () {
            spinner.stop();
        });
    };

    loadMonitorList = function (pointList) {//刷新观察者列表
        jqueryMap.$tableMonitorTbody.empty();
        var html = '';
        for (var i = 0; i < pointList.length; i++) {
            var point = pointList[i];
            var remark = point.remark ? point.remark : " --- ";
            html += '<tr class="pointItem" data-point="' + point.name + '" data-value="' + point.value + '" data-time="' + point.time + '" data-remark="' + remark + '">' +
                '<td class="point_' + point.name + '"><span class="db">' + point.name + '</span><span class="remark">' + remark + '</span></td>' +
                '<td class="value_' + point.value + '">' + point.value + '</td>' +
                '<td>' +
                '<span>' + point.time + '</span>' +
                '<span class="iconGroup">' +
                '<span class="svg-icon addToCurve ml10 cp joinCurve" aria-hidden="true" i18n="title=debugTools.realTimeData.ADD_TO_CURVE"></span>' +
                '<span class="glyphicon glyphicon-trash cp delWatchPoint" aria-hidden="true" i18n="title=common.DELETE"></span>' +
                '</td>' +
                '</tr>';
        }
        jqueryMap.$tableMonitorTbody.append(html);
        refreshMonitorIcon();
        I18n.fillArea(jqueryMap.$container);
    };

    refreshMonitorIcon = function () { // 刷新加入观察者图标
        var pointNameList = [];
        for (var i = 0; i < stateMap.refreshMonitorList.length; i++) {
            pointNameList.push(stateMap.refreshMonitorList[i].name);
        }
        jqueryMap.$tableWatchTbody.find(".addToMonitor").each(function (index, item) {
            var $item = $(item), $tr = $item.parents("tr"), name = $tr.data('point');
            if ($.inArray(name, pointNameList) !== -1) {
                $item.addClass('selected').attr("i18n", 'title=debugTools.realTimeData.ADD_WATCH_ALREADY');
            } else {
                $item.removeClass('selected').attr("i18n", 'title=debugTools.realTimeData.ADD_TO_WATCH');
            }
        });
        I18n.fillArea(jqueryMap.$container);
    };

    refreshCurveIcon = function () { // 刷新加入曲线图标
        jqueryMap.$divPointManagerPage.find(".joinCurve").each(function (index, item) {
            var $item = $(item), $tr = $item.parents("tr"), name = $tr.data('point');
            if ($.inArray(name, stateMap.pointCurveList) !== -1) {
                $item.addClass('selected').attr("i18n", 'title=debugTools.realTimeData.ADD_CURVE_ALREADY');
            } else {
                $item.removeClass('selected').attr("i18n", 'title=debugTools.realTimeData.ADD_TO_CURVE');
            }
        });
        I18n.fillArea(jqueryMap.$container);
    };

    uniqueRefreshMonitorList = function () { // 对监视列表数组去重
        var uniqueList = [], pointList = [];
        for (var i = 0; i < stateMap.refreshMonitorList.length; i++) {
            if ($.inArray(stateMap.refreshMonitorList[i].name, pointList) === -1) {
                uniqueList.push(stateMap.refreshMonitorList[i]);
                pointList.push(stateMap.refreshMonitorList[i].name);
            }
        }
        stateMap.refreshMonitorList = uniqueList;
    };

    joinMonitoring = function () { //点击加入监视按钮图标将一个点加入观察列表
        var $this = $(this), $tr = $this.parents("tr"), pointList = [];
        if ($this.hasClass('selected')) { // 已加入观察列表
            return;
        } else {
            $this.addClass("selected");
            stateMap.refreshMonitorList.push({ // 未加入观察列表
                name: $tr.data('point'),
                value: $tr.data('value'),
                time: $tr.data('time'),
                remark: $tr.data('remark')
            });
            uniqueRefreshMonitorList();
            for (var i = 0; i < stateMap.refreshMonitorList.length; i++) {
                pointList.push(stateMap.refreshMonitorList[i].name);
            }
            WebAPI.post('/admin/dataPointManager/update/', {
                projectId: jqueryMap.$select_project.val(),
                points: pointList.join(',')
            }).done(function (result) {
                if (result.success) {
                    loadMonitorList(stateMap.refreshMonitorList);
                    refreshCurveIcon();
                }
            });
        }
    };

    addCurve = function () {
        var $this = $(this), $tr = $this.closest('tr'), point = $tr.data('point');
        if ($this.hasClass('selected')) { // 已加入曲线
            return;
        } else {
            $this.addClass("selected");
            stateMap.pointCurveList.push(point);
            refreshCurveIcon();
            joinCurve(jqueryMap.$dialogContent);
        }
    };

    joinCurve = function ($targetBox) {
        var date_start = new Date(), data_end = new Date();
        date_start.setDate(date_start.getDate() - 1);
        data_end.setDate(data_end.getDate());
        WebAPI.post("/get_history_data_padded_reduce", {
            projectId: jqueryMap.$select_project.val(),
            pointList: stateMap.pointCurveList,
            timeStart: date_start.format("yyyy-MM-dd HH:mm:ss"),
            timeEnd: data_end.format("yyyy-MM-dd HH:mm:ss"),
            timeFormat: "m5"
        }).done(function (data) {
            if (data && (!$.isEmptyObject(data))) { // 如果data 存在并且data 不是一个空对象
                var chart = new HistoryChart(data, date_start, data_end, $targetBox);
                chart.init();
                stateMap.chart = chart;
                jqueryMap.$dialogContent.removeAttr("i18n");
            }
        });
    };

    delAllCurves = function () { //点击删除观察列表中选中的点或观察列表中所有的点
        stateMap.pointCurveList = [];
        $("#tableOperatingRecord").remove();
        clearInterval(chartTimer);
        if (stateMap.chart && stateMap.chart.historyChart) {
            stateMap.chart.historyChart.dispose();
            stateMap.chart = {};
        }
        refreshCurveIcon();
        jqueryMap.$isDelCurvesBtnWin.modal('hide');

    };

    delWatchPoint = function () { //点击删除观察列表中选中的某一个点
        var $this = $(this), $tr = $this.parents("tr"), point = $tr.data('point'), pointList = [];
        uniqueRefreshMonitorList();
        for (var i = 0; i < stateMap.refreshMonitorList.length; i++) { // 从列表中删除选中的点
            if (point == stateMap.refreshMonitorList[i].name) {
                stateMap.refreshMonitorList.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < stateMap.refreshMonitorList.length; i++) {
            pointList.push(stateMap.refreshMonitorList[i].name);
        }

        WebAPI.post('/admin/dataPointManager/update/', {
            projectId: jqueryMap.$select_project.val(),
            points: pointList.join(',')
        }).done(function (result) {
            if (result.success) {
                $tr.remove();
                refreshMonitorIcon();
            }
        });
    };

    delWatchPointsSelect = function () { //点击删除观察列表中所有的点
        WebAPI.post('/admin/dataPointManager/update/', {
            projectId: jqueryMap.$select_project.val(),
            points: ''
        }).done(function (result) {
            if (result.success) {
                stateMap.refreshMonitorList = [];
                jqueryMap.$tableMonitorTbody.find("tr").remove();
                refreshMonitorIcon();
                jqueryMap.$isDelPointsBtnWin.modal("hide");
            }
        });
    };

    zoomInChartWinHide = function () { // 关闭放大chart窗口后，重新调用小图
        joinCurve(jqueryMap.$dialogContent);
    };

//---------事件---------
    onSearchPointName = function (e) { //查询输入框的
        if (e.keyCode == 13) {
            stateMap.currentPage = 1;
            refreshPointList(1);
        }
    };

    onSearchDel = function () { //删除查询关键字
        jqueryMap.$searchPointName.val("");
    };

    onIsDelWatchPoints = function () { // 弹出是否删除观察点列表所有点
        jqueryMap.$isDelPointsBtnWin.modal();
    };

    onIsDelCurves = function () { // 弹出是否删除所有曲线
        jqueryMap.$isDelCurvesBtnWin.modal();
    };

    onChartZoomIn = function (e) { // 放大chart图表
        setJqueryMap();
        if (jqueryMap.$tableOperatingRecord.length > 0) {
            jqueryMap.$zoomInChartWin.modal();
            joinCurve(jqueryMap.$zoomInChartBox);
        }
    };

    onManualAddPointWin = function () {
        jqueryMap.$manualAddPointWin.modal();
    };

    onManualAddPointBtn = function () { // 手动加入点名
        var list = jqueryMap.$pointsContent.val().split("\n");
        var pointNameList = [];
        var $watchTr = jqueryMap.$tableMonitor.find('tr.pointItem');
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
                    stateMap.refreshMonitorList = result.list;
                    stateMap.watchList = [];
                    loadMonitorList(result.list);
                    refreshMonitorIcon();
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

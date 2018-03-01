(function (beop) {
    var configMap = {
            settable_map: {
                sheetModel: true
            },
            operateType: {
                NEW: 'new',
                EDIT: 'edit'
            },
            timeFormatMap: {
                startView: 'month',
                autoclose: true,
                format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC),
                forceParse: false
            },
            dataType: {
                HISTORY: 'history',
                REAL_TIME: 'realTime'
            },
            cloudPointType: {
                MAPPING_POINT: 0,
                VIRTUAL_POINT: 1,
                CALC_POINT: 2
            },
            isWriteToRealTimeDb: {
                NOT_WRITE: 0,
                WRITE: 1
            },
            sheetModel: null
        },

        stateMap = {
            page_size: 50,
            order: null,
            autoCompleteList: [],
            currentPage: 1,
            logCurrentPage: 1,
            allPointCurrentPage: 1,
            pointTotal: 0,
            currentPointIndex: -1,
            operateType: '',
            editor: null,
            ExpertContainerUrl: '',
            currentEditorText: '',
            pointId: '',
            moduleName: '',
            datePickerInstanceStart: null,
            datePickerInstanceEnd: null,
            templateInstance: null,
            dateFormat: {},
            transmitLogic: '',
            onlineTestType: 1,
            addMultiplePointFormulaSearchValue: null,
            addMultiplePointValueFormulaValueArr: null,
            addMultiplePointValueFormulaIndex: -1,//当前选中的div的索引
            selectedPointValueList: [],
            selectedPointModuleNameList: [],
            selectedPointFormatList: [],
            selectedPointIdList: [],
            selectedPointLogicList: [],
            pointFormat: 'm5',
            historyInfoList: [],
            multiplePointList: [],
            pointErrorLogName: '',
            scrollTop: 0,
            requestTreeList: [],
            treeList: [],
            thingTreeList: [],
            zTreeInstance: null
        },
        jqueryMap = {},
        setJqueryMap, configModel, importSheet, init, pointUpdate,
        loadSheet, onNewPoint, onEditPoint, cloudPointConfirm, calcPointConfirm, logPaginationRefresh,
        deleteRows, deleteAllRows, onChangePointType, onfilerSort, setFilterSort, online_test,
        help, refreshDatePick, onPointTypeSelected, getPointsHandler, requestTimeHandler,
        online_test_request, setIsBatch, onConvertToCloud, import_from_template, save_as_template,
        loadPointTable, destroy, refreshEditor, onRefreshCloudPoint,
        loadLogPage, onOpenSinglePointSearchLog, onOpenSearchLog, onLogSearchCancel, logPageSizeChange, searchLogOfAWeek,
        searchLogOftoday, searchLogOfyesterday, searchLogOfOneHour, logSearch, logSinglePointSearch, logSearchDeleteAll, setDateFormat, serverRequestError,
        batch_history_quick_generate_data, batch_history_win, batchHistorySaveParam,
        batchHistoryPointValueAdd, refreshBatchHistoryUl, batchHistoryGenerate, batchGenerate, batchHistoryPointDelete, batchHistoryPointChange,
        getBatchHistoryPointMap, batchHistoryWinHideEvents, getModuleName, loadAutoCompleteList,
        getBatchHistorySelectedPointInfoList, dateTimeCheck, getStartTime, projectCheckDataSync, setRealTimeDb,
        pointNameCheck, setCloudPointTypeName, editCancel, changeAddType, renderAddPointForm, submitMultiplePoint,
        testMultiplePoint, makeHeaderFixedTableScroll, showMorePointValue,
        loadPointDetailPage, backToRefreshTable, sendPointRequest, confirmCalcPointRequest,
        getPointModel, getMultiplePointsByForm, multiplePointListCheck, getTestPromiseList,
        multiplePointHandle, pointRefresh, joinCurve, changePageSize, setPointErrorNum, tryParseJSON,
        historyPointsSearchConfirm, historyStatus, realTimeStatus, clearInputTime, hidePointTimeBox, isValidPointName,
        allPointsCalc, allPointPaginationRefresh, refreshAllPointTable, calcPointSave, requestCalcPointSave, getCalcPointModel,
        loadApiTree, zTreeOnDrag, zTreeOnDrop, zTreeOnDblClick, changeToZTreeNodes, showNodeTitle, insertContent, setTreeNodeIcon,
        enlargeFullScreen, treeSearch, batchAllPointsChange, btnPreservation, tableCopyBoxStyle, getApiFolderNameList;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $sheet: $container.find('.sheet'),
            $cloudPointWrapper: $('#cloudPointWrapper'),
            $point_add_btn: $container.find('#point_add'),
            $point_delete_btn: $container.find('#point_delete'),
            $point_refresh_btn: $container.find('#point_refresh'),
            $point_export: $container.find('#point_export'),
            $log_btn: $container.find('#log'),
            $logSearchBtn: $container.find('#logSearchBtn'),
            $text_search: $container.find('#text_search'),
            $cloudPointfilterSort: $container.find('#cloudPointfilterSort'),
            $uploadInput: $container.find('#uploadInput'),
            $count: $container.find('.count'),
            $paginationWrapper: $container.find('#paginationWrapper'),
            $editPointConfirm: $container.find('#editPointConfirm'),
            $editMappingPointConfirm: $container.find('#editMappingPointConfirm'),
            $editCalcPointConfirm: $container.find('#editCalcPointConfirm'),
            $pointForm: $container.find('#pointForm'),
            $point_edit: $container.find('#point_edit'),
            $point_id: $container.find('#point_id'),
            $point_name: $container.find('#point_name'),
            $pt_batchModal: $container.find('#pt_batchModal'),
            $point_notes: $container.find('#point_notes'),
            $point_notes_en: $container.find('#point_notes_en'),
            $editTitle: $container.find('#editTitle'),
            $datePickBox: $container.find('#datePickBox'),
            $point_format: $container.find('#point_format'),
            $online_test: $container.find('#online_test'),
            $online_test_process: $container.find('#test_process'),
            $onlineTestReturnInfo: $container.find('#onlineTestReturnInfo'),
            $dateTimeStart: $container.find('#dateTimeStart'),
            $dateTimeEnd: $container.find('#dateTimeEnd'),
            $pointConvert: $("#point_convert"),
            $setRealTimeDb: $("#setRealTimeDb"),
            $templateImportWinBox: $container.find('#templateImportWinBox'),
            $saveAsTemplateWinBox: $container.find('#saveAsTemplateWinBox'),
            $buttonGroup: $container.find('#buttonGroup'),
            $log: $container.find('#log'),
            $batchHistoryWin: $container.find('#batchHistoryWin'),
            $batchHistoryTimeStart: $container.find('#batchHistoryTimeStart'),
            $batchHistoryTimeEnd: $container.find('#batchHistoryTimeEnd'),
            $batchHistoryPointValue: $container.find('#batchHistoryPointValue'),
            $batchHistoryPoints: $container.find('#batchHistoryPoints'),
            $batchHistoryProgress: $container.find('#batchHistoryProgress'),
            $isBatch: $container.find('#isBatch'),
            $batchHistoryProgressInfo: $container.find('#batchHistoryProgressInfo'),
            $pointManagerCloudPointUl: $("#pointManagerCloudPointUl"),
            $cloudPointSourceSetBox: $("#cloudPointSourceSetBox"),
            $cloudPointTypeName: $("#cloudPointTypeName"),
            $pointManageWrapper: $container.find('#pointManageWrapper'),
            $isShowSubItem: $('#isShowSubItem'),
            $codeMirrorBox: $('#codeMirrorBox'),
            $cloudPointBtnBox: $('#cloudPointBtnBox'),
            $batchHistoryPointTime: $('#batchHistoryPointTime'),
            $historyStatus: $('#historyStatus'),
            $realTimeStatus: $('#realTimeStatus'),
            $historyPointsTimeStart: $('#historyPointsTimeStart'),
            $dataTypeStatusBox: $('#dataTypeStatusBox'),
            $historyPointsSearchConfirm: $('#historyPointsSearchConfirm'),
            $realTimeStatusTime: $('#realTimeStatusTime'),
            $historyTestTimePicker: $('#historyTestTimePicker'),
            $batchHistoryPointsBox: $('#batchHistoryPointsBox')
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

    function CaclPoint() {
        this.input = null;
        this.formula = null;
        this.output = null;
        this.alias = null;
        this.flag = configMap.cloudPointType.CALC_POINT;
        this.format = 'm5';
    }

    CaclPoint.prototype = {
        getLogic: function () {
            if (!this.formula) {
                return null;
            }
            return BEOPUtil.logicContentHandle(this.formula + '(' + this.input + ')');

        },
        getModuleName: function () {
            return getModuleName(this.output);
        },
        test: function () {
            if (!this.input || !this.formula || !this.output || !this.getLogic()) {
                return $.Deferred().reject('input is empty');
            }
            if (!this.formula) {
                return $.Deferred().reject('formula is empty');
            }
            if (!this.output) {
                return $.Deferred().reject('output is empty');
            }
            return online_test_request(this.getLogic(), this.output, this.getModuleName());
        },
        getSaveModel: function () {
            return {
                value: this.output,
                logic: this.getLogic(),
                alias: this.alias,
                format: 'm5',
                flag: this.flag,
                moduleName: this.getModuleName()
            };
        }
    };

    init = function ($container, page, pointType) {
        stateMap.currentPointIndex = -1;
        stateMap.dataType = configMap.dataType.REAL_TIME;
        stateMap.$container = $container;
        stateMap.pointType = pointType;
        setJqueryMap();
        jqueryMap.$cloudPointBtnBox.html(beopTmpl('tpl_btn_group', {'pointType': pointType}));
        //加载算法服务器地址
        $.ajax({
            url: "/getExpertContainerUrl",
            type: "GET"
        }).done(function (result) {
            if (result) {
                stateMap.ExpertContainerUrl = result.data;
                loadAutoCompleteList();
            }
        });
        //加载tag树
        stateMap.tagTreePromise = WebAPI.post('tag/getThingTree', {
            projId: AppConfig.projectId,
            onlyGroupForRoot: true
        }).done(function (result) {
            if (result.thingTree && result.thingTree.length) {
                stateMap.thingTreeList = result.thingTree;
            }
        });

        if (stateMap.historyStatusPopover) {
            stateMap.historyStatusPopover.popover('destroy');
            $("#historyPointsTimeStart").closest('.popover').remove();
        }
        loadPointTable(page);
        stateMap.currentPage = parseInt(page);

        makeHeaderFixedTableScroll();
        $(window).resize(function () {
            makeHeaderFixedTableScroll();
        });
    };

    //---------DOM操作------

    allPointPaginationRefresh = function () {
        stateMap.allPointPageSize = 50;
        var totalPages = Math.ceil(stateMap.allPointList.length / stateMap.allPointPageSize);
        $("#allPointPaginationContainer").empty().html('<ul id="allPointPagination" class="pagination fr"></ul>');
        while (totalPages < stateMap.allPointCurrentPage && stateMap.allPointCurrentPage > 1) {
            stateMap.allPointCurrentPage = stateMap.allPointCurrentPage - 1;
        }
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: stateMap.allPointCurrentPage ? parseInt(stateMap.allPointCurrentPage) : 1,
            totalPages: !totalPages ? 1 : parseInt(totalPages),
            onPageClick: function (event, page) {
                stateMap.allPointCurrentPage = page;
                refreshAllPointTable(page);
            }
        };
        stateMap.pagination = $("#allPointPagination").twbsPagination(pageOption);
    };

    logPaginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / stateMap.logPageSize);
        $('#paginationContainer').empty().html('<ul id="logPagination" class="pagination"></ul>');
        while (totalPages < stateMap.logCurrentPage && stateMap.logCurrentPage > 1) {
            stateMap.logCurrentPage = stateMap.logCurrentPage - 1;
        }
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: stateMap.logCurrentPage ? parseInt(stateMap.logCurrentPage) : 1,
            totalPages: !totalPages ? 1 : parseInt(totalPages),
            onPageClick: function (event, page) {
                stateMap.logCurrentPage = page;
                logSearch(page);
            }
        };
        $("#logPagination").twbsPagination(pageOption);
        $('.logContainer').scrollTop(0);
    };

    refreshAllPointTable = function (currentPage) {
        var page = currentPage ? currentPage : 1;
        var pointList = [];
        for (var i = (page - 1) * stateMap.allPointPageSize; i < page * stateMap.allPointPageSize; i++) {
            pointList.push(stateMap.allPointList[i]);
            if (i == stateMap.allPointList.length - 1) {
                break;
            }
        }
        $("#pointCalcTbody").empty().html(beopTmpl('tpl_all_point_calc', {
            'pointList': pointList
        }));
        $("#pointCalcTableBox").scrollTop(0);
    };

    clearInputTime = function () {
        jqueryMap.$historyTestTimePicker.val('');
    };

    realTimeStatus = function () {
        stateMap.historyStatusPopover.popover('hide');
        //bootstrap 关闭popover会产生的bug
        //https://github.com/twbs/bootstrap/issues/16732
        stateMap.historyStatusPopover.data("bs.popover").inState.click = false;

        stateMap.dataType = configMap.dataType.REAL_TIME;
        jqueryMap.$cloudPointBtnBox.removeClass('history').addClass('real-time');
        loadSheet(1);
    };

    historyStatus = function () {
        stateMap.historyPointsTimeStart = $("#historyPointsTimeStart").datetime({
            startView: 'month',
            autoclose: true,
            format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC),
            forceParse: false
        });
        I18n.fillArea($("#cloudPointBtnBox"));
    };

    historyPointsSearchConfirm = function () {
        var timeVal = $("#historyPointsTimeStart").val().trim();
        if (!timeVal) {
            alert('The time can\'t be empty.');
            return;
        }

        stateMap.dataType = configMap.dataType.HISTORY;
        stateMap.historyDataTime = timeVal;
        loadSheet();
        stateMap.historyStatusPopover.popover('hide');
        //bootstrap 关闭popover会产生的bug
        //https://github.com/twbs/bootstrap/issues/16732
        stateMap.historyStatusPopover.data("bs.popover").inState.click = false;

        jqueryMap.$realTimeStatusTime.val(timeVal);
        jqueryMap.$cloudPointBtnBox.removeClass('real-time').addClass('history');
    };

    loadAutoCompleteList = function () {
        var language = localStorage.getItem('language');
        $.ajax({
            url: stateMap.ExpertContainerUrl + 'apiTree?lang=' + language,
            type: "GET"
        }).done(function (result) {
            if (result && result.length) {
                // 诊断节点不需要,要过滤掉，用国际化可能会有不清楚情况的同事吧英文首字母改大写造成bug
                var typeName = language === 'zh' ? '诊断' : 'diagnosis function';
                stateMap.requestTreeList = [];
                stateMap.autoCompleteList = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].api_type !== typeName) {
                        stateMap.requestTreeList.push(result[i]);
                        stateMap.autoCompleteList.push({
                            text: result[i].sample,
                            displayText: result[i].name
                        });
                    }
                }
            }
        });
    };

    deleteRows = function () { //删除一行或多行
        if (!stateMap.$datatable.simpleDataTable('getSelectedData').length) {
            alert(i18n_resource.common.SELECT_RECORDS_REQUIRED);
            return;
        }

        confirm(I18n.resource.debugTools.sitePoint.IS_DELETE_POINTS, function () {
            Spinner.spin(document.body);
            var pointNameList = [], pointIdList = [];
            //获取点名列表
            for (var i = 0; i < stateMap.$datatable.simpleDataTable('getSelectedData').length; i++) {
                var item = stateMap.$datatable.simpleDataTable('getSelectedData')[i];
                pointNameList.push(item.value);
                pointIdList.push(item._id);
            }

            //删除云点
            WebAPI.post('/point_tool/deleteCloudPoint/' + AppConfig.projectId + '/', {
                points: pointNameList,
                pointIds: pointIdList
            }).done(function (result) {
                if (result.success) {
                    //清空相关数据
                    $.ajax({
                        url: stateMap.ExpertContainerUrl + "clearData/" + AppConfig.projectId,
                        type: "POST",
                        data: {
                            pointList: JSON.stringify(pointNameList)
                        }
                    }).done(function (result) {
                        try {
                            if (result.error == 0) {
                                pointUpdate(true);
                            } else {
                                alert(I18n.resource.debugTools.info.DELETE_FAILED + ':' + result.msg);
                                Spinner.stop();
                            }
                        } catch (e) {
                            alert(I18n.resource.debugTools.info.DELETE_FAILED + ':' + result.msg);
                            Spinner.stop();
                        }
                    });
                } else {
                    alert(I18n.resource.debugTools.info.DELETE_FAILED + ':' + result.msg);
                    Spinner.stop();
                }
            }).always(function () {
                Spinner.stop();
            });
        });
    };

    deleteAllRows = function () { //删除全部
        confirm(I18n.resource.debugTools.sitePoint.IS_DELETE_POINTS, function () {
            Spinner.spin(document.body);
            WebAPI.post('/point_tool/deleteCloudPoint/all/' + AppConfig.projectId + '/').done(function (result) {
                if (result.success) {
                    //清空相关数据
                    $("#pointManageWrapper").find('.sheet tbody').empty();
                } else {
                    alert(I18n.resource.debugTools.info.DELETE_FAILED + ':' + result.msg);
                    Spinner.stop();
                }
            }).always(function () {
                Spinner.stop();
            });
        });
    };

    destroy = function () {
        stateMap.moduleName = '';
        stateMap.onlineTestType = configMap.isWriteToRealTimeDb.WRITE;
        stateMap.historyInfoList = [];

        if (stateMap.$datatable) {
            stateMap.$datatable.removeData();
            stateMap.$datatable = null;
        }

        if (stateMap.editor) {
            stateMap.editor = null;
        }
        if (stateMap.datePickerInstanceStart) {
            stateMap.datePickerInstanceStart = null;
            stateMap.datePickerInstanceEnd = null;
        }

        if (stateMap.containerDetach) {
            stateMap.containerDetach = null;
        }

        if (stateMap.zTreeInstance) {
            stateMap.zTreeInstance = null;
        }

        if (stateMap.zTreeSearchInstance) {
            stateMap.zTreeSearchInstance = null;
        }

        stateMap.multiplePointList = [];
        stateMap.scrollTop = 0;
        repairStatusTimeout && clearTimeout(repairStatusTimeout);
        $(document).off("click.hidePointTimeBox");
    };

    setPointErrorNum = function () {
        return WebAPI.post('/api/errorlog/countoflog', {
            projId: AppConfig.projectId,
            type: ''
        }).done(function (result) {
            if (result.success) {
                var total = 0, $errorLogTotal = $('#errorLogTotal');
                for (var prop in result.data) {
                    total += result.data[prop];
                }
                if (total) {
                    $errorLogTotal.text(total).show();
                } else {
                    $errorLogTotal.text(total).hide();
                }

                var $sheetBody = stateMap.$datatable.find('tbody'), $sheetBodyClone = $sheetBody.clone(true);
                var $pointName = $sheetBodyClone.find('.point-name');
                $sheetBodyClone.find('.errorPoint').remove();
                $pointName.each(function (index, item) {
                    var $item = $(item);
                    var pointName = $item.text().trim();
                    if (result.data[pointName]) {
                        $('<span class="fl errorPoint">' + result.data[pointName] + '</span>').insertAfter($item);
                    }
                });
                $sheetBody.replaceWith($sheetBodyClone);
            }
        });
    };

    makeHeaderFixedTableScroll = function () {
        //报表固定标题位置
        $(".gray-scrollbar").find('.table').css("width", $(".table-responsive").find('table').css("width"));
    };

    //---------事件---------

    loadPointTable = function (page) {// 加载点表
        setJqueryMap();
        jqueryMap.$point_add_btn.off().on('click', onNewPoint);
        jqueryMap.$point_delete_btn.off().on('click', deleteRows);
        $("#point_delete_all").off().on('click', deleteAllRows);
        jqueryMap.$point_refresh_btn.off().click(onRefreshCloudPoint);
        jqueryMap.$log_btn.off().on('click', onOpenSearchLog);
        jqueryMap.$container.off('click.errorPoint').on('click.errorPoint', '.sheet .errorPoint', onOpenSinglePointSearchLog);
        jqueryMap.$cloudPointfilterSort.off().on('change', onfilerSort);
        jqueryMap.$container.off('click.mappingPointConfirm').on('click.mappingPointConfirm', '#mappingPointConfirm', cloudPointConfirm);
        jqueryMap.$container.off('click.calcPointConfirm').on('click.calcPointConfirm', '#calcPointConfirm', calcPointConfirm);
        jqueryMap.$container.off('click.calcPointSave').on('click.calcPointSave', '#calcPointSave', calcPointSave);
        jqueryMap.$uploadInput.off().change(importSheet);
        jqueryMap.$point_edit.off().on('click', onEditPoint);
        jqueryMap.$container.off('click.online_test').on('click.online_test', '#online_test', online_test);
        jqueryMap.$container.off('click.import_from_template').on('click.import_from_template', '#import_from_template', import_from_template);
        jqueryMap.$container.off('click.save_as_template').on('click.save_as_template', '#save_as_template', save_as_template);
        jqueryMap.$container.off('click.help_document').on('click.help_document', '.help-document', help);
        jqueryMap.$container.off('click.batch_history_quick_generate_data').on('click.batch_history_quick_generate_data', '.batch_history_quick_generate_data', batch_history_quick_generate_data);
        jqueryMap.$container.off('click.batch_history').on('click.batch_history', '#batch_history', batch_history_win);
        jqueryMap.$container.off('click.batchHistoryPointValueAdd').on('click.batchHistoryPointValueAdd', '#batchHistoryPointValueAdd', batchHistoryPointValueAdd);
        jqueryMap.$container.off('click.batchHistoryGenerate').on('click.batchHistoryGenerate', '#batchHistoryGenerate', batchHistoryGenerate);
        jqueryMap.$container.off('click.batchHistoryPointDelete').on('click.batchHistoryPointDelete', '.batchHistoryPointDelete', batchHistoryPointDelete);
        jqueryMap.$container.off('click.cancelEdit').on('click.cancelEdit', '.cancelEdit', editCancel);
        jqueryMap.$container.off('click.header').on('click.header', '.header .btn', changeAddType);
        jqueryMap.$container.off('click.editMultiplePointConfirm').on('click.editMultiplePointConfirm', '#editMultiplePointConfirm', submitMultiplePoint);
        jqueryMap.$container.off('click.searchCancel').on('click.searchCancel', '#logSearchCancelBtn', onLogSearchCancel);
        jqueryMap.$container.off('change.logPageSizeChange').on('change.logPageSizeChange', '#logPageSizeSelector', logPageSizeChange);
        jqueryMap.$container.off('click.searchLogsOfOneHour').on('click.searchLogOfOneHour', '#searchLogOfOneHour', searchLogOfOneHour);
        jqueryMap.$container.off('click.searchLogsOfyesterday').on('click.searchLogOfyesterday', '#searchLogOfyesterday', searchLogOfyesterday);
        jqueryMap.$container.off('click.searchLogsOftoday').on('click.searchLogOftoday', '#searchLogOftoday', searchLogOftoday);
        jqueryMap.$container.off('click.searchLogsOfAWeek').on('click.searchLogOfAWeek', '#searchLogOfAWeek', searchLogOfAWeek);
        jqueryMap.$container.off('click.searchLogsOfAWeek').on('click.searchLogOfAWeek', '#searchLogOfAWeek', searchLogOfAWeek);
        jqueryMap.$container.off('click.logSearch').on('click.logSearch', '#logSearchBtn', logSearch);
        jqueryMap.$container.off('click.editMultiplePointTest').on('click.editMultiplePointTest', '#editMultiplePointTest', testMultiplePoint);
        jqueryMap.$container.off('click.algorithmPointConfirm').on('click.algorithmPointConfirm', '#algorithmPointConfirm', cloudPointConfirm);
        jqueryMap.$batchHistoryWin.off('hide.bs.modal').on('hide.bs.modal', batchHistoryWinHideEvents);
        jqueryMap.$container.off('click.pointRefresh').on('click.pointRefresh', '#pointRefresh', pointRefresh);
        jqueryMap.$container.off('click.joinCurve').on('click.joinCurve', '#joinCurve', joinCurve);
        jqueryMap.$container.off('change.changePageSize').on('change.changePageSize', '.cloudPageSizeSelector', changePageSize);
        jqueryMap.$pointConvert.click(onConvertToCloud);
        jqueryMap.$point_format.change(setDateFormat);
        jqueryMap.$setRealTimeDb.click(setRealTimeDb);
        jqueryMap.$container.off('click.logSearchDeleteAllBtn').on('click.logSearchDeleteAllBtn', '#logSearchDeleteAllBtn', logSearchDeleteAll);
        jqueryMap.$container.off('click.batchHistoryPointTime').on('click.batchHistoryPointTime', '#batchHistoryPointTime', batchHistoryPointChange);
        jqueryMap.$container.off('click.historyStatus').on('click.historyStatus', '#historyStatus', historyStatus);
        jqueryMap.$container.off('click.realTimeStatus').on('click.realTimeStatus', '#realTimeStatus', realTimeStatus);
        jqueryMap.$container.off('click.historyPointsSearchConfirm').on('click.historyPointsSearchConfirm', '#historyPointsSearchConfirm', historyPointsSearchConfirm);
        jqueryMap.$container.off('click.clearInputTime').on('click.clearInputTime', '#clearInputTime', clearInputTime);
        jqueryMap.$container.off('click.allPointsCalc').on('click.allPointsCalc', '#allPointsCalc', allPointsCalc);
        jqueryMap.$container.off('click.enlargeFullScreen').on('click.enlargeFullScreen', '#enlargeFullScreen', enlargeFullScreen);
        jqueryMap.$container.off('keydown.treeSearch').on('keydown.treeSearch', '#treeSearch', treeSearch);
        jqueryMap.$container.off('click.batchAllPoints').on('click.batchAllPoints', '#batchAllPoints', batchAllPointsChange);
        $(document).on("click.hidePointTimeBox", hidePointTimeBox);
        jqueryMap.$isBatch.change(setIsBatch);
        setFilterSort('0');
        loadSheet(page);
        //云点管理计算点, 左下角选择每页n项,切换到另一个项目, 显示也是n项.
        $(".cloudPageSizeSelector").val(stateMap.page_size);
        stateMap.historyStatusPopover = jqueryMap.$historyStatus.popover({
            html: true,
            placement: 'bottom',
            content: 'history time setting', // 必须设置content有值
            container: $("#cloudPointBtnBox"),
            template: $('#tpl_popover_template').html()
        });

        jqueryMap.$batchHistoryTimeStart.datetimepicker(configMap.timeFormatMap);
        jqueryMap.$batchHistoryTimeEnd.datetimepicker(configMap.timeFormatMap);

        I18n.fillArea(stateMap.$container);
    };

    allPointsCalc = function () {
        confirm(I18n.resource.dataManage.IS_CALCULATE_ALL_POINTS, function () {
            Spinner.spin(document.body);
            $.ajax({
                url: stateMap.ExpertContainerUrl + "calcpoint/calcAllReal",
                type: "POST",
                data: {
                    "projId": AppConfig.projectId
                }
            }).done(function (result) {
                if (result) {
                    stateMap.allPointList = [];
                    for (var prop in result) {
                        stateMap.allPointList.push({
                            'name': prop,
                            'value': result[prop]
                        });
                    }
                    stateMap.allPointCurrentPage = 1;
                    allPointPaginationRefresh(stateMap.allPointList.length);
                    refreshAllPointTable(stateMap.allPointCurrentPage);
                    $("#isAllPointCalcWin").modal({
                        keyboard: false,
                        backdrop: 'static'
                    });
                }
            }).fail(function (e) {
                serverRequestError(e);
            }).always(function () {
                Spinner.stop();
            });
        });
    };

    enlargeFullScreen = function () {
        stateMap.editor.setOption("fullScreen", true);
        tip(I18n.resource.common.EXIT_FULL_SCREEN, {delay: 2000});
    };

    hidePointTimeBox = function (e) {
        var $target = $(e.target);
        if (!$target.closest("#dataTypeStatusBox").length && !$target.closest(".popover").length) {
            stateMap.historyStatusPopover.data("bs.popover").inState.click = false;
            stateMap.historyStatusPopover.popover('hide');
        }
    };

    showMorePointValue = function (tr, data) {
        var prettyValue = data.pointValue;
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
                    ok: {
                        text: 'OK',
                        i18n: 'common.CANCEL',
                        class: 'alert-button',
                        callback: ''
                    },
                    copy: {
                        i18n: 'common.COPY',
                        css: 'btn-success',
                        callback: function () {
                            BEOPUtil.copyToClipboard(prettyValue);
                            alert.success(I18n.resource.common.COPY_SUCCESS);
                        }
                    }
                },
                hasResize: true
            }
        );
        tableCopyBoxStyle();
    };
    //  table  copy  弹出框 根据显示内容适应
    tableCopyBoxStyle = function () {
        $(".infoBox").css({
            "width": "auto",
            "min-width": "400px",
            "max-width": "1600px"
        });
        $(".infoBox-body").css({"height": "auto", "max-height": "360px"});
        $('.infoBox-msg').css("width", "auto");
        var infoBoxWidth = -1 / 2 * $(".infoBox").width() + "px";
        $(".infoBox").css({"position": "absolute", "left": "50%", "margin-left": infoBoxWidth});
    };

    getStartTime = function (dateType) {
        var date = new Date();
        if (dateType === 'today') {
            return date.format('yyyy-MM-dd 00:00:00');
        } else if (dateType === 'week') {
            var getDay = date.getDay() == 0 ? 7 : date.getDay(); // 周日 date.getDay() 为 0
            return new Date(date - (getDay - 1) * 86400000).format('yyyy-MM-dd 00:00:00');
        } else if (dateType === 'month') {
            return new Date(date.getFullYear(), date.getMonth(), 1).format('yyyy-MM-dd 00:00:00');
        }
    };

    setRealTimeDb = function () {
        infoBox.prompt(I18n.resource.debugTools.sitePoint.THE_PROJECT_DATA_NOT_CONNEDTED_WITH_THE_REAL_TIME_PROJECT_DATA, function (value) {
            if ($.trim(value)) {
                WebAPI.post("/point_tool/setPJRealityTable", {
                    "mysqlname": value,
                    "projectId": AppConfig.projectId
                }).fail(function () {
                    alert.danger(I18n.resource.debugTools.sitePoint.FAILED_TO_SYNCHRONIZE_DATA);
                }).done(function () {
                    alert.success(I18n.resource.debugTools.sitePoint.SYNCHRONIZE_DATA_SUCCESSFULLY);
                })
            } else {
                alert.danger(I18n.resource.debugTools.sitePoint.FAILED_TO_SYNCHRONIZE_DATA_EMPTY);
            }
        }, {
            buttons: {
                cancel: {
                    callback: function () {
                        window.localStorage.setItem("dataSyncCheckNotNotification", true);
                    }
                }
            }
        });
    };

    getBatchHistoryPointMap = function () {
        var idList = [], valueList = [], logicList = [], formatList = [], moduleNameList = [];
        for (var i = 0; i < stateMap.sheetData.length; i++) {
            var data = stateMap.sheetData[i];
            idList.push(data._id);
            valueList.push(data.value);
            moduleNameList.push(getModuleName(data.value));
            logicList.push(data.params.logic);
            formatList.push(data.params.format);
        }
        stateMap.batchHistoryPointMap = {
            'idList': idList,
            'valueList': valueList,
            'logicList': logicList,
            'formatList': formatList,
            'moduleNameList': moduleNameList
        }
    };

    var stopRepairing = function (processId) {
        return $.ajax({
            url: stateMap.ExpertContainerUrl + "repairData/stop",
            type: "POST",
            data: {
                'projId': AppConfig.projectId,
                'userId': AppConfig.userId,
                'obId': processId
            }
        })
    };

    var repairStatusTimeout = 0;

    var isRepairing = function () {
        var $batchHistoryFilterBox = $('#batchHistoryFilterBox');
        var $batchHistoryProgressBox = $('#batchHistoryProgressBox');
        var $batchHistoryWin = $('#batchHistoryWin');
        var sort = function (list) {
            if (!list || !list.length) {
                return [];
            }
            for (var i = 0; i < list.length; i++) {
                for (var j = i; j < list.length; j++) {
                    if (list[i] < list[j]) {
                        var tmp = list[i];
                        list[i] = list[j];
                        list[j] = tmp;
                    }
                }
            }
            return list;
        };
        return $.ajax({
            url: stateMap.ExpertContainerUrl + "repairData/status/" + AppConfig.projectId,
            type: "GET"
        }).done(function (result) {
            if (result) {
                if (!result) {
                    return;
                }
                var sortedTasks = [];
                sort(Object.keys(result)).forEach(function (key) {
                    result[key].id = key;
                    sortedTasks.push(result[key]);
                });

                $batchHistoryWin.addClass('repairing');
                $batchHistoryProgressBox.find('#repairTasks tbody').html(beopTmpl('tpl_task_progress', {tasks: sortedTasks}));
                repairStatusTimeout && clearTimeout(repairStatusTimeout);
                repairStatusTimeout = setTimeout(isRepairing, 3000);
            } else {
                $('#batchHistoryWin').removeClass('repairing');
                $batchHistoryFilterBox.show();
            }
        })
    };

    batch_history_win = function () {
        setJqueryMap();
        stateMap.selectedPointFormatList = [];
        stateMap.selectedPointIdList = [];
        stateMap.selectedPointModuleNameList = [];
        stateMap.selectedPointValueList = [];
        stateMap.selectedPointLogicList = [];
        stateMap.batchHistoryPointMap = {};
        jqueryMap.$batchHistoryWin.modal({
            keyboard: false,
            backdrop: 'static'
        });

        var $batchHistoryFilterBox = jqueryMap.$container.find('#batchHistoryFilterBox');
        if (localStorage.getItem('batchHistoryGenerateType') == 'point') {
            jqueryMap.$batchHistoryPointTime.get(0).checked = true;
            jqueryMap.$batchHistoryTimeStart.val(localStorage.getItem('batchHistoryStartTimePoint') ? localStorage.getItem('batchHistoryStartTime') : new Date().format('yyyy-MM-dd HH:mm:00'));
            jqueryMap.$batchHistoryTimeEnd.val('');
            $batchHistoryFilterBox.removeClass().addClass('batchHistoryTimePoint');
        } else {
            jqueryMap.$batchHistoryPointTime.get(0).checked = false;
            jqueryMap.$batchHistoryTimeStart.val(localStorage.getItem('batchHistoryStartTime') ? localStorage.getItem('batchHistoryStartTime') : new Date().format('yyyy-MM-dd HH:mm:00'));
            jqueryMap.$batchHistoryTimeEnd.val(localStorage.getItem('batchHistoryEndTime') ? localStorage.getItem('batchHistoryEndTime') : new Date().format('yyyy-MM-dd HH:mm:00'));
            $batchHistoryFilterBox.removeClass();
        }
        jqueryMap.$point_format.val(localStorage.getItem('batchHistoryFormat') ? localStorage.getItem('batchHistoryFormat') : 'm5');
        jqueryMap.$batchHistoryPointValue.val('');
        jqueryMap.$batchHistoryPoints.empty();
        jqueryMap.$batchHistoryProgress.empty().removeClass('progress').html('<span i18n="debugTools.sitePoint.NO_PROGRESS"></span>');
        jqueryMap.$batchHistoryProgressInfo.text("");
        getBatchHistorySelectedPointInfoList();
        stateMap.$datatable.simpleDataTable('getSelectedData').length && refreshBatchHistoryUl();
        getBatchHistoryPointMap();

        if (!stateMap.selectedPointValueList || !stateMap.selectedPointValueList.length) {
            jqueryMap.$batchHistoryWin.addClass('noPoints');
        } else {
            jqueryMap.$batchHistoryWin.removeClass('noPoints');
        }

        jqueryMap.$container.off('click.repair.stop').on('click.repair.stop', '#batchHistoryWin .stop', function () {
            var $this = $(this);
            confirm(i18n_resource.dataManage.CONFIRM_STOP_REPAIR, function () {
                stopRepairing($this.closest('tr').attr('id')).done(function (result) {
                    if (result && result.success) {
                        $this.closest('tr').find('.history-progress').text(I18n.resource.dataManage.CANCELED);
                    }
                })
            });
        });

        Spinner.spin(jqueryMap.$batchHistoryWin.get(0));
        isRepairing().done(function () {

        }).always(function () {
            Spinner.stop();
        });
    };

    batchHistoryPointValueAdd = function () {
        var val = jqueryMap.$batchHistoryPointValue.val().trim();
        if (val) {
            if (($.inArray(val, stateMap.selectedPointValueList) !== -1)) {
                alert(I18n.resource.debugTools.sitePoint.THIS_POINT_HAS_BEEN_ADDED_TO_THE_LIST_BELOW);
            } else {
                var index = $.inArray(val, stateMap.batchHistoryPointMap.valueList);
                if (index === -1) {
                    alert(I18n.resource.debugTools.sitePoint.ONLY_EXISTING_CALCULATION_POINTS_ARE_ALLOWED);
                } else {
                    stateMap.selectedPointValueList.push(val);
                    stateMap.selectedPointModuleNameList.push(stateMap.batchHistoryPointMap.moduleNameList[index]);
                    stateMap.selectedPointFormatList.push(stateMap.batchHistoryPointMap.formatList[index]);
                    stateMap.selectedPointIdList.push(stateMap.batchHistoryPointMap.idList[index]);
                    stateMap.selectedPointLogicList.push(stateMap.batchHistoryPointMap.logicList[index]);
                    refreshBatchHistoryUl();
                }
            }
        } else {
            alert(I18n.resource.debugTools.sitePoint.POINT_VALUE_CAN_NOT_BE_EMPTY);
        }
    };

    batchHistoryPointDelete = function () {
        var val = $(this).closest('.batchHistoryPoint').find('.batchHistoryPointName').val();
        for (var i = 0; i < stateMap.selectedPointValueList.length; i++) {
            if (val == stateMap.selectedPointValueList[i]) {
                stateMap.selectedPointValueList.splice(i, 1);
                stateMap.selectedPointModuleNameList.splice(i, 1);
                stateMap.selectedPointFormatList.splice(i, 1);
                stateMap.selectedPointIdList.splice(i, 1);
                stateMap.selectedPointLogicList.splice(i, 1);
                break;
            }
        }
        refreshBatchHistoryUl();
    };

    batchHistoryPointChange = function () {
        var $batchHistoryFilterBox = jqueryMap.$container.find('#batchHistoryFilterBox');
        if (jqueryMap.$batchHistoryPointTime.is(':checked')) {
            $batchHistoryFilterBox.removeClass().addClass('batchHistoryTimePoint');
        } else {
            $batchHistoryFilterBox.removeClass();
        }
    };

    batchAllPointsChange = function () {
        if ($('#batchAllPoints').is(':checked')) {
            jqueryMap.$batchHistoryPointsBox.css('background', '#ccc');
            jqueryMap.$batchHistoryPoints.empty().append(beopTmpl('tpl_batch_AllPoints', {
                allPoints: stateMap.sheetData
            }));
        } else {
            jqueryMap.$batchHistoryPointsBox.css('background', '#eee');
            jqueryMap.$batchHistoryPoints.empty().html(beopTmpl('tpl_batch_history_add_point', {
                'valueList': stateMap.selectedPointValueList
            }));
        }
        I18n.fillArea(jqueryMap.$batchHistoryWin);
    };
    batch_history_quick_generate_data = function (e) {
        jqueryMap.$batchHistoryProgressInfo.text("");
        batchGenerate(getStartTime($(e.target).attr('dateType')), new Date().format('yyyy-MM-dd HH:00:00'));
    };

    batchHistorySaveParam = function (timeFrom, timeTo) {
        jqueryMap.$batchHistoryPointTime.is(':checked') ?
            localStorage.setItem('batchHistoryGenerateType', 'point') :
            localStorage.setItem('batchHistoryGenerateType', 'area');
        localStorage.setItem('batchHistoryStartTime', timeFrom);
        localStorage.setItem('batchHistoryEndTime', timeTo);
        localStorage.setItem('batchHistoryFormat', jqueryMap.$point_format.val().trim());
        localStorage.setItem('batchHistoryStartTimePoint', timeFrom);
    };

    batchHistoryGenerate = function () {
        jqueryMap.$batchHistoryProgressInfo.text("");
        var timeFrom = jqueryMap.$batchHistoryTimeStart.val().trim(),
            timeTo = jqueryMap.$batchHistoryTimeEnd.val().trim();
        if (jqueryMap.$batchHistoryPointTime.is(':checked')) {
            timeTo = timeFrom;
        } else {
            try {
                if (dateTimeCheck(timeFrom, timeTo)) {
                    if (!stateMap.selectedPointValueList.length && !$('#batchAllPoints').is(':checked')) {
                        alert.danger(I18n.resource.debugTools.sitePoint.NO_POINT_PLEASE_ADD);
                        return;
                    }
                    timeFrom = new Date(timeFrom).format('yyyy-MM-dd HH:mm:00');
                    timeTo = new Date(timeTo).format('yyyy-MM-dd HH:mm:00');
                } else {
                    return;
                }
            } catch (e) {
                alert.danger('the date format is invalid.');
                return false;
            }
        }
        batchGenerate(timeFrom, timeTo);
    };

    batchGenerate = function (timeFrom, timeTo) {
        var requestRepairHistory = function () {
            Spinner.spin(document.body);
            $.ajax({
                url: stateMap.ExpertContainerUrl + "repairData/batch",
                type: "POST",
                data: {
                    'list': JSON.stringify(stateMap.selectedPointValueList),
                    'timeFrom': timeFrom,
                    'timeTo': timeTo,
                    'projId': AppConfig.projectId,
                    'format': jqueryMap.$point_format.val().trim(),
                    'userId': AppConfig.userId,
                    'all': isAll
                }
            }).done(function (result) {
                if (result) {
                    alert.success('start to repair history data...');
                    isRepairing();
                }
            }).fail(function (e) {
                serverRequestError(e);
            }).always(function () {
                Spinner.stop();
            });
        };
        if (jqueryMap.$batchHistoryPointTime.is(':checked')) {
            timeTo = timeFrom;
        }
        batchHistorySaveParam(new Date(timeFrom).format('yyyy-MM-dd HH:mm'), new Date(timeTo).format('yyyy-MM-dd HH:mm'));
        var isAll = $('#batchAllPoints').is(':checked');
        if (isAll) {
            confirm(I18n.resource.debugTools.sitePoint.CONFIRM_REPAIR_ALL_POINTS_HISTORY, function () {
                requestRepairHistory();
            })
        } else {
            requestRepairHistory();
        }

    };

    refreshBatchHistoryUl = function () {
        jqueryMap.$batchHistoryPoints.empty().html(beopTmpl('tpl_batch_history_add_point', {
            'valueList': stateMap.selectedPointValueList
        }));
    };

    setIsBatch = function () {
        stateMap.isBatch = jqueryMap.$isBatch.is(":checked");
    };

    getPointsHandler = function () {
        var pointName = jqueryMap.$point_name.val().trim(),
            batchModel = jqueryMap.$pt_batchModal.val(),
            alias = jqueryMap.$point_notes.val() ? jqueryMap.$point_notes.val().trim() : '',
            model = {},
            pointContent = stateMap.editor.doc.getValue().trim(),
            ret = [];

        if (!stateMap.isBatch) {
            ret.push({name: pointName, content: pointContent, alias: alias});
            return ret;
        }

        try {
            batchModel = batchModel.trim().replace((/([^{:\s]+)(:)/g), "\"$1\"$2").replace((/'/g), "\"");
            model = JSON.parse(batchModel);
        } catch (e) {
            alert(I18n.resource.debugTools.sitePoint.TEMPLATE_VARIABLE_IS_NOT_CORRECT);
            console.error('can\' parse the content' + e);
            return ret;
        }
        var handler = function (pointName, content, alias, replaceModel) {
            for (var replaceItem in replaceModel) {
                if (!replaceModel.hasOwnProperty(replaceItem)) {
                    continue;
                }
                var regex = new RegExp('<#' + replaceItem + '#>', 'gi');
                pointName = pointName.replace(regex, replaceModel[replaceItem]);
                content = content.replace(regex, replaceModel[replaceItem]);
                alias = alias.replace(regex, replaceModel[replaceItem]);
            }
            return {name: pointName, content: content, alias: alias};
        };
        var replaceModelList = [];

        var replaceListPlaceholder = function (item) {
            if (replaceModelList.length) {//取最少的组合
                if (item.length > replaceModelList.length) {
                    item.splice(replaceModelList.length, item.length - replaceModelList.length);
                } else if (item.length < replaceModelList.length) {
                    replaceModelList.splice(item.length, replaceModelList.length - item.length);
                }
            }

            item.forEach(function (replaceItem, index) {
                if (!replaceModelList[index]) {
                    replaceModelList[index] = {};
                }
                replaceModelList[index][prop] = replaceItem;
            })
        };
        for (var prop in model) {
            if (!model.hasOwnProperty(prop)) {
                continue;
            }
            var item = model[prop];
            if ($.isArray(item)) {
                replaceListPlaceholder(item);
            } else if ($.isPlainObject(item)) {

                var min = parseInt(item["min"]);
                var max = parseInt(item["max"]);
                var step = parseInt(item["step"]) || 1;
                if (!min) {
                    item.min = 1;
                }
                if (!max) {
                    alert(prop + ' missing max value.');
                    return [];
                }

                if (min > max) {
                    alert(prop + ' min larger than max.');
                    return [];
                }
                var propValueList = [];

                for (var k = min; k <= max; k = k + step) {
                    if (parseInt(item["pad"]) && parseInt(item["pad"]) > 0) {
                        propValueList.push(StringUtil.padLeft(k, parseInt(item["pad"]), '0'));
                    } else {
                        propValueList.push(k);
                    }
                }
                replaceListPlaceholder(propValueList);
            }
        }

        replaceModelList.forEach(function (replaceModel) {
            ret.push(handler(pointName, pointContent, alias, replaceModel));
        });

        return ret;
    };


    setDateFormat = function () { // 根据下拉菜单修改日历视图格式
        jqueryMap.$datePickBox.html(beopTmpl('tpl_date_item_refresh'));
        var val = jqueryMap.$point_format.val();
        stateMap.pointFormat = val;
        if (val == 'd1') {
            stateMap.dateFormat = {
                startView: 'month',
                autoclose: true,
                minView: 'month',
                format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATE),
                forceParse: false
            };
        } else if (val == 'h1') {
            stateMap.dateFormat = {
                startView: 'month',
                autoclose: true,
                minView: 'day',
                format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_HH_00_00),
                forceParse: false
            };
        } else {
            stateMap.dateFormat = {
                startView: 'month',
                autoclose: true,
                minView: 'hour',
                format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC),
                forceParse: false
            };
        }
        refreshDatePick();
    };
    online_test = function () { // 点击在线测试按钮
        stateMap.onlineTestType = configMap.isWriteToRealTimeDb.NOT_WRITE;
        jqueryMap.$online_test.addClass('disabled');
        var newPoints = getPointsHandler();
        var testPromises = [];

        var historyTestTime = $("#historyTestTimePicker").val() || '';

        for (var m = 0, len = newPoints.length; m < len; m++) {
            var point = newPoints[m];
            testPromises.push(online_test_request(point.content, point.name));
        }
        var opt = {};
        setJqueryMap();
        $.when.apply(null, testPromises).done(function (result) {
            if (testPromises.length == 1) {
                opt.historyTestTime = historyTestTime;
                opt.newDate = new Date().format('yyyy-MM-dd HH:mm:ss');
                if (stateMap.isMultiple) {
                    for (var key in result.value) {
                        opt.process = result.value[key].process;
                        if (parseInt(result.error) == 1) {
                            opt.errorResult = result.value[key].value;
                        } else {
                            if ($.isPlainObject(result.value[key].value)) {
                                opt.result = key + ' = ' + JSON.stringify(result.value[key].value, null, 4);
                            } else {
                                opt.result = key + ' = ' + result.value[key].value;
                            }
                        }
                        jqueryMap.$online_test_process.show().prepend(beopTmpl('tpl_test_progress', {opt: opt}));
                    }
                } else {
                    opt.process = result.process;
                    if (parseInt(result.error) == 1) {
                        opt.errorResult = result.value;
                    } else {
                        if ($.isPlainObject(result.value)) {
                            opt.result = newPoints[0].name + ' = ' + JSON.stringify(result.value, null, 4);
                        } else {
                            opt.result = newPoints[0].name + ' = ' + result.value;
                        }
                    }
                    jqueryMap.$online_test_process.show().prepend(beopTmpl('tpl_test_progress', {opt: opt}));
                }
            }
        }).always(function () {
            Spinner.stop();
            jqueryMap.$online_test.removeClass('disabled');
        });
    };
    online_test_request = function (content, pointName, moduleName) { // 在线测试请求
        if (typeof content === typeof undefined) {
            content = stateMap.editor && stateMap.editor.doc && stateMap.editor.doc.getValue();
        }

        if (content.trim() === '') {
            alert('code is required');
            return $.Deferred().reject();
        }

        if (typeof pointName === typeof undefined) {
            pointName = jqueryMap.$point_name.val().trim();
        }

        if (typeof moduleName === typeof undefined) {
            moduleName = getModuleName(pointName);
        }

        if (!stateMap.isMultiple && (pointName == "" || !pointNameCheck(pointName))) {
            alert(I18n.resource.debugTools.info.POINT_NAME_PROMPT);
            return $.Deferred().reject();
        }

        var url = stateMap.ExpertContainerUrl, sendData = {
            'content': BEOPUtil.logicContentHandle(content),
            'projId': AppConfig.projectId,
            'pointName': pointName,
            'moduleName': moduleName,
            'writeToReal': stateMap.onlineTestType
        };

        jqueryMap.$historyTestTimePicker = $("#historyTestTimePicker");
        if (stateMap.isMultiple) {
            url += 'cloudPoint/onlinetest/batch';
        } else {
            if (jqueryMap.$historyTestTimePicker.val()) {
                url += 'cloudPoint/history/onlinetest';
                sendData.timeAt = requestTimeHandler(new Date(jqueryMap.$historyTestTimePicker.val().format('yyyy-MM-dd HH:mm:ss')), 'm5');
            } else {
                url += 'cloudPoint/onlinetest';
            }
        }
        Spinner.spin(document.body);

        return $.ajax({
            url: url,
            type: "POST",
            data: sendData
        }).fail(function (e) {
            jqueryMap.$onlineTestReturnInfo.text(I18n.resource.debugTools.sitePoint.SERVER_REQUEST_FAILED);
            serverRequestError(e);
        }).always(function () {
            jqueryMap.$online_test.removeClass('disabled');
            Spinner.stop();
        });
    };
    //处理format及时间的关系.m5返回最近的整数5分钟时间点
    requestTimeHandler = function (time, format) {
        var dateTime = new Date(time);
        if (format == 'm1') {
            return dateTime.format('yyyy-MM-dd HH:mm:00');
        }
        if (format == 'm5') {
            var minute = Math.floor(dateTime.getMinutes() / 5) * 5;
            return dateTime.format('yyyy-MM-dd HH:' + StringUtil.padLeft(minute, 2, '0') + ':00');
        }
        if (format == 'h1') {
            return dateTime.format('yyyy-MM-dd HH:00:00');
        }
        if (format == 'd1') {
            return dateTime.format('yyyy-MM-dd 00:00:00');
        }
    };

    serverRequestError = function (mes) {
        console.log(mes);
        alert(I18n.resource.debugTools.sitePoint.SERVER_REQUEST_FAILED);
    };

    getModuleName = function (str) {
        return 'calcpoint_' + AppConfig.projectId + '_' + str;
    };

    import_from_template = function () {
        stateMap.currentEditorText = stateMap.editor.doc.getValue();
        beop.template.init({
            'container': jqueryMap.$templateImportWinBox,
            'opType': 'import',
            'confirmCallBack': function () {
                stateMap.transmitLogic += beop.template.getLogic();
                $('.templateWin').modal('hide');
                refreshEditor();
            }
        });
    };

    save_as_template = function () {
        beop.template.init({
            'container': jqueryMap.$saveAsTemplateWinBox,
            'opType': 'save',
            'logic': stateMap.editor.doc.getValue()
        });
    };

    help = function () {
        window.open("/static/help/" + localStorage.getItem('language') + "/cloud_point_api.html", "BeOP help");
    };

    refreshDatePick = function () {
        if (stateMap.datePickerInstanceStart) {
            stateMap.datePickerInstanceStart = null;
            stateMap.datePickerInstanceEnd = null;
        }
        setJqueryMap();
        jqueryMap.$dateTimeStart.datetimepicker(stateMap.dateFormat);
        jqueryMap.$dateTimeEnd.datetimepicker(stateMap.dateFormat);
        stateMap.datePickerInstanceStart = jqueryMap.$dateTimeStart.data('datetimepicker');
        stateMap.datePickerInstanceEnd = jqueryMap.$dateTimeEnd.data('datetimepicker');
    };

    onfilerSort = function () {
        setFilterSort($(this).val());
        jqueryMap.$sheet.simpleDataTable('setSearch', 'order', stateMap.order);
    };

    setFilterSort = function (sortId) {
        switch (sortId) {
            case '0':
            {
                stateMap.order = [['_id', -1]];
                break;
            }
            case '1':
            {
                stateMap.order = [['value', 1]];
                break;
            }
            case '2':
            {
                stateMap.order = [['value', -1]];
                break;
            }
            default :
            {
                stateMap.order = [['_id', -1]];
            }
        }
    };

    onChangePointType = function () {
        if (stateMap.pointType == configMap.cloudPointType.CALC_POINT) { // 计算点
            refreshEditor();
            jqueryMap.$codeMirrorBox.show();
            if (stateMap.operateType === configMap.operateType.NEW) {
                jqueryMap.$point_format.val('m5');
                stateMap.pointFormat = 'm5';
            }
        } else {
            stateMap.editor = null;
            jqueryMap.$codeMirrorBox.empty().hide();
        }
    };

    batchHistoryWinHideEvents = function () { // 编辑，新建窗口隐藏事件;
        repairStatusTimeout && clearTimeout(repairStatusTimeout);
        $('#batchAllPoints').attr('checked', false);
    };

    refreshEditor = function () {
        stateMap.editor = null;
        jqueryMap.$codeMirrorBox.empty().append(beopTmpl('tpl_point_related_fun'));
        //setJqueryMap();
        if (stateMap.transmitLogic) { // 从模板中传递的值
            if (stateMap.currentEditorText == '') {
                stateMap.currentEditorText += stateMap.transmitLogic;
            } else {
                stateMap.currentEditorText += ('\n\n' + stateMap.transmitLogic);
            }
            stateMap.transmitLogic = '';
        } else {
            if (stateMap.operateType == configMap.operateType.NEW) { // 添加窗口
                stateMap.currentEditorText = '';
            } else { // 编辑窗口
                var data = stateMap.sheetData[stateMap.currentPointIndex];
                if (data.params && data.params.flag) {
                    if (data.params.flag == configMap.cloudPointType.CALC_POINT) { // 计算点
                        stateMap.currentEditorText = data.params.logic;
                    } else {
                        stateMap.currentEditorText = '';
                    }
                }
            }
        }

        $("#codeEditor").text(stateMap.currentEditorText);
        jqueryMap.$codeMirrorBox.show();

        CodeMirror.commands.autocomplete = function (cm) {
            cm.showHint({
                hint: function (editor, options) {
                    var WORD = /[\w$]+/;
                    var word = options && options.word || WORD;
                    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
                    var end = cur.ch, start = end;
                    while (start && word.test(curLine.charAt(start - 1))) --start;
                    var curWord = start != end && curLine.slice(start, end);
                    var candidates = stateMap.autoCompleteList.filter(function (item) {
                        return item.displayText.startsWith(curWord);
                    });
                    if (candidates.length === 1) {
                        candidates.unshift({
                            text: '',
                            displayText: ''
                        });
                    }
                    return {
                        list: candidates,
                        from: CodeMirror.Pos(cur.line, start),
                        to: CodeMirror.Pos(cur.line, end)
                    }
                }
            });
        };
        stateMap.editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
            mode: "python",
            lineNumbers: true,
            indentUnit: 4,
            tabMode: 'spaces',
            autofocus: true
        });
        stateMap.editor.setOption("extraKeys", {
            Tab: function (cm) {
                if (cm.somethingSelected()) {
                    cm.indentSelection('add');
                } else {
                    var spaces = new Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces);
                }
            },
            "F11": function (cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function (cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        });

        stateMap.editor.refresh();

        stateMap.editor.on("keyup", function (cm, e) {
            // 屏蔽 backspace 上下左右 按键
            if (e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40) {
                CodeMirror.commands.autocomplete(cm);
            }
        });
    };

    setCloudPointTypeName = function () {
        jqueryMap.$cloudPointTypeName = $("#cloudPointTypeName");
        if (stateMap.pointType == configMap.cloudPointType.MAPPING_POINT) {
            jqueryMap.$cloudPointTypeName.attr('i18n', 'dataManage.MAPPING_POINT');
        } else if (stateMap.pointType == configMap.cloudPointType.VIRTUAL_POINT) {
            jqueryMap.$cloudPointTypeName.attr('i18n', 'dataManage.VIRTUAL_POINT');
        } else {
            jqueryMap.$cloudPointTypeName.attr('i18n', 'dataManage.CALCULATION_POINT');
        }
        I18n.fillArea(jqueryMap.$container);
    };

    editCancel = function () {
        stateMap.$treeDomDetach = $("#dmSysTreeInner").detach();
        if (stateMap.cloudPointWrapperDetach) {
            jqueryMap.$cloudPointWrapper.html(stateMap.cloudPointWrapperDetach);
            jqueryMap.$container.find('#pointManageWrapper .table-body').scrollTop(stateMap.scrollTop);
        }
    };

    changeAddType = function () {
        var $this = $(this);
        if ($this.hasClass('btn-success')) {
            return false;
        }
        stateMap.isMultiple = $this.hasClass('multiple');
        if (stateMap.isMultiple) {
            $('#historyTestTimePicker').closest('.input-group').hide();
            $('#point_name').closest('.form-group').hide();
        } else {
            $('#historyTestTimePicker').closest('.input-group').show();
            $('#point_name').closest('.form-group').show();
        }
        $this.closest('.header').find('.btn').removeClass('btn-success').addClass('btn-default');
        $this.removeClass('btn-default').addClass('btn-success');

        renderAddPointForm();
    };

    getMultiplePointsByForm = function () {
        stateMap.multiplePointList = [];
        $('#multiplePointTable tbody tr').each(function (index, tr) {
            var $tr = $(tr);
            var pointIndex = jqueryMap.$multiplePointTable.find('tr').index($tr) - 1;
            $tr.find('td').each(function (index, td) {
                var $td = $(td);
                var prop = $td.data('prop');
                if ($td.text()) {
                    if (!stateMap.multiplePointList[pointIndex]) {
                        stateMap.multiplePointList[pointIndex] = new CaclPoint();
                    }
                    stateMap.multiplePointList[pointIndex][prop] = $td.text().trim();
                    if (prop == 'output') {
                        $tr.addClass($td.text().trim());
                    }
                }
            });
        })
    };

    multiplePointListCheck = function () {
        getMultiplePointsByForm();
        if (!stateMap.multiplePointList || !stateMap.multiplePointList.length) {
            alert('the points is emtpy.');
            return false;
        }
        return true;
    };

    getTestPromiseList = function () {
        stateMap.testPromiseList = [];
        stateMap.isAllPassed = true;
        jqueryMap.$multiplePointTable = $('#multiplePointTable');
        jqueryMap.$multiplePointTable.find('.test').text('');
        stateMap.multiplePointList.forEach(function (point) {
            stateMap.testPromiseList.push(point.test().done(function (result) {
                if (result.error || !result.value) {
                    stateMap.isAllPassed = false;
                }
                jqueryMap.$multiplePointTable.find('tr.' + point.output).find('.test').text('' + result.value);
            }));
        });
    };

    multiplePointHandle = function (successCallback) {
        if (multiplePointListCheck()) {
            //在线测试所有点
            Spinner.spin(jqueryMap.$container.get(0));
            getTestPromiseList();
            $.when.apply(null, stateMap.testPromiseList).done(function (result) {
                successCallback();
            }).fail(function () {
                alert('not all points passed, please check the failed point');
                return false;
            }).always(function () {
                Spinner.stop();
            });
        }
    };

    testMultiplePoint = function () {
        multiplePointHandle(function () {
            if (stateMap.isAllPassed) {
                alert('all points passed.')
            } else {
                alert('not all points passed, please check the failed point');
                return false;
            }
        });
    };

    submitMultiplePoint = function () {
        multiplePointHandle(function () {
            var savePromiseList = [];
            stateMap.multiplePointList.forEach(function (point) {
                if (!point.isSaved) {
                    var addPointPromise = $.post('/point_tool/addCloudPoint/' + AppConfig.projectId + '/', point.getSaveModel()).done(function (result) {
                        if (result.success) {
                            point.isSaved = true;
                            jqueryMap.$multiplePointTable.find('tr.' + point.output).remove();
                        } else {
                            if (I18n.resource.dataManage[result.msg]) {
                                alert(I18n.resource.dataManage[result.msg]);
                            } else {
                                alert(I18n.resource.dataManage.EXISTS_POINT);
                            }
                        }
                    });
                    savePromiseList.push(addPointPromise);
                }
            });
            $.when.apply(null, savePromiseList).done(function (result) {
                if (stateMap.cloudPointWrapperDetach) {
                    jqueryMap.$cloudPointWrapper.html(stateMap.cloudPointWrapperDetach);
                }
                loadSheet(stateMap.currentPage);
            })
        });
        return false;
    };

    renderAddPointForm = function () {
        $('#pointForm').show();
    };

    loadPointDetailPage = function (isEdit) {
        stateMap.cloudPointWrapperDetach = jqueryMap.$cloudPointWrapper.children().detach();
        var pointModel = {point: false};
        if (isEdit) {
            pointModel = {point: stateMap.sheetData[stateMap.currentPointIndex]};
        }
        if (stateMap.pointType == configMap.cloudPointType.MAPPING_POINT) {
            jqueryMap.$cloudPointWrapper.html(beopTmpl('tpl_point_form_mapping', pointModel));
            var $pointMapping = $("#point_mapping"), $point_name = $("#point_name");
            if (stateMap.operateType == configMap.operateType.NEW) {
                $pointMapping.removeAttr('readonly');
                pointUpdate(false);
            } else {
                $pointMapping.attr('readonly', true);
            }
        } else if (stateMap.pointType == configMap.cloudPointType.VIRTUAL_POINT) {
            jqueryMap.$cloudPointWrapper.html(beopTmpl('tpl_point_form_algorithm', pointModel));
        } else {
            jqueryMap.$cloudPointWrapper.html(beopTmpl('tpl_point_form_calc', pointModel));
            if (stateMap.zTreeInstance) {
                $("#dmSysTree").html(stateMap.$treeDomDetach);
            } else {
                loadApiTree();
            }

            if (stateMap.operateType == configMap.operateType.EDIT) {
                jqueryMap.$cloudPointWrapper.find('.header button').hide();
            } else {
                jqueryMap.$cloudPointWrapper.find('.header .point_translate').hide();
            }
            setDateFormat();
            refreshEditor();
        }
        configMap.timeFormatMap.format = timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC);
        $("#historyTestTimePicker").datetimepicker(configMap.timeFormatMap);
        setCloudPointTypeName();
    };

    backToRefreshTable = function () {
        if (stateMap.cloudPointWrapperDetach) {
            jqueryMap.$cloudPointWrapper.html(stateMap.cloudPointWrapperDetach);
        }
        loadSheet(stateMap.currentPage);
    };

    onNewPoint = function () {
        stateMap.scrollTop = 0;
        stateMap.operateType = configMap.operateType.NEW;
        stateMap.isMultiple = false;
        loadPointDetailPage();
    };

    onEditPoint = function () {
        stateMap.scrollTop = jqueryMap.$container.find('#pointManageWrapper .table-body').scrollTop();
        stateMap.operateType = configMap.operateType.EDIT;
        stateMap.isMultiple = false;
        if (stateMap.currentPointIndex == -1) {
            alert('please select one point first.');
            return;
        }
        loadPointDetailPage(true);

        if (stateMap.pointType == configMap.cloudPointType.CALC_POINT) {
            onChangePointType();
            stateMap.isBatch = false;
            var data = stateMap.sheetData[stateMap.currentPointIndex];
            if (data && data.params.flag == configMap.cloudPointType.CALC_POINT) { // 计算点
                stateMap.moduleName = getModuleName(data.value);
                stateMap.currentEditorText = data.params.logic;
                jqueryMap.$point_format.val(data.params.format);
                stateMap.pointFormat = data.params.format;
            } else {
                jqueryMap.$codeMirrorBox.empty().hide();
            }
            jqueryMap.$editTitle.attr('i18n', 'debugTools.sitePoint.EDIT_POINTS');
            I18n.fillArea(jqueryMap.$container);
        }
    };

    requestCalcPointSave = function (url, point) {
        Spinner.spin(document.body);
        return $.post(url, point).then(function (result) {
            if (result.success) {
                stateMap.pointId = result.data._id;
                Alert.success(document.body, I18n.resource.debugTools.info.MODIFY_SUCCESS).showAtTop(2000);
                stateMap.$treeDomDetach = $("#dmSysTreeInner").detach();
                backToRefreshTable();
            } else {
                var msg = I18n.resource.dataManage.EXISTS_POINT;
                if (I18n.resource.dataManage[result.msg]) {
                    msg = I18n.resource.dataManage[result.msg];
                    if (result.data && result.data.length) {
                        msg += ': ' + '\n' + result.data.join('\n');
                    }
                }
                alert(msg);
                $(".infoBox-msg").css('width', '294px');
                return $.Deferred().reject();
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    getPointModel = function () {
        jqueryMap.$pointForm = $('#pointForm');
        var url, pointModel = jqueryMap.$pointForm.serializeObject();
        if (stateMap.operateType === configMap.operateType.NEW) { // 添加点窗口
            if (stateMap.isMultiple) {
                url = '/point_tool/addCloudPoints/' + AppConfig.projectId + '/';
            } else {
                url = '/point_tool/addCloudPoint/' + AppConfig.projectId + '/';
            }
        } else { // 编辑点窗口
            url = '/point_tool/editCloudPoint/' + AppConfig.projectId + '/';
        }

        if (pointModel) {
            pointModel.flag = parseInt(stateMap.pointType);
        }
        if (stateMap.pointType == configMap.cloudPointType.CALC_POINT) {
            $.extend(pointModel, {
                'logic': BEOPUtil.logicContentHandle(stateMap.editor.doc.getValue()),
                'moduleName': getModuleName(jqueryMap.$point_name.val()),
                'format': jqueryMap.$point_format.val()
            });
        }
        return {
            'url': url,
            'pointModel': pointModel
        }
    };

    cloudPointConfirm = function () {
        sendPointRequest(getPointModel().url, getPointModel().pointModel);
    };

    getCalcPointModel = function () {
        var model = getPointModel();
        stateMap.onlineTestType = configMap.isWriteToRealTimeDb.WRITE;
        $.extend(model.pointModel, {
            'logic': BEOPUtil.logicContentHandle(stateMap.editor.doc.getValue()),
            'moduleName': getModuleName(jqueryMap.$point_name.val())
        });
        return {
            'url': model.url,
            'pointModel': model.pointModel
        }
    };

    isValidPointName = function (pointName) {
        if (!/^[a-zA-Z]\w+$/.test(pointName)) {
            alert(I18n.resource.admin.panelManagement.POINT_NAME);
            return false;
        }
        return true;
    };

    calcPointSave = function () {
        var model = getCalcPointModel();
        if (!stateMap.isMultiple && !isValidPointName(model.pointModel.value)) {
            return;
        }
        requestCalcPointSave(model.url, model.pointModel);
    };

    calcPointConfirm = function () {
        var model = getCalcPointModel();
        if (!stateMap.isMultiple && !isValidPointName(model.pointModel.value)) {
            return;
        }
        confirmCalcPointRequest(model.url, model.pointModel);
    };

    sendPointRequest = function (url, pointModel) {
        Spinner.spin(document.body);
        $.post(url, pointModel).done(function (result) {
            if (result.success) {
                Alert.success(document.body, I18n.resource.debugTools.info.MODIFY_SUCCESS).showAtTop(2000);
                backToRefreshTable();
            } else {
                if (I18n.resource.dataManage[result.msg]) {
                    alert(I18n.resource.dataManage[result.msg]);
                } else {
                    alert(I18n.resource.dataManage.EXISTS_POINT);
                }
                Spinner.stop();
            }
        });
    };

    confirmCalcPointRequest = function (url, pointModel) {
        var points = getPointsHandler();
        var requestPromises = [];
        jqueryMap.$online_test_process = jqueryMap.$container.find('#test_process');
        points.forEach(function (point) {
            $.extend(point, pointModel);
            point['alias'] = pointModel['alias'];
            point['logic'] = BEOPUtil.logicContentHandle(point['content']);
            point['moduleName'] = getModuleName(point['name']);
            point['value'] = point['name'];

            delete point['name'];
            delete point['content'];

            var one_point_request = online_test_request(point['logic'], point['value'], point['moduleName']).then(function (resultDict) {
                var historyTestTime = $("#historyTestTimePicker").val() || '';
                var opt = {};
                opt.historyTestTime = historyTestTime;
                opt.newDate = new Date().format('yyyy-MM-dd HH:mm:ss');
                if (parseInt(resultDict.error) == 0) {
                    return $.post(url, point).then(function (result) {
                        if (result.success) {
                            !stateMap.isMultiple ? stateMap.pointId = result.data._id : '';
                        } else {
                            if (stateMap.isMultiple) {
                                var msg = I18n.resource.dataManage.EXISTS_POINT;
                                if (I18n.resource.dataManage[result.msg]) {
                                    msg = I18n.resource.dataManage[result.msg];
                                    if (result.data && result.data.length) {
                                        msg += ': ' + result.data.join(',');
                                    }
                                }
                                alert(msg);
                            } else {
                                if (I18n.resource.dataManage[result.msg]) {
                                    opt.errorResult = I18n.resource.dataManage[result.msg];
                                } else {
                                    opt.errorResult = I18n.resource.dataManage.EXISTS_POINT;
                                }
                                jqueryMap.$online_test_process.show().prepend(beopTmpl('tpl_test_progress', {opt: opt}));
                            }
                            return $.Deferred().reject();
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                } else {
                    if (stateMap.isMultiple) {
                        for (var key in resultDict.value) {
                            var opt = {};
                            opt.process = resultDict.value[key].process;
                            if (parseInt(resultDict.value[key].error) == 1) {
                                opt.errorResult = resultDict.value[key].value;
                            } else {
                                opt.result = key + ' = ' + resultDict.value[key].value;
                            }
                            ('#test_process').show().prepend(beopTmpl('tpl_test_progress', {opt: opt}));
                        }
                    } else {
                        opt.errorResult = resultDict.value;
                        jqueryMap.$online_test_process.show().prepend(beopTmpl('tpl_test_progress', {opt: opt}));
                        Spinner.stop();
                    }
                    return $.Deferred().reject();
                }
            });
            requestPromises.push(one_point_request);
        });

        $.when.apply(null, requestPromises).done(function () {
            Alert.success(document.body, I18n.resource.debugTools.info.MODIFY_SUCCESS).showAtTop(2000);
            stateMap.$treeDomDetach = $("#dmSysTreeInner").detach();
            backToRefreshTable();
        });
    };

    pointNameCheck = function (val) {
        return /^[_a-zA-Z]\w+$/.test(val);
    };

    getBatchHistorySelectedPointInfoList = function () {
        var selectedPoints = stateMap.$datatable.simpleDataTable('getSelectedData');
        for (var i = 0; i < selectedPoints.length; i++) {
            stateMap.selectedPointValueList.push(selectedPoints[i].value);
            stateMap.selectedPointModuleNameList.push(selectedPoints[i].params.moduleName);
            stateMap.selectedPointFormatList.push(selectedPoints[i].params.format);
            stateMap.selectedPointIdList.push(selectedPoints[i]._id);
            stateMap.selectedPointLogicList.push(selectedPoints[i].params.logic);
        }
    };

    dateTimeCheck = function (timeFrom, timeTo) {
        if (timeFrom == '') {
            alert(I18n.resource.debugTools.sitePoint.START_DATE_EMPTY_TIP);
            return false;
        }

        if (timeTo == '') {
            alert(I18n.resource.debugTools.sitePoint.END_DATE_EMPTY_TIP);
            return false;
        }

        if (timeFrom > timeTo) {
            alert(I18n.resource.debugTools.sitePoint.DATE_ERROR_TIP);
            return false;
        }

        return true;
    };

    changePageSize = function () {
        stateMap.page_size = Number($(this).val());
        loadSheet();
    };
//判断字符串是否可以转变成json格式
    tryParseJSON = function (jsonString) {
        try {
            var o = JSON.parse(jsonString);
            if (o && typeof o === "object") {
                return o;
            }
        }
        catch (e) {
        }
        return false;
    };

    joinCurve = function () {
        var point_list = [],
            date_start,
            data_end,
            format,
            structure_list = {},
            showHistoryTable;
        var selectedPoints = stateMap.$datatable.simpleDataTable('getSelectedData');
        if (!selectedPoints.length) {
            return;
        } else if (selectedPoints.length > 10) {
            alert(I18n.resource.dataManage.UP_TO_TEN_RECORDS);
            return;
        } else {
            var valueType = function (name, pointValue) {
                var structure = tryParseJSON(pointValue);
                if (structure) {
                    var attrList = [];
                    for (var attr in structure) {
                        attrList.push(attr);
                    }
                    structure_list[name] = attrList;
                }
            }
            //只选中一条且点值为字符串时.显示表格;
            if (selectedPoints.length == 1) {
                // var isStructure = tryParseJSON(selectedPoints[0].pointValue);
                showHistoryTable = false;
                if (selectedPoints[0].pointValue && isNaN(selectedPoints[0].pointValue)) {
                    showHistoryTable = true;
                }
            }
            selectedPoints.forEach(function (item) {
                if (stateMap.pointType == configMap.cloudPointType.MAPPING_POINT) {
                    if (item.params.mapping && item.params.mapping.point) {
                        point_list.push(item.params.mapping.point);
                        valueType(item.params.mapping.point, item.pointValue);
                    }
                } else {
                    point_list.push(item.value);
                    valueType(item.value, item.pointValue);
                }
            });
        }

        Spinner.spin(ElScreenContainer);

        if (localStorage.getItem('dataManagerStartDate')) {
            date_start = new Date(localStorage.getItem('dataManagerStartDate')).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE);
            data_end = new Date(localStorage.getItem('dataManagerEndDate')).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE);
            format = localStorage.getItem('dataManagerFormat') ? localStorage.getItem('dataManagerFormat') : 'm5';
        } else {
            date_start = new Date(new Date() - 24 * 60 * 60 * 1000).format("yyyy-MM-dd HH:mm:00");
            data_end = new Date().format("yyyy-MM-dd HH:mm:00");
            format = 'm5';
        }

        var getHistoryDataReduce = function (hidePointList) {
            hidePointList = hidePointList ? hidePointList : [];
            var obj = {
                startDate: date_start,
                endDate: data_end,
                format: format,
                hidePointList: hidePointList,
                pointList: point_list,
                projectId: AppConfig.projectId,
                isShowRepairData: stateMap.pointType == configMap.cloudPointType.CALC_POINT,
                isShowTable: showHistoryTable,
                structure_list: structure_list
            };
            new HistoryChart(obj).show();
        };

        if (point_list.length == 1) {
            $.ajax({
                url: stateMap.ExpertContainerUrl + "calcpoint/getdepend/" + AppConfig.projectId + "/" + point_list[0],
                type: "GET"
            }).done(function (result) {
                if (result.error == 0) {
                    if (result.value) {
                        var hidePointList = [];
                        if (result.value.flag0) {
                            hidePointList = hidePointList.concat(result.value.flag0);
                        }

                        if (result.value.flag1) {
                            hidePointList = hidePointList.concat(result.value.flag1);
                        }

                        if (result.value.flag2) {
                            hidePointList = hidePointList.concat(result.value.flag2);
                        }
                    }
                    //删除本来的点, 不需要隐藏
                    hidePointList = hidePointList.filter(function (point) {
                        return point != point_list[0];
                    });

                    getHistoryDataReduce(hidePointList);
                } else {
                    alert('错误信息为：' + result.value);
                }
            }).fail(function (e) {
                serverRequestError(e);
            });
        } else {
            getHistoryDataReduce();
        }
    };

    pointRefresh = function () {
        $("#cloudPointfilterSort").val(0);
        setFilterSort('0');
        loadSheet(stateMap.currentPage);
    };

    loadSheet = function (page) {

        Spinner.spin(jqueryMap.$container.get(0));
        setJqueryMap();
        onPointTypeSelected();

        page = typeof(page) == "object" || typeof(page) == typeof(undefined) ? 1 : page;
        stateMap.currentPage = parseInt(page);
        var queryData = {
            projectId: parseInt(AppConfig.projectId),
            currentPage: page,
            pointType: stateMap.pointType,
            searchOrder: stateMap.order,
            searchText: (!jqueryMap.$text_search.val() || jqueryMap.$text_search.val().trim() === '') ? '' : jqueryMap.$text_search.val().trim()
        };
        if (typeof stateMap.pointType !== typeof undefined) {
            queryData.pointType = stateMap.pointType;
        }

        if (stateMap.dataType === 'history') {
            queryData.t_time = stateMap.historyDataTime + ':00';
        } else {
            queryData.t_time = '';
        }

        jqueryMap.$point_export.attr('href', '/point_tool/export/cloud/' + AppConfig.projectId);
        //project_data_synchronization_check
        projectCheckDataSync();
        var $pageSizeSelect = $("#pageSizeSelect");
        var pageSizeIndex;
        if ($pageSizeSelect.length) {
            pageSizeIndex = $pageSizeSelect.find("option:selected").index();
        } else {
            pageSizeIndex = 1;
        }
        var dataTableOptions = {
            url: '/point_tool/getCloudPointTable/',
            post: WebAPI.post,
            postData: queryData,
            searchOptions: {
                pageSize: 'pageSize',
                pageNum: 'currentPage'
            },
            searchInput: $("#text_search"),
            rowsNums: [50, 100, 200, 500, 1000],
            pageSizeIndex: pageSizeIndex,
            dataFilter: function (result) {
                if (result.success) {
                    stateMap.sheetData = result.data.pointTable;
                    return result.data.pointTable;
                }
            },
            onBeforeRender: function () {
                Spinner.spin($(".sheet").get(0));
            },
            onAfterRender: function () {
                setPointErrorNum();
                Spinner.stop();
            },
            onRowClick: function (tr, data) {
                stateMap.currentPointIndex = $(tr).index();
            },
            onRowDbClick: function (tr, data) {
                stateMap.currentPointIndex = $(tr).index();
                onEditPoint();
            },
            onShowMore: function (tr, data, e) {
                showMorePointValue(tr, data);
                e.stopPropagation();
            },
            totalNumIndex: 'data.pointTotal'
        };
        if (stateMap.pointType == configMap.cloudPointType.MAPPING_POINT) {
            dataTableOptions = $.extend(dataTableOptions, {
                colNames: [I18n.resource.debugTools.sheetHeaders.CONFIGURATION_POINT,
                    I18n.resource.dataManage.REMARK,
                    I18n.resource.debugTools.sheetHeaders.MAPPING_POINT,
                    I18n.resource.dataManage.POINT_VALUE,
                    I18n.resource.dataManage.UPDATE_TIME,
                    I18n.resource.debugTools.sheetHeaders.CHANGE_MAN],
                colModel: [
                    {index: 'value', width: '20%'},
                    {index: 'alias', width: '20%'},
                    {index: 'params.mapping.point', width: '20%'},
                    {index: 'pointValue', copy: true, width: '20%'},
                    {
                        index: 'pointTime', type: 'time', width: '140px', converter: function (value) {
                        return value ? timeFormat(value, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC)) : value;
                    }
                    },
                    {index: 'modify_by', width: '100px'}
                ]
            });
        } else if (stateMap.pointType == configMap.cloudPointType.CALC_POINT
            || stateMap.pointType == configMap.cloudPointType.VIRTUAL_POINT) {
            dataTableOptions = $.extend(dataTableOptions, {
                colNames: [I18n.resource.debugTools.sheetHeaders.CONFIGURATION_POINT,
                    I18n.resource.dataManage.REMARK, I18n.resource.dataManage.POINT_VALUE,
                    I18n.resource.dataManage.UPDATE_TIME, I18n.resource.debugTools.sheetHeaders.CHANGE_MAN],
                colModel: [
                    {index: 'value', width: '25%', itemClass: 'point-name'},
                    {index: 'alias', width: '25%'},
                    {index: 'pointValue', copy: true, width: '30%'},
                    {
                        index: 'pointTime', type: 'time', width: '140px',
                        converter: function (value) {
                            return value ? timeFormat(value, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME_NO_SEC)) : value;
                        }
                    },
                    {index: 'modify_by', width: '100px'}
                ]
            });
        } else {
            return;
        }

        if (stateMap.$datatable) {
            stateMap.$datatable.removeData();
            stateMap.$datatable = null;
        }

        stateMap.$datatable = jqueryMap.$sheet.off().simpleDataTable(dataTableOptions);
    };

    projectCheckDataSync = function () {
        if (!window.localStorage.getItem("dataSyncCheckNotNotification")) {
            WebAPI.get('/point_tool/dataSyncCheck/' + AppConfig.projectId).done(function (result) {
                if (result.success) {
                    if (!result.data && result.data.dataSync) {
                        infoBox.prompt(I18n.resource.debugTools.sitePoint.THE_PROJECT_DATA_NOT_CONNEDTED_WITH_THE_REAL_TIME_PROJECT_DATA, function (value) {
                            if ($.trim(value)) {
                                WebAPI.post("/point_tool/setPJRealityTable", {
                                    "mysqlname": value,
                                    "projectId": AppConfig.projectId
                                }).fail(function () {
                                    alert(I18n.resource.debugTools.sitePoint.FAILED_TO_SYNCHRONIZE_DATA);
                                }).done(function () {
                                    alert(I18n.resource.debugTools.sitePoint.SYNCHRONIZE_DATA_SUCCESSFULLY);
                                })
                            }
                        }, {
                            buttons: {
                                cancel: {
                                    callback: function () {
                                        window.localStorage.setItem("dataSyncCheckNotNotification", true);
                                    }
                                }
                            }
                        });
                    }
                }
            })
        }
    };
    onPointTypeSelected = function () {
        jqueryMap.$cloudPointSourceSetBox.hide();
        if (stateMap.pointType == configMap.cloudPointType.MAPPING_POINT) {
            jqueryMap.$cloudPointSourceSetBox.show();
        }
        jqueryMap.$buttonGroup.addClass('pointType');

    };
    pointUpdate = function (isLoadSheet) {
        Spinner.spin(document.body);
        WebAPI.post('/cloudpoint/update', {"proj": AppConfig.projectId}).done(function (result) {
            if (!result.error) {
                if (isLoadSheet) {
                    loadSheet()
                }
            } else {
                alert.danger(result.msg || i18n_resource.common.REQUEST_ERROR);
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    importSheet = function (event) {
        var fileData = event.target.files[0];
        var formData = new FormData();
        formData.append('file', fileData);
        formData.append('projectId', AppConfig.projectId);
        formData.append('userId', 68);
        var _this = $(this);
        Spinner.spin(document.body);
        $.ajax({
            url: "/point_tool/cloudPoint/import/",
            type: "POST",
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        }).done(function (result) {
            if (result.success) {
                alert.success(i18n_resource.dataManage.DATA_IMPORT_SUCCESS);
                pointUpdate(true);
            } else {
                alert.danger(result.msg || i18n_resource.common.REQUEST_ERROR);
            }
        }).always(function () {
            Spinner.stop();
            _this.val(null);
        });
        return false;
    };

    onRefreshCloudPoint = function () {
        confirm(I18n.resource.debugTools.sitePoint.SYNCHRONIZE_ALL_POINTS_OR_NOT, function () {
            Spinner.spin(document.body);
            WebAPI.post('/point_tool/syncCloudPoint', {projectId: AppConfig.projectId}).done(function (result) {
                alert(I18n.resource.debugTools.sitePoint.SYNCHRONIZATION_SUCCESSFUL + result.data + I18n.resource.debugTools.sitePoint.POINTS);
                pointUpdate(true);
            }).always(function () {
                Spinner.stop();
            });
        });
    };

    onOpenSinglePointSearchLog = function (e) {
        stateMap.scrollTop = jqueryMap.$container.find('#pointManageWrapper .table-body').scrollTop();
        var val = $(this).closest('td').find('.point-name').text();
        stateMap.pointErrorLogName = val;
        loadLogPage();
        e.stopPropagation();
        logSinglePointSearch(val);
        I18n.fillArea(jqueryMap.$container);
    };

    onOpenSearchLog = function () {
        stateMap.scrollTop = 0;
        stateMap.pointErrorLogName = '';
        loadLogPage();
        logSearch();
        I18n.fillArea(jqueryMap.$container);
    };

    onLogSearchCancel = function () {
        if (stateMap.cloudPointWrapperDetach) {
            jqueryMap.$cloudPointWrapper.html(stateMap.cloudPointWrapperDetach);
            jqueryMap.$container.find('#pointManageWrapper .table-body').scrollTop(stateMap.scrollTop);
            setPointErrorNum();
        }
    };

    loadLogPage = function () {
        jqueryMap.$cloudPointWrapper = $('#cloudPointWrapper');
        stateMap.cloudPointWrapperDetach = jqueryMap.$cloudPointWrapper.children().detach();
        jqueryMap.$cloudPointWrapper.append(beopTmpl('tpl_search_log', {}));
        $("#logDateStart").datetimepicker({
            startView: 'month',
            autoclose: true,
            format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME),
            forceParse: false
        });
        $("#logDateEnd").datetimepicker({
            startView: 'month',
            autoclose: true,
            format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME),
            forceParse: false
        });
        if (!stateMap.logPageSize) {
            stateMap.logPageSize = 200;
        }
        setJqueryMap();
    };

    logPageSizeChange = function () {
        stateMap.logPageSize = $(this).val();
        logSearch();
    };

    searchLogOfOneHour = function () {
        var now = new Date();
        $('#logDateStart').attr('value', new Date(now.getTime() - 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'));
        $('#logDateEnd').attr('value', now.format('yyyy-MM-dd HH:mm:ss'));
        logSearch();
    };
    searchLogOfyesterday = function () {
        var now = new Date();
        $('#logDateStart').attr('value', new Date(now - 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00'));
        $('#logDateEnd').attr('value', new Date(now - 24 * 60 * 60 * 1000).format('yyyy-MM-dd 23:59:59'));
        logSearch();
    };
    searchLogOftoday = function () {
        $('#logDateStart').attr('value', new Date().format('yyyy-MM-dd 00:00:00'));
        $('#logDateEnd').attr('value', new Date().format('yyyy-MM-dd HH:mm:ss'));
        logSearch();
    };
    searchLogOfAWeek = function () {
        var now = new Date();
        $('#logDateStart').attr('value', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'));
        $('#logDateEnd').attr('value', new Date().format('yyyy-MM-dd HH:mm:ss'));
        logSearch();
    };

    logSearch = function (page) {
        Spinner.spin(document.body);
        var timeFrom = $('#logDateStart').val();
        var timeTo = $('#logDateEnd').val();
        var url = '', data = {
            projId: AppConfig.projectId,
            pageSize: stateMap.logPageSize,
            pageNum: +page ? +page : 1,
            type: ''
        };
        if (stateMap.pointErrorLogName) {
            url = '/api/errorlog/onepoint';
            data.pointname = stateMap.pointErrorLogName;
        } else {
            url = '/api/errorlog';
            if (!timeFrom) {
                timeFrom = new Date().format('yyyy-MM-dd 00:00:00');
                $('#logDateStart').attr('value', timeFrom);
            }
            if (!timeTo) {
                timeTo = new Date().format('yyyy-MM-dd 23:59:59');
                $('#logDateEnd').attr('value', timeTo);
            }
        }
        data.timeFrom = timeFrom;
        data.timeTo = timeTo;

        WebAPI.post(url, data).done(function (result) {
            if (result.success == true) {
                $('#totalLogsNum').text(result.data.total);
                stateMap.logCurrentPage = parseInt(page);
                logPaginationRefresh(result.data.total);
                $('#logReport').html(beopTmpl('tpl_search_log_result', {logList: result.data.records}));
            } else {
                alert(result.msg);
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    logSinglePointSearch = function (pointName, page) {
        Spinner.spin(document.body);
        WebAPI.post('/api/errorlog/onepoint', {
            projId: AppConfig.projectId,
            pageSize: stateMap.logPageSize,
            pageNum: +page ? +page : 1,
            pointname: pointName,
            type: ''
        }).done(function (result) {
            if (result.success) {
                $('#totalLogsNum').text(result.data.total);
                stateMap.logCurrentPage = parseInt(page);
                logPaginationRefresh(result.data.total);
                $('#logReport').html(beopTmpl('tpl_search_log_result', {logList: result.data.records}));
            } else {
                alert(result.msg);
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    logSearchDeleteAll = function () {
        confirm(I18n.resource.debugTools.info.IS_CLEAR_LOG, function () {
            Spinner.spin(document.body);
            WebAPI.post('/api/errorlog/dellog', {
                projId: AppConfig.projectId,
                pointname: stateMap.pointErrorLogName ? stateMap.pointErrorLogName : '',
                type: ''
            }).done(function (result) {
                if (result.success) {
                    $("#logReport").empty();
                    $("#logPagination").hide();
                    alert(I18n.resource.common.DELETE_SUCCESS);
                } else {
                    alert(result.msg);
                }
            }).always(function () {
                Spinner.stop();
            })
        });
    };

    treeSearch = function (e) {
        var val = $("#treeSearch").val().trim();
        var $apiTreeUl = $("#apiTreeUl"), $apiTreeSearchUl = $("#apiTreeSearchUl");
        if (val == '') {
            $apiTreeUl.show();
            $apiTreeSearchUl.hide();
        } else {
            if (e.keyCode === 13) {
                WebAPI.post('/tag/search', {
                    "projId": AppConfig.projectId,
                    "searchName": val,
                    "path": "",
                    "isRecursive": true,
                    "Prt": ""
                }).done(function (result) {
                    if (result.status) {
                        stateMap.treeSearchList = [];
                        var treeNodeList, requestSearchTreeList = [];
                        for (var i = 0; i < stateMap.requestTreeList.length; i++) {
                            if (stateMap.requestTreeList[i].name.indexOf(val) != -1) {
                                requestSearchTreeList.push(stateMap.requestTreeList[i]);
                            }
                        }

                        treeNodeList = requestSearchTreeList.concat(result.thingsList);

                        for (var i = 0; i < treeNodeList.length; i++) {
                            var folderFlag, item = treeNodeList[i];
                            folderFlag = item.type && item.type == 'group' ? true : false;
                            stateMap.treeSearchList.push({
                                id: ObjectId(),
                                name: item.name,
                                sample: item.sample ? item.sample : '',
                                isFolder: folderFlag,
                                isParent: folderFlag
                            });
                        }

                        var zTreeSetting = {
                            view: {
                                selectedMulti: false,
                                addHoverDom: showNodeTitle.bind(this)
                            },
                            edit: {
                                enable: true,
                                showRemoveBtn: false,
                                showRenameBtn: false
                            },
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            },
                            callback: {
                                onDblClick: zTreeOnDblClick,
                                onDrag: zTreeOnDrag,
                                onDrop: zTreeOnDrop.bind(this)
                            }
                        };
                        $apiTreeUl.hide();
                        stateMap.zTreeSearchInstance = $.fn.zTree.init($apiTreeSearchUl, zTreeSetting, stateMap.treeSearchList);

                        var $span = $apiTreeSearchUl.find('a span[id$=_span]');
                        var keywordList = val.replace('/[^\w\d\s]/g', ' ').split(/\s/g);

                        $span.each(function (index, item) {
                            var $item = $(item);
                            var text = $item.text();
                            keywordList.forEach(function (char) {
                                if (char) {
                                    text = text.replace(new RegExp("(" + char + ")(?![^<]*>|[^<>]*</)", "gi"), '<span class="search-tree-text">$1</span>');
                                }
                            });
                            $item.html(text);
                        });

                        $apiTreeSearchUl.show();
                    } else {
                        alert('error:' + result.message);
                    }
                }).always(function () {
                    Spinner.stop();
                })
            }
        }
    };

    loadApiTree = function () {
        var zTreeSetting = {
            view: {
                selectedMulti: false,
                addHoverDom: showNodeTitle.bind(this)
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onDblClick: zTreeOnDblClick,
                onDrag: zTreeOnDrag,
                onDrop: zTreeOnDrop.bind(this)
            },
            async: {
                enable: true,
                type: 'post',
                url: '/tag/getThingTree',
                otherParam: {"projId": AppConfig.projectId, onlyGroupForRoot: true},
                autoParam: ["_id=Prt"],
                dataFilter: function (treeId, parentNode, responseData) {
                    return responseData.thingTree;
                }
            }
        };
        stateMap.tagTreePromise.done(function () {
            changeToZTreeNodes();
            stateMap.zTreeInstance = $.fn.zTree.init($("#apiTreeUl"), zTreeSetting, stateMap.treeList);
        })
    };

    zTreeOnDblClick = function (event, treeId, treeNode) {// event js event , treeId 父节点id, treeNode 当前节点信息
        if (!treeNode.isParent) {
            if (treeNode.sample) {
                insertContent(treeNode.sample);
            } else {
                insertContent(treeNode.name);
            }
        }
    };

    zTreeOnDrag = function (event, treeId, treeNodes) {
        if (treeNodes[0].isParent) {
            return false;
        }
    };

    zTreeOnDrop = function (e, treeId, treeNodes, targetNode, moveType) {
        if (!treeNodes[0].isParent) {
            if ($(e.target).closest('#codeMirrorBox').length) {
                if (treeNodes[0].sample) {
                    insertContent(treeNodes[0].sample);
                } else {
                    insertContent(treeNodes[0].name);
                }
            }
        }
    };

    getApiFolderNameList = function () {
        var apiTreeNodeList = [], nodeTypeNameList = [];
        for (var i = 0; i < stateMap.requestTreeList.length; i++) {
            var apiType = stateMap.requestTreeList[i].api_type;
            if ($.inArray(apiType, nodeTypeNameList) === -1) {
                nodeTypeNameList.push(apiType);
                apiTreeNodeList.push({
                    id: ObjectId(),
                    type: apiType
                });
            }
        }
        return apiTreeNodeList;
    };

    changeToZTreeNodes = function () {
        var apiTreeNodeList = getApiFolderNameList();
        stateMap.treeList = [];
        for (var i = 0; i < stateMap.requestTreeList.length; i++) {
            var pId, treeNode = stateMap.requestTreeList[i];
            for (var j = 0; j < apiTreeNodeList.length; j++) {
                if (treeNode.api_type === apiTreeNodeList[j].type) {
                    pId = apiTreeNodeList[j].id;
                    break;
                }
            }
            stateMap.treeList.push({
                id: ObjectId(),
                name: treeNode.name,
                sample: treeNode.sample,
                pId: pId
            });
        }
        for (var j = 0; j < apiTreeNodeList.length; j++) {
            stateMap.treeList.push({
                id: apiTreeNodeList[j].id,
                name: apiTreeNodeList[j].type,
                pId: 10,
                open: false,
                isFolder: true
            });
        }

        stateMap.treeList.push({
            id: 10,
            name: I18n.resource.dataManage.SYSTEM_API,
            pId: 0,
            open: false,
            isFolder: true
        });

        var tagFolderId = 15;
        stateMap.treeList.push({
            id: tagFolderId,
            name: 'Tag Structure',
            pId: 0,
            open: false,
            isFolder: true,
            isParent: true
        });

        setTreeNodeIcon(stateMap.thingTreeList, tagFolderId);
        stateMap.treeList = stateMap.treeList.concat(stateMap.thingTreeList);
    };

    setTreeNodeIcon = function (node, rootId) {
        for (var i = 0; i < node.length; i++) {
            if (rootId) {
                node[i].pId = rootId;
            }
            if (node[i].tag && node[i].tag.icon) {
                node[i].iconSkin = 'iconfont icon-' + node[i].tag.icon;
            }
            if (node[i].children && node[i].children.length) {
                setTreeNodeIcon(node[i].children, node[i]._id);
            }
        }
    };

    showNodeTitle = function (treeId, treeNode) {
        if (!treeNode.isParent) {
            for (var i = 0; i < stateMap.requestTreeList.length; i++) {
                var item = stateMap.requestTreeList[i];
                if (treeNode.name == item.name) {
                    var titleHtml = 'api:  ' + item.name + '\n' + I18n.resource.common.DESCRIPTION + ':  '
                        + item.dis_cription + '\n' + I18n.resource.common.EXAMPLE + ':  ' + item.sample;
                    $("#" + treeNode.tId + "_a").attr('title', titleHtml);
                    break;
                }
            }
        }
    };

    insertContent = function (value) {
        stateMap.editor.replaceSelection(value);
    };

//---------Exports---------
    beop.view = beop.view || {};

    beop.view.cloudSheet = {
        configModel: configModel,
        init: init,
        destroy: destroy,
        loadSheet: loadSheet
    };
}(beop || (beop = {})));
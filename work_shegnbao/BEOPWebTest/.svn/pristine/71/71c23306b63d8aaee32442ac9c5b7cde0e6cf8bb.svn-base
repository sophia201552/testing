(function (beop) {
    var i18n = I18n.resource.debugTools.sitePoint,
        i18n_point = I18n.resource.debugTools.sitePoint,
        i18n_info = I18n.resource.debugTools.info,
        i18n_sheetHeaders = I18n.resource.debugTools.sheetHeaders;
    var configMap = {
            htmlURL: '/point_tool/html/cloudPointTable',
            settable_map: {
                sheetModel: true
            },
            operateType: {
                NEW: 'new',
                EDIT: 'edit'
            },
            cloudPointType: {
                MAPPING_POINT: 0,
                VIRTUAL_POINT: 1,
                CALC_POINT: 2
            },
            batchHistoryProcessStatus: {
                NOT_START: 'none',
                NOT_RUN: -1,
                RUN: 0,
                FINISH: 1
            },
            isWriteToRealTimeDb: {
                NOT_WRITE: 0,
                WRITE: 1
            },
            autoCompleteList: ['get_data', 'get_int', 'get_float',
                'get_history_data_of_last_hour', 'get_avg_data_of_last_hour', 'get_status_timeratio_of_last_hour_int',
                'api_calc_power_by_run', 'api_calc_power_by_vsd_run', 'api_calc_power_by_amp', 'api_calc_delta_if_run',
                'api_calc_max_in_points', 'api_calc_min_in_points', 'api_calc_sum_in_points', 'api_calc_avg_if_run'],
            sheetModel: null,
            page_size: 50
        },
        stateMap = {
            sheetInstance: null,
            sheetHeaders: [i18n_sheetHeaders.CONFIGURATION_POINT, i18n_sheetHeaders.COMMENT, i18n_sheetHeaders.ENGLISH_NOTES, i18n_sheetHeaders.CHANGE_MAN],
            sheetDataType: {
                system: [i18n.SYSTEM0, i18n.SYSTEM1, i18n.SYSTEM2, i18n.SYSTEM3, i18n.SYSTEM4],
                device: [i18n.EQUIPMENT0, i18n.EQUIPMENT1, i18n.EQUIPMENT2, i18n.EQUIPMENT3, i18n.EQUIPMENT4, i18n.EQUIPMENT5, i18n.EQUIPMENT6],
                type: [i18n.TYPES0, i18n.TYPES1, i18n.TYPES2, i18n.TYPES3, i18n.TYPES4, i18n.TYPES5, i18n.TYPES6, i18n.TYPES7, i18n.TYPES8, i18n.TYPES9, i18n.TYPES10]
            },

            changedList: [],
            currentPage: 1,
            pointTotal: 0,
            currentPointIndex: 0,
            operateType: '',
            editor: null,
            ExpertContainerUrl: '',
            historyTimer: undefined,
            historyWinTimer: undefined,
            batchHistoryTimer: undefined,
            currentEditorText: '',
            pointId: '',
            moduleName: '',
            datePickerInstanceStart: null,
            datePickerInstanceEnd: null,
            templateInstance: null,
            dateFormat: {},
            transmitLogic: '',
            onlineTestType: 1,
            batchHistorySelectedPointValueList: [],
            batchHistorySelectedPointModuleNameList: [],
            batchHistorySelectedPointFormatList: [],
            batchHistorySelectedPointIdList: [],
            batchHistorySelectedPointLogicList: [],
            pointFormat: 'm5',
            historyInfoList: []
        },
        jqueryMap = {},
        storage, setJqueryMap, configModel, importSheet, init,
        onChangeProject, onLoadSheet, onNewPoint, onEditPoint, onDeletePoint, onEditPointConfirm, renderSheet, paginationRefresh,
        onUndoPoint, onRedoPoint, onSearchTextKeyDown, getPointIndex, deleteRows, onChangePointType,
        online_test, single_generate, history_generate, history_generate_delete, refreshModuleStatusShow, get_insert_info, refreshRepairStatus,
        requestRepairData, help, refreshDatePick, onPointTypeSelected, getPointsHandler, requestTimeHandler,
        winHideEvents, winShowEvents, onClearPoint, isCalcPoint, online_test_request, setIsBatch, onConvertToCloud, onIsConvertToCloud, import_from_template, save_as_template,
        loadPointTable, autoSave, destroy, refreshEditor, onRefreshCloudPoint, setDateFormat, serverRequestError,
        single_quick_generate_data, batch_history_quick_generate_data, batch_history_win, refreshPointProgress,
        batchHistoryPointValueAdd, refreshBatchHistoryUl, batchHistoryGenerate, batchGenerate, batchHistoryPointDelete,
        getBatchHistoryPointMap, batchHistoryWinHideEvents, getModuleName, getSelectedPointList,
        getBatchHistorySelectedPointInfoList, changeRouteToPointName, dateTimeCheck, getFirstDay,projectCheckDataSync;

    storage = window.localStorage;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $sheet: $container.find('.sheet'),
            $isDelPointWin: $container.find('#isDelPointWin'),
            $isUpdatePointWin: $container.find('#isUpdatePointWin'),
            $point_add_btn: $container.find('#point_add'),
            $point_delete_btn: $container.find('#point_delete'),
            $point_clear_btn: $container.find('#point_clear'),
            $point_refresh_btn: $container.find('#point_refresh'),
            $point_undo_btn: $container.find('#point_undo'),
            $point_redo_btn: $container.find('#point_redo'),
            $point_prev_btn: $container.find('#point_prev'),
            $point_next_btn: $container.find('#point_next'),
            $deleteRowConfirm: $container.find('#deleteRowConfirm'),
            $point_search_replace_btn: $container.find('#point_search_replace'),
            $point_export: $container.find('#point_export'),
            $select_project: $container.find('#select_project'),
            $text_search: $container.find('#text_search'),
            $uploadInput: $container.find('#uploadInput'),
            $delete_point_list: $container.find('.delete-points'),
            $count: $container.find('.count'),
            $paginationWrapper: $container.find('#paginationWrapper'),
            $cloudPagination: $container.find('#cloudPagination'),
            $editPointWin: $container.find('#editPointWin'),
            $editPointConfirm: $container.find('#editPointConfirm'),
            $pointForm: $container.find('#pointForm'),
            $basicPointType: $container.find('#basicPointType'),
            $point_edit: $container.find('#point_edit'),
            $point_id: $container.find('#point_id'),
            $point_name: $container.find('#point_name'),
            $pt_batchModal: $container.find('#pt_batchModal'),
            $point_notes: $container.find('#point_notes'),
            $point_notes_en: $container.find('#point_notes_en'),
            $point_device: $container.find('#point_equipment'),
            $point_system: $container.find('#point_system'),
            $point_type: $container.find('#point_type'),
            $editTitle: $container.find('#editTitle'),
            $datePickBox: $container.find('#datePickBox'),
            $point_format: $container.find('#point_format'),
            $online_test: $container.find('#online_test'),
            $history_generate: $container.find('#history_generate'),
            $import_from_template: $container.find('#import_from_template'),
            $save_as_template: $container.find('#save_as_template'),
            $help: $container.find('#help'),
            $online_test_result: $container.find('#online_test_result'),
            $onlineTestReturnInfo: $container.find('#onlineTestReturnInfo'),
            $dateTimeStart: $container.find('#dateTimeStart'),
            $dateTimeEnd: $container.find('#dateTimeEnd'),
            $statusBox: $container.find('#statusBox'),
            $quickGenerateBox: $container.find('#quickGenerateBox'),
            $infoGenerate: $container.find('#infoGenerate'),
            $get_insert_info: $container.find('#get_insert_info'),
            $insert_info_result_box: $container.find('#insert_info_result_box'),
            $display_type: $container.find('#display_type'),
            $pointConvert: $("#point_convert"),
            $isConvertPointWin: $('#isConvertPointWin'),
            $convertConfirm: $('#convertConfirm'),
            $templateImportWinBox: $container.find('#templateImportWinBox'),
            $saveAsTemplateWinBox: $container.find('#saveAsTemplateWinBox'),
            $buttonGroup: $container.find('#buttonGroup'),
            $insert_result_wrapper: $container.find('.insert_result_wrapper'),
            $cloudPointEditMessage: $container.find('#cloudPointEditMessage'),
            $batch_history: $container.find('#batch_history'),
            $batchHistoryWin: $container.find('#batchHistoryWin'),
            $batchHistoryTimeStart: $container.find('#batchHistoryTimeStart'),
            $batchHistoryTimeEnd: $container.find('#batchHistoryTimeEnd'),
            $batchHistoryPointValue: $container.find('#batchHistoryPointValue'),
            $batchHistoryPointValueAdd: $container.find('#batchHistoryPointValueAdd'),
            $batchHistoryPointsUl: $container.find('#batchHistoryPointsUl'),
            $batchHistoryProgress: $container.find('#batchHistoryProgress'),
            $batchHistoryGenerate: $container.find('#batchHistoryGenerate'),
            $isBatch: $container.find('#isBatch'),
            $point_progress_box: $container.find('#point_progress_box'),
            $history_generate_delete: $container.find('#history_generate_delete')
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
        $.ajax({
            url: "/getExpertContainerUrl",
            type: "GET"
        }).done(function (result) {
            if (result) {
                stateMap.ExpertContainerUrl = result.data;
            }
        });
        loadPointTable(page);
        stateMap.currentPage = parseInt(page);
    };

    //---------DOM操作------
    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.page_size);
        jqueryMap.$paginationWrapper.empty().html('<ul id="cloudPagination" class="pagination"></ul>');
        while (totalPages < stateMap.currentPage && stateMap.currentPage > 1) {
            stateMap.currentPage = stateMap.currentPage - 1;
        }
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: stateMap.currentPage ? parseInt(stateMap.currentPage) : 1,
            totalPages: !totalPages ? 1 : parseInt(totalPages),
            onPageClick: function (event, page) {
                location.hash = "#cloud/" + page;
            }
        };
        stateMap.pagination = $("#cloudPagination").twbsPagination(pageOption);
    };

    //---------方法---------

    isCalcPoint = function () {

    };

    autoSave = function () {
        setInterval(function () {
            if (stateMap.changedList && stateMap.changedList.length) {
                jqueryMap.$cloudPointEditMessage.show();
                WebAPI.post('/point_tool/autoSave/' + stateMap.project_id + '/', stateMap.changedList).done(function (result) {
                    if (result.success) {
                        stateMap.changedList = [];
                        setTimeout(function () {
                            jqueryMap.$cloudPointEditMessage.hide();
                        }, 1000);
                    }
                })
            }
        }, 1000)
    };

    deleteRows = function () { //删除一行或多行
        spinner.spin(document.body);
        $.post('/point_tool/deleteCloudPoint/' + stateMap.project_id + '/', {point_list: stateMap.delete_points}).done(function (result) {
            if (result.success) {
                jqueryMap.$isDelPointWin.modal('hide');
                jqueryMap.$delete_point_list.empty();
                stateMap.delete_list = [];
                stateMap.sheetInstance = null;
                loadPointTable(stateMap.currentPage);
            } else {
                alert(I18n.resource.debugTools.info.DELETE_FAILED + ':' + result.msg);
            }
        }).always(function () {
            spinner.stop();
        });
    };

    destroy = function () {
        stateMap.pointId = '';
        stateMap.moduleName = '';
        stateMap.onlineTestType = configMap.isWriteToRealTimeDb.WRITE;
        stateMap.historyInfoList = [];
        if (stateMap.sheetInstance) {
            stateMap.sheetInstance.destroy();
            stateMap.sheetInstance = null;
        }
        if (stateMap.editor) {
            stateMap.editor = null;
        }
        if (stateMap.datePickerInstanceStart) {
            stateMap.datePickerInstanceStart = null;
            stateMap.datePickerInstanceEnd = null;
        }
    };

    renderSheet = function (data) {
        if (!data) {
            alert(I18n.resource.debugTools.info.DATA_IS_EMPTY);
            return false;
        }

        if (stateMap.sheetInstance) {
            stateMap.sheetInstance.loadData(data);
        } else {
            stateMap.sheetInstance = new Handsontable(jqueryMap.$sheet.get(0), {
                data: data,
                colHeaders: stateMap.sheetHeaders,
                rowHeaders: true,
                manualColumnResize: true,
                manualRowResize: true,
                stretchH: 'all',
                persistentState: true,
                autoWrapCol: true,
                autoWrapRow: true,
                search: true,
                minSpareRows: 0,
                minSpareCols: 0,
                outsideClickDeselects: false,
                afterRender: function (isForced) {
                    if (isForced) {
                        jqueryMap.$count.text(stateMap.pointTotal);
                    }
                },
                beforeValidate: function (value, row, prop, source) {
                    if (stateMap.sheetData[row].value === value) {//防止和自身的值比较
                        return false;
                    } else {
                        return value;
                    }
                },
                afterChange: function (changes, source) {
                    if (source === 'loadData') {
                        return false;
                    }
                    for (var m = 0; m < changes.length; m++) {
                        var row = changes[m][0];
                        if (stateMap.sheetInstance.getData()[row].value) {
                            stateMap.changedList.push(stateMap.sheetInstance.getData()[row]);
                        }
                    }
                },
                currentRowClassName: 'currentRow',
                columns: [
                    {
                        data: "value",
                        type: 'text',
                        readOnly: true
                    },
                    {
                        data: "params.remark",
                        type: 'text',
                        width: "200px"
                    },
                    {
                        data: "params.remark_en",
                        type: 'text',
                        width: "200px"
                    },
                    {
                        data: "modify_by",
                        type: 'text',
                        width: "100px",
                        readOnly: true
                    },
                    {
                        data: "modify_time",
                        type: 'text',
                        readOnly: true
                    }
                ]
            });
        }

        stateMap.sheetData = stateMap.sheetInstance.getData();
        jqueryMap.$sheet.off("click").on('click', "tbody td", getPointIndex);
    };
    //---------事件---------

    onIsConvertToCloud = function () {
        spinner.spin(jqueryMap.$isConvertPointWin.find('.modal-content').get(0));
        WebAPI.post('/point_tool/convertToCloud', {
            projectId: stateMap.project_id,
            type: jqueryMap.$isConvertPointWin.find('input[name=convertType]:checked').val()
        }).done(function (result) {
            if (result.success) {
                jqueryMap.$isConvertPointWin.modal('hide');
                onLoadSheet();
                alert(i18n_info.CONVERT_POINT_SUCCESS.format(result.data))
            } else {
                alert(i18n_info.CONVERT_POINT_FAILED);
            }
        }).always(function () {
            spinner.stop();
        })
    };

    onConvertToCloud = function () {
        jqueryMap.$isConvertPointWin.modal();
    };

    loadPointTable = function (page) {// 加载点表
        var initPointTable = function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            jqueryMap.$point_add_btn.on('click', onNewPoint);
            jqueryMap.$point_delete_btn.on('click', onDeletePoint);
            jqueryMap.$point_clear_btn.click(onClearPoint);
            jqueryMap.$point_refresh_btn.click(onRefreshCloudPoint);
            jqueryMap.$point_undo_btn.on('click', onUndoPoint);
            jqueryMap.$point_redo_btn.on('click', onRedoPoint);
            jqueryMap.$text_search.on('keydown', onSearchTextKeyDown);
            jqueryMap.$deleteRowConfirm.on('click', deleteRows);
            jqueryMap.$editPointConfirm.on('click', onEditPointConfirm);
            jqueryMap.$uploadInput.change(importSheet);
            jqueryMap.$select_project.change(onChangeProject);
            jqueryMap.$point_edit.on('click', onEditPoint);
            jqueryMap.$basicPointType.change(onChangePointType);
            jqueryMap.$editPointWin.off('hide.bs.modal').on('hide.bs.modal', winHideEvents).off('shown.bs.modal').on('shown.bs.modal', winShowEvents);
            jqueryMap.$display_type.on('click', '.point_type', onPointTypeSelected);
            jqueryMap.$container.off('click.online_test').on('click.online_test', '#online_test', online_test);
            jqueryMap.$container.off('click.get_insert_info').on('click.get_insert_info', '#get_insert_info', get_insert_info);
            jqueryMap.$container.off('click.history_generate').on('click.history_generate', '#history_generate', history_generate);
            jqueryMap.$container.off('click.import_from_template').on('click.import_from_template', '#import_from_template', import_from_template);
            jqueryMap.$container.off('click.save_as_template').on('click.save_as_template', '#save_as_template', save_as_template);
            jqueryMap.$container.off('click.help').on('click.help', '#help', help);
            jqueryMap.$container.off('click.single_quick_generate_data').on('click.single_quick_generate_data', '.single_quick_generate_data', single_quick_generate_data);
            jqueryMap.$container.off('click.batch_history_quick_generate_data').on('click.batch_history_quick_generate_data', '.batch_history_quick_generate_data', batch_history_quick_generate_data);
            jqueryMap.$container.off('click.history_generate_delete').on('click.history_generate_delete', '#history_generate_delete', history_generate_delete);
            jqueryMap.$container.off('click.batch_history').on('click.batch_history', '#batch_history', batch_history_win);
            jqueryMap.$container.off('click.batchHistoryPointValueAdd').on('click.batchHistoryPointValueAdd', '#batchHistoryPointValueAdd', batchHistoryPointValueAdd);
            jqueryMap.$container.off('click.batchHistoryGenerate').on('click.batchHistoryGenerate', '#batchHistoryGenerate', batchHistoryGenerate);
            jqueryMap.$container.off('click.batchHistoryPointDelete').on('click.batchHistoryPointDelete', '.batchHistoryPointDelete', batchHistoryPointDelete);
            jqueryMap.$batchHistoryWin.off('hide.bs.modal').on('hide.bs.modal', batchHistoryWinHideEvents);
            jqueryMap.$pointConvert.click(onConvertToCloud);
            jqueryMap.$convertConfirm.click(onIsConvertToCloud);
            jqueryMap.$point_format.change(setDateFormat);

            var batchHistoryFormatMap = { // 批量历史添加窗口绑定
                startView: 'month',
                autoclose: true,
                minView: 'day',
                format: 'yyyy-mm-dd hh:00:00'
            };

            jqueryMap.$batchHistoryTimeStart.datetimepicker(batchHistoryFormatMap);
            jqueryMap.$batchHistoryTimeEnd.datetimepicker(batchHistoryFormatMap);

            jqueryMap.$isBatch.change(setIsBatch);

            if (storage.getItem("current_project")) {
                var $option = jqueryMap.$select_project.find("option");
                var hasOptionFlag = false;
                for (var i = 0; i < $option.length; i++) {
                    if ($option.eq(i).val() == storage.getItem("current_project")) {
                        hasOptionFlag = true;
                        break;
                    }
                }
                if (hasOptionFlag) {
                    jqueryMap.$select_project.val(storage.getItem("current_project"));
                } else {
                    var firstVal = $option.eq(1).val();
                    jqueryMap.$select_project.val(firstVal);
                    storage.setItem("current_project", firstVal);
                }

                onLoadSheet(page);

                jqueryMap.$display_type.find('.point_type[value="' + stateMap.pointType + '"]').prop('checked', true);
                if (stateMap.pointType == configMap.cloudPointType.CALC_POINT) {
                    jqueryMap.$batch_history.removeClass('dn');
                } else {
                    jqueryMap.$batch_history.addClass('dn');
                }
            }
        };
        $.get(configMap.htmlURL).done(function (result) {
            initPointTable(result);
            I18n.fillArea(stateMap.$container);
            autoSave();
        });
    };

    getFirstDay = function (dateType) {
        var date = new Date();
        if (dateType === 'today') {
            return date.format('yyyy-MM-dd 00:00:00');
        } else if (dateType === 'week') {
            return new Date(date - (date.getDay() - 1) * 86400000).format('yyyy-MM-dd 00:00:00');
        } else if (dateType === 'month') {
            return new Date(date.getFullYear(), date.getMonth(), 1).format('yyyy-MM-dd 00:00:00');
        }
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

    batch_history_win = function () {
        stateMap.batchHistorySelectedPointFormatList = [];
        stateMap.batchHistorySelectedPointIdList = [];
        stateMap.batchHistorySelectedPointModuleNameList = [];
        stateMap.batchHistorySelectedPointValueList = [];
        stateMap.batchHistorySelectedPointLogicList = [];
        stateMap.batchHistoryPointMap = {};
        jqueryMap.$batchHistoryWin.modal({
            keyboard: false,
            backdrop: 'static'
        });
        jqueryMap.$batchHistoryTimeStart.val(new Date().format('yyyy-MM-dd 00:00:00'));
        jqueryMap.$batchHistoryTimeEnd.val(new Date().format('yyyy-MM-dd HH:00:00'));
        jqueryMap.$batchHistoryPointValue.val('');
        jqueryMap.$batchHistoryPointsUl.empty();
        jqueryMap.$batchHistoryProgress.empty().removeClass('progress').html('<span  i18n="debugTools.sitePoint.NO_PROGRESS"></span>');

        getSelectedPointList();
        getBatchHistorySelectedPointInfoList();
        stateMap.selectedPointList.length && refreshBatchHistoryUl();
        getBatchHistoryPointMap();
        I18n.fillArea(stateMap.$container);
    };

    batchHistoryPointValueAdd = function () {
        var val = jqueryMap.$batchHistoryPointValue.val().trim();
        if (val) {
            if (($.inArray(val, stateMap.batchHistorySelectedPointValueList) !== -1)) {
                alert(I18n.resource.debugTools.sitePoint.THIS_POINT_HAS_BEEN_ADDED_TO_THE_LIST_BELOW);
            } else {
                var index = $.inArray(val, stateMap.batchHistoryPointMap.valueList);
                if (index === -1) {
                    alert(I18n.resource.debugTools.sitePoint.ONLY_EXISTING_CALCULATION_POINTS_ARE_ALLOWED);
                } else {
                    stateMap.batchHistorySelectedPointValueList.push(val);
                    stateMap.batchHistorySelectedPointModuleNameList.push(stateMap.batchHistoryPointMap.moduleNameList[index]);
                    stateMap.batchHistorySelectedPointFormatList.push(stateMap.batchHistoryPointMap.formatList[index]);
                    stateMap.batchHistorySelectedPointIdList.push(stateMap.batchHistoryPointMap.idList[index]);
                    stateMap.batchHistorySelectedPointLogicList.push(stateMap.batchHistoryPointMap.logicList[index]);
                    refreshBatchHistoryUl();
                }
            }
        } else {
            alert(I18n.resource.debugTools.sitePoint.POINT_VALUE_CAN_NOT_BE_EMPTY);
        }
    };

    batchHistoryPointDelete = function () {
        var val = $(this).closest('.batchHistoryPoint').find('.batchHistoryPointName').val();
        for (var i = 0; i < stateMap.batchHistorySelectedPointValueList.length; i++) {
            if (val == stateMap.batchHistorySelectedPointValueList[i]) {
                stateMap.batchHistorySelectedPointValueList.splice(i, 1);
                stateMap.batchHistorySelectedPointModuleNameList.splice(i, 1);
                stateMap.batchHistorySelectedPointFormatList.splice(i, 1);
                stateMap.batchHistorySelectedPointIdList.splice(i, 1);
                stateMap.batchHistorySelectedPointLogicList.splice(i, 1);
                break;
            }
        }
        refreshBatchHistoryUl();
    };

    batch_history_quick_generate_data = function (e) {
        batchGenerate(getFirstDay($(e.target).attr('dateType')), new Date().format('yyyy-MM-dd HH:00:00'));
    };

    batchHistoryGenerate = function () {
        var timeFrom = jqueryMap.$batchHistoryTimeStart.val().trim(),
            timeTo = jqueryMap.$batchHistoryTimeEnd.val().trim();

        if (dateTimeCheck(timeFrom, timeTo)) {
            if (!stateMap.batchHistorySelectedPointValueList.length) {
                alert(I18n.resource.debugTools.sitePoint.NO_POINT_PLEASE_ADD);
                return;
            }
            batchGenerate(timeFrom, timeTo);
        }
    };

    batchGenerate = function (timeFrom, timeTo) {
        spinner.spin(document.body);
        $.ajax({
            url: stateMap.ExpertContainerUrl + "repairData/batch",
            type: "POST",
            data: {
                'list': JSON.stringify(stateMap.batchHistorySelectedPointValueList),
                'timeFrom': timeFrom,
                'timeTo': timeTo,
                'projId': stateMap.project_id,
                'format': 'm5'
            }
        }).done(function (result) {
            if (result) {
                stateMap.batchHistoryTimer && clearInterval(stateMap.batchHistoryTimer);
                stateMap.batchHistoryTimer = setInterval(function () {
                    $.ajax({
                        url: stateMap.ExpertContainerUrl + "repairData/getInfo/" + result,
                        type: "GET"
                    }).done(function (result) {
                        try {
                            if (result !== null) {
                                jqueryMap.$batchHistoryProgress.addClass('progress');
                                jqueryMap.$batchHistoryProgress.empty().html(beopTmpl('tpl_point_progress', {
                                    'percent': parseInt(result)
                                }));
                                if (parseInt(result) == '100') {
                                    stateMap.batchHistoryTimer && clearInterval(stateMap.batchHistoryTimer);
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }).fail(function (e) {
                        stateMap.batchHistoryTimer && clearInterval(stateMap.batchHistoryTimer);
                        //serverRequestError(e);
                    });
                }, 1000);
            }
        }).fail(function (e) {
            console.log(e);
        }).always(function () {
            spinner.stop();
        });
    };

    changeRouteToPointName = function (routeName) { // 将路径转为文件名
        return /calcpoint_\w+$/.exec(routeName);
    };

    refreshPointProgress = function (percent) {
        jqueryMap.$point_progress_box.empty().addClass('progress').append(beopTmpl('tpl_point_progress', {
            'percent': parseInt(percent)
        }));
    };

    refreshBatchHistoryUl = function () {
        jqueryMap.$batchHistoryPointsUl.empty().html(beopTmpl('tpl_batch_history_add_point', {
            'valueList': stateMap.batchHistorySelectedPointValueList
        }));
    };

    setIsBatch = function () {
        stateMap.isBatch = jqueryMap.$isBatch.is(":checked");
        if (stateMap.isBatch) {
            jqueryMap.$editPointWin.addClass('batch');
        } else {
            jqueryMap.$editPointWin.removeClass('batch');
        }
    };

    getPointsHandler = function () {
        var pointName = jqueryMap.$point_name.val().trim(),
            batchModel = jqueryMap.$pt_batchModal.val(),
            remark = jqueryMap.$point_notes.val().trim(),
            remark_en = jqueryMap.$point_notes_en.val().trim(),
            model = {},
            pointContent = stateMap.editor.doc.getValue().trim(),
            ret = [];
        if (!stateMap.isBatch) {
            ret.push({name: pointName, content: pointContent, remark: remark, remark_en: remark_en});
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
        var handler = function (pointName, content, remark, remark_en, replaceModel) {
            for (var replaceItem in replaceModel) {
                if (!replaceModel.hasOwnProperty(replaceItem)) {
                    continue;
                }
                var regex = new RegExp('<#' + replaceItem + '#>', 'gi');
                pointName = pointName.replace(regex, replaceModel[replaceItem]);
                content = content.replace(regex, replaceModel[replaceItem]);
                remark = remark.replace(regex, replaceModel[replaceItem]);
                remark_en = remark_en.replace(regex, replaceModel[replaceItem]);
            }
            return {name: pointName, content: content, remark: remark, remark_en: remark_en};
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
            ret.push(handler(pointName, pointContent, remark, remark_en, replaceModel));
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
                format: 'yyyy-mm-dd'
            };
        } else if (val == 'h1') {
            stateMap.dateFormat = {
                startView: 'month',
                autoclose: true,
                minView: 'day',
                format: 'yyyy-mm-dd hh:00:00'
            };
        } else {
            stateMap.dateFormat = {
                startView: 'month',
                autoclose: true,
                minView: 'hour',
                format: 'yyyy-mm-dd hh:ii:00'
            };
        }
        refreshDatePick();
    };

    online_test = function () { // 点击在线测试按钮
        stateMap.onlineTestType = configMap.isWriteToRealTimeDb.NOT_WRITE;
        jqueryMap.$online_test.addClass('disabled');
        var newPoints = getPointsHandler();
        var testPromises = [];
        for (var m = 0, len = newPoints.length; m < len; m++) {
            var point = newPoints[m];
            testPromises.push(online_test_request(stateMap.project_id, point.content, point.name));
        }
        var resultText = '';
        var testResultHandler = function (pointName, resultDict) {
            if (!resultDict) {
                resultDict = {}
            }
            if (resultDict.error == '0') {
                jqueryMap.$onlineTestReturnInfo.text(I18n.resource.debugTools.sitePoint.POINT_VALUE_IS);
            } else {
                jqueryMap.$onlineTestReturnInfo.text(I18n.resource.debugTools.sitePoint.ERROR_INFORMATION);
            }
            var printDict = {};
            printDict.value = resultDict.value;
            if (resultDict.median) {
                printDict.median = resultDict.median;
            }
            resultText = JSON.stringify(printDict, null, 2);
            jqueryMap.$online_test_result.html(resultText);
        };
        $.when.apply(null, testPromises).done(function () {
            if (testPromises.length == 1) {
                testResultHandler(newPoints[0].name, arguments[0]);
                return;
            }
            for (var n = 0, len = arguments.length; n < len; n++) {
                if (!newPoints[n]) {
                    continue;
                }
                testResultHandler(newPoints[n].name, arguments[n][0]);
            }
        }).done(function () {
            spinner.stop();
        }).always(function () {
            jqueryMap.$online_test.removeClass('disabled');
        });
    };

    onClearPoint = function () {
        confirm(I18n.resource.debugTools.sitePoint.CONFIRM_TO_CLEAR_ALL_POINTS, function () {
            WebAPI.post('/point_tool/clearCloudPoints/', {
                projectId: stateMap.project_id,
                flag: stateMap.pointType
            }).done(function (result) {
                if (result) {
                    onLoadSheet();
                }
            })
        })
    };

    online_test_request = function (projectId, content, pointName, moduleName, onlineTestType) { // 在线测试请求
        spinner.spin(document.body);
        if (typeof projectId === typeof undefined) {
            projectId = stateMap.project_id;
        }
        if (typeof content === typeof undefined) {
            content = stateMap.editor && stateMap.editor.doc && stateMap.editor.doc.getValue();
        }
        if (typeof pointName === typeof undefined) {
            pointName = jqueryMap.$point_name.val();
        }
        if (typeof moduleName === typeof undefined) {
            moduleName = getModuleName(pointName);
        }
        if (typeof onlineTestType === typeof undefined) {
            onlineTestType = configMap.isWriteToRealTimeDb.NOT_WRITE;
        }

        return $.ajax({
            url: stateMap.ExpertContainerUrl + "cloudPoint/onlinetest",
            type: "POST",
            data: {
                'content': content,
                'projId': projectId,
                'pointName': pointName,
                'moduleName': moduleName,
                'writeToReal': onlineTestType
            }
        }).done(function (result) {
            if (result.error == '1') {
                alert(I18n.resource.debugTools.sitePoint.ERROR_MSG + result.value);
            }
        }).fail(function (e) {
            jqueryMap.$onlineTestReturnInfo.text(I18n.resource.debugTools.sitePoint.SERVER_REQUEST_FAILED);
            serverRequestError(e);
            spinner.stop();
        }).always(function () {
            jqueryMap.$online_test.removeClass('disabled');
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

    requestRepairData = function (value, timeFrom, timeTo) { // 请求repairData
        $.ajax({
            url: stateMap.ExpertContainerUrl + "repairData" + '/batch',
            type: "POST",
            data: {
                'list': JSON.stringify([value]),
                'timeFrom': requestTimeHandler(timeFrom, stateMap.pointFormat),
                'timeTo': requestTimeHandler(timeTo, stateMap.pointFormat),
                'projId': stateMap.project_id,
                'format': stateMap.pointFormat
            }
        }).done(function (result) {
            if (result.length == 24) {
                localStorage.setItem(stateMap.project_id + '_' + value, result);
                refreshRepairStatus('adding');
                stateMap.historyTimer = setInterval(function () {
                    $.ajax({
                        url: stateMap.ExpertContainerUrl + "repairData/getInfo/" + result,
                        type: "GET"
                    }).done(function (result) {// 100% 表示补数完成，
                        try {
                            if (parseInt(result) == '100') {
                                localStorage.removeItem(stateMap.project_id + '_' + value);
                                stateMap.historyTimer && clearInterval(stateMap.historyTimer);
                                refreshRepairStatus('finish');
                                //if (stateMap.generateType !== 'history') {
                                //get_insert_info();
                                //}
                            } else {
                                refreshRepairStatus('adding');
                            }
                            refreshPointProgress(parseInt(result));
                            //stateMap.historyInfoList = result.info;
                        } catch (e) {
                            console.log(e);
                        }
                    }).fail(function (e) {
                        stateMap.historyTimer && clearInterval(stateMap.historyTimer);
                        serverRequestError(e);
                    }).always(function () {

                    });
                }, 3000)
            }
        }).fail(function (e) {
            serverRequestError(e);
        }).always(function () {

        });
    };

    serverRequestError = function (mes) {
        console.log(mes);
        alert(I18n.resource.debugTools.sitePoint.SERVER_REQUEST_FAILED);
    };

    single_generate = function (timeFrom, timeTo, generateType) {
        stateMap.onlineTestType = configMap.isWriteToRealTimeDb.WRITE;
        jqueryMap.$insert_info_result_box.empty();
        online_test_request().done(function (resultDict) {
            if (resultDict.error == '0') {
                var url = stateMap.operateType == configMap.operateType.NEW ? '/point_tool/addCloudPoint/' : '/point_tool/editCloudPoint/';
                var pointModel = jqueryMap.$pointForm.serializeObject();
                var id = stateMap.pointId ? stateMap.pointId : stateMap.sheetData[stateMap.currentPointIndex]._id;
                $.extend(pointModel, {
                    'id': id,
                    'logic': stateMap.editor.doc.getValue(),
                    'moduleName': getModuleName(jqueryMap.$point_name.val()),
                    'format': jqueryMap.$point_format.val()
                });
                $.post(url + stateMap.project_id + '/', pointModel).done(function (result) {
                    if (result.success && result.data) {
                        stateMap.operateType = configMap.operateType.EDIT;
                        jqueryMap.$history_generate.addClass('disabled');
                        jqueryMap.$quickGenerateBox.addClass('disabled');
                        stateMap.pointId = result.data._id;
                        stateMap.generateType = generateType;
                        stateMap.moduleName = result.data.params.moduleName;
                        requestRepairData(result.data.value, timeFrom, timeTo);
                    } else {
                        alert(result.msg);
                    }
                }).always(function () {
                    spinner.stop();
                });
            } else {
                alert(I18n.resource.debugTools.sitePoint.ONLINE_TEST_ERROR);
                spinner.stop();
            }
        });
    };

    single_quick_generate_data = function (e) { // 单个点快捷生成
        single_generate(getFirstDay($(e.target).attr('dateType')), new Date().format('yyyy-MM-dd HH:00:00'), 'quick');
    };

    getModuleName = function (str) {
        return 'calcpoint_' + stateMap.project_id + '_' + str;
    };

    history_generate = function () { // 历史生成
        var timeFrom = jqueryMap.$dateTimeStart.val().trim(),
            timeTo = jqueryMap.$dateTimeEnd.val().trim();

        var timeCheckFlag = dateTimeCheck(timeFrom, timeTo);
        if (!timeCheckFlag) {
            return;
        }

        if (jqueryMap.$point_format.val() == 'd1') {
            timeFrom += ' 00:00:00';
            timeTo += ' 00:00:00';
        }
        single_generate(timeFrom, timeTo, 'history');
    };

    history_generate_delete = function () { // 删除历史生成
        if (localStorage.getItem(stateMap.project_id + '_' + jqueryMap.$point_name.val())) {
            spinner.spin(document.body);
            $.ajax({
                url: stateMap.ExpertContainerUrl + "repairData/stop/" + localStorage.getItem(stateMap.project_id + '_' + jqueryMap.$point_name.val()),
                type: "GET"
            }).done(function (result) {
                if (result.error) {
                    alert(I18n.resource.debugTools.sitePoint.STOP_HISTORY_GENERATION_SUCCESS);
                } else {
                    localStorage.removeItem(stateMap.project_id + '_' + jqueryMap.$point_name.val());
                    stateMap.historyTimer && clearInterval(stateMap.historyTimer);
                    stateMap.historyWinTimer && clearInterval(stateMap.historyWinTimer);
                    jqueryMap.$history_generate_delete.hide();
                    refreshRepairStatus();
                    jqueryMap.$point_progress_box.empty().removeClass('progress');
                    jqueryMap.$infoGenerate.text('');
                    alert(I18n.resource.debugTools.sitePoint.STOP_HISTORY_GENERATION_FAILED);
                }
            }).fail(function (e) {
                stateMap.historyTimer && clearInterval(stateMap.historyTimer);
                serverRequestError(e);
            }).always(function () {
                spinner.stop();
            });
        }
    };

    get_insert_info = function () {
        if (stateMap.historyInfoList.length) {
            jqueryMap.$insert_info_result_box.empty().append(beopTmpl('tpl_insert_info', {
                'lists': stateMap.historyInfoList
            }));
        } else {
            alert(I18n.resource.debugTools.sitePoint.NO_INSERT_DATA);
        }
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
        window.open("help.html", "BeOP help");
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

    onDeletePoint = function () {
        stateMap.delete_list = [];
        jqueryMap.$delete_point_list.empty();

        var data = stateMap.sheetInstance.getData();
        var delete_list = [], delete_points = [];
        var selection = stateMap.sheetInstance.getSelected();
        if (!selection) {
            alert(I18n.resource.debugTools.info.CHOOSE_DELETE_POINTS);
            return false;
        }
        var startIndex, endIndex;
        if (selection[0] <= selection[2]) {
            startIndex = selection[0];
            endIndex = selection[2];
        } else {
            startIndex = selection[2];
            endIndex = selection[0];
        }
        for (var start = startIndex, end = endIndex + 1; start < end; start++) {
            delete_list.push({
                index: start,
                data: data[start]
            });
            delete_points.push(data[start].value);
        }

        jqueryMap.$isDelPointWin.modal();
        jqueryMap.$delete_point_list.append(beopTmpl('tpl_point_list', {list: delete_list}));
        stateMap.delete_list = delete_list;
        stateMap.delete_points = delete_points;
    };

    onUndoPoint = function () {
        stateMap.sheetInstance.undo();
    };

    onRedoPoint = function () {
        stateMap.sheetInstance.redo();
    };

    onSearchTextKeyDown = function (e) {
        if (e.keyCode === 13) {
            onLoadSheet();
        }
    };

    getPointIndex = function () {
        stateMap.currentPointIndex = stateMap.sheetInstance.getSelected() ? stateMap.sheetInstance.getSelected()[0] : 0;
    };

    onChangeProject = function () {
        jqueryMap.$text_search.val('');
        onLoadSheet();
    };

    onChangePointType = function () {
        if ($(this).val() == configMap.cloudPointType.CALC_POINT) { // 计算点
            jqueryMap.$editPointWin.addClass('calc');
            refreshEditor();
            jqueryMap.$codeMirrorBox.show();
            if (stateMap.operateType === configMap.operateType.NEW) {
                jqueryMap.$point_format.val('m5');
                stateMap.pointFormat = 'm5';
            }
            refreshModuleStatusShow();
        } else {
            jqueryMap.$editPointWin.removeClass('calc');
            stateMap.editor = null;
            jqueryMap.$codeMirrorBox.empty().hide();
        }
        I18n.fillArea(jqueryMap.$editPointWin);
    };

    batchHistoryWinHideEvents = function () { // 编辑，新建窗口隐藏事件;
        stateMap.batchHistoryTimer && clearInterval(stateMap.batchHistoryTimer);
    };


    winHideEvents = function () { // 编辑，新建窗口隐藏事件
        stateMap.historyWinTimer && clearInterval(stateMap.historyWinTimer);
        stateMap.historyTimer && clearInterval(stateMap.historyTimer);
    };

    winShowEvents = function () { // 编辑，新建窗口Show事件
        if (stateMap.editor && stateMap.editor.refresh) {
            stateMap.editor.refresh();
        }
    };

    refreshEditor = function () {
        stateMap.editor = null;
        jqueryMap.$codeMirrorBox.empty().append(beopTmpl('tpl_point_related_fun'));
        if (stateMap.transmitLogic) { // 从模板中传递的值
            if (stateMap.currentEditorText == '') {
                stateMap.currentEditorText += stateMap.transmitLogic;
            } else {
                stateMap.currentEditorText += ('\n\n ' + stateMap.transmitLogic);
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
                    return {
                        list: configMap.autoCompleteList.filter(function (item) {
                            return item.startsWith(curWord);
                        }),
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
                var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                cm.replaceSelection(spaces);
            },
            Ctrl: "autocomplete"
        });
        stateMap.editor.refresh();
    };

    onNewPoint = function () {
        stateMap.pointId = '';
        jqueryMap.$codeMirrorBox.empty().hide();
        jqueryMap.$point_name.val('');
        jqueryMap.$point_notes.val('');
        jqueryMap.$point_notes_en.val('');
        jqueryMap.$point_device.val('');
        jqueryMap.$point_system.val('');
        jqueryMap.$point_type.val('');
        jqueryMap.$basicPointType.val(0);
        stateMap.operateType = configMap.operateType.NEW;
        jqueryMap.$editTitle.text(i18n_point.ADD_POINTS);
        if (stateMap.editor) {
            stateMap.editor = null;
        }
        if (stateMap.pointType == configMap.cloudPointType.CALC_POINT) { // 计算点
            jqueryMap.$basicPointType.val(2);
            jqueryMap.$editPointWin.addClass('calc');
            refreshEditor();
            jqueryMap.$codeMirrorBox.show();
            if (stateMap.operateType === configMap.operateType.NEW) {
                jqueryMap.$point_format.val('m5');
                stateMap.pointFormat = 'm5';
            }
            refreshModuleStatusShow();
        } else {
            jqueryMap.$editPointWin.removeClass('calc');
            jqueryMap.$codeMirrorBox.empty().hide();
        }

        jqueryMap.$editPointWin.addClass('newPoint')
            .removeClass('batch')
            .modal({
                keyboard: false,
                backdrop: 'static'
            });
        jqueryMap.$isBatch.prop('checked', false);
        I18n.fillArea(jqueryMap.$editPointWin);
    };

    onEditPoint = function () {
        stateMap.editor = null;
        stateMap.isBatch = false;
        stateMap.operateType = configMap.operateType.EDIT;
        stateMap.pointId = '';
        jqueryMap.$codeMirrorBox.empty();

        jqueryMap.$editPointWin.removeClass('newPoint');
        jqueryMap.$editPointWin.modal({
            keyboard: false,
            backdrop: 'static'
        });

        var data = stateMap.sheetData[stateMap.currentPointIndex];
        if (data.params && data.params.flag == '2') {
            jqueryMap.$editPointWin.addClass('calc');
        }

        if (data.params.flag == configMap.cloudPointType.CALC_POINT) { // 计算点
            stateMap.moduleName = getModuleName(data.value);
            stateMap.currentEditorText = data.params.logic;
            jqueryMap.$point_format.val(data.params.format);
            jqueryMap.$basicPointType.val(data.params.flag);
            stateMap.pointFormat = data.params.format;
            refreshEditor();
            setDateFormat();
            if (localStorage.getItem(stateMap.project_id + '_' + data.value)) {
                stateMap.historyWinTimer = setInterval(function () {
                    $.ajax({
                        url: stateMap.ExpertContainerUrl + "repairData/getInfo/" + localStorage.getItem(stateMap.project_id + '_' + data.value),
                        type: "GET"
                    }).done(function (result) {
                        try {
                            if (result === null) {
                                localStorage.removeItem(stateMap.project_id + '_' + data.value);
                                stateMap.historyWinTimer && clearInterval(stateMap.historyWinTimer);
                            } else {
                                if (parseInt(result) == '100') {
                                    localStorage.removeItem(stateMap.project_id + '_' + data.value);
                                    stateMap.historyWinTimer && clearInterval(stateMap.historyWinTimer);
                                    refreshRepairStatus('finish');
                                    //if (stateMap.generateType !== 'history') {
                                    //get_insert_info();
                                    //}
                                } else {
                                    refreshRepairStatus('adding');
                                }
                                refreshPointProgress(parseInt(result));
                                //stateMap.historyInfoList = result.info;
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }).fail(function (e) {
                        stateMap.historyWinTimer && clearInterval(stateMap.historyWinTimer);
                        serverRequestError(e);
                    }).always(function () {

                    });
                }, 1000);
            } else {
                refreshModuleStatusShow();
            }
        } else {
            jqueryMap.$basicPointType.val(0);
            jqueryMap.$codeMirrorBox.empty().hide();
        }
        jqueryMap.$point_id.val(data._id);
        jqueryMap.$point_name.val(data.value);
        jqueryMap.$point_notes.val(data.params.remark);
        jqueryMap.$point_notes_en.val(data.params.remark_en);
        jqueryMap.$point_device.val(data.params.device);
        jqueryMap.$point_system.val(data.params.system);
        jqueryMap.$point_type.val(data.params.type);
        jqueryMap.$editTitle.text(i18n_point.EDIT_POINTS);
        I18n.fillArea(jqueryMap.$editPointWin);
    };

    onEditPointConfirm = function () {
        var url, pointModel = jqueryMap.$pointForm.serializeObject();
        stateMap.onlineTestType = configMap.isWriteToRealTimeDb.WRITE;
        if (jqueryMap.$basicPointType.val() == configMap.cloudPointType.CALC_POINT) { // 点类型为计算点时
            $.extend(pointModel, {
                'logic': stateMap.editor.doc.getValue(),
                'moduleName': getModuleName(jqueryMap.$point_name.val())
            });
        }

        if (stateMap.operateType === configMap.operateType.NEW) { // 添加点窗口
            url = '/point_tool/addCloudPoint/';
        } else { // 编辑点窗口
            url = '/point_tool/editCloudPoint/';
        }

        if (!pointModel.id) {
            pointModel.id = stateMap.pointId;
        }

        if (jqueryMap.$basicPointType.val() == configMap.cloudPointType.MAPPING_POINT) {
            spinner.spin(document.body);
            $.post(url + stateMap.project_id + '/', pointModel).done(function (result) {
                if (result.success) {
                    Alert.success(document.body, I18n.resource.debugTools.info.MODIFY_SUCCESS).showAtTop(2000);
                    stateMap.sheetInstance = null;
                    jqueryMap.$editPointWin.modal('hide');
                    loadPointTable(stateMap.currentPage);
                } else {
                    alert(I18n.resource.debugTools.info.MODIFY_FAILED + ':' + result.msg);
                }
            }).always(function () {
                spinner.stop();
            });
        } else {
            var points = getPointsHandler();
            var requestPromises = [];
            points.forEach(function (point) {
                pointModel['remark'] = point['remark'];
                pointModel['remark_en'] = point['remark_en'];
                $.extend(point, pointModel);
                point['logic'] = point['content'];
                point['moduleName'] = getModuleName(point['name']);
                point['value'] = point['name'];

                delete point['name'];
                delete point['content'];

                var one_point_request = online_test_request(stateMap.project_id, point['logic'], point['value'], point['moduleName']).then(function (resultDict) {
                    if (resultDict.error == '0') {
                        return $.post(url + stateMap.project_id + '/', point).then(function (result) {
                            if (result.success) {
                                stateMap.pointId = result.data._id;
                            } else {
                                alert(I18n.resource.debugTools.info.MODIFY_FAILED + ':' + result.msg);
                            }
                        }).always(function () {
                            spinner.stop();
                        });
                    } else {
                        alert(I18n.resource.debugTools.sitePoint.ONLINE_TEST_ERROR);
                        spinner.stop();
                    }
                });
                requestPromises.push(one_point_request);
            });

            $.when.apply(null, requestPromises).done(function () {
                Alert.success(document.body, I18n.resource.debugTools.info.MODIFY_SUCCESS).showAtTop(2000);
                stateMap.sheetInstance = null;
                jqueryMap.$editPointWin.modal('hide');
                loadPointTable(stateMap.currentPage);
            });
        }

        return false;
    };

    getBatchHistorySelectedPointInfoList = function () {
        for (var i = 0; i < stateMap.selectedPointList.length; i++) {
            var selectedPoint = stateMap.selectedPointList[i];
            stateMap.batchHistorySelectedPointValueList.push(selectedPoint.value);
            stateMap.batchHistorySelectedPointModuleNameList.push(selectedPoint.params.moduleName);
            stateMap.batchHistorySelectedPointFormatList.push(selectedPoint.params.format);
            stateMap.batchHistorySelectedPointIdList.push(selectedPoint._id);
            stateMap.batchHistorySelectedPointLogicList.push(selectedPoint.params.logic);
        }
    };

    getSelectedPointList = function () {
        stateMap.selectedPointList = [];
        var data = stateMap.sheetInstance.getData(),
            selection = stateMap.sheetInstance.getSelected();
        if (selection) {
            var startIndex, endIndex;
            if (selection[0] <= selection[2]) { // 进行正选，反选判断
                startIndex = selection[0];
                endIndex = selection[2];
            } else {
                startIndex = selection[2];
                endIndex = selection[0];
            }
            for (var start = startIndex, end = endIndex + 1; start < end; start++) {
                stateMap.selectedPointList.push(data[start]);
            }
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

    refreshModuleStatusShow = function () { // 根据模块状态进行界面显示
        refreshRepairStatus();
        setJqueryMap();
        setDateFormat();
    };

    refreshRepairStatus = function (status) {
        if (status == 'adding') {
            jqueryMap.$infoGenerate.text(I18n.resource.debugTools.sitePoint.MENDING_DATA);
            if (stateMap.generateType === 'quick') {
                jqueryMap.$history_generate.hide();
            } else {
                jqueryMap.$quickGenerateBox.hide();
            }
            jqueryMap.$history_generate_delete.show();
        } else {
            if (status == 'finish') {
                jqueryMap.$infoGenerate.text(I18n.resource.debugTools.sitePoint.COMPLEMENT_HAS_BEEN_COMPLETED);
                jqueryMap.$history_generate.removeClass('disabled').show();
                jqueryMap.$quickGenerateBox.removeClass('disabled').show();
            } else {
                jqueryMap.$infoGenerate.text('');
                jqueryMap.$history_generate.removeClass('disabled').show();
                jqueryMap.$quickGenerateBox.removeClass('disabled').show();
            }
            jqueryMap.$history_generate_delete.hide();
        }
    };

    onLoadSheet = function (page) {
        spinner.spin(jqueryMap.$container.get(0));
        var project_id = jqueryMap.$select_project.val();
        var search_text = jqueryMap.$text_search.val().trim() === '' ? 'all' : jqueryMap.$text_search.val().trim();
        page = typeof(page) == "object" || typeof(page) == typeof(undefined) ? 1 : page;
        stateMap.currentPage = parseInt(page);
        stateMap.project_id = project_id;
        configMap.sheetModel.getCloudSheet(project_id, page, configMap.page_size, search_text, stateMap.pointType).done(function (result) {
            if (!result.success) {
                return false;
            }
            stateMap.pointTotal = result.data.pointTotal;
            renderSheet(result.data.pointTable);
            paginationRefresh(result.data.pointTotal);
            storage.setItem("current_project", project_id);

            //project_data_synchronization_check
            projectCheckDataSync(project_id);

        }).always(function () {
            spinner.stop();
        });
        jqueryMap.$point_export.attr('href', '/point_tool/export/cloud/' + project_id);
    };
    projectCheckDataSync = function (project_id) {
        if (!window.localStorage.getItem("dataSyncCheckNotNotification")) {
            WebAPI.get('dataSyncCheck/' + project_id).done(function (result) {
                if (result.success) {
                    if (!result.data && result.data.dataSync) {
                        infoBox.prompt(I18n.resource.debugTools.sitePoint.THE_PROJECT_DATA_NOT_CONNEDTED_WITH_THE_REAL_TIME_PROJECT_DATA, function (value) {
                            if ($.trim(value)) {
                                WebAPI.post("setPJRealityTable", {
                                    "mysqlname": value,
                                    "projectId": project_id
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
                    } else {

                    }
                } else {
                    alert("project_data_synchronization_check failed");
                }
            }).fail(function () {
                alert("project_data_synchronization_check failed");
            })
        }
    };
    onPointTypeSelected = function () {
        stateMap.pointType = $(this).val();
        if (stateMap.pointType) {
            jqueryMap.$buttonGroup.addClass('pointType');
            if (stateMap.pointType == configMap.cloudPointType.CALC_POINT) {
                jqueryMap.$batch_history.removeClass('dn');
            } else {
                jqueryMap.$batch_history.addClass('dn');
            }
        } else {
            jqueryMap.$buttonGroup.removeClass('pointType');
        }

        onLoadSheet();
    };

    importSheet = function (event) {
        var fileData = event.target.files[0];
        var formData = new FormData();
        formData.append('file', fileData);
        formData.append('projectId', stateMap.project_id);
        formData.append('userId', 68);
        var _this = $(this);
        spinner.spin(document.body);
        $.ajax({
            url: "/point_tool/cloudPoint/import/",
            type: "POST",
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        }).done(function (result) {
            if (!result.success) {
                spinner.stop();
                alert(result.msg);
            } else {
                stateMap.pointTotal = result.data.pointTotal;
                renderSheet(result.data.pointTable);
            }
        }).always(function () {
            spinner.stop();
            _this.val(null);
        });
        return false;
    };

    onRefreshCloudPoint = function () {
        confirm(I18n.resource.debugTools.sitePoint.SYNCHRONIZE_ALL_POINTS_OR_NOT, function () {
            spinner.spin(document.body);
            WebAPI.post('/point_tool/syncCloudPoint', {projectId: stateMap.project_id}).done(function (result) {
                alert(I18n.resource.debugTools.sitePoint.SYNCHRONIZATION_SUCCESSFUL + result.data + I18n.resource.debugTools.sitePoint.POINTS);
                onLoadSheet();
            }).always(function () {
                spinner.stop();
            });
        });
    };

//---------Exports---------
    beop.view = beop.view || {};

    beop.view.cloudSheet = {
        configModel: configModel,
        init: init,
        destroy: destroy,
        sheetInstance: stateMap.sheetInstance,
        onLoadSheet: onLoadSheet
    };
}(beop || (beop = {})));
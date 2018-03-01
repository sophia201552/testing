(function (beop) {
    var i18n = I18n.resource.debugTools.sitePoint,
        i18n_sheetHeaders = I18n.resource.debugTools.sheetHeaders,
        i18n_info = I18n.resource.debugTools.info,
        i18n_point = I18n.resource.debugTools.sitePoint;
    var configMap = {
            htmlURL: '/point_tool/html/pointTable',
            settable_map: {
                sheetModel: true,
                dtu_server_host: ''
            },
            dtu_server_host: '',
            sheetModel: null,
            page_size: 50
        },

        stateMap = {
            sheetInstance: null,
            sheetHeaders: [i18n_sheetHeaders.ID_PHYSICAL, i18n_sheetHeaders.COMMENT, i18n_sheetHeaders.SOURCE_OR_TYPE, i18n_sheetHeaders.TIME, i18n_sheetHeaders.REAL_TIME_DATA, i18n_sheetHeaders.UNIT, i18n_sheetHeaders.R_W_ATTR,
                i18n_sheetHeaders.PARAMETER_1, i18n_sheetHeaders.PARAMETER_2, i18n_sheetHeaders.PARAMETER_3, i18n_sheetHeaders.PARAMETER_4, i18n_sheetHeaders.PARAMETER_5, i18n_sheetHeaders.PARAMETER_6, i18n_sheetHeaders.PARAMETER_7, i18n_sheetHeaders.PARAMETER_8, i18n_sheetHeaders.PARAMETER_9, i18n_sheetHeaders.PARAMETER_10, i18n_sheetHeaders.PARAMETER_11, i18n_sheetHeaders.PARAMETER_12, i18n_sheetHeaders.PARAMETER_13, i18n_sheetHeaders.PARAMETER_14,
                i18n_sheetHeaders.STORAGE_PERIOD, i18n_sheetHeaders.CUSTOM, i18n_sheetHeaders.SYSTEM, i18n_sheetHeaders.EQUIPMENT, i18n_sheetHeaders.TYPE
            ],
            sheetDataType: {
                source: ['phoenix370', 'simense1200', 'simense300', 'simense1200TCP', 'ab500', 'honeywellebi', 'modbus', 'vpoint', 'bacnet',
                    'protocol104', 'lonworks', 'DB-Access', 'DB-SQLServer', 'DB-Oracle', 'DB-MySQL', 'custom1', 'custom2', 'custom3', 'custom4', 'custom5',
                    'DanfossFCProtocol', 'Insight', 'WinCC1', 'KinCC1', 'KingView1', 'ArchestrA3', 'KEPware4'],
                unit: ['%', 'kPa', '℃', 'h', 'Hz', 'V', 'Kw', 'ls', 'KWh', 'm3/h'],
                rwAttr: ['R', 'W'],
                storecycle: [i18n.MEMORY_CYCLE1, i18n.MEMORY_CYCLE2, i18n.MEMORY_CYCLE3, i18n.MEMORY_CYCLE4, i18n.MEMORY_CYCLE5, i18n.MEMORY_CYCLE6, i18n.MEMORY_CYCLE7, i18n.MEMORY_CYCLE8, i18n.MEMORY_CYCLE9, i18n.MEMORY_CYCLE10],
                system: [i18n.SYSTEM0, i18n.SYSTEM1, i18n.SYSTEM2, i18n.SYSTEM3, i18n.SYSTEM4],
                device: [i18n.EQUIPMENT0, i18n.EQUIPMENT1, i18n.EQUIPMENT2, i18n.EQUIPMENT3, i18n.EQUIPMENT4, i18n.EQUIPMENT5, i18n.EQUIPMENT6],
                type: [i18n.TYPES0, i18n.TYPES1, i18n.TYPES2, i18n.TYPES3, i18n.TYPES4, i18n.TYPES5, i18n.TYPES6, i18n.TYPES7, i18n.TYPES8, i18n.TYPES9, i18n.TYPES10]
            },
            searchIndex: 0,
            currentPointIndex: 0,
            changedList: [],
            isValidate: true,
            dtu: {},
            currentPage: 1,
            pointTotal: 0,
            is_load_setting: false,
            operateType: ''
        },
        jqueryMap = {},
        storage, setJqueryMap, configModel, importSheet,
        init, loadSheet, onNewPoint, onEditPoint, onDeletePoint, renderSheet, onJumpPointSet,
        onUndoPoint, onRedoPoint, onSearchTextKeyDown, onEditPointConfirm, onDownloadTable,
        getPointIndex, getParamsInfo, deleteRows, fillTrPointData, isExistPointName, getPointSetting, createChosen,
        validator_point_name, getPointEditParamsInfo, reverseSheetDataType,
        loadPointSetting, loadPointTable, refreshSourceTypeTableSelector, autoSave, destroy,
        onPartialPointUpdateToCore, onAddPointSourceTypeSubmit, onUpdatePointSourceTypeSubmit, refreshSourceTypeSelector,
        dtuOffline, dtuOnline, checkDtu,
        onDeletePointType, onUpdateRowConfirm, onDeletePartialPoints, onChangeProject,
        hasDTUInfo, synPointList, onIsConvertToCloud, onConvertToCloud,
        paginationRefresh;


    storage = window.localStorage;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $wrapper: $('#wrapper'),
            $sheet: $container.find('.sheet'),
            $editPointWin: $container.find('#editPointWin'),
            $isDelPointWin: $container.find('#isDelPointWin'),
            $isUpdatePointWin: $container.find('#isUpdatePointWin'),
            $point_set_btn: $container.find('#point_set'),
            $point_add_btn: $container.find('#point_add'),
            $point_edit_btn: $container.find('#point_edit'),
            $point_delete_btn: $container.find('#point_delete'),
            $point_undo_btn: $container.find('#point_undo'),
            $point_redo_btn: $container.find('#point_redo'),
            $point_prev_btn: $container.find('#point_prev'),
            $point_next_btn: $container.find('#point_next'),
            $point_search_replace_btn: $container.find('#point_search_replace'),
            $point_search_replace_confirm_btn: $container.find('#searchOrReplaceConfirm'),
            $select_project: $container.find('#select_project'),
            $text_search: $container.find('#text_search'),
            $text_replace: $container.find('#text_replace'),
            $uploadInput: $container.find('#uploadInput'),
            $point_id: $container.find('#point_id'),
            $point_name: $container.find('#point_name'),
            $point_source: $container.find('#point_source'),
            $point_notes: $container.find('#point_notes'),
            $point_unit: $container.find('#point_unit'),
            $point_rw_attr: $container.find('#point_rw_attr'),
            $point_bind_set: $container.find('.point_bind_set'),
            $point_max: $container.find('#point_max'),
            $point_min: $container.find('#point_min'),
            $point_jurisdiction: $container.find('#point_jurisdiction'),
            $point_storage_period: $container.find('#point_storage_period'),
            $point_custom: $container.find('#point_custom'),
            $point_system: $container.find('#point_system'),
            $point_device: $container.find('#point_device'),
            $point_type: $container.find('#point_type'),
            $point_export: $container.find('#point_export'),
            $pointRelatedWrapper: $container.find('#pointRelatedWrapper'),
            $deleteRowConfirm: $container.find('#deleteRowConfirm'),
            $updateRowConfirm: $container.find('#updateRowConfirm'),
            $editTitle: $container.find('#editTitle'),
            $pointForm: $container.find('#pointForm'),
            $point_setting: $container.find('#point_setting'),
            $editPointConfirm: $container.find('#editPointConfirm'),
            $point_set_source: $container.find('#point_set_source'),
            $point_setting_edit_ul: $container.find('#point_setting_edit_ul'),
            $point_set_add_Wrapper: $container.find('#point_set_add_Wrapper'),
            $point_set_edit_Wrapper: $container.find('#point_set_edit_Wrapper'),
            $point_set_edit_name_param: $container.find('#point_set_edit_name_param'),
            $delete_point_list: $container.find('.delete-points'),
            $update_point_list: $container.find('.update-points'),
            $count: $container.find('.count'),
            $add_source_form: $container.find('.add-source-form'),
            $update_source_form: $container.find('.update-source-form'),
            $del_point_type: $container.find('#del-point-type'),
            $point_update_partial: $container.find('#point_update_partial'),
            $reset_core: $container.find('#reset_core'),
            $point_delete_partial: $container.find('#point_delete_partial'),
            $dtu_btn_group: $('.dtu-btn-group'),
            $pointPagination: $("#pointPagination"),
            $syn_point_list: $('#syn_point_list'),
            $pointSetWin: $('#pointSetWin'),
            $inputPointNameSubmit: $('#inputPointNameSubmit'),
            $editPointNameSubmit: $("#editPointNameSubmit"),
            $paginationWrapper: $("#paginationWrapper"),
            $pointConvert: $("#point_convert"),
            $isConvertPointWin: $('#isConvertPointWin'),
            $convertConfirm: $('#convertConfirm'),
            $download_table: $('#download_table')
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
        stateMap.is_load_setting = false;
        loadPointTable(page);
        stateMap.currentPage = parseInt(page);
    };

    //---------DOM操作------
    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.page_size);
        jqueryMap.$paginationWrapper.empty().html('<ul id="pointPagination" class="pagination"></ul>');
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
                location.hash = "#pointTable/" + page;
            }
        };
        stateMap.pagination = $("#pointPagination").twbsPagination(pageOption);
    };

    //---------方法---------

    onDeletePartialPoints = function () {
        var update_list = [], update_points = [];
        var selection = stateMap.sheetInstance.getSelected();
        if (!selection) {
            Alert.warning(document.body, i18n_info.CHOOSE_DELETE_POINTS).showAtTop(2000);
            return false;
        }
        var data = stateMap.sheetInstance.getData();
        var startIndex, endIndex;
        if (selection[0] <= selection[2]) {
            startIndex = selection[0];
            endIndex = selection[2];
        } else {
            startIndex = selection[2];
            endIndex = selection[0];
        }
        for (var start = startIndex, end = endIndex + 1; start < end; start++) {
            update_list.push({
                index: start,
                data: data[start]
            });
            update_points.push(data[start].value);
        }
        jqueryMap.$isUpdatePointWin.modal();
        jqueryMap.$update_point_list.html('');
        jqueryMap.$update_point_list.append(beopTmpl('tpl_point_list', {list: update_list}));
        stateMap.update_list = update_list;
        stateMap.update_points = update_points;
        stateMap.command = 'delete';
    };


    onIsConvertToCloud = function () {
        spinner.spin(jqueryMap.$isConvertPointWin.find('.modal-content').get(0));
        WebAPI.post('/point_tool/convertToCloud', {
            projectId: stateMap.project_id,
            type: jqueryMap.$isConvertPointWin.find('input[name=convertType]:checked').val()
        }).done(function (result) {
            if (result.success) {
                jqueryMap.$isConvertPointWin.modal('hide');
                Alert.success(document.body, i18n_info.CONVERT_POINT_SUCCESS.format(result.data)).showAtTop(2000);
            } else {
                Alert.success(document.body, i18n_info.CONVERT_POINT_FAILED).showAtTop(2000);
            }
        }).always(function () {
            spinner.stop();
        })
    };

    onConvertToCloud = function () {
        jqueryMap.$isConvertPointWin.modal();
    };

    onPartialPointUpdateToCore = function () {
        var update_list = [], update_points = [];
        var selection = stateMap.sheetInstance.getSelected();
        if (!selection) {
            Alert.warning(document.body, i18n_info.CHOOSE_DOWNLOAD_POINT).showAtTop(2000);
            return false;
        }
        var data = stateMap.sheetInstance.getData();
        var startIndex, endIndex;
        if (selection[0] <= selection[2]) {
            startIndex = selection[0];
            endIndex = selection[2];
        } else {
            startIndex = selection[2];
            endIndex = selection[0];
        }
        for (var start = startIndex, end = endIndex + 1; start < end; start++) {
            update_list.push({
                index: start,
                data: data[start]
            });
            update_points.push(data[start].value);
        }
        jqueryMap.$isUpdatePointWin.modal();
        jqueryMap.$update_point_list.html('');
        jqueryMap.$update_point_list.append(beopTmpl('tpl_point_list', {list: update_list}));
        stateMap.update_list = update_list;
        stateMap.update_points = update_points;
        stateMap.command = 'update';
    };

    onUpdateRowConfirm = function () {
        if (!stateMap.update_list.length) {
            return false;
        }
        if (!hasDTUInfo()) {
            Alert.warning(document.body, i18n_info.DTU_SEND_FAILED).showAtTop(2000);
            return;
        }
        spinner.spin($('#isUpdatePointWin .modal-content').get(0));
        if (stateMap.command === 'update') {
            WebAPI.ajaxForDebugTool({type: 'POST', data: {'data': JSON.stringify(stateMap.update_list)}},
                configMap.dtu_server_host, stateMap.dtu.dtuname, 'updatePartialToCore').done(function (result) {
                    if (result.success) {
                        jqueryMap.$isUpdatePointWin.modal('hide');
                        Alert.success(document.body, i18n_info.UPLOAD_POINT_SUCCESS.format(result.data.resp)).showAtTop(2000);
                    } else {
                        Alert.danger(document.body, result.msg).showAtTop(2000);
                    }
                }).fail(function () {
                    Alert.danger(document.body, i18n_info.SYSTEM_ERROR).showAtTop(2000);
                }).always(function () {
                    spinner.stop();
                })
        } else if (stateMap.command === 'delete') {
            WebAPI.ajaxForDebugTool({type: 'POST', data: {'data': JSON.stringify(stateMap.update_points)}},
                configMap.dtu_server_host, stateMap.dtu.dtuname, 'deletePartialPoint').done(function (result) {
                    if (result.success) {
                        Alert.success(document.body, i18n_info.DELETE_COMMAND_SUCCESSFULLY.format(result.data.resp)).showAtTop(2000);
                        jqueryMap.$isUpdatePointWin.modal('hide');
                    } else {
                        Alert.danger(document.body, result.msg).showAtTop(2000);
                    }
                }).fail(function () {
                    Alert.danger(document.body, i18n_info.SYSTEM_ERROR).showAtTop(2000);
                }).always(function () {
                    spinner.stop();
                })
        }

    };

    autoSave = function () {
        stateMap.intervalID_autoSave = setInterval(function () {
            if (stateMap.changedList.length) {
                WebAPI.post('/point_tool/autoSave/' + stateMap.project_id + '/', stateMap.changedList).done(function (result) {
                    if (result.success) {
                        stateMap.changedList = [];
                    }
                })
            }
        }, 3000)
    };

    isExistPointName = function (pointName) {
        var data = stateMap.sheetData;
        for (var m = 0, len = data.length; m < len; m++) {
            if (pointName === data[m].value) {
                return true;
            }
        }
        return false;
    };

    validator_point_name = function (value, callback) {
        if (value === false) {//不进行验证
            callback(true);
        } else {
            if (!value) {//空
                stateMap.isValidate = false;
                Alert.warning(document.body, 'The point name can\'t be empty').showAtTop(2000);
            } else {//重复
                var isExist = isExistPointName(value);
                if (isExist) {
                    Alert.warning(document.body, value + ' already exists.').showAtTop(2000);
                }
                stateMap.isValidate = !isExist;
            }
            callback(stateMap.isValidate);
        }
    };

    deleteRows = function () { //删除一行或多行
        var delete_points = stateMap.delete_points;
        spinner.spin(document.body);
        $.post('/point_tool/deleteEnginePoint/' + stateMap.project_id + '/', {point_list: delete_points}).done(function (result) {
            if (result.success) {
                jqueryMap.$isDelPointWin.modal('hide');
                jqueryMap.$delete_point_list.empty();
                stateMap.delete_list = [];
                stateMap.delete_points = [];
                stateMap.sheetInstance = null;
                loadPointTable(stateMap.currentPage);
            } else {
                Alert.danger(document.body, i18n_info.DELETE_FAILED + ':' + result.msg).showAtTop(2000);
            }
        }).always(function () {
            spinner.stop();
        });
    };

    reverseSheetDataType = function () {
        var reverser = function (list) {
            var map = {};
            for (var m = 0, mlen = list.length; m < mlen; m++) {
                map[list[m]] = m;
            }
            return map;
        };
        stateMap.sheetDataType.unitMap = reverser(stateMap.sheetDataType.unit);
        stateMap.sheetDataType.rwAttrMap = reverser(stateMap.sheetDataType.rwAttr);
        stateMap.sheetDataType.storecycleMap = reverser(stateMap.sheetDataType.storecycle);
    };

    destroy = function () {
        if (stateMap.sheetInstance) {
            stateMap.sheetInstance.destroy();
            stateMap.sheetInstance = null;
        }
        clearInterval(stateMap.intervalID_checkDTU);
        clearInterval(stateMap.intervalID_autoSave);
    };

    renderSheet = function (data) {
        if (!data) {
            Alert.danger(i18n_info.DATA_IS_EMPTY).showAtTop(2000);
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
                fixedColumnsLeft: 1,
                search: true,
                minSpareRows: 0,
                minSpareCols: 0,
                outsideClickDeselects: false,
                afterOnCellMouseDown: function (event, coords) {//显示类型params
                    var row = stateMap.sheetInstance.getData()[coords.row];
                    var sourceType = stateMap.sourceTypes[row.params.source];
                    var newHeaders = stateMap.sheetHeaders.slice();
                    var paramIndex = storage.language == "en" ? 10 : 2;
                    for (var i = 0, len = stateMap.sheetHeaders.length; i < len; i++) {
                        if (stateMap.sheetHeaders[i] && stateMap.sheetHeaders[i].indexOf(i18n_point.PARAMETER) !== -1) {
                            var typeKey = 'param' + stateMap.sheetHeaders[i].substring(paramIndex);
                            if ('undefined' === typeof sourceType[typeKey]) {
                                newHeaders[i] = stateMap.sheetHeaders[i];
                            } else {
                                newHeaders[i] = sourceType[typeKey] ? sourceType[typeKey] : '';
                            }
                        }
                    }
                    stateMap.sheetInstance.updateSettings({'colHeaders': newHeaders});
                },
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
                    if (stateMap.isValidate) {
                        for (var m = 0; m < changes.length; m++) {
                            var row = changes[m][0];
                            if (stateMap.sheetInstance.getData()[row].value) {
                                stateMap.changedList.push(stateMap.sheetInstance.getData()[row]);
                            }
                        }
                    }
                    stateMap.isValidate = true;
                },
                currentRowClassName: 'currentRow',
                columns: [
                    {
                        data: "value",
                        type: 'text',
                        validator: validator_point_name, // validator function defined elsewhere
                        readOnly: true
                    },
                    {
                        data: "params.remark",
                        type: 'text',
                        width: "200px"
                    },
                    {
                        data: "params.source",
                        type: 'dropdown',
                        source: stateMap.sheetDataType.source,
                        width: "120px",
                        allowInvalid: false
                    },
                    {
                        data: "time",
                        type: 'text',
                        readOnly: true
                    },
                    {
                        data: "pointvalue",
                        type: 'text',
                        width: "80px",
                        readOnly: true
                    },
                    {
                        data: "params.Unit",
                        type: 'dropdown',
                        source: stateMap.sheetDataType.unit,
                        width: "80px",
                        allowInvalid: false
                    },
                    {
                        data: "params.RWProperty",
                        type: 'dropdown',
                        source: stateMap.sheetDataType.rwAttr,
                        width: "80px",
                        allowInvalid: false
                    },
                    {
                        data: "params.param1",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param2",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param3",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param4",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param5",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param6",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param7",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param8",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param9",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param10",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param11",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param12",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param13",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.param14",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.storecycle",
                        type: 'dropdown',
                        source: stateMap.sheetDataType.storecycle,
                        width: "100px",
                        allowInvalid: false
                    },
                    {
                        data: "params.customName",
                        width: "100px",
                        type: 'text'
                    },
                    {
                        data: "params.system",
                        type: 'dropdown',
                        source: stateMap.sheetDataType.system,
                        width: "100px",
                        allowInvalid: false
                    },
                    {
                        data: "params.device",
                        type: 'dropdown',
                        source: stateMap.sheetDataType.device,
                        width: "100px",
                        allowInvalid: false
                    },
                    {
                        data: "params.type",
                        type: 'dropdown',
                        source: stateMap.sheetDataType.type,
                        width: "100px",
                        allowInvalid: false
                    }
                ]
            });
        }

        stateMap.sheetData = stateMap.sheetInstance.getData();
        jqueryMap.$sheet.off("click").on('click', "tbody td", getPointIndex);
    };
//---------事件---------

    onJumpPointSet = function () {
        jqueryMap.$pointSetWin.modal();
        if (!stateMap.is_load_setting) {
            loadPointSetting();
        }
    };

    loadPointTable = function (page) {// 加载点表
        var initPointTable = function (resultHtml) {
            reverseSheetDataType();
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            jqueryMap.$point_set_btn.on('click', onJumpPointSet);
            jqueryMap.$point_add_btn.on('click', onNewPoint);
            jqueryMap.$point_edit_btn.on('click', onEditPoint);
            jqueryMap.$point_delete_btn.on('click', onDeletePoint);
            jqueryMap.$point_undo_btn.on('click', onUndoPoint);
            jqueryMap.$point_redo_btn.on('click', onRedoPoint);
            jqueryMap.$text_search.on('keydown', onSearchTextKeyDown);
            jqueryMap.$deleteRowConfirm.on('click', deleteRows);
            jqueryMap.$editPointConfirm.on('click', onEditPointConfirm);
            jqueryMap.$point_update_partial.on('click', onPartialPointUpdateToCore);
            jqueryMap.$updateRowConfirm.on('click', onUpdateRowConfirm);
            jqueryMap.$point_delete_partial.on('click', onDeletePartialPoints);
            jqueryMap.$download_table.on('click', onDownloadTable);
            jqueryMap.$uploadInput.change(importSheet);
            jqueryMap.$select_project.change(onChangeProject);
            jqueryMap.$point_source.change(getParamsInfo);
            jqueryMap.$syn_point_list.click(synPointList);
            jqueryMap.$pointConvert.click(onConvertToCloud);
            jqueryMap.$convertConfirm.click(onIsConvertToCloud);
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

                loadSheet(page);
            }
            refreshSourceTypeTableSelector();
            paginationRefresh(stateMap.pointTotal);
            I18n.fillArea(stateMap.$container);
        };
        $.get('/point_tool/pointSourceType/getAll').done(function (result) {
            if (result.success) {
                stateMap.sourceTypes = result.data;
            } else {
                stateMap.sourceTypes = {};
            }
            $.get(configMap.htmlURL).done(function (htmlResult) {
                initPointTable(htmlResult);
                I18n.fillArea(jqueryMap.$wrapper);
                autoSave();
            })
        });
    };

    synPointList = function () {
        spinner.spin(document.body);
        WebAPI.ajaxForDebugTool({
            type: 'POST'
        }, configMap.dtu_server_host, stateMap.dtu.dtuname, 'synPointList').done(function (result) {
            if (result.success) {
                var points = result.data.resp;
                if (!points) {
                    Alert.danger(i18n_info.NOT_RECEIVE_DATA).showAtTop(2000);
                    return;
                }
                spinner.spin(document.body);
                var _this = $(this);
                WebAPI.post("/point_tool/import_data/", {
                    data: points,
                    projectId: stateMap.project_id
                }).done(function (result) {
                    if (!result.success) {
                        spinner.stop();
                        Alert.danger(result.msg).showAtTop(2000);
                    } else {
                        stateMap.pointTotal = result.data.pointTotal;
                        renderSheet(result.data.pointTable);
                    }
                }).always(function () {
                    spinner.stop();
                    _this.val(null);
                });
            }
        }).always(function () {
            spinner.stop();
        });
    };

    loadPointSetting = function () { // 加载点来源配置
        var initPointSetting = function () {
            setJqueryMap();
            jqueryMap.$point_set_source.change(getPointEditParamsInfo);
            jqueryMap.$inputPointNameSubmit.off().on('click', onAddPointSourceTypeSubmit);
            jqueryMap.$editPointNameSubmit.off().on('click', onUpdatePointSourceTypeSubmit);
            jqueryMap.$del_point_type.off().click(onDeletePointType);
            refreshSourceTypeSelector();
        };

        $.get('/point_tool/pointSourceType/getAll').done(function (result) {
            if (result.success) {
                stateMap.sourceTypes = result.data;
            } else {
                stateMap.sourceTypes = {};
            }
            stateMap.is_load_setting = true;
            initPointSetting();
            I18n.fillArea(jqueryMap.$wrapper);
            getPointEditParamsInfo();
        });
    };

    refreshSourceTypeTableSelector = function () {
        jqueryMap.$point_source.empty().append(beopTmpl('tpl_source_type_options_table', {sourceTypes: stateMap.sourceTypes}));
    };

    refreshSourceTypeSelector = function () {
        jqueryMap.$point_set_source.empty().append(beopTmpl('tpl_source_type_options', {sourceTypes: stateMap.sourceTypes}));
        jqueryMap.$point_set_source.find("option").eq(1).change();
    };

    hasDTUInfo = function () {
        return stateMap.dtu && stateMap.dtu.dtuname;
    };

    onNewPoint = function () {
        stateMap.operateType = 'add';
        jqueryMap.$editTitle.html(i18n_point.NEW_POINT);
        jqueryMap.$pointForm.find("input").val("");
        jqueryMap.$pointForm.find("select").val("-1");
        jqueryMap.$point_name.attr('readonly', false);
        getPointSetting('new');
        createChosen("new");
        var html = '';
        for (var i = 0; i < 10; i++) {
            html += '<div class="reserveParamWrapper">' +
                '<div class="w150 m_auto">' + I18n.resource.debugTools.sitePoint.SUBSCRIPTION_PARAMETERS + (i + 1) + '</div>' +
                '<input type="text" value="" class="form-control m_auto reserveParamObj" name="param' + (i + 1) + '"/>' +
                '</div>';
        }
        jqueryMap.$pointRelatedWrapper.html(html);
        jqueryMap.$editPointWin.modal();
    };

    onEditPoint = function () {
        stateMap.operateType = 'edit';
        jqueryMap.$editTitle.html(i18n_point.EDIT_POINT);
        var flag = fillTrPointData();
        if (flag) {
            jqueryMap.$point_name.attr('readonly', true);
            jqueryMap.$editPointWin.modal();
        }
    };

    onEditPointConfirm = function () {
        var url, pointModel = jqueryMap.$pointForm.serializeObject();
        if (stateMap.operateType === 'add') {
            url = '/point_tool/addPoint/' + stateMap.project_id + '/';
        } else if (stateMap.operateType === 'edit') {
            url = '/point_tool/editPoint/' + stateMap.project_id + '/';
        }
        $.post(url, pointModel).done(function (result) {
            if (result.success) {
                Alert.success(document.body, i18n_info.MODIFY_SUCCESS).showAtTop(2000);
                stateMap.sheetInstance = null;
                loadPointTable(stateMap.currentPage);
            } else {
                Alert.danger(document.body, i18n_info.MODIFY_FAILED + ':' + result.msg).showAtTop(2000);
            }
        });
        return false;
    };

    onDeletePoint = function () {
        stateMap.delete_list = [];
        stateMap.delete_list = [];
        jqueryMap.$delete_point_list.empty();

        var data = stateMap.sheetInstance.getData();
        var delete_list = [], delete_points = [];
        var selection = stateMap.sheetInstance.getSelected();
        if (!selection) {
            alert(i18n_info.CHOOSE_DELETE_POINTS);
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

    onDownloadTable = function () {
        // do download table
        var projectId = jqueryMap.$select_project.val();
        WebAPI.get('/point_tool/download/table/' + projectId).done(function(result) {
            result;
        }).always(function(result) {
            result;

        });
    };

    getParamsInfo = function () {
        var val = $.trim(jqueryMap.$point_source.find("option:selected").val());
        if (val) {
            var typeData = stateMap.sourceTypes[val];
            jqueryMap.$pointRelatedWrapper.html(beopTmpl('tpl_source_type_name', {typeData: typeData}));

            // 切换点类型下拉菜单，清空之前参数值
            var $reserveParamWrapper = jqueryMap.$pointRelatedWrapper.find(".reserveParamObj");
            for (var i = 0; i < $reserveParamWrapper.length; i++) {
                $reserveParamWrapper.eq(i).val("");
            }
            //  切换点类型下拉菜单所对应的参数
            var data = stateMap.sheetData[stateMap.currentPointIndex];
            var $reserveParamWrapper = jqueryMap.$pointRelatedWrapper.find(".reserveParamObj");
            for (var i = 0; i < $reserveParamWrapper.length; i++) {
                $reserveParamWrapper.eq(i).val(data.params['param' + (i + 1)]);
            }
        }
    };

    getPointEditParamsInfo = function () {
        var val = $.trim(jqueryMap.$point_set_source.find("option:selected").val());
        var types = stateMap.sourceTypes[val];
        //排序
        var keys = Object.keys(types);
        keys = keys.sort(naturalCompare);
        var params = [];
        for (var m = 0; m < keys.length; m++) {
            params.push({name: keys[m], value: types[keys[m]]});
        }
        var html = beopTmpl('tpl_source_type_values', {params: params});
        jqueryMap.$point_set_edit_name_param.find(".point_set_title").show();
        jqueryMap.$point_setting_edit_ul.html(html);
    };

    onSearchTextKeyDown = function (e) {
        if (e.keyCode === 13) {
            stateMap.currentPage = 1;
            loadSheet(stateMap.currentPage);
        }
    };

    getPointIndex = function () {
        stateMap.currentPointIndex = stateMap.sheetInstance.getSelected() ? stateMap.sheetInstance.getSelected()[0] : 0;
    };

    onChangeProject = function () {
        stateMap.currentPage = 1;
        jqueryMap.$text_search.val('');
        loadSheet(stateMap.currentPage);
    };

    fillTrPointData = function () { // 点击编辑加载当前行的数据
        var flag = getPointSetting('edit');
        if (flag) {
            getPointSetting('edit');
            createChosen("edit");
            var data = stateMap.sheetData[stateMap.currentPointIndex];
            jqueryMap.$point_id.val(data._id);
            jqueryMap.$point_name.val(data.value);
            jqueryMap.$point_source.val(data.params.source);
            jqueryMap.$point_notes.val(data.params.remark);
            jqueryMap.$point_unit.val(data.params.Unit);
            jqueryMap.$point_rw_attr.val(data.params.RWProperty);
            jqueryMap.$point_max.val(data.params.param12);
            jqueryMap.$point_min.val(data.params.param13);
            jqueryMap.$point_storage_period.val(data.params.storecycle);
            jqueryMap.$point_custom.val(data.params.customName);
            jqueryMap.$point_device.val(data.params.device);
            jqueryMap.$point_system.val(data.params.system);
            jqueryMap.$point_type.val(data.params.type);

            if (parseInt(data.params.param14) === 1) {
                jqueryMap.$point_jurisdiction.attr("checked", true);
            } else {
                jqueryMap.$point_jurisdiction.attr("checked", false);
            }
            getParamsInfo();
            return true;
        } else {
            return false;
        }
    };

    getPointSetting = function (operateType) {
        var html = '<option selected="selected" value=""></option>';
        jqueryMap.$point_bind_set.html("");
        var point = stateMap.sheetInstance.getData()[stateMap.currentPointIndex];
        if (!point) {
            if (operateType === 'edit') {
                alert(i18n_info.CHOOSE_EDIT_POINTS);
            }
            return false;
        }
        var physical_id_val = point.value;
        for (var i = 0; i < stateMap.sheetData.length; i++) {
            if (stateMap.sheetData[i][1] == physical_id_val) {
                html += '<option value="' + physical_id_val + '">' + stateMap.sheetData[i].value + '</option>';
            } else {
                html += '<option value="' + stateMap.sheetData[i].value + '">' + stateMap.sheetData[i].value + '</option>';
            }
        }
        jqueryMap.$point_bind_set.html(html);
        if ($(".chosen-container").length > 0) {
            jqueryMap.$point_bind_set.chosen("destroy");
        }
        jqueryMap.$point_bind_set.chosen({width: "100%", search_contains: true});
        return true;
    };

    createChosen = function (str) {
        if ($(".chosen-container").length > 0) {
            jqueryMap.$point_bind_set.chosen("destroy");
        }
        if (str == "new") {
            //jqueryMap.$point_bind_set.find("option[value='" + stateMap.sheetData[0][1] + "']").attr("selected", "selected");
        }
        jqueryMap.$point_bind_set.chosen({width: "100%", search_contains: true});
    };

    dtuOffline = function () {
        jqueryMap.$dtu_btn_group.find('.btn').addClass('disabled');
    };

    dtuOnline = function () {
        jqueryMap.$dtu_btn_group.find('.btn').removeClass('disabled');
    };

    checkDtu = function () {
        $.ajax({
            type: 'GET',
            url: 'http://' + configMap.dtu_server_host + '/isDtuOnline/' + stateMap.dtu.dtuname,
            crossDomain: true,
            dataType: 'json'
        }).done(function (result) {
            if (result.success) {
                var data = result.data;
                var $dtuInfo = $('#dtu_info').find('.info');
                $dtuInfo.removeClass().addClass('info');
                if (data.isOnline) {
                    dtuOnline();
                    $dtuInfo.addClass('text-success').text(' ' + i18n_point.NAME + ':' + data.dtu.name + ' ip:' + i18n_point.PORT + data.dtu.host + ':' + data.dtu.port)
                } else {
                    dtuOffline();
                    $dtuInfo.addClass('text-danger').text(i18n_info.DTU_CONNECTION_FAILED);
                }
            } else {
                dtuOffline();
            }
        }).fail(function () {
            dtuOffline();
        });
    };

    loadSheet = function (page) {
        spinner.spin(jqueryMap.$container.get(0));
        var project_id = jqueryMap.$select_project.val();
        var search_text = jqueryMap.$text_search.val().trim() === '' ? 'all' : jqueryMap.$text_search.val().trim();
        getDebugServerHost(project_id, configMap);
        page = typeof(page) == ("object" || "undefined") ? 1 : page;
        stateMap.currentPage = parseInt(page);
        stateMap.project_id = project_id;
        dtuOffline();
        configMap.sheetModel.getSheet(project_id, page, configMap.page_size, search_text).done(function (result) {
            if (!result.success) {
                return false;
            }
            stateMap.pointTotal = result.data.pointTotal;

            renderSheet(result.data.pointTable);
            stateMap.dtu = result.data.dtu;
            stateMap.pointTotal = result.data.pointTotal;
            paginationRefresh(stateMap.pointTotal);
            storage.setItem("current_project", project_id);

            if (!stateMap.dtu || !stateMap.dtu.dtuname) {
                $('#dtu_info').find('.info').removeClass('text-warning').removeClass('text-success').addClass('text-danger').text(i18n_info.DTU_CONNECTION_FAILED);
            } else {
                checkDtu();
                stateMap.intervalID_checkDTU = setInterval(function () {
                    checkDtu();
                }, 60000)
            }
        }).always(function () {
            spinner.stop();
        });
        jqueryMap.$point_export.attr('href', '/point_tool/export/engine/' + project_id);
    };

    importSheet = function (event) {
        var fileData = event.target.files[0];
        var formData = new FormData();
        formData.append('file', fileData);
        formData.append('projectId', stateMap.project_id);
        formData.append('userId', 68);
        spinner.spin(document.body);
        var _this = $(this);
        $.ajax({
            url: "/point_tool/import/",
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

    onAddPointSourceTypeSubmit = function () {
        $.post('/point_tool/pointSourceType/add/', $(this).parents("form").serializeObject()).done(function (result) {
            if (result.success) {
                alert(i18n_info.ADD_SUCCESS);
                stateMap.sourceTypes[result.data.name] = result.data.params;
                refreshSourceTypeSelector();
            } else {
                alert(result.msg);
            }
        });
        return false;
    };

    onUpdatePointSourceTypeSubmit = function () {
        $.post('/point_tool/pointSourceType/update/', $(this).parents("form").serializeObject()).done(function (result) {
            if (result.success) {
                alert(i18n_info.UPDATE_SUCCESS);
            } else {
                alert(result.msg);
            }
        });
        return false;
    };

    onDeletePointType = function () {
        var typeName = jqueryMap.$point_set_source.val();
        $.post('/point_tool/pointSourceType/delete/', {name: typeName}).done(function (result) {
            if (result.success) {
                alert(i18n_info.DELETE_SUCCESS);
                delete stateMap.sourceTypes[typeName];
                refreshSourceTypeSelector();
                jqueryMap.$point_set_source.trigger('change');
            } else {
                alert(i18n_info.DELETE_FAILED);
            }
        })
    };

//---------Exports---------
    beop.view = beop.view || {};

    beop.view.sheet = {
        configModel: configModel,
        init: init,
        destroy: destroy,
        sheetInstance: stateMap.sheetInstance,
        loadPointSetting: loadPointSetting,
        loadSheet: loadSheet
    };
})(beop || (beop = {}));

(function (beop) {
    var i18n = I18n.resource.debugTools.sitePoint,
        i18n_sheetHeaders = I18n.resource.debugTools.sheetHeaders;
    var configMap = {
            htmlURL: '/point_tool/html/cloudPointTable',
            settable_map: {
                sheetModel: true
            },
            sheetModel: null,
            page_size: 50
        },
        stateMap = {
            sheetInstance: null,
            sheetHeaders: [i18n_sheetHeaders.CONFIGURATION_POINT, i18n_sheetHeaders.COMMENT, i18n_sheetHeaders.ENGLISH_NOTES, i18n_sheetHeaders.SYSTEM, i18n_sheetHeaders.EQUIPMENT, i18n_sheetHeaders.TYPE, i18n_sheetHeaders.CHANGE_MAN, i18n_sheetHeaders.CHANGE_TIME],
            sheetDataType: {
                system: [i18n.SYSTEM0, i18n.SYSTEM1, i18n.SYSTEM2, i18n.SYSTEM3, i18n.SYSTEM4],
                device: [i18n.EQUIPMENT0, i18n.EQUIPMENT1, i18n.EQUIPMENT2, i18n.EQUIPMENT3, i18n.EQUIPMENT4, i18n.EQUIPMENT5, i18n.EQUIPMENT6],
                type: [i18n.TYPES0, i18n.TYPES1, i18n.TYPES2, i18n.TYPES3, i18n.TYPES4, i18n.TYPES5, i18n.TYPES6, i18n.TYPES7, i18n.TYPES8, i18n.TYPES9, i18n.TYPES10]
            },

            changedList: [],
            currentPage: 1,
            pointTotal: 0
        },
        jqueryMap = {},
        storage, setJqueryMap, configModel, importSheet, init,
        onChangeProject, onLoadSheet, onNewPoint, onDeletePoint, onEditPointConfirm, renderSheet, paginationRefresh,
        onUndoPoint, onRedoPoint, onSearchTextKeyDown, getPointIndex, deleteRows, isExistPointName,
        validator_point_name, loadPointTable, autoSave, destroy;


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
            $pointForm: $container.find('#pointForm')
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

    autoSave = function () {
        setInterval(function () {
            if (stateMap.changedList && stateMap.changedList.length) {
                WebAPI.post('/point_tool/autoSave/' + stateMap.project_id + '/', stateMap.changedList).done(function (result) {
                    if (result.success) {
                        stateMap.changedList = [];
                    }
                })
            }
        }, 2000)
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
        $.post('/point_tool/deleteCloudPoint/' + stateMap.project_id + '/', {point_list: delete_points}).done(function (result) {
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
        if (stateMap.sheetInstance) {
            stateMap.sheetInstance.destroy();
            stateMap.sheetInstance = null;
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
                        validator: validator_point_name // validator function defined elsewhere
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

    loadPointTable = function (page) {// 加载点表
        var initPointTable = function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            jqueryMap.$point_add_btn.on('click', onNewPoint);
            jqueryMap.$point_delete_btn.on('click', onDeletePoint);
            jqueryMap.$point_undo_btn.on('click', onUndoPoint);
            jqueryMap.$point_redo_btn.on('click', onRedoPoint);
            jqueryMap.$text_search.on('keydown', onSearchTextKeyDown);
            jqueryMap.$deleteRowConfirm.on('click', deleteRows);
            jqueryMap.$editPointConfirm.on('click', onEditPointConfirm);
            jqueryMap.$uploadInput.change(importSheet);
            jqueryMap.$select_project.change(onChangeProject);

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
            }
        };
        $.get(configMap.htmlURL).done(function (result) {
            initPointTable(result);
            I18n.fillArea(stateMap.$container);
            autoSave();
        });
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
            stateMap.currentPage = 1;
            onLoadSheet(stateMap.currentPage);
        }
    };

    getPointIndex = function () {
        stateMap.currentPointIndex = stateMap.sheetInstance.getSelected() ? stateMap.sheetInstance.getSelected()[0] : 0;
    };

    onChangeProject = function () {
        stateMap.currentPage = 1;
        jqueryMap.$text_search.val('');
        onLoadSheet(stateMap.currentPage);
    };

    onNewPoint = function () {
        jqueryMap.$editPointWin.modal();
    };

    onEditPointConfirm = function () {
        var pointModel = jqueryMap.$pointForm.serializeObject();
        $.post('/point_tool/addCloudPoint/' + stateMap.project_id + '/', pointModel).done(function (result) {
            if (result.success) {
                Alert.success(document.body, I18n.resource.debugTools.info.MODIFY_SUCCESS).showAtTop(2000);
                stateMap.sheetInstance = null;
                loadPointTable(stateMap.currentPage);
            } else {
                Alert.danger(document.body, I18n.resource.debugTools.info.MODIFY_FAILED + ':' + result.msg).showAtTop(2000);
            }
        }).always(function () {
            jqueryMap.$editPointWin.modal('hide');
        });
        return false;
    };

    onLoadSheet = function (page) {
        spinner.spin(jqueryMap.$container.get(0));
        var project_id = jqueryMap.$select_project.val();
        var search_text = jqueryMap.$text_search.val().trim() === '' ? 'all' : jqueryMap.$text_search.val().trim();
        page = typeof(page) == ("object" || "undefined") ? 1 : page;
        stateMap.currentPage = parseInt(page);
        stateMap.project_id = project_id;
        configMap.sheetModel.getCloudSheet(project_id, page, configMap.page_size, search_text).done(function (result) {
            if (!result.success) {
                return false;
            }
            stateMap.pointTotal = result.data.pointTotal;
            renderSheet(result.data.pointTable);
            paginationRefresh(result.data.pointTotal);
            storage.setItem("current_project", project_id);
        }).always(function () {
            spinner.stop();
        });
        jqueryMap.$point_export.attr('href', '/point_tool/export/cloud/' + project_id);
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

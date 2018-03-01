(function (beop) {
    var i18n_sheetHeaders = I18n.resource.debugTools.sheetHeaders;
    var isSmallScreen = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) <= 768;
    var configMap = {
            htmlURL: '/point_tool/html/pointMapping',
            settable_map: {
                sheetModel: true
            },
            sheetModel: null,
            page_size: isSmallScreen ? 20 : 25,
            enginePointSearchSize: isSmallScreen ? 8 : 10
        },
        stateMap = {
            sheetInstance: null,
            sheetHeaders: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) <= 768 ?
                [i18n_sheetHeaders.CLOUD_POINT, i18n_sheetHeaders.COMMENT, i18n_sheetHeaders.SITE_POINT, i18n_sheetHeaders.MAPPING, i18n_sheetHeaders.SITE_POINT_NOTES, i18n_sheetHeaders.REAL_TIME_DATA, i18n_sheetHeaders.DATA_TIME] :
                [i18n_sheetHeaders.CLOUD_POINT, i18n_sheetHeaders.COMMENT, i18n_sheetHeaders.SITE_POINT, i18n_sheetHeaders.SITE_POINT_NOTES, i18n_sheetHeaders.REAL_TIME_DATA, i18n_sheetHeaders.DATA_TIME, i18n_sheetHeaders.MAPPING],
            changedList: {},
            currentPage: 1,
            enginePointSearchPage: 1,
            pointTotal: 0,
            mappingPoint: null,
            mappedType: 'all'
        },
        jqueryMap = {},
        storage, setJqueryMap, configModel, init, loadSheet, renderSheet,
        onSelectEnginePoint, onDisplaySelected, onPointMapping, onUndoPoint, onRedoPoint, onSearchTextKeyDown, onImportMapping,
        importSheet,
        onPointSearchKeyDown, getPointIndex, refreshMappingInfo, doSearchPointInEngine,
        loadPointTable, autoSave, destroy, paginationRefresh, paginationStatic, doSearchHighlight;


    storage = window.localStorage;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $sheet: $container.find('.sheet'),
            $point_undo_btn: $container.find('#point_undo'),
            $point_redo_btn: $container.find('#point_redo'),
            $select_project: $container.find('#select_project'),
            $text_search: $container.find('#text_search'),
            $point_search: $container.find('#point_search'),
            $search_result: $container.find('#search_result'),
            $energy_section: $container.find('.energy-section'),
            $count: $container.find('.count'),
            $mappingPagination: $container.find('#mappingPagination'),
            $enginePointPagination: $container.find('#enginePointPagination'),
            $display_type: $container.find('#display_type'),
            $point_mapping: $container.find('#point_mapping'),
            $export_mapping: $container.find('#export_mapping'),
            $import_mapping: $container.find('#import_mapping')
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

    init = function ($container, text, page) {
        stateMap.$container = $container;
        stateMap.currentPage = parseInt(page);
        stateMap.searchText = text ? text.trim() : '';
        loadPointTable();

    };

    //---------DOM操作------


    //---------方法---------

    refreshMappingInfo = function (row, point) {
        var mapping = point['params']['mapping'];
        for (var prop in mapping) {
            if (mapping.hasOwnProperty(prop)) {
                stateMap.sheetInstance.setDataAtRowProp(row, 'params.mapping.' + prop, mapping[prop]);
            }
        }
    };

    autoSave = function () {
        stateMap.intervalID = setInterval(function () {
            if (!$.isEmptyObject(stateMap.changedList)) {
                clearInterval(stateMap.intervalID);
                WebAPI.post('/point_tool/mappingAutoSave/' + stateMap.project_id + '/', stateMap.changedList).done(function (result) {
                    if (result.success) {
                        for (var row in result.data) {
                            if (result.data.hasOwnProperty(row)) {
                                refreshMappingInfo(row, result.data[row]);
                            }
                        }
                        stateMap.changedList = {};
                    }
                }).always(function () {
                    autoSave();
                })
            }
        }, 2000)
    };

    destroy = function () {
        if (stateMap.sheetInstance) {
            stateMap.sheetInstance.destroy();
            stateMap.sheetInstance = null;
        }
        clearInterval(stateMap.intervalID);
    };

    renderSheet = function (data) {
        if (!data) {
            alert(I18n.resource.debugTools.info.DATA_IS_EMPTY);
            return false;
        }

        if (stateMap.sheetInstance) {
            stateMap.sheetInstance.loadData(data);
        } else {
            var bigScreenColumns = [
                {
                    data: "value",
                    type: 'text',
                    readOnly: true
                },
                {
                    data: "params.remark",
                    type: 'text',
                    width: "200px",
                    readOnly: true
                },
                {
                    data: "params.mapping.point",
                    type: 'text',
                    width: "200px"
                },
                {
                    data: "params.mapping.remark",
                    type: 'text',
                    width: "150px",
                    readOnly: true
                },
                {
                    data: "params.mapping.val",
                    type: 'text',
                    width: "100px",
                    readOnly: true
                },
                {
                    data: "params.mapping.val_time",
                    type: 'text',
                    width: "100px",
                    readOnly: true
                },
                {
                    data: function (data) {
                        return !!(data && !$.isEmptyObject(data.params.mapping) && data.params.mapping.point);
                    },
                    type: 'checkbox',
                    width: "50px"
                }
            ];
            var smallScreenColumns = [
                {
                    data: "value",
                    type: 'text',
                    readOnly: true
                },
                {
                    data: "params.remark",
                    type: 'text',
                    width: "200px",
                    readOnly: true
                },
                {
                    data: "params.mapping.point",
                    type: 'text',
                    width: "200px"
                },
                {
                    data: function (data) {
                        return !!(data && !$.isEmptyObject(data.params.mapping) && data.params.mapping.point);
                    },
                    type: 'checkbox',
                    width: "50px"
                },
                {
                    data: "params.mapping.remark",
                    type: 'text',
                    width: "250px",
                    readOnly: true
                },
                {
                    data: "params.mapping.val",
                    type: 'text',
                    width: "100px",
                    readOnly: true
                },
                {
                    data: "params.mapping.val_time",
                    type: 'text',
                    width: "100px",
                    readOnly: true
                }
            ];


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
                fixedColumnsLeft: 1,
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
                        var row = changes[m][0], prop = changes[m][1], newVal = changes[m][3];
                        if (typeof prop === 'function') {//checkbox映射
                            var data = stateMap.sheetInstance.getData();
                            var item = data[row];
                            if (newVal === true) {
                                if (stateMap.mappingPoint) {//选择了映射到的现场点
                                    item.params.mapping = {
                                        'point': stateMap.mappingPoint.point_value,
                                        'point_id': stateMap.mappingPoint.point_id
                                    }
                                } else {//没有选择现场点
                                    alert(I18n.resource.debugTools.info.NOT_BIND);
                                    continue;
                                }
                            } else {
                                if (item['params']) {
                                    delete item['params']['mapping'];
                                }
                            }
                            stateMap.changedList[row] = item;
                            stateMap.sheetInstance.render(data);
                        } else if (prop === 'mapping.point') {
                            stateMap.changedList[row] = stateMap.sheetInstance.getData()[row];
                        }
                    }
                },
                currentRowClassName: 'currentRow',
                columns: isSmallScreen ? smallScreenColumns : bigScreenColumns
            });
        }

        stateMap.sheetData = stateMap.sheetInstance.getData();
        jqueryMap.$sheet.off("click").on('click', "tbody td", getPointIndex);
    };
//---------事件---------

    loadPointTable = function () {// 加载点表
        var initPointTable = function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            jqueryMap.$point_undo_btn.on('click', onUndoPoint);
            jqueryMap.$point_redo_btn.on('click', onRedoPoint);
            jqueryMap.$text_search.on('keydown', onSearchTextKeyDown);
            jqueryMap.$point_search.on('keydown', onPointSearchKeyDown);
            jqueryMap.$select_project.change(function () {
                loadSheet();
                doSearchPointInEngine();
            });

            jqueryMap.$search_result.on('click', '.point_selector', onSelectEnginePoint);

            jqueryMap.$display_type.on('click', '.mapped_type', onDisplaySelected);
            jqueryMap.$point_mapping.click(onPointMapping);
            jqueryMap.$import_mapping.change(importSheet);

            jqueryMap.$export_mapping.attr('href', '/point_tool/export/mapping/' + storage.getItem('current_project'));

            //jqueryMap.$energy_section.drags({handle: ".move"});

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
                jqueryMap.$select_project.val(storage.getItem("current_project"));
                loadSheet();
                doSearchPointInEngine();
            }

        };
        $.get(configMap.htmlURL).done(function (result) {
            initPointTable(result);
            autoSave();
            I18n.fillArea(stateMap.$container);
        });
    };

    onSelectEnginePoint = function () {
        var $this = $(this);
        stateMap.mappingPoint = {
            point_value: $this.val(),
            point_id: $this.attr('point-id')
        }
    };

    onImportMapping = function () {

    };

    onUndoPoint = function () {
        stateMap.sheetInstance.undo();
    };

    onRedoPoint = function () {
        stateMap.sheetInstance.redo();
    };

    onDisplaySelected = function () {
        stateMap.mappedType = $(this).val();
        stateMap.currentPage = 1;
        loadSheet();
    };

    onPointSearchKeyDown = function (e) {
        if (e.keyCode === 13) {
            var text = jqueryMap.$point_search.val().trim();
            stateMap.enginePointSearchPage = 1;
            doSearchPointInEngine(text);
        }
    };

    importSheet = function () {
        var fileData = event.target.files[0];
        var formData = new FormData();
        formData.append('file', fileData);
        formData.append('projectId', stateMap.project_id);
        spinner.spin(document.body);
        var _this = $(this);
        $.ajax({
            url: "/point_tool/mapping/import/",
            type: "POST",
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        }).done(function (result) {
            if (!result.success) {
                alert(result.msg);
            } else {
                window.location.reload()
            }
        }).always(function () {
            spinner.stop();
            _this.val(null);
        });
        return false;
    };
    doSearchPointInEngine = function (searchText) {
        if (!searchText) {
            searchText = '';
        }

        configMap.sheetModel.searchEnginePoint(stateMap.project_id, searchText, stateMap.enginePointSearchPage, configMap.enginePointSearchSize).done(function (result) {
            if (result.success) {
                for (var m = 0; m < result.data.pointTable.length; m++) {
                    var point = result.data.pointTable[m];
                    point.value_text = doSearchHighlight(point.value, searchText);
                    if (point.params) {
                        point.params.remark_text = doSearchHighlight(point.params.remark, searchText);
                    } else {
                        point.params.remark_text = '';
                    }
                }
                jqueryMap.$search_result.html(beopTmpl('tpl_search_result', {list: result.data.pointTable}));
                I18n.fillArea(stateMap.$container);
                paginationStatic(result.data.total, 1);
            }
        });
    };

    onSearchTextKeyDown = function (e) {
        if (e.keyCode === 13) {
            stateMap.mappingPoint = null;//清空选择的现场的点
            stateMap.searchText = $(this).val().trim();
            if (stateMap.searchText) {
                location.hash = '#pointMapping/' + (stateMap.searchText ? stateMap.searchText : '') + '/1';
            } else {
                location.hash = '#pointMapping/1';
            }

        }
    };


    getPointIndex = function () {
        stateMap.currentPointIndex = stateMap.sheetInstance.getSelected() ? stateMap.sheetInstance.getSelected()[0] : 0;
    };

    loadSheet = function () {
        var project_id = jqueryMap.$select_project.val();
        stateMap.project_id = project_id;
        jqueryMap.$text_search.val(stateMap.searchText);
        configMap.sheetModel.getMappingSheet(project_id, stateMap.currentPage, configMap.page_size, stateMap.searchText, stateMap.mappedType).done(function (result) {
            if (!result.success) {
                return false;
            }
            stateMap.pointTotal = result.data.pointTotal;
            renderSheet(result.data.pointTable);
            paginationRefresh(result.data.pointTotal);
            storage.setItem("current_project", project_id);
        });
    };

    paginationStatic = function (totalNum, currentPage) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.enginePointSearchSize);
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: currentPage,
            totalPages: !totalPages ? 1 : totalPages,
            onPageClick: function (event, page) {
                if (stateMap.enginePointSearchPage === page) {
                    return;
                }
                stateMap.enginePointSearchPage = page;
                var text = jqueryMap.$point_search.val().trim();
                configMap.sheetModel.searchEnginePoint(stateMap.project_id, text, stateMap.enginePointSearchPage, configMap.enginePointSearchSize).done(function (result) {
                    if (result.success) {
                        for (var m = 0; m < result.data.pointTable.length; m++) {
                            var point = result.data.pointTable[m];
                            point.value_text = doSearchHighlight(point.value, text);
                            if (point.params) {
                                point.params.remark_text = doSearchHighlight(point.params.remark, text);
                            } else {
                                point.params.remark_text = '';
                            }
                        }
                        jqueryMap.$search_result.html(beopTmpl('tpl_search_result', {list: result.data.pointTable}));
                        I18n.fillArea(stateMap.$container);
                        jqueryMap.$enginePointPagination.twbsPagination('show', stateMap.enginePointSearchPage);
                    }
                });
            }
        };
        if (jqueryMap.$enginePointPagination.data('twbs-pagination')) {
            jqueryMap.$enginePointPagination.twbsPagination('destroy');
        }
        jqueryMap.$enginePointPagination.twbsPagination(pageOption);
    };

    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.page_size);
        if (!totalNum) {
            return;
        }

        while (totalPages < stateMap.currentPage && stateMap.currentPage > 1) {
            stateMap.currentPage = stateMap.currentPage - 1;
        }
        var href = '';
        if (stateMap.searchText) {
            href = '#pointMapping/' + (stateMap.searchText ? stateMap.searchText : '') + '/{{number}}';
        } else {
            href = '#pointMapping/{{number}}';
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
            }
        };
        if (href) {
            pageOption['href'] = href;
        }
        if (jqueryMap.$mappingPagination.data('twbs-pagination')) {
            jqueryMap.$mappingPagination.twbsPagination('destroy');
        }
        stateMap.pagination = jqueryMap.$mappingPagination.twbsPagination(pageOption);
    };

    doSearchHighlight = function (bodyText, searchTerm) {
        //var highlightStartTag = "<span class=\"searchterm\">",
        //    highlightEndTag = "</span>";
        //
        //var newText = "";
        //var lSearchTerm = searchTerm.toLowerCase();
        //var lBodyText = bodyText.toLowerCase();
        //var searchTermList = lSearchTerm.split(/\s+/g);
        //
        //for (var m = 0; m < searchTermList.length; m++) {
        //    var searchTermItem = searchTermList[m];
        //
        //}
        return bodyText;
    };


//---------Exports---------
    beop.view = beop.view || {};

    beop.view.pointMapping = {
        configModel: configModel,
        init: init,
        destroy: destroy,
        sheetInstance: stateMap.sheetInstance,
        loadSheet: loadSheet
    };
}(beop || (beop = {})));

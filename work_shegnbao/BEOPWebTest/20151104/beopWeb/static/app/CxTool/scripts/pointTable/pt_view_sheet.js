(function (beop) {
    var configMap = {
            htmlURL: '/static/app/CxTool/views/pointTable.html',
            settable_map: {
                sheetModel: true
            },
            sheetModel: null
        },
        stateMap = {
            sheetInstance: null,
            sheetHeaders: ['Physical ID', '源/类型', '时间', '实时数据', '单位', '读写属性', '参数1', '参数2', '参数3', '参数4', '参数5', '参数6', '参数7', '参数8', '参数9', '参数10', '参数11', '参数12', '参数13', '参数14', '存储周期', '自定义', '系统', '设备', '类型'],
            sheetDataType: {
                source: ['phoenix370', 'simense1200', 'simense300', 'simense1200TCP', 'ab500', 'honeywellebi', 'modbus', 'vpoint', 'bacnet',
                    'protocol104', 'lonworks', 'DB-Access', 'DB-SQLServer', 'DB-Oracle', 'DB-MySQL', 'custom1', 'custom2', 'custom3', 'custom4', 'custom5',
                    'DanfossFCProtocol', 'Insight', 'WinCC1', 'KinCC1', 'KingView1', 'ArchestrA3', 'KEPware4'],
                unit: ['%', 'kPa', '℃', 'h', 'Hz', 'V', 'Kw', 'ls', 'KWh', 'm3/h'],
                rwAttr: ['读', '写'],
                storecycle: ['不存储', '5秒钟', '1分钟', '5分钟', '半小时', '1小时', '1天', '1周（7天）', '1个月', '1年'],
                system: ['无', '暖通', '动力', '照明插座', '精密空调'],
                device: ['无', '冷机', '水泵', '冷却塔', 'AHU', 'VAV', '系统'],
                type: ['无', '电量表', '冷量表', '温度', '流量', '压力', '电流', '功率', '频率', '启停', '报警']
            },
            parameterNameList: [
                [],
                ['OPC变量名', '点类型（VT_BOOL/VT_12/VT_R4...）', '整数映射（0：开；1：关；2：未知）', '倍率（最终值=采集值/倍率）'],
                ['PLC绝对地址', '点类型（VT_BOOL/VT_12/VT_R4...）', '整数映射（0：开；1：关；2：未知）', '倍率（最终值=采集值/倍率）'],
                ['PLC绝对地址', '点类型（VT_BOOL/VT_12/VT_R4...）', 'PLC TCP/IP网络地址', 'slack', 'slot'],
                ['MODBUS 地址号', '点地址号', '功能号（默认03）', '倍率（最终值=采集值/倍率）', 'MOXA IP地址（如192.168.0.1）'],
                ['逻辑语法串（支持）'],
                ['Bacnet Server ID(0-255)', '点类型（AI/AO/BI/BO/AV/BV）', '点相对地址（0-1000）', '倍率（最终值=采集值/倍率）'],
                ['104服务器IP', '104服务器端口', '帧类型号（遥测默认6）', '点号', '发送命令时间间隔', '点值倍率'],
                ['IP地址', '端口', 'PLC地址', '倍率（最终值=采集值/倍率）'],
                ['点名', '点类型（VT_BOOL/VT_12/VT_R4...）']
            ],
            searchIndex: 0,
            currentPointIndex: 0,
            changeList: [],
            isValidate: true
        },
        jqueryMap = {},
        storage, setJqueryMap, configModel, importSheet,
        init, onLoadSheet, onNewPoint, onEditPoint, onDeletePoint, renderSheet, onJumpPointSet,
        onUndoPoint, onRedoPoint, onSearchTextKeyDown, onEditPointConfirm,
        getPointIndex, getParamsInfo, deleteRows, fillTrPointData, isExistPointName, getPointSetting, createChosen,
        validator_point_name, pointSetSubmit, getPointEditParamsInfo, changePointSetTab, reverseSheetDataType,
        define_routes, loadPointSetting, loadPointTable, refreshSourceTypeTableSelector, autoSave,
        onPointUpdateToCore, onAddPointSourceTypeSubmit, onUpdatePointSourceTypeSubmit, refreshSourceTypeSelector,
        onDeletePointType, onUpdateRowConfirm;

    storage = window.localStorage;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {//point_add
            $container: $container,
            $sheet: $container.find('#sheet'),
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
            $pointSetSubmit: $container.find('#pointSetSubmit'),
            $editPointConfirm: $container.find('#editPointConfirm'),
            $point_set_source: $container.find('#point_set_source'),
            $point_setting_edit_ul: $container.find('#point_setting_edit_ul'),
            $point_set_new: $container.find('#point_set_new'),
            $point_set_edit: $container.find('#point_set_edit'),
            $point_set_add_Wrapper: $container.find('#point_set_add_Wrapper'),
            $point_set_edit_Wrapper: $container.find('#point_set_edit_Wrapper'),
            $point_set_edit_name_param: $container.find('#point_set_edit_name_param'),
            $delete_point_list: $container.find('.delete-points'),
            $update_point_list: $container.find('.update-points'),
            $count: $container.find('.count'),
            $add_source_form: $container.find('.add-source-form'),
            $update_source_form: $container.find('.update-source-form'),
            $del_point_type: $container.find('#del-point-type'),
            $point_update: $container.find('#point_update')
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

    init = function ($container) {
        stateMap.$container = $container;
        define_routes();
    };

    //---------DOM操作------


    //---------方法---------
    onPointUpdateToCore = function () {
        var data = stateMap.sheetInstance.getData();
        var update_list = [], update_points = [];
        var selection = stateMap.sheetInstance.getSelected();
        if (!selection) {
            alert('请先选择要下装的点');
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
            update_list.push({
                index: start,
                data: data[start]
            });
            update_points.push(data[start].value);
        }
        jqueryMap.$isUpdatePointWin.modal();
        jqueryMap.$update_point_list.html('');
        jqueryMap.$update_point_list.append(beopTmpl('tpl_delete_point_list', {list: update_list}));
        stateMap.update_list = update_list;
        stateMap.update_points = update_points;
    };

    onUpdateRowConfirm = function () {
        if (!stateMap.update_list.length) {
            return false;
        }
        WebAPI.post('').done(function (result) {

        })
    };

    autoSave = function () {
        setInterval(function () {
            if (stateMap.changeList.length) {
                WebAPI.post('/point_tool/autoSave/' + stateMap.project_id + '/', stateMap.changeList).done(function (result) {
                    if (result.success) {
                        stateMap.changeList = [];
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
            } else {//重复
                stateMap.isValidate = !isExistPointName(value)
            }
            callback(stateMap.isValidate);
        }
    };

    deleteRows = function () { //删除一行或多行
        var delete_list = stateMap.delete_list;
        var delete_points = stateMap.delete_points;
        spinner.spin(document.body);
        $.post('/point_tool/deletePoint/' + stateMap.project_id + '/', {point_list: delete_points}).done(function (result) {
            if (result.success) {
                jqueryMap.$isDelPointWin.modal('hide');
                jqueryMap.$delete_point_list.empty();
                var data = stateMap.sheetInstance.getData();
                delete_list = delete_list.reverse();//先删除最后的防止splice时候index对不上
                for (var n = 0; n < delete_list.length; n++) {
                    data.splice(delete_list[n].index, 1);
                }
                stateMap.sheetInstance.loadData(data);
                stateMap.sheetInstance.render();
                stateMap.delete_list = [];
                stateMap.delete_points = [];
                var delete_points_map = {};
                for (var i = 0; i < delete_points.length; i++) {
                    delete_points_map[delete_points[i]] = 1;
                }

                for (var j = stateMap.sheetData.length - 1; j > -1; j--) {
                    if (delete_points_map[stateMap.sheetData[j].value]) {
                        stateMap.sheetData.splice(j, 1);
                        delete delete_points_map[stateMap.sheetData[j].value];
                    }
                }

            } else {
                alert('删除失败:' + result.msg);
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

    renderSheet = function (data) {
        if (!data) {
            alert('数据为空');
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
                fixedColumnsLeft: 2,
                search: true,
                minSpareRows: 0,
                minSpareCols: 0,
                outsideClickDeselects: false,
                afterRender: function (isForced) {
                    if (isForced) {
                        jqueryMap.$count.text(this.countRows());
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
                            stateMap.changeList.push(stateMap.sheetInstance.getData()[row]);
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
    define_routes = function () { // 路由方法调用

        Path.map("#home").enter(function () {
        }).to(function () {
            loadPointTable();
        }).exit(function () {
        });

        Path.map("#setting").enter(function () {
        }).to(function () {
            if (stateMap.sheetInstance) {
                stateMap.sheetInstance.destroy();
                stateMap.sheetInstance = null;
            }
            loadPointSetting();
        }).exit(function () {
        });

        Path.root("#home");
        Path.listen();
    };


    onJumpPointSet = function () {
        location.hash = "#setting";
    };

    loadPointTable = function () {// 加载点表
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
            jqueryMap.$pointSetSubmit.on('click', pointSetSubmit);
            jqueryMap.$editPointConfirm.on('click', onEditPointConfirm);
            jqueryMap.$point_update.on('click', onPointUpdateToCore);
            jqueryMap.$updateRowConfirm.on('click', onUpdateRowConfirm);
            jqueryMap.$uploadInput.change(importSheet);
            jqueryMap.$select_project.append($('#tpl-all-project-options').html());
            jqueryMap.$select_project.change(onLoadSheet);
            jqueryMap.$point_source.change(getParamsInfo);
            if (storage.getItem("current_project")) {
                jqueryMap.$select_project.val(storage.getItem("current_project"));
                onLoadSheet();
            }
            refreshSourceTypeTableSelector();
        };
        $.when($.get('/point_tool/pointSourceType/getAll'), $.get(configMap.htmlURL)).done(function (sourceTypesResult, resultHtml) {
            if (sourceTypesResult[0].success) {
                stateMap.sourceTypes = sourceTypesResult[0].data;
            } else {
                stateMap.sourceTypes = {};
            }

            initPointTable(resultHtml[0]);
            autoSave();
        });
    };

    loadPointSetting = function () { // 加载点来源配置
        var initPointSetting = function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            jqueryMap.$pointSetSubmit.on('click', pointSetSubmit);
            jqueryMap.$point_set_new.on('click', changePointSetTab);
            jqueryMap.$point_set_edit.on('click', changePointSetTab);
            jqueryMap.$point_set_source.change(getPointEditParamsInfo);
            jqueryMap.$add_source_form.submit(onAddPointSourceTypeSubmit);
            jqueryMap.$update_source_form.submit(onUpdatePointSourceTypeSubmit);
            jqueryMap.$del_point_type.click(onDeletePointType);
            refreshSourceTypeSelector();
        };
        $.when($.get('/point_tool/pointSourceType/getAll'), $.get('/static/app/CxTool/views/pointTypeSet.html')).done(function (sourceTypesResult, resultHtml) {
            if (sourceTypesResult[0].success) {
                stateMap.sourceTypes = sourceTypesResult[0].data;
            } else {
                stateMap.sourceTypes = {};
            }

            initPointSetting(resultHtml[0])
        });
    };

    refreshSourceTypeTableSelector = function () {
        jqueryMap.$point_source.empty().append(beopTmpl('tpl_source_type_options_table', {sourceTypes: stateMap.sourceTypes}));
    };

    refreshSourceTypeSelector = function () {
        jqueryMap.$point_set_source.empty().append(beopTmpl('tpl_source_type_options', {sourceTypes: stateMap.sourceTypes}));
    };

    changePointSetTab = function (e) {
        var $target = $(e.target).closest(".btnWrapper");
        if ($target.attr("id") == "point_set_new") {
            jqueryMap.$point_set_add_Wrapper.show();
            jqueryMap.$point_set_edit_Wrapper.hide();
            jqueryMap.$point_set_new.addClass("active");
            jqueryMap.$point_set_edit.removeClass("active");
        } else {
            jqueryMap.$point_set_add_Wrapper.hide();
            jqueryMap.$point_set_edit_Wrapper.show();
            jqueryMap.$point_set_edit.addClass("active");
            jqueryMap.$point_set_new.removeClass("active");
            getPointEditParamsInfo();
        }
    };

    pointSetSubmit = function () {
        var id = jqueryMap.$container.find(".active").attr("id");
        if (id == "point_set_new") { // 添加点类型
            jqueryMap.$point_setting.find("input").val('');
        } else { // 编辑点类型

        }
    };

    onNewPoint = function () {
        jqueryMap.$editTitle.html("新建点");
        jqueryMap.$pointForm.find("input").val("");
        jqueryMap.$pointForm.find("select").val("-1");
        jqueryMap.$point_id.attr('disabled', false);
        getPointSetting();
        createChosen("new");
        var html = '';
        for (var i = 0; i < 10; i++) {
            html += '<div class="reserveParamWrapper">' +
                '<div class="w150 m_auto">预留参数' + (i + 1) + '</div>' +
                '<input type="text" value="" class="form-control m_auto reserveParamObj" name="param' + (i + 1) + '"/>' +
                '</div>';
        }
        jqueryMap.$pointRelatedWrapper.html(html);
        jqueryMap.$editPointWin.modal();
    };

    onEditPoint = function () {
        jqueryMap.$editTitle.html("编辑点");
        fillTrPointData();
        jqueryMap.$point_id.attr('disabled', true);
        jqueryMap.$editPointWin.modal();
    };

    onEditPointConfirm = function () {
        var pointModel = jqueryMap.$pointForm.serializeObject();
        $.post('/point_tool/addPoint/' + stateMap.project_id + '/', pointModel).done(function (result) {
            if (result.success) {
                alert('添加成功');
                var data = stateMap.sheetInstance.getData();
                data.push(result.data);
                stateMap.sheetInstance.loadData(data);
                stateMap.sheetInstance.render();
            } else {
                alert('添加失败:' + result.msg);
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
            alert('请先选择要删除的点');
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
        jqueryMap.$delete_point_list.append(beopTmpl('tpl_delete_point_list', {list: delete_list}));
        stateMap.delete_list = delete_list;
        stateMap.delete_points = delete_points;
    };

    onUndoPoint = function () {
        stateMap.sheetInstance.undo();
    };

    onRedoPoint = function () {
        stateMap.sheetInstance.redo();
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
            spinner.spin(document.body);
            var queryData = [];
            if (!this.value) {
                queryData = stateMap.sheetData;
            } else {
                stateMap.sheetInstance.loadData(stateMap.sheetData);
                var queryResult = stateMap.sheetInstance.search.query(this.value);
                var searchResultMap = {};
                for (var m = 0, len = queryResult.length; m < len; m++) {
                    searchResultMap[queryResult[m].row] = queryResult[m];
                }

                for (var n = 0, n_len = stateMap.sheetData.length; n < n_len; n++) {
                    if (searchResultMap[n]) {
                        queryData.push(stateMap.sheetData[n]);
                    }
                }
            }
            stateMap.sheetInstance.loadData(queryData);
            stateMap.sheetInstance.render();
            spinner.stop();
        }
    };

    getPointIndex = function () {
        stateMap.currentPointIndex = stateMap.sheetInstance.getSelected() ? stateMap.sheetInstance.getSelected()[0] : 0;
    };

    fillTrPointData = function () { // 点击编辑加载当前行的数据
        getPointSetting();
        createChosen("edit");
        var data = stateMap.sheetData[stateMap.currentPointIndex];
        jqueryMap.$point_id.val(data.value);
        jqueryMap.$point_source.val(data.params.source);
        jqueryMap.$point_notes.val(data.params.note);
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
    };

    getPointSetting = function () {
        var html = "";
        jqueryMap.$point_bind_set.html("");
        var physical_id_val = stateMap.sheetInstance.getData()[stateMap.currentPointIndex].value;
        for (var i = 0; i < stateMap.sheetData.length; i++) {
            if (stateMap.sheetData[i][1] == physical_id_val) {
                html += '<option selected="selected" value="' + physical_id_val + '">' + stateMap.sheetData[i].value + '</option>';
            } else {
                html += '<option value="' + stateMap.sheetData[i].value + '">' + stateMap.sheetData[i].value + '</option>';
            }
        }
        jqueryMap.$point_bind_set.html(html);
        if ($(".chosen-container").length > 0) {
            jqueryMap.$point_bind_set.chosen("destroy");
        }
        jqueryMap.$point_bind_set.chosen({width: "100%", search_contains: true});
    };

    createChosen = function (str) {
        if ($(".chosen-container").length > 0) {
            jqueryMap.$point_bind_set.chosen("destroy");
        }
        if (str == "new") {
            jqueryMap.$point_bind_set.find("option[value='" + stateMap.sheetData[0][1] + "']").attr("selected", "selected");
        }
        jqueryMap.$point_bind_set.chosen({width: "100%", search_contains: true});
    };

    onLoadSheet = function () {
        var project_id = jqueryMap.$select_project.val();
        stateMap.project_id = project_id;
        configMap.sheetModel.getSheet(project_id).done(function (result) {
            if (!result.success) {
                return false;
            }

            renderSheet(result.data.pointTable);
            storage.setItem("current_project", project_id);
        });
        jqueryMap.$point_export.attr('href', '/point_tool/export/' + project_id);
    };

    importSheet = function (event) {
        var fileData = event.target.files[0];
        var formData = new FormData();
        formData.append('file', fileData);
        formData.append('projectId', stateMap.project_id);
        formData.append('userId', 68);
        spinner.spin(document.body);
        $.ajax({
            url: "/point_tool/import/",
            type: "POST",
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        }).done(function (result) {
            if (!result.success) {
                alert('导入失败');
            }
            renderSheet(result.data);
        }).always(function () {
            spinner.stop();
        });
        return false;
    };

    onAddPointSourceTypeSubmit = function () {
        $.post('/point_tool/pointSourceType/add/', $(this).serializeObject()).done(function (result) {
            if (result.success) {
                alert('添加成功');
                stateMap.sourceTypes[result.data.name] = result.data.params;
                refreshSourceTypeSelector();
            } else {
                alert(result.msg);
            }
        });
        return false;
    };

    onUpdatePointSourceTypeSubmit = function () {
        $.post('/point_tool/pointSourceType/update/', $(this).serializeObject()).done(function (result) {
            if (result.success) {
                alert('更新成功');
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
                alert('删除成功');
                delete stateMap.sourceTypes[typeName];
                refreshSourceTypeSelector();
                jqueryMap.$point_set_source.trigger('change');
            } else {
                alert('删除失败');
            }
        })
    };

//---------Exports---------
    beop.view = beop.view || {};

    beop.view.sheet = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

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
            sheetHeaders: ['选择', 'Physical ID', '源/类型', '单位', '读写属性', '存储周期', '自定义', '系统', '设备', '类型'],
            sheetDataType: {
                source: ['phoenix370', 'simense1200', 'simense300', 'simense1200TCP', 'ab500', 'honeywellebi', 'modbus', 'vpoint', 'bacnet',
                    'protocol104', 'lonworks', 'DB-Access', 'DB-SQLServer', 'DB-Oracle', 'DB-MySQL', 'custom1', 'custom2', 'custom3', 'custom4', 'custom5',
                    'DanfossFCProtocol', 'Insight', 'WinCC1', 'KinCC1', 'KingView1', 'ArchestrA3', 'KEPware4'],
                unit: ['%', 'kPa', '℃', 'h', 'Hz', 'V', 'Kw', 'ls', 'KWh', 'm3/h'],
                rwAttr: ['读', '写'],
                storagePeriod: ['不存储', '5秒钟', '1分钟', '5分钟', '半小时', '1小时', '1天', '1周（7天）', '1个月', '1年'],
                system: ['无', '暖通', '动力', '照明插座', '精密空调'],
                equipment: ['无', '冷机', '水泵', '冷却塔', 'AHU', 'VAV', '系统'],
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
            currentPointIndex: 0
        },
        jqueryMap = {},
        storage,
        setJqueryMap, pointParameterMapping,
        configModel,
        importSheet,
        init, onLoadSheet, onNewPoint, onEditPoint, onDeletePoint, handleDataToExcel, typeConvert, renderSheet, onJumpPointSet,
        onUndoPoint, onRedoPoint, onSearchTextKeyDown, onEditPointConfirm,
        getPointIndex, getParamsInfo, deleteRows,
        fillTrPointData, isExistPointName,
        validator_point_name,
        pointSetSubmit, searchCallBack,
        getPointEditParamsInfo, changePointSetTab,
        define_routes, loadPointSetting, loadPointTable;

    storage = window.localStorage;

    pointParameterMapping = {
        "phoenix370": stateMap.parameterNameList[1],
        "simense1200": stateMap.parameterNameList[2],
        "simense300": stateMap.parameterNameList[2],
        "simense1200TCP": stateMap.parameterNameList[3],
        "simense300TCP": stateMap.parameterNameList[3],
        "ab500": stateMap.parameterNameList[1],
        "honeywellebi": stateMap.parameterNameList[1],
        "modbus": stateMap.parameterNameList[4],
        "vpoint": stateMap.parameterNameList[5],
        "bacnet": stateMap.parameterNameList[6],
        "protocol104": stateMap.parameterNameList[7],
        "lonworks": stateMap.parameterNameList[0],
        "DB-Access": stateMap.parameterNameList[0],
        "DB-SQLServer": stateMap.parameterNameList[0],
        "DB-Oracle": stateMap.parameterNameList[0],
        "DB-MySQL": stateMap.parameterNameList[0],
        "custom1": stateMap.parameterNameList[0],
        "custom2": stateMap.parameterNameList[0],
        "custom3": stateMap.parameterNameList[0],
        "custom4": stateMap.parameterNameList[0],
        "custom5": stateMap.parameterNameList[0],
        "DanfossFCProtocol": stateMap.parameterNameList[8],
        "Insight": stateMap.parameterNameList[9],
        "WinCC1": stateMap.parameterNameList[9],
        "KinCC1": stateMap.parameterNameList[9],
        "KingView1": stateMap.parameterNameList[9],
        "ArchestrA3": stateMap.parameterNameList[9],
        "KEPware4": stateMap.parameterNameList[9]
    };
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {//point_add
            $container: $container,
            $sheet: $container.find('#sheet'),
            $editPointWin: $container.find('#editPointWin'),
            $isDelPointWin: $container.find('#isDelPointWin'),
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
            $point_max: $container.find('#point_max'),
            $point_min: $container.find('#point_min'),
            $point_jurisdiction: $container.find('#point_jurisdiction'),
            $point_storage_period: $container.find('#point_storage_period'),
            $point_custom: $container.find('#point_custom'),
            $point_system: $container.find('#point_system'),
            $point_equipment: $container.find('#point_equipment'),
            $point_type: $container.find('#point_type'),
            $point_export: $container.find('#point_export'),
            $pointRelatedWrapper: $container.find('#pointRelatedWrapper'),
            $deleteRowConfirm: $container.find('#deleteRowConfirm'),
            $editTitle: $container.find('#editTitle'),
            $pointForm: $container.find('#pointForm'),
            $point_setting_form: $container.find('#point_setting_form'),
            $pointSetSubmit: $container.find('#pointSetSubmit'),
            $editPointConfirm: $container.find('#editPointConfirm'),
            $point_set_source: $container.find('#point_set_source'),
            $point_setting_edit_ul: $container.find('#point_setting_edit_ul'),
            $point_set_new: $container.find('#point_set_new'),
            $point_set_edit: $container.find('#point_set_edit'),
            $point_set_add_Wrapper: $container.find('#point_set_add_Wrapper'),
            $point_set_edit_Wrapper: $container.find('#point_set_edit_Wrapper'),
            $point_set_edit_name_param: $container.find('#point_set_edit_name_param'),
            $delete_point_list: $container.find('.points'),
            $count: $container.find('.count')
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
    searchCallBack = function (instance, row, col, value, result) {
        Handsontable.Search.DEFAULT_CALLBACK.apply(this, arguments);

        if (result) {
        }
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
                callback(false);
            } else {//重复
                callback(!isExistPointName(value));
            }
        }
    };

    typeConvert = function (typeList, typeIndex) {
        return typeList[typeIndex];
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

                for (var j = stateMap.sheetData.length - 1; j > 0; j--) {
                    if (delete_points_map[stateMap.sheetData[j][1]]) {
                        stateMap.sheetData.splice(j, 1);
                        delete delete_points_map[stateMap.sheetData[j][1]];
                    }
                }

            } else {
                alert('删除失败:' + result.msg);
            }
        }).always(function () {
            spinner.stop();
        });
    };

    handleDataToExcel = function (data) {
        if (!data) {
            return [];
        }
        var result = [];
        for (var m = 0; m < data.length; m++) {
            var item = data[m];
            var source = item.params.source,
                Unit = typeConvert(stateMap.sheetDataType.unit, item.params.Unit),
                RWProperty = typeConvert(stateMap.sheetDataType.rwAttr, item.params.RWProperty),
                storecycle = typeConvert(stateMap.sheetDataType.storagePeriod, item.params.storecycle),
                customName = item.params.customName,
                system = typeConvert(stateMap.sheetDataType.system, item.params.system),
                device = typeConvert(stateMap.sheetDataType.equipment, item.params.device),
                type = typeConvert(stateMap.sheetDataType.type, item.params.type);
            result.push([0, item['value'], source, Unit, RWProperty,
                storecycle, customName, system,
                device, type]);
        }
        return result;
    };

    renderSheet = function (data) {
        var toRenderData = handleDataToExcel(data);
        if (stateMap.sheetInstance) {
            stateMap.sheetInstance.loadData(toRenderData);
        } else {
            stateMap.sheetInstance = new Handsontable(jqueryMap.$sheet.get(0), {
                data: toRenderData,
                colHeaders: stateMap.sheetHeaders,
                rowHeaders: true,
                manualColumnResize: true,
                manualRowResize: true,
                stretchH: 'all',
                persistentState: true,
                autoWrapCol: true,
                autoWrapRow: true,
                search: {
                    callback: searchCallBack
                },
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
                afterSelectionEnd: function (r, c, r2, c2) {

                },
                currentRowClassName: 'currentRow',
                columns: [
                    {
                        type: 'checkbox',
                        checkedTemplate: 1,
                        uncheckedTemplate: 0
                    },
                    {
                        type: 'text',
                        validator: validator_point_name // validator function defined elsewhere
                    },
                    {
                        type: 'dropdown',
                        source: stateMap.sheetDataType.source,
                        allowInvalid: false
                    },
                    {
                        type: 'dropdown',
                        source: stateMap.sheetDataType.unit,
                        allowInvalid: false
                    },
                    {
                        type: 'dropdown',
                        source: stateMap.sheetDataType.rwAttr,
                        allowInvalid: false
                    },
                    {
                        type: 'dropdown',
                        source: stateMap.sheetDataType.storagePeriod,
                        allowInvalid: false
                    },
                    {},
                    {
                        type: 'dropdown',
                        source: stateMap.sheetDataType.system,
                        allowInvalid: false
                    },
                    {
                        type: 'dropdown',
                        source: stateMap.sheetDataType.equipment,
                        allowInvalid: false
                    },
                    {
                        type: 'dropdown',
                        source: stateMap.sheetDataType.type,
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
            console.log("enter-home");
        }).to(function () {
            console.log("to-home");
            stateMap.sheetInstance = null;
            loadPointTable();
        }).exit(function () {
            console.log("exit-home");
        });

        Path.map("#setting").enter(function () {
            console.log("enter-setting");
        }).to(function () {
            loadPointSetting();
        }).exit(function () {
            console.log("exit-setting");
        });

        Path.root("#home");
        Path.listen();
    };


    onJumpPointSet = function () {
        location.hash = "#setting";
    };

    loadPointTable = function () {// 加载点表
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
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
            jqueryMap.$uploadInput.change(importSheet);
            jqueryMap.$select_project.append($('#tpl-all-project-options').html());
            jqueryMap.$select_project.change(onLoadSheet);
            jqueryMap.$point_source.change(getParamsInfo);
            if (storage.getItem("current_project")) {
                jqueryMap.$select_project.val(storage.getItem("current_project"));
                onLoadSheet();
            }
        });
    };

    loadPointSetting = function () { // 加载点来源配置
        WebAPI.get('/static/app/CxTool/views/pointTypeSet.html').done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            jqueryMap.$pointSetSubmit.on('click', pointSetSubmit);
            jqueryMap.$point_set_new.on('click', changePointSetTab);
            jqueryMap.$point_set_edit.on('click', changePointSetTab);
            jqueryMap.$point_set_source.change(getPointEditParamsInfo);
        });
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
            jqueryMap.$point_setting_form.find("input").val('');
        } else { // 编辑点类型

        }
    };

    onNewPoint = function () {
        jqueryMap.$editTitle.html("新建点");
        jqueryMap.$pointForm.find("input").val("");
        jqueryMap.$pointForm.find("select").val("-1");
        jqueryMap.$point_id.attr('disabled', false);
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
                var newData = handleDataToExcel([result.data]);
                var data = stateMap.sheetInstance.getData();
                data = data.concat(newData);
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
        for (var m = 0, data_length = data.length; m < data_length; m++) {
            if (data[m][0] === 1) {
                delete_list.push({
                    index: m,
                    data: data[m]
                });
                delete_points.push(data[m][1]);
            }
        }

        if (!delete_list.length) {
            var selection = stateMap.sheetInstance.getSelected();
            for (var start = selection[0], end = selection[2] + 1; start < end; start++) {
                delete_list.push({
                    index: start,
                    data: data[start]
                });
                delete_points.push(data[start][1]);
            }
        }

        if (!delete_list.length) {
            alert('请先选择要删除的点');
            return false;
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
        var html = "";
        for (var prop in pointParameterMapping) {
            if (prop == val) {
                var arrL = pointParameterMapping[prop].length;
                if (arrL == 0) {
                    for (var i = 0; i < 10; i++) {
                        html += '<div class="reserveParamWrapper">' +
                            '<div class="w150 m_auto">预留参数' + (i + 1) + '</div>' +
                            '<input type="text" value="" class="form-control m_auto reserveParamObj" name="param' + (i + 1) + '"/>' +
                            '</div>';
                    }
                } else {
                    for (var i = 0; i < arrL; i++) {
                        html += '<div class="reserveParamWrapper">' +
                            '<div class="w150 ellipsis m_auto" title="' + pointParameterMapping[prop][i] + '">' + pointParameterMapping[prop][i] + '</div>' +
                            '<input type="text" value="" class="form-control m_auto reserveParamObj" name="param' + (i + 1) + '"/>' +
                            '</div>';
                    }
                }
            }
        }
        jqueryMap.$pointRelatedWrapper.html(html);
    };

    getPointEditParamsInfo = function () {
        var val = $.trim(jqueryMap.$point_set_source.find("option:selected").val());
        var html = "";
        for (var prop in pointParameterMapping) {
            if (prop == val) {
                var arrL = pointParameterMapping[prop].length;
                for (var i = 0; i < 10; i++) {
                    if (i < arrL) {
                        html += '<li>' +
                            '<span class="title">param' + (i + 1) + ':</span>' +
                            '<input type="text" placeholder="请输入点表类型参数名" value="' + pointParameterMapping[prop][i] + '" class="form-control" name="param' + (i + 1) + '"/>' +
                            '</div>';
                    } else {
                        html += '<li>' +
                            '<span class="title">param' + (i + 1) + ':</span>' +
                            '<input type="text" placeholder="请输入点表类型参数名" value="" class="form-control" name="param' + (i + 1) + '"/>' +
                            '</div>';
                    }
                }
            }
        }
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
        jqueryMap.$point_equipment.val(data.params.device);
        jqueryMap.$point_system.val(data.params.system);
        jqueryMap.$point_type.val(data.params.type);

        if (parseInt(data.params.param14) === 1) {
            jqueryMap.$point_jurisdiction.attr("checked", true);
        } else {
            jqueryMap.$point_jurisdiction.attr("checked", false);
        }

        getParamsInfo();

        var $reserveParamWrapper = jqueryMap.$pointRelatedWrapper.find(".reserveParamObj");
        for (var i = 0; i < $reserveParamWrapper.length; i++) {
            $reserveParamWrapper.eq(i).val(data.params['param' + (i + 1)]);
        }
    };

    onLoadSheet = function () {
        var project_id = jqueryMap.$select_project.val();
        stateMap.project_id = project_id;
        configMap.sheetModel.getSheet(project_id).done(function (result) {
            if (!result.success) {
                return false;
            }
            renderSheet(result.data);
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

//---------Exports---------
    beop.view = beop.view || {};

    beop.view.sheet = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

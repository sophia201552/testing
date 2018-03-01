(function (exports) {
    class PointsTable extends exports.BaseView {

        constructor($container) {
            super($container);
            this.html = '/static/scripts/modbus/views/mb.pointsTable.html';
            this.i18n = I18n.resource.modBus.info;
            this.dtuTime = 60000;
            this.stateMap = {
                currentPage: 1,
                pageSize: 10
            };
        }

        init(treeNode) {
            let _this = this;
            super.init().done(function () {
                if (treeNode && treeNode.id) {
                    _this.treeNode = treeNode;
                    _this.dtuId = treeNode.id;
                    _this.loadSheet();
                    $("#point_export").attr('href', '/modbus/dtu/export/cloud/' + AppConfig.projectId + '/' + _this.dtuId);
                } else {
                    var $pointsTableBox = $("#terminalPointsTableBox");
                    if ($pointsTableBox.length) {
                        $pointsTableBox.empty().html(beopTmpl('modbus_new_equipment'));
                    }
                }

                I18n.fillArea($('#modbusContainer'));
                _this._attachEvent();
            });
        }

        _attachEvent() {
            let _this = this;
            $("#modbusContainer").off('click.mbPointHistory').on('click.mbPointHistory', '#mbPointHistory', function () {
                new beop.mb.History($("#modBusDialog")).init();
            }).off('change.selectDtuType').on('change.selectDtuType', '#selectDtuType', function () {
                let $win = $("#modbus_tree_edit"),
                    type = $("#selectDtuType").val();
                $("#createDeviceFailMsg").text('').hide();
                $win.find('form').hide();
                $win.find('form[formType = ' + type + ']').show();
            }).off('click.point_import').on('click.point_import', '#point_import', function () {
                if ($("#point_import").closest('.auto-searching').length) { // obix 自动搜索中不能导入
                    return;
                }
                var $modal = $('#export_point_modal');
                //$("#exportLocalFileText").text('');
                $('#namePrefixText').text($.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0].prefix);
                $modal.modal();
            }).off('click.mbPointLog').on('click.mbPointLog', '#mbPointLog', function () {
                new beop.mb.History($("#modBusHistoryLog")).historyLog();
            }).off('click.mbPointAdd').on('click.mbPointAdd', '#mbPointAdd', function () {
                _this.mbPointAdd();
            }).off('click.mbPointAddConfirm').on('click.mbPointAddConfirm', '#mbPointAddConfirm', function () {
                _this.mbPointAddConfirm();
            }).off('click.mbPointDelete').on('click.mbPointDelete', '#mbPointDelete', function () {
                _this.mbPointsDelete();
            }).off('click.mbAllPointsDelete').on('click.mbAllPointsDelete', '#mbAllPointsDelete', function () {
                _this.mbAllPointsDelete();
            }).off('change.mbDataType').on('change.mbDataType', '#mbDataType', function () {
                var val = parseInt($(this).val()), $dataLengthInput = $("#dataLengthInput");
                $dataLengthInput.attr('dataType', '');
                if (val == 0 || val == 1) {
                    $dataLengthInput.val(1).attr('readonly', true).removeAttr('placeholder');
                } else if (val == 2) {
                    $dataLengthInput.val('').removeAttr('readonly').attr({
                        'placeholder': _this.i18n.DATA_LENGTH_CHECK1,
                        'maxlength': 2,
                        'dataType': 'bite'
                    });
                } else if (val == 3 || val == 4 || val == 5 || val == 6) {
                    $dataLengthInput.val(2).attr('readonly', true).removeAttr('placeholder');
                } else if (val == 7 || val == 8) {
                    $dataLengthInput.val(4).attr('readonly', true).removeAttr('placeholder');
                } else if (val == 9 || val == 10) {
                    $dataLengthInput.val('').removeAttr('readonly').attr({
                        'placeholder': _this.i18n.DATA_LENGTH_CHECK2,
                        'maxlength': 100,
                        'dataType': 'string'
                    });
                }
            }).off('change.equipName').on('change.equipName', '.equipName', function () {
                let $form = $(this).closest('form'),
                    nameVal = $(this).val().trim();
                $form.find('.dtuPrefix').val(nameVal.length > 4 ? nameVal.substring(0, 4) : nameVal);
            }).off('click.new-equipment').on('click.new-equipment', '#new-equipment', function () {
                let $win = $("#modbus_tree_edit");
                $("#edit_content").html(beopTmpl('mod_edit_tree_content'));
                $win.find('form[formType = obix]').show();
                I18n.fillArea($win);
                $win.modal();
            }).off('click.addDtuNode').on('click.addDtuNode', '#addDtuNode', function () {
                let type = $("#selectDtuType").val();
                if (type == 'modbus') {
                    _this.createDeviceForModbus();
                } else if (type == 'obix') {
                    _this.createDeviceForObix();
                }
            }).off('click.updateDtuNode').on('click.updateDtuNode', '#updateDtuNode', function () {
                let treeNode = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0];
                let $updateWin = $("#editTerminalPrefixWin"),
                    val = $updateWin.find(".dtuPrefix").val().trim();
                if (!val) {
                    alert(_this.i18n.ENTER_DATA_PREFIX);
                    return;
                }
                WebAPI.post('/modbus/dtu/prefixName/update', {
                    dtuId: treeNode.id,
                    projId: AppConfig.projectId,
                    prefix: val
                }).done(function (res) {
                    if (res.success) {
                        treeNode.prefix = val;
                        alert(_this.i18n.MODIFY_NAME_PREFIX_SUCCESSFULLY);
                        $("#editTerminalPrefixWin").modal('hide');
                        $("#" + treeNode.tId + '_a').click();
                    } else {
                        alert(res.msg);
                    }
                }).fail(function (e) {
                    console.log(e);
                });
            }).off('click.copy-already').on('click.copy-already', '#copy-already', function () {
                let dtuList = [],
                    treeInstance = $.fn.zTree.getZTreeObj("mb_dtu_list_ul"),
                    nodes = treeInstance.getNodes()[0].children;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    if (node.flag && node.type == 'modbus') {
                        dtuList.push({
                            name: node.originalName,
                            id: node.id
                        });
                    }
                }
                $("#copyFromOtherBox").html(beopTmpl('mb_copy_form_one', {
                    dtuList: dtuList
                }));
                let $box = $("#copyFromOtherTpl");
                I18n.fillArea($box);
                $box.modal('show');
            }).off('click.copyFromOther').on('click.copyFromOther', '#copyFromOther', function () {
                var sourceId = parseInt($("#copyFromOtherTpl").find('.dtu-name:checked').attr('dtuId')),
                    targetNode = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0],
                    targetId = targetNode.id;
                if (!sourceId) {
                    alert(_this.i18n.SELECT_A_POINT);
                    return;
                }
                WebAPI.post('/modbus/dtu/copy', {
                    dtuId: sourceId,
                    dtuTarget: targetId
                }).done(function (res) {
                    if (res.success) {
                        alert(_this.i18n.SUCCESS_IN_REPLICATION);
                        $("#copyFromOtherTpl").modal('hide');
                        targetNode.flag = true;
                        $("#" + targetNode.tId + '_a').click();
                    } else {
                        alert(res.msg);
                    }
                }).fail(function (e) {
                    alert(e);
                });
            }).off('click.copyToOthers').on('click.copyToOthers', '#copyToOthers', function () {
                let $win = $("#modbus_tree_copy"),
                    $item = $win.find('.dtu-name:checked'),
                    targetList = [];
                for (var i = 0; i < $item.length; i++) {
                    targetList.push($item.eq(i).attr('dtuId'));
                }
                if (!targetList.length) {
                    alert(_this.i18n.MIN_ONE_DEVICE);
                    return;
                }
                let dtuId = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0].id;
                confirm(_this.i18n.COPY_PROMPT, function () {
                    Spinner.spin(document.body);
                    WebAPI.post('/modbus/copy/dtus', {
                        dtuId: dtuId,
                        targetList: targetList
                    }).done(function (result) {
                        if (result.success) {
                            alert(_this.i18n.COPY_SUCCESSFULLY);
                            let allNodes = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getNodes()[0].children;
                            for (var i = 0; i < allNodes.length; i++) {
                                var node = allNodes[i];
                                if (($.inArray(node.id.toString(), targetList) !== -1)) {
                                    node.flag = true;
                                }
                            }
                            $("#modbus_tree_copy").modal('hide');
                        } else {
                            alert(result.msg);
                            Spinner.stop();
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                });

            }).off('click.export-point').on('click.export-point', '#export-point', function () {
                $("#namePrefixText").text($.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0].prefix);
                //$("#exportLocalFileText").text('');
                $('#export_point_modal').modal();
            }).off('click.handle-type').on('click.handle-type', '#handle-type', function () {
                _this.mbPointAdd();
            });
        }

        createDeviceForModbus() {
            let $form = $("#createDeviceForModbusForm"),
                prefixVal = $form.find(".dtuPrefix").val().trim(),
                //$dtuName = $form.find(".dtuName"),
                equipNameVal = $form.find(".equipName").val().trim();
            if (!equipNameVal) {
                alert(this.i18n.EQUIP_NAME_NOT_NULL);
                return;
            }
            if (!prefixVal) {
                alert(this.i18n.PREFIX_NOT_NULL);
                return;
            }
            this.createDeviceRequest({
                projId: AppConfig.projectId,
                type: 'modbus',
                //name: $dtuName.text(),
                equipName: equipNameVal,
                prefix: prefixVal
                //prefix: prefixVal || $dtuName.text()
            }, {
                url: '/modbus/dtu/create',
                dtuType: 'modbus'
            });
        }

        createDeviceForObix() {
            let $form = $("#createDeviceForObixForm"),
                urlVal = $form.find("[name=url]").val().trim(),
                userNameVal = $form.find("[name=userName]").val().trim(),
                pwdVal = $form.find("[name=pwd]").val().trim(),
                prefixVal = $form.find("[name=dtuPrefix]").val().trim(),
                equipNameVal = $form.find("[name=equipName]").val().trim();
            if (!urlVal) {
                alert('Ip 或域名注不能为空');
                return;
            }
            if (!userNameVal) {
                alert('用户名不能为空');
                return;
            }
            if (!pwdVal) {
                alert('密码不能为空');
                return;
            }
            if (!equipNameVal) {
                alert(this.i18n.EQUIP_NAME_NOT_NULL);
                return;
            }
            if (!prefixVal) {
                alert(this.i18n.PREFIX_NOT_NULL);
                return;
            }
            this.createDeviceRequest({
                projId: AppConfig.projectId,
                type: 'obix',
                url: urlVal,
                userName: userNameVal,
                pwd: pwdVal,
                equipName: equipNameVal,
                prefix: prefixVal
            }, {
                url: 'terminal/obix/dtu/create',
                dtuType: 'obix'
            });
        }

        createDeviceRequest(postData, otherMap) {
            let _this = this,
                $editWin = $("#modbus_tree_edit");
            WebAPI.post(otherMap.url, postData).done(function (res) {
                if (res.success) {
                    let statusHtml = '<span class="status-box">' +
                        '<span class="status-icon status-offline">disconnect</span>' +
                            //'<span class="status-icon status-stop">off</span>' +
                        '</span>';
                    _this.zTreeInstance = $.fn.zTree.getZTreeObj("mb_dtu_list_ul");
                    let treeMap = {
                            originalName: res.data.name,
                            name: res.data.equipName + statusHtml,
                            id: res.data.id,
                            prefix: res.data.prefix
                        };
                    if (otherMap.dtuType == 'modbus') {
                        treeMap.type = 'modbus';
                    } else if (otherMap.dtuType == 'obix')  {
                        treeMap.type = 'obix';
                        confirm('是否开始自动搜索', function () {
                            WebAPI.post('terminal/obix/dtu/autoSearch/start', {
                                'dtuId': res.data.id
                            }).done(function (result) {
                                if (!result.success) {
                                    alert(result.msg);
                                }
                            }).fail(function () {
                                alert('开始自动搜索出错');
                            }).always(function () {
                                Spinner.stop();
                            });
                        });
                    }

                    _this.zTreeInstance.addNodes(_this.zTreeInstance.getNodes()[0], treeMap);
                    let $lastTreeNode = $("#mb_dtu_list_ul").find('li:last');
                    $editWin.modal('hide');
                    $lastTreeNode.removeClass('modbus').removeClass('obix').addClass(res.data.type);
                    $lastTreeNode.find('a').click();
                } else {
                    $("#createDeviceFailMsg").text(res.msg).show();
                }
            }).fail(function (e) {
                console.log(e);
            });
        }

        loadSheet() {
            let _this = this,
                dtuId = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0].id;
            var dataTableOptions = {
                url: '/modbus/dtu/list',
                post: WebAPI.post,
                postData: {
                    projId: AppConfig.projectId,
                    dtuId: dtuId,
                    searchText: '',
                    pageSize: this.stateMap.pageSize, // 一页多少个
                    pageNum: this.stateMap.currentPage // 当前第几页
                },
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'pageNum'
                },
                searchInput: $("#text_search"),
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: 1,
                rowIdKey: 'pointId',
                dataFilter: function (result) {
                    if (result.success) {
                        _this.pointList = [];
                        if (result.data && result.data.list) {
                            _this.pointList = result.data.list;
                        }
                        return _this.pointList;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin(document.body);
                },
                onAfterRender: function () {
                    Spinner.stop();
                    _this.refreshTableItem();
                    exports.pointStatusTimer && clearInterval(exports.pointStatusTimer);
                    exports.pointStatusTimer = setInterval(function () {
                        _this.refreshTableItem();
                    }, _this.dtuTime);
                },
                totalNumIndex: 'data.total',
                onRowDbClick: function (tr, data) {
                    let $form = $("#mbPointAddForm");
                    let treeNode = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0],
                        index = treeNode.prefix.length + 1; // 前缀名+'_'
                    _this.pointUpdateType = 'update';
                    _this.pointId = data.pointId;
                    $form[0].reset();
                    for (var prop in data) {
                        var $formDom = $form.find('[name = "' + prop + '"]');
                        if ($formDom.length) {
                            if (prop == 'pointName') {
                                $formDom.val(data[prop].slice(index));
                            } else {
                                $formDom.val(data[prop]);
                            }
                        }
                    }
                    $("#updateNodeTitle").text(_this.i18n.EDIT_POINT);
                    $("#mbPointAddWin").modal({
                        backdrop: 'static'
                    });
                },
                colNames: [
                    I18n.resource.modBus.pointHeader.NAME,
                    I18n.resource.modBus.pointHeader.POINT_VALUE,
                    I18n.resource.modBus.pointHeader.UPDATE_TIME,
                    I18n.resource.modBus.pointHeader.TYPE,
                    I18n.resource.modBus.pointHeader.REMARK,
                    I18n.resource.modBus.pointHeader.SLAVE_ID,
                    I18n.resource.modBus.pointHeader.ADDRESS,
                    I18n.resource.modBus.pointHeader.FUNCTION_CODE,
                    I18n.resource.modBus.pointHeader.MULTIPLE,
                    I18n.resource.modBus.pointHeader.DATA_TYPE,
                    I18n.resource.modBus.pointHeader.DATA_LENGTH,
                    I18n.resource.modBus.pointHeader.REFRESH_CYCLE
                ],
                colModel: [
                    {index: 'pointName', width: '200px'},
                    {index: ''},
                    {index: '', width: '150px'},
                    {index: 'pointType'},
                    {index: 'note'},
                    {index: 'slaveId'},
                    {index: 'address'},
                    {
                        index: 'functionCode', width: '120px', converter: function (value, row) {
                        var str = '';
                        switch (value.toString()) {
                            case '1':
                            {
                                str = '01 Read Coils (0x)';
                                break;
                            }
                            case '2':
                            {
                                str = '02 Read Discrete Inputs(1x)';
                                break;
                            }
                            case '3':
                            {
                                str = '03 Read Holding Registers(4x)';
                                break;
                            }
                            case '4':
                            {
                                str = '04 Read Input Registers(3x)';
                                break;
                            }
                            case '5':
                            {
                                str = '05 Write Single Coil';
                                break;
                            }
                            case '6':
                            {
                                str = '06 Write Single Register';
                                break;
                            }
                            case '15':
                            {
                                str = '15 Write Multiple Coils';
                                break;
                            }
                            case '16':
                            {
                                str = '16 Write Multiple Registers';
                                break;
                            }
                        }
                        return str;
                    }
                    },
                    {index: 'multiple'},
                    {
                        index: 'dataType', converter: function (value, row) {
                        var str = '';
                        switch (value.toString()) {
                            case '0':
                            {
                                str = 'Signed';
                                break;
                            }
                            case '1':
                            {
                                str = 'UnSigned';
                                break;
                            }
                            case '2':
                            {
                                str = 'Bite';
                                break;
                            }
                            case '3':
                            {
                                str = 'Long';
                                break;
                            }
                            case '4':
                            {
                                str = 'Long Inverse';
                                break;
                            }
                            case '5':
                            {
                                str = 'Float';
                                break;
                            }
                            case '6':
                            {

                                str = 'Float Inverse';
                                break;
                            }
                            case '7':
                            {
                                str = 'Double';
                                break;
                            }
                            case '8':
                            {
                                str = 'Double Inverse';
                                break;
                            }
                            case '9':
                            {
                                str = 'String';
                                break;
                            }
                            case '10':
                            {
                                str = 'String Inverse';
                                break;
                            }
                        }
                        return str;
                    }
                    },
                    {index: 'dataLength'},
                    {
                        index: 'refreshCycle', converter: function (value, row) {
                        var str = '';
                        switch (value.toString()) {
                            case '0':
                            {
                                str = _this.i18n.DO_NOT_STORE;
                                break;
                            }
                            case '1':
                            {
                                str = '5s';
                                break;
                            }
                            case '2':
                            {
                                str = '1min';
                                break;
                            }
                            case '3':
                            {
                                str = '5min';
                                break;
                            }
                            case '4':
                            {
                                str = '0.5h';
                                break;
                            }
                            case '5':
                            {
                                str = '1h';
                                break;
                            }
                            case '6':
                            {
                                str = '1day';
                                break;
                            }
                            case '7':
                            {
                                str = '1week';
                                break;
                            }
                            case '8':
                            {
                                str = '1month';
                                break;
                            }
                            case '9':
                            {
                                str = '1year';
                                break;
                            }
                        }
                        return str;
                    }
                    }
                ]

            };
            this.$datatable = $("#mbTable").off().simpleDataTable(dataTableOptions);
        }

        refreshTableItem() {
            var _this = this,
                treeNode = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0];
            WebAPI.post('/modbus/project/point/status', {
                'projId': AppConfig.projectId,
                'prefix': treeNode.prefix,
                'dtuId': treeNode.id
            }).done(function (result) {
                if (result.success) {
                    let $tBody = $("#mbTable").find(".table-body"),
                        $tBodyClone = $tBody.clone(true),
                        receiveNames = [],
                        nameList = [],
                        receiveData = result.data;
                    for (let i = 0; i < _this.pointList.length; i++) {
                        nameList.push(_this.pointList[i].pointName);
                    }
                    for (var prop in receiveData) {
                        receiveNames.push(prop);
                    }

                    for (var i = 0; i < receiveNames.length; i++) {
                        var name = receiveNames[i];
                        var index = $.inArray(name, nameList);
                        if (index !== -1) {
                            var $td = $tBodyClone.find('td[title = ' + name + ']').closest('tr').find('td');
                            $td.eq(1).find('.ellipsis').text(receiveData[name].value);
                            $td.eq(2).find('.ellipsis').text(receiveData[name].updateTime);
                        }
                    }

                    $tBody.replaceWith($tBodyClone);
                }
            });

        }

        mbPointAdd() {
            this.pointUpdateType = 'add';
            var $form = $("#mbPointAddForm");
            $form[0].reset();
            $("#obixUpdateNodeTitle").text(this.i18n.ADD_POINT);
            $("#dataLengthBox").html(1);
            $("#mbPointAddWin").modal({
                backdrop: 'static'
            });
        }

        mbPointAddConfirm() {
            let _this = this;
            let pointMap = $("#mbPointAddForm").serializeObject(),
                $dataLengthInput = $("#dataLengthInput"),
                dataLengthVal = $dataLengthInput.val().trim();

            if (!pointMap.pointName) {
                alert(_this.i18n.ENTER_POINT_NAME);
                return;
            }

            if (!pointMap.slaveId || !(/^[0-9]*$/.test(pointMap.slaveId))) {
                alert(_this.i18n.SUBSTATION_ID_CHECK);
                return;
            }

            if (!pointMap.address || !(/^[0-9]*$/.test(pointMap.address))) {
                alert(_this.i18n.POINT_ADDRESS_CHECK);
                return;
            }

            if (pointMap.multiple) {
                if (!(/^[0-9]*$/.test(pointMap.multiple))) {
                    alert(_this.i18n.MULTIPLIER_CHECK);
                    return;
                }
            }

            if (!dataLengthVal || !(/^[0-9]*$/.test(dataLengthVal))) {
                alert(_this.i18n.DATA_LENGTH_CHECK3);
                return;
            }

            if ($dataLengthInput.attr('dataType') == 'bite') {
                if (dataLengthVal.length > 2 || dataLengthVal < 0 || dataLengthVal > 15) {
                    alert(_this.i18n.DATA_LENGTH_CHECK4);
                    return;
                }
            }

            let treeNode = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0];
            pointMap.pointType = 'modbus';
            pointMap.projId = AppConfig.projectId;
            pointMap.dtuId = treeNode.id;
            pointMap.type = _this.pointUpdateType;
            if (_this.pointUpdateType == 'update') {
                pointMap.pointId = _this.pointId;
            }
            WebAPI.post('/modbus/dtu/addPoint', pointMap).done(function (res) {
                if (res.success) {
                    if (_this.pointUpdateType == 'update') {
                        alert(I18n.resource.common.MODIFY_SUCCESS);
                    } else {
                        alert(I18n.resource.common.ADD_SUCCESS);
                    }
                    if (treeNode && treeNode.flag) {
                        _this.loadSheet();
                    } else {
                        treeNode.flag = true;
                        new beop.mb.PointsTable($("#modbusContainer").children('.content') ).init(treeNode);
                    }
                    _this.mbCopyIsShow(true);
                    $("#mbPointAddWin").modal('hide');
                } else {
                    alert(res.msg);
                }
            }).fail(function (e) {
                console.log(e);
            });
        }

        mbCopyIsShow(flag) {
            let $copyDom = $("#dtuOpBtnGroup").find('.copy');
            flag ? $copyDom.addClass('active') : $copyDom.removeClass('active');
        }

        mbPointsDelete() {
            let _this = this;
            let getSelectedDataList = this.$datatable.simpleDataTable('getSelectedData');
            if (!getSelectedDataList.length) {
                alert(i18n_resource.common.SELECT_RECORDS_REQUIRED);
                return;
            }

            confirm(I18n.resource.debugTools.sitePoint.IS_DELETE_POINTS, function () {
                Spinner.spin(document.body);
                let pidList = [];
                for (let i = 0; i < getSelectedDataList.length; i++) {
                    pidList.push(getSelectedDataList[i].pointId);
                }
                WebAPI.post('/modbus/dtu/points/del', {
                    projId: AppConfig.projectId,
                    dtuId: _this.treeNode.id,
                    points: pidList
                }).done(function (result) {
                    if (result.success) {
                        _this.stateMap.currentPage = 1;
                        if (!getSelectedDataList.length) {
                            _this.mbCopyIsShow(false);
                        }
                        _this.loadSheet();
                    } else {
                        alert(I18n.resource.debugTools.info.DELETE_FAILED + ':' + result.msg);
                        Spinner.stop();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });
        }

        mbAllPointsDelete() { //删除全部
            let _this = this;
            confirm(I18n.resource.debugTools.sitePoint.IS_DELETE_POINTS, function () {
                WebAPI.post('/modbus/dtu/points/del/all', {
                    projId: AppConfig.projectId,
                    dtuId: _this.treeNode.id
                }).done(function (result) {
                    if (result.success) {
                        _this.stateMap.currentPage = 1;
                        _this.mbCopyIsShow(false);
                        _this.loadSheet();
                    } else {
                        alert(I18n.resource.debugTools.info.DELETE_FAILED + ':' + result.msg);
                        Spinner.stop();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });
        }
    }

    exports.PointsTable = PointsTable;

})(namespace('beop.mb'));

//# sourceURL=mb.pointsTable.js

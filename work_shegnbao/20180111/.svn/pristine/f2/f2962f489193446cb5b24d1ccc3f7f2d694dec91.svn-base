(function (exports) {
    class PointsObixTable extends exports.BaseView {

        constructor($container) {
            super($container);
            this.html = '/static/scripts/modbus/views/mb.pointsObixTable.html';
            this.i18n = I18n.resource.modBus.info;
            this.i18n_obix = I18n.resource.dataTerminal.obix;
            this.stateMap = {
                currentPage: 1,
                pageSize: 10
            };
            this.dtuTime = 10000;
            this.isAutoSearchCompleted = true;
            this.isUpdateAutoSearchFlag = false;
            this.firstEnterFlag = true;
        }

        init(treeNode) {
            let _this = this;
            super.init().done(function () {
                if (treeNode && treeNode.id) {
                    _this.treeNode = treeNode;
                    _this.dtuId = treeNode.id;
                    $("#point_export").attr('href', '/terminal/obixs/export/' + AppConfig.projectId + '/' + _this.dtuId);
                    // _this.loadSheet();
                    exports.pointSearchStatusListTimer && clearInterval(exports.pointSearchStatusListTimer);
                    WebAPI.post('terminal/obix/dtu/autoSearch/getStatus', {
                        projId: AppConfig.projectId,
                        dtuId: _this.dtuId,
                        obixTag: _this.treeNode.dtuName
                    }).done(function (res) {
                        if (res.success) {
                            if (res.data == 0) { // 0：就绪, 1：繁忙
                                _this.isAutoSearchCompleted = true;
                                _this.loadSheet();
                            } else {
                                _this.isAutoSearchCompleted = false;
                                _this.requestAutoSearchStatus().done(function () {
                                    _this.getAutoSearchStatus();
                                });
                            }
                        } else {
                            _this.loadSheet();
                        }
                    }).fail(function () {
                        _this.loadSheet();
                    });
                }
                I18n.fillArea($('#modbusContainer'));
                _this._attachEvent();
            });
        }

        transLateMsgCode(msg) {
            if (I18n.resource.dataTerminal.msg_params[msg]) {
                return I18n.resource.dataTerminal.msg_params[msg]
            } else {
                return msg;
            }
        }

        _attachEvent() {
            let _this = this,
                $enterObixPointAddress = $("#enterObixPointAddress"),
                $obixDebugInfo = $("#obixDebugInfo");
            $("#modbusContainer").off('click.obixPointAutoSearch').on('click.obixPointAutoSearch', '#obixPointAutoSearch', function () {
                if (_this.isAutoSearchCompleted) {
                    WebAPI.post('terminal/obix/dtu/autoSearch/start', {
                        dtuId: _this.dtuId,
                        obixTag: _this.treeNode.dtuName,
                        obixUrl: _this.treeNode.obixUrl,
                        obixUser: _this.treeNode.obixUser,
                        obixPsw: _this.treeNode.obixPsw
                    }).done(function (res) {
                        if (res.success) {
                            _this.requestAutoSearchStatus().done(function () {
                                _this.getAutoSearchStatus();
                            });
                        } else {
                            alert(_this.transLateMsgCode(res.code));
                        }
                    }).fail(function (e) {
                        alert(I18n.resource.common.REQUEST_ERROR);
                    });
                }
            }).off('click.obixPointHistory').on('click.obixPointHistory', '#obixPointHistory', function () {
                new beop.mb.History($("#modBusDialog")).init();
            }).off('click.obixPointUpdate').on('click.obixPointUpdate', '#obixPointUpdate', function () {
                if (_this.isAutoSearchCompleted) {
                    _this.obixPointUpdate();
                }
            }).off('click.obixPointUpdateFormConfirm').on('click.obixPointUpdateFormConfirm', '#obixPointUpdateFormConfirm', function () {
                _this.obixPointUpdateFormConfirm();
            }).off('click.obixPointDebug').on('click.obixPointDebug', '#obixPointDebug', function () {
                if (_this.isAutoSearchCompleted) {
                    let getSelectedDataList = _this.$datatable.simpleDataTable('getSelectedData');
                    if (!getSelectedDataList.length) {
                        alert(i18n_resource.common.SELECT_RECORDS_REQUIRED);
                        return;
                    }
                    let item = getSelectedDataList[0];
                    $obixDebugInfo.hide();
                    $enterObixPointAddress.text(item.address).val(item.address);
                    $("#obixDebugPointName").text(item.pointName);
                    $("#obixDebugPointValue").text(item.value || '');
                    $("#obixDebugWin").modal();
                }
            }).off('click.obixDebugClear').on('click.obixDebugClear', '#obixDebugClear', function () {
                $enterObixPointAddress.val('');
            }).off('click.obixDebugTest').on('click.obixDebugTest', '#obixDebugTest', function () {
                if (!$enterObixPointAddress.val().trim()) {
                    alert(_this.i18n_obix.POINT_ADDRESS_REQUIRED);
                    return;
                }
                Spinner.spin($('#obixDebugWin')[0]);
                WebAPI.post('terminal/obixs/debug', {
                    dtuId: _this.dtuId,
                    projId: AppConfig.projectId, // necessary for cluster redirection
                    pointId: _this.$datatable.simpleDataTable('getSelectedData')[0].pointId,
                    obixPointUrl: $enterObixPointAddress.val().trim(),
                    obixTag: _this.treeNode.dtuName,
                    obixUrl: _this.treeNode.obixUrl,
                    obixUser: _this.treeNode.obixUser,
                    obixPsw: _this.treeNode.obixPsw
                }).done(function (res) {
                    if (res.success) {
                        $("#obixDebugPointValue").text(res.data.substring(1, res.data.length - 1));
                        $obixDebugInfo.text(_this.i18n_obix.TEST_SUCCESS).show();
                    } else {
                        $obixDebugInfo.text(_this.transLateMsgCode(res.code) || _this.i18n_obix.TEST_ERROR).show();
                    }
                }).fail(function (e) {
                    alert(I18n.resource.common.REQUEST_ERROR);
                }).always(function () {
                    Spinner.stop();
                });
            }).off('click.obixPointDelete').on('click.obixPointDelete', '#obixPointDelete', function () {
                if (_this.isAutoSearchCompleted) {
                    _this.obixPointsDelete();
                }
            }).off('click.obixAllPointsDelete').on('click.obixAllPointsDelete', '#obixAllPointsDelete', function () {
                if (_this.isAutoSearchCompleted) {
                    _this.obixAllPointsDelete();
                }
            });
        }

        getAutoSearchStatus() {
            let _this = this;
            console.log('getAutoSearchStatus ok');
            //Spinner.spin($('#mbPointsTableBox')[0]);
            exports.pointSearchStatusListTimer && clearInterval(exports.pointSearchStatusListTimer);
            exports.pointSearchStatusListTimer = setInterval(_this.requestAutoSearchStatus.bind(_this), _this.dtuTime);
        }

        requestAutoSearchStatus() {
            let _this = this;
            return WebAPI.post('terminal/obix/dtu/autoSearch/getStatus', {
                projId: AppConfig.projectId,
                dtuId: _this.dtuId,
                obixTag: _this.treeNode.dtuName
            }).done(function (res) {
                if (res.success) {
                    let $btnGroupBox = $("#obixBtnGroupBox"),
                        $pointExport = $("#point_export"),
                        $obixAutoSearchBox = $("#obixAutoSearchBox");
                    if (res.data == 0) { // 0：就绪, 1：繁忙
                        exports.pointSearchStatusListTimer && clearInterval(exports.pointSearchStatusListTimer);
                        _this.isAutoSearchCompleted = true;
                        $btnGroupBox.removeClass('auto-searching');
                        $pointExport.attr('href', '/terminal/obixs/export/' + AppConfig.projectId + '/' + _this.dtuId);
                        $obixAutoSearchBox.hide();
                        _this.isUpdateAutoSearchFlag = true;
                        _this.loadSheet();
                    } else {
                        _this.isAutoSearchCompleted = false;
                        $btnGroupBox.addClass('auto-searching');
                        $pointExport.attr('href', 'javascript:void(0);');
                        $("#obixAutoSearchResult").hide();
                        $obixAutoSearchBox.show();
                    }
                }
            });
        }


        loadSheet() {
            let _this = this,
                dtuId = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0].id;
            var dataTableOptions = {
                url: 'terminal/obix/dtu/list',
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
                pointType: 'type',
                dataFilter: function (result) {
                    if (result.success) {
                        _this.pointList = [];
                        if (result.data && result.data.list) {
                            _this.pointList = result.data.list;
                        }

                        if (_this.firstEnterFlag || _this.isUpdateAutoSearchFlag) {
                            _this.firstEnterFlag = false;
                            _this.isUpdateAutoSearchFlag = false;
                            $("#obixAutoSearchPointTotal").text(result.data.total);
                            $("#obixAutoSearchResult").show();
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
                    }, 60000);
                },
                totalNumIndex: 'data.total',
                onRowDbClick: function (tr, data) {
                    if (!_this.isAutoSearchCompleted) {
                        alert(_this.i18n_obix.AUTO_SEARCH_NOT_EDIT);
                        return;
                    }
                    let $form = $("#obixPointUpdateForm");
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
                    $("#obixUpdateNodeTitle").text(_this.i18n.EDIT_POINT);
                    $("#obixPointUpdateWin").modal({
                        backdrop: 'static'
                    });
                },
                colNames: [
                    I18n.resource.modBus.pointHeader.NAME,
                    I18n.resource.modBus.pointHeader.POINT_VALUE,
                    I18n.resource.modBus.pointHeader.UPDATE_TIME,
                    I18n.resource.modBus.pointHeader.TYPE,
                    I18n.resource.modBus.pointHeader.REMARK,
                    I18n.resource.modBus.pointHeader.ADDRESS
                ],
                colModel: [
                    {index: 'pointName', width: '200px'},
                    {index: ''},
                    {index: '', width: '150px'},
                    {index: 'pointType'},
                    {index: 'note'},
                    {index: 'address'}
                ]

            };
            this.$datatable = $("#obixTable").off().simpleDataTable(dataTableOptions);
        }

        refreshTableItem() {
            var _this = this,
                treeNode = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0];
            WebAPI.post('terminal/obix/dtu/point/status', {
                'projId': AppConfig.projectId,
                'prefix': treeNode.prefix,
                'dtuId': treeNode.id
            }).done(function (result) {
                if (result.success) {
                    let $tBody = $("#obixTable").find(".table-body"),
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
                            let $tr = $tBodyClone.find('td[title = ' + name + ']').closest('tr'),
                                $td = $tr.find('td');
                            $tr.data().value.value = receiveData[name].value;
                            $td.eq(1).find('.ellipsis').text(receiveData[name].value);
                            $td.eq(2).find('.ellipsis').text(receiveData[name].updateTime);
                        }
                    }

                    $tBody.replaceWith($tBodyClone);
                }
            });

        }

        obixPointUpdate() {
            this.pointUpdateType = 'add';
            var $form = $("#obixPointUpdateForm");
            $form[0].reset();
            $("#obixUpdateNodeTitle").text(this.i18n.ADD_POINT);
            $("#obixPointUpdateWin").modal({
                backdrop: 'static'
            });
        }

        obixPointUpdateFormConfirm() {
            let _this = this;
            let pointMap = $("#obixPointUpdateForm").serializeObject();

            if (!pointMap.pointName) {
                alert(_this.i18n.ENTER_POINT_NAME);
                return;
            }

            if (!pointMap.address) {
                alert(_this.i18n_obix.ENTER_ADDRESS_REQUIRE);
                return;
            }

            let treeNode = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0];
            pointMap.pointType = 'obix';
            pointMap.projId = AppConfig.projectId;
            pointMap.dtuId = treeNode.id;
            pointMap.type = _this.pointUpdateType;
            if (_this.pointUpdateType == 'update') {
                pointMap.pointId = _this.pointId;
            }
            WebAPI.post('terminal/obix/dtu/updatePoint', pointMap).done(function (res) {
                if (res.success) {
                    if (_this.pointUpdateType == 'update') {
                        alert(I18n.resource.common.MODIFY_SUCCESS);
                    } else {
                        alert(I18n.resource.common.ADD_SUCCESS);
                    }
                    treeNode.flag = true;
                    $("#obixPointUpdateWin").modal('hide');
                    _this.loadSheet();
                } else {
                    alert(_this.transLateMsgCode(res.code));
                }
            }).fail(function (e) {
                console.log(e);
            });
        }

        obixPointsDelete() {
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
                WebAPI.post('terminal/obix/dtu/points/del', {
                    projId: AppConfig.projectId,
                    dtuId: _this.treeNode.id,
                    points: pidList
                }).done(function (res) {
                    if (res.success) {
                        _this.stateMap.currentPage = 1;
                        _this.loadSheet();
                    } else {
                        alert(_this.transLateMsgCode(res.code));
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });
        }

        obixAllPointsDelete() { //删除全部
            let _this = this;
            confirm(I18n.resource.debugTools.sitePoint.IS_DELETE_POINTS, function () {
                WebAPI.post('terminal/obixs/dtu/points/del/all', {
                    projId: AppConfig.projectId,
                    dtuId: _this.treeNode.id
                }).done(function (res) {
                    if (res.success) {
                        _this.stateMap.currentPage = 1;
                        _this.loadSheet();
                    } else {
                        alert(_this.transLateMsgCode(res.code));
                        Spinner.stop();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });
        }
    }

    exports.PointsObixTable = PointsObixTable;

})(namespace('beop.mb'));

//# sourceURL=mb.PointsObixTable.js
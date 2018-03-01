(function (exports) {
    class ProjectPanel extends exports.BaseView {

        constructor($container) {
            super($container);
            this.html = '/static/scripts/modbus/views/mb.projectPanel.html';
            this.i18n = I18n.resource.modBus.info;
            this.dtuTime = 60000; // to_do edit
        }

        init() {
            let _this = this;
            _this.exportFileFormat = 0;
            super.init().done(function () {
                $("#interfaceProject").text(AppConfig.projectShowName).attr('title', AppConfig.projectShowName);
                WebAPI.post("/terminal/project", {
                    'projId': AppConfig.projectId
                }).done(function (result) {
                    if (result.success) {
                        _this.identified = result.data.id;
                        let subList = [];
                        for (var i = 0; i < result.data.dtulist.length; i++) {
                            let node = result.data.dtulist[i];
                            let isOnlineText = '<span class="status-box"></span>';
                            subList.push({
                                'name': (node.equipName || node.name)  + isOnlineText,
                                'originalName': node.equipName,
                                'dtuName': node.name,
                                'id': node.id,
                                'flag': node.flag,
                                'type': node.type,
                                'prefix': node.prefix
                            });
                        }
                        _this.treeData = [{
                            'name': result.data.name,
                            'id': result.data.id,
                            'prefix': result.data.prefix,
                            'children': subList
                        }];
                        _this.loadDtuTree();
                    }
                }).always(function () {
                    Spinner.stop();
                });
                _this._attachEvent();
            });
        }

        _attachEvent() {
            let _this = this;
            $("#modbusContainer").off('click.exportLocalFile').on('click.exportLocalFile', '#exportLocalFile', function () {
                $("#modbusContainer").find('#exportLocalFile').change(function () {
                    _this.uploadFileExport($(this)[0].files);
                });
            }).off('click.sureExportLocal').on('click.sureExportLocal', '#sureExportLocal', function () {
                if (!_this.exportFileFormat) {
                    alert.danger(_this.i18n.FILE_FORMAT_CHECK);
                    return;
                }
                let postUrl,
                    treeNode = _this.getTreeDode('node');
                if (treeNode.type == 'modbus') {
                    postUrl = '/modbus/points/import/';
                } else if (treeNode.type == 'obix') {
                    postUrl = 'terminal/obixs/points/import/';
                }
                Spinner.spin(ElScreenContainer);
                $.ajax({
                    url: postUrl,
                    type: 'post',
                    data: _this.formData,
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function (result) {
                    if (result.success) {
                        alert.success(_this.i18n.IMPORT_SUCCESSFULLY);
                        let $exportLocalFile = $('#exportLocalFile'),
                            $box = $("#terminalPointsTableBox");
                        $exportLocalFile.after($exportLocalFile.clone().val(''));
                        $exportLocalFile.remove();
                        _this.formData = null;
                        _this.exportFileFormat = 0;
                        $('#export_point_modal').modal('hide');
                        treeNode.flag = true;
                        $("#dtuOpBtnGroup").find('.copy').addClass('active');
                        if (treeNode.type == 'modbus') {
                            new beop.mb.PointsTable($box).init(treeNode);
                        } else if (treeNode.type == 'obix') {
                            new beop.mb.PointsObixTable($box).init(treeNode);
                        }
                    } else {
                        alert.danger(result.msg);
                    }
                }).fail(function () {
                    alert.danger(I18n.resource.common.SERVER_REQUEST_FAILED);
                }).always(function () {
                    Spinner.stop();
                })
            }).off('click.treeCustomIcon').on('click.treeCustomIcon', '.treeCustomIcon', function (e) {
                if (!$(this).hasClass('active')) {
                    return;
                }
                if (!_this.getTreeDode('nodes').length) {
                    alert(_this.i18n.MIN_ONE_POINT_SELECT);
                    return;
                }
                let treeNode = _this.getTreeDode('node'),
                    $target = $(e.target),
                    $box = $("#terminalPointsTableBox");
                if ($target.closest('.removeNode').length) {
                    confirm(_this.i18n.CONFIRM_DELETING_DEVICE, function () {
                        WebAPI.post('/modbus/dtu/del', {
                            'dtuId': treeNode.id
                        }).done(function (result) {
                            if (result.success) {
                                _this.zTreeInstance.removeNode(treeNode, true);
                                $box.empty();
                            } else {
                                alert(result.msg);
                                Spinner.stop();
                            }
                        }).always(function () {
                            Spinner.stop();
                        });
                    });
                }

                if ($target.closest('.edit').length) {
                    let $updateWin = $("#editTerminalPrefixWin");
                    $updateWin.find('.dtuName').text(treeNode.originalName);
                    $updateWin.find('.dtuPrefix').val(treeNode.prefix);
                    I18n.fillArea($updateWin);
                    $updateWin.modal();
                }
                if ($target.closest('.copy').length) {
                    var dtuList = [],
                        subNodes = _this.zTreeInstance.getNodes()[0].children;
                    for (var i = 0; i < subNodes.length; i++) {
                        let node = subNodes[i];
                        if (node.type == 'modbus') {
                            if (node.id != treeNode.id) {
                                dtuList.push({
                                    name: node.originalName,
                                    id: node.id
                                });
                            }
                        }
                    }
                    $("#copy_content").html(beopTmpl('mod_copy_tree_content', {
                        dtuList: dtuList
                    }));
                    let $win = $("#modbus_tree_copy");
                    I18n.fillArea($win);
                    $win.modal();
                }
                if ($target.closest('.debugger').length) {
                    $("#debugger").modal({
                        keyboard: false,
                        backdrop: 'static'
                    });
                    new beop.mb.Debug($("#debuggerContent")).init();
                }
                if ($target.is('.startUp')) {
                    _this.runDTU(treeNode);
                }
                if ($target.is('.endDown')) {
                    _this.stopDTU(treeNode);
                }
            });
        }

        getTreeDode(attr) {
            var nodes = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes();
            if (!nodes) {
                return [];
            }
            if (attr == 'id') {
                return nodes[0].id;
            } else if (attr == 'node') {
                return nodes[0];
            } else if (attr == 'nodes') {
                return nodes || [];
            }
        }

        uploadFileExport(file) {
            let _this = this;
            if (!file.length) {
                return;
            }
            _this.formData = new FormData();
            var matchFile = file[0].name.match(/\.[A-Za-z0-9]+$/);
            var supportFiles = ['.csv', '.xlsx'];
            if (!file[0] || !matchFile || supportFiles.indexOf(matchFile[0].toLowerCase()) < 0) {
                $('#export-container').find('.errorMsg').html(_this.i18n.FILE_FORMAT_ERROR);
                _this.exportFileFormat = 0;
                return;
            } else {
                $('#export-container').find('.errorMsg').html('');
            }
            _this.exportFileFormat = 1;
            $("#exportLocalFileText").text(file[0].name);
            _this.formData.append('file', file[0]);
            _this.formData.append('projId', _this.identified);
            _this.formData.append('dtuId', _this.dtuId);
            _this.formData.append('dtuName', $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes()[0].dtuName);
        }

        loadDtuTree() {
            let _this = this;
            let zTreeSetting = {
                view: {
                    showIcon: true,
                    nameIsHTML: true,
                    selectedMulti: false,
                    addHoverDom: function (treeId, treeNode) {
                        $("#" + treeNode.tId).find('a').attr('title', treeNode.originalName);
                    }
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                callback: {
                    onClick: this.zTreeOnClick.bind(this)
                }
            };
            _this.zTreeInstance = $.fn.zTree.init($("#mb_dtu_list_ul"), zTreeSetting, this.treeData);
            _this.zTreeInstance.expandAll(true);
            let treeNodes = _this.zTreeInstance.getNodes()[0].children;
            for (var i = 0; i < treeNodes.length; i++) {
                $('#' + treeNodes[i].tId).addClass(treeNodes[i].type);
            }
            _this.refreshDtuStatus();
            exports.dtuStatusTimer && clearInterval(exports.dtuStatusTimer);
            exports.dtuStatusTimer = setInterval(function () {
                _this.refreshDtuStatus();
            }, _this.dtuTime);
        }

        zTreeOnClick(event, treeId, treeNode) {
            let $modbusContainer = $("#modbusContainer"),
                $box = $modbusContainer.children('.content');
            let $btnBox = $("#dtuOpBtnGroup");
            if ($("#mb_dtu_list_ul").find("li").length == 1) {
                I18n.fillArea($modbusContainer);
                return;
            }
            exports.pointSearchStatusListTimer && clearInterval(exports.pointSearchStatusListTimer);
            if (treeNode.isParent) {
                $btnBox.find('.endDown').hide();
                $btnBox.find('.startUp').show();
                $btnBox.find('.treeCustomIcon').removeClass('active');
                $box.empty().html(beopTmpl('modbus_new_equipment'));
            } else {
                if (treeNode.isOnline == 'Online') {
                    $btnBox.find('.treeCustomIcon').addClass('active');
                    if (treeNode.isRun) {
                        $btnBox.find('.startUp').hide();
                        $btnBox.find('.endDown').show();
                    } else {
                        $btnBox.find('.endDown').hide();
                        $btnBox.find('.startUp').show();
                    }
                } else {
                    $btnBox.find('.debugger').removeClass('active').show();
                    $btnBox.find('.startUp').show().removeClass('active');
                    $btnBox.find('.endDown').hide();
                }

                if (treeNode.type == 'modbus') {
                    if (treeNode.flag) {
                        $btnBox.find('.copy').addClass('active').show();
                        new beop.mb.PointsTable($box).init(treeNode);
                    } else {
                        $btnBox.find('.copy').removeClass('active').show();
                        $box.empty().html(beopTmpl('mb_projectPanel_nav'));
                    }
                } else if (treeNode.type == 'obix') {
                    $btnBox.find('.copy').hide().end().find('.debugger').hide();
                    new beop.mb.PointsObixTable($box).init(treeNode);
                }
                $btnBox.find('.removeNode').addClass('active').end().find('.edit').addClass('active');
            }
            I18n.fillArea($modbusContainer);
        }

        refreshDtuStatus() {
            var treeInstance = $.fn.zTree.getZTreeObj('mb_dtu_list_ul');
            if (!treeInstance || !treeInstance.getNodes()[0].children.length) {
                return;
            }

            WebAPI.post('/modbus/project/dtu/status', {
                'projId': AppConfig.projectId
            }).done(function (result) {
                if (result.success) {
                    // isRun = 0 停止,  isRun = 1 运行;
                    let treeNodes = treeInstance.getNodes()[0].children;
                    let receiveData = result.data;
                    for (var i = 0; i < treeNodes.length; i++) {
                        var node = treeNodes[i],
                            $nodeDom = $('#' + node.tId),
                            $statusBox = $nodeDom.find('.status-box');
                        //$nodeDom.addClass(node.type);
                        for (var prop in receiveData) {
                            if (prop == node.id) {
                                var statusHtml = '';
                                node.isOnline = receiveData[prop].isOnline;
                                node.isRun = parseInt(receiveData[prop].isRun);
                                if (node.isOnline == 'Online') {
                                    statusHtml += '<span class="status-icon status-online">connect</span>';
                                } else {
                                    statusHtml += '<span class="status-icon status-offline">disconnect</span>';
                                }
                                /*if (node.isRun) {
                                    statusHtml += '<span class="status-icon status-run">on</span>';
                                } else {
                                    statusHtml += '<span class="status-icon status-stop">off</span>'
                                }*/
                                $statusBox.html(statusHtml);
                            }
                        }
                    }
                }
            });
        }

        stopDTU(treeNode) {
            let _this = this;
            confirm(_this.i18n.IS_CONFIRM_STOP_DEVICE, function () {
                Spinner.spin(ElScreenContainer);
                WebAPI.post('/modbus/dtu/stop', {dtuId: treeNode.id}).done(function (result) {
                    if (result.success) {
                        alert.success(_this.i18n.PAUSED);
                        $("#dtuOpBtnGroup").find('.endDown').hide().end().find('.startUp').show();
                        treeNode.isRun = 0;
                    } else {
                        alert.danger(_this.i18n.FAIL_TO_STOP_DEVICE);
                    }
                }).fail(function (msg) {
                    alert.danger(I18n.resource.common.SERVER_REQUEST_FAILED);
                }).always(function () {
                    Spinner.stop();
                })
            })
        }

        runDTU(treeNode) {
            let _this = this;
            confirm(_this.i18n.IS_CONFIRM_ENABLE_DEVICE, function () {
                Spinner.spin(ElScreenContainer);
                WebAPI.post('/modbus/dtu/run', {dtuId: treeNode.id}).done(function (result) {
                    if (result.success) {
                        alert.success(_this.i18n.ALREADY_ENABLE);
                        $("#dtuOpBtnGroup").find('.startUp').hide().end().find('.endDown').show();
                        treeNode.isRun = 1;
                    } else {
                        alert.danger(result.msg || _this.i18n.ALREADY_ENABLE);
                    }
                }).fail(function (msg) {
                    alert.danger(I18n.resource.common.SERVER_REQUEST_FAILED);
                }).always(function () {
                    Spinner.stop();
                })
            })
        }
    }

    exports.ProjectPanel = ProjectPanel;

})(namespace('beop.mb'));
//# sourceURL=mb.projectPanel.js
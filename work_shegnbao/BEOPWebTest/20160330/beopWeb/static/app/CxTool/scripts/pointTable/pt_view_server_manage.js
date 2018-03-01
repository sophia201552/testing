(function (beop) {
    var pageSize = 10;
    if ($(window).height() > 800) {
        pageSize = 15;
    }
    var configMap = {
            htmlURL: '/point_tool/html/server',
            serverDetailURL: '/static/app/CxTool/views/serverManage.html',
            settable_map: {
                dtuModel: true,
                dtu_server_host: ''
            },
            dtu_server_host: '',
            dtuModel: null,
            statusRefreshTime: 60000,
            pageSize: pageSize
        },
        stateMap = {
            currentPage: 1,
            pointTotal: 0,
            dtuId: '',
            selectRemarkDom: null,
            selectRecordDom: null
        },
        jqueryMap = {},
        setJqueryMap, configModel, loadServerStatus, enterProject, loadServerDetail,
        getServerDetail, restartCore, destroyServerDetail, getCoreVersion, synUnit01,
        onClickEditIcon, onMoveOutCell, onMoveOverCell, onClickCancelIcon, onClickSureIcon, onUploadCore, onModifySettings,
        freshParamTable, paginationRefresh, returnCheckboxValue, itemRecordsWin, addRecords,
        remarkEdit, remarkSave, remarkClose, itemRemarksBox,
        init;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $serverContainer: $container.find('#serverContainer'),
            $serverRestartBtn: $container.find('#serverRestartBtn'),
            $statusDisk: $container.find('#status-disk'),
            $statusCpu: $container.find('#status-cpu'),
            $statusMemory: $container.find('#status-memory'),
            $statusTime: $container.find('#status-time'),
            $coreUpdateTime: $container.find('#coreUpdateTime'),
            $coreVersion: $container.find('#coreVersion'),
            $unitTable: $container.find('#unitTable'),
            $uploadCore: $container.find('#uploadCore'),
            $formBox: $container.find('#formBox'),
            $serverPaginationWrapper: $container.find('#serverPaginationWrapper'),
            $itemRecordsWin: $container.find('#itemRecordsWin'),
            $addRecords: $container.find('#addRecords'),
            $remarksBox: $container.find('#remarksBox'),
            $remarkEdit: $container.find('#remarkEdit'),
            $remarkSave: $container.find('#remarkSave'),
            $remarkText: $container.find('#remarkText'),
            $remarkClose: $container.find('#remarkClose'),
            $remarkHtml: $container.find('#remarkHtml'),
            $serversRecordUl: $container.find('#serversRecordUl'),
            $writeRecord: $container.find('#writeRecord')
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
        $.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            loadServerStatus();
            jqueryMap.$serverContainer.on('click', '#servers_table .enterProject', enterProject);
            jqueryMap.$container.off('click.itemRecords').on('click.itemRecords', '#servers_table .itemRecords', itemRecordsWin);
            jqueryMap.$container.on('click', '#servers_table .tooltipTxt', itemRemarksBox);
            jqueryMap.$addRecords.on('click', addRecords);
            jqueryMap.$serverContainer.on('click', '#servers_table .enterProject', enterProject);
            jqueryMap.$remarkEdit.on('click', remarkEdit);
            jqueryMap.$remarkSave.on('click', remarkSave);
            jqueryMap.$remarkClose.on('click', remarkClose);
            I18n.fillArea(stateMap.$container);
        });
    };

    //---------DOM操作------


    //---------方法---------
    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.pageSize);
        if (!totalNum) {
            return;
        }

        $("#mappingPaginationWrapper").empty().html('<ul id="serverPagination" class="pagination fr"></ul>');

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
                stateMap.currentPage = page;
                loadServerStatus();
            }
        };

        if (stateMap.currentPage) {
            pageOption['startPage'] = stateMap.currentPage ? stateMap.currentPage : 1;
        }

        $("#serverPaginationWrapper").twbsPagination(pageOption);
    };

    loadServerStatus = function () {
        spinner.spin(document.body);
        jqueryMap.$remarksBox.hide();
        stateMap.currentPage ? stateMap.currentPage : 1;
        configMap.dtuModel.loadServerStatus(stateMap.currentPage, configMap.pageSize).done(function (result) {
            if (result.success) {
                var result_data = result.data, result_list = result_data.list, result_total = result_data.total;
                if (result_data.list.length) {
                    jqueryMap.$serverContainer.empty().html(beopTmpl('tpl_server_status', {statues: result_list}));
                    paginationRefresh(result_total);
                    I18n.fillArea(stateMap.$container);
                }
            }
        }).always(function () {
            spinner.stop();
        });
    };

    itemRemarksBox = function () {
        jqueryMap.$remarkSave.hide();
        var $this = $(this), offset = $this.offset(), $remarkTextDom = $this.parents('td').find('.remark_text');
        var left = offset.left - 300, top = offset.top + 20;
        stateMap.dtuId = $this.parents("tr").attr('dtu-id');
        stateMap.selectRemarkDom = $remarkTextDom;
        jqueryMap.$remarkHtml.html($remarkTextDom.data('text')).show();
        jqueryMap.$remarkEdit.show();
        jqueryMap.$remarkText.val('');
        jqueryMap.$remarksBox.css({
            'left': left + 'px',
            'top': top + 'px'
        }).show();
    };

    remarkEdit = function () {
        jqueryMap.$remarkSave.show();
        jqueryMap.$remarkEdit.hide();
        jqueryMap.$remarkText.val(jqueryMap.$remarkHtml.html()).show();
        jqueryMap.$remarkHtml.hide();
    };

    remarkSave = function () {
        return WebAPI.post("./updateServerRemark/" + stateMap.dtuId, {
            'remark': jqueryMap.$remarkText.val()
        }).done(function (result) {
            if (result.success) {
                var text = jqueryMap.$remarkText.val();
                jqueryMap.$remarkSave.hide();
                jqueryMap.$remarkEdit.show();
                jqueryMap.$remarkHtml.html(text).show();
                stateMap.selectRemarkDom.text(text).data('text', text).attr('title', text);
                jqueryMap.$remarkText.val('').hide();
            }
        }).fail(function () {
            alert(I18n.resource.common.SAVE_FAIL);
        }).always(function () {
        });
    };

    remarkClose = function () {
        jqueryMap.$remarkHtml.html('').hide();
        jqueryMap.$remarkText.val('').hide();
        jqueryMap.$remarksBox.hide();
    };

    enterProject = function () {
        var $parents = $(this).parents('tr');
        location.hash = '#server/' + $parents.attr('project-id') + '/' + $parents.attr('dtu');
    };

    itemRecordsWin = function () { // 点击详情文字弹出记录窗口，加载相应数据
        var $this = $(this);
        var id = $this.parents('tr').attr('dtu-id'), $recordTextDom = $this.parents('td').find('.record_text');
        stateMap.selectRecordDom = $recordTextDom;
        stateMap.dtuId = id;
        jqueryMap.$remarksBox.hide();
        return WebAPI.get("./getServerRecords/" + stateMap.dtuId).done(function (result) {
            if (result.success) {
                jqueryMap.$serversRecordUl.empty().html(beopTmpl('tpl_server_records', {
                    record_list: result.data.record_list
                }));
                jqueryMap.$writeRecord.val('');
                jqueryMap.$itemRecordsWin.modal();
            }
        }).fail(function () {
        }).always(function () {
        });
    };

    addRecords = function () { // 列表页添加记录接口
        var info = jqueryMap.$writeRecord.val().trim();
        if (info) {
            spinner.spin(jqueryMap.$itemRecordsWin.find('.modal-dialog').get(0));
            return WebAPI.post("./addServerRecords/" + stateMap.dtuId, {
                'info': info
            }).done(function (result) {
                if (result.success) {
                    var userName = $("#tools_user_name").text(), update_time = result.data.update_time;
                    var recordInfo = userName + ' ' + info + ' ' + update_time;
                    jqueryMap.$serversRecordUl.prepend(beopTmpl('tpl_server_record', {
                        recordInfo: {
                            'user': userName,
                            'info': info,
                            'update_time': update_time
                        }
                    }));
                    jqueryMap.$writeRecord.val("");
                    jqueryMap.$serversRecordUl.scrollTop(0);
                    stateMap.selectRecordDom.text(recordInfo).attr('title', recordInfo);
                }
            }).fail(function () {
                alert(I18n.resource.common.SAVE_FAIL);
            }).always(function () {
                spinner.stop();
            });
        } else {
            alert(I18n.resource.debugTools.servers.RECORD_CANNOT_EMPTY);
        }
    };

    loadServerDetail = function (project_id, dtu, $container) {
        configMap.dtu_server_host = null;
        getDebugServerHost(project_id, configMap);

        if (!configMap.dtu_server_host) {
            return;
        }
        stateMap.dtu_name = dtu;
        $.get(configMap.serverDetailURL).done(function (resultHtml) {
            if (!stateMap.$container) {
                stateMap.$container = $container;
            }
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            $('#currentProject').text(configMap.currentProjectName);
            jqueryMap.$container.find('[data-toggle="tooltip"]').tooltip();
            I18n.fillArea(stateMap.$container);
            stateMap.serverDetailTimeoutId = 0;
            getServerDetail();
            jqueryMap.$serverRestartBtn.click(restartCore);
            getCoreVersion();
            synUnit01();
            jqueryMap.$unitTable.on('mouseover', '.unit-value', onMoveOverCell)
                .on('mouseout', '.unit-value', onMoveOutCell)
                .on('click', '.edit-icon', onClickEditIcon)
                .on('click', '.cancel', onClickCancelIcon)
                .on('click', '.ok', onClickSureIcon)
                .on('click', '.modify-settings', onModifySettings);

            jqueryMap.$uploadCore.change(onUploadCore);
        });
    };

    onClickSureIcon = function () {
        var $this = $(this), $unitTD = $this.closest('.unit-value');
        $unitTD.removeClass('editing');
        var key = $unitTD.data('key');
        var value = $unitTD.find('input').val().trim();
        if ((stateMap.unit01[key] + '') === (value + '')) {
            $unitTD.find('.unit-text').html(stateMap.unit01[key]);
            $unitTD.find('.icons').hide();
        } else {
            $.ajax({
                type: 'POST',
                url: 'http://' + configMap.dtu_server_host + '/updateUnit/' + stateMap.dtu_name,
                crossDomain: true,
                data: {'data': JSON.stringify({name: key, value: value})},
                dataType: 'json'
            }).done(function (result) {
                if (result.success) {
                    stateMap.unit01[key] = value;
                    $unitTD.find('.unit-text').html(stateMap.unit01[key]);
                    $unitTD.find('.icons').hide();
                }
            })
        }
    };

    returnCheckboxValue = function ($form) {
        var obj = {};
        $form.find("input[type='checkbox']").each(function (index, item) {
            var $item = $(item), name = $item.attr('name'), oldValue = $item.closest(".form-group-type").find("input[type='hidden']").val();
            if ($item.is(':checked')) {
                $item.val("1");
                if (oldValue != $item.val()) {
                    obj[name] = '1';
                }
            } else {
                if (oldValue == '1') {
                    obj[name] = '0';
                }
            }
        });
        return obj;
    };

    onModifySettings = function () {
        var $this = $(this), $form = $this.parents("form"), jsonData = $form.serializeObject();
        var changeData = returnCheckboxValue($form);
        spinner.spin(document.body);
        WebAPI.ajaxForDebugTool({
            type: 'POST',
            data: {'data': JSON.stringify($.extend(jsonData, changeData))}
        }, configMap.dtu_server_host, stateMap.dtu_name, 'updateUnit').done(function (result) {
            if (result.success) {
                alert(I18n.resource.common.SAVE_SUCCESS);
            } else {
                alert(I18n.resource.common.SAVE_FAIL);
            }
        }).always(function () {
            spinner.stop();
        });
    };

    onUploadCore = function (event) {
        var fileData = event.target.files[0];
        var formData = new FormData();
        formData.append('file', fileData);
        var _this = $(this);
        spinner.spin(document.body);
        $.ajax({
            url: 'http://' + configMap.dtu_server_host + '/updateCore/' + stateMap.dtu_name,
            crossDomain: true,
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
            }
        }).always(function () {
            spinner.stop();
            _this.val(null);
        });
    };

    onClickCancelIcon = function () {
        var $this = $(this), $unitTD = $this.closest('.unit-value');
        $unitTD.removeClass('editing');
        var key = $unitTD.data('key');
        $unitTD.find('.unit-text').html(stateMap.unit01[key]);
        $unitTD.find('.icons').hide();
    };

    onMoveOverCell = function () {
        var $this = $(this);
        if ($this.hasClass('editing')) {
            $this.find('.icons.action').show();
        } else {
            $this.find('.icons.edit').show();
        }
    };

    onMoveOutCell = function () {
        $(this).find('.icons').hide();
    };

    onClickEditIcon = function () {
        var $this = $(this), $unitTD = $this.closest('.unit-value');
        $unitTD.addClass('editing');
        var key = $unitTD.data('key');
        $unitTD.find('.unit-text').html('<input value="' + stateMap.unit01[key] + '"/>');
        $unitTD.find('.icons').hide();
    };

    getServerDetail = function () {
        return $.ajax({
            type: 'GET',
            url: 'http://' + configMap.dtu_server_host + '/serverDetail/' + stateMap.dtu_name,
            crossDomain: true
        }).done(function (result) {
            if (result.success) {
                if (!result.data) {
                    return;
                }
                var disk_info = '';
                if (result.data.disk) {
                    var disk_info_list = result.data.disk.split('/');
                    disk_info = Math.floor(disk_info_list[0] / 1024) + 'G/' + Math.floor(disk_info_list[1] / 1024) + 'G';
                }
                jqueryMap.$statusDisk.text(disk_info);
                jqueryMap.$statusCpu.text(result.data.cpu + '%');
                jqueryMap.$statusMemory.text(result.data.memory + '%');
                jqueryMap.$statusTime.text(result.data.time);
                if (result.data.version) {
                    jqueryMap.$coreVersion.text(result.data.version.core_version);
                    jqueryMap.$coreUpdateTime.text(result.data.version.core_update_time);
                }
            }
        }).fail(function () {
            $('#ct_op_server_manage_form').html('<div style="color:red;text-align:center;">' + I18n.resource.common.UNABLE_VISIT + configMap.dtu_server_host + ',' + I18n.resource.common.CHECK_SERVER_NORMAL + '.</div>');
            I18n.fillArea(stateMap.$container);
        }).always(function () {
            stateMap.serverDetailTimeoutId = setTimeout(function () {
                getServerDetail();
            }, configMap.statusRefreshTime);
        });
    };

    freshParamTable = function ($targetForm) {
        var formElements = $targetForm.find(".form-value");
        for (var i = 0; i < formElements.length; i++) {
            var $item = formElements.eq(i);
            for (var prop in stateMap.unit01) {
                if ($item.attr("name") === prop) {
                    if ($item.attr("type") === 'checkbox') {
                        if (stateMap.unit01[prop] === '1') {
                            $item.attr("checked", true);
                        } else {
                            $item.attr("checked", false);
                        }
                    }
                    if ($item[0].nodeName === "SPAN") {
                        $item.text(stateMap.unit01[prop]);
                    } else {
                        $item.val(stateMap.unit01[prop]);
                        $item.closest(".form-group-type").find("input[type='hidden']").val(stateMap.unit01[prop]);
                    }
                    break;
                }
            }
        }
    };

    getCoreVersion = function () {
        return $.ajax({
            type: 'GET',
            url: 'http://' + configMap.dtu_server_host + '/getCoreVersion/' + stateMap.dtu_name,
            crossDomain: true
        }).done(function (result) {
            if (result.success) {
                jqueryMap.$coreUpdateTime.text(result.data ? result.data : '');
            }
        }).fail(function () {
            //alert(I18n.resource.debugTools.info.SYSTEM_ERROR);
        })
    };

    synUnit01 = function () {
        spinner.spin(jqueryMap.$container.get(0));
        return WebAPI.ajaxForDebugTool({type: 'GET'}, configMap.dtu_server_host, stateMap.dtu_name, 'synUnit01').done(function (result) {
            if (result.success) {
                stateMap.unit01 = result.data.unit01 ? result.data.unit01 : {};
                freshParamTable(jqueryMap.$formBox);
            }

        }).fail(function () {
            $('#ct_op_server_manage_form').html('<div style="color:red;text-align:center;">' + I18n.resource.common.UNABLE_VISIT + configMap.dtu_server_host + ',' + I18n.resource.common.CHECK_SERVER_NORMAL + '.</div>');
            I18n.fillArea(stateMap.$container);
        }).always(function () {
            spinner.stop();
        });
    };

    restartCore = function () {
        spinner.spin(jqueryMap.$container.get(0));
        WebAPI.ajaxForDebugTool({type: 'POST'}, configMap.dtu_server_host, stateMap.dtu_name, 'restartCore').done(function (result) {
            if (result.success) {
                Alert.success(document.body, I18n.resource.debugTools.info.RESTART_CORE_SUCCESSFUL).showAtTop(2000);
            } else {
                Alert.danger(document.body, result.msg).showAtTop(2000);
            }
        }).always(function () {
            spinner.stop();
        });
    };

    destroyServerDetail = function () {
        clearTimeout(stateMap.serverDetailTimeoutId);
    };

//---------事件---------


//---------Exports---------
    beop.view = beop.view || {};

    beop.view.server_manage = {
        configModel: configModel,
        loadServerDetail: loadServerDetail,
        destroyServerDetail: destroyServerDetail,
        init: init
    };
}(beop || (beop = {})));

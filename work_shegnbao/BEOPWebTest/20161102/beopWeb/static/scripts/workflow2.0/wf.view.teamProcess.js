//工单团队流程
(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/taskTeamProcess.html',
            settable_map: {
                transactions_model: true,
                members_load: $.noop
            },
            transactions_model: null,
            members_load: $.noop
        },
        stateMap = {
            type: '',
            //对编辑的时候当前流程的clone
            currentProcessClone: [],
            //流程
            processList: [],
            //已经在团队架构里面选好的任务
            teamProcessUserMap: [],
            //团队架构里面的团队名称 role
            teamProcessUserGroupRole: [],
            //团队流程人员的行为
            teamProcessUserBehaviorType: [1, 2]
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init;
    var addProcess, confirmProcess, wfDeleteProcessItem, addProcessItem, renderAddedUsersToProcess, addPeopleToProcessDialog, bindEvents,
        onProcessModalOpen, onProcessModalClose, closeProcessModal, refreshModelView, editProcess, removeProcess;
    var addProcessItemFromId, removeProcessItemFromId, removeProcessFromId, refreshProcessItemFromId, bindLabelChangeEvent, getUserHasSelected, getTeamProcessUserMap;

    var getTeamProcess, getTeamProcessInitData;

    var defaultProcess = [];
    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $taskTeamProcessContainer: $container.find('#taskTeamProcessContainer'),
            $wf_add_process_win: $container.find("#wf_add_process_win"),
            $wf_process_item_box: $container.find('#wf_process_item_box'),
            $processModal: $container.find('#wf_process_box'),
            process_select_person_box: null
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
    getTeamProcess = function () {
        return stateMap.processList;
    };
    init = function ($container, data, type) {
        stateMap.$container = $container;
        stateMap.processList = [];
        data ? stateMap.processList = data : stateMap.processList = [];
        stateMap.type = type;
        Spinner.spin(stateMap.$container.get(0));
        stateMap.$container.off('click.wf_add_process').on('click.wf_add_process', '#wf_add_process', addProcess);
        stateMap.$container.off('click.wf-add-process-item').on('click.wf-add-process-item', '.wf-add-process-item', addProcessItem);
        stateMap.$container.off('click.wf-delete-process-item').on('click.wf-delete-process-item', '.wf-delete-process-item', wfDeleteProcessItem);
        stateMap.$container.off('click.add-people-to-process').on('click.add-people-to-process', '.add-people-to-process', addPeopleToProcessDialog);
        stateMap.$container.off('click.edit-process').on('click.edit-process', '.wf_team_process_edit', editProcess);
        stateMap.$container.off('click.remove-process').on('click.wf_team_process_remove', '.wf_team_process_remove', removeProcess);
        WebAPI.get(configMap.htmlURL).done(function (html) {
            getTeamProcessInitData().done(function (result) {
                //TODO 给process item 设置id
                stateMap.processList = result;
                stateMap.$container.empty().html(html);
                setJqueryMap();
                refreshModelView();
                bindEvents();
            });
        }).always(function () {
            Spinner.stop();
        })

    };

    //---------DOM操作------
    refreshModelView = function () {
        jqueryMap.$taskTeamProcessContainer.empty().html($(beopTmpl('wf_task_process', {
            process: defaultProcess.concat(stateMap.processList),
            viewType: stateMap.type
        })).fadeIn(function () {
            I18n.fillArea(jqueryMap.$container);
        }));
    };
    bindEvents = function () {
        //绑定 添加流程模态框关闭和打开
        jqueryMap.$wf_add_process_win.off().on('hide.bs.modal', function (ev) {
            onProcessModalClose(ev);
        }).on('show.bs.modal', function (ev) {
            onProcessModalOpen(ev);
        }).find('.closeProcessModal').off().click(function () {
            closeProcessModal();
        });
        //绑定 编辑新的process
        jqueryMap.$wf_add_process_win.find('#wf_process_name').off().keyup(function () {
            var $parent = $(this).closest('#wf_process_box'), exitsId = $parent.attr('data-process-id'), id, name = $(this).val();

            if (name == "" && !exitsId) return;

            if (exitsId) {
                stateMap.processList.forEach(function (item) {
                    if (item._id && item._id == exitsId) {
                        item.name = name;
                    }
                })
            } else {
                id = ObjectId();
                $parent.attr('data-process-id', id);
                stateMap.processList.push({
                    "_id": id,
                    "name": name,
                    "nodes": [],
                    "type": 1,
                    "isNewProcess": true
                });
                addProcessItem();
                $('#wf_process_nodes').show();
            }
        });
        //点击完成 新流程创建完成
        jqueryMap.$wf_add_process_win.find('#wf_process_create_finish').off().click(function (ev) {
            var $target = $(ev.target), processId = $target.closest('#wf_process_box').attr('data-process-id'), isSuccess = true;
            stateMap.processList.forEach(function (item) {
                if (item._id && item._id == processId) {
                    item.nodes.forEach(function (nodes) {
                        isSuccess = (Object.keys(nodes.arch_type).length) && nodes.behaviour;
                        if (!isSuccess) {
                            return true;
                        }
                    })
                }
            });
            if (isSuccess) {
                refreshModelView();
                jqueryMap.$wf_process_item_box.empty();
                jqueryMap.$wf_add_process_win.modal('hide');
            } else {
                infoBox.alert('还有尚未填写完成的流程!');
                return false;
            }
        });


    };
    bindLabelChangeEvent = function () {
        //process item label change
        jqueryMap.$wf_add_process_win.find('select').off().change(function () {
            var $this = $(this), $parent = $this.closest('label'), childId = $this.closest('.wf_process_item').attr('data-process-item-id'),
                type = $parent.attr('data-type'), parentId = $this.closest('#wf_process_box').attr('data-process-id');
            if (type == 'arch_type') {
                refreshProcessItemFromId(parentId, childId, type, {
                    type: $this.val(),
                    name: $this.find("option:selected").text()
                });
            } else {
                refreshProcessItemFromId(parentId, childId, type, $this.val());
            }
        })
    };
    //获取人物列表
    getTeamProcessUserMap = function () {
        stateMap.teamProcessUserMap = [];
        stateMap.teamProcessUserGroupRole = [];
        var memberIdList = [];
        configMap.members_load().forEach(function (item) {
            stateMap.teamProcessUserGroupRole.push({
                type: item.type,
                name: item.name
            });
            item.members.forEach(function (member) {
                if (memberIdList.indexOf(member.id) === -1) {
                    stateMap.teamProcessUserMap.push({
                        id: member.id,
                        useremail: member.useremail,
                        userfullname: member.userfullname,
                        userpic: member.userpic,
                        type: item.type
                    });
                    memberIdList.push(member.id);
                }
            });
        });
    };
    // 添加流程
    addProcess = function () {
        I18n.fillArea(jqueryMap.$wf_add_process_win);
        getTeamProcessUserMap();
        jqueryMap.$processModal.attr('data-process-id', '');
        jqueryMap.$wf_add_process_win.modal({
            keyboard: false,
            backdrop: 'static'
        });
        jqueryMap.$processModal.attr('data-type', 'new');
        bindLabelChangeEvent();
    };
    // 编辑流程
    editProcess = function () {
        var id = $(this).closest('li').attr('data-process-id');
        if (id) {
            I18n.fillArea(jqueryMap.$wf_add_process_win);
            jqueryMap.$processModal.attr('data-process-id', id);
            jqueryMap.$wf_add_process_win.modal({
                keyboard: false,
                backdrop: 'static'
            });
            var data = {};
            stateMap.processList.forEach(function (item) {
                if (item._id && item._id == id) {
                    data = item;
                    return true;
                }
            });
            jqueryMap.$processModal.attr('data-type', 'edit');
            $('#wf_process_nodes').show();
            jqueryMap.$processModal.find('#wf_process_name').val(data.name);
            //获取选人列表
            getTeamProcessUserMap();

            jqueryMap.$wf_process_item_box.append($(beopTmpl('tpl_wf_team_process_nodes', {
                nodes: data.nodes,
                teamProcessUserGroupRole: stateMap.teamProcessUserGroupRole
            })).fadeIn());

            //绑定事件
            bindLabelChangeEvent();

            //clone
            stateMap.currentProcessClone = [];
            data.nodes.forEach(function (item) {
                stateMap.currentProcessClone.push($.extend(true, [], item));
            });

        } else {
            infoBox.alert('当前process没有id');
        }
    };
    // 删除流程
    removeProcess = function () {
        var id = $(this).closest('li').attr('data-process-id');
        if (id) {
            removeProcessFromId(id);
            refreshModelView();
        } else {
            infoBox.alert('当前process没有id');
        }
    };
    //确认流程
    confirmProcess = function () {
        jqueryMap.$wf_add_process_win.modal('hide');
    };
    addProcessItem = function () { // 添加流程的某一项
        if (jqueryMap.$wf_process_item_box.find('.wf_process_item').length < 6) {
            var parentId = jqueryMap.$processModal.attr('data-process-id'), childId = ObjectId();
            jqueryMap.$wf_process_item_box.append($(beopTmpl('tpl_wf_add_process_one', {
                teamProcessUserGroupRole: stateMap.teamProcessUserGroupRole,
                teamProcessUserBehaviorType: stateMap.teamProcessUserBehaviorType
            })).attr('data-process-item-id', childId).fadeIn());
            addProcessItemFromId(parentId, childId);
            bindLabelChangeEvent();
        } else {
            alert('创建流程最多包含6项');
        }
    };
    wfDeleteProcessItem = function () { // 删除流程的某一项
        if (jqueryMap.$wf_process_item_box.find('.wf_process_item').length > 1) {
            removeProcessItemFromId($(this).closest('.wf_process_box').attr('data-process-id'), $(this).closest('.wf_process_item').attr('data-process-item-id'));
            $(this).closest('.wf_process_item').remove();
        } else {
            alert('创建流程最少包含一项');
        }
    };

    //---------方法---------
    getTeamProcessInitData = function () {
        var $def = $.Deferred();
        if ((stateMap.type == 'show' || stateMap.type == 'edit') && stateMap.processList) {
            $def.resolve(stateMap.processList);
        } else {
            $def.resolve([]);
            /*WebAPI.get('/workflow_process/getAll').done(function (result) {
             if (result.success) {
             $def.resolve(result.data);
             }
             })*/
        }
        return $def;
    };
    //根据id删除对应的process
    removeProcessFromId = function (id) {
        stateMap.processList.forEach(function (item, index, array) {
            if (item._id && item._id == id) {
                array.splice(index, 1);
            }
        })
    };
    //根据process item id 删除 process item
    removeProcessItemFromId = function (parentId, childId) {
        stateMap.processList.forEach(function (item) {
            if (item._id) {
                if (item._id == parentId) {
                    item.nodes.forEach(function (nodes, index, array) {
                        if (nodes.arch_id == childId) {
                            array.splice(index, 1);
                        }
                    })
                }
            } else {
                console.error('当前process item 没有 arch_id !')
            }
        })
    };
    //根据process item id 添加process item
    addProcessItemFromId = function (parentId, childId) {
        stateMap.processList.forEach(function (item, index, array) {
            if (item._id) {
                if (item._id == parentId) {
                    item.nodes.push({
                        "arch_id": childId,
                        "arch_type": {},
                        "behaviour": "",
                        "members": []
                    })
                }
            } else {
                console.error('当前process item 没有 _id !')
            }
        })
    };
    //根据process item id 更改 process item
    refreshProcessItemFromId = function (parentId, childId, type, nodeValue) {
        stateMap.processList.forEach(function (item, index, array) {
            if (item._id && item._id == parentId) {
                if (item.nodes) {
                    item.nodes.forEach(function (nodesItem) {
                        if (nodesItem.arch_id) {
                            if (nodesItem.arch_id == childId) {
                                nodesItem[type] = nodeValue;
                                if (type == 'members') {
                                    console.info('指定到人');
                                    //nodesItem.arch_type.type = 0;
                                } else if (type == "arch_type") {
                                    nodesItem.arch_type = {
                                        type: nodeValue.type,
                                        "name": nodeValue.name
                                    };
                                }
                            }
                        } else {
                            console.error('当前process item nodes 没有 arch_id !')
                        }
                    })
                } else {
                    console.error('当前process item 没有 nodes !')
                }
            }
        });
        //console.log(stateMap.processList)
    };
    //添加流程模态框关闭
    onProcessModalClose = function (ev) {
    };
    //添加流程模态框开启
    onProcessModalOpen = function (ev) {
        $('#wf_process_nodes').hide();
        jqueryMap.$processModal.find('#wf_process_name').val('');
    };
    //关闭流程模态框
    closeProcessModal = function () {
        var id = jqueryMap.$processModal.attr('data-process-id'), type = jqueryMap.$processModal.attr('data-type');
        infoBox.confirm("关闭后将会失去已经配置好的流程，确定关闭？", function () {
            jqueryMap.$wf_add_process_win.modal('hide');
            jqueryMap.$processModal.attr('data-process-id', '');
            jqueryMap.$wf_process_item_box.empty();
            if (id) {
                if (type == 'new') {
                    removeProcessFromId(id);
                } else if (type == 'edit') {

                    //restore data from clone array
                    stateMap.processList.forEach(function (item) {
                        if (item._id == id) {
                            item.nodes = [];
                            stateMap.currentProcessClone.forEach(function (clone) {
                                item.nodes.push(clone);
                            })
                        }
                    });

                    refreshModelView();
                }
            }
        }, function () {
            return false;
        });
    };
    getUserHasSelected = function (parentId, childId) {
        var userHasSelected = [];
        stateMap.processList.forEach(function (item) {
            if (item._id && item._id == parentId) {
                item.nodes.forEach(function (nodes) {
                    if (nodes.arch_id && nodes.arch_id == childId) {
                        if (nodes.arch_type == 0) {
                            userHasSelected = false;
                            return true;
                        } else {
                            userHasSelected = nodes.members || [];
                            return true;
                        }
                    }
                })
            }
        });
        return userHasSelected;
    };
    addPeopleToProcessDialog = function (ev) { // 添加流程窗口弹出选择人物对话框
        var $el = $(ev.target);
        var parentId = $el.closest('.wf_process_box').attr('data-process-id'), childId = $el.closest('.wf_process_item').attr('data-process-item-id');
        var userHasSelectedMap = getUserHasSelected(parentId, childId);
        if (userHasSelectedMap) {
            jqueryMap.process_select_person_box = $el.closest('.wf_process_item').find('.add-person-to-process-box');
            beop.view.memberSelected.configModel({
                userMemberMap: stateMap.teamProcessUserMap,
                cb_dialog_hide: renderAddedUsersToProcess(parentId, childId),
                maxSelected: null,
                userHasSelected: userHasSelectedMap
            });
            beop.view.memberSelected.init($('#wf-outline'));
        } else {
            alert('请先指定人员类型然后进行选人');
        }
    };

    renderAddedUsersToProcess = function (parentId, childId) {
        return function (addedUserList) {
            jqueryMap.process_select_person_box.html(beopTmpl('tpl_wf_added_member', {members: addedUserList}));
            refreshProcessItemFromId(parentId, childId, 'members', addedUserList);
        }
    };
    //---------事件---------


    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.teamProcess = {
        configModel: configModel,
        init: init,
        getTeamProcess: getTeamProcess
    };
}(beop || (beop = {})));

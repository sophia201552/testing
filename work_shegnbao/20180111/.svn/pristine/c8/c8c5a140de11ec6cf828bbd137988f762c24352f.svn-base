//工单团队流程
(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/taskTeamProcess.html',
            settable_map: {
                transactions_model: true,
                members_load: $.noop,
                getStructureById: $.noop
            },
            transactions_model: null,
            members_load: $.noop,
            getStructureById: $.noop
        },
        stateMap = {
            viewType: '',
            //流程
            processList: [],
            //已经在团队架构里面选好的人物
            processUserMap: {},
            //团队架构里面的团队名称 role
            processUserGroup: []
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init;
    var addProcess, deleteProcessNode, addProcessItem, addPeopleToProcessDialog, bindEvents,
        onProcessModalOpen, onProcessModalClose, closeProcessModal, refreshModelView, editProcess, removeProcess, togglePeople;
    var addProcessNode, removeProcessNode, removeProcessById, refreshProcessNode,
        bindLabelChangeEvent, getUserHasSelected, getProcessUserMap, getProcessById, getProcessNodeById;

    var getTeamProcess;


    var defaultProcess = [{
        _id: ObjectId(),
        type: beop.constants.fieldType.DEFAULT,
        nodes: [{
            _id: ObjectId(),
            behaviour: beop.constants.behaviourType.EXECUTE,
            archType: beop.constants.archType.ALL_MEMBERS
        }, {
            _id: ObjectId(),
            behaviour: beop.constants.behaviourType.VERIFY,
            archType: beop.constants.archType.ALL_MEMBERS
        }]
    }];
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

        stateMap.processList = data ? data : [];
        if (!hasDefaultProcess()) {
            stateMap.processList = defaultProcess.concat(stateMap.processList);
        }

        //set process item custom id
        stateMap.processList.forEach(function (item) {
            item.nodes && item.nodes.forEach(function (node) {
                if (!node['_id']) {
                    node['_id'] = ObjectId();
                }
            })
        });

        stateMap.viewType = type;
        Spinner.spin(stateMap.$container.get(0));
        stateMap.$container.off('click.wf_add_process').on('click.wf_add_process', '#wf_add_process', addProcess);
        stateMap.$container.off('click.wf-add-process-item').on('click.wf-add-process-item', '.wf-add-process-item', addProcessItem);
        stateMap.$container.off('click.wf-delete-process-item').on('click.wf-delete-process-item', '.wf-delete-process-item', deleteProcessNode);
        stateMap.$container.off('click.add-people-to-process').on('click.add-people-to-process', '.add-people-to-process', addPeopleToProcessDialog);
        stateMap.$container.off('click.edit-process').on('click.edit-process', '.wf_team_process_edit', editProcess);
        stateMap.$container.off('click.remove-process').on('click.wf_team_process_remove', '.wf_team_process_remove', removeProcess);
        stateMap.$container.off('click.togglePeople').on('click.togglePeople', '.process-people-show', togglePeople);
        WebAPI.get(configMap.htmlURL).done(function (html) {
            stateMap.$container.empty().html(html);
            setJqueryMap();
            refreshModelView();
            bindEvents();
            I18n.fillArea(stateMap.$container);
        }).always(function () {
            Spinner.stop();
        })

    };
    var hasDefaultProcess = function () {
        for (var i = 0; i < stateMap.processList.length; i++) {
            var process = stateMap.processList[i];
            if (process.type === beop.constants.fieldType.DEFAULT) {
                return true;
            }
        }
    };

    //---------DOM操作------
    refreshModelView = function () {
        var allProcess = stateMap.processList;
        if (!hasDefaultProcess()) {
            allProcess = defaultProcess.concat(stateMap.processList);
        }

        var html = $(beopTmpl('wf_task_process', {
            process: allProcess,
            viewType: stateMap.viewType
        }));
        jqueryMap.$taskTeamProcessContainer.empty().html(html);

        $(".process-people-show").closest('.wf_add_process_people').css('margin-right', '14px').end().siblings('.fuLineBox').css('left', '92px');

        var $process = $('.wf_team_process');
        for (var i = 0; i < $process.length; i++) {
            $process.eq(i).find('.fuLineBox').last().hide();
        }
        I18n.fillArea(jqueryMap.$container);
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
        var nameTimer = null;
        jqueryMap.$wf_add_process_win.find('#wf_process_name').off().keyup(function () {
            var name = $(this).val();
            if (!name) {
                return;
            }
            nameTimer && clearTimeout(nameTimer);
            nameTimer = setTimeout(function () {
                if (!stateMap.processId && stateMap.viewType === beop.constants.viewType.CREATE) {
                    stateMap.processId = ObjectId();
                    stateMap.processList.push({
                        _id: stateMap.processId,
                        name: name.trim(),
                        nodes: [],
                        type: beop.constants.fieldType.CUSTOM
                    });
                    addProcessItem();
                    $('#wf_process_nodes').show();
                } else {
                    var process = getProcessById(stateMap.processId);
                    process['name'] = name.trim();
                }
            }, 500);
        });
        //点击完成 新流程创建完成
        jqueryMap.$wf_add_process_win.find('#wf_process_create_finish').off().click(function (ev) {
            if ($('#wf_process_name').val().length > 15) {
                alert(I18n.resource.workflow.team.WORKFLOW_PEOPLE_NUMBLE);
                return;
            }
            refreshModelView();
            jqueryMap.$wf_process_item_box.empty();
            jqueryMap.$wf_add_process_win.modal('hide');
        });


    };
    bindLabelChangeEvent = function () {
        //process item label change
        jqueryMap.$wf_add_process_win.find('select').off().change(function () {
            var $this = $(this), nodeId = $this.closest('.wf_process_item').attr('data-process-item-id');
            var type = $this.data('type');

            if (type == 'archType') {
                var archType = $this.find('option:selected').data('type');
                if (archType == beop.constants.archType.ALL_MEMBERS) {
                    $this.closest('.wf_process_item').find('.wf-add-user-wrapper').hide();
                } else {
                    $this.closest('.wf_process_item').find('.wf-add-user-wrapper').show();
                }

                var archId = $this.val();

                $this.closest('.wf_process_item').attr('data-process-arch-id', archId);
                //变动arch_name和人员列表
                refreshProcessNode(nodeId, 'arch_id', archId);
                refreshProcessNode(nodeId, 'archType', archType);

                refreshProcessNode(nodeId, 'members', []);
                $this.closest('.wf_process_item').find('.add-person-to-process').empty();
                $this.closest('.wf_process_item').find('.add-person-to-process-box').empty();

                if (archType != beop.constants.archType.ALL_MEMBERS) {//当不是全体成员时候
                    //当前成员组人员是否只有一个，如果只有一个就直接添加
                    var group = beop.view.structure.getStructureById(archId);
                    refreshProcessNode(nodeId, 'archName', group.name);
                    var html = beopTmpl('tpl_wf_added_team_process_member', {members: group.members});
                    $this.closest('.wf_process_item').find('.wf-add-user-wrapper').show();
                    if (group.members && group.members.length == 1) {
                        $this.closest('.wf_process_item').find('.add-person-to-process-box').html(html);
                        refreshProcessNode(nodeId, 'members', group.members);
                    }
                }
            } else {
                refreshProcessNode(nodeId, type, $this.val());
            }
        })
    };
    //获取人物列表
    getProcessUserMap = function () {
        stateMap.processUserMap = {};
        stateMap.processUserGroup = [];
        var allUserMap = {};
        //添加全民参与的人员类型
        [{
            type: beop.constants.archType.ALL_MEMBERS,
            id: ObjectId()
        }].concat(configMap.members_load()).forEach(function (item) {
                stateMap.processUserGroup.push({
                    type: item.type,
                    name: item.name,
                    id: item.id
                });
                if (item.members) {
                    var memberList = [];
                    item.members.forEach(function (member) {
                        memberList.push({
                            id: member.id,
                            useremail: member.useremail,
                            userfullname: member.userfullname,
                            userpic: member.userpic,
                            type: item.type
                        });
                        allUserMap[member.id] = member;
                    });
                    stateMap.processUserMap[item.id] = memberList;
                }
            });
        stateMap.allUsers = [];
        for (var id in allUserMap) {
            if (allUserMap.hasOwnProperty(id)) {
                stateMap.allUsers.push(allUserMap[id]);
            }
        }
    };
    // 添加流程
    addProcess = function () {
        I18n.fillArea(jqueryMap.$wf_add_process_win);
        getProcessUserMap();
        jqueryMap.$wf_add_process_win.modal({
            keyboard: false,
            backdrop: 'static'
        });
        stateMap.viewType = beop.constants.viewType.CREATE;

        bindLabelChangeEvent();
    };
    // 编辑流程
    editProcess = function () {
        stateMap.processId = $(this).closest('li').attr('data-process-id');
        stateMap.viewType = beop.constants.viewType.EDIT;
        if (!stateMap.processId) {
            console.error('当前process没有id');
            return;
        }

        I18n.fillArea(jqueryMap.$wf_add_process_win);
        jqueryMap.$wf_add_process_win.modal({
            keyboard: false,
            backdrop: 'static'
        });
        stateMap.process = getProcessById(stateMap.processId);
        $('#wf_process_nodes').show();
        jqueryMap.$processModal.find('#wf_process_name').val(stateMap.process.name);
        //获取选人列表
        getProcessUserMap();

        stateMap.process.nodes.forEach(function (node) {
            stateMap.processUserGroup.forEach(function (group) {
                if (group.id === node.arch_id) {
                    node.archType = group.type;
                }
            })
        });

        jqueryMap.$wf_process_item_box.append($(beopTmpl('tpl_wf_team_process_nodes', {
            nodes: stateMap.process.nodes,
            processUserGroup: stateMap.processUserGroup
        })).fadeIn());

        //绑定事件
        bindLabelChangeEvent();
    };
    // 删除流程
    removeProcess = function () {
        infoBox.confirm(I18n.resource.workflow.process.DELETE_PROCESS_WARN_MSG, function () {
            var id = $(this).closest('li').data('process-id');
            if (!id) {
                console.error('当前process没有id');
                return;
            }
            removeProcessById(id);
            refreshModelView();
        }.bind(this), $.noop, {type: 'danger'});
    };

    getProcessById = function (processId) {
        return stateMap.processList.find(function (process) {
            return process._id === processId;
        })
    };

    getProcessNodeById = function (process, nodeId) {
        if (!process || !nodeId) {
            alert.danger('error: can\'t find the process or process node');
            return false;
        }
        return process.nodes.find(function (node) {
            return node._id == nodeId;
        });
    };

    // 添加流程的某一项
    addProcessItem = function () {
        var nodeId = ObjectId();
        jqueryMap.$wf_process_item_box.append($(beopTmpl('tpl_wf_add_process_one', {
            processUserGroup: stateMap.processUserGroup,
            nodeId: nodeId,
            behaviors: [beop.constants.behaviourType.EXECUTE, beop.constants.behaviourType.VERIFY]
        })).fadeIn());
        addProcessNode(stateMap.processId, nodeId);
        bindLabelChangeEvent();
    };
    deleteProcessNode = function () { // 删除流程的某一项
        if (jqueryMap.$wf_process_item_box.find('.wf_process_item').length > 1) {
            removeProcessNode($(this).closest('.wf_process_item').attr('data-process-item-id'));
            $(this).closest('.wf_process_item').remove();
        } else {
            alert.danger(I18n.resource.workflow.team.WORKFLOW_SO_ONE_NOTE);
        }
    };

    //---------方法---------

    //根据id删除对应的process
    removeProcessById = function (id) {
        for (var i = 0; i < stateMap.processList.length; i++) {
            var process = stateMap.processList[i];
            if (process && process._id == id) {
                stateMap.processList.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    //根据process item id 删除 process item
    removeProcessNode = function (nodeId) {
        var process = getProcessById(stateMap.processId);
        for (var i = 0; i < process.nodes.length; i++) {
            if (process.nodes[i] && process.nodes[i]._id == nodeId) {
                process.nodes.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    //根据process item id 添加process item
    addProcessNode = function (processId, nodeId) {
        var process = getProcessById(processId);
        if (!process) {
            alert.danger('error: can\'t find the process');
            return false;
        }
        if (!nodeId) {
            nodeId = ObjectId();
        }
        process.nodes.push({
            _id: nodeId,
            arch_id: undefined,
            archType: beop.constants.archType.ALL_MEMBERS,
            behaviour: beop.constants.behaviourType.EXECUTE,
            members: []
        });
    };
    //根据process item id 更改 process item
    refreshProcessNode = function (nodeId, key, value) {
        var process = getProcessById(stateMap.processId);
        if (!process) {
            alert.danger('error: can\' find the  process');
            return false;
        }
        var node = getProcessNodeById(process, nodeId);
        if (node) {
            node[key] = value;
        }
    };
    //添加流程模态框关闭
    onProcessModalClose = function (ev) {
        stateMap.processId = null;
    };
    //添加流程模态框开启
    onProcessModalOpen = function (ev) {
        $('#wf_process_nodes').hide();
        jqueryMap.$processModal.find('#wf_process_name').val('');
    };
    //关闭流程模态框
    closeProcessModal = function () {
        infoBox.confirm(I18n.resource.workflow.team.CONFIRM_CLOSE, function () {
            jqueryMap.$wf_add_process_win.modal('hide');
            jqueryMap.$wf_process_item_box.empty();
            if (!stateMap.processId) {
                refreshModelView();
                return false;
            }
            if (stateMap.viewType === beop.constants.viewType.SHOW) {
                removeProcessById(stateMap.processId);
            }
        });
    };
    getUserHasSelected = function (nodeId) {
        var process = getProcessById(stateMap.processId);
        var node = getProcessNodeById(process, nodeId);
        if (node) {
            return node.members;
        }
    };
    addPeopleToProcessDialog = function (ev) { // 添加流程窗口弹出选择人物对话框
        var $el = $(ev.target), $item = $el.closest('.wf_process_item');
        var archId = $item.attr('data-process-arch-id'), nodeId = $item.attr("data-process-item-id");
        if (!archId) {
            alert(I18n.resource.workflow.team.CHANGE_TEAM);
            return false;
        }

        if (getUserHasSelected(nodeId) && stateMap.processUserMap[archId]) {
            jqueryMap.process_select_person_box = $el.closest('.wf_process_item').find('.add-person-to-process-box');
            beop.view.memberSelected.configModel({
                userMemberMap: stateMap.processUserMap[archId],
                cb_dialog_hide: function (addedUserList) {
                    jqueryMap.process_select_person_box.html(beopTmpl('tpl_wf_added_team_process_member', {members: addedUserList}));
                    refreshProcessNode(nodeId, 'members', addedUserList);
                },
                maxSelected: null,
                userHasSelected: getUserHasSelected(nodeId)
            });
            beop.view.memberSelected.init($('#wf-outline'));
        } else {
            console.error('请先指定人员类型然后进行选人');
        }
    };


    togglePeople = function () {
        var $this = $(this), $item = $this.closest('.wf_add_process_people');
        var archId = $item.attr("data-process-arch-id");
        var nodeId = $item.attr("data-node-id");
        stateMap.processId = $this.closest('li').attr('data-process-id');
        var node = getProcessNodeById(getProcessById(stateMap.processId), nodeId);
        var members = [];
        getProcessUserMap();
        if (node.archType === beop.constants.archType.ALL_MEMBERS) {
            members = stateMap.allUsers;
        } else {
            members = stateMap.processUserMap[archId];
        }
        beop.view.memberSelected.configModel({
            userMemberMap: members,
            maxSelected: null,
            userReadOnly: true,
            userHasSelected: []
        });
        beop.view.memberSelected.init($('#wf-outline'));
    };
    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.teamProcess = {
        configModel: configModel,
        init: init,
        getTeamProcess: getTeamProcess
    };
}(beop || (beop = {})));

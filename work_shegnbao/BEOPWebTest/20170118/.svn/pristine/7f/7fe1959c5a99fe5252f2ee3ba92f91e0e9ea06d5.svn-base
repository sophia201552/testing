(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task_group_add.html',
            settable_map: {
                groupModel: true,
                data: true,
                enableEdit: true,
                navigation: true,
                isProcess: true,
                teamModel: true,
                addGroup: true
            },
            groupModel: null,
            data: null,
            enableEdit: null,
            navigation: null,
            teamModel: null
        },
        stateMap = {
            //当前任务组人员变化的一个cache
            currentTaskGroupUserListCache: null,
            //当前任务组已经存在的人员 arch_id 列表
            taskGroupUser: {},
            team: [],
            teamArchList: {},
            allTeamArchList: {}
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init;

    var getGroupData, setEditJqueryMap, renderAddedUsers, resetData, renderTeamAddUsers, onAddUserDialogOpen, getCheckedProcess,
        onSubmit, setGroupProcessData, onAddTeamUserDialogOpen, onTeamProcessChooseChange, commonInit,
        setGroupMenuStyle, findArchByArchId;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $add_group_form: $container.find('#wf-add-group-form'),
            $add_user_dialog: $container.parent().find('#wf-add-person'),
            $wf_added_user_list: $container.find('.wf-added-user-list'),
            $wf_add_edit_title: $container.find('#wf-group-addOrEdit'),
            $wf_task_group: $container.parent().find('#wf-task-group'),
            $wfTeamProcessChoose: $container.parent().find('.wf-team-process-choose')
        };
        jqueryMap.$wf_added_user_list = jqueryMap.$container.find('.wf-added-user-list');
    };

    configModel = function (input_map) {
        stateMap.addGroup = input_map.addGroup;
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    var mergeArch = function (selectedArch, processes) {
        var selectedArchMap = {};
        stateMap.processes = [];
        stateMap.arch = [];
        if (!selectedArch) {
            selectedArch = [];
        }
        if (selectedArch.length) {
            for (var k = 0; k < selectedArch.length; k++) {
                selectedArchMap[selectedArch[k].id] = selectedArch[k].members;
            }
        } else {
            for (var arch in selectedArch) {
                selectedArchMap[arch] = selectedArch[arch].members;
            }
        }
        var selectedProcessArch = {};
        for (var i = 0; i < processes.length; i++) {
            var process = processes[i];
            stateMap.processes.push(process._id);
            for (var j = 0; j < process.nodes.length; j++) {
                var node = process.nodes[j];
                if (node.archType !== 4) {
                    var members = [];
                    var memberIds = [];
                    if (selectedArchMap[node.arch_id]) {
                        members = members.concat(selectedArchMap[node.arch_id]);
                    }
                    selectedProcessArch[node.arch_id] = {
                        id: node.arch_id,
                        members: members,
                        name: node.archName
                    };
                    memberIds = members.map(function (item) {
                        return item.id
                    });
                    stateMap.arch.push({
                        id: node.arch_id,
                        members: memberIds,
                        name: node.archName,
                        type: node.arch_type && node.arch_type.type
                    });
                }
            }
        }

        var archList = [];
        for (var archId in selectedProcessArch) {
            archList.push(selectedProcessArch[archId]);
        }
        return archList.sort(function (a, b) {
            return a._id > b._id;
        });
    };
    commonInit = function (result) {
        setEditJqueryMap();
        if (configMap.enableEdit) {
            jqueryMap.$wf_add_edit_title.attr('i18n', 'workflow.task.EDIT_TASK_GROUP');
            jqueryMap.$add_group_form.submit(onSubmit);
            jqueryMap.$container.off('click.cancel').on('click.cancel', '.wf-close-edit-work-group', function () {
                beop.view.menu.onMenuItemClick('wf-group-see', ["group", $('#wf-content')[0].dataset.groupNo]);
            })
        } else {
            jqueryMap.$wf_add_edit_title.attr('i18n', 'workflow.task.SEE_TASK_GROUP_INFO');
        }

        jqueryMap.$container.find('#wf-workflow-memberList').closest('.wf-manager-people').hide();
        stateMap.$container.off('click.wf-team-group-people-add').on('click.wf-team-group-people-add', '.wf-team-group-people-add', onAddTeamUserDialogOpen);
        //task group others process choose
        configMap.teamModel.getTeam().done(function (team) {
            if (team.success) {
                //新增项目需要的参数
                stateMap.teamId = team.data.team._id;
                var selectedProcess = {};

                stateMap.team = team.data && team.data.team || [];
                if (result) {
                    jqueryMap.$container.find('.wf-manager-team-people').html(beopTmpl('tpl_wf_team_people', {arch: mergeArch(result.data.arch, result.data.process)})).show();
                    selectedProcess = result.data.process
                }


                jqueryMap.$add_group_form.find('.wf-team-process-choose').empty().html(beopTmpl("wf_team_process_choose_item", {
                    process: stateMap.team.process,
                    selected: selectedProcess
                }));
                team.data.team.arch.forEach(function (item) {
                    stateMap.allTeamArchList[item.id] = item;
                });

                jqueryMap.$wfTeamProcessChoose = jqueryMap.$container.parent().find('.wf-team-process-choose');
                jqueryMap.$wfTeamProcessChoose.find('input[type="checkbox"]').off().change(onTeamProcessChooseChange);

            }
        }).always(function () {
            I18n.fillArea(jqueryMap.$container);
        });
        result && setGroupProcessData(result.data);
    };

    init = function ($container) {
        stateMap.$container = $container;
        Spinner.spin($container.get(0));
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            var availHei = parseInt($(window).width());
            if (availHei <= 1366) {
                $('#wf-content').css({
                    'left': 304 + 'px',
                    'width': 'calc(100% - 308px)',
                    'padding-left': '2px'
                });
            } else {
                $('#wf-content').css({
                    'left': 344 + 'px',
                    'width': 'calc(100% - 348px)',
                    'padding-left': '2px'
                });
            }
            setGroupMenuStyle();
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            resetData();
            //如果为添加项目
            if (stateMap.addGroup) {
                jqueryMap.$add_group_form.html(beopTmpl("tpl_wf_group_process_edit", {
                    data: {
                        creator: {
                            id: AppConfig.userId,
                            userpic: AppConfig.userProfile.picture,
                            userfullname: AppConfig.userProfile.fullname
                        }
                    },
                    enableEdit: configMap.enableEdit,
                    navigation: configMap.navigation,
                    process: []
                }));
                $('.wf-close-edit-work-group').hide();
                commonInit();
                return;
            }
            //编辑项目
            getGroupData(true).done(function (result) {
                if (result.success) {
                    //common
                    jqueryMap.$add_group_form.html(beopTmpl("tpl_wf_group_process_edit", {
                        data: result.data,
                        enableEdit: configMap.enableEdit,
                        navigation: configMap.navigation,
                        process: []
                    }));
                    commonInit(result);
                }
            }).fail(function () {
                Alert.danger(ElScreenContainer, 'Got Data Failed').showAtTop(300);
            }).always(function (result) {
                if (result.msg) {
                    Alert.danger(ElScreenContainer, result.msg).showAtTop(300);
                }
                Spinner.stop();
            });
        });

        //$.spEvent.subEvent(stateMap.$container, 'wf-task-list', loadTaskList);
    };

    //---------DOM操作------
    setEditJqueryMap = function () {
        jqueryMap.$workflowMemberContainer = jqueryMap.$container.find('#wf-workflow-memberList');
    };
    renderAddedUsers = function (addedUserList) {
        stateMap.currentTaskGroupUserListCache = addedUserList;
        jqueryMap.$wf_added_user_list.html(beopTmpl('tpl_wf_added_member', {members: addedUserList}))
    };
    //---------方法---------
    setGroupMenuStyle = function () {
        var groupId = $("#wf-content").attr('data-group-no');
        var $li = $("#wf-task-groups").find('.group-item[data-group-id = "' + groupId + '"]');
        $li.addClass('active').find('.wf-task-edit').addClass('active');
        $li.find('.wf-group-edit').slideDown(); // 页面刷新时用
    };

    resetData = function () {
        stateMap.teamArchList = {};
        stateMap.taskGroupUser = {};
        stateMap.allTeamArchList = {};
        stateMap.team = null;
    };
    findArchByArchId = function (id) {
        var data = {};
        stateMap.team.arch.forEach(function (arch) {
            if (arch.id == id) {
                data = arch;
                return true;
            }
        });
        return data;
    };
    /***
     * 获取选中的流程
     * @returns {Array}
     */
    getCheckedProcess = function () {
        var process = [];
        $('.wf-team-process-choose input[type=checkbox]:checked').each(function (index, checkbox) {
            for (var i = 0; i < stateMap.team.process.length; i++) {
                if (stateMap.team.process[i]._id == $(checkbox).val()) {
                    process.push(stateMap.team.process[i]);
                }
            }
        });
        return process;
    };

    onTeamProcessChooseChange = function () {

        jqueryMap.$container.find('.wf-manager-team-people').html(beopTmpl('tpl_wf_team_people', {
            arch: mergeArch(stateMap.taskGroupUser, getCheckedProcess())
        })).show();
    };
    setGroupProcessData = function (data) {

        stateMap.taskGroup = data;

        data.process.forEach(function (process) {
            if (process) {
                stateMap.teamArchList[process._id] = [];
                process.nodes.forEach(function (node) {
                    var item = $.extend(true, {}, node);
                    item["id"] = node.arch_id;
                    item["name"] = node.name || node.arch_type && node.arch_type.name;
                    stateMap.teamArchList[process._id].push(item);
                });
            }
        });

        data.arch && data.arch.forEach(function (arch) {
            stateMap.taskGroupUser[arch.id] = arch;
        });

    };
    onAddTeamUserDialogOpen = function (ev) {
        var $target = $(ev.target), $parent = $target.closest('.form-team'), arch_id = $parent.attr('data-id'), arch = findArchByArchId(arch_id), userHasSelected = arch.members,
            userMemberMap = stateMap.allTeamArchList[arch_id];
        if (!userHasSelected || !userMemberMap) {
            infoBox.alert("加载任务选择框失败,userMemberMap或者userHasSelected不存在");
            console.warn('arch_id:' + arch_id);
            console.warn("allTeamArchList", stateMap.allTeamArchList);
            return false;
        }
        beop.view.memberSelected.configModel({
            cb_dialog_hide: renderTeamAddUsers($parent, arch_id),
            userHasSelected: stateMap.taskGroupUser[arch_id] ? stateMap.taskGroupUser[arch_id].members : [],
            userMemberMap: userMemberMap.members,
            maxSelected: null
        });
        beop.view.memberSelected.init(jqueryMap.$container.parent());
    };
    getGroupData = function (isProcess) {
        if (isProcess) {
            return WebAPI.get('workflow/taskGroupProcess/get/' + configMap.data.param)
        } else {
            return configMap.groupModel.getGroupData(configMap.data.param);
        }
    };

    //---------事件---------
    renderTeamAddUsers = function ($parent, id) {
        return function (addUserList) {
            if (stateMap.taskGroupUser[id]) {
                stateMap.taskGroupUser[id].members = addUserList;
            } else {
                stateMap.team.process.forEach(function (item) {
                    item.nodes.forEach(function (arch) {
                        if (arch.arch_id == id) {
                            stateMap.taskGroupUser[id] = {
                                id: id,
                                type: arch.behaviour,
                                name: arch.arch_type && arch.arch_type.name,
                                members: addUserList
                            }
                        }
                    });
                });
            }
            mergeArch(stateMap.taskGroupUser, getCheckedProcess());
            $parent.find('.wf-group-people-box').empty().html(beopTmpl('tpl_wf_added_member', {
                members: addUserList
            }));

            //console.log(stateMap.taskGroupUser);
        }
    };
    onAddUserDialogOpen = function () {
        if (stateMap.currentTaskGroupUserListCache) {
            beop.view.memberSelected.configModel({
                cb_dialog_hide: renderAddedUsers,
                userMemberMap: stateMap.currentTaskGroupUserListCache,
                maxSelected: null
            });
            beop.view.memberSelected.init(jqueryMap.$container.parent());
        } else {
            configMap.groupModel.userDialogList().done(function (result) {
                if (result.success) {
                    beop.view.memberSelected.configModel({
                        cb_dialog_hide: renderAddedUsers,
                        userMemberMap: result.data,
                        maxSelected: null
                    });
                    beop.view.memberSelected.init(jqueryMap.$container.parent());
                }
            });
        }
    };
    onSubmit = function () {
        var $form = $(this), i18n = I18n.resource.workflow.common;
        var title_val = $form.find('input[name="name"]').val().trim(),
            detail_val = $form.find('textarea[name="description"]').val().trim();
        $('#wf-task-group').find('.group-item.active span.wf-get-task-group').html(title_val);
        if (title_val === "") {
            Alert.danger($form, i18n.GROUP_NAME_REQUIRED).showAtTop(2000);
            return;
        }
        if (detail_val === "") {
            Alert.danger($form, i18n.DETAIL_REQUIRED).showAtTop(2000);
            return;
        }

        var model = {
            desc: detail_val,
            name: title_val,
            team_id: stateMap.team._id,
            createTime: stateMap.team.createTime,
            arch: undefined,
            process: undefined
        };

        if (stateMap.addGroup) {
            var data = {};

            data.creator = AppConfig.userId;
            //html espace
            data.name = StringUtil.htmlEscape(title_val);
            data.desc = StringUtil.htmlEscape(detail_val);
            data.team_id = stateMap.teamId;
            data.createTime = new Date();
            data.process = stateMap.processes;
            data.arch = stateMap.arch;
            WebAPI.post('workflow/taskGroup/new', data).done(function (result) {
                if (result.success) {
                    ScreenManager.goTo({
                        page: "workflow",
                        type: "transaction",
                        subType: "taskGroup",
                        id: result.data.groupId,
                        taskPage: 1
                    });
                    beop.view.menu_group_list.init($("#wf-outline"));
                }
            })
        } else {
            var id = stateMap.taskGroup._id;
            model.process = stateMap.processes;
            model.arch = stateMap.arch;
            WebAPI.post('/workflow/taskGroupProcess/edit', {
                data: model,
                id: id
            }).done(function (result) {
                if (result.success) {
                    alert.success('success');
                }
            }).always(function () {
                Spinner.stop();
            })
        }

    };
    //---------Exports---------
    beop.view.groupEdit = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

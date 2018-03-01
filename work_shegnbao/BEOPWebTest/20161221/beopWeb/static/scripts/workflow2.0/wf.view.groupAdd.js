(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task_group_add.html',
            settable_map: {
                groupModel: true,
                data: true,
                navigation: true,
                teamModel: false
            },
            groupModel: null,
            data: null,
            navigation: null,
            teamModel: null
        },
        stateMap = {
            usersMap: {},
            addedUserList: [],
            team: [],
            //需要得到任务组的process id 列表
            teamArchList: {},
            //需要得到任务组内process对于的每个nodes的members
            processNodeItemMembers: {}
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, resetData, renderCheckedUsers, renderAddedUsers, onAddUserDialogOpen, renderAddedTeamUsers, onSubmit,
        onTeamProcessChooseChange, onAddTeamUserDialogOpen;
    var findArchByProcessId, findArchByArchId;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $add_group_form: $container.find('#wf-add-group-form'),
            $initMemberSelectedBtn: $container.find('.wf-people-add'),
            $wf_check_result: $container.find('.wf-check-result'),
            $wf_added_user_list: $container.find('#wf-workflow-memberList'),
            $wf_add_edit_title: $container.find('#wf-group-addOrEdit'),
            $wf_task_group: $container.parent().find('#wf-task-group'),
            $wfTeamProcessChoose: $container.find('.wf-team-process-choose'),
            $wfManagerPeople: $container.find('.wf-manager-people'),
            $wfManagerTeamPeople: $container.find('.wf-manager-team-people')
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
        setJqueryMap();
        resetData();
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            configMap.teamModel.getTeam().done(function (result) {
                if (result.success) {
                    stateMap.team = result.data.team;
                    stateMap.teamId = result.data.team._id;
                    I18n.fillArea(stateMap.$container);
                    stateMap.$container.find('#wf-add-group-form').html(beopTmpl('tpl_wf_group_add', {
                        navigation: configMap.navigation,
                        process: stateMap.team.process
                    }));
                    setJqueryMap();
                    stateMap.$container.find('.wf-people-add').off().on('click', onAddUserDialogOpen);
                    stateMap.$container.off('click.wf-team-group-people-add').on('click.wf-team-group-people-add', '.wf-team-group-people-add', onAddTeamUserDialogOpen);
                    jqueryMap.$add_group_form.submit(onSubmit);
                    jqueryMap.$wfTeamProcessChoose.find('input[type="checkbox"]').change(onTeamProcessChooseChange);
                    jqueryMap.$wf_added_user_list = jqueryMap.$container.find('#wf-workflow-memberList');
                    jqueryMap.$wf_add_edit_title.attr('i18n', 'workflow.task.ADD_NEW_TASK_GROUP');
                }
            }).always(function () {
                Spinner.stop();
                I18n.fillArea(jqueryMap.$container);
            });

        }).always(function () {

        });
    };

    //---------DOM操作------
    renderCheckedUsers = function () {
        jqueryMap.$wf_check_result.html(beopTmpl('tpl_wf_dialog_added_member', {members: stateMap.addedUserList}))
    };

    renderAddedUsers = function (addedUserList) {
        stateMap.addedUserList = addedUserList;
        jqueryMap.$wf_added_user_list.html(beopTmpl('tpl_wf_added_member', {members: stateMap.addedUserList}))
    };

    //---------方法---------
    resetData = function () {
        stateMap.team = [];
        stateMap.teamArchList = {};
        stateMap.processNodeItemMembers = {};
        stateMap.teamId = null;
    };
    findArchByProcessId = function (id) {
        var nodesId = [], data = [];
        stateMap.team.process.forEach(function (process) {
            if (process._id == id) {
                process.nodes.forEach(function (node) {
                    nodesId.push(node.arch_id)
                })
            }
        });
        stateMap.team.arch.forEach(function (arch) {
            if (nodesId.indexOf(arch.id) !== -1) {
                data.push($.extend(true, {}, arch));
            }
        });
        return data;
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
    //---------事件---------
    onAddTeamUserDialogOpen = function (ev) {
        var $target = $(ev.target), $parent = $target.closest('.form-team'), nodesId = $parent.attr('data-id');
        var arch = findArchByArchId(nodesId);
        beop.view.memberSelected.configModel({
            cb_dialog_hide: renderAddedTeamUsers($parent, nodesId),
            userMemberMap: arch.members,
            maxSelected: null,
            userHasSelected: stateMap.processNodeItemMembers[nodesId] || null
        });
        beop.view.memberSelected.init(jqueryMap.$container.parent());
    };
    renderAddedTeamUsers = function ($parent, nodesId) {
        return function (addedUserList) {
            stateMap.processNodeItemMembers[nodesId] = addedUserList;
            $parent.find('.wf-group-people-box').html(beopTmpl('tpl_wf_added_member', {members: addedUserList}));
        }
    };
    onAddUserDialogOpen = function () {
        //add
        configMap.groupModel.userDialogList().done(function (result) {
            if (result.success) {
                beop.view.memberSelected.configModel({
                    cb_dialog_hide: renderAddedUsers,
                    userMemberMap: result.data,
                    maxSelected: null,
                    userHasSelected: stateMap.addedUserList
                });
                beop.view.memberSelected.init(jqueryMap.$container.parent());
            }
        });
    };
    onTeamProcessChooseChange = function (ev) {
        var currentArch, $target = $(ev.target), $parent = $target.closest('.checkbox'), processId = $parent.attr('data-id'), type = $parent.attr('data-type');

        currentArch = findArchByProcessId(processId);
        if ($target.hasClass('active')) {
            //删除
            delete stateMap.teamArchList[processId];

        } else {
            //添加
            stateMap.teamArchList[processId] = currentArch;
        }

        stateMap.processNodeItemMembers = {};

        var membersItem = [];
        //通过 teamArchList 得到所有的arch_id，在当前的team里面的process nodes里面找对于的members
        for (var key in stateMap.teamArchList) {
            if (stateMap.teamArchList.hasOwnProperty(key)) {
                stateMap.teamArchList[key].forEach(function (item) {
                    stateMap.team && stateMap.team.process.forEach(function (process) {
                        process.nodes && process.nodes.forEach(function (node) {
                            if (item.id == node.arch_id) {
                                //arch_id 就是 nodeItemId
                                membersItem = stateMap.processNodeItemMembers[node.arch_id];
                                if (membersItem) {
                                    membersItem = membersItem.concat(node.members)
                                } else {
                                    stateMap.processNodeItemMembers[node.arch_id] = node.members
                                }
                            }
                        })
                    });
                });
            }
        }
        var htmlTemplateData = function () {
            var id = [], data = [];
            for (var key in stateMap.teamArchList) {
                if (stateMap.teamArchList.hasOwnProperty(key)) {
                    stateMap.teamArchList[key].forEach(function (item) {
                        if (id.indexOf(item.id) === -1) {
                            data.push(item);
                            id.push(item.id);
                        }
                    })
                }
            }
            return data;
        };
        $target.toggleClass('active');
        if (Object.keys(stateMap.teamArchList).length) {
            stateMap.$container.find('#wf-workflow-memberList').closest('.wf-manager-people').hide();
            stateMap.$container.find('.wf-manager-team-people').html(beopTmpl('tpl_wf_team_people', {
                arch: htmlTemplateData()
            })).show();
        } else {
            stateMap.$container.find('#wf-workflow-memberList').closest('.wf-manager-people').show();
            stateMap.$container.find('.wf-manager-team-people').empty().hide();
        }

        stateMap.$container.find('.wf-manager-team-people').find('.form-team').each(function () {
            var $this = $(this), nodesItemId = $this.attr('data-id');
            $this.find('.wf-group-people-box').empty().html(beopTmpl('tpl_wf_added_member', {members: stateMap.processNodeItemMembers[nodesItemId] || []}));
        });
    };

    onSubmit = function () {
        var $form = $(this), i18n = I18n.resource.workflow.common;
        var title_val = $form.find('input[name="name"]').val().trim(),
            detail_val = $form.find('textarea[name="description"]').val().trim(),
            $group_a = $('#wf-task-groups').find('li').find('a');

        if (title_val === "") {
            Alert.danger($form, i18n.GROUP_NAME_REQUIRED).showAtTop(2000);
            return;
        }
        if (detail_val === "") {
            Alert.danger($form, i18n.DETAIL_REQUIRED).showAtTop(2000);
            return;
        }
        for (var i = 0, iLen = $group_a.length; i < iLen; i++) {
            if (title_val == $($group_a[i]).text().trim()) {
                Alert.danger($form, i18n.NAME_REPEAT).showAtTop(2000);
                return;
            }
        }

        //add
        Spinner.spin(jqueryMap.$wf_task_group.get(0));
        if (Object.keys(stateMap.teamArchList).length) {
            var formData = $form.serializeObject(), data = {}, processIdList = [], archList = [], key;
            data.creator = AppConfig.userId;
            //html espace
            data.name = StringUtil.htmlEscape(formData.name);
            data.desc = StringUtil.htmlEscape(formData.description);
            data.team_id = stateMap.teamId;
            data.createTime = new Date();
            for (key in stateMap.teamArchList) {
                if (stateMap.teamArchList.hasOwnProperty(key)) {
                    processIdList.push(key);
                }
            }
            data.process = processIdList;

            for (key in stateMap.processNodeItemMembers) {
                if (stateMap.processNodeItemMembers.hasOwnProperty(key)) {
                    stateMap.team.arch.forEach(function (arch) {
                        //nodeItemId === arch.id
                        if (arch.id == key) {
                            archList.push({
                                name: arch.name,
                                id: arch.id,
                                type: arch.type,
                                members: (function () {
                                    var data = [];
                                    stateMap.processNodeItemMembers[key].forEach(function (item) {
                                        data.push(item.id);
                                    });
                                    return data;
                                })()
                            })
                        }
                    })
                }
            }
            data.arch = archList;
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
                    Spinner.stop();
                }
            })
        } else {
            //html escape
            // example: "@!#$%'+' "+" % '%' (**)" => "@!#$%NaN"
            var fields = $form.serializeObject();
            for (var fieldsItem in fields) {
                if (fields.hasOwnProperty(fieldsItem)) {
                    fields[fieldsItem] = StringUtil.htmlEscape(fields[fieldsItem])
                }
            }
            configMap.groupModel.addGroup(fields).done(function (result) {
                if (result.success) {
                    Alert.success(ElScreenContainer, i18n_resource.workflow.task.ADD_GROUP_SUCCESS).showAtTop(2000);
                    jqueryMap.$container.find('#wf-group-name').val('');
                    jqueryMap.$container.find('#wf-group-des').val('');
                    jqueryMap.$container.find('#wf-workflow-memberList').empty();
                    jqueryMap.$add_user_dialog.off().on('show.bs.modal', onAddUserDialogOpen);
                }
                beop.view.menu_group_list.configModel({
                    whereComeFrom: 'default'
                });
                location.href = "#page=workflow&type=transaction&subType=taskGroup&id=" + result.data;
                beop.view.menu_group_list.init($('#wf-outline'));
                //beop.view.menu_group_list.init(jqueryMap.$wf_task_group);
                Spinner.stop();
            });
        }
    };


    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.groupAdd = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

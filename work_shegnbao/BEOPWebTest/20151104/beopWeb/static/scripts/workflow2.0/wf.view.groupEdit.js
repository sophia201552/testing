(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task_group_add.html',
            settable_map: {
                group_model: true,
                data: true,
                enableEdit: true
            },
            group_model: null,
            data: null,
            enableEdit: null
        },
        stateMap = {
            usersMap: {},
            addedUserList: []
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init;

    var getGroupData, setEditJqueryMap, renderAddedUsers, onAddUserDialogOpen, onSubmit;
    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $add_group_form: $container.find('#wf-add-group-form'),
            $add_user_dialog: $container.parent().find('#wf-add-person'),
            $wf_added_user_list: $container.find('.wf-added-user-list'),
            $wf_add_edit_title: $container.find('#wf-group-addOrEdit'),
            $wf_task_group: $container.parent().find('#wf-task-group')
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
        Spinner.spin($container.get(0));
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            getGroupData().done(function (result) {
                if (result.success) {
                    jqueryMap.$add_group_form.html(beopTmpl('tpl_wf_group_edit', {
                        data: result.data,
                        enableEdit: configMap.enableEdit
                    }));
                    setEditJqueryMap();
                    jqueryMap.$add_user_dialog.off().on('show.bs.modal', onAddUserDialogOpen);
                    if (configMap.enableEdit) {
                        jqueryMap.$wf_add_edit_title.attr('i18n', 'workflow.task.EDIT_TASK_GROUP');
                        jqueryMap.$add_group_form.submit(onSubmit).find('button.wf-btn-add-group').attr('i18n', 'workflow.task.EDIT_TASK_GROUP_BTN;value=workflow.task.EDIT_TASK_GROUP_BTN;title=workflow.task.EDIT_TASK_GROUP_BTN');
                    } else {
                        jqueryMap.$wf_add_edit_title.attr('i18n', 'workflow.task.SEE_TASK_GROUP_INFO');
                    }
                    //jqueryMap.$add_group_form.submit(onSubmit).find('button.wf-btn-add-group').text('更新');
                    jqueryMap.$wf_added_user_list = jqueryMap.$container.find('.wf-added-user-list');
                    jqueryMap.$workflowMemberContainer.html(beopTmpl('tpl_wf_added_member', {
                        members: result.data.members
                    }));
                    beop.view.memberSelected.configModel({
                        maxSelected: null,
                        userHasSelected: result.data.members
                    });
                }
            }).fail(function () {
                //jqueryMap.$add_group_form.html(beopTmpl('tpl_wf_group_add'));
                Alert.danger(ElScreenContainer, 'Got Data Failed').showAtTop(300);
            }).always(function (result) {
                if (result.msg) {
                    Alert.danger(ElScreenContainer, result.msg).showAtTop(300);
                }
                I18n.fillArea(jqueryMap.$container);
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
        jqueryMap.$wf_added_user_list.html(beopTmpl('tpl_wf_added_member', {members: addedUserList}))
    };
    //---------方法---------

    getGroupData = function () {
        return configMap.group_model.getGroupData(configMap.data.param);
    };

    //---------事件---------

    onAddUserDialogOpen = function () {
        beop.view.memberSelected.configModel({
            cb_dialog_hide: renderAddedUsers,
            maxSelected: null
        });
        beop.view.memberSelected.init(jqueryMap.$container.parent());
    };
    onSubmit = function () {
        Spinner.spin(jqueryMap.$wf_task_group.get(0));
        var $form = $(this);
        configMap.group_model.editGroup(configMap.data.param, $form.serializeObject()).done(function (result) {
            if (result.success) {
                Alert.success(ElScreenContainer, 'edit Group success!').showAtTop(2000);
                beop.view.menu_group_list.configModel({
                    whereComeFrom: 'default'
                });
                beop.view.menu_group_list.init(jqueryMap.$wf_task_group);
                Spinner.stop();
            }
        });
    };
    //---------Exports---------
    beop.view.groupEdit = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

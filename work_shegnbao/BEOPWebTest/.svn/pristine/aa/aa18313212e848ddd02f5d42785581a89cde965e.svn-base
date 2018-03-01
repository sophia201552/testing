(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task_group_add.html',
            settable_map: {
                group_model: true,
                data: true
            },
            group_model: null,
            data: null
        },
        stateMap = {
            usersMap: {},
            addedUserList: []
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, renderCheckedUsers, renderAddedUsers, onAddUserDialogOpen, onSubmit;


    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $add_group_form: $container.find('#wf-add-group-form'),
            $add_user_dialog: $container.parent().find('#wf-add-person'),
            $wf_check_result: $container.find('.wf-check-result'),
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
        setJqueryMap();
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            jqueryMap.$add_group_form.html(beopTmpl('tpl_wf_group_add'));
            jqueryMap.$add_user_dialog.off().on('show.bs.modal', onAddUserDialogOpen);
            jqueryMap.$add_group_form.submit(onSubmit);
            jqueryMap.$wf_added_user_list = jqueryMap.$container.find('.wf-added-user-list');
            jqueryMap.$wf_add_edit_title.attr('i18n', 'workflow.task.ADD_NEW_TASK_GROUP');
        }).always(function () {
            I18n.fillArea(jqueryMap.$container);
        });
    };

    //---------DOM操作------
    renderCheckedUsers = function () {
        jqueryMap.$wf_check_result.html(beopTmpl('tpl_wf_dialog_added_member', {members: stateMap.addedUserList}))
    };

    renderAddedUsers = function (addedUserList) {
        jqueryMap.$wf_added_user_list.html(beopTmpl('tpl_wf_added_member', {members: addedUserList}))
    };

    //---------方法---------

    //---------事件---------
    onAddUserDialogOpen = function () {
        //add
        beop.view.memberSelected.configModel({
            cb_dialog_hide: renderAddedUsers,
            maxSelected: null,
            userHasSelected: null
        });
        beop.view.memberSelected.init(jqueryMap.$container.parent());
    };

    onSubmit = function () {
        Spinner.spin(jqueryMap.$wf_task_group.get(0));
        var $form = $(this);
        //add
        configMap.group_model.addGroup($form.serializeObject()).done(function (result) {
            if (result.success) {
                Alert.success(ElScreenContainer, 'add Group success!').showAtTop(2000);
                jqueryMap.$container.find('#wf-group-name').val('');
                jqueryMap.$container.find('#wf-group-des').val('');
                jqueryMap.$container.find('#wf-workflow-memberList').empty();
               jqueryMap.$add_user_dialog.off().on('show.bs.modal', onAddUserDialogOpen);
            }
            beop.view.menu_group_list.configModel({
                whereComeFrom: 'default'
            });
            beop.view.menu_group_list.init(jqueryMap.$wf_task_group);
            Spinner.stop();
        });

    };


    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.groupAdd = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

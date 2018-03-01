(function (beop) {
    var configMap = {
            settable_map: {
                groupModel: true
            },
            groupModel: null
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $wf_task_groups: $("#wf-task-groups")
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

    init = function ($container, param) {
        stateMap.$container = $container;
        setJqueryMap();
        confirm.danger(I18n.resource.workflow.task.DEL_TASK_GROUP_COMMIT, function () {
            beop.view.menu_group_list.configModel({
                whereComeFrom: 'default'
            });
            configMap.groupModel.deleteGroup(param).done(function (result) {
                if (result.success) {
                    if (jqueryMap.$container.attr("data-group-no") == param) {
                        jqueryMap.$container.html("");
                    }
                    Spinner.spin($container.parent().find('#wf-task-group').get(0));
                    beop.view.menu_group_list.init($container.parent()).always(function () {
                        Spinner.stop();
                    });
                }
            })
        });
    };

    //---------DOM操作------
    //---------方法---------
    //---------事件---------
    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.groupDelete = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

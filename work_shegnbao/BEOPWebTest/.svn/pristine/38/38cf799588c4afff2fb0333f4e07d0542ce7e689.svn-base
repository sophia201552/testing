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
            $wf_del_win: $("#wf-del-win"),
            $wf_event_confirm: $("#wf-event-confirm"),
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

    init = function ($container) {
        stateMap.$container = $container;
        setJqueryMap();
        jqueryMap.$wf_del_win.modal();
        jqueryMap.$wf_event_confirm.off().on('click', function (e) {
            if (jqueryMap.$wf_del_win.attr("data-type") === "taskGroup") {
                var param = jqueryMap.$wf_del_win.attr("data-param");
                beop.view.menu_group_list.configModel({
                    whereComeFrom: 'default'
                });
                configMap.groupModel.deleteGroup(param).done(function (result) {
                    if (result.success) {
                        if (jqueryMap.$container.attr("data-group-no") == param) {
                            jqueryMap.$container.html("");
                        }
                        jqueryMap.$wf_del_win.attr("data-type", "");
                        jqueryMap.$wf_del_win.modal("hide");
                        Spinner.spin($container.parent().find('#wf-task-group').get(0));
                        beop.view.menu_group_list.init($container.parent()).done(function () {

                        }).always(function () {
                            Spinner.stop();
                        }).fail(function () {

                        });
                    }
                });
            }
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

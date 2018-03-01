(function (beop) {
    var configMap = {
            htmlURL: '',
            settable_map: {}
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container
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
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
        });

        //$.spEvent.subEvent(stateMap.$container, 'wf-task-list', loadTaskList);
    };

    //---------DOM操作------


    //---------方法---------


    //---------事件---------


    //---------Exports---------
    beop.view = beop.view || {};
    //TODO
    //beop.view.taskList = {
    //    configModel: configModel,
    //    init: init
    //};
}(beop || (beop = {})));

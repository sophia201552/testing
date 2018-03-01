(function (beop) {
    var configMap = {
            htmlURL: '/static/app/CxTool/views/engineDebugging.html',
            settable_map: {
                sheetModel: true
            },
            sheetModel: null
        },
        stateMap = {

        },
        jqueryMap = {},
        setJqueryMap, configModel,
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
        $.when($.get(configMap.htmlURL)).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();

        })
    };

    //---------DOM操作------


    //---------方法---------


//---------事件---------


//---------Exports---------
    beop.view = beop.view || {};

    beop.view.engine_debugging = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

(function (beop) {
    var configMap = {
            htmlURL: '',
            settable_map: {
                transactions_model: true
            },
            transactions_model: null
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
        stateMap.$container.show();
        setJqueryMap();
        configMap.transactions_model.getTaskProcess().done(function (result) {
            if (result.success) {
                $container.html(beopTmpl('tpl_detail_progress', result));
                jqueryMap.$wf_detail_verticalLine = $container.find("#wf-detail-verticalLine");
                if ($container.find("li").length > 1) {
                    var height = $("#wf-detail-progress .timeLineIcon:last").offset().top - $("#wf-detail-progress .timeLineIcon:first").offset().top;
                    jqueryMap.$wf_detail_verticalLine.css("height", height + "px");
                }
            }
        });
    };

    //---------DOM操作------


    //---------方法---------


    //---------事件---------


    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.progress = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

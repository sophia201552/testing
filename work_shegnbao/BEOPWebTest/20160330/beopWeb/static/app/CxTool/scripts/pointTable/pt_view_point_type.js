(function (beop) {
    var configMap = {
            htmlURL: '/static/app/CxTool/views/pointTypeSet.html',
            settable_map: {
                sheetModel: true
            },
            sheetModel: null
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap, configModel,
        init,
        getPointEditParamsInfo,refreshSourceTypeSelector,
        onAddPointSourceTypeSubmit,onUpdatePointSourceTypeSubmit,onDeletePointType;


    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $point_set_edit: $container.find('#point_set_edit'),
            $point_set_source: $container.find('#point_set_source'),
            $add_source_form: $container.find('.add-source-form'),
            $update_source_form: $container.find('.update-source-form'),
            $del_point_type: $container.find('#del-point-type')
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
        $.when($.get('/point_tool/pointSourceType/getAll'), $.get('/static/app/CxTool/views/pointTypeSet.html')).done(function (sourceTypesResult, resultHtml) {
            if (sourceTypesResult[0].success) {
                stateMap.sourceTypes = sourceTypesResult[0].data;
            } else {
                stateMap.sourceTypes = {};
            }
            stateMap.$container.html(resultHtml[0]);
            setJqueryMap();

            jqueryMap.$point_set_source.change(getPointEditParamsInfo);
            jqueryMap.$add_source_form.submit(onAddPointSourceTypeSubmit);
            jqueryMap.$update_source_form.submit(onUpdatePointSourceTypeSubmit);
            jqueryMap.$del_point_type.click(onDeletePointType);
            refreshSourceTypeSelector();
        });
    };

    //---------DOM操作------


    //---------方法---------

    refreshSourceTypeSelector = function () {
        jqueryMap.$point_set_source.empty().append(beopTmpl('tpl_source_type_options', {sourceTypes: stateMap.sourceTypes}));
    };

//---------事件---------


//---------Exports---------
    beop.view = beop.view || {};

    beop.view.point_type = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

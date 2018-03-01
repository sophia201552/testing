(function (beop) {

    var configMap = {
            htmlURL: '/static/app/CxTool/views/autoMapping.html',
            settable_map: {}
        },
        stateMap = {},
        jqueryMap = {},
        storage, setJqueryMap, configModel, init, destroy,
        renderMappingFields, saveFields, doAutoMapping, closeMappingResult;


    storage = window.localStorage;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $mappingFieldsContainer: $container.find('#mappingFieldsContainer'),
            $saveFields: $container.find('#saveFields'),
            $autoMapping: $container.find('#autoMapping'),
            $mappingResultWrapper: $container.find('#mappingResultWrapper'),
            $mappingResult: $container.find('#mappingResult'),
            $close_mapping_result: $container.find('#closeMappingResult')
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
            setJqueryMap();
            renderMappingFields();
            jqueryMap.$saveFields.click(saveFields);
            jqueryMap.$autoMapping.click(doAutoMapping);
            jqueryMap.$close_mapping_result.click(closeMappingResult);
        });
    };

    //---------DOM操作------


    //---------方法---------
    closeMappingResult = function () {
        jqueryMap.$mappingResultWrapper.slideDown();
        jqueryMap.$mappingResult.empty();
    };

    renderMappingFields = function () {
        spinner.spin(document.body);
        WebAPI.get('/point_tool/pointMappingFields/' + storage.getItem('current_project')).done(function (result) {
            if (result.success) {
                jqueryMap.$mappingFieldsContainer.html(beopTmpl('tpl_fields_table', {fields: result.data}));
                $('[data-toggle="tooltip"]').tooltip();
            }
        }).always(function () {
            spinner.stop();
        })
    };

    destroy = function () {
        if (stateMap.sheetInstance) {
            stateMap.sheetInstance.destroy();
            stateMap.sheetInstance = null;
        }
        clearInterval(stateMap.intervalID);
    };

    saveFields = function () {
        var allFields = [];
        jqueryMap.$mappingFieldsContainer.find('.fields').each(function () {
            var $this = $(this);
            allFields.push({
                word: $this.data('field'),
                example: $this.data('example'),
                value: $this.val(),
                frequency: $this.data('frequency')
            })
        });
        spinner.spin(document.body);
        WebAPI.post('/point_tool/savePointMappingFields/' + storage.getItem("current_project"), {fields: allFields}).done(function (result) {
        }).fail(function () {
            alert('save failed')
        }).always(function () {
            spinner.stop();
        })
    };

    doAutoMapping = function () {
        spinner.spin(document.body);
        WebAPI.get('/point_tool/autoPointMapping/' + storage.getItem("current_project")).done(function (result) {
            if (result.success) {
                location.hash = '#autoMapping/result';
            }
        }).always(function () {
            spinner.stop();
        })
    };


//---------Exports---------
    beop.view = beop.view || {};

    beop.view.autoMapping = {
        configModel: configModel,
        init: init,
        destroy: destroy
    };
}(beop || (beop = {})));

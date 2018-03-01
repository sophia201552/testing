(function (beop) {

    var configMap = {
            htmlURL: '/static/app/CxTool/views/autoMappingResult.html',
            settable_map: {},
            sortIconClass: 'glyphicon glyphicon-sort-by-attributes',
            sortAltIconClass: 'glyphicon glyphicon-sort-by-attributes-alt',
            scoreSort: false
        },
        stateMap = {
            mappingResult: [],
            applyMatchResult: {}//传回后台的数据
        },
        jqueryMap = {},
        storage, setJqueryMap, configModel, init, destroy,
        renderMappingResult, sortByScore, submitMatchResult, applyMatch;


    storage = window.localStorage;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $mappingResultContainer: $container.find('#mappingResultContainer'),
            $submitMappingResult: $container.find('#submitMappingResult')
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
            renderMappingResult();

            //jqueryMap.$mappingResultContainer.on('click', '#scoreOrder', sortByScore);
            jqueryMap.$mappingResultContainer.on('click', '.apply-checkbox', applyMatch);
            jqueryMap.$submitMappingResult.click(submitMatchResult)
        });
    };

    //---------DOM操作------


    //---------方法---------
    sortByScore = function () {
        jqueryMap.$scoreOrder = $('#scoreOrder');
        if (stateMap.scoreSort) {
            stateMap.mappingResult = stateMap.mappingResult.sort(function (a, b) {
                return parseInt(a.score) > parseInt(b.score);
            })
        } else {
            stateMap.mappingResult = stateMap.mappingResult.sort(function (a, b) {
                return parseInt(a.score) < parseInt(b.score);
            })
        }
        stateMap.scoreSort = !stateMap.scoreSort;
        jqueryMap.$mappingResultContainer.html(beopTmpl('tpl_mapping_result_table', {
            mapping: stateMap.mappingResult,
            scoreSort: stateMap.scoreSort
        }));
    };

    applyMatch = function () {
        var $this = $(this);
        var point = $this.val();
        var suggest = $this.data('suggest');
        if ($this.is(':checked')) {
            stateMap.applyMatchResult[point] = suggest;
        } else {
            if (stateMap.applyMatchResult[point]) {
                delete stateMap.applyMatchResult[point];
            }
        }
    };

    destroy = function () {
        if (stateMap.sheetInstance) {
            stateMap.sheetInstance.destroy();
            stateMap.sheetInstance = null;
        }
    };


    renderMappingResult = function () {
        WebAPI.get('/point_tool/getSuggests/' + storage.getItem("current_project")).done(function (result) {
            if (result.success) {
                jqueryMap.$mappingResultContainer.html(beopTmpl('tpl_mapping_result_table', {
                    mapping: result.data.suggests,
                    scoreSort: '',
                    total: result.data.total,
                    matched: result.data.matched
                }));
                stateMap.applyMatchResult = {};
                stateMap.mappingResult = []; //匹配的数据数组用来加载页面
                for (var prop in  result.data) {
                    stateMap.mappingResult.push(result.data[prop]);
                }
            }
        })
    };

    submitMatchResult = function () {
        spinner.spin(document.body);
        WebAPI.post('/point_tool/submitMatchResult/' + storage.getItem("current_project"), stateMap.applyMatchResult).done(function (result) {
            if (result.success) {
                alert('Apply Successfully.');
                location.hash = '#pointMapping';
            }
        }).always(function () {
            spinner.stop();
        })
    };


//---------Exports---------
    beop.view = beop.view || {};

    beop.view.autoMappingResult = {
        configModel: configModel,
        init: init,
        destroy: destroy,
        renderMappingResult: renderMappingResult
    };
}(beop || (beop = {})));

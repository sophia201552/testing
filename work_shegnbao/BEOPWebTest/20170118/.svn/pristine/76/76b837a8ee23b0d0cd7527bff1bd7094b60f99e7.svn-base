(function (beop) {
    var pageSize = 9;
    if ($(window).height() > 800) {
        pageSize = 12;
    }
    var configMap = {
            htmlURL: '/static/app/CxTool/views/autoMapping.html',
            settable_map: {},
            pageSize: pageSize
        },
        stateMap = {
            currentPage: 1,
            pointTotal: 0,
            allResults: null
        },
        jqueryMap = {},
        storage, setJqueryMap, configModel, init, destroy,
        renderMappingFields, saveFields, doAutoMapping, closeMappingResult, paginationRefresh, renderTable;


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
            $close_mapping_result: $container.find('#closeMappingResult'),
            $paginationWrapper: $container.find('#mappingPaginationWrapper')
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
                stateMap.currentPage = 1;
                stateMap.allResults = result.data;
                if (stateMap.allResults.length) {
                    renderTable();
                }
                $('[data-toggle="tooltip"]').tooltip();
            }
        }).always(function () {
            spinner.stop();
        })
    };

    renderTable = function () {
        var startIndex, endIndex, allPage, allNum = stateMap.allResults.length;
        startIndex = (stateMap.currentPage - 1) * (configMap.pageSize);
        allPage = allNum % configMap.pageSize == 0 ? parseInt(allNum / configMap.pageSize) : parseInt(allNum / configMap.pageSize) + 1;
        if (allPage == stateMap.currentPage) {
            if (allNum % configMap.pageSize == 0) {
                endIndex = startIndex + configMap.pageSize;
            } else {
                endIndex = startIndex + allNum % configMap.pageSize;
            }
        } else {
            endIndex = startIndex + configMap.pageSize;
        }
        var currentPointList = [];
        for (var i = startIndex; i < endIndex; i++) {
            currentPointList.push(stateMap.allResults[i]);
        }
        jqueryMap.$mappingFieldsContainer.html(beopTmpl('tpl_fields_table', {fields: currentPointList}));
        paginationRefresh(allNum);
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

    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.pageSize);
        if (!totalNum) {
            return;
        }

        jqueryMap.$paginationWrapper.empty().html('<ul id="mappingPagination" class="pagination fr"></ul>');

        while (totalPages < stateMap.currentPage && stateMap.currentPage > 1) {
            stateMap.currentPage = stateMap.currentPage - 1;
        }
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: stateMap.currentPage ? stateMap.currentPage : 1,
            totalPages: !totalPages ? 1 : totalPages,
            onPageClick: function (event, page) {
                stateMap.currentPage = page;
                renderTable();
            }
        };

        if (stateMap.currentPage) {
            pageOption['startPage'] = stateMap.currentPage ? stateMap.currentPage : 1;
        }

        $("#mappingPagination").twbsPagination(pageOption);
    };


//---------Exports---------
    beop.view = beop.view || {};

    beop.view.autoMapping = {
        configModel: configModel,
        init: init,
        destroy: destroy
    };
}(beop || (beop = {})));
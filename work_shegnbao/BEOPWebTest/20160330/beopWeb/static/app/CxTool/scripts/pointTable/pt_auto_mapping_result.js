(function (beop) {
    var pageSize = 8;
    if ($(window).height() > 800) {
        pageSize = 11;
    }
    var configMap = {
            htmlURL: '/static/app/CxTool/views/autoMappingResult.html',
            settable_map: {},
            sortIconClass: 'glyphicon glyphicon-sort-by-attributes',
            sortAltIconClass: 'glyphicon glyphicon-sort-by-attributes-alt',
            scoreSort: false,
            pageSize: pageSize
        },
        stateMap = {
            currentPage: 1,
            pointTotal: 0,
            mappingResult: [],
            applyMatchResult: {}//传回后台的数据
        },
        jqueryMap = {},
        storage, setJqueryMap, configModel, init, destroy,
        renderMappingResult, sortByScore, submitMatchResult, applyMatch, paginationRefresh, renderTable;


    storage = window.localStorage;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $mappingResultContainer: $container.find('#mappingResultContainer'),
            $submitMappingResult: $container.find('#submitMappingResult'),
            $paginationWrapper: $container.find('#mappingResultPaginationWrapper')
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
    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.pageSize);
        if (!totalNum) {
            return;
        }

        jqueryMap.$paginationWrapper.empty().html('<ul id="mappingResultPagination" class="pagination fr" style="margin: 5px;"></ul>');

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

        $("#mappingResultPagination").twbsPagination(pageOption);
    };

    renderTable = function () {
        var startIndex, endIndex, allPage, allNum = stateMap.mappingResult[0];
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

        var mappingResultList = Object.keys(stateMap.mappingResult[1]);
        var currentPointList = [];

        for (var i = startIndex; i < endIndex; i++) {
            for (var prop in stateMap.mappingResult[1]) {
                if (prop == mappingResultList[i]) {
                    currentPointList.push(stateMap.mappingResult[1][prop]);
                    break;
                }
            }
        }
        jqueryMap.$mappingResultContainer.html(beopTmpl('tpl_mapping_result_table', {
            mapping: currentPointList,
            scoreSort: '',
            total: stateMap.mappingResult[2],
            matched: stateMap.mappingResult[0]
        }));
        paginationRefresh(allNum);
    };

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
                stateMap.currentPage = 1;
                stateMap.applyMatchResult = {};
                stateMap.mappingResult = []; //匹配的数据数组用来加载页面
                for (var prop in  result.data) {
                    stateMap.mappingResult.push(result.data[prop]);
                }
                if (stateMap.mappingResult[0]) {
                    renderTable();
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

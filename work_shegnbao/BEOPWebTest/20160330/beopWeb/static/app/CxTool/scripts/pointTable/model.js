(function (beop) {
    //公用
    var configMap = {
            date_format_full: 'yyyy-MM-dd HH:mm:ss',
            date_format_YMD: 'yyyy-MM-dd'
        },
        stateMap = {},
        isFake,
        emit,
        init;

    //是否假数据
    isFake = false;
    //isFake = true;
    emit = isFake ? beop.fake.emit : beop.data.emit;
    //------methods defined----------

    //------models defined----------
    var sheetModel, dtuModel;

    //------activitiesModel---------
    var importSheet, exportSheet, getSheet, getCloudSheet, getMappingSheet, searchCloudPoint, searchEnginePoint, searchRealDataPoint,
        loadServerStatus;
    sheetModel = (function () {
        importSheet = function () {

        };

        exportSheet = function (projectId) {
            return emit(beop.apiMap.exportSheet, {'project_id': projectId});
        };

        getSheet = function (projectId, current_page, page_size, search_text) {
            return emit(beop.apiMap.getSheet, {
                'project_id': projectId,
                "current_page": current_page,
                "page_size": page_size,
                "search_text": search_text
            });
        };

        getCloudSheet = function (projectId, current_page, page_size, search_text) {
            return emit(beop.apiMap.getCloudSheet, {
                'project_id': projectId,
                "current_page": current_page,
                "page_size": page_size,
                "search_text": search_text
            });
        };

        getMappingSheet = function (projectId, current_page, page_size, text, mapped) {
            var opts = {
                'project_id': projectId,
                "current_page": current_page,
                "page_size": page_size
            };
            if (!mapped) {
                mapped = 'all';
            }
            opts['mapped'] = mapped;
            if (text) {
                opts['text'] = text;
                return emit(beop.apiMap.getMappingSheetBySearch, opts);
            }
            return emit(beop.apiMap.getMappingSheet, opts);
        };

        searchCloudPoint = function (projectId, text) {
            return emit(beop.apiMap.searchCloudPoint, {
                'text': text,
                'project_id': projectId
            });
        };

        searchEnginePoint = function (projectId, text, current_page, page_size) {
            if (!current_page) {
                current_page = 1;
            }
            if (!page_size) {
                page_size = 10;
            }
            if (text) {
                return emit(beop.apiMap.searchEnginePointText, {
                    'text': text,
                    'project_id': projectId,
                    'current_page': current_page,
                    'page_size': page_size
                });
            } else {
                return emit(beop.apiMap.searchEnginePoint, {
                    'project_id': projectId,
                    'current_page': current_page,
                    'page_size': page_size
                });
            }
        };

        searchRealDataPoint = function (projectId, text, current_page, page_size) {
            if (!current_page) {
                current_page = 1;
            }
            if (!page_size) {
                page_size = 10;
            }
            if (text) {
                return emit(beop.apiMap.searchRealDataPointText, {
                    'text': text,
                    'project_id': projectId,
                    'current_page': current_page,
                    'page_size': page_size
                });
            } else {
                return emit(beop.apiMap.searchRealDataPoint, {
                    'project_id': projectId,
                    'current_page': current_page,
                    'page_size': page_size
                });
            }
        };

        loadServerStatus = function () {
            return emit(beop.apiMap.loadServerStatus);
        };

        return {
            importSheet: importSheet,
            exportSheet: exportSheet,
            getSheet: getSheet,
            getCloudSheet: getCloudSheet,
            getMappingSheet: getMappingSheet,
            searchCloudPoint: searchCloudPoint,
            searchRealDataPoint: searchRealDataPoint,
            searchEnginePoint: searchEnginePoint,
            loadServerStatus: loadServerStatus
        }
    })();

    dtuModel = (function () {
        loadServerStatus = function (current_page, page_size) {
            if (!current_page) {
                current_page = 1;
            }
            if (!page_size) {
                page_size = 10;
            }
            return emit(beop.apiMap.loadServerStatus, {
                'current_page': current_page,
                'page_size': page_size
            });
        };

        return {
            loadServerStatus: loadServerStatus
        }
    })();


    //--------------------------------------------------
    init = function () {
    };

    beop.ctModel = {
        init: init,
        sheetModel: sheetModel,
        dtuModel: dtuModel
    }
})
(beop || (beop = {}));
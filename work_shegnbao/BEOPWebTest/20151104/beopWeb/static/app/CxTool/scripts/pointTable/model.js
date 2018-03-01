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
    var sheetModel;

    //------activitiesModel---------
    var importSheet, exportSheet, getSheet;
    sheetModel = (function () {
        importSheet = function () {

        };

        exportSheet = function (projectId) {
            return emit(beop.apiMap.exportSheet, {'project_id': projectId});
        };

        getSheet = function (projectId) {
            return emit(beop.apiMap.getSheet, {'project_id': projectId});
        };

        return {
            importSheet: importSheet,
            exportSheet: exportSheet,
            getSheet: getSheet
        }
    })();


    //--------------------------------------------------
    init = function () {
    };

    beop.ctModel = {
        init: init,
        sheetModel: sheetModel
    }
})
(beop || (beop = {}));
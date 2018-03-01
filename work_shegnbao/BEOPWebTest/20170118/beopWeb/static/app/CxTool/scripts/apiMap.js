(function (beop) {
    beop.apiMethod = {
        get: 'GET',
        post: 'POST'
    };
    var api = {
        'getSheet': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/getPointTable/<project_id>/<current_page>/<page_size>/<search_text>'
        },
        'getCloudSheet': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/getCloudPointTable/<project_id>/<current_page>/<page_size>/<search_text>'
        },
        'getCloudSheetByType': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/getCloudPointTable/<project_id>/<current_page>/<page_size>/<search_text>/<point_type>'
        },
        'getMappingSheet': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/getMappingPointTable/<project_id>/<current_page>/<page_size>/<mapped>/'
        },
        'getMappingSheetBySearch': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/getMappingPointTable/<project_id>/<current_page>/<page_size>/<mapped>/<text>'
        },
        'exportSheet': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/export/<project_id>'
        },
        'searchCloudPoint': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/searchCloudPoint/<project_id>/<text>/'
        },
        'searchEnginePointText': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/searchEnginePoint/<project_id>/<current_page>/<page_size>/<text>/'
        },
        'searchEnginePoint': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/searchEnginePoint/<project_id>/<current_page>/<page_size>/'
        },
        'searchRealDataPointText': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/searchRealDataPoint/<project_id>/<current_page>/<page_size>/<text>/'
        },
        'searchRealDataPoint': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/searchRealDataPoint/<project_id>/<current_page>/<page_size>'
        },
        'loadServerStatus': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/getServerStatus/<current_page>/<page_size>'
        }
    };

    beop.apiMap = $.extend(beop.apiMap || {}, api);

})(beop || (beop = {}));
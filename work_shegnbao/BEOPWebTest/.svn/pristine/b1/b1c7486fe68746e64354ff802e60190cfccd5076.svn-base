(function (beop) {
    beop.apiMethod = {
        get: 'GET',
        post: 'POST'
    };
    var api = {
        'getSheet': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/getPointTable/<project_id>/'
        },
        'exportSheet': {
            'method': beop.apiMethod.get,
            'url': '/point_tool/export/<project_id>'
        }
    };

    beop.apiMap = $.extend(beop.apiMap || {}, api);

})(beop || (beop = {}));
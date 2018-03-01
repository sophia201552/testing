(function (beop) {

    var emit, api, param, data, apiURL, paramRegex = /\<([^\<\>]+)\>/g;

    // parameter list [apiObject, param, data]
    emit = function () {
        if (arguments.length === 0 || !arguments[0]) {
            beop.util.makeError('request error', 'api name is Null');
            return false;
        }
        api = arguments[0];
        apiURL = api.url;

        if (arguments.length === 2) {
            if (paramRegex.test(api.url)) {
                param = arguments[1];
            } else {
                data = arguments[1];
            }
        } else if (arguments.length === 3) {
            param = arguments[1];
            data = arguments[2];
        }


        if (param) {
            apiURL = api.url.replace(paramRegex, function (match, p0) {
                return param[p0];
            });
        }

        if (api.method === beop.apiMethod.get) {
            return WebAPI.get(apiURL);
        } else if (api.method === beop.apiMethod.post) {
            return WebAPI.post(apiURL, data);
        }
    };
    if (beop.data) {
        beop.data.emit = emit;
        beop.data.paramRegex = paramRegex;
    } else {
        beop.data = {
            emit: emit,
            paramRegex: paramRegex
        }
    }

})(beop || (beop = {}));
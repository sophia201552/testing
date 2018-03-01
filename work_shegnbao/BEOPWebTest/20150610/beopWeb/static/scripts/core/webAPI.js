var WebAPI = (function () {
    function WebAPI() {
    }

    WebAPI.post = function (url, data) {
        return $.ajax({ url: url, type: 'POST', data: JSON.stringify(data), contentType: 'application/json' });
    };

    WebAPI.get = function (url) {
        return $.ajax({ url: url, type: 'Get', contentType: 'application/json' });
    };

    WebAPI.getHistoryDS = function (callback) {

    };

    WebAPI.getHistory = function (callback) {

    };

    return WebAPI;
})();
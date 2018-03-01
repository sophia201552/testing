(function (beop) {

    var transactionId = 177, dfd,
        makeFakeTransactionId, getApiName,
        emit, api, param, data;

    makeFakeTransactionId = function () {
        return String(transactionId++);
    };

    getApiName = function (api) {
        if (!api) {
            return false;
        }
        for (var apiName in beop.apiMap) {
            if (beop.apiMap[apiName].url === api.url && beop.apiMap[apiName].method === api.method) {
                return apiName;
            }
        }
        return false;
    };

    emit = function () {
        if (arguments.length === 0 || !arguments[0]) {
            beop.util.makeError('request error', 'api name is Null');
            return false;
        }
        api = arguments[0];

        if (arguments.length === 2) {
            if (beop.data.paramRegex.test(api.url)) {
                param = arguments[1];
            } else {
                data = arguments[1];
            }
        } else if (arguments.length === 3) {
            param = arguments[1];
            data = arguments[2];
        }

        dfd = $.Deferred();
        switch (getApiName(api)) {
            case getApiName(beop.apiMap.addGroup):
                //transactionList.push($.extend({}, data, {id: makeFakeTransactionId()}));
                return dfd.resolve({success: true});
            case getApiName(beop.apiMap.listActivities):
                return $.getJSON('/static/scripts/workflow2.0/fakeData/activities.json').then(function (result) {
                    if (param.startTime) {
                        result.data = result.data.filter(function (item) {
                            return moment(param.startTime).isBefore(item.opTime);
                        });
                    }
                    return dfd.resolve(result);
                });
            case getApiName(beop.apiMap.getTransactionCreatedBy):
                return $.getJSON('/static/scripts/workflow2.0/fakeData/transactions.json').then(function (result) {
                    return dfd.resolve(result);
                });
            case getApiName(beop.apiMap.getTransactionFinishedBy):
                return $.getJSON('/static/scripts/workflow2.0/fakeData/transactions.json').then(function (result) {
                    return dfd.resolve(result);
                });
            case getApiName(beop.apiMap.getTransactionJoinedBy):
                return $.getJSON('/static/scripts/workflow2.0/fakeData/transactions.json').then(function (result) {
                    return dfd.resolve(result);
                });
            case getApiName(beop.apiMap.getTransaction):
                return $.getJSON('/static/scripts/workflow2.0/fakeData/details.json').then(function (result) {
                    return dfd.resolve(result);
                });
            case getApiName(beop.apiMap.getReply):
                return $.getJSON('/static/scripts/workflow2.0/fakeData/replyList.json').then(function (result) {
                    return dfd.resolve(result);
                });
            case getApiName(beop.apiMap.getProgress):
                return $.getJSON('/static/scripts/workflow2.0/fakeData/progress.json').then(function (result) {
                    return dfd.resolve(result);
                });
            default :
            {
                return dfd.reject('can\'t find the api');
            }
        }
    };
    beop.fake = {
        emit: emit,
        makeFakeTransactionId: makeFakeTransactionId
    }
})(beop || (beop = {}));
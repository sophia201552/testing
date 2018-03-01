﻿var WebAPI = (function () {
    //百度统计 置入代码
    var siteId;
    switch (window.location.hostname) {
        case 'beop.rnbtech.com.hk':
            siteId = 'b79c068f77198848e22fe79758836e53';
            break;
        case 'beop6.rnbtech.com.hk':
            siteId = 'f1f6b2b9e6b64592c0b4cb5e9b8bd79e';
            break;
        case 'beopdemo.rnbtech.com.hk':
            siteId = 'ac0df98f274d9a5980a571297248d80b';
            break;
        default:
            break;
    }

    (function () {
        if (siteId) {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?" + siteId;
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        }
    })();


    var mockList = {
        // /analysis/workspace/saveLayout/<userId>/<isTemplate>
        '/static/mock/analysis_workspace_saveLayout.json': /\/analysis\/workspace\/saveLayout\/\d+\/[01]/i,
        // /analysis/template/get/<userId>
        '/static/mock/analysis_template_get.json': /\/analysis\/template\/get\/\d+/i
    };

    function mock(url) {
        var match = null;
        for (var i in mockList) {
            match = url.match(mockList[i]);
            if (match !== null) return i;
        }
        return url;
    }

    function requestFailHandle(result) {
        if (result && result.status == 401) {
            alert(i18n_resource.error.noPermission);
        }
    }

    function WebAPI() {
    }

    WebAPI.isMock = false;

    $.ajaxSetup({
        converters: {"text json": true}, //防止JQuery自动转换JSON格式
        dataFilter: function (result, type) {
            var data = result;

            if (type === 'script') {
                return data;
            } else if (typeof data === 'string') {
                if (/^\s*</.test(data)) {
                    //请求为HTML，直接返回
                    return data;
                }

                try {
                    data = JSON.parse(result);
                } catch (e) {
                    console.log('request error: ' + e + ', the data is :' + data);
                    return data;
                }
            }

            if (data) {
                if (data.error) {
                    switch (data.error) {
                        case 'token_invalid':
                        {
                            console.log(this.url + ' (' + data.error + ': code"' + data.msg + '")');
                            if(typeof LoginValidate != 'undefined'){
                                var validate = new LoginValidate();
                                validate.show();
                                return;
                            }
                            ////TODO 测试confirm
                            confirm(i18n_resource.error.token[data.msg] + '. ' + i18n_resource.error.relogin + '.', function () {
                                if(AppConfig.isMobile){
                                    location.reload();
                                }else {
                                    location.href = '/';
                                }
                            });
                            //throw data.error;
                        }
                        case 'historyData':
                        {
                            console.log(this.url + ' (' + data.error + ': code"' + data.msg + '")');
                            alert(data.msg);
                            return {};
                        }
                        default:
                            break;
                    }
                }

                if (data.code == 403) {
                    console.log(this.url + ' (' + data.msg + '")');
                    alert(I18n.resource.error.noPermission);
                    return {};
                }
            }
            return data;
        }
    });

    WebAPI.post = function (url, data, isMock) {
        var mockUrl;
        isMock = isMock === undefined ? WebAPI.isMock : isMock;
        if (isMock) {
            mockUrl = mock(url);
            if (url !== mockUrl) return this.get(mockUrl, false);
        }
        if (typeof cordova != 'undefined' && AppConfig.host){
            if (url.indexOf('.html') == -1) {
                url = AppConfig.host + url;
            }else if(url[0] == '/'){
                url = url.slice(1)
            }
        }
        return $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).fail(requestFailHandle);
    };

    WebAPI.get = function (url, isMock) {
        isMock = isMock === undefined ? WebAPI.isMock : isMock;
        url = isMock ? mock(url) : url;

        if (window._hmt && url.indexOf('.html') > 0) window._hmt.push(['_trackPageview', url]);    //百度PV信息收集

        if (typeof cordova != 'undefined' && AppConfig.host){
            if (url.indexOf('.html') == -1) {
                url = AppConfig.host + url;
            }else if(url[0] == '/'){
                url = url.slice(1)
            }
        }
        return $.ajax({url: url, type: 'Get', contentType: 'application/json'}).fail(requestFailHandle);
    };

    WebAPI.getHistoryDS = function (callback) {

    };

    WebAPI.getHistory = function (callback) {

    };

    return WebAPI;
})();
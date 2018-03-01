/// <reference path="../lib/jquery-2.1.4.js" />

var Internationalization = (function () {
    function Internationalization(lang, resource) {
        this.type = lang || localStorage["language"];
        this.resource = resource || {};
    }

    Internationalization.prototype = {
        getResource: function () {
            return this.resource;
        },

        //Internationalizate whole page
        fillPage: function () {
            this.fill2($('[i18n]'));
        },

        //Internationalizate the children of this special 'JQuery element'
        fillArea: function (element) {
            //this.fill(element.find('[i18n]'));原来i18n方法
            this.fill2(element.find('[i18n]'));
            try {
                Permission.check(element);
            } catch (e) {
                console.log('check permission failed:' + e);
            }
        },

        fillAreaAttribute: function (element, attributeName) {
            this.fill(element.find('[i18n][' + attributeName + ']'), attributeName);
        },

        fill: function (arrElement, attributeName) {
            for (var i = 0, arrPath, text, len = arrElement.length; i < len; i++) {
                arrPath = arrElement[i].attributes["i18n"].value.split('.');

                text = this.resource;
                for (var j = 0; j < arrPath.length; j++) {
                    text = text && text[arrPath[j]];
                }

                if (!attributeName) {
                    arrElement[i].innerHTML = text;
                }
                else {
                    arrElement[i].setAttribute(attributeName, text);
                }
            }
        },
        getI18nValue: function (i18nKey) {
            if (!i18nKey) {
                return '';
            }
            var arrPath = i18nKey.split('.');

            var text = this.resource;
            for (var j = 0; j < arrPath.length; j++) {
                text = text && text[arrPath[j]];
            }
            return text;
        },

        fill2: function (arrElement) {
            for (var i = 0, len = arrElement.length; i < len; i++) {
                var i18nValue = arrElement[i].attributes["i18n"];
                var items = i18nValue.value.split(';'), item, attrMap;
                for (var j = 0; j < items.length; j++) {
                    item = items[j];
                    if (!item) {
                        continue;
                    }
                    if (item.indexOf('=') === -1) {
                        i18nValue = this.getI18nValue(item);
                        arrElement[i].innerHTML = i18nValue;
                    } else {
                        attrMap = item.split('=');
                        if (!attrMap[0]) {
                            continue;
                        }
                        arrElement[i].setAttribute(attrMap[0], this.getI18nValue(attrMap[1]));
                    }
                }
            }
        },

        //params: strPath: ex, observerScreen.menu.NAV_OBSERVER_TITLE. return: value
        findContent: function (strPath) {
            var arrPath = strPath.split('.');
            var text = this.resource;
            for (var i = 0, len = arrPath.length; i < len; i++) {
                text = text && text[arrPath[i]];
            }
            return text;
        }
    };

    return Internationalization;
})();

//load language
function InitI18nResource(strLanguage, isForce, filePath) {
    var navigatorLan = navigator.userLanguage
    if (!navigatorLan)navigatorLan = navigator.language;
    if (!navigatorLan)navigatorLan = 'en-US';
    if (!strLanguage) {
        strLanguage = localStorage["isUserSelectedLanguage"] || navigatorLan.split('-')[0];
    }
    if (isForce) {
        localStorage["isUserSelectedLanguage"] = strLanguage;
    } else if (localStorage["isUserSelectedLanguage"]) {
        strLanguage = localStorage["isUserSelectedLanguage"];
    }
    // 默认为主网页的 i18n 路径
    filePath = filePath || '/static/views/js/i18n/';
    return $.ajax({
        async: false,
        url: filePath + strLanguage + ".js",
        dataType: "script"
    }).then(function () {
        // 加载成功，将数据递出
        localStorage["language"] = strLanguage;
        return i18n_resource;
    }, function () {
        // 加载失败，则再去请求一次 en.js
        return $.ajax({
            async: false,
            url: filePath + "en.js",
            dataType: 'script'
        }).then(function () {
            localStorage["language"] = "en";
            return i18n_resource;
        }, function () {
            // 再失败，直接返回 {}
            console.warn('i18n files loading failed!');
            return {};
        });
    });
}

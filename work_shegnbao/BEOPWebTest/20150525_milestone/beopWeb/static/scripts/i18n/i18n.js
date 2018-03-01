/// <reference path="../lib/jquery-1.11.1.js" />

var Internationalization = (function () {
    function Internationalization() {
        this.type = localStorage["language"];
        this.resource = JSON.parse(localStorage["i18n"]);
    };

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
                    arrElement[i].textContent = text;
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
                var items = i18nValue.value.split(';'), item, i18nValue, attrMap;
                for (var j = 0; j < items.length; j++) {
                    item = items[j];
                    if (!item) {
                        continue;
                    }
                    if (item.indexOf('=') === -1) {
                        i18nValue = this.getI18nValue(item);
                        arrElement[i].textContent = i18nValue;
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
    }

    return Internationalization;
})();
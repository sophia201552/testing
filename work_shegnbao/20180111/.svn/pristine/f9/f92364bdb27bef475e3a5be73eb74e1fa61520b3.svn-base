/// <reference path="../lib/jquery-2.1.4.js" />

var Internationalization = (function () {
    function Internationalization(lang, resource) {
        this.type = lang || localStorage["language"];
        this.resource = resource || {};

        this.exResource = {};
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
                window.parent.Permission.check(element);
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
        getI18nValue: function (i18nKey,dict) {
            if (!i18nKey) {
                return '';
            }
            var arrPath = i18nKey.split('.');

            var text = this.resource;
            if (!dict){
                text = this.resource;
            }else{
                text = dict;
            }
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
        },
        trans:function(text){
            // var reg = /<\$(\w|\d|\.)+\$>/g;
            // var reg = /<\$\S+\$>/g;
            var reg = /<\$(\w|\.)+\$>/g;
            var dict = {};
            if(!text)return '';
            text = text.replace(/&lt;/g,'<');
            text = text.replace(/&gt;/g,'>');
            var arrStr = text.match(reg);
            arrStr && arrStr.forEach(function(item){
                var value = this.getI18nValue(item.slice(2,-2),this.exResource);
                if (!value)value = '';
                text = text.replace(new RegExp('<\\$'+item.slice(2,-2) +'\\$>','g'),value);
            }.bind(this));
            return text;
        },
        getProjectI18n:function(id,language){
            var _this = this;
            if (!id) id =AppConfig.projectId;
            if(!language)language = AppConfig.language || navigator.language.split('-')[0];
            if (!id)return $.Deferred().reject();
            var $promise = $.Deferred();
            WebAPI.get('/getProjectI18n/' + id).done(function(result){
                if (result.data && result.data.resource){
                    _this.exResource = result.data.resource[language] || {};
                    $promise.resolve();
                }else{
                    $promise.reject();
                }
            }).fail(function(){
                $promise.reject();
            })
            return $promise.promise();
        }
    };

    return Internationalization;
})();

//load language
function InitI18nResource(strLanguage, isForce, filePath) {
    if (!strLanguage) {
        strLanguage = localStorage["language"] || navigator.language.split('-')[0];
    }
    if (isForce) {
        localStorage["language"] = strLanguage;
    } else if (localStorage["language"]) {
        strLanguage = localStorage["language"];
    }
    var resource =typeof i18n_resource != "undefined"? i18n_resource:{};
    // 默认为主网页的 i18n 路径
    filePath = filePath || '/static/views/js/i18n/';
    return $.ajax({
        async: false,
        url: filePath + strLanguage + ".js",
        dataType: "script"
    }).then(function () {
        // 加载成功，将数据递出
        localStorage["language"] = strLanguage;
        //用后台获取页面设置的语言
        document.cookie = 'language=' + strLanguage;
        if (typeof AppConfig == 'undefined'){
            AppConfig = {language:strLanguage};
        }else{
            AppConfig.language = strLanguage;
        }
        resource = $.extend({},resource,i18n_resource)
        return resource;
    }, function () {
        // 加载失败，则再去请求一次 en.js
        return $.ajax({
            async: false,
            url: filePath + "en.js",
            dataType: 'script'
        }).then(function () {
            localStorage["language"] = "en";
            document.cookie = 'language=en';
            if (typeof AppConfig == 'undefined'){
                AppConfig = {language:'en'};
            }else{
                AppConfig.language = 'en';
            }
            resource = $.extend({},resource,i18n_resource)
            return resource;
        }, function () {
            // 再失败，直接返回 {}
            console.warn('i18n files loading failed!');
            return resource;
        });
    });
}

function InitMultiI18nResource(language,scripts){
    if (!language){
        language = localStorage["language"] || navigator.language.split('-')[0];
        if (typeof AppConfig == 'undefined'){
            AppConfig = {language:language};
        }else{
            AppConfig.language = language;
        }
    }
    return getI18nResource(language,scripts)
}

function getI18nResource(language,arrScriptPath){
    var $promise = $.Deferred();
    var arrResourceReq = [];
    var resource = typeof i18n_resource != "undefined"? i18n_resource:{};
    arrScriptPath.forEach(function(item){
        arrResourceReq.push(getOneI18nResource(item,language).then(
            function(){
                resource = $.extend({},resource,i18n_resource)
            }
        ))
    })
    return $.when.apply(null,arrScriptPath).then(function(){
        i18n_resource = resource;
        return resource
    })
}
function getOneI18nResource(path,language){
    return  $.ajax({
            async: false,
            url: path + language + ".js",
            dataType: "script"
        }).then(function () {
            //用后台获取页面设置的语言
            document.cookie = 'language=' + language;
            return i18n_resource;
        }, function () {
            // 加载失败，则再去请求一次 en.js
            return $.ajax({
                async: false,
                url: path + "en.js",
                dataType: 'script'
            }).then(function () {
                return i18n_resource;
            }, function () {
                // 再失败，直接返回 {}
                console.warn('i18n files for ' + path + ' loading failed!');
                return {};
            });
        })
}
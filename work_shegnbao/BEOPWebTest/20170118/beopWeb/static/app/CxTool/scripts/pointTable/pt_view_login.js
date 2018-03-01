(function (beop) {
    var configMap = {
            htmlURL: '/static/app/CxTool/views/toolLogin.html',
            settable_map: {
                sheetModel: true
            },
            sheetModel: null
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap, configModel,
        init,
        onToolLogin;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $toolLoginBtn: $("#toolLoginBtn"),
            $toolLoginName: $("#toolLoginName"),
            $toolLoginPwd: $("#toolLoginPwd")
        };
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container) {
        stateMap.$container = $container;
        $.when($.get(configMap.htmlURL)).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            //I18n.fillArea($(".loginColumns"));
            jqueryMap.$toolLoginBtn.off().on('click', onToolLogin);
        });
    };

    //---------DOM操作------


    //---------方法---------


//---------事件---------
    onToolLogin = function () {
        if ((jqueryMap.$toolLoginName.val() != "") && (jqueryMap.$toolLoginPwd.val() != "")) {
            location.hash = "#pointTable";
        }
    };

//---------Exports---------
    beop.view = beop.view || {};

    beop.view.login = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

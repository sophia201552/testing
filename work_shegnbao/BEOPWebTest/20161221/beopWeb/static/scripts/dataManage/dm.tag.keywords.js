(function (beop) {
    var configMap = {
            htmlURL: '/static/scripts/dataManage/views/dm.keyword.html',
            cb_on_click: $.noop,
            settable_map: {
                cb_on_click: true
            }
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, bindEvent;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container
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
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            bindEvent();
            WebAPI.post('/tag/ThingsName/keywords/get', {
                "projId": AppConfig.projectId
            }).done(function (result) {
                if (result.success) {
                    if (result.data.length) {
                        $("#tagKeywordsUl").empty().html(beopTmpl('tpl_tag_keywords_li', {
                            list: result.data
                        }));
                        $("#keywordsCount").text(result.data.length);
                    }
                }
            });
        });
        //$.spEvent.subEvent(stateMap.$container, 'wf-task-list', loadTaskList);
    };

    //---------DOM操作------

    bindEvent = function () {
        $('#tagKeywords ul').off('click.li').on('click.li', 'li', function () {
            var $this = $(this);
            $this.toggleClass('active').siblings().removeClass('active');
            configMap.cb_on_click($this.data('key'));
        });
    };

    //---------方法---------


    //---------事件---------


    //---------Exports---------
    beop.tag = beop.tag || {};
    //TODO
    beop.tag.keywords = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

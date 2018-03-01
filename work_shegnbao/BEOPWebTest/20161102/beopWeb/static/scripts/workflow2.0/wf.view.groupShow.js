(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task_group.html',
            settable_map: {
                group_model: true
            },
            group_model: null
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init,
        loadTaskDetail, onItemClick;

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
            stateMap.$container.on('click', '[data-topic]', onItemClick);
            stateMap.$container.on('click', '.wf-task-star', function (e) {
                var $this = $(this);
                if ($this.hasClass("glyphicon-star-empty")) {
                    $this.removeClass("glyphicon-star-empty").addClass("glyphicon-star");
                } else {
                    $this.removeClass("glyphicon-star").addClass("glyphicon-star-empty");
                }
            });
        });

        $.spEvent.subEvent(stateMap.$container, 'wf-load-detail', loadTaskDetail);
        //$.spEvent.subEvent(stateMap.$container, 'wf-task-list', loadTaskList);
    };

    onItemClick = function () {
        var $this = $(this);
        var topic = $this.data('topic'), param = $this.data('param');
        $.spEvent.pubEvent(topic, param);
    };

    //---------DOM操作------

    //---------方法---------
    loadTaskDetail = function (event, type, param) {
        beop.view.taskDetail.configModel({
            isAddNewTaskForVerifiersSelected: false
        });
        beop.view.taskDetail.init(stateMap.$container, type);
    };

    //---------事件---------


    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.groupShow = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

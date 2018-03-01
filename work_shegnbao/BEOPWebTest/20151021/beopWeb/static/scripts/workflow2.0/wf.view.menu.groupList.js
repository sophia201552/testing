(function (beop) {
    var configMap = {
            htmlURL: '',
            settable_map: {
                group_model: true,
                whereComeFrom: true
            },
            group_model: null,
            whereComeFrom: null
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, bindCalendarEvents, onGroupTypeChange, onToggleGroup;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $group_ul: $container.find('#wf-task-groups'),
            $group_type_selector: $container.find('#wf-group-type')
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
        setJqueryMap();
        //从哪里请求的 需要加入 任务组列表
        //由于 template 不确定 代码暂时先不优化判断方法
        if (configMap.whereComeFrom == 'calendar') {
            return configMap.group_model.getUserGroups().done(function (result) {
                jqueryMap.$group_ul.html(beopTmpl('tpl_wf_group_list_calendar', result.data));
                jqueryMap.$group_type_selector.on('change', onGroupTypeChange);
                I18n.fillArea(jqueryMap.$container);
            });
        } else if (configMap.whereComeFrom == 'default') {
            return configMap.group_model.getUserGroups().done(function (result) {
                jqueryMap.$group_ul.html(beopTmpl('tpl_wf_group_list', result.data));
                jqueryMap.$edit_group = jqueryMap.$container.find('.edit-group');
                jqueryMap.$edit_group.off().on('click', onToggleGroup);
                I18n.fillArea(jqueryMap.$container);
                jqueryMap.$group_type_selector.on('change', onGroupTypeChange);
            });
        }
    };
    //---------DOM操作------


    //---------方法---------


    //---------事件---------
    onToggleGroup = function () {
        var $this = $(this);
        var $editPanel = $this.closest(".group-item").find(".wf-group-edit");
        $this.closest('#wf-task-groups').find('.wf-group-edit').not($editPanel).hide();
        $editPanel.toggle();
    };

    onGroupTypeChange = function () {
        var $this = $(this);
        if ($this.val() == 0) {
            jqueryMap.$group_ul.find('li').show();
        } else {
            jqueryMap.$group_ul.find('li').not('.wf-get-crumbs').hide();
            jqueryMap.$group_ul.find('li[grouptype=' + $this.val() + ']').show();
        }
        jqueryMap.$group_ul.find('.wf-group-edit').hide();
    };

    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.menu_group_list = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

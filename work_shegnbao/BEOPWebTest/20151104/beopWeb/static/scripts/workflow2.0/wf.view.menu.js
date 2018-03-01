(function () {
    var configMap = {
            htmlURL: '',
            settable_map: {
                menu_model: true
            },
            highlightClass: 'active',

            menu_model: null
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init,
        showDefaultLevelMenu, showLevelMenu,
        onMenuItemClick, onLoadTaskList, attachEvent;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $wf_menu: $container.find('#wf-menu'),
            $wf_main_menu: $container.find('#wf-main-ul'),
            $wf_level_menu: $container.find('#wf-level-menu'),
            $wf_content: $container.find('#wf-content'),
            $wf_content_box: $container.find('#wf-content-box'),
            $wf_task_groups: $container.find('#wf-task-group'),
            $wf_label_ul: $container.find('#wf-label-ul'),
            $wf_del_win: $("#wf-del-win"),
            $wf_label_toggle: $container.find("#wf-label-toggle"),
            $wf_label_edit: $container.find("#wf-label-edit"),
            $wf_level_search: $container.find("#wf-level-search"),
            $wf_label_plus: $container.find("#wf-label-plus"),
            $wf_label_name: $container.find(".wf-label-name")

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
        attachEvent();
        jqueryMap.$wf_menu.on('click', '[data-topic]', onMenuItemClick);
        $.spEvent.subEvent(jqueryMap.$wf_level_menu, 'wf-task-list', onLoadTaskList);
    };

    //---------DOM操作------
    attachEvent = function () {
        jqueryMap.$wf_level_search.keyup(function (e) {
            if (e.keyCode == 13) {
                var val = jqueryMap.$wf_level_search.val();
                if (val !== "") {
                    beop.view.taskList.configModel({
                        enableBack: false
                    });
                    beop.view.taskList.init(jqueryMap.$wf_content).done(function () {
                        $.spEvent.pubEvent('wf-task-list', 'search');
                    });
                }
            }
        });
    };

    showDefaultLevelMenu = function (firstMenuSelector, levelMenuSelector) {
        var highlight = configMap.highlightClass;
        jqueryMap.$wf_main_menu.children().removeClass(highlight).end().children(firstMenuSelector).addClass(highlight);
        jqueryMap.$wf_level_menu.children().removeClass(highlight).filter(levelMenuSelector).addClass(highlight);
        jqueryMap.$wf_level_menu.find('li').removeClass(highlight);
        var $levelMenuDefaultItem = jqueryMap.$wf_level_menu.children(levelMenuSelector).find('[data-type=default]');
        if ($levelMenuDefaultItem.length) {
            $levelMenuDefaultItem.addClass(highlight);
        }
        if (levelMenuSelector == '#levelMeunCalendar') {
            jqueryMap.$wf_content.css({
                'left': 341 + 'px',
                'width': 'calc(100% - 345px)',
                'padding': '5px 10px'
            });
        } else {
            jqueryMap.$wf_content.css({
                'left': 280 + 'px',
                'width': 'calc(100% - 340px)',
                'padding': '20px'
            });
        }
    };

    showLevelMenu = function ($menuItem) {
        if (!$menuItem.hasClass('main-menu')) {
            jqueryMap.$wf_level_menu.find('.' + configMap.highlightClass + ':not(section)').removeClass(configMap.highlightClass);
        }
        $menuItem.addClass(configMap.highlightClass);
    };

    //---------方法---------

    //---------事件---------
    onMenuItemClick = function () {
        var $this = $(this), paramData = $this.data('param');
        var topic = $this.data('topic'), param = null;
        if (paramData) {
            if (typeof paramData === 'string') {
                param = paramData.split(';');
            } else {
                param = paramData;
            }
        }
        var initPromise;
        switch (topic) {
            case 'wf-group-add':
            {
                jqueryMap.$wf_content.attr("data-group-no", "");
                initPromise = beop.view.groupAdd.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-group-edit':
            {
                jqueryMap.$wf_content.attr("data-group-no", param[1]);
                beop.view.groupEdit.configModel({
                    data: {
                        param: param[1],
                        type: 'taskGroup'
                    },
                    enableEdit: true
                });
                initPromise = beop.view.groupEdit.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-group-see':
            {
                jqueryMap.$wf_content.attr("data-group-no", "");
                beop.view.groupEdit.configModel({
                    data: {
                        param: param[1],
                        type: 'taskGroup'
                    },
                    enableEdit: false
                });
                initPromise = beop.view.groupEdit.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-group-delete':
            {
                jqueryMap.$wf_del_win.attr("data-param", $(this).attr("data-param"));
                jqueryMap.$wf_del_win.attr("data-type", "taskGroup");
                initPromise = beop.view.groupDelete.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-group-show':
            {
                initPromise = beop.view.groupShow.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-task-list':
            {
                beop.view.taskList.configModel({
                    enableBack: false
                });
                initPromise = beop.view.taskList.init(jqueryMap.$wf_content);
                beop.view.menu_group_list.configModel({
                    whereComeFrom: 'default'
                });
                beop.view.menu_tag_list.configModel({
                    whereComeFrom: 'default'
                });
                showDefaultLevelMenu('#wf-main-task', '#level-menu-task');
                if ($this.attr('id') === 'wf-main-task') {
                    beop.view.menu_group_list.init(jqueryMap.$wf_task_groups);
                    beop.view.menu_tag_list.init(jqueryMap.$wf_label_ul);
                }
                if ($this.hasClass('group-name')) {
                    beop.model.stateMap.currentGroupId = param[1];
                }
                break;
            }
            case 'wf-firstMenu-change':
            {
                showDefaultLevelMenu('#wf-main-calender', '#levelMeunCalendar');
                Spinner.spin(stateMap.$container.get(0));
                new WorkflowCalendar().show('#wf-content', '#calendar-time').Done(function () {
                    Spinner.stop();
                });
                beop.view.menu_group_list.configModel({
                    whereComeFrom: 'calendar'
                });
                beop.view.menu_group_list.init(jqueryMap.$wf_level_menu.find('#levelMeunCalendar'));
                break;
            }
            case 'wf-task-add':
            {
                jqueryMap.$wf_content.attr("data-group-no", "");
                initPromise = beop.view.taskDetail.init(jqueryMap.$wf_content, 'new');
                showDefaultLevelMenu('#wf-main-task', '#level-menu-task');
                break;
            }
            case 'wf-activities-change':
            {
                initPromise = beop.view.activities.init(jqueryMap.$wf_content, true);
                showDefaultLevelMenu('#wf-main-activity', '#level-menu-activity');
                param = paramData ? paramData : 'today';
                beop.view.taskList.configModel({
                    //给返回activity配置 确定 发布 的topic 和param
                    //$.spEvent.pubEvent(topic, param);
                    spEventActivities: {
                        param: param,
                        topic: topic
                    }
                });
                break;
            }
            case 'wf-task-list-calendar':
            {
                initPromise = $.Deferred().resolve();
                break;
            }
        }
        showLevelMenu($this);
        initPromise && initPromise.done(function () {
            $.spEvent.pubEvent(topic, param);
        });
    };

    onLoadTaskList = function (event, type, param) {
        beop.view.taskList.init(jqueryMap.$wf_content, type);
    };

    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.menu = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

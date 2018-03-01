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
        onMenuItemClick, attachEvent, searchTask;

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
            $wf_label_edit: $container.find("#wf-label-edit"),
            $wf_level_search: $container.find("#wf-level-search"),
            $wf_label_plus: $container.find("#wf-label-plus"),
            $wf_label_name: $container.find(".wf-label-name"),
            $wfInfoConfirm: $container.find("#wfInfoConfirm")
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
        jqueryMap.$wf_menu.eventOn('click', '[data-topic-not-hash]', function (e) {
            var $this = $(this);
            var topic = $this.attr('data-topic-not-hash'), param = [];
            if ($this.attr('data-param')) {
                param = $this.attr('data-param').split(';');
            }
            onMenuItemClick(topic, param);
            if (topic != 'wf-group-delete') {
                $("#wf-task-groups").find('>li').removeClass('active');
                $this.closest('.group-item').addClass("active");
                $this.addClass("active").siblings('li').removeClass('active');
            }
        }, true);
    };

    //---------DOM操作------
    attachEvent = function () {
        jqueryMap.$wf_level_search.keyup(function (e) {
            if (e.keyCode == 13) {
                searchTask();
            }
        });

        $("#wf-task-search").off().click(function () {
            searchTask();
        });
    };

    searchTask = function () {
        beop.view.taskList.configModel({
            enableBack: false
        });
        beop.view.taskList.init(jqueryMap.$wf_content).done(function () {
            if (jqueryMap.$wf_level_search.val() == "") {
                $.spEvent.pubEvent('wf-task-list', 'workingTask');
            } else {
                $.spEvent.pubEvent('wf-task-list', 'search');
            }
        });
    };

    showDefaultLevelMenu = function (firstMenuSelector, levelMenuSelector) {
        var highlight = configMap.highlightClass;
        jqueryMap.$wf_main_menu.children().removeClass(highlight).end().children(firstMenuSelector + '-hash').addClass(highlight);
        jqueryMap.$wf_level_menu.children().removeClass(highlight).filter(levelMenuSelector).addClass(highlight);
        jqueryMap.$wf_level_menu.find('li').removeClass(highlight);
        var $levelMenuDefaultItem = jqueryMap.$wf_level_menu.children(levelMenuSelector).find('[data-type=default]');
        if ($levelMenuDefaultItem.length) {
            $levelMenuDefaultItem.addClass(highlight);
        }

        var availHei = parseInt($(window).width());
        if (availHei <= 1366) {
            if (levelMenuSelector == '') {
                jqueryMap.$wf_content.css({
                    'left': '88px',
                    'width': 'calc(100% - 68px)',
                    'padding': 0
                });
            } else {
                if (levelMenuSelector == '#levelMeunCalendar') {
                    jqueryMap.$wf_content.css({
                        'left': '304px',
                        'width': 'calc(100% - 308px)',
                        'padding': '2px'
                    });
                } else {
                    jqueryMap.$wf_content.css({
                        'left': '248px',
                        'width': 'calc(100% - 308px)',
                        'padding-left': '2px'
                    });
                }
            }
        } else {
            if (levelMenuSelector == '') {
                jqueryMap.$wf_content.css({
                    'left': '108px',
                    'width': 'calc(100% - 88px)',
                    'padding': 0
                });
            } else {
                if (levelMenuSelector == '#levelMeunCalendar') {
                    jqueryMap.$wf_content.css({
                        'left': '349px',
                        'width': 'calc(100% - 353px)',
                        'padding': '2px'
                    });
                } else {
                    jqueryMap.$wf_content.css({
                        'left': '288px',
                        'width': 'calc(100% - 348px)',
                        'padding-left': '2px'
                    });
                }
            }
        }
    };

    showLevelMenu = function ($menuItem) {
        if (!$menuItem.hasClass('main-menu') || $menuItem.attr('data-param') == 'workingTask') {
            jqueryMap.$wf_level_menu.find('.' + configMap.highlightClass + ':not(section)').removeClass(configMap.highlightClass);
        }
        //刚开始进工单进入所有的工单
        if ($menuItem.attr('id') == 'wf-main-task') {
            jqueryMap.$container.find('#wf-task-type').find("li[data-param='workingTask']").addClass(configMap.highlightClass)
        }
        $menuItem.addClass(configMap.highlightClass);
        var hashMap = ScreenManager._getHashParamsMap();
        if (!hashMap) return;
        if (hashMap.type == "activity") {
            $('#level-menu-activity').find('li[data-topic="wf-activities-change"]').removeClass("active").each(function () {
                var $this = $(this);
                if ($this.attr("data-param") == hashMap.subType) {
                    $this.addClass('active');
                }
            })
        } else {
            if (hashMap.subType) {
                switch (hashMap.subType) {
                    case "taskGroup":
                        $('.wf-task-groups').find('li').removeClass('active').end().find(('li[data-group-id="' + hashMap.id + '"]')).addClass('active');
                        break;
                    case "myTags":
                        $('#wf-label-toggle').removeClass('wf-tags-ul-hide').addClass('wf-tags-ul-show');
                        $('#wf-label-form').show().find('li').removeClass('active').end().find('li[data-tag-name="' + hashMap.name + '"]').addClass('active');
                        break;
                }
            }
        }
    };

    //---------方法---------

    //---------事件---------
    onMenuItemClick = function (topic, param) {
        var $this = $(this), $level_menu = $("#wf-level-menu");
        var navigationI18n = {
            'wf-group-add': I18n.resource.workflow.navigation.WF_GROUP_ADD,
            'wf-group-edit': I18n.resource.workflow.navigation.WF_GROUP_EDIT,
            'wf-group-see': I18n.resource.workflow.navigation.WF_GROUP_SEE,
            'wf-task-add': I18n.resource.workflow.navigation.WF_TASK_ADD
        };
        if (beop.model.stateMap.UEInstance) {
            beop.model.stateMap.UEInstance.destroy();
            beop.model.stateMap.UEInstance = null;
        }
        var initPromise;
        switch (topic) {
            case 'wf-group-add':
            {
                beop.view.menu_group_list.configModel({
                    whereComeFrom: 'default'
                });
                showDefaultLevelMenu('#wf-main-project', '#level-menu-group');
                $('#wf-level-menu').show();
                if ($('#wf-task-group').find('li').length == 0) {
                    beop.view.menu_group_list.init($('#wf-outline'), 'taskProject');
                }
                jqueryMap.$wf_content.attr("data-group-no", "");
                beop.view.groupEdit.configModel({
                    data: {
                        param: null,
                        type: 'taskGroup'
                    },
                    addGroup: true,
                    enableEdit: true,
                    navigation: navigationI18n[topic]
                });
                initPromise = beop.view.groupEdit.init(jqueryMap.$wf_content);
                break;
            }
            case 'taskGroupDetail':
            {
                break;
            }
            case 'wf-group-edit':
            {
                Spinner.spin(ElScreenContainer);
                beop.view.menu_group_list.configModel({
                    whereComeFrom: 'default'
                });
                showDefaultLevelMenu('#wf-main-project', '#level-menu-group');
                $('#wf-level-menu').show();
                if ($('#wf-task-group').find('li').length == 0) {
                    beop.view.menu_group_list.init($('#wf-outline'), 'taskProject');
                }
                jqueryMap.$wf_content.attr("data-group-no", param[1]);
                beop.view.groupEdit.configModel({
                    data: {
                        param: param[1],
                        type: 'taskGroup'
                    },
                    enableEdit: true,
                    navigation: navigationI18n[topic]
                });
                initPromise = beop.view.groupEdit.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-group-see':
            {
                jqueryMap.$wf_content.attr("data-group-no", param[1]);
                beop.view.groupEdit.configModel({
                    data: {
                        param: param[1],
                        type: 'taskGroup'
                    },
                    navigation: navigationI18n[topic],
                    enableEdit: false
                });
                initPromise = beop.view.groupEdit.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-group-delete':
            {
                initPromise = beop.view.groupDelete.init(jqueryMap.$wf_content, param[0]);
                break;
            }
            case 'wf-group-show':
            {
                initPromise = beop.view.groupShow.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-task-list':
            {
                $level_menu.show();
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
                break;
            }
            case 'taskGroup':
            {
                break;
            }
            case 'transaction':
            {
                topic = 'wf-task-list';
                $level_menu.show();
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
                showDefaultLevelMenu('#wf-main-project', '#level-menu-group');
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
                $level_menu.show();
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
                initPromise = beop.view.task.init(jqueryMap.$wf_content);
                showDefaultLevelMenu('#wf-main-task', '#level-menu-task');
                break;
            }
            case 'wf-activities-change':
            {
                $level_menu.show();
                initPromise = beop.view.activities.init(jqueryMap.$wf_content, true);
                showDefaultLevelMenu('#wf-main-activity', '#level-menu-activity');
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
            case "taskProject":
            {
                topic = "wf-task-list";
                beop.view.menu_group_list.configModel({
                    whereComeFrom: 'default'
                });
                beop.view.taskList.configModel({
                    enableBack: false
                });
                beop.view.menu_tag_list.configModel({
                    whereComeFrom: 'default'
                });
                showDefaultLevelMenu('#wf-main-project', '#level-menu-group');
                $('#wf-level-menu').show();
                var $levelMenuTask = $('#level-menu-task');
                $levelMenuTask.addClass('task-project');
                $levelMenuTask.find('.wf-task-group-container').show();
                if ($('#wf-task-group').find('li').length == 0) {
                    beop.view.menu_group_list.init($('#wf-outline'), 'taskProject');
                }
                initPromise = beop.view.taskList.init(jqueryMap.$wf_content);
            }
                break;
            case 'wf-task-list-calendar':
            {
                initPromise = $.Deferred().resolve();
                break;
            }
            case 'wf-team-show':
            {
                $level_menu.hide();
                showDefaultLevelMenu('#wf-main-team', '');
                initPromise = beop.view.team.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-summary-show':
            {
                $level_menu.hide();
                showDefaultLevelMenu('#wf-main-summary', '');
                new WorkflowSummary().show('#wf-content')
            }
        }
        if (topic != 'wf-group-delete') {
            showLevelMenu($this);
        }
        initPromise && initPromise.done(function () {
            $.spEvent.pubEvent(topic, param);
        });
    };

    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.menu = {
        configModel: configModel,
        init: init,
        onMenuItemClick: onMenuItemClick,
        showDefaultLevelMenu: showDefaultLevelMenu
    };
}(beop || (beop = {})));

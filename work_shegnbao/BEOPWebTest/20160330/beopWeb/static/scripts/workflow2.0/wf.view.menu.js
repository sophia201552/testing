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
        showDefaultLevelMenu, showLevelMenu, gotoTaskGroup,
        onMenuItemClick, onLoadTaskList, attachEvent, onExtraProgressClick;

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
            $wf_label_name: $container.find(".wf-label-name"),
            $wfPromptWin: $container.find("#wfPromptWin"),
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
        jqueryMap.$wf_menu.eventOn('click', '[data-topic-not-hash]', function () {
            var topic = $(this).attr('data-topic-not-hash'), param = $(this).attr('data-param').split(';');
            onMenuItemClick(topic, param)
        }, true);
        jqueryMap.$wfPromptWin.off().on('click', gotoTaskGroup);
        //$.spEvent.subEvent(jqueryMap.$wf_level_menu, 'wf-task-list', onLoadTaskList);
    };

    //---------DOM操作------
    attachEvent = function () {
        jqueryMap.$wf_level_search.keyup(function (e) {
            if (e.keyCode == 13) {
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
        if (levelMenuSelector == '') {
            jqueryMap.$wf_content.css({
                'left': 100 + 'px',
                'width': 'calc(100% - 80px)',
                'padding': 0
            });
        } else {
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
        var hash, id;
        if (location.hash.indexOf('taskGroup') !== -1) {
            hash = location.hash.substr(1).split('&');
            id = hash[hash.length - 1].split('=')[1];
            $('.wf-task-groups').find('li').removeClass('active').end().find(('li[data-group-id="' + id + '"]')).addClass('active');
        }
        if (location.hash.indexOf('myTags') !== -1 && location.hash.indexOf('transaction') !== -1) {
            hash = location.hash.substr(1).split('&');
            id = hash[hash.length - 1].split('=')[1];
            $('#wf-label-toggle').removeClass('wf-tags-ul-hide').addClass('wf-tags-ul-show');
            $('#wf-label-form').show().find('li').removeClass('active').end().find('li[labelid="' + id + '"]').addClass('active');
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
                beop.view.groupAdd.configModel({
                    navigation: navigationI18n[topic]
                });
                jqueryMap.$wf_content.attr("data-group-no", "");
                showDefaultLevelMenu('#wf-main-task', '#level-menu-task');
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
                    enableEdit: true,
                    navigation: navigationI18n[topic]
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
                    navigation: navigationI18n[topic],
                    enableEdit: false
                });
                initPromise = beop.view.groupEdit.init(jqueryMap.$wf_content);
                break;
            }
            case 'wf-group-delete':
            {
                jqueryMap.$wf_del_win.attr("data-param", param[0]);
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
            case 'taskGroup':
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

                if (!beop.model.stateMap.group_list.length) {
                    initPromise = $.Deferred();
                    var getUserGroups = function () {
                        return WebAPI.get('/workflow/users/group/' + AppConfig.userId);
                    };
                    getUserGroups().done(function (result) {
                        if (!result.data.created.length && !result.data.joined.length) {
                            jqueryMap.$wfPromptWin.find(".infoPrompt").text(I18n.resource.workflow.task.NO_GROUP_PROMPT);
                            jqueryMap.$wfPromptWin.modal();
                            showDefaultLevelMenu('#wf-main-task', '#level-menu-task');
                            return false;
                        } else {
                            beop.view.taskDetail.configModel({
                                navigation: navigationI18n[topic],
                                isAddNewTaskForVerifiersSelected: true
                            });
                            beop.view.taskDetail.init(jqueryMap.$wf_content, 'new').done(function () {
                                initPromise.resolve();
                            })
                        }
                    });
                } else {
                    beop.view.taskDetail.configModel({
                        navigation: navigationI18n[topic],
                        isAddNewTaskForVerifiersSelected: true
                    });
                    initPromise = beop.view.taskDetail.init(jqueryMap.$wf_content, 'new');
                }
                showDefaultLevelMenu('#wf-main-task', '#level-menu-task');
                break;
            }
            case 'wf-activities-change':
            {
                $level_menu.show();
                beop.model.stateMap.lastActivityID = null;
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
                showDefaultLevelMenu('#wf-main-project', '#level-menu-task');
                $('#wf-level-menu').show();
                var $levelMenuTask = $('#level-menu-task');
                $levelMenuTask.addClass('task-project');
                $levelMenuTask.find('.wf-task-group-container').show();
                beop.view.menu_group_list.init($('#wf-outline'), 'taskProject');
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
        }
        showLevelMenu($this);
        initPromise && initPromise.done(function () {
            $.spEvent.pubEvent(topic, param);
        });
    };

    gotoTaskGroup = function () {
        var $this = $(this), paramData = $this.data('param');
        var topic = $this.data('topic'), param = null;
        if (paramData) {
            if (typeof paramData === 'string') {
                param = paramData.split(';');
            } else {
                param = paramData;
            }
        }
        var navigationI18n = {
            'wf-group-add': I18n.resource.workflow.navigation.WF_GROUP_ADD
        };
        var initPromise;
        beop.view.groupAdd.configModel({
            navigation: navigationI18n[topic]
        });
        jqueryMap.$wf_content.attr("data-group-no", "");
        initPromise = beop.view.groupAdd.init(jqueryMap.$wf_content);
        showLevelMenu($this);
        initPromise && initPromise.done(function () {
            $.spEvent.pubEvent("wf-group-add", param);

        });
        jqueryMap.$wfPromptWin.modal("hide");
    };

    onExtraProgressClick = function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
    };
    onLoadTaskList = function (event, type) {
        beop.view.taskList.init(jqueryMap.$wf_content, type);
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
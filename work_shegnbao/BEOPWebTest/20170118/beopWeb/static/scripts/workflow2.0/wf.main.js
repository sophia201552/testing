(function () {
    var stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        init, show, close, action;

    setJqueryMap = function () {
        var $container = stateMap.$container,
            $content = $container.find('#wf-content');

        jqueryMap = {
            $container: $container,
            $main_menu: $container.find('#wf-main-menu'),
            $level_menu: $container.find('#wf-level-menu'),
            $content: $content,
            $content_wrapper: $content.find('#wf-content-wrapper'),
            $content_box: $content.find('#wf-content-box')
        };
    };

    show = function (router) {
        beop.model.stateMap.routerSubType = '';
        if ($('#wf-outline').length) {
            action(router);
        } else {
            window.workflow.prototype.init($(ElScreenContainer)).done(function () {
                action(router);
            });
        }
    };
    close = function () {

    };

    action = function (router) {
        var routerType = router.type;

        var actionError = function () {
            console.error('无法识别的location hash!');
            //window.location.href = '/';
            return true;
        };

        var transactionCommon = function (router) {
            if ((router.type !== 'taskProject' && router.type !== "transaction") || router.subType == "workingTask") {
                $('#level-menu-task').removeClass('task-project').find('.wf-task-group-container').hide();
            }
            beop.view.taskList.configModel({
                enableBack: false
            });
            beop.view.menu_group_list.configModel({
                whereComeFrom: 'default'
            });
            beop.view.menu_tag_list.configModel({
                whereComeFrom: 'default'
            });
        };

        var transactionAction = function (router) {

            var type = router.type, subType = router.subType, transactionId = router.transactionId, id = router.id;
            var subTypeListTop = ["workingTask", "history", "newCreate", "inDoing", "waitVerifier", "waitMeToVerifier", "finishedBy", "taskStop", "taskComplete", "createdBy", "joinedBy", 'myCollection'];
            var subTypeListBottom = ['wf-group-add', 'wf-task-add', 'wf-task-list', 'taskGroup', 'taskGroupDetail', 'addTransaction', 'addTaskGroup', 'myTags'];

            jqueryMap.$level_menu.show();
            if (subType && (subTypeListTop.concat(subTypeListBottom)).indexOf(subType.toString()) == -1) {
                actionError();
            } else {
                var isActivity = $('#wf-main-activity-hash').hasClass('active');
                transactionCommon(router);

                //如果用户没有团队
                if (!beop.model.stateMap.isUserHasTeam) {
                    ScreenManager.goTo({
                        page: "workflow",
                        type: "team"
                    });
                    return false;
                }

                if (isActivity && transactionId) {
                    beop.view.task.init($('#wf-content'), transactionId);
                } else if (!$('#wf-main-task-hash').hasClass('active') && subTypeListBottom.indexOf(router.subType) == -1) {
                    jqueryMap.$main_menu.find('#wf-main-task-hash').trigger('click');
                    beop.view.menu_tag_list.init($('#wf-label-ul'));

                    //暂时处理,如有点击切换导航过程中#wf-content显示缺陷,再更正;
                    $('#wf-content').css({
                        'left': 304 + 'px',
                        'width': 'calc(100% - 308px)',
                        'padding-left': '2px'
                    });
                } else if ($('#wf-task-groups').children().length <= 0) {
                    beop.view.menu_group_list.init($('#wf-outline'));
                    beop.view.menu_tag_list.init($('#wf-label-ul'));
                }
                if ((subType && id) || subTypeListBottom.indexOf(subType) !== -1) {
                    var hashMap = ScreenManager._getHashParamsMap();
                    switch (subType.toString()) {
                        case "taskGroup":
                            beop.model.stateMap.currentGroupId = router.id;
                            beop.view.menu.onMenuItemClick(subType, ['group', router.id]);
                            break;
                        case "taskGroupDetail":
                            beop.model.stateMap.currentGroupId = router.id;
                            beop.view.menu.onMenuItemClick(subType, ['group', router.id]);
                            break;
                        case "myTags":
                            beop.view.menu.onMenuItemClick('wf-task-list', ['tag', hashMap.name]);
                            break;
                        case "calendar":
                            beop.view.task.configModel();
                            break;
                        case "addTransaction":
                            beop.model.stateMap.currentGroupId = hashMap.groupId;
                            //beop.view.menu.onMenuItemClick('wf-task-add', ['wf-task-add']);
                            beop.view.task.init($('#wf-content'));
                            break;
                        case "addTaskGroup":
                            beop.view.menu.onMenuItemClick('wf-group-add', ['wf-group-add']);
                            break;
                    }
                }

                setTimeout(function () {

                    //如果有subType的话进入工单二级菜单
                    if (type && subTypeListTop.indexOf(subType) !== -1) {
                        beop.view.menu.showDefaultLevelMenu('#wf-main-task', '#level-menu-task');
                        jqueryMap.$level_menu.find('[data-param=' + subType + ']').closest('ul').find('li.active').removeClass('active').end().end().addClass('active');
                        if ($('#wf-taskMine-content').length && subType != 'taskGroup') {
                            $.spEvent.pubEvent('wf-task-list', subType);
                        } else {
                            if (subTypeListBottom.indexOf(router.subType) == -1) {
                                beop.view.taskList.init(jqueryMap.$container.find('#wf-content')).done(function () {
                                    $.spEvent.pubEvent('wf-task-list', subType);
                                });
                            } else {
                                $.spEvent.pubEvent('wf-task-list', subType);
                            }
                        }
                    }
                    if (transactionId) {
                        beop.view.task.init($('#wf-content'), transactionId);
                    }
                }, 300);
            }
        };

        var activityAction = function (router) {
            var subType = router.subType, subTypeList = ['activity', 'today', 'yesterday', 'thisWeek', 'thisMonth', 'latestCompleted', 'latestCreated'];
            if (subType && subTypeList.indexOf(subType.toString()) == -1) {
                actionError();
            } else {
                beop.view.menu.onMenuItemClick('wf-activities-change', [subType, 1]);
            }
        };
        var calendarAction = function (router) {
            if (router.subType && router.id) {
                //如果默认不在日程里面，就主动触发一次
                if (!$('#wf-main-calender-hash').hasClass('active')) {
                    beop.view.menu.onMenuItemClick('wf-firstMenu-change', []);
                }
                beop.view.menu.onMenuItemClick('wf-task-list-calendar', ['group', router.id]);
            } else {
                beop.view.menu.onMenuItemClick('wf-firstMenu-change', []);
            }
        };
        switch (routerType) {
            //加载工单列表和工单详情
            case 'transaction':
                transactionAction(router);
                break;
            //加载动态
            case "activity":
                activityAction(router);
                break;
            case "calendar":
                calendarAction(router);
                break;
            case "team":
                beop.view.menu.onMenuItemClick('wf-team-show', []);
                break;
            case "taskProject":
                beop.model.stateMap.currentGroupId = router.id;
                if (router.subType == 'taskGroupDetail') {
                    beop.view.menu.onMenuItemClick(router.subType, ['group', router.id]);
                } else {
                    beop.view.menu.onMenuItemClick('taskProject', ['group', router.id]);
                }
                break;
            default:
                jqueryMap.$main_menu.find('#wf-main-task').trigger('click');
        }

    };

    init = function ($container) {
        stateMap.$container = $container;
        Spinner.spin($container.get(0));
        var $def = $.Deferred();
        WebAPI.get("/static/views/workflow/outline.html").done(function (resultHtml) {
            var $ElScreenContainer = $(ElScreenContainer);
            $ElScreenContainer.html(resultHtml);
            setJqueryMap();
            I18n.fillArea($container);
            var language = localStorage.getItem('language');
            if (language === 'zh') {
                moment.locale('zh-cn');
            } else {
                moment.locale('en');
            }
            //------------configure and initialize Models
            beop.model.init();

            //------------configure and initialize views
            beop.view.activities.configModel({
                activities_model: beop.model.activitiesModel,
                transactions_model: beop.model.transactionsModel,
                reply_mode: beop.model.replyModel
            });

            beop.view.taskList.configModel({
                transactions_model: beop.model.transactionsModel,
                tagsModel: beop.model.tagsModel
            });

            beop.view.faultCurve.configModel({
                transactions_model: beop.model.transactionsModel
            });

            beop.view.replyList.configModel({
                transactions_model: beop.model.transactionsModel,
                reply_mode: beop.model.replyModel
            });

            beop.view.progress.configModel({
                transactions_model: beop.model.transactionsModel
            });
            
            beop.view.groupDelete.configModel({
                groupModel: beop.model.groupModel
            });

            beop.view.task.configModel({
                taskModel: beop.model.taskModel,
                tagsModel: beop.model.tagsModel,
                groupModel: beop.model.groupModel,
                attachmentModel: beop.model.attachmentModel
            });

            beop.view.menu_group_list.configModel({
                groupModel: beop.model.groupModel
            });

            beop.view.menu_tag_list.configModel({
                tagsModel: beop.model.tagsModel
            });
            beop.view.groupEdit.configModel({
                teamModel: beop.model.teamModel,
                groupModel: beop.model.groupModel
            });

            beop.view.team.configModel({
                teamModel: beop.model.teamModel
            });

            beop.view.teamProcess.configModel({
                members_load: beop.view.structure.getStructure,
                getStructureById: beop.view.structure.getStructureById
            });

            //加载按钮
            beop.view.menu.init(stateMap.$container);

            //------------Event
            WebAPI.get('/workflow/authorization/isUserHasTeam').done(function (result) {
                beop.model.stateMap.isUserHasTeam = result.data;
                $def.resolve();
            }).always(function () {
                Spinner.stop();
            });

        }).always(function () {

        });

        return $def;
    };
    //type 是指是在workflow还是calendar还是activity 一级菜单 不可为空
    //subType 二级类型（菜单）不可为空
    //transactionId 工单ID

    var workflow = function (type, subType, transactionId, id, taskPage) {
        this.router = {
            type: type
        };
        if (subType) {
            this.router.subType = subType;
            this.router.id = id;
        } else {
            this.router.transactionId = transactionId;
        }

        if (taskPage) {
            this.router.page = taskPage;
            beop.model.stateMap.currentPage = taskPage;
        }

    };
    workflow.prototype = {
        init: init,
        show: function () {
            Spinner.spin(ElScreenContainer);
            show(this.router);
        },
        close: close
    };

    window.workflow = workflow;
}(beop || (beop = {})));

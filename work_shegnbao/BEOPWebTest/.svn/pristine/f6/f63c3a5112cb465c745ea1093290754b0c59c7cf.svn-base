(function (beop) {
    var isSmallScreen = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) <= 768;
    var configMap = {
            htmlURL: '/static/views/workflow/task_mine.html',
            settable_map: {
                taskList_model: true,
                transactions_model: true,
                tags_model: true,
                enableBack: true,
                spEventActivities: true
            },
            pageSize: isSmallScreen ? 18 : 20,
            transactions_model: null,
            tags_model: null,
            enableBack: true,
            //给返回activity配置 确定 发布 的topic 和param
            //$.spEvent.pubEvent(topic, param);
            spEventActivities: {}
        },
        stateMap = {
            task_list_user: AppConfig.userId,
            task_list_type: '',
            orderProperty: '',
            ASC: true
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, onTableTaskClick, starSelect, onTableHeadClick, resetState,
        renderTaskList, loadTaskList, loadTaskDetail, changeOrderIcon, searchTaskList,
        paginationRefresh, onClickReturnActivities;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $wf_level_search: $("#wf-level-search"),
            $wf_taskList_table: $container.find('#wf-task-table'),
            $wf_taskList_tbody: $container.find('#wf-task-table tbody')
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
        resetState();
        stateMap.$container = $container;

        $.spEvent.subEvent(stateMap.$container, 'wf-task-list', loadTaskList);
        $.spEvent.subEvent(stateMap.$container, 'wf-search-list', searchTaskList);
        $.spEvent.subEvent(stateMap.$container, 'wf-load-detail', loadTaskDetail);
        return WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            if (configMap.enableBack) {
                var html = '<a href="javascript:void (0)" class="btn btn-white btn-sm" id="wf-task-return-activities"><i class="glyphicon glyphicon-arrow-left"></i><span  i18n="workflow.task.BACK"></span></a>';
                stateMap.$container.prepend(html);
                jqueryMap.returnActivitiesList = stateMap.$container.find('#wf-task-return-activities');
                jqueryMap.$wf_content = stateMap.$container;
                jqueryMap.returnActivitiesList.on('click', onClickReturnActivities);
            }
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            jqueryMap.$wf_taskList_table.on('click', 'td', onTableTaskClick);
            jqueryMap.$wf_taskList_table.on('click', 'th.order', onTableHeadClick);
            jqueryMap.$wf_taskList_table.on('click', '.wf-task-star', function (e) {
                var $this = $(this);
                var trans_id = $this.attr("trans_id");
                if ($this.hasClass("glyphicon-star-empty")) {
                    $this.removeClass("glyphicon-star-empty").addClass("glyphicon-star");
                } else {
                    $this.removeClass("glyphicon-star").addClass("glyphicon-star-empty");
                }
                return configMap.transactions_model.toggleStarred(trans_id, AppConfig.userId).done(function (result) {
                    if (result.success) {

                    }
                });
            });
        });
    };


    //---------DOM操作------
    renderTaskList = function (groupNo) {
        if (groupNo) {
            jqueryMap.$container.attr("data-group-no", groupNo);
        } else {
            jqueryMap.$container.attr("data-group-no", "");
        }

        var tplStr = $(window).width() <= 1366 ? 'tpl_wf_taskList_min' : 'tpl_wf_taskList_max';

        jqueryMap.$wf_taskList_table.html(beopTmpl(tplStr, {
            transactions: beop.model.stateMap.trans_list.records ? beop.model.stateMap.trans_list.records : [],
            listTodayTasks: Array.isArray(beop.model.stateMap.listTodayTasks) ? (beop.model.stateMap.listTodayTasks.length ? beop.model.stateMap.listTodayTasks : []) : []
        }));
        jqueryMap.$wf_task_star = $(".wf-task-star");
        jqueryMap.$wf_task_pagination = $("#task-pagination");
        paginationRefresh(beop.model.stateMap.trans_list.total);
        I18n.fillArea(stateMap.$container);
    };

    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / configMap.pageSize);
        if (!totalNum) {
            return;
        }

        while (totalPages < stateMap.currentPage && stateMap.currentPage > 1) {
            stateMap.currentPage = stateMap.currentPage - 1;
        }
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: stateMap.currentPage ? stateMap.currentPage : 1,
            totalPages: !totalPages ? 1 : totalPages,
            onPageClick: function (event, page) {
                stateMap.currentPage = page;
                loadTaskList(null, stateMap.task_list_type, stateMap.task_list_user, page, {
                    orderProperty: stateMap.orderProperty,
                    asc: stateMap.asc
                });
            }
        };
        if (stateMap.currentPage) {
            pageOption['startPage'] = stateMap.currentPage ? stateMap.currentPage : 1;
        }

        stateMap.pagination = jqueryMap.$wf_task_pagination.twbsPagination(pageOption);
    };

    starSelect = function (event, type, param) { // 是否收藏
        if (jqueryMap.$wf_task_star.hasClass("glyphicon-star-empty")) {
            jqueryMap.$wf_task_star.removeClass("glyphicon-star-empty").addClass("glyphicon-star");
        } else {
            jqueryMap.$wf_task_star.removeClass("glyphicon-star").addClass("glyphicon-star-empty");
        }
    };

    changeOrderIcon = function () {
        jqueryMap.$wf_taskList_table.find('th .glyphicon').remove();
    };
    onClickReturnActivities = function () {
        beop.view.returnActivitiesList = jqueryMap.$container.children().detach();
        beop.view.activities.init(stateMap.$container, true).done(function () {
            $.spEvent.pubEvent(configMap.spEventActivities.topic, configMap.spEventActivities.param);
        });
    };
    //---------方法---------
    resetState = function () {
        stateMap.pagination = null;
    };
    loadTaskList = function (event, type, user_id, currentPage, orderObject) {
        currentPage = currentPage || 1;
        stateMap.task_list_user = user_id;
        stateMap.task_list_type = type;
        stateMap.orderObject = orderObject;
        stateMap.currentPage = currentPage;
        var navigationI18n = {
            'workingTask': I18n.resource.workflow.navigation.WORKING_TASK,
            'inDoing': I18n.resource.workflow.navigation.IN_DOING,
            'waitVerifier': I18n.resource.workflow.navigation.WAIT_VERIFY,
            'newCreate': I18n.resource.workflow.navigation.NEW_CREATED,
            'createdBy': I18n.resource.workflow.navigation.CREATED_BY,
            'finishedBy': I18n.resource.workflow.navigation.FINISH_BY,
            'taskStop': I18n.resource.workflow.navigation.STOPED_BY,
            'taskComplete': I18n.resource.workflow.navigation.COMPLETED_BY,
            'joinedBy': I18n.resource.workflow.navigation.JOINED_BY,
            'myCollection': I18n.resource.workflow.navigation.MY_COLLECTION,
            'tag': I18n.resource.workflow.navigation.TAG,
            'group': I18n.resource.workflow.navigation.GROUP,
            'search': I18n.resource.workflow.navigation.SEARCH
        };
        beop.view.taskDetail.configModel({
            navigation: navigationI18n[type]
        });
        jqueryMap.$wfExtraList1 = stateMap.$container.parent().find('.wf-extra-list-1');
        jqueryMap.$wfExtraList2 = stateMap.$container.parent().find('.wf-extra-list-2');
        if (type == 'finishedBy') {
            jqueryMap.$wfExtraList1.slideUp();
            jqueryMap.$wfExtraList2.slideDown();
        } else if (type == 'workingTask') {
            jqueryMap.$wfExtraList1.slideDown();
            jqueryMap.$wfExtraList2.slideUp();
        } else if (type == 'joinedBy' || type == 'createdBy') {
            jqueryMap.$wfExtraList2.slideUp();
            jqueryMap.$wfExtraList1.slideUp();
        }
        switch (type) {
            case 'workingTask':
            {
                return configMap.transactions_model.listTransWorking(user_id, currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                    configMap.transactions_model.getListTodayTasks(AppConfig.userId).done(function (result) {
                        if (result.success && result.data) {
                            var data = result.data, $wfTransitionNumber = $('#wf-transaction-number'), $wfSchedulersNumber = $('#wf-schedulers-number'), $wfHasCreatorNumber = $('#wf-has-new-creator-number');
                            var transLength, schedulersLength, totalLength;
                            try {
                                transLength = (data.transaction && data.transaction.length) || 0,
                                    schedulersLength = (data.scheduler && data.scheduler.length) || 0;
                            } catch (ex) {
                                transLength = 0;
                                schedulersLength = 0;
                            }
                            totalLength = transLength + schedulersLength;
                            if (transLength) {
                                $wfTransitionNumber.text(transLength).show();
                                $wfHasCreatorNumber.text(transLength).show();
                            } else {
                                $wfTransitionNumber.hide();
                                $wfHasCreatorNumber.hide();
                            }
                            if (schedulersLength) {
                                $wfSchedulersNumber.text(schedulersLength).show()
                            } else {
                                $wfSchedulersNumber.hide();
                            }
                            if (totalLength) {
                                $('#iconList').find('span.badge').show();
                                $('#paneWorkflow').find('span.badge').text(totalLength);
                            } else {
                                $('#iconList').find('span.badge').hide();
                                $('#paneWorkflow').find('span.badge').remove();
                            }
                            beop.model.stateMap.listTodayTasks = result.data.transaction;
                        }
                    })
                });
            }
            case 'createdBy':
            {
                return configMap.transactions_model.listTransCreatedBy(user_id, currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                });
            }
            case 'taskComplete':
            {
                return configMap.transactions_model.getCompleteVerifiedTask(user_id, currentPage, orderObject, type).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                });
            }
            case 'taskStop':
            {
                return configMap.transactions_model.getStopVerifiedTask(user_id, currentPage, orderObject, type).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                });
            }
            case 'finishedBy':
            {
                return configMap.transactions_model.listTransFinishedBy(user_id, currentPage, orderObject, type).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                });
            }
            case 'joinedBy':
            {
                return configMap.transactions_model.listTransJoinedBy(user_id, currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                });
            }
            case 'group':
            {
                return configMap.transactions_model.listGroupTrans(currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList(user_id);
                    }
                });
            }
            case 'search':
            {
                var text = $.trim(jqueryMap.$wf_level_search.val());
                return configMap.transactions_model.searchTrans(AppConfig.userId, text, currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                });
            }
            case 'tag':
            {
                return configMap.tags_model.transTag(AppConfig.userId, user_id, currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                });
            }
            case 'myCollection':
            {
                return configMap.transactions_model.listTransStarBy(AppConfig.userId, currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                });
            }
            case 'inDoing':
            {
                return configMap.transactions_model.listStartedTrans(AppConfig.userId, currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                })
            }
            case 'waitVerifier':
            {
                return configMap.transactions_model.listWaitVerify(AppConfig.userId, currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                })
            }
            case 'newCreate':
            {
                return configMap.transactions_model.listNewCreated(AppConfig.userId, currentPage, orderObject).done(function (result) {
                    if (result.success) {
                        renderTaskList();
                    }
                })
            }

        }
    };
    searchTaskList = function (event, type, user_id, currentPage, orderObject) {
        jqueryMap.$wf_level_search.keyup(function (e) {
            if (e.keyCode == 13) {
                loadTaskList(null, stateMap.task_list_type, AppConfig.userId, 1, {
                    orderProperty: stateMap.orderProperty,
                    asc: stateMap.asc
                });
            }
        });

        currentPage = currentPage || 1;
        stateMap.task_list_user = user_id;
        stateMap.task_list_type = type;

        switch (type) {
            case 'search':
            {
                var text = $.trim(jqueryMap.$wf_level_search.val());
                if (text != "") {
                    return configMap.transactions_model.searchTrans(AppConfig.userId, text, currentPage, orderObject).done(function (result) {
                        if (result.success) {
                            renderTaskList();
                        }
                    });
                }
            }
        }
    };

    loadTaskDetail = function (event, type, param) {
        beop.view.returnTaskList = jqueryMap.$container.children().detach();
        beop.view.taskDetail.configModel({
            canBack: true,
            canEdit: true,
            whereBack: 'taskDetail',
            taskListType: stateMap.task_list_type,
            taskListPage: stateMap.currentPage,
            taskListUserId: stateMap.task_list_user,
            taskListOrderObject: stateMap.orderObject
        });
        beop.view.taskDetail.configModel({
            isAddNewTaskForVerifiersSelected: false
        });
        beop.view.taskDetail.init(stateMap.$container, type, param);
    };

    //---------事件---------
    onTableTaskClick = function () {
        var $this = $(this);
        var topic = $this.data('topic'), param = $this.data('param').split(';');
        $.spEvent.pubEvent(topic, param);
    };

    onTableHeadClick = function () {
        var $this = $(this), index = $('#wf-task-table').find('thead').find('th').index($this);
        stateMap.orderProperty = $this.data('order-property');
        stateMap.asc = $this.find('.glyphicon').hasClass('glyphicon-sort-by-attributes-alt');
        loadTaskList(null, stateMap.task_list_type, stateMap.task_list_user, 1, {
            orderProperty: stateMap.orderProperty,
            asc: stateMap.asc
        }).done(function (result) {
            if (result.success) {
                //因为模板把整个table重新生成了一次，上次点击的DOM元素不在了，this找不到
                $this = $('#wf-task-table').find('thead').find('th').eq(index);
                $this.siblings('th').find('.glyphicon').remove();
                //因为这个东西是模板里面带出来的东西
                var flag = $this.find('.glyphicon').hasClass('glyphicon-sort-by-attributes-alt');
                if (stateMap.asc) {
                    if (flag) {
                        $this.find('.glyphicon').remove();
                    }
                    $this.prepend('<span class="glyphicon glyphicon-sort-by-attributes"></span>');
                } else {
                    if (flag) {
                        $this.find('.glyphicon').remove();
                    }
                    $this.prepend('<span class="glyphicon glyphicon-sort-by-attributes-alt"></span>');
                }
                stateMap.currentPage = 1;
                paginationRefresh(beop.model.stateMap.trans_list.total);
            }
        })
    };
    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.taskList = {
        configModel: configModel,
        loadTaskList: loadTaskList,
        init: init
    };
}(beop || (beop = {})));

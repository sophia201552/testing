(function (beop) {
    'use strict';
    var configMap = {
            htmlURL: '/static/views/workflow/task_list.html',
            settable_map: {
                taskList_model: true,
                transactions_model: true,
                tagsModel: true,
                enableBack: true,
                spEventActivities: true
            },
            transactions_model: null,
            tagsModel: null,
            enableBack: true,
            //给返回activity配置 确定 发布 的topic 和param
            //$.spEvent.pubEvent(topic, param);
            spEventActivities: {}
        },
        stateMap = {
            task_list_type: '',
            orderProperty: '',
            ASC: true,
            //如果是第一次筛选的话需要定位到第一页
            isFirstFilter: true
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, starSelect, onTableHeadClick, resetState,
        renderTaskList, loadTaskList, loadTaskDetail, changeOrderIcon, searchTaskList,
        paginationRefresh, onClickReturnActivities, bindTaskFilterEvent, dealTaskFilter, searchTaskFilter, initTaskFilterDateTimePicker, bindTaskFilterCustomDate, resetTaskFilter, getFilterTimeRangeQuery;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $wf_level_search: $("#wf-level-search"),
            $wf_task_filter: $container.find('#wf-task-filter'),
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
        if ($('#wf-task-table').length) {
            return $.Deferred().resolve();
        }
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

        //transaction filter 条件添加
        if ((beop.model.stateMap.isShowTaskFilter && !Object.keys(beop.model.stateMap.filter.param).length)) {
            var type = ScreenManager._getHashParamsMap().type;
            jqueryMap.$wf_task_filter.empty().html(beopTmpl("tpl_task_filter", {
                groupList: beop.model.stateMap.group_list,
                tagList: beop.model.stateMap.tag_list,
                type: type
            }));
            bindTaskFilterEvent();
        }
        if (beop.model.stateMap.isFilterAfterBack) {
            $("#wf-task-filter").empty().html(beop.model.stateMap.filterDetach);
            bindTaskFilterEvent();
        }
        jqueryMap.$wf_task_star = $(".wf-task-star");
        jqueryMap.$wf_task_pagination = $("#task-pagination");
        if (beop.model.stateMap.trans_list.total) {
            $('.page-info').text(I18n.resource.workflow.main.TOTAL_NUM.format(beop.model.stateMap.trans_list.total));
        } else {
            $('.page-info').text(I18n.resource.workflow.main.TOTAL_NUM.format(0));
        }
        paginationRefresh(beop.model.stateMap.trans_list.total);
        if (stateMap.orderObject && stateMap.orderObject.orderProperty) {
            var $theadTh = jqueryMap.$wf_taskList_table.find('thead tr').children('th'), orderObject = stateMap.orderObject;
            $theadTh.find('span.glyphicon').remove();
            $theadTh.each(function () {
                var $this = $(this);
                if ($this.attr('data-order-property') == orderObject.orderProperty) {
                    if (orderObject.asc) {
                        $this.prepend('<span class="glyphicon glyphicon-sort-by-attributes"></span>');
                    } else {
                        $this.prepend('<span class="glyphicon glyphicon-sort-by-attributes-alt"></span>');
                    }
                }
            });
        }
        if (stateMap.task_list_type === 'createdBy') { // 如果是我创建的menu, 隐藏我创建的筛选下拉菜单的其它人创建选项
            $("#taskCreatorSelect").hide();
        }
        I18n.fillArea(stateMap.$container);
    };

    bindTaskFilterEvent = function () {
        jqueryMap.$wf_task_filter.find('label').off().change(function (ev) {

            var $this = $(this),
                $select = $this.find('select'),
                type = $this.attr('data-filter-type'),
                selectValue = $select.val();
            var allowFilterType = ["group", "creator", "fields.critical", "status", "tags", "fields.dueDate"];

            if (allowFilterType.indexOf(type) == -1) {
                console.error('unknown transaction filter type ' + type);
                return false;
            } else {
                dealTaskFilter($this, type, selectValue)
            }
        }).end().find('#wf-task-filter-reset').off().click(function (ev) {
            resetTaskFilter();
        }).end().find("#wf-task-filter-new-task").off().click(function (ev) {
            //如果有选中的项目,新建工单默认建在该项目下
            var hashMap = ScreenManager._getHashParamsMap();
            var hash = '';
            if (hashMap.id) {
                hash = '&groupId=' + hashMap.id;
            }
            location.hash = "#page=workflow&type=transaction&subType=addTransaction" + hash;
        });
    };
    resetTaskFilter = function () {
        var model = beop.model.stateMap.filter;
        if (Object.keys(model.param).length) {
            model.param = {};
            loadTaskList(null, stateMap.task_list_type, null, 1, {
                orderProperty: stateMap.orderProperty,
                asc: stateMap.asc
            });
        }
    };
    //得到filter 的时间 区间
    getFilterTimeRangeQuery = function (type) {
        //$gte {more than}
        //$lte {less than}
        var $getTime = undefined, $letTime = undefined;
        var baseFormat = "YYYY-MM-DD",
            startFormat = baseFormat + " 00:00:00",
            endFormat = baseFormat + " 23:59:59";
        switch (type) {
            case "today":
                $getTime = moment().format(startFormat);
                $letTime = moment().format(endFormat);
                break;
            case "tomorrow":
                $getTime = moment().add(1).format(startFormat);
                $letTime = moment().add(2).format(endFormat);
                break;
            case "week":
                $getTime = moment().days(1).format(startFormat);
                $letTime = moment().days(7).format(endFormat);
                break;
            case "month":
                $getTime = moment().startOf('month').format(startFormat);
                $letTime = moment().endOf('month').format(endFormat);
                break;
            default:
                //default return today time format
                $getTime = moment().format(startFormat);
                $letTime = moment().format(endFormat);
                break;
        }
        return {"$and": [{"createTime": {"$gte": $getTime}}, {"createTime": {"$lte": $letTime}}]};
    };
    dealTaskFilter = function ($label, type, selectValue) {
        var model = beop.model.stateMap.filter.param;
        //如果是第一次筛选的话需要定位到第一页
        if (stateMap.isFirstFilter) {
            stateMap.currentPage = 1;
            stateMap.isFirstFilter = false;
        }
        //选取自定义时间的时候
        if (type === "dueDate") {
            model["dueDate"] = {};
            if (selectValue == "custom") {
                model.dueDate = {};
                initTaskFilterDateTimePicker($label);
            } else if (selectValue == -1) {
                delete model[type];
                $label.closest('#wf-task-filter').find('.wf-filter-custom-date-select').remove();
            } else {
                //直接 remove 掉
                $label.closest('#wf-task-filter').find('.wf-filter-custom-date-select').remove();
                model.dueDate = getFilterTimeRangeQuery(type);
                searchTaskFilter();
            }
        } else {
            if (selectValue == -1) {
                delete model[type];
            } else {
                switch (type) {
                    //创建人的筛选
                    case "creator":
                        if (selectValue == 2) {
                            model[type] = {"creator": {"$nin": [AppConfig.userId]}};
                        } else if (selectValue == 1) {
                            model[type] = {"creator": AppConfig.userId};
                        }
                        break;
                    //紧急程度的筛选
                    case "fields.critical":
                        model["fields.critical"] = {"fields.critical": String(selectValue)};
                        break;
                    //工单状态的筛选
                    case "status":
                        model["status"] = {"status": parseInt(selectValue)};
                        break;
                    case "tags":
                        //标签的筛选
                        alert("暂时不支持标签的筛选!");
                        return false;
                        model["tags"] = {};
                        break;
                }
            }
        }
        //判断是否有筛选条件，有条件就搜索，没有就重新加载一次当前type的工单列表
        //如果是在选择自定义的时间的时候return
        if (model && typeof model.dueDate == 'object' && Object.keys(model.dueDate).length == 0) {
            return;
        }
        if (Object.keys(model).length) {
            searchTaskFilter(model);
        } else {
            loadTaskList(null, stateMap.task_list_type, null, 1, {
                orderProperty: stateMap.orderProperty,
                asc: stateMap.asc
            });
        }
    };
    searchTaskFilter = function (orderProperty, asc) {
        var model = beop.model.stateMap.filter;
        Spinner.spin(ElScreenContainer);
        configMap.transactions_model.taskTypeFilter(beop.model.stateMap.currentPage || 1, {
            type: model.type,
            taskTypeQuery: model.taskTypeQuery,
            filter: model.param,
            page: stateMap.currentPage,
            limit: beop.model.stateMap.task_page_size,
            groupId: beop.model.stateMap.currentGroupId,
            order: {
                orderProperty: orderProperty ? orderProperty : "id",
                asc: asc ? asc : "DESC"
            }
        }).done(function (result) {
            if (result.success) {
                beop.model.stateMap.trans_list = result.data;
                beop.model.stateMap.trans_list.total = result.data.total;
                renderTaskList();
                $('#wf-task-table').find('glyphicon').remove();
            }
        }).always(function () {
            Spinner.stop();
        });
    };
    initTaskFilterDateTimePicker = function ($label) {
        var $parent = $label.closest("#wf-task-filter");
        $label.after(beopTmpl('tpl_TaskFilterDateTimePicker', {}));
        $parent.find('input[name="startTIME"]').datetimepicker({
            minView: 2,
            format: "yyyy-mm-dd",
            autoclose: true
        });
        $parent.find('input[name="endTIME"]').datetimepicker({
            minView: 2,
            format: "yyyy-mm-dd",
            autoclose: true
        });
        I18n.fillArea($parent);
        bindTaskFilterCustomDate($parent);
    };
    bindTaskFilterCustomDate = function ($parent) {
        var $inputStartTime = $parent.find('input[name="startTIME"]'),
            $inputEndTime = $parent.find('input[name="endTIME"]');

        var startTime = "", endTime = "";
        var checkTime = function () {
            //因为时间到服务器还要转，这里就不转化为Date比较了
            if (startTime.toDate() > endTime.toDate()) {
                alert(I18n.resource.workflow.task.TIME_GREATER_CHECK_INFO_1);
                return false;
            }
            if (endTime.toDate() < startTime.toDate()) {
                alert(I18n.resource.workflow.task.TIME_GREATER_CHECK_INFO_2);
                return false;
            }
            return true;
        };
        $inputStartTime.off('change').change(function () {
            startTime = $(this).val();
            checkTime();
        });
        $inputEndTime.off('change').change(function () {
            endTime = $(this).val();
            checkTime();
        });
        $parent.find('.TaskFilterDateTimePickerBtn').off().click(function () {
            if (!startTime || !endTime) {
                return false;
            }
            if (checkTime()) {
                beop.model.stateMap.filter.param.dueDate = {
                    "$and": [
                        {"createTime": {"$gte": moment($inputStartTime.val()).format("YYYY-MM-DD 00:00:00")}},
                        {"createTime": {"$lte": moment($inputEndTime.val()).format("YYYY-MM-DD 23:59:59")}}
                    ]
                };
                searchTaskFilter();
            }
        });
    };
    paginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / beop.model.taskPageSize);
        while (totalPages < stateMap.currentPage && stateMap.currentPage > 1) {
            beop.model.stateMap.currentPage = beop.model.stateMap.currentPage - 1;
        }
        var getPageClickCallback = function () {
            if (beop.model.stateMap.isShowTaskFilter && Object.keys(beop.model.stateMap.filter.param).length) {
                return function (event, page) {
                    beop.model.stateMap.currentPage = page;
                    searchTaskFilter();
                }
            } else {
                return function (event, page) {
                    beop.model.stateMap.currentPage = page;
                    var hashMap = ScreenManager._getHashParamsMap(),
                        currentPage = hashMap.taskPage;
                    ScreenManager.goTo({
                        page: hashMap.page,
                        type: hashMap.type,
                        subType: hashMap.subType || "",
                        id: hashMap.id || "",
                        taskPage: currentPage ? page : 1
                    });
                }
            }
        };
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: stateMap.currentPage ? stateMap.currentPage : 1,
            totalPages: !totalPages ? 1 : totalPages,
            onPageClick: getPageClickCallback()
        };
        if (stateMap.currentPage) {
            pageOption['startPage'] = stateMap.currentPage ? stateMap.currentPage : 1;
        }
        jqueryMap.$wf_task_pagination.off().removeData('twbs-pagination').empty();
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
    //isFilterAfterBack 参数是指，筛选后进入工单然后点击返回，只有在这里才是true，其他地方没有个参数
    loadTaskList = function (event, type, param, currentPage, orderObject, isFilterAfterBack) {
        Spinner.spin(ElScreenContainer);

        // to-do 待删除
        currentPage = beop.model.stateMap.currentPage || 1;
        stateMap.task_list_type = type;
        stateMap.orderObject = orderObject;
        stateMap.currentPage = currentPage;
        var navigationI18n = {
            'workingTask': I18n.resource.workflow.navigation.WORKING_TASK,
            'inDoing': I18n.resource.workflow.navigation.IN_DOING,
            'waitVerifier': I18n.resource.workflow.navigation.WAIT_VERIFY,
            'newCreate': I18n.resource.workflow.navigation.NEW_CREATED,
            'taskComplete': I18n.resource.workflow.navigation.COMPLETED_BY,
            'joinedBy': I18n.resource.workflow.navigation.JOINED_BY,
            'myCollection': I18n.resource.workflow.navigation.MY_COLLECTION,
            'tag': I18n.resource.workflow.navigation.TAG,
            'group': I18n.resource.workflow.navigation.GROUP,
            'search': I18n.resource.workflow.navigation.SEARCH,
            "waitMeToVerifier": I18n.resource.workflow.navigation.WAIT_ME_TO_VERIFIER
        };
        if (beop.model.stateMap.UEInstance) {
            beop.model.stateMap.UEInstance.destroy();
            beop.model.stateMap.UEInstance = null;
        }
        var switchType = function (type) {
            if (!type || type === 'undefined') {
                type = 'workingTask';
            }
            //如果是第一次筛选的话需要定位到第一页
            stateMap.isFirstFilter = true;
            //beop.model.stateMap.isShowTaskFilter = type === "workingTask";

            beop.model.stateMap.isShowTaskFilter = true;
            beop.model.stateMap.filter.type = type;
            beop.model.stateMap.filter.taskTypeQuery = undefined;
            beop.model.stateMap.isFilterAfterBack = isFilterAfterBack;
            //beop.model.stateMap.isShowTaskFilter = !(type === 'joinedBy' || type === "createdBy");
            if (!isFilterAfterBack) {
                beop.model.stateMap.filter.param = {};
            }

            switch (type) {
                case 'workingTask':
                {
                    beop.model.stateMap.filter.taskTypeQuery = {
                        "executor": AppConfig.userId,
                        "status": {"$in": [0, 1]}
                    };
                    return configMap.transactions_model.taskTypeFilter(currentPage, orderObject).done(function (result) {
                        if (result.success) {
                            renderTaskList();
                        } else if (result.code && result.code == 40001) {
                            location.hash = '#page=workflow&type=team';
                            return;
                        }
                        configMap.transactions_model.getListTodayTasks(AppConfig.userId).done(function (result) {
                            if (result.success && result.data) {
                                var data = result.data, $wfTransitionNumber = $('#wf-transaction-number'), $wfSchedulersNumber = $('#wf-schedulers-number'), $wfHasCreatorNumber = $('#wf-has-new-creator-number');
                                var transLength, schedulersLength, totalLength;
                                try {
                                    transLength = (data.transaction && data.transaction.length) || 0;
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
                    beop.model.stateMap.filter.taskTypeQuery = {"creator": AppConfig.userId};
                    return configMap.transactions_model.taskTypeFilter(currentPage, orderObject).done(function (result) {
                        if (result.success) {
                            renderTaskList();
                        }
                    });
                }
                case 'joinedBy':
                {
                    beop.model.stateMap.filter.taskTypeQuery = {"$or": [{"process.nodes.members": AppConfig.userId}, {"watchers": AppConfig.userId}]};
                    return configMap.transactions_model.taskTypeFilter(currentPage, orderObject).done(function (result) {
                        if (result.success) {
                            renderTaskList();
                        }
                    });
                }
                case 'group':
                case "taskGroup":
                {
                    return configMap.transactions_model.listGroupTrans(currentPage, orderObject).done(function (result) {
                        if (result.success) {
                            renderTaskList(param);
                        }
                    });
                }
                case 'search':
                {
                    var text = $.trim(jqueryMap.$wf_level_search.val());
                    beop.model.stateMap.filter.taskTypeQuery = {
                        '$or': [{"process.nodes.members": AppConfig.userId}, {"executor": AppConfig.userId}],
                        'fields.title': {'$regex': text}
                    };
                    return configMap.transactions_model.taskTypeFilter(currentPage, orderObject).done(function (result) {
                        if (result.success) {
                            renderTaskList();
                        }
                    });
                }
                case 'tag':
                {
                    beop.model.stateMap.filter.taskTypeQuery = {
                        'process.nodes.members': AppConfig.userId,
                        'tags': param ? param : ''
                    };

                    return configMap.transactions_model.taskTypeFilter(currentPage, orderObject).done(function (result) {
                        if (result.success) {
                            renderTaskList();
                        }
                    });
                }
                case 'myCollection':
                {
                    beop.model.stateMap.filter.taskTypeQuery = {};
                    return configMap.transactions_model.taskTypeFilter(currentPage, orderObject).done(function (result) {
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
                case 'waitMeToVerifier':
                {
                    return configMap.transactions_model.waitMeToVerifier(AppConfig.userId, currentPage, orderObject).done(function (result) {
                        if (result.success) {
                            renderTaskList()
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
                case "history":
                    beop.model.stateMap.filter.taskTypeQuery = {"creator": AppConfig.userId, "status": 2};
                    return configMap.transactions_model.taskTypeFilter(currentPage, orderObject).done(function (result) {
                        if (result.success) {
                            renderTaskList();
                        }
                    });
                default:
                {
                    return $.Deferred().resolve();
                }
            }
        };
        return switchType(type).done(function () {
            Spinner.stop();
        })

    };
    searchTaskList = function (event, type, param, currentPage, orderObject) {
        jqueryMap.$wf_level_search.keyup(function (e) {
            if (e.keyCode == 13) {
                loadTaskList(null, stateMap.task_list_type, AppConfig.userId, 1, {
                    orderProperty: stateMap.orderProperty,
                    asc: stateMap.asc
                });
            }
        });

        currentPage = currentPage || 1;
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
        //TODO 把筛选菜单detach
        beop.model.stateMap.filterDetach = $('#wf-task-filter').detach();
        beop.view.returnTaskList = jqueryMap.$container.children().detach();
    };

    //---------事件---------


    onTableHeadClick = function () {
        //  to-do 暂去除项目中完成的排序点击功能
        if (stateMap.task_list_type === 'group') {
            return;
        }
        //  to-do 暂去除项目中完成的排序点击功能
        var model = beop.model.stateMap;
        if (model.isShowTaskFilter && Object.keys(model.filter.param).length) {
            return true;
            //searchTaskFilter(stateMap.orderProperty, stateMap.asc);
        } else {
            var $this = $(this), index = $('#wf-task-table').find('thead').find('th').index($this);
            stateMap.orderProperty = $this.data('order-property');
            stateMap.asc = $this.find('.glyphicon').hasClass('glyphicon-sort-by-attributes-alt');
            loadTaskList(null, stateMap.task_list_type, null, 1, {
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
                        if (!$this.find('.glyphicon').hasClass('glyphicon-sort-by-attributes')) {
                            $this.prepend('<span class="glyphicon glyphicon-sort-by-attributes"></span>');
                        }
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
        }
    };
    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.taskList = {
        configModel: configModel,
        loadTaskList: loadTaskList,
        init: init
    };
}(beop || (beop = {})));

(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task_edit.html',
            settable_map: {
                transactions_model: true,
                tags_model: true,
                canClose: true,
                canBack: true,
                canEdit: true,
                whereBack: true,
                taskListType: true,
                taskListPage: true,
                taskListUserId: true,
                taskListOrderObject: true
            },
            transactions_model: null,
            tags_model: null,
            canClose: false,
            canBack: false,
            canEdit: false,
            whereBack: null,
            taskListType: null,
            taskListPage: null,
            taskListUserId: null,
            taskListOrderObject: null
        },
        stateMap = {
            userSelectedMap: {
                'verifiers': [],
                'executor': [],
                'watchers': []
            },
            labelList: [],
            tag_list: []
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init,
        attachEvent,
        renderTags, renderTagsSelector, onPubEvent, starSelect, funChange, addComment, onNewTaskSubmit,
        loadTaskDetail, initDatePicker, returnTaskList, showTaskDetail, editTaskDetail, loadFaultCurve, loadBottomSection,
        onAddUserDialogOpen, onTaskSave, onTaskDelete, onCompleteTask, onVerifyPass, onVerifyNotPass, onTagDelete, onAddTag,
        addTagOnPage, removeTagOnPage, getTag, isExistTag,
        renderAddedUsers, resetData, setUserHasSelectedMap;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = $.extend(jqueryMap ? jqueryMap : {}, {
            $container: $container,
            $wf_taskDetail_container: $container.find('#wf-detail-container'),
            $wf_taskDetail_form: $container.find('#wf-detail-form'),
            $begin_time: $container.find("#beginTime"),
            $due_time: $container.find("#dueTime"),
            $label_name: $container.find("#labelName"),
            $wf_detail_star: $container.find("#wf-detail-star"),
            $wf_labelName_error: $container.find("#wf-labelName-error"),
            $wf_comment_btn: $container.find("#wf-comment-btn"),
            $wf_comment_text: $container.find("#wf-comment-text"),
            $wf_comment_table: $container.find("#wf-comment-table"),
            $wf_task_label: $container.find(".wf-task-label"),
            $wf_fault_curve: $container.find('#wf-fault-curve'),
            $wf_task_return: $container.find('#wf-task-return'),
            $wf_detail_show: $container.find('#wf-detail-show'),
            $wf_detail_edit: $container.find('#wf-detail-edit'),
            $wf_detail_submit: $container.find('#wf-detail-submit'),
            $wf_detail_other_fun_wrapper: $container.find('#wf-detail-other-fun-wrapper'),
            $wf_del_win: $("#wf-del-win"),
            $wf_event_confirm: $("#wf-event-confirm"),
            $wf_show_tags_text: $("#wf-detail-show-tags-wrapper"),
            $wf_detail_collection: $("#wf-detail-collection")
        });
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container, type, transId) {
        stateMap.$container = $container;
        //$.spEvent.subEvent(stateMap.$container, 'wf-star-select', starSelect);
        $.spEvent.subEvent(stateMap.$container, 'wf-fun-change', funChange);
        $.spEvent.subEvent(stateMap.$container, 'wf-add-comment', addComment);
        $.spEvent.subEvent(stateMap.$container, 'wf-task-return', returnTaskList);
        $.spEvent.subEvent(stateMap.$container, 'wf-detail-show', showTaskDetail);

        return WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            //TODO 获取到的id
            stateMap.transId = transId;
            jqueryMap.$wf_taskDetail_container = stateMap.$container.find('#wf-detail-container');
            stateMap.$container.off('click.pubEvent').on('click.pubEvent', '[data-topic]', onPubEvent);
            stateMap.$container.off('click.wf-detail-save').on('click.wf-detail-save', '#wf-detail-save', onTaskSave);
            stateMap.$container.off('click.wf-detail-delete').on('click.wf-detail-delete', '#wf-detail-delete', onTaskDelete);
            stateMap.$container.off('click.wf-add-user').on('click.wf-add-user', '.wf-add-user', onAddUserDialogOpen);
            stateMap.$container.off('click.wf-detail-edit').on('click.wf-detail-edit', '#wf-detail-edit', editTaskDetail);
            stateMap.$container.off('click.wf-detail-complete').on('click.wf-detail-complete', '#wf-detail-complete', onCompleteTask);
            stateMap.$container.off('click.wf-verify-pass').on('click.wf-verify-pass', '#wf-verify-pass', onVerifyPass);
            stateMap.$container.off('click.wf-verify-not-pass').on('click.wf-verify-not-pass', '#wf-verify-not-pass', onVerifyNotPass);
            stateMap.$container.off('click.wf-detail-tag-delete').on('click.wf-detail-tag-delete', '.wf-detail-tag-delete', onTagDelete);
            stateMap.$container.off('click.wf-star-select').on('click.wf-star-select', '#wf-detail-star', starSelect);
            stateMap.$container.off('change.labelName').on('change.labelName', '#labelName', onAddTag);
            resetData();
            loadTaskDetail(type).done(function () {
                I18n.fillArea(stateMap.$container);
                setJqueryMap();
                attachEvent();
                initDatePicker();
            });
        });
    };

    //---------DOM操作------
    attachEvent = function (e) {
        jqueryMap.$wf_event_confirm.off().on('click', function (e) {
            if (jqueryMap.$wf_del_win.attr("data-type") === "taskItem") { //删除任务
                configMap.transactions_model.delTrans(stateMap.transId).done(function (result) {
                    if (result.success) {
                        beop.view.taskList.init(jqueryMap.$container).done(function () {
                            $.spEvent.pubEvent('wf-task-list', [configMap.taskListType, configMap.taskListUserId, configMap.taskListPage, configMap.taskListOrderObject]);
                            jqueryMap.$wf_del_win.attr("data-type", "");
                            jqueryMap.$wf_del_win.modal("hide");
                        });
                    }
                });
            }
        });
    };

    renderTags = function (tags) {
        jqueryMap.$wf_detail_labelWrapper = stateMap.$container.find("#wf-detail-labelWrapper");
        jqueryMap.$wf_detail_labelWrapper.html(beopTmpl('tpl_wf_detail_labels', {tags: tags}));
    };

    starSelect = function () { // 是否收藏
        if (jqueryMap.$wf_detail_star.hasClass("glyphicon-star-empty")) {
            jqueryMap.$wf_detail_star.removeClass("glyphicon-star-empty").addClass("glyphicon-star");
            jqueryMap.$wf_detail_collection.val(1);
        } else {
            jqueryMap.$wf_detail_star.removeClass("glyphicon-star").addClass("glyphicon-star-empty");
            jqueryMap.$wf_detail_collection.val(0);
        }
    };

    returnTaskList = function () { // 回到之前的列表
        switch (configMap.whereBack) {
            case 'activities':
                stateMap.$container.html("").append(beop.view.returnActivitiesList);
                break;
            case 'taskDetail':
                beop.view.taskList.init(jqueryMap.$container).done(function () {
                    $.spEvent.pubEvent('wf-task-list', [configMap.taskListType, configMap.taskListUserId, configMap.taskListPage, configMap.taskListOrderObject]);
                });
                break;
        }
    };

    funChange = function (event, type, param) { // 详情评论，工单进程等tab页切换
        if (type == "comment") {
            jqueryMap.$wf_detail_comment.show();
            jqueryMap.$wf_detail_progress.hide();
            jqueryMap.$wf_detail_comment_nav.addClass("active").siblings().removeClass("active");
        } else if (type == "progress") {
            jqueryMap.$wf_detail_comment.hide();
            jqueryMap.$wf_detail_progress.show();
            jqueryMap.$wf_detail_progress_nav.addClass("active").siblings().removeClass("active");

            // 调用历史记录
            beop.view.progress.init(jqueryMap.$wf_detail_progress);
        }
    };

    addComment = function (event, type, param) { // 添加评论
        var val = $.trim(jqueryMap.$wf_comment_text.val());
        if (val != '') {
            jqueryMap.$wf_comment_table.prepend(jqueryMap.$wf_comment_table.find("tbody tr").eq(0).clone());
            jqueryMap.$wf_comment_table.find("tbody tr").eq(0).find(".wf-comment-content").text(val);
        }
    };

    renderAddedUsers = function (type) {
        return function (addedUserList) {
            stateMap.userSelectedMap[type] = addedUserList;
            jqueryMap.$wf_added_user_list.filter(function (index, item) {
                return $(item).data('type') === type;
            }).html(beopTmpl('tpl_wf_added_member_personal', {
                members: addedUserList,
                userListName: type ? type : 'addedUserList'
            }))
        }
    };

    //---------方法---------
    onPubEvent = function () {
        var $this = $(this);
        var topic = $this.data('topic'), param = $this.data('param');
        $.spEvent.pubEvent(topic, param);
    };
    resetData = function () {
        for (var key in stateMap.userSelectedMap) {
            if (stateMap.userSelectedMap.hasOwnProperty(key)) {
                stateMap.userSelectedMap[key] = [];
            }
        }
        stateMap.tag_list = [];
    };
    initDatePicker = function () {
        jqueryMap.$due_time = jqueryMap.$container.find('#dueTime');
        jqueryMap.$due_time.datetimepicker({
            minView: 2,
            format: "yyyy-mm-dd",
            autoclose: true
        });
    };

    loadTaskDetail = function (param, newTransId) {//param类型,newTransId 新增加用户的transId
        if (param == "new") {
            jqueryMap.$wf_taskDetail_container.html("");
            jqueryMap.$wf_taskDetail_container.append(beopTmpl('tpl_wf_detail_new'));
            jqueryMap.$wf_taskDetail_container.on('submit', 'form.task-new', onNewTaskSubmit);
            setJqueryMap();
            renderTagsSelector();
            return $.Deferred().resolve();
        }
        resetData();
        if (!stateMap.transId) {
            stateMap.transId = newTransId;
        }
        return configMap.transactions_model.getTrans(stateMap.transId).done(function (result) {
            if (result.success) {
                if (param == "show") {
                    jqueryMap.$wf_taskDetail_container.html(beopTmpl('tpl_wf_detail_show', {
                        trans: beop.model.stateMap.cur_trans
                    }));
                } else if (param == "edit") {
                    jqueryMap.$wf_taskDetail_container.html(beopTmpl('tpl_wf_detail_edit', {
                        trans: beop.model.stateMap.cur_trans,
                        labels: stateMap.labelList
                    }));
                    renderTagsSelector();
                }
                stateMap.tag_list = beop.model.stateMap.cur_trans.tags.slice();
                renderTags(stateMap.tag_list);
                stateMap.dataDefault = Object.freeze({
                    verifiers: result.data.verifiers,
                    executor: [result.data.executor],
                    watchers: result.data.watchers
                });
                setUserHasSelectedMap(result.data);
                I18n.fillArea($('#wf-content'));
                $('[data-toggle="tooltip"]').tooltip();
            } else {
                jqueryMap.$wf_taskDetail_container.html(beopTmpl('tpl_wf_detail_empty', {}));
            }
            stateMap.type = param;
            loadFaultCurve();
            loadBottomSection();
            I18n.fillArea(stateMap.$container);
        });
    };

    loadFaultCurve = function () {
        // 添加曲线
        if (beop.model.stateMap.cur_trans.chartPointList) {
            jqueryMap.$wf_fault_curve = stateMap.$container.find('#wf-fault-curve');
            beop.view.faultCurve.init(jqueryMap.$wf_fault_curve);
        }
    };

    loadBottomSection = function () {
        // 添加下部内容
        jqueryMap.$wf_detail_other_fun_wrapper = $("#wf-detail-other-fun-wrapper");
        jqueryMap.$wf_detail_other_fun_wrapper.html(beopTmpl('tpl_wf_detail_fun'));

        jqueryMap.$wf_detail_comment_nav = stateMap.$container.find("#wf-detail-comment-nav");
        jqueryMap.$wf_detail_progress_nav = stateMap.$container.find("#wf-detail-progress-nav");
        jqueryMap.$wf_detail_comment = stateMap.$container.find("#wf-detail-comment");
        jqueryMap.$wf_detail_progress = stateMap.$container.find("#wf-detail-progress");

        // 添加评论
        beop.view.replyList.init(jqueryMap.$wf_detail_comment);
    };

    setUserHasSelectedMap = function (result) {
        var executor = result.executor,
            verifiers = result.verifiers || [],
            watchers = result.watchers || [];
        if (executor) {
            stateMap.userSelectedMap.executor = [{
                "id": executor.id,
                "userfullname": executor.userfullname,
                "username": executor.username,
                "userpic": executor.userpic
            }];

        }
        verifiers.forEach(function (item, index, array) {
            stateMap.userSelectedMap.verifiers.push({
                "id": item.id,
                "userfullname": item.userfullname,
                "username": item.username,
                "userpic": item.userpic
            });
        });
        watchers.forEach(function (item, index, array) {
            stateMap.userSelectedMap.watchers.push({
                "id": item.id,
                "userfullname": item.userfullname,
                "username": item.username,
                "userpic": item.userpic
            });
        });

    };

    onTaskSave = function () {
        Spinner.spin(jqueryMap.$container[0]);
        configMap.transactions_model.updateTrans(jqueryMap.$wf_taskDetail_form.serializeObject()).done(function (result) {
            if (result.success) {
                loadTaskDetail("show").done(function () {
                    showTaskDetail();
                });
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    onTaskDelete = function () {
        jqueryMap.$wf_del_win.modal();
        jqueryMap.$wf_del_win.attr("data-type", "taskItem");
    };

    onAddUserDialogOpen = function () {
        var type = $(this).data('type');
        jqueryMap.$wf_added_user_list = $(this).siblings('.wf-detail-userInfoWrapper');
        beop.view.memberSelected.configModel({
            cb_dialog_hide: renderAddedUsers(type),
            userHasSelected: stateMap.userSelectedMap[type],
            maxSelected: type == 'executor' ? 1 : null,
            enableDeleteMember: true,
            enableAddMember: true
        });
        beop.view.memberSelected.init(jqueryMap.$container.parent());
    };


    showTaskDetail = function () { // 详情页面切换到显示页面
        var empty = {};
        stateMap.userSelectedMap = $.extend(true, empty, stateMap.dataDefault);
        jqueryMap.$wf_taskDetail_form.html(beopTmpl('tpl_wf_detail_show', {trans: beop.model.stateMap.cur_trans}));
        setJqueryMap();
        I18n.fillArea(jqueryMap.$container);
        $('[data-toggle="tooltip"]').tooltip();
        stateMap.type = "show";
        stateMap.tag_list = [];
        renderTags(beop.model.stateMap.cur_trans.tags);
    };
    renderTagsSelector = function () {
        jqueryMap.$label_name.html(beopTmpl('tpl_wf_detail_new_tags_option', {
            tags: beop.model.stateMap.tag_list
        }));
        I18n.fillArea(jqueryMap.$label_name);
    };
    editTaskDetail = function () { // 详情页面切换到编辑页面
        //$.extend(stateMap.userSelectedMap,dataDefault);
        jqueryMap.$wf_taskDetail_form.html(beopTmpl('tpl_wf_detail_edit', {
            trans: beop.model.stateMap.cur_trans,
            labels: stateMap.labelList
        }));
        setJqueryMap();
        initDatePicker();
        I18n.fillArea(jqueryMap.$container);
        $('[data-toggle="tooltip"]').tooltip();
        stateMap.type = "edit";
        stateMap.tag_list = beop.model.stateMap.cur_trans.tags.slice();
        renderTags(beop.model.stateMap.cur_trans.tags);
        renderTagsSelector();
    };
    addTagOnPage = function (tagId) {
        if (stateMap.tag_list.length >= 3) {
            jqueryMap.$wf_labelName_error.show();
            return false;
        }
        jqueryMap.$wf_labelName_error.hide();
        if (isExistTag(tagId)) {
            return false;
        }
        var tag = getTag(tagId);
        if (tag) {
            stateMap.tag_list.push(tag);
        }
    };
    isExistTag = function (tagId) {
        for (var m = 0; m < stateMap.tag_list.length; m++) {
            if (stateMap.tag_list[m].id == tagId) {
                return true;
            }
        }
        return false;
    };
    removeTagOnPage = function (tagId) {
        for (var m = 0; m < stateMap.tag_list.length; m++) {
            if (stateMap.tag_list[m].id == tagId) {
                stateMap.tag_list.splice(m, 1);
            }
        }
    };
    getTag = function (tagId) {
        for (var m = 0; m < beop.model.stateMap.tag_list.length; m++) {
            if (beop.model.stateMap.tag_list[m].id == tagId) {
                return beop.model.stateMap.tag_list[m];
            }
        }
        return null;
    };

    //---------事件---------

    onAddTag = function () {//切换
        addTagOnPage($(this).val());
        renderTags(stateMap.tag_list);
    };
    onTagDelete = function () {
        removeTagOnPage($(this).data('id'));
        renderTags(stateMap.tag_list);
    };

    onNewTaskSubmit = function () {
        var $form = $(this);
        Spinner.spin(jqueryMap.$container[0]);
        configMap.transactions_model.addTrans($form.serializeObject()).done(function (result) {
            if (result.success) {
                loadTaskDetail("show", result.data).done(function () {
                    loadFaultCurve();
                    loadBottomSection();
                    showTaskDetail();
                });
            } else {
                if (result.msg) {
                    Alert.danger(ElScreenContainer, 'add new task fail!' + '<br/>' + result.msg).showAtTop(1000);
                }
            }
        }).fail(function (result) {
            if (result.success) {
                Alert.danger(ElScreenContainer, 'add new task fail!').showAtTop(1000);
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    onCompleteTask = function () {
        configMap.transactions_model.completeTrans().done(function (result) {
            if (result.success) {
                loadTaskDetail("show").done(function () {
                    showTaskDetail();
                });
            }
        }).fail(function (result) {
            if (result.success) {
                Alert.danger(ElScreenContainer, 'update fail!').showAtTop(2000);
            }
        })
    };

    onVerifyPass = function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        Spinner.spin(jqueryMap.$container.get(0));
        configMap.transactions_model.verifyPass().done(function (result) {
            if (result.success) {
                loadTaskDetail("show").done(function () {
                    showTaskDetail();
                });
            }
        }).fail(function (result) {
            if (result.success) {
                Alert.danger(ElScreenContainer, 'update fail!').showAtTop(2000);
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    onVerifyNotPass = function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        Spinner.spin(jqueryMap.$container.get(0));
        configMap.transactions_model.verifyNotPass().done(function (result) {
            if (result.success) {
                loadTaskDetail("show").done(function () {
                    showTaskDetail();
                });
            }
        }).fail(function (result) {
            if (result.success) {
                Alert.danger(ElScreenContainer, 'update fail!').showAtTop(2000);
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.taskDetail = {
        configModel: configModel,
        loadTaskDetail: loadTaskDetail,
        init: init
    };
}(beop || (beop = {})));

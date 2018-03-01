(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task.html',
            settable_map: {
                taskModel: true,
                tagsModel: true,
                groupModel: true,
                attachmentModel: true,
                viewModel: true
            },
            taskModel: null,
            tagsModel: null,
            groupModel: null,
            attachmentModel: null,
            viewModel: {}
        },
        stateMap = {
            viewModel: configMap.viewModel,
            currentTags: [],
            selectTaskGroup: []
        },
        jqueryMap = {},
        setJqueryMap,
        configModel, initCreateTask, initShowTask,
        renderTaskGroupChangeTags, renderTaskTags, getCurrentTags,
        init, attachEvents, funChange, togglePeople, getSelectTaskGroup,
        watchersAddWin, renderMembers, watchersPicker,
        setTemplateValue, onChangeTaskGroup,
        taskModify, taskReSave, taskEdit, taskReturn, taskBack, taskDelete, setEditValue, taskPageTypeSetting,
        refreshOperateBtn;
    //事件列表

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = $.extend(jqueryMap ? jqueryMap : {}, {
            $box: $("#workflow-task"),
            $container: $container,
            $taskContent: $container.find('#taskContent'),
            $processSelector: $container.find('#taskProcessSelector'),
            $taskGroupSelector: $container.find('#taskGroupSelector'),
            $taskBasic: $container.find('#taskBasic'),
            $taskGroupProcess: $container.find('#taskGroupProcess'),
            $taskContentForm: $container.find('#taskContent'),
            $taskTags: $container.find('#taskTags'),
            $taskDetail: $container.find('#taskDetail'),
            $faultCurve: $container.find('#fault-curve'),
            $taskOperation: $container.find('#operation')
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

    init = function ($container, taskId) {
        stateMap.$container = $container;
        resetWidth($container);
        if (taskId) {
            return initShowTask(taskId);
        } else {
            return initCreateTask();
        }
    };

    var resetWidth = function ($container) {
        $container.css({
            'left': '280px',
            'width': 'calc(100% - 340px)',
            'padding-left': '2px'
        });
    };

    initCreateTask = function () {
        Spinner.spin(ElScreenContainer);
        var hashMap = ScreenManager._getHashParamsMap();
        stateMap.viewModel = {};
        if (hashMap && hashMap.groupId) {
            beop.model.stateMap.currentGroupId = hashMap.groupId;
            beop.model.stateMap.selectedGroupId = hashMap.groupId;
        } else {
            beop.model.stateMap.selectedGroupId = null;
            beop.model.stateMap.currentGroupId = null;
        }
        return configMap.groupModel.getTaskGroup(beop.model.stateMap.currentGroupId).done(function (result) {
            if (!result.success) {
                return false;
            }
            return WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
                stateMap.$container.html(resultHtml);
                stateMap.viewType = beop.constants.viewType.CREATE;

                taskPageTypeSetting(stateMap.viewType);
                $("#taskContent").append(beopTmpl('tpl_detail_edit'));
                setJqueryMap();
                stateMap.viewModel.taskGroup = result.data ? result.data : [];
                stateMap.addedWatchersList = [];


                stateMap.current_node_index = -1;

                if (beop.model.stateMap.currentGroupId) {
                    setProcessesByGroupId(beop.model.stateMap.currentGroupId);

                } else {
                    beop.model.stateMap.currentGroupId = stateMap.viewModel.taskGroup[0]._id;
                    setProcessesByGroupId(beop.model.stateMap.currentGroupId);
                }
                var vm = $.extend({}, stateMap.viewModel);
                if (!vm.process && vm.taskGroup.length) {
                    vm.process = vm.taskGroup[0].process;
                    stateMap.currentProcess = vm.process[0];
                }
                jqueryMap.$taskGroupProcess.empty().append(beopTmpl('tpl_wf_task_group_process', vm));
                if (stateMap.currentProcess) {
                    renderProcessFlow(stateMap.currentProcess.nodes);
                    renderTemplate({template: getProcessTemplate(stateMap.currentProcess._id), fields: false});
                }
                //如果有选中的项目,新建工单默认建在该项目下
                changeTaskGroup(beop.model.stateMap.currentGroupId);
                getSelectTaskGroup();
                initDatePicker();
                initFileUpload(true);
                attachEvents();
                I18n.fillArea(jqueryMap.$container);
            })
        }).always(function () {
            Spinner.stop();
        });
    };

    initShowTask = function (taskId) {
        Spinner.spin(ElScreenContainer);
        return configMap.taskModel.getTask(taskId).done(function (result) {
            if (!result.success) {
                return false;
            }
            return WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
                stateMap.$container.html(resultHtml);
                stateMap.viewType = beop.constants.viewType.SHOW;

                taskPageTypeSetting(stateMap.viewType);
                $("#taskContent").append(beopTmpl('tpl_detail_edit'));
                $("#wf-detail-funWrapper").html(beopTmpl("tpl_task_comment_progress"));
                var $taskDelete = $("#taskDelete"),
                    $taskReSave = $("#taskReSave"),
                    $taskModify = $("#taskModify");
                $taskDelete.attr('taskId', taskId);
                if (result.data.creator === AppConfig.userId) {
                    $taskDelete.show();
                }

                setJqueryMap();

                stateMap.viewModel = result.data ? result.data : [];
                stateMap.currentProcess = stateMap.viewModel.process;
                stateMap.current_node_index = stateMap.viewModel && stateMap.viewModel.node_index;
                stateMap.taskId = taskId;
                stateMap.processMember = {};
                if (stateMap.current_node_index === undefined) { // 工单完成状态
                    $taskModify.hide();
                    $taskReSave.hide();
                    $taskDelete.hide();
                } else { // 工单非完成状态
                    if (stateMap.currentProcess.nodes[stateMap.current_node_index].members[0].id === AppConfig.userId) { // 操作者为本人是可进行编辑
                        $taskModify.show();
                    } else {
                        $taskModify.hide();
                        $taskReSave.hide();
                    }
                }
                renderTaskDetail();
                attachEvents();

                // task content comment progress nav bar
                jqueryMap.$taskDetailCommentNav = jqueryMap.$container.find("#wf-detail-comment-nav");
                jqueryMap.$taskDetailProgressNav = jqueryMap.$container.find("#wf-detail-progress-nav");
                jqueryMap.$taskDetailComment = jqueryMap.$container.find("#task-reply-list");
                jqueryMap.$taskDetailProgress = jqueryMap.$container.find("#wf-detail-progress");
                jqueryMap.$container.off('.funChange').on('click.funChange', '#wf-detail-funUl li', funChange);

                I18n.fillArea(jqueryMap.$container);
            })
        }).always(function () {
            Spinner.stop();
        });
    };

    taskPageTypeSetting = function () {
        refreshOperateBtn(stateMap.viewType);
    };

    refreshOperateBtn = function (str) { // 刷新顶部按钮
        $("#wfOperateBtnBox").html(beopTmpl('tpl_operate_btn', {type: str}));
    };

    attachEvents = function () {
        jqueryMap.$taskContent.on('change', '#taskGroupSelector', onChangeTaskGroup);
        jqueryMap.$taskContent.on('change', '#taskProcessSelector', changeProcess);
        jqueryMap.$taskContent.on('click.taskSave', '#taskSave', taskSave);
        jqueryMap.$taskContent.on('click.taskComplete', '#taskComplete', taskComplete);
        jqueryMap.$taskContent.on('click.taskNoPass', '#taskNoPass', taskNoPass);
        jqueryMap.$taskContent.on('click.taskPass', '#taskPass', taskPass);
        jqueryMap.$taskContent.off('.tagDelete').on('click.tagDelete', '.wf-detail-tag-delete', tagDelete);
        jqueryMap.$taskContent.off('.tagSelect').on('change.tagSelect', '#wf-labelNames', tagSelect);
        jqueryMap.$taskContent.off('.togglePeople').on('click.togglePeople', '.process-people-show', togglePeople);
        jqueryMap.$taskContent.off('.wfWatchersAdd').on('click.wfWatchersAdd', '#wfWatchersAdd', watchersAddWin);
        jqueryMap.$box.off('.taskEdit').on('click.taskEdit', '#taskEdit', taskEdit);
        jqueryMap.$box.off('.taskModify').on('click.taskModify', '#taskModify', taskModify);
        jqueryMap.$box.off('.taskReturn').on('click.taskReturn', '#taskReturn', taskReturn);
        jqueryMap.$box.off('.taskBack').on('click.taskBack', '#taskBack', taskBack);
        jqueryMap.$box.off('.taskDelete').on('click.taskDelete', '#taskDelete', taskDelete);
        jqueryMap.$box.off('.taskReSave').on('click.taskReSave', '#taskReSave', taskReSave);
    };

//region---------DOM操作------
    var renderGroupProcess, initDatePicker, renderTemplate, renderTaskDetail, renderProcessFlow, renderProcessMember;
    var uniqueMembers = function (members) {
        var tempMap = {};
        for (var m = 0; m < members.length; m++) {
            tempMap[members[m].id] = members[m];
        }
        var rv = [];
        for (var id in tempMap) {
            if (tempMap.hasOwnProperty(id)) {
                rv.push(tempMap[id]);
            }
        }
        return rv;
    };
    togglePeople = function () {
        var $this = $(this), index = $this.data('index');
        var $userWrapper = $this.closest('.item-peoples-box');
        var node = stateMap.currentProcess.nodes[index];
        beop.view.memberSelected.init($('body'), {
            configModel: {
                cb_dialog_hide: function (selectedUser) {
                    stateMap.processMember[node._id] = selectedUser;
                    renderProcessMember($userWrapper.find('.teamPeople'), selectedUser[0]);
                },
                maxSelected: 1,
                userReadOnly: stateMap.viewType == beop.constants.viewType.SHOW,
                userHasSelected: stateMap.processMember[node._id],
                userMemberMap: uniqueMembers(stateMap.currentProcess.nodes[index].members)
            }
        });
    };
    watchersAddWin = function (e) {
        Spinner.spin(stateMap.$container.get(0));
        WebAPI.get('/workflow/teamArch/').done(function (result) {
            if (result.success) {
                beop.view.memberSelected.configModel({
                    cb_dialog_hide: function (addedUserList) {
                        stateMap.addedWatchersList = addedUserList;
                        renderMembers(addedUserList);
                    },
                    maxSelected: null,
                    userMemberMap: uniqueMembers(result.data),
                    userHasSelected: stateMap.addedWatchersList
                });
                watchersPicker = beop.view.memberSelected.init(stateMap.$container);
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    renderMembers = function (addedUserList) { // 刷新成员结构
        $('#wf-watchers-add').html(beopTmpl('tpl_wf_added_member', {members: addedUserList}));
    };

    renderGroupProcess = function () {
        jqueryMap.$processSelector = $('#taskProcessSelector');
        jqueryMap.$processSelector.empty().append(beopTmpl('tpl_wf_task_process_option', {process: stateMap.viewModel.process}));
    };

    initDatePicker = function () {
        jqueryMap.$due_time = jqueryMap.$container.find('#taskDueTime');
        jqueryMap.$due_time.datetimepicker({
            minView: 2,
            format: "yyyy-mm-dd",
            startDate: new Date().format('yyyy-MM-dd 00:00:00'),
            autoclose: true
        });
    };

    renderProcessMember = function ($box, member) {
        $box.replaceWith(beopTmpl('tpl_wf_change_user', {
            member: member
        }));
    };

    renderProcessFlow = function (process_nodes, node_index) {
        if (typeof node_index == typeof undefined) {
            node_index = -1;
        }
        var creator = {userpic: '', userfullname: ''};
        if (stateMap.viewType == beop.constants.viewType.SHOW) {
            creator = stateMap.viewModel.creatorInfo;
        } else {
            creator = {
                userpic: AppConfig.userProfile.picture,
                userfullname: AppConfig.userProfile.fullname
            };
        }

        jqueryMap.$taskProcess = $('#taskProcess').empty().append(beopTmpl('tpl_wf_task_process', {
            nodes: process_nodes,
            creator: creator,
            node_index: node_index,
            status: stateMap.viewModel.status,
            stateMap: stateMap
        }));

        $(".process-people-show").closest('.wf_add_process_people').css('margin-right', '14px').end()
            .siblings('.fuLineBox').css('left', '92px');
        I18n.fillArea(jqueryMap.$taskProcess);
    };

    renderTemplate = function (template) {
        var $taskTemplateFields = $('#taskTemplateFields');
        if (template && template.template && template.template._id) {
            $taskTemplateFields.empty().append(beopTmpl('tpl_wf_task_template', template)).show();
            $('.template-date').datetimepicker({
                format: timeFormatChange('yyyy-mm-dd'),
                minView: 'month',
                startView: 'month',
                autoclose: true,
                todayBtn: true,
                forceParse: false,
                startDate: "2010-01-01 00:00",
                initialDate: new Date()
            })
        } else {
            $taskTemplateFields.hide();
        }
    };

    getCurrentTags = function (tagSelectNameList, tagList) {
        var tagsNameList = [], currentTagsList = [];
        for (var i = 0; i < tagList.length; i++) {
            tagsNameList.push(tagList[i].name);
        }
        for (var j = 0; j < tagSelectNameList.length; j++) {
            var index = $.inArray(tagSelectNameList[j], tagsNameList);
            if (index !== -1) {
                currentTagsList.push(tagList[j]);
            }
        }
        return currentTagsList;
    };

    //task group 改变后的加载对应的tags
    renderTaskGroupChangeTags = function () {
        jqueryMap.$taskTags.find('#wf-labelWrapper').empty().html(beopTmpl('tpl_wf_labels', {
            tags: stateMap.currentTags,
            enableEdit: true
        }));
        jqueryMap.$taskTags.find('#wf-labelNames').empty().html(beopTmpl('tpl_wf_labels_select', {tags: stateMap.selectTaskGroup}));
    };

    renderTaskDetail = function () {
        if (stateMap.viewModel.process) {
            renderProcessFlow(stateMap.currentProcess.nodes, stateMap.viewModel.node_index);
            renderTemplate({template: stateMap.viewModel.template, fields: stateMap.viewModel.fields});
            jqueryMap.$taskContent.find('.taskEditSection').show();
        } else {
            jqueryMap.$taskContent.find('.taskEditSection').hide();
        }
        jqueryMap.$taskContent.find('#wf-labelNames').replaceWith(beopTmpl('tpl_wf_labels', {
            tags: (function () {
                var result = [];
                stateMap.viewModel.tags && stateMap.viewModel.tags.forEach(function (item) {
                    result.push({name: item})
                });
                return result;
            })(),
            enableEdit: false
        })).html();
        jqueryMap.$taskBasic.empty().append(beopTmpl('tpl_wf_task_basic', stateMap.viewModel));
        jqueryMap.$taskDetail.empty().append(beopTmpl('tpl_wf_task_detail', stateMap.viewModel));
        if (stateMap.viewModel.fields && stateMap.viewModel.fields.charts) {

            $('#fault-curve').show();
            beop.view.faultCurve.configModel({
                transactions_model: beop.model.transactionsModel
            });
            beop.view.faultCurve.init(jqueryMap.$faultCurve.find('.fault-feedback-curve'), {
                points: stateMap.viewModel.fields.charts.chartPointList,
                timeFormat: stateMap.viewModel.fields.charts.chartQueryCircle,
                timeStart: stateMap.viewModel.fields.charts.chartStartTime,
                timeEnd: stateMap.viewModel.fields.charts.chartEndTime,
                projectId: stateMap.viewModel.fields.charts.projectId
            });
        }

        var vm = $.extend({}, stateMap.viewModel);
        stateMap.viewModel.watchersInfo && renderMembers(stateMap.viewModel.watchersInfo);
        $("#wfWatchersAdd").hide();

        jqueryMap.$taskGroupProcess.empty().append(beopTmpl('tpl_wf_task_group_process', vm));
        initFileUpload();
        //reply list
        beop.view.replyList.init($("#task-reply-list"));
        I18n.fillArea(jqueryMap.$taskContent);
        jqueryMap.$taskOperation.empty();
        if (stateMap.viewModel.status < 2) {
            if (stateMap.currentProcess.nodes.length) {
                var currentNode = stateMap.currentProcess.nodes[stateMap.viewModel.node_index], executor;

                if (currentNode.members.length != 1) {//当前节点执行人个数不正确
                    return false;
                } else {
                    executor = currentNode.members[0];
                    if (executor.id != AppConfig.userId) {
                        return;
                    }
                    if (!currentNode.action) {//当前节点执行人不是自己
                        jqueryMap.$taskOperation.append(beopTmpl('tpl_operation_' + currentNode.behaviour));
                    }
                }
            }
        }
    };

//region---------方法---------
    var setProcessesByGroupId, getProcess, getProcessTemplate, getProcessNodes, getNextNode,
        isLastNode, getTagById, initFileUpload;
    initFileUpload = function (isCreateNewTask) {
        stateMap.fileUploadInstance = new WfFileUpload();
        stateMap.fileUploadInstance.set("$container", jqueryMap.$taskContent.find('#wf-attachment-labelWrapper'));
        stateMap.fileUploadInstance.set("isCreateNewTask", isCreateNewTask);
        stateMap.fileUploadInstance.show();
    };
    getTagById = function (id) {
        for (var i = 0, iLen = stateMap.selectTaskGroup.length; i < iLen; i++) {
            if (stateMap.selectTaskGroup[i].id == id) {
                return stateMap.selectTaskGroup[i];
            }
        }
    };
    setProcessesByGroupId = function (groupId) {
        stateMap.processMember = {};
        stateMap.currentProcess = {};
        for (var m = 0, n = stateMap.viewModel.taskGroup.length; m < n; m++) {
            if (stateMap.viewModel.taskGroup[m]._id == groupId) {
                stateMap.viewModel.process = stateMap.viewModel.taskGroup[m].process;
                stateMap.currentProcess = stateMap.viewModel.process[0];
                break;
            }
        }
    };

    getNextNode = function () {
        var nodes = stateMap.currentProcess && stateMap.currentProcess.nodes;
        if (!nodes) {
            return null;
        }
        if ((stateMap.current_node_index + 1) < nodes.length) {
            return nodes[stateMap.current_node_index + 1];
        } else {
            return null;
        }
    };

    isLastNode = function () {
        var nodes = stateMap.currentProcess && stateMap.currentProcess.nodes;
        if (!nodes) {
            return false;
        }
        return (stateMap.current_node_index + 1) == nodes.length;
    };

    getProcess = function (process_id) {
        if (!stateMap.viewModel || !stateMap.viewModel.process) {
            return false;
        }
        for (var m = 0, n = stateMap.viewModel.process.length; m < n; m++) {
            if (stateMap.viewModel.process[m]._id == process_id) {
                return stateMap.viewModel.process[m];
            }
        }
    };

    getProcessTemplate = function (process_id) {
        var process = getProcess(process_id);
        return process && process.template;
    };

    getProcessNodes = function (process_id) {
        var process = getProcess(process_id);
        return process && process.nodes;
    };

    var getNodeById = function (id) {
        for (var m = 0; m < stateMap.currentProcess.nodes.length; m++) {
            if (stateMap.currentProcess.nodes[m]._id == id) {
                return stateMap.currentProcess.nodes[m];
            }
        }
    };
//endregion

//region---------事件---------
    var changeTaskGroup, changeProcess, taskSave, validData, taskComplete, taskNoPass, taskPass, taskAction, tagDelete, tagSelect;
    tagSelect = function (ev) {
        var $this = $(ev.target), $select = $this.closest('#wf-labelNames'), value = $select.val();
        if (value != -1) {
            for (var s = 0, sLen = stateMap.currentTags.length; s < sLen; s++) {
                if (stateMap.currentTags[s].id == value) {
                    return;
                }
            }
            stateMap.currentTags.push($.extend(true, {}, getTagById(value)));
            jqueryMap.$taskTags.find('#wf-labelWrapper').empty().html(beopTmpl('tpl_wf_labels', {
                tags: stateMap.currentTags,
                enableEdit: true
            }));
        }
    };
    tagDelete = function (ev) {
        var $this = $(ev.target), id = $this.data('id');
        stateMap.currentTags.forEach(function (item, index) {
            if (item.id == id) {
                stateMap.currentTags.splice(index, 1);
                $('#wf-labelNames').val('-1');
            }
        });
        jqueryMap.$taskTags.find('#wf-labelWrapper').empty().html(beopTmpl('tpl_wf_labels', {
            tags: stateMap.currentTags,
            enableEdit: true
        }));
    };
    getSelectTaskGroup = function () {
        stateMap.currentTags = [];
        renderTaskTags();
        renderTaskGroupChangeTags();
    };
    renderTaskTags = function () {
        stateMap.selectTaskGroup = [];
        stateMap.viewModel.taskGroup[0].tags.forEach(function (item) {
            if (item) {
                stateMap.selectTaskGroup.push($.extend(true, {}, item, {id: ObjectId()}));
            }
        });
    };
    onChangeTaskGroup = function () {
        changeTaskGroup($(this).val());
    };

    changeTaskGroup = function (groupId) {
        if (!groupId) {
            return;
        }
        setProcessesByGroupId(groupId);
        if (stateMap.viewModel && stateMap.viewModel.process) {
            renderGroupProcess();
            if (stateMap.currentProcess) {
                renderProcessFlow(getProcessNodes(stateMap.currentProcess._id));
                renderTemplate({template: getProcessTemplate(stateMap.currentProcess._id), fields: false});
                jqueryMap.$taskContent.find('.taskEditSection').show();
            } else {
                jqueryMap.$taskContent.find('.taskEditSection').hide();
                jqueryMap.$taskContent.find('#taskProcess').empty();
            }
        }
        I18n.fillArea(jqueryMap.$taskContent);
    };

    changeProcess = function () {
        var process_id = $(this).val();
        stateMap.currentProcess = getProcess(process_id);
        renderProcessFlow(stateMap.currentProcess.nodes);
        renderTemplate({template: getProcessTemplate(process_id), fields: false});
        I18n.fillArea(jqueryMap.$taskContent);
    };
    validData = function (submitModel) {
        var nextNode = getNextNode();
        if (!nextNode) {
            return false;
        }
        if (!nextNode._id || !submitModel.processMember || !submitModel.processMember[nextNode._id]) {
            var behaviour = I18n.resource.workflow.team['ADD_PROCESS_BEHAVIOR_TYPE_' + nextNode.behaviour];
            return I18n.resource.workflow.main.NOT_CHANGE_WORKFLOW_NODE.format(behaviour);
        }
    };

    funChange = function () { // 详情评论，工单进程等tab页切换
        if ($(this).hasClass('active')) {
            return;
        }
        var type = $(this).attr("data-param");
        jqueryMap.$taskDetailCommentNav.toggleClass('active');
        jqueryMap.$taskDetailProgressNav.toggleClass('active');
        if (type == "comment") {
            jqueryMap.$taskDetailComment.show();
            jqueryMap.$taskDetailProgress.hide();
        } else if (type == "progress") {
            jqueryMap.$taskDetailComment.hide();
            jqueryMap.$taskDetailProgress.show();
            // 调用历史记录
            beop.view.progress.init(jqueryMap.$taskDetailProgress);
        }
    };

    taskEdit = function () { // 工单编辑  暂不用
        configMap.groupModel.getTaskGroup().done(function (result) {
            stateMap.viewType = beop.constants.viewType.EDIT;
            var $taskContent = $("#taskContent");
            taskPageTypeSetting(stateMap.viewType);
            stateMap.detailDetach = $taskContent.children();
            $taskContent.empty().append(beopTmpl('tpl_detail_edit'));
            setJqueryMap();
            stateMap.viewModel.taskGroup = result.data ? result.data : [];
            var vm = $.extend({}, stateMap.viewModel);
            if (!vm.process && vm.taskGroup.length) {
                vm.process = vm.taskGroup[0].process;
                stateMap.currentProcess = vm.process[0];
            }
            jqueryMap.$taskGroupProcess.empty().append(beopTmpl('tpl_wf_task_group_process', vm));
            $("#taskGroupSelector").val(stateMap.viewModel.taskGroupId).change();
            // 加载tag
            stateMap.currentTags = getCurrentTags(stateMap.viewModel.tags, stateMap.viewModel.taskGroup[0].tags);
            renderTaskTags();
            renderTaskGroupChangeTags();
            // 加载曲线
            if (stateMap.viewModel.fields && stateMap.viewModel.fields.charts) {
                $('#fault-curve').show();
                beop.view.faultCurve.configModel({
                    transactions_model: beop.model.transactionsModel
                });
                beop.view.faultCurve.init(jqueryMap.$faultCurve.find('.fault-feedback-curve'), {
                    points: stateMap.viewModel.fields.charts.chartPointList,
                    timeFormat: stateMap.viewModel.fields.charts.chartQueryCircle,
                    timeStart: stateMap.viewModel.fields.charts.chartStartTime,
                    timeEnd: stateMap.viewModel.fields.charts.chartEndTime,
                    projectId: stateMap.viewModel.fields.charts.projectId
                });
            }
            // 加载相关人员
            stateMap.addedWatchersList = stateMap.viewModel.watchersInfo;
            stateMap.viewModel.watchersInfo && renderMembers(stateMap.addedWatchersList);
            // 加载其余值
            setEditValue(stateMap.viewModel);
            initDatePicker();
            initFileUpload();
            attachEvents();
            I18n.fillArea(jqueryMap.$container);
        });
    };

    setEditValue = function (model) {
        $("#taskTitle").val(model.fields.title);
        $("#taskDueTime").val(model.fields.dueDate);
        $("#taskCritical").val(model.fields.critical);
        $("#wfDetail").val(model.fields.detail);
        // 自定义模板赋值
        setTemplateValue(model);
    };

    setTemplateValue = function (model) {
        var $taskTemplateFields = $('#taskTemplateFields');
        var template = model.template;
        if (model.fields) {
            for (var i = 0; i < template.fields.length; i++) {
                var item = template.fields[i],
                    $formDom = $taskTemplateFields.find('[name = ' + item.name + ']');
                if ($formDom.attr('type') && $formDom.attr('type').toLowerCase() === 'radio') {
                    $formDom.each(function (index, item) {
                        var $item = $(item);
                        if ($item.val() == model.fields[item.name]) {
                            $item.prop('checked', true);
                        }
                    });
                } else {
                    $formDom.val(model.fields[item.name]);
                }
            }
        }
    };

    taskModify = function () { // 工单编辑
        // 加载相关人员添加按钮
        stateMap.addedWatchersList = stateMap.viewModel.watchersInfo;
        $("#wfWatchersAdd").show();
        $("#taskModify").hide();
        $("#taskReSave").show();
    };

    taskDelete = function () {
        confirm('确认删除此工单么?', function () {
            Spinner.spin(ElScreenContainer);
            configMap.taskModel.deleteTask($("#taskDelete").attr('taskId')).done(function (result) {
                if (result.success) {
                    taskBack();
                }
            }).always(function () {
                Spinner.stop();
            });
        });
    };

    taskBack = function () {
        window.history.back(-1);
    };

    taskReturn = function () {
        stateMap.detailDetach && $("#taskContent").html(stateMap.detailDetach);
        taskPageTypeSetting('show');
    };

    taskReSave = function () { // 暂只重新保存相关人员
        Spinner.spin(ElScreenContainer);
        var fields = jqueryMap.$taskContentForm.serializeObject();
        var watcherList = [], watchersStr = 'watchers[]', taskId = $("#taskDelete").attr('taskId');
        if (fields[watchersStr] && fields[watchersStr].length) {
            for (var i = 0; i < fields[watchersStr].length; i++) {
                watcherList.push(parseInt(fields[watchersStr][i]));
            }
        }
        var submitModel = {
            watchers: watcherList,
            _id: taskId
        };
        configMap.taskModel.saveTask(submitModel).done(function (result) {
            if (result.success) {
                $("#taskModify").show();
                $("#taskReSave").hide();
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    taskSave = function (ev) {
        var fields = jqueryMap.$taskContentForm.serializeObject(), validRuleList = ['taskGroup', 'title', 'dueDate', 'detail', 'process'], unValidType = undefined;
        if (validRuleList.some(function (item) {
                if (!fields[item] || fields[item] === 'undefined') {
                    unValidType = item;
                    return true;
                }
            })) {
            infoBox.alert(I18n.resource.workflow.main.NEW_ORDER_FALSE_ALERT + unValidType, {
                buttons: {
                    ok: {
                        text: 'OK',
                        class: 'alert-button',
                        callback: function () {
                            jqueryMap.$taskContentForm.find('[name="' + unValidType + '"]').focus();
                        }
                    }
                }
            });
            ev.preventDefault();
            return false;
        }
        //esacpe user input data
        var key, item;
        for (key in fields) {
            if (fields.hasOwnProperty(key)) {
                item = fields[key];
                typeof item == "string" && (fields[key] = StringUtil.htmlEscape(item))
            }
        }
        var watcherList = [], watchersStr = 'watchers[]';
        if (fields[watchersStr] && fields[watchersStr].length) {
            for (var i = 0; i < fields[watchersStr].length; i++) {
                watcherList.push(parseInt(fields[watchersStr][i]));
            }
            delete fields[watchersStr];
        }
        var submitModel = {
            fields: fields,
            processMember: stateMap.processMember,
            watchers: watcherList,
            tags: (function () {
                var result = [];
                stateMap.currentTags.forEach(function (item) {
                    result.push(item.name);
                });
                return result;
            })(),
            attachment: stateMap.fileUploadInstance.allFileList
        };
        var valid_resp = validData(submitModel);
        if (valid_resp) {
            confirm(valid_resp, function () {
                var node_selected_members = [];
                beop.view.memberSelected.configModel({
                    cb_dialog_hide: function (addedUserList) {
                        if (stateMap.currentProcess.nodes[0]) {
                            submitModel.processMember[stateMap.currentProcess.nodes[0]._id] = node_selected_members = addedUserList;
                        }
                        renderProcessMember($('#taskProcess').find('.noImplement:eq(0) .teamPeople'), addedUserList[0]);
                    },
                    maxSelected: 1,
                    userMemberMap: uniqueMembers(stateMap.currentProcess.nodes[0] ? stateMap.currentProcess.nodes[0].members : []),
                    userHasSelected: node_selected_members
                });
                beop.view.memberSelected.init($('body'));
            });
        } else {
            Spinner.spin(ElScreenContainer);
            configMap.taskModel.saveTask(submitModel).done(function (result) {
                if (result.success) {
                    location.hash = '#page=workflow&type=transaction&transactionId=' + result.data;
                }
            }).always(function () {
                Spinner.stop();
            });
        }
    };

    taskComplete = function () {
        if (isLastNode()) {
            taskAction(configMap.taskModel.completeTask, [stateMap.taskId, '']);
        }

        var nextNode = getNextNode();

        if (nextNode && nextNode.members.length !== 1) {
            var behaviour = I18n.resource.workflow.team['ADD_PROCESS_BEHAVIOR_TYPE_' + nextNode.behaviour];
            var msg = I18n.resource.workflow.main.NOT_CHANGE_WORKFLOW_NODE.format(behaviour);
            confirm(msg, function () {
                var node_selected_members = [];
                beop.view.memberSelected.configModel({
                    cb_dialog_hide: function (addedUserList) {
                        node_selected_members = nextNode.members = addedUserList;
                        stateMap.processMember[nextNode._id] = addedUserList;
                        renderProcessFlow(stateMap.currentProcess.nodes, stateMap.viewModel.node_index);

                        if (addedUserList && addedUserList.length) {
                            taskAction(configMap.taskModel.completeTask, [stateMap.taskId, addedUserList[0].id]);
                        }
                    },
                    maxSelected: 1,
                    userMemberMap: uniqueMembers(nextNode.members),
                    userHasSelected: node_selected_members
                });
                beop.view.memberSelected.init($('body'));
            });
        } else if (nextNode.members.length === 1) {
            taskAction(configMap.taskModel.completeTask, [stateMap.taskId, nextNode.members[0].id]);
        }
    };

    //action is an action promise
    // params is like [taskId, nextUserId]
    taskAction = function (action, params, showTaskDetail) {
        Spinner.spin(ElScreenContainer);
        if (typeof showTaskDetail == typeof undefined) {
            showTaskDetail = true;
        }
        return action.apply(null, params).done(function (result) {
            if (result.success) {
                if (result.data) {
                    stateMap.taskId = result.data;
                }
                if (showTaskDetail) {
                    stateMap.taskId && initShowTask(stateMap.taskId);
                }

            } else {
                alert(I18n.resource.workflow.main.SAVE_FAILED);
            }

        }).always(function () {
            Spinner.stop();
        });
    };

    taskPass = function () {
        if (isLastNode()) {
            taskAction(configMap.taskModel.passTask, [stateMap.taskId, '']);
        }

        var nextNode = getNextNode();

        if (nextNode.members.length !== 1) {
            var behaviour = I18n.resource.workflow.team['ADD_PROCESS_BEHAVIOR_TYPE_' + nextNode.behaviour];
            var msg = I18n.resource.workflow.main.NOT_CHANGE_WORKFLOW_NODE.format(behaviour);
            confirm(msg, function () {
                var node_selected_members = [];
                beop.view.memberSelected.configModel({
                    cb_dialog_hide: function (addedUserList) {
                        node_selected_members = nextNode.members = addedUserList;
                        stateMap.processMember[nextNode._id] = addedUserList;
                        renderProcessFlow(stateMap.currentProcess.nodes, stateMap.viewModel.node_index);

                        if (addedUserList && addedUserList.length) {
                            taskAction(configMap.taskModel.passTask, [stateMap.taskId, addedUserList[0].id]);
                        }
                    },
                    maxSelected: 1,
                    userMemberMap: uniqueMembers(nextNode.members),
                    userHasSelected: node_selected_members
                });
                beop.view.memberSelected.init($('body'));
            });
        } else if (nextNode.members.length === 1) {
            taskAction(configMap.taskModel.passTask, [stateMap.taskId, nextNode.members[0].id]);
        }
    };

    taskNoPass = function () {
        confirm(I18n.resource.workflow.main.SURE_NOT_PASS, function () {
            taskAction(configMap.taskModel.noPassTask, [stateMap.taskId]);
        }, $.noop, {type: 'danger'})
    };

//endregion

//---------Exports---------
    beop.view = beop.view || {};
    beop.view.task = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

/// <reference path="../lib/jquery-1.11.1.js" />
var WorkflowMine = (function () {
    var profilePromise,
        memberListPromise = {};

    function getStatusText(status) {
        I18n.fillArea($("span"));

        switch (status) {
            case 0:
                return I18n.resource.workflow.mine.TASK_STATUS_NEW;
            case 1:
                return I18n.resource.workflow.mine.TASK_STATUS_DISTRIBUTED;
            case 2:
                return I18n.resource.workflow.mine.TASK_STATUS_PROCESSING;
            case 3:
                return I18n.resource.workflow.mine.TASK_STATUS_PAUSED;
            case 4:
                return I18n.resource.workflow.mine.TASK_STATUS_COMPLETED;
        }
    }

    function _GroupArray(prop, array) {
        var group = {};
        for (var n = 0, nlen = array.length; n < nlen; n++) {
            var item = array[n], groupItem = group[item[prop]];
            if (groupItem) {
                groupItem.push(item);
            } else {
                group[item[prop]] = [item];
            }
        }
        return group;
    }


    function WorkflowMine() {
        this.i18 = I18n.resource.workflow.urgencyLevel;
        this.i18n = I18n.resource.workflow.main;
        this.i18urgencyLevelArr = ["workflow.urgencyLevel.0", "workflow.urgencyLevel.1", "workflow.urgencyLevel.2"];
    };

    WorkflowMine.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/workflow/mine.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();
                I18n.fillArea($("#workflow-mine"));
            });
        },

        close: function () {
        },
        check_empty_tasks: function () {
            var new_tasks = $('.new-task-row .task-items'),
                urgent_tasks = $('.urgent-task-row .task-items'),
                pend_tasks = $('.pend-task-row .task-items');
            if (new_tasks.find('.task-item').length === 0) {
                new_tasks.find('.empty-message').show();
            } else {
                new_tasks.find('.empty-message').hide();
            }

            if (urgent_tasks.find('.task-item').length === 0) {
                urgent_tasks.find('.empty-message').show();
            } else {
                urgent_tasks.find('.empty-message').hide();
            }

            if (pend_tasks.find('.task-item').length === 0) {
                pend_tasks.find('.empty-message').show();
            } else {
                pend_tasks.find('.empty-message').hide();
            }
        },
        refresh_tasks: function () {
            var _this = this;
            Spinner.spin($(".workflow-container")[0]);
            return WorkflowTool.getWorkflowTemplate('#wf-mine-tasks').pipe(function (template) {
                return $.get('/workflow/transaction/notCompleted/' + AppConfig.userId).done(function (result) {
                    try {
                        var result_json = JSON.parse(result);
                    } catch (e) {
                        return;
                    }
                    var new_tasks = $('.new-task-row .task-items').find('.task-item').remove().end(),
                        urgent_tasks = $('.urgent-task-row .task-items').find('.task-item').remove().end(),
                        pend_tasks = $('.pend-task-row .task-items').find('.task-item').remove().end();

                    for (var n = 0, nlen = result_json.length; n < nlen; n++) {
                        var item = result_json[n];
                        var temp = template.clone();
                        temp.attr('task-id', item.id);
                        temp.find('.task-title').html('<span class="taskNoWrapper"><em i18n="workflow.common.NUMBER"></em><em class="taskNo">'+item.id+'</em></span>：<span class="taskTxt">'+item.title+'</span>').attr('title', I18n.resource.workflow.common.NUMBER+item.id+":"+item.title);
                        temp.find('.date').text(item.dueDate ? new Date(item.dueDate).format('yyyy-MM-dd') : '').attr('title', 'deadline');
                        temp.find('.timer').children("span").removeClass().addClass("glyphicon ic" + item.critical).attr("i18n", 'title=' + _this.i18urgencyLevelArr[item.critical]);
                        temp.find('.alert-type').text(item.groupNm).attr('title', item.groupNm);
                        if (item.statusId === 2) {
                            temp.find('.play-pause').addClass('glyphicon-pause').attr("i18n", "title=workflow.main.PAUSE");
                        } else {
                            temp.find('.play-pause').addClass('glyphicon-play').attr("i18n", "title=workflow.main.START");
                        }
                        temp.find('.status').html(getStatusText(item.statusId))
                        temp.data('task', item);
                        switch (item.priority) {
                            case 5:
                                new_tasks.append(temp);
                                break;
                            case 6:
                                urgent_tasks.append(temp);
                                break;
                            case 4:
                                pend_tasks.append(temp);
                                break;
                        }
                    }
                    _this.check_empty_tasks();

                    //update the new task badge
                    var currentNewTask = localStorage.getItem('new_task_temp_' + AppConfig['userId']),
                        newTask = $('#ulPages').find('li[screen="mine"]').find('.badge').data('new-tasks');
                    if (newTask) {
                        var new_task_row = $('.new-task-row').find('.task-items');
                        new_task_row.css({border: '1px dotted #666', backgroundColor: 'antiquewhite'})
                        setTimeout(function () {
                            new_task_row.css({border: 'none', backgroundColor: 'white'})
                        }, 1000)
                    }
                    localStorage.setItem('new_task_' + AppConfig['userId'], currentNewTask);
                    WorkflowTool.updateBadge(0);
                }).done(function () {
                    //$(".task-item").draggable({
                    //    axis: "y",
                    //    cursor: "pointer",
                    //    revert: 'invalid',
                    //    helper: "clone"
                    //});
                    //
                    //$(".droppable-row").droppable({
                    //    accept: ".task-item",
                    //    hoverClass: "drop-active",
                    //    drop: function (event, ui) {
                    //        var $this = $(this), $draggedItem = $(ui.draggable), task = $draggedItem.data('task'), taskId = task.id;
                    //        if ($this.find('.task-item[task-id=' + taskId + ']').length === 0) {
                    //            var priority = $this.data('priority');
                    //            Spinner.spin($(".workflow-container")[0]);
                    //            WebAPI.post('/workflow/transaction/setPriority', {
                    //                id: taskId,
                    //                priority: priority
                    //            }).done(function (result) {
                    //                if (result === 'success') {
                    //                    $this.find('.task-items').append($draggedItem);
                    //                }
                    //                _this.check_empty_tasks();
                    //            }).always(function () {
                    //                Spinner.stop();
                    //            })
                    //        }
                    //    }
                    //});
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                    Spinner.stop();
                })
            })

        },
        refresh_categories: function () {//我的工单-分类
            var _this = this;
            Spinner.spin($(".workflow-container")[0]);
            return $.when(WorkflowTool.getWorkflowTemplate('#wf-mine-tasks'), WorkflowTool.getWorkflowTemplate('#wf-mine-tasks-complete')).done(function (tasks_template, completed_template) {
                return WebAPI.get('/workflow/transaction/getAll/' + AppConfig.userId).done(function (result) {
                    if (!result) {
                        return false;
                    }
                    try {
                        var result_obj = JSON.parse(result);
                    } catch (e) {
                        console.error(e);
                        return;
                    }
                    $('.categories-container').children().remove();
                    var groupedResult = _GroupArray('groupName', result_obj);
                    var inner_template = completed_template.clone();
                    var completedTaskItemTemplate = inner_template.find('.task-item'), uncompletedTaskItemTemplate = tasks_template.clone();
                    inner_template.find('.task-item').remove();
                    for (var groupNm in groupedResult) {
                        var template = inner_template.clone(), groups = groupedResult[groupNm];
                        template.find('.task-type').text(groupNm);
                        for (var n = 0, nlen = groups.length; n < nlen; n++) {
                            var group = groups[n];
                            if (group.statusId === 4) {
                                var taskItem = completedTaskItemTemplate.clone();
                                taskItem.find('.glyphicon-ok').attr("i18n", 'title=workflow.main.FINISHED');
                                taskItem.find('.task-title').html('<span class="taskNoWrapper"><em i18n="workflow.common.NUMBER"></em><em class="taskNo">'+group.id+'</em></span>：<span class="taskTxt">'+group.title+'</span>').attr('title', I18n.resource.workflow.common.NUMBER+group.id+":"+group.title);
                                taskItem.find('.date').text(group.completeTime ? new Date(group.completeTime).format('yyyy-MM-dd') : '').attr('title', 'resolved date');
                                taskItem.data('task', group);
                            } else {
                                var taskItem = uncompletedTaskItemTemplate.clone();
                                taskItem.find('.task-title').html('<span class="taskNoWrapper"><em i18n="workflow.common.NUMBER"></em><em class="taskNo">'+group.id+'</em></span>：<span class="taskTxt">'+group.title+'</span>').attr('title', I18n.resource.workflow.common.NUMBER+group.id+":"+group.title);
                                taskItem.find('.date').text(group.dueDate ? new Date(group.dueDate).format('yyyy-MM-dd') : '').attr('title', 'deadline');
                                if (group.statusId === 2) {
                                    taskItem.find('.play-pause').addClass('glyphicon-pause').attr("i18n", "title=workflow.main.PAUSE");
                                } else {
                                    taskItem.find('.play-pause').addClass('glyphicon-play').attr("i18n", "title=workflow.main.START");
                                }
                                taskItem.find('.status').html(getStatusText(group.statusId));
                                taskItem.data('task', group);
                            }
                            taskItem.find('.timer').children("span").removeClass().addClass("glyphicon ic" + group.critical).attr("i18n", 'title=' + _this.i18urgencyLevelArr[group.critical]);
                            template.find('.task-items').append(taskItem);
                        }
                        $('.categories-container').append(template);
                    }
                }).always(function () {
                    Spinner.stop();
                    I18n.fillArea($(ElScreenContainer));
                })
            })

        },
        refresh_mine: function () {//我的工单-我创建的
            var _this = this;
            Spinner.spin($(".workflow-container")[0]);
            return WorkflowTool.getWorkflowTemplate('#wf-mine-mines').then(function (template, completed_template) {
                return WebAPI.post('/workflow/myCreated/', {
                    userId: AppConfig.userId
                }).done(function (result) {
                    if (result.success) {
                        var new_tasks = $('.new-task-row .task-items').find('.task-item').remove().end(),
                            urgent_tasks = $('.urgent-task-row .task-items').find('.task-item').remove().end(),
                            pend_tasks = $('.pend-task-row .task-items').find('.task-item').remove().end(),
                            createDateArr = [],
                            dueDateArr = [],
                            workflowNamArr = [];
                        for (var n = 0, nlen = result.data.length; n < nlen; n++) {
                            var item = result.data[n];
                            var temp = template.clone();
                            temp.attr('task-id', item.id);
                            temp.attr('executor-id', item.executorID);
                            temp.attr('status-id', item.statusId);
                            temp.find('.task-title').html('<span class="taskNoWrapper"><em i18n="workflow.common.NUMBER"></em><em class="taskNo">' + item.id + '</em></span>：<span class="taskTxt">' + item.title + '</span>').attr('title', I18n.resource.workflow.common.NUMBER + item.id + ":" + item.title);
                            temp.find('.date').text(item.dueDate ? new Date(item.dueDate).format('yyyy-MM-dd') : '').attr('title', 'deadline');
                            temp.find('.create-date').text(item.dueDate ? new Date(item.createTime).format('yyyy-MM-dd') : '');
                            temp.find('.executor-person').text(item.executorName);
                            temp.find('.timer').children("span").removeClass().addClass("glyphicon ic" + item.critical).attr("i18n", 'title=' + _this.i18urgencyLevelArr[item.critical]);
                            temp.find('.alert-type').text(item.groupName).attr('title', item.groupName);
                            if (item.statusId === 4) {
                                    temp.find('.glyphiconWrapper').empty().html('<span class="glyphicon glyphicon-repeat" i18n="title=workflow.main.FINISH"></span>');
                            } else {
                                if (item.statusId === 2) {
                                    temp.find('.play-pause').addClass('glyphicon-pause').attr("i18n", "title=workflow.main.PAUSE");
                                } else {
                                    temp.find('.play-pause').addClass('glyphicon-play').attr("i18n", "title=workflow.main.START");
                                }
                            }
                            temp.find('.status').html(getStatusText(item.statusId));
                            temp.data('task', item);
                            createDateArr.push(item.dueDate ? new Date(item.createTime).format('yyyy-MM-dd') : '');
                            dueDateArr.push(item.dueDate ? new Date(item.dueDate).format('yyyy-MM-dd') : '');
                            workflowNamArr.push(item.groupName);
                            new_tasks.append(temp);
                        }
                        _this.check_empty_tasks();
                        $.each($(".task-item"), function (index, item) {
                            var $item = $(item);
                            var creatorID = $item.attr("executor-id");
                            if (creatorID != AppConfig.userId) {
                                $item.find(".operator .glyphicon").hide();
                            }
                        });
                        createDateArr.sort();
                        dueDateArr.sort();
                        workflowNamArr.sort();
                        $.unique(createDateArr);
                        $.unique(dueDateArr);
                        $.unique(workflowNamArr);
                        $("#selectCreateDate").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
                        $("#selectDueDate").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
                        $("#selectWorkflowName").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
                        for(var i=0;i<createDateArr.length;i++){
                            $("#selectCreateDate").append('<li>'+createDateArr[i]+'</li>');
                        }
                        for(var i=0;i<dueDateArr.length;i++){
                            $("#selectDueDate").append('<li>'+dueDateArr[i]+'</li>');
                        }
                        for(var i=0;i<workflowNamArr.length;i++){
                            $("#selectWorkflowName").append('<li>'+workflowNamArr[i]+'</li>');
                        }
                    }
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                    Spinner.stop();
                })
            })
        },
        refresh_completed: function () {
            Spinner.spin($(".workflow-container")[0]);
            return WorkflowTool.getWorkflowTemplate('#wf-mine-tasks-complete').pipe(function (completed_template) {
                return WebAPI.get('/workflow/transaction/completed/' + AppConfig.userId).done(function (result) {
                    if (!result) {
                        return false;
                    }
                    try {
                        var result_obj = JSON.parse(result);
                    } catch (e) {
                        console.error(e);
                        return;
                    }
                    $('.completed-container').children().remove();
                    var groupedResult = _GroupArray('groupName', result_obj);
                    var inner_completed_template = completed_template.clone();
                    var taskItemTemplate = inner_completed_template.find('.task-item');
                    inner_completed_template.find('.task-item').remove();
                    for (var groupNm in groupedResult) {
                        var template = inner_completed_template.clone(), groups = groupedResult[groupNm];
                        template.find('.task-type').text(groupNm);
                        for (var n = 0, nlen = groups.length; n < nlen; n++) {
                            var group = groups[n];
                            var taskItem = taskItemTemplate.clone();
                            taskItem.find('.task-title').html('<span class="taskNoWrapper"><em i18n="workflow.common.NUMBER"></em><em class="taskNo">'+group.id+'</em></span>：<span class="taskTxt">'+group.title+'</span>').attr('title', I18n.resource.workflow.common.NUMBER+group.id+":"+group.title);
                            taskItem.find('.date').text(group.completeTime ? new Date(group.completeTime).format('yyyy-MM-dd') : '').attr('title', 'resolved date');
                            taskItem.data('task', group);
                            template.find('.task-items').append(taskItem);
                        }
                        $('.completed-container').append(template);
                    }
                }).always(function () {
                    Spinner.stop();
                })
            })

        },
        refresh_starred: function () {//我的工单-星标
            var _this = this;
            Spinner.spin($(".workflow-container")[0]);
            return $.when(WorkflowTool.getWorkflowTemplate('#wf-mine-tasks'), WorkflowTool.getWorkflowTemplate('#wf-mine-tasks-complete')).done(function (tasks_template, completed_template) {
                return WebAPI.get('/workflow/transaction/starred/' + AppConfig.userId).done(function (result) {
                    if (!result) {
                        return false;
                    }
                    try {
                        var result_obj = JSON.parse(result);
                    } catch (e) {
                        console.error(e);
                        return;
                    }
                    $('.starreds-container').children().remove();
                    var groupedResult = _GroupArray('groupName', result_obj);
                    var inner_template = completed_template.clone();
                    var completedTaskItemTemplate = inner_template.find('.task-item'), uncompletedTaskItemTemplate = tasks_template.clone();
                    inner_template.find('.task-item').remove();
                    for (var groupNm in groupedResult) {
                        var template = inner_template.clone(), groups = groupedResult[groupNm];
                        template.find('.task-type').text(groupNm);
                        for (var n = 0, nlen = groups.length; n < nlen; n++) {
                            var group = groups[n];
                            if (group.statusId === 4) {
                                var taskItem = completedTaskItemTemplate.clone();
                                taskItem.find('.glyphicon-ok').attr("i18n", 'title=workflow.main.FINISHED');
                                taskItem.find('.task-title').html('<span class="taskNoWrapper"><em i18n="workflow.common.NUMBER"></em><em class="taskNo">'+group.id+'</em></span>：<span class="taskTxt">'+group.title+'</span>').attr('title', I18n.resource.workflow.common.NUMBER+group.id+":"+group.title);
                                taskItem.find('.date').text(group.completeTime ? new Date(group.completeTime).format('yyyy-MM-dd') : '').attr('title', 'resolved date');
                                taskItem.data('task', group);
                            } else {
                                var taskItem = uncompletedTaskItemTemplate.clone();
                                taskItem.find('.task-title').html('<span class="taskNoWrapper"><em i18n="workflow.common.NUMBER"></em><em class="taskNo">'+group.id+'</em></span>：<span class="taskTxt">'+group.title+'</span>').attr('title', I18n.resource.workflow.common.NUMBER+group.id+":"+group.title);
                                taskItem.find('.date').text(group.dueDate ? new Date(group.dueDate).format('yyyy-MM-dd') : '').attr('title', 'deadline');
                                if (group.statusId === 2) {
                                    taskItem.find('.play-pause').addClass('glyphicon-pause').attr("i18n", "title=workflow.main.PAUSE");
                                } else {
                                    taskItem.find('.play-pause').addClass('glyphicon-play').attr("i18n", "title=workflow.main.START");
                                }
                                taskItem.find('.timer').children("span").removeClass().addClass("glyphicon ic" + group.critical).attr("i18n", 'title=' + _this.i18urgencyLevelArr[group.critical]);
                                taskItem.find('.status').html(getStatusText(group.statusId));
                                taskItem.data('task', group);
                            }
                            template.find('.task-items').append(taskItem);
                        }
                        $('.starreds-container').append(template);
                    }
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                    Spinner.stop();
                })
            })
        },
        screeningItem: function($obj,str,num){ //我创建的筛选工单
            if ($obj.hasClass("selectAll")) {
                $(".task-item").show();
                return;
            }
            var text=$obj.text();
            if(!num){//(状态,创建日期,截止日期,工单名 )
                $.each($(".mine ."+str), function (index, item) {
                    var $item = $(item);
                    var itemStatus = $item.text();
                    if(text!==itemStatus){
                        $item.closest(".task-item").hide();
                    }else{
                        $item.closest(".task-item").show();
                    }
                });
            }else{//(紧急程度 )
                var urgencyClass = $obj.attr("urgencyClass");
                $(".task-item").hide();
                $(".task-item ."+urgencyClass).closest(".task-item").show();
            }
        },
        init: function () {
            if (!profilePromise) {
                profilePromise = $.get('/workflow/profile/' + AppConfig.userId);
            }
            profilePromise.done(function (result) {
                var jResult = JSON.parse(result);
                $('.mine-avatar-name').text(jResult.userfullname ? jResult.userfullname : jResult.username);
                $('.mine-avatar-desc').text(jResult.useremail ? jResult.useremail : '');
                $('.avatar-icon').attr("src", jResult.userpic);
            });
            $('.screen-row').hide();
            $('.tasks').show();

            this.refresh_tasks();

            var _this = this;
            $('#workflow-mine').on('click', '.glyphicon-ok-sign', function () {
                var taskitem = $(this).closest('.task-item'), task = taskitem.data('task');
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/complete/', {
                    trans_id: task.id,
                    user_id: AppConfig['userId']
                }).done(function (result) {
                    if (result === 'success') {
                        taskitem.remove();
                    }
                }).always(function () {
                    Spinner.stop();
                })
            }).on('click', '.glyphicon-pause', function () {
                var taskitem = $(this).closest('.task-item'), task = taskitem.data('task');
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/transaction/pause/', {
                    trans_id: task.id,
                    user_id: AppConfig['userId']
                }).done(function (result) {
                    if (result === 'success') {
                        taskitem.find('.status').html(getStatusText(3)).end()
                            .find('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play').attr("i18n", "title=workflow.main.START");
                        taskitem.attr("status-id","");
                    }
                    I18n.fillArea($(ElScreenContainer));
                }).always(function () {
                    Spinner.stop();
                })
            }).on('click', '.glyphicon-play', function () {
                var taskitem = $(this).closest('.task-item'), task = taskitem.data('task');
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/transaction/start/', {
                    trans_id: task.id,
                    user_id: AppConfig['userId']
                }).done(function (result) {
                    if (result === 'success') {
                        taskitem.find('.status').html(getStatusText(2)).end()
                            .find('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause').attr("i18n", "title=workflow.main.PAUSE");
                        taskitem.attr("status-id","2");
                    }
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                    Spinner.stop();
                })
            }).on('click', '.glyphicon-edit', function () {
                var ownId = AppConfig.userId;
                var task = $(this).parents(".task-item");
                var taskId = task.attr("task-id");
                var task_body = $(this).closest('.task-body');
                var groupid = task.data('task').groupId;
                if (task_body.hasClass('editing')) {
                    return false;
                }
                task_body.addClass('editing');
                var title_div = task_body.find('.task-title'), title = title_div.find(".taskTxt").text();
                var taskTxt = title_div.find(".taskTxt").text();
                title_div.data('title', title);
                title_div.find(".taskTxt").empty();
                title_div.find(".taskTxt").append('<textarea class="edit-textarea">' + taskTxt + '</textarea>');

                var memPromise = memberListPromise[groupid];
                if (!memPromise) {
                    memPromise = WebAPI.get('/workflow/getTransactionGroupMembers/' + groupid);
                    memberListPromise[groupid] = memPromise;
                }
                Spinner.spin(task[0]);
                memPromise.done(function (result) {
                    var btnObj = '<button type="button" class="pull-right btn btn-success edit-btn edit-btn-save" i18n="workflow.main.SAVE"></button><button type="button" class="pull-right btn btn-default edit-btn edit-btn-cancel" i18n="workflow.main.CANCEL"></button>';
                    title_div.append(btnObj);

                    var selectArr = JSON.parse(result);
                    var html = '<select class="pull-right" style="width:120px;height:30px;position:relative;top:6px;left:-2px;"><option disabled i18n="workflow.main.ASSIGN_AGAIN"></option>';
                    var selectArrL = selectArr.length;
                    for (var i = 0; i < selectArrL; i++) {
                        var selectObj = selectArr[i];
                        var selectId = selectObj.id;
                        var selectName = selectObj.name;
                        if (selectId != ownId) {
                            html += '<option value="' + selectId + '">' + selectName + '</option>';
                        } else {
                            html += '<option value="' + selectId + '" selected>' + selectName + '</option>';
                        }
                    }
                    html += "</select>";
                    title_div.append(html);
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                    Spinner.stop();
                })
            }).on('click', '#ckeck_completed', function () {
                $('.screen-row').hide();
                _this.refresh_completed().done(function () {
                    $('.completed').show();
                    $('.member-nav').find('li.active').removeClass('active');
                    I18n.fillArea($("span"));
                })
            }).on('click', '.btn-tasks', function () {
                $('.screen-row').hide();
                var $this = $(this);
                _this.refresh_tasks().done(function () {
                    $('.tasks').show();
                    $this.closest('.member-nav')
                        .find('li.active').removeClass('active')
                        .end()
                        .end()
                        .closest('li').addClass('active');
                    I18n.fillArea($("span"));
                });
            }).on('click', '.btn-starreds', function () {
                $('.screen-row').hide();
                var $this = $(this);
                _this.refresh_starred().done(function () {
                    $('.starreds').show();
                    $this.closest('.member-nav')
                        .find('li.active').removeClass('active')
                        .end()
                        .end()
                        .closest('li').addClass('active');
                    I18n.fillArea($("span"));
                });
            }).on('click', '.btn-cates', function () {
                $('.screen-row').hide();
                var $this = $(this);
                _this.refresh_categories().done(function () {
                    $('.categories').show();
                    $this.closest('.member-nav')
                        .find('li.active').removeClass('active')
                        .end()
                        .end()
                        .closest('li').addClass('active');
                    I18n.fillArea($("span"));
                });
            }).on('click', '.btn-mine', function () {
                $('.screen-row').hide();
                var $this = $(this);
                _this.refresh_mine().done(function () {
                    $('.mine').show();
                    $this.closest('.member-nav')
                        .find('li.active').removeClass('active')
                        .end()
                        .end()
                        .closest('li').addClass('active');
                    I18n.fillArea($("span"));
                });
            }).on('click', '.glyphicon-repeat', function () {
                var taskitem = $(this).closest('.task-item'), task = taskitem.data('task');
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/transaction/restart/', {
                    trans_id: task.id,
                    user_id: AppConfig['userId']
                }).done(function (result) {
                    if (result === 'success') {
                        taskitem.remove();
                    }
                }).always(function () {
                    Spinner.stop();
                })
            }).on('click', '.edit-btn-cancel', function (e) {
                var taskTitle_div = $(this).closest('.task-title'), title = taskTitle_div.data('title');
                taskTitle_div.find("button").remove();
                taskTitle_div.find(".pull-right").remove();
                taskTitle_div.find(".taskTxt").html(title);
                taskTitle_div.closest('.task-body').removeClass('editing');
                e.stopPropagation();
            }).on('click', '.edit-btn-save', function (e) {
                Spinner.spin($(".workflow-container")[0]);
                var taskIdObj = $(this).parents(".task-item");
                var taskTitle_div = $(this).closest('.task-title'),
                    title = $(this).siblings('.taskTxt').find('.edit-textarea').val(),
                    task_item = $(this).closest('.task-item'),
                    taskData = task_item.data('task'),
                    select = $(this).siblings('select'),
                    selectVal = select.val();
                var data = {
                    title: title,
                    transId: taskData.id,
                    userId: AppConfig['userId'],
                    executorID: selectVal
                };
                WebAPI.post('/workflow/transaction/edit', data).done(function (result) {
                    if (result === 'deassign') {
                        taskIdObj.remove();
                    } else if (result === 'success') {
                        taskTitle_div.find("button").remove();
                        taskTitle_div.find(".pull-right").remove();
                        taskTitle_div.find(".taskTxt").html(title);
                        task_item.find('.task-body').removeClass('editing');
                    }
                }).always(function () {
                    Spinner.stop();
                });
                e.stopPropagation();
            }).on('click', '.task-title', function () {
                if ($(this).closest('.task-body').hasClass('editing')) {
                    return false;
                }
                var id = $(this).closest('.task-item').data('task').id;
                new workflowNoticeDetail(id, I18n.resource.workflow.pageInfo.TITLE_WO_MY, $(ElScreenContainer).children().detach()).show();
            }).on('click', '#selectUrgency li', function () {
                _this.screeningItem($(this),$(this).attr("urgencyClass"),1);
            }).on('click', '#selectStatus li', function () {
                _this.screeningItem($(this),"status");
            }).on('click', '#selectCreateDate li', function () {
                _this.screeningItem($(this),"create-date");
            }).on('click', '#selectDueDate li', function () {
                _this.screeningItem($(this),"date");
            }).on('click', '#selectWorkflowName li', function () {
                _this.screeningItem($(this),"alert-type");
            });
            I18n.fillArea($(ElScreenContainer));
        }
    };

    return WorkflowMine;
})();
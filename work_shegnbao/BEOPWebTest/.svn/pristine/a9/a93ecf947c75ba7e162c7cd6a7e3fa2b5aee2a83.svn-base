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

                    var i18IcArr = [_this.i18.GENERAL, _this.i18.SERIOUS, _this.i18.URGENT];

                    for (var n = 0, nlen = result_json.length; n < nlen; n++) {
                        var item = result_json[n];
                        var temp = template.clone();
                        temp.attr('task-id', item.id);
                        temp.find('.task-title').text(item.title).attr('title', item.title);
                        temp.find('.date').text(item.dueDate ? new Date(item.dueDate).format('yyyy-MM-dd') : '').attr('title', 'deadline');
                        temp.find('.timer').children("span").removeClass().addClass("glyphicon ic" + item.critical).attr("title", i18IcArr[item.critical]);
                        temp.find('.alert-type').text(item.groupNm).attr('title', item.groupNm);
                        if (item.statusId === 2) {
                            temp.find('.play-pause').addClass('glyphicon-pause');
                        } else {
                            temp.find('.play-pause').addClass('glyphicon-play');
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
                    var i18IcArr = [_this.i18.GENERAL, _this.i18.SERIOUS, _this.i18.URGENT];
                    for (var groupNm in groupedResult) {
                        var template = inner_template.clone(), groups = groupedResult[groupNm];
                        template.find('.task-type').text(groupNm);
                        for (var n = 0, nlen = groups.length; n < nlen; n++) {
                            var group = groups[n];
                            if (group.statusId === 4) {
                                var taskItem = completedTaskItemTemplate.clone();
                                taskItem.find('.task-title').text(group.title).attr('title', group.title);
                                taskItem.find('.date').text(group.completeTime ? new Date(group.completeTime).format('yyyy-MM-dd') : '').attr('title', 'resolved date');
                                taskItem.data('task', group);
                            } else {
                                var taskItem = uncompletedTaskItemTemplate.clone();
                                taskItem.find('.task-title').text(group.title).attr('title', group.title);
                                taskItem.find('.date').text(group.dueDate ? new Date(group.dueDate).format('yyyy-MM-dd') : '').attr('title', 'deadline');
                                if (group.statusId === 2) {
                                    taskItem.find('.play-pause').addClass('glyphicon-pause');
                                } else {
                                    taskItem.find('.play-pause').addClass('glyphicon-play');
                                }
                                taskItem.find('.status').html(getStatusText(group.statusId));
                                taskItem.data('task', group);
                            }
                            taskItem.find('.timer').children("span").removeClass().addClass("glyphicon ic" + group.critical).attr("title", i18IcArr[group.critical]);
                            template.find('.task-items').append(taskItem);
                        }
                        $('.categories-container').append(template);
                    }
                }).always(function () {
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
                            taskItem.find('.task-title').text(group.title).attr('title', group.title);
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
                    var i18IcArr = [_this.i18.GENERAL, _this.i18.SERIOUS, _this.i18.URGENT];
                    for (var groupNm in groupedResult) {
                        var template = inner_template.clone(), groups = groupedResult[groupNm];
                        template.find('.task-type').text(groupNm);
                        for (var n = 0, nlen = groups.length; n < nlen; n++) {
                            var group = groups[n];
                            if (group.statusId === 4) {
                                var taskItem = completedTaskItemTemplate.clone();
                                taskItem.find('.task-title').text(group.title).attr('title', group.title);
                                taskItem.find('.date').text(group.completeTime ? new Date(group.completeTime).format('yyyy-MM-dd') : '').attr('title', 'resolved date');
                                taskItem.data('task', group);
                            } else {
                                var taskItem = uncompletedTaskItemTemplate.clone();
                                taskItem.find('.task-title').text(group.title).attr('title', group.title);
                                taskItem.find('.date').text(group.dueDate ? new Date(group.dueDate).format('yyyy-MM-dd') : '').attr('title', 'deadline');
                                if (group.statusId === 2) {
                                    taskItem.find('.play-pause').addClass('glyphicon-pause');
                                } else {
                                    taskItem.find('.play-pause').addClass('glyphicon-play');
                                }
                                taskItem.find('.status').html(getStatusText(group.statusId));
                                taskItem.data('task', group);
                            }
                            template.find('.timer').children("span").removeClass().addClass("glyphicon ic" + group.critical).attr("title",i18IcArr[group.critical]);
                            template.find('.task-items').append(taskItem);
                        }
                        $('.starreds-container').append(template);
                    }
                }).always(function () {
                    Spinner.stop();
                })
            })
        },
        init: function () {
            if (!profilePromise) {
                profilePromise = $.get('/workflow/profile/' + AppConfig.userId);
            }
            profilePromise.done(function (result) {
                var jResult = JSON.parse(result);
                $('.mine-avatar-name').text(jResult.userfullname ? jResult.userfullname : jResult.username);
                $('.mine-avatar-desc').text(jResult.useremail ? jResult.useremail : '');
            });
            $('.screen-row').hide();
            $('.tasks').show();

            this.refresh_tasks();

            var _this = this;
            $('#workflow-mine').on('click', '.glyphicon-ok-sign', function () {
                var taskitem = $(this).closest('.task-item'), task = taskitem.data('task');
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/complete/', {id: task.id, userId: AppConfig['userId']}).done(function (result) {
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
                    id: task.id,
                    userId: AppConfig['userId']
                }).done(function (result) {
                    if (result === 'success') {
                        taskitem.find('.status').html(getStatusText(3)).end()
                            .find('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play');
                    }
                }).always(function () {
                    Spinner.stop();
                })
            }).on('click', '.glyphicon-play', function () {
                var taskitem = $(this).closest('.task-item'), task = taskitem.data('task');
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/transaction/start/', {
                    id: task.id,
                    userId: AppConfig['userId']
                }).done(function (result) {
                    if (result === 'success') {
                        taskitem.find('.status').html(getStatusText(2)).end()
                            .find('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause');
                    }
                }).always(function () {
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
                var title_div = task_body.find('.task-title'), title = title_div.text();
                title_div.data('title', title);
                title_div.empty();
                title_div.append('<textarea class="edit-textarea">' + title + '</textarea>');

                var memPromise = memberListPromise[groupid];
                if (!memPromise) {
                    memPromise = WebAPI.get('/workflow/getTransactionGroupMembers/' + groupid);
                    memberListPromise[groupid] = memPromise;
                }
                Spinner.spin(task[0]);
                memPromise.done(function (result) {
                    var btnObj = '<button type="button" class="pull-right btn btn-success edit-btn edit-btn-save">保存</button><button type="button" class="pull-right btn btn-default edit-btn edit-btn-cancel">取消</button>';
                    title_div.append(btnObj);

                    var selectArr = JSON.parse(result);
                    var html = '<select class="pull-right" style="width:120px;height:30px;position:relative;top:6px;left:-2px;"><option disabled>重新分配</option>';
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
                })

            }).on('click', '.glyphicon-repeat', function () {
                var taskitem = $(this).closest('.task-item'), task = taskitem.data('task');
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/transaction/restart/', {
                    id: task.id,
                    userId: AppConfig['userId']
                }).done(function (result) {
                    if (result === 'success') {
                        taskitem.remove();
                    }
                }).always(function () {
                    Spinner.stop();
                })
            }).on('click', '.edit-btn-cancel', function (e) {
                var taskTitle_div = $(this).closest('.task-title'), title = taskTitle_div.data('title');
                taskTitle_div.children().remove().end().text(title);
                taskTitle_div.closest('.task-body').removeClass('editing');
                e.stopPropagation();
            }).on('click', '.edit-btn-save', function (e) {
                Spinner.spin($(".workflow-container")[0]);
                var taskIdObj = $(this).parents(".task-item");
                var taskTitle_div = $(this).closest('.task-title'),
                    title = $(this).siblings('.edit-textarea').val(),
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
                        taskTitle_div.children().remove().end().text(title);
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
            });
        }
    }

    return WorkflowMine;
})();
/// <reference path="../lib/jquery-1.11.1.js" />
var WorkflowMine = (function () {
    var that,
        profilePromise,
        memberListPromise = {};

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
        this.record = null;
        this.perNum = 15; //每页显示的数量
        that = this;
    }

    WorkflowMine.prototype = {
        show: function () {
            WebAPI.get("/static/views/workflow/mine.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                that.init();
                I18n.fillArea($("#workflow-mine"));
            });
        },
        close: function () {
        },
        check_empty_tasks: function () {
            var new_tasks = $('.new-task-row .task-items');
            if (new_tasks.find('.task-item').length === 0) {
                new_tasks.find('.empty-message').show();
                $("#workflow-title").hide();
            } else {
                new_tasks.find('.empty-message').hide();
            }
        },
        changeStatus: function (obj, callback) {//切换工单状态
            Spinner.spin($(".workflow-container")[0]);
            WebAPI.post(obj.url, {
                'trans_id': obj.id,
                'user_id': AppConfig.userId
            }).done(function (result) {
                if (result === 'success') {
                    if (callback) {
                        callback();
                    }
                }
            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            });
        },
        changeWorkFlowTab: function (workflowType, $this, $activeTab) {//切换工单tab类型
            $('.screen-row').hide();
            workflowType.done(function () {
                $activeTab.show();
                $this.closest('.member-nav').find('li.active').removeClass('active').end().end().closest('li').addClass('active');
                I18n.fillArea($("span"));
            });
        },
        jsonCheckObj: function (result) {//对后台传过来的json字符串进行检测,正确则返回解析后的对象
            if (!result) {
                return false;
            }
            try {
                var result_json = JSON.parse(result);
                return result_json;
            } catch (e) {
                return false;
            }
        },
        saveJsonToDom: function ($dom, result_json) {//将json对象保存到dom对象上
            $.each($dom, function (index, item) {
                var $item = $(item);
                var taskId = $item.attr("task-id");
                for (var i = 0; i < result_json.length; i++) {
                    if (result_json[i].id == taskId) {
                        $item.data('task', result_json[i]);
                        break;
                    }
                }
            });
        },
        paginationItems: function (currentNum) {//分页显示记录
            var $items = that.record;
            //var $items = $com.find( ".task-item:visible");
            var startPage = that.perNum * (currentNum - 1);
            var endPage = that.perNum * currentNum;
            for (var i = 0; i < $items.length; i++) {
                var $item = $items.eq(i);
                if (i < startPage || i >= endPage) {
                    $item.hide();
                } else {
                    $item.show();
                }
            }
        },
        paginationRefresh: function (totalNum, $paginationWrapper, paginationId) {//分页插件显示
            var totalPages = (totalNum % that.perNum == 0) ? totalNum / that.perNum : totalNum / that.perNum + 1;
            $paginationWrapper.html('<ul id="' + paginationId + '" class="pagination fr"></ul>');
            $("#" + paginationId).twbsPagination({
                first: '&laquo;&laquo',
                prev: '&laquo;',
                next: '&raquo;',
                last: '&raquo;&raquo;',
                //visiblePages: 5,
                startPage: 1,
                totalPages: !totalPages ? 1 : totalPages,
                onPageClick: function (event, page) {
                    that.paginationItems(page);
                }
            });
        },
        reConditionItems: function () {
            var $content = $(".wf-records:visible").find(".wf-content");
            var $paginationWrapper = $(".wf-records:visible").find(".paginationWrapper");
            var paginationId = $(".wf-records:visible").find(".pagination").attr("id");
            that.record = $content.find(".task-item:visible");
            that.paginationItems(1);
            $paginationWrapper.html('<ul id="' + paginationId + '" class="pagination fr"></ul>');
            var totalNum = that.record.length;
            var totalPages = (totalNum % that.perNum == 0) ? totalNum / that.perNum : totalNum / that.perNum + 1;
            $("#" + paginationId).twbsPagination({
                first: '&laquo;&laquo;',
                prev: '&laquo;',
                next: '&raquo;',
                last: '&raquo;&raquo;',
                //visiblePages: 5,
                startPage: 1,
                totalPages: !totalPages ? 1 : totalPages,
                onPageClick: function (event, page) {
                    that.paginationItems(page);
                }
            });
        },
        refresh_tasks: function () {
            Spinner.spin($(".workflow-container")[0]);
            return WebAPI.get('/workflow/transaction/notCompleted/' + AppConfig.userId).done(function (result) {
                var result_json = that.jsonCheckObj(result);
                if (!result_json) {
                    return false;
                }
                $("#wf-task-content").html(beopTmpl('wfTaskTmpl', result_json));
                var dueDateArr = [],
                    creatorArr = [],
                    workflowNamArr = [];
                that.check_empty_tasks();
                for (var n = 0, nlen = result_json.length; n < nlen; n++) {
                    var item = result_json[n];
                    $("#wf-task-content").find(".task-item").eq(n).data('task', item);
                    dueDateArr.push(item.dueDate ? item.dueDate.replace('GMT', '').toDate().format('yyyy-MM-dd') : '');
                    creatorArr.push(item.creator ? item.creator : '');
                    workflowNamArr.push(item.groupNm);
                }
                var arrObj = {
                    'dueDateArr': dueDateArr,
                    'workflowNamArr': workflowNamArr,
                    'creatorArr': creatorArr
                };
                that.generateSelection($(".tasks"), arrObj);
                that.record = $("#wf-task-content .task-item");
                that.paginationRefresh(that.record.length, $("#newPaginationWrapper"), 'new-pagination');
                that.paginationItems(1);
            }).done(function () {

            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            });
        },
        refresh_starred: function () {//我的工单-星标
            Spinner.spin($(".workflow-container")[0]);
            return WebAPI.get('/workflow/transaction/starred/' + AppConfig.userId).done(function (result) {
                var result_json = that.jsonCheckObj(result);
                if (!result_json) {
                    return false;
                }
                var groupedResult = _GroupArray('groupName', result_json);
                $("#wf-starreds-content").html(beopTmpl('wfCommonTmpl', groupedResult));
                var $taskItem = $("#wf-starreds-content .task-item");
                that.saveJsonToDom($taskItem, result_json);
            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            })
        },
        refresh_categories: function () {//我的工单-分类
            Spinner.spin($(".workflow-container")[0]);
            return WebAPI.get('/workflow/transaction/getAll/' + AppConfig.userId).done(function (result) {
                var result_json = that.jsonCheckObj(result);
                if (!result_json) {
                    return false;
                }
                var groupedResult = _GroupArray('groupName', result_json);
                $("#wf-categories-content").html(beopTmpl('wfCommonTmpl', groupedResult));
                var $taskItem = $("#wf-categories-content .task-item");
                that.saveJsonToDom($taskItem, result_json);
            }).always(function () {
                Spinner.stop();
                I18n.fillArea($(ElScreenContainer));
            });
        },
        refresh_mine: function () {//我的工单-我创建的
            Spinner.spin($(".workflow-container")[0]);
            return WebAPI.post('/workflow/myCreated/', {
                userId: AppConfig.userId
            }).done(function (result) {
                if (result.success) {
                    var createDateArr = [],
                        dueDateArr = [],
                        workflowNamArr = [],
                        executorArr = [];
                    if (result.data.length == 0) {
                        $("#workflow-title-mine").hide();
                    } else {
                        $("#workflow-title-mine").show();
                        $("#wf-mine-content").html(beopTmpl('wfMineTmpl', result.data));
                        for (var n = 0, nlen = result.data.length; n < nlen; n++) {
                            var item = result.data[n];
                            $("#wf-mine-content").find(".task-item").eq(n).data('task', item);
                            createDateArr.push(item.createTime ? item.createTime.replace('GMT', '').toDate().format('yyyy-MM-dd') : '');
                            dueDateArr.push(item.dueDate ? item.dueDate.replace('GMT', '').toDate().format('yyyy-MM-dd') : '');
                            workflowNamArr.push(item.groupName);
                            executorArr.push(item.executorName);
                        }
                        var arrObj = {
                            'dueDateArr': dueDateArr,
                            'workflowNamArr': workflowNamArr,
                            'createDateArr': createDateArr,
                            'executorArr': executorArr
                        };
                        that.generateSelection($(".mine"), arrObj);

                        that.record = $("#wf-mine-content .task-item");
                        that.paginationRefresh(that.record.length, $("#minePaginationWrapper"), 'mine-pagination');
                        that.paginationItems(1);
                    }
                }
            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            })
        },
        refresh_completed: function () {//查看已完成
            Spinner.spin($(".workflow-container")[0]);
            return WebAPI.get('/workflow/transaction/completed/' + AppConfig.userId).done(function (result) {
                var result_json = that.jsonCheckObj(result);
                if (!result_json) {
                    return false;
                }
                var groupedResult = _GroupArray('groupName', result_json);
                $("#wf-completed-content").html(beopTmpl('wfCommonTmpl', groupedResult));
                var $taskItem = $("#wf-completed-content .task-item");
                that.saveJsonToDom($taskItem, result_json);
            }).always(function () {
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            })
        },
        generateSelection: function ($content, arrObj) {//生成筛选条件
            var dueDateArr = arrObj.dueDateArr;
            var workflowNamArr = arrObj.workflowNamArr;
            dueDateArr.sort().reverse();
            workflowNamArr.sort();
            $.unique(arrObj.dueDateArr);
            $.unique(arrObj.workflowNamArr);
            $content.find(".selectDueDate").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
            $content.find(".selectWorkflowName").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
            for (var i = 0; i < dueDateArr.length; i++) {
                $content.find(".selectDueDate").append('<li>' + dueDateArr[i] + '</li>');
            }
            for (var i = 0; i < workflowNamArr.length; i++) {
                $content.find(".selectWorkflowName").append('<li title="' + workflowNamArr[i] + '">' + workflowNamArr[i] + '</li>');
            }
            if (arrObj.createDateArr) {
                var createDateArr = arrObj.createDateArr;
                createDateArr.sort().reverse();
                $.unique(createDateArr);
                $content.find(".selectCreateDate").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
                for (var i = 0; i < createDateArr.length; i++) {
                    $content.find(".selectCreateDate").append('<li>' + createDateArr[i] + '</li>');
                }
            }
            if (arrObj.executorArr) {
                var executorArr = arrObj.executorArr;
                executorArr.sort();
                var resultExecutorArr = WorkflowTool.delArrInvalidValue(executorArr);
                $.unique(resultExecutorArr);
                $content.find(".selectExecutor").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
                for (var i = 0; i < resultExecutorArr.length; i++) {
                    $content.find(".selectExecutor").append('<li>' + resultExecutorArr[i] + '</li>');
                }
            }
            if (arrObj.creatorArr) {
                var creatorArr = arrObj.creatorArr;
                creatorArr.sort();
                var resultArr = WorkflowTool.delArrInvalidValue(creatorArr);
                $.unique(resultArr);
                $content.find(".selectCreator").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
                for (var i = 0; i < resultArr.length; i++) {
                    $content.find(".selectCreator").append('<li>' + resultArr[i] + '</li>');
                }
            }
        },
        init: function () {
            if (!profilePromise) {
                profilePromise = WebAPI.get('/workflow/profile/' + AppConfig.userId);
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
            $('#workflow-mine').on('click', '.glyphicon-ok-sign', function () {
                var taskitem = $(this).closest('.task-item');
                var obj = {
                    url: '/workflow/complete/',
                    id: taskitem.data('task').id
                };
                that.changeStatus(obj, function () {
                    taskitem.remove();
                    BackgroundWorkers.schedulerReporter ? BackgroundWorkers.schedulerReporter.postMessage({
                        type: 'fetchWorkflowData',
                        userId: AppConfig.userId
                    }) : $.noop();
                });
            }).on('click', '.glyphicon-pause', function () {
                var taskitem = $(this).closest('.task-item');
                var obj = {
                    url: '/workflow/transaction/pause/',
                    id: taskitem.data('task').id
                };
                that.changeStatus(obj, function () {
                    taskitem.find('.status').html(I18n.resource.workflow.mine.TASK_STATUS_PAUSED).attr("i18n", "workflow.common.PAUSED").end()
                        .find('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play').attr("i18n", "title=workflow.main.START");
                    taskitem.attr("status-id", "");
                });
            }).on('click', '.glyphicon-play', function () {
                var taskitem = $(this).closest('.task-item');
                var obj = {
                    url: '/workflow/transaction/start/',
                    id: taskitem.data('task').id
                };
                that.changeStatus(obj, function () {
                    taskitem.find('.status').html(I18n.resource.workflow.mine.TASK_STATUS_PROCESSING).attr("i18n", "workflow.common.DEALING").end()
                        .find('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause').attr("i18n", "title=workflow.main.PAUSE");
                    taskitem.attr("status-id", "2");
                });
            }).on('click', '.glyphicon-edit', function () {
                var task = $(this).parents(".task-item");
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
                    title_div.append(beopTmpl('wfEditTmpl', JSON.parse(result)));
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                    Spinner.stop();
                })
            }).on('click', '#check_completed', function () {
                $('.screen-row').hide();
                that.refresh_completed().done(function () {
                    $('.completed').show();
                    $('.member-nav').find('li.active').removeClass('active');
                    I18n.fillArea($("span"));
                })
            }).on('click', '.glyphicon-repeat', function () {
                var taskitem = $(this).closest('.task-item');
                var obj = {
                    url: '/workflow/transaction/restart/',
                    id: taskitem.data('task').id
                };
                that.changeStatus(obj, function () {
                    taskitem.remove();
                });
            }).on('click', '.glyphicon-notVerified', function () {
                var taskitem = $(this).closest('.task-item');
                var obj = {
                    url: '/workflow/transaction/verified/',
                    id: taskitem.data('task').id
                };
                that.changeStatus(obj, function () {
                    taskitem.find(".operator").html(beopTmpl('verifiedTmpl'));
                });
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
                    title = $(this).parent(".editContent").siblings('.taskTxt').find('.edit-textarea').val(),
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
                    if (result.result === 'deassign') {
                        taskIdObj.remove();
                    } else if (result.result === 'success') {
                        taskTitle_div.find(".taskTxt").html(title);
                        task_item.find('.task-body').removeClass('editing');
                        taskTitle_div.find(".editContent").remove();
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
            }).on('click', '.selectUrgency li', function () {
                WorkflowTool.screeningItem($(this), $(this).attr("urgencyClass"), 1);
                that.reConditionItems();
            }).on('click', '.selectStatus li', function () {
                WorkflowTool.screeningItem($(this), "status");
                that.reConditionItems();
            }).on('click', '.selectCreateDate li', function () {
                WorkflowTool.screeningItem($(this), "create-date");
                that.reConditionItems();
            }).on('click', '.selectDueDate li', function () {
                WorkflowTool.screeningItem($(this), "date");
                that.reConditionItems();
            }).on('click', '.selectWorkflowName li', function () {
                WorkflowTool.screeningItem($(this), "alert-type");
                that.reConditionItems();
            }).on('click', '.selectExecutor li', function () {
                WorkflowTool.screeningItem($(this), "executor-person");
                that.reConditionItems();
            }).on('click', '.selectCreator li', function () {
                WorkflowTool.screeningItem($(this), "creator");
                that.reConditionItems();
            }).on('click', '.btn-tasks', function () {
                that.changeWorkFlowTab(that.refresh_tasks(), $(this), $('.tasks'));
            }).on('click', '.btn-starreds', function () {
                that.changeWorkFlowTab(that.refresh_starred(), $(this), $('.starreds'));
            }).on('click', '.btn-cates', function () {
                that.changeWorkFlowTab(that.refresh_categories(), $(this), $('.categories'));
            }).on('click', '.btn-mine', function () {
                that.changeWorkFlowTab(that.refresh_mine(), $(this), $('.mine'));
            });
            I18n.fillArea($(ElScreenContainer));
        }
    };

    return WorkflowMine;
})();
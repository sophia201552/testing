/// <reference path="../lib/jquery-1.11.1.js" />

var workflowTransaction = (function () {
    var that;
    function workflowTransaction(group) {
        this.group = group;
        this.i18urgencyLevelArr = ["workflow.urgencyLevel.0","workflow.urgencyLevel.1","workflow.urgencyLevel.2"];
        this.record = null;
        this.perNum = 15; //每页显示的数量
        that = this;
    };

    workflowTransaction.prototype = {
        show: function () {
            WebAPI.get("/static/views/workflow/transaction.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                that.init();

                $('#tipFaultTitle').attr('placeholder', I18n.resource.workflow.main.FAULT_TITLE);
                $('#tipFaultInfo').attr('placeholder', I18n.resource.workflow.main.FAULT_INFO);
                $('#iconSum').attr('title', I18n.resource.workflow.main.SUM);
                $('#iconFinish').attr('title', I18n.resource.workflow.main.FINISHED);
                $('#iconDelay').attr('title', I18n.resource.workflow.main.DELAY);
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
            that.record = $("#wf-transactions-content").find(".task-item:visible");
            that.paginationItems(1);
            $("#transPaginationWrapper").html('<ul id="trans-pagination" class="pagination fr"></ul>');
            var totalNum = that.record.length;
            var totalPages = (totalNum % that.perNum == 0) ? totalNum / that.perNum : totalNum / that.perNum + 1;
            $("#trans-pagination").twbsPagination({
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
        refreshPage: function () {
            Spinner.spin($(".workflow-container")[0]);
            WebAPI.get('/workflow/group/' + AppConfig['userId'] + '/' + this.group.id).done(function (result) {
                try {
                    var result_obj = JSON.parse(result);
                } catch (e) {
                    return false;
                }

                var $workflow_transaction = $('#workflow-transaction')
                    .find('.mine-avatar-name').text(result_obj.name).end()
                    .find('.mine-avatar-desc').text(result_obj.description).end()
                    .find('.totalCount').text(result_obj.totalCount).end()
                    .find('.delayedCount').text(result_obj.delayedCount).end()
                    .find('.finishedCount').text(result_obj.finishedCount).end();
                if (result_obj.pic) {
                    var image = WorkflowTool.pic_path + result_obj.pic;
                    $workflow_transaction.find('.top-section .media-left').empty()
                        .append('<img class="wf-project-icon" src="' + image + '">');
                } else {
                    $workflow_transaction.find('.top-section .media-left').empty()
                        .append('<div class="avatar-icon" style="background: url(/static/images/login_feature_icons.jpg) no-repeat -50px 0;"></div>');
                }

                var trans = result_obj.transactions;
                var i18=I18n.resource.workflow.urgencyLevel;
                var dueDateArr = [],
                    creatorArr = [],
                    executorArr = [];
                $("#wf-transactions-content").html(beopTmpl('wfTransactionTask', trans));
                var $taskItem = $("#wf-transactions-content").find(".task-item");
                for (var n = 0, nlen = trans.length; n < nlen; n++) {
                        var item = trans[n];
                        $taskItem.eq(n).data('task', item);
                        dueDateArr.push(item.dueDate ? item.dueDate.toDate().format('yyyy-MM-dd') : '');
                        creatorArr.push(item.creator ? item.creator : '');
                        executorArr.push(item.executor ? item.executor : '');
                }
                that.generateSelection($workflow_transaction,dueDateArr,creatorArr,executorArr);

                that.record = $("#wf-transactions-content .task-item");
                that.paginationRefresh(that.record.length, $("#transPaginationWrapper"), 'trans-pagination');
                that.paginationItems(1);

                if (result_obj.isAdmin) {
                    if ($('.project-operator').size() === 0) {
                        WorkflowTool.getWorkflowTemplate('#wf-transaction-group-operator').done(function (group_operator_template) {
                            $('.nav-content').append(group_operator_template);
                        });
                    }
                }

            }).done(function () {
                I18n.fillArea($(ElScreenContainer));
            }).always(function () {
                Spinner.stop();
            })
        },

        close: function () {
        },
        generateSelection: function ($content, dueDateArr, creatorArr, executorArr) {//生成筛选条件
            var resultCreatorArr = WorkflowTool.delArrInvalidValue(creatorArr);
            var resultExecutorArr = WorkflowTool.delArrInvalidValue(executorArr);
            dueDateArr.sort().reverse();
            resultCreatorArr.sort();
            resultExecutorArr.sort();
            $.unique(dueDateArr);
            $.unique(resultCreatorArr);
            $.unique(resultExecutorArr);
            $content.find(".selectDueDate").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
            $content.find(".selectExecutor").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
            $content.find(".selectCreator").html('<li class="selectAll" i18n="workflow.mine.ALL_ORDER"></li>');
            for (var i = 0; i < dueDateArr.length; i++) {
                $content.find(".selectDueDate").append('<li>' + dueDateArr[i] + '</li>');
            }
            for (var i = 0; i < resultCreatorArr.length; i++) {
                $content.find(".selectCreator").append('<li>' + resultCreatorArr[i] + '</li>');
            }
            for (var i = 0; i < resultExecutorArr.length; i++) {
                $content.find(".selectExecutor").append('<li>' + resultExecutorArr[i] + '</li>');
            }
        },
        init: function () {
            this.refreshPage();
            var projectMembersPromise = WebAPI.get('/workflow/projectmember/' + this.group.id);
            $('#workflow-transaction').on('click', '.add-btn', function () {
                var $this = $(this);
                projectMembersPromise.done(function (result) {
                    try {
                        var result_obj = JSON.parse(result);
                        if (!result_obj || result_obj.length === 0) {
                            $('.success-alert').empty();
                            var alert = new Alert('.success-alert', 'danger', I18n.resource.workflow.main.TIP1).show();
                            setTimeout(function () {
                                alert.close();
                            }, 2000);
                            return false;
                        }
                    } catch (e) {
                        return false;
                    }
                    $this.hide().closest('.add-row').find('.add-section').show();
                });
            }).on('click', '.edit-btn-cancel', function () {
                var add_row = $(this).closest('.add-row');
                add_row.find('.trans-edit-textarea').val('').end()
                    .find('.add-section').hide().end()
                    .find('.add-btn').show();
            }).on('show.bs.dropdown', '#project-user', function () {
                var _this = this;
                projectMembersPromise.done(function (result) {
                    try {
                        var result_obj = JSON.parse(result);
                    } catch (e) {
                        return false;
                    }

                    var menu = $(_this).find('.dropdown-menu').empty();
                    if (result_obj.length === 0) {
                        menu.append($('<li class="empty-member">' + I18n.resource.workflow.main.TIP2 + '</li>'));
                        return false;
                    }

                    for (var n = 0, nlen = result_obj.length; n < nlen; n++) {
                        var member = result_obj[n];
                        menu.append($('<li class="member-item">' + member.username + '</li>').data('member', member));
                    }
                })
            }).on('click', '#project-critical ul li', function () {
                var $o=$(this);
                var text=$o.text();
                var val=$o.attr("objval");
                var $obj=$("#project-critical").find(".selected-critical span");
                $obj.text(text);
                $("#project-critical").attr("objval",val);
            }).on('click', '.member-item', function () {
                var $this = $(this), member = $this.data('member');
                $this.closest('.project-members').find('.selected-member').text(member.username).data('member', member);
            }).on('click', '.complete-time', function () {
                var $this = $(this);
                $this.find(".time-picker").datetimepicker({
                    minView: "month",
                    autoclose: true,
                    todayBtn: true,
                    format: 'yyyy-mm-dd',
                    startDate: new Date
                });
            }).on('changeDate', '.time-picker', function (e) {
                var $this = $(this);
                var date = $this.data('date')
                $this.closest('.complete-time').find('.selected-date').text(date).data('date', date);
                $this.dropdown('toggle');
            }).on('click', '.add-section .edit-btn-save', function () {
                var $this = $(this), add_section = $this.closest('.add-section');
                var title = add_section.find('.trans-edit-textarea.trans-title').val();
                if (!title) {
                    $('.alert').empty();
                    var alert = new Alert('.alert', 'danger', I18n.resource.workflow.main.NAME_NOT_NULL).show();
                    setTimeout(function () {
                        alert.close();
                    }, 2000);
                    return false;
                }
                var detail = add_section.find('.trans-edit-textarea.trans-detail').val();

                var complete_time = add_section.find('.selected-date').data('date'),
                    selected_member = add_section.find('.selected-member').data('member');
                if (!complete_time) {
                    $('.alert').empty();
                    var alert = new Alert('.alert', 'danger', I18n.resource.workflow.main.FINISH_TIME_NOT_NULL).show();
                    setTimeout(function () {
                        alert.close();
                    }, 2000);
                    return false;
                }
                if (!selected_member || selected_member.userId === undefined) {
                    $('.alert').empty();
                    var alert = new Alert('.alert', 'danger', I18n.resource.workflow.main.PEOPLE_NOT_NULL).show();
                    setTimeout(function () {
                        alert.close();
                    }, 2000);
                    return false;
                }

                var critical=$("#project-critical").attr("objval");
                if(critical==""){
                    $('.alert').empty();
                    var alert = new Alert('.alert', 'danger', I18n.resource.workflow.urgencyLevel.URGENCY_LEVEL_REQUIRED).show();
                    setTimeout(function () {
                        alert.close();
                    }, 2000);
                    return false;
                }

                var data = {
                    userId: AppConfig['userId'],
                    dueDate: complete_time,
                    title: title,
                    detail: detail,
                    groupId: that.group.id,
                    executorId: selected_member.userId,
                    critical: critical
                };
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/transaction/add/', data).done(function (result) {
                    $this.closest('.add-row')
                        .find('.selected-date').text(I18n.resource.workflow.main.FINISH_TIME).data('date', '').end()
                        .find('.selected-member').text(I18n.resource.workflow.main.PEOPLE).data('member', '').end()
                        .find('.trans-edit-textarea').val('').end()
                        .find('.add-section').hide().end()
                        .find('.add-btn').show();
                    $('.alert').empty();
                    var alert = new Alert('.success-alert', 'success', I18n.resource.workflow.main.ADD_SUCCESS).show();
                    setTimeout(function () {
                        alert.close();
                    }, 1000);
                    that.refreshPage();
                    $("#project-critical").attr("objval","");
                    $("#project-critical .selected-critical>span").text(I18n.resource.workflow.urgencyLevel.URGENCY_LEVEL);
                }).always(function () {
                    Spinner.stop();
                })
            }).on('click', '#backToMain', function () {
                ScreenCurrent.close();
                ScreenCurrent = new WorkflowMain();
                ScreenCurrent.show();
            }).on('click', '.task-title', function () {
                var id = $(this).closest('.task-item').data('task').id;
                new workflowNoticeDetail(id, I18n.resource.workflow.main.CREATE_TASK, $(ElScreenContainer).children().detach()).show();
            }).on('click', '#del-project', function () {
                $(this).hide();
                $('#workflow-transaction .delete-dialog').show();
            }).on('click', '#del-project-cancel', function () {
                $(this).closest('.delete-dialog').hide();
                $('#del-project').show();
            }).on('click', '#del-project-OK', function () {
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/group/delete/', {id: that.group.id}).done(function () {
                    ScreenCurrent.close();
                    ScreenCurrent = new WorkflowMain();
                    ScreenCurrent.show();
                }).always(function () {
                    Spinner.stop();
                })
            }).on('click', '#edit-project', function () {
                var top_section = $('.top-section');
                if (top_section.find('.media').hasClass('editing')) {
                    return false;
                } else {
                    top_section.find('.media').addClass('editing');
                }
                var old_media_body = top_section.find('.media-body').detach();
                var new_media_body = $('<div class="media-body"></div>');
                new_media_body.append('<h3 class="media-heading"><textarea class="gd-edit-textarea title" maxlength="255">' + that.group.name + '</textarea></h3>')
                    .append('<textarea class="gd-edit-textarea desc" maxlength="255">' + that.group.description + '</textarea>')
                    .append('<button type="button" class="pull-right btn btn-success edit-btn edit-btn-save">' + I18n.resource.workflow.main.SAVE + '</button>')
                    .append('<button type="button" class="pull-right btn btn-default edit-btn edit-btn-cancel">' + I18n.resource.workflow.main.CANCEL + '</button>');
                top_section.find('.media').append(new_media_body);
                new_media_body.find('.edit-btn-cancel').click(function () {
                    top_section.find('.media').find('.media-body').remove().end()
                        .append(old_media_body).removeClass('editing');
                });
                new_media_body.find('.edit-btn-save').click(function () {
                    var media = $(this).closest('.media');
                    var new_name = media.find('.title').val().trim(), new_desc = media.find('.desc').val().trim();
                    if (!new_name) {
                        var error_dialog = $('.error-dialog').find('h4').text(I18n.resource.workflow.main.NAME_NOT_NULL).end().show();
                        setTimeout(function () {
                            error_dialog.find('h4').text('').end().hide();
                        }, 2000)
                        return false;
                    }
                    if (new_name === that.group.name && new_desc === that.group.description) {
                        media.find('.media-body').remove().end().append(old_media_body).removeClass('editing');
                        return false;
                    }

                    Spinner.spin($(".workflow-container")[0]);
                    WebAPI.post('/workflow/group/edit/', {
                        id: that.group.id,
                        name: new_name,
                        desc: new_desc
                    }).done(function () {
                        that.group.name = new_name;
                        that.group.description = new_desc;
                        old_media_body.find('.media-heading').text(new_name).end()
                            .find('.mine-avatar-desc').text(new_desc);
                        media.find('.media-body').remove().end().append(old_media_body);
                        media.removeClass('editing');
                    }).always(function () {
                        Spinner.stop();
                    })
                })
            }).on('click', '.selectUrgency li', function () {
                WorkflowTool.screeningItem($(this),$(this).attr("urgencyClass"),1);
                that.reConditionItems();
            }).on('click', '.selectStatus li', function () {
                WorkflowTool.screeningItem($(this),"status");
                that.reConditionItems();
            }).on('click', '.selectDueDate li', function () {
                WorkflowTool.screeningItem($(this),"date");
                that.reConditionItems();
            }).on('click', '.selectExecutor li', function () {
                WorkflowTool.screeningItem($(this),"member");
                that.reConditionItems();
            }).on('click', '.selectCreator li', function () {
                WorkflowTool.screeningItem($(this),"creator");
                that.reConditionItems();
            });
        }
    };

    return workflowTransaction;
})();
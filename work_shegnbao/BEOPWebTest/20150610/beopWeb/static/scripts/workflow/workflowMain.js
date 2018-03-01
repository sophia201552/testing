/// <reference path="../lib/jquery-1.11.1.js" />


var WorkflowTool = (function () {
    var pic_path = '/static/images/workflow/', templateStorage;

    function getStatusText(status) {
        switch (status) {
            case 0 || 'new':
                return I18n.resource.workflow.main.NEW;
            case 1 || 'assigned':
                return I18n.resource.workflow.main.ASSIGNED;
            case 2 || 'start':
                return I18n.resource.workflow.main.DEALING;
            case 3 || 'pause':
                return I18n.resource.workflow.main.PAUSED;
            case 4 || 'completed':
                return I18n.resource.workflow.main.FINISHED;
            case 5 || 'deleted':
                return I18n.resource.workflow.main.DELETED;
        }
    }

    function translate(text) {
        if (!text) {
            return '';
        }
        if (text.indexOf('was renamed') > 0) {
            var textList = text.split('was renamed'),
                html = '';
            if (textList.length != 2) {
                return text;
            } else {
                for (var m = 0; m < textList.length; m++) {
                    if (m === 0) {
                        html += '<p>' + textList[m] + '</p>' + '<p>' + I18n.resource.workflow.notice.TASK_RENAME + '</p>';
                    } else {
                        html += '<p>' + textList[m] + '</p>';
                    }
                }
                return html;
            }
        }
        switch (text) {
            case 'edit':
                return I18n.resource.workflow.notice.TASK_EDIT;
            case 'complete':
                return I18n.resource.workflow.notice.TASK_FINISH;
            case 'restart':
                return I18n.resource.workflow.notice.TASK_RESTART;
            case 'start':
                return I18n.resource.workflow.notice.TASK_START;
            case 'pause':
                return I18n.resource.workflow.notice.TASK_PAUSE;
            case 'reply':
                return I18n.resource.workflow.notice.TASK_REPLY;
            case 'new':
                return I18n.resource.workflow.notice.TASK_CREATE;
            default :
                return text;
        }
    }

    function updateBadge(count, list) {
        var $badge = $('#paneWorkflow').find('li[screen="mine"]').find('.badge');
        if (!count) {
            $badge.text('').data('new-tasks', '');
        } else {
            $badge.text(count).data('new-tasks', list);
        }
    }

    function updateNewTaskCount() {
        if (!AppConfig['userId']) {
            return;
        }
        $.get('/workflow/new_task_count/' + AppConfig['userId']).done(function (result) {
            try {
                var r_obj = JSON.parse(result)
            } catch (e) {
                return false;
            }
            var storageNewTask = localStorage.getItem('new_task_' + AppConfig['userId']);
            if (!storageNewTask) {
                updateBadge(r_obj.length, r_obj);
            } else {
                try {
                    storageNewTask = JSON.parse(storageNewTask);
                } catch (e) {
                    return false;
                }
                var unreadList = [];
                for (var n = 0, len = r_obj.length; n < len; n++) {
                    if ($.inArray(r_obj[n], storageNewTask) === -1) {
                        unreadList.push(r_obj[n]);
                    }
                }
                updateBadge(unreadList.length, unreadList);
                localStorage.setItem('new_task_temp_' + AppConfig['userId'], result);
            }
        })
    }

    function getTemplate(template, selector) {
        templateStorage = templateStorage || {};
        var promise;
        if (templateStorage[template]) {
            promise = templateStorage[template];
        } else {
            promise = templateStorage[template] = $.get(template);
        }
        var dfd = $.Deferred();
        promise.done(function (result) {
            var $result = $(result), $template = $result.find(selector).children();
            var $return = $template.clone()
            I18n.fillArea($return)
            dfd.resolve($return);
        });
        return dfd;
    }

    function getWorkflowTemplate(selector) {
        return getTemplate('/static/views/workflow/template.html', selector);
    }

    function inherits(clazz, base) {
        var clazzPrototype = clazz.prototype;

        function F() {
        }

        F.prototype = base.prototype;
        clazz.prototype = new F();
        for (var prop in clazzPrototype) {
            clazz.prototype[prop] = clazzPrototype[prop];
        }
        clazz.constructor = clazz;
    }

    function getUserName(rawUserName) {
        if (rawUserName.indexOf('@') > 0) {
            return rawUserName.substring(0, rawUserName.indexOf('@'))
        }
        return rawUserName;
    }

    return {
        pic_path: pic_path,
        getStatusText: getStatusText,
        updateBadge: updateBadge,
        updateNewTaskCount: updateNewTaskCount,
        getWorkflowTemplate: getWorkflowTemplate,
        inherits: inherits,
        getUserName: getUserName,
        translate: translate
    };
})();


var WorkflowMain = (function () {

    function render_template(group_info) {
        WorkflowTool.getWorkflowTemplate('#wf-main-gd-block').done(function (template_inner) {
            if (!template_inner) {
                return false;
            }
            template_inner.find('.media-heading').text(group_info.name).attr('title', group_info.name);
            if (group_info.pic) {
                var image = WorkflowTool.pic_path + group_info.pic;
                template_inner.find('.media-left').empty().append('<img class="wf-project-icon" src="' + image + '">');
            }
            template_inner.find('.media-body').append(group_info.description).attr('title', group_info.description);
            template_inner.find('.glyphicon-stats .icon-row-text').text(group_info.totalCount);
            template_inner.find('.glyphicon-ok-circle .icon-row-text').text(group_info.finishedCount);
            template_inner.find('.glyphicon-time .icon-row-text').text(group_info.delayedCount);
            template_inner.find('.gd').data('group', group_info);
            $('.gd-row').prepend(template_inner);
        })
    }

    function WorkflowMain() {
    };

    WorkflowMain.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/workflow/main.html").done(function (resultHtml) {
                $(ElScreenContainer).empty().html(resultHtml);
                _this.init();

                I18n.fillArea($(ElScreenContainer));
            });
        },

        close: function () {
        },

        init: function () {
            //WorkflowTool.updateNewTaskCount();
            Spinner.spin($(".workflow-container")[0]);
            WebAPI.post('/workflow/transaction/init', {user_id: AppConfig['userId']}).done(function (result) {
                if (!result) {
                    return;
                }
                try {
                    //$('.gd-row').children().remove();
                    var result_obj = JSON.parse(result);
                    var group_info = result_obj["group_info"];
                    if (group_info && typeof group_info === 'string') {
                        group_info = [];
                    }
                    for (var n = 0, nLen = group_info.length; n < nLen; n++) {
                        render_template(group_info[n]);
                    }

                } catch (e) {
                }
            }).always(function () {
                Spinner.stop();
            });

            $('#workflow-main').on('click', '.new-gd', function () {
                var $gd = $(this);
                if ($gd.find('.media-body.edit').size() > 0) {
                    return false;
                }
                $gd.find('.media-body').hide();

                var edit_media_body = $('<div class="media-body edit"><h3 class="media-heading"><textarea class="gd-edit-textarea title" placeholder="' + I18n.resource.workflow.main.ADD + ' " maxlength="255"></textarea></h3><textarea class="gd-edit-textarea desc" placeholder="' + I18n.resource.workflow.main.ALARM_CONTENT + ' " maxlength="255"></textarea></div>');
                edit_media_body.append('<div class="gd-operator-btns"><button type="button" class="pull-right btn btn-success edit-btn edit-btn-save"><span i18n="workflow.main.SAVE"></span></button><button type="button" class="pull-right btn btn-default edit-btn edit-btn-cancel"><span i18n="workflow.main.CANCEL"></span></button></div>')
                $gd.find('.media').append(edit_media_body);

                I18n.fillArea($gd);
            }).on('click', '.edit-btn-cancel', function () {
                var content_row = $(this).closest('.content-row');
                content_row.find('.media-body.edit').remove().end().find('.media-body').show();
                return false;
            }).on('click', '.edit-btn-save', function () {
                var media_body = $(this).closest('.media-body');
                var title = media_body.find('.title').val().trim(), desc = media_body.find('.desc').val().trim();
                if (!title) {
                    var alert = new Alert('.new-gd', 'danger', I18n.resource.workflow.main.NAME_NOT_NULL).show();
                    setTimeout(function () {
                        alert.close();
                    }, 2000);
                    return false;
                }
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/group/add/', {
                    userId: AppConfig['userId'],
                    name: title,
                    description: desc
                }).done(function (result) {
                    if (!result) {
                        return false;
                    }
                    try {
                        var result_obj = JSON.parse(result);
                    } catch (e) {
                        return false;
                    }
                    render_template({
                        id: result_obj.id,
                        name: title,
                        description: desc,
                        totalCount: 0,
                        finishedCount: 0,
                        delayedCount: 0,
                        pic: result_obj.pic
                    });
                    var content_row = media_body.closest('.content-row');
                    content_row.find('.media-body.edit').remove().end().find('.media-body').show();
                    return false;
                }).always(function () {
                    Spinner.stop();
                });
                return false;
            }).on('click', '.gd:not(.new-gd)', function () {
                var group = $(this).data('group')
                ScreenCurrent.close();
                ScreenCurrent = new workflowTransaction(group);
                ScreenCurrent.show()
            })
        }
    }

    return WorkflowMain;
})();

$(function () {
    var _fetchMemberPromise, _fetchGroupPromise;

    function FetchMembers() {
        if (!_fetchMemberPromise) {
            _fetchMemberPromise = WebAPI.get('/getTransactionGroupUser');
        }
        return _fetchMemberPromise;
    }

    function FetchGroups() {
        if (!_fetchGroupPromise) {
            _fetchGroupPromise = WebAPI.get('workflow/getTransactionGroup/' + AppConfig.userId);
        }
        return _fetchGroupPromise;
    }

    $(ElScreenContainer).on('click.filter-toggle', '.member-filter-dialog-icon', function (ele) {
        $('.filter-dialog-icon').siblings('.mini-dialog').removeClass('open');
        var $this = $(this), mini_dialog = $this.siblings('.mini-dialog');
        mini_dialog.toggleClass('open');
        if (mini_dialog.hasClass('open') && !mini_dialog.attr('done')) {
            Spinner.spin(mini_dialog[0]);
            FetchMembers().done(function (result) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    return
                }
                var group_section = mini_dialog.find('.groups').find('.content'), memeber_section = mini_dialog.find('.members');
                for (var gInd = 0, gLen = result.length; gInd < gLen; gInd++) {
                    var group = result[gInd], members = group.mem;
                    group_section.append('<a class="btn btn-info group-btn" data-id="' + group.id + '">' + group.nm + '</a>');
                    for (var mInd = 0, mLen = members.length; mInd < mLen; mInd++) {
                        var member = members[mInd];
                        memeber_section.append('<a class="btn btn-info member-btn" data-id="' + member.id + '" data-group="' + group.id + '">' + member.nm + '</a>')
                    }
                }

                mini_dialog.attr('done', true);
            }).always(function () {
                Spinner.stop();
            })
        }
    }).on('click.filter-toggle', '.group-filter-dialog-icon', function (ele) {
        $('.filter-dialog-icon').siblings('.mini-dialog').removeClass('open');
        var $this = $(this), mini_dialog = $this.siblings('.mini-dialog');
        mini_dialog.toggleClass('open');
        if (mini_dialog.hasClass('open') && !mini_dialog.attr('done')) {
            Spinner.spin(mini_dialog[0]);
            FetchGroups().done(function (result) {
                var groups = [];
                if (result.success) {
                    groups = result.data;
                }
                var $groups = mini_dialog.find('.groups').find('.content');
                $groups.append('<a class="btn btn-info task-btn">' + I18n.resource.workflow.main.ALL + '</a>');
                for (var n = 0, nlen = groups.length; n < nlen; n++) {
                    $groups.append('<a class="btn btn-info task-btn" data-id="' + groups[n].id + '">' + groups[n].name + '</a>');
                }
                mini_dialog.attr('done', true);
            }).always(function () {
                Spinner.stop();
            })
        }
    }).on('click.row-toggle', '.row-toggle-icon', function (ele) {
        var openIconClass = 'glyphicon-circle-arrow-down', closeIconClas = 'glyphicon-circle-arrow-up';
        var $this = $(this), $toggle = $this.parent().siblings().filter('.toggle-enable').toggleClass('hidden');
        if ($toggle.hasClass('hidden')) {
            $this.removeClass(openIconClass).addClass(closeIconClas);
        } else {
            $this.removeClass(closeIconClas).addClass(openIconClass);
        }
    }).on('click.group-btn', '.group-btn', function () {
        var group_btn = $(this), id = group_btn.data('id'), mini_dialog = group_btn.closest('.mini-dialog');
        mini_dialog.find('.group-btn').removeClass('active');
        group_btn.addClass('active');
        mini_dialog.find('.members').children('.member-btn').addClass('disabled').filter('[data-group=' + id + ']').removeClass('disabled');
    }).on('click.all-member', '#all-member-btn', function () {
        $(this).closest('.mini-dialog').find('.group-btn').removeClass('active').end().find('.member-btn').removeClass('disabled');
    }).on('click.notice_filter', '.member-btn', function (e) {
        var $this = $(this), memberId = $this.data('id');
        $this.closest('.filter-body').find('.filter-result').text($this.text());
        if (!memberId) {
            memberId = -1;
        }
        if (ScreenCurrent instanceof WorkflowReport) {
            ScreenCurrent.updateSelUser(memberId);
        } else if (ScreenCurrent instanceof WorkflowNotice) {
            ScreenCurrent.updateNoticeContent(memberId);
        }
    }).on('click.notice_filter', '.task-btn', function (e) {
        var $this = $(this), id = $this.data('id');
        $this.closest('.filter-body').find('.filter-result').text($this.text());
        if (!id) {
            id = -1;
        }
        if (ScreenCurrent instanceof WorkflowReport) {
            ScreenCurrent.updateSelPrj(id);
        } else if (ScreenCurrent instanceof WorkflowTeam) {
            ScreenCurrent.loadPage(id);
        }
    });

})

$(document).on('click.wf.mini-dialog', function (ent) {
    var $target = $(ent.target);
    if (!$target.hasClass('filter-dialog-icon') && !$(ent.target).closest('.mini-dialog').length) {
        if ($('.mini-dialog').is(':visible')) {
            $('.mini-dialog').removeClass('open');
        }
    }
});

//$(function () {
//    //WorkflowTool.updateNewTaskCount();
//    setInterval(WorkflowTool.updateNewTaskCount, 600000)
//})
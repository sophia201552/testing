/// <reference path="../lib/jquery-1.11.1.js" />

var WorkflowNotice = (function () {
    var rownumber = 0;
    var userID = AppConfig.userId;

    function translate(text) {
        if (!text) {
            return '';
        }
        if (text.indexOf('was renamed') > 0) {
            return text.replace('was renamed', ' ' + I18n.resource.workflow.notice.TASK_RENAME + ' ');
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

    function render_template(notice) {
        WorkflowTool.getWorkflowTemplate('#wf-notice-latest-info').done(function (template) {
            template.find('.avatar-name').text(notice.userName);
            template.find('.info-date-row .date').text(notice.opTime);
            template.find('.latest-info-title').text(translate(notice.title));

            template.find('.notice-item').text(translate(notice.detail));
            template.find('.notice-item')
                .attr('href', '#/notice/' + notice.linkToTransactionId)
                .attr('data-id', notice.linkToTransactionId);
            $('#operations').append(template);
        });
    }

    function WorkflowNotice(id) {
        this.id = id;
    };

    WorkflowNotice.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/workflow/notice.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();

                I18n.fillArea($("#notice-container"));
            });
        },

        close: function () {
            rownumber = 0;
            userID = AppConfig.userId;
        },

        init: function () {
            var _this = this;
            _this.clearNoticeContent();
            $("#more").click(function () {
                rownumber = rownumber + 1;
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.get("/getTransactionOperationRecordByUserId/" + (!userID ? AppConfig.userId : userID) + "/" + rownumber).done(function (result) {
                    _this.initNoticeContent(JSON.parse(result));
                }).always(function () {
                    Spinner.stop();
                });
            });
            Spinner.spin($(".workflow-container")[0]);
            WebAPI.get("/getTransactionOperationRecordByUserId/" + (!userID ? AppConfig.userId : userID) + "/" + rownumber).done(function (result) {
                _this.initNoticeContent(JSON.parse(result));
            }).always(function () {
                Spinner.stop();
            });

            $('#notice-container').on('click', '.notice-item', function () {
                try {
                    if (!!Path && !Path.version) {
                        return true;
                    }
                } catch (e) {
                    ScreenCurrent.close();
                    ScreenCurrent = new workflowNoticeDetail($(this).data('id'), I18n.resource.workflow.notice.TITLE_WO_DYNAMIC);
                    ScreenCurrent.show();
                    return false;
                }
            });
        },
        initNoticeContent: function (notices) {
            this.clearNoticeContent();
            var paneSelector = $("#operations");
            if (!notices || !notices.length) {
                paneSelector.append("<div class='latest-info-description'>" + I18n.resource.workflow.notice.NO_FOUND + "</div>")
            } else {
                paneSelector.find('.latest-info-description').remove();
            }
            for (var i = 0; i < notices.length; i++) {
                var notice = notices[i];
                render_template(notice);
            }
        },

        clearNoticeContent: function () {
            $("#operations").html("")
        },

        updateNoticeContent: function (userid) {
            var _this = this;
            userID = userid;
            rownumber = 0;
            Spinner.spin($(".workflow-container")[0]);
            WebAPI.get("/getTransactionOperationRecordByUserId/" + userID + "/" + rownumber).done(function (result) {
                _this.clearNoticeContent();
                _this.initNoticeContent(JSON.parse(result));
            }).always(function () {
                Spinner.stop();
            });
        }
    }

    return WorkflowNotice;
})();
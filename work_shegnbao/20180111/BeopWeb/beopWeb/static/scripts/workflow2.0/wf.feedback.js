/**
 * Created by win7 on 2016/12/15.
 */
var WorkflowFeedBack = (function () {

    function WorkflowFeedBack(feedbackData) {
        //数据来源
        this.feedbackData = feedbackData;

        this.callback = {submitSuccess: $.noop, cancel: $.noop, fail: $.noop};

        //当前的spinner
        this.spinner = new LoadingSpinner({color: '#00FFFF'});
    }

    WorkflowFeedBack.prototype = {
        //public
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            if (_this.feedbackData.commentRecord && !_this.feedbackData.feedbackUnhandled) {
                WebAPI.get("/static/views/workflow/temp_user_comments_records.html" + '?=' + new Date().getTime()).done(function (resultHtml) {
                    $('body').append(resultHtml);
                    var $container = $('#feedbackCommentsModal');
                    _this._init($container);
                    _this.refreshCommentList();
                    I18n.fillArea($container);
                }).always(function () {
                    Spinner.stop();
                });
            } else if (_this.feedbackData.feedbackUnhandled && _this.feedbackData.commentRecord) {
                WebAPI.get("/static/views/workflow/temp_user_unhandled_feedback.html" + '?=' + new Date().getTime()).done(function (resultHtml) {
                    $('body').append(resultHtml);
                    var $container = $('#fbUnhandledModal');
                    _this._init($container);
                    I18n.fillArea($container);
                }).always(function () {
                    Spinner.stop();
                });
            } else {
                WebAPI.get("/static/views/workflow/temp_user_comments.html" + '?=' + new Date().getTime()).done(function (resultHtml) {
                    var $container;
                    if (_this.feedbackData.feedbackUnhandled) {
                        $('body').append(resultHtml);
                        $container = $('#fbUnhandledModal');
                    } else {
                        $container = $('#dialogModal').find('#dialogContent').empty().html(resultHtml).end();
                        $("#dialogContent").removeClass('wr80');
                    }
                    _this._init($container);
                    I18n.fillArea($container);
                }).always(function () {
                    Spinner.stop();
                });
            }
            return this;
        },

        //主动关闭和销毁
        close: function () {
            this._destroy();
        },
        //提交
        submitSuccess: function (fn) {
            this.callback.submitSuccess = fn ? fn : this._noop;
            return this;
        },
        //取消
        cancel: function (fn) {
            this.callback.cancel = fn ? fn : this._noop;
            return this;
        },
        //失败
        fail: function (fn) {
            this.callback.fail = fn ? fn : this._noop;
            return this;
        },
        //private
        _destroy: function () {
            this.echartsInstance && this.echartsInstance.dispose();
        },
        _init: function ($dialog) {
            //检查用户是否有任务组
            var _this = this;
            var feedback = _this.feedbackData.feedback;
            var handleStatus;
            if (_this.feedbackData.feedbackUnhandled && feedback == 0) {
                handleStatus = I18n.resource.diagnosis.historyLog.UNHANDLED;
            } else if ((!_this.feedbackData.feedbackUnhandled && feedback == 0) || feedback == 2 || feedback == 1) {
                handleStatus = I18n.resource.diagnosis.historyLog.IN_PROCESS;
            } else if (feedback == 3) {
                handleStatus = I18n.resource.diagnosis.historyLog.COMPLETE;
            }
            _this.feedbackData.FeedBackId && beop.model.fdModel.setFeedbackId(_this.feedbackData.FeedBackId);
            $dialog.find('#feedbackTitle').text(_this.feedbackData.title);
            $dialog.find('#feedbackCritical').text(I18n.resource.workflow.urgencyLevel[_this.feedbackData.critical]);
            $dialog.find('#feedbackDetail').html(_this.feedbackData.description);
            $dialog.find('#commentsContent').val('');
            $dialog.find('.handleStatus').text(handleStatus);
            $dialog.modal();
            this._renderFaultChart($dialog.find('.fault-feedback-curve'));

            $dialog.find('form').submit(function () {
                var formMap = {
                    processMember: {
                        "0": [1],
                        "1": []
                    },
                    fields: {
                        charts: {
                            projectId: AppConfig.projectId,
                            chartPointList: _this.feedbackData.chartPointList,
                            chartQueryCircle: _this.feedbackData.chartQueryCircle,
                            chartStartTime: _this.feedbackData.chartStartTime,
                            chartEndTime: _this.feedbackData.chartEndTime
                        },
                        detail: _this.feedbackData.detailPrefix + $('#commentsContent', $dialog).val(),
                        rawDetail: $('#commentsContent', $dialog).val(),
                        userId: AppConfig.userId,
                        title: _this.feedbackData.title,
                        critical: _this.feedbackData.critical,
                        dueDate: _this.feedbackData.dueDate,
                        faultId: _this.feedbackData.faultId,
                        type: beop.constants.taskType.FEEDBACK
                    }
                };
                var chartIns = echarts.getInstanceById($('#fbUnhandledModal .fault-feedback-curve')[0].getAttribute('_echarts_instance_'));
                formMap.image = chartIns.getDataURL();
                Spinner.spin(document.body);
                WebAPI.post('/workflow/task/save/', formMap).done(function (result) {
                    if (result.success) {
                        $dialog.modal('hide');
                        alert.success(I18n.resource.workflow.main.FEEDBACK_SUCCESS);
                        _this.callback.submitSuccess && _this.callback.submitSuccess();
                        //诊断历史反馈状态改变
                        $('#diagHistory_' + _this.feedbackData.id).find('.unhandled').css('color', '#0078DC').removeClass('unhandled');
                        //诊断实时列表反馈状态改变
                        $('#' + _this.feedbackData.id).find('.unhandled').css('cssText', 'color:#0078DC !important').removeClass('unhandled');
                        beop.model.fdModel.setFeedbackId(result.data);
                    } else {
                        alert.danger(I18n.resource.workflow.main.FEEDBACK_FAIL);
                    }
                }).always(function () {
                    Spinner.stop();
                })
            });
        },

        refreshCommentList: function () {
            var $fbCommentList = $('#fb-comment-list');
            this.feedbackData.FeedBackId && beop.model.fdModel.setFeedbackId(this.feedbackData.FeedBackId);
            this.newFeedbackId = null;
            beop.view.replyList.configModel({
                reply_mode: beop.model.fdModel
            });
            beop.view.replyList.init($fbCommentList);
        },

        //获取错误echarts图表数据
        _renderFaultChart: function ($container) {
            var _this = this;
            if (!this.feedbackData.chartPointList) {
                $container.hide();
                return $.Deferred().resolve({success: true});
            }
            this.spinner.spin($container.get(0));

            beop.view.faultCurve.configModel({
                transactions_model: beop.model.transactionsModel
            });
            return beop.view.faultCurve.init($container, {
                points: this.feedbackData.chartPointList,
                timeFormat: this.feedbackData.chartQueryCircle,
                timeStart: this.feedbackData.chartStartTime,
                timeEnd: this.feedbackData.chartEndTime,
                projectId: AppConfig.projectId
            }).always(function () {
                _this.spinner.stop();
            });
        }
    };

    return WorkflowFeedBack;

})();
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
            WebAPI.get("/static/views/workflow/temp_user_comments.html" + '?=' + new Date().getTime()).done(function (resultHtml) {
                var $container = $('#dialogModal').find('#dialogContent').empty().html(resultHtml).end();
                _this._init($container);
                I18n.fillArea($container);
            }).always(function () {
                Spinner.stop();
            });
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
            $dialog.find('#feedbackTitle').text(_this.feedbackData.title);
            $dialog.find('#feedbackCritical').text(I18n.resource.workflow.urgencyLevel[_this.feedbackData.critical]);
            $dialog.find('#feedbackDetail').html(_this.feedbackData.description);
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
                        userId: AppConfig.userId,
                        title: _this.feedbackData.title,
                        critical: _this.feedbackData.critical,
                        dueDate: _this.feedbackData.dueDate,
                        faultId: _this.feedbackData.faultId,
                        type: beop.constants.taskType.FEEDBACK
                    }
                };

                Spinner.spin(document.body);
                WebAPI.post('/workflow/task/save/', formMap).done(function (result) {
                    if (result.success) {
                        $dialog.modal('hide');
                        alert.success(I18n.resource.workflow.main.FEEDBACK_SUCCESS);
                        _this.callback.submitSuccess && _this.callback.submitSuccess();
                    } else {
                        alert.danger(I18n.resource.workflow.main.FEEDBACK_FAIL);
                    }
                }).always(function () {
                    Spinner.stop();
                })
            });
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
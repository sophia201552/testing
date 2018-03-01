/// <reference path="../lib/jquery-1.11.1.js" />
var WorkflowSet = (function () {

    function WorkflowSet() {
        this.i18 = I18n.resource.workflow.urgencyLevel;
        this.settings = {
            'replied': {text: I18n.resource.workflow.set.TASK_COMMENTED_UPON, isChecked: false},
            'assign_task_finished': {text: I18n.resource.workflow.set.ASSIGNMENT_COMPLETE, isChecked: false},
            'assign_task_started': {text: I18n.resource.workflow.set.ASSIGNMENT_STARTS, isChecked: false},
            'assign_task_paused': {text: I18n.resource.workflow.set.TASK_SUSPENDED, isChecked: false},
            'assign_task_replied': {text: I18n.resource.workflow.set.ASSIGNMENT_REVIEWED, isChecked: false}
        }
    }

    WorkflowSet.prototype = {
        show: function () {
            var _this = this;
            WebAPI.get("/static/views/workflow/set.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();
                I18n.fillArea($("#workflow-set"));
            });
        },

        close: function () {
        },
        getSaveModel: function () {
            var model = {}, $input;
            $.each($("#mailNotifiOptionsUl input[name='mailNotifiOptions']"), function (index, input) {
                $input = $(input);
                model[$input.val()] = $input.is(':checked');
            });
            return model;
        },
        refreshPage: function () {
            $('#mailNotifiOptionsUl').empty().append(beopTmpl('settingListTmpl', this.settings));
        },

        init: function () {
            var _this = this;
            WebAPI.post('/workflow/getSetting/', {
                userId: AppConfig.userId
            }).done(function (result) {
                if (result.success) {
                    for (var setting in _this.settings) {
                        _this.settings[setting].isChecked = result.data[setting];
                    }
                }

                _this.refreshPage();
            });

            this.attachEvent();
        },
        attachEvent: function () {
            var _this = this;
            $("#btnSet").click(function () {
                WebAPI.post('/workflow/saveSetting/', {
                    userId: AppConfig.userId,
                    settings: _this.getSaveModel()
                }).done(function (result) {
                    if (result.success) {
                        new Alert($('#workflow-set'), Alert.type.success, I18n.resource.code[result.code]).showAtTop(2000);
                    }
                });
            })
        }
    };

    return WorkflowSet;
})();
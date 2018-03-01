/// <reference path="../lib/jquery-1.11.1.js" />

var WorkflowEfficiency = (function () {
    function WorkflowEfficiency() {
        this.maxNum = 10;
        this.i18 = I18n.resource.workflow.efficiency;
        this.dateRange = {
            beginTime: '',
            endTime: ''
        }
    }

    WorkflowEfficiency.prototype = {
        show: function () {
            var _this = this;
            WebAPI.get("/static/views/workflow/efficiency.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();
                I18n.fillArea($("#workflow-efficiency"));
            });
        },

        close: function () {
        },

        init: function () {
            this.renderGroupEfficiency();
            this.attachEvent();
        },
        attachEvent: function () {
            var _this = this;
            $(".workflow-efficiency-table-footer").click(function () {
            });

            $("#thisMonth, #cumulative, #lastMonth").click(function () {
                var $this = $(this);
                if ($this.hasClass("btn-success")) {
                    return false;
                }
                $this.removeClass("btn-default").addClass("btn-success").css("cursor", "default").siblings("button").removeClass("btn-success").addClass("btn-default").css("cursor", "pointer");
                var today = new Date(), thisMonthBegin, lastMonthBegin, lastMonthEnd;
                if ($this.attr("id") == "thisMonth") {
                    thisMonthBegin = new Date(today.getFullYear(), today.getMonth(), 1).format('yyyy-MM-dd');
                    _this.setDateRange(thisMonthBegin, today.format('yyyy-MM-dd'));
                } else if ($this.attr("id") == "cumulative") {
                    _this.setDateRange();
                } else if ($this.attr("id") == "lastMonth") {
                    lastMonthBegin = new Date(today.getFullYear(), today.getMonth() - 1, 1).format('yyyy-MM-dd');
                    lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0).format('yyyy-MM-dd');
                    _this.setDateRange(lastMonthBegin, lastMonthEnd);
                }
                _this.renderGroupEfficiency();
            });

            $("#divGroupStatics").on("click", ".isSeeChart", function () {
                var $this = $(this);
                var $userStaticsContent = $this.parents(".recordCon").next(".divUserStatics");
                if ($userStaticsContent.is(':hidden')) {
                    if ($userStaticsContent.children().length === 0) {
                        _this.renderMemberEfficiency($userStaticsContent, $this.data('group-id')).done(function () {
                            $this.text(_this.i18.HIDE);
                            $userStaticsContent.slideDown(300);
                        });
                    } else {
                        $this.text(_this.i18.HIDE);
                        $userStaticsContent.slideDown(300);
                    }
                } else {
                    $this.text(_this.i18.VIEW);
                    $userStaticsContent.slideUp(300);
                }
            });
        },
        setDateRange: function (beginTime, endTime) {
            this.dateRange.beginTime = beginTime ? beginTime : '';
            this.dateRange.endTime = endTime ? endTime : '';
        },
        renderGroupEfficiency: function () {
            Spinner.spin($("#GroupStatics")[0]);
            return WebAPI.post("workflow/groupEfficiency/", {
                userId: AppConfig.userId,
                beginTime: this.dateRange.beginTime,
                endTime: this.dateRange.endTime
            }).done(function (result) {
                if (result.success) {
                    var mainHtml = beopTmpl('efficiencyMainTmpl', {groups: result.data});
                    $('#divGroupStatics').empty().append(mainHtml);
                }
                I18n.fillArea($("#workflow-efficiency"));
            }).always(function () {
                Spinner.stop();
            });
        },
        handleUserData: function (users) {
            var user, maxCount = 0;
            for (var m = 0; m < users.length; m++) {
                user = users[m];
                if (user.totalCount > maxCount) {
                    maxCount = user.totalCount;
                }
            }
            for (var m = 0; m < users.length; m++) {
                user = users[m];
                user.countPercent = ((user.totalCount / maxCount) * 100).toFixed(1)
            }
            users = users.sort(function (a, b) {
                return a.totalCount < b.totalCount;
            })
            return users;
        },
        renderMemberEfficiency: function ($container, groupId) {
            Spinner.spin($("#GroupStatics")[0]);
            var _this = this;
            return WebAPI.post("workflow/memberEfficiency/", {
                userId: AppConfig.userId,
                groupId: groupId,
                beginTime: this.dateRange.beginTime,
                endTime: this.dateRange.endTime
            }).done(function (result) {
                if (result.success) {
                    var html = beopTmpl('efficiencyMemeberTmpl', {users: _this.handleUserData(result.data)});
                    $container.append(html);
                }
            }).always(function () {
                Spinner.stop();
            });
        }
    };

    return WorkflowEfficiency;
})();
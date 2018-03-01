var WorkflowManage = (function () {
    var that;

    function WorkflowManage() {
        this.content = null;
        that = this;
        this.calender = null;
    }

    WorkflowManage.prototype = {
        show: function () {
            WebAPI.get("/static/views/workflow/outline.html?t=" + new Date().getTime()).done(function (resultHtml) {
                var $ElScreenContainer = $(ElScreenContainer);
                $ElScreenContainer.html(resultHtml);
                that.init();
                beop.model.init();
                beop.main.init($ElScreenContainer);
                I18n.fillArea($(ElScreenContainer));
            });
        },
        init: function () {
            //that.attachEvent();
            //that.getTaskInit();
        },
        attachEvent: function () {
            that.outLineEvents();
        },
        detachEvents: function () {

        },
        outLineEvents: function () {
            var $wf_level_menu = $("#wf-level-menu");
            var $wf_main_ul = $("#wf-main-ul");
            var _this = this;

            $("#calendar-time").datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true
            });
            $("#wf-calendar-input").val(new Date().format("yyyy-MM-dd"));
        },
        getDynamicInit: function () {
            WebAPI.get("/static/views/workflow/activity.html").done(function (resultHtml) {
                $("#wf-content-box").html(resultHtml);
                I18n.fillArea($(ElScreenContainer));
            });
        },
        getTaskInit: function () {
            ScreenCurrent.close();
            ScreenCurrent = new WorkflowTask();
            //ScreenCurrent = new WorkflowTaskEdit();
            ScreenCurrent.show();
        },
        loadDetail: function (str) {
            ScreenCurrent.close();
            ScreenCurrent = new WorkflowTaskEdit(str);
            ScreenCurrent.show();
        },
        getCrumbsTxt: function (level, txt) { //level 层级  1-为主菜单  2-为二级菜单
            var text = $("#wf-main-ul .active").text();
            if (level == 2) {
                text += " >> " + txt;
            }
            $("#crumbs").html(text);
        },
        close: function () {

        }
    };

    return WorkflowManage;
})();
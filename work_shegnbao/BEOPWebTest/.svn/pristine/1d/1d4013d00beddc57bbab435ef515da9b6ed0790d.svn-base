var WorkflowTask = (function () {
    var that;

    function WorkflowTask() {
        this.content = null;
        that = this;
    }

    WorkflowTask.prototype = {
        show: function () {
            WebAPI.get("/static/views/workflow/task_mine.html?t=" + new Date().getTime()).done(function (resultHtml) {
                that.content = $("#wf-content-box");
                that.content.html(resultHtml);
                that.init();
            });
        },
        init: function () {
            that.paginationRefresh(15, $("#task-paginationWrapper"), 'task-pagination');
            //that.paginationItems(1);
            that.content.on('click', '#wf-new-task', function () {
                //that.loadDetail("new");
            }).on('click', '.wf-task-edit', function () {
                that.loadDetail("edit");
                return;
            }).on('click', '.wf-task-star', function () {
                var $this = $(this);
                if($this.hasClass("glyphicon-star-empty")){
                    $this.removeClass("glyphicon-star-empty").addClass("glyphicon-star");
                }else{
                    $this.removeClass("glyphicon-star").addClass("glyphicon-star-empty");
                }
                return;
            }).on('click', '.wf-record tbody tr', function (e) {
                var $target = $(e.target);
                if (!$target.hasClass("hasEvents")) {
                    that.loadDetail("search");
                }else{
                    that.loadDetail("edit");
                }
            });
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
        loadDetail: function (str) {
            ScreenCurrent.close();
            ScreenCurrent = new WorkflowTaskEdit(str);
            ScreenCurrent.show();
        },
        attachEvent: function () {
            that.outLineEvents();
        },
        detachEvents: function () {

        },
        close: function () {

        }
    };

    return WorkflowTask;
})();
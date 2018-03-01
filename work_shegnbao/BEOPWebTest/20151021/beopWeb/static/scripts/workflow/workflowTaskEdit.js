var WorkflowTaskEdit = (function () {
    var that;

    function WorkflowTaskEdit(str) {
        //this.type = str;
        this.content = null;
        this.model = {
            //"type" : "new"
            "type" : str
        };
        that = this;
    }

    WorkflowTaskEdit.prototype = {
        show: function () {
            WebAPI.get("/static/views/workflow/task_edit.html?t=" + new Date().getTime()).done(function (resultHtml) {
                //that.content = $("#wf-content-box");
                that.content = $("#wf-content");
                $("#wf-mineEdit-content").hide();
                that.content.html(resultHtml);
                that.init();
            });
        },
        initPage: function () {
            //$('#wf-detail-info').html(beopTmpl('tpl_wf_detail', that.model));
            var $detail = $('#wf-detail-form');
            if (that.model.type == "new") { //新建任务
                $detail.html(beopTmpl('tpl_wf_detailNew', that.model));
            } else if (that.model.type == "search") { //查看任务
                $detail.html(beopTmpl('tpl_wf_detailSearch', that.model));
            } else if (that.model.type == "edit") { //修改任务
                $detail.html(beopTmpl('tpl_wf_detailEdit', that.model));
            }
        },
        init: function () {
            //that.initPage(that.type);
            that.initPage();
            $("#beginTime").datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true
            });

            $("#endTime").datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true
            });

            that.content.on("click", "#wf-detail-funUl li", function () {
                var $this = $(this);
                var $comment = $("#wf-detail-comment");
                var $progress = $("#wf-detail-progress");
                var id = $this.attr("id");
                if (id == "wf-detail-commentNav") {
                    $comment.show();
                    $progress.hide();
                } else {
                    $comment.hide();
                    $progress.show();
                }
                $this.addClass("active").siblings().removeClass("active");//wf-detail-userInfo
            }).on('click', '.wf-task-star', function () {
                /*var $this = $(this);
                 if($this.hasClass("glyphicon-star-empty")){
                 $this.removeClass("glyphicon-star-empty").addClass("glyphicon-star");
                 }else{
                 $this.removeClass("glyphicon-star").addClass("glyphicon-star-empty");
                 }*/
            }).on('mouseover', '.wf-detail-userInfo', function () {
                $(this).closest(".wf-detail-userInfo").find(".closePic").show();
            }).on('mouseout', '.wf-detail-userInfo', function () {
                $(this).closest(".wf-detail-userInfo").find(".closePic").hide();
            }).on('click', '.closePic', function () {
                $(this).parents(".closePicParent").remove();
            }).on('click', '#wf-labelName-confrim', function () {
                var val = $.trim($("#labelName").val());
                if(val!=''){
                    var $wrapper = $("#wf-detail-labelWrapper");
                    var $error = $("#wf-labelName-error");
                    if ($wrapper.find(".wf-my-label").length < 3) {
                        $wrapper.append('<span class="wf-my-label">' + val + '</span>');
                        $error.hide();
                    }else{
                        $error.show();
                    }
                }
            });
        },
        attachEvent: function () {

        },
        detachEvents: function () {

        },
        close: function () {

        }
    };

    return WorkflowTaskEdit;
})();
var WorkflowRemind = (function () {

    function WorkflowRemind(remindData) {
        this.timer = null;
        this.remindData = !remindData ? [] : remindData;
    }

    WorkflowRemind.prototype = {
        //public
        show: function () {
            this.init();
        },

        close: function () {// 关闭和销毁
            var $wfMessageBox = $("#wfMessageBox");
            $wfMessageBox.slideUp(1000);
            $wfMessageBox.remove();
        },

        init: function () {// 初始化请求
            if (this.remindData.length) {
                this._createBox();
                this._bindEvents();
            }
        },

        _createBox: function () {// 有数据创建消息盒子
            // 添加消息盒子
            var messageLi = '<ul id="wfMessageUl">', timer;
            for (var i = 0; i < this.remindData.length; i++) { // 添加消息列表
                var item = this.remindData[i], taskInfo = item.taskInfo, taskId = taskInfo && taskInfo.id, creator = taskInfo && taskInfo.creatorInfo;
                messageLi += '<li class="wfMessageLi oh" trans_id = "' + taskId + '">' +
                    '<img src="' + creator.userpic + '" class="userImg fl">' +
                    '<div class="fl oh">' +
                    '<span class="db wfMessageInfo">' +
                    '<span class="wfMessageUserName">' + creator.userfullname + '</span>' +
                    '<span class="wfMessageOp">' + this._translateOp(item.task.op) + '</span>' +
                    '</span>' +
                    '<span class="db wfMessageInfo wfMessageIdAndTitle ellipsis" title="' + taskId + ' ' + taskInfo.title + '">' +
                    '<span>' + taskId + ' </span>' +
                    '<span>' + taskInfo.title + '</span>' +
                    '</span>' +
                    '<span class="db wfMessageTime">' + item.task.optime + '</span>' +
                    '</div>' +
                    '</li>';
            }
            messageLi += '</ul>';
            var remindRemindInstance = remindInfoBox(messageLi);
            timer = setTimeout(function () {
                remindRemindInstance._destroy();
            }, 30000); // 半分钟销毁工单盒子
        },

        _translateOp: function (text) {//绑定事件
            switch (text) {
                case 'reply':
                    return I18n.resource.workflow.notice.TASK_REPLY;
                case 'new':
                    return I18n.resource.workflow.notice.TASK_CREATE;
                case "complete":
                    return I18n.resource.workflow.notice.TASK_FINISH;
                case "verified":
                    return I18n.resource.workflow.notice.TASK_VERIFIED;
                case "not_verified":
                    return I18n.resource.workflow.notice.TASK_VERIFIED_FAILED;
                default :
                    return text;
            }
        },

        _bindEvents: function () {//绑定事件
            var _this = this;
            $("#wfMessageClose").off().on('click', function () {
                _this.close();
            });

            $("#wfMessageUl .wfMessageLi").off().on('click', function () {
                ScreenCurrent.container = 'undefined';
                location.hash = '#page=workflow&type=transaction&transactionId=' + $(this).attr('trans_id');
            });
        }
    };

    return WorkflowRemind;

})();
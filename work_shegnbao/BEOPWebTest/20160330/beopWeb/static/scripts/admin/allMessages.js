var mesListTest = [
    {
        'id': 111,
        'unread': true,
        'type': '',
        'user': 'admin',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '冷凝器进水温度无规律波动冷凝器进水温度无冷凝器进水温度无规律波动规律波动',
        'time': '2016-05-03'
    },
    {
        'id': 112,
        'unread': false,
        'type': '',
        'user': '管理员',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '冷凝器进水温度无规律波动冷凝器进水温度无冷凝器进水温度无规律波动规律波动',
        'time': '2016-05-03'
    },
    {
        'id': 113,
        'unread': false,
        'type': '',
        'user': '管理员',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '冷凝器进水温度无规律波动冷凝器进水温度无冷凝器进水温度无规律波动规律波动冷凝器进水温度无规律波动冷凝器进水温度无冷凝器进水温度无规律波动规律波动',
        'time': '2016-05-03'
    },
    {
        'id': 114,
        'unread': true,
        'type': '',
        'user': '管理员',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '无规律波动test无规律波动test',
        'time': '2016-05-03'
    },
    {
        'id': 115,
        'unread': false,
        'type': '',
        'user': '管理员',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '无规律波动test无规律波动test',
        'time': '2016-05-03'
    },
    {
        'id': 116,
        'unread': true,
        'type': '',
        'user': '管理员',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '冷凝器进水温度无规律波动冷凝器进水温度无冷凝器进水温度无规律波动规律波动',
        'time': '2016-05-03'
    },
    {
        'id': 117,
        'unread': false,
        'type': '',
        'user': '管理员',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '冷凝器进水温度无规律波动冷凝器进水温度无冷凝器进水温度无规律波动规律波动',
        'time': '2016-05-03'
    },
    {
        'id': 118,
        'unread': false,
        'type': '',
        'user': '管理员',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '冷凝器进水温度无规律波动冷凝器进水温度无冷凝器进水温度无规律波动规律波动',
        'time': '2016-05-03'
    },
    {
        'id': 119,
        'unread': false,
        'type': '',
        'user': '管理员',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '冷凝器进水温度无规律波动冷凝器进水温度无冷凝器进水温度无规律波动规律波动',
        'time': '2016-05-03'
    },
    {
        'id': 120,
        'unread': false,
        'type': '',
        'user': '管理员',
        'userPic': '/static/images/avatar/default/7.png',
        'message': '冷凝器进水温度无规律波动冷凝器进水温度无冷凝器进水温度无规律波动规律波动',
        'time': '2016-05-03'
    }
];
var AllMessages = (function () {
    function AllMessages() {
        this.configMap = {
            url: "static/views/admin/allMessages.html" + '?=' + new Date().getTime()
        };
        this.stateMap = {
            defaultNum: 5,
            messageList: mesListTest
        };
        this.jqueryMap = {};
        this.apiMap = {};
    }

    AllMessages.prototype = {
        show: function () {
            $(".infoBoxMessage").hide();
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get(this.configMap.url + '?t=' + new Date().getTime()).done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.refreshList(_this.stateMap.defaultNum);
                _this.init();
            });
        },
        init: function () {
            this.attachEvent();
        },
        setJqueryMap: function () {
            this.jqueryMap = {}
        },
        attachEvent: function () {
            var _this = this;
            $("#message_more").off().click(function () {
                $(this).remove();
                _this.refreshList(_this.stateMap.messageList.length);
            });
        },
        detachEvents: function () {

        },
        close: function () {
            this.detachEvents();
        },
        refreshList: function (num) {
            $("#all_messages_ul").empty().html(beopTmpl('tpl_message_show_all', {
                'messageNum': num,
                'messageList': mesListTest
            }));
        }
    };
    return AllMessages;
})();
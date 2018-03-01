/// <reference path="../lib/jquery-1.11.1.js" />
var ScreenCurrent;
var spinner = new LoadingSpinner({ color: '#00FFFF' });
var navigation = responsiveNav("#navbar-collapse");
//TODO
var AppConfig = { userId: 1 };

$(function () {
    function activeMenu() {
        var hash = location.hash;
        var screen = hash.substring(hash.indexOf('#/') + 2).split('/')[0];
        $('#ulPages').find('li').removeClass('active').filter('li[screen="' + screen + '"]').addClass('active');
    };

    activeMenu();

    $("#ulPages").on('click', 'li', function (e) {
        location.hash = '/' + e.currentTarget.attributes["screen"].value
        $("#ulPages li").removeClass("active");
        $(this).addClass("active");
    });


    function ScreenFactory(name, param) {
        var screen;
        switch (name) {
            case "main": screen = new WorkflowMain(); break;
            case "notice": screen = new WorkflowNotice(); break;
            case "report": screen = new WorkflowReport(); break;
            case "team": screen = new WorkflowTeam(); break;
            case "efficiency": screen = new WorkflowEfficiency(); break;
            case "mine": screen = new WorkflowMine(); break;
            case "set": screen = new WorkflowSet(); break;
            case "noticeDetail": screen = new workflowNoticeDetail(param); break;
            case "transaction": screen = new workflowTransaction(param); break;
            case "group": screen = new workflowGroup(); break;
            case "calendar": screen = new WorkflowCalendar(); break;
            case "manage": screen = new WorkflowManage(); break;
            default: screen = new WorkflowMain(); break;
        }
        return screen;
    }

    (function loadRoute() {
        Path.root("#/main");

        Path.map("#/main").to(function () {
            ScreenCurrent = ScreenFactory('main');
            ScreenCurrent.show();
        }).enter(function () {
            ScreenCurrent && ScreenCurrent.close();
            activeMenu();
        });

        Path.map("#/notice").to(function () {
            ScreenCurrent = ScreenFactory('notice');
            ScreenCurrent.show();
        }).enter(function () {
            ScreenCurrent && ScreenCurrent.close();
            activeMenu();
        });

        Path.map("#/notice/:id").to(function () {
            var id = this.params['id']
            ScreenCurrent = ScreenFactory('noticeDetail', id);
            ScreenCurrent.show();
        }).enter(function () {
            ScreenCurrent && ScreenCurrent.close();
            activeMenu();
        });

        Path.map("#/report").to(function () {
            ScreenCurrent = ScreenFactory('report');
            ScreenCurrent.show();
        }).enter(function () {
            ScreenCurrent && ScreenCurrent.close();
            activeMenu();
        });

        Path.map("#/team").to(function () {
            ScreenCurrent = ScreenFactory('team');
            ScreenCurrent.show();
        }).enter(function () {
            ScreenCurrent && ScreenCurrent.close();
            activeMenu();
        });

        Path.map("#/efficiency").to(function () {
            ScreenCurrent = ScreenFactory('efficiency');
            ScreenCurrent.show();
        }).enter(function () {
            ScreenCurrent && ScreenCurrent.close();
            activeMenu();
        });

        Path.map("#/mine").to(function () {
            ScreenCurrent = ScreenFactory('mine');
            ScreenCurrent.show();
        }).enter(function () {
            ScreenCurrent && ScreenCurrent.close();
            activeMenu();
        });

        Path.map("#/transaction").to(function () {
            ScreenCurrent = ScreenFactory('transaction');
            ScreenCurrent.show();
        }).enter(function () {
            ScreenCurrent && ScreenCurrent.close();
            activeMenu();
        });

        Path.map("#/group").to(function () {
            ScreenCurrent = ScreenFactory('group');
            ScreenCurrent.show();
        }).enter(function () {
            ScreenCurrent && ScreenCurrent.close();
            activeMenu();
        });

        Path.listen();
    })();
})


var WorkflowIndex = (function () {

    function WorkflowIndex() {
        this.init();
    };

    WorkflowIndex.prototype = {
        close: function () {
        },

        init: function () {
            ScreenCurrent = new WorkflowMain();
            ScreenCurrent.show();

        }
    }

    return WorkflowIndex;
})();
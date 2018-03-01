(function () {
    var
        configMap = {
            htmlURL: ''
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        init, show, close;

    setJqueryMap = function () {
        var $container = stateMap.$container,
            $content = $container.find('#wf-content');

        jqueryMap = {
            $container: $container,
            $main_menu: $container.find('#wf-main-menu'),
            $level_menu: $container.find('#wf-level-menu'),
            $content: $content,
            $content_wrapper: $content.find('#wf-content-wrapper'),
            $content_box: $content.find('#wf-content-box')
        };
    };

    show = function () {
        beop.main.prototype.init($(ElScreenContainer));
    };
    close = function () {

    };

    init = function ($container) {
        stateMap.$container = $container;
        Spinner.spin($container.get(0));
        WebAPI.get("/static/views/workflow/outline.html").done(function (resultHtml) {
            var $ElScreenContainer = $(ElScreenContainer);
            $ElScreenContainer.html(resultHtml);
            setJqueryMap();
            I18n.fillArea($container);
            var language = localStorage.getItem('language');
            if (language === 'zh') {
                moment.locale('zh-cn');
            } else {
                moment.locale('en');
            }

            //------------configure and initialize Models
            beop.model.init();

            //------------configure and initialize views
            beop.view.activities.configModel({
                activities_model: beop.model.activitiesModel,
                transactions_model: beop.model.transactionsModel,
                reply_mode: beop.model.replyModel
            });

            beop.view.taskList.configModel({
                transactions_model: beop.model.transactionsModel,
                tags_model: beop.model.tagsModel
            });

            beop.view.faultCurve.configModel({
                transactions_model: beop.model.transactionsModel
            });

            beop.view.replyList.configModel({
                transactions_model: beop.model.transactionsModel,
                reply_mode: beop.model.replyModel
            });

            beop.view.progress.configModel({
                transactions_model: beop.model.transactionsModel
            });

            beop.view.groupAdd.configModel({
                group_model: beop.model.groupModel
            });

            beop.view.groupDelete.configModel({
                group_model: beop.model.groupModel
            });

            beop.view.memberSelected.configModel({
                group_model: beop.model.groupModel
            });

            beop.view.taskDetail.configModel({
                transactions_model: beop.model.transactionsModel,
                tags_model: beop.model.tagsModel
            });

            beop.view.menu_group_list.configModel({
                group_model: beop.model.groupModel
            });

            beop.view.menu_tag_list.configModel({
                tags_model: beop.model.tagsModel
            });
            beop.view.groupEdit.configModel({
                group_model: beop.model.groupModel
            });

            //加载按钮
            beop.view.menu.init(stateMap.$container);

            //加载动态
            //beop.view.activities.init(jqueryMap.$content);

            //加载任务
            jqueryMap.$main_menu.find('#wf-main-task').trigger('click');

            //------------Event
        }).always(function () {
            Spinner.stop();
        });
    };

    var _main = function () {

    };
    _main.prototype = {
        init: init,
        show: show,
        close: close
    };

    beop.main = _main;
}(beop || (beop = {})));

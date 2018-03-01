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

    show = function (trans_id) {
        beop.main.prototype.init($(ElScreenContainer), trans_id);
    };
    close = function () {

    };

    init = function ($container, trans_id) {
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

            if (trans_id) {
                //如果是诊断查看工单详情
                jqueryMap.$main_menu.find('#wf-main-task').trigger('click');
                beop.view.taskDetail.init($('#wf-content'), 'show', trans_id);
            } else {
                //正常情况
                jqueryMap.$main_menu.find('#wf-main-task').trigger('click');
            }

            //------------Event
        }).always(function () {
            Spinner.stop();
        });
    };

    var _main = function (trans_id) {
        this.trans_id = trans_id;
    };
    _main.prototype = {
        init: init,
        show: function () {
            show(this.trans_id);
        },
        close: close
    };

    beop.main = _main;
}(beop || (beop = {})));

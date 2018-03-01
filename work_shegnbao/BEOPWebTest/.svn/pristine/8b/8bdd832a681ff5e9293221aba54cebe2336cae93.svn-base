(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/activity.html',
            settable_map: {
                activities_number: true,
                activities_model: true,
                transactions_model: true,
                reply_mode: true
            },

            activities_number: 20,

            activities_model: null,
            transactions_model: null,
            reply_mode: null
        },
        stateMap = {
            //一次加载5个 activities
            getActivitiesStepAmount: 5,
            maxIMGWidth: $('body').width() / 2
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init,
        renderActivities,
        onChangeActivities,
        onReplyFocusout, onReplyFocusin, onReplySubmit, onTaskClick, onUserClick, onGetMoreActivitiesClick, getDataActivities, bindImgZoom, imgZoom;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $wf_activity_container: $container.find('.wf-activity-container'),
            //需要独立一个 container-box 来渲染 activity
            $wf_activity_container_box: $container.find('.wf-activity-container-box'),
            //没有activity的话那个提示图片
            $wf_activity_empty: $container.find('.wf-activity-empty'),
            //加载更多按钮
            $wf_activity_getMore: $container.find('.wf-activity-get-more').find('button')
        };
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container, notPubEvent) {
        stateMap.$container = $container;
        $.spEvent.subEvent(stateMap.$container, 'wf-activities-change', onChangeActivities);

        return WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            jqueryMap.$wf_activity_container.on('focusout', '.reply-text-area', onReplyFocusout);
            jqueryMap.$wf_activity_container.on('focusin', '.reply-text-area', onReplyFocusin);
            jqueryMap.$wf_activity_container.on('submit', 'form.add-reply-form', onReplySubmit);
            jqueryMap.$wf_activity_container.on('click', '.task-name', onTaskClick);
            jqueryMap.$wf_activity_container.on('click', '.task-user', onUserClick);
            //给加载更多绑定事件
            bindImgZoom();
            jqueryMap.$wf_activity_getMore.on('click', onGetMoreActivitiesClick);
            !notPubEvent && $.spEvent.pubEvent('wf-activities-change', 'today');
        });
    };

    //---------DOM操作------

    //TODO 加入模板操作
    renderActivities = function () {
        if (beop.model.stateMap.activities.length != 0) {
            //如果存在 activities
            Spinner.spin(jqueryMap.$wf_activity_container.parent().get(0));
            jqueryMap.$wf_activity_container_box.html(beopTmpl('tpl_wf_activity', {
                activities: getDataActivities(),
                getActivitiesStepAmount: stateMap.getActivitiesStepAmount,
                stateMap: stateMap,
                //是否显示那个 .wf-activity-position
                showPosition: true
            }));
            Spinner.stop();
        } else if (beop.model.stateMap.activities.length == 0 && beop.model.stateMap.backup_activities.length != 0) {
            Spinner.spin(jqueryMap.$wf_activity_container.parent().get(0));
            //如果不存在 activities  存在 backup_activities
            var emptyActivity = beopTmpl('tpl_wf_activity_empty', {
                stateMap: stateMap,
                showPosition: true
            });
            switch (stateMap.activity_type) {
                //昨日没有就显示本周的
                case 'yesterday':
                    stateMap.activity_type = 'thisWeek';
                    break;
                //今日没有就显示昨天的
                case 'today':
                    stateMap.activity_type = 'yesterday';
                    break;
            }
            var backupActivities = beopTmpl('tpl_wf_activity', {
                activities: beop.model.stateMap.backup_activities ? beop.model.stateMap.backup_activities : [],
                //这里也设定了一个加载数量
                getActivitiesStepAmount: stateMap.getActivitiesStepAmount,
                stateMap: stateMap,
                showPosition: true
            });
            jqueryMap.$wf_activity_container.html(emptyActivity + backupActivities);
            Spinner.stop();
        } else {
            //如果都不存在
            Spinner.spin(jqueryMap.$wf_activity_container.parent().get(0));
            jqueryMap.$wf_activity_container.html(beopTmpl('tpl_wf_activity_empty', {
                stateMap: stateMap,
                showPosition: false
            }));
            Spinner.stop();
        }
        //显示加载更多按钮
        if (beop.model.stateMap.activities.length > stateMap.getActivitiesStepAmount) {
            jqueryMap.$wf_activity_getMore.parent().show();
        }
        //给图片绑定点击放大事件
        bindImgZoom();
        I18n.fillArea(jqueryMap.$container);
    };
//加载更多
    onGetMoreActivitiesClick = function () {
        jqueryMap.$wf_activity_container_box.append(beopTmpl('tpl_wf_activity', {
            activities: getDataActivities(),
            getActivitiesStepAmount: stateMap.getActivitiesStepAmount,
            stateMap: stateMap,
            //加载更多的时候不显示  .wf-activity-position
            showPosition: false
        }));
        bindImgZoom();
        I18n.fillArea(jqueryMap.$wf_activity_container_box);
    };
//---------方法---------
    getDataActivities = function () {
        //提前保存一份当前的 activities
        var activitiesData = beop.model.stateMap.activities ? beop.model.stateMap.activities : [];
        if (activitiesData.length <= stateMap.getActivitiesStepAmount) {
            //当存在的 activities 数组数量 小于 一次加载的个数的时候
            //加载更多按钮重新绑定事件
            /*jqueryMap.$wf_activity_getMore.off().on('click', function () {
             Alert.danger(ElScreenContainer, '没有更多内容了').showAtTop(300);
             return false;
             });*/
            jqueryMap.$wf_activity_getMore.parent().hide();
            //返回出去当前数组
            return activitiesData;
        } else {
            //返回当前数组的前几个并且数组删除前几个
            jqueryMap.$wf_activity_getMore.parent().show();
            return activitiesData.splice(0, stateMap.getActivitiesStepAmount);
        }
    };

    bindImgZoom = function () {
        jqueryMap.$wf_activity_IMGZoom = jqueryMap.$container.find('.media-body img');
        jqueryMap.$wf_activity_IMGZoom.each(function () {
            var $this = $(this);
            $this.on('load', function () {
                if ($this.context.naturalWidth >= stateMap.maxIMGWidth) {
                    $this.off().on('click', imgZoom);
                    $this.css('cursor', '-webkit-zoom-in')
                }
            });
        });
    };
    imgZoom = function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        var imgSRC = $(this).attr('src'),
            $body = $('body'),
            $htmlMask = $('<div id="wf-img-zoom" class=""><img style="cursor: -webkit-zoom-out;" src="' + imgSRC + ' "/> </div>');
        $htmlMask.off().on('click', function () {
            $(this).remove();
        });
        $body.append($htmlMask);
    };
//---------事件---------

    onChangeActivities = function (event, type, startTime) {
        configMap.activities_model.getActivities(type, startTime).done(function () {
            stateMap.activity_type = type;
            renderActivities();
            bindImgZoom();
        });
    };

    onReplyFocusin = function () {
        var $this = $(this);
        $this.closest('.wf-activity-comment').find('.reply-btn-wrapper').slideDown();
    };

    onReplyFocusout = function () {
        var $this = $(this);
        $this.closest('.wf-activity-comment').find('.reply-btn-wrapper').slideUp();
    };

    onReplySubmit = function () {
        var $form = $(this);
        configMap.reply_mode.insertReply($form.serializeObject()).done(function (result) {
            if (result.success) {
                Alert.success(ElScreenContainer, 'reply success!').showAtTop(2000);
                $.spEvent.pubEvent('wf-activities-change', stateMap.activity_type);
            }
        });
    };

    onTaskClick = function () {
        var $this = $(this), trans_id = $this.data('trans-id');
        if (!trans_id) {
            return false;
        }
        beop.view.returnActivitiesList = jqueryMap.$container.children().detach();
        beop.view.taskDetail.configModel({
            canClose: true,
            canBack: true,
            whereBack: 'activities'
        });
        beop.view.taskDetail.init(jqueryMap.$container, 'show', trans_id);
        return false;
    };

    onUserClick = function () {
        var $this = $(this), user_id = $this.data('user-id');
        beop.view.taskList.configModel({
            enableBack: true
        });
        beop.view.taskList.init(jqueryMap.$container).done(function () {
            $.spEvent.pubEvent('wf-task-list', ['joinedBy', user_id]);
        });
    };

//---------Exports---------
    beop.view = beop.view || {};
    beop.view.activities = {
        configModel: configModel,
        init: init
    };
})
(beop || (beop = {}));


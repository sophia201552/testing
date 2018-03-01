(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/activity.html',
            settable_map: {
                activities_number: true,
                activities_model: true,
                transactions_model: true,
                reply_mode: true
            },
            activities_number: null,
            activities_model: null,
            transactions_model: null,
            reply_mode: null
        },
        stateMap = {
            maxIMGWidth: $('body').width() / 2,
            page: 1,
            activityType: {
                "yesterday": 0,
                "today": 1,
                "thisWeek": 2,
                "thisMonth": 3,
                latestCompleted: '4',
                latestCreated: '5'
            }
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init,
        renderActivities,
        onChangeActivities,
        onReplyFocusout, onReplyFocusin, onReplySubmit, onTaskClick, onUserClick, onGetMoreActivitiesClick, bindImgZoom, imgZoom;

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
            //关闭留言
            jqueryMap.$wf_activity_container.on('click', '.wf-close-replay-box', onReplyFocusout);
            //jqueryMap.$wf_activity_container.on('focusout', '.reply-text-area', onReplyFocusout);
            //打开留言
            jqueryMap.$wf_activity_container.on('click', '.wf-open-replay-box', onReplyFocusin);
            //jqueryMap.$wf_activity_container.on('focusin', '.reply-text-area', onReplyFocusin);
            jqueryMap.$wf_activity_container.on('submit', 'form.add-reply-form', onReplySubmit);
            jqueryMap.$wf_activity_container.on('click', '.task-name', onTaskClick);
            jqueryMap.$wf_activity_container.on('click', '.task-user', onUserClick);
            //给加载更多绑定事件
            bindImgZoom();
            !notPubEvent && $.spEvent.pubEvent('wf-activities-change',
                stateMap.activityType.today,
                configMap.activities_number
            );
        });
    };

    //---------DOM操作------

    //TODO 加入模板操作
    renderActivities = function () {
        Spinner.spin(jqueryMap.$wf_activity_container.parent().get(0));
        if (beop.model.stateMap.activities.totalCount > 0) {
            //如果存在 activities
            var html = beopTmpl('tpl_wf_activity_empty', {
                    stateMap: stateMap,
                    showPosition: true,
                    noData: false
                }) + beopTmpl('tpl_wf_activity', {
                    activities: beop.model.stateMap.activities.msg.reverse(),
                    stateMap: stateMap,
                    //是否显示那个 .wf-activity-position
                    showPosition: true
                });

            jqueryMap.$wf_activity_container_box.html(html);

            //显示加载更多按钮
            if (jqueryMap.$container.find(".wf-activity-person-box").length < beop.model.stateMap.activities.totalCount) {
                jqueryMap.$wf_activity_getMore.parent().show();
            }

            bindImgZoom();
            Spinner.stop();
        } else {
            //如果都不存在
            jqueryMap.$wf_activity_container.html(beopTmpl('tpl_wf_activity_empty', {
                stateMap: stateMap,
                showPosition: beop.model.stateMap.activities.activity_type >= 4,
                noData: true
            }));
            Spinner.stop();
        }
        I18n.fillArea(jqueryMap.$container);
    };
//加载更多
    onGetMoreActivitiesClick = function () {
        stateMap.page += 1;
        configMap.activities_model.getActivities(beop.model.stateMap.activities.activity_type, stateMap.page).done(function (result) {
            if (result.success) {
                beop.model.stateMap.activities.msg = beop.model.stateMap.activities.msg.concat(result.data.msg);
                jqueryMap.$wf_activity_container_box.html(beopTmpl('tpl_wf_activity', {
                    activities: beop.model.stateMap.activities.msg,
                    stateMap: stateMap,
                    //加载更多的时候不显示  .wf-activity-position
                    showPosition: false
                }));
                bindImgZoom();
                //显示加载更多按钮
                if (jqueryMap.$container.find(".wf-activity-person-box").length < beop.model.stateMap.totalCount) {
                    jqueryMap.$wf_activity_getMore.parent().show();
                } else {
                    jqueryMap.$wf_activity_getMore.parent().hide();
                }
                jqueryMap.$wf_activity_getMore.off().on('click', onGetMoreActivitiesClick);
                I18n.fillArea(jqueryMap.$wf_activity_container_box);
            }
        }).fail(function () {
            stateMap.page -= 1
        });
    };
//---------方法---------
    bindImgZoom = function () {
        jqueryMap.$wf_activity_IMGZoom = jqueryMap.$container.find('.media-body img');
        jqueryMap.$wf_activity_IMGZoom.each(function () {
            var $this = $(this);
            $this.on('load', function () {
                if ($this.context.naturalWidth >= stateMap.maxIMGWidth) {
                    $this.off().on('click', imgZoom);
                    $this.css({
                        cursor: '-webkit-zoom-in',
                        maxWidth: '30%'
                    })
                }
            });
        });
        jqueryMap.$container.find('.wf-activity-person-avatar-body').find('img').each(function () {
            var $this = $(this);
            $this.on('load', function () {
                if ($this.context.naturalWidth >= stateMap.maxIMGWidth) {
                    $this.off().on('click', imgZoom);
                    $this.css({
                        cursor: '-webkit-zoom-in',
                        maxWidth: '50%'
                    })
                }
            });
        })
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

    onChangeActivities = function (event, type, page) {
        configMap.activities_model.getActivities(stateMap.activityType[type], page).done(function () {
            stateMap.activity_type = type;
            stateMap.page = page;
            renderActivities();
            bindImgZoom();
            jqueryMap.$wf_activity_getMore.off().on('click', onGetMoreActivitiesClick);
        });
    };

    onReplyFocusin = function () {
        var $this = $(this);
        //$this.closest('.wf-activity-comment').find('.reply-btn-wrapper').slideDown();
        $this.parent().next().slideDown();
        $this.parent().find('.wf-close-replay-box').removeClass('dn');
        $this.addClass('dn-important');
    };

    onReplyFocusout = function () {
        var $this = $(this);
        $this.parent().next().slideUp();
        $this.parent().find('.wf-open-replay-box').removeClass('dn-important');
        $this.addClass('dn');
        //$this.closest('.wf-activity-comment').find('.reply-btn-wrapper').slideUp();
    };

    onReplySubmit = function () {
        var $form = $(this);
        configMap.reply_mode.insertReplyToComment($form.serializeObject()).done(function (result) {
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


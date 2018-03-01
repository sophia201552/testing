(function (beop) {
    var configMap = {
            componentURL: '/static/views/workflow/components/task.reply.list.html',
            settable_map: {
                transactions_model: true,
                reply_mode: true
            },
            transactions_model: null,
            reply_mode: null
        },
        stateMap = {
            maxIMGWidth: $('body').width() / 2,
            UEEditorDefaultContent: '',
            UEContainer: ''
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, onReplySubmit, refreshReply, bindImgZoom, imgZoom, deleteReply, initUE;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $wf_reply_table: $container.find("#wf-reply-table"),
            $wf_editor: $container.find('#wf-editor'),
            $wf_btn_reply: $container.find('#wf-btn-reply'),
            $wf_detail_comment: $container.find("#wf-detail-comment")
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

    init = function ($container) {
        stateMap.$container = $container;
        stateMap.$container.show();
        setJqueryMap();
        WebAPI.get(configMap.componentURL + '?=' + new Date().getTime().toString(16)).done(function (html) {
            stateMap.$container.html(html);
            configMap.reply_mode.getTaskReply().done(function (result) {
                if (result.success) {
                    $container.find('#wf-reply-table').empty().html(beopTmpl('tpl_reply_table_body', {comment: (result.data && result.data.comment) || []}));
                    setTimeout(function () {
                        bindImgZoom('new');
                    }, 0);
                    setJqueryMap();
                    initUE();
                    jqueryMap.$wf_btn_reply.off().on("click", onReplySubmit);
                    $container.find('#wf-reply-table').off('.delete-btn').on('click', '.delete-btn', deleteReply)
                }
            }).always(function () {
                I18n.fillArea($container);
            });
        });
    };

    //---------DOM操作------


    //---------方法---------
    initUE = function () {
        var UEEditor;
        UEEditor = new UE.ui.Editor({
            lang: (I18n.type == 'zh' ? 'zh-cn' : 'en'),
            initialFrameHeight: '250',
            initialFrameWidth: null,
            enableAutoSave: false,
            saveInterval: 5000000000000000
        });
        UEEditor.setOpt(window.UEDITOR_CONFIG.toolbars);
        UEEditor.render(jqueryMap.$wf_editor.get(0));
        UEEditor.ready(function () {
            //设置编辑器的内容
            UE.insertPic(this);//绑定插入图片事件
            beop.model.stateMap.UEInstance = UEEditor;
            UEEditor.setContent(stateMap.UEEditorDefaultContent);
        });
    };
    refreshReply = function () {
        configMap.reply_mode.getTaskReply().done(function (result) {
            if (result.success) {
                jqueryMap.$container.find('#wf-reply-table').empty().html(beopTmpl('tpl_reply_table_body', {comment: result.data.comment.reverse()}));
                setTimeout(function () {
                    bindImgZoom('new');
                }, 0);
            }
        });
    };
    bindImgZoom = function (type) {
        var imgList = jqueryMap.$container.find('#wf-reply-table').find('.wf-reply-info img');
        if (type === 'new') {
            imgList.eq(0).off().on('load', function () {
                var $this = $(this);
                if ($this.context.naturalWidth > stateMap.maxIMGWidth) {
                    $this.off().on('click', imgZoom);
                    $this.css({
                        cursor: '-webkit-zoom-in',
                        maxWidth: '50%'
                    })
                }
            });
            imgList.each(function () {
                var $this = $(this);
                if ($this.context.naturalWidth > stateMap.maxIMGWidth) {
                    $this.off().on('click', imgZoom);
                    $this.css({
                        cursor: '-webkit-zoom-in',
                        maxWidth: '50%'
                    })
                }
            })
        } else {
            imgList.each(function () {
                var $this = $(this);
                $this.off().on('load', function () {
                    if ($this.context.naturalWidth > stateMap.maxIMGWidth) {
                        $this.off().on('click', imgZoom);
                        $this.css('cursor', '-webkit-zoom-in');
                        $this.css({
                            cursor: '-webkit-zoom-in',
                            maxWidth: '50%'
                        })
                    }
                });
            })
        }
    };
    //---------事件---------
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
    onReplySubmit = function (e) {
        var val = $.trim(beop.model.stateMap.UEInstance.getContent());
        if (!val) {
            e.preventDefault();
            e.stopPropagation();
            alert(I18n.resource.workflow.main.REPLY_ALERT_INFO);
        } else {
            Spinner.spin(ElScreenContainer);
            configMap.reply_mode.insertTaskReply({
                'content': val
            }).done(function (result) {
                if (result.success) {
                    Spinner.stop();
                    beop.model.stateMap.UEInstance.setContent('');
                    refreshReply();
                }
            });
        }
    };
    deleteReply = function () {
        var $this = $(this), commentId = $this.data('reply-id');
        if (commentId) {
            Spinner.spin(jqueryMap.$wf_reply_table.get(0));
            configMap.reply_mode.deleteTaskReply({
                commentId: commentId,
                taskId: beop.model.stateMap.cur_trans.id
            }).done(function (result) {
                if (result.success) {
                    Alert.success(ElScreenContainer, I18n.resource.common.DELETE_SUCCESS).showAtTop(300);
                    refreshReply();
                }
            }).fail(function () {
                Alert.danger(ElScreenContainer, I18n.resource.common.DELETE_FAIL).showAtTop(300);
            }).always(function () {
                Spinner.stop();
            })
        }
    };
    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.replyList = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

(function (beop) {
    var configMap = {
            htmlURL: '',
            settable_map: {
                transactions_model: true,
                reply_mode: true
            },
            transactions_model: null,
            reply_mode: null
        },
        stateMap = {
            maxIMGWidth: $('body').width() / 2
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, onReplySubmit, refreshReply, bindImgZoom, imgZoom, deleteReply;

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
        configMap.transactions_model.getReply().done(function (result) {
            if (result.success) {
                $container.empty().html(beopTmpl('tpl_detail_reply', result));
                $container.find('#wf-reply-table').empty().html(beopTmpl('tpl_reply_table_body', result));
                setJqueryMap();
                jqueryMap.$wf_editor.wysiwyg();
                jqueryMap.$wf_btn_reply.off().on("click", onReplySubmit);
                bindImgZoom();
                $container.find('#wf-reply-table').off('.delete-btn').on('click', '.delete-btn', deleteReply)
            }
        }).always(function () {
            I18n.fillArea($container);
        });
    };

    //---------DOM操作------


    //---------方法---------
    refreshReply = function () {
        configMap.transactions_model.getReply().done(function (result) {
            if (result.success) {
                jqueryMap.$container.find('#wf-reply-table').html(beopTmpl('tpl_reply_table_body', result));
                setTimeout(function () {
                    bindImgZoom('new');
                }, 0)
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
    onReplySubmit = function () {
        var val = $.trim(jqueryMap.$wf_editor.html());
        if (!val) {
            alert('reply can\'t be empty');
        }
        configMap.reply_mode.insertReply({
            'detail': val
        }).done(function (result) {
            if (result.success) {
                jqueryMap.$wf_editor.html('');
                refreshReply();
            }
        });
    };
    deleteReply = function () {
        var $this = $(this), replyId = $this.data('reply-id');
        if (replyId) {
            Spinner.spin(jqueryMap.$wf_reply_table.get(0));
            configMap.reply_mode.deleteReply(AppConfig.userId,{
                "reply_id": replyId
            }).done(function (result) {
                if (result.success) {
                    Alert.success(ElScreenContainer, '删除成功').showAtTop(300);
                    beop.view.replyList.init(jqueryMap.$container);
                }
            }).fail(function () {
                Alert.danger(ElScreenContainer, '删除失败').showAtTop(300);
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

(function (beop) {
    var configMap = {
            htmlURL: '/static/scripts/dataManage/views/dm.tagBox.html',
            cb_on_click: $.noop,
            settable_map: {
                cb_on_click: true
            }
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, bindEvent, getTagByType, getTagByHot;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container
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
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            getTagByType();
            bindEvent();
        });
        //$.spEvent.subEvent(stateMap.$container, 'wf-task-list', loadTaskList);
    };

    //---------DOM操作------

    bindEvent = function () {
        var _this = this;
        jqueryMap.$container.off('click.getTagByType').on('click.getTagByType', '#tagByType', function () {
            $('#tagByType').addClass('active').siblings().removeClass('active');
            $('#tagContent').html(beopTmpl('tpl_show_Tag_by_type', {list: _this.typeTags}));
        });
        jqueryMap.$container.off('click.getTagByCommon').on('click.getTagByCommon', '#tagByCommon', function () {
            $('#tagByCommon').addClass('active').siblings().removeClass('active');
            if (_this.hotTags) {
                $('#tagContent').html(beopTmpl('tpl_show_Tag_by_Common', {list: _this.hotTags}));
            } else {
                getTagByHot().done(function () {
                    $('#tagContent').html(beopTmpl('tpl_show_Tag_by_Common', {list: _this.hotTags}));
                })
            }
        });
        jqueryMap.$container.off('click.tag-item').on('click.tag-item', '.tag-item', function () {
            var $this = $(this);
            configMap.cb_on_click($this.attr('tag'));
        });

        jqueryMap.$container.off('click.tagType').on('click.tagType', '.tagType', function () {
            $(this).closest('.tagTypeBox').toggleClass('active');
        });

        jqueryMap.$container.off('keyup.tagSearchValue').on('keyup.tagSearchValue', '#tagSearchValue', function (e) {
            if (e.which !== 13) {
                return;
            }
            var searchValue = $(this).val().trim();
            if (!searchValue) {
                return;
            }
            var searchArr = searchValue.split(/\s+/g);
            if ($('#tagByType').hasClass('active')) {
                var searchTypeResult = $.extend(true, [], _this.typeTags);
                for (var i = 0; i < searchTypeResult.length; i++) {
                    var tags = searchTypeResult[i].tags;
                    for (var j = 0; j < tags.length; j++) {
                        var isContain = false;
                        for (var k = 0; k < searchArr.length; k++) {
                            if (tags[j].name.toLowerCase().indexOf(searchArr[k].toLowerCase()) != -1) {
                                isContain = true;
                            }
                        }
                        if (!isContain) {
                            tags.splice(j, 1);
                            j--;
                        }
                    }
                    if (!tags.length) {
                        searchTypeResult.splice(i, 1);
                        i--;
                    }
                }
                $('#tagContent').html(beopTmpl('tpl_show_Tag_by_type', {list: searchTypeResult}));
            } else {
                var searchHotResult = $.extend(true, [], _this.hotTags);
                for (var i = 0; i < searchHotResult.length; i++) {
                    var isContain = false;
                    var tags = searchHotResult[i];
                    for (var k = 0; k < searchArr.length; k++) {
                        if (tags.name.toLowerCase().indexOf(searchArr[k].toLowerCase()) != -1) {
                            isContain = true;
                        }
                    }
                    if (!isContain) {
                        searchHotResult.splice(i, 1);
                        i--;
                    }
                }
                $('#tagContent').html(beopTmpl('tpl_show_Tag_by_Common', {list: searchHotResult}));
            }
        })
    };

    //---------方法---------

    //---------事件---------
    getTagByHot = function () {
        var _this = this;
        return WebAPI.post('/tag/hot/', {}).done(function (result) {
            if (result.success) {
                _this.hotTags = result.data;
            } else {
                alert.danger('errer:' + result.msg);
            }
        });
    };
    getTagByType = function () {
        var _this = this;
        return WebAPI.get('/tag/dict/').done(function (result) {
            if (result.success) {
                _this.typeTags = result.data;
                $('#tagContent').html(beopTmpl('tpl_show_Tag_by_type', {list: result.data}));
            } else {
                alert.danger('errer:' + result.msg);
            }
        });
    };

    //---------Exports---------
    beop.tag = beop.tag || {};
    //TODO
    beop.tag.panel = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

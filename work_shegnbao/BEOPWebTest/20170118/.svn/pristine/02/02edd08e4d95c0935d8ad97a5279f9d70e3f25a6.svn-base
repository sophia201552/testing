(function (beop) {
    var configMap = {
            htmlURL: '/static/scripts/dataManage/views/dm.tagBox.html',
            cb_on_click: $.noop,
            multiple: false,
            settable_map: {
                cb_on_click: true,
                multiple: true
            }
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, bindEvent, getTagGroup, getHotTag, sortTagData;

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
            stateMap.getTags = getTagGroup();
            bindEvent();
        });
    };

    var tagCache = [];

    //---------DOM操作------

    bindEvent = function () {
        jqueryMap.$tagContent = jqueryMap.$container.find('#tagContent');
        jqueryMap.$container.off('click.getTagByType').on('click.getTagByType', '#tagByType', function () {
            tagCache = [];
            if (!$(this).hasClass('active')) {
                jqueryMap.$tagContent.empty().append(jqueryMap.$tagByTypeContent);
            }
            $('#tagByType').addClass('active').siblings().removeClass('active');
            jqueryMap.$tagContent.find('.tag-item').removeClass('selectedColor');
        });
        jqueryMap.$container.off('click.getTagByCommon').on('click.getTagByCommon', '#tagByCommon', function () {
            tagCache = [];
            jqueryMap.$tagByTypeContent = jqueryMap.$tagContent.children().detach();
            $('#tagByCommon').addClass('active').siblings().removeClass('active');
            jqueryMap.$tagContent.find('.tag-item').removeClass('selectedColor');
            if (stateMap.hotTags) {
                jqueryMap.$tagContent.html(beopTmpl('tpl_show_Tag_by_Common', {list: stateMap.hotTags}));
            } else {
                getHotTag().done(function () {
                    jqueryMap.$tagContent.html(beopTmpl('tpl_show_Tag_by_Common', {list: stateMap.hotTags}));
                })
            }
        });

        jqueryMap.$container.off('click.tag-item').on('click.tag-item', '.tag-item', function (e) {
            var $this = $(this);
            var tagName = $this.attr('tag').trim();
            if (configMap.multiple) {
                if ($this.hasClass('selectedColor')) {
                    if (!($.inArray(tagName, tagCache) == -1)) {
                        var index = $.inArray(tagName, tagCache);
                        tagCache.splice(index, 1);
                    }
                    $this.removeClass('selectedColor');
                } else {
                    if (e.ctrlKey) {
                        $this.addClass('selectedColor');
                        tagCache.push(tagName);
                    } else {
                        tagCache = [];
                        tagCache.push(tagName);
                        $this.closest('#tagContent').find('.tag-item').removeClass('selectedColor');
                        $this.addClass('selectedColor');
                    }
                }
            } else {
                tagCache = [];
                tagCache.push(tagName);
                $this.closest('#tagContent').find('.tag-item').removeClass('selectedColor');
                $this.addClass('selectedColor');
            }
            configMap.cb_on_click(getTagsByName(tagCache));
        });

        jqueryMap.$container.off('click.tagType').on('click.tagType', '.tagType', function () {
            $(this).closest('.tagTypeBox').toggleClass('active');
        });

        jqueryMap.$container.off('keyup.tagSearchValue').on('keyup.tagSearchValue', '#tagSearchValue', function (e) {
            var searchValue = $(this).val().trim();
            if (!searchValue) {
                if ($('#tagByType').hasClass('active')) {
                    jqueryMap.$tagContent.html(beopTmpl('tpl_show_Tag_by_type', {list: stateMap.tagGroups}));
                } else {
                    jqueryMap.$tagContent.html(beopTmpl('tpl_show_Tag_by_Common', {list: stateMap.hotTags}));
                }
                return;
            }
            if (e.which !== 13) {
                return;
            }
            var searchArr = searchValue.split(/\s+/g);
            if ($('#tagByType').hasClass('active')) {
                var searchTypeResult = $.extend(true, [], stateMap.tagGroups);
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
                jqueryMap.$tagContent.html(beopTmpl('tpl_show_Tag_by_type', {list: searchTypeResult}));
                jqueryMap.$tagContent.find('.tagTypeBox').addClass('active');
            } else {
                var searchHotResult = $.extend(true, [], stateMap.hotTags);
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
                jqueryMap.$tagContent.html(beopTmpl('tpl_show_Tag_by_Common', {list: searchHotResult}));
            }
        });

        window.onbeforeunload = function () {
            var $tagTypeBox = jqueryMap.$tagContent.find('.tagTypeBox'),
                hasActiveIndex = [];
            for (var i = 0; i < $tagTypeBox.length; i++) {
                if ($tagTypeBox.eq(i).hasClass('active')) {
                    hasActiveIndex.push(i);
                }
            }
            localStorage.setItem('hasActiveIndex', hasActiveIndex);
        };
    };

    //---------方法---------

    var makeTagMap = function () {
        stateMap.tagMap = {};
        for (var i = 0; i < stateMap.tagGroups.length; i++) {
            var tagGroup = stateMap.tagGroups[i];
            for (var j = 0; j < tagGroup.tags.length; j++) {
                stateMap.tagMap[tagGroup.tags[j].name.trim().toUpperCase()] = tagGroup.tags[j];
            }
        }
    };

    var getTagsByName = function (tagNms) {
        if (!tagNms) {
            return [];
        }
        if (!stateMap.tagMap) {
            requestDict();
        }
        var ret = [];
        for (var i = 0; i < tagNms.length; i++) {
            ret.push(stateMap.tagMap[tagNms[i].toUpperCase()]);
        }
        return ret;
    };
    var dictPromise;
    var requestDict = function () {
        if (!dictPromise) {
            dictPromise = $.ajax({
                url: '/tag/dict/',
                type: 'GET',
                contentType: 'application/json',
                async: false
            }).done(function (result) {
                if (result.success) {
                    stateMap.tagGroups = sortTagData(result.data);
                    makeTagMap();
                }
            });
        }
        return dictPromise;
    };

    //---------事件---------
    getHotTag = function () {
        return WebAPI.post('/tag/getCommon', {projId: AppConfig.projectId}).done(function (result) {
            if (result.success) {
                if (result.data && result.data.public) {
                    stateMap.hotTags = result.data.public.sort(function (a, b) {
                        return a.count > b.count;
                    });
                }
            } else {
                alert.danger('error:' + result.msg);
            }
        });
    };
    getTagGroup = function () {
        jqueryMap.$tagContent = jqueryMap.$container.find('#tagContent');
        return requestDict().done(function (result) {
            if (result.success) {
                jqueryMap.$tagContent.html(beopTmpl('tpl_show_Tag_by_type', {list: sortTagData(result.data)}));
                var $tagTypeBox = jqueryMap.$tagContent.find('.tagTypeBox');
                if (localStorage.getItem('hasActiveIndex')) {
                    var indexArray = localStorage.getItem('hasActiveIndex').split(',');
                    for (var i = 0; i < indexArray.length; i++) {
                        $tagTypeBox.eq(indexArray[i]).addClass('active');
                    }
                    localStorage.removeItem('hasActiveIndex');
                }
                $tagTypeBox.eq(0).addClass('active');
            } else {
                alert.danger('error:' + result.msg);
            }
        });
    };

    sortTagData = function (keyWordList) {
        // Equipment 第一, (Component, Physical Quantity, Media, Direction) 优先
        var tagList = [], sortList = ['Equipment', 'Component', 'Physical Quantity', 'Media', 'Direction'];
        var list = keyWordList.concat();
        for (var i = 0; i < list.length; i++) {
            var tag = list[i];
            if ($.inArray(tag.groupNm, sortList) == -1) {
                tagList.push(tag);
                list.splice(i--, 1);
            }
        }
        for (var i = 0; i < list.length; i++) {
            var tag = list[i];
            if (tag.groupNm != 'Equipment') {
                tagList.unshift(tag);
                list.splice(i--, 1);
            }
        }
        tagList.unshift(list[0]);
        return tagList;
    };

    var getTagMap = function () {
        if (!stateMap.tagMap) {
            requestDict();
        }
        return stateMap.tagMap;
    };

    var getTagsByType = function (type) {
        if (!stateMap.tagGroups) {
            requestDict();
        }
        for (var i = 0; i < stateMap.tagGroups.length; i++) {
            var tagGroup = stateMap.tagGroups[i];
            if (tagGroup.groupNm === type) {
                return tagGroup.tags;
            }
        }
    };

    //---------Exports---------
    beop.tag = beop.tag || {};

    beop.tag.panel = {
        configModel: configModel,
        init: init,
        getTagMap: getTagMap,
        getTagsByName: getTagsByName,
        getTagsByType: getTagsByType
    };
}(beop || (beop = {})));

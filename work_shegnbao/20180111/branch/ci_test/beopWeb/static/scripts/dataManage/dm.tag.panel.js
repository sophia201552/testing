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
        tagType = {
            sortTag: 'sortTag',
            commonTag: 'commonTag'
        },
        stateMap = {
            tagType: 'sortTag'
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, bindEvent, getTagGroup,
        searchTag, getHotTag, sortTagData;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $tagContent: $('#tagContent'),
            $sortTag: $('#sortTag'),
            $commonTag: $('#commonTag')
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
        jqueryMap.$container.off('click.getTagByType').on('click.getTagByType', '#tagByType', function () {
            var $this = $(this);
            if (!$this.hasClass('active')) {
                tagCache = [];
                stateMap.tagType = tagType.sortTag;
                jqueryMap.$commonTag.hide();
                jqueryMap.$sortTag.empty().append(jqueryMap.$tagByTypeContent).show();
                $this.addClass('active').siblings().removeClass('active');
                jqueryMap.$tagContent.find('.tag-item').removeClass('selectedColor');
            }
        });
        jqueryMap.$container.off('click.getTagByCommon').on('click.getTagByCommon', '#tagByCommon', function () {
            var $this = $(this);
            if (!$this.hasClass('active')) {
                tagCache = [];
                stateMap.tagType = tagType.commonTag;
                jqueryMap.$tagByTypeContent = jqueryMap.$sortTag.children().detach();
                jqueryMap.$sortTag.hide();
                jqueryMap.$commonTag.show();
                $this.addClass('active').siblings().removeClass('active');
                if (stateMap.hotTags) {
                    jqueryMap.$commonTag.html(beopTmpl('tpl_show_Tag_by_Common', {list: stateMap.hotTags.slice(0, 57)}));
                } else {
                    getHotTag().done(function () {
                        jqueryMap.$commonTag.html(beopTmpl('tpl_show_Tag_by_Common', {list: stateMap.hotTags.slice(0, 57)}));
                    })
                }
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

        jqueryMap.$container.off('click.tagSearchIcon').on('click.tagSearchIcon', '#tagSearchIcon', function () {
            var searchValue = $('#tagSearchValue').val().trim();
            searchTag(searchValue);
        });

        jqueryMap.$container.off('keyup.tagSearchValue').on('keyup.tagSearchValue', '#tagSearchValue', function (e) {
            var searchValue = $(this).val().trim();
            if (e.keyCode == 13) {
                searchTag(searchValue);
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
        Spinner.spin(jqueryMap.$commonTag.get(0));
        return WebAPI.post('/tag/getCommon', {projId: AppConfig.projectId}).done(function (result) {
            if (result.success) {
                if (result.data && result.data.public) {
                    stateMap.hotTags = result.data.public.sort(function (a, b) {
                        return b.count - a.count;
                    });
                }
            } else {
                alert.danger('error:' + result.msg);
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    searchTag = function (searchValue) {
        if (!searchValue) {
            if (stateMap.tagType == tagType.sortTag) {
                jqueryMap.$sortTag.html(beopTmpl('tpl_show_Tag_by_type', {list: stateMap.tagGroups}));
                var $tagTypeBox = jqueryMap.$sortTag.find('.tagTypeBox');
                for (var i = 0; i < $tagTypeBox.length; i++) {
                    if ($tagTypeBox.eq(i).attr('type') === 'Equipment') {
                        $tagTypeBox.eq(i).addClass('active');
                        break;
                    }
                }

            } else {
                jqueryMap.$commonTag.html(beopTmpl('tpl_show_Tag_by_Common', {list: stateMap.hotTags.slice(0, 57)}));
            }
        } else {
            var searchArr = searchValue.split(/\s+/g);
            if (stateMap.tagType == tagType.sortTag) {
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
                jqueryMap.$sortTag.html(beopTmpl('tpl_show_Tag_by_type', {list: searchTypeResult}));
                jqueryMap.$tagContent.find('.tagTypeBox').addClass('active');
            } else if (stateMap.tagType == tagType.commonTag) {
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
                jqueryMap.$commonTag.html(beopTmpl('tpl_show_Tag_by_Common', {list: searchHotResult}));
            }
        }
    };

    getTagGroup = function () {
        jqueryMap.$commonTag.hide();
        return requestDict().done(function (result) {
            if (result.success) {
                jqueryMap.$sortTag.html(beopTmpl('tpl_show_Tag_by_type', {list: sortTagData(result.data)}));
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
        // Equipment 第一, (Component, Physical, Media, Direction) 优先; Other放在后面;
        var priorList = [], otherList = [], Other = [], sortList = ['Equipment', 'Component', 'Physical', 'Media', 'Direction'];
        var list = keyWordList.concat();
        for (var i = 0; i < list.length; i++) {
            var tag = list[i];
            if ($.inArray(tag.groupNm, sortList) !== -1) {
                if (tag.groupNm == 'Equipment') {
                    priorList.unshift(tag);
                } else {
                    priorList.push(tag);
                }
            } else {
                if (tag.groupNm == 'Other') {
                    Other.push(tag);
                } else {
                    otherList.push(tag);
                }
            }
        }
        return priorList.concat(otherList, Other);
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

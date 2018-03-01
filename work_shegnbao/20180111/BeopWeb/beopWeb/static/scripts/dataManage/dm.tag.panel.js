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
            tagType: 'sortTag',
            latelyUseTag: {}
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, bindEvent, getTagGroup, allTagGroup,
        searchTag, getHotTag, sortTagData,showLatelyUseTag,storageOpenTag,restitution;

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

    var tagCache = [],latelyUseTag=[];

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
            storageOpenTag();
            localStorage.setItem('scrollTop', jqueryMap.$sortTag.scrollTop());
            configMap.cb_on_click(getTagsByName(tagCache),tagName);
        });

        jqueryMap.$container.off('click.tagType').on('click.tagType', '.tagType', function () {
            var $this = $(this);
            var $latelyUseTag = $this.closest('#latelyUseTag');
            $this.closest('.tagTypeBox').toggleClass('active');
            if ($latelyUseTag && $latelyUseTag.length) {
                jqueryMap.$sortTag.css('padding-top', $latelyUseTag.height());
            }
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
            storageOpenTag();
        };

        document.querySelector('#sortTag').addEventListener('scroll', function () {
            $('#latelyUseTag').css('top', $(this).scrollTop());
        });  
    };

    //---------方法---------

    var makeTagMap = function () {
        stateMap.tagMap = {};
        var tagAttr = [];
        var tagAttrBox = [];
        for (var i = 0; i < stateMap.tagGroups.length; i++) {
            var tagGroup = stateMap.tagGroups[i];
            tagGroup.tags && tagGroup.tags.length && tagAttrBox.push(tagGroup.tags);
            for (var j = 0; j < tagGroup.tags.length; j++) {
                if (tagGroup.tags[j].attrInputs && tagGroup.tags[j].attrInputs.length) {
                    tagAttr.push(tagGroup.tags[j].name.trim().toUpperCase());
                }
                stateMap.tagMap[tagGroup.tags[j].name.trim().toUpperCase()] = tagGroup.tags[j];
            }
        }
        stateMap.tagAttrBox = tagAttrBox;
        stateMap.tagAttr = tagAttr;
    };

    var getAllTagAttrBox = function () {
        var newTagAttr = [];
        stateMap.tagAttrBox.map(function (item) {
            newTagAttr = newTagAttr.concat(item);
        });
        return newTagAttr;
    };

    var getAllTagAttr = function () {
        return stateMap.tagAttr;
    };

    var allTagMsgArr = function () {
        if (!allTagGroup) {
            requestDict();
        }
        return allTagGroup;
    }

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
                url: '/tag/dict',
                type: 'GET',
                contentType: 'application/json',
                async: false
            }).done(function (result) {
                if (result.success) {
                    allTagGroup  = sortTagData(result.data);
                    stateMap.tagGroups = sortTagData(result.data);
                    makeTagMap();
                }
            });
        }
        return dictPromise;
    };
    //储存展开状态:
    storageOpenTag = function () {
        var $tagTypeBox = jqueryMap.$tagContent.find('.tagTypeBox.oldTagTyle'),
        hasActiveIndex = [];
        for (var i = 0; i < $tagTypeBox.length; i++) {
            if ($tagTypeBox.eq(i).hasClass('active')) {
                hasActiveIndex.push(i);
            }
        }
        localStorage.setItem('hasActiveIndex', hasActiveIndex);
    }; 

    // 恢复原先展开状态:
    restitution = function () {
        var $tagTypeBox = jqueryMap.$tagContent.find('.tagTypeBox.oldTagTyle');
        if (localStorage.getItem('hasActiveIndex')) {
            var indexArray = localStorage.getItem('hasActiveIndex').split(',');
            for (var i = 0; i < indexArray.length; i++) {
                $tagTypeBox.eq(indexArray[i]).addClass('active');
            }
            localStorage.removeItem('hasActiveIndex');
        }
    };
    //显示最近所打tag:
    showLatelyUseTag = function (tag) { 
        if (!latelyUseTag.length) {
            latelyUseTag.push(tag);
        } else if (latelyUseTag.length < 6) {
            if (latelyUseTag.indexOf(tag) == -1) {
                latelyUseTag.push(tag);
            }
        } else { 
            if (latelyUseTag.indexOf(tag) == -1) {
                latelyUseTag.push(tag);
                latelyUseTag.shift();
            }
        }
        var mewLatelyUseTagObj = {};
      
        stateMap.tagGroups.map(function (item) {
            for (var i = 0; i < item.tags.length;i++) { 
                if (latelyUseTag.indexOf(item.tags[i].name) !== -1) {
                        mewLatelyUseTagObj[item.tags[i].name] = {
                        name: item.tags[i].name,
                        zh: item.tags[i].zh,
                        en: item.tags[i].en,
                        icon: item.tags[i].icon
                    };
                }
            }
        });
        stateMap.latelyUseTag = {};
        latelyUseTag.forEach(function (item) { 
            if (!stateMap.latelyUseTag[item]) { 
                stateMap.latelyUseTag[item] = mewLatelyUseTagObj[item];
            }
        })
        jqueryMap.$sortTag.html(beopTmpl('tpl_show_Tag_by_type', { latelyUseTag: stateMap.latelyUseTag, list: stateMap.tagGroups }));
        I18n.fillArea($('#latelyUseTag'));
        restitution();
        if (Object.keys(stateMap.latelyUseTag).length) {
            var $latelyUseTag = $('#latelyUseTag');
            jqueryMap.$sortTag.css('padding-top', $latelyUseTag.height());
            if (localStorage.getItem('scrollTop')) {
                if (Number(localStorage.getItem('scrollTop')) > $latelyUseTag.height()) { 
                    $latelyUseTag.css('top', Number(localStorage.getItem('scrollTop')));
                }
                jqueryMap.$sortTag.css('padding-top', $latelyUseTag.height());
                jqueryMap.$sortTag.scrollTop(Number(localStorage.getItem('scrollTop')));
                localStorage.removeItem('scrollTop');
            }
        }
    }


    //---------事件---------
    getHotTag = function () {
        Spinner.spin(jqueryMap.$commonTag.get(0));
        return WebAPI.post('/tag/getCommon', {projId: AppConfig.projectId}).done(function (result) {
            if (result.success) {
                if (result.data && result.data.public) {
                    stateMap.hotTags = result.data.public.sort(function (a, b) {
                        return b.count - a.count;
                    });

                    //暂时存放常用tag数据;
                    var hotTagsTentative = [];
                    var hotTagName, hotTagCount, tagGroupsHot, tagInfo;
                    for (var i = 0; i < stateMap.hotTags.length; i++) {
                        hotTagName = stateMap.hotTags[i].name;
                        hotTagCount = stateMap.hotTags[i].count;
                        for (var k = 0; k < stateMap.tagGroups.length; k++) {
                            tagGroupsHot = stateMap.tagGroups[k].tags;
                            for (var j = 0; j < tagGroupsHot.length; j++) {
                                tagInfo = tagGroupsHot[j];
                                if (tagInfo.name == hotTagName) {
                                    hotTagsTentative.push({
                                        count: hotTagCount,
                                        name: tagInfo.name,
                                        zh: tagInfo.zh,
                                        en: tagInfo.en,
                                        type: tagInfo.type
                                    });
                                }
                            }
                        }
                    }
                    stateMap.hotTags = hotTagsTentative;
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
                jqueryMap.$sortTag.html(beopTmpl('tpl_show_Tag_by_type', { latelyUseTag: Object.keys(stateMap.latelyUseTag).length ? stateMap.latelyUseTag : {}, list: stateMap.tagGroups }));
                I18n.fillArea($('#latelyUseTag'));
                if (Object.keys(stateMap.latelyUseTag).length) {
                    jqueryMap.$sortTag.css('padding-top', $('#latelyUseTag').height());
                } else { 
                    jqueryMap.$sortTag.css('padding-top', 0);
                }
                var $tagTypeBox = jqueryMap.$sortTag.find('.tagTypeBox.oldTagTyle');
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
                            if (tags[j].zh.toLowerCase().indexOf(searchArr[k].toLowerCase()) != -1) {
                                isContain = true;
                            }
                            if (tags[j].en.toLowerCase().indexOf(searchArr[k].toLowerCase()) != -1) {
                                isContain = true;
                            }
                            if (tags[j].type.toLowerCase().indexOf(searchArr[k].toLowerCase()) != -1) {
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
                jqueryMap.$sortTag.html(beopTmpl('tpl_show_Tag_by_type', { latelyUseTag: {}, list: searchTypeResult }));
                jqueryMap.$sortTag.css('padding-top', 0);
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
                        if (tags.zh.toLowerCase().indexOf(searchArr[k].toLowerCase()) != -1) {
                            isContain = true;
                        }
                        if (tags.en.toLowerCase().indexOf(searchArr[k].toLowerCase()) != -1) {
                            isContain = true;
                        }
                        if (tags.type.toLowerCase().indexOf(searchArr[k].toLowerCase()) != -1) {
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
                jqueryMap.$sortTag.html(beopTmpl('tpl_show_Tag_by_type', {latelyUseTag: {},list: sortTagData(result.data)}));
                restitution();
                jqueryMap.$tagContent.find('.tagTypeBox.oldTagTyle').eq(0).addClass('active');
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
        allTagMsgArr: allTagMsgArr,
        configModel: configModel,
        init: init,
        getTagMap: getTagMap,
        getTagsByName: getTagsByName,
        getTagsByType: getTagsByType,
        getAllTagAttr: getAllTagAttr,
        getAllTagAttrBox: getAllTagAttrBox,
        showLatelyUseTag: showLatelyUseTag
    };
}(beop || (beop = {})));

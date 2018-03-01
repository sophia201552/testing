(function (beop) {
    var configMap = {
            htmlURL: '/static/scripts/dataManage/views/dm.keyword.html',
            cb_on_click: $.noop,
            prt: null,
            settable_map: {
                cb_on_click: true,
                prt: true
            }
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, bindEvent, sortingData, keySort, getKeywordsPram, dressingData;

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
        stateMap.keywordsForFolder = [];
        var Spinner = new LoadingSpinner({color: '#00FFFF'});

        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            Spinner.spin(stateMap.$container.find('#tagKeywordBox')[0]);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            WebAPI.post('/tag/ThingsName/keywords/get', {
                projId: AppConfig.projectId,
                limit: 40,
                Prt: configMap.prt || ''
            }).done(function (result) {
                if (result.success) {
                    if (result.data.length) {
                        $("#createFolderBox").show();
                        stateMap.rawData = dressingData(result.data);
                        stateMap.newData = sortingData(keySort(result.data));
                        if (result.data.length) {
                            $("#keywordsCount").parent().hide();
                        }
                        $("#keywordsCount").text(result.data.length);
                        $("#keywordsContent").empty().html(beopTmpl('tpl_tag_keywords_content', {
                            "result": stateMap.newData,
                            "value": stateMap.rawData.length
                        }));
                        $("#tagKeywordsUl").empty().html(beopTmpl('tpl_tag_keywords_li', {"list": stateMap.rawData}));
                        bindEvent();
                    }
                }
            }).always(function () {
                Spinner.stop();
            });
        });
    };

    dressingData = function (result) {
        var tagKeywords = beop.tag.panel.getTagMap();
        for (var key in tagKeywords) {
            for (var i = 0; i < result.length; i++) {
                if (key == result[i].key) {
                    result[i].type = tagKeywords[key].type;
                }
            }
        }
        return result;
    };

    keySort = function (result) {
        var keyValue = [],
            subData = [];
        for (var i = 0; i < result.length; i++) {
            keyValue.push(result[i].key);
        }
        keyValue.sort();
        for (var j = 0; j < keyValue.length; j++) {
            for (var m = 0; m < result.length; m++) {
                if (keyValue[j] == result[m].key) {
                    subData.push(result[m]);
                }
            }
        }
        return subData;
    };

    sortingData = function (keywordsData) {
        var keywordsBox = {};
        for (var i = 0; i < keywordsData.length; i++) {
            if (!keywordsBox[keywordsData[i].key.slice(0, 1).toLocaleUpperCase()]) {
                keywordsBox[keywordsData[i].key.slice(0, 1).toLocaleUpperCase()] = [];
            }
            var subKeywordData = {
                count: keywordsData[i].count,
                key: keywordsData[i].key,
                type: keywordsData[i].type
            };
            keywordsBox[keywordsData[i].key.slice(0, 1).toLocaleUpperCase()].push(subKeywordData);
        }
        return keywordsBox;
    };

    getKeywordsPram = function (selectType) {
        var postKeywordList = [];
        if (selectType === 'all') {
            for (var i = 0; i < stateMap.keywordsForFolder.length; i++) {
                postKeywordList.push([stateMap.keywordsForFolder[i]])
            }
        } else {
            postKeywordList.push(stateMap.keywordsForFolder);
        }
        return postKeywordList;
    };

    //---------DOM操作------

    bindEvent = function () {
        var $tagKeywordsUl = $("#tagKeywordsUl"),
            $selectFolderName = $("#selectFolderName"),
            $folderNameSelect = $("#folderNameSelect"),
            $folderNameText = $("#folderNameText"),
            $createTagsModal = $("#createTagsModal");
        $("#refineKeywordsUl").off('click.li').on('click.li', 'li', function () {
            $(this).addClass('keywordsActive').siblings().removeClass('keywordsActive');
            var index = $("#refineKeywordsUl").find('li').index($(this));
            var value = $(this).data('key');
            if (index == 0) {
                $tagKeywordsUl.empty().html(beopTmpl('tpl_tag_keywords_li', {"list": stateMap.rawData}));
            } else {
                $tagKeywordsUl.empty().html(beopTmpl('tpl_tag_keywords_li', {"list": stateMap.newData[value]}));
            }
            $tagKeywordsUl.scrollTop(0);
        });

        $tagKeywordsUl.off('click.li').on('click.li', 'li', function (e) {
            var $this = $(this);
            var index = $.inArray($this.data('key'), stateMap.keywordsForFolder);
            if (e.ctrlKey) {
                    if ($this.hasClass('active-create')) {
                        $this.removeClass('active-create');
                        stateMap.keywordsForFolder.splice(index, 1);
                    } else {
                        $this.addClass('active-create');
                        if (index == -1) {
                            stateMap.keywordsForFolder.push($this.data('key'));
                        }
                    }
            } else {
                $this.addClass('active-create').siblings().removeClass('active-create');
                stateMap.keywordsForFolder = [$this.data('key')];
            }
            configMap.cb_on_click(stateMap.keywordsForFolder);
        });

        $("#createFolderByTag").off().on('click', function () {
            if (!stateMap.keywordsForFolder.length) {
                alert('提示: 尚未选择创建目录的关键字. 请按住CTRL键后鼠标点击你想要创建目录的关键字!');
                return;
            }
            $folderNameSelect.empty().html(beopTmpl('tpl_tag_option', {"list": stateMap.keywordsForFolder}));
            $folderNameText.val('');
            $selectFolderName.find('.select-name[selectDom = "select"]').click();
            $createTagsModal.modal();
        });

        $selectFolderName.off('click.select-name').on('click.select-name', '.select-name', function () {
            if ($(this).attr('selectDom') === 'select') {
                $folderNameSelect.show();
                $folderNameText.hide();
            } else if ($(this).attr('selectDom') === 'input') {
                $folderNameSelect.hide();
                $folderNameText.show();
            } else if ($(this).attr('selectDom') === 'all') {
                $folderNameSelect.hide();
                $folderNameText.hide();
            }
        });

        $("#createTagsConfirm").off().on('click', function () {
            var folderNameList = [],
                prt = beop.tag.tree.getSelectTreeNode().length ? beop.tag.tree.getSelectTreeNode()[0]._id : '';
            var selectType = $('#createTagsModal').find('.select-name:radio:checked').attr('selectDom');
            if (selectType === 'select') {
                folderNameList.push($folderNameSelect.val());
            } else if (selectType === 'all') {
                for (var i = 0; i < stateMap.keywordsForFolder.length; i++) {
                    folderNameList.push(stateMap.keywordsForFolder[i])
                }
            } else if (selectType === 'input') {
                if ($folderNameText.val().trim() == '') {
                    alert.danger('目录名称不能为空!');
                    return;
                }
                folderNameList.push($folderNameText.val().trim());
            }

            Spinner.spin($createTagsModal.find('.modal-content').get(0));
            var postData = {
                name: folderNameList, // 创建的目录名
                keywords: getKeywordsPram(selectType), // 用于创建目录名的关键字列表,
                projId: AppConfig.projectId,
                Prt: prt
            };

            WebAPI.post('/tag/groupTree/createByKeywords', postData).done(function (result) {
                if (result.success) {
                    var node = beop.tag.tree.getSelectTreeNode()[0];
                    $createTagsModal.modal('hide');
                    if (node.folderType && node.folderType === 1) {
                        $("#tagTreeUl").find('li:eq(0) a').click();
                        beop.tag.tree.reAsyncParentNodes('refresh-tree');
                    } else {
                        $("#"+node.tId).children('a').click();
                        beop.tag.tree.reAsyncParentNodes(node.tId);
                    }
                }
            }).always(function () {
                Spinner.stop();
            });
        });
    };

    //---------方法---------


    //---------事件---------


    //---------Exports---------
    beop.tag = beop.tag || {};
    beop.tag.keywords = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

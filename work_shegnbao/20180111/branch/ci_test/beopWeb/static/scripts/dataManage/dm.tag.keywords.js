(function (beop) {
    var configMap = {
            htmlURL: '/static/scripts/dataManage/views/dm.keyword.html',
            cb_on_click: $.noop,
            cb_on_mousedown: $.noop,
            prt: null,
            settable_map: {
                cb_on_click: true,
                cb_on_mousedown: true,
                prt: true
            }
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, bindEvent, unbindEvent, sortingData, keySort, getKeywordsPram, dressingData, moveUpEquipment, disposeSameFolder, dealNextSameFolder,
        adjustNodesData, dealNotMatchCount;

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
        stateMap.$curKeyArr = null;
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
                        stateMap.$curKeyArr = $('#refineKeywordsUl').find('.allKeywords');
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
                if (key == result[i].key.toUpperCase()) {
                    result[i].type = tagKeywords[key].type;
                }
            }
        }
        return moveUpEquipment(result);
    };
    //设备提前
    moveUpEquipment = function (result) {
        var equipment = [],
            notEquipment = [];
        result.forEach(function (item) {
            if (item.type && item.type == 'Equipment') {
                equipment.push(item);
            } else {
                notEquipment.push(item);
            }
        });
        return equipment.concat(notEquipment);
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

    getKeywordsPram = function (selectType, notSameFolderNameList) {
        var postKeywordList = [];
        if (notSameFolderNameList.length) {
            if (selectType === 'all') {
                for (var i = 0; i < stateMap.keywordsForFolder.length; i++) {
                    if (notSameFolderNameList.indexOf(stateMap.keywordsForFolder[i]) !== -1) {
                        postKeywordList.push([stateMap.keywordsForFolder[i]]);
                    }
                }
            } else {
                postKeywordList.push(stateMap.keywordsForFolder);
            }
        }
        return postKeywordList;
    };

    disposeSameFolder = function (sameName, $createTagsModal, prt, selectType) {
        if (sameName[0]) {
            infoBox.confirm('"(' + sameName[0] + ')"' + I18n.resource.tag.edit.SAME_NAME_TITLE, function () {
                var postData = {
                    name: ['' + sameName[0] + ''],
                    keywords: selectType !== 'all' ? [stateMap.keywordsForFolder] : ['' + sameName[0] + ''],
                    projId: AppConfig.projectId,
                    Prt: prt
                };
                Spinner.spin($createTagsModal.find('.modal-content').get(0));
                WebAPI.post('/tag/groupTree/createByKeywords', postData).done(function (result) {
                    if (result.success) {
                        if (result.data && result.data.length) {
                            var node = beop.tag.tree.getSelectTreeNode()[0];
                            $createTagsModal.modal('hide');
                            sameName.splice(0, 1);
                            if (sameName.length) {
                                if (node.folderType && node.folderType === 1) {
                                    adjustNodesData(result.data[0]);
                                } else {
                                    dealNotMatchCount(node);
                                }
                                dealNextSameFolder(sameName, $createTagsModal, prt, selectType);
                            } else {
                                if (node.folderType && node.folderType === 1) {
                                    $("#tagTreeUl").find('li:eq(0) a').click();
                                    adjustNodesData(result.data[0]);
                                } else {
                                    dealNotMatchCount(node);
                                }
                            }
                        }
                    }
                }).always(function () {
                    Spinner.stop();
                });
            }, function () {
                $createTagsModal.modal('hide');
                var node = beop.tag.tree.getSelectTreeNode()[0];
                if (node.folderType && node.folderType === 1) {
                    $("#tagTreeUl").find('li:eq(0) a').click();
                } else {
                    $("#" + node.tId).children('a').click();
                }
            })
        }
    };
    adjustNodesData = function (prt) {
        $.ajax({
            url: '/tag/thingTree/detail',
            type: 'POST',
            async: false,
            data: JSON.stringify({
                'Prt': prt,
                'projId': AppConfig.projectId,
                'limit': 1000,
                'skip': 1
            }),
            contentType: 'application/json'
        }).done(function (newNodeDetail) {
            if (newNodeDetail.success) {
                var newNode = beop.tag.tree.getNodeById(prt);
                if (!newNode) {
                    return;
                }
                newNode.pointCount = newNodeDetail.data.count;
                if (newNodeDetail.data && newNodeDetail.data.detailList && newNodeDetail.data.detailList.length) {
                    newNodeDetail.data.detailList.forEach(function (item) {
                        if (item.type == 'group') {
                            newNode.pointCount = newNode.pointCount - 1 + item.count;
                        }
                    })
                }
                newNode.noGroupPointCount = newNode.pointCount;
                var newPointNum = '(' + newNode.noGroupPointCount + '/' + newNode.pointCount + ')';
                newNode.name = newNode.originName + newPointNum;
                beop.tag.tree.updateNode(newNode);
            }
        });
    };

    dealNextSameFolder = function (sameFolderName, $createTagsModal, prt, selectType) {
        disposeSameFolder(sameFolderName, $createTagsModal, prt, selectType);
    };

    dealNotMatchCount = function (node) {
        $.ajax({
            url: '/tag/thingTree/detail',
            type: 'POST',
            async: false,
            data: JSON.stringify({
                'Prt': node._id,
                'projId': AppConfig.projectId,
                'limit': 1000,
                'skip': 1
            }),
            contentType: 'application/json'
        }).done(function (result) {
            if (result.success) {
                console.log(result.data);
                var notMatchCount = 0;
                if (result.data.detailList && result.data.detailList.length) {
                    result.data.detailList.forEach(function (item) {
                        if (item.type == 'thing') {
                            notMatchCount++;
                        }
                    });
                    node.noGroupPointCount = notMatchCount;
                    var newPointNum = '(' + node.noGroupPointCount + '/' + node.pointCount + ')';
                    node.name = node.originName + newPointNum;
                    beop.tag.tree.updateNode(node);
                    $("#" + node.tId).children('a').click();
                    beop.tag.tree.reAsyncParentNodes(node.tId);
                }
            }
        });
    };

    //---------DOM操作------

    bindEvent = function () {
        var $tagKeywordsUl = $("#tagKeywordsUl"),
            $selectFolderName = $("#selectFolderName"),
            $folderNameSelect = $("#folderNameSelect"),
            $folderNameText = $("#folderNameText"),
            $createTagsModal = $("#createTagsModal");
        $("#refineKeywordsUl").off('click.li').on('click.li', 'li', function (e) {
            var $curKeysLen = $("#tagKeywordsUl").find('.active-create').length;
            if (!$curKeysLen) {
                stateMap.$curKeyArr.removeClass('keywordsActive');
            }
            var $this = $(this);

            if (e.ctrlKey) {
                $this.addClass('keywordsActive');
            } else {
                stateMap.keywordsForFolder = [];
                $this.addClass('keywordsActive').siblings().removeClass('keywordsActive');
                configMap.cb_on_click(stateMap.keywordsForFolder);
            }

            var value = $this.data('key');
            if ($this.hasClass('allKeywords')) {
                $tagKeywordsUl.empty().html(beopTmpl('tpl_tag_keywords_li', {"list": stateMap.rawData}));
                tagULActive(stateMap.keywordsForFolder, stateMap.rawData);
            } else {
                var tagNotes = stateMap.newData[value];
                tagNotes.sort(function (a, b) {
                    return a.count > b.count ? -1 : (a.count < b.count ? 1 : 0);
                });
                $tagKeywordsUl.empty().html(beopTmpl('tpl_tag_keywords_li', {"list": moveUpEquipment(tagNotes)}));
                tagULActive(stateMap.keywordsForFolder, moveUpEquipment(tagNotes));
            }

            stateMap.$curKeyArr = $(this);
            $tagKeywordsUl.scrollTop(0);

            function tagULActive(nowAct, dataAll) {
                var nowCur;
                if (!Array.isArray(nowAct) || !Array.isArray(dataAll)) {
                    return;
                }
                for (var i = 0; i < nowAct.length; i++) {
                    nowCur = nowAct[i];
                    for (var k = 0; k < dataAll.length; k++) {
                        if (nowCur == dataAll[k].key) {
                            $tagKeywordsUl.find('.isTag[data-key="' + nowCur + '"]').addClass('active-create');
                        }
                    }
                }
            }
        });

        $tagKeywordsUl.off('mousedown.dragkeywords').on('mousedown.dragkeywords', 'li', function (event) {
            var $this = $(this),
                keywordsForFolder = [],
                keywordsForName = [],
                keywordsForCount = [];
            var $tagKeywordsLi = $tagKeywordsUl.find('li.active-create');
            if ($tagKeywordsLi && $tagKeywordsLi.length) {
                for (var i = 0; i < $tagKeywordsLi.length; i++) {
                    keywordsForFolder.push($tagKeywordsLi.eq(i).attr('data-key'));
                    keywordsForName.push($tagKeywordsLi.eq(i).attr('title'));
                    keywordsForCount.push($tagKeywordsLi.eq(i).attr('data-count'));
                }
            }
            var $key = $this.data('key');
            var $count = $this.data('count');
            if ($key) {
                if (keywordsForFolder.length && keywordsForName.length) {
                    if ($.inArray($key, keywordsForFolder) < 0) {
                        keywordsForFolder = [$key];
                        keywordsForName = [$this.attr('title')];
                        keywordsForCount = [$count];
                    }
                } else {
                    keywordsForFolder = [$key];
                    keywordsForName = [$this.attr('title')];
                    keywordsForCount = [$count];
                }
                configMap.cb_on_mousedown(event, keywordsForFolder, keywordsForName, keywordsForCount);
            }
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
                    if (index < 0) {
                        stateMap.keywordsForFolder.push($this.data('key'));
                    }
                }
            } else {
                $this.addClass('active-create').siblings().removeClass('active-create');
                stateMap.keywordsForFolder = [$this.data('key')];
                $("#refineKeywordsUl").find('.keywordsActive').removeClass('keywordsActive');
            }

            var $siblingsAll = $this.parent().children('.active-create');
            if (!$siblingsAll.length) {
                stateMap.$curKeyArr.removeClass('keywordsActive');
            } else {
                stateMap.$curKeyArr.addClass('keywordsActive');
            }

            var keyVal = $this.data('key');
            var $curDataKey = $("#refineKeywordsUl").find('li[data-key="' + keyVal[0] + '"]');
            if ($this.hasClass('active-create')) {
                $curDataKey.addClass('keywordsActive');
            } else {
                var flag = 0;
                for (var i = 0; i < stateMap.keywordsForFolder.length; i++) {
                    if (stateMap.keywordsForFolder[i][0] == keyVal[0]) {
                        flag++;
                    }
                }
                if (!flag) {
                    $curDataKey.removeClass('keywordsActive');
                }
            }

            configMap.cb_on_click(stateMap.keywordsForFolder);
        });

        $("#createFolderByTag").off().on('click', function () {
            if (!stateMap.keywordsForFolder.length) {
                alert(I18n.resource.tag.inspect.TIP_FOR_KEYWORD);
                return;
            }
            $folderNameSelect.empty().html(beopTmpl('tpl_tag_option', {"list": stateMap.keywordsForFolder}));
            $folderNameText.val('');
            $selectFolderName.find('.select-name[selectDom = "select"]').click();
            $createTagsModal.modal();
            I18n.fillArea($createTagsModal)
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
            var notSameFolderNameList = [];
            var selectType = $('#createTagsModal').find('.select-name:radio:checked').attr('selectDom');
            if (selectType === 'select') {
                folderNameList.push($folderNameSelect.val());
            } else if (selectType === 'all') {
                for (var i = 0; i < stateMap.keywordsForFolder.length; i++) {
                    folderNameList.push(stateMap.keywordsForFolder[i])
                }
            } else if (selectType === 'input') {
                if ($folderNameText.val().trim() == '') {
                    alert.danger(I18n.resource.tag.inspect.DIRECTORY_NOT_EMPTY);
                    return;
                }
                folderNameList.push($folderNameText.val().trim());
            }
            var selectNode = beop.tag.tree.getSelectTreeNode()[0];
            if (folderNameList && folderNameList.length) {
                var sameFolderName = [];
                var _id = selectNode._id ? selectNode._id : null;
                if (_id) {
                    if (selectNode.open) {
                        sameFolderName = beop.tag.tree.getSameNames(_id, null, folderNameList);
                    } else {
                        sameFolderName = DmTagTreeEdit.prototype.getNodeChildren(folderNameList);
                    }
                } else {
                    sameFolderName = beop.tag.tree.getSameNames(_id, null, folderNameList);
                }

                folderNameList.forEach(function (item) {
                    if (sameFolderName.indexOf(item) == -1) {
                        notSameFolderNameList.push(item);
                    }
                });

                if (sameFolderName.length) {
                    dealNextSameFolder(sameFolderName, $createTagsModal, prt, selectType);
                }
            }

            var keywords = getKeywordsPram(selectType, notSameFolderNameList);
            if (keywords.length) {
                var postData = {
                    name: notSameFolderNameList, // 创建的目录名
                    keywords: keywords, // 用于创建目录名的关键字列表,
                    projId: AppConfig.projectId,
                    Prt: prt
                };
                Spinner.spin($createTagsModal.find('.modal-content').get(0));
                WebAPI.post('/tag/groupTree/createByKeywords', postData).done(function (result) {
                    if (result.success) {
                        if (result.data && result.data.length) {
                            var node = beop.tag.tree.getSelectTreeNode()[0];
                            $createTagsModal.modal('hide');
                            if (node.folderType && node.folderType === 1) {
                                $("#tagTreeUl").find('li:eq(0) a').click();
                                if (result.data && result.data.length) {
                                    result.data.forEach(function (item, index) {
                                        beop.tag.tree.tagNodesAdd(
                                            {
                                                'isParent': true,
                                                'open': false,
                                                'name': notSameFolderNameList['' + index + ''],
                                                'originName': notSameFolderNameList['' + index + ''],
                                                'children': [],
                                                '_id': item,
                                                'pointCount': 0
                                            },
                                            false,
                                            true,
                                            'keywords'
                                        );
                                        adjustNodesData(item);
                                    })
                                }
                            } else {
                                dealNotMatchCount(node);
                            }
                        }
                    }
                }).always(function () {
                    Spinner.stop();
                });
            }
        });
    };

    unbindEvent = function () {
        $(window).off('mousemove.dm.dragkeywords').off('mouseup.dm.dragkeywords');
    };

    //---------方法---------


    //---------事件---------


    //---------Exports---------
    beop.tag = beop.tag || {};
    beop.tag.keywords = {
        configModel: configModel,
        init: init,
        getKeywordsPram: getKeywordsPram
    };
}(beop || (beop = {})));

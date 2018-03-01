;(function (beop) {
    var initMap = {
            htmlURL: '/static/scripts/dataManage/views/dm.tag.external.tree.html',
            cb_on_add_dom: $.noop,
            cb_on_list_add_dom: $.noop,
            itemShowList: [],  // search, selectPrj
            wrapperNode: false,
            hasWrapperNode: false, // 判断有没有外层包裹文件
            showUnclassified: false,
            settable_map: {
                cb_on_add_dom: true,
                cb_on_list_add_dom: true,
                itemShowList: true,  // search, selectPrj
                wrapperNode: true,
                hasWrapperNode: true,
                showUnclassified: true
            },
            showType: {
                treeShow: 1, // tree 结构
                listShow: 0 // 列表结构
            },
            page_size: 20
        },
        _this = this,
        init, configModel, initAllProject, attachEvent, showTreeItem, goPage, getNodeById, getProjectId, addWrapperNode, addNodePagination, paginationDisabled,
        stateMap = {
            currentPage: 1,
            equipmentAttrPromise: {},
            equipmentTags: []
        },
        loadTree, loadContent, showIconForFolder, addDiyDom, addTreeNodeSkin, changeNameAndIsPrt, getInterface, paginationRefresh, renderList, showTagsStyle,
        zTreeAddHoverDom, setSubData, dealKeywordArr, requestDict, getEquipmentTags,
        configMap = $.extend(true, {}, initMap);
    stateMap.showType = configMap.showType.treeShow;

    init = function ($container) {
        _this.projectId = localStorage.getItem('tagProjectId') ? localStorage.getItem('tagProjectId') : (AppConfig.project && AppConfig.project.bindId ? AppConfig.project.bindId : AppConfig.projectId || AppConfig.projectList[0].id);
        stateMap.$container = $container;
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.showType = configMap.showType.treeShow;
            var isLoad = false;
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            attachEvent();
            showTreeItem();
            configMap.itemShowList.map(function (item) {
                if (item === 'selectPrj') {
                    isLoad = true;
                    initAllProject();
                }
            });
            !isLoad && loadTree();
            requestDict();
        });
    };

    requestDict = function () {
        $.ajax({
            url: '/tag/dict/',
            type: 'GET',
            contentType: 'application/json',
            async: false
        }).done(function (result) {
            if (result.success) {
                if (result.data && result.data.length) {
                    getEquipmentTags(result.data);
                }
            }
        })
    };

    getEquipmentTags = function (tags) {
        tags.forEach(function (item) {
            if (item.groupNm == 'Equipment') {
                stateMap.equipmentTags = item.tags.map(function (element) {
                    return element.name;
                });
            }
        })
    };

    showTreeItem = function () {
        for (var i = 0; i < configMap.itemShowList.length; i++) {
            $("#tagTreeHeader").find('[item="' + configMap.itemShowList[i] + '"]').show();
        }
    };

    goPage = function (treeNode, page) {
        var newNode;
        treeNode.page = page;
        paginationDisabled(treeNode);
        if (treeNode.page < 1) treeNode.page = 1;
        if (treeNode.page > treeNode.maxPage) treeNode.page = treeNode.maxPage;
        if (_this.childrenTreeNode[treeNode._id]) {
            stateMap.zTreeInstance.removeChildNodes(treeNode);
            newNode = _this.childrenTreeNode[treeNode._id].slice((treeNode.page - 1) * treeNode.pageSize, treeNode.page * treeNode.pageSize);
            stateMap.zTreeInstance.addNodes(treeNode, newNode);
            stateMap.zTreeInstance.reAsyncChildNodes(treeNode, "refresh");
        } else {
            stateMap.zTreeInstance.reAsyncChildNodes(treeNode, "refresh");
        }
    };
    //处理 search 关键字
    dealKeywordArr = function () {
        var tagAndPointArr = $('#searchTreeNode').val();
        if (tagAndPointArr) {
            var keywordArr = [];
            _this.keywordArr.forEach(function (item) {
                if (tagAndPointArr.indexOf(item) !== -1) {
                    keywordArr.push(item);
                }
            });
            _this.keywordArr = keywordArr;
        } else {
            _this.keywordArr = [];
        }
    };

    loadContent = function () {
        var tagArr = $.extend(true, [], _this.tagsArr);
        dealKeywordArr();
        var tagType = $('#selectTagType').val();
        tagType = tagType == 'all' ? null : tagType;
        var tagAndPointArr = $('#searchTreeNode').val();
        var tag = [], searchName = [];
        if (tagAndPointArr) {
            if (_this.keywordArr) {
                _this.keywordArr.forEach(function (item) {
                    searchName.push(item);
                    tagArr.splice(tagArr.indexOf(item), 1);
                    tagAndPointArr.splice(tagAndPointArr.indexOf(item), 1);
                })
            }
            tagAndPointArr && tagAndPointArr.map(function (item) {
                if (tagArr.indexOf(item) === -1) {
                    searchName.push(item);
                } else {
                    tag.push(item);
                }
            });
        }
        if (tagType) {
            if (tag.indexOf(tagType) == -1) {
                tag.push(tagType);
            }
        }
        //没有搜索条件的时候且为tree结构显示时
        if (stateMap.showType === configMap.showType.treeShow && tag.length === 0 && searchName.length === 0) {
            loadTree();
            return;
        }
        Spinner.spin($('#pageTag').get(0));
        getInterface(tag, searchName).done(function (result) {
            if (result && result.success) {
                var $externalTagTree = $('#externalTagTree');
                var $tagTreeUlBox = $externalTagTree.find('#tagTreeUlBox'),
                    $listShowBox = $externalTagTree.find('#listShowBox');
                //列表显示
                if (stateMap.showType === configMap.showType.listShow) {
                    $tagTreeUlBox.hide();
                    $listShowBox.empty().show();
                    if (result.data && result.data.length) {
                        stateMap.allResults = result.data;
                        renderList();
                    }
                } else if (stateMap.showType === configMap.showType.treeShow) {
                    $listShowBox.hide();
                    $tagTreeUlBox.show();
                    var zTreeSetting = {
                        data: {
                            key: {
                                title: 'title'
                            }
                        },
                        keep: {
                            leaf: true,
                            parent: true
                        },
                        view: {
                            nameIsHTML: true,
                            selectedMulti: false,
                            showIcon: showIconForFolder,
                            showLine: true,
                            addDiyDom: addDiyDom,
                            fontCss: function (treeId, treeNode) {
                                return treeNode.hasStyle ? {color: 'rgb(238, 238, 238)'} : {};
                            },
                            addHoverDom: zTreeAddHoverDom
                        },
                        callback: {
                            onExpand: function (event, treeId, treeNode) {
                                if (treeNode.children && treeNode.children.length) {
                                    showTagsStyle(treeNode.children);
                                }
                            },
                            onDblClick: function (event, treeId, treeNode) {
                                if (treeNode.children && treeNode.children.length) {
                                    var $folderIoc = $('#' + treeNode.tId + '_ico');
                                    if ($folderIoc.hasClass('ico_open')) {
                                        showTagsStyle(treeNode.children);
                                    }
                                }
                            }
                        }
                    };
                    changeNameAndIsPrt(result.data, tag);
                    stateMap.zTreeInstance = $.fn.zTree.init($tagTreeUlBox, zTreeSetting, result.data);
                    var allNodes = stateMap.zTreeInstance.getNodes();
                    showTagsStyle(allNodes);
                }
            }
        }).always(function () {
            Spinner.stop();
        });
    };
    showTagsStyle = function (allNodes) {
        if (!allNodes) {
            return;
        }
        for (var i = 0; i < allNodes.length; i++) {
            var $treeLi = $('#' + allNodes[i].tId);
            if (!allNodes[i].isParent) {
                if (allNodes[i].tagBox) {
                    var $treeLIA = $treeLi.find('#' + allNodes[i].tId + '_a');
                    if (!$treeLIA.siblings().hasClass('tagBox')) {
                        $treeLIA.after(allNodes[i].tagBox);
                        $treeLi.find('.tagBox').css({display: 'block', padding: '3px 0 3px 6px'});
                    }
                }
            }
        }
    };

    attachEvent = function () {
        configMap.itemShowList.map(function (item) {
            if (item === 'search') {
                $.ajax({
                    url: '/tag/dict/',
                    type: 'GET',
                    contentType: 'application/json',
                    async: false
                }).done(function (result) {
                    if (result.success) {
                        _this.tagsArr = [];
                        var returnData = result.data.map(function (item, index) {
                            var children = item.tags.map(function (i, x) {
                                _this.tagsArr.push(i.name);
                                return {id: i.name, text: i.name, isTag: true};
                            });
                            return {text: item.groupNm, children: children};
                        });
                        _this.keywordArr = [];
                        $('#searchTreeNode').select2({
                            templateSelection: function (state) {
                                if (_this.keywordArr && _this.keywordArr.length) {
                                    if (_this.keywordArr.indexOf(state.text) !== -1) {
                                        state.isTag = false;
                                    }
                                } else {
                                    if (_this.tagsArr.indexOf(state.text) !== -1) {
                                        state.isTag = true;
                                    }
                                }
                                if (!state.isTag) {
                                    return $('<span style="color: #0078dc;">' + state.text + '</span>');
                                } else {
                                    return state.text;
                                }
                            },
                            createTag: function (params) {
                                var term = $.trim(params.term);
                                if (term === '') {
                                    return null;
                                }
                                dealKeywordArr();
                                if (_this.tagsArr.indexOf(term) !== -1) {
                                    _this.keywordArr.push(term);
                                }
                                return {
                                    id: term,
                                    text: term,
                                    newTag: true
                                }
                            },
                            data: returnData,
                            tags: true,
                            tokenSeparators: [',', ' ']
                        }).on("select2:opening", function () {
                            if (_this.isStopOpen) {
                                _this.isStopOpen = false;
                                return false;
                            }
                        }).on("select2:open", function () {
                            $('#select2-searchTreeNode-results').addClass('gray-scrollbar');
                        })
                    }
                });
            }
        });

        stateMap.$container.off('keyup.search').on('keyup.search', '.select2-search__field', function (e) {
            if (e.keyCode === 13) {
                _this.isStopOpen = true;
                loadContent();
            }
        });

        stateMap.$container.off('click.treeShow').on('click.treeShow', '#treeShow', function () {
            var $this = $(this);
            $this.addClass('active').siblings().removeClass('active');
            stateMap.showType = configMap.showType.treeShow;
            var $externalTagTree = $('#externalTagTree');
            $externalTagTree.find('#listShowBox').hide();
            $externalTagTree.find('#tagTreeUlBox').show();
            loadContent();
        });

        stateMap.$container.off('click.listShow').on('click.listShow', '#listShow', function () {
            var $this = $(this);
            $this.addClass('active').siblings().removeClass('active');
            stateMap.showType = configMap.showType.listShow;
            loadContent();
        });

        stateMap.$container.off('click.searchByTag').on('click.searchByTag', '#searchByTagBtn', function () {
            loadContent();
        });

        stateMap.$container.find('#selectTagType').change(function () {
            loadContent();
        });

    };
    getInterface = function (tag, searchName) {
        return WebAPI.post('/tag/search/tagAnalysis', {
            tag: tag,
            projId: _this.projectId,
            isTree: stateMap.showType,
            searchName: searchName
        });
    };

    addTreeNodeSkin = function (node) {
        var equipment = beop.model.dmModel.hasEquipment(node.tag);
        var tagIconsMap = beop.model.dmModel.getTagIcons();
        if (equipment) {
            if (tagIconsMap[equipment.name.toLowerCase()]) {
                node.iconSkin = ' icon iconfont ' + tagIconsMap[equipment.name.toLowerCase()];
            }
        } else {
            delete node['iconSkin'];
        }
    };

    addDiyDom = function (treeId, treeNode) {
        //如果是数据源的操作
        configMap.cb_on_add_dom(treeId, treeNode);
    };

    paginationDisabled = function (treeNode) {
        var id = treeNode._id;
        $('#firstBtn_' + id).removeClass("disable").siblings().removeClass("disable");
        if (treeNode.page === 1) {
            $('#firstBtn_' + id).addClass("disable");
            $('#prevBtn_' + id).addClass("disable");
        } else if (treeNode.page === treeNode.maxPage) {
            $('#nextBtn_' + id).addClass("disable");
            $('#lastBtn_' + id).addClass("disable");
        }
    };

    addNodePagination = function (treeNode) {
        if ((treeNode.level === 0 && configMap.hasWrapperNode) || treeNode.type !== 'group' || treeNode.maxPage < 2 || treeNode.open) {
            return;
        }
        var aObj = $("#" + treeNode.tId + "_a");
        if ($("#addBtn_" + treeNode._id).length > 0) return;
        var addStr = "<span class='paginationIcon'><span class='button lastPage changePage' id='lastBtn_" + treeNode._id
            + "' title=" + I18n.resource.tag.tree.LAST_PAGE + " onfocus='this.blur();'></span><span class='button nextPage changePage' id='nextBtn_" + treeNode._id
            + "' title=" + I18n.resource.tag.tree.NEXT_PAGE + " onfocus='this.blur();'></span><span class='button prevPage changePage' id='prevBtn_" + treeNode._id
            + "' title=" + I18n.resource.tag.tree.PREV_PAGE + " onfocus='this.blur();'></span><span class='button firstPage changePage' id='firstBtn_" + treeNode._id
            + "' title=" + I18n.resource.tag.tree.FIRST_PAGE + " onfocus='this.blur();'></span></span>";
        aObj.after(addStr);
        var first = $("#firstBtn_" + treeNode._id);
        var prev = $("#prevBtn_" + treeNode._id);
        var next = $("#nextBtn_" + treeNode._id);
        var last = $("#lastBtn_" + treeNode._id);
        first.bind("click", function () {
            if (!treeNode.isAjaxing) {
                goPage(treeNode, 1);
            }
        });
        last.bind("click", function () {
            if (!treeNode.isAjaxing) {
                goPage(treeNode, treeNode.maxPage);
            }
        });
        prev.bind("click", function () {
            if (!treeNode.isAjaxing) {
                goPage(treeNode, treeNode.page - 1);
            }
        });
        next.bind("click", function () {
            if (!treeNode.isAjaxing) {
                goPage(treeNode, treeNode.page + 1);
            }
        });
    };

    changeNameAndIsPrt = function (treeItems, tags) {
        if (!treeItems) {
            return;
        }
        for (var i = 0; i < treeItems.length; i++) {
            var treeItem = treeItems[i];
            if (treeItem.children) {
                changeNameAndIsPrt(treeItem.children, null);
            }
            treeItem['isParent'] = (treeItem.type === 'group');
            treeItem['originName'] = treeItem['name'];
            treeItem['title'] = treeItem['originName'];
            treeItem['page'] = 1;
            treeItem['pageSize'] = 50;
            var tagsHtml = '';

            var subTags = [];
            if (treeItem.tag && treeItem.tag.length) {
                subTags = $.extend(true, [], treeItem.tag);
            }

            var equipmentTags = [],
                otherTags = [];

            if (stateMap.equipmentTags.length) {
                subTags && subTags.forEach(function (item) {
                    if (stateMap.equipmentTags.indexOf(item) !== -1) {
                        equipmentTags.push(item);
                    } else {
                        otherTags.push(item);
                    }
                });
                subTags = equipmentTags.concat(otherTags);
            }

            subTags && subTags.map((function (treeItem) {
                return function (item) {
                    if (tags && tags.indexOf(item) !== -1) {
                        tagsHtml += '<span class="treeTagItem active" data-tag="' + item.toLocaleLowerCase() + '" ' +
                            'data-toggle="tooltip" data-placement="right" title="' + setSubData(item, treeItem) + '">' + item + '</span>';
                    } else {
                        tagsHtml += '<span class="treeTagItem" data-tag="' + item.toLocaleLowerCase() + '" ' +
                            'data-toggle="tooltip" data-placement="right" title="' + setSubData(item, treeItem) + '">' + item + '</span>';
                    }
                }
            })(treeItem));
            treeItem['name'] = treeItem['name'] + '' + (treeItem['pointCount'] ? '(' + treeItem['pointCount'] + ')' : '');

            if (tagsHtml) {
                var tagsHtmlBox = $('<span class="tagBox"></span>');
                tagsHtmlBox.html(tagsHtml);
                if (treeItem['isParent']) {
                    treeItem['name'] += tagsHtmlBox[0].outerHTML;
                } else {
                    treeItem['tagBox'] = tagsHtmlBox[0].outerHTML;
                }
            }
            //接口返回的rule有两层数组包着
            treeItem['rule'] = (treeItem['rule'] && treeItem['rule'].length) ? treeItem['rule'][treeItem['rule'].length - 1] : '';
        }
    };

    getNodeById = function (nodeId) {
        return stateMap.zTreeInstance.getNodeByParam('_id', nodeId);
    };

    getProjectId = function () {
        return _this.projectId;
    };

    loadTree = function () {
        var Spinner = new LoadingSpinner({color: "#00FFFF"});
        var otherParamList = ['projId', _this.projectId];
        otherParamList.push('isOnlyGroup');
        otherParamList.push(!!configMap.isOnlyGroup);
        var zTreeSetting = {
            data: {
                key: {
                    title: 'title'
                },
                keep: {
                    leaf: true,
                    parent: true
                }
            },
            view: {
                nameIsHTML: true,
                selectedMulti: false,
                showIcon: showIconForFolder,
                showLine: true,
                addDiyDom: addDiyDom,
                fontCss: function (treeId, treeNode) {
                    return treeNode.hasStyle ? {color: 'rgb(238, 238, 238)'} : {};
                },
                addHoverDom: zTreeAddHoverDom
            },
            callback: {
                beforeAsync: function (treeId, treeNode) {
                    if (!treeNode) {
                        Spinner.spin($('#pageTag')[0]);
                    }
                },
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    if (treeNode && treeNode.children && treeNode.children.length) {
                        for (var i = 0; i < treeNode.children.length; i++) {
                            var data = treeNode.children[i];
                            var $treeLi = $('#' + data.tId);
                            if (!data.isParent) {
                                if (data.tagBox) {
                                    $treeLi.find('#' + data.tId + '_a').after(data.tagBox);
                                    $treeLi.find('.tagBox').css({display: 'block', padding: '3px 0 3px 6px'});
                                }
                            }
                        }
                    }
                },
                onExpand: function (event, treeId, treeNode) {
                    if (treeNode.children && treeNode.children.length) {
                        var $li = $('#' + treeNode.tId);
                        var $paginationIcon = $li.find('.paginationIcon');
                        if($paginationIcon && $paginationIcon.length){
                            $paginationIcon.show();
                        }
                    }
                },
                onCollapse: function (event, treeId, treeNode) {
                    if (treeNode) {
                        var $li = $('#' + treeNode.tId);
                        var $paginationIcon = $li.find('.paginationIcon');
                        if ($paginationIcon && $paginationIcon.length) {
                            $paginationIcon.hide();
                        }
                    }
                }
            },
            async: {
                enable: true,
                autoParam: ['_id=Prt', '_id'],
                dataType: 'json',
                otherParam: otherParamList,
                url: '/tag/getThingTreeNew',
                dataFilter: function (treeId, parentNode, responseData) {
                    if (!responseData || !responseData.success || !responseData.data) {
                        Spinner.stop();
                        responseData.data = [];
                    }

                    if (parentNode && parentNode._id === '') {
                        if (configMap.isOnlyGroup) {
                            Spinner.stop();
                            return;
                        }
                    }

                    if (!parentNode) {
                        _this.childrenTreeNode = [];
                        for (var i = 0; i < responseData.data.length; i++) {
                            if (responseData.data[i].type === 'thing') {
                                responseData.data.splice(i--, 1);
                            }
                        }
                        //addWrapperNode(responseData.data);
                    } else {
                        parentNode.maxPage = Math.round(responseData.data.length / parentNode.pageSize - .5) + (responseData.data.length % parentNode.pageSize == 0 ? 0 : 1);
                        addNodePagination(parentNode);
                        _this.childrenTreeNode[parentNode._id] = responseData.data;
                        paginationDisabled(parentNode, parentNode._id);
                    }
                    changeNameAndIsPrt(responseData.data, null);
                    if (responseData.data && responseData.data.length) {
                        responseData.data.forEach(function (item) {
                            addTreeNodeSkin(item);
                        })
                    }

                    Spinner.stop();
                    if (parentNode && parentNode.page && parentNode.maxPage && parentNode.pageSize) {
                        return responseData.data.slice((parentNode.page - 1) * parentNode.pageSize, parentNode.page * parentNode.pageSize)
                    }
                    return responseData.data;
                }
            }
        };
        var $tagTreeUlBox = $("#tagTreeUlBox");
        stateMap.zTreeInstance = $.fn.zTree.init($tagTreeUlBox, zTreeSetting);
    };

    /*addWrapperNode = function (data) {
     var wrapperNodeId = 44444444;
     if (configMap.wrapperNode) {
     var treeNodes = [];
     for (var i = 0; i < data.length; i++) {
     data[i].prt = wrapperNodeId;
     }
     configMap.wrapperNode = false;
     treeNodes.push({
     _id: wrapperNodeId,
     name: 'Tag Structure',
     prt: null,
     isParent: true,
     type: "group",
     children: data
     });
     if (configMap.otherNodes && configMap.otherNodes.children && configMap.otherNodes.children.length) {
     treeNodes.unshift(configMap.otherNodes);
     }
     data = treeNodes;
     }
     };*/

    //分页插件显示
    paginationRefresh = function (totalNum) {
        var totalPages = Math.ceil(totalNum / configMap.page_size);
        if (!totalNum) {
            return;
        }
        $('#paginationWrapper').empty().html('<ul id="listPagination" class="pagination"></ul>');
        while (totalPages < stateMap.currentPage && stateMap.currentPage > 1) {
            stateMap.currentPage = stateMap.currentPage - 1;
        }
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: stateMap.currentPage ? parseInt(stateMap.currentPage) : 1,
            totalPages: !totalPages ? 1 : parseInt(totalPages),
            initiateStartPageClick: false,
            onPageClick: function (event, page) {
                stateMap.currentPage = page;
                renderList();
            }
        };
        $("#listPagination").twbsPagination(pageOption);
    };

    renderList = function () {
        var startIndex, endIndex, allPage, allNum = stateMap.allResults.length;
        startIndex = (stateMap.currentPage - 1) * (configMap.page_size);
        allPage = allNum % configMap.page_size == 0 ? parseInt(allNum / configMap.page_size) : parseInt(allNum / configMap.page_size) + 1;
        if (allPage == stateMap.currentPage) {
            if (allNum % configMap.page_size == 0) {
                endIndex = startIndex + configMap.page_size;
            } else {
                endIndex = startIndex + allNum % configMap.page_size;
            }
        } else {
            endIndex = startIndex + configMap.page_size;
        }
        var $listShowBox = $('#listShowBox');
        var list = stateMap.allResults.slice(startIndex, endIndex);
        $listShowBox.empty().show().append(beopTmpl('tpl_list_structure'));
        for (var i = 0; i < list.length; i++) {
            var $li = $('<li id="' + list[i]._id + '" title="' + list[i].name + '" draggable="true" class="pointItem"></li>');
            var $pointName = $('<div class="pointName">' + list[i].name + '</div>');
            $li.append($pointName);
            if (list[i].tag && list[i].tag.length) {
                var $listTagItemBox = $('<div class="listTagItemBox"></div>');
                for (var j = 0; j < list[i].tag.length; j++) {
                    var $listTagItem = $('<span class="listTagItem cp" data-toggle="tooltip" data-placement="right" title="' + setSubData(list[i].tag[j], list[i]) + '">' + list[i].tag[j] + '</span>');
                    $listTagItemBox.append($listTagItem);
                }
                $li.append($listTagItemBox);
            }
            var name = list[i].name;
            configMap.cb_on_list_add_dom($li, name);
            $listShowBox.find('.listShowContent').append($li);
        }
        paginationRefresh(allNum);
        $('[data-toggle="tooltip"]').tooltip({html: true});
    };

    initAllProject = function () {
        var _this = this;
        var $selPrjName = stateMap.$container.find('#tagSelectPrjName');
        var data = AppConfig.projectList.map(function (item, index) {
            if ('zh' == localStorage['language']) {
                return {
                    id: item.id,
                    text: item.name_cn
                }
            } else {
                return {
                    id: item.id,
                    text: item.name_english
                }
            }
        });
        $selPrjName.select2({data: data})
            .off('change.proj')
            .on('change.proj', function () {
                _this.projectId = $('#tagSelectPrjName').val();
                localStorage.setItem('tagProjectId', _this.projectId);
                loadTree();
            })
            .val(_this.projectId)
            .trigger('change')
            .on("select2:open", function () {
                $('.select2-results__options').addClass('gray-scrollbar');
            });
    };

    showIconForFolder = function (treeId, treeNode) {
        return treeNode.isParent;
    };

    zTreeAddHoverDom = function (treeId, treeNode) {
        $('[data-toggle="tooltip"]').tooltip({html: true});
    };

    configModel = function (input_map) {
        configMap = $.extend(true, {}, initMap);
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    setSubData = function (item, treeItem) {

        if (!beop.model.dmModel.hasEquipment([item]) || !treeItem.attrP || $.isEmptyObject(treeItem.attrP)) {
            return '';
        }

        if (!stateMap.equipmentAttrPromise[item]) {
            stateMap.equipmentAttrPromise[item] = $.ajax({
                url: '/tag/equipmentInputs/' + item.toLocaleLowerCase(),
                type: 'Get',
                contentType: 'application/json',
                async: false
            });
        }
        var html = '';
        stateMap.equipmentAttrPromise[item].done(function (result) {
            if (result.success && result.data.length) {

                var equipmentData = {};
                for (var i = 0; i < result.data.length; i++) {
                    equipmentData[result.data[i].name.en] = result.data[i].name[AppConfig.language];
                }

                for (var attr in treeItem.attrP) {
                    if (treeItem.attrP.hasOwnProperty(attr)) {
                        if (equipmentData[attr] && treeItem.attrP[attr]) {
                            html += '<span>' + equipmentData[attr] + ':</span><span>' + treeItem.attrP[attr] + '</span><br>';
                        }
                    }
                }
            }
        });
        return html;
    };

    //---------Exports---------
    beop.tag = beop.tag || {};
    beop.tag.externalTree = {
        init: init,
        configModel: configModel,
        getNodeById: getNodeById,
        getProjectId: getProjectId
    }
}(beop || (beop = {})));
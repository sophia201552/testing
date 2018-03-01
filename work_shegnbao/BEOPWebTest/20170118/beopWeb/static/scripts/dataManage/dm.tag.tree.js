(function (beop) {
    var configMap = {
            htmlURL: '/static/scripts/dataManage/views/dm.tag.tree.html',
            cb_on_click: $.noop,
            cb_on_dbl_click: $.noop,
            cb_on_mouseUp: $.noop,
            cb_on_drop: $.noop,
            cb_on_hover: $.noop,
            editable: null,
            isOnlyGroup: false,
            wrapperNode: false,
            hasWrapperNode: false,
            itemShowList: [],  // search, finish, edit, btnGroup
            otherNodes: {},
            settable_map: {
                cb_on_click: true,
                cb_on_dbl_click: true,
                cb_on_drop: true,
                cb_on_hover: true,
                cb_on_mouseUp: true,
                editable: true,
                isOnlyGroup: true,
                wrapperNode: true,
                hasWrapperNode: true,
                itemShowList: true,  // search, finish, edit, btnGroup
                otherNodes: true
            }
        },
        _this = this,
        stateMap = {},
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, attachEvents,
        loadTree, showIconForFolder, zTreeAddHoverDom, zTreeRemoveHoverDom, zTreeOnClick, zTreeOnDblClick,
        showTreeItem, getParentNodeByAdd, tagNodesAdd, getSelectTreeNode, getNodeById, removeNode, selectNode,
        updateNotClassified, reAsyncParentNodes, getPath, updateNode, isNameExist;

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
        _this.init = true;
        stateMap.$container = $container;
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            showTreeItem();
            attachEvents();
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            loadTree();
            stateMap.$container.on('focus', 'input', function () {
                $(this).val(_this.originName);
            });
        });
    };

    //---------DOM操作------


    //---------方法---------
    loadTree = function () {
        var Spinner = new LoadingSpinner({color: "#00FFFF"});
        var otherParamList = ['projId', AppConfig.projectId];
        otherParamList.push('isOnlyGroup');
        otherParamList.push(!!configMap.isOnlyGroup);
        var zTreeSetting = {
            keep: {
                leaf: true,
                parent: true
            },
            view: {
                selectedMulti: false,
                showIcon: showIconForFolder,
                showLine: true,
                addHoverDom: !configMap.editable ? $.noop : zTreeAddHoverDom,
                removeHoverDom: zTreeRemoveHoverDom,
                fontCss: function (treeId, treeNode) {
                    return treeNode.hasStyle ? {color: '#ff8b03'} : {};
                }
            },
            callback: {
                onMouseUp: configMap.cb_on_mouseUp,
                onClick: zTreeOnClick,
                onDblClick: zTreeOnDblClick,
                beforeEditName: function (treeId, treeNode) {
                    _this.originName = treeNode.originName;
                    return true;
                },

                onNodeCreated: function (event, treeId, treeNode) {
                    if (_this.newSubId) {
                        stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', _this.newSubId));
                        _this.newSubId = null;
                    }
                },
                onAsyncError: function () {
                    Spinner.stop();
                },
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    Spinner.stop();
                    if (_this.init) {
                        $('#' + stateMap.zTreeInstance.getNodeByParam('_id', '').tId + '_span').click();
                        _this.init = false;
                    }
                    //新增根目录后选中未分类目录
                    if (!treeNode) {
                        stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', ''));
                    }
                    //增加子目录选择该子目录的父级目录
                    if (_this.specificNodeId) {
                        var node = stateMap.zTreeInstance.getNodeByParam('_id', _this.specificNodeId);
                        stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByTId(node.parentTId));
                    }
                },
                beforeRemove: function (treeId, treeNode) {
                    return true;
                },
                onRemove: function (event, treeId, treeNode) {
                    if (treeNode.parentTId) {
                        var parentNode = stateMap.zTreeInstance.getNodeByTId(treeNode.parentTId);
                        parentNode.isParent = true;
                        stateMap.zTreeInstance.updateNode(parentNode);
                    }
                },
                beforeDrop: function (treeId, treeNodes, targetNode, moveType) {
                    var resultStatus;
                    $.ajax({
                        url: "/tag/groupTree/save",
                        async: false,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            projId: AppConfig.projectId,
                            groupId: treeNodes[0]._id,
                            Prt: targetNode._id
                        })
                    }).done(function (result) {
                        if (!result.success) {
                            alert.danger(result.msg);
                        }
                        resultStatus = result.success;
                    });
                    return resultStatus;
                },
                beforeAsync: function () {
                    Spinner.spin($('#tagZtreeBox')[0]);
                },
                onDrop: function (event, treeId, treeNodes, targetNode, moveType) {
                    if (!targetNode) {
                        return false;
                    }
                    if (configMap.hasWrapperNode && configMap.cb_on_drop) {
                        configMap.cb_on_drop(event, treeNodes);
                        return;
                    }
                    var needRootRefresh = false;
                    if (!targetNode.getParentNode()) {
                        needRootRefresh = true;
                    } else {
                        stateMap.zTreeInstance.reAsyncChildNodes(targetNode.getParentNode(), "refresh");
                    }

                    if (treeNodes) {
                        for (var i = 0; i < treeNodes.length; i++) {
                            if (!treeNodes[i].prt || !treeNodes[i].getParentNode()) {
                                needRootRefresh = true;
                            } else {
                                stateMap.zTreeInstance.reAsyncChildNodes(treeNodes[i].getParentNode(), "refresh");
                            }
                        }
                    }
                    if (needRootRefresh) {
                        stateMap.zTreeInstance.reAsyncChildNodes(null, "refresh");
                    }
                }
            },
            edit: {
                enable: true,
                showRemoveBtn: function (treeId, treeNode) {
                    return false;
                },
                showRenameBtn: function (treeId, treeNode) {
                    return false;
                },
                drag: {
                    inner: true,
                    prev: false,
                    next: false,
                    isCopy: false,
                    isMove: true
                }
            },
            async: {
                enable: true,
                autoParam: ['_id=Prt', '_id'],
                dataType: 'json',
                otherParam: otherParamList,
                url: '/tag/getThingTree',
                dataFilter: function (treeId, parentNode, responseData) {
                    if (!responseData || !responseData.success || !responseData.data) {
                        Spinner.stop();
                        responseData.data = [];
                    }

                    if (parentNode && parentNode._id === '') {
                        Spinner.stop();
                        return;
                    }

                    function changeNameAndIsPrt(treeItems) {
                        if (!treeItems) {
                            return;
                        }
                        for (var i = 0; i < treeItems.length; i++) {
                            var treeItem = treeItems[i];
                            if (treeItem.children) {
                                changeNameAndIsPrt(treeItem.children);
                            }
                            treeItem['isParent'] = (treeItem.type === 'group');
                            treeItem['originName'] = treeItem['name'];
                            treeItem['name'] = treeItem['name'] + '' + (treeItem['pointCount'] ? '(' + treeItem['pointCount'] + ')' : '');
                            //接口返回的rule有两层数组包着
                            treeItem['rule'] = (treeItem['rule'] && treeItem['rule'].length) ? treeItem['rule'][treeItem['rule'].length - 1] : '';
                        }
                    }

                    var notDiffMenuId = 55555555;
                    if (!parentNode) {//根目录
                        $.ajax({
                            url: '/tag/thingTree/detail',
                            type: 'POST',
                            async: false,
                            data: JSON.stringify({"Prt": "", "projId": AppConfig.projectId, "limit": 1000, "skip": 1}),
                            contentType: 'application/json'
                        }).done(function (result) {
                            var wrapperNodeId = 44444444;
                            var unclassified = {
                                _id: '',
                                type: "group",
                                prt: "",
                                children: [],
                                name: "未分类目录",
                                folderType: 1,
                                hasStyle: true,
                                pointCount: result.data.count ? result.data.count : 0
                            };
                            if (configMap.isOnlyGroup) {
                                responseData.data.unshift(unclassified);
                            } else {
                                var unclassifiedList = [];
                                unclassified.notDiffMenuId = notDiffMenuId;
                                for (var i = 0; i < responseData.data.length; i++) {
                                    var node = responseData.data[i];
                                    if (node.type === 'thing') {
                                        node.prt = notDiffMenuId;
                                        unclassifiedList.push(node);
                                        responseData.data.splice(i--, 1);
                                    }
                                }
                                unclassified.children = unclassifiedList;
                                responseData.data.unshift(unclassified);
                            }
                            if (configMap.wrapperNode) {
                                var treeNodes = [];
                                for (var i = 0; i < responseData.data.length; i++) {
                                    responseData.data[i].prt = wrapperNodeId;
                                }
                                configMap.wrapperNode = false;
                                treeNodes.push({
                                    _id: wrapperNodeId,
                                    name: 'Tag Structure',
                                    prt: null,
                                    isParent: true,
                                    type: "group",
                                    children: responseData.data
                                });
                                if (configMap.otherNodes && configMap.otherNodes.children && configMap.otherNodes.children.length) {
                                    treeNodes.unshift(configMap.otherNodes);
                                }
                                responseData.data = treeNodes;
                            }
                        });
                    }
                    changeNameAndIsPrt(responseData.data);
                    Spinner.stop();
                    return responseData.data;
                }
            }
        };
        stateMap.zTreeInstance = $.fn.zTree.init($("#tagTreeUl"), zTreeSetting);
    };

    removeNode = function (nodeId) {
        stateMap.zTreeInstance.removeNode(stateMap.zTreeInstance.getNodeByParam('_id', nodeId), true);
    };

    selectNode = function (nodeId) {
        stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', nodeId));
    };

    getNodeById = function (nodeId) {
        return stateMap.zTreeInstance.getNodeByParam('_id', nodeId);
    };

    getSelectTreeNode = function () {
        return stateMap.zTreeInstance.getSelectedNodes();
    };

    showIconForFolder = function (treeId, treeNode) {
        return treeNode.isParent;
    };

    zTreeAddHoverDom = function (treeId, treeNode) {
        if (configMap.hasWrapperNode && configMap.cb_on_hover) {
            $("#" + treeNode.tId).find('.edit').remove();
            configMap.cb_on_hover(treeNode);
            return;
        }

        var $liNode = $("#" + treeNode.tId);
        $liNode.children('a').hover(function () {
            if (treeNode.hasStyle == true) {
                $(this).css({'background-color': '#0077ee', 'color': '#ff8b03'});
            } else {
                $(this).css({'background-color': '#0077ee', 'color': '#fff'});
            }
        }, function () {
            if (treeNode.hasStyle == true) {
                $(this).css({'background-color': 'rgba(0,0,0,0)', 'color': '#ff8b03'});
            } else {
                $(this).css({'background-color': 'rgba(0,0,0,0)', 'color': '#666'});
            }
        });

        if (configMap.cb_on_hover) {
            $liNode.find('.edit').remove();
            configMap.cb_on_hover(treeNode);
        }

        if (treeNode.folderType === 1) {//未分类目录
            $liNode.find('a .button').not('.ico_close').not('.ico_open').remove();
            return;
        }
        if (treeNode.isParent) {
            if (!$liNode.find('.rename').length) {
                $liNode.children('a').append('<span class="cp button treeCustomIcon ml5 rename" title="重命名"></span>');
                $liNode.find('.rename').show();
            }
            if (!$liNode.find('.removeNode').length) {
                $liNode.children('a').append('<span class="cp button treeCustomIcon ml5 removeNode" title="删除"></span>');
                $liNode.find('.addNode').show();
            }
            if (!$liNode.find('.addNode').length) {
                $liNode.children('a').append('<span class="cp button treeCustomIcon ml5 addNode" title="添加"></span>');
                $liNode.find('.addNode').show();
            }
            if (!$liNode.find('.editRule').length) {
                $liNode.children('a').append('<span class="cp button treeCustomIcon editRule" title="规则"></span>');
                $liNode.find('.editRule').show();
            }

            if (!$liNode.find('.autoMatch').length) {
                $liNode.children('a').append('<span class="cp button treeCustomIcon autoMatch" title="Tag识别"></span>');
                $liNode.find('.autoMatch').show();
            }
        }
    };

    zTreeRemoveHoverDom = function (treeId, treeNode) {
        $("#" + treeNode.tId).find('.treeCustomIcon').off().remove();
    };

    zTreeOnClick = function (event, treeId, treeNode) {
        $("#" + treeNode.tId).find('.treeCustomIcon').off().remove();
        configMap.showTreeItem && zTreeAddHoverDom(treeId, treeNode);
        var $target = $(event.target);
        if ($target.is('.editRule')) {
            configMap.cb_on_click(treeNode, 'editRule');
        } else if ($target.is('.addNode')) {
            configMap.cb_on_click(treeNode, 'addNode');
        } else if ($target.is('.removeNode')) {
            confirm('确认删除节点  ' + treeNode.originName + '  ?', function () {
                Spinner.spin(ElScreenContainer);
                $.ajax({
                    url: "/tag/del",
                    async: false,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        projId: AppConfig.projectId,
                        groupId: treeNode._id
                    })
                }).done(function (result) {
                    if (result.success) {
                        var parentTId = getParentNodeByAdd().parentTId;
                        stateMap.zTreeInstance.removeNode(treeNode, true);
                        if (parentTId) {
                            stateMap.zTreeInstance.reAsyncChildNodes(stateMap.zTreeInstance.getNodeByTId(parentTId), "refresh");
                        }
                        updateNotClassified();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });
        } else if ($target.is('.autoMatch')) {
            configMap.cb_on_click(treeNode, 'autoMatch');
        } else if ($target.is('.rename')) {
            configMap.cb_on_click(treeNode, 'rename');
        } else {
            configMap.cb_on_click(treeNode);
        }
    };

    zTreeOnDblClick = function (event, treeId, treeNode) {
        if (configMap.cb_on_dbl_click) {
            configMap.cb_on_dbl_click(treeNode);
        }
    };

    getParentNodeByAdd = function () {
        var nodes = stateMap.zTreeInstance.getSelectedNodes();
        if (!nodes.length) {
            return null;
        } else {
            return nodes[0].isParent ? nodes[0] : nodes[0].getParentNode();
        }
    };

    showTreeItem = function () {
        for (var i = 0; i < configMap.itemShowList.length; i++) {
            $("#tagTreeInfo").find('[item="' + configMap.itemShowList[i] + '"]').show();
        }
    };

    updateNotClassified = function () {
        var notClassified = stateMap.zTreeInstance.getNodeByParam('_id', '');
        $.ajax({
            url: '/tag/thingTree/detail',
            type: 'POST',
            async: false,
            data: JSON.stringify({"Prt": "", "projId": AppConfig.projectId, "limit": 1000, "skip": 1}),
            contentType: 'application/json'
        }).done(function (result) {
            notClassified.pointCount = result.data.count ? result.data.count : 0;
            notClassified.name = notClassified.originName + '(' + notClassified.pointCount + ')'
        });
        stateMap.zTreeInstance.updateNode(notClassified);
    };

    /***
     * 新增点或刷新父节点
     * @param nodes
     * @param reAsyncPrt true新增子目录  false新增待输入的目录来显示新增后的位置
     * @param isRoot
     */
    tagNodesAdd = function (nodes, reAsyncPrt, isRoot) {
        if (reAsyncPrt && !isRoot) {
            //新增子目录
            stateMap.zTreeInstance.reAsyncChildNodes(stateMap.zTreeInstance.getNodeByTId(getParentNodeByAdd().parentTId), "refresh");
            _this.specificNodeId = nodes._id;
        } else {
            stateMap.zTreeInstance.addNodes(isRoot ? '' : getParentNodeByAdd(), nodes);
            //新增根目录或者根目录显示的位置
            if (isRoot) {
                stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', nodes._id));
                updateNotClassified();
            } else {
                //新增子目录显示的位置
                _this.newSubId = nodes._id;
                stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', nodes._id));
            }
        }
    };

    reAsyncParentNodes = function (nodeTId) {
        if (nodeTId == 'refresh-tree') {
            stateMap.zTreeInstance.reAsyncChildNodes(null, "refresh");
            stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', ''));
        } else {
            stateMap.zTreeInstance.reAsyncChildNodes(stateMap.zTreeInstance.getNodeByTId(nodeTId), "refresh");
        }
    };

    isNameExist = function (prt, id, name) {
        var nodes;
        if (prt == null) {
            nodes = stateMap.zTreeInstance.getNodes();
        } else {
            nodes = stateMap.zTreeInstance.getNodeByParam('_id', prt).children;
        }
        for (var i = 0, iLen = nodes.length; i < iLen; i++) {
            if (id) {
                if (nodes[i]._id !== id && nodes[i].originName == name) {
                    return true;
                }
            } else if (nodes[i].originName == name) {
                return true;
            }
        }
        return false;
    };

    getPath = function (treeNode) {
        return treeNode.getPath();
    };

    updateNode = function (node, checkTypeFlag) {
        stateMap.zTreeInstance.updateNode(node);
    };


    //---------事件---------
    attachEvents = function () {
        stateMap.$container.off('click.finishFolder').on('click.finishFolder', '#finishFolder', function () {
            location.href = '#page=DmTagMark&projectId=' + AppConfig.projectId;
        });
        stateMap.$container.off('click.editFolder').on('click.editFolder', '#editFolder', function () {
            location.href = '#page=DmTagTreeEdit&projectId=' + AppConfig.projectId;
        });
        stateMap.$container.off('click.addEmptyFolder').on('click.addEmptyFolder', '#addEmptyFolder', function () {
            var selectedNode = getSelectTreeNode();
            if (selectedNode[0] && selectedNode[0].name != '新建目录' && selectedNode[0]._id != '') {
                configMap.cb_on_click(selectedNode[0], 'addEmpty');
            } else {
                configMap.cb_on_click(null, 'addEmpty');
            }
        });
        stateMap.$container.off('click.tagTreeAdd').on('click.tagTreeAdd', '#tagTreeAdd', function () {
            configMap.cb_on_click();
        });
        $("#searchTreeNode").off().on('keyup', function (e) {
            if (e.keyCode === 13) {
                var searchText = $(this).val().trim(),
                    $tagTreeUl = $("#tagTreeUl"),
                    $searchTreeUl = $("#apiTreeSearchUl");
                if (searchText == '') {
                    if (stateMap.$treeDomDetach.length) {
                        $tagTreeUl.empty().html(stateMap.$treeDomDetach).show();
                        $searchTreeUl.hide();
                    }
                } else {
                    WebAPI.post('/tag/search', {
                        "projId": AppConfig.projectId,
                        "name": searchText,
                        "Prt": ""
                    }).done(function (result) {
                        if (result.success) {
                            if ($tagTreeUl.children().length) {
                                stateMap.$treeDomDetach = $tagTreeUl.children().detach();
                            }
                            var treeSearchList = [];
                            var treeNodeList, requestSearchTreeList = [];
                            if (configMap.otherNodes && configMap.otherNodes.children && configMap.otherNodes.children.length) {
                                var otherNodeList = configMap.otherNodes.children;
                                for (var i = 0; i < otherNodeList.length; i++) {
                                    var childNodes = otherNodeList[i].children;
                                    for (var j = 0; j < childNodes.length; j++) {
                                        if (childNodes[j].name.indexOf(searchText) != -1) {
                                            requestSearchTreeList.push(childNodes[j]);
                                        }
                                    }
                                }
                                treeNodeList = requestSearchTreeList.concat(result.data.list);
                            } else {
                                treeNodeList = result.data.list;
                            }

                            for (var i = 0; i < treeNodeList.length; i++) {
                                var folderFlag, item = treeNodeList[i];
                                folderFlag = item.type && item.type == 'group' ? true : false;
                                treeSearchList.push({
                                    id: ObjectId(),
                                    name: item.name,
                                    sample: item.sample ? item.sample : '',
                                    isFolder: folderFlag,
                                    isParent: folderFlag
                                });
                            }

                            var zTreeSetting = {
                                view: {
                                    selectedMulti: false
                                },
                                edit: {
                                    enable: true,
                                    showRemoveBtn: false,
                                    showRenameBtn: false
                                },
                                data: {
                                    simpleData: {
                                        enable: true
                                    }
                                },
                                callback: {
                                    onDblClick: zTreeOnDblClick,
                                    onDrop: function (event, treeId, treeNodes, targetNode, moveType) {
                                        if (configMap.cb_on_drop) {
                                            configMap.cb_on_drop(event, treeNodes);
                                        }
                                    }
                                }
                            };

                            stateMap.zTreeSearchInstance = $.fn.zTree.init($searchTreeUl, zTreeSetting, treeSearchList);

                            var $span = $searchTreeUl.find('a span[id$=_span]');
                            var keywordList = searchText.replace('/[^\w\d\s]/g', ' ').split(/\s/g);

                            $span.each(function (index, item) {
                                var $item = $(item);
                                var text = $item.text();
                                keywordList.forEach(function (char) {
                                    if (char) {
                                        text = text.replace(new RegExp("(" + char + ")(?![^<]*>|[^<>]*</)", "gi"), '<span class="search-tree-text">$1</span>');
                                    }
                                });
                                $item.html(text);
                            });
                            $searchTreeUl.show();
                            $tagTreeUl.hide();
                        } else {
                            alert('error: ' + result.msg);
                        }
                    }).always(function () {
                        Spinner.stop();
                    })
                }
            }
        });
    };


    //---------Exports---------
    beop.tag = beop.tag || {};

    beop.tag.tree = {
        configModel: configModel,
        init: init,
        getSelectTreeNode: getSelectTreeNode,
        getNodeById: getNodeById,
        tagNodesAdd: tagNodesAdd,
        removeNode: removeNode,
        selectNode: selectNode,
        reAsyncParentNodes: reAsyncParentNodes,
        getPath: getPath,
        updateNode: updateNode,
        isNameExist: isNameExist
    };
}(beop || (beop = {})));

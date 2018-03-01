(function (beop) {
    var initMap = {
            htmlURL: '/static/scripts/dataManage/views/dm.tag.tree.html',
            cb_on_click: $.noop,
            cb_on_dbl_click: $.noop,
            cb_on_mouseUp: $.noop,
            cb_on_drop: $.noop,
            cb_on_hover: $.noop,
            cb_on_add_dom: $.noop,
            editable: null,
            isOnlyGroup: false,
            showALLNodes: false,
            wrapperNode: false, // 用于判断是否需要有自定义外层包裹文件,设为true则创建,创建后置为false不在创建外层包裹文件.
            hasWrapperNode: false, // 判断有没有外层包裹文件
            isDrag: true,
            showIcon: true,
            itemShowList: [],  // search, finish, edit, btnGroup, dragDirectory, selectPrj
            otherNodes: [],
            isLoadCache: false,
            isAlarm: false,
            diagnosis: false,
            calcPoint: false,
            showTags: false,//是否显示文件夹或点后面的标签
            TREE_CACHE_KEY: 'beop.tag.tree.cache.',
            settable_map: {
                cb_on_click: true,
                cb_on_dbl_click: true,
                cb_on_drop: true,
                cb_on_hover: true,
                cb_on_mouseUp: true,
                cb_on_add_dom: true,
                editable: true,
                isOnlyGroup: true,
                showALLNodes: true,
                wrapperNode: true,
                hasWrapperNode: true,
                itemShowList: true,  // search, finish, edit, btnGroup, dragDirectory, selectPrj
                otherNodes: true,
                isDrag: true,
                showIcon: true,
                isLoadCache: true, //是否从cache中加载tree
                isAlarm: true,
                diagnosis: true,
                calcPoint: true,
                showTags: true
            }
        },
        treeType = {
            functionTree: 'functionTree',
            tagTree: 'tagTree'
        },
        configMap = $.extend(true, {}, initMap),
        _this = this,
        stateMap = {
            treeType: 'tagTree',
            AddNodesName: [],
            equipmentTags: []
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, attachEvents, detachEvents,
        loadTree, showIconForFolder, zTreeAddHoverDom, zTreeRemoveHoverDom, zTreeOnClick, zTreeOnDblClick, changeNameAndIsPrt,
        showTreeItem, getParentNodeByAdd, tagNodesAdd, getSelectTreeNode, getNodeById, addTreeNodeSkin, removeNode, selectNode,
        updateNotClassified, reAsyncParentNodes, getPath, updateNode, isNameExist, clickById, renderTreeNum,
        addDiyDom, getNodesByPId, initAllProject, searchByTagTree, searchByFunctionTree, searchAnalysis, getApiTreeNodeInfo, loadSelectTree, saveDragNodes,
        dealKeywordArr, showTagsStyle, requestDict, getEquipmentTags, getSameNames;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container
        };
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

    init = function ($container) {
        _this.init = true;
        _this.projectId = AppConfig.project && AppConfig.project.bindId ? AppConfig.project.bindId : AppConfig.projectId || AppConfig.projectList[0].id;
        stateMap.$container = $container;
        WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            var isload = false;
            stateMap.$container.html(resultHtml);
            attachEvents();
            setTimeout(function () {
                showTreeItem();
            }, 60);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            configMap.itemShowList.map(function (item) {
                if (item === 'selectPrj') {
                    isload = true;
                    initAllProject();
                }
            });
            stateMap.treeType = treeType.tagTree;
            !isload && loadTree();
            requestDict();
        });
    };

    //---------DOM操作------


    //---------方法---------
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
                selectedMulti: true,
                autoCancelSelected: true,
                showIcon: showIconForFolder,
                showLine: true,
                addHoverDom: !configMap.editable ? $.noop : zTreeAddHoverDom,
                removeHoverDom: zTreeRemoveHoverDom,
                addDiyDom: addDiyDom
            },
            callback: {
                onMouseUp: function (event, treeId, treeNode) {
                    stateMap.AddNodesName = [];
                    configMap.cb_on_mouseUp(event, treeId, treeNode);
                },
                onClick: zTreeOnClick,
                onDblClick: zTreeOnDblClick,

                onNodeCreated: function (event, treeId, treeNode) {
                    if (_this.newSubId) {
                        if (stateMap.zTreeInstance.getNodeByParam('_id', _this.newSubId)) {
                            stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', _this.newSubId));
                            _this.newSubId = null;
                        }
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
                    if (configMap.showALLNodes) {
                        $('#allNodesFolder').show();
                        $('#tagTreeUl').css('height', 'calc(100% - 35px)');
                    }
                    //新增根目录后选中未分类目录
                    if (!treeNode) {
                        stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', ''));
                    }
                    //增加子目录选择该子目录的父级目录
                    if (_this.specificNodeId) {
                        var node = stateMap.zTreeInstance.getNodeByParam('_id', _this.specificNodeId);
                        stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByTId(node.parentTId));
                        _this.specificNodeId = '';
                    }
                    if (_this.clickById) {
                        configMap.cb_on_mouseUp(event, _this.clickById, stateMap.zTreeInstance.getNodeByParam('_id', _this.clickById));
                        stateMap.zTreeInstance.selectNode(_this.treeNode);
                        _this.clickById = false;
                    }

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
                beforeDragOpen: function (treeId, treeNode) {
                    if (treeNode) {
                        return false;
                    }
                },
                beforeDrop: function (treeId, treeNodes, targetNode, moveType) {
                    saveDragNodes(treeId, treeNodes, targetNode, moveType);
                },
                beforeAsync: function (treeId, treeNode) {
                    if (!treeNode) {
                        Spinner.spin($('#tagTreeInfo')[0]);
                    }
                },
                onDrop: function (event, treeId, treeNodes, targetNode, moveType) {
                    if (treeNodes && treeNodes.length) {
                        stateMap.dropNodesTId = [];
                        treeNodes.map(function (item) {
                            stateMap.dropNodesTId.push(item.tId);
                        });
                        var childrenName = [];
                        var childrenNodes = $.extend(true, [], targetNode.children);
                        childrenNodes.forEach(function (item, index) {
                            childrenName.push(item.originName);
                        });
                        if (targetNode && targetNode.children && targetNode.children.length) {
                            var indexArr = [];
                            if (stateMap.isLoad) {
                                // 拖拽合并
                                var noGroupPointCount, pointCount, dealNodes, deleteNodes;
                                for (var i = childrenNodes.length; i--; i >= 0) {
                                    if (stateMap.dropNodesTId.indexOf(childrenNodes[i].tId) !== -1) {
                                        if (childrenName.length !== stateMap.dropNodesTId.length) {
                                            var index = childrenName.lastIndexOf(childrenNodes[i].originName, childrenName.length - stateMap.dropNodesTId.length - 1);
                                            if (index !== -1) {
                                                indexArr.push('' + i + '');
                                                deleteNodes = targetNode.children['' + i + ''];
                                                noGroupPointCount = deleteNodes.noGroupPointCount;
                                                pointCount = deleteNodes.pointCount;
                                                dealNodes = targetNode.children['' + index + ''];
                                                dealNodes.noGroupPointCount += noGroupPointCount;
                                                dealNodes.pointCount += pointCount;
                                                dealNodes.name = dealNodes.originName + '(' + dealNodes.noGroupPointCount + '/' + dealNodes.pointCount + ')';
                                                stateMap.zTreeInstance.updateNode(targetNode.children['' + index + '']);
                                                $('#' + deleteNodes.tId).remove();
                                                stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', dealNodes._id), true);
                                            }
                                        }
                                    }
                                }
                                indexArr.forEach(function (element) {
                                    if (indexArr[0] == element) {
                                        targetNode.children.splice('' + element + '', 1);
                                    } else {
                                        targetNode.children.splice('' + element - 1 + '', 1);
                                    }
                                });
                            } else {
                                var newSelectNodes = [];
                                childrenNodes.forEach(function (item, index) {
                                    if (stateMap.dropNodesTId.indexOf(item.tId) !== -1) {
                                        indexArr.push('' + index + '');
                                        $('#' + item.tId).remove();
                                        newSelectNodes.push(item.originName);
                                    }
                                });
                                indexArr.forEach(function (element) {
                                    if (indexArr[0] == element) {
                                        targetNode.children.splice('' + element + '', 1);
                                    } else {
                                        targetNode.children.splice('' + element - 1 + '', 1);
                                    }
                                });
                                targetNode.children.forEach(function (item) {
                                    if (newSelectNodes.indexOf(item.originName) !== -1) {
                                        stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', item._id), true);
                                    }
                                })
                            }
                        }
                    }

                    if (configMap.hasWrapperNode && configMap.cb_on_drop) {
                        configMap.cb_on_drop(event, treeNodes);
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
                    isMove: configMap.isDrag
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
                    }

                    if (responseData && responseData.data && responseData.data.length) {
                        // 未分类目录国际化及去除图标
                        responseData.data.forEach(function (item) {
                            if (item.name == "未分类目录") {
                                item.name = I18n.resource.tag.tree.UNCLASSIFIED_CATALOG;
                                item.folderType = 1;
                            }
                        });
                        //去除添加保存的节点
                        if (stateMap.AddNodesName && stateMap.AddNodesName.length) {
                            var newNodesData = [];
                            responseData.data.forEach(function (item) {
                                if (stateMap.AddNodesName.indexOf(item.name) == -1) {
                                    newNodesData.push(item);
                                }
                            });
                            responseData.data = newNodesData;
                            stateMap.AddNodesName = [];
                        }
                    }
                    changeNameAndIsPrt(responseData.data);
                    if (responseData.data && responseData.data.length) {
                        responseData.data.forEach(function (item) {
                            addTreeNodeSkin(item);
                        })
                    }

                    Spinner.stop();
                    return responseData.data;
                }
            }
        };

        var $treeUl = $("#tagTreeUl");
        if (!configMap.showALLNodes) {
            $('#allNodesFolder').hide();
        }
        if (configMap.isAlarm) {
            stateMap.zTreeInstance = $.fn.zTree.init($treeUl, zTreeSetting);
        } else {
            if (stateMap.treeType == treeType.tagTree) {
                if (configMap.calcPoint || configMap.diagnosis) {
                    if (configMap.otherNodes && configMap.otherNodes && configMap.otherNodes.length) {
                        stateMap.treeType = treeType.functionTree;
                        stateMap.zTreeInstance = $.fn.zTree.init($treeUl, zTreeSetting, configMap.otherNodes);
                    }
                } else {
                    stateMap.zTreeInstance = $.fn.zTree.init($treeUl, zTreeSetting);
                }

            } else if (stateMap.treeType == treeType.functionTree) {
                if (configMap.otherNodes && configMap.otherNodes && configMap.otherNodes.length) {
                    stateMap.zTreeInstance = $.fn.zTree.init($treeUl, zTreeSetting, configMap.otherNodes);
                }
            }
        }
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
    // 保存拖拽节点
    saveDragNodes = function (treeId, treeNodes, targetNode, moveType) {
        var resultStatus,
            groupName = new Array(),
            thingsId = new Array(),
            groupId = new Array();

        var selectNodes = getSelectTreeNode();
        if (selectNodes.length > 1) {
            var dragNodesTId = [],
                dragNodesName = [],
                deleteIndex = [];
            selectNodes.forEach(function (item) {
                dragNodesTId.push(item.tId);
                dragNodesName.push(item.originName);
            });
            for (var j = 0; j < dragNodesName.length; j++) {
                var index1 = dragNodesName.indexOf(dragNodesName[j], j);
                var index2 = dragNodesName.indexOf(dragNodesName[j], index1 + 1);
                if (index1 !== -1 && index2 && index2 !== -1) {
                    if (stateMap.dropNodesTId.indexOf(dragNodesTId[j]) !== -1) {
                        deleteIndex.push('' + j + '');
                    }
                }
            }
            deleteIndex && deleteIndex.forEach(function (item) {
                if (deleteIndex[0] == item) {
                    treeNodes.splice('' + item + '', 1);
                } else {
                    treeNodes.splice('' + item - 1 + '', 1);
                }
            });
            stateMap.dropNodesTId = [];
        }

        if (treeNodes && treeNodes.length) {
            for (var i = 0; i < treeNodes.length; i++) {
                groupId.push(treeNodes[i]._id);
                groupName.push(treeNodes[i].originName);
            }
        }
        Spinner.spin($('#tagTreeUl').get(0));
        stateMap.isLoad = false;
        $.ajax({
            url: "/tag/moveThings",
            async: false,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                thingsId: thingsId,
                groupName: groupName,
                projId: _this.projectId,
                groupId: groupId,
                Prt: targetNode ? targetNode._id : null
            })
        }).done(function (result) {
            if (!result.success) {
                alert.danger(result.msg);
                return;
            }
            if (treeNodes[0].isParent) {
                renderTreeNum(treeNodes, targetNode);
            }
            resultStatus = result.success;
            if (targetNode && targetNode.children) {
                stateMap.isLoad = true;
            }
        }).always(function () {
            Spinner.stop();
        });
        return resultStatus;
    };

    // 刷新拖拽后文件夹中文件的数量
    renderTreeNum = function (nodes, targetNode) {
        var node = $.extend(true, {}, nodes[0]);
        var sourceIdList = [], sourceNodeList = [],
            targetIdList = [], targetNodeList = [];
        var changeNum = 0;
        nodes.forEach(function (item) {
            changeNum += item.pointCount;
        });
        while (node) {
            if (node.parentTId) {
                node = stateMap.zTreeInstance.getNodeByTId(node.parentTId);
                sourceIdList.push(node.tId);
                sourceNodeList.push(node);
            } else {
                node = null;
            }
        }
        while (targetNode) {
            targetIdList.push(targetNode.tId);
            targetNodeList.push(targetNode);
            if (targetNode.parentTId) {
                targetNode = stateMap.zTreeInstance.getNodeByTId(targetNode.parentTId);
            } else {
                targetNode = null;
            }
        }

        var sourceFilterList = [];
        for (var i = 0; i < sourceIdList.length; i++) {
            var index = $.inArray(sourceIdList[i], targetIdList);
            if ((index === -1)) {
                sourceFilterList.push(sourceIdList[i]);
            } else {
                targetIdList = targetIdList.splice(0, index);
                break;
            }
        }

        for (var j = 0; j < sourceFilterList.length; j++) {
            sourceNodeList[j].pointCount = sourceNodeList[j].pointCount - changeNum;
            stateMap.zTreeInstance.updateNode(sourceNodeList[j]);
            if (sourceNodeList[j].pointCount) {
                $("#" + sourceFilterList[j] + '_span').text(sourceNodeList[j].originName + '(' + sourceNodeList[j].noGroupPointCount + '/' + sourceNodeList[j].pointCount + ')');
            } else {
                $("#" + sourceFilterList[j] + '_span').text(sourceNodeList[j].originName);
            }
        }
        for (var k = 0; k < targetIdList.length; k++) {
            targetNodeList[k].pointCount = targetNodeList[k].pointCount + changeNum;
            stateMap.zTreeInstance.updateNode(targetNodeList[k]);
            $("#" + targetIdList[k] + '_span').text(targetNodeList[k].originName + '(' + targetNodeList[k].noGroupPointCount + '/' + targetNodeList[k].pointCount + ')');
        }
    };

    initAllProject = function () {
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
                loadTree();
            })
            .val(_this.projectId)
            .trigger('change')
            .on("select2:open", function () {
                $('.select2-results__options').addClass('gray-scrollbar');
            });
    };

    getNodesByPId = function (id) {
        return stateMap.zTreeInstance.getNodesByParam('prt', id);
    };

    addTreeNodeSkin = function (node) {
        if (node.tag && node.tag.length) {
            var equipment = beop.model.dmModel.hasEquipment(node.tag);
            var tagIconsMap = beop.model.dmModel.getTagIcons();
            if (equipment) {
                if (tagIconsMap[equipment.name.toLowerCase()]) {
                    node.iconSkin = ' icon iconfont ' + tagIconsMap[equipment.name.toLowerCase()];
                }
            } else {
                delete node['iconSkin'];
            }
        }
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
        var $liNode = $("#" + treeNode.tId);
        if (configMap.hasWrapperNode && configMap.cb_on_hover) {
            $liNode.find('.edit').remove();
            configMap.cb_on_hover(treeNode);
            return;
        }
        $liNode.children('a').hover(function () {
            if (treeNode.hasStyle == true) {
                $(this).css({'background-color': '#fcb813', 'opacity': 1, 'color': '#eee'});
            } else {
                $(this).css({'background-color': '#fcb813', 'opacity': 1, 'color': '#eee'});
            }
        }, function () {
            if (treeNode.hasStyle == true) {
                $(this).css({'background-color': 'rgba(0,0,0,0)'});
            } else {
                $(this).css({'background-color': 'rgba(0,0,0,0)'});
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

        if (treeNode.isParent && configMap.showIcon) {
            var nodeContainer = $liNode.children('a');
            if (!$liNode.find('.iconOperatingBox').length) {
                nodeContainer.append('<span class="iconOperatingBox"></span>');
            }
            var $iconBox = $(nodeContainer).find('.iconOperatingBox');
            if (!$liNode.find('.rename').length) {
                $iconBox.append('<span class="cp button treeCustomIcon ml5 rename" title="' + I18n.resource.tag.tree.RENAME + '"></span>');
                $liNode.find('.rename').show();
            }
            if (!$liNode.find('.removeNode').length) {
                $iconBox.append('<span class="cp button treeCustomIcon ml5 removeNode" title="' + I18n.resource.tag.tree.DELETE + '"></span>');
                $liNode.find('.removeNode').show();
            }
            if (!$liNode.find('.addNode').length) {
                $iconBox.append('<span class="cp button treeCustomIcon addNode" title="' + I18n.resource.tag.tree.ADD + '"></span>');
                $liNode.find('.addNode').show();
            }

            if (!$liNode.find('.autoMatch').length) {
                $iconBox.append('<span class="icon iconfont icon-zidongshibie cp button treeCustomIcon autoMatch" title="' + I18n.resource.tag.tree.TAG_RECOGNITION + '"></span>');
                $liNode.find('.autoMatch').show();
            }
        }
    };

    zTreeRemoveHoverDom = function (treeId, treeNode) {
        $("#" + treeNode.tId).find('.treeCustomIcon').off().remove();
    };

    addDiyDom = function (treeId, treeNode) {
        //如果是数据源的操作
        configMap.cb_on_add_dom(treeId, treeNode);
    };

    zTreeOnClick = function (event, treeId, treeNode) {
        //处理ztree多选中,同时选择非同级文件夹,并取消最后一次选中.
        var selectedPrt, selectedMorePrt,
            selectedNode = getSelectTreeNode();
        selectedPrt = selectedNode[0].parentTId;
        var $allNodesFolder = $('#allNodesFolder');
        if ($allNodesFolder.hasClass('active')) {
            $allNodesFolder.removeClass('active');
        }
        if (selectedNode.length > 1) {
            for (var i = 1; i < selectedNode.length; i++) {
                selectedMorePrt = selectedNode[i].parentTId;
                if (selectedPrt !== selectedMorePrt) {
                    stateMap.zTreeInstance.cancelSelectedNode(selectedNode[selectedNode.length - 1]);
                    alert.warning(I18n.resource.tag.tree.NOT_SUPPORT_NON_CLASS_DRAG);
                    return;
                }
            }
        }

        _this.treeNode = treeNode;
        configMap.editable && zTreeAddHoverDom(treeId, treeNode);
        var $target = $(event.target);
        if ($target.is('.addNode')) {
            configMap.cb_on_click(treeNode, 'addNode');
            $('#tagEditContentInfo').find('.operating-lists').hide();
        } else if ($target.is('.removeNode')) {
            confirm(I18n.resource.tag.tree.CONFIRM_TO_DELETE_DIRECTORY + ' ' + treeNode.originName + '  ?', function () {
                Spinner.spin(ElScreenContainer);
                WebAPI.post('/tag/del', {
                    projId: _this.projectId,
                    groupId: treeNode._id
                }).done(function (result) {
                    if (result.success) {
                        var parentTId = getParentNodeByAdd().parentTId;
                        stateMap.zTreeInstance.removeNode(treeNode, true);
                        if (parentTId) {
                            var parentsNode = treeNode.getParentNode();
                            parentsNode.noGroupPointCount += treeNode.pointCount;
                            parentsNode.name = parentsNode.originName + '(' + parentsNode.noGroupPointCount + '/' + parentsNode.pointCount + ')';
                            stateMap.zTreeInstance.updateNode(parentsNode);
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
        var $tagTreeInfo = $("#tagTreeInfo");
        for (var i = 0; i < configMap.itemShowList.length; i++) {
            var $searchBox = $tagTreeInfo.find('[item="' + configMap.itemShowList[i] + '"]');
            $searchBox.show();
            if (configMap.isAlarm) {
                $searchBox.find('.selectTreeType').hide();
                $searchBox.find('.tagTreeBox').show();
                $searchBox.find('.functionTreeBox').hide();
            }
        }
    };

    updateNotClassified = function () {
        var notClassified = stateMap.zTreeInstance.getNodeByParam('_id', '');
        $.ajax({
            url: '/tag/thingTree/detail',
            type: 'POST',
            async: true,
            data: JSON.stringify({"Prt": "", "projId": _this.projectId, "limit": 1000, "skip": 1}),
            contentType: 'application/json'
        }).done(function (result) {
            notClassified.pointCount = result.data.count ? result.data.count : 0;
            notClassified.name = notClassified.originName + '(' + notClassified.pointCount + ')';
            stateMap.zTreeInstance.updateNode(notClassified);
        });
    };

    /***
     * 新增点或刷新父节点
     * @param nodes
     * @param reAsyncPrt true新增子目录  false新增待输入的目录来显示新增后的位置
     * @param isRoot
     */
    tagNodesAdd = function (nodes, reAsyncPrt, isRoot, addSource) {
        if (reAsyncPrt && !isRoot) {
            //新增子目录
            stateMap.zTreeInstance.reAsyncChildNodes(stateMap.zTreeInstance.getNodeByTId(getParentNodeByAdd().parentTId), "refresh");
            _this.specificNodeId = nodes._id;
        } else {
            stateMap.zTreeInstance.addNodes(isRoot ? '' : getParentNodeByAdd(), nodes);
            //新增根目录或者根目录显示的位置
            if (isRoot) {
                if (addSource && addSource == 'keywords') {
                } else {
                    stateMap.zTreeInstance.selectNode(stateMap.zTreeInstance.getNodeByParam('_id', nodes._id));
                }
                updateNotClassified();
            } else {
                //新增子目录显示的位置
                _this.newSubId = nodes._id;
                stateMap.AddNodesName = [nodes.name];
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

    clickById = function (id) {
        _this.clickById = id;
    };

    isNameExist = function (prt, id, name) {
        var nodes;
        if (prt == null) {
            nodes = stateMap.zTreeInstance.getNodes();
        } else {
            if (stateMap.zTreeInstance.getNodeByParam('_id', prt)) {
                nodes = stateMap.zTreeInstance.getNodeByParam('_id', prt).children;
            } else {
                nodes = stateMap.zTreeInstance.getNodes();
            }
        }
        if (nodes) {
            for (var i = 0, iLen = nodes.length; i < iLen; i++) {
                if (id) {
                    if (nodes[i]._id !== id && nodes[i].originName == name) {
                        return true;
                    }
                } else if (nodes[i].originName == name) {
                    return true;
                }
            }
        }
        return false;
    };

    getSameNames = function (prt, id, names) {
        var nodes;
        var sameName = [];
        if (prt == null) {
            nodes = stateMap.zTreeInstance.getNodes();
        } else {
            if (stateMap.zTreeInstance.getNodeByParam('_id', prt)) {
                nodes = stateMap.zTreeInstance.getNodeByParam('_id', prt).children;
            } else {
                nodes = stateMap.zTreeInstance.getNodes();
            }
        }
        if (nodes) {
            for (var i = 0, iLen = nodes.length; i < iLen; i++) {
                if (names.indexOf(nodes[i].originName) !== -1) {
                    sameName.push(nodes[i].originName);
                }
            }
            return sameName;
        }
        return sameName;
    };

    getPath = function (treeNode) {
        return treeNode.getPath();
    };

    updateNode = function (node, checkTypeFlag) {
        stateMap.zTreeInstance.updateNode(node);
    };

    var getTreeCacheKey = function () {
        return configMap.TREE_CACHE_KEY + _this.projectId;
    };

    var storeTreeCache = function (nodes) {
        if (nodes) {
            try {
                //防止过多的占用localStorage
                clearTreeCache();
                localStorage.setItem(getTreeCacheKey(), JSON.stringify(nodes));
            } catch (e) {
                console.error('保存TreeCache出错:' + e);
            }
        }
    };

    //清除TreeCache
    var clearTreeCache = function () {
        Object.keys(localStorage).forEach(function (key) {
            if (key.startsWith(configMap.TREE_CACHE_KEY)) {
                localStorage.removeItem(key);
            }
        })
    };

    searchByFunctionTree = function () {
        var searchVal = $('#functionTreeInput').val();
        if (!searchVal) {
            loadTree();
            return;
        }
        var allInfo = getApiTreeNodeInfo();
        var resultList = [];
        var regex = new RegExp(searchVal.replace(/\s+/g, '.*'));
        for (var i = 0; i < allInfo.length; i++) {
            if (regex.test(allInfo[i].children.name)) {
                resultList.push(allInfo[i]);
            }
        }
        var nodeTypeNameList = [],
            subNodeObj = {};
        resultList.forEach(function (item) {
            var nodeTypeNameObj = {
                children: []
            };
            if (!subNodeObj[item.api_type]) {
                subNodeObj[item.api_type] = item.api_type;
                nodeTypeNameObj.id = item.id;
                nodeTypeNameObj.name = item.api_type;
                nodeTypeNameObj.prt = item.prt;
                nodeTypeNameObj.type = item.type;
                nodeTypeNameObj._id = item._id;
                nodeTypeNameObj.isParent = true;
                for (var i = 0; i < resultList.length; i++) {
                    if (nodeTypeNameObj.name == resultList[i].api_type) {
                        nodeTypeNameObj.children.push(resultList[i].children);
                    }
                }
                nodeTypeNameList.push(nodeTypeNameObj);
            }
        });
        loadSelectTree(nodeTypeNameList);
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

    searchByTagTree = function () {
        var tagArr = $.extend(true, [], _this.tagsArr);
        dealKeywordArr();
        var tag = [], searchName = [];
        var tagAndPointArr = $('#searchTreeNode').val();
        if (!tagAndPointArr) {
            loadTree();
            return;
        } else {
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

        var data = {
            tag: tag,
            projId: _this.projectId,
            isTree: 1,
            searchName: searchName
        };
        searchAnalysis(data);
    };
    getApiTreeNodeInfo = function () {
        var apiTreeNodeList = [];
        configMap.otherNodes.forEach(function (element) {
            if (element.children && element.children.length) {
                for (var i = 0; i < element.children.length; i++) {
                    var apiTreeNodeInfo = {
                        api_type: element.name,
                        type: element.type,
                        prt: element.prt,
                        id: element.id,
                        _id: element._id,
                        children: {
                            dis_cription: element.children[i].dis_cription,
                            name: element.children[i].name,
                            pId: element.children[i].pId,
                            sample: element.children[i].sample,
                            _id: element.children[i]._id
                        }
                    };
                    apiTreeNodeList.push(apiTreeNodeInfo);
                }
            }
        });
        return apiTreeNodeList;
    };
    searchAnalysis = function (data) {
        Spinner.spin($('#tagTreeUl').get(0));
        WebAPI.post('/tag/search/tagAnalysis', data).done(function (result) {
            if (result.data && result.data.length) {
                loadSelectTree(result.data, data.tag);
            } else {
                $('#tagTreeUl').empty();
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    changeNameAndIsPrt = function (treeItems, tags) {
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
            treeItem['title'] = treeItem['originName'];
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

            configMap.showTags && subTags && subTags.map(function (item) {
                if (tags && tags.indexOf(item) !== -1) {
                    tagsHtml += '<span class="treeTagItem active" data-tag="' + item.toLocaleLowerCase() + '" ' +
                        'data-toggle="tooltip" data-placement="right" title="">' + item + '</span>';
                } else {
                    tagsHtml += '<span class="treeTagItem" data-tag="' + item.toLocaleLowerCase() + '" ' +
                        'data-toggle="tooltip" data-placement="right" title="">' + item + '</span>';
                }
            });

            var showPointCount = treeItem['pointCount'] ? treeItem['noGroupPointCount'] >= 0 ? '(' + treeItem['noGroupPointCount'] + '/' + treeItem['pointCount'] + ')' : '(' + treeItem['pointCount'] + ')' : '';
            treeItem['name'] = treeItem['name'] + '' + showPointCount;
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
    loadSelectTree = function (data, tag) {
        var $tagTreeUl = $('#tagTreeUl');
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
                addHoverDom: !configMap.editable ? $.noop : zTreeAddHoverDom,
                removeHoverDom: zTreeRemoveHoverDom,
                addDiyDom: addDiyDom
            },
            callback: {
                onMouseUp: configMap.cb_on_mouseUp,
                onClick: zTreeOnClick,
                beforeDragOpen: function (treeId, treeNode) {
                    if (treeNode) {
                        return false;
                    }
                },
                beforeDrop: function (treeId, treeNodes, targetNode, moveType) {
                    saveDragNodes(treeId, treeNodes, targetNode, moveType);
                },
                beforeAsync: function (treeId, treeNode) {
                    if (!treeNode) {
                        Spinner.spin($('#tagTreeInfo')[0]);
                    }
                },
                onDrop: function (event, treeId, treeNodes, targetNode, moveType) {
                    if (configMap.hasWrapperNode && configMap.cb_on_drop) {
                        configMap.cb_on_drop(event, treeNodes);
                    }
                },
                onExpand: function (event, treeId, treeNode) {
                    if (treeNode.children && treeNode.children.length) {
                        showTagsStyle(treeNode.children);
                    }
                },
                onDblClick: function (event, treeId, treeNode) {
                    if (configMap.cb_on_dbl_click) {
                        configMap.cb_on_dbl_click(treeNode);
                    }
                    if (treeNode.children && treeNode.children.length) {
                        var $folderIoc = $('#' + treeNode.tId + '_ico');
                        if ($folderIoc.hasClass('ico_open')) {
                            showTagsStyle(treeNode.children);
                        }
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
                    isMove: configMap.isDrag
                }
            }
        };
        $tagTreeUl.empty();
        changeNameAndIsPrt(data, tag);
        stateMap.zTreeInstance = $.fn.zTree.init($tagTreeUl, zTreeSetting, data);
        if (stateMap.treeType == treeType.functionTree) {
            stateMap.zTreeInstance.expandAll(true);
        } else if (stateMap.treeType == treeType.tagTree) {
            var allNodes = stateMap.zTreeInstance.getNodes();
            showTagsStyle(allNodes);
        }
    };

    //---------事件---------
    attachEvents = function () {
        var isFirstCopy = true, isFirstCopyTreeLoad = true, isFirstPasteTreeLoad = true;
        stateMap.$container.off('click.finishFolder').on('click.finishFolder', '#finishFolder', function () {
            location.href = '#page=DmTagMark&projectId=' + _this.projectId;
        });
        stateMap.$container.off('click.editFolder').on('click.editFolder', '#editFolder', function () {
            location.href = '#page=DmTagTreeEdit&projectId=' + _this.projectId;
        });
        stateMap.$container.off('click.tagTreeAdd').on('click.tagTreeAdd', '#tagTreeAdd', function () {
            var selectedNode = getSelectTreeNode()[0];
            if (selectedNode) {
                configMap.cb_on_click(selectedNode, 'addNode');
            }
            $('#tagEditContentInfo').find('.operating-lists').hide();
        });

        stateMap.$container.off('click.allNodesFolder').on('click.allNodesFolder', '#allNodesFolder', function () {
            var $this = $(this);
            var selectedNode = getSelectTreeNode()[0];
            if (selectedNode) {
                $('#' + selectedNode.tId + '_a').removeClass('curSelectedNode');
            }
            $this.addClass('active');
            configMap.cb_on_click('showAll');
        });

        stateMap.$container.off('click.dragDirectory').on('click.dragDirectory', '#dragDirectory', function (e) {
            var $modalWin = $("#tagFormatBrushWin"), $tagCopyAndPasteBox = $("#tagCopyAndPasteBox");
            if (!isFirstCopy) {
                $modalWin.modal();
                return;
            }
            isFirstCopy = false;
            var Spinner = new LoadingSpinner({color: "#00FFFF"});
            var otherParamList = ['projId', _this.projectId];
            otherParamList.push('isOnlyGroup');
            otherParamList.push(!!configMap.isOnlyGroup);
            var copyTreeSetting = {
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
                    fontCss: function (treeId, treeNode) {
                        return treeNode.hasStyle ? {color: '#ff8b03'} : {};
                    }
                },
                callback: {
                    onAsyncError: function () {
                        Spinner.stop();
                    },
                    onAsyncSuccess: function (event, treeId, treeNode, msg) {
                        Spinner.stop();
                    },
                    beforeAsync: function () {
                        if (isFirstCopyTreeLoad) {
                            isFirstCopyTreeLoad = false;
                            Spinner.spin($tagCopyAndPasteBox[0]);
                        } else {
                            Spinner.spin($('#tagTreeCopyUl')[0]);
                        }
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

                        changeNameAndIsPrt(responseData.data);
                        Spinner.stop();
                        return responseData.data;
                    }
                }
            };
            var pasteTreeSetting = $.extend({}, copyTreeSetting, {
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
                    selectedMulti: true
                },
                callback: {
                    beforeAsync: function () {
                        if (isFirstPasteTreeLoad) {
                            isFirstPasteTreeLoad = false;
                            Spinner.spin($tagCopyAndPasteBox[0]);
                        } else {
                            Spinner.spin($('#tagTreePasteUl')[0]);
                        }
                    }
                }
            });
            stateMap.zTreeCopyInstance = $.fn.zTree.init($("#tagTreeCopyUl"), copyTreeSetting);
            stateMap.zTreePasteInstance = $.fn.zTree.init($("#tagTreePasteUl"), pasteTreeSetting);
            $modalWin.modal();
        });
        $("#tagFormatBrushConfirm").off().on('click', function (e) {
            if (!stateMap.zTreeCopyInstance.getSelectedNodes().length || !stateMap.zTreePasteInstance.getSelectedNodes().length) {
                alert(I18n.resource.tag.tree.LESS_THAN_TWO_NODES_MSG);
                return;
            }
            Spinner.spin(document.body);
            var pasteTagIds = [],
                copyTagId = stateMap.zTreeCopyInstance.getSelectedNodes()[0]._id,
                pasteTagNodes = stateMap.zTreePasteInstance.getSelectedNodes();
            for (var i = 0; i < pasteTagNodes.length; i++) {
                pasteTagIds.push(pasteTagNodes[i]._id);
            }
            WebAPI.post('/tag/formatPainter', {
                'projId': _this.projectId,
                'sample': copyTagId,
                'target': pasteTagIds
            }).done(function (result) {
                if (result.success) {
                    alert(I18n.resource.tag.tree.FORMAT_SUCCESS);
                    var treeNode = $.fn.zTree.getZTreeObj("tagTreeUl").getSelectedNodes()[0];
                    configMap.cb_on_click(treeNode);
                } else {
                    alert(result.msg);
                }
            }).always(function () {
                Spinner.stop();
            });
            $("#tagFormatBrushWin").modal('hide');
        });
        stateMap.$container.off('click.functionTreeBtn').on('click.functionTreeBtn', '#functionTreeBtn', function () {
            stateMap.treeType = treeType.functionTree;
            var $this = $(this);
            var $selectTreeType = $this.closest('.selectTreeType');
            $selectTreeType.siblings('.tagTreeBox').hide();
            $selectTreeType.siblings('.functionTreeBox').show();
            if (!$this.hasClass('active')) {
                $this.addClass('active').siblings().removeClass('active');
                searchByFunctionTree();
            }
        });

        stateMap.$container.off('click.tagTreeBtn').on('click.tagTreeBtn', '#tagTreeBtn', function () {
            stateMap.treeType = treeType.tagTree;
            configMap.diagnosis = false;
            configMap.calcPoint = false;
            var $this = $(this);
            var $selectTreeType = $this.closest('.selectTreeType');
            $selectTreeType.siblings('.tagTreeBox').show();
            $selectTreeType.siblings('.functionTreeBox').hide();
            if (!$this.hasClass('active')) {
                $this.addClass('active').siblings().removeClass('active');
                searchByTagTree();

            }
        });

        // tree 搜索
        stateMap.$container.off('click.searchByTagTree').on('click.searchByTagTree', '#searchByTagTree', function () {
            searchByTagTree();
        });
        //tree 回车搜索
        stateMap.$container.off('keyup.search').on('keyup.search', '.select2-search__field', function (e) {
            if (e.keyCode === 13) {
                _this.isStopOpen = true;
                searchByTagTree();
            }
        });

        stateMap.$container.off('click.searchByFunctionTree').on('click.searchByFunctionTree', '#searchByFunctionTree', function () {
            searchByFunctionTree();
        });

        stateMap.$container.off('keyup.funcSearch').on('keyup.funcSearch', '#functionTreeInput', function (event) {
            if (event.keyCode == 13) {
                searchByFunctionTree();
            }
        });


        configMap.itemShowList.map(function (item) {
            if (item === 'search') {
                $.ajax({
                    url: '/tag/dict/',
                    type: 'GET',
                    contentType: 'application/json',
                    async: false
                }).done(function (result) {
                    if (result.success) {
                        var returnData = [];
                        _this.tagsArr = [];
                        result.data.map(function (item, index) {
                            var children = [];
                            item.tags.map(function (i, x) {
                                _this.tagsArr.push(i.name);
                                children[x] = {id: i.name, text: i.name, isTag: true}
                            });
                            returnData[index] = {text: item.groupNm, children: children};
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
                        });
                    }
                });
            }
        });
    };

    detachEvents = function () {
        $(window).off('mousemove.dm.dragDirectory').off('mouseup.dm.dragDirectory');
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
        isNameExist: isNameExist,
        clickById: clickById,
        getNodesByPId: getNodesByPId,
        storeTreeCache: storeTreeCache,
        getSameNames: getSameNames
    };
}(beop || (beop = {})));

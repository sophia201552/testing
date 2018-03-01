var DmTagTreeEdit = (function () {
    var _this;
    var PAGE_SIZE_STORAGE_KEY = 'dm.tag.edit.page.size';

    var pointState = {
        keywordPoints: 'keywordPoints',
        rulePoints: 'rulePoints'
    };
    var dragType = {
        keyword: 'keyword',
        point: 'point'
    };

    var stateMap = {
        point: pointState.keywordPoints,
        drag: dragType.point
    };

    function DmTagTreeEdit(projectId) {
        _this = this;
        PointManager.call(_this, projectId);
        _this.htmlUrl = '/static/scripts/dataManage/views/dm.importTag.html';
        _this.projectId = projectId;
        _this.nodePrt = '';
        _this.nodeId = '';
        _this.keyword = '';
        this.pointList = [];
        _this.treeParentsNodes = [];
    }

    DmTagTreeEdit.prototype = Object.create(PointManager.prototype);
    DmTagTreeEdit.prototype.constructor = DmTagTreeEdit;


    var DmTagTreeEditFunc = {
        show: function () {
            _this.init().done(function () {
                _this.$container = $("#tagContainer");
                _this.$container.html(beopTmpl('tpl_tag_edit'));
                beop.tag.keywords.configModel({
                    cb_on_click: function (keyword) {
                        _this.keyword = String(keyword);
                        if ($("#ruleForm").length) { // 放在规则下部
                            $("#ruleTableBox").hide();
                            $("#keywordInfo").empty().append(beopTmpl('tpl_tag_keyword_box')).show();
                        } else { // 放在整个中间部分
                            _this.$container.find('#tagEditContentInfo').empty().append(beopTmpl('tpl_tag_keyword_box'));
                        }
                        var keywordPath = _this.curTreePath + ' / ' + I18n.resource.tag.edit.KEYWORDS + ' ' + _this.keyword;
                        _this.$container.find('#keywordName').text(keywordPath);
                        _this.refreshKeywordsSheet();
                        I18n.fillArea(_this.$container);
                    },
                    cb_on_mousedown: function (event, keywordsForFolder, keywordsForName, keywordsForCount) {
                        stateMap.drag = dragType.keyword;
                        _this.folderNameList = [];
                        _this.dragPointsCount = null;
                        for (var i = 0; i < keywordsForFolder.length; i++) {
                            _this.folderNameList.push(keywordsForFolder[i]);
                            _this.dragPointsCount += Number(keywordsForCount[i]);
                        }
                        _this.dragStartClientX = event.clientX;
                        _this.dragStartClientY = event.clientY;

                        var dragKeywordsBox = document.createElement("div");
                        dragKeywordsBox.id = 'dragKeywordsBox';
                        dragKeywordsBox.style.background = 'rgba(0,119,238,0.7)';
                        dragKeywordsBox.style.borderRadius = '16px';
                        dragKeywordsBox.style.padding = '4px 16px';
                        dragKeywordsBox.style.color = '#fff';
                        dragKeywordsBox.style.left = event.clientX + 5 + 'px';
                        dragKeywordsBox.style.top = event.clientY + 5 + 'px';
                        dragKeywordsBox.style.position = 'absolute';
                        dragKeywordsBox.style.zIndex = 1;
                        var KeywordsHtml = '';
                        for (var j = 0; j < keywordsForName.length; j++) {
                            KeywordsHtml += '<span>' + keywordsForName[j] + '</span>' + '<br>';
                        }
                        dragKeywordsBox.innerHTML = KeywordsHtml;
                        document.body.appendChild(dragKeywordsBox);
                        var $dragKeywordsBox = document.getElementById("dragKeywordsBox");
                        $dragKeywordsBox.style.display = 'none';
                        _this.mousemove = false;
                        document.addEventListener('mousemove', function () {
                            if ($dragKeywordsBox && _this.mousemove) {
                                $dragKeywordsBox.style.display = 'block';
                            }
                        });
                        $(window).off('mousemove.dm.dragkeywords').on('mousemove.dm.dragkeywords', function (e) {
                            if (!_this.mousemove) {
                                if (Math.abs(e.clientX - _this.dragStartClientX) > 1 && Math.abs(e.clientY - _this.dragStartClientY) > 1) {
                                    _this.mousemove = true;
                                }
                            }
                            $dragKeywordsBox.style.left = e.clientX + 5 + 'px';
                            $dragKeywordsBox.style.top = e.clientY + 5 + 'px';
                        }).one('mouseup.dm.dragkeywords', function () {
                            $dragKeywordsBox.remove();
                            _this.mousemove = false;
                        });
                    }
                });
                _this.attachEvents();
                beop.tag.tree.configModel(
                    {
                        itemShowList: ['finish', 'btnGroup'],
                        isOnlyGroup: true,
                        hasWrapperNode: false,
                        editable: true,
                        isDrag: true,
                        showIcon: true,
                        isLoadCache: false,
                        showALLNodes: false,
                        cb_on_mouseUp: function (event, treeId, treeNode) {
                            if (document.getElementById("dragBox") && treeNode) {
                                var selectNode = beop.tag.tree.getSelectTreeNode()[0];
                                if (_this.groupPrtId == treeNode._id) {
                                    alert(I18n.resource.tag.edit.DRAG_POINTS_TITLE);
                                    return;
                                }
                                WebAPI.post('/tag/moveThings', {
                                    projId: AppConfig.projectId,
                                    thingsId: _this.thingIds,
                                    groupId: _this.groupId,
                                    groupName: _this.groupName,
                                    Prt: treeNode._id
                                }).done(function (result) {
                                    if (result.success) {
                                        if (treeNode._id !== _this.nodeId) {
                                            _this.$container.find(".dragPromptText").hide();
                                            var parentsNodes = beop.tag.tree.getPath(treeNode);

                                            var isLoadChildren = true;
                                            parentsNodes.forEach(function (item) {
                                                if (item._id == selectNode._id) {
                                                    isLoadChildren = false;
                                                }
                                            });
                                            _this.adjustParentNumber(_this.treeParentsNodes, selectNode);
                                            _this.adjustParentNumber(parentsNodes, treeNode);

                                            if (_this.groupId.length) {
                                                if (_this.nodeTId) {
                                                    beop.tag.tree.reAsyncParentNodes(_this.nodeTId);
                                                }
                                                if (treeNode.tId && isLoadChildren) {
                                                    beop.tag.tree.reAsyncParentNodes(treeNode.tId);
                                                }
                                            } else {
                                                if (_this.nodeTId) {
                                                    beop.tag.tree.reAsyncParentNodes(_this.nodeTId);
                                                }
                                            }

                                            if (stateMap.point == pointState.keywordPoints) {
                                                _this.refreshKeywordsSheet();
                                            } else if (stateMap.point == pointState.rulePoints) {
                                                _this.refreshSheet();
                                            }
                                            beop.tag.keywords.init($(".tag-right-box"));
                                        }
                                    } else {
                                        alert.danger(I18n.resource.tag.edit.NO_DATA_RETURNED);
                                    }
                                });
                            } else if (document.getElementById("dragKeywordsBox") && treeNode) {
                                if (treeNode.folderType && treeNode.folderType === 1) {
                                    document.getElementById("dragKeywordsBox").remove();
                                    return;
                                }

                                Spinner.spin($('#tagTreeUl').get(0));
                                var postData = {
                                    name: _this.folderNameList, // 创建的目录名
                                    keywords: beop.tag.keywords.getKeywordsPram('all'), // 用于创建目录名的关键字列表,
                                    projId: AppConfig.projectId,
                                    Prt: _this.nodeId,
                                    parent: treeNode._id
                                };

                                WebAPI.post('/tag/groupTree/createByKeywords', postData).done(function (result) {
                                    if (result.success) {
                                        var parentsNodes = beop.tag.tree.getPath(treeNode);
                                        _this.adjustParentNumber(_this.treeParentsNodes, selectNode);
                                        _this.adjustParentNumber(parentsNodes, treeNode);
                                        if (_this.nodePTId) {
                                            beop.tag.tree.reAsyncParentNodes(_this.nodePTId);
                                        }
                                        if (treeNode.parentTId) {
                                            beop.tag.tree.reAsyncParentNodes(treeNode.parentTId);
                                        }
                                        beop.tag.keywords.init($(".tag-right-box"));
                                    }
                                }).always(function () {
                                    Spinner.stop();
                                });
                            }
                        },
                        cb_on_click: function (treeNode, clickType) {
                            _this.nodeId = '';
                            _this.keyword = '';
                            //此时treeNode是父级节点
                            if (clickType === 'rename') {
                                infoBox.prompt(I18n.resource.tag.edit.ENTER_NEW_DIRECTORY_NAME, function (name) {
                                    var newName = $.trim(name);
                                    if (!newName) {
                                        alert.danger(I18n.resource.tag.edit.DIRECTORY_EMPTY_ERR);
                                    } else {
                                        if (beop.tag.tree.isNameExist(treeNode.prt, treeNode._id, newName)) {
                                            infoBox.confirm(I18n.resource.tag.edit.SAME_NAME_MERGE, function () {
                                                _this.renameOrAddFolder(treeNode, newName, 'rename');
                                            });
                                        } else {
                                            _this.renameOrAddFolder(treeNode, newName, 'rename');
                                        }
                                    }
                                });
                                $('.infoBoxPrompt input').val(treeNode.originName);
                                return;
                            }
                            _this.addChildNode = false;
                            _this.isUnclassified = false;
                            _this.addNewNode = false;
                            _this.$container.find('#tagEditContentInfo').empty().append(beopTmpl('tpl_tag_rule_edit'));
                            var $editTitle = $("#editTitle");
                            var $catalogName = $("#catalogName");
                            var $autoIdentifySave = $('#autoIdentifySave');
                            $autoIdentifySave.hide();

                            _this.nodePrt = treeNode.Prt;
                            _this.nodeId = treeNode._id;
                            _this.nodeTId = treeNode.tId;
                            _this.nodePTId = treeNode.parentTId;
                            _this.treeParentsNodes = beop.tag.tree.getPath(treeNode);
                            _this.treeNode = treeNode;
                            if (clickType) {//点击图标
                                if (treeNode.isParent) {
                                    if (clickType === 'addNode') {
                                        if (!treeNode._id) {
                                            _this.addChildNode = false;
                                            _this.isUnclassified = true;
                                        } else {
                                            _this.addChildNode = true;
                                            _this.isUnclassified = false;
                                        }
                                        $catalogName.hide();
                                        $editTitle.text(I18n.resource.tag.inspect.NEW_CATALOGUE);
                                        _this.initEditSection(treeNode);
                                        beop.tag.rule.init($("#ruleBox"));
                                    }
                                }
                            } else {// 点击左侧tree node,加载table数据
                                _this.initPointList(treeNode, $catalogName, $editTitle);
                                $('.searchPointInputBox').show();
                            }
                            _this.curTreePath = $("#editTitle").text();
                            I18n.fillArea(_this.$container);
                        }
                    }
                );
                beop.tag.tree.init(_this.$container.find("#tagTreeBox"));
                //折叠效果
                var side = new SidebarMenuEffect();
                side.init('#tagEditContent');
            });
        },
        renameOrAddFolder: function (treeNode, newName, type) {
            var renameSpinner = new LoadingSpinner({color: '#00FFFF'});
            renameSpinner.spin($('#tagZtreeBox')[0]);
            var opt = {
                projId: AppConfig.projectId,
                folderName: newName
            };
            if (type == 'add') {
                opt.Prt = treeNode ? treeNode._id : '';
            } else {
                opt.groupId = treeNode._id;
            }
            WebAPI.post('/tag/groupTree/save', opt).done(function (result) {
                if (result.success) {
                    if (type == 'add') {
                        var newNode = {
                            'isParent': true,
                            'open': false,
                            'name': newName,
                            'originName': newName,
                            'children': [],
                            '_id': result.data,
                            'pointCount': 0,
                            'title': newName,
                            'noGroupPointCount': 0,
                            'prt': treeNode._id
                        };
                        beop.tag.tree.tagNodesAdd(newNode, false, !treeNode._id);
                    } else if (type == 'rename') {
                        if (treeNode._id) {
                            treeNode.originName = newName;
                            if (treeNode.pointCount) {
                                treeNode.name = treeNode.originName + '(' + treeNode.noGroupPointCount + '/' + treeNode.pointCount + ')';
                            } else {
                                treeNode.name = treeNode.originName;
                            }
                            treeNode.title = treeNode.name;
                            beop.tag.tree.updateNode(treeNode);
                        }
                    }
                } else {
                    alert.danger(result.msg);
                }
            }).always(function () {
                renameSpinner.stop();
            });
        },

        adjustParentNumber: function (parentNodes, node) {
            for (var i = 0; i < parentNodes.length; i++) {
                if (parentNodes == _this.treeParentsNodes) {
                    if (stateMap.drag == dragType.keyword) {
                        parentNodes[i].pointCount -= _this.dragPointsCount;
                    } else if (stateMap.drag == dragType.point) {
                        parentNodes[i].pointCount -= _this.points + _this.folderHavePoints;
                    }
                    if (node._id && parentNodes['' + i + '']._id == node._id) {
                        if (node._id == _this.groupPrtId) {
                            parentNodes[i].noGroupPointCount -= _this.points;
                        }
                    }
                } else {
                    if (stateMap.drag == dragType.keyword) {
                        parentNodes[i].pointCount += _this.dragPointsCount;
                    } else if (stateMap.drag == dragType.point) {
                        parentNodes[i].pointCount += _this.points + _this.folderHavePoints;
                    }
                    if (node._id && parentNodes['' + i + '']._id == node._id) {
                        parentNodes[i].noGroupPointCount += _this.points;
                    }
                }

                if (parentNodes[i].pointCount == 0) {
                    parentNodes[i].name = parentNodes[i].originName;
                } else {
                    if (!parentNodes[i]._id) {
                        parentNodes[i].name = parentNodes[i].originName + '(' + parentNodes[i].pointCount + ')';
                    } else {
                        parentNodes[i].name = parentNodes[i].originName + '(' + parentNodes[i].noGroupPointCount + '/' + parentNodes[i].pointCount + ')';
                    }
                }
                beop.tag.tree.updateNode(parentNodes[i]);
            }
        },

        initPointList: function (treeNode, $catalogName, $editTitle) {
            $("#ruleForm").remove();
            $catalogName.show();
            $editTitle.text(treeNode.originName);
            this.refreshSheet();
            beop.tag.keywords.configModel({prt: treeNode._id});
            beop.tag.keywords.init($(".tag-right-box"));
        },

        initEditSection: function (treeNode) {
            if ($('#isCreateSubFolder').val() != '2') {
                beop.tag.rule.init($("#ruleBox"), treeNode.rule);
            }
            //点击tree节点添加规则图标显示该节点的内容;
            this.refreshSheet(treeNode._id);
        },

        /***
         * 添加方法
         */
        dmReset: function () {
            beop.tag.rule.reset();
        },

        dmRuleTest: function () {
            var html = '', testRule = beop.tag.rule.getRulesString();
            for (var i = 0; i < testRule.length; i++) {
                html += '<span class="ruleCondition">' + testRule[i] + '</span>';
            }
            _this.$container.find("#keywordInfo").hide();
            _this.$container.find("#ruleTableBox").show();
            _this.$container.find("#ruleTextBox").show();
            _this.$container.find("#rule-pass-btn-box").show();
            _this.$container.find("#testCondition").empty().html(html);
            _this.rulePassloadFirst = true;
            _this.ruleNotPassloadFirst = true;
            $('#dm-tab-pass').removeClass('btn-default').addClass('btn-primary').siblings().removeClass('btn-primary').addClass('btn-default');
            _this.refreshTestSheet(true);
        },
        createEmptyFolderConfirm: function () {
            var selectNode = beop.tag.tree.getSelectTreeNode()[0];
            var folderName = $("#createEmptyFolderName").val().trim();
            if (!folderName) {
                alert.danger(I18n.resource.tag.edit.DIRECTORY_EMPTY_ERR);
            } else {
                var _id = selectNode._id ? selectNode._id : null;

                var sameFolderName = [];
                if (_id) {
                    if (selectNode.open) {
                        sameFolderName = beop.tag.tree.getSameNames(_id, null, folderName);
                    } else {
                        sameFolderName = DmTagTreeEdit.prototype.getNodeChildren(folderName);
                    }
                } else {
                    sameFolderName = beop.tag.tree.getSameNames(_id, null, folderName);
                }

                if (sameFolderName.indexOf(folderName) !== -1) {
                    alert(I18n.resource.tag.edit.SAME_NAME_TITLE);
                } else {
                    _this.renameOrAddFolder(selectNode, folderName, 'add');
                }
            }
        },
        dmRuleConfirm: function () {
            var $ruleFolderName = _this.$container.find("#ruleFolderName").val(),
                hasSubFolderVal = parseInt(_this.$container.find("#isCreateSubFolder").val());
            if (!$ruleFolderName) {
                alert.danger(I18n.resource.tag.edit.DIRECTORY_EMPTY_MSG);
                return;
            }
            var selectNode = beop.tag.tree.getSelectTreeNode()[0];
            var $isCreateSubFolder = $('#isCreateSubFolder');
            if ($isCreateSubFolder.val() !== '1' && selectNode.originName == $ruleFolderName) {
                alert('"(' + $ruleFolderName + ')"' + I18n.resource.tag.edit.ADD_NODES_TITLE);
                return;
            }
            var ruleMap = {
                Prt: (_this.addChildNode && $ruleFolderName == selectNode.originName ? selectNode.Prt : selectNode._id) || null,
                projId: _this.projectId,
                folderName: $.trim($ruleFolderName),
                hasSubFolder: hasSubFolderVal,
                rules: beop.tag.rule.getRuleList(),
                groupId: (_this.addChildNode && $ruleFolderName == selectNode.originName) ? selectNode._id : null
            };

            if (hasSubFolderVal === 1) {
                var subFolderPrefixVal = _this.$container.find("#subFolderPrefix").val();
                if (!subFolderPrefixVal) {
                    alert.danger(I18n.resource.tag.edit.SUBDIRECTORY_EMPTY_MSG);
                    return;
                }

                var braces = {
                    beforeBrackets: subFolderPrefixVal.indexOf('{'),
                    afterBrackets: subFolderPrefixVal.indexOf('}')
                };

                if (!(braces.beforeBrackets >= 0) || !(braces.afterBrackets > 0)) {
                    alert.danger(I18n.resource.tag.edit.SUBDIRECTORY_MUST_CONTAIN);
                    return;
                }

                var directoryNumber = subFolderPrefixVal.slice(braces.beforeBrackets + 1, braces.afterBrackets),
                    $ruleUl = _this.$container.find("#ruleUl"),
                    ruleNum = $ruleUl.find('.rule-item').length - 1;

                if (!directoryNumber) {
                    alert.danger(I18n.resource.tag.edit.NUMBER_ERROR);
                    return;
                }

                if (!/^[0-9]*[1-9][0-9]*$/.test(Number(directoryNumber))) {
                    alert.danger(I18n.resource.tag.edit.NUMBER_POSITIVE_INTEGER);
                    return;
                }

                if (ruleNum < parseInt(directoryNumber)) {
                    alert.danger(I18n.resource.tag.edit.CAN_NOT_FIND_RULE + ' ' + parseInt(directoryNumber));
                    return;
                }

                ruleMap.subFolderPrefix = subFolderPrefixVal;
            }
            infoBox.confirm(I18n.resource.tag.edit.WHETHER + beop.tag.rule.getRulesString().join('+') + ' ' + I18n.resource.tag.edit.PRESS_THIS_RULE + I18n.resource.tag.edit.CREATE, function () {
                var selectNode = beop.tag.tree.getSelectTreeNode()[0];
                var addNewFolder = function () {
                    Spinner.spin(_this.$container[0]);
                    WebAPI.post('/tag/groupTree/save', ruleMap).done(function (result) {
                        if (result.success) {
                            var prtId = result.data;
                            if (_this.addChildNode) {
                                if (_this.notMatchCount && _this.notMatchCount >= 0) {
                                    _this.dealPointCount(selectNode, _this.notMatchCount);
                                } else {
                                    _this.getNotMatchCount().done(function (result) {
                                        if (result.success) {
                                            if (result.data) {
                                                _this.dealPointCount(selectNode, result.data.notMatchCount);
                                            }
                                        }
                                    });
                                }
                            } else {
                                if (!selectNode._id) {
                                    if (!beop.tag.tree.getNodeById(prtId)) {
                                        beop.tag.tree.tagNodesAdd(
                                            {
                                                'isParent': true,
                                                'open': false,
                                                'name': ruleMap.folderName,
                                                'originName': ruleMap.folderName,
                                                'children': [],
                                                '_id': prtId,
                                                'pointCount': 0
                                            },
                                            false,
                                            !_this.addChildNode
                                        );
                                    }
                                    $.ajax({
                                        url: '/tag/thingTree/detail',
                                        type: 'POST',
                                        async: false,
                                        data: JSON.stringify({
                                            'Prt': prtId,
                                            'projId': AppConfig.projectId,
                                            'limit': 1000,
                                            'skip': 1
                                        }),
                                        contentType: 'application/json'
                                    }).done(function (newNodeDetail) {
                                        if (newNodeDetail.success) {
                                            var newNode = beop.tag.tree.getNodeById(prtId);
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

                                            if (newNode.pointCount && newNode.pointCount >= 0) {
                                                if ($isCreateSubFolder.val() !== '1') {
                                                    _this.dealPointCount(newNode, newNode.pointCount);
                                                } else {
                                                    _this.dealPointCount(newNode, 0);
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        } else {
                            alert.danger('error:' + result.msg);
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                };
                var sameFolderName = [];
                var _id = selectNode._id ? selectNode._id : null;
                if (_id) {
                    if (selectNode.open) {
                        sameFolderName = beop.tag.tree.getSameNames(ruleMap.Prt, ruleMap.groupId, ruleMap.folderName);
                    } else {
                        sameFolderName = DmTagTreeEdit.prototype.getNodeChildren(ruleMap.folderName);
                    }
                } else {
                    sameFolderName = beop.tag.tree.getSameNames(ruleMap.Prt, ruleMap.groupId, ruleMap.folderName);
                }
                if (sameFolderName.length) {
                    infoBox.confirm(I18n.resource.tag.edit.SAME_NAME_MERGE, function () {
                        addNewFolder();
                    }, function () {
                        return false;
                    });
                } else {
                    addNewFolder();
                }
            });
        },

        getNotMatchCount: function () {
            var data = {
                projId: _this.projectId,
                Prt: _this.nodeId,
                rules: beop.tag.rule.getRuleList(),
                limit: Number(localStorage.getItem(PAGE_SIZE_STORAGE_KEY)),
                skip: 1,
                searchText: ''
            };
            return WebAPI.post('/tag/groupTree/matchThings', data);
        },

        dealPointCount: function (nodes, notMatchCount) {
            nodes.noGroupPointCount = notMatchCount;
            var newPointNum = '(' + nodes.noGroupPointCount + '/' + nodes.pointCount + ')';
            nodes.name = nodes.originName + newPointNum;
            beop.tag.tree.updateNode(nodes);
            beop.tag.tree.reAsyncParentNodes(_this.nodeTId);
            alert.success(I18n.resource.tag.edit.GENERATE_SUCCESS);
        },

        selectOrEmpty: function () {
            var $createEmptyFolderName = $('#createEmptyFolderName'),
                $createEmptyFolderConfirm = $('#createEmptyFolderConfirm'),
                $ruleFolderName = $('#ruleFolderName'),
                $isCreateSubFolder = $('#isCreateSubFolder'),
                $ruleSubFolderNameBox = $('#ruleSubFolderNameBox'),
                $subFolderPrefix = $('#subFolderPrefix'),
                $dmReset = $('#dmReset'),
                $dmRuleTest = $('#dmRuleTest'),
                $markRule = $('#rule-content').find('.rule-item .markRule'),
                $lastRule = $('#rule-content').find('.rule-item:last-child'),
                $dmRuleConfirm = $('#dmRuleConfirm');
            var $isCreateVal = $isCreateSubFolder.val();
            var $radioVal = $('#ruleForm').find('[type=radio]:checked').val();
            if ($radioVal == 'empty') {
                $ruleFolderName.attr('disabled', true);
                $isCreateSubFolder.attr('disabled', true);
                $ruleSubFolderNameBox.attr('disabled', true);
                $subFolderPrefix.attr('disabled', true);
                $dmReset.attr('disabled', true);
                $dmRuleTest.attr('disabled', true);
                $dmRuleConfirm.hide();
                $createEmptyFolderName.attr('disabled', false);
                $createEmptyFolderConfirm.show();
                $markRule.addClass('mark');
                $lastRule.hide();
            } else {
                $ruleFolderName.attr('disabled', false);
                $isCreateSubFolder.attr('disabled', false);
                $dmRuleConfirm.show();
                $dmReset.attr('disabled', false);
                $dmRuleTest.attr('disabled', false);
                $createEmptyFolderConfirm.hide();
                $createEmptyFolderName.attr('disabled', true);
                $markRule.removeClass('mark');
                $lastRule.show();
                if ($isCreateVal == '1') {
                    $subFolderPrefix.removeAttr('disabled');
                }
            }
        },

        isShowSubFolderDom: function () {
            var $subFolderPrefix = $('#subFolderPrefix');
            if ($(this).val() == '1') { // 生成子目录
                $subFolderPrefix.attr('disabled', false);
                beop.tag.rule.init($("#ruleBox"), beop.tag.rule.getRuleList());
            } else {    // 不生成子目录
                $subFolderPrefix.attr('disabled', 'disabled');
            }
        },
        dragPoints: function (e, $this) {
            if ((!_this.addChildNode && !_this.isUnclassified) && $this.hasClass('active')) {
                stateMap.drag = dragType.point;
                var dragElement = _this.$dataTable.simpleDataTable('getSelectedRows');
                if (dragElement) {
                    _this.startClientX = e.clientX;
                    _this.startClientY = e.clientY;
                    var dragBox = document.createElement("div");
                    dragBox.id = 'dragBox';
                    dragBox.style.background = '#fff';
                    dragBox.style.borderRadius = '16px';
                    dragBox.style.padding = '4px 16px';
                    dragBox.style.color = '#222';
                    dragBox.style.boxShadow = '0 0 20px #787878';
                    dragBox.style.left = _this.startClientX + 5 + 'px';
                    dragBox.style.top = _this.startClientY + 5 + 'px';
                    dragBox.style.position = 'absolute';
                    dragBox.style.zIndex = 1;
                    if (dragElement.length == 1) {
                        dragBox.innerHTML = '<span>' + I18n.resource.tag.edit.SELECT + ' ' + dragElement.length + ' ' + I18n.resource.tag.edit.TARGET + '</span>';
                    } else {
                        dragBox.innerHTML = '<span>' + I18n.resource.tag.edit.SELECT + ' ' + dragElement.length + ' ' + I18n.resource.tag.edit.TARGETS + '</span>';
                    }

                    document.body.appendChild(dragBox);

                    var $dragBox = document.getElementById("dragBox");
                    $dragBox.style.display = 'none';
                    _this.mousemove = false;
                    document.addEventListener('mousemove', function () {
                        if ($dragBox && _this.mousemove) {
                            $dragBox.style.display = 'block';
                        }
                    });

                    $(window).off('mousemove.dm.dragPoints').on('mousemove.dm.dragPoints', function (e) {
                        if (!_this.mousemove) {
                            if (Math.abs(e.clientX - _this.startClientX) > 1 && Math.abs(e.clientY - _this.startClientY) > 1) {
                                _this.mousemove = true;
                            }
                        }
                        $dragBox.style.left = e.clientX + 5 + 'px';
                        $dragBox.style.top = e.clientY + 5 + 'px';
                    }).one('mouseup.dm.dragPoints', function () {
                        $dragBox.remove();
                    });
                }
                return false;
            }
        },
        getDragRows: function () {
            var selectedPoints = _this.$dataTable.simpleDataTable('getSelectedData');
            _this.groupPrtId = selectedPoints[0].prt;
            var allRows = _this.$dataTable.simpleDataTable('getAllRows');
            for (var i = 0; i < allRows.length; i++) {
                if ($(allRows[i]).hasClass('active')) {
                    $(allRows[i]).addClass('move');
                } else {
                    if ($(allRows[i]).hasClass('move')) {
                        $(allRows[i]).removeClass('move');
                    }
                }
            }
            _this.thingIds = [];
            _this.groupId = [];
            _this.groupName = [];
            _this.points = 0;
            _this.folderHavePoints = 0;
            if (selectedPoints && selectedPoints.length) {
                for (var i = 0; i < selectedPoints.length; i++) {
                    if (selectedPoints[i].type == 'group') {
                        _this.groupId.push(selectedPoints[i]._id);
                        _this.groupName.push(selectedPoints[i].name);
                        _this.folderHavePoints += selectedPoints[i].count
                    } else {
                        _this.points++;
                        _this.thingIds.push(selectedPoints[i]._id);
                    }
                }
                if (_this.points) {
                    _this.$container.find(".dragPromptText").show();
                }
                if (_this.keyword) {
                    stateMap.point = pointState.keywordPoints;
                    if (_this.addChildNode || (!_this.addChildNode && _this.isUnclassified)) {
                        $('#keywordInfo,.rule-title').find('.dragPromptText').hide();
                        _this.$container.find("#keyword-list-table tr.move").removeClass('move');
                    }
                } else {
                    if (_this.addChildNode || (!_this.addChildNode && _this.isUnclassified)) {
                        _this.$container.find("#ruleTable tr.move").removeClass('move');
                    }
                    stateMap.point = pointState.rulePoints;
                }
            }
        },

        autoIdentifySave: function () {
            var currentPoints = _this.$dataTable.simpleDataTable('getAllData');
            Spinner.spin(ElScreenContainer);
            WebAPI.post('/tag/setTag', {
                projId: AppConfig.projectId,
                arrTag: currentPoints.map(function (item) {
                    return {
                        Id: item._id, tags: item.tags ? item.tags.map(function (tag) {
                            return tag ? tag.trim() : false;
                        }).filter(function (item) {
                            return !!item;
                        }) : [],
                        type: item.type
                    }
                })
            }).done(function (result) {
                if (result.success) {
                    alert.success(I18n.resource.common.SAVE_SUCCESS);
                }
            }).always(function () {
                Spinner.stop();
            })
        },
        refreshKeywordsSheet: function () {
            var queryData = {
                projId: _this.projectId,
                Prt: _this.nodeId
            };
            var $keywordListTable = _this.$container.find("#keyword-list-table");
            queryData['keywords'] = _this.keyword.split(',');

            var dataTableOptions = {
                url: '/tag/getThings/keywords',
                post: WebAPI.post,
                postData: queryData,
                searchOptions: {
                    pageSize: 'limit',
                    pageNum: 'skip',
                    searchText: 'keywords'
                },
                searchInput: _this.$container.find("#textSearch"),
                rowsNums: [200, 500, 1000],
                pageSize: localStorage.getItem(PAGE_SIZE_STORAGE_KEY),
                dataFilter: function (result) {
                    if (result.success) {
                        return result.data.ThingsList;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($keywordListTable.get(0));
                    _this.$container.find(".dragPromptText").hide();
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                onRowClick: function () {
                    _this.getDragRows();
                },
                colNames: [
                    I18n.resource.dataManage.POINT_NAME,
                    I18n.resource.dataManage.REMARK,
                    I18n.resource.dataManage.POINT_VALUE
                ],
                colModel: [
                    {
                        index: 'name',
                        highlight: true
                    },
                    {index: 'note'},
                    {index: 'pointValue'}
                ],
                totalNumIndex: 'data.count'
            };

            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }

            _this.$dataTable = $keywordListTable.off().simpleDataTable(dataTableOptions);
        },
        refreshTestSheet: function (isPass) { // testData 待修改
            var $ruleTable = $("#ruleTable"),
                $ruleNotPassTable = $("#ruleNotPassTable"),
                $refreshTable;
            if (isPass) {
                $ruleTable.show();
                $refreshTable = $ruleTable;
                $ruleNotPassTable.hide();
            } else {
                $refreshTable = $ruleNotPassTable;
                $ruleTable.hide();
                $ruleNotPassTable.show();
            }
            if ((isPass && !_this.rulePassloadFirst) || (!isPass && !_this.ruleNotPassloadFirst)) {
                return;
            }
            var queryData = {
                projId: _this.projectId,
                Prt: _this.nodeId,
                rules: beop.tag.rule.getRuleList()
            };
            if (_this.keyword) {
                queryData['searchText'] = _this.keyword.trim();
            }
            var dataTableOptions = {
                post: WebAPI.post,
                postData: queryData,
                searchOptions: {
                    pageSize: 'limit',
                    pageNum: 'skip'
                },
                searchInput: $("#text_search"),
                rowsNums: [200, 500, 1000],
                pageSize: localStorage.getItem(PAGE_SIZE_STORAGE_KEY),
                onRowClick: function () {
                    if (_this.addChildNode) {
                        $ruleTable.find('tr.move').removeClass('move');
                    }
                },
                dataFilter: function (result) {
                    if (result.success) {
                        _this.notMatchCount = '';
                        _this.notMatchCount = '';
                        if (isPass) {
                            _this.notMatchCount = result.data.notMatchCount;
                            _this.matchCounts = result.data.count;
                        }
                        return result.data.ThingsList;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($refreshTable.get(0));
                },
                onAfterRender: function () {
                    if (isPass) {
                        _this.$container.find('.notPassedNumBox').show();
                        _this.$container.find('.notPassedNum').text(_this.notMatchCount);
                        _this.$container.find('.passedNum').text(_this.matchCounts);
                    }
                    Spinner.stop();
                },
                colNames: [
                    I18n.resource.dataManage.POINT_NAME,
                    I18n.resource.dataManage.REMARK,
                    I18n.resource.dataManage.POINT_VALUE
                ],
                colModel: [
                    {index: 'name', higthlight: true},
                    {index: 'note'},
                    {index: 'pointValue'}
                ],
                totalNumIndex: 'data.count'
            };

            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }

            if (isPass) {
                dataTableOptions.url = '/tag/groupTree/matchThings';
                _this.rulePassloadFirst = false;
            } else {
                dataTableOptions.url = '/tag/groupTree/notMatchThings';
                _this.ruleNotPassloadFirst = false;
            }
            _this.$dataTable = $refreshTable.off().simpleDataTable(dataTableOptions);
        },
        refreshSheet: function (loadId) {
            var tagIconsMap = beop.model.dmModel.getTagIcons();
            var $searchPointInput = $('#searchPointInput');
            var dataTableOptions = {
                url: '/tag/thingTree/detail',
                post: WebAPI.post,
                postData: {
                    Prt: loadId ? loadId : beop.tag.tree.getSelectTreeNode()[0] ? beop.tag.tree.getSelectTreeNode()[0]._id : _this.nodeId,
                    projId: AppConfig.projectId
                },
                searchOptions: {
                    pageSize: 'limit',
                    pageNum: 'skip'
                },
                searchInput: $searchPointInput,
                rowsNums: [200, 500, 1000],
                pageSize: localStorage.getItem(PAGE_SIZE_STORAGE_KEY),
                dataFilter: function (result) {
                    if (result.success) {
                        _this.pointList = result.data.detailList;
                        return result.data && result.data.detailList;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($("#ruleTableBox")[0]);
                    _this.$container.find(".dragPromptText").hide();
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                onRowClick: function () {
                    _this.getDragRows();
                },

                onRowDbClick: function (tr, data, event, table) {
                    if (data.type !== 'group') {
                        return false;
                    }
                    _this.table = table;
                    _this.nodePrt = data.Prt;
                    table.settings.postData['Prt'] = data._id;
                    table.refreshTable();
                    _this.$container.find(".dragPromptText").hide();
                },
                totalNumIndex: 'data.count',
                colNames: [
                    I18n.resource.common.NAME,
                    I18n.resource.debugTools.exportData.REMARK,
                    I18n.resource.report.templateConfig.PRAM_VALUE,
                    I18n.resource.appDashboard.workflow.TAG
                ],
                colModel: [
                    {
                        index: 'name', html: true, width: '296px', highlight: true,
                        converter: function (value, row) {
                            if (row.tag) {
                                row.tag = _this.advanceEquipment(row.tag);
                            }
                            if (row.type === 'group') {
                                var icon = 'glyphicon glyphicon-folder-close';
                                var equipment = beop.model.dmModel.hasEquipment(row.tag);
                                if (equipment) {
                                    if (tagIconsMap[equipment.name.toLowerCase()]) {
                                        icon = 'icon iconfont tagEquipmentIcon ' + tagIconsMap[equipment.name.toLowerCase()];
                                    }
                                }
                                row.icon = icon;
                                return beopTmpl('tpl_folder_cell', row);
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        index: 'note', html: true, width: '100px',
                        converter: function (value, row) {
                            return value ? value : '';
                        }
                    },
                    {
                        index: 'value', html: true, width: '100px',
                        converter: function (value) {
                            return value ? value : '';
                        }
                    },
                    {
                        index: 'tag', html: true,
                        converter: function (tags) {
                            if (tags && tags.length) {
                                return beopTmpl('tpl_tag_row', {
                                    tags: tags.filter(function (item) {
                                        return !!item
                                    }),
                                    canDelete: false
                                });
                            } else {
                                return ''
                            }

                        }
                    }
                ]
            };
            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }
            _this.$dataTable = $("#ruleTable").off().simpleDataTable(dataTableOptions);
        },
        // 绑定事件
        attachEvents: function () {
            _this.$container.off('click.dmReset').on('click.dmReset', '#dmReset', _this.dmReset);
            _this.$container.off('click.dmRuleTest').on('click.dmRuleTest', '#dmRuleTest', _this.dmRuleTest);
            _this.$container.off('click.dmRuleConfirm').on('click.dmRuleConfirm', '#dmRuleConfirm', _this.dmRuleConfirm);
            _this.$container.off('click.createEmptyFolderConfirm').on('click.createEmptyFolderConfirm', '#createEmptyFolderConfirm', _this.createEmptyFolderConfirm);
            _this.$container.off('change.isCreateSubFolder').on('change.isCreateSubFolder', '#isCreateSubFolder', _this.isShowSubFolderDom);
            _this.$container.off('click.input').on('click.input', '#ruleForm [type=radio]', _this.selectOrEmpty);
            _this.$container.off('click.autoIdentifySave').on('click.autoIdentifySave', '#autoIdentifySave', _this.autoIdentifySave);
            _this.$container.off('click.rulePass').on('click.rulePass', '#dm-tab-pass', function () {
                $(this).removeClass('btn-default').addClass('btn-primary').siblings().removeClass('btn-primary').addClass('btn-default');
                _this.refreshTestSheet(true);
            });
            _this.$container.off('click.selectAll').on('click.selectAll', '#selectAll', function () {
                _this.$dataTable.simpleDataTable('selectAll');
                _this.getDragRows();
            });
            _this.$container.off('click.selectReverse').on('click.selectReverse', '#selectReverse', function () {
                _this.$dataTable.simpleDataTable('reverseSelect');
                _this.getDragRows();
            });
            _this.$container.off('click.ruleNotPass').on('click.ruleNotPass', '#dm-tab-not-passed', function () {
                $(this).removeClass('btn-default').addClass('btn-primary').siblings().removeClass('btn-primary').addClass('btn-default');
                _this.refreshTestSheet(false);
            });

            _this.$container.off('change.pageSize').on('change.pageSize', '.table-footer .pageSizeSelect', function () {
                localStorage.setItem(PAGE_SIZE_STORAGE_KEY, parseInt($(this).val()));
            });
            _this.$container.off('mousedown.dragPoints').on('mousedown.dragPoints', '#ruleTable tbody tr,#keyword-list-table tbody tr', function (e) {
                _this.dragPoints(e, $(this));
            });
        },
        // 取消事件
        detachEvents: function () {
            $(window).off('mousemove.dm.dragPoints').off('mouseup.dm.dragPoints');
            $(window).off('mousemove.dm.dragkeywords').off('mousemove.dm.dragkeywords');
        },
        getNodeChildren: function (getNodeChildren) {
            var folderNameList = [];
            _this.pointList.forEach(function (item) {
                if (item.type == 'group' && getNodeChildren.indexOf(item.name) !== -1) {
                    folderNameList.push(item.name);
                }
            });
            return folderNameList;
        },
        //设备放在前面显示
        advanceEquipment: function (tags) {
            var allEquipment = beop.tag.panel.getTagsByType('Equipment');
            var AllEquipmentName = [];
            var equipmentArr = [],
                notEquipmentArr = [];
            allEquipment.forEach(function (item) {
                AllEquipmentName.push(item.name);
            });
            tags.forEach(function (item) {
                if (AllEquipmentName.indexOf(item) !== -1) {
                    equipmentArr.push(item);
                } else {
                    notEquipmentArr.push(item);
                }
            });
            return equipmentArr.concat(notEquipmentArr);
        }
    };
    $.extend(DmTagTreeEdit.prototype, DmTagTreeEditFunc);
    return DmTagTreeEdit;
})();

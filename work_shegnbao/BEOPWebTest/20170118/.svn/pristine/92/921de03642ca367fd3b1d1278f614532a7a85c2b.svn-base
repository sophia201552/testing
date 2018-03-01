var DmTagTreeEdit = (function () {
    var _this;
    var PAGE_SIZE_STORAGE_KEY = 'dm.tag.edit.page.size';

    var pointState = {
        keywordPoints: 'keywordPoints',
        rulePoints: 'rulePoints'
    };

    var stateMap = {
        point: pointState.keywordPoints
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
                            _this.$container.find('#tagEditContent').empty().append(beopTmpl('tpl_tag_keyword_box'));
                        }
                        _this.$container.find('#keywordName').text('关键字: ' + _this.keyword);
                        _this.refreshKeywordsSheet();

                        //点击关键字记录分页;
                        localStorage.setItem(PAGE_SIZE_STORAGE_KEY, _this.$dataTable.simpleDataTable('getPageSize'));
                    }
                });
                beop.tag.keywords.init($(".tag-right-box"));
                _this.attachEvents();
                beop.tag.tree.configModel(
                    {
                        cb_on_mouseUp: function (event, treeId, treeNode) {
                            if (document.getElementById("dragBox") && treeNode) {
                                var selectedPoints = _this.$dataTable.simpleDataTable('getSelectedData'),
                                    thingIds = [];
                                for (var i = 0; i < selectedPoints.length; i++) {
                                    thingIds.push(selectedPoints[i]._id)
                                }
                                Spinner.spin(_this.$container.find("#tagEditBox")[0]);
                                WebAPI.post('/tag/moveThings', {
                                    projId: AppConfig.projectId,
                                    thingsId: thingIds,
                                    Prt: treeNode._id
                                }).done(function (result) {
                                    if (result.success) {
                                        _this.$container.find(".dragPromptText").hide();
                                        var parentsNodes = beop.tag.tree.getPath(treeNode);

                                        _this.adjustParentNumber(_this.treeParentsNodes);
                                        _this.adjustParentNumber(parentsNodes);

                                        if (_this.nodePTId) {
                                            beop.tag.tree.reAsyncParentNodes(_this.nodePTId);
                                        }
                                        if (treeNode.parentTId) {
                                            beop.tag.tree.reAsyncParentNodes(treeNode.parentTId);
                                        }

                                        if (stateMap.point == pointState.keywordPoints) {
                                            _this.refreshKeywordsSheet();
                                        } else if (stateMap.point == pointState.rulePoints) {
                                            _this.refreshSheet();
                                        }
                                    } else {
                                        alert.danger('无数据返回');
                                    }
                                }).always(function () {
                                    Spinner.stop()
                                });
                            }
                        },
                        itemShowList: ['finish', 'btnGroup'],
                        isOnlyGroup: true,
                        hasWrapperNode: false,
                        editable: true,
                        cb_on_click: function (treeNode, clickType) {
                            _this.nodeId = '';
                            var onClick = function () {
                                //此时treeNode是父级节点
                                if (clickType === 'addEmpty') {
                                    _this.uncompletedAddId = ObjectId();
                                    beop.tag.tree.tagNodesAdd(
                                        {
                                            'isParent': true,
                                            'open': false,
                                            'name': '新建目录',
                                            'children': [],
                                            'folderType': 1,
                                            '_id': _this.uncompletedAddId
                                        },
                                        false,
                                        !treeNode
                                    );
                                    infoBox.prompt('新建目录名称', function (name) {
                                        var folderName = $.trim(name);
                                        if (!folderName) {
                                            alert.danger('目录名称不可为空');
                                        } else {
                                            var _id = treeNode ? treeNode._id : '';
                                            if (beop.tag.tree.isNameExist(_id, null, folderName)) {
                                                infoBox.confirm('发现存在相同名称的目录, 将会合并两个目录的点, 是否确认进行重命名并合并?', function () {
                                                    _this.renameOrAddFolder(treeNode, folderName, 'add');
                                                }, function () {
                                                    return false;
                                                });
                                            } else {
                                                _this.renameOrAddFolder(treeNode, folderName, 'add');
                                            }
                                        }
                                    }, function () {
                                        beop.tag.tree.removeNode(_this.uncompletedAddId);
                                        _this.uncompletedAddId = false;
                                    });
                                    return;
                                }
                                if (clickType === 'rename') {
                                    infoBox.prompt('请输入新目录名称', function (name) {
                                        var newName = $.trim(name);
                                        if (!newName) {
                                            alert.danger('目录名称不为空');
                                        } else {
                                            if (beop.tag.tree.isNameExist(treeNode.prt, treeNode._id, newName)) {
                                                infoBox.confirm('发现存在相同名称的目录, 将会合并两个目录的点, 是否确认进行重命名并合并?', function () {
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
                                _this.editRule = false;
                                _this.addChildNode = false;
                                _this.addNewNode = false;
                                _this.$container.find('#tagEditContent').empty().append(beopTmpl('tpl_tag_rule_edit'));
                                var $editTitle = $("#editTitle");
                                var $catalogName = $("#catalogName");
                                var $autoIdentifySave = $('#autoIdentifySave');
                                $autoIdentifySave.hide();
                                //增加根目录
                                if (!treeNode) {
                                    _this.uncompletedAddId = ObjectId();
                                    _this.addNewNode = true;
                                    $catalogName.hide();
                                    $editTitle.text('新建目录');
                                    beop.tag.rule.init($("#ruleBox"));
                                    beop.tag.tree.tagNodesAdd(
                                        {
                                            'isParent': true,
                                            'open': false,
                                            'name': '新建目录',
                                            'children': [],
                                            'folderType': 1,
                                            '_id': _this.uncompletedAddId
                                        },
                                        false,
                                        !_this.addChildNode
                                    );
                                    return;
                                }
                                _this.nodePrt = treeNode.Prt;
                                _this.nodeId = treeNode._id;
                                _this.nodeTId = treeNode.tId;
                                _this.nodePTId = treeNode.parentTId;
                                _this.treeParentsNodes = beop.tag.tree.getPath(treeNode);
                                if (clickType) {//点击图标
                                    if (treeNode.isParent) {
                                        if (clickType === 'addNode') {
                                            _this.uncompletedAddId = ObjectId();
                                            _this.addChildNode = true;
                                            $catalogName.hide();
                                            $editTitle.text('新建目录');
                                            beop.tag.tree.tagNodesAdd(
                                                {
                                                    'isParent': true,
                                                    'open': false,
                                                    'name': '新建目录',
                                                    'children': [],
                                                    'folderType': 1,
                                                    '_id': _this.uncompletedAddId
                                                },
                                                false,
                                                !_this.addChildNode
                                            );
                                            _this.initEditSection('', treeNode);
                                            beop.tag.rule.init($("#ruleBox"));
                                        } else if (clickType === 'editRule') {
                                            $('#dmRuleConfirm').text('生成');
                                            _this.editRule = true;
                                            $catalogName.hide();
                                            $editTitle.text('编辑目录');
                                            beop.tag.rule.init($("#ruleBox"));
                                            _this.initEditSection((treeNode.originName || treeNode.name), treeNode);
                                        } else if (clickType === 'autoMatch') {
                                            confirm('请选择自动匹配设备类型<select class="form-control" id="autoMatchType"><option value="AHU">AHU</option><option value="CH">CH</option></select>', function () {
                                                $("#ruleForm").remove();
                                                $catalogName.show();
                                                $autoIdentifySave.show();
                                                $editTitle.text(treeNode.originName);

                                                beop.tag.keywords.configModel({prt: treeNode._id});
                                                beop.tag.keywords.init($(".tag-right-box"));
                                                Spinner.spin(ElScreenContainer);
                                                var points = _this.pointList.map(function (item) {
                                                    return item.name;
                                                });
                                                WebAPI.post('/tag/pointAutoMatch/', {
                                                    pointList: points,
                                                    equipment: $('#autoMatchType').val()
                                                }).done(function (result) {
                                                    _this.loadAutoMatchResult(result.data);
                                                }).always(function () {
                                                    Spinner.stop();
                                                })
                                            });
                                            _this.initPointList(treeNode, $catalogName, $editTitle);
                                        }

                                    }
                                } else {// 点击左侧tree node,加载table数据
                                    _this.initPointList(treeNode, $catalogName, $editTitle);
                                }
                            };
                            if (_this.uncompletedAddId) {
                                confirm('新建还未保存,是否放弃保存?', function () {
                                    beop.tag.tree.removeNode(_this.uncompletedAddId);
                                    _this.uncompletedAddId = false;
                                    onClick();
                                }, function () {
                                    beop.tag.tree.selectNode(_this.uncompletedAddId);
                                });
                            } else {
                                onClick();
                            }
                        }
                    }
                );
                beop.tag.tree.init(_this.$container.find("#tagTreeBox"));
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
                    var nodes = beop.tag.tree.getSelectTreeNode();
                    nodes[0].name = nodes[0].name + '' + (nodes[0].pointCount ? '(' + nodes[0].pointCount + ')' : '');
                    beop.tag.tree.reAsyncParentNodes(nodes[0].parentTId);
                    if (_this.uncompletedAddId) {
                        beop.tag.tree.removeNode(_this.uncompletedAddId);
                        _this.uncompletedAddId = false;
                    }
                } else {
                    alert.danger(result.msg);
                }
            }).always(function () {
                renameSpinner.stop();
            })
        },

        adjustParentNumber: function (parentNodes) {
            for (var i = 0; i < parentNodes.length; i++) {
                if (parentNodes == _this.treeParentsNodes) {
                    parentNodes[i].pointCount -= _this.$dataTable.simpleDataTable('getSelectedData').length;
                } else {
                    parentNodes[i].pointCount += _this.$dataTable.simpleDataTable('getSelectedData').length;
                }

                if (parentNodes[i].pointCount == 0) {
                    parentNodes[i].name = parentNodes[i].originName;
                } else {
                    parentNodes[i].name = parentNodes[i].originName + '(' + parentNodes[i].pointCount + ')';
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

        initEditSection: function (name, treeNode) {
            if ($('#isCreateSubFolder').val() != '2' || !_this.editRule) {
                beop.tag.rule.init($("#ruleBox"), treeNode.rule);
            } else {
                $('#rule-content').hide();
                $('#ruleBtns').hide();
            }
            //刷新keywords列表
            $("#keywordInfo").empty().append(beopTmpl('tpl_tag_keyword_box')).show();
            this.refreshKeywordsSheet();

            $("#ruleFolderName").val(name);
        },

        /***
         * 添加方法
         */
        dmReset: function () {
            beop.tag.rule.reset();
        },

        removeTag: function (e) {
            var $this = $(this);
            var tags = _this.pointListObj[$this.closest('tr').find('td:first').text()].tags;
            for (var i = 0; i < tags.length; i++) {
                if (tags[i].name == $(this).closest('.tag-item').text()) {
                    tags.splice(i, 1);
                    i--;
                }
            }
            $this.closest('.tag-item-box').remove();
            e.stopPropagation();
        },

        dmRuleTest: function () {
            _this.$container.find("#keywordInfo").hide();
            _this.$container.find("#ruleTableBox").show();
            _this.$container.find("#ruleTextBox").show();
            _this.$container.find("#testCondition").text(beop.tag.rule.getRulesString().join('+'));
            _this.refreshTestSheet();
        },
        dmRuleConfirm: function () {
            var $ruleFolderName = _this.$container.find("#ruleFolderName").val(),
                hasSubFolderVal = parseInt(_this.$container.find("#isCreateSubFolder").val());
            if (!$ruleFolderName) {
                alert.danger('目录名称不能为空');
                return;
            }
            var ruleMap = {
                Prt: (_this.addChildNode && _this.nodeId) || (_this.editRule && _this.nodePrt) || null,
                projId: _this.projectId,
                folderName: $.trim($ruleFolderName),
                hasSubFolder: hasSubFolderVal,
                rules: beop.tag.rule.getRuleList(),
                groupId: _this.editRule ? _this.nodeId : null
            };

            if (hasSubFolderVal === 1) {
                var subFolderPrefixVal = _this.$container.find("#subFolderPrefix").val();
                if (!subFolderPrefixVal) {
                    alert.danger('子目录名称不能为空');
                    return;
                }

                var braces = {
                    beforeBrackets: subFolderPrefixVal.indexOf('{'),
                    afterBrackets: subFolderPrefixVal.indexOf('}')
                };

                if (!(braces.beforeBrackets >= 0) || !(braces.afterBrackets > 0)) {
                    alert.danger('子目录名称必须包含{ }');
                    return;
                }

                var directoryNumber = subFolderPrefixVal.slice(braces.beforeBrackets + 1, braces.afterBrackets),
                    $ruleUl = _this.$container.find("#ruleUl"),
                    ruleNum = $ruleUl.find('.rule-item').length - 1;

                if (!directoryNumber) {
                    alert.danger('{ }必须有规则序号');
                    return;
                }

                if (!/^[0-9]*[1-9][0-9]*$/.test(Number(directoryNumber))) {
                    alert.danger('规则序号为正整数');
                    return;
                }

                if (ruleNum < parseInt(directoryNumber)) {
                    alert.danger('无法找到规则' + parseInt(directoryNumber));
                    return;
                }

                ruleMap.subFolderPrefix = subFolderPrefixVal;
            }

            var isEditRule = '';
            if (_this.editRule) {
                isEditRule = '生成';
            } else {
                isEditRule = '新建';
            }
            infoBox.confirm('是否按: "' + beop.tag.rule.getRulesString().join('+') + '" 这个规则条件进行' + isEditRule, function () {
                var addNewFolder = function () {
                    Spinner.spin(_this.$container[0]);
                    WebAPI.post('/tag/groupTree/save', ruleMap).done(function (result) {
                        if (result.success) {
                            if (!_this.editRule) {
                                var prtId = result.data;
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
                                        true,
                                        !_this.addChildNode
                                    );
                                }
                                if (_this.addNewNode) {

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
                                            if (!newNode || !newNode[0]) {
                                                return;
                                            }
                                            if (newNode[0].pointCount) {
                                                newNode[0].pointCount += newNodeDetail.data.count;
                                            } else {
                                                newNode[0].pointCount = newNodeDetail.data.count
                                            }
                                            newNode[0].name = newNode[0].originName + '(' + newNode[0].pointCount + ')';
                                            beop.tag.tree.updateNode(newNode[0]);
                                        }
                                    });
                                }
                                beop.tag.tree.reAsyncParentNodes(_this.nodeTId);
                            } else {
                                alert.success('生成成功');
                                beop.tag.tree.reAsyncParentNodes(_this.nodePTId);
                            }
                            if (_this.uncompletedAddId) {
                                beop.tag.tree.removeNode(_this.uncompletedAddId);
                            }
                            _this.uncompletedAddId = false;
                        } else {
                            alert.danger('error:' + result.msg)
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                };
                if (beop.tag.tree.isNameExist(ruleMap.Prt, ruleMap.groupId, ruleMap.folderName)) {
                    infoBox.confirm('发现存在相同名称的目录, 将会合并两个目录的点, 是否确认进行重命名并合并?', function () {
                        addNewFolder();
                    }, function () {
                        return false;
                    });
                } else {
                    addNewFolder();
                }
            });
        },
        isShowSubFolderDom: function () {
            var $ruleContent = $('#rule-content'), $ruleBtns = $('#ruleBtns'),
                $ruleSubFolderNameBox = $("#ruleSubFolderNameBox");
            if ($(this).val() == '1') { // 生成子目录
                $ruleSubFolderNameBox.show();
                $ruleContent.show();
                $ruleBtns.show();
                beop.tag.rule.init($("#ruleBox"), beop.tag.rule.getRuleList());
            } else {// 不生成子目录
                if (_this.editRule) {
                    $ruleContent.hide();
                    $ruleBtns.hide();
                }
                $ruleSubFolderNameBox.hide();
            }
        },
        dragPoints: function (e) {
            var dragElement = _this.$dataTable.simpleDataTable('getSelectedRows');
            if (dragElement) {
                _this.startClientX = e.clientX;
                _this.startClientY = e.clientY;
                var dragBox = document.createElement("div");
                dragBox.id = 'dragBox';
                dragBox.style.background = 'rgba(0,119,238,0.7)';
                dragBox.style.borderRadius = '16px';
                dragBox.style.padding = '4px 16px';
                dragBox.style.color = '#fff';
                dragBox.style.left = _this.startClientX + 5 + 'px';
                dragBox.style.top = _this.startClientY + 5 + 'px';
                dragBox.style.position = 'absolute';
                dragBox.style.zIndex = 1;

                dragBox.innerHTML = '<span>选中 ' + dragElement.length + ' 个点</span>';
                document.body.appendChild(dragBox);

                var $dragBox = document.getElementById("dragBox");
                $(window).off('mousemove.dm.dragPoints').on('mousemove.dm.dragPoints', function (e) {
                    $dragBox.style.left = e.clientX + 5 + 'px';
                    $dragBox.style.top = e.clientY + 5 + 'px';
                }).one('mouseup.dm.dragPoints', function () {
                    $dragBox.remove();
                });
            }
            return false;
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
                    alert.success('保存成功.');
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
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                onRowClick: function () {
                    var dragElement = _this.$dataTable.simpleDataTable('getSelectedData');
                    var dragNum = dragElement.length;
                    for (var i = 0; i < dragElement.length; i++) {
                        if (dragElement[i].type == 'group') {
                            dragNum--;
                        }
                    }
                    if (dragElement && (dragNum !== 0)) {
                        _this.$container.find(".dragPromptText").show();
                        _this.$container.find(".dragNum").text(dragNum);
                    }

                    stateMap.point = pointState.keywordPoints;
                },
                colNames: ['点名', '释义', '点值'],
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
        refreshTestSheet: function () { // testData 待修改
            var queryData = {
                projId: _this.projectId,
                Prt: _this.nodeId,
                rules: beop.tag.rule.getRuleList()
            };
            var $ruleTable = $("#ruleTable");
            if (_this.keyword) {
                queryData['searchText'] = _this.keyword.trim();
            }
            var dataTableOptions = {
                url: '/tag/groupTree/matchThings',
                post: WebAPI.post,
                postData: queryData,
                searchOptions: {
                    pageSize: 'limit',
                    pageNum: 'skip'
                },
                searchInput: $("#text_search"),
                rowsNums: [200, 500, 1000],
                pageSize: localStorage.getItem(PAGE_SIZE_STORAGE_KEY),
                dataFilter: function (result) {
                    if (result.success) {
                        return result.data.ThingsList;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($ruleTable.get(0));
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                colNames: ['点名', '释义', '点值'],
                colModel: [
                    {index: 'name'},
                    {index: 'note'},
                    {index: 'pointValue'}
                ],
                totalNumIndex: 'data.count'
            };

            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }

            _this.$dataTable = $ruleTable.off().simpleDataTable(dataTableOptions);
        },
        refreshSheet: function () {
            var dataTableOptions = {
                url: '/tag/thingTree/detail',
                post: WebAPI.post,
                postData: {
                    Prt: beop.tag.tree.getSelectTreeNode()[0] ? beop.tag.tree.getSelectTreeNode()[0]._id : _this.nodeId,
                    projId: AppConfig.projectId
                },
                searchOptions: {
                    pageSize: 'limit',
                    pageNum: 'skip'
                },
                searchInput: $("#mode-data-Search"),
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
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                onRowClick: function () {
                    var dragElement = _this.$dataTable.simpleDataTable('getSelectedData');
                    var dragNum = dragElement.length;
                    for (var i = 0; i < dragElement.length; i++) {
                        if (dragElement[i].type == 'group') {
                            dragNum--;
                        }
                    }
                    if (dragElement && (dragNum !== 0)) {
                        _this.$container.find(".dragPromptText").show();
                        _this.$container.find(".dragNum").text(dragNum);
                    }
                    stateMap.point = pointState.rulePoints;
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
                    '名称',
                    '注释',
                    '值',
                    'Tag'
                ],
                colModel: [
                    {
                        index: 'name', html: true, width: '296px',
                        converter: function (value, row) {
                            if (row.type === 'group') {
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
            _this.$container.off('change.isCreateSubFolder').on('change.isCreateSubFolder', '#isCreateSubFolder', _this.isShowSubFolderDom);
            _this.$container.off('mousedown.dragPoints').on('mousedown.dragPoints', '#dragIcon', _this.dragPoints);
            _this.$container.off('click.autoIdentifySave').on('click.autoIdentifySave', '#autoIdentifySave', _this.autoIdentifySave);
            _this.$container.on('mouseenter', '.tag-item-box', function () {
                $(this).find('#remove-tag').show();
            }).on('mouseleave', '.tag-item-box', function () {
                $(this).find('#remove-tag').hide();
            });
            _this.$container.on('click', '#remove-tag', _this.removeTag);
        },
        // 取消事件
        detachEvents: function () {
            $(window).off('mousemove.dm.dragPoints').off('mouseup.dm.dragPoints');
        },
        loadAutoMatchResult: function (matchResult) {
            var dataTableOptions = {
                url: '/tag/thingTree/detail',
                post: WebAPI.post,
                postData: {
                    Prt: beop.tag.tree.getSelectTreeNode()[0]._id,
                    projId: AppConfig.projectId
                },
                searchOptions: {
                    pageSize: 'limit',
                    pageNum: 'skip'
                },
                pageSize: localStorage.getItem(PAGE_SIZE_STORAGE_KEY),
                searchInput: $("#mode-data-Search"),
                rowsNums: [200, 500, 1000],
                dataFilter: function (result) {
                    if (result.success) {
                        _this.pointListObj = {};
                        if (result.data && result.data.detailList) {
                            _this.pointList = result.data.detailList;
                        }
                        for (var i = 0; i < _this.pointList.length; i++) {
                            var point = _this.pointList[i];
                            if (matchResult && matchResult[point.name]) {
                                _this.pointListObj[point.name] = $.extend(true, point, matchResult[point.name]);
                            }
                        }

                        return _this.pointList.sort(function (a, b) {
                            return a.score - b.score;
                        }).reverse();
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($("#ruleTableBox")[0]);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                onRowDbClick: function (tr, data, event, table) {
                    if (data.type !== 'group') {
                        return false;
                    }
                    _this.table = table;
                    _this.nodePrt = data.Prt;
                    table.settings.postData['Prt'] = data._id;
                    table.refreshTable();
                },
                totalNumIndex: 'data.count',
                colNames: [
                    '名称',
                    '注释',
                    '值',
                    '推荐Tag',
                    '匹配度',
                    '参考'
                ],
                colModel: [
                    {
                        index: 'name', html: true, width: '296px',
                        converter: function (value, row) {
                            if (row.type === 'group') {
                                return beopTmpl('tpl_folder_cell', row);
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        index: 'note', html: true, width: '100px',
                        converter: function (value) {
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
                        index: 'tags', html: true,
                        converter: function (tags) {
                            if (tags && tags.length) {
                                return beopTmpl('tpl_tag_row', {
                                    tags: tags.filter(function (item) {
                                        return !!item
                                    }),
                                    canDelete: true
                                });
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        index: 'score', width: '55px',
                        style: function (score) {
                            if (!score) {
                                return false;
                            } else if (score >= 80) {
                                return 'background: #3cc452;'
                            }
                        }
                    },
                    {
                        index: 'synonym'
                    }
                ]
            };
            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }
            _this.$dataTable = $("#ruleTable").addClass('tag-list-box').off().simpleDataTable(dataTableOptions);
        }
    };
    $.extend(DmTagTreeEdit.prototype, DmTagTreeEditFunc);
    return DmTagTreeEdit;
})();

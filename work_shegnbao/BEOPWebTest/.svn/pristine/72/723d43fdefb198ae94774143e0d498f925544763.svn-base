var PointManagerImportTags = (function () {
    var _this;
    var TagType = {
        equipment: 'equipment',
        sensor: 'sensor'
    };
    var ThingType = {
        group: 'group',
        thing: 'thing'
    };

    function PointManagerImportTags(projectId) {
        PointManager.call(this, projectId);
        this.htmlUrl = '/static/views/observer/pointManagerImportTags.html';
        _this = this;
        this.isInTagsContent = false;//当前点击是否在tag的展示区里

        this.importTagUrl = '/tag/import/' + AppConfig.projectId;
        this.uploadSupportFileType = ['.csv', '.xls', '.xlsx'];
        this.stateMap = {
            /***
             * 保存最近加载右侧的tid,拖动后刷新右侧内容;
             */
            tId: null,
            /***
             * 左侧被拖动的node
             */
            treeNode: null,
            /***
             * tree浏览历史用于前进后功能
             */
            explorerPath: {
                path: [],
                index: -1,
                shouldLog: true
            },
            /***
             * 当前Tag编辑区的treeNode
             */
            currentNode: null,
            /***
             *Iot面板配置
             */
            iotOption: {}
        };
        this.tagDict = [];//平台Tag字典
    }

    PointManagerImportTags.prototype = Object.create(PointManager.prototype);
    PointManagerImportTags.prototype.constructor = PointManagerImportTags;


    var PointManagerImportTagsFunc = {
        /***
         * 设置页面JqueryMap
         */
        setPageJqueryMap: function () {
            var jqueryMap = {
                $tagContent: this.$container.find('.tag-content'),
                $tagsRightHeader: this.$container.find('.tags-right-header'),
                $tbWrap: this.$container.find('.tb-wrap'),
                $tagList: this.$container.find('.tag-list'),
                $tagsRightContent: this.$container.find('.tags-right-content'),
                $tagsLeftContainer: this.$container.find('.tagsLeftContainer'),
                $uploadInput: this.$container.find('#iptPjData'),
                $importTags: this.$container.find('#importTags'),
                $syncPointToTree: this.$container.find('#syncPointToTree'),
                $tagsPath: this.$container.find('#tags-path'),
                $tagSearch: this.$container.find('#tag_search'),
                $tagSearchBox: this.$container.find('#tag-search-box'),
                $tagExplorer: this.$container.find('#tagsExplorer')
            };

            $.extend(this.jqueryMap, jqueryMap);
        },
        show: function () {
            var _this = this;
            WebAPI.get('/tag/getGlobalDictionary/zh-CN').done(function (result) {
                _this.tagDict = result.tag;
            });
            this.init().done(function () {
                _this.attachEvents();
                _this.renderRightTagsContent();
                I18n.fillArea($(ElScreenContainer));
                $(window).resize(function () {
                    if (window.outerWidth / window.innerWidth <= 0.75) {
                        $('.tag-list-item-name').css('min-height', '64px');
                    }
                });
            });
        },

        /***
         * 加载IOT面板
         */
        initPanelFilter: function () {
            this.filterPanel = new HierFilter(this.jqueryMap.$tbWrap, 110, this);
            this.filterPanel.init();
            this.filterPanel.setOption(this.stateMap.iotOption);
        },

        /***
         * 显示右侧的tags
         */
        showTags: function (node) {
            var $tagItems = $('<div></div>');
            _this.jqueryMap.$tagList.empty();
            for (var m = 0; m < node.length; m++) {
                var tagItemHtml = '';
                tagItemHtml = beopTmpl('tpl_tag_explorer_item', {item: node[m]});
                $tagItems.append(tagItemHtml);
            }
            _this.$tagItems = $tagItems;
            _this.jqueryMap.$tagList.append($tagItems.children());
        },
        /***
         * 搜索
         */
        searchTag: function () {
            _this.jqueryMap.$tagsRightContent.off('scroll.rightShow');
            var searchText = $('#tag_search').val() || '';
            if (!searchText.trim()) {
                //如果查询名称为空,显示当前目录下所有的
                _this.nodes = _this.allNodesInCurrentPath;
                _this._showRightSlowly();
            } else {
                Spinner.spin(ElScreenContainer);
                var path = '';
                if (_this.path && _this.path.length) {
                    for (var i = 0, iLen = _this.path.length; i < iLen; i++) {
                        path += '/' + _this.path[i].name;
                    }
                }
                WebAPI.post('/tag/search', {
                    "projId": AppConfig.projectId,
                    "searchName": searchText,
                    "path": path,
                    "isRecursive": false,
                    "Prt": _this.currentNode._id || ''
                }).done(function (result) {
                    if (result.status) {
                        var keywordList = searchText.replace('/[^\w\d\s]/g', ' ').split(/\s/g);
                        result.thingsList.forEach(function (parentItem) {
                            parentItem.keywordName = parentItem.name;
                            keywordList.forEach(function (item) {
                                if (item) {
                                    parentItem.keywordName = parentItem.keywordName.replace(new RegExp("(" + item + ")(?![^<]*>|[^<>]*</)", "gi"), '<span style="color:orange">$1</span>');
                                }
                            });
                        });
                        _this.nodes = result.thingsList;
                        _this._showRightSlowly();
                        _this.jqueryMap.$tagsRightContent.scrollTop(0);
                    } else {
                        alert('error:' + result.message);
                    }
                }).always(function () {
                    Spinner.stop();
                })
            }
        },

        _dr_dragMove: function () {

        },
        _dr_dropTree2Dom: function (evnet, treeId, treeNodes, targetNode, moveType, isCopy) {
            var thingIds = [];
            for (var i = 0, iLen = treeNodes.length; i < iLen; i++) {
                thingIds.push(treeNodes[i]._id);
            }
            Spinner.spin(_this.jqueryMap.$tagContent.get(0));
            WebAPI.post('/tag/moveThings', {
                Prt: targetNode._id,
                thingsId: thingIds,
                projId: AppConfig.projectId
            }).done(function (result) {
                if (result.status) {
                    for (var i = 0; i < thingIds.length; i++) {
                        if (thingIds[i]) {
                            var $tagDrapItem = $('.tag-list-item[data-id=' + thingIds[i] + ']');
                            if ($tagDrapItem) {
                                $tagDrapItem.remove();
                            }
                        }
                    }
                    _this.moveTreeNodes(targetNode._id, thingIds);
                    if (_this.currentNode._id == targetNode._id) {
                        this.$container.find('#' + _this.currentNode.tId + '_span').click();
                    }
                } else {
                    alert.danger('move failed');
                }
            }).always(function () {
                Spinner.stop();
            });
        },
        _dr_dragTree2Dom: function (treeId, treeNodes) {
            return !(treeNodes[0].type == 'group');
        },
        _beforeDrop: function (treeId, treeNodes, targetNode, moveType) {
            return targetNode.type == 'group';
        },
        /***
         * drop item to tag Tree callback
         * @param event
         * @param treeId
         * @param treeNode
         * @private
         */
        _dr_itemToTree: function (event, treeId, treeNode) {
            if (!treeNode) {
                return;
            }
            if (treeNode.type == ThingType.group) {
                _this.movePointsToGroup(treeNode._id);
            } else {
                $('#drag_box').remove();
                _this.stateMap.isDragging = false;
            }
        },

        asyncSuccess: function (event, treeId, treeNode, msg) {
            if (_this.isRenderRight) {
                _this.stateMap.tId = treeNode.tId;
                _this.path = treeNode.getPath();
                _this.jqueryMap.$tagsPath.find('.breadcrumb').empty().append(beopTmpl('tpl_tags_path', {paths: _this.path}));
                _this._showRightSlowly();
                _this.isRenderRight = false;
                //更新右下方的文件个数,文件夹个数
                if (_this.currentNode.tId == treeNode.tId) {
                    _this.jqueryMap.$tagExplorer.find('.fileNumber').empty().append(beopTmpl('tpl_tags_fileNumber', {node: _this.tree.getNodesByParam('parentTId', _this.currentNode.tId)}));
                }
            }
        },

        addDiyDom: function (treeId, treeNode) {
            if (treeNode && treeNode.isParent) {
                $('#' + treeNode.tId + '_ico').addClass('tree-folder');
            }
        },

        _click_tree_item: function (event, treeId, treeNode, clickFlag) {
            _this.path = treeNode.getPath();
            if (!treeNode || treeNode.type !== ThingType.group) {
                _this.jqueryMap.$tagExplorer.find('.detailed_information').empty().append(beopTmpl('tpl_tags_detailed_information', {paths: _this.path}));
                return false;
            }
            _this.isRenderRight = true;
            this.tree.reAsyncChildNodes(treeNode, 'refresh');
            _this._menuIsAvailable(treeNode);
            _this.jqueryMap.$tagExplorer.find('.detailed_information').empty().append(beopTmpl('tpl_tags_detailed_information', {paths: _this.path}));
            //更新右下方的文件个数,文件夹个数
            _this.jqueryMap.$tagExplorer.find('.fileNumber').empty().append(beopTmpl('tpl_tags_fileNumber', {node: _this.tree.getNodesByParam('parentTId', _this.currentNode.tId)}));

        },

        _right_click_tree_item: function (event, treeId, treeNode) {
            _this.openContextMenu($('#contextMenu-panel'), event.pageX, event.pageY);
            _this.addTagPid = treeNode._id;
        },

        _before_right_click: function (treeId, treeNode) {
            return treeNode.type == "group";
        },

        _makeIconSkin: function (icon) {
            return 'iconfont icon-' + icon;
        },

        _makeTreeNodeIcon: function (nodes) {
            if (!nodes || !nodes.length) {
                return false;
            }
            for (var i = 0, iLen = nodes.length; i < iLen; i++) {
                if (nodes[i].children) {
                    this._makeTreeNodeIcon(nodes[i].children);
                }
                if (nodes[i].tag && nodes[i].tag.icon) {
                    nodes[i].iconSkin = this._makeIconSkin(nodes[i].tag.icon);
                    nodes[i].isParent && (nodes[i].iconSkin += ' tree-folder ');
                }
            }
        },
        /***
         * 渲染tag编辑区
         * @param event
         * @param treeId
         * @param treeNode
         * @param isShowAll
         */
        renderRightTagsContent: function (event, treeId, treeNode, isShowAll) {
            if (treeNode) {
                _this.stateMap.tId = treeNode.tId;
                _this.path = treeNode.getPath();
                this.jqueryMap.$tagsPath.find('.breadcrumb').empty().append(beopTmpl('tpl_tags_path', {paths: _this.path}));
            } else {
                _this.path = null;
                this.jqueryMap.$tagsPath.find('.breadcrumb').empty().append(beopTmpl('tpl_tags_path', {paths: []}));
            }
            Spinner.spin(_this.jqueryMap.$tbWrap[0]);
            var requestData = {
                projId: AppConfig.projectId
            };
            if (treeNode && treeNode._id) {
                requestData['Prt'] = treeNode._id;
            }
            WebAPI.post('/tag/getThingTree', requestData).done(function (result) {
                if (result.status) {
                    _this._makeTreeNodeIcon(result.thingTree);
                    _this.nodes = result.thingTree;
                    //为搜索text为空而保存的变量.为空加载该目录下所有的.
                    _this.allNodesInCurrentPath = result.thingTree;
                    if (!_this.tree) {//第一次加载的时候
                        var setting = {
                            edit: {
                                enable: true,
                                showRemoveBtn: false,
                                showRenameBtn: false,
                                drag: {
                                    inner: true,
                                    isCopy: false,
                                    isMove: true
                                }
                            },
                            callback: {
                                onClick: _this._click_tree_item.bind(_this),
                                beforeDrag: _this._dr_dragTree2Dom.bind(this),
                                beforeDrop: _this._beforeDrop.bind(this),
                                onDrop: _this._dr_dropTree2Dom.bind(this),
                                onDragMove: _this._dr_dragMove.bind(this),
                                onMouseUp: _this._dr_itemToTree.bind(this),
                                onRightClick: _this._right_click_tree_item.bind(_this),
                                beforeRightClick: _this._before_right_click.bind(this),
                                beforeAsync: function () {
                                    return true
                                },
                                onAsyncSuccess: _this.asyncSuccess.bind(this)
                            },
                            view: {
                                selectedMulti: true,
                                addDiyDom: _this.addDiyDom
                            },
                            async: {
                                enable: true,
                                type: 'post',
                                url: '/tag/getThingTree',
                                otherParam: {"projId": AppConfig.projectId},
                                autoParam: ["_id=Prt"],
                                dataFilter: function (treeId, parentNode, responseData) {
                                    _this.nodes = responseData.thingTree;
                                    //为搜索text为空而保存的变量.为空加载该目录下所有的.
                                    _this.allNodesInCurrentPath = responseData.thingTree;
                                    _this._makeTreeNodeIcon(_this.nodes);
                                    return _this.nodes;
                                }
                            }
                        };
                        if (isShowAll || _this.nodes.length < 1000) {
                            _this.tree = $.fn.zTree.init($('#projectDataTree'), setting, _this.nodes);
                        } else {
                            _this.tree = $.fn.zTree.init($('#projectDataTree'), setting, _this.nodes.slice(0, 1000));
                        }
                    }
                    _this._showRightSlowly();
                    //更新右下方的文件个数,文件夹个数
                    _this.jqueryMap.$tagExplorer.find('.fileNumber').empty().append(beopTmpl('tpl_tags_fileNumber', {node: _this.tree.getNodesByParam('parentTId', _this.currentNode.tId)}));
                }
            }).always(function () {
                Spinner.stop();
            });
            _this._menuIsAvailable(treeNode);
        },

        /****
         * 判断是前进后退是否可用,上否有上一级,更新路径
         * @param treeNode
         * @private
         */

        _menuIsAvailable: function (treeNode) {
            if (!treeNode) {
                this.currentNode = {
                    _id: null
                };
            } else {
                this.currentNode = treeNode;
            }
            if (_this.stateMap.explorerPath.shouldLog) {
                _this.logPath(treeNode);
            }
            _this.stateMap.explorerPath.shouldLog = true;
            var pathState = _this.stateMap.explorerPath;
            //判断前进后退是否可用
            if (pathState.path.length != 1) {
                $('.next-path').removeClass('disable');
                $('.last-path').removeClass('disable');
            }
            if (pathState.index === (pathState.path.length - 1)) {
                $('.next-path').addClass('disable');
            }
            if (pathState.index === 0) {
                $('.last-path').addClass('disable');
            }
            //判断是否有上一级
            if (treeNode) {
                $('.glyphicon-arrow-up').removeClass('disable');
            } else {
                $('.glyphicon-arrow-up').addClass('disable');
            }
        },
        /***
         * 一次加载很多时每次加载200条
         * @private
         */
        _showRightSlowly: function () {
            var showCount = 0;
            var scrollLoad = function () {
                showCount += 200;
                if (_this.nodes.length > showCount) {
                    var showNodes = _this.nodes.slice(0, showCount);
                    //暂时右侧每滚动一次显示200个
                    _this.showTags(showNodes);
                } else {
                    _this.showTags(_this.nodes);
                }
            };
            scrollLoad();
            _this.jqueryMap.$tagsRightContent.on('scroll.rightShow', function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(this).height();
                var containerHeight = $(this)[0].scrollHeight;
                if (scrollTop + scrollHeight == containerHeight) {
                    scrollLoad();
                }
            });
        },

        /***
         * tag编辑区拖拽鼠标选择元素,选择结束
         * @param e
         * @private
         */
        _endTagSelection: function (e) {
            if (!this.isInTagsContent) {
                $('#drag_box').remove();
                return false;
            }
            $('#active_box').remove();
            var $allFiles = _this.jqueryMap.$tagsRightContent.find('.tag-list-item');
            if (!e.ctrlKey) {
                $allFiles.removeClass('active');
            }
            _this.endClientX = e.clientX;
            _this.endClientY = e.clientY;
            var minClientX = Math.min(_this.startClientX, _this.endClientX);
            var maxClientX = Math.max(_this.startClientX, _this.endClientX);
            var minClientY = Math.min(_this.startClientY, _this.endClientY);
            var maxClientY = Math.max(_this.startClientY, _this.endClientY);
            for (var i = 0; i < $allFiles.length; i++) {
                var offset = $($allFiles[i]).offset();
                var left = offset.left;
                var top = offset.top;
                var width = $($allFiles[i]).width();
                var height = $($allFiles[i]).height();
                var NoCollisionFirstCase = top > maxClientY;
                var NoCollisionSecondCase = (top + height) < minClientY;
                var NoCollisionThirdCase = (left + width) < minClientX;
                var NoCollisionForthCase = left > maxClientX;
                if (!(NoCollisionFirstCase || NoCollisionSecondCase || NoCollisionThirdCase || NoCollisionForthCase)) {
                    if (!e.ctrlKey) {
                        $($allFiles[i]).addClass('active');
                    }
                }
            }
            this.isInTagsContent = false;
            $(document.body).off('mouseup.tagsSelection');
        },
        /***
         * tag编辑区拖拽鼠标选择元素,选择中
         * @param e
         * @private
         */

        _processTagSelection: function (e) {
            if (document.getElementById("active_box")) {
                if (e.clientX > _this.startClientX) {
                    var active_box = document.getElementById("active_box");
                    active_box.style.width = Math.abs(e.clientX - _this.startClientX) + 'px';
                    active_box.style.height = Math.abs(e.clientY - _this.startClientY) + 'px';
                    if (e.clientX < _this.startClientX) {
                        active_box.style.left = e.clientX + 'px';
                    }
                    if (e.clientY < _this.startClientY) {
                        active_box.style.top = e.clientY + 'px';
                    }
                } else {
                    var $target = $(e.target);
                    var $tagItem = $target.closest('.tag-list-item');
                    if ($tagItem.length > 0) {
                        _this.jqueryMap.$tagsRightContent.find('.tag-list-item').removeClass('active');
                        $('#active_box').remove();
                        _this.stateMap.isDragging = true;
                        $tagItem.addClass('active');
                        $(document.body).off('mouseup.tagsSelection');
                    }
                }
            }
            if (_this.stateMap.isDragging) {
                var $target = $(e.target);
                if ($target.closest('#projectDataTree').length > 0) {
                    if ($target.closest('li').length > 0) {
                        $('#projectDataTree').find('li').removeClass('active');
                        $target.closest('li').addClass('active');
                    }
                }
                var $tagItem = $target.closest('.tag-folder');
                _this.jqueryMap.$tagsRightContent.find('.tag-list-item').removeClass('dropTarget');
                if ($tagItem.length > 0) {
                    $tagItem.addClass('dropTarget');
                }
                var drag_box = document.getElementById("drag_box");
                if (!drag_box) {
                    var selectedItems = _this.jqueryMap.$tagsRightContent.find('.active'), seleLen = selectedItems.length;
                    drag_box = document.createElement('div');
                    drag_box.id = 'drag_box';
                    drag_box.style.border = '1px dashed #aaa';
                    drag_box.style.padding = '5px';
                    drag_box.style.position = 'absolute';
                    var dragContent = '<ul style="list-style:none;padding:0" class="clearfix">';
                    for (var i = 0; i < seleLen; i++) {
                        var $selectedItem = $(selectedItems[i]), id = $selectedItem.data('id');
                        dragContent += '<li class="clearfix drag-item" data-id="' + id + '">';
                        dragContent += $selectedItem.html();
                        dragContent += '</li>';
                    }
                    dragContent += '</ul>';
                    drag_box.innerHTML = dragContent;
                    _this.jqueryMap.$tagContent.append(drag_box);
                }
                drag_box.style.left = e.pageX - _this.jqueryMap.$tagContent.offset().left + 15 + 'px';
                drag_box.style.top = e.pageY - _this.jqueryMap.$tagContent.offset().top + 50 + 'px';
            }
        },
        /***
         * tag编辑区拖拽鼠标选择元素,开始选择
         * @param e
         * @private
         */
        _startTagSelection: function (e) {
            if (e.which != 1) {//鼠标按下的不是左键
                return false;
            }
            _this.startClientX = e.clientX;
            _this.startClientY = e.clientY;
            $('#drag_box').remove();
            if ($(e.target.closest('li')).hasClass('active')
                && _this.startClientX !== _this.stateMap.lastClickEvent.clientX
                && _this.startClientY !== _this.stateMap.lastClickEvent.clientY) {
                _this.stateMap.isDragging = true;
            } else {
                _this.isInTagsContent = true;
                $('#active_box').remove();
                //在页面创建box
                var active_box = document.createElement('div');
                active_box.id = 'active_box';
                active_box.style.top = _this.startClientY + 'px';
                active_box.style.left = _this.startClientX + 'px';
                active_box.style.position = 'absolute';
                document.body.appendChild(active_box);
            }
            _this.stateMap.lastClickEvent = e;
            $(document.body).on('mouseup.tagsSelection', _this._endTagSelection.bind(_this));
        },
        /***
         * 上传tag execl文件
         * @param file
         * @private
         */
        _uploadHandler: function (file) {
            var formData = new FormData();
            var match = file.name.match(/\.[A-Za-z0-9]+$/);
            if (!file || !match || this.uploadSupportFileType.indexOf(match[0].toLowerCase()) < 0) {
                alert(I18n.resource.dataManage.INVALID_FILE_TYPE);
                return;
            }
            formData.append('file', file);
            Spinner.spin(ElScreenContainer);
            $.ajax({
                url: this.importTagUrl,
                type: 'post',
                data: formData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false
            }).done(function (result) {
                if (result.success) {
                    _this.filterPanel.init();
                }
            }).fail(function (err) {

            }).always(function () {
                Spinner.stop();
            });
        },

        /***
         * 拖拽
         * @param e
         * @private
         */
        _dropTags: function (e) {
            if (!_this.stateMap.isDragging) {
                return;
            }
            var $targetEl = $(e.target);
            if ($targetEl.closest('.tagsLeftContainer').length > 0) {
                var $selectedTags = _this.jqueryMap.$tagsRightContent.find('.active');
                var targetNodes = _this.tree.getNodeByTId($targetEl.closest('li')[0].id);
                if (!targetNodes.isParent) {
                    return;
                }
                for (var i = 0, iLen = $selectedTags.length; i < iLen; i++) {
                    _this.tree.moveNode(targetNodes, _this.getTreeNodeByItem($selectedTags)[i], "inner");
                }
                _this.clickTreeNode(_this.stateMap.tId);
            } else {
                $('#drag_box').remove();
            }
            _this.stateMap.isDragging = false;
        },
        _getTagsByType: function (type) {
            if (!this.tagDict || !this.tagDict.length) {
                return [];
            }
            var ret = [];
            for (var i = 0; i < this.tagDict.length; i++) {
                var tag = this.tagDict[i];
                if (tag.type == type) {
                    ret.push(tag);
                }
            }
            return ret;
        },

        _getTagById: function (id) {
            if (!this.tagDict || !this.tagDict.length) {
                return null;
            }
            for (var i = 0; i < this.tagDict.length; i++) {
                var tag = this.tagDict[i];
                if (tag._id == id) {
                    return tag;
                }
            }
        },
        /***
         * 标记选项
         * @param e
         * @private
         */
        _showMark: function (e) {

            var $selected = _this.jqueryMap.$tagsRightContent.find('.active');
            if ($selected.length > 1) {
                return;
            }

            var $this = $(this);
            var tags = [];
            if ($selected.data('type') == ThingType.group) {
                tags = _this._getTagsByType(TagType.equipment);
            } else {
                tags = _this._getTagsByType(TagType.sensor);
            }
            if (tags && tags.length) {
                if ($this.find('ul').length) {
                    return;
                }
                //文件夹形式可以选择类型
                var mark_content = '<ul class="dropdown-menu" style="display:block;position:absolute;">';
                for (var i = 0, iLen = tags.length; i < iLen; i++) {
                    var type = tags[i].type;
                    var icon = tags[i].icon ? tags[i].icon : '';
                    var name = tags[i].name;
                    if ($.isArray(tags[i].name)) {
                        name = tags[i].name.join(' ');
                    }
                    var id = tags[i]._id;
                    mark_content += '<li data-type="' + type + '" data-id="' + id + '"><a tabindex="-1"><span style="margin-right:10px;" class="iconfont icon-' + icon + '" aria-hidden="true"></span>' + name + '</a></li>';
                }
                mark_content += '</ul>';
                $(mark_content).css({
                    'left': $this.width() + 25 + 'px',
                    'top': '-12px'
                }).appendTo($this);
            }
        },
        /***
         * 选择tag元素
         * @param e
         * @private
         */
        _selectTagItem: function (e) {
            var $this = $(this);
            if (e.ctrlKey) {
                $this.toggleClass('active');
                _this.currentFileIndex = $this.index();
            } else {
                if (e.shiftKey) {//!ctrl+shift
                    var minIndex = Math.min(_this.currentFileIndex, $this.index());
                    var maxIndex = Math.max(_this.currentFileIndex, $this.index());
                    var $allFiles = _this.jqueryMap.$tagsRightContent.find('.tag-list-item');
                    $allFiles.removeClass('active');
                    for (; minIndex < maxIndex + 1; minIndex++) {
                        $($allFiles[minIndex]).addClass('active');
                    }
                    _this.currentFileIndex = $this.index();
                } else {//!ctrl+!shift
                    $this.addClass('active');
                    _this.jqueryMap.$tagsRightContent.find('.tag-list-item').not(this).removeClass('active');
                    _this.currentFileIndex = $this.index();
                }
            }
            _this.path = _this.tree.getNodeByParam("_id", $(this).data("id")).getPath();
            _this.jqueryMap.$tagExplorer.find('.detailed_information').empty().append(beopTmpl('tpl_tags_detailed_information', {paths: _this.path}));
        },
        /***
         *打开contextMenu
         */
        openContextMenu: function ($contextMenu, mouseX, mouseY) {
            $('.contextMenu').hide();
            if ($contextMenu) {
                $contextMenu.css({
                    display: "block",
                    left: (mouseX - 245),
                    top: (mouseY - 56)
                });
            }
        },
        /***
         * 关闭contextMenu
         * @param $contextMenu
         */
        closeContextMenu: function () {
            $('.contextMenu').hide();
        },
        /***
         * 根据Tag content中的元素获取Tree中treeNode对象
         * @param $el
         * @returns {Array}
         */
        getTreeNodeByItem: function ($el) {
            var ret = [];
            if (!$el) {
                return [];
            }
            $el.each(function (index, item) {
                var _id = item.dataset.id;
                _id && ret.push(_this.tree.getNodeByParam('_id', _id));
            });
            return ret;
        },

        /***
         * 根据Tag content中的元素获取Tree中父节点的treeNode对象
         * @param $el
         * @returns {*}
         */
        getParentTreeNodeByItem: function ($el) {
            var tid = $el.data('ptid');
            return tid && _this.filterPanel.tree.getNodeByTId(tid);
        },

        updateTreeNodeById: function (nodeId, option) {
            var node = this.tree.getNodeByParam('_id', nodeId);
            if (!node) {
                return;
            }
            //如果是group,treeNode的图标变成黄色
            if (node.type == 'group' && option.iconSkin) {
                option.iconSkin += ' tree-folder ';
            }
            $.extend(node, option);
            this.tree.updateNode(node);
        },

        /**
         * 根据id移动tree上的节点
         * @param targetId
         * @param nodeIds
         * @param moveType
         * @param isSilent
         * @returns {boolean}
         */
        moveTreeNodes: function (targetId, nodeIds, moveType, isSilent) {
            var targetNode = this.tree.getNodeByParam('_id', targetId);
            if (!targetNode) {
                return false;
            }
            if (!moveType) {
                moveType = 'inner';
            }
            if (!isSilent) {
                isSilent = false;
            }
            //拖点进一个没有expand的文件夹,tree里会出现两个点,一个异步加载,一直手动添加
            _this.expandTreeNode(targetNode, true, function () {
            });
            for (var i = 0; i < nodeIds.length; i++) {
                var nodeId = nodeIds[i];
                var node = this.tree.getNodeByParam('_id', nodeId);
                if (node) {
                    this.tree.moveNode(targetNode, node, moveType, isSilent);
                    //更新右下方的文件个数,文件夹个数
                    _this.jqueryMap.$tagExplorer.find('.fileNumber').empty().append(beopTmpl('tpl_tags_fileNumber', {node: _this.tree.getNodesByParam('parentTId', _this.currentNode.tId)}));

                }
            }
        },

        /***
         * 删除Tree中的treeNode
         * @param treeNodes
         */
        removeTreeNodes: function (treeNodes) {
            if (treeNodes) {
                var ids = [];
                treeNodes.forEach(function (node) {
                    ids.push(node._id);
                });
                WebAPI.post('/tag/del', {
                    "projId": AppConfig.projectId,
                    "thingsIds": ids
                }).done(function (result) {
                    if (result.status) {
                        treeNodes.forEach(function (node) {
                            _this.tree.removeNode(node);
                        });
                    }
                    _this.clickTreeNode(_this.currentNode.tId);
                });
            }
        },
        /***
         * 重命名tree中的treeNode的名字
         * @param treeNode
         * @param name
         */
        renameTreeNodes: function (treeNode, name) {
            if (!name || !name.trim()) {
                return;
            }
            treeNode.name = name.trim();
            var request_data = {
                'projId': AppConfig.projectId,
                'name_new': name.trim(),
                'thingsId': treeNode._id
            };
            WebAPI.post('/tag/ThingsTree/rename', request_data).done(function (result) {
                if (result.status) {
                    _this.jqueryMap.$tagsRightContent.find('.tag-list-item.active .tag-list-item-name').text(name);
                    _this.tree.updateNode(treeNode);
                } else {
                    if (result.message == 'This name already exists') {
                        infoBox.prompt(I18n.resource.common.ALREADY_THERE + name.trim() + I18n.resource.common.ALREADY_FOLDERS, function (text) {
                            if (!text || !text.trim()) {
                                alert(I18n.resource.common.EMPTY_NAME);
                            }
                            _this.renameTreeNodes(treeNode, text);
                        })
                    } else {
                        alert.danger(result.message);
                    }
                }
            })
        },

        // expandNodes: function (nodes) {
        //     if (!nodes) {
        //         return;
        //     }
        //     for (var i = 0, iLen = nodes.length; i < iLen; i++) {
        //         if (nodes[i].isParent && nodes[i].zAsync) {
        //             _this.expandNodes(nodes[i].children);
        //         } else {
        //             _this.filterPanel.tree.reAsyncChildNodes(nodes[i], "refresh", true);
        //
        //         }
        //     }
        //
        // },

        /**
         * 添加treeNode到tree中
         * @param ptid
         * @param treeNodes
         * @param isAddThisPage tag Tree在文件夹上右键菜单,新建文件夹不需要显示在右侧页面上
         * @returns {boolean}
         */
        addTreeNodes: function (ptid, treeNodes, isAddThisPage) {
            if (!treeNodes || !treeNodes.length) {
                return false;
            }
            var parentNode = ptid ? _this.tree.getNodeByTId(ptid) : null;
            this.tree.addNodes(parentNode, 0, treeNodes);
            if (isAddThisPage) {
                for (var i = 0; i < treeNodes.length; i++) {
                    this.jqueryMap.$tagList.prepend(beopTmpl('tpl_tag_explorer_item', {item: treeNodes[i]}));
                    //更新右下方的文件个数,文件夹个数
                    _this.jqueryMap.$tagExplorer.find('.fileNumber').empty().append(beopTmpl('tpl_tags_fileNumber', {node: _this.tree.getNodesByParam('parentTId', _this.currentNode.tId)}));
                }
            }
        },

        /***
         *  返回左侧被选择的treeNode
         * @returns {*}
         */
        getSelectedTreeNodes: function () {
            return this.filterPanel.tree.getSelectedNodes();
        },
        /***
         * 点击左侧TreeNode
         * @param tid
         * @returns {boolean}
         */
        clickTreeNode: function (tid) {
            if (!tid) {
                _this.renderRightTagsContent();
            }
            this.$container.find('#' + tid + '_span').click();
            return this;
        },

        /***
         * 展开tree的节点
         * @param pTreeNode
         * @param isDispatchEvent 是否触发beforeExpand和onExpand事件
         * @param func
         * @returns {PointManagerImportTagsFunc}
         */
        expandTreeNode: function (pTreeNode, isDispatchEvent, func) {
            if (typeof isDispatchEvent === typeof undefined) {
                isDispatchEvent = true;
            }
            if (pTreeNode && !pTreeNode.open) {
                _this.tree.expandNode(pTreeNode, true, false, true, true);
            }
            func();
            return this;
        },
        /***
         * 记录路径
         * @param treeNode
         */
        logPath: function (treeNode) {
            var pathState = this.stateMap.explorerPath;
            if (pathState.index === (pathState.path.length - 1)) {
                var lastPath = pathState.path[pathState.path.length - 1];
                if (treeNode) {
                    if (treeNode.tId === lastPath) {
                        return;
                    }
                    pathState.path.push(treeNode.tId);
                } else {
                    pathState.path.push('');
                }
                pathState.index++;
            } else {
                pathState.path = pathState.path.slice(0, pathState.index + 1);
                treeNode ? pathState.path.push(treeNode.tId) : pathState.path.push('');
                pathState.index = pathState.path.length - 1;
            }
        },
        /***
         * 上一个路径
         * @returns {*}
         */

        lastPath: function () {
            var pathState = this.stateMap.explorerPath;
            pathState.shouldLog = false;
            pathState.index--;
            return pathState.path[pathState.index];
        },
        /***
         * 下一个路径
         * @returns {*}
         */

        nextPath: function () {
            var pathState = this.stateMap.explorerPath;
            pathState.shouldLog = false;
            pathState.index++;
            return pathState.path[pathState.index];
        },

        getThingFromTree: function (parent, thingId) {
            if (!parent) {
                parent = _this.nodes;
            }
            var ret;

            for (var i = 0; i < parent.length; i++) {
                var item = parent[i];
                if (item._id && item._id === thingId) {
                    ret = item;
                    break;
                }

                if (item.children && item.children.length) {
                    ret = this.getThingFromTree(item.children, thingId);
                }
            }
            return ret;
        },

        /***
         * 点拖到group中
         * @param id
         */
        movePointsToGroup: function (id) {
            var $dragBox = $('#drag_box');
            if ($dragBox.length) {
                var thingIds = [];
                $dragBox.find('.drag-item').each(function (index, item) {
                    thingIds.push(item.dataset.id);
                });
                if (!thingIds || !thingIds.length) {
                    return false;
                }
                if ($.inArray(id, thingIds) != -1) {
                    return false;
                }
                Spinner.spin(_this.jqueryMap.$tagContent.get(0));
                WebAPI.post('/tag/moveThings', {
                    Prt: id,
                    thingsId: thingIds,
                    projId: AppConfig.projectId
                }).done(function (result) {
                    if (result.status) {
                        for (var i = 0; i < thingIds.length; i++) {
                            if (thingIds[i]) {
                                $('.tag-list-item[data-id=' + thingIds[i] + ']', _this.jqueryMap.$tagList).remove();
                            }
                        }
                        _this.jqueryMap.$tagsRightContent.find('.tag-list-item').removeClass('dropTarget');
                        _this.moveTreeNodes(id, thingIds);
                    } else {
                        alert.danger('move failed');
                    }
                }).always(function () {
                    Spinner.stop();
                });
                $dragBox.remove();
                _this.stateMap.isDragging = false;
            }
        },
        /***
         * 新增tag
         * @param id
         */
        addTag: function (id) {
            infoBox.prompt(I18n.resource.common.ENTER_NAME, function (text) {
                var textHandle = text.trim();
                if (!textHandle) {
                    confirm(I18n.resource.common.EMPTY_NAME, function () {
                        _this.addTag(id);
                    });
                    return;
                }
                var request_data = {
                    'projId': AppConfig.projectId,
                    'name': textHandle,
                    'type': 'group'
                };
                if (id) {
                    request_data['Prt'] = id;
                }
                WebAPI.post('/tag/ThingsTree/create', request_data).done(function (result) {
                    if (result.status) {
                        var pId = id ? _this.tree.getNodeByParam('_id', id).tId : null;
                        var isCurrentNode = _this.currentNode._id == id;
                        //在文件夹上右键新建文件夹,如果没有expand会出现tree里面增加两个相同文件夹的情况(一个为异步加载,一个为addTreeNode手动添加)
                        if (!isCurrentNode) {
                            _this.expandTreeNode(_this.tree.getNodeByParam('_id', id), true, function () {
                            });
                        }
                        _this.addTreeNodes(pId, [
                            {
                                _id: result.id,
                                name: textHandle,
                                type: ThingType.group,
                                isParent: true
                            }
                        ], isCurrentNode);
                    } else {
                        if (result.message == 'This name already exists') {
                            confirm(I18n.resource.common.ALREADY_THERE + textHandle + I18n.resource.common.ALREADY_FOLDERS, function () {
                                _this.addTag(id);
                            });
                        } else {
                            alert.danger(result.message);
                        }
                    }
                })
            })
        },

        /***
         *添加页面事件
         */
        attachEvents: function () {
            /***
             * tag编辑区操作
             */
            this.jqueryMap.$tagsRightContent.on('mousedown.tagsSelection', this._startTagSelection);
            this.jqueryMap.$tagContent.mousemove(this._processTagSelection);
            this.jqueryMap.$tagsRightContent.off('click.fileSelect').on('click.flieSelect', '.tag-list-item', this._selectTagItem);
            this.jqueryMap.$tagContent.on('mouseup.tagsdrop', this._dropTags);
            this.jqueryMap.$tagsRightHeader.off('click.orderList').on('click.orderList', '.glyphicon-th-list', function () {
                $('.tags-right-content').addClass('orderList');
                $(this).removeClass('btn-default').addClass('btn-primary').siblings('.glyphicon-th').removeClass('btn-primary').addClass('btn-default');
            });
            this.jqueryMap.$tagsRightHeader.off('click.orderNormal').on('click.orderNormal', '.glyphicon-th', function () {
                $('.tags-right-content').removeClass('orderList');
                $(this).removeClass('btn-default').addClass('btn-primary').siblings('.glyphicon-th-list').removeClass('btn-primary').addClass('btn-default');
            });
            // this.jqueryMap.$tagContent.off('mouseenter.showMarks').on('mouseenter.showMarks', '.markAs', this._showMark);

            //自动识别返回
            this.jqueryMap.$tagExplorer.off('click.backToTags').on('click.backToTags', '#backToTags', function () {
                _this.jqueryMap.$tagExplorer.html(_this.$tagsExplorerChild);
            });

            //开始自动识别
            this.jqueryMap.$tagExplorer.off('click.beginToIdentify').on('click.beginToIdentify', '#beginToIdentify', function () {
                var opt = {};
                opt.type = _this.identifyNode.type;
                opt.arrVariable = Object.keys(_this.allAttrType[_this.identifyNode.type].attrs);
                opt.arrClass = [];
                if (_this.identifyNode.unArrP && _this.identifyNode.unArrP.length) {
                    for (var i = 0, iLen = _this.identifyNode.unArrP.length; i < iLen; i++) {
                        opt.arrClass.push({"name": _this.identifyNode.unArrP[i]});
                    }
                }
                WebAPI.post('/diagnosisEngine/matchPoints', opt).done(function (result) {
                    console.log(result);
                });
            });

            $('.menu-mark-as').mouseenter(this._showMark).mouseleave(function () {
                $(this).find('ul').remove();
            }).on('click', 'li', function () {
                var $this = $(this), $selectedFiles = _this.jqueryMap.$tagsRightContent.find('.active'), thing_ids = [];
                for (var i = 0; i < $selectedFiles.length; i++) {
                    thing_ids.push($selectedFiles[i].dataset.id);
                }
                Spinner.spin(_this.jqueryMap.$tagExplorer[0]);
                WebAPI.post('/tag/setTag', {
                    tagId: $this.data('id'),
                    thingsIds: thing_ids,
                    projId: AppConfig.projectId
                }).done(function (result) {
                    if (result.status) {
                        var tag = _this._getTagById($this.data('id'));
                        $selectedFiles.each(function (index, selectedFile) {
                            var $selectedFile = $(selectedFile);
                            var $selectedFileSpan = $selectedFile.find('.tag-list-icon');
                            if (tag.icon) {
                                $selectedFileSpan.removeClass().addClass('iconfont tag-list-icon icon-' + tag.icon);
                            } else {
                                $selectedFileSpan.removeClass().addClass('glyphicon glyphicon-folder-close tag-list-icon folder');
                            }
                            $selectedFile.data('tagid', tag._id);
                            _this.updateTreeNodeById($selectedFile.data('id'), {'iconSkin': tag.icon ? _this._makeIconSkin(tag.icon) : ''});
                            if (tag.type === TagType.equipment) {
                                $selectedFile.data('ismarked', true);
                            }
                        });
                    }
                }).always(function () {
                    Spinner.stop();
                })
            });

            /***
             * tag excel上传
             */
            this.jqueryMap.$uploadInput.change(function () {
                var $this = $(this);
                _this._uploadHandler($this[0].files[0]);
                $this.val(null);
            });

            this.jqueryMap.$importTags.click(function () {
                _this.jqueryMap.$uploadInput.click();
            });

            /***
             * 目前的点同步成tag结构
             */

            this.jqueryMap.$syncPointToTree.click(function () {
                Spinner.spin(ElScreenContainer);
                WebAPI.get('/tag/syncCloudPointToThingTree/' + AppConfig.projectId).done(function (result) {
                    _this.tree = null;
                    _this.renderRightTagsContent();
                }).always(function () {
                    Spinner.stop();
                });
            });

            /***
             * 双击tag-folder进入
             */

            this.jqueryMap.$tagsRightContent.on('dblclick', '.tag-folder', function () {
                var $this = $(this);
                var _id = $this.data('id');
                var treeNode = _this.tree.getNodeByParam('_id', _id);
                _this.expandTreeNode(treeNode, true, function () {
                    _this.clickTreeNode(treeNode.tId);
                }.bind(this));
            });

            /***
             * 拖点到group
             */

            this.jqueryMap.$tagsRightContent.on('mouseup', '.tag-folder', function () {
                if (_this.stateMap.isDragging) {
                    _this.movePointsToGroup($(this).data('id'));
                }
            });

            /***
             * 点击Tag路径
             */

            this.jqueryMap.$tagsPath.on('click', '.tag-path', function () {
                _this.clickTreeNode($(this).data('tid'));
            });

            /***
             *  高亮IOT Tree
             */
            //this.jqueryMap.$tbWrap.on('click', '#paneIotData li', function () {
            //    $('#paneIotData li.treeItemActive').removeClass('treeItemActive');
            //    $(this).addClass('treeItemActive');
            //});

            /***
             *  右键menu
             */
            this.jqueryMap.$tagsRightContent.on('contextmenu', '.tag-list-item', function (e) {
                var $this = $(this);
                if (!$this.hasClass('active')) {
                    _this.jqueryMap.$tagsRightContent.find('.tag-list-item.active').removeClass('active');
                    $this.addClass('active');
                }
                var $selected_files = _this.jqueryMap.$tagsRightContent.find('.tag-list-item.active');
                var $firstSelectedFile = $($selected_files[0]);
                var $contentMenu = $('#contextMenu-item');
                $contentMenu.removeClass('hide_mark_as');
                //已经标记的有自动识别点的功能;
                if (!!$firstSelectedFile.data('ismarked')) {
                    $contentMenu.removeClass('hide-auto-identify');
                } else {
                    $contentMenu.addClass('hide-auto-identify');
                }

                if ($firstSelectedFile.hasClass('tag-folder')) {
                    $contentMenu.removeClass('not_group_file');
                } else {
                    $contentMenu.addClass('not_group_file');
                }

                if ($selected_files.length > 1) {
                    if ($selected_files && $selected_files.length) {
                        var type = $($selected_files[0]).data('type');
                        //是否加上复制
                        $contentMenu.removeClass('not_group_file');
                        for (var i = 1, iLen = $selected_files.length; i < iLen; i++) {
                            if (!$($selected_files[i]).hasClass('tag-folder')) {
                                $contentMenu.addClass('not_group_file');
                            }
                        }
                        for (var i = 1, iLen = $selected_files.length; i < iLen; i++) {
                            if ($($selected_files[i]).data('type') != type) {
                                $contentMenu.addClass('hide_mark_as');
                                break;
                            }
                        }
                    }
                    $contentMenu.addClass('multiple-item');
                } else {
                    $contentMenu.removeClass('multiple-item');
                }
                _this.openContextMenu($contentMenu, e.pageX, e.pageY);
                return false;
            });
            this.jqueryMap.$tagsRightContent.contextmenu(function (e) {
                _this.openContextMenu($('#contextMenu-panel'), e.pageX, e.pageY);
                return false;
            });

            //新建Tag 在空白处
            this.jqueryMap.$container.on('click', '.menu-new-tag', function () {
                _this.addTag(_this.addTagPid ? _this.addTagPid : _this.currentNode._id);
                _this.addTagPid = null;
            });

            //删除
            this.jqueryMap.$container.off('click.menu-delete').on('click.menu-delete', '.menu-delete', function () {
                confirm(I18n.resource.common.DELETE_IT, function () {
                    var $selectedItem = _this.jqueryMap.$tagsRightContent.find('.tag-list-item.active');
                    _this.removeTreeNodes(_this.getTreeNodeByItem($selectedItem));
                    $selectedItem.remove();
                })
            });

            //重命名
            this.jqueryMap.$container.off('click.menu-rename').on('click.menu-rename', '.menu-rename', function () {
                infoBox.prompt('Please enter the new name.', function (text) {
                    if (!text || !text.trim()) {
                        alert(I18n.resource.common.EMPTY_NAME);
                    }
                    var $selectedItem = _this.jqueryMap.$tagsRightContent.find('.tag-list-item.active');
                    _this.renameTreeNodes(_this.getTreeNodeByItem($selectedItem)[0], text);
                })
            });

            //复制空文件夹
            this.jqueryMap.$container.off('click.menu-copy-file').on('click.menu-copy-file', '.menu-copy-file', function () {
                _this.copyFiles = _this.jqueryMap.$tagsRightContent.find('.tag-list-item.active');
                $('.menu-paste').show();
            });

            //粘贴文件夹
            this.jqueryMap.$container.off('click.paste').on('click.paste', '.menu-paste', function () {
                var opt = {};
                opt.projId = AppConfig.projectId;
                opt.Prt = _this.currentNode._id || '';
                opt.arrfolder = [];
                for (var i = 0, iLen = _this.copyFiles.length; i < iLen; i++) {
                    opt.arrfolder.push(_this.tree.getNodeByParam('_id', $(_this.copyFiles[i]).data('id')));
                }
                WebAPI.post('/tag/ThingsTree/copy', opt).done(function (result) {
                    if (result.status) {
                        _this.clickTreeNode(_this.currentNode.tId);
                        //在最外层粘贴成功后,重新加载一遍树;
                        if (!opt.Prt) {
                            _this.tree = null;
                        }
                    }
                });
            });

            //自动识别
            this.jqueryMap.$container.off('click.menu-auto-identify').on('click.menu-auto-identify', '.menu-auto-identify', function () {
                // this.jqueryMap.$container.on('click', '.tagsRightContainer', function () {
                var $selectedItem = _this.jqueryMap.$tagsRightContent.find('.tag-list-item.active');


                var deviceTypePageMap = {
                    '57bd945b04c0960c84b7be2a': '1472524202584001fbddd71c',
                    '57bd946204c0960c84b7be2b': '14724400181410017ea9c796'
                };

                var tags = _this.tagDict, dictVariable = {};

                var id = $selectedItem.data('id');
                var tagId = $selectedItem.data('tagid');

                if (!tagId || !deviceTypePageMap[tagId]) {
                    alert.danger('can\'t find the model');
                    return;
                }

                for (var i = 0; i < tags.length; i++) {
                    var tag = tags[i];
                    if (tag._id === tagId) {
                        for (var j = 0; j < tag.attrP.length; j++) {
                            var attr = tag.attrP[j];
                            dictVariable[attr.name] = '';
                        }
                        break;
                    }
                }

                var thing = _this.getThingFromTree(null, id);
                var arrVariable = [];
                for (var k = 0; k < thing.children.length; k++) {
                    var point = thing.children[k];
                    arrVariable.push(point._id);
                }
                _this.diagnosisScreen = new DiagnosisConfigScreen({
                    name: $selectedItem.data('name'),
                    projId: AppConfig.projectId,
                    thingId: id,
                    srcPageId: deviceTypePageMap[tagId],
                    dictVariable: dictVariable,
                    arrVariable: arrVariable
                });
                _this.$tagsExplorerChild = _this.jqueryMap.$tagExplorer.children().detach();
                _this.diagnosisScreen.show(_this.jqueryMap.$tagExplorer, _this.filterPanel);
                //自动识别右侧table初始化
                _this.diagnosisScreen.showDeferred.done(function () {
                    _this.jqueryMap.$container.find('#container-right').html(beopTmpl('tpl_auto_identify_list', {matchPoints: thing.children}));
                    $('.identifyItem').on('dragstart', function () {
                        EventAdapter.setData({'dsItemId': $(this).data('id')});
                    });
                });
            });

            $(window).on('click.tag.contextMenu', _this.closeContextMenu);

            /***
             *  全部展开,全部收起
             */
            this.jqueryMap.$tagsLeftContainer.on('click', '.glyphicon-chevron-down', function () {
                // _this.expandNodes(_this.filterPanel.tree.getNodes());
            });
            this.jqueryMap.$tagsLeftContainer.on('click', '.glyphicon-chevron-up', function () {
                _this.filterPanel.tree.expandAll(false);
            });
            //左侧tagTree显示所有的点
            this.jqueryMap.$tagsLeftContainer.on('click', '#tagTreeShowAll', function () {
                _this.tree = null;
                _this.renderRightTagsContent(null, null, null, true);
            });
            //上一级
            this.jqueryMap.$tagsLeftContainer.on('click', '.glyphicon-arrow-up', function () {
                if ($(this).hasClass('disable')) {
                    return;
                }
                if (_this.currentNode.parentTId) {
                    _this.clickTreeNode(_this.currentNode.parentTId);
                } else {
                    _this.renderRightTagsContent();
                }
            });
            //前进
            this.jqueryMap.$tagsLeftContainer.on('click', '.next-path', function () {
                if ($(this).hasClass('disable')) {
                    return;
                }
                _this.clickTreeNode(_this.nextPath());
            });
            //后退
            this.jqueryMap.$tagsLeftContainer.on('click', '.last-path', function () {
                if ($(this).hasClass('disable')) {
                    return;
                }
                _this.clickTreeNode(_this.lastPath());
            });

            //搜索
            this.jqueryMap.$tagSearchBox.on('click', '.glyphicon-search', function () {
                _this.searchTag();
            });
            this.jqueryMap.$tagSearch.on('keyup', function (e) {
                if (e.which != 13) {
                    return;
                }
                _this.searchTag();
            })
        },
        detachEvents: function () {
            $(window).off('click.tag.contextMenu');
        }
    };
    $.extend(PointManagerImportTags.prototype, PointManagerImportTagsFunc);
    return PointManagerImportTags;
})();

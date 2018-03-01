var DmTagMark = (function () {
    var _this;

    var editTagAttr = ['AHU', 'BOILER', 'CHILLER', 'CT', 'PUMP', 'HX', 'IU', 'MAU', 'OAU', 'VAV', 'CAV', 'CHWP', 'CLEANER'
        , 'CWP', 'DIESEL', 'EAF', 'FAN', 'FCU', 'HWP', 'PAC', 'PAU', 'PLANT', 'RAF', 'FLOOR', 'ZONE', 'ROOM', 'LINECURRENT',
        'LINEVOLTAGE', 'PHASECURRENT', 'PHASEVOLTAGE'];

    var PAGE_SIZE_STORAGE_KEY = 'dm.tag.edit.page.size';

    var viewType = {
        mark: 'mark',//标记模式用于给点或者目录打tag
        check: 'check'//tag模式用于检查Tag标记情况
    };

    var stateMap = {
        mode: viewType.mark
    };

    function DmTagMark(projectId) {
        _this = this;
        _this.enterFirst = true;
        PointManager.call(_this, projectId);
        _this.htmlUrl = '/static/scripts/dataManage/views/dm.importTag.html';
        _this.projectId = projectId;
        this.nodePrt = '';
        this.rootDirectoryPrt = '';
        this.parentTId = null;
        _this.TagName = null;
    }

    DmTagMark.prototype = Object.create(PointManager.prototype);
    DmTagMark.prototype.constructor = DmTagMark;


    var DmTagMarkFunc = {
        show: function () {
            _this.init().done(function () {
                _this.$container = $("#tagContainer");
                _this.$container.html(beopTmpl('tpl_tag_view'));
                //初始为mark页面
                stateMap.mode = viewType.mark;

                beop.tag.panel.configModel({
                    cb_on_click: function (tag) {
                        if (stateMap.mode === viewType.mark) {//mark页面
                            var arrTagList = [];
                            _this.$dataTable.simpleDataTable('getSelectedRows').each(function (index, row) {
                                var $row = $(row),
                                    rowData = $row.data('value');
                                _this._addTag(rowData, tag[0]);
                                $row.data('value', rowData);
                                arrTagList.push({
                                    prt: rowData.prt,
                                    Id: rowData._id,
                                    tags: rowData.tag,
                                    type: rowData.type
                                });
                            });

                            if (!arrTagList.length) {
                                return;
                            }

                            WebAPI.post('/tag/setTag', {
                                projId: AppConfig.projectId,
                                arrTag: arrTagList,
                                inheritable: true
                            }).done(function (result) {
                                if (result.success) {
                                    _this.$dataTable.simpleDataTable('getSelectedRows').each(function (index, row) {
                                        var $row = $(row);
                                        var rowData = $row.data('value');
                                        if (rowData.tag && rowData.tag.length) {
                                            rowData.tag = _this.advanceEquipment(rowData.tag);
                                        }
                                        var equipment = beop.model.dmModel.hasEquipment(rowData.tag);
                                        $row.find('td:last').html(beopTmpl('tpl_tag_row', {
                                            tags: rowData.tag,
                                            editable: rowData.type == 'group',
                                            canDelete: true,
                                            editTagAttr: editTagAttr
                                        }));
                                        _this.changeIco(rowData, equipment, $row);
                                    });
                                    var treeObj = $.fn.zTree.getZTreeObj("tagTreeUl");
                                    var nodes = treeObj.getNodesByParam('_id', arrTagList[0].prt, null)[0];
                                    var selectFolder = [],
                                        icon, equipment, defaultIcon;
                                    if (nodes.zAsync) {
                                        for (var i = 0, len = nodes.children.length; i < len; i++) {
                                            selectFolder = nodes.children[i];
                                            for (var j = 0; j < arrTagList.length; j++) {
                                                if (arrTagList[j].type == 'group') {
                                                    if (selectFolder._id == arrTagList[j].Id) {
                                                        equipment = beop.model.dmModel.hasEquipment(arrTagList[j].tags);
                                                        var tagIconsMap = beop.model.dmModel.getTagIcons();
                                                        if (equipment) {
                                                            if (tagIconsMap[equipment.name.toLowerCase()]) {
                                                                selectFolder.iconSkin = 'button icon iconfont ' + tagIconsMap[equipment.name.toLowerCase()];
                                                            } else {
                                                                delete selectFolder['iconSkin'];
                                                                defaultIcon = 'button ' + ('ico_' + (selectFolder.open ? 'open' : 'close'));
                                                                $('#' + selectFolder.tId + '_ico').removeClass().addClass(defaultIcon);
                                                                continue;
                                                            }
                                                        } else {
                                                            delete selectFolder['iconSkin'];
                                                            defaultIcon = 'button ' + ('ico_' + (selectFolder.open ? 'open' : 'close'));
                                                            $('#' + selectFolder.tId + '_ico').removeClass().addClass(defaultIcon);
                                                            continue;
                                                        }
                                                        $('#' + selectFolder.tId + '_ico').removeClass().addClass(selectFolder.iconSkin);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        } else if (stateMap.mode === viewType.check) {//检查页面
                            _this.$dataTable.simpleDataTable('setPostData', 'tags', tag.map(function (item) {
                                return item.name.trim();
                            }).filter(function (item) {
                                return !!item;
                            }));
                            _this.$dataTable.simpleDataTable('refreshTable');
                        }
                    }
                });
                beop.tag.panel.init($(".tag-right-box"));
                beop.tag.tree.configModel({
                    isLoadCache: false,
                    cb_on_click: function (node) {
                        var selectTagsType = Number($('#markState').val());
                        if (node == 'showAll') {
                            _this.$dataTable.simpleDataTable('setPostData', 'Prt', '');
                            _this.$dataTable.simpleDataTable('setPostData', 'isAll', true);
                            if (selectTagsType !== beop.tag.constants.markState.Unknown && selectTagsType !== beop.tag.constants.markState.Uncertain) {
                                _this.$dataTable.simpleDataTable('delPostData', 'tags');
                            }
                            _this.$dataTable.simpleDataTable('setSearch', 'searchText', '');
                            var data = {
                                _id: ''
                            };
                            _this.loadTags(data, true);
                        } else {
                            _this.nodePrt = '';
                            _this.parentTId = null;
                            _this.treeNode = node;
                            if (typeof(_this.$dataTable) == "undefined") {
                                _this.loadTableView($("#markMode-folder-table"));
                                _this.loadTags(node);
                            } else {
                                _this.$dataTable.simpleDataTable('setPostData', 'Prt', node._id);
                                if (selectTagsType !== beop.tag.constants.markState.Unknown && selectTagsType !== beop.tag.constants.markState.Uncertain) {
                                    _this.$dataTable.simpleDataTable('delPostData', 'tags');
                                }
                                _this.$dataTable.simpleDataTable('delPostData', 'isAll');
                                _this.$dataTable.simpleDataTable('setSearch', 'searchText', '');
                                _this.nodePrt = node.prt;
                                _this.parentTId = node.parentTId;
                                _this.loadTags(node);
                            }
                        }
                    },
                    itemShowList: ['edit', 'dragDirectory'],
                    editable: true,
                    isOnlyGroup: true,
                    isDrag: false,
                    showIcon: false,
                    showALLNodes: true
                });
                beop.tag.tree.init($("#tagTreeBox"));
                _this.folderState();
                //折叠效果
                var side = new SidebarMenuEffect();
                side.init('#dmPaneContent');

                _this.attachEvents();
            });
        },

        /***
         * 添加方法
         */

        // 绑定事件
        attachEvents: function () {
            var $editModal = $("#tag-markMode-edit");
            // 点击  标记模式   tag模式
            _this.$container.off('click.tag-mode').on('click.tag-mode', '#check-mode', function () {
                $(this).closest('.tagModeStyle').addClass('tabMode').siblings().removeClass('tabMode');
                $("#modeType-content").empty().append(beopTmpl('tpl_tag_mode_list'));
                _this.loadTableView($("#tagMode-table"));
                stateMap.mode = viewType.check;
                beop.tag.panel.configModel({
                    multiple: true
                });
                $('#tagContent').find('.tag-item').removeClass('selectedColor');
            }).off('click.mark-mode').on('click.mark-mode', '#mark-mode', function () {
                $(this).closest('.tagModeStyle').addClass('tabMode').siblings().removeClass('tabMode');
                $("#modeType-content").empty().append(beopTmpl('tpl_markMode_folder'));
                _this.loadTableView($("#markMode-folder-table"));
                stateMap.mode = viewType.mark;
                beop.tag.panel.configModel({
                    multiple: false
                });
                $('#tagContent').find('.tag-item').removeClass('selectedColor');
            }).on('click', '.editTag', function () {
                _this.editContent($(this));
            }).off('click.all-select').on('click.all-select', '#all-select', function () {
                _this.$dataTable.simpleDataTable('selectAll');
            }).off('click.reverse-select').on('click.reverse-select', '#reverse-select', function () {
                _this.$dataTable.simpleDataTable('reverseSelect');
            }).off('click.parent-directory').on('click.parent-directory', '#parent-directory', function () {
                _this.upperLevelDirectory(_this.parentTId);
            }).off('click.markMode-return').on('click.markMode-return', '#markMode-return', function () {
                _this.$dataTable.simpleDataTable('setPostData', 'Prt', node._id);
                _this.$dataTable.simpleDataTable('refreshTable');
            });

            _this.$container.off('click.removeTag').on('click.removeTag', '.removeTag', this.deleteTag);
            $editModal.off('click.editConfirm').on('click.editConfirm', '#editConfirm', this.editConfirm);
            _this.$container.off('change.changeMarkState').on('change.changeMarkState', '#markState', this.changeMarkState);

            _this.$container.off('change.pageSize').on('change.pageSize', '.table-footer .pageSizeSelect', function () {
                localStorage.setItem(PAGE_SIZE_STORAGE_KEY, parseInt($(this).val()));
            });
            _this.$container.off('click.deleteTag').on('click.deleteTag', '#allTags .deleteTag', function () {
                var $this = $(this);
                var $li = $this.closest('li');
                var deleteTagName = $li.attr('data-value');
                var tags = [];
                tags.push(deleteTagName);
                var selectNode = beop.tag.tree.getSelectTreeNode()[0];
                var data = {
                    projId: AppConfig.projectId,
                    groupId: selectNode._id,
                    tags: tags
                };
                WebAPI.post('tag/del_tags/ByGroups', data).done(function (result) {
                    if (result.success) {
                        $li.remove();
                        _this.$dataTable.simpleDataTable('refreshTable');
                    } else {
                        alert.danger(result.msg);
                    }
                });
            });
        },
        // 取消事件
        detachEvents: function () {

        },

        loadTags: function (node, isAll) {
            var $showNodeTag = $('#showNodeTag');
            var newSpinner = new LoadingSpinner({color: '#00FFFF'});
            newSpinner.spin($showNodeTag.get(0));
            var data = {
                projId: AppConfig.projectId,
                groupId: node._id
            };
            if (isAll) {
                data.isAll = true;
            }
            WebAPI.post('tag/get_tags/ByGroups', data).done(function (result) {
                if (result.success) {
                    if (result.data && result.data.length) {
                        $showNodeTag.find('#allTags').empty().html(beopTmpl('tpl_show_allTags', {list: result.data}));
                        $showNodeTag.show();
                    }
                } else {
                    $showNodeTag.hide();
                }
            }).always(function () {
                newSpinner.stop();
            });
        },

        editConfirm: function () {
            var $editModal = $("#tag-markMode-edit");
            var equipmentList = $editModal.find('#equipmentFrom').serializeObject();
            _this.$dataTable.simpleDataTable('getSelectedRows').each(function (index, row) {
                var $row = $(row),
                    rowData = $row.data('value');
                var attrPObj = {};
                attrPObj['' + _this.TagName + ''] = equipmentList;
                var data = {
                    projId: AppConfig.projectId,
                    attrP: attrPObj,
                    Id: rowData._id,
                    inheritable: true
                };
                WebAPI.post('/tag/setTagAttrP', data).done(function (result) {
                    if (result.success) {
                        $editModal.modal('hide');
                        rowData.attrP['' + _this.TagName + ''] = equipmentList;
                    } else {
                        alert.danger(result.msg);
                    }
                });
            });
        },
        changeMarkState: function () {
            var $folderTable = $("#markMode-folder-table");

            switch (Number($(this).val())) {
                case beop.tag.constants.markState.ALL:
                    _this.$dataTable.simpleDataTable('delPostData', 'tags');
                    if ($('#allNodesFolder').hasClass('active')) {
                        _this.$dataTable.simpleDataTable('delPostData', 'hasTag');
                        _this.$dataTable.simpleDataTable('setPostData', 'isAll', true);
                        _this.$dataTable.simpleDataTable('refreshTable');
                    } else {
                        _this.loadTableView($folderTable);
                    }
                    break;
                case beop.tag.constants.markState.NOT_MARK:
                    _this.$dataTable.simpleDataTable('delPostData', 'tags');
                    _this.$dataTable.simpleDataTable('setPostData', 'hasTag', beop.tag.constants.markState.NOT_MARK);
                    _this.$dataTable.simpleDataTable('refreshTable');
                    break;
                case beop.tag.constants.markState.MARK:
                    _this.$dataTable.simpleDataTable('delPostData', 'tags');
                    _this.$dataTable.simpleDataTable('setPostData', 'hasTag', beop.tag.constants.markState.MARK);
                    _this.$dataTable.simpleDataTable('refreshTable');
                    break;
                case beop.tag.constants.markState.Unknown:
                    _this.$dataTable.simpleDataTable('setPostData', 'tags', ['Unknown']);
                    _this.$dataTable.simpleDataTable('refreshTable');
                    break;
                case beop.tag.constants.markState.Uncertain:
                    _this.$dataTable.simpleDataTable('setPostData', 'tags', ['Uncertain']);
                    _this.$dataTable.simpleDataTable('refreshTable');
                    break;
            }
        },
        deleteTag: function () {
            var $tr = $(this).closest('tr'), row = $tr.data('value');
            var $tagItemBox = $(this).closest('.tag-item-box'),
                deleteTagName = $tagItemBox.attr('title');
            var $selectedRows = _this.$dataTable.simpleDataTable('getSelectedRows');
            var selectedPointIds = [];
            $selectedRows.each(function (index, row) {
                var rowData = $(row).data('value');
                if (rowData && rowData._id) {
                    selectedPointIds.push(rowData._id);
                }
            });

            if (!$selectedRows.length) {
                selectedPointIds.push(row._id);
            } else {
                if ($.inArray(row._id, selectedPointIds) < 0) {
                    selectedPointIds = [];
                    selectedPointIds.push(row._id);
                }
            }

            WebAPI.post('/tag/delTag', {
                projId: AppConfig.projectId,
                Ids: selectedPointIds,
                tag: deleteTagName.trim()
            }).done(function (result) {
                if (result.success) {
                    if (!$selectedRows.length) {
                        _this.deleteSingleTag($tr, row, deleteTagName, $tagItemBox);
                    } else {
                        if (selectedPointIds.length == 1 || $.inArray(row._id, selectedPointIds) < 0) {
                            _this.deleteSingleTag($tr, row, deleteTagName, $tagItemBox);
                        } else {
                            $selectedRows.each(function (index, row) {
                                var $row = $(row), rowData = $row.data('value');
                                for (var i = 0; i < rowData.tag.length; i++) {
                                    if (rowData.tag[i].trim() == deleteTagName.trim()) {
                                        rowData.tag.splice(i, 1);
                                    }
                                }
                                var tags = rowData.tag.filter(function (item) {
                                    return !!item;
                                });
                                var equipment = beop.model.dmModel.hasEquipment(tags);

                                $row.data('value', rowData);
                                $row.find('td:last').html(beopTmpl('tpl_tag_row', {
                                    tags: rowData.tag.filter(function (item) {
                                        return !!item;
                                    }),
                                    editable: rowData.type == 'group',
                                    canDelete: true,
                                    editTagAttr: editTagAttr
                                }));
                                $tagItemBox.remove();
                                _this.changeIco(rowData, equipment, $row);
                                if (rowData.type == 'group') {
                                    _this.changeTreeIconDel(rowData);
                                }
                            })
                        }
                    }

                }
            });
        },
        changeIco: function (rowData, equipment, $row) {
            if (rowData.type === 'group') {
                var icon = 'glyphicon glyphicon-folder-close';
                // 获取设备图标
                var tagIconsMap = beop.model.dmModel.getTagIcons();
                if (equipment) {
                    if (tagIconsMap[equipment.name.toLowerCase()]) {
                        icon = 'icon iconfont tagEquipmentIcon ' + tagIconsMap[equipment.name.toLowerCase()];
                    }
                }
                rowData.icon = icon;
                $row.find('td:first').html(beopTmpl('tpl_folder_cell', rowData));
            }
        },

        deleteSingleTag: function ($tr, row, deleteTagName, $tagItemBox) {
            for (var i = 0; i < row.tag.length; i++) {
                if (row.tag[i].trim() == deleteTagName.trim()) {
                    row.tag.splice(i, 1);
                }
            }
            var tags = row.tag.filter(function (item) {
                return !!item;
            });
            var equipment = beop.model.dmModel.hasEquipment(tags);
            $tr.data('value', row);
            $tr.find('td:last').html(beopTmpl('tpl_tag_row', {
                tags: row.tag.filter(function (item) {
                    return !!item;
                }),
                editable: row.type == 'group',
                canDelete: true,
                editTagAttr: editTagAttr
            }));
            $tagItemBox.remove();
            _this.changeIco(row, equipment, $tr);
            if (row.type == 'group') {
                _this.changeTreeIconDel(row);
            }
        },

        //删除过程中改变tree文件夹的图标;
        changeTreeIconDel: function (data) {
            var treeObj = $.fn.zTree.getZTreeObj("tagTreeUl");
            var nodes = treeObj.getNodesByParam("_id", data.prt, null)[0];
            var curChild, defaultIcon, equipment;
            if (nodes.zAsync) {
                for (var i = 0, len = nodes.children.length; i < len; i++) {
                    curChild = nodes.children[i];
                    if (curChild._id == data._id) {
                        equipment = beop.model.dmModel.hasEquipment(data.tag);
                        var tagIconsMap = beop.model.dmModel.getTagIcons();
                        if (equipment) {
                            if (tagIconsMap[equipment.name.toLowerCase()]) {
                                curChild.iconSkin = 'button icon iconfont ' + tagIconsMap[equipment.name.toLowerCase()];
                            } else {
                                delete curChild['iconSkin'];
                                defaultIcon = 'button ' + ('ico_' + (curChild.open ? 'open' : 'close'));
                                $('#' + curChild.tId + '_ico').removeClass().addClass(defaultIcon);
                                continue;
                            }
                        } else {
                            delete curChild['iconSkin'];
                            defaultIcon = 'button ' + ('ico_' + (curChild.open ? 'open' : 'close'));
                            $('#' + curChild.tId + '_ico').removeClass().addClass(defaultIcon);
                            continue;
                        }
                        $('#' + curChild.tId + '_ico').removeClass().addClass(curChild.iconSkin);
                    }
                }
            }
        },

        //上一级目录
        upperLevelDirectory: function (parID) {
            var tree = $.fn.zTree.getZTreeObj("tagTreeUl");
            var treeNodes = tree.getSelectedNodes();
            if (treeNodes.length > 0) {
                tree.cancelSelectedNode();
            }
            if (_this.rootDirectoryPrt == _this.nodePrt) {
                WebAPI.post('/tag/getThingTree', {
                    projId: AppConfig.projectId,
                    isOnlyGroup: true
                }).done(function (result) {
                    if (result.success) {
                        _this.$dataTable.simpleDataTable('setData', result.data);
                    }
                })
            } else {
                $('#' + parID).find('>a').trigger('click');
            }
        },

        // 得到选择的 tree node id
        getSelectPId: function () {
            var prtId;
            if (_this.enterFirst || !beop.tag.tree.getSelectTreeNode().length) {
                _this.enterFirst = false;
                prtId = '';
            } else {
                prtId = beop.tag.tree.getSelectTreeNode()[0]._id;
            }
            return prtId;
        },

        // 模式 表格
        loadTableView: function ($table) {
            var tagIconsMap = beop.model.dmModel.getTagIcons();
            var dataTableOptions = {
                url: '/tag/thingTree/detail',
                post: WebAPI.post,
                postData: {
                    Prt: _this.getSelectPId(),
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
                        return result.data && result.data.detailList;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin($(".tag-list-box")[0]);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                onRowDbClick: function (tr, data, event, table) {
                    if (data.type !== 'group') {
                        return false;
                    }
                    table.settings.postData['Prt'] = data._id;
                    table.refreshTable();
                },
                rowIdKey: '_id',
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
                            if (row.type === 'group') {
                                var icon = 'glyphicon glyphicon-folder-close';
                                if (row.tag && row.tag.length) {
                                    row.tag = _this.advanceEquipment(row.tag);
                                }
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
                        converter: function (value, row) {
                            return value ? value : '';
                        }
                    },
                    {
                        index: 'tag', html: true,
                        converter: function (tags, row) {
                            if (!tags || !tags.length) {
                                return ''
                            }
                            return beopTmpl('tpl_tag_row', {
                                tags: tags.filter(function (item) {
                                    return !!item
                                }),
                                editable: row.type == 'group',
                                canDelete: true,
                                editTagAttr: editTagAttr
                            });
                        }
                    }
                ]
            };
            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }
            _this.$dataTable = $table.off().simpleDataTable(dataTableOptions);
        },

        folderState: function () {
            _this.$container.find('.tagCenterBox').empty().append(beopTmpl('tpl_tag_table_item'));
            $("#modeType-content").empty().append(beopTmpl('tpl_markMode_folder'));
        },
        _addTag: function (point, newTag) {
            if (!point) {
                return point;
            }
            if (!point.tag || !point.tag.length) {
                point.tag = [];
            }

            for (var i = 0; i < point.tag.length; i++) {
                if (point.tag[i] === newTag.name) {
                    return point;
                }
            }
            point.tag.push(newTag.name.trim());
            point.tagsChanged = true;
            return point;
        },

        //  标记模式下  点击编辑
        editContent: function ($this) {
            var name = $this.attr('data-name').toLowerCase();
            _this.TagName = name;
            WebAPI.get('/tag/equipmentInputs/' + name).done(function (result) {
                if (result.success && result.data.length) {
                    var equipmentData = [];
                    for (var i = 0; i < result.data.length; i++) {
                        var equipmentName = {
                            en: result.data[i].name.en,
                            zh: result.data[i].name.zh
                        };
                        equipmentData.push(equipmentName);
                    }
                    var $editModal = $("#tag-markMode-edit");
                    $editModal.modal();
                    $editModal.find('#modeEditContent').empty().append(beopTmpl('tpl_tag_modeEdit', {list: equipmentData}));
                    var row = _this.$dataTable.simpleDataTable('getSelectedData')[0];
                    var tagAttrP = row.attrP['' + name + ''];
                    if (tagAttrP) {
                        for (var key in tagAttrP) {
                            $('#equipmentFrom [name="' + key + '"]').val(tagAttrP[key]);
                        }
                    }
                    I18n.fillArea($editModal);
                } else {
                    alert.danger(result.msg);
                }
            });
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
    $.extend(DmTagMark.prototype, DmTagMarkFunc);
    return DmTagMark;
})();

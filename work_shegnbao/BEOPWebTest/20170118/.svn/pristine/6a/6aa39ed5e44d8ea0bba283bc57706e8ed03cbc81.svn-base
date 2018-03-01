var DmTagMark = (function () {
    var _this;

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
        this.pointShowId = [];      //要显示的tableID集合;
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
                            _this.$dataTable.simpleDataTable('getSelectedRows').each(function (index, row) {
                                var $row = $(row);
                                var rowData = $row.data('value');
                                _this._addTag(rowData, tag[0]);
                                $row.data('value', rowData);
                                var tags = rowData.tag.filter(function (item) {
                                    return !!item;
                                });
                                WebAPI.post('/tag/setTag', {
                                    projId: AppConfig.projectId,
                                    arrTag: [{
                                        Id: rowData._id, tags: tags.map(function (tag) {
                                            return tag ? tag.trim() : false;
                                        }).filter(function (item) {
                                            return !!item;
                                        }),
                                        type: rowData.type
                                    }]
                                }).done(function (result) {
                                    if (result.success) {
                                        var equipment = _this.hasEquipment(tags);
                                        $row.find('td:last').html(beopTmpl('tpl_tag_row', {
                                            tags: rowData.tag.filter(function (item) {
                                                return !!item;
                                            }),
                                            canDelete: true,
                                            editable: rowData.type == 'group' && !!equipment && equipment.name.toUpperCase() === 'chiller'.toUpperCase()
                                        }));
                                    }
                                });

                            })
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
                    cb_on_click: function (node) {
                        _this.pointShowId = [];
                        _this.$dataTable.simpleDataTable('setPostData', 'Prt', node._id);
                        _this.$dataTable.simpleDataTable('delPostData', 'tags');
                        _this.$dataTable.simpleDataTable('setSearch', 'searchText', '');
                        _this.rootDirectoryPrt = _this.nodePrt = node._id;
                        _this.pointShowId.push(_this.nodePrt);
                    },
                    itemShowList: ['edit'],
                    editable: false,
                    isOnlyGroup: false
                });
                beop.tag.tree.init($("#tagTreeBox"));
                _this.folderState();
                //折叠效果
                var side = new SidebarMenuEffect();
                side.init('#paneContent');

                _this.attachEvents();
            });
        },

        /***
         * 添加方法
         */
        hasEquipment: function (tags) {
            var equipments = beop.tag.panel.getTagsByType('Equipment');
            var equipmentsMap = {};
            for (var i = 0; i < equipments.length; i++) {
                var equipment = equipments[i];
                equipmentsMap[equipment.name] = equipment;
            }

            for (var j = 0; j < tags.length; j++) {
                var tag = tags[j];
                if (equipmentsMap[tag]) {
                    return equipmentsMap[tag];
                }
            }
        },

        // 绑定事件
        attachEvents: function () {
            var $editModal = $("#tag-markMode-edit");
            // 点击  标记模式   tag模式
            _this.$container.off('click.tag-mode').on('click.tag-mode', '#check-mode', function () {
                $(this).addClass('tabMode').siblings().removeClass('tabMode');
                $("#modeType-content").empty().append(beopTmpl('tpl_tag_mode_list'));
                _this.loadTableView($("#tagMode-table"));
                stateMap.mode = viewType.check;
                beop.tag.panel.configModel({
                    multiple: true
                });
                var $tagContent = _this.$container.find('#tagContent');
                $tagContent.find('.tag-item').removeClass('selectedColor');
            }).off('click.mark-mode').on('click.mark-mode', '#mark-mode', function () {
                $(this).addClass('tabMode').siblings().removeClass('tabMode');
                $("#modeType-content").empty().append(beopTmpl('tpl_markMode_folder'));
                _this.loadTableView($("#markMode-folder-table"));
                stateMap.mode = viewType.mark;
                beop.tag.panel.configModel({
                    multiple: false
                });
                var $tagContent = _this.$container.find('#tagContent');
                $tagContent.find('.tag-item').removeClass('selectedColor');
            }).on('click', '.editTag', function () {
                _this.editContent();
            }).off('click.all-select').on('click.all-select', '#all-select', function () {
                _this.$dataTable.simpleDataTable('selectAll');
            }).off('click.reverse-select').on('click.reverse-select', '#reverse-select', function () {
                _this.$dataTable.simpleDataTable('reverseSelect');
            }).off('click.last-stage').on('click.last-stage', '#last-stage', function () {
                _this.lastStage(_this.pointShowId);
            }).off('click.save-points').on('click.save-points', '#markMode-save', this.savePoints);

            _this.$container.off('click.remove-tag').on('click.remove-tag', '#remove-tag', this.deleteTag);
            $editModal.off('click.editConfirm').on('click.editConfirm', '#editConfirm', this.editConfirm);
        },
        // 取消事件
        detachEvents: function () {

        },

        editConfirm: function () {
            var $editModal = $("#tag-markMode-edit");
            var equipmentList = $editModal.find('#equipmentFrom').serializeObject();
            _this.$dataTable.simpleDataTable('getSelectedRows').each(function (index, row) {
                var $row = $(row),
                    rowData = $row.data('value');
                var data = {
                    projId: AppConfig.projectId,
                    attrP: equipmentList,
                    Id: rowData._id
                };
                WebAPI.post('/tag/setTagAttrP', data).done(function (result) {
                    if (result.success) {
                        $editModal.modal('hide');
                        rowData.attrP = equipmentList;
                    }
                });
            });
        },

        deleteTag: function () {
            var $tagItemBox = $(this).closest('.tag-item-box'),
                deleteTagName = $tagItemBox.attr('title');
            _this.$dataTable.simpleDataTable('getSelectedRows').each(function (index, row) {
                var $row = $(row),
                    rowData = $row.data('value');
                var tags = rowData.tag.filter(function (item) {
                    return !!item;
                });
                var equipment = _this.hasEquipment(tags);
                WebAPI.post('/tag/delTag', {
                    projId: AppConfig.projectId,
                    Ids: [rowData._id],
                    tag: deleteTagName.trim()
                }).done(function (result) {
                    if (result.success) {
                        for (var i = 0; i < rowData.tag.length; i++) {
                            if (rowData.tag[i].trim() == deleteTagName.trim()) {
                                rowData.tag.splice(i, 1);
                            }
                        }
                        $row.data('value', rowData);
                        $row.find('td:last').html(beopTmpl('tpl_tag_row', {
                            tags: rowData.tag.filter(function (item) {
                                return !!item;
                            }),
                            editable: row.type == 'group' && !!equipment && equipment.name.toUpperCase() === 'chiller'.toUpperCase(),
                            canDelete: true
                        }));
                    }
                });
            });
        },

        savePoints: function () {
            var currentPoints = _this.$dataTable.simpleDataTable('getAllData');
            var savePoint = currentPoints.filter(function (item) {
                return item.tagsChanged;
            });
            if (!savePoint && !savePoint.length) {
                alert.warn('请先进行标记');
            }
            Spinner.spin(ElScreenContainer);
            WebAPI.post('/tag/setTag', {
                projId: AppConfig.projectId,
                arrTag: savePoint.map(function (item) {
                    return {
                        Id: item._id, tags: item.tag.map(function (tag) {
                            return tag ? tag.trim() : false;
                        }).filter(function (item) {
                            return !!item;
                        }),
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

        //上一级事件
        lastStage: function (nodeIdArr) {
            var nodeId;
            nodeId = (nodeIdArr.length >= 1) ? nodeIdArr[nodeIdArr.length - 1] : '';
            _this.$dataTable.simpleDataTable('setPostData', 'Prt', nodeId);
            _this.$dataTable.simpleDataTable('refreshTable');
            if (nodeId === _this.rootDirectoryPrt) {
                $('#last-stage').parent().hide();
            }
            nodeIdArr.pop();
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
                    _this.nodePrt = data.prt;
                    _this.pointShowId.push(_this.nodePrt);
                    table.settings.postData['Prt'] = data._id;
                    table.refreshTable();
                    $('#last-stage').parent().show();
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
                            var equipment = _this.hasEquipment(tags);
                            return beopTmpl('tpl_tag_row', {
                                tags: tags.filter(function (item) {
                                    return !!item
                                }),
                                editable: row.type == 'group' && !!equipment && equipment.name.toUpperCase() === 'chiller'.toUpperCase(),
                                canDelete: true
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
            _this.loadTableView($("#markMode-folder-table"));
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
            point.tag.push(newTag.name);
            point.tagsChanged = true;
            return point;
        },

        //  标记模式下  点击编辑
        editContent: function () {
            var $editModal = $("#tag-markMode-edit");
            $editModal.modal();
            var row = _this.$dataTable.simpleDataTable('getSelectedData')[0];
            $editModal.find('#modeEditContent').empty().append(beopTmpl('tpl_tag_modeEdit'));

            if (row.attrP) {
                for (var key in row.attrP) {
                    $('#equipmentFrom [name="' + key + '"]').val(row.attrP[key]);
                }
            }
            I18n.fillArea($editModal);
        }
    };
    $.extend(DmTagMark.prototype, DmTagMarkFunc);
    return DmTagMark;
})();

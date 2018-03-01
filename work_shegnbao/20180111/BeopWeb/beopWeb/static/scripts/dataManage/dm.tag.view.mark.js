var DmTagMark = (function() {
    var _this;

    var PAGE_SIZE_STORAGE_KEY = 'dm.tag.edit.page.size';

    var viewType = {
        mark: 'mark', //标记模式用于给点或者目录打tag
        check: 'check', //tag模式用于检查Tag标记情况
        edit: 'edit' //编辑tag属性
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
        this.brushTags = []; //临时存放格式刷的tag;
        _this.TagName = null;
        this.allAttriTag = null;
        this.hasAttribNameList = null;
        this.parentPrtId = null;
        this.pointTotalId = [];
        this.beforeAttribTag = [];
        this.isClickBack = false;
    }

    DmTagMark.prototype = Object.create(PointManager.prototype);
    DmTagMark.prototype.constructor = DmTagMark;


    var DmTagMarkFunc = {
        show: function() {
            _this.init().done(function() {
                _this.$container = $("#tagContainer");
                _this.$container.html(beopTmpl('tpl_tag_view'));
                //初始为mark页面
                stateMap.mode = viewType.mark;

                beop.tag.panel.configModel({
                    cb_on_click: function (tag) {
                        if (stateMap.mode === viewType.mark) { //mark页面
                            var arrTagList = [];
                            _this.$dataTable.simpleDataTable('getSelectedRows').each(function(index, row) {
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
                            }).done(function(result) {
                                if (result.success) {
                                    _this.$dataTable.simpleDataTable('getSelectedRows').each(function(index, row) {
                                        var $row = $(row);
                                        var rowData = $row.data('value');
                                        if (rowData.tag && rowData.tag.length) {
                                            rowData.tag = _this.advanceEquipment(rowData.tag);
                                        }
                                        var equipment = beop.model.dmModel.hasEquipment(rowData.tag);
                                        $row.find('td:last').html(beopTmpl('tpl_tag_row', {
                                            tags: rowData.tag,
                                            canDelete: true,
                                            editTagAttr: beop.tag.panel.getAllTagAttr()
                                        }));
                                        _this.changeIco(rowData, equipment, $row);

                                        beop.tag.panel.showLatelyUseTag(tag[0].name);

                                    });
                                    var treeObj = $.fn.zTree.getZTreeObj("tagTreeUl");
                                    var nodes = treeObj.getNodesByParam('_id', arrTagList[0].prt, null)[0];
                                    var selectFolder = [],
                                        icon, equipment, defaultIcon;
                                    if (nodes && nodes.zAsync) {
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
                        } else if (stateMap.mode === viewType.check) { //检查页面
                            _this.$dataTable.simpleDataTable('setPostData', 'tags', tag.map(function(item) {
                                return item.name.trim();
                            }).filter(function(item) {
                                return !!item;
                            }));
                            _this.$dataTable.simpleDataTable('refreshTable');
                        }
                    }
                });
                beop.tag.panel.init($(".tag-right-box"));
                beop.tag.tree.configModel({
                    isLoadCache: false,
                    cb_on_click: function(node) {
                        var selectTagsType = Number($('#markState').val());
                        var $autoMatch = $('#autoMatch'),
                            $dragDirectory = $('#dragDirectory');
                        _this.isHasAttrib = false;
                        _this.parentPrtId = null;
                        //编辑属性页面: 储存 prt
                        _this.pointTotalId = [];
                        _this.beforeAttribTag = [];
                        // mark页面: 储存 prt
                        _this.markpartentTotalId = []; 

                        if (node == 'autoMatch') {
                            var selectNode = beop.tag.tree.getSelectTreeNode()[0];
                            var payload = {
                                'group': selectNode._id,
                                'projectId': AppConfig.projectId
                            };
                            
                            if (stateMap.mode == viewType.mark) {
                                var $tpl_loading_tag = $('#tpl_loading_tag');
                                infoBox.confirm(I18n.resource.tag.edit.IS_AUTOMATCH_POINT.format(selectNode.originName), function() {
                                    Spinner.spin($('.loadingBox').get(0));
                                    $tpl_loading_tag.modal('show');
                                    WebAPI.post('tag/pointAutoMatchV4', payload).done(function(result) {
                                        var $tpl_tag_autoMatch = $('#tpl_tag_autoMatch');
                                        if (result.success) {
                                            _this.loadTags(selectNode);
                                            _this.loadTableView($("#markMode-folder-table"));
                                            $tpl_tag_autoMatch.find('#TagAutoMatchContent').text(selectNode.originName + " " + I18n.resource.tag.edit.AUTOMATCH_SUCCESS);
                                        } else {
                                            $tpl_tag_autoMatch.find('#TagAutoMatchContent').html(I18n.resource.tag.edit.AUTOMATCH_ERROR);
                                        }
                                        $tpl_tag_autoMatch.modal();
                                        I18n.fillArea($tpl_tag_autoMatch);
                                    }).always(function() {
                                        $tpl_loading_tag.modal('hide');
                                        Spinner.stop();
                                    });
                                    I18n.fillArea($tpl_loading_tag);
                                });
                            }
                        } else if (node == 'showAll') {
                            $autoMatch.prop('disabled', true);
                            $dragDirectory.prop('disabled', true);
                            if (stateMap.mode == viewType.edit) {
                                _this.getEditTags();
                            } else { 
                                _this.$dataTable.simpleDataTable('setPostData', 'Prt', '');
                                _this.$dataTable.simpleDataTable('setPostData', 'isAll', true);
                                if (stateMap.mode == viewType.mark) {
                                    if (selectTagsType !== beop.tag.constants.markState.Unknown && selectTagsType !== beop.tag.constants.markState.Uncertain) {
                                        _this.$dataTable.simpleDataTable('delPostData', 'tags');
                                    }
                                    var data = {
                                        _id: ''
                                    };
                                    _this.loadTags(data, true);
                                } 
                                _this.$dataTable.simpleDataTable('setSearch', 'searchText', '');
                            }
                            
                        } else {
                            _this.nodePrt = '';
                            _this.parentTId = null;
                            _this.treeNode = node;
                            _this.nodePrt = node.prt;
                            _this.parentTId = node.parentTId;
                            if (typeof(_this.$dataTable) == "undefined") {
                                _this.loadTableView($("#markMode-folder-table"));
                                _this.loadTags(node);
                                if (stateMap.mode == viewType.edit) {
                                    _this.getEditTags();
                                }
                            } else {
                                $autoMatch.prop('disabled', false);
                                if (stateMap.mode == viewType.edit) {
                                    _this.getEditTags();
                                } else {
                                    _this.$dataTable.simpleDataTable('setPostData', 'Prt', node._id);
                                    _this.$dataTable.simpleDataTable('delPostData', 'isAll');
                                    if (stateMap.mode == viewType.mark) {
                                        if (selectTagsType !== beop.tag.constants.markState.Unknown && selectTagsType !== beop.tag.constants.markState.Uncertain) {
                                            _this.$dataTable.simpleDataTable('delPostData', 'tags');
                                        }
                                        _this.loadTags(node);
                                    }
                                    _this.$dataTable.simpleDataTable('setSearch', 'searchText', '');
                                }
                                
                            }
                            $dragDirectory.prop('disabled', false);
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
        attachEvents: function() {
            var $editModal = $("#tag-markMode-edit");
            // 点击  标记模式   tag模式
            _this.$container.off('click.tag-mode').on('click.tag-mode', '#check-mode', function() {
                $(this).closest('.tagModeStyle').addClass('tabMode').siblings().removeClass('tabMode');
                $("#modeType-content").empty().append(beopTmpl('tpl_tag_mode_list'));
                _this.loadTableView($("#tagMode-table"));
                stateMap.mode = viewType.check;
                beop.tag.panel.configModel({
                    multiple: true
                });
                $('#tagContent').find('.tag-item').removeClass('selectedColor');
            }).off('click.mark-mode').on('click.mark-mode', '#mark-mode', function () {
                _this.markpartentTotalId = [];
                $(this).closest('.tagModeStyle').addClass('tabMode').siblings().removeClass('tabMode');
                $("#modeType-content").empty().append(beopTmpl('tpl_markMode_folder'));
                var $allNodesFolder = $('#allNodesFolder');
                if ($allNodesFolder.hasClass('active')) {
                    var data = {
                        _id: ''
                    };
                    _this.loadTags(data, true);
                } else {
                    _this.loadTags(beop.tag.tree.getSelectTreeNode()[0]); 
                }
               
                _this.loadTableView($("#markMode-folder-table"));
                stateMap.mode = viewType.mark;
                beop.tag.panel.configModel({
                    multiple: false
                });
                $('#tagContent').find('.tag-item').removeClass('selectedColor');
            }).on('click', '.editTag', function() {
                _this.editContent($(this));
            }).off('click.all-select').on('click.all-select', '#all-select', function() {
                _this.$dataTable.simpleDataTable('selectAll');
                _this.uncheckBrush();
            }).off('click.reverse-select').on('click.reverse-select', '#reverse-select', function() {
                _this.$dataTable.simpleDataTable('reverseSelect');
                _this.uncheckBrush();
            }).off('click.point-format-brush').on('click.point-format-brush', '#point-format-brush', function() {
                _this.pointFormatBrush();
            }).off('click.sure-format-brush').on('click.sure-format-brush', '#sure-format-brush', function() {
                _this.sureBrush(_this.brushTags);
            }).off('click.parent-directory').on('click.parent-directory', '#parent-directory', function() {
                if ($('#allNodesFolder').hasClass('active')) { 
                    return;
                }
                _this.upperLevelDirectory(_this.parentTId);
            }).off('click.markMode-return').on('click.markMode-return', '#markMode-return', function() {
                _this.$dataTable.simpleDataTable('setPostData', 'Prt', node._id);
                _this.$dataTable.simpleDataTable('refreshTable');
            }).off('click.joinCurve').on('click.joinCurve', '#joinCurve', function() {
                _this.joinCurve();
            });

            _this.$container.off('click.removeTag').on('click.removeTag', '.removeTag', this.deleteTag);
            $editModal.off('click.editConfirm').on('click.editConfirm', '#editConfirm', this.editConfirm);
            _this.$container.off('change.changeMarkState').on('change.changeMarkState', '#markState', this.changeMarkState);
            _this.$container.off('click.edit-mode').on('click.edit-mode', '#edit-mode', function() {
                var $this = $(this);
                $this.closest('.tagModeStyle').addClass('tabMode').siblings().removeClass('tabMode');
                stateMap.mode = viewType.edit;
                _this.getEditTags();
            });

            _this.$container.off('change.selectTagAttribute').on('change.selectTagAttribute', '#selectTagAttribute', function() {
                _this.loadingAttributeTable($("#tagEdit-table"));
            });

            _this.$container.off('click.upper_level').on('click.upper_level', '#upper_level', function () {
                if ($('#allNodesFolder').hasClass('active')) {
                    return;
                }
                var selectNode = beop.tag.tree.getSelectTreeNode()[0],
                    selectId = selectNode._id;
                var $allTr = _this.$editDataTable.simpleDataTable('getAllRows');
                var parentPrtId = $($allTr[0]).attr('prt');
                var iLen = _this.pointTotalId.length;
                if (parentPrtId == selectId) {
                    _this.parentPrtId = null;
                    return;
                }
                _this.isClickBack = true;
                _this.parentPrtId = _this.pointTotalId[(iLen - 1)];
                iLen && _this.pointTotalId.pop();
                _this.getEditTags();
            });

            _this.$container.off('click.ordinal_number').on('click.ordinal_number', '#ordinal_number', function() {
                var $this = $(this);
                if ($this.hasClass('active')) {
                    var $allTr = _this.$editDataTable.simpleDataTable('getAllRows');
                    var $lastTd = $('#tagEdit-table td.dottedLine')[1];
                    var colCellIndex = $lastTd.cellIndex;
                    var $lastTrId = $lastTd.closest('tr').id;
                    var lastTrRow;
                    for (var i = 0; i < $allTr.length; i++) {
                        if ($allTr[i].id == $lastTrId) {
                            lastTrRow = i + 1;
                            break;
                        }
                    }
                    var afterNum = _this.afterLastNum;
                    var zeroIndex = _this.afterLastNum.lastIndexOf('0');
                    for (var j = lastTrRow; j < $allTr.length; j++) {

                        if (_this.firstNumILen == _this.lastNumILen) {
                            if (zeroIndex == -1) {
                                afterNum = Number(afterNum) + 1;
                                changeInputContent(j, colCellIndex, _this.beforeString + afterNum);
                            } else {
                                afterNum = Number(afterNum) + 1;
                                var zeroString = '';
                                if (afterNum.toString().length < _this.lastNumILen) {
                                    var differenceILen = _this.lastNumILen - afterNum.toString().length;
                                    for (var k = 0; k < differenceILen; k++) {
                                        zeroString += '0';
                                    }
                                    afterNum = zeroString + afterNum;
                                    changeInputContent(j, colCellIndex, _this.beforeString + afterNum);
                                } else {
                                    /* if (afterNum.toString().length > _this.lastNumILen) {
                                     $allTr.eq(j).find('td').eq(colCellIndex).find('input').val('');
                                     return;
                                     } */
                                    changeInputContent(j, colCellIndex, _this.beforeString + afterNum);
                                }
                            }
                        } else if (_this.firstNumILen + 1 == _this.lastNumILen) {
                            if (zeroIndex && zeroIndex + 1 != _this.firstNumILen) {
                                afterNum = Number(afterNum) + 1;
                                changeInputContent(j, colCellIndex, _this.beforeString + afterNum);
                            }
                        }
                    }

                    function changeInputContent(j, colCellIndex, number) {
                        $allTr.eq(j).find('td').eq(colCellIndex).find('input').val(number);
                        $allTr.eq(j).find('td').eq(colCellIndex).find('input').attr('value', number);
                    }

                    //保存修改内容;
                    _this.saveChangeTagAttribute();
                }

            });


            _this.$container.off('click.tagEdit-table').on('click.tagEdit-table', '#tagEdit-table input', function(e) {
                var $this = $(this);
                var $td = $this.closest('td');
                var $tdHasSubClass = $('#tagEdit-table td.subClass');
                var $ordinal_number = $('#ordinal_number');
                // 删除 多行选择
                if (e.ctrlKey) {
                    if ($td.hasClass('subClass')) {
                        $td.removeClass('subClass');
                        return;
                    }
                    $td.addClass('subClass');
                    //$this.closest('tr').removeClass('active');
                } else {
                    $tdHasSubClass.removeClass('subClass');
                }

                // 可补充 编号 及 复制:
                var colEndIndex, rowEndIndex;
                var $tdHasDottedLine = $('#tagEdit-table td.dottedLine');
                if (e.shiftKey) {
                    var $allTr = _this.$editDataTable.simpleDataTable('getAllRows');
                    var $tr = $this.closest('tr');
                    if ($td.hasClass('dottedLine')) {
                        if ($tdHasDottedLine.length > 2) {
                            $tdHasDottedLine.removeClass('dottedLine');
                            $td.addClass('dottedLine');
                            _this.copyMoreVal = false;
                            _this.getStartRowColIndex($tr, $allTr);
                            return;
                        }
                        $td.removeClass('dottedLine');
                        //改变初始位置;
                        var $tdNewHasDottedLine = $('#tagEdit-table td.dottedLine');
                        if ($tdNewHasDottedLine.length) {
                            $tr = $tdNewHasDottedLine.closest('tr');
                            _this.getStartRowColIndex($tr, $allTr);
                            $ordinal_number.removeClass('active');
                        }
                        _this.copyMoreVal = false;
                        return;
                    }

                    if (!$tdHasDottedLine.length) {
                        $td.addClass('dottedLine');
                        _this.copyMoreVal = false;
                        _this.getStartRowColIndex($tr, $allTr);
                    }


                    if ($tdHasDottedLine.length == 1) {
                        _this.rowIlen = null;
                        _this.colIlen = null;
                        _this.allCopyValArr = [];
                        _this.inputVal = [];
                        _this.inputVal.push($tdHasDottedLine.find('input').val());
                        $td.addClass('dottedLine');
                        var $tdDottedLine = $tr.find('td.dottedLine');
                        for (var i = 0; i < $allTr.length; i++) {
                            if ($allTr[i].id == $tr[0].id) {
                                rowEndIndex = i + 1;
                                break;
                            }
                        }
                        if ($tdDottedLine.length == 1) {
                            colEndIndex = $tdDottedLine[0].cellIndex + 1;
                        } else {
                            colEndIndex = $tdDottedLine[1].cellIndex + 1;
                        }

                        _this.rowIlen = Math.abs(rowEndIndex - _this.rowStartIndex);
                        _this.colIlen = Math.abs(colEndIndex - _this.colStartIndex);
                        // 补充序号;
                        if (colEndIndex == _this.colStartIndex) {
                            if (_this.rowIlen == 1) {
                                if (rowEndIndex - _this.rowStartIndex < 0) {
                                    _this.inputVal.unshift($this.val());
                                } else {
                                    _this.inputVal.push($this.val());
                                }

                                var replaceNum = 'NUMBER_';
                                var firstString = _this.inputVal[0];
                                var lastString = _this.inputVal[1];
                                var subFirstString = firstString;
                                //var subLastString = lastString;

                                var newFirstString = subFirstString.replace(/[0-9]+$/, replaceNum);

                                // 分解字符串;
                                var firstIndex, beforeFirstString, beforeLastString, afterFirstNum, afterLastNum;
                                firstIndex = newFirstString.lastIndexOf(replaceNum);

                                beforeFirstString = firstString.slice(0, firstIndex);
                                afterFirstNum = firstString.slice(firstIndex);
                                beforeLastString = lastString.slice(0, firstIndex);
                                afterLastNum = lastString.slice(firstIndex);
                                var firstNumILen = afterFirstNum.length;
                                var lastNumILen = afterLastNum.length;

                                // 是否 符合 可刷序号
                                if (afterFirstNum && afterLastNum && beforeFirstString == beforeLastString && (afterLastNum - afterFirstNum == 1)) {

                                    if (firstNumILen == lastNumILen) {
                                        _this.judgeDoNumber(beforeLastString, afterFirstNum, afterLastNum, firstNumILen, lastNumILen, $ordinal_number);
                                    } else if (firstNumILen + 1 == lastNumILen) {
                                        var zeroIndex = afterLastNum.lastIndexOf('0');
                                        if (zeroIndex + 1 != firstNumILen) {
                                            _this.judgeDoNumber(beforeLastString, afterFirstNum, afterLastNum, firstNumILen, lastNumILen, $ordinal_number);
                                        } else {
                                            _this.judgeNotDoNumber($ordinal_number);
                                        }
                                    } else {
                                        _this.judgeNotDoNumber($ordinal_number);
                                    }
                                } else {
                                    _this.judgeNotDoNumber($ordinal_number);

                                }
                            }
                        }
                        //复制内容;
                        var minRowVal = Math.min(rowEndIndex, _this.rowStartIndex),
                            minColVal = Math.min(colEndIndex, _this.colStartIndex);
                        for (var i = minRowVal; i <= minRowVal + _this.rowIlen; i++) {
                            var $allTd = $allTr.eq(i - 1).find('td');
                            _this.allCopyValArr[i - 1] = [];
                            for (var j = minColVal; j <= minColVal + _this.colIlen; j++) {
                                var tdItem = $allTd.eq(j - 1);
                                if (!tdItem.hasClass('dottedLine')) {
                                    tdItem.addClass('dottedLine');
                                }
                                _this.allCopyValArr[i - 1][j - 1] = tdItem.find('input').val();
                            }
                        }
                    }

                    if ($tdHasDottedLine.length > 1) {
                        $tdHasDottedLine.removeClass('dottedLine');
                        $td.addClass('dottedLine');
                        _this.copyMoreVal = false;
                        _this.getStartRowColIndex($tr, $allTr);
                        $ordinal_number.removeClass('active');
                    }
                }
                e.stopPropagation();
            });

            _this.$container.off('input.input').on('input.input', '#tagEdit-table .table input', function(e) {
                var $this = $(this);
                var oldValue = $this.attr('value');
                var newValue = $this.val();
                var $tdHasDottedLine = $('#tagEdit-table td.dottedLine');
                var $ordinal_number = $('#ordinal_number');
                if (oldValue !== newValue) {
                    $this.attr('value', newValue);
                    if ($tdHasDottedLine.length) {
                        $tdHasDottedLine.removeClass('dottedLine');
                    }
                    if ($ordinal_number.hasClass('active')) {
                        $ordinal_number.removeClass('active');
                    }
                }
            });


            _this.$container.off('keydown.tagEdit-table').on('keydown.tagEdit-table', '#tagEdit-table .table input', function(e) {
                var $tdHasSubClass = $('#tagEdit-table td.subClass');
                var allTdDottedLine = $('#tagEdit-table td.dottedLine');
                // backspace 键
                if (e.keyCode == 8) {
                    var $input = $('#tagEdit-table td.subClass input');
                    var $ordinal_number = $('#ordinal_number');
                    $input.val('');
                    $input.attr('value', '');
                    $tdHasSubClass.removeClass('subClass');
                    allTdDottedLine.removeClass('dottedLine');
                    if ($ordinal_number.hasClass('active')) {
                        $ordinal_number.removeClass('active');
                    }
                } else if (!e.ctrlKey) {
                    $tdHasSubClass.removeClass('subClass');
                }
                // ctrl + c
                if (e.ctrlKey && e.keyCode == 67) {
                    $tdHasSubClass.removeClass('subClass');
                    if (allTdDottedLine.length < 2) {
                        _this.copyMoreVal = false;
                    } else {
                        _this.copyMoreVal = true;
                    }
                }
                // ctrl + v
                if (e.ctrlKey && e.keyCode == 86) {
                    $tdHasSubClass.removeClass('subClass');
                    if (_this.copyMoreVal && _this.allCopyValArr) {
                        var $allTr = _this.$editDataTable.simpleDataTable('getAllRows');
                        var $td = $(e.target).closest('td');
                        var $tr = $(e.target).closest('tr');
                        var tdRowIndex, tdColIndex;
                        var allRowILen = $allTr.length;
                        var allColILen = $tr.find('td').length;

                        for (var i = 0; i < $allTr.length; i++) {
                            if ($allTr[i].id == $tr[0].id) {
                                tdRowIndex = i + 1;
                            }
                        }
                        tdColIndex = $td[0].cellIndex + 1;
                        // 获取选中的第一个位置;
                        var firstTdRowIndex, firstTdColIndex;
                        var firstTdDottedLine = allTdDottedLine[0];

                        var $firstTrId = allTdDottedLine.closest("tr")[0].id;
                        for (var i = 0; i < $allTr.length; i++) {
                            if ($allTr[i].id == $firstTrId) {
                                firstTdRowIndex = i + 1;
                            }
                        }
                        firstTdColIndex = firstTdDottedLine.cellIndex + 1;
                        var colDifference = tdColIndex - firstTdColIndex;
                        var rowDifference = tdRowIndex - firstTdRowIndex;

                        if ((allRowILen - tdRowIndex >= _this.rowIlen) && (allColILen - tdColIndex >= _this.colIlen)) {
                            for (var i = tdRowIndex; i <= tdRowIndex + _this.rowIlen; i++) {
                                var $allTd = $allTr.eq(i - 1).find('td');
                                for (var j = tdColIndex; j <= tdColIndex + _this.colIlen; j++) {
                                    var tdItem = $allTd.eq(j - 1);
                                    tdItem.find('input').val(_this.allCopyValArr[i - 1 - rowDifference][j - 1 - colDifference]);
                                    tdItem.find('input').attr('value', _this.allCopyValArr[i - 1 - rowDifference][j - 1 - colDifference]);
                                }
                            }
                        }
                        e.preventDefault();
                    }
                }

            });

            _this.$container.off('blur.tagEdit-table').on('blur.tagEdit-table', '#tagEdit-table input', function() {
                _this.saveChangeTagAttribute();
            });

            _this.$container.off('change.pageSize').on('change.pageSize', '.table-footer .pageSizeSelect', function () {
                localStorage.setItem(PAGE_SIZE_STORAGE_KEY, parseInt($(this).val()));
            });
            _this.$container.off('click.deleteTag').on('click.deleteTag', '#allTags .deleteTag', function() {
                var $this = $(this);
                
                var $tagValue = $this.closest('.tagValue');
                var deleteTagName = $tagValue.attr('data-value');
                var $tagContainer = $this.closest('.tagAttrBox');                                
                var tags = [];
                tags.push(deleteTagName);
                var selectNode = beop.tag.tree.getSelectTreeNode()[0];
                var data = {
                    projId: AppConfig.projectId,
                    groupId: selectNode._id,
                    tags: tags
                };
                WebAPI.post('tag/del_tags/ByGroups', data).done(function(result) {
                    if (result.success) {
                        $tagValue.remove();
                        var $allTagsDom = $tagContainer.find('.tagValue');
                        if (!$allTagsDom.length) $tagContainer.remove();

                        var $showNodeTag = $('#showNodeTag');
                        var allTags = $showNodeTag.find('.tagValue');
                        if (!allTags.length) $showNodeTag.remove();
                        
                        _this.$dataTable.simpleDataTable('refreshTable');
                    } else {
                        alert.danger(result.msg);
                    }
                });
            });

            _this.$container.off('click.showAllTagsBtn').on('click.showAllTagsBtn', '.showAllTagsBtn', function() {
                var $hideBox = $(this).closest('.allTagsClose').hide();
                $hideBox.siblings('.allTagsOpen').show();
            }).off('click.hideAllTagsBtn').on('click.hideAllTagsBtn', '.hideAllTagsBtn', function() {
                var $hideBox = $(this).closest('.allTagsOpen').hide();
                $hideBox.siblings('.allTagsClose').show();
            })
        },
        // 取消事件
        detachEvents: function() {

        },

        loadTags: function (node, isAll) {
            var $showNodeTag = $('#showNodeTag');
            $showNodeTag.show();
            var newSpinner = new LoadingSpinner({ color: '#00FFFF' });
            newSpinner.spin($showNodeTag.get(0));
            var data = {
                projId: AppConfig.projectId,
                groupId: node._id
            };
            if (isAll) {
                data.isAll = true;
            }
            WebAPI.post('tag/get_tags/ByGroups', data).done(function(result) {
                if (result.success) {
                    if (result.data && result.data.length) {
                        var rs = result.data;
                        var renderData = [];
                        var allTagGroup = beop.tag.panel.allTagMsgArr();
                        for (var i = 0; i < allTagGroup.length; i++) {
                            var groupNm = allTagGroup[i].groupNm;
                            var hasTagflag = false;
                            renderData.push({
                                groupNm: groupNm,
                                tagGroup: new Array()
                            })
                            var curGroupTags = allTagGroup[i].tags;
                            for (var k = 0; k < curGroupTags.length; k++) {
                                var curTagName = curGroupTags[k].name;
                                for (var j = 0; j < rs.length; j++) {
                                    if (curTagName == rs[j]) {
                                        hasTagflag = true;
                                        renderData[renderData.length - 1].tagGroup.push(curTagName);
                                    }
                                }
                            }
                            if (!hasTagflag) renderData.pop();
                        }

                        $showNodeTag.find('#allTags').empty().html(beopTmpl('tpl_show_allTags', { list: renderData }));
                        I18n.fillArea($showNodeTag);
                        $showNodeTag.show();
                    }
                } else {
                    $showNodeTag.hide();
                }
            }).always(function() {
                newSpinner.stop();
            });
        },

        editConfirm: function() {
            var $editModal = $("#tag-markMode-edit");
            var equipmentList = $editModal.find('#equipmentFrom').serializeObject();
            _this.$dataTable.simpleDataTable('getSelectedRows').each(function(index, row) {
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
                Spinner.spin($('#modeType-content').get(0));
                WebAPI.post('/tag/setTagAttrP', data).done(function(result) {
                    if (result.success) {
                        $editModal.modal('hide');
                        rowData.attrP['' + _this.TagName + ''] = equipmentList;
                    } else {
                        alert.danger(result.msg);
                    }
                }).always(function() {
                    Spinner.stop();
                });
            });
        },
        changeMarkState: function() {
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
        deleteTag: function() {
            var $tr = $(this).closest('tr'),
                row = $tr.data('value');
            var $tagItemBox = $(this).closest('.tag-item-box'),
                deleteTagName = $tagItemBox.attr('title');
            var $selectedRows = _this.$dataTable.simpleDataTable('getSelectedRows');
            var selectedPointIds = [];
            $selectedRows.each(function(index, row) {
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
                tag: deleteTagName.trim(),
                inheritable: true
            }).done(function(result) {
                if (result.success) {
                    if (!$selectedRows.length) {
                        _this.deleteSingleTag($tr, row, deleteTagName, $tagItemBox);
                    } else {
                        if (selectedPointIds.length == 1 || $.inArray(row._id, selectedPointIds) < 0) {
                            _this.deleteSingleTag($tr, row, deleteTagName, $tagItemBox);
                        } else {
                            $selectedRows.each(function(index, row) {
                                var $row = $(row),
                                    rowData = $row.data('value');
                                for (var i = 0; i < rowData.tag.length; i++) {
                                    if (rowData.tag[i].trim() == deleteTagName.trim()) {
                                        rowData.tag.splice(i, 1);
                                    }
                                }
                                var tags = rowData.tag.filter(function(item) {
                                    return !!item;
                                });
                                var equipment = beop.model.dmModel.hasEquipment(tags);

                                $row.data('value', rowData);
                                $row.find('td:last').html(beopTmpl('tpl_tag_row', {
                                    tags: rowData.tag.filter(function(item) {
                                        return !!item;
                                    }),
                                    canDelete: true,
                                    editTagAttr: beop.tag.panel.getAllTagAttr()
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
        changeIco: function(rowData, equipment, $row) {
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

        deleteSingleTag: function($tr, row, deleteTagName, $tagItemBox) {
            for (var i = 0; i < row.tag.length; i++) {
                if (row.tag[i].trim() == deleteTagName.trim()) {
                    row.tag.splice(i, 1);
                }
            }
            var tags = row.tag.filter(function(item) {
                return !!item;
            });
            var equipment = beop.model.dmModel.hasEquipment(tags);
            $tr.data('value', row);
            $tr.find('td:last').html(beopTmpl('tpl_tag_row', {
                tags: row.tag.filter(function(item) {
                    return !!item;
                }),
                canDelete: true,
                editTagAttr: beop.tag.panel.getAllTagAttr()
            }));
            $tagItemBox.remove();
            _this.changeIco(row, equipment, $tr);
            if (row.type == 'group') {
                _this.changeTreeIconDel(row);
            }
        },

        //删除过程中改变tree文件夹的图标;
        changeTreeIconDel: function(data) {
            var treeObj = $.fn.zTree.getZTreeObj("tagTreeUl");
            var nodes = treeObj.getNodesByParam("_id", data.prt, null)[0];
            var curChild, defaultIcon, equipment;
            if (nodes && nodes.zAsync) {
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
        serverRequestError:function(mes){
            alert(I18n.resource.debugTools.sitePoint.SERVER_REQUEST_FAILED);
            Spinner.stop();
        },
        //判断字符串是否可以转变成json格式
        tryParseJSON :function(jsonString) {
            try {
                var o = JSON.parse(jsonString);
                if (o && typeof o === "object") {
                    return o;
                }
            } catch (e) {}
            return false;
        },

        joinCurve:function(){ //现在无法判断是什么点
            var point_list = [],
            date_start,
            data_end,
            format,
            structure_list = {},
            showHistoryTable,
            pointMap = {},
            selectedPoints = [];
            var  selectNodes = _this.$dataTable.simpleDataTable('getSelectedData');
            selectNodes.forEach(function(item){
                if(item.type == 'thing'){
                    selectedPoints.push(item);
                }
            })
            
            if (!selectedPoints.length) {
                alert(I18n.resource.tag.inspect.SELECT_ONE_POINT);
                return;
            } else if (selectedPoints.length > 10) {
                alert(I18n.resource.dataManage.UP_TO_TEN_RECORDS);
                return;
            } else {
                var valueType = function(name, pointValue) {
                    var structure = _this.tryParseJSON(pointValue);
                    if (structure) {
                        var attrList = [];
                        for (var attr in structure) {
                            if (structure.hasOwnProperty(attr)) {
                                attrList.push(attr);
                            }
                        }
                        structure_list[name] = attrList;
                    }
                };
                //只选中一条且点值为字符串时.显示表格;
                if (selectedPoints.length == 1) {
                    showHistoryTable = selectedPoints[0].value && isNaN(selectedPoints[0].value) && selectedPoints[0].value != 'None';
                }
                selectedPoints.forEach(function(item) {
                    
                    // if (stateMap.pointType == configMap.cloudPointType.MAPPING_POINT) {
                    //     if (item.params.mapping && item.params.mapping.point) {
                    //         point_list.push(item.params.mapping.point);
                    //         valueType(item.params.mapping.point, item.pointValue);
                    //         pointMap[item.params.mapping.point] = item.value;
                    //     }
                    // } else {
                    //     point_list.push(item.value);
                    //     valueType(item.value, item.pointValue);
                    // }
                    point_list.push(item.name);
                    valueType(item.name, item.value);
                });
            }

            Spinner.spin(ElScreenContainer);

            if (localStorage.getItem('dataManagerStartDate')) {
                date_start = new Date(localStorage.getItem('dataManagerStartDate')).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE);
                data_end = new Date(localStorage.getItem('dataManagerEndDate')).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE);
                format = localStorage.getItem('dataManagerFormat') ? localStorage.getItem('dataManagerFormat') : 'm5';
            } else {
                date_start = new Date(new Date() - 24 * 60 * 60 * 1000).format("yyyy-MM-dd HH:mm:00");
                data_end = new Date().format("yyyy-MM-dd HH:mm:00");
                format = 'm5';
            }

            var getHistoryDataReduce = function(hidePointList) {
                hidePointList = hidePointList ? hidePointList : [];
                var obj = {
                    startDate: date_start,
                    endDate: data_end,
                    format: format,
                    hidePointList: hidePointList,
                    pointList: point_list,
                    projectId: AppConfig.projectId,
                    isShowRepairData: true,
                    isShowTable: showHistoryTable,
                    structure_list: structure_list,
                    pointMap: pointMap
                };
                new HistoryChart(obj).show();
            };

            if (point_list.length == 1) {
                $.ajax({
                    url: "/calcpoint/getdepend/" + AppConfig.projectId + "/" + point_list[0],
                    type: "GET"
                }).done(function(result) {
                    if (result.error == 0) {
                        if (result.value) {
                            var hidePointList = [];
                            if (result.value.flag0) {
                                hidePointList = hidePointList.concat(result.value.flag0);
                            }

                            if (result.value.flag1) {
                                hidePointList = hidePointList.concat(result.value.flag1);
                            }

                            if (result.value.flag2) {
                                hidePointList = hidePointList.concat(result.value.flag2);
                            }
                        }
                        //删除本来的点, 不需要隐藏
                        hidePointList = hidePointList.filter(function(point) {
                            return point != point_list[0];
                        });

                        getHistoryDataReduce(hidePointList);
                    } else {
                        alert(I18n.resource.tag.inspect.ERROR_MESSAGE + result.value);
                    }
                }).fail(function(e) {
                    _this.serverRequestError(e);
                });
            } else {
                getHistoryDataReduce();
            } 
        },

        //取消因为格式刷的选中状态;
        uncheckBrush: function() {
            _this.$dataTable.find('.point-format-brush').removeClass('point-format-brush');
        },

        //支持ctrl,shift;
        pointFormatBrush: function() {
            _this.brushTags = [];
            var selectedTag = _this.$dataTable.simpleDataTable('getSelectedData');
            if (!selectedTag || !selectedTag.length) {
                alert.warning(I18n.resource.tag.inspect.FIRST_CHOICE_ONE_POINT);
                return;
            }
            if (selectedTag.length !== 1) {
                alert.warning(I18n.resource.tag.inspect.SELECT_ONLY_ONE_POINT);
                return;
            }

            if (selectedTag[0].type !== "thing") {
                alert.warning(I18n.resource.tag.inspect.PLEASE_CHANGE_POINT);
                return;
            }

            _this.uncheckBrush();
            _this.brushTags = selectedTag[0].tag;
            $("#" + selectedTag[0]._id).addClass('point-format-brush').removeClass('active');
            $('#point-format-brush').parent().hide();
            $('#sure-format-brush').parent().show();
        },

        sureBrush: function(tags) {
            $('#sure-format-brush').parent().hide();
            $('#point-format-brush').parent().show();
            _this.uncheckBrush();
            _this.brushTags = [];
            if (!tags || !tags.length) {
                alert.danger(I18n.resource.tag.inspect.FIRST_CHOICE_TAG_POINT);
                return;
            }
            var selectRow = _this.$dataTable.simpleDataTable('getSelectedData');
            if (!selectRow || !selectRow.length) {
                alert.warning(I18n.resource.tag.inspect.SELECT_NEED_BRUSH_POINT);
                return;
            }

            for (var i = 0; i < selectRow.length; i++) {
                if (selectRow[i].type !== "thing") {
                    alert.danger(I18n.resource.tag.inspect.PLEASE_CHANGE_POINT);
                    return;
                }
            }

            for (var i = 0; i < tags.length; i++) {
                $('#sortTag').find('.tag-item[tag="' + tags[i] + '"]').trigger('click');
                if (i == tags.length - 1) {
                    $('#sortTag').find('.tag-item.selectedColor').removeClass('selectedColor');
                }
            }

        },

        //上一级目录
        upperLevelDirectory: function (parID) {
            if (_this.markpartentTotalId.length) {
                var ilen = _this.markpartentTotalId.length;
                if (_this.markpartentTotalId[ilen - 1] !== '') {
                    _this.$dataTable.simpleDataTable('setPostData', 'Prt', _this.markpartentTotalId[ilen - 1]);
                    _this.$dataTable.simpleDataTable('refreshTable');
                } else { 
                    _this.showRootDirectory();
                }
                _this.markpartentTotalId.pop();
            } else {
                var tree = $.fn.zTree.getZTreeObj("tagTreeUl");
                var treeNodes = tree.getSelectedNodes();
                if (treeNodes.length > 0) {
                    tree.cancelSelectedNode();
                }
                if (_this.rootDirectoryPrt == _this.nodePrt) {
                    _this.showRootDirectory();
                } else {
                    $('#' + parID).find('>a').trigger('click');
                } 
            }
        },
        // 显示根目录: 
        showRootDirectory: function () { 
            Spinner.spin($(".tag-list-box")[0]);
            WebAPI.post('/tag/getThingTree', {
                projId: AppConfig.projectId,
                isOnlyGroup: true
            }).done(function (result) {
                if (result.success) {
                    _this.$dataTable.simpleDataTable('setData', result.data);
                }
            }).always(function () {
                Spinner.stop();
            });
        },

        // 得到选择的 tree node id
        getSelectPId: function() {
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
        loadTableView: function($table) {
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
                        _this.pointList = result.data.detailList;
                        return result.data && result.data.detailList;
                    }
                },
                onBeforeRender: function() {
                    Spinner.spin($(".tag-list-box")[0]);
                },
                onAfterRender: function() {
                    Spinner.stop();
                },
                onRowDbClick: function(tr, data, event, table) {
                    if (data.type !== 'group') {
                        return false;
                    }

                    if (_this.markpartentTotalId.indexOf(data.prt) == -1) {
                        _this.markpartentTotalId.push(data.prt);
                    }
                    table.settings.postData['Prt'] = data._id;
                    table.refreshTable();
                },
                onCopyPointName: function(tr, data, e) {
                    _this.copyPointName(tr, data);
                    e.stopPropagation();
                },
                rowIdKey: '_id',
                rowPrtIdKey: 'prt',
                totalNumIndex: 'data.count',
                colNames: [
                    I18n.resource.common.NAME,
                    I18n.resource.debugTools.exportData.REMARK,
                    I18n.resource.report.templateConfig.PRAM_VALUE,
                    I18n.resource.appDashboard.workflow.TAG
                ],
                colModel: [{
                        index: 'name',
                        isCopyValue: true,
                        html: true,
                        width: '296px',
                        highlight: true,
                        converter: function(value, row) {
                            if (row.tag && row.tag.length) {
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
                                var icon = '';
                                if (parseInt(row.flag) == 0) {
                                    icon = 'icon iconfont icon-xianchangdian';
                                } else if (parseInt(row.flag) == 1) {
                                    icon = 'icon iconfont icon-xunidian';
                                } else if (parseInt(row.flag == 2)) {
                                    icon = 'icon iconfont icon-jisuandian1'
                                } else {
                                    return value;
                                }
                                row.icon = icon;
                                return beopTmpl('tpl_folder_cell', row);
                            }
                        }
                    },
                    {
                        index: 'note',
                        html: true,
                        width: '100px',
                        converter: function(value, row) {
                            return value ? value : '';
                        }
                    },
                    {
                        index: 'value',
                        html: true,
                        width: '100px',
                        converter: function(value, row) {
                            return value ? value : '';
                        }
                    },
                    {
                        index: 'tag',
                        html: true,
                        converter: function(tags, row) {
                            if (!tags || !tags.length) {
                                return ''
                            }
                            return beopTmpl('tpl_tag_row', {
                                tags: tags.filter(function(item) {
                                    return !!item
                                }),
                                canDelete: true,
                                editTagAttr: beop.tag.panel.getAllTagAttr()
                            });
                        }
                    }
                ]
            };
            if (_this.$dataTable) {
                _this.$dataTable.removeData();
                _this.$dataTable = null;
            }
            if ($('#allNodesFolder').hasClass('active')) { 
                dataTableOptions.postData.isAll = true;
            }
            _this.$dataTable = $table.off().simpleDataTable(dataTableOptions);
        },

        copyPointName: function(tr, data) {
            BEOPUtil.copyToClipboard(data.name, null);
        },

        loadingAttributeTable: function($table) {
            var tagIconsMap = beop.model.dmModel.getTagIcons();
            var selectTagName = $('#selectTagAttribute').val();
            var tagAttributes = _this.allAttriTag[selectTagName];
            var colNamesList, width;
            colNamesList = [
                I18n.resource.tag.inspect.FOLDER_OR_POINT_NAME
            ];
            if (localStorage.getItem('language') == 'zh') {
                colNamesList = colNamesList.concat(tagAttributes['zh']);
            } else {
                colNamesList = colNamesList.concat(tagAttributes['en']);
            }

            if (colNamesList.length > 5) {
                width = "217px";
            } else {
                width = '';
            }

            var colModelList = [{
                index: 'fileName',
                html: true,
                width: '296px',
                highlight: true,
                converter: function(value, row) {
                    if (row.tag && row.tag.length) {
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
                        return beopTmpl('tpl_tag_folder_cell', row);
                    } else {
                        return value;
                    }
                }
            }];

            tagAttributes['en'].forEach(function(item) {
                colModelList.push({
                    index: item,
                    width: width,
                    html: true,
                    converter: function(value, row) {
                        return beopTmpl('tpl_row_input', { name: item, value: value });
                    }
                });
            });

            var dataTableAttribute = {
                url: '/tag/getDetails/editAttribute',
                post: WebAPI.post,
                postData: {
                    Prt: _this.parentPrtId ? _this.parentPrtId : _this.getSelectPId(),
                    projId: AppConfig.projectId,
                    tag: selectTagName,
                    isAll:false
                },
                searchOptions: {
                    pageSize: 'limit',
                    pageNum: 'skip'
                },
                pageSize: localStorage.getItem(PAGE_SIZE_STORAGE_KEY),
                searchInput: $("#mode-data-Search"),
                rowsNums: [200, 500, 1000, 'all'],
                dataFilter: function(result) {
                    if (result.success) {
                        $('#tagEdit-table .widget-sdt-container').css('width', $('#tagEdit-table .table-header').width() + 15);
                        var $ordinal_number = $('#ordinal_number');
                        if ($ordinal_number.hasClass('active')) {
                            $ordinal_number.removeClass('active');
                        }
                        _this.DetailsList = $.extend(true, [], result.data.Details);
                        var newData = _this.DetailsList;
                        var dataList = [];
                        for (var i = 0; i < newData.length; i++) {
                            if (newData[i].attribute) {
                                newData[i].attribute._id = newData[i]._id;
                                newData[i].attribute.prt = newData[i].prt;
                                newData[i].attribute.fileName = newData[i].name;
                                newData[i].attribute.type = newData[i].type;
                                newData[i].attribute.tag = newData[i].tag;
                                dataList.push(newData[i].attribute);
                            }
                        }
                        return dataList;
                    }
                },
                onBeforeRender: function() {
                    Spinner.spin($(".tag-list-box")[0]);
                },
                onAfterRender: function() {
                    Spinner.stop();
                },
                onRowDbClick: function(tr, data, event, table) {
                    if (data.type !== 'group') {
                        return false;
                    }
                    _this.isClickBack = false;
                    _this.parentPrtId = data._id;
                    if (_this.pointTotalId.indexOf(data.prt) == -1) {
                        _this.pointTotalId.push(data.prt);
                        _this.beforeAttribTag.push(selectTagName);
                    }
                    _this.getEditTags();
                },
                rowIdKey: '_id',
                rowPrtIdKey: 'prt',
                totalNumIndex: 'data.count',
                colNames: colNamesList,
                colModel: colModelList
            };
            if (_this.$editDataTable) {
                _this.$editDataTable.removeData();
                _this.$editDataTable = null;
            }

            if ($('#allNodesFolder').hasClass('active')) { 
                dataTableAttribute.postData.isAll = true;
            }
            
            _this.$editDataTable = $table.off().simpleDataTable(dataTableAttribute);
        },

        folderState: function() {
            _this.$container.find('.tagCenterBox').empty().append(beopTmpl('tpl_tag_table_item'));
            $("#modeType-content").empty().append(beopTmpl('tpl_markMode_folder'));
        },
        _addTag: function(point, newTag) {
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
        editContent: function($this) {
            var allTagAttrBox = beop.tag.panel.getAllTagAttrBox();
            var name = $this.attr('data-name');
            _this.TagName = name.toLowerCase();
            allTagAttrBox.map(function(item) {
                if (item.name === name) {
                    var equipmentData = [];
                    for (var i = 0; i < item.attrInputs.length; i++) {
                        var equipmentName = {
                            en: item.attrInputs[i].name.en,
                            zh: item.attrInputs[i].name.zh
                        };
                        equipmentData.push(equipmentName);
                    }
                    var $editModal = $("#tag-markMode-edit");
                    $editModal.modal();
                    $editModal.find('#modeEditContent').empty().append(beopTmpl('tpl_tag_modeEdit', { list: equipmentData }));
                    var row = _this.$dataTable.simpleDataTable('getSelectedData')[0];
                    var tagAttrP = row.attrP['' + name.toLowerCase() + ''];
                    if (tagAttrP) {
                        for (var key in tagAttrP) {
                            $('#equipmentFrom [name="' + key + '"]').val(tagAttrP[key]);
                        }
                    }
                    I18n.fillArea($editModal);
                }
            });
        },
        //设备放在前面显示
        advanceEquipment: function(tags) {
            var allEquipment = beop.tag.panel.getTagsByType('Equipment');
            var AllEquipmentName = [];
            var equipmentArr = [],
                notEquipmentArr = [];
            allEquipment.forEach(function(item) {
                AllEquipmentName.push(item.name);
            });
            tags.forEach(function(item) {
                if (AllEquipmentName.indexOf(item) !== -1) {
                    equipmentArr.push(item);
                } else {
                    notEquipmentArr.push(item);
                }
            });
            // 有属性的放前面
            var newSortTag = equipmentArr.concat(notEquipmentArr);
            var hasAttribute = [],
                notHasAttribute = [];
            newSortTag.length && newSortTag.map(function (item) {
                if (typeof item =='string' ) { 
                    if (beop.tag.panel.getAllTagAttr().indexOf(item.toUpperCase()) !== -1) {
                        hasAttribute.push(item);
                    } else {
                        notHasAttribute.push(item);
                    }
                }
            });
            return hasAttribute.concat(notHasAttribute);
        },

        editModeTable: function() {
            $("#modeType-content").empty().append(beopTmpl('tpl_tag_edit_list'));
            $("#modeType-content .attributeTextSelect").empty().append(beopTmpl('tpl_select_tagAttribute', { 'list': _this.hasAttribNameList }));
            if (_this.isClickBack && _this.beforeAttribTag && _this.beforeAttribTag.length) {
                var ilen = _this.beforeAttribTag.length;
                $('#selectTagAttribute').val(_this.beforeAttribTag[(ilen - 1)]);
                _this.beforeAttribTag.pop();
            }
            _this.loadingAttributeTable($("#tagEdit-table"));
        },

        //获取可编辑的tag;
        getEditTags: function () {
            var $allNodesFolder = $('#allNodesFolder');
            var data;
            if ($allNodesFolder.hasClass('active')) {
                data = {
                    prt:null,
                    projId: AppConfig.projectId,
                    isAll: true
                }
            } else { 
                var selectNode = beop.tag.tree.getSelectTreeNode()[0],
                selectNodeId = selectNode._id;
                data = {
                    projId: AppConfig.projectId,
                    Prt: _this.parentPrtId ? _this.parentPrtId : selectNodeId,
                    isAll: false
                }
            }
            
            Spinner.spin($('.tag-list-box').get(0));
            WebAPI.post('/tag/getTags/editAttribute',data).done(function(result) {
                if (result.success) {
                    if (result.data && Object.keys(result.data) && Object.keys(result.data).length) {
                        _this.allAttriTag = result.data;
                        _this.hasAttribNameList = Object.keys(result.data);
                        _this.editModeTable();
                    } else {
                        $("#modeType-content").empty().append(beopTmpl('tpl_noTag_mode_list'));
                        _this.isHasAttrib = true;
                    }
                }
            }).always(function() {
                if (_this.isHasAttrib) {
                    Spinner.stop();
                }
            });
        },

        saveChangeTagAttribute: function() {
            var attrP = [];
            var $allTr = _this.$editDataTable.simpleDataTable('getAllRows');
            var changeId = [];
            var inputArr;
            _this.DetailsList.forEach(function(item) {
                for (var i = 0; i < $allTr.length; i++) {
                    if (item._id == $allTr[i].id) {
                        getChangeId(item, $allTr[i]);
                    }
                }
            });

            function getChangeId(item, $Tr) {
                inputArr = $($Tr).find('input');
                for (var i = 0; i < inputArr.length; i++) {
                    if (item.attribute[$(inputArr[i]).attr('name')] !== $(inputArr[i]).val()) {
                        changeId.push($Tr.id);
                        break;
                    }
                }
            }

            for (var j = 0; j < $allTr.length; j++) {
                if (changeId.indexOf($allTr[j].id) !== -1) {
                    var attrPArr = {
                        'Id': $allTr[j].id
                    };
                    var attrPObj = {};
                    inputArr = $($allTr[j]).find('input');
                    for (var i = 0; i < inputArr.length; i++) {
                        if (!attrPObj[$(inputArr[i]).attr('name')]) {
                            attrPObj[$(inputArr[i]).attr('name')] = $(inputArr[i]).val();
                        }
                    }
                    //更新修改后,保存内容;
                    _this.DetailsList.forEach(function(item) {
                        if (item._id == $allTr[j].id) {
                            item.attribute = attrPObj;
                        }
                    });
                    attrPArr.attribute = attrPObj;
                    attrP.push(attrPArr);
                }
            }
            if (attrP.length) {
                _this.saveTagAttrP(attrP);
            }
        },

        saveTagAttrP: function(attrP) {
            var data = {
                'projId': AppConfig.projectId,
                'tag': $('#selectTagAttribute').val(),
                'inheritable': false,
                'modif_list': attrP
            };
            WebAPI.post('/tag/setTagAttrP/batch', data).done(function(result) {
                if (result.success) {

                } else {
                    alert(result.msg);
                }
            });
        },
        getStartRowColIndex: function($tr, $allTr) {
            for (var i = 0; i < $allTr.length; i++) {
                if ($allTr[i].id == $tr[0].id) {
                    _this.rowStartIndex = i + 1;
                    break;
                }
            }
            _this.colStartIndex = $tr.find('td.dottedLine')[0].cellIndex + 1;
        },
        judgeDoNumber: function(beforeLastString, afterFirstNum, afterLastNum, firstNumILen, lastNumILen, $ordinal_number) {
            _this.beforeString = beforeLastString;
            _this.afterFirstNum = afterFirstNum;
            _this.afterLastNum = afterLastNum;
            _this.firstNumILen = firstNumILen;
            _this.lastNumILen = lastNumILen;
            $ordinal_number.addClass('active');
        },

        judgeNotDoNumber: function($ordinal_number) {
            $ordinal_number.removeClass('active');
            _this.beforeString = null;
            _this.afterLastNum = null;
        }
    };
    $.extend(DmTagMark.prototype, DmTagMarkFunc);
    return DmTagMark;
})();
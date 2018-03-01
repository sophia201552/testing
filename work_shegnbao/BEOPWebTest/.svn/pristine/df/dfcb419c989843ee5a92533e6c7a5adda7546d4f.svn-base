var DataSource = (function () {
    function DataSource(parent) {
        this.m_parent = parent;
        this.m_newPointList = [];
        this.m_allPointList = [];
        this.m_allGroupList = [];
        this.m_arrProjIdColorMap = {};
        this.m_dataSourceId;
        this.m_lang = I18n.resource.dataSource;
        this.m_selectItemId = 0;
        this.m_selectGroupId = 0;
        this.m_groupIconOpen = 'http://images.rnbtech.com.hk/static/images/dataSource/group_head_sel.png';
        this.m_groupIconClose = 'http://images.rnbtech.com.hk/static/images/dataSource/group_head_normal.png';
        this.m_cfgPanel;
        this.m_unassigned = 'Unassigned';
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
    }

    DataSource.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            I18n.fillArea($('#divAnlsDatasourcePane'));
            I18n.fillArea($('#divEnergyAnlsPane'));
            _this.initContain();
            _this.initElement();
            _this.loadDataSourceRecord();
            _this.initDrag();
            Spinner.stop();
        },

        close: function () {
            this.m_newPointList = null;
            this.m_allPointList = null;
        },

        initContain: function () {
            var _this = this;

            var dsContain = $('#dataSrcContain');
            dsContain.html('');

            var panel = $('<div id="dataSrcPanel"></div>');
            dsContain.append(panel);

            var addGroup = $('<div id="dataSrcAddGroup"><input type="text" id="inputAddGroup" placeholder="+ Add group" ></input></div>');
            dsContain.append(addGroup);
            dsContain.keyup(function (e) {
                if (13 == e.keyCode) {
                    _this.addNewGroup();
                }
            });

            var inputAdd = addGroup.find('#inputAddGroup');
            inputAdd.attr('placeholder', _this.m_lang.ADD_GROUP);
            inputAdd.blur(function (e) {
                _this.addNewGroup();
            });
        },

        initElement: function () {
            var _this = this;

            var len = AppConfig.projectList.length;
            var item;
            var nColorSize = _this.m_parent.arrColor.length;
            for (var i = 0; i < len; i++) {
                item = AppConfig.projectList[i];
                _this.m_arrProjIdColorMap[item.id] = _this.m_parent.arrColor[i - parseInt(i / nColorSize) * nColorSize];
            }

            EventAdapter.on($('#data_source_add'), 'click', function (e) {
            //$('#data_source_add').click(function (e) {
                if (0 == _this.m_selectGroupId) {
                    alert(_this.m_lang.NO_SELECT_GROUP);
                    return;
                }
                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 0, true, '', '', '', -1);
                    _this.m_cfgPanel.show();
                }).error(function (result) {
                }).always(function (e) {
                });
            });

            EventAdapter.on($('#data_source_formula_add'), 'click', function (e) {
            //$('#data_source_formula_add').click(function (e) {
                if (0 == _this.m_selectGroupId) {
                    alert(_this.m_lang.NO_SELECT_GROUP);
                    return;
                }
                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 1, true, '', '', '', -1);
                    _this.m_cfgPanel.show();
                }).error(function (result) {
                }).always(function (e) {
                });
            });

            EventAdapter.on($('#divAnlsDatasourcePane'), 'click', function (e) {
            //$('#divAnlsDatasourcePane').click(function (e) {
                _this.clearSelect();
            });
        },

        insertIntoDataList: function (customName, ptName, ptDesc, prjName, iconColor, itemId, baseNode, bIsAppend, bIsSelected) {   // useless now
            var _this = this;

            var div;
            if (bIsSelected) {
                div = $('<div draggable="true" class="dsItem grow dsSelected" style="height:34px"></div>');
            }
            else {
                div = $('<div draggable="true" class="dsItem grow" style="height:34px"></div>');
            }
            div.attr('id', itemId);
            div.click(function (e) {
                _this.clearSelect();

                var target = $(e.currentTarget);
                if ('dsItem grow' == target.attr('class')) {
                    target.attr('class', 'dsItem grow dsSelected');
                } else {
                    target.attr('class', 'dsItem grow');
                }

                _this.stopBubble(e);
            });

            var icon = $('<div class="dsMark"></div>');
            icon.css('background-color', iconColor);
            div.append(icon);

            var custName = $('<div class="dsValue" style="height:36px;">' + customName + '</div>');
            div.append(custName);

            var btnRename = $('<span class="dsBtnRename grow glyphicon glyphicon-wrench"></span>');
            btnRename.click(function (e) {
                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }

                _this.m_selectItemId = $(e.currentTarget).closest('.dsItem').get(0).id;
                var customName, ptDesc, ptName, item, prjId;
                for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (itemId === item.itemId) {
                        customName = item.customName;
                        ptName = item.ptName;
                        ptDesc = item.ptDesc;
                        prjId = item.prjId;
                        break;
                    }
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 0, false, customName, ptName, ptDesc, prjId);
                    _this.m_cfgPanel.show();
                }).fail(function (result) {
                }).always(function (e) {
                });

/*
                var show = $(e.currentTarget).prevAll('.dsValue');
                show.css('display', 'none');

                var target = $(e.currentTarget).nextAll('.dsDivChange');
                target.attr('class', 'dsDivChange show');
                div.css('height', '280px');
                div.css('width', '100%');

                var item;
                var strName = '';
                var strDesc = '';
                for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (itemId == item.itemId) {
                        strName = item.customName;
                        strDesc = item.ptDesc;
                        break;
                    }
                }
                var temp = target.find('input');
                if (temp.length == 4) {
                    $(temp[0]).val(strName);
                    $(temp[1]).val(strDesc);
                }

                _this.stopBubble(e);
*/
            }).error(function (e) {
            });
            div.append(btnRename);

            var btnRemove = $('<span class="dsBtnRemove grow glyphicon glyphicon-remove-sign"></span>');
            btnRemove.click(function (e) {
                var retCon = confirm(_this.m_lang.REMOVE_CONFIRM_TIPS);
                if (true === retCon) {
                    var div = $(e.currentTarget).closest('.dsItem');
                    var dataSrcItemId = div.attr('id');
                    var dataSrcId = _this.m_dataSourceId;

                    WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcId + '/' + dataSrcItemId + '/' + AppConfig.userId).done(function (result) {
                        var data = JSON.parse(result);
                        if (Boolean(data.success)) {
                            var len = _this.m_allPointList.length;
                            for (var i = 0; i < len; i++) {
                                if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                    _this.m_allPointList.splice(i, 1);
                                    break;
                                }
                            }
                            _this.calUpdateDataSources();

                            div.tooltip('destroy');
                            div.remove();

                            // delete workspace
                            var arr = data.deleteModal;
                            var len = arr.length;
                            if (len > 0) {
                                var delMod;
                                var arrDelTitle = [];
                                for (var i = 0; i < len; i++) {
                                    delMod = $('#' + arr[i]);
                                    arrDelTitle.push(delMod.find('.newDivPageTitle').val());
                                    delMod.remove();
                                }

                                var delTitle = _this.m_lang.WORKSPACE + ':';
                                for (var i = 0, len = arrDelTitle.length; i < len; i++) {
                                    delTitle += arrDelTitle[i] + ' ';
                                }
                                delTitle += _this.m_lang.REMOVE_RESULT;
                                alert(delTitle);
                            }
                        }
                    }).error(function () {
                    });
                }
            }).error(function (e) {
            });
            div.append(btnRemove);

            //
            var divChange = $('<div class="dsDivChange"></div>');

            var ctlPrjName = $('<div class="form-group"><label style="color:#eee">' + _this.m_lang.PROJECT_NAME + ': ' + prjName + '</label></div>');
            ctlPrjName.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(ctlPrjName);

            var ctlPtName = $('<div class="form-group"><label style="color:#eee">' + _this.m_lang.POINT_NAME + ': ' + ptName + '</label></div>');
            ctlPtName.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(ctlPtName);

            var inputCustName = $('<div class="form-group"><label style="color:#eee">Custom Name</label><input type="text" class="form-control" value="" placeholder="Custom Name"></input></div>');
            inputCustName.find('label').text(_this.m_lang.CUSTOM_NAME);
            var ctlInput = inputCustName.find('input');
            ctlInput.attr('value', customName);
            ctlInput.attr('placeholder', _this.m_lang.CUSTOM_NAME);
            inputCustName.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(inputCustName);

            var inputDesc = $('<div class="form-group"><label style="color:#eee">Description</label><input type="text" class="form-control" value="" placeholder="Description"></input></div>');
            inputDesc.find('label').text(_this.m_lang.POINT_DESC);
            ctlInput = inputDesc.find('input');
            ctlInput.attr('value', ptDesc);
            ctlInput.attr('placeholder', _this.m_lang.POINT_DESC);
            inputDesc.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(inputDesc);

            var btnOk = $('<button class="btn btn-default btn-sm" style="position:absolute; right:70px;">OK</button>');
            btnOk.text(_this.m_lang.SURE);
            btnOk.click(function (e) {
                var temp = $(e.currentTarget).closest('.dsDivChange').find('input');
                var strName = $(temp[0]).val();
                var strDesc = $(temp[1]).val();
                var prjId, ptName, item;

                for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (itemId == item.itemId) {
                        prjId = item.prjId;
                        ptName = item.ptName;
                        break;
                    }
                }

                var postData = {
                    datasourceId: _this.m_dataSourceId,
                    itemList: [{
                        id: itemId,
                        type: 0,
                        projId: prjId,
                        alias: strName,
                        note: strDesc,
                        value: ptName,
                        groupId: ''
                    }]
                };

                WebAPI.post('/analysis/datasource/saveMulti/' + AppConfig.userId, postData).done(function (result) {
                    var data = JSON.parse(result);
                    var id = (data.itemIdList)[0].id;

                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        if (id == _this.m_allPointList[i].itemId) {
                            _this.m_allPointList[i].customName = strName;
                            _this.m_allPointList[i].ptDesc = strDesc;
                            break;
                        }
                    }
                    _this.setToolTipsCustomName(div, strName);
                    _this.setToolTipsDesc(div, strDesc);
                    _this.calUpdateDataSources();
                    $('#'+id).find('.dsValue').text(strName);
                }).error(function (e) {
                });

            });
            divChange.append(btnOk);

            var btnCancel = $('<button class="btn btn-default btn-sm" style="position:absolute; right:15px;">Cancel</button>');
            btnCancel.text(_this.m_lang.CANCEL);
            btnCancel.click(function (e) {
            });
            divChange.append(btnCancel);

            div.append(divChange);


            if (bIsAppend) {
                baseNode.append(div);
            }
            else {
                baseNode.after(div);
            }
        },
        initToolTips: function (parent, customName, projectName, pointName, pointDesc) {
            var _this = this;

            var show = new StringBuilder();
            show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px;">');
            show.append('    <div class="tooltipTitle tooltip-inner">GeneralRegressor</div>');
            show.append('    <div class="tooltipContent">');
            show.append('        <p class="customName" style="word-break:break-all;"><span style="font-weight:bold">').append(_this.m_lang.CUSTOM_NAME).append('</span>: ').append(customName).append('</p>');
            show.append('        <p class="projectName" style="word-break:break-all;"><span style="font-weight:bold">').append(_this.m_lang.PROJECT_NAME).append('</span>: ').append(projectName).append('</p> ');
            show.append('        <p class="pointName" style="word-break:break-all;"><span style="font-weight:bold">').append(_this.m_lang.POINT_NAME).append('</span>: ').append(pointName).append('</p> ');
            show.append('        <p class="pointDesc" style="word-break:break-all;"><span style="font-weight:bold">').append(_this.m_lang.POINT_DESC).append('</span>: ').append(pointDesc).append('</p> ');
            show.append('    </div>');
            show.append('    <div class="tooltip-arrow"></div>');
            show.append('</div>');
            var options = {
                placement: 'left',
                title: _this.m_lang.PARAM,
                template: show.toString()
            };
            parent.tooltip(options);
        },

        setToolTipsAll: function (row, userName, customName, projectName, pointName, pointDesc) {
            var tip = row.data('bs.tooltip').$tip;
            userName = ': ' + userName;
            customName = ': ' + customName;
            projectName = ': ' + projectName;
            pointName = ': ' + pointName;
            pointDesc = ': ' + pointDesc;
            tip.find('.userName').text(this.m_lang.USER_NAME + userName);
            tip.find('.customName').text(this.m_lang.CUSTOM_NAME + customName);
            tip.find('.projectName').text(this.m_lang.PROJECT_NAME + projectName);
            tip.find('.pointName').text(this.m_lang.POINT_NAME + pointName);
            tip.find('.pointDesc').text(this.m_lang.POINT_DESC + pointDesc);
        },

        setToolTipsCustomName: function (row, customName) {
            var tip = row.data('bs.tooltip').$tip;
            tip.find('.customName').text(this.m_lang.CUSTOM_NAME + ': ' + customName);
        },

        setToolTipsDesc: function (row, ptDesc) {
            var tip = row.data('bs.tooltip').$tip;
            tip.find('.pointDesc').text(this.m_lang.POINT_DESC + ': ' + ptDesc);
        },

        renderTabel: function () {
            var _this = this;

            var len = _this.m_newPointList.length;
            if (len <= 0) {
                return;
            }

            /*
            // check to delete repeat new items
            for (var i = 0, lenAll = _this.m_allPointList.length; i < lenAll; i++) {
                var allItem = _this.m_allPointList[i];
                if (allItem.ptName == '') {
                    continue;
                }

                for (var j = 0, lenNew = _this.m_newPointList.length; j < lenNew; j++) {
                    var newItem = _this.m_newPointList[j];
                    if (newItem.ptName == '') {
                        continue;
                    }

                    if (allItem.ptName == newItem.ptName) {
                        if (allItem.prjId == newItem.prjId) {
                            _this.m_newPointList.splice(j, 1);

                            var showAlert = new Alert($('#showErr'), Alert.type.warning, _this.m_lang.FILTER_REPEAT_ITEM);
                            showAlert.show(2000);
                            break;
                        }
                        else {
                            newItem.customName = newItem.ptName + '_' + newItem.prjName;
                        }
                    }
                }
            }*/

            var div = $('#dataSrcPanel');
            var rowBaseNum = div.find('.dsItem').length;
            var rowCount;
            var item;
            var eachItem;
            var postData;

            len = _this.m_newPointList.length;
            if (len > 0) {
                if (_this.m_dataSourceId) {
                    postData = {
                        datasourceId: _this.m_dataSourceId,
                        itemList: []
                    };
                } else {
                    postData = {
                        itemList: []
                    };
                }


                for (var i = 0; i < len; i++) {
                    item = _this.m_newPointList[i];
                    eachItem = {
                        type: 0,
                        projId: item.prjId,
                        alias: item.customName,
                        note: item.ptDesc,
                        value: item.ptName,
                        groupId: item.groupId
                    }
                    postData.itemList.push(eachItem);
                }

                var projName = _this.m_newPointList[0].prjName;
                var iconColor = _this.m_newPointList[0].iconColor;
                WebAPI.post('/analysis/datasource/saveMulti/' + AppConfig.userId, postData).done(function (result) {
                    if (result != '') {
                        var data = JSON.parse(result);
                        if (data.id != '') {
                            _this.m_dataSourceId = data.id;
                        }

                        var list = data.itemIdList;
                        var len = list.length;
                        for (var i = 0; i < len; i++) {
                            if (_this.m_newPointList[i].customName == list[i].alias) {
                                _this.m_newPointList[i].itemId = list[i].id;
                            }
                        }

                        var divInsert = $('#' + _this.m_selectGroupId);
                        if (undefined != divInsert) {
                            for (var i = 0; i < len; i++) {
                                _this.insertTreeItem(divInsert, list[i].id, iconColor, list[i].alias, 0, '', true);
                                _this.initToolTips($('#'+list[i].id), list[i].alias, projName, list[i].value, list[i].note);
                            }
                        }

                        /*
                        len = _this.m_newPointList.length;
                        var prjName;
                        for (var i = 0; i < len; i++) {
                            rowCount = rowBaseNum + i;
                            item = _this.m_newPointList[i];
                            prjName = _this.getProjectNameFromId(item.prjId);
                            _this.insertIntoDataList(item.customName, item.ptName, item.ptDesc, prjName, _this.m_arrProjIdColorMap[item.prjId], item.itemId, div, true, false);
                            _this.initToolTips(div.find('.dsItem').last(), item.ptName, prjName, item.ptName, item.ptDesc);
                        }
                        */

                        _this.m_allPointList = _this.m_allPointList.concat(_this.m_newPointList);
                        _this.calUpdateDataSources();
                    }
                }).error(function () {

                }).always(function () {

                });
            }
        },

        modifyTable: function () {
            var _this = this;
            var item;
            var eachItem;
            var postData;
            var len = _this.m_newPointList.length;
            if (len > 0) {
                if (_this.m_dataSourceId) {
                    postData = {
                        datasourceId: _this.m_dataSourceId,
                        itemList: []
                    };
                } else {
                    postData = {
                        itemList: []
                    };
                }

                item = _this.m_newPointList[0];
                eachItem = {
                    id: item.itemId,
                    type: 0,
                    projId: item.prjId,
                    alias: item.customName,
                    note: item.ptDesc,
                    value: item.ptName,
                    groupId: item.groupId
                }
                postData.itemList.push(eachItem);

                WebAPI.post('/analysis/datasource/saveMulti/' + AppConfig.userId, postData).done(function (result) {
                    if (result != '') {
                        var data = JSON.parse(result);
                        if (data.id != '') {
                            _this.m_dataSourceId = data.id;
                        }

                        for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                            if (item.itemId === _this.m_allPointList[i].itemId) {
                                _this.m_allPointList[i].prjId = item.prjId;
                                _this.m_allPointList[i].prjName = _this.m_newPointList[0].prjName;
                                _this.m_allPointList[i].customName = item.customName;
                                _this.m_allPointList[i].ptName = item.ptName;
                                _this.m_allPointList[i].ptDesc = item.ptDesc;
                                break;
                            }
                        }

                        // change item display
                        var divItem = $('#' + item.itemId);
                        divItem.find('.showName').text(item.customName);

                        // change tips
                        _this.setToolTipsAll(divItem, item.userName, item.customName, item.prjName, item.ptName, item.ptDesc);

                        _this.calUpdateDataSources();

                        Beop.cache.ds.remove(item.itemId);
                    }
                }).error(function () {
                }).always(function () {

                });
            }
        },

        initDrag: function () {
            var _this = this;
            _this.dragOperateSrc($('#dataSrcPanel').get(0));
            _this.dragOperateCfg($('.springConfigMask').parent().get(0));
        },

        dragOperateSrc: function (tableList) {
            if (undefined == tableList) {
                return;
            }

            var _this = this;
            EventAdapter.on($(tableList), 'dragstart',
                function (e) {
                    var tar = $(e.target);
                    var className = tar.attr('class');
                    if (-1 != className.indexOf('nav nav-list tree-group')) {
                        var dragSrcId = tar.attr('id');
                        EventAdapter.setData({'dsGroupId': dragSrcId});
                        //e.dataTransfer.setData('dsGroupId', dragSrcId);
                    }
                    else if (-1 != className.indexOf('treeRow ui-draggable')) {
                        var dragSrcId = tar.attr('id');
                        EventAdapter.setData({'dsItemId': dragSrcId});
                        //e.dataTransfer.setData('dsItemId', dragSrcId);
                    }
                    else {
                        return;
                    }
                    $('.templatePara').css('display','block');
                }
            );

            EventAdapter.on($(tableList), 'dragover',
                function (e) {
                    e.preventDefault();
                }
            );

            EventAdapter.on($(tableList), 'drop',
            function (e)  {
                var tarItem = $(e.target);
                var tarId = 0;
                var dstGroupId = 0;
                var srcGroupId = 0;
                var rowClass = tarItem.attr('class');
                var dragType = -1;   // （==0：组->组）；（==1：点->点）；（==2：点->组）
                var draggedID = 0;
                if (-1 != rowClass.indexOf('nav nav-list tree-group') || -1 != rowClass.indexOf('dsTreeHeader')) {
                    tarId = tarItem.closest('.nav').attr('id');
                    draggedID = EventAdapter.getData().dsGroupId;
                    //draggedID = e.dataTransfer.getData('dsGroupId');
                    if (Boolean(draggedID)) {
                        dragType = 0;
                    }
                    else {
                        draggedID = EventAdapter.getData().dsItemId;
                        //draggedID = e.dataTransfer.getData('dsItemId');
                        if (Boolean(draggedID)) {
                            dragType = 2;
                            tarId = tarItem.closest('.nav').attr('id');
                            dstGroupId = tarId;
                            srcGroupId = $('#' + draggedID).closest('.nav').attr('id');
                        }
                    }
                }
                else if (-1 != rowClass.indexOf('showName') || -1 != rowClass.indexOf('treeRow ui-draggable')) {
                    dragType = 1;
                    draggedID = EventAdapter.getData().dsItemId;
                    //draggedID = e.dataTransfer.getData('dsItemId');
                    tarId = tarItem.closest('.treeRow').attr('id');
                    dstGroupId = tarItem.closest('.nav').attr('id');
                    srcGroupId = $('#' + draggedID).closest('.nav').attr('id');
                }
                else {
                    return;
                }
                if (draggedID == tarId || !draggedID) {
                    return;
                }

                if (0 === dragType) {
                    // drag group
                    var item, groupName;
                    for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                        item = _this.m_allGroupList[i];
                        if (draggedID == item.id) {
                            groupName = item.name;
                            break;
                        }
                    }
                    $('#' + draggedID).remove();
                    _this.insertTreeGroup(draggedID, groupName, 1, $('#'+tarId));

                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        item = _this.m_allPointList[i];
                        if (draggedID == item.groupId) {
                            if(item.itemType == 0) {
                                _this.insertTreeItem($('#' + draggedID), item.itemId, item.iconColor, item.customName, 0, '', true);
                            }else{
                                _this.insertTreeItem($('#' + draggedID), item.itemId, item.iconColor, item.customName, 0, '', false);
                            }

                            var prjName = _this.getProjectNameFromId(item.prjId, _this.m_langFlag);
                            _this.initToolTips($('#'+item.itemId), item.customName, prjName, item.ptName, item.ptDesc);
                        }
                    }
/*
                    var groups = $('#dataSrcPanel .nav');
                    var arrTemp = [];
                    $.each(groups, function(i, n){
                        var id = n.id;
                        if ('' != id) {
                            if ('groupEmpty' == id) {
                                id = '';
                            }
                            arrTemp.push(id);
                        }
                    });
                    var postData = {
                        'groupIdList':arrTemp
                    };
*/
                    var dstGroup, srcGroup;
                    var arrDst = [], arrSrc = [];
                    dstGroup = $('#' + tarId).find('.rows').find('.treeRow');
                    srcGroup = $('#' + draggedID).find('.rows').find('.treeRow');
                    $.each(dstGroup, function(i, n) {
                        arrDst.push(n.id);
                    });
                    $.each(srcGroup, function(i, n) {
                        arrSrc.push(n.id);
                    });
                    var postData = {};
                    postData[tarId] = arrDst;
                    postData[draggedID] = arrSrc;
                    WebAPI.post('/datasource/saveDataSourceGroupLayout/' + AppConfig.userId, postData).done(function (result) {
                        var data = JSON.parse(result);
                        if ('successful' == data.error) {
                            // success
                        }
                    }).error(function () {
                    }).always(function () {
                    });
                }
                else if (1 === dragType || 2 === dragType) {
                    // drag item
                    var itemType = 0;
                    var iconColor = '';
                    var custName = '';
                    var projId = 0;
                    var pointName = '';
                    var pointDesc = '';
                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        if (draggedID == _this.m_allPointList[i].itemId) {
                            _this.m_allPointList[i].groupId = dstGroupId;
                            itemType = _this.m_allPointList[i].itemType;
                            iconColor = _this.m_allPointList[i].iconColor;
                            custName = _this.m_allPointList[i].customName;
                            projId = _this.m_allPointList[i].prjId;
                            pointName = _this.m_allPointList[i].ptName;
                            pointDesc = _this.m_allPointList[i].ptDesc;
                            break;
                        }
                    }

                    var selItem = $('#' + draggedID);
                    selItem.tooltip('destroy');
                    selItem.remove();
                    if (itemType == 0) {
                        _this.insertTreeItem($('#' + dstGroupId), draggedID, iconColor, custName, dragType, $('#' + tarId), true);
                    }else{
                        _this.insertTreeItem($('#' + dstGroupId), draggedID, iconColor, custName, dragType, $('#' + tarId), false);
                    }

                    if (0 == itemType) {
                        var prjName = _this.getProjectNameFromId(projId, _this.m_langFlag);
                        _this.initToolTips($('#' + draggedID), custName, prjName, showName, pointDesc);
                    }
                    else if (1 == itemType) {
                        var showName = _this.getShowNameFromFormula(pointName);
                        _this.initFormulaToolTips($('#' + draggedID), custName, showName, pointDesc);
                    }
                    else {
                        // error
                        return;
                    }
/*
                    var lyItem = $('#dataSrcPanel .treeRow');
                    var arrTemp = [];
                    $.each(lyItem, function(i, n) {
                        var id = n.id;
                        if ('' != id) {
                            arrTemp.push(id);
                        }
                    });
                    var postData = {
                        datasourceId: _this.m_dataSourceId,
                        list: arrTemp
                    };
*/
                    var postData = {};
                    if (dstGroupId == srcGroupId) {
                        var srcGroup, arrSrc = [];
                        srcGroup = $('#' + srcGroupId).find('.rows').find('.treeRow');
                        $.each(srcGroup, function(i, n) {
                            arrSrc.push(n.id);
                        });
                        postData[srcGroupId] = arrSrc;
                    }
                    else {
                        var dstGroup, srcGroup;
                        var arrDst = [], arrSrc = [];
                        dstGroup = $('#' + dstGroupId).find('.rows').find('.treeRow');
                        srcGroup = $('#' + srcGroupId).find('.rows').find('.treeRow');
                        $.each(dstGroup, function(i, n) {
                            arrDst.push(n.id);
                        });
                        $.each(srcGroup, function(i, n) {
                            arrSrc.push(n.id);
                        });

                        var dstGroupCnt = 0, srcGroupCnt = 0;
                        var groups = $('#dataSrcPanel .nav');
                        $.each(groups, function(i, n){
                            if (n.id == dstGroupId) {
                                dstGroupCnt = i;
                            }
                            if (n.id == srcGroupId) {
                                srcGroupCnt = i;
                            }
                        });
                        if (dstGroupCnt < srcGroupCnt) {  // 从下往上拖
                            postData[dstGroupId] = arrDst;
                            postData[srcGroupId] = arrSrc;
                        }
                        else {  // 从上往下拖
                            postData[dstGroupId] = arrDst;
                            postData[srcGroupId] = arrSrc;
                        }
                    }

                    WebAPI.post('/analysis/datasource/saveLayout/' + AppConfig.userId, postData).done(function (result) {
                        var data = JSON.parse(result);
                        if (data.success) {
                            // success
                            /*
                            if (dstGroupId != srcGroupId) {
                                // when drag into another group, call save mulit
                                var postData2;
                                if (_this.m_dataSourceId) {
                                    postData2 = {
                                        datasourceId: _this.m_dataSourceId,
                                        itemList: []
                                    };
                                } else {
                                    postData2 = {
                                        itemList: []
                                    };
                                }
                                var eachPostItem = {
                                    id: draggedID,
                                    type: itemType,
                                    projId: projId,
                                    alias: custName,
                                    note: pointDesc,
                                    value: pointName,
                                    groupId: dstGroupId
                                }
                                postData2.itemList.push(eachPostItem);
                                WebAPI.post('/analysis/datasource/saveMulti/' + AppConfig.userId, postData2).done(function (result) {
                                    if (result != '') {
                                        var data = JSON.parse(result);
                                        if (data.id != '') {
                                            _this.m_dataSourceId = data.id;
                                        }
                                        if (undefined != data.itemIdList) {
                                            if (data.itemIdList[0].id == draggedID) {
                                                // change success
                                            }
                                        }
                                    }
                                }).error(function () {
                                }).always(function () {
                                });
                            }*/
                        }
                    }).error(function () {
                    }).always(function () {
                    });
                }

/*
                var custName;
                var color;
                var baseNode;
                var prjId;
                var ptName;
                var ptDesc;
                var itemType = 0;
                var itemId;

                var len = _this.m_allPointList.length;
                var item;
                for (var i = 0; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (item.itemId == draggedID) {
                        custName = item.customName;
                        color = item.iconColor;
                        prjId = item.prjId;
                        ptName = item.ptName;
                        ptDesc = item.ptDesc;
                        itemType = item.itemType;
                        itemId = item.itemId;
                        break;
                    }
                }

                var bSelect = false;
                var selRow = $('#' + draggedID);
                var name = selRow.attr('class');
                if ('dsItem grow dsSelected' == name) {
                    bSelect = true;
                }

                selRow.tooltip('destroy');
                selRow.remove();

                baseNode = $(e.target).closest('.dsItem');
                var prjName = _this.getProjectNameFromId(prjId);
                var selRowNew;
                if (0 == itemType) {
                    _this.insertIntoDataList(custName, ptName, ptDesc, prjName, color, draggedID, baseNode, false, bSelect);

                    selRowNew = $('#' + draggedID);
                    _this.initToolTips(selRowNew, custName, prjName, ptName, ptDesc);
                }
                else if (1 == itemType) {
                    _this.insertFormula(itemId, custName, color, ptName, ptDesc);

                    selRowNew = $('#' + draggedID);
                    _this.initFormulaToolTips(selRowNew, custName, ptName, ptDesc);
                }


                // database
                var grid = $('#dataSrcPanel').find('.dsItem');
                if (grid != undefined) {
                    var gridLen = grid.length;
                    var itemId;
                    var listLen = _this.m_allPointList.length;
                    var item;
                    var arrTemp = [];

                    for (var i = 0; i < gridLen; i++) {
                        itemId = grid[i].id;

                        for (var j = 0; j < listLen; j++) {
                            item = _this.m_allPointList[j];
                            if (itemId == item.itemId) {
                                arrTemp.push(item.itemId);
                                break;
                            }
                        }
                    }
                    var postData = {
                        datasourceId: _this.m_dataSourceId,
                        list: arrTemp
                    };
                    WebAPI.post('/analysis/datasource/saveLayout/' + AppConfig.userId, postData).done(function (result) {
                        var data = JSON.parse(result);
                        if ('True' == data.success) {

                        }
                    }).error(function () {

                    }).always(function () {
                        Spinner.stop();
                    });
                }
*/
            });
        },

        dragOperateCfg: function (divItem) {
            if (undefined == divItem) {
                return;
            }

            var _this = this;
            EventAdapter.on($(divItem), 'dragstart',
                function (e) {
                    var target = $(e.target);
                    var className = target.attr('class');
                    if ('dsItem grow' != className && 'dsItem grow dsSelected' != className) {
                        return;
                    }
                    var dragSrcId = target.attr('id');
                    EventAdapter.setData({'dsItemId': dragSrcId});
                    //e.dataTransfer.setData('dsItemId', dragSrcId);
                }
            );

            EventAdapter.on($(divItem), 'dragover',
                function (e) {
                    e.preventDefault();
                }
            );

            EventAdapter.on($(divItem), 'drop',
                function (e) {
                    var target = $(e.target);
                }
            );
        },

        saveCurrentRecords: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            // delete first
            WebAPI.post('/delete_data_source_records_by_userid', {
                userId: AppConfig.userId
            }).done(function (result) {
                if (result != 0) {
                    Spinner.stop();
                    return;
                }

                // sort second
                var newPtList = [];
                var id;
                var len = _this.m_allPointList.length;
                var newRow;
                var item;
                $('#dataSrcPanel .dsItem').each(function () {
                    id = $(this).attr('id');
                    for (var i = 0; i < len; i++) {
                        item = _this.m_allPointList[i];
                        if (id == item.itemId) {
                            newRow = {
                                'itemId': id,
                                'userId': item.userId,
                                'userName': item.userName,
                                'customName': item.customName,
                                'prjId': item.prjId,
                                'prjName': item.prjName,
                                'ptName': item.ptName,
                                'ptDesc': item.ptDesc,
                                'iconColor': item.iconColor,
                                'itemId': item.itemId
                            }
                            newPtList.push(newRow);
                            break;
                        }
                    }
                });
                _this.m_allPointList = newPtList;

                // insert third
                var row;
                var data = [];
                var len = _this.m_allPointList.length;
                for (var i = 0; i < len; i++) {
                    item = _this.m_allPointList[i];
                    row = {
                        'userId': item.userId,
                        'customName': item.customName,
                        'projectId': item.prjId,
                        'pointName': item.ptName,
                        'pointDesc': item.ptDesc,
                        'iconColor': item.iconColor
                    }
                    data.push(row);
                }

                WebAPI.post('/save_data_source_record', {
                    sourceList: data
                }).done(function (result) {
                    if (0 == result) {
                        // success
                    }
                }).error(function (result) {
                    alert(I18n.resource.observer.widgets.DATABASE_OPERATION_FAILED+'！');
                    return;
                });
            }).error(function (result) {
                alert(I18n.resource.observer.widgets.FAIL_BEFORE_EXECUTING+'！');
                return;
            }).always(function () {
                Spinner.stop();
            });

        },

        loadDataSourceRecord: function () {
            var _this = this;
            var dataPanel = $('#dataSrcPanel');

            var groupInfo = _this.m_parent.store.group;
            if (!groupInfo) {
                return;
            }

            _this.m_allGroupList = [];
            _this.m_allPointList = [];
            var itemDefault = null;
            for (var m = 0, n = groupInfo.length; m < n; m++) {
                var groupId = groupInfo[m].groupId;
                var groupName = groupInfo[m].groupName;
                var groupIsDefault = (Boolean(groupInfo[m].isDefault)) ? true : false;
                var data = groupInfo[m].datasourceList;
                var groupItem = {'id':groupId,'name':groupName,'isDefault':groupIsDefault};
                if (groupIsDefault) {
                    itemDefault = groupItem;
                }
                else {
                    _this.m_allGroupList.push(groupItem);
                }

                if (data) {
                    var len = data.length;
                    var item;
                    for (var i = 0; i < len; i++) {
                        item = {
                            userId: AppConfig.userId,
                            userName: AppConfig.account,
                            customName: data[i].alias,
                            prjId: data[i].projId,
                            prjName: _this.getProjectNameFromId(data[i].projId),
                            ptName: data[i].value,
                            ptDesc: data[i].note,
                            iconColor: _this.m_arrProjIdColorMap[data[i].projId],
                            itemId: data[i].id,
                            itemType: data[i].type,
                            itemValue: data[i].value,
                            groupId:groupId,
                            groupName:groupName
                        }
                        if (item.itemType == 1) {
                            item.iconColor = '#000000';
                        }
                        _this.m_allPointList.push(item);
                    }

                    /*
                     var prjName;
                     for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                     item = _this.m_allPointList[i];
                     if (item.itemType == 0) {
                     prjName = _this.getProjectNameFromId(item.prjId);
                     _this.insertIntoDataList(item.customName, item.ptName, item.ptDesc, prjName, item.iconColor, item.itemId, dataPanel, true, false);
                     _this.initToolTips(dataPanel.find('.dsItem').last(), item.customName, prjName, item.ptName, item.ptDesc);
                     }
                     else if (item.itemType == 1) {
                     _this.insertFormula(item.itemId, item.customName, item.iconColor, item.ptName, item.ptDesc);
                     _this.initFormulaToolTips(dataPanel.find('.dsItem').last(), item.customName, item.ptName, item.ptDesc);
                     }
                     }
                     */
                }
            }
            if (itemDefault) {
                _this.m_allGroupList.push(itemDefault);
            }
            _this.insertTreeAllGroupItem(_this.m_allGroupList, _this.m_allPointList);

/*            // insert groups and items
            for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                _this.insertTreeGroup(_this.m_allGroupList[i].id, _this.m_allGroupList[i].name, 0, '');
            }
            for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                var item = _this.m_allPointList[i];
                var bIsPoint = true;
                if (0 == item.itemType) {
                    bIsPoint = true;
                }
                else {
                    bIsPoint = false;
                }

                var parentGroup = $('#' + item.groupId);
                _this.insertTreeItem(parentGroup, item.itemId, item.iconColor, item.customName, 0, '', bIsPoint);

                if (bIsPoint) {
                    var prjName = _this.getProjectNameFromId(item.prjId, _this.m_langFlag);
                    _this.initToolTips($('#'+item.itemId), item.customName, prjName, item.ptName, item.ptDesc);
                }
                else {
                    var showName = _this.getShowNameFromFormula(item.ptName);
                    _this.initFormulaToolTips($('#'+item.itemId), item.customName, showName, item.ptDesc);
                }
            }
*/

            // close all groups except unassigned
            var treeAllHead = $('.dsTreeHeader .dsGroupName');
            var item;
            for (var i = 0, len = treeAllHead.length; i < len; i++) {
                item = treeAllHead.eq(i);
                if (item.text() != _this.m_unassigned) {
                    item.closest('.dsTreeHeader').click();
                }
            }
        },

        getProjectNameFromId: function (id, langFlag) {
            var name;
            var len = AppConfig.projectList.length;
            var item;
            for (var i = 0; i < len; i++) {
                item = AppConfig.projectList[i];
                if (id == item.id) {
                    if (0 == langFlag) {
                        name = item.name_cn;
                    }
                    else {
                        name = item.name_en;
                    }
                    break;
                }
            }

            return name;
        },

        getProjectIdFromName: function (projectName) {
            var id;
            var len = AppConfig.projectList.length;
            var item;
            for (var i = 0; i < len; i++) {
                item = AppConfig.projectList[i];
                if (projectName == item.name_cn) {
                    id = item.id;
                    break;
                }
            }

            return id;
        },

        calUpdateDataSources: function () {
            var _this = this;
            var updateData = [];
            for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                var groupItem = {
                    'groupId': _this.m_allGroupList[i].id,
                    'groupName': _this.m_allGroupList[i].name,
                    'parentId': '',
                    'datasourceList': ''
                };

                var dsList = [];
                for (var j = 0, len2 = _this.m_allPointList.length; j < len2; j++) {
                    var curItem = _this.m_allPointList[j];
                    if (groupItem.groupId == curItem.groupId) {
                        var pushItem = {
                            'id': curItem.itemId,
                            'type': curItem.itemType,
                            'projId': curItem.prjId,
                            'alias': curItem.customName,
                            'note': curItem.ptDesc,
                            'value': curItem.ptName,
                            'groupId': curItem.groupId
                        };
                        dsList.push(pushItem);
                    }
                }
                groupItem.datasourceList = dsList;

                updateData.push(groupItem);
            }

            this.m_parent.updateDataSources(updateData);
        },

        renderFormula: function (_customName, _formulaVal, _formulaDesc) {
            var _this = this;
            var postData;

            if (_this.m_dataSourceId) {
                postData = {
                    datasourceId: _this.m_dataSourceId,
                    itemList: []
                };
            } else {
                postData = {
                    itemList: []
                };
            }

            var prjId = 0;
            var eachItem = {
                type: 1,
                projId: prjId,
                alias: _customName,
                note: _formulaDesc,
                value: _formulaVal,
                groupId: _this.m_selectGroupId
            }
            postData.itemList.push(eachItem);

            WebAPI.post('/analysis/datasource/saveMulti/' + AppConfig.userId, postData).done(function (result) {
                if (result != '') {
                    var data = JSON.parse(result);
                    if (data.id != '') {
                        _this.m_dataSourceId = data.id;
                    }

                    var list = data.itemIdList;
                    var item;
                    for (var i = 0, len = list.length; i < len; i++) {
                        item = {
                            'itemId': list[i].id,
                            'itemType': 1,
                            'customName': list[i].alias,
                            'itemValue': list[i].value,
                            'ptName': list[i].value,
                            'prjId': prjId,
                            'iconColor': '#000000',
                            'ptDesc': _formulaDesc,
                            'groupId': list[i].groupId
                        };
                        _this.m_allPointList.push(item);

                        _this.insertTreeItem($('#'+_this.m_selectGroupId), item.itemId, item.iconColor, item.customName, 0, '', false);

                        var showName = _this.getShowNameFromFormula(list[i].value);
                        _this.initFormulaToolTips($('#'+item.itemId), item.customName, showName, _formulaDesc);
                    }
                    _this.calUpdateDataSources();
                }
            });
        },

        modifyFormula: function (_customName, _formulaVal, _formulaDesc) {
            var _this = this;
            var postData;
            var itemId = _this.m_selectItemId;

            if (_this.m_dataSourceId) {
                postData = {
                    datasourceId: _this.m_dataSourceId,
                    itemList: []
                };
            } else {
                postData = {
                    itemList: []
                };
            }

            var prjId = Number(AppConfig.projectId);
            var eachItem = {
                id: itemId,
                type: 1,
                projId: prjId,
                alias: _customName,
                note: _formulaDesc,
                value: _formulaVal,
                groupId: _this.m_selectGroupId
            }
            postData.itemList.push(eachItem);

            WebAPI.post('/analysis/datasource/saveMulti/' + AppConfig.userId, postData).done(function (result) {
                if (result != '') {
                    var data = JSON.parse(result);
                    if (data.id != '') {
                        _this.m_dataSourceId = data.id;
                    }

                    var list = data.itemIdList;
                    if (list.length > 0) {
                        var showName = list[0].value;
                        var arr = showName.split('<%');
                        for (var j = 0, len2 = arr.length; j < len2; j++) {
                            var id = arr[j].split('%>')[0];
                            if ('' == id) {
                                continue;
                            }

                            var retVal = _this.getDSItemById(id);
                            if (null == retVal) {
                                continue;
                            }

                            showName = showName.replace(id, retVal.value);
                        }
                        showName = showName.replace(/<%/g, '');
                        showName = showName.replace(/%>/g, '');

                        for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                            if (itemId === _this.m_allPointList[i].itemId) {
                                _this.m_allPointList[i].customName = list[0].alias;
                                _this.m_allPointList[i].ptName = list[0].value;
                                _this.m_allPointList[i].ptDesc = list[0].note;
                                break;
                            }
                        }

                        var divFormula = $('#' + itemId);
                        divFormula.find('.showName').text(list[0].alias);
                        _this.setFormulaToolTipsAll(divFormula, list[0].alias, showName, list[0].note);

                        _this.calUpdateDataSources();

                        Beop.cache.ds.remove(itemId);
                    }
                }
            });
        },

        insertFormula: function (itemId, customName, iconColor, formula, desc) {    // useless now
            var _this = this;

            var div = $('<div draggable="true" class="dsItem grow" style="height:34px"></div>');
            div.attr('id', itemId);
            div.click(function (e) {
                _this.clearSelect();

                var tar = $(e.currentTarget);
                if ('dsItem grow' == tar.attr('class')) {
                    tar.attr('class', 'dsItem grow dsSelected');
                }
                else {
                    tar.attr('class', 'dsItem grow');
                }

                _this.stopBubble(e);
            });

            var icon = $('<div class="dsMark"></div>');
            icon.css('background-color', iconColor);
            div.append(icon);

            var name = $('<div class="dsValue" style="height:36px"></div>');
            name.text(customName);
            div.append(name);

            var btnRename = $('<span class="dsBtnRename grow glyphicon glyphicon-wrench"></span>');
            btnRename.click(function (e) {
/*
                    _this.m_selectItemId = $(e.currentTarget).closest('.dsItem').get(0).id;
                    var customName, ptVal, ptDesc, item;
                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        item = _this.m_allPointList[i];
                        if (itemId === item.itemId) {
                            customName = item.customName;
                            ptVal = item.itemValue;
                            ptDesc = item.ptDesc;
                            break;
                        }
                    }
                    WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                        new DataSourceConfigure(_this, 1, false, customName, ptVal, ptDesc).show();
                    }).fail(function (result) {
                    }).always(function (e) {
                    });
*/

                var show = $(e.currentTarget).prevAll('.dsValue');
                show.css('display', 'none');

                var target = $(e.currentTarget).nextAll('.dsDivChange');
                target.attr('class', 'dsDivChange show');
                div.css('height', '240px');
                div.css('width', '100%');

                var item;
                var strName = '';
                var strFormula = '';
                var strDesc = '';
                for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (itemId == item.itemId) {
                        strName = item.customName;
                        strFormula = item.ptName;
                        strDesc = item.ptDesc;
                        break;
                    }
                }
                var temp = target.find('input');
                if (temp.length == 2) {
                    $(temp[0]).val(strName);
                    $(temp[1]).val(strDesc);
                }

                _this.stopBubble(e);

            }).error(function (e) {
            });
            div.append(btnRename);

            var btnRemove = $('<span class="dsBtnRemove grow glyphicon glyphicon-remove-sign"></span>');
            btnRemove.click(function (e) {
                var retCon = confirm(_this.m_lang.REMOVE_CONFIRM);
                if (true === retCon) {
                    var div = $(e.currentTarget).closest('.dsItem');
                    var dataSrcId = _this.m_dataSourceId;
                    var dataSrcItemId = div.attr('id');

                    WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcId + '/' + dataSrcItemId + '/' + AppConfig.userId).done(function (result) {
                        var data = JSON.parse(result);
                        if (Boolean(data.success)) {
                            var len = _this.m_allPointList.length;
                            for (var i = 0; i < len; i++) {
                                if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                    _this.m_allPointList.splice(i, 1);
                                    break;
                                }
                            }
                            _this.calUpdateDataSources();

                            div.tooltip('destroy');
                            div.remove();
                        }
                    }).error(function () {
                    });
                }
            });
            div.append(btnRemove);

            //
            var divChange = $('<div class="dsDivChange"></div>');

            var inputCustName = $('<div class="form-group"><label style="color:#eee">Custom Name</label><input type="text" class="form-control" value="" placeholder="Custom Name"></input></div>');
            inputCustName.find('label').text(_this.m_lang.CUSTOM_NAME);
            var ctlInput = inputCustName.find('input');
            ctlInput.attr('value', customName);
            ctlInput.attr('placeholder', _this.m_lang.CUSTOM_NAME);
            inputCustName.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(inputCustName);

            var ctlFormula = $('<div class="form-group"><label style="color:#eee">' + _this.m_lang.FORMULA_NAME + ': </label></div>');
            var showFormula = $('<span>' + formula + '</span>');
            showFormula.appendTo(ctlFormula.find('label')).mathquill();
            ctlFormula.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(ctlFormula);

            var inputDesc = $('<div class="form-group"><label style="color:#eee">Description</label><input type="text" class="form-control" value="" placeholder="Description"></input></div>');
            inputDesc.find('label').text(_this.m_lang.POINT_DESC);
            ctlInput = inputDesc.find('input');
            ctlInput.attr('value', desc);
            ctlInput.attr('placeholder', _this.m_lang.POINT_DESC);
            inputDesc.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(inputDesc);

            var btnOk = $('<button class="btn btn-default btn-sm" style="position:absolute; right:70px;">OK</button>');
            btnOk.text(_this.m_lang.SURE);
            btnOk.click(function (e) {
                var temp = $(e.currentTarget).closest('.dsDivChange').find('input');
                var strName = $(temp[0]).val();
                var strDesc = $(temp[1]).val();
                var prjId, ptName, item;

                for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (itemId == item.itemId) {
                        prjId = item.prjId;
                        ptName = item.ptName;
                        break;
                    }
                }

                var postData = {
                    datasourceId: _this.m_dataSourceId,
                    itemList: [{
                        id: itemId,
                        type: 1,
                        projId: prjId,
                        alias: strName,
                        note: strDesc,
                        value: ptName,
                        groupId: ''
                    }]
                };

                WebAPI.post('/analysis/datasource/saveMulti/' + AppConfig.userId, postData).done(function (result) {
                    var data = JSON.parse(result);
                    if (0 == data.itemIdList.length) {
                        return;
                    }

                    var id = (data.itemIdList)[0].id;
                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        if (id == _this.m_allPointList[i].itemId) {
                            _this.m_allPointList[i].customName = strName;
                            _this.m_allPointList[i].ptDesc = strDesc;
                            break;
                        }
                    }
                    _this.setToolTipsCustomName(div, strName);
                    _this.setToolTipsDesc(div, strDesc);
                    _this.calUpdateDataSources();
                    $('#'+id).find('.dsValue').text(strName);
                }).error(function (e) {
                });

            });
            divChange.append(btnOk);

            var btnCancel = $('<button class="btn btn-default btn-sm" style="position:absolute; right:15px;">Cancel</button>');
            btnCancel.text(_this.m_lang.CANCEL);
            btnCancel.click(function (e) {
            });
            divChange.append(btnCancel);

            div.append(divChange);


            $('#dataSrcPanel').append(div);
        },

        initFormulaToolTips: function (parent, customName, formula, desc) {
            var _this = this;

            var show = new StringBuilder();
            show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:400px;">');
            show.append('    <div class="tooltipTitle tooltip-inner">GeneralRegressor</div>');
            show.append('    <div class="tooltipContent">');
            show.append('        <p class="customName" style=word-break:break-all;"><span style="font-weight:bold">').append(_this.m_lang.CUSTOM_NAME).append('</span>: ').append(customName).append('</p>');
            show.append('        <p class="formula" style="word-break:normal;"><span style="font-weight:bold">').append(_this.m_lang.FORMULA_NAME).append('</span>: ').append('</p>');
            show.append('        <p class="pointDesc" style="word-break:break-all;"><span style="font-weight:bold">').append(_this.m_lang.POINT_DESC).append('</span>: ').append(desc).append('</p>');
            show.append('    </div>');
            show.append('    <div class="tooltip-arrow"></div>');
            show.append('</div>');

            var showFormula = $('<span>' + formula + '</span>');
            var showObj = $(show.toString());
            showFormula.appendTo(showObj.find('.formula')).mathquill();

            var options = {
                placement: 'left',
                title: _this.m_lang.PARAM,
                template: showObj
            };
            parent.tooltip(options);
        },

        setFormulaToolTipsAll: function (row, customName, formulaVal, formulaDesc) {
            var tip = row.data('bs.tooltip').$tip;
            tip.find('.customName').html('<span style="font-weight:bold">' + this.m_lang.CUSTOM_NAME + '</span>: ' + customName);
            tip.find('.pointDesc').html('<span style="font-weight:bold">' + this.m_lang.POINT_DESC + '</span>: ' + formulaDesc);

            var showFormula = $('<span>' + formulaVal + '</span>');
            var dst = tip.find('.formula').html('<span style="font-weight:bold">' + this.m_lang.FORMULA_NAME + '</span>: ');
            showFormula.appendTo(dst).mathquill();
        },

        checkRepeatWithCustomName: function (_name) {
            var _this = this;
            var bRet = false;

            var grids = $('#dataSrcPanel .dsItem .dsValue');
            $.each(grids, function(i, n) {
                if (_name == $(n).text()) {
                    bRet = true;
                    return false;
                }
            });

            return bRet;
        },

        stopBubble: function (e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        },

        clearSelect: function (e) {
            var itemList = $('#dataSrcPanel .dsItem');
            itemList.attr('class', 'dsItem grow');
            itemList.css('height', '34px');
            itemList.css('width', '33%');

            var panel = $('#dataSrcPanel');
            panel.find('.dsDivChange').attr('class', 'dsDivChange');
            panel.find('.dsValue').css('display', 'inline');
        },

        insertTreeGroup: function (groupId, groupName, type, baseGroup) {
            // type         插入类型，0：尾部插入；1：插入目标位后（baseGroup）；2：插入目标位前（baseGroup）
            // baseGroup    关联 type == 1，插入前的基准Group，插入位置在其后；== 2，插入前的基准Group，插入位置在其前

            var _this = this;
            var divContain = $('#dataSrcPanel');

            var $ul = $('<ul class="nav nav-list tree-group" id="' + groupId + '" draggable="true">');
            //var $liHd = $('<li class="dsTreeHeader"><img src="http://images.rnbtech.com.hk/static/images/dataSource/group_head_sel.png" alt="png" class="dsTreeHeaderIcon"></li>');
            var $liHd = $('<li class="dsTreeHeader"><span class="dsTreeHeaderIcon open"></span></li>');
            var spanName = $('<span class="dsGroupName">' + groupName + '</span>');
            $liHd.append(spanName);

            if (groupName != _this.m_unassigned) {
                var btnRemove = $('<span class="glyphicon glyphicon-remove-sign panel-heading-btn grow dsTreeBtnDel" aria-hidden="true"></span>');
                EventAdapter.on(btnRemove, 'click', function (e) {
                //btnRemove.click(function (e) {
                    var retCon = confirm(_this.m_lang.REMOVE_CONFIRM);
                    if (true === retCon) {
                        if (undefined != _this.m_cfgPanel) {
                            _this.m_cfgPanel.close();
                            _this.m_parent.showAnlsPane();
                        }

                        var div = $(e.currentTarget).closest('.nav');
                        var groupId = div.attr('id');

                        // remove group animation
                        div.css('position', 'relative');
                        div.css('animation', 'dsRemove 3s infinite');
                        div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                        div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                        div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                        WebAPI.get('/datasource/deleteDataSourceGroup/' + AppConfig.userId + '/' + groupId).done(function (result) {
                            var data = JSON.parse(result);
                            if (('successful' == data.error)) {
                                var len = _this.m_allGroupList.length;
                                for (var i = 0; i < len; i++) {
                                    if (groupId == _this.m_allGroupList[i].id) {
                                        _this.m_allGroupList.splice(i, 1);
                                        div.remove();
                                        break;
                                    }
                                }
                                _this.calUpdateDataSources();
                            }
                        }).fail(function (e) {
                        });
                    }
                }).error(function (e) {
                });
                $liHd.append(btnRemove);
            }

            var btnAddDs = $('<span class="glyphicon glyphicon-plus-sign panel-heading-btn grow dsTreeBtnAdd" aria-hidden="true" id="data_source_add"></span>');
            EventAdapter.on(btnAddDs, 'click', function (e) {
            //btnAddDs.click(function (e) {
                var tar = $(e.currentTarget);
                _this.m_selectGroupId = tar.closest('.tree-group').get(0).id;
                _this.stopBubble(e);

                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 0, true, '', '', '', -1);
                    _this.m_cfgPanel.show();
                }).error(function (result) {
                }).always(function (e) {
                });
            });
            $liHd.append(btnAddDs);

            var btnAddFormula = $('<span><img src="http://images.rnbtech.com.hk/static/images/dataSource/formula_add_normal.png" alt="Formula add" class="dsTreeBtnFormula" id="data_source_formula_add" /></span>');
            EventAdapter.on(btnAddFormula, 'click', function (e) {
            //btnAddFormula.click(function (e) {
                var tar = $(e.currentTarget);
                _this.m_selectGroupId = tar.closest('.tree-group').get(0).id;
                _this.stopBubble(e);

                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 1, true, '', '', '', -1);
                    _this.m_cfgPanel.show();
                }).error(function (result) {
                }).always(function (e) {
                });
            });

            btnAddFormula.mouseenter(function (e) {
                var img = btnAddFormula.find('img');
                img.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/formula_add_hover.png');
                img.css('width', '23px');
                img.css('height', '20px');
            }).error(function (e) {
            });
            btnAddFormula.mouseleave(function (e) {
                var img = btnAddFormula.find('img');
                img.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/formula_add_normal.png');
                img.css('width', '21px');
                img.css('height', '19px');
            }).error(function (e) {
            });
            $liHd.append(btnAddFormula);

            if (groupName != _this.m_unassigned) {
                var spanEdit = $('<span class="glyphicon glyphicon-pencil panel-heading-btn grow dsEditGroupName" aria-hidden="true"></span>');
                EventAdapter.on(spanEdit, 'click', function (e) {
                //spanEdit.click(function (e) {
                    var tar = $(e.currentTarget);

                    var groupName = tar.siblings('.dsGroupName');
                    groupName.hide();

                    var input = tar.siblings('.inputEditGroup');
                    input.val(groupName.text());
                    input.show();
                    input.select();

                    tar.siblings('.btn').show();

                    _this.stopBubble(e);
                });
                $liHd.append(spanEdit);

                var inputEdit = $('<input type="text" value="' + groupName + '" class="inputEditGroup">');
                inputEdit.hide();
                EventAdapter.on(inputEdit, 'click', function (e) {
                //inputEdit.click(function (e) {
                    _this.stopBubble(e);
                });
                inputEdit.keyup(function (e) {
                    if (13 == e.keyCode) {
                        var tar = $(e.currentTarget);
                        tar.siblings('button').click();
                    }
                    _this.stopBubble(e);
                });
                $liHd.append(inputEdit);

                var btnEdit = $('<button class="btn btn-default btn-sm" type="submit">Change</button>');
                btnEdit.hide();
                EventAdapter.on(btnEdit, 'click', function (e) {
                //btnEdit.click(function (e) {
                    var tar = $(e.currentTarget);
                    tar.hide();

                    var input = tar.siblings('.inputEditGroup');
                    var newName = input.val();
                    input.hide();

                    var groupName = tar.siblings('.dsGroupName');
                    var oldName = groupName.text();
                    groupName.show();

                    if (oldName != newName && '' != newName) {
                        // do db change
                        var postData = {
                            'groupId': groupId,
                            'name': newName,
                            'parent': '',
                            'userId': AppConfig.userId
                        }
                        WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (result) {
                            var data = JSON.parse(result);
                            if (undefined == data) {
                                return;
                            }
                            if ('successful' == data.error) {
                                for (var i= 0,len=_this.m_allGroupList.length; i<len; i++) {
                                    if (groupId == _this.m_allGroupList[i].id) {
                                        _this.m_allGroupList[i].name = data.groupName;
                                        break;
                                    }
                                }
                                spanName.text(data.groupName);
                            }
                        }).fail(function (e) {
                        });
                    }
                    _this.stopBubble(e);
                });
                $liHd.append(btnEdit);
            }

            EventAdapter.on($liHd, 'click', function (e) {
            //$liHd.click(function (e) {
                divContain.find('.dsTreeBtnCfg').css('display', 'none');
                divContain.find('.dsTreeBtnRemove').css('display', 'none');
                divContain.find('.dsEditGroupName').css('display', 'none');

                var curTarHead = $(e.currentTarget);
                curTarHead.find('.dsTreeBtnRemove').css('display', 'inline');
                _this.m_selectGroupId = curTarHead.closest('.tree-group').get(0).id;

                //var $otherUl = $(this).parent('ul').siblings('ul');
                //$otherUl.find('.rows').slideUp();
                //$otherUl.find('i').removeClass('icon-minus').addClass('icon-plus');
                $(this).next('.rows').slideToggle();
                var icon = $(this).find('.dsTreeHeaderIcon');
                var imgPath = icon.attr('src');
                //if (_this.m_groupIconOpen == imgPath) {
                if (icon.hasClass('open')) {
                    //icon.attr('src', _this.m_groupIconClose);
                    icon.removeClass('open');
                    curTarHead.find('.dsGroupName').css('font-weight', '400');
                    curTarHead.find('.dsTreeBtnFormula').css('display', 'none');
                    curTarHead.find('.dsTreeBtnAdd').css('display', 'none');
                    curTarHead.find('.dsTreeBtnDel').css('display', 'none');
                    curTarHead.find('.dsEditGroupName').css('display', 'none');
                }
                else {
                    //icon.attr('src', _this.m_groupIconOpen);
                    icon.addClass('open');
                    curTarHead.find('.dsGroupName').css('font-weight', '700');
                    curTarHead.find('.dsTreeBtnFormula').css('display', 'inline');
                    curTarHead.find('.dsTreeBtnAdd').css('display', 'inline');
                    curTarHead.find('.dsTreeBtnDel').css('display', 'inline');
                    curTarHead.find('.dsEditGroupName').css('display', 'inline');
                }
                //var $i = $(this).find('i');
                //var toggleClass = (function () {
                //    if ($i.hasClass('icon-minus'))
                //        return 'icon-plus icon-white'
                //    else
                //        return 'icon-minus icon-white'
                //})();
                //$(this).find('i').removeClass().addClass(toggleClass)
            });
            $ul.prepend($liHd);

            var divLiRow = $('<li class="rows"></li>');
            $ul.append(divLiRow);

            if (0 === type) {
                divContain.append($ul);
            }
            else if (1 === type) {
                if ('' != baseGroup) {
                    baseGroup.after($ul);
                }
            }
            else if (2 === type) {
                if ('' != baseGroup) {
                    baseGroup.before($ul);
                }
            }
        },

        insertTreeItem: function (divParentGroup, itemId, iconColor, itemName, insertType, baseItem, bIsPoint) {
            // insertType   0:插入组尾；1：插入目标位后（关联baseItem）；2：插入组头
            // baseItem     关联 insertType == 1，插入前的基准Item，插入位置在其后
            // bIsPoint     true：表示插入是点，false：插入是公式

            var _this = this;
            var div = $('<div class="treeRow ui-draggable" id="' + itemId + '" draggable="true"> ');//html(itemName);

            var icon = $('<div class="dsMark" style="margin-top: -1px"></div>');
            icon.css('background-color', iconColor);
            div.append(icon);

            var divShowName = $('<span class="showName">' + itemName + '</span>');
            EventAdapter.on(divShowName, 'click', function (e) {
            //divShowName.click(function (e) {
                var oldCustName = $(e.currentTarget).text();
                var input = $('<input type="text" value="' + oldCustName + '" style="width:300px;position: absolute;top: 4px">');
                input.blur(function (e) {
                    var newCustName = $(e.currentTarget).val();
                    if (oldCustName != newCustName) {
                        var item, type, prjId, ptName, ptDesc, groupId, postData;
                        for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                            item = _this.m_allPointList[i];
                            if (itemId == item.itemId) {
                                type = item.itemType;
                                prjId = item.prjId;
                                ptName = item.ptName;
                                ptDesc = item.ptDesc;
                                groupId = item.groupId;
                                break;
                            }
                        }
                        if (_this.m_dataSourceId) {
                            postData = {
                                datasourceId: _this.m_dataSourceId,
                                itemList: []
                            };
                        } else {
                            postData = {
                                itemList: []
                            };
                        }
                        var eachItem = {
                            id: itemId,
                            type: type,
                            projId: prjId,
                            alias: newCustName,
                            note: ptDesc,
                            value: ptName,
                            groupId: groupId
                        }
                        postData.itemList.push(eachItem);

                        WebAPI.post('/analysis/datasource/saveMulti/' + AppConfig.userId, postData).done(function (result) {
                            if (result != '') {
                                var data = JSON.parse(result);
                                if (data.id != '') {
                                    _this.m_dataSourceId = data.id;
                                }

                                var list = data.itemIdList;
                                var dstId, dstCustomName;
                                for (var i = 0, len = list.length; i < len; i++) {
                                    dstId = list[i].id;
                                    dstCustomName = list[i].alias;

                                    for (var j = 0, len2 = _this.m_allPointList.length; j < len2; j++) {
                                        if (dstId == _this.m_allPointList[j].itemId) {
                                            _this.m_allPointList[j].customName = dstCustomName;
                                            break;
                                        }
                                    }

                                    divShowName.text(dstCustomName);
                                    _this.setToolTipsCustomName(divShowName.closest('.treeRow'), dstCustomName);
                                }
                                _this.calUpdateDataSources();
                            }
                        });
                    }
                    input.remove();
                    divShowName.css('display', 'inline');
                });
                input.keyup(function (e) {
                    if (13 == e.keyCode) {
                        input.blur();
                    }
                    _this.stopBubble(e);
                });
                divShowName.after(input);
                divShowName.css('display', 'none');
                input.select();
            });
            div.append(divShowName);

            var btnRemove = $('<span class="glyphicon glyphicon-remove-sign panel-heading-btn grow dsTreeBtnRemove" aria-hidden="true"></span>');
            EventAdapter.on(btnRemove, 'click', function (e) {
            //btnRemove.click(function (e) {
                var promise = $.Deferred();
                var div = $(e.currentTarget).closest('.treeRow');
                var dataSrcItemId = div.attr('id');
                var dataSrcId = _this.m_dataSourceId;

                if(typeof _this.m_parent.doSync === 'function') {
                    _this.m_parent.doSync().done(function () {
                        promise.resolve();
                    });
                } else {
                    promise.resolve();
                }

                // start promise
                promise.done(function () {
                    WebAPI.get('/analysis/checkDatasourceBeforeDelete/' + dataSrcItemId + '/' + AppConfig.userId).done(function (result) {
                        var chkData = JSON.parse(result);
                        var nWorkSpLen = chkData.workspaceInfo.length;
                        var nDashBoLen = chkData.dashboardInfo.length;
                        if (nWorkSpLen > 0 || nDashBoLen > 0) {
                            var show = _this.m_lang.REMOVE_CONFIRM_TIPS;
                            var name;
                            for (var i = 0; i < nWorkSpLen; i++) {
                                if (0 == i) {
                                    show += 'workspace: ';
                                }
                                name = chkData.workspaceInfo[i].modalName;
                                name = Boolean(name) ? name : 'Untitled';
                                show += name + ',';
                            }
                            for (var j = 0; j < nDashBoLen; j++) {
                                if (0 == j) {
                                    show += 'dashboard: ';
                                }
                                show += chkData.dashboardInfo[j].modalType + ',';
                            }
                            show += _this.m_lang.REMOVE_CONFIRM;
                            if (false === confirm(show)) {
                                return;
                            }
                            else {
                                if (undefined != _this.m_cfgPanel) {
                                    _this.m_cfgPanel.close();
                                    _this.m_parent.showAnlsPane();
                                }
                            }
                        }

                        // remove item animation
                        div.css('position', 'relative');
                        div.css('animation', 'dsRemove 3s infinite');
                        div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                        div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                        div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                        WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcId + '/' + dataSrcItemId + '/' + AppConfig.userId).done(function (result) {
                            var data = JSON.parse(result);
                            if (Boolean(data.success)) {
                                var len = _this.m_allPointList.length;
                                for (var i = 0; i < len; i++) {
                                    if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                        _this.m_allPointList.splice(i, 1);
                                        break;
                                    }
                                }
                                _this.calUpdateDataSources();

                                div.tooltip('destroy');
                                div.remove();

                                // delete workspace
                                var arr = chkData.workspaceInfo;
                                for (var i= 0,len=arr.length; i<len; i++) {
                                    var divWoSp = $('.divPage');
                                    for (var j= 0,len2=divWoSp.length; j<len2; j++) {
                                        if (arr[i].modalName == divWoSp.eq(j).find('.modalNameSp').text()) {
                                            divWoSp.eq(j).remove();
                                        }
                                    }
                                }

                                Beop.cache.ds.remove(dataSrcItemId);
                            }
                        }).fail(function (e) {
                        });
                    }).fail(function (e) {
                    });
                });
                // end promise
            }).error(function (e) {
            });
            div.append(btnRemove);

            if (bIsPoint) {
                var btnCfg = $('<img src="http://images.rnbtech.com.hk/static/images/dataSource/item_edit.png" alt="png" class="dsTreeBtnCfg">');
                EventAdapter.on(btnCfg, 'click', function (e) {
                //btnCfg.click(function (e) {
                    if (undefined != _this.m_cfgPanel) {
                        _this.m_cfgPanel.close();
                    }
                    var curTar = $(e.currentTarget);
                    _this.m_selectItemId = curTar.closest('.treeRow').get(0).id;
                    _this.m_selectGroupId = curTar.closest('.tree-group').get(0).id;
                    var customName, ptDesc, ptName, item, prjId;
                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        item = _this.m_allPointList[i];
                        if (itemId === item.itemId) {
                            customName = item.customName;
                            ptName = item.ptName;
                            ptDesc = item.ptDesc;
                            prjId = item.prjId;
                            break;
                        }
                    }
                    WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                        _this.m_cfgPanel = new DataSourceConfigure(_this, 0, false, customName, ptName, ptDesc, prjId);
                        _this.m_cfgPanel.show();
                    }).fail(function (result) {
                    }).always(function (e) {
                    });
                }).error(function (e) {
                });

                btnCfg.mouseenter(function (e) {
                    btnCfg.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/item_edit_hover.png');
                    btnCfg.css('width', '18px');
                    btnCfg.css('height', '18px');
                }).error(function (e) {
                });
                btnCfg.mouseleave(function (e) {
                    btnCfg.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/item_edit.png');
                    btnCfg.css('width', '16px');
                    btnCfg.css('height', '16px');
                }).error(function (e) {
                });

                div.append(btnCfg);
            }else{
                var btnCfg = $('<img src="http://images.rnbtech.com.hk/static/images/dataSource/item_edit.png" alt="png" class="dsTreeBtnCfg">');
                EventAdapter.on(btnCfg, 'click', function (e) {
                //btnCfg.click(function (e){
                    if (undefined != _this.m_cfgPanel) {
                        _this.m_cfgPanel.close();
                    }
                    var curTar = $(e.currentTarget);
                    _this.m_selectItemId = curTar.closest('.treeRow').get(0).id;
                    _this.m_selectGroupId = curTar.closest('.tree-group').get(0).id;
                    var customName, ptDesc, ptName, item, prjId;
                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        item = _this.m_allPointList[i];
                        if (itemId === item.itemId) {
                            customName = item.customName;
                            ptName = item.ptName;
                            ptDesc = item.ptDesc;
                            prjId = item.prjId;
                            break;
                        }
                    }
                    WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                        _this.m_cfgPanel = new DataSourceConfigure(_this, 1, false, customName, ptName, ptDesc, prjId);
                        _this.m_cfgPanel.show();
                    }).fail(function (result) {
                    }).always(function (e) {
                    });
                }).error(function (e) {
                });

                btnCfg.mouseenter(function (e) {
                    btnCfg.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/item_edit_hover.png');
                    btnCfg.css('width', '18px');
                    btnCfg.css('height', '18px');
                }).error(function (e) {
                });
                btnCfg.mouseleave(function (e) {
                    btnCfg.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/item_edit.png');
                    btnCfg.css('width', '16px');
                    btnCfg.css('height', '16px');
                }).error(function (e) {
                });
                div.append(btnCfg);
            }

            EventAdapter.on(div, 'click', function (e) {
            //div.click(function (e) {
                var divContain = $('#dataSrcPanel');
                //divContain.find('.tree-group').css('border-style', 'none');
                divContain.find('.dsTreeBtnCfg').css('display', 'none');
                divContain.find('.dsTreeBtnRemove').css('display', 'none');

                var curTarItem = $(e.currentTarget);
                //curTarItem.closest('.tree-group').css('border-style', 'solid');
                curTarItem.find('.dsTreeBtnCfg').css('display', 'inline');
                curTarItem.find('.dsTreeBtnRemove').css('display', 'inline');
                _this.m_selectGroupId = curTarItem.closest('.tree-group').get(0).id;
            });

            if (0 === insertType) {
                divParentGroup.find('.rows').append(div);
            }
            else if (1 === insertType) {
                if ('' != baseItem) {
                    baseItem.after(div);
                }
            }
            else if (2 === insertType) {
                var lyRow = divParentGroup.find('.rows').find('.treeRow');
                if (0 == lyRow.length) {
                    divParentGroup.find('.rows').append(div);
                }
                else {
                    lyRow.eq(0).before(div);
                }
            }
        },

        insertTreeAllGroupItem: function(groupList, pointList) {
            var _this = this;
            var divContain = $('#dataSrcPanel');

            // insert group
            var groupId, groupName, bIsDefault;
            for (var i= 0, len=groupList.length; i<len; i++) {
                groupId = groupList[i].id;
                groupName = groupList[i].name;
                bIsDefault = groupList[i].isDefault;

                var $ul = $('<ul class="nav nav-list tree-group" id="' + groupId + '" draggable="true" dropable="true" isDefault="' + bIsDefault + '">');
                //var $liHd = $('<li class="dsTreeHeader"><img src="http://images.rnbtech.com.hk/static/images/dataSource/group_head_sel.png" alt="png" class="dsTreeHeaderIcon"></li>');
                var $liHd = $('<li class="dsTreeHeader"><span class="dsTreeHeaderIcon open"></span></li>');
                var spanName = $('<span class="dsGroupName">' + groupName + '</span>');
                $liHd.append(spanName);

                if (groupName != _this.m_unassigned) {
                    var btnRemove = $('<span class="glyphicon glyphicon-remove-sign panel-heading-btn grow dsTreeBtnDel" aria-hidden="true"></span>');
                    EventAdapter.on($(btnRemove), 'click',
                        function (e) {
                            var retCon = confirm(_this.m_lang.REMOVE_CONFIRM);
                            if (true === retCon) {
                                if (undefined != _this.m_cfgPanel) {
                                    _this.m_cfgPanel.close();
                                    _this.m_parent.showAnlsPane();
                                }

                                var div = $(e.currentTarget).closest('.nav');
                                var groupId = div.attr('id');

                                // remove group animation
                                div.css('position', 'relative');
                                div.css('animation', 'dsRemove 3s infinite');
                                div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                                div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                                div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                                WebAPI.get('/datasource/deleteDataSourceGroup/' + AppConfig.userId + '/' + groupId).done(function (result) {
                                    var data = JSON.parse(result);
                                    if (('successful' == data.error)) {
                                        var len = _this.m_allGroupList.length;
                                        for (var i = 0; i < len; i++) {
                                            if (groupId == _this.m_allGroupList[i].id) {
                                                _this.m_allGroupList.splice(i, 1);
                                                div.remove();
                                                break;
                                            }
                                        }
                                        _this.calUpdateDataSources();
                                    }
                                }).fail(function (e) {
                                });
                            }
                        }
                    );
                    $liHd.append(btnRemove);
                }

                var btnAddDs = $('<span class="glyphicon glyphicon-plus-sign panel-heading-btn grow dsTreeBtnAdd" aria-hidden="true" id="data_source_add"></span>');
                EventAdapter.on($(btnAddDs), 'click',
                    function (e) {
                        // clear data filter page if exist
                        var $pageFilter = $('#pageDataFilter');
                        if ($pageFilter.length > 0) {
                            $pageFilter.find('#btnCancel').click();
                        }

                        var tar = $(e.currentTarget);
                        _this.m_selectGroupId = tar.closest('.tree-group').get(0).id;
                        _this.stopBubble(e);

                        if (undefined != _this.m_cfgPanel) {
                            _this.m_cfgPanel.close();
                        }
                        WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                            _this.m_cfgPanel = new DataSourceConfigure(_this, 0, true, '', '', '', -1);
                            _this.m_cfgPanel.show();
                        }).error(function (result) {
                        }).always(function (e) {
                        });
                    }
                );
                $liHd.append(btnAddDs);

                var btnAddFormula = $('<span><img src="http://images.rnbtech.com.hk/static/images/dataSource/formula_add_normal.png" alt="Formula add" class="dsTreeBtnFormula" id="data_source_formula_add" /></span>');
                EventAdapter.on($(btnAddFormula), 'click',
                    function (e) {
                        // clear data filter page if exist
                        var $pageFilter = $('#pageDataFilter');
                        if ($pageFilter.length > 0) {
                            $pageFilter.find('#btnCancel').click();
                        }

                        var tar = $(e.currentTarget);
                        _this.m_selectGroupId = tar.closest('.tree-group').get(0).id;
                        _this.stopBubble(e);

                        if (undefined != _this.m_cfgPanel) {
                            _this.m_cfgPanel.close();
                        }
                        WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                            _this.m_cfgPanel = new DataSourceConfigure(_this, 1, true, '', '', '', -1);
                            _this.m_cfgPanel.show();
                        }).error(function (result) {
                        }).always(function (e) {
                        });
                    }
                );

                btnAddFormula.mouseenter(function (e) {
                    var img = btnAddFormula.find('img');
                    img.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/formula_add_hover.png');
                    img.css('width', '23px');
                    img.css('height', '20px');
                }).error(function (e) {
                });
                btnAddFormula.mouseleave(function (e) {
                    var img = btnAddFormula.find('img');
                    img.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/formula_add_normal.png');
                    img.css('width', '21px');
                    img.css('height', '19px');
                }).error(function (e) {
                });
                $liHd.append(btnAddFormula);

                if (groupName != _this.m_unassigned) {
                    var spanEdit = $('<span class="glyphicon glyphicon-pencil panel-heading-btn grow dsEditGroupName" aria-hidden="true"></span>');
                    EventAdapter.on($(spanEdit), 'click',
                        function (e) {
                            var tar = $(e.currentTarget);

                            var groupName = tar.siblings('.dsGroupName');
                            groupName.hide();

                            var input = tar.siblings('.inputEditGroup');
                            input.val(groupName.text());
                            input.show();
                            input.select();

                            tar.siblings('.btn').show();

                            _this.stopBubble(e);
                        }
                    );
                    $liHd.append(spanEdit);

                    var inputEdit = $('<input type="text" value="' + groupName + '" class="inputEditGroup">');
                    inputEdit.hide();
                    EventAdapter.on($(inputEdit), 'click',
                        function (e) {
                            _this.stopBubble(e);
                        }
                    );
                    inputEdit.keyup(function (e) {
                        if (13 == e.keyCode) {
                            var tar = $(e.currentTarget);
                            tar.siblings('button').click();
                        }
                        _this.stopBubble(e);
                    });
                    $liHd.append(inputEdit);

                    var btnEdit = $('<button class="btn btn-default btn-sm" type="submit">Change</button>');
                    btnEdit.hide();
                    EventAdapter.on($(btnEdit), 'click',
                        function (e) {
                            var tar = $(e.currentTarget);
                            tar.hide();

                            var input = tar.siblings('.inputEditGroup');
                            var newName = input.val();
                            input.hide();

                            var groupName = tar.siblings('.dsGroupName');
                            var oldName = groupName.text();
                            groupName.show();

                            if (oldName != newName && '' != newName) {
                                // do db change
                                var ulNav = tar.closest('.nav');
                                var groupId = ulNav.attr('id');
                                var postData = {
                                    'groupId': groupId,
                                    'name': newName,
                                    'parent': '',
                                    'userId': AppConfig.userId
                                }
                                WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (result) {
                                    var data = JSON.parse(result);
                                    if (undefined == data) {
                                        return;
                                    }
                                    if ('successful' == data.error) {
                                        for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                                            if (groupId == _this.m_allGroupList[i].id) {
                                                _this.m_allGroupList[i].name = data.groupName;
                                                break;
                                            }
                                        }
                                        var spanName = ulNav.find('.dsGroupName');
                                        if (Boolean(spanName)) {
                                            spanName.text(data.groupName);
                                        }
                                    }
                                }).fail(function (e) {
                                });
                            }
                            _this.stopBubble(e);
                        }
                    );
                    $liHd.append(btnEdit);
                }

                EventAdapter.on($($liHd), 'click',
                    function (e) {
                        divContain.find('.dsTreeBtnCfg').css('display', 'none');
                        divContain.find('.dsTreeBtnRemove').css('display', 'none');
                        divContain.find('.dsEditGroupName').css('display', 'none');

                        var curTarHead = $(e.currentTarget);
                        curTarHead.find('.dsTreeBtnRemove').css('display', 'inline');
                        _this.m_selectGroupId = curTarHead.closest('.tree-group').get(0).id;

                        $(this).next('.rows').slideToggle();
                        var icon = $(this).find('.dsTreeHeaderIcon');
                        var imgPath = icon.attr('src');
                        //if (_this.m_groupIconOpen == imgPath) {
                        if (icon.hasClass('open')) {
                            //icon.attr('src', _this.m_groupIconClose);
                            icon.removeClass('open');
                            curTarHead.find('.dsGroupName').removeClass('selected');
                            curTarHead.find('.dsTreeBtnFormula').css('display', 'none');
                            curTarHead.find('.dsTreeBtnAdd').css('display', 'none');
                            curTarHead.find('.dsTreeBtnDel').css('display', 'none');
                            curTarHead.find('.dsEditGroupName').css('display', 'none');
                        }
                        else {
                            //icon.attr('src', _this.m_groupIconOpen);
                            icon.addClass('open');
                            curTarHead.find('.dsGroupName').addClass('selected');
                            curTarHead.find('.dsTreeBtnFormula').css('display', 'inline-block');
                            curTarHead.find('.dsTreeBtnAdd').css('display', 'inline');
                            curTarHead.find('.dsTreeBtnDel').css('display', 'inline');
                            curTarHead.find('.dsEditGroupName').css('display', 'inline');
                        }
                    }
                );
                $ul.prepend($liHd);

                var divLiRow = $('<li class="rows"></li>');
                $ul.append(divLiRow);

                // insert points
                var itemId, iconColor, itemName;
                for (var j= 0, len2=pointList.length; j<len2; j++) {
                    if (groupId == pointList[j].groupId) {
                        itemId = pointList[j].itemId;
                        iconColor = pointList[j].iconColor;
                        itemName = pointList[j].customName;

                        var div = $('<div class="treeRow ui-draggable" id="' + itemId + '" draggable="true" dropable="true"> ');
                        var icon = $('<div class="dsMark" style="margin-top: -1px"></div>');
                        icon.css('background-color', iconColor);
                        div.append(icon);

                        var divShowName = $('<span class="showName">' + itemName + '</span>');
                        EventAdapter.on($(divShowName), 'click',
                            function (e) {
                                var divCurShowName = $(e.currentTarget);
                                var oldCustName = divCurShowName.text();
                                var selItemId = divCurShowName.closest('.treeRow').attr('id');
                                var input = $('<input type="text" value="' + oldCustName + '" style="width:300px;position: absolute;top: 4px">');
                                input.blur(function (e) {
                                    var newCustName = $(e.currentTarget).val();
                                    if (oldCustName != newCustName) {
                                        var item, type, prjId, ptName, ptDesc, groupId, postData;
                                        for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                                            item = _this.m_allPointList[i];
                                            if (selItemId == item.itemId) {
                                                type = item.itemType;
                                                prjId = item.prjId;
                                                ptName = item.ptName;
                                                ptDesc = item.ptDesc;
                                                groupId = item.groupId;
                                                break;
                                            }
                                        }
                                        if (_this.m_dataSourceId) {
                                            postData = {
                                                datasourceId: _this.m_dataSourceId,
                                                itemList: []
                                            };
                                        } else {
                                            postData = {
                                                itemList: []
                                            };
                                        }
                                        var eachItem = {
                                            id: selItemId,
                                            type: type,
                                            projId: prjId,
                                            alias: newCustName,
                                            note: ptDesc,
                                            value: ptName,
                                            groupId: groupId
                                        }
                                        postData.itemList.push(eachItem);

                                        WebAPI.post('/analysis/datasource/saveMulti/' + AppConfig.userId, postData).done(function (result) {
                                            if (result != '') {
                                                var data = JSON.parse(result);
                                                if (data.id != '') {
                                                    _this.m_dataSourceId = data.id;
                                                }

                                                var list = data.itemIdList;
                                                var dstId, dstCustomName;
                                                for (var i = 0, len = list.length; i < len; i++) {
                                                    dstId = list[i].id;
                                                    dstCustomName = list[i].alias;

                                                    for (var j = 0, len2 = _this.m_allPointList.length; j < len2; j++) {
                                                        if (dstId == _this.m_allPointList[j].itemId) {
                                                            _this.m_allPointList[j].customName = dstCustomName;
                                                            break;
                                                        }
                                                    }

                                                    divCurShowName.text(dstCustomName);
                                                    _this.setToolTipsCustomName(divCurShowName.closest('.treeRow'), dstCustomName);
                                                }
                                                _this.calUpdateDataSources();
                                            }
                                        });
                                    }
                                    input.remove();
                                    divCurShowName.css('display', 'inline');
                                });
                                input.keyup(function (e) {
                                    if (13 == e.keyCode) {
                                        input.blur();
                                    }
                                    _this.stopBubble(e);
                                });
                                divCurShowName.after(input);
                                divCurShowName.css('display', 'none');
                                input.select();
                            }
                        );
                        div.append(divShowName);

                        var btnRemove = $('<span class="glyphicon glyphicon-remove-sign panel-heading-btn grow dsTreeBtnRemove" aria-hidden="true"></span>');
                        EventAdapter.on($(btnRemove), 'click',
                            function (e) {
                                var promise = $.Deferred();
                                var div = $(e.currentTarget).closest('.treeRow');
                                var dataSrcItemId = div.attr('id');
                                var dataSrcId = _this.m_dataSourceId;

                                if(typeof _this.m_parent.doSync === 'function') {
                                    _this.m_parent.doSync().done(function () {
                                        promise.resolve();
                                    });
                                } else {
                                    promise.resolve();
                                }

                                Spinner.spin(div[0]);
                                // promise start
                                promise.done(function () {
                                    WebAPI.get('/analysis/checkDatasourceBeforeDelete/' + dataSrcItemId + '/' + AppConfig.userId).done(function (result) {
                                        var chkData = JSON.parse(result);
                                        var nWorkSpLen = chkData.workspaceInfo.length;
                                        var nDashBoLen = chkData.dashboardInfo.length;
                                        if (nWorkSpLen > 0 || nDashBoLen > 0) {
                                            var show = _this.m_lang.REMOVE_CONFIRM_TIPS;
                                            var name;
                                            for (var i = 0; i < nWorkSpLen; i++) {
                                                if (0 == i) {
                                                    show += 'workspace: ';
                                                }
                                                name = chkData.workspaceInfo[i].modalName;
                                                name = Boolean(name) ? name : 'Untitled';
                                                show += name + ',';
                                            }
                                            for (var j = 0; j < nDashBoLen; j++) {
                                                if (0 == j) {
                                                    show += 'dashboard: ';
                                                }
                                                show += chkData.dashboardInfo[j].modalType + ',';
                                            }
                                            show += _this.m_lang.REMOVE_CONFIRM;
                                            if (false === confirm(show)) {
                                                return;
                                            }
                                            else {
                                                if (undefined != _this.m_cfgPanel) {
                                                    _this.m_cfgPanel.close();
                                                    _this.m_parent.showAnlsPane();
                                                }
                                            }
                                        }

                                        // remove item animation
                                        div.css('position', 'relative');
                                        div.css('animation', 'dsRemove 3s infinite');
                                        div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                                        div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                                        div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                                        WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcId + '/' + dataSrcItemId + '/' + AppConfig.userId).done(function (result) {
                                            var data = JSON.parse(result);
                                            if (Boolean(data.success)) {
                                                var len = _this.m_allPointList.length;
                                                for (var i = 0; i < len; i++) {
                                                    if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                                        _this.m_allPointList.splice(i, 1);
                                                        break;
                                                    }
                                                }
                                                _this.calUpdateDataSources();

                                                div.tooltip('destroy');
                                                div.remove();

                                                // delete workspace
                                                var arr = chkData.workspaceInfo;
                                                for (var i= 0,len=arr.length; i<len; i++) {
                                                    var divWoSp = $('.divPage');
                                                    for (var j= 0,len2=divWoSp.length; j<len2; j++) {
                                                        if (arr[i].modalName == divWoSp.eq(j).find('.modalNameSp').text()) {
                                                            divWoSp.eq(j).remove();
                                                        }
                                                    }
                                                }

                                                Beop.cache.ds.remove(dataSrcItemId);
                                            }
                                        }).fail(function (e) {
                                        });
                                    }).fail(function (e) {
                                    }).always(function (e) {
                                        Spinner.stop();
                                    });
                                });
                                // promise end
                            }
                        );
                        div.append(btnRemove);

                        var bIsPoint = (0 == pointList[j].itemType) ? true : false;
                        if (bIsPoint) {
                            var btnCfg = $('<img src="http://images.rnbtech.com.hk/static/images/dataSource/item_edit.png" alt="png" class="dsTreeBtnCfg">');
                            EventAdapter.on($(btnCfg), 'click',
                                function (e) {
                                    // clear data filter page if exist
                                    var $pageFilter = $('#pageDataFilter');
                                    if ($pageFilter.length > 0) {
                                        $pageFilter.find('#btnCancel').click();
                                    }

                                    if (undefined != _this.m_cfgPanel) {
                                        _this.m_cfgPanel.close();
                                    }
                                    var curTar = $(e.currentTarget);
                                    _this.m_selectItemId = curTar.closest('.treeRow').get(0).id;
                                    _this.m_selectGroupId = curTar.closest('.tree-group').get(0).id;
                                    var customName, ptDesc, ptName, item, prjId;
                                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                                        item = _this.m_allPointList[i];
                                        if (itemId === item.itemId) {
                                            customName = item.customName;
                                            ptName = item.ptName;
                                            ptDesc = item.ptDesc;
                                            prjId = item.prjId;
                                            break;
                                        }
                                    }
                                    WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                                        _this.m_cfgPanel = new DataSourceConfigure(_this, 0, false, customName, ptName, ptDesc, prjId);
                                        _this.m_cfgPanel.show();
                                    }).fail(function (result) {
                                    }).always(function (e) {
                                    });
                                }
                            );

                            btnCfg.mouseenter(function (e) {
                                btnCfg.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/item_edit_hover.png');
                                btnCfg.css('width', '18px');
                                btnCfg.css('height', '18px');
                            }).error(function (e) {
                            });
                            btnCfg.mouseleave(function (e) {
                                btnCfg.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/item_edit.png');
                                btnCfg.css('width', '16px');
                                btnCfg.css('height', '16px');
                            }).error(function (e) {
                            });

                            div.append(btnCfg);
                        }else{
                            var btnCfg = $('<img src="http://images.rnbtech.com.hk/static/images/dataSource/item_edit.png" alt="png" class="dsTreeBtnCfg">');
                            EventAdapter.on($(btnCfg), 'click',
                                function (e){
                                    // clear data filter page if exist
                                    var $pageFilter = $('#pageDataFilter');
                                    if ($pageFilter.length > 0) {
                                        $pageFilter.find('#btnCancel').click();
                                    }

                                    if (undefined != _this.m_cfgPanel) {
                                        _this.m_cfgPanel.close();
                                    }
                                    var curTar = $(e.currentTarget);
                                    _this.m_selectItemId = curTar.closest('.treeRow').get(0).id;
                                    _this.m_selectGroupId = curTar.closest('.tree-group').get(0).id;
                                    var customName, ptDesc, ptName, item, prjId;
                                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                                        item = _this.m_allPointList[i];
                                        if (itemId === item.itemId) {
                                            customName = item.customName;
                                            ptName = item.ptName;
                                            ptDesc = item.ptDesc;
                                            prjId = item.prjId;
                                            break;
                                        }
                                    }
                                    WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                                        _this.m_cfgPanel = new DataSourceConfigure(_this, 1, false, customName, ptName, ptDesc, prjId);
                                        _this.m_cfgPanel.show();
                                    }).fail(function (result) {
                                    }).always(function (e) {
                                    });
                                }
                            );

                            btnCfg.mouseenter(function (e) {
                                btnCfg.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/item_edit_hover.png');
                                btnCfg.css('width', '18px');
                                btnCfg.css('height', '18px');
                            }).error(function (e) {
                            });
                            btnCfg.mouseleave(function (e) {
                                btnCfg.attr('src', 'http://images.rnbtech.com.hk/static/images/dataSource/item_edit.png');
                                btnCfg.css('width', '16px');
                                btnCfg.css('height', '16px');
                            }).error(function (e) {
                            });
                            div.append(btnCfg);
                        }

                        EventAdapter.on($(div), 'click',
                            function (e) {
                                var divContain = $('#dataSrcPanel');
                                divContain.find('.dsTreeBtnCfg').css('display', 'none');
                                divContain.find('.dsTreeBtnRemove').css('display', 'none');

                                var curTarItem = $(e.currentTarget);
                                curTarItem.find('.dsTreeBtnCfg').css('display', 'inline');
                                curTarItem.find('.dsTreeBtnRemove').css('display', 'inline');
                                _this.m_selectGroupId = curTarItem.closest('.tree-group').get(0).id;
                            }
                        );

                        $ul.find('.rows').append(div);

                        // init tips
                        if (bIsPoint) {
                            var prjName = _this.getProjectNameFromId(pointList[j].prjId, _this.m_langFlag);
                            _this.initToolTips(div, pointList[j].customName, prjName, pointList[j].ptName, pointList[j].ptDesc);
                        }
                        else {
                            var showName = _this.getShowNameFromFormula(pointList[j].ptName);
                            _this.initFormulaToolTips(div, pointList[j].customName, showName, pointList[j].ptDesc);
                        }
                    }
                }

                divContain.append($ul);
            }
        },

        getDSItemById: function (datasourceItemId) {
            if (undefined != this.m_parent.store.group) {
                var itemGroup, lenItem;
                for (var i = 0, len = this.m_parent.store.group.length; i < len; i++) {
                    itemGroup = this.m_parent.store.group[i];
                    lenItem = itemGroup.datasourceList.length;
                    for (var j = 0; j < lenItem; j++) {
                        if (datasourceItemId == itemGroup.datasourceList[j].id) {
                            return itemGroup.datasourceList[j];
                        }
                    }
                }
            }
            if (undefined != this.m_parent.store.dsInfoList) {
                var itemInfo;
                for (var i = 0, len = this.m_parent.store.dsInfoList.length; i < len; i++) {
                    itemInfo = this.m_parent.store.dsInfoList[i];
                    if (datasourceItemId == itemInfo.id) {
                        return itemInfo;
                    }
                }
            }
            //alert(I18n.resource.dataSource.ERROR);
            return {};
        },

        
        getDSItemData: function (target, arrDSItemIds) {
            var _this = this.m_parent;

            var tmStart = _this.curModal.startTime.toDate();
            var tmEnd = _this.curModal.endTime.toDate();
            var tmFmt = _this.curModal.format;

            var key;
            // 新增"回归"和"预测"点的判定
            var preloadIds = [];
            var row = null, arrId;
            // 在这里拷贝一份，这点很重要
            var ids = arrDSItemIds.concat();

            var postData = {
                //dataSourceId: AppConfig.datasource.getId(),
                dsItemIds: ids,
                timeStart: tmStart.format('yyyy-MM-dd HH:mm:ss'),
                timeEnd: tmEnd.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: tmFmt
            };

            var promise = $.Deferred();

            // find in cache
            // notice that the ids may be changed in this call
            Beop.cache.ds.getBatch(ids, tmFmt, tmStart, tmEnd).done(function (rs) {
                promise.resolve(rs);
            }).fail(function (e) {
                console.warn(e);
                promise.reject();
            });

            promise.always(function (rs) {
                var idsNotFound, cacheData;
                if(rs) {
                    idsNotFound = rs.idsNotFound;
                    cacheData = rs.data;

                    if (idsNotFound.length > 0) {
                        postData.dsItemIds = idsNotFound;
                    } else {
                        target.spinnerStop();
                        target.renderModal(cacheData);
                        return;
                    }
                }

                WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function (result) {
                    var data = JSON.parse(result);
                    if(data.error && data.error.length > 0) {
                        target.errAlert(data.error);
                        target.spinnerStop();
                        return;
                    }
                    Beop.cache.ds.set( data, tmFmt, tmStart, tmEnd ).done(function () {
                        // combine with cacheData
                        if( cacheData !== null ) {
                            data = {
                                list: data.list.concat(cacheData.list),
                                timeShaft: data.timeShaft
                            };
                        }
                        
                    }).fail(function (e) {
                        console.warn(e);
                    }).always(function () {
                        target.renderModal(data);
                    });
                    
                }).error(function (e) {
                    _this.paneCenter.spinnerStop();
                    _this.alertNoData();
                });
            });

        },

        getDSItemDataMulti: function (target, arrDSItemIds) {
            var _this = this.m_parent;
            _this.curModal.arrComparePeriodLabel = [];

            var tmStart = _this.curModal.startTime;
            tmStart = tmStart.length <= 10 ? tmStart + ' 00:00:00': tmStart;
            var tmEnd = _this.curModal.endTime;
            tmEnd = tmEnd.length <= 10 ? tmEnd + ' 00:00:00': tmEnd;
            var tmFmt = _this.curModal.format;
            var comparePeriod = _this.curModal.comparePeriod;

            var period1, period2, time;
            var startDate = new Date(tmStart);
            var endDate = new Date(tmEnd);
            var compareDateI18n = I18n.resource.analysis.historyCompare;
            if(comparePeriod == 'hour'){
                time = 3600000;//60 * 60 * 1000;
                period1 = new Date(startDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');
                period2 = new Date(endDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');

                _this.curModal.arrComparePeriodLabel.push(startDate.getFullYear()+'-'+(startDate.getMonth()+1) + '-'+ startDate.getDate()+' '+startDate.getHours()+':00');
                _this.curModal.arrComparePeriodLabel.push(endDate.getFullYear()+'-'+(endDate.getMonth()+1) + '-'+ endDate.getDate()+' '+endDate.getHours()+':00');
            }
            if(comparePeriod == 'day'){
                time = 86400000;//24 * 60 * 60 * 1000;
                period1 = new Date(startDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');
                period2 = new Date(endDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');
                _this.curModal.arrComparePeriodLabel.push(startDate.getFullYear()+'-'+(startDate.getMonth()+1) + '-'+ startDate.getDate());
                _this.curModal.arrComparePeriodLabel.push(endDate.getFullYear()+'-'+(endDate.getMonth()+1) + '-'+ endDate.getDate());
            }
            if(comparePeriod == 'week'){
                time = 604800000;//7 * 24 * 60 * 60 * 1000;
                period1 = new Date(startDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');
                period2 = new Date(endDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');

                _this.curModal.arrComparePeriodLabel.push(compareDateI18n.YEAR_WEEK.replace('<%year%>',startDate.getFullYear()).replace('<%week%>',getWeekNumber(tmStart)));
                _this.curModal.arrComparePeriodLabel.push(compareDateI18n.YEAR_WEEK.replace('<%year%>',endDate.getFullYear()).replace('<%week%>',getWeekNumber(tmEnd)));
            }
            if(comparePeriod == 'month'){
                period1 = getCurrentMonthLastDay(tmStart);
                period2 = getCurrentMonthLastDay(tmEnd);
                function getCurrentMonthLastDay(date){
                    var current=date.toDate();
                    var currentMonth = current.getMonth();
                    var nextMonth =++currentMonth;
                    var nextMonthDayOne =new Date(current.getFullYear(),nextMonth,1);
                    return new Date(nextMonthDayOne.getTime());
                }
                _this.curModal.arrComparePeriodLabel.push(startDate.getFullYear()+'-'+(startDate.getMonth()+1));
                _this.curModal.arrComparePeriodLabel.push(endDate.getFullYear()+'-'+(endDate.getMonth()+1));
            }

            var postData = [{
                dsItemIds: arrDSItemIds,
                timeStart: tmStart.format('yyyy-MM-dd HH:mm:ss'),
                timeEnd: period1.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: tmFmt
            },{
                dsItemIds: arrDSItemIds,
                timeStart: tmEnd.format('yyyy-MM-dd HH:mm:ss'),
                timeEnd: period2.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: tmFmt
            }];

            var ItemKey = 'anal_' + tmFmt + '_' + arrDSItemIds[0];

            WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', postData).done(function (result) {
                var data = JSON.parse(result);
                if(data.error && data.error.length > 0) {
                    target.errAlert(data.error);
                    target.spinnerStop();
                    return;
                }
                sessionStorage.setItem(ItemKey, result);
                target.renderModal(data);
            }).error(function (e) {
                _this.paneCenter.spinnerStop();
                _this.alertNoData();
            });


            /**
             * 判断年份是否为润年
             */
            function isLeapYear(year) {
                return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
            }
            /**
             * 获取某一年份的某一月份的天数
             */
            function getMonthDays(year, month) {
                return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
            }
            /**
             * 获取某年的某天是第几周
             */
            function getWeekNumber(date) {
                var now = date.toDate(),
                    year = now.getFullYear(),
                    month = now.getMonth(),
                    days = now.getDate();
                //那一天是那一年中的第多少天
                for (var i = 0; i < month; i++) {
                    days += getMonthDays(year, i);
                }

                //那一年第一天是星期几
                var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

                var week = null;
                if (yearFirstDay == 1) {
                    week = Math.ceil(days / yearFirstDay);
                } else {
                    days -= (7 - yearFirstDay + 1);
                    week = Math.ceil(days / 7) + 1;
                }

                return week;
            }
        },

        getShowNameFromFormula: function (formula) {
            var _this = this;
            var inputStr = formula;
            var nStart = inputStr.indexOf('<%');
            var nEnd = inputStr.indexOf('%>');
            if (-1 == nStart || -1 == nEnd) {
                return inputStr;
            }

            var id = inputStr.substring(nStart + 2, nEnd);
            if ('' == id) {
                return _this.getShowNameFromFormula(inputStr);
            }

            var retVal = _this.getDSItemById(id);
            if (null == retVal) {
                return _this.getShowNameFromFormula(inputStr);
            }

            inputStr = inputStr.replace('<%' + id + '%>', retVal.value);
            return _this.getShowNameFromFormula(inputStr);

            //var showName = formula;
            //var arr = showName.split('<%');
            //for (var k = 0, len2 = arr.length; k < len2; k++) {
            //    var id = arr[k].split('%>')[0];
            //    if ('' == id) {
            //        continue;
            //    }
            //    var retVal = _this.getDSItemById(id);
            //    if (null == retVal) {
            //        continue;
            //    }
            //    showName = showName.replace(id, retVal.value);
            //}
            //showName = showName.replace(/<%/g, '');
            //showName = showName.replace(/%>/g, '');
            //return showName;
        },

        addNewGroup: function () {
            var groupName = $('#inputAddGroup').val();
            if ('' == groupName) {
                return;
            }

            var _this = this;
            var postData = {
                'groupId': '',
                'name': groupName,
                'parent': '',
                'userId': AppConfig.userId
            }
            WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (result) {
                var data = JSON.parse(result);
                if (!data) {
                    return;
                }

                var groupId = data.groupId;
                if (groupId) {
                    var bIsFind = false;
                    for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                        if (groupId === _this.m_allGroupList[i].id) {
                            bIsFind = true;
                            break;
                        }
                    }
                    if (!bIsFind) {
                        _this.m_allGroupList.push({'id': groupId, 'name': data.groupName, 'isDefault':false});
                        var ulCnt = $('#dataSrcPanel').find('ul').length;
                        if (ulCnt > 1) {
                            var defaultGroup = $('#dataSrcPanel ul[isDefault=true]').eq(0);
                            if (defaultGroup && defaultGroup.length > 0) {
                                _this.insertTreeGroup(data.groupId, data.groupName, 1, defaultGroup.prev());
                            }
                            else {
                                _this.insertTreeGroup(data.groupId, data.groupName, 0, null);
                            }
                        }
                        else {
                            var defaultGroup = $('#dataSrcPanel ul[isDefault=true]').eq(0);
                            if (defaultGroup && defaultGroup.length > 0) {
                                _this.insertTreeGroup(data.groupId, data.groupName, 2, defaultGroup.prev());
                            }
                            else {
                                _this.insertTreeGroup(data.groupId, data.groupName, 0, null);
                            }

                        }
                        $('#' + data.groupId).find('.dsTreeHeader').click();
                    }
                    $('#inputAddGroup').val('');
                }
            }).fail(function (result) {
            }).always(function (e) {
            });
        }
    }

    return DataSource;
})();
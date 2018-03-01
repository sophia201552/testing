var PointToAnalysis = (function () {
    var _this;
    function PointToAnalysis(bPtHasId, pointIdList, pointNameList) {
        // bPtHasId: true-传id，对应参数pointIdList；false-传name，对应参数pointNameList
        // pointIdList: id列表
        // pointNameList: name列表
        _this = this;
        this.bPointHasId = bPtHasId;
        this.arrDs = [];
        this.groupInfo = undefined;
        if (bPtHasId) {
            var arrItem = [];
        
            arrItem = AppConfig.datasource.getDSItemById(pointIdList);
            for (var i= 0,len=pointIdList.length; i<len; i++) {
                var id = pointIdList[i];
                for (var m = 0; m < arrItem.length; m++) {
                    if (id == arrItem[m].id) {
                        this.arrDs.push({'id':pointIdList[i].name, 'name':pointIdList[i].description});
                        break;
                    }
                }
                this.arrDs.push({'id':id, 'name':AppConfig.datasource.getDSItemById(id).alias});
            }
        }
        else {
            for (var i= 0,len=pointNameList.length; i<len; i++) {
                this.arrDs.push({'id':null, 'name':pointNameList[i].name,value:pointNameList[i].description});
            }
        }
    }
    PointToAnalysis.prototype.show = function () {
        if (this.bPointHasId) {
            domPanelContent = document.getElementById('paneCenter');
        }
        else {
            var domTemp = document.getElementById('divObserverCanvas');
            if (!domTemp) {
                domTemp = document.getElementById('paneCenter');
            }
            domPanelContent = domTemp;
        }

        if (domPanelContent) {
            //Spinner.spin(domPanelContent);
        }
        var html=`<div class="modal">\
        <div class="modal-dialog modal-lg" style="margin-top: 100px;">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                    <h4 class="modal-title">${I18n.resource.modalJumpPages.IMPORT_PAGE}</h4>\
                </div>\
                <div class="modal-body bodyContain">\
                    <div class="row">\
                        <form>\
                            <div class="form-group">\
                                <label for="selectGroup">${I18n.resource.modalJumpPages.GROUP_LIST}</label>\
                                <select id="selectGroup" class="form-control"></select>\
                            </div>\
                            <input type="text" class="form-control" id="inputNewGroup" placeholder="New group name" style="display:none;">\
                        </form>\
                    </div>\
                    <div class="row" style="margin-top: 20px;">\
                        <label >${I18n.resource.modalJumpPages.POINT_LIST}</label>\
                        <button class="btn btn-default" id="btnSelAll" type="button">${I18n.resource.modalJumpPages.SELECT_ALL}</button>\
                        <button class="btn btn-default" id="btnSelRevert" type="button">${I18n.resource.modalJumpPages.SELECT_REVERT}</button>\
                    </div>\
                    <div class="row" style="margin-top: 20px;">\
                        <div id="ptList" style="height: calc(100%);overflow-y: auto;"></div>\
                    </div>\
                    <div class="row" style="margin-top: 20px;position: relative;float: right;">\
                        <button class="btn btn-default" type="button"  id="btnImportNoJump" style="width:120px;">${I18n.resource.modalJumpPages.CANCEL}</button>\
                        <button class="btn btn-primary" type="button"  id="btnImportJump" style="width:120px;">${I18n.resource.modalJumpPages.SURE}</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>`;
            _this.$wrap = $('<div class="modal-db-history-wrap" id="modalJumpPageWrap" style="z-index: 1051;">').appendTo(document.body).html(html);
            _this.$modal = _this.$wrap.children('.modal');
            _this.$modal.modal('show');

            if (_this.bPointHasId) {
                if (!(AppConfig.datasource && AppConfig.datasource.m_parent && AppConfig.datasource.m_parent.store && AppConfig.datasource.m_parent.store.group)) {
                    WebAPI.get('/analysis/datasource/getDsItemInfo/' + AppConfig.userId + '/null').done(function (result) {
                        var arrGroupInfo = [];
                        for (var i = 0, len = result.length; i < len; i++) {
                            if (result[i].isParent) {
                                arrGroupInfo.push(result[i]);
                            }
                        }
                        AppConfig.datasource.m_parent.store.group = arrGroupInfo;
                        _this.groupInfo = arrGroupInfo;
                        _this.init();
                    }).always(function (e) {
                    });
                }
                else {
                    _this.groupInfo = AppConfig.datasource.m_parent.store.group;
                    _this.init();
                }
            }
            else {
                WebAPI.get('/analysis/datasource/getDsItemInfo/' + AppConfig.userId + '/null').done(function (result) {
                    //获取文件名称
                    var arrGroupInfo = [];
                    for (var i = 0, len = result.length; i < len; i++) {
                        if (result[i].isParent) {
                            arrGroupInfo.push(result[i]);
                        }
                    }
                    _this.groupInfo = arrGroupInfo;
                    _this.init();
                }).always(function (e) {
                });
            }
    };
    PointToAnalysis.prototype.init = function () {
        I18n.fillArea(this.$modal);
        this.$divPtList = $('#ptList', this.$modal);
        this.$selGroup = $('#selectGroup', this.$modal);
        this.$btnImportJump = $('#btnImportJump', this.$modal);
        this.$btnImportNoJump = $('#btnImportNoJump', this.$modal);
        this.$inputNewGroup = $('#inputNewGroup', this.$modal);
        this.$btnSelAll = $('#btnSelAll', this.$modal);
        this.$btnSelRevert = $('#btnSelRevert', this.$modal);

        // 初始化 point list
        this.initPointList();

        // 初始化 combobox
        this.initComboBox();

        // 添加事件
        this.attachEvents();
    };
    PointToAnalysis.prototype.initPointList = function () {
        //添加导出点的checkbox
        this.$divPtList.empty();
        var item;
        for (var i= 0,len=this.arrDs.length; i<len; i++) {
            item = $('<label class="checkboxShow"><input type="checkbox" value="' + this.arrDs[i].id + '" checked data-name="'+this.arrDs[i].name+'">' + this.arrDs[i].value + '</label>');
            this.$divPtList.append(item);
        }
    };
    PointToAnalysis.prototype.initComboBox = function () {
        this.$selGroup.empty();
        var itemNew = $('<option value="new" style="color:#0000ff;font-weight:900;">' + I18n.resource.modalJumpPages.NEW_GROUP + '</option>');
        this.$selGroup.append(itemNew);
        for (var i= 0,len=this.groupInfo.length; i<len; i++) {
            var item = $('<option value="' + this.groupInfo[i].id + '">' + this.groupInfo[i].alias + '</option>');
            this.$selGroup.append(item);
        }
        _this.$inputNewGroup.css('display', 'block');
        this.$selGroup.click(function (e) {
            var selGroupVal = _this.$selGroup.find("option:selected")[0].value;
            if ('new' == selGroupVal) {
                _this.$inputNewGroup.css('display', 'block');
            }
            else {
                _this.$inputNewGroup.css('display', 'none');
            }
        });
        this.$inputNewGroup.attr('placeholder', 'new');
    };
    PointToAnalysis.prototype.attachEvents = function () {
        this.$btnImportJump.off().click(function (e) {
            _this.importFunc(true);
            trackEvent('Dashboard加入数据源跳转点击','Dashboard.AddSource.Jump.Click');
        });
        this.$btnImportNoJump.off().click(function (e) {
            _this.importFunc(false);
            trackEvent('Dashboard加入数据源不跳转点击','Dashboard.AddSource.NoJump.Click');

        });
        this.$btnSelAll.off().click(function (e) {
            var $checkBox = _this.$divPtList.find('input');
            if ($checkBox.length > 0) {
                $checkBox.prop('checked', true);
            }
        });
        this.$btnSelRevert.off().click(function (e) {
            var $checkBox = _this.$divPtList.find('input');
            for (var i = 0, len = $checkBox.length; i < len; i++) {
                var item = $checkBox.eq(i);
                if (item.prop('checked')) {
                    item.removeAttr('checked');
                }
                else {
                    item.prop('checked', true);
                }
            }
        });
    };
    PointToAnalysis.prototype.insertItemIntoGroup = function (groupId, arrPoint, bIsJump) {
        var postData = {
            itemList: []
        };
        var arrItemList = [];
        if (this.bPointHasId) {
            var arrId = [];
            for (var n = 0; n < arrPoint.length; n++) {
                arrId.push(arrPoint[n].id);
            }
            var arrItem = [];
            arrItem = AppConfig.datasource.getDSItemById(arrId);
            for (var i = 0, len = arrPoint.length; i<len; i++) {
                for (var m = 0; m < arrItem.length; m++) {
                    if (arrPoint[i].id == arrItem[m].id) {
                        var dsItem = {};
                        var temp = arrItem[m];
                        dsItem.alias = temp.alias;
                        dsItem.groupId = groupId;
                        dsItem.note = temp.note;
                        dsItem.projId = temp.projId;
                        dsItem.type = temp.type;
                        dsItem.value = temp.value;
                        arrItemList.push(dsItem);
                        break;
                    }
                }
            }

        }
        else {
            for (var i = 0, len = arrPoint.length; i<len; i++) {
                var dsItem = {};
                var ptName = arrPoint[i].name;
                dsItem.alias = arrPoint[i].value;
                dsItem.groupId = groupId;
                dsItem.note = '';
                dsItem.projId = AppConfig.projectId;
                dsItem.type = 0;
                dsItem.value = ptName;
                arrItemList.push(dsItem);
            }
        }
        postData.itemList = arrItemList;
        WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (result) {
            var itemList = result.itemIdList;
            var bSuccess = false;
            if (itemList.length > 0) {
                bSuccess = true;
            }
            //if (itemList && _this.bPointHasId) {
            //    for (var i = 0, len = itemList.length; i<len; i++) {
            //        for (var j = 0, len1 = _this.groupInfo.length; j < len1; j++) {
            //            if (itemList[i].groupId == _this.groupInfo[j].groupId) {
            //                _this.groupInfo[j].datasourceList.push(itemList[i]);
            //                bSuccess = true;
            //                break;
            //            }
            //        }
            //    }
            //}
            if (bSuccess || !_this.bPointHasId) {
                if (bIsJump) {
                    var pageTitle = $('#ulPages').children('li');
                    if (Boolean(pageTitle) && pageTitle.length > 0) {
                        pageTitle.filter('.active').removeClass('active');
                    }
                    sessionStorage.setItem('dsOpenGroupId', groupId);
                    if(window.parent.ScreenManager){
                        window.parent.ScreenManager.show(window.parent.AnalysisScreen);
                    }else{
                        return;
                    }
                    
                }
                _this.$modal.modal('hide');
            }
            else {
                alert(I18n.resource.dashboard.modalJumpPages.FAIL_TIPS);
            }
        }).always(function (e) {
        });
    };
    PointToAnalysis.prototype.importFunc = function (bIsJump) {
        var arrPoint = [];
        var nSelChkNum = 0;
        var $checkBox = _this.$divPtList.find('input');
        for (var i= 0, len = $checkBox.length; i<len; i++) {
            if ($checkBox[i].checked) {
                arrPoint.push({id:$checkBox[i].value, name:$checkBox[i].getAttribute('data-name'),value:($checkBox.eq(i)).parent().text()});
                nSelChkNum++;
            }
        }
        if (arrPoint <= 0) {
            alert(I18n.resource.dashboard.modalJumpPages.NO_FIT_POINT);
            return;
        }

        var selGroupVal = _this.$selGroup.find("option:selected")[0].value;
        if ('new' == selGroupVal) {
            var groupName = _this.$inputNewGroup.val();
            if ('' == groupName) {
                alert('Please input group name !');
                _this.$inputNewGroup.focus();
                return;
            }
            var postData = {
                'groupId': '',
                'name': groupName,
                'parent': '',
                'userId': AppConfig.userId
            }
            WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (data) {
                if (!data.error) {
                    return;
                }
                var groupId = data.groupId;
                var groupItem = {
                    alias: data.groupName,
                    id: groupId,
                    isParent: true,
                    note: '',
                    num: nSelChkNum,
                    parentId: '',
                    projId: 0,
                    type: 0,
                    value: ''
                };
                _this.groupInfo.push(groupItem);

                _this.insertItemIntoGroup(groupId, arrPoint, bIsJump);
            }).always(function (e) {
            });
        }
        else {
            _this.insertItemIntoGroup(selGroupVal, arrPoint, bIsJump);
        }
    };
    return PointToAnalysis;
})();
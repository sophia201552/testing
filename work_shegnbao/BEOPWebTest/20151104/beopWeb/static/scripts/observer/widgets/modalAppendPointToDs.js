var ModalAppendPointToDs = (function () {
    function ModalAppendPointToDs(bPtHasId, pointIdList, pointNameList) {
        // bPtHasId: true-传id，对应参数pointIdList；false-传name，对应参数pointNameList
        // pointIdList: id列表
        // pointNameList: name列表
        this.bPointHasId = bPtHasId;
        this.arrDs = [];
        this.groupInfo = undefined;
        if (bPtHasId) {
            for (var i= 0,len=pointIdList.length; i<len; i++) {
                var id = pointIdList[i];
                this.arrDs.push({'id':id, 'name':AppConfig.datasource.getDSItemById(id).alias});
            }
        }
        else {
            for (var i= 0,len=pointNameList.length; i<len; i++) {
                this.arrDs.push({'id':null, 'name':pointNameList[i]});
            }
        }
    }
    ModalAppendPointToDs.prototype.show = function () {
        var _this = this;
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
            Spinner.spin(domPanelContent);
        }
        WebAPI.get('/static/views/observer/widgets/modalAppendPointToDs.html').done(function (html) {
            _this.$wrap = $('<div class="modal-db-history-wrap" id="modalJumpPageWrap">').appendTo(domPanelContent).html(html);
            _this.$modal = _this.$wrap.children('.modal');
            _this.$modal.modal('show');

            if (_this.bPointHasId) {
                if (!AppConfig.datasource.m_parent.store.group) {
                    WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
                        AppConfig.datasource.m_parent.store.group = JSON.parse(result).group;
                    }).always(function (e) {
                        _this.groupInfo = AppConfig.datasource.m_parent.store.group;
                        _this.init();
                    });
                }
                else {
                    _this.groupInfo = AppConfig.datasource.m_parent.store.group;
                    _this.init();
                }
            }
            else {
                WebAPI.get('/datasource/getGroupInfo/' + AppConfig.userId).done(function (result) {
                    _this.groupInfo = JSON.parse(result);
                    _this.init();
                }).always(function (e) {
                    Spinner.stop();
                });
            }
        }).always(function(e) {
            Spinner.stop();
        });
    };
    ModalAppendPointToDs.prototype.init = function () {
        I18n.fillArea(this.$modal);
        this.$divPtList = $('#ptList', this.$modal);
        this.$selGroup = $('#selectGroup', this.$modal);
        this.$btnImport = $('#btnImport', this.$modal);
        this.$inputNewGroup = $('#inputNewGroup', this.$modal);

        // 初始化 point list
        this.initPointList();

        // 初始化 combobox
        this.initComboBox();

        // 添加事件
        this.attachEvents();
    };
    ModalAppendPointToDs.prototype.initPointList = function () {
        this.$divPtList.empty();
        var item;
        for (var i= 0,len=this.arrDs.length; i<len; i++) {
            item = $('<label class="checkboxShow"><input type="checkbox" value="' + this.arrDs[i].id + '" checked>' + this.arrDs[i].name + '</label>');
            this.$divPtList.append(item);
        }
    };
    ModalAppendPointToDs.prototype.initComboBox = function () {
        var _this = this;
        this.$selGroup.empty();
        var item;
        for (var i= 0,len=this.groupInfo.length; i<len; i++) {
            item = $('<option value="' + this.groupInfo[i].groupId + '">' + this.groupInfo[i].groupName + '</option>');
            this.$selGroup.append(item);
        }
        var itemNew = $('<option value="new" style="color:#0000ff;font-weight:900;">New Group</option>');
        this.$selGroup.append(itemNew);
        this.$selGroup.click(function (e) {
            var selGroupVal = _this.$selGroup.find("option:selected")[0].value;
            if ('new' == selGroupVal) {
                _this.$inputNewGroup.css('display', 'block');
            }
            else {
                _this.$inputNewGroup.css('display', 'none');
            }
        });
    };
    ModalAppendPointToDs.prototype.attachEvents = function () {
        var _this = this;
        this.$btnImport.off().click(function (e) {
            var arrPoint = [];
            var check = _this.$divPtList.find('input');
            for (var i= 0,len=check.length; i<len; i++) {
                if (check[i].checked) {
                    arrPoint.push({id:check[i].value, name:$(check[i]).parent().text()});
                }
            }
            if (0 == arrPoint.length) {
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
                WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (result) {
                    var data = JSON.parse(result);
                    if (!data.error) {
                        return;
                    }
                    var groupId = data.groupId;
                    var groupItem = {
                        'datasourceList': [],
                        'groupId': groupId,
                        'groupName': data.groupName,
                        'parentId': ''
                    };
                    _this.groupInfo.push(groupItem);

                    _this.insertItemIntoGroup(groupId, arrPoint);
                }).always(function (e) {
                });
            }
            else {
                _this.insertItemIntoGroup(selGroupVal, arrPoint);
            }
        });
    };
    ModalAppendPointToDs.prototype.insertItemIntoGroup = function (groupId, arrPoint) {
        var _this = this;
        var postData = {
            itemList: []
        };
        var arrItem = [];
        if (this.bPointHasId) {
            for (var i = 0, len = arrPoint.length; i<len; i++) {
                var dsItem = {};
                var temp = AppConfig.datasource.getDSItemById(arrPoint[i].id);
                dsItem.alias = temp.alias;
                dsItem.groupId = groupId;
                dsItem.note = temp.note;
                dsItem.projId = temp.projId;
                dsItem.type = temp.type;
                dsItem.value = temp.value;
                arrItem.push(dsItem);
            }
        }
        else {
            for (var i = 0, len = arrPoint.length; i<len; i++) {
                var dsItem = {};
                var ptName = arrPoint[i].name;
                dsItem.alias = ptName;
                dsItem.groupId = groupId;
                dsItem.note = '';
                dsItem.projId = AppConfig.projectId;
                dsItem.type = 0;
                dsItem.value = ptName;
                arrItem.push(dsItem);
            }
        }
        postData.itemList = arrItem;
        WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (result) {
            var itemList = JSON.parse(result).itemIdList;
            var bSuccess = false;
            if (itemList && _this.bPointHasId) {
                for (var i = 0, len = itemList.length; i<len; i++) {
                    for (var j = 0, len1 = _this.groupInfo.length; j < len1; j++) {
                        if (itemList[i].groupId == _this.groupInfo[j].groupId) {
                            _this.groupInfo[j].datasourceList.push(itemList[i]);
                            bSuccess = true;
                            break;
                        }
                    }
                }
            }
            if (bSuccess || !_this.bPointHasId) {
                if (confirm(I18n.resource.dashboard.modalJumpPages.SUCCESS_TIPS)) {
                    var pageTitle = $('#ulPages').children('li');
                    if (Boolean(pageTitle) && pageTitle.length > 0) {
                        pageTitle.filter('.active').attr('class', '');
                    }
                    ScreenManager.show(AnalysisScreen);
                }
                _this.$modal.modal('hide');
            }
            else {
                alert(I18n.resource.dashboard.modalJumpPages.FAIL_TIPS);
            }
        }).always(function (e) {
        });
    };
    return ModalAppendPointToDs;
})();
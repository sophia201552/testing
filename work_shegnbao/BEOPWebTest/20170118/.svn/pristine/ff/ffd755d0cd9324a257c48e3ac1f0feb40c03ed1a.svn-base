var SpareParts = (function () {
    var _this;

    function SpareParts() {
        _this = this;
        this.statusType = 'show';
        this.$container = $("#tabSpareParts");
        this.userData = null;
        this.userDataMap = {};
        this.userHasSelected = {
            'executor': [],
            'verifiers': [],
            'watchers': []
        };
        this.partThingList = [];

        this.usersPromise = null;
    }

    SpareParts.prototype.show = function (data) {
        //this.statusType = 'show';
        this.data = data;
        if (data[data.length - 1]) {
            this.infoMap = data[data.length - 1];
        }
        if (!this.infoMap) {
            return;
        }
        this.infoMap = {id: this.infoMap.id, name: this.infoMap.name};
        _this.requestUserMap().done(function () {
            WebAPI.get('/asset/getPartDetail/' + _this.infoMap.id).done(function (result) {
                if (result.success) {
                    $.extend(_this.infoMap, result.data);
                    _this.setUserDataMap();
                    _this.addPartToList(result.data);
                } else {
                    _this.addPartToList({_id: _this.infoMap.id, name: _this.infoMap.name});
                }
                if (_this.statusType == "show" || _this.statusType == "edit") {
                    _this.refreshTpl();
                    _this.refreshAttachmentShow();
                } else {
                    _this.refreshDbTpl();
                }
                _this.attachEvents();

            });
        });
    };

    SpareParts.prototype.close = function () {
        this.$container.empty();
    };

    SpareParts.prototype.getPartById = function (id) {
        for (var i = 0; i < this.partThingList.length; i++) {
            if (this.partThingList[i]._id === id) {
                return this.partThingList[i];
            }
        }
    };

    SpareParts.prototype.addPartToList = function (part) {
        if (this.getPartById(part._id)) {
            for (var i = 0; i < this.partThingList.length; i++) {
                if (this.partThingList[i]._id === part._id) {
                    this.partThingList[i] = part;
                    return;
                }
            }
        } else {
            this.partThingList.push(part);
        }

    };

    SpareParts.prototype.setUserDataMap = function () {
        for (var i = 0; i < this.userData.length; i++) {
            var key = this.userData[i].id;
            this.userDataMap[key] = this.userData[i];
        }
    };

    SpareParts.prototype.spareFormHandle = function (formData) {
        var newFormData = {};
        for (var key in formData) {
            if (formData.hasOwnProperty(key)) {
                if (/\[\]/.test(key)) {
                    //去除表单名里的[]
                    if ($.isArray(formData[key])) {
                        //去除重复数据
                        var result = [];
                        formData[key].forEach(function (item) {
                            if (result.indexOf(item) < 0) {
                                result.push(item);
                            }
                        });
                        key = key.replace(/\[\]/, '');
                        formData[key] = result;
                    }
                }
                newFormData[key] = formData[key];
            }
        }
        return newFormData;
    };

    SpareParts.prototype.refreshAttachmentShow = function () {
        var htmlStr = '';
        this.infoMap.attachment && this.infoMap.attachment.forEach(function (item) {
            htmlStr += beopTmpl('attachment_item_templ', {
                file: {
                    uid: item.uid,
                    name: item.fileName,
                    time: _this.getAttachmentTime(item.uploadTime),
                    icon: _this.getAttachmentIconClassByType(item.fileName),
                    url: 'http://images.rnbtech.com.hk/workflow/attachment/' + item.uid + '-' + item.fileName,
                    userId: item.userId,
                    userInfo: item.userInfo
                }
            })
        });
        $('#wf-attachment-labelWrapper').find('.wf-attachment-nav').empty().html(htmlStr);
    };

    SpareParts.prototype.refreshTpl = function () {
        this.$container.empty().html(beopTmpl('tpl_spare_part_' + _this.statusType, {
            type: this.statusType,
            data: this.infoMap,
            userMap: this.userDataMap
        })).show();
        _this.userHasSelected = {
            executor: this.infoMap.executor,
            verifiers: this.infoMap.verifiers,
            watchers: this.infoMap.watchers
        };
        if (this.statusType == 'edit') {
            var $spare_part_edit_qty = $("#spare_part_edit_qty");
            if (typeof this.infoMap.qty === typeof undefined) {
                $spare_part_edit_qty.removeAttr('readonly');
            } else {
                $spare_part_edit_qty.attr('readonly', true);
            }
            this.uploadWidget = new WfFileUpload();
            this.uploadWidget.set("$container", _this.$container.find('#wf-attachment-labelWrapper'));
            this.uploadWidget.set("isCreateNewTask", true);
            this.uploadWidget.allFileList = this.infoMap.attachment || [];
            this.uploadWidget.show();
        }
    };

    SpareParts.prototype.getAttachmentIconClassByType = function (name) {
        var mineType = [
            {
                type: ['png', 'jpeg', 'jpg', 'bmp', 'webpg'],
                class: 'icon-file-pic'
            },
            {
                type: ['docx', 'doc', 'wps'],
                class: "icon-file-doc"
            },
            {
                type: ['ppt'],
                class: "icon-file-ppt"
            },
            {
                type: ['pdf'],
                class: 'icon-file-pdf'
            },
            {
                type: ['xlsx', 'xls', 'xlsb', 'xlsm', 'xlst'],
                class: 'icon-file-excel'
            },
            {
                type: ['exe'],
                class: 'icon-file-exe'
            },
            {
                type: ['zip', 'rar', 'jar'],
                class: 'icon-file-zip'
            },
            {
                type: ['rar'],
                class: 'icon-file-rar'
            }
        ];
        var fileType = name.split('.'), defaultFileClassName = 'icon-file-file';
        fileType = fileType[fileType.length - 1];
        if (fileType) {
            mineType.forEach(function (item, index, array) {
                if (item.type.indexOf(String(fileType).toLowerCase()) !== -1) {
                    defaultFileClassName = item.class;
                    return true;
                }
            })
        }
        return defaultFileClassName;
    };

    SpareParts.prototype.refreshDbTpl = function () {
        this.$container.empty().html(beopTmpl('tpl_storage', {
            'type': this.statusType,
            'list': this.data
        })).show();
        this.initFileUpload();
    };

    SpareParts.prototype.getAttachmentTime = function (time) {
        var monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var date = new Date(time);
        return monthShort[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
    };

    SpareParts.prototype.requestUserMap = function () {
        if (!this.usersPromise) {
            this.usersPromise = WebAPI.get('/workflow/group/user_team_dialog_list/' + window.parent.AppConfig.userId).done(function (result) {
                if (result.success) {
                    _this.userData = result.data;
                }
            }).fail(function () {
                alert('服务器请求出错');
            });
        }
        return this.usersPromise;
    };

    SpareParts.prototype.initFileUpload = function () {
        this.uploadWidget = new WfFileUpload();
        this.uploadWidget.set("$container", _this.$container.find('#wf-attachment-labelWrapper'));
        this.uploadWidget.set("isCreateNewTask", true);
        this.uploadWidget.show();
    };

    SpareParts.prototype.attachEvents = function () {
        this.$container.off('click.btnEditSpareParts').on('click.btnEditSpareParts', '#btnEditSpareParts', function () {
            _this.statusType = 'edit';
            _this.refreshTpl();
        });

        this.$container.off('click.parts_back').on('click.parts_back', '#btnBackSpareParts', function () {
            _this.statusType = 'show';
            _this.refreshTpl();
        });

        this.$container.off('click.btnDeleteSpareParts').on('click.btnDeleteSpareParts', '#btnDeleteSpareParts', function () {
            var itemList = [], idList = [];
            idList.push(_this.infoMap.id);
            itemList.push({
                'id': idList,
                type: "ThingPart"
            });

            WebAPI.post('/iot/delIotInfo', {itemList: itemList, projId: AppConfig.projectId}).done(function (result) {
                if (result.data) {
                    _this.statusType = 'show';
                    _this.$container.empty();
                    $("#paneIotData").find('li[ptid=' + _this.infoMap.id + '] .btnDelete').click();
                }
            });
        });

        this.$container.off('click.btnImportDb').on('click.btnImportDb', '#btnImportDb', function () {
            _this.detachHtml = _this.$container.children().detach();
            _this.statusType = 'importDb';
            _this.refreshDbTpl();
        });

        this.$container.off('click.btnExportDb').on('click.btnExportDb', '#btnExportDb', function () {
            _this.detachHtml = _this.$container.children().detach();
            _this.statusType = 'exportDb';
            _this.refreshDbTpl();
        });

        this.$container.off('click.bound_cancel').on('click.bound_cancel', '#bound_cancel', function () {
            _this.statusType = 'show';
            _this.$container.empty().html(_this.detachHtml);
        });

        this.$container.off('click.bound_confirm').on('click.bound_confirm', '#bound_confirm', function () {
            var itemList = [];
            var $inputNum = $("#storage_form").find('.item-number');
            var isPositive_integer = /^[1-9]\d*$/;
            for (var i = 0; i < $inputNum.length; i++) {
                var $item = $inputNum.eq(i);
                var qty = $item.val().trim(), id = $item.attr('itemId');

                var foundPart = _this.getPartById(id);
                var typeText = '数量';
                if (_this.statusType == 'exportDb') {
                    if (!foundPart || typeof foundPart.qty == typeof undefined) {
                        alert(foundPart.name + '尚未设置库存， 出库失败。');
                        return;
                    }
                    if (foundPart.qty < qty) {
                        alert(foundPart.name + '当前库存量为' + foundPart.qty + '，出库数量大于当前库存，出库失败。');
                        return;
                    }
                    typeText = '出库数量';
                } else {
                    typeText = '入库数量';
                }


                if (qty) {
                    itemList.push({
                        part_id: id,
                        qty: parseInt(qty)
                    });
                } else {
                    alert(typeText + '不能为空！');
                    return;
                }
                if (!isPositive_integer.test($item.val().trim())) {
                    alert(typeText + '请输入正整数！');
                    return;
                }
            }
            var url = _this.statusType == 'importDb' ? '/asset/inventory/in' : '/asset/inventory/out';
            WebAPI.post(url, {
                remark: $("#storageDetail").val(),
                attachments: _this.uploadWidget.allFileList,
                parts: itemList
            }).done(function (result) {
                if (result.status === 1) {
                    _this.statusType = 'show';
                    $('.tab-handle').eq(7)[0].click();
                } else {
                    alert(result.message);
                }
            });
        });

        this.$container.off('click.item-delete').on('click.item-delete', '.item-delete', function () {
            $(this).closest('li').remove();
        });

        this.$container.off('click.wf-people-add').on('click.wf-people-add', '.wf-people-add', function () {
            var $editItem = $(this);
            var type = $editItem.data('type');
            beop.view.memberSelected.init($("#wrapper"), {
                configModel: {
                    userMemberMap: _this.userData,
                    userHasSelected: _this.userHasSelected[type],
                    cb_dialog_hide: function (addedUserList) {
                        _this.userHasSelected[type] = addedUserList;
                        $("#wrapper").find('.wf-detail-userInfoWrapper').filter(function (index, item) {
                            return $(item).data('type') === type;
                        }).html(beopTmpl('tpl_wf_added_member_personal', {
                            members: addedUserList,
                            userListName: type ? type : 'addedUserList',
                            userMap: _this.userDataMap
                        }))
                    },
                    maxSelected: type == 'executor' ? 1 : null
                }
            });
        });

        this.$container.off('change.uploadImg').on('change.uploadImg', '#iptAssetPhoto', function (e) {
            var files = e.target.files;
            if (!files) {
                return;
            }
            var formData = new FormData();
            formData.append('file[]', files[0]);
            formData.append('_id', _this.id);
            $.ajax({
                url: '/asset/uploadfile',
                type: 'post',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result.data && result.data.length) {
                        $("#divAssetImg").html('<div class="imgItem dn">' +
                            '<img src="http://images.rnbtech.com.hk/' + result.data[0] + '?_=' + Date.now().valueOf() + '" class="imgAsset" id="imgAsset"/>' +
                            '</div>');
                    }
                }
            });
        });

        this.$container.off('click.confirmSpareParts').on('click.confirmSpareParts', '#btnConfirmSpareParts', function () {
            var sparepartNumber = $("#spare_part_edit_qty").val().trim();
            var isPositive_integer = /^[1-9]\d*$/;
            if (!$("#sparePartsName").val().trim()) {
                alert('名称不能为空');
                return;
            }

            if (!isPositive_integer.test(sparepartNumber) && sparepartNumber !== '0') {
                alert('零配件数量请输入是正整数');
                return;
            }

            var data = $("#sparePartsForm").serializeObject();
            data.operator = window.parent.AppConfig.userId;
            data.attachment = _this.uploadWidget.allFileList;
            data.images = $("#imgAsset").attr('src');
            data._id = _this.infoMap.id;
            data = _this.spareFormHandle(data);

            WebAPI.post('/asset/savePart', data).done(function (result) {
                if (result.success) {
                    _this.statusType = 'show';
                    alert('修改成功！');
                    $('.tab-handle').eq(5).click();
                }
            });
        });
    };

    return new SpareParts();
}());
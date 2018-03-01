var OutOfStorageRecords = (function () {
    var _this;

    function OutOfStorageRecords() {
        _this = this;
        this.statusType = 'table';
        this.tableList = [];
        this.$container = $("#tabOutOfStorageRecords");
        this.partThingList = [];
    }

    OutOfStorageRecords.prototype.show = function (data) {
        this.data = data;
        this.infoMap = data.slice(data.length - 1, data.length)[0];
        this.ids = [];
        this.data.forEach(function (row) {
            _this.ids.push(row.id);
        });
        WebAPI.get('/asset/getPartDetail/' + this.infoMap.id).done(function (result) {
            if (result.success) {
                $.extend(_this.infoMap, result.data);
                _this.addPartToList(result.data);
            } else {
                _this.addPartToList({_id: _this.infoMap.id, name: _this.infoMap.name});
            }
            if (_this.statusType == "table" || _this.statusType == "detail") {
                _this.refreshTpl();
                _this.requestList();
            } else {
                _this.refreshDbTpl();
            }
            _this.attachEvents();
        });

    };

    OutOfStorageRecords.prototype.close = function () {

    };

    OutOfStorageRecords.prototype.addPartToList = function (part) {
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

    OutOfStorageRecords.prototype.requestList = function () {
        WebAPI.post('/asset/inventory/list', {
            part_id: this.infoMap.id,
            startTime: this.$listBeginTimeDom.val() + " 00:00:00",
            endTime: this.$listEndTimeDom.val() + ' 23:59:59'
        }).done(function (result) {
            if (result.status === 1) {
                var $outOfStorageTBody = $("#outOfStorageTBody");
                $outOfStorageTBody.empty();
                if (result.inv_list.length) {
                    _this.tableList = result.inv_list;
                    _this.statusType = 'table';
                    $outOfStorageTBody.html(beopTmpl('tpl_storage_table_list', {
                        list: _this.tableList
                    }));
                }
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    OutOfStorageRecords.prototype.initTime = function () {
        this.$listBeginTimeDom.val(new Date(new Date() - 30 * 24 * 60 * 60 * 1000).format("yyyy-MM-dd"));
        this.$listEndTimeDom.val(new Date(new Date()).format("yyyy-MM-dd"));
    };

    OutOfStorageRecords.prototype.refreshTpl = function () {
        var tplData = {
            'type': _this.statusType
        };
        tplData.list = this.tableList;
        if (_this.statusType === 'table') {
            this.$container.html(beopTmpl('tpl_storage_table', tplData)).show();
            var timeFormatMap = {
                startView: 'month',
                minView: 'month',
                format: "yyyy-mm-dd",
                autoclose: true
            };
            this.$listBeginTimeDom = this.$container.find("#outOfStorageBeginTime");
            this.$listEndTimeDom = this.$container.find("#outOfStorageEndTime");
            this.$outOfStorageTBody = this.$container.find("#outOfStorageTBody");
            this.$listBeginTimeDom.datetimepicker(timeFormatMap);
            this.$listEndTimeDom.datetimepicker(timeFormatMap);
            this.initTime();
        } else if (_this.statusType === 'detail') {
            tplData.data = this.tableList[_this.recordIndex];
            this.$container.html(beopTmpl('tpl_storage_detail', tplData)).show();
            var htmlStr = '';
            tplData.data.attachments && tplData.data.attachments.forEach(function (item) {
                htmlStr += beopTmpl('attachment_item_templ', {
                    file: {
                        uid: item.uid,
                        name: item.fileName,
                        time: _this.getAttachmentTime(item.uploadTime),
                        icon: _this.getAttachmentIconClassByType(item.fileName),
                        url: '/workflow/attachment/' + item.uid + '-' + item.fileName,
                        userId: item.userId,
                        userInfo: item.userInfo
                    }
                })
            });
            $('#outOfStorageRecordsDetail').find('.wf-attachment-nav').empty().html(htmlStr);
        }
    };

    OutOfStorageRecords.prototype.refreshDbTpl = function () {
        this.$container.html(beopTmpl('tpl_storage', {
            'type': this.statusType,
            'list': this.data
        })).show();
        var $titleContent = $("#storage_form").find('.title-content');
        if (_this.statusType == 'exportDb') {
            $titleContent.text('出库');
        } else if (_this.statusType == 'importDb') {
            $titleContent.text('入库');
        }
        var timeFormatMap = {
            startView: 'month',
            minView: 'month',
            format: "yyyy-mm-dd",
            autoclose: true
        };
        this.$timeValue = this.$container.find("#timeValue");
        this.$timeValue.datetimepicker(timeFormatMap);
        this.$timeValue.val(new Date(new Date()).format("yyyy-MM-dd"));
        this.initFileUpload();
    };

    OutOfStorageRecords.prototype.initFileUpload = function () {
        this.uploadWidget = new WfFileUpload();
        this.uploadWidget.set("$container", _this.$container.find('#wf-attachment-labelWrapper'));
        this.uploadWidget.set("isCreateNewTask", true);
        this.uploadWidget.show();
    };

    OutOfStorageRecords.prototype.getAttachmentTime = function (time) {
        var monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var date = new Date(time);
        return monthShort[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
    };

    OutOfStorageRecords.prototype.getAttachmentIconClassByType = function (name) {
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

    OutOfStorageRecords.prototype.getPartById = function (id) {
        for (var i = 0; i < this.partThingList.length; i++) {
            if (this.partThingList[i]._id === id) {
                return this.partThingList[i];
            }
        }
    };

    OutOfStorageRecords.prototype.attachEvents = function () {
        this.$container.off('click.outOfStorageSearch').on('click.outOfStorageSearch', '#outOfStorageSearch', function () {
            var beginDate = _this.$listBeginTimeDom.val().trim();
            var endDate = _this.$listEndTimeDom.val().trim();
            if (beginDate > endDate) {
                alert('结束时间不能早于开始时间');
                return;
            }
            Spinner.spin(_this.$outOfStorageTBody[0]);
            _this.requestList();
        });

        this.$container.off('click.seeRecord').on('click.seeRecord', '#outOfStorageTBody tr', function () {
            _this.recordIndex = $("#outOfStorageTBody").find('tr').index($(this));
            _this.statusType = 'detail';
            _this.detachHtml = _this.$container.children().detach();
            _this.refreshTpl();
        });

        this.$container.off('click.outOfStorageReturn').on('click.outOfStorageReturn', '#outOfStorageReturn', function () {
            _this.statusType = 'table';
            _this.$container.html(_this.detachHtml);
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
            _this.statusType = 'table';
            _this.$container.html(_this.detachHtml);
        });

        this.$container.off('click.bound_confirm').on('click.bound_confirm', '#bound_confirm', function () {
            var timeValue = _this.$timeValue.val().trim();
            if (new Date(timeValue) > new Date()) {
                if (_this.statusType == 'exportDb') {
                    alert.danger('出库时间不能晚于现在时间');
                } else if (_this.statusType == 'importDb') {
                    alert.danger('入库时间不能晚于现在时间');
                }
                return;
            }
            var isPositive_integer = /^[1-9]\d*$/;
            var itemList = [];
            var $inputNum = $("#storage_form").find('.item-number');
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
            Spinner.spin(_this.$container[0]);
            WebAPI.post(url, {
                remark: $("#storageDetail").val(),
                attachments: _this.uploadWidget.allFileList,
                parts: itemList,
                time: timeValue
            }).done(function (result) {
                if (result.status === 1) {
                    _this.statusType = 'table';
                    $('.tab-handle').eq(7)[0].click();
                } else {
                    alert(result.message);
                }
            }).always(function () {
                Spinner.stop();
            });
        });

        this.$container.off('click.item-delete').on('click.item-delete', '.item-delete', function () {
            $(this).closest('li').remove();
        });
    };

    return new OutOfStorageRecords();
}());
var PreventiveMaintain = (function () {
    var _this;

    function PreventiveMaintain() {
        _this = this;
        this.workFlowType = {
            'maintain': 4
        };
        this.templateSelector = '#tpl-preventive';
        this.maintainCycleMap = {
            week: 4,
            month: 0,
            quarter: 1,
            halfYear: 2,
            year: 3
        };
        this.statusType = {
            detail: 'detail',
            edit: 'edit',
            new: 'new'
        };
        this.curData = null;
        this.status = this.statusType.detail;
        this.$container = $("#tabPreventiveMaintain");
    }

    PreventiveMaintain.prototype.show = function (data) {
        this.$container.html($(this.templateSelector).html()).show();
        this.systemType = "all";
        this.data = data;
        this.ids = [];
        this.data.forEach(function (row) {
            _this.ids.push(row.id);
        });
        this.attachEvents();
        this.requestMaintainList();
    };

    PreventiveMaintain.prototype.close = function () {

    };

    PreventiveMaintain.prototype.attachEvents = function () {
        $("#preventiveMaintainSystemType").off('change').on('change', function () {
            _this.systemType = $(this).val();
            _this.requestMaintainList();
        });
        // 点击添加
        this.$container.find('.preventiveAdd').click(function () {
            _this.$contentDetached = _this.$container.children().detach();
            _this.status = _this.statusType.new;
            _this.renderOrderPage();
        });
        this.$container.find("#btnBack").click(function () {
            _this.$container.find('[disabled=true]').removeAttr('disabled');
        });
        //点击进入编辑和查看!
        this.$container.off('click.pm.records').on('click.pm.records', "#preventiveMaintainTBody tr", function () {
            _this.$contentDetached = _this.$container.children().detach();
            _this.id = $(this).data('id');
            _this.curData = _this.getRecordsById($(this).data('id'));
            if (!_this.curData) {
                return;
            }
            _this.status = _this.statusType.detail;
            _this.renderOrderPage();
            $('#taskAttachments').hide();
            $("#maintainCycle").val(_this.curData.fields.maintainCycle);
            $("#divWorkOrderSystemType").val(_this.curData.fields.systemType);
        }).off('click.pm.back').on('click.pm.back', '#btnBack', function () {
            //返回
            _this.$container.empty().append(_this.$contentDetached);
            _this.requestMaintainList();
        }).off('click.pm.edit').on('click.pm.edit', '#btnEdit', function () {
            _this.status = _this.status === _this.statusType.detail ? _this.statusType.edit : _this.statusType.detail;
            _this.renderOrderPage();
            if (_this.status === _this.statusType.edit) {
                $('#taskAttachments').show();
            } else {
                $('#taskAttachments').hide();
            }
        }).off('click.delete').on('click.delete', '#btnDelete', function () {
            confirm('确定删除么?', function () {
                WebAPI.post('/workflow/task/delete', {'id': _this.id}).done(function (result) {
                    if (result.success) {
                        _this.$container.empty().append(_this.$contentDetached);
                        _this.requestMaintainList();
                        alert('删除成功');
                    }
                });
            });
        });
    };

    PreventiveMaintain.prototype.renderOrderPage = function () {
        for (var status in this.statusType) {
            if (this.statusType.hasOwnProperty(status)) {
                this.$container.removeClass(status);
            }
        }
        var option = {
            status: this.status
        };
        if (this.status !== this.statusType.new) {
            option['data'] = this.curData;
        }
        WorkOrder.setOptions(option, this).showAt(this.$container, this.data);
    };

    PreventiveMaintain.prototype.requestMaintainList = function () {
        $("#preventiveMaintainTBody").empty();
        Spinner.spin(this.$container[0]);
        var data = {
            query: {
                'fields.type': this.workFlowType.maintain,
                'fields.projId': window.parent.AppConfig.projectId,
                'status': -1
            },
            pageNumber: 1,
            pageSize: 10000
        };
        // 查看全部
        if (this.systemType != 'all') {
            data.query['fields.systemType'] = parseInt(this.systemType);
        }
        WebAPI.post('/workflow/task/filter', data).done(function (result) {
            if (result.success) {
                _this.records = result.data.records;
                if (result.data.total) {
                    var html = '';
                    for (var i = 0; i < _this.records.length; i++) {
                        var item = _this.records[i];
                        var nextServiceDate = item.fields.nextServiceDates ? new Date(item.fields.nextServiceDates).format('yyyy-MM-dd') : '';
                        html += '<tr data-id="' + item._id + '">' +
                            '<td title="' + item.title + '" ><span class="prevententOverflow">' + item.title + '</span></td>' +
                            '<td>' + _this.getMaintainCycleName(item.fields.maintainCycle) + '</td>' +
                            '<td>' + item.fields.userInfo.executor[0].userfullname + '</td>' +
                            '<td>' + nextServiceDate || '' + '</td>' +
                            '</tr>';
                    }
                    $('#preventiveMaintainTBody').html(html);
                }
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    PreventiveMaintain.prototype.getRecordsById = function (id) {
        if (!id) {
            alert.danger('数据错误');
            return null;
        }
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i]._id === id) {
                return this.records[i];
            }
        }
    };

    PreventiveMaintain.prototype.getEquipmentsName = function (nameList) {
        if (!nameList) { // 兼容之前提交的非完整数据
            return '';
        }
        var html = '';
        for (var i = 0; i < nameList.length; i++) {
            if (nameList.length == 1) {
                html += nameList[i];
            } else {
                if (i == nameList.length - 1) {
                    html += nameList[i];
                } else {
                    html += nameList[i] + '，';
                }
            }
        }
        return html;
    };

    PreventiveMaintain.prototype.getMaintainCycleName = function (str) {
        if (str == this.maintainCycleMap.week) {
            return '每两周';
        } else if (str == this.maintainCycleMap.month) {
            return '每月';
        } else if (str == this.maintainCycleMap.quarter) {
            return '每季度';
        } else if (str == this.maintainCycleMap.halfYear) {
            return '每半年';
        } else if (str == this.maintainCycleMap.year) {
            return '每年';
        }
    };
    return new PreventiveMaintain();
}());
var MaintainRecord = (function () {
    var _this;

    function MaintainRecord() {
        _this = this;
        this.$container = $("#tabMaintainRecord");
        this.templateSelector = "#tpl-record-list";
        this.statusType = {
            edit: 'edit',
            add: 'add',
            save: 'save'
        };
        this.status = this.statusType.add;
    }

    MaintainRecord.prototype.show = function (data) {
        this.data = data;
        this.ids = [];
        this.data.forEach(function (row) {

        });
        this.$container.html($(this.templateSelector).html()).show();
        var timeFormatMap = {
            startView: 'month',
            minView: 'month',
            format: "yyyy-mm-dd",
            autoclose: true
        };
        this.$maintainRecordStartTime = this.$container.find('#maintainRecordStartTime');
        this.$maintainRecordEndTime = this.$container.find('#maintainRecordEndTime');
        this.$maintainRecordStartTime.datetimepicker(timeFormatMap);
        this.$maintainRecordEndTime.datetimepicker(timeFormatMap);
        this.$maintainRecordStartTime.val(new Date(new Date() - 30 * 24 * 60 * 60 * 1000).format("yyyy-MM-dd"));
        this.$maintainRecordEndTime.val(new Date(new Date()).format("yyyy-MM-dd"));
        this.getList();
        this.attachEvents();
    };
    MaintainRecord.prototype.initFileUpload = function () {
        this.uploadWidget = new WfFileUpload();
        this.uploadWidget.set("$container", _this.$container.find('#wf-attachment-labelWrapper'));
        this.uploadWidget.set("isCreateNewTask", true);
        if (_this.record && (_this.status == _this.statusType.edit)) {
            this.uploadWidget.allFileList = _this.record.attachments || [];
        }
        this.uploadWidget.show();
    };
    MaintainRecord.prototype.close = function () {

    };

    MaintainRecord.prototype.attachEvents = function () {
        //搜索
        this.$container.find('#maintainRecordSearch').off('click').click(function () {
            _this.getList();
        });
        //增加
        this.$container.off('click.addMaintainRecord').on('click.addMaintainRecord', '#addMaintainRecord', function () {
            _this.status = _this.statusType.add;
            _this.$contentDetached = _this.$container.children().detach();
            _this.$container.html($('#tpl-add-maintain-record').html());
            $('#saveAddBtn').show();
            $('#editBtn').hide();
            $('#deleteRecord').hide();
            $('.upload').show();
            _this.dateTimePicker();
            _this.initFileUpload();
        });
        //取消增加
        this.$container.off('click.cancelAddBtn').on('click.cancelAddBtn', '#cancelAddBtn', function () {
            _this.$container.html(_this.$contentDetached);
            _this.renderRecords();
        });
        //保存增加
        this.$container.off('click.save').on('click.save', '#saveAddBtn', function () {
            _this.saveMaintenanceRecord();
        });
        //进去详情页面
        this.$container.off('click.getInfo').on('click.getInfo', '#maintainRecordList tr', function () {
            _this.$contentDetached = _this.$container.children().detach();
            _this.$container.html($('#tpl-add-maintain-record').html());
            $('#saveAddBtn').hide();
            $('#deleteRecord').show();
            $('#taskAttachments').hide();
            _this.record = _this.getInfoById($(this).data('id'));
            _this.id = _this.record._id;
            $('#tabMaintainRecord').addClass('recordInfo')
                .find('input').attr('disabled', 'disabled')
                .end()
                .find('textarea').attr('disabled', 'disabled');
            $('.upload-list').html(beopTmpl('tpl_upload_list', {files: _this.record.attachments}));
            _this.record.startTime ? $('#addStartDate').val(_this.record.startTime) : "";
            _this.record.endTime ? $('#addEndDate').val(_this.record.endTime) : "";
            _this.record.operator ? $('#operator').val(_this.record.operator) : "";
            _this.record.cost ? $('#cost').val(_this.record.cost) : "";
            var $workContent = $('#workContent');
            _this.record.content ? $workContent.text(_this.record.content) : '';
            $workContent.hide();
            $('.form-group').eq(4).append('<div type="text" class="form-control divValue" id="showWorkContent" disabled style="word-break:break-all"></div>');
            _this.record.content ? $('#showWorkContent').text(_this.record.content) : '';
        });
        //删除record
        this.$container.off('click.deleteRecord').on('click.deleteRecord', '#deleteRecord', function () {
            confirm('是否确定删除本条记录?', function () {
                WebAPI.post('/asset/maintainRecords/del', {_id: _this.id}).done(function (result) {
                    if (result.success) {
                        _this.$container.html(_this.$contentDetached);
                        _this.renderRecords();
                    }
                })
            });
        });

        this.$container.off('click.editBtn').on('click.editBtn', '#editBtn', function () {
            var $this = $(this);
            $this.toggleClass('active');
            if ($this.hasClass('active')) {
                _this.status = _this.statusType.edit;
                _this.$container.find('[disabled=disabled]').removeAttr('disabled');
                $('#showWorkContent').hide();
                $('.upload-list').hide();
                $('#taskAttachments').show();
                $('#workContent').show();
                $('#saveBtn').show();
                _this.dateTimePicker();
                _this.initFileUpload();
            } else {
                _this.$container.find('input').attr('disabled', 'disabled')
                    .end()
                    .find('textarea').attr('disabled', 'disabled');
                $('#showWorkContent').show();
                $('#workContent').hide();
                $('#saveBtn').hide();
                $('#taskAttachments').hide();
                $('.upload-list').show();
            }
        });

        this.$container.off('click.saveBtn').on('click.saveBtn', '#saveBtn', function () {
            _this.status = _this.statusType.save;
            _this.saveMaintenanceRecord();
        });

    };
    //通过id获取维修记录的详情
    MaintainRecord.prototype.getInfoById = function (id) {
        for (var i = 0, iLen = _this.records.length; i < iLen; i++) {
            if (_this.records[i]._id == id) {
                return _this.records[i];
            }
        }
    };
    //加载维修记录list
    var stateMap = {
        page_size: 17,
        autoCompleteList: [],
        pageNum: 1,
        scrollTop: 0,
        logCurrentPage: 1,
        allPointCurrentPage: 1,
        pointTotal: 0,
        currentPointIndex: -1
    };

    MaintainRecord.prototype.saveMaintenanceRecord = function () {
        var opt = {};
        var startDate = $('#addStartDate').val().trim();
        var endDate = $('#addEndDate').val().trim();
        var operator = $('#operator').val().trim();
        var content = $('#workContent').val().trim();
        if (!startDate) {
            alert('开始时间不可为空.');
            return;
        } else if (new Date(startDate) > new Date()) {
            alert('开始时间不能晚于现在的时间.');
            return;
        } else if (!operator) {
            alert('负责人不可为空.');
            return;
        } else if (!content) {
            alert('内容不可为空.');
            return;
        } else if (endDate && new Date(endDate) > new Date()) {
            alert('结束时间不能晚于现在时间');
            return;
        } else if (endDate && new Date(endDate) < new Date(startDate)) {
            alert('开始时间不能晚于结束时间');
            return;
        }
        opt.operator = operator;
        opt.cost = $('#cost').val().trim();
        opt.content = content;
        opt.thing_id = _this.data[0].id;
        opt.startTime = new Date(startDate).format('yyyy-MM-dd');
        opt.endTime = endDate ? new Date(endDate).format('yyyy-MM-dd') : null;
        opt.attachments = _this.uploadWidget.allFileList;
        if (this.status == this.statusType.save) {
            opt._id = _this.id;
            WebAPI.post('/asset/maintainRecords/edit', opt).done(function (result) {
                if (result.success) {
                    _this.$container.html(_this.$contentDetached);
                    _this.getList();
                    alert.danger('修改成功');
                } else {
                    alert.danger('error');
                }
            })
        } else {
            WebAPI.post('/asset/maintainRecords/add', opt).done(function (result) {
                if (result.success) {
                    _this.$container.html(_this.$contentDetached);
                    _this.getList();
                    alert('添加成功');
                } else {
                    alert('error');
                }
            });
        }
    };
    MaintainRecord.prototype.dateTimePicker = function () {
        _this.$container.find('#addStartDate').datetimepicker({
            startView: 'month',
            autoclose: true,
            format: 'yyyy-mm-dd hh:00',
            minView: 'day'
        });
        _this.$container.find('#addEndDate').datetimepicker({
            startView: 'month',
            autoclose: true,
            format: 'yyyy-mm-dd hh:00',
            minView: 'day'
        });
    };

    MaintainRecord.prototype.getList = function (page) {
        var startDate = this.$maintainRecordStartTime.val().trim();
        var endDate = this.$maintainRecordEndTime.val().trim();
        page = typeof(page) == "object" || typeof(page) == typeof(undefined) ? 1 : page;
        stateMap.pageNum = parseInt(page);
        var opt = {
            pageNum: page,
            pageSize: stateMap.page_size
        };
        if ((!startDate && endDate) || (!endDate && startDate)) {
            !startDate ? alert('开始时间不可为空.') : alert('结束时间不可为空.');
            return;
        }
        if (startDate && endDate) {
            if (new Date(endDate) > new Date()) {
                alert('结束时间不能晚于现在的时间');
                return;
            } else if (new Date(startDate) > new Date(endDate)) {
                alert('开始时间不能晚于结束时间');
                return;
            }
        }
        if (endDate) {
            opt.endTime = new Date(endDate).format('yyyy-MM-dd 23:59:59');
        } else {
            opt.endTime = new Date().format('yyyy-MM-dd 23:59:59');
        }
        if (startDate) {
            opt.startTime = new Date(startDate).format('yyyy-MM-dd 00:00:00');
        }

        opt.thing_id = _this.data[0].id;
        this.opt = opt;
        this.renderRecords();
    };
    MaintainRecord.prototype.mrPaginationRefresh = function (totalNum) {//分页插件显示
        var totalPages = Math.ceil(totalNum / stateMap.page_size);
        _this.$container.find('.maintainRecordPaging').empty().html(' <ul id="maintainRecordPagination" class="pagination"></ul>');
        while (totalPages < stateMap.pageNum && stateMap.pageNum > 1) {
            stateMap.pageNum = stateMap.pageNum - 1;
        }
        var pageOption = {
            first: '&laquo;&laquo',
            prev: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
            startPage: stateMap.pageNum ? parseInt(stateMap.pageNum) : 1,
            totalPages: !totalPages ? 1 : parseInt(totalPages),
            initiateStartPageClick: false,
            onPageClick: function (event, page) {
                stateMap.pageNum = page;
                stateMap.scrollTop = 0;
                _this.getList(page);
            }
        };
        stateMap.pagination = $("#maintainRecordPagination").twbsPagination(pageOption);
    };

    MaintainRecord.prototype.renderRecords = function () {
        Spinner.spin(_this.$container[0]);
        return WebAPI.post('/asset/maintainRecords/list', this.opt).done(function (result) {
            if (result.success) {
                if (result.data.records && result.data.records.length) {
                    _this.records = result.data.records;
                    $('#maintainRecordList').html(beopTmpl('tpl_maintainRecords', {records: _this.records}));
                    _this.mrPaginationRefresh(result.data.total);
                } else {
                    $('#maintainRecordList').empty();
                    $("#maintainRecordPagination").hide();
                }
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    return new MaintainRecord();
}());
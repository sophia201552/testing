var MaintainRecord = (function () {
    var _this;

    function MaintainRecord() {
        _this = this;
        this.$container = $("#tabMaintainRecord");
        this.templateSelector = "#tpl-record-list";
    }

    MaintainRecord.prototype.show = function (data) {
        this.data = data;
        this.ids = [];
        this.data.forEach(function (row) {

        });

        var $startTime = $('#maintainRecordStartTime');
        if (!$startTime.length) {
            this.$container.html($(this.templateSelector).html()).show();
            $startTime = $('#maintainRecordStartTime');
        }
        if (!$startTime.val()) {
            $('#maintainRecordStartTime').datetimepicker({
                startView: 'month',
                autoclose: true,
                format: 'yyyy-mm-dd',
                minView: 'month'
            });
        }

        var $endTime = $('#maintainRecordEndTime');
        if (!$endTime.val()) {
            $('#maintainRecordEndTime').datetimepicker({
                startView: 'month',
                autoclose: true,
                format: 'yyyy-mm-dd',
                minView: 'month'
            });
        }
        this.getList();
        this.attachEvents();
    };
    MaintainRecord.prototype.initFileUpload = function () {
        this.uploadWidget = new WfFileUpload();
        this.uploadWidget.set("$container", _this.$container.find('#wf-attachment-labelWrapper'));
        this.uploadWidget.set("isCreateNewTask", true);
        this.uploadWidget.set("hasFrame", true);
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
            _this.$contentDetached = _this.$container.children().detach();
            _this.$container.html($('#tpl-add-maintain-record').html());
            $('#saveAddBtn').show();
            $('#deleteRecord').hide();
            $('.upload').show();
            _this.initFileUpload();
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
        });
        //取消增加
        this.$container.off('click.cancelAddBtn').on('click.cancelAddBtn', '#cancelAddBtn', function () {
            _this.$container.html(_this.$contentDetached);
            _this.renderRecords();
        });
        //保存增加
        this.$container.off('click.save').on('click.save', '#saveAddBtn', function () {
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
            WebAPI.post('/asset/maintainRecords/add', opt).done(function (result) {
                if (result.success) {
                    _this.$container.html(_this.$contentDetached);
                    _this.getList();
                    alert('添加成功');
                } else {
                    alert('error');
                }
            });
        });
        //进去详情页面
        this.$container.off('click.getInfo').on('click.getInfo', '#maintainRecordList tr', function () {
            _this.$contentDetached = _this.$container.children().detach();
            _this.$container.html($('#tpl-add-maintain-record').html());
            $('#saveAddBtn').hide();
            $('#deleteRecord').show();
            $('.upload').hide();
            var record = _this.getInfoById($(this).data('id'));
            _this.id = record._id;
            $('#tabMaintainRecord').addClass('recordInfo')
                .find('input').attr('disabled', 'disabled')
                .end()
                .find('textarea').attr('disabled', 'disabled');
            $('.upload-list').html(beopTmpl('tpl_upload_list', {files: record.attachments}));
            record.startTime ? $('#addStartDate').val(record.startTime) : "";
            record.endTime ? $('#addEndDate').val(record.endTime) : "";
            record.operator ? $('#operator').val(record.operator) : "";
            record.cost ? $('#cost').val(record.cost) : "";
            $('#workContent').hide();
            $('.form-group').eq(4).append('<div type="text" class="form-control divValue" id="showWorkContent" disabled style="word-break:break-all"></div>');
            record.content ? $('#showWorkContent').text(record.content) : '';
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
    MaintainRecord.prototype.getList = function (page) {
        var startDate = $('#maintainRecordStartTime').val().trim();
        var endDate = $('#maintainRecordEndTime').val().trim();
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
        } else {
            opt.startTime = new Date(new Date() - 30 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00');
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
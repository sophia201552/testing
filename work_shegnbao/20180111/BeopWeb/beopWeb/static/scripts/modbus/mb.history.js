(function (exports) {
    class History extends exports.BaseView {

        constructor($container) {
            super($container);
            this.html = '/static/scripts/modbus/views/mb.history.html';
            this.stateMap = {
                pageSize: 50,
                currentPage: 1
            };
        }

        init() {
            let _this = this;
            super.init().done(function () {
                _this.refreshDateTimePicker();
                _this.historyTableList();
                $("#historyOperation").modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                _this.attachEvent();
            });

        }

        attachEvent() {
            let _this = this;
            let $historyLog = $('#historyLog');
            $('#historyOperation').off('click.filterMBLog').on('click.filterMBLog', '#filterMBLog', function () {
                _this.filterMBHisLog();
            }).off('click.terminal-log').on('click.terminal-log', '.terminal-log', function () {
                // to-do
                /*var map = {
                    a: {
                        a1: 1,
                        a2: 2
                    }, b: 2
                };
                $("#operationBox").html(JSON.stringify(map, null, 2));*/
            });
            $historyLog.off('click.mbLogClear').on('click.mbLogClear', '#mbLogClear', function () {
                $("#historyLogContent").empty();
                _this.logCompleteCurPage = [];
            }).off('change.mbLogTypeSelect').on('change.mbLogTypeSelect', '#mbLogTypeSelect', function () {
                _this.filterLog();
            }).off('click.mb-search-mode-log').on('click.mb-search-mode-log', '#mb-search-mode-log', function () {
                _this.searchMBLog();
            }).off('keyup.mode-data-Search').on('keyup.mode-data-Search', '#mode-data-Search', function (e) {
                if (e.keyCode === 13) {
                    _this.searchMBLog();
                }
            });

            $historyLog.off('hide.bs.modal').on('hide.bs.modal', function () {
                _this.clearLogData();
            });
        }

        transLateMsgCode(msg) {
            if (I18n.resource.dataTerminal.msg_params[msg]) {
                return I18n.resource.dataTerminal.msg_params[msg]
            } else {
                return msg;
            }
        }

        clearLogData() {
            let _this = this;
            Spinner.stop();
            _this.logCompleteCurPage = [];
            _this.requestCount = 0;   //点击查询日志刷新的次数
            _this.derred.done(function () {
                _this.refreshLogTimer && window.clearTimeout(_this.refreshLogTimer);
            });
        }

        filterLog() {
            let _this = this;
            _this.derred.done(function () {
                _this.refreshLogTimer && window.clearTimeout(_this.refreshLogTimer);
                let $historyLogContent = $('#historyLogContent');
                let mbLogTypeSelectVal = parseInt($('#mbLogTypeSelect').find('option:selected').val());

                switch (mbLogTypeSelectVal) {
                    case 100:
                        break;
                    case 1:
                        _this.filteringType(_this.logCompleteCurPage, 0);
                        _this.logCompleteCurPage = _this.resultLog;
                        break;
                    case 2:
                        _this.filteringType(_this.logCompleteCurPage, 1);
                        _this.logCompleteCurPage = _this.resultLog;
                        break;
                }
                $historyLogContent.empty().append(beopTmpl('tpl_history_log', {list: _this.logCompleteCurPage}));
                _this.requestLog();
            });
        }

        filteringType(logArr, type) {
            let _this = this;
            var curLog;
            _this.resultLog = new Array();
            for (var i = 0; i < logArr.length; i++) {
                curLog = logArr[i];
                if (curLog.type == type) {
                    _this.resultLog.push(curLog);
                }
            }
        }

        searchMBLog() {
            let _this = this;
            _this.derred.done(function () {
                _this.refreshLogTimer && window.clearTimeout(_this.refreshLogTimer);
                let $modeDataSearch = $('#mode-data-Search').val().trim();
                let curLogData,
                    searchLogArr = new Array();
                for (var i = 0; i < _this.logCompleteCurPage.length; i++) {
                    curLogData = _this.logCompleteCurPage[i];
                    if (curLogData.log.indexOf($modeDataSearch) == -1) {
                        continue;
                    } else {
                        searchLogArr.push(curLogData);
                    }
                }
                $('#historyLogContent').empty().append(beopTmpl('tpl_history_log', {list: searchLogArr}));
                _this.logCompleteCurPage = searchLogArr;
                _this.requestLog();
            });
        }

        filterMBHisLog() {
            let _this = this;
            var $mdHistoryLogStart = $('#mdHistoryLogStart'),
                $mdHistoryLogEnd = $('#mdHistoryLogEnd');
            _this.startTime = $mdHistoryLogStart.val().trim();
            _this.endTime = $mdHistoryLogEnd.val().trim();
            if (!_this.startTime) {
                alert(I18n.resource.debugTools.exportData.START_TIME_IS_NEEDED);
                return;
            }
            if (!_this.endTime) {
                alert(I18n.resource.debugTools.exportData.END_TIME_CANNOT_NEEDED);
                return;
            }
            if (new Date(_this.startTime) > new Date(_this.endTime)) {
                alert(I18n.resource.debugTools.exportData.START_TIME_THAN_END_TIME);
                return;
            }
            _this.historyTableList();
        }

        refreshDateTimePicker() {
            let now = new Date;
            this.startTime = new Date(now.getTime() - 86400000).format('yyyy-MM-dd');
            this.endTime = new Date(now.getTime()).format('yyyy-MM-dd');
            let timeFormatMap = {
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true,
                forceParse: false
            };
            $('#mdHistoryLogStart').val(this.startTime).datetimepicker(timeFormatMap);
            $('#mdHistoryLogEnd').val(this.endTime).datetimepicker(timeFormatMap);
        }

        requestLog() { // 暂没有时间
            let _this = this;
            var dtuId = _this.getTreeDode('id');
            var $historyLogContent = $('#historyLogContent');
            /* var startTime, endTime;
             endTime = new Date(_this.curRequestTime + _this.cycleTime * _this.requestCount).format(DateUtil.DATA_FORMAT.FULL_DATETIME_CHANGE);
             startTime = new Date(new Date(endTime).getTime() - _this.cycleTime).format(DateUtil.DATA_FORMAT.FULL_DATETIME_CHANGE);
             var logData = {
             dtuId: dtuId,
             startTime: startTime,
             endTime: endTime    //后台需要endTime;
             }; */
            var mbLogType = parseInt($('#mbLogTypeSelect').find('option:selected').val());
            let $modeDataSearch;
            if ($('#mode-data-Search').length) {
                $modeDataSearch = $('#mode-data-Search').val().trim();
            }

            let curLogData,
                resultData = new Array();

            _this.derred = WebAPI.post('/modbus/log', {
                dtuId: dtuId
            }).done(function (result) {
                if (result.success) {
                    switch (mbLogType) {
                        case 100:
                            break;
                        case 1:
                            _this.filteringType(result.data, 0);
                            result.data = _this.resultLog;
                            break;
                        case 2:
                            _this.filteringType(result.data, 1);
                            result.data = _this.resultLog;
                            break;
                    }

                    if ($modeDataSearch && $modeDataSearch != '') {
                        for (var i = 0; i < result.data.length; i++) {
                            curLogData = result.data[i];
                            if (curLogData.log.indexOf($modeDataSearch) == -1) {
                                continue;
                            } else {
                                resultData.push(curLogData);
                            }
                        }
                        result.data = resultData;
                    }

                    if (_this.logCompleteCurPage.length + result.data.length > 500) {
                        _this.logCompleteCurPage = result.data;
                    } else {
                        _this.logCompleteCurPage = _this.logCompleteCurPage.concat(result.data);
                    }
                    $historyLogContent.empty().append(beopTmpl('tpl_history_log', {list: _this.logCompleteCurPage}));
                    // var scrollH = $historyLogContent[0].scrollHeight;
                    // $historyLogContent.scrollTop(scrollH);
                    _this.refreshLogTimer && window.clearTimeout(_this.refreshLogTimer);
                    _this.refreshLogTimer = window.setTimeout(function () {
                        _this.requestCount++;
                        _this.requestLog();
                    }, _this.cycleTime);
                }
            }).fail(function (msg) {
                console.log('error: ' + msg);
            }).always(function () {
                Spinner.stop();
            });
        }

        historyLog() {
            let _this = this;
            _this.refreshLogTimer = null;
            _this.derred = $.Deferred().resolve();
            _this.curRequestTime = new Date().getTime();     //点击开始查询日志的时间,刷新时间依次为基准;
            _this.cycleTime = 1000 * 60;     //一个循环周期;
            _this.requestCount = 0;   //点击查询日志刷新的次数
            super.init().done(function () {
                _this.logCompleteCurPage = new Array();
                $("#historyLog").modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                Spinner.spin(ElScreenContainer);
                _this.requestLog();
                _this.attachEvent();
            });
        }

        getTreeDode(attr) {
            var nodes = $.fn.zTree.getZTreeObj("mb_dtu_list_ul").getSelectedNodes();
            if (!nodes) {
                return [];
            }
            if (attr == 'id') {
                return nodes[0].id;
            } else if (attr == 'node') {
                return nodes[0];
            } else if (attr == 'nodes') {
                return nodes || [];
            }
        }

        historyTableList() {
            let _this = this;
            let $table = $("#historyTableList");
            var dtuId = _this.getTreeDode('id');
            let dataTableOptions = {
                url: 'terminal/obixs/history',
                post: WebAPI.post,
                postData: {
                    projectId: AppConfig.projectId,
                    searchText: '',
                    t_time: '',
                    dtuId: dtuId,
                    startTime: _this.startTime + ' 00:00:00',
                    endTime: _this.endTime + ' 23:59:59',
                    pageSize: this.stateMap.pageSize, // 一页多少个
                    pageNum: this.stateMap.currentPage // 当前第几页*/
                },
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'currentPage'
                },
                searchInput: true,
                showLineNum: false,
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: 1,
                dataFilter: function (result) {
                    if (result.success) {
                        return result.data.list;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin(document.body);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                totalNumIndex: 'data.total',
                colNames: [
                    I18n.resource.modBus.info.OPERATOR,
                    I18n.resource.modBus.info.OPERATION,
                    I18n.resource.modBus.info.TIME/*,
                    '详情'*/
                ],
                colModel: [
                    {
                        index: 'username'
                    },
                    {
                        index: 'type', converter: function (value, row) {
                        return I18n.resource.modBus.historyNo[value];
                    }
                    },
                    {
                        index: 'time'
                    }/*,
                    {
                        index: '',
                        html: true,
                        converter: function (val, row) {
                            return '<span class="icon iconfont icon_position cp terminal-log" title="详情">&#xe70e;</span>';
                        }
                    }*/
                ]
            };
            if (_this.$datatable) {
                _this.$datatable.removeData();
                _this.$datatable = null;
            }
            _this.$datatable = $table.off().simpleDataTable(dataTableOptions);
        }
    }

    exports.History = History;

})(namespace('beop.mb'));

//# sourceURL=mb.history.js

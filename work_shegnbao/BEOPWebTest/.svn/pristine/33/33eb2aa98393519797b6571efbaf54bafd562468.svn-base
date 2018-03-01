var Diagnosis = (function () {
    var _this;

    function Diagnosis(projectId) {
        _this = this;
        PointManager.call(this, projectId);
        this.htmlUrl = '/static/views/observer/diagnosis.html';
        this.url_prefix = '/cloudDiagnosis/';
        this.currentFile = null;
        this.currentDiagnosisId = '';
        this.editor = null;
        this.testResult = [];
        this.moduleNameRegex = /^[a-zA-Z]\w+$/;
        this.ExpertContainerUrl = '';
        this.transmitLogic = '';
        this.currentEditorText = '';
        this.requestTreeList = [];
        this.treeList = [];
        this.thingTreeList = [];
        this.autoCompleteList = [];
        this.zTreeInstance = null;
        this.zTreeFaultInstance = null;
        this.moduleStatusMap = null;
        this.countofLogMap = null;
        this.pointErrorLogName = '';
        this.logPageSize = 200;
        this.logCurrentPage = 1;
        this.diagnosisPromise = $.Deferred();
        this.clipboardData = [];
        this.pointLogTypeMap = {
            all: 'all',
            single: 'single'
        };
        this.newNode = null;
        this.currentPointLogType = this.pointLogTypeMap.single;
        this.folderList = [
            {
                id: 9,
                name: '系统功能'
            }, {
                id: 1,
                name: '时间函数'
            }, {
                id: 2,
                name: '诊断函数'
            }, {
                id: 4,
                name: '取数'
            }, {
                id: 5,
                name: '能耗计算'
            }
        ];
    }

    Diagnosis.prototype = Object.create(PointManager.prototype);
    Diagnosis.prototype.constructor = Diagnosis;

    var DiagnosisFunc = {
        show: function () {

            this.init().done(function () {
                $.ajax({
                    url: "/getExpertContainerUrl",
                    type: "GET"
                }).done(function (result) {
                    if (result.success) {
                        _this.ExpertContainerUrl = result.data;
                        _this.diagnosisPromise.resolve();
                    } else {
                        alert('can\'t connect the ExpertContainer server.');
                    }
                }).fail(function () {
                    _this.diagnosisPromise.reject();
                });

                _this.attachEvents();
                _this.getTreeData();
                _this.initDiagnosisTree();
                _this.tagTreePromise = WebAPI.post('tag/getThingTree', {
                    projId: AppConfig.projectId,
                    onlyGroupForRoot: true
                }).done(function (result) {
                    if (result.thingTree.length) {
                        _this.thingTreeList = result.thingTree;
                    }
                });

                _this.diagnosisPromise.done(function () {
                    _this.moduleStatusPromise = $.ajax({
                        url: _this.ExpertContainerUrl + 'diagnosis/get/moduleStatus/' + AppConfig.projectId,
                        type: "GET"
                    }).done(function (result) {
                        if (result) {
                            _this.moduleStatusMap = result;
                        }
                    });

                    _this.countofLogPromise = WebAPI.post('/api/errorlog/countoflog', {
                        projId: AppConfig.projectId,
                        type: 'diag'
                    }).done(function (result) {
                        if (result.success) {
                            _this.countofLogMap = result.data;
                            _this.setDiagnosisFaultTotal();
                        }
                    });
                });

                I18n.fillArea($(ElScreenContainer));
            });
        },
        close: function () {
            this.detachEvents();
            if (this.editor) {
                this.editor = null;
            }
            $(document).off('keydown.CopyAndPaste');
        },
        attachEvents: function () {
            var $diagnosisCodeMainBox = $("#diagnosisCodeMainBox");
            this.$container.off('click.diagnosisFileAdd').on('click.diagnosisFileAdd', '#diagnosisFileAdd', function () {
                $diagnosisCodeMainBox.html(beopTmpl('tpl_diagnosis_code_Info'));
                if (!_this.zTreeInstance) {
                    _this.loadTree();
                }
                $("#diagnosisCodeTitle").attr('i18n', 'common.ADD');
                _this.currentDiagnosisId = '';
                $diagnosisCodeMainBox.find("input").val('');
                _this.currentEditorText = '';
                _this.refreshEditor();
                I18n.fillArea(_this.$container);
                $("#diagnosisFilesUl").find('.active').removeClass('active');
                //fault 点击添加优化: ( 后期待完善);
                var newNode = {name: I18n.resource.diagnosis.config.faultAlarm.NAME};
                _this.newNode = _this.zTreeFaultInstance.addNodes(_this.getParentNodeByAdd(), newNode);
                _this.zTreeFaultInstance.selectNode(_this.newNode[0]);
            }).off('click.diagnosisConfirm').on('click.diagnosisConfirm', '#diagnosisConfirm', function () {
                var moduleNameVal = $("#diagnosisModuleName").val().trim();
                var codeVal = _this.editor.doc.getValue();
                if (!moduleNameVal) {
                    alert.danger('diagnosis name code can\'t be empty.');
                    return;
                }

                if (!codeVal) {
                    alert.danger('diagnosis code can\'t be empty.');
                    return;
                }

                if (!_this.moduleNameRegex.test(moduleNameVal)) {
                    alert(I18n.resource.admin.panelManagement.POINT_NAME);
                    return;
                }

                Spinner.spin(_this.$container[0]);
                var parent = _this.getParentNodeByAdd();
                WebAPI.post(_this.url_prefix + 'saveCustomDiagnosis', {
                    moduleName: moduleNameVal,
                    logic: BEOPUtil.logicContentHandle(codeVal),
                    faultDescription: $("#diagnosisFaultDescription").val().trim(),
                    projId: AppConfig.projectId,
                    _id: _this.currentDiagnosisId,
                    Parent: parent ? parent._id : -1
                }).done(function (result) {
                    if (result.success) {
                        var node;
                        if (_this.currentDiagnosisId) { // 修改
                            node = _this.getCurrentNode();
                            if (node) {
                                $.extend(node, _this._convertDiagnosisToNode(result.data));
                                _this.zTreeFaultInstance.updateNode(node);
                            }
                        } else { // 新增
                            _this.currentDiagnosisId = result.data._id;
                            $.extend(_this.newNode[0], _this._convertDiagnosisToNode(result.data));
                            _this.zTreeFaultInstance.updateNode(_this.newNode[0]);
                            _this.zTreeFaultInstance.selectNode(_this.zTreeFaultInstance.getNodeByParam('_id', result.data._id));
                        }

                        alert('Save diagnosis ' + moduleNameVal + ' success');
                    } else {
                        alert('Save diagnosis ' + moduleNameVal + ' failed \n' + result.msg);
                    }
                }).always(function () {
                    Spinner.stop();
                })
            }).off('click.diagnosis_SetUp').on('click.diagnosis_SetUp', '#diagnosis_SetUp', function () {
                $("#cloudPointSetUp").modal();
                WebAPI.post("/getCalcSettings/" + AppConfig.projectId, {projId: AppConfig.projectId}).done(function (returnData) {
                    $("#fixedTimeMode").prop("checked", !!returnData.data.triggerDiagnosis.fixed_time);
                    $("#rawDataMode").prop('checked', !!returnData.data.triggerDiagnosis.raw_data);
                });
            }).off('click.btnPreservation').on('click.btnPreservation', '#btnPreservation', function () {
                var data = {
                    projId: AppConfig.projectId,
                    triggerDiagnosis: {
                        fixed_time: $("#fixedTimeMode").prop('checked') ? 1 : 0,
                        raw_data: $("#rawDataMode").prop('checked') ? 1 : 0
                    }
                };
                WebAPI.post("/setCalcSettings/" + AppConfig.projectId, data).done(function (result) {
                    if (result.success) {
                        $("#cloudPointSetUp").modal("hide");
                    } else {
                        alert.danger('server: set failed.');
                    }
                });
            }).off('click.fault-type-code1').on('click.fault-type-code1', '#diagnosisFilesUl .fault-type-code1', function () {
                $("#diagnosis_alarm").modal();
                WebAPI.post('/v2/fault/getRealtime', {
                    'projId': AppConfig.projectId,
                    'moduleId': _this.currentDiagnosisId
                }).done(function (result) {
                    if (result) {
                        var diagnosisAlarmData = result.data[0];
                        $("#folderName").text(_this.pointErrorLogName);
                        $("#alarmTime").text(diagnosisAlarmData.time);
                        $("#problemDescription").text(diagnosisAlarmData.problem);
                        $("#causeAnalysis").text(diagnosisAlarmData.analysis);
                        $("#consequence").text(diagnosisAlarmData.affect);
                        $("#suggestionMeasure").text(diagnosisAlarmData.suggestion);
                    } else {
                        $("#diagnosis_alarm").modal("hide");
                        alert.danger('Failed to load');
                    }
                })
            }).off('click.btnAlarmDetailsConfirm').on('click.btnAlarmDetailsConfirm', '#btnAlarmDetailsConfirm', function () {
                $("#diagnosis_alarm").modal("hide");
            }).off('click.diagnosisTest').on('click.diagnosisTest', '#diagnosisTest', function () {
                var moduleNameVal = $("#diagnosisModuleName").val().trim();
                var codeVal = _this.editor.doc.getValue();
                if (!moduleNameVal || !moduleNameVal.trim()) {
                    alert.danger('diagnosis name can\'t be empty.');
                    return;
                }
                if (!codeVal || !codeVal.trim()) {
                    alert.danger('diagnosis code can\'t be empty.');
                    return;
                }
                Spinner.spin(ElScreenContainer);
                var timer, confirmInstance;
                var testPromise = _this.diagnosisPromise.then(function () {
                    return $.ajax({
                        url: _this.ExpertContainerUrl + 'diagnosis/onlinetest',
                        type: "POST",
                        data: {
                            'moduleName': moduleNameVal,
                            'content': BEOPUtil.logicContentHandle(codeVal),
                            'projId': AppConfig.projectId
                        }
                    }).done(function (result) {
                        var opt = {};
                        opt.newDate = new Date().format('yyyy-MM-dd HH:mm:ss');
                        $('.diagnosisTestResult').show();
                        opt.process = result.process;
                        if (!result.error) {
                            for (var i = 0; i < _this.testResult.length; i++) {
                                if (_this.testResult[i].id == _this.currentDiagnosisId) {
                                    _this.testResult.splice(i--, 1);
                                }
                            }
                            _this.testResult.push({
                                "id": _this.currentDiagnosisId,
                                "value": $("#diagnosisTestProgress").html()
                            });
                        } else {
                            opt.errorResult = result.value;
                        }
                        $("#diagnosisTestProgress").show().prepend(beopTmpl('tpl_test_progress', {opt: opt}));
                        clearTimeout(timer);
                    }).error(function () {
                        alert.danger('Test Failed: the server is busy.')
                    }).always(function () {
                        Spinner.stop();
                        confirmInstance && confirmInstance.close();
                    });
                });
                timer = setTimeout(function () {
                    if (testPromise.state !== 'resolved' || testPromise.state !== 'rejected') {
                        confirmInstance = confirm(I18n.resource.debugTools.info.REQUEST_TIMEOUT, function () {
                            Spinner.stop();
                        })
                    }
                }, 2000)

            }).off('click.addTreeFolder').on('click.addTreeFolder', '#addTreeFolder', function () {
                infoBox.prompt('please input the folder name', function (val) {
                    if (!val) {
                        alert.danger('The folder name can\'t be empty.');
                        return;
                    }
                    Spinner.spin(_this.$container[0]);
                    var parent = _this.getParentNodeByAdd();
                    WebAPI.post(_this.url_prefix + 'saveCustomDiagnosis', {
                        'isFolder': true,
                        'Parent': parent ? parent._id : -1,
                        'moduleName': val,
                        'projId': AppConfig.projectId
                    }).done(function (result) {
                        if (result.success) {
                            _this.zTreeFaultInstance.addNodes(parent, {
                                'isParent': true,
                                'open': false,
                                'name': result.data.moduleName,
                                '_id': result.data._id
                            });
                        } else {
                            alert('Add diagnosis ' + val + ' failed \n' + result.msg);
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                });
            }).off('click.import_from_template').on('click.import_from_template', '#import_from_template', function () {
                _this.currentEditorText = _this.editor.doc.getValue();
                beop.template.init({
                    'container': $('#templateImportWinBox'),
                    'opType': 'import',
                    'confirmCallBack': function () {
                        _this.transmitLogic += beop.template.getLogic();
                        $('.templateWin').modal('hide');
                        _this.refreshEditor();
                    }
                });
            }).off('click.save_as_template').on('click.save_as_template', '#save_as_template', function () {
                beop.template.init({
                    'container': $("#saveAsTemplateWinBox"),
                    'opType': 'save',
                    'logic': _this.editor.doc.getValue()
                });
            }).off('click.generateCurve').on('click.generateCurve', '#generateCurve', function () {
                _this.generateCurve();
            }).off('click.searchLogOfOneHour').on('click.searchLogOfOneHour', '#searchLogOfOneHour', _this.searchLogOfOneHour)
                .off('click.searchLogOfYesterday').on('click.searchLogOfYesterday', '#searchLogOfYesterday', _this.searchLogOfYesterday)
                .off('click.searchLogOfToday').on('click.searchLogOfToday', '#searchLogOfToday', _this.searchLogOfToday)
                .off('click.searchLogOfAWeek').on('click.searchLogOfAWeek', '#searchLogOfAWeek', _this.searchLogOfAWeek)
                .off('click.logSearch').on('click.logSearch', '#logSearchBtn', _this.logSearch)
                .off('click.logSearchDeleteAllBtn').on('click.logSearchDeleteAllBtn', '#logSearchDeleteAllBtn', _this.logSearchDeleteAll)
                .off('change.logPageSizeChange').on('change.logPageSizeChange', '#logPageSizeSelector', _this.logPageSizeChange)
                .off('click.editorFullScreen').on('click.editorFullScreen', '#editorFullScreen', _this.editorFullScreen)
                .off('click.diagnosisFaultTotal').on('click.diagnosisFaultTotal', '#diagnosisFaultTotal', _this.loadLogPage);

            $(document).off('keydown.CopyAndPaste').on("keydown.CopyAndPaste", function (e) {
                if (!_this.currentDiagnosisId || $(e.target).closest('#diagnosisCodeBoxInner').length || !e.ctrlKey) {
                    return true;
                }
                if (e.keyCode == 67) { // ctrl + c
                    _this.clipboardData = _this.zTreeFaultInstance.getSelectedNodes();
                } else if (e.keyCode == 86) { // ctrl + v
                    var selectedIds = [];
                    _this.clipboardData.forEach(function (node) {
                        selectedIds.push(node._id);
                    });
                    if (!selectedIds.length) {
                        alert.danger('Please select diagnosis first.');
                        return;
                    }
                    var parent_id = -1;
                    var parent = _this.getParentNodeByAdd();
                    if (parent) {
                        parent_id = parent._id;
                    }
                    Spinner.spin(_this.$container[0]);
                    WebAPI.post('cloudDiagnosis/copyCustomDiagnosis', {
                        diagnosisIds: selectedIds,
                        parent_id: parent_id
                    }).done(function (result) {
                        if (!result.success) {
                            alert.danger('copy failed ' + result.msg);
                        }
                        _this.zTreeFaultInstance.addNodes(_this.getParentNodeByAdd(), _this._convertDiagnosisToNode(result.data));
                    }).always(function () {
                        Spinner.stop();
                    });
                }
            });
        },

        detachEvents: function () {

        },

        getCountOfLogRequest: function () {
            WebAPI.post('/api/errorlog/countoflog', {
                projId: AppConfig.projectId,
                type: 'diag'
            }).done(function (result) {
                if (result.success) {
                    _this.countofLogMap = result.data;
                    _this.setDiagnosisFaultTotal();
                }
            });
        },

        setDiagnosisFaultTotal: function () {
            var total = 0, $diagnosisFaultTotal = $('#diagnosisFaultTotal');
            for (var prop in this.countofLogMap) {
                total += this.countofLogMap[prop];
            }
            if (total) {
                $diagnosisFaultTotal.text(total).show();
            } else {
                $diagnosisFaultTotal.text(total).hide();
            }
        },

        generateCurve: function () {
            Spinner.spin(ElScreenContainer);
            var date_start, data_end;
            if (localStorage.getItem('diagnosisCurveStartDate')) {
                date_start = localStorage.getItem('diagnosisCurveStartDate');
                data_end = localStorage.getItem('diagnosisCurveEndDate');
            } else {
                date_start = new Date(new Date() - 5 * 24 * 60 * 60 * 1000).format("yyyy-MM-dd HH:mm:00");
                data_end = new Date().format("yyyy-MM-dd HH:mm:00");
            }

            var sendData = {
                'projId': AppConfig.projectId,
                'diagname': _this.currentFile.name, //诊断模块名
                'diagObid': _this.currentFile._id,  //模块的_id
                's_time': date_start,
                'e_time': data_end,
                'formatTime': _this.currentFile.format
            };

            $.ajax({
                url: _this.ExpertContainerUrl + 'diagnosis/get/moduleStatus/single',
                data: sendData,
                type: "POST"
            }).done(function (result) {
                if (result) {
                    new DiagnosisHistoryChart({
                        result: result,
                        sendData: sendData,
                        ExpertContainerUrl: _this.ExpertContainerUrl
                    }).show();
                }
            }).always(function () {
                Spinner.stop();
            });
        },

        logPaginationRefresh: function (totalNum) {//分页插件显示
            var totalPages = Math.ceil(totalNum / _this.logPageSize);
            $('#paginationContainer').empty().html('<ul id="logPagination" class="pagination"></ul>');
            while (totalPages < _this.logCurrentPage && _this.logCurrentPage > 1) {
                _this.logCurrentPage = _this.logCurrentPage - 1;
            }
            var pageOption = {
                first: '&laquo;&laquo',
                prev: '&laquo;',
                next: '&raquo;',
                last: '&raquo;&raquo;',
                startPage: _this.logCurrentPage ? parseInt(_this.logCurrentPage) : 1,
                totalPages: !totalPages ? 1 : parseInt(totalPages),
                onPageClick: function (event, page) {
                    _this.logCurrentPage = page;
                    _this.logSearch(page);
                }
            };
            $("#logPagination").twbsPagination(pageOption);
            $('.logContainer').scrollTop(0);
        },

        logPageSizeChange: function () {
            _this.logPageSize = $(this).val();
            _this.logSearch();
        },

        editorFullScreen: function () {
            _this.editor.setOption("fullScreen", true);
        },

        loadLogPage: function () {
            var $diagnosisCodeMainBox = $("#diagnosisCodeMainBox");
            $diagnosisCodeMainBox.html(beopTmpl('tpl_search_log', {}));
            var dataFormat = {
                startView: 'month',
                autoclose: true,
                format: 'yyyy-mm-dd hh:ii:ss'
            };
            $("#logDateStart").datetimepicker(dataFormat);
            $("#logDateEnd").datetimepicker(dataFormat);
            if (!_this.logPageSize) {
                _this.logPageSize = 200;
            }
            I18n.fillArea($diagnosisCodeMainBox);
            if ($(this).closest('#diagnosisFaultTotal').length) { // 获取全部
                _this.currentPointLogType = _this.pointLogTypeMap.all;
                _this.logSinglePointSearch();
            } else { // 获取单个
                _this.currentPointLogType = _this.pointLogTypeMap.single;
                _this.logSinglePointSearch(1, this.currentFile.moduleName);
            }
        },

        logSinglePointSearch: function (page, pointName) {
            Spinner.spin(document.body);
            var url, data = {
                projId: AppConfig.projectId,
                pageSize: _this.logPageSize,
                pageNum: +page ? +page : 1,
                type: 'diag'
            };
            if (_this.currentPointLogType == _this.pointLogTypeMap.single) {
                url = '/api/errorlog/onepoint';
                data.pointname = pointName;
            } else {
                url = '/api/errorlog';
                data.timeFrom = new Date().format('yyyy-MM-dd 00:00:00');
                data.timeTo = new Date().format('yyyy-MM-dd 23:59:59');
                $('#logDateStart').attr('value', data.timeFrom);
                $('#logDateEnd').attr('value', data.timeTo);
            }
            WebAPI.post(url, data).done(function (result) {
                if (result.success) {
                    $('#totalLogsNum').text(result.data.total);
                    _this.logCurrentPage = parseInt(page);
                    _this.logPaginationRefresh(result.data.total);
                    $('#logReport').html(beopTmpl('tpl_search_log_result', {logList: result.data.records}));
                } else {
                    alert(result.msg);
                }
            }).always(function () {
                Spinner.stop();
            })
        },

        logSearch: function (page) {
            Spinner.spin(document.body);
            var $logDateStart = $('#logDateStart'), $logDateEnd = $('#logDateEnd');
            var timeFrom = $logDateStart.val();
            var timeTo = $logDateEnd.val();
            var url = '', data = {
                projId: AppConfig.projectId,
                pageSize: _this.logPageSize,
                pageNum: +page ? +page : 1,
                type: 'diag'
            };
            if (_this.currentPointLogType == _this.pointLogTypeMap.single) {
                url = '/api/errorlog/onepoint';
                data.pointname = _this.pointErrorLogName;
            } else {
                url = '/api/errorlog';
                if (!timeFrom) {
                    timeFrom = new Date().format('yyyy-MM-dd 00:00:00');
                    $logDateStart.attr('value', timeFrom);
                }
                if (!timeTo) {
                    timeTo = new Date().format('yyyy-MM-dd 23:59:59');
                    $logDateEnd.attr('value', timeTo);
                }
            }
            data.timeFrom = timeFrom;
            data.timeTo = timeTo;

            WebAPI.post(url, data).done(function (result) {
                if (result.success == true) {
                    $('#totalLogsNum').text(result.data.total);
                    _this.logCurrentPage = parseInt(page);
                    _this.logPaginationRefresh(result.data.total);
                    $('#logReport').html(beopTmpl('tpl_search_log_result', {logList: result.data.records}));
                } else {
                    alert(result.msg);
                }
            }).always(function () {
                Spinner.stop();
            })
        },

        logSearchDeleteAll: function () {
            confirm(I18n.resource.debugTools.info.IS_CLEAR_LOG, function () {
                Spinner.spin(document.body);
                WebAPI.post('/api/errorlog/dellog', {
                    projId: AppConfig.projectId,
                    pointname: _this.pointErrorLogName ? _this.pointErrorLogName : '',
                    type: 'diag'
                }).done(function (result) {
                    if (result.success) {
                        $("#logReport").empty();
                        $("#logPagination").hide();
                        if (_this.currentPointLogType == _this.pointLogTypeMap.single) {
                            var nodeId = _this.zTreeFaultInstance.getSelectedNodes()[0].tId;
                            $("#" + nodeId).find('.errorPoint').remove();
                        } else {
                            $("#diagnosisFilesUl").find('.errorPoint').remove();
                            $("#diagnosisFaultTotal").remove();
                        }

                        _this.getCountOfLogRequest();
                        alert(I18n.resource.common.DELETE_SUCCESS);
                    } else {
                        alert(result.msg);
                    }
                }).always(function () {
                    Spinner.stop();
                })
            });
        },

        searchLogOfOneHour: function () {
            var now = new Date();
            $('#logDateStart').attr('value', new Date(now.getTime() - 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss')).val(new Date(now.getTime() - 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'));
            $('#logDateEnd').attr('value', now.format('yyyy-MM-dd HH:mm:ss')).val(now.format('yyyy-MM-dd HH:mm:ss'));
            _this.logSearch();
        },

        searchLogOfYesterday: function () {
            var now = new Date();
            $('#logDateStart').attr('value', new Date(now - 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00')).val(new Date(now - 24 * 60 * 60 * 1000).format('yyyy-MM-dd 00:00:00'));
            $('#logDateEnd').attr('value', new Date(now - 24 * 60 * 60 * 1000).format('yyyy-MM-dd 23:59:59')).val(new Date(now - 24 * 60 * 60 * 1000).format('yyyy-MM-dd 23:59:59'));
            _this.logSearch();
        },

        searchLogOfToday: function () {
            $('#logDateStart').attr('value', new Date().format('yyyy-MM-dd 00:00:00')).val(new Date().format('yyyy-MM-dd 00:00:00'));
            $('#logDateEnd').attr('value', new Date().format('yyyy-MM-dd HH:mm:ss')).val(new Date().format('yyyy-MM-dd HH:mm:ss'));
            _this.logSearch();
        },

        searchLogOfAWeek: function () {
            var now = new Date();
            $('#logDateStart').attr('value', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss')).val(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd HH:mm:ss'));
            $('#logDateEnd').attr('value', new Date().format('yyyy-MM-dd HH:mm:ss')).val(new Date().format('yyyy-MM-dd HH:mm:ss'));
            _this.logSearch();
        },

        getFaultTypeName: function (value) {
            if (value == 0 || value == 1) {
                return I18n.resource.common['FAULT_TYPE_CODE_' + value];
            } else {
                return I18n.resource.common.FAULT_TYPE_CODE_UNKNOWN;
            }
        },

        initDiagnosisTree: function () {
            var $diagnosisFilesUl = $("#diagnosisFilesUl");
            $diagnosisFilesUl.empty();

            var zTreeSettings = {
                view: {
                    selectedMulti: true,
                    addDiyDom: _this.addDiyDom
                },
                edit: {
                    enable: true,
                    showRemoveBtn: true,
                    showRenameBtn: _this.zTreeShowRenameBtn
                },
                data: {
                    simpleData: {
                        enable: true
                    },
                    keep: {
                        parent: true,
                        leaf: true
                    }
                },
                callback: {
                    onDrop: _this.zTreeFaultOnDrop,
                    onDrag: _this.zTreeFaultOnDrag,
                    onRemove: _this.zTreeFaultOnRemove,
                    onRename: _this.zTreeFaultOnRename,
                    onClick: _this.zTreeFaultOnClick,
                    beforeDrop: _this.zTreeFaultOnBeforeDrop,
                    beforeClick: _this.zTreeFaultBeforeClick,
                    beforeRemove: _this.zTreeFaultBeforeRemove
                },
                async: {
                    enable: true,
                    type: 'post',
                    url: '/cloudDiagnosis/getCustomDiagnosis/tree',
                    otherParam: {
                        "projId": AppConfig.projectId,
                        'isDelete': false
                    },
                    autoParam: ["_id=Parent"],
                    dataFilter: function (treeId, parentNode, responseData) {
                        if (responseData.success) {
                            return _this._convertDiagnosisToNode(responseData.data);
                        } else {
                            return [];
                        }
                    }
                }
            };
            this.zTreeFaultInstance = $.fn.zTree.init($diagnosisFilesUl, zTreeSettings);
        },

        zTreeShowRenameBtn: function (treeId, treeNode) {
            return treeNode.isParent;
        },

        addDiyDom: function (treeId, treeNode) {
            if (treeNode.isParent) {
                return;
            }
            $.when(_this.moduleStatusPromise, _this.countofLogPromise).done(function () {
                var str = '';
                if (_this.moduleStatusMap && _this.moduleStatusMap[treeNode.moduleName]) {
                    str += '<span class="mr5 diagnosis-type fault-type-code fault-type-code' + _this.moduleStatusMap[treeNode.moduleName].value + '">'
                        + _this.getFaultTypeName(_this.moduleStatusMap[treeNode.moduleName].value) +
                        '</span>';
                }

                if (_this.countofLogMap && _this.countofLogMap[treeNode.moduleName]) {
                    str += '<span class="mr5 diagnosis-num errorPoint">' + _this.countofLogMap[treeNode.moduleName] + '</span>';
                    treeNode.hasLog = true;
                }

                $("#" + treeNode.tId + "_a").append(str);
            });
        },

        _convertDiagnosisToNode: function (diagnosisList) {

            var _converter = function (item) {
                item.name = item.moduleName;
                item.isParent = item.isFolder;
                return item;
            };

            if (!$.isArray(diagnosisList)) {
                return _converter(diagnosisList);
            }

            for (var i = 0; i < diagnosisList.length; i++) {
                _converter(diagnosisList[i]);
            }
            return diagnosisList;
        },

        zTreeFaultBeforeRemove: function (treeId, treeNode) {
            //是否确认删除??
            confirm(I18n.resource.dataManage.REMOVE_CONFIRM, function () {
                var fileId = treeNode._id;
                Spinner.spin(_this.$container[0]);
                WebAPI.post(_this.url_prefix + 'removeCustomDiagnosis', {
                    'IdList': [fileId]
                }).done(function (result) {
                    if (result.success) {
                        _this.zTreeFaultInstance.removeNode(treeNode);
                        $("#diagnosisCodeBoxInner").hide();
                        $("#diagnosisLogBox").hide();
                        var delLogFlag = false; // 判断节点是否有日志
                        for (var prop in _this.countofLogMap) {
                            if (prop == treeNode.name) {
                                delLogFlag = true;
                                break;
                            }
                        }
                        if (delLogFlag) {
                            Spinner.spin(document.body);
                            WebAPI.post('/api/errorlog/dellog', {
                                projId: AppConfig.projectId,
                                pointname: treeNode.name,
                                type: 'diag'
                            }).done(function (result) {
                                if (result.success) {
                                    _this.getCountOfLogRequest();
                                } else {
                                    alert(result.msg);
                                }
                            }).always(function () {
                                Spinner.stop();
                            });
                        }
                    } else {
                        alert.danger('delete failed ' + result.msg ? result.msg : '');
                    }
                }).fail(function () {
                    alert.danger('delete failed, server is busy.');
                }).always(function () {
                    Spinner.stop();
                })
            });

            return false;
        },

        zTreeFaultOnRemove: function (e, treeId, treeNode) {
            return false;
        },

        zTreeFaultOnRename: function (event, treeId, treeNode, isCancel) {
            WebAPI.post(_this.url_prefix + 'saveCustomDiagnosis', {
                moduleName: treeNode.name,
                projId: AppConfig.projectId,
                _id: treeNode._id
            }).done(function (result) {
                if (!result.success) {
                    alert.danger('Diagnosis node rename ' + treeNode.moduleName + ' failed \n' + result.msg);
                }
                return false;
            }).always(function () {
                Spinner.stop();
            });
        },

        zTreeFaultOnDrag: function (event, treeId, treeNodes) {
            if (treeNodes[0].isFolder) {
                return false;
            }
        },

        zTreeFaultOnBeforeDrop: function (treeId, treeNodes, targetNode, moveType) {
            if (!targetNode) {
                return false;
            }
        },

        zTreeFaultOnDrop: function (e, treeId, treeNodes, targetNode, moveType) {
            if (!targetNode) {
                return false;
            }
            var parent_id = -1;
            if (targetNode.isParent) {
                parent_id = targetNode._id;
            } else {
                var parentNode = targetNode.getParentNode();
                parent_id = parentNode ? parentNode._id : -1;
            }
            Spinner.spin($("#diagnosisFilesUl")[0]);
            var diagnosisList = [];
            for (var i = 0; i < treeNodes.length; i++) {
                diagnosisList.push({
                        Parent: parent_id,
                        _id: treeNodes[i]._id,
                        projId: AppConfig.projectId
                    }
                );
            }
            WebAPI.post(_this.url_prefix + 'saveCustomDiagnosis', diagnosisList).done(function (result) {
                if (!result.success) {
                    alert.danger('Diagnosis node' + treeNodes[0].moduleName + ' failed \n' + result.msg);
                }
                _this.zTreeFaultOnClick(treeNodes[0]);
                return false;
            }).always(function () {
                Spinner.stop();
            });
        },

        getCurrentNode: function () {
            var nodes = _this.zTreeFaultInstance.getSelectedNodes();
            if (!nodes.length) {
                return null;
            } else if (nodes.length === 1) {
                return nodes[0].isParent ? null : nodes[0];
            } else {
                return null;
            }
        },

        getParentNodeByAdd: function () {
            var nodes = _this.zTreeFaultInstance.getSelectedNodes();
            if (!nodes.length) {
                return null;
            } else {
                return nodes[0].isParent ? nodes[0] : nodes[0].getParentNode();
            }
        },

        isDiagnosisChanged: function () {
            var $moduleName = $("#diagnosisModuleName");
            var $diagnosisFaultDescription = $("#diagnosisFaultDescription");
            if (!$moduleName.length) {
                return false;
            }
            return $moduleName.val() !== _this.currentFile.moduleName ||
                $diagnosisFaultDescription.val() !== _this.currentFile.faultDescription ||
                BEOPUtil.logicContentHandle(_this.editor.doc.getValue()) !== _this.currentFile.logic
        },
        zTreeFaultBeforeClick: function (treeId, treeNode) {
            if (_this.currentFile && _this.isDiagnosisChanged()) {
                confirm(I18n.resource.diagnosis.config.faultAlarm.MODIFY_PROMPT, function () {
                }, function () {
                    _this.zTreeFaultOnClick(null, null, treeNode);
                    _this.zTreeFaultInstance.selectNode(treeNode);
                });
                return false;
            } else {
                return true;
            }

        },
        zTreeFaultOnClick: function (e, treeId, treeNode) { // e js event , treeId 父节点id, treeNode 当前节点信息
            if (treeNode.isParent) {
                return;
            }

            _this.currentDiagnosisId = treeNode._id;
            _this.currentFile = treeNode;
            _this.pointErrorLogName = treeNode.name;

            if (e && $(e.target).hasClass('diagnosis-num')) {
                _this.loadLogPage();
            } else {
                $("#diagnosisCodeMainBox").html(beopTmpl('tpl_diagnosis_code_Info'));
                $("#diagnosisCodeBoxInner").show();
                if (!_this.zTreeInstance) {
                    _this.loadTree();
                }
                $("#diagnosisCodeTitle").attr('i18n', 'common.EDIT');

                $("#diagnosisModuleName").val(_this.currentFile.moduleName);
                $("#diagnosisFaultDescription").val(_this.currentFile.faultDescription);
                $("#diagnosisTestProgress").empty().hide();
                _this.currentEditorText = _this.currentFile.logic;
                _this.refreshEditor();
            }
            // Give the document focus
            window.focus();

            if (document.activeElement) {
                document.activeElement.blur();
            }
            I18n.fillArea(_this.$container);
        },

        refreshEditor: function () {
            this.$container.find('.CodeMirror').remove();
            this.editor = null;

            if (this.transmitLogic) { // 从模板中传递的值
                if (this.currentEditorText == '') {
                    this.currentEditorText += this.transmitLogic;
                } else {
                    this.currentEditorText += ('\n\n' + this.transmitLogic);
                }
                this.transmitLogic = '';
            }

            $("#diagnosisCodeMirror").text(this.currentEditorText);
            CodeMirror.commands.autocomplete = function (cm) {
                cm.showHint({
                    hint: function (editor, options) {
                        var WORD = /[\w$]+/;
                        var word = options && options.word || WORD;
                        var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
                        var end = cur.ch, start = end;

                        while (start && word.test(curLine.charAt(start - 1))) --start;
                        var curWord = start != end && curLine.slice(start, end);

                        var candidates = _this.autoCompleteList.filter(function (item) {
                            return item.displayText.startsWith(curWord);
                        });
                        if (candidates.length === 1) {
                            candidates.unshift({
                                text: '',
                                displayText: ''
                            });
                        }

                        return {
                            list: candidates,
                            from: CodeMirror.Pos(cur.line, start),
                            to: CodeMirror.Pos(cur.line, end)
                        }
                    }
                });
            };
            this.editor = CodeMirror.fromTextArea(document.getElementById('diagnosisCodeMirror'), {
                mode: "python",
                lineNumbers: true,
                indentUnit: 4,
                tabMode: 'spaces',
                autofocus: true
            });
            this.editor.setOption("extraKeys", {
                Tab: function (cm) {
                    var spaces = new Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces);
                },
                "F11": function (cm) {
                    cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                },
                "Esc": function (cm) {
                    if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                }
            });
            this.editor.refresh();

            this.editor.on("keyup", function (cm, e) {
                // 屏蔽 backspace 上下左右 按键
                if (e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40) {
                    CodeMirror.commands.autocomplete(cm);
                }
            });
        },
        getTreeData: function () {
            _this.diagnosisPromise.done(function () {
                var urlSuffix = localStorage.getItem('language') === 'zh' ? 'apiTree' : 'apiTree/en';
                $.ajax({
                    url: _this.ExpertContainerUrl + urlSuffix,
                    type: "GET"
                }).done(function (result) {
                    if (result && result.length) {
                        _this.requestTreeList = result;
                        for (var i = 0; i < _this.requestTreeList.length; i++) {
                            _this.autoCompleteList.push({
                                text: _this.requestTreeList[i].sample,
                                displayText: _this.requestTreeList[i].name
                            })
                        }
                    }
                });
            });
        },
        loadTree: function () {
            var zTreeSetting = {
                view: {
                    selectedMulti: false,
                    addHoverDom: this.showNodeTitle.bind(this)
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onDblClick: this.zTreeOnDblClick,
                    onDrag: this.zTreeOnDrag,
                    onDrop: this.zTreeOnDrop.bind(this)
                },
                async: {
                    enable: true,
                    type: 'post',
                    url: '/tag/getThingTree',
                    otherParam: {projId: AppConfig.projectId, onlyGroupForRoot: true},
                    autoParam: ["_id=Prt"],
                    dataFilter: function (treeId, parentNode, responseData) {
                        return responseData.thingTree;
                    }
                }
            };
            _this.tagTreePromise.done(function () {
                _this.changeToZTreeNodes();
                _this.zTreeInstance = $.fn.zTree.init($("#diagnosisTree"), zTreeSetting, _this.treeList);
            });
        },
        zTreeOnDblClick: function (event, treeId, treeNode) {// event js event , treeId 父节点id, treeNode 当前节点信息
            if (!treeNode.isParent) {
                if (treeNode.sample) {
                    _this.insertContent(treeNode.sample);
                } else {
                    _this.insertContent(treeNode.name);
                }
            }
        },
        zTreeOnDrag: function (event, treeId, treeNodes) {
            if (treeNodes[0].isParent) {
                return false;
            }
        },
        zTreeOnDrop: function (e, treeId, treeNodes, targetNode, moveType) {
            if (!treeNodes[0].isParent) {
                if ($(e.target).closest('#diagnosisCodeMirrorBox').length) {
                    if (treeNodes[0].sample) {
                        this.insertContent(treeNodes[0].sample);
                    } else {
                        this.insertContent(treeNodes[0].name);
                    }
                }

            }
        },
        changeToZTreeNodes: function () {
            for (var i = 0; i < this.requestTreeList.length; i++) {
                this.treeList.push({
                    id: ObjectId(),
                    sample: this.requestTreeList[i].sample,
                    name: this.requestTreeList[i].name,
                    pId: this.requestTreeList[i].api_type == '0' ? 9 : this.requestTreeList[i].api_type
                });
            }
            for (var j = 0; j < this.folderList.length; j++) {
                this.treeList.push({
                    id: this.folderList[j].id,
                    name: this.folderList[j].name,
                    pId: 10,
                    open: false,
                    isFolder: true
                });
            }

            this.treeList.push({
                id: 10,
                name: I18n.resource.dataManage.SYSTEM_API,
                pId: 0,
                open: false,
                isFolder: true
            });
            var tagFolderId = 15;
            this.treeList.push({
                id: tagFolderId,
                name: 'Tag Structure',
                pId: 0,
                open: false,
                isFolder: true,
                isParent: true
            });

            this.setTreeNodeIcon(this.thingTreeList, tagFolderId);
            this.treeList = this.treeList.concat(this.thingTreeList);
        },
        setTreeNodeIcon: function (node, rootId) {
            for (var i = 0; i < node.length; i++) {
                if (rootId) {
                    node[i].pId = rootId;
                }
                if (node[i].tag && node[i].tag.icon) {
                    node[i].iconSkin = 'iconfont icon-' + node[i].tag.icon;
                }
                if (node[i].children && node[i].children.length) {
                    this.setTreeNodeIcon(node[i].children, node[i]._id);
                }
            }
        },
        showNodeTitle: function (treeId, treeNode) {
            if (!treeNode.isParent) {
                for (var i = 0; i < this.requestTreeList.length; i++) {
                    var item = this.requestTreeList[i];
                    if (treeNode.name == item.name) {
                        var titleHtml = 'api:  ' + item.name + '\n' + I18n.resource.common.DESCRIPTION + ':  '
                            + item.dis_cription + '\n' + I18n.resource.common.EXAMPLE + ':  ' + item.sample;
                        $("#" + treeNode.tId + "_a").attr('title', titleHtml);
                        break;
                    }
                }
            }
        },
        insertContent: function (value) {
            this.editor.replaceSelection(value);
        }
    };
    $.extend(Diagnosis.prototype, DiagnosisFunc);
    return Diagnosis;
})
();

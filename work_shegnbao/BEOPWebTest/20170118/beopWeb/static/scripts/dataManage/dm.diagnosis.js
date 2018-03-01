var Diagnosis = (function () {
    var _this;

    function Diagnosis(projectId) {
        _this = this;
        PointManager.call(this, projectId);
        this.htmlUrl = '/static/scripts/dataManage/views/dm.diagnosis.html';
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
        this.thingTreeList = [];
        this.autoCompleteList = [];
        this.zTreeFaultInstance = null;
        this.moduleStatusMap = null;
        this.countofLogMap = null;
        this.pointErrorLogName = '';
        this.logPageSize = 200;
        this.logCurrentPage = 1;
        this.clipboardData = [];
        this.pointLogTypeMap = {
            all: 'all',
            single: 'single'
        };
        this.isLoadTreeFlag = false;
        this.newNode = null;
        this.currentPointLogType = this.pointLogTypeMap.single;
    }

    Diagnosis.prototype = Object.create(PointManager.prototype);
    Diagnosis.prototype.constructor = Diagnosis;

    var DiagnosisFunc = {
        show: function () {

            this.init().done(function () {
                _this.diagnosisPromise = $.ajax({
                    url: "/getExpertContainerUrl",
                    type: "GET"
                }).done(function (result) {
                    if (result.success) {
                        _this.ExpertContainerUrl = result.data;
                    } else {
                        alert('can\'t connect the ExpertContainer server.');
                    }
                }).fail(function () {
                    alert('can\'t connect the ExpertContainer server.');
                });

                _this.attachEvents();
                _this.getTreeData();
                _this.initDiagnosisTree();
                _this.tagTreePromise = WebAPI.post('tag/getThingTree', {
                    projId: AppConfig.projectId,
                    onlyGroupForRoot: true
                }).done(function (result) {
                    if (result.data && result.data.length) {
                        _this.thingTreeList = result.data;
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
				
				// 添加报错状态数字
                _this.diagnosisPromise.done(function () {
                    $.ajax({
                        url: _this.ExpertContainerUrl + 'v2/diagnosis/get/moduleStatus/' + AppConfig.projectId,
                        type: "GET"
                    }).done(function (result) {
                        if (result) {
                            var count = 0, $warnTotal = $("#warnTotal");
                            for (var prop in result.moduleStatus) {
                                var item = result.moduleStatus[prop];
                                var value = item.value;
                                if (!((!value && typeof value != "undefined" && value != 0) || value == true)) {// 报警
                                    count++;
                                }
                                if (_this.revertTimeAct(item.timeAct).isWarning) {
                                    count++;
                                }
                                if (_this.revertTimeCost(item.timeCost).isWarning) {
                                    count++;
                                }
                            }
                            if (count > 0) {
                                $warnTotal.text(count).show();
                            } else {
                                $warnTotal.text(0).hide();
                            }
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
                if (!_this.isLoadTreeFlag) {
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
                var newNode = {name: I18n.resource.diagnosis.config.faultAlarm.NAME, isNew: true};
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
                            _this.zTreeFaultOnClick(null, result.data._id, _this.newNode[0]);
                        }

                        alert('Save diagnosis ' + moduleNameVal + ' success');
                        node.isNew = false;
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
            }).off('click.fault-type-code-1').on('click.fault-type-code-1', '#diagnosisFilesUl .fault-type-code-1', function () {
                WebAPI.post('/v2/fault/getRealtime', {
                    'projId': AppConfig.projectId,
                    'moduleId': _this.currentDiagnosisId
                }).done(function (result) {
                    if (result.success && result.data) {
                        $("#diagnosis_alarm").modal().find(".title").text('未知详情');
                        var html = '';
                        html += _this.detailsInfo(result.data.timeAct, '执行时间');
                        html += _this.detailsInfo(result.data.timeCost, '耗费时间');
                        if (result.data.value && result.data.value != true) {
                            var diagnosisAlarmData = result.data.value;
                            html += _this.detailsInfo(diagnosisAlarmData.startTime, I18n.resource.diagnosis.config.faultAlarm.STARTTIME);
                            html += _this.detailsInfo(diagnosisAlarmData.endTime, I18n.resource.diagnosis.config.faultAlarm.ENDTIME);
                            html += _this.detailsInfo(diagnosisAlarmData.detail, I18n.resource.diagnosis.config.faultAlarm.DETAIL);
                        }
                        $("#diagnosisAlarmForm").empty().append(html);
                    } else {
                        $("#diagnosis_alarm").modal("hide");
                        alert.danger('Data cannot be loaded');
                    }
                });
            }).off('click.fault-type-code1').on('click.fault-type-code1', '#diagnosisFilesUl .fault-type-code1', function () {
                WebAPI.post('/v2/fault/getRealtime', {
                    'projId': AppConfig.projectId,
                    'moduleId': _this.currentDiagnosisId
                }).done(function (result) {
                    if (result.success && result.data) {
                        $("#diagnosis_alarm").modal().find(".title").text(I18n.resource.diagnosis.config.faultAlarm.ALARM_DETAILS);
                        var html = '';
                        html += _this.detailsInfo(result.data.timeAct, '执行时间');
                        html += _this.detailsInfo(result.data.timeCost, '耗费时间');
                        if (result.data.value && result.data.value != true) {
                            var diagnosisAlarmData = result.data.value;
                            html += _this.detailsInfo(_this.pointErrorLogName, I18n.resource.diagnosis.config.faultAlarm.DIAGNOSIS_NAME);
                            html += _this.detailsInfo(diagnosisAlarmData.time, I18n.resource.diagnosis.config.faultAlarm.TIME);
                            html += _this.detailsInfo(diagnosisAlarmData.problem, I18n.resource.diagnosis.config.faultAlarm.PROBLEM_DESCRIPTION);
                            html += _this.detailsInfo(diagnosisAlarmData.analysis, I18n.resource.diagnosis.config.faultAlarm.CAUSE_ANALYSIS);
                            html += _this.detailsInfo(diagnosisAlarmData.affect, I18n.resource.diagnosis.config.faultAlarm.CONSEQUENCE);
                            html += _this.detailsInfo(diagnosisAlarmData.suggestion, I18n.resource.diagnosis.config.faultAlarm.SUGGESTION_MEASURE);
                        }
                        $("#diagnosisAlarmForm").empty().append(html);
                    } else {
                        $("#diagnosis_alarm").modal("hide");
                        alert.danger('Data cannot be loaded');
                    }
                });
            }).off('click.fault-type-code0').on('click.fault-type-code0', '#diagnosisFilesUl .fault-type-code0', function () {
                WebAPI.post('/v2/fault/getRealtime', {
                    'projId': AppConfig.projectId,
                    'moduleId': _this.currentDiagnosisId
                }).done(function (result) {
                    if (result.success && result.data) {
                        $("#diagnosis_alarm").modal().find(".title").text(I18n.resource.diagnosis.config.faultAlarm.NORMAL_DETAILS);
                        var html = '';
                        html += _this.detailsInfo(result.data.timeAct, '执行时间');
                        html += _this.detailsInfo(result.data.timeCost, '耗费时间');

                        if (result.data.value && result.data.value != true) {
                            var diagnosisAlarmData = result.data.value;
                            html += _this.detailsInfo(diagnosisAlarmData.startTime, I18n.resource.diagnosis.config.faultAlarm.STARTTIME);
                            html += _this.detailsInfo(diagnosisAlarmData.endTime, I18n.resource.diagnosis.config.faultAlarm.ENDTIME);
                            html += _this.detailsInfo(diagnosisAlarmData.detail, I18n.resource.diagnosis.config.faultAlarm.DETAIL);
                        }
                        $("#diagnosisAlarmForm").empty().append(html);
                    } else {
                        $("#diagnosis_alarm").modal("hide");
                        alert.danger('Data cannot be loaded');
                    }
                });

            }).off('click.diagnosisModalABG').on('click.diagnosisModalABG', '.diagnosisModalABG', function () {
                $('#diagnosis_tree_online_test').find('.active').removeClass('active');
                $(this).closest('.panel-heading').addClass('active');
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

                if (!_this.moduleNameRegex.test(moduleNameVal)) {
                    alert(I18n.resource.admin.panelManagement.POINT_NAME);
                    return;
                }

                Spinner.spin($("#diagnosisCodeBox")[0]);
                _this.flag = true;
                _this.diagnosisPromise.then(function () {
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
                        var $diagnosisTestProgress = $("#diagnosisTestProgress");
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
                                "value": $diagnosisTestProgress.html()
                            });
                        } else {
                            opt.errorResult = result.value;
                        }
                        $diagnosisTestProgress.show().prepend(beopTmpl('tpl_test_progress', {opt: opt}));
                    }).error(function () {
                        alert.danger('Test Failed: the server is busy.')
                    }).always(function () {
                        Spinner.stop();
                        _this.flag = false;
                    });
                });

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
                .off('click.diagnosisFaultTotal').on('click.diagnosisFaultTotal', '#diagnosisFaultTotal', _this.loadLogPage)
				.off('click.diagnosisStatusInfoBox').on('click.diagnosisStatusInfoBox', '#diagnosisStatusInfoBox', _this.loadStatusInfo);

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
		
		loadStatusInfo: function () {
            Spinner.spin($("#diagnosisFileBox")[0]);
            _this.diagnosisPromise.done(function () {
                $.ajax({
                    url: _this.ExpertContainerUrl + 'v2/diagnosis/get/moduleStatus/' + AppConfig.projectId,
                    type: "GET"
                }).done(function (result) {
                    if (result) {
                        _this.refreshProjectStatus(result);
                    } else {
                        alert('暂无记录!');
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });
        },

        // status 返回字段进行转义
        revertStatusName: function (value) {
            if (!value && typeof value != "undefined" && value != 0) { // value 为null 未知
                return '<span class="label label-success">未知</span>';
            } else if (value == true) { // value true 正常
                return '<span class="label label-primary">正常</span>';
            } else { // value  报警
                return '<span class="label label-warning">报警</span>';
            }
        },

        revertTimeAct: function (value) {
            var time = new Date().getTime() - new Date(value).getTime();
            if (time > 1000 * 3600 * 2) {
                return {
                    value: value + '<span class="label label-warning ml5">报警</span>',
                    isWarning: true
                }
            } else {
                return {
                    value: value,
                    isWarning: false
                }
            }
        },

        revertTimeCost: function (value) {
            if (value > 600) {
                return {
                    value: value + '<span class="label label-warning ml5">报警</span>',
                    isWarning: true
                }
            } else {
                return {
                    value: value,
                    isWarning: false
                }
            }
        },

        sortStatusInfo: function (projectStatusMap) {
            var projectStatusList = [];
            for (var prop in projectStatusMap) {
                var item = projectStatusMap[prop];
                var value = item.value;
                if ((!value && typeof value != "undefined" && value != 0) || value == true) {// 非报警
                    if (!_this.revertTimeAct(item.timeAct).isWarning && !_this.revertTimeCost(item.timeCost).isWarning) {
                        projectStatusMap[prop].name = prop;
                        projectStatusList.push(projectStatusMap[prop]);
                        delete projectStatusMap[prop];
                    }
                }
            }
            for (var prop in projectStatusMap) {
                var value = projectStatusMap[prop].value;
                if ((!value && typeof value != "undefined" && value != 0) || value == true) {// 非报警
                    projectStatusMap[prop].name = prop;
                    projectStatusList.unshift(projectStatusMap[prop]);
                    delete projectStatusMap[prop];
                }
            }

            if (projectStatusMap) {// 报警
                for (var prop in projectStatusMap) {
                    projectStatusMap[prop].name = prop;
                    projectStatusList.unshift(projectStatusMap[prop]);
                }
            }

            for (var i = 0; i < projectStatusList.length; i++) {
                var item = projectStatusList[i];
                item.value = _this.revertStatusName(item.value);
                item.timeCost = _this.revertTimeCost(item.timeCost).value;
                item.timeAct = _this.revertTimeAct(item.timeAct).value;
            }
            return projectStatusList;
        },

        // 显示项目的所有模块状态
        refreshProjectStatus: function (projectStatusMap) {
            $("#projectActCost").text(projectStatusMap.projectActCostSeconds);
            $("#projectActTime").text(projectStatusMap.projectActTime);
            var html = '', list = _this.sortStatusInfo(projectStatusMap.moduleStatus);
            for (var i = 0; i < list.length; i++) {
                var map = list[i];
                html += '<tr><td style="width:25%">' + map.name + '</td>' +
                '<td style="width:25%">' + map.value + '</td>' +
                '<td style="width:25%">' + map.timeCost + '</td>' +
                '<td style="width:25%">' + map.timeAct + '</td></tr>';
            }
            $("#diagnosisStatusTBody").empty().html(html);
            $("#diagnosisStatus").modal();
        },

        //报警/正常详情
        detailsInfo: function (value, name) {
            if (typeof value != typeof undefined) {
                return '<div class="form-group"><label class="diagnosisAlarm-label col-md-2">{name}</label><div class="col-md-10">{value}</div></div>'.formatEL({
                    value: value,
                    name: name
                });
            } else {
                return '';
            }
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
            var selectNode = _this.zTreeFaultInstance.getSelectedNodes();
            if (!selectNode || !selectNode.length || selectNode[0].isParent || selectNode[0].isNew) {
                alert(I18n.resource.diagnosis.config.faultAlarm.DIAGNOSIS_INFO_CHANGE);
                return;
            }
            Spinner.spin(ElScreenContainer);
            var date_start, data_end;
            if (localStorage.getItem('diagnosisCurveStartDate')) {
                date_start = new Date(localStorage.getItem('diagnosisCurveStartDate')).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE);
                data_end = new Date(localStorage.getItem('diagnosisCurveEndDate')).format(DateUtil.DATA_FORMAT.FULL_DATETIME_ZERO_SEC_CHANGE);
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
                format: timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME),
                forceParse: false
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
                    addDiyDom: _this.addDiyDom,
                    addHoverDom: _this.zTreeFaultOnAddHoverDom,
                    removeHoverDom: _this.zTreeFaultOnRemoveHoverDom
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
                    beforeRemove: _this.zTreeFaultBeforeRemove,
                    onAsyncSuccess: _this.zTreeAsyncSuccess
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

        zTreeAsyncSuccess: function (event, treeId, treeNode, msg) {
            var node = _this.zTreeFaultInstance.getNodeByParam("_id", '58116167545cd4083cbb3e69', null);
            this.zTreeFaultInstance.expandNode(node, true, true);
            try {
                //调用默认展开第一个结点
                var selectedNode = this.zTreeFaultInstance.getSelectedNodes();
                var nodes = this.zTreeFaultInstance.getNodes();
                this.zTreeFaultInstance.expandNode(nodes[0], true);
                var childNodes = zTree.transformToArray(nodes[0]);
                this.zTreeFaultInstance.expandNode(childNodes[1], true);
                this.zTreeFaultInstance.selectNode(childNodes[1]);
                var childNodes1 = zTree.transformToArray(childNodes[1]);
                this.zTreeFaultInstance.checkNode(childNodes1[1], true, true);
            } catch (err) {

            }
        },

        zTreeFaultOnAddHoverDom: function (treeId, treeNode) {
            if (treeNode.isParent) {
                var $liNode = $("#" + treeNode.tId);
                if (!$liNode.find('.testFolder').length) {
                    $liNode.children('a').append('<span class="icon iconfont cp ml5 testFolder" i18n="title=debugTools.sitePoint.ONLINE_TEST;">&#xe708;</span>');
                    $liNode.find('.testFolder').show();
                }
            }
        },

        zTreeFaultOnRemoveHoverDom: function (treeId, treeNode) {
            if (treeNode.isParent) {
                $("#" + treeNode.tId).find('.testFolder').remove();
            }
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
                _this.zTreeFaultOnClick(null, null, treeNodes[0]);
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
            // (未修改情况下) 如果内容为空时 点击会弹出已修改bug
            if ($diagnosisFaultDescription.val() == '' || BEOPUtil.logicContentHandle(_this.editor.doc.getValue()) == '') {
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
                if ($(e.target).is('.testFolder')) {
                    _this._testDiagnosisFolder(treeNode._id);
                }
            } else {
                if (_this.flag === true) {
                    Alert.warning(ElScreenContainer, I18n.resource.diagnosis.config.faultAlarm.ONLINE_DONE_WAITING).showAtTop(3000);
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
                    if (!_this.isLoadTreeFlag) {
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
            }
        },

        _testDiagnosisFolder: function (folderId) {
            return WebAPI.post('/cloudDiagnosis/getCustomDiagnosis/tree', {
                filter: {
                    Parent: folderId,
                    projId: AppConfig.projectId,
                    isDelete: false
                }
            }).done(function (result) {
                var diagnosisList = [],
                    curTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                for (var k = 0; k < result.data.length; k++) {
                    if (!result.data[k].isFolder) {
                        result.data[k].curTime = curTime;
                        diagnosisList.push(result.data[k]);
                    }
                }
                if (!diagnosisList || !diagnosisList.length) {
                    alert('Not a diagnosis');
                    return;
                }
                var html = beopTmpl('online_test_modal_body', {diagnosisList: diagnosisList});
                var $diagnosisModel = $('#diagnosis_tree_online_test');
                var $diagnosisList = $diagnosisModel.find('.modal-body').empty().append(html).end().modal();
                var $completeNumber = $diagnosisModel.find('.completeNumber');

                //number是在线测试已完成个数;
                var num = 0;
                for (var i = 0; i < diagnosisList.length; i++) {
                    _this.diagnosisPromise.then((function (diagnosis) {
                        $.ajax({
                            data: {
                                moduleName: diagnosis.moduleName,
                                content: diagnosis.logic,
                                projId: AppConfig.projectId
                            },
                            type: "POST",
                            url: _this.ExpertContainerUrl + 'diagnosis/onlinetest'
                        }).done(function (result) {
                            var $diagnosis = $diagnosisList.find('#' + diagnosis.moduleName + '-wrapper');
                            $diagnosis.find('.online_test_status').text('done');
                            var completeStatus = '(' + (++num) + ' / ' + diagnosisList.length + ')';
                            $completeNumber.html(completeStatus);
                            if (result.error) {
                                $diagnosis.find('.testResult').text(result.value);
                            } else {
                                $diagnosis.find('.testResult').text(result.process.join('\n'));
                            }
                        }).error(function () {
                            alert.danger('Test Failed: the server is busy.')
                        });
                    })(diagnosisList[i]));
                }
            });
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
                var language = localStorage.getItem('language');
                $.ajax({
                    url: _this.ExpertContainerUrl + 'apiTree?lang=' + language,
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
            if (!_this.isLoadTreeFlag) {
                _this.tagTreePromise.done(function () {
                    _this.changeToZTreeNodes();
                    _this.isLoadTreeFlag = true;
                    beop.tag.tree.configModel(
                        {
                            editable: true,
                            isOnlyGroup: false,
                            otherNodes: _this.otherNodes,
                            wrapperNode: true,
                            hasWrapperNode: true,
                            itemShowList: ['search'],
                            cb_on_dbl_click: function (treeNode) {
                                if (!treeNode.isParent) {
                                    _this.editor.replaceSelection(treeNode.sample ? treeNode.sample : treeNode.name);
                                }
                            },
                            cb_on_drop: function (e, treeNodes) {
                                var node = treeNodes[0];
                                if (!node.isParent) {
                                    if ($(e.target).closest('#diagnosisCodeMirrorBox').length) {
                                        _this.editor.replaceSelection(node.sample ? node.sample : node.name);
                                    }
                                }
                            },
                            cb_on_hover: function (treeNode) {
                                if (!treeNode.isParent && treeNode.dis_cription) {
                                    var titleHtml = 'api:  ' + treeNode.name + '\n' + I18n.resource.common.DESCRIPTION + ':  '
                                        + treeNode.dis_cription + '\n' + I18n.resource.common.EXAMPLE + ':  ' + treeNode.sample;
                                    $("#" + treeNode.tId + "_a").attr('title', titleHtml);
                                }
                            }
                        }
                    );
                    beop.tag.tree.init($("#dmSysTree"));
                });
            }
        },
        getApiFolderNameList: function () {
            var apiTreeNodeList = [], nodeTypeNameList = [];
            for (var i = 0; i < _this.requestTreeList.length; i++) {
                var apiType = _this.requestTreeList[i].api_type;
                if ($.inArray(apiType, nodeTypeNameList) === -1) {
                    nodeTypeNameList.push(apiType);
                    apiTreeNodeList.push({
                        id: ObjectId(),
                        type: apiType,
                        children: []
                    });
                }
            }
            return apiTreeNodeList;
        },

        changeToZTreeNodes: function () {
            var apiTreeNodeList = _this.getApiFolderNameList(),
                otherNodesId = '77777777';
            for (var i = 0; i < _this.requestTreeList.length; i++) {
                var pId, treeNode = _this.requestTreeList[i];
                for (var j = 0; j < apiTreeNodeList.length; j++) {
                    if (treeNode.api_type === apiTreeNodeList[j].type) {
                        pId = apiTreeNodeList[j].id;
                        apiTreeNodeList[j].children.push({
                            _id: ObjectId(),
                            name: treeNode.name,
                            sample: treeNode.sample,
                            dis_cription: treeNode.dis_cription,
                            pId: pId
                        });
                        break;
                    }
                }
            }

            for (var j = 0; j < apiTreeNodeList.length; j++) {
                var node = apiTreeNodeList[j];
                node.name = node.type;
                node._id = ObjectId();
                node.prt = otherNodesId;
                node.isParent = true;
                node.type = 'group';
            }

            this.otherNodes = {
                id: otherNodesId,
                name: I18n.resource.dataManage.SYSTEM_API,
                prt: null,
                open: false,
                isFolder: true,
                children: apiTreeNodeList
            };
        }
    };
    $.extend(Diagnosis.prototype, DiagnosisFunc);
    return Diagnosis;
})
();
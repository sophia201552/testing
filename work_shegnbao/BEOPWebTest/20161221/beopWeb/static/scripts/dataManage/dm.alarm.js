var PointManagerDataAlarm = (function () {
    var _this;

    function PointManagerDataAlarm(projectId) {
        PointManager.call(this, projectId);
        _this = this;
        this.htmlUrl = '/static/scripts/dataManage/views/dm.alarm.html';
        this.pageSize = 20;
        this.currentPage = 1;
        this.pointNameList = [];
        this.ExpertContainerUrl = '';
        this.treeList = [];
        this.userData = null;
        this.userHasSelected = null;
        this.configMap = {
            page: {
                'list': 'list',
                'new': 'new',
                'edit_bool': 'edit_bool',
                'edit_limit': 'edit_limit'
            },
            alarmType: {
                bool: 1,
                limit: 2
            }
        };
        this.statusMap = {
            page: 'list',
            alarmType: 1
        };
        this.timeFormat = {
            weekStart: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 1,
            minView: 0,
            maxView: 1,
            format: timeFormat(timeFormatChange(DateUtil.DATA_FORMAT.TIME_HOUR_MINUTE)),
            forceParse: 0,
            pickerPosition: "top-left"
        };
    }

    PointManagerDataAlarm.prototype = Object.create(PointManager.prototype);
    PointManagerDataAlarm.prototype.constructor = PointManagerDataAlarm;

    var PointManagerDataAlarmFunc = {
        show: function () {
            this.init().done(function () {
                _this.$alarmBox = $("#dataAlarmBox");
                _this.pageInit();
                _this.requestUserMap();
                _this.attachEvents();
                I18n.fillArea($(ElScreenContainer));
                _this.expertContainerUrlPromise = $.ajax({
                    url: "/getExpertContainerUrl",
                    type: "GET"
                }).done(function (result) {
                    if (result.success) {
                        _this.ExpertContainerUrl = result.data;
                    } else {
                        alert('can\'t connect the ExpertContainer server.');
                    }
                });
            });
        },

        pageInit: function () {
            //加载tag树
            this.tagTreePromise = WebAPI.post('tag/getThingTree', {
                projId: AppConfig.projectId,
                onlyGroupForRoot: true
            }).done(function (result) {
                if (result.thingTree && result.thingTree.length) {
                    _this.treeList = result.thingTree;
                }
            });
            // load alarm list
            $('#dataAlarmBox').html(beopTmpl('tpl_data_alarm_list'));
            _this.loadSheet();
        },

        close: function () {
            this.detachEvents();
            this.resetParam();
        },

        resetParam: function () {
            if (_this.$treeDomDetach) {
                _this.$treeDomDetach = null;
            }
            if (_this.zTreeInstance) {
                _this.zTreeInstance = null;
            }
            if (_this.zTreeSearchInstance) {
                _this.zTreeSearchInstance = null;
            }
        },

        loadSheet: function () {
            var $table = $("#data_alarm_list_table");
            var pageSizeIndex,
                $pageSizeSelect = $table.find(".pageSizeSelect");
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }

            var $isShowAlarm = $("#isShowAlarm");

            var dataTableOptions = {
                url: '/alarm/list',
                post: WebAPI.post,
                postData: {
                    projectId: AppConfig.projectId,
                    searchText: '',
                    pageSize: _this.pageSize, // 一页多少个
                    pageNum: _this.currentPage // 当前第几页
                },
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'pageNum'
                },
                searchInput: $("#text_search"),
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                filters: [
                    {
                        param: 'status',
                        element: $isShowAlarm,
                        event: 'change',
                        type: 'checkbox'
                    }
                ],
                dataFilter: function (result) {
                    if (result.success) {
                        return result.data.records;
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
                    I18n.resource.dataManage.ALARM_POINT,
                    I18n.resource.debugTools.exportData.REMARK,
                    I18n.resource.debugTools.exportData.YES_OR_NO_USER,
                    I18n.resource.debugTools.exportData.GRADE,
                    I18n.resource.debugTools.exportData.TYPE,
                    I18n.resource.debugTools.exportData.ALARM_STATUS,
                    I18n.resource.dataManage.UPDATE_TIME,
                    I18n.resource.debugTools.exportData.MODIFIER
                ],
                colModel: [
                    {index: 'point', width: '200px'},
                    {index: 'remark'},
                    {index: '', checkbox: true, checkboxParam: 'beused', disabled: false},
                    {index: 'grade'},
                    {
                        index: 'type',
                        converter: function (value) {
                            return _this.converterAlarmType(value);
                        }
                    },
                    {
                        index: 'alarm_result',
                        converter: function (value, row) {
                            return _this.converterAlarmStatus(value, row.type);
                        }
                    },
                    {
                        index: 'createtime',
                        converter: function (value) {
                            return value ? timeFormat(value, timeFormatChange(DateUtil.DATA_FORMAT.FULL_DATETIME)) : value;
                        },
                        type: 'time'
                    },
                    {index: 'user_id'}
                ],
                onRowClick: function (tr, data) {
                    _this.currentPointData = data;
                    _this.statusMap.page = _this.currentPointData.type == 1 ? 'edit_bool' : 'edit_limit';
                },
                onRowDbClick: function (tr, data) {
                    _this.currentPointData = data;
                    _this.statusMap.page = _this.currentPointData.type == 1 ? 'edit_bool' : 'edit_limit';
                    _this.loadModifyCommon();
                    _this.userHasSelected = _this.currentPointData.userHasSelected;
                    //获取被推送人的手机绑定信息
                    for (var i = 0; i < _this.currentPointData.notify.length; i++) {
                        var notifiedUser = _this.currentPointData.notify[i];
                        for (var j = 0; j < _this.userData.length; j++) {
                            var user = _this.userData[j];
                            if (notifiedUser.userId === user.id) {
                                notifiedUser.isBindMobile = user.isBindMobile;
                            }
                        }
                    }
                    $("#dataAlarmBox").find(".showPushList").html(beopTmpl('tpl_data_alarm_pushList', {
                        members: _this.currentPointData.notify,
                        notifyData: true
                    }));
                    $('div[data-toggle="tooltip"]').tooltip({html: true});
                },
                onCheckboxSelect: function (checkbox, data, e) {
                    _this.currentPointData = data;
                    _this.isEnableAlarm(checkbox, data, e);
                    e.stopPropagation();
                }
            };
            if (_this.$datatable) {
                _this.$datatable.removeData();
                _this.$datatable = null;
            }
            _this.$datatable = $table.off().simpleDataTable(dataTableOptions);
        },

        converterAlarmType: function (type) {
            if (type == 1) {
                return I18n.resource.debugTools.sitePoint.BOOL_ALARM;
            } else if (type == 2) {
                return I18n.resource.debugTools.sitePoint.LIMIT_ALARM;
            }
        },

        converterAlarmStatus: function (value, type) {
            if (!value && typeof(value) != "undefined" && value != 0 || value == undefined || value == 'null') { // 为 null 或者 undefined 判断
                return '';
            }
            if (type == _this.configMap.alarmType.bool) {
                if (value == 1) {
                    return I18n.resource.debugTools.sitePoint.NORMAL_ALARM;
                } else if (value == 0) {
                    return I18n.resource.debugTools.sitePoint.ABNORMAL_ALARM;
                }
            } else {
                if (value == 1) {
                    return I18n.resource.debugTools.sitePoint.NORMAL_ALARM;
                } else if (value == 0) {
                    return I18n.resource.debugTools.sitePoint.L_LIMIT_ALARM;
                } else if (value == -1) {
                    return I18n.resource.debugTools.sitePoint.LL_LIMIT_ALARM;
                } else if (value == 2) {
                    return I18n.resource.debugTools.sitePoint.H_LIMIT_ALARM;
                } else if (value == 3) {
                    return I18n.resource.debugTools.sitePoint.HH_LIMIT_ALARM;
                }
            }
        },

        isEnableAlarm: function (checkbox, data, e) {
            Spinner.spin(document.body);
            _this.currentPointData.beused = $(checkbox).is(':checked') ? 1 : 0;
            WebAPI.post('/alarm/add', _this.currentPointData).done(function (result) {
                if (!result.success) {
                    alert(result.msg);
                }
            }).always(function () {
                Spinner.stop();
            });
        },

        refreshPointNameList: function () {
            $("#alarmPointListUl").empty().html(beopTmpl('tpl_data_alarm_name_list', {
                nameList: _this.pointNameList
            }));
        },

        getPersonnelInformation: function () {
            var addPersonnelInformation = [];
            if (_this.userHasSelected == null || !_this.userHasSelected.length) {
                return [];
            } else {
                for (var i = 0; i < _this.userHasSelected.length; i++) {
                    var personnelInformation = {
                        id: null,
                        userfullname: null,
                        useremail: null,
                        userpic: null
                    };
                    personnelInformation.id = _this.userHasSelected[i].id;
                    personnelInformation.userfullname = _this.userHasSelected[i].userfullname;
                    personnelInformation.useremail = _this.userHasSelected[i].useremail;
                    personnelInformation.userpic = _this.userHasSelected[i].userpic;
                    addPersonnelInformation.push(personnelInformation);
                }
                return addPersonnelInformation;
            }
        },
        //取数据
        pushListData: function () {
            var notify = [];
            var pushListTr = $('#pushList tbody tr');
            if (_this.userHasSelected == null || !_this.userHasSelected.length) {
                return notify;
            } else {
                for (var i = 0; i < _this.userHasSelected.length; i++) {
                    var getObject = {
                        userId: null,
                        userfullname: null,
                        useremail: null,
                        isWebSite: false,
                        isEmail: false,
                        isApp: false,
                        isSMS: false
                    };
                    var fetchIndex = pushListTr.eq(i);
                    if (fetchIndex.find('.isWebSite').is(':checked')) {
                        getObject.isWebSite = true;
                    }
                    if (fetchIndex.find('.isApp').is(':checked')) {
                        getObject.isApp = true;
                    }
                    if (fetchIndex.find('.isEmail').is(':checked')) {
                        getObject.isEmail = true;
                    }
                    if (fetchIndex.find('.isSMS').is(':checked')) {
                        getObject.isSMS = true;
                    }
                    getObject.userId = _this.userHasSelected[i].id;
                    getObject.userfullname = _this.userHasSelected[i].userfullname;
                    getObject.useremail = _this.userHasSelected[i].useremail;
                    notify.push(getObject);
                }
                return notify;
            }
        },

        loadTree: function () {
            var zTreeSetting = {
                view: {
                    selectedMulti: true
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
                    onDrag: _this.zTreeOnDrag,
                    onDrop: _this.zTreeOnDrop.bind(this)
                },
                async: {
                    enable: true,
                    type: 'post',
                    url: '/tag/getThingTree',
                    otherParam: {"projId": AppConfig.projectId, onlyGroupForRoot: true},
                    autoParam: ["_id=Prt"],
                    dataFilter: function (treeId, parentNode, responseData) {
                        return responseData.thingTree;
                    }
                }
            };
            this.tagTreePromise.done(function () {
                var tagFolderId = 15;
                _this.treeList.push({
                    id: tagFolderId,
                    name: 'Tag Structure',
                    pId: 0,
                    open: false,
                    isFolder: true,
                    isParent: true
                });
                _this.setTreeNodeIcon(_this.treeList, tagFolderId);
                _this.zTreeInstance = $.fn.zTree.init($("#apiTreeUl"), zTreeSetting, _this.treeList);
            })
        },

        zTreeOnClick: function (event, treeId, treeNode) {// event js event , treeId 父节点id, treeNode 当前节点信息

        },

        zTreeOnDrag: function (event, treeId, treeNodes) {
            if (treeNodes[0].isParent) {
                return false;
            }
        },

        zTreeOnDrop: function (e, treeId, treeNodes, targetNode, moveType) {
            if (treeNodes[0].isParent) {
                return false;
            }

            if ($(e.target).closest('#alarm_limit_high').length) {
                $("#alarm_limit_high").val(treeNodes[0].name);
            } else if ($(e.target).closest('#alarm_limit_low').length) {
                $("#alarm_limit_low").val(treeNodes[0].name);
            } else if ($(e.target).closest('.alarm-value').length) { // textarea
                $(e.target).closest('.alarm-value').val(treeNodes[0].name);
            } else if ($(e.target).closest('#alarmPointListUl').length) { // textarea
                for (var i = 0; i < treeNodes.length; i++) {
                    var node = treeNodes[i];
                    if ($.inArray(node.name, _this.pointNameList) < 0) {
                        _this.pointNameList.push(node.name);
                        _this.refreshPointNameList();
                    }
                }
            }
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

        treeSearch: function (e) {
            var val = $("#treeSearch").val().trim();
            var $apiTreeUl = $("#apiTreeUl"), $apiTreeSearchUl = $("#apiTreeSearchUl");
            if (val == '') {
                $apiTreeUl.show();
                $apiTreeSearchUl.hide();
            } else {
                if (e.keyCode === 13) {// enter search
                    WebAPI.post('/tag/search', {
                        "projId": AppConfig.projectId,
                        "searchName": val,
                        "path": "",
                        "isRecursive": true,
                        "Prt": ""
                    }).done(function (result) {
                        if (result.status) {
                            _this.treeSearchList = [];

                            for (var i = 0; i < result.thingsList.length; i++) {
                                var folderFlag, item = result.thingsList[i];
                                folderFlag = item.type && item.type == 'group' ? true : false;
                                _this.treeSearchList.push({
                                    id: ObjectId(),
                                    name: item.name,
                                    sample: item.sample ? item.sample : '',
                                    isFolder: folderFlag,
                                    isParent: folderFlag
                                });
                            }

                            var zTreeSetting = {
                                view: {
                                    selectedMulti: true
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
                                    onClick: _this.zTreeOnClick,
                                    onDrag: _this.zTreeOnDrag,
                                    onDrop: _this.zTreeOnDrop.bind(this)
                                }
                            };
                            $apiTreeUl.hide();
                            _this.zTreeSearchInstance = $.fn.zTree.init($apiTreeSearchUl, zTreeSetting, _this.treeSearchList);

                            var $span = $apiTreeSearchUl.find('a span[id$=_span]');
                            var keywordList = val.replace('/[^\w\d\s]/g', ' ').split(/\s/g);

                            $span.each(function (index, item) {
                                var $item = $(item);
                                var text = $item.text();
                                keywordList.forEach(function (char) {
                                    if (char) {
                                        text = text.replace(new RegExp("(" + char + ")(?![^<]*>|[^<>]*</)", "gi"), '<span class="search-tree-text">$1</span>');
                                    }
                                });
                                $item.html(text);
                            });

                            $apiTreeSearchUl.show();
                        } else {
                            alert('error:' + result.message);
                        }
                    }).always(function () {
                        Spinner.stop();
                    })
                }
            }
        },

        newAlarmConfirm: function () {
            if (!this.pointNameList.length) {
                alert(I18n.resource.debugTools.sitePoint.POINT_NOT_NULL);
                return;
            }
            var data = {
                projectId: AppConfig.projectId,
                type: this.statusMap.alarmType,
                grade: $("#alarm_grade").val(),
                points: this.pointNameList,
                notify: this.pushListData(),
                userHasSelected: this.getPersonnelInformation()
            };
            if (_this.statusMap.alarmType == _this.configMap.alarmType.limit) { // 高低限报警
                data.threshold = {};
                var upperVal = $("#alarm_limit_high").val().trim(),
                    lowerVal = $("#alarm_limit_low").val().trim();
                if (upperVal && lowerVal) {
                    if ($.isNumeric(upperVal) && $.isNumeric(lowerVal) && +upperVal <= +lowerVal) {
                        alert('报警上限不能低于等于报警下限！');
                        return;
                    }
                }

                if (upperVal) {
                    data.threshold.high = {};
                    if ($.isNumeric(upperVal)) {
                        data.threshold.high.type = 1; // 1:数值类型;2:点类型
                        data.threshold.high.value = Number(upperVal);
                    } else {
                        data.threshold.high.type = 2;
                        data.threshold.high.value = upperVal;
                    }
                }

                if (lowerVal) {
                    data.threshold.low = {};
                    if ($.isNumeric(lowerVal)) {
                        data.threshold.low.type = 1;
                        data.threshold.low.value = Number(lowerVal);
                    } else {
                        data.threshold.low.type = 2;
                        data.threshold.low.value = lowerVal;
                    }
                }
            }
            this.requestAlarmAdd(data, '添加成功');
        },

        boolAlarmConfirm: function () {
            _this.currentPointData.grade = parseInt($("#alarm_grade").val());
            _this.currentPointData.advice = parseInt($("#alarm_advice").val());
            _this.currentPointData.msg = $("#alarm_msg").val();
            _this.currentPointData.interval = $("#alarm_interval").val();
            if ($("#freeTime").is(':checked')) {
                _this.currentPointData.isSilent = 1;
            } else {
                _this.currentPointData.isSilent = 0;
            }
            _this.currentPointData.silentTime = {
                startTime: $("#freeTimeStart").val(),
                endTime: $("#freeTimeEnd").val()
            };
            _this.currentPointData.notify = this.pushListData();
            _this.currentPointData.userHasSelected = this.getPersonnelInformation();
            this.requestAlarmAdd(_this.currentPointData, '修改成功');
        },

        limitAlarmConfirm: function () {
            var heightHeightValue = $("#heightHeightValue").val().trim(),
                heightValue = $("#heightValue").val().trim(),
                lowValue = $("#lowValue").val().trim(),
                lowLowValue = $("#lowLowValue").val().trim(),
                valueArr = [];

            var valueIsNaN = function (value, name) {
                if (value) {
                    !isNaN(value) && valueArr.push({"value": Number(value), 'name': name});
                }
            };
            valueIsNaN(heightHeightValue, "高高报限值");
            valueIsNaN(heightValue, "高报限值");
            valueIsNaN(lowValue, "低报限值");
            valueIsNaN(lowLowValue, "低低报限值");
            var iLen = valueArr.length;
            if (iLen > 1) {
                for (var i = 1; i < iLen; i++) {
                    if (valueArr[i - 1].value < valueArr[i].value) {
                        alert(valueArr[i - 1].name + '不能低于' + valueArr[i].name);
                        return;
                    }
                }
            }
            _this.currentPointData.duration = $("#alarm_duration").val();

            if (_this.currentPointData.duration < 0) {
                alert('持续时间不能为负');
                return;
            }

            _this.currentPointData.interval = $("#alarm_interval").val();
            if ($("#freeTime").is(':checked')) {
                _this.currentPointData.isSilent = 1;
            } else {
                _this.currentPointData.isSilent = 0;
            }
            _this.currentPointData.silentTime = {
                startTime: $("#freeTimeStart").val(),
                endTime: $("#freeTimeEnd").val()
            };

            _this.currentPointData.notify = this.pushListData();
            _this.currentPointData.userHasSelected = this.getPersonnelInformation();
            var threshold = {
                highhigh: {},
                high: {},
                low: {},
                lowlow: {}
            };
            var $alarmSetBox = $("#dataAlarmForm").find('.alarm-set-box');
            for (var i = 0; i < $alarmSetBox.length; i++) {
                var type, $item = $alarmSetBox.eq(i);
                var val = $item.find('.alarm-value').val().trim(),
                    grade = parseInt($item.find('.alarm-grade').val()),
                    advice = $item.find('.alarm-advice').val(),
                    msg = $item.find('.alarm-msg').val();

                if ($.isNumeric(val)) {
                    type = 1;
                    val = Number(val);
                } else {
                    type = 2;
                }
                if (i == 0) {
                    threshold.highhigh.type = type;
                    threshold.highhigh.value = val;
                    threshold.highhigh.grade = grade;
                    threshold.highhigh.advice = advice;
                    threshold.highhigh.msg = msg;
                } else if (i == 1) {
                    threshold.high.type = type;
                    threshold.high.value = val;
                    threshold.high.grade = grade;
                    threshold.high.advice = advice;
                    threshold.high.msg = msg;
                } else if (i == 2) {
                    threshold.low.type = type;
                    threshold.low.value = val;
                    threshold.low.grade = grade;
                    threshold.low.advice = advice;
                    threshold.low.msg = msg;
                } else if (i == 3) {
                    threshold.lowlow.type = type;
                    threshold.lowlow.value = val;
                    threshold.lowlow.grade = grade;
                    threshold.lowlow.advice = advice;
                    threshold.lowlow.msg = msg;
                }
            }
            _this.currentPointData.threshold = threshold;
            this.requestAlarmAdd(_this.currentPointData, '修改成功');
        },

        requestAlarmAdd: function (data, msg) {
            Spinner.spin(document.body);
            data.type = parseInt(data.type); // 强制转为整数
            WebAPI.post('/alarm/add', data).done(function (result) {
                if (result.success) {
                    _this.$treeDomDetach = $("#dmSysTreeInner").detach();
                    if (_this.statusMap.page == 'new') {
                        _this.currentPage = 1;
                    }
                    alert(msg);
                    $('#dataAlarmBox').html(beopTmpl('tpl_data_alarm_list'));
                    _this.statusMap.page = 'list';
                    _this.loadSheet();
                    I18n.fillArea(_this.$alarmBox);
                } else {
                    alert(result.msg);
                }
            }).always(function () {
                Spinner.stop();
            });
        },

        // edit html tpl
        loadModifyCommon: function () {
            this.$alarmListDetach = this.$alarmBox.children().detach();
            this.$alarmBox.html(beopTmpl('tpl_data_alarm_modify'));
            _this.pointNameList = [];
            $("#data_alarm_content").html(beopTmpl('tpl_data_alarm_' + this.statusMap.page));
            if (this.$treeDomDetach) {
                $("#dmSysTree").html(this.$treeDomDetach);
            } else {
                this.loadTree();
            }

            if (this.statusMap.page != this.configMap.page.new) { // 编辑窗口
                $("#freeTimeStart").datetime(this.timeFormat);
                $("#freeTimeEnd").datetime(this.timeFormat);
                this.loadEditData();
            }
            I18n.fillArea(_this.$alarmBox);
        },

        loadEditData: function () {
            var $interval = $("#alarm_interval"), $silentTimeStart = $("#freeTimeStart"),
                $silentTimeEnd = $("#freeTimeEnd");
            if (this.currentPointData.duration) {
                $("#alarm_duration").val(this.currentPointData.duration);
            }
            if (this.currentPointData.silentTime) {
                $silentTimeStart.val(this.currentPointData.silentTime.startTime);
                $silentTimeEnd.val(this.currentPointData.silentTime.endTime);
            }

            if (this.currentPointData.isSilent) {
                $('#freeTime').prop('checked', true);
                $silentTimeStart.attr('disabled', false);
                $silentTimeEnd.attr('disabled', false);
            } else {
                $silentTimeStart.attr('disabled', true);
                $silentTimeEnd.attr('disabled', true);
            }

            $("#alarmPointName").val(this.currentPointData.point);
            if (this.currentPointData.interval) {
                $interval.val(this.currentPointData.interval);
            }
            if (this.currentPointData.type == this.configMap.alarmType.bool) { // 布尔量报警
                $("#alarm_msg").val(this.currentPointData.msg);
                $("#alarm_grade").val(this.currentPointData.grade);
                $("#alarm_advice").val(this.currentPointData.advice);
            } else { // 高低限报警
                var $alarmSetBox = $("#dataAlarmForm").find('.alarm-set-box');
                var threshold = this.currentPointData.threshold;
                for (var i = 0; i < $alarmSetBox.length; i++) {
                    var $item = $alarmSetBox.eq(i);
                    var $value = $item.find('.alarm-value'),
                        $grade = $item.find('.alarm-grade'),
                        $advice = $item.find('.alarm-advice'),
                        $msg = $item.find('.alarm-msg');
                    if (i == 0) {
                        if (threshold.highhigh) {
                            $value.val(threshold.highhigh.value);
                            $grade.val(threshold.highhigh.grade);
                            $advice.val(threshold.highhigh.advice);
                            $msg.val(threshold.highhigh.msg);
                        }
                    } else if (i == 1) {
                        if (threshold.high) {
                            $value.val(threshold.high.value);
                            $grade.val(threshold.high.grade);
                            $advice.val(threshold.high.advice);
                            $msg.val(threshold.high.msg);
                        }
                    } else if (i == 2) {
                        if (threshold.low) {
                            $value.val(threshold.low.value);
                            $grade.val(threshold.low.grade);
                            $advice.val(threshold.low.advice);
                            $msg.val(threshold.low.msg);
                        }
                    } else if (i == 3) {
                        if (threshold.lowlow) {
                            $value.val(threshold.lowlow.value);
                            $grade.val(threshold.lowlow.grade);
                            $advice.val(threshold.lowlow.advice);
                            $msg.val(threshold.lowlow.msg);
                        }
                    }
                }
            }
        },

        showInfoTable: function () { // 显示表格
            var getSelectedDataList = _this.$datatable.simpleDataTable('getSelectedData');
            if (!getSelectedDataList.length) {
                alert(i18n_resource.common.SELECT_RECORDS_REQUIRED);
                return;
            }

            var $alarmInfoTable = $("#alarmInfoTable");
            var pageSizeIndex, date_start, data_end,
                $pageSizeSelect = $alarmInfoTable.find(".pageSizeSelect");
            if ($pageSizeSelect.length) {
                pageSizeIndex = $pageSizeSelect.find("option:selected").index();
            } else {
                pageSizeIndex = 1;
            }

            if (localStorage.getItem('alarmInfoStartDate')) {
                date_start = localStorage.getItem('alarmInfoStartDate');
                data_end = localStorage.getItem('alarmInfoEndDate');
            } else {
                date_start = new Date(new Date() - 30 * 24 * 60 * 60 * 1000).format("yyyy-MM-dd HH:mm:00");
                data_end = new Date().format("yyyy-MM-dd HH:mm:00");
            }
            var idList = [];
            for (var i = 0; i < getSelectedDataList.length; i++) {
                idList.push(getSelectedDataList[i]._id);
            }

            var dataTableOptions = {
                url: _this.ExpertContainerUrl + 'alarm/history',
                postData: {
                    projId: AppConfig.projectId,
                    alarm_id: JSON.stringify(idList),
                    s_time: date_start,
                    e_time: data_end
                },
                searchOptions: {
                    pageSize: 'pageSize',
                    pageNum: 'pageNum'
                },
                rowsNums: [50, 100, 200, 500, 1000],
                pageSizeIndex: pageSizeIndex,
                dataFilter: function (result) {
                    if (result) {
                        return result;
                    }
                },
                onBeforeRender: function () {
                    Spinner.spin(document.body);
                },
                onAfterRender: function () {
                    Spinner.stop();
                },
                colNames: ['报警点名', '报警类型', '报警状态', '报警时间'],
                colModel: [
                    {index: 'pointName'},
                    {
                        index: 'alarm_type',
                        converter: function (value) {
                            return _this.converterAlarmType(value);
                        }
                    },
                    {
                        index: 'alarm_result',
                        converter: function (value, row) {
                            return _this.converterAlarmStatus(value, row.type);
                        }
                    },
                    {index: 'alarm_time'}
                ]
            };
            if (_this.$dataInfoTable) {
                _this.$dataInfoTable.removeData();
                _this.$dataInfoTable = null;
            }

            $("#alarmInfoModal").modal();
            _this.$dataInfoTable = $alarmInfoTable.off().simpleDataTable(dataTableOptions);
        },

        requestUserMap: function () {
            WebAPI.get('/workflow/group/user_team_dialog_list/' + window.parent.AppConfig.userId).done(function (result) {
                if (result.success) {
                    _this.userData = result.data;
                }
            }).fail(function () {
                alert('服务器请求出错');
            });
        },

        attachEvents: function () {
            this.$alarmBox.off('click.point_edit').on('click.point_edit', '#point_edit', function () {
                if (_this.currentPointData && _this.currentPointData.type) {
                    _this.statusMap.page = _this.currentPointData.type == 1 ? 'edit_bool' : 'edit_limit';
                    _this.loadModifyCommon();

                    $("#dataAlarmBox").find(".showPushList").html(beopTmpl('tpl_data_alarm_pushList', {
                        members: _this.currentPointData.notify,
                        notifyData: true
                    }));
                }
            });

            this.$alarmBox.off('click.point_add').on('click.point_add', '#point_add', function () {
                _this.statusMap.page = _this.configMap.page.new;
                if (_this.statusMap.page == 'new') {
                    _this.userHasSelected = [];
                }
                _this.loadModifyCommon();
            });

            this.$alarmBox.off('click.point_delete').on('click.point_delete', '#point_delete', function () {
                var getSelectedDataList = _this.$datatable.simpleDataTable('getSelectedData');
                if (!getSelectedDataList.length) {
                    alert(i18n_resource.common.SELECT_RECORDS_REQUIRED);
                    return;
                }

                confirm(I18n.resource.debugTools.sitePoint.IS_DELETE_POINTS, function () {
                    Spinner.spin(document.body);
                    var pidList = [];
                    for (var i = 0; i < getSelectedDataList.length; i++) {
                        pidList.push(getSelectedDataList[i]._id);
                    }

                    WebAPI.post('/alarm/delete', {
                        _id: pidList
                    }).done(function (result) {
                        if (result.success) {
                            _this.loadSheet(_this.currentPage);
                        } else {
                            alert(I18n.resource.debugTools.info.DELETE_FAILED + ':' + result.msg);
                            Spinner.stop();
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                });
            });

            this.$alarmBox.off('click.alarm-type').on('click.alarm-type', '.alarm-type', function () {
                var $alarm_new_limit_box = $("#alarm_new_limit_box");
                _this.statusMap.alarmType = $(this).val();
                if ($(this).val() == _this.configMap.alarmType.bool) { // 报警类型
                    $alarm_new_limit_box.hide();
                } else {
                    $alarm_new_limit_box.show();
                }
            });

            this.$alarmBox.off('click.freeTime').on('click.freeTime', '#freeTime', function () {
                var $startTime = $("#freeTimeStart"), $endTime = $("#freeTimeEnd");
                if ($("#freeTime").is(':checked')) {
                    $startTime.attr('disabled', false);
                    $endTime.attr('disabled', false);
                    if (!$startTime.val()) {
                        $startTime.val('22:00');
                    }
                    if (!$endTime.val()) {
                        $endTime.val('06:30');
                    }
                } else {
                    $startTime.attr('disabled', true);
                    $endTime.attr('disabled', true);
                }
            });

            this.$alarmBox.off('click.dataAlarmConfirm').on('click.dataAlarmConfirm', '#dataAlarmConfirm', function () {
                if (_this.statusMap.page == _this.configMap.page.new) { // 新建
                    _this.newAlarmConfirm();
                } else if (_this.statusMap.page == _this.configMap.page.edit_bool) {
                    _this.boolAlarmConfirm();
                } else if (_this.statusMap.page == _this.configMap.page.edit_limit) {
                    _this.limitAlarmConfirm();
                }
            });

            this.$alarmBox.off('click.dataAlarmCancel').on('click.dataAlarmCancel', '#dataAlarmCancel', function () {
                if (_this.$alarmListDetach) {
                    _this.$treeDomDetach = $("#dmSysTreeInner").detach();
                    _this.$alarmBox.empty().html(_this.$alarmListDetach);
                }
            });

            this.$alarmBox.off('click.alarm-point-remove').on('click.alarm-point-remove', '.alarm-point-remove', function () {
                for (var i = 0; i < _this.pointNameList.length; i++) {
                    if ($(this).closest('.alarm-point-li').find('.alarm-point-name').text() == _this.pointNameList[i]) {
                        _this.pointNameList.splice(i, 1);
                        break;
                    }
                }
                _this.refreshPointNameList();
            });

            this.$alarmBox.off('click.wf-people-add').on('click.wf-people-add', '.wf-people-add', function () {
                beop.view.memberSelected.init($("#dataManagerContainer"), {
                    configModel: {
                        userMemberMap: _this.userData,
                        userHasSelected: _this.userHasSelected,
                        cb_dialog_hide: function (addedUserList) {
                            var thePreviousNotifyDate = _this.pushListData();
                            _this.userHasSelected = addedUserList;
                            var hasNotifyData = false;
                            if (thePreviousNotifyDate.length) {
                                for (var i = 0; i < addedUserList.length; i++) {
                                    var addedUser = addedUserList[i];
                                    addedUser.isWebSite = true;
                                    addedUser.isEmail = true;
                                    for (var j = 0; j < thePreviousNotifyDate.length; j++) {
                                        var oldNotifiedUser = thePreviousNotifyDate[j];
                                        if (oldNotifiedUser.userId == addedUser.id) {
                                            $.extend(addedUser, oldNotifiedUser);
                                        }
                                    }
                                }
                                hasNotifyData = true;
                            }
                            $("#pushList").html(beopTmpl('tpl_data_alarm_pushList', {
                                members: addedUserList,
                                notifyData: hasNotifyData
                            }));
                        }
                    }
                });
            });

            this.$alarmBox.off('keydown.treeSearch').on('keydown.treeSearch', '#treeSearch', _this.treeSearch);
            this.$alarmBox.off('click.showInfoTable').on('click.showInfoTable', '#showInfoTable', _this.showInfoTable);
        },
        detachEvents: function () {
            this.$alarmBox.off('keydown.treeSearch');
        }
    };

    $.extend(PointManagerDataAlarm.prototype, PointManagerDataAlarmFunc);

    return PointManagerDataAlarm;
})();

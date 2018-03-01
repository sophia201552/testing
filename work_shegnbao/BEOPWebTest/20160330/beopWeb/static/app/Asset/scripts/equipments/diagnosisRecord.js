/**
 * Created by vicky on 2016/1/28.
 */

try {
    if (ElScreenContainer) {
    }
} catch (e) {
    ElScreenContainer = document.body;
}

try {
    if (AppConfig) {
    }
} catch (e) {
    AppConfig = {
        userId: 1
    }
}

try {
    if (I18n) {
    }
} catch (e) {
    I18n = function () {

    };
    I18n.getI18nValue = function (i18nKey) {
        if (!i18nKey) {
            return '';
        }
        var arrPath = i18nKey.split('.');

        var text = this.resource;
        for (var j = 0; j < arrPath.length; j++) {
            text = text && text[arrPath[j]];
        }
        return text;
    };

    I18n.fillArea = function (element) {
        var arrElement = element.find('[i18n]');
        for (var i = 0, len = arrElement.length; i < len; i++) {
            var i18nValue = arrElement[i].attributes["i18n"];
            var items = i18nValue.value.split(';'), item, attrMap;
            for (var j = 0; j < items.length; j++) {
                item = items[j];
                if (!item) {
                    continue;
                }
                if (item.indexOf('=') === -1) {
                    i18nValue = I18n.getI18nValue(item);
                    arrElement[i].innerHTML = i18nValue;
                } else {
                    attrMap = item.split('=');
                    if (!attrMap[0]) {
                        continue;
                    }
                    arrElement[i].setAttribute(attrMap[0], I18n.getI18nValue(attrMap[1]));
                }
            }
        }
    };

    I18n.resource = {
        common: {
            CONFIRM:'确认',
            CANCEL:'取消'
        },
        workflow: {
            nav: {
                LINK_HOME: "",
                LINK_NOTICE: "",
                LINK_REPORT: "",
                LINK_TEAM: "",
                LINK_EFFICIENCY: "",
                LINK_MINE: ""
            },
            pageInfo: {
                TITLE_MAIN_PAGE: "项目",
                TITLE_WO_DYNAMIC: "工单动态",
                TITLE_WEEK_REPORT: "周报",
                TITLE_TEAM: "团队",
                TITLE_EFFIC: "效率",
                TITLE_SCHEDULER: "日程",
                TITLE_WO_MY: "我的工单",
                PEOPLE_SEL: "人员筛选",
                GROUP: "组",
                MEMBER: "成员",
                ALL_MEMBER: "所有成员",
                NEWS: "最新动态",
                LOAD_MORE: "加载更多",
                SET: "设置",
                PROJECT_TEAM: '项目团队',
                STAFFING: '人员配置',
                WORKFLOW_MANAGE: '工单管理'
            },
            main: {
                ADD: "添加新工单",
                ALARM_CONTENT: "描述",
                NEW: "新任务",
                CLOSED: '已关闭',
                ASSIGNED: "已分配",
                DEALING: "正在处理",
                PAUSED: "已暂停",
                FINISHED: "已完成",
                DELETED: "已删除",
                SAVE: "保存",
                CANCEL: "取消",
                NAME_NOT_NULL: "名称不能为空",
                ALL: "所有工单",
                MAIN_PAGE: "项目列表",
                NOTE: "注意!",
                DEL_SURE: "是否真的要删除这个工单?",
                SURE: "确定",
                SUM: "总共",
                DELAY: "延迟",
                ADD_FAULT: "添加工单",
                FAULT_TITLE: "工单标题",
                FAULT_INFO: "工单详情",
                PEOPLE: "人员",
                EDIT: "编辑",
                DELETE: "删除",
                TIP1: "此工单尚未分配人员，请先分配人员。",
                TIP2: "这个工单尚未分配人员!",
                FINISH_TIME_NOT_NULL: "完成时间不能为空",
                PEOPLE_NOT_NULL: "人员不能为空",
                FINISH_TIME: "完成时间",
                ADD_SUCCESS: "添加成功",
                CREATE_TASK: "创建任务",
                FINISH: "完成",
                START: "开始",
                RESTART: "重新开始",
                PAUSE: "暂停",
                ASSIGN_AGAIN: '重新分配',
                WORK_ORDER_DELETED: '此工单已被删除',
                PROJECT_TEAM: '项目团队',
                PROJECT: '项目',
                ADD_NEW_PROJECTTEAM: '添加新项目团队',
                DUEDATE_NOT_NULL: '截止时间不能为空',
                GROUP_NOT_NULL: '任务组不能为空',
                EXECUTOR_NOT_NULL: '执行人不能为空',
                THE_WORK_ORDER: '工单',
                IS_CREATED_SUCCESSFULLY: '创建成功',
                CREATE_WORKFLOW_FAILED: '创建失败',
                NEW_FAULT_ORDER: '新建故障工单',
                NEW_TASK_GROUP: '新建任务组'
            },
            process: {
                ASSIGNMENT_TASK: '分配任务',
                FORWARD: '转发',
                PROCESSING: '处理中...',
                COMPLETE: '完成',
                VERIFY: '验证',
                END: "停止"
            },
            notice: {
                DYNAMIC_TIME: "动态时间",
                COOLER_ALARM_FAULT: "冷机报警故障",
                TASK_RENAME: "改名为",
                TASK_MODIFY: "修改为",
                TASK_EDIT: "编辑了任务",
                TASK_FINISH: "完成了任务",
                TASK_RESTART: "重启了任务",
                TASK_START: "开始了任务",
                TASK_PAUSE: "暂停了任务",
                TASK_REPLY: "回复了任务",
                TASK_CREATE: "创建了任务",
                TASK_VERIFIED: "验证了任务",
                TASK_CLOSED: '关闭了任务',
                TASK_VERIFIED_FAILED: '验证未通过',
                TASK_DELETE: '删除了任务',
                TASK_FORWARD: '转发了任务',
                TASK_ASSIGN_TIME: "分配时间",
                NO_FOUND: "没有找到符合过滤条件的内容",
                ORDER_STATUS: "工单动态",
                ORDER: "工单",
                DEADLINE: "截止时间",
                FAULT_CHART: "故障曲线图",
                TOPIC: "话题讨论",
                COMMENTS: "发表评论",
                REPLAY_ORDER: "回复任务",
                BACK: "后退",
                FAULT_CURVE: "故障曲线",
                WORK_ORDER_HISTORY: "工单历史记录",
                CREATOR: '创建者',
                PROCESS_RECORD: '工单流程记录',
                DELETE_REPLY: "删除了评论"
            },
            record: {
                FINISH: "完成",
                START: "开始",
                ASSIGNED: "分配",
                CREATE: "创建",
                VERIFIED: "验证"
            },
            report: {
                WORKFLOW_SEL: "工单筛选",
                PEOPLE_SEL: "人员筛选",
                PROJ_NAME: "项目名称",
                ALL_TASK_NUM: "总任务量",
                UNFINISH_NUM: "未完成量",
                FINISH_SCALE: "完成比例",
                MAJOR_PEOPLE: "主要完成人员",
                ALL_DEAL_NUM: "总处理量",
                FINISH_NUM: "完成量",
                COOLER_FAULT_ALARM: "冷机故障报警",
                SHOW_TEXT: "双击页面对比,画面有明显比,画面有明显不同,以提示操作者是",
                FINISH: "完成",
                UNFINISH: "未完成",
                LOAD_MORE: "加载更多",
                MONTH: "月",
                WEEK: "周",
                DAY: "日",
                TITLE_TIME1: "年第",
                TITLE_TIME2: "{0}年第{1}周",
                TITLE_TIME3: "{0}{1}日~{2}{3}日"
            },
            mine: {
                CHECK_COMPLETED: "查看已完成",
                TASK: "任务",
                STARRED: "星标",
                CANCEL_STARRED: "取消星标",
                CATEGORY: "分类",
                TASK_TYPE_NEW_TASK: "新任务",
                TASK_TYPE_URGENT_TASK: "紧急任务",
                TASK_TYPE_PEND_TASK: "以后需处理任务",
                TASK_EMPTY_MESSAGE_NEW_TASK: "当前没有新任务",
                TASK_EMPTY_MESSAGE_URGENT_TASK: "紧急的任务请拖拽到这里",
                TASK_EMPTY_MESSAGE_PEND_TASK: "以后需处理的任务请拖拽到这里",
                TASK_STATUS_NEW: "新任务",
                TASK_STATUS_DISTRIBUTED: "已分配",
                TASK_STATUS_PROCESSING: "正在处理",
                TASK_STATUS_PAUSED: "已暂停",
                TASK_STATUS_COMPLETED: "已完成",
                SAVE: "保存",
                CANCEL: "取消",
                ASSIGN_ORDER: "我创建的",
                WORK_ORDER_TITLE: "工单主题",
                STATUS: "状态",
                DEADLINE: "截止日期",
                CREATE_DATE: "创建日期",
                WORK_ORDER_NAME: "工单名",
                ALL_ORDER: "全部",
                EXECUTOR: "执行人"
            },
            efficiency: {
                TOTAL_TASK_EFFICIENCY_STATISTICS: "总任务效率统计",
                END_TIME: "截止日期：",
                GATHER_ALL: "汇总",
                TOTAL_QUANTITY_OF_TASK_1: "总任务量：",
                DELAY_QUANTITY_OF_TASK_1: "延误任务量：",
                DELAY_RATE_1: "延误率：",
                PROJECT_TOTAL: "项目汇总",
                PROJECT_NAME: "项目名称",
                TOTAL_QUANTITY_OF_TASK_2: "总任务量",
                UNCOMPLETED_QUANTITY_OF_TASK: "未完成量",
                COMPLETION_RATE: "完成比例",
                DELAY_QUANTITY_OF_TASK_2: "延误任务量",
                DELAY_RATE_2: "延误率",
                MORE: "更多",
                TASK_DIAGRAM: "任务图表",
                WITHOUT_DELAY: "未延误：",
                DELAY: "延误：",
                LOADING: "正在加载……",
                THIS_MONTH: "本月",
                TOTAL: "累计",
                LAST_MONTH: "上月",
                HIDE: "隐藏",
                VIEW: "展开"
            },
            team: {
                WORKFLOW_FILTER: "工单筛选：",
                WORKFLOW: "工单：",
                DEPARTMENT_STAFF: "部门人员",
                DELETE: "删除",
                STAFF_ASSIGNMENT: "分配人员",
                SAVE: "保存",
                CANCEL: "取消",
                TIP1: "无法删除最后一个管理员",
                TIP2: "已无人员可以分配此角色！"
            },
            urgencyLevel: {
                URGENCY_LEVEL: "紧急程度",
                0: "一般",
                1: "严重",
                2: "紧急",
                URGENCY_LEVEL_REQUIRED: "紧急程度不能为空"
            },
            taskStatus: {
                0: "新任务",
                1: "执行中",
                2: "待审核(停止)",
                3: "待审核(完成)",
                4: "审核不通过(停止)",
                5: "审核通过(完成)",
                6: "审核通过(停止)",
                7: '审核不通过(完成)',
                8: ''
            },
            navigation: {
                TASK: "任务",
                NEW_CREATED: '已创建',
                IN_DOING: '正在执行',
                WAIT_VERIFY: '待审核',
                WF_GROUP_EDIT: "编辑任务组",
                WF_GROUP_SEE: '查看任务组',
                WF_TASK_ADD: '添加任务',
                WORKING_TASK: '进行中的工单',
                FINISH_BY: '已结束的工单',
                STOPED_BY: '停止的工单',
                COMPLETED_BY: '完成的工单',
                CREATED_BY: '我创建的工单',
                JOINED_BY: '我参与的工单',
                WF_GROUP_ADD: '添加任务组',
                MY_COLLECTION: '我的收藏',
                TAG: '标签',
                GROUP: '我的任务组',
                SEARCH: '我的搜索结果',
                WAIT_ME_TO_VERIFIER: "等待本人验证",
                START_TASK_SUCCESS: '开始任务成功',
                START_TASK_FAILED: '开始任务失败'
            },
            insert: {
                SELECT_PROJECT: "选择项目",
                EXECUTOR: "执行人",
                LEVEL: "严重程度",
                CONFIRM: "提交",
                DEADLINE_REQUIRED: "截止时间不能为空",
                TITLE_REQUIRED: "标题不能为空"
            },
            calendar: {
                TEAM: '团队',
                INDIVIDUAL: '个人',
                TASK_POOL: '任务池',
                EMERGENCY: '紧急',
                NOT_URGENT: '不紧急',
                TODAY: '今天',
                TOMORROW: '明天',
                THIS_WEEK: '本周',
                THIS_MONTH: '本月',
                THIS_YEAR: '今年',
                All: '全部',
                THIS_SEASON: '本季度',
                YESTERDAY: '昨日',
                NO_TASK: '没有任务',
                ADD_SCHEDULER: '已加入日程',
                ORDER_CREATION_SUCCESS: '工单创建成功',
                DATE_ERROR_INFO: '开始日期不得大于结束日期',
                SAVE_FAILED: '保存失败',
                NO_TITLE: '无标题',
                COLOR: '颜色',
                AREA: '区域',
                DESCRIPTION: '描述',
                EQUIPMENT_NAME: '设备名称',
                URGENCY_LEVEL: '紧急程度',
                TIME_START: '起始时间',
                TIME_END: '结束时间',
                REMIND: '提醒',
                PROJECT_NAME: '项目名',
                POINT_VALUE: '点值',
                OWNER: '拥有者',
                TITLE: '标题',
                EDIT: '编辑',
                DELETE: '删除',
                SAVE: '保存',
                CREATE_WORKFLOW: '创建工单',
                ONE_MONTH: '一个月',
                TWO_MONTH: '两个月',
                THREE_MONTH: '三个月',
                HALF_YEAR: '半年',
                OVERDUE_TIME: '逾期时间',
                FAULT_TIME: '故障时间',
                GENERAL: '一般',
                SERIOUS: '严重',
                PLEASE_SELECT_AREA: '请选择区域'
            },
            set: {
                EMAIL_NOTIFICATION_OPTION: "邮件通知选项",
                TASK_COMMENTED_UPON: "任务被评论时",
                TASK_ABOUT_EXPIRE: "任务即将到期时",
                ASSIGNMENT_COMPLETE: "指派任务完成时",
                ASSIGNMENT_STARTS: "指派任务开始时",
                TASK_SUSPENDED: '指派任务暂停时',
                ASSIGNMENT_REVIEWED: '指派任务被评论时',
                SELECT_LEAST_ONE: '请至少选择一个选项',
                CONFIRM: '确定'
            },
            activities: {
                ACTIVITIES: '动态',
                TODAY: '今日',
                RECENTLY_COMPLETE: '最近完成',
                RECENTLY_CREATED: '最近创建',
                REVIEW: ' 评论 ',
                ADD_REVIEW: '添加评论',
                CANCEL_REVIEW: '取消评论'
            },
            common: {
                NEW: "新任务",
                DEALING: "正在处理",
                PAUSED: "已暂停",
                FINISHED: "已完成",
                CONFIRMATION: '验证通过',
                VERIFIED: '已验证',
                CANCEL: "取消",
                CONFIRM: '确认',
                PROMPT: '提示',
                DELETE_IT: '确认删除么',
                NUMBER: '编号',
                DEADLINE: '截止时间',
                EXECUTOR: "执行人",
                CREATOR: '创建者',
                TITLE_REQUIRED: '标题不能为空',
                DETAIL_REQUIRED: '详情不能为空',
                DEADLINE_REQUIRED: '截止时间不能为空',
                GROUP_NAME_REQUIRED: '任务组名不能为空'
            },
            task: {
                WORKFLOW_IN_STOP: '停止的工单',
                WORKFLOW_IN_COMPLETE: '完成的工单',
                WORKFLOW_IN_PROGRESS: '进行中的工单',
                WORKFLOW_CREATED_BY_ME: '我创建的工单',
                WORKFLOW_COMPLETE_BY_ME: '已结束的工单',
                WORKFLOW_INVOLVED_BY_ME: '我参与的工单',
                ADD_NEW_TASK: '添加任务',
                MY_TAGS: '标签',
                ALL_TASK_GROUP: '全部任务组',
                TASK_GROUP_CREATED_BY_ME: '我创建的任务组',
                TASK_GROUP_INVOLVED_BY_ME: '我参与的任务组',
                ADD_NEW_TASK_GROUP: '添加任务组',
                EDIT_TASK_GROUP: '编辑任务组',
                DELETE_TASK_GROUP: '删除任务组',
                SEE_TASK_GROUP_INFO: '查看任务组信息',
                UPDATE: '更新',
                SAVE: '保存',
                TASK_GROUP_NAME: '任务组名称',
                DESCRIPTION_OF_TASK_GROUP: '任务组描述',
                CREATE_TIME: '创建时间',
                OLD_TASK_GROUP_NO_TIME: '旧任务组没有记录创建时间',
                CREATED_PERSON: '创建人',
                HAS_CREATED: '已创建',
                IN_DOING: '执行中',
                WAITING_VERIFIER: "待审核",
                MY_VERIFIER: "本人审核",
                MEMBERS: '成员',
                TASK_GROUP: '任务组',
                SERIAL_NUMBER: '编号',
                COLLECT: '收藏',
                BACK: '返回',
                FINISH_INFO: '点击完成后会进入审核流程',
                PASS: '通过',
                NOT_PASS: '不通过',
                TOMORROW: '明天',
                OVERDUE: '逾期',
                DAY: '天',
                STARING: '是否收藏',
                VERIFIERS: '审核人',
                WATCHERS: '相关人员',
                TAGS: '标签',
                SEE: '查看',
                SELECT_TASK_GROUP: '请选择所属工单组',
                CHECK_TASK_INFO: '请输入工单详情',
                ADD_TAGS_INFO: '一个任务最多只能添加三个标签，且标签名为十个字以内。',
                SELECTED_DUE_DATE_INFO: '请选择截止时间',
                INPUT_TASK_TITLE_INFO: '请输入工单名称',
                TASK_PROGRESS: '工单进程',
                SELECT_TAG_NAME_INFO: '请选择标签名',
                DEL_TASK_GROUP_TIPS: '提示',
                DEL_TASK_GROUP_COMMIT: '确认删除么？',
                VERIFIER_PASS: '审核通过',
                VERIFIERS_NOT_PASS: '审核不通过',
                TASK_NOT_EXIST_INFO: '任务不存在，可能已被删除',
                FILTER: 'Filter',
                IN_PROGRESS: '进行中',
                COMPLETED: '已完成',
                GET_MORE: '加载更多',
                NO_TASK_GROUP_INFO: '您当前没有项目团队，无法创建工单。请创建一个项目团队后尝试创建工单',
                GO_TASK_GROUP_TITLE: '前往工单系统',
                ENTER_TAG_NAME_INFO: '请输入标签名',
                EDIT_TAG_NAME_INFO: '请输入标签名',
                NO_DESCRIPTION: '没有任务组描述',
                MY_COLLECT: '我的收藏',
                HAS_COLLECTED: '已收藏',
                NOT_COLLECTED: '未收藏',
                SEARCH: '搜索',
                MY_SCHEDULER: '我的日程',
                GROUP_TYPE: '群组类型',
                JOINED: '我加入的',
                MANAGED: '我管理的',
                NEW_GROUP: '新建群组',
                STATUS: '状态',
                EDIT_TASK_GROUP_BTN: '更新',
                NO_GROUP_PROMPT: '工单从属于任务组，您的账号暂无任务组，需要先添加任务组。',
                EDIT_GROUP_SUCCESS: "编辑任务组成功！",
                ADD_GROUP_SUCCESS: "添加任务组成功！",
                FAULT_CURVE: "故障曲线",
                ATTACHMENT_INFO: '添加附件',
                ATTACHMENT: '附件',
                ATTACHMENT_TYPE_PIC: '图片',
                ATTACHMENT_TYPE_FILE: '文档',
                ATTACHMENT_FILE_SIZE_INFO: '单个文件上传最大不能超过5MB',
                ATTACHMENT_FILE_AMOUNT_INFO: '超过最大上传数量',
                ATTACHMENT_FILE_ERROR_INFO_SIZE: '上传文件不得大于5MB',
                ATTACHMENT_FILE_FAIL_INFO: '上传文件失败',
                ATTACHMENT_FILE_SUCCESS_INFO: '上传文件成功',
                ATTACHMENT_DELETE_FAIL_INFO: '删除附件失败',
                ATTACHMENT_DELETE_SUCCESS_INFO: '删除附件成功',
                ATTACHMENT_DELETE_NOTE: '你确定删除这个附件吗？',
                ATTACHMENT_TITLE: '文件上传',
                ATTACHMENT_FILE_INFO_TEXT: '共{0}个附件（{1}mb），{2}</span>个上传成功',
                TITLE: '标题'
            },
            memberSelected: {
                TITLE: "请选择人员",
                INPUT_INFO: "请输入用户名称",
                ALL: '全部',
                MEMBER_SELECTED: '已选成员'
            }
        }
    };

    beop = {
        model: {
            stateMap: {
                groupId: 1
            }
        }
    }
}
var DiagnosisRecord = (function () {

    function DiagnosisRecord() {
        var _this = this;

        var data = [{
            "checkTime": [8],
            "description": "冷凝器压力读数无规律波动, 请检查相应传感器",
            "detail": "",
            "energy": "0",
            "equipmentId": 82,
            "faultId": 7200082035,
            "grade": 1,
            "id": 517490,
            "name": "冷凝器压力无规律波动",
            "operator": null,
            "orderId": 0,
            "parentId": 82,
            "points": "ChCondPressure06,冷凝器压力",
            "project": "72",
            "status": "1",
            "time": "2016-02-24 14:00:03",
            "userEnable": 1
        }, {
            "checkTime": [8],
            "description": "冷凝器出水温度读数无规律波动, 请检查相应传感器",
            "detail": "",
            "energy": "0",
            "equipmentId": 82,
            "faultId": 7200082049,
            "grade": 1,
            "id": 517492,
            "name": "冷凝器出水温度无规律波动",
            "operator": null,
            "orderId": 0,
            "parentId": 82,
            "points": "ChLeaveCondTemp06,冷凝器出水温度",
            "project": "72",
            "status": "1",
            "time": "2016-02-24 14:00:03",
            "userEnable": 1
        }, {
            "checkTime": [8],
            "description": "冷机与对应水泵状态不一致, 建议检查设备状态",
            "detail": "",
            "energy": "0",
            "equipmentId": 82,
            "faultId": 7200082071,
            "grade": 1,
            "id": 516968,
            "name": "冷机与对应的水泵状态不一致",
            "operator": null,
            "orderId": 0,
            "parentId": 82,
            "points": "ChOnOff06,冷机|ChWPOnOff06,冷冻泵|CWPOnOff06,冷却泵",
            "project": "72",
            "status": "1",
            "time": "2016-02-24 12:06:49",
            "userEnable": 1
        }];

        var $diagnosisItems = $('#tbDiagnosis tr').off('click').on('click', function () {
            _this.createWorkflowOrder(data[$diagnosisItems.index($(this)) - 1]);
        })
    }

    DiagnosisRecord.prototype.show = function (data) {
        //var data = (function (trs) {
        //    var arr = [];
        //    for (var i = 0; i < trs.length; i++) {
        //        arr.push(trs[i].id);
        //    }
        //    return arr;
        //}(data));
        //var $tabCtn = $('#tabDiagnosis');
        //WebAPI.post('/asset/getDiagnosisList', {arrTId: data}).done(function (result) {
        //    var tempHtml = '', $maintenanceTBody = $tabCtn.find('#maintenanceTBody');
        //    if (!result.data || result.data.length == 0) $maintenanceTBody.html('<tr> <td></td><td></td><td></td><td></td><td></td><td></td> </tr>');
        //    for (var i = 0; i < result.data.length; i++) {
        //        tempHtml += ('<tr data-id="' + result.data[i]._id + '"> <td>' + result.data[i].createTime + '</td><td>' + result.data[i].creator + '</td><td>' + result.data[i].type + '</td><td>' + result.data[i].name + '</td><td>' + result.data[i].status + '</td><td>' + result.data[i].endTime + '</td></tr>');
        //    }
        //    $maintenanceTBody.html(tempHtml);
        //});
    };

    DiagnosisRecord.prototype.createWorkflowOrder = function (notice) {
        var wiInstance;
        var momentTime = notice.time.toDate();
        var back = function () {
            wiInstance = null;
        };
        var insertCallback = function (taskModelInfo) {
            var $faultCount = $('#btnWarningLog .badge');
            var faultCount = (function (txt) {
                if (parseInt(txt).toString() != "NaN") {
                    return parseInt(txt);
                }
                return 0;
            }($faultCount.text()));
            //诊断故障信息个数减一, 同时楼层导航的故障个数减一
            if (faultCount > 0) {
                var count = faultCount - 1;
                count = count > 0 ? count : '';
                $faultCount.text(count);
                //诊断故障信息remove
                $('[noticeid="' + notice.id + '"]').remove();
                //楼层故障个数更新
                $('#navFloor-' + AppConfig.zoneId).next('.faultCount').text(count);
            }
        };
        wiInstance = new WorkflowInsert({
            noticeId: notice.id,
            title: notice.name,
            detail: notice.description,
            dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'),  //结束时间为两天后
            critical: notice.grade,
            projectId: Number(notice.project),
            chartPointList: notice.points,
            chartQueryCircle: 'm5',
            description: notice.description,
            name: notice.name,
            time: new Date(momentTime).format('yyyy-MM-dd HH:mm:ss'),
            chartStartTime: new Date(momentTime - 43200000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
            chartEndTime: new Date(momentTime + 43200000).format('yyyy-MM-dd HH:mm:ss')   //报警发生后半天
        });
        wiInstance.show().submitSuccess(function (taskModelInfo, uploadFiles) {
            insertCallback(taskModelInfo);
            this.close();
            back();
        }).cancel(function () {
            back();
        }).fail(function () {
        });
        return true;
    };

    DiagnosisRecord.prototype.close = function () {
    };

    return new DiagnosisRecord();

}());
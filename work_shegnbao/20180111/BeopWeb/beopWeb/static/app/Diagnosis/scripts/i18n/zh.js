var i18n_resource = {
    common: {
        CONFIRM: '确认',
        CANCEL: '取消'
    },
    date: {
        APPLY_LABEL: '确认',
        CACEL_LABEL: '取消',
        FROM_LABEL: '从',
        TO_LABEL: '到',
        WEEK_LABEL: '周',
        DAYS_OF_WEEK: ["日","一","二","三","四","五","六"],
        MONTH_NAMES: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
    },
    nav: {
        STRUCTURE: '结构',
        FAULTS: '故障',
        EQUIPMENTS: '类型',
    },
    topNav: {
        FEEDBACK: '反馈',
        WORKORDER: '工单',
        OPTIONS: '设置',
        ADDTASK: '加入任务',
        ACTION: '处理',
        DELETE: '删除',
        LOCALTIMEZONE: '本地时区',
        PROJECTTIMEZONE: '项目时区',
        SWITCHTIMEZONE: '切换时区',        
        OVERVIEW: '概览',
        HISTORY: '历史',
        TASK: '任务',
        SPECTRUM: '频谱',
        ROI: 'ROI',
        REALTIME: '实时',
        BACK: '返回',
        ARCHIVES:'档案',
        RECORD:'记录'
    },
    history: {
        CHOOSE: '选择',
        OCCUE_TIME: '时间',
        FAULT_GRADE: '等级',
        FAULT_NAME: '故障',
        CONSEQUENCE: '后果',
        AREA: '区域',
        EQUIPMENT: '设备',
        STATUS: '状态',
        MAINTAINABLE: '处理建议',
        ALREADY_TASK: '包含处理成功的故障',
        SUCCESS: '添加成功',
        FAIL: '添加失败',
        REPEAT: '重复',
        TASK_STATUS: '处理状态',
        FREQUENCY:'频率',
        SOURCE_FAULT: '故障来源',
        NUMBER_FAULT: '故障数量',
        SURE_TO_ADD: '确定添加本条记录？',
        EXPORT:'导出',
        CATEGORY:'类型:'
    },
    faultDetailPanel: {
        FAULT_NAME: '故障',
        OCCUE_TIMES: '总发生次数',
        COST_SAVING: '节省费用',
        DURATION: '持续时间',
        EQUIPMENT_INFO: '设备信息',
        DETAIL:'详情',
        FAULT_NAME1: '故障:',
        OCCUE_TIMES1: '发生次数:',
        COST_SAVING1: '节省成本:',
        DURATION1: '持续时间:',
        DETAIL1: '详情:',    },
    spectrum: {
        CHOOSE: '选择',
        EQUIPMENT: '设备',
        ENERGY_COST: '能量消耗(kWh)',
        COST_SAVING: '节省费用($)',
        FREQUENCY: '发生频率',
        AREA: '区域',
    },
    roi: {
        TIME: '时间',
        GROUP: '分组',
        FAULT: '故障',
        EQUIPMENT: '设备',
        POWER_PRICE: '电费单价($)',
        HR_PRICE: '人工单价($/时)',
        HR: '人工耗时(时)',
        LABORCOST: '人工成本($)',
        ROI: 'ROI(年)',
        DAY: '天',
        WEEK: '周',
        MONTH: '月',
        YEAR: '年',
        SAVE_MONEY: '节省费用($)',
        PER_YEAR: '每年节省',
        PER_MONTH: '每月节省',
        PER_WEEK: '每周节省',
        PER_DAY: '每天节省'
    },
    overview: {
        EQUIPMENT_HEALTH: '设备健康',
        CONSEQUENCE: '相关',
        ENERGY_SAVING_POTENTIAL: '节能潜力',
        FAULT_SUMMARY: '故障汇总',
        ISSUES_CLASSIFICATION: '问题分类',
        PRIORITY_FAULTS: '优先处理故障',
        EQUIPMENTS: '设备',
        NUM_OF_FAULTS: '故障个数',
        ENERGY: '能耗',
        ASSOCIATED_FACTORS: '相关的因素',
        ASSOCIATED_FAULT: '相关的故障',
        HEALTH_HEIP_INFO: '每个方块代表一个设备的健康状况，第一行是设备名称，第二行是设备健康百分比，第三行以进度条形式展现当前设备健康状况。',
        CONSEQUENCE_HELP_INFO: '每个方块代表当前时间段诊断的一个结果，第一行是结果名称，第二行是这个结果所占百分比，第三行以进度条形式更直观展现当前的结果。',
        Energy_Saving_BAR_HELP_INFO: '以环形图的形式，展现当前时间段内的节能潜力。左侧为环形图，右侧为对应的节省的能耗，和节省的费用的对应数值。',
        Energy_Saving_LINE_HELP_INFO: '以折线图的形式，展现当前时间段内的节能潜力。蓝色曲线为对应的节省的能耗，紫色的区域代表节省的费用。',
        Issues_Classification_BAR_HELP_INFO: '以环形图的形式，展现当前时间段内的设备故障的问题分类。左侧为环形图，右侧为对应部门处理故障的问题的完成率。',
        Issues_Classification_LINE_HELP_INFO: '以柱图的形式，展现当前时间段内的每个人负责的设备故障的处理情况。'
    },
    task: {
        STATUS: '处理状态',
        ADD_TIME: '加入时间',
        PRIORITY: '紧急程度',
        FAULT: '当前筛选条件下没有记录',
        FAULT1:'没有检测出故障',
    },
    faultModal: {
        OK: '确定',
        CANCEL: '取消',
        CHOOSE: '选择',
        FAULT_GRADE: '等级',
        FAULT_NAME: '故障',
        EQUIPMENT: '设备',
        CONSEQUENCE: '后果',
        STATUS: '是否推送',
        CONFIG: '启用禁用',
        HAPPEN: '是否发生',
        ENABLE_PUSH: '启用推送',
        DISABLE_PUSH: '禁用推送',
        MAIL_PUSH: '邮件推送',
        APP_PUSH: 'APP推送',
        SET_PERSON_SUCCESS: '设置人员成功',
        REQUEST_ERROR: '请求出错',
        ISHAPPEN: '已发生',
        NOHAPPEN: '未发生'
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
            LOAD_COMPLETE: '没有更多',
            SET: "设置",
            PROJECT_TEAM: '项目团队',
            STAFFING: '人员配置',
            WORKFLOW_MANAGE: '工单管理'
        },
        main: {
            NEW_ORDER_FALSE_ALERT: "新建工单失败，需要填写：",
            NOT_CHANGE_WORKFLOW_NODE: "请选择该工单下一位 {0} 的人",
            PLEASE_SELECT_FIRST: " ,请先选择",
            NOT_SELECT_PLEASE: "还未选择，请先选择",
            SURE_NOT_PASS: "任务不通过将会导致工单结束， 确认这个任务不通过吗？",
            SAVE_FAILED: "保存失败",
            REPLY_ALERT_INFO: "回复不能为空",
            EXIT: "退出",
            ADD: "添加新工单",
            ALARM_CONTENT: "描述",
            NEW: "新工单",
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
            CONFIRM: '确定',
            SURE: "确定",
            SUM: "总共",
            DELAY: "延迟",
            ADD_FAULT: "添加工单",
            FAULT_TITLE: "工单标题",
            ORDER_EQUIPMENT_NAME: "设备名称：　",
            FAULT_INFO: "诊断详情",
            LABEL: "标签",
            ORDER_FAULT_INFO: "诊断详情：　",
            FEEDBACK_TITLE: "反馈：",
            YOURS_FEEDBACK: "诊断反馈",
            FEEDBACK_MSG: "反馈详情",
            ORDER_FEEDBACK_MSG: "反馈详情：　",
            PROJECT_NAME: "项目名称：　",
            CANCEL_YOUR_FEEDBACK: "取消",
            Submit_YOUR_FEEDBACK: "确认",
            FEEDBACK_SUCCESS: "已成功发送反馈, 你可以在工单中对反馈进行跟踪",
            FEEDBACK_FAIL: "服务器繁忙, 反馈添加失败, 请稍微再试.",
            WORKFLOW_DETAIL: "工单详情",
            COMPLETE_TASK: "完成",
            PEOPLE: "人员",
            EDIT: "编辑",
            DELETE: "删除",
            TIP1: "此工单尚未分配人员，请先分配人员。",
            TIP2: "这个工单尚未分配人员!",
            FINISH_TIME_NOT_NULL: "完成时间不能为空",
            PEOPLE_NOT_NULL: "人员不能为空",
            FINISH_TIME: "完成时间",
            ADD_SUCCESS: "添加成功",
            CREATE_TASK: "创建工单",
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
            GROUP_NOT_NULL: '项目不能为空',
            EXECUTOR_NOT_NULL: '执行人不能为空',
            THE_WORK_ORDER: '工单',
            IS_CREATED_SUCCESSFULLY: '创建成功',
            CREATE_WORKFLOW_FAILED: '创建失败',
            NEW_FAULT_ORDER: '新建故障工单',
            DEFAULT_GROUP: '默认项目',
            NEW_TASK_GROUP: '新建项目',
            SELECT_EXECUTOR_FIRST: '请先选择执行人',
            TOTAL_NUM: '共有 {0} 条工单',
            ADD_GROUP: '添加组',
            ENTER_ADD_GROUP: '回车添加组',
            SUPER_ADMINISTRATOR: '超级管理员',
            ADMINISTRATOR: '管理员'
        },
        process: {
            ASSIGNMENT_TASK: '分配工单',
            FORWARD: '转发',
            PROCESSING: '处理中...',
            COMPLETE: '完成',
            VERIFY: '验证',
            END: "停止",
            DELETE_PROCESS_WARN_MSG: "确认删除该条流程?",
            DEFAULT_PROCESS: '默认流程',
            ALL_MEMBERS: '全体'
        },
        notice: {
            DYNAMIC_TIME: "动态时间",
            COOLER_ALARM_FAULT: "冷机报警故障",
            TASK_RENAME: "改名为",
            TASK_MODIFY: "修改为",
            TASK_EDIT: "编辑了工单",
            TASK_FINISH: "完成了工单",
            TASK_RESTART: "重启了工单",
            TASK_START: "开始了工单",
            TASK_PAUSE: "暂停了工单",
            TASK_REPLY: "回复了工单",
            TASK_CREATE: "创建了工单",
            TASK_VERIFIED: "验证了工单",
            TASK_CLOSED: '关闭了工单',
            TASK_VERIFIED_FAILED: '验证未通过',
            TASK_DELETE: '删除了工单',
            TASK_FORWARD: '转发了工单',
            TASK_ASSIGN_TIME: "分配时间",
            NO_FOUND: "没有找到符合过滤条件的内容",
            ORDER_STATUS: "工单动态",
            ORDER: "工单",
            DEADLINE: "截止时间",
            CREATE_TIME: "创建时间",
            FAULT_CHART: "故障曲线图",
            TOPIC: "话题讨论",
            COMMENTS: "发表评论",
            REPLAY_ORDER: "回复工单",
            BACK: "后退",
            FAULT_CURVE: "故障快照",
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
            ALL_TASK_NUM: "总工单量",
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
            TASK: "工单",
            STARRED: "星标",
            CANCEL_STARRED: "取消星标",
            CATEGORY: "分类",
            TASK_TYPE_NEW_TASK: "新工单",
            TASK_TYPE_URGENT_TASK: "紧急工单",
            TASK_TYPE_PEND_TASK: "以后需处理工单",
            TASK_EMPTY_MESSAGE_NEW_TASK: "当前没有新工单",
            TASK_EMPTY_MESSAGE_URGENT_TASK: "紧急的工单请拖拽到这里",
            TASK_EMPTY_MESSAGE_PEND_TASK: "以后需处理的工单请拖拽到这里",
            TASK_STATUS_NEW: "新工单",
            TASK_STATUS_DISTRIBUTED: "已分配",
            TASK_STATUS_PROCESSING: "正在处理",
            TASK_STATUS_PAUSED: "已暂停",
            TASK_STATUS_COMPLETED: "已完成",
            SAVE: "保存",
            CANCEL: "取消",
            ASSIGN_ORDER: "我创建的",
            OTHER_PEOPLE_CREATE: '他人创建',
            WORK_ORDER_TITLE: "工单主题",
            STATUS: "状态",
            DEADLINE: "截止日期",
            CREATE_DATE: "创建日期",
            WORK_ORDER_NAME: "工单名",
            TASK_GROUP: "项目",
            MY_TASK: "任务",
            TASK_GROUP_CHANGE: "请选择项目",
            WORKFLOW_WATER: "流程",
            FEEDBACK_WORK_ORDER_NAME: "诊断名称",
            ALL_ORDER: "全部",
            EXECUTOR: "执行人",
            HANDLE_MAN: "处理人"
        },
        filter: {
            CREATE_BY_OTHERS: "他人创建",
            CREATE_BY_ME: '我创建的'
        },
        efficiency: {
            TOTAL_TASK_EFFICIENCY_STATISTICS: "总工单效率统计",
            END_TIME: "截止日期：",
            GATHER_ALL: "汇总",
            TOTAL_QUANTITY_OF_TASK_1: "总工单量：",
            DELAY_QUANTITY_OF_TASK_1: "延误工单量：",
            DELAY_RATE_1: "延误率：",
            PROJECT_TOTAL: "项目汇总",
            PROJECT_NAME: "项目名称",
            TOTAL_QUANTITY_OF_TASK_2: "总工单量",
            UNCOMPLETED_QUANTITY_OF_TASK: "未完成量",
            COMPLETION_RATE: "完成比例",
            DELAY_QUANTITY_OF_TASK_2: "延误工单量",
            DELAY_RATE_2: "延误率",
            MORE: "更多",
            TASK_DIAGRAM: "工单图表",
            WITHOUT_DELAY: "未延误：",
            DELAY: "延误：",
            LOADING: "正在加载……",
            THIS_MONTH: "本月",
            TOTAL: "累计",
            LAST_MONTH: "上月",
            HIDE: "隐藏",
            VIEW: "展开"
        },
        message: {
            MESSAGE: "消息",
            ALL_READ: "全部已读",
            VIEW_ALL_NEWS: "查看所有消息",
            NO_UNREAD_MESSAGES: '没有未读信息',
            MARK_READ_FAILED: "标记已读失败",
            READ_USER_UNREAD_MESSAGES_FAILED: "读取用户未读消息失败"
        },
        lineState: {
            ONLINE: '在线',
            OFFLINE: '离线',
            LAST_UPDATE_TIME: '最近更新时间:',
            OFF_START_TIME: '缺失发生日期为:',
            OFF_LAST_TIME: '掉线时间:',
            OFF_TOTAL: '本月掉线次数:',
            LINE_NUMBER: '序号',
            TERMINAL_NUMBER: '数据终端编号',
            DEFECT_TOTAL_TIME: '缺失累计时间',
            DEFECT_START_TIME: '缺失起始时间'
        },
        team: {
            BACK_THIS_VERSION: '还原到此版本',
            VIEW: '查看',
            BEFORE: '修改前',
            AFTER: '修改后',
            MODIFIED_POINT: '修改了该点',
            CREATE_POINT: '创建了该点',
            POINT_CONTRAST: '点修改对比',
            ADD_SCHEDULE_FAILED: '添加日程失败',
            TEAM_NAME_NUMBER_MAX: '组名不能超过15个字符',
            TEAM_NAME_EMPTY: '组名不能为空',
            NOT_DEL_EXISTING_PEOPLE: '不能删除已经存在的人员',
            NOT_DEL_PEOPLE: '不能删除人员',
            NOT_ADD_PEOPLE: '不能添加人员',
            MORE_NUMBER: '超过最大选择数量',
            CHANGE_TEAM: '请选择组',
            WORKFLOW_SO_ONE_NOTE: '流程最少需要包含一个节点',
            WORKFLOW_PEOPLE_NUMBLE: '流程名称不能超过15个字',
            CREAT_TEAM_FAILED: '创建团队失败: ',
            MUST_TO_NEW_TEAM: '你必须在新的团队架构当中',
            NAME_OR_CREATOR_EMPTY: '名称或者创建人为空',
            NOT_ADD_TEAM: '您没有填写任何信息，无法添加团队',
            SURE_EDIT_NEW_TEAM: '确认退出新建团队界面吗？',
            DEL_DATA_TEAM: '一旦团队解散将会删除相关数据， 是否确认解散该团队？',
            NO_PROCESS: "暂无流程",
            MENU_TITLE: "团队",
            MENU_SUMMARY: "汇总",
            TEAM_NAME: "团队名",
            TEAM_DESCRIPTION: "团队描述",
            LABEL_NAME: "标签",
            TEAM_FRAMEWORK: "团队架构",
            TEAM_PROCESS: "团队流程",
            TEAM_DISBANDED: "解散",
            NO_TEAM_MESSAGE: "创建一个新的团队",
            NO_TEAM_MESSAGE_WITHOUT_PERMISSION: "您还未参与任何团队，请联系管理员, 将您加入到相关团队",
            ENTER_TEAM_NAME: "请输入团队名",
            ENTER_TEAM_DESCRIPTION: "请输入团队描述",
            ADD_PROCESS: "新增流程",
            WORKFLOW_FILTER: "工单筛选：",
            WORKFLOW: "工单：",
            DEPARTMENT_STAFF: "部门人员",
            DELETE: "删除",
            STAFF_ASSIGNMENT: "分配人员",
            SAVE: "保存",
            CANCEL: "取消",
            TIP1: "无法删除最后一个管理员",
            TIP2: "已无人员可以分配此角色！",
            ADD_PROCESS_BEHAVIOR_TYPE_2: '执行人',
            ADD_PROCESS_BEHAVIOR_TYPE_1: "审核人",
            ADD_PROCESSING_BEHAVIOR_TYPE_2: '执行中',
            ADD_PROCESSING_BEHAVIOR_TYPE_1: "审核中",
            ADD_PROCESS_NAME: "流程名称",
            ADD_PROCESS_ITEM_INITIATE: "发起",
            ADD_PROCESS_ENTER_PROCESS_NAME: "请输入流程名称",
            ADD_PROCESS_ITEM_COMPLETE: "完成",
            SELECT_USER_TYPE: "请选择人员类型",
            SELECT_USER_BEHAVIOR: '请选择人员行为',
            ASSIGNED_TO_PEOPLE: '指定到人',
            CONFIRM_CLOSE: '关闭后将会失去已经配置好的流程，确定关闭？',
            UNFINISHED_PROCESS: '还有尚未填写完成的流程!',
            EMPTY_LABEL_MESSAGE: '标签不能为空',
            NO_LABEL_MESSAGE: '请填写标签',
            MORE_THAN_TEN_LABEL_MESSAGE: '标签不能超过10个',
            TOO_LONG_LABEL_MESSAGE: '标签不能超过15个字符',
            TEAM_QUIT_MESSAGE: '确认退出团队么',
            TEAM_QUIT_SUCCESS: '退出成功',
            TEAM_QUIT_FAIL: '退出失败',
            USER_SUPER_ADMIN: '超级管理员',
            USER_ADMIN: '管理员',
            SUMMARY_WEEK:'周',
            SUMMARY_MONTH:'月',
            SUMMARY_QUERY:'查询',
            SUMMARY_PROCESSED_ORDER:'待处理工单',
            SUMMARY_DELAY_ORDER:'延误工单',
            SUMMARY_ALL_ORDER:'总工单数量',
            AVERAGE_COMPLETION_RATE:'平均完成率',
            AVERAGE_RESPONSE_TIME:'平均响应时间',
            COMPLETION_RATE:'完成率',
            RESPONSE_TIME:'响应时间',
            ALL_PROJECTS:'所有任务组',
            ALL_TEAM:'所有团队',
            DEFAULT_PROJECT:'默认项目'
        },
        urgencyLevel: {
            URGENCY_LEVEL: "紧急程度",
            0: "一般",
            1: "严重",
            2: "紧急",
            URGENCY_LEVEL_REQUIRED: "紧急程度不能为空"
        },
        taskStatus: {
            0: "新工单",
            1: "执行中",
            2: "审核通过",
            3: "审核不通过",
            8: '关闭'
        },
        navigation: {
            WO: "工单",
            WORK_ORDER: '工单',
            NEW_CREATED: '等待我开始执行',
            IN_DOING: '我正在执行',
            WAIT_VERIFY: '等待他人审核',
            WF_GROUP_EDIT: "编辑项目",
            WF_GROUP_SEE: '查看项目',
            WF_TASK_ADD: '添加工单',
            WORKING_TASK: '我的工单',
            FINISH_BY: '已结束的工单',
            STOPED_BY: '停止的工单',
            COMPLETED_BY: '完成的工单',
            CREATED_BY: '我创建的工单',
            JOINED_BY: '我参与的工单',
            WF_GROUP_ADD: '添加项目',
            MY_COLLECTION: '我的收藏',
            TAG: '标签',
            GROUP: '我的项目',
            SEARCH: '我的搜索结果',
            WAIT_ME_TO_VERIFIER: "等待本人审核",
            CANNOT_FIND_FILE: '工单已被删除，无法访问',
            START_TASK_SUCCESS: '开始工单成功',
            START_TASK_FAILED: '开始工单失败'
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
            TASK_POOL: '工单池',
            WARNING: '异常',
            FAULT: '故障',
            TODAY: '今天',
            TOMORROW: '明天',
            THIS_WEEK: '本周',
            THIS_MONTH: '本月',
            RESET_TO_DEFAULTS: '重置',
            THIS_YEAR: '今年',
            CUSTOM: '自定',
            All: '全部',
            THIS_SEASON: '本季度',
            YESTERDAY: '昨日',
            NO_TASK: '没有工单',
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
            EMERGENCY: '紧急',
            SERIOUS: '严重',
            PLEASE_SELECT_AREA: '请选择区域'
        },
        set: {
            EMAIL_NOTIFICATION_OPTION: "邮件通知选项",
            TASK_COMMENTED_UPON: "工单被评论时",
            TASK_ABOUT_EXPIRE: "工单即将到期时",
            ASSIGNMENT_COMPLETE: "指派工单完成时",
            ASSIGNMENT_STARTS: "指派工单开始时",
            TASK_SUSPENDED: '指派工单暂停时',
            ASSIGNMENT_REVIEWED: '指派工单被评论时',
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
            CANCEL_REVIEW: '取消评论',
            REPLY_SUCCESS: '回复成功!'
        },
        common: {
            NAME_REPEAT: '命名重复',
            NEW: "新工单",
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
            GROUP_NAME_REQUIRED: '项目名不能为空'
        },
        task: {
            RESET_OPTIONS: '重置',
            NEW_WORK_ORDER: '新建工单',
            WORKFLOW_IN_STOP: '停止的工单',
            WORKFLOW_IN_COMPLETE: '我完成的',
            WORKFLOW_IN_PROGRESS: '待我处理的',
            WORKFLOW_CREATED_BY_ME: '我创建的',
            WORKFLOW_COMPLETE_BY_ME: '与我相关',
            WORKFLOW_INVOLVED_BY_ME: '我参与的',
            WORKFLOW_HISTORY_FINISHED: "历史完成",
            MY_TAGS: '标签',
            ALL_TASK_GROUP: '全部项目',
            TASK_GROUP_CREATED_BY_ME: '我创建的项目',
            TASK_GROUP_INVOLVED_BY_ME: '我参与的项目',
            ADD_NEW_TASK_GROUP: '添加项目',
            EDIT_TASK_GROUP: '编辑项目',
            DELETE_TASK_GROUP: '删除项目',
            SEE_TASK_GROUP_INFO: '查看项目信息',
            UPDATE: '更新',
            SAVE: '保存',
            TASK_GROUP_NAME: '项目名称',
            DESCRIPTION_OF_TASK_GROUP: '项目描述',
            CREATE_TIME: '创建时间',
            OLD_TASK_GROUP_NO_TIME: '旧项目没有记录创建时间',
            CREATED_PERSON: '创建人',
            SELECT_THE_WORKFLOW: '选择流程',
            HAS_CREATED: '等待我开始执行',
            HAS_END: '已结束',
            IN_DOING: '我正在执行',
            WAITING_VERIFIER: "等待他人审核",
            MY_VERIFIER: "等待本人审核",
            MEMBERS: '成员',
            TASK_GROUP: '项目',
            SERIAL_NUMBER: '编号',
            PROCESS: '流程',
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
            CHECK_TASK_FEEDBACK_INFO: '请输入您的建议及反馈。',
            ADD_TAGS_INFO: '一个工单最多只能添加三个标签，且标签为十个字以内。',
            SELECTED_DUE_DATE_INFO: '请选择截止时间',
            SELECTED_DUE_DATE_START_INFO: '请选择开始时间',
            NEW_WORKFLOW_DETAIL_ZONE: '区域',
            NEW_WORKFLOW_DETAIL_SYSTEM: '所在系统',
            NEW_WORKFLOW_DETAIL_EQUIPMENT: '设备名',
            NEW_WORKFLOW_DETAIL_TIME: '故障时间',
            INPUT_TASK_TITLE_INFO: '请输入工单名称',
            TASK_PROGRESS: '工单进程',
            SELECT_TAG_NAME_INFO: '请选择标签',
            DEL_TASK_GROUP_TIPS: '提示',
            DEL_TASK_GROUP_COMMIT: '确认删除么？',
            VERIFIER_PASS: '审核通过',
            VERIFIERS_NOT_PASS: '审核不通过',
            TASK_NOT_EXIST_INFO: '工单不存在，可能已被删除',
            FILTER: 'Filter',
            IN_PROGRESS: '进行中',
            COMPLETED: '已完成',
            GET_MORE: '加载更多',
            NO_TASK_GROUP_INFO: '您当前没有项目团队，无法创建工单。请创建一个项目团队后尝试创建工单',
            GO_TASK_GROUP_TITLE: '前往工单系统',
            ENTER_TAG_NAME_INFO: '请输入标签',
            NO_DESCRIPTION: '没有项目描述',
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
            NO_GROUP_PROMPT: '工单从属于项目，您的账号暂无项目，需要先添加项目。',
            EDIT_GROUP_SUCCESS: "编辑项目成功！",
            ADD_GROUP_SUCCESS: "添加项目成功！",
            FAULT_CURVE: "故障曲线",
            ATTACHMENT_INFO: '添加附件',
            ONE_NOT_MORE_FIVE: "附件(≤5MB)",
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
            TITLE: '标题',
            TIME_GREATER_CHECK_INFO_1: "开始时间不能大于结束时间",
            TIME_GREATER_CHECK_INFO_2: "结束时间不能小于开始时间",
            CAN_NOT_FIND_TASK_GROUP: "找不到项目!"
        },
        memberSelected: {
            TITLE: "请选择人员",
            TITLE1: "请查看人员",
            INPUT_INFO: "请输入用户名称",
            ALL: '全部',
            MEMBER_SELECTED: '已选成员',
            INFO_READONLY: '只能查看，不能选择'
        }
    },
    workOrderModal:{
        ADD_FAULT_WORK_ORDER: '新建故障工单',
        VIEW_FAULT_WORK_ORDER: '查看故障工单',
        SAVE: '保存',
        NAME: '工单名',
        DEADLINE: '截止时间',
        URGENCY_DEGREE: '紧急程度',
        DETAILS: '工单详情',
        EXECUTOR: '执行人',
        REVIEWER: '审核人',
        AREA: '区域',
        EQUIPMENT: '设备',
        FAULT: "故障",
        GENERAL: '一般',
        SEVERITY: '严重',
        URGENCY: '紧急',
        CREATE_WORKFLOW_SUCCESSFULLY: '新建工单成功',
        CREATE_WORKFLOW_FAILED: '新建工单失败',
        OCCUE_TIME: "时间",
        FAULT_NAME: "错误名称：",
        FAULT_DESC: "描述：",
        OCCURRED_TIME: "时间：",
        FAULT_EQUIPMENT: "设备："
    },
    feedbackModal:{
        HISTORY_TITLE: '反馈历史',
        FEEDBACK_TITLE: '反馈',
        NAME: '名称：',
        DESC: '描述：',
        DEADLINE: '截止日期：',
        ATTACHMENTS: '附件：',
        ERROR_SAVE: '保存失败',
        CLOSE: '关闭',
        SUBMIT: '提交',
        TH_NAME: '名称',
        TH_TIME: '时间',
        TH_DESC: '描述',
        TH_STATUS: '状态',
        NO_DATA: '无数据',
        FEEDBACK_SUCCESS: '反馈成功',
        FEEDBACK_FAILURE: '反馈失败',
        LEVEL:'紧急程度：',
        REMARK:'备注：',
        WORK_ORDER:'工单',
        OPERTION:'工具',
        ADD:'新建',
        HISTORY:'历史',
        TIP:'名称和描述不能为空'
    },
    taskModal:{
        TITLE: '任务详情',
        CLOSE: '关闭',
        SUBMIT: '提交',
        INFOBTN: '基本信息',
        HISTORYBTN: '历史状态',
        INFO_TITLE: '故障',
        INFO_DETAIL: '故障详情',
        INFO_AREA: '区域',
        INFO_EQUIPMENT: '设备',
        INFO_CURVE: '故障快照',
        INFO_LEVEL: '紧急程度',
        INFO_STATUS: '处理状态',
        INFO_CREATE: '发送工单',
        INFO_REMARKS: '备注',
        INFO_COMMENT: '评论',
        INFO_CHECK: '查看工单'
    },
    archives:{
        SOLVED:'已经处理',
        NEW:'待处理',
        ARCHIVES:'故障档案',
        HISTORY_CURVE:'历史曲线',
        MAINTAIN_RECORDS:'维修记录',
        SPECTRUM:'频谱图', 
        FREQUENCY:'30天发生频率',
        FREQUENCY1:'30天发生频率:',
    },
    modalJumpPages: {
        IMPORT_PAGE: '导入到数据源',
        POINT_LIST: '数据点名',
        GROUP_LIST: '选择数据源',
        SUCCESS_TIPS: '成功，是否跳转到数据分析页面 ？',
        FAIL_TIPS: '导出失败！',
        NO_FIT_POINT: '无可导数据点',
        SURE: '确定并跳转',
        CANCEL: '确定',
        NEW_GROUP: '新建数据源',
        SELECT_ALL: '全选',
        SELECT_REVERT: '反选',
        NEW_DS_NAME: '新数据源名称',
        PARAM_INTRO: '引用变量名',
        DATA_EXIST: '该数据源已存在于列表中！',
        NO_LABLE: '没有找到自定义标签:'
    }    

};

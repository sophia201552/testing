var i18n_resource = {
    common: {
        CONFIRM: 'Confirm',
        CANCEL: 'Cancel'
    },
    date: {
        APPLY_LABEL: 'Apply',
        CACEL_LABEL: 'Cancel',
        FROM_LABEL: 'From',
        TO_LABEL: 'To',
        WEEK_LABEL: 'W',
        DAYS_OF_WEEK: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        MONTH_NAMES: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    nav: {
        STRUCTURE: 'Structure',
        FAULTS: 'Faults',
        EQUIPMENTS: 'Category',
    },
    topNav: {
        FEEDBACK: 'FeedBack',
        WORKORDER: 'WorkOrder',
        OPTIONS: 'Options',
        OVERVIEW: 'Overview',
        HISTORY: 'History',
        SPECTRUM: 'Spectrum',
        ROI: 'ROI',
        REALTIME: 'Realtime',
    },
    history: {
        CHOOSE: 'Choose',
        OCCUE_TIME: 'Occue Time',
        FAULT_GRADE: 'Fault Grade',
        FAULT_NAME: 'Fault Name',
        CONSEQUENCE: 'Consequence',
        AREA: 'Area',
        EQUIPMENT: 'Entity',
        STATUS: 'Status'
    },
    faultDetailPanel: {
        FAULT_NAME: 'Fault',
        OCCUE_TIMES: 'Occue Times',
        COST_SAVING: 'Cost-Saving',
        DURATION: 'Duration',
        DETAIL: 'Detail'
    },
    spectrum: {
        CHOOSE: 'Choose',
        EQUIPMENT: 'Entity',
        ENERGY_COST: 'Energy Cost(kWh)',
        COST_SAVING: 'Cost-Saving($)',
        FREQUENCY: 'Frequency'
    },
    roi: {
        TIME: 'Time',
        GROUP: 'Group',
        FAULT: 'Fault',
        EQUIPMENT: 'Entity',
        POWER_PRICE: 'Elc.Price($/kWh)',
        HR_PRICE: 'Labor Price($/hr)',
        HR: 'Work hour(hr)',
        LABORCOST: 'Labor Cost($)',
        ROI: 'ROI(yr)',
        DAY: 'Day',
        WEEK: 'Week',
        MONTH: 'Month',
        YEAR: 'Year',
        SAVE_MONEY: 'Saving($)',
        PER_YEAR: 'Savings per Year',
        PER_MONTH: 'Savings per Month',
        PER_WEEK: 'Savings per Week', 
        PER_DAY: 'Savings per Day'
    },
    overview: {
        EQUIPMENT_HEALTH: 'Equipment Health',
        CONSEQUENCE: 'Consequence',
        ENERGY_SAVING_POTENTIAL: 'Energy Saving Potential',
        FAULT_SUMMARY: 'Fault Summary',
        ISSUES_CLASSIFICATION: 'Issues Classification',
        PRIORITY_FAULTS: 'Priority Faults',
        EQUIPMENTS: 'Equipments',
        NUM_OF_FAULTS: 'Number of Faults',
        ENERGY: 'Energy',
        ASSOCIATED_FACTORS: 'Associated Factors',
        ASSOCIATED_FAULT: 'Associated Fault',
        HEALTH_HEIP_INFO: 'Each square represents the health of a device, the first line is the device name, the second line is the device health percentage, the third line shows the current device health status in a progress bar.',
        CONSEQUENCE_HELP_INFO: 'Each square represents the current time period diagnosis a result, the first line is the name of consequence,the second line is the percentage as a result, the third row in the form of a progress bar more intuitive to show the current results.',
        Energy_Saving_BAR_HELP_INFO: 'In the form of a ring diagram, the energy saving potential of the current time period is shown. The left-hand side is a circular graph, the right side is the corresponding saving energy, and the corresponding value of the cost savings.',
        Energy_Saving_LINE_HELP_INFO: 'The energy saving potential of the current time period is presented in the form of the line drawing. The blue curve is the corresponding saving energy, and the purple area represents the cost savings.',
        Issues_Classification_BAR_HELP_INFO: 'In the form of annular graph, the problem classification of equipment failure in the current time period is presented. The left side is the ring diagram, and the right side is the completion rate of the problem of the corresponding department.',
        Issues_Classification_LINE_HELP_INFO: 'In the form of a column graph, the processing of the equipment failure of each person in the current time period is presented.'
    },
    faultModal: {
        OK: 'Add To Nav',
        CANCEL: 'Cancel',
        CHOOSE: 'Choose',
        FAULT_GRADE: 'Fault Grade',
        FAULT_NAME: 'Fault Name',
        EQUIPMENT: 'Entity',
        CONSEQUENCE: 'Consequence',
        STATUS: 'Status',
        CONFIG: 'Enable/Disable',
        HAPPEN: 'Happen',
        ENABLE_PUSH: 'Enable push',
        DISABLE_PUSH: 'Disable push',
        MAIL_PUSH: 'Mail push',
        APP_PUSH: 'APP push',
        SET_PERSON_SUCCESS: 'Set person success',
        REQUEST_ERROR: 'Request error',
        ISHAPPEN: 'Happened',
        NOHAPPEN: 'Not happen'
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
            TITLE_MAIN_PAGE: "Group",
            TITLE_WO_DYNAMIC: "Status",
            TITLE_WEEK_REPORT: "Weekly report",
            TITLE_TEAM: "Team",
            TITLE_EFFIC: "Efficiency",
            TITLE_SCHEDULER: "Schedule",
            TITLE_WO_MY: "My order",
            PEOPLE_SEL: "User filter",
            GROUP: "Group",
            MEMBER: "Member",
            ALL_MEMBER: "All members",
            NEWS: "Latest status",
            LOAD_MORE: "Load more",
            LOAD_COMPLETE: 'Load complete',
            SET: "Set",
            PROJECT_TEAM: 'Project team',
            STAFFING: 'Staffing',
            WORKFLOW_MANAGE: 'Work Order Management'
        },
        main: {
            NEW_ORDER_FALSE_ALERT: "Failed to create new Work Order, please check: ",
            NOT_CHANGE_WORKFLOW_NODE: "Process node is not selected",
            PLEASE_SELECT_FIRST: ",Please select ",
            NOT_SELECT_PLEASE: "next node not selected yet. Please select",
            SURE_NOT_PASS: "Are you sure to reject this Work Order?",
            SAVE_FAILED: "Save failed",
            REPLY_ALERT_INFO: "reply can\'t be empty",
            EXIT: "Exit",
            ADD: "Add work order",
            ALARM_CONTENT: "Description",
            NEW: "New order",
            ASSIGNED: "Assigned",
            DEALING: "Processing",
            PAUSED: "Suspended",
            FINISHED: "Completed",
            DELETED: "Deleted",
            SAVE: "Save",
            CANCEL: "Cancel",
            NAME_NOT_NULL: "Name is required",
            ALL: "All work orders",
            MAIN_PAGE: "Homepage",
            NOTE: "Attention",
            DEL_SURE: "Do you really want to delete this work order?",
            CONFIRM: 'Confirm',
            SURE: "Yes",
            SUM: "In total",
            DELAY: "Delay",
            ADD_FAULT: "Add work order",
            FAULT_TITLE: "Work order name",
            ORDER_EQUIPMENT_NAME: "Equipment name: ",
            FAULT_INFO: "Detail",
            LABEL: "Labels",
            ORDER_FAULT_INFO: "Detail: ",
            FEEDBACK_TITLE: "Feedback: ",
            YOURS_FEEDBACK: "Your Feedback",
            FEEDBACK_MSG: "Feedback",
            ORDER_FEEDBACK_MSG: "Feedback: ",
            PROJECT_NAME: "Project Name: ",
            CANCEL_YOUR_FEEDBACK: "Cancel",
            Submit_YOUR_FEEDBACK: "Submit",
            FEEDBACK_SUCCESS: "Sent successfully. You can track detail in Work Order.",
            FEEDBACK_FAIL: "Server is busy, feedback failed, please try again later.",
            WORKFLOW_DETAIL: 'Detail',
            COMPLETE_TASK: 'Complete',
            FINISH_TIME: "Deadline",
            PEOPLE: "Staff",
            EDIT: "Edit",
            DELETE: "Delete",
            TIP1: "This work order is not assigned, please assign first",
            TIP2: "This work order is not assigned",
            FINISH_TIME_NOT_NULL: "Deadline is required",
            PEOPLE_NOT_NULL: "Member is required",
            ADD_SUCCESS: "Add successful",
            CREATE_TASK: "Create order",
            FINISH: "Finish",
            START: "Start",
            RESTART: "Restart",
            PAUSE: "Pause",
            ASSIGN_AGAIN: 'Assign again',
            WORK_ORDER_DELETED: 'This work order is deleted',
            PROJECT_TEAM: 'Project team',
            PROJECT: 'Project',
            ADD_NEW_PROJECTTEAM: 'Add a new project team',
            DUEDATE_NOT_NULL: 'Due date  is required',
            GROUP_NOT_NULL: 'Project is required',
            EXECUTOR_NOT_NULL: 'Executor  is required',
            THE_WORK_ORDER: 'The work order',
            IS_CREATED_SUCCESSFULLY: 'is created successfully',
            CREATE_WORKFLOW_FAILED: 'Create work order failed',
            NEW_FAULT_ORDER: 'Create new work order',
            DEFAULT_GROUP: 'Default Group',
            NEW_TASK_GROUP: 'Create new work project',
            SELECT_EXECUTOR_FIRST: 'Please select executor first',
            TOTAL_NUM: 'Total {0} items',
            ADD_GROUP: 'Add Group',
            ENTER_ADD_GROUP: 'Click enter to add group',
            SUPER_ADMINISTRATOR: 'Super administrator',
            ADMINISTRATOR: 'Administrator'
        },
        process: {
            ASSIGNMENT_TASK: 'Assignment WO',
            FORWARD: 'Forward',
            PROCESSING: 'Processing...',
            COMPLETE: 'Complete',
            VERIFY: 'Verify',
            END: 'End',
            DELETE_PROCESS_WARN_MSG: "Are you sure delete this process ?",
            DEFAULT_PROCESS: 'Default Process',
            ALL_MEMBERS: 'All'
        },
        notice: {
            DYNAMIC_TIME: "updated",
            COOLER_ALARM_FAULT: "Chiller fault alarm",
            TASK_RENAME: "Renamed to",
            TASK_MODIFY: "Modified to",
            TASK_EDIT: "edited order",
            TASK_FINISH: "completed order",
            TASK_RESTART: "restarted order",
            TASK_START: "started order",
            TASK_PAUSE: "suspended order",
            TASK_REPLY: "replied order",
            TASK_CREATE: "created order",
            TASK_VERIFIED: "verified order",
            TASK_ASSIGN_TIME: "Assign Time",
            NO_FOUND: "Content matching the filter criteria is not found",
            ORDER_STATUS: "Status",
            ORDER: "Work order",
            TASK_CLOSED: 'Close Order',
            DEADLINE: "Deadline",
            CREATE_TIME: "Create Time",
            FAULT_CHART: "Info",
            TOPIC: "Topic discussion",
            COMMENTS: "Comment",
            REPLAY_ORDER: "Reply",
            BACK: "Back",
            TASK_VERIFIED_FAILED: 'Failed To Verify',
            TASK_DELETE: 'Deleted Order',
            TASK_FORWARD: 'Forward Order',
            FAULT_CURVE: "Fault snapshot",
            WORK_ORDER_HISTORY: "Work order history",
            CREATOR: 'Creator',
            PROCESS_RECORD: 'Process record',
            DELETE_REPLY: "Delete reply"
        },
        record: {
            FINISH: "completed",
            START: "started",
            ASSIGNED: "assigned",
            CREATE: "created",
            VERIFIED: "verified"
        },
        report: {
            WORKFLOW_SEL: "Work order filter",
            PEOPLE_SEL: "User filter",
            PROJ_NAME: "Project name",
            ALL_TASK_NUM: "Total",
            UNFINISH_NUM: "Unfinished",
            FINISH_SCALE: "Completed",
            MAJOR_PEOPLE: "Main participants",
            ALL_DEAL_NUM: "Total",
            FINISH_NUM: "Completed",
            COOLER_FAULT_ALARM: "Chiller fault alarm",
            SHOW_TEXT: "Show difference and point operator", //缺
            FINISH: "Finish",
            UNFINISH: "Unfinished",
            LOAD_MORE: "Load more",
            MONTH: "Month",
            WEEK: "Week",
            DAY: "Day",
            TITLE_TIME1: " week ", //缺
            TITLE_TIME2: "{0} {1}nd week",
            TITLE_TIME3: "{1}th {0}~ {3}th {2}"
        },
        mine: {
            CHECK_COMPLETED: "Completed",
            TASK: "Order",
            STARRED: "Star",
            CANCEL_STARRED: "Cancel the star",
            CATEGORY: "Classification",
            TASK_TYPE_NEW_TASK: "New order",
            TASK_TYPE_URGENT_TASK: "Urgent order",
            TASK_TYPE_PEND_TASK: "Order to do",
            TASK_EMPTY_MESSAGE_NEW_TASK: "No new order",
            TASK_EMPTY_MESSAGE_URGENT_TASK: "Drag urgent order here",
            TASK_EMPTY_MESSAGE_PEND_TASK: "Drag order here for dealing with",
            TASK_STATUS_NEW: "New order",
            TASK_STATUS_DISTRIBUTED: "Assigned",
            TASK_STATUS_PROCESSING: "Processing",
            TASK_STATUS_PAUSED: "Suspended",
            TASK_STATUS_COMPLETED: "Completed",
            SAVE: "Save",
            CANCEL: "Cancel",
            ASSIGN_ORDER: "Assign order",
            WORK_ORDER_TITLE: "Work order title",
            STATUS: "Status",
            DEADLINE: "Deadline",
            CREATE_DATE: "Create date",
            WORK_ORDER_NAME: "Title",
            TASK_GROUP: "WO Group",
            MY_TASK: "WO",
            WORKFLOW_WATER: "WO",
            TASK_GROUP_CHANGE: "WO Group",
            FEEDBACK_WORK_ORDER_NAME: "Title",
            ALL_ORDER: "All order",
            EXECUTOR: "Executor",
            HANDLE_MAN: "Executor"
        },
        filter: {
            CREATE_BY_OTHERS: "Other people created",
            CREATE_BY_ME: 'My created'
        },
        efficiency: {
            TOTAL_TASK_EFFICIENCY_STATISTICS: "Efficiency statistic",
            END_TIME: "Deadline:",
            GATHER_ALL: "Summary",
            TOTAL_QUANTITY_OF_TASK_1: "Total WO:",
            DELAY_QUANTITY_OF_TASK_1: "Delayed:",
            DELAY_RATE_1: "Delay rate:",
            PROJECT_TOTAL: "Summary",
            PROJECT_NAME: "Project name",
            TOTAL_QUANTITY_OF_TASK_2: "Total WO",
            UNCOMPLETED_QUANTITY_OF_TASK: "Delayed WO amount",
            COMPLETION_RATE: "Completed",
            DELAY_QUANTITY_OF_TASK_2: "Delayed WO amount",
            DELAY_RATE_2: "Delay rate",
            MORE: "More",
            TASK_DIAGRAM: "Rank",
            WITHOUT_DELAY: "Not delayed:",
            DELAY: "Delay:",
            LOADING: "Loading",
            THIS_MONTH: "This month",
            TOTAL: "Total",
            LAST_MONTH: "Last month",
            HIDE: "Hide",
            VIEW: "View"
        },
        message: {
            MESSAGE: "Message",
            ALL_READ: "All read",
            VIEW_ALL_NEWS: "View all news",
            NO_UNREAD_MESSAGES: 'No unread messages',
            MARK_READ_FAILED: "Mark read failed",
            READ_USER_UNREAD_MESSAGES_FAILED: "Failed to read user unread messages"
        },
        lineState: {
            ONLINE: 'OnLine',
            OFFLINE: 'Offline',
            LAST_UPDATE_TIME: 'Latest update time:',
            OFF_START_TIME: 'off line time:',
            OFF_LAST_TIME: 'off line hours:',
            OFF_TOTAL: 'Monthly off line times:',
            LINE_NUMBER: 'No.',
            TERMINAL_NUMBER: 'DTU No.',
            DEFECT_TOTAL_TIME: 'data missing duration',
            DEFECT_START_TIME: 'off line time'
        },
        team: {
            BACK_THIS_VERSION: 'Back to this version',
            VIEW: 'View',
            BEFORE: 'Before',
            AFTER: 'After',
            MODIFIED_POINT: 'Modified this point',
            CREATE_POINT: 'Created this point',
            POINT_CONTRAST: 'Point modification contrast',
            ADD_SCHEDULE_FAILED: 'Failed to add schedule',
            TEAM_NAME_NUMBER_MAX: 'Group name cannot exceed 15 characters',
            TEAM_NAME_EMPTY: 'Group name is empty',
            NOT_DEL_EXISTING_PEOPLE: 'Cannot delete existing member',
            NOT_DEL_PEOPLE: 'Delete member failed',
            NOT_ADD_PEOPLE: 'Add member failed',
            MORE_NUMBER: 'Exceed max number',
            CHANGE_TEAM: 'Please select group',
            WORKFLOW_SO_ONE_NOTE: 'The process requires at least one node',
            WORKFLOW_PEOPLE_NUMBLE: 'Process name is limited in 15 characters',
            CREAT_TEAM_FAILED: 'Failed to create a new team',
            MUST_TO_NEW_TEAM: 'You have to be in a new team.',
            NAME_OR_CREATOR_EMPTY: 'Name or creator is needed.',
            NOT_ADD_TEAM: 'Without any information, you can not add a group',
            SURE_EDIT_NEW_TEAM: 'Are you sure to exit new team interface?',
            DEL_DATA_TEAM: 'Once the team disbanded, the relevant data will be deleted. Are you sure to dissolve the team?',
            NO_PROCESS: "no process available",
            MENU_TITLE: "Team",
            MENU_SUMMARY: "Summary",
            TEAM_NAME: "Name",
            TEAM_DESCRIPTION: "Description",
            LABEL_NAME: "Label",
            TEAM_FRAMEWORK: "Organization",
            TEAM_PROCESS: "Process",
            TEAM_DISBANDED: "Team disbanded",
            NO_TEAM_MESSAGE: "Create a new team",
            NO_TEAM_MESSAGE_WITHOUT_PERMISSION: "Create a new team.",
            ENTER_TEAM_NAME: "Please enter team name",
            ENTER_TEAM_DESCRIPTION: "Please enter team description",
            ADD_PROCESS: "add process",
            WORKFLOW_FILTER: "Work order filter",
            WORKFLOW: "Work order:",
            DEPARTMENT_STAFF: "Team view",
            DELETE: "Delete",
            STAFF_ASSIGNMENT: "Assign staff",
            CANCEL: "Cancel",
            SAVE: "Save",
            TIP1: "Can not delete the last admin",
            TIP2: "No staff can be assigned",
            ADD_PROCESS_BEHAVIOR_TYPE_2: 'Executor',
            ADD_PROCESS_BEHAVIOR_TYPE_1: "Verifier",
            ADD_PROCESSING_BEHAVIOR_TYPE_2: 'executing',
            ADD_PROCESSING_BEHAVIOR_TYPE_1: "verifying",
            ADD_PROCESS_NAME: "Process name",
            ADD_PROCESS_ITEM_INITIATE: "Initiate",
            ADD_PROCESS_ENTER_PROCESS_NAME: "Please enter process name",
            ADD_PROCESS_ITEM_COMPLETE: "complete",
            SELECT_USER_TYPE: "Please select user type",
            SELECT_USER_BEHAVIOR: 'Please select user behavior',
            ASSIGNED_TO_PEOPLE: 'assigned to people',
            CONFIRM_CLOSE: 'You will lose all unsaved progress. Are you sure to quit?',
            UNFINISHED_PROCESS: 'There are unfinished process!',
            EMPTY_LABEL_MESSAGE: 'Label can not be empty',
            NO_LABEL_MESSAGE: "Please fill out the label",
            MORE_THAN_TEN_LABEL_MESSAGE: 'Label can not be more than 10',
            TOO_LONG_LABEL_MESSAGE: 'Label can not be more than 15 characters',
            TEAM_QUIT_MESSAGE: 'Confirm quit the team right?',
            TEAM_QUIT_SUCCESS: 'quit success',
            TEAM_QUIT_FAIL: 'quit fail',
            USER_SUPER_ADMIN: 'super admin',
            USER_ADMIN: 'admin',
            SUMMARY_WEEK:'week',
            SUMMARY_MONTH:'month',
            SUMMARY_QUERY:'OK',
            SUMMARY_PROCESSED_ORDER:'To do',
            SUMMARY_DELAY_ORDER:'Delay',
            SUMMARY_ALL_ORDER:'Total',
            AVERAGE_COMPLETION_RATE:'Avg.Complete',
            AVERAGE_RESPONSE_TIME:'Avg. Responce',
            COMPLETION_RATE:'Complete',
            RESPONSE_TIME:'Responce',
            ALL_PROJECTS:'All groups',
            ALL_TEAM:'All teams',
            DEFAULT_PROJECT:'Default'
        },
        urgencyLevel: {
            URGENCY_LEVEL: "Level",
            0: "Normal",
            1: "Serious",
            2: "Urgent",
            URGENCY_LEVEL_REQUIRED: "Urgency level is required"
        },
        taskStatus: {
            0: "New",
            1: "In Progress",
            2: "Verified",
            3: "Rejected",
            8: 'Closed'
        },
        navigation: {
            WO: 'WO',
            WORK_ORDER: 'Work Order',
            NEW_CREATED: 'Wait Me To Execute',
            IN_DOING: 'My Work Order In Progress',
            WAIT_VERIFY: 'People Verification',
            WF_GROUP_EDIT: "Edit Group",
            WF_GROUP_SEE: 'View Group',
            WF_TASK_ADD: 'Add WO',
            WORKING_TASK: 'My Work Order',
            FINISH_BY: 'WO I Completed',
            CREATED_BY: 'WO I Created',
            JOINED_BY: 'WO I Involved',
            WF_GROUP_ADD: 'Add Group',
            MY_COLLECTION: 'Starred',
            TAG: 'My Labels',
            STOPED_BY: 'Ended',
            COMPLETED_BY: 'Completed',
            GROUP: 'My Projects',
            SEARCH: 'Search Result',
            WAIT_ME_TO_VERIFIER: "My Verification",
            CANNOT_FIND_FILE: 'This Work Order has been deleted. You can not visit it.',
            START_TASK_SUCCESS: 'Start WO Successfully',
            START_TASK_FAILED: 'Start WO Failed'
        },
        insert: {
            SELECT_PROJECT: "Select Project",
            EXECUTOR: "Executor",
            LEVEL: "Level",
            CONFIRM: "Confirm",
            DEADLINE_REQUIRED: "Deadline is required",
            TITLE_REQUIRED: "Title is required"
        },
        calendar: {
            TEAM: 'Team',
            INDIVIDUAL: 'Individual',
            TASK_POOL: 'WO pool',
            EMERGENCY: 'Emergency',
            FAULT: 'Fault',
            TODAY: 'Today',
            THIS_WEEK: 'This Week',
            THIS_MONTH: 'This Month',
            RESET_TO_DEFAULTS: 'Reset',
            THIS_YEAR: 'This year',
            CUSTOM: 'custom',
            All: 'All',
            NO_TASK: 'No WO',
            ADD_SCHEDULER: 'Added to calendar',
            YESTERDAY: 'Yesterday',
            THIS_SEASON: 'this season',
            ORDER_CREATION_SUCCESS: 'Work order creation succeeded',
            DATE_ERROR_INFO: 'The start date couldn’t be later than the end date',
            SAVE_FAILED: 'Save failed',
            NO_TITLE: 'No title',
            COLOR: 'color',
            AREA: 'area',
            DESCRIPTION: 'description',
            EQUIPMENT_NAME: 'equipment name',
            URGENCY_LEVEL: 'urgency level',
            TIME_START: 'start time',
            TIME_END: 'end time',
            REMIND: 'remind',
            PROJECT_NAME: 'project name',
            POINT_VALUE: 'point value',
            OWNER: 'owner',
            TITLE: 'title',
            EDIT: 'edit',
            DELETE: 'delete',
            SAVE: 'save changes',
            CREATE_WORKFLOW: 'create work order',
            ONE_MONTH: 'one month',
            TWO_MONTH: 'two month',
            THREE_MONTH: 'three month',
            HALF_YEAR: 'half year',
            OVERDUE_TIME: 'overdue time',
            FAULT_TIME: 'fault time',
            GENERAL: 'general',
            WARNING: 'Warning',
            SERIOUS: 'serious',
            TOMORROW: 'Tomorrow',
            PLEASE_SELECT_AREA: 'Please select area'
        },
        set: {
            EMAIL_NOTIFICATION_OPTION: "E-mail notification option",
            TASK_COMMENTED_UPON: "Receive comment from work order",
            TASK_ABOUT_EXPIRE: "Order deadline is due",
            ASSIGNMENT_COMPLETE: "Assign order finished",
            ASSIGNMENT_STARTS: "Assign order started",
            TASK_SUSPENDED: 'Assign order suspended',
            ASSIGNMENT_REVIEWED: 'Receive comment from assign order',
            SELECT_LEAST_ONE: 'Please select at least one option',
            CONFIRM: 'Confirm'
        },
        activities: {
            ACTIVITIES: 'Activities',
            TODAY: 'Today',
            RECENTLY_COMPLETE: 'Recently Completed',
            RECENTLY_CREATED: 'Recently Created',
            REVIEW: ' Comment ',
            ADD_REVIEW: 'Add comment',
            CANCEL_REVIEW: 'Cancel',
            REPLY_SUCCESS: 'Reply success!'
        },
        task: {
            RESET_OPTIONS: 'Reset',
            NEW_WORK_ORDER: 'New Work Order',
            WORKFLOW_IN_STOP: 'Ended',
            WORKFLOW_IN_COMPLETE: 'Completed',
            WORKFLOW_IN_PROGRESS: 'Pending',
            WORKFLOW_CREATED_BY_ME: 'Created',
            WORKFLOW_COMPLETE_BY_ME: 'Involved',
            WORKFLOW_INVOLVED_BY_ME: 'Involved',
            WORKFLOW_HISTORY_FINISHED: "Finished",
            MY_TAGS: 'My Labels',
            ALL_TASK_GROUP: 'All Group',
            TASK_GROUP_CREATED_BY_ME: 'Group I Created',
            TASK_GROUP_INVOLVED_BY_ME: 'Group I Involved',
            ADD_NEW_TASK_GROUP: 'Add New Group',
            EDIT_TASK_GROUP: 'Edit Group',
            DELETE_TASK_GROUP: 'Delete Group',
            SEE_TASK_GROUP_INFO: 'See More Project Info',
            UPDATE: 'Update',
            SAVE: 'Save',
            TASK_GROUP_NAME: 'Group Name',
            DESCRIPTION_OF_TASK_GROUP: 'Group Description',
            CREATE_TIME: 'Create Time',
            OLD_TASK_GROUP_NO_TIME: 'Old Group Do Not Have Create Time In Database',
            CREATED_PERSON: 'Creator',
            SELECT_THE_WORKFLOW: 'Process',
            HAS_CREATED: 'Wait Me To Execute',
            HAS_END: 'End',
            IN_DOING: 'My Work Order In Progress',
            WAITING_VERIFIER: "Under People Verification",
            MY_VERIFIER: "Under My Verification",
            MEMBERS: 'Members',
            TASK_GROUP: 'Group',
            SERIAL_NUMBER: 'No.',
            PROCESS: 'Process',
            COLLECT: 'Starred',
            BACK: 'Back',
            FINISH_INFO: 'Click and Enter The Review Process',
            PASS: 'Pass',
            NOT_PASS: 'Not Pass',
            TOMORROW: 'Tomorrow',
            OVERDUE: 'Overdue',
            DAY: 'Day',
            STARING: 'Starred',
            VERIFIERS: 'Verifiers',
            WATCHERS: 'CC',
            TAGS: 'Labels',
            SEE: 'Check',
            SELECT_TASK_GROUP: 'Please Select Group',
            CHECK_TASK_INFO: 'Please Enter Group Details',
            CHECK_TASK_FEEDBACK_INFO: 'Please enter your comments and feedback here.',
            ADD_TAGS_INFO: 'Only Three Labels Are Allowed For One WO, And Labels Named Within Ten Words.',
            SELECTED_DUE_DATE_INFO: 'Please Select Deadline',
            SELECTED_DUE_DATE_START_INFO: 'Please Select Start Time',
            NEW_WORKFLOW_DETAIL_ZONE: 'Zone',
            NEW_WORKFLOW_DETAIL_SYSTEM: 'System',
            NEW_WORKFLOW_DETAIL_EQUIPMENT: 'Equipment',
            NEW_WORKFLOW_DETAIL_TIME: 'Time',
            INPUT_TASK_TITLE_INFO: 'Please Enter The Name Of Group',
            TASK_PROGRESS: 'Progress',
            SELECT_TAG_NAME_INFO: 'Please Select Labels',
            DEL_TASK_GROUP_TIPS: 'Alert',
            DEL_TASK_GROUP_COMMIT: 'Confirm To Delete It？',
            TASK_NOT_EXIST_INFO: 'The WO Does Not Exist!And It Maybe Has Been Deleted',
            FILTER: 'Filter',
            IN_PROGRESS: 'Progress',
            COMPLETED: 'Completed',
            GET_MORE: 'Get More Activities',
            VERIFIER_PASS: 'Verifier Pass',
            VERIFIERS_NOT_PASS: 'Verifier Failed',
            NO_TASK_GROUP_INFO: 'You currently have no project team, you can not create a work order. Please tries to create a work order after creating a project team',
            GO_TASK_GROUP_TITLE: 'GO To Project System',
            ENTER_TAG_NAME_INFO: 'Enter Label',
            NO_DESCRIPTION: 'No Project Description',
            MY_COLLECT: 'Starred',
            HAS_COLLECTED: 'Starred',
            NOT_COLLECTED: 'Not Starred',
            SEARCH: 'Search',
            MY_SCHEDULER: 'My Schedule',
            GROUP_TYPE: 'Group Type',
            JOINED: 'Joined',
            MANAGED: 'Managed',
            NEW_GROUP: 'New Group',
            STATUS: 'Status',
            EDIT_TASK_GROUP_BTN: 'Update',
            NO_GROUP_PROMPT: 'Workorder belongs to project group. Your account has no project now. Add a  new one please.',
            EDIT_GROUP_SUCCESS: "Edit group success！",
            ADD_GROUP_SUCCESS: "Add group success！",
            FAULT_CURVE: "Fault curve",
            ATTACHMENT_INFO: 'Add attachment',
            ONE_NOT_MORE_FIVE: "≤5MB",
            ATTACHMENT: 'Attach',
            ATTACHMENT_FILE_SIZE_INFO: 'Uploads a single file size can not exceed 5MB.',
            ATTACHMENT_TYPE_PIC: 'Image',
            ATTACHMENT_TYPE_FILE: 'File',
            ATTACHMENT_FILE_AMOUNT_INFO: 'Upload exceed the maximum number.',
            ATTACHMENT_FILE_ERROR_INFO_SIZE: 'This file is too large to send as an attachment. The largest file you can send is 5 MB.',
            ATTACHMENT_FILE_FAIL_INFO: 'Upload attachment error.',
            ATTACHMENT_FILE_SUCCESS_INFO: 'Upload attachment success',
            ATTACHMENT_DELETE_FAIL_INFO: 'delete attachment failed.',
            ATTACHMENT_DELETE_SUCCESS_INFO: 'delete attachment success',
            ATTACHMENT_DELETE_NOTE: 'Are you sure to delete this attachment ?',
            ATTACHMENT_TITLE: 'File Upload',
            ATTACHMENT_FILE_INFO_TEXT: "{2} of {0} files ({1} mb) uploaded successfully.",
            TITLE: 'Title',
            TIME_GREATER_CHECK_INFO_1: "Start date cannot be later than end date",
            TIME_GREATER_CHECK_INFO_2: "End date cannot be later than start date",
            CAN_NOT_FIND_TASK_GROUP: "can\'t find any group"
        },
        memberSelected: {
            TITLE: "Please Select Members",
            TITLE1: "Please choose members",
            INPUT_INFO: "Please enter members name to search",
            ALL: 'All',
            MEMBER_SELECTED: 'Members',
            INFO_READONLY: 'Only view, can not choose'
        },
        common: {
            NAME_REPEAT: 'Name existed',
            NEW: "New order",
            DEALING: "Processing",
            PAUSED: "Suspended",
            FINISHED: "Completed",
            CONFIRMATION: 'confirmation',
            VERIFIED: 'verified',
            CANCEL: "Cancel",
            CONFIRM: 'Confirm',
            PROMPT: 'Information',
            DELETE_IT: 'Are you sure you want to delete',
            NUMBER: 'No.',
            DEADLINE: 'Deadline',
            EXECUTOR: "Executor",
            CREATOR: 'Creator',
            TITLE_REQUIRED: 'Title is required',
            DETAIL_REQUIRED: 'Detail is required',
            DEADLINE_REQUIRED: 'Deadline is required',
            GROUP_NAME_REQUIRED: 'Project name is required'
        }
    }
};

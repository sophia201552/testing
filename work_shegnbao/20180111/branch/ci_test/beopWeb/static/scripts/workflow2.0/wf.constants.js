;
(function (beop) {
    /**
     * 流程节点中人员类型
     * @type {{SUPER_ADMIN: number, ADMIN: number, MEMBER: number, ALL_MEMBERS: number, SPECIFIED_MEMBERS: number}}
     */
    var archType = {
        SUPER_ADMIN: 1,
        ADMIN: 2,
        MEMBER: 3,
        ALL_MEMBERS: 4,
        SPECIFIED_MEMBERS: 5
    };

    /***
     * 页面展示类型
     * @type {{EDIT: string, SHOW: string, CREATE: string}}
     */
    var viewType = {
        EDIT: 'edit', //编辑界面
        SHOW: 'show',//详细页面
        CREATE: 'create'//创建页面
    };
    var allViewType = [viewType.EDIT, viewType.SHOW, viewType.CREATE];

    /***
     * 类型
     * @type {{DEFAULT: number, CUSTOM: number}}
     */
    var fieldType = {
        DEFAULT: 1, //默认流程
        CUSTOM: 2 //自定义流程
    };

    /***
     * 流程节点动作类型
     * @type {{VERIFY: number, EXECUTE: number}}
     */
    var behaviourType = {
        VERIFY: 1, // 审核节点
        EXECUTE: 2  // 执行节点
    };

    /**
     * 工单类型, 4:预防性维护 ,5:诊断工单, 6:反馈工单
     * @type {{PREVENTIVE_MAINTENANCE: number, DIAGNOSIS: number, FEEDBACK: number}}
     */
    var taskType = {
        PREVENTIVE_MAINTENANCE: 4,
        DIAGNOSIS: 5,
        FEEDBACK: 6
    };

    beop.constants = {
        archType: archType,
        viewType: viewType,
        allViewType: allViewType,
        fieldType: fieldType,
        behaviourType: behaviourType,
        taskType: taskType
    }

})(beop || (beop = {}));
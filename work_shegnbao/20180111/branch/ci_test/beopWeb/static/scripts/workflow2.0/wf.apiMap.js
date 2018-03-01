(function (beop) {
    beop.apiMethod = {
        get: 'GET',
        post: 'POST'
    };

    beop.apiMap = {
        //----添加新任务组
        'addGroup': {
            'method': beop.apiMethod.post,
            'url': '/workflow/group/new/<user_id>'
        },
        //---编辑任务组
        'editGroup': {
            'method': beop.apiMethod.post,
            'url': '/workflow/group/edit/<group_id>/<user_id>'
        },
        //----删除新任务组
        'deleteGroup': {
            'method': beop.apiMethod.post,
            'url': '/workflow/group/delete/<group_id>/<user_id>'
        },
        //获取任务组内容
        'getGroupData': {
            'method': beop.apiMethod.get,
            'url': '/workflow/group/get/<group_id>/<user_id>'
        },
        //----完成工单
        'completeTransaction': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/complete/'
        },
        //----工单验证通过
        'verifyPass': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/pass_verify/'
        },
        //----工单验证不通过
        'verifyNotPass': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/not_pass_verify/'
        },
        //----列出任务TASK动态
        'listTaskActivities': {
            'method': beop.apiMethod.post,
            'url': '/workflow/activity/getActivity/<activity_time_type>'
        },
        //----添加工单回复
        'addReply': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/insert_reply/'
        },
        //----获取整个菜单
        'listMenu': {
            'method': beop.apiMethod.post,
            'url': '/workflow/menu/listMenu/'
        },
        //----获取二级菜单
        'listSecondMenu': {
            'method': beop.apiMethod.post,
            'url': '/workflow/menu/list_second_menu/'
        },
        //---获取task 进程
        'getTaskProgress': {
            'method': beop.apiMethod.get,
            'url': '/workflow/task/progress/<task_id>'
        },
        //----故障曲线
        'faultCurve': {
            'method': beop.apiMethod.post,
            'url': '/analysis/startWorkspaceDataGenHistogram'
        },
        //----用户任务组
        'userGroups': {
            'method': beop.apiMethod.get,
            'url': '/workflow/users/group/<user_id>'
        },
        //----查询任务
        'searchTasks': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/search/<page_num>/<page_size>'
        },
        //添加人物的时候获取人物列表
        'userDialogList': {
            'method': beop.apiMethod.get,
            'url': '/workflow/group/user_dialog_list/<user_id>'
        },
        //---添加人物时候根据任务组来获取人物列表
        'userListByGroup': {
            'method': beop.apiMethod.get,
            'url': '/workflow/group/group_user_list/<user_id>/<group_id>'
        },
        //----用户tag组
        'getUserTags': {
            'method': beop.apiMethod.get,
            'url': '/workflow/tags/'
        },
        //````关闭任务
        'closeTask': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/close_task/<user_id>/<trans_id>'
        },
        'getListTodayTasks': {
            'method': beop.apiMethod.post,
            'url': '/workflow/listTodayTasks'
        },
        //---通过工单ID获得上传附件
        'getAttachmentByTransId': {
            'method': beop.apiMethod.get,
            'url': '/workflow/attachment/getFiles/<trans_id>'
        },
        //---删除用户附件
        'deleteAttachment': {
            'method': beop.apiMethod.post,
            'url': '/workflow/attachment/delete'
        },
        //---团队
        'team': {
            'method': beop.apiMethod.get,
            'url': '/workflow/team/'
        },
        "teamNew": {
            'method': beop.apiMethod.post,
            'url': "/workflow/team/new"
        },
        "teamEdit": {
            'method': beop.apiMethod.post,
            'url': "/workflow/team/edit"
        },
        "teamDelete": {
            'method': beop.apiMethod.get,
            'url': "/workflow/team/delete/<team_id>"
        },
        "quiteTeam": {
            'method': beop.apiMethod.get,
            'url': "/workflow/team/quite/<team_id>"
        },
        //---获取个人任务组
        'taskGroup': {
            'method': beop.apiMethod.get,
            'url': '/workflow/taskGroup/'
        },
        //---通过groupId获取个人任务组
        'taskGroupById': {
            'method': beop.apiMethod.get,
            'url': '/workflow/taskGroup/<group_id>'
        },
        //---保存任务
        'saveTask': {
            'method': beop.apiMethod.post,
            'url': '/workflow/task/save/'
        },
        //---删除任务
        'deleteTask': {
            'method': beop.apiMethod.get,
            'url': '/workflow/task/delete/<taskId>'
        },
        //---获取任务
        'getTask': {
            'method': beop.apiMethod.get,
            'url': '/workflow/task/<taskId>'
        },
        //---通过任务
        'passTask': {
            'method': beop.apiMethod.post,
            'url': '/workflow/passTask/'
        },
        //---不通过任务
        'noPassTask': {
            'method': beop.apiMethod.post,
            'url': '/workflow/noPassTask/'
        },
        //---完成任务
        'completeTask': {
            'method': beop.apiMethod.post,
            'url': '/workflow/task/complete/'
        },
        //--- taskTypeFilter
        "taskTypeFilter": {
            'method': beop.apiMethod.post,
            "url": "/workflow/task/filter"
        }
    }

})(beop || (beop = {}));
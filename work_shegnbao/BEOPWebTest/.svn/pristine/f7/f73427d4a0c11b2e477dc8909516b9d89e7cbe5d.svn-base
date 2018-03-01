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
            'method': beop.apiMethod.get,
            'url': '/workflow/group/delete/<group_id>/<user_id>'
        },
        //获取任务组内容
        'getGroupData': {
            'method': beop.apiMethod.get,
            'url': '/workflow/group/get/<group_id>/<user_id>'
        },
        //----添加新工单
        'addTransaction': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/new/'
        },
        //----修改工单
        'updateTransaction': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/update/'
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
        //----列出任务组的信息及工单
        'listOneGroup': {
            'method': beop.apiMethod.get,
            'url': '/workflow/group/<user_id>/<project_id>'
        },
        //----列出组动态
        'listGroupActivities': {
            'method': beop.apiMethod.post,
            'url': '/workflow/group_activities/<userId>/<activity_time_type>/<limit>'
        },
        //----获取工单
        'getTransaction': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/<trans_id>'
        },
        //----删除工单
        'delTransaction': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/delete/<trans_id>'
        },
        //获取收藏的工单
        'getTransactionStar': {
            'method': beop.apiMethod.get,
            'url': '/workflow/transaction/star/<user_id>/<page_num>/<page_size>'
        },
        //----获取正在进行中的工单
        'getTransactionWorking': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/working/<user_id>/<page_num>/<page_size>'
        },
        //----获取谁创建工单
        'getTransactionCreatedBy': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/created_by/<user_id>/<page_num>/<page_size>'
        },
        //----获取谁创建工单
        'getTransactionFinishedBy': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/finished_by/<user_id>/<page_num>/<page_size>'
        },
        //----获取谁参加的工单
        'getTransactionJoinedBy': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/joined_by/<user_id>/<page_num>/<page_size>'
        },
        //----获取工单的详情
        'getWorkflowDetailBy': {
            'method': beop.apiMethod.get,
            'url': '/workflow/detail/<record_id>'
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
        //----发表评论
        'insertReply': {
            'method': beop.apiMethod.post,
            'url': '/workflow/insert/reply'
        },
        //---删除评论
        'deleteReply': {
            'method': beop.apiMethod.post,
            'url': '/workflow/insert/delete/<user_id>'
        },
        //----获取工单回复
        'getReply': {
            'method': beop.apiMethod.get,
            'url': '/workflow/transaction/get_reply/<trans_id>'
        },
        //----获取工单进程
        'getProgress': {
            'method': beop.apiMethod.get,
            'url': '/workflow/transaction/get_progress/<trans_id>'
        },
        //----故障曲线
        'faultCurve': {
            'method': beop.apiMethod.get,
            'url': '/workflow/transaction/fault_curve_data/<trans_id>'
        },
        //----用户任务组
        'userGroups': {
            'method': beop.apiMethod.get,
            'url': '/workflow/users/group/<user_id>'
        },
        //----任务组任务
        'transInGroups': {
            'method': beop.apiMethod.post,
            'url': '/workflow/group/transaction/<group_id>/<user_id>/<page_num>/<page_size>'
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
            'url': '/workflow/tag/user/<user_id>'
        },
        ///----用户添加tag
        'addTag': {
            'method': beop.apiMethod.post,
            'url': '/workflow/user/tag/add/<user_id>'
        },
        ///----用户删除一个tag
        'deleteTag': {
            'method': beop.apiMethod.get,
            'url': '/workflow/user/tag/delete/<user_id>/<tag_id>'
        },
        ///----用户修改tag
        'editTag': {
            'method': beop.apiMethod.post,
            'url': '/workflow/user/tag/update/<user_id>'
        },
        //----trans添加一个tag
        'addTransTag': {
            'method': beop.apiMethod.get,
            'url': '/workflow/tag/add/<trans_id>/<tag_id>'
        },
        //----用户删除一个工单上的Tag
        'transTagDelete': {
            'method': beop.apiMethod.get,
            'url': '/workflow/tag/delete/<trans_id>/<tag_id>'
        },
        //----查询一个Tag对应的工单
        'transTag': {
            'method': beop.apiMethod.post,
            'url': '/workflow/tag/trans/<user_id>/<tag_id>/<page_num>/<page_size>'
        },
        //----查询一个工单保存过的Tag
        'tagTrans': {
            'method': beop.apiMethod.get,
            'url': '/workflow/trans/tag/<trans_id>'
        },
        //----任务列表收藏切换
        'toggleStarred': {
            'method': beop.apiMethod.get,
            'url': '/workflow/transaction/star/<user_id>/<trans_id>'
        },
        //----获取已经创建但是尚未开始的工单任务
        'getTransactionNewCreated': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/get_new_created/<user_id>/<page_num>/<page_size>'
        },
        //----获取已经开始的工单任务
        'getTransactionStarted': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/get_started_trans/<user_id>/<page_num>/<page_size>'
        },
        //----获取等待验证的工单任务
        'getTransactionWaitVerify': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/get_wait_verify_trans/<user_id>/<page_num>/<page_size>'
        },
        //----开始任务
        'startTransaction': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/start_trans/<user_id>/<trans_id>'
        },
        //----更新执行人员
        'updateExecutor': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/update_executor/<user_id>/<trans_id>'
        },
        //````关闭任务
        'closeTask': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/close_task/<user_id>/<trans_id>'
        },
        //----获取结束工单里面的验证通过的工单
        'getCompleteVerifiedTask': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/get_complete_verified/<user_id>/<page_num>/<page_size>'
        },
        //----获取停止工单里面验证通过的工单
        'getStopVerifiedTask': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/get_stop_verified/<user_id>/<page_num>/<page_size>'
        },
        'getListTodayTasks': {
            'method': beop.apiMethod.post,
            'url': '/workflow/listTodayTasks'
        },
        //---更新工单的isRead状态
        'updateTransactionStatus': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/updateStatus'
        },
        //---等待我验证的工单
        'waitMeToVerifier': {
            'method': beop.apiMethod.post,
            'url': '/workflow/transaction/waitMeToVerifier/<user_id>/<page_num>/<page_size>'
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
            'method': beop.apiMethod.post,
            'url': '/workflow/team/'
        },
        //---获取个人任务组
        'taskGroup': {
            'method': beop.apiMethod.post,
            'url': '/workflow/taskGroup/'
        },
        //---保存任务
        'saveTask': {
            'method': beop.apiMethod.post,
            'url': '/workflow/saveTask/'
        }
    }

})(beop || (beop = {}));
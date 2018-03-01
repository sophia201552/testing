(function (beop) {
    var isSmallScreen = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) <= 768;
    //公用
    var configMap = {

            date_format_full: 'yyyy-MM-dd HH:mm:ss',
            date_format_YMD: 'yyyy-MM-dd',

            activities_number: 10,
            task_page_size: isSmallScreen ? 14 : 19,
            activities_store_key: 'activities',
            activities_type: {
                today: '1',
                yesterday: '0',
                thisWeek: '2',
                thisMonth: '3',
                latestCompleted: '4',
                latestCreated: '5'
            },
            activities_op_type: {
                'new': 'new',
                'complete': 'complete'
            }
        },
        stateMap = {
            trans_cid_map: {},
            activity_cid_map: {},
            record_detail: {},
            group_list: [],
            tag_list: [],
            totalCount: null,
            activities: [],
            filter: {
                type: null,
                param: null
            },
            isShowTaskFilter: false,
            task_page_size: isSmallScreen ? 14 : 19,
            teamPromise: null
        },
        isFake,
        emit,
        init;

    //是否假数据
    isFake = false;
    //isFake = true;
    emit = isFake ? beop.fake.emit : beop.data.emit;
    //------methods defined----------
    var noop = function () {
    };

    //------models defined----------
    var activitiesModel, transactionsModel, menuModel,
        replyModel, tagsModel, attachmentModel, teamModel, groupModel, taskModel;

    //------activitiesModel---------
    var getActivities, getActivitiesFilter, editGroup;
    activitiesModel = (function () {

        getActivities = function (type, page) {
            Spinner.spin($('#wf-level-menu').get(0));
            beop.view.activities.configModel({
                activities_number: configMap.activities_number
            });
            return emit(beop.apiMap.listTaskActivities,
                {
                    activity_time_type: type
                }, {
                    page: page ? page : 1,
                    limit: configMap.activities_number
                }
            ).done(function (result) {
                    if (result.success) {
                        try {
                            window.localStorage.removeItem("beopcache/activities")
                        } catch (ex) {

                        }
                        stateMap.activities = {
                            msg: result.data.msg,
                            totalCount: result.data.totalCount,
                            activity_type: type,
                            backup_activity_type: result.data.backUpActivityType
                        };
                    }
                }).always(function () {
                    Spinner.stop();
                });
        };

        getActivitiesFilter = function (type) {
            var now = moment(new Date()),
                yesterday = now.clone().subtract(1, 'days');
            var isLatestReply = function (activity, checkFunc) {
                if (!activity.reply || !activity.reply.length) {
                    return false;
                }
                var latestReply = activity.reply[0];
                return checkFunc(latestReply.replyTime);
            };
            var checkFunc = noop;
            switch (type) {
                case configMap.activities_type.today:
                {
                    checkFunc = function (datetime) {
                        return now.isSame(new Date(datetime), 'days');
                    };
                    return function (item) {
                        return item && (checkFunc(item.opTime) || isLatestReply(item, checkFunc));
                    }
                }
                case configMap.activities_type.yesterday:
                {
                    checkFunc = function (datetime) {
                        return yesterday.isSame(new Date(datetime), 'days');
                    };
                    return function (item) {
                        return item && (checkFunc(item.opTime) || isLatestReply(item, checkFunc));
                    };
                }
                case configMap.activities_type.thisWeek:
                {
                    checkFunc = function (datetime) {
                        return moment(new Date(datetime)).isBetween(now.clone().startOf('weeks'), now.clone().endOf('weeks'))
                    };
                    return function (item) {
                        return item && (checkFunc(item.opTime) || isLatestReply(item, checkFunc));
                    };
                }
                case configMap.activities_type.thisMonth:
                {
                    checkFunc = function (datetime) {
                        return moment(new Date(datetime)).isBetween(now.clone().startOf('months'), now.clone().endOf('months'));
                    };
                    return function (item) {
                        return item && (checkFunc(item.opTime) || isLatestReply(item, checkFunc));
                    };
                }
                case configMap.activities_type.latestCompleted:
                {
                    return function (item) {
                        return (--configMap.activities_number) > 0 && item.op === configMap.activities_op_type.complete;
                    }
                }
                case configMap.activities_type.latestCreated:
                {
                    return function (item) {
                        return (--configMap.activities_number) > 0 && item.op === configMap.activities_op_type.new;
                    }
                }
                default :
                {
                    return function () {
                        return true;
                    };
                }
            }
        };

        return {
            getActivities: getActivities
        }
    })();

    //------transactionsModel-------
    var searchTrans,
        getTaskProcess, addReply, requestCurve, completeTrans, verifyPass, verifyNotPass,
        listNewCreated, listStartedTrans, updateExecutor, closeTask, getListTodayTasks, userListByGroup;

    var taskTypeFilter;

    transactionsModel = (function () {
        //工单类型filter
        taskTypeFilter = function (currentPage, orderObject) {
            var query = beop.model.stateMap.filter.taskTypeQuery;
            if (query) {
                query["_isDelete"] = {"$ne": true};
                if (!stateMap.teamPromise) {
                    stateMap.teamPromise = teamModel.getTeam();
                }
                return stateMap.teamPromise.then(function (teamResult) {
                    if (teamResult.success) {
                        stateMap.team = teamResult.data.team;
                    }

                    // 组装筛选的查询数据
                    if (orderObject && orderObject.filter && Object.keys(orderObject.filter).length) {
                        for (var prop in orderObject.filter) {
                            if (orderObject.filter.hasOwnProperty(prop)) {
                                query[prop] = orderObject.filter[prop][prop];
                            }
                        }
                    }

                    var sendData = {
                        query: typeof query === "object" ? JSON.stringify(query) : query,
                        pageNumber: currentPage || 1,
                        pageSize: configMap.task_page_size
                    };
                    $.extend(sendData, orderObject);
                    return emit(beop.apiMap.taskTypeFilter, sendData).done(function (result) {
                        if (result.success) {
                            stateMap.trans_list = result.data;
                        }
                    });
                });
            } else {
                return $.Deferred().reject("unknown type to translate query", query);
            }
        };

        searchTrans = function (user_id, text, currentPage, orderObject) {
            var param = {};
            for (var key in orderObject) {
                if (orderObject.hasOwnProperty(key)) {
                    param[key] = orderObject[key];
                }
            }
            param['text'] = text;
            param['userId'] = user_id ? user_id : stateMap.userId;
            return emit(beop.apiMap.searchTasks, {
                page_num: currentPage || 1,
                page_size: configMap.task_page_size
            }, param).done(function (result) {
                if (result.success) {
                    for (var m = 0; m < result.data.records.length; m++) {
                        stateMap.trans_cid_map[result.data.records[m].id] = result.data.records[m];
                    }
                    stateMap.trans_list = result.data;
                }
            });
        };

        completeTrans = function (trans) {
            if (!trans) {
                trans = {};
            }
            trans.userId = stateMap.userId;
            trans.transId = stateMap.cur_trans.id;
            return emit(beop.apiMap.completeTransaction, trans);
        };

        verifyPass = function (trans) {
            if (!trans) {
                trans = {};
            }
            trans.userId = stateMap.userId;
            trans.transId = stateMap.cur_trans.id;
            return emit(beop.apiMap.verifyPass, trans);
        };

        verifyNotPass = function (trans) {
            if (!trans) {
                trans = {};
            }
            trans.userId = stateMap.userId;
            trans.transId = stateMap.cur_trans.id;
            return emit(beop.apiMap.verifyNotPass, trans);
        };

        requestCurve = function (params) {
            return emit(beop.apiMap.faultCurve, params).done(function (result) {
                stateMap.cur_fault_curve = result;
            });
        };
        getTaskProcess = function (task_id) {
            if (!task_id) {
                task_id = beop.model.stateMap.cur_trans.id
            }
            return emit(beop.apiMap.getTaskProgress, {
                task_id: task_id
            }).done(function (result) {
                stateMap.progress = result.data;
            });
        };
        //已经创建的，但是尚未开始的工单任务
        listNewCreated = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getTransactionNewCreated, {
                user_id: user_id ? user_id : stateMap.userId,
                page_num: currentPage || 1,
                page_size: configMap.task_page_size
            }, orderObject).done(function (result) {
                if (result.success) {
                    for (var m = 0; m < result.data.records.length; m++) {
                        stateMap.trans_cid_map[result.data.records[m].id] = result.data.records[m];
                    }
                    stateMap.trans_list = result.data;
                }
            });
        };
        //已经创建，开始了的工单任务
        listStartedTrans = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getTransactionStarted, {
                user_id: user_id ? user_id : stateMap.userId,
                page_num: currentPage || 1,
                page_size: configMap.task_page_size
            }, orderObject).done(function (result) {
                if (result.success) {
                    for (var m = 0; m < result.data.records.length; m++) {
                        stateMap.trans_cid_map[result.data.records[m].id] = result.data.records[m];
                    }
                    stateMap.trans_list = result.data;
                }
            });
        };
        //更新执行人员
        updateExecutor = function (user_id, trans_id, userObject) {
            return emit(beop.apiMap.updateExecutor, {
                user_id: user_id,
                trans_id: trans_id
            }, userObject)
        };
        //关闭任务
        closeTask = function (user_id, trans_id) {
            return emit(beop.apiMap.closeTask, {
                user_id: user_id,
                trans_id: trans_id
            })
        };
        getListTodayTasks = function (userId) {
            return emit(beop.apiMap.getListTodayTasks, {
                userId: userId
            })
        };

        return {
            completeTrans: completeTrans,
            verifyPass: verifyPass,
            verifyNotPass: verifyNotPass,
            addReply: addReply,
            requestCurve: requestCurve,
            searchTrans: searchTrans,
            updateExecutor: updateExecutor,
            closeTask: closeTask,
            getListTodayTasks: getListTodayTasks,
            taskTypeFilter: taskTypeFilter,
            getTaskProcess: getTaskProcess
        }
    })();

    //------menuModel-------
    var getMenu, getSecondMenu;
    menuModel = (function () {
        getMenu = function () {
            return emit(beop.apiMap.listMenu, {
                userId: stateMap.userId
            })
        };

        getSecondMenu = function (firstMenu) {
            return emit(beop.apiMap.listSecondMenu, {
                userId: stateMap.userId,
                firstMenu: firstMenu
            })
        };

        return {
            getMenu: getMenu,
            getSecondMenu: getSecondMenu
        }
    })();

    //------replyModel-------
    var insertTaskReply, getTaskReply, deleteTaskReply, insertReplyToComment;
    replyModel = (function () {
        insertTaskReply = function (detail) {
            if (!detail.hasOwnProperty("taskId")) {
                detail["taskId"] = beop.model.stateMap.cur_trans.id;
            }
            return WebAPI.post("/workflow/task/comment/add", detail);
        };
        insertReplyToComment = function (detail) {
            return WebAPI.post('/workflow/activity/reply/', detail)
        };
        getTaskReply = function () {
            return WebAPI.get('/workflow/task/comment/get/' + beop.model.stateMap.cur_trans.id)
        };
        deleteTaskReply = function (model) {
            return WebAPI.post("/workflow/task/comment/delete", model)
        };
        return {
            deleteTaskReply: deleteTaskReply,
            insertTaskReply: insertTaskReply,
            getTaskReply: getTaskReply,
            insertReplyToComment: insertReplyToComment
        }
    })();
    //------GroupModel-------
    var getUserGroups, userDialogList, addGroup, deleteGroup, getGroupData, getTaskGroup;
    groupModel = (function () {
        getUserGroups = function (isProcess) {
            if (isProcess) {
                return WebAPI.post('/workflow/taskGroupProcess/');
            } else {
                return emit(beop.apiMap.userGroups, {'user_id': stateMap.userId}).done(function (result) {
                    if (result.success) {
                        stateMap.group_list = [];
                        for (var prop in result.data) {
                            if (result.data.hasOwnProperty(prop)) {
                                stateMap.group_list = stateMap.group_list.concat(result.data[prop]);
                            }
                        }
                    }
                });
            }
        };
        userDialogList = function () {
            return emit(beop.apiMap.userDialogList, {'user_id': stateMap.userId});
        };
        addGroup = function (param) {
            return emit(beop.apiMap.addGroup, {'user_id': stateMap.userId}, param);
        };
        deleteGroup = function (param) {
            return emit(beop.apiMap.deleteGroup, {group_id: param, user_id: stateMap.userId});
        };
        getGroupData = function (param) {
            return emit(beop.apiMap.getGroupData, {group_id: param, user_id: stateMap.userId})
        };
        editGroup = function (group_id, param) {
            return emit(beop.apiMap.editGroup, {group_id: group_id, user_id: stateMap.userId}, param)
        };
        userListByGroup = function (user_id, group_id) {
            return emit(beop.apiMap.userListByGroup, {
                user_id: user_id ? user_id : stateMap.userId,
                group_id: group_id
            })
        };

        getTaskGroup = function (groupId) {
            var promise;
            if (groupId) {
                promise = emit(beop.apiMap.taskGroupById, {group_id: groupId});
            } else {
                promise = emit(beop.apiMap.taskGroup);
            }
            return promise.done(function (result) {
                if (!result.success) {
                    alert(I18n.resource.workflow.task.CAN_NOT_FIND_TASK_GROUP);
                }
            });
        };
        return {
            getUserGroups: getUserGroups,
            userDialogList: userDialogList,
            addGroup: addGroup,
            deleteGroup: deleteGroup,
            getGroupData: getGroupData,
            editGroup: editGroup,
            userListByGroup: userListByGroup,
            getTaskGroup: getTaskGroup
        }
    })();

    //------tagsModel-------
    var getUserTags;
    tagsModel = (function () {
        getUserTags = function () {
            return emit(beop.apiMap.getUserTags, {'user_id': stateMap.userId}).done(function (result) {
                if (result.success) {
                    stateMap.tag_list = result.data;
                }
            });
        };
        return {
            getUserTags: getUserTags
        }
    })();


    //-----attachmentModel-----------------

    var getAttachment;
    attachmentModel = (function () {
        getAttachment = function (transId) {
            return emit(beop.apiMap.getAttachmentByTransId, {trans_id: transId}).done(function (result) {
                if (result.success) {

                }
            })
        };
        return {
            getAttachment: getAttachment
        }
    })();
    //--------------------------------------------------

    //---------------------------------- teamModel start ----------------------------------
    var getTeam, editTeam, addTeam, deleteTeam, quiteTeam;
    teamModel = (function () {
        getTeam = function () {
            return emit(beop.apiMap.team);
        };
        editTeam = function (data) {
            return emit(beop.apiMap.teamEdit, data);
        };
        addTeam = function (data) {
            return emit(beop.apiMap.teamNew, data);
        };
        deleteTeam = function (team_id) {
            return emit(beop.apiMap.teamDelete, {team_id: team_id});
        };

        quiteTeam = function (team_id) {
            return emit(beop.apiMap.quiteTeam, {team_id: team_id})
        };
        return {
            getTeam: getTeam,
            editTeam: editTeam,
            addTeam: addTeam,
            deleteTeam: deleteTeam,
            quiteTeam: quiteTeam
        }
    })();

    //---------------------------------- teamModel end ----------------------------------

    //region ---------------------------------- taskModelModel start ----------------------------------
    var saveTask, getTask, deleteTask, passTask, noPassTask, completeTask;
    taskModel = (function () {
        saveTask = function (data) {
            return emit(beop.apiMap.saveTask, data).done(function (result) {
                if (!result.success) {
                    alert('save failed.');
                    return false;
                }
            });
        };

        getTask = function (taskId) {
            return emit(beop.apiMap.getTask, {taskId: taskId}).done(function (result) {
                if (!result.success) {
                    alert('get task failed.');
                    return false;
                }
                //set _id to id;
                result.data.id = result.data._id;
                stateMap.cur_trans = result.data;
            });
        };

        deleteTask = function (taskId) {
            return emit(beop.apiMap.deleteTask, {taskId: taskId}).done(function (result) {
                if (!result.success) {
                    alert('delete task failed!');
                    return false;
                }
            });
        };

        passTask = function (taskId, nextUserId) {
            return emit(beop.apiMap.passTask, {taskId: taskId, nextUserId: nextUserId});
        };

        noPassTask = function (taskId) {
            return emit(beop.apiMap.noPassTask, {taskId: taskId});
        };

        completeTask = function (taskId, nextUserId) {
            return emit(beop.apiMap.completeTask, {taskId: taskId, nextUserId: nextUserId});
        };

        return {
            saveTask: saveTask,
            getTask: getTask,
            deleteTask: deleteTask,
            passTask: passTask,
            noPassTask: noPassTask,
            completeTask: completeTask
        }
    })();

    //endregion ---------------------------------- taskModelModel end ----------------------------------

    init = function () {
        stateMap.userId = AppConfig.userId;
        stateMap.userProfile = AppConfig.userProfile;
    };
    beop.model = beop.model ? beop.model : {};
    $.extend(beop.model, {
        init: init,
        activitiesModel: activitiesModel,
        transactionsModel: transactionsModel,
        menuModel: menuModel,
        replyModel: replyModel,
        stateMap: stateMap,
        groupModel: groupModel,
        tagsModel: tagsModel,
        attachmentModel: attachmentModel,
        teamModel: teamModel,
        taskModel: taskModel,
        taskPageSize: configMap.task_page_size
    });
})
(beop || (beop = {}));
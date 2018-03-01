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
            task_page_size: isSmallScreen ? 14 : 19
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
    var getActivities, getNextPageActivities,
    // startTime获取的动态开始时间
        startTime,
        getActivitiesFilter, editGroup;
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
                    var count = configMap.activities_number;
                    return function (item) {
                        return (--count) > 0 && item.op === configMap.activities_op_type.complete;
                    }
                }
                case configMap.activities_type.latestCreated:
                {
                    var count = configMap.activities_number;
                    return function (item) {
                        return (--count) > 0 && item.op === configMap.activities_op_type.new;
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

        getNextPageActivities = function () {
            return emit(beop.apiMap.listActivities, {
                userId: stateMap.userId,
                rownumber: (stateMap.rownumber + 1)
            }).done(function (result) {
                if (result.success) {
                    stateMap.activities = result.data;
                    stateMap.rownumber = ++stateMap.rownumber;
                }
            });
        };

        return {
            getActivities: getActivities,
            getNextPageActivities: getNextPageActivities
        }
    })();

    //------transactionsModel-------
    var getTrans, delTrans, addTrans, searchTrans, listTransWorking, listTransCreatedBy, listTransFinishedBy, listTransJoinedBy, listGroupTrans, getTaskProcess,
        updateTrans, addReply, requestCurve, getProgress, completeTrans, verifyPass, verifyNotPass, toggleStarred, collectionTrans, historyCompleteTrans, listTransStarBy, listNewCreated, listStartedTrans, listWaitVerify, startTransaction
        , updateExecutor, closeTask, getListTodayTasks, updateTransactionStatus, userListByGroup, waitMeToVerifier;

    var taskTypeFilter;

    transactionsModel = (function () {
        //工单类型filter
        taskTypeFilter = function (currentPage, orderObject) {
            var query = beop.model.stateMap.filter.taskTypeQuery;
            if (query) {
                query["_isDelete"] = {"$ne": true};
                return teamModel.getTeam().then(function (teamResult) {
                    if (teamResult.success) {
                        stateMap.team = teamResult.data.team;
                        query['teamId'] = stateMap.team._id;
                    }

                    // 组装筛选的查询数据
                    if (orderObject && orderObject.filter && Object.keys(orderObject.filter).length) {
                        for (var prop in orderObject.filter) {
                            query[prop] = orderObject.filter[prop][prop];
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

        getTrans = function (trans_id) {
            return emit(beop.apiMap.getTransaction, {
                trans_id: trans_id
            }, {user_id: stateMap.userId}).done(function (result) {
                stateMap.cur_trans = result.data;
                stateMap.trans_cid_map[trans_id] = result.data;
            });
        };

        delTrans = function (trans_id) {
            if (!trans_id) {
                trans_id = stateMap.cur_trans.id;
            }
            return emit(beop.apiMap.delTransaction, {
                trans_id: trans_id
            }, {user_id: stateMap.userId}).done(function (result) {
                stateMap.cur_trans = null;
                if (stateMap.trans_cid_map[trans_id]) {
                    delete stateMap.trans_cid_map[trans_id];
                }
            });
        };

        listTransWorking = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getTransactionWorking, {
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

        listTransStarBy = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getTransactionStar, {
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

        listTransCreatedBy = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getTransactionCreatedBy, {
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
        listTransFinishedBy = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getTransactionFinishedBy, {
                user_id: user_id ? user_id : stateMap.userId,
                page_num: currentPage || 1,
                page_size: configMap.task_page_size
            }, orderObject).done(function (result) {
                if (result.success) {
                    for (var m = 0; m < result.data.length; m++) {
                        stateMap.trans_cid_map[result.data.records[m].id] = result.data.records[m];
                    }
                    stateMap.trans_list = result.data;
                }
            });
        };
        listTransJoinedBy = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getTransactionJoinedBy, {
                user_id: user_id ? user_id : stateMap.userId,
                page_num: currentPage || 1,
                page_size: configMap.task_page_size
            }, orderObject).done(function (result) {
                if (result.success) {
                    for (var m = 0; m < result.data.length; m++) {
                        stateMap.trans_cid_map[result.data.records[m].id] = result.data.records[m];
                    }
                    stateMap.trans_list = result.data;
                }
            });
        };

        searchTrans = function (user_id, text, currentPage, orderObject) {
            var param = {};
            for (var key in orderObject) {
                param[key] = orderObject[key];
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

        listGroupTrans = function (currentPage, orderObject) {
            return emit(beop.apiMap.transInGroups, {
                group_id: stateMap.currentGroupId ? stateMap.currentGroupId : 0,
                page_num: currentPage || 1,
                page_size: configMap.task_page_size
            }, orderObject).done(function (result) {
                stateMap.trans_list = result.data;
            });
        };

        addTrans = function (trans) {
            trans.userId = stateMap.userId;
            return emit(beop.apiMap.addTransaction, trans);
        };

        updateTrans = function (trans) {
            trans.userId = stateMap.userId;
            trans.transId = stateMap.cur_trans.id;
            return emit(beop.apiMap.updateTransaction, trans);
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

        addReply = function () {

        };

        requestCurve = function (params) {
            return emit(beop.apiMap.faultCurve, params).done(function (result) {
                stateMap.cur_fault_curve = result;
            });
        };

        getProgress = function (trans_id) {
            if (!trans_id) {
                trans_id = stateMap.cur_trans.id
            }
            return emit(beop.apiMap.getProgress, {
                trans_id: trans_id
            }).done(function (result) {
                stateMap.progress = result.data;
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
        toggleStarred = function (trans_id, user_id) {
            if (!trans_id) {
                trans_id = stateMap.cur_trans.id
            }
            return emit(beop.apiMap.toggleStarred, {
                trans_id: trans_id,
                user_id: user_id
            }).done(function (result) {

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
        //历史完成的任务
        historyCompleteTrans = function (currentPage, orderObject) {
            return emit(beop.apiMap.getHistoryCompleteTasks, {
                page_num: currentPage || 1,
                page_size: configMap.task_page_size
            }).done(function (result) {

            })
        };
        //已经完成，等待验证的工单任务
        listWaitVerify = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getTransactionWaitVerify, {
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
        //开始任务
        startTransaction = function (user_id, trans_id) {
            return emit(beop.apiMap.startTransaction, {
                user_id: user_id,
                trans_id: trans_id
            }).done(function () {

            })
        };
        //更新执行人员
        updateExecutor = function (user_id, trans_id, userObject) {
            return emit(beop.apiMap.updateExecutor, {
                user_id: user_id,
                trans_id: trans_id
            }, userObject).done(function () {

            })
        };
        //关闭任务
        closeTask = function (user_id, trans_id) {
            return emit(beop.apiMap.closeTask, {
                user_id: user_id,
                trans_id: trans_id
            }).done(function () {

            })
        };
        getListTodayTasks = function (userId) {
            return emit(beop.apiMap.getListTodayTasks, {
                userId: userId
            }).done(function () {
            })
        };
        updateTransactionStatus = function (param) {
            return emit(beop.apiMap.updateTransactionStatus, {
                transId: param.transId,
                userId: param.userId
            }).done(function () {
            })
        };
        waitMeToVerifier = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.waitMeToVerifier, {
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
        return {
            getTrans: getTrans,
            delTrans: delTrans,
            addTrans: addTrans,
            completeTrans: completeTrans,
            verifyPass: verifyPass,
            verifyNotPass: verifyNotPass,
            updateTrans: updateTrans,
            addReply: addReply,
            getProgress: getProgress,
            requestCurve: requestCurve,
            listTransWorking: listTransWorking,
            listTransCreatedBy: listTransCreatedBy,
            listTransFinishedBy: listTransFinishedBy,
            listTransJoinedBy: listTransJoinedBy,
            listTransStarBy: listTransStarBy,
            listGroupTrans: listGroupTrans,
            searchTrans: searchTrans,
            toggleStarred: toggleStarred,
            listNewCreated: listNewCreated,
            listWaitVerify: listWaitVerify,
            listStartedTrans: listStartedTrans,
            startTransaction: startTransaction,
            updateExecutor: updateExecutor,
            closeTask: closeTask,
            getListTodayTasks: getListTodayTasks,
            updateTransactionStatus: updateTransactionStatus,
            waitMeToVerifier: waitMeToVerifier,
            historyCompleteTrans: historyCompleteTrans,
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
            }).done(function (result) {
            });
        };

        getSecondMenu = function (firstMenu) {
            return emit(beop.apiMap.listSecondMenu, {
                userId: stateMap.userId,
                firstMenu: firstMenu
            }).done(function (result) {
            });
        };

        return {
            getMenu: getMenu,
            getSecondMenu: getSecondMenu
        }
    })();

    //------replyModel-------
    var insertReply, deleteReply, insertTaskReply, getTaskReply, deleteTaskReply, insertReplyToComment;
    replyModel = (function () {
        insertReply = function (param) {
            param['userId'] = stateMap.userId;
            if (!param['ofTransactionId']) {
                param['ofTransactionId'] = stateMap.cur_trans.id;
            }
            return emit(beop.apiMap.insertReply, param);
        };
        insertTaskReply = function (detail) {
            if (!detail.hasOwnProperty("taskId")) {
                detail["taskId"] = beop.model.stateMap.cur_trans.id;
            }
            return WebAPI.post("/workflow/task/comment/add", detail);
        };
        insertReplyToComment = function (detail) {
            return WebAPI.post('/workflow/activity/reply/', detail)
        };
        deleteReply = function (user_id, param) {
            return emit(beop.apiMap.deleteReply, {'user_id': user_id}, param)
        };
        getTaskReply = function () {
            return WebAPI.get('/workflow/task/comment/get/' + beop.model.stateMap.cur_trans.id)
        };
        deleteTaskReply = function (model) {
            return WebAPI.post("/workflow/task/comment/delete", model)
        };
        return {
            insertReply: insertReply,
            deleteReply: deleteReply,
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
            }).done(function (result) {

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
    var getUserTags, addTag, deleteTag, editTag, addTransTag, transTagDelete, tagTrans;
    tagsModel = (function () {
        getUserTags = function () {
            return emit(beop.apiMap.getUserTags, {'user_id': stateMap.userId}).done(function (result) {
                if (result.success) {
                    stateMap.tag_list = result.data;
                }
            });
        };
        addTag = function (param, tagInfo) {
            return emit(beop.apiMap.addTag, param, tagInfo).done(function (result) {
                if (result.success) {
                    stateMap.tag_list = result.data;
                }
            });
        };
        deleteTag = function (param) {
            return emit(beop.apiMap.deleteTag, param).done(function (result) {
                if (result.success) {
                    stateMap.tag_list = result.data;
                }
            });
        };
        editTag = function (param, tagInfo) {
            return emit(beop.apiMap.editTag, param, tagInfo);
        };
        addTransTag = function (param) {
            return emit(beop.apiMap.addTransTag, param);
        };
        transTagDelete = function (param) {
            return emit(beop.apiMap.transTagDelete, param).done(function (result) {
                if (result.success) {
                    //stateMap.trans_list = result.data;
                }
            });
        };

        tagTrans = function (param) {
            return emit(beop.apiMap.tagTrans, param).done(function (result) {
                if (result.success) {
                    //stateMap.trans_list = result.data;
                }
            });
        };
        return {
            getUserTags: getUserTags,
            addTag: addTag,
            deleteTag: deleteTag,
            editTag: editTag,
            addTransTag: addTransTag,
            transTagDelete: transTagDelete,
            tagTrans: tagTrans
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

    beop.model = {
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
    }
})
(beop || (beop = {}));
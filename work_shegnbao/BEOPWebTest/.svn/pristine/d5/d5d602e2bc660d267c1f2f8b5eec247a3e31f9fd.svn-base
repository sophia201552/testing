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
    var activitiesModel, transactionsModel, menuModel, replyModel, groupModel, tagsModel, attachmentModel;

    //------activitiesModel---------
    var getActivities, getNextPageActivities,
    // startTime获取的动态开始时间
        startTime,
        getActivitiesFilter,
        storedActivities, editGroup;
    activitiesModel = (function () {

        getActivities = function (type, page) {
            Spinner.spin($('#wf-level-menu').get(0));
            beop.view.activities.configModel({
                activities_number: configMap.activities_number
            });
            return emit(beop.apiMap.listGroupActivities,
                {
                    userId: stateMap.userId,
                    activity_time_type: type,
                    page: page ? page : 1,
                    limit: configMap.activities_number
                }, {
                    lastActivityID: stateMap.lastActivityID
                }
            ).done(function (result) {
                if (result.success) {
                    try {
                        window.localStorage.removeItem("beopcache/activities")
                    } catch (ex) {
                    }
                    storedActivities = result.data;
                    //TODO 数据从这里来的，得到总数据
                    if (!storedActivities.activities || !storedActivities.activities.length) {
                        stateMap.activities = [];
                    } else {
                        stateMap.activities = storedActivities.activities;
                    }
                    stateMap.totalCount = storedActivities.totalCount;
                    stateMap.activity_type = type;
                    stateMap.backup_activity_type = storedActivities.backup_activity_type;
                    stateMap.lastActivityID = stateMap.activities.length >= 1 ? stateMap.activities[stateMap.activities.length - 1].id : null
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
    var trans_id,
        getTrans, delTrans, addTrans, searchTrans, listTransWorking, listTransCreatedBy, listTransFinishedBy, listTransJoinedBy, listGroupTrans,
        updateTrans, addReply, faultCurve, getReply, getProgress, completeTrans, verifyPass, verifyNotPass, toggleStarred, collectionTrans, listTransStarBy, listNewCreated, listStartedTrans, listWaitVerify, startTransaction
        , updateExecutor, closeTask, getCompleteVerifiedTask, getStopVerifiedTask, getListTodayTasks, updateTransactionStatus, userListByGroup, waitMeToVerifier;

    transactionsModel = (function () {
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
        getCompleteVerifiedTask = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getCompleteVerifiedTask, {
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
        getStopVerifiedTask = function (user_id, currentPage, orderObject) {
            return emit(beop.apiMap.getStopVerifiedTask, {
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
                group_id: stateMap.currentGroupId,
                user_id: AppConfig.userId,
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

        faultCurve = function (trans_id) {
            if (!trans_id) {
                trans_id = stateMap.cur_trans.id;
            }
            return emit(beop.apiMap.faultCurve, {
                trans_id: trans_id
            }).done(function (result) {
                stateMap.cur_fault_curve = result.data;
            });
        };

        getReply = function (trans_id) {
            if (!trans_id) {
                trans_id = stateMap.cur_trans.id
            }
            return emit(beop.apiMap.getReply, {
                trans_id: trans_id
            }).done(function (result) {
                stateMap.replyList = result.data;
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
            getReply: getReply,
            getProgress: getProgress,
            faultCurve: faultCurve,
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
            getCompleteVerifiedTask: getCompleteVerifiedTask,
            getStopVerifiedTask: getStopVerifiedTask,
            getListTodayTasks: getListTodayTasks,
            updateTransactionStatus: updateTransactionStatus,
            waitMeToVerifier: waitMeToVerifier
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
    var insertReply, deleteReply;
    replyModel = (function () {
        insertReply = function (param) {
            param['userId'] = stateMap.userId;
            if (!param['ofTransactionId']) {
                param['ofTransactionId'] = stateMap.cur_trans.id;
            }
            return emit(beop.apiMap.insertReply, param);
        };
        deleteReply = function (user_id, param) {
            return emit(beop.apiMap.deleteReply, {'user_id': user_id}, param)
        };
        return {insertReply: insertReply, deleteReply: deleteReply}
    })();
    //------GroupModel-------
    var getUserGroups, userDialogList, addGroup, deleteGroup, getGroupData;
    groupModel = (function () {
        getUserGroups = function () {
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
        return {
            getUserGroups: getUserGroups,
            userDialogList: userDialogList,
            addGroup: addGroup,
            deleteGroup: deleteGroup,
            getGroupData: getGroupData,
            editGroup: editGroup,
            userListByGroup: userListByGroup
        }
    })();

    //------tagsModel-------
    var getUserTags, addTag, deleteTag, editTag, addTransTag, transTag, transTagDelete, tagTrans;
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

        transTag = function (user_id, tag_id, currentPage, orderObject) {//  /workflow/tag/trans/<user_id>/<tag_id>/<page_num>/<page_size>
            return emit(beop.apiMap.transTag, {
                user_id: user_id ? user_id : stateMap.userId,
                tag_id: tag_id,
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
            transTag: transTag,
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
        taskPageSize: configMap.task_page_size
    }
})
(beop || (beop = {}));
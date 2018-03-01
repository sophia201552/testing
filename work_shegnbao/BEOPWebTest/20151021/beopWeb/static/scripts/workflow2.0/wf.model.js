(function (beop) {
    //公用
    var configMap = {
            
            date_format_full: 'yyyy-MM-dd HH:mm:ss',
            date_format_YMD: 'yyyy-MM-dd',

            activities_number: 20,
            transaction_number: 13,
            activities_store_key: 'activities',
            activities_type: {
                today: 'today',
                yesterday: 'yesterday',
                thisWeek: 'thisWeek',
                thisMonth: 'thisMonth',
                latestCompleted: 'latestCompleted',
                latestCreated: 'latestCreated'
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
            tag_list: []
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
    var activitiesModel, transactionsModel, menuModel, replyModel, groupModel, tagsModel;

    //------activitiesModel---------
    var getActivities, getNextPageActivities,
    // startTime获取的动态开始时间
        startTime,
        getActivitiesFilter,
        storedActivities, editGroup;
    activitiesModel = (function () {

        getActivities = function (type, startTime) {
            startTime = startTime ? startTime : new Date().format(configMap.date_format_full);

            return stateMap.store.getItem(configMap.activities_store_key).then(function (storedData) {
                return emit(beop.apiMap.listGroupActivities,
                    {
                        userId: stateMap.userId,
                        latestUpdateTime: storedData.latestUpdateTime ? storedData.latestUpdateTime : ''
                    }
                ).done(function (result) {
                        if (result.success) {
                            storedActivities = storedData ? storedData : {data: [], latestUpdateTime: ""};

                            if (result.data && result.data.length) {
                                for (var m = 0; m < result.data.length; m++) {
                                    if (result.data[m].id in stateMap.activity_cid_map) {
                                        var old_activity = stateMap.activity_cid_map[result.data[m].id];
                                        result.data[m].reply = result.data[m].reply ? result.data[m].reply.concat(old_activity.reply ? old_activity.reply : []) : [];
                                        result.data[m].reply.sort(function (a, b) {
                                            return a.replyTime > b.replyTime;
                                        });
                                        result.data[m].latestUpdateTime = result.data[m].reply[result.data[m].reply.length - 1] && result.data[m].reply[result.data[m].reply.length - 1].replyTime;

                                        for (var n = 0; n < storedActivities.data.length; n++) {
                                            if (storedActivities.data[n].id === old_activity.id) {
                                                storedActivities.data.splice(n, 1);
                                            }
                                        }
                                    } else {
                                        result.data[m].latestUpdateTime = result.data[m].opTime;
                                    }
                                }

                                storedActivities.data = result.data.concat(storedActivities.data ? storedActivities.data : []);
                                result.data.map(function (item) {
                                    stateMap.activity_cid_map[item.id] = item;
                                });
                                storedActivities.data.sort(function (a, b) {
                                    return a.latestUpdateTime < b.latestUpdateTime;
                                });

                                storedActivities.latestUpdateTime = startTime;

                                stateMap.store.setItem(configMap.activities_store_key, storedActivities);
                            }

                            if (!storedActivities.data || !storedActivities.data.length) {
                                stateMap.activities = [];
                                return false;
                            }
                            stateMap.backup_activities = [];
                            if (type) {
                                //TODO 数据从这里来的，得到总数据
                                stateMap.activities = storedActivities.data.filter(getActivitiesFilter(type));
                                if (!stateMap.activities || !stateMap.activities.length) {
                                    switch (type) {
                                        //TODO 修改点1
                                        case configMap.activities_type.today:
                                            //beop.model.stateMap.activities
                                            //beop.model.stateMap.backup_activities
                                            stateMap.backup_activities = storedActivities.data.filter(getActivitiesFilter(configMap.activities_type.yesterday));
                                            break;
                                        case configMap.activities_type.yesterday:
                                            stateMap.backup_activities = storedActivities.data.filter(getActivitiesFilter(configMap.activities_type.thisWeek));
                                            break;
                                    }
                                }
                            } else {
                                stateMap.activities = storedActivities.data;
                            }
                        }
                    });
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
        updateTrans, addReply, faultCurve, getReply, getProgress, completeTrans, verifyPass, verifyNotPass, toggleStarred, collectionTrans, listTransStarBy;

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
                page_size: configMap.transaction_number
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
                page_size: configMap.transaction_number
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
                page_size: configMap.transaction_number
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
                page_size: configMap.transaction_number
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
                page_size: configMap.transaction_number
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
                page_size: configMap.transaction_number
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
                page_size: configMap.transaction_number
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
            toggleStarred: toggleStarred
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
    var insertReply;
    replyModel = (function () {
        insertReply = function (param) {
            param['userId'] = stateMap.userId;
            if (!param['ofTransactionId']) {
                param['ofTransactionId'] = stateMap.cur_trans.id;
            }
            return emit(beop.apiMap.insertReply, param);
        };
        return {insertReply: insertReply}
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
        return {
            getUserGroups: getUserGroups,
            userDialogList: userDialogList,
            addGroup: addGroup,
            deleteGroup: deleteGroup,
            getGroupData: getGroupData,
            editGroup: editGroup
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
                page_size: configMap.transaction_number
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

    //--------------------------------------------------
    init = function () {
        stateMap.userId = AppConfig.userId;
        stateMap.userProfile = AppConfig.userProfile;

        stateMap.store = new Beop.cache.BaseCache({'driver': 'localStorage'});
        stateMap.store.getItem(configMap.activities_store_key).done(function (storedData) {
            if (storedData === null || !storedData) {
                stateMap.store.setItem(configMap.activities_store_key, {data: [], latestUpdateTime: ""});
            } else {
                stateMap.activities = storedData.data;
            }
        });

    };

    beop.model = {
        init: init,
        activitiesModel: activitiesModel,
        transactionsModel: transactionsModel,
        menuModel: menuModel,
        replyModel: replyModel,
        stateMap: stateMap,
        groupModel: groupModel,
        tagsModel: tagsModel
    }
})
(beop || (beop = {}));
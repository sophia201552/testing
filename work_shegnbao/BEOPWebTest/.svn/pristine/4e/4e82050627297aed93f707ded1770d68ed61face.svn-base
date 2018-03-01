(function (beop) {
    var configMap = {
            htmlURL: '',
            settable_map: {
                cb_dialog_hide: true,
                cb_dialog_show: true,
                group_model: true,
                userHasSelected: true,
                maxSelected: true,
                enableDeleteMember: true,
                enableAddMember: true,
                maxDelete: true
            },
            cb_dialog_hide: $.noop,
            cb_dialog_show: $.noop,
            group_model: null,
            userHasSelected: null,
            maxSelected: null,
            enableDeleteMember: true,
            enableAddMember: true,
            KEY_PY_STORY: 'BEOP.WF.PY',
            maxDelete: null
        },
        stateMap = {
            usersMap: [],
            defaultAddedUserList: [],
            addedUserList: [],
            allUserList: [],
            PYMap: [],
            selectedClassPrefix: 'wf-member-selected',
            //取消已经选中的人物  和删除区分开来
            memberSelectedDiff: []
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init;
    //方法名称
    var progressResultData, bindEvents, renderCheckedUsers, isPYStored;
    //事件操作方法名称
    var filterCheckedUser, searchByFirstName, getPYLocalStorage, getZH_EN, addActiveSearchBtn, setPYMap, searchByInput, showSearchByID, resetData,
        renderAddedUsers, onClickUser, onClickRemoveUser, removeMember, addMember, isMemberAdded, checkUserSelectedAmount, checkUserDeletedAmount, restoreSearchResult;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container: $container,
            $add_user_dialog: $container.find('#wf-add-person'),
            $wf_check_result: $container.find('.wf-check-result')
        };
        jqueryMap.$wf_search_by_firstName_li = jqueryMap.$add_user_dialog.find('.wf-search-result-title ul li');
        jqueryMap.$wf_search_byInput = jqueryMap.$add_user_dialog.find('#input-search-name');
        jqueryMap.$wf_search_result = jqueryMap.$add_user_dialog.find('.wf-search-result');
        jqueryMap.$wf_search_result_list = jqueryMap.$add_user_dialog.find('.wf-member');
        jqueryMap.$wf_added_user_list = jqueryMap.$add_user_dialog.find('.wf-added-user-list');
        jqueryMap.$wf_seaych_byInput = jqueryMap.$add_user_dialog.find('#input-search-name');
        jqueryMap.$wf_close_btn1 = jqueryMap.$add_user_dialog.find('.modal-header button');
        jqueryMap.$wf_search_result_list.removeClass(stateMap.selectedClassPrefix);
        jqueryMap.$wf_check_result.empty();
        jqueryMap.$wf_search_byInput.val('');
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container, group_id) {
        resetData();
        stateMap.$container = $container;
        var dealData = function (resultData) {
            setJqueryMap();
            //处理数据
            progressResultData(resultData);
        };
        if (group_id) {
            configMap.group_model.userListByGroup(AppConfig.userId, group_id).done(function (resultData) {
                if (resultData.success) {
                    dealData(resultData);
                }
            });
        } else {
            configMap.group_model.userDialogList().done(function (resultData) {
                if (resultData.success) {
                    dealData(resultData);
                }
            });
        }
        //$.spEvent.subEvent(stateMap.$container, 'wf-task-list', loadTaskList);
    };

    //---------DOM操作------
    bindEvents = function () {

        jqueryMap.$wf_search_result.off().on('click', '.wf-member', onClickUser);
        //删除人物
        jqueryMap.$wf_check_result.off().on('click', '.glyphicon-remove', onClickRemoveUser);
        //通过首字母筛选任务
        jqueryMap.$wf_search_by_firstName_li.off().on('click', searchByFirstName);
        //通过搜索来查询
        jqueryMap.$wf_seaych_byInput.off().on('keyup', searchByInput);
        jqueryMap.$wf_close_btn1.off().on('click', function () {
            jqueryMap.$add_user_dialog.modal('hide');
        });

        //TODO 之前的设置的模态框关闭后就添加人物
        jqueryMap.$wf_comfirm_btn = jqueryMap.$add_user_dialog.find('#wf-member-comfirm-btn');
        jqueryMap.$wf_comfirm_btn.off().on('click', renderAddedUsers);
        jqueryMap.$add_user_dialog.off().on('hide.bs.modal', function () {
            jqueryMap.$wf_check_result.html(beopTmpl('tpl_wf_dialog_added_member', {members: stateMap.defaultAddedUserList}));
            //这里是关闭modal 重新设置缓存 把 default 的内容复制到 缓存中
            //缓存 stateMap.addedUserList
            stateMap.addedUserList = [];
            for (var i = 0; i < stateMap.defaultAddedUserList.length; i++) {
                stateMap.addedUserList.push(stateMap.defaultAddedUserList[i]);
            }
            //重新设置一次 .wf-member 的选中状态
            jqueryMap.$wf_search_result_list.removeClass(stateMap.selectedClassPrefix);
            jqueryMap.$wf_search_result_list.each(function () {
                var $this = $(this);
                for (var i = 0; i < stateMap.defaultAddedUserList.length; i++) {
                    if (stateMap.defaultAddedUserList[i].id == $this.data('user-id')) {
                        $this.addClass(stateMap.selectedClassPrefix)
                    }
                }
            })
        });


    };

    renderCheckedUsers = function () {
        jqueryMap.$wf_check_result.html(beopTmpl('tpl_wf_dialog_added_member', {members: stateMap.addedUserList}))
    };

    renderAddedUsers = function () {
        //jqueryMap.$wf_added_user_list.html(beopTmpl('tpl_wf_added_member', {members: stateMap.addedUserList}))
        //点击确定后清空原来的default内容，把新添加的复制到缓存中去
        stateMap.defaultAddedUserList = [];
        for (var i = 0; i < stateMap.addedUserList.length; i++) {
            stateMap.defaultAddedUserList.push(stateMap.addedUserList[i]);
        }
        configMap.cb_dialog_hide(stateMap.addedUserList);
        jqueryMap.$add_user_dialog.modal('hide');
    };

    //---------方法---------
    progressResultData = function (result) {
        //如果存在传入的 已经选择过的人员 数组 那就直接把已经选择过的人员覆盖
        if (configMap.userHasSelected && configMap.userHasSelected.length !== 0) {
            stateMap.addedUserList = configMap.userHasSelected;
        }
        var addedUserMap = {};
        var m;
        for (m = 0; m < stateMap.addedUserList.length; m++) {
            addedUserMap['' + stateMap.addedUserList[m].id] = stateMap.addedUserList[m];
        }
        stateMap.allUserList = result.data;
        jqueryMap.$wf_search_result.html(beopTmpl('tpl_wf_member', {
            members: result.data,
            addUserMap: addedUserMap
        }));
        for (var n = 0; n < result.data.length; n++) {
            var user = result.data[n];
            stateMap.usersMap['' + user.id] = user;
        }
        //stateMap.$container.html(resultData);
        I18n.fillArea(stateMap.$container);
        setPYMap();
        //只有这个内容是动态刷新出来的，其他的都不是
        jqueryMap.$wf_search_result_list = jqueryMap.$add_user_dialog.find('.wf-member');
        bindEvents();
        //重新画一次那个已经选择好人物的状态栏
        renderCheckedUsers();
        //重置搜索状态
        restoreSearchResult();
        jqueryMap.$add_user_dialog.on('show.bs.modal', function () {
            restoreSearchResult();
        }).modal('show');
    };
    restoreSearchResult = function () {
        jqueryMap.$wf_search_result_list.show();
        addActiveSearchBtn(null, 2);
    };
    //通过头部的  stateMap.usersMap 设定拼音表
    setPYMap = function () {
        var PYFormat = new pyFormat(), itemPY = {};
        PYFormat.getPYLocalStorage().done(function (result) {
            stateMap.usersMap.forEach(function (item) {
                itemPY = PYFormat.getPYMap(result, item.userfullname.charAt(0))[0];
                if (item.id && itemPY) {
                    itemPY.id = item.id;
                }
                stateMap.PYMap.push(itemPY);
            });
        });
        PYFormat = null;
    };
    //显示出来搜索的内容统一方法
    showSearchByID = function (result) {
        if (Object.prototype.toString.call(result) !== '[object Array]') return;
        jqueryMap.$wf_search_result_list.hide();
        var i;
        for (i = 0; i < result.length; i++) {
            jqueryMap.$wf_search_result_list.each(function () {
                if ($(this).data('user-id') == result[i]) {
                    $(this).show();
                }
            })
        }
    };

    removeMember = function (userId) {
        for (var m = 0; m < stateMap.addedUserList.length; m++) {
            if (stateMap.addedUserList[m].id == userId) {
                stateMap.addedUserList.splice(m, 1);
            }
        }
    };


    addMember = function (userId) {
        stateMap.addedUserList.push(stateMap.usersMap['' + userId]);
    };
    isMemberAdded = function (userId) {
        for (var m = 0; m < stateMap.addedUserList.length; m++) {
            if (stateMap.addedUserList[m].id == userId) {
                return true;
            }
        }
        return false;
    };

    resetData = function () {
        stateMap.usersMap = [];
        stateMap.addedUserList = [];
        stateMap.allUserList = [];
        stateMap.PYMap = [];
        stateMap.memberSelectedDiff = [];
        stateMap.defaultAddedUserList = [];
    };
    //---------事件---------

    //检查用户选择了多少人物
    checkUserSelectedAmount = function () {
        if (configMap.maxSelected) {
            var li = jqueryMap.$wf_check_result.find('li');
            var length = li.length == 'undefined' ? 0 : li.length;
            if (configMap.maxSelected <= length) {
                return false;
            }
        }
        return true;
    };
    checkUserDeletedAmount = function () {
        if (configMap.maxDelete) {
            var li = jqueryMap.$wf_check_result.find('li');
            var length = li.length == 'undefined' ? 0 : li.length;
            if (configMap.maxDelete < length) {
                return true;
            }
            return false;
        }
        return true;
    };
    onClickUser = function () {
        var $this = $(this), selectedClass = stateMap.selectedClassPrefix;
        var userId = '' + $this.data('user-id');
        if (configMap.maxSelected == 1) {
            if (!$this.hasClass(selectedClass)) {
                if (!isMemberAdded(userId)) {
                    stateMap.addedUserList = [];
                    addMember(userId);
                    jqueryMap.$wf_search_result_list.removeClass(selectedClass);
                    $this.addClass(selectedClass);
                }
            }
        } else {
            if (!$this.hasClass(selectedClass)) {
                //默认情况下 可以添加人物 也可以删除人物
                if (configMap.enableAddMember) {
                    if (checkUserSelectedAmount()) {
                        if (!isMemberAdded(userId)) {
                            addMember(userId);
                            $this.addClass(selectedClass);
                            //stateMap.memberSelectedDiff.push(userId);
                        }
                    } else {
                        Alert.danger(ElScreenContainer, '超过最大选择数量').showAtTop(300);
                        return false;
                    }
                } else {
                    Alert.danger(ElScreenContainer, '不能添加人物').showAtTop(300);
                    return false;
                }
            } else {
                if (configMap.enableDeleteMember) {
                    if (checkUserDeletedAmount()) {
                        $this.removeClass(selectedClass);
                        removeMember(userId);
                    }
                } else {
                    Alert.danger(ElScreenContainer, '不能删除人物').showAtTop(300);
                    return false;
                }
            }
        }
        renderCheckedUsers();
    };

    onClickRemoveUser = function () {
        var $this = $(this), userId = $this.data('user-id');
        if (configMap.enableDeleteMember) {
            if (checkUserDeletedAmount()) {
                $this.parent().remove();
                removeMember(userId);
                filterCheckedUser(userId);
            }
        } else {
            Alert.danger(ElScreenContainer, '不能删除已经存在的人物').showAtTop(300);
            return false;
        }
    };
    //通过首字母来筛选人物
    //只要中文或者英文的首字母匹配到就显示
    searchByFirstName = function () {
        var $this = $(this), searchIndex = $this.text(), result = [], key, i;
        //更改字母选中样式
        addActiveSearchBtn($this, 1);
        //如果点击的是第一个 全部
        if ($this.index() == 0) {
            jqueryMap.$wf_search_result_list.show();
        } else {
            //遍历提前设定好的 PYMap
            for (i = 0; i < stateMap.PYMap.length; i++) {
                if (stateMap.PYMap[i] && (stateMap.PYMap[i].pinyin.charAt(0).toLowerCase() == searchIndex || stateMap.PYMap[i].acronym.charAt(0).toLowerCase() == searchIndex)) {
                    result.push(stateMap.PYMap[i].id)
                }
            }
            showSearchByID(result);
        }
    };
    //通过输入文字来筛选人物
    searchByInput = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var $this = $(this);
        var value = $.trim($this.val());
        //如果输入的文字是空的时候,就显示全部
        if (value == '') {
            jqueryMap.$wf_search_result_list.show();
            addActiveSearchBtn(null, 2);
        } else {
            var result = [];
            for (var i = 0; i < stateMap.allUserList.length; i++) {
                (function (i) {
                    var member = stateMap.allUserList[i];
                    if (member.userfullname.toLowerCase().indexOf(value.toLowerCase()) != -1) {
                        result.push(member.id)
                    }
                })(i)
            }
            showSearchByID(result)
        }
    };
    //删除人物的同时视图显示出来   去掉 wf-member-selected
    filterCheckedUser = function (userId) {
        jqueryMap.$wf_search_result_list.each(function () {
            var $this = $(this);
            if ($this.data('user-id') == userId) {
                $this.removeClass(stateMap.selectedClassPrefix);
            }
        })
    };
    addActiveSearchBtn = function ($which, type) {
        //点击 li 搜索的时候
        if ($which && type == 1) {
            jqueryMap.$wf_search_by_firstName_li.removeClass('active');
            $which.addClass('active');
        } else if (type == 2) {
            //输入文字搜索 文字为空的时候
            jqueryMap.$wf_search_by_firstName_li.removeClass('active').eq(0).addClass('active');
        }
    };

    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.memberSelected = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

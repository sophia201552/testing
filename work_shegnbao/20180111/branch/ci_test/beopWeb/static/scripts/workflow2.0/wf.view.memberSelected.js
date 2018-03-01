(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/memberSelected.html',
            htmlTemplateId: '#wf-memberSelected-container',
            settable_map: {
                cb_dialog_hide: true,
                cb_dialog_show: true,
                userHasSelected: true,
                userMemberMap: true,
                maxSelected: true,
                enableDeleteMember: true,
                enableAddMember: true,
                maxDelete: true,
                userReadOnly: false
            },
            cb_dialog_hide: $.noop,
            cb_dialog_show: $.noop,
            userMemberMap: null,
            userHasSelected: [],
            maxSelected: null,
            enableDeleteMember: true,
            enableAddMember: true,
            KEY_PY_STORY: 'BEOP.WF.PY',
            maxDelete: null,
            userReadOnly: false
        },
        stateMap = {
            usersMap: [],
            addedUserList: [],
            userHasSelected: [],
            userHasSelectedDefault: [],
            allUserList: [],
            PYMap: [],
            selectedClassPrefix: 'wf-member-selected',
            //取消已经选中的人物  和删除区分开来
            memberSelectedDiff: [],
            isConfirm: false,
            userReadOnly: false
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init;
    //方法名称
    var progressResultData, bindEvents, renderCheckedUsers;
    //事件操作方法名称
    var filterCheckedUser, searchByFirstName, addActiveSearchBtn, setPYMap, searchByInput, showSearchByID, resetData,
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
        if (!input_map.userReadOnly) {
            configMap.userReadOnly = false;
        }
        beop.util && beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container, options) {
        if (arguments.length > 2) {
            console.warn('人物选择框现在需要1个必选参数$container和一个可选参数来配置configModel');
            return false;
        }
        //兼容factory特殊传入方式
        if (typeof options === 'object') {
            var configModel = options.configModel;
            if (typeof configModel === 'object') {
                for (var key in configModel) {
                    if (configModel.hasOwnProperty(key)) {
                        configMap[key] = configModel[key]
                    }
                }
                if (!configMap.userHasSelected) configMap.userHasSelected = [];
                if (!configModel.userMemberMap) configModel.userMemberMap = [];

                configMap.userHasSelected.forEach(function (item, index, array) {
                    configModel.userMemberMap.forEach(function (members) {
                        if (item.id == members.id) {
                            array[index] = $.extend(true, {}, members);
                            return true;
                        }
                    });
                });
            } else {
                console.error('调用方式失败,第二个参数的configModel属性不是Object' + arguments[1]);
                return false;
            }
        }
        stateMap.userHasSelected = configMap.userHasSelected ? configMap.userHasSelected : [];
        if (!configMap.userMemberMap || Object.prototype.toString.call(configMap.userMemberMap) !== "[object Array]") {
            console.error('现在人物选择框需要提前预制人员列表');
            return false;
        }
        //兼容老数据
        Spinner.spin($container.get(0));
        stateMap.$container = $container;
        WebAPI.get(configMap.htmlURL + '?=' + new Date().getTime().toString(16)).done(function (html) {
            stateMap.$container.append(html);
            resetData();
            setJqueryMap();
            //处理数据
            var $title = jqueryMap.$container.find('#wf-add-person .modal-title');
            stateMap.userReadOnly = configMap.userReadOnly;
            if (stateMap.userReadOnly) {
                $title.attr('i18n', 'workflow.memberSelected.TITLE1');
                $('.wf-check-result-container').remove();
            } else {
                $title.attr('i18n', 'workflow.memberSelected.TITLE');
            }
            progressResultData();
        }).always(function () {
            Spinner.stop();
        }).fail(function () {
            console.error('获取人物选择框模板失败！');
        });
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

        jqueryMap.$wf_comfirm_btn = jqueryMap.$add_user_dialog.find('#wf-member-comfirm-btn');
        jqueryMap.$wf_comfirm_btn.off().on('click', renderAddedUsers);
        jqueryMap.$add_user_dialog.off().on('show.bs.modal', function () {
            restoreSearchResult();
            stateMap.isConfirm = false;
        }).on('hidden.bs.modal', function () {
            jqueryMap.$wf_check_result.empty().html(beopTmpl('tpl_wf_dialog_added_member', {members: stateMap.userHasSelectedDefault}));

            jqueryMap.$wf_search_result_list.removeClass(stateMap.selectedClassPrefix);
            jqueryMap.$wf_search_result_list.each(function () {
                var $this = $(this);
                stateMap.userHasSelectedDefault.forEach(function (item) {
                    if (item.id == $this.data('user-id')) {
                        $this.addClass(stateMap.selectedClassPrefix)
                    }
                });
            });
            //确保全部移除
            [].slice.call(document.querySelectorAll(configMap.htmlTemplateId)).forEach(function (item) {
                item.parentNode.removeChild(item);
            });
        });
    };

    renderAddedUsers = function () {
        jqueryMap.$wf_added_user_list.html(beopTmpl('tpl_wf_added_member', {members: stateMap.addedUserList}));

        //如果用户点击确认的话把提前保存的数据覆盖过去
        stateMap.userHasSelectedDefault = [];
        stateMap.addedUserList.forEach(function (item) {
            stateMap.userHasSelectedDefault.push(item);
        });

        configMap.cb_dialog_hide(stateMap.addedUserList);
        jqueryMap.$add_user_dialog.modal('hide');
    };

    renderCheckedUsers = function (data) {
        if (!data) {
            data = stateMap.addedUserList;
        }
        jqueryMap.$wf_check_result.html(beopTmpl('tpl_wf_dialog_added_member', {members: data}));
    };
    //---------方法---------
    progressResultData = function () {
        var addedUserMap = {};
        stateMap.addedUserList = [];
        stateMap.userHasSelectedDefault = [];

        stateMap.userHasSelected.forEach(function (item) {
            stateMap.addedUserList.push(item);
            stateMap.userHasSelectedDefault.push(item);
            addedUserMap['' + item.id] = item;
        });

        stateMap.allUserList = [];
        configMap.userMemberMap.forEach(function (item) {
            stateMap.allUserList.push(item)
        });
        jqueryMap.$wf_search_result.html(beopTmpl('tpl_wf_member', {
            members: stateMap.allUserList,
            addUserMap: addedUserMap
        }));

        stateMap.allUserList.forEach(function (item) {
            stateMap.usersMap['' + item.id] = item;
        });

        I18n.fillArea(stateMap.$container);
        setPYMap();
        //只有这个内容是动态刷新出来的，其他的都不是
        jqueryMap.$wf_search_result_list = jqueryMap.$add_user_dialog.find('.wf-member');
        bindEvents();
        //重新画一次那个已经选择好人物的状态栏
        renderCheckedUsers(stateMap.userHasSelectedDefault);
        //重置搜索状态
        restoreSearchResult();
        Spinner.stop();
        jqueryMap.$add_user_dialog.modal('show');

    };
    restoreSearchResult = function () {
        stateMap.addedUserList = [];
        stateMap.userHasSelectedDefault.forEach(function (item) {
            stateMap.addedUserList.push(item);
        });
        jqueryMap.$wf_search_result_list.show();
        addActiveSearchBtn(null, 2);
    };
    //通过头部的  stateMap.usersMap 设定拼音表
    setPYMap = function () {
        var PYFormat = new pyFormat(), itemPY = {};
        PYFormat.getPYLocalStorage().done(function (result) {
            stateMap.usersMap.forEach(function (item) {
                //TODO item userfullname 可能为null的情况
                if (item.userfullname) {
                    itemPY = PYFormat.getPYMap(result.data, item.userfullname.charAt(0))[0];
                } else {
                    itemPY = {
                        id: item.id,
                        key: undefined,
                        pinyin: undefined,
                        acronym: undefined
                    }
                }
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


    addMember = function (member) {
        if (typeof member === "object") {
            if (member.id && member.userfullname && member.useremail) {
                !isMemberAdded(member.id) && stateMap.addedUserList.push(member);
            }
        } else {
            if (stateMap.usersMap[String(member)]) {
                !isMemberAdded(member) && stateMap.addedUserList.push(stateMap.usersMap[String(member)]);
            }
        }
        return this;
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
        stateMap.isConfirm = false;
        stateMap.userHasSelectedDefault = [];
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
            return configMap.maxDelete < length;
        }
        return true;
    };
    onClickUser = function () {
        if (stateMap.userReadOnly) {
            return;
        }
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
                        Alert.danger(ElScreenContainer, I18n.resource.workflow.team.MORE_NUMBER).showAtTop(300);
                        return false;
                    }
                } else {
                    Alert.danger(ElScreenContainer, I18n.resource.workflow.team.NOT_ADD_PEOPLE).showAtTop(300);
                    return false;
                }
            } else {
                if (configMap.enableDeleteMember) {
                    if (checkUserDeletedAmount()) {
                        $this.removeClass(selectedClass);
                        removeMember(userId);
                    }
                } else {
                    Alert.danger(ElScreenContainer, I18n.resource.workflow.team.NOT_DEL_PEOPLE).showAtTop(300);
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
            Alert.danger(ElScreenContainer, I18n.resource.workflow.team.NOT_DEL_EXISTING_PEOPLE).showAtTop(300);
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
                if (stateMap.PYMap[i] && stateMap.PYMap[i].pinyin && (stateMap.PYMap[i].pinyin.charAt(0).toLowerCase() == searchIndex || stateMap.PYMap[i].acronym.charAt(0).toLowerCase() == searchIndex)) {
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
                    if ((member.userfullname && member.userfullname.toLowerCase().indexOf(value.toLowerCase()) != -1) || (member.useremail && member.useremail.toLowerCase().indexOf(value.toLowerCase()) != -1)) {
                        result.push(member.id);
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
        addMember: addMember,
        configModel: configModel,
        init: init,
        renderCheckedUsers: renderCheckedUsers
    };
}(beop || (beop = {})));

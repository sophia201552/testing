/**
 * Created by liqian on 2015/5/13
 */
var MemberManager = (function () {
    function MemberManager() {
        this.viewSource = "/static/views/admin/userManager/memberManager.html";
        this.managerCtrl = new UserManagerController();
        this.$container = $();
        this.userTree = {};
        this.i18 = I18n.resource.admin.panelManagement;
        this.datePickerInstance = null;
        this.allRoleGroupList = [];
        this.userRoleGroupList = [];
    }

    MemberManager.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get(this.viewSource).done(function (resultHtml) {
                _this.$container = $('#memberManageWrapper').html(resultHtml).find('#memberManage');
                $("#manageTab li[screen='AccountManager']").remove();
                $("#manageTab").show();
                $("#panelContentWrapper").hide();
                _this.init();
                I18n.fillArea($(ElScreenContainer));
            }).always(function () {
                Spinner.stop();
            });
        },
        setMemberManagerHeight: function () {
            $("#panelContentWrapper").height($(window).height() - $(".navbar").height() - 62);
            $("#userTreeCon").height($(window).height() - $(".navbar").height() - 205);
        },
        init: function () {
            this.setMemberManagerHeight();
            $("#panelContentWrapper").show();
            this.loadUserTree();
            this.attachEvents();
        },
        resetMonth: function (ev) {
            var _this = this;
            var t1 = null;
            t1 && clearTimeout(t1);
            t1 = setTimeout(function () {
                var year = _this.datePickerInstance.viewDate.format('yyyy-MM').split("-")[0];
                var currentYear = new Date().getFullYear();
                var currentMonth = new Date().getMonth() + 1;
                var monthItem = _this.datePickerInstance.picker.find(".month");
                if (year == currentYear) {
                    for (var i = 0; i < currentMonth; i++) {
                        monthItem.eq(i).removeClass("disabled");
                    }
                }
            }, 50);
        },
        attachEvents: function () {
            var _this = this;
            var $startDateRecord;
            var $endDateRecord;
            var $userSettingWin = $("#userSettingWin");
            var $userTreeCon = $("#userTreeCon");
            var $expiryDatePicker = null;
            var currentUserRoleGroup = [];
            $userTreeCon.on('click', '.setting', function (event) {//点击管理面板-员工管理图片设置
                var userId = $(this).closest('li').attr('userId');
                $userTreeCon.find("span").removeClass("selected");
                $(this).parents("span").addClass("selected");
                Spinner.spin(ElScreenContainer);
                WebAPI.post('/admin/loadUsersSetting', {
                    userId: userId,
                    currentUser: AppConfig.userId
                }).done(function (result) {
                    if (result.success) {
                        result.data.managers.sort(function (a, b) {
                            return a.userfullname > b.userfullname
                        });
                        currentUserRoleGroup = result.data.currentUserRoleGroup;
                        if (AppConfig.userId == 1 || currentUserRoleGroup.indexOf('14') != -1 || currentUserRoleGroup.indexOf('20') != -1 || currentUserRoleGroup.indexOf('22') != -1) {
                            var addUserRoleId = function (userRoleGroupList, id) {
                                if (userRoleGroupList.indexOf(id) == -1) {
                                    userRoleGroupList.push(id);
                                }
                            }, removeUserRoleId = function (userRoleGroupList, id) {
                                if (userRoleGroupList.indexOf(id) !== -1) {
                                    userRoleGroupList.forEach(function (item, index, array) {
                                        if (item == id) {
                                            array.splice(index, 1)
                                        }
                                    })
                                }
                            };
                            $userSettingWin.find('.modal-body').empty().append(beopTmpl('userSettingTmpl', $.extend(true, {}, result.data, {allRoleGroupList: _this.allRoleGroupList})));
                            $userSettingWin.find('#user-role').find('label').each(function () {
                                var $this = $(this), userRoleGroup = result.data.userRoleGroup;
                                _this.userRoleGroupList = userRoleGroup;
                                var roleId = $this.attr('data-role-id');
                                if (AppConfig.userId == 1) { //admin
                                    if (userRoleGroup.indexOf(roleId) !== -1) {
                                        $this.addClass('active').find('input').prop('checked', true);
                                    }
                                } else if (userId == AppConfig.userId) { //打开自己的面板
                                    if (userRoleGroup.indexOf(roleId) !== -1) {
                                        $this.addClass('active').find('input').prop('checked', true).prop('disabled', true);
                                    } else {
                                        $this.parent().remove();
                                    }
                                } else {//设置他人的面板
                                    if (userRoleGroup.indexOf(roleId) !== -1) {
                                        $this.addClass('active').find('input').prop('checked', true);
                                    } else {
                                        if (currentUserRoleGroup.indexOf(roleId) == -1) {
                                            $this.parent().remove();
                                        }
                                    }
                                }

                            }).find('input[type="checkbox"]').off().change(function () {
                                var $this = $(this), $parent = $this.closest('label'), userRoleId = $parent.attr('data-role-id');
                                if ($parent.hasClass('active')) {
                                    $parent.removeClass('active');
                                    $parent.find('input').prop('checked', false);
                                    removeUserRoleId(_this.userRoleGroupList, userRoleId);
                                } else {
                                    $parent.addClass('active');
                                    $parent.find('input').prop('checked', true);
                                    addUserRoleId(_this.userRoleGroupList, userRoleId);
                                }
                            });
                        } else {
                            $userSettingWin.find('.modal-body').empty().append(beopTmpl('userSettingTmpl', result.data));
                        }
                        _this.managerCtrl.setFloatingWin($userSettingWin, 700);
                        $userSettingWin.attr("userId", userId);
                        $startDateRecord = $("#recordLogDateStart").datetimepicker({
                            minView: 2,
                            format: "yyyy-mm-dd",
                            autoclose: true,
                            endDate: new Date()
                        }).on('show', function (ev) {
                            _this.resetMonth(ev);
                            _this.datePickerInstance.picker.find(".prev,.next").click(function () {
                                _this.resetMonth(ev);
                            });
                        }).on('changeYear changeMonth', function (ev) {
                            _this.resetMonth(ev);
                        });
                        _this.datePickerInstance = $startDateRecord.data('datetimepicker');

                        $endDateRecord = $("#recordLogDateEnd").datetimepicker({
                            minView: 2,
                            format: "yyyy-mm-dd",
                            autoclose: true
                        });
                        // 刚进入页面加载一部分记录
                        _this.managerCtrl.getRecordsOne.call(_this.managerCtrl,
                            userId,
                            $('#userAllRecord'), true);
                    }
                    I18n.fillArea($(ElScreenContainer));
                }).always(function () {
                    Spinner.stop();
                });
            }).on('click', '.glyphicon-minus-sign', function () {//点击管理面板-minus图标
                var $this = $(this);
                var $ul = $this.parents("span").next("ul");
                if ($ul.length) {
                    $ul.slideUp(300);
                    $this.removeClass("glyphicon-minus-sign").addClass("glyphicon-plus-sign");
                }
            }).on('click', '.glyphicon-plus-sign', function () {//点击管理面板-plus图标
                var $this = $(this);
                var $ul = $this.parents("span").next("ul");
                if ($ul.length) {
                    $ul.slideDown(300);
                    $this.removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
                }
            });

            $userSettingWin.on("click", "#userDel", function () {//点击页面管理-浮动窗口删除按钮
                _this.managerCtrl.setFloatingWin($("#isUserDelWin"), 300);
            }).on("click", "#userEditConfrim", function () {//点击页面管理-浮动窗口确认按钮
                var userId = $userSettingWin.attr("userId");
                if (AppConfig.userId == userId) {
                    $userSettingWin.modal("hide");
                }
                var isManager = $("#isManager option:selected").val();
                var supervisor = $('#supervisor  option:selected').val();
                var oldSupervisor = $('#oldSupervisor').val();
                var oldIsManager = $('#oldIsManager').val();

                if (AppConfig.userId == 1 || currentUserRoleGroup.indexOf('14') != -1 || currentUserRoleGroup.indexOf('20') != -1 || currentUserRoleGroup.indexOf('22') != -1) {
                    WebAPI.post('/admin/updateUsersSetting', {
                        userId: userId,
                        isManager: isManager,
                        supervisor: supervisor,
                        userRoleGroupList: _this.userRoleGroupList
                    }).done(function (result) {
                        if (result.success) {
                            _this.loadUserTree();
                            $userSettingWin.modal("hide");
                        }
                        I18n.fillArea($(ElScreenContainer));
                    })
                } else {
                    $userSettingWin.modal("hide");
                }
            }).on("click", "#btnRecord", function () {//点击页面管理-浮动窗口-账户操作记录 确定按钮
                var userId = $userSettingWin.attr('userId');
                if (!userId) {
                    return false;
                }
                _this.managerCtrl.renderRecordsEvent.call(_this.managerCtrl,
                    userId,
                    $('#recordLogDateStart'),
                    $('#recordLogDateEnd'),
                    $('#recordInfoDate'),
                    $('#userAllRecord'), true);

            }).on('click', '#setAccountExpiry', function () {
                $('#expiryDisplay').hide();
                $('#expiryEditor').show();
                $expiryDatePicker = $('#expiryDatePicker').datetimepicker({
                    format: 'yyyy-mm-dd',
                    minView: 'month',
                    autoclose: true
                });
            }).on('click', '#setAccountExpiryCancel', function () {
                $('#expiryDisplay').show();
                $('#expiryEditor').hide();
                $('#expiryDatePicker').val('');
                $expiryDatePicker && $expiryDatePicker.datetimepicker('remove');
            }).on('click', '#setAccountExpirySave', function () {
                if (!$expiryDatePicker || !$expiryDatePicker.val()) {
                    Alert.danger($userSettingWin.find('.modal-content'), I18n.resource.admin.panelManagement.SET_VALIDITY_PERIOD).showAtTop(2000);
                    return false;
                }
                WebAPI.post('admin/setUserExpiredDate', {
                    userId: $userSettingWin.attr('userid'),
                    expiredDate: $expiryDatePicker.val()
                }).done(function (result) {
                    if (result.success) {
                        $('#expiryDisplay').show().find('.expiryText').show().end()
                            .find('.expiryDate').text($expiryDatePicker.val());
                        $('#expiryEditor').hide();
                    }
                })
            });

            //点击页面管理-浮动窗口删除按钮
            $("#deleteUser").click(function () {
                var userId = $userSettingWin.attr("userId");
                WebAPI.post('/admin/deleteUser', {
                    userId: userId,
                    currentUserId: AppConfig.userId
                }).done(function (result) {
                    if (result.success) {
                        _this.loadUserTree();
                        $userSettingWin.modal("hide");
                        $("#isUserDelWin").modal("hide");
                        I18n.fillArea($(ElScreenContainer));
                    }
                });
            });

            //员工管理-点击添加人员弹出添加人员模态窗口
            $("#addPerson").on("click", function () {
                _this.loadManagersByUserId(AppConfig.userId).done(function (result) {
                    if (!result.success) {
                        return false;
                    }
                    var $addPersonWin = $('#addPersonWin');
                    $(".modal-dialog").css({
                        'top': ($(window).height() - 600) / 2
                    });
                    $addPersonWin.find('.modal-body').empty().append(beopTmpl('addUserTmpl', {
                        addCount: 5,
                        managers: result.data
                    }));
                    I18n.fillArea($(ElScreenContainer));
                    $addPersonWin.modal();
                });
            });

            var projectPermission = {},
                selectedUserId,
                selectedProjectId;
            $('#addPersonWin').on('change', '#selectSupervisor', function () {
                selectedUserId = $(this).find('option:checked').val();
                if (!selectedUserId) {
                    return false;
                }
                WebAPI.post('/admin/getProjectPermissionByUserId', {userId: selectedUserId}).done(function (result) {
                    if (result.success) {
                        projectPermission = result.data;
                        var $selectInitProject = $('#selectInitProject').empty();
                        $('#selectInitRole option.roles').remove();
                        var newSelectInitProjectHtml = beopTmpl('selectInitProjectTmpl', projectPermission);
                        $selectInitProject.replaceWith(newSelectInitProjectHtml);
                    } else {
                        $('#selectInitProject').find('option.projects').remove();
                        projectPermission = {};
                    }
                    I18n.fillArea($(ElScreenContainer));
                }).fail(function () {
                    $('#selectInitProject').find('option.projects').remove();
                    projectPermission = {};
                });

            }).on('change', '#selectInitProject', function () {
                selectedProjectId = $(this).find('option:checked').val();
                var $selectInitRole = $('#selectInitRole').empty();
                var roles = projectPermission[selectedProjectId].roles;
                if (roles) {
                    var newSelectInitRoleHtml = beopTmpl('selectInitRoleTmpl', roles);
                    $selectInitRole.replaceWith(newSelectInitRoleHtml);
                    I18n.fillArea($(ElScreenContainer));
                }
            });

            //员工管理-点击添加人员弹出添加人员模态窗口的确认按钮
            $('#addPersonOK').click(function () {
                var $this = $(this);
                var $addPersonWin = $('#addPersonWin');
                var emails = [];
                var userName = [];
                var $userEmails = $addPersonWin.find(".userEmail");
                var supervisorId = $('#selectSupervisor option:selected').val();
                var $addPersonErr = $("#addPersonErr");
                $addPersonErr.text("").hide();

                if (supervisorId == "0") {
                    $addPersonErr.text(_this.i18.IMMEDIATE_SUPERIOR_NULL + "！").show();
                    return false;
                }

                for (var i = 0; i < $userEmails.length; i++) {
                    var $email = $userEmails.eq(i);
                    var email = $email.val();
                    if (email != "") {
                        if (!_this.managerCtrl.checkEmail(email)) {
                            $email.focus();
                            $addPersonErr.text(_this.i18.MAILBOX_FORMAT_WRONG + "！").show();
                            return false;
                        }
                        emails.push(email);
                        userName.push($addPersonWin.find('.userName').eq(i).val());
                    }
                }
                $addPersonErr.text("").hide();

                if (_this.managerCtrl.isArrayRepeat(emails)) {
                    $addPersonErr.text(_this.i18.MAILBOX_CHECKINFO_REPEATED + "！").show();
                    return false;
                }
                var initProjectId = $('#selectInitProject option:selected').val(),
                    initRoleId = $('#selectInitRole option:selected').val();

                if (initProjectId === '0') {
                    $addPersonErr.text(_this.i18.INITIAL_PROJECT_NOTNULL + "！").show();
                    return false;
                }
                if (initRoleId === '0') {
                    $addPersonErr.text(_this.i18.INITIAL_ROLE_NOTNULL + "！").show();
                    return false;
                }

                $addPersonErr.text("").hide();
                var postData = {
                    'inviterId': AppConfig.userId,
                    'supervisorId': supervisorId,
                    'isManager': $('#givenMR').get(0).checked ? 1 : 0,
                    'userInfo': [],
                    'initRole': initRoleId
                };
                if (userName != undefined) {
                    var postUserInfo = [];
                    for (var i = 0, len = userName.length; i < len; i++) {
                        if (undefined != userName[i]) {
                            if (undefined == emails[i]) {
                                emails[i] = '';
                            }
                            postUserInfo.push({'userfullname': userName[i], 'email': emails[i]});
                        }
                    }
                    postData.userInfo = postUserInfo;
                }

                if (!postData.userInfo.length) {
                    $addPersonErr.text(_this.i18.PLEASE_ADD_USER + "。").show();
                    return false;
                }

                try {
                    $this.button('loading');
                } catch (e) {

                }

                WebAPI.post('/admin/inviteUsers', postData).done(function (result) {
                    if (result.success) {
                        _this.loadUserTree().done(function (result) {

                        });
                        result.data.info = {
                            "apply": _this.i18.MAILBOX_CHECKINFO_APPLY,
                            "invited": _this.i18.MAILBOX_CHECKINFO_INVITED,
                            "registered": _this.i18.MAILBOX_CHECKINFO_REGISTERED,
                            "token_failed": _this.i18.SEND_MAIL_FAILED,
                            "succeed": _this.i18.SEND_EMAIL_SUCCESS
                        };
                        var compiledTemplate = beopTmpl('inviteMsgTmpl', result.data);
                        $("#inviteMsg").empty().html(compiledTemplate);
                        $addPersonErr.text("").hide();
                    }
                }).fail(function () {
                    $addPersonErr.text(_this.i18.REQUEST_ERROR + "！").show();
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                    try {
                        $this.button('reset');
                    } catch (e) {

                    }
                });
            });

            //点击管理面板-员工管理的一键激活
            $("#memberManage").on("click", ".re-invite", function () {
                var postData = {
                    'reactivateId': parseInt($(this).closest("li").attr("userid")),
                    'userId': AppConfig.userId
                };
                WebAPI.post('/admin/reactivateUser', postData).done(function (result) {
                    if (result.success) {
                        var alert = new Alert(ElScreenContainer, Alert.type.success, I18n.resource.admin.panelManagement.SUCCEED);
                        alert.showAtTop(2000);
                    } else {
                        var alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.panelManagement.FAILED);
                        alert.showAtTop(2000);
                    }
                }).fail(function (e) {
                    console.error('员工管理的一键激活错误' + e);
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                });
            });

            //点击管理面板-员工管理的查询
            $("#searchUserIc").click(function () {
                var val = $("#searchUser").val();
                _this.searchUserObj(val, $(".userTree"));
            });

            //点击管理面板-员工管理的查询
            $("#searchUser").keyup(function (e) {
                var val = $("#searchUser").val();
                _this.searchUserObj(val, $(".userTree"));
                if (e.keyCode == 40) {
                    $("#userListUl li").eq(0).find("input").focus();
                }
            });

            //管理面板--点击页面其它地方，隐藏搜索列表
            $(document).on("click.memberManager", function (e) {
                var $target = $(e.target);
                if (!($target.parents("#searchUserCon").length)) {
                    $("#userListUl").slideUp(300);
                }
            });

            //点击管理面板-员工管理查询的列表选中用户
            $("#userListUl").on("click", "li", function () {
                var userid = $(this).attr("userid");
                var val = $(this).find("input").val();
                _this.selectedUserObj(userid, val);
            });

            //点击管理面板-员工管理查询的列表接受鼠标上下案件
            $("#userListUl").on("keydown", "li input", function (e) {
                var $li = $(this).parents("li");
                var $liAll = $("#userListUl li");
                if (e.keyCode == 38) {//上
                    if ($liAll.index($li) + 1 == 1) {
                        $liAll.eq($liAll.length - 1).find("input").focus();
                        var t2 = null;
                        t2 && clearTimeout(t2);
                        t2 = setTimeout(function () {
                            $("#userListUl").scrollTop(10000);
                        }, 30);
                    } else {
                        $li.prev().find("input").focus();
                        $("#userListUl").scrollTop($liAll.index($li) * 28);
                    }
                } else if (e.keyCode == 40) {//下
                    if ($liAll.index($li) + 1 == $liAll.length) {
                        $liAll.eq(0).find("input").focus();
                        var t1 = null;
                        t1 && clearTimeout(t1);
                        t1 = setTimeout(function () {
                            $("#userListUl").scrollTop(0);
                        }, 30);
                    } else {
                        $("#userListUl").scrollTop($liAll.index($li) * 28);
                        $li.next().find("input").focus();
                    }
                } else if (e.keyCode == 13) {//回车
                    $("#userListUl").slideUp(300);
                    _this.selectedUserObj($li.attr("userid"), $(this).val());
                }
            });
            $(window).on("resize.setMemberManagerHeight", function () {
                _this.setMemberManagerHeight();
            });
        },
        detachEvents: function () {
            $(window).off("resize.setMemberManagerHeight");
            $(window).off("click.memberManager");
        },
        close: function () {
            this.detachEvents();
        },
        loadUserTree: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            return WebAPI.post('/admin/loadUsersTree', {userId: AppConfig.userId}).done(function (result) {
                if (result.success) {
                    Spinner.spin(ElScreenContainer);
                    if (result.data.UserRoleGroupList) {
                        _this.allRoleGroupList = result.data.UserRoleGroupList;
                        delete result.data.UserRoleGroupList
                    }
                    _this.userTree = result.data;
                    var $userTree = _this.buildUserTree(_this.userTree);
                    $('.userTree').empty().append($userTree);
                    $("#treeUl .setting").eq(0).find("img").css({  // 处理tree中第一张图片部分地方无法点击
                        "position": "relative",
                        "z-index": 8
                    });
                    I18n.fillArea($(ElScreenContainer));
                    Spinner.stop();
                }

            }).always(function () {
                Spinner.stop();
            });
        },

        buildUserTree: function (root) {
            var buildUserTreeItem = function (item) {
                return beopTmpl('userTreeItemTmpl', item);
            };
            var $root = $('<ul id="treeUl"></ul>').append(buildUserTreeItem(root));
            $root.find('li').append(this.managerCtrl.buildSubTree(buildUserTreeItem, root, 'sub'));
            return $root;
        },
        loadManagersByUserId: function (userId) {
            return WebAPI.post('/admin/loadManagersByUserId', {userId: userId});
        },
        loadInvitePanel: function (userId) {
            return WebAPI.post('/admin/loadInvitePanel', {userId: userId});
        },
        searchUserObj: function (val, $tree) {//员工管理页面-得到查询用户列表
            var arrNameInfo = [], arrPicInfo = [], arrIdInfo = [], arrEmailInfo = [];
            //获取员工管理页面的所有用户名
            var userNameArr = [], userPicArr = [], userIdArr = [], userEmailArr = [];
            var $userLiAll = $tree.find("li");
            var $userNameAll = $userLiAll.find(".userfullname");
            var $userPicAll = $userLiAll.find(".setting>img");
            for (var i = 0; i < $userNameAll.length; i++) {
                userNameArr.push($userNameAll.eq(i).text());
                userEmailArr.push($userNameAll.eq(i).attr("user_email"));
                userPicArr.push($userPicAll.eq(i).attr("src"));
                userIdArr.push($userLiAll.eq(i).attr("userid"));
            }
            for (var i = 0; i < userNameArr.length; i++) {
                if (((userNameArr[i].toLowerCase()).indexOf(val.toLowerCase()) > -1) ||
                    ((userEmailArr[i].toLowerCase()).indexOf(val.toLowerCase()) > -1)) {
                    arrNameInfo.push(userNameArr[i]);
                    arrPicInfo.push(userPicArr[i]);
                    arrIdInfo.push(userIdArr[i]);
                    arrEmailInfo.push(userEmailArr[i]);
                }
            }
            var li = '';
            for (var i = 0; i < arrNameInfo.length; i++) {
                if (i < 20) {
                    li += '<li userId="' + arrIdInfo[i] + '" userEmail="' + arrEmailInfo[i] + '" class="pr">' +
                        '<input type="text" value="' + arrNameInfo[i] + '" class="pa" readonly />' +
                        '<img src="' + arrPicInfo[i] + '" class="pa" style="z-index:55" /></li>';
                }
            }
            $("#userListUl").empty().append(li).slideDown(300);        },

        selectedUserObj: function (userid, searchText) {//员工管理页面-选中用户对象
            $("#userListUl").slideUp(300);
            var $treeUl = $("#treeUl");
            var $userTreeCon = $("#userTreeCon");
            var $span = $treeUl.find("span");
            var $userSpan = $treeUl.find("li[userid=" + userid + "]>span");
            var $targetUl = $userSpan.parents("ul");
            var $targetI = $targetUl.prev("span").find(".glyphicon-plus-sign");
            $span.removeClass("selected");
            $userSpan.addClass('selected');
            $targetI.removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
            $targetUl.slideDown(300);

            $("#searchUser").val(searchText);
            var t1 = null;
            t1 && clearTimeout(t1);
            t1 = setTimeout(function () {
                $userTreeCon.scrollTop($userSpan.offset().top + $userTreeCon.scrollTop() - 300);
                $userTreeCon.scrollLeft($userSpan.offset().left + $userTreeCon.scrollLeft() - $treeUl.width() - 15);
                $("#searchUser").focus();
            }, 500);
        }
    };
    return MemberManager;
})();
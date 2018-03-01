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
        this.data = null;
        this.managersPlatform = [];
        this.joinProjectIdList = [];
        this.isShowRcsFlag = false;
        this.isRcsAdmin = false;
    }

    MemberManager.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get('/admin/getManagementList').done(function (result) {
                if (result.success) {
                    var projectList = [];
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].id == 18) {
                            projectList = result.data[i].projectList;
                            break;
                        }
                    }
                    for (var i = 0; i < projectList.length; i++) {
                        _this.joinProjectIdList.push(projectList[i].id);
                    }
                }
            });
            WebAPI.get('/admin/isRcsAdmin/' + AppConfig.userId).done(function (result) {
                if (result.success) {
                    if (result.data == 1) {
                        _this.isRcsAdmin = true;
                    }
                }
            });
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
                        var userData = result.data,
                            userRoleGroup = userData.userRoleGroup;
                        _this.isShowRcsFlag = false;
                        userData.managers.sort(function (a, b) {
                            return a.userfullname > b.userfullname
                        });
                        currentUserRoleGroup = userData.currentUserRoleGroup;
                        let targetId = userData.user.id;
                        WebAPI.post('/admin/userProjRecords/', {
                            userId: userId
                        }).done(function (res) {
                            if (res.success) {
                                for (let i = 0; i < res.data.length; i++) {
                                    if (_this.joinProjectIdList.indexOf(res.data[i].projectId) != -1) {
                                        _this.isShowRcsFlag = true;
                                        break;
                                    }
                                }
                                if (AppConfig.userId == 1 || currentUserRoleGroup.indexOf('14') != -1 ||
                                    currentUserRoleGroup.indexOf('20') != -1 || currentUserRoleGroup.indexOf('22') != -1
                                    || _this.isShowRcsFlag) {
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
                                    $userSettingWin.find('.modal-body').empty().append(beopTmpl('userSettingTmpl', $.extend(true, {}, userData, {allRoleGroupList: _this.allRoleGroupList})));
                                    let $userRole = $userSettingWin.find('#user-role');
                                    if (targetId == 1 || (_this.isShowRcsFlag && targetId != AppConfig.userId)) {
                                        if (AppConfig.userId == 1 ||_this.isRcsAdmin) {
                                            $userRole.append(beopTmpl('rcsUserRole', {}));
                                        }
                                    }

                                    $userRole.find('label').each(function () {
                                        var $this = $(this);
                                        _this.userRoleGroupList = userRoleGroup;
                                        var roleId = $this.attr('data-role-id');
                                        if (AppConfig.userId == 1 || _this.isShowRcsFlag) { //admin
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
                                   $userSettingWin.find('.modal-body').empty().append(beopTmpl('userSettingTmpl', userData));
                                }
                            } else {
                                $userSettingWin.find('.modal-body').empty().append(beopTmpl('userSettingTmpl', userData));
                            }
                            $selectCountry = $('#select_country');
                            $selectCountry.empty().append(beopTmpl('tpl_show_country', { data: I18n.resource.country, type: "details" }));

                            userData.user.country ? $selectCountry.val(userData.user.country) : $selectCountry.val('WW');
                            
                            $userSettingWin.attr("userId", userId).modal();
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
                            $("#account_operation_record").addClass('activeStyle');
                            // 刚进入页面加载一部分记录
                            _this.managerCtrl.getRecordsOne.call(_this.managerCtrl,
                                userId,
                                $('#userAllRecord'), true);
                            I18n.fillArea($(ElScreenContainer));
                        });
                    }
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
                var country = $('#select_country').val();
                if (AppConfig.userId == 1 || currentUserRoleGroup.indexOf('14') != -1 ||
                    currentUserRoleGroup.indexOf('20') != -1 || currentUserRoleGroup.indexOf('22') != -1 || _this.isShowRcsFlag) {
                    WebAPI.post('/admin/updateUsersSetting', {
                        userId: userId,
                        isManager: isManager,
                        supervisor: supervisor,
                        userRoleGroupList: _this.userRoleGroupList,
                        country: country
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
            }).on('click', '#account_operation_record', function () { 
                var $this = $(this);
                if (!$this.hasClass('activeStyle')) {
                    $this.addClass('activeStyle').siblings().removeClass('activeStyle');
                    var $userOperationContent = $userSettingWin.find(".userOperationContent"); 
                    var userId = $userSettingWin.attr("userId");
                    var postData = {
                        userId: userId,
                        beginTime: undefined,
                        endTime: undefined
                    };
                    Spinner.spin($userOperationContent.get(0));
                    WebAPI.post('/admin/getRecords', postData).done(function (result) {
                        if (result.success) {
                            $userOperationContent.children().empty().append(beopTmpl('accountOperationRecord', {obj: result.data}));
                            I18n.fillArea($userSettingWin);

                            $startDateRecord = $("#recordLogDateStart").datetimepicker({
                                minView: 2,
                                format: "yyyy-mm-dd",
                                autoclose: true,
                                endDate: new Date()
                            });
                            $endDateRecord = $("#recordLogDateEnd").datetimepicker({
                                minView: 2,
                                format: "yyyy-mm-dd",
                                autoclose: true
                            });
                        } else {
                            alert('Data cannot be loaded');
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                }
            }).on('click', '#distribution_project', function () {
                var $this = $(this);
                if (!$this.hasClass('activeStyle')) {
                    var userId = $userSettingWin.attr("userId");
                    $this.addClass('activeStyle').siblings().removeClass('activeStyle');
                    var $userOperationContent = $userSettingWin.find(".userOperationContent");
                    Spinner.spin($userOperationContent.get(0));
                    WebAPI.post('/admin/userProjRecords/', {
                        userId: userId
                    }).done(function (result) {
                        if (result.success) {
                            _this.data = result;
                            $userOperationContent.children().empty().append(beopTmpl('distributionProject', {obj: result.data}));
                            I18n.fillArea($("#userOperationRecords"));
                        } else {
                            $userOperationContent.css('background', '#ffffff').children().empty();
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                }
            }).on('click', '#btnSearch', function () {
                var data = _this.data.data,
                    $projectInput = $("#projectInput").val(),
                    searchProjectName = [];
                for (var i = 0; i < data.length; i++) {
                    if (new RegExp($projectInput).test(data[i].projectName)) {
                        searchProjectName.push(data[i]);
                    }
                }
                $("#userAllRecord").empty().html(beopTmpl('selectProjectName', {obj: searchProjectName}));
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

            //关闭模态框时清除数据;
            $('#addPersonWin').off('hidden.bs.modal').on('hidden.bs.modal', function () {
                _this.managersPlatform = null;
            });

            //员工管理-点击添加人员弹出添加人员模态窗口
            $("#addPerson").on("click", function () {
                _this.loadManagersByUserId(AppConfig.userId).done(function (result) {
                    if (!result.success) {
                        return false;
                    }
                    var $addPersonWin = $('#addPersonWin');
                    $addPersonWin.find('.modal-body').empty().append(beopTmpl('addUserTmpl', {
                        addCount: 5,
                        managers: result.data
                    }));
                    
                    $('#selectCountry').empty().append(beopTmpl('tpl_show_country', { data: I18n.resource.country, type:"add" }));
                    I18n.fillArea($(ElScreenContainer));
                    $addPersonWin.modal();
                    var $selectLanguage = $('#selectLanguage');
                    if (AppConfig.language == 'zh') {
                        $selectLanguage.val(AppConfig.language);
                    } else if (AppConfig.language == 'en') {
                        $selectLanguage.val(AppConfig.language);
                    }
                    WebAPI.get('/admin/getManagementList/1').done(function (result) {
                        if (!result.success) {
                            return;
                        }
                        var $select = $('.userManagement');
                        var nameKey = AppConfig.language == 'zh' ? 'name_cn' : 'name_en';

                        //保存集团用户下拉选项内容;
                        _this.managersPlatform = result.data;
                        result.data.forEach(function (item) {
                            $select.each(function (i, sel) {
                                var option = new Option(item[nameKey], item.id);
                                sel.options.add(option)
                            })
                        })
                    })
                });
            });

            $('#indexMain').off('click.managementUser').on('click.managementUser', '#managementUser', function () {
                $('#managementUser').find('input[type=radio]').prop('checked', true);
                $('#directUserInfos').hide();
                $('#managementUserInfos').show();
                $('#inviteMsg').hide();
                $("#inviteMsgManager").show();
            }).off('click.directUser').on('click.directUser', '#directUser', function () {
                $('#directUser').find('input[type=radio]').prop('checked', true);
                $('#managementUserInfos').hide();
                $('#directUserInfos').show();
                $("#inviteMsgManager").hide();
                $('#inviteMsg').show();
            }).off('click.addUserTable').on('click.addUserTable', '#addUserTable', function () {
                var $container;
                var isDirectUser = $("#directUser").find('input[type=radio]').prop('checked');
                if (isDirectUser) {
                    $container = $('#directUserInfos');
                } else {
                    $container = $("#managementUserInfos");
                }

                var liHTML = $('<li class="userInfoLi"></li>');
                liHTML.empty().html(beopTmpl('new_user_info_table', {
                    isDirectUser: isDirectUser
                }));

                var $select = liHTML.find('.userManagement');
                var nameKey = AppConfig.language == 'zh' ? 'name_cn' : 'name_en';
                _this.managersPlatform.forEach(function (item) {
                    $select.each(function (i, sel) {
                        var option = new Option(item[nameKey], item.id);
                        sel.options.add(option)
                    })
                });
                $container.append(liHTML);

                if (isDirectUser) {
                    I18n.fillArea($("#directUserInfos"));
                } else {
                    I18n.fillArea($("#managementUserInfos"));
                }
            }).off('click.deleteTheUserInfo').on('click.deleteTheUserInfo', '.deleteTheUserInfo', function () {
                var $this = $(this);
                confirm(I18n.resource.admin.panelManagement.SURE_DELETE_USER_INFO, function () {
                    $this.closest('li').remove();
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
                var $addPersonErr = $("#addPersonErr");
                $addPersonErr.text("").hide();
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
                var $addPersonErr = $("#addPersonErr");
                $addPersonErr.text("").hide();
                var $selectInitRole = $('#selectInitRole').empty();
                var roles = projectPermission[selectedProjectId].roles;
                if (roles) {
                    var newSelectInitRoleHtml = beopTmpl('selectInitRoleTmpl', roles);
                    $selectInitRole.replaceWith(newSelectInitRoleHtml);
                    I18n.fillArea($(ElScreenContainer));
                }
            }).on('change', '#selectInitRole', function () {
                var $addPersonErr = $("#addPersonErr");
                $addPersonErr.text("").hide();
            });

            //员工管理-点击添加人员弹出添加人员模态窗口的确认按钮
            $('#addPersonOK').click(function () {
                var $this = $(this);
                var isManagement = $('#managementUser').find('input').prop('checked');
                var $addPersonWin;
                var isDirectUser = $('#directUser').find('input[type=radio]').prop('checked');
                if (isDirectUser) {
                    $addPersonWin = $('#directUserInfos');
                } else if (isManagement) {
                    $addPersonWin = $('#managementUserInfos');
                }

                //服务器返回错误信息提示;
                var $addPersonErr = $("#addPersonErr");
                $addPersonErr.text("").hide();

                //判断邀请人,初始项目,分组为空的提示;按照顺序依次
                var supervisorId = $('#selectSupervisor').find('option:selected').val();
                if (supervisorId == "0") {
                    $addPersonErr.text(_this.i18.IMMEDIATE_INVITER_NULL + "!").show();
                    return false;
                }

                var initProjectId = $('#selectInitProject').find('option:selected').val(),
                    initRoleId = $('#selectInitRole').find('option:selected').val();

                if (initProjectId === '0') {
                    $addPersonErr.text(_this.i18.INITIAL_PROJECT_NOTNULL + "!").show();
                    return false;
                }
                if (initRoleId === '0') {
                    $addPersonErr.text(_this.i18.INITIAL_ROLE_NOTNULL + "!").show();
                    return false;
                }

                var country = $('#selectCountry').val();
                
                var language = $('#selectLanguage').val();

                var errorNum = 0,
                    postUserInfos = [];

                var $userInfoLis = $addPersonWin.find('.userInfoLi');
                var invitationCount = $userInfoLis.length;                
                var $userInfoLi, userName, loginName,
                    userPassword, userEmail, userPhone,
                    $errBox, userManagement, inputLen;
                var errUserLists = [];
                for (var i = 0; i < $userInfoLis.length; i++) {
                    var errorText = '';
                    errorNum = 0;
                    $userInfoLi = $($userInfoLis[i]);
                    $errBox = $userInfoLi.find('.errorUserInfoBox');
                    userName = $userInfoLi.find('.userName').val().trim();
                    loginName = $userInfoLi.find('.loginName').val().trim();
                    userPassword = $userInfoLi.find('.userPassword').val().trim();
                    userEmail = $userInfoLi.find('.userEmail').val().trim();
                    userPhone = $userInfoLi.find('.userPhone').val().trim();
                    inputLen = $userInfoLi.find(':input').length;

                    if (userName == '') {
                        errorText += _this.i18.USER_NAME_CANNOT_NULL;
                        errorNum++;
                    }else if(!(/^(\w|-|[\u4E00-\u9FA5]){2,10}$/g.test(userName))){
                        errorText += _this.i18.ENTER_VOLID_USER_NAME;
                        errorNum++;
                    }
                    if (loginName == '') {
                        errorText += _this.i18.LOGIN_NAME_CANNOT_NULL;
                        errorNum++;
                    }
                    if (userPassword == '') {
                        errorText += _this.i18.USER_PASSWORD_CANNOT_NULL;
                        errorNum++;
                    } else {
                        if ((!(/[a-zA-Z]+/.test(userPassword)) || !(/\d+/.test(userPassword))) || (!(/^\S{8,}$/.test(userPassword)))) {
                            errorText += _this.i18.ENTER_VOLID_PASSWORD;
                            errorNum++;
                        }
                    }
                    if (userEmail != '') {
                        if (!_this.managerCtrl.checkEmail(userEmail)) {
                            errorText += _this.i18.MAILBOX_FORMAT_WRONG;
                            errorNum++;
                        }
                    }
                    if (userPhone != '') {
                        if (!(/^1[3|4|5|7|8]\d{9}$/.test(userPhone))) {
                            errorText += _this.i18.PLEASE_ENTER_VOLID_PHONE;
                            errorNum++;
                        }
                    }

                    if (isManagement) {
                        userManagement = $userInfoLi.find('.userManagement option:selected').val().trim();
                    }

                    if (userName == '' && loginName == '' && userPassword == '' && userEmail == '' && userPhone == '') {
                        invitationCount--;
                        continue;
                    }

                    if (errorNum) {
                        
                        var curError = _this.i18.ERROR_OCCURRED + '<' + errorText + '>';
                        $errBox.text(curError).css('display', 'block');

                        errUserLists.push({
                            userfullname: userName,
                            username: loginName,
                            password: userPassword,
                            useremail: userEmail,
                            usermobile: userPhone,
                            errorText: errorText
                        })
                        !!isManagement && (errUserLists[i][userManagement] = userManagement);                        
                    } else {
                        $errBox.css('display', 'none');
                    }
                    if (!errorNum) {
                        if (isManagement) {
                            postUserInfos.push({
                                'userfullname': userName,
                                'username': loginName,
                                'email': userEmail,
                                'password': userPassword,
                                'usermobile': userPhone,
                                'management': userManagement ? userManagement : '0',
                                'country': country
                            })
                        } else {
                            //userfullname 为用户名; username 为登录名,同上
                            postUserInfos.push({
                                'userfullname': userName,
                                'username': loginName,
                                'email': userEmail,
                                'password': userPassword,
                                'usermobile': userPhone,
                                'country': country
                            })
                        }
                    }
                }


                $addPersonErr.text("").hide();
                var postData = {
                    'inviterId': AppConfig.userId,
                    'supervisorId': supervisorId,
                    'isManager': $('#givenMR').get(0).checked ? 1 : 0,
                    'userInfo': [],
                    'initRole': initRoleId,
                    'language': language
                };

                postData.userInfo = postUserInfos;
                if (!postData.userInfo.length) {
                    $addPersonErr.text(_this.i18.PLEASE_ADD_USER + "。").show();
                    return false;
                }

                var userInfo = [];
                for (var j = 0; j < postData.userInfo.length; j++) {
                    userInfo.push(_this.i18.LOGIN_NAME + ': ' + postData.userInfo[j].username + ', '
                    + _this.i18.MAILBOX + ': ' + (postData.userInfo[j].email ? postData.userInfo[j].email : _this.i18.NO_TIME_EMAIL));
                }
                confirm(_this.i18.CANNOT_INVITE_USER + '<br>' + userInfo.join('\n'), function () {
                    WebAPI.post('/admin/inviteUserWithPwd', postData).done(function (result) {
                        if (result.error == 'success') {
                            _this.loadUserTree();
                            var errorUserInfo;

                            //邀请结束下面给出提示;弹出框提示成功的个数;
                            var initResultInfos = '';
                            if (!!result.succeedCount) {
                                initResultInfos += _this.i18.REGISTERED_SUCCESSFULLY.format(result.succeedCount);
                            }

                            //邀请失败项,把失败项和失败信息重新展示,方便用户修改后进行下一次邀请操作;
                            //合并前端判断出的错误信息;
                            if (result.failed.length) {
                                //部分邀请成功,则提示邀请成功个数;失败信息展示;
                                if (!!result.succeedCount) alert.success(initResultInfos);
                                errorUserInfo = result.failed;
                                errUserLists = errUserLists.concat(errorUserInfo);
                                
                                $addPersonWin.empty().html(beopTmpl('init_error_user_info', {
                                    errorUserInfo: errUserLists,
                                    isManager: isManagement
                                }));
                                $addPersonWin.find('.errorUserInfoBox').css('display', 'block');
                                if (isManagement) {
                                    var $select = $addPersonWin.find('.userManagement');
                                    var nameKey = AppConfig.language == 'zh' ? 'name_cn' : 'name_en';
                                    _this.managersPlatform.forEach(function (item) {
                                        $select.each(function (i, sel) {
                                            var option = new Option(item[nameKey], item.id);
                                            sel.options.add(option)
                                        })
                                    });
                                }
                            } else {
                                if (errUserLists.length && !!result.succeedCount) {
                                    alert.success(initResultInfos);
                                    $addPersonWin.empty().html(beopTmpl('init_error_user_info', {
                                        errorUserInfo: errUserLists,
                                        isManager: isManagement
                                    }));
                                } else if (result.succeedCount == invitationCount && !errUserLists.length) {
                                    alert.success(initResultInfos);
                                    $('#addPersonWin').modal('hide');
                                }
                                
                                // $addPersonWin.empty().html(beopTmpl('init_result_user_box', {
                                //     addUserLen: 5,
                                //     isManager: isManagement
                                // }));
                            }

                            I18n.fillArea($addPersonWin);
                            // $invite = isManagement ? $('#inviteMsgManager') : $('#inviteMsg');
                            // $invite.empty().text(initResultInfos);
                            // $addPersonErr.text("").hide();
                        }
                    }).fail(function () {
                        $addPersonErr.text(_this.i18.REQUEST_ERROR + "！").show();
                    }).always(function () {
                        I18n.fillArea($(ElScreenContainer));
                    });
                });
                var $infoBoxConfirm = $('.infoBoxConfirm');
                $infoBoxConfirm.css('width', '480px');
                $infoBoxConfirm.find('.infoBox-msg').css('width', '380px');
            });

            //点击管理面板-员工管理的一键激活
            $("#memberManage").on("click", ".re-invite", function () {
                var alert;
                var postData = {
                    reactivateId: parseInt($(this).closest("li").attr("userid")),
                    userId: AppConfig.userId,
                    language: localStorage.getItem('language')
                };
                WebAPI.post('/admin/reactivateUser', postData).done(function (result) {
                    if (result.success) {
                        alert = new Alert(ElScreenContainer, Alert.type.success, I18n.resource.admin.panelManagement.SUCCEED).showAtTop(2000);
                    } else {
                        alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.panelManagement.FAILED).showAtTop(2000);
                    }
                }).fail(function (e) {
                    console.error('员工管理的一键激活错误' + e);
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                });
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
            var PYFormat = new pyFormat(), PYUserNameArr = [], PYItem;
            PYFormat.getPYLocalStorage().done(function (result) {
                userNameArr.forEach(function (item, indexItem) {
                    var pinyin = ' ';
                    PYItem = PYFormat.getPYMap(result.data, item);
                    if (Array.isArray(PYItem)) {
                        PYItem.forEach(function (index) {
                            pinyin += index.pinyin;
                        });
                        PYUserNameArr.push({
                            "userName": item,
                            'userEmail': userEmailArr[indexItem],
                            'userId': userIdArr[indexItem],
                            "PY": $.trim(pinyin)
                        });
                    } else {
                        PYUserNameArr.push({
                            "userName": item,
                            'userEmail': userEmailArr[indexItem],
                            'userId': userIdArr[indexItem],
                            "PY": $.trim(pinyin)
                        });
                    }
                });
                PYFormat = null;
            });
            for (var j = 0; j < PYUserNameArr.length; j++) {
                if (((PYUserNameArr[j].userName.toLowerCase()).indexOf(val.toLowerCase()) > -1) ||
                    ((PYUserNameArr[j].PY.toLowerCase()).indexOf(val.toLowerCase()) > -1) ||
                    ((PYUserNameArr[j].userEmail.toLowerCase()).indexOf(val.toLowerCase()) > -1) ||
                    ((PYUserNameArr[j].userId.toLowerCase()).indexOf(val.toLowerCase()) > -1)
                ) {
                    arrNameInfo.push(PYUserNameArr[j].userName);
                    arrPicInfo.push(userPicArr[j]);
                    arrIdInfo.push(userIdArr[j]);
                    arrEmailInfo.push(userEmailArr[j]);
                }
            }
            var li = '';
            for (var k = 0; k < arrNameInfo.length; k++) {
                if (k < 20) {
                    li += '<li userId="' + arrIdInfo[k] + '" userEmail="' + arrEmailInfo[k] + '" class="pr">' +
                    '<input type="text" value="' + arrNameInfo[k] + '" class="pa" readonly />' +
                    '<img src="' + arrPicInfo[k] + '" class="pa" style="z-index:55" /></li>';
                }
            }
            $("#userListUl").empty().append(li).slideDown(300);
        },

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
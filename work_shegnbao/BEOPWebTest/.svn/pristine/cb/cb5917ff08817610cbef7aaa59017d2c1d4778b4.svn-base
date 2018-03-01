/**
 * Created by liqian on 2015/5/13.
 */
var AccountManager = (function () {
    function AccountManager() {
        this.viewSource = "/static/views/admin/userManager/accountManager.html";
        this.managerCtrl = new UserManagerController();
        this.userVM = null;
        this.recordVM = null;
        this.$container = $();
        this.i18 = I18n.resource.admin.panelManagement;
        this.datePickerInstance = null;
        //报表发送配置
        this.reportEmailSetting = {
            name: null,
            sex: null,
            email: {
                email1: null,
                email2: null,
                email3: null
            },
            data: []
        };
        //之前是否设置过报表邮件
        this.isHadSettingBefore = false;
    }
    var timeOutValue = 60;
    var wait = timeOutValue;
    var timerCheckCodes;
    AccountManager.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get(this.viewSource).done(function (resultHtml) {
                _this.$container = $('#accountManageWrapper').html(resultHtml).find('#accountManage');
                $("#panelContentWrapper").hide();
                _this.init();

                // 刚进入页面加载一部分记录
                _this.managerCtrl.getRecordsOne.call(_this.managerCtrl,
                    AppConfig.userId,
                    $('#allRecord'), false);

                I18n.fillArea($(ElScreenContainer));
            }).always(function () {
                Spinner.stop();
            });
        },
        setUserInfoHeight: function () {
            $("#panelContentWrapper").height($(window).height() - $(".navbar").height() - 20);
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
        init: function () {
            var _this = this;
            this.setUserInfoHeight();
            $("#panelContentWrapper").show();
            this.renderManageUserInfo(AppConfig.userId);
            this.managerCtrl.loadRecords().done(function (result) {
                _this.recordVM = result;
            });
            var $txtLogDateStart = $("#txtLogDateStart");
            $txtLogDateStart.datetimepicker({
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
            this.datePickerInstance = $txtLogDateStart.data('datetimepicker');

            $("#txtLogDateEnd").datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true
            });

            // account security part
            this.$inputBindPhone = $(ElScreenContainer).find('#inputBindPhone');
            this.$inputNewBindPhone = $(ElScreenContainer).find('#inputNewBindPhone');
            this.$inputCheckCode = $(ElScreenContainer).find('#inputCheckCode');
            this.$btnPhoneSubmit = $(ElScreenContainer).find('#btnPhoneSubmit');
            this.$btnChkCodeSubmit = $(ElScreenContainer).find('#btnChkCodeSubmit');
            this.$spanTimer = $(ElScreenContainer).find('#spanTimer');
            var phone = AppConfig.userProfile.core ? AppConfig.userProfile.core : '';
            this.$inputBindPhone.val(phone);
            this.$inputBindPhone.attr('placeholder',I18n.resource.accountSecurity.BIND_PHONE_TIPS);
            this.$inputNewBindPhone.attr('placeholder',I18n.resource.accountSecurity.NEW_PHONE_TIPS);

            this.attachEvents();
        },
        renderManageUserInfo: function (userId) {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            this.managerCtrl.loadUser(userId).done(function (user) {
                _this.userVM = user;
                _this.refreshManageUserInfo();
                _this.refreshManageUserInfoForm();
                I18n.fillArea($(ElScreenContainer));
            }).always(function () {
                Spinner.stop();
            });
        },
        refreshManageUserInfo: function () {
            var compiledTemplate = beopTmpl('paneProjectUserInfoTmpl', this.userVM);
            this.$container.find('#userInfo').html(compiledTemplate);
        },

        refreshManageUserInfoForm: function () {
            var compiledTemplateForm = beopTmpl('paneProjectUserInfoFormTmpl', this.userVM);
            this.$container.find('#basicSet').html(compiledTemplateForm);
        },

        attachEvents: function () {
            var _this = this;
            // 修改用户名确认
            this.$container.on("click", "#confrimEditName", function () {
                var userfullname = $.trim($('#accountManage #editInput').val());
                var flag = /^(\w|-|[\u4E00-\u9FA5]){2,10}$/g.test(userfullname);//用户名校验
                var sexVal = $('#basicSetInfoWrapper input:radio[name="userSex"]:checked').val().trim();
                var sexFlag = $('#basicSetInfoWrapper input:radio[name="userSex"]').is(":checked");
                if (!flag) {
                    _this.managerCtrl.addValidStatus(_this.i18.EMAIL_FORMAT, $("#editInput"), "right");
                    return;
                }
                if (!sexFlag) {
                    alert("性别不能为空！");
                    return;
                }
                _this.managerCtrl.addValidStatus("hide", $("#editInput"), "right");
                Spinner.spin(ElScreenContainer);
                _this.userVM.updateUserfullname(userfullname, sexVal).done(function (result) {
                    if (result.success) {
                        _this.refreshManageUserInfo();
                        AppConfig.userProfile.fullname = userfullname;
                        AppConfig.userProfile.sex = sexVal;
                    }
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                    Spinner.stop();
                });
                $("#paneUser").text(userfullname);
                $("#useName").text(userfullname);
            });

            $('#submitResetPwd').click(function () {
                var $oldPwd = $('#editOldPwd'),
                    $newPwd = $('#editNewPwd'),
                    $editCheckNewPwd = $('#editCheckNewPwd');
                var oldPwd = $oldPwd.val(),
                    newPwd = $newPwd.val(),
                    editCheckNewPwd = $editCheckNewPwd.val();
                var $returnInfo = $("#returnInfo"),
                    $returnInfoCon = $("#returnInfoCon");
                //原密码，新密码，新密码确认校验
                if (oldPwd == "") {
                    _this.managerCtrl.addValidStatus(_this.i18.ORIGINAL_PASSWORD_NULL, $oldPwd);
                    $returnInfoCon.hide();
                    return;
                } else {
                    _this.managerCtrl.addValidStatus('hide', $oldPwd);
                }
                if (newPwd == "") {
                    _this.managerCtrl.addValidStatus(_this.i18.NEW_PASSWORD_NULL, $newPwd);
                    $returnInfoCon.hide();
                    return;
                } else {
                    _this.managerCtrl.addValidStatus('hide', $newPwd);
                }
                if (editCheckNewPwd == "") {
                    _this.managerCtrl.addValidStatus(_this.i18.CONFIRMED_PASSWORD_NULL, $editCheckNewPwd);
                    $returnInfoCon.hide();
                    return;
                } else {
                    _this.managerCtrl.addValidStatus('hide', $editCheckNewPwd);
                }
                if (newPwd != editCheckNewPwd) {
                    _this.managerCtrl.addValidStatus(_this.i18.PASSWORD_CONSISTENT_ERROR, $newPwd);
                    $returnInfoCon.hide();
                    return;
                } else {
                    _this.managerCtrl.addValidStatus('hide', $newPwd);
                }
                //var reg = /^[A-Za-z0-9\@\!\#\$\&\.]{4,22}$/;
                //if (!reg.test(newPwd)) {
                if (!(newPwd.length > 5 && newPwd.length < 16)) {
                    _this.managerCtrl.addValidStatus(_this.i18.PASSWORD_FORMAT_ERROR, $newPwd);
                    $returnInfoCon.hide();
                    return;
                }

                _this.userVM.updatePassword(oldPwd, newPwd).done(function (result) {
                    $returnInfo.text(I18n.resource.code[result.code[0]]);
                    $returnInfoCon.show();
                    if (result.success) {//修改成功
                        $oldPwd.val("");
                        $newPwd.val("");
                        $editCheckNewPwd.val("");
                        $returnInfoCon.hide();
                        var alert = new Alert(ElScreenContainer, Alert.type.success, "修改成功！");
                        alert.showAtTop(2000);
                    } else {//原密码错误
                        errCode = result.code[0];
                        if (errCode >= 1101 && errCode <= 1106) {
                            _this.managerCtrl.addValidStatus(I18n.resource.code[errCode], $newPwd);
                            $returnInfoCon.hide();
                        }
                        else {
                            $returnInfoCon.show();
                            $returnInfo.show();
                        }
                        return false;
                    }
                }).fail(function () {
                    $returnInfo.text(_this.i18.REQUEST_ERROR);
                    $returnInfoCon.show();
                }).always(function () {
                    I18n.fillArea($(ElScreenContainer));
                });

            });

            //修改密码弹出窗口关闭时隐藏相关的
            $('#tabsUl').on('show.bs.tab', "li", function () {
                _this.managerCtrl.addValidStatus("hide", $("#editInput"));
                _this.managerCtrl.addValidStatus('hide', $('#editOldPwd'));
                _this.managerCtrl.addValidStatus('hide', $('#editNewPwd'));
                _this.managerCtrl.addValidStatus('hide', $('#editCheckNewPwd'));
                _this.managerCtrl.addValidStatus('hide', _this.$inputNewBindPhone);
                _this.managerCtrl.addValidStatus('hide', _this.$inputCheckCode);
                $("#returnInfo").hide();
            });
            // 修改头像
            this.$container.on('change', '#file-input', function (event) {
                Spinner.spin(ElScreenContainer);
                event.stopPropagation();
                event.preventDefault();
                try {
                    var fileData = event.target.files[0];

                    if (fileData.size > 1024 * 1024) {
                        $(".modal-dialog").css({
                            'top': ($(window).height() - 200) / 2
                        });
                        $("#PromptWinInfo").text(_this.i18.FILE_SIZE_LIMITED);
                        $("#PromptWin").modal();
                        var t = null;
                        t && clearTimeout(t);
                        t = setTimeout(function () {
                            $("#PromptWin").modal("hide");
                        }, 2000);
                        Spinner.stop();
                        return false;
                    }
                }
                catch (e) {
                    Spinner.stop();
                }


                _this.userVM.updateAvatar(fileData).done(function (result) {
                    Spinner.spin(ElScreenContainer);
                    if (result.success) {
                        $('.image-upload img').attr('src', result.data);
                        AppConfig.userProfile.picture = result.data;
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });
            //点击确定按钮查找账户操作记录
            $("#searchRecord").click(function () {
                _this.managerCtrl.renderRecordsEvent.call(_this.managerCtrl,
                    AppConfig.userId,
                    $("#txtLogDateStart"),
                    $("#txtLogDateEnd"),
                    $("#infoDate"),
                    $('#allRecord'), false);
            });
            //TODO new
            var accountPanel = _this.$container.find('#accountManagePanel');
            accountPanel.find('a[data-toggle="tab"]').on('shown.bs.tab', function () {
                var param = $(this).data('shown'),
                    togglePlans = accountPanel.find('.panel-body div.row');
                togglePlans.hide();
                accountPanel.find('#' + param).show();
                if (param == 'reportEmailSetting') {
                    _this.renderProject();
                }
            });
            $(window).on("resize.setUserInfoHeight", function () {
                _this.setUserInfoHeight();
            });

            this.attachAccountSecurityEvent();
        },
        detachEvents: function () {
            $(window).off("resize.setUserInfoHeight");
        },
        close: function () {
            this.detachEvents();
            this.managerCtrl.addValidStatus("hide", $("#editInput"), 'top');
            this.managerCtrl.addValidStatus("hide", $('#editOldPwd'));
            this.managerCtrl.addValidStatus("hide", $('#editNewPwd'));
            this.managerCtrl.addValidStatus("hide", $('#editCheckNewPwd'));
            this.managerCtrl.addValidStatus('hide', this.$inputNewBindPhone);
            this.managerCtrl.addValidStatus('hide', this.$inputCheckCode);
        },
        renderProject: function () {
            //初始化报表发送配置
            this.reportEmailSetting.data = [];
            this.reportEmailSettingIDList = [];
            Spinner.spin(ElScreenContainer);
            I18n.fillArea($(ElScreenContainer));
            var projectList = AppConfig.projectList,
                _this = this;
            if (projectList == null || projectList == 'undefined') {
                alert(I18n.resource.admin.reportEmailSetting.READ_USER_FAIL);
            }
            var i = 0, projectNameList = [];
            var language = window.localStorage.getItem('language');
            if (language == 'en') {
                for (i = 0; i < projectList.length; i++) {
                    projectNameList.push({
                        title: projectList[i].name_en,
                        id: projectList[i].id
                    })
                }
                document.documentElement.setAttribute('lang', 'en-us');
            } else if (language == 'zh') {
                for (i = 0; i < projectList.length; i++) {
                    projectNameList.push({
                        title: projectList[i].name_cn,
                        id: projectList[i].id
                    })
                }
                document.documentElement.setAttribute('lang', 'zh');
            }
            var $container = $('#reportEmailSetting');
            var $projectListContainer = $container.find('.wf-project-list');
            $container.find('.wf-report-setting-email').find('input[type="email"]').val('');
            $projectListContainer.html(beopTmpl('projectNameList', {
                projectNameList: projectNameList
            }));
            //这里开始读取用户设定
            this.getUserReportEmailSetting();
        },
        getUserReportEmailSetting: function () {
            var _this = this;

            if (AppConfig.userId == 1) {
                //如果是admin登录，就配置设置页面
                WebAPI.get('/workflow/reportEmailSetting/get/' + 1).done(function (result) {
                    //设置用户配置
                    _this.renderUserReporterEmailSetting(result.data);
                }).always(function () {
                    Spinner.stop();
                }).fail(function () {
                    Alert.danger(ElScreenContainer, I18n.resource.admin.reportEmailSetting.GET_FAILED).showAtTop(1000);
                });
            } else {
                WebAPI.get('/workflow/reportEmailSetting/get/' + 1).done(function (result) {

                }).always(function (result) {
                    WebAPI.get('/workflow/reportEmailSetting/get/' + AppConfig.userId).done(function (userSetting) {
                        _this.isHadSettingBefore = false;
                        if (userSetting.data) {
                            try {
                                var projectIdList = userSetting.data.projectId;
                                if (Array.isArray(projectIdList) && projectIdList.length) {
                                    _this.isHadSettingBefore = true;
                                }
                            } catch (ex) {
                            }
                        }
                        _this.renderUserReporterEmailSetting(userSetting.data, result.data);
                    }).always(function () {
                        Spinner.stop();
                    }).fail(function () {
                        Alert.danger(ElScreenContainer, I18n.resource.admin.reportEmailSetting.GET_FAILED).showAtTop(1000);
                    })
                }).fail(function () {
                    Alert.danger(ElScreenContainer, I18n.resource.admin.reportEmailSetting.GET_FAILED).showAtTop(1000);
                });
            }
        },
        renderUserReporterEmailSetting: function (data, adminSetting) {
            if (data !== null) {
                var i = 0, mailItem, mail = [], item, html = '';
                this.reportEmailSetting.name = data.name;
                //这里的mai写死了3个
                for (i = 0; i < 3; i++) {
                    mailItem = data['mail' + (i + 1)];
                    if (mailItem !== null && mailItem !== undefined && mailItem !== '') {
                        mail.push(mailItem);
                    }
                }
                //画一次DOM
                for (i = 0; i < mail.length; i++) {
                    item = $.trim(mail[i]);
                    html += '<div class="col-sm-3 wf-report-setting-email"><input oninvalid="alert(I18n.resource.admin.reportEmailSetting.PLEASE_INPUT_RIGHT_EMAIL);return false;" value="' + item + '" type="email" class="form-control" placeholder="email" required/>' +
                        '<span class="glyphicon glyphicon-remove wf-report-remove-email"></span></div>';
                }
                if (mail.length == 0) {
                    html = '<div class="col-sm-3 wf-report-setting-email"><input oninvalid="alert(I18n.resource.admin.reportEmailSetting.PLEASE_INPUT_RIGHT_EMAIL);return false;" value="" type="email" class="form-control" placeholder="email" required/>' +
                        '<span class="glyphicon glyphicon-remove wf-report-remove-email"></span></div>';
                }
                if (mail.length < 3) {
                    $('#wf-report-email-add').show();
                }
                $('.wf-report-setting-email-container').empty().append(html);
                if (data.name) {
                    $('#wf-report-setting-name').val(data.name);
                }
            }
            var $this, listProjectId, $list = $('.wf-project-list').find('li');
            var userSettings, admin;

            this.reportEmailSetting.sex = this.userVM.usersex;
            if (AppConfig.userId == 1) {
                if (data !== null && data.projectId !== null && data.projectId.length) {
                    userSettings = data.projectId;
                } else {
                    userSettings = []
                }
                this.reportEmailSetting.data = userSettings;
                //admin 配置
                $list.each(function () {
                    $this = $(this);
                    listProjectId = $this.attr('data-project-id');
                    userSettings.forEach(function (item) {
                        if (item == listProjectId) {
                            $this.addClass('selected');
                            $this.find('input[type="checkbox"]').prop('checked', 'checked');
                        }
                    })
                })
            } else {
                //用户根据admin的进行配置
                if (data !== null && data.projectId !== null && data.projectId.length) {
                    userSettings = data.projectId;
                } else {
                    userSettings = []
                }
                if (adminSetting) {
                    this.reportEmailSetting.data = userSettings;
                    admin = adminSetting.projectId;
                    $list.addClass('disabled').each(function () {
                        $this = $(this);
                        listProjectId = $this.attr('data-project-id');
                        //先读取admin设置
                        admin.forEach(function (item) {
                            if (item == listProjectId) {
                                $this.removeClass('disabled');
                            }
                        });
                        //设定用户自己的
                        userSettings.forEach(function (item) {
                            if (item == listProjectId) {
                                $this.addClass('selected');
                                $this.find('input[type="checkbox"]').prop('checked', 'checked');
                            }
                        });
                    });
                } else {
                    $list.each(function () {
                        $this = $(this);
                        listProjectId = $this.attr('data-project-id');
                        //设定用户自己的
                        userSettings.forEach(function (item) {
                            if (item == listProjectId) {
                                $this.addClass('selected');
                                $this.find('input[type="checkbox"]').prop('checked', 'checked');
                            }
                        });
                    });
                }
            }
            this.bindProjectListEvent();
        },
        bindProjectListEvent: function () {
            $('#wf-report-setting-name').attr('placeholder', this.userVM.userfullname);
            var $container = $('#reportEmailSetting'), _this = this, projectList;
            if (AppConfig.userId == 1) {
                projectList = $container.find('.wf-project-list>li').find('label');
            } else {
                //只要有disabled就不绑定事件
                projectList = $container.find('.wf-project-list>li:not([class*="disabled"])').find('label');
            }
            projectList.off().on('change', function (ev) {
                ev.stopPropagation();
                var $this = $(this);
                if ($this.find('input').is(':checked')) {
                    //选中状态--获取nav列表
                    _this.enableProjectList($this);
                } else {
                    //不选中的状态--隐藏nav，重置nav选择状态
                    _this.disableProjectList($this);
                }
            });
            //绑定点击确定后的事件
            var submit = $container.find('#submit-report-email-list');
            submit.off().on('submit', _this.submitReportEmailSetting.bind(_this));
            //绑定输入邮箱
            var emailAdd = $('#wf-report-email-add'), emailLength;
            emailAdd.off().on('click', function () {
                var html = '<div class="col-sm-3 wf-report-setting-email"><input oninvalid="alert(I18n.resource.admin.reportEmailSetting.PLEASE_INPUT_RIGHT_EMAIL);return false;" type="email" class="form-control" placeholder="email" required>' +
                        '<span class="glyphicon glyphicon-remove wf-report-remove-email"></span></div>',
                    $this = $(this);
                emailLength = $('.wf-report-setting-email').find('input').length;
                if (emailLength < 3) {
                    $this.prev().append(html);
                    if (emailLength == 2) {
                        emailAdd.hide();
                    }
                } else {
                    alert(I18n.resource.admin.reportEmailSetting.MAX_EMAIL_ADD)
                }
            });
            //删除邮箱
            $('#accountManagePanel').on('click', '.wf-report-remove-email', function () {
                $(this).parent().remove();
                if (emailLength < 3) {
                    emailAdd.show();
                }
            })
        },
        disableProjectList: function ($this) {
            var $parent = $this.parent(),
                $projectDetail = $parent.find('ul.wf-project-detail'),
                projectId = $this.parent().attr('data-project-id');
            $parent.toggleClass('selected');
            this.reportEmailSetting.data.forEach(function (item, index, array) {
                if (item == projectId) {
                    array.splice(index, 1);
                }
            });
        },
        enableProjectList: function ($this) {
            //如果是第二个直接添加 projectID
            var $parent = $this.parent(), id = $parent.attr('data-project-id');
            if (AppConfig.userId == 1) {
                $parent.toggleClass('selected');
                this.reportEmailSetting.data.push(id);
            } else {
                if ($parent.hasClass('disabled')) {
                    $this.find('input[type="checkbox"]').prop('checked', false);
                    return false
                } else {
                    $parent.toggleClass('selected');
                    this.reportEmailSetting.data.push(id);
                }
            }
        },
        submitReportEmailSetting: function (ev) {
            var data = this.reportEmailSetting, userId = AppConfig.userId, name;
            data.sex = this.userVM.usersex;
            name = $.trim($('#wf-report-setting-name').val());
            if (name) {
                data.name = name;
            } else {
                data.name = this.userVM.userfullname;
            }
            var email = $('.wf-report-setting-email-container').find('input');
            //判断邮件
            if (email.length == 0) {
                alert(I18n.resource.admin.reportEmailSetting.LEAST_ONE_EMAIL);
                ev.preventDefault();
                return false;
                //判断是否选择项目
            } else if (data.data.length == 0 && this.isHadSettingBefore) {
                alert(I18n.resource.admin.reportEmailSetting.PLEASE_CHOOSE_PROJECT);
                ev.preventDefault();
                return false;
            } else {
                var extendData;
                Spinner.spin(ElScreenContainer);
                //兼容删除邮件的时候，因删除项目列表上面已经做过
                for (key in data.email) {
                    if (data.email.hasOwnProperty(key)) {
                        data.email[key] = null;
                    }
                }
                email.each(function (i) {
                    data.email['email' + (i + 1)] = $.trim($(this).val());
                });
                extendData = $.extend(true, {}, data);
                if (AppConfig.userId !== 1) {
                    extendData.data = [];
                    $('#reportEmailSetting').find('.wf-project-list>li:not([class*="disabled"])').each(function () {
                        var $this = $(this);
                        if ($this.hasClass('selected')) {
                            extendData.data.push($this.attr('data-project-id'))
                        }
                    })
                }
                extendData.projectIdList = JSON.stringify(extendData.data);
                WebAPI.post('workflow/reportEmailSetting/update/' + userId, extendData).done(function (result) {
                    if (result.success) {
                        Alert.success(ElScreenContainer, I18n.resource.admin.reportEmailSetting.ADD_SUCCESS).showAtTop(1000);
                    }
                }).fail(function () {
                    Alert.danger(ElScreenContainer, I18n.resource.admin.reportEmailSetting.ADD_FAILED).showAtTop(1000);
                }).always(function () {
                    Spinner.stop();
                });
            }
        },
        attachAccountSecurityEvent: function () {
            var _this = this;
            _this.$btnPhoneSubmit.click(function (e) {
                var phoneNum = _this.$inputNewBindPhone.val();
                if (!phoneNum) {
                    _this.managerCtrl.addValidStatus(I18n.resource.accountSecurity.PHONE_CHECK, _this.$inputNewBindPhone, 'bottom');
                    return;
                }
                _this.managerCtrl.addValidStatus('hide', _this.$inputNewBindPhone);

                wait = timeOutValue;
                _this.$spanTimer.text(wait);
                setCheckCodesTimer(_this.$spanTimer);
                var postData = {
                    'userId': AppConfig.userId,
                    'phone': phoneNum
                }
                WebAPI.post('/user/sendverifymessage', postData).done(function (result) {
                    if (0 == result.data) {// success
                    }
                    else if (1 == result.data) {// phone exist
                        clearTimeout(timerCheckCodes);
                        _this.$spanTimer.text('');
                        alert(I18n.resource.accountSecurity.PHONE_EXISTED);
                    }
                    else {// failed
                        clearTimeout(timerCheckCodes);
                        _this.$spanTimer.text('');
                        alert(I18n.resource.accountSecurity.SEND_MESSAGE_FAILED);
                    }
                }).error(function () {
                    clearTimeout(timerCheckCodes);
                    _this.$spanTimer.text('');
                    alert(I18n.resource.accountSecurity.SEND_MESSAGE_FAILED);
                });
            });
            _this.$btnChkCodeSubmit.click(function (e) {
                var phoneNum = _this.$inputNewBindPhone.val();
                if (!phoneNum) {
                    _this.managerCtrl.addValidStatus(I18n.resource.accountSecurity.PHONE_CHECK, _this.$inputNewBindPhone, 'bottom');
                    return;
                }
                _this.managerCtrl.addValidStatus('hide', _this.$inputNewBindPhone);

                var code = _this.$inputCheckCode.val();
                if (!code) {
                    _this.managerCtrl.addValidStatus(I18n.resource.accountSecurity.CHECK_CODE_CHECK, _this.$inputCheckCode, 'bottom');
                    return;
                }
                _this.managerCtrl.addValidStatus('hide', _this.$inputCheckCode);

                var postData = {
                    'userId': AppConfig.userId,
                    'phone': phoneNum,
                    'code':code
                }
                WebAPI.post('/user/bindingphone', postData).done(function (result) {
                    if (result.data) {
                        AppConfig.userProfile.core = phoneNum;
                        _this.$inputBindPhone.val(phoneNum);
                        _this.$inputNewBindPhone.val('');
                        _this.$inputCheckCode.val('');
                        clearTimeout(timerCheckCodes);
                        _this.$spanTimer.text('');
                        alert(I18n.resource.accountSecurity.BIND_SUCCESS);
                    }
                    else {
                        _this.$inputCheckCode.val('');
                        clearTimeout(timerCheckCodes);
                        _this.$spanTimer.text('');
                        alert(I18n.resource.accountSecurity.BIND_FAILED);
                    }
                }).error(function () {
                    _this.$inputCheckCode.val('');
                    clearTimeout(timerCheckCodes);
                    _this.$spanTimer.text('');
                    alert(I18n.resource.accountSecurity.BIND_FAILED);
                });
            });
        }
    };

    function setCheckCodesTimer($obj) {
        if (wait <= 0) {
            $obj.text(I18n.resource.accountSecurity.CHECK_CODE_TIMEOUT);
            wait = timeOutValue;
        } else {
            $obj.text(wait);
            wait--;
            timerCheckCodes = setTimeout(function () {setCheckCodesTimer($obj);}, 1000);
        }
    }

    return AccountManager;
})();
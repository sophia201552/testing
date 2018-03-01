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
        //报表已经配置的报表
        this.reportEmailSettingIDList = [];
    }

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
            $("#allRecord").height($(window).height() - $(".navbar").height() - 320);
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
            this.attachEvents();
        },
        renderManageUserInfo: function (userId) {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            this.managerCtrl.loadUser(userId).done(function (user) {
                _this.userVM = user;
                _this.refreshManageUserInfo();
                I18n.fillArea($(ElScreenContainer));
            }).always(function () {
                Spinner.stop();
            });
        },
        refreshManageUserInfo: function () {
            var compiledTemplate = beopTmpl('paneProjectUserInfoTmpl', this.userVM);
            this.$container.find('#userInfo').html(compiledTemplate);
        },

        attachEvents: function () {
            var _this = this;
            // 编辑用户名
            this.$container.on('click', '#editName', function () {
                $("#confrimEditName").show();
                $(this).hide();
                $('#accountManage .nameEditor').toggleClass("editing");
            });
            // 修改用户名确认
            this.$container.on("click", "#confrimEditName", function () {
                var userfullname = $.trim($('#accountManage #editInput').val());
                var flag = /^(\w|-|[\u4E00-\u9FA5]){2,10}$/g.test(userfullname);//用户名校验
                if (!flag) {
                    _this.managerCtrl.addValidStatus(_this.i18.EMAIL_FORMAT, $("#editInput"), "top");
                    return;
                } else {
                    _this.managerCtrl.addValidStatus("hide", $("#editInput"), "top");
                    if (userfullname && userfullname.trim() !== _this.userVM.userfullname) {
                        Spinner.spin(ElScreenContainer);
                        _this.userVM.updateUserfullname(userfullname.trim()).done(function (result) {
                            if (result.success) {
                                _this.refreshManageUserInfo();
                                AppConfig.userProfile.fullname = userfullname.trim();
                            }
                        }).always(function () {
                            I18n.fillArea($(ElScreenContainer));
                            Spinner.stop();
                        });
                    }
                    $('#accountManage .nameEditor').removeClass("editing");
                    $("#paneUser").text(userfullname);
                    $("#confrimEditName").hide();
                    $("#editName").show();
                }
            });
            //弹出密码修改框
            this.$container.on('click', '.userPwd', function () {
                var wh = $(window).height();
                var top = (wh - 300) / 2;
                $(".modal-dialog").css({
                    'top': top
                });
                $('#editPwdWin').modal();
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
                        $("#editPwdWin").modal("hide");

                    } else {//原密码错误
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
            $('#editPwdWin').on('hide.bs.modal', function () {
                _this.managerCtrl.addValidStatus('hide', $('#editOldPwd'));
                _this.managerCtrl.addValidStatus('hide', $('#editNewPwd'));
                _this.managerCtrl.addValidStatus('hide', $('#editCheckNewPwd'));
            });
            // 修改头像
            this.$container.on('change', '#file-input', function (event) {
                Spinner.spin(ElScreenContainer);
                event.stopPropagation();
                event.preventDefault();
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
                    _this.renderProjectList();
                }
            });
            $(window).on("resize.setUserInfoHeight", function () {
                _this.setUserInfoHeight();
            });
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
        },
        renderProjectList: function () {
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
            $projectListContainer.html(beopTmpl('projectNameList', {
                projectNameList: projectNameList
            }));
            this.getUserReportEmailSetting().done(function () {
                _this.bindProjectListEvent();
                Spinner.stop();
            });
        },
        getUserReportEmailSetting: function () {
            var _this = this;
            return WebAPI.get('workflow/reportEmailSetting/get/' + AppConfig.userId).done(function (result) {
                if (Object.keys(result.data).length) {
                    _this.renderUserReporterEmailSetting(result.data);
                } else {
                    return $.Deferred().resolve();
                }
            }).always(function () {
                Spinner.stop();
            })
        },
        renderUserReporterEmailSetting: function (data) {
            if (!data) {
                alert(I18n.resource.admin.reportEmailSetting.NO_DATA);
                return false;
            } else {
                data.data.forEach(function (item, index, array) {
                    item.navItemIdList = JSON.parse(item.navItemIdList);
                });
                var dataList = data.data,
                    nickName = data.nickname,
                    mail = [],
                    sex = data.sex, _this = this;

                var reportIdList = [], reportNavItems = [], i = 0, mailItem, item;
                //这里的mai写死了3个
                for (i = 0; i < 3; i++) {
                    mailItem = data['mail' + (i + 1)];
                    if (mailItem !== null && mailItem !== undefined && mailItem !== '') {
                        mail.push(mailItem);
                    }
                }
                for (i = 0; i < dataList.length; i++) {
                    item = dataList[i];
                    reportIdList.push(item.projectId);
                    this.reportEmailSettingIDList.push({
                        projectId: item.projectId,
                        navItemIdList: item.navItemIdList
                    });
                }
                //画一次DOM
                $('#wf-report-setting-name').val(nickName);
                var html = '';
                for (i = 0; i < mail.length; i++) {
                    item = $.trim(mail[i]);
                    html += '<div class="col-sm-3 wf-report-setting-email"><input oninvalid="alert(I18n.resource.admin.reportEmailSetting.PLEASE_INPUT_RIGHT_EMAIL);return false;" value="' + item + '" type="email" class="form-control" placeholder="email" required/>' +
                    '<span class="glyphicon glyphicon-remove wf-report-remove-email"></span></div>';
                }
                if (mail.Length < 3) {
                    html += '<span class="glyphicon glyphicon-plus-sign wf-report-email-add" id="wf-report-email-add"></span>';
                    $('.wf-report-setting-email-container').empty().append(html);
                } else {
                    $('.wf-report-setting-email-container').empty().append(html);
                }
                $('#wf-report-setting-sex').find('input[type="radio"]').each(function () {
                    var $this = $(this);
                    if ($this.parent().attr('data-wf-report-setting-sex-type') == sex) {
                        $this.prop('checked', 'checked');
                        //0 女 1 男
                        _this.reportEmailSetting.sex = sex;
                    }
                });

                //给已经添加过报表的项目添加class
                var $projectList = $('.wf-project-list>li');
                $projectList.each(function () {
                    var $this = $(this);
                    for (i = 0; i < reportIdList.length; i++) {
                        if ($this.data('project-id') == reportIdList[i]) {
                            $this.addClass('wf-hasAddReporter');
                            $this.find('input[type="checkbox"]').prop('checked', 'checked');
                        }
                    }
                });
                //这个时候给 reportEmailSetting 添加数据
                for (i = 0; i < dataList.length; i++) {
                    this.reportEmailSetting.data.push(dataList[i]);
                }
            }
        },
        bindProjectListEvent: function () {
            var $container = $('#reportEmailSetting');
            var projectList = $container.find('.wf-project-list>li>label'),
                _this = this;
            projectList.off().on('change', function (ev) {
                    ev.stopPropagation();
                    var $this = $(this), isHasAddReporter = $this.parent().hasClass('wf-hasAddReporter');

                    //判断是否是 根据后台数据自动生成的 checked
                    if (isHasAddReporter) {
                        //如果是 根据 后台数据自动生成的 checked 获取完数据后 再次选中
                        _this.enableProjectList($this).done(function () {
                            $this.find('input').prop('checked', 'checked');
                            //获取数据完成后 更换 识别标示 并复原颜色
                            //$this.parent().removeClass('wf-hasAddReporter').addClass('wf-hasRestore');
                        });
                    } else {
                        if ($this.find('input').is(':checked')) {
                            //选中状态--获取nav列表
                            _this.enableProjectList($this);
                        } else {
                            //不选中的状态--隐藏nav，重置nav选择状态
                            _this.disableProjectList($this);

                            //不选中的时候去除 后台数据生成 标识
                            //$this.parent().removeClass('wf-hasRestore');
                        }
                    }
                }
            );
            //绑定点击确定后的事件
            var submit = $container.find('#submit-report-email-list');
            submit.off().on('submit', _this.submitReportEmailSetting.bind(_this));
            //绑定选择性别
            var sexSelected = $('#wf-report-setting-sex').find('input');
            sexSelected.parent().each(function () {
                $(this).on('change', function () {
                    var $this = $(this);
                    var checkBox = $this.find('input');
                    if (checkBox.is(':checked')) {
                        _this.reportEmailSetting.sex = $.trim(checkBox.parent().data('wf-report-setting-sex-type'));
                        sexSelected.prop('checked', false);
                        checkBox.prop('checked', 'checked');
                    } else {

                    }
                })
            });
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
                projectId = $projectDetail.parent().attr('data-project-id');
            $projectDetail.toggleClass('dn');

            //当取消选择 project list 后需要删除 当前 navItem 信息，并且让下面所有的checkbox取消选中
            /*var reportProjectList = this.reportEmailSetting.data;
             reportProjectList.forEach(function (item, index, array) {
             if (item.projectId == projectId) {
             reportProjectList.splice(index, 1)
             }
             });
             $this.next().find('input[type="checkbox"]').prop('checked', false);*/
        },
        enableProjectList: function ($this) {
            var projectListLI = $this.parent(),
                projectId = projectListLI.attr('data-project-id'),
                $projectDetail = projectListLI.find('ul.wf-project-detail'),
                _this = this;
            //判断是否存在 project id
            var isHasProject = _this.reportEmailSetting.data.some(function (item, index, array) {
                return (item.projectId == projectId)
            });
            //如果获取过一次数据后
            if (projectListLI.hasClass('hasGotData')) {
                $projectDetail.toggleClass('dn');
                projectId = $projectDetail.parent().attr('data-project-id');
                if (!isHasProject) {
                    _this.reportEmailSetting.data.push({
                        projectId: projectId,
                        navItemIdList: []
                    });
                }
                return $.Deferred().resolve();
            } else {
                Spinner.spin(ElScreenContainer);
                return WebAPI.get('/get_plant_pagedetails/' + projectId + '/' + AppConfig.userId).done(function (result) {
                    var projectDetailList = result.navItems,
                        reportDeatilList = [], i;
                    //判断是报表
                    for (i = 0; i < projectDetailList.length; i++) {
                        if (projectDetailList[i].type == "ReportScreen") {
                            reportDeatilList.push(projectDetailList[i])
                        }
                    }
                    projectListLI.append(beopTmpl('projectDetailList', {
                        projectDetailList: reportDeatilList
                    }));
                    var newProjectDetail = projectListLI.find('ul.wf-project-detail');
                    if (!isHasProject) {
                        _this.reportEmailSetting.data.push({
                            projectId: projectId,
                            navItemIdList: []
                        });
                    }
                    var navItemIdList = [];
                    //获取 navItems id
                    for (i = 0; i < _this.reportEmailSettingIDList.length; i++) {
                        var item = _this.reportEmailSettingIDList[i];
                        if (item.projectId == projectId) {
                            navItemIdList = item.navItemIdList
                        }
                    }
                    //根据 navItemsId 给已经配置的报表添加checked
                    if (navItemIdList.length) {
                        newProjectDetail.find('li').each(function () {
                            var $this = $(this);
                            for (i = 0; i < navItemIdList.length; i++) {
                                if ($this.data('navitems-id') == navItemIdList[i].navItemsId) {
                                    $this.find('input[type="checkbox"]').prop('checked', 'checked');
                                }
                            }
                        });
                    }
                    _this.bindProjectListDetailChecked(newProjectDetail);
                }).always(function () {
                    Spinner.stop();
                    projectListLI.addClass('hasGotData');
                })
            }
        },
        //绑定获取到的 project list detail nav 的 复选框
        bindProjectListDetailChecked: function ($projectDetail) {

            if ($projectDetail.hasClass('no-data')) {

            } else {
                //如果存在菜单而且
                //当选中project list 后需要添加 navItem信息
                var _this = this;
                $projectDetail.find('li>label').off().on('change', function () {
                    var $this = $(this),
                        $parent = $this.parent(), // project-detail li
                        projectId = $parent.parent().parent().attr('data-project-id'), //project-list li;
                        navItemsId = $parent.attr('data-navitems-id'),
                        reportFolder = $parent.attr('data-navItems-reportFolder');
                    var reportProjectList, i = 0, item;
                    //选中了具体的nav list
                    reportProjectList = _this.reportEmailSetting.data;
                    if ($this.find('input').is(':checked')) {
                        //遍历添加进入
                        for (i = 0; i < reportProjectList.length; i++) {
                            item = reportProjectList[i];
                            if (item.projectId == projectId) {
                                item.navItemIdList.push({
                                    navItemsId: navItemsId,
                                    reportFolder: reportFolder,
                                    text: $.trim($this.text())
                                });
                            }
                        }
                    } else {
                        //取消选中 删掉在 reportEmailSetting 里面相应的 navItemsId
                        for (i = 0; i < reportProjectList.length; i++) {
                            item = reportProjectList[i];
                            if (item.projectId == projectId) {
                                item.navItemIdList.forEach(function (result, index, array) {
                                    if (result.navItemsId == navItemsId) {
                                        item.navItemIdList.splice(index, 1);
                                    }
                                })
                            }
                        }
                    }
                });
            }
        },
        submitReportEmailSetting: function (ev) {
            var data = this.reportEmailSetting,
                userId = AppConfig.userId;
            if (data.data.length == 0) {
                alert(I18n.resource.admin.reportEmailSetting.PLEASE_CHOOSE_PROJECT);
                ev.preventDefault();
                return false;
            } else if (data.sex == null) {
                alert(I18n.resource.admin.reportEmailSetting.PLEASE_CHOOSE_SEX);
                ev.preventDefault();
                return false;
            } else {
                var email = $('.wf-report-setting-email-container').find('input');
                if (email.length == 0) {
                    alert(I18n.resource.admin.reportEmailSetting.LEAST_ONE_EMAIL);
                    ev.preventDefault();
                    return false;
                }
                Spinner.spin(ElScreenContainer);
                data.name = $('#wf-report-setting-name').val();
                email.each(function (i) {
                    data.email['email' + (i + 1)] = $.trim($(this).val());
                });
                //因为这里需要发送到后台的 navItemIdList 需要是一个字符串 而不是数组
                //Python里面数组转化不会写，先暂时这样
                var extendData = $.extend(true, {}, data);
                extendData.data = extendData.data.filter(function (item, index, array) {
                    return (item.navItemIdList.length !== 0)
                });
                if (extendData.data.length == 0) {
                    alert(I18n.resource.admin.reportEmailSetting.PLEASE_CHOOSE_REPORT);
                    Spinner.stop();
                    ev.preventDefault();
                    return false;
                } else {
                    extendData.data.forEach(function (item, index, array) {
                        item.navItemIdList = JSON.stringify(item.navItemIdList);
                    });
                    WebAPI.post('workflow/reportEmailSetting/update/' + userId, extendData).done(function (result) {
                        if (result.success) {
                            alert(I18n.resource.admin.reportEmailSetting.ADD_SUCCESS);
                        }
                    }).fail(function () {

                    }).always(function () {
                        Spinner.stop();
                    });
                }
            }
        }
    };
    return AccountManager;
})();
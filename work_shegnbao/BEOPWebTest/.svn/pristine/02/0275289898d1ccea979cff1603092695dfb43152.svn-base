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
    }

    AccountManager.prototype = {
        show: function () {
            $("#ulPages").empty();
            var _this = this;
            Spinner.spin(ElScreenContainer);
            $.get(this.viewSource).done(function (resultHtml) {
                _this.$container = $('#accountManageWrapper').html(resultHtml).find('#accountManage');
                $("#panelContentWrapper").hide();
                _this.init();
                I18n.fillArea($(ElScreenContainer));
            }).always(function () {
                Spinner.stop();
            });
        },
        setUserInfoHeight: function () {
            $("#panelContentWrapper").height($(window).height()-$(".navbar").height()-20);
            $("#allRecord").height($(window).height()-$(".navbar").height()-320);
        },
        init: function () {
            var _this = this;
            this.setUserInfoHeight();
            $("#panelContentWrapper").show();
            this.renderManageUserInfo(AppConfig.userId);
            this.managerCtrl.loadRecords().done(function (result) {
                _this.recordVM = result;
            });

            $("#txtLogDateStart").datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true,
                endDate: new Date()
            });
            $("#txtLogDateEnd").datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true
            });
            this.attachEvents();
        },
        renderManageUserInfo: function (userId) {
            var _this = this;
            this.managerCtrl.loadUser(userId).done(function (user) {
                _this.userVM = user;
                _this.refreshManageUserInfo();
                I18n.fillArea($(ElScreenContainer));
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
                //原密码，新密码，新密码确认校验
                if (oldPwd == "") {
                    _this.managerCtrl.addValidStatus(_this.i18.ORIGINAL_PASSWORD_NULL, $oldPwd);
                    return;
                } else {
                    _this.managerCtrl.addValidStatus('hide', $oldPwd);
                }
                if (newPwd == "") {
                    _this.managerCtrl.addValidStatus(_this.i18.NEW_PASSWORD_NULL, $newPwd);
                    return;
                } else {
                    _this.managerCtrl.addValidStatus('hide', $newPwd);
                }
                if (editCheckNewPwd == "") {
                    _this.managerCtrl.addValidStatus(_this.i18.CONFIRMED_PASSWORD_NULL, $editCheckNewPwd);
                    return;
                } else {
                    _this.managerCtrl.addValidStatus('hide', $editCheckNewPwd);
                }
                if (newPwd != editCheckNewPwd) {
                    _this.managerCtrl.addValidStatus(_this.i18.PASSWORD_CONSISTENT_ERROR, $newPwd);
                    return;
                } else {
                    _this.managerCtrl.addValidStatus('hide', $newPwd);
                }
                var reg = /^[A-Za-z0-9\@\!\#\$\&\.]{4,22}$/;
                if (!reg.test(newPwd)) {
                    _this.managerCtrl.addValidStatus(_this.i18.PASSWORD_FORMAT_ERROR, $newPwd);
                    return;
                }
                var $returnInfo = $("#returnInfo");
                var $returnInfoCon = $("#returnInfoCon");
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
                    var t=null;
                    t && clearTimeout(t);
                    t = setTimeout(function () {
                        $("#PromptWin").modal("hide");
                    },2000);
                    Spinner.stop();
                    return false;
                }

                _this.userVM.updateAvatar(fileData).done(function (result) {
                    Spinner.spin(ElScreenContainer);
                    if (result.success) {
                        $('.image-upload img').attr('src', result.data)
                    }
                }).always(function () {
                    Spinner.stop();
                });;
            });
            //点击确定按钮查找账户操作记录
            $("#searchRecord").click(function () {
                _this.managerCtrl.renderRecordsEvent.call(_this.managerCtrl,
                    AppConfig.userId,
                    $("#txtLogDateStart"),
                    $("#txtLogDateEnd"),
                    $("#infoDate"),
                    $('#selectRecord'),
                    $('#allRecord'),false);
            });

            $(window).on("resize.setUserInfoHeight",function(){
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
        }
    };
    return AccountManager;
})();
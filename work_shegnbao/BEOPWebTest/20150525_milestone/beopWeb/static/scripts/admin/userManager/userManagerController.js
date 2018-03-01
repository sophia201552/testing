/**
 * Created by liqian on 2015/5/13.
 */
var UserManagerController = (function () {

    function User() {
        this.id = null;
        this.username = null;
        this.userfullname = null;
        this.userpic = null;
    }

    User.prototype = {
        updateUserfullname: function (userfullname) {
            var _this = this;
            return WebAPI.post('/admin/updateUser', {
                id: this.id,
                userfullname: userfullname
            }).done(function (result) {
                if (result.success) {
                    _this.userfullname = userfullname;
                }
            });
        },
        updatePassword: function (oldPwd, newPwd) {
            return WebAPI.post('/admin/updateUser', {
                id: this.id,
                oldPassword: oldPwd,
                password: newPwd
            })
        },
        updateAvatar: function (fileData) {
            var _this = this;
            var formData = new FormData();
            formData.append('file', fileData);
            formData.append('userId', this.id);
            return $.ajax({
                url: '/admin/updateAvatar',
                type: 'POST',
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function (result, textStatus, jqXHR) {
                    if (typeof result.error === 'undefined' && result.success) {
                        _this.userpic = result.data;
                    } else {
                        var alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[result.code]);
                        alert.showAtTop(2000);
                    }
                }
            });
        }
    };

    function Records() {
        this.recordType = {
            0: I18n.resource.admin.panelManagement.ALL_RECORDS,
            1: I18n.resource.admin.panelManagement.ACCOUNT_LOGIN_RECORD,
            2: I18n.resource.admin.panelManagement.USER_MANAGEMENT_RECORD,
            3: I18n.resource.admin.panelManagement.PAGE_MANAGEMENT_RECORD
        };
        this.loginRecords = [];
        this.userManageRecords = [];
        this.pageManageRecords = [];
        this.allRecords = [];
    }

    Records.prototype = {
        fetchRecords: function (recordType, userId, beginTime, endTime) {
            var postData = {
                userId: userId,
                type: recordType,
                beginTime: beginTime,
                endTime: endTime
            };
            if (recordType === 0) {
                delete postData['type'];
            }
            return WebAPI.post('/admin/getRecords', postData);
        },
        fetchAllRecords: function (userId, beginTime, endTime) {
            var _this = this;
            return this.fetchRecords(0, userId, beginTime, endTime).done(function (result) {
                _this.allRecords = (result && result.data) || [];
            });
        },
        fetchLoginRecords: function (userId, beginTime, endTime) {
            var _this = this;
            return this.fetchRecords(1, userId, beginTime, endTime).done(function (result) {
                _this.loginRecords = (result && result.data) || [];
            });
        },
        fetchUserManageRecords: function (userId, beginTime, endTime) {
            var _this = this;
            return this.fetchRecords(2, userId, beginTime, endTime).done(function (result) {
                _this.userManageRecords = (result && result.data) || [];
            });
        },
        fetchPageManageRecords: function (userId, beginTime, endTime) {
            var _this = this;
            return this.fetchRecords(3, userId, beginTime, endTime).done(function (result) {
                _this.pageManageRecords = (result && result.data) || [];
            });
        }
    };

    function UserManagerController(manager) {
        this.manager = manager;
        this.recordVM = new Records();
        this.viewSource = "/static/views/admin/userManager/userManagerController.html";
    }

    UserManagerController.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            $.get(this.viewSource).done(function (resultHtml) {
                var $ElScreenContainer = $(ElScreenContainer).html($(resultHtml));
                var $tab = beopTmpl('managerTabTmpl', AppConfig);
                $ElScreenContainer.find('#manageTab').append($tab);
                _this.init();
                ScreenManager.show(_this.manager);
                I18n.fillArea($(ElScreenContainer));
                $('#manageTab li[screen="' + BEOPUtil.getFunctionName(_this.manager) + '"] a').tab('show');
            }).always(function () {
                Spinner.stop();
            });
        },
        init: function () {
            var _this = this;
            $('#manageTab a').click(function (e) {
                var screen = $(this).parent().attr('screen');
                if (screen && window[screen]) {
                    _this.manager = window[screen];
                    ScreenManager.show(_this.manager);
                }
            });
        },
        close: function () {
            $(document).off('click.userManager');
            this.addValidStatus("hide", $("#editInput"), 'top');
            this.addValidStatus("hide", $('#editOldPwd'));
            this.addValidStatus("hide", $('#editNewPwd'));
            this.addValidStatus("hide", $('#editCheckNewPwd'));
        },

        addValidStatus: function (msg, $obj, placement) {
            var placement = placement || 'right';
            var errorTooltip = $obj.tooltip({
                container: 'body',
                placement: placement,
                trigger: "manual",
                template: '<div class="tooltip" role="tooltip">' +
                '<div class="tooltip-arrow"></div>' +
                '<div class="tooltip-inner"></div>' +
                '</div>',
                html: true,
                title: (msg || '')
            });

            if (msg != "hide") {
                errorTooltip.tooltip('show');
            } else {
                errorTooltip && errorTooltip.tooltip('destroy');
            }
        },
        loadUser: function (userId) {
            var dfd = $.Deferred();
            if (!userId) {
                dfd.reject()
            }
            return WebAPI.get('admin/accountManger/' + userId).pipe(function (result) {
                if (result.success) {
                    var user = $.extend(true, new User(), result.data);
                    dfd.resolve(user);
                } else {
                    dfd.reject(result)
                }
                return dfd;
            })
        },
        loadRecords: function () {
            var dfd = $.Deferred();
            dfd.resolve(new Records());
            return dfd;
        },
        setFloatingWin: function ($win, h) {//设置浮动窗口
            var wh = $(window).height();
            var top = (wh - h) / 2;
            $win.find(".modal-dialog").css({
                'top': top
            });
            $win.modal();
        },
        checkEmail: function (str) {//邮箱验证
            var flag = true
            var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
            if (re.test(str)) {
                flag = true;
                return flag;
            } else {
                flag = false;
                return flag;
            }
        },
        buildSubTree: function (buildTreeItemFunc, root, childField) {
            if (!buildTreeItemFunc || typeof buildTreeItemFunc !== 'function') {
                return '';
            }
            if (!childField) {
                childField = 'children';
            }
            if (root[childField] && root[childField].length > 0) {
                var $container = $('<ul></ul>')
                for (var i = 0; i < root[childField].length; i++) {
                    var child = root[childField][i];
                    var $li = $(buildTreeItemFunc(child));
                    if (child[childField] && child[childField].length) {
                        $li.append(this.buildSubTree(buildTreeItemFunc, child, childField));
                    }
                    $container.append($li);
                }
                return $container;
            }
        },
        validateTime: function ($startTime, $endTime, $msg) {//开始时间，结束时间格式校验
            var flag = false;
            var startTimeVal = $startTime.val();
            var endTimeVal = $endTime.val();
            if (startTimeVal == "") {
                $msg.text(I18n.resource.admin.panelManagement.START_TIME_CHECKINFO).css("display", "block");
                flag = false;
            } else if (endTimeVal == "") {
                $msg.text(I18n.resource.admin.panelManagement.END_TIME_CHECKINFO).css("display", "block");
                flag = false;
            } else if (startTimeVal > endTimeVal) {
                $msg.text(I18n.resource.admin.panelManagement.TIME_GREATER_CHECKINFO).css("display", "block");
                flag = false;
            } else {
                flag = true;
            }
            if (flag) {
                $msg.hide();
            } else {
                $msg.show();
            }
            return flag;
        },
        isArrayRepeat: function (arr) {
            return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f" + arr.join("\x0f\x0f") + "\x0f");
        },
        renderLoginRecords: function ($container) {
            var compiledTemplate = beopTmpl('loginRecordTmpl', this.recordVM.loginRecords);
            $container.html(compiledTemplate);
        },
        renderUserManageRecords: function ($container) {
            var compiledTemplate = beopTmpl('userManageRecordTmpl', this.recordVM.userManageRecords);
            $container.html(compiledTemplate);
        },
        renderPageManageRecords: function ($container) {
            var compiledTemplate = beopTmpl('pageManageRecordTmpl', this.recordVM.pageManageRecords);
            $container.html(compiledTemplate);
        },
        renderAllRecords: function ($container) {
            var compiledTemplate = beopTmpl('allRecordTmpl', this.recordVM.pageManageRecords);
            $container.html(compiledTemplate);
        },
        renderRecordsEvent: function (userId, $startTime, $endTime, $msg, $typeSelector, $container, isWinFlag) {//点击页面管理-浮动窗口-账户操作记录 确定按钮
            var flag = this.validateTime($startTime, $endTime, $msg);
            //flag为对日期的非空及开始日期是否小于结束日期的校验
            if (flag) {
                if (!userId) {
                    return false;
                }
                if (isWinFlag) {
                    $("#userAllRecord").show();
                }
                var recordType = $typeSelector.find("option:selected").val(),
                    beginTime = $startTime.val(),
                    endTime = $endTime.val(),
                    _this = this;
                switch (parseInt(recordType)) {
                    case 0:
                    {
                        this.recordVM.fetchAllRecords(userId, beginTime, endTime).done(function () {
                            _this.renderAllRecords($container);
                        });
                        break;
                    }
                    case  1:
                    {
                        this.recordVM.fetchLoginRecords(userId, beginTime, endTime).done(function () {
                            _this.renderLoginRecords($container);
                        });
                        break;
                    }
                    case 2:
                    {
                        this.recordVM.fetchUserManageRecords(userId, beginTime, endTime).done(function () {
                            _this.renderUserManageRecords($container);
                        });
                        break;
                    }
                    case 3:
                    {
                        this.recordVM.fetchPageManageRecords(userId, beginTime, endTime).done(function () {
                            _this.renderPageManageRecords($container);
                        });
                        break;
                    }
                }
            } else {
                if (isWinFlag) {
                    $("#userAllRecord").hide();
                }
            }
        }
    };
    return UserManagerController;
})();
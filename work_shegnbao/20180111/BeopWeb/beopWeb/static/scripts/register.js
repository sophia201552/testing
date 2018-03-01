// register.js
var Register = (function () {
    var _this;

    function Register() {
        _this = this;
        _this.timer = null;
    }

    Register.prototype.show = function () {
        LoadingAnimationStep = 'end'; //停止并销毁首页动画
        WebAPI.get('/static/views/observer/register.html').done(function (resultHtml) {
            $("body").empty().html(resultHtml);
            _this.$captchaInput = $("#captchaInput");
            _this.$captchaBtn = $("#captchaBtn");
            I18n.fillArea($("#regWrapper"));
            $("#regNow").off().click(function () {
                var $info = $("#regInfo"),
                    nameVal = $("#regUserName").val().trim(),
                    pwdVal = $("#regPwd").val().trim(),
                    pwdConfirmVal = $("#regPwdConfirm").val().trim(),
                    captchaVal = _this.$captchaInput.val().trim();
                /*if (nameVal == '') {
                    $info.text(i18n_resource.admin.register.ACCOUNT_REQUIRED).show();
                    return;
                } else {
                    if (!(/^\d{8,15}$/.test(nameVal) || /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(nameVal))) {
                        $info.text(i18n_resource.admin.register.ACCOUNT_ERROR_INFO_EMAIL).show();
                        return;
                    }
                }*/
                if (pwdVal == '') {
                    $info.text(i18n_resource.admin.register.PASSWORD_REQUIRED).show();
                    return;
                } else if (!(/^\S{8,}$/.test(pwdVal))) {
                    $info.text(i18n_resource.admin.register.CORRECT_PASSWORD_INFO).show();
                    return;
                } else if (!(/[a-zA-Z]+/.test(pwdVal) && /\d+/.test(pwdVal))) {
                    $info.text(i18n_resource.admin.register.CORRECT_PASSWORD_MES).show();
                    return;
                }

                if (pwdConfirmVal == '') {
                    $info.text(i18n_resource.admin.register.CONFIRM_PASSWORD_REQUIRED).show();
                    return;
                } else if (pwdConfirmVal != pwdVal) {
                    $info.text(i18n_resource.admin.register.PASSWORD_REQUIRED_EQUALLY).show();
                    return;
                }

                if (captchaVal == '') {
                    $info.text(i18n_resource.admin.register.VERIFY_CODE_REQUIRED).show();
                    return;
                }

                $info.text('').hide();

                WebAPI.post('/register_new_user', {
                    'account': nameVal,
                    'password': pwdVal,
                    'captcha': captchaVal
                }).done(function (result) {
                    if (result && result.success) {
                        location.href = "/observer";
                    } else {
                        if (result.code) {
                            alert(i18n_resource.admin.register[result.code]);
                        }
                    }
                }).always(function () {
                    Spinner.stop();
                });

            });

            $("#regCancel").off().click(function (e) {
                location.href = "/observer";
            });

            _this.$captchaBtn.off().click(function (e) {
                _this.captcha();
            });
        });
    };

    Register.prototype.captcha = function () {
        var accountVal = $("#regUserName").val().trim();
        var $info = $("#regInfo");
        if (!accountVal) {
            alert(i18n_resource.admin.register.ACCOUNT_REQUIRED);
            return;
        } else {
            if (!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(accountVal)) {
                $info.text(i18n_resource.admin.register.ACCOUNT_ERROR_INFO_EMAIL).show();
                return;
            }
        }
        WebAPI.post('/admin/verifyCode', {
            "account": accountVal
        }).done(function (result) {
            if (result.success) {
                var $captchaInfo = $("#captchaInfo");
                _this.$captchaBtn.hide();
                $captchaInfo.show();
                _this.timer && clearInterval(_this.timer);
                _this.timer = setInterval(function () {
                    var $time = $("#captchaTime");
                    var val = parseInt($time.text());
                    if (val > 0) {
                        $time.text(val - 1);
                    } else {
                        clearInterval(_this.timer);
                        $time.text(60);
                        _this.$captchaBtn.show();
                        $captchaInfo.hide();
                    }
                }, 1000);
            } else {
                alert(i18n_resource.admin.register[result.msg]);
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    Register.prototype.close = function () {

    };

    return Register;
}());

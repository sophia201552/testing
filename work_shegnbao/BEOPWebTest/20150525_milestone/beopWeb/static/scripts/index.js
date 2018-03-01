/// <reference path="../lib/jquery-1.11.1.min.js" />

var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenModal = undefined;                                   //共用弹出框中，加载对象的引用。若模块有私有弹出框，无需赋值。
var ScreenPrevious = undefined;                                //前一页面对象的引用
var ToolCurrent = undefined;
var Spinner = new LoadingSpinner({color: '#00FFFF'});        //等待加载时的转圈圈
//var navigation = responsiveNav("#navbar-collapse");          //响应式导航条
var AppConfig = {
    projectId: undefined,
    projectName: undefined,
    userId: undefined,
    account: undefined,
    level: undefined,
    projectList: undefined,
    isMobile: false
}; //配置文件
var I18n = undefined;                                          //国际化对象的引用
// background workers
var BackgroundWorkers = {};

$(document).ready(function () {
    //whether is running with mobile device.
    if (navigator.userAgent.match(/iP(ad|hone|od)/i)) AppConfig.isMobile = true;

    ElScreenContainer.innerHTML = '';
    $("#ulPages").hide();
    InitI18nResource(navigator.language.split('-')[0]);
});

var IndexScreen = (function () {
    function IndexScreen() {
    };

    IndexScreen.prototype = {
        show: function () {
            this.init();
        },

        close: function () {
            //remove key down event in login page
            document.onkeydown = false;
            this.closeBgEffect();
        },

        init: function () {
            var _this = this;
            this.closeBgEffect();
            $(ElScreenContainer).html("");
            $("#containerBackground").remove();

            $("#navHomeLogo").off('click').click(function (e) {
                ScreenManager.show(PaneProjectSelector);
            });

            $.get("/static/views/observer/login.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.initLogin();
                _this.initRegister();
                _this.initResetPassword();


                //init index page event
                $("#aHome").off('click').click(function (e) {
                    $("#ulLogin li").removeClass("active");
                    e.currentTarget.classList.add("active");
                    _this.init();
                });
                $("#aHomeCases").off('click').click(function (e) {
                    $("#ulLogin li").removeClass("active");
                    e.currentTarget.classList.add("active");
                    $.get("/static/views/admin/homeCases.html").done(function (resultHtml) {
                        _this.closeBgEffect();
                        $(ElScreenContainer).html(resultHtml);
                    });
                });
                $("#aHomeMobile").off('click').click(function (e) {
                    $("#ulLogin li").removeClass("active");
                    e.currentTarget.classList.add("active");
                    $.get("/static/views/admin/homeMobile.html").done(function (resultHtml) {
                        _this.closeBgEffect();
                        $(ElScreenContainer).html(resultHtml);
                    });
                });
                $("#aHomeCompany").off('click').click(function (e) {
                    window.location.href = "http://www.rnbtech.com.hk/";
                });
                $("#aProductDownload").off('click').click(function (e) {
                    //ScreenManager.show(ProductDownload);
                });
                $("#selectLanguage a").off('click').click(function (e) {
                    _this.closeBgEffect();
                    InitI18nResource(e.currentTarget.attributes.value.value, true);
                    e.preventDefault();
                });

                $(".login-feature-pane > div").hover(
                    function (e) {
                        document.getElementsByName('div-img-default')[0].style.display = 'none';
                        var element = document.getElementsByName(e.currentTarget.className.replace('grow login-', 'div-img-'))[0];
                        element.style.display = 'block';
                    },
                    function (e) {
                        document.getElementsByName('div-img-default')[0].style.display = 'block';
                        var element = document.getElementsByName(e.currentTarget.className.replace('grow login-', 'div-img-'))[0];
                        element.style.display = 'none';
                    }
                );

                I18n.fillArea($('#navPane'));
                $("#navPane").parent().fadeIn(400);
            });
        },

        initLogin: function () {
            this.restorePwd();

            var _this = this;

            $("#btnLogin").click(function (e) {
                _this.login();
            });
            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) {
                    _this.login();
                }
            };
            I18n.fillArea($('#paneLogin'));
            $('#txtName').attr('placeholder', I18n.resource.admin.login.PANE_PLACEHOLDER_ACCOUNT);
            $('#txtPwd').attr('placeholder', I18n.resource.admin.login.PANE_PLACEHOLDER_PWD);
        },

        initResetPassword: function () {

            var $resetModal = $('#resetPasswordModal'),
                $passwordResetBtn = $('#passwordResetBtn'),
                $inputEmail = $resetModal.find('#inputEmail'),
                isValidEmail,
                addValidStatus,
                removeValidStatus,
                errorTooltip;

            addValidStatus = function (msg) {
                errorTooltip = $inputEmail.tooltip({
                    container: 'body',
                    placement: "right",
                    trigger: "manual",
                    template: '<div class="tooltip" role="tooltip">' +
                    '<div class="tooltip-arrow" style="border-right-color: rgb(165, 42, 42);"></div>' +
                    '<div class="tooltip-inner" style="background-color: rgb(165, 42, 42);"></div>' +
                    '</div>',
                    html: true,
                    title: (msg || '')
                })
                errorTooltip.tooltip('show');
            };
            removeValidStatus = function () {
                errorTooltip && errorTooltip.tooltip('destroy');
            };

            isValidEmail = function (email) {
                if (!email) {
                    return false;
                }
                return RegExp('^[a-zA-Z0-9_-|\\.]+@[a-zA-Z0-9_-]+(?:\\.[a-zA-Z0-9_-]+)+$', 'g').test(email);
            };

            $inputEmail.on('keydown', removeValidStatus);

            $resetModal.on('shown.bs.modal', function () {
                $inputEmail.val($('#txtName').val());
            }).on('hide.bs.modal', function () {
                removeValidStatus();
            });

            $passwordResetBtn.click(function () {
                if (!$inputEmail.val()) {

                    addValidStatus(I18n.resource.observer.widgets.EMAIL_ADDRESS_REQUIRED);
                    return false;
                }

                if (!isValidEmail($inputEmail.val())) {
                    addValidStatus(I18n.resource.observer.widgets.INVALID_EMAIL_ADDRESS);
                    return false;
                }
                $passwordResetBtn.button('loading');
                WebAPI.post('/send_reset_pwd_email', {
                    email: $inputEmail.val(),
                    serverURL: location.origin
                }).done(function (result) {
                    if (result === 'success') {
                        $passwordResetBtn.button('complete');
                        $passwordResetBtn.addClass('btn-success');
                        setTimeout(function () {
                            $passwordResetBtn.button('reset').removeClass('btn-success').removeAttr('disabled');
                        }, 3000);
                    } else {
                        if (result === 'email was sent') {
                            addValidStatus(I18n.resource.observer.widgets.EMAIL_PASSWORD_SENT + '！');
                        } else if (result === "email is not exist") {
                            addValidStatus(I18n.resource.observer.widgets.EMAIL_NOT_EXIST + '！');
                        }
                        $passwordResetBtn.button('reset');
                    }
                }).fail(function () {
                    addValidStatus(I18n.resource.observer.widgets.EMAIL_FAILED_SEND);
                    $passwordResetBtn.button('reset');
                });
            });
        },

        initRegister: function () {
            var _this = this;
            var $iptMailAddr = $('#iptMailAddr');
            var $panes = $('#regContent').find('.modal-body');
            var util = {
                panes: {
                    show: function (index) {
                        $panes.hide();
                        $panes.eq(index).show();
                    }
                },
                tooltip: {
                    show: function ($ele, cnt, delay) {
                        $ele.attr('data-original-title', cnt);
                        $ele.tooltip('show');
                        if ($ele[0].timer) {
                            window.clearTimeout($ele[0].timer);
                            $ele[0].timer = null;
                        }
                        $ele[0].timer = window.setTimeout(function () {
                            $ele.tooltip('hide');
                        }, delay || 3000);
                    },
                    hide: function ($ele) {
                        $ele.tooltip('hide');
                    }
                },
                mail: {
                    changeStatus: function (mail, status, msg) {
                        var $tipWrap = $('#mailTipWrap'),
                            $tip = $tipWrap.children('span').eq(1),
                            $links = $('#mailLinksWrap').children('a'),
                            $linkReturn = $links.eq(0),
                            $linkMail = $links.eq(1),
                            $icon = $tipWrap.find('.glyphicon').eq(0),
                            cls = $icon.attr('class').replace(/\s*\b(?:glyphicon-).+?\b\s*/, ' ').trim();
                        var mailhost = null;
                        $icon.attr('class', cls);
                        $tip.text(msg);
                        switch (status) {
                            case 'success':
                                $tipWrap.addClass('txt-success');
                                $icon.addClass('glyphicon-ok');
                                $linkReturn.show();
                                mailhost = this.getMailHost(mail);
                                mailhost && $linkMail.attr('href', 'http://'+mailhost).show();
                                break;
                            case 'warn':
                                $tipWrap.addClass('txt-warning');
                                $icon.addClass('glyphicon-alert');
                                $linkReturn.show();
                                mailhost = this.getMailHost(mail);
                                mailhost && $linkMail.attr('href', 'http://'+mailhost).show();
                                break;
                            case 'error':
                                $tipWrap.addClass('txt-danger');
                                $icon.addClass('glyphicon-remove');
                                $linkReturn.show();
                                $linkMail.hide();
                                break;
                            default:
                                $tipWrap.removeClass('txt-danger txt-success');
                                $icon.addClass('glyphicon-exclamation-sign');
                                $linkReturn.show();
                                $linkMail.hide();
                                break;
                        }
                    },
                    getMailHost: function (mail) {
                        var str = mail.split('@')[1].toLowerCase();
                        switch(str) {
                            case '163.com':
                                return 'mail.163.com';
                            case 'vip.163.com':
                                return 'vip.163.com';
                            case 'mail.126.com':
                                return 'mail.126.com';
                            case 'qq.com':
                            case 'vip.qq.com':
                            case 'foxmail.com':
                                return 'mail.qq.com';
                            case 'gmail.com':
                                return 'mail.google.com';
                            case 'sohu.com':
                                return 'mail.sohu.com';
                            case 'tom.com':
                                return 'mail.tom.com';
                            case 'vip.sina.com':
                                return 'vip.sina.com';
                            case 'sina.com.cn':
                            case 'sina.com':
                                return 'mail.sina.com.cn';
                            case 'yahoo.com.cn':
                            case 'yahoo.cn':
                                return 'mail.cn.yahoo.com';
                            case 'yeah.net':
                                return 'www.yeah.net';
                            case '21cn.com':
                                return 'mail.21cn.com';
                            case 'hotmail.com':
                                return 'www.hotmail.com';
                            case 'sogou.com':
                                return 'mail.sogou.com';
                            case '188.com':
                                return 'www.188.com';
                            case '139.com':
                                return 'mail.10086.cn';
                            case '189.cn':
                                return 'webmail15.189.cn/webmail';
                            case 'wo.com.cn':
                                return 'mail.wo.com.cn/smsmail';
                            case 'rnbtech.com.hk':
                                return 'mail.rnbtech.com.hk';
                            default:
                                return false;
                        }
                    }
                },
                inputbox: {
                    changeStatus: function($ele, status) {
                        var $wrap = $ele.parentsUntil('.form-group'),
                            $icon = $wrap.find('.glyphicon').eq(0),
                            cls = $icon.attr('class').replace(/\s*\b(?:glyphicon-).+?\b\s*/, ' ').trim();
                        $icon.attr('class', cls);
                        switch(status) {
                            case 'success':
                                $wrap.addClass('has-success');
                                $icon.addClass('glyphicon-ok');
                                break;
                            case 'error':
                                $wrap.addClass('has-error');
                                $icon.addClass('glyphicon-remove');
                                break;
                            case 'default':
                            default:
                                $wrap.removeClass('has-error has-success');
                                $icon.addClass('glyphicon-pencil');
                                break;
                        }
                    }
                }
            };

            // initialize the tooltip
            $iptMailAddr.tooltip({title: '', trigger: 'manual'});

            $('#btnRegister').click(function () {
                util.inputbox.changeStatus($iptMailAddr, 'default');
                $('#regContent').modal('show');
            });

            $('#mailReinput').click(function () {
                util.panes.show(0);
            });

            $('#userSave').click(function () {
                var addr = $iptMailAddr.val().trim();
                var $this = $(this);
                var $mailLoadingWrap = $('#mailLoadingWrap');
                var $mailRstWrap = $('#mailRstWrap');
                if (!addr) {
                    util.tooltip.show($iptMailAddr, '邮箱地址不能为空！');
                    util.inputbox.changeStatus($iptMailAddr, 'error');
                    return;
                }
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(addr)) {
                    util.tooltip.show($iptMailAddr, '邮箱格式有误！');
                    util.inputbox.changeStatus($iptMailAddr, 'error');
                    return;
                }
                ;
                util.inputbox.changeStatus($iptMailAddr, 'default');
                // disable button
                $this.prop('disabled', true);
                // show loading
                util.panes.show(1);

                // send email
                // prevent multi click
                WebAPI.post('/apply_for_registration', {
                    email: addr,
                    server_url: window.location.origin
                }).done(function (rs) {
                    rs = JSON.parse(rs);
                    var tips = '';
                    var s = 'success';
                    var status = rs.status;
                    switch(status) {
                        // success
                        case 0:
                            s = 'success';
                            tips = '邮件已经成功发送至您的邮箱，10分钟内有效，请您及时访问注册！';
                            break;
                        // registed
                        case -1:
                            s = 'error';
                            tips = '该邮箱地址已经被注册过，请直接登录！';
                            break;
                        // already sent
                        case -2:
                            s = 'warn';
                            tips = '邮件已经发送，10分钟内不能重发，请检查您的邮箱！';
                            break;
                        // error
                        case -3:
                        default:
                            s = 'error';
                            tips = '邮件发送失败，可能是网络故障，请稍后重试！';
                            break;
                    }
                    util.mail.changeStatus(addr, s, tips);
                }).fail(function (err) {
                    util.mail.changeStatus(addr, 'error', '邮件发送失败，可能是网络故障，请稍后重试！');
                }).always(function () {
                    // show result
                    util.panes.show(2);
                    $this.prop('disabled', false);
                });
            });
        },

        login: function () {
            var _this = this;
            Spinner.spin($("#rowLogin .panel-body")[0]);
            WebAPI.post("/login", {name: $("#txtName").val(), pwd: $("#txtPwd").val()}).done(function (_result) {
                Spinner.stop();
                var result = JSON.parse(_result);
                if (result.status != undefined && result.status == true) {
                    if (result.userProfile.isManager == 0) {
                        $("#btnMemberManage").remove();
                        $("#btnPermissionManage").remove();
                    }
                    if (result.projects && result.projects.length > 0) {
                        _this.rememberPwd();
                        AppConfig.userId = result.id;
                        AppConfig.account = $("#txtName").val();
                        AppConfig.projectList = result.projects;
                        AppConfig.userProfile = result.userProfile;

                        ScreenManager.show(PaneProjectSelector);

                        //history.pushState(null, null, "/observer#/chose_project");
                    } else {
                        new Alert($("#rowLogin .panel-body"), "danger", "<strong>" + I18n.resource.observer.widgets.LOAD_PROJECT_FAILED + "</strong>" + I18n.resource.observer.widgets.NO_PERMISSION_PROJECT + "！").show().close();
                    }
                } else {
                    new Alert($("#rowLogin .panel-body"), "danger", "<strong>" + I18n.resource.observer.widgets.LOG_IN_FAILED + "</strong>" + I18n.resource.observer.widgets.INVALID_ACCOUNT_PASSWORD + "！").show().close();
                }
            })
        },

        closeBgEffect: function () {
            isRunningBG = false;
            container = null;
            camera = null, scene = null, renderer = null;
            mesh = null, geometry = null, material = null;

            mouseX = 0, mouseY = 0;
            start_time = null;

            windowHalfX = null;
            windowHalfY = null;
            document.removeEventListener("mousemove", function () {
            });
            $("#containerBackground").remove();
        },

        rememberPwd: function () {
            if ($("#cbRememberPwd").is(":checked")) {
                //TODO: SHA1
                localStorage["userInfo"] = JSON.stringify({name: $("#txtName").val(), pwd: $("#txtPwd").val()});
            }
            else {
                localStorage.removeItem("userInfo");
            }
        },

        restorePwd: function () {
            if (localStorage["userInfo"]) {
                var data = JSON.parse(localStorage["userInfo"]);
                if (data.pwd && data.pwd != "") {
                    $("#cbRememberPwd").attr("checked", true);
                    $("#txtName").val(data.name);
                    $("#txtPwd").val(data.pwd);
                }
            }
        }
    }

    return IndexScreen;
})();


//load language
function InitI18nResource(strLanguage, isForce) {
    if (strLanguage == '') return;

    if (isForce) {
        localStorage["isUserSelectedLanguage"] = strLanguage;
    }
    else if (localStorage["isUserSelectedLanguage"]) {
        strLanguage = localStorage["isUserSelectedLanguage"];
    }

    //TODO
    //if ((!localStorage["i18n"]) || localStorage["language"] != strLanguage) {
    //    $.getScript("/static/scripts/i18n/" + strLanguage + ".js")
    //        .done(function (e) {
    //            localStorage["language"]= strLanguage;
    //            localStorage["i18n"]= JSON.stringify(i18n_resource);
    //            Init();
    //        })
    //        .error(function (e) {
    //            if (!localStorage["i18n"]) {
    //                $.getScript("/static/scripts/i18n/en.js").done(function (e) {
    //                    localStorage["language"]= "en";
    //                    localStorage["i18n"]= JSON.stringify(i18n_resource);
    //                    Init();
    //            })
    //        }
    //    });
    //}
    //else {
    //else {
    //    Init();
    //}

    $.getScript("/static/views/js/i18n/" + strLanguage + ".js")
        .done(function (e) {
            localStorage["language"] = strLanguage;
            localStorage["i18n"] = JSON.stringify(i18n_resource);
            Init();
        })
        .error(function (e) {
            if (!localStorage["i18n"]) {
                $.getScript("/static/views/js/i18n/en.js").done(function (e) {
                    localStorage["language"] = "en";
                    localStorage["i18n"] = JSON.stringify(i18n_resource);
                    Init();
                })
            }
        });
};

function Init() {
    I18n = new Internationalization();
    //new IScreen(IndexScreen).show();
    ScreenManager.show(IndexScreen);
    I18n.fillArea($("#ulLogin").parent());
}

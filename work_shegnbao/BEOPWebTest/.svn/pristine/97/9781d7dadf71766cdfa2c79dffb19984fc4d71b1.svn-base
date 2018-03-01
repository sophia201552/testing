/// <reference path="../lib/jquery-2.1.4.min.js" />
/// <reference path="../lib/jquery-2.1.4.min.js" />

var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var SpinnerContainer = document.getElementById('divSpinner');  //Spinner容器
var AlertContainer = document.getElementById('divAlert');      //Alert容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenPrevious = undefined;                                //前一页面对象的引用
var Spinner = new LoadingSpinner({ color: '#00FFFF' });        //等待加载时的转圈圈
//var navigation = responsiveNav("#navbar-collapse");          //响应式导航条
var AppConfig = {
    userId: undefined,
    account: undefined,
    isMobile: true,
    roomId:undefined
}; //配置文件
var roomAll = undefined;
var curRoom = undefined;
var spaceAll = undefined;
var ctrAll = undefined;
var sensorAll = undefined;
var I18n = undefined;                                          //国际化对象的引用
var BomConfig = {
};
// 项目配置信息持久化存储管理
var appConfigManager = (function () {

    var DEFAULT_CONFIG = {
        // 默认 gps 为关闭状态
        gps: 0
        // ...
    };

    function get() {
        var options = window.localStorage.getItem('appConfig');

        if(options === null) {
            set(DEFAULT_CONFIG);
            return DEFAULT_CONFIG;
        }

        try { options = JSON.parse(options); } catch(e) {}

        return options;
    }

    function set(options) {
        window.localStorage.setItem( 'appConfig', JSON.stringify(options) );
    }

    return {
        get: get,
        set: set
    }

} ());

$(document).ready(function () {
    if (navigator.userAgent.match(/iP(ad|hone|od)|Android/i)) AppConfig.isMobile = true;

    InitI18nResource(navigator.language.split('-')[0],null,'static/views/js/i18n/').always(function (rs) {
        I18n = new Internationalization(null, rs);
        Init();
    });
});
document.addEventListener('deviceready',onDeviceReady,false);
function onDeviceReady() {
    AppConfig.device = device;
    document.addEventListener("backbutton", router.back, false);
    document.addEventListener("offline", function(){
        window.plugins.toast.show('网络连接不可能，部分功能可能受影响', 'short', 'bottom');
    }, false);
    document.addEventListener("online", function(){
        window.plugins.toast.show('网络已连接', 'short', 'bottom');
    }, false);
}

var IndexScreen = (function () {
    function IndexScreen() {}

    IndexScreen.prototype = {
        show: function () {
            var _this = this;
            _this.time = 60;
            if (localStorage.getItem('beopHost')) {
                AppConfig.host = localStorage.getItem('beopHost')
            } else {
                AppConfig.host = 'http://beop.rnbtech.com.hk'
            }
            //$(ElScreenContainer).addClass('homePage');
            //判断是否需要输入账号密码等
            if (localStorage.getItem('userInfo') && typeof JSON.parse(localStorage.userInfo).name != 'undefined' && JSON.parse(localStorage.userInfo).name !='undefined') {
                _this.initNav();
                _this.login(true);
            } else {
                //TODO
                //如果需要登录，获取登录页面
                //$.ajax({url: 'static/app/temperatureControl/views/admin/login.html'}).done(function (resultHTML) {
                //    $('#indexMain').html(resultHTML);
                //    _this.init();
                //    $('#registerPerson').off('click').click(function () {
                //        WebAPI.get('/static/app/temperatureControl/views/admin/register.html').done(function (result) {
                //            $('#indexMain').empty().html(result);
                //            _this.veriCode();
                //        });
                //    });
                //});
                _this.loginLoad();
            }
            if (!BomConfig.height) {
                BomConfig.height = $(window).height() + 'px';
            }
        },
        loginLoad: function () {
            //TODO
            //如果需要登录，获取登录页面
            var _this = this;
            $.ajax({ url: 'static/app/temperatureControl/views/admin/login.html' }).done(function (resultHTML) {
                $('#indexMain').empty().html(resultHTML);
                _this.init();
                $('#registerPerson').off('click').click(function () {
                    WebAPI.get('/static/app/temperatureControl/views/admin/register.html').done(function (result) {
                        $('#indexMain').empty().html(result);
                        _this.veriCode();
                    });
                });
            });
        },
        close: function () {
            //remove key down event in login page
            document.onkeydown = false;
            this.time = null;
        },

        init: function () {
            var _this = this;
            $(ElScreenContainer).css({
                'height': '100%',
                'top': 0
            });
            CssAdapter.adapter({bottom:false,top:false});
            _this.initNav();
            _this.initLogin();
            _this.initLanguage();
        },

        initLogin: function () {
            var _this = this;

            //登录按键初始化
            $("#btnLogin").hammer().off('tap').on('tap', function (e) {
                _this.login();
            });
            $(document).on("keydown", "#divLogin input", function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) {
                    _this.login();
                }
            });
        },
        veriResponse: function (dom,callback) {
            var _this = this;
            if (_this.time == 0) {
                //dom.removeAtt("disabled");
                dom.html("<button id='repeatGetVeri'>重新获取</button>");
                _this.time = 60;
                callback();
            } else {
                //dom.attr("disabled", '');
                dom.html("<label>" + _this.time + "</label>s后重新发送");
                _this.time--;
                setTimeout(function () {
                    _this.veriResponse(dom,callback);
                },
                1000)
            }

        },
        veriCode: function () {
            var _this = this;
            var $veriCode = $('#veriCode');
            $('#isAgree').change(function () {
                if ($('#isAgree')[0].checked===true) {
                    $veriCode.removeAttr('disabled');
                } else {
                    $veriCode.attr('disabled', 'disabled');
                }
            });
            $('.loginPerson').off('click').click(function () {
                _this.loginLoad();
            });
            $veriCode.off('click').click(function () {
                var mobileNum = $('#userNum').val();
                var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;///^0{0,1}(13[0-9]|15[0-9])[0-9]{8}$/;
                var $wrongInfo = $('#wrongInfo');
                if (mobileNum == "") {
                    new Alert($wrongInfo, "danger", '请填写手机号码！').show(1000).close();
                    return;
                }
                if (mobileNum.length != 11) {
                    new Alert($wrongInfo, "danger", '手机号码为11位数字！请正确填写！').show(1000).close();
                    return;
                }
                if (!reg.test(mobileNum)||isNaN(mobileNum)) {
                    new Alert($wrongInfo, "danger", '您的手机号码不正确，请重新输入！').show(1000).close();
                    return;
                }
                WebAPI.post('/user/checknewphone', { phone: mobileNum }).then(function (result) {
                    if (result.data === true) {
                        $('#vericodePage').hide();
                        $('#passwordPage').show();
                        //重新发送验证码倒计时
                        _this.veriResponse($('.repeatGet'), repeatVeri);
                        function repeatVeri() {
                            //重新获取验证码
                            $('#repeatGetVeri').off('click').click(function () {
                                _this.veriResponse($('.repeatGet'), repeatVeri);
                                WebAPI.post('/user/checknewphone', { phone: mobileNum }).then(function (result) {

                                })
                            });
                        }
                        $('#submitRegister').off('click').click(function () {
                            var userVeriCode = $('#userVeriCode').val();
                            var userPassword = $('#userPassword').val();
                            var $wrongInfot = $('#wrongInfot');
                            var sexSelectVal = $('#sexSelect').val();
                            if (userVeriCode === '' || userPassword === '') {
                                new Alert($wrongInfot, "danger", '请填写完整！').show(1000).close();
                                return;
                            }
                            if (userPassword.length < 6) {
                                new Alert($wrongInfot, "danger", '请至少设置6位密码！').show(1000).close();
                                return;
                            }
                            WebAPI.post('/user/adduserbyphone', { phone: mobileNum, password: userPassword, code: userVeriCode, sex: sexSelectVal }).then(function (result) {
                                if (result.data === true) {
                                    if (typeof cordova != 'undefined') {
                                        cordova.plugins.barcodeScanner.scan(
                                            function (result) {
                                                console.log("We got a barcode\n" +
                                                    "Result: " + result.text + "\n" +
                                                    "Format: " + result.format + "\n" +
                                                    "Cancelled: " + result.cancelled);
                                                //todo
                                                    var postData = {
                                                        tokenId: result.text,
                                                        userId: AppConfig.userId
                                                    }
                                                    WebAPI.post('/appTemperature/token/corelateRoom', postData).done(function(){

                                                    });
                                                //_this.relateRoom(result.text);
                                            },
                                            function (error) {
                                                console.log("Scanning failed: " + error);
                                            }
                                        );
                                    } else {

                                    }
                                } else {
                                    new Alert($wrongInfot, "danger", '验证码错误，请重新输入！').show(1000).close();
                                }
                            })
                        });
                    } else {
                        new Alert($wrongInfo, "danger", '手机号码已经注册，请登录！').show(1000).close();
                    }
                });
            });
        },
        initLanguage: function () {
            I18n.fillArea($('#divAppDashboardLanguage'));
            I18n.fillArea($('#divLoginInfo'));
            $("#selectLanguage a").off('click').click(function (e) {
                //InitI18nResource(e.currentTarget.attributes.value.value, true);
                InitI18nResource(e.currentTarget.attributes.value.value, true).always(function (rs) {
                    I18n = new Internationalization(null, rs);
                    Init();
                });
                e.preventDefault();
            });
        },

        //登录功能
        login: function (isRestorePwd) {
            var _this = this;
            //失败提醒
            SpinnerControl.show();
            var loginFail = function (msg) {
                $('.alert').remove();
                new Alert($("#divAlert"), "danger", msg).show().close();
                SpinnerControl.hide();
                localStorage.removeItem('userInfo')
                router.empty().to({typeClass:IndexScreen});
            };
            if(isRestorePwd){
                var userName = JSON.parse(localStorage.userInfo).name, password = JSON.parse(localStorage.userInfo).pwd;
            }else {
                var $btnLogin = $('#btnLogin');
                var userName = $("#userName").val(), password = $("#password").val();
                this.rememberPwd();
                if (!(userName || password)) {
                    loginFail('用户名密码不存在！');
                    return;
                }
            }

            WebAPI.post("/login", {
                name: userName,
                pwd: password,
                agent: jscd ? jscd : {}
            }).then(function (login_result) {
                try {
                    var after_login = function () {
                        CssAdapter.adapter({bottom:false});
                        if (login_result.status != undefined && login_result.status == true) {
                            //if (login_result.projects && login_result.projects.length > 0) {
                                //_this.rememberPwd();
                                AppConfig.userId = login_result.id;
                                AppConfig.account = $("#userName").val();

                                ////获取用户roomList
                                //WebAPI.get('/appTemperature/room/getlist/' + AppConfig.userId).done(function (rs) {
                                //    roomAll = rs.roomList;
                                    router.empty().to({
                                        typeClass: ObserverScreen,
                                        data: {}
                                    });
                                //}).fail(function () {
                                //
                                //});
                            /*} else {
                                loginFail("登录失败，没有任何项目的权限！");
                            }*/
                        } else {
                            loginFail("用户名或密码错误！");
                        }
                    }
                } catch (e) {
                    loginFail("登录失败！");
                    return false;
                }

                after_login();

            }).always(function () {
                Spinner.stop();
            })
        },

        rememberPwd: function () {
            //TODO: SHA1
            localStorage["userInfo"] = JSON.stringify({name: $("#userName").val(), pwd: $("#password").val()});
        },

        restorePwd: function () {
            if (localStorage["userInfo"]) {
                var data = JSON.parse(localStorage["userInfo"]);
                if (data.pwd && data.pwd != "") {
                    $("#userName").val(data.name);
                    $("#password").val(data.pwd);
                }
            }
        },

        initNav: function () {
            // 后退按钮
            $('#btnBack', '#navTop').off('touchstart').on('touchstart', function (e) {
                router.back();
            });

            // 地图选择按钮
            $('#btnRoomSel', '#navBottom').off('touchstart').on('touchstart', function (e) {
                router.to({
                    typeClass: ProjectSel
                });
                e.preventDefault();
            });
        }
    };
    return IndexScreen;
})();

function Init(){
    //router.to({
    //    typeClass: IndexScreen,
    //    data: {}
    //});
    //I18n = new Internationalization();

    ScreenManager.show(IndexScreen);
    I18n.fillArea($("#navBottom"));
}

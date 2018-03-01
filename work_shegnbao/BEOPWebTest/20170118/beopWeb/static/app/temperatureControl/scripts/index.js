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
    roomId:undefined,
    roomInit:true
}; //配置文件
var roomAll = undefined;
var mapConfig = undefined;
var curRoom = undefined;
var spaceAll = undefined;
var ctrAll = undefined;
var sensorAll = undefined;
var I18n = undefined;                                          //国际化对象的引用

var i18n_resource = undefined;
var BomConfig = BomConfig || {};
var Push,File;

var VersionManage = undefined;
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

if(typeof cordova == 'undefined') {
    $(document).ready(onReady);
}else {
    document.addEventListener('deviceready', onReady, false);
}

function onReady() {
    setDeviceConfig();
    attachEvent();
    setInitAction();
    InitI18nResource(AppConfig.language, true, 'static/app/temperatureControl/views/i18n/').always(function (rs) {
        I18n = new Internationalization(null, rs);
        Init();
    });
}
function setInitAction(){
    navigator.splashscreen && navigator.splashscreen.hide(); //关闭加载页
    CssAdapter.adapter();//初始化导航条高度
}
function setDeviceConfig(){
    AppConfig.landscape = window.innerWidth > window.innerHeight; //是否横屏
    AppConfig.isLocalMode = false;//是否采用本地版

    if (navigator.userAgent.match(/iP(ad|hone|od)|Android/i)) AppConfig.isMobile = true; //是否移动端

    typeof device != 'undefined' ?AppConfig.device = device:{}; //设备插件

    //网络连接状态
    if(navigator.connection) {
        AppConfig.isOnline = navigator.connection.type == 'Connection.NONE';
        AppConfig.network = navigator.connection.type
    }else{
        AppConfig.isOnline = true;
        AppConfig.network = 'PC'
    }

    //语言设置
    try {
        AppConfig.language = localStorage.getItem('language');
        if(!AppConfig.language){
            AppConfig.language = navigator.language.split('-')[0];
        }
    }catch(e){
        AppConfig.language = 'zh'
    }

    //host设置
    if (localStorage.getItem('beopHost')) {
        AppConfig.host = localStorage.getItem('beopHost')
    } else {
        AppConfig.host = 'http://beop.rnbtech.com.hk'
    }
    AppConfig.host = 'http://beop.rnbtech.com.hk';

    //版本信息设置
    AppConfig.version = '1.1.10';
    VersionManage = new UpdateHelper('temperature',AppConfig.version,function(){});

    //推送设置
    setPushConfig();

    //本地数据库设置
    setDatabaseConfig();

    //本地文件设置
    setFileConfig();
}

function setPushConfig(){
    //推送
    Push = new PushWidget();
    Push.init();
    Push.onReceiveMessage(function(){
        if (Push.getPushInfo().receiveMsg.message){
            var msg;
            try {
                msg = JSON.parse(Push.getPushInfo().receiveMsg.message);
            }catch(e){
                msg = null;
            }
            if (msg instanceof Array && msg.length > 0) {
                localStorage.setItem('newPushMsg', JSON.stringify(msg));
            }
        }
    });
}
function setDatabaseConfig(){

}
function setFileConfig(){
    File = new FileStorage('BeOPTemperature')
}
function attachEvent(){
    document.addEventListener("backbutton", router.back, false);
    document.addEventListener("offline", function(){
        AppConfig.isOnline = false;
        window.plugins.toast.show(I18n.resource.admin.index.CHECH_INFO_ONE, 'short', 'bottom');
    }, false);
    document.addEventListener("online", function(){
        AppConfig.isOnline = true;
        window.plugins.toast.show(I18n.resource.admin.index.CHECH_INFO_TWO, 'short', 'bottom');
    }, false);
}

var IndexScreen = (function () {
    function IndexScreen() {
        this.telTemp = undefined;//为了暂时记住输入的手机号
        this.registerPageHTML = undefined;//为注册页面的后退按钮做下缓存
    }

    IndexScreen.prototype = {
        show: function () {
            var _this = this;
            Push.stop();
            _this.time = 60;
            _this.isRunning = false;
            _this.monileNums = undefined;
            //判断是否需要输入账号密码等
            if (localStorage.getItem('userInfo') && typeof JSON.parse(localStorage.userInfo).name != 'undefined' && JSON.parse(localStorage.userInfo).name !='undefined') {
                _this.initNav();
                _this.login(true);
            } else {
                //TODO
                //如果需要登录，获取登录页面
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
                CssAdapter.adapter({bottom:false,top:false});
                $(ElScreenContainer).empty().html(resultHTML);
                I18n.fillArea($(ElScreenContainer));
                _this.init();
                $('#registerPerson').off('touchstart').on('touchstart',function () {
                    WebAPI.get('/static/app/temperatureControl/views/admin/register.html').done(function (result) {
                        $(ElScreenContainer).empty().html(result);
                        $('#spTitleR').attr('i18n', 'admin.index.REGISTER');
                        I18n.fillArea($(ElScreenContainer));
                        _this.veriCode();
                        
                        //为注册页面的后退按钮做下缓存
                        _this.registerPageHTML = result;
                        //绑定后退事件
                        $('#btnBackR').off('touchstart').on('touchstart', function () {
                            _this.isRunning = false;
                            _this.loginLoad();
                        })
                    });
                });

                $('#forgetPwd').off('touchstart').on('touchstart', function () {
                    //注册页面 样式暂时和注册页面一样
                    WebAPI.get('/static/app/temperatureControl/views/admin/register.html').done(function (result) {
                        $(ElScreenContainer).empty().html(result);
                        $('#spTitleR').attr('i18n', 'admin.index.FORGET_PASS');
                        I18n.fillArea($(ElScreenContainer));
                        _this.veriCode('forgetPwd');
                        //为忘记密码页面的后退按钮做下缓存
                        _this.registerPageHTML = result;
                        //绑定后退事件
                        $('#btnBackR').off('touchstart').on('touchstart', function () {
                            _this.isRunning = false;
                            _this.loginLoad();
                        })
                    });
                })
            });
        },
        close: function () {
            //remove key down event in login page
            document.onkeydown = false;
            this.time = null;
            this.isRunning = null;
            this.monileNums = null;
        },

        init: function () {
            var _this = this;
            $(ElScreenContainer).css({
                'height': '100%',
                'top': 0
            });
            $('#topBlank').hide();
            _this.initNav();
            _this.initLogin();
            _this.initLanguage();
        },

        initLogin: function () {
            var _this = this;

            //登录按键初始化
            //$("#btnLogin button").hammer().off('tap').on('tap', function (e) {
            //    _this.login();
            //});
            $("#btnLogin button").off('touchstart').on('touchstart', function (e) {
                var touchTargets = e.originalEvent.touches;
                if (touchTargets.length > 1) return;
                $(this).addClass('hover');
            });
            $("#btnLogin button").off('touchend').on('touchend', function (e) {
                var touchTargets = e.originalEvent.changedTouches;
                if (touchTargets.length > 1) return;
                $(this).removeClass('hover');
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
                dom.html("<button id='repeatGetVeri' i18n='admin.index.REPEAT_SEND'></button>");
                I18n.fillArea(dom);
                //_this.isRunning = false;
                _this.time = 60;
                callback();
            } else {
                //dom.attr("disabled", '');
                //_this.isRunning = true;
                dom.html("<span i18n='admin.index.REPEAT_SEND'></span><label>( " + _this.time + " )</label>");
                I18n.fillArea(dom);
                _this.time--;
                if( !_this.isRunning) {
                    dom.html("<button id='repeatGetVeri' i18n='admin.index.REPEAT_SEND'></button>");
                    I18n.fillArea(dom);
                    function repeatVeri() {
                            //重新获取验证码
                            $('#repeatGetVeri').off('click').on('click',function () {
                                _this.isRunning = true;
                                _this.time = 60;
                                _this.veriResponse($('.repeatGet'), repeatVeri);
                                WebAPI.post('/user/checknewphone', { phone: _this.monileNums }).then(function (result) {

                                }).always(function () {
                                    $('#submitRegister').removeAttr('disabled');
                                })
                            });
                        }
                    repeatVeri();
                    return;
                }
                setTimeout(function () {
                        _this.veriResponse(dom, callback);
                    },
                    1000)
            }

        },
        veriCode: function (type) {
            var _this = this;

            //忘记密码暂时样式
            if (type && type === "forgetPwd") {
                $('#registerPage .use-term').hide();
            }
            
            var $veriCode = $('#veriCode');
            var loginFail = function (msg) {
                $('.alert').remove();
                //new Alert($("#divAlert"), "danger", msg).show().close();
                window.plugins && window.plugins.toast.show(msg, 'short', 'center');
                console.log(msg);
                SpinnerControl.hide();
                localStorage.removeItem('userInfo');
                //router.empty().to({typeClass:IndexScreen});
            };
            //防止输入法遮挡输入框
            var h = $(window).height();
            $(window).off('resize').on('resize',function () {
                if ($(window).height() < h) {
                    $('#vericodePage').css('margin-top', '10px')
                } else {
                    $('#vericodePage').css('margin-top', 'calc(321px - 12.5rem)')
                }
                h = $(window).height();
            });

            //使用条款和隐私政策
            $(".userAgree").off('touchstart').on('touchstart', function () {
                //暂时保存刚刚输入的手机号
                _this.telTemp = $('#userNum').val();

                 WebAPI.get('/static/app/temperatureControl/views/admin/agreement.html').done(function (result) {
                     $('#indexMain').empty().html(result);
                     I18n.fillArea($('#indexMain'));
                    }).done(function(){
                         $('#btnBack', '.navTop').off('touchstart').on('touchstart', function (e) {
                            WebAPI.get('/static/app/temperatureControl/views/admin/register.html').done(function (result) {
                                $('#indexMain').empty().html(result);
                                $('#spTitleR').attr('i18n', 'admin.index.REGISTER');
                                I18n.fillArea($('#indexMain'));
                                _this.veriCode();
                                //恢复刚刚输入的手机号
                                _this.telTemp && $('#userNum').val(_this.telTemp);
                                $('#btnBackR').off('touchstart').on('touchstart', function () {
                                    _this.isRunning = false;
                                    _this.loginLoad();
                                });
                            });
                        });
                    });
            });
            //协议同意按钮
            $('#isAgree').off('click').click(function () {
                if ($(this).hasClass('selective')) {
                    $(this).removeClass('selective');
                    $veriCode.attr('disabled', 'disabled');
                } else {
                    $(this).addClass('selective');
                    $veriCode.removeAttr('disabled');
                }
            });
            $('.loginPerson').off('click').click(function () {
                _this.loginLoad();
            });
            //密码置空按钮
            $('.deletePass').off('click').click(function () {
                $('#userPassword').val('');
            });
            //性别选择事件
            $('#veriPage').find('.sexBox ').off('click').click(function () {
                var $this = $(this);
                var $sexList = $this.find('.sexList');
                if (!$sexList.hasClass('optionActive')) {
                    $sexList.addClass('optionActive');
                    $this .siblings('.sexBox').find('.sexList').removeClass('optionActive');
                }
            });
            $veriCode.off('click').click(function () {
                var mobileNum = $('#userNum').val();
                //暂时保存刚刚输入的手机号
                _this.telTemp = $('#userNum').val();
                var reg = /^1\d{10}$/;///^1[3|4|5|8][0-9]\d{4,8}$/;///^0{0,1}(13[0-9]|15[0-9])[0-9]{8}$/;
                var $wrongInfo = $('#wrongInfo');
                if (mobileNum == "") {
                    //new Alert($wrongInfo, "danger", I18n.resource.admin.index.NUM_INFO).show(1000).close();
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.index.NUM_INFO, 'short', 'center');
                    console.log(I18n.resource.admin.index.NUM_INFO);
                    return;
                }
                if (mobileNum.length != 11) {
                    //new Alert($wrongInfo, "danger", I18n.resource.admin.index.NUM_ERROR_INFO).show(1000).close();
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.index.NUM_ERROR_INFO, 'short', 'center');
                    console.log(I18n.resource.admin.index.NUM_ERROR_INFO);
                    return;
                }
                if (!reg.test(mobileNum)||isNaN(mobileNum)) {
                    //new Alert($wrongInfo, "danger", I18n.resource.admin.index.NUM_REPEAT_INTER).show(1000).close();
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.index.NUM_REPEAT_INTER, 'short', 'center');
                    console.log(I18n.resource.admin.index.NUM_REPEAT_INTER);
                    return;
                }
                _this.monileNums = mobileNum;
                //忘记密码暂时功能
                var webStr;
                if (type && type === "forgetPwd") {
                    webStr = '/user/sendverifymessage/forgetpwd';
                } else {
                    webStr = '/user/checknewphone';
                }
                WebAPI.post(webStr, { phone: mobileNum }).then(function (result) {

                    if (result.data === true || result.userId) {
                        
                        $('#vericodePage').hide();
                        var $veriPage = $('#veriPage').show();
                        
                        //忘记密码暂时样式
                        if (type && type === "forgetPwd") {
                            $('.sexOption', $veriPage).hide();
                        }
                        //绑定后退事件
                        $('#btnBackR').off('touchstart').on('touchstart', function () {
                            _this.isRunning = false;
                            var typeR = type ? type : undefined;
                            var i18nStr = type ? 'admin.index.FORGET_PASS' : 'admin.index.REGISTER';
                            if (_this.registerPageHTML) {
                                $('#indexMain').empty().html(_this.registerPageHTML);
                                $('#spTitleR').attr('i18n', i18nStr);
                                I18n.fillArea($('#indexMain'));
                                
                                _this.veriCode(typeR);
                                //恢复刚刚输入的手机号
                                _this.telTemp && $('#userNum').val(_this.telTemp);
                                $('#btnBackR').off('touchstart').on('touchstart', function () {
                                    _this.isRunning = false;
                                    _this.loginLoad();
                                });
                            } else {
                                WebAPI.get('/static/app/temperatureControl/views/admin/register.html').done(function (result) {
                                    $('#indexMain').empty().html(result);
                                    $('#spTitleR').attr('i18n', i18nStr);
                                    I18n.fillArea($('#indexMain'));
                                    _this.veriCode(typeR);
                                    _this.registerPageHTML = result;
                                    //恢复刚刚输入的手机号
                                    _this.telTemp && $('#userNum').val(_this.telTemp);
                                    $('#btnBackR').off('touchstart').on('touchstart', function () {
                                        _this.isRunning = false;
                                        _this.loginLoad();
                                    });
                                });
                            }
                            
                        })
                        
                        $('#userVeriCode').val('');
                        $('#userPassword').val('');
                        _this.isRunning = true;
                        //重新发送验证码倒计时
                        _this.veriResponse($('.repeatGet'), repeatVeri);
                        function repeatVeri() {
                            //重新获取验证码
                            $('#repeatGetVeri').off('click').on('click',function () {
                                _this.isRunning = true;
                                _this.veriResponse($('.repeatGet'), repeatVeri);
                                WebAPI.post('/user/checknewphone', { phone: mobileNum }).then(function (result) {

                                }).always(function () {
                                    $('#submitRegister').removeAttr('disabled');
                                })
                            });
                        }
                        $('#submitRegister').off('click').click(function () {
                            _this.isRunning = false;
                            var $this = $(this);
                            $this.attr('disabled', 'disabled'); 
                            var userVeriCode = $('#userVeriCode').val();
                            var userPassword = $('#userPassword').val();
                            var $wrongInfot = $('#wrongInfot');
                            var sexSelectVal = $('.optionActive').attr('data-value');//0女1男
                            if (userVeriCode === '' || userPassword === '') {
                                //new Alert($wrongInfot, "danger", I18n.resource.admin.index.NUM_ELEVEN).show(1000).close();
                                window.plugins && window.plugins.toast.show(I18n.resource.admin.index.NUM_ELEVEN, 'short', 'center');
                                console.log(I18n.resource.admin.index.NUM_ELEVEN);
                                $this.removeAttr('disabled');
                                return;
                            }
                            if (userPassword.length < 6) {
                                //new Alert($wrongInfot, "danger", I18n.resource.admin.index.PASS_INFO).show(1000).close();
                                window.plugins && window.plugins.toast.show(I18n.resource.admin.index.PASS_INFO, 'short', 'center');
                                console.log(I18n.resource.admin.index.PASS_INFO);
                                $this.removeAttr('disabled');
                                return;
                            }

                            function _forgetOrAddLogin(mobileNum, userPassword, jscd) {
                                WebAPI.post("/login", {
                                    name: mobileNum,
                                    pwd: userPassword,
                                    agent: jscd ? jscd : {}
                                }).then(function (login_result) {
                                    try {
                                        var after_login = function () {
                                            if (login_result.status != undefined && login_result.status == true) {
                                                //if (login_result.projects && login_result.projects.length > 0) {
                                                    //_this.rememberPwd();
                                                    //CssAdapter.adapter({bottom:false,top:true});
                                                    AppConfig.userId = login_result.id;
                                                    AppConfig.account = $("#userName").val();
                                                    AppConfig.userProfile = login_result.userProfile;
                                                    localStorage["userInfo"] = JSON.stringify({name: mobileNum, pwd: userPassword});

                                                    try {
                                                        curRoom = localStorage.getItem('lastOpenRoom');
                                                        AppConfig.roomId = curRoom._id
                                                    }catch(e){
                                                        curRoom = null;
                                                        AppConfig.roomId = null;
                                                    }
                                                    ////获取用户roomList
                                                    //WebAPI.get('/appTemperature/room/getlist/' + AppConfig.userId).done(function (rs) {
                                                    //    roomAll = rs.roomList;
                                                        router.empty().to({
                                                            typeClass: ObserverScreen,
                                                            data: {roomInfo:curRoom}
                                                        });
                                                    //}).fail(function () {
                                                    //
                                                    //});
                                                /*} else {
                                                    loginFail("登录失败，没有任何项目的权限！");
                                                }*/
                                            } else {
                                                loginFail(I18n.resource.admin.index.USER_INFO);
                                            }
                                        }
                                    } catch (e) {
                                        loginFail(I18n.resource.admin.index.LOGIN_ERROR);
                                        return false;
                                    }

                                    after_login();

                                }).always(function () {
                                    Spinner.stop();
                                    $this.removeAttr('disabled');
                                })
                            }

                            //忘记密码
                            if (type && type === "forgetPwd") {
                                WebAPI.post('/user/forgetpasswordbyphone', { phone: mobileNum, password: userPassword, code: userVeriCode, userId: result.userId }).then(function (resultData) {
                                    if (resultData.status === 1) {
                                        _forgetOrAddLogin(mobileNum, userPassword);
                                        
                                    } else {
                                        window.plugins && window.plugins.toast.show(I18n.resource.admin.index.VERI_INFO, 'short', 'center');
                                        console.log(I18n.resource.admin.index.VERI_INFO);
                                    }
                                }).always(function () {
                                    $this.removeAttr('disabled');
                                })
                            } else {
                                WebAPI.post('/user/adduserbyphone', { phone: mobileNum, password: userPassword, code: userVeriCode, userId: mobileNum }).then(function (resultData) {
                                    if (resultData.data) {
                                        _forgetOrAddLogin(mobileNum, userPassword);
                                        //if (typeof cordova != 'undefined') {
                                        //    cordova.plugins.barcodeScanner.scan(
                                        //        function (result) {
                                        //            console.log("We got a barcode\n" +
                                        //                "Result: " + result.text + "\n" +
                                        //                "Format: " + result.format + "\n" +
                                        //                "Cancelled: " + result.cancelled);
                                        //            //todo
                                        //                var postData = {
                                        //                    tokenId: result.text,
                                        //                    userId: resultData.userId
                                        //                }
                                        //                WebAPI.post('/appTemperature/token/corelateRoom', postData).done(function(resultDt){
                                        //                    if (resultDt) {
                                        //                        window.plugins.toast.show('关联成功,请登录!', 'short', 'center');
                                        //                         _this.loginLoad();
                                        //                    }
                                        //                });
                                        //            //_this.relateRoom(result.text);
                                        //        },
                                        //        function (error) {
                                        //            console.log("Scanning failed: " + error);
                                        //        }
                                        //    );
                                        //} else {
                                        //    //WebAPI.post('/appTemperature/token/corelateRoom', { tokenId: '56fc9424fa17231ac497005e', userId: resultData.userId }).done(function (result) {
                                        //    //    if (result) {
                                        //    //        _this.loginLoad();
                                        //    //    }
                                        //    //});
                                        //}
                                    } else {
                                        //new Alert($wrongInfot, "danger", I18n.resource.admin.index.VERI_INFO).show(1000).close();
                                        window.plugins && window.plugins.toast.show(I18n.resource.admin.index.VERI_INFO, 'short', 'center');
                                        console.log(I18n.resource.admin.index.VERI_INFO);
                                    }
                                }).always(function () {
                                    $this.removeAttr('disabled');
                                })
                            }
                            
                        });
                    } else {
                        $wrongInfo.show();
                        //new Alert($wrongInfo, "danger", I18n.resource.admin.index.REGISTER_INFO).show(1000).close();
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.index.REGISTER_INFO, 'short', 'center');
                        console.log(I18n.resource.admin.index.VERI_INFO);
                    }
                });
            });
        },
        initLanguage: function () {
            $("#selectLanguage a").hammer().off('tap').on('tap',function (e) {
                AppConfig.language = $(this).attr('value');
                localStorage.language = JSON.stringify(AppConfig.language);
                InitI18nResource(AppConfig.language, true, 'static/app/temperatureControl/views/i18n/').always(function (rs) {
                    I18n = new Internationalization(null, rs);
                    Init();
                });
                e.preventDefault();
            });
        },

        //登录功能
        login: function (isRestorePwd) {
            var _this = this;
            if(!AppConfig.isOnline){
                _this.loginLocal();
                return;
            }
            //失败提醒
            SpinnerControl.show();
            var loginFail = function (msg) {
                $('.alert').remove();
                //new Alert($("#divAlert"), "danger", msg).show().close();
                window.plugins && window.plugins.toast.show(msg, 'short', 'center');
                console.log(msg);
                SpinnerControl.hide();
                localStorage.removeItem('userInfo');
                //router.empty().to({typeClass:IndexScreen});
            };
            if(isRestorePwd){
                var userName = JSON.parse(localStorage.userInfo).name, password = JSON.parse(localStorage.userInfo).pwd;
            }else {
                var $btnLogin = $('#btnLogin');
                var userName = $("#userName").val(), password = $("#password").val();
                this.rememberPwd();
                if (!(userName || password)) {
                    loginFail(I18n.resource.admin.index.USER_INFO);
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
                        if (login_result.status != undefined && login_result.status == true) {
                            //if (login_result.projects && login_result.projects.length > 0) {
                            //_this.rememberPwd();
                                Push.restart();
                                Push.setAlias(login_result.id);
                                AppConfig.userId = login_result.id;
                                AppConfig.account = $("#userName").val();
                                AppConfig.userProfile = login_result.userProfile;
                                try{localStorage.UserProfile = JSON.stringify(AppConfig.userProfile)}catch(e){};

                                ////获取用户roomList
                                //WebAPI.get('/appTemperature/room/getlist/' + AppConfig.userId).done(function (rs) {
                                //    roomAll = rs.roomList;
                                if(AppConfig.landscape){
                                    router.empty().to({
                                        typeClass: LandscapeObserverScreen
                                    });
                                }else {
                                	if(AppConfig.isOnline){
	                                    router.empty().to({
	                                        typeClass: ObserverScreen,
                                            param:[null,{roomInfo:curRoom}]
	                                    });
                                    }else{
                                    	router.empty().to({
	                                        typeClass: ObserverLocalScreen,
                                            param:[null,{roomInfo:curRoom}]
	                                    });
                                    }
                                }
                                //}).fail(function () {
                                //
                                //});
                        } else {
                            loginFail(I18n.resource.admin.index.USER_INFO);
                        }
                    }
                } catch (e) {
                    loginFail(I18n.resource.admin.index.LOGIN_ERROR);
                    return false;
                }

                after_login();

            }).always(function () {
                Spinner.stop();
            }).fail(function(){
                if(navigator.connection && navigator.connection.type == 'none'){
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.index.CHECH_INFO, 'short', 'center');
                }else{
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.index.MECINE_INFO, 'short', 'center');
                }
                SpinnerControl.hide();
                _this.loginLoad();
                //localStorage.removeItem('userInfo');
                //router.empty().to({typeClass:IndexScreen});
            })
        },

        loginLocal:function(){
            AppConfig.isLocalMode = true;
            try {
                curRoom = localStorage.getItem('lastOpenRoom');
                AppConfig.roomId = curRoom._id
            }catch(e){
                curRoom = null;
                AppConfig.roomId = null;
            }
            try {
                AppConfig.userProfile = JSON.parse(localStorage.getItem('UserProfile'))
            }catch(e){

            }
            if(AppConfig.landscape){
                router.empty().to({
                    typeClass: LandscapeObserverScreen,
                    param:[null,curRoom]
                });
            }else {
                router.empty().to({
                    typeClass: ObserverLocalScreen,
                    param:[null,curRoom]
                });
            }
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
            // 配置按钮
            $('#btnConfig', '#navBottom').off('touchstart').on('touchstart', function (e) {
                router.to({
                    typeClass: AdminConfigure
                });
                e.preventDefault();
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
    //I18n.fillArea($("#navBottom"));

    //i18n_resource = {
    //    error: {
    //        token: {
    //            0: '身份凭证有效',
    //            1: '未登录',
    //            2: '身份凭证无效',
    //            3: '身份凭证过期',
    //            4: '无效的用户'
    //        },
    //        relogin: '请重新登录',
    //        noPermission: '您没有权限访问。'
    //    }
    //}
}

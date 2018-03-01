/// <reference path="../lib/jquery-2.1.4.min.js" />

var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenPrevious = undefined;                                //前一页面对象的引用
var Spinner = new LoadingSpinner({ color: '#00FFFF' });        //等待加载时的转圈圈
//var navigation = responsiveNav("#navbar-collapse");          //响应式导航条
var AppConfig = {
    userId: undefined,
    account: undefined,
    roomList:undefined,
    isMobile: true
}; //配置文件
var I18n = undefined;                                          //国际化对象的引用

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
    router.to({
        typeClass: IndexScreen,
        data: {}
    });
});

var router = (function () {
    function Router() {
        this.path = [];
    }

    +function () {
        // 回退一个页面
        this.back = function () {
            this.path.pop();
            this._display();
            return this;
        };
        // 前进一个页面
        this.to = function (pathNode) {
            this.path.push(pathNode);
            this._display();
            return this;
        };
        this.empty = function () {
            this.path.length = 0;
            return this;
        };
        this._display = function () {
            if(this.path.length <= 0) {
                return;
            }
            var node = this.path[this.path.length-1];
            var navOptions = node.navOptions;
            var typeClass = node.typeClass;
            //初始化数据
            var data = node.data;
            if (data){
                for (var ele in data) {
                    eval("AppConfig." + ele + '=data.' + ele)
                }
            }
            // 初始化 nav
            $('body').removeClass('top-nav bottom-nav');
            $('#navTop').children().hide();
            $('#navBottom').children().hide();

            if(typeClass.navOptions) {
                if(typeClass.navOptions.bottom) {
                    // 显示底部 nav
                    $('body').addClass('bottom-nav');
                }
                if(typeClass.navOptions.top) {
                    // 显示顶部 nav
                    $('body').addClass('top-nav');
                }
            }

            // 如果当前路径不是第一级目录，显示"后退"按钮
            if(this.path.length > 1) {
                $('body').addClass('top-nav');
                $('.btn-back', '#navTop').show();
            }

            // 显示页面内容
            ScreenManager.show(node.typeClass);
        };

    }.call(Router.prototype);

    return new Router();

}).call(this);

var IndexScreen = (function () {
    function IndexScreen() {}

    IndexScreen.prototype = {
        show: function () {
            var _this = this;
            //判断是否需要输入账号密码等
            //TODO
            //如果需要登录，获取登录页面
            WebAPI.get('/static/app/temperatureControl/views/admin/login.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        },

        close: function () {
            //remove key down event in login page
            document.onkeydown = false;
        },

        init: function () {
            var _this = this;
            _this.initLogin();
            _this.initNav();
        },

        initLogin: function () {
            this.restorePwd();

            var _this = this;

            //登录按键初始化
            $("#btnLogin").hammer().off('tap').on('tap',function (e) {
                _this.login();
            });
            $(document).on("keydown","#divLogin input",function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) {
                    _this.login();
                }
            });
        },

        //登录功能
        login: function () {
            var _this = this;
            var $btnLogin = $('#btnLogin');
            Spinner.spin($btnLogin[0]);

            var userName = $("#userName").val(), password = $("#password").val();
            //失败提醒
            var loginFail = function (msg) {
                $('.alert').remove();
                new Alert($("#divLoginAlert"), "danger", msg).show().close();
                Spinner.stop();
            };

            if (!(userName && password)) {
                loginFail('用户名或密码错误！');
                return;
            }

            WebAPI.post("/login", {
                name: userName,
                pwd: password,
                agent: jscd ? jscd : {}
            }).then(function (login_result) {
                try {
                    var after_login = function () {
                        if (login_result.status != undefined && login_result.status == true) {
                            if (login_result.projects && login_result.projects.length > 0) {
                                _this.rememberPwd();
                                AppConfig.userId = login_result.id;
                                AppConfig.account = $("#userName").val();
                                
                                //获取用户roomList
                                WebAPI.get('/appTemperature/room/list/' + AppConfig.userId).done(function(rs) {
                                    AppConfig.roomList = rs.roomList;
                                    AppConfig.buildingList = rs.buildingList;
                                    
                                    router.empty().to({
                                        typeClass: ObserverScreen,
                                        data: {}
                                    });
                                }).fail(function(){

                                });
                            } else {
                                loginFail("登录失败，没有任何项目的权限！");
                            }
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
            localStorage["userInfo"] = JSON.stringify({ name: $("#userName").val(), pwd: $("#password").val() });
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
            $('#navTop','.btn-back').hammer().off('tap').on('tap', function (e) {
                router.back();
            });
            // 配置按钮
            $('.btn-config', '#navBottom').hammer().off('tap').on('tap', function(e) {
                router.to({
                    typeClass: AdminConfigure
                });
                e.preventDefault();
            });

            // 地图选择按钮
            $('.btn-mapsel', '#navBottom').hammer().off('tap').on('tap', function(e) {
                router.to({
                    typeClass: ProjectSel
                });
                e.preventDefault();
            });
        },
    };

    return IndexScreen;
})();

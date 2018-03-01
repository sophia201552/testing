//
//var AppConfig = {
//        projectId: 122,
//        projectName: undefined,
//        userId: undefined,
//        account: undefined,
//        level: undefined,
//        projectList: undefined,
//        isMobile: false,
//        isFactory: 1,
//        isReportConifgMode: 1,
//        menu: [],
//        chartTheme: theme.Dark,
//        syncInterval: 120000
//    }; //配置文件

//var I18n = I18n || undefined;
//        var I18N_PATH = '/static/app/WebFactory/views/js/i18n/';
//        $(document).ready(function () {
//            initI18n(navigator.language.split('-')[0], false);
//        });
//        function initI18n(lang, isForce) {
//            InitI18nResource(lang, isForce, I18N_PATH).always(function (rs) {
//                I18n = new Internationalization(null, rs);
//            });
//        };
var Spinner = new LoadingSpinner({color: '#00FFFF'});

var LoginValidate = (function (){
    function LoginValidate() {
        this.topArr = [];
        this.$addProj = undefined;
        this.$projectList = undefined;
        this.projectList = undefined;
        this.loadModal = '\
    <div class="modal fade"  id="loginValidateModal" data-backdrop="static">\
        <style>\
            #loginValidateModal .input-group input{\
                margin-bottom: -1px;\
                margin-top: 1px;\
            }\
            #loginValidateModal #rememberPwd{\
                margin-top: 2px;\
            }\
        </style>\
        <div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <h4 class="modal-title">Login</h4>\
                </div>\
                <div class="modal-body">\
                    <div class="" id="loginContent">\
                        <div class="input-group">\
                            <span class="input-group-addon glyphicon glyphicon-user textBefore"></span>\
                            <input type="text" required="required" class="form-control" id="loginUserName" autofocus=""  autocomplete="off" placeholder="Please enter user name">\
                        </div>\
                        <div class="input-group">\
                            <span class="input-group-addon glyphicon glyphicon-lock textBefore"></span>\
                            <input type="password" required="required" class="form-control" id="loginUserPass" autocomplete="off" placeholder="Please enter your password">\
                        </div>\
                        <div class="checkbox">\
                            <label for="rememberPwd">\
                                <input type="checkbox" class="rememberPass" id="rememberPwd" checked="checked">Remember\
                            </label>\
                        </div>\
                    </div>\
                </div>\
                <div class="modal-footer">\
                    <button type="button" class="btn btn-primary" id="confirmLogin">OK</button>\
                </div>\
            </div>\
       </div>\
    </div>';
    }
    LoginValidate.prototype.show = function () {
        var bodyContent = $(document.body);
        if(bodyContent.find('#loginValidateModal').length > 0){
            bodyContent.find('#loginValidateModal').remove();
        }
        bodyContent.append(this.loadModal);
        var _this = this;
        $('#confirmLogin').off('click').click(function () {
            _this.login();
        });
        $(document.body).off('keydown.login').on('keydown.login',function(e){
            if (e && e.keyCode == 13) {
                _this.login();
                $(document).off('keydown.login');
            }
        });
        _this.restorePwd();
        $('#loginValidateModal').modal('show').on('hidden.bs.modal', function (e) {
            _this.close();
        })
    };
    LoginValidate.prototype.login = function () {
        var $btnLogin = $('#confirmLogin');
        var loginFail = function (msg) {
            $('.alert').remove();
            new Alert($("#loginContent"), "danger", msg).show().close();
            $btnLogin.prop('disabled', false);
        };
        var txtName = $("#loginUserName").val(), txtPwd = $("#loginUserPass").val();

        if (!(txtName && txtPwd)) {
            loginFail('Please enter your username and password');
            return;
        }

        this.loginTask({
            name: txtName,
            pwd: txtPwd
        });
    };
    LoginValidate.prototype.loginTask = function (loginInfo) {
        var _this = this;
        var $btnLogin = $('#confirmLogin');
        var loginFail = function (msg) {
            $('.alert').remove();
            new Alert($("#loginContent"), "danger", msg).show().close();
            $btnLogin.prop('disabled', false);
        };
        $btnLogin.prop('disabled', false);
        var target = $('#loginValidateModal').find('.modal-content')[0];
        Spinner.spin(target);
        WebAPI.post("/login", loginInfo).then(function (login_result) {
            try {
                if (login_result.status != undefined && login_result.status == true) {
                    if (login_result.projects && login_result.projects.length > 0) {
                        _this.rememberPwd();
                        $('#loginValidateModal').modal('hide');
                        window.location.reload();
                    } else {
                        loginFail("<strong>Login failed！</strong>");
                    }
                } else {
                    if (login_result.code === 1) {
                        loginFail("<strong>Login failed！</strong>");
                    } else if (login_result.code === 2) {
                        loginFail("<strong>Login token expired, please relogin！</strong>");
                    }
                }
            } catch (e) {
                loginFail("<strong>Login failed！</strong>");
                return false;
            }
        }).always(function () {
            Spinner.stop();
        });
    };
    LoginValidate.prototype.rememberPwd = function() {
        if ($("#rememberPwd").is(":checked")) {
            localStorage["userInfo"] = JSON.stringify({ name: $("#loginUserName").val(), pwd: $("#loginUserPass").val() });
        }
        else {
            localStorage.removeItem("userInfo");
        }
    };
    LoginValidate.prototype.restorePwd = function() {
        if (localStorage["userInfo"]) {
            var data = JSON.parse(localStorage["userInfo"]);
            if (data.pwd && data.pwd != "") {
                $("#rememberPwd").attr("checked", true);
                $("#loginUserName").val(data.name);
                $("#loginUserPass").val(data.pwd);
            }
        }
    };
    LoginValidate.prototype.close = function () {
        this.topArr = null;
        this.$addProj = null;
        this.$projectList = null;
        this.loadModal = null;
        $('#loginValidateModal').remove();
    };
    return LoginValidate;
}());

var AppConfig = {
        projectId: undefined,
        projectName: undefined,
        userId: undefined,
        account: undefined,
        level: undefined,
        projectList: undefined,
        isMobile: false,
        isFactory: 1,
        isReportConifgMode: 1,
        menu: [],
        chartTheme: theme.Dark
    }; //配置文件


var Spinner = new LoadingSpinner({ color: '#00FFFF' });
var I18n = I18n || undefined;
var I18N_PATH = '/static/app/WebFactory/views/js/i18n/';

$(document).ready(function () {
    initI18n(navigator.language.split('-')[0], false);
});

function initI18n(lang, isForce) {
    InitI18nResource(lang, isForce, I18N_PATH).always(function (rs) {
        I18n = new Internationalization(null, rs);
        new FactoryLogin().show();
    });
};

var FactoryLogin = (function (FactoryScreen, TemplateList) {
    
    function FactoryLogin() {
        this.topArr = [];
        this.$addProj = undefined;
        this.$projectList = undefined;
    }

    FactoryLogin.prototype.show = function () {
        var _this = this;
        $("#selectLanguage a").off('click').click(function (e) {
            initI18n(e.currentTarget.attributes.value.value, true);
            e.preventDefault();
        });
        $('#login').off('click').click(function () {
            _this.login();
        });
        $(document).on("keydown", ".loginBox input", function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
                _this.login();
            }
        });
        _this.restorePwd();
        var $userPass = $('#userPass');
        if (I18n.type === 'en') {
            $userPass.css('margin-left', '87px');
        } else {
            $userPass.css('margin-left', '45px');
        }

        // 获取 url 参数
        var token = document.querySelector('#hidToken').value;
        if (token !== '') {
            this.loginTask({
                token: token
            });
        } else {
            I18n.fillArea($('#divFactoryLanguage').fadeIn());
            I18n.fillArea($('#modalLogin').fadeIn());
        }
    };


    FactoryLogin.prototype.login = function () {
        var _this = this;
        var txtName = $("#userName").val(), txtPwd = $("#userPass").val();

        if (!(txtName && txtPwd)) {
            loginFail(I18n.resource.admin.login.LOG_IN_EMPTY);
            return;
        }

        this.loginTask({
            name: txtName,
            pwd: txtPwd
        });
    };

    FactoryLogin.prototype.loginTask = function (loginInfo) {
        var _this = this;
        var $btnLogin = $('#login');
        var loginFail = function (msg) {
            $('.alert').remove();
            new Alert($("#factoryLogin"), "danger", msg).show().close();
            $btnLogin.prop('disabled', false);
        }
        $btnLogin.prop('disabled', false);

        WebAPI.post("/login", loginInfo).then(function (login_result) {
            try {
                if (login_result.status != undefined && login_result.status == true) {
                    if (login_result.projects && login_result.projects.length > 0) {
                        _this.rememberPwd();
                        //添加版本历史
                        window.localStorage.setItem("versionHistory", login_result.version);
                        AppConfig.userId = login_result.id;
                        AppConfig.projectList = login_result.projects;
                        AppConfig.userProfile = login_result.userProfile;
                        AppConfig.account = login_result.userProfile.name;
                        AppConfig.userOfRole = login_result.userProfile.userOfRole;

                        $('#modalLogin').hide();
                        document.onkeydown = null;
                        //$('#modalframe').show();
                        I18n.fillArea($('#modalframe').fadeIn());
                        _this.$projectList = $('#projectList');
                        _this.createPro(login_result.id);
                        _this.createTemlatePanel();

                        _this.attachEvents();                        
                    } else {
                        loginFail("<strong>" + I18n.resource.admin.login.LOG_IN_FAILED + "！</strong> ");
                    }
                } else {
                    loginFail("<strong>" + I18n.resource.admin.login.LOG_IN_FAILED + "！</strong> ");
                }
            } catch (e) {
                loginFail("<strong>" + I18n.resource.admin.login.LOG_IN_FAILED + "！</strong>");
                return false;
            }
        });
    };

    FactoryLogin.prototype.attachEvents = function () {
        var _this = this;
        
        $('#addPro').off('click').click(function () {
            AddProModal.show(_this);
        });

        $('#btnImportProject').off('click').click(function () {
            ImportProjectModal.show(function (project) {
                var $proBox = _this.createProItem(project, AppConfig.userId);
                _this.$projectList.append($proBox);
            });
        });
    };

    FactoryLogin.prototype.rememberPwd = function() {
        if ($("#rememberPass").is(":checked")) {
            localStorage["userInfo"] = JSON.stringify({ name: $("#userName").val(), pwd: $("#userPass").val() });
        }
        else {
            localStorage.removeItem("userInfo");
        }
    };

    FactoryLogin.prototype.restorePwd = function() {
        if (localStorage["userInfo"]) {
            var data = JSON.parse(localStorage["userInfo"]);
            if (data.pwd && data.pwd != "") {
                $("#rememberPass").attr("checked", true);
                $("#userName").val(data.name);
                $("#userPass").val(data.pwd);
            }
        }
    };

    FactoryLogin.prototype.createTemlatePanel = function () {
        this.templateList = new TemplateList(document.querySelector('#tplContainer'));
        this.templateList.show();
    };

    FactoryLogin.prototype.createPro = function (loginResultId) {
        var _this = this;
        var $proBox, item, deleteArr = [], itemLocalList = {};
        var userId = loginResultId;
        var jsonTopArr = JSON.parse(localStorage.getItem('fac_project_topArray_' + userId));
        if (jsonTopArr && jsonTopArr.length !== 0) {
            _this.topArr = jsonTopArr;
        }
        WebAPI.get('/factory/getProjectList/' + userId).done(function (result) {
            var loginResult = [];
            loginResult = result ? result.data : [];
            for (var i = 0; i < loginResult.length; i++) {
                _this.createProItems(i, loginResult);
            }
            for (var k = _this.topArr.length - 1; k >= 0; k--) {
                item = _this.topArr[k];
                $proBox = _this.createProItem(item, userId)
                _this.$projectList.prepend($proBox);
            }
        });

    };

    FactoryLogin.prototype.createProItems = function (i, loginResult) {
        var _this = this;
        item = loginResult[i];
        itemLocalList = {
            id: item.id ? item.id : item._id,
            name_cn: item.name_cn
        };
        $proBox = _this.createProItem(itemLocalList, AppConfig.userId);
        //遍历本地数组中项目，前置
        if (_this.topArr.length !== 0) {
            var isExist = false;
            for (var j = _this.topArr.length - 1; j >= 0; j--) {
                var topArrId;
                topArrId = _this.topArr[j].id;

                if (topArrId == itemLocalList.id) {
                    isExist = true;
                    break;
                    return;
                }
            }
            if (!isExist) {
                _this.$projectList.append($proBox);
            } else {
                $proBox.remove();
                return;
            }
        } else {
            _this.$projectList.append($proBox);
        }
    };


    FactoryLogin.prototype.createProItem = function (item, userId) {
        var _this = this;
        var $projectBox, $thParent;
        $projectBox = $('<div class="divHover proHover" projectId=' + item.id + '>\
                    <span class="glyphicon glyphicon-share-alt exportPro" title=' + I18n.resource.admin.welcom.yourProj.EXPORT + ' id="exportPro' + item.id + '"></span>\
                    <span class="proText"></span><span class="glyphicon glyphicon-upload proTop" title=' +  I18n.resource.admin.welcom.yourProj.TOP + '></span>\
                    <span class="glyphicon glyphicon-remove-sign deletePro" title=' + I18n.resource.admin.welcom.yourProj.DELETE + ' id="deletePro_' + item.id + '"></span>\
                    <span class="glyphicon glyphicon-user editAuth" data-id="' + item.id + '" title=' + I18n.resource.admin.welcom.yourProj.EDIT_AUTH + '></span>\
                    <br style="clear:both"/></div>');
        $projectBox.find('.proText').html(item.name_cn).attr('title', item.name_cn);
        $projectBox.find('.proText').off('click').click(function (e) {
            $('#modalframe').hide();
            //$('#mainframe').show();
            I18n.fillArea($('#mainframe').fadeIn());
            new FactoryScreen().show(item.id, item.name_cn);
        });

        $projectBox.find('.deletePro').off('click').click(function () {
            var $deletePro = $(this);
            var projectId = $deletePro.parent().attr('projectid');
            RemoveProModal.show(_this, projectId);
        });
        $projectBox.find('.proTop').off('click').click(function (e) {
            var transItem;
            $thParent = $(this).parents('.proHover');
            _this.$projectList.prepend($thParent);
            for (var j = 0; j < _this.topArr.length; j++) {
                var tempId;
                tempId = _this.topArr[j].id;

                if (item.id == tempId) {
                    _this.topArr.splice(j, 1);
                }
            }
            _this.topArr.unshift(item);
            localStorage.setItem('fac_project_topArray_' + userId, JSON.stringify(_this.topArr));//把置顶的项目存储到本地内存数组中
        });
        $projectBox.find('.editAuth').off('click').click(function (e) {
            // 查询拥有当前项目的用户
            var projId = this.dataset.id;
            Spinner.spin(document.body);
            WebAPI.get('/factory/getProjectUser/'+projId).done(function (rs) {
                MemberSelectedModal.setState({
                    selectedUser: rs.data
                }).show(function (userList) {
                    if (userList.length <= 0) {
                        alert('请至少选择一个用户！');
                        return;
                    }
                    // 发送请求，更新项目权限
                    WebAPI.post('/factory/updateProjectAuth', {
                        projId: projId,
                        userIds: userList.map(function (row) {
                            return row.id;
                        })
                    });
                });
            }).always(function () {
                Spinner.stop();
            });
        });
        return $projectBox;
    };

    FactoryLogin.prototype.removeProItem = function (projectId) {
        var $removeProModal =$('#removeProModal')
        var password = $('#removePass').val();
        if (password === '') {
            $removeProModal.find('.wrongPromt').html('请填写密码');
        } else {
            $removeProModal.find('.wrongPromt').html('');
            var postData = {
                userId: AppConfig.userId,
                projId: projectId,
                proPass: password
            };
            WebAPI.post('/factory/removeProject/remove', postData).done(function (result) {
                if (result.status === 'OK') {
                    $removeProModal.remove();
                    var arr = JSON.parse(localStorage.getItem('fac_project_topArray_' + AppConfig.userId));
                    if (arr) {
                        if (arr.length!==0) {
                            for (var i = 0; i < arr.length; i++) {
                                if ($('.deletePro').parent('[projectid="' + projectId + '"]').attr('projectid') === arr[i].id) {
                                    arr.splice(i, 1);
                                    localStorage.setItem('fac_project_topArray_' + AppConfig.userId, JSON.stringify(arr));
                                    break;
                                }
                            }
                        }
                        
                    }
                    $('.deletePro').parent('[projectid="' + projectId + '"]').remove();
                } else {
                    new Alert($('.wrongPromt'), 'danger', result.msg).show(1000).close();
                }
            });
        }
    };
    FactoryLogin.prototype.close = function () {
        this.topArr = null;
        this.$addProj = null;
        this.$projectList = null;
    }
    return FactoryLogin;
}( namespace('factory.FactoryScreen'), namespace('factory.components.TemplateList') ));

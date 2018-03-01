(function () {
    window.AppConfig = {
        projectId: undefined,
        projectName: undefined,
        userId: undefined,
        account: undefined,
        level: undefined,
        projectList: undefined,
        isMobile: false
    }; //配置文件

    window.Spinner = new LoadingSpinner({color: '#00FFFF'});
    window.I18n = undefined;

    function createProItem(item, topArr, userId) {
        var $projectList = $('#projectList');
        var $projectBox, $thParent;
        $projectBox = $('<div class="divHover proHover" projectId=' + item.id + '><span class="proText"></span><span class="glyphicon glyphicon-upload proTop" title="置頂"></span>\
                    <span class="glyphicon glyphicon-remove-sign" title="刪除" id="deletePro"></span>\
                    <br style="clear:both"/></div>');
        $projectBox.find('.proText').html(item.name_cn);
        $projectBox.find('.proText').off('click').click(function (e) {
            $('#modalframe').hide();
            $('#mainframe').show();
            new FactoryScreen().show(item.id, item.name_cn);
        });
        $projectBox.hover(function () {
            $(this).find('.proTop').show();
            $(this).find('#deletePro').show();
        }, function () {
            $(this).find('.proTop').hide();
            $(this).find('#deletePro').hide();
        });
        //$projectBox.off('click').click(function () {
        //    var curentItem;
        //    curentItem = loginResult.projects[i];
        //    if ($(this).hasClass('deletePro')) {
        //        $(this).css('background', 'none');
        //        $(this).removeClass('deletePro');
        //        //当取消选中时即不要删除时，从deleteArr中去除此项
        //        for (var k = 0; k < deleteArr.length; k++) {
        //            if (deleteArr[k].id == curentItem.id) {
        //                deleteArr.splice(k,1);
        //            }
        //        }
        //    } else {
        //        $(this).css('background', '#aaa');
        //        $(this).addClass('deletePro');
        //        deleteArr.unshift(curentItem);
        //        //localStorage.setItem('deleteArray', JSON.stringify(deleteArr));
        //    }
        //});
        $projectBox.find('.proTop').off('click').click(function (e) {
            var transItem;
            $thParent = $(this).parents('.proHover');
            $projectList.prepend($thParent);
            //transItem = loginResult.projects.splice(i, 1);
            for (var j = 0; j < topArr.length; j++) {
                var tempId;
                tempId = topArr[j].id;

                if (item.id == tempId) {
                    topArr.splice(j, 1);
                }
            }
            topArr.unshift(item);
            localStorage.setItem('fac_project_topArray_' + userId, JSON.stringify(topArr));//把置顶的项目存储到本地内存数组中
            //loginResult.projects.unshift(transItem);
            //loginResult.projects.splice(0,0,transItem);
        });
        //$('#deletePro').off('click').click(function () {
        //    $('.deletePro').remove();
        //    //deleteArr = [];
        //    localStorage.setItem('deleteArray', JSON.stringify(deleteArr));
        //});
        return $projectBox;
    }
    function createPro(loginResultId) {
        var $projectList = $('#projectList');
        var $proBox, item, topArr = [], deleteArr = [], itemLocalList = {};
        var userId = loginResultId;
        var jsonTopArr = JSON.parse(localStorage.getItem('fac_project_topArray_' + userId));
        //var jsonDeleteArr = JSON.parse(localStorage.getItem('deleteArray'));
        if (jsonTopArr && jsonTopArr.length !== 0) {
            topArr = jsonTopArr;
        }
        //if (jsonDeleteArr && jsonDeleteArr.length !== 0) {
        //    deleteArr = jsonDeleteArr;
        //}
        WebAPI.get('/factory/getProjectList/' + userId).done(function (result) {
            var loginResult = [];
            loginResult = result ? result.data : [];
            //console.log(loginResult);
            for (var i = 0; i < loginResult.length; i++) {
                createPro(i, loginResult);
            }
            for (var k = topArr.length - 1; k >= 0; k--) {
                item = topArr[k];
                $proBox = createProItem(item, topArr, userId)
                $projectList.prepend($proBox);
            }
        });
        function createPro(i, loginResult) {
                item = loginResult[i];
                itemLocalList = {
                    id: item.id ? item.id : item._id,
                    name_cn: item.name_cn
                };
                $proBox = createProItem(itemLocalList, topArr, userId);
                //遍历本地数组中项目，前置
                if (topArr.length !== 0) {
                    var isExist = false;
                    for (var j = topArr.length - 1; j >= 0; j--) {
                        var topArrId;
                        topArrId = topArr[j].id;

                        if (topArrId == itemLocalList.id) {
                            isExist = true;
                            break;
                            return;
                        }
                    }
                    if (!isExist) {
                        $projectList.append($proBox);
                    } else {
                        $proBox.remove();
                        return;
                    }
                } else {
                    $projectList.append($proBox);
                }
        }

    }
    function login() {
        var $btnLogin = $('#login');
        $btnLogin.prop('disabled', false);

        var txtName = $("#userName").val(), txtPwd = $("#userPass").val();

        var loginFail = function (msg) {
            $('.alert').remove();
            new Alert($("#factoryLogin"), "danger", msg).show().close();
            $btnLogin.removeAttr('disabled');
        }

        if (!(txtName && txtPwd)) {
            loginFail('请输入用户名和密码')
            return;
        }

        WebAPI.post("/login", {
            name: txtName,
            pwd: txtPwd,
            agent: {}
        }).then(function (login_result) {
            try {
                if (login_result.status != undefined && login_result.status == true) {
                    if (login_result.projects && login_result.projects.length > 0) {
                        rememberPwd();
                        //添加版本历史
                        window.localStorage.setItem("versionHistory", login_result.version);
                        AppConfig.userId = login_result.id;
                        AppConfig.account = $("#userName").val();
                        AppConfig.projectList = login_result.projects;
                        AppConfig.userProfile = login_result.userProfile;
                        AppConfig.userOfRole = login_result.userProfile.userOfRole;

                        $btnLogin.parents('#modalLogin').hide();
                        document.onkeydown = null;
                        $('#modalframe').show();
                        createPro(login_result.id);
                        //location.href = '/factory';
                    } else {
                        loginFail("<strong>登录失败</strong> ");
                    }
                } else {
                    loginFail("<strong>登录失败</strong> ");
                }
            } catch (e) {
                loginFail("<strong>登录失败！");
                return false;
            }
        })
    }
    $('#login').off('click').click(function () {
        login();
    });
    $(document).on("keydown", ".loginBox input", function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
            login();
        }
    });
    function rememberPwd() {
        if ($("#rememberPass").is(":checked")) {
            localStorage["userInfo"] = JSON.stringify({ name: $("#userName").val(), pwd: $("#userPass").val() });
        }
        else {
            localStorage.removeItem("userInfo");
        }
    }
    function restorePwd() {
        if (localStorage["userInfo"]) {
            var data = JSON.parse(localStorage["userInfo"]);
            if (data.pwd && data.pwd != "") {
                $("#rememberPass").attr("checked", true);
                $("#userName").val(data.name);
                $("#userPass").val(data.pwd);
            }
        }
    }
    restorePwd();

    //load language
    function InitI18nResource(strLanguage, isForce) {
        if (strLanguage == '') return;
        if (isForce) {
            localStorage["isUserSelectedLanguage"] = strLanguage;
        }
        else if (localStorage["isUserSelectedLanguage"]) {
            strLanguage = localStorage["isUserSelectedLanguage"];
        }

        $.getScript("/static/views/js/i18n/" + strLanguage + ".js")
            .done(function (e) {
                localStorage["language"] = strLanguage;
                localStorage["i18n"] = JSON.stringify(i18n_resource);
                initI18n()
            })
            .error(function (e) {
                if (!localStorage["i18n"]) {
                    $.getScript("/static/views/js/i18n/en.js").done(function (e) {
                        localStorage["language"] = "en";
                        localStorage["i18n"] = JSON.stringify(i18n_resource);
                        initI18n()
                    })
                }
            });
    }

    InitI18nResource(navigator.language.split('-')[0]);
    function initI18n(){
        I18n = new Internationalization();
    }
}());

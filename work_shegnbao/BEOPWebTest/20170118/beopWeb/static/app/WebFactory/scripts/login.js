var AppConfig = {
        projectId: 122,
        projectName: undefined,
        userId: undefined,
        account: undefined,
        level: undefined,
        projectList: undefined,
        isMobile: false,
        isFactory: 1,
        isReportConifgMode: 1,
        menu: [],
        chartTheme: theme.Dark,
        syncInterval: 120000
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
        this.projectList = undefined;
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
        $(document).on("keydown.login", ".loginBox input", function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
                _this.login();
                $(document).off('keydown.login');
            }
        });
        _this.restorePwd();
        //默认语言显示
        if (I18n.type) {
        	$('#languageTitle').attr('class',I18n.type+'Checked country');
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
        var $btnLogin = $('#login');
        var loginFail = function (msg) {
            $('.alert').remove();
            new Alert($("#factoryLogin"), "danger", msg).show().close();
            $btnLogin.prop('disabled', false);
        };
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
    
    FactoryLogin.prototype.logout = function(){
    	WebAPI.get('/logout/' + AppConfig.userId).always(function () {
            AppConfig = {};
            localStorage.removeItem("userInfo");
            window.location.href = '/factory';
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
		_this.loadingSpinner(true);
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
                        //获取头像
                        _this.getAvatar();
                    } else {
                        loginFail("<strong>" + I18n.resource.admin.login.LOG_IN_FAILED + "！</strong> ");
                        document.querySelector('#hidToken').value = '';
                        I18n.fillArea($('#divFactoryLanguage').fadeIn());
                        I18n.fillArea($('#modalLogin').fadeIn());
                    }
                } else {
                    if (login_result.code === 1) {
                        loginFail("<strong>" + I18n.resource.admin.login.LOG_IN_FAILED + "！</strong> ");
                    } else if (login_result.code === 2) {
                        loginFail("<strong>" + I18n.resource.admin.login.LOG_IN_TOKEN_EXPIRED + "！</strong> ");
                    }
                    document.querySelector('#hidToken').value = '';
                    I18n.fillArea($('#divFactoryLanguage').fadeIn());
                    I18n.fillArea($('#modalLogin').fadeIn());
                }
            } catch (e) {
                loginFail("<strong>" + I18n.resource.admin.login.LOG_IN_FAILED + "！</strong>");
                return false;
            }
        }).always(function () {
			_this.loadingSpinner(false);
        });
    };

    FactoryLogin.prototype.attachEvents = function () {
        var _this = this;
        $('#addPro').off('click').click(function () {
            _this.editProjId = null;
            _this.editProjName = null;
            _this.configProjId = null;
            AddProModal.show(_this);
        });
		$('#lkLogOut,#lkLogOut2').off('click').on('click', function () {
            _this.logout();
        });
        $('#btnImportProject').off('click').click(function () {
            ImportProjectModal.show(function (project) {
                var $proBox = _this.createProItem(project, AppConfig.userId);
                _this.$projectList.append($proBox);
            });
        });
        //查找项目 
        // search
        var $searchProject = $('.searchProject').find(".search");
        var $empty = $('.searchProject').find(".searchSpan");
        $searchProject.keyup(function (e) {//鼠标抬起
            var searchVal = $(e.currentTarget).val();
            var result = [];
            if (13 == e.keyCode) {
                _this.$projectList.html("");
                for(var i=0,length=_this.projectList.length;i<length;i++){
                    if((_this.projectList[i].name_cn && $.trim(_this.projectList[i].name_cn).indexOf(searchVal) !== -1)
                        ||(_this.projectList[i].bindId && $.trim(_this.projectList[i].bindId).indexOf($.trim(searchVal)) !== -1)
                        ||(_this.projectList[i].name_cn && $.trim(_this.projectList[i].name_cn.toString()).toLowerCase().indexOf(searchVal.toLowerCase()) !== -1)){
                            result.push(_this.projectList[i]);
                            _this.createProItems(i,_this.projectList);
                    }
                }
            }
            if ('' == searchVal) {
                _this.$projectList.html("");
                //重新渲染项目列表
                for(var i=0,length=_this.projectList.length;i<length;i++){
                    _this.createProItems(i,_this.projectList);
                }
            }
        })
        //搜索框的清空按钮
        $empty.off("click").on("click",function(){
            $searchProject.val("");
            //重新渲染项目列表
            _this.$projectList.html("")
            for(var i=0,length=_this.projectList.length;i<length;i++){
                _this.createProItems(i,_this.projectList)
            }
        })
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
	
	FactoryLogin.prototype.loadingSpinner = function(flag){
		var $spinner = $('.loginBox .spinner');
		var state = flag?"none":"block";
		var state2 = !flag?"none":"block";
		$spinner.css('display',state2)
				.siblings('.loginSj')
				.css('display',state);
	}
	
	FactoryLogin.prototype.getAvatar = function(){
		$('#modalframe .userPic.small,#userNav .userPic.small')
			.attr('src', AppConfig.userProfile.picture)
			.attr('alt', AppConfig.userProfile.fullname || AppConfig.account);
	}
	
    FactoryLogin.prototype.createTemlatePanel = function () {
        var Template = namespace('factory.components.template.Template');
        this.template = new Template(document.querySelector('#tplContainer'));
        this.template.show();
    };

    FactoryLogin.prototype.createPro = function (loginResultId) {
        var _this = this;
        _this.$projectList = $('#projectList');
        _this.$projectList.html("");
        _this.topArr = [];
        var $proBox, item, deleteArr = [], itemLocalList = {};
        var userId = loginResultId;
        var jsonTopArr = JSON.parse(localStorage.getItem('fac_project_topArray_' + userId));
        if (jsonTopArr && jsonTopArr.length !== 0) {
            _this.topArr = jsonTopArr;
        }
        Spinner.spin(_this.$projectList[0]);
        WebAPI.get('/factory/getProjectList/' + userId).done(function (result) {
            var loginResult = [];
            loginResult = result ? result.data : [];
            _this.projectList = result.data;
            for (var i = 0; i < loginResult.length; i++) {
                _this.createProItems(i, loginResult);
                for (var k = _this.topArr.length - 1; k >= 0; k--) {
                    var info = _this.topArr[k];
                    if(info.id === loginResult[i]._id){
                        var item = {
                            id: loginResult[i]._id,
                            name_cn: loginResult[i].name_cn,
                            bindId: loginResult[i].bindId
                        };
                        $proBox = _this.createProItem(item, userId);
                        _this.$projectList.prepend($proBox);
                    }
                }
            }
        }).always(function (){
            Spinner.stop();
        });
    };

    FactoryLogin.prototype.createProItems = function (i, loginResult) {
        var _this = this;
        item = loginResult[i];
        itemLocalList = {
            id: item.id ? item.id : item._id,
            name_cn: item.name_cn,
            bindId: item.bindId
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
        var itemId = item.bindId ? item.bindId : '';
        $projectBox = $('<div class="divHover proHover" projectId=' + item.id + ' configProjId=' + itemId + '>\
                    <span class="proText"></span>\
                    <div class="spanBox">\
                    <span class="glyphicon glyphicon-edit editPro" title=' + I18n.resource.admin.welcom.yourProj.EDITE_PRO + ' id="editPro' + item.id + '"></span>\
                    <span class="glyphicon glyphicon-share-alt exportPro" title=' + I18n.resource.admin.welcom.yourProj.EXPORT + ' id="exportPro' + item.id + '" style="display:none;"></span>\
                    <span class="glyphicon glyphicon-upload proTop" title=' +  I18n.resource.admin.welcom.yourProj.TOP + '></span>\
                    <span class="glyphicon glyphicon-remove-sign deletePro" title=' + I18n.resource.admin.welcom.yourProj.DELETE + ' id="deletePro_' + item.id + '"></span>\
                    <span class="glyphicon glyphicon-user editAuth" data-id="' + item.id + '" title=' + I18n.resource.admin.welcom.yourProj.EDIT_AUTH + '></span>\
                    </div>\
                    <br style="clear:both"/></div>');
        if(itemId !== ""){
            $projectBox.find('.proText').html(item.name_cn+' ('+itemId+')').attr('title', item.name_cn);
            $projectBox.find('.proText').addClass('bindPro');
        }else{
            $projectBox.find('.proText').html(item.name_cn).attr('title', item.name_cn);
        }
        $projectBox.find('.proText').off('dblclick').dblclick(function (e) {
            var $this = $(this);
            var parentBindId =$this.parent('.divHover').attr('configprojid');
            var nameCnText = $this.html().split(" ")[0].trim();
            item.bindId = parentBindId ? parentBindId : item.bindId;
            var $empty = $('.searchProject').find(".searchSpan");
            $empty.trigger("click");
            $('#modalframe').hide();
            $("#pageTypesBox").hide();
            $("#myFrame").hide();
            //$('#mainframe').show();
            I18n.fillArea($('#mainframe').fadeIn());
            if(item.name_cn!==nameCnText){
                item.name_cn = nameCnText;
            }
            new FactoryScreen().show(item);
        });

        $projectBox.find('.editPro').off('click').click(function () {
            _this.editProjId = item.id;
            _this.editProjName = item.name_cn;
            _this.configProjId = item.bindId;
            AddProModal.show(_this);
        });

        $projectBox.find('.deletePro').off('click').click(function () {
            var projectId = this.id.split('_')[1];
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
            WebAPI.get('/factory/getProjectUser/' + projId).done(function (rs) {
                MemberSelectedModal.setState({
                    selectedUser: rs.data
                }).show(function (userList) {
                    if (userList.length <= 0) {
                        alert('Please select at least one user!');
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
            });
        });
        return $projectBox;
    };

    FactoryLogin.prototype.removeProItem = function (projectId) {
        var $removeProModal =$('#removeProModal');
        var password = $('#removePass').val();
        if (password === '') {
            $removeProModal.find('.wrongPromt').html(I18n.resource.admin.login.PANE_PLACEHOLDER_PWD);
        } else {
            $removeProModal.find('.wrongPromt').html('');
            var postData = {
                userId: AppConfig.userId,
                projId: projectId,
                proPass: password
            };
            WebAPI.post('/factory/removeProject/remove', postData).done(function (result) {
                if (result.status === 'OK') {
                    alert(result.msg);
                    $removeProModal.remove();
                    var arr = JSON.parse(localStorage.getItem('fac_project_topArray_' + AppConfig.userId));
                    if (arr) {
                        if (arr.length!==0) {
                            for (var i = 0; i < arr.length; i++) {
                                if ( projectId === arr[i].id ) {
                                    arr.splice(i, 1);
                                    localStorage.setItem('fac_project_topArray_' + AppConfig.userId, JSON.stringify(arr));
                                    break;
                                }
                            }
                        }
                    }
                    $('.proHover').filter('[projectid="' + projectId + '"]').remove();
                    var $ProjectRecycle = $('#ulRecycleTabs').find("li[data-type='ProjectRecycle']").children('.divTab');
                    if($ProjectRecycle.hasClass('divCheck')){
                        $ProjectRecycle.trigger('click');
                    }
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

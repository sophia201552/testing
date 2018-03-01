/**
 * Created by liqian on 2015/5/13.
 */
var ProjectPermissionManager = (function () {
    function ProjectPermissionManager() {
        this.viewSource = "/static/views/admin/userManager/projectPermissionManager.html";
        this.managerCtrl = new UserManagerController();
        this.$container = $();
        this.pageViewModel = {};
        this.i18 = I18n.resource.admin.panelManagement;
    }

    ProjectPermissionManager.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get(this.viewSource).done(function (resultHtml) {
                _this.$container = $('#permissionManageWrapper').html(resultHtml).find('#permissionManage');
                $("#manageTab li[screen='AccountManager']").remove();
                $("#manageTab").show();
                $("#panelContentWrapper").hide();
                _this.init();
                I18n.fillArea($(ElScreenContainer));
            }).always(function () {
            });
        },
        setPermissionManagerHeight: function () {
            $("#panelContentWrapper").height($(window).height() - $(".navbar").height() - 62);
            $("#projectCon").height($(window).height() - $(".navbar").height() - 185);
        },
        init: function () {
            this.setPermissionManagerHeight();
            $("#panelContentWrapper").show();
            this.loadProjectPermission();
        },
        attachEvents: function () {
            var _this = this,
                $isDelUserWin = $("#isDelUserWin"),
                deleteUserId = null,
                roleOfDeleteUser = null,
                $permissionManage = $('#permissionManage');
            $('#selectProject').change(function () {
                if (this.value) {
                    $('.proCompany').hide();
                    $('#' + this.value).show();
                } else {
                    $('.proCompany').show();
                }
            });

            //页面管理-点击添加项目按钮跳转到新项目页面
            $("#addProject").click(function () {
                ScreenManager.show(PaneProjectCreator);
            });

            $("#permissionManage").off().on("mouseover", '.proUser', function () { //页面管理-人物图划过显示删除按钮
                var $this = $(this);
                if ($this.attr('userId') != AppConfig.userId) { // 用户不能删除自己
                    $(this).find(".closed").show();
                }
            }).on("mouseout", '.proUser', function () { //页面管理-人物图划出隐藏删除按钮
                $(this).find(".closed").hide();
            }).on("click", '.closed', function () {//点击页面管理的图片删除按钮，弹出确认是否删除窗口
                var $this = $(this);
                deleteUserId = $this.attr('userId');
                roleOfDeleteUser = $this.attr('roleId');
                _this.managerCtrl.setFloatingWin($isDelUserWin, 300);
            }).on("click", '.addGroup', function () {//点击添加分组弹出分组模态窗口
                var $this = $(this);
                $("#groupName").val("");
                $("#groupNameInfo").hide();
                $(".proCompany>ul").removeClass("isAdd");
                $this.parents(".addGroupWrapper").prev("ul").addClass("isAdd");
                var obj = $('#addGroupWin');
                $(".modal-dialog").css({
                    'top': ($(window).height() - 300) / 2
                });
                obj.modal();
            }).on('click', '.modify-btn', function () {
                var $this = $(this), projectId = $this.data('project-id');
                if (!BEOPUtil.isUndefined(projectId)) {
                    ScreenManager.show(PaneProjectCreator, projectId);
                }
            });

            $isDelUserWin.off().on("click", ".btn-primary", function () {
                if (!BEOPUtil.isUndefined(deleteUserId) && !BEOPUtil.isUndefined(roleOfDeleteUser)) {
                    WebAPI.post('/admin/deleteRoleUser', {
                        'roleId': roleOfDeleteUser,
                        'userId': deleteUserId
                    }).done(function (result) {
                        if (result.success) {
                            $permissionManage.find('.proList[roleId="' + roleOfDeleteUser + '"] .proUser[userId="' + deleteUserId + '"]').remove();
                            $isDelUserWin.modal("hide");
                        }
                    }).fail(function () {

                    })
                }
            });

            //点击添加分组弹出分组模态窗口的确认按钮
            $('#addGroupWin').off().on("click", ".addGroupWinOK", function () {
                var $addGroupWin = $('#addGroupWin');
                var $roleNameInput = $("#groupName");
                var $groupNameInfo = $("#groupNameInfo");
                if ($roleNameInput.val() == "") {
                    $groupNameInfo.text(_this.i18.GROUP_NAME_NOTNULL).show();
                    return false;
                } else {
                    var projectId = $('.isAdd').parent('.proCompany').attr('id');
                    var groupNameArr = [];
                    $("#" + projectId).find(".role").each(function () {
                        groupNameArr.push($(this).text());
                    });
                    if ($.inArray($roleNameInput.val(), groupNameArr) >= 0) {
                        $groupNameInfo.text(_this.i18.GROUPINGNAME_NOT_REPEAT).show();
                        return false;
                    } else {
                        $groupNameInfo.hide();
                        WebAPI.post('/admin/addProjectRole', {
                            'projectId': projectId,
                            'roleName': $roleNameInput.val(),
                            'userId': AppConfig.userId
                        }).done(function (result) {
                            if (result.success) {
                                _this.loadProjectPermission().done(function (result) {
                                    if (result.success) {
                                        $addGroupWin.modal("hide");
                                    }
                                });
                            }
                        });
                        $roleNameInput.val("");
                    }
                }
            });

            //点击页面管理的删除按钮弹出确认是否删除弹出模态窗口
            $("#projectCon").off().on("click", ".delCon", function () {
                var $this = $(this);
                var $op = $this.parents(".proListWrapper");
                var wh = $(window).height();
                var $isDelWin = $('#isDelWin');
                var top = (wh - 300) / 2;
                $(".proListWrapper").removeClass("isDel");
                $op.addClass("isDel");
                var dataRoleId = $this.attr("data-roleid");
                var dataProjectid = $this.attr("data-projectid");
                $("#isDelWin").attr("data-roleid", dataRoleId).attr("data-projectid", dataProjectid);
                $(".modal-dialog").css({
                    'top': top
                });
                $isDelWin.modal();
            });

            //点击是否删除弹出模态窗口的确认按钮删除当前行
            $('#isDelWin').off().on("click", ".btn-primary", function () {
                var $isDelWin = $('#isDelWin');
                $isDelWin.modal("hide");
                var $isDel = $("#projectCon .isDel");
                var projectId = $isDelWin.attr('data-projectid');
                var roleId = $isDelWin.attr('data-roleid');
                WebAPI.post('/admin/deleteProjectRole', {
                    'projectId': projectId,
                    'roleId': roleId,
                    'userId': AppConfig.userId
                }).done(function (result) {
                    if (result.success) {
                        $isDelWin.attr('data-projectid', "").attr('data-roleid', "");
                        $isDel.remove();
                    } else {
                        var alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[result.code]);
                        alert.showAtTop(2000);
                    }

                }).fail(function () {
                    var alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code['0']);
                    alert.showAtTop(2000);
                })
            });

            //查询人员
            $("#searchProjectUser").keyup(function (e) {
                var $listNameAll = $("#userList .listName");
                for (var i = 0; i < $listNameAll.length; i++) {
                    var $listName = $listNameAll.eq(i);
                    if (($listName.text().toLowerCase()).indexOf($(this).val().toLowerCase()) < 0) {
                        $listName.parents("li").hide();
                    } else {
                        $listName.parents("li").show();
                    }
                }
            });

            //拖拽员工列表
            $('#userList li').each(function () {
                this.draggable = true;
                this.ondragstart = function (e) {
                    var $this = $(this);
                    var userInfo = {
                        userId: $this.attr('userid'),
                        userName: $this.find(".listName").text(),
                        userPic: $this.attr("userPic")
                    };
                    $("#dragObj").val("user");
                    e.dataTransfer.setData("user", JSON.stringify(userInfo));
                };
            });

            //拖拽项目列表中的员工列表
            $('.proUser').each(function () {
                this.draggable = true;
                this.ondragstart = function (e) {
                    var $this = $(this);
                    var userInfo = {
                        userId: $this.attr('userid'),
                        userName: $this.find(".userName").text(),
                        userPic: $this.find("img").attr("src"),
                        roleid: $this.closest(".proList").attr("roleid")
                    };
                    $("#dragObj").val("itemUser");
                    e.dataTransfer.setData("itemUser", JSON.stringify(userInfo));
                };
            });

            $('.proList').each(function () {
                this.ondragover = function (e) {
                    e.preventDefault();
                };
                this.ondrop = _this.dropUserToRoleEvent;
            });

            //点击benchmark配置页面按钮弹出窗口
            $("#projectCon").off('click', '.benchmark-btn').on('click', '.benchmark-btn', function () {
                Spinner.spin(ElScreenContainer);
                var $this = $(this);
                var projectId = $this.data('project-id');
                WebAPI.post('/admin/loadBenchmarkMenu', {projectId: projectId}).done(function (result) {
                    if (result.success) {
                        var data = result.data,
                            nav = data.nav,
                            $menuTree,
                            $benchmarkSet = $('#benchmarkSet');
                        if (nav && nav.length) {
                            $menuTree = _this.buildMenuTree(nav, 'benchmarkMenuTreeItemTmpl');
                            $benchmarkSet.find('.winCon').empty().append($menuTree);
                            $benchmarkSet.find('#saveBenchmarkMenu').attr('project-id', projectId);
                            _this.renderTreeView();
                        } else {
                            $benchmarkSet.find('.winCon').empty().append(_this.i18.MENU_NOT_CONFIGURED + '！');
                        }
                        I18n.fillArea($(ElScreenContainer));
                        $benchmarkSet.modal();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });

            $('#saveBenchmarkMenu').click(function () {
                var $benchmarkSet = $('#benchmarkSet');
                if ($benchmarkSet.find('.winCon ul').size() === 0) {
                    $benchmarkSet.modal('hide');
                    return false;
                }
                var benchmarkNavChecked = $benchmarkSet.find('input.benchmarkNav:checked').map(function () {
                    return $(this).val()
                }).get();

                var $this = $(this);
                var projectId = $this.attr('project-id');
                $this.button('loading');
                WebAPI.post('/admin/savePageMenu', {
                    projectId: projectId,
                    benchmarkList: benchmarkNavChecked
                }).done(function (result) {
                    if (result.success) {
                        var alert = new Alert($benchmarkSet.find('.modal-content').get(0), Alert.type.success, I18n.resource.code[result.code]);
                        alert.showAtTop(2000);
                        setTimeout(function () {
                            $benchmarkSet.modal('hide');
                        }, 1000);
                    }
                }).always(function () {
                    $this.button('reset');
                    I18n.fillArea($(ElScreenContainer));
                });
            });

            //点击配置页面按钮弹出窗口
            $("#projectCon").off('click', '.setPage').on('click', '.setPage', function () {
                Spinner.spin(ElScreenContainer);
                var wh = $(window).height();
                var top = (wh - 800) / 2;
                $("#pageSet .modal-dialog").css({
                    'top': top
                });
                var $this = $(this);
                var projectId = $this.data('projectid'), roleId = $this.data('roleid');
                WebAPI.post('/admin/loadPageMenu', {projectId: projectId, roleId: roleId}).done(function (result) {
                    if (result.success) {
                        var data = result.data,
                            nav = data.nav,
                            $menuTree,
                            $pageSet = $('#pageSet');
                        if (nav && nav.length) {
                            $menuTree = _this.buildMenuTree(nav);
                            $pageSet.find('.winCon').empty().append($menuTree);
                            $pageSet.find('#savePageMenu').attr('project-id', projectId).attr('role-id', roleId);
                            _this.renderTreeView();
                        } else {
                            $pageSet.find('.winCon').empty().append(_this.i18.MENU_NOT_CONFIGURED + '！');
                        }
                        I18n.fillArea($(ElScreenContainer));
                        $pageSet.modal();
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });

            //点击权限管理按钮弹出窗口
            $("#projectCon").off('click', '.permissionManage').on('click', '.permissionManage', function () {
                var $this = $(this), $setPermissionWin = $("#setPermissionWin");
                $setPermissionWin.attr({
                    "data-roleId": $this.attr("data-roleid")
                });
                $("#dashboardEditPermission")[0].checked = $this.attr("permission-dashboard") ? true : false;
                $("#menuEditPermission")[0].checked = $this.attr("permission-menu") ? true : false;
                $("#debugToolsPermission")[0].checked = $this.attr("permission-debug-tools") ? true : false;
                $setPermissionWin.modal();
            });

            //点击权限管理按钮弹出窗口确定按钮
            $("#savePermissionSetBtn").off().on('click', function () {
                Spinner.spin(ElScreenContainer);
                var $setPermissionWin = $("#setPermissionWin"), role_project_id = $setPermissionWin.attr("data-roleid");
                var permission_dashboard = $("#dashboardEditPermission").is(':checked') ? "c_dashboard" : "";
                var permission_menu = $("#menuEditPermission").is(':checked') ? "c_menu" : "";
                var permission_debug_tools = $("#debugToolsPermission").is(':checked') ? "c_debug_tools" : "";
                WebAPI.post('/admin/configurePermission', {
                    role_project_id: role_project_id,
                    permission_dashboard: permission_dashboard,
                    permission_menu: permission_menu,
                    permission_debug_tools: permission_debug_tools
                }).done(function (result) {
                    if (result.success) {
                        var permissionBtn = $("#projectCon").find(".permissionManage[data-roleid=" + role_project_id + "]");
                        permissionBtn.attr("permission-dashboard", permission_dashboard);
                        permissionBtn.attr("permission-menu", permission_menu);
                        permissionBtn.attr("permission-debug-tools", permission_debug_tools);
                        $setPermissionWin.modal("hide");
                    }
                }).always(function () {
                    Spinner.stop();
                });
            });

            //绑定页面管理-配置页面按钮的复选框事件
            $("#pageSet").off().on("click", 'input:checkbox', function () {
                var $this = $(this);
                var parent_liL = $this.parents(".parent_li").length;
                if (parent_liL) { // 有叶子节点
                    var $rootSpan = $this.parents(".parent_li").children("span");
                    var $checkboxRoot = $rootSpan.find("input:checkbox");
                    var $checkboxLeaf = $this.closest(".parent_li").find("ul").find("input:checkbox");
                    var iL = $this.parents("label").prev("i").length;
                    if ($this.is(':checked')) { //复选框勾上
                        if (iL) {//有下级节点
                            $checkboxLeaf.each(function () {
                                this.checked = true;
                            });
                            $checkboxRoot.each(function () {
                                this.checked = true;
                            });
                        } else {//叶子节点，无下级节点
                            $checkboxRoot.each(function () {
                                this.checked = true;
                            });
                        }
                    } else {  //复选框取消选中
                        if (iL) {//有下级节点
                            $checkboxLeaf.each(function () {
                                this.checked = false;
                            });
                        }
                    }
                }
            });

            $('#savePageMenu').click(function () {
                var $pageSet = $('#pageSet');
                if ($pageSet.find('.winCon ul').size() === 0) {
                    $pageSet.modal('hide');
                    return false;
                }
                var allTopNavChecked = $pageSet.find('input.topNav:checked').map(function () {
                    return $(this).val()
                }).get();
                var allFuncNavChecked = $pageSet.find('input.funcNav:checked').map(function () {
                    return $(this).val()
                }).get();

                var $this = $(this);
                var projectId = $this.attr('project-id'), roleId = $this.attr('role-id');
                $this.button('loading');
                WebAPI.post('/admin/savePageMenu', {
                    projectId: projectId,
                    roleId: roleId,
                    topNavList: allTopNavChecked,
                    funcNavList: allFuncNavChecked
                }).done(function (result) {
                    if (result.success) {
                        var alert = new Alert($pageSet.find('.modal-content').get(0), Alert.type.success, I18n.resource.code[result.code]);
                        alert.showAtTop(2000);
                        setTimeout(function () {
                            $pageSet.modal('hide');
                        }, 1000);
                    }
                }).always(function () {
                    $this.button('reset');
                    I18n.fillArea($(ElScreenContainer));
                });
            });

            $(window).on("resize.permissionManager", function () {
                _this.setPermissionManagerHeight();
                _this.setUserListPosition();
            });
        },
        detachEvents: function () {
            $(window).off("resize.permissionManager");
        },
        close: function () {
            this.detachEvents();
        },
        dropUserToRoleEvent: function (e) {
            Spinner.spin(ElScreenContainer);
            e.preventDefault();
            var $target = $(e.target);
            var dragObjStr = $("#dragObj").val();
            if (!$target.hasClass('proList')) {
                $target = $target.closest('.proList');
            }
            if (dragObjStr == "user") {
                var data = JSON.parse(e.dataTransfer.getData("user"));
            } else {
                var data = JSON.parse(e.dataTransfer.getData("itemUser"));
            }
            var isExisted = false;
            if (!data) {
                Spinner.stop();
                return;
            }
            $target.find('.userId').each(function () {
                if ($(this).attr('userid') == data.userId) {
                    isExisted = true;
                    Spinner.stop();
                    return;
                }
            });
            if (!isExisted) {
                var roleId = $target.attr('roleId');
                if (dragObjStr == "itemUser") {
                    if (AppConfig.userId == data.userId) {//角色中不能拖拽用户自己
                        Spinner.stop();
                        return false;
                    }
                    var dragRoleId = data.roleid;
                    if (roleId === dragRoleId) {//自己的角色中不能拖拽到自身中
                        Spinner.stop();
                        return false;
                    }
                }

                if (typeof data.userId === typeof undefined || typeof roleId === typeof undefined) {
                    Spinner.stop();
                    return false;
                }
                if (dragObjStr == "user") {
                    WebAPI.post('/admin/addRoleUser', {
                        roleId: roleId,
                        userId: data.userId
                    }).done(function (result) {
                        if (result.success) {
                            data.roleId = roleId;
                            $target.find('.userList').append(beopTmpl('proUserTmpl', data));
                            $target.find('.proUser').each(function () {
                                this.draggable = true;
                                this.ondragstart = function (e) {
                                    var $this = $(this);
                                    var userInfo = {
                                        userId: $this.attr('userid'),
                                        userName: $this.find(".userName").text(),
                                        userPic: $this.find("img").attr("src"),
                                        roleid: $this.closest(".proList").attr("roleid")
                                    };
                                    $("#dragObj").val("itemUser");
                                    e.dataTransfer.setData("itemUser", JSON.stringify(userInfo));
                                };
                            });
                        }
                        return false;
                    }).fail(function () {
                        var alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.panelManagement.REQUEST_ERROR);
                        alert.showAtTop(2000);
                    }).always(function () {
                        I18n.fillArea($(ElScreenContainer));
                        Spinner.stop();
                    })
                } else {
                    WebAPI.post('/admin/deleteRoleUser', {
                        'roleId': dragRoleId,
                        'userId': data.userId
                    }).then(function (result) {
                        if (result.success) {
                            $("#permissionManage").find('.proList[roleId="' + dragRoleId + '"] .proUser[userId="' + data.userId + '"]').remove();
                            $("#isDelUserWin").modal("hide");
                        }
                        WebAPI.post('/admin/addRoleUser', {
                            roleId: roleId,
                            userId: data.userId
                        }).done(function (result) {
                            if (result.success) {
                                data.roleId = roleId;
                                $target.find('.userList').append(beopTmpl('proUserTmpl', data));
                                $target.find('.proUser').each(function () {
                                    this.draggable = true;
                                    this.ondragstart = function (e) {
                                        var $this = $(this);
                                        var userInfo = {
                                            userId: $this.attr('userid'),
                                            userName: $this.find(".userName").text(),
                                            userPic: $this.find("img").attr("src"),
                                            roleid: $this.closest(".proList").attr("roleid")
                                        };
                                        $("#dragObj").val("itemUser");
                                        e.dataTransfer.setData("itemUser", JSON.stringify(userInfo));
                                    };
                                });
                            }
                            return false;
                        }).fail(function () {
                            var alert = new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.admin.panelManagement.REQUEST_ERROR);
                            alert.showAtTop(2000);
                        }).always(function () {
                            I18n.fillArea($(ElScreenContainer));
                            Spinner.stop();
                        })
                    });
                }


            }
        },
        loadProjectPermission: function () {
            var _this = this;
            return WebAPI.post('/admin/loadProjectPermission', {'userId': AppConfig.userId}).done(function (result) {
                if (result.success) {
                    _this.pageViewModel = result.data;
                    _this.renderSelectProject();
                    _this.renderUserList();
                    _this.renderProjectList();
                    _this.attachEvents();
                    I18n.fillArea($(ElScreenContainer));
                }
            }).always(function () {
                Spinner.stop();
            })
        },
        setUserListPosition: function () {
            var $manageTab = $("#manageTab");
            $("#staffList").css({
                "left": $manageTab.width() + 30
            });
        },
        renderSelectProject: function () {
            var compiledTemplate = beopTmpl('selectProjectListTmpl', this.pageViewModel);
            $('#selectProject').html(compiledTemplate)
        },
        renderUserList: function () {
            var compiledTemplate = beopTmpl('userListTmpl', this.pageViewModel);
            $('#userList').html(compiledTemplate);
            this.setUserListPosition();
            $("#staffList").show(); //处理浮动框显示bug
        },
        renderProjectList: function () {
            var compiledTemplate = beopTmpl('permissionManageTmpl', this.pageViewModel);
            $('#projectCon').html(compiledTemplate);
        },
        buildMenuTree: function (nav, template) {
            var buildMenuTreeItem = function (item) {
                return beopTmpl(template ? template : 'menuTreeItemTmpl', item);
            };
            var $html = $('<ul></ul>');
            for (var i = 0, length = nav.length; i < length; i++) {
                var root = nav[i];
                var $root = $(buildMenuTreeItem(root));
                $root.append(this.managerCtrl.buildSubTree(buildMenuTreeItem, root));
                $html.append($root);
            }
            return $html;
        },
        renderTreeView: function () {
            $('.tree li:has(ul)').addClass('parent_li').find(' > span');
            $('.tree li.parent_li > span > i').on('click', function (e) {
                var children = $(this).closest('li.parent_li').find(' > ul > li');
                if (children.is(":visible")) {
                    children.hide('fast');
                    $(this).parent('span').find(' > i').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
                } else {
                    children.show('fast');
                    $(this).parent('span').find(' > i').addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
                }
                e.stopPropagation();
            });
        }
    };
    return ProjectPermissionManager;
})();
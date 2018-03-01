/**
 * Created by liqian on 2015/5/13.
 */
var ProjectPermissionManager = (function () {
    var _this;

    function ProjectPermissionManager() {
        _this = this;
        this.viewSource = "/static/views/admin/userManager/projectPermissionManager.html";
        this.managerCtrl = new UserManagerController();
        this.$container = $();
        this.pageViewModel = {};
        this.currentProjectId = AppConfig.projectId ? AppConfig.projectId : null;
        this.i18 = I18n.resource.admin.panelManagement;
    }

    ProjectPermissionManager.prototype = {
        show: function () {
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
            this.loadProjectPermission().done(function () {
                _this.renderProjectSelector(_this.pageViewModel.projectList);
            });
        },
        getProjectById: function (projectId) {
            for (var m = 0; m < this.pageViewModel.projectList.length; m++) {
                if (this.pageViewModel.projectList[m].id == projectId) {
                    return this.pageViewModel.projectList[m];
                }
            }
        },
        attachEvents: function () {
            var $isDelUserWin = $("#isDelUserWin"),
                deleteUserId = null,
                roleOfDeleteUser = null,
                $permissionManage = $('#permissionManage');
            $('#selectProject').off().change(function () {
                _this.$selectProject.select2('destroy');
                _this.$selectProject.select2();
                _this.currentProjectId = this.value;
                _this.renderPage();
            });

            //页面管理-点击添加项目按钮跳转到新项目页面
            $("#addProject").click(function () {
                ScreenManager.show(PaneProjectCreator);
                AppConfig.systemEntrance = 'add';
            });

            $permissionManage.off().on("mouseover", '.proUser', function () { //页面管理-人物图划过显示删除按钮
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
                AppConfig.systemEntrance = 'edit';
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
                        Spinner.spin(ElScreenContainer);
                        WebAPI.post('/admin/addProjectRole', {
                            'projectId': projectId,
                            'roleName': $roleNameInput.val(),
                            'userId': AppConfig.userId
                        }).done(function (result) {
                            if (result.success) {
                                $addGroupWin.modal("hide");

                                _this.loadProjectPermission().always(function () {
                                    Spinner.stop();
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
                $isDelWin.attr("data-roleid", $this.attr("data-roleid")).attr("data-projectid", $this.attr("data-projectid"));
                $(".modal-dialog").css({
                    'top': top
                });
                $isDelWin.modal();
            });

            //点击是否删除弹出模态窗口的确认按钮删除当前行
            $('#isDelWin').off().on("click", ".btn-primary", function () {
                var $isDelWin = $('#isDelWin').modal("hide");
                var projectId = $isDelWin.attr('data-projectid');
                var roleId = $isDelWin.attr('data-roleid');
                WebAPI.post('/admin/deleteProjectRole', {
                    'projectId': projectId,
                    'roleId': roleId,
                    'userId': AppConfig.userId
                }).done(function (result) {
                    if (result.success) {
                        $isDelWin.attr('data-projectid', "").attr('data-roleid', "");
                        $("#projectCon .isDel").remove();
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

            //点击删除项目按钮
            $("#projectCon").off('click', '.delete-btn').on('click', '.delete-btn', function () {
                var $this = $(this);
                var projectId = $this.attr('data-project-id');
                confirm(I18n.resource.admin.panelManagement.DELETE_PROJECT_SURE, function () {
                    WebAPI.post('/admin/deleteProject', {
                        'projectId': projectId
                    }).done(function (result) {
                        if (result.success) {
                            alert(I18n.resource.common.DELETE_SUCCESS);
                            $("#" + projectId).remove();
                            for (var i = 0; i < _this.pageViewModel.projectList.length; i++) {
                                if (_this.pageViewModel.projectList[i].id == projectId) {
                                    _this.pageViewModel.projectList.splice(i, 1);
                                    break;
                                }
                            }

                            for (var j = 0; j < AppConfig.projectList.length; j++) {
                                if (AppConfig.projectList[j].id == projectId) {
                                    AppConfig.projectList.splice(j, 1);
                                    break;
                                }
                            }
                            _this.currentProjectId = 'all';
                            _this.renderAllProject();

                            _this.renderProjectSelector(_this.pageViewModel.projectList);
                            I18n.fillArea($(ElScreenContainer));
                        } else {
                            alert(I18n.resource.common.DELETE_FAIL);
                        }
                    }).fail(function (e) {
                        console.log(e);
                    })
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
                WebAPI.post('/admin/savePageMenu', {
                    projectId: $this.attr('project-id'),
                    roleId: $this.attr('role-id'),
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
                    I18n.fillArea($(ElScreenContainer));
                });
            });

            $(window).on("resize.permissionManager", function () {
                _this.setPermissionManagerHeight();
                _this.setUserListPosition();
            });

            //点击配置项目
            $("#projectCon").off('click', '.config-btn').on('click', '.config-btn', function () {
                var projectId = $(this).data('project-id');
                ScreenManager.show(ConfigProject, projectId);
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
            var data;
            if (dragObjStr == "user") {
                data = JSON.parse(e.dataTransfer.getData("user"));
            } else {
                data = JSON.parse(e.dataTransfer.getData("itemUser"));
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

        renderProjectSelector: function (result) {
            var projectList = result.map(function (project) {
                return {
                    id: project.id,
                    text: project.projectName + ' (' + project.id + ')'
                }
            });
            _this.$selectProject = $("#selectProject").select2({data: projectList});
            _this.$selectProject.val(_this.currentProjectId).trigger('change');
        },

        renderPage: function () {
            this.renderUserList();
            if (!this.currentProjectId) {
                this.renderProject(this.pageViewModel.projectList[0]);
                this.currentProjectId = this.pageViewModel.projectList[0].id;
            } else if (this.currentProjectId == 'all') {
                this.renderAllProject();
            } else {
                this.renderProject(this.getProjectById(this.currentProjectId));
            }

            this.attachEvents();
            I18n.fillArea($(ElScreenContainer));
        },

        loadProjectPermission: function () {
            return WebAPI.post('/admin/loadProjectPermission', {'userId': AppConfig.userId}).done(function (result) {
                if (result.success) {
                    _this.pageViewModel = result.data;
                    _this.renderPage();
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
        renderUserList: function () {
            var compiledTemplate = beopTmpl('userListTmpl', this.pageViewModel);
            $('#userList').html(compiledTemplate);
            this.setUserListPosition();
            $("#staffList").show(); //处理浮动框显示bug
        },

        renderAllProject: function () {
            var $projectContent = $('#projectCon').empty();
            for (var m = 0, mLen = this.pageViewModel.projectList.length; m < mLen; m++) {
                $projectContent.append(beopTmpl('tpl_project_manage', {
                    project: this.pageViewModel.projectList[m]
                }))
            }
            I18n.fillArea($('#permissionManage'));
        },
        renderProject: function (project) {
            if (!project) {
                alert('can\'t find this project');
                return;
            }
            $('#projectCon').html(beopTmpl('tpl_project_manage', {
                project: project
            }));
            I18n.fillArea($('#permissionManage'));
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
})
();
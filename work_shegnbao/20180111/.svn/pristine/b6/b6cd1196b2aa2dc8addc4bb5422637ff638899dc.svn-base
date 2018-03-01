(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task_team.html',
            settable_map: {
                teamModel: true
            },
            teamModel: null,
            spEventActivities: {}
        },
        stateMap = {
            hasTeamFlag: false, //是否有团队
            team: null,
            process_select_person: null,
            user_type: '',
            TEAM: {
                name: '',
                desc: '',
                tags: [],
                teamStructure: [],
                teamProcess: []
            }
        },
        jqueryMap = {},
        setJqueryMap, configModel, init,
        wfTeamEdit, wfTeamEditConfirm, wfDeleteItem, wfDeleteTeam, wfTeamShow, quiteTeam, toggleIsShow,
        wfTeamCreateConfirm, wfTeamEditCancel, wfTeamCreatePage, returnAddTeamPage, hasCreateTeamPermission,
        disableOtherMenu;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $wf_team_wrapper: $("#wf_team_wrapper"),
            $wf_team_create_confirm: $("#wf_team_create_confirm"),
            $wf_team_tags_wrapper_box: $("#wf_team_tags_wrapper_box"),
            $team_structure_box: $("#team_structure_box"),
            $wf_team_process: $("#wf_team_process")
        };
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container) {
        Spinner.stop();
        stateMap.$container = $container;
        stateMap.$container.off('click.wf_team_edit').on('click.wf_team_edit', '#wf_team_edit', wfTeamEdit);
        stateMap.$container.off('click.wf_team_edit_confirm').on('click.wf_team_edit_confirm', '#wf_team_edit_confirm', wfTeamEditConfirm);
        stateMap.$container.off('click.wf-delete').on('click.wf-delete', '.wf-delete', wfDeleteItem);
        stateMap.$container.off('click.wf_add_team').on('click.wf_add_team', '#wf_add_team', wfTeamCreatePage);
        stateMap.$container.off('click.delete_team').on('click.delete_team', '#delete_team', wfDeleteTeam);
        stateMap.$container.off('click.wf_team_create_confirm').on('click.wf_team_create_confirm', '#wf_team_create_confirm', wfTeamCreateConfirm);
        stateMap.$container.off('click.wf_team_edit_cancel').on('click.wf_team_edit_cancel', '#wf_team_edit_cancel', wfTeamEditCancel);
        stateMap.$container.off('click.wf_team_create_cancel').on('click.wf_team_create_cancel', '#wf_team_create_cancel', returnAddTeamPage);
        stateMap.$container.off('click.wf_team_quite').on('click.wf_team_quite', '#wf_team_quite', quiteTeam);
        stateMap.$container.off('click.wf_toggle_is_show').on('click.wf_toggle_is_show', '.toggle-is-show', toggleIsShow);

        return WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            Spinner.spin(ElScreenContainer);
            return configMap.teamModel.getTeam().done(function (result) {
                if (result.success) {
                    var team = result.data.team;
                    stateMap.team = team;
                    stateMap.userType = result.data.user_type;
                    if (team) {
                        wfTeamShow(beop.constants.viewType.SHOW);
                    } else {
                        if (hasCreateTeamPermission()) {
                            jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_none'));
                        } else {
                            jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_none_without_permission'));
                        }
                        disableOtherMenu();
                    }
                }
                I18n.fillArea(stateMap.$container);
            }).always(function () {
                Spinner.stop();
            });
        });
    };

    //---------DOM事件------

    disableOtherMenu = function () {
        $('#wf-main-ul>li>a').attr('href', '#page=workflow&type=team').not(':last').css('cursor', 'not-allowed');
        $('#wf-main-ul>li').not(':last').css('opacity', '.3');
    };

    toggleIsShow = function () {
        var $this = $(this);
        if ($this.is('.icon-youzhankai')) {
            $this.removeClass('icon-youzhankai').addClass('icon-xiazhankai');
        } else {
            $this.removeClass('icon-xiazhankai').addClass('icon-youzhankai');
        }
    };

    returnAddTeamPage = function () {
        confirm(I18n.resource.workflow.team.SURE_EDIT_NEW_TEAM, function () {
            jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_none'));
            I18n.fillArea(stateMap.$container);
        });
    };

    wfTeamEdit = function () {
        wfTeamShow(beop.constants.viewType.EDIT, stateMap.team);
    };

    wfDeleteTeam = function () {
        confirm(I18n.resource.workflow.team.DEL_DATA_TEAM, function () {
            configMap.teamModel.deleteTeam($('.wf_team_box').attr('team_id')).done(function (result) {
                if (result) {
                    jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_none'));
                    alert.success(I18n.resource.common.DELETE_SUCCESS);
                }
            });
        });
    };

    wfTeamEditCancel = function () {
        jqueryMap.$wf_team_wrapper.empty().append(stateMap.contentFragment);
        jqueryMap.$wf_team_wrapper.removeClass('edit').addClass(beop.constants.viewType.SHOW);
    };

    wfTeamEditConfirm = function () {
        var formData = $('#wf_team_edit_form').serializeObject(), tags = formData['tags[]'];

        var data = {
            name: formData.name,
            desc: formData.desc,
            tags: formData['tags[]'],
            teamMember: beop.view.structure.getStructure(),
            process: beop.view.teamProcess.getTeamProcess(),
            creator: AppConfig.userId,
            teamId: stateMap.team._id
        };
        Spinner.spin(ElScreenContainer);
        configMap.teamModel.editTeam(data).done(function (result) {
            if (result.success) {
                return configMap.teamModel.getTeam().done(function (result) {
                    if (result.success) {
                        stateMap.team = result.data.team;
                        stateMap.userType = result.data.user_type;
                        wfTeamShow(beop.constants.viewType.SHOW);
                    }
                });
            }
        }).always(function () {
            Spinner.stop();
        });
    };

    wfTeamCreateConfirm = function () { // 创建团队提交
        var formData = $('#wf_team_create_form').serializeObject(), tags = formData['tags[]'];
        var structure = beop.view.structure.getStructure(), isCreatorInTeamMembers = false;
        structure.forEach(function (item) {
            item.members && item.members.forEach(function (member) {
                member.id && (member.id == AppConfig.userId) && (isCreatorInTeamMembers = true);
            })
        });

        if (!formData.name && !formData.desc && !isCreatorInTeamMembers && !tags) {
            alert.danger(I18n.resource.workflow.team.NOT_ADD_TEAM);
            return false;
        }
        if (!formData.name || !formData.desc) {
            alert.danger(I18n.resource.workflow.team.NAME_OR_CREATOR_EMPTY);
            return false;
        }
        if (!isCreatorInTeamMembers) {
            alert.danger(I18n.resource.workflow.team.MUST_TO_NEW_TEAM);
            return false;
        }

        var data = {
            name: formData.name,
            desc: formData.desc,
            tags: tags,
            teamMember: structure,
            process: beop.view.teamProcess.getTeamProcess(),
            creator: AppConfig.userId
        };

        //数据处理放在后端吧，前端js引用类型太XX
        configMap.teamModel.addTeam(data).done(function (result) {
            if (result.success) {
                var team = result.data.team;
                stateMap.team = team;
                stateMap.userType = result.data.user_type;
                if (team) {
                    wfTeamShow(beop.constants.viewType.SHOW);
                }
                var hrefList = ['#page=workflow&type=taskProject', '#page=workflow&type=transaction&subType=workingTask', '#page=workflow&type=calendar', '#page=workflow&type=activity&subType=today']
                $('#wf-main-ul>li>a').css({'cursor': 'pointer', 'opacity': '1'}).each(function (index) {
                    this.nodeType === 1 && this.setAttribute("href", hrefList[index]);
                });
            } else {
                infoBox.alert(I18n.resource.workflow.team.CREAT_TEAM_FAILED + result.data)
            }
        });
    };

    wfTeamShow = function (viewType, team) { // 团队显示  viewType 为页面显示类型
        var userType;
        if (stateMap.userType === beop.constants.archType.SUPER_ADMIN) {
            userType = 'super_admin'
        } else if (stateMap.userType === beop.constants.archType.ADMIN) {
            userType = 'admin'
        } else {
            userType = 'common'
        }

        if (viewType === 'edit') {
            stateMap.contentFragment = jqueryMap.$wf_team_wrapper.children();
        }

        jqueryMap.$wf_team_wrapper.removeClass('show edit').addClass(viewType);

        jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_' + viewType, {
            user_type: userType,
            team: stateMap.team
        }));

        setJqueryMap();
        beop.view.teamTagsCurd.init(jqueryMap.$wf_team_tags_wrapper_box, stateMap.team.tags, viewType);
        beop.view.structure.init(jqueryMap.$team_structure_box, stateMap.team.arch, viewType, team);

        stateMap.team.process.forEach(function (item) {
            item.nodes.forEach(function (node) {
                stateMap.team.arch.forEach(function (arch) {
                    if (arch.id == node.arch_id) {
                        node.archName = arch.name;
                    }
                })
            })
        });
        I18n.fillArea(stateMap.$container);
        beop.view.teamProcess.init(jqueryMap.$wf_team_process, stateMap.team.process, viewType);
    };

    wfTeamCreatePage = function () { // 团队创建页面显示
        jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_create'));
        setJqueryMap();
        beop.view.teamTagsCurd.init(jqueryMap.$wf_team_tags_wrapper_box, [], beop.constants.viewType.CREATE);
        beop.view.structure.init(jqueryMap.$team_structure_box, [], beop.constants.viewType.CREATE);
        beop.view.teamProcess.init(jqueryMap.$wf_team_process, [], beop.constants.viewType.CREATE);
        I18n.fillArea(stateMap.$container);
    };

    wfDeleteItem = function () {
        $(this).closest('.wf-delete-parent').remove();
    };

    //---------方法---------

    hasCreateTeamPermission = function () {
        return Permission.hasPermission('WorkOrder');
    };

    quiteTeam = function () {
        confirm(I18n.resource.workflow.team.TEAM_QUIT_MESSAGE, function () {
            configMap.teamModel.quiteTeam(stateMap.team._id).done(function (result) {
                if (result.success) {
                    alert(I18n.resource.workflow.team.TEAM_QUIT_SUCCESS);
                    window.location.reload();
                } else {
                    alert(I18n.resource.workflow.team.TEAM_QUIT_FAIL);
                }

            }).fail(function () {
                alert(I18n.resource.workflow.team.TEAM_QUIT_FAIL);
            });
        });
    };

    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.team = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

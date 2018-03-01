(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task_team.html',
            settable_map: {
                team_model: true
            },
            team_model: null,
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
        wfTeamEdit, wfTeamEditConfirm, wfDeleteItem, wfDeleteTeam, wfTeamShow,
        wfProcessCreateFinish, wfTeamCreateConfirm, wfTeamEditCancel, wfTeamCreatePage, returnAddTeamPage;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $wf_team_wrapper: $("#wf_team_wrapper"),
            $wf_add_team: $("#wf_add_team"),
            $wf_team_no_join: $("#wf_team_no_join"),
            $wf_team_edit: $("#wf_team_edit"),
            $wf_team_edit_confirm: $("#wf_team_edit_confirm"),
            $wf_team_create_confirm: $("#wf_team_create_confirm"),
            $wf_team_tags_wrapper_box: $("#wf_team_tags_wrapper_box"),
            $team_structure_box: $("#team_structure_box"),
            $wf_team_process: $("#wf_team_process"),
            $delete_team: $("#delete_team"),
            $wf_team_edit_cancel: $("#wf_team_edit_cancel"),
            $wf_team_create_cancel: $("#wf_team_create_cancel"),
            $wfTeamProcessContainer: null
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
        stateMap.$container.off('click.wf_process_create_finish').on('click.wf_process_create_finish', '#wf_process_create_finish', wfProcessCreateFinish);
        stateMap.$container.off('click.wf_team_create_confirm').on('click.wf_team_create_confirm', '#wf_team_create_confirm', wfTeamCreateConfirm);
        stateMap.$container.off('click.wf_team_edit_cancel').on('click.wf_team_edit_cancel', '#wf_team_edit_cancel', wfTeamEditCancel);
        stateMap.$container.off('click.wf_team_create_cancel').on('click.wf_team_create_cancel', '#wf_team_create_cancel', returnAddTeamPage);

        return WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();

            return configMap.team_model.getTeam().done(function (result) {
                if (result.success) {
                    var team = result.data.team;
                    stateMap.team = team;
                    stateMap.user_type = result.data.user_type;
                    if (team) {
                        wfTeamShow('show');
                    } else {
                        jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_none'));
                    }
                }
            });

        });
    };


    //---------DOM事件------
    returnAddTeamPage = function () {
        jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_none'));
    };

    wfTeamEdit = function () {
        wfTeamShow('edit');
    };

    wfDeleteTeam = function () {
        WebAPI.get('workflow/team/delete/' + $('.wf_team_box').attr('team_id')).done(function (result) {
            if (result) {
                jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_none'));
                alert("删除团队成功");
            }
        });
    };

    wfTeamEditCancel = function () {
        return configMap.team_model.getTeam().done(function (result) {
            if (result.success) {
                var team = result.data.team;
                stateMap.team = team;
                stateMap.user_type = result.data.user_type;
                wfTeamShow('show');
            }
        });
    };

    wfTeamEditConfirm = function () {
        var formData = $('#wf_team_edit_form').serializeObject(), tags = formData['tags[]'];
        if (!tags) {
            infoBox.alert('一个团队必须包含一个标签');
            return false;
        }
        var data = {
            name: formData.name,
            desc: formData.des,
            tags: formData['tags[]'],
            teamMember: beop.view.structure.getStructure(),
            process: beop.view.teamProcess.getTeamProcess(),
            creator: AppConfig.userId,
            teamId: $('.wf_team_box').attr('team_id')
        };

        WebAPI.post('workflow/team/edit', data).done(function (result) {
            if (result.success) {
                return configMap.team_model.getTeam().done(function (result) {
                    if (result.success) {
                        var team = result.data.team;
                        stateMap.team = team;
                        stateMap.user_type = result.data.user_type;
                        wfTeamShow('show');
                    }
                });
            }
        });
    };

    wfProcessCreateFinish = function () { // 创建流程完成

    };

    wfTeamCreateConfirm = function () { // 创建团队提交
        var formData = $('#wf_team_create_form').serializeObject(), tags = formData['tags[]'];
        if (!tags) {
            infoBox.alert('请填写标签名');
            return false;
        }
        var data = {
            name: formData.name,
            desc: formData.des,
            tags: formData['tags[]'],
            teamMember: beop.view.structure.getStructure(),
            process: beop.view.teamProcess.getTeamProcess(),
            creator: AppConfig.userId
        };
        //删除 nodes ach_type name
        data.process.forEach(function (process) {
            delete process.isNewProcess;
            process.nodes.forEach(function (node) {
                node.arch_type = node.arch_type.type;
            })
        });
        //数据处理放在后端吧，前端js引用类型太XX
        WebAPI.post('workflow/team/new', data).done(function (result) {
            if (result.success) {
                var team = result.data.team;
                stateMap.team = team;
                stateMap.user_type = result.data.user_type;
                if (team) {
                    wfTeamShow('show');
                }
            }
        });
    };

    wfTeamShow = function (viewType) { // 团队显示  viewType 为页面显示类型
        var user_type;
        if (stateMap.user_type === 1) {
            user_type = 'super_admin'
        } else if (stateMap.user_type === 2) {
            user_type = 'admin'
        } else {
            user_type = 'common'
        }
        jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_' + viewType, {
            'user_type': user_type,
            'team': stateMap.team
        }));
        setJqueryMap();
        beop.view.teamTagsCurd.init(jqueryMap.$wf_team_tags_wrapper_box, stateMap.team.tags, viewType);
        beop.view.structure.init(jqueryMap.$team_structure_box, stateMap.team.arch, viewType);
        stateMap.team.process.forEach(function (item) {
            item.nodes.forEach(function (node) {
                if (typeof node.arch_type != 'object') {
                    var arch_id = node.arch_id;
                    stateMap.team.arch.forEach(function (arch) {
                        if (arch.id == arch_id) {
                            node.arch_type = {
                                type: node.arch_type,
                                name: arch.name
                            };
                            return true;
                        }
                    })
                }
            })
        });
        beop.view.teamProcess.init(jqueryMap.$wf_team_process, stateMap.team.process, viewType);
    };

    wfTeamCreatePage = function () { // 团队创建页面显示
        jqueryMap.$wf_team_wrapper.empty().html(beopTmpl('tpl_wf_team_create'));
        setJqueryMap();
        beop.view.teamTagsCurd.init(jqueryMap.$wf_team_tags_wrapper_box, [], 'create');
        beop.view.structure.init(jqueryMap.$team_structure_box, [], 'create');
        beop.view.teamProcess.init(jqueryMap.$wf_team_process);
    };

    wfDeleteItem = function () {
        $(this).closest('.wf-delete-parent').remove();
    };


    //---------方法---------

    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.team = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));

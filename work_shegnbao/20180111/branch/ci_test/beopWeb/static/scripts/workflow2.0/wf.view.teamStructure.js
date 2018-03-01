(function (beop) {

    var stateMap = {
            structure: null,
            currentGroup: null,
            currentGroupId: null,
            viewType: '',
            selectedPeoples: {}
        },
        jqueryMap = {},
        setJqueryMap,
        init;

    var _structureShow, _wfGroupNameEdit, _wfGroupNameSave, _wfAddTeamGroup, _wfTeamGroupAddInput, _wfTeamPeopleAddWin,
        _renderStructure, _resetData, getStructureItem, addStructureItem, changeStructureItemName, getStructure,
        _getTeamId, getStructureById, initTeamProcess;


    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $wf_outline: $("#wf-outline"),
            $team_structure: $("#team_structure"),
            $wf_team_group_add_input: $("#wf_team_group_add_input"),
            $wf_team_groups_box: $("#wf_team_groups_box"),
            $wf_add_team_group: $("#wf_add_team_group")
        };
    };

    init = function ($box, structure, viewType, team) { // viewType 为团队页面的view 类型
        _resetData();
        if (!structure || !structure.length || structure.length < 2) {
            structure = [
                {
                    id: ObjectId(),
                    members: [],
                    type: beop.constants.archType.SUPER_ADMIN,
                    name: I18n.resource.workflow.team.USER_SUPER_ADMIN
                },
                {
                    id: ObjectId(),
                    members: [],
                    type: beop.constants.archType.ADMIN,
                    name: I18n.resource.workflow.team.USER_ADMIN
                }
            ]
        }
        stateMap.structure = structure;
        stateMap.$container = $box;
        stateMap.viewType = viewType;
        setJqueryMap();
        if (team) {
            stateMap.team = team;
        }
        stateMap.$container.off('click.wf-group-name-edit').on('click.wf-group-name-edit', '.wf-group-name-edit', _wfGroupNameEdit);
        stateMap.$container.off('click.wf-group-name-save').on('click.wf-group-name-save', '.wf-group-name-save', _wfGroupNameSave);
        stateMap.$container.off('click.wf_team_group_add_input').on('click.wf_team_group_add_input', '#wf_team_group_add_input', _wfTeamGroupAddInput);
        stateMap.$container.off('click.wf_team_group_add_input').on('click.wf_team_group_add_input', '#wf_team_group_add_input', _wfTeamGroupAddInput);
        stateMap.$container.off('click.wf-team-people-add').on('click.wf-team-people-add', '.wf-team-people-add', _wfTeamPeopleAddWin);
        stateMap.$container.off('keydown.wf_add_team_group').on('keydown.wf_add_team_group', '#wf_add_team_group', _wfAddTeamGroup);
        _structureShow();
        //加载团队流程
        initTeamProcess();
    };

    //---------方法---------
    initTeamProcess = function () {

    };
    _resetData = function () {
        stateMap.structure = null;
        stateMap.currentGroup = null;
        stateMap.currentGroupId = null;
        stateMap.viewType = '';
        stateMap.selectedPeoples = {};
    };

    _structureShow = function () { // opType - 标签的显示类型
        setJqueryMap();
        jqueryMap.$container.addClass(stateMap.viewType);
        jqueryMap.$container.append(beopTmpl('tpl_wf_team_structure', {
            'structure': stateMap.structure,
            'viewType': stateMap.viewType
        }));
    };

    getStructureItem = function (id) {
        for (var m = 0, n = stateMap.structure.length; m < n; m++) {
            if (stateMap.structure[m].id == id) {
                return stateMap.structure[m];
            }
        }
    };

    addStructureItem = function (item) {
        if (!item.name || !item.name) {

        }
        stateMap.structure.push({
            id: item.id,
            name: item.name,
            members: [],
            type: beop.constants.archType.MEMBER
        });
    };

    changeStructureItemName = function (id, name) {
        var item = getStructureItem(id);
        if (!item) {
            return false;
        }
        if (!name || !name.trim()) {
            alert(I18n.resource.workflow.team.TEAM_NAME_EMPTY);
            return false;
        }

        item.name = name;
    };

    getStructure = function () {
        return stateMap.structure;
    };
    getStructureById = function (id) {
        var result = {};
        stateMap.structure.forEach(function (item) {
            if (item.id == id) {
                result = $.extend(true, {}, item);
                return true;
            }
        });
        return result;
    };


    //---------DOM操作------

    _getTeamId = function ($dom) {
        if (!$dom.hasClass('form-team')) {
            $dom = $dom.closest('.form-team');
        }
        if ($dom.length) {
            return $dom.attr('wf-team-id');
        }
        alert('error: can find the id ');
    };

    _wfGroupNameEdit = function () {
        var $this = $(this);
        var $groupNameBox = $this.closest('.team-group-name-title');
        $groupNameBox.find('.wf-group-name').attr('contenteditable', 'true').addClass('wf-name-editable');
        $this.hide();
        $groupNameBox.find('.wf-group-name-save').show();
    };

    _wfGroupNameSave = function () {
        var $this = $(this);
        var $userNameBox = $this.closest('.wf-user-name-box'), $wfGroupName = $userNameBox.find('.wf-group-name');
        if (!$wfGroupName.text().trim().length) {
            alert(I18n.resource.workflow.team.TEAM_NAME_EMPTY);
            return;
        } else if ($wfGroupName.text().trim().length > 15) {
            alert(I18n.resource.workflow.team.TEAM_NAME_NUMBER_MAX);
            return;
        }
        $wfGroupName.attr('contenteditable', 'false').removeClass('wf-name-editable');
        $this.hide();
        $userNameBox.find('.wf-group-name-edit').show();
        if (!changeStructureItemName(_getTeamId($this), $wfGroupName.text())) {
            $wfGroupName.text(getStructureItem(_getTeamId($this)).name);
        }
    };

    _wfTeamGroupAddInput = function () {
        setJqueryMap();
        jqueryMap.$wf_team_groups_box.show();
        jqueryMap.$wf_team_group_add_input.hide();
    };

    _wfAddTeamGroup = function (e) {
        if (e.keyCode == 13) {//回车
            var val = jqueryMap.$wf_add_team_group.val().trim();
            if (val != '') {
                var newStructureItem = {
                    'name': val,
                    'id': ObjectId()
                };
                jqueryMap.$team_structure.append(beopTmpl('tpl_wf_add_group', newStructureItem));
                jqueryMap.$wf_add_team_group.val('');
                jqueryMap.$wf_team_groups_box.hide();
                jqueryMap.$wf_team_group_add_input.show();
                addStructureItem(newStructureItem)
            }
        }
    };


    _wfTeamPeopleAddWin = function (ev) {
        var selectNum = null, $this = $(this);
        var teamId = _getTeamId($this);
        var structureItem = getStructureItem(teamId);


        if (structureItem.type == beop.constants.archType.SUPER_ADMIN) {
            selectNum = 1;
        } else if (structureItem.type == beop.constants.archType.ADMIN) {
            selectNum = 5;
        } else if (structureItem.type == beop.constants.archType.MEMBER) {
            selectNum = null;
        }
        Spinner.spin(stateMap.$container.get(0));
        WebAPI.get('/workflow/v2/group/user_team_dialog_list/' + AppConfig.userId).done(function (result) {
            if (result.success) {
                beop.view.memberSelected.configModel({
                    cb_dialog_hide: function (addedUserList) {
                        structureItem.members = addedUserList;
                        _renderStructure(teamId);
                    },
                    maxSelected: selectNum,
                    userMemberMap: (function () {
                        var teamExitsUser = [];
                        if (stateMap.team) {
                            var id = $(ev.target).closest('.form-team').attr('wf-team-id');
                            stateMap.team.process.forEach(function (item) {
                                item.nodes.forEach(function (node) {
                                    if (node.arch_id == id) {
                                        teamExitsUser = node.members;
                                    }
                                })
                            });
                        }
                        return teamExitsUser.concat(result.data);
                    })(),
                    userHasSelected: getStructureItem(teamId).members
                });
                beop.view.memberSelected.init(jqueryMap.$wf_outline);
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    _renderStructure = function (teamId) { // 刷新成员结构
        var html = beopTmpl('tpl_wf_added_member', {members: getStructureItem(teamId).members});
        $('[wf-team-id=' + teamId + ']').find('.wf-group-people-box').html(html);
    };

    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.structure = {
        init: init,
        getStructure: getStructure,
        getStructureById: getStructureById
    };
}(beop || (beop = {})));

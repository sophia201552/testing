/// <reference path="../lib/jquery-1.11.1.js" />

var WorkflowTeam = (function () {
    function WorkflowTeam() {
        this.teamMembersModel = [];
        this.isManager = false;
    };

    WorkflowTeam.prototype = {
        show: function () {
            var _this = this;
            WebAPI.get("/static/views/workflow/team.html").done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                _this.init();
            });
        },
        renderTeamMembers: function () {
            $('.dpt-row').empty().append(beopTmpl('tmpl_team', {
                groups: this.teamMembersModel,
                isManager: this.isManager
            }));
            I18n.fillArea($("#workflow-team"));
        },
        loadPage: function (groupId) {
            var _this = this;
            Spinner.spin($(".workflow-container")[0]);
            if (typeof groupId === 'undefined') {
                groupId = -1;
            }
            return WebAPI.get('/workflow/team/' + AppConfig['userId'] + '/' + groupId).done(function (result) {
                if (!result.success) {
                    return;
                }
                _this.teamMembersModel = result.data.team;
                _this.isManager = result.data.isManager;
                _this.renderTeamMembers();
                Spinner.stop();
            })
        },

        close: function () {
        },

        init: function () {
            var _this = this;
            var $teamAssignDialog = $('#team-assign-dialog');

            $('#team-assign-dialog').on('show.bs.modal', function (e) {
                Spinner.spin($("#team-assign-dialog")[0]);
                var $this = $(this), $memebers = $teamAssignDialog.find('.members').empty();
                WebAPI.post('/workflow/getTeamMember/', {
                    userId: AppConfig.userId,
                    groupId: $this.data('projectID'),
                    roleId: $this.data('roleID')
                }).done(function (result) {
                    if (!result.success) {
                        return false;
                    }
                    if (result.data.length === 0) {
                        $memebers.append('<h4 style="text-align: center;">' + I18n.resource.workflow.team.TIP2 + '</h4>');
                    } else {
                        $memebers.append(beopTmpl('tmpl_selectMember', {users: result.data}));
                    }

                }).always(function () {
                    Spinner.stop();
                })
            }).on('click', '.media', function () {
                $(this).toggleClass('member-selected');
            }).on('click', '.save', function () {
                var selectedMembers = {}, $dialog = $('#team-assign-dialog'),
                    roleID = $dialog.data('roleID'), projectID = $dialog.data('projectID');
                $dialog.find('.member-selected').map(function (index, item) {
                    var $item = $(item);
                    selectedMembers[$item.data('id')] = {
                        userid: $item.data('id'),
                        userfullname: $item.data('userfullname'),
                        userpic: $item.data('userpic'),
                        editable: true
                    };
                });

                if (Object.keys(selectedMembers).length === 0) {
                    return false;
                }

                Spinner.spin($("#team-assign-dialog")[0]);
                WebAPI.post('/workflow/team/addmember', {
                    roleID: roleID,
                    projectID: projectID,
                    users: Object.keys(selectedMembers).join(',')
                }).done(function (result) {
                    if (result === 'success') {
                        $dialog.modal('hide');
                        for (var userId in selectedMembers) {
                            _this.addModelTeamMember(projectID, roleID, selectedMembers[userId]);
                        }
                        _this.renderTeamMembers();
                    }
                })
            });

            $('#workflow-team').on('mouseenter', '.member', function () {
                $(this).find('.operator').removeClass('hidden');
            }).on('mouseleave', '.member', function () {
                $(this).find('.operator').addClass('hidden');
            }).on('click', '.btn-del-member', function () {
                I18n.fillArea($("span"))
                var $this = $(this);
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/team/delete', {
                    userID: $this.data('user-id'),
                    roleID: $this.data('role-id'),
                    projectID: $this.data('group-id')
                }).done(function (result) {
                    if (result === 'success') {
                        _this.removeModelTeamMember($this.data('group-id'), $this.data('role-id'), $this.data('user-id'));
                        _this.renderTeamMembers();
                    } else if (result.indexOf('the last')) {
                        var alert = new Alert($this.closest('.dpt-container'), 'danger', I18n.resource.workflow.team.TIP1);
                        alert.showAtTop();
                        setTimeout(function () {
                            alert.close();
                        }, 2000)
                    }
                }).always(function () {
                    Spinner.stop();
                });
            }).on('click', '.add-btn', function () {
                var $this = $(this);
                $('#team-assign-dialog')
                    .data('roleID', $this.data('role-id'))
                    .data('projectID', $this.data('group-id')).modal('show');
                I18n.fillArea($("#workflow-team"));
            });

            this.loadPage().done(function () {
                I18n.fillArea($("#workflow-team"));
            });

        },
        removeModelTeamMember: function (groupId, roleId, userId) {
            var group, role;
            for (var m = 0; m < this.teamMembersModel.length; m++) {
                group = this.teamMembersModel[m];
                if (group.groupId != groupId) {
                    continue;
                }
                role = group.roles[roleId];
                if (!role) {
                    break;
                }
                for (var n = 0; n < role.users.length; n++) {
                    if (role.users[n].userid == userId) {
                        role.users.splice(n, 1);
                    }
                }
            }
        },
        addModelTeamMember: function (groupId, roleId, user) {
            var group, role;
            for (var m = 0; m < this.teamMembersModel.length; m++) {
                group = this.teamMembersModel[m];
                if (group.groupId != groupId) {
                    continue;
                }
                role = group.roles[roleId];
                if (!role) {
                    break;
                }
                role.users.push(user);
            }
        }
    };

    return WorkflowTeam;
})();




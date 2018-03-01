/// <reference path="../lib/jquery-1.11.1.js" />

var WorkflowTeam = (function () {

    function buildAssignMember(template, member) {
        return template.find('.media').data('member', member).end().find('.team-avatar-name').text(member.username).end();
    }

    function _GroupArray(prop, array) {
        var group = {};
        for (var n = 0, nlen = array.length; n < nlen; n++) {
            var item = array[n], groupItem = group[item[prop]];
            if (groupItem) {
                groupItem.push(item);
            } else {
                group[item[prop]] = [item];
            }
        }
        return group;
    }

    function GourpResult(result) {
        var ret = [];
        var groupedByProjectId = _GroupArray('projectID', result);
        for (var groupId in groupedByProjectId) {
            var project = {}, projects = groupedByProjectId[groupId];
            project.projectID = groupId, project.projectNm = projects[0] && projects[0].groupNm,
                project.isAdmin = projects[0].isAdmin, project.roles = [];
            var groupedByRoleId = _GroupArray('roleID', projects);
            for (var roleId in groupedByRoleId) {
                var member = groupedByRoleId[roleId];
                var roleGroup = {};
                roleGroup.roleID = roleId, roleGroup.roleNm = member[0] && member[0].roleNm;
                roleGroup.members = member;
                project.roles.push(roleGroup);
            }
            ret.push(project);
        }
        return ret;
    }

    function WorkflowTeam() {
        this.html = null;
        this.memberTemplate = null;
    };


    WorkflowTeam.prototype = {
        show: function () {
            var _this = this;
            $.get("/static/views/workflow/team.html").done(function (resultHtml) {
                _this.html = resultHtml;
                $(ElScreenContainer).html(_this.html);
                _this.init();
            });
        },
        loadPage: function (groupId) {

            var _this = this;
            $('#workflow-team').find('.dpt-row').not('.workflow-template').remove();
            Spinner.spin($(".workflow-container")[0]);
            if (typeof groupId === 'undefined') {
                groupId = -1;
            }
            return $.get('/workflow/team/' + AppConfig['userId'] + '/' + groupId).done(function (result) {
                if (!result) {
                    return;
                }
                try {
                    var result_obj = JSON.parse(result);
                } catch (e) {
                    console.error(e);
                }
                var groups = GourpResult(result_obj);
                var _template = $(_this.html).find('.workflow-template').clone().removeClass('workflow-template');
                var _dpt_content_row = _template.find('.dpt-content-row');
                _this.memberTemplate = _dpt_content_row.find('.member');
                _template.find('.memeber-container').children().remove();
                _template.find('.dpt-content-row').remove();
                for (var m = 0, mlen = groups.length; m < mlen; m++) {
                    var group = groups[m], template = _template.clone(),
                        dpt_container = template.find('.dpt-container'),
                        isAdmin = group.isAdmin;
                    template.find('.dpt-nm').text(group.projectNm);
                    for (var n = 0, nlen = group.roles.length; n < nlen; n++) {
                        var role = group.roles[n];
                        var dpt_content_row = _dpt_content_row.clone();
                        dpt_content_row.find('.role-nm').text(role.roleNm);
                        var memeber_container = dpt_content_row.find('.memeber-container');
                        for (var j = 0, jlen = role.members.length; j < jlen; j++) {
                            var member = role.members[j];
                            if (!member.userID) {
                                continue;
                            }
                            var member_div = _this.memberTemplate.clone();
                            member_div.find('.team-avatar-name').text(member.userFullNm);
                            memeber_container.append(member_div);
                            member_div.data('member', member);
                        }
                        if (isAdmin) {
                            var mem_add = $('<div class="col-md-3 add-member"><img style="cursor:pointer;" src="./static/images/add_new_project.png"></img></div>');
                            mem_add.data('roleID', role.roleID).data('projectID', group.projectID);
                            memeber_container.append(mem_add);
                        }
                        dpt_container.append(dpt_content_row);
                    }

                    $('#workflow-team').append(template);
                }
                Spinner.stop();

            })

        },

        close: function () {
        },

        init: function () {
            var _this = this;

            $('#team-assign-dialog').on('show.bs.modal', function (e) {
                var dialog = $(this), members_section = dialog.find('.members').children().remove().end();
                var roleID = dialog.data('roleID'), projectID = dialog.data('projectID');
                Spinner.spin($("#team-assign-dialog")[0]);
                WebAPI.post('/workflow/team/getmember', {roleID: roleID, projectID: projectID}).done(function (result) {

                    var result = JSON.parse(result);
                    if (result.length === 0) {
                        members_section.append('<h4>' + I18n.resource.workflow.team.TIP2 + '</h4>');
                    }
                    members_section.append(beopTmpl('tmpl_selectMember', result));
                    var resultL=result.length;
                    var media=$('.modal-content').find(".media");
                    for(var i=0;i<resultL;i++){
                        var oMedia=media.eq(i);
                        var oResult=result[i];
                        oMedia.data('member',oResult);
                    }
                    Spinner.stop();
                })
            }).on('click', '.media', function () {
                var media = $(this), member = media.data('member');
                media.toggleClass('member-selected');
            }).on('click', '.save', function () {
                var selectedMembers = {}, dialog = $('#team-assign-dialog'),
                    roleID = dialog.data('roleID'), projectID = dialog.data('projectID');
                dialog.find('.member-selected').map(function (index, item) {
                    selectedMembers[$(item).data('member').userID] = $(item).data('member');
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
                        dialog.modal('hide');
                        var memeber_container = dialog.data('container');
                        for (var id in selectedMembers) {
                            var member = selectedMembers[id];
                            var member_div = _this.memberTemplate.clone();
                            member_div.find('.team-avatar-name').text(member.username);
                            memeber_container.find('.add-member').before(member_div);
                            member_div.data('member', member);
                        }
                    }
                })
            })

            $('#workflow-team').on('mouseenter', '.member', function () {
                var $this = $(this), member = $this.data('member');
                if (member.isAdmin) {
                    $this.find('.operator').removeClass('hidden');
                }
            }).on('mouseleave', '.member', function () {
                $(this).find('.operator').addClass('hidden');
            }).on('click', '.btn-del-member', function () {
                I18n.fillArea($("span"))
                var btn = $(this);
                var member = btn.closest('.member').data('member');
                Spinner.spin($(".workflow-container")[0]);
                WebAPI.post('/workflow/team/delete', {
                    userID: member.userID,
                    roleID: member.roleID,
                    projectID: member.projectID
                }).done(function (result) {
                    if (result === 'success') {
                        btn.closest('.member').remove();
                    } else if (result.indexOf('the last')) {
                        var alert = new Alert(btn.closest('.dpt-container'), 'danger', I18n.resource.workflow.team.TIP1);
                        alert.setStyle({position: 'absolute', top: '50%', left: '30%', width: '40%'}).show();
                        setTimeout(function () {
                            alert.close();
                        }, 2000)
                    }
                }).always(function () {
                    Spinner.stop();
                });
            }).on('click', '.add-member img', function () {
                var btn = $(this).closest('.add-member');
                var roleID = btn.data('roleID'), projectID = btn.data('projectID');
                $('#team-assign-dialog')
                    .data('roleID', roleID)
                    .data('projectID', projectID)
                    .data('container', btn.closest('.memeber-container'))
                    .modal('show');
                I18n.fillArea($("#workflow-team"));
            })

            this.loadPage().done(function () {
                I18n.fillArea($("#workflow-team"));
            });

        }
    }

    return WorkflowTeam;
})();




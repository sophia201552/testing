# -*- encoding=utf-8 -*-
__author__ = 'liqian'

from datetime import datetime, timedelta
import logging
from beopWeb import app
from beopWeb.mod_common import i18n

from flask import request, json
from bson.objectid import ObjectId
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow import bp_workflow
from .Scheduler import Scheduler
from .ReportEmailUser import ReportEmailUser
from .VerisionHistory import VersionHistory
from beopWeb.mod_admin.User import User
from .TransactionGroup import TransactionGroup
from .TransactionGroupUser import TransactionGroupUser
from .TransactionEmail import TransactionEmail
from .Activity import ActivityType
from beopWeb.mod_workflow.Team import Team
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_workflow.TaskGroup import TaskGroup
from beopWeb.mod_workflow.Template import Template
from beopWeb.mod_workflow.Task import Task
from beopWeb.mod_workflow.StatisticsOrders import StatisticsOrders
from beopWeb.mod_message.message import Message
from beopWeb.mod_message.messageUser import MessageUser
from beopWeb.diagnosis import set_diagnosis_feedBack
from beopWeb.diagnosis import set_diagnosis_orderId
from beopWeb.mod_workflow.Constants import FeedBackStatus, TaskType, TaskAction, TaskStatus, NodeBehaviour
from beopWeb.mod_common.Exceptions import NotExists
from beopWeb.mod_appCommon import pushService
from dateutil.parser import parse
from dateutil.rrule import rrule
from dateutil.rrule import DAILY
from dateutil.rrule import MONTHLY


# 获取今天任务
@bp_workflow.route('/listTodayTasks', methods=['POST'])
def plan_list_today_tasks():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    scheduler = Scheduler()
    scheduler_result = scheduler.get_user_today_scheduler(user_id)

    mu = MessageUser()
    # workflow reminds
    workflow_reminds, count = mu.query_user_msgId_list(user_id, None, None, is_list_today_task=True, tags=None)
    return Utils.beop_response_success({'scheduler': scheduler_result, 'reminds': workflow_reminds})


# 获取任务组
@bp_workflow.route('/users/group/<user_id>', methods=['GET'])
def user_group_user_id(user_id):
    tg = TransactionGroup()
    result = tg.get_all_group_by_user_id(user_id)
    return Utils.beop_response_success(result)


# 获取人员列表
@bp_workflow.route('/group/user_dialog_list/<user_id>', methods=['GET'])
def user_dialog_list(user_id):
    if not user_id:
        return Utils.beop_response_error(msg='user id is none')
    result = []
    user = User()
    current_user = user.query_user_by_id(user_id, 'supervisor')
    if not current_user:
        return Utils.beop_response_success(result)
    supervisor_id = current_user.get('supervisor')
    if str(supervisor_id) == '0':
        # 如果是admin显示所有的人员
        supervisor_id = 1

    result = user.get_users_flat_by_supervisor(supervisor_id, 'id', 'userfullname', 'userpic', 'useremail')
    return Utils.beop_response_success(
        [{'id': item.get('id'),
          'userfullname': item.get('userfullname'),
          'userpic': item.get('userpic'), 'useremail': item.get("useremail")} for item in result])


# 获取人员列表
@bp_workflow.route('/group/user_team_dialog_list/<user_id>', methods=['GET'])
def user_team_dialog_list(user_id):
    if not user_id:
        return Utils.beop_response_error(msg='user id is none')
    result = []
    user = User()
    current_user = user.query_user_by_id(user_id, 'supervisor')
    if not current_user:
        return Utils.beop_response_success(result)
    supervisor_id = current_user.get('supervisor')
    if str(supervisor_id) == '0':
        # 如果是admin显示所有的人员
        supervisor_id = 1

    result = user.get_users_flat_by_supervisor(supervisor_id, 'id', 'userfullname', 'userpic', 'useremail',
                                               'usermobile')

    return Utils.beop_response_success(
        [{'id': item.get('id'),
          'userfullname': item.get('userfullname'),
          'userpic': item.get('userpic'), 'useremail': item.get("useremail"),
          'isBindMobile': bool(item.get('usermobile'))}
         for item in result])


# 获取人员列表
@bp_workflow.route('/v2/group/user_team_dialog_list/<user_id>', methods=['GET'])
def user_team_dialog_list_v2(user_id):
    if not user_id:
        return Utils.beop_response_error(msg='user id is none')
    result = []
    user = User()
    current_user = user.query_user_by_id(user_id, 'supervisor')
    if not current_user:
        return Utils.beop_response_success(result)
    supervisor_id = current_user.get('supervisor')
    if str(supervisor_id) == '0':
        # 如果是admin显示所有的人员
        supervisor_id = 1

    result = user.get_users_flat_by_supervisor(supervisor_id, 'id', 'userfullname', 'userpic', 'useremail')

    return Utils.beop_response_success(
        [{'id': item.get('id'),
          'userfullname': item.get('userfullname'),
          'userpic': item.get('userpic'), 'useremail': item.get("useremail")} for item in result])


# 添加人物时候根据任务组来获取人员列表
@bp_workflow.route('/group/group_user_list/<int:user_id>/<int:group_id>', methods=['GET'])
def group_user_list(user_id, group_id):
    if not user_id or not group_id:
        return Utils.beop_response_error()
    result = []
    user = User()
    tgu = TransactionGroupUser()
    tg = TransactionGroup()
    user_info = tgu.get_all_users_by_group(group_id)
    creator_info_list = tg.get_group_creator(group_id)
    if not creator_info_list:
        return Utils.beop_response_success(result)
    else:
        creator_info = creator_info_list[0]
    creator_id = int(creator_info.get("creatorId"))
    diff = True
    for item in user_info:
        users = user.query_user_by_id(item.get('userId'), 'id', 'userfullname', 'userpic', 'useremail')
        if int(users.get('id')) == creator_id:
            diff = False
        result.append({
            "id": users.get('id'),
            "userfullname": users.get("userfullname"),
            "userpic": users.get("userpic"),
            "useremail": users.get("useremail")
        })
    if diff:
        creator_info = user.query_user_by_id(creator_id, 'id', 'userfullname', 'userpic', 'useremail')
        result.append({"id": creator_info.get('id'),
                       "userfullname": creator_info.get("userfullname"),
                       "userpic": creator_info.get("userpic"),
                       "useremail": creator_info.get("useremail")
                       })
    return Utils.beop_response_success(result)


# 新增任务组
@bp_workflow.route('/group/new/<user_id>', methods=['POST'])
def group_new(user_id):
    req_data = request.get_json()
    name = req_data.get('name')
    description = req_data.get('description')
    users = req_data.get('addedUsers[]')
    if not name:
        return Utils.beop_response_error(msg='the group name is empty.')
    tg = TransactionGroup()
    group_id = tg.add_group(name, user_id, description, datetime.now())
    tgu = TransactionGroupUser()
    if users:
        for user_id in users:
            tgu.add_user_to_group(user_id, group_id)
    return Utils.beop_response_success(group_id)


# 删除任务组
@bp_workflow.route('/group/delete/<group_id>/<user_id>', methods=['POST'])
def group_delete(group_id, user_id):
    if not group_id or not user_id:
        return Utils.beop_response_error()
    from .TaskGroup import TaskGroup

    tg = TaskGroup()
    result, msg = tg.delete_task_group(group_id, user_id)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg if msg else '')


# 获取任务组内容
# noinspection PyUnusedLocal
@bp_workflow.route('/group/get/<group_id>/<user_id>', methods=['GET'])
def group_get(group_id, user_id):
    tg = TransactionGroup()
    tgu = TransactionGroupUser()
    group = tg.get_trans_group_by_id(group_id)
    if not group:
        return Utils.beop_response_error(msg='the group does not exist')
    user = User()
    user_map = user.get_all_user_map()
    members = tgu.get_members_from_group(group_id)

    ret_members = []
    for member in members:
        if member.get('userId') is not None and user_map.get(member.get('userId')):
            ret_members.append({
                'id': member.get('userId'),
                'userfullname': user_map.get(member.get('userId')).get('userfullname'),
                'userpic': user_map.get(member.get('userId')).get('userpic')
            })
    creator_id = group.get('creatorId')
    creator_userpic = ''
    creator_userfullname = ''
    if creator_id is not None and user_map.get(creator_id):
        creator_userpic = user_map.get(creator_id).get('userpic')
        creator_userfullname = user_map.get(creator_id).get('userfullname')
    return Utils.beop_response_success(
        {
            'creator': {'id': creator_id,
                        'userpic': creator_userpic,
                        'userfullname': creator_userfullname},
            'description': group.get('description'),
            'id': group.get('id'),
            'createtime': group.get('createTime'),
            'name': group.get('name'),
            'pic': group.get('pic'),
            'members': ret_members
        }
    )


@bp_workflow.route('/group/edit/<group_id>/<user_id>', methods=['POST'])
# 编辑任务组
def group_edit(group_id, user_id):
    req_data = request.get_json()
    name = req_data.get('name')
    if not name:
        return Utils.beop_response_error()

    description = req_data.get('description')
    users = req_data.get('addedUsers[]')
    if not name:
        return Utils.beop_response_error(msg='the group name is empty.')
    tg = TransactionGroup()
    group = tg.get_trans_group_by_id(group_id)
    if user_id != '1':
        if group.get('creatorId') != int(user_id):
            return Utils.beop_response_error(code=403)

    result = tg.update_group(group_id, name, description)
    if result:
        tgu = TransactionGroupUser()
        if users is not None:
            result &= tgu.update_group_members(group_id, users)
        if users is None:
            result &= tgu.delete_group_members(group_id)
        if result:
            return Utils.beop_response_success()
        else:
            return Utils.beop_response_error()
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/reportEmailSetting/get/<user_id>', methods=['GET'])
# 获得一个用户的报表发送设置
def get_report_email_setting(user_id):
    if not user_id:
        return Utils.beop_response_error(msg='need the userId')
    report_user = ReportEmailUser()
    result = report_user.get_all_report_email_setting(int(user_id))
    if result:
        return Utils.beop_response_success(result)
    else:
        return Utils.beop_response_success()


@bp_workflow.route('/reportEmailSetting/update/<user_id>', methods=['POST'])
# 更新一个用户的报表发送设置，先删除后重新加入
def update_report_email_setting(user_id):
    rq_data = request.get_json()
    if not user_id or not rq_data:
        return Utils.beop_response_error(msg='need the userId or data')
    report_user = ReportEmailUser()

    result = report_user.update_report_email_setting(int(user_id), rq_data)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg='some error on insert data to DATABASE')


# 版本更新历史
# 得到准确的一个版本历史
@bp_workflow.route('/versionHistory/getAccurate/<version_id>', methods=['POST'])
def get_current_history(version_id):
    history = VersionHistory()
    version = str(version_id)
    user_id = int(request.get_json().get('userId'))
    if version == 'newest':
        result = history.get_version_history(user_id)
    else:
        if user_id == 1:
            result = history.get_accurate_version(int(version_id))
        else:
            return Utils.beop_response_error()
    if result:
        return Utils.beop_response_success(result)
    else:
        return Utils.beop_response_success()


# 得到版本
@bp_workflow.route('/versionHistory/getAll/<int:user_id>', methods=['GET'])
def get_version_history(user_id):
    if not user_id:
        return Utils.beop_response_error()
    history = VersionHistory()
    result = history.get_version_history(user_id)
    if result:
        return Utils.beop_response_success(result)
    else:
        return Utils.beop_response_success()


# 添加版本
@bp_workflow.route('/versionHistory/add/<user_id>', methods=['POST'])
def add_version_history(user_id):
    rq_data = request.get_json()
    if not user_id or not rq_data:
        return Utils.beop_response_error()
    history = VersionHistory()
    return_id = history.add_version_history(int(user_id), rq_data)
    if return_id:
        return Utils.beop_response_success({
            "versionId": return_id
        })
    else:
        return Utils.beop_response_error()


# 更新版本
@bp_workflow.route('/versionHistory/update/<user_id>/<version_id>', methods=['POST'])
def update_version_history(user_id, version_id):
    rq_data = request.get_json()
    if not user_id or not version_id or not rq_data:
        return Utils.beop_response_error()
    history = VersionHistory()
    result = history.update_version_history(int(user_id), int(version_id), rq_data)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 删除版本
@bp_workflow.route('/versionHistory/delete/<user_id>/<version_id>', methods=['POST'])
def delete_version_history(user_id, version_id):
    if not user_id or not version_id:
        return Utils.beop_response_error()
    if user_id == '1' or user_id == 1:
        history = VersionHistory()
        result = history.delete_version_history(int(version_id))
        if result:
            return Utils.beop_response_success()
        else:
            return Utils.beop_response_error()
    else:
        return Utils.beop_response_error(msg="You Do Not Have Permission To Delete This!")


# 设置版本所属
@bp_workflow.route('/versionHistory/setOwners', methods=['POST'])
def set_owners():
    rq_data = request.get_json()
    version_id = int(rq_data.get('versionId'))
    user_id = int(rq_data.get('userId'))
    owners = rq_data.get('owners')
    if not version_id or user_id != 1:
        return Utils.beop_response_error()
    vh = VersionHistory()
    result = vh.update_version_owners(version_id, json.dumps(owners))
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 团队 编辑
@bp_workflow.route('/team/edit', methods=['POST'])
def wf_team_edit():
    rq_data = request.get_json()
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    team = Team()
    try:
        result = team.edit_team(rq_data.get('name'), rq_data.get('desc'), rq_data.get('tags'),
                                rq_data.get('teamMember'), rq_data.get('process'), user_id, rq_data.get('teamId'))
    except Exception as e:
        return Utils.beop_response_error(e)

    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 团队 创建
@bp_workflow.route('/team/new', methods=['POST'])
def wf_team_new():
    rq_data = request.get_json()
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    team = Team()
    try:
        result = team.create_team(rq_data.get('name'), rq_data.get('desc'), rq_data.get('tags'),
                                  rq_data.get('teamMember'), rq_data.get('process'), user_id)
    except Exception as e:
        return Utils.beop_response_error(e)

    if result:
        result_team = team.get_team_by_user_id(user_id)
        user_type, title = team.get_team_user_title(user_id, result_team)
        return Utils.beop_response_success({'team': result_team, 'user_type': user_type, 'title': title})


# 团队 加载
@bp_workflow.route('/team/', methods=['GET'])
def wf_team_show():
    user_id = AuthManager.get_userId()
    team = Team()
    try:
        # 根据用户ID查询所在团队
        result = team.get_team_by_user_id(user_id)
    except Exception as e:
        return Utils.beop_response_error(e)
    user_type, title = team.get_team_user_title(user_id, result)

    if result:
        return Utils.beop_response_success({'team': result, 'user_type': user_type, 'title': title})
    else:
        return Utils.beop_response_success({'team': None})


# 团队 解散
@bp_workflow.route('/team/delete/<team_id>', methods=['GET'])
def wf_team_delete(team_id):
    user_id = AuthManager.get_userId()
    team = Team()
    try:
        result = team.delete_team(team_id, user_id)
    except Exception as e:
        return Utils.beop_response_error(e)
    if result:
        return Utils.beop_response_success(result)


# 团队 退出
@bp_workflow.route('/team/quite/<team_id>', methods=['GET'])
def wf_team_quite(team_id):
    user_id = AuthManager.get_userId()
    team = Team()
    tg = TaskGroup()
    try:
        team.quite_team(team_id, user_id)
        tg.quite_all_team_group(team_id, user_id)
    except Exception as e:
        return Utils.beop_response_error(e)
    return Utils.beop_response_success()


# 团队 更新
@bp_workflow.route('/team/update/<team_id>', methods=['POST'])
def wf_team_update(team_id):
    user_id = AuthManager.get_userId()
    team = Team()
    try:
        result = team.update_team(team_id, user_id, team)
    except Exception as e:
        return Utils.beop_response_error(e)
    if result:
        return Utils.beop_response_success(result)


# 任务组 加载
@bp_workflow.route('/taskGroup/', methods=['GET'])
@bp_workflow.route('/taskGroup/<group_id>', methods=['GET'])
def wf_task_group(group_id=None):
    user_id = AuthManager.get_userId()
    task_group = TaskGroup()
    try:
        # 根据用户ID查询所在任务组
        task_group_result = task_group.get_task_group_by_user_id(user_id, group_id)
    except Exception as e:
        return Utils.beop_response_error(e)
    if not task_group_result:
        return Utils.beop_response_error(code=404)
    result = []
    found_team = Team().get_team_by_user_id(user_id)
    if not found_team:
        return Utils.beop_response_error()
    for task_group_item in task_group_result:
        if group_id and group_id != str(task_group_item.get('_id')):
            continue
        if task_group_item.get('team_id') != found_team.get('_id'):
            continue
        team_process_map = {str(process_item.get('_id')): process_item for process_item in found_team.get('process')}
        process_result = []
        group_arch_map = {item.get('id'): item for item in task_group_item.get('arch', [])}
        for process_id in task_group_item.get('process', []):
            process = team_process_map.get(process_id)
            if not process:
                continue
            nodes = []
            # 任务组中的人员放到流程中
            for process_node in process.get('nodes'):
                if process_node and process_node.get('members', []) and len(
                        process_node.get('members', [])) > 0:  # 当前节点指定到人
                    nodes.append(process_node)
                elif process_node and group_arch_map.get(process_node.get('arch_id')):  # 用任务组选中的人覆盖
                    process_node.update(group_arch_map.get(process_node.get('arch_id')))
                    nodes.append(process_node)
                else:
                    for arch in found_team.get('arch'):  # 任务组中没有设置人员,默认使用团队中的人员
                        if arch.get('id') == process_node.get('arch_id'):
                            process_node['members'] = arch.get('members')
                            nodes.append(process_node)
                            break

            process_result.append({
                '_id': process.get('_id'),
                'name': process.get('name'),
                'type': process.get('type'),
                'template': Template(process.get('template_id')).get_template(),
                'nodes': nodes
            })
        if not process_result:  # 如果项目里面没有配置流程,则返回默认流程
            default_process = Team().get_default_process(found_team)
            process_result.append({
                '_id': default_process.get('_id'),
                'name': default_process.get('name'),
                'type': default_process.get('type'),
                'template': Template(default_process.get('template_id')).get_template(),
                'nodes': default_process.get('nodes')
            })
        result.append({
            '_id': str(task_group_item.get('_id')),
            'name': task_group_item.get('name'),
            'desc': task_group_item.get('desc'),
            'process': process_result,
            'type': task_group_item.get('type'),
            "tags": found_team.get("tags", [])
        })
    return Utils.beop_response_success(result)


# 获取工单组列表
@bp_workflow.route('/taskGroupProcess/get/<id>', methods=['GET'])
def get_wf_task_group_process(id):
    """
    :param id:
    :return: {
        "msg": "",
        "data": {
            "createTime": "2017-12-28 17:04:41",
            "_id": "5a448e8093e7dd10febd10ef",
            "archAll": [],
            "process": [],
            "autoEscalationConfig": [
                {
                    "targets": [
                        {
                            "userId": 1589,
                            "escalateAfter": "2h",
                            "userInfo": {
                                "userfullname": "may",
                                "userpic": "/static/images/avatar/default/14.png",
                                "useremail": "may.chen@rnbtech.com.hk"
                            }
                        }
                    ],
                    "critical": 0
                }
            ],
            "arch": [],
            "creator": {
                "userfullname": "may",
                "userpic": "/static/images/avatar/default/14.png",
                "useremail": "may.chen@rnbtech.com.hk",
                "id": 1589
            },
            "team_id": "583aee586455143634ed8665",
            "name": "mayTest",
            "desc": "test"
        },
        "code": "1",
        "success": true
    }
    """
    user_id = AuthManager.get_userId()
    if not user_id or not id:
        return Utils.beop_response_error()
    task_group = TaskGroup()
    result = task_group.get_task_group_by_id(id)
    return Utils.beop_response_success(result)


# 任务组 新建
@bp_workflow.route('/taskGroup/new', methods=['POST'])
def wf_task_group_new():
    """
    {
        "creator": 1589,
        "name": "mayTest",
        "desc": "test",
        "team_id": "583aee586455143634ed8665",
        "createTime": "2017-12-28T06:26:00.670Z",
        "process": [
            "14810297992330684fcabdc2"
        ],
        "arch": [],
        "autoEscalationConfig": [
            {
                "critical": 0, #紧急程度 0:Normal,1:serious,2:urgent和工单的紧急程度对应
                "targets": [
                    {
                        "userId": 1589,
                        "escalateAfter": "2h" #距工单创建后2小时开始推送，目前有三种（h结束为小时，d结束为天，deadline是截止日期）
                    },
                    {
                        "userId": 1590,
                        "escalateAfter": "1d"
                    }
                ]
            }
        ]
    }
    :return:
    """
    try:
        user_id = AuthManager.get_userId()
        if not user_id:
            return Utils.beop_response_error()
        rq_data = request.get_json()
        _orderTargets(rq_data)
        tg = TaskGroup()
        # 按推送时间排序，deadline排在最后
        group_id = tg.save_task_group(rq_data)
        if group_id:
            return Utils.beop_response_success({"groupId": group_id})
        return Utils.beop_response_error()
    except Exception as e:
        return Utils.beop_response_error(msg=e.__str__())


# 编辑工单组
@bp_workflow.route('/taskGroupProcess/edit', methods=['POST'])
def edit_wf_task_group_process():
    """
    {
        "data": {
            "desc": "test",
            "name": "mayTest",
            "team_id": "583aee586455143634ed8665",
            "createTime": "2017-12-28 17:04:41",
            "arch": [],
            "process": [],
            "autoEscalationConfig": [
                {
                    "critical": 0, #紧急程度 0:Normal,1:serious,2:urgent和工单的紧急程度对应
                    "targets": [
                        {
                            "userId": 1589,
                            "escalateAfter": "deadline" #距工单创建后2小时开始推送，目前有三种（h结束为小时，d结束为天，deadline是截止日期）
                        },
                        {
                            "userId": 1589,
                            "escalateAfter": "2h" #距工单创建后2小时开始推送，目前有三种（h结束为小时，d结束为天，deadline是截止日期）
                        },
                        {
                            "userId": 1589,
                            "escalateAfter": "1d"
                        }
                    ]
                }
            ]
        },
        "id": "5a448e8093e7dd10febd10ef"
    }
    :return:
    """
    try:
        user_id = AuthManager.get_userId()
        rq_data = request.get_json()
        id = rq_data.get('id')
        if not user_id or not id:
            return Utils.beop_response_error()
        task_group = TaskGroup()
        data = rq_data.get('data')
        _orderTargets(data)
        result = task_group.edit_task_group(id, data)
    except Exception as e:
        return Utils.beop_response_error(msg=e.__str__())
    return Utils.beop_response_success(result)


def _orderTargets(rq_data):
    autoEscalationConfig = rq_data.get('autoEscalationConfig')
    if autoEscalationConfig:
        for item in autoEscalationConfig:
            hasDeadline = False
            escalateAfterDict = {}
            escalateAfterUserIdMap = {}
            targetList = item.get('targets')
            for target in targetList:
                escalateAfter = target.get('escalateAfter')
                if escalateAfter == "deadline":
                    hasDeadline = True
                elif escalateAfter[-1] == 'd':
                    escalateAfterDict[escalateAfter] = int(escalateAfter[0:-1]) * 24
                elif escalateAfter[-1] == 'h':
                    escalateAfterDict[escalateAfter] = int(escalateAfter[0:-1])
                else:
                    raise Exception("escalateAfter param invalid")

                # 考虑到有相同时间的情况
                if escalateAfter in escalateAfterUserIdMap:
                    escalateAfterUserIdMap[escalateAfter].append(target.get("userId"))
                else:
                    escalateAfterUserIdMap[escalateAfter] = [target.get("userId")]
            sortedescalateAfterDict = sorted(escalateAfterDict.items(), key=lambda x: x[1])
            sortedtargetList = []
            for i in sortedescalateAfterDict:
                for userId in escalateAfterUserIdMap.get(i[0]):
                    sortedtargetList.append({"userId": userId, "escalateAfter": i[0]})
            if hasDeadline:
                for userId in escalateAfterUserIdMap.get('deadline'):
                    sortedtargetList.append({"escalateAfter": "deadline", "userId": userId})
            item['targets'] = sortedtargetList


# 逾期工单推送功能
@bp_workflow.route('/escalation', methods=['POST'])
def escalation():
    timeInterval = 30  # 分钟
    data = request.get_json()
    if data:
        currentTimeStr = data.get('currentTime')
        if not currentTimeStr:
            raise Exception('param invalid')
        currentTime = datetime.strptime(currentTimeStr, '%Y-%m-%d %H:%M:%S')
        timeIntervalBefore = currentTime + timedelta(minutes=-timeInterval)
        # 获取所有有autoEscalationConfig的任务组group
        tg = TaskGroup()
        groups = tg.get_task_group_with_autoEscalationConfig()
        # 获取所有group中未完成的工单
        for group in groups:
            autoEscalationConfig = group.get('autoEscalationConfig')
            criticalTargetsMap = {}
            for escalation in autoEscalationConfig:
                targets = escalation.get('targets')
                critical = str(escalation.get("critical"))
                if targets and critical:
                    criticalTargetsMap[critical] = targets
            groupId = group.get('_id')
            query = "{\"taskGroupId\":\"%s\",\"_isDelete\":{\"$ne\":true}}" % (str(groupId),)
            tk = Task()
            task_list, total = tk.task_filter(task_filter=json.loads(query, encoding="application/json"))
            criticalTaskMap = {}
            for task in task_list:
                createTime = task.get('createTime')
                fields = task.get('fields')
                dueDate = fields.get('dueDate')
                critical = fields.get('critical')
                status = task.get('status')

                if critical in criticalTargetsMap and dueDate and createTime and status != TaskStatus.END:
                    if str(critical) in criticalTaskMap:
                        criticalTaskMap[str(critical)].append(task)
                    else:
                        criticalTaskMap[str(critical)] = [task]

            # 根据紧急程度计算出需要推送的人进行推送
            for critical, tasks in criticalTaskMap.items():
                for task in tasks:
                    try:
                        taskCreateTime = task.get('createTime')
                        taskDueDateStr = task.get('fields').get('dueDate')
                        if len(taskDueDateStr) == 10:
                            taskDueDateStr += " 23:59:59"
                        taskDueDate = datetime.strptime(taskDueDateStr, '%Y-%m-%d %H:%M:%S')
                        targets = criticalTargetsMap.get(critical)
                        for target in targets:
                            targetId = target.get('userId')
                            escalateTime = None
                            escalateAfter = target.get('escalateAfter')
                            if escalateAfter == "deadline":
                                escalateTime = taskDueDate
                            elif escalateAfter[-1] == 'd':
                                escalateTime = taskCreateTime + timedelta(hours=int(escalateAfter[0:-1]) * 24)
                            elif escalateAfter[-1] == 'h':
                                escalateTime = taskCreateTime + timedelta(hours=int(escalateAfter[0:-1]))
                            # 进行推送
                            if escalateTime and timeIntervalBefore < escalateTime < currentTime and targetId:
                                user = User()
                                executorIds = []
                                for node in task.get('process').get('nodes'):
                                    if node.get('behaviour') == NodeBehaviour.EXECUTE:
                                        members = node.get('members')
                                        if members:
                                            executorIds += members
                                target_info = user.query_user_by_id(targetId, 'useremail', 'country')
                                lang = app.config.get('COUNTRY_DEFAULT_LANGUAGE').get(target_info.get('country', 'WW'),'zh')
                                i18n.set_lang(lang)
                                executorNames = []
                                for executorId in executorIds:
                                    exec_info = user.query_user_by_id(executorId, 'userfullname')
                                    executorNames.append(exec_info.get('userfullname'))
                                if executorNames:
                                    executorsStr = ','.join(executorNames)
                                else:
                                    executorsStr = '-'
                                title = i18n.trans('TITLE_ESCALATION', executor=executorsStr)
                                # app推送
                                pushService.sendMessage({
                                    'message': {'type': 'workflow', 'id': str(task.get('_id'))},
                                    'title': title,
                                    'alert': title,
                                    'userId_list': [targetId],
                                    'projId_list': [],
                                    'registration_id': []
                                })
                                # 消息推送
                                message = Message()
                                mu = MessageUser()
                                workflow_info = {
                                    "id": task.get("_id"),
                                    "groupId": None,
                                    "willReceived": targetId,
                                    "op": title
                                }
                                msg_id = message.add_new_workflow_message_with_return_id(
                                    [1], title, title, workflow_info, subType='escalation')
                                if msg_id:
                                    mu.add_workflow_users_message(targetId, msg_id)
                                # 邮件推送
                                rq_data = {
                                    'escalateTitle': title,
                                    'escalateExecutorList': executorIds,
                                    'executor': targetId,
                                    'oldexecutor': '',
                                    'watchers': [],
                                    'userId': task.get('creator'),
                                    'title': task['fields'].get('title'),
                                    'detail': task['fields'].get('detail'),
                                    'dueDate': task['fields'].get('dueDate'),
                                    'zone': task['fields'].get('diagnosisZone'),
                                    'equipment': task['fields'].get('diagnosisEquipmentName'),
                                    'faultImage': task.get('image'),
                                    'critical': task['fields'].get('critical')
                                }

                                TransactionEmail.send_task_email(
                                    task.get("_id"), rq_data, task.get("attachment"), 'Escalation', lang=lang)
                    except Exception as e:
                        logging.error('escalate error:' + e.__str__())
    return Utils.beop_response_success()


# 任务组 项目 加载
@bp_workflow.route('/taskGroupProcess/', methods=['POST'])
def wf_task_group_project():
    user_id = AuthManager.get_userId()
    task_group = TaskGroup()
    try:
        # 根据用户ID查询所在任务组
        task_group_result = task_group.get_task_group_by_user_id(user_id)
    except Exception as e:
        logging.error('根据用户ID查询所在任务组错误:%s' % str(e))
        return Utils.beop_response_error(e)
    if not task_group_result:
        return Utils.beop_response_error(code=404)
    result = []
    user = User()
    user_map = user.get_all_user_map()
    team = Team()
    team_map = {}
    for task_group_item in task_group_result:
        team_id = task_group_item.get('team_id')
        if not team_id:
            continue
        found_team = team_map.get(team_id) if team_map.get(team_id) else team.get_team_by_id(team_id)
        if not found_team:
            continue
        else:
            if team_id not in team_map:
                team_map[team_id] = found_team
        # arch
        arch = task_group_item.get("arch", [])
        if arch:
            for arch_item in arch:
                members = arch_item.get('members')
                new_member = []
                for member in members:
                    if user_map.get(member):
                        new_member.append({
                            'id': member,
                            'userfullname': user_map.get(member).get('userfullname'),
                            'userpic': user_map.get(member).get('userpic')
                        })
                    else:
                        new_member.append({
                            "id": "",
                            "userfullname": "",
                            "userpic": ""
                        })
                arch_item['members'] = new_member

        # process
        team_process_map = {process_item.get('_id'): process_item for process_item in found_team.get('process')}
        process_result = []
        for process_id in task_group_item.get("process", []):
            process_result.append(team_process_map.get(process_id) if team_process_map.get(process_id) else [])

        model = {
            '_id': str(task_group_item.get('_id')),
            'name': task_group_item.get('name'),
            'desc': task_group_item.get('desc'),
            'process': process_result,
            "arch": arch,
            "type": task_group_item.get('type')
        }
        creator_id = task_group_item.get('creator')
        if creator_id and user_map.get(task_group_item.get('creator')):
            model["creator"] = {
                'id': task_group_item.get('creator'),
                'userfullname': user_map.get(task_group_item.get('creator')).get('userfullname'),
                'userpic': user_map.get(task_group_item.get('creator')).get('userpic')
            }
        result.append(model)
    return Utils.beop_response_success(result)


# 新建工单
@bp_workflow.route('/task/new/', methods=['POST'])
def wf_task_new():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=401)

    rq_data = request.get_json()

    executor = rq_data.get("executor"),
    fields = rq_data.get("fields", {})
    tags = rq_data.get("tags", [])
    task_group_id = rq_data.get("task_group_id", None)

    title = rq_data.get("title")
    detail = rq_data.get("detail")
    due_date = rq_data.get("dueDate")
    critical = rq_data.get("critical", 0)

    team = Team().get_team_by_user_id(user_id)

    fields.update({"title": title, "detail": detail, "dueDate": due_date, "critical": critical})

    task_to_save = {
        'creator': user_id,
        'createTime': datetime.now(),
        'taskGroupId': task_group_id,
        'fields': fields,
        'template': "",
        'process': {
            "nodes": [],
            "type": 1
        },
        'node_index': 0,
        'executor': executor,
        'status': int(rq_data.get("status", TaskStatus.NEW)),
        'tags': tags,
        "attachment": rq_data.get('attachment', []),
        'teamId': team.get('_id')
    }

    task = Task()
    result = task.save_task(task_to_save)
    if result:
        return Utils.beop_response_success(result)
    else:
        return Utils.beop_response_error()


# 删除工单
@bp_workflow.route('/task/delete/<task_id>', methods=['GET'])
def wf_task_delete(task_id):
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=401)
    task = Task(task_id)
    result = task.delete_one_task()
    try:
        found_task = task.get_raw_task()
        email_option = {
            'executor': user_id,
            'watchers': found_task.get('watchers'),
            'userId': user_id,
            'title': found_task['fields'].get('title'),
            'detail': found_task['fields'].get('detail'),
            'dueDate': found_task['fields'].get('dueDate')
        }
        TransactionEmail.send_task_email(task_id, email_option, found_task.get('attachment'), email_type='DELETE')
    except NotExists:
        return Utils.beop_response_error(msg='Not existed work order id {id}'.format(id=task_id))
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 任务 保存
@bp_workflow.route('/task/save/', methods=['POST'])
def wf_task_save():
    task = None
    user_id = AuthManager.get_userId()
    rq_data = request.get_json()
    executor_old = ''
    if rq_data.get("_id"):
        task = Task(rq_data.get("_id"))
        if rq_data.get('nodes'):
            try:
                raw_task = task.get_raw_task()
                executor_old = raw_task.get('executor')      # 原来执行人
                raw_nodes = raw_task.get('process').get('nodes')
                for index in rq_data.get('nodes'):
                    raw_nodes[int(index)]['members'] = rq_data.get('nodes').get(index).get('member')
                    if int(index) == raw_task.get('node_index'):
                        rq_data['executor'] = rq_data.get('nodes').get(index).get('member')[0]
                        rq_data['watchers'] = list(map(int, set(rq_data['watchers'])))

                rq_data['process'] = raw_task.get('process')
                rq_data['process']['nodes'] = raw_nodes
            except Exception as e:
                logging.error('工单保存节点信息失败:' + str(e))
        task.update_task(rq_data)
        rq_data = task.get_raw_task()

    team = Team()
    fields = rq_data.get('fields')
    tags = rq_data.get("tags") if rq_data.get("tags") else []
    attachment = rq_data.get('attachment') if rq_data.get('attachment') else []
    process_member = rq_data.get('processMember')
    team_id = rq_data.get('teamId')
    found_team = None
    if team_id:
        found_team = team.get_team_by_id(team_id)
    else:
        if user_id:
            found_team = team.get_team_by_user_id(user_id)
        elif rq_data.get('taskGroupId'):
            found_team = TaskGroup().get_team_id_by_group_id(rq_data.get('taskGroupId'))
    if not rq_data.get('process'):      # 判断是新建工单还是编辑工单
        process_id = fields.get('process')
        process = team.get_process(found_team, process_id)
        if not process:
            # get default process
            process = team.get_default_process(found_team)
            if not process:
                process = team.add_process(found_team.get('_id'), team.get_default_process_model())
    else:
        process = rq_data.get('process')
    template = None
    executor = None

    if process:
        template = Template(process.get('template_id'))

    if rq_data.get('taskGroupId'):
        task_group_id = rq_data.get('taskGroupId')
    else:
        task_group_id = fields.get('taskGroup')

    if not task_group_id:
        default_group = TaskGroup().get_default_group(found_team.get('_id'))
        task_group_id = default_group.get('_id') if default_group else None

    if not rq_data.get('nodes'):
        if fields.get('process'):
            del fields['process']
        if fields.get('taskGroup'):
            del fields['taskGroup']
        if fields.get('addedUsers[]'):
            del fields['addedUsers[]']
        if fields.get('tags[]'):
            del fields['tags[]']
        if process.get('nodes'):

            def get_member_ids(members):
                ret = []
                for member in members:
                    if isinstance(member, dict):
                        ret.append(member.get('id'))
                    elif isinstance(member, int):
                        ret.append(member)
                return ret

            if process.get('nodes'):
                if process_member.get(str(0)):  # 对于诊断工单发送默认流程使用下标做为node id
                    for index, node in enumerate(process.get('nodes')):
                        if process_member.get(str(index)):
                            node['members'] = get_member_ids(process_member.get(str(index)))
                        else:
                            node['members'] = []
                else:
                    for node in process.get('nodes'):
                        if process_member.get(node.get('_id')):
                            node['members'] = [process_member.get(node.get('_id'))[0].get('id')]
                        else:
                            node['members'] = []

        first_node = process.get('nodes')[0]
        if not first_node or not first_node.get('members'):
            return Utils.beop_response_error(msg='next node member is empty.')

        if len(first_node.get('members')):
            if isinstance(first_node.get('members'), list):
                executor = first_node.get('members')[0]
    else:
        first_node = rq_data.get('nodes')['0']
        if not first_node or not first_node.get('member'):
            return Utils.beop_response_error(msg='next node member is empty.')

        if len(first_node.get('member')):
            if isinstance(first_node.get('member'), list):
                executor = first_node.get('member')[0]

    task_to_save = {
        'creator': user_id if user_id else rq_data.get('userId'),
        'createTime': datetime.now(),
        'taskGroupId': str(task_group_id),
        'fields': fields,
        'template': template.get_template() if template else '',
        'process': process,
        'node_index': 0,
        'executor': executor,
        'status': TaskStatus.NEW,
        'tags': tags,
        'attachment': attachment,
        'watchers': rq_data.get('watchers'),
        'teamId': found_team.get('_id'),
        'faultImage': rq_data.get('image')
    }
    if executor_old == '':
        task = Task()
        task_id = task.save_task(task_to_save)
        if not task_id:
            return Utils.beop_response_error()
    else:
        task_id = rq_data.get('_id')
    try:
        rq_data.update({
            'executor': executor,
            'oldexecutor': executor_old,
            'watchers': rq_data.get('watchers'),
            'userId': user_id or rq_data.get('userId'),
            'title': rq_data['fields'].get('title'),
            'detail': rq_data['fields'].get('detail'),
            'dueDate': rq_data['fields'].get('dueDate'),
            'zone': rq_data['fields'].get('diagnosisZone'),
            'equipment': rq_data['fields'].get('diagnosisEquipmentName'),
            'faultImage': rq_data.get('image')
        })
        TransactionEmail.send_task_email(task_id, rq_data, attachment)
    except Exception:
        logging.error("Unhandled exception! Locals: %s", locals(), exc_info=True, stack_info=True)

    # 消息
    if first_node.get('members'):       # 新建工单
        try:
            message = Message()
            mu = MessageUser()
            workflow_info = {
                "id": task_id,
                "groupId": None,
                "willReceived": task.get_all_willReceived_user_id_list_by_id(task_id=task_id),
                "op": "new"
            }
            msg_id = message.add_new_workflow_message_with_return_id(user_id, fields.get('title', ""),
                                                                     fields.get('detail', ""), workflow_info)
            if msg_id:
                mu.add_workflow_users_message(first_node.get('members'), msg_id)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    elif first_node.get('member'):     # 修改工单
        try:
            message = Message()
            mu = MessageUser()
            workflow_info = {
                "id": task_id,
                "groupId": None,
                "willReceived": task.get_all_willReceived_user_id_list_by_id(task_id=task_id),
                "op": "Edit"
            }
            msg_id = message.add_new_workflow_message_with_return_id(user_id, fields.get('title', ""),
                                                                     fields.get('detail', ""), workflow_info)
            if msg_id:
                mu.add_workflow_users_message(first_node.get('member'), msg_id)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)

    # David 20161202 新增逻辑 fields.type = 6 为诊断反馈工单
    if fields.get('type') == TaskType.FEEDBACK:
        try:
            FaultId = fields.get('faultId')
            projId = fields.get('charts').get('projectId')
            startTime = fields.get('charts').get('chartStartTime')
            endTime = fields.get('charts').get('chartEndTime')
            set_diagnosis_feedBack(projId, FaultId, task_id, FeedBackStatus.WAIT, startTime, endTime)
            if fields.get('rawDetail'):
                task = Task()
                task.add_comment_by_task_id(task_id, user_id, fields.get('rawDetail'))
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)

    # vicky 20170214 新增逻辑，fields.type = 5 为诊断故障工单,生成的工单id保存到diagnosis_notices的OrderId字段
    if fields.get('type') == TaskType.DIAGNOSIS:
        try:
            NoticeId = fields.get('noticeId')
            projId = fields.get('charts').get('projectId')
            set_diagnosis_orderId(projId, NoticeId, task_id.__str__())
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)

    # 推送
    from beopWeb.mod_appCommon import pushService

    if rq_data.get('watchers') is None:
        rq_data['watchers'] = []
    pushService.sendMessage({
        'message': {'type': 'workflow', 'id': str(task_id)},
        'title': rq_data['fields'].get('title')[0:20],
        'alert': rq_data['fields'].get('detail')[0:30],
        'userId_list': [executor] + rq_data.get('watchers', []),
        'projId_list': [],
        'registration_id': []
    })

    return Utils.beop_response_success(task_id)


# 任务 获取
@bp_workflow.route('/task/<task_id>', methods=['GET'])
def wf_task_get(task_id):
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()

    task = Task(task_id)
    task_found = task.get_task()
    if not task_found or not task_found.get('process'):
        return Utils.beop_response_error(code=404)
    tg = TaskGroup()
    task_found.update(
        {'taskGroup': tg.get_raw_group_by_id(task_found.get('taskGroupId')),
         'processName': task_found.get('process').get('name')})

    return Utils.beop_response_success(task_found)


# 得到特定任务的进程
@bp_workflow.route('/task/progress/<task_id>', methods=['GET'])
def get_task_progress(task_id):
    message = Message()
    rv = message.get_task_activity_by_id(task_id)
    return Utils.beop_response_success(rv)


# 任务 通过
@bp_workflow.route('/passTask/', methods=['POST'])
def wf_task_pass():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()
    rq_data = request.get_json()
    task_id = rq_data.get('taskId')
    next_user_id = rq_data.get('nextUserId')
    task = Task(task_id)
    note = rq_data.get('note')
    result = task.task_action(user_id, TaskAction.PASS, next_user_id, note)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 任务 不通过
@bp_workflow.route('/noPassTask/', methods=['POST'])
def wf_task_no_pass():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()
    rq_data = request.get_json()

    task = Task(rq_data.get('taskId'))

    result = task.task_action(user_id, TaskAction.NO_PASS, note=rq_data.get('note'))
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 任务 完成
@bp_workflow.route('/task/complete/', methods=['POST'])
def wf_task_complete():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()
    rq_data = request.get_json()
    task_id = rq_data.get('taskId')
    next_user_id = rq_data.get('nextUserId')

    task = Task(task_id)
    task_info = task.get_raw_task()
    result = task.task_action(user_id, TaskAction.COMPLETE, next_user_id, rq_data.get('note'))
    if result:
        # 任务完成后添加动态
        try:
            message = Message()
            mu = MessageUser()
            msg_user_id = task.get_all_willReceived_user_id_list_by_id(exit_task=[task_info])
            fields = task_info.get("fields")
            workflow_info = {
                "id": result,
                "groupId": None,
                "willReceived": msg_user_id,
                "op": ActivityType.COMPLETE
            }
            msg_id = message.add_new_workflow_message_with_return_id(user_id, fields.get('title', ""),
                                                                     fields.get('detail', ""), workflow_info)
            if msg_id:
                mu.add_workflow_users_message(msg_user_id, msg_id)
        except Exception as e:
            logging.error("/saveTask/ 添加消息发生错误" + str(e))
            print("/saveTask/ 添加消息发生错误" + str(e))
            pass

        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 任务 评论
@bp_workflow.route('/task/reply/insert', methods=['POST'])
def add_task_reply():
    use_id = AuthManager.get_userId()
    if not use_id:
        return Utils.beop_response_error(code=403)

    rq_data = request.get_json()
    ofTransactionId = rq_data.get("ofTransactionId", None)
    content = rq_data.get("content", "")
    if not ofTransactionId:
        return Utils.beop_response_error(msg="Reply to a task need a param ofTransactionId")
    message = Message()
    message_user = MessageUser()
    task = Task()

    try:
        # 给task 添加 comment
        task.add_comment_by_task_id(ofTransactionId, use_id, content)

        willReceived = task.get_all_willReceived_user_id_list_by_id(task_id=ofTransactionId)

        # 添加 message 以及给对应的人员添加 message ID
        msg_id = message.add_new_workflow_message_with_return_id(use_id, "Work order replied.", content, {
            "id": ofTransactionId,
            "groupId": None,
            "op": "reply",
            "willReceived": willReceived
        })
        message_user.add_workflow_users_message(willReceived, msg_id)
    except Exception as e:
        logging.error("工单任务评论失败:" + str(e))
        return Utils.beop_response_error()

    return Utils.beop_response_success()


# 工单动态
@bp_workflow.route('/activity/getActivity/<int:activity_time_type>', methods=["GET", 'POST'])
def get_activities(activity_time_type):
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)
    if activity_time_type is None:
        return Utils.beop_response_error(msg="You should have a activity_time_type in you route request !")
    page = 1
    limit = 10
    if request.method == "POST":
        rq_data = request.get_json()
        page = rq_data.get("page")
        limit = rq_data.get("limit")

    message = Message()
    result, totalCount, err_msg, back_up_activity_type = message.get_user_activity(
        user_id, activity_time_type, page=page, limit=limit)

    if err_msg:
        return Utils.beop_response_error(err_msg)
    return Utils.beop_response_success({
        "msg": result,
        "totalCount": totalCount,
        "backUpActivityType": back_up_activity_type
    })


# 回复动态当中的具体某一条
@bp_workflow.route('/activity/reply/', methods=['POST'])
def reply_activities():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    rq_data = request.get_json()

    content = rq_data.get("content", None)
    msg_id = rq_data.get("msgId", None)

    if not content or not msg_id:
        return Utils.beop_response_success()

    message = Message()
    rv = message.add_activity_comment(user_id, msg_id, content)

    if rv:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/authorization/isUserHasTeam', methods=["GET"])
def auth_user_has_team():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)
    team = Team()
    rv = team.user_has_team(user_id)
    return Utils.beop_response_success(rv)


# 资产管理 保存预防性工单
@bp_workflow.route('/saveTask/', methods=['POST'])
def wf_task_save_asset():
    user_id = AuthManager.get_userId()
    rq_data = request.get_json()
    team = Team()

    found_team = team.get_team_by_user_id(user_id)
    process_id = rq_data.get('process')
    process = team.get_process(found_team, process_id)
    template_id = rq_data.get('template_id')
    template = Template(template_id)

    task_group_id = rq_data.get('taskGroup')
    try:
        del rq_data['process']
        del rq_data['template_id']
        del rq_data['taskGroup']
    except Exception:
        pass

    task_to_save = {
        'creator': user_id,
        'createTime': datetime.now(),
        'taskGroupId': task_group_id,
        'fields': rq_data.get('fields'),
        'template': template.get_template(),
        'process': process,
        'node_index': 0,
        "attachment": rq_data.get('attachment', [])
    }

    task = Task(rq_data.get('_id'))
    result = task.update_task(task_to_save)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 修改当前节点的执行人
@bp_workflow.route('/changeCurrentNode/', methods=["POST"])
def change_current_node():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)
    rq = request.get_json()
    task_id = rq.get('taskId')
    if not task_id:
        return Utils.beop_response_error(msg=Utils.msg_param_required('taskId'))
    members = rq.get('members')
    if not members:
        return Utils.beop_response_error(msg=Utils.msg_param_required('members'))
    task = Task(task_id)
    try:
        task.change_current_node_member(members)
        found_task = task.get_raw_task()
        email_option = {
            'executor': members[0],
            'watchers': found_task.get('watchers'),
            'userId': user_id,
            'title': found_task['fields'].get('title'),
            'detail': found_task['fields'].get('detail'),
            'dueDate': found_task['fields'].get('dueDate')
        }
        TransactionEmail.send_task_email(task_id, email_option, found_task.get('attachment'), email_type='NEW')
    except NotExists:
        return Utils.beop_response_error(msg='Not existed work order id {id}'.format(id=task_id))
    return Utils.beop_response_success()


# 完成任务
@bp_workflow.route('/task/finish/', methods=["POST"])
def finish_task():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)
    rq = request.get_json()
    task_id = rq.get('taskId')
    task = Task(task_id)
    try:
        task.finish_task()
        found_task = task.get_raw_task()
        email_option = {
            'executor': user_id,
            'watchers': found_task.get('watchers'),
            'userId': user_id,
            'title': found_task['fields'].get('title'),
            'detail': found_task['fields'].get('detail'),
            'dueDate': found_task['fields'].get('dueDate')
        }
        TransactionEmail.send_task_email(task_id, email_option, found_task.get('attachment'), email_type='PASS')
    except NotExists:
        return Utils.beop_response_error(msg='不存在id为{id}的工单'.format(id=task_id))
    return Utils.beop_response_success()


# 获取团队人员架构
@bp_workflow.route('/teamArch/', methods=["GET"])
def get_team_arch():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)
    team = Team()
    founded_team = team.get_raw_team_by_user_id(user_id)
    if not founded_team:
        return Utils.beop_response_success([])
    all_user_ids = team.get_all_user_ids_by_team_id(founded_team.get('_id'))
    users = User().get_user_list_info(all_user_ids)
    return Utils.beop_response_success(users)


# 工单统计接口
@bp_workflow.route('/task/getStatistics/<id>', methods=['POST'])
def getStatistics(id=None):
    rq_data = request.get_json()

    timeStart = rq_data.get('timeStart')
    timeEnd = rq_data.get('timeEnd')
    if timeStart is None or timeEnd is None:
        raise Exception("no format time")
    task_filter = {'fields.dueDate': {'$gte': timeStart, '$lte': timeEnd}}
    tgroupId = rq_data.get('taskGroup')
    if tgroupId is not None:
        tgroupId = ObjectId(tgroupId)
        task_filter['taskGroupId'] = tgroupId
    teamId = rq_data.get('team')
    sto = StatisticsOrders()
    try:
        # 获取用户ID队列
        if id is not None:
            _id = ObjectId(id)
        else:
            _id = None
        team = Team()
        teamRt = team.get_team_by_id(_id)
        userIdList = sto.formatArchMembers(teamRt.get('arch'), teamId)
        # 根据时间查询工单
        if userIdList:
            task_filter.update({'creator': {'$in': userIdList}})
            pass
        task = Task()
        task_filter.update({'process.nodes': {'$exists': True}})
        task_list, totalCount = task.task_filter(task_filter)
        # 综合统计
        roverview = sto.overview(task_list, totalCount)
        # 详细内容
        userTasks = sto.findUserOfOrder(task_list, userIdList)
        rdetail = sto.detail(userTasks)
    except Exception as e:
        return Utils.beop_response_error(msg=e.__str__())
    rt = {'overview': roverview, 'detail': rdetail}
    return json.dumps(rt, ensure_ascii=False)


@bp_workflow.route('/task/getHistoryStatistics', methods=['POST'])
def getStatisticsHistory():
    rt = []
    try:
        rq_data = request.get_json()
        userIdList = rq_data.get('arrUserId')
        if userIdList is None:
            raise Exception('参数错误:用户列表为空')
        elif len(userIdList) < 1:
            raise Exception('参数错误:用户列表为空')
        timeStart = rq_data.get('timeStart')
        if timeStart is None:
            raise Exception('参数错误:开始时间为空')
        timeEnd = rq_data.get('timeEnd') 
        if timeEnd is None:
            raise Exception('参数错误:结束时间为空')
        timeFormat = rq_data.get('timeFormat') 
        if timeFormat is None:
            raise Exception('参数错误:日期格式化类型为空')
        itemList = rq_data.get('item') 
        if itemList is None:
            raise Exception('参数错误:data项列表为空')
        elif len(itemList) < 1:
            raise Exception('参数错误:data项列表为空')
        # 工单查询
        task = Task()
        task_filter = {'fields.dueDate': {'$gte': timeStart, '$lte': timeEnd}, 'process.nodes': {'$exists': True}, }
        task_list, totalCount = task.task_filter(task_filter)
        # 使用dateutil分割日期
        timeShaft = []
        if timeFormat == 'd1':
            timeShaft = list(rrule(DAILY, dtstart=parse(timeStart), until=parse(timeEnd)))
        elif timeFormat == 'M1':
            timeShaft = list(rrule(MONTHLY, dtstart=parse(timeStart), until=parse(timeEnd)))

        # 工单归属
        sto = StatisticsOrders()
        timeShaft = [timeStr.strftime('%Y-%m-%d') for timeStr in timeShaft]
        userTasks = sto.formatOrdersByUserTimes(task_list, userIdList, timeShaft, timeFormat)

        for key in userTasks:
            userdetail = sto.userOrderDetail(userTasks[key], key)
            if 'completeRate' not in itemList:
                userdetail['data'].pop('completeRate')
            elif 'completeTime' not in itemList:
                userdetail['data'].pop('completeTime')
            rt.append(userdetail)
    except Exception as e:
        return Utils.beop_response_error(msg=e.__str__())
    return json.dumps(rt, ensure_ascii=False)

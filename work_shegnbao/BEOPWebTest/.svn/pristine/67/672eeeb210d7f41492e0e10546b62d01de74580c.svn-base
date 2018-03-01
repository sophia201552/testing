__author__ = 'liqian'

from datetime import datetime, timedelta
import logging

from flask import request, json

from beopWeb.mod_common.Utils import Utils
from .StaticRelate import StaticRelate
from .StaticsRoles import StaticsRoles
from .Statistics import Statistics
from .UserSettings import UserSetting
from beopWeb.mod_workflow import bp_workflow
from .Scheduler import Scheduler
from .Activity import Activity
from .ReportEmailSetting import ReportEmailSetting
from .VerisionHistory import VersionHistory
from beopWeb.mod_admin.User import User
from .Reply import Reply
from .Transaction import Transaction
from .TransactionGroup import TransactionGroup
from .TransactionGroupUser import TransactionGroupUser
from .Record import Record, RecordType


# 加载工单手动插入页面
@bp_workflow.route('/loadInsertPage', methods=['POST'])
def load_insert_page():
    from beopWeb.BEOPDataAccess import BEOPDataAccess

    rq_data = request.get_json()

    user_id = rq_data.get('userId')
    group_id = rq_data.get('groupId')

    chartPointList = rq_data.get('chartPointList')
    chartQueryCircle = rq_data.get('chartQueryCircle')
    chartStartTime = rq_data.get('chartStartTime')
    chartEndTime = rq_data.get('chartEndTime')
    logging.info('加载工单手动插入页面:' + json.dumps(rq_data, ensure_ascii=False))
    if chartPointList:
        project_id = rq_data.get('projectId')

        list_value, list_time, list_description = BEOPDataAccess.getInstance().workflow_get_fault_curve_data(project_id,
                                                                                                             chartPointList,
                                                                                                             chartQueryCircle,
                                                                                                             chartStartTime,
                                                                                                             chartEndTime)
    else:
        list_value, list_time, list_description = [], [], []
    group = StaticRelate.get_group_by_user_id(user_id, 'id', 'name')
    group_members = []
    if group_id is None and group and group[0]:
        group_id = group[0].get('id')
        group_members = StaticRelate.get_user_in_group(group_id, 'userid', 'userfullname', 'username')

    return Utils.beop_response_success(
        {'list_value': list_value,
         'list_time': list_time,
         'list_description': list_description,
         'group': group,
         'groupMembers': group_members})


# 获得工单组成员
@bp_workflow.route('/getGroupMembers/<group_id>', methods=['GET'])
def group_members(group_id):
    group_members = StaticRelate.get_user_in_group(group_id, 'userid', 'userfullname', 'username')
    return Utils.beop_response_success({'groupMembers': group_members})


@bp_workflow.route('/getTeamMember/', methods=['POST'])
def get_team_members():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    group_id = rq_data.get('groupId')
    role_id = rq_data.get('roleId')
    if not user_id:
        return Utils.beop_response_error()
    members = User.get_users_flat_by_supervisor(user_id, 'id', 'userfullname', 'userEmail', 'userpic')
    added_user = StaticRelate.get_user_in_group_and_role(group_id, role_id, 'userid')
    added_user_id = [user.get('userid') for user in added_user]
    result = [member for member in members if member.get('id') not in added_user_id]
    return Utils.beop_response_success(result)


@bp_workflow.route('/team/<user_id>/<group_id>')
def load_team(user_id, group_id):
    if user_id is None:
        return Utils.beop_response_error()

    groups = StaticRelate.get_group_by_user_id(user_id, 'id', 'name', 'pic')
    users = User.get_users_flat_by_supervisor(user_id, 'id')
    sub_users_id_list = [user.get('id') for user in users]
    roles = StaticsRoles.get_all_roles('id', 'nm')
    current_user = User.query_user_by_id(user_id, 'isManager')
    result = {'isManager': current_user.get('isManager')}
    team = []
    for group in groups:
        if group_id != '-1' and str(group.get('id')) != str(group_id):
            continue
        rv_group = {'groupId': group.get('id'),
                    'groupName': group.get('name'),
                    'groupPic': Utils.IMG_SERVER_DOMAIN + '/static/images/workflow/' + group.get('pic'),
                    'roles': {role.get('id'): {'roleName': role.get('nm'), 'users': []} for role in roles}}

        users_in_group = StaticRelate.get_user_in_group(group.get('id'), 'userid', 'roleid', 'userfullname', 'userpic',
                                                        'isManager')
        for user in users_in_group:
            if user.get('userid') in sub_users_id_list:
                user['editable'] = True
            else:
                user['editable'] = False
            rv_group.get('roles').get(user.get('roleid')).get('users').append(user)
        team.append(rv_group)
    result['team'] = team
    return Utils.beop_response_success(result)


@bp_workflow.route('/getTransactionGroup/<user_id>/')
def get_transaction_group(user_id):
    return Utils.beop_response_success(StaticRelate.get_group_by_user_id(user_id, 'id', 'name'))


@bp_workflow.route('/groupEfficiency/', methods=['POST'])
def load_group_efficiency():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    begin_time = rq_data.get('beginTime')
    end_time = rq_data.get('endTime')

    result = {}
    groups = StaticRelate.get_group_by_user_id(user_id, 'id', 'name')
    groups_id = [str(group.get('id')) for group in groups]
    if not groups:
        return Utils.beop_response_success(result)
    group_statistics = Statistics.statistics_group(groups_id, begin_time, end_time)

    result = {group.get('groupId'): group for group in group_statistics}

    return Utils.beop_response_success(result)


@bp_workflow.route('/memberEfficiency/', methods=['POST'])
def load_member_efficiency():
    rq_data = request.get_json()
    group_id = rq_data.get('groupId')
    begin_time = rq_data.get('beginTime')
    end_time = rq_data.get('endTime')

    result = []
    users = StaticRelate.get_user_in_group(group_id, 'userid', 'userfullname')
    users_id = [str(user.get('userid')) for user in users]
    if not users:
        return Utils.beop_response_success(result)

    users_statistics = Statistics.statistics_user_in_group(group_id, users_id, begin_time, end_time)
    result = [user for user in users_statistics if user.get('userId') is not None]

    return Utils.beop_response_success(result)


@bp_workflow.route('/myCreated/', methods=['POST'])
def my_created():
    req = request.get_json()
    user_id = req.get('userId')

    where = {}
    if req.get('groupId') is not None:
        where['groupId'] = req.get('groupId')

    if req.get('dueDate') is not None:
        where['dueDate'] = datetime.datetime.strptime(req.get('dueDate'), '%Y-%m-%d').strftime('%Y-%m-d %H:%M:%S')

    if req.get('createTime') is not None:
        where["DATE_FORMAT(createTime,'%Y-%m-%d')"] = req.get('createTime')

    if req.get('executorId') is not None:
        where['executorId'] = req.get('executorId')

    if req.get('critical') is not None:
        where['critical'] = req.get('critical')

    rv = Transaction.get_my_created_transaction(user_id)
    return Utils.beop_response_success(rv)


@bp_workflow.route('/saveSetting/', methods=['POST'])
def save_setting():
    req = request.get_json()
    user_id = req.get('userId')
    settings = req.get('settings')
    user_settings = UserSetting()
    if user_settings.insert_or_update_user_settings(user_id, settings):
        return Utils.beop_response_success(None, '2002')
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/getSetting/', methods=['POST'])
def get_setting():
    req = request.get_json()
    user_settings = UserSetting().get_all_user_settings(req.get('userId'))
    return Utils.beop_response_success(user_settings)


@bp_workflow.route('/listTodayTasks', methods=['POST'])
def plan_list_today_tasks():
    req = request.get_json()
    user_id = req.get('userId')
    scheduler = Scheduler()
    start_time = datetime.strftime(datetime.today(), '%Y-%m-%d 00:00:00')
    end_time = datetime.strftime(datetime.today(), '%Y-%m-%d 23:59:59')
    scheduler_result = scheduler.get_user_today_scheduler(user_id)
    trans = Transaction()
    trans_result = trans.get_user_transaction_by_between(user_id, start_time, end_time)
    return Utils.beop_response_success({'scheduler': scheduler_result, 'transaction': trans_result})


@bp_workflow.route('/insert/reply', methods=['POST'])
def insert_reply():
    req_data = request.get_json()
    if not req_data.get('ofTransactionId'):
        return Utils.beop_response_error(msg='task id is empty.')
    reply = Reply()
    detail = reply.replace_base64_with_img(req_data.get('detail'), req_data.get('ofTransactionId'))
    if not detail:
        return Utils.beop_response_error()

    trans_id = req_data.get('ofTransactionId')
    reply_to_id = req_data.get('replyToId')
    if not reply_to_id:
        record = Record()
        all_records = record.get_records_by_trans_id(trans_id)
        if len(all_records):
            latest_records = all_records[0]
            reply_to_id = latest_records.get('id')

    reply_model = {
        'replyTime': datetime.now(),
        'replyUserId': req_data.get('userId'),
        'detail': detail,
        'ofTransactionId': trans_id,
        'replyToId': reply_to_id
    }

    reply_result = reply.insert(reply_model)
    if reply_result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/group_activities/<user_id>/', methods=['GET'])
@bp_workflow.route('/group_activities/<user_id>/<latest_update_time>', methods=['GET'])
def activities(user_id, latest_update_time=None):
    activity = Activity()

    if not latest_update_time:
        latest_update_time = datetime.now() - timedelta(days=60)
    user = User()
    static_relate = StaticRelate()
    group_users_id_list = static_relate.get_group_user_id_by_user_id(user_id)
    activities = activity.get_group_activity_after(group_users_id_list, latest_update_time)

    activity_ids = []
    for item in activities:
        if str(item.get('id')) not in activity_ids:
            activity_ids.append(str(item.get('id')))
    all_users_map = user.get_all_user_map()

    reply = Reply()
    reply_result = reply.get_reply_after(latest_update_time)
    reply_map = {}
    for item in reply_result:
        reply_to_id = str(item.get('replyToId'))
        user_item = all_users_map.get(item.get('replyUserId'))
        item['replyTime'] = item.get('replyTime').strftime('%Y-%m-%d %H:%M:%S')
        item['userName'] = user_item.get('userfullname')
        item['userpic'] = user_item.get('userpic')
        if not reply_map.get(reply_to_id):
            reply_map[reply_to_id] = []
        reply_map.get(reply_to_id).append(item)
        if item.get('replyToId') and str(item.get('replyToId')) not in activity_ids:
            reply_to_activity = activity.get_by_id(item.get('replyToId'))
            if not reply_to_activity:
                continue
            activities = [reply_to_activity] + activities
            activity_ids.append(str(item.get('replyToId')))

    trans = Transaction()

    for activity in activities:
        activity_id = str(activity.get('id'))
        activity['trans_title'] = trans.get_transaction_by_id(activity.get('linkToTransactionId')).get('title')
        user_id = activity.get('userId')
        user = all_users_map.get(user_id)
        if not user:
            continue
        activity['userName'] = user.get('userfullname')
        activity['userpic'] = user.get('userpic')
        activity['opTime'] = activity.get('opTime').strftime('%Y-%m-%d %H:%M:%S')
        if activity_id in reply_map:
            activity['reply'] = reply_map.get(activity_id)

    return Utils.beop_response_success(activities)


@bp_workflow.route('/users/group/<user_id>', methods=['GET'])
def user_group_user_id(user_id):
    tg = TransactionGroup()
    result = tg.get_all_group_by_user_id(user_id)
    return Utils.beop_response_success(result)


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

    result = user.get_users_flat_by_supervisor(supervisor_id, 'id', 'userfullname', 'userpic')
    return Utils.beop_response_success(
        [{'id': item.get('id'),
          'userfullname': item.get('userfullname'),
          'userpic': item.get('userpic')} for item in result])


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
    return Utils.beop_response_success()


@bp_workflow.route('/group/delete/<group_id>/<user_id>', methods=['GET'])
def group_delete(group_id, user_id):
    tg = TransactionGroup()
    group = tg.get_trans_group_by_id(group_id)
    if not group:
        return Utils.beop_response_error(msg='the group does not exist')
    if str(user_id) != str(group.get('creatorId')):
        return Utils.beop_response_error(msg='you have not permission to  delete the group')
    if tg.delete_group(group_id):
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg='delete group failed')


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
    return Utils.beop_response_success(
        {
            'creatorId': group.get('creatorId'),
            'description': group.get('description'),
            'id': group.get('id'),
            'createtime': group.get('createTime'),
            'name': group.get('name'),
            'pic': group.get('pic'),
            'members': [{'id': item.get('userId'),
                         'userfullname': user_map.get(item.get('userId')).get('userfullname'),
                         'userpic': user_map.get(item.get('userId')).get('userpic')} for item in members]
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
    if group.get('creatorId') != int(user_id):
        return Utils.beop_response_error(code=403)

    result = tg.update_group(group_id, name, description)
    if result:
        trans = Transaction()
        model = {
            'name': name,
            'description': description,
            'users': users
        }
        trans_id = trans.add_trans(model)
        record = Record()
        record.add_records(user_id, trans_id,
                           {'detail': json.dumps({'name': name, 'description': description, 'members': users})},
                           RecordType.EDIT)
        tgu = TransactionGroupUser()
        if users is not None:
            result &= tgu.update_group_members(group_id, users)
        if users is None:
            result &= tgu.delete_group_members(group_id)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/reportEmailSetting/get/<user_id>', methods=['GET'])
# 获得一个用户的报表发送设置
def get_report_email_setting(user_id):
    if not user_id:
        return Utils.beop_response_error(msg='need the userId')
    report_setting = ReportEmailSetting()
    result = report_setting.get_all_report_email_setting(user_id)
    if result:
        return Utils.beop_response_success(result)
    else:
        return Utils.beop_response_success({})


@bp_workflow.route('/reportEmailSetting/update/<user_id>', methods=['POST'])
# 更新一个用户的报表发送设置，先删除后重新加入
def update_report_email_setting(user_id):
    rq_data = request.get_json()
    if not user_id or not rq_data:
        return Utils.beop_response_error(msg='need the userId or data')
    report_setting = ReportEmailSetting()

    result = report_setting.update_report_email_setting(int(user_id), rq_data)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg='some error on insert data to DATABASE')


# 版本更新历史
# 得到准确的一个版本历史
@bp_workflow.route('/versionHistory/getAccurate/<version_id>', methods=['GET'])
def get_current_history(version_id):
    history = VersionHistory()
    result = history.get_accurate_verison(int(version_id))
    if result:
        return Utils.beop_response_success(result)
    else:
        return Utils.beop_response_success()


# 得到所有的版本
@bp_workflow.route('/versionHistory/getAll', methods=['GET'])
def get_version_history():
    history = VersionHistory()
    result = history.get_version_history()
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

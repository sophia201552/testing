__author__ = 'liqian'

from flask import Blueprint
from flask import request
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_common.Utils import Utils
from .StaticRelate import StaticRelate
from .Transaction import Transaction
from beopWeb.mod_admin.User import User
from .StaticsRoles import StaticsRoles
from .Statistics import Statistics
from datetime import datetime

bp_workflow = Blueprint('workflow', __name__,
                        template_folder='templates/mod_workflow', url_prefix='/workflow')

# 用户管理页面加载
@bp_workflow.route('/loadInsertPage', methods=['POST'])
def load_insert_page():
    rq_data = request.get_json()

    user_id = rq_data.get('userId')
    group_id = rq_data.get('groupId')

    chartPointList = rq_data.get('chartPointList')
    chartQueryCircle = rq_data.get('chartQueryCircle')
    chartStartTime = rq_data.get('chartStartTime')
    chartEndTime = rq_data.get('chartEndTime')
    dbName = BEOPDataAccess.getInstance().getProjMysqldb(rq_data.get('projectId'))

    list_value, list_time, list_description = BEOPDataAccess.getInstance().workflow_get_fault_curve_data(dbName,
                                                                                                         chartPointList,
                                                                                                         chartQueryCircle,
                                                                                                         chartStartTime,
                                                                                                         chartEndTime)
    group = StaticRelate.get_group_by_user_id(user_id, 'id', 'name')
    group_members = []
    if group_id is None and group[0]:
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


@bp_workflow.route('/GetTransaction/', methods=['POST'])
def workflow_transaction_get_fields():
    rq_data = request.get_json()
    transaction_id = rq_data.get('id')
    fields = rq_data.get('fields')
    if transaction_id is None:
        return Utils.beop_response_error('no id')
    if not fields:
        return Utils.beop_response_error('no fields')
    result = Transaction.get_transaction_by_id(transaction_id, *fields)
    return Utils.beop_response_success(result)


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
                    'groupPic': group.get('pic'),
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





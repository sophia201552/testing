from datetime import datetime

from flask import Blueprint
from flask import request

from .User import User
from .Project import Project
from .Records import Records
from .MenuConfigure import MenuConfigure
from .ProjectPermission import ProjectPermission
from .Token import Token
from .UserRole import UserRole
from beopWeb.mod_common.Utils import *


bp_admin = Blueprint('admin', __name__,
                     template_folder='templates/mod_admin', url_prefix='/admin')


# 用户管理页面加载
@bp_admin.route('/accountManger/<user_id>', methods=['GET'])
def load_account_manager(user_id):
    user = User.query_user_by_id(user_id, 'id', 'username', 'userfullname', 'isManager', 'supervisor', 'userpic',
                                 'useremail')
    if user:
        supervisor_id = user.get('supervisor')
        if supervisor_id is not None:
            supervisor = User.query_user_by_id(supervisor_id, 'id', 'userfullname')
            user['supervisorName'] = supervisor.get('userfullname')
        return Utils.beop_response_success(user)
    else:
        return Utils.beop_response_error(user, '10001')


# 用户信息修改
@bp_admin.route('/updateUser', methods=['POST'])
def update_user():
    data = request.get_json()
    if not data:
        return Utils.beop_response_error(data, '10001')

    user_id = data.get('id')
    if not user_id:
        return Utils.beop_response_error(id, '10001')

    success = False
    code = []

    # 修改用户名
    user_name = data.get('userfullname')
    if user_name:
        success = User.update_user(user_id, 'userfullname=' + user_name)

    # 修改邮箱地址
    email = data.get('email')
    if email:
        success = User.update_user(user_id, 'useremail=' + email, 'username=' + email)

    # 修改管理权限标志
    is_manager = data.get('isManager')
    if is_manager is not None and (is_manager == 0 or is_manager == 1):
        success = User.update_user(user_id, 'isManager=' + is_manager)

    # 修改密码
    old_password = data.get('oldPassword')
    password = data.get('password')
    if password:
        if not old_password:
            success = False
            code.append(1001)
        else:
            old_password_is_ok = User.verify_password_by_user_id(user_id, old_password)
            if old_password_is_ok:
                success = User.update_user_password(user_id, password)
                code.append(2001)
            else:
                success = False
                code.append(1002)

    # 修改直属上级
    supervisor = data.get('supervisor')
    if supervisor:
        success = User.update_user(user_id, 'supervisor=' + supervisor)

    if success:
        return Utils.beop_response_success(data, code)
    else:
        return Utils.beop_response_error(data, code)


# 用户操作记录
@bp_admin.route('/getRecords', methods=['POST'])
def get_records():
    data = request.get_json()
    user_id = data.get('userId')
    begin_time = data.get('beginTime')
    end_time = data.get('endTime')
    record_type = data.get('type')
    data = []
    if record_type is not None and int(record_type) == Utils.RecordType.LOGIN:
        data = Records.get_login_records(user_id, begin_time, end_time)
    return Utils.beop_response_success(data)


# 修改用户头像
@bp_admin.route('/updateAvatar', methods=['POST'])
def update_avatar():
    upload_file = request.files['file']
    user_id = request.form['userId']
    if not Utils.is_image('', upload_file.stream.read()):
        return Utils.beop_response_error(None, '1008')
    upload_file.stream.seek(0)
    result = User.update_user_avatar(user_id, upload_file)
    if result:
        return Utils.beop_response_success(result)
    else:
        return Utils.beop_response_error()


# 加载导航菜单配置页面
@bp_admin.route('/menuConfigure', methods=['POST'])
def menu_configure():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    project_id = rq_data.get('projectId')
    projects = Project.get_projects_by_user_id(user_id, 'id', 'name_en', 'name_cn', 'name_english', 'pic')
    if projects:
        if project_id is None:
            project_id = projects[0].get('id')
        mc = MenuConfigure()
        first_project_menu = mc.get_menu_model(project_id)
        return Utils.beop_response_success({'projects': projects, 'firstProjectMenu': first_project_menu})
    return Utils.beop_response_success(projects)


@bp_admin.route('/loadProjectMenu', methods=['POST'])
def load_project_menu():
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    if not project_id:
        return Utils.beop_response_error(project_id)

    mc = MenuConfigure()
    data = mc.get_menu_model(project_id)
    return Utils.beop_response_success(data)


# 保存导航菜单配置
@bp_admin.route('/menuEdit', methods=['POST'])
def menu_edit():
    request_data = request.get_json()
    menu = request_data.get('menu')
    user_id = request_data.get('userId')
    project_id = request_data.get('projectId')

    if user_id != 1 and user_id != 68:
        return Utils.beop_response_error(user_id, 1003)
    elif not menu:
        return Utils.beop_response_error(menu)
    elif menu.get('nav') is None:
        return Utils.beop_response_error(menu)
    else:
        mc = MenuConfigure()
        success, latest_data = mc.save_menu_model(project_id, menu.get('nav'))
        if success:
            return Utils.beop_response_success(latest_data, '2002')
        else:
            return Utils.beop_response_error(latest_data, '1004')


@bp_admin.route('/loadProjectPermission', methods=['POST'])
def load_project_permission():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    project_list = []

    if not user_id:
        return Utils.beop_response_error(user_id)

    users = User.get_users_flat_by_supervisor(user_id, 'id', 'username', 'userfullname', 'userpic', 'supervisor')

    current_user = {}
    users_ids = []

    for user in users:
        users_ids.append(user.get('id'))
        if str(user.get('id')) == str(user_id):
            current_user = user

    permission = ProjectPermission.get_permission(user_id, 'projectId', 'projectName', 'roleId', 'roleName', 'userId',
                                                  'userName', 'userpic')

    project_id_set = set()
    for i in permission:
        project = {}
        temp_project_id = i.get('projectId')
        if temp_project_id not in project_id_set:
            project_id_set.add(temp_project_id)
            project = {'id': temp_project_id, 'name': i.get('projectName'), 'roles': []}
            project_list.append(project)
        else:
            for project_item in project_list:
                if temp_project_id == project_item.get('id'):
                    project = project_item
                    break
        if not project:
            continue

        role_list = [role.get('id') for role in project['roles']]
        if i.get('roleId') not in role_list:
            role = {'id': i.get('roleId'), 'name': i.get('roleName'), 'users': []}
            project['roles'].append(role)
        else:
            for existed_role in project['roles']:
                if existed_role.get('id') == i.get('roleId'):
                    role = existed_role
                    break
        if role and i.get('userId') in users_ids:
            user = {'id': i.get('userId'), 'name': i.get('userName'), 'userpic': i.get('userpic')}
            role['users'].append(user)

    # 删除空的项目和角色
    # project_list[:] = [project for project in project_list if project.get('roles')]
    # for index, project in enumerate(project_list):
    # roles = project.get('roles')
    # roles[:] = [role for role in roles if role.get('users')]

    data = {
        'projectList': project_list,
        'userList': users,
        'currentUser': current_user
    }
    return Utils.beop_response_success(data)


@bp_admin.route('/deleteRoleUser', methods=['POST'])
def delete_role_user():
    rq_data = request.get_json()
    role_id = rq_data.get('roleId')
    user_id = rq_data.get('userId')
    result = ProjectPermission.delete_role_user(role_id, user_id)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_admin.route('/addRoleUser', methods=['POST'])
def add_role_user():
    rq_data = request.get_json()
    role_id = rq_data.get('roleId')
    user_id = rq_data.get('userId')
    result = ProjectPermission.insert_role_user(user_id, role_id)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_admin.route('/deleteProjectRole', methods=['POST'])
def delete_project_role():
    rq_data = request.get_json()
    role_id = rq_data.get('roleId')
    user_id = rq_data.get('userId')
    project_id = rq_data.get('projectId')
    sub_user_list = User.get_users_flat_by_supervisor(user_id, 'id')
    sub_user_id = [x.get('id') for x in sub_user_list if x.get('id')]
    user_id_in_role = UserRole.get_user_id_by_role_id(role_id)
    user_in_role_id = [x.get('userId') for x in user_id_in_role if x.get('userId')]
    for role_user in user_in_role_id:
        if role_user not in sub_user_id:
            return Utils.beop_response_error(None, '1007')
    result = ProjectPermission.delete_project_role(role_id)
    if result:
        mc = MenuConfigure()
        mc.remove_custom_nav_role_nav(project_id, role_id)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_admin.route('/addProjectRole', methods=['POST'])
def add_project_role():
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    role_name = rq_data.get('roleName')
    user_id = rq_data.get('userId')
    success, inserted = ProjectPermission.insert_project_role(project_id, role_name)
    if success:
        insert_user_role_result = ProjectPermission.insert_role_user(user_id, inserted.get('id'))
        if insert_user_role_result:
            return Utils.beop_response_success()
        else:
            return Utils.beop_response_error()
        return Utils.beop_response_success(inserted)
    else:
        return Utils.beop_response_error()


@bp_admin.route('/loadManagerAccountInfo', methods=['GET'])
def load_manager_account_info():
    return Utils.beop_response_success(User.get_all_managers('id', 'userfullname'))


@bp_admin.route('/inviteUsers', methods=['POST'])
def invite_users():
    rq_data = request.get_json()
    supervisor_id = int(rq_data.get('supervisorId'))
    if supervisor_id == 0:
        return Utils.beop_response_error(supervisor_id, '1006')
    users = rq_data.get('userInfo')
    if not users:
        return Utils.beop_response_error(users)

    inviter_id = rq_data.get('inviterId')
    if inviter_id is None:
        return Utils.beop_response_error(inviter_id)

    is_manager = int(rq_data.get('isManager'))
    init_role = rq_data.get('initRole')

    to_insert_users = [
        {'userfullname': x.get('userfullname') if x.get('userfullname') else x.get('email')[:x.get('email').find('@')],
         'username': x.get('email'),
         'useremail': x.get('email'),
         'isManager': is_manager if is_manager == 1 else 0,
         'supervisor': supervisor_id if supervisor_id else 1} for x in users]

    failed_list = {
        'registered': [],
        'apply': [],
        'invited': [],
        'token_failed': []
    }
    success_list = []

    inviter = User.query_user_by_id(inviter_id, 'useremail', 'userfullname', 'username')
    for user in to_insert_users:
        user_in_db = User.query_user_by_username(user.get('username'), 'id', 'userstatus', 'useremail', 'username',
                                                 'userfullname')
        if not user_in_db:  # 新用户
            inserted_user = User.add_user(user)
            inserted_user_id = inserted_user.get('id')
            if init_role is not None:
                UserRole.add_user_role(inserted_user_id, init_role)
            token_seed = str(inserted_user_id) + str(datetime.now())
            token = Token.add_token(inserted_user_id, token_seed, Token.TokenType.INVITE)
            if token:
                # 发送邀请邮件
                Utils.EmailTool.send_invitation_email(user.get('useremail'), token,
                                                      inviter.get('userfullname') or inviter.get('username'),
                                                      inviter.get('username'))
                inserted_user['id'] = inserted_user_id
                success_list.append(user)
            else:
                failed_list.get('token_failed').append(inserted_user)
        else:  # 用户已经在User表中存在
            user_id = user_in_db.get('id')
            if user_in_db.get('userstatus') == User.UserStatus.registered:  # 已经注册过
                failed_list.get('registered').append(user_in_db)
            elif user_in_db.get('userstatus') == User.UserStatus.apply:  # 已经申请过
                failed_list.get('apply').append(user_in_db)
            elif user_in_db.get('userstatus') == User.UserStatus.invited:  # 已经邀请过
                try:
                    is_token_expired = Token.is_token_expired(user_id, Token.TokenType.INVITE)
                except Token.TokenNotFound as e:
                    # user表有,token表没有找token,重新生成token并发邮件
                    token_seed = str(user_id) + str(datetime.now())
                    token = Token.add_token(user_id, token_seed, Token.TokenType.INVITE)
                    # 发送邀请邮件
                    Utils.EmailTool.send_invitation_email(user.get('useremail'), token,
                                                          inviter.get('userfullname') or inviter.get('username'),
                                                          inviter.get('username'))
                    success_list.append(user)
                    continue

                if is_token_expired:  # token过期,更新token,并且重发邮件
                    token_seed = str(user_id) + str(datetime.now())
                    new_token = Token.generate_token(token_seed)
                    Token.update_token({'token': new_token, 'createDate': datetime.now()},
                                       {'userId': user_id, 'type': Token.TokenType.INVITE})
                    # 发送邀请邮件
                    Utils.EmailTool.send_invitation_email(user.get('useremail'), new_token,
                                                          inviter.get('userfullname') or inviter.get('username'),
                                                          inviter.get('username'))
                    success_list.append(user)
                else:
                    failed_list.get('invited').append(user_in_db)

    return Utils.beop_response_success({'failed': failed_list, 'succeed': success_list})


# 根据项目,角色返回菜单项
@bp_admin.route('/loadPageMenu', methods=['POST'])
def load_page_menu():
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    role_id = rq_data.get('roleId')
    mc = MenuConfigure()
    menu_model = mc.get_menu_page_edit_model(project_id, role_id)
    return Utils.beop_response_success(menu_model)


@bp_admin.route('/savePageMenu', methods=['POST'])
def save_page_menu():
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    role_id = rq_data.get('roleId')
    top_nav_list = rq_data.get('topNavList')
    func_nav_list = rq_data.get('funcNavList')
    mc = MenuConfigure()
    success = mc.update_page_menu(project_id, role_id, top_nav_list, func_nav_list)
    if success:
        return Utils.beop_response_success(None, '2002')
    else:
        return Utils.beop_response_error()


@bp_admin.route('/loadUsersTree', methods=['POST'])
def load_user_tree():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    user_tree = User.get_users_tree_by_supervisor(user_id, 'username', 'userfullname', 'userpic', 'userstatus')
    return Utils.beop_response_success(user_tree)


@bp_admin.route('/loadUsersSetting', methods=['POST'])
def load_users_setting():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    current_user = rq_data.get('currentUser')
    user = User.query_user_by_id(user_id, 'id', 'username', 'userfullname', 'useremail', 'userpic', 'isManager',
                                 'supervisor')
    supervisor = User.query_user_by_id(user.get('supervisor'), 'id', 'username', 'userfullname', 'userpic')
    all_managers = User.get_all_managers_under_supervisor(current_user, 'id', 'username', 'userfullname')
    all_managers_under_user = User.get_all_managers_under_supervisor(user_id, 'id', 'username', 'userfullname')
    for manager_under_user in all_managers_under_user:
        for manager in all_managers:
            if manager_under_user.get('id') == manager.get('id'):
                manager['isSub'] = True  # 标识这个管理员是用户的下级

    ret = {
        'user': user,
        'supervisor': supervisor,
        'managers': all_managers
    }
    return Utils.beop_response_success(ret)


@bp_admin.route('/loadManagersByUserId', methods=['POST'])
def load_managers_by_user_id():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    all_managers = User.get_all_managers_under_supervisor(user_id, 'id', 'username', 'userfullname')
    return Utils.beop_response_success(all_managers)


@bp_admin.route('/updateUsersSetting', methods=['POST'])
def update_users_setting():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    new_is_manger = int(rq_data.get('isManager'))
    new_supervisor_id = int(rq_data.get('supervisor'))

    user = User.query_user_by_id(user_id, 'id', 'isManager', 'supervisor')

    if user.get('supervisor') != new_supervisor_id:
        new_supervisor = User.query_user_by_id(new_supervisor_id, 'id', 'username', 'userfullname', 'isManager')
        if int(new_supervisor.get('isManager')) != 1:  # 如果新上级没有管理权限,设置失败
            return Utils.beop_response_error(new_supervisor, '1005')
        User.update_user(user_id, 'supervisor=' + str(new_supervisor_id))

    if user.get('isManager') != new_is_manger:
        User.update_user(user_id, 'isManager=' + str(new_is_manger))
        if new_is_manger == 0:
            # 不再有管理权限,设置所有下级成员的supervisor
            users_tree = User.get_users_tree_by_supervisor(user.get('id'))
            all_sub_user = users_tree.get('sub')
            for sub_user in all_sub_user:
                User.update_user(sub_user.get('id'), 'supervisor=' + str(new_supervisor_id))

    return Utils.beop_response_success()


@bp_admin.route('/deleteUser', methods=['POST'])
def delete_user():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    current_user_id = rq_data.get('currentUserId')  # TODO 判断请求人权限,是否可以删除(是否为被删除人的上级)
    user = User.query_user_by_id(user_id, 'id', 'supervisor')
    user_supervisor = user.get('supervisor')
    # 删除前需要取得下级
    users_tree = User.get_users_tree_by_supervisor(user_id)
    all_sub_user = users_tree.get('sub')
    # 删除
    deleted_success = User.delete_user_by_id(user_id)
    if deleted_success:
        for sub_user in all_sub_user:
            User.update_user(sub_user.get('id'), 'supervisor=' + str(user_supervisor))
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_admin.route('/getProjectPermissionByUserId', methods=['POST'])
def get_project_permission_by_user_id():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    permissions = ProjectPermission.get_permission(user_id, 'projectId', 'projectName', 'roleId', 'roleName')
    result = {}
    for permission in permissions:
        if permission.get('projectId') in result:
            existed_permission = result.get(permission.get('projectId'))
            roles = existed_permission.get('roles')
            existed_role_id = [x.get('roleId') for x in roles]
            if permission.get('roleId') not in existed_role_id:
                roles.append({'roleId': permission.get('roleId'), 'roleName': permission.get('roleName')})
        else:
            new_role = {'roleId': permission.get('roleId'), 'roleName': permission.get('roleName')}
            result[permission.get('projectId')] = {'projectName': permission.get('projectName'), 'roles': [new_role]}
    return Utils.beop_response_success(result)


@bp_admin.route('/sendReportEmail', methods=['POST'])
def send_report_email():
    rq_data = request.get_json()
    report_data = rq_data.get('reportData')
    subject = rq_data.get('subject', 'RNB tech: new report email')
    recipients = rq_data.get('recipients')

    try:
        email_html = render_template('email/reportEmail.html', data=report_data)
        Utils.EmailTool.send_email(subject, recipients, email_html,
                                   sender=("BeOP数据诊断优化平台", app.config['MAIL_USERNAME']))
        return Utils.beop_response_success()
    except Exception as e:
        return Utils.beop_response_error(e)




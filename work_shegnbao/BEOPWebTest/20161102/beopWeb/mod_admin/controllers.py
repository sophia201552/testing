import socket

from flask import request

from .Project import Project
from .Records import Records
from .MenuConfigure import MenuConfigure
from .RoleProject import RoleProject
from .ProjectPermission import ProjectPermission
from .Token import Token
from .UserRole import UserRole
from beopWeb.mod_common.Utils import *
from beopWeb.mod_admin import bp_admin
from beopWeb.mod_common.Role import Role
from beopWeb.mod_admin.UserRoleGroup import UserRoleGroup
from beopWeb.mod_admin.roleGroupUser import RoleGroupUser
from beopWeb.BEOPMySqlDBContainer import *
from beopWeb.mod_admin.User import User
from beopWeb.mod_admin.BeOPPermission import BeOPPermission
from beopWeb.models import checkPassword
from beopWeb.mod_admin.FavoriteProject import FavoriteProject
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_oss.ossapi import *
import os,base64
from random import randrange


# 用户管理页面加载
@bp_admin.route('/accountManger/<user_id>', methods=['GET'])
def load_account_manager(user_id):
    user = User.query_user_by_id(user_id, 'id', 'username', 'userfullname', 'isManager', 'supervisor', 'userpic',
                                 'useremail', 'usersex')
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
    user_profile = User.query_user_by_id(user_id, 'userfullname', 'useremail', 'isManager', 'supervisor')

    # 修改用户名
    user_name = data.get('userfullname')
    if user_name:
        success = User.update_user(user_id, 'userfullname=' + user_name)
        if success:
            logging.info('用户名修改成功:old:{0},new:{1}'.format(user_profile.get('userfullname'), user_name))
        else:
            logging.error('用户名修改失败:{0}'.format(json.dumps(data, ensure_ascii=False)))

    # 修改性别
    user_sex = data.get('usersex')
    if user_sex:
        success = User.update_user(user_id, 'usersex=' + user_sex)
        if success:
            logging.info('性别修改成功:old:{0},new:{1}'.format(user_profile.get('usersex'), user_sex))
        else:
            logging.error('性别修改失败:{0}'.format(json.dumps(data, ensure_ascii=False)))

    # 修改邮箱地址
    email = data.get('email')
    if email:
        success = User.update_user(user_id, 'useremail=' + email, 'username=' + email)
        if success:
            logging.info('用户邮箱修改成功:old:{0},new:{1}'.format(user_profile.get('useremail'), email))
        else:
            logging.error('用户邮箱修改失败:{0}'.format(json.dumps(data, ensure_ascii=False)))

    # 修改管理权限标志
    is_manager = data.get('isManager')
    if is_manager is not None and (is_manager == 0 or is_manager == 1):
        success = User.update_user(user_id, 'isManager=' + is_manager)
        if success:
            logging.info('用户管理权限修改成功:old:{0},new:{1}'.format(user_profile.get('isManager'), is_manager))
        else:
            logging.error('用户管理权限修改失败:{0}'.format(json.dumps(data, ensure_ascii=False)))

    # 修改密码
    old_password = data.get('oldPassword')
    password = data.get('password')
    checkPwdCode = checkPassword(user_profile.get('userfullname'), password, old_password)
    if 0 == checkPwdCode:
        if not old_password:
            success = False
            code.append(1001)
            logging.error('用户密码修改失败:原密码输入为空')
        else:
            old_password_is_ok = User.verify_password_by_user_id(user_id, old_password)
            if old_password_is_ok:
                success = User.update_user_password(user_id, password)
                code.append(2001)
                if success:
                    logging.info('用户密码修改成功')
                else:
                    logging.error('用户密码修改失败')
            else:
                success = False
                code.append(1002)
                logging.error('用户密码修改失败:原密码错误')
    else:
        success = False
        code.append(checkPwdCode)
        logging.error('用户密码修改失败:%s' % checkPwdCode)

    # 修改邀请人
    supervisor = data.get('supervisor')
    if supervisor:
        success = User.update_user(user_id, 'supervisor=' + supervisor)
        if success:
            logging.info('用户邀请人修改成功:old:{},new:{}', format(user_profile.get('supervisor'), supervisor))
        else:
            logging.error('用户邀请人修改失败:{}'.format(json.dumps(data, ensure_ascii=False)))

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
    # record_type = data.get('type')
    data = []
    # if record_type is not None and int(record_type) == Utils.RecordType.LOGIN:
    data = Records.get_login_records(user_id, begin_time, end_time)
    return Utils.beop_response_success(data)


# 修改用户头像
@bp_admin.route('/updateAvatar', methods=['POST'])
def update_avatar():
    upload_file = request.files['file']
    user_id = request.form['userId']
    if not Utils.is_image('', upload_file.stream.read()):
        logging.error('用户头像修改失败:上传文件不是图片.userid:{0}'.format(user_id))
        return Utils.beop_response_error(None, '1008')
    upload_file.stream.seek(0)
    result = User.update_user_avatar(user_id, upload_file)
    if result:
        logging.info('用户头像修改成功,userid:{0}'.format(user_id))
        return Utils.beop_response_success(result)
    else:
        logging.error('用户头像修改失败,userid:{0}'.format(user_id))
        return Utils.beop_response_error()


# 修改用户头像,base64字符先转换成图片
@bp_admin.route('/base64ToImg', methods=['POST'])
def base64_to_img():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    strBase64 = rq_data.get('base64')
    imgData = base64.b64decode(strBase64)
    path = os.getcwd() + os.sep + 'beopWeb'+ os.sep + 'static'+ os.sep + 'images' + os.sep +'avatar'+ os.sep +'user' + os.sep
    upload_file = open(path + str(user_id) + '.jpg', 'wb')
    upload_file.write(imgData)
    upload_file.close()

    if not Utils.is_image('', imgData):
        logging.error('用户头像修改失败:上传文件不是图片.userid:{0}'.format(user_id))
        return Utils.beop_response_error(None, '1008')

    oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
    # 头像名称 userId + 随机数, 为了刷新图片
    userpic = 'static/images/avatar/user/' + str(user_id) + '_' + str(randrange(100000, 999999)) + '.jpg'
    result = oss.put_object_from_file('beopweb', userpic, path + str(user_id) + '.jpg')
    # 更新用户信息userpic字段
    success = User.update_user(user_id, 'userpic=/' + userpic)
    if success:
        logging.info('头像修改成功:' + userpic)
    else:
        logging.error('头像修改失败')

    if result and result.status == 200:
        logging.info('用户头像修改成功,userid:{0}'.format(user_id))
        return Utils.beop_response_success('/' + userpic)
    else:
        logging.error('用户头像修改失败,userid:{0}'.format(user_id))
        return Utils.beop_response_error()


# 加载导航菜单配置页面
@bp_admin.route('/menuConfigure', methods=['POST'])
def menu_configure():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    project_id = rq_data.get('projectId')
    projects = Project.get_projects_by_user_id(user_id, 'id', 'name_en', 'name_cn', 'name_english', 'pic')
    projects = [project for project in projects if project.get('id', None) is not None]
    if projects:
        if project_id is None:
            project_id = projects[0].get('id')
        mc = MenuConfigure()
        first_project_menu = mc.get_menu_model(project_id)
        return Utils.beop_response_success({'projects': projects, 'firstProjectMenu': first_project_menu})
    return Utils.beop_response_success(projects)


@bp_admin.route('/ossMenuPic', methods=['GET'])
def get_oss_menu_pic_list():
    mc = MenuConfigure()
    return Utils.beop_response_success(mc.get_oss_menu_pic_list())


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
    indexed_menu_ids = request_data.get('indexedMenuIds')

    if not menu:
        return Utils.beop_response_error(menu)
    elif menu.get('nav') is None:
        return Utils.beop_response_error(menu)
    else:
        mc = MenuConfigure()
        success, latest_data, indexed_menu_ids = mc.save_menu_model(project_id, menu.get('nav'), indexed_menu_ids)
        save_indexed_id_result = mc.save_indexed_menu_list(project_id, indexed_menu_ids)
        if success and save_indexed_id_result:
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

    permission = ProjectPermission.get_permission(user_id, 'projectId', 'projectName', 'projectName_en', 'roleId',
                                                  'roleName', 'userId', 'userName', 'userpic')
    rp = RoleProject()
    project_id_set = set()
    for i in permission:
        project = {}
        temp_project_id = i.get('projectId')
        if temp_project_id not in project_id_set:
            project_id_set.add(temp_project_id)
            project = {'id': temp_project_id, 'projectName': i.get('projectName'),
                       'projectName_en': i.get('projectName_en'), 'roles': []}
            project_list.append(project)
        else:
            for project_item in project_list:
                if temp_project_id == project_item.get('id'):
                    project = project_item
                    break
        if not project:
            continue

        role_list = [role.get('id') for role in project['roles']]
        if i.get('roleId') is not None and i.get('roleId') not in role_list:
            permission_list = rp.query_permission_by_role_id(i.get('roleId'))
            permission_item = {Role.ROLE_DASHBOARD: "", Role.ROLE_MENU: "", Role.ROLE_DEBUG_TOOLS: ""}
            for item in permission_list:
                if item.get(Role.ROLE_FUNCTION) == Role.ROLE_DASHBOARD:
                    permission_item[Role.ROLE_DASHBOARD] = Role.ROLE_DASHBOARD
                elif item.get(Role.ROLE_FUNCTION) == Role.ROLE_MENU:
                    permission_item[Role.ROLE_MENU] = Role.ROLE_MENU
                elif item.get(Role.ROLE_FUNCTION) == Role.ROLE_DEBUG_TOOLS:
                    permission_item[Role.ROLE_DEBUG_TOOLS] = Role.ROLE_DEBUG_TOOLS
            role = {'id': i.get('roleId'), 'name': i.get('roleName'), 'permission': permission_item, 'users': []}
            project['roles'].append(role)
        else:

            for existed_role in project['roles']:
                if existed_role.get('id') == i.get('roleId'):
                    role = existed_role
                    break
        if role and i.get('userId') in users_ids:
            user = {'id': i.get('userId'), 'name': i.get('userName'),
                    'userpic': Utils.IMG_SERVER_DOMAIN + i.get('userpic')}
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
        logging.info('分组中删除人员成功:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_success()
    else:
        logging.error('分组中删除人员失败:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_error()


@bp_admin.route('/addRoleUser', methods=['POST'])
def add_role_user():
    rq_data = request.get_json()
    role_id = rq_data.get('roleId')
    user_id = rq_data.get('userId')
    result = ProjectPermission.insert_role_user(user_id, role_id)
    if result:
        logging.info('添加人员到分组成功:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_success()
    else:
        logging.error('添加人员到分组失败:' + json.dumps(rq_data, ensure_ascii=False))
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
            logging.warning('删除项目分组失败:项目分组中有其他人员, 无法删除。')
            return Utils.beop_response_error(None, '1007')
    result = ProjectPermission.delete_project_role(role_id)
    if result:
        mc = MenuConfigure()
        mc.remove_custom_nav_role_nav(project_id, role_id)
        logging.info('删除项目分组成功:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_success()
    else:
        logging.error('删除项目分组失败:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_error()


@bp_admin.route('/deleteProject', methods=['POST'])
def delete_project():
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    project = Project()
    result = project.set_delete_flag_by_project_id(project_id)
    if result:
        logging.info('删除项目成功:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_success()
    else:
        logging.error('删除项目失败:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_error()


@bp_admin.route('/addProjectRole', methods=['POST'])
def add_project_role():
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    role_name = rq_data.get('roleName')
    user_id = rq_data.get('userId')
    success, inserted = ProjectPermission.insert_project_role(project_id, role_name)
    if success:
        logging.info('项目权限管理-创建项目分组成功:' + json.dumps(rq_data, ensure_ascii=False))
        insert_user_role_result = ProjectPermission.insert_role_user(user_id, inserted.get('id'))
        if insert_user_role_result:
            logging.info(
                '项目权限管理-创建项目分组成功后插入创建人成功:' + json.dumps({'user_id': user_id, 'role': inserted}, ensure_ascii=False))
            return Utils.beop_response_success()
        else:
            logging.error(
                '项目权限管理-创建项目分组成功后插入创建人失败:' + json.dumps({'user_id': user_id, 'role': inserted}, ensure_ascii=False))
            return Utils.beop_response_error()
    else:
        logging.error('项目权限管理-创建项目分组失败:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_error()


@bp_admin.route('/loadManagerAccountInfo', methods=['GET'])
def load_manager_account_info():
    return Utils.beop_response_success(User.get_all_managers('id', 'userfullname'))


@bp_admin.route('/inviteUsers', methods=['POST'])
def invite_users():
    rq_data = request.get_json()
    logging.info('邀请用户参数:' + json.dumps(rq_data, ensure_ascii=False))
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

    language = rq_data.get('language')

    inviter = User.query_user_by_id(inviter_id, 'useremail', 'userfullname', 'username')
    for user in to_insert_users:
        user_in_db = User.query_user_by_username(user.get('username'), 'id', 'userstatus', 'useremail', 'username',
                                                 'userfullname')
        if not user_in_db:  # 新用户
            inserted_user = User().add_user(user)
            inserted_user_id = inserted_user.get('id')
            if init_role is not None:
                UserRole.add_user_role(inserted_user_id, init_role)
            token_seed = str(inserted_user_id) + str(datetime.now())
            token = Token.add_token(inserted_user_id, token_seed, Token.TokenType.INVITE)
            if token:
                # 发送邀请邮件
                Utils.EmailTool.send_invitation_email(user.get('useremail'), token,
                                                      inviter.get('userfullname') or inviter.get('username'),
                                                      inviter.get('username'), language=language)

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
                except Token.TokenNotFound:
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
    logging.info('邀请用户-成功:' + json.dumps({'failed': failed_list, 'succeed': success_list}, ensure_ascii=False))
    return Utils.beop_response_success({'failed': failed_list, 'succeed': success_list})


@bp_admin.route('/reactivateUser', methods=['POST'])
def reactivate_user():
    rq_data = request.get_json()
    logging.info('重新激活用户参数:' + json.dumps(rq_data, ensure_ascii=False))
    reactivate_id = int(rq_data.get('reactivateId'))
    inviter_id = int(rq_data.get('userId'))

    if not reactivate_id or not inviter_id:
        return Utils.beop_response_error()
    reactivated_user = User.query_user_by_id(reactivate_id, 'useremail')
    inviter = User.query_user_by_id(inviter_id, 'userfullname', 'username')

    if not reactivated_user or not inviter:
        return Utils.beop_response_error()

    token_seed = str(reactivate_id) + str(datetime.now())
    old_token = Token.query_token('userid', {'userid': reactivate_id, 'type': Token.TokenType.INVITE})
    if old_token:
        new_token = Token.generate_token(token_seed)
        Token.update_token({'token': new_token, 'createDate': datetime.now()},
                           {'userId': reactivate_id, 'type': Token.TokenType.INVITE})
    else:
        new_token = Token.add_token(reactivate_id, token_seed, Token.TokenType.INVITE)

    if new_token:
        # 发送邀请邮件
        Utils.EmailTool.send_invitation_email(reactivated_user.get('useremail'), new_token,
                                              inviter.get('userfullname') or inviter.get('username'),
                                              inviter.get('username'))
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 根据项目,角色返回菜单项
@bp_admin.route('/loadPageMenu', methods=['POST'])
def load_page_menu():
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    role_id = rq_data.get('roleId')
    mc = MenuConfigure()
    menu_model = mc.get_menu_page_edit_model(project_id, role_id)
    return Utils.beop_response_success(menu_model)


# 根据项目,配置权限
@bp_admin.route('/configurePermission', methods=['POST'])
def configure_jurisdiction():
    rq_data = request.get_json()
    role_project_id = rq_data.get('role_project_id')
    permission_dashboard = rq_data.get('permission_dashboard')
    permission_menu = rq_data.get('permission_menu')
    permission_debug_tools = rq_data.get('permission_debug_tools')
    rp = RoleProject()
    if not permission_dashboard:
        rp.del_role_function(Role.ROLE_DASHBOARD, role_project_id)
    else:
        rp.insert_role_function(permission_dashboard, role_project_id)

    if not permission_menu:
        rp.del_role_function(Role.ROLE_MENU, role_project_id)
    else:
        rp.insert_role_function(permission_menu, role_project_id)

    if not permission_debug_tools:
        rp.del_role_function(Role.ROLE_DEBUG_TOOLS, role_project_id)
    else:
        rp.insert_role_function(permission_debug_tools, role_project_id)

    return Utils.beop_response_success()


@bp_admin.route('/savePageMenu', methods=['POST'])
def save_page_menu():
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    role_id = rq_data.get('roleId')
    top_nav_list = rq_data.get('topNavList')
    func_nav_list = rq_data.get('funcNavList')
    benchmark_nav_list = rq_data.get('benchmarkList')

    mc = MenuConfigure()

    hostname = socket.gethostname()
    hostip = socket.gethostbyname(hostname)
    topmenulist = '|'.join(mc.get_menu_texts_by_ids(top_nav_list))
    funcmenulist = '|'.join(mc.get_menu_texts_by_ids(func_nav_list))
    logging.info('项目权限管理-保存项目菜单配置-原菜单配置:%s' % json.dumps(mc.get_menu_page_edit_model(project_id, role_id),
                                                         ensure_ascii=False))

    success = mc.update_page_menu(project_id, role_id, top_nav_list, func_nav_list, benchmark_nav_list)
    if success:
        logging.info(
            '项目权限管理-保存项目菜单配置-成功:[projectId:%s][roleId:%s][topList:%s][funcList:%s][hostname:%s][hostip:%s]' %
            (project_id, role_id, topmenulist, funcmenulist, hostname, hostip))
        return Utils.beop_response_success(None, '2002')
    else:
        logging.error(
            '项目权限管理-保存项目菜单配置-失败:[projectId:%s][roleId:%s][topList:%s][funcList:%s][hostname:%s][hostip:%s]' % (
                project_id, role_id, topmenulist, funcmenulist, hostname, hostip))
        return Utils.beop_response_error()


@bp_admin.route('/loadUsersTree', methods=['POST'])
def load_user_tree():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    user_tree = User.get_users_tree_by_supervisor(user_id, 'username', 'userfullname', 'userpic', 'userstatus')
    if int(user_id) == 1:
        db_cursor = BEOPMySqlDBContainer()
        rv = db_cursor.op_db_query(app.config.get('DATABASE') or 'beopdoengine',
                                   'SELECT id,name,roles FROM p_role_group')
        fields = ['id', 'name', 'roles']
        user_tree["UserRoleGroupList"] = [{key: value for key, value in zip(fields, rv_item)} for rv_item in
                                          rv] if rv else []
    return Utils.beop_response_success(user_tree)


@bp_admin.route('/loadUsersSetting', methods=['POST'])
def load_users_setting():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    current_user = rq_data.get('currentUser')
    user = User.query_user_by_id(user_id, 'id', 'username', 'userfullname', 'useremail', 'userpic', 'isManager',
                                 'supervisor', 'expiryDate')
    if user.get('expiryDate'):
        user['expiryDate'] = str(user.get('expiryDate'))

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
        'managers': all_managers,
        "userRoleGroup": UserRoleGroup().get_user_role_group_id(user_id),  # 要查询人的权限组
        "currentUserRoleGroup": UserRoleGroup().get_user_role_group_id(current_user)  # 自己的权限组
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
    user_role_group_list = rq_data.get("userRoleGroupList")
    if user_role_group_list:
        rgu = RoleGroupUser()
        rv = rgu.update_user_role_group(user_id, user_role_group_list)
        if not rv:
            logging.error('更新人物userRoleGroupList失败!')
            return Utils.beop_response_error()

    new_is_manger = int(rq_data.get('isManager'))
    new_supervisor_id = int(rq_data.get('supervisor'))
    user = User.query_user_by_id(user_id, 'id', 'isManager', 'supervisor')

    logging.info('设置人员: old:{0},new:{1}'.format(user, rq_data))

    try:
        if user.get('supervisor') != new_supervisor_id:
            new_supervisor = User.query_user_by_id(new_supervisor_id, 'id', 'username', 'userfullname', 'isManager')
            if int(new_supervisor.get('isManager')) != 1:  # 如果新上级没有管理权限,设置失败
                logging.error('设置上级失败:{0} 没有管理权限'.format(new_supervisor))
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
    except Exception as e:
        logging.error('设置人员失败' + e)
        return Utils.beop_response_error()


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
        logging.info('删除用户成功:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_success()
    else:
        logging.error('删除用户失败:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_error()


@bp_admin.route('/getProjectPermissionByUserId', methods=['POST'])
def get_project_permission_by_user_id():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    permissions = ProjectPermission.get_permission(user_id, 'projectId', 'projectName', 'projectName_en', 'roleId',
                                                   'roleName')
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
            result[permission.get('projectId')] = {
                'projectName': permission.get('projectName'),
                'projectName_en': permission.get('projectName_en'),
                'roles': [new_role]}
    return Utils.beop_response_success(result)


@bp_admin.route('/setColorSetting', methods=['POST'])
def set_color_setting():
    rq_data = request.get_json()
    color_setting = rq_data.get('setting')
    user_id = rq_data.get('userId')
    user = User.query_user_by_id(user_id, 'unitproperty02')
    if user and user.get('unitproperty02'):
        try:
            user_setting = json.loads(user.get('unitproperty02'))
        except Exception as e:
            user_setting = color_setting
        user_setting.update(color_setting)
    else:
        user_setting = color_setting

    User.update_user(user_id, 'unitproperty02=' + json.dumps(user_setting))
    return Utils.beop_response_success()


@bp_admin.route('/getColorSetting', methods=['POST'])
def get_color_setting():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    heat_type = rq_data.get('heatType')
    user = User.query_user_by_id(user_id, 'unitproperty02')
    user_setting = default_setting = {
        "max": {"color": "red", "value": ""},
        "min": {"color": "blue", "value": ""}
    }
    if user and user.get('unitproperty02'):
        try:
            user_setting = json.loads(user.get('unitproperty02')).get(heat_type)
        except Exception as e:
            user_setting = default_setting

    return Utils.beop_response_success(user_setting)


@bp_admin.route('/sharedUserList/<user_id>', methods=['GET'])
def get_shared_user_list(user_id):
    if not user_id:
        return Utils.beop_response_error()

    current_user = User.query_user_by_id(user_id, 'userfullname', 'supervisor')
    supervisor = User.query_user_by_id(current_user.get('supervisor'), 'userfullname', 'useremail')

    shared_user_list = User.get_users_flat_by_supervisor(user_id, 'userfullname', 'useremail')

    result = [{'id': user.get('id'), 'userfullname': user.get('userfullname'), 'useremail': user.get('useremail')} for
              user in shared_user_list]

    if supervisor:
        result.append(supervisor)

    return Utils.beop_response_success(result)


@bp_admin.route('/setUserExpiredDate', methods=['POST'])
def set_user_expired_date():
    req = request.get_json()
    user_id = req.get('userId')
    expired_date = req.get('expiredDate')
    if not user_id:
        return Utils.beop_response_error()
    if User.update_user(user_id, 'expiryDate=' + expired_date):
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_admin.route('/getPermission', methods=['POST'])
def get_permission():
    req = request.get_json()
    user_id = req.get('userId')
    permissions = BeOPPermission().get_permissions_by_user_id(user_id)
    return Utils.beop_response_success(permissions)


@bp_admin.route("/checkPJRealityMarkValue", methods=["POST"])
def check_project_mark_value():
    req = request.get_json()
    reality_PJ_mark_value = req.get("realityPJMarkValue")
    sql = "SELECT COUNT(*) FROM dtuserver_prj WHERE dtuname= %s"
    rv = BEOPMySqlDBContainer().op_db_query(app.config.get("DATABASE", "beopdoengine"), sql, (reality_PJ_mark_value,))

    return Utils.beop_response_success({"isReality": True if rv[0][0] else False})


@bp_admin.route("/setFavoriteProject", methods=["POST"])
def set_favorite_project():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()
    fp = FavoriteProject(user_id)
    req = request.get_json()
    project_id = req.get('projectId')
    fp.set_favorite_project(project_id)
    return Utils.beop_response_success()


@bp_admin.route("/removeFavoriteProject", methods=["POST"])
def remove_favorite_project():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()
    fp = FavoriteProject(user_id)
    fp.delete_favorite_project()
    return Utils.beop_response_success()


@bp_admin.route('/select/searchUseId', methods=['POST'])
def search_userId_by_email():
    data = request.get_json()
    if not data:
        return Utils.beop_response_error(data, '10001')
    user_email = data.get('userEmail')
    user = User()
    if user_email:
        user = user.get_userId_by_email(user_email)
    return Utils.beop_response_success(user)


@bp_admin.route('/memberSelected/', methods=['POST'])
def admin_get_user_list():
    # 人员选择 可以通过userId查找上级下属,
    # 通过userList 查找列表中Id的人员
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()

    req = request.get_json()
    user_id = req.get('userId', None)
    user_list = req.get('userList', [])
    result = []
    user = User()

    if user_id:
        current_user = user.query_user_by_id(user_id, 'supervisor')
        if current_user:
            supervisor_id = current_user.get('supervisor')
            if str(supervisor_id) == '0':
                # 如果是admin显示所有的人员
                supervisor_id = 1

            fields = ['id', 'userfullname', 'userpic', 'useremail']

            result += user.get_users_flat_by_supervisor(supervisor_id, *fields)

    if user_list:
        result += user.get_user_list_info(user_list)

    ret = []
    for item in result:
        user_item = {'id': item.get('id'), 'userfullname': item.get('userfullname'),
                     'userpic': item.get('userpic'), 'useremail': item.get("useremail")}
        if user_item not in ret and user_item:
            ret.append(user_item)

    return Utils.beop_response_success(ret)

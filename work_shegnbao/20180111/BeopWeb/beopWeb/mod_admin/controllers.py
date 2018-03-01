﻿from random import randrange

from flask import request
from flask import jsonify
from werkzeug.security import generate_password_hash

from beopWeb.AuthManager import AuthManager
from beopWeb.mod_admin import bp_admin
from beopWeb.mod_admin.BeOPPermission import BeOPPermission
from beopWeb.mod_admin.FavoriteProject import FavoriteProject
from beopWeb.mod_admin.SendMessage import SendMessage
from beopWeb.mod_admin.User import User
from beopWeb.mod_admin.UserRoleGroup import UserRoleGroup
from beopWeb.mod_admin.roleGroupUser import RoleGroupUser
from beopWeb.mod_common.Captcha import gen_captcha
from beopWeb.mod_common.Constants import Constants
from beopWeb.mod_common.Utils import *
from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject
from beopWeb.mod_memcache.RedisManager import RedisManager
from beopWeb.mod_oss.ossapi import *
from beopWeb.models import checkPassword
from .MenuConfigure import MenuConfigure
from .Project import Project
from .ProjectPermission import ProjectPermission
from .Records import Records
from .Token import Token
from .UserRole import UserRole
from .Management import Management
from .ProjectI18n import *
from beopWeb.mod_admin.OperationLog import OperationLog
from beopWeb.mod_admin.OperationLogType import OperationLogType
from beopWeb.MongoConnManager import *


# 用户管理页面加载
@bp_admin.route('/accountManger/<user_id>', methods=['GET'])
def load_account_manager(user_id):
    user = User.query_user_by_id(user_id, 'id', 'username', 'userfullname', 'isManager', 'supervisor', 'userpic',
                                 'useremail', 'usersex', 'company', 'country')
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
    """
    修改用户信息接口
    :return:
    """
    data = request.get_json()
    if not data:
        return Utils.beop_response_error(data, '10001')

    user_id = data.get('id')
    if not user_id:
        return Utils.beop_response_error(id, '10001')

    success = False
    code = []
    user_profile = User.query_user_by_id(user_id, 'userfullname', 'useremail', 'isManager', 'supervisor',
                                         'usersex', 'company', 'country')

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
    if old_password and password:
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

    # 修改公司
    company = data.get('company','')
    success = User.update_user(user_id, 'company=' + company)
    if success:
        logging.info('公司修改成功:old:{0},new:{1}'.format(user_profile.get('company'), company))
    else:
        logging.error('公司修改失败:{0}'.format(json.dumps(data, ensure_ascii=False)))

    # 修改国家
    country = data.get('country')
    if country:
        success = User.update_user(user_id, 'country=' + country.upper())
        if success:
            logging.info('国家修改成功:old:{0},new:{1}'.format(user_profile.get('country'), company.upper()))
        else:
            logging.error('国家修改失败:{0}'.format(json.dumps(data, ensure_ascii=False)))

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
    data = Records.get_login_records(user_id, begin_time, end_time)
    return Utils.beop_response_success(data)


# 修改用户头像
@bp_admin.route('/updateAvatar', methods=['POST'])
def update_avatar():
    upload_file = request.files['file']
    user_id = request.form['userId']
    return do_update_avatar(upload_file, user_id)


def do_update_avatar(upload_file, user_id):
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
    path = os.getcwd() + os.sep + 'beopWeb' + os.sep + 'static' + os.sep + 'images' + \
           os.sep + 'avatar' + os.sep + 'user' + os.sep
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
    """
    加载项目及分组信息
    :return:
    """
    rq_data = request.get_json()
    data = do_load_project_permission(rq_data)
    return Utils.beop_response_success(data)

def do_load_project_permission(rq_data):
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
            role = {'id': i.get('roleId'), 'name': i.get('roleName'), 'users': []}
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
    return data


@bp_admin.route('/deleteRoleUser', methods=['POST'])
def delete_role_user():
    """
    从分组中删除用户
    """
    rq_data = request.get_json()
    result=do_delete_role_user(rq_data)
    if result:
        logging.info('分组中删除人员成功:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_success()
    else:
        logging.error('分组中删除人员失败:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_error()

def do_delete_role_user(rq_data):
    role_id = rq_data.get('roleId')
    user_id = rq_data.get('userId')
    result = ProjectPermission.delete_role_user(role_id, user_id)
    return result

@bp_admin.route('/addRoleUser', methods=['POST'])
def add_role_user():
    """
    添加用户到分组
    """
    rq_data = request.get_json()
    result=do_add_role_user(rq_data)
    if result:
        logging.info('添加人员到分组成功:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_success()
    else:
        logging.error('添加人员到分组失败:' + json.dumps(rq_data, ensure_ascii=False))
        return Utils.beop_response_error()

def do_add_role_user(rq_data):
    role_id = rq_data.get('roleId')
    user_id = rq_data.get('userId')
    assignBy = AuthManager.get_userId()
    assignTime = datetime.now()
    result = ProjectPermission.insert_role_user(user_id, role_id, assignBy, assignTime)
    return result


@bp_admin.route('/userProjRecords/', methods=['POST'])
def userProjects():
    """
    加载用户分组授权记录
    :return:
    """
    rq_data = request.get_json()
    return do_userProjRecords(rq_data)

def do_userProjRecords(rq_data):
    user_id = rq_data.get('userId')
    result = ProjectPermission.userProjRecords(user_id, "projectId", "projectName", "group", "assignBy", "assignTime")
    if result:
        return Utils.beop_response_success(result)
    else:
        return Utils.beop_response_error(result)


@bp_admin.route('/deleteProjectRole', methods=['POST'])
def delete_project_role():
    """
    删除项目的用户分组
    """
    rq_data = request.get_json()
    return do_delete_project_role(rq_data)

def do_delete_project_role(rq_data):
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
    """
    删除项目
    """
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
    """
    添加项目的分组
    """
    rq_data = request.get_json()
    return do_add_project_role(rq_data)


def do_add_project_role(rq_data):
    project_id = rq_data.get('projectId')
    role_name = rq_data.get('roleName')
    user_id = rq_data.get('userId')
    success, inserted = ProjectPermission.insert_project_role(project_id, role_name)
    if success:
        logging.info('项目权限管理-创建项目分组成功:' + json.dumps(rq_data, ensure_ascii=False))
        insert_user_role_result = ProjectPermission.insert_role_user(user_id, inserted.get('id'), user_id)
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


@bp_admin.route('/inviteUserWithPwd', methods=['POST'])
def invite_users_with_pwd():
    """
    Requirement: http://192.168.1.208:8888/redmine/issues/367
    Request
        Content-Type: application/json
        Post Data: {
            'error': 'success' 成功，失败返回错误信息
            'inviterId': 提交该请求的用户，
            'supervisorId':邀请人（受邀人的上级），
            'userInfo':[{
                    'userfullname':用户名，
                    'username': 登录名，
                    'email': 邮箱,
                    'password': 密码,
                    'management': 集团用户code，
                    'usermobile': 手机号
                    'company': 公司
                    'country': 国家
                }]
            'isManager':是否有管理权限，1有0无
            'initRole'：初始分组，
            'language': 发送邮件的语言
        }
        Return: {
            "failed": [
                {
                    "useremail": "1006082777@qq.com",
                    "userfullname": "may_full",
                    "username": "may",
                    "password": "666",
                    "usermobile": "15598989898",
                    "error" : 1
                }
            ],
            "succeedCount": 5
        }
        failed error code :
            1: 用户名已经注册过
            2：用户名已经申请过
            3: 用户名已经邀请过
            4：用户名已经过期
            5：邮箱已经存在
            6：电话已经存在
            7：新用户存入数据库失败
            8：新用户加入项目权限失败
    """
    # 邀请失败的用户列表
    failed_list = []
    # 邀请成功的用户列表
    success_list = []
    try:
        rq_data = request.get_json()
        logging.info('邀请用户参数：' + json.dumps(rq_data, ensure_ascii=False))
        supervisor_id = int(rq_data.get('supervisorId'))
        if supervisor_id == 0:
            raise Exception('supervisor 为0不存在')
        users = rq_data.get('userInfo')
        if not users:
            raise Exception('缺少userInfo')
        inviter_id = rq_data.get('inviterId')
        if inviter_id is None:
            raise Exception('缺少inviterId')
        # 是否具有管理权限
        is_manager = int(rq_data.get('isManager'))
        # 初始分组
        init_role = rq_data.get('initRole')
        to_insert_users = []
        for x in users:
            if not x.get('userfullname') or not x.get('username') or not x.get('password'):
                raise Exception('缺少userfullname或username或password')
            to_insert_users.append({'userfullname': x.get('userfullname'),
                                    'username': x.get('username'),
                                    'useremail': x.get('email', ''),
                                    'isManager': is_manager if is_manager == 1 else 0,
                                    'supervisor': supervisor_id if supervisor_id else 1,
                                    'management': int(x.get('management')) if x.get('management') else 0,
                                    'unitproperty01': generate_password_hash(x.get('password')),
                                    'usercreatedt': datetime.now().strftime('%Y-%m-%d'),
                                    'usermobile': x.get('usermobile', ''),
                                    'password': x.get('password'),
                                    'company': x.get('company'),
                                    'country': x.get('country').upper() if x.get('country') else None
                                    })
        # 发送邮件的语言
        language = rq_data.get('language')
        if not language:
            raise Exception('languge not provided!')
        inviter = User.query_user_by_id(inviter_id, 'useremail')
        for index, user in enumerate(to_insert_users):
            username_in_db = User.query_user_by_username(
                user.get('username'), 'id', 'userstatus', 'useremail', 'username', 'userfullname')
            useremail_in_db = None
            if user.get('useremail'):
                useremail_in_db = User.query_user_by_email(
                    user.get('useremail'), 'id', 'userstatus', 'useremail', 'username', 'userfullname')
            usermobile_in_db = None
            if user.get('usermobile'):
                usermobile_in_db = User.query_user_by_mobile(
                    user.get('usermobile'), 'id', 'userstatus', 'useremail', 'username', 'userfullname')

            if not username_in_db and not useremail_in_db and not usermobile_in_db:  # 新用户,添加到user表
                inserted_user = User().add_user(user, user_status='registered')
                if not inserted_user:
                    failed_list.append({
                        "useremail": user.get('useremail'),
                        "userfullname": user.get('userfullname'),
                        "username": user.get('username'),
                        "password": user.get('password'),
                        "usermobile": user.get('usermobile'),
                        "error": 7
                    })
                inserted_user_id = inserted_user.get('id')
                if init_role is not None:
                    if not UserRole.add_user_role(inserted_user_id, init_role):
                        failed_list.append({
                            "useremail": user.get('useremail'),
                            "userfullname": user.get('userfullname'),
                            "username": user.get('username'),
                            "password": user.get('password'),
                            "usermobile": user.get('usermobile'),
                            "error": 8
                        })
                    success_list.append(user)
                    # 发送带有用户名密码的文件
                    if user.get('useremail'):
                        Utils.EmailTool.send_invitation_email_with_pwd(
                            user.get('password'), user.get('username'), user.get('userfullname'),
                            user.get('useremail'), inviter.get('useremail'), user.get('management'),
                            language, user.get('country'))
                    MongoConnManager.getConfigConn().setUserConfig(inserted_user_id, {"language": language})

            else:  # 用户已经在用户表存在
                error = ''
                if username_in_db:
                    error = 'username & existed'
                    if username_in_db.get('userstatus') == User.UserStatus.registered:  # 已经注册过
                        error = 1
                    elif username_in_db.get('userstatus') == User.UserStatus.apply:  # 已经申请过
                        error = 2
                    elif username_in_db.get('userstatus') == User.UserStatus.invited:  # 已经邀请过
                        error = 3
                    elif username_in_db.get('userstatus') == User.UserStatus.expired:  # 已经或过期
                        error = 4
                if useremail_in_db:
                    error = 5
                if usermobile_in_db:
                    error = 6
                failed_list.append({
                    "useremail": user.get('useremail'),
                    "userfullname": user.get('userfullname'),
                    "username": user.get('username'),
                    "password": user.get('password'),
                    "usermobile": user.get('usermobile'),
                    "error": error
                })
        logging.info('邀请用户-成功:' + json.dumps({'failed': failed_list, 'succeed': success_list}, ensure_ascii=False))
        response = jsonify({'error': 'success', 'failed': failed_list, 'succeedCount': len(success_list)})
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        response = jsonify({"error": e.__str__(), 'failed': failed_list, 'succeedCount': len(success_list)})
    return response


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
    # 是否具有管理权限
    is_manager = int(rq_data.get('isManager'))
    # 初始分组
    init_role = rq_data.get('initRole')

    to_insert_users = []
    for x in users:
        userfullname = x.get('userfullname') if x.get('userfullname') else x.get('email')[:x.get('email').find('@')]
        to_insert_users.append({'userfullname': userfullname,
                                'username': x.get('email'), 'useremail': x.get('email'),
                                'isManager': is_manager if is_manager == 1 else 0,
                                'supervisor': supervisor_id if supervisor_id else 1,
                                'management': int(x.get('management')) if x.get('management') else 0})
        if rq_data.get('isSpecial'):
            to_insert_users[-1].update({'unitproperty01': generate_password_hash(x.get('password')),
                                        'userpwd': 'pleaseguess'})
    # 邀请失败的用户列表
    failed_list = {
        'registered': [],
        'apply': [],
        'invited': [],
        'token_failed': []
    }
    # 邀请成功的用户列表
    success_list = []

    # 邀请邮件的语言
    language = rq_data.get('language')
    if not language:
        raise Exception('language not provided!')

    inviter = User.query_user_by_id(inviter_id, 'useremail', 'userfullname', 'username')
    for index, user in enumerate(to_insert_users):
        user_in_db = User.query_user_by_username(
            user.get('username'), 'id', 'userstatus', 'useremail', 'username', 'userfullname')
        if not user_in_db:  # 新用户
            if rq_data.get('isSpecial'):
                # 如果是特殊用户，则直接添加，不发邮件
                inserted_user = User().add_user(user, user_status='registered')
                inserted_user_id = inserted_user.get('id')
                if init_role is not None:
                    UserRole.add_user_role(inserted_user_id, init_role)
                success_list.append(user)
            else:
                inserted_user = User().add_user(user)
                inserted_user_id = inserted_user.get('id')
                if init_role is not None:
                    UserRole.add_user_role(inserted_user_id, init_role)
                token_seed = str(inserted_user_id) + str(datetime.now())
                token = Token.add_token(inserted_user_id, token_seed, Token.TokenType.INVITE, language,
                                        user.get('management'))
                if token:
                    # 发送邀请邮件
                    Utils.EmailTool.send_invitation_email(
                        user.get('useremail'), token, inviter.get('useremail'), user.get('management'),
                        language=language)

                    success_list.append(user)
                else:
                    failed_list.get('token_failed').append(inserted_user)
        else:  # 用户已经在User表中存在
            user_id = user_in_db.get('id')
            if user_in_db.get('userstatus') == User.UserStatus.registered:  # 已经注册过
                failed_list.get('registered').append(user_in_db)
            elif user_in_db.get('userstatus') == User.UserStatus.apply:  # 已经申请过
                failed_list.get('apply').append(user_in_db)
            elif user_in_db.get('userstatus') == User.UserStatus.invited or user_in_db.get(
                    'userstatus') == User.UserStatus.expired:  # 已经邀请过或过期
                try:
                    is_token_expired = Token.is_token_expired(user_id, Token.TokenType.INVITE)
                except Token.TokenNotFound:
                    # user表有,token表没有找token,重新生成token并发邮件
                    token_seed = str(user_id) + str(datetime.now())
                    token = Token.add_token(user_id, token_seed, Token.TokenType.INVITE,language,user.get('management'))
                    # 发送邀请邮件
                    Utils.EmailTool.send_invitation_email(user.get('useremail'), token, inviter.get('useremail'),
                                                          user.get('management'), language=language)
                    success_list.append(user)
                    continue

                if is_token_expired:  # token过期,更新token,并且重发邮件
                    token_seed = str(user_id) + str(datetime.now())
                    new_token = Token.generate_token(token_seed)
                    Token.update_token({'token': new_token, 'createDate': datetime.now()},
                                       {'userId': user_id, 'type': Token.TokenType.INVITE})
                    # 发送邀请邮件
                    Utils.EmailTool.send_invitation_email(user.get('useremail'), new_token, inviter.get('useremail'),
                                                          user.get('management'), language=language)
                    success_list.append(user)
                else:
                    failed_list.get('invited').append(user_in_db)
    logging.info('邀请用户-成功:' + json.dumps({'failed': failed_list, 'succeed': success_list}, ensure_ascii=False))
    return Utils.beop_response_success({'failed': failed_list, 'succeed': success_list})


@bp_admin.route('/reactivateUser', methods=['POST'])
def reactivate_user():
    """
    重新激活用户
    """
    rq_data = request.get_json()
    logging.info('重新激活用户参数:' + json.dumps(rq_data, ensure_ascii=False))
    reactivate_id = int(rq_data.get('reactivateId'))
    inviter_id = int(rq_data.get('userId'))

    # 邮件的语言
    language = rq_data.get('language')
    if not language:
        raise Exception('language not provided!')

    management = 0
    if not reactivate_id or not inviter_id:
        return Utils.beop_response_error()
    reactivated_user = User.query_user_by_id(reactivate_id, 'useremail', 'username', 'userfullname', 'country')
    inviter = User.query_user_by_id(inviter_id, 'userfullname', 'username', 'useremail', 'country')

    if not reactivated_user or not inviter:
        return Utils.beop_response_error()

    User.update_user_password(reactivate_id, "DH7wbQkK4C")
    # 发送带有用户名密码的文件
    if reactivated_user.get('useremail'):
        Utils.EmailTool.send_invitation_email_with_pwd(
            "DH7wbQkK4C", reactivated_user.get('username'),
            reactivated_user.get('userfullname'), reactivated_user.get('useremail'),
            inviter.get('useremail'), management, language, reactivated_user.get('country'))
        User.update_user(reactivate_id, 'userstatus=' + str('registered'))
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


@bp_admin.route('/savePageMenu', methods=['POST'])
def save_page_menu():
    """
    保存项目菜单
    """
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
    """
    加载用户列表
    """
    rq_data = request.get_json()
    user_tree = do_load_user_tree(rq_data)
    return Utils.beop_response_success(user_tree)


def do_load_user_tree(rq_data):
    user_id = rq_data.get('userId')
    user_tree = User.get_users_tree_by_supervisor(user_id, 'username', 'userfullname', 'userpic', 'userstatus')
    if int(user_id) == 1:
        db_cursor = BEOPMySqlDBContainer()
        rv = db_cursor.op_db_query(app.config.get('DATABASE') or 'beopdoengine',
                                   'SELECT id,name,roles FROM p_role_group')
        fields = ['id', 'name', 'roles']
        user_tree["UserRoleGroupList"] = [{key: value for key, value in zip(fields, rv_item)} for rv_item in
                                          rv] if rv else []
    return user_tree


@bp_admin.route('/loadUsersSetting', methods=['POST'])
def load_users_setting():
    """
    加载用户配置
    """
    rq_data = request.get_json()
    ret = do_load_users_setting(rq_data)
    return Utils.beop_response_success(ret)


def do_load_users_setting(rq_data):
    user_id = rq_data.get('userId')
    current_user = rq_data.get('currentUser')
    user = User.query_user_by_id(user_id, 'id', 'username', 'userfullname', 'useremail', 'userpic', 'isManager',
                                 'supervisor', 'expiryDate', 'company', 'country')
    if user.get('expiryDate'):
        user['expiryDate'] = str(user.get('expiryDate'))

    supervisor = User.query_user_by_id(user.get('supervisor'), 'id', 'username', 'userfullname', 'userpic')
    all_managers = User.get_all_managers_under_supervisor(current_user, 'id', 'username', 'userfullname')
    all_managers_under_user = User.get_all_managers_under_supervisor(user_id, 'id', 'username', 'userfullname')
    for manager_under_user in all_managers_under_user:
        for manager in all_managers:
            if manager_under_user.get('id') == manager.get('id'):
                manager['isSub'] = True  # 标识这个管理员是用户的下级
    rt = {
        'user': user,
        'supervisor': supervisor,
        'managers': all_managers,
        "userRoleGroup": UserRoleGroup.get_user_role_group_id(user_id),  # 要查询人的权限组
        "currentUserRoleGroup": UserRoleGroup.get_user_role_group_id(current_user)  # 自己的权限组
    }
    return rt


@bp_admin.route('/loadManagersByUserId', methods=['POST'])
def load_managers_by_user_id():
    rq_data = request.get_json()
    all_managers = do_load_managers_by_user_id(rq_data)
    return Utils.beop_response_success(all_managers)


def do_load_managers_by_user_id(rq_data):
    user_id = rq_data.get('userId')
    all_managers = User.get_all_managers_under_supervisor(user_id, 'id', 'username', 'userfullname')
    return all_managers


@bp_admin.route('/updateUsersSetting', methods=['POST'])
def update_users_setting():
    """
    更新用户配置
    """
    rq_data = request.get_json()
    return do_update_users_setting(rq_data)


def do_update_users_setting(rq_data):
    user_id = rq_data.get('userId')
    # 用户角色组
    user_role_group_list = rq_data.get("userRoleGroupList")
    if user_role_group_list:
        rgu = RoleGroupUser()
        old_roles = []
        old_roles_result = rgu.get_role_group_by_user_id(user_id)
        if old_roles_result:
            old_roles = [str(item.get('roleGroupId')) for item in old_roles_result]
        # 设置新用户权限
        rv = rgu.update_user_role_group(user_id, user_role_group_list)

        OperationLog.info('old:{0},new:{1},userId:{2}'.format(old_roles, user_role_group_list, user_id),
                          OperationLogType.UPDATE_USER_PERMISSION,
                          AuthManager.get_userId())
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
        if rq_data.get('country'):
            User.update_user(user_id, 'country=' + rq_data.get('country').upper())
        return Utils.beop_response_success()
    except Exception as e:
        logging.error('设置人员失败' + str(e))
        return Utils.beop_response_error()


@bp_admin.route('/deleteUser', methods=['POST'])
def delete_user():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    # noinspection PyUnusedLocal
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
    result = do_get_project_permission_by_user_id(rq_data)
    return Utils.beop_response_success(result)


def do_get_project_permission_by_user_id(rq_data):
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
    return result


@bp_admin.route('/isRcsAdmin/<user_id>', methods=['GET'])
def is_rcs_admin(user_id):
    if not user_id:
        return Utils.beop_response_error()
    try:
        rgu = RoleGroupUser()
        rcs_role_id = '23'
        role_list = rgu.get_role_group_by_user_id(user_id)
        roles = [str(item.get('roleGroupId')) for item in role_list]
        if roles:
            if rcs_role_id in roles:
                rt = 1
            else:
                rt = 0
        else:
            rt = 0
    except Exception as e:
        print('get isRcsAdmin error:' + e.__str__())
        return Utils.beop_response_error(msg='get isRcsAdmin error:' + e.__str__())
    return Utils.beop_response_success(rt)


@bp_admin.route('/setColorSetting', methods=['POST'])
def set_color_setting():
    rq_data = request.get_json()
    color_setting = rq_data.get('setting')
    user_id = rq_data.get('userId')
    user = User.query_user_by_id(user_id, 'unitproperty02')
    if user and user.get('unitproperty02'):
        try:
            user_setting = json.loads(user.get('unitproperty02'))
        except Exception:
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
    user_setting = default_setting = None
    if user and user.get('unitproperty02'):
        try:
            user_setting = json.loads(user.get('unitproperty02')).get(heat_type)
            if 'isGradient' in user_setting:
                user_setting = user_setting
            else:
                user_setting = default_setting
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
    return do_getPermission(req)

def do_getPermission(req):
    user_id = req.get('userId')
    permissions = BeOPPermission.get_permissions_by_user_id(user_id)
    return Utils.beop_response_success(permissions)


@bp_admin.route("/checkDbName", methods=["POST"])
def check_project_mark_value():
    req = request.get_json()
    return do_checkDbName(req)

def do_checkDbName(req):
    db_name = req.get("dbName")

    if not db_name:
        return Utils.beop_response_error('dbName is empty')

    db_name = db_name.strip()

    dtu = DtuServerProject().get_by_db_name(db_name)
    rv = {
        'valid': True,
        'realTimeDS': '',
        'historyDS': ''
    }

    if not dtu:  # 非法的dtu名
        rv['valid'] = False
        return Utils.beop_response_success(rv)

    rv['realTimeDS'] = Constants.REAL_TIME_DB_PREFIX + dtu.get('dbname')
    rv['historyDS'] = dtu.get('dbname')

    return Utils.beop_response_success(rv)


@bp_admin.route("/checkRealTimeDb", methods=["POST"])
def check_real_time_db():
    """
    检查实时库是否被项目占用
    :return: 使用了该实时库的项目列表
    """
    req = request.get_json()
    return do_checkRealTimeDb(req)

def do_checkRealTimeDb(req):
    real_time_db = req.get("realTimeDb")
    if not real_time_db or real_time_db == '':
        return Utils.beop_response_error('realTimeDb不能为空.')
    p = Project()
    if not real_time_db.startswith('beopdata_'):
        real_time_db = 'beopdata_' + real_time_db
    return Utils.beop_response_success(p.get_project_by_db_name(real_time_db))


@bp_admin.route("/setFavoriteProject", methods=["POST"])
def set_favorite_project():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()
    req = request.get_json()
    do_set_favorite_project(user_id, req)
    return Utils.beop_response_success()

def do_set_favorite_project(user_id,req):
    fp = FavoriteProject(user_id)
    project_id = req.get('projectId')
    fp.set_favorite_project(project_id)


@bp_admin.route("/removeFavoriteProject", methods=["POST"])
def remove_favorite_project():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()
    do_remove_favorite_project(user_id)
    return Utils.beop_response_success()

def do_remove_favorite_project(user_id):
    fp = FavoriteProject(user_id)
    fp.delete_favorite_project()



@bp_admin.route('/select/searchUseId', methods=['POST'])
def search_userId_by_email():
    data = request.get_json()
    return do_search_userId_by_email(data)

def do_search_userId_by_email(data):
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

    ret=do_admin_get_user_list(req)
    return Utils.beop_response_success(ret)


def do_admin_get_user_list(req):
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
    return ret


@bp_admin.route('/verifyCode', methods=['POST'])
def v_gen_verify_code():
    """
    获取注册验证码
    如果注册帐号为手机, 则发送手机验证码;
    如果注册帐号为邮箱, 则发送邮箱验证码
    :return:
    """
    req = request.get_json()
    return do_v_gen_verify_code(req)


def do_v_gen_verify_code(req):
    account = req.get('account', None)
    code_key = 'new@' + str(account)

    if Utils.is_email(account):  # 如果注册帐号是邮件, 发送邮件验证码
        if User.query_user_by_username(account, 'id'):
            return Utils.beop_response_error(msg='EMAIL_IS_USED')
        code = Utils.get_random_num(6)
        RedisManager.set(code_key, code)
        RedisManager.expirekey(code_key, 3 * 60)
        subject = 'BeOP verify code'
        email_html = render_template(
            'email/verifyCode.html',
            configMap={'subject': subject, 'verifyCode': code, 'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')})
        Utils.EmailTool.send_email(subject, html=email_html, recipients=[account], trackingId='VerifyCode')
    elif Utils.is_phone(account):  # 如果注册帐号是手机号码,发送手机验证码
        if SendMessage.check_phonenum_is_used(account):
            SendMessage.set_verify_message(code_key)
        else:  # 手机帐号已经被注册
            return Utils.beop_response_error(msg='PHONE_NUM_IS_USED')
    else:
        return Utils.beop_response_error(msg='NOT_SUPPORT_THIS_ACCOUNT')

    return Utils.beop_response_success()

@bp_admin.route('/getManagementList', methods=['GET'])
@bp_admin.route('/getManagementList/<noProject>', methods=['GET'])
def get_management_list(noProject=0):
    try:
        user_id = AuthManager.get_userId()
        rt=do_get_management_list(user_id)
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return Utils.beop_response_error(msg='get management list error:' + e.__str__())
    return Utils.beop_response_success(rt)


def do_get_management_list(user_id):
    projects = Project.get_projects_by_user_id(user_id, 'id', 'name_en', 'name_cn', 'name_english', 'pic', 'management','latlng')
    rt = Management.get_management_list(user_id, projects)
    return rt


@bp_admin.route('/createManagement', methods=['POST'])
def create_management():
    data = request.get_json()
    return do_create_management(data)

def do_create_management(data):
    try :
        rt = Management.create_management(data)
    except Exception as e:
        print('create management error:' + e.__str__())
        return Utils.beop_response_error(msg='create management error:' + e.__str__())
    if rt> 0 :
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg='create management error:no management id get')


@bp_admin.route('/getManagement/<id>', methods=['GET'])
def get_management(id):
    try:
        rt = Management.get_management_detail(id)
    except Exception as e:
        print('get management detail error:' + e.__str__())
        return Utils.beop_response_error(msg='get management detail error:' + e.__str__())
    return Utils.beop_response_success(rt)


@bp_admin.route('/updateManagement', methods=['POST'])
def update_management():
    data = request.get_json()
    return do_update_management(data)

def do_update_management(data):
    try:
        rt = Management.update_management(data)
    except Exception as e:
        print('update management error:' + e.__str__())
        return Utils.beop_response_error(msg='update management error:' + e.__str__())
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg='update management error:update fail')


@bp_admin.route('/bindManagement/<id>', methods=['POST'])
def bind_management(id = 0):
    data = request.get_json()
    return do_bind_management(id,data)


def do_bind_management(id, data):
    try:
        rt = Management.bind_management(int(id), data)
    except Exception as e:
        print('update management error:' + e.__str__())
        return Utils.beop_response_error(msg='bind management error:' + e.__str__())
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg='bind management error:update fail')


@bp_admin.route('/unbindManagement', methods=['POST'])
def unbind_management():
    data = request.get_json()
    return do_unbind_management(data)


def do_unbind_management(data):
    try:
        rt = Management.unbind_management(data)
    except Exception as e:
        print('update management error:' + e.__str__())
        return Utils.beop_response_error(msg='unbind management error:' + e.__str__())
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg='unbind management error:update fail')


@bp_admin.route('/management/file/upload', methods=['POST'])
def upload_management_file():
    file_list = request.files.getlist("file")
    name=request.form['name']
    return do_upload_management_file(file_list,name)



def upload_to_oss(file_name, stream):
    oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
    file_path = 'custom/management/' + file_name
    return oss.put_object_from_fp('beopweb', file_path, stream), file_path

def do_upload_management_file(file_list,name):
    rv = []
    time = datetime.now()
    fileNotAllowType = ['png', 'jpeg', 'jpg']
    fileAllowType = ['png']
    for index, stream in enumerate(file_list):
        try:
            filename = name or stream.filename.rsplit("/")[0]
            if not (filename.split('.')[-1] in fileAllowType):
                return Utils.beop_response_error('file type is ' + filename.split('.')[-1] + ' not allow !')

            res, file_path = upload_to_oss(filename, stream)
            if res.status == 200:
                pass
            else:
                logging.error("上传文件失败，request status isn\'t 200")
                return Utils.beop_response_error('upload to aly oss failed, request status isn\'t 200 ! ')
        except Exception as e:
            logging.error("上传文件失败:" + str(e))
            return Utils.beop_response_error('upload to aly oss catch error!')
    return Utils.beop_response_success(rv)

# 删除一个附件
@bp_admin.route('/management/file/delete', methods=['POST'])
def delete_management_file():
    rq_data = request.get_json()
    return do_delete_management_file(rq_data)

def do_delete_management_file(rq_data):
    file_name = rq_data.get('fileName')
    file_full_name = file_name
    if not file_name:
        return Utils.beop_response_error(code=403)
    res = delete_file_oss(file_full_name)
    if res.status == 204:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error('at delete files from oss failed')


# 删除一个附件
@bp_admin.route('/delManagement', methods=['POST'])
def delete_management():
    data = request.get_json()
    return do_delete_management(data)

def do_delete_management(data):
    try:
        rt = Management.del_management(data)

        id_list = data
        if not (isinstance(id_list, list) and len(id_list) > 0):
            raise Exception('no project id get')
        for i in id_list:
            file_full_name = str(i) + '_logo.png'
            res = delete_file_oss(file_full_name)
    except Exception as e:
        print('delete management error:' + e.__str__())
        return Utils.beop_response_error(msg='delete management error:' + e.__str__())
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg='delete management error:delete fail')

def delete_file_oss(file_name):
    oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
    return oss.delete_object('beopweb', 'custom/management/' + file_name)

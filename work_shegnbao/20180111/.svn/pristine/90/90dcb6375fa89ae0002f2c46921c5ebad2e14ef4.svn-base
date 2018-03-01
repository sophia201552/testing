'''
用户信息
'''
from beopWeb.mod_common.Utils import *
from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from beopWeb import app
from werkzeug.security import generate_password_hash, check_password_hash
from .Upload import Upload
import random
import uuid
import os
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_oss.ossapi import OssAPI


class User(DbEntity):
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'user'
    fields = ('id', 'username', 'userfullname', 'userpic', 'useremail')

    db = BEOPMySqlDBContainer()
    default_avatar_start_index = 1
    default_avatar_end_index = 23

    ALL_USER_MAP_CACHE_KEY = 'all_users_map'

    # 用户头像
    AVATAR_UPLOAD_FOLDER = 'beopWeb/static/images/avatar/user'
    default_user_pic_path = '/static/images/avatar/default/'
    custom_user_pic_path = '/static/images/avatar/user/'
    AVATAR_ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

    class UserStatus:
        '''
        用户的状态
        '''
        registered = 'registered'  # 帐号已经注册
        apply = 'apply'  # 帐号申请注册
        invited = 'invited'  # 帐号已经被邀请
        expired = 'expired'  # 帐号过期

    def get_all_user(self):
        '''
        获得所有的帐号信息

        :return: 帐号列表
        '''
        return self.query(self.fields)

    def get_all_user_map(self):
        all_users_map = self.get_cache('all_user_map')
        if not all_users_map:
            users = self.query(self.fields)
            all_users_map = {}
            for user in users:
                user['userpic'] = Utils.IMG_SERVER_DOMAIN + str(user.get('userpic'))
                all_users_map[int(user.get('id'))] = user
            self.set_cache('all_user_map', all_users_map)

        return {int(user_id): all_users_map.get(user_id) for user_id in all_users_map}

    def add_user(self, user, user_status='invited'):
        '''
        添加一个帐号

        :param user: 帐号信息
        :param user_status: 帐号状态
        :return: 添加后的帐号信息
        '''
        if 'isManager' not in user and 'ismanager' not in user:
            user['isManager'] = 0
        if 'supervisor' not in user:
            user['supervisor'] = 1  # 上级默认admin
        user['userstatus'] = user_status
        user_avatar = User.get_default_random_avatar(User.default_avatar_start_index, User.default_avatar_end_index)
        user['userpic'] = user_avatar

        db_helper = Utils.DbHelper()
        user_info = {}
        user_info.update(user)
        if('management' in user_info.keys()):
            user_info.pop('management')
        if ('password' in user_info.keys()):
            user_info.pop('password')
        inserted_id = db_helper.insert_with_return_id(User.db_name, User.table_name, user_info)
        user['id'] = inserted_id
        all_users_map = self.get_cache(self.ALL_USER_MAP_CACHE_KEY)
        if not all_users_map:
            all_users_map = {}
        all_users_map[inserted_id] = user
        self.set_cache(self.ALL_USER_MAP_CACHE_KEY, all_users_map)
        return user

    def is_registered(self, user_id):
        '''
        帐号是否注册

        :param user_id: 帐号ID
        :return: True 已经注册; False 没有注册
        '''
        all_users_map = self.get_cache(self.ALL_USER_MAP_CACHE_KEY)
        user = all_users_map.get(user_id)
        if user is None or user.get('userstatus') != User.UserStatus.registered:
            return False
        else:
            return True

    def is_applied(self, user_id):
        '''
        帐号是否申请注册

        :param user_id: 帐号ID
        :return: True 已经申请注册; False 没有申请注册
        '''
        all_users_map = self.get_cache(self.ALL_USER_MAP_CACHE_KEY)
        user = all_users_map.get(user_id)
        if user is None or user.get('userstatus') != User.UserStatus.apply:
            return False
        else:
            return True

    def is_invited(self, user_id):
        '''
        帐号是否被邀请

        :param user_id: 帐号ID
        :return: True 已经被邀请; False 没有被邀请
        '''
        all_users_map = self.get_cache(self.ALL_USER_MAP_CACHE_KEY)
        user = all_users_map.get(user_id)
        if user is None or user.get('userstatus') != User.UserStatus.invited:
            return False
        else:
            return True

    def get_user_list_info(self, user_id_list):
        '''
        根据帐号ID列表返回帐号信息列表

        :param user_id_list: 帐号ID列表
        :return: 帐号信息列表
        '''
        result = []
        if user_id_list:
            user_map = self.get_all_user_map()
            for user_id in user_id_list:
                if isinstance(user_id, int) or isinstance(user_id, str):
                    if user_map.get(int(user_id)):
                        result.append(user_map.get(int(user_id)))
                else:
                    result.append(user_id)
        return result

    def get_userId_by_email(self, user_email):
        '''
        根据用户Email返回帐号信息

        :param user_email: 用户Email
        :return: 帐号信息
        '''
        if not user_email:
            return None
        return self.query_one(self.fields, where=('useremail=%s', (user_email,)))

    def get_user_by_id(self, user_id, fields=None):
        '''
        根据用户ID返回帐号信息

        :param user_id: 用户ID
        :return: 帐号信息
        '''
        if fields and not isinstance(fields, list):
            fields = [fields]
        return self.query_one(fields=fields if fields else self.fields, where=('id=%s', (user_id,)))

    @staticmethod
    def query_user_by_id(user_id, *obj):
        '''
        根据用户ID返回帐号信息, 帐号信息可以自定义字段

        :param user_id: 用户ID
        :param obj: 自定义字段
        :return: 帐号信息
        '''
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name + ' where id=%s'
        rv = User.db.op_db_query_one(User.db_name, sql, (user_id,))
        return {key: value for key, value in zip(obj, rv)}

    @staticmethod
    def query_user_by_username(username, *obj):
        '''
        根据用户用户名返回帐号信息, 帐号信息可以自定义字段

        :param username: 用户名
        :param obj: 自定义字段
        :return: 帐号信息
        '''
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name + ' where username=%s'
        rv = User.db.op_db_query_one(User.db_name, sql, (username,))
        return {key: value for key, value in zip(obj, rv)}

    @staticmethod
    def query_all_users(*obj):
        '''
        获取所有的帐号信息

        :param obj: 帐号信息自定义字段
        :return: 所有帐号信息列表
        '''
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name
        rv = User.db.op_db_query(User.db_name, sql)
        return [{key: value for key, value in zip(obj, user)} for user in rv]

    @staticmethod
    def get_all_managers(*obj):
        '''
        获取所有的管理权限的帐号

        :param obj: 帐号信息自定义字段
        :return: 具有管理权限帐号列表
        '''
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name + ' where isManager = 1 order by userfullname'
        rv = User.db.op_db_query(User.db_name, sql, )
        return [{key: value for key, value in zip(obj, user)} for user in rv]

    @staticmethod
    def get_all_managers_under_supervisor(supervisor_id, *obj):
        '''
        获取管理权限帐号下的被管理者的列表

        :param supervisor_id: 具有管理权限的用户ID
        :param obj: 帐号信息自定义字段
        :return: 被管理者帐号列表
        '''
        users = User.get_users_flat_by_supervisor(supervisor_id, *obj)
        return [user for user in users if user.get('isManager') == 1]

    @staticmethod
    def update_user(user_id, *obj):
        '''
        更新用户帐号

        :param user_id: 用户ID
        :param obj: 更新内容
        :return: True 更新成功; False 更新失败
        '''
        param = []

        for item in obj:
            item_list = item.split('=')
            item = item_list[0] + "='" + item_list[1] + "'"
            param.append(item)
        sql = 'update ' + User.table_name + ' set ' + ','.join(param) + ' where id=%s'
        result = User.db.op_db_update(User.db_name, sql, (user_id,))
        if result:
            User().set_cache(User.ALL_USER_MAP_CACHE_KEY, None)
        return result

    @staticmethod
    def delete_user_by_id(user_id):
        '''
        根据用户ID删除用户

        :param user_id: 用户ID
        :return: True 删除成功; False 删除失败
        '''
        if user_id is None:
            return False
        sql = 'update ' + User.table_name + ' set userstatus = "expired" where id=%s'
        return User.db.op_db_update(User.db_name, sql, (user_id,))

    @staticmethod
    def update_user_password(user_id, password):
        '''
        更新帐号的密码

        :param user_id: 用户ID
        :param password: 新密码
        :return: True 密码更新成功; False 密码更新失败
        '''
        encoded_pwd = generate_password_hash(password)
        sql = 'update ' + User.table_name + ' set ' + 'unitproperty01=%s where id=%s'
        return User.db.op_db_update(User.db_name, sql, (encoded_pwd, user_id))

    @staticmethod
    def verify_password_by_user_id(user_id, password):
        '''
        验证用户的密码是否正确

        :param user_id: 用户ID
        :param password: 需要验证的密码
        :return: True 密码正确; False 密码不正确
        '''
        user = User.query_user_by_id(user_id, 'unitproperty01')
        user_password_hash = user.get('unitproperty01')
        return check_password_hash(user_password_hash, password)

    @staticmethod
    def verify_user(user_name, password):
        '''
        验证用户的密码是否正确

        :param user_name: 用户名
        :param password: 需要验证的密码
        :return: True 密码正确; False 密码不正确
        '''
        user = User.query_user_by_username(user_name, 'unitproperty01')
        user_password_hash = user.get('unitproperty01')
        return check_password_hash(user_password_hash, password)

    @staticmethod
    def get_default_random_avatar(start_index=1, end_index=1):
        '''
        获取默认帐号头像

        :param start_index: 头像开始计数
        :param end_index: 头像结束计数
        :return: 默认帐号头像地址
        '''
        return User.default_user_pic_path + str(random.randint(start_index, end_index)) + '.png'

    @staticmethod
    def update_user_avatar(user_id, avatar_image):
        '''
        更新帐号的头像信息, 上传头像到OSS

        :param user_id: 用户ID
        :param avatar_image: 头像
        :return: 头像OSS地址
        '''
        if user_id and avatar_image:
            # 头像名字变为唯一字符,防止名字相同覆盖原文件
            file_name_split = avatar_image.filename.rsplit('.', 1)
            file_name_split[0] = str(uuid.uuid4().fields[-1])[:8]
            avatar_image.filename = '.'.join(file_name_split)
            real_file_path = Upload.upload_file(avatar_image, User.AVATAR_UPLOAD_FOLDER, User.AVATAR_ALLOWED_EXTENSIONS)
            oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
            res = oss.put_object_from_file('beopweb', 'static/images/avatar/user/' + avatar_image.filename,
                                           real_file_path)
            if res.status != 200:
                return None
            if real_file_path:
                avatar_relative_path = User.custom_user_pic_path + avatar_image.filename
                old_userpic = User.query_user_by_id(user_id, 'userpic').get('userpic', '')
                if User.update_user(user_id, 'userpic=' + avatar_relative_path):
                    # 删除原头像
                    if old_userpic.find('default') == -1:  # 默认头像不删除
                        old_userpic_path = 'beopWeb' + old_userpic
                        if os.path.exists(old_userpic_path):
                            os.remove(old_userpic_path)
                            pos = old_userpic_path.rfind('/')
                            if pos >= 0:
                                oldfileName = old_userpic_path[pos + 1:]
                            res = oss.delete_object('beopweb', 'static/images/avatar/user/' + oldfileName)
                return avatar_relative_path
            else:
                return None
        else:
            return None

    @staticmethod
    def get_hierarchical_users(root_id=1, *obj):
        '''
        获取帐号信息的结构, 帐号有自己的管理员或者本身为管理员, 这样就形成了一个帐号的树形结构

        :param root_id: 帐号树形结构起始帐号ID
        :param obj: 自定义返回字段
        :return: 帐号的树形结构
        '''
        obj = list(obj) + ['id', 'isManager', 'supervisor']
        obj = list(set(obj))
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name
        rv = User.db.op_db_query(User.db_name, sql)
        users = [{key: Utils.IMG_SERVER_DOMAIN + str(value) if key == 'userpic' else value for key, value in
                  zip(obj, project)} for project in rv]

        def build_tree(nodes):
            tree = None
            for node in nodes:
                if int(node.get('id')) == int(root_id):
                    tree = node
                    break
            if not tree:
                return None
            else:
                return build_tree_recursive(tree, node.get('id'), nodes)

        def build_tree_recursive(tree, parent_id, nodes):
            children = [n for n in nodes if n.get('supervisor') == parent_id]
            if 'sub' not in tree:
                tree['sub'] = []
            for child in children:
                tree['sub'].append(child)
                build_tree_recursive(child, child.get('id'), nodes)

            return tree

        hierarchical_users = build_tree(users)
        return hierarchical_users

    @staticmethod
    def get_users_tree_by_supervisor(supervisor_id, *obj):
        '''
        根据管理员的ID获得帐号信息的结构

        :param supervisor_id: 管理员ID
        :param obj: 自定义帐号字段
        :return: 帐号的树形结构
        '''
        hierarchical_user = User.get_hierarchical_users(supervisor_id, *obj)
        return hierarchical_user

    @staticmethod
    def get_users_flat_by_supervisor(supervisor_id, *obj):
        '''
        根据管理员的ID获得帐号信息的结构, 非树形结构, 管理帐号及非管理帐号在一个列表中

        :param supervisor_id: 管理员ID
        :param obj: 自定义帐号字段
        :return: 帐号的列表结构
        '''
        hierarchical_user = User.get_hierarchical_users(supervisor_id, *obj)
        flat_list = []

        def get_sub_user(parent, ret_list):
            if 'sub' in parent and parent.get('sub'):
                for child in parent.get('sub'):
                    ret_list.append(child)
                    get_sub_user(child, ret_list)

        flat_list.append(hierarchical_user)
        get_sub_user(hierarchical_user, flat_list)

        return flat_list

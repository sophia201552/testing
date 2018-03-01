__author__ = 'liqian'
from beopWeb.mod_common.Utils import *
from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from beopWeb import app
from werkzeug.security import generate_password_hash, check_password_hash
from .Upload import Upload
import random
import uuid
import os
import re


class User:
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'user'

    db = BEOPMySqlDBContainer()
    default_avatar_start_index = 1
    default_avatar_end_index = 23

    # 用户头像
    AVATAR_UPLOAD_FOLDER = 'beopWeb\\static\\images\\avatar\\user'
    default_user_pic_path = '/static/images/avatar/default/'
    custom_user_pic_path = '/static/images/avatar/user/'
    AVATAR_ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

    class UserStatus:
        registered = 'registered'
        apply = 'apply'
        invited = 'invited'

    def __init__(self):
        pass

    @staticmethod
    def add_user(user, user_status='invited'):
        if 'isManager' not in user and 'ismanager' not in user:
            user['isManager'] = 0
        if 'supervisor' not in user:
            user['supervisor'] = 1  # 上级默认admin
        user['userstatus'] = user_status
        user_avatar = User.get_default_random_avatar(User.default_avatar_start_index, User.default_avatar_end_index)
        user['userpic'] = user_avatar

        db_helper = Utils.DbHelper()
        db_helper.insert(User.db_name, User.table_name, user)
        query_field = ('id', )
        return db_helper.query_one(User.db_name, User.table_name, query_field, user)

    @staticmethod
    def is_registered(user_id):
        user = User.query_user_by_id(user_id, 'userstatus')
        if user is None or user.get('userstatus') != User.UserStatus.registered:
            return False
        else:
            return True

    @staticmethod
    def is_applied(user_id):
        user = User.query_user_by_id(user_id, 'userstatus')
        if user is None or user.get('userstatus') != User.UserStatus.apply:
            return False
        else:
            return True

    @staticmethod
    def is_invited(user_id):
        user = User.query_user_by_id(user_id, 'userstatus')
        if user is None or user.get('userstatus') != User.UserStatus.invited:
            return False
        else:
            return True

    @staticmethod
    def query_user_by_id(user_id, *obj):
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name + ' where id=%s'
        rv = User.db.op_db_query_one(User.db_name, sql, (user_id,))
        return {key: value for key, value in zip(obj, rv)}

    @staticmethod
    def query_user_by_username(username, *obj):
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name + ' where username=%s'
        rv = User.db.op_db_query_one(User.db_name, sql, (username,))
        return {key: value for key, value in zip(obj, rv)}

    @staticmethod
    def query_all_users(*obj):
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name
        rv = User.db.op_db_query(User.db_name, sql)
        return [{key: value for key, value in zip(obj, user)} for user in rv]

    @staticmethod
    def get_all_managers(*obj):
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name + ' where isManager = 1 order by userfullname'
        rv = User.db.op_db_query(User.db_name, sql, )
        return [{key: value for key, value in zip(obj, user)} for user in rv]

    @staticmethod
    def get_all_managers_under_supervisor(supervisor_id, *obj):
        users = User.get_users_flat_by_supervisor(supervisor_id, *obj)
        return [user for user in users if user.get('isManager') == 1]

    @staticmethod
    def update_user(user_id, *obj):
        param = []
        for item in obj:
            item_list = item.split('=')
            item = item_list[0] + "='" + item_list[1] + "'"
            param.append(item)
        sql = 'update ' + User.table_name + ' set ' + ','.join(param) + ' where id=%s'
        return User.db.op_db_update(User.db_name, sql, (user_id,))

    @staticmethod
    def delete_user_by_id(user_id):
        if user_id is None:
            return False
        sql = 'delete from ' + User.table_name + ' where id=%s'
        return User.db.op_db_update(User.db_name, sql, (user_id,))

    @staticmethod
    def update_user_password(user_id, password):
        encoded_pwd = generate_password_hash(password)
        sql = 'update ' + User.table_name + ' set ' + 'unitproperty01=%s where id=%s'
        return User.db.op_db_update(User.db_name, sql, (encoded_pwd, user_id))

    @staticmethod
    def verify_password_by_user_id(user_id, password):
        user = User.query_user_by_id(user_id, 'unitproperty01')
        user_password_hash = user.get('unitproperty01')
        return check_password_hash(user_password_hash, password)

    @staticmethod
    def get_default_random_avatar(start_index=1, end_index=1):
        return User.default_user_pic_path + str(random.randint(start_index, end_index)) + '.png'

    @staticmethod
    def update_user_avatar(user_id, avatar_image):
        if user_id and avatar_image:
            # 头像名字变为唯一字符,防止名字相同覆盖原文件
            file_name_split = avatar_image.filename.rsplit('.', 1)
            file_name_split[0] = str(uuid.uuid4().fields[-1])[:8]
            avatar_image.filename = '.'.join(file_name_split)
            real_file_path = Upload.upload_file(avatar_image, User.AVATAR_UPLOAD_FOLDER, User.AVATAR_ALLOWED_EXTENSIONS)
            if real_file_path:
                avatar_relative_path = User.custom_user_pic_path + avatar_image.filename
                old_userpic = User.query_user_by_id(user_id, 'userpic').get('userpic', '')
                if User.update_user(user_id, 'userpic=' + avatar_relative_path):
                    # 删除原头像
                    if old_userpic.find('default') == -1:  # 默认头像不删除
                        old_userpic_path = os.path.join(os.getcwd(), 'beopWeb',
                                                        *re.compile('[/|\\\\]').split(old_userpic))
                        if os.path.exists(old_userpic_path):
                            os.remove(old_userpic_path)
                return avatar_relative_path
            else:
                return None
        else:
            return None

    @staticmethod
    def get_hierarchical_users(root_id=1, *obj):
        obj = list(obj) + ['id', 'isManager', 'supervisor']
        obj = list(set(obj))
        sql = 'select ' + ','.join(obj) + ' from ' + User.table_name
        rv = User.db.op_db_query(User.db_name, sql)
        users = [{key: value for key, value in zip(obj, project)} for project in rv]

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
        hierarchical_user = User.get_hierarchical_users(supervisor_id, *obj)
        return hierarchical_user

    @staticmethod
    def get_users_flat_by_supervisor(supervisor_id, *obj):
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





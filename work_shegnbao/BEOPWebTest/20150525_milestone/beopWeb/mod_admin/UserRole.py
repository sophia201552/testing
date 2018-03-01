__author__ = 'liqian'
from beopWeb.mod_common.Utils import *
from beopWeb import app


class UserRole:
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'user_role'

    @staticmethod
    def add_user_role(user_id, role_id):
        db_helper = Utils.DbHelper()
        return db_helper.insert(UserRole.db_name, UserRole.table_name, {'userId': user_id, 'roleId': role_id})

    @staticmethod
    def delete_user_role(user_id, role_id):
        pass

    @staticmethod
    def get_user_id_by_role_id(role_id):
        db_helper = Utils.DbHelper()
        return db_helper.query(UserRole.db_name, UserRole.table_name, ('userId',), {'roleId': role_id})



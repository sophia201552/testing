__author__ = 'win7'
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app
from beopWeb.mod_admin.User import User
from beopWeb.mod_admin.roleGroup import RoleGroup
from beopWeb.mod_admin.roleGroupUser import RoleGroupUser
import logging


class UserRoleGroup(DbEntity):
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'p_user_role'
    fields = ('userId', 'roleId')

    @staticmethod
    def get_user_role_group_id(user_id):
        rv = ['15']
        result = RoleGroupUser().get_role_group_by_user_id(user_id)
        for key in result:
            rv.append(str(key.get('roleGroupId')))
        return list(set(rv))

    @staticmethod
    def get_role_group(user_id):
        from beopWeb import BEOPMySqlDBReadOnlyContainer
        sql = "select prg.roles from p_role_group_user as prgu " \
              "left join p_role_group as prg on prgu.roleGroupId = prg.id " \
              "where prgu.userId = %s" % user_id
        db_name = app.config.get('DATABASE', 'beopdoengine')
        dbrv = BEOPMySqlDBReadOnlyContainer.BEOPMySqlDBReadOnlyContainer().op_db_query(db_name, sql)
        if dbrv is None:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        roles = ['SCROnly']
        for row in dbrv:
            for role in row[0].split(','):
                roles.append(role)
        result = list(set(roles))
        return result

    def get_all_user_role_map(self):
        result = self.query(self.fields)
        ret = {}
        for item in result:
            if not ret.get(item.get('userId')):
                ret[item.get('userId')] = []
            ret[item.get('userId')].append(item.get('roleId'))
        return ret

    def set_user_role(self, user_id, roles):
        self.delete_cache(user_id)
        self.delete(where=('userId=%s', (user_id,)))
        for role in roles:
            self.insert({'userId': user_id, 'roleId': role})

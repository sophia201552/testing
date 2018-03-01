__author__ = 'win7'
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app
from beopWeb.mod_admin.User import User
from beopWeb.mod_admin.roleGroup import RoleGroup
from beopWeb.mod_admin.roleGroupUser import RoleGroupUser


class UserRoleGroup(DbEntity):
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'p_user_role'
    fields = ('userId', 'roleId')

    def get_user_role_group_id(self, user_id):
        rv = ['15']
        result = RoleGroupUser().get_role_group_by_user_id(user_id)
        for key in result:
            rv.append(str(key.get('roleGroupId')))
        return list(set(rv))

    def get_role_group_id(self, user_id):
        # role_group_ids = self.get_cache(user_id)
        # if not role_group_ids:
        #     result = self.query(self.fields, where=("userId = %s", (user_id,)))
        #     role_group_ids = []
        #     for item in result:
        #         role_group_ids.append(item.get('roleId'))
        #     self.set_cache(user_id, role_group_ids)
        # role_group_id = User().query_user_by_id(user_id, 'userofrole').get('userofrole')
        role_groups = RoleGroupUser().get_role_group_by_user_id(user_id)
        roles = ['SCROnly']
        role_ids = []
        for role_group in role_groups:
            roles += RoleGroup().get_roles_by_id(role_group.get('roleGroupId'))
        roles = list(set(roles))
        from beopWeb.mod_admin.BeOPPermission import BeOPPermission

        for role in roles:
            for role_id, raw_role in BeOPPermission.rawRoleTable.items():
                if raw_role.get('name') == role:
                    role_ids.append(role_id)
        return list(set(role_ids))

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

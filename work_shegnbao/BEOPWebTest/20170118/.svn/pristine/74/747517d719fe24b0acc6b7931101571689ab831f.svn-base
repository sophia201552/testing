from .UserRoleGroup import UserRoleGroup
from beopWeb.mod_common.Exceptions import NoGrantedToPermissionGroup
from beopWeb.mod_admin.RolePermission import RolePermission


class BeOPPermission:
    def __init__(self):
        # 角色权限表, 角色的权限集合
        self.rawRoleTable = RolePermission().get_role_permission()
        # 原始角色权限表
        self.roleTable = self._get_role_table()

    def is_role(self, name):
        return name in self.rawRoleTable

    def _get_role_table(self):
        role_table = {}

        def get_permissions_from_role(name, result=[]):
            _permissions = self.rawRoleTable.get(name)
            for item in _permissions:
                if self.is_role(item):
                    get_permissions_from_role(item, result)
                else:
                    if item not in result:
                        result.append(item)
            return result

        for role, permissions in self.rawRoleTable.items():
            final_permissions = []
            for permission in permissions:
                if self.is_role(permission):
                    get_permissions_from_role(permission, final_permissions)
                else:
                    if permission not in final_permissions:
                        final_permissions.append(permission)

            role_table[role] = final_permissions
        return role_table

    def get_permissions_by_user_id(self, user_id):
        # 根据user_id获取用户权限
        urg = UserRoleGroup()
        if urg.get_role_group(user_id) is None:
            raise NoGrantedToPermissionGroup()
        role_groups = urg.get_role_group(user_id)
        permission_list = []
        for role_group_name in role_groups:
            if role_group_name not in self.rawRoleTable:
                continue
            permission_list += self.roleTable.get(role_group_name)
        return {permission.strip(): True for permission in permission_list}

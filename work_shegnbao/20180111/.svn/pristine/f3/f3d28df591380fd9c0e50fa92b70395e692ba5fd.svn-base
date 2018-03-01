"""
.. module:: BeOPPermission
"""

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
        '''
        判断是否一个权限组

        :param name: 权限组名称
        :return: 是否为一个权限组
        '''
        return name in self.rawRoleTable

    def _get_role_table(self):
        '''
        获取权限组列表
        '''
        role_table = {}

        # 避免权限组循环引用A->B B->C C->A
        role_checked = {}

        def get_permissions_from_role(name, result=None):
            if not result:
                result = []
            if self.is_role(name):
                _permissions = self.rawRoleTable.get(name)
                for item in _permissions:
                    if role_checked.get(item):  # 已经获得
                        sub_permissions = role_checked.get(item)
                    else:
                        role_checked[item] = list(set(get_permissions_from_role(item)))
                        sub_permissions = role_checked.get(item)
                    result += sub_permissions
            else:
                if name not in result:
                    result.append(name)
            return list(set(result))

        for role, permissions in self.rawRoleTable.items():
            final_permissions = []
            for permission in permissions:
                final_permissions += get_permissions_from_role(permission, final_permissions)

            role_table[role] = list(set(final_permissions))
        return role_table

    def get_permissions_by_user_id(self, user_id):
        '''
        根据user_id获取用户权限

        :param user_id: 用户ID
        :return: 用户ID可见的权限标识列表
        '''
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

"""
.. module:: BeOPPermission
"""

from .UserRoleGroup import UserRoleGroup
from beopWeb.mod_common.Exceptions import NoGrantedToPermissionGroup
from beopWeb.mod_admin.RolePermission import RolePermission


class BeOPPermission:
    @staticmethod
    def _is_role(name, rawTable):
        """
        判断是否一个权限组

        :param name: 权限组名称
        :return: 是否为一个权限组
        """
        return name in rawTable

    @staticmethod
    def _get_role_table(rawTable):
        """
        获取权限组列表
        """
        role_table = {}

        # 避免权限组循环引用A->B B->C C->A
        role_checked = {}

        def get_permissions_from_role(name, result=None):
            if not result:
                result = []
            if BeOPPermission._is_role(name, rawTable):
                _permissions = rawTable.get(name)
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

        for role, permissions in rawTable.items():
            final_permissions = []
            for permission in permissions:
                final_permissions += get_permissions_from_role(permission, final_permissions)

            role_table[role] = list(set(final_permissions))
        return role_table

    @staticmethod
    def get_permissions_by_user_id(user_id):
        """
        根据user_id获取用户权限

        :param user_id: 用户ID
        :return: 用户ID可见的权限标识列表
        """
        rawRoleTable = RolePermission().get_role_permission()
        # 原始角色权限表
        roleTable = BeOPPermission._get_role_table(rawRoleTable)
        role_groups = UserRoleGroup.get_role_group(user_id)
        if role_groups is None:
            raise NoGrantedToPermissionGroup()
        permission_list = []
        for role_group_name in role_groups:
            if role_group_name not in rawRoleTable:
                continue
            permission_list += roleTable.get(role_group_name)
        result = {permission.strip(): True for permission in permission_list}
        return result

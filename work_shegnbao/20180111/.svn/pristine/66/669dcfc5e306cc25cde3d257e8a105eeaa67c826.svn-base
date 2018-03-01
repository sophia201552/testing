'''
用户-权限组表
'''
__author__ = 'win7'

from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_admin.User import User


class RoleGroupUser(DbEntity):
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'p_role_group_user'
    fields = ('userId', 'roleGroupId')

    def get_role_group_by_user_id(self, user_id):
        """
        获取用户授权的权限组

        :param user_id: 用户ID
        :return: 权限组列表
        """
        return self.query(('roleGroupId',), where=('userId=%s', (user_id,)))

    def delete_user_role_group(self, user_id, role_group_id):
        """
        删除用户的权限组

        :param user_id: 用户ID
        :param role_group_id: 权限组ID
        :return: True 删除成功; False 删除失败
        """
        return self.delete(where=['userId=%s and roleGroupId=%s', (user_id, role_group_id)])

    def clear_user_role_group(self, user_id):
        """
        清除用户的权限组

        :param user_id: 用户ID
        :return: True 清除成功; False 清除失败
        """
        return self.delete(where=['userId=%s', [user_id]])

    def insert_user_role_group(self, user_id, user_role_group_list):
        """
        给用户添加权限组

        :param user_id: 用户ID
        :param user_role_group_list: 权限组列表
        :return: True 全部添加成功; False 至少有一项权限组没有添加成功
        """
        rv = True
        for key in user_role_group_list:
                rv &= self.insert({
                    "roleGroupId": key,
                    "userId": user_id
                })
        return rv

    def update_user_role_group(self, user_id, user_role_group_list):
        """
        更新用户的权限组

        :param user_id: 用户ID
        :param user_role_group_list: 新的权限组列表
        :return: True 更新成功; False 更新失败
        """

        rv = self.clear_user_role_group(user_id)
        if not rv:
            return False

        rv &= self.insert_user_role_group(user_id, user_role_group_list)

        user = User()
        # 删除被管理者的已经没有的权限
        sub_users = user.get_users_flat_by_supervisor(user_id)
        if sub_users:
            for sub_user in sub_users:
                sub_user_id = sub_user.get('id')
                sub_user_role_groups = self.get_role_group_by_user_id(sub_user_id)
                for sub_user_role_group in sub_user_role_groups:
                    if str(sub_user_role_group.get('roleGroupId')) not in user_role_group_list:
                        self.delete_user_role_group(sub_user_id, sub_user_role_group.get('roleGroupId'))
        return rv

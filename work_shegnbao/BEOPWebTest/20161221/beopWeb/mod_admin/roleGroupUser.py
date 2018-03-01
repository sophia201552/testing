__author__ = 'win7'

from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_admin.User import User


class RoleGroupUser(DbEntity):
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'p_role_group_user'
    fields = ('userId', 'roleGroupId')

    def get_role_group_by_user_id(self, user_id):
        return self.query(('roleGroupId',), where=('userId=%s', (user_id,)))

    def delete_user_role_group(self, user_id, role_group_id):
        return self.delete(where=['userId=%s and roleGroupId=%s', (user_id, role_group_id)])

    def clear_user_role_group(self, user_id):
        return self.delete(where=['userId=%s', [user_id]])

    def update_user_role_group(self, user_id, user_role_group_list):
        rv = self.clear_user_role_group(user_id)
        if rv:
            rv = 1
            for key in user_role_group_list:
                rv *= self.insert({
                    "roleGroupId": key,
                    "userId": user_id
                })

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
            return True if rv else False
        else:
            return False

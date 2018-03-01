'''
原工单组人员
'''

from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity


class TransactionGroupUser(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'
    table_name = 'transaction_group_user'
    fields = ('id', 'groupId', 'userId', 'type')

    def _is_same(self, a, b):
        if not a or not b:
            return False
        return a.get('groupId') == b.get('groupId') \
               and a.get('userId') == b.get('userId') \
               and a.get('type') == b.get('type')

    def get_all_group_by_user_id(self, user_id):
        # 根据用户ID获得工单组人员信息
        return self.query(self.fields, where=('userId=%s', (user_id,)))

    def get_all_users_by_group(self, group_id):
        # 根据工单组ID获得工单组人员信息
        return self.query(self.fields, where=('groupId=%s', [group_id]))

    def add_user_to_group(self, user_id, group_id, ug_type=0):
        # 添加用户到工单组
        model = {'userId': user_id, 'groupId': group_id, 'type': ug_type}
        returned_id = self.insert_with_return_id(model)
        if returned_id == -1:
            return False
        return True

    def get_members_from_group(self, group_id):
        # 根据工单组ID获得组内用户
        return self.query(self.fields, where=('groupId=%s', (group_id,)))

    def update_group_members(self, group_id, user_list):
        # 更新工单组用户
        del_result = self.delete(where=('groupId=%s', (group_id,)))
        if not del_result:
            return False
        result = True
        for user_id in user_list:
            result &= self.add_user_to_group(user_id, group_id)
        return result

    def delete_group_members(self, group_id):
        # 删除工单组用户
        result = self.delete(where=('groupId=%s', (group_id,)))
        if not result:
            return False
        return True

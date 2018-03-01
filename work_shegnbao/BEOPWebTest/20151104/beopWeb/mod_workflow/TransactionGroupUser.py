__author__ = 'liqian'

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
        groups = self.get_cache(user_id)
        if groups is None:
            groups = self.query(self.fields, where=('userId=%s', (user_id,)))
            self.set_cache(user_id, groups)
        return groups

    def add_user_to_group(self, user_id, group_id, ug_type=0):
        model = {'userId': user_id, 'groupId': group_id, 'type': ug_type}
        returned_id = self.insert_with_return_id(model)
        if returned_id == -1:
            return False

        groups = self.get_cache(user_id)
        if groups is not None:
            model['id'] = returned_id
            groups.append(model)
        return True

    def del_user_from_group(self, user_id, group_id, ug_type=0):
        model = {'userId': user_id, 'groupId': group_id, 'type': ug_type}
        success = self.delete(model)
        if not success:
            return False
        groups = self.get_cache(user_id)
        if groups is not None:
            groups[:] = [item for item in groups if self._is_same(item, model)]
            self.set_cache(user_id, groups)
        return True

    def get_members_from_group(self, group_id):
        members = self.get_cache(group_id)
        if members is None:
            members = self.query(self.fields, where=('groupId=%s', (group_id,)))
            self.set_cache(group_id, members)
        return members

    def update_group_members(self, group_id, user_list):
        del_result = self.delete(where=('groupId=%s', (group_id,)))
        if not del_result:
            return False
        result = True
        for user_id in user_list:
            result &= self.add_user_to_group(user_id, group_id)

        if result:
            members = self.query(self.fields, where=('groupId=%s', (group_id,)))
            self.set_cache(group_id, members)

        return result

    def delete_group_members(self, group_id):
        result = self.delete(where=('groupId=%s', (group_id,)))
        if not result:
            return False
        self.delete_cache(group_id)
        return True


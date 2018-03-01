__author__ = 'liqian'

from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity
from .TransactionGroupUser import TransactionGroupUser


class TransactionGroup(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'
    table_name = 'transaction_group'
    fields = ('id', 'name', 'creatorId', 'description', 'pic', 'createTime')

    def add_group(self, name, creator_id, description, create_time):
        return self.insert_with_return_id(
            {'name': name, 'creatorId': creator_id, 'description': description, 'createTime': create_time})

    def update_group(self, group_id, name, description):
        result = self.update({'name': name, 'description': description}, where=('id=%s', (group_id,)))
        if result:
            group = self.get_cache(group_id)
            group.update({'name': name, 'description': description})
            self.set_cache(group_id, group)
        return result

    def delete_group(self, group_id):
        return self.delete(where=('id=%s', (group_id,)))

    def get_trans_group_by_id(self, group_id):
        trans_group = self.get_cache(group_id)
        if trans_group is not None:
            return trans_group

        trans_group = self.query_one(self.fields, where=('id=%s', [group_id]))
        self.set_cache(group_id, trans_group)
        return trans_group

    def get_all_group_by_user_id(self, user_id):
        created = []
        joined = []
        created = self.query(self.fields, where=('creatorId=%s', (user_id,)))
        tgu = TransactionGroupUser()
        joined_group_user = tgu.get_all_group_by_user_id(user_id)
        for item in joined_group_user:
            joined.append(self.get_trans_group_by_id(item.get('groupId')))
        return {'created': created, 'joined': joined}

__author__ = 'liqian'

from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity
from .TransactionGroupUser import TransactionGroupUser


class TransactionGroupType:
    DEFAULT = 0
    CUSTOM = 1


class TransactionGroup(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'
    table_name = 'transaction_group'
    fields = ('id', 'name', 'creatorId', 'description', 'pic', 'createTime', 'type')

    def is_creator(self, user_id, group_id):
        return bool(self.query_one(self.fields, where=('id=%s and creatorId=%s', (group_id, user_id))))

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
        if user_id == '1':
            created = self.query(self.fields)
        else:
            created = self.query(self.fields, where=('creatorId=%s', (user_id,)), order=("type", "ASC"))
            tgu = TransactionGroupUser()
            joined_group_user = tgu.get_all_group_by_user_id(user_id)
            for item in joined_group_user:
                group_info = self.get_trans_group_by_id(item.get('groupId'))
                if int(group_info.get('creatorId')) != int(user_id):
                    joined.append(group_info)
        return {'created': created, 'joined': joined}

    def get_all_group_id_by_user_id(self, user_id):
        result = self.get_all_group_by_user_id(user_id)
        created = result.get('created')
        joined = result.get('joined')
        return [item.get('id') for item in created] + [item.get('id') for item in joined]

    def get_all_groups_by_user_id(self, user_id):
        result = self.get_all_group_by_user_id(user_id)
        created = result.get('created')
        joined = result.get('joined')
        return [item for item in created] + [item for item in joined]

    def get_group_creator(self, group_id):
        result = self.query(self.fields, where=("id=%s", [group_id]))
        return result if result else []

    def get_default_group_by_user_id(self, user_id):
        return self.query_one(self.fields, where=("creatorId=%s and type=%s", [user_id, TransactionGroupType.DEFAULT]))

    def create_default_group(self, user_id):
        return self.insert_with_return_id(
            {'creatorId': user_id, 'type': TransactionGroupType.DEFAULT, 'name': 'default',
             'description': 'BeOP default project'})

    def is_default_group(self, group_id):
        group = self.query_one(self.fields, where=("id=%s and type=%s", [group_id, TransactionGroupType.DEFAULT]))
        return True if group else False

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class Star(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'user_star'
    fields = ('user_id', 'transaction_id')

    def set_star(self, user_id, trans_id):
        result = self.insert({'user_id': user_id, 'transaction_id': trans_id})
        if result:
            self.set_cache(str(user_id) + '_' + str(trans_id), True)
        return result

    def remove_star(self, user_id, trans_id):
        result = self.delete(where=('user_id=%s and transaction_id=%s', (user_id, trans_id)))
        if result:
            self.set_cache(str(user_id) + '_' + str(trans_id), False)

    def toggle_star(self, user_id, trans_id):
        if self.is_starred(user_id, trans_id):
            return self.remove_star(user_id, trans_id)
        else:
            return self.set_star(user_id, trans_id)

    def is_starred(self, user_id, trans_id):
        result = self.get_cache(str(user_id) + '_' + str(trans_id))
        if result is None:
            start_model = self.query_one(self.fields, where=('user_id=%s and transaction_id=%s', (user_id, trans_id)))
            if start_model:
                self.set_cache(str(user_id) + '_' + str(trans_id), True)
            else:
                self.set_cache(str(user_id) + '_' + str(trans_id), False)
        return self.get_cache(str(user_id) + '_' + str(trans_id))

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class Star(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'user_star'
    fields = ('user_id', 'transaction_id')

    def set_star(self, user_id, trans_id):
        result = self.insert({'user_id': user_id, 'transaction_id': trans_id})
        return result

    def remove_star(self, user_id, trans_id):
        result = self.delete(where=('user_id=%s and transaction_id=%s', (user_id, trans_id)))

    def toggle_star(self, user_id, trans_id):
        if self.is_starred(user_id, trans_id):
            return self.remove_star(user_id, trans_id)
        else:
            return self.set_star(user_id, trans_id)

    def is_starred(self, user_id, trans_id):
        return True if self.query_one(self.fields,
                                      where=('user_id=%s and transaction_id=%s', (user_id, trans_id))) else False

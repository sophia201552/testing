__author__ = 'win7'
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class UserMsgReadHistory(DbEntity):
    fields = ('userId', 'lastMsgId')
    table_name = 'user_msg_read_history'
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'

    def __init__(self, user_id):
        self.user_id = user_id

    def get_last_msg_id(self):
        result = self.query_one(self.fields, where=('userId=%s', (self.user_id,)))
        return result.get('lastMsgId') if result is not None else None

    def update_last_msg_id(self, msg_id):
        if self.get_last_msg_id() is not None:
            return self.update({'lastMsgId': msg_id}, where=('userId=%s', (self.user_id,)))
        else:
            return self.insert({'lastMsgId': msg_id, 'userId': self.user_id})

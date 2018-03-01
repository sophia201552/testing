from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class DtuServerProjectRecord(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'dtuserver_prj_record'
    fields = ('id', 'user_id', 'dtu_id', 'info', 'time')

    def get_records_by_dtu_id(self, dtu_id):
        return self.query(self.fields, where=('dtu_id=%s', [dtu_id]),
                          order=["time DESC"], limit=[0, 20])

    def get_last_records_by_dtu_id(self, dtu_id):
        result = self.query(('user_id', 'info', 'time'), where=('dtu_id=%s', [dtu_id]),
                            order=["time DESC"], limit=[0, 1])
        if len(result):
            return result[0]
        else:
            return []

    def update_record(self, user_id, dtu_id, info, time):
        result = self.insert({'dtu_id': dtu_id, 'info': info, 'time': time, 'user_id': user_id})
        return result

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class ActivityType:
    START = 'start'
    PAUSE = 'pause'
    COMPLETE = 'complete'
    RESTART = 'restart'
    NEW = 'new'
    EDIT = 'edit'
    VERIFIED = 'verified'
    REPLY = 'reply'


class Activity(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'operation_record'
    fields = ('id', 'opTime', 'op', 'detail', 'linkToTransactionId', 'userId')

    def get_by_id(self, activity_id):
        return self.query_one(self.fields, where=('id=%s', [activity_id]))

    def get_user_activity_after(self, user_id, date):
        return self.query(self.fields,
                          where=('opTime>=%s and userId=%s', [date, user_id]),
                          order=["opTime DESC"])

    def get_group_activity_after(self, user_ids, date):
        if not user_ids:
            return {}
        param = [date] + user_ids
        return self.query(self.fields,
                          where=(
                              'opTime>=%s and userId in (%s)' % ('%s', ','.join(map(lambda x: '%s', user_ids))),
                              param),
                          order=["opTime DESC"])

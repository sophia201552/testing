from datetime import datetime, timedelta

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app
from .TransactionGroupUser import TransactionGroupUser


class Scheduler(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'scheduler'
    fields = ('id', 'userId', 'startTime', 'endTime', 'title', 'taskId', 'createTime', 'color', 'status', 'finishTime')

    def add_scheduler(self, title, user_id, start_time, end_time, task_id, color):
        if user_id is None:
            raise Exception('user id is None')
        if task_id is None:
            raise Exception('task id is None')
        if not end_time:
            end_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S') + timedelta(1) - timedelta(0, 1)
        return self.insert_with_return_id(
            {'title': title, 'userId': user_id, 'startTime': start_time, 'endTime': end_time, 'taskId': task_id,
             'createTime': datetime.now(), 'color': color}
        )

    def del_scheduler(self, scheduler_id):
        return self.delete({'id': scheduler_id})

    def update_scheduler(self, scheduler_id, event):
        update_field = ['startTime', 'endTime', 'title', 'color']
        update_obj = {field: event.get(field) for field in update_field if field in event}
        return self.update(update_obj, {'id': scheduler_id})

    def get_users_scheduler(self, user_id_list):
        sql = '''select s.id, s.userId, s.startTime, s.endTime, s.title, tp.type, tp.content
                  from scheduler s
                  left join task_pool tp on s.taskId = tp.id
                  where s.userId in (''' + ",".join(["%s" for k in user_id_list]) + ")"

        return self.db_helper.db.op_db_query(self.db_name, sql, user_id_list)

    def get_group_scheduler_by_group_id(self, group_id):
        sql = '''select s.id, s.userId, s.startTime, s.endTime, s.title, tp.type, tp.content
                  from scheduler s
                  left join task_pool tp on s.taskId = tp.id
                  where s.userId in
                    (select distinct userId from statics_relate sr1 where projectId = %s)'''

        return self.db_helper.db.op_db_query(self.db_name, sql, (group_id,))

    def get_group_scheduler_by_time(self, user_id, year, month=None):
        sql = '''select s.id, s.userId, s.startTime, s.endTime, s.title, tp.type, tp.content
                  from scheduler s
                  left join task_pool tp on s.taskId = tp.id
                  where
                  {year}
                  {month}
                  s.userId in
                    (select distinct userId from statics_relate sr1 where projectId in
                      (select projectId from statics_relate sr2 where sr2.userId = %s))'''

        if month is None:
            sql = sql.format(year='YEAR (startTime) = %s and', month='%s')
            month = ''
        else:
            sql = sql.format(year='YEAR (startTime) = %s and ', month='MONTH (startTime) = %s and ')

        return self.db_helper.db.op_db_query(self.db_name, sql, (year, month, user_id))

    def get_group_scheduler_by_between(self, group_id, start='', end=''):
        if not group_id:
            return []
        if start:
            if end:
                where = ['startTime >= %s and endTime <= %s', [start, end]]
            else:
                where = ['startTime >= %s ', [start]]
        else:
            if end:
                where = ['endTime <= %s', [end]]
            else:
                return []
        where[0] += ' and userId in (select userId from transaction_group_user where groupId=%s)'
        where[1].append(group_id)
        return self.query(self.fields, where=where)

    def get_user_today_scheduler(self, user_id):
        sql = '''select s.id, s.userId, u.userfullname, s.startTime, s.endTime, s.title, s.createTime, s.color, tp.type, tp.content
                  from scheduler s
                  left join task_pool tp on s.taskId = tp.id
                  left join beopdoengine.user u on u.id = s.userId
                  where
                  status = 0 and
                  startTime <= now() and
                  endTime >= now() and
                  s.userId = %s'''

        rv = self.db_helper.db.op_db_query(self.db_name, sql, (user_id,))
        fields = ['id', 'userId', 'username', 'startTime', 'endTime', 'title', 'createTime', 'color', 'type', 'content']
        return [{key: value for key, value in zip(fields, rv_item)} for rv_item in rv] if rv else []

    def get_user_scheduler_by_between(self, user_id, start='', end=''):
        if start:
            if end:
                where = ('userId=%s and startTime >= %s and endTime <= %s', (user_id, start, end))
            else:
                where = ('userId=%s and startTime >= %s ', (user_id, start,))
        else:
            if end:
                where = ('userId=%s and endTime <= %s', (user_id, end,))
            else:
                return []
        return self.query(self.fields, where=where)

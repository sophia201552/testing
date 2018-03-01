'''
工单日程
'''
from datetime import datetime, timedelta

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class Scheduler(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'scheduler'
    fields = ('id', 'userId', 'startTime', 'endTime', 'title', 'taskId', 'createTime', 'color', 'status', 'finishTime')

    def add_scheduler(self, title, user_id, start_time, end_time, task_id, color=None):
        '''
        添加到日程中
        :param title: 日程标题
        :param user_id: 操作人ID
        :param start_time: 日程开始时间
        :param end_time: 日程结束时间
        :param task_id: 任务ID
        :param color: 日程表中的颜色
        :return: 日程任务ID
        '''
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
        '''
        根据日程ID删除一个日程

        :param scheduler_id: 日程ID
        :return: True 删除成功; False 删除失败
        '''
        return self.delete({'id': scheduler_id})

    def update_scheduler(self, scheduler_id, event):
        '''
        更新一个日程

        :param scheduler_id: 日程ID
        :param event: 日程内容
        :return: True 更新成功; False 更新失败
        '''
        update_field = ['startTime', 'endTime', 'title', 'color']
        update_obj = {field: event.get(field) for field in update_field if field in event}
        return self.update(update_obj, {'id': scheduler_id})

    def get_users_scheduler(self, user_id_list):
        '''
        获取用户列表的日程

        :param user_id_list: 用户ID列表
        :return: 日程列表
        '''
        sql = '''select s.id, s.userId, s.startTime, s.endTime, s.title, tp.type, tp.content
                  from scheduler s
                  left join task_pool tp on s.taskId = tp.id
                  where s.userId in (''' + ",".join(["%s" for k in user_id_list]) + ")"

        return self.db_helper.db.op_db_query(self.db_name, sql, user_id_list)

    def get_group_scheduler_by_group_id(self, group_id):
        '''
        获取一个工单项目的日程

        :param group_id: 项目ID
        :return: 日程列表
        '''

        sql = '''select s.id, s.userId, s.startTime, s.endTime, s.title, tp.type, tp.content
                  from scheduler s
                  left join task_pool tp on s.taskId = tp.id
                  where s.userId in
                    (select distinct userId from statics_relate sr1 where projectId = %s)'''

        return self.db_helper.db.op_db_query(self.db_name, sql, (group_id,))

    def get_group_scheduler_by_time(self, user_id, year, month=None):
        '''
        根据时间获取用户日程

        :param user_id: 用户ID
        :param year: 年
        :param month: 月
        :return: 日程列表
        '''
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
        '''
        获取一段事件内的日程

        :param group_id: 项目组ID
        :param start: 开始时间
        :param end: 结束时间
        :return: 日程列表
        '''
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
        '''
        获取用户今天的日程

        :param user_id: 用户ID
        :return: 日程列表
        '''
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
        '''
        获取用户时间段内的日程

        :param user_id: 用户ID
        :param start: 开始时间
        :param end: 结束时间
        :return: 日程列表
        '''
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

    def get_scheduler_by_between(self, start='', end=''):
        '''
        获取用户时间段内的日程
        :param start: 开始时间
        :param end: 结束时间
        :return: 日程列表
        '''
        if start:
            if end:
                where = ('startTime >= %s and endTime <= %s', (start, end))
            else:
                where = ('startTime >= %s ', (start,))
        else:
            if end:
                where = ('endTime <= %s', (end,))
            else:
                return []
        return self.query(self.fields, where=where)

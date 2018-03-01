__author__ = 'liqian'
from beopWeb import app
from beopWeb.mod_common.Utils import Utils


class Statistics:
    db_workflow = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_statistics_group_view = 'statistics_group_view'

    @staticmethod
    def statistics_group(group_id_list, begin_time=None, end_time=None):
        param = []
        if group_id_list:
            where = ' where tg.id in (' + ','.join(str(group_id) for group_id in group_id_list) + ') '
        else:
            where = ' where '
        if begin_time:
            where += ' and createTime > %s '
            param.append(begin_time)

        if end_time:
            where += ' and createTime < %s '
            param.append(end_time)

        sql = '''select count(t.id) AS totalCount,
                cast(sum((case when (t.statusId = 4) then 1 else 0 end)) as signed) AS finishedCount,
                cast(sum((case when (t.statusId <> 4) then 1 else 0 end)) as signed) AS unFinishedCount,
                cast(sum((case when ((t.statusId <> 4) and ((to_days(now()) - to_days(t.dueDate)) > 0)) then 1 else 0 end)) as signed) AS delayedCount,
                tg.id AS groupId,
                tg.name AS groupName
                from (transaction_group tg left join transaction t on t.groupid = tg.id)
                {where}
                group by t.groupid '''
        sql = sql.format(where=where)
        db_helper = Utils.DbHelper()

        rv = db_helper.db.op_db_query(Statistics.db_workflow, sql, tuple(param))
        fields = ['totalCount', 'finishedCount', 'unFinishedCount', 'delayedCount', 'groupId', 'groupName']
        return [{key: value for key, value in zip(fields, statistics)} for statistics in rv]

    @staticmethod
    def statistics_user_in_group(group_id, user_id_list, begin_time=None, end_time=None):
        param = []
        if not group_id:
            return []
        else:
            where = ' where t.groupId = %s '
            param.append(group_id)

        if begin_time:
            where += ' and t.createTime > %s '
            param.append(begin_time)

        if end_time:
            where += ' and t.createTime < %s '
            param.append(end_time)

        if user_id_list:
            # where += ' and t.executorID in (' + ','.join(str(group_id) for group_id in user_id_list) + ') '
            pass

        sql = '''select count(0) AS totalCount,
                  cast(sum((case when (t.statusId = 4) then 1 else 0 end)) as signed) AS finishedCount,
                  cast(sum((case when (t.statusId <> 4) then 1 else 0 end)) as signed) AS unFinishedCount,
                  cast(sum((case when ((t.statusId <> 4) and ((to_days(now()) - to_days(t.dueDate)) > 0)) then 1 else 0 end)) as signed) AS delayedCount,
                  u.id AS userId,
                  u.username AS username,
                  u.userfullname AS userfullname 
                  from (workflow.transaction t left join beopdoengine.user u on t.executorID = u.id)
                  {where}
                  group by t.executorID '''
        sql = sql.format(where=where)
        db_helper = Utils.DbHelper()

        rv = db_helper.db.op_db_query(Statistics.db_workflow, sql, tuple(param))
        fields = ['totalCount', 'finishedCount', 'unFinishedCount', 'delayedCount', 'userId', 'username',
                  'userfullname']
        return [{key: value for key, value in zip(fields, statistics)} for statistics in rv]

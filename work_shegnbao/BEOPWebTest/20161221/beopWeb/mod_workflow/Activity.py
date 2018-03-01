from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app
from datetime import datetime, timedelta
from beopWeb.mod_common.DateUtils import DateUtils


class ActivityType:
    START = 'start'
    PAUSE = 'pause'
    COMPLETE = 'complete'
    RESTART = 'restart'
    NEW = 'new'
    EDIT = 'edit'
    VERIFIED = 'verified'
    REPLY = 'reply'


class ActivityTimeType:
    YESTERDAY = "0"
    TODAY = "1"
    THIS_WEEK = "2"
    THIS_MONTH = "3"
    LATEST_COMPLETED = "4"
    LATEST_CREATED = "5"


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

    def get_group_activity_after(self, user_ids, time_interval_dict, limit):
        if not user_ids:
            return []
        param = [time_interval_dict.get("start"), time_interval_dict.get("end")] + user_ids
        where_sql = 'opTime>=%s and opTime<=%s and userId in (%s)' % (
            '%s', '%s', ','.join(map(lambda x: '%s', user_ids)))
        return {
            "count": self.count(where=(where_sql, param)),
            "activities": self.query(self.fields,
                                     where=(where_sql, param), order=["opTime DESC"], limit=limit)
        }

    def get_time(self, type):
        model = {
            ActivityTimeType.TODAY: DateUtils.get_today_duration,
            ActivityTimeType.THIS_WEEK: DateUtils.get_weekly_duration,
            ActivityTimeType.YESTERDAY: DateUtils.get_yesterday_duration,
            ActivityTimeType.THIS_MONTH: DateUtils.get_monthly_duration,
            ActivityTimeType.LATEST_COMPLETED: self.get_latest_duration,
            ActivityTimeType.LATEST_CREATED: self.get_latest_duration
        }
        result = model.get(type)
        return result if result else model.get(ActivityTimeType.TODAY)

    def get_latest_duration(self, now):
        return {
            "start": (now - timedelta(days=int(now.strftime("%w")))).strftime("%Y-%m-%d 00:00:00"),
            "end": (now + timedelta(days=6 - (int(now.strftime("%w"))))).strftime("%Y-%m-%d 23:59:59")
        }

    def get_if_none_then_type(self, type):
        if type == ActivityTimeType.TODAY:
            return ActivityTimeType.YESTERDAY
        elif type == ActivityTimeType.YESTERDAY:
            return ActivityTimeType.THIS_WEEK
        elif type == ActivityTimeType.THIS_WEEK:
            return ActivityTimeType.THIS_MONTH

    def get_sql_by_activity_type(self, activity_time_type, group_ids, last_activity_id=None):

        if activity_time_type == int(ActivityTimeType.LATEST_COMPLETED):
            sql = 'opTime>=%s and opTime<=%s and linkToTransactionId in (select id from transaction where groupid in (%s)) and op="%s"' % (
                '%s', '%s', ','.join(map(lambda x: '%s', group_ids)), ActivityType.COMPLETE)
        elif activity_time_type == int(ActivityTimeType.LATEST_CREATED):
            sql = 'opTime>=%s and opTime<=%s and linkToTransactionId in (select id from transaction where groupid in (%s))  and op="%s"' % (
                '%s', '%s', ','.join(map(lambda x: '%s', group_ids)), ActivityType.NEW)
        else:
            sql = 'opTime>=%s and opTime<=%s and linkToTransactionId in (select id from transaction where groupid in (%s))  ' % (
                '%s', '%s', ','.join(map(lambda x: '%s', group_ids)))
        if last_activity_id is not None:
            sql += 'and o.id < %s' % (last_activity_id)
        return sql

    def get_record_by_date_activityType(self, user_id, last_activity_id, time_interval_dict, group_ids,
                                        activity_time_type,
                                        limit=None):

        count_sql = 'select COUNT(o.id) from operation_record o LEFT JOIN transaction t ON o.linkToTransactionId = t.id WHERE '
        where_sql = 'select o.id, o.opTime, o.op, o.detail, o.linkToTransactionId, o.userId  from operation_record o LEFT JOIN transaction t ON o.linkToTransactionId = t.id WHERE '
        if not group_ids:
            return {
                "count": 0,
                "activities": []
            }
        count_sql += self.get_sql_by_activity_type(activity_time_type, group_ids, last_activity_id=last_activity_id)
        count_param = [time_interval_dict.get("start"), time_interval_dict.get("end")] + group_ids
        if last_activity_id is None or not last_activity_id:
            where_sql += self.get_sql_by_activity_type(activity_time_type, group_ids, last_activity_id=last_activity_id)
            param = count_param[:]
        else:
            param = [last_activity_id] + [time_interval_dict.get("start"),
                                          time_interval_dict.get("end")] + group_ids
            where_sql += 'o.id < %s and opTime>=%s and opTime<=%s and linkToTransactionId in (select id from transaction where groupid in (%s)) ' % (
                '%s', '%s', '%s', ','.join(map(lambda x: '%s', group_ids)))

        if 'and' in where_sql:
            where_sql += ' and (executorID = %s or creatorID = %s) order by o.id DESC'
        else:
            where_sql += ' (executorID = %s or creatorID = %s) order by o.id DESC'

        param += [user_id, user_id]
        if limit:
            where_sql += " LIMIT %s" % limit[0]

            if len(limit) > 1:
                where_sql += ", %s" % limit[1]

        activities = self.db_helper.db.op_db_query(self.db_name, where_sql, param)
        count = self.db_helper.db.op_db_query(self.db_name, count_sql, count_param)

        return {
            "totalCount": count[0] if count else 0,
            "activities": [{key: value for key, value in zip(self.fields, rv_item)} for rv_item in
                           activities] if activities else []
        }

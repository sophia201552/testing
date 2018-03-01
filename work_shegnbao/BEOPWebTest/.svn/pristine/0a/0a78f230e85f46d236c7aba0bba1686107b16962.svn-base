from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app
from datetime import datetime, timedelta
import calendar


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
            ActivityTimeType.TODAY: self.get_today_duration,
            ActivityTimeType.THIS_WEEK: self.get_weekly_duration,
            ActivityTimeType.YESTERDAY: self.get_yesterday_duration,
            ActivityTimeType.THIS_MONTH: self.get_monthly_duration,
            ActivityTimeType.LATEST_COMPLETED: self.get_latest_duration,
            ActivityTimeType.LATEST_CREATED: self.get_latest_duration
        }
        result = model.get(type)
        return result if result else model.get(ActivityTimeType.TODAY)

    def get_today_duration(self, now):
        return {
            "start": now.strftime("%Y-%m-%d 00:00:00"),
            "end": now.strftime("%Y-%m-%d 23:59:59")
        }

    def get_tomorrow_duration(self, now):
        return {
            "start": (now + timedelta(days=1)).strftime("%Y-%m-%d 00:00:00"),
            "end": (now + timedelta(days=1)).strftime("%Y-%m-%d 23:59:59")
        }

    def get_yesterday_duration(self, now):
        return {
            "start": (now - timedelta(days=1)).strftime("%Y-%m-%d 00:00:00"),
            "end": (now - timedelta(days=1)).strftime("%Y-%m-%d 23:59:59")
        }

    def get_weekly_duration(self, now):
        return {
            "start": (now - timedelta(days=int(now.strftime("%w")))).strftime("%Y-%m-%d 00:00:00"),
            "end": (now + timedelta(days=6 - (int(now.strftime("%w"))))).strftime("%Y-%m-%d 23:59:59")
        }

    def get_monthly_duration(self, now):
        month_thrange = calendar.monthrange(now.year, now.month)
        return {
            "start": datetime.date(datetime(now.year, now.month, 1)).strftime("%Y-%m-%d 00:00:00"),
            "end": datetime.date(datetime(now.year, now.month, month_thrange[1])).strftime("%Y-%m-%d 23:59:59")
        }

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
            sql += 'and id < %s' % (last_activity_id)
        return sql

    def get_record_by_date_activityType(self, last_activity_id, time_interval_dict, group_ids,
                                        activity_time_type,
                                        limit=None):
        if not group_ids:
            return {
                "count": 0,
                "activities": []
            }
        count_sql = self.get_sql_by_activity_type(activity_time_type, group_ids, last_activity_id=last_activity_id)
        count_param = [time_interval_dict.get("start"),
                       time_interval_dict.get("end")] + group_ids
        if last_activity_id is None or not last_activity_id:
            param = count_param
            where_sql = count_sql
        else:
            param = [last_activity_id] + [time_interval_dict.get("start"),
                                          time_interval_dict.get("end")] + group_ids
            where_sql = 'id < %s and opTime>=%s and opTime<=%s and linkToTransactionId in (select id from transaction where groupid in (%s)) ' % (
                '%s', '%s', '%s', ','.join(map(lambda x: '%s', group_ids)))

        return {
            "totalCount": self.count(where=(count_sql, count_param)),
            "activities": self.query(self.fields,
                                     where=(where_sql, param), order=["id DESC"], limit=limit)
        }

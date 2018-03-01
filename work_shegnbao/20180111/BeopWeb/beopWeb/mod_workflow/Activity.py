'''
工单动态信息
'''
from datetime import timedelta

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app
from beopWeb.mod_common.DateUtils import DateUtils


class ActivityType:
    '''
    动态类型
    '''
    START = 'start'
    PAUSE = 'pause'
    COMPLETE = 'complete'
    RESTART = 'restart'
    NEW = 'new'
    EDIT = 'edit'
    VERIFIED = 'verified'
    REPLY = 'reply'


class ActivityTimeType:
    '''
    动态时间相关
    '''
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
        '''
        根据动态ID 获得动态信息

        :param activity_id: 动态ID
        :return: 动态信息
        '''
        return self.query_one(self.fields, where=('id=%s', [activity_id]))

    def get_user_activity_after(self, user_id, date):
        '''
        获取用户某时间后的动态

        :param user_id: 用户ID
        :param date: 时间
        :return: 动态列表
        '''
        return self.query(self.fields,
                          where=('opTime>=%s and userId=%s', [date, user_id]),
                          order=["opTime DESC"])

    def get_group_activity_after(self, user_ids, time_interval_dict, limit):
        '''
        获取一组用户某时间段内的动态

        :param user_ids: 用户ID组
        :param time_interval_dict: 时间段
        :param limit: 返回条数限制
        :return: 动态列表
        '''
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
        '''
        获取动态时间范围

        :param type: 时间类型
        :return: 时间范围
        '''
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
        '''
        获取最近的时间范围

        :param now: 时间起点
        :return: 时间范围
        '''
        return {
            "start": (now - timedelta(days=int(now.strftime("%w")))).strftime("%Y-%m-%d 00:00:00"),
            "end": (now + timedelta(days=6 - (int(now.strftime("%w"))))).strftime("%Y-%m-%d 23:59:59")
        }

__author__ = 'Nomand'
from datetime import datetime, timedelta
import calendar
import pytz


class DateUtils:
    @staticmethod
    def get_today_duration(now):
        return {
            "start": now.strftime("%Y-%m-%d 00:00:00"),
            "end": now.strftime("%Y-%m-%d 23:59:59")
        }

    @staticmethod
    def get_tomorrow_duration(now):
        return {
            "start": (now + timedelta(days=1)).strftime("%Y-%m-%d 00:00:00"),
            "end": (now + timedelta(days=1)).strftime("%Y-%m-%d 23:59:59")
        }

    @staticmethod
    def get_yesterday_duration(now):
        return {
            "start": (now - timedelta(days=1)).strftime("%Y-%m-%d 00:00:00"),
            "end": (now - timedelta(days=1)).strftime("%Y-%m-%d 23:59:59")
        }

    @staticmethod
    def get_weekly_duration(now, isLocal=False):
        if isLocal:
            # 这周一到这周日
            return {
                "start": (now - timedelta(days=int(now.strftime("%w")) - 1)).strftime("%Y-%m-%d 00:00:00"),
                "end": (now + timedelta(days=7 - (int(now.strftime("%w"))))).strftime("%Y-%m-%d 23:59:59")
            }
        else:
            # 上周日到这周六
            return {
                "start": (now - timedelta(days=int(now.strftime("%w")))).strftime("%Y-%m-%d 00:00:00"),
                "end": (now + timedelta(days=6 - (int(now.strftime("%w"))))).strftime("%Y-%m-%d 23:59:59")
            }

    @staticmethod
    def get_monthly_duration(now):
        month_thrange = calendar.monthrange(now.year, now.month)
        return {
            "start": datetime.date(datetime(now.year, now.month, 1)).strftime("%Y-%m-%d 00:00:00"),
            "end": datetime.date(datetime(now.year, now.month, month_thrange[1])).strftime("%Y-%m-%d 23:59:59")
        }

    @staticmethod
    def get_projLocal_date(time_zone=8):
        return datetime.now(pytz.utc) + timedelta(hours=int(time_zone))

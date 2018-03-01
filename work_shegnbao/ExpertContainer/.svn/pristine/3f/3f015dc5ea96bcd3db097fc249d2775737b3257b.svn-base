from datetime import date, datetime, timedelta
import calendar

def monthdelta(s_date, delta):
    delta = int(delta)
    ''' 月份相对计算方法 '''
    d_month, d_year = (s_date.month+delta) % 12, s_date.year + (s_date.month+delta-1) // 12
    if not d_month:
        d_month = 12
    d_day = min(s_date.day, calendar.monthrange(d_year, d_month)[1])
    return s_date.replace(day=d_day, month=d_month, year=d_year)

def getCodeByTimeRange(time_range):
    ''' 根据模块的 timeRange 配置计算出正确的 '''
    time_type = time_range['type']
    time_option = time_range['option']
    time_start = None
    time_end = None
    time_format = None
    # 快速配置
    if time_type == 0:
        period = time_range['option']['period']
        if period == 'last24hours':
            time_start = (datetime.now()-timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')
            time_end = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            time_format = 'm5'
        elif period == 'yesterday':
            prefix = (date.today()-timedelta(days=1)).strftime('%Y-%m-%d')
            time_start = prefix + ' 00:00:00'
            time_end = prefix + '23:59:59'
            time_format = 'm5'
        elif period == 'last7days':
            time_start = (datetime.now()-timedelta(days=7)).strftime('%Y-%m-%d %H:%M:%S')
            time_end = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            time_format = 'h1'
        elif period == 'lastweek':
            week_day = date.today().weekday()
            time_start = (date.today()-timedelta(days=7+week_day)).strftime('%Y-%m-%d 00:00:00')
            time_end = (date.today()-timedelta(days=week_day+1)).strftime('%Y-%m-%d 23:59:59')
            time_format = 'h1'
        elif period == 'last12months':
            month = date.today().month
            year = date.today().year
            delta = 365
            if month > 2 and calendar.isleap(year) or\
                month <= 2 and calendar.isleap(year-1):
                delta = 366
            time_start = (datetime.now()-timedelta(days=delta)).strftime('%Y-%m-%d %H:%M:%S')
            time_end = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            time_format = 'd1'
    # 固定周期
    elif time_type == 1:
        time_start = time_option['timeStart']
        time_end = time_option['timeEnd']
        time_format = time_option['timeFormat']
    # 最近周期
    elif time_type == 2:
        time_format = time_option['timeFormat']
        time_unit = time_option['timeUnit']
        unit_number = int(time_option['numberOfUnit'])
        if time_unit == 'hour':
            time_start = (datetime.now()-timedelta(hours=unit_number))\
                .strftime('%Y-%m-%d %H:%M:%S')
        elif time_unit == 'day':
            time_start = (datetime.now()-timedelta(days=unit_number))\
                .strftime('%Y-%m-%d %H:%M:%S')
        elif time_unit == 'month':
            time_start = monthdelta(datetime.now(), unit_number)\
                .strftime('%Y-%m-%d %H:%M:%S')
        time_end = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    return time_start, time_end, time_format

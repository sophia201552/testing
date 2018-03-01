__author__ = 'liqian'
from beopWeb.mod_common.Utils import *
from beopWeb import app
from datetime import datetime, timedelta


class Records:
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'op_records'

    @staticmethod
    def _set_record(user_id, title, record_type, ip=None):
        data = {'operator': user_id, 'title': title, 'type': record_type, 'time': datetime.now(), 'ip': ip}
        db_helper = Utils.DbHelper()
        return db_helper.insert(Records.db_name, Records.table_name, data)

    @staticmethod
    def _get_records(user_id=None, record_type=None, begin_time=None, end_time=None, order_by=None, limit=None):
        sql = 'select u.id, operator, title, time, type, u.userfullname, u.username, r.ip ' \
              'from ' + Records.table_name + ' r left join user u on r.operator = u.id where 1=1 '
        param = []
        if user_id is not None:
            sql += ' and operator = %s'
            param.append(user_id)
        if record_type is not None:
            sql += ' and type = %s'
            param.append(record_type)
        if begin_time is not None:
            sql += ' and time >= %s'
            param.append(begin_time)
        if end_time is not None:
            sql += ' and time <= %s'
            # 截至日期加1天, 否则比较为截止日期0时0分0秒,而不是24时60分60秒
            end_time = (datetime.strptime(end_time, '%Y-%M-%d') + timedelta(1)).strftime('%Y-%M-%d')
            param.append(end_time)
        if order_by is not None:
            sql += ' ' + order_by
        if limit is not None:
            sql += ' ' + limit
        db_helper = Utils.DbHelper()
        rv = db_helper.db.op_db_query(Records.db_name, sql, param)
        return [{'id': item[0], 'operator': item[1], 'title': item[2], 'time': item[3], 'type': item[4],
                 'userfullname': item[5], 'username': item[6], 'ip': item[7]} for item in rv]


    @staticmethod
    def record_login(user_id, ip=None):
        if user_id is None:
            raise Exception('user id is none')
        return Records._set_record(user_id, None, Utils.RecordType.LOGIN, ip)

    @staticmethod
    def get_login_records(user_id, begin_time, end_time):
        if user_id is None:
            raise Exception('user id is none')
        return Records._get_records(user_id, Utils.RecordType.LOGIN, begin_time, end_time, ' order by time desc')



__author__ = 'liqian'
from beopWeb.mod_common.Utils import *
from beopWeb import app
from flask import json
from datetime import datetime, timedelta


class Records:
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'op_records'

    @staticmethod
    def _set_record(user_id, title, record_type, ip=None, agent_info=None):
        data = {'operator': user_id,
                'title': title,
                'type': record_type,
                'time': datetime.now()}
        if ip:
            data['ip'] = ip
        if agent_info:
            data['agent'] = json.dumps(agent_info)
        logging.info('登录时的信息:' + str(data))
        return Utils.DbHelper().insert(Records.db_name, Records.table_name, data)

    @staticmethod
    def _get_records_once(user_id=None, record_type=None, order_by=None, limit=None):
        fields = ['r.time', 'r.ip', 'r.agent']
        sql = 'select ' + ', '.join(fields) + \
              ' from ' + Records.table_name + ' r left join user u on r.operator = u.id where 1=1 '
        param = []
        if user_id is not None:
            sql += ' and operator = %s'
            param.append(user_id)
        if record_type is not None:
            sql += ' and type = %s'
            param.append(record_type)
        if order_by is not None:
            sql += ' ' + order_by
        sql += ' limit 20'
        db_helper = Utils.DbHelper()
        rv = db_helper.db.op_db_query(Records.db_name, sql, param)
        result = []
        for item in rv:
            result_item = {}
            for key, value in zip(fields, item):
                if key == 'r.agent' and value:
                    try:
                        value = json.loads(value) if value else ''
                    except Exception as e:
                        value = ''
                key = key[key.find('.') + 1:]
                result_item[key] = value

            result.append(result_item)
        return result

    @staticmethod
    def _get_records(user_id=None, record_type=None, begin_time=None, end_time=None, order_by=None, limit=None):
        fields = ['r.time', 'r.ip', 'r.agent']
        sql = 'select ' + ', '.join(fields) + \
              ' from ' + Records.table_name + ' r left join user u on r.operator = u.id where 1=1 '
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
            # end_time = (datetime.strptime(end_time, '%Y-%M-%d') + timedelta(1)).strftime('%Y-%M-%d')
            end_time_to_date = datetime.strptime(end_time, "%Y-%m-%d").date()
            end_time_add_one = end_time_to_date + timedelta(days=1)
            end_time = str(end_time_add_one)
            param.append(end_time)
        if order_by is not None:
            sql += ' ' + order_by
        if limit is not None:
            sql += ' ' + limit
        db_helper = Utils.DbHelper()
        rv = db_helper.db.op_db_query(Records.db_name, sql, param)
        result = []
        for item in rv:
            result_item = {}
            for key, value in zip(fields, item):
                if key == 'r.agent' and value:
                    try:
                        value = json.loads(value) if value else ''
                    except Exception as e:
                        value = ''
                key = key[key.find('.') + 1:]
                result_item[key] = value

            result.append(result_item)
        return result

    @staticmethod
    def record_login(user_id, ip=None, agent=None):
        if user_id is None:
            raise Exception('user id is none')
        return Records._set_record(user_id, None, Utils.RecordType.LOGIN, ip, agent)

    @staticmethod
    def get_login_records(user_id, begin_time, end_time):
        if user_id is None:
            raise Exception('user id is none')
        if begin_time is None:
            return Records._get_records_once(user_id, Utils.RecordType.LOGIN, ' order by time desc')
        return Records._get_records(user_id, Utils.RecordType.LOGIN, begin_time, end_time, ' order by time desc')

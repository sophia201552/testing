'''
用户操作记录
'''
__author__ = 'liqian'
from beopWeb.mod_common.Utils import *
from beopWeb import app
from flask import json
from datetime import datetime, timedelta
from config import Config
from beopWeb import app
import requests, threading


class Records:
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'op_records'

    @staticmethod
    def _set_record(user_id, title, record_type, ip=None, agent_info=None, tm=datetime.now()):
        '''
        记录用户操作记录

        :param user_id: 用户ID
        :param title: 记录标题
        :param record_type: 记录类型
        :param ip: 用户IP
        :param agent_info: 用户浏览器信息
        :return:
        '''
        data = {'operator': user_id,
                'title': title,
                'type': record_type,
                'time': tm}
        if ip:
            data['ip'] = ip
        if agent_info:
            data['agent'] = json.dumps(agent_info)
        logging.info('登录时的信息:' + str(data))
        return Utils.DbHelper().insert(Records.db_name, Records.table_name, data)

    @staticmethod
    def _get_records_once(user_id=None, record_type=None, order_by=None, limit=None):
        '''
        获取用户最后20条的操作记录

        :param user_id: 用户ID
        :param record_type: 记录类型
        :param order_by: 记录排序
        :param limit: 记录返回条数
        :return: 操作记录列表
        '''
        fields = ['r.time', 'r.ip', 'r.agent', 'r.title']
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
                if (key == 'r.agent' or key == 'r.title') and value:
                    try:
                        value = json.loads(value) if value else ''
                    except Exception as e:
                        value = ''
                key = key[key.find('.') + 1:]
                if key == 'title':
                    key = 'location'
                result_item[key] = value

            result.append(result_item)
        return result

    @staticmethod
    def _get_records(user_id=None, record_type=None, begin_time=None, end_time=None, order_by=None, limit=None):
        '''
        获取用户操作记录

        :param user_id: 用户ID
        :param record_type: 记录类型
        :param begin_time: 查询开始时间
        :param end_time: 查询结束时间
        :param order_by: 记录排序
        :param limit: 记录返回条数
        :return: 操作记录列表
        '''
        fields = ['r.time', 'r.ip', 'r.agent', 'r.title']
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
                if (key == 'r.agent' or key == 'r.title') and value:
                    try:
                        value = json.loads(value) if value else ''
                    except Exception as e:
                        value = ''
                key = key[key.find('.') + 1:]
                if key == 'title':
                    key = 'location'
                result_item[key] = value

            result.append(result_item)
        return result

    @staticmethod
    def record_login(user_id, ip=None, agent=None):
        '''
        记录用户的登录记录

        :param user_id: 用户ID
        :param ip: 用户IP
        :param agent: 用户浏览器信息
        :return: 操作记录列表
        '''
        if user_id is None:
            raise Exception('user id is none')
        tm = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        Records._set_record(user_id, None, Utils.RecordType.LOGIN, ip, agent, tm)
        type = int(Config.IP_QUERY_TYPE)
        if type > 0:
            t1 = threading.Thread(target=Records._ip_info_contain, args=(type, ip, user_id, tm))
            t1.start()
        return

    @staticmethod
    def get_login_records(user_id, begin_time, end_time):
        '''
        获取用户登录记录

        :param user_id: 用户ID
        :param begin_time: 登录记录开始时间
        :param end_time: 登录记录结束时间
        :return: 操作记录列表
        '''
        if user_id is None:
            raise Exception('user id is none')
        if begin_time is None:
            return Records._get_records_once(user_id, Utils.RecordType.LOGIN, ' order by time desc')
        return Records._get_records(user_id, Utils.RecordType.LOGIN, begin_time, end_time, ' order by time desc')

    @staticmethod
    def _ip_info_contain(type, ip, user_id, tm):
        info = Records._get_ip_info(type, ip)
        Records._set_ip_info(user_id, tm, info)

    @staticmethod
    def _get_ip_info(type, ip):
        logging.debug('type=%s, ip=%s', type, ip)
        dictRet = {
            'country': '',
            'region': '',
            'city': '',
            'isp': ''
        }
        try:
            if 1 == type:
                url = 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip
                r = requests.get(url)
                if 200 == r.status_code:
                    dictData = json.loads(bytes.decode(r.content))
                    dictRet['country'] = dictData['data']['country']
                    dictRet['region'] = dictData['data']['region']
                    dictRet['city'] = dictData['data']['city']
                    dictRet['isp'] = dictData['data']['isp']
                else:
                    raise Exception('Failed to get IP location from Taobao! status_code = %s', r.status_code)
            elif 2 == type:
                url = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' + ip
                r = requests.get(url)
                if 200 == r.status_code:
                    dictData = json.loads(bytes.decode(r.content))
                    dictRet['country'] = dictData['country']
                    dictRet['region'] = dictData['province']
                    dictRet['city'] = dictData['city']
                    dictRet['isp'] = dictData['isp']
                else:
                    raise Exception('Failed to get IP location from Sina! status_code = %s', r.status_code)
            elif 3 == type:
                url = 'http://ip-api.com/json/' + ip
                r = requests.get(url)
                if 200 == r.status_code:
                    dictData = json.loads(bytes.decode(r.content))
                    if 'success' == dictData['status']:
                        dictRet['country'] = dictData['country']
                        dictRet['region'] = dictData['region']
                        dictRet['city'] = dictData['city']
                        dictRet['isp'] = dictData['isp']
                    else:
                        raise Exception('Failed to get IP location from ip-api! dictData["status"] is %s!',
                                        dictData['status'])
                else:
                    raise Exception('Failed to get IP location from ip-api! status_code = %s', r.status_code)
            else:
                raise Exception('Invalid type %s. Only 1, 2 or 3 is expected!', type)
        except Exception:
            logging.error("Failed to get IP location information! type=%s, ip=%s",
                          type, ip, exc_info=True, stack_info=True)
        return json.dumps(dictRet, ensure_ascii=False)

    @staticmethod
    def _set_ip_info(user_id, time, info):
        data = {'title': info}
        condition = {'operator': user_id, 'time': time}
        return Utils.DbHelper().update(Records.db_name, Records.table_name, data, where=condition)

__author__ = 'liqian'
import logging
import imghdr
from datetime import datetime
import json
import re
import uuid
import random

import requests
from flask import render_template, Response
from bson.objectid import ObjectId

from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from beopWeb import app
from .I18n import I18n
from beopWeb.mod_common.Exceptions import *

from beopWeb.mod_admin.Management import Management as Management
from beopWeb.mod_common import i18n


class Encoder(json.JSONEncoder):
    '''
    用在JSON序列化中, 处理时间及ObjectId类型数据
    '''

    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.strftime(Utils.datetime_format_full)
        else:
            return obj


class Utils:
    default_error_code = '0'
    default_success_code = '1'
    image_type = ['rgb', 'gif', 'pbm', 'pgm', 'ppm', 'tiff', 'rast', 'xbm', 'jpeg', 'bmp', 'png']
    datetime_format_full = '%Y-%m-%d %H:%M:%S'
    datetime_format_time = '%H:%M:%S'
    datetime_format_date = '%Y-%m-%d'
    datetime_without_year = '%m/%d %H:%M'
    datetime_without_second = '%Y-%m-%d %H:%M'
    datetime_format_full_file_name = '%Y-%m-%d %H-%M-%S'
    IMG_SERVER_DOMAIN = 'https://beopweb.oss-cn-hangzhou.aliyuncs.com'
    OSS_HOST = 'oss.aliyuncs.com'
    OSS_ACCESS_ID = 'iIDKdO6hyMbZVYzp'
    OSS_SECRET_ACCESS_KEY = 'YFiyioy9kgizMChIfHMWtVvNnvsjVM'

    CLOUD_POINT_NAME_VALID = re.compile('^[a-zA-Z][a-zA-Z_0-9]+$', re.IGNORECASE)  # 点名是否合法判断
    CLOUD_POINT_NAME_START_WITH_NUM = re.compile('^\d')  # 点名是否以数字开头
    CLOUD_POINT_NAME_REFILL = '_'  # 点名不合法字符替换
    CLOUD_POINT_NAME_NUMBER_PREFIX = 'P_'  # 点名不合法字符替换
    CLOUD_POINT_NAME_NOT_VALID_CHAR = re.compile('[^a-zA-Z_0-9]')  # 不合法字符

    REPORT_UPLOAD_IMAGE_FOLDER = 'beopWeb/static/projectReports/reports/'
    TMP_PDF_COVER_FILE_PATH = 'beopWeb/static/projectReports/'

    class RecordType:
        '''
        用户操作记录类型
        '''
        LOGIN = 1
        USER = 2
        PAGE = 3

    class DbHelper:
        '''
        数据操作工具
        '''
        db = BEOPMySqlDBContainer()

        def _serialize_insert(self, data):
            keys = ",".join(data.keys())
            vals = ",".join(["%s" for k in data])

            return [keys, vals]

        def _serialize_update(self, data):
            return "=%s,".join(data.keys()) + "=%s"

        # 参数举例 ("books",["id", "name", "year"], ("year > %s and price < 15", [year, 12.99]), ["year", "DESC"], [0, 10])
        # table: books
        # fields: ["id", "name", "year"] or 'id,name,year'
        # where: ("year > %s and price < %s", [2015, 15]) 或者 {'year':'2012','price':15} -> 'year=2012 and price=15'
        # order by: ["year", "DESC"]
        # limit: [0, 10]
        def query(self, db_name, table, fields=(), where=None, order=None, limit=None, is_distinct=False):
            if not fields:
                raise Exception('select fields is empty')
            if isinstance(fields, str):
                fields = fields.split(',')
            if isinstance(fields, list) or isinstance(fields, tuple):
                query = ','.join(fields)
            else:
                raise Exception('select fields must be list or str')

            if is_distinct:
                sql = 'SELECT DISTINCT %s FROM %s' % (query, table)
            else:
                sql = 'SELECT %s FROM %s' % (query, table)

            if where:
                if isinstance(where, dict):
                    where = ('=%s and '.join(where.keys()) + '=%s ', list(where.values()))
                if len(where) > 0 and where[0]:
                    sql += " WHERE %s" % where[0]

            if order:
                sql += " ORDER BY %s" % order[0]

                if len(order) > 1:
                    sql += " %s" % order[1]

            if limit:
                sql += " LIMIT %s" % limit[0]

                if len(limit) > 1:
                    sql += ", %s" % limit[1]

            rv = self.db.op_db_query(db_name, sql, where[1] if where and len(where) > 1 else ())
            return [{key: value for key, value in zip(fields, rv_item)} for rv_item in rv] if rv else []

        def count(self, db_name, table, where=None):
            sql = 'SELECT COUNT(*) FROM %s' % (table,)

            if where:
                if isinstance(where, dict):
                    where = ('=%s and '.join(where.keys()) + '=%s ', list(where.values()))
                if len(where) > 0:
                    sql += " WHERE %s" % where[0]

            rv = self.db.op_db_query(db_name, sql, where[1] if where and len(where) > 1 else ())
            return rv[0][0] if rv else 0

        def query_one(self, db_name, table, fields=(), where=None, order=None, limit=None):
            rv = self.query(db_name, table, fields, where, order, limit)
            return rv[0] if rv else None

        def insert(self, db_name, table, data):
            query = self._serialize_insert(data)
            sql = "INSERT INTO %s (%s) VALUES(%s)" % (table, query[0], query[1])
            return self.db.op_db_update(db_name, sql, list(data.values()))

        def insert_with_return_id(self, db_name, table, data):
            query = self._serialize_insert(data)
            sql = "INSERT INTO %s (%s) VALUES(%s)" % (table, query[0], query[1])
            return self.db.op_db_update_with_id(db_name, sql, list(data.values()))

        def delete(self, db_name, table, where=None):
            sql = "DELETE FROM %s " % (table,)
            if where:
                if isinstance(where, dict):
                    where = ('=%s and '.join(where.keys()) + '=%s ', list(where.values()))
                if len(where) > 0:
                    sql += " WHERE %s" % where[0]
            return self.db.op_db_update(db_name, sql, where[1] if where and len(where) > 1 else ())

        def update(self, db_name, table, data, where=None, upsert=False, insert_data=None):

            if upsert and insert_data:
                if not self.count(db_name, table, where=where):
                    return self.insert(db_name, table, insert_data)

            query = self._serialize_update(data)

            sql = "UPDATE %s SET %s" % (table, query)

            if where:
                if isinstance(where, dict):
                    where = ('=%s and '.join(where.keys()) + '=%s ', list(where.values()))
                if len(where) > 0:
                    sql += " WHERE %s" % where[0]

            return self.db.op_db_update(db_name, sql, list(data.values()) + list(where[1]) if where and len(
                where) > 1 else data.values())

    class EmailTool:
        @staticmethod
        def send_invitation_email_with_pwd(password, username, recipients, inviter_email, management_id, language):
            '''
                发送注册邀请邮件(包含账号密码)
                :param recipients: 接收邮箱列表
                :param inviter_email: 邀请人的邮箱
                :param language: 邮件语言
                :return: True 发送成功; False 发送失败
            '''
            domain = 'http://' + app.config.get('SITE_DOMAIN')
            i18n.set_lang(language)
            config = {
                'subject': i18n.trans('invite_topic'),
                'platform': 'BeOP',
                'intro_link': domain,
                'invitee_email': recipients,
                'logo': 'static/images/logo_beop.png',
                'password': password,
                'username': username
            }
            if management_id:
                management_info = Management.get_management_detail(management_id)
                if management_info:
                    if language == 'zh':
                        name_key = 'name_cn'
                    else:
                        name_key = 'name_en'
                    domain = 'http://' + management_info.get('code_name', 'beop') + '.' + 'smartbeop.com'
                    config.update({
                        'intro_link': domain,
                        'is_group_user': True,
                        'platform': management_info.get(name_key),
                        'logo': 'custom/management/' + str(management_info.get('id')) + '_logo.png',
                        'password': password,
                        'username': username
                    })
            with app.app_context():
                html = render_template('email/invitationEmailWithPwd.html', configMap=config)
            return Utils.EmailTool.send_email(config.get('subject'), recipients, html, cc=[inviter_email])
        @staticmethod
        def send_invitation_email(recipients, token, inviter_email, management_id, language):
            '''
            发送注册邀请邮件
            :param recipients: 接收邮箱列表
            :param token: 注册token
            :param inviter_email: 邀请人的邮箱
            :param language: 邮件语言
            :return: True 发送成功; False 发送失败
            '''
            domain = 'http://' + app.config.get('SITE_DOMAIN')
            link = domain + '/invite_to_register/' + token
            # i18n = I18n()
            i18n.set_lang(language)
            config = {
                'subject': i18n.trans('invite_topic'),
                'platform': 'BeOP',
                'activate_link': link,
                'intro_link': domain,
                'invitee_email': recipients,
                'logo': 'static/images/logo_beop.png'
            }
            if management_id:
                management_info = Management.get_management_detail(management_id)
                if management_info:
                    if language == 'zh':
                        name_key = 'name_cn'
                    else:
                        name_key = 'name_en'
                    domain = 'http://' +management_info.get('code_name','beop') + '.' + 'smartbeop.com'
                    link = domain + '/invite_to_register/' + token
                    config.update({
                        'intro_link':domain,
                        'activate_link':domain + '/invite_to_register/' + token,
                        'is_group_user':True,
                        'platform':management_info.get(name_key),
                        'logo':'custom/management/' + str(management_info.get('id')) +'_logo.png'
                    })
            with app.app_context():
                html = render_template('email/invitationEmail.html', configMap=config)
            return Utils.EmailTool.send_email(config.get('subject'), recipients, html, cc=[inviter_email])

        @staticmethod
        def send_email(subject, recipients, html, sender=None, attachment_list=None, cc=None, bcc=None):
            '''
            发送邮件
            :param subject: 邮件主题
            :param recipients: 接收人邮箱列表
            :param html: 邮件html内容
            :param sender: 发送邮箱
            :param attachment_list: 附件列表
            :param cc: 抄送列表
            :param bcc: 密送列表
            :return: True 发送成功; False 发送失败
            '''
            if not isinstance(recipients, (list,)):
                recipients = recipients.split(';')
            try:
                if sender is None:
                    sender = app.config['MAIL_DEFAULT_SENDER']
                    # msg = Message(subject=subject, recipients=recipients, charset='utf-8', html=html, sender=sender)
                    # if attachment_list:
                    # for attachment_item in attachment_list:
                    # msg.attach(filename=attachment_item.get('filename', 'attachment'),
                    # content_type=attachment_item.get('content_type ', 'text/html'),
                    # data=attachment_item.get('data').encode('utf-8'))
                # Mail(app).send(msg)
                url = app.config.get('BEOP_SERVICE_ADDRESS') + '/mq/mqSendTask'
                va = {}
                va.update({'type': 'email', 'subject': subject, 'recipients': recipients, 'msgId': ObjectId().__str__(),
                           'sender': sender, 'html': html, 'cc': cc, 'bcc': bcc})
                data = {'name': 'email', 'value': str(va)}
                headers = {'content-type': 'application/json', 'token': 'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
                res = requests.post(url, headers=headers, data=json.dumps(data), timeout=600)
                if res.status_code == 200:
                    if json.loads(res.text).get('error') == 'ok':
                        return True
            except Exception as e:
                logging.error(e)
            return False

    @staticmethod
    def is_image(filename, h, image_type_list=None):
        file_type = imghdr.what(filename, h)
        return file_type in image_type_list if image_type_list else file_type in Utils.image_type

    @staticmethod
    def is_email(email):
        '''
        检测是否为邮箱地址
        :param email: 待检测文本
        :return: True 是邮箱地址, False 不是手邮箱地址
        '''
        return re.match("[^@]+@[^@]+\.[^@]+", str(email))

    @staticmethod
    def is_phone(phone):
        '''
        检测是否为手机号码
        :param phone: 待检测文本
        :return: True 是手机号码, False 不是手机号码
        '''
        return re.match('^\d{8,15}$', str(phone))

    @staticmethod
    def get_random_num(length):
        '''
        获取固定长度的随机数
        :param length: 随机数长度
        :return: 固定长度的随机数
        '''
        if length <= 0 or not isinstance(length, int):
            return 0
        return random.randint(10 ** (length - 1), 10 ** length - 1)

    @staticmethod
    def msg_param_required(param_name):
        return 'The parameter "{name}" is required'.format(name=param_name)

    @staticmethod
    def beop_response(is_success, data, code, msg=''):
        '''
        后台api响应格式
        :param is_success: 请求结果
        :param data: 响应数据
        :param code: 结果代码
        :param msg: 结果信息
        :return: Response
        '''
        if not code:
            code = Utils.default_success_code if is_success else Utils.default_error_code
        return Response(
            json.dumps({'success': is_success, 'code': code, 'data': data, 'msg': msg}, cls=Encoder,
                       ensure_ascii=False),
            mimetype='application/json'
        )

    @staticmethod
    def beop_response_error(data=None, code='0', msg=''):
        '''
        后台api失败响应格式
        :param data: 响应数据
        :param code: 结果代码
        :param msg: 结果信息
        :return: Response
        '''
        if isinstance(data, Exception):
            logging.error(data)
            data = str(data)
        return Utils.beop_response(False, data, code, msg)

    @staticmethod
    def beop_response_success(data=None, code='1'):
        '''
        后台api成功响应格式
        :param data: 响应数据
        :param code: 结果代码
        :return: Response
        '''
        return Utils.beop_response(True, data, code)

    @staticmethod
    def get_now_full_str():
        '''
        获取完整的当前时间字符串
        :return: 当前时间字符串
        '''
        return datetime.now().strftime(Utils.datetime_format_full)

    @staticmethod
    def get_now_date_str():
        '''
        获取当前日期字符串
        :return: 当前日期字符串
        '''
        return datetime.now().strftime(Utils.datetime_format_date)

    @staticmethod
    def get_now_time_str():
        '''
        获取当前时分秒字符串
        :return: 当前时分秒字符串
        '''
        return datetime.now().strftime(Utils.datetime_format_time)

    @staticmethod
    def get_object_id(object_id):
        '''
        获取合法的ObjectId
        :param object_id:
        :return:
        '''
        if isinstance(object_id, ObjectId):
            return object_id
        else:
            if isinstance(object_id, str) and ObjectId.is_valid(object_id):
                return ObjectId(object_id)
            else:
                raise invalidObjectID('非法的id')

    @staticmethod
    def user_id_list_to_detail(user_id_list):
        '''
        用户ID列表获取用户信息列表
        :param user_id_list: 用户ID列表
        :return: 用户信息列表
        '''
        from beopWeb.mod_admin.User import User

        user_map = User().get_all_user_map()
        ret = []
        if isinstance(user_id_list, list):
            for user_item in user_id_list:
                if isinstance(user_item, dict):
                    ret.append(user_item)
                else:
                    if user_item in user_map:
                        user = user_map.get(user_item)
                        ret.append({
                            'id': user.get('id'),
                            'userfullname': user.get('userfullname'),
                            'userpic': user.get('userpic'),
                            'useremail': user.get('useremail')
                        })
        return ret

    @staticmethod
    def handle_search_text(text):
        '''
        处理文本支持正则搜索
        :param text: 待处理文本
        :return: 支持正则搜索文本
        '''
        old_text = text[:]
        if not text:
            return ''
        # 将所有.* 和 * 转为.*
        text = text.replace('.*', '*').replace('*', '.*')
        # 将所有空白
        text_item_list = re.compile(r"\s+").split(text)
        # 方案1: 转为positive look ahead assertion 速度较慢
        # text = ''.join(['(?=.*%s)' % item for item in text_item_list])
        # 方案2: 转为.*
        text = '.*'.join(text_item_list)
        try:
            return re.compile(text, re.IGNORECASE)
        except Exception:
            return re.compile(old_text, re.IGNORECASE)

    @staticmethod
    def handle_mysql_search_text(text):
        '''
        处理文本支持mysql正则搜索
        :param text: 待处理文本
        :return: 支持正则搜索文本
        '''
        if not text:
            return ''
        # 将所有.* 和 * 转为.*
        text = text.replace('.*', '*').replace('*', '.*')
        # 将所有空白转为positive look ahead assertion
        text_item_list = re.compile(r"\s+").split(text)
        text = ''.join(['.*%s.*' % item for item in text_item_list])
        # 开头加.*
        if not text.startswith('^') and not text.startswith('.*'):
            text = '.*' + text
        # 结尾加.*
        if not text.endswith('$') and not text.endswith('.*'):
            text = (text + '.*')
        return text

    @staticmethod
    def _handle_ip_list(ip_str):
        '''
        将以逗号分割的IP地址字符串转为IP地址列表
        :param ip_str: IP地址字符串
        :return: IP地址列表
        '''
        if not ip_str:
            return None
        if not isinstance(ip_str, str):
            ip_str = str(ip_str)
        if ',' in ip_str:
            ip_list = ip_str.split(',')
            return ip_list[0].strip()
        else:
            return ip_str

    @staticmethod
    def get_real_ip_from_request(request):
        '''
        获取请求的真实IP地址
        :param request: 浏览器请求对象
        :return: IP地址
        '''
        if not request or not request.headers:
            return None
        if not request.headers.getlist("X-Forwarded-For"):
            return Utils._handle_ip_list(request.remote_addr)
        else:
            return Utils._handle_ip_list(request.headers.getlist("X-Forwarded-For")[0])

    @staticmethod
    def get_pdf_cover_temp_path():
        '''
        获取报表PDF封面临时文件路径
        :return:
        '''
        return Utils.TMP_PDF_COVER_FILE_PATH + str(uuid.uuid4()) + '.html'

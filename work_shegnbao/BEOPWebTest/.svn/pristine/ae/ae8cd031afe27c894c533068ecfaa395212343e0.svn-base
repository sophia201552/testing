__author__ = 'liqian'
import logging
import imghdr
from datetime import datetime
import json, requests

from flask import render_template, Response

from bson.objectid import ObjectId

from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from beopWeb import app
from beopWeb.mod_common.Exceptions import *
import re
from . import i18n
import uuid


class Encoder(json.JSONEncoder):
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
    IMG_SERVER_DOMAIN = 'http://images.rnbtech.com.hk'
    OSS_HOST = 'oss.aliyuncs.com'
    OSS_ACCESS_ID = 'iIDKdO6hyMbZVYzp'
    OSS_SECRET_ACCESS_KEY = 'YFiyioy9kgizMChIfHMWtVvNnvsjVM'

    CLOUD_POINT_NAME_VALID = re.compile('^[a-zA-Z][\w\-_\s]+$', re.IGNORECASE)
    CLOUD_POINT_NAME_START_WITH_NUM = re.compile('^\d')

    REPORT_UPLOAD_IMAGE_FOLDER = 'beopWeb/static/projectReports/reports/'
    TMP_PDF_COVER_FILE_PATH = 'beopWeb/static/projectReports/'

    class RecordType:
        LOGIN = 1
        USER = 2
        PAGE = 3

    class DbHelper:
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

        def update(self, db_name, table, data, where=None):
            query = self._serialize_update(data)

            sql = "UPDATE %s SET %s" % (table, query)

            if where:
                if isinstance(where, dict):
                    where = ('=%s and '.join(where.keys()) + '=%s ', list(where.values()))
                if len(where) > 0:
                    sql += " WHERE %s" % where[0]

            return self.db.op_db_update(db_name, sql,
                                        list(data.values()) + list(where[1]) if where and len(
                                            where) > 1 else data.values())

    class EmailTool:
        @staticmethod
        def send_invitation_email(recipients, token, inviter_name, inviter_email, language='zh-CN'):
            link = 'http://' + app.config.get('SITE_DOMAIN') + '/invite_to_register/' + token
            config = {
                'subject': 'invitation from beop',
                'company_name': 'beop',
                'activate_link': link,
                'intro_link': 'http://beop.rnbtech.com.hk',
                'inviter_name': inviter_name,
                'inviter_email': inviter_email or ""
            }
            i18n.set_lang(language)
            html = render_template('email/invitationEmail.html', configMap=config)
            return Utils.EmailTool.send_email(config.get('subject'), recipients, html, cc=[inviter_email])

        @staticmethod
        def send_email(subject, recipients, html, sender=None, attachment_list=None, cc=None, bcc=None):
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
    def beop_response(is_success, data, code, msg=''):
        if not code:
            code = Utils.default_success_code if is_success else Utils.default_error_code
        return Response(
            json.dumps({'success': is_success, 'code': code, 'data': data, 'msg': msg}, cls=Encoder,
                       ensure_ascii=False),
            mimetype='application/json'
        )

    @staticmethod
    def beop_response_error(data=None, code='0', msg=''):
        if isinstance(data, Exception):
            logging.error(data)
            data = str(data)
        return Utils.beop_response(False, data, code, msg)

    @staticmethod
    def beop_response_success(data=None, code='1'):
        return Utils.beop_response(True, data, code)

    @staticmethod
    def get_now_full_str():
        return datetime.now().strftime(Utils.datetime_format_full)

    @staticmethod
    def get_now_date_str():
        return datetime.now().strftime(Utils.datetime_format_date)

    @staticmethod
    def get_now_time_str():
        return datetime.now().strftime(Utils.datetime_format_time)

    @staticmethod
    def get_object_id(object_id):
        if isinstance(object_id, ObjectId):
            return object_id
        else:
            if isinstance(object_id, str) and ObjectId.is_valid(object_id):
                return ObjectId(object_id)
            else:
                raise invalidObjectID('非法的id')

    @staticmethod
    def user_id_list_to_detail(user_id_list):
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
    def get_real_ip_from_request(request):
        if not request or not request.headers:
            return None
        if not request.headers.getlist("X-Forwarded-For"):
            return request.remote_addr
        else:
            return request.headers.getlist("X-Forwarded-For")[0]

    @staticmethod
    def get_pdf_cover_temp_path():
        return Utils.TMP_PDF_COVER_FILE_PATH + str(uuid.uuid4()) + '.html'

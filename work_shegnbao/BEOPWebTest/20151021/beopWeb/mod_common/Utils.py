__author__ = 'liqian'
from flask import jsonify
from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from flask.ext.mail import Mail, Message, Attachment
from flask import render_template
from beopWeb import app
import logging
import imghdr


class Utils:
    default_error_code = '0'
    default_success_code = '1'
    image_type = ['rgb', 'gif', 'pbm', 'pgm', 'ppm', 'tiff', 'rast', 'xbm', 'jpeg', 'bmp', 'png']
    datetime_format_full = '%Y-%m-%d %H:%M:%S'
    datetime_format_date = '%Y-%m-%d'
    IMG_SERVER_DOMAIN = 'http://images.rnbtech.com.hk'
    OSS_HOST = 'oss.aliyuncs.com'
    OSS_ACCESS_ID = 'iIDKdO6hyMbZVYzp'
    OSS_SECRET_ACCESS_KEY = 'YFiyioy9kgizMChIfHMWtVvNnvsjVM'

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
        def query(self, db_name, table, fields=(), where=None, order=None, limit=None):
            if not fields:
                raise Exception('select fields is empty')
            if isinstance(fields, str):
                fields = fields.split(',')
            if isinstance(fields, list) or isinstance(fields, tuple):
                query = ','.join(fields)
            else:
                raise Exception('select fields must be list or str')
            sql = 'SELECT %s FROM %s' % (query, table)

            if where:
                if isinstance(where, dict):
                    where = ('=%s and '.join(where.keys()) + '=%s ', list(where.values()))
                if len(where) > 0:
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
            return self.db.op_db_update_with_id(db_name, table, sql, list(data.values()))

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
        def send_invitation_email(recipients, token, inviter_name, inviter_email):
            link = 'http://' + app.config.get('SITE_DOMAIN') + '/invite_to_register/' + token
            config = {
                'subject': 'invitation from beop',
                'company_name': 'beop',
                'activate_link': link,
                'intro_link': 'http://beop.rnbtech.com.hk',
                'inviter_name': inviter_name,
                'inviter_email': inviter_email or ""
            }
            html = render_template('email/invitationEmail.html', configMap=config)
            return Utils.EmailTool.send_email(config.get('subject'), recipients, html)

        @staticmethod
        def send_email(subject, recipients, html, sender=None, attachment_list=None):
            if not isinstance(recipients, (list,)):
                recipients = recipients.split(';')
            try:
                if sender is None:
                    sender = app.config['MAIL_DEFAULT_SENDER']
                msg = Message(subject=subject, recipients=recipients, charset='utf-8', html=html, sender=sender)
                if attachment_list:
                    for attachment_item in attachment_list:
                        msg.attach(filename=attachment_item.get('filename', 'attachment'),
                                   content_type=attachment_item.get('content_type ', 'text/html'),
                                   data=attachment_item.get('data').encode('utf-8'))
                Mail(app).send(msg)
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
        return jsonify(success=is_success, code=code, data=data, msg=msg)

    @staticmethod
    def beop_response_error(data=None, code='0', msg=''):
        return Utils.beop_response(False, data, code, msg)

    @staticmethod
    def beop_response_success(data=None, code='1'):
        return Utils.beop_response(True, data, code)

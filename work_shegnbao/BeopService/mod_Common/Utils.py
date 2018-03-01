__author__ = 'David'

from flask import jsonify, render_template
from flask.ext.mail import Mail, Message
from mod_DataAccess.BEOPMySqlDBContainer import *
import imghdr, sys, inspect
from math import ceil,floor
from datetime import timedelta, datetime


class Utils:
    default_error_code = '0'
    default_success_code = '1'
    image_type = ['rgb', 'gif', 'pbm', 'pgm', 'ppm', 'tiff', 'rast', 'xbm', 'jpeg', 'bmp', 'png']

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

        # �������� ("books",["id", "name", "year"], ("year > %s and price < 15", [year, 12.99]), ["year", "DESC"], [0, 10])
        # table: books
        # fields: ["id", "name", "year"] or 'id,name,year'
        # where: ("year > %s and price < %s", [2015, 15]) ���� {'year':'2012','price':15} -> 'year=2012 and price=15'
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

        def query_one(self, db_name, table, fields=(), where=None, order=None, limit=None):
            rv = self.query(db_name, table, fields, where, order, limit)
            return rv[0] if rv else None

        def insert(self, db_name, table, data):
            query = self._serialize_insert(data)
            sql = "INSERT INTO %s (%s) VALUES(%s)" % (table, query[0], query[1])
            return self.db.op_db_update(db_name, sql, list(data.values()))

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
                                        list(data.values()) + where[1] if where and len(where) > 1 else data.values())

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
        def send_email(subject, recipients, html, sender=None):
            if not isinstance(recipients, (list,)):
                recipients = recipients.split(';')
            try:
                if sender is None:
                    sender = app.config['MAIL_DEFAULT_SENDER']
                Mail(app).send(
                    Message(subject=subject, recipients=recipients, charset='utf-8', html=html, sender=sender))
                return True
            except Exception as e:
                app.logger.error(e)
                return False

    class TimeTool:
        @staticmethod
        def trimTime(pointTime, timeFormat):
            rtTime = None
            if timeFormat == 'm1':
                rtTime = pointTime.replace(second=0)
            elif timeFormat == 'm5':
                rtTime = pointTime.replace(second=0)
                nMinute = rtTime.minute
                nFormatMinute = int(5 * (floor(nMinute / 5)))
                if nFormatMinute >= 60:
                    rtTime = rtTime + timedelta(hours=1)
                    rtTime = rtTime.replace(minute=0)
                else:
                    rtTime = rtTime.replace(minute=nFormatMinute)
            elif timeFormat == 'h1':
                rtTime = pointTime.replace(second=0)
                rtTime = rtTime.replace(minute=0)
            elif timeFormat == 'd1':
                rtTime = pointTime.replace(second=0)
                rtTime = rtTime.replace(minute=0)
                rtTime = rtTime.replace(hour=0)
            elif timeFormat == 'M1':
                rtTime = pointTime.replace(second=0)
                rtTime = rtTime.replace(minute=0)
                rtTime = rtTime.replace(hour=0)
                rtTime = rtTime.replace(day=1)
            return rtTime

    @staticmethod
    def is_image(filename, h, image_type_list=None):
        file_type = imghdr.what(filename, h)
        return file_type in image_type_list if image_type_list else file_type in Utils.image_type

    @staticmethod
    def beop_response(is_success, data, code):
        if not code:
            code = Utils.default_success_code if is_success else Utils.default_error_code
        return jsonify(success=is_success, code=code, data=data)

    @staticmethod
    def beop_response_error(data=None, code='0'):
        return Utils.beop_response(False, data, code)

    @staticmethod
    def beop_response_success(data=None, code='1'):
        return Utils.beop_response(True, data, code)

    @staticmethod
    def get_timepoint_count(strTimeFrom, strTimeTo, timeFormat):
        nPointCount = 0
        try:
            startObj = datetime.strptime(strTimeFrom, '%Y-%m-%d %H:%M:%S')
            endObj = datetime.strptime(strTimeTo, '%Y-%m-%d %H:%M:%S')
            span = 0
            if timeFormat == 'm1':
                span = timedelta(minutes=1).total_seconds()
            elif timeFormat == 'm5':
                span = timedelta(minutes=5).total_seconds()
            elif timeFormat == 'h1':
                span = timedelta(hours=1).total_seconds()
            elif timeFormat == 'd1':
                span = timedelta(days=1).total_seconds()
            if span == 0:
                return 0
            total_span = (endObj - startObj).total_seconds()
            nPointCount = floor(total_span / span)
        except Exception:
            logging.error('Failed to get timepoinit count for strTimeFrom=%s, strTimeTo=%s, timeFormat=%s',
                          strTimeFrom, strTimeTo, timeFormat, exc_info=True, stack_info=True)
            return 0
        return nPointCount

    @staticmethod
    def getTimeType(tTime):
        if tTime is None:
            return -1
        if isinstance(tTime, datetime):
            if tTime.month==1 and tTime.day==1 and tTime.hour==0 and tTime.minute==0 and tTime.second==0:
                return 5 #month
            elif tTime.day==1 and tTime.hour==0 and tTime.minute==0 and tTime.second==0:
                return 4
            elif tTime.hour==0 and tTime.minute==0 and tTime.second==0:
                return 3
            elif tTime.minute==0 and tTime.second==0:
                return 2
            elif tTime.second==0:
                return 1
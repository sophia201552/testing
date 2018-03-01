# -*- coding: UTF-8 -*-
"""
Routes and views for the flask application.
"""

import hashlib
import base64
import threading
import time
import logging
import calendar

from flask import render_template
from werkzeug.security import generate_password_hash, check_password_hash
from numpy import *
from flask_mail import Mail, Message

from beopWeb.BEOPMySqlDBContainer import *
from beopWeb.BEOPMySqlDBReadOnlyContainer import *
from beopWeb.BEOPMongoDataAccess import *
from beopWeb.BEOPSqliteAccess import *
from beopWeb.mod_admin.User import User
from beopWeb.mod_oss.ossapi import OssAPI
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_memcache.RedisManager import RedisManager

from beopWeb.mod_common.Exceptions import NamePwdFailed, AccountExpired
from beopWeb.mod_common.Constants import Constants
from beopWeb.mod_admin.roleGroupUser import RoleGroupUser

g_leapMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
g_NonLeapMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
# tables
g_warning_config = 'warning_config'
g_warning_record = 'warningrd_'


def isLeap(nYear):
    return (nYear % 4 == 0 and nYear % 100 != 0) or (nYear % 400 == 0)


class BEOPDataAccess:
    __instance = None
    _mysqlDBContainer = BEOPMySqlDBContainer()
    _mysqlDBContainerReadOnly = BEOPMySqlDBReadOnlyContainer()
    _projectInfoList = []
    _projectLocateMap = {}
    _lockProjectInfo = threading.Lock()
    _lockLocateMap = threading.Lock()

    def __init__(self):
        pass

    @classmethod
    def getInstance(self):
        if (self.__instance == None):
            self.__instance = BEOPDataAccess()
        return self.__instance

    def getProjS3db(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['s3dbname']
            else:
                dbname = app.config.get('DATABASE')
                q = ('select s3dbname, mysqlname, name_en, collectionname from project where id=%s')
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (id,))
                if dbrv == None or len(dbrv) < 1:
                    rt = None
                else:
                    pInfoList = RedisManager.get_project_info_list()
                    projectInfoList = pInfoList if pInfoList != None else []
                    projectInfoList.append(dict(name_en=dbrv[0][2], s3dbname=dbrv[0][0], mysqlname=dbrv[0][1], id=id,
                                                collectionname=dbrv[0][3]))
                    RedisManager.set_project_info_list( projectInfoList)
                    rt = dbrv[0][0]
        except Exception as e:
            print(e.__str__())
            logging.error('getProjS3db error:' + e.__str__())
        return rt

    def sendmail(self, reciepents, title, body=None):
        print('sendmail')
        msg1 = Message(title, reciepents)
        msg1.body = body.encode('utf-8')
        msg1.charset = 'utf-8'
        try:
            self.mail = Mail(app)
            self.mail.send(msg1)
            rv = 'success'
        except Exception as e:
            rv = 'error: sending mail failed. {}'.format(e)
            print(rv)
            logging.error(rv)
        return rv

    def sendInvitationEmail(self, recipients, link, hname, email):
        configMap = {
            'subject': 'invitation from beop',
            'company_name': 'beop',
            'activate_link': link,
            'intro_link': 'http://beop.rnbtech.com.hk',
            'inviter_name': hname,
            'inviter_email': email or ""

        }
        html = render_template('email/invitationEmail.html', configMap=configMap)
        if not isinstance(recipients, (list,)):
            recipients = recipients.split(';')
        try:
            Mail(app).send(Message(subject=configMap['subject'], recipients=recipients, charset='utf-8', html=html))
            rv = 'success'
        except Exception as e:
            rv = 'error: sending mail failed. {}'.format(e)
            print(rv)
            logging.error(rv)
        return rv

    def sendApplyForRegistrationEmail(self, recipients, link):
        configMap = {
            'subject': 'registration',
            'company_name': 'beop',
            'activate_link': link,
            'intro_link': 'http://beop.rnbtech.com.hk'

        }
        html = render_template('email/registrationEmail.html', configMap=configMap)
        if not isinstance(recipients, (list,)):
            recipients = recipients.split(';')
        try:
            Mail(app).send(Message(subject=configMap['subject'], recipients=recipients, charset='utf-8', html=html))
            rv = json.dumps({'status': 0, 'msg': 'mail send success.'})
        except Exception as e:
            rv = json.dumps({'status': -3, 'msg': 'sending mail failed. {}'.format(e)})
            print(rv)
            logging.error(rv)
        return rv

    def padData(self, data, timeStart, timeEnd, timeFormat):
        rv = []
        tS = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        tE = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        if len(data) > 0:
            r = data[0].get('record')
            if r:
                t0 = datetime.strptime(r[0].get('time'), '%Y-%m-%d %H:%M:%S')
                tS = t0 if (t0 - tS).total_seconds() < 0 else tS
                if tE >= tS:
                    if timeFormat == 's5':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 5) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = floor((t - tS).total_seconds() / 5)
                                    if s < l:
                                        tv[s] = t
                                        vv[s] = i.get('value')
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(seconds=5)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(seconds=5)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'm1':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 1 / 60) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = floor((t - tS).total_seconds() / 1 / 60)
                                    if s < l:
                                        tv[s] = t
                                        vv[s] = i.get('value')
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(seconds=60 * 1)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(seconds=60 * 1)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'm5':
                        ts = tS
                        te = tE
                        l = (int)(floor((te - ts).total_seconds() / 5 / 60) + 1)
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    sTemp = (int16)(floor((t - tS).total_seconds() / 5 / 60))
                                    if sTemp < l:
                                        tv[sTemp] = t
                                        vv[sTemp] = i.get('value')
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(seconds=60 * 5)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(seconds=60 * 5)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'h1':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 60 / 60) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = floor((t - tS).total_seconds() / 60 / 60)
                                    if s < l:
                                        tv[s] = t
                                        vv[s] = i.get('value')
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(seconds=60 * 60)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(seconds=60 * 60)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'd1':
                        ts = tS
                        te = tE
                        l = (te - ts).days + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = (t - tS).days
                                    if s < l:
                                        tv[s] = t
                                        vv[s] = i.get('value')
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(1)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(1)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'M1':
                        ts = tS
                        te = tE
                        l = (te.year - ts.year) * 12 + (te.month - ts.month) + 1
                        # l = (te - ts).days/30 + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = (t.year - tS.year) * 12 + (t.month - tS.month)
                                    if s < l:
                                        tv[s] = t
                                        vv[s] = i.get('value')
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        if tv[i - 1].month >= 1 and tv[i - 1].month <= 11:
                                            if isLeap(tv[i - 1].year):
                                                nDays = g_leapMonth[tv[i - 1].month - 1]
                                            else:
                                                nDays = g_NonLeapMonth[tv[i - 1].month - 1]
                                        else:
                                            nDays = 31
                                        tv[i] = tv[i - 1] + timedelta(nDays)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    nDay = 30
                                    if tv[i].month >= 2 and tv[i].month <= 12:
                                        if isLeap(tv[i].year):
                                            nDays = g_leapMonth[tv[i].month - 2]
                                        else:
                                            nDays = g_NonLeapMonth[tv[i].month - 2]
                                    else:
                                        nDays = 31
                                    tv[i - 1] = tv[i] - timedelta(nDays)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                else:
                    for item in data:
                        temp = []
                        if len(item.get('record')) == 1:
                            temp.append(
                                    dict(time=item.get('record')[0].get('time'), value=str(item.get('record')[0].get('value')),
                                         error=False))
                        else:
                            temp.append(dict(time=timeStart, value=str(0), error=True))
                        rv.append(dict(name=item.get('pointname'), record=temp))
                # print('padData end')
        return rv

    def padDataFloat(self, data, timeStart, timeEnd, timeFormat):
        # print('padData start')
        rv = []
        tS = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        tE = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        if len(data) > 0:
            r = data[0].get('record')
            if r:
                t0 = datetime.strptime(r[0].get('time'), '%Y-%m-%d %H:%M:%S')
                tS = t0 if (t0 - tS).total_seconds() < 0 else tS
                if tE >= tS:
                    if timeFormat == 's5':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 5) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = floor((t - tS).total_seconds() / 5)
                                    if s < l:
                                        tv[s] = t
                                        try:
                                            vv[s] = float(i.get('value'))
                                        except Exception as e:
                                            vv[s] = 0.0
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(seconds=5)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(seconds=5)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'm1':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 1 / 60) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = floor((t - tS).total_seconds() / 1 / 60)
                                    if s < l:
                                        tv[s] = t
                                        try:
                                            vv[s] =  float(i.get('value'))
                                        except Exception as e:
                                            vv[s] = 0.0
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(seconds=60 * 1)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(seconds=60 * 1)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'm5':
                        ts = tS
                        te = tE
                        l = (int16)(floor((te - ts).total_seconds() / 5 / 60) + 1)
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    sTemp = (int16)(floor((t - tS).total_seconds() / 5 / 60))
                                    if sTemp < l:
                                        tv[sTemp] = t
                                        try:
                                            vv[sTemp] =  float(i.get('value'))
                                        except Exception as e:
                                            vv[sTemp] = 0.0
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(seconds=60 * 5)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(seconds=60 * 5)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'h1':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 60 / 60) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = floor((t - tS).total_seconds() / 60 / 60)
                                    if s < l:
                                        tv[s] = t
                                        try:
                                            vv[s] = float(i.get('value'))
                                        except Exception as e:
                                            vv[s] = 0.0
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(seconds=60 * 60)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(seconds=60 * 60)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'd1':
                        ts = tS
                        te = tE
                        l = (te - ts).days + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = (t - tS).days
                                    if s < l:
                                        tv[s] = t
                                        try:
                                            vv[s] = float(i.get('value'))
                                        except Exception as e:
                                            vv[s] = 0.0
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        tv[i] = tv[i - 1] + timedelta(1)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    tv[i - 1] = tv[i] - timedelta(1)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'M1':
                        ts = tS
                        te = tE
                        l = (te.year - ts.year) * 12 + (te.month - ts.month) + 1
                        # l = (te - ts).days/30 + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            for i in data[index].get('record'):
                                t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                if (t - te).total_seconds() <= 0:
                                    s = (t.year - tS.year) * 12 + (t.month - tS.month)
                                    if s < l:
                                        tv[s] = t
                                        try:
                                            vv[s] = float(i.get('value'))
                                        except Exception as e:
                                            vv[s] = 0.0
                            for i in range(1, l):
                                if tv[i] is None:
                                    if tv[i - 1] is not None:
                                        if tv[i - 1].month >= 1 and tv[i - 1].month <= 11:
                                            if isLeap(tv[i - 1].year):
                                                nDays = g_leapMonth[tv[i - 1].month - 1]
                                            else:
                                                nDays = g_NonLeapMonth[tv[i - 1].month - 1]
                                        else:
                                            nDays = 31
                                        tv[i] = tv[i - 1] + timedelta(nDays)
                                        vv[i] = vv[i - 1]
                                        ev[i] = True
                            for i in range(l - 1, 0, -1):
                                if tv[i - 1] is None:
                                    nDay = 30
                                    if tv[i].month >= 2 and tv[i].month <= 12:
                                        if isLeap(tv[i].year):
                                            nDays = g_leapMonth[tv[i].month - 2]
                                        else:
                                            nDays = g_NonLeapMonth[tv[i].month - 2]
                                    else:
                                        nDays = 31
                                    tv[i - 1] = tv[i] - timedelta(nDays)
                                    vv[i - 1] = vv[i]
                                    ev[i - 1] = True
                            for x in range(l):
                                temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S') if tv[x] is not None else None, value=vv[x], error=ev[x]))
                            rv.append(dict(name=data[index].get('pointname'), record=temp))
                else:
                    for item in data:
                        temp = []
                        if len(item.get('record')) == 1:
                            try:
                                temp.append(dict(time=item.get('record')[0].get('time'),
                                                 value=float(item.get('record')[0].get('value')), error=False))
                            except Exception as e:
                                temp.append(dict(time=item.get('record')[0].get('time'), value=0.0, error=False))
                                print('padDataFloat error: ' + e.__str__())
                                logging.error('padDataFloat error: ' + e.__str__())
                        else:
                            temp.append(dict(time=timeStart, value=0.0, error=True))
                        rv.append(dict(name=item.get('pointname'), record=temp))
        # print('padData end')
        return rv

    def getProjMysqldb(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['mysqlname']
            else:
                dbname = app.config.get('DATABASE')
                strQ = 'select mysqlname, name_en, s3dbname, collectionname from project where id=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (id,))
                if dbrv is None or len(dbrv) == 0:
                    rt = None
                elif len(dbrv[0]) == 0:
                    rt = None
                else:
                    projectInfoList = RedisManager.get_project_info_list()
                    projectInfoList.append(dict(name_en=dbrv[0][1], s3dbname=dbrv[0][2], mysqlname=dbrv[0][0], id=id,
                                                collectionname=dbrv[0][3]))
                    RedisManager.set_project_info_list( projectInfoList)
                    rt = dbrv[0][0]
        except Exception as e:
            print(e.__str__())
            logging.error('getProjMysqldb error:' + e.__str__())
        return rt

    def getProjIdByName(self, name_en):
        rt = None
        try:
            ret = self.findProjectInfoItemByNameEn(name_en)
            if ret:
                rt = ret['id']
            else:
                dbname = app.config.get('DATABASE')
                strQ = 'select mysqlname, id, s3dbname, collectionname from project where name_en=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (name_en,))
                if dbrv is None or len(dbrv) == 0:
                    rt = None
                elif len(dbrv[0]) == 0:
                    rt = None
                else:
                    pInfoList = RedisManager.get_project_info_list()
                    projectInfoList = pInfoList if pInfoList!= None else []
                    projectInfoList.append(
                            dict(name_en=name_en, id=dbrv[0][1], s3dbname=dbrv[0][2], mysqlname=dbrv[0][0],
                                 collectionname=[0][3]))
                    RedisManager.set_project_info_list( projectInfoList)
                    rt = dbrv[0][1]
        except Exception as e:
            print(e.__str__())
            logging.error('getProjIdByName error:' + e.__str__())
        return rt

    def getProjNameById(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['name_en']
            else:
                dbname = app.config.get('DATABASE')
                strQ = 'select name_en, s3dbname,mysqlname,collectionname from project where id=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (id,))
                if len(dbrv) == 0:
                    rt = None
                elif len(dbrv[0]) == 0:
                    rt = None
                else:
                    pInfoList = RedisManager.get_project_info_list()
                    projectInfoList = pInfoList if pInfoList!= None else []
                    projectInfoList.append(dict(name_en=dbrv[0][0], s3dbname=dbrv[0][1], mysqlname=dbrv[0][2], id=id,
                                                collectionname=dbrv[0][3]))
                    RedisManager.set_project_info_list( projectInfoList)
                    rt = dbrv[0][0]
        except Exception as e:
            print(e.__str__())
            logging.error('getProjNameById error:' + e.__str__())
        return rt

    def updateProjectUnitsystem(self,id,unit_currency,unit_system):
        dbname = app.config['DATABASE']
        q = 'update project set unit_currency = %s, unit_system = %s where id = %s'
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, (unit_currency,unit_system, id))
        if bSuccess:
            return 'success'  
        else:
            return 'error: manipulating database failed'

    def findProjectInfoItemById(self, id):
        try:
            projectInfoList = RedisManager.get_project_info_list()
            if projectInfoList is None or type(projectInfoList) is not list:
                return None
            for item in projectInfoList:
                if item['id'] == id:
                    return item
        except Exception as e:
            print(e.__str__())
            logging.error('findProjectInfoItemById error:' + e.__str__())
        return None

    def getCollectionNameById(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['collectionname']
            else:
                dbname = app.config.get('DATABASE')
                strQ = 'select name_en, s3dbname,mysqlname,collectionname from project where id=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (id,))
                if len(dbrv) == 0:
                    rt = None
                elif len(dbrv[0]) == 0:
                    rt = None
                else:
                    pInfoList = RedisManager.get_project_info_list()
                    projectInfoList = pInfoList if pInfoList!= None else []
                    projectInfoList.append(dict(name_en=dbrv[0][0], s3dbname=dbrv[0][1], mysqlname=dbrv[0][2], id=id,
                                                collectionname=dbrv[0][3]))
                    RedisManager.set_project_info_list(projectInfoList)
                    rt = dbrv[0][3]
        except Exception as e:
            print(e.__str__())
            logging.error('getCollectionNameById error:' + e.__str__())
        return rt

    def findProjectInfoItemByNameEn(self, name_en):
        try:
            projectInfoList = RedisManager.get_project_info_list()
            if projectInfoList is None or type(projectInfoList) is not list:
                return None
            for index, item in enumerate(projectInfoList):
                if item['name_en'] == name_en:
                    return item
        except Exception as e:
            print(e.__str__())
            logging.error('findProjectInfoItemByNameEn error:' + e.__str__())
        return None

    def findProjectInfoByNameEn(self, name_en):
        rt = -1
        try:
            projectInfoList = RedisManager.get_project_info_list()
            if projectInfoList is None or type(projectInfoList) is not list:
                projectInfoList = []
            for index, item in enumerate(projectInfoList):
                if item['name_en'] == name_en:
                    rt = index
                    break
        except Exception as e:
            print(e.__str__())
            logging.error('findProjectInfoByNameEn error:' + e.__str__())
        return rt

    def findProjectInfoById(self, id):
        rt = -1
        try:
            projectInfoList = RedisManager.get_project_info_list()
            if projectInfoList is None or type(projectInfoList) is not list:
                projectInfoList = []
            for index, item in enumerate(projectInfoList):
                if item['id'] == id:
                    rt = index
                    break
        except Exception as e:
            print(e.__str__())
            logging.error('findProjectInfoById error:' + e.__str__())
        return rt

    def getProjMysqldbByName(self, name_en):
        rt = None
        try:
            ret = self.findProjectInfoItemByNameEn(name_en)
            if ret:
                rt = ret['mysqlname']
            else:
                dbname = app.config.get('DATABASE')
                strQ = 'select s3dbname, mysqlname, id, collectionname from project where name_en=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (name_en,))
                if len(dbrv) == 0:
                    return None
                elif len(dbrv[0]) == 0:
                    return None
                else:
                    projectInfoList = RedisManager.get_project_info_list()
                    if projectInfoList is None:
                        projectInfoList = []
                    projectInfoList.append(
                            dict(name_en=name_en, s3dbname=dbrv[0][0], mysqlname=dbrv[0][1], id=dbrv[0][2],
                                 collectionname=dbrv[0][3]))
                    RedisManager.set_project_info_list(projectInfoList)
                    rt = dbrv[0][1]
        except Exception as e:
            print(e.__str__())
            logging.error('getProjMysqldbByName error:' + e.__str__())
        return rt

    def make_db_query_insert(self, data):
        field_str = list()
        value_str = list()
        for key, val in data.items():
            if val:
                field_str.append(key)
                value_str.append(val)
        rv = '({0}) values ({1})'.format(','.join(field_str), ','.join('"{0}"'.format(x) for x in value_str))
        return rv

    def make_db_query_update(self, cond, data):
        cond_str = ' and '.join('{0}="{1}"'.format(key, val) for key, val in cond.items() if val)
        value_str = ','.join('{0}="{1}"'.format(key, val) for key, val in data.items() if val)
        assert value_str
        rv = 'set {0}{1}'.format(value_str, ' where {0}'.format(cond_str) if cond_str else '')
        return rv

    def getProjectTableNameList(self):
        # print('getProject')
        dbname = app.config['DATABASE']
        strQ = 'select mysqlname from project'
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, ())
        return [x[0] for x in rv]

    def getProject(self, user_id, project_code=None,requestType=0):
        # print('getProject')
        dbname = app.config['DATABASE']
        rv = []
        sql = '''select p.id, p.name_en, p.name_cn, p.latlng, p.address,p.name_english,p.pic, dtu.online,dtu.LastReceivedTime, p.is_advance, p.logo, dtu3.dtuname, ufp.user_id, p.time_format, p.is_diag, p.arrDp, p.unit_system, p.unit_currency
              from (select distinct userId, projectId projid from user_role ur left join role_project rp on ur.roleid = rp.id) as rp left join project as p on p.id = rp.projid
              left join (select dtp.projectid, dpi.online, dpi.LastReceivedTime from dtusert_to_project dtp left join dtuserver_prj_info dpi on dtp.dtuprojectid = dpi.id) dtu
              on dtu.projectid = rp.projid
              left join (select dp.dtuname, dtp2.projectid from dtusert_to_project dtp2 left join dtuserver_prj dp on dtp2.dtuprojectid = dp.id) dtu3 on dtu3.projectid = rp.projid
              left join user_favorite_project ufp on ufp.project_id = rp.projid and ufp.user_id = %s
              where rp.userid = %s and p.is_delete = 0'''

        if project_code:
            sql += ' and p.name_en = %s'
            rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (user_id, user_id, project_code))
        else:
            rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (user_id, user_id))
        idset = set()
        rv_new = []
        for item in rv:
            if item[0] not in idset:
                idset.add(item[0])
                rv_new.append(item)

        if requestType == 1:
            return [dict(id=x[0], name_en=x[1], name_cn=x[2], latlng=x[3], address=x[4], name_english=x[5], pic=x[6],
                     online=x[7], lastReceivedTime=x[8], isAdvance=x[9], logo=x[10], datadb=x[11], isFavorite=x[12], time_format=x[13], is_diag=x[14],arrDp=x[15],unit_system=x[16],unit_currency=x[17]) for
                x in rv_new]
        else :
            return [dict(id=x[0], name_en=x[1], name_cn=x[2], latlng=x[3], address=x[4], name_english=x[5], pic=x[6],
                     online=x[7], lastReceivedTime=x[8], isAdvance=x[9], logo=x[10], datadb=x[11], isFavorite=x[12], time_format=x[13], is_diag=x[14],unit_system=x[16],unit_currency=x[17]) for
                x in rv_new]

    def get_project_status(self, login):
        dbname = app.config['DATABASE']
        sql = '''select p.id, dtu.online,dtu.LastReceivedTime
              from (select distinct userId, projectId projid from user_role ur left join role_project rp on ur.roleid = rp.id) as rp left join project as p on p.id = rp.projid
              left join (select p.id, dpi.online, dpi.LastReceivedTime from project p, dtuserver_prj dp, dtuserver_prj_info dpi where p.mysqlname = dp.dbname and dpi.id = dp.id) dtu
              on dtu.id = rp.projid
              where rp.userid = %s'''
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (login,))
        return [dict(id=x[0], online=x[1], lastReceivedTime=x[2]) for x in rv]

    def createMysqlTable(self, rtTableName):
        print('createProjMysql Table')
        dbname = app.config.get('DATABASE')
        strQ = 'create table if not exists %s(pointname varchar(64), pointvalue varchar(256), primary key(pointname))' % rtTableName
        self._mysqlDBContainer.op_db_update(dbname, strQ, ())
        return None

    def getInputTable(self, projName):
        # print('getInputTable')
        rtTableName = self.getProjMysqldbByName(projName)
        dbname = app.config['DATABASE']
        q = 'select time, pointname, pointvalue, flag from rtdata_%s' % rtTableName
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
        return rvQuery

    def add_pwhash(self, id, userPwd):
        print('add_pwhash')
        dbname = app.config['DATABASE']

        pwhash = generate_password_hash(userPwd)
        q = 'update user set unitproperty01 = %s where id = %s'
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, (pwhash, id))
        if bSuccess:
            return 'success'
        else:
            return 'error: manipulating database failed'

    def checkTableExist(self, dbname, tableName):
        q = 'show tables like %s'
        rvQuery = self._mysqlDBContainer.op_db_query(dbname, q, (tableName,))
        if rvQuery is None:
            return 'failed'
        if len(rvQuery) > 0:
            rv = True
        else:
            rv = False
        return rv

    def appendOutputToSiteTable(self, projectId, pointname, pointvalue):

        dbname = app.config['DATABASE']

        q = 'delete from `realtimedata_output_to_site` where projectid = %s and pointname = %s'
        bSuccess1 = self._mysqlDBContainer.op_db_update(dbname, q, (projectId, pointname))
        q = 'insert into `realtimedata_output_to_site` (`time`, projectid, pointname,pointvalue) values (NOW(),%s, %s,%s)'
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, (projectId, pointname, pointvalue))
        return bSuccess

    def appendOperationLog(self, dbname, pointname, originalValue, updatedValue):
        # print('appendOperationLog')
        user = 'beopws'
        optRemark = 'update point %s: %s -> %s' % (pointname, originalValue, updatedValue)
        q = 'insert into `%s`' % (app.config['TABLE_OP']) + ' (user,OptRemark) values (%s, %s)'
        return self._mysqlDBContainer.op_db_update(dbname, q, (user, optRemark))

    def appendLog(self, dbname, pointname, originalValue, updatedValue):
        print('appendLog')
        time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        tableName = datetime.today().strftime('log_%Y_%m_%d')
        if self.checkTableExist(dbname, tableName):
            info = '[beopws]update point %s: %s -> %s' % (pointname, originalValue, updatedValue)
            q = 'insert into `%s`' % tableName + ' values (%s, %s)'
            return self._mysqlDBContainer.op_db_update(dbname, q, (time, info))
        return 'failed'

    def readOperationLog(self, dbname, timeStart, timeEnd):
        print('readOperationLog')
        user = 'beopws'
        q = 'select * from %s' % app.config['TABLE_OP'] + ' where RecordTime>%s and RecordTime<%s'
        rvQuery = self._mysqlDBContainer.op_db_query(dbname, q, (timeStart, timeEnd))
        return [dict(RecordTime=x[0].timestamp(), user=x[1], OptRemart=x[2]) for x in rvQuery]

    def resetPwd(self, data):
        print('resetPwd')
        id = data.get('id')
        pwd = data.get('oldPsw')
        newpwd = data.get('newPsw')

        hash = self.validate_user_byID(dict(id=id, pwd=pwd))
        if hash is None:
            res = {'status': False,
                   'error': 'invalid password'}
            return res

        dbname = app.config.get('DATABASE')
        q = 'update user set userpwd = %s where id = %s'
        if self._mysqlDBContainer.op_db_update(dbname, q, ('pleaseguess', id)):
            self.add_pwhash(id, newpwd)
            res = {'status': True,
                   'error': ''}
            return res
        else:
            res = {'status': False,
                   'error': 'update user failed'}
            return res

    def validate_user(self, login):
        tNow = datetime.now()
        strUserName = login.get('name')
        strInfo = 'user login: %s' % strUserName
        print(strInfo)
        logging.info(strInfo)
        dbname = app.config['DATABASE']
        q = 'select id, unitproperty01, expiryDate, userstatus from `user` where username=%s or usermobile=%s'
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (strUserName, strUserName))
        if rvQuery is None or len(rvQuery) < 1:
            strInfo = 'user not exist: %s' % strUserName
            print(strInfo)
            logging.info(strInfo)
            raise NamePwdFailed
        pwhash = rvQuery[0][1]
        expiry_date = rvQuery[0][2]
        userstatus = rvQuery[0][3]
        if expiry_date:
            if expiry_date < tNow.date():
                expired_sql = 'update user set userstatus="expired" where username=%s'
                self._mysqlDBContainer.op_db_update(dbname, expired_sql, (strUserName,))
                raise AccountExpired
        elif userstatus == 'expired':
            raise AccountExpired
        if not pwhash:
            raise NamePwdFailed
        if check_password_hash(pwhash, login.get('pwd')):
            strInfo = 'user %s login success, validate for %.1f seconds' % (
                strUserName, (datetime.now() - tNow).total_seconds())
            print(strInfo)
            logging.info(strInfo)
            return rvQuery[0][0]
        else:
            strInfo = 'user %s login failed, validate for %.1f seconds' % (strUserName, (datetime.now() - tNow).total_seconds())
            print(strInfo)
            logging.info(strInfo)
            raise NamePwdFailed

    def validate_user_byID(self, login):
        # print('get_user')
        dbname = app.config['DATABASE']
        q = 'select unitproperty01 from `user` where id =%s AND userstatus = "registered"'
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (login['id'],))
        if rvQuery is None or len(rvQuery) < 1:
            return None
        pwhash = rvQuery[0][0]
        if check_password_hash(pwhash, login.get('pwd')):
            return rvQuery[0][0]
        return None


    def validate_user_project_for_privateGarden(self, userId, targetId):
        dbname = app.config['DATABASE']
        strSQL = '''select distinct(projectId) from user_role as a 
            left join role_project as b on a.roleId = b.id 
            where projectId in ( 
                select projectId from user_role as a 
                left join role_project as b on a.roleId = b.id 
                where level = 30 and userid = %s 
            ) and level < 30 and userid = %s'''
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, strSQL, (userId, targetId))
        if len(rvQuery) > 0:
            strSQL = '''insert into op_privateGarden (time, userId, targetId) values (%s, %s, %s)'''
            if self._mysqlDBContainer.op_db_update(dbname, strSQL, (datetime.now().strftime('%Y-%m-%d %H:%M:%S'), userId, targetId)):
                return True
        return False

    def getUserNameById(self, userId):
        dbname = ('beopdoengine')
        q = ('select userfullname from user where id = %s')
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (userId,))
        if len(rv) == 0:
            return ''
        else:
            return rv[0][0]

    def getUserNameByIdOrEmail(self, userIdOrEmail):
        dbname = ('beopdoengine')
        q = ('select userfullname from user where id = %s')
        #q1 = ('select userfullname from user where useremail = %s')
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (userIdOrEmail,))
        if rv is None or len(rv) == 0:
            q1 = ('select userfullname from user where useremail = %s')
            rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q1, (userIdOrEmail,))
            if rv is None or len(rv) == 0:
                return ''
            else:
                return rv[0][0]
        return rv[0][0]

    def getUserProfileById(self, user_id):
        q = '''select username, userfullname, usersex,
                      usermobile, useremail, usercreatedt,
                      userstatus, userpic, isManager, userofrole
                from user
                where id = %s'''
        rv = self._mysqlDBContainerReadOnly.op_db_query(app.config['DATABASE'], q, (user_id,))
        if len(rv) == 0:
            return {}
        else:
            user = rv[0]
            return {'id': user_id, 'name': user[0], 'fullname': user[1], 'sex': user[2], 'core': user[3],
                    'email': user[4], 'createDate': user[5], 'status': user[6], 'picture': user[7],
                    'isManager': user[8], 'userOfRole': user[9]}

    def getUserProfileByUserName(self, user_name):
        q = 'select id, username, userfullname, usersex, usermobile, useremail, usercreatedt, userstatus, userpic from user where username = %s'
        rv = self._mysqlDBContainerReadOnly.op_db_query(app.config['DATABASE'], q, (user_name,))
        if len(rv) == 0:
            return {}
        else:
            user = rv[0]
            return {'id': user[0], 'name': user[1], 'fullname': user[2], 'sex': user[3], 'core': user[4],
                    'email': user[5], 'createDate': user[6], 'status': user[7], 'picture': user[8]}

    def getUserProfileByEmail(self, email):
        q = 'select id, username, userfullname, usersex, usermobile, usercreatedt, userstatus, userpic from user where useremail = %s'
        rv = self._mysqlDBContainerReadOnly.op_db_query(app.config['DATABASE'], q, (email,))
        if len(rv) == 0:
            return {}
        else:
            user = rv[0]
            return {'id': user[0], 'name': user[1], 'fullname': user[2], 'sex': user[3], 'core': user[4],
                    'email': email, 'createDate': user[5], 'status': user[6], 'picture': user[7]}

    def updateNoticeWithTransaction(self, db_name, notice_id, trans_id):
        if not db_name or notice_id is None or trans_id is None:
            return False
        sql = 'update %s_' % db_name + 'diagnosis_notices set OrderID=%s where ID=%s'
        return self._mysqlDBContainer.op_db_update('diagnosis', sql, (trans_id, notice_id))

    def createProject(self, name_en, name_cn, s3dbname, mysqlname, collectionname, latlng, address, name_english, userid, projImg, time_format,
                      weatheaStationId=0, is_advance=0, logo=None):
        dbname = app.config['DATABASE']
        sql = ('select max(id) from project')
        dbrv = self._mysqlDBContainer.op_db_query(dbname, sql, ())
        maxid = dbrv[0][0]
        newid = int(maxid) + 1
        imgStr = 'default.jpg'
        if projImg is not None:
            imgStr = projImg
        sql = '''insert into project(
                  id, name_en, name_cn, s3dbname, mysqlname, collectionname, update_time,
                  latlng, address, name_english, weather_station_id, pic, time_format,
                  is_advance, logo
              ) values
              (%s, %s, %s, %s, %s, %s, %s,
              %s, %s, %s, %s, %s, %s,
              %s, %s)'''
        if self._mysqlDBContainer.op_db_update(dbname, sql, (newid, name_en, name_cn, s3dbname, mysqlname,
                                                             collectionname, datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                                             latlng, address, name_english, weatheaStationId,
                                                             imgStr, time_format, is_advance, logo)):
            sql = ('select max(id) from role_project')
            dbrv = self._mysqlDBContainer.op_db_query(dbname, sql, ())
            maxid = dbrv[0][0]
            newRoleId = int(maxid) + 1
            sql = "insert into beopdoengine.role_project (id, roleName, projectId, level) values (%s, %s, %s, %s)"
            params = (newRoleId, 'pa', newid, 30)
            if self._mysqlDBContainer.op_db_update(dbname, sql, params):
                sql = 'insert into user_role(userid, roleid) values (%s, %s)'
                params = (userid, newRoleId)  # 1是sa
                self._mysqlDBContainer.op_db_update(dbname, sql, params)
                sql = 'insert into user_proj(userid, roleid, projid) values (%s, %s, %s)'
                params = (userid, 1, newid)
                # transAction 权限插入失败回滚
                if self._mysqlDBContainer.op_db_update(dbname, sql, params):
                    tStart = datetime.strptime('2014-01-01 00:00:00', '%Y-%m-%d %H:%M:%S')
                    plm = RedisManager.get_project_locate_map()
                    if plm:
                        mi = plm.get('mongoInstance')
                        for key in mi:
                            item = mi.get(key)
                            if item:
                                if item.get('writable') and item.get('is_default'):
                                    if self.InsertDefaultMonogoAdd(newid, key, tStart):
                                        return newid, newRoleId
                else:
                    return -2, None

            #创建缓存表
            self.createBufferTablesFromService(newid)
            self.replaceSiteDBToBuffer(newid, mysqlname)  # init db
            return newid, newRoleId
        else:
            return -1, None

    def editProject(self, default, new, projId, project_img, logo_img): #TODO
        # 建立project表的映射关系
        d = {
            'address': 'address',
            'historyDS': 'collectionname',
            'realTimeDS': 'mysqlname',
            'latlng': 'latlng',
            'projCode': 'name_en',
            'projDateFormat': 'time_format',
            'projNameEn': 'name_english',
            'projNameZh': 'name_cn',
            'isAdvance': 'is_advance'
        }

        # 获取修改后的字段
        temp = dict(default.items() & new.items())
        for key in temp.keys():
            new.pop(key)
        params = []
        sql = 'update project set '
        if new:
            for key, value in new.items():
                sql += "{}=%s, ".format(d[key])
                params.append(value)
        if project_img or logo_img:
            if project_img:
                sql += "pic=%s, "
                params.append(project_img)
            if logo_img:
                sql += "logo=%s, "
                params.append(logo_img)
        if params:
            sql = sql[:-2] + " where id=%s"
            params.append(projId)
            return self._mysqlDBContainer.op_db_update(app.config['DATABASE'], sql, params)
        return True

    def InsertDefaultMonogoAdd(self, projId, mongoServerId, startTime):
        dbname = app.config['DATABASE']
        q = 'insert into locate_map (proj_id,mongo_server_id,start_time,end_time)' + ' values(%s,%s,%s,%s)'

        start_time = startTime.strftime('%Y-%m-%d %H:%M:%S')
        endTime = startTime + timedelta(days=2000)
        end_time = endTime.strftime('%Y-%m-%d %H:%M:%S')
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, (projId, mongoServerId, start_time, end_time))
        return bSuccess

    def updateProject(self, projId, name_en, name_cn, latlng, address, name_english, projImg, time_format,
                      real_time_db_name=None, history_db_name=None, is_advance=0, logo_img=None):
        dbname = app.config['DATABASE']

        sql = "UPDATE project SET name_en=%s, name_cn=%s, latlng=%s, address=%s, is_advance=%s, name_english=%s, time_format=%s"
        params = [name_en, name_cn, latlng, address, is_advance, name_english, time_format]
        if projImg:
            sql += ",pic=%s "
            params.append(projImg)

        if logo_img:
            sql += ",logo=%s "
            params.append(logo_img)

        if real_time_db_name:
            sql += ",mysqlname=%s "
            params.append(real_time_db_name)

        if history_db_name:
            sql += ",collectionname=%s "
            params.append(history_db_name)

        sql += " WHERE id=%s"
        params.append(projId)

        return self._mysqlDBContainer.op_db_update(dbname, sql, params)

    def getProjectNameList(self):
        dbname = app.config.get('DATABASE')
        sql = ('select name_en, s3dbname, UNIX_TIMESTAMP(update_time) from project')
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())

        if dbrv is None or len(dbrv) == 0:
            return None

        return dbrv

    def getAdminProjectNameListByUser(self, user_id):
        sql = ('select name_en, s3dbname, UNIX_TIMESTAMP(update_time),name_cn '
               'from project p,user_proj up '
               'where p.id = up.projid and up.roleid in (0,1) and up.userid = %s')
        db_rv = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql, (user_id,))
        return db_rv

    def updateProjectUpdateTime(self, name, mtime):
        dbname = app.config['DATABASE']
        sql = 'update project set update_time=FROM_UNIXTIME(%f) where name_en="%s"' % (mtime, name)
        # no need use statement
        return self._mysqlDBContainer.op_db_update(dbname, sql, ())

    def add_member(self, userId, roleId, projectId):
        dbname = app.config['DATABASE']
        sql = 'select userid from user_proj where userid= %s and projid = %s'
        rv = self._mysqlDBContainer.op_db_query(dbname, sql, (userId, projectId))
        if len(rv) != 0:
            return 'data already exist'

        sql = 'insert into user_proj (userid, roleid, projid) values (%s, %s, %s)'
        return self._mysqlDBContainer.op_db_update(dbname, sql, (userId, roleId, projectId))

    def remove_member(self, userId, projectId):
        dbname = app.config['DATABASE']
        sql = 'select userid from user_proj where userid= %s and projid = %s'
        rv = self._mysqlDBContainer.op_db_query(dbname, sql, (userId, projectId))

        if len(rv) == 1:
            sql = 'delete from user_proj where userid= %s and projid = %s'
            return self._mysqlDBContainer.op_db_update(dbname, sql, (userId, projectId))
        else:
            raise Exception('data is not exist')

    def reset_level(self, memberId, roleId, projectId):
        dbname = app.config['DATABASE']
        sql = 'select userid from user_proj where userid= %s and projid = %s'
        rv = self._mysqlDBContainer.op_db_query(dbname, sql, (memberId, projectId))

        if len(rv) == 1:
            sql = 'update user_proj set roleid= %s where userid= %s and projid = %s'
            self._mysqlDBContainer.op_db_update(dbname, sql, (roleId, memberId, projectId))
            return 'reset level successfully'
        else:
            return ('data is not exist')

    def reset_password(self, rdata):
        dbname = app.config['DATABASE']

        user_id = rdata.get('id')
        user_password_pre = rdata.get('passwordPre')
        user_password_new = rdata.get('passwordNew')
        b_change_success = False
        sql = 'select id from user where id= %s and userpwd=%s"'
        rv = self._mysqlDBContainer.op_db_query(dbname, sql, (user_id, user_password_pre))

        if len(rv) == 1:
            sql = 'update user set userpwd=%s where id=%s and userpwd=%s'
            b_change_success = self._mysqlDBContainer.op_db_update(dbname, sql,
                                                                   ('pleaseguess', user_id, user_password_pre))
        dict = {'status': b_change_success}
        return json.dumps(dict)

    def get_details(self, userId):
        dbname = app.config['DATABASE']

        data = []
        sql = (
            'SELECT userid, roleid, projid FROM user_proj WHERE projid in (SELECT projid FROM user_proj WHERE userid = %s)')
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (userId,))
        listRole = []
        arrUserTemp = []
        arrProjTemp = []
        for item in rvQuery:
            listRole.append({'level': item[1], 'userId': item[0], 'projId': item[2]})
            userIdTemp = str(item[0])
            projIdTemp = str(item[2])
            if (userIdTemp not in arrUserTemp): arrUserTemp.append(userIdTemp)
            if (projIdTemp not in arrProjTemp): arrProjTemp.append(projIdTemp)

        sql = ('SELECT id, name_en, name_cn, update_time FROM project WHERE id IN (%s)') % ','.join(arrProjTemp)
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
        listProj = []
        for item in rvQuery:
            listProj.append({'id': item[0], 'name': item[1], 'description': item[2], 'updateTime': item[3].timestamp()})

        sql = "SELECT id, username, usermobile, useremail, userfullname, userstatus FROM `user` WHERE id IN (%s)" % ",".join(
                arrUserTemp)
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
        listMember = []
        for item in rvQuery:
            listMember.append(
                    {'id': item[0], 'name': item[1], 'phone': item[2], 'mail': item[3], 'userfullname': item[4], 'userstatus':item[5]})

        sql = 'SELECT id,name,name_cn From role ORDER BY id'
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
        levelList = []
        for item in rv:
            levelList.append({'id': item[0], 'name': item[1], 'name_cn': item[2]})

        return json.dumps({'projects': listProj, 'members': listMember, 'roles': listRole, 'levels': levelList})

    def reset_user_info(self, user_id, user_name, user_mail):
        dbname = app.config['DATABASE']
        b_reset_success = False
        sql = 'select id from user where id= %s'
        rvQuery = self._mysqlDBContainer.op_db_query(dbname, sql, (user_id,))
        if rvQuery is None or len(rvQuery) == 1:
            if user_name != None:
                sql = 'update user set username=%s where id=%s'
                b_reset_success = self._mysqlDBContainer.op_db_update(dbname, sql, (user_name, user_id))
            if user_mail != None:
                sql = 'update user set useremail=%s where id=%s'
                b_reset_success = self._mysqlDBContainer.op_db_update(dbname, sql, (user_mail, user_id))
        dict = {'status': b_reset_success}
        return json.dumps(dict)

    def forget_pass(self, userId):
        tmpStr = str(time.time()) + str(userId)
        hashcode = hashlib.sha1(tmpStr.encode(encoding='utf-8')).hexdigest()
        dbname = app.config['DATABASE']
        sql = 'select useremail from user where id= %s'
        dbrv = self._mysqlDBContainer.op_db_query(dbname, sql, (userId,))
        if len(dbrv) == 1:
            str_useremail = dbrv[0][0]
            sql = 'select userid from token where userid= %s'
            dbrv2 = self._mysqlDBContainer.op_db_query(dbname, sql, (userId,))
            if len(dbrv2) == 1:
                sql = 'update token set token=%s where userid=%s'
                self._mysqlDBContainer.op_db_update(dbname, sql, (str(hashcode), userId))
            else:
                sql = 'insert into token(userid,token,type) values(%s,%s,%s)'
                self._mysqlDBContainer.op_db_update(dbname, sql, (userId, str(hashcode), 0))
            if str_useremail != None:
                self.sendmail([str(str_useremail), 'forget password', str(hashcode)])

    def isInvitationEmailSent(self, email):
        q = 'select count(*) from user u where u.useremail = %s'
        rv = self._mysqlDBContainerReadOnly.op_db_query(app.config['DATABASE'], q, (email,))
        return rv[0][0] > 0

    def isResetEmailSent(self, email):
        q = 'select count(*) from user u, token t where u.useremail = %s and u.id = t.userid and t.type = 1'
        rv = self._mysqlDBContainerReadOnly.op_db_query(app.config['DATABASE'], q, (email,))
        return rv[0][0] > 0

    def simplifyUserNameFromEmail(self, email):
        if email.find('@') == -1:
            return email
        else:
            return email[:email.find('@')]

    def updateInvitationEmailStatus(self, mail, project_id, project_level):
        db_name = app.config['DATABASE']
        q = 'insert into user (username, useremail, userstatus, userfullname) values (%s, %s, "invited", %s)'
        self._mysqlDBContainer.op_db_update(db_name, q, (mail, mail, self.simplifyUserNameFromEmail(mail)))

        usr_profile = self.getUserProfileByEmail(mail)
        user_id = usr_profile.get('id')
        q = 'insert into user_proj (userid, roleid, projid) values (%s,%s,%s)'
        self._mysqlDBContainer.op_db_update(db_name, q, (user_id, project_level, project_id,))

        token = generate_password_hash(str(user_id) + mail)
        q = 'insert into token (userid, token, type, createDate) values (%s, %s, 0, %s)'
        self._mysqlDBContainer.op_db_update(db_name, q, (user_id, token, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        return token

    def updateApplyForRegistionStatus(self, mail):
        db_name = app.config['DATABASE']
        q = 'insert into user (username, useremail, userstatus, userfullname) values (%s, %s, "apply", %s)'
        self._mysqlDBContainer.op_db_update(db_name, q, (mail, mail, self.simplifyUserNameFromEmail(mail)))

        user_profile = self.getUserProfileByEmail(mail)
        token = generate_password_hash(mail)
        q = 'insert into token (userid, token, type, createDate) values (%s, %s, 3, %s)'
        self._mysqlDBContainer.op_db_update(db_name, q, (
            user_profile.get('id'), token, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        return token

    def sendInvitation(self, mail, project_id, project_level, server_url, sender_id):
        send_success_list = []
        send_fail_list = []
        for i in range(len(mail)):
            receiver_mail = mail[i]
            if not receiver_mail:
                continue
            try:
                if self.isInvitationEmailSent(receiver_mail):
                    send_fail_list.append(receiver_mail)
                    continue
                token = self.updateInvitationEmailStatus(receiver_mail, project_id, project_level)
                sender = self.getUserProfileById(sender_id)
                link = server_url + '/invite_to_register/' + token
                self.sendInvitationEmail(receiver_mail, link, sender.get('name'), sender.get('mail'))
                send_success_list.append(receiver_mail)
            except Exception as e:
                send_fail_list.append(receiver_mail)
                print('sendInvitation error: ' + e.__str__())
                logging.error('sendInvitation error: ' + e.__str__())

        return json.dumps({'status': True, 'error': '', 'list': {'success': send_success_list, 'fail': send_fail_list}})

    def applyForRegistration(self, mail, server_url):
        userProfile = self.getUserProfileByEmail(mail)
        status = userProfile.get('status')
        if status == 'registered':
            return json.dumps({'status': -1, 'msg': 'this mail address is registered'})
        # 如果邮件已经发送，且间隔时间不超过10分钟，则返回{{'status': -2, 'msg': 'not allow to send'}
        token = self.updateApplyForRegistionStatus(mail)
        link = server_url + '/apply_for_register/' + token
        return self.sendApplyForRegistrationEmail(mail, link)

    def InsertUser(self, mail):
        dbname = app.config['DATABASE']

        sql = ('insert into user (useremail) values (%s)')  # Reserved
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, sql, (mail,))

        if not bSuccess:
            dict = {'status': False,
                    'error': 'insert user failed'}
            return json.dumps(dict)

        dict = {'status': True,
                'error': ''}
        return json.dumps(dict)

    def SelectUserID(self, mail):
        dbname = app.config['DATABASE']

        sql = ('select * from user where useremail=%s')  # search userid
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (mail,))
        if rvQuery is None or len(rvQuery) <= 0:
            dict = {'status': False,
                    'error': 'user is not exist'}
            return json.dumps(dict)

        userid = rvQuery[0][0]
        dict = {'status': True,
                'userid': userid}
        return json.dumps(dict)

    def validate_user_(self, login):
        dbname = app.config['DATABASE']

        sql = 'select id, unitproperty01 from `user` where username=%s AND userstatus = "registered" or useremail=%s AND userstatus = "registered"'
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (login.get('account'), login.get('account'),))
        if dbrv is None or len(dbrv) < 1:
            dict = {'status': False,
                    'error': 'user not find'}
            return json.dumps(dict)
        pwhash = dbrv[0][1]
        if check_password_hash(pwhash, login.get('password')):
            dict = {'status': True,
                    'id': dbrv[0][0]}
            return json.dumps(dict)

    def updatedate_(self, login):
        dbname = app.config['DATABASE']
        sql = ('update `user` set lasttime=%s where username=%s or useremail=%s')

        return self._mysqlDBContainer.op_db_update(dbname, sql, (
            time.strftime('%Y-%m-%d %H:%M:%S'), login.get('name'), login.get('name'),))

    def getProject_(self, login):
        dbname = app.config['DATABASE']
        sql = (
            'select p.id, rp.roleid, p.name_en from project p join user_proj rp on p.id = rp.projid join user_role ur on rp.roleid=ur.roleid join user u on ur.roleid=u.id where u.id=%s')
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (login,))
        return [dict(id=x[0], level=x[1], name=x[2]) for x in rvQuery]

    def getProjectNameById(self, projId):
        dbname = app.config['DATABASE']
        sql = (
            'select p.id, p.name_cn, p.name_en, p.name_english from project p where p.id=%s')
        rs = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (projId,))[0]
        return dict(id=rs[0], name_cn=rs[1], name_en=rs[2], name_english=rs[3])

    def loginTask_(self, login):
        result = self.validate_user_(login)
        id = None
        if result.get('status') == True:
            id = result.get('id')
        if id is None:
            return dict(status=False)
        self.updatedate_(login)
        return dict(id=id, status=True, projects=self.getProject_(id))

    def is_user_exist(self, user_name):
        return self.getUserProfileByUserName(user_name).get('id') is not None

    def regist(self, user_full_name, password, token, registType=0):
        user_profile = self.getUserProfileByToken(token, registType)
        if not user_profile:
            return json.dumps({'status': False, 'error': 'token not exist :illegal url or user already registered'})

        timestamp = datetime.now().strftime('%Y-%m-%d')
        encoded_pwd = generate_password_hash(password)

        sql = 'update user set userfullname = %s, unitproperty01 = %s, userstatus ="registered", usercreatedt = %s where id=%s'
        if not self._mysqlDBContainer.op_db_update(app.config['DATABASE'], sql,
                                                   (user_full_name, encoded_pwd, timestamp, user_profile.get('id'))):
            return json.dumps({'status': False, 'error': 'update user failed'})

        delete_token_sql = 'delete from token where userid = %s and type = %s'
        if not self._mysqlDBContainer.op_db_update(app.config['DATABASE'], delete_token_sql,
                                                   (user_profile.get('id'), registType)):
            errInf = 'delete token failed'
            print(errInf)
            logging.error(errInf)
            return json.dumps({'status': False, 'error': errInf})

        return json.dumps({'status': True})

    def send_reset_pwd_email(self, server_url, email):
        user_profile = self.getUserProfileByEmail(email)
        if not user_profile:
            errInf = 'email is not exist'
            print(errInf)
            logging.error(errInf)
            return errInf
        elif user_profile.get('status') != 'registered':
            errInf = 'account is not activated.'
            print(errInf)
            logging.error(errInf)
            return errInf
        #
        # if self.isResetEmailSent(email):
        #     return 'email was sent'
        self._mysqlDBContainer.op_db_update(app.config['DATABASE'], 'delete from token where userid=%s and type=1',
                                            (user_profile.get('id'),))
        token = generate_password_hash(str(user_profile.get('id')) + user_profile.get('email'))
        q = 'insert into token (userid, token, type, createDate) values (%s, %s, 1, %s)'
        self._mysqlDBContainer.op_db_update(app.config['DATABASE'], q, (
            user_profile.get('id'), token, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))

        link = server_url + '/reset_pwd_email/' + token
        config_map = {
            'link': link,
            'name': user_profile.get('name'),
            'subject': 'reset password'
        }
        html = render_template('email/resetPasswordEmail.html', configMap=config_map)
        try:
            Mail(app).send(
                    Message(subject=config_map['subject'], recipients=[user_profile.get('email')], charset='utf-8',
                            html=html))
            rv = 'success'
        except Exception as e:
            rv = 'error: sending mail failed. {}'.format(e)
            print(rv)
            logging.error(rv)
        return rv

    def forget_password_reset_password(self, user_id, password):
        if not user_id or not password:
            raise Exception('user id or password is empty')
        encoded_pwd = generate_password_hash(password)
        sql = 'update user set unitproperty01 = %s where id=%s'
        if self._mysqlDBContainer.op_db_update(app.config['DATABASE'], sql, (encoded_pwd, user_id)):
            delete_token_sql = 'delete from token where userid = %s and type = 1'
            return self._mysqlDBContainer.op_db_update(app.config['DATABASE'], delete_token_sql, (user_id,))
        else:
            return False

    def register_new_user(self, username=None, phone=None, password=None):
        user = {
            'username': username,
            'userfullname': username,
            'usermobile': phone,
            'unitproperty01': generate_password_hash(password)
        }
        logging.info('用户注册' + str(user))
        new_user = User().add_user(user, user_status='registered')
        if not new_user:
            return None

        rgu = RoleGroupUser()
        # 能看到modbus
        rgu.insert_user_role_group(new_user.get('id'), [9, 13])
        return new_user

    def is_user_existed(self, username, phone):
        where = []
        params = []
        if username:
            where.append('username = %s')
            params.append(username)
        if phone:
            where.append('usermobile = %s')
            params.append(phone)

        return User().query_one(('id',), where=(' or '.join(where), params))

    def getLogicid(self, logicname):

        dbname = app.config['DATABASE']
        sql = ('select `logicid` from `logic_config` where instancename=%s')
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (logicname,))
        if dbrv is None or len(dbrv) > 0:
            return dbrv[0][0]
        else:
            return None

    def getLogicConfig(self, logicname=None):
        dbname = app.config['DATABASE']
        if logicname:
            sql = ('select * from `logic_config` where instancename=%s')
        else:
            sql = ('select * from `logic_config`')

        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (logicname,))
        data = [dict(logicid=x[0], instancename=x[1], type=x[2], logicurl=x[3], logictimeinterval=x[4]) for x in dbrv]
        return data

    def setLogicConfig(self, d):
        dbname = app.config['DATABASE']

        assert d.get('instancename')

        sql = ('select count(*) from `logic_config` where instancename=%s')
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (d.get('instancename'),))
        if dbrv[0][0] == 0:
            # if d.get('logicid') is None:
            # return 'error: require field "logicid"'
            if d.get('type') is None:
                return 'error: require field "type"'
            if d.get('logicurl') is None:
                return 'error: require field "logicurl"'
            sql = ('insert into `logic_config` %s')
            return self._mysqlDBContainer.op_db_update(dbname, sql, (self.make_db_query_insert(d),))
        else:
            cond = dict((k, v) for k, v in d.items() if k == 'instancename')
            data = dict((k, v) for k, v in d.items() if not k == 'instancename')
            sql = ('update `logic_config` %s')
            return self._mysqlDBContainer.op_db_update(dbname, sql, (self.make_db_query_update(cond, data),))

    def getLogicStatus(self, logicname):
        print('getLogicStatus')
        dbname = app.config['DATABASE']

        if (logicname == None):
            sql = (
                'select c.logicid, c.instancename, s.runstatus, s.warningflag from `logic_config` c, `logic_status` s where c.logicid=s.logicid')
            r = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
            data = [dict(logicid=x[0], instancename=x[1], runstatus=x[2], warningflag=x[3]) for x in r]
        else:
            sql = ('select s.* from `logic_config` c, `logic_status` s where c.instancename=%s and c.logicid=s.logicid')
            r = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (logicname,))
            data = [dict(logicid=x[0], runstatus=x[1], warningflag=x[2], warninginfo=x[3], warningdescription=x[4],
                         warningfile01=x[5], warningfile02=x[6], warningfile03=x[7]) for x in r]

        return data

    def setLogicStatus(self, d):
        print('setLogicStatus')
        dbname = app.config['DATABASE']

        assert d.get('instancename')
        logicid = self.getLogicid(d.get('instancename'))
        if logicid is None:
            return 'error: logic not found'
        else:
            del d['instancename']
            d.update(dict(logicid=logicid))
        sql = ('select count(*) from `logic_status` where logicid=%s')
        r = self._mysqlDBContainer.op_db_query(dbname, sql, (logicid,))
        if r[0][0] == 0:
            if d.get('runstatus') is None:
                return 'error: require field "runstatus"'
            if d.get('warningflag') is None:
                return 'error: require field "warningflag"'
            sql = ('insert into `logic_status` %s')
            self._mysqlDBContainer.op_db_update(dbname, sql, (self.make_db_query_insert(d),))
        else:
            cond = dict((k, v) for k, v in d.items() if k in ['logicid'])
            data = dict((k, v) for k, v in d.items() if k not in ['logicid'])
            sql = ('update `logic_status` %s')
            self._mysqlDBContainer.op_db_update(dbname, sql, (self.make_db_query_update(cond, data),))

        return 'success'

    def getLogicParam(self, logicname):
        print('getLogicParam')
        dbname = app.config['DATABASE']
        sql = ('select p.* from `logic_parameter` p, `logic_config` c where c.instancename=%s and c.logicid=p.logicid')
        r = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (logicname,))
        data = [dict(logicid=x[0], paramname=x[1], paramset=x[2], paramsettype=x[3], paraminout=x[4], reserve01=x[5],
                     reserve02=x[6], reserve03=x[7], reserve04=x[8], reserve05=x[9]) for x in r]
        return data

    def setLogicParam(self, d):
        dbname = app.config['DATABASE']

        assert d.get('instancename')
        logicid = self.getLogicid(d.get('instancename'))
        if logicid is None:
            return 'error: logic not found'
        else:
            del d['instancename']
            d.update(dict(logicid=logicid))
        sql = ('select count(*) from `logic_parameter` where logicid=%s %s %s')
        param = (logicid, "and paraminout='%s'" % d.get('paraminout') if not d.get('paraminout') is None else ' ',
                 'and paramname=%s' % d.get('paramname') if not d.get('paramname') is None else ' ')
        r = self._mysqlDBContainer.op_db_query(dbname, sql, param)
        if r[0][0] == 0:
            if d.get('paraminout') is None:
                return 'error: require field "paraminout"'
            if d.get('paramset') is None:
                return 'error: require field "paramset"'
            if d.get('paramsettype') is None:
                return 'error: require field "paramsettype"'
            sql = ('insert into `logic_parameter` %s')
            self._mysqlDBContainer.op_db_update(dbname, sql, (self.make_db_query_insert(d),))
        else:
            cond = dict((k, v) for k, v in d.items() if k in ['logicid', 'paraminout', 'paramname'])
            data = dict((k, v) for k, v in d.items() if k not in ['logicid', 'paraminout', 'paramname'])
            sql = ('update `logic_parameter` %s')
            self._mysqlDBContainer.op_db_update(dbname, sql, (self.make_db_query_update(cond, data),))

        return 'success'

    def getLogicRuntimeParam(self, logicname):
        dbname = app.config['DATABASE']
        sql = ('select * from `logic_runtimeparam_1` where paramname like %s')
        param = (('[%s]%%' % logicname,),)
        r = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, param)
        data = [dict(paramname=x[0], paramvalue=x[1]) for x in r]
        return data

    def setLogicRuntimeParam(self, d):
        dbname = app.config['DATABASE']
        sql = ('select count(*) from `logic_runtimeparam_1` where paramname like %s')
        param = ('[%s]%%' % d.get('instancename'),)
        r = self._mysqlDBContainer.op_db_query(dbname, sql, param)
        if r[0][0] == 0:
            if d.get('paramname') is None:
                return 'error: require field "paramname"'
            if d.get('paramvalue') is None:
                return 'error: require field "paramvalue"'
            sql = ('insert into `logic_runtimeparam_1` values (%s,%s,%s)')
            self._mysqlDBContainer.op_db_update(dbname, sql, (d.get('instancename'), d.get('paramname')),
                                                d.get('paramvalue'), )
        else:
            sql = ('update `logic_runtimeparam_1` set paramvalue=%s where paramname=%s ')
            self._mysqlDBContainer.op_db_update(dbname, sql, (
                d.get('paramvalue'), '[%s]%s' % (d.get('logicid'), d.get('paramname')),))

    def getLogicLog(self, logicname):
        dbname = app.config['DATABASE']
        sql = ('select * from `logic_log_1` where loginfo like %s')
        param = ('[%s]%%' % logicname,)
        r = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, param)
        data = [dict(logtime=x[0], loginfo=x[1]) for x in r]
        return data

    def setLogicLog(self, d):
        print('setLogicRuntimeParam')
        dbname = app.config['DATABASE']
        sql = ('insert into `logic_log_1` values (%s,%s)')
        param = (d.get('logtime'), '[%s]%s' % (d.get('instancename'), d.get('loginfo')),)
        return self._mysqlDBContainer.op_db_update(dbname, sql, param)

    def setLogicRunStatus(self, name, status):
        print('setLogicRunStatus')
        dbname = app.config['DATABASE']
        sql = (
            'update `logic_status` s, `logic_config` c set s.runstatus=%s where c.instancename=%s and s.logicid=c.logicid')
        return self._mysqlDBContainer.op_db_update(dbname, sql, (status, name,))

    def getMyFavorite(self, userId):
        dbname = app.config['DATABASE']

        ptNameList = []

        sql = "select ofGroupId, pointName,ofProjName,displayName,displayFormat,displayUnit,paramType,bufferValue, bufferHisValue from myfavorite_param_view where ofGroupId in (select groupid from myfavorite_param_view_group where ofUserId like '%%|%s|%%') order by ofGroupId,paramIndex" % (
            userId,)
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
        if rvQuery is None or len(rvQuery) == 0:
            print('table myfavorite_param_view =%s is empty.' % (id))
        listParam = []
        for item in rvQuery:
            listParam.append({'groupId': item[0], 'pointName': item[1], 'projName': item[2], 'pointValue': item[7],
                              'displayName': item[3], 'displayFormat': item[4], 'displayUnit': item[5],
                              'displayType': item[6], 'hisData': item[8]})
            ptNameList.append(item[1])

        groupList = []
        OneGroup = []
        CurGroupId = None

        for paramitem in listParam:
            if (CurGroupId is not None) and (CurGroupId != paramitem['groupId']):
                groupName = self.GetFavoriteGroupNameById(CurGroupId)
                groupList.append(dict(groupName=groupName, listData=OneGroup))
                OneGroup = []
                CurGroupId = paramitem['groupId']

            if CurGroupId is None:
                CurGroupId = paramitem['groupId']

            OneGroup.append(paramitem)

        groupName = self.GetFavoriteGroupNameById(CurGroupId)
        groupList.append(dict(groupName=groupName, listData=OneGroup))

        return groupList

    def getmax_in_dict(self, dd):
        ma = 0
        key = []
        for k, v in dd.items():
            if v > ma:
                key = []
                ma = v
                key.append(k)
            elif v == ma:
                key.append(k)
        return key

    def GetFavoriteGroupNameById(self, groupId):
        dbname = app.config['DATABASE']
        sql = 'select groupname from myfavorite_param_view_group where groupId = %s'
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (groupId,))
        groupName = ''
        if rvQuery is None or len(rvQuery) == 0:
            print('None result.')
        for item in rvQuery:
            groupName = item[0]

        return groupName

    # golding
    def staticsData(self, DataDicList):
        if len(DataDicList) == 0 or DataDicList == '[]':
            return None

        nameLast = ""
        ret = []
        fNumberList = []
        for i in range(len(DataDicList)):
            name = DataDicList[i].get('name')
            if name != nameLast:
                if len(fNumberList) > 0:
                    ret.append(dict(pointname=nameLast,
                                    statics=dict(avgvalue=average(fNumberList), maxvalue=max(fNumberList),
                                                 minvalue=min(fNumberList), medianvalue=median(fNumberList),
                                                 stdvalue=std(fNumberList))))
                    fNumberList = []
                nameLast = name
            for j in DataDicList[i].get('record'):
                bNumber = True
                try:
                    convert = float(j.get('value'))
                except Exception as e:
                    bNumber = False
                if bNumber:
                    fNumberList.append(convert)
                else:
                    fNumberList.append(0.0)
            if i == len(DataDicList) - 1:
                if len(fNumberList) > 0:
                    ret.append(dict(pointname=nameLast,
                                    statics=dict(avgvalue=average(fNumberList), maxvalue=max(fNumberList),
                                                 minvalue=min(fNumberList), medianvalue=median(fNumberList),
                                                 stdvalue=std(fNumberList))))
        return ret

    def workflow_get_fault_curve_data(self, project_id, chartPointList, chartQueryCircle, chartStartTime, chartEndTime):
        list_value = []
        list_time = []
        list_description = []
        if chartPointList:
            name_description_outer_list = chartPointList.split('|')
        else:
            return list_value, list_time, list_description
        if '' in name_description_outer_list:
            name_description_outer_list.remove('')
        for i in range(len(name_description_outer_list)):
            name_description_inner_list = name_description_outer_list[i].split(',')
            for j in range(len(name_description_inner_list)):
                if j % 2 == 0:
                    data = self.get_history_data_padded(project_id, [name_description_inner_list[j]], chartStartTime,
                                                        chartEndTime, chartQueryCircle)
                    if (isinstance(data, list)) and (len(data) == 1):
                        temp_string = ''
                        temp_time = ''
                        length = len(data[0]['history'])
                        for n in range(length):
                            temp_string += data[0]['history'][n]['value']
                            temp_time += data[0]['history'][n]['time']
                            if n != length - 1:
                                temp_string += ','
                                temp_time += ','
                        list_value.append(temp_string)
                        if len(list_time) == 0:
                            list_time.append(temp_time)
                    else:
                        list_value.append(0.00)
                else:
                    list_description.append(name_description_inner_list[j])
        return list_value, list_time, list_description

    # mango added
    def get_user_id_name_mapping(self):
        dbname = app.config['DATABASE']
        sql = 'select id,userfullname from user'
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
        if len(rv) == 0:
            print('table user is empty.')
        list = []
        for item in rv:
            list.append({'userid': item[0], 'username': item[1]})
        return list

    def replace_base64_with_img(self, detail, trans_id):
        result = re.findall('src="data:[^,]+,([^\"]+)">', detail, re.S)
        convert_list = []
        user_reply_path = "beopWeb/static/images/reply_images/"
        if not os.path.exists(user_reply_path):
            os.mkdir(user_reply_path)
        convert_reply_path = "/static/images/reply_images/"

        def gen_image_name(img_index):
            return str(trans_id) + '_' + str(datetime.now().strftime('%Y.%m.%d_%H.%M.%S')) + '_' + str(
                    img_index) + '.png'

        for index, item in enumerate(result):
            img_name = gen_image_name(index)
            with open(user_reply_path + img_name, 'wb') as file:
                file.write(base64.b64decode(item))  # upload to oss
            oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
            res = oss.put_object_from_file('beopweb', 'static/images/reply_images/' + img_name,
                                           "./beopWeb/static/images/reply_images/" + img_name)
            if res.status != 200:
                return {'status': 'ERROR', 'msg': 'upload project image error!'}
            convert_list.append(convert_reply_path + img_name)
        for j in convert_list:
            detail, number = re.subn('src="(data:.*?)">', 'src="' + j + '" />', detail, 1)
        return detail

    # golding, wx open id save
    def saveUserWxInfo(self, userId, wxId):
        wxIdCur = self.getUserWxOpenId(userId)
        wxIdNew = ''
        if wxIdCur is None or len(wxIdCur) == 0:
            wxIdNew = '|' + wxId + '|'
        else:
            wxIdNew = wxIdCur + '|' + wxId + '|'
        dbname = app.config['DATABASE']
        sql = "update user set wxOpenId = '%s' where id = '%s'"
        return self._mysqlDBContainer.op_db_update(dbname, sql, (wxIdNew, userId))

    def getUserIdByWxOpenId(self, wxId):
        dbname = app.config['DATABASE']
        sql = "select id,username from user where wxOpenId like '%%|%s|%%'" % (wxId,)
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
        if len(rv) == 0:
            return None
        return dict(id=rv[0][0], username=rv[0][1])

    def getUserWxOpenId(self, userId):
        dbname = app.config['DATABASE']
        sql = "select wxOpenId from user where id = '%s'"
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (userId,))
        if len(rv) < 1:
            return None
        return rv[0][0]

    def getUserProfileByToken(self, token, token_type=0):
        if not token:
            return {}
        q = 'select id, username, userfullname, usersex, usermobile, useremail, usercreatedt, userstatus, userpic, t.management ' \
            'from user u, token t where u.id = t.userid and token = %s and t.type = %s'
        rv = self._mysqlDBContainerReadOnly.op_db_query(app.config['DATABASE'], q, (token, token_type))
        if len(rv) > 0:
            user = rv[0]
            return {'id': user[0], 'name': user[1], 'fullname': user[2], 'sex': user[3], 'core': user[4],
                    'email': user[5], 'createDate': user[6], 'status': user[7], 'picture': user[8],'management':user[9]}
        return {}

    def appendMutilOutputToSiteTable(self, projId, pointList, valueList):
        # print('appendOutputTable')
        nPointCount = len(pointList)
        nValueCount = len(valueList)
        if nPointCount <= 0:
            return 'failed'
        if nPointCount != nValueCount:
            return 'failed'
        sql_delete = 'delete from `realtimedata_output_to_site` where pointname IN ('
        for index in range(nPointCount):
            sql_delete += "'" + pointList[index] + "',"
        sql_delete = sql_delete[:-1]
        sql_delete += ")"
        sql_delete += ' and projectid=%d' % (projId,)

        sql_insert = 'insert into `realtimedata_output_to_site` (`time`, projectid, pointname,pointvalue) values '
        for index2 in range(nPointCount):
            sql_insert += ("(NOW(),%s,'" % projId) + pointList[index2] + "','" + str(valueList[index2]) + "'),"
        sql_insert = sql_insert[:-1]
        bSuccess = self._mysqlDBContainer.op_db_update_by_transaction(app.config['DATABASE'], [sql_delete, sql_insert])
        return bSuccess

    def getUserStatus(self, username):
        dbname = app.config['DATABASE']
        q = 'select id, userstatus from user where username =%s'
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (username,))
        if rv is None:
            return ''
        else:
            return rv[0][1]

    def get_history_data_padded(self, projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest=False):
        result = []
        # invalid query filter:
        now_time = datetime.now()
        if strTimeStart is None or strTimeEnd is None or strTimeFormat is None:
            return {'error': 'historyData', 'msg': 'one of query condition is None'}

        startTime = None
        endTime = None
        try:
            startTime = datetime.strptime(strTimeStart, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(strTimeEnd, '%Y-%m-%d %H:%M:%S')
        except:
            return {'error': 'historyData', 'msg': 'invalid time string'}

        if startTime > endTime:
            print('get_history_data_padded:error params get_history_data_padded:[startTime:%s],[endTime:%s]'%(strTimeStart,strTimeEnd))
            logging.error('get_history_data_padded:error params get_history_data_padded:[startTime:%s],[endTime:%s]'%(strTimeStart,strTimeEnd))
            return {'error': 'historyData', 'msg': 'startTime > endTime'}
        if endTime > now_time:
            endTime = now_time
        if strTimeFormat == 'm1':
            if (endTime - startTime).days > 7:
                print('error: time range too long for m1 period data query')
                return {'error': 'historyData', 'msg': 'time range is 7 days for m1'}
        elif strTimeFormat == 'm5':
            if (endTime - startTime).days > 14:
                print('error: time range too long for m5 period data query :' + strTimeStart + strTimeEnd)
                return {'error': 'historyData', 'msg': 'time range is 14 days for m5'}
        elif strTimeFormat == 'h1':
            if (endTime - startTime).days > 60:
                print('error: time range too long for h1 period data query ')
                return {'error': 'historyData', 'msg': 'time range is 60 days for h1'}
        elif strTimeFormat == 'd1':
            if (endTime - startTime).days > 365:
                print('error: time range too long for d1 period data query ')
                return {'error': 'historyData', 'msg': 'time range is 60 days for d1'}
        elif strTimeFormat == 'M1':
            pass
        else:
            print('error: time period format not supported')
            return {'error': 'historyData', 'msg': 'time period format not supported'}

        rv = self.getHistoryData(projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest)
        if len(rv) == 0:
            return {'error': 'historyData', 'msg': 'no history data'}
        # mango added to prevent exception
        if type(rv) == type('123'):
            return {'error': 'historyData', 'msg': 'no history data'}
        hisDataDicList = self.padData(rv, strTimeStart, strTimeEnd, strTimeFormat)
        statics = self.staticsData(hisDataDicList)
        try:
            if len(hisDataDicList) == len(statics):
                for i in range(len(hisDataDicList)):
                    result.append({'name': hisDataDicList[i].get('name'), 'history': hisDataDicList[i].get('record'),
                                   'avg': statics[i]['statics']['avgvalue'], 'max': statics[i]['statics']['maxvalue'],
                                   'min': statics[i]['statics']['minvalue'] if statics[i]['statics']['minvalue'] >= 1e-5 else 0.0,
                                   'median': statics[i]['statics']['medianvalue'],
                                   'std': statics[i]['statics']['stdvalue']})
        except Exception as e:
            logging.error(e.__str__())
            logging.exception(e)
        return result

    def get_history_data_padded_reduce(self, projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest=False):
        result = []
        # invalid query filter:
        now_time = datetime.now()
        if strTimeStart is None or strTimeEnd is None or strTimeFormat is None:
            return {'error': 'historyData', 'msg': 'one of query condition is None'}

        startTime = None
        endTime = None
        try:
            startTime = datetime.strptime(strTimeStart, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(strTimeEnd, '%Y-%m-%d %H:%M:%S')
        except:
            return {'error': 'historyData', 'msg': 'invalid time string'}

        if startTime > endTime:
            print('get_history_data_padded_reduce:error params get_history_data_padded_reduce:[startTime:%s],[endTime:%s]'%(strTimeStart,strTimeEnd))
            logging.error('get_history_data_padded_reduce:error params get_history_data_padded_reduce:[startTime:%s],[endTime:%s]'%(strTimeStart,strTimeEnd))
            return {'error': 'historyData', 'msg': 'startTime > endTime'}
        if endTime > now_time:
            endTime = now_time
        if strTimeFormat == 'm1':
            if (endTime - startTime).days > 7:
                print('error: time range too long for m1 period data query')
                return {'error': 'historyData', 'msg': 'time range is 7 days for m1'}
        elif strTimeFormat == 'm5':
            if (endTime - startTime).days > 14:
                print('error: time range too long for m5 period data query :' + strTimeStart + strTimeEnd)
                return {'error': 'historyData', 'msg': 'time range is 14 days for m5'}
        elif strTimeFormat == 'h1':
            if (endTime - startTime).days > 60:
                print('error: time range too long for h1 period data query ')
                return {'error': 'historyData', 'msg': 'time range is 60 days for h1'}
        elif strTimeFormat == 'd1':
            if (endTime - startTime).days > 365:
                print('error: time range too long for d1 period data query ')
                return {'error': 'historyData', 'msg': 'time range is 60 days for d1'}
        elif strTimeFormat == 'M1':
            pass
        else:
            print('error: time period format not supported')
            return {'error': 'historyData', 'msg': 'time period format not supported'}

        rv = self.getHistoryData(projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest)
        if len(rv) == 0:
            return {'error': 'historyData', 'msg': 'no history data'}
        # mango added to prevent exception
        if type(rv) == type('123'):
            return {'error': 'historyData', 'msg': 'no history data'}
        hisDataDicList = self.padDataFloat(rv, strTimeStart, strTimeEnd, strTimeFormat)
        listTime = []
        data = {}
        error = {}
        errorList = []#新增数据是否真实值返回
        for item in hisDataDicList:
            record = []
            name = item.get('name')
            history = item.get('record')
            if len(listTime) == 0:
                for subItem in history:
                    listTime.append(subItem.get('time'))
            for subItem in history:
                record.append(subItem.get('value'))
                errorList.append(subItem.get('error'))
            data[name] = record
            error[name] = errorList
        result = {'timeStamp': listTime, 'data': data, 'attr': error}
        return result

    def getHistoryData(self, proj, pointName, timeStart, timeEnd, timeFormat, bSearchNearest=False):
        # print('getHistoryData')
        if isinstance(timeStart, str) and isinstance(timeEnd, str):
            start_object = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
            end_object = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
            if start_object > end_object:
                return 'query time is invalid'
        elif isinstance(timeStart, datetime) and isinstance(timeEnd, datetime):
            if timeStart > timeEnd:
                return 'query time is invalid'
        connList = MongoConnManager.getHisConn(int(proj))
        return self.mergeHisData(connList, int(proj), pointName, timeStart, timeEnd, timeFormat, bSearchNearest)

    def mergeHisData(self, connList, projId, pointName, timeStart, timeEnd, timeFormat, bSearchNearest=False):
        rt = []
        try:
            dbname = self.getCollectionNameById(projId)
            if dbname:
                if isinstance(connList, list):
                    if len(connList) > 0:
                        st_obj = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
                        curTime = st_obj
                        m5_hours = None
                        m5_minutes = None
                        if timeFormat in ('m5','h1','d1'):
                            while True:
                                if curTime.minute % 5 == 0:
                                    m5_minutes = curTime.minute
                                    m5_hours = curTime.hour
                                    break
                                curTime += timedelta(minutes=1)
                        find_list = self.analysisHisConnection(connList, timeStart, timeEnd)
                        find_list = self.filterConnection(projId, find_list)
                        for item in find_list:
                            if item.get('st') and item.get('et'):
                                conn = item.get('conn')
                                st = item.get('st')
                                if m5_minutes is not None and m5_hours is not None:
                                    st = st.replace(minute=m5_minutes)
                                    if timeFormat == 'd1' or timeFormat == 'M1':
                                        st = st.replace(hour=m5_hours)
                                et = item.get('et')
                                flag = item.get('flag', 1)
                                if conn:
                                    item_rt = []
                                    if flag == 1:
                                        item_rt = conn.getHistoryDataByFormat(dbname, pointName,
                                                                              st.strftime('%Y-%m-%d %H:%M:%S'),
                                                                              et.strftime('%Y-%m-%d %H:%M:%S'), timeFormat, bSearchNearest)
                                    elif flag == 2:
                                        item_rt = conn.getHistoryDataByFormat_v2(dbname, pointName,
                                                                              st.strftime('%Y-%m-%d %H:%M:%S'),
                                                                              et.strftime('%Y-%m-%d %H:%M:%S'), timeFormat, bSearchNearest)
                                    rt = self.mergeReturnData(item_rt, rt)
                else:
                    if connList:
                        rt = connList.getHistoryDataByFormat(dbname, pointName, timeStart, timeEnd, timeFormat, bSearchNearest)
        except Exception as e:
            print('mergeHisData error:%s' % (e.__str__(),))
            logging.error('mergeHisData error:%s' % (e.__str__(),))
        return rt

    def filterConnection(self, projId, findConnList):
        seperate_time = self.get_v2_struct_seperate_time(projId)
        if seperate_time:
            seperate_time = datetime.strptime(seperate_time, '%Y-%m-%d %H:%M:%S')
            rt = []
            for item in findConnList:
                st = item.get('st')
                et = item.get('et')
                if st and et:
                    if et < seperate_time:
                        item.update({'flag': 1})
                        rt.append(item)
                    else:
                        if st >= seperate_time:
                            item.update({'flag': 2})
                            rt.append(item)
                        else:
                            rt.append({'conn': item['conn'], 'flag': 1, 'st': item['st'], 'et': seperate_time})
                            rt.append({'conn': item['conn'], 'flag': 2, 'st': seperate_time, 'et': item['et']})
            return rt
        return findConnList

    def mergeReturnData(self, rtData, sourceData):
        if rtData:
            if not sourceData:
                sourceData = rtData
            else:
                for k in rtData:
                    for l in sourceData:
                        if l.get('pointname') == k.get('pointname'):
                            l.get('record').extend(k.get('record'))
                            break
                    else:
                        sourceData.append(k)
        return sourceData


    def analysisHisConnection(self, connList, timeStart, timeEnd):
        q_st = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        q_et = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        find_list = []
        for index, conn in enumerate(connList):
            st = conn.getTimeAttrStart()
            et = conn.getTimeAttrEnd()
            find_dict = {}
            if index > 0:
                # 对前一个对象进行修正，如果有起始时间，没有结束时间的情况，将前一个数据库实例的
                # 结束时间直接赋值给前一个对象
                if find_list[index - 1].get('st') and not find_list[index - 1].get('et'):
                    find_list[index - 1]['et'] = connList[index - 1].getTimeAttrEnd()
            find_dict['conn'] = conn
            if q_st >= st and q_st <= et:  # 查询的起始时间落在该数据库实例的时间区间
                find_dict['st'] = q_st
            if q_et >= st and q_et <= et:  # 查询的结束时间落在该数据库实例的时间区间
                find_dict['et'] = q_et
            if q_st < st and q_et > et:  # 查询的区间要大于数据库实例的时间区间
                find_dict['st'] = st
                find_dict['et'] = et
            if not find_dict.get('st') and find_dict.get('et'):  # 如果没有找到起始时间，可以直接将数据库时间赋值给它
                find_dict['st'] = st
            find_list.append(find_dict)
        return find_list

    def LoadHistoryConfig(self, userName):
        dbname = app.config.get('DATABASE')
        sql = "SELECT configName, startTime, endTime, projectList FROM history_data_config where userName = '%s'" % (
            userName)
        rvQuery = []
        rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
        if rvQuery == None or len(rvQuery) < 1:
            return None

        result = []
        for x in rvQuery:
            result.append({'configName': x[0], 'startTime': x[1], 'endTime': x[2], 'projectList': x[3]})

        return json.dumps(result)

    def SaveHistoryConfig(self, userName, configName, startTime, endTime, projectList):
        dbname = app.config.get('DATABASE')
        sql = 'INSERT INTO history_data_config(userName, configName, startTime, endTime, projectList) VALUES(%s, %s, %s, %s, %s);'
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, sql,
                                                       (userName, configName, startTime, endTime, projectList))
        if bSuccess:
            return 0
        else:
            return -1

    def updateRealtimeInputData(self, projId, pointName, pointValue):
        rtTableName = self.getProjMysqldb(projId)
        dbname = app.config['DATABASE']
        if not (isinstance(pointValue, str) or isinstance(pointValue, float) or isinstance(pointValue, int)):
            pointValue = '0.0'
        q = 'insert into rtdata_%s' % rtTableName + '(time,pointname, pointvalue) values(now(), %s, %s) on duplicate key update time=now(), pointvalue=%s'
        parameters = (pointName, pointValue, pointValue)
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, parameters)
        if bSuccess:
            return 'success'
        else:
            errInf = 'error: manipulating database failed'
            print(errInf)
            logging.error(errInf)
            return errInf

    def insert_into_realtime_inputdata(self, projId, pointNameList):
        rt = False
        try:
            rtTableName = self.getProjMysqldb(projId)
            dbname = app.config['DATABASE']
            # q = 'insert into rtdata_%s' % rtTableName + '(time,pointname, pointvalue) values(now(), %s, %s)'
            q = 'replace into rtdata_%s' % rtTableName + ' (time, pointname, pointvalue) values '
            # parameters = [(pointName, '0.0') for pointName in pointNameList]
            for pointname in pointNameList:
                q += '(now(),"%s","0.0"),' % pointname
            q = q[:-1]
            bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, ())
            if bSuccess:
                rt = True
        except Exception as e:
            print('insert_into_realtime_inputdata error:' + e.__str__())
            logging.error('insert_into_realtime_inputdata error:' + e.__str__())
        return rt

    def insert_into_realtime_bufferdata(self, projId, pointNameList):
        rt = False
        try:
            q = 'replace into rtdata_%s' % (str(projId),) + ' (time, pointname, pointvalue, flag) values '
            for pointname in pointNameList:
                q += '(now(),"%s","0.0",0),' % pointname
            q = q[:-1]
            bSuccess = self._mysqlDBContainer.op_db_update('beopdatabuffer', q, ())
            if bSuccess:
                rt = True
        except Exception as e:
            print('insert_into_realtime_inputdata error:' + e.__str__())
            logging.error('insert_into_realtime_inputdata error:' + e.__str__())
        return rt

    def updateRealtimeInputDataMul(self, projId, pointNameList, pointValueList):
        rtTableName = self.getProjMysqldb(projId)
        result = ''
        if rtTableName != None:
            dbname = app.config['DATABASE']
            try:
                tableName = 'rtdata_' + rtTableName
                bSuccess = self._mysqlDBContainer.op_db_update_rttable_by_transaction(dbname, tableName, pointNameList,
                                                                                      pointValueList)
                if bSuccess:
                    result = 'success'
                else:
                    result = 'error: manipulating database failed'
            except Exception as e:
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
                result = 'error: %s' % (e.__str__(),)
        return result

    def clearRealtimeInputData(self, projName):
        rtTableName = self.getProjMysqldbByName(projName)
        dbname = app.config['DATABASE']

        q = 'delete from rtdata_%s' % rtTableName
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, ())

        if bSuccess:
            return 'success'
        else:
            errInf = 'error: manipulating database failed'
            print(errInf)
            logging.error(errInf)
            return errInf

    def getWeatherIdOfProject(self, projId):
        dbname = app.config.get('DATABASE')
        q = ('select weather_station_id from project where id=%s')
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (projId,))
        if dbrv == None or len(dbrv) < 1:
            return None
        return dbrv[0][0]

    def updateWeatherStation(self, projId, cityId):
        dbname = app.config.get('DATABASE')
        sql = 'update project set weather_station_id=%s where id=%s'
        dbrv = self._mysqlDBContainer.op_db_update(dbname, sql, (cityId, int(projId),))
        print(dbrv)
        return True

    def getLatlngOfPriject(self, projId):
        dbname = app.config.get('DATABASE')
        q = 'select latlng from project where id = %s'
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (projId,))
        if dbrv == None or len(dbrv) < 1:
            return None
        return dbrv[0][0]

    def checkTokenValid(self, token):
        if not token:
            return False
        try:
            is_expired = self.isTokenExpired(token)
        except Exception:
            return False

        sql = 'delete from token where token = %s'
        if is_expired:
            self._mysqlDBContainer.op_db_update(app.config.get('DATABASE'), sql, (token,))
            return False
        else:
            return True

    def isTokenExpired(self, token):
        sql = 'select createDate from token where token = %s'
        rv = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql, (token,))
        if not rv or not rv[0] or not rv[0][0]:
            raise Exception('no find')
        create_date_str = rv[0][0]
        return create_date_str + timedelta(2) < datetime.now()

    # auth failed
    def createMysqlDb(self, dbName):
        assert (isinstance(dbName, str))
        return self._mysqlDBContainer.createDB(dbName)

    def checkProName(self, proName):
        dbname = app.config['DATABASE']
        sql = 'select id from project where name_en = %s'
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (proName,))

        isExistInMongo = MongoConnManager.getConfigConn().FacIsProjectExistByName(proName, )
        if isExistInMongo:
            return {'status': 'ERROR', 'msg': 'db is already exist in factory'}
        if len(dbrv) != 0:
            rs = {'status': 'OK', 'msg': 'project name exist', 'data': {'isExist': True}}
        else:
            rs = {'status': 'OK', 'msg': 'project name not exist', 'data': {'isExist': False}}
        return rs

    def getWarningConfig(self, projId):
        assert (isinstance(projId, int))

        result = []
        sql = 'select * from %s order by pointname' % (g_warning_config,)
        dbname = self.getProjMysqldb(projId)
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
        for item in rv:
            result.append(
                    {'HHEnable': item[0], 'HEnable': item[1], 'LEnable': item[2], 'LLEnable': item[3],
                     'HHLimit': item[4],
                     'HLimit': item[5], 'LLimit': item[6], 'LLLimit': item[7], 'pointname': item[8],
                     'HHwarninginfo': item[9], 'Hwarninginfo': item[10], 'Lwarninginfo': item[11],
                     'LLwarninginfo': item[12], 'boolwarning': item[13], 'boolwarninginfo': item[14],
                     'boolwarninglevel': item[15], 'unitproperty01': item[16], 'unitproperty02': item[17],
                     'unitproperty03': item[18], 'unitproperty04': item[19], 'unitproperty05': item[20]})
        return result

    def getWarningRecord(self, projId, startTime, endTime, unconfirmed=0):
        assert (isinstance(projId, int))
        assert (isinstance(startTime, str))
        assert (isinstance(endTime, str))

        sql = ''
        result = []
        dbname = self.getProjMysqldb(projId)
        if dbname != None:
            self.createWarningTable(dbname)
            if unconfirmed:
                sql = 'select * from %s where confirmed = 0  order by time desc limit 0, 500' % (
                    g_warning_record + dbname,)
            else:
                sql = 'select * from %s where (time>=\'%s\' and time<=\'%s\') or (endtime>=\'%s\' and endtime<=\'%s\') order by time desc limit 0,500' % (
                    g_warning_record + dbname, startTime, endTime, startTime, endTime)
            rv = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql)
            for item in rv:
                result.append(
                        {'time': item[0].strftime('%Y-%m-%d %H:%M:%S'), 'code': item[1], 'info': item[2],
                         'level': item[3],
                         'endtime': item[4].strftime('%Y-%m-%d %H:%M:%S'), 'confirmed': item[5],
                         'confirmeduser': item[6],
                         'bindpointname': item[7]})
        return result

    def modifyWarningConfig(self, projId, configItem):
        assert (isinstance(projId, int))
        assert (isinstance(configItem, dict))

        try:
            nHHEnable = int(configItem.get('HHEnable'))
            nHEnable = int(configItem.get('HEnable'))
            nLEnable = int(configItem.get('LEnable'))
            nLLEnable = int(configItem.get('LLEnable'))

            fHHLimit = float(configItem.get('HHLimit'))
            fHLimit = float(configItem.get('HLimit'))
            fLLimit = float(configItem.get('LLimit'))
            fLLLimit = float(configItem.get('LLLimit'))

            strHHwarningInfo = str(configItem.get('HHwarninginfo'))
            strHwarningInfo = str(configItem.get('Hwarninginfo'))
            strLwarningInfo = str(configItem.get('Lwarninginfo'))
            strLLwarningInfo = str(configItem.get('LLwarninginfo'))

            nWarningLevel = int(configItem.get('warninglevel'))
            strboolwarninginfo = str(configItem.get('boolwarninginfo'))

            strunitproperty01 = str(configItem.get('unitproperty01'))

            strPointName = str(configItem.get('pointname'))

            dbname = self.getProjMysqldb(projId)
            sql = 'update %s set HHEnable=%d,HEnable=%d,LEnable=%d,LLEnable=%d,HHLimit=%f,HLimit=%f,LLimit=%f,LLLimit=%f,HHwarninginfo=\'%s\',Hwarninginfo=\'%s\',Lwarninginfo=\'%s\',LLwarninginfo=\'%s\',boolwarninglevel=%d,boolwarninginfo=\'%s\',unitproperty01=\'%s\' where pointname=\'%s\'' % \
                  (g_warning_config, nHHEnable, nHEnable, nLEnable, nLLEnable, fHHLimit, fHLimit, fLLimit, fLLLimit,
                   strHHwarningInfo, strHwarningInfo, strLwarningInfo, strLLwarningInfo, nWarningLevel,
                   strboolwarninginfo, strunitproperty01, strPointName)
            return self._mysqlDBContainer.op_db_update(dbname, sql, ())
        except Exception as e:
            print(e.__str__())
            logging.error(e.__str__())
        return False

    def addWarningConfig(self, projId, configItem):
        assert (isinstance(projId, int))
        assert (isinstance(configItem, dict))

        try:
            nHHEnable = int(configItem.get('HHEnable'))
            nHEnable = int(configItem.get('HEnable'))
            nLEnable = int(configItem.get('LEnable'))
            nLLEnable = int(configItem.get('LLEnable'))

            fHHLimit = float(configItem.get('HHLimit'))
            fHLimit = float(configItem.get('HLimit'))
            fLLimit = float(configItem.get('LLimit'))
            fLLLimit = float(configItem.get('LLLimit'))

            strHHwarningInfo = str(configItem.get('HHwarninginfo'))
            strHwarningInfo = str(configItem.get('Hwarninginfo'))
            strLwarningInfo = str(configItem.get('Lwarninginfo'))
            strLLwarningInfo = str(configItem.get('LLwarninginfo'))

            strboolwarninginfo = str(configItem.get('boolwarninginfo'))

            strunitproperty01 = str(configItem.get('unitproperty01'))

            strPointName = str(configItem.get('pointname'))

            nWarningType = int(configItem.get('warningtype'))

            nWarningLevel = int(configItem.get('warninglevel'))

            dbname = self.getProjMysqldb(projId)
            sql = 'insert into %s value(%d, %d, %d, %d, %f, %f, %f, %f, \'%s\', \'%s\', \'%s\', \'%s\', \'%s\', %d, \'%s\', %d, \'%s\', \'%s\', \'%s\', \'%s\', \'%s\')' % \
                  (g_warning_config, nHHEnable, nHEnable, nLEnable, nLLEnable, fHHLimit, fHLimit, fLLimit, fLLLimit,
                   strPointName, strHHwarningInfo, strHwarningInfo, strLwarningInfo, strLLwarningInfo, nWarningType,
                   strboolwarninginfo, nWarningLevel, strunitproperty01, '', '', '', '')
            return self._mysqlDBContainer.op_db_update(dbname, sql, ())
        except Exception as e:
            print(e.__str__())
            logging.error(e.__str__())
        return False

    def deleteWarningConfig(self, projId, pointNames):
        assert (isinstance(projId, int))
        assert (isinstance(pointNames, str))

        dbname = self.getProjMysqldb(projId)
        sql = 'delete from %s where pointname in (\'%s\')' % (g_warning_config, pointNames)
        return self._mysqlDBContainer.op_db_update(dbname, sql, ())

    def confirmWarning(self, projId, confirmed, pointName, userName):
        assert (isinstance(projId, int))
        assert (isinstance(confirmed, int))
        assert (isinstance(userName, str))
        assert (isinstance(pointName, str))

        dbname = self.getProjMysqldb(projId)
        if dbname != None:
            self.createWarningTable(dbname)
            sql = 'update %s set confirmed=%d,confirmeduser=\'%s\' where bindpointname=\'%s\'' % (
                g_warning_record + dbname, confirmed, userName, pointName)
        return self._mysqlDBContainer.op_db_update(app.config.get('DATABASE'), sql)

    def get_pointList_from_rtTable(self, projId):
        assert (isinstance(projId, int))
        rt = []
        dbname = self.getProjMysqldb(projId)
        tableName = 'rtdata_' + dbname
        sql = 'select pointname from %s' % (tableName,)
        data = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql)
        for item in data:
            rt.append(item[0])
        return rt

    def get_pointList_from_bufTable(self, projId):
        assert (isinstance(projId, int))
        rt = []
        tableName = 'rtdata_' + str(projId)
        sql = 'select pointname from %s' % (tableName,)
        data = self._mysqlDBContainerReadOnly.op_db_query('beopdatabuffer', sql)
        for item in data:
            rt.append(item[0])
        return rt

    def get_pointList_from_rtTable_ex(self, projId, offset, num):
        assert (isinstance(projId, int))
        rt = []
        dbname = self.getProjMysqldb(projId)
        tableName = 'rtdata_' + dbname
        if num == -1:
            sql = 'select pointname from %s;' % (tableName)
        else:
            sql = 'select pointname from %s limit %d, %d;' % (tableName, offset, num)
        data = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql)
        for item in data:
            rt.append(item[0])
        return rt

    def get_length_in_pointList_from_rtTable(self, projId):
        rt = 0
        try:
            assert (isinstance(projId, int))
            dbname = self.getProjMysqldb(projId)
            tableName = 'rtdata_' + dbname
            sql = 'select count(*) from %s' % (tableName,)
            data = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql)
            rt = data[0][0]
        except Exception as e:
            print('get_length_in_pointList_from_rtTable error:' + e.__str__())
            logging.error('get_length_in_pointList_from_rtTable error:' + e.__str__())
        return rt

    def getUserRolesInProject(self, user_id, project_id):
        dbname = app.config['DATABASE']
        sql = 'select ur.roleId from user_role ur left join role_project rp on ur.roleId = rp.id where rp.projectId = %s and userId = %s'
        roles = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (project_id, user_id))
        ret = []
        if roles:
            ret = [x[0] for x in roles]
        return ret

    def getUserIdsByProjIdAndLevel(self, projId, level):
        dbname = app.config['DATABASE']
        sql = 'select ur.userId from user_role ur left join role_project rp on ur.roleId = rp.id where rp.projectId=%s and rp.level=%s'
        userIds = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (projId, level))
        rs = []
        if userIds:
            rs = [x[0] for x in userIds]
        return rs

    def createRTTable(self, rtTableName):
        confdb = app.config.get('DATABASE')
        result = True
        try:
            if isinstance(rtTableName, str):
                if len(rtTableName) > 0:
                    sql = "CREATE TABLE IF NOT EXISTS %s (`time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,pointname varchar(64) NOT NULL DEFAULT '',\
                        pointvalue varchar(256) NOT NULL DEFAULT '',flag int(11) DEFAULT NULL,PRIMARY KEY (pointname)) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (
                        rtTableName,)
                    result = self._mysqlDBContainer.op_db_update(confdb, sql, ())
        except Exception as e:
            result = False
            logging.error('createRTTable:' + e.__str__())
        return result

    def createWarningTable(self, dbName):
        result = True
        if isinstance(dbName, str):
            if len(dbName) > 0:
                rtWarningTableName = 'warningrd_' + dbName
                sql = "CREATE TABLE IF NOT EXISTS %s (time timestamp NOT NULL DEFAULT '2000-01-01 00:00:00',code int(10) unsigned NOT NULL DEFAULT '0',info varchar(1024) NOT NULL DEFAULT '',\
                    level int(10) unsigned NOT NULL DEFAULT '0',endtime timestamp NOT NULL DEFAULT '2000-01-01 00:00:00',confirmed int(10) unsigned NOT NULL DEFAULT '0',\
                    confirmeduser varchar(2000) NOT NULL DEFAULT '',bindpointname varchar(255) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (
                    rtWarningTableName,)
                result = self._mysqlDBContainer.op_db_update(app.config.get('DATABASE'), sql, ())
        return result

    def get_registered_user_info(self):
        sql = "select id, userfullname from user where userstatus = 'registered'"
        rt = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql, ())
        return rt

    def id_name_mapping(self, table_name):
        '''
        得到相关表的id和name对应的字典
        '''
        dbname = ('beopdoengine')
        query = {
            'user': 'select id,userfullname from user',
            'project': 'select id,name_cn from project',
        }
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, query[table_name])
        rtn = {}
        if len(rv) == 0:
            return {}
        else:
            for n in rv:
                rtn.update({n[0]: n[1]})
            return rtn

    # david get s3dbname from mysql 2015-7-30
    def get_proj_name(self, s3db):
        dbvr = []
        dbname = app.config.get('DATABASE')
        q = ('select s3dbname, pic from project where s3dbname = %s')
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (s3db,))
        return dbrv

    def getProjectLocateMap(self):
        projectLocateMap = {}

        projectLocateMap = RedisManager.get_project_locate_map()
        if not projectLocateMap or type(projectLocateMap) is not dict:
            MongoConnManager.UpdateProjectLocateMap()

        return projectLocateMap

    def appTempGetRealtimeVal(self, sensorIds=[], controllerIds=[]):
        sensorArr = []
        controllerArr = []
        # import pdb;pdb.set_trace()
        try:
            dbname = app.config.get('DATABASE')

            if len(sensorIds) > 0:
                sql = "select id, time, value from apptemp_sensor_cache where id in ('" + "','".join(sensorIds) + "')"
                rs = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
                for id, time, value in rs:
                    sensorArr.append({'id': id, 'time': time.strftime('%Y-%m-%d %H:%M:%S'), 'value': value})

            if len(controllerIds) > 0:
                sql = "select id, time, value, speed, switch, sp from apptemp_controller_cache where id in ('" + "','".join(
                        controllerIds) + "')"
                rs = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
                for id, time, value, speed, switch, sp in rs:
                    controllerArr.append({
                        'id': id,
                        'time': time.strftime('%Y-%m-%d %H:%M:%S'),
                        'value': value,
                        'speed': speed,
                        'switch': switch,
                        'sp': sp
                    })
        except Exception as e:
            print('appTempGetRealtimeVal failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)

        return {'sensors': sensorArr, 'controllers': controllerArr}

    def getRealtimeDataDelay(self, projId):
        rtTableName = self.getProjMysqldb(projId)
        nDelaySeconds = 100
        if rtTableName != None:
            dbname = app.config['DATABASE']
        try:
            tableName = 'rtdata_' + rtTableName
            q = 'select max(time) from %s' % tableName
            dbrvSlave = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrvSlave is not None:
                tSlave = dbrvSlave[0][0]
            else:
                return dict(delaySeconds=100, info='No points exist in slave mysql database')

            dbrvMaster = self._mysqlDBContainer.op_db_query(dbname, q, ())
            if dbrvMaster is not None:
                tMaster = dbrvMaster[0][0]
            else:
                return dict(delaySeconds=100, info='No points exist in master mysql database')

            nDelaySeconds = (tMaster - tSlave).total_seconds()
        except Exception as e:
            print(e.__str__())
            logging.error('getLastUpdateTimeInRTTableInMasterDB error:' + e.__str__())
        return dict(delaySeconds=nDelaySeconds, info='Points exist')

    def appDbGetSummary(self, projectId):
        # import pdb;pdb.set_trace()
        rt = False
        try:
            dbname = 'diagnosis'

            if len(projectId) > 0:
                sql = ('select topic, dashboard from app where projectId=%s')
                rv = self._mysqlDBContainer.op_db_query(dbname, sql, (projectId,))
                for topic, dashboard in rv:
                    rt = {
                        'dashboardList': dashboard.replace('\r', '').replace('\n', '').replace('\'', '\"'),
                        'summaryList': topic.replace('\r', '').replace('\n', '').replace('\'', '\"')
                    }
        except Exception as e:
            print('appDbGetSummary failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)

        return rt

    def GetAllDBNames(self):
        sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA where SCHEMA_NAME like 'beopdata_%%'"
        return self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)

    def getUsersInfoForAppTemp(self, userList):
        rt = []
        try:
            dbname = app.config['DATABASE']
            strUser = ','.join([str(x) for x in userList])
            strUser = '(' + strUser
            strUser = strUser + ')'
            sql = "select id, username, userpic from user where id in " + strUser
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            if dbrv:
                for item in dbrv:
                    rt.append((item[0], item[1], item[2]))
        except Exception as e:
            print('getUsersInfoForAppTemp error:' + e.__str__())
            logging.error('getUsersInfoForAppTemp error:' + e.__str__())
        return rt

    def set_phonenum_by_userid(self, userId, phonenum):
        rt = False
        try:
            dbname = app.config['DATABASE']
            strSql = 'UPDATE `user` SET usermobile = "%s" WHERE id = %d' % (phonenum, int(userId))
            dbrv = self._mysqlDBContainer.op_db_update(dbname, strSql, ())
            if dbrv:
                rt = True
        except Exception as e:
            print('set_phonenum_by_userid error:' + e.__str__())
            logging.error('set_phonenum_by_userid error:' + e.__str__())
        return rt

    def get_user_by_phonenum(self, phonenum):
        rt = []
        try:
            dbname = app.config['DATABASE']
            strSql = 'SELECT id, username, usermobile FROM `user` WHERE usermobile = "%s" AND userstatus = "registered"' % phonenum
            rt = self._mysqlDBContainerReadOnly.op_db_query_one(dbname, strSql)
        except Exception as e:
            print('get_user_by_phonenum error:' + e.__str__())
            logging.error('get_user_by_phonenum error:' + e.__str__())
        return rt

    def add_user_by_phonenum(self, phonenum, password, sex=0):
        rt = None
        try:
            dbname = app.config['DATABASE']
            createdt = time.strftime("%Y-%m-%d", time.localtime())
            pwhash = generate_password_hash(str(password))
            strSql = 'INSERT INTO `user` SET username = "%s", usermobile = "%s", usersex = %d, usercreatedt = "%s", ' \
                     'unitproperty01 = "%s", userstatus = "%s"' % (
                         phonenum, phonenum, int(sex), createdt, pwhash, 'registered')
            rt = self._mysqlDBContainer.op_db_update_with_id(dbname, strSql)
        except Exception as e:
            print('add_user_by_phonenum error:' + e.__str__())
            logging.error('add_user_by_phonenum error:' + e.__str__())
        return rt

    def updateUserPhone(self, data):
        rt = False
        try:
            id = data.get('id')
            phone = str(data.get('phone'))
            dbname = app.config.get('DATABASE')
            sql = 'update user set usermobile = %s where id = %s'%(phone, id)
            if self._mysqlDBContainer.op_db_update(dbname, sql):
                rt = True
        except Exception as e:
            print('updateUserPhone error:' + e.__str__())
            logging.error('updateUserPhone error:' + e.__str__())
        return rt

    def mergesetHisData(self, projId, connList, pointName, pointValue, pointTime, collectionName, ):
        rt = False
        try:
            if isinstance(connList, list):
                if len(connList) > 0:
                    for conn in connList:
                        st = conn.getTimeAttrStart()
                        et = conn.getTimeAttrEnd()
                        if pointTime <= et and pointTime >= st:
                            rt = conn.saveHistoryData(projId, pointName, pointValue, pointTime, collectionName)
                            break
            else:
                if connList:
                    rt = connList.saveHistoryData(projId, pointName, pointValue, pointTime, collectionName)
        except Exception as e:
            print('mergesetHisData error:' + e.__str__())
            logging.error('mergesetHisData error:' + e.__str__())
        return rt

    def insert_into_contactus(self, data):
        rt = False
        try:
            dbname = app.config.get('DATABASE')
            name = data.get('name')
            company = data.get('company')
            mail = data.get('mail')
            phone = data.get('phone')
            msg = data.get('msg')
            rss = int(data.get('rss', 1))
            curentTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            strSQL = 'insert into contactUs(`name`, company, mail, phone, msg, rss, time) ' \
                     'VALUES ("%s", "%s", "%s", "%s", "%s", %d, "%s")'%(name, company, mail, phone,msg, rss, curentTime)
            rt = self._mysqlDBContainer.op_db_update(dbname, strSQL, ())
        except Exception as e:
            print('insert_into_contactus error:' + e.__str__())
            logging.error('insert_into_contactus error:' + e.__str__())
        return rt

    def get_user_name_dict_by_id(self, id_list):
        rt = {}
        try:
            dbname = app.config.get('DATABASE')
            strSQL = 'SELECT id, username FROM `user` WHERE id in ('
            if len(id_list) > 0:
                for i in id_list:
                    strSQL = strSQL + str(i) + ','
                strSQL = strSQL[:-1] + ') AND userstatus = "registered"'
                res = self._mysqlDBContainerReadOnly.op_db_query(dbname, strSQL)
                for r in res:
                    rt.update({int(r[0]):r[1]})
        except Exception as e:
            print('get_user_name_dict_by_id error:' + e.__str__())
            logging.error(e)
        return rt

    def getBufferRTDataByProj(self, projId, pointList=None):
        rt = {}
        try:
            dbname = 'beopdatabuffer'
            tableName = 'rtdata_%s'%(projId,)
            tableName_vpoint = 'rtdata_%s_vpoint'%(projId,)
            if pointList:
                q = 'select pointname, pointvalue from (select pointname, pointvalue from %s UNION all select pointname, pointvalue from %s) a where pointname in (%s)'%(tableName, tableName_vpoint, str(pointList).replace('[','').replace(']',''))
            else:
                q = 'select pointname, pointvalue from %s UNION all select pointname, pointvalue from %s' % (tableName, tableName_vpoint)
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            rt = {x[0]:x[1] for x in rvQuery}
            lowerKeys = [x.lower() for x in rt.keys()]
            if pointList:
                for pt in pointList:
                    if pt.lower() not in lowerKeys:
                        rt[pt] = 'Null'
        except Exception as e:
            print('getBufferRTDataByProj error:' + e.__str__())
            logging.error(e)
        return rt


    def getBufferRTDataWithTimeByProj(self, projId, pointList=None):
        rt = {}
        try:
            dbname = 'beopdatabuffer'
            tableName = 'rtdata_%s'%(projId,)
            tableName_vpoint = 'rtdata_%s_vpoint'%(projId,)
            if pointList:
                q = 'select time, pointname, pointvalue from (select time, pointname, pointvalue from %s UNION all select time, pointname, pointvalue from %s) a where pointname in (%s)'%(tableName, tableName_vpoint, str(pointList).replace('[','').replace(']',''))
            else:
                q = 'select time, pointname, pointvalue from %s UNION all select time, pointname, pointvalue from %s' % (tableName, tableName_vpoint)
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            rt = {x[1]:[x[0], x[2]] for x in rvQuery}
        except Exception as e:
            print('getBufferRTDataWithTimeByProj error:' + e.__str__())
            logging.error(e)
        return rt

    def replaceSiteDBToBuffer(self, projid, mysqlname):
        try:
            if projid is None or mysqlname is None:
                return False
            if projid<=0:
                strErr = 'replaceSiteDBToBuffer %s failed because projid <0'
                print(strErr)
                logging.info(strErr)
                return False

            if len(mysqlname)<=0:
                strErr = 'replaceSiteDBToBuffer %s failed because mysqlname not valid: %s'%(mysqlname,)
                print(strErr)
                logging.info(strErr)
                return False

            dbNameTo = app.config.get('DATABASE_BUFFER')
            dbNameFrom =  app.config.get('DATABASE')
            tableNameFrom = 'rtdata_%s'%(mysqlname,)
            tableNameTo = 'rtdata_%d'%(int(projid))

            sql1 = "delete from %s.%s where flag=0"%(dbNameTo, tableNameTo)
            sql2 = "insert ignore into %s.%s select time,pointname,pointvalue,flag from %s.%s"%(dbNameTo, tableNameTo, dbNameFrom, tableNameFrom,)#`flag` INT(10) NOT NULL DEFAULT 1,\
            result = self._mysqlDBContainer.op_db_update_by_transaction(dbNameTo, [sql1, sql2])
            if result:
                return True
            else:
                print('replaceSiteDBToBuffer %s failed'%(mysqlname,))
                logging.info('replaceSiteDBToBuffer %s failed'%(mysqlname,))
        except Exception as e:
            print('createTableBufferRTTableVPointIfNotExist error:'+e.__str__())
            logging.error('createTableBufferRTTableVPointIfNotExist error:'+e.__str__())
        return False

    
    #导出某项目的所有s3db页面到指定webfactory项目中
    def transformS3dbIntoPageScreen(self, srcProjId, tarProjId):
        s3dbname = self.getProjS3db(srcProjId)
        projectName = self.getProjectNameById(srcProjId).get('name_en')
        srcPages = BEOPSqliteAccess.getInstance().getPlantPageDetails(s3dbname, False)

        #arrTarNavigationList = BEOPMongoDataAccess.getInstance().mdbBb['Fac_Navigation'].find_one({'_id': ObjectId(tarProjId)}).get('list')  #Fac_Navigation.list
        arrTarNavigationList = MongoConnManager.getConfigConn().mdbBb['Fac_Navigation'].find_one({'_id': ObjectId(tarProjId)}).get('list')  #Fac_Navigation.list
        dictTarPage = {}    #Fac_Page
        dictTarLayer = {}   #Fac_Layer
        dictTarWidget = {}  #Fac_Widget
        arrTarImage = []   #Fac_Material

        #插入一个空目录到dictTarPage，默认名为"s3db"
        parentFolderId = hashlib.md5(('page_' + srcProjId + '_s3db').encode(encoding='utf-8')).hexdigest()[0: 24]
        dictTarPage[parentFolderId] = { 
            "_id" : ObjectId(parentFolderId), 
            "type" : "DropDownList",
            "isHide" : 0, 
            "text" : "s3db"
        }
        arrTarNavigationList.append(parentFolderId) #将空目录ID追加到arrTarNavigationList

        #插入空项目图片目录
        parentImageFolderId = hashlib.md5(('image_' + srcProjId + '_' + 'parentFolder').encode(encoding='utf-8')).hexdigest()[0: 24]
        arrTarImage.append({
            "_id": ObjectId(parentImageFolderId),
            "creator": "export",
            "name": s3dbname,
            "time": "2016-01-29",
            "type": 'image',  
            "isFolder": 1,
            "public": 1,
            "group": '',
        })

        #遍历页面
        for srcPage in srcPages:
        #if True:
        #    srcPage = srcPages[0]
            arrLayerId = []
            srcPageId = str(srcPage.get('id'))
            #生成页面的ObjectId，作为Fac_Page的_id
            tarPageId = hashlib.md5(('page_' + srcProjId + '_' + srcPageId).encode(encoding='utf-8')).hexdigest()[0: 24]
            
            #获取当前页的s3db格式内容
            dictSrcPlant = BEOPSqliteAccess.getInstance().getPlant(s3dbname, srcPageId)
            
            #遍历获取到的s3db内容 类别
            for srcType in dictSrcPlant:
                #遍历类别下的所有内容
                for item in dictSrcPlant[srcType]:
                    tarWidgetId = None
                    tarType = None
                    tarOption = {}  

                    if(type(item) is dict):
                        #若不存在对应图层，新建图层，并存入dictTarLayer
                        if(item.get('layer') not in [None, ''] and (str(item.get('layer')) + '_' + str(srcPageId)) not in dictTarLayer.keys()):
                            tarLayerId = hashlib.md5(('layer_' + srcProjId + '_' + str(srcPageId) + '_' + str(item.get('layer'))).encode(encoding='utf-8')).hexdigest()[0: 24]
                            dictTarLayer[str(item.get('layer')) + '_' + str(srcPageId)] = { 
                                "_id" : ObjectId(tarLayerId), 
                                "isHide" : 0, 
                                "name" : item.get('layer'), 
                                "isLock" : 0, 
                                "list" : [], 
                                "parentId" : "", 
                                "pageId" : tarPageId,
                                "type": 'canvas'
                            }
                            arrLayerId.append(tarLayerId)

                        #转换Widget数据结构
                        tarWidgetId = hashlib.md5(('widget_' + srcProjId + '_' + str(item.get('id'))).encode(encoding='utf-8')).hexdigest()[0: 24]

                    if srcType == 'equipments':
                        tarType = 'CanvasImage'
                        tarOption = {
                            "animation": { },
                            "isFromAnimation": False,

                            "float": "" if item.get('link') is not '-1' else '1',
                            "pageId": "" if item.get('link') is not '-1' else hashlib.md5(('page_' + srcProjId + '_' + str(item.get('link'))).encode(encoding='utf-8')).hexdigest()[0: 24],
                            "pageType": "PageScreen",
                            "rotate": item.get('rotate'),
                            "trigger": { "default": hashlib.md5(('image_' + srcProjId + '_' + str(item.get('idPicture'))).encode(encoding='utf-8')).hexdigest()[0: 24] }
                        }
                    #elif srcType == 'animationImages':
                    #elif srcType == 'animationList':
                    elif srcType == 'buttons':
                        tarType = 'HtmlButton'
                        tarOption = {
                            #"id": 80018630,
                            #"setValue": 0,
                            #"disable": 241902435,
                            #"down": 242002436,
                            #"fontSize": 15,
                            #"over": 242102437,
                            #"comm": 241802434,
                            #"fontColor": { "r": 0,"b": 0,"g": 0 },

                            "class": "primary",
                            "float": 1,
                            "pageId": hashlib.md5(('page_' + srcProjId + '_' + str(item.get('link'))).encode(encoding='utf-8')).hexdigest()[0: 24],
                            "pageType": "PageScreen",
                            "text":  item.get('text') if item.get('idCom') is not '' else '<%value%>',
                        }
                    #elif srcType == 'charts':
                    #elif srcType == 'checkboxs'
                    #elif srcType == 'gages':
                    elif srcType == 'images':
                        arrTarImage.append({
                            "_id": ObjectId(hashlib.md5(('image_' + srcProjId + '_' + str(item)).encode(encoding='utf-8')).hexdigest()[0: 24]),
                            "creator": "export",
                            "name": str(item),
                            "time": "2016-01-29",
                            "content": { 
                                "url": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/plant/"+ projectName + "/" + str(item) + ".png",
                                "interval": 0,
                                "w": -1,
                                "h": -1,
                            },
                            "type": 'image',  
                            "isFolder": 0,
                            "public": 1,
                            "group": parentImageFolderId,
                        })
                    elif srcType == 'pipelines':
                        tarType = 'CanvasPipe'
                        tarOption = {
                            #'color': "#4C9CD9",
                            'direction': item.get('direction'),
                            'points': [
                                {'x': item.get('startX'), 'y': item.get('startY')}, 
                                {'x': item.get('endX'), 'y': item.get('endY')}
                            ],
                            'width': item.get('width'),
                            #'waterType'
                            'color': 'rgb('+str(item['color']['r'])+', '+str(item['color']['g'])+', '+str(item['color']['b'])+')',
                        }
                    #elif srcType == 'rects':
                    #elif srcType == 'rulers':
                    #elif srcType == 'tempDistributions':
                    elif srcType == 'texts':
                        tarType = 'HtmlText'
                        text = item.get('text')
                        if item.get('idCom') is not '' and item.get('idCom') is not None: text = '<%value%>'

                        tarOption = {
                            #"align": 0,
                            #"showMode": 1,
                            "style": ".Normal{font-family: "+item.get('font')+"; font-size: "+str(item.get('fontSize'))
                                    +"px; color: rgb("+str(item['color']['b'])+', '+str(item['color']['g'])+', '+str(item['color']['r'])+"); text-algin: right;}",
                            "precision": item.get('decimalplace'),
                            "class": "default",
                            "text": text,
                        }
                        if(item.get('bindString') is not ""):
                            arrBindString = item.get('bindString').split('|')
                            tarOption['trigger'] = {}
                            for triger in arrBindString:
                                arrTriger = triger.split(':')
                                tarOption['trigger'][arrTriger[0]] = arrTriger[1]

                    
                    #未确定类型，则不插入
                    if(tarType is None): continue

                    idCom = item.get('idCom')
                    if( idCom is not None and idCom is not ''):
                        idCom = ['@' + srcProjId + '|' +item.get('idCom')]
                    else: idCom = []

                    tarWidget = { 
                        "_id" : ObjectId(tarWidgetId), 
                        "x" : item.get('x'), 
                        "y" : item.get('y'), 
                        "w" : item.get('width'), 
                        "h" : item.get('height'), 
                        "idDs" : idCom, 
                        "layerId" : str(dictTarLayer[str(item.get('layer')) + '_' + str(srcPageId)]['_id']), 
                        "pageId" : tarPageId,

                        "type" : tarType, 
                        "option" : tarOption, 
                    }


                    #添加控件到dictTarWidget
                    dictTarWidget[tarWidgetId] = tarWidget
                    dictTarLayer[str(item.get('layer')) + '_' + str(srcPageId)]['list'].append(tarWidgetId)

            #存入dictTarPage
            dictTarPage[tarPageId] = { 
                "_id" : ObjectId(tarPageId), 
                "width" : srcPage.get('width'), 
                "type" : "PageScreen", 
                "isHide" : 0, 
                "layerList" : arrLayerId, 
                "display" : 0, 
                "text" : srcPage.get('name'), 
                "isLock" : 0, 
                "height" : srcPage.get('height'), 
                "parent" : parentFolderId,
                "option" : { 'background' : {
                    "color" : "#ffffff", 
                    "url" : "", 
                    "type" : "color", 
                    "display" : ""
                } }
            }
            #将tarPageId追加到Fac_Navigation.list
            arrTarNavigationList.append(tarPageId)
            
        #arrTarNavigationList 去重
        arrList = []
        for item in arrTarNavigationList:
            if item not in arrList: arrList.append(item)

        #更新Fac_Navigation.list Fac_Material
        MongoConnManager.getConfigConn().mdbBb['Fac_Navigation'].update({'_id': ObjectId(tarProjId)}, {'$set': {'list': arrList}}, True)
        conn = MongoConnManager.getConfigConn().mdbBb['Fac_Material']
        for item in arrTarImage: conn.update({'_id': item.get('_id')}, {'$set': item}, True)

        #更新Fac_Page Fac_Layer Fac_Widget
        conn = MongoConnManager.getConfigConn().mdbBb['Fac_Widget']
        for key in dictTarWidget: 
            item = dictTarWidget[key]
            conn.update({'_id': item.get('_id')}, {'$set': item}, True)

        conn = MongoConnManager.getConfigConn().mdbBb['Fac_Layer']
        for key in dictTarLayer: 
            item = dictTarLayer[key]
            conn.update({'_id': item.get('_id')}, {'$set': item}, True)

        conn = MongoConnManager.getConfigConn().mdbBb['Fac_Page']
        for key in dictTarPage: 
            item = dictTarPage[key]
            conn.update({'_id': item.get('_id')}, {'$set': item}, True)

        return True

    def clear_bufferdata(self, db_name, startTime, endTime):
        rt = False

        try:
            from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject
            from beopWeb.mod_cxTool.dtusert_to_project import DtusertToProject
            dsp = DtuServerProject()
            dsp_result = dsp.get_by_db_name(db_name)
            dtu_id = dsp_result.get('id')
            dtp = DtusertToProject()
            dtp_result = dtp.get_by_dtu(dtu_id)
            for projId in dtp_result:
                table_name = "rtdata_"+str(projId)
                sql = "delete from %s where time between '%s' and '%s' and flag=0"%(table_name, startTime, endTime)
                rt = self._mysqlDBContainer.op_db_update('beopdatabuffer', sql, ())
        except Exception as e:
            print('clear_bufferdata error:'+e.__str__())
            logging.error('clear_bufferdata error:'+e.__str__())
        return rt

    def clear_sitedata(self, db_name, startTime, endTime):
        rt = False
        try:
            table_name = "rtdata_" + db_name
            sql = "delete from %s where time between '%s' and '%s'" % (table_name, startTime, endTime)
            rt = self._mysqlDBContainer.op_db_update('beopdoengine', sql, ())
        except Exception as e:
            print('clear_sitedata error:' + e.__str__())
            logging.error('clear_sitedata error:' + e.__str__())
        return rt

    def update_user_by_userId(self, userId, **kwargs):
        '''
        David 20160907
        :param userId:
        :param kwargs:
        :return:
        '''
        rt = False
        try:
            if kwargs:
                strSQL = 'update `user` SET '
                for key in kwargs.keys():
                    if kwargs.get(key) != None:
                        strSQL = strSQL + str(key) + '="' + str(kwargs.get(key)) + '",'
                if strSQL[-1] == ',':
                    strSQL = strSQL[:-1]
                    strSQL = strSQL + ' WHERE `id` = %s'%str(userId)
                    rt = self._mysqlDBContainer.op_db_update('beopdoengine', strSQL, ())
        except Exception as e:
            print('update_user_by_userId error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    def get_project_info_by_projId(self, projId):
        '''
        David 20160926
        :param projId:
        :return:
        '''
        rt = None
        try:
            projId = int(projId)
        except Exception as e:
            raise Exception('Invalid parameter')
        dbname = app.config.get('DATABASE')
        try:
            strSQL = '''
                SELECT
                    p.id,
                    p.name_en,
                    p.name_cn,
                    p.s3dbname,
                    p.mysqlname,
                    p.latlng,
                    p.address,
                    p.name_english,
                    p.pic,
                    p.collectionname,
                    p.is_delete,
                    p.is_advance,
                    p.logo,
                    p.time_format,
                    p.unit_system,
                    p.unit_currency
                FROM
                    project p
                WHERE
                    p.id = %s''' % (projId)

            dbrv = self._mysqlDBContainerReadOnly.op_db_query_one(dbname, strSQL)
            # import pdb;pdb.set_trace()
            if dbrv:
                mysqlname = Constants.REAL_TIME_DB_PREFIX + dbrv[4] if dbrv[4] else ''
                rt = {'id': dbrv[0], 'name_en': dbrv[1], 'name_cn': dbrv[2], 's3dbname': dbrv[3],
                      'mysqlname': mysqlname, 'latlng': dbrv[5], 'address': dbrv[6],
                      'name_english': dbrv[7], 'pic': dbrv[8], 'collectionname': dbrv[9],
                      'id_delete': dbrv[10], 'is_advance': dbrv[11], 'logo': dbrv[12], 'time_format': dbrv[13],
                      'unit_system': dbrv[14], 'unit_currency': dbrv[15], 'datadb': dbrv[4]}
                if dbrv[4]:
                    from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject

                    dtu = DtuServerProject().get_by_db_name(dbrv[4])
                    rt['dsType'] = 'real' if dtu else 'virtual'
        except Exception as e:
            print('get_project_info_by_projId error:' + e.__str__())
            logging.error(e.__str__())
        return rt


    def genCloudSiteMap(self, proj, pointList):
        realPointList = []
        allCloudToSitePoints = RedisManager.get_cloudpoints_site(proj)

        requestSiteToCloudMaps = {}
        if allCloudToSitePoints:
            for pt in pointList:
                ptRealName = allCloudToSitePoints.get(pt)
                if ptRealName:
                    requestSiteToCloudMaps[ptRealName] = pt
                    realPointList.append(ptRealName)
                else:
                    requestSiteToCloudMaps[pt] = pt
                    realPointList.append(pt)
        else:
            realPointList = pointList
        return (realPointList, requestSiteToCloudMaps)

    def get_realtime_data(self, projId, pointList):
        requestSiteToCloudMaps = None
        #filter requests
        if pointList is not None and isinstance(pointList, list):
            pointList = [item for item in pointList if len(item)>0 ]
            if len(pointList)==0:
                return json.dumps(dict(error=1, msg='pointList is array but every item content is all empty.'), ensure_ascii=False)
        #如果点列表不为空，则需要进行现场点的映射处理
        if pointList is not None:
            (realPointList,requestSiteToCloudMaps) =  self.genCloudSiteMap(projId, pointList)
            pointList = realPointList

        data = self.getBufferRTDataByProj(projId,pointList)
        dj = []
        for k,v in data.items():
            if requestSiteToCloudMaps and pointList:
                rtName = requestSiteToCloudMaps.get(k)
                if rtName is None:
                    rtName = k
            else:
                rtName = k
            dj.append(dict(name=rtName, value=v))

        return dj

    def getProjectRoleByLevel(self, projId, level=30):
        dbname = app.config['DATABASE']
        sql = 'select rp.id from role_project rp where rp.projectId = %s and rp.level = %s'
        try:
            rs = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (projId, level))
            role = [item[0] for item in rs]
        except Exception as e:
            role = None
            print( 'getProjectRoleByLevel error:' + e.__str__() )
            logging.error( e.__str__() )
        return role

    def addUserRoles(self, roleIds, userIds):
        rt = False
        dbname = app.config['DATABASE']
        sql = 'insert ignore into user_role (userId, roleId) values '
        arr = []
        for userId in userIds:
            for roleId in roleIds:
                arr.append( '(%s, %s)'%(userId, roleId) )
        sql += ','.join(arr)
        try:
            self._mysqlDBContainer.op_db_update(dbname, sql)
            rt = True
        except Exception as e:
            rt = False
            print( 'addUserRoles error:' + e.__str__() )
            logging.error( e.__str__() )
        return rt

    def getProjectUnitSystem(self, projId):
        rt = None
        try:
            ret = self.findProjectInfoItemById(projId)
            if ret:
                unit = ret.get('unit_system')
                rt = 0 if unit is None else unit
        except Exception as e:
            print( 'getProjectUnitSystem error:' + e.__str__() )
            logging.error( e.__str__() )
        return rt

    def setProjectUnitSystem(self, projId, unit):
        rt = False
        try:
            dbname = app.config.get('DATABASE')
            strQ = 'update project set unit_system=%s where id=%s'
            if self._mysqlDBContainer.op_db_update(dbname, strQ, (unit, projId,)):
                pInfoList = RedisManager.get_project_info_list()
                for item in pInfoList:
                    if item.get('id') == projId:
                        item.update({'unit_system':unit})
                        RedisManager.set_project_info_list(pInfoList)
                        rt = True
                        break
        except Exception as e:
            print( 'setProjectUnitSystem error:' + e.__str__() )
            logging.error( e.__str__() )
        return rt

    def getDtuInfoByDbName(self, mysqlname):
        rt = []
        try:
            dbname = app.config.get('DATABASE')
            sql = "select p.id, p.dtuname, p.dbname, i.online, i.LastOnlineTime, i.LastReceivedTime " \
                  "from dtuserver_prj p,dtuserver_prj_info i where i.id = p.id and p.dbname = %s"
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (mysqlname,))
            if dbrv:
                rt = dbrv
        except Exception as e:
            print('getDtuInfoByDbName error:' + e.__str__() )
            logging.error( e.__str__() )
        return rt

    def getLatestTimeStampByDbName(self, mysqlname):
        rt = None
        try:
            dbname = app.config.get('DATABASE')
            rtTableName = 'rtdata_'+mysqlname
            sql = "SELECT `time` FROM {0} ORDER BY `time` desc limit 1".format(rtTableName)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
            if dbrv:
                if dbrv[0]:
                    rt = dbrv[0][0]
        except Exception as e:
            print('getLatestTimeStampByDbName error:' + e.__str__() )
            logging.error( e.__str__() )
        return rt

    #1为dtu项目，2为手动项目
    def getProjectDTUById(self, projId):
        rt = dict()
        try:
            ret = self.findProjectInfoItemById(projId)
            if ret:
                mysqlname = ret.get('mysqlname')
                if mysqlname:
                    detailList = []
                    detailDict = {}
                    #id, dtuname, dbname, online, LastOnlineTime, LastReceivedTime
                    dtu_list = self.getDtuInfoByDbName(mysqlname)
                    dtutype = 1 if dtu_list else 2
                    rt['projType'] = dtutype
                    rt['dtuNameList'] = [x[1] for x in dtu_list] if dtu_list else []
                    if dtutype == 1:
                        #掉线的dtu的列表
                        #rt['dtuOffNameList'] = [x[1] for x in dtu_list if x[3] == 'Offline'] if dtu_list else []
                        #timeList = [datetime.strptime(x[5], '%Y-%m-%d %H:%M:%S') for x in dtu_list] if dtu_list else []
                        #所有dtu中最后更新的时间
                        #rt['lastUpdateTime'] = max(timeList).strftime('%Y-%m-%d %H:%M:%S') if timeList else None
                        #time, dtuname, state
                        offlineMonthly = self.getDtuOfflineMonthly(mysqlname)
                        for item in offlineMonthly:
                            offtime = item[0]
                            dtuname = item[1]
                            state = item[2]
                            if dtuname not in detailDict:
                                detailDict[dtuname] = dict()
                            if detailDict[dtuname].get('lastState') == 0 and state == 1:
                                span = datetime.strptime(offtime, '%Y-%m-%d %H:%M:%S') - \
                                       datetime.strptime(detailDict[dtuname].get('curTime'), '%Y-%m-%d %H:%M:%S')
                                if span.total_seconds() > 15 * 60:
                                    h = int(span.seconds / 3600)
                                    m = int((span.seconds - h * 3600) / 60)
                                    detailList.append(dict(dtu=dtuname, offTotalTime='%d:%d:%d' % (span.days, h, m),
                                                           offStartTime=detailDict[dtuname].get('curTime'),
                                                           offEndTime=offtime))
                            detailDict[dtuname].update({'curTime': offtime})
                            detailDict[dtuname].update({'lastState':state})
                        dtu_onoff_line_name_list = []
                        for key,value in detailDict.items():
                            lastState = value.get('lastState')
                            if lastState == 0:
                                t_now = datetime.now()
                                span = t_now - datetime.strptime(detailDict[key].get('curTime'), '%Y-%m-%d %H:%M:%S')
                                if span.total_seconds() > 15 * 60:
                                    h = int(span.seconds / 3600)
                                    m = int((span.seconds - h * 3600) / 60)
                                    detailList.append(dict(dtu=key, offTotalTime='%d:%d:%d' % (span.days, h, m),
                                                           offStartTime=detailDict[key].get('curTime'),
                                                           offEndTime=t_now))
                                if key not in dtu_onoff_line_name_list:
                                    dtu_onoff_line_name_list.append(key)
                        # if len(dtu_onoff_line_name_list) != len(rt['dtuOffNameList']):
                        #     rt['msg'] = "table dtuserver_on_offline and dtuserver_prj_info are contradictory"
                        rt['dtuOffNameList'] = dtu_onoff_line_name_list
                        rt['detail'] = detailList
                    else:
                        rt['dtuOffNameList'] = []
                        rt['detail'] = []
                    latestTime = self.getLatestTimeStampByDbName(mysqlname)
                    rt['lastUpdateTime'] = latestTime.strftime('%Y-%m-%d %H:%M:%S') if isinstance(latestTime, datetime) else latestTime
        except Exception as e:
            print( 'getProjectDTUById error:' + e.__str__() )
            logging.error( e.__str__() )
        return rt

    def getDtuOfflineMonthly(self, mysqlname):
        rt = []
        try:
            dbname = app.config.get('DATABASE')
            t_now = datetime.now()
            query_begin = datetime(year=t_now.year, month=t_now.month, day=1).strftime('%Y-%m-%d %H:%M:%S')
            query_end = datetime(year=t_now.year, month=t_now.month,
                                 day=calendar.monthrange(t_now.year, t_now.month)[1],
                                 hour=23, minute=59, second=59).strftime('%Y-%m-%d %H:%M:%S')
            sql = "SELECT a.time, a.dtuname, a.state FROM `dtuserver_on_offline` as a where a.dtuname " \
                  "in (select dtuname from `dtuserver_prj` where dbname=%s) " \
                  "and a.time between %s and %s order by a.dtuname ASC,a.time ASC"
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (mysqlname, query_begin, query_end))
            if dbrv:
               rt = dbrv
        except Exception as e:
            print('getDtuOfflineMonthly error:' + e.__str__() )
            logging.error( e.__str__() )
        return rt

    def getDTUHistory(self, projectId, dtu_list, startTime, endTime):
        rt = []
        dbname = app.config.get('DATABASE')
        if not dtu_list:
            ret = BEOPDataAccess.getInstance().findProjectInfoItemById(projectId)
            if ret:
                mysqlname = ret.get('mysqlname')
                if mysqlname:
                    dtu_list = [x[1] for x in BEOPDataAccess.getInstance().getDtuInfoByDbName(mysqlname)]
                else:
                    raise Exception('projectId=%s is not found'%(projectId,))
        if not startTime or not endTime:
            t_now = datetime.now()
            query_begin = datetime(year=t_now.year, month=t_now.month, day=1).strftime('%Y-%m-%d %H:%M:%S')
            query_end = datetime(year=t_now.year, month=t_now.month,
                                 day=calendar.monthrange(t_now.year, t_now.month)[1],
                                 hour=23, minute=59, second=59).strftime('%Y-%m-%d %H:%M:%S')
        if dtu_list and query_begin and query_end:
            sql = "select `time`,dtuname,state from dtuserver_on_offline where dtuname in ("
            for index, item in enumerate(dtu_list):
                rt.append({'dtu':item, 'history':[]})
                sql += "'" + item + "'"
                if index < len(dtu_list) - 1:
                    sql += ','
            sql += ')'
            sql += " and `time` between %s and %s order by dtuname ASC,`time` ASC"
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, (query_begin, query_end))
            if dbrv:
                for d in dbrv:
                    for h in rt:
                        if h['dtu'] == d[1]:
                            h['history'].append({'time':d[0], 'state':d[2]})
                            break
                for item in rt:
                    his_list = item.get('history')
                    if his_list:
                        delete_index = []
                        for i in range(len(his_list)-1, 0, -1):
                            t_back = datetime.strptime(his_list[i]['time'], '%Y-%m-%d %H:%M:%S')
                            s_back = his_list[i]['state']
                            t_front = datetime.strptime(his_list[i-1]['time'], '%Y-%m-%d %H:%M:%S')
                            s_front = his_list[i-1]['state']
                            # if s_back == 0 and s_front == 1 and (t_back-t_front).total_seconds() <= 15*60:
                            #     if i not in delete_index:
                            #         delete_index.append(i)
                            #     if i-1 not in delete_index:
                            #         delete_index.append(i-1)
                            if s_back == 1 and s_front == 0 and (t_back-t_front).total_seconds() <= 15*60:
                                # if i not in delete_index:
                                #     delete_index.append(i)
                                if i-1 not in delete_index:
                                    delete_index.append(i-1)
                        for index in delete_index:
                            his_list.pop(index)
        return rt

    def createBufferTablesFromService(self, projId):
        rt = False
        r = requests.get("%s/table/createBufferTable/%s" % (app.config.get('BEOP_SERVICE_ADDRESS'), projId),
                headers={'content-type': 'application/json'})
        if r.status_code == 200:
            rt = json.loads(r.text)
        return rt

    def get_v2_struct_seperate_time(self, id):
        try:
            id = int(id)
            projectInfoList = RedisManager.get_project_info_list()
            if projectInfoList is None or type(projectInfoList) is not list:
                return None
            for item in projectInfoList:
                if item['id'] == id:
                    return item.get('v2_time')
        except Exception as e:
            print(e.__str__())
            logging.error('get_v2_struct_seperate_time error:' + e.__str__())
        return None

    def get_project_time_zone_by_id(self, projId):
        projId = int(projId)
        dbname = app.config.get('DATABASE')
        strSQL = 'SELECT data_time_zone FROM project WHERE id = {0}'.format(projId)
        dbrv = self._mysqlDBContainerReadOnly.op_db_query_one(dbname, strSQL)
        if dbrv:
            return dbrv[0]
        else:
            return None


    def get_operation_log(self, projId, startTime, endTime):
        rt = []
        cursor = None
        try:
            mysqlName = self.getProjMysqldb(projId)
            dbname = app.config.get('DATABASE')
            strSQL = 'SELECT * FROM oprecord_%s where RecordTime> "%s" and RecordTime<"%s" order by RecordTime'%(mysqlName,
                          startTime.strftime('%Y-%m-%d %H:%M:%S'), endTime.strftime('%Y-%m-%d %H:%M:%S'))
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strSQL)

            for item in dbrv:
                try:
                    rt.append({'_id':0,
                               'projId': projId,
                               'username':item[1],
                               'time':item[0].strftime('%Y-%m-%d %H:%M:%S'),
                               'content':{'desc':item[2]}})
                except Exception as e:
                    pass
        except Exception as e:
            print('get_operation_log error:' + e.__str__())
            logging.error(e)
        finally:
            if cursor:
                cursor.close()
        return rt

    def saveRtdataUpload(self, fileContent, userId, projectId, fileId, type=0, status=0):
        '''
        :param fileContent:
        :param userId:
        :param projectId:
        :param fileId:
        :param type: 1为上传新点， 0位旧点的备份
        :param status: 0为未更新点表到数据库， 1位以更新点表到数据库
        :return:
        '''
        try:
            dbname = app.config.get('DATABASE')
            utc_update_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.000Z')
            q = 'insert into rtdata_upload_or_backup_records (utc_update_time, fileContent, userId, projectId, fileId, type, status) values (%s, %s, %s, %s, %s, %s, %s)'
            self._mysqlDBContainer.op_db_update(dbname, q,
                                                (utc_update_time, fileContent, userId, projectId, fileId, type, status))
            return True
        except Exception as e:
            print('saveRtdataUpload error:' + e.__str__())
            logging.error(e)
            return False

    def getRtdataUploadList(self, projectId):
        try:
            dbname = app.config.get('DATABASE')
            q = 'select * from rtdata_upload_or_backup_records where projectId = %s and type = 0'
            return self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (int(projectId),))
        except Exception as e:
            print('getRtdataUploadList error:' + e.__str__())
            logging.error(e)
            return False

    def getRtdataUploadDetail(self, fileId):
        try:
            dbname = app.config.get('DATABASE')
            q = 'select * from rtdata_upload_or_backup_records where fileId = %s'
            return self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (fileId,))
        except Exception as e:
            print('getRtdataUploadList error:' + e.__str__())
            logging.error(e)
            return False

    def cleanRtdataBeopdata(self, projectId, deleteNameList, addPointInfoList):
        try:
            mysqlName = self.getProjMysqldb(projectId)
            dbname = app.config.get('DATABASE')
            tableName = 'rtdata_' + mysqlName
            if deleteNameList:
                q = 'delete from %s where pointname in %s'%(tableName, str(deleteNameList).replace('[','(').replace(']',')'),)
                if not self._mysqlDBContainer.op_db_update(dbname, q, ()):
                    raise Exception('mysql删除数据失败，请立即重试')
            if addPointInfoList:
                strsql = 'replace into %s' % tableName + '(time, pointname, pointvalue, flag) values'
                params = []
                for index, pointInfo in enumerate(addPointInfoList):
                    strsql += '(%s, %s, %s, %s),'
                    params.extend([pointInfo.get('time'), pointInfo.get('pointName'), pointInfo.get('pointValue'),0])
                strsql = strsql[:-1]
                if params:
                    if not self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params)):
                        raise Exception('mysql新增失败，请立即重试')
        except Exception as e:
            print('cleanRtdataBeopdata error:' + e.__str__())
            logging.error(e)
            return False
        return True
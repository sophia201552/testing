# -*- coding:utf-8 -*-
import logging, hashlib, requests, json
from random import randrange
from beopWeb.BEOPDataAccess import *

class SendMessage:

    def __init__(self):
        self.userid = 1
        self.account = 'jksc388'
        self.password = 'rnbtech1103'
        self.url = 'http://sh2.ipyy.com/smsJson.aspx'

    def encipher_md5(self, message):
        rt = ''
        try:
            if isinstance(message, str):
                if not isinstance(message, bytes):
                    message = bytes(message, encoding='utf8')
                    m = hashlib.md5(message)
                    rt = m.hexdigest().upper()
        except Exception as e:
            print('encipher_md5 error:' + e.__str__())
            logging.error('encipher_md5 error:' + e.__str__())
        return rt

    def set_post_data(self, message, phonenum, sendTime=''):
        data = ''
        try:
            content = '欢迎使用BEOP智慧服务，您的验证码是：' + str(message) + '。【BEOP智慧服务】'
            mobile = ''
            for num in phonenum:
                mobile = mobile + str(num) + ','
            if len(mobile) > 0:
                if mobile[-1] == ',':
                    mobile = mobile[:-1]
            password = self.encipher_md5(self.password)
            sendTime = sendTime
            data = '?action=send&userid=&account=%s&password=%s&mobile=%s&content=%s&sendTime=%s&extno='\
                   %(self.account, password, mobile, content, sendTime)
        except Exception as e:
            print('set_post_data error:' + e.__str__())
            logging.error('set_post_data error:' + e.__str__())
        return data

    def post_message(self, message, phonenum, sendTime=''):
        rt = False
        try:
            url = self.url + self.set_post_data(message, phonenum, sendTime)
            res = requests.post(url = url)
            rv =json.loads(res.text)
            if rv.get('returnstatus') == 'Success':
                if len(phonenum) == int(rv.get('successCounts')):
                    rt = True
        except Exception as e:
            print('post_message error:' +e.__str__())
            logging.error('post_message error:' +e.__str__())
        return rt

    @staticmethod
    def set_verify_message(key):
        '''
        :param key: str '1@15222779899' format '<userId>@<phonenumber>'
        :return:
        '''
        rt = False
        try:
            phonenum = key.rsplit('@', 1)[1]
            validate_code = randrange(100000, 999999)
            mr = MemcacheManager.set(key, validate_code, time=60)
            if mr:
                bs = SendMessage().post_message(str(validate_code), [phonenum])
                if bs:
                    rt = True
        except Exception as e:
            print('set_verify_message error:' + e.__str__())
            logging.error('set_verify_message error:' + e.__str__())
        return rt

    @staticmethod
    def verify_message(key, validate_code):
        '''
        :param key: str '1@15222779899' format '<userId>@<phonenumber>'
        :param validate_code: The verification code sent to mobile phones
        :return:
        '''
        rt = False
        try:
            if int(validate_code) == int(MemcacheManager.get(key)):
                userId = key.rsplit('@', 1)[0]
                phonenum = key.rsplit('@', 1)[1]
                vai =BEOPDataAccess.getInstance().set_phonenum_by_userid(userId, phonenum)
                if vai:
                    rt = True
        except Exception as e:
            print('verify_message error:' + e.__str__())
            logging.error('verify_message error:' + e.__str__())
        return rt

    @staticmethod
    def check_phonenum_is_used(phonenum):
        rt = False
        try:
            userinfo = BEOPDataAccess.getInstance().get_user_by_phonenum(phonenum)
            if len(userinfo) <= 0:
                rt = True
        except Exception as e:
            print('check_phonenum_is_used' + e.__str__())
            logging.error('check_phonenum_is_used' + e.__str__())
        return rt

    @staticmethod
    def add_user_by_phone(key, validate_code, password, sex):
        rt = False
        try:
            if int(validate_code) == int(MemcacheManager.get(key)):
                phonenum = key.rsplit('@',1)[1]
                userId = BEOPDataAccess.getInstance().add_user_by_phonenum(phonenum, password, sex)
                if userId is not None and userId != -1:
                    rt = True
        except Exception as e:
            print('add_user_by_phone error:' + e.__str__())
            logging.error('add_user_by_phone error:' + e.__str__())
        return rt
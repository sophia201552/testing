# -*- coding: UTF-8 -*-
"""
about token and auth.
"""

__auth__ = 'yan'

from itsdangerous import TimedJSONWebSignatureSerializer as authSerializer, SignatureExpired, BadSignature
from flask import make_response, request
import logging
from beopWeb import app


class AuthManager:
    token_valid = 0
    not_login = 1
    token_invalid = 2
    token_expired = 3
    user_invalid = 4

    checkless_endpoint_list =\
        ['login', 'home', 'workflow.plan_list_today_tasks',
       'getWarningRecoed', 'static', 'get_realtimedata',
       'main', 'share_analysis', 'report_detail', 'springGetMenu',
       'admin.get_share_report_pdf', 'uploadReport', 'admin.send_report_summary_email',
       'admin.get_shared_user_list', 'sendEmail', 'getDataSource',
       'startWorkspaceDataGenHistogramMulti', 'startWorkspaceDataGenPieChart',
       'startWorkspaceDataGenHistogram', 'startWorkspaceDataGenPattern', 'invite_to_register',
       'apply_for_register', 'reset_pwd_email', 'regist', 'forget_password_reset_password',
       'send_reset_pwd_email']

    @staticmethod
    def get_userId():
        return request.cookies.get('userId', None)

    @staticmethod
    def is_url_need_check(endpoint):
        if endpoint in AuthManager.checkless_endpoint_list or \
                        request.headers.get('algorithm') == 'rnbtech2015':  # 对算法的特殊过滤
            return False
        return True

    @staticmethod
    def get_result(enum):
        return enum

    @staticmethod
    def set_cookie(key, value, userId, response_dump_str):
        rp = make_response(response_dump_str)
        rp.set_cookie(key, value)
        rp.set_cookie('userId', str(userId))
        return rp

    @staticmethod
    def generate_auth_token(userId, secretKey, gradeId=0,
                            expiration=app.config.get('TOKEN_EXPIRATION', 3600 * 3)):  # 60*20
        result = ''
        try:
            s = authSerializer(secretKey, expires_in=expiration)
            result = s.dumps({'userId': userId, 'gradeId': gradeId})
        except Exception as e:
            print(e.__str__())
            logging.error(e.__str__())
        return result

    @staticmethod
    def check_token(secretKey):
        result = {}
        userId_token = None
        token = request.cookies.get('token', None)
        userId_cookie = request.cookies.get('userId', None)
        if userId_cookie == None:
            result['status'] = AuthManager.not_login
        else:
            s = authSerializer(secretKey)
            try:
                data = s.loads(token)
                userId_token = data.get('userId')
                if int(userId_cookie) != userId_token:
                    result['status'] = AuthManager.user_invalid
                else:
                    result['status'] = AuthManager.token_valid
            except SignatureExpired:
                result['status'] = AuthManager.token_expired
            except BadSignature:
                result['status'] = AuthManager.token_invalid
        return result

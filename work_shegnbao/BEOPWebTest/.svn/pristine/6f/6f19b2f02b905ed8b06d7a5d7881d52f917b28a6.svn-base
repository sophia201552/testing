# -*- coding: UTF-8 -*-
"""
about token and auth.
"""

__auth__ = 'yan'

from itsdangerous import TimedJSONWebSignatureSerializer as authSerializer, SignatureExpired, BadSignature
from flask import make_response, request
from beopWeb import app
import logging
import traceback
import logging


class AuthManager:
    token_valid = 0
    not_login = 1
    token_invalid = 2
    token_expired = 3
    user_invalid = 4

    secret_key = 'beop.rnbtech.com.hk'

    checkless_endpoint_list = \
        ['login', 'logout', 'home', 'workflow.plan_list_today_tasks',
         'getWarningRecoed', 'static', 'get_realtimedata',
         'main', 'share_analysis', 'report_detail', 'springGetMenu',
         'admin.get_share_report_pdf', 'uploadReport', 'admin.send_report_summary_email',
         'admin.send_report_email', 'admin.get_shared_user_list',
         'sendEmail', 'getDataSource',
         'startWorkspaceDataGenHistogramMulti', 'startWorkspaceDataGenPieChart',
         'startWorkspaceDataGenHistogram', 'startWorkspaceDataGenPattern', 'invite_to_register',
         'apply_for_register', 'reset_pwd_email', 'regist', 'forget_password_reset_password',
         'send_reset_pwd_email', 'factory.factory', 'admin.config_permission', 'admin.set_permission', 'app_dashboard',
         'patrolApp', 'patrol.getPointList', 'patrol.getExecutorList', 'patrol.getMission', 'patrol',
         'patrol.getPathAll', 'patrol.saveLogMulti','patrol.saveLogCache', 'app_temperature_admin', 'app_temperature', 'temp.setControllers',
         'temp.getSchedule', 'temp.getRoomDetail', 'temp.getRoomList', 'workflow.sendWorkflowWeeklyReport',
         'check_user_by_phone', 'add_user_by_phone', 'message.get_message_by_user_id', 'company_index',
         'appCommon.getVersion',
         'page_contact', 'insert_into_contactus', 'set_realtimedata_from_site', 'temp.getRealtimeData', 'factory.factorySave',
         'report.upload_chart', 'send_verify_message_for_forgetpwd', 'forget_pwd_by_phone',
         'logistics']

    #不用进行token检查的路由列表，内容手动输入
    checkless_route = ['externalChainPage']

    @staticmethod
    def get_userId():
        try:
            token = request.cookies.get('token', None)
            if token:
                s = authSerializer(AuthManager.secret_key)
                data = s.loads(token)
                userId_token = data.get('userId')
                return userId_token
        except Exception as e:
            print('get_userId error:' + e.__str__())
            logging.error('get_userId error:' + e.__str__())
        return None

    @staticmethod
    def is_url_need_check(endpoint):
        # import pdb;pdb.set_trace();
        if endpoint in AuthManager.checkless_endpoint_list or \
            request.headers.get('token') in app.config.get('TOKEN_WHITE_LIST') or \
            AuthManager.endpoint_in_checkless_list(endpoint):
            return False
        return True

    @staticmethod
    def endpoint_in_checkless_list(endpoint):
        return True if endpoint in AuthManager.checkless_route else False

    @staticmethod
    def get_result(enum):
        return enum

    @staticmethod
    def set_cookie(key, value, userId, response_dump_str):
        rp = make_response(response_dump_str)
        rp.set_cookie(key, value)
        rp.set_cookie('userId', str(userId))
        rp.delete_cookie('ext_route')
        return rp

    @staticmethod
    def remove_cookie(content):
        rp = make_response(content)
        rp.set_cookie('token', expires=0)
        rp.set_cookie('userId', expires=0)
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

                if data:
                    userId_token = data.get('userId')
                else:
                    result['status'] = AuthManager.user_invalid
                if int(userId_cookie) != userId_token:
                    result['status'] = AuthManager.user_invalid
                else:
                    result['status'] = AuthManager.token_valid
                    result['userId'] = userId_token
            except SignatureExpired:
                print('check_token error: SignatureExpired')
                result['status'] = AuthManager.token_expired
            except BadSignature:
                print('check_token error: BadSignature')
                result['status'] = AuthManager.token_invalid
            except Exception as e:
                print('check_token error:' + e.__str__())
                result['status'] = AuthManager.not_login
        #print('Finally return result: %s' % (str(result)))
        return result

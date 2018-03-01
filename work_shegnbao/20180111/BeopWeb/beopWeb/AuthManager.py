# -*- coding: UTF-8 -*-
"""
about token and auth.
"""

from itsdangerous import TimedJSONWebSignatureSerializer as authSerializer, SignatureExpired, BadSignature
from flask import make_response, request
from beopWeb import app
import logging


class AuthManager:
    token_valid = 0
    not_login = 1
    token_invalid = 2
    token_expired = 3
    user_invalid = 4

    secret_key = 'beop.rnbtech.com.hk'

    checkless_endpoint_list = \
        ['login', 'logout', 'home', 'workflow.plan_list_today_tasks', 'getWarningRecoed', 'static', 'get_realtimedata',
         'main', 'share_analysis', 'report_detail', 'springGetMenu', 'admin.get_share_report_pdf', 'uploadReport',
         'admin.send_report_summary_email', 'admin.send_report_email', 'admin.get_shared_user_list', 'sendEmail',
         'startWorkspaceDataGenHistogramMulti', 'startWorkspaceDataGenPieChart', 'getDataSource',
         'startWorkspaceDataGenHistogram', 'startWorkspaceDataGenPattern', 'invite_to_register',
         'apply_for_register', 'reset_pwd_email', 'regist', 'forget_password_reset_password',
         'send_reset_pwd_email', 'factory.factory', 'admin.config_permission', 'admin.set_permission', 'app_dashboard',
         'patrolApp', 'patrol.getPointList', 'patrol.getExecutorList', 'patrol.getMission', 'patrol',
         'patrol.getPathAll', 'patrol.saveLogMulti', 'patrol.saveLogCache', 'app_temperature_admin', 'app_temperature',
         'temp.setControllers', 'temp.getSchedule', 'temp.getRoomDetail', 'temp.check_timeout', 'temp.getRoomList',
         'workflow.sendWorkflowWeeklyReport', 'check_user_by_phone', 'add_user_by_phone',
         'message.get_message_by_user_id', 'company_index', 'appCommon.getVersion',
         'page_contact', 'insert_into_contactus', 'set_realtimedata_from_site', 'temp.getRealtimeData',
         'factory.factorySave', 'factory.factorySaveReportData', 'factory.factoryRemoveReportData',
         'report.upload_chart', 'send_verify_message_for_forgetpwd', 'forget_pwd_by_phone', 'logistics',
         'get_report_statfile', 'get_expert_container_url', 'admin.v_gen_captcha', 'register_new_user',
         'admin.v_gen_verify_code', 'page_contact_v2', 'platform_view', 'platform_company_index']

    # 不用进行token检查的路由列表，内容手动输入
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
        except SignatureExpired:
            logging.debug("Signature expired!")
        except BadSignature:
            logging.warning("Bad signature!")
        except Exception:
            logging.error("Cannot get user ID from token!", exc_info=True, stack_info=True)
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
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return result

    @staticmethod
    def check_token(secretKey):
        result = {}
        userId_token = None
        token = request.cookies.get('token', None)

        userId_cookie = request.cookies.get('userId', None)

        if userId_cookie is None:
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
                logging.debug('check_token error: SignatureExpired')
                result['status'] = AuthManager.token_expired
            except BadSignature:
                logging.debug('check_token error: BadSignature')
                result['status'] = AuthManager.token_invalid
            except Exception:
                logging.error('Invlaid token! secretkey = %s, token = %s, userId = %s', secretKey, token, userId_cookie)
                result['status'] = AuthManager.not_login
        return result

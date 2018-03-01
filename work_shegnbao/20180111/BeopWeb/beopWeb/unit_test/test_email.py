import unittest
from datetime import datetime

from flask import render_template
from jinja2 import Environment, FileSystemLoader

from beopWeb import app
from beopWeb.mod_common.I18n import I18n
from beopWeb.mod_common.Utils import Utils


class UtilsCase(unittest.TestCase):
    @staticmethod
    def test_alarm_email():
        subject = '报警邮件测试'
        recipients = ['tony.nie@rnbtech.com.hk']
        env = Environment(loader=FileSystemLoader('beopWeb/templates/email/'))
        template = env.get_template('dataAlarmEmail.html')
        html = template.render(alarm={
            'project': 'project',
            'remark': 'remark',
            'email': recipients,
            'alarmTime': datetime.now(),
            'duration': 10,
            'pointName': 'testPointName',
            'type': 1,
            'value': '1234',
            'alarmMsg': '测试布尔量报警信息',
            'alarmGrade': "1",
            'alarmAdvice': '测试处理意见',
            'country_code': 'AU'
        })
        sender = None
        attachment_list = None
        cc = ['tonywhitewhite@hotmail.com']
        bcc = None
        Utils.EmailTool.send_email(subject, recipients, html, sender, attachment_list, cc, bcc)

        html = template.render(alarm={
            'project': 'project',
            'remark': 'remark',
            'email': recipients,
            'alarmTime': datetime.now(),
            'duration': 33,
            'pointName': 'testPointName',
            'type': 2,
            'value': 222,
            'alarmMsg': '测试高低限报警信息',
            'alarmGrade': "2",
            'alarmAdvice': '测试处理意见',
            'highhigh': 123,
            'high': 100,
            'low': 22,
            'country_code': 'CN'
        })
        Utils.EmailTool.send_email(subject, recipients, html, sender, attachment_list, cc, bcc)

    @staticmethod
    def test_send_invitation_email():
        recipients = 'quanshang123@qq.com'
        token = 'pbkdf2:sha1:1000$JMIIIfcl$a9037743fd7471f4fb5e5f6227053f4ec1a5e3ed'
        inviter_email = 'rikan.li@rnbtech.com.hk'
        language = 'zh-CN'
        Utils.EmailTool.send_invitation_email(recipients, token, inviter_email, None, language)

        token = 'pbkdf2:sha1:1000$JMIIIfcl$a9037743fd7471f4fb5e5f6227053f4ec1a5e3ed'
        inviter_email = 'rikan.li@rnbtech.com.hk'
        language = 'en-US'
        Utils.EmailTool.send_invitation_email(recipients, token, inviter_email, None, language)

    @staticmethod
    def test_verify_code():
        account = 'rikan.li@rnbtech.com.hk'
        code = Utils.get_random_num(6)
        subject = 'BeOP verify code'
        send_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with app.test_request_context():
            i18n = I18n()
            i18n.set_lang('zh-CN')
            email_html = render_template('email/verifyCode.html',
                                         configMap={'subject': subject, 'verifyCode': code, 'time': send_time})
            Utils.EmailTool.send_email(subject, html=email_html, recipients=[account])

            i18n = I18n()
            i18n.set_lang('en-US')
            email_html = render_template('email/verifyCode.html',
                                         configMap={'subject': subject, 'verifyCode': code, 'time': send_time})
            Utils.EmailTool.send_email(subject, html=email_html, recipients=[account])

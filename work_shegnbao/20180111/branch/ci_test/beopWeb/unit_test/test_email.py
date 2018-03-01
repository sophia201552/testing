import unittest
from datetime import datetime

from flask import render_template
from jinja2 import Environment, FileSystemLoader

from beopWeb import app
from beopWeb.mod_common.I18n import I18n
from beopWeb.mod_common.Utils import Utils


class UtilsCase(unittest.TestCase):
    def test_alarm_email(self):
        '''
        测试数据报警邮件
        :return:
        '''
        subject = '报警邮件测试'
        recipients = ['rikan.li@rnbtech.com.hk', 'LEFI.LI@RNBTECH.COM.HK']
        env = Environment(loader=FileSystemLoader('../templates/email/'))
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
            'alarmAdvice': '测试处理意见'
        })
        sender = None
        attachment_list = None
        cc = ['quanshang123@qq.com']
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
            'low': 22
        })
        Utils.EmailTool.send_email(subject, recipients, html, sender, attachment_list, cc, bcc)

    def test_send_invitation_email(self):
        '''
        测试邀请用户邮件
        :return:
        '''
        recipients = 'quanshang123@qq.com'
        token = 'pbkdf2:sha1:1000$JMIIIfcl$a9037743fd7471f4fb5e5f6227053f4ec1a5e3ed'
        inviter_email = 'rikan.li@rnbtech.com.hk'
        language = 'zh-CN'
        Utils.EmailTool.send_invitation_email(recipients, token, inviter_email, language)

        token = 'pbkdf2:sha1:1000$JMIIIfcl$a9037743fd7471f4fb5e5f6227053f4ec1a5e3ed'
        inviter_email = 'rikan.li@rnbtech.com.hk'
        language = 'en-US'
        Utils.EmailTool.send_invitation_email(recipients, token, inviter_email, language)

    def test_verify_code(self):
        '''
        测试验证码邮件
        :return:
        '''
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
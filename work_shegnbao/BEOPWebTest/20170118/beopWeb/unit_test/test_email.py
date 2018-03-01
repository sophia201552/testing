import unittest
from beopWeb.mod_common.Utils import Utils
from datetime import datetime
from jinja2 import Environment, FileSystemLoader


class UtilsCase(unittest.TestCase):
    def test_alarm_email(self):
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
            'alarmGrade': '高',
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
            'alarmGrade': '高',
            'alarmAdvice': '测试处理意见',
            'highhigh': 123,
            'high': 100,
            'low': 22
        })
        Utils.EmailTool.send_email(subject, recipients, html, sender, attachment_list, cc, bcc)

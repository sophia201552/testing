__author__ = 'sophia'
import unittest
from datetime import datetime
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import poplib
import time
import sys
class Base006(unittest.TestCase):
    testCaseID = 'Base006'
    projectName = '不选择项目'
    buzName = '监测每天6点邮箱是否收到报表'
    start = 0.0

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.mail()

    def mail(self):
        try:
            # 输入邮件地址, 口令和POP3服务器地址:
            email = app.config['EMAIL_REPORT']
            password = app.config['EMAIL_REPORT_PASSWORD']
            pop3_server = app.config['EMAIL_REPORT_POP3_SERVER']
            four_message=BeopTools.receiveMail(email,password,pop3_server)
            cont=''
            for m in four_message[0][1]:
                mess=m.decode('utf-8')
                if('Date: ' in mess):
                    cont=mess
            mail_time=cont.split(': ')[1]
            last_mailtime=datetime.strptime(mail_time[5:24],'%d %b %Y %H:%M:%S').date()
            if  last_mailtime==datetime.now().date():
                print('报表邮件发送到邮箱中了')
            else:
                 BeopTools.writeLogError(self.logger, '报表邮件没有发送到邮箱中')
                 assert 0,"错误信息[%s]%s--- 报表的邮件没有发送到邮箱中.请查看" % (BeopTools.getTime(), self.testCaseID)
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            assert 0,"错误信息[%s]%s---mail method error:%s!" % (BeopTools.getTime(), self.testCaseID,e.__str__())




    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base006('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
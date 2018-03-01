__author__ = 'sophia'
import unittest
from datetime import datetime
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import poplib
import time
import sys
class WorkFlow004(unittest.TestCase):
    testCaseID = 'WorkFlow004'
    projectName = '不选择项目'
    buzName = '监测新建工单是创建人,审核人,执行人,相关人是否能够收到邮件'
    start = 0.0

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.mail()
        if self.errors:
            BeopTools.writeLogError(self.logger,'\n'.join(self.errors) )
        else:
            BeopTools.writeLogError(self.logger,'运行正常')
        BeopTools.raiseError(self.errors, self.testCaseID)
    def mail(self):
        try:
            time.sleep(300)
            email = app.config['EMAIL_WORKFLOW']
            password = app.config['EMAIL_WORKFLOW_PASSWORD']
            pop3_server = app.config['EMAIL_WORKFLOW_POP3_SERVER']
            for e in range(len(email)):
                four_message=BeopTools.receiveMail(email[e],password,pop3_server)
                if(e==0):
                    count=self.mailcount(four_message,0)
                    if(count==3):
                        print('3封邮件全部收到')
                    else:
                        BeopTools.writeLogError(self.logger, '执行人邮箱中发送的邮件少于3封,请查看')
                        self.errors.append("错误信息[%s]%s--- 执行人邮箱中发送的邮件少于3封,请查看" % (BeopTools.getTime(), self.testCaseID))
                if(e==1):
                    count=self.mailcount(four_message,1)
                    if(count==2):
                        print('2封邮件全部收到')
                    else:
                        BeopTools.writeLogError(self.logger, '审核人邮箱中发送的邮件少于2封,请查看')
                        self.errors.append("错误信息[%s]%s--- 审核人邮箱中发送的邮件少于2封,请查看" % (BeopTools.getTime(), self.testCaseID))
                if(e==2):
                    count=self.mailcount(four_message,0)
                    if(count==3):
                        print('3封邮件全部收到')
                    else:
                        BeopTools.writeLogError(self.logger, '相关人员邮箱中发送的邮件少于3封,请查看')
                        self.errors.append("错误信息[%s]%s--- 相关人员邮箱中发送的邮件少于3封,请查看" % (BeopTools.getTime(), self.testCaseID))

        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            assert 0,"错误信息[%s]%s---mail method error:%s!" % (BeopTools.getTime(), self.testCaseID,e.__str__())

    def mailcount(self,four_message,num):
        count=0
        if(num==0):
            four_message=four_message[0:3]
        else:
            four_message=four_message[0:2]
        for m in range(len(four_message)):
            for f in four_message[m][1]:
                mess=f.decode('utf-8')
                if('Date: ' in mess):
                    mail_time=mess.split(': ')[1]
                    mailtime=datetime.strptime(mail_time[5:24],'%d %b %Y %H:%M:%S')
                    hour=mailtime.hour
                    minu=mailtime.minute
                    now=datetime.now()
                    if  hour==now.hour or hour==now.hour-1:
                        count=count+1
                        print('工单邮件发送到邮箱中了')
        return count




    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(WorkFlow004('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
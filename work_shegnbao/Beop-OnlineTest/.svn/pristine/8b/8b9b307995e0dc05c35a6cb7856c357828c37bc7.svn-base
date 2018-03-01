__author__ = 'woody'
import socket
import unittest
import time
import datetime, sys, json
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import datetime
class Base012(unittest.TestCase):
    testCaseID = 'Base012'
    projectName = '不选择项目'
    buzName = 'jaince '
    url='http://beop.rnbtech.com.hk/v2/fault/getRealtime'
    data={"projId":49,"moduleId":"582ad7a3833c971b73040f6c"}
    emails = ['sophia.zhao@rnbtech.com.hk']
    suiteName = '基础测试集'
    status = None
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    def Test(self):
        errors = []
        if not self.status:
            self.status = self.start
        deltime = (self.status - self.start).seconds/60
        if self.start.isoweekday() not in [6,7]:
            if deltime == 0 or deltime>30:
                try:
                    rv=BeopTools.postDataExcept(self.url,self.data,10)
                    if rv['success']:
                        ana=rv.get('data',0)[0]
                        id=ana.get('_id',0)
                        affect=ana.get('affect',0)
                        analysis=ana.get('analysis',0)
                        problem=ana.get('problem',0)
                        suggestion=ana.get('suggestion',0)
                        return_time=ana.get('time',0)
                        return_time=return_time.split(' ')[0]+" "+return_time.split(' ')[1].split(':')[0]
                        return_time=datetime.datetime.strptime(return_time,"%Y-%m-%d %H")
                        now=datetime.datetime.now()
                        now1=now.strftime("%Y-%m-%d %H")
                        now=datetime.datetime.strptime(now1,"%Y-%m-%d %H")
                        hours=str(now-return_time)
                        if('day' in hours):
                            hour=int(str(now-return_time).split(' ')[0])*24+int(str(now-return_time).split(', ')[1].split(':')[0])
                        else:
                            hour=int(str(now-return_time).split(':')[0])
                        if(id=='DoNotDeleteEdit_1' and affect=='22' and analysis=='test' and problem=='11' and suggestion=='33' and hour<=4):
                            print('返回值都没有问题')
                        else:
                            errors.append('[%s]%s--返回值中预期id=DoNotDeleteEdit_1实际为%s,affect=22实际为%s,analysis=test实际为%s,problem=11实际为%s,suggestion=33实际为%s,time=%s实际为%s,'%(BeopTools.getTime(),self.testCaseID,id,affect,analysis,problem,suggestion,now1,return_time))
                except Exception as e:
                    errors.append('[%s]%s---%s' %(BeopTools.getTime(),self.testCaseID,e.__str__()))
                if errors:
                    BeopTools.send_email(self.emails, self.suiteName, errors, self.testCaseID)
                else:
                    pass





    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base012('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


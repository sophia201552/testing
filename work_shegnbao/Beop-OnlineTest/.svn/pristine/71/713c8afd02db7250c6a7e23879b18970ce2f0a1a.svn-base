__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time
from datetime import datetime


class WorkFlow002(unittest.TestCase):
    testCaseID = 'WorkFlow002'
    projectName = "不针对项目"
    buzName = '测试获取工单获取项目接口'
    timeout = 15
    serverip = app.config['SERVERIP']
    url_get_group='http://%s/workflow/users/group/2265'% (serverip)
    url=[url_get_group]
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.workFlow()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def workFlow(self):
        try:
            for  u in self.url:
                rv = BeopTools.getDataExcept(url=u, timeout=self.timeout,testCaseID=self.testCaseID)
                if (isinstance(rv, dict) and rv.get('success') ):
                    print('使用正确的参数返回值正确%s' % str(rv))
                else:
                    self.errors.append("错误信息[%s]%s--- 调用%s接口返回值success不为True,为%s!" % (BeopTools.getTime(), self.testCaseID, self.url_get, str(rv)))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            assert 0, "错误信息[%s]%s---workFlow method error:%s!" % (BeopTools.getTime(), self.testCaseID, e.__str__())

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(WorkFlow002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

__author__ = 'woody'
import unittest
import sys, time
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

CONNECTION_URL = "http://120.26.8.236:8080/getnetstat"
TIMEOUT = 10
MAX = 10000

class Base001(unittest.TestCase):
    testCaseID = 'Base001'
    projectName = "并发数"
    buzName = '获取国服并发数并判断'
    errors = []


    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))




    def Test(self):
        self.errors = []
        connections = self.getConnections()
        for key, value in connections.items():
            if int(value) > MAX:
                self.errors.append("错误信息[%s]%s---国服%s并发数为%s超过了%s!" % (BeopTools.getTime(), self.testCaseID, key, str(value), MAX))
        BeopTools.raiseError(self.errors, self.testCaseID)



    def getConnections(self):
        a = BeopTools()
        rt = {}
        try:
            rt = a.getData(url=CONNECTION_URL, timeout=TIMEOUT)
        except Exception as e:
            print(self.testCaseID, e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---访问%s接口失败!" % (a.getTime(), self.testCaseID, CONNECTION_URL))
            a.raiseError(self.errors, self.testCaseID)
        return rt


    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


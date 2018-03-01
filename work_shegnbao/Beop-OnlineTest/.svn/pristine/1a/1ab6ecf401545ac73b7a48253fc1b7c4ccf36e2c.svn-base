__author__ = 'kirry'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time,datetime


class Autorepair002(unittest.TestCase):
    testCaseID = 'Autorepair002'
    projectName = "不针对项目"
    buzName = '自动补数进程（6个）都正常'
    error = []

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.url = "http://dev.rnbtech.com.hk/autorepair/status"

    def Test(self):
        a = BeopTools()
        now = datetime.datetime.now().day
        rv = self.getData()
        if rv:
            for status in rv:
                statuss = rv[status]
                hearttime = statuss["heartbeattime"]
                taskDoing = statuss["taskDoing"]
                hearttime = datetime.datetime.strptime(hearttime,"%Y-%m-%d %H:%M:%S")
                if isinstance(taskDoing,dict):
                    time.sleep(5*60)
                    rv = self.getData()
                    hearttime1 = rv[status]["heartbeattime"]
                    hearttime1 = datetime.datetime.strptime(hearttime1,"%Y-%m-%d %H:%M:%S")
                    if hearttime1>hearttime:
                        print("补数的时间内补数进程正常！")
                    else:
                        self.error.append("补数进程%s，没有运行！"%status)
        a.raiseError(self.error,self.testCaseID)

    def getData(self):
        a = BeopTools()
        try:
            rv = a.getJson(self.url)
        except Exception as e:
            print(e.__str__())
            self.error.append("接口%s请求超时！"%self.url)
        return eval(rv)

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Autorepair002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
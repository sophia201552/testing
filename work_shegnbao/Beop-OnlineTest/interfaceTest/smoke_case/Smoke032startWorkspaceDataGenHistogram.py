__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import json



class Smoke032(unittest.TestCase):
    testCaseID = 'Smoke032'
    projectName = "无"
    buzName = '通过data-id获取历史数据接口'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout = 10
    serverip = app.config['SERVERIP']
    url = "http://%s/analysis/startWorkspaceDataGenHistogram" % serverip
    data = {"dsItemIds":["55ee6248833c97057362d58f","55ee6248833c97057362d58a","55ee6248833c97057362d58e","55ee6248833c97057362d58b","55ee6248833c97057362d58c","55ee6248833c97057362d592","55ee7253833c9705723eb35f","55ee7253833c9705723eb362","55ee7253833c9705723eb361","55ee7253833c9705723eb360","55ef9b1b833c9705723eb7a1","55d19424833c975b9bdbe8ce","55d19424833c975b9bdbe8cd","55ee6248833c97057362d58e","55d1947c833c975b9bdbe8df"],"timeEnd":"2016-09-28 10:27:57","timeFormat":"d1","timeStart":"2016-09-21 10:27:57"}








    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        try:
            r = BeopTools.postJsonToken(self.url, self.data, t=self.timeout)
        except Exception as e:
            self.errors.append("错误信息[%s]%s---接口:%s 数据:%s         异常信息: %s" % (BeopTools.getTime(), self.testCaseID,
                                        self.url, json.dumps(self.data), e.__str__()))

        BeopTools.raiseError(self.errors, self.testCaseID)





    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke032('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

__author__ = 'Murphy'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import json


class Smoke040(unittest.TestCase):
    testCaseID = 'Smoke040'
    projectName = "上海华为"
    buzName = '诊断概览右上角三幅图'
    start = 0.0
    now = 0
    errors = []
    timeout = 10
    serverip = app.config['SERVERIP']
    url = "http://%s/analysis/startWorkspaceDataGenHistogram" % serverip
    data1 = {"dsItemIds":["564c0c65833c9741253e8546"],"timeStart":"","timeEnd":"","timeFormat":"h1"}
    data2 = {"dsItemIds":["564be80a833c9740ff8ba215"],"timeStart":"","timeEnd":"","timeFormat":"h1"}
    data3 = {"dsItemIds":["564be946833c9740ff8ba216"],"timeStart":"","timeEnd":"","timeFormat":"h1"}
    strStart = ""
    strEnd = ""

    def setUp(self):
        self.start = datetime.datetime.now()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.strStart = (datetime.datetime.now() + datetime.timedelta(hours=-23)).strftime("%Y-%m-%d %H:00:00")
        self.strEnd = time.strftime("%Y-%m-%d %H:00:00", time.localtime())
        self.data1["timeStart"] = self.strStart
        self.data1["timeEnd"] = self.strEnd
        self.data2["timeStart"] = self.strStart
        self.data2["timeEnd"] = self.strEnd
        self.data3["timeStart"] = self.strStart
        self.data3["timeEnd"] = self.strEnd

    def Test(self):
        self.errors = []
        try:
            data = {}
            data = self.data1
            r = BeopTools.postJsonToken(self.url, data, t=self.timeout)

            data = self.data2
            r = BeopTools.postJsonToken(self.url, data, t=self.timeout)

            data = self.data3
            r = BeopTools.postJsonToken(self.url, data, t=self.timeout)
        except Exception as e:
            self.errors.append("错误信息[%s]%s---接口:%s 数据:%s         异常信息: %s" % (BeopTools.getTime(), self.testCaseID,
                                        self.url, json.dumps(data), e.__str__()))

        BeopTools.raiseError(self.errors, self.testCaseID)

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke040('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

__author__ = 'Murphy'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import json


class Smoke041(unittest.TestCase):
    testCaseID = 'Smoke041'
    projectName = "上海华为"
    buzName = '能耗概览右上角三幅图'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout = 10
    serverip = app.config['SERVERIP']
    url = "http://%s/analysis/startWorkspaceDataGenHistogram" % serverip
    data1 = {"dsItemIds":["577dc3c0833c9701bcf2c3e6"],"timeEnd":"2017-02-07 17:00:00","timeFormat":"h1","timeStart":"2017-02-06 18:00:00"}
    data2 = {"dsItemIds":["56559327833c970d4efdf18d", "564c1d40833c9741253e8576"],"timeEnd":"2017-02-07 17:00:00","timeFormat":"h1","timeStart":"2017-02-06 18:00:00"}
    data3 = {"dsItemIds":["5656a080833c970d4efdf26a", "5656a080833c970d4efdf26c"],"timeEnd":"2017-02-07 17:00:00","timeFormat":"h1","timeStart":"2017-02-06 18:00:00"}
    data4 = {"dsItemIds":["584f7b21833c9754f6c13383","584f7b21833c9754f6c13384","584f7b21833c9754f6c13385","584f7b21833c9754f6c13387","584f7b21833c9754f6c13386","584f7b21833c9754f6c13388"],"timeEnd":"2017-02-07 17:00:00","timeFormat":"h1","timeStart":"2017-02-06 18:00:00"}

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

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

            data = self.data4
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
    suite.addTest(Smoke041('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

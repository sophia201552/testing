__author__ = 'woody'
import unittest, sys
import time
import datetime
from interfaceTest import app
from interfaceTest.Methods.BeopTools import *
import requests


serverip = app.config['SERVERIP']
url = "http://" + serverip + "/analysis/startWorkspaceDataGenPieChart"
class Smoke025(unittest.TestCase):

    testCaseID = 'Smoke025'
    projectName = '不选择项目'
    buzName = '数据分析云点接口'
    start = 0.0
    data = {"dsItemIds":["@80|time_update_bacnet_sismtrance_svr"]}
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        result = 'Null'
        a = BeopTools()
        r = a.postData(url,data=self.data,t=30)
        try:
            result = r['dsItemList'][0]['data']
            print(result)
        except KeyError:
            assert 0,"没有找到数据点的内容!"
        if result == 'Null':
            assert 0, "调用url: %s 发送数据%s 返回结果为%s, 应为时间字符串!" % (url, json.dumps(self.data), result)

        try:
            c = time.strptime(result,"%Y-%m-%d %H:%M:%S")
            print("test ok!")
        except Exception:
            assert 0, "调用url: %s 发送数据%s 返回结果为%s, 应为时间字符串!" % (url, json.dumps(self.data), result)

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke025('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

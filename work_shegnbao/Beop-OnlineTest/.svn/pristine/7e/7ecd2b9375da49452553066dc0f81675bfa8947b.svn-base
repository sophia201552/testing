__author__ = 'woody'
import unittest
import time
import datetime, sys
from interfaceTest import app
from interfaceTest.Methods.BeopTools import *
import requests
url = 'http://%s/' % app.config['SERVICE_URL']
class Base005(unittest.TestCase):
    testCaseID = 'Base005'
    projectName = '不选择项目'
    buzName = '监测BeopService.py是否在运行'
    start = 0.0

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        try:
            r = requests.get(url,timeout=10)
        except Exception:
            assert 0,"错误信息读取BeopService接口失败,超过%d秒!可能服务已挂。" %10
        if r.status_code != 200:
            assert 0,"错误信息本次发送get请求%s接口返回状态不为200!" % url
        else:
            print("本次发送get请求%s接口数据成功!" % url)
        rv = r.text
        if rv == "service working!":
            print("BeopService服务正常!")
        else:
            assert 0,"错误信息BeopService服务不正常，可能已经崩溃，请检查!"



    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base005('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
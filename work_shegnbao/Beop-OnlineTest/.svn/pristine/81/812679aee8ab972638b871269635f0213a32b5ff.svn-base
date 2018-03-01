__author__ = 'kirry'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time,datetime


class Autorepair003(unittest.TestCase):
    testCaseID = 'Autorepair003'
    projectName = "不针对项目"
    buzName = '在测试项目里3：30am删除某个测试点的（昨天2am-3am、前天2am-3am、大前天2am-3am）的数据，等6点左右检查是否已经补齐'

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        pass

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


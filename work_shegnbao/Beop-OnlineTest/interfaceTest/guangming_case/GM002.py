﻿__author__ = 'sophia'
import time
import datetime
import unittest

from interfaceTest.Methods.BeopTools import *
from interfaceTest import app


class GM002(unittest.TestCase):
    testCaseID = 'GM002'
    projectName = "光明项目"
    buzName = '合格率历史查询/logistics/thing/getStatisticalList/<type>'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    type=[0,1]

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        for t in self.type:
            self.check(t)
        if self.errors:
            BeopTools.writeLogError(self.logger, '\n'.join(self.errors))
            BeopTools.raiseError(self.errors, self.testCaseID)
        else:
            BeopTools.writeLogError(self.logger, '错误个数为0!')



    def check(self,t):
        addr = "http://%s/logistics/thing/getStatisticalList/%d" % (app.config['SERVERIP'],t)
        timeEnd = self.start.strftime("%Y-%m-%d 00:00:00")
        data={"projId":425,"startTime":timeEnd,"endTime":timeEnd}
        rt=None
        rt = BeopTools().postToken(url=addr, Data=data,timeout=20,name=app.config['NAME'],passwd=app.config['PWD'],loginUrl="http://%s/login"%app.config['SERVERIP'])
        if rt and isinstance(rt, dict) :
            rt=rt.get("data",0)
            if rt:
                print("返回值的值有数据")
            else:
                self.errors.append("错误信息光明实时数据的接口预期有值实际返回值分别为%s" % (str(rt)))
        else:
            self.errors.append("错误信息光明实时数据的接口预期有值实际返回值为%s" % (rt))

    def tearDown(self):
        self.offline = False
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(GM002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


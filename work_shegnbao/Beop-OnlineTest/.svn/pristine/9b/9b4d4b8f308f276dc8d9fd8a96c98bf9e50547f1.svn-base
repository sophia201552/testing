__author__ = 'sophia'
import time
import datetime
import unittest

from interfaceTest.Methods.BeopTools import *
from interfaceTest import app


class GM001(unittest.TestCase):
    testCaseID = 'GM001'
    projectName = "光明项目"
    buzName = '实时数据接口/logistics/thing/getDataList'
    start = 0.0
    now = 0
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.check()
        if self.errors:
            BeopTools.writeLogError(self.logger, '\n'.join(self.errors))
            BeopTools.raiseError(self.errors, self.testCaseID)
        else:
            BeopTools.writeLogError(self.logger, '错误个数为0!')



    def check(self):
        addr = "http://%s/logistics/thing/getDataList" % app.config['SERVERIP']
        rt=None
        rt = BeopTools().getToken(url=addr, timeout=20,name=app.config['NAME'],passwd=app.config['PWD'],loginUrl="http://%s/login"%app.config['SERVERIP'])
        if rt and isinstance(rt, dict):
            rt=rt.get("data",0)
            tran=rt.get("transporters",0)
            ware=rt.get("warehouses",0)
            if tran and ware:
                print("返回值的值有数据")
            else:
                self.errors.append("错误信息光明实时数据的接口transporters和warehouses返回值分别为%s,%s" % (str(tran),str(ware)))
        else:
            self.errors.append("错误信息光明实时数据的接口返回值为%s" % (rt))

    def tearDown(self):
        self.offline = False
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(GM001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


__author__ = 'sophia'
import time
import datetime
import unittest

from interfaceTest.Methods.BeopTools import *
from interfaceTest import app


class GM005(unittest.TestCase):
    testCaseID = 'GM005'
    projectName = "光明项目"
    buzName = '获取光明牛奶项目的仓库和奶车合格率信息并整合成报表形式logistics/report/getStatisticalList'
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
        addr = "http://%s/logistics/report/getStatisticalList/" % (app.config['SERVERIP'])
        timeEnd = self.start.strftime("%Y-%m-%d 00:00:00")
        data={"projId":425,"startTime":timeEnd,"endTime":timeEnd}
        rt=None
        rt = BeopTools().postToken(url=addr, Data=data,timeout=20,name=app.config['NAME'],passwd=app.config['PWD'],loginUrl="http://%s/login"%app.config['SERVERIP'])
        if rt and isinstance(rt, dict):
            tran=rt.get("transporter",0)
            if tran.get("data",0):
                print("返回值的值有数据")
            else:
                self.errors.append("错误信息光明整合成报表形式的接口移动点预期有值实际返回值为%s" % (str(tran)))

            ware=rt.get("warehouse",0)
            if  ware.get("data",0):
                print("返回值的值有数据")
            else:
                self.errors.append("错误信息光明整合成报表形式的接口固定点有值实际返回值为%s" % (str(ware)))
        else:
            self.errors.append("错误信息光明整合成报表形式的接口返回值为%s" % (rt))

    def tearDown(self):
        self.offline = False
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(GM005('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


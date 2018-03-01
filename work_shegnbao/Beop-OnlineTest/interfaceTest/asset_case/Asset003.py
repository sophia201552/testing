__author__ = 'kirry'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time


class Asset003(unittest.TestCase):
    testCaseID = 'Asset003'
    projectName = "不针对项目"
    buzName = 'Asset接口测试'
    timeout = 15
    serverip = app.config['SERVERIP']
    url = "http://%s/asset/getThingsMaintainRecords/1"%serverip
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
    #获取资产维修信息
    def Test(self):
        rv = False
        self.error = []
        a = BeopTools()
        try:
            rv = a.getData(url=self.url,timeout=self.timeout)
        except Exception as e:
            print(e.__str__())
            self.error.append("接口%s请求时间超过%ss后未接口未响应"%(self.url,self.timeout))
        if rv and isinstance(rv,dict):
            others = 0
            total = rv.get('total')
            rv.pop('total')
            other = rv.values()
            for ot in other:
                others+=int(ot)
            if others == int(total):
                print("接口返回数据中的修理总次数和各项的和相同！")
            else:
                self.error.append("返回数据中的总次数为%s,其他各项次数和为%s,两个数据不同，请检查接口返回数据是否正常！"%(total,others))
        else:
            self.error.append("返回数据有误！")
        a.raiseError(self.error,self.testCaseID)
    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Asset003('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)






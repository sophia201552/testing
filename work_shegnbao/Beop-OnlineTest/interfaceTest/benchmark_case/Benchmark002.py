__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time


class Benchmark002(unittest.TestCase):
    testCaseID = 'Benchmark002'
    projectName = "不针对项目"
    buzName = '测试/benchmark/diagnosis/get/获取诊断信息列表接口'
    timeout = 15
    serverip = app.config['SERVERIP']
    # serverip = app.config['SERVER208']
    url = "http://%s/benchmark/diagnosis/get/" % (serverip)

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.getDiagnosis()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def getDiagnosis(self):
        data_correct = ['72','19','96']
        data_wrong = ['None','-1']
        try:
            for p in range(len(data_correct)):
                try:
                    rv = BeopTools.getData(self, url=self.url+data_correct[p],timeout=self.timeout)
                except Exception as e:
                    print(e.__str__())
                    BeopTools.writeLogError(self.logger, e.__str__())
                    assert 0, "错误信息[%s]%s--- 调用%s接口失败!" % (BeopTools.getTime(), self.testCaseID, self.url)
                if (isinstance(rv,dict) and rv.get("status")==1):
                    print('使用正确的参数返回值正确%s' % str(rv))
                else:
                    self.errors.append("错误信息[%s]%s--- 调用%s接口返回值statud不为1,为%s!" % (BeopTools.getTime(), self.testCaseID, self.url,str(rv)))

            for p in range(len(data_wrong)):
                try:
                    rv = BeopTools.getData(self, url=self.url+data_wrong[p], timeout=self.timeout)
                except Exception as e:
                    print(e.__str__())
                    BeopTools.writeLogError(self.logger, e.__str__())
                    assert 0, "错误信息[%s]%s---调用%s接口失败!" % (BeopTools.getTime(), self.testCaseID, self.url)
                if (isinstance(rv,dict) and rv.get("status")==0):
                    print('使用错误的参数返回值正确%s' %str(rv))
                else:
                    self.errors.append("错误信息[%s]%s--- 调用%s接口返回值status不为1,返回结果为%s!" % ( BeopTools.getTime(), self.testCaseID, self.url, str(rv)))

        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            assert 0, "错误信息[%s]%s---getDiagnosis函数出现异常%s!"  % (BeopTools.getTime(), self.testCaseID,e.__str__())

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Benchmark002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

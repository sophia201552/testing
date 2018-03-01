__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time
import json


class Benchmark003(unittest.TestCase):
    testCaseID = 'Benchmark003'
    projectName = "不针对项目"
    buzName = '测试benchmark/importHistoryData导入excel历史数据用于显示预测接口'
    timeout = 15
    serverip = app.config['SERVERIP']
    # serverip = app.config['SERVER208']
    url = "http://%s/benchmark/importHistoryData" % (serverip)

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.importHistory()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def importHistory(self):
        pa='%s/test.xlsx'%sys.path[0]
        data_correct = {'file': open('%s/benchmark_case/test.xlsx'%sys.path[0], 'rb')}
        # data_correct = {'file': open('test.xlsx', 'rb')}
        try:
            try:
                rv = BeopTools.postDataFiles(url=self.url, files=data_correct, timeout=self.timeout)
            except Exception as e:
                    print(e.__str__())
                    BeopTools.writeLogError(self.logger, e.__str__())
                    assert 0, "错误信息[%s]%s---调用%s接口使用%s参数失败!" % (BeopTools.getTime(), self.testCaseID, self.url, data_correct)
            data={'outdoorbin': [20.0, 20.0, 20.0]}
            time=['2016-02-03 00:00:00', '2016-02-04 00:00:00', '2016-02-05 00:00:00']
            if (isinstance(rv, dict) and rv['status']==1 and rv['data']== data and rv['time']== time):
                print('使用正确的参数返回值正确%s'%str(rv))
            else:
                self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值satus不为1,为%s!" % (BeopTools.getTime(), self.testCaseID, self.url, data_correct, str(rv)))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            assert 0, "错误信息[%s]%s---importHistory函数出现异常%s!"  % (BeopTools.getTime(), self.testCaseID,e.__str__())

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Benchmark003('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

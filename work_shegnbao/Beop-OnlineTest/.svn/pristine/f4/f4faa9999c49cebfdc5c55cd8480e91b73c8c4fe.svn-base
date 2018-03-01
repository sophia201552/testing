__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time


class Benchmark001(unittest.TestCase):
    testCaseID = 'Benchmark001'
    projectName = "不针对项目"
    buzName = '测试/benchmark/diagnosis/getPredict获取若解决诊断当天的增量曲线接口'
    timeout = 15
    # serverip = app.config['SERVER208']
    serverip = app.config['SERVERIP']
    projectId = 76
    url_getPredict = "http://%s/benchmark/diagnosis/getPredict" % (serverip)

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.getPredict()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def getPredict(self):
        data_getPre_correct = [(['二次泵供水温度未变动'], 72, '2016-08-01 15:34:22', '2016-08-12 00:00:00')]
        data_getPre_wrong = [(None, None, None, None),(['房间温度偏热', ''], 72, '', '')]
        try:
            for p in range(len(data_getPre_correct)):
                data = {'arrFault': data_getPre_correct[p][0], 'projectId': data_getPre_correct[p][1],
                        'startTime': data_getPre_correct[p][2], 'endTime': data_getPre_correct[p][2]}
                try:
                    rv = BeopTools.postData(self, url=self.url_getPredict, data=data, t=self.timeout)
                except Exception as e:
                    print(e.__str__())
                    BeopTools.writeLogError(self.logger, e.__str__())
                    assert 0, "错误信息[%s]%s--- 调用%s接口使用%s参数失败!" % (BeopTools.getTime(), self.testCaseID, self.url_getPredict, data)
                if (isinstance(rv, dict) and rv.get('status')==1):
                    print('使用正确的参数返回值正确%s'%str(rv))
                else:
                    self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值status不为1,为%s!" % (BeopTools.getTime(), self.testCaseID, self.url_getPredict, data, str(rv)))

            for p in range(len(data_getPre_wrong)):
                data = {'arrFault': data_getPre_wrong[p][0], 'projectId': data_getPre_wrong[p][1],
                        'startTime': data_getPre_wrong[p][2], 'endTime': data_getPre_wrong[p][2]}
                try:
                    rv = BeopTools.postData(self, url=self.url_getPredict, data=data, t=self.timeout)
                except Exception as e:
                    print(e.__str__())
                    BeopTools.writeLogError(self.logger, e.__str__())
                    assert 0, "错误信息[%s]%s---调用%s接口使用%s参数失败!" % (BeopTools.getTime(), self.testCaseID, self.url_getPredict, data)
                if (isinstance(rv, dict) and rv.get('status')==0):
                    print('使用错误的参数返回值正确%s' % str(rv) )
                else:
                    self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回status不为0,为%s!" % ( BeopTools.getTime(), self.testCaseID, self.url_getPredict, data, str(rv)))

        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            assert 0, "错误信息[%s]%s---getPredict method error:%s!"  % (BeopTools.getTime(), self.testCaseID,e.__str__())

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Benchmark001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

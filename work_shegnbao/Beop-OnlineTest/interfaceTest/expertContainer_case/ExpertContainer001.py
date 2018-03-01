__author__ = 'woody'
import unittest
from interfaceTest.Methods.BeopTools import BeopTools
import sys
import time
from interfaceTest import app
import json

TIMEOUT = 10
class Expert001(unittest.TestCase):
    testCaseID = 'Expert001'
    projectName = "ExpertContainer"
    buzName = 'ExpertContainer/diagnosis/onlinetest接口'
    a = BeopTools()
    url = "http://%s/test/diagnosis/onlinetest" % (app.config['EXPERT_CONTAINER_URL'])
    data = dict(
                 projId = 4,
                 buildingName = 'woody',
                 subBuildingName = '冷水系统',
                 faultName = 'woody_test',
                 faultDescription = 'test for diagnosis',
                 energy = 0,
                 alarmGrade = 1,
                 bindPoints = 'A,B'
            )




    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = self.a.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))



    def Test(self):
        self.errors = []
        rv = False
        try:
            rv = self.a.postJsonToken(url=self.url, data=self.data, t=TIMEOUT)
        except Exception as e:
            self.a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---发送数据%s 访问%s接口出错!" % (self.a.getTime(), json.dumps(self.data, ensure_ascii=False), self.testCaseID, self.url))
            self.a.raiseError(self.errors, self.testCaseID)
        if rv:
            print("添加诊断信息成功!")
        else:
            self.errors.append("错误信息[%s]%s---访问%s接口发送%s数据返回结果为False!请检查!" %(self.a.getTime(), self.testCaseID, self.url, json.dumps(self.data, ensure_ascii=False)))
        self.a.raiseError(self.errors, self.testCaseID)


    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Expert001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

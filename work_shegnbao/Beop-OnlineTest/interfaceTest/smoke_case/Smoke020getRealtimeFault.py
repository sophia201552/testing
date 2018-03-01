__author__ = 'wuranxu'
import requests
from interfaceTest.Methods.BeopTools import *
import unittest, sys
from interfaceTest import app
from datetime import datetime
import json
serverip = app.config['SERVERIP']
faultUrl1 = "http://%s/diagnosis/getRealtimeFault/72" % serverip
faultUrl2 = "http://%s/diagnosis/getRealtimeFault/80/1" % serverip


class Smoke020(unittest.TestCase):
    testCaseID = 'Smoke020'
    projectName = '不选择项目'
    buzName = '系统诊断页面故障接口'
    start = 0.0

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.get_realFault()
        print("ok")


    def get_realFault(self):
        a = BeopTools()
        value1 = a.getData(faultUrl1, 10)
        value2 = a.getData(faultUrl2, 10)
        value = value1 + value2
        if len(value) == 0:
            assert 0, "世纪商贸以及上海华为都没有诊断条目,请检查!"
        else:
            try:
                for i in range(len(value)):
                    if value[i]['description'] == "" or value[i]['equipmentId'] == "":
                        assert 0, json.dumps(value[i]) + "该诊断项描述或者设备id丢失!"
            except Exception as e:
                assert 0, json.dumps(value[i]) + "没有equipmentId或者description!"
        print("世纪商贸以及上海华为诊断条目正常!")


    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke020('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
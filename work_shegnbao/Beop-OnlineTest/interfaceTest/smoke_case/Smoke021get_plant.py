__author__ = 'wuranxu'
import requests, sys
from interfaceTest.Methods.BeopTools import *
import unittest
from interfaceTest import app
from datetime import datetime
import json
serverip = app.config['SERVERIP']
floors = [10000000,10000001,10000002,10000003,10000004]
urls = []
urls.append("http://%s/get_plant/72/200001284/1" % serverip)
for f in floors:
    urls.append("http://%s/get_plant/72/%s/1" % (serverip,f))

urls2 = []
floors2 = [620004730,650004795,620004731]
for f in floors2:
    urls2.append("http://%s/get_plant/72/%s/1" % (serverip,f))


class Smoke021(unittest.TestCase):
    testCaseID = 'Smoke021'
    projectName = '不选择项目'
    buzName = '系统诊断页面楼层接口'
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
        for url in urls:
            value = a.getData(url,10)
            try:
                if len(value['equipments']) < 10:
                    assert 0,"%s接口返回设备信息小于10!" % url
                if len(value['texts']) == 0:
                    assert 0,"%s接口返回房间信息小于40!" % url
                if len(value["buttons"]) < 5:
                    assert 0,"%s接口返回楼层按钮少于5个!" % url
            except Exception as e:
                assert 0,"%s信息有误，请检查!" % url

        for url in urls2:
            value = a.getData(url,10)
            try:
                if len(value['equipments']) < 10:
                    assert 0,"%s接口返回设备信息小于10!" % url
                if len(value['texts']) == 0:
                    assert 0,"%s接口返回房间信息小于40!" % url
            except Exception as e:
                assert 0,"%s信息有误，请检查!" % url


    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke021('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
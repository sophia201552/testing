__author__ = 'woody'
import requests
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
import json
import time, sys
import datetime
import re
import unittest

serverip = app.config['SERVERIP']

realTimeUrl = "http://%s/get_realtimedata" % serverip
pointList = [
              'Plant001_GroupPower','Plant001_GroupCost','Plant001_GroupCostD',"Plant001_GroupEnergyH","Plant001_GroupEnergyD"
            ]
realTime = "http://%s/get_realtimedata_time" % serverip
#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间


class Smoke026(unittest.TestCase):
    testCaseID = 'Smoke026'
    projectName = "上海印钞厂"
    buzName = 'checkCalcPoint'
    start = 0.0
    error = []


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        a = BeopTools()
        self.error = []
        data = {'proj':194,"pointList":pointList}
        try:
            t = a.postData(url=realTime,data=data,t=10)
        except Exception as e:
            assert 0,"读取%s接口失败!" % realTimeUrl
        if t:
            for p in t.keys():
                updateTime = t[p]
                updateTim_p = time.strptime(updateTime,'%Y-%m-%d %H:%M:%S')
                his_time = time.mktime(updateTim_p)
                cur_time = time.time()
                offTime = ( cur_time - his_time ) / 60
                if offTime > 60.0:
                    self.error.append("错误信息上海印钞厂--%s点在1小时之内没有更新!" % p)
        else:
            print("没有获取到最后更新时间!")

        self.raiseError(self.error)

    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke026('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

